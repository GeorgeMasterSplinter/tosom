# TOSOM-ACT-INSTRUKS-v6.0

**Lanseringskritisk utførelse — 12 steg i 5 bølger.**

| | |
|---|---|
| **Dokumentversjon** | 6.0 |
| **Dato** | 15. august 2026 |
| **Utgangscommit** | `2784ae2` |
| **Grunnlag** | `docs/TOSOM-MASTERPLAN-v5.0.md` |
| **State-fil** | `docs/ACT-STATE-v6.json` |
| **Antall steg** | 12 |
| **Antall bølger** | 5 (nummerert 0–5) |
| **Mål** | Fjerne de blokkerende kravene i masterplan del 10.4 |

> Alle steg er avledet fra verifiserte funn i masterplan v5.0. Ingen steg innfører funksjonalitet som ikke står der. Alle filankre er kontrollert mot commit `2784ae2`.

---

## Innhold

1. [ACT-regler](#1-act-regler)
2. [State-fil](#2-state-fil)
3. [Bølgeoversikt](#3-bølgeoversikt)
4. [Stegene](#4-stegene)
5. [Locking-regler](#5-locking-regler)
6. [Verifikasjonsregler](#6-verifikasjonsregler)
7. [Stop-regler](#7-stop-regler)
8. [Avslutning](#8-avslutning)

---

# 1. ACT-regler

Disse reglene er ufravikelige. Brudd på dem er grunn til å stoppe.

## 1.1 Utførelse

1. **Ett steg per ACT-kommando.** Du utfører steget du har fått, og ingenting annet.
2. **Ingen parallellitet.** Ikke start neste steg før inneværende er verifisert og locked.
3. **Ingen hopp fremover.** Steg utføres i nummerrekkefølge. Ser du et problem i et senere steg, noter det og fortsett med ditt.
4. **Ingen endring av locked steg.** Et locked steg er ferdig. Trenger det retting, krever det eksplisitt ordre fra George.
5. **Ingen nye funksjoner.** Alt du bygger skal stå i `docs/TOSOM-MASTERPLAN-v5.0.md`. Finner du ikke belegg der, stopp og spør.
6. **Ingen refaktorering uten ordre.** Ser du kode som burde vært bedre, la den stå. Noter det i `errors`-feltet som observasjon.
7. **Ingen endring av API-kontrakter uten ordre.** Eksisterende ruter beholder sine responsformater.

## 1.2 Etter hvert steg

Kjør i denne rekkefølgen:

```bash
npx tsc --noEmit
npm run build
```

Deretter stegets egen `grep`-verifikasjon. Deretter oppdater `docs/ACT-STATE-v6.json`. Deretter vent på godkjenning.

## 1.3 Områder du ikke skal røre

Følgende ble levert og verifisert i ACT v5.0. **De er utenfor v6.**

| Område | Steg i v5 | Ikke rør |
|---|---|---|
| Vilkår, angrerett, kontosletting, `JourneyStat` | B4.1–B4.6 | `app/vilkår/`, `lib/journey/endJourney.ts`, `app/api/settings/` |
| Autosave, journey-kalender, stillhetsdeteksjon | B2.2, B2.4, B2.5 | `hooks/useAutoSave*.ts`, `app/api/onboarding/draft/`, `app/api/cron/journey/` unntatt fasekode i steg 3.1 |
| Admin-flater | B5.1–B5.4 | `app/admin/`, `app/api/admin/` |
| Matching-motoren | B0.3, B1.1–B1.6 | `lib/matching/`, `lib/geo/`, `config/matching.ts` |

Finner du noe du mener er galt i disse områdene: **noter, ikke rett.**

## 1.4 Utenfor v6 av andre grunner

| Sak | Avvik | Grunn |
|---|---|---|
| Moodpersistens i database | A3 | Ikke-blokkerende → v7 |
| Serverside PDF-generering | A4 | Ikke-blokkerende → v7 |
| Cron-tid UTC mot norsk tid | A10 | Ikke-blokkerende → v7 |
| Opprydding av 53 døde ruter | A12 | Ikke-blokkerende og risikabelt → v7 |
| De 144 spørsmålene | R31 | Georges skrivejobb |
| Mobil-QA | B2.7 | Krever fysisk enhet |
| Gjenopprettingstest | A2 | Krever produksjonslik database |
| Registrering av ekstern monitor | A9 | Skjer i nettleser, ikke i repoet |

---

# 2. State-fil

## 2.1 Format

`docs/ACT-STATE-v6.json` **finnes allerede** i repoet med formatet under. Den skal aldri opprettes på nytt — kun oppdateres etter hvert steg.

```json
{
  "version": "6.0",
  "baseCommit": "2784ae2",
  "currentStep": null,
  "completedSteps": [],
  "lockedSteps": [],
  "pendingSteps": [
    "0.1", "0.2",
    "1.1", "1.2", "1.3",
    "2.1", "2.2", "2.3",
    "3.1",
    "4.1",
    "5.1", "5.2"
  ],
  "errors": [],
  "observations": [],
  "baseline": {},
  "updatedAt": ""
}
```

## 2.2 Regler for oppdatering

Etter hvert fullført steg:

1. Fjern steget fra `pendingSteps`
2. Legg det til i `completedSteps`
3. Legg det til i `lockedSteps`
4. Sett `currentStep` til neste steg i `pendingSteps`, eller `null` hvis tom
5. Sett `updatedAt` til ISO-tidsstempel
6. Ved feil: legg objekt i `errors` med `{ step, description, resolution }`
7. Ved observasjon du ikke skal handle på: legg streng i `observations`

`baseline` fylles kun i steg 0.2 og endres aldri etterpå.

---

# 3. Bølgeoversikt

| Bølge | Navn | Steg | Løser |
|---|---|---|---|
| **0** | Grunnlinje | 0.1, 0.2 | A6 |
| **1** | Systemet må se seg selv | 1.1, 1.2, 1.3 | A7, A9 |
| **2** | Ingen kall i tom luft | 2.1, 2.2, 2.3 | A8 |
| **3** | Én sannhet om fasen | 3.1 | A11 |
| **4** | Språk | 4.1 | A5 |
| **5** | Sjekk 8: observert i drift | 5.1, 5.2 | R1, R11 |

**Rekkefølgen er ikke vilkårlig.** Bølge 1 kommer først fordi ingenting kan verifiseres i et system som ikke kan rapportere at det feiler. Bølge 5 kommer sist fordi den måler resultatet av alt det andre.

---

# 4. Stegene

---

## BØLGE 0 — Grunnlinje

---

### STEG 0.1 — Rydd treet og ta state i bruk

**Formål:** Etablere et rent utgangspunkt slik at `git restore` er forutsigbar i alle senere steg.

**Avhengighet:** Ingen.

**Risiko:** Lav.

**Filanker:**
```
 M .eslintrc.json
 M app/layout.tsx
 M docs/ACT-STATE-v4.json
 D pages/README.md
 D pages/_document.tsx
?? docs/TOSOM-ACT-INSTRUKS-v5.0.md
?? docs/TOSOM-ACT-INSTRUKS-v6.0.md
?? docs/TOSOM-MASTERPLAN-v4.0.md
?? docs/TOSOM-MASTERPLAN-v5.0.md
?? docs/ACT-STATE-v6.json
?? scripts/verify-v5-seed.ts
```

**Instruks:**

1. Kjør `git diff .eslintrc.json app/layout.tsx` og les endringene. Er de forståelige og ufarlige, ta dem med. Er de uklare, **stopp og beskriv dem.**
2. `pages/_document.tsx` og `pages/README.md` er slettet. Prosjektet bruker App Router. Bekreft at `pages/`-katalogen ikke inneholder andre filer som er i bruk: `ls -la pages/ 2>/dev/null`. Er katalogen tom eller kun med rester, godta slettingen.
3. Legg til alle endrede, slettede og usporede filer, og commit dem som **én** commit.
4. `docs/ACT-STATE-v6.json` **finnes allerede** med korrekt format. Den skal ikke opprettes på nytt. Oppdater den: flytt `0.1` fra `pendingSteps` til `completedSteps` og `lockedSteps`, sett `currentStep` til `"0.2"`, og sett `updatedAt`.
5. Commit state-filen separat.

**Verifikasjon:**
```bash
git status --short          # skal gi tom utskrift
test -f docs/ACT-STATE-v6.json && echo "state finnes"
jq '.pendingSteps | length' docs/ACT-STATE-v6.json   # 11
npx tsc --noEmit
npm run build
```

**State-oppdatering:**
```
completedSteps += ["0.1"]
lockedSteps    += ["0.1"]
currentStep     = "0.2"
```

**Rollback:** `git reset --soft HEAD~2` — endringene bevares i arbeidstreet.

**Commit-mal:**
```
chore(act): rydd arbeidstre før ACT v6
chore(act): ta ACT-STATE-v6.json i bruk
```

---

### STEG 0.2 — Mål grunnlinjen

**Formål:** Fryse den målte tilstanden før noe endres, slik at hvert senere steg kan sammenlignes mot et faktum og ikke mot en antakelse.

**Avhengighet:** `0.1` må være locked.

**Risiko:** Lav — ingen kodeendring.

**Filanker:** Ingen filer endres. Kun `docs/ACT-STATE-v6.json`.

**Instruks:**

Kjør hver kommando under og skriv **det faktiske resultatet** inn i `baseline`-objektet. Ikke skriv forventede verdier. Ikke rett noe i dette steget.

```bash
npx tsc --noEmit 2>&1 | grep -c "error TS"
npx prisma format --check
npx jest 2>&1 | tail -5
npm run build 2>&1 | tail -3
grep -c withSentryConfig next.config.js
jq '.crons | length' vercel.json
test -f app/global-error.tsx && echo 1 || echo 0
```

Kryssjekk brutte kall:

```bash
for u in /api/chat/typing /api/journey/status /api/match/breakdown \
         /api/match/mark-seen /api/match/new-status /api/match/recommendations \
         /api/me /api/profile/me /api/system/mark-read; do
  [ -f "app$u/route.ts" ] || echo "MANGLER $u"
done
```

Fasedupliseringer:

```bash
grep -c "EARLY\|BUILDING_TRUST\|journeyDay <= " \
  lib/journey/engine.ts \
  app/api/cron/journey/route.ts \
  app/dashboard/journey/page.tsx \
  app/api/dashboard/overview/route.ts \
  components/journey/JourneyTimeline.tsx \
  app/chat/components/ChatHeader.tsx
```

Nynorskrester:

```bash
grep -rn "selv\|kommer\|fjernar\|Samtaler\|dypere\|verktruelege" \
  components/journey/JourneySection.tsx app/blogg/ app/chat/
```

Skriv resultatet som:

```json
"baseline": {
  "tscErrors": 0,
  "prismaFormat": "ok",
  "jest": "113/116",
  "build": "grønn",
  "withSentryConfig": 0,
  "cronCount": 2,
  "globalErrorExists": 0,
  "brokenRoutes": ["...faktisk liste..."],
  "phaseDuplicates": 6,
  "nynorskHits": 3
}
```

**Verifikasjon:**
```bash
jq '.baseline' docs/ACT-STATE-v6.json    # skal være fylt ut
jq '.baseline.brokenRoutes | length' docs/ACT-STATE-v6.json   # 9
```

**State-oppdatering:**
```
baseline        = { målte verdier }
completedSteps += ["0.2"]
lockedSteps    += ["0.2"]
currentStep     = "1.1"
```

**Rollback:** `git restore docs/ACT-STATE-v6.json`

**Commit-mal:**
```
chore(act): grunnlinjemåling før bølge 1
```

---

## BØLGE 1 — Systemet må se seg selv

> Denne bølgen løser avvik A7 og A9. Uten den kan ingen senere steg verifiseres i drift, fordi et system uten feilrapportering ikke kan fortelle at det feiler.

---

### STEG 1.1 — Aktiver Sentry i byggetrinnet

**Formål:** Koble Sentry til Next.js-byggingen slik at klient-, server- og edge-konfigurasjonen faktisk lastes.

**Avhengighet:** `0.2` må være locked.

**Risiko:** Middels — endrer byggekonfigurasjonen.

**Filanker:**
```
package.json:15                    "@sentry/nextjs": "^10.70.0"
next.config.js:1                   const path = require('path');
next.config.js:4                   const nextConfig = {
next.config.js:5-8                 webpack: (config) => { ... }
next.config.js:32-100              async headers()
next.config.js:62-77               CSP
next.config.js:140                 };
next.config.js:142                 module.exports = nextConfig;
sentry.client.config.ts
sentry.server.config.ts
sentry.edge.config.ts
instrumentation.ts:15-57
.env.example:76                    NEXT_PUBLIC_SENTRY_DSN=""
```

**Instruks:**

**Del A — fastslå hvilken konfigurasjonsfil versjonen faktisk laster.**

`@sentry/nextjs` versjon 10 kan ha flyttet klientoppsettet fra `sentry.client.config.ts` til `instrumentation-client.ts`. Dette må avgjøres av installert kode, ikke av hukommelse.

```bash
cat node_modules/@sentry/nextjs/package.json | jq '.version'
ls node_modules/@sentry/nextjs/build/cjs/config/
grep -rn "instrumentation-client" node_modules/@sentry/nextjs/build/ 2>/dev/null | head -5
```

- Finner du klare spor av `instrumentation-client`, er det den nye plasseringen.
- Finner du ingen slike spor, beholdes `sentry.client.config.ts`.
- **Er resultatet tvetydig: stopp og rapporter funnene.** Ikke gjett.

**Del B — legg wrapperen rundt konfigurasjonen.**

Erstatt `next.config.js:142` slik at `withSentryConfig` omslutter `nextConfig`:

```js
const { withSentryConfig } = require('@sentry/nextjs');

module.exports = withSentryConfig(nextConfig, {
  silent: true,
  disableLogger: true,
  widenClientFileUpload: false,
  telemetry: false,
});
```

**Krav:**
- `webpack`-funksjonen på `next.config.js:5-8` skal være uendret etterpå
- `headers()` og CSP skal være uendret
- Ingen `org`/`project`/`authToken` legges inn — kildekart lastes ikke opp i dette steget

**Del C — utvid CSP for Sentry.**

`next.config.js:70` har `connect-src`. Legg til `*.ingest.sentry.io` og `*.sentry.io`. Uten dette blokkerer nettleseren rapportene, og Sentry vil se ut til å virke uten å gjøre det.

**Del D — dokumenter DSN.**

`.env.example:76` har tom `NEXT_PUBLIC_SENTRY_DSN`. Legg til en kommentarlinje over som forklarer at verdien må settes i Vercels miljøvariabler før beta. **Ikke skriv en ekte DSN inn i repoet.**

**Verifikasjon:**
```bash
grep -c withSentryConfig next.config.js          # >= 1
grep -c "config.resolve.alias" next.config.js    # 1 — webpack bevart
grep -n "sentry.io" next.config.js               # >= 1 treff i connect-src
npx tsc --noEmit
npm run build
```

Byggeloggen skal ikke inneholde advarsler om at Sentry ikke er konfigurert. Gjør den det, **stopp og rapporter linjen**.

**State-oppdatering:**
```
completedSteps += ["1.1"]
lockedSteps    += ["1.1"]
currentStep     = "1.2"
```

**Rollback:** `git restore next.config.js .env.example`

**Commit-mal:**
```
fix(observability): aktiver Sentry i byggetrinnet
```

---

### STEG 1.2 — Global feilfanger

**Formål:** Fange serverfeil i App Router-rendering og feil som slår ut hele rot-layoutet.

**Avhengighet:** `1.1` må være locked.

**Risiko:** Lav — legger til nye filer, endrer ingen eksisterende logikk.

**Filanker:**
```
instrumentation.ts:15-57      register()
app/global-error.tsx          FINNES IKKE
app/layout.tsx                rot-layout
```

Seks `error.tsx` finnes allerede. De fanger feil innenfor sine segmenter, men ikke feil i rot-layoutet.

**Instruks:**

**Del A — `onRequestError`.**

Legg til eksport i `instrumentation.ts`:

```ts
export const onRequestError = Sentry.captureRequestError;
```

Bekreft at `Sentry.captureRequestError` faktisk finnes i installert versjon:

```bash
grep -rn "captureRequestError" node_modules/@sentry/nextjs/build/types/index.d.ts 2>/dev/null | head -3
```

Finnes den ikke under det navnet, **stopp og rapporter hvilke tilsvarende eksporter som finnes**.

**Del B — `app/global-error.tsx`.**

Opprett filen. Krav:

- `'use client'` øverst
- Tar imot `{ error, reset }`
- Rapporterer til Sentry i `useEffect`
- Rendrer **egen** `<html>` og `<body>` — global-error erstatter rot-layoutet
- Tekst på **bokmål**, i ToSoms rolige tone: ingen utropstegn, ingen «Oops»
- En knapp som kaller `reset()`

Foreslått tekst: overskrift «Noe gikk galt», brødtekst «Vi har fått beskjed. Prøv igjen om et øyeblikk.», knapp «Prøv igjen».

**Verifikasjon:**
```bash
test -f app/global-error.tsx && echo "finnes"
grep -c "use client" app/global-error.tsx           # 1
grep -c "<html" app/global-error.tsx                # 1
grep -c "onRequestError" instrumentation.ts         # 1
grep -rn "Oops\|beklager!\|ikke" app/global-error.tsx   # 0 treff
npx tsc --noEmit
npm run build
```

**State-oppdatering:**
```
completedSteps += ["1.2"]
lockedSteps    += ["1.2"]
currentStep     = "1.3"
```

**Rollback:** `git restore instrumentation.ts && rm app/global-error.tsx`

**Commit-mal:**
```
fix(observability): global feilfanger og onRequestError
```

---

### STEG 1.3 — Gjør helsesjekken eksternt kallbar

**Formål:** Løse A9. Endepunktet finnes og virker, men ingenting kaller det, og Vercel Hobby har brukt opp begge cron-plassene.

**Avhengighet:** `1.2` må være locked.

**Risiko:** Middels — endrer autentisering på et endepunkt.

**Filanker:**
```
app/api/cron/health/route.ts:22        export async function GET(req: NextRequest)
app/api/cron/health/route.ts:24-27     CRON_SECRET mangler → 500
app/api/cron/health/route.ts:29-32     Authorization-header mangler → 401
app/api/cron/health/route.ts:34-37     safeCompare feiler → 403
app/api/cron/health/route.ts:40-45     terskel 30 min, ?threshold=
app/api/cron/health/route.ts:8-9       200 OK / 503 STALE
vercel.json                            2 crons — begge brukt
```

**Instruks:**

**Del A — støtt token som query-parameter.**

Endepunktet krever i dag `Authorization: Bearer <CRON_SECRET>`. Gratis overvåkingstjenester kan ofte ikke sende egendefinerte headere.

Utvid autentiseringen slik at **begge** virker:

1. `Authorization: Bearer <secret>` — som i dag, prøves først
2. `?token=<secret>` — brukes kun hvis headeren mangler helt

**Krav som ikke kan fravikes:**
- Samme `safeCompare` med `timingSafeEqual` for begge veier
- Samme statuskoder: 500 hvis `CRON_SECRET` mangler, 401 hvis verken header eller token er gitt, 403 ved feil hemmelighet
- Ingen logging av tokenet
- Endepunktet forblir autentisert — det skal **ikke** bli åpent

**Del B — skriv `deploy/monitoring.md`.**

Nytt dokument på bokmål med:

1. Hvorfor helsesjekken ikke kan være en cron-jobb (Hobby-grensen på 2, begge brukt av matching og journey)
2. Nøyaktig URL: `https://<domene>/api/cron/health`
3. Begge autentiseringsmåter, med anbefaling om Bearer der det er mulig
4. Anbefalt intervall: 15 minutter
5. Alarmregel: varsle ved 503 eller ved manglende svar
6. Hva 503 betyr: matcherunden har ikke skrevet hjerteslag på 30 minutter
7. Hva George skal gjøre, steg for steg, i overvåkingstjenesten
8. Tydelig merknad: **dette steget fullfører repo-delen. Registrering av monitoren er en manuell oppgave utenfor ACT v6.**

**Del C — ikke rør `vercel.json`.** Cron-oppsettet skal være uendret.

**Verifikasjon:**
```bash
grep -c "searchParams.get('token')\|searchParams.get(\"token\")" app/api/cron/health/route.ts   # >= 1
grep -c "timingSafeEqual" app/api/cron/health/route.ts    # >= 1
test -f deploy/monitoring.md && echo "finnes"
git diff --stat vercel.json                                # tom — uendret
npx tsc --noEmit
npm run build
```

Funksjonell prøve, hvis en lokal server er tilgjengelig:
```bash
curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:3000/api/cron/health"                    # 401
curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:3000/api/cron/health?token=feil"         # 403
```

**State-oppdatering:**
```
completedSteps += ["1.3"]
lockedSteps    += ["1.3"]
currentStep     = "2.1"
```

**Rollback:** `git restore app/api/cron/health/route.ts && rm deploy/monitoring.md`

**Commit-mal:**
```
fix(ops): helsesjekk kallbar fra ekstern overvåking
```

---

## BØLGE 2 — Ingen kall i tom luft

> Løser avvik A8. Ni fetch-kall peker på ruter som ikke finnes. Build er grønn fordi Next.js ikke validerer fetch-strenger.

**Felles mønster for alle nye ruter i denne bølgen.**

Autentisering — `requireAuth(req)` brukes i 42 ruter mot 26 for `getServerSession()`. **Bruk `requireAuth`.** Mønster fra `app/api/journey/progress/route.ts:22-26`:

```ts
const result = await requireAuth(req);
if (result instanceof NextResponse) return result;
const user = result.user;
```

Prisma — importer alltid singleton fra `@/lib/prisma`. **Aldri `new PrismaClient()`.** Dette ble rettet i B0.8 og skal ikke gjeninnføres.

Responsformat — følg mønsteret i `app/api/chat/conversations/route.ts`.

---

### STEG 2.1 — Tre ruter kjernereisen trenger

**Formål:** Rette de tre brutte kallene som rammer alle brukere hver gang.

**Avhengighet:** `1.3` må være locked.

**Risiko:** Middels — nye ruter mot eksisterende klientkontrakter.

**Filanker:**
```
app/dashboard/page.tsx:126           fetch('/api/journey/status')
app/profile/page.tsx:42              fetch('/api/profile/me')
components/NotificationCenter.tsx:27 fetch("/api/system/mark-read", { method: "POST" })

Mal for auth + respons:  app/api/chat/conversations/route.ts
Mal for reisedata:       app/api/dashboard/overview/route.ts
```

**Instruks:**

**Kontrakten utledes fra kallstedet, ikke fra fantasi.** For hver rute: les kallstedet og 30 linjer rundt det, og skriv ned nøyaktig hvilke felter klienten leser og hva den gjør ved feil. Bygg responsen etter det.

**Del A — `GET /api/journey/status`**

1. Les `app/dashboard/page.tsx:110-160`. Noter hvert felt som leses ut av responsen, og fallback-verdien i catch-blokken.
2. Se hva `app/api/dashboard/overview/route.ts` allerede returnerer. Overlapper det, gjenbruk samme feltnavn og typer.
3. Opprett `app/api/journey/status/route.ts` med `GET`.
4. Returner brukerens reisetilstand: `journeyState`, gjeldende dag, fase, og eventuell `conversationId`.
5. Bruker uten aktiv reise skal gi **200 med tom tilstand**, ikke 404. Dashbordet skal ikke feile for en bruker i `IDLE`.

**Del B — `GET /api/profile/me`**

1. Les `app/profile/page.tsx:30-70`. Noter feltene som brukes.
2. Opprett `app/api/profile/me/route.ts` med `GET`.
3. Returner den innloggede brukerens egen profil.
4. **Ikke returner `latitude` eller `longitude`.** Posisjon er utledet fra postnummer og hører ikke hjemme i en klientrespons. `postalCode` og `city` er greit.

**Del C — `POST /api/system/mark-read`**

1. Les `components/NotificationCenter.tsx:15-45`. Noter om kallet har body, og om responsen brukes.
2. Opprett `app/api/system/mark-read/route.ts` med `POST`.
3. Marker den innloggede brukerens uleste systemmeldinger som lest.
4. **Les `app/api/notifications/[id]/read/route.ts` først.** Den ruten finnes allerede og markerer én enkelt melding som lest. Bruk samme modell og samme felt — `mark-read` er massevarianten av den samme handlingen.
5. Finner du likevel ingen egnet modell, **stopp og rapporter.** Ikke opprett en ny modell i dette steget.

**Verifikasjon:**
```bash
for r in journey/status profile/me system/mark-read; do
  test -f "app/api/$r/route.ts" && echo "OK $r" || echo "MANGLER $r"
done

grep -c "requireAuth" app/api/journey/status/route.ts app/api/profile/me/route.ts app/api/system/mark-read/route.ts
grep -rn "new PrismaClient" app/api/journey/status app/api/profile/me app/api/system/mark-read   # 0 treff
grep -n "latitude\|longitude" app/api/profile/me/route.ts                                        # 0 treff
npx tsc --noEmit
npm run build
```

**State-oppdatering:**
```
completedSteps += ["2.1"]
lockedSteps    += ["2.1"]
currentStep     = "2.2"
```

**Rollback:** `rm -rf app/api/journey/status app/api/profile/me app/api/system/mark-read`

**Commit-mal:**
```
fix(api): journey/status, profile/me og system/mark-read
```

---

### STEG 2.2 — Resonansforklaring og skriveindikator

**Formål:** Rette de to gjenværende brutte kallene som har reell funksjon i grensesnittet.

**Avhengighet:** `2.1` må være locked.

**Risiko:** Middels.

**Filanker:**
```
components/MatchBreakdown.tsx:35      fetch(`/api/match/breakdown?targetUserId=${targetUserId}`)
components/chat/ChatRoom.tsx:174      fetch('/api/chat/typing', ...)
components/chat/ChatRoom.tsx:190      fetch('/api/chat/typing', ...)

lib/matching/unifiedScorer.ts:56      unifiedScore(a, b) → 0-100
lib/matching/resonanceLevel.ts:17     toResonanceLevel(score)
lib/matching/weightConfig.ts:17       DEFAULT_WEIGHTS
```

**Instruks:**

**Del A — `GET /api/match/breakdown`**

1. Les `components/MatchBreakdown.tsx` i sin helhet, og `components/MatchBreakdownItem.tsx`. Noter den nøyaktige formen komponenten forventer per dimensjon.
2. Opprett `app/api/match/breakdown/route.ts` med `GET` og `?targetUserId=`.
3. Autentiser. Verifiser at innlogget bruker faktisk **er koblet til** `targetUserId` — er de ikke det, returner 403. En bruker skal ikke kunne be om resonansdata for vilkårlige personer.
4. Bruk `unifiedScore` fra `lib/matching/unifiedScorer.ts` med de fem dimensjonene fra `weightConfig.ts`.

**Konseptregel fra masterplan del 1.4 (I-12) — gjeldende form (beslutning B, 2026-08-15):**

> Responsen inneholder numeriske verdier som transportdata. **Klientkomponenten** (allerede implementert i B1.5) konverterer til ORD via `toResonanceLevel` + `resonanceLabel` / `toDimensionLabel`. Brukeren ser aldri et tall.

API-et returnerer `{ totalScore: number, breakdown: { base, resonance, semantic, intimacy, future } }` — alle verdier 0-100. Dette matcher den låste klientkontrakten i `components/MatchBreakdown.tsx`. Farge- og bue-visningen i klienten driver på tallene; display er 100 % ORD.

**Del B — `POST /api/chat/typing`**

1. Les `components/chat/ChatRoom.tsx:160-200`. Noter body-formen og om responsen brukes.
2. Opprett `app/api/chat/typing/route.ts` med `POST`.
3. Autentiser og verifiser at brukeren deltar i samtalen.
4. Send hendelsen videre via Pusher. Finn eksisterende Pusher-serveroppsett og gjenbruk det — **ikke opprett en ny klient.**
5. **Ingenting skrives til databasen.** En skriveindikator er flyktig. En rad per tastetrykk er en skaleringsfeil ved 300 000 brukere.
6. Returner 204 eller 200 med tom kropp.

**Verifikasjon:**
```bash
test -f app/api/match/breakdown/route.ts && echo OK
test -f app/api/chat/typing/route.ts && echo OK

# konseptregel (B): API returnerer tall som transportdata, klient konverterer til ORD
grep -c "unifiedScore" app/api/match/breakdown/route.ts            # >= 1
grep -c "totalScore" app/api/match/breakdown/route.ts              # >= 1
grep -c "requireAuth" app/api/match/breakdown/route.ts             # >= 1
grep -c "403" app/api/match/breakdown/route.ts                     # >= 1 (ikke koblet)

grep -c "prisma\." app/api/chat/typing/route.ts                    # kun deltakersjekk
grep -c "triggerTyping" app/api/chat/typing/route.ts               # >= 1
grep -rn "new Pusher" app/api/chat/typing/route.ts                 # 0 treff
npx tsc --noEmit
npm run build
```

Tallene i responsen er transportdata. Brukeren ser kun ORD (B1.5-klientkontrakt). Ingen verifikasjon motviser tall i nettverks-responsen lenger.

**State-oppdatering:**
```
completedSteps += ["2.2"]
lockedSteps    += ["2.2"]
currentStep     = "2.3"
```

**Rollback:** `rm -rf app/api/match/breakdown app/api/chat/typing`

**Commit-mal:**
```
fix(api): resonansforklaring uten tall og skriveindikator
```

---

### STEG 2.3 — Fjern døde kall og innfør kryssjekk

**Formål:** Fjerne de fire kallene som ikke har noen funksjon, og hindre at problemet oppstår på nytt.

**Avhengighet:** `2.2` må være locked.

**Risiko:** Middels — fjerner kode fra komponenter.

**Filanker:**
```
/api/match/mark-seen
/api/match/new-status
/api/match/recommendations
/api/me
app/api/payment/create-checkout-session/     tom katalog, ingen route.ts
```

**Instruks:**

**Del A — finn kallstedene.**

```bash
grep -rn "api/match/mark-seen\|api/match/new-status\|api/match/recommendations\|'/api/me'\|\"/api/me\"" \
  app components hooks --include=*.ts --include=*.tsx
```

**Del B — for hvert kall, avgjør etter denne regelen:**

- Er koden rundt kallet **død** — komponenten rendres ikke, eller resultatet brukes ikke: fjern kallet og den koden som kun fantes for det.
- Er koden rundt kallet **levende** — den påvirker noe brukeren ser: **stopp og rapporter.** Da må ruten implementeres, ikke kallet fjernes, og det er en beslutning George tar.

Fjern aldri en hel komponent i dette steget. Kun kallet og dets umiddelbare bruk.

**Del C — fjern den tomme betalingskatalogen.**

```bash
ls -la app/api/payment/create-checkout-session/
```

Er den tom, slett den. Inneholder den noe, **stopp og rapporter**.

**Del D — kryssjekk i CI.**

Opprett `scripts/verify-api-links.mjs`. Krav:

1. Finn alle `fetch('/api/…')` i `app/`, `components/` og `hooks/`
2. Kryss dem mot faktiske `route.ts`-filer under `app/api/`
3. Håndter dynamiske segmenter: `/api/chat/conversation/abc` skal matche den faktiske ruten `app/api/chat/conversation/[conversationId]/route.ts`. Andre dynamiske ruter som må matche: `app/api/questions/[category]/`, `app/api/presence/get/[id]/`, `app/api/match/[id]/complete/`, `app/api/notifications/[id]/read/`
4. Ignorer NextAuth-stier under `/api/auth/` — de dekkes av `[...nextauth]`
5. Skriv ut hvert brutt kall med fil og linjenummer
6. `process.exit(1)` ved treff, `exit(0)` ellers

Legg til i `package.json`:

```json
"verify:api": "node scripts/verify-api-links.mjs"
```

**Verifikasjon:**
```bash
npm run verify:api          # exit 0, ingen brutte kall
echo "exit=$?"

grep -rn "api/match/mark-seen\|api/match/new-status\|api/match/recommendations" \
  app components hooks --include=*.tsx --include=*.ts | wc -l    # 0

test -d app/api/payment/create-checkout-session && echo "FEIL: katalogen finnes" || echo "OK"
npx tsc --noEmit
npm run build
```

Prøv at vakten faktisk fanger noe: legg midlertidig inn `fetch('/api/finnes-ikke')` i en fil, kjør `npm run verify:api`, bekreft exit 1, fjern linjen igjen.

**State-oppdatering:**
```
completedSteps += ["2.3"]
lockedSteps    += ["2.3"]
currentStep     = "3.1"
```

**Rollback:** `git restore app components hooks package.json && rm scripts/verify-api-links.mjs`

**Commit-mal:**
```
fix(api): fjern døde kall og innfør kryssjekk i CI
```

---

## BØLGE 3 — Én sannhet om fasen

---

### STEG 3.1 — Konsolider fasedefinisjonen

**Formål:** Løse A11. Fasedefinisjonen finnes seks steder, hvorav to motsier de andre. En bruker på dag 12 kan se tre ulike svar.

**Avhengighet:** `2.3` må være locked.

**Risiko:** Høy — berører både server- og klientkode.

**Filanker:**

Kanonisk kilde:
```
lib/journey/engine.ts:23           import { JourneyPhase } from "@prisma/client"
lib/journey/engine.ts:24           import type { SystemMessage, SystemEvent }
lib/journey/engine.ts:188          JOURNEY_TOTAL_DAYS = 30
lib/journey/engine.ts:191-221      PHASE_CONFIGS
lib/journey/engine.ts:197-202        EARLY 1-14
lib/journey/engine.ts:204-208        BUILDING_TRUST 15-21
lib/journey/engine.ts:210-214        DEEPER 22-25
lib/journey/engine.ts:216-220        CHECKIN 26-30
lib/journey/engine.ts:224-230      THEME_RANGES
lib/journey/engine.ts:277-290      getPhaseForDay()
lib/journey/engine.ts:297-299      isPhotosAllowed()
```

Dupliseringer som skal erstattes:
```
app/api/cron/journey/route.ts:137-142        lokal fasefunksjon
app/dashboard/journey/page.tsx:17-26         PHASES-array
app/api/dashboard/overview/route.ts:211-228  getPhaseTitle / getPhaseDescription
components/journey/JourneyTimeline.tsx:15-22 AVVIKENDE: 6 faser i femdagersbolker
app/chat/components/ChatHeader.tsx:78        AVVIKENDE: journeyDay <= 10
```

**Klientsikkerhet er bekreftet.** `lib/journey/engine.ts` importerer kun `JourneyPhase` — en ren TypeScript-enum — og én `import type` som strippes ved kompilering. Ingen `prisma`-klient, ingen `server-only`, ingen node-moduler. To klientkomponenter importerer allerede fra filen: `components/journey/JourneySummaryMini.tsx:3` og `components/journey/JourneyView.tsx:3`.

**Instruks:**

1. Bekreft at `getPhaseForDay` og `PHASE_CONFIGS` er eksportert fra `lib/journey/engine.ts`. Er de ikke det, legg til eksport — men **endre ikke logikken**.

2. Erstatt hver av de fem dupliseringene med import fra `lib/journey/engine.ts`.

3. **De to avvikende stedene** — `JourneyTimeline.tsx:15-22` og `ChatHeader.tsx:78` — endrer synlig atferd. Behandle dem slik:
   - `ChatHeader.tsx:78` bruker `journeyDay <= 10` for å vise «Bli kjent». Erstatt med `getPhaseForDay(journeyDay)` og vis fasens tekst fra `PHASE_CONFIGS`.
   - `JourneyTimeline.tsx:15-22` har seks faser i femdagersbolker mot kanoniske fire. Erstatt med de fire fra `PHASE_CONFIGS`. **Ser tidslinjen visuelt brutt ut med fire i stedet for seks: stopp og rapporter før du endrer utseendet.**

4. Ingen fil skal etter dette definere fasegrenser lokalt.

5. **Ikke rør `THEME_RANGES`.** Tema er en egen akse med andre grenser. Det er dokumentert i masterplan del 4.1 og skal ikke slås sammen med faser.

**Verifikasjon:**
```bash
# ingen lokale fasedefinisjoner igjen
grep -n "EARLY\|BUILDING_TRUST\|DEEPER\|CHECKIN" \
  app/api/cron/journey/route.ts \
  app/dashboard/journey/page.tsx \
  app/api/dashboard/overview/route.ts \
  components/journey/JourneyTimeline.tsx \
  app/chat/components/ChatHeader.tsx

# alle fem importerer nå fra engine
grep -c "from '@/lib/journey/engine'\|from \"@/lib/journey/engine\"" \
  app/api/cron/journey/route.ts \
  app/dashboard/journey/page.tsx \
  app/api/dashboard/overview/route.ts \
  components/journey/JourneyTimeline.tsx \
  app/chat/components/ChatHeader.tsx

grep -c "journeyDay <= 10" app/chat/components/ChatHeader.tsx     # 0
grep -c "THEME_RANGES" lib/journey/engine.ts                      # uendret
npx tsc --noEmit
npm run build
npx jest __tests__/journey-engine.test.ts
```

Treff i første grep er kun akseptabelt hvis det er en **import** av navnet, ikke en definisjon.

**State-oppdatering:**
```
completedSteps += ["3.1"]
lockedSteps    += ["3.1"]
currentStep     = "4.1"
```

**Rollback:** `git restore app/api/cron/journey/route.ts app/dashboard/journey/page.tsx app/api/dashboard/overview/route.ts components/journey/JourneyTimeline.tsx app/chat/components/ChatHeader.tsx lib/journey/engine.ts`

**Commit-mal:**
```
refactor(journey): én sannhetskilde for fasedefinisjonen
```

---

## BØLGE 4 — Språk

---

### STEG 4.1 — Rett nynorsk og innfør språkvakt

**Formål:** Løse A5. To brukersynlige tekster er på nynorsk, én av dem inneholder et ord som ikke finnes.

**Avhengighet:** `3.1` må være locked.

**Risiko:** Lav.

**Filanker:**
```
components/journey/JourneySection.tsx:46
  5: { theme: 'Stille stunder', question: 'Hvor føler du deg mest deg selv — når er du helt deg selv?' }

app/blogg/[slug]/page.tsx:46
  «Når du fjernar alt støyen, kommer det ekte tilbake. Folk blir seg selve.
   Samtaler blir dypere. Forbinder blir verktruelege.»

app/chat/[id]/ChatPageClient.tsx:39      kommentar, ikke synlig
config/matching.ts:2-3                   kommentar, ikke synlig
lib/journey/engine.ts:803                dagsimpuls — kontroller om den vises
deploy/backup.md                         dokumentasjon
```

**Instruks:**

**Del A — `JourneySection.tsx:46`.**

Setningen blander målform i samme setning: «deg selv» og «deg selv». Rett til konsekvent bokmål. Behold spørsmålets rytme — dette er dagsimpulsen for dag 5, tekst brukeren møter i et sårbart øyeblikk. Unngå å gjøre den lengre.

**Del B — `app/blogg/[slug]/page.tsx:46`.**

Hele avsnittet skrives om til bokmål. Merk at siste setning er grammatisk brutt og inneholder ordet «verktruelege», som ikke finnes på noe norsk. Skriv setningen om til noe som betyr det den forsøkte å bety.

**Del C — kommentarene.**

`ChatPageClient.tsx:39` og `config/matching.ts:2-3` rettes. Rene kommentarer, ingen funksjonell risiko.

**Del D — `lib/journey/engine.ts:803`.**

Kontroller om denne teksten vises til bruker. Gjør den det, rett den. Er den kun intern, la den stå og noter i `observations`.

**Del E — `deploy/backup.md`.** La den stå. Rettes i v7.

**Del F — språkvakt.**

Opprett `scripts/verify-language.mjs`. Krav:

1. Søk i `app/` og `components/`, kun `.tsx`
2. Ordliste med **ordgrenser**: `ikke`, `hvordan`, `selv`, `selve`, `kommer`, `finnes`, `fjernar`, `Samtaler`, `dypere`, `eine`, `kilden`, `noen`
3. Ordgrenser er avgjørende — uten dem gir «selv**kommer**t» falske treff
4. Skriv ut fil, linjenummer og treffet
5. `process.exit(1)` ved treff

Legg til i `package.json`:

```json
"verify:lang": "node scripts/verify-language.mjs"
```

**Verifikasjon:**
```bash
npm run verify:lang         # exit 0
echo "exit=$?"

grep -rn "verktruelege" app/ components/                          # 0 treff
grep -n "selv" components/journey/JourneySection.tsx             # 0 treff
grep -rn "deg selv" components/journey/JourneySection.tsx         # >= 1
npx tsc --noEmit
npm run build
```

**State-oppdatering:**
```
completedSteps += ["4.1"]
lockedSteps    += ["4.1"]
currentStep     = "5.1"
```

**Rollback:** `git restore components/journey/JourneySection.tsx app/blogg app/chat config/matching.ts package.json && rm scripts/verify-language.mjs`

**Commit-mal:**
```
fix(copy): bokmål i brukersynlig tekst og språkvakt i CI
```

---

## BØLGE 5 — Sjekk 8: observert i drift

> Dette er den nye kontrollen masterplan v5.0 innfører. **Et steg som endrer atferd teller ikke før atferden er sett** — med en logglinje eller en databasetilstand som bevis.
>
> Ingenting i denne bølgen handler om å skrive kode. Alt handler om å se om koden virker.

---

### STEG 5.1 — Database opp og alle tester grønne

**Formål:** Løse R11. Tre integrasjonstester for `endJourney()` har aldri kjørt. Funksjonen sletter uopprettelig.

**Avhengighet:** `4.1` må være locked.

**Risiko:** Lav for koden, høy i betydning.

**Filanker:**
```
docker-compose.test.yml           ports: "5433:5432"
__tests__/integration/endJourney.test.ts:21    beforeAll
lib/journey/endJourney.ts
```

**Instruks:**

1. Start testdatabasen:

```bash
docker compose -f docker-compose.test.yml up -d
```

**Stop-regel:** Svarer ikke Docker, eller er porten opptatt — stopp, rapporter feilmeldingen, og foreslå to løsninger. Ikke endre porten på egen hånd.

2. Vent til databasen svarer. Kontroller:

```bash
docker compose -f docker-compose.test.yml ps
```

3. Kjør migrasjonene mot testdatabasen:

```bash
npx prisma migrate deploy
npx prisma migrate status
```

4. Kjør hele testsuiten:

```bash
npx jest
```

**Krav: 116/116.**

5. Feiler noen av de tre `endJourney`-testene på **logikk** og ikke på tilkobling: **stopp umiddelbart og rapporter hvilken assertion som feilet.** Ikke rett `endJourney.ts` i dette steget. Denne funksjonen sletter alt innhold i en reise permanent, og en endring gjort i farten er ikke akseptabel.

6. Skriv resultatet til `observations` i state-filen: nøyaktig testantall og kjøretid.

**Verifikasjon:**
```bash
npx jest 2>&1 | tail -5          # Tests: 116 passed, 116 total
docker compose -f docker-compose.test.yml ps
npx prisma migrate status
```

**State-oppdatering:**
```
observations   += ["5.1: jest <faktisk resultat>, migrate status <resultat>"]
completedSteps += ["5.1"]
lockedSteps    += ["5.1"]
currentStep     = "5.2"
```

**Rollback:** Ingen kodeendring. `docker compose -f docker-compose.test.yml down -v` nullstiller databasen.

**Commit-mal:**
```
test: integrasjonstester grønne mot Postgres
```

---

### STEG 5.2 — Kjør matcherunden og observer den

**Formål:** Løse R1 — den viktigste udokumenterte funksjonen i systemet. Matcherunden har aldri kjørt mot en ekte database med ekte brukere.

**Avhengighet:** `5.1` må være locked.

**Risiko:** Høy i betydning. Dette steget avgjør om ToSom fungerer.

**Filanker:**
```
app/api/cron/matching/route.ts:30      TIME_BUDGET_MS = 50_000
app/api/cron/matching/route.ts:61-74   CRON_SECRET
app/api/cron/matching/route.ts:77-87   kill switch
config/matching.ts:10                  MIN_COHORT_SIZE = 20
config/matching.ts:11                  MAX_QUEUE_WAIT_HOURS = 72
config/matching.ts:14                  MIN_SCORE = 40
lib/matching/dealbreaker.ts:174        sjekkAlleDealbreakers
scripts/verify-v5-seed.ts              eksisterende seed-skript — les det først
```

**Instruks:**

**Del A — logg avvisningsårsak (tiltak T2 i masterplan).**

Uten dette er en runde som kobler null par umulig å diagnostisere.

Utvid loggingen i `app/api/cron/matching/route.ts` slik at runden teller opp per årsak:

```
antall i kø
antall par vurdert
avvist: modenhetsgap
avvist: livsrytme
avvist: eksplisitte preferanser
avvist: grenser
avvist: radius
avvist: sikkerhetsnivå
avvist: score under MIN_SCORE
par opprettet
```

Skriv summeringen til `SystemLog` ved rundens slutt. **Ikke endre matchelogikken** — kun tellere og logging.

**Del B — seed 40 brukere.**

Les `scripts/verify-v5-seed.ts` først; finnes brukbar kode der, gjenbruk den.

Krav til populasjonen:
- 40 brukere med fullstendig profil
- Postnummer spredt over minst 5 landsdeler
- `distancePref` variert mellom 25 og 300 km
- `journeyState = QUEUED`, `queuedAt` satt til nå
- Varierte verdier på de feltene dealbreakerne leser — ellers avvises alt eller ingenting

```sql
SELECT COUNT(*) FROM "User" WHERE "journeyState" = 'QUEUED';   -- 40
SELECT COUNT(*) FROM "Profile" WHERE "latitude" IS NOT NULL;   -- 40
```

Er den andre spørringen under 40, **stopp**. Uten koordinater feiler radiussjekken stille.

**Del C — kjør runden.**

```bash
curl -i -X GET http://localhost:3000/api/cron/matching \
  -H "Authorization: Bearer $CRON_SECRET"
```

**Del D — verifiser.** Alle seks spørringene skal kjøres og resultatet skrives til state.

```sql
-- 1. Antall par
SELECT COUNT(*) FROM "Match" WHERE "createdAt" > NOW() - INTERVAL '5 minutes';
-- krav: >= 15

-- 2. Ingen bruker i to matcher — den viktigste spørringen
SELECT "userId", COUNT(*) FROM (
  SELECT "userAId" AS "userId" FROM "Match"
  UNION ALL
  SELECT "userBId" FROM "Match"
) t GROUP BY "userId" HAVING COUNT(*) > 1;
-- krav: 0 rader

-- 3. Terskelen håndhevet
SELECT MIN("score"), MAX("score"), AVG("score") FROM "Match"
WHERE "createdAt" > NOW() - INTERVAL '5 minutes';
-- krav: MIN >= 40, MAX <= 100

-- 4. Resonansnivå varierer
SELECT "resonanceLevel", COUNT(*) FROM "Match"
WHERE "createdAt" > NOW() - INTERVAL '5 minutes'
GROUP BY "resonanceLevel";
-- krav: minst to ulike nivåer

-- 5. Avvisningslogg skrevet
SELECT * FROM "SystemLog" ORDER BY "createdAt" DESC LIMIT 3;

-- 6. Radius respektert
SELECT m.id, pa."distancePref" AS grense_a, pb."distancePref" AS grense_b
FROM "Match" m
JOIN "Profile" pa ON pa."userId" = m."userAId"
JOIN "Profile" pb ON pb."userId" = m."userBId"
WHERE m."createdAt" > NOW() - INTERVAL '5 minutes';
```

For spørring 6: beregn haversine-avstand per par og kontroller mot **begge** grenser. **Ett brudd er én for mye** — den tosidige sperren virker da ikke.

**Del E — kill switch.**

```bash
MATCHING_ENABLED=false curl -X GET http://localhost:3000/api/cron/matching \
  -H "Authorization: Bearer $CRON_SECRET"
```

Krav: HTTP 200 med `skipped: true`, ingen nye matcher, og alle `QUEUED` forblir `QUEUED`.

**Del F — skriv observasjonen.**

Alle seks resultatene skrives til `observations`. **Dette er beviset Sjekk 8 krever.** Uten det er steget ikke fullført, uansett hvor grønn koden er.

**Stop-regler for dette steget:**

| Funn | Handling |
|---|---|
| 0 par opprettet | Stopp. Rapporter avvisningsfordelingen fra Del A. Ikke endre terskler på egen hånd. |
| Bruker i to matcher | Stopp umiddelbart. Dette er en kritisk feil i parkoblingen. |
| Score under 40 | Stopp. Terskelen håndheves ikke. |
| Alle matcher `GENTLE` | Stopp. Resonansnivået beregnes ikke — samme feil som I-12. |
| Radiusbrudd | Stopp. Den tosidige sperren virker ikke. |

**Verifikasjon:**
```bash
grep -c "avvist\|rejected\|rejectionReason" app/api/cron/matching/route.ts    # >= 6
npx tsc --noEmit
npm run build
npx jest
jq '.observations' docs/ACT-STATE-v6.json     # skal inneholde alle seks resultatene
```

**State-oppdatering:**
```
observations   += ["5.2: <alle seks spørringsresultater>"]
completedSteps += ["5.2"]
lockedSteps    += ["5.2"]
currentStep     = null
```

**Rollback:** `git restore app/api/cron/matching/route.ts` og `docker compose -f docker-compose.test.yml down -v`

**Commit-mal:**
```
feat(match): avvisningslogg per årsak og første observerte runde
```

---

# 5. Locking-regler

## 5.1 Når et steg er ferdig

Når verifikasjonen er grønn og state er oppdatert, skriv **nøyaktig** denne setningen:

```
Steg X.Y er nå locked. Ikke endre dette senere.
```

Deretter:

1. Legg steget i `lockedSteps`
2. Vent på godkjenning fra George
3. Start ikke neste steg før du har fått den

## 5.2 Hva locking betyr

Et locked steg er ferdig. Du skal ikke:

- endre filene det berørte, med mindre et senere steg eksplisitt nevner dem
- «forbedre» det du gjorde
- rette stil, navn eller struktur i etterkant
- legge til funksjonalitet du kom på senere

Ser du et problem i et locked steg: **skriv det i `errors` og fortsett.** George avgjør.

## 5.3 Eneste unntak

George kan gi ordren:

```
Lås opp steg X.Y
```

Da, og bare da, kan steget endres. Er du i tvil: det er ikke gitt.

---

# 6. Verifikasjonsregler

## 6.1 Fast rekkefølge

Etter hvert steg, i denne rekkefølgen:

```bash
# 1. Typer
npx tsc --noEmit

# 2. Bygg  (= prisma generate && next build)
npm run build

# 3. Stegets egen grep — se stegets verifikasjonsblokk

# 4. Tester, fra og med steg 5.1
npx jest
```

Feiler ett av disse: **stopp.** Ikke gå videre. Ikke prøv å rette flere ting samtidig.

## 6.2 Fra og med steg 2.3 og 4.1

Når vaktene finnes, kjøres de også:

```bash
npm run verify:api
npm run verify:lang
```

## 6.3 Hva som teller som bestått

| Sjekk | Krav |
|---|---|
| tsc | 0 feil |
| build | Grønn, ingen nye advarsler |
| grep | Nøyaktig det stegets verifikasjonsblokk krever |
| jest | 113/116 før steg 5.1, **116/116** etter |
| Sjekk 8 | Observert atferd skrevet til `observations` |

## 6.4 Sjekk 8 — observert i drift

Dette er den nye kontrollen fra masterplan v5.0, og den gjelder alle steg som endrer atferd.

Et steg er ikke ferdig når koden er skrevet. Det er ferdig når atferden er **sett**:

| Steg | Bevis |
|---|---|
| 1.1 | Bygget kjører uten Sentry-advarsel, `withSentryConfig` i konfigurasjonen |
| 1.2 | `app/global-error.tsx` finnes og kompilerer |
| 1.3 | `curl` gir 401 uten token, 403 med feil token |
| 2.1–2.2 | `npm run verify:api` gir exit 0 |
| 2.3 | Vakten fanger et bevisst innført brudd, deretter exit 0 |
| 3.1 | `grep` finner ingen lokale fasedefinisjoner |
| 4.1 | `npm run verify:lang` gir exit 0 |
| 5.1 | 116/116 |
| 5.2 | Alle seks spørringene besvart og skrevet til state |

De fire kritiske funnene i masterplan v5.0 — A7, A8, A9, A11 — hadde alle samme signatur: **koden fantes, koden var riktig, og ingenting kalte den.** Sjekk 8 finnes for å fange nettopp dette.

---

# 7. Stop-regler

## 7.1 Når du skal stoppe

Stopp umiddelbart hvis:

1. Du ikke finner en fil som er oppgitt som filanker
2. Filens innhold avviker vesentlig fra det ankeret beskriver
3. `npx tsc --noEmit` gir feil
4. `npm run build` feiler
5. En `grep`-verifikasjon gir uventet resultat
6. En test som var grønn blir rød
7. Instruksen er tvetydig og du må gjette
8. Du oppdager at en endring vil berøre et låst område fra del 1.3
9. En stop-regel i selve steget utløses

## 7.2 Hvordan du stopper

```
STOPP — Steg X.Y

Hva jeg forsøkte:
  <konkret handling>

Hva som skjedde:
  <faktisk feilmelding eller funn, ordrett>

Hvorfor jeg ikke fortsetter:
  <kort begrunnelse>

Løsning 1: <forslag>
  Konsekvens: <hva det medfører>

Løsning 2: <forslag>
  Konsekvens: <hva det medfører>

Venter på godkjenning.
```

Skriv samtidig et objekt i `errors`:

```json
{ "step": "X.Y", "description": "...", "resolution": "venter" }
```

## 7.3 Hva du aldri gjør ved feil

- Ikke prøv en tredje, fjerde og femte variant på egen hånd
- Ikke utvid omfanget for å komme rundt problemet
- Ikke deaktiver en test som feiler
- Ikke legg til `// @ts-ignore` eller `any` for å få `tsc` grønn
- Ikke hopp over steget og gå videre
- Ikke endre et locked steg for å løse et nytt problem

**To forsøk. Deretter stopp.** Dette er regelen som hindrer løkker.

---

# 8. Avslutning

## 8.1 Når alle 12 steg er locked

Kjør full verifikasjon:

```bash
npx tsc --noEmit
npx prisma format --check
npx jest
npm run build
npm run verify:api
npm run verify:lang
```

**Krav:** 0 typefeil, format OK, 116/116, build grønn, begge vakter exit 0.

## 8.2 Sammenlign med masterplan v5.0

Gå gjennom del 10.4 og rapporter status per krav:

| # | Krav fra masterplan 10.4 | Dekkes av |
|---|---|---|
| 1 | Sentry aktivert med `withSentryConfig` | Steg 1.1 |
| 2 | Alle 9 brutte kall rettet | Steg 2.1, 2.2, 2.3 |
| 3 | Helsesjekk kalt av ekstern overvåking | Steg 1.3 (repo-del) + Georges registrering |
| 4 | Fasedefinisjonen samlet ett sted | Steg 3.1 |
| 5 | Matcherunde kjørt mot ekte database | Steg 5.2 |
| 6 | `endJourney`-tester grønne | Steg 5.1 |
| 7 | Gjenopprettingstest, RTO målt | **Utenfor v6** — George |
| 8 | 144 spørsmål i egen stemme | **Utenfor v6** — George |
| 9 | Mobil-QA | **Utenfor v6** — George |
| 10 | Nynorsk i brukersynlig tekst rettet | Steg 4.1 |

**Seks av ti krav lukkes av ACT v6.** De fire gjenstående er menneskeoppgaver, ikke kodeoppgaver.

## 8.3 Sluttrapport

Skriv til `docs/ACT-STATE-v6.json`:

```json
{
  "currentStep": null,
  "completedSteps": ["0.1","0.2","1.1","1.2","1.3","2.1","2.2","2.3","3.1","4.1","5.1","5.2"],
  "lockedSteps":    ["0.1","0.2","1.1","1.2","1.3","2.1","2.2","2.3","3.1","4.1","5.1","5.2"],
  "pendingSteps": [],
  "finalVerification": {
    "tsc": "0 feil",
    "prismaFormat": "ok",
    "jest": "116/116",
    "build": "grønn",
    "verifyApi": "exit 0",
    "verifyLang": "exit 0"
  },
  "masterplanCoverage": "6 av 10 blokkerende krav lukket",
  "remainingForBeta": [
    "Gjenopprettingstest med målt RTO (George)",
    "144 spørsmål i egen stemme (George)",
    "Mobil-QA på fysisk enhet (George)",
    "Registrering av ekstern monitor (George)"
  ],
  "updatedAt": "<ISO>"
}
```

## 8.4 Rapporter ærlig

Sluttrapporten skal si hva som **er**, ikke hva som var meningen.

Fire ACT-sykluser har rapportert for høyt: v1 hevdet 90–95 % mot verifiserte 27–31 %. v3 hevdet 87 % mot 67 %. v4 hevdet 87 % mot 57 %. v5 hevdet 90 % mot 78 %.

Hver gang var årsaken den samme: **steg ble markert fullført når kode var skrevet, ikke når funksjon var observert.**

Er et steg delvis gjennomført, skriv det. Er en verifikasjon hoppet over, skriv det. Er en test grønn fordi den ikke tester noe, skriv det.

Et ærlig tall er verdt mer enn et høyt tall. Det er hele grunnen til at Sjekk 6, 7 og 8 finnes.

---

*TOSOM-ACT-INSTRUKS-v6.0 — 12 steg, 5 bølger, basert på TOSOM-MASTERPLAN-v5.0 ved commit `2784ae2`.*
