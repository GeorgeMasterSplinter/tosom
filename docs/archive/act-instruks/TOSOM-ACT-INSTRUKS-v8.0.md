# TOSOM-ACT-INSTRUKS-v8.0

**Runde A og B — fundament og ukentlig kadens. 11 steg i 4 bølger.**

| | |
|---|---|
| **Dokumentversjon** | 8.0 |
| **Dato** | 16. august 2026 |
| **Utgangscommit** | `88d5ad8` |
| **Grunnlag** | `docs/TOSOM-MASTERPLAN-v7.0.md` |
| **State-fil** | `docs/ACT-STATE-v8.json` |
| **Antall steg** | 11 |
| **Antall bølger** | 4 (nummerert 0–3) |
| **Mål** | Rette Tailwind og radius, deretter innføre ukentlig matchekadens |

> Alle filankre er kontrollert mot commit `88d5ad8`. Runde C — offentlige flater og tekst — er ikke med her. Den krever ferdigskrevet tekst og kommer som ACT v9.

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
2. **Ingen parallellitet.** Neste steg starter når inneværende er verifisert og locked.
3. **Ingen hopp fremover.**
4. **Ingen endring av locked steg** uten eksplisitt ordre.
5. **Ingen nye funksjoner.** Alt skal ha belegg i masterplan v7.0.
6. **Ingen nye API-ruter.**
7. **Ingen endring av matchelogikk.** `lib/matching/` skal være uendret etter v8. Kun cron-rutens datauthenting endres.
8. **Ingen endring av journey-motoren.** `lib/journey/` skal være uendret.
9. **Ingen endring av scoring.** `unifiedScore`, vekter og `MIN_SCORE` er urørlige.
10. **Ingen migrasjoner.** `prisma/schema.prisma` skal være uendret.
11. **Ingen refaktorering uten ordre.**

## 1.2 Ett unntak fra v7-vokteren

ACT v7 krevde at `config/matching.ts` var urørt. **I bølge 2 skal den endres** — `MIN_COHORT_SIZE` fra 20 til 2.

Dette er den eneste tillatte endringen i den filen. `MIN_SCORE` og `MAX_QUEUE_WAIT_HOURS` røres ikke uten eksplisitt ordre.

Vokterkontrollen justeres tilsvarende fra og med steg 2.1. Se del 7.2.

## 1.3 Etter hvert steg

```bash
npx tsc --noEmit
npm run build
npm run verify:api
npm run verify:lang
```

Deretter stegets egen verifikasjon, deretter `docs/ACT-STATE-v8.json`, deretter vent på godkjenning.

## 1.4 Områder som er ferdige

| Område | Ikke rør |
|---|---|
| Matchemotoren | `lib/matching/` — alle filer |
| Journey-motoren | `lib/journey/` |
| Databaseskjema | `prisma/` |
| Scoring og terskler | `MIN_SCORE`, vekter, `weightConfig.ts` |
| Sentry og feilfanger | `next.config.js`, `instrumentation*.ts`, `app/global-error.tsx` |
| Avvisningsloggen fra v7 | Tellerlogikken i cron-ruten — utvides, ikke endres |
| Betalingssperren fra v7 | `deploy/payments.md`, `PAYMENTS_ENABLED`-sperren |

## 1.5 Utenfor v8

| Sak | Grunn |
|---|---|
| All teksten på offentlige sider | Runde C — krever ferdigskrevet tekst |
| Vilkår og ordensregler | George + jurist |
| Rapporteringsfunksjon | Runde C |
| 144 spørsmål | Georges skrivejobb |
| Vipps-integrasjon | Venter på nøkkel |
| A3 moodpersistens, A4 PDF | Krever migrasjon henholdsvis nytt bibliotek |
| Visuell finpuss | Menneskeoppgave etter steg 1.1 |

---

# 2. State-fil

## 2.1 Format

`docs/ACT-STATE-v8.json` finnes allerede. **Skal ikke opprettes på nytt**, kun oppdateres.

```json
{
  "version": "8.0",
  "baseCommit": "88d5ad8",
  "currentStep": "0.1",
  "completedSteps": [],
  "lockedSteps": [],
  "pendingSteps": ["0.1","0.2","1.1","1.2","1.3","2.1","2.2","2.3","3.1","3.2","3.3"],
  "errors": [],
  "observations": [],
  "baseline": {},
  "updatedAt": ""
}
```

## 2.2 Oppdateringsregler

Etter hvert fullført steg: fjern fra `pendingSteps`, legg i `completedSteps` og `lockedSteps`, sett `currentStep` til neste eller `null`, sett `updatedAt`. Ved feil: objekt i `errors`. Ved observasjon uten handling: streng i `observations`. `baseline` fylles kun i 0.2.

---

# 3. Bølgeoversikt

| Bølge | Navn | Steg | Løser |
|---|---|---|---|
| **0** | Grunnlinje | 0.1, 0.2 | — |
| **1** | Fundament (runde A) | 1.1, 1.2, 1.3 | Tailwind, radius |
| **2** | Kadens (runde B) | 2.1, 2.2, 2.3 | Ukentlig matching |
| **3** | Venterom og avslutning | 3.1, 3.2, 3.3 | Venteside, angrerett, overlevering |

Bølge 1 må være ferdig før bølge 2. Uten fungerende radius vil ukentlig kadens gi større puljer med matcher på tvers av landet — altså gjøre problemet verre.

---

# 4. Stegene

---

## BØLGE 0 — Grunnlinje

---

### STEG 0.1 — Verifiser utgangspunktet

**Formål:** Bekrefte at v7 står der masterplan v7.0 sier.

**Avhengighet:** Ingen.

**Risiko:** Lav — ingen kodeendring.

**Filanker:** `docs/ACT-STATE-v7.json`, `docs/ACT-STATE-v8.json`

**Instruks:**

1. `git status --porcelain` skal være tom. Ellers **stopp og vis hva som ligger der.**
2. Bekreft at v7 er ferdig:
   ```bash
   jq '{completed:(.completedSteps|length), locked:(.lockedSteps|length), pending:(.pendingSteps|length), errors:(.errors|length)}' docs/ACT-STATE-v7.json
   ```
   Krav: 12, 12, 0, 0. Avvik → **stopp.**
3. Oppdater `docs/ACT-STATE-v8.json`: flytt `0.1` til `completedSteps` og `lockedSteps`, sett `currentStep` til `"0.2"`.

**Verifikasjon:**
```bash
git status --porcelain                                # tom
jq -r '.currentStep' docs/ACT-STATE-v8.json           # 0.2
jq '.pendingSteps | length' docs/ACT-STATE-v8.json    # 10
```

**State-oppdatering:** `completedSteps += ["0.1"]`, `lockedSteps += ["0.1"]`, `currentStep = "0.2"`

**Rollback:** `git restore docs/ACT-STATE-v8.json`

**Commit-mal:** `chore(act): verifiser v7-tilstand før ACT v8`

---

### STEG 0.2 — Mål grunnlinjen

**Formål:** Fryse målt tilstand, særlig av de to feilene som skal rettes.

**Avhengighet:** `0.1` locked.

**Risiko:** Lav — ingen kodeendring.

**Filanker:** Kun `docs/ACT-STATE-v8.json`.

**Instruks:**

Kjør hver kommando og skriv **faktisk resultat** til `baseline`.

```bash
npx tsc --noEmit 2>&1 | grep -c "error TS"
npx jest 2>&1 | tail -3
npm run verify:api; echo "api=$?"
npm run verify:lang; echo "lang=$?"

# Tailwind — tell i bygget CSS
npm run build
CSS=$(ls -t .next/static/css/*.css | head -1)
echo "css=$CSS"
grep -o 'md\\:' "$CSS" | wc -l
grep -o 'lg\\:' "$CSS" | wc -l
grep -o 'sm\\:' "$CSS" | wc -l
grep -o 'hover\\:' "$CSS" | wc -l
grep -c "@config" styles/globals.css

# Radius
grep -c "distancePref" app/api/cron/matching/route.ts
grep -c "distancePref" prisma/schema.prisma

# Kadens
jq -r '.crons[] | "\(.path) \(.schedule)"' vercel.json
grep -n "MIN_COHORT_SIZE\|MIN_SCORE\|MATCH_DELAY_HOURS" config/matching.ts
```

Skriv som:

```json
"baseline": {
  "tscErrors": 0,
  "jest": "129/129",
  "verifyApi": "exit 0",
  "verifyLang": "exit 0",
  "tailwindMd": 0,
  "tailwindLg": 0,
  "tailwindSm": 0,
  "tailwindHover": 0,
  "configDirective": 0,
  "distancePrefInCron": 0,
  "distancePrefInSchema": 0,
  "cronMatching": "0 2 * * *",
  "cronJourney": "0 4 * * *",
  "minCohortSize": 20,
  "minScore": 40
}
```

**Verifikasjon:**
```bash
jq '.baseline' docs/ACT-STATE-v8.json                     # fylt ut
jq -r '.baseline.tailwindMd' docs/ACT-STATE-v8.json       # 0
jq -r '.baseline.distancePrefInCron' docs/ACT-STATE-v8.json  # 0
```

**State-oppdatering:** `baseline = {…}`, `completedSteps += ["0.2"]`, `lockedSteps += ["0.2"]`, `currentStep = "1.1"`

**Rollback:** `git restore docs/ACT-STATE-v8.json`

**Commit-mal:** `chore(act): grunnlinjemåling før runde A`

---

## BØLGE 1 — Fundament (runde A)

> To feil som gjør at systemet ikke oppfører seg som koden sier. Begge er små å rette og store i konsekvens.

---

### STEG 1.1 — Tailwind må lese konfigurasjonen

**Formål:** Få `tailwind.config.js` til å virke, slik at alle `md:`-, `lg:`- og `hover:`-klasser i kodebasen aktiveres.

**Avhengighet:** `0.2` locked.

**Risiko:** **Høy i visuell konsekvens.** Endringen påvirker hver eneste side samtidig.

**Filanker:**
```
package.json                    "tailwindcss": "^4.2.2"
postcss.config.js:3             '@tailwindcss/postcss': {}
tailwind.config.js:2            module.exports = { …v3-format }
tailwind.config.js:11-17        screens: sm 480, ph 820, md 768, lg 1024, xl 1280
styles/globals.css:1-3          @tailwind base/components/utilities
styles/globals.css              0 treff på @config
```

**Diagnosen:** Tailwind 4 leser ikke en JS-konfigurasjon uten `@config`-direktiv. Konfigurasjonen er død — inkludert breakpoints, farger, spacing og animasjoner.

**Instruks:**

**Del A — bekreft diagnosen først.**

```bash
cat node_modules/tailwindcss/package.json | jq -r '.version'
npm run build
CSS=$(ls -t .next/static/css/*.css | head -1)
grep -o 'md\\:' "$CSS" | wc -l
```

Er tallet allerede større enn null, er diagnosen feil. **Stopp og rapporter.**

**Del B — legg til direktivet.**

Legg `@config "../tailwind.config.js";` **øverst** i `styles/globals.css`, før `@tailwind base;`.

Kontroller at den relative stien stemmer fra `styles/` til rotkatalogen.

**Del C — bygg og mål.**

```bash
npm run build
CSS=$(ls -t .next/static/css/*.css | head -1)
grep -o 'md\\:' "$CSS" | wc -l
grep -o 'lg\\:' "$CSS" | wc -l
grep -o 'hover\\:' "$CSS" | wc -l
```

Alle tre skal nå være større enn null.

Virker ikke direktivet, er alternativet å flytte konfigurasjonen til v4-format med `@theme` i CSS. **Det er en større endring — stopp og rapporter før du forsøker den.**

**Del D — kontroller at ingenting brøt.**

Start `npm run dev` og se på tre sider: forsiden, `/priser` og `/vilkår`. I tre bredder: 390 px, 820 px og 1440 px.

**Stop-regel som ikke kan fravikes:** ser noe brutt ut — overlappende tekst, sprengte kolonner, elementer utenfor skjermen — **stopp og rapporter med beskrivelse per side og bredde. Ikke begynn å rette.**

Layoutene ble skrevet med breakpoints i tankene, så det kan bli riktig med det samme. Men noen sider kan ha blitt justert for å se bra ut *uten* dem. Å avgjøre hva som er riktig utseende er en menneskeoppgave.

**Del E — merknad om screens.**

`tailwind.config.js:11-17` har `sm: 480px`, `ph: 820px`, `md: 768px`. Rekkefølgen i objektet er ulogisk siden `ph` har høyere verdi enn `md`. Kontroller om Tailwind sorterer riktig, og **noter i `observations` hvis rekkefølgen gir uventet oppførsel.** Ikke endre den.

**Verifikasjon:**
```bash
grep -c "@config" styles/globals.css        # 1
npm run build
CSS=$(ls -t .next/static/css/*.css | head -1)
test $(grep -o 'md\\:' "$CSS" | wc -l) -gt 0 && echo "md OK"
test $(grep -o 'lg\\:' "$CSS" | wc -l) -gt 0 && echo "lg OK"
test $(grep -o 'hover\\:' "$CSS" | wc -l) -gt 0 && echo "hover OK"
npx tsc --noEmit
git diff --stat lib/ prisma/ config/        # tom
```

**State-oppdatering:** `observations += ["1.1: md=<N>, lg=<N>, hover=<N> i bygget CSS; visuell kontroll <resultat>"]`, `completedSteps += ["1.1"]`, `lockedSteps += ["1.1"]`, `currentStep = "1.2"`

**Rollback:** `git restore styles/globals.css`

**Commit-mal:** `fix(styles): aktiver Tailwind-konfigurasjonen`

---

### STEG 1.2 — Radiussperren må virke

**Formål:** Gjøre `distancePref` tilgjengelig for `checkRadius`, slik at brukerens avstandsgrense faktisk håndheves.

**Avhengighet:** `1.1` locked.

**Risiko:** Middels — endrer hvilke par som kan kobles.

**Filanker:**
```
app/api/cron/matching/route.ts:146-148    include: { profile: true }
app/api/cron/matching/route.ts:186-189    candidates = queued.map(u => ({ id, profile }))
lib/matching/dealbreaker.ts:155           if (a.distancePref != null && distKm > a.distancePref)
lib/matching/dealbreaker.ts:161           samme for b
lib/matching/findBestResonance.ts:321     MØNSTERET som skal kopieres
prisma/schema.prisma:84                   deepProfileData  Json?
```

**Diagnosen:** `distancePref` finnes ikke som kolonne. Den ligger i `deepProfileData`-JSON. Cron-ruten sender `u.profile` rått videre, så `checkRadius` får `undefined` og hopper over hele sjekken.

**Instruks:**

1. **`lib/matching/` skal ikke endres.** Verifiser med `git diff` etterpå.

2. I `app/api/cron/matching/route.ts:186-189`, utvid `candidates`-mappingen slik at `profile` får et `distancePref`-felt utpakket fra `deepProfileData`.

3. Bruk **nøyaktig samme mønster** som `lib/matching/findBestResonance.ts:321` — inkludert `typeof … === "number"`-kontrollen og `null` som standardverdi. Ikke oppfinn en egen variant.

4. Kontroller samtidig om `latitude` og `longitude` er kolonner eller ligger i JSON:
   ```bash
   grep -n "latitude\|longitude" prisma/schema.prisma
   ```
   Ligger de i JSON, må de pakkes ut på samme måte — ellers regner `checkRadius` med `undefined` koordinater. **Stopp og rapporter hvis de mangler.**

5. **Ingen endring i rekkefølgen på dealbreakerne. Ingen endring i terskler.**

**Verifikasjon:**
```bash
grep -c "distancePref" app/api/cron/matching/route.ts     # >= 1
grep -c "deepProfileData" app/api/cron/matching/route.ts  # >= 1
git diff --stat lib/ prisma/ config/matching.ts           # tom
npx tsc --noEmit
npm run build
npx jest
```

**State-oppdatering:** `completedSteps += ["1.2"]`, `lockedSteps += ["1.2"]`, `currentStep = "1.3"`

**Rollback:** `git restore app/api/cron/matching/route.ts`

**Commit-mal:** `fix(match): pakk ut distancePref så radiussperren virker`

---

### STEG 1.3 — Sjekk 9: vis at radius-telleren beveger seg

**Formål:** Bevise at radiussperren nå faktisk avviser. Uten dette er 1.2 uverifisert.

**Avhengighet:** `1.2` locked.

**Risiko:** Lav — testdata og observasjon.

**Filanker:**
```
scripts/seed-spread.ts                    eksisterende populasjon fra v7
docker-compose.test.yml                   Postgres 5433
app/api/cron/matching/route.ts:339        metadata med rejectReasons
lib/matching/dealbreaker.ts:155-165       checkRadius, tosidig
```

**Prinsippet:** i v7 sto radius-telleren på 0 fordi feltet aldri nådde fram. Nå skal den kunne bevege seg. En teller som fortsatt gir null beviser ingenting.

**Instruks:**

1. Kontroller at `scripts/seed-spread.ts` faktisk lager par som er for langt fra hverandre. Er avstandene for små, utvid spredningen — men **ikke endre noen terskel i `config/matching.ts`.**

2. Start database, migrer, seed:
   ```bash
   docker compose -f docker-compose.test.yml up -d
   npx prisma migrate deploy
   npx tsx scripts/seed-spread.ts
   ```

3. Kjør runden:
   ```bash
   curl -i -X GET http://localhost:3000/api/cron/matching \
     -H "Authorization: Bearer $CRON_SECRET"
   ```

4. Hent fordelingen:
   ```sql
   SELECT metadata FROM "SystemLog" ORDER BY "createdAt" DESC LIMIT 1;
   ```

**Godkjenningskriterier:**

| # | Krav | Terskel |
|---|---|---|
| 1 | `rejectReasons.radius` | **> 0** |
| 2 | Årsaker representert | ≥ 6 |
| 3 | Ingen bruker i to matcher | 0 |
| 4 | Alle score | ≥ 40 |
| 5 | Resonansnivåer | ≥ 3 |

5. Kontroller radius manuelt for de opprettede parene: beregn avstand og sammenlign mot **begge** parters grense. **Ett brudd er ett for mye.**

**Stop-regler:**

| Funn | Handling |
|---|---|
| `radius` fortsatt 0 | Stopp. Enten når feltet fortsatt ikke fram, eller populasjonen har ingen par utenfor grensen. Diagnostiser før du endrer noe. |
| Radiusbrudd blant opprettede par | Stopp. Den tosidige sperren virker ikke. |
| Færre enn 6 årsaker | Stopp og rapporter fordelingen. |
| Antall par faller drastisk | Ikke nødvendigvis feil — radius avviser nå. Rapporter tallet, ikke juster terskler. |

**Verifikasjon:**
```bash
git diff --stat lib/ config/matching.ts prisma/     # tom
npx jest
npx tsc --noEmit
```

**State-oppdatering:** `observations += ["1.3: radius=<N>, årsaker=<N>, par=<N>, nivåer=<N>, radiusbrudd=0"]`, `completedSteps += ["1.3"]`, `lockedSteps += ["1.3"]`, `currentStep = "2.1"`

**Rollback:** Ingen kodeendring. `docker compose -f docker-compose.test.yml down -v`

**Commit-mal:** `test(match): radiussperren observert i drift`

---

## BØLGE 2 — Kadens (runde B)

> Fra daglig til ukentlig matching. Kø gjennom uken, kobling natt til lørdag.

---

### STEG 2.1 — Kohortterskelen ned

**Formål:** La runden kjøre selv med få i kø, uten å senke kvalitetskravet.

**Avhengighet:** `1.3` locked.

**Risiko:** Middels — endrer når runden gjennomføres.

**Filanker:**
```
config/matching.ts:5      MATCH_DELAY_HOURS = 24     (ubrukt — 0 treff i app/ og lib/)
config/matching.ts:10     MIN_COHORT_SIZE = 20
config/matching.ts:11     MAX_QUEUE_WAIT_HOURS = 72
config/matching.ts:14     MIN_SCORE = 40
app/api/cron/matching/route.ts:20    import { MIN_COHORT_SIZE, … }
app/api/cron/matching/route.ts:158   if (cohortSize < MIN_COHORT_SIZE && !hasStaleEntries)
```

**Dette steget bryter v7-vokteren med hensikt.** `config/matching.ts` skal endres. Fra og med nå gjelder den justerte vokterkontrollen i del 7.2.

**Instruks:**

1. Sett `MIN_COHORT_SIZE = 2` på `config/matching.ts:10`.

2. **`MIN_SCORE` skal forbli 40.** Dette er absolutt. To mennesker som scorer 22 skal ikke kobles fordi de er de eneste to i kø. En dårlig match koster tretti dager av to menneskers liv.

3. `MATCH_DELAY_HOURS` på `:5` brukes ingen steder — verifiser det selv:
   ```bash
   grep -rn "MATCH_DELAY_HOURS" app lib components hooks --include=*.ts --include=*.tsx
   ```
   Er treffet tomt, marker konstanten som utdatert med en kommentar. **Ikke slett den** — andre filer kan importere den uten at grep fanger det.

4. `MAX_QUEUE_WAIT_HOURS` beholdes på 72 inntil videre. Med ukentlig kadens vil den utløse mellom runder, noe som er ønsket — det gir en ventil for den som har ventet lenge.

5. Oppdater kommentaren på `app/api/cron/matching/route.ts:7` som sier `MIN_COHORT_SIZE=20`.

**Verifikasjon:**
```bash
grep -n "MIN_COHORT_SIZE" config/matching.ts        # = 2
grep -n "MIN_SCORE" config/matching.ts              # = 40, uendret
git diff config/matching.ts                         # kun MIN_COHORT_SIZE + kommentarer
git diff --stat lib/ prisma/                        # tom
npx tsc --noEmit
npm run build
npx jest
```

**State-oppdatering:** `completedSteps += ["2.1"]`, `lockedSteps += ["2.1"]`, `currentStep = "2.2"`

**Rollback:** `git restore config/matching.ts app/api/cron/matching/route.ts`

**Commit-mal:** `feat(match): kohortterskel til 2, MIN_SCORE uendret`

---

### STEG 2.2 — Matcherunden til lørdag

**Formål:** Kjøre matching én gang i uken, natt til lørdag.

**Avhengighet:** `2.1` locked.

**Risiko:** Lav teknisk, høy i betydning.

**Filanker:**
```
vercel.json:9-17      crons
vercel.json:12        "/api/cron/matching"  →  "0 2 * * *"
vercel.json:16        "/api/cron/journey"   →  "0 4 * * *"
vercel.json:5-7       maxDuration 60
deploy/monitoring.md  dokumentasjon av tider
app/api/cron/journey/route.ts:375-376    watchdog, kommentar om Hobby-grensen
```

**Instruks:**

1. Endre matching til `"0 2 * * 6"` — lørdag, klokken 04:00 norsk sommertid.

2. **Journey-runden skal fortsatt kjøre daglig.** Behold `"0 4 * * *"`. Reisene løper hver dag uavhengig av når de startet, og watchdog ligger i denne ruten.

3. Antall cron-jobber skal fortsatt være to. Hobby-grensen er uendret.

4. Oppdater `deploy/monitoring.md`: at matching nå kjører ukentlig, hvilken norsk tid det tilsvarer sommer og vinter, og at helsesjekkens terskel på 30 minutter **ikke lenger gir mening for matcherunden** mellom lørdager.

5. **Kritisk:** helsesjekken i `app/api/cron/health/route.ts` sjekker om matcherunden har skrevet hjerteslag de siste 30 minuttene. Med ukentlig kadens vil den melde 503 hele uken.

   Kontroller hvordan sjekken er bygget:
   ```bash
   grep -n "matching\|threshold\|SystemLog" app/api/cron/health/route.ts
   ```

   Må terskelen skilles per jobb — daglig for journey, ukentlig for matching — **stopp og rapporter med forslag.** Ikke endre helsesjekken på egen hånd; den ble bygget i v6 og er utenfor dette stegets omfang.

**Verifikasjon:**
```bash
jq -r '.crons[] | "\(.path) \(.schedule)"' vercel.json
# /api/cron/matching 0 2 * * 6
# /api/cron/journey 0 4 * * *
jq '.crons | length' vercel.json        # 2
jq '.functions' vercel.json             # uendret
grep -c "lørdag\|ukentlig" deploy/monitoring.md   # >= 1
npm run build
```

**State-oppdatering:** `observations += ["2.2: helsesjekk-terskel <vurdering>"]`, `completedSteps += ["2.2"]`, `lockedSteps += ["2.2"]`, `currentStep = "2.3"`

**Rollback:** `git restore vercel.json deploy/monitoring.md`

**Commit-mal:** `feat(ops): matcherunde kun natt til lørdag`

---

### STEG 2.3 — Utmelding før runden

**Formål:** Sikre at den som melder seg ut fredag kveld ikke kobles natt til lørdag.

**Avhengighet:** `2.2` locked.

**Risiko:** Middels — berører køhåndtering.

**Filanker:**
```
app/api/journey/exit/          eksisterende rute
app/api/journey/queue/         inngang til køen
app/api/cron/matching/route.ts:137-149    henter QUEUED-brukere
```

**Problemet:** melder hun seg ut fredag 23:50 og runden kjører 02:00, må hun være borte fra køen. Ellers møter partneren hennes opp lørdag morgen til noen som ikke er der.

**Instruks:**

1. Les `app/api/journey/exit/route.ts` i sin helhet. Fastslå hva den gjør i dag med en bruker i `QUEUED`.

2. Kontroller at utmelding setter tilstanden bort fra `QUEUED` **umiddelbart**, ikke ved neste runde. Cron-ruten filtrerer på `journeyState: 'QUEUED'` (`:139`), så en bruker som er ute av den tilstanden faller automatisk bort.

3. Gjør den ikke det, rett **kun utmeldingsruten**. Ikke rør cron-rutens filtrering.

4. Skriv en test som viser at en bruker som melder seg ut ikke lenger returneres av køspørringen. **Sjekk 9: den må kunne feile** — vis også at en bruker som *ikke* har meldt seg ut fortsatt returneres.

5. **Ingen ny rute.** `app/api/journey/exit/` finnes allerede.

**Verifikasjon:**
```bash
test -f app/api/journey/exit/route.ts && echo OK
npx jest 2>&1 | tail -3           # alle grønne, antall > 129
git diff --stat lib/ prisma/      # tom
npx tsc --noEmit
npm run build
```

**State-oppdatering:** `completedSteps += ["2.3"]`, `lockedSteps += ["2.3"]`, `currentStep = "3.1"`

**Rollback:** `git restore app/api/journey/ __tests__/`

**Commit-mal:** `fix(journey): utmelding fjerner fra kø umiddelbart`

---

## BØLGE 3 — Venterom og avslutning

---

### STEG 3.1 — Venterommet sier når, ikke hvor lenge

**Formål:** Gi den som venter et rolig, ærlig svar.

**Avhengighet:** `2.3` locked.

**Risiko:** Lav.

**Filanker:**
```
components/dashboard/WaitingForMatch.tsx:1     'use client'
components/dashboard/WaitingForMatch.tsx:82    export function WaitingForMatch({ userName })
components/dashboard/WaitingForMatch.tsx       234 linjer totalt
```

**Instruks:**

1. Les hele komponenten først. Noter hva den viser i dag, og skriv det i `observations`.

2. Teksten skal si **når** matchen kommer, ikke hvor lenge det er igjen.

   - Riktig: «Matchen din kommer lørdag morgen.»
   - Galt: «3 dager og 14 timer igjen.»

   En nedtelling skaper utålmodighet, og utålmodighet er nettopp det ToSom motvirker.

3. Finnes det en nedtelling i komponenten i dag, fjern den.

4. Tonen skal være rolig og voksen: ingen utropstegn, ingen «Snart skjer det!». **Bokmål** — språkvakten kjøres etterpå.

5. **Ingen ny komponent. Ingen ny rute.** Endre den som finnes.

6. **Ikke** legg inn angrerettlenken her — det er steg 3.2.

**Verifikasjon:**
```bash
grep -c "lørdag" components/dashboard/WaitingForMatch.tsx     # >= 1
grep -c "timer igjen\|minutter igjen\|nedtelling" components/dashboard/WaitingForMatch.tsx   # 0
npm run verify:lang                                            # exit 0
npx tsc --noEmit
npm run build
```

**State-oppdatering:** `observations += ["3.1: venterommet viste <før> → <etter>"]`, `completedSteps += ["3.1"]`, `lockedSteps += ["3.1"]`, `currentStep = "3.2"`

**Rollback:** `git restore components/dashboard/WaitingForMatch.tsx`

**Commit-mal:** `feat(dashboard): venterommet viser tidspunkt, ikke nedtelling`

---

### STEG 3.2 — Angrerettlenken

**Formål:** Oppfylle angreretten uten å så tvil.

**Avhengighet:** `3.1` locked.

**Risiko:** Lav.

**Filanker:**
```
components/dashboard/WaitingForMatch.tsx     fra steg 3.1
app/api/journey/exit/                        eksisterende utmelding
app/vilkår/page.tsx:159                      angrerett i vilkårene
```

**Utformingen er bestemt:** ikke en knapp ved siden av «start reisen» — den ville trekke oppmerksomheten mot tvil i det øyeblikket brukeren nettopp har bestemt seg.

I stedet: **en nedtonet lenke i venterommet.** Der for den som leter, usynlig for den som ikke gjør det.

**Instruks:**

1. Legg inn en lenke nederst i venterommet, i mindre og dempet skrift. Ikke en knapp med ramme eller farge.

2. Formulering i retning av: *Ombestemmer du deg før lørdag, kan du melde deg ut og få pengene tilbake.*

   Tonen skal være rolig og faktisk — ikke unnskyldende, ikke overtalende.

3. Lenken går til eksisterende utmeldingsflyt. **Ingen ny rute.**

4. Legg til en kort setning om at reisen er levert når koblingen skjer lørdag. Brukeren skal vite det før, ikke etter.

5. Ingen bekreftelsesdialog med skremmende språk. Melder hun seg ut, skal det være enkelt.

**Verifikasjon:**
```bash
grep -c "melde deg ut\|pengene tilbake" components/dashboard/WaitingForMatch.tsx  # >= 1
grep -rn "journey/exit" components/dashboard/WaitingForMatch.tsx                  # >= 1
npm run verify:api                     # exit 0 — ingen brutte kall
npm run verify:lang                    # exit 0
npx tsc --noEmit
npm run build
```

**State-oppdatering:** `completedSteps += ["3.2"]`, `lockedSteps += ["3.2"]`, `currentStep = "3.3"`

**Rollback:** `git restore components/dashboard/WaitingForMatch.tsx`

**Commit-mal:** `feat(dashboard): angrerett som nedtonet lenke i venterommet`

---

### STEG 3.3 — Sluttverifikasjon og overlevering

**Formål:** Bekrefte at runde A og B er ferdige, og overlevere til runde C.

**Avhengighet:** `3.2` locked.

**Risiko:** Lav.

**Filanker:** `docs/ACT-STATE-v8.json`, ny fil `docs/ROUND-C-HANDOVER.md`

**Instruks:**

1. Full verifikasjon:
   ```bash
   npx tsc --noEmit
   npx prisma format --check
   npx jest
   npm run build
   npm run verify:api
   npm run verify:lang
   ```

2. Justert vokterkontroll:
   ```bash
   git diff --stat 88d5ad8..HEAD -- lib/matching/ lib/journey/ prisma/
   ```
   **Krav: tom.** `config/matching.ts` er unntatt fordi steg 2.1 endret den med hensikt.

   Kontroller den separat:
   ```bash
   git diff 88d5ad8..HEAD -- config/matching.ts
   ```
   **Krav: kun `MIN_COHORT_SIZE` og kommentarer.** Er `MIN_SCORE` endret, **stopp og rapporter.**

3. Tailwind-kontroll på nytt — bekreft at breakpoints fortsatt genereres etter alle endringene.

4. Skriv `docs/ROUND-C-HANDOVER.md` med:

   **Ferdig i v8:**

   | Sak | Steg |
   |---|---|
   | Tailwind leser konfigurasjonen | 1.1 |
   | Radiussperren virker | 1.2 |
   | Radius observert i drift | 1.3 |
   | Kohortterskel til 2 | 2.1 |
   | Ukentlig matcherunde | 2.2 |
   | Utmelding før runden | 2.3 |
   | Venterom uten nedtelling | 3.1 |
   | Angrerettlenke | 3.2 |

   **Til runde C — tekst som må skrives før ACT v9:**

   | Sted | Fil:linje | Hva som er galt |
   |---|---|---|
   | Landingsside | `app/(landing)/page.tsx:122-123` | «Match innen 24 timer» |
   | Hero | `components/ui/layout/Hero.tsx:46-47` | Samme, i ubrukt `keyPoints` |
   | Slik fungerer det | `app/slik-fungerer-det/page.tsx:66-67` | «Én match innen 24 timer» |
   | Pris | `app/priser/page.tsx:365` | 349 kr — betaling er sperret |
   | Pris | `app/(landing)/page.tsx:299, :346` | Samme |
   | Pris | `app/betaling/page.tsx:5` | Samme |
   | Vilkår | `app/vilkår/page.tsx:140` | Pris og reisebeskrivelse |
   | Vilkår | `app/vilkår/page.tsx:154` | Skrivefeil «Bildefdeling» |

   **Til runde C — funksjonalitet:**
   - Rapporteringsfunksjon (finnes ikke i dag)
   - Beskjed når ingen match finnes
   - Vilkår med ordensregler
   - Personvern mot GDPR

   **Menneskeoppgaver, uendret:**
   - 144 spørsmål, Sentry-DSN, ekstern monitor, gjenopprettingstest, visuell kontroll i tre bredder

5. Sett `currentStep` til `null` og skriv `finalVerification`.

**Verifikasjon:**
```bash
git diff --stat 88d5ad8..HEAD -- lib/matching/ lib/journey/ prisma/   # tom
jq -r '.pendingSteps | length' docs/ACT-STATE-v8.json                 # 0
jq -r '.currentStep' docs/ACT-STATE-v8.json                           # null
test -f docs/ROUND-C-HANDOVER.md && echo OK
```

**State-oppdatering:** `finalVerification = {…}`, `completedSteps += ["3.3"]`, `lockedSteps += ["3.3"]`, `currentStep = null`

**Rollback:** `rm docs/ROUND-C-HANDOVER.md`

**Commit-mal:** `docs(act): sluttverifikasjon v8 og overlevering til runde C`

---

# 5. Locking-regler

## 5.1 Når et steg er ferdig

Skriv nøyaktig:

```
Steg X.Y er nå locked. Ikke endre dette senere.
```

Legg steget i `lockedSteps`. Vent på godkjenning før neste.

## 5.2 Hva locking betyr

Et locked steg er ferdig. Ikke endre filene det berørte, ikke «forbedre», ikke rett stil i etterkant.

Ser du et problem i et locked steg: **skriv det i `errors` og fortsett.**

## 5.3 Eneste unntak

Ordren `Lås opp steg X.Y` fra George.

---

# 6. Stop-regler

## 6.1 Absolutte stopp

1. **Endring i `lib/matching/`** — under enhver omstendighet
2. **Endring i `lib/journey/`**
3. **Endring av `MIN_SCORE`**, vekter eller scoringlogikk
4. **Migrasjon** eller endring i `prisma/schema.prisma`
5. **Ny API-rute**
6. **Ny avhengighet** i `package.json`
7. **Endring av API-kontrakt** på eksisterende rute
8. **Endring av fasedefinisjon**
9. **Tekstendringer på offentlige sider** — det er runde C
10. **Endring av helsesjekken** — bygget i v6, utenfor omfang

## 6.2 Alminnelige stopp

11. Filen i filankeret finnes ikke, eller avviker fra beskrivelsen
12. `npx tsc --noEmit` gir feil
13. `npm run build` feiler
14. `verify:api` eller `verify:lang` gir exit 1
15. En test som var grønn blir rød
16. En `grep`-verifikasjon gir uventet resultat
17. Instruksen er tvetydig og du må gjette
18. Visuell kontroll i steg 1.1 avdekker noe brutt
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
- Ikke juster en terskel for å oppfylle et kriterium
- Ikke deaktiver en test som feiler
- Ikke legg til `// @ts-ignore` eller `any`
- Ikke utvid omfanget for å komme rundt et problem
- Ikke rett visuelle ting du synes ser rart ut

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

Deretter stegets egen verifikasjon.

## 7.2 Vokterkontroll

**Steg 0.1 til 1.3:**
```bash
git diff --stat 88d5ad8..HEAD -- lib/ prisma/ config/matching.ts
```
Krav: tom.

**Fra og med steg 2.1:**
```bash
git diff --stat 88d5ad8..HEAD -- lib/matching/ lib/journey/ prisma/
```
Krav: tom. `config/matching.ts` kontrolleres separat og skal kun vise `MIN_COHORT_SIZE` og kommentarer.

## 7.3 Hva som teller som bestått

| Sjekk | Krav |
|---|---|
| tsc | 0 feil |
| build | Grønn |
| jest | ≥ 129, alle grønne |
| verify:api | exit 0 |
| verify:lang | exit 0 |
| Vokterkontroll | Tom |
| Sjekk 9 | Målingen kan gi et annet svar |

## 7.4 Sjekk 9

Regelen fra v7 gjelder uendret: **før en måling godtas som bevis, skal det være vist at den kan gi et annet svar.**

| Steg | Hvordan den oppfylles |
|---|---|
| 1.1 | `md:`, `lg:`, `hover:` går fra 0 til N i bygget CSS |
| 1.2 | Utpakkingen finnes — bevises i 1.3 |
| 1.3 | `rejectReasons.radius` går fra 0 til N |
| 2.1 | `grep` viser 2, ikke 20 |
| 2.2 | `jq` viser `0 2 * * 6` |
| 2.3 | Test viser at utmeldt bruker faller ut, og at ikke-utmeldt består |
| 3.1 | `grep` finner «lørdag», ikke nedtelling |
| 3.2 | `verify:api` grønn, lenken peker på ekte rute |
| 3.3 | Vokterkontrollen er tom |

En teller som alltid gir null beviser ingenting.

---

# 8. Avslutning

## 8.1 Full verifikasjon

Når alle 11 steg er locked, kjør del 7.1 og 7.2 i sin helhet.

## 8.2 Driftobservasjon

Steg 1.3 skal ha vist radius-telleren i bevegelse, med minst seks årsaker representert og null radiusbrudd blant opprettede par.

## 8.3 Oppdatert lanseringsvurdering

Masterplan v7.0 satte 83 % for lukket beta og 68 % for offentlig lansering. De to tallene var lave nettopp fordi Tailwind og radius var åpne.

Er begge lukket og kadensen innført, bør beta-tallet stige merkbart. Rapporter et nytt anslag med begrunnelse per endring.

**Rapporter ærlig.** Er et steg delvis gjennomført, skriv det. Er en verifikasjon hoppet over, skriv det. Ser noe visuelt rart ut etter Tailwind-fiksen, skriv det — selv om det ikke er en feil du skulle rette.

## 8.4 Sluttstate

```json
{
  "currentStep": null,
  "completedSteps": ["0.1","0.2","1.1","1.2","1.3","2.1","2.2","2.3","3.1","3.2","3.3"],
  "lockedSteps":    ["0.1","0.2","1.1","1.2","1.3","2.1","2.2","2.3","3.1","3.2","3.3"],
  "pendingSteps": [],
  "finalVerification": {
    "tsc": "0 feil",
    "jest": "<faktisk>",
    "build": "grønn",
    "verifyApi": "exit 0",
    "verifyLang": "exit 0",
    "tailwindBreakpoints": "<N>",
    "radiusRejections": "<N>",
    "guardCheck": "tom — lib/matching, lib/journey, prisma urørt"
  },
  "nextRound": "Runde C — offentlige flater. Se docs/ROUND-C-HANDOVER.md",
  "updatedAt": "<ISO>"
}
```

## 8.5 Hva som kommer etter

Runde C krever ferdigskrevet tekst. Den kan ikke utføres av en modell som skal formulere underveis — hver setning ville utløst en beslutning uten mandat.

`docs/ROUND-C-HANDOVER.md` fra steg 3.3 lister nøyaktig hvilke steder som må ha ny tekst. Når teksten er skrevet, lages ACT v9 med den ferdige teksten som noe som settes inn.

---

*TOSOM-ACT-INSTRUKS-v8.0 — 11 steg, 4 bølger, basert på TOSOM-MASTERPLAN-v7.0 ved commit `88d5ad8`.*
