# TOSOM-ACT-INSTRUKS-v4.0 — LAUNCH & SCALE EDITION

**Kilde:** `docs/TOSOM-MASTERPLAN-v3.0.md` (1503 linjer, verifisert mot commit `2d9b7fc`)
**Underlag:** `TOSOM-MASTERPLAN-v2.0.md`, `TOSOM-ACT-v3-FINAL-REPORT.md`, `ACT-STATE-v3.json`
**Tilstandsfil:** `docs/ACT-STATE-v4.json` (NY fil — ikke gjenbruk `ACT-STATE-v3.json`)
**Omfang:** 49 steg i 8 bølger.
**Utgangspunkt:** Backend 88 % · Frontend 65 % · Produkt 55 % · Drift 35 % → **lanseringsscore 67 %**
**Mål:** 67 % → lanseringsklar. Ett atomisk steg om gangen.

---

> ### Hvorfor v4.0 er annerledes enn v3.0
>
> ACT v3.0 innførte **Sjekk 4** — funksjonelt ferdigkriterium per steg — og det virket. Avviket mellom rapportert og verifisert tilstand krympet fra 60 til 20 prosentpoeng.
>
> Men v3.0-rapporten oppga likevel **87 %** der verifisering viste **67 %**. Årsaken:
>
> **ACT v3 validerte hvert steg mot sin egen instruks. Ingen validerte instruksen mot produktet.**
>
> Alle 30 stegene var i hovedsak riktig utført. Likevel bygde de en app med **samtykke** (ja/nei til en person), mens ToSom er en app med **kobling**. Ingen stilte spørsmålet: *bygger dette ToSom slik ToSom er beskrevet?*
>
> Derfor innfører v4.0 **Sjekk 5 — konseptsamsvar**. Et steg er ikke ferdig før det er bekreftet at endringen bygger produktet slik det er definert i kapittel 3 (Koblingsmodellen).

---

## INNHOLD

- [0. Ikke-forhandlingsbare regler](#0-ikke-forhandlingsbare-regler)
- [1. Tilstandsfil](#1-tilstandsfil-docsact-state-v4json)
- [2. Steg-mal og commit-format](#2-steg-mal-og-commit-format)
- [3. Koblingsmodellen — normativ referanse](#3-koblingsmodellen--normativ-referanse)
- [4. De syv funnene → stegkart](#4-de-syv-funnene--stegkart)
- [BØLGE 0 — Baseline og avklaringer](#bølge-0--baseline-og-avklaringer-3-steg)
- [BØLGE A — Rett grunnlaget](#bølge-a--rett-grunnlaget-6-steg--sperre)
- [BØLGE B — Koblingsmodellen](#bølge-b--koblingsmodellen-11-steg--sperre)
- [BØLGE C — Tillit og trygghet](#bølge-c--tillit-og-trygghet-5-steg)
- [BØLGE D — Frontend og UX](#bølge-d--frontend-og-ux-9-steg)
- [BØLGE E — Kvalitet og testing](#bølge-e--kvalitet-og-testing-6-steg)
- [BØLGE F — Skalering og lanseringsklargjøring](#bølge-f--skalering-og-lanseringsklargjøring-5-steg)
- [BØLGE G — Premium v3.1](#bølge-g--premium-v31-betaling-4-steg)
- [5. Lanseringsstrategi og porter](#5-lanseringsstrategi-og-porter)
- [6. Risikoanalyse](#6-risikoanalyse)
- [7. MUST FIX / KAN VENTE](#7-must-fix--kan-vente)
- [8. Ferdigkriterier per bølge](#8-ferdigkriterier-per-bølge)

---

## 0. IKKE-FORHANDLINGSBARE REGLER

**Les FØRST. Følg ALLTID.**

1. **ETT steg per ACT-kommando.** Ett steg = én atomisk endring. Ikke gå videre selv om neste steg ser enkelt ut.
2. **VENT på uttrykkelig bekreftelse fra bruker** før neste steg startes.
3. **Etter HVERT steg, kjør i denne rekkefølgen:**
   - Sjekk 1: `npx tsc --noEmit`
   - Sjekk 2: grep-kommandoen angitt i steget
   - Sjekk 3: `npm run build`
   - Sjekk 4: **FUNKSJONELT** — observert DB-tilstand eller HTTP-respons
   - Sjekk 5: **KONSEPTSAMSVAR** — se regel 5
   - State-oppdatering: skriv `docs/ACT-STATE-v4.json`
4. **Sjekk 4 er obligatorisk.** Grønn på 1–3 men ikke observert 4 → `"functional": "fail"`, IKKE i `completedSteps`.
5. **Sjekk 5 er obligatorisk.** Svar skriftlig på: *bygger denne endringen ToSom slik kapittel 3 beskriver?* Hvis endringen innfører et valg mellom mennesker, en andre matchemotor, en varsling ved match, eller data som overlever en avsluttet reise — **STOPP og meld til bruker.**
6. **Patch-skissene er IKKE ferdig kode.** De beskriver hva som skal endres. Du skriver koden selv, basert på skissen og gjeldende filinnhold.
7. **Siter filanker (fil:linje) FØR endring**, og bekreft at linjenummeret fortsatt stemmer. Filer forskyver seg — les filen på nytt ved tvil. Alle ankere i dette dokumentet gjelder commit `2d9b7fc`.
8. **ALDRI erstatt en sikkerhetsmekanisme med en svakere.** ACT v2.0 steg 3.3 innførte HMAC; steg 3.4 fjernet den og satte base64. Det ble hovedsårbarheten i systemet.
9. **Konfigurasjon og kode endres i SAMME steg.** ACT v2.0 flyttet cron-secret til header i koden, men glemte `vercel.json` → begge cron døde. **Funn N-3 viser at regelen fortsatt brytes:** `TIME_BUDGET_MS = 240_000` uten `maxDuration` i `vercel.json`.
10. **ALDRI endringer utenfor det aktuelle steget.** Ser du andre feil → noter i `deviations`, fortsett med planlagt steg.
11. **ETT steg = ETT commit.** Ingen batching. ACT v2.0 hadde 8 batch-avvik som gjorde årsaksisolering umulig.
12. **Avhengighetssperre.** Avhenger steget av et steg som ikke står i `completedSteps` → IKKE start. Meld avvik.
13. **BØLGE 0 og A er sperrer.** Ingen steg i B+ startes før A er komplett med `functional: "pass"`. `waveGateA` må være `true`.
14. **BØLGE B er en sperre.** Ingen steg i C+ før B er komplett. `waveGateB` må være `true`. B endrer databaseskjemaet — halvferdig er verre enn ikke påbegynt.
15. **Skjemamigreringer: additivt først, brytende samlet.** Additive steg (B1–B4) kan kjøres mot produksjon uten nedetid. Brytende steg (B7–B9) kjøres samlet, i lav trafikk, **aldri fredag**, alltid med verifisert backup samme dag.
16. **Rollback ved rødt.** Feiler en sjekk og du ikke kan fikse innenfor SAMME steg → kjør rollback-kommandoen, sett `deviations`, spør bruker. ALDRI la rødt stå udokumentert.
17. **Ingen nye avhengigheter** uten at steget uttrykkelig angir det.
18. **Ingen test som reimplementerer logikken den tester.** ACT v3 STEG 3.3 laget `simulateRequireAuth()` og testet sin egen stub. 77 grønne tester, ~30 reelle. Test reell kode eller reelle endepunkter.
19. **Alle brukervendte strenger på bokmål.** Ingen nynorskformer (`ikke`, `hvordan`, `bruker`, `allerede`, `no` for «nå»). `lang-guard` fanger ikke alt — du er ansvarlig.
20. **05:00 nevnes aldri i brukervendt tekst.** Det er en driftsdetalj, ikke et løfte. Brukeren får «i løpet av 24 timer».

---

## 1. TILSTANDSFIL: `docs/ACT-STATE-v4.json`

Sjekk om filen finnes FØR du gjør noe annet:
- **Finnes ikke** → du er på steg 0.1. Opprett den.
- **Finnes** → les `nextStep`. Fortsett NØYAKTIG derfra. Ikke gjenta steg i `completedSteps`.

### Skjema

```json
{
  "instruks": "v4.0-launch-scale",
  "sourceDoc": "docs/TOSOM-MASTERPLAN-v3.0.md",
  "baseCommit": "2d9b7fc",
  "currentWave": "0",
  "currentStep": "0.1",
  "completedSteps": [],
  "failedSteps": [],
  "nextStep": "0.1",
  "waveGateA": false,
  "waveGateB": false,
  "preflight": {
    "vercelPlan": "unknown",
    "maxDurationAllowed": 0,
    "sentryDsnSet": false
  },
  "status": {
    "tsc": "not-run",
    "grep": "not-run",
    "build": "not-run",
    "functional": "not-run",
    "concept": "not-run"
  },
  "scores": {
    "backend": 88,
    "frontend": 65,
    "produkt": 55,
    "drift": 35,
    "lansering": 67
  },
  "deviations": [],
  "lastCommit": "",
  "updatedAt": ""
}
```

### Feltforklaring

| Felt | Betydning |
|---|---|
| `currentWave` | `"0"`, `"A"`…`"G"` |
| `currentStep` | Steget du nettopp fullførte, f.eks. `"B4"` |
| `completedSteps` | Steg grønne på ALLE FEM sjekker |
| `failedSteps` | Steg som feilet, med årsak i `deviations` |
| `nextStep` | Neste steg som skal utføres |
| `waveGateA` | `true` først når hele bølge A er grønn. Regel 13 |
| `waveGateB` | `true` først når hele bølge B er grønn. Regel 14 |
| `preflight.vercelPlan` | `"hobby"` \| `"pro"` \| `"enterprise"` — settes i steg 0.3 |
| `preflight.maxDurationAllowed` | Sekunder. Styrer steg A4 |
| `preflight.sentryDsnSet` | Bekreftet av bruker i steg 0.3 |
| `status.functional` | `"pass"` \| `"fail"` \| `"not-run"` |
| `status.concept` | Sjekk 5. Samme verdier |
| `scores` | Oppdateres ved hver bølgeavslutning |
| `deviations` | Fritekst over alt som avvek |

---

## 2. STEG-MAL OG COMMIT-FORMAT

```
STEG <bølge><nr> — <tittel>
Formål: <hvorfor>
Avhengigheter: <steg-ID i completedSteps, eller "Ingen">
Risiko: Lav / Middels / Høy
Filanker: <fil:linje>
Søkeanker: <grep for å finne stedet hvis linjenummer har forskjøvet seg>
Patch-skisse: <beskrivelse — IKKE ferdig kode>
Sjekk 1 (tsc): npx tsc --noEmit
Sjekk 2 (grep): <kommando>
Sjekk 3 (build): npm run build
Sjekk 4 (FUNKSJONELT): <observerbar DB-tilstand eller HTTP-respons>
Sjekk 5 (KONSEPT): <spørsmål å besvare skriftlig>
State: currentWave=<X>, currentStep="<XY>", completedSteps+=["<XY>"], nextStep="<XZ>"
Rollback: <git-kommando>
Commit: <melding>
```

**Commit-format (obligatorisk):**

```
<type>(<scope>): <beskrivelse> [ACT4 <bølge><nr>]
```

Typer: `fix` · `feat` · `chore` · `test` · `ci` · `refactor` · `docs` · `perf`

Eksempel: `fix(types): rett never-type i cron-auth.test.ts [ACT4 A1]`

**Rollback-snutter:**

```bash
# Ukommitert endring i én fil
git checkout -- <fil>

# Ukommitert, flere filer
git checkout -- .

# Committet steg
git revert --no-edit <lastCommit>

# Prisma-migrering som ikke er deployet
rm -rf prisma/migrations/<timestamp>_<navn> && npx prisma migrate resolve --rolled-back <navn>

# Prisma-migrering som ER deployet — ALDRI slett. Skriv ny reverserende migrering.
npx prisma migrate dev --name revert_<navn>
```

**Verifikasjonskommandoer (standardsett):**

```bash
npx tsc --noEmit                      # 0 feil forventet fra og med steg A1
npx jest                              # 4 suiter grønne
npx prisma format --check; echo $?    # exit 0
npx prisma validate                   # schema gyldig
npm run build                         # grønn
npx next lint                         # 0 warnings
```

**Baseline-forventning ved start (commit `2d9b7fc`):**

| Kommando | Forventet |
|---|---|
| `npx tsc --noEmit` | **RØD** — 1 feil i `__tests__/cron-auth.test.ts:15` |
| `npx jest` | GRØNN — 4 suiter, 77 tester |
| `npx prisma format --check` | GRØNN — exit 0 |
| `npm run build` | GRØNN |
| `git status --short` | Rent arbeidstre |

Fra og med steg A1 skal `tsc` være grønn i **alle** påfølgende steg. En rød `tsc` er en blokker, ikke en advarsel.

---

## 3. KOBLINGSMODELLEN — NORMATIV REFERANSE

> Dette kapittelet er **normativt**. Sjekk 5 måles mot det. Ved konflikt mellom et steg og dette kapittelet, gjelder kapittelet — meld avvik.

### 3.1 Prinsippet

> **Du velger å delta. Du velger ikke hvem du deltar med.**

I det øyeblikket en bruker kan si nei til et menneske basert på en profil, er vurderingen ToSom finnes for å slippe, gjeninnført. Et «nei» er en sveip med flere klikk.

### 3.2 Loopen

```
LANDING → REGISTER/LOGIN (Vipps = BankID) → [BETALING] → ONBOARDING (13 steg)
   → START REISEN  (journeyState = QUEUED, matchQueuedAt = now())
   → DASHBOARD «Du får din match i løpet av 24 timer»
   → ⏰ 05:00 ÉN MOTOR, ÉN RUNDE
        kø ≥ 20 ELLER noen har ventet > 72 t  →  kjør
        score alle mot alle · dealbreakere · sperreliste
        grådig parvis kobling på synkende score
        → Match(active) + Conversation + JourneyProgress(day 0)
        + Notification × 2 (in-app) + journeyState = MATCHED × 2
   → 🔕 INGEN VARSLING UT — hun logger inn og oppdager det selv
   → DASHBOARD MATCHET → CHAT
   → begge har vært innom → bothSeenAt → DAG 1 STARTER
   → ⏰ 07:00 dag++ · 🔔 dagsvarsel (beholdes)
        EARLY 1–14 · TRUST 15–21 · DEEPER 22–25 · CHECKIN 26–30
   → DAG 30 → «Vi fant hverandre» ELLER «Ny reise»
   → endJourney(): ALT SLETTES + MatchHistory (sperreliste)
   → journeyState = IDLE  →  [BETAL] → BEKREFT PROFIL → START REISEN ⟲
```

### 3.3 Ufravikelige invarianter

| # | Invariant | Håndheves av |
|---|---|---|
| I-1 | Én bruker kan ha **én** reise om gangen | `User.journeyState` |
| I-2 | Ingen ja/nei til en person | Samtykkefelt og -ruter fjernet (B7) |
| I-3 | **Én** matchemotor: cron 05:00 | `OnboardingFlow.tsx:411` fjernet (B5) |
| I-4 | Ingen varsling **ut** ved match. In-app `Notification` skal finnes | B6 |
| I-5 | Dag 1 starter når **begge** har vært innom | `bothSeenAt` (B4, B9) |
| I-6 | Ved reiseslutt slettes alt innhold | `endJourney()` (B3) |
| I-7 | To som har vært koblet, kobles aldri igjen | `MatchHistory` (B2) |
| I-8 | Dagsvarsler beholdes | Journey-cron urørt |
| I-9 | 05:00 nevnes aldri utad | Kopi (D5) |
| I-10 | Én pris, ingen nivåer, ingen gating | Bølge G |

### 3.4 Måltilstand for skjemaet

```prisma
enum JourneyState { IDLE  QUEUED  MATCHED }

enum MatchStatus  { active  ended  expired }   // fra 6 verdier til 3

model User {
  journeyState   JourneyState @default(IDLE)
  matchQueuedAt  DateTime?
  @@index([journeyState, matchQueuedAt])
}

model Match {
  // FJERNET: acceptedByA, acceptedByB, rejectedByA, rejectedByB, rejectionReason
}

model JourneyProgress {
  matchId      String    @unique   // var: userId @unique
  userASeenAt  DateTime?
  userBSeenAt  DateTime?
  bothSeenAt   DateTime?           // null = reisen har ikke startet
  day          Int       @default(0)
}

model MatchHistory {               // NY — minimal sperreliste
  id        String   @id @default(cuid())
  userAId   String
  userBId   String
  endedAt   DateTime @default(now())
  outcome   String
  @@unique([userAId, userBId])
  @@index([userAId])
  @@index([userBId])
}
```

---

## 4. DE SYV FUNNENE → STEGKART

| # | Funn | Bevis | Steg |
|---|---|---|---|
| N-1 | `tsc` rød (1 feil) | `__tests__/cron-auth.test.ts:15` — `Property 'replace' does not exist on type 'never'` | **A1** |
| N-2 | `instrumentation.ts` mangler → serverside Sentry laster ikke | `ls instrumentation*.ts` → tom | **A2, A3** |
| N-3 | `TIME_BUDGET_MS = 240_000` vs. Vercel 10–60 s | `app/api/cron/matching/route.ts:22` vs. `vercel.json` uten `functions` | **A4** |
| N-4 | Match oppretter ingen `Notification` | 5 `notification.create`, ingen i matching-veien | **B6** |
| N-5 | Ingen e-postkanal | `nodemailer` brukt kun i `app/api/auth/phone/send/route.ts` | **F4** (beredskap) |
| N-6 | 0 `loading.tsx`, 0 `error.tsx` | `find app -name "loading.tsx" \| wc -l` → 0 | **D1, D2** |
| N-7 | `standalone`-rest fra Docker | `next.config.js:11` | **F1** |

Det åttende funnet — feil matchmodell — er hele **bølge B**.

---

# BØLGE 0 — BASELINE OG AVKLARINGER (3 steg)

## STEG 0.1 — Opprett tilstandsfil

**Formål:** Etablere fremdriftsminne for v4.0 uten å overskrive v3.0-historikk.
**Avhengigheter:** Ingen
**Risiko:** Lav
**Filanker:** `docs/ACT-STATE-v4.json` (ny fil)

**Patch-skisse:** Opprett filen med skjemaet fra kapittel 1. `currentWave: "0"`, `nextStep: "0.2"`, alle status-felt `"not-run"`, begge `waveGate*` `false`, `preflight` med `"unknown"`/`0`/`false`.

- **Sjekk 1 (tsc):** `npx tsc --noEmit` *(forventet RØD — 1 feil. Dette er baseline, ikke en blokker for dette steget.)*
- **Sjekk 2 (grep):** `test -f docs/ACT-STATE-v4.json && echo OK`
- **Sjekk 3 (build):** Hopp over — ingen kodeendring.
- **Sjekk 4 (FUNKSJONELT):** `jq -r .instruks docs/ACT-STATE-v4.json` → `v4.0-launch-scale`
- **Sjekk 5 (KONSEPT):** Ikke relevant — infrastruktur.

**State:** `currentWave="0"`, `currentStep="0.1"`, `completedSteps=["0.1"]`, `nextStep="0.2"`
**Rollback:** `rm docs/ACT-STATE-v4.json`
**Commit:** `chore(act): opprett ACT-STATE-v4.json [ACT4 0.1]`

---

## STEG 0.2 — Baseline-måling

**Formål:** Dokumentere utgangspunktet slik at fremgang kan måles og regresjon oppdages.
**Avhengigheter:** 0.1
**Risiko:** Lav
**Filanker:** Hele prosjektet

**Patch-skisse:** Ingen kodeendring. Kjør kommandoene og skriv én linje i `deviations`:
`"BASELINE v4: tsc=<N> feil, jest=<X>/<Y>, prisma-format=exit<N>, build=<status>, api-ruter=<N>, sider=<N>, loading=<N>, error=<N>"`

```bash
npx tsc --noEmit 2>&1 | tee /tmp/v4-tsc.log; grep -c "error TS" /tmp/v4-tsc.log
npx jest 2>&1 | tail -5
npx prisma format --check; echo "exit=$?"
npm run build 2>&1 | tail -20
find app/api -name route.ts | wc -l
find app -name "page.tsx" -not -path "*/api/*" | wc -l
find app -name "loading.tsx" | wc -l
find app -name "error.tsx" | wc -l
```

- **Sjekk 1 (tsc):** Som over — dokumenter tallet.
- **Sjekk 2 (grep):** Alle åtte kommandoer kjørt, output notert.
- **Sjekk 3 (build):** `npm run build`
- **Sjekk 4 (FUNKSJONELT):** `deviations` inneholder én BASELINE v4-linje med alle åtte tall.
- **Sjekk 5 (KONSEPT):** Ikke relevant.

**State:** `currentWave="0"`, `currentStep="0.2"`, `completedSteps+=["0.2"]`, `nextStep="0.3"`
**Rollback:** Ikke relevant.
**Commit:** `chore(act): dokumenter baseline for v4.0 [ACT4 0.2]`

---

## STEG 0.3 — Pre-flight: Vercel-plan og Sentry-DSN 🔴 SPERRE

**Formål:** To fakta må bekreftes av bruker før bølge A. Uten dem er A2–A4 gjetting.
**Avhengigheter:** 0.2
**Risiko:** Lav (men blokkerende)
**Filanker:** Ingen — dette er en dialog med bruker.

**Patch-skisse:** Still bruker nøyaktig disse to spørsmålene. Ikke gjett. Ikke fortsett uten svar.

**Spørsmål 1 — Vercel-plan:**

> Hvilken Vercel-plan brukes for produksjon: **Hobby**, **Pro** eller **Enterprise**?
>
> Dette avgjør maksimal kjøretid for cron:
>
> | Plan | Maks `maxDuration` | Konsekvens for `TIME_BUDGET_MS = 240_000` |
> |---|---|---|
> | Hobby | 60 s (default 10 s) | **Må ned til ≤ 50 000.** Runden må deles over flere kall |
> | Pro | 300 s (default 60 s) | `maxDuration: 300` kan settes. Tidsbudsjett 240 s holder |
> | Enterprise | 900 s | Rikelig |
>
> Kontroller i Vercel Dashboard → Settings → General → Plan.

**Spørsmål 2 — Sentry-DSN:**

> Er `NEXT_PUBLIC_SENTRY_DSN` satt i Vercel for **Production**?
>
> ACT v3 STEG 2.7 noterte at bruker måtte sette denne manuelt. Er den ikke satt, returnerer `beforeSend` alltid `null` (`sentry.client.config.ts:14-16`), og **ingen feil sendes noe sted** — verken fra nettleser eller server. Da er A2 og A3 uten effekt.
>
> Kontroller i Vercel Dashboard → Settings → Environment Variables.

Skriv svarene til `preflight` i tilstandsfilen. Ved `"hobby"`: sett `maxDurationAllowed: 60` og **merk i `deviations` at A4 må bruke redusert tidsbudsjett og at bølge F trenger et ekstra steg for oppdeling av runden.**

- **Sjekk 1 (tsc):** Hopp over — ingen kodeendring.
- **Sjekk 2 (grep):** `jq '.preflight' docs/ACT-STATE-v4.json`
- **Sjekk 3 (build):** Hopp over.
- **Sjekk 4 (FUNKSJONELT):** `jq -r '.preflight.vercelPlan' docs/ACT-STATE-v4.json` ≠ `"unknown"` **OG** `jq -r '.preflight.maxDurationAllowed' docs/ACT-STATE-v4.json` > 0.
- **Sjekk 5 (KONSEPT):** Ikke relevant.

**State:** `currentWave="A"`, `currentStep="0.3"`, `completedSteps+=["0.3"]`, `nextStep="A1"`
**Rollback:** Ikke relevant.
**Commit:** `chore(act): registrer Vercel-plan og Sentry-DSN-status [ACT4 0.3]`

---

# BØLGE A — RETT GRUNNLAGET (6 steg) 🔴 SPERRE

> **Regel 13 gjelder.** `waveGateA` settes `true` først når A1–A6 alle er grønne på Sjekk 4.
>
> Denne bølgen retter fundamentet: rød `tsc`, blind observability, og en cron som kuttes stille. **Alt annet arbeid er utrygt før dette er på plass** — uten fungerende feilsporing vet du ikke om bølge B ødelegger noe.

## STEG A1 — Fiks rød `tsc`

**Formål:** Funn N-1. CI-jobben `typecheck` feiler. v2.0 hadde 0 feil; regresjonen kom med ACT v3 STEG 3.3.
**Avhengigheter:** 0.3
**Risiko:** Lav
**Filanker:** `__tests__/cron-auth.test.ts:13-15`
**Søkeanker:** `grep -n "authHeader?.replace" __tests__/cron-auth.test.ts`

Feilen:

```
__tests__/cron-auth.test.ts(15,33): error TS2339:
  Property 'replace' does not exist on type 'never'.
```

Årsak — TypeScript smalner `undefined` til `never`:

```ts
const authHeader = undefined;                    // type: undefined
const token = authHeader?.replace('Bearer ', ''); // ← never
```

**Patch-skisse:** Gi variabelen en eksplisitt type som modellerer det ruten faktisk får fra `req.headers.get()`:

```ts
const authHeader: string | undefined = undefined;
```

Ikke bruk `as any`. Ikke slett testen. Ikke deaktiver regelen. Kontroller om samme mønster finnes flere steder i filen — rett alle i dette steget (samme fil, samme feilklasse = ett steg).

- **Sjekk 1 (tsc):** `npx tsc --noEmit` → **0 feil**
- **Sjekk 2 (grep):** `npx tsc --noEmit 2>&1 | grep -c "error TS"` → `0`
- **Sjekk 3 (build):** `npm run build`
- **Sjekk 4 (FUNKSJONELT):** `npx jest __tests__/cron-auth.test.ts` → alle tester passerer, og `npx tsc --noEmit; echo "exit=$?"` → `exit=0`
- **Sjekk 5 (KONSEPT):** Ikke relevant — typefiks.

**State:** `currentWave="A"`, `currentStep="A1"`, `completedSteps+=["A1"]`, `nextStep="A2"`
**Rollback:** `git checkout -- __tests__/cron-auth.test.ts`
**Commit:** `fix(types): rett never-type i cron-auth.test.ts [ACT4 A1]`

---

## STEG A2 — `instrumentation.ts` for serverside Sentry

**Formål:** Funn N-2. `sentry.server.config.ts` finnes og er godt skrevet — men i Next.js 15 lastes den gjennom `instrumentation.ts`, som ikke finnes. **All serverside feilsporing er sannsynligvis død.**
**Avhengigheter:** A1
**Risiko:** Middels
**Filanker:** `instrumentation.ts` (ny fil, prosjektrot), `sentry.server.config.ts`, `next.config.js`
**Søkeanker:** `ls instrumentation*.ts 2>&1` → «No such file»

**Patch-skisse:**

```ts
// instrumentation.ts — prosjektrot, ved siden av next.config.js
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config')
  }
  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config')   // opprettes i A3
  }
}
```

- Edge-importen peker på filen som lages i A3. For at dette steget skal bygge, opprett `sentry.edge.config.ts` som en **minimal, gyldig** fil nå (kun `Sentry.init` med DSN fra env), og gjør den komplett i A3. Alternativt: kommenter ut edge-grenen i A2 og aktiver den i A3. Velg én og noter valget i `deviations`.
- Next.js 15 laster `instrumentation.ts` automatisk. Ingen `experimental`-flagg kreves.
- **Ikke rør** `sentry.server.config.ts` — den er korrekt.
- Legg til en midlertidig testrute `app/api/system/sentry-test/route.ts` som kaster en feil. Den skal kreve `Bearer $CRON_SECRET`, og **slettes i steg A6**.

- **Sjekk 1 (tsc):** `npx tsc --noEmit`
- **Sjekk 2 (grep):** `test -f instrumentation.ts && grep -c "sentry.server.config" instrumentation.ts` → `1`
- **Sjekk 3 (build):** `npm run build` — se etter at Next rapporterer at instrumentation er registrert.
- **Sjekk 4 (FUNKSJONELT):** Med `NEXT_PUBLIC_SENTRY_DSN` satt og `NODE_ENV=production`:
  `curl -H "Authorization: Bearer $CRON_SECRET" localhost:3000/api/system/sentry-test`
  → **feilen skal være synlig i Sentry-prosjektet innen 60 sekunder**, med `runtime: nodejs`.
  Observer i Sentry-UI. Skjermbilde eller event-ID noteres i `deviations`.
- **Sjekk 5 (KONSEPT):** Bekreft at PII-scrubbing i `sentry.server.config.ts` fortsatt er aktiv — testfeilen skal ikke inneholde e-post eller telefonnummer.

**State:** `currentWave="A"`, `currentStep="A2"`, `completedSteps+=["A2"]`, `nextStep="A3"`
**Rollback:** `rm instrumentation.ts app/api/system/sentry-test/route.ts`
**Commit:** `feat(observability): last serverside Sentry via instrumentation.ts [ACT4 A2]`

---

## STEG A3 — `sentry.edge.config.ts` for middleware

**Formål:** `middleware.ts` kjører på edge runtime. Uten edge-config er alle middleware-feil — inkludert auth-feil — usynlige.
**Avhengigheter:** A2
**Risiko:** Lav
**Filanker:** `sentry.edge.config.ts` (ny/komplettert), `middleware.ts`

**Patch-skisse:**

- Speil `sentry.server.config.ts`: DSN fra `process.env.NEXT_PUBLIC_SENTRY_DSN`, `enabled` kun i produksjon, `tracesSampleRate: 0.1`, **samme `beforeSend` med PII-scrubbing**.
- Regel 8 gjelder: PII-scrubbingen skal være identisk, ikke svakere. Vurder å trekke redact-funksjonen ut til `lib/observability/scrubPii.ts` og importere den i alle tre config-filene — det hindrer at de driver fra hverandre. Gjør det i så fall i dette steget, og oppdater alle tre.
- Aktiver edge-grenen i `instrumentation.ts` hvis den ble kommentert ut i A2.

- **Sjekk 1 (tsc):** `npx tsc --noEmit`
- **Sjekk 2 (grep):** `grep -l "beforeSend" sentry.client.config.ts sentry.server.config.ts sentry.edge.config.ts | wc -l` → `3`
- **Sjekk 3 (build):** `npm run build`
- **Sjekk 4 (FUNKSJONELT):** Utløs en middleware-feil (f.eks. midlertidig `throw` bak et flagg, eller kall en beskyttet rute med ødelagt cookie-format). Feilen skal vises i Sentry med `runtime: edge`. Fjern testkoden i samme steg.
- **Sjekk 5 (KONSEPT):** PII-scrubbing identisk i alle tre runtimes. ToSom lover at ingen ser samtalene — løftet gjelder også feilsporing.

**State:** `currentWave="A"`, `currentStep="A3"`, `completedSteps+=["A3"]`, `nextStep="A4"`
**Rollback:** `git checkout -- sentry.edge.config.ts instrumentation.ts`
**Commit:** `feat(observability): legg til Sentry edge-config for middleware [ACT4 A3]`

---

## STEG A4 — `maxDuration` og tidsbudsjett i samsvar 🔴

**Formål:** Funn N-3. Koden planlegger 4 minutter; plattformen gir 10–60 sekunder. Cron kuttes midt i en batch — utenfor prosessen, så ingen `catch` kjører og **ingenting logges som feil**. Dette er samme klasse feil som FUNN 2 i v2.0.
**Avhengigheter:** A3, og `preflight.maxDurationAllowed` > 0
**Risiko:** Høy
**Filanker:** `vercel.json` (ingen `functions`-blokk), `app/api/cron/matching/route.ts:22`, `app/api/cron/journey/route.ts`
**Søkeanker:** `grep -n "TIME_BUDGET_MS" app/api/cron/*/route.ts`

**Patch-skisse — Regel 9: konfigurasjon og kode i SAMME steg.**

**Hvis `preflight.vercelPlan == "pro"` eller `"enterprise"`:**

```jsonc
// vercel.json — legg til ved siden av "crons"
"functions": {
  "app/api/cron/matching/route.ts": { "maxDuration": 300 },
  "app/api/cron/journey/route.ts":  { "maxDuration": 300 }
}
```

Behold `TIME_BUDGET_MS = 240_000` (240 s < 300 s gir 60 s margin til opprydding).

**Hvis `preflight.vercelPlan == "hobby"`:**

```jsonc
"functions": {
  "app/api/cron/matching/route.ts": { "maxDuration": 60 },
  "app/api/cron/journey/route.ts":  { "maxDuration": 60 }
}
```

Og **sett `TIME_BUDGET_MS = 50_000`** i begge cron-ruter. Noter i `deviations` at runden må deles over flere kall ved vekst, og at dette må håndteres i bølge F.

**I begge tilfeller:**

- Legg til `export const maxDuration = <N>` i begge rutefiler. Dette er Next.js' rute-nivå-deklarasjon og fungerer sammen med `vercel.json`.
- Tidsbudsjettet skal alltid være **minst 20 % lavere** enn `maxDuration`, slik at ruten rekker å skrive heartbeat og slippe advisory lock før plattformen kutter.

- **Sjekk 1 (tsc):** `npx tsc --noEmit`
- **Sjekk 2 (grep):**
  ```bash
  jq -r '.functions | keys[]' vercel.json           # begge cron-ruter listet
  grep -n "maxDuration" app/api/cron/*/route.ts     # begge har export
  grep -n "TIME_BUDGET_MS" app/api/cron/*/route.ts  # verdi < maxDuration*1000*0.8
  ```
- **Sjekk 3 (build):** `npm run build`
- **Sjekk 4 (FUNKSJONELT):** Deploy til preview. Kall matching-cron med gyldig `Bearer`. Verifiser i Vercel-loggen at funksjonen **ikke** ble avbrutt (ingen `Task timed out`), og at `SystemLog` har en fersk rad:
  ```sql
  SELECT module, level, metadata, "createdAt"
  FROM "SystemLog" WHERE module = 'cron:matching'
  ORDER BY "createdAt" DESC LIMIT 1;
  ```
  Raden skal finnes og `metadata.durationMs` skal være lavere enn tidsbudsjettet.
- **Sjekk 5 (KONSEPT):** Bekreft at cron fortsatt er eneste kilde til matcher, og at ingen del av endringen introduserer en synkron matchevei.

**State:** `currentWave="A"`, `currentStep="A4"`, `completedSteps+=["A4"]`, `nextStep="A5"`
**Rollback:** `git checkout -- vercel.json app/api/cron/matching/route.ts app/api/cron/journey/route.ts`
**Commit:** `fix(cron): sett maxDuration i samsvar med tidsbudsjett [ACT4 A4]`

---

## STEG A5 — Alarm ved uteblitt matcherunde

**Formål:** `/api/system/cron-health` finnes fra ACT v3, men **ingen leser den**. En helsesjekk ingen abonnerer på, er en logg — ikke en alarm. Lærdommen fra v2.0 FUNN 2: den viktigste enkeltmetrikken er «matcher koblet siste 24 t».
**Avhengigheter:** A4
**Risiko:** Middels
**Filanker:** `app/api/system/cron-health/route.ts`, `lib/observability/alert.ts` (ny)

**Patch-skisse:**

- Ny modul `lib/observability/alert.ts` med én funksjon:
  `sendAlert(severity: 'warn'|'critical', title: string, detail: string): Promise<void>`
- Kanal velges av env-variabler, i prioritert rekkefølge:
  1. `ALERT_WEBHOOK_URL` — POST med JSON (fungerer for Slack og Discord)
  2. `ALERT_EMAIL_TO` — via `nodemailer` (allerede en dependency, se N-5)
  3. Ingen satt → `Sentry.captureMessage(title, severity)` som fallback
- **Ingen nye avhengigheter** (regel 17). `nodemailer` og `@sentry/nextjs` finnes allerede.
- Kall `sendAlert('critical', …)` fra `finally`-blokken i matching-cron når kjøringen feiler **eller** når `created === 0` samtidig som køen var over kohortterskelen.
- Ny rute `app/api/system/cron-watchdog/route.ts`, kjørt av en tredje cron kl. **06:00** (én time etter matching): sjekker om `SystemLog` har en `cron:matching`-rad nyere enn 26 timer. Hvis ikke → `sendAlert('critical', 'Matcherunde uteble', …)`.
- Legg watchdog i `vercel.json`. **Merk:** Vercel Hobby tillater maks 2 cron-jobber. Er planen Hobby, legg watchdog-sjekken inn på slutten av journey-cron (07:00) i stedet, og noter i `deviations`.

- **Sjekk 1 (tsc):** `npx tsc --noEmit`
- **Sjekk 2 (grep):** `grep -rn "sendAlert" app/api/cron/ app/api/system/ | head`
- **Sjekk 3 (build):** `npm run build`
- **Sjekk 4 (FUNKSJONELT):** Sett `SystemLog`-raden for `cron:matching` kunstig gammel:
  ```sql
  UPDATE "SystemLog" SET "createdAt" = now() - interval '30 hours'
  WHERE module = 'cron:matching';
  ```
  Kall watchdog med gyldig `Bearer` → **varsel mottatt i valgt kanal innen 30 minutter** (i praksis umiddelbart). Tilbakestill raden etterpå.
- **Sjekk 5 (KONSEPT):** Alarmen går til drift, ikke til brukere. Ingen bruker skal merke at en runde uteble — utover at hun fortsatt står i kø.

**State:** `currentWave="A"`, `currentStep="A5"`, `completedSteps+=["A5"]`, `nextStep="A6"`
**Rollback:** `git revert --no-edit <lastCommit>`
**Commit:** `feat(observability): alarm ved uteblitt matcherunde [ACT4 A5]`

---

## STEG A6 — Fail-fast env-validering

**Formål:** Manglende miljøvariabler skal stoppe oppstart, ikke gi stille feil i produksjon. `ADMIN_JWT_SECRET` kastet tidligere ved import; nå skal alle kritiske variabler valideres ett sted.
**Avhengigheter:** A5
**Risiko:** Middels
**Filanker:** `config/env.ts`, `instrumentation.ts`
**Søkeanker:** `grep -n "process.env" config/env.ts | head -30`

**Patch-skisse:**

- Utvid `config/env.ts` med en `validateEnv()` som sjekker at alle påkrevde variabler finnes, og kaster med en **samlet, lesbar liste** over hva som mangler — ikke én om gangen.
- Påkrevde i produksjon: `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `CRON_SECRET`, `ADMIN_JWT_SECRET`, `NEXT_PUBLIC_SENTRY_DSN`, Pusher-nøklene, Upstash-nøklene.
- Kall `validateEnv()` fra `register()` i `instrumentation.ts`, kun når `NEXT_RUNTIME === 'nodejs'` og `NODE_ENV === 'production'`. Da feiler oppstart tydelig i stedet for at en tilfeldig rute krasjer senere.
- Bruk `zod` (allerede en dependency) om ønskelig.
- **Slett den midlertidige `app/api/system/sentry-test/route.ts` fra A2 i dette steget.**

- **Sjekk 1 (tsc):** `npx tsc --noEmit`
- **Sjekk 2 (grep):** `grep -n "validateEnv" config/env.ts instrumentation.ts` og `test ! -f app/api/system/sentry-test/route.ts && echo SLETTET`
- **Sjekk 3 (build):** `npm run build`
- **Sjekk 4 (FUNKSJONELT):** Start med en variabel bevisst fjernet:
  `NODE_ENV=production CRON_SECRET= npm start`
  → **oppstart feiler** med melding som navngir `CRON_SECRET`. Start deretter med alle satt → oppstart lykkes.
- **Sjekk 5 (KONSEPT):** Ikke relevant — infrastruktur.

**State:** `currentWave="A"`, `currentStep="A6"`, `completedSteps+=["A6"]`, `nextStep="B1"`, **`waveGateA=true`**
**Rollback:** `git revert --no-edit <lastCommit>`
**Commit:** `feat(config): fail-fast validering av miljøvariabler [ACT4 A6]`

> ### 🔒 SPERRE — bølge A ferdigkriterium
>
> Sett `waveGateA=true` **kun** når alle er sanne:
> - `npx tsc --noEmit` → 0 feil
> - Serverfeil observert i Sentry med `runtime: nodejs`
> - Middleware-feil observert i Sentry med `runtime: edge`
> - Cron kjørt i preview uten timeout, med fersk `SystemLog`-rad
> - Alarm mottatt i valgt kanal ved simulert stans
> - Oppstart feiler ved manglende env-variabel
>
> Er én av disse rød → **ikke start bølge B.**

---

# BØLGE B — KOBLINGSMODELLEN (11 steg) 🔴 SPERRE

> **Dette er planens tyngdepunkt.** Mer arbeid enn bølge C–G til sammen: fire modeller i databasen, to API-veier og hele matchflyten i grensesnittet.
>
> **Regel 15 gjelder.** B1–B4 er additive og trygge mot produksjon. B5–B9 er brytende og kjøres samlet, i lav trafikk, aldri fredag, med verifisert backup samme dag.
>
> **Regel 14 gjelder.** `waveGateB` settes `true` først når B1–B11 alle er grønne.
>
> **Ta backup før B1 og igjen før B7.** Verifiser at backupen kan gjenopprettes — ikke bare at den ble tatt.

## STEG B1 — `journeyState` og `matchQueuedAt` på `User` *(additiv)*

**Formål:** Invariant I-1 — én bruker, én reise om gangen — håndheves i dag av en bieffekt (`JourneyProgress.userId @unique`) som forsvinner i B4. Regelen må sies eksplisitt før den gamle fjernes.
**Avhengigheter:** A6, `waveGateA=true`
**Risiko:** Middels
**Filanker:** `prisma/schema.prisma:10-47` (`model User`)
**Søkeanker:** `sed -n '/^model User /,/^}/p' prisma/schema.prisma`

**Patch-skisse:**

```prisma
enum JourneyState { IDLE  QUEUED  MATCHED }

model User {
  // … eksisterende felt
  journeyState   JourneyState @default(IDLE)
  matchQueuedAt  DateTime?

  @@index([journeyState, matchQueuedAt])
}
```

Backfill i samme migrering (rå SQL i migreringsfilen):

| Nåværende tilstand | `journeyState` |
|---|---|
| Har `JourneyProgress` uten `endedAt`/`completedAt` | `MATCHED` |
| `onboardingComplete = true`, ingen aktiv reise | `IDLE` |
| Alle øvrige | `IDLE` |

`matchQueuedAt` settes `null` for alle. **Ingen settes til `QUEUED` i backfill** — kø er en handling brukeren tar (B5).

Indeksen `[journeyState, matchQueuedAt]` er den eneste matcherunden trenger for å hente køen sortert etter ventetid, uten table scan.

- **Sjekk 1 (tsc):** `npx tsc --noEmit`
- **Sjekk 2 (grep):** `grep -n "journeyState\|matchQueuedAt" prisma/schema.prisma` og `npx prisma validate`
- **Sjekk 3 (build):** `npm run build`
- **Sjekk 4 (FUNKSJONELT):**
  ```sql
  SELECT "journeyState", count(*) FROM "User" GROUP BY 1;
  ```
  → alle brukere har en gyldig verdi, ingen `NULL`. Antall `MATCHED` skal være lik antall aktive `JourneyProgress`:
  ```sql
  SELECT count(*) FROM "JourneyProgress"
  WHERE "endedAt" IS NULL AND "completedAt" IS NULL;
  ```
  De to tallene skal stemme. Noter begge i `deviations`.
- **Sjekk 5 (KONSEPT):** Invariant I-1 er nå uttrykt i skjemaet, ikke antatt.

**State:** `currentWave="B"`, `currentStep="B1"`, `completedSteps+=["B1"]`, `nextStep="B2"`
**Rollback:** Migrering ikke deployet: slett mappen under `prisma/migrations/` og kjør `npx prisma migrate resolve --rolled-back <navn>`. Deployet: skriv reverserende migrering.
**Commit:** `feat(schema): legg til journeyState og matchQueuedAt på User [ACT4 B1]`

---

## STEG B2 — `MatchHistory` som sperreliste *(additiv)*

**Formål:** Invariant I-7. Ved reiseslutt slettes alt (B3). Uten et minimalt spor mister systemet minnet om hvem som har vært koblet, og vil gladelig koble de samme to igjen neste natt.
**Avhengigheter:** B1
**Risiko:** Lav
**Filanker:** `prisma/schema.prisma` (ny modell)

**Patch-skisse:**

```prisma
model MatchHistory {
  id       String   @id @default(cuid())
  userAId  String
  userBId  String
  endedAt  DateTime @default(now())
  outcome  String   // "completed" | "early_exit" | "blocked" | "expired"

  @@unique([userAId, userBId])
  @@index([userAId])
  @@index([userBId])
}
```

- **Ingen relasjoner til `User`.** Bevisst: raden skal overleve at innhold slettes, og skal ikke kunne kaskadere. Den inneholder to ID-er og en dato — null personopplysninger utover selve koblingen.
- Par lagres **normalisert**: alltid `userAId < userBId` leksikografisk, slik at `@@unique` fanger paret uansett rekkefølge. Skriv en liten hjelpefunksjon `normalizePair(a, b)` i `lib/matching/matchHistory.ts` og bruk den overalt.

- **Sjekk 1 (tsc):** `npx tsc --noEmit`
- **Sjekk 2 (grep):** `grep -n "model MatchHistory" prisma/schema.prisma` og `npx prisma validate`
- **Sjekk 3 (build):** `npm run build`
- **Sjekk 4 (FUNKSJONELT):**
  ```sql
  INSERT INTO "MatchHistory" ("id","userAId","userBId","outcome")
  VALUES ('t1','aaa','bbb','completed');
  -- duplikat i motsatt rekkefølge skal avvises av applikasjonen via normalizePair
  INSERT INTO "MatchHistory" ("id","userAId","userBId","outcome")
  VALUES ('t2','aaa','bbb','completed');   -- ← skal feile på unique
  DELETE FROM "MatchHistory" WHERE id IN ('t1','t2');
  ```
  Andre innsetting skal feile med unique-brudd.
- **Sjekk 5 (KONSEPT):** Sperrelisten inneholder ingenting som kan identifisere innholdet i en samtale.

**State:** `currentWave="B"`, `currentStep="B2"`, `completedSteps+=["B2"]`, `nextStep="B3"`
**Rollback:** Som B1.
**Commit:** `feat(schema): legg til MatchHistory som sperreliste [ACT4 B2]`

---

## STEG B3 — `endJourney()` med verifisert sletting

**Formål:** Invariant I-6. ToSom lover at ingen ser samtalene. Ved reiseslutt skal alt innhold forsvinne — og slettingen skal være **etterprøvbar**.
**Avhengigheter:** B2
**Risiko:** Høy
**Filanker:** `lib/journey/endJourney.ts` (ny), `app/api/journey/exit/route.ts`
**Søkeanker:** `grep -rn "deleteMany" app/api/journey/`

**Hvorfor eksplisitt transaksjon og ikke cascade:** Cascade er stille — ett `delete` river ukjent mye med seg, uten telling, uten logg, uten mulighet til å stoppe. Sletting er dessuten ikke symmetrisk: samtalen skal dø, brukeren skal leve. Skjemaet har i dag kun **2** `onDelete: Cascade`, så cascade måtte uansett bygges fra bunnen.

**Patch-skisse — én `prisma.$transaction`, i denne rekkefølgen:**

```
 1. Message           deleteMany  { conversationId }
 2. JourneyStateLog   deleteMany  { conversationId }     // schema.prisma:195
 3. ResonanceSession  deleteMany  { conversationId }     // schema.prisma:224
 4. JourneyMilestone  deleteMany  { progressId }         // schema.prisma:210
 5. JourneyProgress   delete
 6. Conversation      delete
 7. MatchInsight      delete      (hvis finnes)
 8. Match             delete
 9. MatchHistory      create      { normalizePair(a,b), outcome }
10. Notification      deleteMany  match-relaterte for begge brukere
11. User × 2          update      { journeyState: IDLE, matchQueuedAt: null,
                                    lastMatchAt: null, lockedUntil: null }
12. AuditLog          create      { action: JOURNEY_ENDED, metadata: {antall slettet per tabell} }
```

**Merk:** Rekkefølgen 1–8 følger fremmednøkkelavhengighetene. Verifiser mot `prisma/schema.prisma` at ingen andre modeller peker på `Conversation` eller `JourneyProgress` — søk med:

```bash
grep -n "conversationId\|progressId" prisma/schema.prisma
```

Per commit `2d9b7fc` er de conversation-koblede modellene: `Message` (153), `JourneyStateLog` (195), `ResonanceSession` (224). **Finner du flere, legg dem inn — og noter i `deviations`.**

Signatur:

```ts
export async function endJourney(
  matchId: string,
  outcome: 'completed' | 'early_exit' | 'blocked' | 'expired'
): Promise<{ deleted: Record<string, number> }>
```

Legg til `onDelete: Cascade` på `Message → Conversation` og `JourneyMilestone → JourneyProgress` **kun som sikkerhetsnett** mot foreldreløse rader. Den vanlige veien går alltid gjennom `endJourney()`.

Koble `app/api/journey/exit/route.ts` til funksjonen. **Rett nynorsken samtidig** (regel 19): «Ingen aktiv reise funnet» → «Ingen aktiv reise funnet», «Reisen er allerede avsluttet» → «Reisen er allerede avsluttet».

- **Sjekk 1 (tsc):** `npx tsc --noEmit`
- **Sjekk 2 (grep):** `grep -rn "allerede\|funnet\|bruker" app/api/journey/` → **0 treff**
- **Sjekk 3 (build):** `npm run build`
- **Sjekk 4 (FUNKSJONELT):** Opprett en testreise med minst 5 meldinger og 2 milepæler. Kjør `endJourney()`. Deretter:
  ```sql
  SELECT
    (SELECT count(*) FROM "Message"          WHERE "conversationId" = :cid) AS msg,
    (SELECT count(*) FROM "JourneyStateLog"  WHERE "conversationId" = :cid) AS logs,
    (SELECT count(*) FROM "ResonanceSession" WHERE "conversationId" = :cid) AS res,
    (SELECT count(*) FROM "JourneyMilestone" WHERE "progressId"     = :pid) AS ms,
    (SELECT count(*) FROM "Conversation"     WHERE id = :cid)               AS conv,
    (SELECT count(*) FROM "Match"            WHERE id = :mid)               AS m,
    (SELECT count(*) FROM "MatchHistory"     WHERE "userAId" = :a)          AS hist;
  ```
  → **alle skal være 0 unntatt `hist` = 1.** Begge brukere skal ha `journeyState = 'IDLE'`. `AuditLog` skal ha én `JOURNEY_ENDED`-rad med tellingene.
- **Sjekk 5 (KONSEPT):** Invariant I-6 og I-7 oppfylt samtidig: alt innhold borte, koblingen husket.

**State:** `currentWave="B"`, `currentStep="B3"`, `completedSteps+=["B3"]`, `nextStep="B4"`
**Rollback:** `git revert --no-edit <lastCommit>` — funksjonen er ny og ikke i bruk før exit-ruten kobles.
**Commit:** `feat(journey): endJourney() med verifisert sletting og sperreliste [ACT4 B3]`

---

## STEG B4 — `JourneyProgress` blir match-scoped *(additiv → brytende)*

**Formål:** `JourneyProgress.userId @unique` gir én reise per bruker **for alltid**. Loopen «dag 30 → ny reise» er ikke bare uimplementert — den er strukturelt umulig. Samtidig legges grunnlaget for invariant I-5.
**Avhengigheter:** B3
**Risiko:** Høy
**Filanker:** `prisma/schema.prisma:172-191`
**Søkeanker:** `sed -n '/^model JourneyProgress /,/^}/p' prisma/schema.prisma`

**Patch-skisse — to migreringer i ett steg:**

*Migrering 1 (additiv):*

```prisma
model JourneyProgress {
  matchId      String?    @unique      // nytt, midlertidig nullable
  userASeenAt  DateTime?
  userBSeenAt  DateTime?
  bothSeenAt   DateTime?               // null = reisen har ikke startet
  // day beholder navnet sitt (schema.prisma:176) — IKKE døp om til currentDay
  // userId beholdes foreløpig
}
```

*Backfill:* for hver eksisterende `JourneyProgress`, finn brukerens aktive `Match` og sett `matchId`. Sett `bothSeenAt = startedAt` for alle eksisterende reiser — de er allerede i gang, og skal ikke fryses av den nye regelen.

*Migrering 2 (brytende):* gjør `matchId` påkrevd, fjern `userId @unique` og relasjonen `User.journey`. Kjør først når backfill er verifisert til 100 %.

**Viktig:** Feltet heter `day` (`schema.prisma:176`), ikke `currentDay`. Masterplanen bruker `currentDay` som beskrivende navn — **behold `day`** for å unngå en unødvendig omdøping gjennom hele kodebasen. Sett `@default(0)`; 0 betyr «ikke startet».

Alle lesesteder av `JourneyProgress` må oppdateres fra `userId`-oppslag til `matchId`-oppslag. Finn dem:

```bash
grep -rn "journeyProgress" app/ lib/ --include=*.ts --include=*.tsx | grep -v node_modules
```

- **Sjekk 1 (tsc):** `npx tsc --noEmit`
- **Sjekk 2 (grep):** `grep -n "matchId\|bothSeenAt" prisma/schema.prisma` og `grep -rn "journeyProgress.findUnique({ where: { userId" app/ lib/` → **0 treff**
- **Sjekk 3 (build):** `npm run build`
- **Sjekk 4 (FUNKSJONELT):** Verifiser at reise nr. 2 nå er mulig:
  1. Opprett reise for bruker X → `endJourney()` → `journeyState = IDLE`
  2. Opprett ny match for X → ny `JourneyProgress` med annen `matchId`
  ```sql
  SELECT count(*) FROM "JourneyProgress" WHERE "matchId" IS NULL;   -- → 0
  ```
  Trinn 2 skal lykkes. Under gammelt skjema ville det feilet på unique.
- **Sjekk 5 (KONSEPT):** Loopen er nå syklisk — invariant I-1 håndheves av `journeyState`, ikke av en unique-begrensning som blokkerer gjenbruk.

**State:** `currentWave="B"`, `currentStep="B4"`, `completedSteps+=["B4"]`, `nextStep="B5"`
**Rollback:** Reverserende migrering. **Ta backup før dette steget.**
**Commit:** `feat(schema): gjør JourneyProgress match-scoped med bothSeenAt [ACT4 B4]`

---

## STEG B5 — «Start reisen» setter kø, onboarding matcher ikke 🔴

**Formål:** Invariant I-3. `OnboardingFlow.tsx:411` kaller `POST /api/match` rett etter siste onboarding-steg og matcher **umiddelbart** med `findBestMatchFor` — en annen motor, en annen status, uten dealbreakere og uten batching. Den nattlige cron-jobben treffer i praksis bare de som falt gjennom.
**Avhengigheter:** B4
**Risiko:** Høy
**Filanker:** `app/onboarding/OnboardingFlow.tsx:410-420`, `app/api/match/route.ts`, `app/onboarding/steps/Step10StartReisen.tsx`
**Søkeanker:** `grep -n "fetch('/api/match'" app/onboarding/OnboardingFlow.tsx`

Dagens kode:

```tsx
// app/onboarding/OnboardingFlow.tsx:410-420
try {
  const matchRes = await fetch('/api/match', {
    method: 'POST', …, body: JSON.stringify({ userId }),
  });
  if (matchRes.ok) {
    window.location.href = `/matching?userId=${userId}`;
    return;
  }
} catch { /* matching failed — fall through */ }
window.location.href = '/dashboard';
```

**Patch-skisse:**

- Erstatt `POST /api/match` med `POST /api/journey/queue` (ny rute).
- Ny rute setter, i én transaksjon, for den innloggede brukeren:
  `journeyState: QUEUED`, `matchQueuedAt: now()`.
  Forutsetninger: `onboardingComplete === true`, `journeyState === 'IDLE'`, ikke `bannedAt`/`deletedAt`. Ellers `409` med forklarende feilkode.
- Ruten skal være **idempotent**: er brukeren allerede `QUEUED`, returner `200` uten å endre `matchQueuedAt` (ellers kan hun snike i køen ved å trykke på nytt).
- Etter vellykket kø → redirect til `/dashboard`, **ikke** til `/matching`.
- `POST /api/match` beholdes foreløpig (fjernes i B7) for ikke å bryte andre kallsteder i samme steg.

- **Sjekk 1 (tsc):** `npx tsc --noEmit`
- **Sjekk 2 (grep):** `grep -n "api/match" app/onboarding/OnboardingFlow.tsx` → **0 treff**
- **Sjekk 3 (build):** `npm run build`
- **Sjekk 4 (FUNKSJONELT):** Fullfør onboarding med en testbruker. Deretter:
  ```sql
  SELECT "journeyState", "matchQueuedAt" FROM "User" WHERE id = :uid;
  -- → QUEUED, tidsstempel satt
  SELECT count(*) FROM "Match" WHERE "userAId" = :uid OR "userBId" = :uid;
  -- → 0    ← ingen match opprettet ved onboarding
  ```
  Andre spørring er den viktigste: **onboarding skal ikke lenger produsere matcher.**
  Kall `/api/journey/queue` en gang til → `200`, og `matchQueuedAt` skal være **uendret**.
- **Sjekk 5 (KONSEPT):** Invariant I-3. «Start reisen» er nå det eneste menneskestyrte valget, og det er et valg om å delta — ikke om hvem.

**State:** `currentWave="B"`, `currentStep="B5"`, `completedSteps+=["B5"]`, `nextStep="B6"`
**Rollback:** `git checkout -- app/onboarding/OnboardingFlow.tsx && rm -rf app/api/journey/queue`
**Commit:** `feat(match): erstatt umiddelbar matching med kø ved Start reisen [ACT4 B5]`

---

## STEG B6 — Matcherunden: kohort, parvis kobling, varsling 🔴

**Formål:** Kjernen i konseptkorreksjonen. Én motor, én runde, parvis kobling uten samtykke — pluss funn N-4: matchen skal opprette en in-app `Notification`.
**Avhengigheter:** B5
**Risiko:** Høy
**Filanker:** `app/api/cron/matching/route.ts`, `lib/matching/findBestResonance.ts`, `lib/matching/matchHistory.ts`
**Søkeanker:** `grep -n "BATCH_SIZE\|findBestResonance" app/api/cron/matching/route.ts`

**Patch-skisse — algoritmen:**

```
1.  Advisory lock (finnes: MATCHING_CRON_LOCK_ID = 123456789)
2.  kø = User.findMany({ journeyState: QUEUED }) ORDER BY matchQueuedAt ASC
3.  HVIS kø.length < MIN_COHORT_SIZE (20)
       OG ingen har matchQueuedAt eldre enn 72 timer
       → SystemLog { level: info, metadata: { deferred: true, queueSize } }
       → returner 200 { deferred: true }   ← ikke en feil
4.  Score alle par (i, j) i køen
       - dealbreakere (sjekkAlleDealbreakers — finnes, findBestResonance.ts:12)
       - sperreliste (MatchHistory, normalisert par)
       - hopp over par der score < MIN_SCORE
5.  Sorter kandidatpar på score, synkende
6.  Grådig kobling: ta beste par, marker begge som brukt, gjenta
7.  Per par, én transaksjon:
       Match(status: active)
       Conversation(matchId)
       JourneyProgress(matchId, day: 0, bothSeenAt: null)
       Notification × 2  (type: MATCH, in-app)
       User × 2 → journeyState: MATCHED, matchQueuedAt: null, lastMatchAt: now()
8.  Ukoblede beholder journeyState = QUEUED
9.  Heartbeat: { paired, remaining, durationMs, deferred, queueSize }
10. Slipp lock
```

**Konstanter** i `config/matching.ts`: `MIN_COHORT_SIZE = 20`, `MAX_QUEUE_WAIT_HOURS = 72`.

**Hvorfor terskel 20:** med 6 i køen er «beste match» nesten tilfeldig. En dårlig match dag 1 er verre enn to dagers venting — særlig for de første brukerne, som avgjør om ToSom får ord på seg for å virke. 72-timers ventilen sikrer at ingen står fast i det uendelige.

**Hvorfor grådig og ikke optimal:** global optimalisering (Gale–Shapley) gir marginalt bedre resultat til vesentlig høyere kompleksitet. Grådig på synkende score er forutsigbart og lett å feilsøke. Revurderes ved 50k+.

**Om N-4 (varsling):** `Notification`-raden skal opprettes, men **ingen push, e-post eller SMS** (invariant I-4). Raden gjør at dashbordet kan vise at noe har skjedd når hun logger inn av eget initiativ.

Tidsbudsjettet fra A4 gjelder: avbryt scoringen og skriv det som er koblet så langt hvis `Date.now() > deadline`.

- **Sjekk 1 (tsc):** `npx tsc --noEmit`
- **Sjekk 2 (grep):** `grep -n "MIN_COHORT_SIZE\|MAX_QUEUE_WAIT_HOURS" config/matching.ts app/api/cron/matching/route.ts` og `grep -n "notification.create" app/api/cron/matching/route.ts` → **minst 1 treff**
- **Sjekk 3 (build):** `npm run build`
- **Sjekk 4 (FUNKSJONELT):** Tre scenarier i staging, alle må observeres:

  **(a) Under terskel:** sett 10 brukere i `QUEUED` med ferske tidsstempler. Kjør cron.
  ```sql
  SELECT count(*) FROM "Match" WHERE "createdAt" > now() - interval '5 min';  -- → 0
  SELECT metadata FROM "SystemLog" WHERE module='cron:matching'
    ORDER BY "createdAt" DESC LIMIT 1;   -- → deferred: true
  ```

  **(b) Over terskel, oddetall:** sett 21 brukere i `QUEUED`. Kjør cron.
  ```sql
  SELECT count(*) FROM "Match" WHERE status='active'
    AND "createdAt" > now() - interval '5 min';        -- → 10
  SELECT count(*) FROM "User" WHERE "journeyState"='QUEUED';  -- → 1
  SELECT count(*) FROM "User" WHERE "journeyState"='MATCHED'; -- → 20
  SELECT count(*) FROM "Notification" WHERE "createdAt" > now() - interval '5 min'; -- → 20
  SELECT count(*) FROM "JourneyProgress" WHERE "bothSeenAt" IS NULL
    AND "createdAt" > now() - interval '5 min';        -- → 10
  ```

  **(c) Sperreliste:** legg to brukere i `MatchHistory`, sett begge i `QUEUED` sammen med 20 andre. Kjør cron. → de to skal **ikke** være koblet til hverandre.

- **Sjekk 5 (KONSEPT):** Invariantene I-2, I-3, I-4, I-7. Ingen match har `pending`-status. Ingen bruker er bedt om å godta noe. Ingen varsling er sendt ut av systemet.

**State:** `currentWave="B"`, `currentStep="B6"`, `completedSteps+=["B6"]`, `nextStep="B7"`
**Rollback:** `git revert --no-edit <lastCommit>`
**Commit:** `feat(match): kohortbasert parvis kobling uten samtykke [ACT4 B6]`

---

## STEG B7 — Fjern samtykkeflyten *(brytende)* 🔴

**Formål:** Invariant I-2. Fjern all kode som lar en bruker si ja eller nei til et menneske.
**Avhengigheter:** B6
**Risiko:** Høy
**Filanker:**
- `app/api/match/accept/route.ts` (hele filen)
- `components/MatchActions.tsx` (hele filen)
- `app/matching/page.tsx:78`, `:116` (accept-kall)
- `app/api/match/route.ts` (POST-handler)
- `lib/matching/findBestMatchFor.ts` (hele filen)

**Søkeanker:**
```bash
grep -rn "match/accept\|acceptedBy\|rejectedBy" app/ lib/ components/ --include=*.ts --include=*.tsx
```

**Patch-skisse:**

| Slett | Merknad |
|---|---|
| `app/api/match/accept/route.ts` | Samtykkeporten |
| `components/MatchActions.tsx` | Ja/nei-knapper. Kaller dessuten `/api/match/request` — **en rute som ikke finnes**. Død kode mot en 404 |
| `lib/matching/findBestMatchFor.ts` | Motor A |
| `POST`-handler i `app/api/match/route.ts` | Beholder `GET` |
| Ja/nei-UI i `app/matching/page.tsx` | Siden blir en ren visning av matchen, eller redirectes til `/dashboard` |

Verifiser at ingen andre filer importerer det som slettes. `app/api/match/status/route.ts` returnerer i dag `acceptance: {…}` — fjern det feltet og oppdater eventuelle konsumenter.

**Ikke rør skjemaet i dette steget.** Feltene fjernes i B8, etter at koden som leser dem er borte. Rekkefølgen er viktig: kode først, deretter kolonner.

- **Sjekk 1 (tsc):** `npx tsc --noEmit`
- **Sjekk 2 (grep):**
  ```bash
  grep -rn "match/accept\|acceptedBy\|rejectedBy\|MatchActions" app/ lib/ components/ \
    --include=*.ts --include=*.tsx | wc -l     # → 0
  test ! -f lib/matching/findBestMatchFor.ts && echo SLETTET
  ```
- **Sjekk 3 (build):** `npm run build`
- **Sjekk 4 (FUNKSJONELT):**
  ```bash
  curl -s -o /dev/null -w "%{http_code}" -X POST localhost:3000/api/match/accept   # → 404
  curl -s -o /dev/null -w "%{http_code}" -X POST localhost:3000/api/match          # → 404 eller 405
  curl -s -o /dev/null -w "%{http_code}" localhost:3000/api/match                  # → 200 (GET beholdt)
  ```
  Last `/matching` i nettleser med en aktiv match → **ingen Ja/Nei-knapper synlige.**
- **Sjekk 5 (KONSEPT):** Invariant I-2 og I-3. Det finnes nå nøyaktig én vei til en match, og ingen vei til å avvise et menneske.

**State:** `currentWave="B"`, `currentStep="B7"`, `completedSteps+=["B7"]`, `nextStep="B8"`
**Rollback:** `git revert --no-edit <lastCommit>`
**Commit:** `refactor(match): fjern samtykkeflyten — ToSom kobler, godtar ikke [ACT4 B7]`

---

## STEG B8 — Skjemaopprydding *(brytende)*

**Formål:** Fjern kolonner og enum-verdier som ikke lenger har mening. Modellen blir mindre av å bli riktig.
**Avhengigheter:** B7
**Risiko:** Høy
**Filanker:** `prisma/schema.prisma:84-119` (`Match`), `:486-493` (`MatchStatus`), `:421-436` (`MatchInsight`)

**Patch-skisse:**

```prisma
// Fjernes fra model Match:
acceptedByA      DateTime?
acceptedByB      DateTime?
rejectedByA      DateTime?
rejectedByB      DateTime?
rejectionReason  String?

// MatchStatus: fra 6 verdier til 3
enum MatchStatus {
  active     // koblet, reise pågår
  ended      // avsluttet — normalt slettet umiddelbart
  expired    // forlatt i 14 dager uten at begge var innom
}

// model MatchInsight — slettes (foreldreløs siden v2.0, ingen ruter skriver til den)
```

**Datamigrering før kolonnene fjernes:**

```sql
UPDATE "Match" SET status = 'active'  WHERE status IN ('pending','matched');
UPDATE "Match" SET status = 'ended'   WHERE status = 'unmatched';
-- verifiser at ingen rader står igjen med gamle verdier før enum endres
SELECT status, count(*) FROM "Match" GROUP BY 1;
```

Postgres tillater ikke å fjerne enum-verdier direkte. Framgangsmåte: opprett ny enum-type, konverter kolonnen, slett gammel type. Prisma genererer dette — **les den genererte SQL-en før du kjører den.**

`Match.type` (`schema.prisma:91`) har `@default("pending")` som fritekst-streng. Sett den til `"standard"` eller fjern feltet hvis ingen leser det. Sjekk: `grep -rn "match.type\|\.type ===" app/ lib/`.

- **Sjekk 1 (tsc):** `npx tsc --noEmit`
- **Sjekk 2 (grep):**
  ```bash
  grep -n "acceptedBy\|rejectedBy\|rejectionReason\|MatchInsight" prisma/schema.prisma  # → 0
  npx prisma validate && npx prisma format --check; echo "exit=$?"                       # → 0
  ```
- **Sjekk 3 (build):** `npm run build`
- **Sjekk 4 (FUNKSJONELT):**
  ```sql
  SELECT status, count(*) FROM "Match" GROUP BY 1;
  -- → kun 'active', 'ended', 'expired'
  SELECT column_name FROM information_schema.columns
  WHERE table_name = 'Match' AND column_name LIKE '%ccepted%';
  -- → 0 rader
  ```
  `npx jest` fortsatt grønn.
- **Sjekk 5 (KONSEPT):** Skjemaet uttrykker nå koblingsmodellen. Ingen kolonne antyder at et menneske kan avvises.

**State:** `currentWave="B"`, `currentStep="B8"`, `completedSteps+=["B8"]`, `nextStep="B9"`
**Rollback:** Reverserende migrering. **Backup før steget er obligatorisk** — kolonner som slettes kan ikke gjenskapes med innhold.
**Commit:** `refactor(schema): rydd MatchStatus og fjern samtykkefelt [ACT4 B8]`

---

## STEG B9 — Dag 1 starter når begge har vært innom

**Formål:** Invariant I-5. Cron ruller dagen uansett. Logger hun inn først på fredag, er dag 1–4 brukt opp i stillhet — og hun betalte for 30 dager. Siden vi bevisst ikke varsler (I-4), må reisen vente på henne.
**Avhengigheter:** B8
**Risiko:** Middels
**Filanker:** `app/api/cron/journey/route.ts`, `app/api/dashboard/overview/route.ts` (eller tilsvarende innlastingspunkt)
**Søkeanker:** `grep -n "journeyProgress.findMany\|day: { increment" app/api/cron/journey/route.ts`

**Patch-skisse:**

- **Registrering av oppmøte:** når en bruker laster dashboard eller chat og har en aktiv match, sett `userASeenAt`/`userBSeenAt` (avhengig av hvem hun er) hvis `null`. Er begge satt og `bothSeenAt` er `null` → sett `bothSeenAt = now()` og `day = 1` i samme transaksjon.
- **Journey-cron:** legg til `bothSeenAt: { not: null }` i `where`-klausulen. Reiser som ikke har startet, står stille.
- **Utløp:** reiser der `bothSeenAt IS NULL` og `Match.createdAt` er eldre enn 14 dager → `endJourney(matchId, 'expired')`. Ellers blokkerer forlatte matcher køen i det uendelige. Legg denne opprydningen i journey-cron.
- Dagsvarsler beholdes uendret (invariant I-8).

- **Sjekk 1 (tsc):** `npx tsc --noEmit`
- **Sjekk 2 (grep):** `grep -n "bothSeenAt" app/api/cron/journey/route.ts app/api/dashboard/*/route.ts`
- **Sjekk 3 (build):** `npm run build`
- **Sjekk 4 (FUNKSJONELT):**
  1. Lag en match. `bothSeenAt` er `null`, `day = 0`.
  2. Kjør journey-cron → `day` skal fortsatt være **0**.
     ```sql
     SELECT day, "bothSeenAt" FROM "JourneyProgress" WHERE "matchId" = :mid;  -- → 0, null
     ```
  3. La bruker A laste dashbordet → `userASeenAt` satt, `bothSeenAt` fortsatt `null`, `day` = 0.
  4. La bruker B laste dashbordet → `bothSeenAt` satt, `day` = 1.
  5. Kjør journey-cron → `day` = 2.
  Alle fem trinn må observeres i databasen.
- **Sjekk 5 (KONSEPT):** Invariant I-5 og I-8. Ingen dager går tapt, ingen varsling ble sendt, og dagsvarslene fungerer fortsatt fra dag 1.

**State:** `currentWave="B"`, `currentStep="B9"`, `completedSteps+=["B9"]`, `nextStep="B10"`
**Rollback:** `git revert --no-edit <lastCommit>`
**Commit:** `feat(journey): start dag 1 først når begge har vært innom [ACT4 B9]`

---

## STEG B10 — Dag 30: to utganger

**Formål:** Lukke loopen. Begge utganger sletter alt; den ene fører tilbake i køen.
**Avhengigheter:** B9
**Risiko:** Middels
**Filanker:** `app/reisen/avslutning/page.tsx`, `app/api/journey/exit/route.ts`, `app/api/cron/journey/route.ts`

**Patch-skisse:**

- Ved `day === 30` viser journey-cron avslutningsvalget (via `Notification` — dette er et dagsvarsel, tillatt av I-8).
- `/reisen/avslutning` presenterer to valg:

  | Valg | `outcome` | Etterpå |
  |---|---|---|
  | **«Vi fant hverandre»** | `completed` | `endJourney()` → `IDLE`. Takkeside |
  | **«Ny reise»** | `completed` | `endJourney()` → `IDLE` → [betaling] → bekreft profil → kø |

- Begge kaller `endJourney()`. Forskjellen er kun hvor brukeren sendes etterpå.
- **Bekreftelsesdialog er påkrevd** før begge, med ordrett tekst:
  > «Dette sletter samtalen for dere begge. Det kan ikke angres.»
- Tidlig avslutning (før dag 30) bruker samme funksjon med `outcome: 'early_exit'`.

- **Sjekk 1 (tsc):** `npx tsc --noEmit`
- **Sjekk 2 (grep):** `grep -rn "endJourney" app/api/journey/ app/reisen/`
- **Sjekk 3 (build):** `npm run build`
- **Sjekk 4 (FUNKSJONELT):** Kjør begge veier på hver sin testreise:
  ```sql
  SELECT "journeyState" FROM "User" WHERE id IN (:a, :b);   -- → IDLE, IDLE
  SELECT count(*) FROM "Conversation" WHERE "matchId" = :mid;  -- → 0
  SELECT outcome FROM "MatchHistory" WHERE "userAId" = :a;     -- → completed
  ```
  Deretter: sett bruker A i kø igjen → `journeyState = QUEUED` skal lykkes.
- **Sjekk 5 (KONSEPT):** Loopen er lukket. Invariant I-1, I-6, I-7 holder gjennom en full syklus.

**State:** `currentWave="B"`, `currentStep="B10"`, `completedSteps+=["B10"]`, `nextStep="B11"`
**Rollback:** `git revert --no-edit <lastCommit>`
**Commit:** `feat(journey): to utganger ved dag 30 med full sletting [ACT4 B10]`

---

## STEG B11 — CI-guard mot at samtykkeflyten kommer tilbake

**Formål:** Regel 8 i praksis. v2.0 dokumenterte at STEG 3.4 fjernet sikkerheten STEG 3.3 innførte, uten at noen merket det. **Det som er fjernet med hensikt, skal beskyttes mot å komme tilbake ved uhell.**
**Avhengigheter:** B10
**Risiko:** Lav
**Filanker:** `.github/workflows/ci.yml` (etter jobben `cron-guard`, linje ~278)

**Patch-skisse — ny jobb `concept-guard`:**

```yaml
concept-guard:
  name: Konseptvakt — koblingsmodellen
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - name: Ingen samtykkeflyt
      run: |
        if grep -rn "acceptedBy\|rejectedBy\|match/accept" \
             app/ lib/ components/ prisma/ --include=*.ts --include=*.tsx --include=*.prisma; then
          echo "::error::Samtykkeflyt gjeninnført. Se TOSOM-MASTERPLAN-v3.0 DEL 2."
          exit 1
        fi
    - name: Kun én matchemotor
      run: |
        if grep -rn "findBestMatchFor" app/ lib/ --include=*.ts; then
          echo "::error::Andre matchemotor gjeninnført."
          exit 1
        fi
    - name: Ingen 05:00 i brukervendt tekst
      run: |
        if grep -rn "05:00\|kl. 5" app/ components/ --include=*.tsx | grep -v admin; then
          echo "::error::Driftsdetalj lekket til brukervendt tekst."
          exit 1
        fi
```

Legg jobben til i `needs:` for `status`-jobben (linje ~313) slik at den faktisk blokkerer.

Utvid samtidig `lang-guard` med ordene som slapp gjennom: `allerede`, `funnet`, `bruker`, `ikke`, `hvordan`, `vær vennlig`.

- **Sjekk 1 (tsc):** `npx tsc --noEmit`
- **Sjekk 2 (grep):** `grep -n "concept-guard" .github/workflows/ci.yml`
- **Sjekk 3 (build):** `npm run build`
- **Sjekk 4 (FUNKSJONELT):** Kjør guard-kommandoene lokalt → **exit 0**. Legg deretter inn `const acceptedByA = null` i en midlertidig fil → **exit 1**. Fjern filen.
- **Sjekk 5 (KONSEPT):** Maskinen håndhever nå invariantene I-2, I-3 og I-9.

**State:** `currentWave="B"`, `currentStep="B11"`, `completedSteps+=["B11"]`, `nextStep="C1"`, **`waveGateB=true`**, `scores.produkt=80`
**Rollback:** `git checkout -- .github/workflows/ci.yml`
**Commit:** `ci(guard): hindre gjeninnføring av samtykkeflyt [ACT4 B11]`

> ### 🔒 SPERRE — bølge B ferdigkriterium
>
> Sett `waveGateB=true` **kun** når alle er sanne:
> - Onboarding produserer ingen match (B5, Sjekk 4)
> - Runde under terskel utsettes; over terskel kobler N/2 par (B6)
> - `/api/match/accept` → 404, ingen ja/nei i UI (B7)
> - `MatchStatus` har kun `active`/`ended`/`expired` (B8)
> - `day` forblir 0 til begge har vært innom (B9)
> - `endJourney()` etterlater 0 rader, `MatchHistory` skrevet (B3, B10)
> - `concept-guard` grønn (B11)
> - `npx tsc --noEmit` → 0 feil, `npx jest` grønn, `npm run build` grønn
>
> **En full syklus må være kjørt i staging:** kø → kobling → oppmøte → dag 1 → dag 30 → sletting → kø igjen.

---

# BØLGE C — TILLIT OG TRYGGHET (5 steg)

> ToSom kobler to fremmede i et privat rom i 30 dager, uten at de kan velge hverandre bort. Rommet er virtuelt og risikoen lavere enn i apper der man møtes fysisk — men fraværet av samtykke flytter ansvaret til plattformen. **Når brukeren ikke fikk velge, må plattformen sørge for at hun kan gå.**

## STEG C1 — `Report`-modell og API

**Formål:** Det finnes ban/unban og samtaleinnsyn i admin. Det som mangler er **inngangen fra brukeren**.
**Avhengigheter:** B11, `waveGateB=true`
**Risiko:** Lav
**Filanker:** `prisma/schema.prisma` (ny modell), `app/api/report/route.ts` (ny)

**Patch-skisse:**

```prisma
model Report {
  id          String         @id @default(cuid())
  reporterId  String
  reportedId  String
  matchId     String?
  category    ReportCategory
  description String?
  status      ReportStatus   @default(OPEN)
  createdAt   DateTime       @default(now())
  reviewedAt  DateTime?
  reviewedBy  String?

  @@index([status, createdAt])
  @@index([reportedId])
}

enum ReportCategory { HARASSMENT  INAPPROPRIATE  SPAM  FAKE_PROFILE  OTHER }
enum ReportStatus   { OPEN  REVIEWED  ACTIONED  DISMISSED }
```

`POST /api/report`: krever autentisering, rate-limitet (Upstash finnes), validerer at `reportedId` faktisk er brukerens nåværende eller tidligere match. Utløser `sendAlert('warn', …)` fra A5.

**`Report` slettes ikke av `endJourney()`** — en rapport må overleve at samtalen slettes, ellers kan man rapportere og deretter avslutte for å skjule sporet. Dokumenter dette eksplisitt i koden.

- **Sjekk 1 (tsc):** `npx tsc --noEmit`
- **Sjekk 2 (grep):** `grep -n "model Report" prisma/schema.prisma && npx prisma validate`
- **Sjekk 3 (build):** `npm run build`
- **Sjekk 4 (FUNKSJONELT):** `POST /api/report` med gyldig sesjon → `201`, rad i `Report` med `status = OPEN`, varsel mottatt. Kjør `endJourney()` for samme match → **`Report`-raden består.**
- **Sjekk 5 (KONSEPT):** Rapportering krever ikke at reisen avsluttes. De to tingene er forskjellige, og å tvinge dem sammen gjør at færre rapporterer.

**State:** `currentWave="C"`, `currentStep="C1"`, `completedSteps+=["C1"]`, `nextStep="C2"`
**Rollback:** Reverserende migrering + `rm -rf app/api/report`
**Commit:** `feat(safety): Report-modell og rapporterings-API [ACT4 C1]`

---

## STEG C2 — Rapporter / Avslutt / Blokker i grensesnittet

**Formål:** Utveien må være nær der problemet oppstår.
**Avhengigheter:** C1
**Risiko:** Lav
**Filanker:** `components/chat/` (ny meny), `app/settings/`

**Patch-skisse:** Tre valg, tilgjengelig **i chatten** og **i innstillinger**:

| Valg | Effekt |
|---|---|
| **Rapporter** | `POST /api/report`. Samtalen består |
| **Avslutt reisen** | `endJourney(matchId, 'early_exit')`. Begge frigjøres |
| **Blokker og avslutt** | `endJourney(matchId, 'blocked')` — `MatchHistory` gir permanent sperre |

Bekreftelsesdialog for de to siste, med teksten fra B10. Plassering: diskret meny i chat-headeren — tilgjengelig, ikke fremtredende.

- **Sjekk 1 (tsc):** `npx tsc --noEmit`
- **Sjekk 2 (grep):** `grep -rn "api/report\|endJourney" components/chat/ app/settings/`
- **Sjekk 3 (build):** `npm run build`
- **Sjekk 4 (FUNKSJONELT):** Fra chat-UI: rapporter → rad i `Report`. Blokker og avslutt → alt slettet, `MatchHistory.outcome = 'blocked'`, begge `IDLE`. Sett begge i kø → de skal **ikke** kobles igjen.
- **Sjekk 5 (KONSEPT):** Brukeren kan alltid gå. Invariant I-7 håndhever blokkeringen.

**State:** `currentWave="C"`, `currentStep="C2"`, `completedSteps+=["C2"]`, `nextStep="C3"`
**Rollback:** `git revert --no-edit <lastCommit>`
**Commit:** `feat(safety): rapporter, avslutt og blokker i chat og innstillinger [ACT4 C2]`

---

## STEG C3 — Admin-flate for rapporter og logget samtaleinnsyn

**Formål:** Rapporter må behandles. Og admin-innsyn i private samtaler må være sporbart — **et innsyn ingen kan spore, er et løftebrudd som venter på å skje.**
**Avhengigheter:** C2
**Risiko:** Middels
**Filanker:** `app/admin/reports/page.tsx` (ny), `app/api/admin/conversations/`

**Patch-skisse:**

- Admin-side som lister `Report` med `status = OPEN`, sortert eldst først. Handlinger: se kontekst, marker gjennomgått, iverksett (ban), avvis.
- **Hvert admin-innsyn i en samtale skriver `AuditLog`** med `action`, `adminId`, `conversationId`, tidsstempel. Dette gjelder alle eksisterende ruter som eksponerer meldingsinnhold — finn dem:
  ```bash
  grep -rln "message" app/api/admin/ --include=route.ts
  ```
- Innsyn bør kreve en oppgitt begrunnelse som lagres i `AuditLog.metadata`.

- **Sjekk 1 (tsc):** `npx tsc --noEmit`
- **Sjekk 2 (grep):** `grep -rn "AuditLog" app/api/admin/conversations/ | head`
- **Sjekk 3 (build):** `npm run build`
- **Sjekk 4 (FUNKSJONELT):** Åpne en samtale som admin →
  ```sql
  SELECT action, "adminId", metadata, "createdAt" FROM "AuditLog"
  ORDER BY "createdAt" DESC LIMIT 1;
  ```
  → fersk rad med `conversationId` og begrunnelse.
- **Sjekk 5 (KONSEPT):** ToSom lover at ingen ser samtalene. Der unntak er nødvendig, er de sporbare.

**State:** `currentWave="C"`, `currentStep="C3"`, `completedSteps+=["C3"]`, `nextStep="C4"`
**Rollback:** `git revert --no-edit <lastCommit>`
**Commit:** `feat(admin): rapportbehandling og logget samtaleinnsyn [ACT4 C3]`

---

## STEG C4 — Vilkår, personvern og angrerett

**Formål:** Betaling før onboarding utløser et juridisk krav. **Angrerettloven gir 14 dagers angrerett på digitale tjenester** — med mindre kunden uttrykkelig samtykker til at leveringen starter straks og erkjenner at angreretten bortfaller.
**Avhengigheter:** C3
**Risiko:** Lav (høy hvis den utelates)
**Filanker:** `app/vilkår/page.tsx`, `app/personvern/page.tsx`, `app/betaling/page.tsx`

**Patch-skisse — vilkårene må dekke:**

1. Hva 349 kr gir: **én reise, 30 dager**
2. At man kobles til én person, og **ikke velger** hvem
3. At motparten kan avslutte, og at samtalen da slettes for begge
4. At alle data slettes ved reiseslutt
5. Aldersgrense 18 år
6. Ingen refusjon etter påbegynt reise — **forutsetter punkt 7**
7. Avkrysningsboks i betalingssteget, ordrett:
   > ☐ Jeg samtykker til at ToSom starter reisen min straks, og forstår at angreretten dermed bortfaller.

Uten punkt 7 har enhver bruker 14 dagers ubetinget krav på pengene tilbake. Med det er posisjonen «ingen refusjon» juridisk holdbar. Avkrysningen skal lagres på `Order` (bølge G) med tidsstempel.

Personvern må dekke: hva som lagres, hvor lenge, at det slettes ved reiseslutt, at admin kan få innsyn ved rapportering (og at innsynet logges), og retten til dataeksport.

- **Sjekk 1 (tsc):** `npx tsc --noEmit`
- **Sjekk 2 (grep):** `grep -c "angrerett" app/vilkår/page.tsx` → **≥ 1**
- **Sjekk 3 (build):** `npm run build`
- **Sjekk 4 (FUNKSJONELT):** `/vilkår` og `/personvern` → `200`, alle syv punkter til stede ved gjennomlesing. Avkrysningsboksen synlig i betalingssteget (inaktiv til bølge G).
- **Sjekk 5 (KONSEPT):** Vilkårene beskriver koblingsmodellen, ikke en samtykkemodell.

**State:** `currentWave="C"`, `currentStep="C4"`, `completedSteps+=["C4"]`, `nextStep="C5"`
**Rollback:** `git checkout -- app/vilkår/page.tsx app/personvern/page.tsx`
**Commit:** `docs(legal): oppdater vilkår og personvern for koblingsmodellen [ACT4 C4]`

> **Anbefaling til bruker:** la en jurist lese vilkår og personvern **før betaling slås på** (bølge G). Ikke nødvendig før myk lansering — den er gratis.

---

## STEG C5 — Reell kontosletting og dataeksport

**Formål:** `app/api/settings/delete-account/route.ts:19` anonymiserer i dag, men sletter ikke. GDPR art. 17 (sletting) og art. 20 (dataportabilitet).
**Avhengigheter:** C4
**Risiko:** Middels
**Filanker:** `app/api/settings/delete-account/route.ts`, `app/api/settings/export/route.ts` (ny)

**Patch-skisse:**

- **Sletting:** har brukeren en aktiv reise → kall `endJourney(matchId, 'early_exit')` først, deretter slett brukerdata. `MatchHistory`-raden beholdes (kun to ID-er). `AuditLog` med admin-handlinger beholdes av revisjonshensyn — dokumenter dette i personvernerklæringen.
- Gjenbruk sletterekkefølgen fra `scripts/hardDeleteDeletedUsers.ts` der den er riktig.
- **Eksport:** `GET /api/settings/export` returnerer JSON med profil, svar, aktiv reise og meldinger — kun brukerens egne data. Rate-limitet.

- **Sjekk 1 (tsc):** `npx tsc --noEmit`
- **Sjekk 2 (grep):** `grep -n "endJourney" app/api/settings/delete-account/route.ts`
- **Sjekk 3 (build):** `npm run build`
- **Sjekk 4 (FUNKSJONELT):** Slett en testbruker med aktiv reise →
  ```sql
  SELECT count(*) FROM "User" WHERE id = :uid;              -- → 0
  SELECT count(*) FROM "Message" WHERE "senderId" = :uid;   -- → 0
  SELECT count(*) FROM "MatchHistory" WHERE "userAId" = :uid OR "userBId" = :uid;  -- → 1
  ```
  Motparten skal være `IDLE` og uten foreldreløse rader. `GET /api/settings/export` → `200` med gyldig JSON.
- **Sjekk 5 (KONSEPT):** Sletting er fullstendig og etterprøvbar. Sperrelisten overlever, uten innhold.

**State:** `currentWave="C"`, `currentStep="C5"`, `completedSteps+=["C5"]`, `nextStep="D1"`
**Rollback:** `git revert --no-edit <lastCommit>`
**Commit:** `feat(gdpr): reell kontosletting og dataeksport [ACT4 C5]`

---

# BØLGE D — FRONTEND OG UX (9 steg)

> ToSom lover ro. **Ro i et grensesnitt er ikke pastellfarger — det er fravær av usikkerhet.** Brukeren skal aldri lure på om noe skjer, om noe gikk galt, eller om hun har gjort noe feil.

## STEG D1 — `loading.tsx` på hovedruter

**Formål:** Funn N-6. 50 sider, null rutenivå-lastetilstand. Hvert nettverkskall som henger, gir hvit skjerm.
**Avhengigheter:** C5
**Risiko:** Lav
**Filanker:** `app/dashboard/`, `app/chat/`, `app/onboarding/`, `app/matching/`, `app/profile/`, `app/settings/`

**Patch-skisse:** Skjelettene finnes allerede — `DashboardSkeleton.tsx`, `MatchBreakdownSkeleton.tsx`, `CardSkeleton`. De er bare ikke koblet til rutene.

```
app/dashboard/loading.tsx    → <DashboardSkeleton />
app/chat/loading.tsx         → skjelett for samtaleliste
app/onboarding/loading.tsx   → rolig laster
app/matching/loading.tsx     → rolig laster
app/profile/loading.tsx      → <CardSkeleton />
app/settings/loading.tsx     → <CardSkeleton />
```

Skjelettene skal bruke kanoniske tokens fra `config/design-tokens.ts` (se D3) og respektere `prefers-reduced-motion`.

- **Sjekk 1 (tsc):** `npx tsc --noEmit`
- **Sjekk 2 (grep):** `find app -name "loading.tsx" | wc -l` → **≥ 6**
- **Sjekk 3 (build):** `npm run build`
- **Sjekk 4 (FUNKSJONELT):** DevTools → Network → «Slow 3G». Naviger til `/dashboard` → **skjelett vises, ikke hvit skjerm.** Gjenta for `/chat`.
- **Sjekk 5 (KONSEPT):** Ventingen er designet, ikke tålt.

**State:** `currentWave="D"`, `currentStep="D1"`, `completedSteps+=["D1"]`, `nextStep="D2"`
**Rollback:** `find app -name "loading.tsx" -newer package.json -delete`
**Commit:** `feat(ux): legg til loading.tsx på hovedruter [ACT4 D1]`

---

## STEG D2 — `error.tsx`, `global-error.tsx` og bort med `alert()`

**Formål:** Funn N-6, andre halvdel. Hver ubehandlet feil river hele treet. `app/dashboard/page.tsx` bruker `alert()` — en nettleserdialog fra 1995 i et produkt som ellers er nennsomt designet.
**Avhengigheter:** D1
**Risiko:** Lav
**Filanker:** `app/dashboard/page.tsx`, `app/global-error.tsx` (ny)
**Søkeanker:** `grep -rn "alert(" app/ components/ --include=*.tsx`

**Patch-skisse:**

- `error.tsx` på samme ruter som D1, pluss `app/global-error.tsx`.
- Feilkomponentene tar `{ error, reset }` og viser ToSoms stemme — **ikke** «Error 500»:
  > «Noe gikk galt hos oss. Vi ser på det. Prøv igjen om litt.»
  med en knapp som faktisk kaller `reset()`.
- Hver `error.tsx` kaller `Sentry.captureException(error)` i en `useEffect`.
- Erstatt alle `alert()` med en inline-melding eller toast.

- **Sjekk 1 (tsc):** `npx tsc --noEmit`
- **Sjekk 2 (grep):**
  ```bash
  find app -name "error.tsx" | wc -l                                # → ≥ 6
  grep -rn "alert(" app/ components/ --include=*.tsx | wc -l        # → 0
  ```
- **Sjekk 3 (build):** `npm run build`
- **Sjekk 4 (FUNKSJONELT):** Framtving en feil i en side-komponent → feilgrensen vises med ToSom-tekst, «Prøv igjen» virker, og **feilen dukker opp i Sentry**.
- **Sjekk 5 (KONSEPT):** Ingen tom skjerm uten forklaring. Ingen systemdialog som bryter illusjonen.

**State:** `currentWave="D"`, `currentStep="D2"`, `completedSteps+=["D2"]`, `nextStep="D3"`
**Rollback:** `git revert --no-edit <lastCommit>`
**Commit:** `feat(ux): feilgrenser på hovedruter, fjern alert() [ACT4 D2]`

---

## STEG D3 — Token-konsolidering

**Formål:** Tre parallelle sannheter om ToSoms farger gir fargedrift. Gull A ≠ gull B.
**Avhengigheter:** D2
**Risiko:** Middels
**Filanker:** `config/design-tokens.ts` (409 l.), `components/ui/tokens.ts` (584 l.), `app/chat/page.tsx` (lokal `const G = {}`)
**Søkeanker:** `grep -rn "^const G = {\|const tokens = {" app/ components/ --include=*.tsx`

**Patch-skisse:**

- `config/design-tokens.ts` blir **kanonisk**.
- `components/ui/tokens.ts` blir en tynn shim som re-eksporterer fra den kanoniske kilden. Verdiene skal være identiske — **avvik dokumenteres i `deviations` før de rettes.**
- Lokale objekter (som `const G` i `app/chat/page.tsx`) erstattes med import.
- CI-guard `no-local-tokens` som avviser nye lokale tokenobjekter.
- Full migrering av alle importører er **post-launch**. Dette steget stanser blødningen; det gjør ikke hele operasjonen.

- **Sjekk 1 (tsc):** `npx tsc --noEmit`
- **Sjekk 2 (grep):** `grep -rn "^const G = {" app/ components/ --include=*.tsx | wc -l` → `0`
- **Sjekk 3 (build):** `npm run build`
- **Sjekk 4 (FUNKSJONELT):** Sammenlign gullfargen på `/` og `/chat` i nettleseren — **samme HEX-verdi** i DevTools. Noter verdien i `deviations`.
- **Sjekk 5 (KONSEPT):** Visuell konsistens er en del av opplevelseskvaliteten som rettferdiggjør 349 kr.

**State:** `currentWave="D"`, `currentStep="D3"`, `completedSteps+=["D3"]`, `nextStep="D4"`
**Rollback:** `git revert --no-edit <lastCommit>`
**Commit:** `refactor(design): konsolider design-tokens til én kilde [ACT4 D3]`

---

## STEG D4 — Onboarding-draft-integrasjon

**Formål:** `/api/onboarding/draft` finnes (GET + POST). `hooks/useAutoSave.ts` finnes. `OnboardingFlow.tsx` **kaller ingen av dem.** 13 steg, ~75 felt, ~15 minutter kun i localStorage er det dyreste frafallspunktet i traktet.
**Avhengigheter:** D3
**Risiko:** Middels
**Filanker:** `app/onboarding/OnboardingFlow.tsx` (485 l.), `app/api/onboarding/draft/route.ts`

> ⚠️ **ACT v3 STEG 5.3 mislyktes her.** Deviation: *«sed korrupterer 485-linjers React-komponent gjentatt»*. **Bruk ikke `sed` på denne filen.** Les hele filen, gjør målrettede redigeringer, verifiser med `npx tsc --noEmit` etter hver.

**Patch-skisse:**

- Ved stegbytte (`goToStep`, eller hvor navigasjonen håndteres): `POST /api/onboarding/draft` med gjeldende svar og stegnummer. Debounce, og **ikke-blokkerende** — feiler lagringen, skal brukeren likevel komme videre. Logg til Sentry.
- Ved oppstart: `GET /api/onboarding/draft`. Finnes utkast → gjenopprett svar og posisjon. localStorage beholdes som hurtigbuffer, men serveren er sannheten.
- Rett samtidig nynorsken (regel 19): linje ~399 «Bruker» → «Bruker», linje ~424 «Vær vennlig å prøv igjen» → «Vennligst prøv igjen».

- **Sjekk 1 (tsc):** `npx tsc --noEmit`
- **Sjekk 2 (grep):**
  ```bash
  grep -c "onboarding/draft" app/onboarding/OnboardingFlow.tsx   # → ≥ 2 (GET + POST)
  grep -rn "bruker\|vær vennlig" app/onboarding/                  # → 0
  ```
- **Sjekk 3 (build):** `npm run build`
- **Sjekk 4 (FUNKSJONELT):** Fyll ut steg 1–5. Tøm localStorage. Last siden på nytt →
  **svarene og posisjonen er gjenopprettet fra serveren.** Verifiser også i DB at utkastraden finnes.
- **Sjekk 5 (KONSEPT):** Brukeren mister aldri 15 minutters arbeid. Ro betyr også at systemet husker.

**State:** `currentWave="D"`, `currentStep="D4"`, `completedSteps+=["D4"]`, `nextStep="D5"`
**Rollback:** `git checkout -- app/onboarding/OnboardingFlow.tsx`
**Commit:** `feat(onboarding): koble serverside autosave til OnboardingFlow [ACT4 D4]`

---

## STEG D5 — Kopi rettet til koblingsmodellen

**Formål:** Invariant I-9. Ventetilstanden lover i dag «beregnet i morgen kl. 05:00» — en driftsdetalj, og feil for de fleste brukere.
**Avhengigheter:** D4
**Risiko:** Lav
**Filanker:** `components/dashboard/WaitingForMatch.tsx:128-129`

**Patch-skisse — kanonisk kopi:**

| Tilstand | Tekst |
|---|---|
| I kø | «Du får din match i løpet av 24 timer.» |
| I kø, under kohortterskel | «Vi venter til vi har nok mennesker til å finne en god match til deg.» |
| Matchet, ikke startet | «Reisen deres begynner når dere begge har vært innom.» |
| Før avslutning | «Dette sletter samtalen for dere begge. Det kan ikke angres.» |

Behold den eksisterende, gode linjen: *«Vi tar tiden det krever for å finne en god match.»* (`WaitingForMatch.tsx:139`)

**Rør ikke** de offentlige sidene. Verifisert: ingen av dem beskriver et samtykkesteg, og prislinjen `app/priser/page.tsx:272` («motoren kjører én gang i døgnet … kun én match om gangen») er allerede korrekt. **Vi retter koden etter kopien, ikke omvendt.**

- **Sjekk 1 (tsc):** `npx tsc --noEmit`
- **Sjekk 2 (grep):** `grep -rn "05:00" components/ app/ --include=*.tsx | grep -v admin | wc -l` → `0`
- **Sjekk 3 (build):** `npm run build`
- **Sjekk 4 (FUNKSJONELT):** Bruker i kø ser 24-timers-teksten. Sett kø under 20 → tynn-kø-teksten vises. Bruker matchet uten `bothSeenAt` → oppstartsteksten vises.
- **Sjekk 5 (KONSEPT):** Invariant I-9. Ingen driftsdetalj lekker til brukeren.

**State:** `currentWave="D"`, `currentStep="D5"`, `completedSteps+=["D5"]`, `nextStep="D6"`
**Rollback:** `git checkout -- components/dashboard/WaitingForMatch.tsx`
**Commit:** `fix(copy): ærlig ventetekst uten driftsdetaljer [ACT4 D5]`

---

## STEG D6 — Match-presentasjon

**Formål:** Hun logger inn. Noen venter på henne. Vi sender ingen varsling — **da må øyeblikket bære vekten av 24 timers venting.**
**Avhengigheter:** D5
**Risiko:** Lav
**Filanker:** `components/MatchCard.tsx`, `components/MatchBreakdown.tsx`, `components/DashboardMatchBanner.tsx`, `app/dashboard/page.tsx`

**Patch-skisse:**

- Ny match og ikke sett før → en **rolig, tydelig** tilstand på dashbordet. Ikke konfetti; ToSom er ikke et lotteri. Tenk «noen venter på deg», ikke «du vant».
- Fjern all rest av accept/decline-visning etter B7.
- `MatchBreakdown` viser hvorfor de passer — resonansdimensjonene finnes allerede i `explanation`/`scoringBreakdown`. Dette er øyeblikket der kunnskapsbasert matching skal føles kunnskapsbasert.
- Tydelig, enkelt neste steg: åpne samtalen.
- Har hun sett matchen, men ikke motparten → «Reisen begynner når dere begge har vært innom.» Ingen skyld, ingen mas.

- **Sjekk 1 (tsc):** `npx tsc --noEmit`
- **Sjekk 2 (grep):** `grep -rn "accept\|godta" components/MatchCard.tsx components/DashboardMatchBanner.tsx` → `0`
- **Sjekk 3 (build):** `npm run build`
- **Sjekk 4 (FUNKSJONELT):** Logg inn som nymatchet bruker → matchen presenteres med begrunnelse og én tydelig handling. Ingen ja/nei. Skjermbilde i `deviations`.
- **Sjekk 5 (KONSEPT):** Invariant I-2 og I-4. Matchen er et faktum som presenteres, ikke et forslag som vurderes.

**State:** `currentWave="D"`, `currentStep="D6"`, `completedSteps+=["D6"]`, `nextStep="D7"`
**Rollback:** `git revert --no-edit <lastCommit>`
**Commit:** `feat(ux): rolig match-presentasjon uten samtykkevalg [ACT4 D6]`

---

## STEG D7 — Journey-visualisering

**Formål:** Dagsovergangen skal føles som en side som blir vendt, ikke som en app-oppdatering.
**Avhengigheter:** D6
**Risiko:** Lav
**Filanker:** `components/journey/`, `app/dashboard/journey/page.tsx`

**Patch-skisse:**

- Synlig fremdrift dag N av 30, med fase (EARLY / TRUST / DEEPER / CHECKIN) og hva fasen betyr.
- Milepæler markert: dag 15 (bilder åpnes), dag 30 (avslutning).
- Dagens tema og refleksjonsprompt fremhevet.
- `app/dashboard/journey/page.tsx` er i dag 93 linjer og leser kun kontekst uten å hente data — utvid til en reell visning.
- Reise ikke startet → vis at den venter, ikke «dag 0».

- **Sjekk 1 (tsc):** `npx tsc --noEmit`
- **Sjekk 2 (grep):** `grep -rn "bothSeenAt\|phase" components/journey/ | head`
- **Sjekk 3 (build):** `npm run build`
- **Sjekk 4 (FUNKSJONELT):** Reise på dag 16 → viser «Dag 16 av 30», fase BUILDING_TRUST, og at bilder er åpnet. Reise med `bothSeenAt = null` → venter-tilstand, ikke «dag 0».
- **Sjekk 5 (KONSEPT):** Reisen er strukturen ToSom lover — den skal være synlig.

**State:** `currentWave="D"`, `currentStep="D7"`, `completedSteps+=["D7"]`, `nextStep="D8"`
**Rollback:** `git revert --no-edit <lastCommit>`
**Commit:** `feat(ux): journey-visualisering med fase og milepæler [ACT4 D7]`

---

## STEG D8 — Mobiloptimalisering

**Formål:** Mobil er hovedflaten for et produkt man sjekker om morgenen.
**Avhengigheter:** D7
**Risiko:** Middels
**Filanker:** `app/chat/`, `app/dashboard/`, `app/onboarding/`, `app/layout.tsx`

**Patch-skisse — sjekkliste, hver må verifiseres på ekte enhet:**

| Krav | Hvordan |
|---|---|
| Trykkflater ≥ 44×44 px | Alle knapper og lenker |
| Ingen horisontal scroll | Alle sider, 320 px bredde |
| Tastatur skjuler ikke input i chat | iOS Safari særlig |
| Trygge soner | `env(safe-area-inset-*)` for iPhone-hakk |
| `prefers-reduced-motion` | Alle Framer Motion-animasjoner |
| Synlig fokusmarkering | Tastaturnavigasjon |
| Kontrast ≥ 4,5:1 | Særlig gull på mørk bakgrunn |

`useMediaQuery`, `useMotionPreferences` og `useHaptics` finnes — grunnlaget er der.

- **Sjekk 1 (tsc):** `npx tsc --noEmit`
- **Sjekk 2 (grep):** `grep -rn "safe-area-inset" app/ styles/ | head` og `grep -rn "prefers-reduced-motion" hooks/ components/ | wc -l`
- **Sjekk 3 (build):** `npm run build`
- **Sjekk 4 (FUNKSJONELT):** Full flyt på **faktisk mobil** — iOS Safari og Android Chrome: registrer → onboarding → dashboard → chat. Ingen horisontal scroll, tastaturet skjuler ikke skrivefeltet, alle knapper treffbare med tommel. Noter enhet og OS-versjon i `deviations`.
- **Sjekk 5 (KONSEPT):** Opplevelseskvalitet på den flaten folk faktisk bruker.

**State:** `currentWave="D"`, `currentStep="D8"`, `completedSteps+=["D8"]`, `nextStep="D9"`
**Rollback:** `git revert --no-edit <lastCommit>`
**Commit:** `fix(mobile): trykkflater, trygge soner og tastaturhåndtering [ACT4 D8]`

---

## STEG D9 — Rydding av dødkode

**Formål:** Slett før du bygger. Hver slettet linje er en linje som ikke kan feile.
**Avhengigheter:** D8
**Risiko:** Lav
**Filanker:** `components/sections/`, `app/slik/`, `package.json`

**Patch-skisse:**

| Slett | Begrunnelse |
|---|---|
| `components/sections/*` | Importeres ikke fra `app/`. Inneholder **markedsføringskopi som motsier de levende sidene** — to sett løfter i repoet |
| `app/slik/` | Duplikat av `app/slik-fungerer-det/`. Legg til redirect i `next.config.js` for SEO |
| `@supabase/supabase-js` | 0 bruk i koden. Pusher vant realtime-valget |

Verifiser før sletting:

```bash
grep -rn "components/sections" app/ components/ --include=*.tsx | wc -l   # → 0
grep -rln "supabase" app/ lib/ hooks/ components/ | wc -l                 # → 0
```

- **Sjekk 1 (tsc):** `npx tsc --noEmit`
- **Sjekk 2 (grep):** `test ! -d components/sections && echo SLETTET` og `grep -c supabase package.json` → `0`
- **Sjekk 3 (build):** `npm run build`
- **Sjekk 4 (FUNKSJONELT):** `/` → `200` og uendret utseende. `/slik` → `301`/`308` til `/slik-fungerer-det`. `npm ci` uten Supabase i låsefilen.
- **Sjekk 5 (KONSEPT):** Ett sett løfter i repoet, og det er det som står på de levende sidene.

**State:** `currentWave="D"`, `currentStep="D9"`, `completedSteps+=["D9"]`, `nextStep="E1"`, `scores.frontend=85`
**Rollback:** `git revert --no-edit <lastCommit>`
**Commit:** `chore(cleanup): fjern dødkode, duplikatrute og ubrukt Supabase [ACT4 D9]`

---

# BØLGE E — KVALITET OG TESTING (6 steg)

> **`npx jest` → 4 suiter, 77 tester, 0 feil.** Det ser utmerket ut. Det er ikke helt sant:
>
> | Suite | Reell verdi |
> |---|---|
> | `journey-engine.test.ts` | ✅ Tester faktisk `lib/journey/engine.ts` |
> | `chat-send.test.ts` | ✅ Delvis reell |
> | `admin-authorization.test.ts` | ❌ Tester `simulateRequireAuth()` — en **lokal stub** |
> | `cron-auth.test.ts` | ❌ Strengmanipulasjon + `fs.readFileSync`-grep |
>
> Av 77 tester er anslagsvis 30 reelle. **En test som ikke kan feile når produktet er ødelagt, er ikke en test.**

## STEG E1 — Erstatt stubbtester med reelle

**Formål:** Regel 18. Fjern testene som tester seg selv.
**Avhengigheter:** D9
**Risiko:** Lav
**Filanker:** `__tests__/admin-authorization.test.ts:~20` (`simulateRequireAuth`), `__tests__/cron-auth.test.ts`
**Søkeanker:** `grep -n "simulate\|readFileSync" __tests__/*.ts`

**Patch-skisse:**

- Slett `simulateRequireAuth()` og alle tester mot den. Erstatt med tester som importerer **reell** `requireAuth` fra `lib/auth/requireAuth.ts` og kaller den med mocket request.
- Slett `fs.readFileSync`-grep-testene i `cron-auth.test.ts`. Erstatt med integrasjonstester som treffer den faktiske ruten (E3).
- Det er **helt greit at testtallet går ned.** 30 ærlige tester er verdt mer enn 77 der halvparten lyver. Noter før/etter-tallet i `deviations`.

- **Sjekk 1 (tsc):** `npx tsc --noEmit`
- **Sjekk 2 (grep):** `grep -rn "simulate\|readFileSync" __tests__/ | wc -l` → `0`
- **Sjekk 3 (build):** `npm run build`
- **Sjekk 4 (FUNKSJONELT):** `npx jest` grønn. **Muteringstest:** bryt `requireAuth` bevisst (returner alltid `null`) → **testene skal feile.** Gjenopprett. Dette er beviset på at testene er reelle.
- **Sjekk 5 (KONSEPT):** Ikke relevant.

**State:** `currentWave="E"`, `currentStep="E1"`, `completedSteps+=["E1"]`, `nextStep="E2"`
**Rollback:** `git checkout -- __tests__/`
**Commit:** `test: erstatt stubbtester med tester mot reell kode [ACT4 E1]`

---

## STEG E2 — Enhetstester for kjernelogikken

**Formål:** `unifiedScorer.ts` (336 l.) og `dealbreaker.ts` (163 l.) er kjernen i produktet og har **null dekning**.
**Avhengigheter:** E1
**Risiko:** Lav
**Filanker:** `__tests__/unified-scorer.test.ts`, `__tests__/dealbreaker.test.ts`, `__tests__/pairing.test.ts`, `__tests__/journey-state.test.ts` (alle nye)

**Patch-skisse — minimum:**

| Mål | Tilfeller |
|---|---|
| `unifiedScorer` | Alle 9 dimensjoner. Vektsum = 1,0. Identiske profiler → høy score. Motsatte → lav. Manglende felt krasjer ikke |
| `dealbreaker` | Hver regel utløser. Ingen falske positive. Tomme profiler |
| Kobling (B6) | Oddetall etterlater én. Tomt sett. Alle blokkert av dealbreaker → 0 par. Sperreliste respekteres. Grådig velger høyeste score først |
| Kohortterskel | 19 i kø → utsatt. 20 → kjører. 19 der én ventet 73 t → kjører |
| `journeyState` | Alle lovlige overganger. Ulovlige avvises: `MATCHED → QUEUED`, `IDLE → MATCHED` |

- **Sjekk 1 (tsc):** `npx tsc --noEmit`
- **Sjekk 2 (grep):** `ls __tests__/*.test.ts | wc -l` → **≥ 7**
- **Sjekk 3 (build):** `npm run build`
- **Sjekk 4 (FUNKSJONELT):** `npx jest --coverage --collectCoverageFrom='lib/matching/**'` → **≥ 70 % linjedekning** på `lib/matching/`. Noter tallet.
- **Sjekk 5 (KONSEPT):** Testene håndhever invariantene I-2 og I-7.

**State:** `currentWave="E"`, `currentStep="E2"`, `completedSteps+=["E2"]`, `nextStep="E3"`
**Rollback:** `rm __tests__/unified-scorer.test.ts __tests__/dealbreaker.test.ts __tests__/pairing.test.ts __tests__/journey-state.test.ts`
**Commit:** `test(matching): enhetstester for scorer, dealbreakere og kobling [ACT4 E2]`

---

## STEG E3 — Integrasjonstester mot Postgres

**Formål:** CI har allerede `postgres:16` som service på `test` og `e2e` (fra ACT v3 STEG 3.1). Den er underutnyttet.
**Avhengigheter:** E2
**Risiko:** Middels
**Filanker:** `__tests__/integration/` (ny mappe), `jest.config.js`

**Patch-skisse — den viktigste testen først:**

| Test | Ferdigkriterium |
|---|---|
| **`endJourney()`** | **0 rader igjen** i alle berørte tabeller. `MatchHistory` skrevet. Begge `IDLE`. `AuditLog` skrevet |
| Matcherunde | N i kø → N/2 par, oddetall står igjen, alle `MATCHED`, `Notification` × N |
| Sperreliste | To tidligere koblede kobles aldri igjen |
| Én reise om gangen | `MATCHED`-bruker kan ikke settes i kø → `409` |
| Dag 1-start | Cron hopper over `bothSeenAt = null` |
| Cron-auth | Mot **faktisk rute**: uten header → 401, feil secret → 403, riktig → 200 |
| Middleware | Forfalsket cookie → 401. Forfalsket admin-rolle → redirect |

`endJourney()`-testen verifiserer produktets kjerneløfte — at data faktisk forsvinner. Den er den viktigste enkelttesten i hele pakken.

Bruk separat testdatabase, `beforeEach` med opprydding. Ikke gjenbruk utviklingsdatabasen.

- **Sjekk 1 (tsc):** `npx tsc --noEmit`
- **Sjekk 2 (grep):** `ls __tests__/integration/*.test.ts | wc -l` → **≥ 5**
- **Sjekk 3 (build):** `npm run build`
- **Sjekk 4 (FUNKSJONELT):** `npx jest __tests__/integration` mot ekte Postgres → alle grønne. Muteringstest: fjern ett `deleteMany` fra `endJourney()` → **testen skal feile.** Gjenopprett.
- **Sjekk 5 (KONSEPT):** Alle ti invarianter er nå dekket av minst én automatisk test.

**State:** `currentWave="E"`, `currentStep="E3"`, `completedSteps+=["E3"]`, `nextStep="E4"`
**Rollback:** `rm -rf __tests__/integration`
**Commit:** `test(integration): DB-tester for kobling, sletting og sperreliste [ACT4 E3]`

---

## STEG E4 — Full E2E-verdikjede

**Formål:** Den ene testen som beviser at ToSom virker.
**Avhengigheter:** E3
**Risiko:** Middels
**Filanker:** `e2e/tests/full-journey.spec.ts` (ny), `e2e/fixtures/`

**Patch-skisse:**

```
registrer → [betaling: gratiskvote] → onboarding (13 steg)
  → start reisen → verifiser QUEUED
  → utløs matcherunde (testendepunkt bak Bearer-auth)
  → logg inn som bruker A → oppdag match → bothSeenAt ikke satt
  → logg inn som bruker B → bothSeenAt satt, dag 1
  → send melding begge veier
  → hopp fram til dag 30 (testhjelper som setter day)
  → avslutt → verifiser at ALT er slettet
  → sett i kø igjen → verifiser QUEUED
```

Eksisterende specer (`onboarding.spec.ts`, `match.spec.ts`, `chat.spec.ts`, `matching-journey.spec.ts`) beholdes og oppdateres til koblingsmodellen — **fjern alle accept-steg.**

Testhjelperne (utløs runde, hopp dager) skal være bak `Bearer $CRON_SECRET` og **kun aktive når `NODE_ENV !== 'production'`**. Verifiser dette eksplisitt.

- **Sjekk 1 (tsc):** `npx tsc --noEmit`
- **Sjekk 2 (grep):** `grep -rn "accept" e2e/tests/ | wc -l` → `0`
- **Sjekk 3 (build):** `npm run build`
- **Sjekk 4 (FUNKSJONELT):** `npx playwright test` → alle grønne, inkludert `full-journey.spec.ts`. Siste assertion verifiserer i databasen at 0 meldinger og 0 samtaler gjenstår.
- **Sjekk 5 (KONSEPT):** E2E følger nøyaktig loopen i kapittel 3.2. Avviker den, er enten testen eller koden feil.

**State:** `currentWave="E"`, `currentStep="E4"`, `completedSteps+=["E4"]`, `nextStep="E5"`
**Rollback:** `rm e2e/tests/full-journey.spec.ts`
**Commit:** `test(e2e): full verdikjede fra registrering til sletting [ACT4 E4]`

---

## STEG E5 — Visuell regresjon

**Formål:** Etter token-konsolidering (D3) trengs et vern mot fargedrift og layoutbrudd.
**Avhengigheter:** E4
**Risiko:** Lav
**Filanker:** `e2e/visual/` (ny), `playwright.config.ts`

**Patch-skisse:**

- Playwright har innebygd `toHaveScreenshot()` — **ingen ny avhengighet** (regel 17).
- Referansebilder for: landing, dashboard i kø, dashboard matchet, chat, onboarding steg 1, journey-visning, feiltilstand.
- To viewports: 390×844 (mobil) og 1440×900 (desktop).
- Maskér dynamisk innhold (navn, tidsstempler, avatarer) med `mask:`.
- Terskel: `maxDiffPixelRatio: 0.01`.
- Egen CI-jobb `visual`, kjør på pull request. Referansebildene må genereres i **samme miljø som CI** (Linux) — ellers gir fontrendering falske avvik. Noter dette i `deviations`.

- **Sjekk 1 (tsc):** `npx tsc --noEmit`
- **Sjekk 2 (grep):** `ls e2e/visual/*.spec.ts | wc -l` → **≥ 1**
- **Sjekk 3 (build):** `npm run build`
- **Sjekk 4 (FUNKSJONELT):** `npx playwright test e2e/visual` → grønn. Endre en farge i `config/design-tokens.ts` → **testen skal feile.** Tilbakestill.
- **Sjekk 5 (KONSEPT):** Visuell konsistens er en del av opplevelseskvaliteten.

**State:** `currentWave="E"`, `currentStep="E5"`, `completedSteps+=["E5"]`, `nextStep="E6"`
**Rollback:** `rm -rf e2e/visual`
**Commit:** `test(visual): visuell regresjonstesting for hovedflater [ACT4 E5]`

---

## STEG E6 — Verifisert backup og gjenoppretting

**Formål:** `deploy/backup.md` beskriver backup. **Ingen har testet gjenoppretting.** En backup som ikke er gjenopprettet, er en antakelse.
**Avhengigheter:** E5
**Risiko:** Høy (hvis den utelates)
**Filanker:** `scripts/db/`, `deploy/backup.md`

**Patch-skisse:**

- Automatisk daglig backup (Vercel Postgres / Neon / Supabase har innebygd — bekreft hvilken og at den er **på**).
- Skript for manuell backup før brytende migreringer.
- **Gjennomfør en faktisk gjenopprettingstest:** ta en backup, gjenopprett til en ny database, verifiser radantall i `User`, `Match`, `Message`, `JourneyProgress`.
- Dokumenter gjenopprettingsprosedyren steg for steg i `deploy/backup.md`, med målt tidsbruk (RTO).

- **Sjekk 1 (tsc):** Hopp over.
- **Sjekk 2 (grep):** `grep -c "gjenoppretting\|restore" deploy/backup.md` → **≥ 1**
- **Sjekk 3 (build):** Hopp over.
- **Sjekk 4 (FUNKSJONELT):** Gjenoppretting **faktisk gjennomført** til en test-database. Radantall for de fire tabellene sammenlignet før/etter og notert i `deviations`, sammen med tidsbruk.
- **Sjekk 5 (KONSEPT):** Ikke relevant.

**State:** `currentWave="E"`, `currentStep="E6"`, `completedSteps+=["E6"]`, `nextStep="F1"`, `scores.drift=70`
**Rollback:** Ikke relevant.
**Commit:** `docs(ops): verifisert backup- og gjenopprettingsprosedyre [ACT4 E6]`

---

# BØLGE F — SKALERING OG LANSERINGSKLARGJØRING (5 steg)

## STEG F1 — Vercel-opprydding

**Formål:** Funn N-7. To motstridende sannheter om hvordan ToSom kommer i produksjon er en driftsrisiko i seg selv.
**Avhengigheter:** E6
**Risiko:** Lav
**Filanker:** `next.config.js:10-11`, `deploy/`, `LAUNCH-CHECKLIST.md`

**Patch-skisse:**

| Tiltak | Handling |
|---|---|
| `output: 'standalone'` | Fjern fra `next.config.js` — Vercel trenger den ikke |
| `deploy/docker-compose.prod.yml`, `deploy/systemd.service`, `deploy/docker/` | Flytt til `deploy/archive/` med README som forklarer at Vercel er fasit |
| `LAUNCH-CHECKLIST.md` | Skriv om for Vercel. Dagens versjon beskriver Docker + SSH til `registry.tosom.no` |
| `docker-compose.yml`, `docker-compose.test.yml` | **Behold** — brukes til lokal utvikling og CI |

- **Sjekk 1 (tsc):** `npx tsc --noEmit`
- **Sjekk 2 (grep):** `grep -c "standalone" next.config.js` → `0`
- **Sjekk 3 (build):** `npm run build` — verifiser at bygget fortsatt lykkes uten standalone.
- **Sjekk 4 (FUNKSJONELT):** Deploy til preview → `200` på `/`. `LAUNCH-CHECKLIST.md` beskriver Vercel-prosedyren og kan følges av et menneske uten forkunnskap.
- **Sjekk 5 (KONSEPT):** Ikke relevant.

**State:** `currentWave="F"`, `currentStep="F1"`, `completedSteps+=["F1"]`, `nextStep="F2"`
**Rollback:** `git checkout -- next.config.js && git mv deploy/archive/* deploy/`
**Commit:** `chore(deploy): Vercel som eneste deploy-vei, arkiver Docker [ACT4 F1]`

---

## STEG F2 — Caching

**Formål:** Journey-dagsinnhold er 30 datasett, identiske for alle brukere, som nesten aldri endres — og hentes fra databasen ved hver forespørsel.
**Avhengigheter:** F1
**Risiko:** Lav
**Filanker:** `lib/cache/` (ny), `lib/journey/engine.ts`, `app/api/journey/today/route.ts`

**Patch-skisse:** Upstash Redis finnes allerede (rate limiting). Ingen ny avhengighet.

| Nøkkel | Innhold | TTL |
|---|---|---|
| `journey:day:<N>` | Dagsinnhold | 24 t |
| `match:active:<userId>` | Aktiv match | 5 min |
| `quota:free:count` | Gratisteller (bølge G) | 60 s |
| `profile:<userId>` | Profil i matching | 1 t |

Cache-aside: les fra cache, ved bom les fra DB og skriv til cache. **Cache nede → gå til DB, aldri feil mot bruker** (graceful degradation).

Invalidering: dagsinnhold ved admin-endring, aktiv match ved `endJourney()`.

- **Sjekk 1 (tsc):** `npx tsc --noEmit`
- **Sjekk 2 (grep):** `grep -rn "journey:day" lib/ app/ | head`
- **Sjekk 3 (build):** `npm run build`
- **Sjekk 4 (FUNKSJONELT):** Kall `/api/journey/today` to ganger. Andre kall skal ikke treffe DB (verifiser med Prisma query-logg). Mål p95 → **< 100 ms**. Slå av Redis → ruten svarer fortsatt `200`.
- **Sjekk 5 (KONSEPT):** Ikke relevant.

**State:** `currentWave="F"`, `currentStep="F2"`, `completedSteps+=["F2"]`, `nextStep="F3"`
**Rollback:** `git revert --no-edit <lastCommit>`
**Commit:** `perf(cache): Redis-cache for dagsinnhold og aktiv match [ACT4 F2]`

---

## STEG F3 — Connection pooling og rate-limit-tuning

**Formål:** Connection-utmattelse er en reell risiko på serverless uten pooling. Rate-limitene er ikke justert mot faktisk bruk.
**Avhengigheter:** F2
**Risiko:** Middels
**Filanker:** `lib/prisma.ts`, `lib/security/` (rate limiting)

**Patch-skisse:**

- **Pooling:** bruk PgBouncer eller Prisma Accelerate. Sett `?pgbouncer=true&connection_limit=1` i `DATABASE_URL` for serverless-funksjoner. `DIRECT_URL` beholdes for migreringer.
- **Rate-limit-tuning** — nåværende verdier er gjetninger. Sett per rutetype:

  | Rutetype | Grense |
  |---|---|
  | Innlogging, telefonkode | 5 / 15 min per IP |
  | `POST /api/report` | 3 / time per bruker |
  | `POST /api/journey/queue` | 10 / time per bruker |
  | Meldinger | 60 / min per bruker |
  | Lesing | 300 / min per bruker |
  | Cron | Ingen (Bearer-beskyttet) |

- Ved 300k brukere: verifiser at Upstash-planen tåler forespørselsvolumet.

- **Sjekk 1 (tsc):** `npx tsc --noEmit`
- **Sjekk 2 (grep):** `grep -n "connection_limit\|pgbouncer" .env.example` og `grep -rn "Ratelimit" lib/ | head`
- **Sjekk 3 (build):** `npm run build`
- **Sjekk 4 (FUNKSJONELT):** 100 samtidige forespørsler mot `/api/dashboard/overview` → **ingen `too many connections`**. Overskrid grensen på en beskyttet rute → `429` med `Retry-After`.
- **Sjekk 5 (KONSEPT):** Ikke relevant.

**State:** `currentWave="F"`, `currentStep="F3"`, `completedSteps+=["F3"]`, `nextStep="F4"`
**Rollback:** `git revert --no-edit <lastCommit>`
**Commit:** `perf(db): connection pooling og justerte rate-limits [ACT4 F3]`

---

## STEG F4 — Forretningsmetrikker og lasttest

**Formål:** Måle om produktet virker — særlig hypotesen bak invariant I-4.
**Avhengigheter:** F3
**Risiko:** Middels
**Filanker:** `app/admin/dashboard/page.tsx`, `scripts/load/` (finnes)

**Patch-skisse — metrikker i admin-dashbordet:**

| Metrikk | Hvorfor |
|---|---|
| Kø-størrelse per døgn | Utløser kohortterskelen |
| Koblinger per runde | Kjernefunksjonens puls |
| Runde-varighet | Tidlig varsel om skaleringsfase 2 |
| Utsatte runder | For tynn kø? |
| Onboarding-fullføring per steg | Hvor faller de fra? |
| **Andel som oppdager matchen innen 24 t / 48 t** | **Validerer invariant I-4** |
| Tid fra kobling til dag 1 | Måler «begge har vært innom» |
| Dag-N-retensjon (1/7/15/30) | Fullfører de reisen? |
| Fullførte reiser per utgang | Fant de hverandre? |
| Rapporter per 1000 reiser | Trygghetsindikator |

> **Den mest kritiske er «andel som oppdager matchen».** Beslutningen om ikke å varsle er modig og riktig for produktet — men den er en **hypotese**. Faller den under **70 % innen 48 timer**, må den revurderes. Da er én rolig e-post — *«Noen venter på deg»* — ikke et brudd med filosofien, men en tilpasning til virkeligheten. Dette er beredskapen for funn N-5.

**Lasttest** (`scripts/load/` finnes):

| Scenario | Mål |
|---|---|
| Runde, 1000 i kø | < 30 s, ingen timeout |
| Runde, 10 000 i kø | < 5 min, eller utløser fase 2 |
| 500 samtidige chat-brukere | p95 < 200 ms |
| 100 samtidige onboardinger | Ingen connection-utmattelse |

- **Sjekk 1 (tsc):** `npx tsc --noEmit`
- **Sjekk 2 (grep):** `grep -rn "discoveryRate\|oppdaget" app/api/admin/ lib/analytics/ | head`
- **Sjekk 3 (build):** `npm run build`
- **Sjekk 4 (FUNKSJONELT):** Admin-dashbordet viser alle ti metrikker med ekte data. Lasttest med 1000 i kø kjørt → varighet notert i `deviations`.
- **Sjekk 5 (KONSEPT):** Invariant I-4 er nå målbar, ikke bare antatt.

**State:** `currentWave="F"`, `currentStep="F4"`, `completedSteps+=["F4"]`, `nextStep="F5"`
**Rollback:** `git revert --no-edit <lastCommit>`
**Commit:** `feat(analytics): forretningsmetrikker og lasttest [ACT4 F4]`

---

## STEG F5 — Kill switches og sikkerhetsheadere

**Formål:** Oppdager du en feil i koblingslogikken kl. 05:30, vil du stoppe **runden** — ikke produktet.
**Avhengigheter:** F4
**Risiko:** Lav
**Filanker:** `config/features.ts`, `next.config.js` (headers), `middleware.ts`

**Patch-skisse:**

| Bryter | Effekt |
|---|---|
| `MATCHING_ENABLED` | Runden hopper over. Køen består |
| `REGISTRATION_ENABLED` | Ingen nye brukere |
| `PAYMENTS_ENABLED` | Gratismodus (bølge G) |
| `MAINTENANCE_MODE` | `app/maintenance/` finnes allerede |

Bryterne leses fra miljøvariabler og krever **ingen deploy** for å endres — kun en env-oppdatering i Vercel.

**Sikkerhetsheadere** i `next.config.js`:

```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

CSP finnes delvis — verifiser at den ikke er for løs.

- **Sjekk 1 (tsc):** `npx tsc --noEmit`
- **Sjekk 2 (grep):** `grep -n "MATCHING_ENABLED" config/features.ts app/api/cron/matching/route.ts`
- **Sjekk 3 (build):** `npm run build`
- **Sjekk 4 (FUNKSJONELT):** Sett `MATCHING_ENABLED=false`, kjør cron → `200` med `{ skipped: true }`, **0 nye matcher**, køen uendret. `curl -I https://<preview>` viser alle fem headere.
- **Sjekk 5 (KONSEPT):** Å stanse matching stopper ikke produktet — brukere i kø blir stående, akkurat som ved en utsatt runde.

**State:** `currentWave="F"`, `currentStep="F5"`, `completedSteps+=["F5"]`, `nextStep="G1"`, `scores.drift=85`, `scores.lansering=90`
**Rollback:** `git revert --no-edit <lastCommit>`
**Commit:** `feat(ops): kill switches og fullt sett sikkerhetsheadere [ACT4 F5]`

---

# BØLGE G — PREMIUM v3.1: BETALING (4 steg)

> **Det finnes ingen premium.** Én pris, alle funksjoner, ingen nivåer, ingen gating, ingen «oppgrader»-flater (invariant I-10).
>
> `app/priser/page.tsx:143`: *«Én enkel pris. Ingen abonnement. Ingen skjulte kostnader.»* · `:365`: **349 kr**
>
> Vipps ePayment kommer om ~2 uker. **Alt rundt bygges nå**, slik at integrasjonen blir én adapter — ikke en ombygging.

## STEG G1 — `Order`-modell og betalingsgrensesnitt

**Formål:** Plug-and-play-forberedelse. Når Vipps-kodene kommer, skal kun adapteren skrives.
**Avhengigheter:** F5
**Risiko:** Lav
**Filanker:** `prisma/schema.prisma`, `lib/payment/provider.ts` (ny)

**Patch-skisse:**

```prisma
model Order {
  id             String      @id @default(cuid())
  userId         String
  amount         Int         @default(34900)   // øre
  currency       String      @default("NOK")
  status         OrderStatus @default(PENDING)
  provider       String      @default("vipps")
  providerRef    String?     @unique
  freeQuota      Boolean     @default(false)
  withdrawalWaiver Boolean   @default(false)   // angrerett, C4
  waiverAt       DateTime?
  createdAt      DateTime    @default(now())
  completedAt    DateTime?

  @@index([userId, status])
  @@index([status, createdAt])
}

enum OrderStatus { PENDING  PAID  FAILED  REFUNDED }

model WebhookEvent {
  id         String   @id            // provider-ID → idempotens
  provider   String
  payload    Json
  receivedAt DateTime @default(now())
}
```

```ts
// lib/payment/provider.ts
export interface PaymentProvider {
  createOrder(userId: string, amount: number): Promise<{ redirectUrl: string; ref: string }>
  verifyWebhook(rawBody: string, headers: Headers): Promise<WebhookResult>
  getStatus(ref: string): Promise<OrderStatus>
}
```

`WebhookEvent` med provider-ID som primærnøkkel gir idempotens — **Vipps sender samme hendelse flere ganger.** Dette var STEG 10.2 FAILED i ACT v1; kravet gjenoppstår nå.

- **Sjekk 1 (tsc):** `npx tsc --noEmit`
- **Sjekk 2 (grep):** `grep -n "model Order\|model WebhookEvent" prisma/schema.prisma && npx prisma validate`
- **Sjekk 3 (build):** `npm run build`
- **Sjekk 4 (FUNKSJONELT):** Opprett en `Order` manuelt → rad finnes. Sett inn `WebhookEvent` med samme ID to ganger → **andre feiler på primærnøkkel** (idempotens bevist).
- **Sjekk 5 (KONSEPT):** Ingen felt antyder nivåer eller funksjonsgating. Én pris, én reise.

**State:** `currentWave="G"`, `currentStep="G1"`, `completedSteps+=["G1"]`, `nextStep="G2"`
**Rollback:** Reverserende migrering.
**Commit:** `feat(payment): Order-modell og PaymentProvider-grensesnitt [ACT4 G1]`

---

## STEG G2 — Gratiskvote for de første 10 000

**Formål:** Lansering er gratis til 10 000 brukere. Deretter betaling før onboarding.
**Avhengigheter:** G1
**Risiko:** Lav
**Filanker:** `lib/payment/freeQuota.ts` (ny), `app/api/journey/queue/route.ts`

**Patch-skisse:**

```ts
const FREE_QUOTA_LIMIT = 10_000

// «Start reisen» spør:
const used = await countFreeQuotaOrders()   // cachet 60 s (F2)
if (used < FREE_QUOTA_LIMIT) {
  // Order(freeQuota: true, status: PAID, amount: 0)
} else {
  // send til betaling
}
```

- `FreeQuotaProvider` implementerer `PaymentProvider` og markerer ordren betalt umiddelbart.
- Telleren caches i Redis (60 s). Ved terskelen kan en håndfull ekstra slippe gjennom — **det er akseptabelt** og bedre enn en teller som spørres ukachet ved hver reisestart. Dokumenter valget.
- Kvoten er **per bruker, ikke per reise**: har hun brukt gratiskvoten sin, betaler hun for reise nr. 2. Verifiser mot brukers intensjon før implementering.
- Admin-visning av forbrukt kvote.

- **Sjekk 1 (tsc):** `npx tsc --noEmit`
- **Sjekk 2 (grep):** `grep -n "FREE_QUOTA_LIMIT" lib/payment/freeQuota.ts`
- **Sjekk 3 (build):** `npm run build`
- **Sjekk 4 (FUNKSJONELT):** Ny bruker → `Order` med `freeQuota: true, status: PAID`, kø lykkes. Sett telleren kunstig til 10 000 → neste bruker sendes til betaling og havner **ikke** i kø.
- **Sjekk 5 (KONSEPT):** Ingen forskjell i funksjonalitet mellom gratis og betalt. Kun tilgang.

**State:** `currentWave="G"`, `currentStep="G2"`, `completedSteps+=["G2"]`, `nextStep="G3"`
**Rollback:** `git revert --no-edit <lastCommit>`
**Commit:** `feat(payment): gratiskvote for de første 10 000 brukerne [ACT4 G2]`

---

## STEG G3 — «Gjennomgå og bekreft» ved reise nr. 2

**Formål:** Full re-onboarding er 15 minutter og ~75 felt — rett etter at hun nettopp har betalt igjen. Det er det dyreste frafallspunktet i produktet, plassert på det verst tenkelige stedet.
**Avhengigheter:** G2
**Risiko:** Lav
**Filanker:** `app/onboarding/`, `app/api/onboarding/draft/route.ts`

**Patch-skisse:**

- Har brukeren `journeyState = IDLE` og en fullført profil fra før → vis **«Gjennomgå profilen din»** i stedet for blanke felt.
- Alle tidligere svar forhåndsutfylt. Hun kan endre det hun vil, og bekrefter til slutt.
- Bekreftelsen setter `deepProfileComplete` på nytt og oppdaterer `updatedAt`, slik at matching bruker ferske data.
- Ett skjermbilde per seksjon, ikke 13 steg. Samme datakvalitet, brøkdelen av friksjonen.
- Er profilen eldre enn 6 måneder, be henne se gjennom nøkkelfeltene ekstra nøye — folk endrer seg.

- **Sjekk 1 (tsc):** `npx tsc --noEmit`
- **Sjekk 2 (grep):** `grep -rn "gjennomgå\|bekreft" app/onboarding/ --include=*.tsx | head`
- **Sjekk 3 (build):** `npm run build`
- **Sjekk 4 (FUNKSJONELT):** Bruker som har fullført én reise starter ny → **gjennomgangsvisning med forhåndsutfylte svar**, ikke tomme felt. Bekreft → `journeyState = QUEUED`. Mål tidsbruk: skal være **under 3 minutter**.
- **Sjekk 5 (KONSEPT):** Loopen er lukket uten unødvendig friksjon.

**State:** `currentWave="G"`, `currentStep="G3"`, `completedSteps+=["G3"]`, `nextStep="G4"`
**Rollback:** `git revert --no-edit <lastCommit>`
**Commit:** `feat(onboarding): gjennomgå og bekreft ved ny reise [ACT4 G3]`

---

## STEG G4 — Vipps ePayment-adapter

**Formål:** Den faktiske integrasjonen. **Utføres først når bruker har Vipps-godkjenning og nøkler.**
**Avhengigheter:** G3 + Vipps-nøkler tilgjengelige
**Risiko:** Høy
**Filanker:** `lib/payment/vipps.ts` (ny), `app/api/payment/vipps/` (nye ruter)

**Patch-skisse:**

- `VippsProvider implements PaymentProvider`.
- Ruter: `POST /api/payment/vipps/create`, `POST /api/payment/vipps/webhook`, `GET /api/payment/vipps/status`.
- **Kritiske krav** (samme som fikk Stripe-implementasjonen til å feile i ACT v1):
  1. **Rå body ved signaturverifisering** — aldri `.json()` før verifisering
  2. **Idempotens** via `WebhookEvent` med provider-ID som primærnøkkel
  3. **Ordre før onboarding, reise etter betaling** — brukeren skal aldri kunne starte uten `status = PAID`
  4. **Angrerett-avkrysning** lagres på `Order.withdrawalWaiver` med `waiverAt`
  5. Retry med backoff mot Vipps API
  6. Vipps-nøkler kun i env, aldri i versjonert fil
- Test i Vipps testmiljø **før** produksjon.
- `PAYMENTS_ENABLED` (F5) styrer om betaling er aktiv.

- **Sjekk 1 (tsc):** `npx tsc --noEmit`
- **Sjekk 2 (grep):** `grep -rn "req.text()" app/api/payment/vipps/webhook/route.ts` → **må finnes** (rå body, ikke `.json()`)
- **Sjekk 3 (build):** `npm run build`
- **Sjekk 4 (FUNKSJONELT):** I Vipps testmiljø: full betaling → `Order.status = PAID`, bruker kan sette seg i kø. Send samme webhook to ganger → **andre gang ignoreres** (`WebhookEvent` finnes). Webhook med ugyldig signatur → `401`.
- **Sjekk 5 (KONSEPT):** Betaling gir tilgang til én reise. Ingen funksjon er gated bak nivå.

**State:** `currentWave="G"`, `currentStep="G4"`, `completedSteps+=["G4"]`, `nextStep="FULLFØRT"`, `scores.produkt=95`
**Rollback:** Sett `PAYMENTS_ENABLED=false` (øyeblikkelig), deretter `git revert --no-edit <lastCommit>`
**Commit:** `feat(payment): Vipps ePayment-adapter med idempotens [ACT4 G4]`

---

# 5. LANSERINGSSTRATEGI OG PORTER

## 5.1 Tomt-hus-problemet

ToSom har et startproblem de fleste produkter slipper: **verdien krever andre brukere.** Kohortterskelen (B6) beskytter mot de verste matchene, men strategien må planlegges:

| Grep | Effekt |
|---|---|
| Registrering åpner **før** matching | Bygg kø før første runde |
| Annonsert første runde | «Første matcher kobles [dato]» — skaper forventning |
| Geografisk konsentrasjon | Start i én region. Tettere kø, bedre matcher |
| Invitasjonsbølger | Slipp inn i puljer, ikke jevnt |
| Ærlig ventetekst | «Vi venter til vi har nok mennesker til å finne en god match til deg» |

## 5.2 Fire porter

| Port | Fase | Krav | Mål |
|---|---|---|---|
| **0** | Intern alfa, 5–10 egne kontoer | Bølge A–B grønn, E4 grønn | Full syklus verifisert i DB, ikke i logg |
| **1** | Lukket beta, 50–200 inviterte, gratis | Alle MUST FIX. Bølge A–E | Reelle mennesker, reell 30-dagers reise |
| **2** | Åpen beta, gratis, opptil 10 000 | Bølge F. 20+ fullførte reiser. Lasttest bestått | Volum. Kohortterskel nås hver natt |
| **3** | Betaling på | Bølge G. Vilkår juridisk gjennomgått | Bærekraft |

**Port 1 er den viktigste og kan ikke forkortes.** 30-dagersreisen tar 30 dager. Du får ikke vite om produktet virker før noen har fullført en.

Daglig oppfølging i port 1:
- Fikk alle i køen en match, eller ble runden utsatt?
- Hvor mange oppdaget matchen innen 24 t? **Innen 48 t?** (invariant I-4)
- Hvor mange nådde dag 7? Dag 15? Dag 30?
- Hvor mange rapporterte?
- Hva sier de om matchkvaliteten?

## 5.3 Gate-kriterier

| Kriterium | Port 1 | Port 2 | Port 3 |
|---|---|---|---|
| `tsc` = 0 feil | ✅ | ✅ | ✅ |
| CI grønn (alle jobber) | ✅ | ✅ | ✅ |
| E2E full verdikjede | ✅ | ✅ | ✅ |
| Sentry fanger server- og edge-feil | ✅ | ✅ | ✅ |
| Alarm ved uteblitt runde | ✅ | ✅ | ✅ |
| Verifisert gjenoppretting | ✅ | ✅ | ✅ |
| Rapportering tilgjengelig | ✅ | ✅ | ✅ |
| `endJourney()` etterlater 0 rader | ✅ | ✅ | ✅ |
| `concept-guard` grønn | ✅ | ✅ | ✅ |
| 20+ fullførte reiser | — | ✅ | ✅ |
| Lasttest 10k i kø | — | ✅ | ✅ |
| Vilkår juridisk gjennomgått | — | — | ✅ |
| Vipps testet i testmiljø | — | — | ✅ |

## 5.4 Rollback ved lansering

Vercel har øyeblikkelig tilbakerulling av deploys. **Databasemigreringer har det ikke.** Derfor:

- Additive migreringer først, brytende senere (regel 15)
- Verifisert backup umiddelbart før hver brytende migrering
- Brytende migreringer i lav trafikk, **aldri fredag**
- `MATCHING_ENABLED=false` som første tiltak ved mistanke om feil i koblingslogikken — den stopper skaden uten å ta ned produktet

---

# 6. RISIKOANALYSE

| # | Risiko | Sanns. | Konsekvens | Nivå | Tiltak |
|---|---|---|---|---|---|
| R1 | `maxDuration` uteblir → cron kuttes stille | **Høy** | Kritisk | 🔴 | A4 + A5 |
| R2 | Sentry laster ikke serverside → blind drift | **Verifisert nå** | Kritisk | 🔴 | A2, A3 |
| R3 | Bølge B ødelegger produksjonsdata | Middels | Katastrofal | 🔴 | Regel 15, E6-backup, B3-test |
| R4 | Ingen oppdager matchen uten varsling | **Middels** | Høy | 🟠 | F4 måler. Fallback: rolig e-post |
| R5 | For tynn kø ved lansering | Høy | Høy | 🟠 | B6-terskel + strategi 5.1 |
| R6 | Sletting feiler på fremmednøkler | Middels | Høy | 🟠 | B3 eksplisitt transaksjon + E3 |
| R7 | Vipps forsinket | Middels | Middels | 🟠 | G2 gratiskvote. Adapter klar |
| R8 | Samtykkeflyten gjeninnføres ved uhell | Lav | Høy | 🟠 | B11 `concept-guard` |
| R9 | Grønne tester skjuler ødelagt kode | **Pågår** | Middels | 🟠 | E1 + muteringstest |
| R10 | Hobby-plan → runden må deles | Middels | Høy | 🟠 | 0.3 avklarer. Ekstra steg i F |
| R11 | Juridisk eksponering på refusjon | Middels | Middels | 🟡 | C4 angrerett-avkrysning |
| R12 | Vipps-webhook uten idempotens → dobbeltbetaling | Middels | Høy | 🟠 | G1 `WebhookEvent` |
| R13 | Forlatte matcher blokkerer køen | Middels | Middels | 🟡 | B9 14-dagers utløp |
| R14 | Bølge B tar lengre tid enn 14 dager | **Høy** | Middels | 🟡 | Forventet. Ikke forser sperren |

**R2 og R4 er de underliggende risikoene.** R2 fordi et system som ikke kan fortelle oss at det er ødelagt, før eller siden vil være ødelagt uten at vi vet. R4 fordi den er en produkthypotese forkledd som en designbeslutning — og den må måles, ikke antas.

---

# 7. MUST FIX / KAN VENTE

## 7.1 MUST FIX BEFORE LAUNCH — 24 punkter

**Grunnlaget (1–5)**
1. `tsc` = 0 feil — **A1**
2. `instrumentation.ts`, serverside Sentry verifisert — **A2**
3. `sentry.edge.config.ts` — **A3**
4. `maxDuration` satt, Vercel-plan avklart — **0.3, A4**
5. Fail-fast env-validering — **A6**

**Koblingsmodellen (6–14)**
6. `journeyState` håndhevet i databasen — **B1**
7. `matchQueuedAt` + «Start reisen» setter `QUEUED` — **B5**
8. Én matchemotor, `OnboardingFlow.tsx:411` fjernet — **B5**
9. Kohortterskel med 72-timers ventil — **B6**
10. Parvis kobling uten samtykke — **B6**
11. Samtykkeflyten fjernet i kode, UI og skjema — **B7, B8**
12. `MatchHistory` som sperreliste — **B2**
13. Dag 1 starter ved `bothSeenAt` — **B9**
14. `endJourney()` — verifisert 0 gjenværende rader — **B3, B10**

**Drift (15–18)**
15. Alarm ved uteblitt matcherunde — **A5**
16. Alarm på 5xx og DB-feil — **A5**
17. Varslingskanal som faktisk leses — **A5**
18. Verifisert backup **og** gjenoppretting — **E6**

**Trygghet (19–21)**
19. Rapporter / Avslutt / Blokker — **C1, C2**
20. Vilkår og personvern oppdatert med angrerett — **C4**
21. Admin-samtaleinnsyn logges — **C3**

**Kvalitet (22–24)**
22. CI grønn, stubbtester erstattet — **E1**
23. E2E full verdikjede inkl. sletting — **E4**
24. `loading.tsx` + `error.tsx` på hovedruter — **D1, D2**

## 7.2 KAN VENTE

**Første kvartal etter lansering:** `lib/journey/engine.ts` → 7 moduler *(krever tester først)* · `microcopy.ts` (1703 l.) oppdeling · full design-token-migrering av alle importører · én auth-inngang på alle 98 ruter · CSRF konsekvent · full WCAG-revisjon · ekstern penetrasjonstest · transaksjonell e-post *(kun hvis F4 viser at det trengs)* · `x-url`-avhengighet i admin-layout

**Senere / v4.1+:** Denormalisering av Json-felt · blocking/bucketing · worker-kø · read replicas · partisjonering av `Message`/`SystemLog`/`AuditLog` · distribuert tracing · **sharding — ikke før 5–10M brukere**

---

# 8. FERDIGKRITERIER PER BØLGE

| Bølge | Steg | Ferdigkriterium | Score etter |
|---|---|---|---|
| **0** | 3 | Tilstandsfil finnes. Baseline dokumentert. Vercel-plan og Sentry-DSN bekreftet | 67 % |
| **A** 🔒 | 6 | `tsc` 0 feil · server- og edge-feil synlig i Sentry · cron uten timeout · alarm mottatt · oppstart feiler ved manglende env | 72 % |
| **B** 🔒 | 11 | Full syklus i staging: kø → kobling → oppmøte → dag 1 → dag 30 → sletting → kø. `concept-guard` grønn | 80 % |
| **C** | 5 | Rapportering virker · admin-innsyn logges · vilkår dekker angrerett · sletting etterlater 0 rader | 83 % |
| **D** | 9 | 0 hvite skjermer · én tokenkilde · onboarding overlever tømt localStorage · full flyt på ekte mobil | 87 % |
| **E** | 6 | Muteringstest beviser at testene er reelle · E2E full verdikjede grønn · gjenoppretting faktisk gjennomført | 90 % |
| **F** | 5 | Vercel eneste deploy-vei · cache virker · lasttest 1k bestått · kill switches virker | 93 % |
| **G** | 4 | Gratiskvote virker · Vipps testet i testmiljø · webhook idempotent | 96 % |

**Samlet: 49 steg.**

Estimat, forutsatt ett steg om gangen med verifisering: bølge A ~3 dager · **bølge B ~14 dager** · C ~5 · D ~6 · E ~5 · F ~4 · G ~5 (pluss ventetid på Vipps).

> **Bølge B er tyngre enn C–G til sammen.** Det er ikke pessimisme — det er en skjemamigrering på fire modeller pluss fjerning av en hel brukerflyt. Forser du sperren, mister du evnen til å isolere årsak når noe ryker.

---

## SLUTTNOTAT TIL UTFØRENDE MODELL

Du kommer til å bli fristet til å slå sammen steg. **Ikke gjør det.**

ACT v2.0 hadde 8 batch-avvik, og det gjorde det umulig å avgjøre hvilken endring som drepte cron-jobbene. ACT v3.0 utførte 29 av 30 steg riktig og bygde likevel feil produkt, fordi ingen stilte spørsmålet i Sjekk 5.

De fem sjekkene finnes fordi hver av dem har fanget noe de andre slapp gjennom:

- **Sjekk 1** fanger typefeil — men `jest` kan være grønn mens `tsc` er rød *(funn N-1)*
- **Sjekk 2** fanger at noe finnes — men ikke at det virker
- **Sjekk 3** fanger byggfeil — en kompilerende auth-bypass kompilerer fint
- **Sjekk 4** fanger at funksjonen virker — men ikke at den er riktig funksjon
- **Sjekk 5** fanger at det er riktig produkt

Når du er i tvil: **les kapittel 3, still spørsmålet, og spør brukeren.**

Og husk hva ToSom er: et produkt som lover ro. Bygg det rolig.

---

*TOSOM-ACT-INSTRUKS v4.0 — Launch & Scale Edition. 13. august 2026.*
*49 steg i 8 bølger. To sperrer. Fem sjekker per steg.*
*Alle filankere er verifisert mot commit `2d9b7fc`.*
