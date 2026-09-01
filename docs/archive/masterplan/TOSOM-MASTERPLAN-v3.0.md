# TOSOM-MASTERPLAN v3.0 — Launch & Scale Edition

**Dato:** 13. august 2026
**Commit-basis:** `2d9b7fc` (main, rent arbeidstre)
**Erstatter:** `docs/TOSOM-MASTERPLAN-v2.0.md`
**Underlag:** `TOSOM-MASTERPLAN-v2.0.md`, `TOSOM-ACT-v3-FINAL-REPORT.md`, `ACT-STATE-v3.json`, `TOSOM-ACT-INSTRUKS-v3.0.md`, `match-status-lifecycle.md`, `journey-engine-refactor-plan.md`, `POST-LAUNCH-HARDENING.md`, samt offentlig kopi i `app/(landing)`, `app/priser`, `app/slik-fungerer-det`, `app/hvorfor`
**Metode:** Dokumentanalyse + **verifisering mot faktisk kode og faktisk kjøring** av `tsc`, `jest`, `prisma format`, telling av ruter/filer/linjer, og manuell lesing av `vercel.json`, `middleware.ts`, cron-ruter, `prisma/schema.prisma`, matchflyt, onboardingflyt og alle offentlige sider.

**Fastsatte beslutninger for v3.0 (George, 13.08.2026):**

| # | Spørsmål | Beslutning |
|---|---|---|
| 1 | Matchmodell | **Kobling, ikke samtykke.** Ingen ja/nei til en person. To som matches, er koblet |
| 2 | Ventetid | **«I løpet av 24 timer.»** Klokkeslett 05:00 kommuniseres aldri til bruker |
| 3 | Varsling ved match | **Ingen.** Brukeren logger inn og oppdager det selv |
| 4 | Reisens start | **Dag 1 starter når begge har vært innom** — ikke ved matchtidspunkt |
| 5 | Dag 30 | To utganger: «vi fant hverandre» eller «ny reise». **Begge sletter alt** |
| 6 | Betaling | **349 kr engangs per reise.** Ingen abonnement, ingen nivåer |
| 7 | Gratisterskel | **Første 10 000 brukere gratis.** Deretter betaling før onboarding |
| 8 | Premium | **Finnes ikke som nivå.** Én pris, alle funksjoner. «Premium» = opplevelseskvalitet |
| 9 | Vipps | ePayment kommer om ~2 uker. **Bygges plug-and-play nå** |
| 10 | Deploy | **Vercel er fasit.** Docker arkiveres som dokumentert alternativ |
| 11 | 300k-horisont | **12–24 måneder.** Forberedes nå, bygges ikke ferdig nå |

---

## INNHOLD

- [DEL 0 — Sammendrag](#del-0--sammendrag)
- [DEL 1 — Nåværende tilstand](#del-1--nåværende-tilstand)
- [DEL 2 — Konseptkorreksjon: koblingsmodellen](#del-2--konseptkorreksjon-koblingsmodellen)
- [DEL 3 — Frontend og UX](#del-3--frontend-og-ux)
- [DEL 4 — Tillit og trygghet](#del-4--tillit-og-trygghet)
- [DEL 5 — Premium som opplevelse](#del-5--premium-som-opplevelse)
- [DEL 6 — Skaleringsstrategi mot 300 000](#del-6--skaleringsstrategi-mot-300-000)
- [DEL 7 — Drift og observability](#del-7--drift-og-observability)
- [DEL 8 — Teststrategi](#del-8--teststrategi)
- [DEL 9 — Lanseringsstrategi](#del-9--lanseringsstrategi)
- [DEL 10 — Roadmap 30/60/90](#del-10--roadmap-306090)
- [APPENDIKS](#appendiks)

---

# DEL 0 — SAMMENDRAG

## 0.1 Hovedkonklusjon

ToSom er ikke lenger et system som står stille. **Cron lever, matcher genereres, sikkerhetshullene fra v2.0 er lukket, dødkoden er borte, CI er reell.** ACT v3 leverte ekte framgang, og det skal sies uten forbehold.

Men plattformen er heller ikke der rapporten sier den er.

**Lanseringsscore: 67 %.** ACT v3-rapporten oppgir 87 %.

Avviket har to kilder. Den ene er syv tekniske funn som ingen rapport har fanget. Den andre er større, og den er grunnen til at dette dokumentet finnes:

> **ToSom er bygget som en app med samtykke. Konseptet er en app med kobling.**

Koden krever at begge parter trykker «Ja» før reisen starter. Det er ikke en feil i implementasjonen — det er riktig implementasjon av feil produkt. Ingen offentlig tekst på nettstedet nevner et slikt valg. Kopien har hatt rett hele tiden; koden har drevet fra den.

## 0.2 Avviket: rapport vs. virkelighet — tredje gang

| Fase | Rapport sa | Verifisert | Avvik |
|---|---|---|---|
| ACT v1 | 90–95 % | 27–31 % | −60 p |
| ACT v3 | 87 % | **67 %** | **−20 p** |

Avviket krymper. Det er et godt tegn — «Sjekk 4» (funksjonelt ferdigkriterium per steg) virket. Men mønsteret gjentar seg, og årsaken er verdt å forstå:

> **ACT v3 validerte hvert steg mot sin egen instruks. Ingen validerte instruksen mot produktet.** Alle 30 stegene kunne være riktig utført — og de var stort sett det — mens ingen spurte om stegene til sammen bygget ToSom slik ToSom er tenkt.

**Lærdom for v3.0: valideringskriteriet må utvides fra «fungerer ende-til-ende» til «fungerer ende-til-ende, slik konseptet beskriver det».**

## 0.3 Hva ACT v3 faktisk leverte — verifisert

Dette er reelt, og bekreftet i kode på commit `2d9b7fc`:

| Leveranse | Bevis |
|---|---|
| Cron-kobling rettet | `vercel.json` har ingen `secret=`. Header-basert |
| CI håndhever koblingen | Jobben `cron-guard` feiler bygget ved `secret=` i `vercel.json` |
| Matching-taket fjernet | `BATCH_SIZE = 200`, cursor-paginering, tidsbudsjett |
| Dealbreakere i cron-veien | `findBestResonance.ts:12` import, kalt `:226`, `continue` `:231` |
| Dødkode slettet | 6 filer, 616 linjer. `lib/matching/` nå 8 filer / 1316 linjer |
| Stripe fjernet | Null reelle treff i `app/`, `lib/`, `prisma/` |
| Realtime konsolidert | Pusher i 9 filer. **0 filer** bruker Supabase |
| Jest grønn | 4 suiter, 77 tester, 0 feil |
| CI utvidet | 10 jobber. `postgres:16` som service på både `test` og `e2e` |
| Sentry PII-scrubbing | Reell regex-scrubbing av e-post og telefon i `beforeSend` |
| Kritiske indekser | `Match` har nå 9 indekser inkl. `[userAId, status]` |

Kodehelsen er vesentlig bedre enn ved v2.0. Fundamentet tåler det som skal bygges oppå.

## 0.4 De syv nye funnene

### N-1 — `tsc` er rød 🔴

```
__tests__/cron-auth.test.ts(15,33): error TS2339:
  Property 'replace' does not exist on type 'never'.
```

Én feil. Men v2.0 hadde **null**, og CI-jobben `typecheck` feiler på dette. Regresjonen ble innført av selve testfiksen i STEG 3.3 — steget som skulle gjøre testene ærlige, gjorde typene uærlige.

Verdt å merke: `npx jest` er grønn. Jest transpilerer uten typesjekk. **Grønne tester og rød `tsc` samtidig** er nøyaktig den klassen falsk trygghet v2.0 advarte mot.

### N-2 — Sentry laster trolig aldri på serversiden 🔴

`sentry.client.config.ts` og `sentry.server.config.ts` finnes og er godt skrevet — DSN fra env, PII-scrubbing, `tracesSampleRate: 0.1`.

Men **`instrumentation.ts` finnes ikke.** I Next.js 15 lastes serverside Sentry-konfigurasjon gjennom `instrumentation.ts`. Uten den blir `sentry.server.config.ts` en fil ingen leser. Det finnes heller ingen `sentry.edge.config.ts` — og `middleware.ts` kjører på edge.

Konsekvens: feilsporing dekker sannsynligvis bare nettleseren. Alt som feiler i API-ruter, cron-jobber og middleware — altså der ToSom faktisk lever — er usynlig.

### N-3 — Tidsbudsjettet overstiger plattformgrensen 🔴

```ts
// app/api/cron/matching/route.ts:22
const TIME_BUDGET_MS = 240_000;   // 4 minutter
```

`vercel.json` har **ingen `functions`-blokk og ingen `maxDuration`**. Vercels standard er 10 sekunder (Hobby) og 60 sekunder (Pro).

**Koden planlegger for 4 minutter. Plattformen gir sekunder.** Cron blir kuttet midt i en batch — og fordi kuttet skjer utenfor prosessen, kjører ingen `catch`, og ingenting logges som feil.

Dette er samme klasse feil som FUNN 2 i v2.0: kode og konfigurasjon som går hver sin vei, med stillhet som symptom. Den ble ikke fanget fordi ACT v3 verifiserte at koden var riktig — ikke at plattformen tillot den.

### N-4 — Matchen varsler ikke brukeren 🟠

`notification.create` finnes fem steder:

| Sted | Fil |
|---|---|
| Journey-cron, dagsinnhold | `app/api/cron/journey/route.ts:130` |
| Journey-cron, milepæl | `app/api/cron/journey/route.ts:180` |
| Journey-fremdrift | `app/api/journey/progress/advance/route.ts:140` |
| Dispatcher | `lib/notifications/dispatcher.ts:14` |
| Systemmeldinger | `lib/system/messages.ts:7` |

**Ingen i matching-veien.** Reisen varsler hver dag. Selve matchen — produktets viktigste øyeblikk — er stille.

Etter beslutning 3 skal det *ikke* sendes push eller e-post ved match. Men det må fortsatt finnes en `Notification`-rad, slik at dashbordet kan vise «noe har skjedd» når hun logger inn. Uten den er matchen usynlig også innenfor appen.

### N-5 — Ingen e-post- eller SMS-kanal 🟠

`nodemailer` er en dependency. Den brukes ett sted: `app/api/auth/phone/send/route.ts`. Ingen transaksjonell e-post finnes — ingen velkomst, ingen kvittering, ingen «reisen din er over».

Dette er akseptabelt gitt beslutning 3, men det betyr at **hele produktet er avhengig av at brukeren husker å komme tilbake av seg selv.** Det er et bevisst valg, og det er modig. Det bør måles fra dag én (se DEL 9).

### N-6 — Ingen `loading.tsx`, ingen `error.tsx` 🟠

```
$ find app -name "loading.tsx" | wc -l   →  0
$ find app -name "error.tsx"   | wc -l   →  0
```

50 sider, null rutenivå-lastetilstand, null feilgrense. Hvert nettverkskall som henger, gir hvit skjerm. Hver ubehandlet feil river hele treet.

På et produkt som lover ro er hvit skjerm det stikk motsatte. `app/dashboard/page.tsx` bruker dessuten `alert()` for feilhåndtering — en nettleserdialog fra 1995 i et produkt som ellers er nennsomt designet.

### N-7 — Standalone-rest etter Docker 🟡

`next.config.js:11` har `output: 'standalone'`, kommentert som «for Docker deployment». `cd.yml` deployer til Vercel. `deploy/` inneholder `docker-compose.prod.yml`, `systemd.service` og en `Dockerfile`, og `LAUNCH-CHECKLIST.md` beskriver SSH til `registry.tosom.no`.

Etter beslutning 10 er Vercel fasit. Da er `standalone` unødvendig, og `LAUNCH-CHECKLIST.md` beskriver en prosess som ikke lenger gjelder. To motstridende sannheter om hvordan ToSom kommer i produksjon er en driftsrisiko i seg selv.

**Bonus:** `@supabase/supabase-js` ligger i `package.json` med **null bruk** i koden. Dobbel-realtime-problemet fra v2.0 er de facto løst — Pusher vant. Dependencyen er bare ikke fjernet.

## 0.5 Det åttende funnet, som er det største

Alt over er teknisk. Dette er ikke.

**ToSom krever i dag at begge parter samtykker til hverandre før reisen starter.**

```prisma
// prisma/schema.prisma:96-99
acceptedByA      DateTime?
acceptedByB      DateTime?
rejectedByA      DateTime?
rejectedByB      DateTime?
rejectionReason  String?
```

```tsx
// components/MatchActions.tsx:14-26
<button onClick={() => send("no")}>Nei</button>
<button onClick={() => send("yes")}>Ja</button>
```

`app/matching/page.tsx:78` og `:116` kaller `POST /api/match/accept`. `JourneyProgress` opprettes først når begge har akseptert (`app/api/match/accept/route.ts:128-158`). Reise og chat er sperret til da.

Konseptet er det motsatte: **du velger å delta, ikke hvem du deltar med.**

Og verre — det finnes **to konkurrerende matchemotorer**:

```
OnboardingFlow.tsx:411  →  POST /api/match  →  findBestMatchFor()   →  status "active"
                            ØYEBLIKKELIG, ingen kø, ingen batching

cron 05:00              →  findBestResonance()                      →  status "pending"
                            cursor + tidsbudsjett + dealbreakere ✅
```

Onboarding matcher brukeren umiddelbart ved fullføring — fra en annen motor, med en annen status, uten dealbreaker-filtrene og uten batching. Den nattlige cron-jobben, som er den gjennomarbeidede veien, treffer i praksis bare brukere som falt gjennom den umiddelbare.

Samtidig sier ventetilstanden:

> «Vi beregner matcher en gang per natt. Du får én match om dagen, beregnet i morgen kl. 05:00.»
> — `components/dashboard/WaitingForMatch.tsx:128-129`

Teksten beskriver motor B. Brukeren treffer motor A. **Kopien lyver, uten at noen har løyet.**

DEL 2 handler om å rette dette. Det er tyngdepunktet i hele planen.

---

# DEL 1 — NÅVÆRENDE TILSTAND

## 1.1 Vurdering mot antatt tilstand

| Område | Antatt | **Verifisert** | Begrunnelse |
|---|---|---|---|
| Backend | 95 % | **88 %** | Kjernen virker. Men rød `tsc`, stille match, tidsbudsjett vs. plattformgrense |
| Frontend | 70 % | **65 %** | 0 loading/error-states, dobbelt token-system, onboarding-draft ikke koblet |
| Produkt | 60 % | **55 %** | Feil matchmodell, to motorer, ingen betalingsloop, ingen rapportering |
| Drift | 40 % | **35 %** | Sentry laster trolig ikke serverside, ingen alarmer, deploy-tvetydighet |

Anslagene var gode. Justeringene er små og skyldes funn som krever kodelesing, ikke skjønn.

## 1.2 Backend — 88 %

**Styrker:** 98 API-ruter i konsekvent App Router-struktur. `middleware.ts` verifiserer nå signert token. Cron er header-autentisert med timing-safe sammenligning, advisory lock, cursor-paginering og heartbeat til `SystemLog`. `lib/matching/` er ryddet til 1316 linjer uten dødkode. Dealbreakere håndheves der matcher faktisk lages. 25 modeller, 15 enums, 8 migrasjoner, `prisma format` ren.

**Svakheter:**

| Problem | Bevis |
|---|---|
| `tsc` rød | `__tests__/cron-auth.test.ts:15` |
| Tidsbudsjett > plattformgrense | `TIME_BUDGET_MS = 240_000` vs. manglende `maxDuration` |
| To matchemotorer | `OnboardingFlow.tsx:411` vs. cron |
| Ingen varsling ved match | Ingen `notification.create` i matching-veien |
| `JourneyProgress.userId @unique` | Én reise per bruker **for alltid** — reise nr. 2 er umulig |
| 3 auth-veier på 98 ruter | Uendret fra v2.0 |
| `MatchInsight` foreldreløs | `schema.prisma:421` — fortsatt der |
| 2 `onDelete: Cascade` totalt | Sletting må håndteres eksplisitt |

`JourneyProgress.userId @unique` fortjener uthevning. Feltet gjør at én bruker kan ha nøyaktig én reise i hele sin levetid. Loopen «dag 30 → ny reise» er ikke bare uimplementert — den er **strukturelt umulig** i dagens skjema.

## 1.3 Frontend — 65 %

**Styrker:** 50 sider. Klar visuell identitet. Offentlige sider er gjennomarbeidede og på merkevarestemme. Dashboard, chat og onboarding er reelle, ikke skisser. Pusher-realtime fungerer. Framer Motion brukes gjennomgående.

**Svakheter:**

| Problem | Tall |
|---|---|
| `loading.tsx` | **0** |
| `error.tsx` | **0** |
| Design-token-systemer | **3** — `config/design-tokens.ts` (409 l.), `components/ui/tokens.ts` (584 l.), lokale objekter som `const G = {}` i `app/chat/page.tsx` |
| `components/ui/microcopy.ts` | 1703 linjer |
| Onboarding-draft koblet? | **Nei** — `/api/onboarding/draft` finnes, UI kaller den aldri |
| Duplikatruter | `app/slik/` og `app/slik-fungerer-det/` |
| Dødkode i komponenter | Hele `components/sections/*` importeres ikke fra `app/` |
| Feilhåndtering i dashboard | `alert()` |

`components/sections/*` er verdt et eget punkt: mappen inneholder `Hero.tsx`, `Features.tsx`, `Process.tsx`, `Why.tsx`, `Safety.tsx`, `Founder.tsx` — komplette seksjoner med **markedsføringskopi som motsier de levende sidene**. Den levende heroen er `components/ui/layout/Hero.tsx`. To sett løfter i repoet, hvorav ett er usynlig for brukere og synlig for utviklere.

**Nynorsk-lekkasje i brukervendt tekst:**

| Tekst | Sted |
|---|---|
| «Ingen aktiv reise funnet» | `app/api/journey/exit/route.ts` |
| «Reisen er allerede avsluttet» | `app/api/journey/exit/route.ts` |
| «Vær vennlig å prøv igjen» | `app/onboarding/OnboardingFlow.tsx:424` |
| «Bruker» | `app/onboarding/OnboardingFlow.tsx:399` |
| «Start reisen din no.» | `components/app/AppShell.tsx:89` |

CI-jobben `lang-guard` finnes. Den fanger ikke disse.

## 1.4 Produkt — 55 %

**Styrker:** Konseptet er skarpt og konsekvent formulert utad. Matching-motoren er reell — 9 dimensjoner, definerte vekter, dealbreakere som håndheves. 30 dager gjennomarbeidet redaksjonelt innhold. Fasemodellen er kanonisk og CHECKIN er nåbar. Journey-cron varsler daglig. Prisen er bestemt og kommunisert: 349 kr, én pris, alt inkludert.

**Svakheter:** Matchmodellen er feil (DEL 2). To motorer. Ingen betalingsloop — verken teller, ordremodell eller ePayment. Ingen brukervendt rapportering. `lib/journey/engine.ts` er fortsatt 1073 linjer og eneste fil i mappen. Ingen sperreliste mot gjenmatching. Ingen kohortlogikk — runden kjører uansett hvor tynn køen er.

## 1.5 Drift — 35 %

**Styrker:** Cron lever og skriver heartbeat. `/api/system/health`, `/api/system/cron-health` og `/api/system/latency` finnes. Sentry er installert med gjennomtenkt PII-scrubbing. Upstash Redis for rate limiting med in-memory fallback. Admin har en bred observability-flate. 10 CI-jobber med Postgres-service.

**Svakheter:**

| Problem | Konsekvens |
|---|---|
| `instrumentation.ts` mangler | Serverside Sentry laster trolig aldri |
| `sentry.edge.config.ts` mangler | Middleware-feil usynlige |
| Ingen `maxDuration` | Cron kuttes stille |
| **Ingen alarmer** | Helsesjekker finnes, men ingen ser på dem |
| Ingen varslingskanal | Ingen e-post, Slack eller webhook ved feil |
| Deploy-tvetydighet | Vercel i CD, Docker i `deploy/`, Docker i `LAUNCH-CHECKLIST.md` |
| Ingen verifisert backup | `deploy/backup.md` beskriver, ingen har testet gjenoppretting |

Mønsteret fra v2.0 gjentar seg i ny form: **helsesjekkene finnes nå, men ingen abonnerer på dem.** En helsesjekk ingen leser er en logg, ikke en alarm.

## 1.6 Lanseringsscore: 67 %

| Dimensjon | Vekt | Score | Vektet |
|---|---|---|---|
| Kjernefunksjon virker ende-til-ende | 25 % | 72 % | 18,00 |
| Sikkerhet | 20 % | 87 % | 17,40 |
| Driftsstabilitet | 15 % | 45 % | 6,75 |
| Matching/journey-kvalitet | 15 % | 68 % | 10,20 |
| UX/onboarding | 10 % | 65 % | 6,50 |
| Testmodenhet | 10 % | 42 % | 4,20 |
| Betaling/tilgang | 5 % | 75 % | 3,75 |
| **SUM** | **100 %** | | **66,8 ≈ 67 %** |

**Tolkning:** Plattformen er teknisk nær. Produktet er lengre unna enn plattformen, fordi matchmodellen må bygges om. Det gode er at ombyggingen gjør systemet *enklere*: samtykkeflyten fjernes, én motor erstatter to, og statusmodellen krymper.

**Realistisk prognose:** 82–86 % etter 30 dager. 92–95 % etter 60 dager. Myk lansering i uke 7–8. Åpen lansering uke 10–12.

## 1.7 Endring siden v2.0

| Område | v2.0 | **v3.0** | Endring |
|---|---|---|---|
| Sikkerhet | 30 % | **87 %** | ⬆️ Signert sesjon, rate limiting, PII-scrubbing |
| Kodehelse | 55 % | **78 %** | ⬆️ 616 linjer dødkode borte, Stripe borte |
| Funksjonell modenhet | 35 % | **72 %** | ⬆️ Cron lever, tak fjernet, dealbreakere håndheves |
| Driftsstabilitet | 30 % | **45 %** | ⬆️ Heartbeat og helsesjekk — men ingen alarmer |
| Testmodenhet | 22 % | **42 %** | ⬆️ Grønn suite, Postgres i CI — men lav reell dekning |
| UX/Design | 50 % | **65 %** | ⬆️ Ventetilstand designet, countdown fjernet |
| Produktriktighet *(ny)* | — | **40 %** | Feil matchmodell implementert |
| **LANSERINGSKLARHET** | **31 %** | **67 %** | ⬆️ **+36 p** |

Det er den største framgangen i ToSoms historie. Den fortjener å bli sagt like tydelig som manglene.

---

# DEL 2 — KONSEPTKORREKSJON: KOBLINGSMODELLEN

> Dette er planens tyngdepunkt. Det er mer arbeid her enn i DEL 3–10 til sammen, fordi det berører fire modeller i databasen, to API-veier og hele matchflyten i grensesnittet.

## 2.1 Prinsippet

> **Du velger å delta. Du velger ikke hvem du deltar med.**

Det er hele forskjellen. Alt annet i denne delen følger av den setningen.

Begrunnelsen er ikke teknisk, den er filosofisk: i det øyeblikket du kan si nei til et menneske basert på en profil, har du gjeninnført vurderingen ToSom finnes for å slippe. Et «nei» er en sveip med flere klikk.

## 2.2 Loopen — kanonisk

```
   LANDING
      │
      ▼
   REGISTER / LOGIN  (Vipps = BankID-verifisert menneske)
      │
      ▼
   BETALING  349 kr  ·  gratis for de første 10 000
      │
      ▼
   ONBOARDING  13 steg · ~75 felt · serverside autosave
      │
      ▼
   ┌───────────────────────────┐
   │      START REISEN         │  ← eneste menneskestyrte valg
   └─────────────┬─────────────┘
                 │  journeyState = QUEUED
                 │  matchQueuedAt = now()
                 ▼
   DASHBOARD · I KØ
   «Du får din match i løpet av 24 timer»
   Tynn kø: «Vi venter til vi har nok mennesker
             til å finne en god match til deg.»
                 │
                 ▼
   ⏰ 05:00 — ÉN MOTOR, ÉN RUNDE
      kø ≥ 20?  →  kjør      kø < 20?  →  utsett
      score alle mot alle · dealbreakere · sperreliste
      grådig parvis kobling på synkende score
                 │
                 ├──► Match(status = active)
                 ├──► Conversation
                 ├──► JourneyProgress (dag 0, ikke startet)
                 ├──► Notification (in-app, ingen push)
                 └──► journeyState = MATCHED  for begge
                 │
                 ▼
   🔕 INGEN VARSLING UT — hun logger inn og oppdager det
                 │
                 ▼
   DASHBOARD · MATCHET  →  CHAT
                 │
                 │  begge har vært innom?
                 ▼  bothSeenAt = now()  →  DAG 1 STARTER
   ⏰ 07:00 JOURNEY-CRON  ·  dag++  ·  🔔 dagsvarsel
      EARLY 1–14  ·  TRUST 15–21  ·  DEEPER 22–25  ·  CHECKIN 26–30
                 │
                 ▼
              DAG 30
        ┌────────┴────────┐
        ▼                 ▼
 «Vi fant hverandre»  «Ny reise»
        │                 │
        ▼                 ▼
   endJourney()      endJourney()
   alt slettes ✂️    alt slettes ✂️
        │                 │
        ▼                 ▼
   journeyState       BETAL  →  BEKREFT PROFIL
     = IDLE           →  START REISEN  ⟲
```

## 2.3 Tilstandsmaskinen

Hele modellen hviler på én regel: **én bruker kan ha én reise om gangen.** I dag håndheves den av en bieffekt (`JourneyProgress.userId @unique`) som forsvinner når reiser blir match-baserte. Den må derfor sies eksplisitt.

```prisma
enum JourneyState {
  IDLE       // ingen reise. Kan trykke «Start reisen»
  QUEUED     // venter på neste runde. Cron plukker kun disse
  MATCHED    // i en reise. Kan ikke havne i kø
}

model User {
  journeyState   JourneyState @default(IDLE)
  matchQueuedAt  DateTime?

  @@index([journeyState, matchQueuedAt])
}
```

| Overgang | Utløser |
|---|---|
| `IDLE → QUEUED` | «Start reisen». Krever `onboardingComplete` + betalt/gratiskvote |
| `QUEUED → MATCHED` | Matcherunden kobler henne |
| `QUEUED → QUEUED` | Runden fant ingen. Hun blir stående |
| `MATCHED → IDLE` | Dag 30, eller tidlig avslutning. `endJourney()` |

Indeksen `[journeyState, matchQueuedAt]` er den eneste cron trenger for å hente køen — sortert etter ventetid, uten table scan.

## 2.4 Matcherunden

```
1.  Advisory lock
2.  kø = User.findMany({ journeyState: QUEUED }) sortert på matchQueuedAt
3.  HVIS kø < MIN_COHORT_SIZE (20)
       OG ingen har ventet > 72 t
       → logg «utsatt», avslutt pent
4.  Score alle par i køen  (dealbreakere + sperreliste ekskluderer)
5.  Sorter parene på score, synkende
6.  Grådig kobling: ta beste par, fjern begge, gjenta
7.  Skriv hvert par i én transaksjon:
       Match(active) + Conversation + JourneyProgress(day 0)
       + Notification × 2 + journeyState = MATCHED × 2
8.  Resten blir stående i QUEUED
9.  Heartbeat: {koblet, gjenstående, varighet, utsatt}
10. Slipp lock
```

**Hvorfor terskel på 20?** Med 6 i køen er «beste match» nesten tilfeldig. En dårlig match dag 1 er verre enn to dagers venting — særlig for de første brukerne, som avgjør om ToSom får ord på seg for å virke. Sikkerhetsventilen på 72 timer sikrer at ingen står fast i det uendelige.

**Hvorfor grådig, ikke optimal?** Global optimalisering (Gale–Shapley eller lignende) gir marginalt bedre resultat til vesentlig høyere kompleksitet. Grådig på synkende score er godt nok, forutsigbart og lett å feilsøke. Kan revurderes ved 50k+.

**Oddetall:** én blir stående i `QUEUED`. Det er riktig, og teksten sier det ærlig.

## 2.5 Dag 1 starter når begge har vært innom

Cron ruller dagen uansett. Logger hun inn først på fredag, er dag 1–4 brukt opp i stillhet — og hun betalte for 30 dager.

```prisma
model JourneyProgress {
  matchId      String     // ikke lenger userId @unique
  userASeenAt  DateTime?
  userBSeenAt  DateTime?
  startedAt    DateTime?  // settes når begge er sett
  currentDay   Int        @default(0)   // 0 = ikke startet
}
```

Regelen: **journey-cron hopper over reiser der `startedAt` er null.** Dagen begynner når begge har åpnet den.

Dette bevarer alt: ingen varsling, hennes ansvar, spenningen ved å oppdage det — men ingen dager går tapt. Matchen venter på henne. Det er også det mest rettferdige for begge parter.

Grensen: har ingen av dem vært innom på 14 dager, avsluttes reisen automatisk og begge frigjøres. Ellers blokkerer forlatte matcher køen i det uendelige.

## 2.6 Sletteloopen

Ved begge utganger fra dag 30 — og ved tidlig avslutning — slettes alt innhold.

**Valgt tilnærming: eksplisitt transaksjon, ikke cascade.**

Begrunnelse: cascade er stille. Ett `delete` river ukjent mye med seg, uten telling, uten logg, uten mulighet til å stoppe. På et produkt hvis kjerneløfte er *«ingen ser samtalene dine»* må sletting være det mest reviderbare i systemet — du må kunne bevise nøyaktig hva som ble slettet. Sletting er dessuten ikke symmetrisk: samtalen skal dø, brukeren skal leve.

`lib/journey/endJourney.ts`, én transaksjon:

```
 1. Message           deleteMany  (conversationId)
 2. GuidedQuestion    deleteMany  (conversationId)
 3. ChatSession       deleteMany  (conversationId)
 4. JourneyMilestone  deleteMany  (progressId)
 5. JourneyProgress   delete
 6. Conversation      delete
 7. MatchInsight      delete
 8. Match             delete
 9. MatchHistory      create   ← {userAId, userBId, endedAt, outcome}
10. Notification      deleteMany (match-relaterte)
11. User × 2          update   {journeyState: IDLE, matchQueuedAt: null,
                                lastMatchAt: null, lockedUntil: null}
12. AuditLog          create   {action: JOURNEY_ENDED, antall slettet}
```

Punkt 9 er **sperrelisten**: to bruker-ID-er og en dato. Null innhold, null personopplysninger utover koblingen. Uten den vil systemet gladelig gi deg samme person igjen neste natt.

Punkt 12 gjør slettingen etterprøvbar uten å lagre noe av det som ble slettet.

`onDelete: Cascade` legges til på `Message → Conversation` og `JourneyMilestone → JourneyProgress` **kun som sikkerhetsnett** mot foreldreløse rader. Den vanlige veien går alltid gjennom `endJourney()`.

**Konsekvens som må kommuniseres:** avslutter A på dag 12, mister B også samtalen. Det er riktig etter modellen, men bekreftelsesdialogen må si det rett ut: *«Dette sletter samtalen for dere begge. Det kan ikke angres.»*

## 2.7 Hva som fjernes

| Fjernes | Hvorfor |
|---|---|
| `acceptedByA`, `acceptedByB` | Ingen samtykker til en person |
| `rejectedByA`, `rejectedByB`, `rejectionReason` | Ingen avviser en person |
| `app/api/match/accept/route.ts` | Samtykkeporten |
| `components/MatchActions.tsx` | Ja/nei-knapper. **Kaller dessuten `/api/match/request`, som ikke finnes** — død kode mot en 404 |
| Ja/nei-UI i `app/matching/page.tsx` | Linje 78 og 116 |
| `POST /api/match` fra `OnboardingFlow.tsx:411` | Motor A. Erstattes av kø |
| `lib/matching/findBestMatchFor.ts` | Motor A sin motor |
| `MatchStatus.pending` | Ingen match venter på samtykke |
| `MatchStatus.matched` | Sammenfaller med `active` |
| `MatchStatus.unmatched` | Meningsløs uten avvisning |
| `MatchInsight` | Foreldreløs siden v2.0 |

**Ny `MatchStatus`:**

```prisma
enum MatchStatus {
  active     // koblet, reise pågår
  ended      // avsluttet — normalt slettet umiddelbart
  expired    // forlatt i 14 dager uten at begge var innom
}
```

Fra 6 verdier til 3. Fra 5 samtykkefelt til 0. **Modellen blir mindre av å bli riktig.**

## 2.8 Migreringsrekkefølge

Rekkefølgen er ikke valgfri — den er valgt slik at systemet aldri står i en ugyldig tilstand.

| # | Steg | Ferdigkriterium |
|---|---|---|
| 1 | `journeyState` + `matchQueuedAt` på `User`, backfill fra dagens tilstand | Alle brukere har gyldig state. SQL-telling per verdi stemmer |
| 2 | `MatchHistory`-modell | Migrering kjørt. Tabell finnes |
| 3 | `lib/journey/endJourney.ts` + tester | Testreise slettet i DB. `AuditLog` skrevet. 0 foreldreløse rader |
| 4 | `JourneyProgress` → match-scoped, `bothSeenAt`, `startedAt`, `currentDay = 0` | Én bruker kan ha reise nr. 2. Verifisert i DB |
| 5 | «Start reisen» setter `QUEUED`. `OnboardingFlow.tsx:411` fjernes | Onboarding oppretter ingen match. Bruker havner i kø |
| 6 | Matcherunden skrives om: kohortterskel, parvis kobling, `active`, varsling | Runde i staging kobler N par, etterlater oddetallet i kø |
| 7 | Samtykkeflyten fjernes (kode + UI) | `/api/match/accept` → 404. Ingen ja/nei i UI |
| 8 | Skjemaopprydding: samtykkefelt, `MatchStatus`, `MatchInsight` | `prisma migrate` grønn. `tsc` grønn |
| 9 | Journey-cron hopper over `startedAt = null` | Reise uten oppmøte står stille. Verifisert |
| 10 | Dag 30 → to utganger → `endJourney()` | Begge veier sletter alt. Bruker er `IDLE` |

Steg 1–4 er additive og kan kjøres mot produksjon uten nedetid. Steg 5–8 er brytende og bør kjøres samlet, i lav trafikk, med verifisert backup.

## 2.9 Kopi som må rettes

| Sted | I dag | Skal bli |
|---|---|---|
| `WaitingForMatch.tsx:128-129` | «...beregnet i morgen kl. 05:00» | «Du får din match i løpet av 24 timer» |
| Tynn kø *(ny)* | — | «Vi venter til vi har nok mennesker til å finne en god match til deg» |
| Matchet, ikke startet *(ny)* | — | «Reisen deres begynner når dere begge har vært innom» |
| `journey/exit` — nynorsk | «Reisen er allerede avsluttet» | «Reisen er allerede avsluttet» |
| Avslutt-bekreftelse *(ny)* | — | «Dette sletter samtalen for dere begge. Det kan ikke angres» |

Klokkeslettet 05:00 skal **aldri** vises til bruker. Det er en driftsdetalj, ikke et løfte.

## 2.10 Kopi som ikke skal røres

Verifisert mot de offentlige sidene: **ingen av dem beskriver et samtykkesteg.**

```
app/priser/page.tsx:143   «Én enkel pris. Ingen abonnement. Ingen skjulte kostnader.»
app/priser/page.tsx:272   «ToSoms motor kjører én gang i døgnet ... kun én match om gangen.»
app/priser/page.tsx:365   349 kr
app/(landing)/page.tsx:122 «Match innen 24 timer»
app/onboarding/steps/Step10StartReisen.tsx:49
                           «En match innen 24 timer. Ingen swiping, ingen press.»
```

Teksten har beskrevet koblingsmodellen hele tiden. Onboardingen har til og med et «Start reisen»-steg allerede. **Vi retter ikke kopien etter koden — vi retter koden etter kopien.**

---

# DEL 3 — FRONTEND OG UX

## 3.1 Prinsipp

ToSom lover ro. Ro i et grensesnitt er ikke pastellfarger — det er **fravær av usikkerhet**. Brukeren skal aldri lure på om noe skjer, om noe gikk galt, eller om hun har gjort noe feil.

Målt mot det er 0 `loading.tsx` og 0 `error.tsx` den største UX-mangelen i produktet.

## 3.2 Laste- og feiltilstander

**Rutenivå, første prioritet:**

```
app/dashboard/loading.tsx    ·  error.tsx
app/chat/loading.tsx         ·  error.tsx
app/onboarding/loading.tsx   ·  error.tsx
app/(landing)/error.tsx
app/global-error.tsx
```

Skjelettene finnes allerede — `DashboardSkeleton.tsx`, `MatchBreakdownSkeleton.tsx`, `CardSkeleton`. De er bare ikke koblet til rutene. Dette er lav innsats, høy effekt.

**Feiltilstandene skal ha ToSoms stemme.** Ikke «Error 500», men *«Noe gikk galt hos oss. Vi ser på det. Prøv igjen om litt.»* — og en knapp som faktisk prøver igjen.

`alert()` i `app/dashboard/page.tsx` erstattes med en toast eller inline-melding.

## 3.3 Onboarding

**Serverside autosave.** `/api/onboarding/draft` finnes (GET + POST). `hooks/useAutoSave.ts` finnes. `OnboardingFlow.tsx` kaller ingen av dem. ACT v3 STEG 5.3 stanset her fordi `sed` korrupterte komponenten gjentatte ganger — filen må redigeres manuelt.

Kobling: lagre ved hvert stegbytte, hente ved oppstart, localStorage som hurtigbuffer. 13 steg, ~75 felt, ~15 minutter er det dyreste frafallspunktet i traktet.

**«Bekreft profilen din» ved reise nr. 2.** Full re-onboarding etter en avsluttet reise er 15 minutter — rett etter at hun nettopp har betalt igjen. Løsning: vis de utfylte svarene, la henne endre det hun vil, bekreft. Samme datakvalitet, brøkdelen av friksjonen.

**Rydding:** delte stegnummer, `SUMMARY` i enum uten UI, nynorskrester på linje 399 og 424.

## 3.4 Design-tokens

Tre parallelle sannheter om ToSoms farger:

| Kilde | Linjer | Form |
|---|---|---|
| `config/design-tokens.ts` | 409 | Hardkodet HEX, mange importører |
| `components/ui/tokens.ts` | 584 | CSS-variabler |
| Lokale objekter | — | F.eks. `const G = {}` i `app/chat/page.tsx` |

**Retning:** `config/design-tokens.ts` blir kanonisk. `components/ui/tokens.ts` blir en tynn shim. Lokale objekter fjernes fortløpende. Full migrering er post-launch — men **ingen nye lokale tokenobjekter** håndheves fra nå, med en CI-guard.

## 3.5 Rydding

| Tiltak | Begrunnelse |
|---|---|
| Slett `components/sections/*` | Dødkode med motstridende markedsføringsløfter |
| Slett `components/MatchActions.tsx` | Ja/nei mot en rute som ikke finnes |
| Konsolider `app/slik/` → `app/slik-fungerer-det/` | SEO-splitt og navigasjonsstøy |
| Fjern `@supabase/supabase-js` | 0 bruk |
| Del opp `microcopy.ts` (1703 l.) | Post-launch |
| `lib/journey/engine.ts` → 7 moduler | Post-launch, **etter** tester |

## 3.6 Mobil og tilgjengelighet

Mobil er hovedflaten for et produkt man sjekker om morgenen. `useMediaQuery`, `useMotionPreferences` og `useHaptics` finnes — grunnlaget er der.

Krav før lansering: full flyt testet på faktisk mobil (iOS Safari + Android Chrome), 44px minimum trykkflate, ingen horisontal scroll, tastatur skjuler ikke inputfelt i chat.

Tilgjengelighet: synlig fokusmarkering, `prefers-reduced-motion` respektert i alle Framer Motion-animasjoner, kontrast ≥ 4,5:1, skjemafelt med labels. Full WCAG-revisjon er post-launch; det som listes her er minimum for et voksent publikum.

---

# DEL 4 — TILLIT OG TRYGGHET

## 4.1 Hvorfor dette er en egen del

ToSom kobler to fremmede i et privat rom i 30 dager, **uten at de kan velge hverandre bort.** Det er en bevisst designbeslutning som gjør produktet bedre — og som gjør utveien viktigere.

Rommet er virtuelt, og risikoen er lavere enn i apper der man møtes fysisk. Men fraværet av samtykke flytter ansvaret over på plattformen: når brukeren ikke fikk velge, må plattformen sørge for at hun kan gå.

## 4.2 Vipps som trygghetstiltak

Vipps-innlogging er i praksis BankID-verifisering. Det gir:

- Ekte mennesker, ikke bot-kontoer
- Verifisert alder — 18-årskravet holder
- Norsk tilknytning
- En reell terskel mot useriøse brukere

Dette er ToSoms sterkeste trygghetsmekanisme, og den er allerede på plass (`app/api/auth/vipps/*`). Den bør sies tydeligere utad — det er et salgsargument, ikke bare en innloggingsknapp.

## 4.3 Tre utveier

Tilgjengelig **i chatten** (der problemet oppstår) og **i innstillinger**:

| Valg | Effekt |
|---|---|
| **Rapporter** | `Report`-rad, varsel til admin. Samtalen består. Fritekst + kategori |
| **Avslutt reisen** | `endJourney()`. Alt slettes. Begge frigjøres til `IDLE` |
| **Blokker og avslutt** | Som over, pluss permanent sperre i `MatchHistory` |

```prisma
model Report {
  id          String   @id @default(cuid())
  reporterId  String
  reportedId  String
  matchId     String?
  category    ReportCategory
  description String?
  status      ReportStatus @default(OPEN)
  createdAt   DateTime @default(now())

  @@index([status, createdAt])
}

enum ReportCategory { HARASSMENT  INAPPROPRIATE  SPAM  FAKE_PROFILE  OTHER }
enum ReportStatus   { OPEN  REVIEWED  ACTIONED  DISMISSED }
```

Admin har allerede ban/unban og samtaleinnsyn. Det som mangler er **inngangen fra brukeren**.

Rapportering må ikke kreve at hun avslutter reisen — de to tingene er forskjellige, og å tvinge dem sammen gjør at færre rapporterer.

## 4.4 Personvern som løfte

ToSom lover at ingen ser samtalene. Det løftet må holdes også der det er ubehagelig:

| Krav | Status |
|---|---|
| PII-scrubbing i Sentry | ✅ Implementert |
| Sletting ved reiseslutt | 🔨 DEL 2.6 |
| Revisjonsspor på sletting | 🔨 `AuditLog` per `endJourney()` |
| Admin-samtaleinnsyn logges | 🔨 Hvert innsyn i `AuditLog` |
| Dataeksport (GDPR art. 20) | 🔨 Mangler |
| Slett konto | ⚠️ Anonymiserer i dag, sletter ikke |

Admin-innsyn i private samtaler bør være **tilgangsbegrenset og alltid logget**. Et innsyn ingen kan spore er et løftebrudd som venter på å skje.

## 4.5 Vilkår og angrerett

Betaling før onboarding er den vanskeligste konverteringen som finnes — og den utløser et juridisk krav.

**Angrerettloven gir 14 dagers angrerett på digitale tjenester.** Unntaket gjelder når kunden uttrykkelig samtykker til at leveringen starter straks, og erkjenner at angreretten dermed bortfaller.

Konkret krav til betalingssteget:

> ☐ Jeg samtykker til at ToSom starter reisen min straks, og forstår at angreretten dermed bortfaller.

Én avkrysningsboks. Uten den har enhver bruker 14 dagers ubetinget krav på pengene tilbake. Med den er posisjonen «ingen refusjon» juridisk holdbar.

`app/vilkår/page.tsx` må dessuten dekke: hva 349 kr gir (én reise, 30 dager), at reisen slettes ved slutt, at motparten kan avslutte, at data slettes ved avslutning, og aldersgrense 18 år.

**Anbefaling:** la en jurist lese vilkår og personvern før betaling slås på. Ikke før myk lansering — den er gratis.

---

# DEL 5 — PREMIUM SOM OPPLEVELSE

## 5.1 Det finnes ingen premium

Én pris. Alle funksjoner. Ingen nivåer, ingen gating, ingen «oppgrader»-flater.

```
app/priser/page.tsx:143  «Én enkel pris. Ingen abonnement. Ingen skjulte kostnader.»
```

Det er en betydelig forenkling — og en produktbeslutning, ikke en forretningsmessig forsømmelse. Der andre bygger funksjonsmatriser, bygger ToSom én ting godt.

**«Premium» i ToSom betyr derfor opplevelseskvalitet.** Det som skiller et produkt man betaler 349 kr for fra et gratis alternativ, er ikke funksjonene — det er håndverket.

## 5.2 Hvor kvaliteten avgjøres

**Ventingen.** ToSom har innebygd ventetid som filosofi. Da må ventingen designes, ikke tåles. Dette er produktets mest særegne øyeblikk, og det bør være det vakreste. En rolig, levende tilstand som sier hva som skjer og hvorfor — ikke en tom skjerm med en spinner.

**Oppdagelsen.** Hun logger inn. Noen venter på henne. Vi sender ingen push — men når hun kommer, må øyeblikket bære vekten av 24 timers venting. Dette er ToSoms svar på å åpne en gave.

**Den første meldingen.** Det vanskeligste øyeblikket i hele produktet. To fremmede, et tomt felt. Journey-motoren har allerede førstemeldingsgenerering og blikjent-tips — de bør være mest synlige akkurat her.

**Dagsovergangen.** Hver morgen skal føles som en side som blir vendt, ikke som en app-oppdatering.

**Avslutningen.** Dag 30 er enten en begynnelse eller en slutt. Begge fortjener verdighet. En reise som bare stopper, gjør de 30 dagene mindre verdt i ettertid.

## 5.3 Håndverksregler

| Regel | Hvorfor |
|---|---|
| Ingen tom skjerm uten forklaring | Usikkerhet er det motsatte av ro |
| Ingen `alert()` | Systemdialoger bryter illusjonen |
| Alt under 100 ms føles umiddelbart | Optimistisk UI der det er trygt |
| Animasjoner tjener forståelse | `prefers-reduced-motion` alltid respektert |
| Feilmeldinger på ToSoms stemme | «Noe gikk galt hos oss», ikke «Error 500» |
| Ingen mørke mønstre | Ingen kunstig knapphet, ingen falske varsler |
| Stillhet er tillatt | Ikke fyll hvert tomrom med et forslag |

## 5.4 Betaling — plug and play

Vipps ePayment kommer om ~2 uker. Alt rundt bygges nå, slik at integrasjonen blir én adapter.

```prisma
model Order {
  id            String        @id @default(cuid())
  userId        String
  amount        Int           @default(34900)   // øre
  currency      String        @default("NOK")
  status        OrderStatus   @default(PENDING)
  provider      String        @default("vipps")
  providerRef   String?       @unique
  freeQuota     Boolean       @default(false)   // en av de 10 000
  createdAt     DateTime      @default(now())
  completedAt   DateTime?

  @@index([userId, status])
}

enum OrderStatus { PENDING  PAID  FAILED  REFUNDED }

model WebhookEvent {
  id         String   @id            // provider-ID → idempotens
  provider   String
  payload    Json
  receivedAt DateTime @default(now())
}
```

**Grensesnitt:**

```ts
// lib/payment/provider.ts
export interface PaymentProvider {
  createOrder(userId: string, amount: number): Promise<{ redirectUrl: string; ref: string }>
  verifyWebhook(rawBody: string, headers: Headers): Promise<WebhookResult>
  getStatus(ref: string): Promise<OrderStatus>
}
```

To implementasjoner: `FreeQuotaProvider` (nå) og `VippsProvider` (om to uker). Bytte skjer med én env-variabel.

**Gratisterskelen:**

```ts
// «Start reisen» spør:
const paidUsers = await prisma.order.count({ where: { status: 'PAID' } })
const freeUsers = await prisma.order.count({ where: { freeQuota: true } })
if (freeUsers < 10_000) → gratis, Order(freeQuota: true, status: PAID)
else                    → send til betaling
```

Telleren bør caches (Redis, 60 s) — den spørres ved hver reisestart.

**Krav som gjenoppstår med ekte betaling:**

1. **Idempotens** — `WebhookEvent` med provider-ID som primærnøkkel. Vipps sender samme hendelse flere ganger
2. **Rå body ved signaturverifisering** — aldri `.json()` før verifisering
3. **Ordre før onboarding, reise etter betaling** — brukeren skal aldri kunne starte uten `PAID`
4. **Angrerett-avkrysning** — DEL 4.5

---

# DEL 6 — SKALERINGSSTRATEGI MOT 300 000

> Horisont 12–24 måneder. **Ingenting i denne delen er lanseringsblokker** — med ett unntak: `maxDuration` (6.2), som er kritisk nå.

## 6.1 Skalering i tre faser

Faser utløses av tall, ikke av kalender. Å bygge fase 3 ved 500 brukere er sløsing; å oppdage fase 2 for sent er nedetid.

| Fase | Brukere | Utløser | Hovedgrep |
|---|---|---|---|
| **1 — Lansering** | 0 – 5 000 | Nå | `maxDuration`, indekser, Redis-cache, connection pooling |
| **2 — Vekst** | 5 000 – 50 000 | Runde > 30 s | Denormalisering, blocking/bucketing, kø for tunge jobber |
| **3 — Skala** | 50 000 – 300 000 | Runde > 5 min | Worker-pool, read replicas, partisjonering |

## 6.2 Fase 1 — før lansering

**`maxDuration` — kritisk.**

```json
{
  "functions": {
    "app/api/cron/matching/route.ts": { "maxDuration": 300 },
    "app/api/cron/journey/route.ts":  { "maxDuration": 300 }
  }
}
```

Uten dette kuttes cron etter 10–60 sekunder, midt i en batch, uten feilmelding. Koden tror den har 4 minutter. **Dette er den viktigste enkeltlinjen i hele dokumentet.**

Merk: 300 s krever Vercel Pro. Er planen Hobby, må tidsbudsjettet ned til under 10 sekunder og runden deles i flere kall — en helt annen arkitektur. **Dette må avklares før lansering.**

**Øvrige tiltak i fase 1:**

| Tiltak | Effekt |
|---|---|
| Indeks `[journeyState, matchQueuedAt]` | Køhenting uten table scan |
| Redis-cache på journey-dagsinnhold | 30 nøkler, identiske for alle, 24 t TTL |
| Redis-cache på gratisteller | Spørres ved hver reisestart |
| Connection pooling (PgBouncer/Accelerate) | Kritisk på serverless |
| `select` i stedet for full henting | Json-kolonner er tunge |

**Kapasitet i fase 1:** ved 5000 brukere med ~500 i kø er runden 125 000 parvise sammenligninger. Sekunder. Ingen problem.

## 6.3 Fase 2 — denormalisering og blocking

Ved 50 000 brukere med 5000 i kø: 12,5 millioner sammenligninger per runde. For mye for JavaScript innenfor en funksjonsgrense.

**Kjerneproblemet er ikke CPU — det er at all filtrering skjer i JavaScript etter at data er lastet,** fordi profildata ligger i Json-kolonner Postgres ikke kan indeksere.

| Data | I dag | Må bli |
|---|---|---|
| Geografi | Json | `latitude`, `longitude`, `geoBucket` |
| Kjønn + preferanse | Json | Egne kolonner |
| Livsfase | Json | `lifePhase` enum |
| Dealbreaker-flagg | Json | Bitmaske |

```prisma
model Profile {
  latitude   Float?
  longitude  Float?
  geoBucket  String?
  gender     Gender?
  seeking    Gender?
  lifePhase  LifePhase?

  @@index([geoBucket, age])
  @@index([gender, seeking, age])
}
```

**Blocking:** prefiltrer i SQL til ~200–500 kandidater per bruker, full 9-dimensjonal scoring kun på disse. O(n²) → O(n·k).

De 10 Json-kolonnene beholdes for **scoring av nyanser** — de er riktige der. De er bare feil sted for **filtrering**.

## 6.4 Fase 3 — worker-pool og replicas

```
05:00  Koordinator (lett)
         ├── teller kø, deler i bøtter
         └── legger N jobber på kø
              ↓
       Workers (10–50 parallelle)
         └── hent → prefiltrer → score → foreslå par
              ↓
       Reduser (én prosess)
         └── global kobling, skriv, varsle, metrikker
```

Koblingsfasen må være enkelttrådet — to workers kan ellers koble samme person til to.

Prinsipper: cursor-basert paginering, idempotens per batch, bulk-writes, delvis feil ≠ total feil, backpressure.

**Read replicas** for admin og analytics. **Partisjonering** av `Message`, `SystemLog`, `AuditLog` på måned.

**Sharding: ikke anbefalt.** 300k brukere er ~50–100 GB — godt innenfor én velindeksert Postgres. Sharding før 5–10M brukere er selvpålagt kompleksitet.

## 6.5 Kohortmodellen skalerer bedre

En viktig konsekvens av DEL 2: **kohort-matching er lettere å skalere enn N enkeltsøk.**

| | Per-bruker-søk | Kohortrunde |
|---|---|---|
| DB-spørringer | N | 1 |
| Parallelliserbar | Vanskelig (kollisjoner) | Ja (score parallelt, koble sekvensielt) |
| Kvalitet | Lokalt optimum | Globalt bedre |
| Feilhåndtering | N feilpunkter | Én transaksjon per par |

Konseptkorreksjonen betaler seg altså to ganger: riktigere produkt **og** enklere skalering.

## 6.6 Ytelsesmål

| Endepunkt | Mål p95 |
|---|---|
| Dashboard | < 300 ms |
| Chat-historikk | < 200 ms |
| Send melding | < 150 ms |
| Journey i dag | < 100 ms (cached) |
| Onboarding-lagring | < 200 ms |
| Matcherunde, 5k i kø | < 60 s |
| Matcherunde, 50k i kø | < 5 min |

**Realtime ved 300k:** ~5–10k samtidige tilkoblinger ved 3 % samtidighet. Pusher, kanal per samtale, ingen broadcast.

---

# DEL 7 — DRIFT OG OBSERVABILITY

## 7.1 Deploy: Vercel

Vercel er fasit. Konsekvenser:

| Tiltak | Handling |
|---|---|
| `output: 'standalone'` | Fjernes fra `next.config.js` |
| `deploy/` | Flyttes til `deploy/archive/` med forklarende README |
| `LAUNCH-CHECKLIST.md` | Skrives om for Vercel — dagens versjon beskriver Docker + SSH |
| `docker-compose.yml` | Beholdes **kun** for lokal utvikling og CI |
| `maxDuration` | Settes (DEL 6.2) |
| Vercel-plan | **Må avklares** — bestemmer om 300 s er mulig |

To motstridende sannheter om hvordan ToSom kommer i produksjon er i seg selv en driftsrisiko.

## 7.2 Nivå 0 — før lansering, ikke forhandlbart

| # | Tiltak | Ferdigkriterium |
|---|---|---|
| 1 | `instrumentation.ts` | Serverfeil synlig i Sentry — verifisert med testfeil |
| 2 | `sentry.edge.config.ts` | Middleware-feil synlig i Sentry |
| 3 | `NEXT_PUBLIC_SENTRY_DSN` i Vercel | Testfeil mottatt i prod |
| 4 | `maxDuration` | Cron kjører til ende uten kutt |
| 5 | **Alarm: matcherunde uteble** | Ingen heartbeat innen 30 min → varsel |
| 6 | **Alarm: 5xx-rate** | Over terskel → varsel |
| 7 | **Alarm: DB utilgjengelig** | Feilet forbindelse → varsel |
| 8 | Varslingskanal | E-post eller Slack som noen faktisk leser |
| 9 | Fail-fast env-validering | Manglende variabel stopper oppstart |
| 10 | Verifisert backup | **Gjenoppretting testet**, ikke bare tatt |

Punkt 1 og 2 er de viktigste. Uten dem er observability en kulisse — pent bygget, men uten strøm.

Punkt 5 er lærdommen fra v2.0 FUNN 2: **den viktigste enkeltmetrikken er «matcher koblet siste 24 t».** Er den 0, er ToSom nede — uansett hva oppetidsmåleren sier.

## 7.3 Nivå 1 — første måned

Forretningsmetrikker i admin-dashbordet:

| Metrikk | Hvorfor |
|---|---|
| Kø-størrelse per døgn | Utløser kohortterskelen |
| Koblinger per runde | Kjernefunksjonens puls |
| Runde-varighet | Tidlig varsel om fase 2 |
| Utsatte runder | For tynn kø? |
| Onboarding-fullføring per steg | Hvor faller de fra? |
| **Andel som logger inn og oppdager matchen** | **Validerer beslutning 3** |
| Tid fra kobling til dag 1 | Måler «begge har vært innom» |
| Dag-N-retensjon (1/7/15/30) | Fullfører de reisen? |
| Fullførte reiser, fordelt på utgang | Fant de hverandre? |
| Rapporter per 1000 reiser | Trygghetsindikator |

**Den mest kritiske av dem er «andel som oppdager matchen».** Beslutningen om ikke å varsle er modig og riktig for produktet — men den er en hypotese. Faller den under ~70 % innen 48 timer, må den revurderes. Da er en enkelt, rolig e-post — *«Noen venter på deg»* — ikke et brudd med filosofien, men en tilpasning til virkeligheten.

**Strukturert logging** med korrelasjons-ID. I dag er `console.log` spredt utover; en tynn `lib/logger.ts` som legger på request-ID og bruker-ID koster lite og gir mye.

## 7.4 Nivå 2 — mot 300k

Distribuert tracing, kødybde, DB-connection-utnyttelse, kostnad per bruker, cache-treffrate.

## 7.5 Feilhåndtering

| Prinsipp | Anvendelse |
|---|---|
| Idempotens overalt | Matcherunder, webhooks, `endJourney()` |
| Retry med backoff | Vipps, Pusher, e-post |
| Graceful degradation | Realtime nede → polling. Cache nede → DB |
| Delvis feil ≠ total feil | Ett par som feiler stopper ikke runden |
| **Ingen stille feil** | **Enhver `catch` som svelger en feil er en framtidig FUNN 2** |

---

# DEL 8 — TESTSTRATEGI

## 8.1 Ærlig utgangspunkt

`npx jest` → **4 suiter, 77 tester, 0 feil.** Det ser utmerket ut.

Det er ikke helt sant:

| Suite | Linjer | Reell verdi |
|---|---|---|
| `journey-engine.test.ts` | 175 | ✅ Tester faktisk `lib/journey/engine.ts` |
| `chat-send.test.ts` | — | ✅ Delvis reell |
| `admin-authorization.test.ts` | 104 | ❌ Tester `simulateRequireAuth()` — en **lokal stub**, ikke produksjonskode |
| `cron-auth.test.ts` | 85 | ❌ Strengmanipulasjon + `fs.readFileSync`-grep mot rutefiler |

Av 77 tester er anslagsvis 30 reelle. Resten tester enten kopier av logikken eller at filer inneholder visse strenger.

**Dette er det samme mønsteret som v2.0 advarte mot** — validering som bekrefter at noe *finnes*, ikke at det *virker*. Rødt er rødt, men grønt er ikke nødvendigvis grønt.

**Null dekning på:** `lib/matching/unifiedScorer.ts`, `lib/matching/dealbreaker.ts`, `middleware.ts`, hele `lib/auth/`, alle 98 API-ruter.

## 8.2 Prinsipp

> **En test som ikke kan feile når produktet er ødelagt, er ikke en test.**

Konkret: ingen test skal reimplementere logikken den tester. Ingen test skal grep-e etter strenger i kildefiler. Hver test skal importere reell kode eller treffe et reelt endepunkt.

## 8.3 Pyramiden

**Enhetstester — logikk uten I/O:**

| Mål | Hvorfor |
|---|---|
| `unifiedScorer.ts` | 9 dimensjoner, vekter. Kjernen i produktet, 0 dekning |
| `dealbreaker.ts` | Sikkerhetsfiltre. 0 dekning |
| Koblingsalgoritmen | Grådig parvis: oddetall, tomt sett, dealbreakere, sperreliste |
| `journey/engine.ts` | Utvid fra faser til milepæler og innhold |
| Kohortterskel | < 20 utsetter. 72-timers ventil overstyrer |
| `journeyState`-maskinen | Alle lovlige og ulovlige overganger |

**Integrasjonstester — mot ekte Postgres (finnes i CI):**

| Mål | Ferdigkriterium |
|---|---|
| Matcherunde | N i kø → N/2 par, oddetall står igjen, alle `MATCHED` |
| `endJourney()` | **0 rader igjen** i alle berørte tabeller. `MatchHistory` skrevet. Begge `IDLE` |
| Sperreliste | To tidligere koblede blir aldri koblet igjen |
| Én reise om gangen | `MATCHED`-bruker kan ikke settes i kø |
| Dag 1-start | Journey-cron hopper over `startedAt = null` |
| Cron-auth | Mot **faktisk rute**, ikke strengmanipulasjon |
| Middleware | Forfalsket cookie → 401. Forfalsket admin → redirect |

`endJourney()`-testen er den viktigste i hele pakken. Den verifiserer produktets kjerneløfte — at data faktisk forsvinner.

**E2E — 4 spesifikasjoner finnes.** Utvides til hele verdikjeden:

```
registrer → betal (gratiskvote) → onboarding → start reisen
  → kø → matcherunde → logg inn → oppdag → chat
  → dag++ → dag 30 → avslutt → verifiser at alt er slettet
```

Dette er den ene testen som beviser at ToSom virker.

## 8.4 CI som portvakt

| Jobb | Status | Tiltak |
|---|---|---|
| `lint` | ✅ | — |
| `typecheck` | ❌ | **Fiks `cron-auth.test.ts:15`** |
| `build` | ✅ | — |
| `test` | ✅ | Erstatt stubbtester med reelle |
| `e2e` | ✅ | Utvid til full verdikjede |
| `prisma` | ✅ | — |
| `ai-guard` | ✅ | Utvid mønsteret til `components/ui/ai/` |
| `lang-guard` | ✅ | **Fanger ikke nynorsk i `journey/exit`** — utvid ordlisten |
| `cron-guard` | ✅ | Utvid: også sjekk at `maxDuration` finnes |
| `status` | ✅ | — |

**Nye guards:**

| Guard | Hindrer |
|---|---|
| `no-local-tokens` | Nye lokale tokenobjekter |
| `no-alert` | `alert()` i produksjonskode |
| `secret-scan` | Hemmeligheter i commits |
| `no-match-accept` | At samtykkeflyten sniker seg inn igjen |

Den siste er ikke paranoia. v2.0 dokumenterte at STEG 3.4 fjernet sikkerheten STEG 3.3 innførte, uten at noen merket det. **Det som er fjernet med hensikt, bør beskyttes mot å komme tilbake ved uhell.**

## 8.5 Lasttesting

Ingen k6/artillery i repoet i dag. Før åpen lansering:

| Scenario | Mål |
|---|---|
| Matcherunde, 1000 i kø | < 30 s, ingen timeout |
| Matcherunde, 10 000 i kø | < 5 min, eller utløser fase 2 |
| 500 samtidige chat-brukere | p95 < 200 ms |
| 100 samtidige onboardinger | Ingen DB-connection-utmattelse |

Særlig connection-utmattelse er en reell risiko på serverless uten pooling.

---

# DEL 9 — LANSERINGSSTRATEGI

## 9.1 Tomt-hus-problemet

ToSom har et startproblem de fleste produkter slipper: **verdien krever andre brukere.** Dag 1 med 40 registrerte gir dårlige matcher, og de første brukerne er de som avgjør omdømmet.

Kohortterskelen (DEL 2.4) beskytter mot det verste. Men strategien må planlegges:

| Grep | Effekt |
|---|---|
| **Registrering åpner før matching** | Bygg kø før første runde |
| **Annonsert første runde** | «Første matcher kobles [dato]» — skaper forventning |
| **Geografisk konsentrasjon** | Start i én region. Tettere kø, bedre matcher |
| **Invitasjonsbølger** | Slipp inn i puljer, ikke jevnt |
| **Ærlig ventetekst** | «Vi venter til vi har nok mennesker til å finne en god match til deg» |

Den siste er ikke en unnskyldning — det er ToSoms filosofi anvendt på et reelt problem. En bruker som venter to dager på en god match, er bedre stilt enn en som får en dårlig match med én gang. Det tør ToSom si høyt, og det er en del av merkevaren.

## 9.2 Fire porter

**Port 0 — Intern alfa (5–10 brukere, egne kontoer)**

Krav: nivå 0-observability, full E2E grønn, `endJourney()` verifisert.
Mål: kjør en komprimert reise ende-til-ende. Verifiser i databasen — ikke i loggen — at kobling, dag-start, dagsrulling og sletting virker.

**Port 1 — Lukket beta (50–200 inviterte, gratis)**

Krav: alle MUST FIX lukket. Rapportering på plass. Vilkår gjennomlest.
Mål: reelle mennesker, reelle matcher, reell 30-dagers reise.

Daglig oppfølging:
- Fikk alle i køen en match, eller ble runden utsatt?
- Hvor mange logget inn og oppdaget matchen innen 24 t? **Innen 48 t?**
- Hvor mange nådde dag 7? Dag 15? Dag 30?
- Hvor mange rapporterte?
- Hva sier de om matchkvaliteten?

Dette er den viktigste fasen i hele planen. Den kan ikke forkortes — 30-dagersreisen tar 30 dager, og du får ikke vite om produktet virker før noen har fullført en.

**Port 2 — Åpen beta (gratis, opptil 10 000)**

Krav: lukket beta har levert minst 20 fullførte reiser. Ingen kritiske funn åpne. Lasttest bestått.
Mål: volum. Kohortterskelen bør nås hver natt.

**Port 3 — Betaling på (etter 10 000)**

Krav: Vipps ePayment integrert og testet. Angrerett-avkrysning. Vilkår juridisk gjennomgått. Ordre-idempotens verifisert.

## 9.3 Gate-kriterier

Ingen port åpnes uten at alle punkter er grønne, verifisert i database eller HTTP-respons:

| Kriterium | Port 1 | Port 2 | Port 3 |
|---|---|---|---|
| `tsc` = 0 feil | ✅ | ✅ | ✅ |
| CI 10/10 grønn | ✅ | ✅ | ✅ |
| E2E full verdikjede | ✅ | ✅ | ✅ |
| Sentry fanger serverfeil | ✅ | ✅ | ✅ |
| Alarm på uteblitt runde | ✅ | ✅ | ✅ |
| Verifisert gjenoppretting | ✅ | ✅ | ✅ |
| Rapportering tilgjengelig | ✅ | ✅ | ✅ |
| `endJourney()` etterlater 0 rader | ✅ | ✅ | ✅ |
| 20+ fullførte reiser | — | ✅ | ✅ |
| Lasttest 10k i kø | — | ✅ | ✅ |
| Vilkår juridisk gjennomgått | — | — | ✅ |
| Vipps ePayment testet | — | — | ✅ |

## 9.4 Kill switch og rollback

**Kill switch** (`config/features.ts`, uten deploy):

| Bryter | Effekt |
|---|---|
| `MATCHING_ENABLED` | Runden hopper over. Køen består |
| `REGISTRATION_ENABLED` | Ingen nye brukere |
| `PAYMENTS_ENABLED` | Gratismodus |
| `MAINTENANCE_MODE` | `app/maintenance/` finnes allerede |

Å kunne stanse matching **uten** å ta ned nettstedet er verdifullt: oppdager du en feil i koblingslogikken kl. 05:30, vil du stoppe runden, ikke produktet.

**Rollback:** Vercel har øyeblikkelig tilbakerulling av deploys. Databasemigreringer har det ikke. Derfor:

- Additive migreringer først, brytende senere
- Verifisert backup umiddelbart før hver brytende migrering
- Brytende migreringer i lav trafikk, aldri fredag

---

# DEL 10 — ROADMAP 30/60/90

## 10.1 Prinsipper

Videreført fra v2.0, med to tillegg:

1. **Valider funksjon, ikke kompilering.** Verifisert DB-tilstand eller HTTP-respons.
2. **Ett steg om gangen.** Ingen batching.
3. **Aldri erstatt en sikkerhetsmekanisme med en svakere.**
4. **Endre konfigurasjon og kode sammen.** N-3 er beviset på at dette fortsatt skjer.
5. **Rødt er rødt.** `tsc` er rød nå. Fiks før noe annet.
6. **Slett før du bygger.**
7. **Alarmer før funksjoner.**
8. **Ro også i prosessen.**
9. 🆕 **Valider mot konseptet, ikke bare mot instruksen.** Et steg kan være perfekt utført og likevel bygge feil produkt.
10. 🆕 **Grønt er ikke bevis.** 77 grønne tester skjulte at halvparten tester stubber.

## 10.2 Dag 1–30

### BØLGE A — Rett grunnlaget (dag 1–3) 🔴

| # | Oppgave | Ferdigkriterium |
|---|---|---|
| A1 | Fiks `cron-auth.test.ts:15` | `npx tsc --noEmit` → 0 feil |
| A2 | `instrumentation.ts` + `sentry.edge.config.ts` | Testfeil fra API-rute synlig i Sentry |
| A3 | `maxDuration` i `vercel.json` | Cron kjører 60+ s uten kutt. **Avklar Vercel-plan** |
| A4 | Alarm ved uteblitt runde | Simulert stans → varsel mottatt innen 30 min |
| A5 | Fail-fast env-validering | Manglende variabel stopper oppstart |

> Ingen andre bølger starter før A er verifisert i produksjon.

### BØLGE B — Koblingsmodellen (dag 3–17) 🔴

Følger migreringsrekkefølgen i DEL 2.8, ett steg per commit.

| # | Oppgave | Ferdigkriterium |
|---|---|---|
| B1 | `journeyState` + `matchQueuedAt` + backfill | SQL-telling per verdi stemmer |
| B2 | `MatchHistory` | Tabell finnes |
| B3 | `endJourney()` + tester | 0 rader igjen. `AuditLog` skrevet |
| B4 | `JourneyProgress` match-scoped + `bothSeenAt` | Bruker kan ha reise nr. 2 |
| B5 | «Start reisen» → `QUEUED`. Fjern `OnboardingFlow.tsx:411` | Onboarding lager ingen match |
| B6 | Matcherunde: kohort, kobling, `active`, varsling | N i kø → N/2 par. Oddetall står igjen |
| B7 | Fjern samtykkeflyten | `/api/match/accept` → 404 |
| B8 | Skjemaopprydding | `prisma migrate` + `tsc` grønn |
| B9 | Dag 1 ved `bothSeenAt` | Cron hopper over `startedAt = null` |
| B10 | Dag 30 → to utganger | Begge sletter alt. Bruker er `IDLE` |

**Dette er den tyngste bølgen i planen.** 14 dager er realistisk, ikke pessimistisk.

### BØLGE C — Tillit og trygghet (dag 17–22) 🟠

| # | Oppgave |
|---|---|
| C1 | `Report`-modell + API |
| C2 | Rapporter / Avslutt / Blokker i chat og innstillinger |
| C3 | Admin-flate for rapporter |
| C4 | Logg admin-samtaleinnsyn i `AuditLog` |
| C5 | Vilkår og personvern oppdatert (sletting, avslutning, 18 år) |
| C6 | Reell kontosletting |

### BØLGE D — Frontend og UX (dag 22–28) 🟠

| # | Oppgave |
|---|---|
| D1 | `loading.tsx` + `error.tsx` på alle hovedruter |
| D2 | `global-error.tsx`. Fjern `alert()` |
| D3 | Serverside onboarding-autosave (manuell patch) |
| D4 | Kopi rettet (DEL 2.9) + nynorsk fjernet |
| D5 | Slett `components/sections/*`, `MatchActions.tsx`, Supabase-dep |
| D6 | Konsolider `app/slik/` |
| D7 | Manuell QA: full flyt på mobil og desktop |

### BØLGE E — Kvalitet (dag 28–30) 🟠

| # | Oppgave |
|---|---|
| E1 | Erstatt stubbtester med reelle |
| E2 | Enhetstester: `unifiedScorer`, `dealbreaker`, kobling, `journeyState` |
| E3 | Integrasjonstester: runde, `endJourney`, sperreliste |
| E4 | E2E full verdikjede |
| E5 | Nye CI-guards |
| E6 | Verifisert backup + gjenopprettingstest |

**Status etter 30 dager: ~82–86 %.** Klar for Port 0 og 1.

## 10.3 Dag 31–60

**BØLGE F — Lanseringsklargjøring (dag 31–37).** Fullt sett sikkerhetsheadere inkl. HSTS. Juridisk gjennomgang. Forretningsmetrikker i admin. Lasttest 1k og 10k. Kill switches. Vercel-opprydding (fjern `standalone`, arkiver `deploy/`, skriv om `LAUNCH-CHECKLIST.md`).

**BØLGE G — Lukket beta (dag 37–60).** 50–200 inviterte. Daglig oppfølging av metrikkene i DEL 7.3. Særlig: **hvor mange oppdager matchen uten varsling?** Iterasjon på matchkvalitet mot reelle data.

**Status etter 60 dager: ~92–95 %.** Første fullførte reiser i hus.

## 10.4 Dag 61–90

**BØLGE H — Åpen beta (dag 60–75).** Port 2. Gratis, opptil 10 000. Overvåk kø, runde-varighet, retensjon.

**BØLGE I — Betaling (dag 60–90, parallelt).** Vipps ePayment når kodene foreligger. `Order`, `WebhookEvent`, idempotens, angrerett. Testet i Vipps testmiljø før produksjon.

**BØLGE J — Skaleringsforberedelse (dag 75–90).** Redis-cache. Connection pooling. `lib/journey/engine.ts` → 7 moduler (**etter** tester). Én auth-inngang på alle 98 ruter. CSRF konsekvent. Prototype blocking/bucketing.

## 10.5 MUST FIX BEFORE LAUNCH

> 24 punkter. Alt annet kan vente.

**Grunnlaget (1–5)**
1. `tsc` = 0 feil
2. `instrumentation.ts` — serverside Sentry verifisert
3. `sentry.edge.config.ts`
4. `maxDuration` satt, Vercel-plan avklart
5. Fail-fast env-validering

**Koblingsmodellen (6–14)**
6. `journeyState`-maskinen håndhevet i databasen
7. `matchQueuedAt` + «Start reisen» setter `QUEUED`
8. Én matchemotor — `OnboardingFlow.tsx:411` fjernet
9. Kohortterskel med 72-timers ventil
10. Parvis kobling uten samtykke
11. Samtykkeflyten fjernet i kode, UI og skjema
12. `MatchHistory` som sperreliste
13. Dag 1 starter ved `bothSeenAt`
14. `endJourney()` — verifisert 0 gjenværende rader

**Drift (15–18)**
15. Alarm ved uteblitt matcherunde
16. Alarm på 5xx og DB-feil
17. Varslingskanal som leses
18. Verifisert backup **og** gjenoppretting

**Trygghet (19–21)**
19. Rapporter / Avslutt / Blokker
20. Vilkår og personvern oppdatert
21. Admin-samtaleinnsyn logges

**Kvalitet (22–24)**
22. CI 10/10 grønn, stubbtester erstattet
23. E2E full verdikjede inkl. sletting
24. `loading.tsx` + `error.tsx` på hovedruter

## 10.6 KAN VENTE

**Første kvartal etter lansering:** `lib/journey/engine.ts` → 7 moduler · `microcopy.ts`-oppdeling · design-token-konsolidering · én auth-inngang på 98 ruter · CSRF overalt · GDPR-dataeksport · WCAG-revisjon · ekstern penetrasjonstest · transaksjonell e-post *(hvis 7.3 viser at det trengs)* · `x-url`-avhengighet

**Senere:** Denormalisering · blocking/bucketing · worker-kø · read replicas · partisjonering · distribuert tracing · **sharding — ikke før 5–10M**

## 10.7 Risikoanalyse

| # | Risiko | Sanns. | Konsekvens | Nivå | Tiltak |
|---|---|---|---|---|---|
| R1 | `maxDuration` uteblir → cron kuttes stille | **Høy** | Kritisk | 🔴 | A3 + alarm |
| R2 | Sentry laster ikke serverside → blind drift | **Verifisert nå** | Kritisk | 🔴 | A2 |
| R3 | Koblingsmigreringen ødelegger data | Middels | Katastrofal | 🔴 | Backup, additivt først, B3-test |
| R4 | Ingen oppdager matchen uten varsling | **Middels** | Høy | 🟠 | Mål fra dag 1. Fallback: rolig e-post |
| R5 | For tynn kø ved lansering | Høy | Høy | 🟠 | Kohortterskel + lanseringsstrategi 9.1 |
| R6 | Sletting feiler på fremmednøkler | Middels | Høy | 🟠 | Eksplisitt transaksjon + integrasjonstest |
| R7 | Vipps forsinket | Middels | Middels | 🟠 | Gratis til 10 000. Adapter klar |
| R8 | Samtykkeflyten kommer tilbake ved uhell | Lav | Høy | 🟠 | CI-guard `no-match-accept` |
| R9 | Grønne tester skjuler ødelagt kode | **Pågår** | Middels | 🟠 | E1: erstatt stubber |
| R10 | Refaktorering bryter journey | Middels | Middels | 🟠 | Tester før refaktor |
| R11 | Juridisk eksponering på refusjon | Middels | Middels | 🟡 | Angrerett-avkrysning |
| R12 | Dokumentasjon motsier kode | Pågår | Middels | 🟡 | Denne planen som kanon |

**R2 og R4 er de underliggende risikoene.** R2 fordi et system som ikke kan fortelle oss at det er ødelagt, vil før eller siden være ødelagt uten at vi vet. R4 fordi den er en produkthypotese forkledd som en designbeslutning — og den må måles, ikke antas.

---

# APPENDIKS

## A.1 Verifikasjonslogg

Kjørt 13.08.2026 på commit `2d9b7fc`:

```
$ npx tsc --noEmit
__tests__/cron-auth.test.ts(15,33): error TS2339:
  Property 'replace' does not exist on type 'never'.
(1 feil)

$ npx jest
Test Suites: 4 passed, 4 total
Tests:       77 passed, 77 total

$ npx prisma format
Formatted prisma/schema.prisma in 20ms   (ingen endring — allerede formatert)

$ find app/api -name route.ts | wc -l          →  98
$ find app -name "page.tsx" -not -path "*/api/*" | wc -l  →  50
$ find app -name "loading.tsx" | wc -l         →   0
$ find app -name "error.tsx"   | wc -l         →   0
$ ls instrumentation*.ts                       →  finnes ikke
$ grep -c "onDelete: Cascade" prisma/schema.prisma  →  2
$ grep -rli "pusher"   app lib hooks components | wc -l  →  9
$ grep -rli "supabase" app lib hooks components | wc -l  →  0
$ grep -rli "stripe"   app lib components config prisma  →  0 reelle
$ git status --short                           →  rent arbeidstre
```

Manuelt lest og verifisert: `vercel.json`, `middleware.ts`, `next.config.js`, `sentry.client.config.ts`, `sentry.server.config.ts`, `.github/workflows/ci.yml`, `.github/workflows/cd.yml`, `prisma/schema.prisma`, `app/api/cron/matching/route.ts`, `app/api/cron/journey/route.ts`, `app/api/match/accept/route.ts`, `app/api/journey/exit/route.ts`, `app/onboarding/OnboardingFlow.tsx`, `components/MatchActions.tsx`, `components/dashboard/WaitingForMatch.tsx`, `lib/matching/findBestResonance.ts`, `app/priser/page.tsx`, `app/(landing)/page.tsx`.

## A.2 Nøkkeltall

| Metrikk | v2.0 | **v3.0** |
|---|---|---|
| TS/TSX-filer | ~709 | **621** |
| API-ruter | ~98 | **98** |
| Sider (ikke-API) | — | **50** (15 admin) |
| Prisma-modeller / enums | 25 / 15 | **25 / 15** |
| Migrasjoner | 8 | **8** |
| `lib/matching/` totalt / dødt | 1904 / 609 | **1316 / 0** |
| `lib/journey/engine.ts` | 1073 | **1073** |
| `components/ui/microcopy.ts` | 1703 | **1703** |
| Design-token-systemer | 2 | **3** (inkl. lokale) |
| Auth-mekanismer i bruk | 3 | **3** |
| CI-jobber (grønne) | 9 (5) | **10 (9)** |
| Testsuiter (grønne) | 4 (1) | **4 (4)** |
| Tester (reelle) | 78 | **77 (~30)** |
| E2E-spesifikasjoner | — | **4** |
| Cron-jobber (fungerende) | 2 (0) | **2 (2)** |
| `loading.tsx` / `error.tsx` | — | **0 / 0** |
| `onDelete: Cascade` | — | **2** |
| Samtykkefelt i `Match` | 5 | **5** ← skal bli 0 |
| Matchemotorer | 2 | **2** ← skal bli 1 |

## A.3 Dokumentstatus

| Dokument | Status etter v3.0 |
|---|---|
| `TOSOM-MASTERPLAN-v3.0.md` | ✅ **Kanonisk** |
| `TOSOM-MASTERPLAN-v2.0.md` | ⬇️ Erstattet → `archive/`. Historisk gyldig |
| `TOSOM-ACT-v3-FINAL-REPORT.md` | ⚠️ Behold. Scoren 87 % er for optimistisk |
| `ACT-STATE-v3.json` | ✅ Gyldig historikk |
| `TOSOM-ACT-INSTRUKS-v3.0.md` | ✅ Utført. «Sjekk 4»-metoden videreføres |
| `match-status-lifecycle.md` | ⛔ **Foreldet** — beskriver samtykkeflyten. Skrives om etter bølge B |
| `LAUNCH-CHECKLIST.md` | ⛔ **Foreldet** — beskriver Docker. Skrives om for Vercel |
| `POST-LAUNCH-HARDENING.md` | ✅ Gyldig |
| `journey-engine-refactor-plan.md` | ✅ Gyldig — utfør i bølge J |
| `design-token-migration-guide.md` | ✅ Gyldig |
| `deploy/*` | ⬇️ Arkiveres — Vercel er fasit |
| `tosom-concept-v2-skisse.md` | ✅ Konseptuelt gyldig |
| `SECURITY-STABILITY-PLAN-v1.md` | ⚠️ Stort sett løst i ACT v3 |
| `repo-structure.md` | ⚠️ Oppdateres etter bølge D |

## A.4 Neste steg

Denne masterplanen inneholder **ingen ACT-instruks**, etter samme praksis som v2.0.

Når planen er godkjent, kan `TOSOM-ACT-INSTRUKS-v4.0.md` utarbeides med bølge A–E som steg. Krav til v4.0, basert på hva som gikk galt i v3.0:

1. **Bølge A er en hard port.** Verifisert i produksjon før B starter.
2. **Sjekk 4 videreføres** — funksjonelt ferdigkriterium per steg.
3. 🆕 **Sjekk 5: konseptsamsvar.** Hvert steg svarer på: *bygger dette ToSom slik ToSom er beskrevet?* N-8 oppstod fordi ingen stilte det spørsmålet.
4. **Ett steg per commit.**
5. **Konfigurasjon og kode i samme steg.** N-3 er beviset på at regelen fortsatt brytes.
6. 🆕 **Ingen test som reimplementerer logikken den tester.**
7. 🆕 **Skjemamigreringer: additivt først, brytende samlet, alltid med verifisert backup.**

---

*TOSOM-MASTERPLAN v3.0 — Launch & Scale Edition. 13. august 2026.*
*Levende dokument. Oppdateres når bølger fullføres.*
*Alle funn er verifisert mot commit `2d9b7fc`.*
