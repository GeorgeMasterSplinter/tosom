# TOSOM — Livsstil & verdier 2026 (onboarding + matchmotor)

**Dato:** 2026-10-18
**Status:** Godkjent av George 18.10.2026 — i gjennomføring (WP0–WP7).
**Kanonisk kilde:** `TOSOM-SUPER-MASTERPLAN-v2.0.md`
**Arbeidsmetode:** `ACT-PIPELINE-v1.0.md` — ett steg om gangen, patch-format, verifisering mellom hver.
**Relatert:** `FORSKNINGSMOTOR-v1.0.md` (prinsippet «skalaer måler, fritekst forteller»), `docs/reference/matching-dimensions.md`

---

## 0. Hvorfor dette dokumentet

To ting samlet i én sak, besluttet av George:

1. **Onboarding fraviker.** Dagens flow har ~28 *blokkerende* fritekstfelt (min 10 tegn)
   fordelt på stegene. Folk stopper opp når de ser store tomme bokser — mange fullfører
   aldri. Vi kutter >50 % av friteksten og bytter til «flere valg»-spørsmål
   (1 av N / flervalg / skala), slik at det er trykk-lett å fullføre.
2. **Motoren får 2026-Norge-data + høyde.** Verdifeltene i motoren mangler det som
   faktisk former en hverdag i Norge i 2026 (bil, kosthold, klima, alkohol, hverdags-
   og arbeidsrytme m.m.), og høyde samles inn, men brukes ikke.

**Én regel styrer: motoren blir mer presis, ikke annerledes i natur.** Ingen av
invariantene brytes; vekter og terskler røres ikke (DI-2).

---

## 1. Beslutninger (George, 18.10.2026)

| # | Beslutning |
|---|-----------|
| **D-1** | **Høyde: Alternativ A — hard standardregel.** Et mann–kvinne-par avvises når mannen er **≥ 5 cm kortere** enn kvinnen. Gjelder kun par der begge kjønn er `man`/`kvinne` (etter `normalizeGender`); ikke-binær/ukjent kjønn → ingen gate. Manglende høyde på én eller begge → blokkerer **aldri** (mønstret fra radius). Terkel: `HEIGHT_GAP_CM = 5` i `lib/matching/dealbreaker.ts`. |
| **D-2** | Nye 2026-valg plasseres i **eksisterende steg** 2b (Livssituasjon) og 5a (Livsstil & verdier). **Ingen nye steg** — antall steg (13) endres ikke. |
| **D-3** | `partnerMustUnderstand` (Grenser) blir **valgfri**. (Besluttet av agent: feltet er et av de tyngste i onboarding; ERQ-6 + grense-gridene bærer sikkerhetsdataene.) |
| **D-4** | Vektmodellen med 3 nivå: **«Er ikke så viktig»** (ingen effekt) / **«Bør stemme»** (scoring i livssituasjon) / **«Må stemme»** (hard dealbreaker der vektmodellen gjelder). |
| **D-5** | Fritekst-konverteringen i §3 godkjent: ~15 fritekstfelt igjen (mesteparten valgfrie/korte), ~26 konvertert til valgfelt. |

**Motor-godkjenning:** Endringen av dealbreaker-listen (høyde + livsstil-2026) og den
utvidede livssituasjon-scoringen er Georges eksplisitte godkjenning 18.10.2026.
`DIMENSION_WEIGHTS` (6 dimensjoner) og resonanstersklene (80/65/50/40) er **urørt**.

---

## 2. De nye 2026-feltene

### 2.1 Hverdagen (nytt innhold i steg 2b — Livssituasjon)

| Felt-nøkkel | Spørsmål | Verdi(mulig) | Vekt-modell |
|---|---|---|---|
| `arbeidsrytme` | Hvordan ser jobben din ut? | `kontorbundet` · `hybrid` · `hjemmearbeid` · `skift` | scoring |
| `bosted` | Hvor trives du? | `sentrum` · `forstad` · `land` · `ubestemt` | scoring (`ubestemt` = ingen data) |
| `reiser` | Hvordan reiser du? | `fjell-bobil` · `utlandet` · `naturen-naermest` · `lite-reising` | scoring |
| `dyr` | Hva med dyr? | `hund` · `katt` · `annet-dyr` · `ingen` | **vekt-modell** (`dyrViktig`) |
| `skjerm` | Hvordan er det med skjerm? | `mye` · `moderat` · `vil-skru-ned` · `ubestemt` | scoring (`ubestemt` = ingen data) |

### 2.2 Livsstil & verdier (nytt innhold i steg 5a)

| Felt-nøkkel | Spørsmål | Verdi(mulig) | Vekt-modell |
|---|---|---|---|
| `bil` | Hvordan kommer du deg rundt? | `full-el` · `phev` · `bensin` · `diesel` · `esykkel-ingen` | **vekt-modell** (`bilViktig`) |
| `kosthold` | Hvordan spiser du? | `spiser-koett` · `fleksitar` · `vegetar` · `vegan` · `fisk` | **vekt-modell** (`kostholdViktig`) |
| `klima` | Hvor viktig er klima og miljø? | `veldig-viktig` · `viktig` · `ikke-stor-sak` | ordinal-scoring |
| `alkohol` | Hvordan er det med alkohol? | `aldri` · `sjelden` · `helligdager` · `ofte` | **vekt-modell** (`alkoholViktig`) |
| `aktivitet` | Hvor aktiv er du? (maks 3) | `gym` · `lop-turer` · `lagidrett` · `natur-fritid` · `lite` | scoring (Jaccard) |

**Vekt-modell (D-4):** de fire feltene `bil`, `kosthold`, `alkohol`, `dyr` får et
tilhørende viktighetsvalg (nøkkler `bilViktig`, `kostholdViktig`, `alkoholViktig`,
`dyrViktig`) med verdiene:

- `ikke-viktig` — «Er ikke så viktig» → feltet utelates fra scoring og blokkerer aldri.
- `bor-stemme` — «Bør stemme» → feltet inngår i livssituasjon-scoringen.
- `ma-stemme` — «Må stemme» → konflikt i kompatibilitetsmatrisen (§4.2) avviser paret
  som dealbreaker — uavhengig av resonansscore.

---

## 3. Fritekst → interaktivt (godkjent kuttliste)

Prinsippet fra FORSKNINGSMOTOR gjelder: **skalaer måler, fritekst forteller.**
Fritekst beholdes kun der den gir *varme i profilen* (det partneren leser) — ikke der
den skal bære scoring. De 5 skalastegene (44 items) er urørt.

| Steg | Fra | Til |
|---|---|---|
| 2a Personlighet | `selfDesc` (påkr.), `energyGiver` (påkr.), `energyDrainer` (påkr.), `pressureReact` (påkr.), `quirk` (påkr.) | `selfDesc` **beholdes** (bio, påkrevd). `energyGiver`/`energyDrainer` → flervalg (maks 3). `pressureReact` → 1 av 4. `quirk` → valgfri kort. |
| 2b Livssituasjon | `responsibilities` (påkr.), `dailyRoutine` (påkr.) | `responsibilities` → flervalg-grid (hvem tar du omsorg for). `dailyRoutine` → 1 av 3 (slik starter dagen). + de 5 nye 2026-feltene (§2.1), alle valfrie. |
| 3 Tilknytning | 5 fritekst (alle påkr.) | `safetyNeed`/`insecurityTrigger` → flervalg (maks 3). `sadnessNeed`/`stressNeed` → 1 av N. `importantBoundary` → valgfri kort. |
| 4 Kjærlighetsspråk | `closenessBuilder`, `distanceCreator`, `smallThing` (alle påkr. fritekst) | `closenessBuilder`/`distanceCreator` → 1 av 4. `smallThing` → valgfri kort. (`loveGive`/`loveReceive` var allerede valg-grid.) |
| 5a Livsstil & verdier | `goodEveryday` (påkr.) | **Beholdes** — det ene «varme»-feltet i steget. + de 5 nye 2026-feltene (§2.2), alle valfrie. |
| 5b Relasjonsstil | `independenceBalance` (påkr. fritekst) | Valgfri kort (valg-gridet `closenessNeed` bærer scoringen). |
| 6 Framtid & visjon | 5 fritekst (alle påkr.) | `futureVision`/`experienceAlone`/`experienceTogether` → 1 av 4. `dreamGoal` → valgfri kort. `buildTogether` **beholdes** (varme, påkrevd kort). |
| 8a Grenser | `limitations` (påkr.), `partnerMustUnderstand` (påkr.) | Begge → **valgfrie** (D-3). De to valg-gridene er urørt. |
| 8b Moden nysgjerrighet | 5 fritekst (alle påkr.) | `intimacySafety`/`comfortableWith`/`nearerType`/`needsTime` → 1 av 4. `boundary` → valgfri kort. (ERQ-6 skala er urørt.) |

**Resultat:** 3 påkrevde fritekstfelt igjen (`selfDesc`, `goodEveryday`,
`buildTogether`) + ~10 valgfrie korte. ~26 felt konvertert til valg. Steg 7
(Kommunikasjon) var allerede en ren skala — urørt.

**Oppsummeringssteget** (steg 11) får en ny seksjon «Hverdag 2026» og
verdi→etikett-kartlegging for alle nye/konverterte felt.

**Død data:** `app/onboarding/data/questions.ts` importeres av ingen (verifisert med
grep). Flyttes til `archive/` ved WP6.

---

## 4. Motorimplementering

### 4.1 Datagrunn

- Nye felt sendes i onboarding-payload som seksjon **`livsstil2026`** og lagres i
  **`Profile.preferences` (Json)** — eksisterende kolonne som i dag er ubrukt.
  **Ingen Prisma-migrasjon** (viktig under beta; SAK 7 gjelder uendret).
- De konverterte feltene (energyGiver m.m.) lagres i **samsøyle som i dag** — verdiene
  blir nå valg-verdier i stedet for setninger. Server-skjemaet (Zod) slapper av
  min-lengdene for konverterte felt; `selfDesc`, `goodEveryday` og `buildTogether`
  beholder min 10.
- Eksisterende betabrukere: nye felt er valfrie i motoren (mangler → nøytralt 50 /
  blokkerer aldri). Prefill av nye felt når en fullført bruker går inn i onboarding
  på nytt (via `toOnboardingData`).

### 4.2 Dealbreakere (harde filtre)

Kjører før scoring — i **både** `lib/matching/dealbreaker.ts` (full sjekk) og
`lib/matching/cheapFeatures.ts` (prekalkulat hot path i matcherunden). Rekkefølgen i
`cheapSjekkAll` må speile `sjekkAlleDealbreakers` nøyaktig (ekvivalens er testet i
`__tests__/matching-score-round.test.ts`).

| # | Sjekk | Regel | Datakilde |
|---|---|---|---|
| ny | **Høyde (D-1, symmetrisk)** | Kun mann–kvinne-par. Avvis hvis `kvinneHøyde − mannHøyde ≥ 5 cm`. Manglende høyde/kjønn → blokkerer aldri. | `lifestyle.height` + `lifeSituation.gender` |
| ny | **Livsstil 2026 (D-4, symmetrisk)** | For `bil`, `kosthold`, `alkohol`, `dyr`: hvis **minst én part** har satt `ma-stemme` og begge har verdi, og verdien ligger **ikke** i den andres kompatibilitetssett (i retning A→B eller B→A) → avvis. | `preferences.livsstil2026` |

**Kompatibilitetsmatriser** (verdien er kompatibel med settet; konflikt = ikke med i
settet i noen retning):

| Felt | Kompatibilitetssett |
|---|---|
| `kosthold` | `spiser-koett` ↔ {spiser-koett, fleksitar} · `fleksitar` ↔ {spiser-koett, fleksitar, vegetar, vegan, fisk} · `vegetar` ↔ {vegetar, fleksitar, vegan, fisk} · `vegan` ↔ {vegan, vegetar, fisk} · `fisk` ↔ {fisk, vegetar, vegan, fleksitar} |
| `bil` | `full-el` ↔ {full-el, phev, esykkel-ingen} · `phev` ↔ {alle} · `bensin` ↔ {bensin, diesel, phev, esykkel-ingen} · `diesel` ↔ {diesel, bensin, phev, esykkel-ingen} · `esykkel-ingen` ↔ {alle} |
| `alkohol` | `aldri` ↔ {aldri, sjelden} · `sjelden` ↔ {sjelden, aldri, helligdager} · `helligdager` ↔ {helligdager, sjelden, ofte} · `ofte` ↔ {ofte, helligdager} |
| `dyr` | `hund` ↔ {hund, annet-dyr, ingen} · `katt` ↔ {katt, annet-dyr, ingen} · `annet-dyr` ↔ {alle} · `ingen` ↔ {alle} (enkelt hardt konflikt: hund vs. katt) |

Avvisningsårsaker: `Høyde: …` → nøkkel `hoyde`; `Livsstil 2026: …` → nøkkel
`livsstil2026` (begge legges til `REJECT_REASON_KEYS` sist, som `barn` ble det —
admin ser avvisningene i matcherunden, M-12).

### 4.3 Scoring (livssituasjon-dimensjonen, vekt 0,10 — urørt)

`scoreLifeSituationCompat` i `lib/matching/dimensions.ts` utvides med de nye feltene.
Mønstret fra i dag gjeldes: **mangler data hopper vi over feltet** (ikke nøytral
50, ikke straff), og den vektede summen normaliseres over det som faktisk finnes.

| Felt | Metode | Vekt i dimensjonen |
|---|---|---|
| `wantChildren` / `children` / `smoking` / `lifestyleType` | uendra (0,4 / 0,2 / 0,2 / 0,1) | 0,9 |
| `bil`, `kosthold`, `alkohol`, `dyr` | Jaccard/`categoryMatch` — **skjermes av viktighetsvalget**: «ikke så viktig» hos én part → feltet utelates; ellers med når begge har verdi | 0,06 / 0,06 / 0,05 / 0,04 |
| `klima` | ordinal: 100 / 75 / 50 etter trinn-forskjell (veldig-viktig→viktig→ikke-stor-sak) | 0,06 |
| `aktivitet` | Jaccard (flervalg) | 0,05 |
| `arbeidsrytme` · `bosted` · `reiser` · `skjerm` | `categoryMatch`; `ubestemt` behandles som manglende | 0,05 / 0,05 / 0,04 / 0,04 |

Eldre profiler uten `preferences.livsstil2026` scorer nøyaktig som i dag (alle nye
felt hopper over → `weightSum` uendret).

---

## 5. Hva som IKKE endres

| Område | Hvorfor |
|---|---|
| `DIMENSION_WEIGHTS` (6 dimensjoner) og resonansterskler (80/65/50/40) | DI-2 — urørt |
| De 5 skalastegene (BFI-10, ECR-12, PVQ-10, Komm-6, ERQ-6) | Forskningsgrunnlaget |
| Antall onboarding-steg (13) | D-2 |
| Kjønn/alder/barn/radius/grenser-dealbreakere | Fungerer |
| `I-12` (brukeren ser ord, aldri tall) | Resonansnivå uendret; høyde/gap vises aldri for brukeren |
| Reisen, chat, kvote | Berøres ikke |

---

## 6. Arbeidspakker og verifisering

| WP | Innhold | Status |
|----|---------|--------|
| WP0 | Dette dokumentet | ✅ |
| WP1 | Datagrunn: Zod-skjema (`livsstil2026`), setup-rute → `preferences`, prefill, tester | ⏳ |
| WP2 | Onboarding-UI: konverteringene (§3) + nye 2026-grid-er (§2) + viktighetsvalg + oppsummering | ⏳ |
| WP3 | Motor: livssituasjon-scoring (§4.3) + tester | ⏳ |
| WP4 | Motor: dealbreakere (§4.2) i `dealbreaker.ts` + `cheapFeatures.ts` + avvisningsnøkler + tester | ⏳ |
| WP5 | Eksisterende brukere: prefill-verifisering + innstilling til oppdatering | ⏳ |
| WP6 | Dokumentasjon: `matching-dimensions.md`, `ACT-STATE.json`, arkiver `questions.ts` | ⏳ |
| WP7 | Sluttkontroll: full tsc + jest + `verify:lang` + build + e2e + manuell dev-test (to profiler, matcherunde) | ⏳ |

Verifisering etter hver patch: `npx tsc --noEmit` + berørte tester. Etter hvert WP:
full `npx jest --ci --silent`. Etter WP7: `npm run build` + Playwright +
manuell test på `npm run dev` før push.
