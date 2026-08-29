# GEORGE.md — ToSom i åpen beta: deploy-guide og daglig oversikt

For George. Alt du skal gjøre manuelt står her. Alt annet er allerede i koden.
*Opprettet 24.08.2026. Sist oppdatert 29.08.2026 (produksjonssjekk + R-1 + MASTERPLAN v3.0). Koden vinner alltid — finner du avvik, noter det her.*

---

## 0. Status i dag

- **Produksjonssjekk 29.08 ~20:48 UTC (eksterne sonder mot www.tosom.no):**
  - 🟢 **Opp og kjører:** `tosom.no` → `www.tosom.no` (Vercel, `environment: production`, HTTP 200); landing laster (ikke `/maintenance` → `MAINTENANCE_MODE` er av); `/login` og `/admin/login` svarer 200.
  - 🟢 **Database:** `DATABASE_URL` koblet (175 ms) — via den offentlige helsesjekk-en.
  - 🟢 **Auth:** secret (60 tegn) + URL i orden, `trustHost: true`.
  - 🟢 **Cron:** journey-cronen kjører — siste kjøring var 1 sekund gammel ved sonderen (Vercel cron + `CRON_SECRET` fungerer).
  - 🟢 **Sikkerhetsport 28.08 er i produksjon** (`/api/system/latency` → 401).
  - 🔴 **Pusher mangler helt** (`PUSHER_APP_ID` ikke satt) — **realtime-chat leverer ikke meldinger** uten den. Høyeste prioritet før testere får matche (se steg 4).
  - 🟡 **R2 er ikke verifiserbart fra ut** (helsesjekk-en sjekker ikke R2) — uten R2-nøkler lagres bilder lokalt og **forsvinner ved hver deploy**. Bekreft at steg 3 faktisk er satt i Vercel.
  - 🟡 **OpenAI mangler** (`OPENAI_API_KEY`) — AI-funksjonene (match-insights, journey-kontekst) kjører på fallback-verdier. Akseptabelt i beta.
  - ℹ️ **Vipps mangler = som forventet** (fase 2, `PAYMENTS_ENABLED=false`).
  - **Rask sjekk når som helst:** `curl -s https://www.tosom.no/api/system/health` → `ok`/200 = alt grønt · `degraded`/503 = manglende miljøvariabler (se `services`) · `error` = database nede.
- **Åpen beta er slik det fungerer allerede.** Én dør: `/login` — e-post og passord, kontoen opprettes automatisk. Ingen invitasjoner, ingen koder, ingen e-postverifisering. (Dette er BETA-TEST §3.)
- **Lanseringsvurdering 28.08: 86/100** (se `docs/TOSOM-MASTERPLAN-v3.0.md`) — åpen beta: 🟢 GO. Helse: `tsc` 0 · `jest` 366/367 · lint 0 · build EXIT=0 · 6/6 CI-vakter · E2E grønn (110 tester, 0 fixme).
- **Levert siden forrige guide (28–29.08, alt verifisert i kode):**
  - **E2E-rotfiks:** dev-login hadde aldri fungert (307 pekte mot annen origin) — alle tester kjører nå innlogget. Playwright-installasjonen i CI manglet firefox/webkit — nå installert.
  - **R-1 (29.08):** de 8 `test.fixme()`-testene i onboarding er nå fungerende tester mot `data-testid` (48 testid-er). Full-flow-testen fyller alle 13 stegene og fullfører onboarding. Fant og rettet én til produkt-bug undervegs: prefill kunne overskrive input skrevet i de første ~300 ms av en redigeringsøkt.
  - **Sikkerhetsport:** `/api/analytics/track` (var helt åpen) og `/api/system/latency` (lekket API-landkart) er sikret.
  - **Chat:** kilde-etiketter («💎 Bli kjent» / «📋 Oppgave»), delt mood mellom begge parter, optimistisk send, responsiv layout.
  - **Onboarding:** to sanne draft-bugger rettet (autosave-race + prefill som slo over lokal draft — verdier forsvant ved reload).
  - **Rydding:** 5 294 linjer dødkode fjernet (dødt dashbord-lag, duplikatmoduler). 322 nynorsk-treff fjernet; språkvakta er nå reell (case-insensitiv, 60+ ord, samme skript i CI og lokalt) med pre-push-krok.
- **Ingen endringer i konseptet** — samme reise, samme matcher, samme kvote, samme invarianter.

---

## 1. Gjør dette, i denne rekkefølgen

### Steg 1 — Koden er pusket (agenten har gjort dette) ✅
- [x] **Verifisert 29.08:** `origin/main` er på `389e84d` (R-1-bølgen). Kontroll: `git fetch && git --no-pager log --oneline origin/main -3`

### Steg 1b — Lokale verktøy (én gang, kun på din maskin) ✅
- [x] **Kroken kjører (verifisert 29.08):** `bash scripts/install-hooks.sh` — pre-push-kroken kjørte språkvakta ved dagens push (samme ordliste som CI-vakten).
- [x] Kjenner kommandoen: `npm run verify` = språkvakt + `tsc` + `jest` i én kjede (kjør før push).

### Steg 2 — Neon-database (Frankfurt)
- [x] **Database koblet i produksjon** (verifisert 29.08 via health: connected, 175 ms)
- [ ] Lag prosjekt på [neon.tech](https://neon.tech) i region **eu-central (Frankfurt)** *(hvis ikke allerede gjort)*
- [ ] Kopier **pooled**-URL-en (den med `pooler`, port 5432) → dette blir `DATABASE_URL`
- [ ] Kjør migrasjoner mot databasen:
  ```bash
  DATABASE_URL="..." npx prisma migrate deploy
  ```
  (25 migrasjoner. Skal kjøre uten feil.)
- [ ] **`migrate status` viser 25/25** mot nøyaktig samme DB som Vercels `DATABASE_URL`.

  > **Oppdatert 29.08:** to nye migrasjoner siden forrige deploy —
  > `add_journey_next_day_index` (25.08, indekserer timevis journey-cron) og
  > `add_message_source` (28.08, kilde-etikett på chat-bobler). **Kjør
  > `migrate deploy` igjen** og verifiser at `migrate status` viser 25/25
  > mot nøyaktig samme DB som Vercels `DATABASE_URL`.

  > **AVVIK notert 25.08:** `DATABASE_URL` i `.env.prod` peker på en `db.prisma.io`-DB,
  > ikke en Neon-Frankfurt-DB. Det var den `db.prisma.io`-DB-en som manglet
  > `add_onboarding_draft` + `free_quota_counter` (årsak til 500 i onboarding-lagring) —
  > nå deployet og verifisert. **Før neste migrasjon: verifiser at Vercel sin
  > `DATABASE_URL` er den samme DB-en du kjører `migrate deploy` mot.**

### Steg 3 — Cloudflare R2 (bilde-lagring) ⚠️ ikke verifisert
- [ ] Lag R2-bucket **tosom-images** (EU, f.eks. eu-central-1)
- [ ] Lag API-token med «Object Read/Write» på bucketen
- [ ] Noter: `R2_ACCOUNT_ID` (Cloudflare → Overview), access key id/secret fra tokenet

> **Hvorfor R2?** Uten R2-nøkler faller bilde-lagringen til lokale filer — på Vercel forsvinner de da ved hver nye deploy. Reisen er 30 dager og bilder deles fra dag 15, så R2 er ett krav, ikke et valg.

> **Sjekk 29.08:** health-endpoenket rapporterer ikke R2, så dette kan ikke verifiseres fra ut. Bekreft at `STORAGE_DRIVER` + `R2_*`-variablene faktisk står i Vercel. (Helsesjekkens «uploadthing: missing» er irrelevant — appen bruker R2 via `lib/storage`, ikke UploadThing.)

### Steg 4 — Pusher (realtime-chat) 🔴 mangler i produksjon
- [x] **Verifisert 29.08 at den mangler:** health viser `pusher: missing` (`PUSHER_APP_ID` ikke satt) — **chat leverer ikke i sanntid** uten den.
- [ ] Verifiser at Pusher-appen ligger i **EU-cluster** (`eu`)
- [ ] Noter: app id, key, secret, cluster
- [ ] Sett `PUSHER_APP_ID` / `PUSHER_KEY` / `PUSHER_SECRET` / `PUSHER_CLUSTER` + `NEXT_PUBLIC_PUSHER_KEY` / `NEXT_PUBLIC_PUSHER_CLUSTER` i Vercel → redeploy → health skal vise `pusher: configured`

### Steg 5 — Resend (e-post)
- [ ] Resend API-nøkkel (`re_...`)
- [ ] Domenet `tosom.no` må være verifisert i Resend (DNS)
- [ ] Avsender: **noreplay@tosom.no**

### Steg 6 — E-post-viderekobling (10 minutt)
- [ ] `support@tosom.no` → viderekoble til din private e-post (alle tilbakemeldinger lander her)
- [ ] `noreplay@tosom.no` → autosvar («Tosom er i åpen test. Takk for tilbakemeldingen!»)

### Steg 7 — Vercel
- [x] **Verifisert 29.08:** prosjektet kjører i `production` på `tosom.no`/`www.tosom.no`; landing, `/login`, `/admin/login` og API-et svarer.
- [x] **Verifisert 29.08:** domenet `tosom.no` er koblet (307 → `www.tosom.no`).
- [ ] **Bekreft at siste deploy er `389e84d`** (28.08-build er bekreftet i produksjon; 29.08-bølgen bør være auto-deployet — Vercel → Deployments)
- [ ] Sett miljøvariablene i seksjon 2 (Production) — 🔴 Pusher mangler, se §2

### Steg 8 — Verifiser (sju kontrollpunkter)
1. [x] **Verifisert 29.08:** `tosom.no` → landingsiden laster (ikke `/maintenance`)
2. [ ] `/login` → ny e-post + passord → havner i onboarding (auto-registreringen fungerer)
3. [ ] `/admin/login` → panelet åpner; kvoten viser **`0 / 5 000`**
4. [x] **Delvis verifisert 29.08:** journey-cronen kjører (siste kjøring 1 s gammel). Bekreft begge jobbene i Vercel → **Cron**: `journey` (timevis) og `matching` (lørdag 02:00, 03:00 og 04:00 — tre kjøringer)
5. [ ] Vercel → Logs: ingen 5xx ved testene over
6. [ ] Lag **partall** testbrukere (min. 2), fullfør onboarding, still dem i kø, så: `/admin/tools` → «Kjør matching manuelt» → paret får match
7. [ ] E-post: driftsvarslet til `ALERT_EMAIL_TO` kommer fram

### Steg 9 — Slipp inn testere
- [ ] Først **10**, ikke 50 (DRIFTSPLAN: én uke observasjon før utvidelse)
- [ ] Deretter opp mot **50** — taket ditt er mykt: du bare forteller 50 mennesker
- [ ] Min. 2 i kø per runde; **partall** gir beste dekningsgrad

**Live mood-diagnose (første testere, ~3 minutt):**
Kodekontrakten for delt stemning er verifisert i test (`chat-mood-shared`). Dette beviser den i produksjon:
1. To testere, to nettlesere, i samtale med hverandre.
2. A bytter mood i MoodsPanel-panelet.
3. B skal se fargene bytte seg **innen ~3 sekunder** (polling).
4. Kontroll: i B si Network-tabell — responsen fra `GET /api/chat/messages` skal inneholde `mood`-feltet.
5. Synkroniserer det fortsatt ikke: det er polling/nettverksnivå, ikke logikk — sjekk at B har et ferskt bundle (hard reload).

---

## 2. Miljøvariabler i Vercel (Production)

### Påkrevd
| Variabel | Verdi | Status 29.08 |
|---|---|---|
| `DATABASE_URL` | Neon **pooled**-URL | ✅ koblet (175 ms) |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` | ✅ satt (60 tegn) |
| `NEXTAUTH_URL` | `https://tosom.no` | ✅ OK |
| `CRON_SECRET` | `openssl rand -base64 32` | ✅ cronen kjører |
| `ADMIN_EMAIL` | din e-post | ❓ |
| `ADMIN_PASSWORD_HASH` | scrypt-hash av passordet — generer: `node scripts/generate-admin-hash.mjs "<passord>"` | ❓ (bekreft i 8.3) |
| `ADMIN_JWT_SECRET` | `openssl rand -base64 32` | ❓ |
| `EMAIL_SERVER_HOST` | `smtp.resend.com` | ❓ |
| `EMAIL_SERVER_PORT` | `587` | ❓ |
| `EMAIL_SERVER_USER` | `resend` | ❓ |
| `EMAIL_SERVER_PASSWORD` | `re_...` | ❓ |
| `EMAIL_FROM` | `noreplay@tosom.no` | ❓ |
| `ALERT_EMAIL_TO` | din e-post (driftsvarsler) | ❓ |
| `PUSHER_APP_ID` / `PUSHER_KEY` / `PUSHER_SECRET` / `PUSHER_CLUSTER` | fra Pusher (`eu`) | 🔴 **mangler (verifisert)** |
| `NEXT_PUBLIC_PUSHER_KEY` / `NEXT_PUBLIC_PUSHER_CLUSTER` | same key/cluster | 🔴 |
| `STORAGE_DRIVER` | `r2` | ⚠️ bekreft |
| `R2_ACCOUNT_ID` / `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` / `R2_BUCKET` / `R2_REGION` | fra steg 3 (`tosom-images`) | ⚠️ bekreft |
| `BETA_INVITE_MODE` | `false` | |
| `JOURNEY_BATCH_SIZE` | `300` | |

> **Verifisert 29.08 via health:** `DATABASE_URL` (koblet, 175 ms) · auth-secret (60 tegn) · `NEXTAUTH_URL`/`VERCEL_URL` (OK) · `CRON_SECRET` (cronen kjører). **Bekreftet mangler:** `PUSHER_APP_ID`, `OPENAI_API_KEY` (AI kjører på fallback). **Ikke verifiserbart fra ut:** R2, e-post, admin.

### Eksplisitt av
| Variabel | Verdi | Hvorfor |
|---|---|---|
| `MAINTENANCE_MODE` | (ikke satt / `false`) | På → alt redirecter til `/maintenance`. Det er nødbremsen din. |
| `DEV_LOGIN_ENABLED` | `false` | Må aldri være på i produksjon. |
| `PAYMENTS_ENABLED` | `false` | `true` gir **fatal feil ved oppstart** (A15) før Vipps er bygd. |
| `BETA_MATCH_EMAIL` | (ikke satt) | Av i den **første** matcherunden — så vi måler hvor mange som oppdager matchen selv (I-4-data). Sett `true` etter første runde. |

### Valgfritt (anbefalt)
| Variabel | Verdi | Hvorfor |
|---|---|---|
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | fra Upstash | Distribuert rate-limiting (uten: in-memory per instance — riker for 50 brukere) |
| `NEXT_PUBLIC_SENTRY_DSN` | fra Sentry | Feilovervåking |
| `LOG_LEVEL` | `info` | |

**Ikke sett:** `MATCHING_ENABLED` — standard er `true` (matchingen kjører).

---

## 3. Kill switches (kjører uten ny kode — krever bare redeploy av Vercel)

| Variabel | Effekt |
|---|---|
| `MAINTENANCE_MODE=true` | **Nødbremse:** hele appen → `/maintenance`. Bruk ved rødt. |
| `MATCHING_ENABLED=false` | Stanser matcherundene (køen står, ingen nye par). |
| `BETA_MATCH_EMAIL=true` | Slår på match-e-post (etter den første runden). |
| `REGISTRATION_ENABLED=false` | Lukker registreringen (kapasitetsbrems). |

Endring: Vercel → Settings → Environment Variables → endre → **Redeploy**.

---

## 4. Kvoten — tallene du skal kjenne

- **Taket: 5 000 gratis reiser** — `PRICING.freeUserCap` i `config/legal.ts`. Samme tall vilkårene lover. Én kilde.
- **Slik forbrukes den:** hver tester som stiller seg i kø får én gratisordre. 50 testere ≈ **50 av 5 000** (1 %).
- **Lykkelige par gir 2 tilbake:** når ett par slutter reisen, sletter systemet ordrene — plassene kommer tilbake i potten.
- **Panelet:** grønt < 4 000 · gult 4 000–4 750 · rødt > 4 750.
- **Ved taket:** ny bruker får «Gratiskvoten er oppbrukt. Betaling kreves» — skjer ikke med 50 testere.
- **Skal taket opp senere:** én linje i `config/legal.ts` (vilkårene følger automatisk).
- **Grensa er race-fri (F2-2):** kvoteplassen blir tatt med én atomisk database-operasjon (`Quota.free_users`) — to samtidige onboardinger ved taket kan ikke begge slippe gjennom. Panelet les fortsatt Order-tellingen (audit-loggen); telleren synkroniseres ved hver claim.

---

## 5. Kapasitet — hva som holder, og når du skal bli urolig

| Komponent | Kapasitet i dag | Risiko med 50 testere |
|---|---|---|
| Journey-cron (timevis × 300) | ~7 200 samtidige reiser | Ingen (50 testere = ~25 reiser) |
| Matcherunde (lørdag 02–04, 3×50 s budsjett, maks 5 000 i kø) | 5 000 kandidater i ~11 s (målt, F2-1) | Ingen — ~4× budsjett i én runde, pluss to til |
| API / DB / R2 / Pusher | Skalierer | Ingen |

**Hvor du ser varslene først:**
- **«Reiser som venter på fremrykk»** i panelet: `0` = alt fint · `>0` = selvkorrigerer seg innen én time (bekreft at det blir 0 igjen) · `≥100` = rødt — cronen kjører ikke (sjekk Vercel → Cron + Logs). Du får også e-post-varsel.
- **Runde-varighet:** grønt < 30 s · gult 30–50 s · rødt > 50 s. Med 50 testere skal det være under 5 s.
- **`rejectReasons`** (rundesloggen): `kjonn` og `alder` er **nye** kategorier (WP1). Høye tall = filterbug, ikke «vanlige avvisninger».
- **Kø-alder** (admin-panelet): > 14 dager = noen venter for lenge.
- **Draft-frafall** (`/admin/users`): mister folk data i onboarding? (Draft-fikset fra 28.08 skal ha lukket dette — høyt frafall = regression.)

---

## 6. Daglig oversikt (0–5 minutt)

1. **Raskt:** `curl -s https://www.tosom.no/api/system/health` → `ok`/200? (lesing: §0)
2. `/admin/login` → alt grønt? Ferdig.
3. **Lørdag formiddag:** kom matcherunden? (Siste matcherunde + runde-varighet + kø = 0?)
4. **support@:** alt svart? (viderekoblet til deg)
5. Noe **rødt**? → §7.

## 7. Hva du gjør når noe er rødt

1. **Nødbremse** dersom brukerne er påvirket: `MAINTENANCE_MODE=true` → redeploy.
2. **Diagnose:** Vercel Logs · Sentry · `/admin/logs` (Systemlogg) · `/admin/system/status` · `curl -s https://www.tosom.no/api/system/health`.
3. **Retting:** alltid i repoet → ny deploy. **Aldri** rett direkte i produksjons-DBen.
4. **Aldri** juster terskler under beta (DI-2) — tallet er data til tuning, ikke en hendelse.

---

## 8. Etter betaen — før lansering (fase 2, lokal jobb)

Rekkefølge (sammen med `ACT-STATE.gjenstaarFoerLansering`):
1. ✅ **Matcherunden skalering (F2-1, 17.08):** prekalkulerte dealbreakers (O(n) i stedet for O(n²) normalisering), 4,7× raskere filter, 5 000 kandidater i ~11 s, lørdagstidsvinduet utvidet til 02–04 (S3). Ekvivalens-tester låser semantikken.
2. **Vipps Login + Betaling** (349 kr) — da erstattes e-post+passord, og kvoten får sin betalings-tilbakefall.
3. **DPA + DPIA** (HOSTING-plan §6) — juridisk før kampanje.
4. ✅ **Geo-koordinater 100 %** (ferdig 10.08 — `postalCodes.json` har 5 146/5 146 med koordinater).
5. **Kostnader/planer:** Vercel Pro/Fluid, Pusher/Resend betalte tier, R2-lagring.
6. ✅ **Atomisk kvote-teller (F2-2, 17.08):** `Quota.free_users` med betinget `UPDATE ... SET used = used+1 WHERE used < cap` — grenseplassen kan ikke bli tatt to ganger.

Med fase 2 på plass holder arkitekturen 100 000 brukere over ett år med margin — de to cron-takene var de eneste flaskehalsene, og begge har kjente fikser.

---

## 9. Ikke gjør dette

- Set aldri `PAYMENTS_ENABLED=true` før Vipps er på plass (kjører ned appen ved oppstart).
- Rør aldri produksjons-DBen direkte.
- Juster ikke terskler under beta.
- Åpne ikke for hundrevis av brukere før fase 2 punkt 1 er gjort.
- `DEV_LOGIN_ENABLED` — aldri `true` i produksjon.
