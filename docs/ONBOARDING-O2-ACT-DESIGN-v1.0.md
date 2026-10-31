# TOSOM — ONBOARDING O2 ACT DESIGN
## FINAL PRODUCT SPEC / FIELD-BY-FIELD DECISIONS
## PLAN ONLY — ingen implementasjon

> **Kilde:** `docs/ONBOARDING-O2-FIELD-AUDIT-PLAN-v1.0.md` · **Baseline:** `main` = `origin/main` = `e31620d` · **Prod:** `www.tosom.no` = HTTP 200
>
> **PLAN ONLY.** Dette dokumentet er implementerings-**AUTORITET** (final spec table, §AF).
> Ingen kode, skjema, validering, matching, UI, fritekst, tester, commit, push eller deploy
> er endret i denne fasen. **A18 / Canonical Product Truth / Onboarding O1 / Bli Kjent V2 / Oppgaver V2 = FROSE.**
> Alt som ikke står i §AF (final spec table) er **OUT OF SCOPE**.

---

## A. EXECUTIVE DECISION SUMMARY

O2 gjør onboarding **FASTER / CLEARER / LESS TEXT-HEAVY / MORE STRUCTURED / BETTER FOR MOBILE**
uten å redusere nyttig matching-informasjon. Prinsipp (§1): et felt som Tosom ikke bruker for
**MATCHING · HARD BOUNDARY · PROFILE VALUE · SAFETY · LEGAL** trenger en sterk grunn til å bli
beholdt. «Samlet under onboarding» ≠ «brukt i matching» — O2 sletter kun felt uten slik hensikt.

| Område | Beslutning |
|---|---|
| **Fritekst (multiline)** | **11 → 0.** Alle 3 påkrevde essays + 8 valgfrie slettes. |
| `selfDesc` / `goodEveryday` / `buildTogether` | **REMOVE** (profile-only, ingen matching, ingen partner-visning). |
| **Bio** | **C — urørt for beta** (bio levereres utenfor onboarding; onboarding = strukturert matching). |
| **Moden-seksjon (5 felt) + `bestSelf`** | **REMOVE FROM UI** (samles men persisteres i dag → slettes; **ERQ-6-skalaen beholdes**). |
| **Døde preferanser/humor/legacy** | **STOP WRITING + KEEP FOR LEGACY READ** (ingen sletting av lagret data). |
| **Religion** | **BEHOLD** (egen identitet + partner-aksept, opptil 4). Kun **copy** endres. Matching = **tostidig hard, ANY-overlap** (uendret). |
| **Barn (A/B/C/D)** | **Separat modell**: `hasChildren` / `wantsChildren` / **`openToPartnerWithChildren` (C)** / **`partnerWithChildrenViktig` (D)**. Ny **tostidig hard grense** (P2). |
| **Bonusfamilie** | Token i `wantChildren` beholdes som **soft score** (ingen hard-inferens fra legacy); ny hard grense kun via eksplisitt **C=Nei + D=Må stemme**. |
| **Housing / Household / Responsibility** | **REMOVE** (ingen matching-konsument). |
| **Skjerm** | **REWRITE** (spesifikkere spørsmål), behold SC .04 + HB. |
| **Love give/receive** | **MAX 3** (fra 2), fortsatt påkrevd (profile-only, **ingen matching-effekt**). |
| **Food (`kosthold`)** | **MAX 2** (fra 1), nøytrale alternativer; «spiser det meste» ⊕ vegetar/vegan; scoring uendret, HB → matrise-par. |
| **Aktivitet** | **Bevare 5 verdier + overlap** (nøytrale labels); **ingen numerisk scoring** (overlap i dag). |
| **Steg-antall** | **Behold 13** (inget steg blir tomt). |
| **Felter (totalt)** | **129 → 106** (−25 slettet, +2 nye). |
| **Påkrevd** | **71 → 64** (−7 slettet; ingen required→optional). |
| **Pakker** | **P1 Simplification** → deploy/checkpoint, deretter **P2 Bonus Family** → deploy/checkpoint. |

---

## B. LOCKED BASELINE (åpnes ikke)

| Konstant | Verdi |
|---|---|
| `MIN_AGE` | **18** |
| Ny default alderssøk | **18–40** |
| Aldersområde | **18–99+** (`agePrefMax = null` = 99+ = åpen) |
| Matching | **UKENTLIG / natt til lørdag** |
| Reise | **14 dager** |
| Foto | **dag 8** |
| Bli Kjent | **180** |
| Personlighetsskalaer | **49** (TOSOM 15 · ATTACHMENT 12 · PVQ 10 · COMM 6 · ERQ 6) |
| Matching-motor | 6 dimensjoner + 10 dealbrakere (`unifiedScorer` / `dealbreaker` / `cheapFeatures`) |

---

## C. FREE-TEXT DECISIONS (alle 11)

**Mål: REQUIRED FREE-TEXT = 0 · FINAL FREE-TEXT (multiline) = 0.**
Sporet i `partnerProfile.ts` (eksponerer kun `bio`) + `setup/route.ts` (skriv-mål): **ingen**
av disse fritekstfeltene har matching-effekt og **ingen vises til partneren** — de tjener kun
som selvgjennomgang i brukerens egen oppsummering. Sletting gir derfor **null tap** av
matching- og partnersignal.

| # | Felt | Nåværende copy | Faktisk hensikt (sporet) | FINAL DECISION |
|---|---|---|---|---|
| 1 | `selfDesc` (påkrevd, min 10, `personality`) | «Hvem er du når ting flyter naturlig?» | PROFILE ONLY — egen opps., ingen matching, ingen partner | **REMOVE FROM ONBOARDING** (§3; erstattes IKKE med nytt essay) |
| 2 | `goodEveryday` (påkrevd, min 10, `lifestyle`) | «Hva gjør en god hverdag?» | PROFILE ONLY | **REMOVE FROM ONBOARDING** (§4; strukturert onboarding fanger allerede signalet) |
| 3 | `buildTogether` (påkrevd, min 10, `futureVision`) | «Hva kan dere bygge sammen?» | PROFILE ONLY | **REMOVE FROM ONBOARDING** (§4) |
| 4 | `quirk` (valgfri, `personality`) | «En vane du ler av?» | PROFILE ONLY | **REMOVE** (§5: ingen matching/partner/safety/legal) |
| 5 | `importantBoundary` (valgfri, `emotionalNeeds`) | «Hvilken grense er viktigst?» | PROFILE ONLY (ingen håndhevet safety-konsument) | **REMOVE** (ekte consent/grense = separat partner-synlig funksjon, utenfor O2 — flagg §AB/§AG) |
| 6 | `smallThing` (valgfri, `intimacy`) | «Små ting som betyr mest?» | PROFILE ONLY | **REMOVE** |
| 7 | `independenceBalance` (valgfri, `relasjonsStil`) | «Selvstendighet vs fellesskap?» | PROFILE ONLY | **REMOVE** |
| 8 | `dreamGoal` (valgfri, `futureVision`) | «Største drøm?» | PROFILE ONLY | **REMOVE** |
| 9 | `limitations` (valgfri, `boundaries`) | «Dine viktigste avgrensninger?» | PROFILE ONLY | **REMOVE** |
| 10 | `partnerMustUnderstand` (valgfri, `boundaries`) | «Hva må partneren forstå?» | PROFILE ONLY | **REMOVE** |
| 11 | `boundary` (valgfri, **moden**) | «Hva er din personlige grense?» | **IKKE PERSISTERT** (moden-seksjonen kastes i `setup`) | **REMOVE FROM UI** (slettes med hele moden-seksjonen, §7) |

**Ingen uavklart felt.** Alle 11 → **REMOVE**. Resultat: **0 fritekst** i onboarding.
Kort strukturert tekst som **beholdes**: `identityName` (50, påkrevd), `age`, `city` (100,
påkrevd), `postalCode` (4 siffer, påkrevd) — identitet/radius/privacy.

---

## D. DEAD / DISCARDED FIELDS

### D.1 — Samlet men IKKE persistert (moden-seksjonen + `bestSelf`)

`setup/route.ts` dekonstruerer og validerer `moden`, men **skriver aldri seksjonen til profilen**
(PL-10: «moden» brukes ikke lenger; `maturityLevel`/`securityLevel` skrives `null`). Prefill
(`toOnboardingData`) leser dem derfor heller ikke. Dette er ikke akseptabelt som slutt-design.

| Felt | Status i dag | Beslutning |
|---|---|---|
| `intimacySafety`, `comfortableWith`, `nearerType`, `needsTime` (select-grid, `modenSchema`) | Samlet + valideres, **kastes** | **REMOVE FROM UI** (default: IKKE start persistere ubrukt data) |
| `boundary` (fritekst, `modenSchema`) | Samlet + valideres, **kastes** | **REMOVE FROM UI** (med §C #11) |
| `bestSelf` | I `ProfileData`/`initialData`, rendres i intet live-steg, ikke persistert | **REMOVE** (dødt, §D.2) |
| **`erq_1`–`erq_6` (ERQ-6-skalaen, samme steg)** | **PERSISTERT + scoret** (SC .10, emotionRegulation) | **BEHOLD** (steg 10 blir rent skalasteg, se §W) |

### D.2 — Døde legacy-felt (ingen live-UI / ingen meningsfull konsument)

| Gruppe | Felter | Klassifisering (ingen sletting av lagret data) |
|---|---|---|
| Døde preferanser (`preferanserSchema` → `deepProfileData`) | `dietPreference`, `sleepSchedule`, `pets`, `travelFreq`, `alcoholFreq`, `ambitionLevel`, `structureSpontaneity`, `introExtrovert`, `politicsImportance`, `religionImportance` | **STOP WRITING** (always empty) + **KEEP FOR LEGACY READ** (historisk, null) |
| Død humor (`humorSchema` → `boundaries`) | `laughterTrigger`, `quirkyHabit`, `guiltyPleasure`, `totallyYou`, `partnerWouldLaugh` | **REMOVE FROM VALIDATION/SETUP** + **KEEP FOR LEGACY READ** (ingen live-steg renderer dem) |
| `bestSelf` | `bestSelf` | **REMOVE FROM TYPES/SETUP** + **KEEP FOR LEGACY READ** |
| Legacy `ProfileData`-nøkler | `firstName`, `seeking`, `maxDistance`, `minAge`, `maxAge`, `location`, `energy/drain/pressure/habits` | **HISTORICAL ONLY** (sendes men ubrukt) |
| Profile-kolonner | `maturityLevel`, `securityLevel` | **HISTORICAL ONLY** (skrives `null`, PL-10) |

**Prinsipp:** *REMOVE FROM ONBOARDING UI* ≠ *DELETE FROM DATABASE*. O2 **stopper å skrive**
nye verdier for døde felt, men **beholder** alt lagret data (ingen migrasjon, ingen sletting).

---

## E. RELIGION — FINAL SPEC (låst produktmodell)

**Data-modell ENDRES IKKE** (verifisert sporet i `dealbreaker.ts` / `setup/route.ts` /
`toOnboardingData.ts`). To uavhengige datasett + én eksplisitt tilstand, alle i `deepProfileData`:

| Konsept | Felt | Repr. | Maks | Matching |
|---|---|---|---|---|
| **A. EGEN IDENTITET** («What describes me?») | `religion` | kommaseparert | **4** | HARD (target-side) |
| **B. PARTNER-AKSEPT** («What am I open to?») | `acceptedReligions` | kommaseparert | **4** | HARD (accepter-side) |
| **C. ÅPEN FOR ALLE** | `religionOpen` (bool) | boolean | — | Fjerner brukerens egen gate |

Ordforråd (11, uendret): `kristen, katolsk, agnostiker, ateist, muslim, jehovas-vitne, hindu,
judedom, buddhist, spirituell, annet`. **Ikke foreslått fjerning av religion — begge konsepter
blir beholdt** (§9 låst). O2-D endrer **kun copy** (under), aldri data-modell eller regel.

### E.1 — FINAL UI COPY

**A. Egen identitet**
- Heading: **«Religion / livssyn»**
- Helper: **«Velg det som beskriver deg.»**
- (flervalg, maks 4)

**B. Partner-aksept**
- Heading: **«Hvilke religioner/livssyn er du åpen for hos en partner?»**
- (flervalg, maks 4) + eksplisitt valg **«Åpen for alle»** (sentinelen `OPEN_TO_ALL`, normaliseres
  til `religionOpen` i `setup` — uendret mekanikk).
- **Hard-grense-forklaring (kun det essensielle):**
  «Dette er en fast grense. Vi kobler deg kun med noen hvis du er åpen for religionen/livssynet
  hans/hennes — og hun/han for din.»

**Fjernes / legges ikke til:** Ingen «Mange har røtter i flere tradisjoner…». Juridisk/consent-
informasjon holdes i sin egnede juridiske/hjelpsplassering (utenfor onboarding). Den eksisterende
R-12-hindevirksomheten (`religionSelfAccept.ts` → `getReligionSelfAcceptHint`) beholdes
(ren informasjonshint, endrer ikke regelen).

### E.2 — MULTI-IDENTITY: RETAIN MAX 4

**Anbefaling: BEHOLD opptil 4** (både egen identitet og akseptliste). Grunn (basert på faktisk
kompatibilitetsmodell, IKKE forenkling for forenklings skyld):
- Matching er **ANY-overlap** (minst én snitt = passer). Hvert ekstra legitimt identitetsvalg
  gir en egen «pass»-mulighet; opptil 4 er allerede generøst og dekker realistiske
  multi-identiteter (f.eks. `kristen + spirituell + judedom`).
- Redusere maks (f.eks. til 2) gir **ingen** matching-gevinst og risikerer å underrepresentere
  en reel multi-identitet uten kompensasjon.
- **Konklusjon: maks 4 beholtes; endres ikke.**

---

## F. RELIGION — MATCHING EXAMPLES (O2 implementeringssannhet)

Regel (uendret fra dagens kode — `checkReligionOneWay` + `checkReligionCompat`, og
speilet i `cheapFeatures.religionOneWay`):

```
oneWay(accepter, target) =
   PASS  om  accepter.religionOpen === true              // ÅPEN FOR ALLE (fjerner EGEN gate)
   PASS  om  accepted(accepter) er tom                    // MISSING (legacy/ikke svart) → ingen begrensning
   PASS  om  own(target) er tom                           // target sin egen tro ukjent → kan ikke vurdere
   PASS  om  ∃ r ∈ own(target) : r ∈ accepted(accepter)   // MINST ÉN overlap (ANY) → akseptert
   BLOCK ellers
twoWay(a, b) = BLOCK  om  oneWay(a,b) ELLER oneWay(b,a) er BLOCK
```

| Scenario | A (egen / aksept / open) | B (egen / aksept / open) | oneWay A→B | oneWay B→A | RESULT |
|---|---|---|---|---|---|
| **§12-eksempel** | egen=`judedom` / aksept=`[kristen, ateist]` / open=f | egen=`judedom` / aksept=`[judedom]` / open=f | own(B)=judedom ∉ {kristen,ateist} → **BLOCK** | own(A)=judedom ∈ {judedom} → pass | **BLOCK** (B aksepterer ikke jødske) |
| Speil / tosidig | egen=`judedom` / aksept=`[judedom]` / f | egen=`kristen` / aksept=`[judedom]` / f | own(B)=kristen ∉ {judedom} → **BLOCK** | own(A)=judedom ∈ {judedom} → pass | **BLOCK** (A aksepterer ikke kristen) |
| **Open-to-all** | egen=`muslim` / — / **open=t** | egen=`kristen` / aksept=`[muslim]` / f | A open → pass | own(A)=muslim ∈ {muslim} → pass | **PASS** |
| Open fjerner kun EGEN gate | egen=`muslim` / — / **open=t** | egen=`kristen` / aksept=`[kristen]` / f | A open → pass | own(A)=muslim ∉ {kristen} → **BLOCK** | **BLOCK** |
| **Multi-identitet (ANY)** | egen=`kristen, judedom` / — / f | egen=`ateist` / aksept=`[judedom]` / f | own(A)={kristen,judedom}; judedom ∈ {judedom} → **PASS** | (A open? nei) own(B)=ateist; A aksept tom → pass | **PASS** |
| **Missing (legacy)** | egen=`kristen` / aksept=**tom** / f | egen=`muslim` / aksept=`[muslim]` / f | accepted(A) tom → **PASS** | own(A)=kristen; accepted(B)={muslim} → BLOCK | **BLOCK** (B side) |
| Begge mangler | egen=`kristen` / aksept=tom | egen=`muslim` / aksept=tom | pass (missing) | pass (missing) | **PASS** (ingen blokkering) |

**Viktige egenskaper (beholdes):** (1) tosidig; (2) **MINST ÉN** overlap passer (ANY, ikke ALL);
(3) `open` fjerner kun brukerens **egen** gate, ikke partnerens; (4) MISSING ≠ OPEN (skilles ved
om `religionOpen` eksisterer); (5) kjører som dealbreaker **FØR scoring** — en høy score kan
aldri overstyre. **O2 endrer INGEN av dette** — kun copy i §E.1.

---

## G. CHILDREN — FINAL MODEL (A / B / C / D)

Godkjent separasjon av fire uavhengige signal. Repo-navngivning (camelCase), lagring i `lifestyle`
(JSON-kolonne — **ingen migrasjon**):

| Dim. | Konsept | Felt (repo) | Lagret i | Verdier | Påkrevd? | Matching |
|---|---|---|---|---|---|---|
| **A** | Har barn i dag | `children` (**navn beholdes**) | `lifestyle.children` | `har-små-barn`, `har-barn`, `har-vaksen-barn`, `har-ikke-barn` (multi) | Valgfri | SC .2 (`children`) + inngang til bonus |
| **B** | Ønsker barn i fremtiden | `wantChildren` (**navn beholdes**) | `lifestyle.wantChildren` | `ja`, `usikker`, `nei` (**`Bonusfamilie`-token FJERNES fra alternativene**) | Valgfri | HB (Ja-vs-Nei) + SC .4 (uten bonus) |
| **C** | Åpen for partner med barn | **`openToPartnerWithChildren`** (NY) | `lifestyle.openToPartnerWithChildren` | `ja`, `nei`, `usikker` (single) | Valgfri | HB (kun med D) + soft bonus (C=ja) |
| **D** | Viktighet av C (must-match) | **`partnerWithChildrenViktig`** (NY) | `lifestyle.partnerWithChildrenViktig` | `fint-om-det-passer`, `ma-stemme` | Valgfri | Gjør C til HARD grense (kun `ma-stemme`) |

**Navn:** A/B gjenbruker eksisterende `children`/`wantChildren` (unngår migrasjon); C/D er nye
camelCase-nøkler i `lifestyle` som speiler den eksisterende `...Viktig`-konvensjonen.

### G.1 — UX COPY (norsk, §14)

- **A:** «Har du barn?»
- **B:** «Ønsker du barn i fremtiden?»
- **C:** «Er du åpen for å bli kjent med noen som allerede har barn?»
  - Helper: **«Dette handler om barn en partner allerede har.»** (kort — ingen lang forklaring)
- **D:** «Hvor viktig er dette for deg?» → **«Fint om det passer»** / **«Må stemme»**

---

## H. BONUS-FAMILY — MATCHING MATRIX (O2-B)

**Uavhengighet (kjernepunkt §15):** B (fremtidige barn) og C (partner som allerede har barn) er to
separat signal med to separate grenser. **B = `ja` impliserer IKKE C = `ja`.**

Ny hard grense (tostidig) — `checkBonusFamily`, wiret inn i `sjekkAlleDealbreakers` + `cheapSjekkAll`:

```
bonusFamilyOneWay(accepter, target) =
   BLOCK om:
     accepter.openToPartnerWithChildren === 'nei'
     AND  accepter.partnerWithChildrenViktig === 'ma-stemme'
     AND  harBarnFraFor(target.children) ∈ {har-små-barn, har-barn, har-vaksen-barn}
   PASS ellers
twoWay = BLOCK om oneWay(a,b) ELLER oneWay(b,a) er BLOCK
```

| A | C (accepter) | D | Target har barn | oneWay resultat |
|---|---|---|---|---|
| A har barn | **C = nei** | **ma-stemme** | Ja (target=B har barn) | **BLOCK** (A aksepterer ikke, må stemme) |
| A har barn | **C = nei** | **fint-om-det-passer** | Ja | **PASS** (soft — ingen hard blokk; kun score minus/ingen bonus) |
| A har barn | **C = ja** | (moot) | Ja | **PASS** + soft bonus (+10) |
| A har barn | **C = usikker** | (valgfri) | Ja | **PASS** (usikker = aldri hard blokk) |
| A ingen barn | C = nei | ma-stemme | Nei (target har ingen barn) | **PASS** (ingen barn hos target → ingen konflikt) |

**Soft bonus (utvidet, SC .? — `scoreLifeSituationCompat` i `dimensions.ts`):**
- I dag: `erApenForBonusfamilie(wantChildren)` (token) && `harBarnFraFor(children)` → **+10**.
- O2: `(erApenForBonusfamilie(wantChildren) OR openToPartnerWithChildren === 'ja')` && partner har
  barn → **+10**. (Legacy-token OG ny C=ja gir begge bonus; ingen regresjon for eksisterende.)

**Hverken C=nei+fint, C=usikker, C=ja eller mangel gir HARD blokk** — kun **C=nei + D=ma-stemme**
gjør det. Brukeren kontrollerer selv hvor hardt det skal være (§18): ingen auto-hard «Nei».

---

## I. LEGACY CHILDREN / BONUS-FAMILY STRATEGY

Eksisterende profiler kan inneholde legacy-token `Bonusfamilie` i `wantChildren` (soft score,
**aldri** hard). Valgt strategi: **READ LEGACY + WRITE NEW + soft prefill — ingen data-tap,
ingen stille hard-inferens fra et historisk soft-token** (§17).

| Aspekt | Regel |
|---|---|
| **Data-bevaring** | `wantChildren` (med token) **bevares** i DB. O2 sletter ingenting. Token drives fortsatt soft bonus. |
| **Soft score (matching)** | Behold lesing av legacy-token → gamle profiler bevarer +10. Ny `C=ja` gir også +10 (union). |
| **Hard grense (matching)** | Gamle profiler har **ingen** C/D → C behandles som mangler/`usikker` → **INGEN hard blokk**. Vi infererer aldri en HARD-prefrens fra det historiske SOFT-tokenet. |
| **Prefill — C** | Legacy-token til stede → pre-fill **C=`ja`** (de sa «åpen for bonusfamilie»). Ingen token → **C=`usikker`**. (Soft mapping — ikke hard.) |
| **Prefill — D** | **Alltid default `fint-om-det-passer`**. Aldri pre-fille `ma-stemme` (aldri inferer hard fra soft). |
| **Prefill — B** | Stripp `Bonusfamilie`-token fra B (den flyttes semantisk til C); bevar B `ja`/`usikker`/`nei`. |
| **Write (nytt svar)** | Når brukeren fyller C/D, skriv dem til `lifestyle`. Token kan forblive (harmless) eller renses ved write — **bevar er sikrest**. |
| **Re-ask** | Ikke påtvunget; tilbyes ved profil-redigering / ny onboarding. |

**Konklusjon:** Sikreste tilnærming, **no data loss**, **no silent hard inference**. Eksisterende
brukere mister ingen matching (soft bonus bevart) og får aldri en ny hard blokk uten eksplisitt valg.

---

## J. HOUSING — «Hva bor du i?» (`housingType`)

| | |
|---|---|
| I dag | Select, **påkrevd**. Lagres i `lifestyle`/livssituasjon. |
| Matching-konsument | **Ingen** (verken i `dimensions.ts` eller `dealbreaker.ts`). |
| Partner-visning | Nei. |
| **Beslutning** | **REMOVE** (bias bekreftet — ingen reell matching-effekt). |
| Signal som tapes | **Ingen** (ingen konsument). Fjerner ett påkrevd valg. |
| Legacy | Stop writing new value; behold lagret verdi (historisk). |

## K. HOUSEHOLD COUNT — «Hvor mange bor det i hjemmet?» (`householdSize`)

| | |
|---|---|
| I dag | Select, **påkrevd**. |
| Matching-konsument | **Ingen**. |
| Vurdering | Dublør av barn-signal; midlertidige bolig-oppsett; **privacy** (antall personer i hjemmet). |
| **Beslutning** | **REMOVE**. |
| Signal som tapes | **Ingen** (ingen matching); privacy-gevinst ved å ikke be om husstandsstørrelse. |
| Legacy | Stop writing; behold lagret (historisk). |

## L. SCREEN — «Hvordan er det med skjerm?» (`skjerm`)

| | |
|---|---|
| I dag | Select (`mye`, `moderat`, `vil-skru-ned`, `ubestemt`) + `skjermViktig`. **SC .04 + HB** (når `ma-stemme`). |
| Matching-konsument | **JA** — `livsstil2026Items` (SC .04) + `checkLifestyle2026` (HB). Spørsmålet er bare vagt. |
| **Beslutning** | **REWRITE + KEEP** (konseptet har reell matching-verdi; spesifisér spørsmålet). |
| Ny copy | **«Hvor mye plass har skjerm og telefon i hverdagen din?»** |
| Verdier / vekt / HB | **Uendret** (`mye`/`moderat`/`vil-skru-ned`/`ubestemt` + `Valgvikt` + HB). Ingen matching-endring. |

## M. RESPONSIBILITY — «Hva ansvar har du i livet ditt?» (`responsibilities`)

| | |
|---|---|
| I dag | Select/valgfri. Vag «ansvar»-kategoribil. |
| Matching-konsument | **Ingen**. Nyttig signal dekles allerede av barn (`children`), jobb, dyr, bosted. |
| **Beslutning** | **REMOVE** (dublør/vag). |
| Signal som tapes | **Ingen** (ingen konsument). |

## N. LOVE GIVING — «Hvordan viser du kjærlighet?» (`loveGive`)

| | |
|---|---|
| I dag | **Multi 2, påkrevd**. Alternativer: `ord`, `tjenester`, `tid`, `kjønnlig`, `gaver`. |
| Matching-konsument | **Ingen** (profile-only; finnes IKKE i `dimensions.ts`/`dealbreaker.ts`/`cheapFeatures.ts`). |
| **Beslutning** | **MAX 3** (fra 2), **beholdt påkrevd** (profile-verdi, lav friksjon). |
| Ny copy | «Hvordan viser du kjærlighet?» · «**Velg opptil tre.**» |
| Alternativer | **Gjenbruke de 5 eksisterende** (ingen regenerering). |
| Matching-påvirkning | **Ingen** (§P-behandling: profile-only; max 2→3 endrer ingenting i motoren). |

## O. LOVE RECEIVING — «Hvordan ønsker du kjærlighet?» (`loveReceive`)

| | |
|---|---|
| I dag | **Multi 2, påkrevd**. Samme 5 alternativer (receive-varianter). |
| **Beslutning** | **MAX 3**, **beholdt påkrevd**. |
| Ny copy | «Hvordan ønsker du kjærlighet?» · «**Velg opptil tre.**» |
| Alternativer | Gjenbruke de 5 (`ord`, `tjenester`, `tid`, `kjønnlig`, `gaver`). |
| Konsept | **Gis og mottas holdt konseptuelt distinkte** (separate felt/labels). |
| Matching-påvirkning | **Ingen** (profile-only). |

> **§25 bekreftet:** Love-feltene scores **IKKE** i dag (profile-only). Endring max 2→3 har derfor
> **null matching-effekt**. Ingen scoring innføres i O2.

## P. FOOD — «Hvordan spiser du?» (`kosthold`)

| | |
|---|---|
| I dag | **Single select** + `kostholdViktig`. SC .06 (`categoryMatch`) + HB (`LIVSSTIL2026_KOMPAT['kosthold']`). |
| **Beslutning** | **MAX 2** (fra 1), nøytrale livsstils-alternativer (ingen allergi/sykdom), max 2 valg. |

**Alternativer (verdi-token beholdes → ingen migrasjon; kun labels oppdateres til nøytralt):**

| Verdi (uendret) | Ny label |
|---|---|
| `spiser-koett` | **Spiser det meste** |
| `fleksitar` | **Mest plantebasert** |
| `vegetar` | **Vegetar** |
| `vegan` | **Vegan** |
| `fisk` | **Fokus på fisk** |

**Velg-begrensning:** `spiser-koett` («Spiser det meste») **konflikterer med** `vegetar`/`vegan`
(kan ikke velge «spiser det meste» OG «vegetar/vegan» samtidig). De øvrige kombineres fritt (maks 2).
**Lagring:** kommaseparert (som `aktivitet`). **Ingen allergi/medisinsk restriksjon samles.**

**§27 Matching-påvirkning (sporet):**
- **Scoring:** `categoryMatch` (Jaccard over kommasett) er **allerede bevisst på flere verdier** (multi-aware) →
  **ingen endring** for max 2 (vekt .06, gate `kostholdViktig` uendret).
- **Hard grense:** `isKompatibel`/`isL2026Kompatibel` bruker i dag en single-verdi-matrise for
  `kosthold`. For max 2 generaliseres til: **kompatibel ∃ aVal∈A, bVal∈B slik at
  `KOMPAT[aVal] ∋ bVal ∨ KOMPAT[bVal] ∋ aVal`** (direkte generalisering av dagens matrise-par-tjekk,
  ikke ren overlap — bevarer hierarkiet f.eks. vegan↔fisk). Filer: `lib/matching/dealbreaker.ts`
  (`isKompatibel`) + `lib/matching/cheapFeatures.ts` (`isL2026Kompatibel`).

## Q. ACTIVITY — «Hvor aktiv er du?» (`aktivitet`)

| | |
|---|---|
| I dag | **Multi maks 3** + `aktivitetViktig`. SC .05 (`categoryMatch`) + HB (**overlap**, ≥1 felles). |
| **Beslutning** | **Bevare 5 verdier + overlap-scoring** (nøytrale labels); **ingen numerisk/ordinal scoring**. |

**Alternativer (verdi-token + overlap beholdes → ingen regresjon; kun nøytrale labels):**

| Verdi (uendret) | Label |
|---|---|
| `gym` | Gym og trening |
| `lop-turer` | Løping og turer |
| `lagidrett` | Lagidrett |
| `natur-fritid` | Natur og fritid |
| `lite` | **Tar det rolig** (nøytralt; var «Lite aktiv») |

**§29 Scoring-påvirkning:** `aktivitet` scorer i dag med **overlap** (sett-snitt), IKKE ordinal
avstand. O2 **introduserer ingen numerisk scoring** (ingen 1–5-mapping) — overlap beholdes. Et
eventuelt 5-trinns-ordinal-uttrykk er en **produktavgjørelse** (krever verdi-migrasjon + numerisk
mapping) og legges i §AG, ikke i O2-default.

---

## R. ANDRE STRUKTURERTE FORBEDRINGER (maks 5)

Største strukturerte gevinster er allerede dekket (§L skjerm, §P food, §Q aktivitet, §N/O love).
I tillegg — **alle PROFILE-ONLY, ingen matching, trygt å slette** (vag/overlapp, ingen verdi å
bevare → sletting i stedet for omstrukturering):

| # | Felt | Grunn |
|---|---|---|
| 1 | `workType` | Profile-only, ingen matching (var påkrevd). |
| 2 | `economicStability` | Profile-only, ingen matching, lite sensitive (var påkrevd). |
| 3 | `dailyRoutine` | Profile-only, overlapp med l2026, ingen matching. |
| 4 | `desiredLifestyle` + `undesiredLifestyle` | Profile-only, vag, ingen matching (par). |
| 5 | `lowPriority` + `bodyType` | Profile-only, vag/lav verdi, ingen matching (par). |

> Ingen endeløse utvidelse: O2-størrelsen er låst til §AF. Alt overfor + §C–Q er hele omfanget.

---

## S. REQUIRED / OPTIONAL (sluttstatus for hver overlevende felt)

**Mål nådd: 0 påkrevd fritekst.** Ingen required→optional-endring i O2 (love beholdt påkrevd,
se §N/O); all reduksjon kommer fra **sletting av 7 påkrevde felt**.

| Endring | Felt | Fra → Til |
|---|---|---|
| **Slettet (var påkrevd)** | `selfDesc`, `goodEveryday`, `buildTogether` | PÅKREVDT → slettet (0 fritekst) |
| **Slettet (var påkrevd)** | `workType`, `housingType`, `householdSize`, `economicStability` | PÅKREVDT → slettet |
| **Nye (C/D)** | `openToPartnerWithChildren`, `partnerWithChildrenViktig` | — → **VALGFRI** |
| **Uendra** | 9 identitets/alder/avstands-felt + 49 skala + `loveGive`/`loveReceive` + `relationshipSeeking`/`closenessNeed` + `neverCrossBoundary`/`understandPartnersBoundaries` | PÅKREVDT (uendret) |

Profil-kun/nice-to-know som i dag er **påkrevd** men har ingen matching (`workType` m.fl.) er
slettede — de skal ikke blokkere fullføring (§31-prinsippet).

---

## T. FINAL FIELD COUNT (nøyaktig)

| Mål | Nå | Slutt | Delta |
|---|---|---|---|
| **Totalt antall felt** | **129** | **106** | −25 slettet, +2 nye |
| **Påkrevd** | **71** | **64** | −7 slettet |
| **Fritekst (multiline)** | **11** | **0** | −11 |
| **Påkrevd fritekst** | **3** | **0** | −3 |

**Per steg (sletting / tillegg):**

| Steg | Slettet | Nye |
|---|---|---|
| Steg 1 Grunnprofil | `bodyType` (1) | `openToPartnerWithChildren` (C), `partnerWithChildrenViktig` (D) = **+2** |
| Steg 2a Personlighet | `selfDesc`, `quirk` (2) | — |
| Steg 2b Livssituasjon | `workType`, `housingType`, `householdSize`, `economicStability`, `dailyRoutine`, `responsibilities` (6) | — |
| Steg 3 Tilknytning | `importantBoundary` (1) | — |
| Steg 4 Kjærlighetsspråk | `smallThing` (1) | — |
| Steg 5a Livsstil | `goodEveryday`, `lowPriority`, `desiredLifestyle`, `undesiredLifestyle` (4) | — |
| Steg 5b Relasjonsstil | `independenceBalance` (1) | — |
| Steg 6 Framtid | `dreamGoal`, `buildTogether` (2) | — |
| Steg 7 Humor | 0 (døde humor-felt er allerede utenfor live-teljinga) | — |
| Steg 8a Grenser | `limitations`, `partnerMustUnderstand` (2) | — |
| Steg 8b Moden | `intimacySafety`, `comfortableWith`, `boundary`, `nearerType`, `needsTime` (5) | — |
| **Totalt** | **25** | **+2** |

---

## U. USER-ACTION REDUCTION (deterministisk minimum, ingen tidsestimater)

| Handlingstype (påkrevd) | Nå | Slutt | Delta |
|---|---|---|---|
| Skalasvar | 49 | 49 | 0 |
| Kort tekst (navn/aldre/bygg/postnummer) | 4 | 4 | 0 |
| **Essay (fritekst)** | **3** | **0** | **−3** |
| Valg/multi/slider | 15 | 11 | **−4** (`workType`, `housingType`, `householdSize`, `economicStability`) |
| **Totalt påkrevd handlinger** | **71** | **64** | **−7** |

Målbare friksjon: **−3 påkrevde essays + −4 påkrevde valg = −7 påkrevd handlinger**, i tillegg
slettet alle valgfrie fritekster/low-value-felt (ingen påkrevd last). Ingen estimering av tid.

---

## V. STEP STRUCTURE (behold 13)

Alle 13 steg **beholdes** — intet steg blir helt tomt etter slettingene:

| Steg | Felt som gjenstår | Tomt? |
|---|---|---|
| 1 Grunnprofil | 17 (uten `bodyType`) + 2 nye (C, D) | Nei |
| 2a Personlighet | `energyGiver`/`energyDrainer`/`pressureReact` + 15 skala | Nei |
| 2b Livssituasjon | 5 l2026-felt (`arbeidsrytme`/`bosted`/`reiser`/`dyr`/`skjerm` + `Viktig`) | Nei |
| 3 Tilknytning | `safetyNeed`/`insecurityTrigger`/`sadnessNeed`/`stressNeed` + 12 skala | Nei |
| 4 Kjærlighetsspråk | `loveGive`/`loveReceive`/`closenessBuilder`/`distanceCreator` | Nei |
| 5a Livsstil | `highPriority` + 5 l2026-felt (+`Viktig`) + 10 skala | Nei |
| 5b Relasjonsstil | `relationshipSeeking`/`closenessNeed` | Nei |
| 6 Framtid | `futureVision`/`experienceAlone`/`experienceTogether` | Nei |
| 7 Humor | 6 skala (COMMUNICATION) | Nei |
| 8a Grenser | `neverCrossBoundary`/`understandPartnersBoundaries` | Nei |
| 8b Moden/Følelser | 6 skala (ERQ-6) — se §W | Nei |
| 9 Oppsummering | (visning) | Nei |
| 10 Start reisen | (visning/CTA) | Nei |

**Konklusjon: behold 13 steg** (ingen flyt-omdesign).

## W. STEP 10 (renderStep 10 — «Moden») — SLUTT-DESIGN

Etter sletting av de 5 moden-feltene gjenstår kun **ERQ-6-skalaen** (6 påkrevde skalasvar) på
steget. Steget er **IKKE tomt**.

- **Tittel endres:** «Moden nysgjerrighet» → **«Følelser i hverdagen»** (dekker ERQ-6-innholdet,
  som allerede er en undertittel i steget).
- **Sub-tittel:** «Disse spørsmålene handler om hvordan du vanligvis forholder deg til og uttrykker følelser.»
- Vi starter **IKKE** å persistere de 5 slettede feltene (default REMOVE, §D.1).
- **Ingen tomt/fake steg** leveres.

## X. SUMMARY (steg 9 Oppsummering) — SLUTT-IMPACT

O1-oppsummeringen skal kun reflektere endelige, meningsfulle felt:

- **SLETT rader/seksjoner for (25):** `selfDesc`, `goodEveryday`, `buildToday`/`buildTogether`, `quirk`,
  `importantBoundary`, `smallThing`, `independenceBalance`, `dreamGoal`, `limitations`,
  `partnerMustUnderstand`, `boundary`, `housingType`, `householdSize`, `responsibilities`, `workType`,
  `economicStability`, `dailyRoutine`, `desiredLifestyle`, `undesiredLifestyle`, `lowPriority`,
  `bodyType`, `intimacySafety`, `comfortableWith`, `nearerType`, `needsTime`.
  (Dagens oppsummering viser bl.a. de 5 moden-radene + `bodyType` — de slettes.)
- **Legg til** bonusfamilie-rader (C, D) ved barn-seksjonen (P2).
- **Religion:** behold egen identitet + partner-åpenhet (med den nye copyen i §E.1).
- **Ingen visuell redesign** av oppsummeringens ramme.

## Y. PREFILL / RESUME (per endret felt — ingen data-tap, ingen crash)

| Felt | Ny bruker | Eksisterende | Gammelt utkast | Gamle profil |
|---|---|---|---|---|
| Slettede fritekst/low-value (25) | Spurtes ikke | Verdi **bevart** i DB, **vises ikke** (slettet fra oppsummering) | Prefill leser den ikke (defensiv `toStr`) | Prefill leser den ikke |
| **C** `openToPartnerWithChildren` (ny) | Spurtes i steg 1 | Pre-fill fra legacy-token: **`ja`** om token, ellers **`usikker`** | Som eksisterende | Som eksisterende |
| **D** `partnerWithChildrenViktig` (ny) | Spurtes i steg 1 | **Default `fint-om-det-passer`** (aldri `ma-stemme`) | Default `fint-om-det-passer` | Default `fint-om-det-passer` |
| **B** `wantChildren` | `ja`/`usikker`/`nei` (token borte) | Stripp token, bevar `ja`/`usikker`/`nei` | Stripp token | Stripp token |
| `loveGive`/`loveReceive` (max 3) | Opptil 3 | Eksisterende 2 verdier **pre-fylles uendret** (gyldig under max 3) | Uendret | Uendret |
| `kosthold` (max 2) | Opptil 2 | Eksisterende 1 verdi **pre-fylles** (gyldig under max 2) | Uendret | Uendret |
| `skjerm` (rewrite) | Nye labels, samme verdier | **Pre-fylles uendret** (verdi-token uendret) | Uendret | Uendret |

## Z. LEGACY DATA (UI-sletting ≠ DB-sletting)

- **Slettede felt (25):** `setup` **stopper å skrive** nye verdier; **beholder** eksisterende lagrede
  verdier (ingen migrasjon, ingen sletting).
- **Døde preferanser/humor:** stop writing (var alltid tomme); behold DB-kolonner (historisk).
- **C/D:** nye nøkler i `lifestyle` (JSON) — **ingen migrasjon**; mangler hos gamle profiler =
  `usikker`/ingen hard grense (se §I).
- **Ingen sletting av lagret brukerdata** et sted.

---

## AA. MATCHING — PRESISE KODE-ENDRINGER

**P1 (Simplification) — minimal / ingen ny matching-semantikk:**

| Felt/område | Matching-endring | Filer/funksjoner |
|---|---|---|
| love give/receive | **Ingen** (profile-only) | — |
| Slettede fritekst/low-value-felt | **Ingen** (ingen konsument) | — |
| Religion | **Ingen** (kun copy) | — |
| `skjerm` | **Ingen** (verdi/vekt/HB uendret) | — |
| `aktivitet` | **Ingen** (labels kun) | — |
| `kosthold` max 2 | Scoring **uendret** (`categoryMatch` er multi-aware). **HB:** generaliser matrise til multi | `lib/matching/dealbreaker.ts` → `isKompatibel`; `lib/matching/cheapFeatures.ts` → `isL2026Kompatibel` |

> `kosthold`-HB (multi): kompatibel om **∃ aVal∈A, bVal∈B slik at `KOMPAT[aVal] ∋ bVal ∨ KOMPAT[bVal] ∋ aVal`**
> (direkte generalisering av dagens single-verdi-matrise; bevarer hierarkiet).

**P2 (Bonus Family) — ny tosidig hard grense (det EINE nye hard-semantikk i O2):**

| # | Endring | Filer/funksjoner |
|---|---|---|
| 1 | Ny type (defensiv) | `lib/matching/types.ts` — legg til `openToPartnerWithChildren`, `partnerWithChildrenViktig` |
| 2 | Ny hard-sjekk (tostidig) + wire | `lib/matching/dealbreaker.ts` — `checkBonusFamily(a,b)` (bruker `harBarnFraFor`); wire inn i `sjekkAlleDealbreakers` |
| 3 | Prekalk + speil (ekvivalens) | `lib/matching/cheapFeatures.ts` — legg C/D i `CheapFeatures` + `buildCheapFeatures`; `bonusFamilyConflict(a,b)`; wire inn i `cheapSjekkAll` (speilar rekkefølgen i dealbreaker) |
| 4 | Utvida soft bonus | `lib/matching/dimensions.ts` — `scoreLifeSituationCompat`: bonus = (`erApenForBonusfamilie(want)` **OR** `openToPartnerWithChildren==='ja'`) && partner har barn |
| 5 | Schema (backend) | `lib/validation/onboarding-setup.ts` — `openToPartnerWithChildren` (ja/nei/usikker), `partnerWithChildrenViktig` (fint-om-det-passer/ma-stemme) |
| 6 | Persist | `app/api/profile/setup/route.ts` — skriv C/D til `lifestyle` |
| 7 | Prefill | `lib/profile/toOnboardingData.ts` — pre-fill C fra token, D default |
| 8 | Frontend-gate | `lib/validation/onboarding-steps.ts` — (valfritt; C/D er valfrie) |

**Ekvivalens-test** (`__tests__/matching-score-round.test.ts`): utvides med C/D-fixtures og food-multi
for å bevare at `cheapSjekkAll` === `sjekkAlleDealbreakers(A,B) ?? sjekkAlleDealbreakers(B,A)`.

---

## AB. LEGAL / SIKKERHEIT / PRIVACY (ingen juridiske konklusjoner — LAWYER REVIEW: PENDING)

**Juristgjennomgang (minimum):**
1. **Religion:** ny helper-copy (§E.1) — språk/toning; data-modell **uendret** (bekreft).
2. **Bonusfamilie/barn:** ny HARD-filtrering på familiestatus — brukerstyrt samtykke (C+D);
   verifiser at det ikke utgjer diskriminering/ulovlig filtrering (brukaren selv set grensa).
3. **Fritekst-sletting:** privacy-sensitive data **minker** (minre ubeskrivelig persondata blir
   samla) — positiv retning, ingen ny risiko.
4. **Ny sensitive-data:** **ingen** (C/D er preferansar, ikke ein sensitiv kategori).
5. **`importantBoundary`/`limitations`/`partnerMustUnderstand`** (slettede): verifiser at ingen
   eksisterande safety/consent-avheng ligg i desse fritekstfeltene (audit: ingen moderasjonskonsument).

**Sikkerheits/privacy-gevinst (målt fra audit):**
- **Fritekst-input som forsvinn: 11** (3 påkrevde + 8 valfrie) → **0**.
- Praktisk: mindre ubeskrivelig persondata blir bedt om og lagret fra nye brukere. **Ingen juridisk
  påstand** gjøres.

---

## AC. TESTPLAN — FINAL (O2-01 … O2-30, implementeringsklar)

| ID | Test |
|---|---|
| O2-01 | Sluttfelt-telling = 106 (129 − 25 + 2); per steg som §T. |
| O2-02 | **0 påkrevd fritekst** (validateOnboardingStep + alle komponent-validating gir ingen fritekst-feil). |
| O2-03 | Slettede fritekst/low-value-felt (25) er fraværende i UI + i setup-payload (skrives ikke). |
| O2-04 | Moden-seksjonen (5 felt) er borte; ERQ-6-skalaen (6) er fortsatt påkrevd på steg 8b. |
| O2-05 | Egen religion (`religion`) bevart, opptil 4, pre-fylles fra DB. |
| O2-06 | Partner-aksept (`acceptedReligions`) bevart, opptil 4 + `religionOpen`. |
| O2-07 | Religion tosidig hard-match: `checkReligionCompat` = oneWay(a,b) ?? oneWay(b,a) (eksempel §F). |
| O2-08 | Religion multi-identitet = **ANY** overlap (minst éin snitt → pass); open fjernar bare egen gate. |
| O2-09 | `hasChildren` (`children`) er et eget signal — skil fra B/C/D. |
| O2-10 | `wantsChildren` (`wantChildren`) uten `Bonusfamilie`-token — skil fra C. |
| O2-11 | `openToPartnerWithChildren` (C) er et eget, nytt signal — skil fra B. |
| O2-12 | Bonusfamilie **soft** preferanse: C=`ja` (eller legacy-token) + partner har barn → **+10**, ingen hard blokk. |
| O2-13 | Bonusfamilie **hard** blokk: C=`nei` + D=`ma-stemme` + partner har barn → **BLOCK** (tostidig). |
| O2-14 | Tostidig barn-sjekk: sjekkar A→B og B→A for både B (ja-vs-nei) og C (bonus). |
| O2-15 | Legacy `Bonusfamilie`-token: soft bonus bevart; **ingen** hard blokk; pre-fill C=`ja`, D=`fint-om-det-passer`. |
| O2-16 | `loveGive` max 3 (4. valg blokkerast). |
| O2-17 | `loveReceive` max 3 (4. valg blokkerast). |
| O2-18 | `kosthold` max 2 (3. valg blokkerast). |
| O2-19 | `kosthold`-begrensning: `spiser-koett` ⊕ (`vegetar`/`vegan`); HB matrise-par (vegan↔fisk kompatibel). |
| O2-20 | `aktivitet`: 5 verdier, max 3, overlap-scoring uendret (ingen numerisk scoring). |
| O2-21 | Prefill gamle profil: alle endra/ny felt pre-fylles korrekt (C/D/food/love/skjerm). |
| O2-22 | Resume utkast: ingen crash på manglende nye nøkler (C/D). |
| O2-23 | Oppsummering: 25 sletta radar borte; C/D-rader til stede; religion med ny copy. |
| O2-24 | Setup-payload: C/D skrives til `lifestyle`; slettede felt skrives ikke. |
| O2-25 | Matching-regresjon: `cheapSjekkAll` ≡ `sjekkAlleDealbreakers(A,B) ?? (B,A)` (ekvivalens, inkl. ny bonus). |
| O2-26 | Religion-regresjon: alle §F-scenarier (open/missing/multi/tostidig). |
| O2-27 | A18 frosen: `MIN_AGE=18`; aldersvalidering uendret. |
| O2-28 | AGE99 frosen: `agePrefMax=null`=99+; egen alder max 99. |
| O2-29 | CPT frosen: 14 dager, dag 8, lørdag 02–04 UTC, ukentlig. |
| O2-30 | BQ/OT frosen: Bli Kjent 180; 49 skalasvar (15/12/10/6/6) uendret. |

---

## AD. PACKAGE 1 — O2 SIMPLIFICATION (ingen ny hard matching-semantikk)

**Innhold:**
- Fritekst-sletting (11 → 0: 3 essays + 8 valfrie) — §C.
- Død/discarded-rydding: moden-seksjonen (5) + `bestSelf` — §D.1.
- Low-value-felt: `housingType`, `householdSize`, `responsibilities`, `workType`,
  `economicStability`, `dailyRoutine`, `desiredLifestyle`, `undesiredLifestyle`, `lowPriority`,
  `bodyType` — §J/K/M/R.
- Døde legacy: stop writing for `preferanser` + døde `humor`-felt — §D.2.
- Love give/receive **max 3** — §N/O.
- Food `kosthold` **max 2** + `spiser-koett`⊕veg/vegan + HB matrise-par — §P.
- Aktivitet: nøytrale labels (overlap uendret) — §Q.
- Skjerm: rewrite spørsmål (verdi/vekt/HB uendret) — §L.
- Religion: **copy** (§E.1) — ingen matching/data-endring.
- Oppsummering + prefill/DB-synkronisering (slekte felt, nye labels) — §X/Y.
- **Tester:** O2-01,02,03,04,05,06,16,17,18,19,20,21,22,23,24,25,27,28,29,30.

**Sluttstilling (CI-justering — ingen produktendring):** 14 oppsummeringsrader for fjernede P1-felt er fjernet fra Step9 (ingen tomme kort; «Moden nysgjerrighet»-seksjonen er borte; legacy-verdier beholdes internt og vises ikke). E2E-hjelpefunksjoner og -tester er oppdatert til gjeldende feltmodell (ingen referanser til fjernede felt). Språkvakt består (bokmål).

**Ikke i P1:** ny hard barn/bonusfamilie-grense, C/D-felt.

## AE. PACKAGE 2 — O2 BONUS FAMILY (ny tosidig hard grense)

**Innhold:**
- Eksplisitt **C** `openToPartnerWithChildren` (ja/nei/usikker) — §G.
- Viktighet/must-match **D** `partnerWithChildrenViktig` (fint-om-det-passer/ma-stemme) — §G.
- **Tostidig hard matching** `checkBonusFamily` + prekalk/ekvivalens — §H/§AA(P2).
- **Legacy-token-handtering** (read legacy + write new + soft prefill; ingen hard-inferens) — §I.
- Oppsummering: C/D-rader ved barn-seksjonen — §X.
- **Tester:** O2-09,10,11,12,13,14,15 + O2-25 (ekvivalens med ny bonus).

**Anbefalt rekkefølge:**
```
PACKAGE 1  →  deploy / checkpoint   (lav risiko; ingen ny hard matching)
PACKAGE 2  →  deploy / checkpoint   (ny hard grense; egen ekvivalens- + barn-tester)
```
**Grunn:** P2 inneholder det eneste nye hard-semantikk og ny data-flyt (C/D + legacy); å isolere det
gjør rollback og regresjonskontroll enklare. Ingen teknisk grunn til å slå de sammen.

---

## AF. FINAL SPEC TABLE (implementerings-autoritet)

> Alt som **ikke** står i denne tabellen er **OUT OF SCOPE**.

### AF.1 — SLETTA FELD (25) · alle P1

| Felt | Nå (type) | Matching i dag | Legacy-strategi | Oppsummering |
|---|---|---|---|---|
| `selfDesc` | essay, **påkrevd** | Ingen | Bevar lagret | Fjern rad |
| `goodEveryday` | essay, **påkrevd** | Ingen | Bevar | Fjern rad |
| `buildTogether` | essay, **påkrevd** | Ingen | Bevar | Fjern rad |
| `quirk` | fritekst | Ingen | Bevar | Fjern rad |
| `importantBoundary` | fritekst | Ingen | Bevar | Fjern rad |
| `smallThing` | fritekst | Ingen | Bevar | Fjern rad |
| `independenceBalance` | fritekst | Ingen | Bevar | Fjern rad |
| `dreamGoal` | fritekst | Ingen | Bevar | Fjern rad |
| `limitations` | fritekst | Ingen | Bevar | Fjern rad |
| `partnerMustUnderstand` | fritekst | Ingen | Bevar | Fjern rad |
| `boundary` (moden) | fritekst | Ingen (ikke persistert) | Bevar | Fjern rad |
| `housingType` | select, **påkrevd** | Ingen | Bevar | Fjern rad |
| `householdSize` | select, **påkrevd** | Ingen | Bevar | Fjern rad |
| `responsibilities` | select | Ingen | Bevar | Fjern rad |
| `workType` | select, **påkrevd** | Ingen | Bevar | Fjern rad |
| `economicStability` | select, **påkrevd** | Ingen | Bevar | Fjern rad |
| `dailyRoutine` | select | Ingen | Bevar | Fjern rad |
| `desiredLifestyle` | select | Ingen | Bevar | Fjern rad |
| `undesiredLifestyle` | select | Ingen | Bevar | Fjern rad |
| `lowPriority` | multi | Ingen | Bevar | Fjern rad |
| `bodyType` | select | Ingen | Bevar | Fjern rad |
| `intimacySafety` (moden) | select | Ingen (ikke persistert) | Bevar | Fjern rad |
| `comfortableWith` (moden) | select | Ingen (ikke persistert) | Bevar | Fjern rad |
| `nearerType` (moden) | select | Ingen (ikke persistert) | Bevar | Fjern rad |
| `needsTime` (moden) | select | Ingen (ikke persistert) | Bevar | Fjern rad |

**FINAL for alle 25:** **SLETTA fra onboarding-UI + setup** (verdi-token beholdes i DB).

### AF.2 — MODIFISERTE FELD (6)

| Felt | Nå | FINAL | Type | Options | Min/Maks | Påkr.? | Matching-effekt | Legacy | Oppsummering | Pkg |
|---|---|---|---|---|---|---|---|---|---|---|
| `wantChildren` (B) | multi 2, valgfri | multi, valgfri | Flervalg | `ja`, `usikker`, `nei` (**token borte**) | maks 3 | Nei | HB (ja-vs-nei) + SC .4 (uten bonus) | Stripp token, bevar ja/usikker/nei | Fjern Bonusfamilie-rad, bevar B | **P2** |
| `kosthold` (food) | single, valgfri | **multi 2**, valgfri | Flervalg | `spiser-koett`, `fleksitar`, `vegetar`, `vegan`, `fisk` (nøye labels) | **maks 2** | Nei | SC .06 (uendret) + HB **matrise-par (multi)** | Verdi uendret (pre-fyll) | Ny label | **P1** |
| `aktivitet` | multi 3, valgfri | multi 3, valgfri | Flervalg | `gym`, `lop-turer`, `lagidrett`, `natur-fritid`, `lite` (nøye labels) | maks 3 | Nei | SC .05 + HB overlap (**uendret**) | Verdi uendret | `lite`→«Tar det rolig» | **P1** |
| `skjerm` | single, valgfri | single, valgfri | Select | `mye`, `moderat`, `vil-skru-ned`, `ubestemt` | 1 | Nei | SC .04 + HB (**uendret**) | Verdi uendret | Ny spørsmålstekst | **P1** |
| `loveGive` | multi 2, **påkrevd** | **multi 3**, **påkrevd** | Flervalg | `ord`, `tjenester`, `tid`, `kjønnlig`, `gaver` | **maks 3** | Ja | **Ingen** | Verdi uendret (pre-fyll) | Uendra | **P1** |
| `loveReceive` | multi 2, **påkrevd** | **multi 3**, **påkrevd** | Flervalg | `ord`, `tjenester`, `tid`, `kjønnlig`, `gaver` | **maks 3** | Ja | **Ingen** | Verdi uendret | Uendra | **P1** |

> `kosthold`-velg-begrensning: `spiser-koett` ⊕ (`vegetar`/`vegan`). `aktivitet`/`skjerm`/`skjermViktig`
> verdi-token uendret → **ingen migrasjon**.

### AF.3 — NYE FELD (2) · P2

| Felt | FINAL | Type | Options | Min/Maks | Påkr.? | Matching-effekt | Legacy-strategi | Oppsummering | Pkg |
|---|---|---|---|---|---|---|---|---|---|
| `openToPartnerWithChildren` (**C**) | **NY**, valgfri | Select (single) | `ja`, `nei`, `usikker` | 1 | Nei | **HB** (kun C=`nei`+D=`ma-stemme`) + soft bonus (C=`ja`) | Pre-fill: token→`ja`, ellers `usikker`; mangle=`usikker` (**ingen hard**) | Legg til C-rad | **P2** |
| `partnerWithChildrenViktig` (**D**) | **NY**, valgfri | Select (2) | `fint-om-det-passer`, `ma-stemme` | 1 | Nei | Gjer C til HARD grense (kun `ma-stemme`) | **Default `fint-om-det-passer`** (aldri `ma-stemme`) | Legg til D-rad | **P2** |

**Lagring:** `lifestyle.openToPartnerWithChildren` + `lifestyle.partnerWithChildrenViktig` (JSON, ingen migrasjon).

### AF.4 — RELIGION (3) · COPY KUN · P1 (data-modell + matching UENDRA)

| Felt | Data-modell | Copy-endring | Matching |
|---|---|---|---|
| `religion` | Uendra (multi, **maks 4**) | Heading **«Religion / livssyn»** · helper **«Velg det som beskriver deg.»** | Uendra (tostidig hard, ANY-overlap) |
| `acceptedReligions` | Uendra (multi, **maks 4** + «Åpen for alle») | **«Hvilke religioner/livssyn er du åpen for hos en partner?»** + hard-grense-forklaring | Uendra |
| `religionOpen` | Uendra (bool; sentinelen `OPEN_TO_ALL`) | «Åpen for alle»-valg | Uendra |

**Sluttstatus (§45):** **25 sletta + 6 modifiserte + 2 nye + 3 religion-copy = 36 rader.** Alt annet
(i de 106 gjenværende felt) er **uendret / OUT OF SCOPE**.

---

## AG. BESLUTTINGAR SOM TRENGS FRA GEORGE (godkjenning før «kjør»)

| # | Avgjørelse | Foreslått (default) | Alternativ |
|---|---|---|---|
| 1 | Alle 11 fritekst → **REMOVE** (0 fritekst)? | **Ja** | Bevar 1–2 «varme» (f.eks. `quirk`) som valgfri |
| 2 | `importantBoundary`/`limitations`/`partnerMustUnderstand` REMOVE? (ingen håndhevet safety-konsument) | **Ja** | Flytt ekte consent/grense til separat partner-synlig funksjon (utenfor O2) |
| 3 | Love give/receive: **behold påkrevd** (max 3)? | **Ja** (påkrevd) | Gjer valfri (→ påkrevd totalt 62 i stedet for 64) |
| 4 | Food: **bevar verdi-token** + nye labels (ingen migrasjon)? | **Ja** (token uendret) | Rename token (`spiser-koett`→`spiser-det-meste`) = krever matrise-/data-migrasjon |
| 5 | Aktivitet: **bevar 5 verdier + overlap** (ingen numerisk scoring)? | **Ja** | 5-trinns-ordinal-modell = krever verdi-migrasjon + numerisk mapping |
| 6 | **P2 Bonus Family**: godkjen C + D + tosidig hard grense + legacy-strategi? | **Ja** | Bare C (soft) uten D/hard grense (da ingen ny hard semantikk) |
| 7 | C/D lagring: **`lifestyle`** (JSON, ingen migrasjon)? | **Ja** | `deepProfileData` (som religion) |
| 8 | Steg 10 (Moden) → omdøpt til **«Følelser i hverdagen»** (ERQ-6 bare)? | **Ja** | Behold tittel, fjern bare felta |
| 9 | Skjerm ny copy: **«Hvor mye plass har skjerm og telefon i hverdagen din?»**? | **Ja** | Andre formulering |
| 10 | Religion final copy (§E.1)? | **Ja** | Juster ordvalg |

> **Kun #6 (P2) og eventuelle endringer på #3/#4/#5 påverkar matching/data.** Resten er friksjon/copy.

## AH. ANBEFALING

1. **Send P1 (Simplification) først** — lav risiko, **ingen ny hard matching** — deploy/checkpoint.
   Fjerner 11 fritekst + 25 low-value-felt, gjør love max 3, food max 2, aktivitet/skjerm nøytrale,
   religion copy. Reduserer påkrevd handlinger 71 → 64 uten matching-regresjon.
2. **Deretter P2 (Bonus Family)** som **egen pakke** — det eneste nye hard-semantikk (C/D +
   tosidig grense + legacy). Eier ekvivalens- og barn-tester; enkelt å rulle tilbake.
3. **Behold 13 steg** — intet steg blir tomt.
4. **Rør ikke frosne invariantar** (A18, CPT, 49 skala, Bli Kjent, Oppgaver).
5. **§AF (final spec table) er implementerings-autoritet** — alt utenfor tabellen er OUT OF SCOPE.
6. Ingen juridiske konklusjoner her — religion/bonusfamilie-ordlyd = **LAWYER REVIEW: PENDING**.

---

## 47. STOPP — SVAR PÅ DE 50 PUNKTENE

1. **Fritekst-final:** Alle 11 → **REMOVE** (3 essays + 8 valfrie) → **0 fritekst**.
2. **`selfDesc`:** REMOVE FROM ONBOARDING (profile-only; erstattes IKKE med nytt essay).
3. **`goodEveryday`:** REMOVE FROM ONBOARDING (profile-only).
4. **`buildTogether`:** REMOVE FROM ONBOARDING (profile-only).
5. **Valgfri fritekst gjenstår:** **0** (`quirk`,`importantBoundary`,`smallThing`,`independenceBalance`,`dreamGoal`,`limitations`,`partnerMustUnderstand`,`boundary` — alle REMOVE).
6. **Døde/discarded:** moden (5) + `bestSelf` → **REMOVE FROM UI** (ikke persistert i dag); døde preferanser/humor → **STOP WRITING + KEEP FOR LEGACY READ**.
7. **Religion — egen identitet (final copy):** «Religion / livssyn» · «Velg det som beskriver deg.» (maks 4, data uendret).
8. **Religion — partner-aksept (final copy):** «Hvilke religioner/livssyn er du åpen for hos en partner?» + hard-grense-forklaring (maks 4 + «Åpen for alle», data uendret).
9. **Religion maks identiteter:** **RETAIN MAX 4** (begge lister).
10. **Religion multi-identitet:** **MINST ÉN overlap = pass** (ANY); `open` fjernar kun egen gate; MISSING ≠ OPEN; tosidig; kjører før scoring.
11. **Children kanoniske felt:** `children` (A, har) · `wantChildren` (B, fremtid, **uten token**) · `openToPartnerWithChildren` (C, NY) · `partnerWithChildrenViktig` (D, NY).
12. **Bonusfamilie semantik:** C = åpen for partner med barn (**independent av B**); soft bonus = C=`ja` OR legacy-token → **+10**.
13. **Bonusfamilie hard grense:** kun **C=`nei` + D=`ma-stemme` + partner har barn → BLOCK** (tostidig).
14. **Legacy bonusfamilie-strategi:** READ LEGACY + WRITE NEW + soft prefill (C=`ja` om token, D=`fint`); **ingen hard-inferens**; bevar data.
15. **Fremtidig barn kompatibilitet:** `ja`-vs-`nei` → **BLOCK**; `usikker` → **PASS** (uendret, `childrenOnly`).
16. **Housing:** **REMOVE** (ingen matching).
17. **Household:** **REMOVE** (ingen matching + privacy).
18. **Screen:** **REWRITE** (ny copy) + **KEEP** (SC .04 + HB uendret).
19. **Responsibility:** **REMOVE** (dublør/vag, ingen matching).
20. **Love giving:** **MAX 3**, påkrevd, 5 alternativer (`ord`,`tjenester`,`tid`,`kjønnlig`,`gaver`).
21. **Love receiving:** **MAX 3**, påkrevd, 5 alternativer (samme sett).
22. **Love matching-impact:** **INGEN** (profile-only; max 2→3 endrar ingenting).
23. **Food:** **MAX 2**, 5 nøytrale alternativer (token uendret), `spiser-koett` ⊕ (`vegetar`/`vegan`).
24. **Food matching-impact:** scoring **uendret** (`categoryMatch` multi-aware); **HB → matrise-par (multi)**.
25. **Activity:** 5 verdier **uendret** (`gym`,`lop-turer`,`lagidrett`,`natur-fritid`,`lite`), nøytrale labels, maks 3.
26. **Activity scoring-impact:** **INGEN** (overlap uendret; **ingen numerisk scoring**).
27. **Andre strukturerte forbedringer:** `workType`,`economicStability`,`dailyRoutine`,`desiredLifestyle`+`undesiredLifestyle`,`lowPriority`+`bodyType` → **REMOVE** (profile-only).
28. **Current total fields:** **129**.
29. **Final proposed fields:** **106** (−25 slettet, +2 nye).
30. **Current required:** **71**.
31. **Final proposed required:** **64** (−7 slettet).
32. **Current free-text:** **11**.
33. **Final free-text:** **0**.
34. **Required free-text:** **3 → 0**.
35. **Min required actions before/after:** **71 → 64** (−3 essays, −4 valg; 49 skala uendret).
36. **Final step count:** **13** (uendret; intet steg tomt).
37. **Step 10 design:** ERQ-6 skalasteg **kun**, omdøpt **«Følelser i hverdagen»** (ikke tomt).
38. **Summary changes:** fjern 25 radar, legg til C/D-rader, religion ny copy, **ingen redesign**.
39. **Prefill strategy:** slekte felt pre-fylles ikke; **C** fra token (`ja`/`usikker`), **D** default `fint`; **B** strip token; food/love/skjerm uendret.
40. **Legacy data strategy:** **UI-sletting ≠ DB-sletting**; stop writing, behold lagret; **ingen migrasjon/sletting**.
41. **Exact matching changes:** **P1** = `kosthold`-HB matrise-par (`dealbreaker.isKompatibel` + `cheapFeatures.isL2026Kompatibel`). **P2** = `checkBonusFamily` + `CheapFeatures`/`buildCheapFeatures`/`cheapSjekkAll` + `dimensions` soft bonus + `types` + `onboarding-setup` + `setup/route` + `toOnboardingData`.
42. **Lawyer flags:** religion copy; **bonusfamilie/barn** (hard filter på familiestatus, brukerstyrt samtykke); fritekst-sletting (privacy minker); **ingen ny sensitive-data**. **PENDING**.
43. **Safety/privacy benefit:** **11 fritekst forsvinn → 0** (minre ubeskrivelig persondata).
44. **Final test count:** **30** (O2-01 … O2-30).
45. **Package 1 scope:** fritekst + døde + low-value + love max3 + food max2 + aktivitet/skjerm + religion copy + oppsummering/prefill + tester (**ingen ny hard matching**).
46. **Package 2 scope:** **C + D + tosidig hard grense + legacy + oppsummering + tester**.
47. **Decisions still needed from George:** **10** (§AG) — kritisk: **#6 (P2)**; påverkar matching/data: **#3/#4/#5**.
48. **Changed files:** `docs/ONBOARDING-O2-ACT-DESIGN-v1.0.md` (ny).
49. **Git status:** kun nye docs (ACT-DESIGN + IDENTITY + O2-audit) + `tmp/`; **ingen tracked-filer modifisert**.
50. **Final recommendation:** **P1 → checkpoint, deretter P2 → checkpoint**; behold 13 steg; rør ikke frosne invariantar; **§AF = implementerings-autoritet**.

---

## AVSLUTNING

```
ONBOARDING O2 ACT DESIGN: COMPLETE
IMPLEMENTATION AUTHORITY: FINAL SPEC TABLE (§AF)
CURRENT INPUTS: 129
PROPOSED INPUTS: 106  (−25 slettet, +2 nye)
REQUIRED INPUTS: 71 → 64  (−7 slettet)
FREE-TEXT: 11 → 0
REQUIRED FREE-TEXT: 3 → 0
BIO: C — URØRT FOR BETA (utenfor onboarding)
RELIGION: OWN IDENTITY + PARTNER ACCEPTANCE (data uendret; kun copy; tosidig hard ANY-overlap; max 4)
BONUS FAMILY: EXPLICIT C/D — SEPARATE FROM FUTURE CHILDREN; hard = C=nei + D=må stemme (tostidig)
LOVE: UP TO 3 (påkrevd, ingen matching)
FOOD: UP TO 2 (scoring uendret; HB matrise-par)
ACTIVITY: EXPANDED LABELS / overlap uendret (ingen numerisk scoring)
STEP COUNT: KEEP (13)
A18: FROZEN
CANONICAL PRODUCT TRUTH: FROZEN
IMPLEMENTATION: NOT STARTED
COMMIT: NO
PUSH: NO
DEPLOY: NO
```

> **PLAN ONLY.** Ingen kode, skjema, validering, matching, UI, fritekst eller tester er endret.
> Ingen commit/push/deploy. `docs/IDENTITY-TRUST-PLAN-v1.0.md` og
> `docs/ONBOARDING-O2-FIELD-AUDIT-PLAN-v1.0.md` urørt. Neste steg: Georges godkjenning på
> avgjørelsene i §AG (kritisk: #6 P2), deretter «kjør» for **P1**, så **P2**.



---



























