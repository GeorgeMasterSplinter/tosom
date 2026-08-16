# TOSOM-ACT-INSTRUKS-v7.0

**Siste kodefase før lukket beta — 12 steg i 5 bølger.**

| | |
|---|---|
| **Dokumentversjon** | 7.0 |
| **Dato** | 16. august 2026 |
| **Utgangscommit** | `c93b8cb` |
| **Grunnlag** | `docs/TOSOM-MASTERPLAN-v6.0.md` |
| **State-fil** | `docs/ACT-STATE-v7.json` |
| **Antall steg** | 12 |
| **Antall bølger** | 5 (nummerert 0–5) |
| **Mål** | Lukke A13, A14, A15, A10, A12 og levere en matcherunde som kan feile |

> Alle filankre er kontrollert mot commit `c93b8cb`. ACT v7 retter hull. Den bygger ingenting nytt.

---

## Innhold

1. [ACT-regler](#1-act-regler)
2. [State-fil](#2-state-fil)
3. [Bølgeoversikt](#3-bølgeoversikt)
4. [Stegene](#4-stegene)
5. [Locking-regler](#5-locking-regler)
6. [Stop-regler](#6-stop-regler)
7. [Verifikasjonsregler](#7-verifikasjonsregler)
8. [Avslutning](#8-avslutning)

---

# 1. ACT-regler

## 1.1 Utførelse

1. **Ett steg per ACT-kommando.**
2. **Ingen parallellitet.** Neste steg starter først når inneværende er verifisert og locked.
3. **Ingen hopp fremover.**
4. **Ingen endring av locked steg** uten eksplisitt ordre.
5. **Ingen nye funksjoner.** Alt skal ha belegg i masterplan v6.0.
6. **Ingen nye ruter.** Ikke én.
7. **Ingen endring av matching-motoren.** `lib/matching/` skal være uendret etter v7. Kun cron-rutens telling endres.
8. **Ingen endring av journey-motoren.** `lib/journey/` skal være uendret.
9. **Ingen endring av scoring.** `unifiedScore`, vekter og terskler er urørlige.
10. **Ingen endring av API-kontrakter.** Eksisterende responsformater beholdes.
11. **Ingen migrasjoner.** `prisma/schema.prisma` skal være uendret etter v7.
12. **Ingen refaktorering uten ordre.**

## 1.2 Etter hvert steg

```bash
npx tsc --noEmit
npm run build
npm run verify:api
npm run verify:lang
```

Deretter stegets egen `grep`-verifikasjon, deretter `docs/ACT-STATE-v7.json`, deretter vent på godkjenning.

## 1.3 Områder som er ferdige

Levert og verifisert i v5 og v6. **Ikke rør.**

| Område | Ikke rør |
|---|---|
| Matching-motoren | `lib/matching/`, `lib/geo/`, `config/matching.ts` |
| Journey-motoren | `lib/journey/`, `app/api/cron/journey/` |
| Sentry og feilfanger | `next.config.js`, `instrumentation*.ts`, `app/global-error.tsx` |
| De fem nye rutene fra v6 | `journey/status`, `profile/me`, `system/mark-read`, `match/breakdown`, `chat/typing` |
| Fasedefinisjonen | `lib/journey/engine.ts` og de fem importstedene |
| Vilkår, angrerett, kontosletting | `app/vilkår/`, `app/api/settings/` |
| Admin-flater | `app/admin/`, `app/api/admin/` |
| Helsesjekk | `app/api/cron/health/route.ts` |

Ser du noe galt her: **noter i `observations`, ikke rett.**

## 1.4 Utenfor v7 — og hvorfor

| Sak | Avvik | Grunn |
|---|---|---|
| Moodpersistens | A3 | Krever migrasjon. Utsatt etter beslutning; kosmetisk konsekvens. |
| PDF-generering | A4 | Krever nytt bibliotek eller ny rute. Begge forbudt. |
| Betalingsimplementering | A15 | Vipps er eneste planlagte vei, nøkkel kommer om ca. to uker. v7 deaktiverer korrekt. |
| Sletting av døde ruter | A12 | v7 kartlegger. Sletting krever menneskelig kontroll av listen. |
| 144 spørsmål | B3.2 | Georges skrivejobb |
| Mobil-QA | B2.7 | Krever fysisk enhet |
| Gjenopprettingstest | A2 | Krever produksjonslik database |
| Monitor-registrering | A9 | Skjer i nettleser |
| Sentry-DSN | — | Vercel-innstilling |

## 1.5 To forhold som allerede er løst

Disse skal **ikke** bygges. De finnes.

**Innlogging til beta.** `lib/auth/config.ts:21` har `EmailProvider` med SMTP. En invitert betatester logger inn med e-postlenke. Vipps kobles inn senere som en ekstra metode; skallrutene finnes i `app/api/auth/vipps/`.

**Gratiskvote for de første 10 000.** `lib/payment/freeQuota.ts:11` har `FREE_QUOTA_LIMIT = 10_000`, brukt på `:19`. Koblet i `app/api/journey/queue/route.ts`. v7 verifiserer grensen, bygger den ikke.

---

# 2. State-fil

## 2.1 Format

`docs/ACT-STATE-v7.json` finnes allerede i repoet. **Den skal ikke opprettes på nytt**, kun oppdateres.

```json
{
  "version": "7.0",
  "baseCommit": "c93b8cb",
  "currentStep": "0.1",
  "completedSteps": [],
  "lockedSteps": [],
  "pendingSteps": ["0.1","0.2","1.1","1.2","1.3","2.1","2.2","3.1","4.1","4.2","4.3","5.1"],
  "errors": [],
  "observations": [],
  "baseline": {},
  "updatedAt": ""
}
```

## 2.2 Oppdateringsregler

Etter hvert fullført steg: fjern fra `pendingSteps`, legg i `completedSteps` og `lockedSteps`, sett `currentStep` til neste eller `null`, sett `updatedAt`. Ved feil: objekt i `errors` med `{ step, description, resolution }`. Ved observasjon uten handling: streng i `observations`. `baseline` fylles kun i 0.2.

---

# 3. Bølgeoversikt

| Bølge | Navn | Steg | Løser |
|---|---|---|---|
| **0** | Grunnlinje | 0.1, 0.2 | — |
| **1** | Diagnostikk | 1.1, 1.2, 1.3 | A13, A14 |
| **2** | Funnel og drift | 2.1, 2.2 | A15, A10 |
| **3** | Kartlegging | 3.1 | A12 |
| **4** | Seed og observasjon | 4.1, 4.2, 4.3 | R1–R4 |
| **5** | Overlevering | 5.1 | — |

Bølge 1 kommer før bølge 4 fordi en matcherunde uten fungerende avvisningslogg ikke kan tolkes. Det var nøyaktig feilen i v6.

---

# 4. Stegene

---

## BØLGE 0 — Grunnlinje

---

### STEG 0.1 — Verifiser utgangspunktet

**Formål:** Bekrefte at v6 faktisk står der masterplan v6.0 sier, før noe endres.

**Avhengighet:** Ingen.

**Risiko:** Lav — ingen kodeendring.

**Filanker:** `docs/ACT-STATE-v6.json`, `docs/ACT-STATE-v7.json`

**Instruks:**

1. Bekreft rent arbeidstre: `git status --porcelain` skal være tom. Er den ikke det, **stopp og vis hva som ligger der.**
2. Bekreft at HEAD er `c93b8cb`, eller en etterkommer uten kodeendringer.
3. Bekreft at v6 er ferdig:
   ```bash
   jq '{completed:(.completedSteps|length), locked:(.lockedSteps|length), pending:(.pendingSteps|length), errors:(.errors|length)}' docs/ACT-STATE-v6.json
   ```
   Krav: 12, 12, 0, 0. Avvik → **stopp.**
4. Oppdater `docs/ACT-STATE-v7.json`: flytt `0.1` til `completedSteps` og `lockedSteps`, sett `currentStep` til `"0.2"`.

**Verifikasjon:**
```bash
git status --porcelain          # tom
jq -r '.currentStep' docs/ACT-STATE-v7.json    # 0.2
jq '.pendingSteps | length' docs/ACT-STATE-v7.json   # 11
```

**State-oppdatering:** `completedSteps += ["0.1"]`, `lockedSteps += ["0.1"]`, `currentStep = "0.2"`

**Rollback:** `git restore docs/ACT-STATE-v7.json`

**Commit-mal:** `chore(act): verifiser v6-tilstand før ACT v7`

---

### STEG 0.2 — Mål grunnlinjen

**Formål:** Fryse målt tilstand før endring, slik at hvert senere steg måles mot fakta.

**Avhengighet:** `0.1` locked.

**Risiko:** Lav — ingen kodeendring.

**Filanker:** Kun `docs/ACT-STATE-v7.json`.

**Instruks:**

Kjør hver kommando og skriv **faktisk resultat** til `baseline`. Ikke forventet verdi. Ikke rett noe.

```bash
npx tsc --noEmit 2>&1 | grep -c "error TS"
npx prisma format --check
npx jest 2>&1 | tail -3
npm run verify:api; echo "api=$?"
npm run verify:lang; echo "lang=$?"

# A13 — teller avvisningsloggen?
grep -c 'rejectReasons\[' app/api/cron/matching/route.ts       # forventet 0
grep -c 'pairsEvaluated++\|pairsEvaluated +=' app/api/cron/matching/route.ts

# A14 — spøkelsesfelter
grep -c 'warmScore\|phaseOrder' app/profile/page.tsx
grep -c 'warmScore\|phaseOrder' prisma/schema.prisma            # forventet 0

# A15 — betaling
test -d app/api/payment/webhook && echo "webhook-katalog finnes"
ls app/api/payment/webhook/ | wc -l
grep -n "PAYMENTS_ENABLED" config/features.ts config/env.ts 2>/dev/null

# A10 — cron
jq -r '.crons[] | "\(.path) \(.schedule)"' vercel.json

# A12 — omfang
find app/api -name route.ts | wc -l
```

Skriv som:

```json
"baseline": {
  "tscErrors": 0,
  "jest": "116/116",
  "verifyApi": "exit 0",
  "verifyLang": "exit 0",
  "rejectReasonsIncrement": 0,
  "ghostFieldsInClient": 6,
  "ghostFieldsInSchema": 0,
  "paymentWebhookDirExists": true,
  "cronMatching": "0 5 * * *",
  "cronJourney": "0 7 * * *",
  "apiRoutes": 109
}
```

**Verifikasjon:**
```bash
jq '.baseline' docs/ACT-STATE-v7.json         # fylt ut
jq -r '.baseline.rejectReasonsIncrement' docs/ACT-STATE-v7.json   # 0
```

**State-oppdatering:** `baseline = {…}`, `completedSteps += ["0.2"]`, `lockedSteps += ["0.2"]`, `currentStep = "1.1"`

**Rollback:** `git restore docs/ACT-STATE-v7.json`

**Commit-mal:** `chore(act): grunnlinjemåling før bølge 1`

---

## BØLGE 1 — Diagnostikk

> Uten en fungerende avvisningslogg er matchemotoren en svart boks. Kobler den null par en dag, står vi uten forklaring.

---

### STEG 1.1 — A13: avvisningsloggen må telle

**Formål:** Gjøre `rejectReasons` til et måleinstrument i stedet for hardkodede nuller.

**Avhengighet:** `0.2` locked.

**Risiko:** Middels — berører matcherundens kodesti, men ikke logikken.

**Filanker:**
```
app/api/cron/matching/route.ts:92        let pairsEvaluated = 0;
app/api/cron/matching/route.ts:93-103    const rejectReasons = { ...ni nøkler, alle 0 }
app/api/cron/matching/route.ts:104       REJECT_LABELS
app/api/cron/matching/route.ts:190       for (let j = i + 1; …)
app/api/cron/matching/route.ts:195       if (!a.profile || !b.profile) continue;
app/api/cron/matching/route.ts:200       if (blockSet.has(pairKey)) continue;
app/api/cron/matching/route.ts:204-205   sjekkAlleDealbreakers (tosidig)
app/api/cron/matching/route.ts:207       if (abBlocked || baBlocked) continue;
app/api/cron/matching/route.ts:213       if (result.score < MIN_SCORE) continue;
app/api/cron/matching/route.ts:333       rejectSummary
app/api/cron/matching/route.ts:339       metadata: { …, pairsEvaluated, rejectReasons }

lib/matching/dealbreaker.ts:10-13        DealbreakerResult { hasDealbreaker, reason? }
lib/matching/dealbreaker.ts:174          sjekkAlleDealbreakers
```

**Nøkkelfunn:** årsaken finnes allerede. `sjekkAlleDealbreakers` returnerer `reason` som beskrivende tekst:

| Linje i `dealbreaker.ts` | `reason`-tekst begynner med | Teller |
|---|---|---|
| `:26` | `Modenhets-gap for stort` | `modenhetsgap` |
| `:50` | `Inkompatibel livsrytme` | `livsrytme` |
| `:79` | `Sikkerhetsnivå-gap for stort` | `sikkerhetsniva` |
| `:103` | `Dealbreaker:` | `preferanser` |
| `:127` | `Grense brutt:` | `grenser` |
| `:158`, `:164` | `For langt bort` | `radius` |

**Instruks:**

1. **`lib/matching/dealbreaker.ts` skal ikke endres.** Verifiser med `git diff` etterpå at den er urørt.

2. Inkrementer `pairsEvaluated` én gang per vurdert par, øverst i den indre løkka etter `:192`.

3. Inkrementer riktig teller på hvert avvisningspunkt:
   - `:195` → `mangler_profil`
   - `:200` → `sperreliste`
   - `:207` → utled fra `reason`. Bruk `abBlocked.reason ?? baBlocked.reason` og kartlegg mot tabellen over.
   - `:213` → `score_under_termin`

4. **Kartleggingen skal være eksplisitt**, ikke basert på tekstsøk i fri form. Skriv en ren funksjon som tar `reason`-strengen og returnerer nøkkelen. Treffer ingen kjent form, tell den som `preferanser` og legg strengen i en `unmapped`-liste i metadata, slik at ukjente årsaker er synlige framfor tause.

5. **Ingen endring i rekkefølgen på sjekkene.** Ingen endring i terskler. Ingen endring i `continue`-atferden. Kun telling.

6. Behold `rejectSummary` på `:333` og `metadata` på `:339` som de er.

**Verifikasjon:**
```bash
grep -c 'rejectReasons\[' app/api/cron/matching/route.ts        # >= 4
grep -c 'pairsEvaluated++\|pairsEvaluated +=' app/api/cron/matching/route.ts   # >= 1
git diff --stat lib/matching/                                   # tom — urørt
git diff --stat config/matching.ts                              # tom — urørt
npx tsc --noEmit
npm run build
npx jest __tests__/dealbreaker.test.ts __tests__/unified-scorer.test.ts
```

**State-oppdatering:** `completedSteps += ["1.1"]`, `lockedSteps += ["1.1"]`, `currentStep = "1.2"`

**Rollback:** `git restore app/api/cron/matching/route.ts`

**Commit-mal:** `fix(match): avvisningsloggen teller reelt [A13]`

---

### STEG 1.2 — Sjekk 9: vis at telleren kan bevege seg

**Formål:** Bevise at måleinstrumentet fra 1.1 faktisk måler. Dette er hele grunnen til at A13 slapp gjennom v6.

**Avhengighet:** `1.1` locked.

**Risiko:** Lav — testkode, ingen produksjonskode.

**Filanker:**
```
__tests__/dealbreaker.test.ts            eksisterende mønster
lib/matching/dealbreaker.ts:19-30        checkMaturityGap — gap > 4 gir dealbreaker
docker-compose.test.yml                  Postgres på 5433
```

**Prinsippet:** en teller som alltid gir null beviser ingenting, uansett hvor mange ganger den leses av. Før avvisningsloggen godtas, skal det være vist at minst én teller går fra 0 til et positivt tall.

**Instruks:**

1. Skriv en test som konstruerer to profiler med `maturityLevel` som garantert bryter grensen på `dealbreaker.ts:23` — for eksempel 1 og 9, gap = 8 > 4.

2. Testen skal vise **begge utfall**:
   - To profiler som *skal* avvises → `modenhetsgap` går fra 0 til 1
   - To profiler som *ikke* skal avvises → telleren står stille

   Uten begge deler er ikke instrumentet bevist.

3. Gjør det samme for minst én teller til — `radius` egner seg, siden `checkRadius` er tosidig.

4. Testen skal kalle den samme kartleggingsfunksjonen som `route.ts` bruker, ikke en kopi.

5. **Ikke endre `dealbreaker.ts` for å gjøre testen enklere.** Er den vanskelig å teste, er det en observasjon, ikke en grunn til å endre matchemotoren.

**Verifikasjon:**
```bash
npx jest 2>&1 | tail -4         # alle grønne, antall > 116
git diff --stat lib/matching/   # tom
npx tsc --noEmit
```

Testen skal feile hvis kartleggingen fjernes. Prøv det: kommenter ut én inkrementering, kjør testen, bekreft rødt, gjenopprett.

**State-oppdatering:** `observations += ["1.2: Sjekk 9 bestått — teller X gikk 0→N, teller Y stod stille"]`, `completedSteps += ["1.2"]`, `lockedSteps += ["1.2"]`, `currentStep = "1.3"`

**Rollback:** `git restore __tests__/`

**Commit-mal:** `test(match): Sjekk 9 — avvisningstellere kan bevege seg`

---

### STEG 1.3 — A14: fjern spøkelsesfeltene

**Formål:** Slutte å vise brukeren tall som ikke finnes.

**Avhengighet:** `1.2` locked.

**Risiko:** Lav.

**Filanker:**
```
app/profile/page.tsx:20-29     interface ProfileData { … warmScore, phaseOrder … }
app/profile/page.tsx:24        warmScore: number;
app/profile/page.tsx:25        phaseOrder: number;
app/profile/page.tsx:49-50     warmScore: data.warmScore ?? 0, phaseOrder: data.phaseOrder ?? 1,
app/profile/page.tsx:62-63     fallback-blokk
prisma/schema.prisma           0 treff på warmScore og phaseOrder
```

**Beslutning tatt:** feltene fjernes fra klienten. Alternativet — å innføre dem i skjemaet — krever migrasjon, som er forbudt i v7.

**Instruks:**

1. Søk først bredt for å bekrefte omfanget:
   ```bash
   grep -rn "warmScore\|phaseOrder" app components lib types
   ```
   Finnes de utenfor `app/profile/page.tsx`, **stopp og rapporter** før du fjerner noe.

2. Fjern begge feltene fra `interface ProfileData`, fra `setProfile`-objektet, og fra fallback-blokken.

3. Fjern all JSX som viser dem. **Ser brukeren en tydelig verdi der i dag, stopp og rapporter først** — å fjerne noe fra grensesnittet uten å vite hva som forsvinner er en endring i brukeropplevelsen.

4. `currentDay`, `daysRemaining`, `matchScore`, `photoUrl`, `identityName`, `bio` og `tags` beholdes uendret.

5. **Ikke rør `app/api/profile/me/route.ts`.** Ruten leverer ikke feltene i dag; det er riktig.

**Verifikasjon:**
```bash
grep -c "warmScore\|phaseOrder" app/profile/page.tsx      # 0
grep -rn "warmScore\|phaseOrder" app components lib types  # 0 treff
git diff --stat app/api/profile/                          # tom — ruten urørt
git diff --stat prisma/                                   # tom — ingen migrasjon
npx tsc --noEmit
npm run build
```

**State-oppdatering:** `completedSteps += ["1.3"]`, `lockedSteps += ["1.3"]`, `currentStep = "2.1"`

**Rollback:** `git restore app/profile/page.tsx`

**Commit-mal:** `fix(profile): fjern felter som ikke finnes i skjemaet [A14]`

---

## BØLGE 2 — Funnel og drift

---

### STEG 2.1 — A15: deaktiver betaling korrekt

**Formål:** Gjøre den nåværende blindveien til en bevisst, sperret og dokumentert tilstand.

**Avhengighet:** `1.3` locked.

**Risiko:** Middels — berører funnelen.

**Filanker:**
```
app/api/payment/webhook/            tom katalog, ingen route.ts
lib/payment/freeQuota.ts:11         FREE_QUOTA_LIMIT = 10_000
lib/payment/freeQuota.ts:19         return used < FREE_QUOTA_LIMIT;
lib/payment/freeQuota.ts:47         export { FREE_QUOTA_LIMIT }
app/api/journey/queue/route.ts      kobler gratiskvoten
config/features.ts                  PAYMENTS_ENABLED
.env.example                        3 STRIPE-variabler, 3 VIPPS-variabler
package.json                        0 treff på stripe
```

**Beslutning tatt:** Stripe skal ikke brukes i det hele tatt. Vipps blir eneste betalings- og innloggingsvei, og nøkkelen kommer om cirka to uker. v7 bygger ingen betaling.

**Instruks:**

**Del A — sperr flagget.**

Gjør det umulig å sette `PAYMENTS_ENABLED` sann uten at noen har bygget veien. Konkret: der flagget leses, legg inn en sperre som kaster en tydelig feil ved oppstart hvis flagget er sant, med tekst som forklarer at ingen betalingsvei finnes. **Bedre å feile ved oppstart enn å slippe en bruker inn i en blindvei.**

**Del B — fjern det tomme skallet.**

```bash
ls -la app/api/payment/webhook/
```

Er katalogen tom, slett den. Inneholder den noe, **stopp og rapporter.**

**Del C — rydd miljøvariablene.**

Fjern de tre STRIPE-variablene fra `.env.example` og erstatt dem med en kommentar om at Stripe ikke brukes. La VIPPS-variablene stå — de skal brukes.

**Del D — dokumenter.**

Skriv `deploy/payments.md` på bokmål: at ingen betalingsvei finnes i dag, at Vipps er eneste planlagte, at Stripe er forkastet, at gratiskvoten på 10 000 bærer funnelen inntil videre, og hva som må bygges når Vipps-nøkkelen kommer. **Dette er dokumentasjon, ikke en plan for v7.**

**Del E — verifiser kvotegrensen.**

Les `lib/payment/freeQuota.ts` og fastslå ved kodelesning hva som skjer for bruker 10 001. Skriv svaret til `observations`. **Ikke endre grensen.** Er atferden ved grensen uklar eller uheldig, er det en observasjon til beta, ikke en rettelse nå.

**Verifikasjon:**
```bash
test -d app/api/payment/webhook && echo "FEIL: finnes" || echo "OK: fjernet"
grep -c STRIPE .env.example                    # 0
grep -c VIPPS .env.example                     # 3 — uendret
test -f deploy/payments.md && echo OK
grep -c "FREE_QUOTA_LIMIT = 10_000" lib/payment/freeQuota.ts    # 1 — uendret
npm run verify:api                             # exit 0
npx tsc --noEmit
npm run build
```

**State-oppdatering:** `observations += ["2.1: bruker 10 001 → <faktisk atferd>"]`, `completedSteps += ["2.1"]`, `lockedSteps += ["2.1"]`, `currentStep = "2.2"`

**Rollback:** `git restore .env.example config/ && rm deploy/payments.md`

**Commit-mal:** `fix(payment): sperr betaling til Vipps er på plass [A15]`

---

### STEG 2.2 — A10: cron til norsk morgen

**Formål:** Flytte matcherunden til klokken 04:00 norsk tid.

**Avhengighet:** `2.1` locked.

**Risiko:** Lav — ren konfigurasjon.

**Filanker:**
```
vercel.json:9-17      crons
vercel.json:12        "/api/cron/matching"  →  "0 5 * * *"
vercel.json:16        "/api/cron/journey"   →  "0 7 * * *"
vercel.json:5-7       maxDuration 60
```

**Beslutning tatt:** matching 04:00 norsk sommertid, journey to timer senere. Vercel tolker alltid uttrykket som UTC og støtter ikke tidssoner, så sommertid velges som referanse. Om vinteren kommer runden én time tidligere.

| Jobb | Fra | Til | Norsk sommer | Norsk vinter |
|---|---|---|---|---|
| matching | `0 5 * * *` | **`0 2 * * *`** | 04:00 | 03:00 |
| journey | `0 7 * * *` | **`0 4 * * *`** | 06:00 | 05:00 |

**Instruks:**

1. Endre de to `schedule`-verdiene i `vercel.json`. **Ingen andre felter.** `maxDuration` og `functions` skal være uendret.

2. Legg inn en kommentar i `deploy/monitoring.md` som forklarer at tidene er UTC, hvilken norsk tid de tilsvarer sommer og vinter, og at forskyvningen er akseptert.

3. Kontroller at cron-rutene ikke gjør antakelser om lokal tid:
   ```bash
   grep -n "getHours\|getDate\|startOfDay" app/api/cron/matching/route.ts app/api/cron/journey/route.ts
   ```
   Finnes slike, **stopp og rapporter** — en tidsforskyvning kan da endre atferd, ikke bare klokkeslett.

4. **Antall cron-jobber skal fortsatt være to.** Hobby-grensen er uendret.

**Verifikasjon:**
```bash
jq -r '.crons[] | "\(.path) \(.schedule)"' vercel.json
# /api/cron/matching 0 2 * * *
# /api/cron/journey 0 4 * * *
jq '.crons | length' vercel.json               # 2
jq '.functions' vercel.json                    # uendret
npm run build
```

**State-oppdatering:** `completedSteps += ["2.2"]`, `lockedSteps += ["2.2"]`, `currentStep = "3.1"`

**Rollback:** `git restore vercel.json deploy/monitoring.md`

**Commit-mal:** `fix(ops): matcherunde kl 04:00 norsk tid [A10]`

---

## BØLGE 3 — Kartlegging

---

### STEG 3.1 — A12: kartlegg rutene, slett ingenting

**Formål:** Lage et kontrollerbart grunnlag for senere opprydding.

**Avhengighet:** `2.2` locked.

**Risiko:** Lav så lenge regelen holdes: **ingen sletting i dette steget.**

**Filanker:**
```
app/api/                                   109 route.ts
app/api/auth/vipps/authorize/route.ts      ekstern — livsviktig
app/api/auth/vipps/callback/route.ts       ekstern — livsviktig
app/api/system/health/route.ts             ekstern — livsviktig
app/api/auth/[...nextauth]/route.ts        NextAuth
app/api/cron/matching/route.ts             cron-mål
app/api/cron/journey/route.ts              cron-mål
app/api/cron/health/route.ts               ekstern overvåking
scripts/verify-api-links.mjs               eksisterende vakt
```

**Hvorfor ingen sletting:** de tre første rutene kalles aldri fra klientkode. En vakt basert på `fetch()`-søk ville merket alle tre som døde. Sletter man dem, mister man innlogging.

**Instruks:**

1. List alle 109 ruter med metoder.

2. Klassifiser hver rute i nøyaktig én gruppe:

   | Gruppe | Kriterium |
   |---|---|
   | **BRUKT** | Kalles fra `fetch()` i `app/`, `components/` eller `hooks/` |
   | **SERVER** | Kalles fra serverkomponent, `app/actions/`, `middleware.ts`, eller annen API-rute |
   | **EKSTERN** | Vipps, NextAuth, cron-mål, helsesjekk, webhook — kalles utenfra |
   | **TEST** | Kun brukt fra `e2e/` eller `__tests__/` |
   | **UBRUKT** | Ingen kaller funnet noe sted |

3. **Ved den minste tvil: klassifiser som SERVER, ikke UBRUKT.** Konsekvensen av feil i den ene retningen er en overflødig fil. I den andre er det en ødelagt innlogging.

4. Skriv resultatet til `docs/api-route-inventory.md`: tabell med rute, metoder, gruppe, og for BRUKT/SERVER hvilken fil som kaller den med linjenummer.

5. Lag et sammendrag øverst: antall per gruppe, og en tydelig merknad om at **UBRUKT-listen ikke er en sletteliste** før et menneske har gått gjennom den.

6. **Ingen filer slettes. Ingen ruter endres.** `git status` skal etterpå kun vise det nye dokumentet.

**Verifikasjon:**
```bash
test -f docs/api-route-inventory.md && echo OK
find app/api -name route.ts | wc -l            # 109 — uendret
git status --short                             # kun docs/api-route-inventory.md
grep -c "vipps/callback" docs/api-route-inventory.md    # >= 1
grep -c "EKSTERN" docs/api-route-inventory.md           # >= 6
npm run verify:api                             # exit 0
```

**State-oppdatering:** `observations += ["3.1: <antall> BRUKT, <antall> SERVER, <antall> EKSTERN, <antall> UBRUKT"]`, `completedSteps += ["3.1"]`, `lockedSteps += ["3.1"]`, `currentStep = "4.1"`

**Rollback:** `rm docs/api-route-inventory.md`

**Commit-mal:** `docs(api): kartlegg alle ruter uten sletting [A12]`

---

## BØLGE 4 — Seed og observasjon

> I v6 ga matcherunden 19 par, alle DEEP, med score 82–95 og null avvisninger. Det var ikke et sunnhetstegn. Det var åtte arketyper og en teller som ikke talte. Nå skal begge deler være reelle.

---

### STEG 4.1 — Ny testpopulasjon med reell spredning

**Formål:** Bygge en populasjon der dealbreakerne *kan* slå ut.

**Avhengighet:** `3.1` locked.

**Risiko:** Lav — testdata, ingen produksjonskode.

**Filanker:**
```
scripts/seed-40.ts:45-190     8 Array.from-løkker — arketypene
scripts/seed-40.ts:193-216    2 hardkodede profiler
lib/matching/dealbreaker.ts:23    maturityLevel-gap > 4
lib/matching/dealbreaker.ts:158   radius, tosidig
config/matching.ts:10         MIN_COHORT_SIZE = 20
config/matching.ts:14         MIN_SCORE = 40
docker-compose.test.yml       Postgres 5433
```

**Instruks:**

1. Lag `scripts/seed-spread.ts`. **La `seed-40.ts` stå urørt** — den dokumenterer hvordan v6 ble kjørt.

2. Krav til populasjonen, 60 brukere:
   - **Individuell variasjon**, ikke gruppekonstanter. Hver bruker skal ha egne verdier på feltene dealbreakerne leser.
   - `maturityLevel` spredt over hele skalaen, slik at noen par får gap > 4
   - `lifeRhythm` med minst to uforenlige verdier representert
   - `securityLevel` med gap ≥ 2 mellom noen par
   - Eksplisitte preferanser og grenser satt på minst 10 brukere
   - `distancePref` fra 25 til 300 km, med noen par som ligger for langt fra hverandre
   - Postnummer over minst 8 landsdeler, med reell avstand
   - Alle med `journeyState = QUEUED` og `queuedAt` satt
   - Minst én bruker med `queuedAt` 73 timer tilbake, for å prøve `MAX_QUEUE_WAIT_HOURS`

3. **Målet er ikke at flest mulig skal kobles.** Målet er at hver enkelt dealbreaker skal kunne utløses av minst ett par. En populasjon der alt kobles beviser like lite som en der ingenting kobles.

4. **Ingen endring i terskler, vekter eller matchelogikk** for å oppnå ønsket resultat.

**Verifikasjon:**
```bash
docker compose -f docker-compose.test.yml up -d
npx prisma migrate deploy
npx tsx scripts/seed-spread.ts

# spredning, ikke arketyper
psql "$DATABASE_URL" -c 'SELECT COUNT(DISTINCT "maturityLevel") FROM "Profile";'   # >= 5
psql "$DATABASE_URL" -c 'SELECT COUNT(DISTINCT "lifeRhythm") FROM "Profile";'      # >= 2
psql "$DATABASE_URL" -c 'SELECT COUNT(DISTINCT "distancePref") FROM "Profile";'    # >= 5
psql "$DATABASE_URL" -c 'SELECT COUNT(*) FROM "User" WHERE "journeyState" = '"'"'QUEUED'"'"';'   # 60
psql "$DATABASE_URL" -c 'SELECT COUNT(*) FROM "Profile" WHERE "latitude" IS NOT NULL;'          # 60

git diff --stat scripts/seed-40.ts    # tom — urørt
git diff --stat lib/matching/         # tom
```

Er koordinatantallet under 60, **stopp.** Uten koordinater feiler radiussjekken stille.

**State-oppdatering:** `completedSteps += ["4.1"]`, `lockedSteps += ["4.1"]`, `currentStep = "4.2"`

**Rollback:** `rm scripts/seed-spread.ts && docker compose -f docker-compose.test.yml down -v`

**Commit-mal:** `test(seed): populasjon med reell spredning`

---

### STEG 4.2 — Kjør runden som kan feile

**Formål:** Observere matchemotoren med et instrument som virker og data som varierer.

**Avhengighet:** `4.1` locked.

**Risiko:** Høy i betydning. Dette steget avgjør om matchemotoren diskriminerer.

**Filanker:**
```
app/api/cron/matching/route.ts:61-74     CRON_SECRET
app/api/cron/matching/route.ts:77-87     kill switch
app/api/cron/matching/route.ts:339       metadata med rejectReasons
config/matching.ts:10,11,14              terskler
```

**Instruks:**

1. Kjør runden:
   ```bash
   curl -i -X GET http://localhost:3000/api/cron/matching \
     -H "Authorization: Bearer $CRON_SECRET"
   ```

2. Hent avvisningsfordelingen:
   ```sql
   SELECT metadata FROM "SystemLog" ORDER BY "createdAt" DESC LIMIT 1;
   ```

3. Kjør alle seks kontrollspørringene fra beta-protokollen i masterplan v6.0 del 13, og i tillegg:

   ```sql
   -- Resonansfordeling — det v6 ikke klarte å vise
   SELECT "resonanceLevel", COUNT(*) FROM "Match"
   WHERE "createdAt" > NOW() - INTERVAL '5 minutes'
   GROUP BY "resonanceLevel";

   -- Scorespredning
   SELECT MIN("score"), MAX("score"), AVG("score"), STDDEV("score") FROM "Match"
   WHERE "createdAt" > NOW() - INTERVAL '5 minutes';
   ```

4. Prøv kill switch: `MATCHING_ENABLED=false` skal gi 200 med `skipped: true`, ingen nye matcher, køen intakt.

**Godkjenningskriterier:**

| # | Krav | Terskel |
|---|---|---|
| 1 | Sum av `rejectReasons` | **> 0** |
| 2 | Minst tre årsaker representert | ≥ 3 |
| 3 | `pairsEvaluated` | > antall par |
| 4 | Resonansnivåer | **≥ 3 ulike** |
| 5 | Ingen bruker i to matcher | 0 |
| 6 | Alle score ≥ `MIN_SCORE` | MIN ≥ 40 |
| 7 | Radiusbrudd | 0 |
| 8 | Kill switch | 200, `skipped: true` |

**Stop-regler:**

| Funn | Handling |
|---|---|
| `rejectReasons`-sum = 0 | Stopp. Instrumentet virker ikke, eller populasjonen er fortsatt for homogen. Ikke endre terskler. |
| Kun ett resonansnivå | Stopp og rapporter. Dette er et reelt funn i motoren og skal utredes, ikke rettes i farten. |
| Bruker i to matcher | Stopp umiddelbart. Kritisk feil. |
| Score under 40 | Stopp. Terskelen håndheves ikke. |
| Radiusbrudd | Stopp. Tosidig sperre virker ikke. |
| 0 par opprettet | Stopp. Les fordelingen; ikke juster `MIN_SCORE`. |

**Under ingen omstendighet** skal terskler, vekter eller matchelogikk endres for å oppfylle et kriterium. Er kriteriet ikke oppfylt, er det et funn.

**Verifikasjon:**
```bash
git diff --stat lib/matching/ config/matching.ts    # begge tomme
npx jest
npx tsc --noEmit
```

**State-oppdatering:** `observations += ["4.2: <alle åtte kriterier med faktiske tall>"]`, `completedSteps += ["4.2"]`, `lockedSteps += ["4.2"]`, `currentStep = "4.3"`

**Rollback:** Ingen kodeendring. `docker compose -f docker-compose.test.yml down -v`

**Commit-mal:** `test(match): observert runde med spredt populasjon`

---

### STEG 4.3 — Skriv observasjonen

**Formål:** Gjøre resultatet fra 4.2 til et etterprøvbart dokument.

**Avhengighet:** `4.2` locked.

**Risiko:** Lav.

**Filanker:** `docs/ACT-STATE-v7.json`, ny fil `docs/matching-observation-v7.md`

**Instruks:**

1. Skriv `docs/matching-observation-v7.md` med: dato og commit, populasjonens sammensetning, alle åtte kriterier med faktiske tall, full avvisningsfordeling per årsak, resonansfordeling, scorespredning med standardavvik, kjøretid, og kill switch-resultatet.

2. Sammenlign eksplisitt med v6-kjøringen: 19 par, alle DEEP, score 82–95, null avvisninger. **Vis hva som endret seg og hvorfor.**

3. Er noe fortsatt uventet — for eksempel at ett nivå dominerer selv med spredt populasjon — skriv det som et åpent spørsmål. **Ikke gjett på årsaken.**

4. Skriv samme tall til `observations` i state-filen.

**Verifikasjon:**
```bash
test -f docs/matching-observation-v7.md && echo OK
grep -c "rejectReasons\|avvisning" docs/matching-observation-v7.md    # >= 1
jq -r '.observations | length' docs/ACT-STATE-v7.json                 # >= 4
```

**State-oppdatering:** `completedSteps += ["4.3"]`, `lockedSteps += ["4.3"]`, `currentStep = "5.1"`

**Rollback:** `rm docs/matching-observation-v7.md`

**Commit-mal:** `docs(match): observasjonsrapport for spredt runde`

---

## BØLGE 5 — Overlevering

---

### STEG 5.1 — Sluttverifikasjon og overlevering

**Formål:** Bekrefte at kodesporet er ferdig, og overlevere det som gjenstår til et menneske.

**Avhengighet:** `4.3` locked.

**Risiko:** Lav.

**Filanker:** `docs/ACT-STATE-v7.json`, ny fil `docs/BETA-READINESS.md`

**Instruks:**

1. Kjør full verifikasjon:
   ```bash
   npx tsc --noEmit
   npx prisma format --check
   npx jest
   npm run build
   npm run verify:api
   npm run verify:lang
   ```

2. Bekreft at forbudte områder er urørt gjennom hele v7:
   ```bash
   git diff --stat c93b8cb..HEAD -- lib/matching/ lib/journey/ prisma/ config/matching.ts
   ```
   **Krav: tom utskrift.** Er den ikke tom, **stopp og rapporter hver linje.**

3. Skriv `docs/BETA-READINESS.md` med to lister.

   **Ferdig i v7:**

   | Sak | Steg |
   |---|---|
   | A13 avvisningslogg teller | 1.1 |
   | Sjekk 9 bevist | 1.2 |
   | A14 spøkelsesfelter fjernet | 1.3 |
   | A15 betaling sperret og dokumentert | 2.1 |
   | A10 cron kl. 04:00 norsk tid | 2.2 |
   | A12 ruter kartlagt | 3.1 |
   | Spredt populasjon og observert runde | 4.1–4.3 |

   **Gjenstår — menneskeoppgaver med presise kriterier:**

   | # | Oppgave | Ferdig når |
   |---|---|---|
   | 1 | 144 spørsmål i egen stemme | `scripts/seed-questions.ts` oppdatert, ingen maskinformuleringer igjen |
   | 2 | Sentry-DSN | Variabel satt i Vercel, testfeil synlig i Sentry |
   | 3 | Ekstern monitor | Registrert etter `deploy/monitoring.md`, alarm utløst ved 503 |
   | 4 | Gjenopprettingstest | Kopi gjenopprettet til tom database, RTO målt og skrevet i `deploy/backup.md` |
   | 5 | Mobil-QA | Onboarding, chat, dashbord og reise kontrollert på fysisk telefon |

4. Noter hva som fortsatt er utsatt: A3 moodpersistens og A4 PDF, begge med begrunnelse.

5. Sett `currentStep` til `null` og skriv `finalVerification` i state-filen.

**Verifikasjon:**
```bash
git diff --stat c93b8cb..HEAD -- lib/matching/ lib/journey/ prisma/    # tom
jq -r '.pendingSteps | length' docs/ACT-STATE-v7.json                  # 0
jq -r '.currentStep' docs/ACT-STATE-v7.json                            # null
test -f docs/BETA-READINESS.md && echo OK
```

**State-oppdatering:** `finalVerification = {…}`, `completedSteps += ["5.1"]`, `lockedSteps += ["5.1"]`, `currentStep = null`

**Rollback:** `rm docs/BETA-READINESS.md`

**Commit-mal:** `docs(beta): sluttverifikasjon og overlevering av ACT v7`

---

# 5. Locking-regler

## 5.1 Når et steg er ferdig

Når verifikasjonen er grønn og state er oppdatert, skriv nøyaktig:

```
Steg X.Y er nå locked. Ikke endre dette senere.
```

Legg steget i `lockedSteps`. Vent på godkjenning. Start ikke neste steg før du har fått den.

## 5.2 Hva locking betyr

Et locked steg er ferdig. Du skal ikke endre filene det berørte, ikke «forbedre» det du gjorde, ikke rette stil eller navn i etterkant, og ikke legge til noe du kom på senere.

Ser du et problem i et locked steg: **skriv det i `errors` og fortsett.**

## 5.3 Eneste unntak

Ordren `Lås opp steg X.Y` fra George. Er du i tvil: den er ikke gitt.

---

# 6. Stop-regler

## 6.1 Absolutte stopp

Stopp umiddelbart og uten unntak hvis en endring ville medføre:

1. **Endring av matching-logikk** — rekkefølge på sjekker, hvem som kobles, hvordan par velges
2. **Endring av journey-logikk** — faser, dager, overganger, systemmeldinger
3. **Endring av scoring** — `unifiedScore`, vekter, `MIN_SCORE`, resonansnivåer
4. **Endring av API-kontrakter** — responsformat på eksisterende ruter
5. **Endring av database-schema** — enhver migrasjon
6. **Endring av fasedefinisjon** — `PHASE_CONFIGS`, `getPhaseForDay`, `THEME_RANGES`
7. **Endring av funksjonell flyt** — rekkefølgen brukeren møter noe i
8. **Endring av brukeropplevelse** uten eksplisitt ordre — tekst, knapper, synlige verdier
9. **Ny rute** — under enhver omstendighet
10. **Ny avhengighet** i `package.json`

## 6.2 Alminnelige stopp

11. Filen i filankeret finnes ikke, eller avviker vesentlig fra beskrivelsen
12. `npx tsc --noEmit` gir feil
13. `npm run build` feiler
14. En `grep`-verifikasjon gir uventet resultat
15. En test som var grønn blir rød
16. `npm run verify:api` eller `verify:lang` gir exit 1
17. Instruksen er tvetydig og du må gjette
18. Du finner levende kode som påvirker brukeren der instruksen antok død kode
19. En stop-regel i selve steget utløses

## 6.3 Hvordan du stopper

```
STOPP — Steg X.Y

Hva jeg forsøkte:
  <konkret handling>

Hva som skjedde:
  <faktisk feilmelding eller funn, ordrett>

Hvilken stop-regel som utløste:
  <nummer fra del 6>

Løsning 1: <forslag>
  Konsekvens: <hva det medfører>

Løsning 2: <forslag>
  Konsekvens: <hva det medfører>

Venter på godkjenning.
```

Skriv samtidig `{ "step": "X.Y", "description": "…", "resolution": "venter" }` i `errors`.

## 6.4 Hva du aldri gjør

- Ikke prøv en tredje og fjerde variant på egen hånd
- Ikke utvid omfanget for å komme rundt problemet
- Ikke deaktiver en test som feiler
- Ikke legg til `// @ts-ignore` eller `any` for å få `tsc` grønn
- Ikke juster en terskel for å oppfylle et godkjenningskriterium
- Ikke hopp over steget

**To forsøk. Deretter stopp.**

---

# 7. Verifikasjonsregler

## 7.1 Fast rekkefølge

```bash
npx tsc --noEmit
npm run build
npm run verify:api
npm run verify:lang
npx jest
```

Deretter stegets egen `grep`-verifikasjon. Feiler ett av disse: **stopp.**

## 7.2 Vokterkontroll — kjøres etter hvert steg

```bash
git diff --stat c93b8cb..HEAD -- lib/matching/ lib/journey/ prisma/ config/matching.ts
```

**Krav: tom utskrift gjennom hele v7.** Er den ikke tom, er en absolutt stop-regel brutt.

## 7.3 Hva som teller som bestått

| Sjekk | Krav |
|---|---|
| tsc | 0 feil |
| build | Grønn, ingen nye advarsler |
| jest | ≥ 116, alle grønne |
| verify:api | exit 0 |
| verify:lang | exit 0 |
| Vokterkontroll | Tom utskrift |
| Sjekk 9 | Målingen er vist å kunne gi et annet svar |

## 7.4 Sjekk 9 — observasjonen må kunne feile

Dette er v7s viktigste metodekrav, og grunnen til at A13 slapp gjennom v6.

I v6 ble steg 5.2 låst med en observasjon som så gyldig ut: en runde ble kjørt, seks spørringer besvart, resultatene skrevet ned. Men `rejectReasons` var hardkodede nuller. Målingen var utført; måleinstrumentet var ødelagt.

**Før en måling godtas som bevis, skal det være vist at den kan gi et annet svar.**

| Steg | Hvordan Sjekk 9 oppfylles |
|---|---|
| 1.1 | Telleren inkrementeres — bevises i 1.2 |
| 1.2 | Test viser 0→N ved avvisning, og stillstand uten |
| 1.3 | `grep` gir 0 treff der det før var 6 |
| 2.1 | Katalogen er borte, `verify:api` fortsatt grønn |
| 2.2 | `jq` viser nye uttrykk |
| 3.1 | Dokumentet finnes, ingen filer slettet |
| 4.2 | Avvisningssum > 0 — beviser at instrumentet fra 1.1 måler i drift |
| 5.1 | Vokterkontrollen er tom |

En teller som alltid gir null beviser ingenting. En test som alltid består beviser ingenting.

---

# 8. Avslutning

## 8.1 Full verifikasjon

Når alle 12 steg er locked, kjør del 7.1 og 7.2 i sin helhet. Krav: 0 typefeil, format ok, alle tester grønne, build grønn, begge vakter exit 0, vokterkontroll tom.

## 8.2 Driftobservasjon

`docs/matching-observation-v7.md` skal foreligge med reelle tall fra steg 4.2, og med eksplisitt sammenligning mot v6-kjøringen.

## 8.3 Sjekk 9

Bekreft for hvert steg i tabellen i del 7.4 at målingen kunne gitt et annet svar. Kan den ikke det, er steget ikke bevist — uansett hvor grønt alt ser ut.

## 8.4 Oppdatert lanseringsvurdering

Masterplan v6.0 satte 86 % for lukket beta og 70 % for offentlig lansering. Rapporter et nytt anslag basert på hva v7 faktisk oppnådde, med begrunnelse per endring.

Blir avvisningsloggen reell og resonansnivåene spredt, er den største tekniske usikkerheten borte. Da er det de fire menneskeoppgavene som står igjen før beta.

**Rapporter ærlig.** Fem sykluser har rapportert for høyt. v6 var den første som ikke gjorde det, og likevel slapp A13 gjennom. Er et steg delvis gjennomført, skriv det. Er en verifikasjon hoppet over, skriv det.

## 8.5 Oppdatert roadmap

Skriv hva som gjenstår i tre spor: ACT-oppgaver etter beta, menneskeoppgaver før beta, og observasjoner som kun beta kan svare på.

## 8.6 Sluttstate

```json
{
  "currentStep": null,
  "completedSteps": ["0.1","0.2","1.1","1.2","1.3","2.1","2.2","3.1","4.1","4.2","4.3","5.1"],
  "lockedSteps":    ["0.1","0.2","1.1","1.2","1.3","2.1","2.2","3.1","4.1","4.2","4.3","5.1"],
  "pendingSteps": [],
  "finalVerification": {
    "tsc": "0 feil",
    "jest": "<faktisk>",
    "build": "grønn",
    "verifyApi": "exit 0",
    "verifyLang": "exit 0",
    "guardCheck": "tom — matching, journey, prisma urørt"
  },
  "remainingForBeta": [
    "144 spørsmål i egen stemme (George)",
    "Sentry-DSN satt og testfeil bekreftet (George)",
    "Ekstern monitor registrert (George)",
    "Gjenopprettingstest med målt RTO (George)",
    "Mobil-QA på fysisk enhet (George)"
  ],
  "deferred": ["A3 moodpersistens — krever migrasjon", "A4 PDF — krever bibliotek eller rute"],
  "updatedAt": "<ISO>"
}
```

## 8.7 Klar for lukket beta

Kodesporet er ferdig når alle 12 steg er locked og vokterkontrollen er tom. Betaen starter når de fem menneskeoppgavene i `docs/BETA-READINESS.md` er krysset av.

Innlogging er ikke en hindring: e-postlenke virker allerede via `lib/auth/config.ts:21`. Vipps kobles inn når nøkkelen kommer, som en ekstra metode.

---

*TOSOM-ACT-INSTRUKS-v7.0 — 12 steg, 5 bølger, basert på TOSOM-MASTERPLAN-v6.0 ved commit `c93b8cb`.*
