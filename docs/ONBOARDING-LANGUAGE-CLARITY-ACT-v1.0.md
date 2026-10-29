# TOSOM – ONBOARDING LANGUAGE & CLARITY ACT O1
## RESULTATDOKUMENT v1.0 (29.10.2026)

Kontrollert ACT: onboarding-språk, forståelighet og oppsummerings-UX.
Kildeplan: `docs/ONBOARDING-LANGUAGE-UX-PLAN-v1.0.md` (§A–AE).
Status: **ferdig, verifisert, IKKE committet** (per ACT-instruk §41).

---

## A. Scope

Tillatt (og utført):
- Onboarding-copy, helper-tekst, overskrifter, knappetekkster, progresjon.
- Validerings-/feiltekst (kun formulering, ingen nye regler).
- Oppsummering-rendering (struktur + labels + alderskilde).
- Én presentasjons-feilretting: oppsummering leser nå `agePrefMin`/`agePrefMax`.
- Synliggjøring av hard-boundary-konsekvenser («Må stemme» m.fl.).
- Høyverdi-reduksjon av repetisjoner.
- Trivielle grammatikk-/bokmål-feil.
- Målrettet testfil `__tests__/onboarding-language-clarity.test.ts` (OCL-01–20).
- E2E-oppdatering (tittel-assert + to alders-tester).

Ikke rørt (verifisert med hashes, OCL-15/18/19):
- Matching: `lib/matching/dealbreaker.ts`, `cheapFeatures.ts`, `dimensions.ts`,
  `unifiedScorer.ts`, `scoreRound.ts`.
- Schema/validering: `lib/validation/onboarding-setup.ts` (agePrefMin/Max 21–99).
- Consent: `app/api/consent/route.ts`, `app/samtykke/page.tsx`.
- Frozen: `app/questions/data/questions.ts`, `app/chat/data/tasks.ts`.

## B. Product decisions (D1–D10)

| # | Beslutning | Utført |
|---|---|---|
| D1 | Aldersspenn 21–99+ | Ja — min 21–99 (felt), maks 21–99 (felt) + «99+»-chip |
| D2 | Spennet synlig i onboarding og sum | Ja — gruppe «Alder du ønsker å møte» + sum-felt «Aldersspenn» |
| D3 | Pre-fill synlig, endrbar, aldri skjult | Ja — 21/40 står i feltene; linje «Vi har foreslått et utgangspunkt — endre det hvis du ønsker.» |
| D4 | «Må stemme» = hard grense | Verifisert i `dealbreaker.ts` (D-4, `ma-stemme` blokkerer) — forklart i UI |
| D5 | Konsekvens forklart der funksjonen brukes | Ja — Valgvikt viser konsekvenslinje når «Må stemme» velges |
| D6 | Samme prinsipp for religion, barn m.fl. | Ja — én kort linje ved hvert faktisk hard-boundary-valg |
| D7 | Sum viser de viktigste valgene | Ja — seksjoner A–F + detaljseksjoner med «Endre» |
| D8 | Sum påstår ikke «hele profilen» | Ja — fjernet; erstatning «Her ser du de viktigste valgene dine…» |
| D9 | Religion/samtykke/juridikk uendret | Ja — hashes uendret; kun forklaringscopy (flagget) |
| D10 | Matching/vekt/terskler/validering uendret | Ja — hashes uendret |

## C. Flow preserved

- Ruter: 1 onboarding-rute (`/onboarding`) + redirect `/onboarding/start`. Uendret.
- Logiske steg: **13** (uendret rekkefølge, `totalSteps = 13`).
- Inputs: **123** = 74 skjema-felt + 49 skalasvar (PLAN estimerte 124 —
  avvik 1, PLAN-tallet var omtrentlig).
- Required/optional: **71 required** (22 skjema + 49 skala) / **52 optional**.
  Uendret — OCL-16 låser steg-0-feltlista og skalastegene (0,1,3,5,8,10).
- Consent-checkboxer før onboarding: 2 (vilkår + artikkel 9). Uendret.

## D. Language changes (før → etter)

P1-reteelser:
| # | Før | Etter |
|---|---|---|
| P1-1/2 | Sum leste døde `minAge`/`maxAge` → viste alltid 21–40 + «hele profilen din — rolig, trygg og komplett» | Sum leser `agePrefMin`/`agePrefMax`; tittel «Se over før du går videre»; intro «Her ser du de viktigste valgene dine…» |
| P1-3 | «Romslighet i kjønnsrelaterte roller» ved ERQ-6 (følelseshåndtering) | «Følelser i hverdagen. Disse spørsmålene handler om hvordan du vanligvis forholder deg til og uttrykker følelser.» |
| P1-4 | Ingen forklaring på «Må stemme» | Konsekvenslinje i Valgvikt når valget gjøres + én-gangs intro i steg 3 (Livssituasjon) |
| P1-5 | «Sparar...» (nynorsk) hardkodet i loading-knappen | Knappegensenders egen tekst: «Lagrer og stiller deg i kø…» |
| P1-6 | «Hva grense vil du aldri krysse?» (feil grammatikk, motsatt av alternativene) | «Hvilke grenser skal aldri kruses?» — alternativene er grenser en partner må holde |
| P1-7 | «Serîg langsiktig og engasjert forhold» | «Et seriøst og langsiktig forhold» (enum-verdi uendret) |

Øvrige:
- «Hva grenser er viktigst for deg?» → «Hvilken grense er viktigst for deg?»
- «Bosted og avstand!» / «Obs! Fyll inn bosted…» → «Bosted og avstand» /
  «Vi bruker postnummeret til å finne noen i riktig avstand — ikke den nøyaktige posisjonen.»
- «Tilknytningsmønsteret ditt sier mye…» (klinisk) → «Svarene dine forteller oss
  hva du trenger for å føle deg trygg — og hva som skaper avstand.»
- «Dyp Vennskap» / «Langvarig Parforhold» → «Dyp vennskap» / «Langvarig parforhold».
- Validering: «Svar på alle påstandene — det finnes ingen fasit.» → «Svar på alle
  påstandene.» (5 steg + sentral validering). «Velg hva du aldri vil krysse.» → «Velg minst én grense.»

## E. Repetition reduction

Beholdt EN tidlig forklaring («Det finnes ingen fasit.») — i steg 2
(Personlighet), der brukeren møter den første 5-trinns-skalaen.

| MESSAGES | OLD COUNT | NEW COUNT | FJERNET | BEHOLDT |
|---|---|---|---|---|
| «ingen fasit/rette/riktige svar» | 7 (2a-intro+footer, 2b-mikro, 3-intro+footer-liknende, 5b-mikro, 7-intro+footer, validering×5+lib) | 1 | 2a-footer, 2b-mikroguiding, 3-intro-tillegg, 5b-mikroguiding, 7-intro-tillegg+footer, alle valideringsmeldinger | 2a-skalaintro |
| Trust-footer ≈ guiding (dubletter) | 8 | 1 | 2a, 2b, 3, 4, 5b, 6, 7, 8b | 8a (Grenser) — unik sensitive-trøst |
| «brukes i matching / hjelper oss å finne noen» | ~10 (guiding+footer per steg) | 5 (én guiding per steg, ingen dupliserte footere) | alle footere som gjenga guiding | guiding per steg |

## F. Age range (21–99+)

- Control: to tallfelt (Min alder / Maks alder) + «99+»-chip.
- 99+ representeres internt som tallet **99** (ingen ny sentinel): ingen bruker
  kan registreres over 99 år (registreringsalder maks 99), så 99 er det
  faktiske taket. Matching-logikk er urørt — `agePrefMax=99` betyr i praksis
  «99 eller yngre» = «alle» i denne applikasjonen.
- Min: 21–99 (validering uendret, `MIN_AGE=21`). Maks: 21–99, min ≤ maks.
- Default 21–40 pre-fyllt og synlig; nøytral linje sier at det er et forslag.
- Sum render 99 som «99+» (én kilde: `lib/onboarding/age-label.ts`),
  manglende data → «Ikke valgt», aldri falskt intervall.
- E2E: «skal tillate eget aldersspenn (min/max)» + «skal velge 99+».

## G. Hard boundaries

Kartlagt mot `lib/matching/dealbreaker.ts` (verifisert ved kjøring):

| FIELD | HARD BOUNDARY? | CAN SELECT MUST-MATCH? | FORKLARING I UI? | RUNTIME VERIFIED? |
|---|---|---|---|---|
| Aldersspenn (agePrefMin/Max) | Ja, alltid (tosidig) | Nei (alltid aktiv) | Ja — «hard grense … utenfor dette spennet» | Ja |
| Maks avstand (distancePref) | Ja, alltid (radius) | Nei | Ja — «lenger unna kobler vi deg ikke» | Ja |
| Kjønnspreferanse (seekingGender) | Ja, alltid (tosidig) | Nei | Ja — «må begge være åpne for hverandre» | Ja |
| Religion/akseptliste | Ja (med religionOpen=åpen) | Nei | Ja — «bare hvis dere er åpne for hverandre her» (LAWYER FLAG) | Ja |
| Barneønske (Ja/Nei) | Ja (D-3, kun Ja↔Nei) | Nei | Ja — «Hvis dere svarer helt motsatt…» (LAWYER FLAG) | Ja |
| LIVSSTIL-2026: arbeidsrytme, bosted, reiser, dyr, skjerm, bil, kosthold, alkohol, aktivitet | Ja kun ved «ma-stemme» | Ja (Valgvikt) | Ja — én-gangs intro (steg 3) + konsekvenslinje i Valgvikt når «Må stemme» velges | Ja (D-4) |
| Høyde (mann–kvinne gap) | Ja (D-12, skjult for brukeren) | Nei | Nei — bevisst skjult (I-12). Observasjon, ikke endret. | Ja |
| neverCrossBoundary m.fl. (Grenser-steg) | Nei — scoring/bruk i profil, IKKE dealbreaker | Nei | Nei — ingen «må stemme»-tekst her (vil ha vært usant) | Ja |

## H. Religion/livssyn

- Innsamling, samtykke, akseptliste, withdrawal, konto-sletting, matchingbruk:
  **uendret** (hashes OCL-18/19).
- Én ny forklaringslinje i steg 1 ved akseptlisten (matchingskonsekvens,
  beskriver faktisk semantik: tosidig aksept, «åpen for alle» = ingen grense).
- **LAWYER REVIEW REQUIRED** — se §P.
- Sum: viser kun brukerens eget religion-valg + «Åpen for»-status. Ingen
  ekstra sensitiv detalj.

## I. ERQ intro

- «Romslighet i kjønnsrelaterte roller. Svar det som kjennes mest riktig.»
  → «Følelser i hverdagen. Disse spørsmålene handler om hvordan du vanligvis
  forholder deg til og uttrykker følelser.»
- Alle 6 items (reappraisal/suppression) handler om følelseshåndtering —
  den nye teksten matcher innholdet. Internt `ERQ6`-navn beholdes kun i
  kode/comments; ingen klinisk terminologi i aktiv copy (OCL-04).

## J. Summary redesign

Før: 13 flate seksjoner i innsamlingsrekkefølge, døde aldersfelt, død
«Humor»-seksjon (feltene samles ikke lenger), false «komplett»-claim,
ingen edit-handling, LABELS-kartlegging med feil nøkler (verdiene viste rått).

Etter:
- Tittel: «Se over før du går videre». Intro: de viktigste valgene, ikke alt.
- Seksjoner A–F:
  - **A. Om deg** — navn, alder, kjønn, bosted, type relasjon, barn, røyking, høyde.
  - **B. Hvem du ønsker å møte** — kjønnsvalg, **faktisk aldersspenn** (99+), maks avstand.
  - **C. Det som må stemme** — alltid-aktive (alder/avstand/kjønnsvalg),
    religion-status, barneønske, kun aktive «Må stemme»-felt med lesbare labels.
  - **D. Livssyn og religion** — eget valg + åpen-for-status (forsiktig).
  - **E. Profilstatus** — obligatorisk fullført, «49 spørsmål: Fullført»,
    «Valgfrie deler kan være utelatt», ærlig linje om at siden ikke viser alt.
  - **F. Neste steg** — kø, natt til lørdag, ingen kobling = neste runde.
- Detaljseksjoner (personlighet, livssituasjon, hverdagsvalg ×2, tilknytning,
  kjærlighetsspråk, livsstil, relasjonsstil, fremtid, grenser, moden
  nysgjerrighet) — hver med «Endre»-knapp (goToStep — eksisterende
  arkitektur, ingen ny navigasjon).
- LABELS-kartlegging rettet for de lagrede verdiene bak «Rolig og
  forutsigbart» og «Alene og isolert».
- Ingen «hele profilen»/«komplett» (OCL-03). Ingen interne IDs (OCL-12).

## K. Validation/buttons

- Feiltekster: handlingsrettede («Velg minst én grense», «Svar på alle
  påstandene», «Maks alder må være over minste alder»). Generisk fallback
  beholdt («Kunne ikke lagre profilen din. Vennligst prøv igjen.»).
- Knapper: fremover = «Fortsett til neste steg» (12 steg), «Fortsett» (sum),
  «Start reisen» (siste handling — lagrer + kø), back = «Tilbake» (BackButton).
  Loading: «Lagrer og stiller deg i kø…». Ingen blanding av Neste/Videre/Lagre.
- «*»-stjerner fjernet fra alle feltlabels (konsistent, lavstøyende):
  påkrevde signaleres av deaktivert CTA («Fyll ut alle påkrevde felt») +
  feilboks; valgfrie grupper er merket «(Valgfritt)» (steg 1 seksjon C).
  Et felt som IKKE var påkrevd («Hva gjør intimitet trygg») feilvisede med «*»
  — rettet.

## L. Progress/resume

- «Steg X av 13»-indikator + progressbar beholdt (én kilde, `totalSteps`).
- Én-gangs resume-linje i steg 1: «svarene dine lagres underveis, så du kan
  fortsette senere» — runtime-verifisert (server-draft + autosave ved
  stegbytte + restore ved mount; e2e-autosave/draft-tester grønne).
- «Du kan endre svarene dine i venterommet» i steg 13 — verifisert:
  venterommet linker «Gå til profil» → `/onboarding` med prefill.

## M. Privacy visibility

- «Svarene dine brukes kun til å bygge profilen din og finne en god match»
  (utvasket «kun»-claim) → «Svarene dine brukes i matchingen — de vises
  ikke offentlig.» **LAWYER REVIEW REQUIRED.**
- Anonymitetsvarselet («Partneren din ser dette navnet») beholdt — presist.
- Ingen nye «bare X ser dette»-claims. OCL-20 låser det.

## N. Mobile/desktop

- Alle endringer bruker eksisterende OB-designsystem og responsiv grids
  (`grid-cols-2` bryter ned til én kolonne, chips wrappes, sum-seksjoner
  er fullbredde kort med `gap-4` mellom label/verdi).
- «99+»-chip + tekstfelt: chip-linjen er `flex-wrap`; «Maks avstand»-slider
  og aldersfelt deler eksisterende mobile mønster.
- Ingen ny dekorasjon, gradienter eller gamification.
- Mekanisk preview: ikke mulig i denne agent-øktens terminal (ingen
  interaktiv browser) — e2e (Playwright Chromium desktop + Mobile Chrome,
  scenarier A–H + B/C-alder) er den automatiske mobil/desktop-ekvivalensen.

## O. Tests

Ny fil: `__tests__/onboarding-language-clarity.test.ts` — **OCL-01–20**, alle grønne:
OCL-01 canonical aldersfelt · OCL-02 99+ render + «Ikke valgt» · OCL-03 ingen
false «hele profilen/komplett» · OCL-04 ERQ-intro = følelser · OCL-05 0 «Sparar»
· OCL-06 0 «Serîg» · OCL-07 0 «Hva grense» · OCL-08 hard-boundary-forklaring
· OCL-09 religion-forklaring matcher runtime · OCL-10 MIN_AGE=21 · OCL-11 99+-chip
· OCL-12 sum-render av canonical state (renderToStaticMarkup) · OCL-13 kø-copy
· OCL-14 ingen match-garanti · OCL-15 frozen-hashes · OCL-16 required/optional
· OCL-17 13 steg · OCL-18 consent-hashes · OCL-19 matching-hashes · OCL-20
privacy-claims.

E2E-oppdatering: `e2e/tests/onboarding.spec.ts` — sum-tittel-assert +
2 nye steg-1-tester (eget aldersspenn; 99+-chip).

## P. Legal-review flags (LAWYER REVIEW REQUIRED)

Ingen er juridisk godkjent. Sendes til advokat før beta:
1. **Steg 1, akseptliste for religion/livssyn** — ny linje: «Dette er en hard
   grense: en kobling skjer bare hvis dere er åpne for hverandre her.»
   (Forforklaring av artikkel-9-matchingsbruk; endrer ikke samtykketeksten.)
2. **Steg 1, «Ønsker du barn?»** — ny linje: «Hvis dere svarer helt motsatt
   («Ja» og «Nei»), kobles dere ikke sammen.» (Forforklaring av D-3; sensitivt
   personopplysningsområde.)
3. **Steg 1, bunnlinje** — endret personvern-claim: «Svarene dine brukes i
   matchingen — de vises ikke offentlig.» (Erstattet et utvasket «kun»-claim.)

## Q. Remaining observations (IKKE endret — utenfor ACT-scope)

1. **Sentral gate vs steg-lokal validering:** `validateOnboardingStep`
   (sentral pre-flight) dekker ikke steg 2/4/6/8/9 sine lokale required-felt
   (workType, loveGive, buildTogether, neverCrossBoundary m.fl.). En bruker som
   hopper via «Endre»-hopp kan få 400 på siste steg i stedet for å bli sendt
   tilbake. Eksisterende, ikke endret (valideringslogikk låst).
2. **Skjult høyde-dealbreaker (D-12):** mann–kvinne-høydegap blokkerer, men
   vises aldri for brukeren (I-12). Bevisst designbeslutning — verdt en
   bevisst UX-vurdering før beta.
3. **Døde felt i ProfileData:** `minAge`/`maxAge`, `seeking`, `firstName`,
   `location`, `maxDistance` m.fl. er legacy i `OnboardingFlow`-interface og
   `stepsMeta`/`guidingTexts`-arrayene er døde koder. Uendret (kodeopprydding
   utenfor copy-scope).
4. **«Moden nysgjerrighet»** som steg-navn er uvanlig norsk, men er et
   valgt/brukt begrep (også i PLAN) og ikke en feil — beholdt.
5. **RoundReminder** («Matcherunden kjører lørdag…») vises på alle steg —
   korrekt per `MATCH_ROUND`-konfig, men kan oppleves som press tidlig i
   onboarding. Observasjon.
6. **`saveDraftToServer`** POSTer full data ved stegbytte — teknisk korrekt,
   men «lagres underveis» i copy-en refererer til dette + sessionStorage. OK.

## R. Final verdict

- Onboarding-flyten: **uendret** (13 steg, 1 rute, samme rekkfølge, samme
  payload, samme matching, samme consent).
- Språket: menneskelig, rolig, konkret; 7 P1-feil rettet; repetisjoner ned fra
  ~20 duplikater til 1 tidlig forklaring + per-stege unique guiding.
- Oppsummeringen: ærlig, organisert, editérbar, aldersspennet sant.
- Hard boundaries: forklart der valget skjer, kun der det faktisk blokkerer.
- Testing: OCL-01–20 grønne; `npm run verify`, `npm run lint`, `npm run build`,
  Playwright — se resultatfelt i rapport (alle grønne, se §41-rapport).
- **Commit: NEI. Push: NEI. Deploy: NEI. Brukere invitert: NEI.**
- Advokatrevise: 3 punkter (P) — kreves før beta.

## S. REV 1.1 — PRE-COMMIT TRUTH CHECK (to punkter, 29.10.2026)

### S-1. Grensespørsmålet («neverCrossBoundary»)

Feltet samler inn EGENE grenser som betyr mest (respekt, tid alene,
kontakt med venner/familie, eget rom, ærlighet — min 1, maks 2).
Matcheringsvirkning: **ingen** (feltet brukes ikke i
`lib/matching/dealbreaker.ts` eller noen scoring).

- Fjernet: «Hvilke grenser skal aldri kruses?» (ugodkjent, «kruses» feil).
- Godkjent: **«Hvilke grenser er avgjørende for deg?»**
  («Hva må stemme for at en kobling skal være aktuell?» forkastet —
  ville misvisse siden feltet IKKE blokkerer i matchingen.)
- Regression: OCL-21 låser formulering, semantikk og null
  matcheringsvirkning.

### S-2. 99+ → 99 (STOPP rapportert)

Runtime-sjekket fra `checkAgePreferenceOneWay`
(`lib/matching/dealbreaker.ts`): `age > agePrefMax` → dealbreaker.
Et lagret `agePrefMax = 99` betyr derfor **bokstavelig «maks 99»**
(Alternativ A) — IKKE «99+/åpent oppover». Profil-oppdateringsveien
(`lib/validation/profile.ts`) tillater i øvrig alder opptil 100, så
et 100-årskandidat utelates faktisk.

- Rettet: alle «99+»-etiketter (chip, hjelpetekst, sum, tests) står
  nå som **99**. OCL-02/11/12 og e2e låser det.
- **Produktbeslutning venter på George:** (a) beholde synlig maks = 99
  (status quo etter denne rettingen), eller (b) gjøre semantics genuint
  åpent oppover (krever egen ACT + matching-endring).

### S-3. Verifisering REV 1.1

OCL-01–21, `npm run verify`, `npm run lint`, `npm run build`,
onboarding-e2e (chromium desktop + mobile) — se end-rapport.
Kun 2 punkter endret; ellers LOCKED.

## T. REV 1.2 — 99+ PRODUKTBESLUKT: ÅPEN ØVRE GRENSE

George har tatt produktbeslutningen: **99+ betyr INGEN øvre
aldersgrense.** Et lagret «99» skal IKKE tolkes som bokstavelig maks 99.

### T-1. Produktinvariant

- Min alder: 21–99. Maks alder: 21–98 ELLER 99+.
- 99+ = ingen øvre aldersgrense — en kandidat må aldri forkastes fordi
  kandidatens alder > 99 når søkeren har valgt 99+.
- 35–99+ betyr: minimum 35, ingen øvre grense.

### T-2. Kanonisk representasjon

`agePrefMax = null` (eksplisitt) = 99+. Ingen magisk sentinel
(999/120/1000) — `deepProfileData` er JSON-kolonne, null er naturlig og
krever ingen migrasjon. `number 21–98` = endelig maks. `toAgeNumber`
(matching) har allerede returnert null for null, og begge matching-
konsumenter (dealbreaker.ts, cheapFeatures.ts) gjorde ALLEREDE ingen
maks-alder-sjekk når max er null — matching-atferden for null-max er
dermed identisk med ønsket produkt; endringen er at null nå er et
EKSPPLISITT produktvalg som validering/lagring/prefill må bære.

### T-3. What changed (nøyaktig)

- `lib/validation/onboarding-setup.ts`: `agePrefMax` →
  `z.coerce.number().min(21).max(98).nullable()`. Brukerens EGEN alder
  (maks 99) er EGET felt og UENDRET.
- `lib/validation/onboarding-steps.ts` + `Step1Profile.tsx`: null er
  gyldig valg (99+); endelig maks 21–98.
- `lib/matching/dealbreaker.ts`: KOMMENTAR-ALENE (dokumenterer REV 1.2).
  Ingen atferdsendring; atferdslinjene låst i OCL-19.
  `cheapFeatures.ts`, `dimensions.ts`, `unifiedScorer.ts`, `scoreRound.ts`:
  UENDRET (identiske SHA-256).
- `lib/profile/toOnboardingData.ts`: prefill bærer eksplisitt null
  (99+ restaureres — ikke 40/blank/99).
- `app/onboarding/OnboardingFlow.tsx`: prefill-sammenslåingen behandler
  `agePrefMax: null` som meningsbærende (99+) — ellers forsvant 99+-valget
  ved reload uten server-draft (f.eks. på steg 1). Et feltspesifikt
  unntak; øvrige felt behandler null fortsatt som «tomt».
- `Step1Profile.tsx`: chip «99+» skriver null; hjelpetekst:
  «99+ betyr at du ikke setter noen øvre aldersgrense.»
- `lib/onboarding/age-label.ts` + oppsummering: null renderes «99+»
  (f.eks. «21–99+»); endelige verdier renderes som faktiske tall.
- Default 21–40 uendret. Synlig rekkefølge/steg/payload-struktur uendret.

### T-4. Tests

- AGE99-01–13 (`__tests__/age99-open-ended.test.ts`) — eksakt semantics,
  save/prefill-roundtrip, visning.
- OCL-02/11/12/19 oppdatert: 99+ sant, open-ended runtime, sum, prefill,
  endelige intervaller uendret; OCL-19 refined til «kun åpen maks-alder
  tillatt» med hashes + atferds-linjer.
- Grensespørsmålet («Hvilke grenser er avgjørende for deg?») er UENDRET
  (REV 1.1); neverCrossBoundary har fortsatt ingen matcheringsvirkning.
