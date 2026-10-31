# TOSOM — ONBOARDING O2 FIELD AUDIT — PLAN
## Kartlegging av felt + matching-verdi + forenkling (PLAN KUNNE, ingen implementasjon)

**Dato:** 2026-10-30
**Commit:** `e31620d` (HEAD = origin/main)
**For:** George, Qwen, Cline
**Arbeidsmetode:** `ACT-PIPELINE-v1.0.md` (gjelder uendret)
**Kanonisk kilde:** `docs/TOSOM-SUPER-MASTERPLAN-v2.0.md` + `CANONICAL-PRODUCT-TRUTH` (frossen)
**Status:** PLAN ONLY — ingen felt slettes, ingen matching endres, ingen commit/push/deploy.
**Ikke rørt:** `docs/IDENTITY-TRUST-PLAN-v1.0.md` (ubehandlet i tree-en, endres ikke).

> Mål med O2: **faster onboarding, mindre skriving, klarere valg, mindre redundant
> data, bedre matching-signal, mobilvennlig interaksjon.** Strukturerte valg
> (single/multi-select, viktighet/må-stemme) fremfor fritekst der strukturert
> data uttrykker samme mening.

---

## 3. PRE-FLIGHT (bekreftet)

| Sjekkpunkt | Resultat |
|---|---|
| Hoved-branch | `main` = `origin/main` = `e31620d` («feat: open Tosom to adults 18 and align product truth») |
| Produksjon | `tosom.no` → HTTP 307 → `www.tosom.no` → **HTTP 200** |
| Deployet SHA | `e31620d` (A18 + Canonical Product Truth) |
| Working tree | Rens — kun ubehandlede filer: `docs/IDENTITY-TRUST-PLAN-v1.0.md`, `tmp/` |
| Frossen: A18 | `MIN_AGE = 18` (`config/legal.ts`), alderspreferanse default **18–40** (prefylt), øvre grense **99+ = null** |
| Frossen: CPT | 18+ · journey **14 dager** (`JOURNEY_TOTAL_DAYS`) · bilde **dag 8** (`PHOTO_REVEAL_DAY`) · matching **hver lørdag 02:00–04:00 UTC** (`cron 0 2,3,4 * * 6`) · Bli Kjent **180** (12×15) · Oppgaver **135** (9×15) |
| Frossen: O1 / Bli Kjent V2 / Oppgaver V2 | Deployet — endres ikke i denne planen |

**Hovedregel for hele planen:** Koden vinner over dokumentasjonen. Alt under er
sporet mot faktisk kode (kjørende konsumenter), ikke antatt hensikt.

---

## A. EXECUTIVE SUMMARY

Målt mot `e31620d` (main). Siffer i parentes = antall live-felt i onboarding.

1. **Totalt antall live-innslag: 129** — **71 påkrevd** (stemmer nøyaktig med
   O1-baseline) / **58 valgfri**. Oppgavens baseline var 123 (71/52); avviket på
   6 valgfrie felt er en tellingskonvensjon for de 9 «Viktig»-vektkontrollene under
   Livsstil-2026. Full felt-for-felt-inventar i §C gjør tellingen gjennomsiktig.
2. **Matching styres kun av et lite sett felt.** De 6 skåredimensjonene
   (values .25 · attachment .25 · personality .15 · communication .15 ·
   emotionRegulation .10 · lifeSituation .10) spises av **49 skalasvar** +
   `children`/`wantChildren`/`smoking`/`lifestyle`. Dealbreakere spiser i tillegg
   `gender`/`seekingGender`, `age`/`agePref`, `height`, `religion`/`acceptedReligions`/
   `religionOpen`, `distancePref`/`postalCode`, og de 9 «må-stemme»-feltene i
   Livsstil-2026. **Alt annet (de meste fritekstfeltene) er PROFILE-ONLY.**
3. **Ingen av fritekstfeltene vises til partneren.** Den partner-visbare bioen er
   `Profile.bio`, som onboarding **nå fyller ut** (blir null). Partneren ser
   navn + alder + resonanspoeng + (tom) bio + bilde (dag 8). Fritekst brukes
   derfor **kun i brukerens egen oppsummering** — ikke i matching, ikke i
   partnerprofil.
4. **Påkrevd fritekst = 3** (`selfDesc`, `goodEveryday`, `buildTogether`). Alle
   tre er PROFILE-ONLY (egen oppsummering), ingen matching, ikke partner-synlig.
   Dette støtter Georges retning: ingen påkrevd fritekst uten demonstrert behov.
5. **«Hvem er du når ting flyter naturlig?» = `selfDesc`** (påkrevd, min 10 tegn,
   lagres i `personality.selfDesc`). Ingen matching-konsument, ingen partner-visning,
   kun egen oppsummering. Sletter du den, mister du bare én «selvgjennomgang»-linje
   i oppsummeringen. **Anbefaling: slett eller gjør valgfri** (§8).
6. **Samlet men IKKE lagret (kastet bort):** `moden`-seksjonens 5 felt
   (`intimacySafety`, `comfortableWith`, `boundary`, `nearerType`, `needsTime`)
   samles inn og vises i oppsummeringen, men `setup`-ruten persisterer dem **ikke**
   (0 referanser). `bestSelf` er i data-modellen men **renderes i inget live-steg**.
   Brukerarbeid går i vaskemaskinen (§T).
7. **Døde felt (skjema + lagringsplass, ingen live-UI, ingen matching):** de 10
   «preferanser»-feltene (`dietPreference`, `sleepSchedule`, `pets`, `travelFreq`,
   `alcoholFreq`, `ambitionLevel`, `structureSpontaneity`, `introExtrovert`,
   `politicsImportance`, `religionImportance`) + 5 humor-fritekster
   (`laughterTrigger`, `quirkyHabit`, `guiltyPleasure`, `totallyYou`,
   `partnerWouldLaugh`). Step7 renderes kun som COMMUNICATION-skala i dag (§T).
8. **Religion: BILATERAL hard matching = ALIGNED.** Egen religion (opptil 4) +
   akseptliste (opptil 4) + «Åpen for alle». Tostidig hard regel; manglende =
   ingen begrensning. Flere identiteter = **minst én overlap aksepterer** (§G).
9. **Barn/bonusfamilie = PARTIALLY SUPPORTS (gap).** «Åpen for bonusfamilie» er i
   dag en **token inne i `wantChildren`**, kun scorepluss (+10) — **ingen hard
   grense, ingen eget felt for «åpen for partner med barn»**. Georges 4-dimensjone
   modell (har/ønsker/åpen-for-bonus/må-stemme) støttes ikke i fullhet (§H–I).

**Bunnlinje:** O2 kan fjerne betydelig friksjon (3 påkrevde essays, 8 valgfrie
fritekster, 15+ døde/mislagede felt, 2 tvilsomme livssituasjon-felt) **uten å
røre matching-signalet**, fordi matching ikke leser noen av dem. Religion holdes
fast. Barn/bonusfamilie krever et lite, trygt datamodell-tillegg (O2-B).

---

## B. CURRENT FIELD ARCHITECTURE

**13 steg** (renderStep i `OnboardingFlow.tsx`), index 0–12:

| # | Komponent | Tittel | Felt (live) |
|---|---|---|---|
| 0 | `Step1Profile` | Grunnprofil | 18 |
| 1 | `Step2Personlighet` | Personlighet & identitet | 5 + 15 skala |
| 2 | `Step2Livssituasjon` | Livssituasjon | 4 + 10 l2026 + 2 |
| 3 | `Step3Tilknytning` | Tilknytning & trygghet | 5 + 12 skala |
| 4 | `Step4Kjærlighetsspråk` | Kjærlighetsspråk & nærhet | 5 |
| 5 | `Step5LivsstilVerdier` | Livsstil & verdier | 5 + 9 l2026 + 10 skala |
| 6 | `Step5Relasjonsstil` | Relasjonsstil | 3 |
| 7 | `Step6FramtidVisjon` | Framtid & visjon | 5 |
| 8 | `Step7HumorPersonlighet` | Kommunikasjon & tilpasning | 6 skala (kun) |
| 9 | `Step8Grenser` | Grenser & behov | 4 |
| 10 | `Step8ModenNysgjerrighet` | Moden nysgjerrighet | 5 + 6 skala |
| 11 | `Step9Oppsummering` | Oppsummering | 0 (gjennomgang) |
| 12 | `Step10StartReisen` | Start reisen | 0 (CTA) |

**Flatt data-modell:** `OnboardingFlow.ProfileData` (Record<string,unknown>). Flere
nøkler er **legacy** (`firstName`, `seeking`, `maxDistance`, `minAge`, `maxAge`,
`location`, `bestSelf`, `energy/drain/pressure/habits`) — sendes i payload men
spesifikke er ikke lenger rendert/persistert.

**To døde definisjoner (ikke i live-flyten):**
- `app/onboarding/data/questions.ts` (`allSteps`, 10 steg) — **0 importer**. Død.
- `preferanser`-seksjonen i Zod (`onboardingSetupSchema`) — ingen live-steg samler
  inn noen av de 10 feltene (grep over alle steg = 0 treff). `politicsImportance` /
  `religionImportance` sendes som default `5`, men brukes ikke i matching.

**Lagringskort (Profile-modellen, `prisma/schema.prisma`):**
JSON-kolonner `lifeSituation`, `lifestyle`, `personality`, `communication`,
`intimacy`, `futureVision`, `boundaries`, `emotionalNeeds`, `deepProfileData`,
`preferences.livsstil2026`, `psychometricAnswers` + beregnede `bigFive`,
`attachment`, `valueProfile`, `emotionRegulation`. `maturityLevel`/`securityLevel`
skrives **null** (PL-10: syntetiske verdier fjernet).

**Skoring (`unifiedScorer.ts`) — 6 dimensjoner, vekt sum 1.0:**

| Dimensjon | Vekt | Kilde |
|---|---|---|
| values | 0.25 | `valueProfile` (PVQ-10, 10 items) |
| attachment | 0.25 | `attachment` (ATTACHMENT, 12 items) |
| personality | 0.15 | `bigFive` (TOSOM_PERSONALITY V2, 15 items; kun når begge = v2) |
| communication | 0.15 | `communicationScores` (COMMUNICATION, 6 items) |
| emotionRegulation | 0.10 | `emotionRegulation` (ERQ-6, 6 items) |
| lifeSituation | 0.10 | `wantChildren` .4 · `children` .2 · `smoking` .2 · `lifestyle` .1 · 10 l2026-felt (0.04–0.06) · +10 bonusfamilie |

**49 skalasvar:** TOSOM_PERSONALITY 15 + ATTACHMENT 12 + PVQ10 10 + ERQ6 6 +
COMMUNICATION 6 = **49** (`ALL_ITEMS`/`TOTAL_ITEMS`). Alle 49 er påkrevd
(server `psychometricsSchema`) og alle 49 spises av de 5 psykom. dimensjonene.

**Dealbreaker-kjede (`sjekkAlleDealbreakers`, reprodusert i `cheapSjekkAll`):**
1 kjønn → 2 alder → 3 barn (Ja vs Nei) → 4 høyde → 5 Livsstil-2026 «må-stemme» →
6 livsrytme → 7 ekspl. preferanser → 8 grenser → 9 radius → 10 religion.
Returnerer den **første** treffende grunnen. Religion kjører FØR scoring: ingen
score overstyrer.

---

## C. FIELD INVENTORY (alle 129 live-felt)

**Kolonnelegende.**
- *Type (max):* select / multi (maks) / tekst (maks) / skala / slider / toggle.
- *Matching:* **HB** = hard boundary (dealbreaker) · **SC x.xx** = score-dimensjon + vekt · **PROF** = kun profil/oppsummering · **—** = ingen konsument i dag.
- *Partner:* vises til den matchede partneren? · *Ops.:* vises i brukerens egen oppsummering (steg 11) · *Prefill:* pre-fylles fra DB ved ny onboarding (`toOnboardingData`).

### Steg 0 — Grunnprofil (`Step1Profile`, `basicProfileSchema`)

| Felt | Type (maks) | Påkr. | Lagres i | Matching | Partner | Ops. | Prefill | Klassif / verdi |
|---|---|---|---|---|---|---|---|---|
| `identityName` | tekst (50) | **J** | `Profile.identityName` | — | **J** (navn) | J | J | KEEP / HIGH |
| `age` | tall (18–99) | **J** | `Profile.age` | HB (alder) | **J** | J | J | KEEP / HIGH |
| `gender` | select 1 | **J** | `lifeSituation.gender` | HB (kjønn) | J | J | J | KEEP / HIGH |
| `seekingGender` | select 1 | **J** | `lifeSituation.seekingGender` | HB (søk) | J | J | J | KEEP / HIGH |
| `height` | tall (100–250) | N | `lifestyle.height` | HB (høyde) | N | J | J | KEEP / MED |
| `bodyType` | select 1 | N | `lifestyle.bodyType` | — | N | J | J | **REMOVE** (PROF) / NONE |
| `lifestyle` | select 1 | N | `lifestyle.lifestyleType` | SC .1 (lifeSit) | N | J | J | KEEP (SC) / MED |
| `smoking` | select 1 | N | `lifestyle.smoking` | SC .2 (lifeSit) | N | J | J | KEEP (SC) / MED |
| `religion` | multi 4 | N | `deepProfileData.religion` | HB (religion) | N | J | J | KEEP / HIGH |
| `acceptedReligions` | multi 4 | N | `deepProfileData.acceptedReligions` | HB (religion) | N | J | J | KEEP / HIGH |
| `religionOpen` | toggle | N | `deepProfileData.religionOpen` | HB (åpen for alle) | N | J | J | KEEP / HIGH |
| `children` | multi 2 | N | `lifestyle.children` | HB+SC .2 | N | J | J | KEEP / HIGH |
| `wantChildren` | multi 2 | N | `lifestyle.wantChildren` | HB+SC .4 +bonus | N | J | J | **REBUILD** (se §H) / HIGH |
| `city` | tekst (100) | **J** | `lifeSituation.city` | — | N | J | J | KEEP (privacy) / MED |
| `postalCode` | kod 4 sif. | **J** | `Profile.postalCode` + lat/lon | HB (radius) | N | J | J | KEEP (radius) / HIGH |
| `distancePref` | slider (tett.) | **J** | `deepProfileData.distancePref` | HB (radius) | N | J | J | KEEP / HIGH |
| `agePrefMin` | slider (18–99) | **J** | `deepProfileData.agePrefMin` | HB (alder) | N | J | J | KEEP / HIGH |
| `agePrefMax` | slider+99+ (18–98/null) | **J** | `deepProfileData.agePrefMax` | HB (alder) | N | J | J | KEEP / HIGH |

### Steg 1 — Personlighet (`Step2Personlighet`, `personlighetSchema`)

| Felt | Type (maks) | Påkr. | Lagres i | Matching | Partner | Ops. | Prefill | Klassif / verdi |
|---|---|---|---|---|---|---|---|---|
| `selfDesc` «Hvem er du når ting flyter naturlig?» | **tekst (500)** | **J** (min 10) | `personality.selfDesc` | — | N | J | J | **REMOVE/VALGFRI** (PROF) / friksjon HIGH |
| `energyGiver` | multi 3 | N | `personality.energyGiver` | — | N | J | J | KEEP (PROF) / MED |
| `energyDrainer` | multi 3 | N | `personality.energyDrainer` | — | N | J | J | KEEP (PROF) / MED |
| `pressureReact` | select 1 | N | `personality.pressureReact` | — | N | J | J | KEEP (PROF) / MED |
| `quirk` | tekst (200) | N | `personality.quirk` | — | N | J | J | KEEP valgfri (PROF) / LOW |
| `p1`–`p15` (TOSOM_PERSONALITY V2) | skala 1–5 ×15 | **J** | `psychometricAnswers` + `bigFive` | SC .15 (personality) | N | J | J | KEEP (SC) / HIGH |

### Steg 2 — Livssituasjon (`Step2Livssituasjon`, `livssituasjonSchema` + `livsstil2026Schema`)

| Felt | Type (maks) | Påkr. | Lagres i | Matching | Partner | Ops. | Prefill | Klassif / verdi |
|---|---|---|---|---|---|---|---|---|
| `workType` | multi 3 | **J** | `lifeSituation.workType` | — | N | J | J | **VALGFRI?** (PROF) / MED |
| `housingType` «Hva bor du i?» | multi 2 | **J** | `lifeSituation.housingType` | — | N | J | J | **REMOVE/VALGFRI** (PROF) / LOW |
| `householdSize` «Hv. mange bor i hjemmet?» | select 1 | **J** | `lifeSituation.householdSize` | — | N | J | J | **REMOVE/VALGFRI** (PROF/privacy) / LOW |
| `economicStability` | select 1 | **J** | `lifeSituation.economicStability` | — | N | J | J | **VALGFRI?** (PROF/privacy) / MED |
| `arbeidsrytme` (+`Viktig`) | select 1 + vekt | N | `preferences.livsstil2026` | SC .05 + HB (ma-stemme) | N | J | J | KEEP (SC+HB) / MED |
| `bosted` (+`Viktig`) | select 1 + vekt | N | `preferences.livsstil2026` | SC .05 + HB | N | J | J | KEEP (SC+HB) / MED |
| `reiser` (+`Viktig`) | select 1 + vekt | N | `preferences.livsstil2026` | SC .04 + HB | N | J | J | KEEP (SC+HB) / LOW-MED |
| `dyr` (+`Viktig`) | select 1 + vekt | N | `preferences.livsstil2026` | SC .04 + HB | N | J | J | KEEP (SC+HB) / MED |
| `skjerm` «Hvordan er det med skjerm?» (+`Viktig`) | select 1 + vekt | N | `preferences.livsstil2026` | SC .04 + HB | N | J | J | KEEP, stramm spørsmål (§L) / LOW-MED |
| `responsibilities` «Hva ansvar har du…» | multi 3 | N | `lifeSituation.responsibilities` | — | N | J | J | **MERGE** (dublør `children`) / LOW |
| `dailyRoutine` «Hvordan starter en dag?» | select 1 | N | `lifeSituation.dailyRoutine` | — | N | J | J | KEEP valgfri (PROF) / LOW |

### Steg 3 — Tilknytning (`Step3Tilknytning`, `tilknytningSchema`)

| Felt | Type (maks) | Påkr. | Lagres i | Matching | Partner | Ops. | Prefill | Klassif / verdi |
|---|---|---|---|---|---|---|---|---|
| `safetyNeed` «Hva gjør deg trygg…» | multi 3 | N | `emotionalNeeds.safetyNeed` | — | N | J | J | KEEP valgfri (PROF) / MED |
| `insecurityTrigger` | multi 3 | N | `emotionalNeeds.insecurityTrigger` | — | N | J | J | KEEP valgfri (PROF) / MED |
| `sadnessNeed` «Hva trenger du når du er lei?» | select 1 | N | `emotionalNeeds.sadnessNeed` | — | N | J | J | KEEP valgfri (PROF) / MED |
| `stressNeed` «Hva trenger du under stress?» | select 1 | N | `emotionalNeeds.stressNeed` | — | N | J | J | KEEP valgfri (PROF) / MED |
| `importantBoundary` | tekst (300) | N | `emotionalNeeds.importantBoundary` | — | N | J | J | KEEP valgfri (PROF) / LOW |
| `att_*` (ATTACHMENT, 12) | skala 1–5 ×12 | **J** | `psychometricAnswers` + `attachment` | SC .25 (attachment) | N | J | J | KEEP (SC) / HIGH |

### Steg 4 — Kjærlighetsspråk (`Step4Kjærlighetsspråk`, `kjærlighetsspråkSchema`)

| Felt | Type (maks) | Påkr. | Lagres i | Matching | Partner | Ops. | Prefill | Klassif / verdi |
|---|---|---|---|---|---|---|---|---|
| `loveGive` «Hvordan viser du kjærlighet?» | multi 2 | **J** | `intimacy.loveGive` | — | N | J | J | **MAX 3 + vurder i matching** (PROF i dag) / MED (§N–P) |
| `loveReceive` «Hvordan ønsker du kjærlighet?» | multi 2 | **J** | `intimacy.loveReceive` | — | N | J | J | **MAX 3 + vurder i matching** (PROF i dag) / MED |
| `closenessBuilder` | select 1 | N | `intimacy.closenessBuilder` | — | N | J | J | KEEP valgfri (PROF) / MED |
| `distanceCreator` | select 1 | N | `intimacy.distanceCreator` | — | N | J | J | KEEP valgfri (PROF) / MED |
| `smallThing` | tekst (200) | N | `intimacy.smallThing` | — | N | J | J | KEEP valgfri (PROF) / LOW |

### Steg 5 — Livsstil & verdier (`Step5LivsstilVerdier`, `livsstilSchema` + `livsstil2026Schema`)

| Felt | Type (maks) | Påkr. | Lagres i | Matching | Partner | Ops. | Prefill | Klassif / verdi |
|---|---|---|---|---|---|---|---|---|
| `highPriority` «Hva er viktigst for deg nå?» | multi 2 | N | `lifestyle.highPriority` | — | N | J | J | KEEP valgfri (PROF) / MED |
| `lowPriority` «Hva er mindre viktig…» | multi 2 | N | `lifestyle.lowPriority` | — | N | J | J | **MERGE/REMOVE** (lav verdi) / LOW |
| `goodEveryday` «Hva gjør en god hverdag…» | **tekst (300)** | **J** (min 10) | `lifestyle.goodEveryday` | — | N | J | J | **REMOVE/VALGFRI** (PROF) / friksjon HIGH |
| `desiredLifestyle` | select 1 | N | `lifestyle.desiredLifestyle` | — | N | J | J | KEEP valgfri (PROF) / LOW |
| `undesiredLifestyle` | select 1 | N | `lifestyle.undesiredLifestyle` | — | N | J | J | **REMOVE/MERGE** (lav verdi) / LOW |
| `bil` (+`Viktig`) | select 1 + vekt | N | `preferences.livsstil2026` | SC .06 + HB | N | J | J | KEEP (SC+HB) / MED |
| `kosthold` «Hvordan spiser du?» (+`Viktig`) | select 1 + vekt | N | `preferences.livsstil2026` | SC .06 + HB | N | J | J | KEEP, refine alternativer (§Q) / MED |
| `klima` | select 1 (3 trinn, ingen vekt) | N | `preferences.livsstil2026` | SC .06 | N | J | J | KEEP (SC) / LOW-MED |
| `alkohol` (+`Viktig`) | select 1 + vekt | N | `preferences.livsstil2026` | SC .05 + HB | N | J | J | KEEP (SC+HB) / MED |
| `aktivitet` «Hvor aktiv er du?» (multi 3) (+`Viktig`) | multi 3 + vekt | N | `preferences.livsstil2026` | SC .05 + HB (overlap) | N | J | J | **EXPAND** (nøytrale alternativer, §R) / MED |
| `pvq1`–`pvq10` (PVQ-10) | skala 1–5 ×10 | **J** | `psychometricAnswers` + `valueProfile` | SC .25 (values) | N | J | J | KEEP (SC) / HIGH |

### Steg 6 — Relasjonsstil (`Step5Relasjonsstil`, `relasjonsStilSchema`)

| Felt | Type (maks) | Påkr. | Lagres i | Matching | Partner | Ops. | Prefill | Klassif / verdi |
|---|---|---|---|---|---|---|---|---|
| `relationshipSeeking` «Hva type relasjon søker du?» | multi 3 | **J** | `deepProfileData.relasjonsStil` | — | N | J | J | **VALGFRI?** (PROF; kunne vært HB) / MED |
| `closenessNeed` «Hvor mye nærhet trenger du?» | multi 2 | **J** | `deepProfileData.relasjonsStil` | — | N | J | J | **VALGFRI?** (PROF) / MED |
| `independenceBalance` | tekst (300) | N | `deepProfileData.relasjonsStil` | — | N | J | J | KEEP valgfri (PROF) / LOW |

### Steg 7 — Framtid (`Step6FramtidVisjon`, `fremtidSchema`)

| Felt | Type (maks) | Påkr. | Lagres i | Matching | Partner | Ops. | Prefill | Klassif / verdi |
|---|---|---|---|---|---|---|---|---|
| `futureVision` | select 1 | N | `futureVision.futureVision` | PROF (match-breakdown) | N | J | J | KEEP valgfri (PROF) / MED |
| `dreamGoal` | tekst (300) | N | `futureVision.dreamGoal` | — | N | J | J | KEEP valgfri (PROF) / LOW |
| `buildTogether` | **tekst (300)** | **J** (min 10) | `futureVision.buildTogether` | — | N | J | J | **REMOVE/VALGFRI** (PROF) / friksjon MED |
| `experienceAlone` | select 1 | N | `futureVision.experienceAlone` | — | N | J | J | KEEP valgfri (PROF) / LOW |
| `experienceTogether` | select 1 | N | `futureVision.experienceTogether` | — | N | J | J | KEEP valgfri (PROF) / LOW |

### Steg 8 — Kommunikasjon (`Step7HumorPersonlighet`)

| Felt | Type (maks) | Påkr. | Lagres i | Matching | Partner | Ops. | Prefill | Klassif / verdi |
|---|---|---|---|---|---|---|---|---|
| `comm1`–`comm6` (COMMUNICATION) | skala 1–5 ×6 | **J** | `psychometricAnswers` + `communicationScores` | SC .15 (communication) | N | J | J | KEEP (SC) / HIGH |

> Mirkonklusjon: humor-fritekstene `laughterTrigger`, `quirkyHabit`, `guiltyPleasure`,
> `totallyYou`, `partnerWouldLaugh` er i Zod + lagringskort (`boundaries`) men **renderes
> ikke i Step7 lenger** (steg 8 er kun COMMUNICATION-skala). → **DØDT** (se §T).

### Steg 9 — Grenser (`Step8Grenser`, `grenserSchema`)

| Felt | Type (maks) | Påkr. | Lagres i | Matching | Partner | Ops. | Prefill | Klassif / verdi |
|---|---|---|---|---|---|---|---|---|
| `neverCrossBoundary` «Hvilke grenser er avgjørende?» | multi 2 | **J** | `boundaries.neverCrossBoundary` | — (se merknad) | N | J | J | KEEP (SAFETY/PROF) / MED |
| `understandPartnersBoundaries` | select 1 | **J** | `boundaries.understandPartnersBoundaries` | — | N | J | J | KEEP (SAFETY/PROF) / MED |
| `limitations` | tekst (300) | N | `boundaries.limitations` | — | N | J | J | KEEP valgfri (SAFETY/PROF) / LOW |
| `partnerMustUnderstand` | tekst (300) | N | `boundaries.partnerMustUnderstand` | — | N | J | J | KEEP valgfri (SAFETY/PROF) / LOW |

> Mirkonklusjon: dealbreaker `checkBoundaries` forventer
> `boundaries.excludes`/`includes` (arrays), men datamodellen lagrer disse som
> select-verdier → **form-skilnad: grenser-konsumenten er INAKTIV** i dag.
> Feltene bærer sikkerhets-/profilverdi (SAFETY), ikke matching.

### Steg 10 — Moden nysgjerrighet (`Step8ModenNysgjerrighet`, `modenSchema`)

| Felt | Type (maks) | Påkr. | Lagres i | Matching | Partner | Ops. | Prefill | Klassif / verdi |
|---|---|---|---|---|---|---|---|---|
| `intimacySafety` | select 1 | N | **IKKE PERSISTERT** | — | N | J (draft) | N | **REMOVE/REBUILD** / LOW |
| `comfortableWith` | select 1 | N | **IKKE PERSISTERT** | — | N | J (draft) | N | **REMOVE/REBUILD** / LOW |
| `boundary` | tekst (200) | N | **IKKE PERSISTERT** | — | N | J (draft) | N | **REMOVE/REBUILD** / LOW |
| `nearerType` | select 1 | N | **IKKE PERSISTERT** | — | N | J (draft) | N | **REMOVE/REBUILD** / LOW |
| `needsTime` | select 1 | N | **IKKE PERSISTERT** | — | N | J (draft) | N | **REMOVE/REBUILD** / LOW |
| `erq_r1`–`erq_s3` (ERQ-6, 6) | skala 1–5 ×6 | **J** | `psychometricAnswers` + `emotionRegulation` | SC .10 (emotionReg) | N | J | J | KEEP (SC) / HIGH |

> **Kritisk:** de 5 ikke-skala-feltene i steg 10 samles inn og vises i
> oppsummeringen, men `setup`-ruten ekstraherer/persisterer **ikke** `moden`
> (0 referanser i `profile/setup/route.ts`). Prefill henter dem heller ikke.
> Brukerarbeid kastet bort + ingen matching. Enten persister dem (hvis profilverdi)
> eller fjern (anbefalt: hele «moden»-konseptet er overlapp med tilknytning/grenser).

### Felt som IKKE samles inn i live-UI (død skjema/lagringsplass)

| Felt | Status |
|---|---|
| `dietPreference`, `sleepSchedule`, `pets`, `travelFreq`, `alcoholFreq`, `ambitionLevel`, `structureSpontaneity`, `introExtrovert` | I `preferanserSchema` + `deepProfileData` — **0 live-steg**, alltid tomme → ikke persistert. DØDT. |
| `politicsImportance`, `religionImportance` | Sendes som default `5`, lagres i `deepProfileData` — **brukes ikke i matching**, vises ikke. DØDT (legacy). |
| `laughterTrigger`, `quirkyHabit`, `guiltyPleasure`, `totallyYou`, `partnerWouldLaugh` | I `humorSchema` + `boundaries` — **renderes ikke i Step7**. DØDT. |
| `bestSelf` | I `ProfileData`/`initialData` — **renderes i intet live-steg**, ikke persistert. DØDT (legacy). |
| `firstName`, `seeking`, `maxDistance`, `minAge`, `maxAge`, `location`, `energy/drain/pressure/habits` | Legacy-nøkler i `ProfileData` — sendes men ubrukt/ikke rendert. |
| `maturityLevel`, `securityLevel` (Profile-kolonner) | Skrives **null** (PL-10: syntetiske verdier fjernet). |

---

## D. MATCHING CONSUMERS (sporet mot faktisk kode)

Hvert felt som påstås å hjelpe matching, sporet: Felt → lagret verdi → konsument →
dimensjon/dealbreaker → faktisk effekt. «Samlet under onboarding» ≠ «brukt i
matching» — det er nettopp skillelinjen her.

| Felt | → Lagret | → Konsument | Dimensjon/DB | Effekt |
|---|---|---|---|---|
| `gender` / `seekingGender` | `lifeSituation` | `checkGenderSeeking` | HB 1 | **HARD BLOCK** |
| `age` / `agePrefMin` / `agePrefMax` | `Profile.age`, `deepProfileData` | `checkAgePreference` | HB 2 | **HARD BLOCK** (99+ = null → ingen maks-sjekk) |
| `wantChildren` | `lifestyle` | `checkChildrenWant` + `scoreLifeSituationCompat` | HB 3 + SC .4 | **HARD BLOCK** (kun Ja vs Nei) + SCORE |
| `children` | `lifestyle` | `scoreLifeSituationCompat` (+ `harBarnFraFor` i bonus) | SC .2 | **SCORE** |
| `height` | `lifestyle` | `checkHeightRule` | HB 4 | **HARD BLOCK** (mann ≥5 cm kortere enn kvinne) |
| `religion` / `acceptedReligions` / `religionOpen` | `deepProfileData` | `checkReligionCompat` | HB 10 | **HARD BLOCK** (tostidig; se §G) |
| `distancePref` + `postalCode` | `deepProfileData`, `Profile.postalCode/lat/lon` | `checkRadius` | HB 9 | **HARD BLOCK** (tett.-basert) |
| 9 l2026 «må-stemme»-felt + `Viktig` | `preferences.livsstil2026` | `checkLifestyle2026` | HB 5 | **HARD BLOCK** (kun når `ma-stemme`) |
| `smoking` | `lifestyle` | `scoreLifeSituationCompat` | SC .2 | **SCORE** |
| `lifestyle`/`lifestyleType` | `lifestyle` | `scoreLifeSituationCompat` | SC .1 | **SCORE** |
| 10 l2026-verdifelt | `preferences.livsstil2026` | `livsstil2026Items` | SC .04–.06 | **SCORE** (gate-utelukkes med «ikke-viktig») |
| `bonusfamilie`-token i `wantChildren` | `lifestyle` | `erApenForBonusfamilie` → `+BONUSFAMILIE_PLUSS` | SC +10 | **SCORE** (IKKE hard grense) |
| 49 skalasvar | `psychometricAnswers` → 5 skårer | `unifiedScore` | SC .10–.25 | **SCORE** (5 dimensjoner) |
| `futureVision` | `futureVision` | `match/breakdown` (return) | — | **PROFILE ONLY** (visning, ikke score) |

**Ikke-brukt i matching (tross samling):** `bodyType`, `city`, `selfDesc`,
`energyGiver/Drainer`, `pressureReact`, `quirk`, `workType`, `housingType`,
`householdSize`, `economicStability`, `responsibilities`, `dailyRoutine`,
`safetyNeed`, `insecurityTrigger`, `sadnessNeed`, `stressNeed`, `importantBoundary`,
`loveGive`, `loveReceive`, `closenessBuilder`, `distanceCreator`, `smallThing`,
`highPriority`, `lowPriority`, `goodEveryday`, `desiredLifestyle`,
`undesiredLifestyle`, `relationshipSeeking`, `closenessNeed`, `independenceBalance`,
`dreamGoal`, `buildTogether`, `experienceAlone/Together`, `neverCrossBoundary`,
`understandPartnersBoundaries`, `limitations`, `partnerMustUnderstand`, hele
`moden`-seksjonen, alle preferanser-/humor-/legacy-felt. Alle = **PROFILE ONLY**
(egen oppsummering) eller **NOT USED**.

**Inaktive dealbreakere (kodet/testet, ingen datasource):** `checkLifeRhythmConflict`
(`lifeRhythm` samles ikke inn), `checkExplicitPreferences` (`preferences.dealbreakers`
populeres ikke fra onboarding), `checkBoundaries` (form-skilnad: `excludes`/
`includes` finnes ikke i lagret JSON).

---

## E. FREE-TEXT (alle brukerediterbare tekstfelt)

11 multiline-fritekster i live-UI + 4 korte strukturerte tekstfelt.

| Felt | Spørsmål | Påkr. | Max | Lagres i | Matching | Partner | Opps. | Klassif |
|---|---|---|---|---|---|---|---|---|
| `selfDesc` | Hvem er du når ting flyter naturlig? | **J** | 500 | `personality` | — | N | J | **REMOVE/VALGFRI** (PROFILE ONLY) |
| `goodEveryday` | Hva gjør en god hverdag? | **J** | 300 | `lifestyle` | — | N | J | **REMOVE/VALGFRI** (PROFILE ONLY) |
| `buildTogether` | Hva kan dere bygge sammen? | **J** | 300 | `futureVision` | — | N | J | **REMOVE/VALGFRI** (PROFILE ONLY) |
| `quirk` | En vane du ler av? | N | 200 | `personality` | — | N | J | KEEP valgfri (PROF) |
| `importantBoundary` | Hvilken grense er viktigst? | N | 300 | `emotionalNeeds` | — | N | J | KEEP valgfri (SAFETY/PROF) |
| `smallThing` | Små ting som betyr mest? | N | 200 | `intimacy` | — | N | J | KEEP valgfri (PROF) |
| `independenceBalance` | Selvstendighet vs fellesskap? | N | 300 | `deepProfileData.relasjonsStil` | — | N | J | KEEP valgfri (PROF) |
| `dreamGoal` | Største drøm? | N | 300 | `futureVision` | — | N | J | KEEP valgfri (PROF) |
| `limitations` | Dine viktigste avgrensninger? | N | 300 | `boundaries` | — | N | J | KEEP valgfri (SAFETY/PROF) |
| `partnerMustUnderstand` | Hva må partneren forstå? | N | 300 | `boundaries` | — | N | J | KEEP valgfri (SAFETY/PROF) |
| `boundary` | Din personlige grense? | N | 200 | **IKKE PERSISTERT** | — | N | J (draft) | **REMOVE** (kastet bort) |

Korte strukturerte tekstfelt (ikke «essays»): `identityName` (50, J), `age` (3, J),
`city` (100, J), `postalCode` (4 siffer, J) — alle KEEP (identitet/radius/privacy).

**Konklusjon (E):** Ingen fritekstfelt har matching-effekt. Ingen vises til
partneren. De tjener kun som selvgjennomgang i oppsummeringen. De 3 **påkrevde**
essays (`selfDesc`, `goodEveryday`, `buildTogether`) bryter Georges prinsipp
«ingen påkrevd fritekst uten demonstrert produktbehov» — der er ingen matching-
konsument å peke på. **Anbefalt: gjør alle 3 valgfri** (behøver ikke slettes om
selskapet vil beholde varmen i profilen), og **slett `boundary`** (ikke persistert).

---

## F. RELIGION — DATA-MODELL (i dag)

To uavhengige datasett + én eksplisitt tilstand:

- **A. Beskriver meg** → `deepProfileData.religion` (multi, **opptil 4**, kommaseparert).
  11 kanoniske verdier: kristen, katolsk, agnostiker, ateist, muslim, jehovas-vitne,
  hindu, judedom, buddhist, spirituell, annet.
- **B. Jeg aksepterer hos partner** → `deepProfileData.acceptedReligions` (multi,
  **opptil 4**, kommaseparert), samme ordforråd.
- **OPEN TO ALL** → `deepProfileData.religionOpen` (bool). Eksplisitt distinkt fra
  MISSING (tom liste). UI-sentinelen `OPEN_TO_ALL` normaliseres til flagget i setup.

**Verifisert: egen religion (A) og akseptliste (B) er separerte datasett** — samsvarer
med Georges modell. **Hold begge.** (§10-kravet er oppfylt i data-modellen.)

---

## G. RELIGION — MATCHING SANNHET (sporet i `dealbreaker.ts` / `cheapFeatures.ts`)

`checkReligionCompat(a,b) = checkReligionOneWay(a,b) ?? checkReligionOneWay(b,a)`
(tostidig, kjører FØR scoring).

`checkReligionOneWay(accepter, target)`:
1. `accepter.religionOpen === true` → **akseptert** (åpen for alle).
2. `accepter.acceptedReligions` tom → **ingen begrensning** (MISSING).
3. `target.religion` tom → **kan ikke evalueres** → ingen blokk.
4. For hver `r` i `target.religion`: hvis `r` ∈ `accepter.acceptedReligions` →
   **akseptert** (minst én overlap). Ellers → **BLOKKER**.

**Konklusjoner:**
- **Bilateral HARD-kompatibilitet = ALIGNED.** B må akseptere A sin egen religion
  OG A må akseptere B sin egen religion (begge retninger). Eksemplet i §11:
  A=jødisk, B-aksepterer={kristen, ikke-religiøs} → `checkReligionOneWay(B,A)`
  blokkerer (jødisk ∉ listen) → A↔B kobles **ikke**. Korrekt.
- **Multi-identitet (§13):** semantikken er **MINST ÉN OVERLAP PÅSSES**. Hvis A
  egen = {jødisk, ikke-religiøs} og B aksepterer kun {jødisk} → PÅSSES (jødisk
  overlapper). Dvs. **ANY**, ikke ALL. Ingen «alle må dekkes»-logikk.
- **Uendret av O2:** data-modell, hard regel og multi-semantik er alle korrekte i
  forhold til produktmodellen. O2-D skal **kun** forenkle UI-copy (se §12) — ingen
  matching-endring.

**RELIGION BILATERAL MATCHING: ALIGNED** (verifisert mot `dealbreaker.ts` L545–575 og
`cheapFeatures.ts` `religionOneWay` L305–313; ekvivalens-testet i
`__tests__/matching-score-round.test.ts`).

### G.1 — Religion UI-forenkling (kopiråd, ingen logikkendring)

Nåværende seksjonstekst («Velg opptil fire som beskriver deg» + «Mange har røtter i
flere tradisjoner — det er helt naturlig») er unødvendig lang. Foreslått:

```
RELIGION / LIVSSYN
Velg det som beskriver deg.            [grid, opptil 4]
(Åpen for alle: [toggle])

Hvilke religioner/livssyn er du åpen for hos en partner?   [grid, opptil 4]
[Valgfri selv-aksept-hint fra getReligionSelfAcceptHint — behold, den er allerede rolig]
```

Behold hard-grense-avklaringen («Dette er en hard grense: en kobling skjer bare hvis
dere er åpne for hverandre her») og selvpåloggings-hintet — begge er produkt-/
juridisk-relevante. **LAWYER REVIEW: PENDING** (uendret).

---

## H. CHILDREN — NÅVÆRENDE MODELL (sporet UI → lagring → matching → oppsummering)

To felt i `lifestyle`-kolonnen:

**A. `children`** «Barn?» (multi, maks 2): `Har-små-barn` · `Har-barn` ·
`Har-vaksen-barn` · `Har-ikke-barn`.
- `HAR_BARN = {har-små-barn, har-barn, har-vaksen-barn}` (normalisert, case/rom-tolerant).
- Konsumenter: SC .2 i `scoreLifeSituationCompat`; `harBarnFraFor` driver bonusplusset.

**B. `wantChildren`** «Ønsker du barn?» (multi, maks 2): `Ja` · `Usikker` · `Nei` ·
**`Bonusfamilie`** («Åpen for en partner som har barn fra før»).
- Hard regel (`checkChildrenWant`): `childrenOnlyChoice()` fjerner `Bonusfamilie`-
  tokenet, og blokkerer **kun** når den ene = nøyaktig `{Ja}` og den andre = nøyaktig
  `{Nei}`. «Usikker», flervalg eller manglende data blokkerer aldri.
- Score (`scoreLifeSituationCompat`): `barneonskeUtenBonus()` fjerner `Bonusfamilie`
  før `categoryMatch` (PL-28: bonusfamilie er ikke et barneønske). Vekt .4.
- Bonuspluss: `erApenForBonusfamilie(wantX)` (Ja/Nei/Usikker + Bonusfamilie) **OG**
  partner `harBarnFraFor(children)` → **+10** (begge veier, gis én gang).

**Kjernen-problem:** De 4 konsepterne George definerte er **ikke** separerte:
- (A) Har barn → `children` ✓ separat.
- (B) Ønsker barn i fremtiden **OG** (C) Åpen for bonusfamilie → **båe i `wantChildren`**
  (token-basert, max 2). Bruker kan velge f.eks. `Ja,Bonusfamilie` **eller**
  `Nei,Bonusfamilie` — sistnevnte betyr «ønsker ikke (eller usikker på) egne barn,
  men åpen for partner med barn», men kan også leses som motsatt. **Ambiguitt.**
- (D) Må stemme / avgjørende → **finnes ikke som bruker-kontroll.** Barneønske har en
  fast Ja/Nei-hardregul; det er ingen «åpen for bonusfamilie = hard grense»-flagg.

**§14-sporet:** UI → `lifestyle.children`/`lifestyle.wantChildren` → `checkChildrenWant`
(HB) + `scoreLifeSituationCompat` (SC + bonus) → ingen egen oppsummeringsseksjon for
barn utenom steget selv (oppsummeringen viser barn under «Det som må stemme»).

---

## I. BONUS-FAMILY — MATRISE (nåværende vs ønsket, tosidig)

**Georges ønskedimensjoner:** A = har barn? · B = ønsker barn i fremtiden? ·
C = åpen for partner som allerede har barn? · D = avgjørende/må stemme?

**Nåværende runtime (sporet):**

| # | A har barn | B (partner) bonus=C | D (hard) | B ønsker barn (B) | Nåværende effekt | Ønsket effekt |
|---|---|---|---|---|---|---|
| 1 | Ja | Nei + HARD | ja | — | **Ingen blokk** (bonus er ikke hard i dag) — kun `wantChildren` Ja-vs-Nei gjelder | **BLOCK** |
| 2 | Ja | Ja | nei | — | +10 score-pluss (`erApenForBonusfamilie` + `harBarnFraFor`) | ALLOW (+pluss) |
| 3 | Nei | — (C ikke stilt) | — | B=Ja | Ingen inferens — C uavhengig | Ingen inferens (OK) |
| 4 | Ja + B vil ha flere | Ja | nei | Ja | +10 pluss; Ja/Ja passer | ALLOW |
| 5 | Ja + B vil ha flere | Nei + HARD | ja | Ja | Ingen blokk i dag (C ikke hard) | **BLOCK** |
| 6 | Begge har barn | — | — | — | Båe `HAR_BARN`; score nøytral/positiv; ingen blokk | ALLOW |
| 7 | Begge barnløse | — | — | — | `Har-ikke-barn`; ingen blokk | ALLOW |
| 8 | Mangler/legacy (tom) | — | — | — | `!va || !vb → skip` (straffer ikke tom profil) | LEGACY FALLBACK (nøytral) |

**Gap-analyse (§17):**
- **MISSING:** eksplisitt `acceptsPartnerWithChildren` (C) som eget felt. I dag er C
  kun en **token** i `wantChildren` og gir **kun scorepluss**, aldri hard grense.
- **MISSING:** (D) «må stemme»-kontroll for bonusfamilie.
- **PARTIALLY SUPPORTS:** (A)+(B) støttes; (C)+(D) støttes **ikke** som separater,
  kontrollerbare dimensjoner.

**Minste trygge representasjon (O2-B, ingen implementasjon her):**
Legg inn i `lifestyle`-JSON (additive, ingen migrasjon nødvendig — JSON):
```
lifestyle.openToPartnerWithChildren: 'ja' | 'nei' | 'usikker'   // (C)
lifestyle.openToPartnerWithChildrenViktig: 'ikke-viktig' | 'ma-stemme'  // (D)
```
- Behold `children` (A) og `wantChildren` **uten** `Bonusfamilie`-token (B).
- Matching: ny hardregel `checkBonusFamily`: blokker hvis én `HAR_BARN` og partner
  `openToPartnerWithChildren='nei'` **og** `...Viktig='ma-stemme'` (begge retninger).
  Bonuspluss (+10) beholdes for `='ja'` + partner `HAR_BARN`.
- **Backfill/legacy:** eksisterende `wantChildren` med `Bonusfamilie` → avled
  `openToPartnerWithChildren='ja'` ved lesing (fallback), tilbruker gjenbesvarer.
  Ingen destruktiv DB-sletting. **Ingen ny kolonne** (bruker eksisterende JSON) →
  ingen Prisma-migrasjon.
- **Copy (§18):**
  - «Har du barn?» (A)
  - «Ønsker du barn i fremtiden?» (B)
  - «Er du åpen for å bli kjent med noen som allerede har barn?» (C)
  - [Valgvikt] «Må stemme» (D)
  - Hjelpetekk (valgfri): «Dette handler om barn en partner allerede har — ikke om
    om dere ønsker barn sammen senere.»

**BONUS-FAMILY MODEL: PARTIAL → ALIGNED etter O2-B.**

---

## J. HOUSING — «Hva bor du i?» (`housingType`)
- **Alternativer (multi, maks 2, PÅKREVDT):** leilighet, hus, delt-bo, kollektiv,
  studentbolig, foreldres-bo, annet.
- **Matching:** ingen konsument. **Partner:** Nei. **Oppsummering:** Ja.
- **Produktverdi:** Lav. Hvilken boligsom helst forbedrer ikke en ToSom-kobling
  meningsfullt — avstand (radius) og bosteds*type* (sentrum/land, i l2026) er det
  som faktisk betyr noe for hverdag. `housingType` duplører delvis l2026 `bosted`.
- **Klassif: REMOVE/VALGFRI** (PROFILE ONLY, onødvendig påkrevd friksjon).
  Dersom beholdes: gjør valgfri.

## K. HOUSEHOLD COUNT — «Hvor mange bor det i hjemmet?» (`householdSize`)
- **Alternativer (select 1, PÅKREVDT):** 1 · 2 · 3–4 · 5+.
- **Matching:** ingen. **Privacy:** middels-høy (avslører husstandsstørrelse).
  **Stale:** ja — endres ofte. **Dekkes av barn?** Delvis (`children` dekker barn;
  ikke voksne/husstand ellers).
- **Produktverdi:** Lav. Gir ikke matching-signal; overlapper med `children` +
  `responsibilities`. **Klassif: REMOVE/VALGFRI** (PROFILE ONLY, privacy-kostnad).

## L. SCREEN — «Hvordan er det med skjerm?» (`skjerm`)
- **Alternativer (select 1, valgfri):** mye · moderat · vil-skru-ned · ubestemt.
  + `skjermViktig` (Valgvikt).
- **Matching:** SC .04 + HB (hvis `ma-stemme`). **Partner:** Nei.
- **Hva den fanger:** skjerm-tid / telefon-vaner (ikke gaming/TV/grænser eksplicit).
  Konseptet er nyttig (hverdags-rutine), men spørsmålet er vagt. **Klassif: KEEP**
  (har reell matching-effekt) — **stramm spørsmålet** til en klar, nøytral formulering,
  f.eks. «Hvor mye rom tar skjermen i hverdagen din?» (alt er valgfri + kan settes til
  «må stemme», så ingen påtvinging).

## M. RESPONSIBILITY — «Hva ansvar har du i livet ditt?» (`responsibilities`)
- **Alternativer (multi, maks 3, valgfri):** sma-barn, vaksne-barn, foreldre,
  andre-naere, ingen-faste.
- **Matching:** ingen. **Dupliserer:** `children` (barn) delvis. **Partner:** Nei.
- **Produktverdi:** Lav. «Har ansvars» er lite diskriminerende for matching og
  overlapper med barn/omSORG. **Klassif: MERGE/REMOVE** (PROFILE ONLY, dublør).
  Dersom beholdes: valgfri, kort.

---

## N. LOVE — GIVING (`loveGive`)
- «Hvordan viser du kjærlighet?» — **multi, maks 2, PÅKREVDT.**
- **Alternativer (5):** ord, tjenester, tid, kjønslig, gaver.
- **Lagring:** `intimacy.loveGive`. **Matching:** **INGEN** (ingen av de 6
  dimensjonene leser `intimacy.loveGive`). **Oppsummering:** Ja.
- **George vil ha maks 3.** Scoringen støtter dette **naturlig** fordi feltet i dag
  **ikke scorer** — det er bare en multi-select i UI. Øke `maxSelected` 2 → 3 krever
  **ingen matching-endring** (kun UI + Zod `optStr`/UI-validering). **Klassif: KEEP,
  MAX 3** (COMPATIBLE). Vurder eventuelt å koble til `lifeSituation` som lavvektet
  overlap — men det er en **matching-endring** (trenger egen godkjenning, se §P).

## O. LOVE — RECEIVING (`loveReceive`)
- «Hvordan ønsker du kjærlighet?» — **multi, maks 2, PÅKREVDT.**
- **Alternativer (5, samme ordforråd som giving):** ord, tjenester, tid, kjønslig, gaver.
- **Lagring:** `intimacy.loveReceive`. **Matching:** **INGEN.** **Oppsummering:** Ja.
- **Semantik vs giving:** samme option-sett, ulik betydning (gir vs mottar). Samme
  (manglende) scoring. **MAX 3 = COMPATIBLE** (ingen matching-endring nødvendig).
- **Klassif: KEEP, MAX 3.**

## P. LOVE COMPATIBILITY — hva matchingen faktisk gjør i dag
- `loveGive`/`loveReceive` er **PROFILE ONLY**. Det beregnes **ingen** kompatibilitet
  mellom A si giving og B sin mottakelse (og omvendt). Det finnes altså **ingen**
  «love-language»-poeng i resonansnivået.
- Konsekvens: å la brukeren velge 3 i stedet for 2 **svakner ikke diskriminerende
  kraft i matchingen** (det scorer ikke i dag), men **reducerer valgfriksjon** og
  **kappløper** (flere valg = lettere å treffes hvis det en dag kobles inn).
- Hvis ToSom **vil** at kjærlighetsspråk skal påvirke matching, er det en **ny
  scoring-endring** (f.eks. overlap mellom `loveGive(A)` × `loveReceive(B)`, begge
  retninger, lav vekt i `lifeSituation`). Det krever eget godkjenningspunkt —
  **ikke** en del av O2-C «trygg forenkling».
- **Kvantifisert (fra faktisk kode):** love-dimensjonens bidrag til `unifiedScore`
  i dag = **0.00**. Ingen vekt, ingen overlap-funksjon.

---

## Q. FOOD — «Hvordan spiser du?» (`kosthold` + døde `dietPreference`)
- **Aktivt felt:** l2026 `kosthold` (select 1, valgfri) + `kostholdViktig`.
  **Alternativer i dag:** spiser-koett (skrivfeil?), fleksitar, vegetar, vegan, fisk.
  **Matching:** SC .06 + HB (hvis `ma-stemme`).
- **Død felt:** `dietPreference` (i `preferanserSchema`, **0 live-UI**, alltid tomt).
  Duplør — fjernes fra skjema (ingen UI).
- **Sensitivitet (§27):** vegansk/vegetar/fisk er livsstil (trygt). Ingen medisinsk
  diagnose/allergi i dagens alternativer → **ingen SENSITIVE/LEGAL-flagg**. Behold
  livsstil-nivå, ikke helse-nivå.
- **Foreslått sett (~5, opp til 2, basert på matching-signal):**
  `vegetar/vegan` · `fisk` · `fleksitar` · `spiser alt` · `ikke bestemt`.
  (Fjern/skriv-rett `spiser-koett`; hold det til livsstil, ikke allergi.)
- **Klassif: KEEP, REFINE alternativer, maks 2.**

## R. ACTIVITY — «Hvor aktiv er du?» (`aktivitet`)
- **Aktivt felt:** l2026 `aktivitet` (**multi, maks 3**, valgfri) + `aktivitetViktig`.
  **Alternativer i dag:** gym, lop-turer, lagidrett, natur-fritid, lite.
  **Matching:** SC .05 + HB (overlap: minst én felles verdi når `ma-stemme`).
- **Ordning/ordinal (§29):** i dag er dette et **flervalg** (ikke en ordinal-skala),
  så HB-bruk er «overlap» og SC-bruk er `categoryMatch`. Øke antall alternativer
  krever **ingen numerisk mapping-endring** — scoringen sammenligner sett-overlap,
  ikke tall. Trygt å utvide.
- **Foreslått nøytralt sett (ikke-moraliserende):**
  `lite aktiv i hverdagen` · `rolige turer/hverdagsbevegelse` · `trener av og til` ·
  `trener regelmessig` · `svært aktiv/aktivitet er viktig` (opptil 3 valg).
  Ingen implikasjon om at mer aktivt er bedre.
- **Klassif: EXPAND (nøytrale alternativer), maks 3.** COMPATIBLE (overlap-scoring).

## S. MULTI-SELECT — KONSENS (alle flervalg)

| Felt | Min | Maks | # alternativer | Påkr. | Validering | Opps. | Matching |
|---|---|---|---|---|---|---|---|
| `religion` | 0 | 4 | 11 | N | superRefine maks 4 | J | HB |
| `acceptedReligions` | 0 | 4 | 11 | N | superRefine maks 4 | J | HB |
| `children` | 0 | 2 | 4 | N | — | J | HB+SC |
| `wantChildren` | 0 | 2 | 4 | N | — | J | HB+SC |
| `loveGive` | 1 (UI) | 2 | 5 | **J** | UI-gate | J | — |
| `loveReceive` | 1 (UI) | 2 | 5 | **J** | UI-gate | J | — |
| `energyGiver` | 0 | 3 | 8 | N | — | J | — |
| `energyDrainer` | 0 | 3 | 7 | N | — | J | — |
| `safetyNeed` | 0 | 3 | 6 | N | — | J | — |
| `insecurityTrigger` | 0 | 3 | 5 | N | — | J | — |
| `workType` | 1 (UI) | 3 | 10 | **J** | UI-gate | J | — |
| `housingType` | 1 (UI) | 2 | 7 | **J** | UI-gate | J | — |
| `highPriority` | 0 | 2 | 6 | N | — | J | — |
| `lowPriority` | 0 | 2 | — | N | — | J | — |
| `relationshipSeeking` | 1 (UI) | 3 (regle) | 4 | **J** | «åpen» velges alene | J | — |
| `closenessNeed` | 1 (UI) | 2 | 3 | **J** | UI-gate | J | — |
| `neverCrossBoundary` | 1 (UI) | 2 | 5 | **J** | UI-gate | J | — |
| `aktivitet` | 0 | 3 | 5 | N | maks 3 | J | SC+HB |
| `responsibilities` | 0 | 3 | 5 | N | — | J | — |

**Ukonsistens i UX-copy:** Noen sier «Velg opptil N», andre ingenting; påkrevde
flervalg viser ikke at minst ett er nødvendig. **Kanonisk mønster (O2-C):**
- Valgfri: «Velg opptil X.»
- Nøyaktig: «Velg X.»
- Påkrevd (minst ett): «Velg minst ett — opptil X.»
Ikke ekstra forklaring når det er åpenbart.

## T. DATA MINIMIZATION — mesterverket (O2s viktigste utdata)

**SAMLET MEN IKKE BRUKT (NOT USED / dødt):**
`dietPreference`, `sleepSchedule`, `pets`, `travelFreq`, `alcoholFreq`,
`ambitionLevel`, `structureSpontaneity`, `introExtrovert`, `politicsImportance`,
`religionImportance`, `laughterTrigger`, `quirkyHabit`, `guiltyPleasure`, `totallyYou`,
`partnerWouldLaugh`, `bestSelf`, `firstName`, `seeking`, `maxDistance`, `minAge`,
`maxAge`, `location`, `energy/drain/pressure/habits` (legacy), `maturityLevel`,
`securityLevel` (null).

**SAMLET MEN KASTET (collected, shown i oppsummering, IKKE persistert):**
`intimacySafety`, `comfortableWith`, `boundary`, `nearerType`, `needsTime` (moden).

**SAMLET MEN PROFILE-ONLY (kun egen oppsummering, ingen matching, ingen partner):**
`bodyType`, `selfDesc`, `energyGiver`, `energyDrainer`, `pressureReact`, `quirk`,
`workType`, `housingType`, `householdSize`, `economicStability`, `responsibilities`,
`dailyRoutine`, `safetyNeed`, `insecurityTrigger`, `sadnessNeed`, `stressNeed`,
`importantBoundary`, `loveGive`, `loveReceive`, `closenessBuilder`, `distanceCreator`,
`smallThing`, `highPriority`, `lowPriority`, `goodEveryday`, `desiredLifestyle`,
`undesiredLifestyle`, `relationshipSeeking`, `closenessNeed`, `independenceBalance`,
`futureVision`, `dreamGoal`, `buildTogether`, `experienceAlone`, `experienceTogether`,
`neverCrossBoundary`, `understandPartnersBoundaries`, `limitations`,
`partnerMustUnderstand`.

**SAMLET MEN SVAKT MATCHING-SIGNAL:** `lifestyle` (SC .1), `klima` (SC .06, ingen HB).

**DUPLIKATER:** `responsibilities` ↔ `children` · `housingType` ↔ l2026 `bosted` ·
`dietPreference` (død) ↔ l2026 `kosthold` · `householdSize` ↔ `children`/`responsibilities`.

**REKOmmendasiert slette (trygt, ingen matching-tap):** døde/legacy-felt (øverst) +
`boundary` (ikke persistert) + `bodyType`. **Gjør valgfri (ikke slett):** `selfDesc`,
`goodEveryday`, `buildTogether`, `housingType`, `householdSize`, `economicStability`,
`workType`. **Merg/slett:** `lowPriority`, `undesiredLifestyle`, `responsibilities`.

---

## U. REQUIRED FIELDS (71) — hvorfor hvert må/påkrav

**MÅ FORBLI PÅKREVDT** (matching, identitet, lov/consent, radius, skala):
- `identityName`, `age` (identitet + alder 18+, HB)
- `gender`, `seekingGender` (HB kjønn)
- `city`, `postalCode`, `distancePref` (radius-HB; postnummer → koordinater)
- `agePrefMin`, `agePrefMax` (HB alder)
- 49 skalasvar (D-1: server er fasit; uten komplett datagrunnlag kan skårer/resonans
  ikke beregnes) — 15 p + 12 att + 10 pvq + 6 comm + 6 erq.

**KAN GJØRES VALGFRI** (PROFILE ONLY, ingen matching-tap):
- `selfDesc` (J i dag) → valgfri (PROF).
- `loveGive`, `loveReceive` (J i dag) → kan forblie påkrevd (de er kjernen av
  kjærlighetsspråk) eller valgfri; ingen matching-effekt uansett. **Anbefal: behold
  påkrevd, maks 3** (de er raske flervalg, ikke essays).
- `workType`, `housingType`, `householdSize`, `economicStability` (J i dag, PROF) →
  **valgfri** (J/K/M).
- `goodEveryday`, `buildTogether` (J i dag, PROF) → **valgfri** (E).
- `relationshipSeeking`, `closenessNeed` (J i dag, PROF) → **valgfri** (kan vurderes
  som HB senere, men det er matching-endring).
- `neverCrossBoundary`, `understandPartnersBoundaries` (J i dag, SAFETY/PROF) → kan
  beholde påkrevd (grenser = trygghetssignal til bruker), men ingen matching.

**KAN SLETTES** (påkrevd i dag, ingen verdi): ingen — alle 71 har en forklaring;
de 4 «livssituasjon»-feltene + 2 essays er de sterkeste kandidatene til å bli
**valgfri**, ikke slettet.

**OBS:** Ingen endres i denne planen (PLAN ONLY). Dette er klassifisering.

## V. SCALE QUESTIONS (49)
- **Dimensjoner som spiser dem:** values (pvq1–10), attachment (att_*, 12),
  personality (p1–15, v2), communication (comm1–6), emotionRegulation (erq_*, 6).
- **Alle 49 brukt?** **Ja.** Hvert item bidrar til én av de 5 psykom. skårene som
  `unifiedScore` veiter. Ingen fullstendig ubrukt skala-item.
- **Dupliserte lagrede verdier?** Nei — `psychometricAnswers` lagrer ett tall per
  item-id; skårene er deriverte og additive.
- **Konklusjon:** la dem være (oppgaven sier: hvis alle er genuint brukt, rør ikke).

## W. SECTION-LEVEL VALUE (per steg)

| Steg | Matching-verdi | Friksjon | Redundans | Rek. |
|---|---|---|---|---|
| 0 Grunnprofil | **HIGH** (alder/kjønn/religion/barn/radius) | MED | LOW | KEEP |
| 1 Personlighet | HIGH (15 skala) + lav (fritekst) | MED | MED (selfDesc) | SIMPLIFY |
| 2 Livssituasjon | MED (5 l2026) | **HIGH** (4 påkrevd PROF + 5 l2026) | **HIGH** (housing/household/responsibilities) | SIMPLIFY/REBUILD |
| 3 Tilknytning | **HIGH** (12 skala) | LOW | LOW | KEEP |
| 4 Kjærlighetsspråk | MED (PROF; potensiell matching) | LOW | LOW | KEEP (maks 3) |
| 5 Livsstil & verdier | HIGH (10 skala + 5 l2026) | MED | MED (lowPriority/undesired) | SIMPLIFY |
| 6 Relasjonsstil | MED (PROF) | LOW | MED | SIMPLIFY (valgfri) |
| 7 Framtid | LOW-MED (PROF) | MED (buildTogether) | MED | SIMPLIFY |
| 8 Kommunikasjon | HIGH (6 skala) | LOW | — | KEEP |
| 9 Grenser | MED (SAFETY/PROF) | LOW | LOW | KEEP |
| 10 Moden nysgjerrighet | MED (6 skala) + kastet (5) | MED | **HIGH** (5 ikke persistert) | **REBUILD** |

## X. CURRENT WORKLOAD (målt)
- **TOTAL INPUTS:** 129 (baseline: 123 — se §A)
- **REQUIRED:** 71 (stemmer nøyaktig)
- **OPTIONAL:** 58 (baseline: 52)
- **SCALE:** 49
- **FREE TEXT (multiline):** 11 (hvorav 3 påkrevde: selfDesc, goodEveryday, buildTogether)
- **Korte strukturerte tekstfelt:** 4 (identityName, age, city, postalCode)
- **SINGLE SELECT:** 24
- **MULTI SELECT:** 19
- **SLIDER:** 3 (distancePref, agePrefMin, agePrefMax)
- **TOGGLE:** 1 (religionOpen)
- **Valgvikt (Viktig):** 9
- **MINIMUM REQUIRED USER ACTIONS:** 71 (49 skalaskrav = 49 tap-klikk + 22 andre
  påkrevde valg). Fullførings-tid anslås **ikke** (oppgaven ber om ingen gjetting).

## Y. PROPOSED O2 WORKLOAD (estimat etter forenkling)
Basert på anbefalingene (ingen numerisk kvote — målet er mindre skriving, mindre
redundant inndata, like godt eller bedre signal):
- **TOTAL INPUTS:** ~104 (−25: slett ~15 døde/kastet + bodyType + boundary + 3
  lavt-verdige; gjør 4–5 livssituasjon-felt valgfri teller ikke ned i «totalt»,
  bare i «påkrevd»).
- **REQUIRED:** ~55 (−16: selfDesc, goodEveryday, buildTogether, workType,
  housingType, householdSize, economicStability, relationshipSeeking, closenessNeed,
  + lowPriority/undesired/responsibilities slettet).
- **FREE TEXT (multiline):** 8 (fra 11 — slett `boundary`, `selfDesc` valgfri;
  beholde valgfrie). **Påkrevd free-text: 0** (mål oppnådd).
- **Matching-signal:** uendret for alle SC/HB-felt (slettes ingenting matching-brukt).

## Z. STEP COUNT — 13 lettere vs færre tettere
- **13 lettere steg (i dag):** hver steg er kort, god progress-percepcjon, autosave
  per steg, lett resume, lav skrolledybde pr. steg. Skalastegene er isolert.
- **Færre tettere:** færre «Fortsett»-klikk, men høyere kognitiv belastning pr.
  steg, lengre skroll, verre mobile UX, økt risiko for forvirring og forlating.
- **Mobil-first vurdering:** ToSom er mobile-first. Kortere steg med én tanke i gang
  passer bedre med «rolig, trygt»-posisjoneringen og lavere forlaterisiko ved
  mellomlagring (autosave/resume fungerer per steg).
- **Anbefal: BEHOLD 13 steg** — O2 reduserer *innholdet* i hvert steg (fjerner
  påkrevde PROF-felt, essays, døde felt) uten å omstabe steg-antallet. Mindre
  innhold pr. steg = lettere 13-stegs-følelse uten implementasjonsrisikoen ved
  omstrukturering (prefill, resume, summary-nav, E2E).

---

## AA. SUMMARY IMPACT (O1 oppsummering, steg 11)
`Step9Oppsummering` er en ryddig gjennomgang (A–F + detaljseksjoner med «Endre»).
Før hver endring, hva skjer i oppsummeringen:

| Endring | Oppsummering-effekt |
|---|---|
| `selfDesc` → valgfri | Vises fortsatt (showIf) når fylt. Ingen strukturendring. |
| `goodEveryday`, `buildTogether` → valgfri | Vises når fylt. Ingen strukturendring. |
| `housingType`/`householdSize`/`economicStability`/`workType` → valgfri | Vises når fylt. Ingen strukturendring. |
| Slett `boundary` + 5 moden-felt (ikke persistert) | **Fjern «Moden nysgjerrighet»-seksjonens 5 rader** (ERQ6-skalaen beholdes som fullført skala-seksjon, ikke rause). |
| Slett `bodyType` | Viser i dag ikke uttalt i oppsummeringen → ingen endring. |
| Slett døde preferanser/humor-felt | Vises ikke i oppsummeringen → ingen endring. |
| Barn-rebuild (O2-B) | Oppsummeringen må vise de **4** nye radene (har/ønsker/åpen-for-bonus/må-stemme) i «Det som må stemme». |
| Religion (O2-D) | Uendret (egen + akseptstatus). |

**Prinsipp:** ikke redesign oppsummeringen — kun slett rader som ikke lenger finnes,
og legg til barn-radene. «Endre»-knappene peker på samme steg-indekser (uendret).

## AB. PREFILL / RESUME / MIGRASJON (til eldre utkast/profiler)
For hvert endret felt (til `toOnboardingData` + `onboardingDraft`):

| Felt | Migrasjon |
|---|---|
| `selfDesc`, `goodEveryday`, `buildTogether` (→ valgfri) | **DIRECTLY COMPATIBLE** (verdien pre-fylles; bare ikke lenger blokkerende). |
| `workType`/`housingType`/`householdSize`/`economicStability` (→ valgfri) | **DIRECTLY COMPATIBLE**. |
| `boundary` + 5 moden-felt (slettes fra UI) | **DROP FROM UI BUT PRESERVE DATA** — de ble aldri persistert, så ingen DB-data. Slett fra UI/draft; ingen backfill. |
| `bodyType` (slettes) | **DROP FROM UI BUT PRESERVE DATA** (`lifestyle.bodyType` beholdes i DB; vises bare ikke). |
| Døde preferanser/humor/legacy-felt | **DROP FROM UI** (ingenting å migrere — ikke persistert/altid tomt). |
| Barn-rebuild (C/D) | **MAP VALUE**: eksisterende `wantChildren` med `Bonusfamilie`-token → avled `openToPartnerWithChildren='ja'`; `Ja/Nei/Usikker` → `wantChildren` (B). Legacy uten token → **LEGACY FALLBACK** (nøytral) til gjenbesvart. |
| Religion (O2-D) | **DIRECTLY COMPATIBLE** (kun copy; data uendret). |

**Ingen eksisterende profildata slettes** (prinsipp: STOP COLLECTING ≠ DELETE DATA).

## AC. PROFILE EDIT — onboarding som profilredigering
Onboarding er i dag **også** den primære måten å fylle profilen på (prefill via
`toOnboardingData`). For slettede felt:
- **Behold verdien i DB** (ingen destruktiv rydding). Feltet vises bare ikke lenger
  i onboarding-UI.
- **`Profile.bio`** er tom i dag (onboarding skriver den ikke). Dersom selskapet vil
  at partneren skal se en bio, kan `selfDesc` (eller en ny kort bio) mappes til
  `Profile.bio` — men det er en **ny** display-endring, ikke en del av O2s
  forenkling. Notert som valgfri oppfølging.
- Strategi: **STOP COLLECTING** i onboarding, men historisk data kan fortsatt leses
  av admin/eksport (`/api/settings/export`) uten at det påvirker matching.

---

## AD. LEGAL / SENSITIVE FLAGS (ingen juridiske konklusjoner — LAWYER REVIEW: PENDING)
- **Religion:** O2-D endrer **kun** UI-copy. Hard-kompatibilitet + egen/aksept-datasett
  er uendret. **LAWYER REVIEW: PENDING** (uendret fra O1).
- **Barn/bonusfamilie (O2-B):** ny eksplicit dimensjon. Ikke personvern-kritisk
  (alder/barn er allerede samlet), men bør ha rolig, ikke-stigmatiserende copy.
  Vurder om «åpen for partner med barn» bør ha egen samtykke-avklaring. **LAWYER: PENDING.**
- **Mat (Q):** kun livsstil, ingen allergi/medisinsk data → **ingen sensitivt flagg.**
- **Fritekst (E):** ingen fritekstfelt gir i dag sikkerhets/moderasjonsverdi (se AD.1).
- **Privacy (K):** `householdSize` avslører husstandsstørrelse → gjøres valgfri.

### AD.1 — SAFETY (fritekst → moderasjon)
- **Spørsmål:** gir noen fritekstfelt i dag sikkerhets/moderasjonsverdi?
- **Svar (sporet):** Nei. Ingen konsument i `lib/security`, chat-moderasjon eller
  rapport-flyt leser onboarding-fritekst. `neverCrossBoundary`/`limitations`/
  `partnerMustUnderstand` er **profilsikkerhet** (brukerens egne grenser, vises kun i
  egen oppsummering), ikke automatisk innholdsmoderasjon.
- **Konsekvens av sletting:** ingen materiell taps av moderering. **Anbefal:** beholde
  `limitations`/`partnerMustUnderstand` **valgfri** (trygghets-signaler til partneren
  via fremtidig bio, ikke moderasjon); ingen er kritisk.

## AE. TEST PLAN (planert O2-matrise)

| ID | Test |
|---|---|
| O2-01 | Felt-inventar/antall: 129 live-felt; 71 påkrevd; 49 skala. |
| O2-02 | Fritekst-fravær: `boundary` finnes ikke i UI; 5 moden-felt ikke persistert. |
| O2-03 | Ingen **påkrevd** fritekst (selfDesc/goodEveryday/buildTogether → valgfri). |
| O2-04 | Barn-feltene er **separate** (A/B/C/D), ikke sammenbrente. |
| O2-05 | Bonusfamilie hard grense: C=Nei + må-stemme + partner HAR_BARN → **BLOCK** (begge veier). |
| O2-06 | Framtid-barn kompatibilitet: B=Ja vs B=Nei blokkerer (uendret Ja-vs-Nei). |
| O2-07 | Religion **egen** identitet beholdes (opptil 4). |
| O2-08 | Religion **akseptliste** beholdes (opptil 4). |
| O2-09 | Religion **bilateral** hard kompatibilitet (uendret; eksemplene i §G passerer). |
| O2-10 | Love giving **maks 3** (validering tillater 3, ikke 4). |
| O2-11 | Love receiving **maks 3**. |
| O2-12 | Food **maks 2**. |
| O2-13 | Activity utvidet sett (nøytrale alternativer; overlap-scoring uendret). |
| O2-14 | Prefill-kompatibilitet (endrede felt pre-fylles fra DB). |
| O2-15 | Legacy-profil trygg (BONUSFAMILIE-token → `openToPartnerWithChildren='ja'`; ingen crash). |
| O2-16 | Oppsummering samstemt (slekke rader borte; barn-radene tilstede). |
| O2-17 | **Matching-regression:** `cheapSjekkAll` ≡ `sjekkAlleDealbreakers` (ekvivalens). |
| O2-18 | **A18 frossen:** MIN_AGE=18; alder 18–99. |
| O2-19 | **99+ frossen:** agePrefMax=null → ingen maks-alder-sjekk. |
| O2-20 | **Canonical Product Truth frossen:** 14 dager, dag 8, lørdag 02–04 UTC, Bli Kjent 180, Oppgaver 135. |

---

## AF. IMPLEMENTATION PACKAGES

| Pkg | Innhold | Risiko | Matching-endring? |
|---|---|---|---|
| **O2-A** (SAFE SIMPLIFICATION) | Slett dødt/legacy-felt fra UI+skjema (preferanser, humor, bestSelf, maturityLevel); slett `boundary` + 5 moden-felt (ikke persistert) + `bodyType`; gjør 4 livssituasjon-felt + 3 essays valgfri; kanonisk flervalgs-copy. | **Lav** (ingen SC/HB-felt røres) | Nei |
| **O2-B** (CHILDREN / BONUS FAMILY) | Egen `openToPartnerWithChildren` (C) + `...Viktig` (D) i `lifestyle`-JSON; ny `checkBonusFamily` (tostidig, ma-stemme); fjern `Bonusfamilie`-token fra `wantChildren`; legacy-mapping; oppsummering. | **Middels** (ny hard grense + backfill) | **Ja** (ny HB + token-fjerning; krever O2-05/06/15/17) |
| **O2-C** (STRUCTURED CHOICE EXPANSION) | `loveGive`/`loveReceive` maks 3; `kosthold` maks 2 + refine alternativer; `aktivitet` utvidet nøytralt sett; kanonisk «Velg opptil X»-copy. | **Lav** (overlap/struktur, ingen vektendring) | Nei (med mindre kjærlighetsspråk skal kobles inn — se §P) |
| **O2-D** (RELIGION CLARITY) | Forenklet UI-copy (egen + aksept); verifisér tosidig hard matching (uendret); lawyer-flagg. | **Lav** (kun copy + test) | Nei (data + regel uendret) |

**Kan de pakkes og sendes sammen?**
- **O2-A + O2-C + O2-D: JA**, send sammen (alle lav risiko, ingen matching-endring,
  kan dele en «O2 forenkling»-release + test O2-01/02/03/07/08/09/10/11/12/13/14/16/17).
- **O2-B: send separat** (eget godkjenningspunkt for ny hard grense + backfill;
  test O2-04/05/06/15/17). Kan kjøre parallelt men må lande som egen, testet endring.
- **Kjørekjøring:** A → (B parallelt) → C/D. Ingen pakke rører A18/CPT/Bli Kjent/Oppgaver.

## AG. DECISION REGISTER (konsist)

| Item | Nåværende | Foreslått | Bevis | Risiko | Trenger George? | Trenger lawyer? | Matching-endring? |
|---|---|---|---|---|---|---|---|
| 3 påkrevde essays (selfDesc/goodEveryday/buildTogether) | PÅKREVDT | Valgfri | §E (PROF, ingen konsument) | Lav | **Ja** (produkt) | Nei | Nei |
| `housingType`/`householdSize`/`economicStability`/`workType` | PÅKREVDT | Valgfri | §J/K (PROF, ingen matching) | Lav | **Ja** | Nei | Nei |
| `boundary` + 5 moden-felt | Samlet, IKKE persistert | Slett fra UI | §C/T (0 ref. i setup) | Lav | Ja (bekrefte) | Nei | Nei |
| Døde preferanser/humor/legacy | Skjema uten UI | Slett fra skjema | §T (0 live-steg) | Lav | Nei (ren rydding) | Nei | Nei |
| Religion copy | Lang | Kort (egen + aksept) | §G (reglene korrekte) | Lav | Ja (tone) | **Ja (PENDING)** | Nei |
| Religion hard matching | Tostidig, ANY-overlap | Uendret | §G (verifisert) | — | Nei | Nei | **Nei (verifiser)** |
| Bonusfamilie (C+D) | Token i `wantChildren`, score-only | Eget felt + hard grense | §H/I (gap) | Middels | **Ja** | Ja (PENDING) | **Ja** |
| `loveGive`/`loveReceive` maks | 2 | 3 | §N/O (PROF i dag) | Lav | Ja (bekrefte 3) | Nei | Nei (med mindre kobles inn) |
| `kosthold` maks/alternativer | 1 / 5 (1 skrivfeil) | 2 / 5 rene | §Q | Lav | Ja | Nei | Nei |
| `aktivitet` sett | 5 (blandet) | 5 nøytrale | §R | Lav | Ja (tone) | Nei | Nei |
| Fritekst → partner bio (`Profile.bio`) | Tom (skriver aldri) | Valgfri mapping | §AC | Lav | **Ja** (produkt) | Nei | Nei |

## AH. FINAL RECOMMENDATION

1. **Hold religion helt** — data-modell og tosidig hard matching er allerede
   produktkorrekte (ALIGNED). O2-D er **bare copy** + test.
2. **Fjern friksjon uten matching-tap (O2-A):** slett døde/kastet/dublør-felt, gjør
   4 livssituasjon-felt + 3 essays **valgfri**. Mål: **0 påkrevde fritekstfelt.**
3. **Løs barn-gapet (O2-B)** med et lite, trygt JSON-tillegg (C + D) + tosidig
   hard grense — send separat, fullt testet (O2-04/05/06/15/17).
4. **Utvid strukturerte valg (O2-C):** love maks 3, food maks 2, aktivitet nøytralt.
5. **Behold 13 steg** — lette dem innvendig, ikke omstrukturert.
6. **Rør ikke** A18, Canonical Product Truth, 49 skala, Bli Kjent 180, Oppgaver 135.

O2 gjør onboarding **kortere i skriving, mindre redundant, like god i signal** —
uten å svekke religion- eller barn-grensene, og uten å slette historisk data.

---

## 47. STOPP — SVAR PÅ DE 47 PUNKTENE

1. **Totalt antall nåværende felt:** 129 (live) — baseline 123.
2. **Fritekst-antall:** 11 multiline (+ 4 korte strukturerte tekstfelt).
3. **Påkrevd fritekst:** 3 (`selfDesc`, `goodEveryday`, `buildTogether`).
4. **Felt faktisk brukt i matching:** 83 (49 skala + 34 ikke-skala). Ikke-skala: 12 grunn (`gender`,`seekingGender`,`age`,`agePrefMin`,`agePrefMax`,`wantChildren`,`height`,`religion`,`acceptedReligions`,`religionOpen`,`distancePref`,`postalCode`) + `children`,`smoking`,`lifestyle` + 10 l2026-verdifelt + 9 `Viktig`.
5. **Felt brukt som hard grense (HB):** 30 (12 grunn ovenfor, derav `wantChildren` via Ja-vs-Nei + 9 l2026-verdifelt med `ma-stemme` + 9 `Viktig`-gates). `children`/`smoking`/`lifestyle`/`klima` er SCORE, ikke HB.
6. **Score-only-felt:** `smoking`, `lifestyle`, `klima` (SC, ingen HB) + 10 l2026-verdifelt som scorer.
7. **Profile-only-felt:** ~39 (se §T, tredje gruppe) — inkl. alle fritekster, `loveGive/Receive`, `housingType`, `householdSize`, `workType`, `economicStability`, etc.
8. **Ubrukte felt:** døde (preferanser×10, humor×5, bestSelf, legacy) + samlet-men-kastet (moden×5) + `maturityLevel`/`securityLevel` (null).
9. **«Hvem er du når ting flyter naturlig?»** = `selfDesc`. **Faktisk hensikt:** PROFILE ONLY (egen oppsummering). Ingen matching, ingen partner-visning.
10. **Religion — egen identitet (nåværende):** `deepProfileData.religion`, opptil 4. BEHOLDES.
11. **Religion — akseptliste (nåværende):** `deepProfileData.acceptedReligions`, opptil 4. BEHOLDES.
12. **Religion — bilateral kompatibilitet (nåværende):** **ALIGNED** (tostidig hard regel).
13. **Multi-religion semantik:** **MINST ÉN OVERLAP PÅSSES** (ANY, ikke ALL).
14. **Barn — nåværende felt:** `children` (A) + `wantChildren` (B **+ C som token**).
15. **Bonusfamilie — nåværende sannhet:** score-only (+10), **ingen hard grense**.
16. **Ønsket bonusfamilie-gap:** mangler eget C-felt + D (må-stemme).
17. **Foreslått barn-modell:** A `children` · B `wantChildren` (uten token) · C `openToPartnerWithChildren` · D `...Viktig`.
18. **Boligsomrelevans:** lav → REMOVE/VALGFRI.
19. **Husstandstallsrelevans:** lav (privacy) → REMOVE/VALGFRI.
20. **Skjermrelevans:** lav-middels (SC+HB) → KEEP, stram spørsmålet.
21. **Ansvarsrelevans:** lav (dublør barn) → MERGE/REMOVE.
22. **Giving-love nåværende maks:** 2.
23. **Receiving-love nåværende maks:** 2.
24. **Love maks-3 kompatibilitet:** **COMPATIBLE** (feltet scorer ikke i dag).
25. **Mat — nåværende modell:** l2026 `kosthold` (1 valg, SC .06 + HB) + død `dietPreference`.
26. **Mat — foreslått modell:** maks 2, ~5 rene livsstil-alternativer (ingen allergi).
27. **Aktivitet — nåværende modell:** multi 3, SC .05 + HB (overlap).
28. **Aktivitet — foreslått modell:** 5 nøytrale alternativer, maks 3.
29. **Felt trygt å slette:** døde/legacy, `boundary`+moden×5, `bodyType`, `lowPriority`, `undesiredLifestyle`, `responsibilities`.
30. **Felt å erstatte med strukturert inndata:** de 3 essays → valgfri (eventuelt `selfDesc` → kort bio); resten er allerede strukturert.
31. **Felt som bør forbli fritekst (valgfri):** `quirk`,`smallThing`,`dreamGoal`,`importantBoundary`,`limitations`,`partnerMustUnderstand`,`independenceBalance`.
32. **Nåværende totalt antall inndata:** 129.
33. **Foreslått totalt antall inndata:** ~104.
34. **Nåværende påkrevd inndata:** 71.
35. **Foreslått påkrevd inndata:** ~55.
36. **Anbefalt antall steg:** **behold 13**.
37. **Matching-påvirkning:** O2-A/C/D = ingen; O2-B = +1 hard grense (bonusfamilie) + fjerner `Bonusfamilie`-token (krever O2-05/06/15/17).
38. **Oppsummering-påvirkning:** slett 5 moden-rader + `bodyType`; legg til 4 barn-rader (O2-B).
39. **Legacy-påvirkning:** DROP FROM UI, behold DB-data; `Bonusfamilie`-token → map til C; ingen migrasjon (JSON).
40. **Juridiske flagg:** religion (kun copy, PENDING) · barn (ny dimensjon, PENDING) · mat (ingen).
41. **Sikkerhetspåvirkning:** ingen (ingen moderasjonskonsument på fritekst).
42. **O2-testplan:** O2-01 … O2-20 (se §AE).
43. **Anbefalte pakker:** O2-A + O2-C + O2-D sammen; O2-B separat.
44. **Beslutninger som trengs fra George:** (1) 3 essays → valgfri? (2) 4 livssituasjon-felt → valgfri? (3) love max 3 bekrefte? (4) food/aktivitet copy-toning? (5) bonusfamilie C+D godkjenne (O2-B)? (6) `selfDesc` → partner-bio?
45. **Endrede filer:** `docs/ONBOARDING-O2-FIELD-AUDIT-PLAN-v1.0.md` (ny).
46. **Git-status:** kun denne nye doc + eksisterende ubehandlede `docs/IDENTITY-TRUST-PLAN-v1.0.md`, `tmp/`. Tracked tree uendret.
47. **Endelig anbefaling:** Hold religion; fjern friksjon uten signal-tap (O2-A); løs barn-gapet (O2-B, separat); utvid strukturerte valg (O2-C); behold 13 steg; rør ikke frosne verdier.

---

## AVSLUTNING

```
ONBOARDING O2 FIELD AUDIT: COMPLETE
CURRENT INPUTS: 129
PROPOSED INPUTS: ~104
FREE-TEXT: REDUCE (11 → 8; ingen påkrevde)
REQUIRED FREE-TEXT: 0 (fra 3)
BONUS-FAMILY MODEL: PARTIAL → ALIGNED (etter O2-B)
RELIGION OWN IDENTITY: KEEP
RELIGION PARTNER ACCEPTANCE: KEEP
RELIGION BILATERAL MATCHING: ALIGNED
LOVE MAX 3: COMPATIBLE
FOOD MAX 2: COMPATIBLE
ACTIVITY: EXPAND
STEP COUNT: KEEP (13)
A18: FROZEN
CANONICAL PRODUCT TRUTH: FROZEN
IMPLEMENTATION: NOT STARTED
COMMIT: NO
PUSH: NO
DEPLOY: NO
```

> **PLAN ONLY.** Ingen felt er slettet, ingen alternativ lagt til, ingen matching,
> barn-logikk, religion, fritekst, validering, oppsummering, steg-antall eller tester
> endret. Ingen commit/push/deploy. `docs/IDENTITY-TRUST-PLAN-v1.0.md` urørt.
> Neste steg: Georges godkjenning på avgjørelsene i §AG, deretter «kjør» for å starte
> O2-A (og parallelt O2-B som separat pakke).































