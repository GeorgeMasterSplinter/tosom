# ⭐ ToSom — Full Plattformdiagnose v1.0

**Dato:** 12. august 2026
**Commit-basis:** `2f53adf0` (main, 254 commits)
**Metode:** Statisk kildekodeanalyse (read-only), grep/regex-basert import-graf-analyse, `madge`-sirkularitetssjekk, faktisk `npm run build`/`npm test`-kjøring, manuell lesing av alle kritiske filer (auth, middleware, journey-engine, matching-engine, cron-jobber, admin-lag, chat-lag, betaling/Vipps).
**Omfang:** Hele kodebasen — ~709 ikke-genererte TS/TSX-filer, ~96 API-ruter, hele `app/`, `lib/`, `components/`, `hooks/`, `config/`, `prisma/schema.prisma`, testoppsett, deploy-konfigurasjon.
**Underlagsdokumenter:** Fullstendige rådata-funn ligger i `docs/audit-drafts/01-security.md` til `docs/audit-drafts/05-testing-e2e.md`. Dette dokumentet er den syntetiserte, prioriterte og komplette masterrapporten.

> **Merk om metodikk:** Dette er en ren skriftlig diagnose. Ingen produksjonskode er endret som del av dette arbeidet.

---

## 0. Sammendrag — alle 7 scorer

| # | Område | Score | Status |
|---|---|---|---|
| 1 | **Security Readiness Score** | **42 %** | 🔴 Kritiske hull |
| 2 | **Code Health Score** | **52 %** | 🟡 Middels — mye dødt kode |
| 3 | **Functional Readiness Score** | **39 %** | 🔴 Flere kjernefunksjoner ødelagt |
| 4 | **Operational Stability Score** | **46 %** | 🟡 Bygg/drift har konkrete blokkere |
| 5 | **Testing Readiness Score** | **18 %** | 🔴 Nesten ingen reell testdekning |
| 6 | **Launch Readiness Score** | **27 %** | 🔴 IKKE klar for lansering |
| 7 | **E2E Readiness Score** | **12 %** | 🔴 Ingen bekreftet grønn E2E-kjøring |
| | **Gjennomsnitt** | **≈ 34 %** | |

### Toppfunn — de 10 mest kritiske problemene på tvers av alle 7 deler

1. **Chat er fullstendig ødelagt for alle reelle brukere.** `POST /api/chat/send` sin Zod-validering aksepterer kun `type: 'user' | 'continue_choice'`, men UI sender alltid `'text'`/`'image'`. **Hver enkelt meldingssending feiler med HTTP 400.** (Funksjonalitet, Del 3)
2. **Ingen premium-/betalingssperre eksisterer i det hele tatt.** `isPremium` finnes ikke i databasen, Stripe-webhooken skriver aldri til DB (`// TODO`), og planvalg fra UI blir stille forkastet server-side. Match/journey/chat er 100 % åpne uansett betalingsstatus. (Funksjonalitet, Del 3)
3. **`/api/admin/setup` og `/api/admin/journey/[id]/reset` har ingen — eller utilstrekkelig — autorisasjonssperre.** Den første oppretter en hardkodet `admin@tosom.no`-konto uten noen gate; den andre lar enhver innlogget (ikke-admin) bruker nullstille en annen brukers reise via ID. (Sikkerhet, Del 1)
4. **IDOR: `/api/chat/messages` sjekker ikke medlemskap i samtalen.** Enhver innlogget bruker kan lese privat meldingshistorikk mellom to andre brukere ved å oppgi en `conversationId`. (Sikkerhet, Del 1)
5. **Settings-siden er en ren mockup.** Logg ut, slett konto, GDPR-dataeksport, varslingsvalg, språk/tema — *ingen* av disse har en fungerende `onClick`/backend-lagring. Vanlige brukere har **ingen fungerende utloggingsknapp** noe sted i appen.
6. **`npm run build` feiler i dag** (2 ESLint-feil blokkerer bygg), og den dedikerte produksjons-Dockerfilen (`deploy/docker/Dockerfile`) er inkompatibel med `next.config.js` (mangler `output: 'standalone'`) — **ingen av de to offisielle byggveiene produserer et kjørbart artefakt uten manuelt inngrep.**
7. **Race conditions i kjernefunksjonen "match".** `/api/match/accept` og `/api/match/[id]/complete` har ingen transaksjon, ingen unik-constraint på `Conversation.matchId` → duplikate samtaler/matcher mulig ved samtidige forespørsler. Cron-jobbene har heller ingen låsing mot overlappende kjøringer.
8. **~20 % av kildekoden (140+ filer) er dødt kode** fra minst tre forlatte redesign-forsøk ("UI 4.0/5.0"-laget på ~90 filer, en hel `lib/chat/*`-servicelag på 16 filer, og et `lib/admin/*`-rapporteringslag på 7 filer) — inkludert repoets største fil (`components/ui/microcopy.ts`, 1703 linjer, 100 % ubrukt).
9. **Testdekningen er praktisk talt ikke-eksisterende.** Kun 1 unit-testfil (30 tester, alle mot journey-engine) og 4 E2E-spec-filer hvorav den mest gjennomarbeidede (onboarding, 11 tester) er `.skip()`-et i sin helhet fordi den feilet 10/10 forrige gang den kjørte. `npm test` kolliderer i dag med Playwright-filene og rapporterer feil i CI.
10. **Fire uavhengige "dag→fase"-implementasjoner** for reisemotoren, hvorav én (`lib/match/journeySync.ts`) har direkte feil grenser (CHECKIN er uoppnåelig) — og to parallelle, matematisk inkompatible matching-motorer der cron-veien **aldri sjekker dealbreakers**, mens den manuelle veien gjør det.

### Overordnet anbefaling

**ToSom er IKKE klar for offentlig lansering i sin nåværende form.** Grunnmuren (Prisma, Zod, bcrypt, NextAuth, arkitektur uten sirkulære avhengigheter) er solid, og enkelte flyter (journey-motor, onboarding-datainnsamling, matching-vekting) fungerer i det store og hele — men flere **komplette brukerreiser er i praksis ødelagt** (chat-sending, kontoutlogging/-sletting, premium-gating, produksjonsbygg) samtidig som sikkerhetsmodellen har konkrete, utnyttbare hull i produksjonskritiske ruter. Med en fokusert 30-dagers innsats (se Del 8) er de mest kritiske blokkerne rimelig raske å rette, siden hoveddelen av arbeidet er **fjerning av dødt kode + lukking av allerede identifiserte enkelthull**, ikke ny arkitektur.

---

## 1. Sikkerhet — Security Readiness Score: 42 %

*Fullstendige funn med patch-kode: `docs/audit-drafts/01-security.md`. 25 funn totalt: 7 High, 8 Medium, 10 Low.*

### 🔴 High-alvorlighet (7)

| # | Funn | Lokasjon | Beskrivelse | Patch-forslag |
|---|---|---|---|---|
| 1 | **Admin-bootstrap uten gate** | `app/api/admin/setup/route.ts` | Oppretter hardkodet `admin@tosom.no`/`role: ADMIN`-bruker med **ingen** autorisasjonssjekk i handleren. Permanent bakdør i alle miljøer som ikke eksplisitt fjerner ruten. | Slett ruten fra prod, eller gate hardt bak `NODE_ENV !== 'production'` + `ADMIN_SETUP_TOKEN` (timing-safe sammenligning) + no-op hvis en ADMIN allerede finnes. Aldri hardkode credentials. |
| 2 | **Admin journey-ruter uten autorisasjon** | `app/api/admin/journey/[id]/next-step`, `.../reset` | Ingen `requireAuth`/rolle-sjekk i handler-body. Enhver innlogget (ikke-admin) bruker kan force-fremme/nullstille en annens 30-dagers reise (IDOR/privilegie-eskalering). | Legg til `requireAuth` + `role === 'ADMIN'`-sjekk identisk med mønsteret i `app/api/admin/users/[id]/route.ts`. Legg til regresjonstest som asserter 403 for ikke-admin. |
| 3 | **Middleware beskytter kun via cookie-eksistens** | `middleware.ts` | Sjekker kun at *en* session-cookie finnes — ikke signatur/rolle — for `/api/admin/*` m.fl. Skaper falsk trygghet: nedstrøms-handlere må selv re-verifisere, noe flere ikke gjør (se #1, #2). | Enten (a) la middleware faktisk verifisere JWT via `getToken()` fra `next-auth/jwt` og sjekke rolle for `/api/admin/*`, eller (b) tvinge via lint/CI at alle admin-ruter importerer en delt `requireAdmin()`-helper. |
| 4 | **Fallback/hardkodet JWT-secret** | `lib/auth/admin-jwt.ts` | Signeringshemmeligheten faller tilbake til en hardkodet streng når env-variabelen ikke er satt — enhver med repo-tilgang kan forfalske en gyldig admin-JWT i miljøer der secret glemmes (preview/staging). | Fjern fallback. Krasj ved oppstart (som `NEXTAUTH_SECRET` allerede gjør i `config/env.ts`) hvis secret mangler. Roter secret i alle miljøer som kan ha brukt fallback. Kort utløpstid + pin `alg: 'HS256'`. |
| 5 | **IDOR: chat-meldinger uten medlemskapssjekk** | `app/api/chat/messages/route.ts:12-52` | Sjekker autentisering, men ikke at brukeren faktisk er part i samtalen (`userAId`/`userBId`). Enhver innlogget bruker kan lese en helt annen samtales private meldinger via `conversationId`. Kontrast: `chat/conversation/[conversationId]/route.ts` gjør denne sjekken korrekt. | Legg til identisk medlemskapssjekk som i `conversation/[conversationId]`-ruten før meldinger returneres. Revider alle ruter som tar `conversationId`/`matchId` for samme mangel. |
| 6 | **IDOR: reisefremgang lekkes** | `app/api/journey/[conversationId]/route.ts` | Returnerer en annen brukers reisedag/fase/fremdrift uten medlemskapssjekk. Ruten er selv merket `@deprecated`. | Legg til samme medlemskapssjekk, eller fjern ruten og migrer til `/api/journey/progress`. |
| 7 | **Svak validering i relasjons-endepunkter** | `app/api/relationship/timeline`, `.../memories` (POST) | **Ingen autentisering i det hele tatt** — kun feature-flag-sjekk. Ikke i `middleware.ts` sin beskyttede liste. Persistens er i dag placeholder, men koden er klar for `prisma.create()` — blir en reell stored-XSS/IDOR/spam-vektor den dagen den kobles til DB. | Legg til `getServerSession()` + medlemskapssjekk før feature aktiveres. Legg til Zod-skjema (lengdebegrensning, URL-validering). Legg `/api/relationship/*` til middleware sin beskyttede prefiks-liste. |

### 🟡 Medium-alvorlighet (8)

8. **NextAuth beta-versjon** (`next-auth@5.0.0-beta.25`) — pre-release auth-bibliotek uten garanterte sikkerhetspatcher. → Følg GA-utgivelse, overvåk changelog.
9. **Dev-login/test-login — kun middleware-gate, ingen in-handler re-sjekk** (`app/api/auth/test-login`, `app/api/dev-login/*`) — hvis `DEV_LOGIN_ENABLED` feilkonfigureres på et preview-miljø, er disse fullt eksponert. → Legg til `NODE_ENV`-sjekk i hver handler (fail closed).
10. **Passordreset-token søkes uten `tokenHash`-filter** (`lib/auth/reset.ts:48-62`) — henter «første» utløpte token i hele tabellen, ikke skopet per token. → Filtrer direkte på hashet token-verdi + unik indeks.
11. **Cron-secret via query-param, ikke timing-safe** (`app/api/cron/journey`, `.../matching`) — lekker i access-logger; `===`-sammenligning er sårbar for timing-sideangrep. → Krev header (`Authorization: Bearer`), bruk `crypto.timingSafeEqual`, legg `CRON_SECRET` til boot-time-krav.
12. **Stripe webhook — bekreft rå-body-håndtering og idempotens** (`app/api/payment/webhook/route.ts`) — signaturverifisering er trolig OK, men ingen `event.id`-deduplisering finnes → dobbel levering kan gi dobbel tilstandsendring når TODO-en for DB-skriving fylles inn.
13. **Filopplasting — kun MIME-type fra klient, ingen magic-byte-sjekk** (`components/ImageUpload.tsx`, uploadthing-konfig) — trenger bekreftelse av `fileTypes`/`maxFileSize` server-side og eksklusjon av `image/svg+xml`.
14. **Uklar/manglende server-side XSS-sanering av `bio`/`interests`** — Zod bånd lengde, men saniterer ikke innhold. Ingen `dangerouslySetInnerHTML` funnet i denne omgangen, men bør bekreftes med full grep av `app/`/`components/`.
15. **Session-invalidering ved utlogging** — sannsynlig JWT-strategi uten server-side revokeringsliste; en stjålet token forblir gyldig til naturlig utløp selv etter «utlogging».

### 🟢 Low-alvorlighet (10)

16. Inkonsekvent Zod-dekning (kun ~6 % av ruter) sammenlignet med den gode standarden i `lib/validation/profile.ts`.
17. Ingen eksplisitt CORS-policy funnet — ingen umiddelbar risiko, men bør dokumenteres som «deny by default» for å hindre fremtidig feilkonfigurasjon.
18. `app/api/journey/exit/route.ts` logger brukerens `reason`-felt usanert/ulengdebegrenset til konsollen — log-injection-risiko.
19. `config/env.ts` krever kun 3 variabler (`DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`) — Stripe/Vipps/Cron/Admin-secrets valideres ikke ved boot.
20. Avhengigheter med caret-ranges (`^`) på sikkerhetskritiske pakker (`jsonwebtoken`, `bcryptjs`, `stripe`) — sikre `npm ci` + Dependabot med review-krav.
21. `bcryptjs`-kostfaktor 10 — funksjonelt OK i dag, men under dagens OWASP-anbefaling (12+).
22. Enkelte GET-handlere har side-effekter (logging) — lav risiko, men bryter «GET = read-only»-prinsippet.
23. Ingen `$queryRaw`/`$executeRaw` funnet noe sted — **positivt funn**, ingen SQL-injection-flate i dag. Legg til CI-lint som fanger fremtidig introduksjon.
24. `console.log`/`console.error` brukt fritt i ~93 tilfeller i `app/api` — inkonsekvent i forhold til den strukturerte loggeren som allerede finnes.
25. Bekreftet korrekt bcrypt-bruk i `lib/auth/hash.ts` (informasjonsfunn — ingen fiks nødvendig).

### Security Readiness Score — begrunnelse

**42 %.** Fundamentet er reelt godt (bcrypt, Zod der det brukes, fail-fast env-validering for de 3 viktigste secrets, ingen rå-SQL noe sted, korrekt medlemskapssjekk i minst én chat-rute som viser mønsteret *er* kjent i teamet) — men konsistens svikter nettopp der det betyr mest: en hardkodet admin-bakdør, to admin-ruter helt uten autorisasjon, en middleware som gir falsk trygghetsfølelse, en fallback-JWT-secret, og en bekreftet IDOR som lekker privat chat-innhold i en relasjonsapp. Disse fem er hver for seg uavhengig utnyttbare **i dag**. Scoren reflekterer «brukbart fundament, flere kritiske, uavhengig utnyttbare hull».

---

## 2. Kodehelse — Code Health Score: 52 %

*Fullstendige funn: `docs/audit-drafts/02-code-health.md` (299 linjer).*

### Dødt kode — ~140+ filer (≈19-20 % av alle kildefiler)

Konsentrert i tre forlatte migrasjoner:

- **«UI 4.0/5.0»-opplevelseslag** (~90 filer under `components/ui/*`) — egen barrel (`components/ui/index.tsx`) importerer filer som **ikke eksisterer**, dvs. laget er dødt by construction. Inneholder repoets største fil: `microcopy.ts` (1703 linjer, 100 % ubrukt) og `tokens.ts` (584 linjer, 100 % ubrukt i praksis).
- **`lib/chat/*`-servicelag** (16 filer: `messageService.ts`, `chatFlow.ts`, `conversationService.ts` osv.) — den reelle chat-flyten kaller Prisma direkte fra `app/api/chat/*` i stedet.
- **`lib/admin/*`-rapporteringslag** (7 filer, ~1600 linjer inkl. `data.ts` på 538 linjer) — se «Duplikatsystemer» under, dette er en alvorlig halvferdig migrasjon.

Andre bekreftede døde klynger: `components/app/`, `components/sections/`, `components/launch/`, `components/global/`, `components/chat/` (8 filer), `components/relationship/` + `components/ui/relationship/V2` (to generasjoner, begge døde), `lib/release/*` (100 % dødt), `lib/system/*` (8 av 12 filer døde), 27+ enkeltfiler i `lib/` (analytics.ts, constants.ts, conversationStore.ts, demoMode.ts, emotional.ts, matchHistory.ts, matchingWorker.ts, resonance.ts, semantic.ts, m.fl.), samt dead hooks (`useAutoSave.ts`, `useAutoSaveForm.ts`, `useHaptics.ts`, `useOnboarding.ts` m.fl.).

### Duplikatsystemer fortsatt i live kode

1. **Match-scoring — 4 uavhengige motorer, kun 1 fullt koblet.** `lib/matching/unifiedScorer.ts` (9-dimensjonal, 0-100-skala) brukes av **både** den manuelle (`/api/match`) og cron-veien (`/api/cron/matching`) — men `calculateTotalScore()`s bakoverkompatibilitets-wrapper produserer **dobbelttelling** av flere dimensjoner (se Del 3). I tillegg finnes `lib/matching/resonanceScore.ts` (345 linjer, aldri importert), en tredje `calculateResonance()` i `lib/presence/presenceEngine.ts` (også død), og en **fjerde**, helt frittstående scorer i `lib/match/score.ts` brukt kun av `/api/match/score` (som selv ikke har noen frontend-kaller).
2. **Design-tokens — 3 systemer.** `config/design-tokens.ts` (66 importører, de facto standard) vs. `components/ui/tokens.ts` (5 importører, men alle 5 er selv døde filer → 100 % dødt i praksis) vs. `styles/tokens.ts` (0 importører). Kun `config/design-tokens.ts` bør overleve.
3. **Admin-rapportering — «ekte» implementasjon koblet fra, stubbe-ruter aktive.** `lib/admin/data.ts` + 6 søsterfiler er en fullt bygget admin-datalag med **null kallere**, mens de faktiske live-rutene (`app/api/admin/observability/*`, `.../system/*`, `.../security/overview`) er **hardkodede stubber** som returnerer tomme lister. Dette ser ut som en ufullstendig migrasjon — admin-dashbordet viser alltid tomme data mens en ferdig implementasjon ligger ubrukt.
4. **Chat-komponentlag duplisert 3 ganger** (`components/chat/*` død, `app/chat/components/*` levende, `components/ui/chat/*` «V2» død).
5. **Relasjonsfunksjon duplisert 2×** (V1 + V2, begge bak permanent-av feature-flagg, begge døde).

### Lint-blindsoner (`lib/matching/*`, `lib/system/*`, `lib/notifications/*`, `lib/release/*` — 100 % ESLint-unntatt)

Disse fire mappene er fullstendig eksemptert fra linting via `.eslintrc.json`. Konsekvens: ~15 bekreftet døde filer og repoets mest konsentrerte `metadata as any`-mønster (samme bug-form gjentatt 3 steder: `lib/system/errors.ts`, `lib/system/log.ts`, `lib/notifications/dispatcher.ts`) er usynlige for statisk analyse. `lib/release/*` er 100 % dødt og beskyttes for ingenting.

### Store/komplekse filer som trenger refaktorering (prioritert topp 15)

| # | Fil | Linjer | Anbefaling |
|---|---|---|---|
| 1 | `components/ui/microcopy.ts` | 1703 | **Slett** — 100 % dødt |
| 2 | `lib/journey/engine.ts` | 1073 | Refaktorer — kun ~30 % av eksportene brukes av live kode |
| 3 | `lib/admin/data.ts` | 538 | **Slett eller koble til** stubbe-rutene |
| 4 | `components/ui/tokens.ts` | 584 | **Slett** — effektivt 100 % dødt |
| 5 | `app/chat/components/ChatContainer.tsx` | 663 | Del opp i mindre hooks/komponenter |
| 6 | `app/settings/page.tsx` | 649 | Refaktorer samtidig som funksjonalitet bygges (se Del 3) |
| 7 | `app/reisen/page.tsx` | 638 | Trekk ut innhold fra layout/logikk |
| 8 | `app/hvorfor/page.tsx` | 604 | Gjør datadrevet i stedet for én stor JSX-tre |
| 9 | `app/chat/components/MessageBubble.tsx` | 546 | Del opp i separate filer |
| 10 | `components/ui/onboarding4.tsx` | 503 | **Slett** — 100 % dødt |
| 11 | `app/om-oss/page.tsx` | 492 | Samme mønster som #7/#8 |
| 12 | `app/onboarding/OnboardingFlow.tsx` | 483 | Forsiktig dekomponering — forretningskritisk |
| 13 | `app/ui/design-system/components.tsx` | 464 | **Slett hele `app/ui/design-system/`-treet** |
| 14 | `app/cookies/page.tsx` | 457 | Lav prioritet |
| 15 | `lib/matching/unifiedScorer.ts` | 336 | **Ikke slett** — forretningskritisk, men lint-eksemptert; gi den dedikert testdekning i stedet |

### Typesikkerhet, validering, feilhåndtering

- `tsconfig.json`: `strict: true` men **`noImplicitAny: false`** — svekker «strict» vesentlig.
- `.eslintrc.json` deaktiverer `no-explicit-any`, `no-unused-vars`, `exhaustive-deps` m.fl. repo-vidt.
- **95 eksplisitte `any`-forekomster i 56 filer** (og sannsynligvis mange flere implisitte pga. `noImplicitAny: false`).
- **Zod-dekning: kun 6 % av alle 96 ruter, ~22 % av de 27 rutene som faktisk parser JSON-body.** 21 av 27 body-parsende ruter (78 %) validerer overhodet ikke innkommende data — inkludert matchopprettelse, onboarding, admin-auth, telefon-auth.
- **Feilhåndtering: ~93 % try/catch-dekning** (109 forekomster i 89 av 96 rutefiler) — solid, men 7 ruter har null try/catch, inkludert flere auth/session-berørende (`auth/[...nextauth]`, `admin/session`, `admin/logout`).
- **Ubrukte API-ruter** (ingen frontend-kaller, utenom cron/webhook som er forventet): `api/onboarding/{complete,progress,save}`, `api/match/score`, `api/relationship/*`, `api/questions/*` (siden `/questions`-siden leser statisk lokal data i stedet), samt 15+ admin-observability-stubber.

### Fullstendig TODO/FIXME-liste (14 funnet, ingen FIXME/HACK/XXX)

1. `components/system/SystemMessageBox.tsx:6`
2. `components/profile/UserProfileView.tsx:18, 20`
3. `components/profile/PartnerProfileView.tsx:7, 16`
4. `app/chat/components/ChatContainer.tsx:654` — **live, kritisk** (`senderId={undefined}` — bryter bildeopplasting)
5. `app/api/payment/webhook/route.ts:44` — **live, kritisk** (subscription-status skrives aldri til DB)
6. `lib/chat/chatFlow.ts:3` (dødt kode)
7. `lib/system/systemMessages.ts:3-4` (lint-blindsone)
8. `lib/matching/feedback.ts:14, 26` (dødt kode)
9. `lib/matching/engine.ts:37`
10. `e2e/tests/onboarding.spec.ts:52` (dokumenterer hvorfor testsuiten er skippet)

### Code Health Score — begrunnelse

**52 %.** Trekker ned: ~20 % dødt kode fra hele forlatte migrasjoner (ikke spredt cruft, men flere komplette halvferdige feature-migrasjoner), Zod-dekning på kun 6 %, admin-observability-ruter som er hardkodede stubber mens en ferdig implementasjon ligger ukoblet, og fire uavhengige duplikate implementasjoner for matching/design-tokens/resonans. Holder scoren oppe: **null sirkulære avhengigheter** noe sted (bekreftet via `madge`), ~93 % try/catch-dekning, og den live forretningskritiske koden (unifiedScorer, ekte onboarding-flyt, ekte chat-ruter) er arkitektonisk sammenhengende — problemet er de forlatte alternativene som ligger side ved side med det som faktisk kjører, ikke selve kjernelogikken.

---

## 3. Funksjonalitet — Functional Readiness Score: 39 %

*Fullstendige funn: `docs/audit-drafts/03a/03b/03c-functional-*.md`.*

### 3.1 Journey-motoren (`lib/journey/engine.ts`, 1073 linjer)

**Faser og dagintervaller** (`PHASE_CONFIGS`): EARLY (1-14), BUILDING_TRUST (15-21), DEEPER (22-25), CHECKIN (26-30).

- **Bug:** Fallback-fasekonfigurasjon er internt inkonsekvent — for dag 0 eller dag >30 returneres `phase: CHECKIN` men med `startDay: 1, endDay: 30` (hele reisen), noe som gir 103 %+ fase-fremdrift før clamping maskerer symptomet. Fallback-teksten «Ukjent fase» er faktisk uoppnåelig i UI siden `buildJourneyState` overskriver den.
- **Kritisk konsistensbug:** **Fire uavhengige, separat vedlikeholdte kopier** av dag→fase-mapping-logikken finnes (`engine.ts`, cron sin lokale kopi, advance-ruten sin lokale kopi, og `lib/match/journeySync.ts`). Den siste har **feil grenser**: DEEPER dekker dag 22-30 og CHECKIN er uoppnåelig for noen verdi 1-30. Modulen er i dag ubrukt (dead code), men er en landmine hvis den gjenopplives.
- **Bug:** Tre forskjellige terskler for «når er bilder tillatt» — dag 13 (`journeySync.ts`), dag 14 (`match/accept` via `imageShareAllowedAt`), dag 15 (canonical `isPhotosAllowed`). Ingen delt konstant.
- **Manglende defensiv programmering:** `buildJourneyState(undefined)` propagerer `NaN` stille gjennom hele returverdien uten advarsel eller feil.
- **Race condition:** Ingen låsing/transaksjon rundt les-så-skriv i verken cron- eller manuell-advance-ruten → dobbel dag-fremgang mulig ved samtidig kjøring. `JourneyMilestone` har **ingen unik-constraint** på `(progressId, day)` → duplikate milepæler kan opprettes.
- **Dødt kode:** Hele in-memory `advanceOneDay`/`getUserProgress`-mekanismen (linje 495-581) kalles aldri med et reelt lager — alltid dag 1 hvis den ble kalt.
- **Dødt kode:** `pausedAt`-feltet leses/branches-på i 6+ filer, men **settes aldri** noe sted — «pause reisen»-funksjonen kan ikke trigges av noen bruker- eller admin-handling.
- **Testdekning:** 30 tester dekker rene fasegrenser, foto-lås, dag 0/30/31. **`buildJourneyState()` — den mest brukte sammensatte funksjonen i hele appen — har null direkte tester.** Ingen NaN/negative-dager-tester. Ingen test av cron/advance sine egne dag→fase-kopier (derfor fanget testsuiten aldri drift-bugen i `journeySync.ts`).

### 3.2 Matching-motoren

**To parallelle, matematisk inkompatible scoringssystemer:**
- **System 1** («5-kategori legacy»): vekter base 0.35 / resonance 0.25 / semantic 0.20 / intimacy 0.10 / future 0.10. Brukes av manuell `/api/match` POST. Har dealbreaker-sjekk (`sjekkAlleDealbreakers`).
- **System 2** («9-dimensjons unified»): vekter values 0.25 / personality 0.20 / relationshipStyle 0.15 / communication 0.15 / futureVision 0.10 / boundaries 0.05 / emotionalNeeds 0.05 / lifeRhythm 0.03 / maturity 0.02. Brukes av cron (`/api/cron/matching`). **Ingen dealbreaker-sjekk overhodet.**
- **Konsekvens:** En bruker kan aldri bli manuelt matchet med en person pga. en dealbreaker (f.eks. sikkerhetsnivå-gap), men den nattlige cronen kan matche dem med akkurat den samme personen, siden cron-veien hopper over sjekken helt.
- **Bug — dobbelttelling:** `calculateTotalScore()` mapper de 9 unified-dimensjonene ned til de 5 legacy-kategoriene ved **relabeling, ikke rekalkulering** — `base` er allerede hele den 9-dimensjonale vektede totalen, som deretter telles *igjen* individuelt for communication/values/emotionalNeeds/futureVision. Udokumentert, ikke-triviell vektfordeling som ikke matcher det som står i kommentarene.
- **24-timers-regelen er kun reelt gjennomført i cron-veien.** `app/api/match/route.ts:141` sin kommentar «24t-regel» sjekker faktisk kun den **30-dagers** `lockedUntil`-låsen, ikke `lastMatchAt`. `MATCH_DELAY_HOURS`-konstanten er **dekorativ** — ingen produksjonskode importerer den; alt hardkoder literalen `24`.
- **Bug — tie-breaking er ikke-deterministisk:** Ingen `orderBy` på kandidatspørringen kombinert med `Array.sort`'s stabile men vilkårlige startorden.
- **Bug — avviste matcher gir ingen beskyttelse mot umiddelbar re-matching.** Verken cron (`findBestResonance.ts` ekskluderer kun `matched`/`active`, ikke `rejected`) eller manuell vei (ekskluderer kun via åpen samtale, som en avvist match aldri har) hindrer at de samme to brukerne matches på nytt umiddelbart.
- **Bug — statsovergangsvakt kan bypasses:** `app/api/match/[id]/complete/route.ts:125` sin guard-logikk hopper *alltid* over overgangstabellen når `action === "complete"`, uansett tidligere status — inkludert fra terminal-tilstander som «rejected»/«completed».
- **Cron-eligibility-query-bug (OR i stedet for AND):** `app/api/cron/matching/route.ts:36-53` sin `where`-klausul bruker `OR` mellom «ingen aktiv match som A» og «ingen aktiv match som B» — en bruker som allerede har én aktiv match kan trivielt tilfredsstille den andre betingelsen og bli inkludert som «kvalifisert» igjen, noe som kan gi **to samtidige aktive matcher for samme bruker**.
- **Ingen transaksjon i cron-matchopprettelse** (i motsetning til den manuelle veien, som allerede har «FASE 2.3 FIX»-kommentaren for nettopp dette) — `conversation.create` og `journeyProgress.upsert` fanges kun med `.catch()`-warn som svelger feilen uten å rapportere den, mens `created++` telles uansett. Kan gi «Match»-rader uten tilhørende samtale, usynlig i cron-responsen.

### 3.3 Cron-jobber

- **`api/cron/journey`:** Ikke fullt idempotent — ingen låsing/optimistisk concurrency rundt les-så-skriv, dobbel dagfremgang mulig ved overlappende kjøringer. Per-rad try/catch gir korrekt delvis-feil-håndtering (én dårlig rad krasjer ikke hele batchen), men ingen retry-with-backoff — en persistent feil på én rad logges på nytt for hver fremtidig kjøring uten circuit-breaker. Et ubeskyttet feil i selve sluttlogg-skrivingen kan gi en misvisende 500-respons selv om alt faktisk arbeid lyktes.
- **`api/cron/matching`:** Se eligibility-bug over. Ingen `take`-grense på kvalifiserte brukere → skalerer lineært og risikerer timeout ved vekst.
- **Ingen låsing mot overlappende kjøringer i noen av de to cronene** — ingen advisory lock, ingen «kjører allerede»-tabell.

### 3.4 Onboarding

- **Blueprint vs. implementasjon fortsatt IKKE i samsvar:** Kode implementerer 13 steg, `Prisma DeepProfileStep`-enum har kun 9 (+SUMMARY), og blueprint-dokumentet sier fortsatt «9 steg».
- **Kritisk — de dedikerte onboarding-API-rutene er dødt kode.** `OnboardingFlow.tsx` kaller **aldri** `/api/onboarding/{save,progress,complete}` — kun `useAutoSaveForm.ts`-hooken gjør det, og den importeres ingen steder. I stedet samler UI hele det 13-stegs formularet client-side og sender **ett** POST til `/api/profile/setup` helt til slutt.
- **Konsekvens 1 — ingen ekte server-side lagring underveis.** Alt lever kun i `localStorage` (`tosom_onboarding_draft`). Sletting av nettleserdata, enhetsbytte, privat vindu, eller iOS Safaris 7-dagers ITP-utrensking → **all fremgang tapt uten server-side gjenoppretting**. Draft slettes ved navigering til steg 12 uavhengig av om siste innsending faktisk lykkes — mislykket innsending etterlater brukeren med tom localStorage ved refresh.
- **Konsekvens 2 — server-side validering kan bypasses fullstendig.** Kun `basic` (Steg 1) er et **påkrevd** toppnivå-felt i Zod-skjemaet; alle 12 andre seksjoner er `.optional()`. En klient kan sende **kun** Steg-1-feltene direkte til API-et og få `onboardingComplete: true`/`deepProfileComplete: true` satt ubetinget — stikk i strid med den dokumenterte kjerneregelen «Kun brukere med fullført djup profil kan få match» (som *er* korrekt implementert i den ubrukte `/api/onboarding/complete`-ruten, men fraværende i den faktisk brukte `/api/profile/setup`-ruten).
- Duplisert/overlappende feltbruk (`structureSpontaneity`/`introExtrovert` lagret under to forskjellige logiske nøkler).
- 3-veis grenlogikk etter innsending med svelget catch — mislykket matchforespørsel etter onboarding gir stille omdirigering til dashboard, ingen feilmelding, ingen retry.
- Fremdriftsindikator beregnes men vises aldri i `OnboardingLayout.tsx`.

### 3.5 Chat

- **KRITISK — hver melding sendt via live UI feiler med HTTP 400.** `chatSendMessageSchema` (`lib/api-validator.ts:69-73`) tillater kun `type: 'user' | 'continue_choice'`, men klienten sender alltid `'text'`/`'image'`. Dette er ikke en degradering — det er et **totalt sammenbrudd** av send-funksjonen.
- **Ingen realtime meldingslevering overhodet**, tross Pusher-infrastruktur i kodebasen — den er ikke koblet til den live chat-siden. Meldinger hentes kun én gang ved mount. Mottar en partner en melding, ser avsenderen den ikke før manuell refresh.
- **Presence/typing-indikatorer lever kun i in-process-minne** — ødelagt på tvers av server-restarts og flere serverless-instanser (selv-dokumentert i koden).
- **Read receipts finnes i skjema (`state`, `deliveredAt`, `readAt`) men settes aldri noe sted.** Ingen «marker som lest»-endepunkt eksisterer.
- **Bildeopplasting kan ikke trigges fra live UI:** `senderId` er hardkodet `undefined` med en `// TODO`-kommentar i `ChatContainer.tsx:654` — guard-klausulen no-oper hele opplastingshandleren stille.
- Bildevalidering skjer kun på klient-oppgitt MIME-type, ikke faktisk filinnhold (magic bytes).
- Whitespace-only meldinger kan lagres (Zod `.min(1)` sjekker kun lengde, ikke innhold).
- **Ingen XSS via `dangerouslySetInnerHTML`** funnet i chat (positivt funn) — men en naiv fiks av Zod-bugen (bare legge til `'text'`/`'image'` i enum uten URL-validering for image-type) kunne introdusere en `<img src>`-basert data-eksfiltrerings-/UI-spoofing-vektor.
- Melding-ID genereres med `Date.now()+Math.random()` i stedet for Prismas kollisjonssikre `cuid()` — unødvendig kollisjonsrisiko under last.
- BliKjentPanel sin 📖-knapp i input-baren har en tom `onClick` — dødt UI-element.

### 3.6 Dashboard & Settings

**Settings-siden (650 linjer) er nesten fullstendig funksjonsløs:**
- «Bytt konto» — ingen `onClick`.
- «Be om uttrekk av persondata» (GDPR-forespørsel) — ingen `onClick`. Lovpålagt funksjon, ren dekorasjon.
- «Start ny reise» / «Slett match og start på nytt» — ingen `onClick`.
- **«Slett konto permanent»** — bekreftelsesfeltet har ingen `value`/`onChange`; de to knappene i bekreftelsespanelet gjør **nøyaktig det samme** (avbryt); ingen kodevei sletter faktisk noe.
- **«Logg ut»** — ingen `onClick`. **Vanlige brukere har ingen fungerende utloggingsknapp i hele appen** (`signOut(` har null treff i noen `.tsx`-fil).
- Varslings-/språk-/tema-valg fungerer kun lokalt (`useState`) — aldri lagret til backend, nullstilles ved refresh.
- Konto-/e-postvisning er **hardkodet** til `innlogga@eksempel.no` for 100 % av brukere, uavhengig av faktisk innlogget identitet.

**Dashboard-navigasjon er ødelagt:** `app/dashboard/layout.tsx` rendrer ingen navigasjonskomponent overhodet, selv om `DashboardNavBar.tsx`/`MobileNavMenu.tsx` er fullt bygget — de importeres ingen steder. Den globale `UniversalMenu` gjemmer seg selv eksplisitt på `/dashboard`, `/chat`, `/settings`, `/onboarding`. **Hele `/dashboard/*`-treet rendrer med null navigasjon** — brukere sitter fast uten vei tilbake unntatt nettleserens Back-knapp.
- `MobileNavMenu.tsx`s egen lenkeliste peker til 7 ruter som ikke eksisterer (`/dashboard/reflections`, `.../insights`, `.../heatmap` osv.) — harmløst i dag siden komponenten ikke rendres, men en fremtidig re-aktivering uten opprydding gir umiddelbare 404-er.
- `app/dashboard/journey/page.tsx` og `.../conversation/page.tsx` er stub-sider («Historikk kommer snart», «Meldingsfelt kommer snart») — reell chat/journey-historikk finnes ikke her, tross at disse konkurrerer visuelt med den ekte (men ødelagte) chat-implementasjonen på `/chat/[id]`.
- Selve `app/dashboard/page.tsx` (271 linjer) er derimot **funksjonelt solid** — henter reelle data, implementerer en fungerende «Avslutt reisen»-bekreftelsesflyt korrekt.

### 3.7 Admin-panel

- **`recordAdminAction()` (den formelle AuditLog-skriveren) kalles aldri noe sted** — audit-tabellen er i praksis dødt kode for reelle admin-handlinger. I stedet brukes en ad-hoc `logSystemLog()`-helper i noen (ikke alle) ruter, og feil ved logg-skriving **svelges stille** — en destruktiv handling kan lykkes med **null spor** hvis logg-innsettingen feiler.
- `reset-journey`-handlingen i `users/[id]/route.ts` logger **ikke i det hele tatt**, i motsetning til alle sine søster-handlinger i samme switch-setning — en åpenbar inkonsekvens.
- `app/api/admin/matches/[id]/unmatch` og `.../reset` — **ingen logging overhodet**, og ingen UI-knapp kaller dem i det hele tatt (dødt/ukoblet, men fortsatt eksponert server-side).
- **Fire parallelle, inkonsekvente autorisasjonsmekanismer** brukt på tvers av admin-rutene (`requireAuth`+`castToAdminUser`, `adminAuthGuard()`, `requireAdmin()`, og — i `journey/[id]/reset` — **ingen sjekk overhodet**).
- Bekreftelsesdialoger er **kun UI-kosmetikk** — den faktiske API-en har ingen andrefaktor, ingen re-autentisering, ingen hastighetsbegrensning spesifikt for destruktive handlinger.
- `lib/admin/data.ts::getAllUsers()` underteller matchtall (teller kun `userAId`-siden), og hardkoder `conversationCount: 0` for alle brukere — datakorrekthetsbug i admin-oversikten.
- To separate «hent alle brukere»-implementasjoner med drift mellom dem (`lib/admin/data.ts` vs. den faktiske rutehandleren).
- To separate «reset journey»-endepunkter med **forskjellig faktisk oppførsel** (ett rydder opp milepæler, det andre ikke).

### 3.8 Auth & Session

- **Sesjonsstrategi er JWT, ikke database**, tross at `PrismaAdapter` er konfigurert — `Session`-tabellen brukes aldri til faktiske brukersesjoner. **Ingen server-side sesjonsrevokering er mulig.** Å banne en bruker (`bannedAt`) invaliderer **ikke** deres eksisterende JWT — de kan fortsette å bruke plattformen fullt ut til tokenet naturlig utløper (opptil 30 dager), siden `role`/ban-status kun leses fra DB ved *initial* innlogging, aldri på nytt.
- **Rolle-endring mens sesjon er aktiv håndteres ikke.** Ingen kode-vei sjekker `bannedAt` i match/journey/chat/conversation-rutene — feltet er **rent kosmetisk** utover å hindre dobbel-banning i admin-UI.
- **Kun `EmailProvider` (magic link) er konfigurert**, men `sendVerificationRequest` er overstyrt til kun å `console.log` lenken — **e-post sendes aldri reelt** via denne veien.
- **Telefonverifisering er ødelagt:** `signIn('credentials', ...)` i `phone/verify/route.ts` vil feile ved kjøretid siden ingen `CredentialsProvider` er registrert i `lib/auth/config.ts`. Koden faller tilbake til en hånd-rullet, **usignert sha256-cookie** som `middleware.ts` behandler som «har sesjon» (kun tilstedeværelse sjekkes) men som `auth()` ikke kan dekode korrekt — brukeren ser innlogget ut for middleware, men er faktisk uautentisert for reelt arbeid.
- **Ingen fungerende utlogging for vanlige brukere** noe sted i UI (se Settings over).
- **Multi-enhet-sesjonshåndtering finnes ikke** — ingen «se aktive sesjoner»/«logg ut av alle enheter»-funksjon for vanlige brukere.

### 3.9 Premium / Betaling / Vipps

- **`/api/payment/create-checkout-session`:** UI-ens plan-valg (`planId`: weekly/monthly/quarterly/annual, forskjellige priser) sendes med feil feltnavn (`planId` vs. skjemaets `plan`) og **forkastes stille** av Zod — backend bruker alltid én hardkodet `STRIPE_PRICE_ID` uansett hva brukeren valgte. Kundeobjektet som opprettes brukes aldri i selve checkout-kallet.
- **Webhook gjør ingenting med reell tilstand:** alle tre håndterte event-typer kun `console.log`s, med en eksplisitt `// TODO: Oppdater subscription-status i databasen når Prisma-modell finnes` — **det finnes ikke noe `Subscription`/`isPremium`-felt i databasen overhodet.**
- **Konklusjon: premium-gating er 100 % kosmetisk.** Ingen match-/journey-/chat-rute sjekker betalingsstatus. `hasActiveSubscription()` finnes men kalles aldri. Markedsføringsteksten «ingen abonnement, ingen premium-pakker» er *sant i praksis* — men bare fordi funksjonen aldri ble implementert, ikke som en tilsiktet designbeslutning.
- **Vipps `authorize`** er korrekt implementert (CSRF-state, HMAC, 503 hvis ikke konfigurert).
- **Vipps `callback` produserer en ikke-fungerende sesjon:** setter en egendefinert `tosom_session`-cookie som **ingen annen del av appen gjenkjenner** (`middleware.ts` ser kun etter `authjs.session-token`/`next-auth.session.token`). Etter en «suksessfull» Vipps-innlogging vil brukeren bli avvist som uautentisert på selve neste API-kall. Går også helt utenom NextAuths `Account`-koblingstabell.
- **Ingen Vipps-*betalings*-integrasjon finnes** — kun Vipps *innlogging* er bygget. ePayment-API-et for faktisk betaling er ikke påbegynt.

### Functional Readiness Score — begrunnelse

**39 %.** Journey-motoren og matching-vektingen fungerer i sitt vanlige sti, men er fulle av grensetilfelle-bugs, race conditions og fire uavhengige implementasjoner som allerede har driftet. Enda mer alvorlig: **flere komplette funksjonsområder er i praksis ikke-funksjonelle** — chat-sending (0 % — hver melding avvises), Settings (nesten alle knapper er no-op, inkludert utlogging og kontosletting), premium/betaling (100 % kosmetisk gating), og dashboard-navigasjon (fullstendig fraværende). Onboarding fungerer end-to-end via én vei, men tillater fullstendig bypass av alle 12 «deep profile»-steg som er ment å være obligatoriske. Admin-panelet fungerer, men uten konsekvent autorisasjon eller revisjonsspor. Scoren reflekterer at kjernelogikken (journey/matching) er brukbar-men-skjør, mens flere hele brukerreiser (chat, settings, betaling, navigasjon) er reelt ødelagt for sluttbrukeren i dag.

---

## 4. Drift & Stabilitet — Operational Stability Score: 46 %

*Fullstendige funn: `docs/audit-drafts/04-operational.md`.*

### Byggstatus

- **`npm run build` FEILER** — 2 ESLint-feil (`@next/next/no-html-link-for-pages` i `WaitingForMatch.tsx:167` og `Header.tsx:72`) blokkerer bygget, selv om TypeScript/bundleren i seg selv er fullstendig sunn.
- **`next build --no-lint` LYKKES** — 61 ruter generert, 102 kB delt JS-baseline, ingen bundlestørrelse-advarsler. Tyngste sider: `/dashboard` (162 kB), `/chat/[id]` (161 kB), `/onboarding` (119 kB).
- **Handling:** trivial 2-linjers fiks (bruk `<Link>`) — men til det er gjort, feiler `npm run build` slik den er dokumentert og slik `Dockerfile` kaller den.

### Database/Prisma

- Generelt solid indeksering på `User`, `Match`, `Conversation`, `Notification`.
- **`Message`-tabellen er kun indeksert på `createdAt`** — mangler indeks på `conversationId` og `senderId`, de to hyppigst filtrerte feltene på den tabellen som sannsynligvis vokser raskest.
- `Match`-cronens `OR`-spørring over to kolonner ville hatt bedre nytte av sammensatte indekser `(userAId, status, expiresAt)` og `(userBId, status, expiresAt)`.
- Kun 2 `onDelete: Cascade`-relasjoner (begge NextAuth-styrte, begge fornuftige) — ingen risikable utilsiktede kaskader funnet.
- **Ingen connection-pooling-konfigurasjon synlig i kode** (`connection_limit`, pgbouncer) — reell risiko for å tømme Postgres' maks tilkoblinger under samtidig cron+brukertrafikk i en serverless-driftsmodell.
- Prisma-klient er på v5.22 — betydelig bak nåværende major (7.x).

### Sekvensielle await-i-loop-risikoer (ytelse/skalerbarhet)

- **`app/api/cron/matching/route.ts:62`** — høyeste risiko: for hver kvalifiserte bruker (**uten `take`-grense**), ~4-6 sekvensielle DB-kall, helt seriell. Vokser lineært med brukerbasen, risikerer serverless timeout.
- **`app/api/cron/journey/route.ts:51`** — samme mønster, delvis mitigert av `take: 100`, men fortsatt opptil ~400 sekvensielle round-trips per kjøring.
- Mindre forekomster i `match/accept` (2 iterasjoner) og admin-ruter — lav risiko, trivielt fiksbart med `Promise.all`.
- To gode eksempler funnet (`admin/journeys`, `questions/route.ts`) som **korrekt** bruker `Promise.all` — mønsteret er kjent i teamet, bare ikke konsekvent brukt.

### Race conditions

- **`$transaction`-bruk vs. totalt antall mutasjonssteder: ~5/137 ≈ 3.6 %.** Ikke-atomiske flertrinns-skrivinger er normen, ikke unntaket.
- **`app/api/match/accept/route.ts`** — bekreftet les-så-skriv race: ingen transaksjon, ingen betinget `updateMany`, ingen unik-constraint på `Conversation.matchId` → **to samtale-rader kan opprettes for samme match** ved samtidige aksept-kall.
- **`app/api/match/[id]/complete/route.ts`** — samme underliggende mangel, noe lavere alvorlighet pga. delvis vern via terminal-tilstander i overgangstabellen.
- **Positivt motstykke:** `app/api/match/route.ts:206` viser at teamet *kjenner* mønsteret — den wrapper riktig match+samtale+reise-opprettelse i én `$transaction` med en eksplisitt «FASE 2.3 FIX»-kommentar. Denne fiksen har bare ikke blitt overført til de to høyere-risiko, brukerutløste endepunktene.

### Logging & feilsporing

- `lib/logging.ts` — strukturert JSON i produksjon, lesbar tekst i dev. Solid design, men **ingen ekstern log-shipper** — alt går kun til stdout.
- `lib/errorTracker.ts` — skriver til DB-basert `SystemLog` («fattigmanns-Sentry»). DB-skrivefeil svelges stille (korrekt defensiv praksis, men usynlig hvis det skjer).
- **Ingen ekte ekstern feilsporing er koblet til.** `Sentry`-integrasjonen er scaffoldet men kommentert ut, og `@sentry/nextjs` er **ikke installert**. `enableSentry`-flagget i `utils/flags.ts` er dødt/ubrukt. `SENTRY_DSN` er ikke engang i `config/env.ts` sitt register.
- Konsekvens: hvis appen krasjer hardt utenfor en try/catch, finnes ingen ekstern varsling (ingen Slack/PagerDuty) — all synlighet krever manuell gjennomgang av admin-panelet.

### Webhook-idempotens

- `app/api/payment/webhook/route.ts` — signaturvalidering er korrekt, men **ingen deduplisering på `event.id`**. Harmløst i dag (webhooken er et no-op observability-shim), men blir en tikkende bombe den dagen TODO-en for subscription-persistens fylles inn.

### Cron-overlappsbeskyttelse

- **Ingen låsing av noe slag** (ingen advisory lock, ingen «kjører allerede»-tabell) på verken journey- eller matching-cronen. Kombinert med eligibility-bugen i Del 3, gjør en samtidig kjøring duplikat-matcher betydelig mer sannsynlig.

### Next.js produksjonskonfigurasjon

- **Godt sikkerhetshode-sett:** `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Strict-Transport-Security` — alle på plass.
- **Mangler: Content-Security-Policy (CSP)** — det mest betydelige gapet i hodesettet, spesielt relevant siden appen rendrer brukerinnflytet innhold (chat, bio).
- **`experimental.serverActions.allowedOrigins: ['*']`** — deaktiverer effektivt opprinnelses-sjekk for Server Actions. Bør begrenses til faktiske produksjonsdomener.
- **Kritisk drift-mismatch:** `next.config.js` setter **ikke** `output: 'standalone'`, men `deploy/docker/Dockerfile` (den «dedikerte produksjonsvarianten») kjører `CMD ["node", "server.js"]` — en fil som **ikke genereres** uten standalone-modus. **Denne Dockerfilen er i dag ubrukelig som den står.**

### Docker/deploy

- To separate Dockerfiler eksisterer (vedlikeholds-lukt — uklart hvilken som er autoritativ).
- Rot-`Dockerfile`: fungerer (siden den bruker `npm start`, ikke standalone), men kopierer ubeskåret `node_modules` (unødvendig stor image), ingen `HEALTHCHECK`.
- `deploy/docker/Dockerfile`: bedre hygiene (kun prod-dependencies, `HEALTHCHECK` til stede) — men **ødelagt** pga. standalone-mismatchen over.
- `deploy/docker-compose.prod.yml`: `app`-tjenesten har `restart: "no"` (uvanlig valg for produksjon) og **ingen ressursgrenser** på noen av de 3 tjenestene (app/postgres/nginx) — en løpsk container kan i teorien tømme hosten.
- Secrets håndteres korrekt via `${VAR}`-miljøsubstitusjon, ikke hardkodet.

### Operational Stability Score — begrunnelse

**46 %.** Byggpipelinen er dokumentert ødelagt (både standard `npm run build` og den dedikerte produksjons-Dockerfilen), race conditions eksisterer uten mitigering i selve kjernefunksjonen «match», begge cron-jobbene har null overlappsbeskyttelse og er fullstendig sekvensielle/ubegrensede, og det finnes ingen reell ekstern feilsporing. Motvirkes av: solid indeksering på de fleste tabeller, et godt sikkerhetshode-baseline (minus CSP), strukturert logging med DB-persistens, en fungerende multi-stage Docker-build med non-root-bruker og healthcheck (i `deploy/`-varianten når standalone-problemet er fikset), og minst ett eksempel på riktig transaksjonsmønster som viser at teamet kjenner løsningen — den er bare ikke konsekvent anvendt.

---

## 5. Testdekning — Testing Readiness Score: 18 %

*Fullstendige funn inkl. full dekningsmatrise: `docs/audit-drafts/05-testing-e2e.md`.*

### Nåværende testinventar

**Unit-tester (Jest):** 1 fil, `__tests__/journey-engine.test.ts` — **30 tester, alle grønne.** Rene logikktester av `lib/journey/engine.ts` (fasegrenser, foto-lås, tema-per-dag, vekt-konstanter). Ingen DB, ingen nettverk, ingen React-rendering.

**E2E-tester (Playwright):** 4 spec-filer, 40 tester totalt definert:
- `chat.spec.ts` — 8 tester, **alle betingede/svake** (`if (count>0) assert`).
- `match.spec.ts` — 6 tester, samme svake mønster.
- `matching-journey.spec.ts` — 15 tester over 5 describe-blokker, de fleste betinget/svake, unntatt Guidede Spørsmål-API-testene som er reelt gode.
- `onboarding.spec.ts` — 11 tester, **hele filen er `.skip()`** siden 2026-08-10 fordi den feilet 10/10 forrige kjøring (dev-login-omdirigeringsproblem).

### CI-integrasjonsstatus

- **Playwright kjøres IKKE i CI overhodet** — null treff på «playwright» i noen workflow-fil.
- **`npm test` (kjørt i CI sin `test`-jobb) er i dag faktisk RØD:** `jest.config.js` har ingen `testPathIgnorePatterns` som utelukker `e2e/`, så Jest prøver å laste alle 4 Playwright-spec-filene, som hver kaster en feil umiddelbart (`throwIfRunningInsideJest`). **4 av 5 test suites feiler** i hver `npm test`-kjøring — en reell, nåværende CI-brytende konfigurasjonsbug, separat fra at E2E-testene rett og slett ikke kjøres.
- Arkiverte `playwright-report/`/`test-results/`-artefakter (datert før skip-commiten) bekrefter: **den eneste spec-filen som noensinne faktisk har kjørt er `onboarding.spec.ts`, og den feilet 10/10.** Det finnes ingen artefaktbevis at `chat`/`match`/`matching-journey`-filene noensinne har blitt kjørt og bestått.

### Dekningsmatrise (sammendrag — full tabell i draft-filen)

| Flyt | Unit | E2E | Status |
|---|---|---|---|
| Onboarding (steg/validering/autosave/fullføring) | Nei | **Nei (skippet)** | 0 % reell dekning |
| Onboarding API (`save`/`progress`/`complete`) | Nei | Nei | 0 % |
| Matching (UI-visning) | Nei | Delvis (svak) | Betingede asserts, false-positive-fare |
| Matching (algoritme/scoring-oppførsel) | Nei (kun vekt-konstanter) | Nei | 0 % reell algoritmetest |
| Journey (fase-overganger, foto-lås) | **Ja (sterkt)** | Nei | Godt dekket |
| Journey API (8 ruter) | Nei | Nei | 0 % |
| Chat (send/motta) | Nei | Delvis (svak, **og reelt ødelagt i prod**) | Test kan "passere" mens funksjonen er død |
| Chat (bildeopplasting, XSS) | Nei | **Nei** | 0 % |
| Dashboard/Settings | Nei | **Nei** | 0 % — ingen spec berører `/settings`/`/profile` |
| Admin-panel (33+ ruter) | Nei | Kun 2 svake sjekk | ~94 % udekket |
| Cron (`/api/cron/*`) | Nei | **Nei** | 0 % |
| Webhook (`/api/payment/webhook`) | Nei | **Nei** | 0 % — ingen test av signaturverifisering |
| Auth/session | Nei | Indirekte kun | Ingen direkte test av innlogging/utlogging |
| Vipps | Nei | Delvis (kun authorize) | Callback utestet |
| Premium/betaling | Nei | **Nei** | 0 % |
| Guidede spørsmål API | Nei | **Ja** | Ett av de best dekkede områdene i hele suiten |

### Topp 15 prioriterte manglende tester

1. **Fiks Jest/Playwright-kollisjonen** (`testPathIgnorePatterns: ['<rootDir>/e2e/']` i `jest.config.js`) — blokkerer CI i dag, må fikses før noe annet testarbeid gir mening.
2. Unit/integrasjonstest for `/api/chat/send` som fanger den kjente Zod-mismatchen — ville fanget en live produksjonsbug umiddelbart.
3. Un-skip og fiks `onboarding.spec.ts` ved å koble `auth-onboarding-setup.ts` inn i `globalSetup`.
4. E2E/integrasjonstest for chat-sending + persistens-rundtur (send → verifiser i DB/via `/api/chat/messages`).
5. Webhook-signaturverifiseringstester for `/api/payment/webhook` (gyldig/ugyldig signatur, replay).
6. Cron-endepunkt-autentiseringstester (`/api/cron/journey`, `.../matching`) — verifiser avvisning av uautoriserte kall.
7. Admin-autorisasjonsgrense-tester for hver av de 33+ udekket admin-rutene — minst verifiser 401/403 for ikke-admin.
8. Chat-bildeopplastingstester (gyldig, for stor, feil MIME-type, ikke-deltaker blokkert).
9. Chat XSS/saneringstest — send `<script>`-nyttelast, verifiser escaping/avvisning.
10. Onboarding API-kontraktstester for de tre (i dag ubrukte, men bør reaktiveres eller fjernes bevisst) per-steg-rutene.
11. Matching-algoritme-oppførselstester utover konstant-summen — gitt to mock-profiler, assert faktisk beregnet score.
12. Vipps OAuth callback-test (token-utveksling, sesjonsopprettelse, avvist samtykke).
13. Stripe checkout-session-opprettelsestest — korrekte parametre per plan, avvisning av manipulert input.
14. Settings/Profile-flyt E2E-test — helt udekket area i dag.
15. Styrk eksisterende «svake» E2E-asserts ved å erstatte `if (count>0)`-mønsteret med deterministiske, seedede testdata og harde asserts på tvers av alle 4 eksisterende spec-filer.

### Testing Readiness Score — begrunnelse

**18 %.** Det finnes akkurat ett genuint pålitelig, meningsfullt automatisert testaktivum i hele kodebasen: 30-test Jest-suiten for journey-motoren, som er velskrevet, deterministisk og 100 % grønn. Alt annet er enten ikke kjørbart (onboarding-E2E helt skippet), aldri verifisert å kjøre (chat/match/matching-journey-spec har null artefaktbevis for å ha bestått noe sted), strukturelt ødelagt i CI (`npm test` kolliderer med Playwright og ville feile status-gaten som konfigurert i dag), eller så svakt assertert at det ikke kan fange regresjoner (de fleste E2E-tester bruker betingede mønstre som passerer trivielt når funksjoner er fraværende/ødelagte). Av ~96 API-ruter er det kun en håndfull som berøres av noen test overhodet, og ingen av en reell unit-/integrasjonstest — alt API-relatert er E2E-eller-ingenting, og E2E-laget selv er ikke til å stole på.

---

## 6. Lanseringsklarhet — Launch Readiness Score: 27 %

Denne delen syntetiserer funnene fra Del 1-5 og 7 til et samlet «kan vi lansere?»-bilde.

### 🚫 Blokkere — MÅ fikses før offentlig lansering

**Sikkerhet (kritisk):**
1. Fjern/gate `POST /api/admin/setup` (hardkodet admin-bakdør).
2. Legg autorisasjonssjekk på `app/api/admin/journey/[id]/{next-step,reset}`.
3. Fiks IDOR i `app/api/chat/messages` (medlemskapssjekk).
4. Fjern hardkodet fallback-JWT-secret i `lib/auth/admin-jwt.ts`.
5. Legg in-handler `NODE_ENV`-gate på alle dev/test-login-ruter (defense in depth).

**Funksjonalitet (kritisk):**
6. **Fiks `chatSendMessageSchema` slik at chat faktisk fungerer** — dette er den enkeltviktigste fiksen i hele diagnosen; produktet har i praksis ingen fungerende meldingsfunksjon i dag.
7. Implementer en fungerende utloggingsknapp for vanlige brukere (`signOut()` koblet til Settings-siden).
8. Fiks `senderId={undefined}`-bugen som blokkerer all bildeopplasting i chat.
9. Bygg reell server-side validering i `/api/profile/setup` som faktisk krever «deep profile»-steg (i tråd med den dokumenterte kjerneregelen), eller fjern kravet fra dokumentasjonen bevisst.
10. Koble Dashboard-navigasjon tilbake inn (`DashboardNavBar`/`MobileNavMenu` eller tilsvarende) — brukere sitter i dag fast uten navigasjon på hele `/dashboard/*`.
11. Fiks Vipps-callback slik at den faktisk produserer en NextAuth-gjenkjennelig sesjon (kritisk *før* Vipps aktiveres, per oppgavens roadmap).
12. Fiks telefonverifiserings-fallback-cookien (usignert sha256) som gir brukere en falsk «innlogget»-følelse mens `auth()` ikke kan lese sesjonen.

**Drift:**
13. Fiks de 2 ESLint-feilene som blokkerer `npm run build`.
14. Fiks `output: 'standalone'`-mismatchen mellom `next.config.js` og `deploy/docker/Dockerfile`, eller bytt Dockerfile-strategi.
15. Legg transaksjon + unik-constraint på `Conversation.matchId` for å eliminere race condition i `match/accept` og `match/[id]/complete`.
16. Legg enkel låsing (advisory lock/CronRun-tabell) på begge cron-jobbene.
17. Fiks cron-matching sin `OR`-i-stedet-for-`AND`-eligibility-bug (kan gi dobbel aktiv match per bruker).

**Testdekning:**
18. Fiks Jest/Playwright-CI-kollisjonen (`testPathIgnorePatterns`) — CI rapporterer i dag feil status.
19. Skaff minst grunnleggende testdekning på chat-send, admin-autorisasjon, og cron-autentisering før lansering (se topp 15-listen i Del 5).

### 🟡 Nice to have — bør gjøres, men blokkerer ikke lansering

- Rydd bort ~140 filer dødt kode (Del 2) — forbedrer vedlikeholdbarhet, men ingen umiddelbar brukerpåvirkning.
- Konsolider de 4 matching-scoringssystemene til 1 (behold `unifiedScorer.ts`, fiks dobbelttellings-bugen, slett de 3 andre).
- Legg til Content-Security-Policy-header.
- Øk Zod-valideringsdekning fra 6 % til et rimelig mål (f.eks. 60-80 % av mutasjonsruter).
- Implementer read receipts i chat (skjema finnes allerede).
- Koble reell realtime meldingslevering (Pusher er allerede i kodebasen, bare ikke koblet til chat-siden).
- Reparer/aktiver Settings-sidens øvrige knapper (kontobytte, GDPR-eksport, kontosletting) — viktig for compliance, men kan følge kort tid etter lansering hvis midlertidig manuell prosess finnes.
- Legg til ekstern feilsporing (Sentry) — verdifullt for drift, men ikke en hard blokker for en tidlig lansering med lite trafikk.
- Standardiser admin-autorisasjonsmekanismen til én delt `requireAdmin()`-helper.
- Rydd opp i `.eslintrc.json` sine lint-blindsoner (`lib/matching/*` m.fl.) etter at dødt kode i dem er fjernet.

### ⏳ Kan vente til etter lansering

- Fullstendig redesign/konsolidering av design-token-systemet (3 → 1) — kosmetisk/vedlikeholdsproblem uten brukerpåvirkning så lenge `config/design-tokens.ts` fortsetter å være den faktiske kilden.
- Oppgradering av Prisma fra v5 til v7.
- Migrering fra NextAuth beta til GA (følg opp changelog, men ikke en showstopper alene).
- Full utbygging av premium/betalings-gating og bytte fra Stripe til Vipps ePayment — per oppgavens egen prioritering skal Stripe fjernes og Vipps ikke er aktiv ennå; siden ingen reell gating finnes i dag uansett, kan dette bygges parallelt med tidlig lansering uten regresjon.
- Multi-enhet sesjonshåndtering («logg ut av alle enheter»).
- Full E2E-testplan v2.0 (Del 7) — bygges gradvis, ikke en lanseringsblokker i seg selv så lenge de kritiske manuelle QA-rutene (chat-sending, onboarding, admin-auth) er verifisert manuelt før lansering.
- Ytelsesoptimalisering av cron-jobbene (`Promise.all`-batching) — relevant ved skalering, ikke ved tidlig lansering med lite brukervolum.

### Launch Readiness Score — begrunnelse

**27 %.** Scoren er lav fordi flere **komplette brukerreiser** (chat-sending, kontoutlogging, premium-gating, dashboard-navigasjon) er reelt ødelagt for enhver bruker som prøver dem i dag — ikke kantsaker, men hovedstien. Kombinert med konkrete, uavhengig utnyttbare sikkerhetshull i produksjonskritiske ruter og et byggsystem som ikke produserer et kjørbart artefakt via noen av de to dokumenterte veiene, er plattformen ikke forsvarlig å eksponere for reelle brukere før blokkerlisten over er lukket. Det oppløftende: de 19 blokkerne er hver for seg **konkrete og avgrensede** fikser (ikke ny arkitektur) — realistisk gjennomførbare innenfor 2-3 uker med fokusert arbeid, se 30-dagersplanen i Del 8.

---

## 7. E2E-modenhet — E2E Readiness Score: 12 %

### Hvor mye kan testes E2E i dag?

Strukturelt er Playwright-oppsettet rimelig godt designet (multi-prosjekt-konfigurasjon for dashboard- vs. onboarding-storageState, mobile viewports, retries/tracing i CI, `globalSetup`-mønster) — men gjennomføringsrealiteten undergraver nesten alt:

1. Onboarding-prosjektets dedikerte storageState-oppsett (`auth-onboarding-setup.ts`) er **ikke** koblet inn i `globalSetup` — selv om `onboarding.spec.ts` ble un-skippet, ville disse prosjektene sannsynligvis feile å autentisere på en ren CI-sjekk.
2. Den ene spec-filen med reell historisk kjøre-evidens (`onboarding.spec.ts`) feilet 10/10 og ble deretter **deaktivert i sin helhet** i stedet for fikset.
3. De tre øvrige spec-filene (chat, match, matching-journey — 29 tester samlet) har **ingen artefaktbevis** for at de noensinne har kjørt og bestått mot en kjørende app.
4. Playwright er **fullstendig fraværende fra CI** — ingen automatisk gate hindrer regresjoner i noen brukerflyt i dag.
5. Hele hovedområder har null E2E-dekning: admin-panel (utover 2 svake sjekk), cron-jobber, webhooks, bildeopplasting/XSS i chat, settings/profil, betalingsflyt.

**Ærlig vurdering: praktisk talt 0 % av plattformen er i dag bevist validert end-to-end** (ingen grønn, pålitelig Playwright-kjøring finnes i CI eller i artefakter for noen spec-fil), mens *stillaset* for å komme dit (konfigurasjon, fixtures, én velstrukturert-men-deaktivert spec) er kanskje 25-30 % ferdig bygget.

### Hva må bygges/ryddes/stabiliseres før E2E er reelt

**Må bygges:**
- En pålitelig auth-fixture for onboarding-tilstand (koble `auth-onboarding-setup.ts` inn i `globalSetup` per prosjekt eller som en `dependencies`-oppsett-prosjekt).
- Playwright-jobb i CI (`.github/workflows/*.yml`).
- Seedet, deterministisk testdata for hver flyt (i stedet for å stole på tilfeldig/manglende data + betingede asserts).
- Ny dekning for: admin-panel, cron-endepunkter, webhook, chat-bildeopplasting/XSS, settings/profil, betalingsflyt — se full liste under.

**Må ryddes:**
- Erstatt alle `if (await x.count() > 0) { assert }`-mønstre med harde, deterministiske asserts i `chat.spec.ts`, `match.spec.ts`, og størsteparten av `matching-journey.spec.ts` — som skrevet kan de «bestå» selv når funksjonen er helt fraværende eller ødelagt.
- Fjern eller reaktiver `e2e/auth-setup.ts` (dødt/ubrukt legacy-oppsett).
- Konsolider til én fixture-strategi (`e2e/fixtures/test-users.ts`) — i dag bruker kun 2 av 4 spec-filer den konsekvent.

**Må stabiliseres:**
- Fiks selve chat-send-funksjonen (Del 3) — E2E-tester av en ødelagt funksjon er meningsløse uansett testkvalitet.
- Fiks Jest/Playwright-CI-kollisjonen (Del 5) slik at testresultater generelt kan tolkes korrekt.
- Un-skip og reelt fiks `onboarding.spec.ts` sin underliggende dev-login-omdirigeringsbug.

### Manglende E2E-scenarier (full liste for v2.0-planen)

| Kategori | Scenarier som må bygges |
|---|---|
| **Onboarding** | Full 13-stegs gjennomføring med hard assertion på hvert steg; validering av min-lengde-felt; server-side bypass-forsøk (direkte API-kall som hopper over steg) avvises korrekt (etter Del 3-fiksen); resume-etter-avbrudd med ekte server-persistens (etter at server-side lagring er bygget) |
| **Matching** | Manuell match-forespørsel respekterer dealbreakers; cron-match respekterer dealbreakers (etter fiks); 24-timers-regel faktisk blokkerer for tidlig ny match på begge veier; avvist match hindrer umiddelbar re-matching; samtidig aksept fra begge parter gir kun 1 samtale (race-fiks-verifisering) |
| **Journey** | Full 30-dagers fasegjennomgang med ekte dag-simulering; foto-lås-grense; reise-avslutning; admin-tvunget reise-reset |
| **Chat** | Ekte send→motta-rundtur mellom to brukere; bildeopplasting (gyldig/for stor/feil type/ikke-deltaker blokkert); XSS-nyttelast avvist/escaped; tom/whitespace-melding avvist; realtime-levering (etter at Pusher er koblet inn) |
| **Dashboard/Settings** | Navigasjon fungerer fra dashboard til hver undersides (etter navigasjons-fiks); alle Settings-knapper faktisk utfører sin handling (utlogging, kontosletting, GDPR-eksport, varslingslagring) |
| **Admin** | Autorisasjonsgrense for hver av de 33+ admin-rutene; destruktive handlinger logges korrekt i AuditLog; bekreftelsesflyt server-side (etter at andrefaktor er lagt til) |
| **Cron** | Autentisering avviser ugyldig secret; kjøring med overlapp gir ikke duplikate matcher (etter låsing er lagt til); delvis feil i batch fortsetter korrekt |
| **Webhook** | Gyldig Stripe-signatur prosesseres; ugyldig signatur avvises; duplikat-levering er idempotent (etter idempotens-fiks) |
| **Auth/Session** | Utlogging invaliderer faktisk sesjon (etter fiks); bannet bruker nektes tilgang (etter at bannedAt faktisk sjekkes); Vipps-innlogging gir en fungerende sesjon (etter fiks) |
| **Premium/Betaling** | Betalingsflyt gater faktisk premium-funksjoner (etter at gating er bygget); webhook oppdaterer faktisk brukerens status |

### E2E Readiness Score — begrunnelse

**12 %.** Realistisk sett må teamet, før plattformen kan kalles «E2E-testet» i noen meningsfull forstand: fikse Jest/Playwright-CI-kollisjonen, korrekt koble og validere onboarding-auth-fixturen, erstatte svake/betingede asserts med deterministiske harde asserts i alle 4 eksisterende spec-filer, legge til en Playwright-CI-jobb, og bygge ny dekning for admin/cron/webhook/betaling/settings før disse flytene kan kalles «E2E-lesbare» overhodet. Scoren er lav-vektet mot «ikke ennå bevist å fungere», ikke «moderat dekket».

---

## 8. Prioritert 30-dagers masterplan

Planen er organisert i 4 ukesbolker etter prinsippet **risiko × innsats** — høyest risiko-reduksjon per arbeidstime først. Hver oppgave er merket med hvilken del av diagnosen den adresserer.

### Uke 1 — Stopp blødningen (kritiske funksjons- og sikkerhetsbrudd)

Mål: gjør de mest brukerpåvirkende ødelagte funksjonene reelt brukbare, og steng de mest kritiske sikkerhetshullene. Dette er stort sett *lokaliserte, avgrensede* fikser, ikke redesign.

1. **[Funksjonalitet]** Fiks `chatSendMessageSchema` i `lib/api-validator.ts` til å akseptere `'text'`/`'image'` (og korrigere `mapMessageType()`-koblingen) — gjenoppretter grunnleggende chat-funksjon.
2. **[Funksjonalitet]** Fiks `senderId={undefined}` i `ChatContainer.tsx:654` — gjenoppretter bildeopplasting i chat.
3. **[Sikkerhet]** Slett eller hard-gate `POST /api/admin/setup`.
4. **[Sikkerhet]** Legg admin-autorisasjonssjekk på `app/api/admin/journey/[id]/{next-step,reset}`.
5. **[Sikkerhet]** Fiks IDOR i `app/api/chat/messages` (medlemskapssjekk).
6. **[Sikkerhet]** Fjern hardkodet fallback-secret i `lib/auth/admin-jwt.ts`; krev env-variabel ved boot.
7. **[Drift]** Fiks de 2 ESLint-feilene som blokkerer `npm run build`.
8. **[Testdekning]** Legg `testPathIgnorePatterns: ['<rootDir>/e2e/']` i `jest.config.js` — gjør CI-status igjen meningsfull.
9. **[Funksjonalitet]** Koble en fungerende `signOut()` til Settings-sidens «Logg ut»-knapp.

### Uke 2 — Steng datasikkerhet og race conditions

Mål: hindre datakorrupsjon/duplisering i kjernefunksjonene match og reise, og lukk gjenværende in-handler-gating-hull.

10. **[Drift/Funksjonalitet]** Wrap `app/api/match/accept/route.ts` og `app/api/match/[id]/complete/route.ts` i `$transaction` + betinget `updateMany`; legg unik-constraint på `Conversation.matchId`.
11. **[Funksjonalitet]** Fiks cron-matching sin `OR`→`AND`-eligibility-bug i `app/api/cron/matching/route.ts:36-53`.
12. **[Drift]** Legg enkel låsing (Postgres advisory lock eller `CronRun`-tabell) på begge cron-jobbene.
13. **[Funksjonalitet]** Ekskluder `rejected`-status fra re-matching-kandidatpoolen i både cron og manuell matchflyt.
14. **[Sikkerhet]** Legg in-handler `NODE_ENV`-gate på alle dev/test-login-ruter (defense in depth utover middleware).
15. **[Sikkerhet]** Fiks passordreset-token-oppslag til å filtrere på `tokenHash` direkte (`lib/auth/reset.ts`).
16. **[Sikkerhet]** Bytt cron-secret-overføring til header + `crypto.timingSafeEqual`.
17. **[Drift]** Fiks `output: 'standalone'`-mismatchen (legg til i `next.config.js` eller bytt Dockerfile-strategi) slik at produksjonsimage faktisk kan bygges.
18. **[Funksjonalitet]** Koble `DashboardNavBar`/`MobileNavMenu` (eller bygg en enkel erstatning) inn i `app/dashboard/layout.tsx` etter å ha ryddet de 7 dødlenkene.

### Uke 3 — Reparer autorisasjon, betaling-realisme og server-side validering

Mål: gjør admin, premium og onboarding trygge og forutsigbare — selv om full gating/redesign ikke er ferdig.

19. **[Funksjonalitet]** Standardiser admin-ruter til én delt `requireAdmin()`-helper; fjern de 4 parallelle mekanismene.
20. **[Funksjonalitet]** Koble `recordAdminAction()` inn i alle destruktive admin-ruter (unmatch, reset, flag, force-match-end).
21. **[Funksjonalitet]** Bestem og implementer: skal `/api/profile/setup` faktisk kreve alle «deep profile»-steg server-side (i tråd med dokumentert kjerneregel), eller skal regelen dokumenteres bort? Implementer valgt løsning.
22. **[Funksjonalitet]** Legg `bannedAt`-sjekk i minst match-/chat-rutene, eller bytt til database-sesjonsstrategi for å muliggjøre reell sesjonsrevokering ved banning.
23. **[Funksjonalitet]** Fiks Vipps-callback sin sesjonscookie til å produsere en NextAuth-gjenkjennelig sesjon (kritisk før Vipps-aktivering per roadmap).
24. **[Funksjonalitet]** Fiks/fjern telefonverifiserings-fallback-cookien; registrer en reell `CredentialsProvider` eller fjern `signIn('credentials', ...)`-kallet.
25. **[Sikkerhet]** Legg auth + medlemskapssjekk på `app/api/relationship/{timeline,memories}` før feature aktiveres.
26. **[Testdekning]** Bygg unit-test for `/api/chat/send` (fanger regresjon på fiksen fra uke 1).
27. **[Testdekning]** Bygg admin-autorisasjonsgrense-tester for minst de 10 mest destruktive admin-rutene.

### Uke 4 — Opprydding, konsolidering og E2E-fundament

Mål: redusere fremtidig risiko og legge grunnlaget for reell E2E-dekning, uten å blokkere en tidlig lansering.

28. **[Kodehelse]** Slett de tre største dødkode-klyngene: `components/ui/*` («UI 4.0/5.0»), `lib/chat/*`-servicelaget, `lib/admin/*`-rapporteringslaget (etter å ha bekreftet ingen skjulte kallere).
29. **[Kodehelse]** Konsolider matching-scoring til `unifiedScorer.ts` alene; fiks dobbelttellings-bugen i `calculateTotalScore()`; slett `resonanceScore.ts`, `presenceEngine.ts`s dupliserte resonans-funksjon, og `lib/match/score.ts`.
30. **[Kodehelse]** Konsolider til `config/design-tokens.ts`; slett `components/ui/tokens.ts` og `styles/tokens.ts`.
31. **[Testdekning]** Un-skip `onboarding.spec.ts` ved å koble `auth-onboarding-setup.ts` inn i `globalSetup`; fiks den underliggende dev-login-redirect-bugen.
32. **[Testdekning]** Erstatt betingede asserts med harde, seedede asserts i `chat.spec.ts`, `match.spec.ts`, `matching-journey.spec.ts`.
33. **[Testdekning]** Legg Playwright-jobb til CI (`.github/workflows/ci.yml` eller egen `e2e.yml`).
34. **[Drift]** Legg til Content-Security-Policy-header; begrens `serverActions.allowedOrigins` til faktiske domener.
35. **[Drift]** Installer og koble til Sentry (eller tilsvarende) for reell ekstern feilsporing.
36. **[Sikkerhet]** Kjør en full `dangerouslySetInnerHTML`-grep-revisjon på tvers av `app/`/`components/` for å bekrefte ingen XSS-vektor via bio/interesser.
37. **[Funksjonalitet]** Implementer minst «Logg ut»- og «Slett konto»-knappene i Settings reelt (utover det som ble gjort i uke 1); koble varslings-/språk-/tema-valg til backend-persistens.

### Etter dag 30 — fortsettelse (ikke lanseringsblokkerende)

- Full E2E-testplan v2.0-scenarier fra Del 7 (bygges gradvis over flere sprinter).
- Reell premium/betaling-gating design + Vipps ePayment-integrasjon (Stripe fjernes samtidig, per roadmap).
- Zod-valideringsdekning fra 6 % til 60-80 % av mutasjonsruter.
- Read receipts + realtime meldingslevering i chat (Pusher-kobling).
- Prisma v5→v7-oppgradering, NextAuth beta→GA-migrering.
- Multi-enhet sesjonshåndtering.
- Fullstendig `.eslintrc.json`-opprydding (fjern lint-blindsoner etter dødkode-fjerning).

---

## Vedlegg — kildedokumenter

Fullstendige, uforkortede funn med kodeeksempler og eksakte linjenummer for hvert enkeltfunn ligger i:
- `docs/audit-drafts/01-security.md` — 25 sikkerhetsfunn
- `docs/audit-drafts/02-code-health.md` — full dødkode-liste, duplikatsystemer, TODO-liste
- `docs/audit-drafts/03a-functional-journey-matching-cron.md` — journey/matching/cron-detaljer
- `docs/audit-drafts/03b-functional-onboarding-chat-dashboard.md` — onboarding/chat/dashboard-detaljer
- `docs/audit-drafts/03c-functional-admin-auth-premium.md` — admin/auth/premium-detaljer
- `docs/audit-drafts/04-operational.md` — full driftsanalyse inkl. byggoutput
- `docs/audit-drafts/05-testing-e2e.md` — full testinventar og dekningsmatrise

*Denne rapporten er en skriftlig diagnose. Ingen produksjonskode er endret som del av dette arbeidet — alle fiks-forslag er anbefalinger for videre implementasjon.*
