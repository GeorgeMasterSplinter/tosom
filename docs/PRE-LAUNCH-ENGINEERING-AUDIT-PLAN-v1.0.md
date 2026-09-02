# ToSom — PRE-LAUNCH ENGINEERING AUDIT PLAN v1.0

**Dato:** 2026-09-01 · **Status:** PLAN (ingen kode produsert) · **Formål:** Konsolidere sikkerhet, last/yteelse, logging/feilfangst og CI/CD-herding til én presis, kjørbart audit-plan klar for ACT-fasen.

**Faktagrunnlag (kilder i repoet):**
- `middleware.ts`, `config/env.ts`, `next.config.js`, `instrumentation.ts` / `instrumentation-client.ts`
- `lib/auth/csrf.ts`, `lib/auth/adminAuthGuard.ts`, `lib/auth/requireAuth.ts`, `lib/auth/session.ts`, `lib/auth/admin-jwt.ts`
- `lib/api-validator.ts`, `lib/api/handler.ts`, `lib/api/rateLimit.ts`, `lib/rate-limit.ts`, `lib/rate-limit-pg.ts`, `lib/validation/*`
- `lib/logging.ts`, `lib/errorTracker.ts`, `lib/observability/pii.ts`
- `Dockerfile`, `docker-compose.yml`, `docker-compose.test.yml`
- `.github/workflows/ci.yml`, `cd.yml`, `uptime-monitor.yml`
- `prisma/schema.prisma`, `scripts/load/basicLoadTest.ts`
- Eksisterende planer (input, ikke erstattet): `docs/SECURITY-STABILITY-PLAN-v2.0.md` (S-1…S-19), `docs/TOSOM-ACT-INSTRUKS-v3.0.md`, `docs/OBSERVABILITY-PLAN-v1.0.md`

**Regler som gjelder i ACT-fasen (fra `TOSOM-ACT-INSTRUKS-v3.0` §0):**
1. Én fil per patch. `tsc` + `jest` mellom hver. Ett rødt → stopp.
2. Ingen terskeljusteringer under beta.
3. `docs/ACT-STATE.json` oppdateres i samme commit som koden.
4. Koden vinner — rapporter avvik, skjul dem ikke.
5. Språk: **bokmål overalt** — `npm run verify:lang` grønn før push (rød vakt = rød CI = blokkert deploy).

**Felles verifisering for hver ACT-oppgave:**
```
npx tsc --noEmit                    # 0 feil
npx jest --ci --silent              # alle grønne
npx next lint --max-warnings 0
npm run verify:lang                 # ingen nynorsk-treff
```
+ oppdatere `docs/ACT-STATE.json`.

> **Avvik / presisjonskorreksjoner mot oppgaveteksten:**
> - Helse-endepunktet i produksjon er **`/api/system/health`** (og `/api/system/cron-health`), **ikke** `/api/health`. Uptime-monitoren pinger allerede `/api/system/health`. Planen bruker kanonisk bane og anbefaler å **ikke** lage en duplisert `/api/health` (valgfri 301-redirect — se ACT 4.3).
> - **Sentry er allerede installert og koblet** (`@sentry/nextjs` i `package.json`, `instrumentation.ts` + `instrumentation-client.ts`, PII-skrubbing i `lib/observability/pii.ts`). Mangler kun `SENTRY_DSN`-verdien. (Arkiv-diagnosen «ikke installert» er utdatert.)
> - **Pino/Winston krever ny avhengighet** — strider mot «aldri introdusere nye avhengigheter». Planen tilbyr Alternativ A (uten ny dep, anbefalt) og Alternativ B (med dep, krever godkjenning).

## 1. SIKKERHETSREVISJON (SECURITY AUDIT)

Mål: Lukke alt som kan skade en bruker, lekke PII (`DeepProfile`, samtaleinnhold) eller slippe uautorisert tilgang. Prioritering styres av trusselbilde i `SECURITY-STABILITY-PLAN-v2.0` §1 (DeepProfile + `Message` = ekstrem sensitivitet).

### 1.1 API- og backend-sikkerhet

| # | Sjekk | Anker i kode (startpunkt) |
|---|---|---|
| 1.1.1 | **Input-validering (Zod)** — alle write-ruter (POST/PATCH/DELETE) skal kjøre en Zod-skjema før DB-skriv. Kartlegg dekning og finn hull. | `lib/validation/*`, `lib/api-validator.ts` (`validateBody`, `validateQuery`), `lib/api/handler.ts` |
| 1.1.2 | **Sanitization** — ingen `dangerouslySetInnerHTML` med brukerinnhold; e-post-kropp (nodemailer) renderes ikke som raw HTML; free-text i profil/meldinger behandles som data. | `app/**` (søk `dangerouslySetInnerHTML`), `lib/email/index.ts`, `app/api/chat/send`, `app/api/profile/*` |
| 1.1.3 | **SQL-injection (Prisma)** — Prisma parametriserer; risiko er kun `$queryRaw`/`$executeRaw`. Verifiser at alle råspørringer bruker parametre (ikke string-konkatenasjon). | `lib/rate-limit-pg.ts` (tagged-template + args — referanse), grep `$queryRaw`/`$executeRaw` |
| 1.1.4 | **XSS (chat, profil, rapportering)** — React-escaping er default; verifiser at meldingsrendering, profilvisning og rapportetekst aldri injiserer raw HTML; CSP i `next.config.js` som 2. linje. | `app/chat/**`, `app/profile/**`, rapport-rute under `app/api/**`, `next.config.js` §CSP |
| 1.1.5 | **Manglende try/catch i async-ruter** — hver `route.ts` skal fanne alle uncaught exceptions. Konsistens: noen ruter bruker `errorResponse`, andre rå `new Response`/`NextResponse.json` — standardiser. | `app/api/**/route.ts` (grep `catch` vs `export async function`), `lib/api-validator.ts` |
| 1.1.6 | **Admin-ruter (`adminAuthGuard`)** — alle `/api/admin/*` skal bruke én guard (`requireAuth` + `castToAdminUser` / `verifyAdminCookie` + `isAdminRole`), ingen lokale `isAdmin()`-varianter. Bekreft at funn S-4 (`admin/stats`, `admin/journeys` brukte eksistens-sjekk) er lukket. | `lib/auth/adminAuthGuard.ts`, `lib/auth/requireAuth.ts`, `middleware.ts` §admin, `app/api/admin/**` |
| 1.1.7 | **CSRF på kritiske write-ruter** — `lib/auth/csrf.ts` eksisterer, er drevet av `serverFlags.enableCsrfProtection` / `ENABLE_CSRF_PROTECTION` (i dag **AV**) og er kun **delvis** vevd inn (f.eks. `request-reset`). Må aktiveres på de 7 kritiske ruter (profil, settings, chat, report, reset, onboarding) og fikses for den svake fallback-logikken (se risiko S-CSRF). | `lib/auth/csrf.ts` (linje 57–68: «ingen cookie → godta ethvert token 10–256 tegn»), `lib/api/csrfClient.ts` |

**Sjekkliste 1.1:**
- [ ] Kartlegg alle write-ruter og deres Zod-dekning; dokumenter hull i tabell (rute → skjema \| «mangler»).
- [ ] Søk og dokumenter alle `$queryRaw`/`$executeRaw`; bekreft parametrisering.
- [ ] Søk `dangerouslySetInnerHTML`; bekreft ingen brukerinnhold.
- [ ] Audit `catch`-dekning per rute; list ruter uten try/catch.
- [ ] Bekreft at 100 % av `/api/admin/*` bruker den felles guarden.
- [ ] Aktiver CSRF + fikse fallback + verifisere rotation (se patch-strategi S-CSRF).
### 1.2 Autentisering og sesjonssikkerhet

| # | Sjekk | Anker i kode | Nåtilstand (observasjon) |
|---|---|---|---|
| 1.2.1 | **Cookie-sikkerhet (Secure/HttpOnly/SameSite)** | `app/api/admin/auth/route.ts`, `app/api/auth/phone/verify/route.ts`, `app/api/auth/vipps/authorize/route.ts`, `lib/auth/csrf.ts` | `admin_token` (httpOnly, secure@prod, lax, 8t) · `tosom_session` (httpOnly, secure@prod, lax, 24t) · `vipps_state` (httpOnly, secure@prod, strict, 5min) · `csrf_token` (httpOnly, secure@prod, strict, 24t). **Vurder:** skal `tosom_session`/`admin_token` oppgraderes `lax`→`strict`? (tradeoff med UX) |
| 1.2.2 | **Passord-hash og HMAC-signering** | `lib/auth/hash.ts`, `lib/auth/reset.ts`, `lib/auth/admin-jwt.ts`, `app/api/admin/auth/route.ts` | bcrypt (`bcryptjs`) for admin/user; admin-JWT HS256 (`ADMIN_JWT_SECRET`, issuer `tosom-admin`). Bekreft at **ingen** plaintext `!==`-sammenligning ligger igjen (S-2/B-5: `verifyPassword` + timing-safe). |
| 1.2.3 | **Token-håndtering** | `middleware.ts` §`getToken` (secureCookie speiler prod — v5 cookie-name salt), `lib/auth/reset.ts` | NextAuth-JWT-sesjon; reset-token i DB. Verifiser rotation + utløp + at middleware og `lib/auth/config.ts` bruker **samme** secureCookie-verdi (annaks feil salt → brukeren kastes ut). |
| 1.2.4 | **Unngå lekkasje av secrets** | `middleware.ts`, alle route-respons, `lib/observability/pii.ts`, Sentry `beforeSend` | Secrets skal aldri ut i respons/feil/logg/Sentry. Bekreft PII-skrubbing fanger `profile`, `deepProfile`, `message`, `content`, `email`, `phone` (S-16). |

**Sjekkliste 1.2:**
- [ ] Verifiser alle cookies: httpOnly + secure(prod) + sameSite (dokumenter valg lax vs strict per cookie).
- [ ] Bekreft bcrypt overalt; 0 plaintext-passord-sammenligninger.
- [ ] Bekreft `secureCookie` er konsistent mellom `middleware.ts` og `lib/auth/config.ts`.
- [ ] Framkall bevisst feil i staging → verifiser at ingen secret/PII lekker til respons, logg eller Sentry.

### 1.3 Miljøvariabler

**Sjekkliste 1.3:**
- [ ] **Hardkodede nøkler:** grep etter `sk_live`, `sk_test`, `re_`, `AKIA`, `xox`, `Bearer <litt>`, `-----BEGIN` i `app/`, `lib/`, `components/`, `scripts/`.
- [ ] **Lekkasje i repo:** bekreft `.gitignore` dekker `.env`, `.env.local`, `.env.prod`; **merking:** `.env.test` er **tracked** (brukes av CI/Jest) — verifiser at den kun inneholder testverdier, aldri ekte secrets. Sjekk git-historikk (`git log -p -- .env*`) for kommittede secrets.
- [ ] **Alle sensitive verdier i env:** sammenlign `GEORGE.md` §2 (kritiske prod-var) mot `config/env.ts`. **Gap:** `config/env.ts` validerer i dag kun `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `ADMIN_JWT_SECRET`. `CRON_SECRET`, `PUSHER_*`, `R2_*`, `EMAIL_*` er **ikke** i valideringsregistret (se patch-strategi S-ENV).
- [ ] Bekreft at Edge-runtime (middleware) ikke kaller `process.exit` — `config/env.ts`/`instrumentation.ts` må fortsatt kjøre Edge-safe (log-only), kun Node runtime får fail-fast.
### 1.4 Risikoanalyse — Sikkerhet

| ID | Funn / Risiko | Anker | Alvor | Konsekvens | Patch-strategi |
|---|---|---|---|---|---|
| **S-ADMIN** | Admin-eskalering via eksistens-sjekk (S-4) — eventuelle igjenstående lokale `isAdmin()` | `app/api/admin/**` | **KRITISK** | Enhver innlogget leser/administrerer admin-data | Tving `adminAuthGuard`/`verifyAdminCookie`+`isAdminRole` på 100 % av `/api/admin/*`; slett lokale varianter. Én fil per patch. |
| **S-ENV-SECRET** | Ekte admin-passord + `CRON_SECRET` i `.env`, kun `.gitignore` (S-5) | `.env` | **KRITISK** | Full admin-takling + cron-forging ved repo-lekkasje | Flytt til passordhåndterer/secret manager **før** produksjonsdata; **rotér** nøklene; verifiser i `git log`. Ingen kodeendring — prosess. |
| **S-UNAUTH** | `/api/analytics/track` og `/api/system/latency` uautentisert; `latency` lekker rutenavn/yte­lse (S-4/C-9) | `app/api/analytics/track`, `app/api/system/latency`, `middleware.ts` | **HØY** | Data-lekkasje + DoS-flate | Legg i `PROTECTED_API_PREFIXES` og/eller `requireAuth`; rate-limit via `pgCheck`. |
| **S-CSRF** | CSRF skrevet men AV + svak fallback (godtar ethvert token uten cookie) + rotation ikke vevd inn | `lib/auth/csrf.ts:57–68`, `ENABLE_CSRF_PROTECTION=false` | **HØY** | Forgery av write-operasjoner tvers om domener | Fjern fallback («ingen cookie = godta»); kreve gyldig cookie-token; vev inn `csrfCheck` på 7 kritiske ruter; slår `ENABLE_CSRF_PROTECTION=true` som **siste** steg etter e2e-grønt. |
| **S-RATE** | Rate limiting dekker ~12 av ~114 ruter; lesende ruter udekket (S-6) | `lib/rate-limit-pg.ts`, ruter uten `pgCheck` | **HØY** | DoS / scraping av sensitive les-flater | Bruk `pgCheck` (atomisk, fail-open) på alle lesende kritiske ruter; standardiser via `lib/api/handler.ts`. |
| **S-ENV** | `config/env.ts` validerer ikke alle prod-kritiske var | `config/env.ts` | **MEDIUM** | Appen starter «halvdød» med feil PUSHER/R2/EMAIL | Utvid `REQUIRED_VARS`/`OPTIONAL_VARS` med prod-kritisk sett; Node=fail, Edge=log. |
| **S-CSP** | CSP tillater `'unsafe-eval' 'unsafe-inline'`; `img-src` inneholder placeholder-hosts (`picsum.photos`, `placehold.co`) i prod | `next.config.js` §CSP | **MEDIUM** | Forsterket XSS-flate; støy i prod | Stram CSP; fjern placeholder-hosts; beholde Pusher/Sentry/UploadThing/R2. |
| **S-DEV** | Dev-ruter (`/api/dev/*`, `/api/auth/test-login`) må dø i prod uavhengig av flagg (S-3) | `app/api/dev/**`, `app/api/auth/test-login` | **MEDIUM** | Uautorisert bruker-opprett i prod | `NODE_ENV==='production'` → 404 først, uavhengig av `DEV_LOGIN_ENABLED`. |
| **S-COOKIE** | `sameSite:lax` på sesjon/admin (svakt for cross-site form-angrep) | cookies (1.2.1) | **LAV** | Begrenset CSRF-ytelse (dekkes delvis av SameSite) | Vurder `strict` der UX tillater; ellers dokumenter aksept. |

### 1.5 ACT-oppgaver — Sikkerhet

**ACT 1.1 · Full sikkerhetskartlegging** — **8 timer**
- Kartlegge alle punktene i 1.1/1.2/1.3 til et funnregister (ID, anker, alvor, bevis).
- Levere: tabell som 1.4, utvida med konkrete rute-/filreferanser og grep-bevis. Ingen kodeendringer — kun kartlegging + dokumentasjon.
- **DoD:** funnregister godkjent; alle «KRITISK/HØY» har navngitt patch-strategi; `ACT-STATE.json` oppdatert.

**ACT 1.2 · Patch av funn (løpende)** — løpende, prioriteringsrekkefølge
- Rekkefølge: **KRITISK** (S-ADMIN, S-ENV-SECRET) → **HØY** (S-UNAUTH, S-CSRF, S-RATE) → **MEDIUM** (S-ENV, S-CSP, S-DEV) → **LAV** (S-COOKIE).
- Én fil per patch; `tsc`+`jest` mellom hver; språkvakt grønn før push. CSRF-slå-av/på som **siste** steg (etter e2e-grønt).
---

## 2. LAST- OG YTELSESTESTING (LOAD TESTING)

**Nåtilstand:** `scripts/load/basicLoadTest.ts` (tsx) — 5 endepunkter, dummy-tokens, faste batcher, terskel `error<5 %` & `p95<5000 ms`. Delvis utdaterte baner (f.eks. `/api/messages/list`, `/api/ai/message-suggestions`). Ingen ramp, ingen write-scenarier, ingen Pusher/DB-lock-observasjon.

### 2.1 Lasttest-strategi
- **Verktøyvalg:** **k6** (anbefalt — kjører standalone, ingen native app-abhengighet, enkle trinn/ramper, CI-vennlig). Alternativ: **Artillery** (YAML). Begge er **dev-økonomisk**, ikke app-avhengighet — strider ikke mot «ingen nye avhengigheter» i produktkoden.
- **Lastnivå:** ramp til **100 → 500 → 1000** samtidige brukere (VU), hvert nivå stabilisert (f.eks. 2–3 min), deretter ned.
- **Scenarier (mappe mot reelle ruter):**

  | Scenarie | Reelle baner | Type |
  |---|---|---|
  | Login | `app/api/auth/phone/send`, `.../verify` (eller magic-link) | Write + rate-limited |
  | Onboarding | `app/api/onboarding/*`, `app/api/profile/setup` | Write |
  | Matching (read-side) | waiting-room / kø-status-ruter | Read (runden selv er cron — se merknad) |
  | Journey-dag | `app/api/journey/*` (step + reflect/advance) | Read+Write |
  | Chat | `app/api/chat/send`, `.../messages`, `.../typing`, `.../mood` | Write + Pusher-event |
  | Rapportering | rapport-rute under `app/api/**` | Write |
  | Dashboard | `app/api/dashboard/overview` | Read (dobbeltkall = flaskehals, se 2.3) |

- **Merknad om matching/journey:** begge kjører som **cron** (`/api/cron/matching` lørdag, `/api/cron/journey` med `JOURNEY_BATCH_SIZE=300`). Disse skal **ikke** slås med 1000 VU i prod-like. Test les-siden under last + én kontrollert **dry-run** av runden (advisory lock gjør rekjøring trygg) for cron-stien.

### 2.2 Metrikker
- [ ] **Latens:** p50 / p90 / p95 / p99 / worst per scenario.
- [ ] **Throughput:** RPS, VU-stabil, feilpersekund.
- [ ] **Error rate:** global + per-endepunkt (mål: < 1 % i 1000-VU for les; < 5 % write som referanse fra eksisterende skript).
- [ ] **DB-låsing:** Neon slow-query log + `admin/system/realtime`; advisory lock-bruk i matching; `P2022`/timeout-treff i logg.
- [ ] **Pusher-event load:** `new-message`/`typing`/`mood`-triggers pr. min, kanal `private-conversation-${conversationId}`, Pusher-kvoter/forbindelser (cluster `eu`).

### 2.3 Flaskehalser (bekjente fra kodebasen)
| # | Flaskehals | Bevis |
|---|---|---|
| F-1 | **Prisma-spørringer uten kritiske indekser** — `Message`, `Match`, `Notification` | `prisma/schema.prisma`; planlagt `@@index` (ACT 4.4 i `TOSOM-ACT-INSTRUKS`-arkiv) ikke bekreftet applied |
| F-2 | **Dobbeltkall til `/api/dashboard/overview`** — både `DashboardProvider` og `page.tsx` (R-3) | `app/dashboard/**` |
| F-3 | **Tunge API-ruter** — matcherunde ~11 s / 5000 kandidater (cron); `EXPLAIN` for chat-historikk | `app/api/cron/matching/route.ts`, GEORGE §7 |
| F-4 | **Cron-jobber som kan kvele DB** — journey batch 300 + matching samtidige skriver | `/api/cron/journey`, `/api/cron/matching` |
| F-5 | **CSP/placeholder + `compress`** — trivielt, men `img-src` med eksterne hosts kan legge til latens | `next.config.js` |

### 2.4 Patch-strategi
- **Indekser (DB):** legg kritiske indekser + migrasjon (kun indekser, ingen feltendringer):
  - `Message`: `@@index([conversationId, createdAt])`
  - `Match`: `@@index([userAId, status])` + `@@index([userBId, status])`
  - `Notification`: `@@index([userId, readAt, createdAt])`
  - Verifiser: `EXPLAIN ANALYZE ... ORDER BY "createdAt" DESC LIMIT 50;` → **Index Scan**, ikke Seq Scan.
- **Optimalisering av ruter:** fjern dobbeltkall (R-3); paginering på lister; `Promise.all` for uavhengige Prisma-kall; unngå N+1 (bruk `include`/`select` bevisst, `conversation.journeyStep`/`journeyProgress` — ikke `journey.*`).
- **Caching der relevant:** Upstash Redis (`@upstash/ratelimit`/`@upstash/redis` allerede i deps) for varme les-cache (dashboard-overview, spørsmålkatalog); aldri cache PII/reaksjonssensitivt innhold.
- **Cron-isolering:** sørg for cron-kjøringer ikke overlapper brukerstøt; advisory lock + tidsbudsjett med varsling (S-17) ved overtid.

### 2.5 ACT-oppgaver — Last/yteelse

**ACT 2.1 · Generer lasttest-skript** — **3 timer**
- Skriv k6-skript(i) under `scripts/load/k6/` med scenarioene i 2.1 + ramp 100/500/1000 + thresholds (latens, error, RPS). Ingen endring i produktkode.
- **DoD:** skript kjører mot staging/localhost; producerer rapport; `verify:lang` grønn (kommentarer bokmål).

**ACT 2.2 · Kjør lasttest og analyser** — **4 timer**
- Kjør mot staging med reelle tokens; måle metrikker i 2.2; identifisere topp-3 flaskehals; lever analyse + forslag (indeks/optimalisering/cache) med `EXPLAIN`-bevis.
- **DoD:** rapport med p95/error/RPS per nivå; topp-3 flaskehals navngitt; patch-forslag klar for godkjenning.
---

## 3. LOGGING OG FEILHÅNDTERING (ERROR CATCHING)

### 3.1 Logging-arkitektur
**Målarkitektur:**
```
[Backend route / cron]          [Frontend React]
        │                              │
        ▼                              ▼
  lib/api/handler +             global-error.tsx +
  lib/errorTracker +            ErrorBoundaries (per route)
  lib/logging (JSON-stdout)
        │
        ▼
  instrumentation.ts onRequestError (Sentry.captureRequestError)
        │
        ├──► Sentry (kritiske/programmeringsfeil)  [DSN mangler i dag]
        ├──► lib/logging → stdout (Vercel fanger) + SystemLog (DB, operasjonelt)
        └──► (valgfritt) lokal fil / log-shipper
```
**Verktøyvalg:**
- **Alternativ A (anbefalt, ingen ny dep):** behold `lib/logging.ts` (strukturert JSON i prod) til stdout (Vercel fanger stdout) + `lib/errorTracker.ts` (SystemLog) for operasjonelt + **Sentry** for feil/exceptions. Styrer med `onRequestError` (allerede til stede) som «global» fanne.
- **Alternativ B (krever godkjenning — ny avhengighet):** legg til **Pino** (strømme, nivåer, lokal fil + stdout). Fordel: raskt JSON + nivåer + fil. Ulempe: bryter «ingen nye avhengigheter»; krever eksplisitt okk i ACT.

### 3.2 Feiltyper
| Type | Eksempler | Behandling |
|---|---|---|
| **Operasjonelle** (forventet, ikke-feil) | 404, rate-limit (429), kvote-tak, DB-transient (`P2022`), manglende validering (400) | Logg WARN/INFO + `SystemLog`; **ikke** Sentry-alert; brukervendt bokmål-feil |
| **Programmeringsfeil** (unntatt) | Uncaught exception, typefeil, null-deref, 5xx | `trackError` + `Sentry.captureException`; generisk feil til bruker; operatørvarelsling |

### 3.3 Sjekkliste
- [ ] **Tomme catch-blokker** — grep `catch {}` / `catch (e) {}`. Funnet i dag: `app/chat/error.tsx` (linje 4, `catch {}` i `useEffect`).
- [ ] **Manglende try/catch** — audit alle `route.ts` (kryssreferanse 1.1.5).
- [ ] **Standardisert backend-feilformat** — all rute bruker `errorResponse`/`successResponse` (fra `lib/api-validator`) eller `lib/api/handler`; eliminere rå `new Response`/`NextResponse.json`-varianter i error-sti.
- [ ] **Frontend ErrorBoundaries** — eksisterer i dag: `app/global-error.tsx`, `app/not-found.tsx`, `app/{chat,settings,dashboard,onboarding,profile,matching}/error.tsx`. Verifiser at alle brukervendte ruter er dekket og at boundary-ene kaller `Sentry.captureException`.

### 3.4 Patch-strategi
- **Standardiser feilhåndtering:** én sti — `lib/api/handler` (IP→rateLimit→auth→RBAC→schema→handler) + `trackError` i catch. Målkort: samme respons-form, samme logging, samme Sentry-hook for alle ruter.
- **Integrer Sentry:** sett `SENTRY_DSN` (+ `NEXT_PUBLIC_SENTRY_DSN`); verifiser PII-skrubbing (S-16) med framkalt feil i staging; verifiser `onRequestError` fanger uncaught i route handlers + server components; verifiser `global-error.tsx` + alle boundaries sender til Sentry.
- **Global error-fangst:** `instrumentation.ts` `onRequestError` = server-side fangst; `global-error.tsx` = client-side fangst. Fyll hullet der uncaught exceptions i async-ruter i dag faller utenom `trackError` (via standardiseringen i 3.4).
- **Feilformat:** `{ success, data?, error?, code? }` konsekvent; `code` for maskinlesbar feil (f.eks. `RATE_LIMITED`, `CSRF_INVALID`, `VALIDATION_ERROR`).

### 3.5 ACT-oppgaver — Logging & feilfangst

**ACT 3.1 · Kartlegg manglende feilfangst** — **4 timer**
- Grep + audit: tomme catches, ruter uten try/catch, ustandard respons-form, boundaries mangler Sentry-kall. Lever funnregister (fil+linje).
- **DoD:** full liste med fil/linje; klassifisert (operasjonell vs programmeringsfeil); `ACT-STATE.json` oppdatert.

**ACT 3.2 · Integrer Sentry + ErrorBoundaries** — **3 timer**
- Sett DSN; verifiser PII-skrubbing; verifiser `onRequestError`; tilpass/standardiser error-respons via `lib/api/handler`; sikr at alle boundaries + `global-error` sender til Sentry. (Velg Alternativ A medmindre B er godkjent.)
- **DoD:** framkalt 5xx i staging → synlig i Sentry **uten** PII; all rute-feil via én formatert sti; `tsc`/`jest`/`verify:lang` grønt.
---

## 4. CI/CD OG DEPLOYMENT-HERDING

### 4.1 CI/CD-struktur (mål vs nå)
**Mål (oppgaven):** `[Git Push/PR] → Lint → tsc → Jest → Docker Build Test → Deploy`

**Nå (faktisk):**
```
ci.yml:  Lint → TypeCheck → Build → Unit Tests (Jest+pg16)
         → E2E (Playwright) + vakter: prisma, prisma-singleton,
           ai-guard, lang-guard, cron-guard, concept-guard
         → status (gate: alt må være success)
cd.yml:  (kun etter grønn CI på main)
         Deploy to Vercel (workflow_run gate + deploy-gate)
         → Build & Push Docker (Docker Hub + GHCR, multi-arch)
         → Post-Deploy Health Check (curl /api/system/health)
uptime-monitor.yml: ping /api/system/health hver 5. min, 3 retries,
         Resend-alert (krever GitHub-secrets RESEND_API_KEY + ALERT_EMAIL_TO)
```
**Gap mot mål:** ingen **egen «Docker Build Test»-jobb i CI** (Docker bygges/pushes kun i CD). E2E rapporteres som rød i dag (C-6).

### 4.2 Risikoanalyse — CI/CD
| # | Risiko | Bevis/anmerkn | Alvor |
|---|---|---|---|
| C-1 | **Manglende env-var i prod** starter halvdød | `config/env.ts` validerer kun 4 var (se S-ENV) | **HØY** |
| C-2 | **DB-migrasjoner som låser tabeller** | store `ALTER` på `Message`/`Notification`; matching bruker advisory lock | **HØY** |
| C-3 | **Språkvakt stopper deploy** | `lang-guard` i `ci.yml` — by design, men operatøren må vite årsaken | **MEDIUM** |
| C-4 | **Uptime-monitor ikke aktivert** | krever GitHub-secrets `RESEND_API_KEY`+`ALERT_EMAIL_TO`; schedule kan være deaktivert på fork | **MEDIUM** |
| C-5 | **Token-feil i CD (sekundær pipeline)** | `VERCEL_TOKEN`/`ORG_ID`/`PROJECT_ID` secrets; `vercel.json` query-secret-check finnes i CI | **MEDIUM** |
| C-6 | **E2E rød i CI** | Playwright-suiten feiler i dag (C-6 i `TOSOM-ACT-INSTRUKS`) | **MEDIUM** |

### 4.3 Sjekkliste — CI/CD
- [ ] **CI feiler ved lint/tsc/jest-feil** — `status`-jobben i `ci.yml` gater alt; verifiser at hver jobb faktisk er i `needs` og at `if: always()` + exit 1 fungerer.
- [ ] **Uptime-monitor mot helse-endepunkt** — pinger i dag `/api/system/health` (korrekt). Bekreft secrets satt + schedule aktiv. (Ikke opprett ny `/api/health` — se ACT 4.3.)
- [ ] **Miljøvariabel-validering ved oppstart** — `config/env.ts` + `instrumentation.ts`; utvide til prod-kritisk sett (Node=fail, Edge=log).
- [ ] **Docker multi-stage builds** — `Dockerfile` er multi-stage (base/deps/builder/runner). ✅
- [ ] **Non-root user** — `Dockerfile` kjører som `nodejs` (uid 1001). ✅
- [ ] **Docker Build Test i CI** — **mangler**; legg en jobb som bygger bildet uten push (se ACT 4.1).
- [ ] **`.dockerignore`** — verifiser eksisterer (holder `node_modules`, `.next`, `.env*` ute av build-eksempel).
- [ ] **Standalone output** — `Dockerfile` kopia `node_modules` + `.next` (ikke `output:'standalone'`); vurder for mindre/skjarpere bilde (valgfritt).

### 4.4 Patch-strategi — CI/CD
- **Oppdater workflows:** legg «Docker Build Test»-jobb i `ci.yml` (bygges, pushes ikke); legg env-validerings-steg som kjører `validateEnv` mot en fixture; gjenopprett E2E-grønt (C-6).
- **Docker:** behold multi-stage + non-root; legg `HEALTHCHECK` mot `/api/system/health`; legg `.dockerignore`; vurdér `standalone`. `docker-compose.yml`/`docker-compose.test.yml` beholdes for lokal test.
- **Oppstartsvalidering av env:** utvid `config/env.ts` (REQUIRED/OPTIONAL) med prod-kritisk sett; Node-runtime `process.exit(1)`, Edge-runtime log-only (verken må bryte middleware).
- **Herde CD til verifiserings-pipeline:** behold `workflow_run`-gate (A3) + `deploy-gate`; legg **migrasjonsgate** før deploy (`npx prisma migrate status` mot Vercel-DB → må være alle applied); post-deploy health (allerede til stede) skal **feile** (ikke kun «pending») ved feil etter stabilisering.

### 4.5 ACT-oppgaver — CI/CD & Deployment

**ACT 4.1 · Oppdater GitHub Actions** — **3 timer**
- Legg «Docker Build Test» + env-validerings-steg i `ci.yml`; verifiser `status`-gate; (separat) plan for E2E-grønt (C-6). Kun workflow-filer — ingen produktkode.
- **DoD:** ny CI-kjøring grønn med de to nye jobbene; `verify:lang` grønn.

**ACT 4.2 · Docker + env-validering** — **3 timer**
- Harder `Dockerfile` (HEALTHCHECK, `.dockerignore`, vurdér standalone); utvid `config/env.ts` med prod-kritisk sett (Node fail / Edge log); verifiser `instrumentation.ts` Edge-safe.
- **DoD:** `docker build` grønn + `docker run` starter; manglende prod-var gir feil i Node-runtime og log i Edge; `tsc`/`jest` grønt.

**ACT 4.3 · `/api/health` + uptime-monitor** — **1.5 timer**
- Bekreft kanonisk helsebane `/api/system/health`; (valgfritt) legg 301 `/api/health`→`/api/system/health` om navnet kreves; verifiser uptime-monitor: secrets satt (`RESEND_API_KEY`, `ALERT_EMAIL_TO`), schedule aktiv, alert sendt ved nedetid. Legg migrasjonsgate i CD.
- **DoD:** simulert nedetid → alert-e-post mottatt; migrasjonsgate feiler deploy ved manglende migrasjon; `verify:lang` grønn.
---

## 5. REVISJONS- OG TIDSBRUKS-OPPSUMMERING

### 5.1 Total tidsbruk
| Område | ACT-oppgaver | Timer |
|---|---|---|
| **Sikkerhetsrevisjon** | ACT 1.1 (kartlegging) + ACT 1.2 (patch, løpende) | **8** |
| **Lasttesting** | ACT 2.1 (3) + ACT 2.2 (4) | **7** |
| **Logging & feilfangst** | ACT 3.1 (4) + ACT 3.2 (3) | **7** |
| **CI/CD & deployment** | ACT 4.1 (3) + ACT 4.2 (3) + ACT 4.3 (1.5) | **7.5** |
| **Totalt** | | **29.5 timer (≈ 3–4 dager)** |

> Merknad: ACT 1.2 (sikkerhetspatch) er «løpende» og estimert innenfor de 8 timene; hvis KRITISK-funn (S-ADMIN/S-ENV-SECRET) krever eksterne prosesser (rotasjon, secret manager) kan det legge på kalender-dager selv om agent-arbeidet er kort.

### 5.2 Kritiske avhengigheter (må være på plass før/under ACT)
| # | Avhengighet | Hvem | Brukes i |
|---|---|---|---|
| 1 | **Database-tilgang** (staging + `prisma migrate status` mot Vercel-DB) | George | 1.x, 2.2, 4.3 (migrasjonsgate) |
| 2 | **Sentry DSN** (`SENTRY_DSN` + `NEXT_PUBLIC_SENTRY_DSN`) | George | 3.2 |
| 3 | **Uptime-monitor API-nøkkel** (GitHub-secrets `RESEND_API_KEY` + `ALERT_EMAIL_TO`) | George | 4.3 |
| 4 | **Prod-env-vars fra Vercel** (CRON_SECRET, PUSHER_*, R2_*, EMAIL_*, ADMIN_*) | George | 1.3, 4.2 |
| 5 | **Staging-miljø + test-tokens** (user + admin) for lasttest | George | 2.2 |
| 6 | **Godkjenning for Alternativ B** (Pino) hvis valgt | George | 3.x |

---

## Leveranseformat — sjekk at dette dokumentet oppfyller
- [x] Komplett (alle 5 hovedseksjoner + underses­joner 1.1–5.2)
- [x] Nummerert
- [x] Med sjekklister (1.1, 1.2, 1.3, 2.2, 3.3, 4.3)
- [x] Med risikoanalyse (1.4, 2.3, 4.2)
- [x] Med patch-strategier (1.4, 2.4, 3.4, 4.4)
- [x] Med ACT-oppgaver (1.5, 2.5, 3.5, 4.5)
- [x] Med estimert tidsbruk (per oppgave + 5.1 total)
- [x] Uten kode (kun filreferanser, grep-ankre og verifiseringskommandoer — ingen patch-kode)

---

## Neste steg
Dokumentet er levert som **PLAN** (ingen kode produsert). For å gå videre:
1. Starte **ACT 1.1** (sikkerhetskartlegging, 8 t) som første eksekverbar oppgave.
2. Avgjøre logging: **Alternativ A** (ingen ny avhengighet, anbefalt) vs **Alternativ B** (Pino — krever godkjenning).

> *Hver patch berører noe som betyr noe for noen. Jobb rolig. Jobb presist.*
---