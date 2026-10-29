# TOSOM — ONBOARDING LANGUAGE & UX PLAN v1.0

**Dato:** 2026-10-29
**Commit (lest mot):** `0a3aca8` (main = origin/main)
**Produksjon:** `https://www.tosom.no/api/system/health` → HTTP 200 `{"status":"ok"}`
**For:** George, Qwen, Cline
**Arbeidsmetode:** `ACT-PIPELINE-v1.0.md` — dette er PLAN/read-only. Ingen implementering.
**Scope:** Hele den synlige onboardingen fra innlogging til venterommet.
**Frozen (utenfor scope):** Bli Kjent V2 (`app/questions/data/questions.ts`), Oppgaver V2 (`tasks.ts`).
`docs/IDENTITY-TRUST-PLAN-v1.0.md` er ikke rørt, staget eller endret.

---

## 0. PRE-FLIGHT (utført 29.10.2026)

| Sjekk | Resultat |
|---|---|
| Branch | `main` ✅ |
| Lokal main = origin/main | `0a3aca87c86c8a79be0062201e67780b3429caa0` — identisk ✅ |
| Produksjonshelse | HTTP 200, `status: ok` ✅ |
| Produksjons-SHA | Kan ikke verifiseres fra agent (ingen Vercel-token lokalt; helse-endepunktet viser kun status+timestamp til publikum). Siste main-commit: `0a3aca8` (29.10, «fix: restore Tosom wordmark in public header»). **Krever George:** bekreft deployed SHA i Vercel. |
| Working tree | Ingen tracked diffs. Kun untracked: `docs/IDENTITY-TRUST-PLAN-v1.0.md` (kjent separat fil — urørt) og `tmp/` (arbetsmappe). → Ingen STOPP. |

---

## A. EXECUTIVE SUMMARY

Onboarding er én rute (`/onboarding`) med **13 logiske steg**, **124 synlige input**
(49 skalasvar + 75 valg-/tekstfelt), hvorav **70 påkrevde** og **54 valgfrie**.
Étt samtykkespill (`/samtykke`, to avkrysninger) før første steg.

**Tone og struktur er generelt god**: rolig, konkret, «Steg X av 13» + prikk-indikator,
autosave med «Lagret»-indikator, per-felt mikro-guiding, sanne kø-tekster
(fredag 23:59-fristen stemmer med venterommet).

**Men fem saker er P1 (må rettes før beta utvides):**

1. **Oppsummeringen lurer brukeren.** «Aldersintervall» viser alltid 21–40
   (leser døde felt `minAge`/`maxAge` i stedet for `agePrefMin`/`agePrefMax`),
   og teksten «Dette er hele profilen din — rolig, trygg og komplett» er falsk:
   oppsummeringen viser verken de 49 skalasvarene, religion/akseptlista
   (art. 9-data!) eller LIVSSTIL-2026-valgene.
2. **«Må stemme» er en hard dealbreaker — det vet ikke brukeren.**
   Valgvikt-ene forklarer aldri at «Må stemme» kan blokkere en match;
   religion og barn er også hard constraints uten noen ramme.
3. **ERQ-6-introen stemmer ikke med spørsmålene.** «Romslighet i
   kjønnsrelaterte roller» introducerer seks spørsmål om følelseshåndtering.
4. **«Sparar...» (nynorsk) på den siste knappen** — PremiumCTAButton viser
   loading-tekst i stedet for «Stiller deg i kø…», og språkvakta fanger ikke ordet.
5. **Språkfeil på påkrevde spørsmål:** «Hva grense vil du aldri krysse?»
   (grammatikk + uklar mening) og «Serîg langsiktig og engasjert forhold»
   (korrupt ord i et påkrevd valg).

I tillegg: **8 steg gjentar seg selv** (guidingText øverst ≈ trust-tekst nederst),
«ingen fasit/rette svar»-familien står **7+ ganger**, grenser spørres
**tre ganger** (steg 4, 10, 11), og aldersprefyll 21–40 brukes i matching
uten at brukeren vet det.

**P0: 0 · P1: 8 · P2: 21 · P3: 8** — full liste i §AB.

Foreslått ACT: **~10 copy-patches + 2 runtime-fiksjoner** (oppsummering),
én fil per patch, ingen endring i matching/validering/schema/consent.
To formuleringer krever Georges beslutning (P1-4, P1-8). Én post flagges
**LAWYER REVIEW REQUIRED** (samtykke-boksens «kun»-claim) — endres ikke i ACT-en.

---

## B. CANONICAL ONBOARDING FLOW

Verifisert mot koden (ikke filnavn).

### B.1 Entry (hvor brukerens vei inn starter)

| Entry | Runtime-måte |
|---|---|
| `/login` | **Primær inngang.** Auto-registrering ved første innlogging. Etter login: sjekk `/api/onboarding/progress` → `onboardingComplete=false` → hard-redirect `window.location.href = '/onboarding'` (`app/login/page.tsx:29-45`). |
| `/register` | `redirect('/login')` — ingen egen registrering lenger. |
| `/onboarding/start` | `redirect('/login')` (legacy-inngang, `app/(auth)/onboarding/start/page.tsx`). |
| `/dashboard` | Guard: `needsConsent` → `/samtykke?next=/dashboard`; `!onboardingComplete` → `/onboarding` (`app/dashboard/page.tsx:424-444`). |
| `/matching` (venterom) | `not_started`-tilstand → knapp «Gå til onboarding». |
| `/reisen/avslutning` | «Start ny reise» → `router.push('/onboarding')`. |

**Samtykkegate:** `OnboardingFlow` kjører `GET /api/consent` ved mount;
`needsConsent=true` → `router.replace('/samtykke?next=/onboarding')`.
Siden har **to aktive, aldri forhåndsavkrysset** avkrysninger (vilkår + art. 9)
og knappen «Jeg godtar og fortsetter». Etter suksess → tilbake til `/onboarding`.

### B.2 Flow-innenfor (én rute, klient-side state machine)

- **Route:** `/onboarding` (1 rute, 13 steg, `OnboardingFlow.tsx`, `step` 0–12).
- **Komponenter:** `steps/Step*.tsx` (13 komponenter) + `components/Onboarding{Slide,Section,SelectGrid,TextField}.tsx` + `Valgvikt.tsx` + `ScaleQuestion.tsx` + `BackButton.tsx` + `PremiumCTAButton.tsx`.
- **Datakilde:** flat `Record<string, unknown>` i klientstate; initiale verdier fra
  `sessionStorage` (`tosom_onboarding_draft`) → server-draft (`/api/onboarding/draft`,
  `Profile.onboardingDraft {step,data}` — server er sannhetskilde, WP2) →
  prefill (`/api/onboarding/prefill` → `toOnboardingData(profile, complete)`).
- **Validering:** per steg: komponentens egen `validate()` (blokkerer CTA) +
  sentral gate `validateOnboardingStep()` i `lib/validation/onboarding-steps.ts`
  (speiler server-skjema). Pre-flight i «Start reisen»: `validateAllOnboardingSteps`
  hopper til første ufullstendige steg i stedet for 400.
- **Persistence:** autosave 400 ms debounce (sessionStorage + server-draft);
  steg lagres ved navigasjon; utlogging tømmer begge utkast (`clearOnboardingDraft`).
- **Fullføring (steg 13):** `POST /api/profile/setup` (server validerer med
  `onboardingSetupSchema`, lager/skriver `Profile`, `onboardingComplete=true`,
  `deepProfileComplete=true`, `onboardingStep=10`, sletter draft, sender
  velkomst-e-post) → `POST /api/journey/queue` (402 → `/betaling`; suksess →
  `journeyState='QUEUED'`, `matchQueuedAt` satt) → `router.push('/matching')`.
- **Next step per steg:** lineær 0→12; Back-knapp (steg 1–12, ikke steg 1);
  steg 12 (Oppsummering) har Back → steg 10 (indeks); steg 12 → «Start reisen».
- **Back-behavior (browser):** enkel rute — browser-back forlater `/onboarding`;
  data ligger lagret (server-draft), ingen kopi om dette.
- **Feilvisning:** steg-feil i steget («Vennligst fyll ut alle påkrevde felt: …»);
  lagre/kø-feil på siste steg («Noe gikk galt»-boks i layout, `layoutError`).

### B.3 Tilstandsovergang etter onboarding (runtime truth)

```
ONBOARDING COMPLETE (profil lagret, onboardingComplete=true)
  → POST /api/journey/queue → journeyState: IDLE → QUEUED (matchQueuedAt)
  → /matching «in_queue» (man–fre): «Du er i venterommet, {navn}» + nedtelling til fredag 23:59
  → fredag 23:59–lørdag 06:00 (lokal tid): «locked» (cron-vinduet 02–04 UTC ligger inne i)
  → etter lørdag 06:00: «no_match» (var i kø under runden) eller «in_queue» (gikk i kø etter runden)
  → match: «matched»-kort i venterommet → /dashboard eller /chat/[id]
```

Kø-tekstene er konsistente mellom onboarding (RoundReminder) og venterom:
fredag 23:59 = siste sjanse, runden kjører natt til lørdag, ingen match denne
runden = står i kø til neste. ✅ (Bemerk: `getNextFriday2359()` er duplisert
i to filer — `OnboardingLayout.tsx` og `matching/page.tsx` — driftrisiko.)

---

## C. FULL STEP INVENTORY

13 steg, én rute. Tekstene er eksakte fra komponentene (les 29.10).
`*` = stjerne i label i UI-et; **[P1-x]/[P2-x]/[P3-x]** = funn-ID (se §AB/§AA).

### Steg 1 — Grunnprofil (`Step1Profile.tsx`, indeks 0)
Ingen Back-knapp. Seksjoner: «IDENTITET OGSÅ SØK» (A), «BOSTED OG AVSTAND» (B), «LIVSSTIL OG DAGLIG RYTME» (C).
- C-sesjonens tittel dekker også religion og barn — misvisende gruppering **[P2-10]**.

| Felt | Label (synlig) | Type | Req/opt |
|---|---|---|---|
| identityName | «Hva vil du at vi skal kalle deg?» | tekst, ph «Fornavnet ditt» | req |
| age | «Alder» | tall | req (21+) |
| gender | «Hva er kjønn?» | grid 4 (Mann/Kvinne/Ikke-binær/Vil ikke oppgi) | req |
| seekingGender | «Hvem søker du?» | grid 3 (Mann/Kvinne/Begge deler) | req |
| city | «Hvor bor du?» | tekst, ph «Byen du bor i» | req |
| postalCode | «Postnummer» | 4 siffer, må eksistere | req |
| distancePref | «Maks avstand til potensielle matches» | slider, tetthetsbasert min–max | req (default 0 → tvinger handling) |
| agePrefMin / agePrefMax | «Aldersspenn du søker» | 2 sliders, **stille default 21/40** | req **[P1-8]** |
| height | «Høyde (cm)» | tall | opt |
| bodyType | «Kroppstype?» | grid 5 | opt |
| lifestyle | «Livsstil?» | grid 4 | opt |
| smoking | «Røyking og snus?» | grid 4 | opt |
| religion | «Religion / livssyn?» («Velg opptil fire.») | grid 12 + Annet, maks 4 | opt |
| acceptedReligions | «Hvem passer til deg her?» («Velg opptil fire — eller velg «Åpen for alle» …») | grid 13, «Åpen for alle» velges alene | opt |
| (R-12-hint) | ℹ️ «Du har oppgitt X … men du har ikke valgt X blant … Da kan du enkelt legge det til.» | kun info — aldri feil/autoutvalg | — |
| children | «Barn?» | grid 4, maks 2 | opt |
| wantChildren | «Ønsker du barn?» (inkl. «Åpen for bonusfamilie» + desk.) | grid 4, maks 2 | opt |

CTA: «Fortsett til neste steg» (blokkert: «Fyll ut alle påkrevde felt»).
Trust: «Svarene dine brukes kun til å bygge profilen din og finne en god match.»

### Steg 2 — Personlighet & identitet (`Step2Personlighet.tsx`, indeks 1)
Tittel «Personlighet & identitet» · Sub «Fortell litt om hvem du er — uten filter.» ·
Guiding «Personligheten din er det som gjør deg til deg.»
- selfDesc «Fortell litt om hvem du er.» (min 10 tegn) — req
- energyGiver «Hva gir deg energi?» maks 4 (7) · energyDrainer «Hva tapper energi ut av deg?» maks 3 (7; «Ubestemthet og venting» **[P3-4]**) · pressureReact «Hvordan reagerer du når presset øker?» (4) · quirk «Hva er en egenskap eller vane du ler av deg selv?» — alle opt **[P2-5]**
- Skala-intro «Hvordan er du vanligvis? Noen påstander — svar det som kjennes riktigst. Det finnes ingen fasit.» + **TOSOM_PERSONALITY, 15 påstander — req**
- Trust «Det er ingen rette eller gale svar. Svarene dine hjelper oss å forstå deg bedre.» **[P2-2]**

### Steg 3 — Livssituasjon (`Step2Livssituasjon.tsx`, indeks 2)
Tittel «Livssituasjon» · Sub «Hva jobber du med, hva bor du i, og hvordan ser hverdagen din ut?» ·
Guiding «Livssituasjonen din gir oss en viktig oversikt over hverdagen din.»
- workType «Hva jobber du med?» (9) · housingType «Hva bor du i?» (7) · householdSize «Hvor mange bor i hjemmet?» (4) · economicStability «Hvordan er det økonomisk for deg?» (5) — **alle req**
- LIVSSTIL-2026 (alle opt, hver med **Valgvikt** «For deg i en match:» «Er ikke så viktig / Bør stemme / Må stemme» **[P1-4]**): arbeidsrytme (4) · bosted (4) · reiser (4) · dyr (3) · skjerm (4)
- responsibilities «Hva ansvar har du i livet ditt?» maks 3 (5) · dailyRoutine «Hvordan starter en typisk dag for deg?» (3, med beskrivelser) — opt
- Trust «Svarene dine hjelper oss å finne noen som passer din hverdagsrytme.»

### Steg 4 — Tilknytning & trygghet (`Step3Tilknytning.tsx`, indeks 3)
Tittel «Tilknytning & trygghet» · Sub «Dette hjelper oss å forstå hva du trenger for å kjenne deg trygg.» ·
Guiding «Tilknytningsmønsteret ditt sier mye om hvordan du møter andre mennesker.» **[P2-7: klinisk ord + gjentatt ordrett i trust nederst]**
- safetyNeed «Hva gjør deg trygg i en relasjon?» maks 3 (7) · insecurityTrigger «Hva gjør deg usikker i en relasjon?» maks 3 (7) · sadnessNeed «Hva trenger du når du er lei?» maks 2 (5) · stressNeed «Hva trenger du under stress?» mikro «…til å regulere og gjenopprette balanse.» **[P3-5]** maks 2 (4) — alle opt
- importantBoundary «Hva grenser er viktigst for deg?» ph «Noe konkret du trenger at partneren din respekterer» — opt **[P2-4]**
- Skala-intro «Noen påstander om trygghet og nærhet. Svar det som kjennes riktigst — det finnes ingen fasit.» + **ATTACHMENT, 12 påstander — req**
- Trust = guiding ordrett **[P2-1]**

### Steg 5 — Kjærlighetsspråk & nærhet (`Step4Kjærlighetsspråk.tsx`, indeks 4)
Tittel «Kjærlighetsspråk & nærhet» · Sub «Hvordan viser og mottar du kjærlighet?» ·
Guiding «Hvordan du viser kjærlighet er viktig for å finne noen som passer deg.»
- loveGive «Hvordan viser du kjærlighet? *» maks 2 (5) · loveReceive «Hvordan ønsker du kjærlighet? *» maks 2 (5) — **req**
- closenessBuilder «Hva bygger nærhet mellom mennesker?» maks 2 (4) · distanceCreator «Hva skaper avstand mellom deg og andre?» maks 2 (4) — opt **[P2-6]**
- smallThing «Hva er de små tingene som betyr mest for deg?» — opt
- Trust «Kjærlighetsspråket ditt er viktig for å finne noen som passer deg.» ≈ guiding **[P2-1]**

### Steg 6 — Livsstil & verdier (`Step5LivsstilVerdier.tsx`, indeks 5)
Tittel «Livsstil & verdier» · Sub «Hva prioriterer du i hverdagen?» ·
Guiding «Livsstilssvarene dine hjelper oss å finne noen som trives i hverdag sammen med deg.»
- highPriority «Hva er viktigst for deg nå? *» maks 2 (6) · lowPriority «Hva er mindre viktig for deg? *» maks 2 (5) · desiredLifestyle «Hva slags hverdag drømmer du om? *» (3) · undesiredLifestyle «Hva vil du unngå i hverdagen? *» (3) — **alle `*` men IKKE validerings-påkrevde** **[P2-13]**
- goodEveryday «Hva er en god hverdag for deg?» (min 10 tegn) — req
- LIVSSTIL-2026 (opt + Valgvikt; klima uten Valgvikt): bil (3) · kosthold (5) · klima «Hvor viktig er klima og miljø for deg?» (3) · alkohol (4) · aktivitet «Hvor aktiv er du?» maks 3 (5)
- Skala-intro «Noen ting som kan være viktige. Hvor viktig er hvert for deg — i et parforhold?» + **PVQ-10, 10 påstander — req**
- Trust «Hverdagssvarene dine hjelper oss å finne noen som trives sammen med deg.» ≈ guiding **[P2-1, P3-2]**
- **Tungeste skjerm i flyten: 21 input** **[P2-17]**

### Steg 7 — Relasjonsstil (`Step5Relasjonsstil.tsx`, indeks 6)
Tittel «Relasjonsstil» · Sub «Hvordan søker du relasjon — og hvordan balanserer du selvstendighet med fellesskap?» ·
Guiding «Relasjonsstil forteller oss hvordan du søker — og det er like viktig som verdier.»
- relationshipSeeking «Hva type relasjon søker du? *» — req, maks 3; «Åpen & uforpliktende» velges alene (multiHint forklarer det)
  - «Dyp Vennskap» / «Meningsfulle og varige vennskapsband» **[P2-11, P2-20]**
  - «Langvarig Parforhold» / «Serîg langsiktig og engasjert forhold» **[P1-7: korrupt ord]**
- closenessNeed «Hvor mye nærhet trenger du i en relasjon? *» mikro «Tenk på din naturlige rytme — ingen riktig eller feil svar her.» (3) — req
- independenceBalance «Hvordan balanserer du selvstendighet med fellesskap?» — opt
- Trust «Relasjonsstilen din er viktig for å finne noen som passer deg.» (mønster som steg 5) **[P2-1]**

### Steg 8 — Framtid & visjon (`Step6FramtidVisjon.tsx`, indeks 7)
Tittel «Framtid & visjon» · Sub «Hva drømmer du om å bygge?» · Guiding «Framtidsønsker viser veien for hva dere kan bygge sammen.»
- futureVision «Hva er din fremtidsvisjon? *» (4) — **`*` men IKKE påkrevd** **[P2-13]**
- dreamGoal «Hva er din største drøm?» ph «Noe du drømmer om — del det hvis du kjenner deg trygg med det» — opt
- buildTogether «Hva kan dere bygge sammen? *» (min 10 tegn) — req
- experienceAlone «Hva vil du oppleve alene?» (4) · experienceTogether «Hva vil du oppleve sammen?» (4) — opt
- Trust = guiding ordrett **[P2-1]**

### Steg 9 — Kommunikasjon & tilpasning (`Step7HumorPersonlighet.tsx`, indeks 8)
Tittel «Kommunikasjon & tilpasning» **[P2-9: «tilpasning» klinisk; filnavnet «Humor» er død arving]** ·
Sub «Hvordan møter du endring og avklaring i en relasjon?» (overlapper guiding) ·
Guiding «Slik dere kommuniserer, er like viktig som hva dere deler.»
- Skala-intro «Noen påstander om hvordan du reagerer. Svar det som kjennes mest riktig — det finnes ingen fasit.» + **COMMUNICATION, 6 påstander — req**
- Trust «Det er ingen rette eller gale svar. Svarene dine hjelper oss å forstå deg bedre.» (ordrett som steg 2) **[P2-2]**
- CTA blokkert: «Svar på alle påstandene» (eneste steg med denne varianten) **[P2-12]**

### Steg 10 — Grenser & behov (`Step8Grenser.tsx`, indeks 9)
Tittel «Grenser & behov» · Sub «Hvordan ser du på grenser i en relasjon — og hva trenger du at partneren din forstår?» ·
Guiding «Grenser beskytter deg selv — og den du elsker.»
- neverCrossBoundary «Hva grense vil du aldri krysse? *» — req **[P1-6: grammatikk + alternativene er behov, ikke egne grenser]**
- understandPartnersBoundaries «Hvordan forstår du partnerens grenser? *» (4) — req
- limitations «Hva er dine viktigste avgrensninger?» — opt **[P2-4]** · partnerMustUnderstand «Hva må partneren din forstå om deg?» — opt
- Trust «Grenser beskytter deg selv — og den du elsker. Del bare det du kjenner deg trygg med.» ≈ guiding + «del bare…» **[P2-1, P2-3]**

### Steg 11 — Moden nysgjerrighet (`Step8ModenNysgjerrighet.tsx`, indeks 10)
Tittel «Moden nysgjerrighet» **[P2-8: uklart]** · Sub «Hva trenger du for å kjenne deg trygg i nærheten?» ·
Guiding «Dette er et rolig øyeblikk for deg — del bare det du kjenner deg trygg med.» **[P2-3]**
- intimacySafety «Hva gjør intimitet trygg? *» (4) — **`*` men IKKE påkrevd** **[P2-13]**
- comfortableWith «Hva er du komfortabel med i nærheten?» (4) · boundary «Hva er din personlige grense?» — opt **[P2-4]**
- nearerType «Hva type nærhet søker du?» (4) · needsTime «Hvor mye tid trenger du for å åpne deg?» (4) — opt **[P2-6]**
- Skala-intro: **«Romslighet i kjønnsrelaterte roller. Svar det som kjennes mest riktig.»** **[P1-3: stemmer IKKE med itemene (følelseshåndtering)]** + **ERQ-6, 6 påstander — req**
- Trust «Modne svar viser hvem du er — del bare det du kjenner deg trygg med.» («modne svar» uklart + «del bare…» 2. gang på samme skjerm) **[P2-8, P2-3]**

### Steg 12 — Oppsummering (`Step9Oppsummering.tsx`, indeks 11)
Tittel «Oppsummering» · Sub «Se over det du har delt. Du kan endre alt senere.» ·
Guiding **«Dette er hele profilen din — rolig, trygg og komplett.»** **[P1-2: falsk — se §Y]**
Seksjoner: Grunnprofil (10 felt — **religion/akseptliste mangler**) · Livsstil & verdier (3 av ~15) ·
Avstand & alderspref («Aldersintervall» **viser alltid 21–40** **[P1-1, P3-3]**) · Personlighet (4, skalene mangler) ·
Tilknytning (5) · Kjærlighetsspråk (5) · Relasjonsstil (3) · Fremtid og visjon (5) ·
**«Humor & personlighet» — alltid tom seksjon (5 døde felt)** **[P2-14]** · Grenser & behov (4) · Moden nysgjerrighet (5).
**Alle 49 skalasvar er fraværende.** Ingen redigeringslenker (kun Back).
Footer «Du har fullført hele profilen din! Nå er det klart for matching.» + CTA «Fortsett» **[P2-12, P3-6]**

### Steg 13 — Start reisen (`Step10StartReisen.tsx`, indeks 12)
Tittel «Start reisen» · Sub «Du er klar. Nå stiller du deg i kø — vi leter rolig og presist, basert på det du har delt.» ·
Guiding «Trykk på «Start reisen» så stiller vi deg i køen. Natt til lørdag forsøker vi å finne noen som passer deg.»
Intro: hjerte + «Én match om gangen, natt til lørdag. Ingen sveiping, ingen press.»
CTA «Start reisen» → loading **«Sparar...»** (label «Stiller deg i kø…» ignoreres under loading) **[P1-5]**
Trust: «Du kan endre svarene dine i venterommet — endringer gjelder fra neste matcherunde. Du kan også melde deg ut når som helst, uten binding.»

### På tvers av alle steg (layout)
- Steg-indikator «Steg X av 13» + 13 prikker · seksjonsfarge pr. steg.
- **RoundReminder** (alle steg): «X d X t X m til fredag 23:59» + «Matcherunden kjører lørdag. Vær ferdig med profilen før fredag 23:59 for å være med på denne runden — eller la den ligge til neste lørdag.»
- **SaveLogoutBar** (alle steg): «Lagret»/«Lagrer…» + «Logg ut» (tømmer utkast) — **«Lagret» vises allerede ved side-last** **[P2-15]**.
- Layout-footer: «Tosom — der sanne møter skjer i ro og trygghet».

---

## D. USER JOURNEY VIEW (slik brukeren opplever det)

```
LOGIN (auto-registrering) → SAMTYKKE (2 avkrysninger) → STEG 1–13 → VENTEROMMET
```

| Steg | Hva tror vi brukeren skal forstå her? | Hva må brukeren faktisk gjøre? | Flag |
|---|---|---|---|
| Samtykke | «Jeg godtar vilkår + gir samtykke til sensitive data; svar brukt kun til én match.» | To avkrysninger + knapp. | Klar. «kun til å finne én match» understremer ikke at profilen vises til matchen **[P2-19, LAWYER]**. |
| 1 Grunnprofil | «Grunnleggende om meg + hvem jeg søker + hvor langt.» | 9 påkrevde felt inkl. 3 sliders. | Aldersslider stille pre-fylt (21/40) — ser valgfri ut, men brukes i matching **[P1-8]**. Seksjon C-sjekk: religion/barn under «Livsstil og daglig rytme» **[P2-10]**. |
| 2 Personlighet | «Fortell litt + 15 påstander om meg.» | 1 tekstfelt + 15 skalasvar. | Klar. |
| 3 Livssituasjon | «Hverdag: jobb, bolig, økonomi + hverdagsvalg med vekt.» | 4 påkrevde + 10 valgfrie + 5 Valgvikt. | Valgvikt forklarer ikke «Må stemme»-konsekvensen **[P1-4]**. |
| 4 Tilknytning | «Hva du trenger for trygghet + 12 påstander.» | 5 valgfrie grid + 12 skalasvar. | «Tilknytningsmønster» — fagord uten forklaring **[P2-7]**. |
| 5 Kjærlighetsspråk | «Slik viser/mottar du kjærlighet.» | 2 påkrevde + 3 valgfrie. | Klar. |
| 6 Livsstil & verdier | «Prioriteringer + hverdagsvalg + 10 påstander.» | 1 påkrevd tekst + 10 skala + 19 valg. | **Veggs av valg (21 input)** — tungt, særlig mobil **[P2-17]**. `*`-felt er ikke påkrevd **[P2-13]**. |
| 7 Relasjonsstil | «Hva slags relasjon + hvor mye nærhet.» | 2 påkrevde + 1 valgfri. | «Serîg» **[P1-7]**; «Dyp Vennskap» vs «partner»-rammen seinere **[P2-20]**. |
| 8 Framtid & visjon | «Drømmer + hva dere kan bygge sammen.» | 1 påkrevd tekst + 4 valgfrie. | «fremtidsvisjon *» ikke påkrevd **[P2-13]**. |
| 9 Kommunikasjon | «Slik dere kommuniserer.» | 6 skalasvar. | Tittel «tilpasning» klinisk **[P2-9]**. |
| 10 Grenser | «Hva du ikke tolererer + hva partneren må forstå.» | 2 påkrevde + 2 valgfrie. | «Hva grense vil du aldri krysse?» — feil + motsatt alternativene **[P1-6]**. Tredje grensespørsmål **[P2-4]**. |
| 11 Moden nysgjerrighet | «Slik du åpner deg i nærheten + 6 påstander.» | 5 valgfrie + 6 skalasvar. | Intro «kjønnsrelaterte roller» ≠ itemene **[P1-3]**; tittel/side-tekst uklare **[P2-8]**. |
| 12 Oppsummering | «Se hele profilen din — komplett.» | Gå gjennom 10 seksjoner + Fortsett. | **Ikke hele profilen**: 49 skalasvar, religion, LIVSSTIL-2026 mangler; alder viser alltid 21–40 **[P1-1, P1-2]**. |
| 13 Start reisen | «Jeg stiller meg i kø; lørdag prøves det; ingen press; kan ut.» | Én knapp. | Loading «Sparar...» **[P1-5]**. Ellers klar og sann. |
| Venterom | «Jeg er i kø; fredag 23:59 er siste sjanse; kan forlate.» | Vente / forlate / oppdatere profil. | To knapper med samme funksjon (forlate/melde deg ut) **[P2-20→P2-21]**; «resonans»-begrepet møtes først ved match, uten forklaring fra onboarding **[P2-22]**. |

**Mønster:** Teksten forklarer oftest *riktig* hva skjer, men (a) to av de
viktigste «forståelse»-momentene svikter (dealbreaker-konsekvenser,
oppsummeringens «hele profilen»), og (b) hver skjerm bærer dobbel
forståelsesbyrde (guiding øverst + trust nederst).

---

## E. COUNTS (talt maskinelt der det lot seg gjøre)

| Mål | Antall | Note |
|---|---|---|
| Ruter | **1** | `/onboarding` (+1 legacy-redirect `/onboarding/start`; post: `/matching`) |
| Skjermer (steg) | **13** | `totalSteps=13`, «Steg X av 13» |
| Spørsmålsgrupper (label-erte input) | **75** | 21 påkrevde + 54 valgfrie (valg-grid, slider, tekstfelt) |
| Skalaprofiler | **49** | TOSOM_PERSONALITY 15 + ATTACHMENT 12 + PVQ-10 10 + ERQ-6 6 + COMMUNICATION 6 (`TOTAL_ITEMS=49`) — alle req |
| **Totalt input** | **124** | 75 + 49 |
| Påkrevde (req) | **70** | 49 skala + 9 steg 1 + selfDesc + 4 steg 3 + 2 steg 5 + 2 steg 7 + buildTogether + 2 steg 10 |
| Valgfrie (opt) | **54** | |
| Conditionale | **2** | R-12-hint (religion) vises kun ved mangel; `*`-labels uten krav (6 felt) — se §K |
| Consent/confirmation-momenter | **1** | `/samtykke` (2 avkrysninger: vilkår + art. 9) |
| CTA-knapper | 13 + layout | 1× «Fortsett til neste steg»-familie, 1× «Start reisen», 1× «Jeg godtar og fortsetter» (samtykke) |

---

## F. LANGUAGE REVIEW (klassifisering av synlig copy)

Klasser: KEEP · UNCLEAR · TOO FORMAL · TOO LONG · TOO VAGUE · REPETITIVE ·
AI-LIKE · THERAPEUTIC · TECHNICAL · LEGAL-SENSITIVE · PRODUCT-TRUTH ISSUE ·
GRAMMAR · UNNECESSARY.

| # | Steg | Copy | Klass | Note |
|---|---|---|---|---|
| F-01 | 11 | «Romslighet i kjønnsrelaterte roller.» | **PRODUCT-TRUTH ISSUE + THERAPEUTIC** | Stemmer ikke med ERQ-6-itemene (følelseshåndtering). **[P1-3]** |
| F-02 | 13 | «Sparar...» (loading) | **GRAMMAR (nynorsk)** | Må være «Lagrer…»/«Stiller deg i kø…». Språkvakta fanger det ikke. **[P1-5]** |
| F-03 | 7 | «Serîg langsiktig og engasjert forhold» | **GRAMMAR** | Korrupt ord. **[P1-7]** |
| F-04 | 10 | «Hva grense vil du aldri krysse?» | **GRAMMAR + UNCLEAR** | «Hvilken grense…» — og spørsmålet er motsatt av alternativene (som er behov). **[P1-6]** |
| F-05 | 4 | «Tilknytningsmønsteret ditt sier mye…» | **THERAPEUTIC + REPETITIVE** | Fagord, ubegrunnet for leken, gjentatt ordrett i trust. **[P2-7]** |
| F-06 | 9 | «Kommunikasjon & tilpasning» | **TECHNICAL** | «tilpasning» klinisk; tittel dekker ikke itemene (konflikt/reparasjon). **[P2-9]** |
| F-07 | 11 | «Moden nysgjerrighet» / «Modne svar viser hvem du er» | **UNCLEAR + AI-LIKE** | «Modne svar» forstår leken ikke. **[P2-8]** |
| F-08 | 3 | «Er ikke så viktig / Bør stemme / Må stemme» (Valgvikt) | **KEEP, men PRODUCT-TRUTH GAP** | Ordene er fine; konsekvensen («Må stemme» blokkerer) mangler. **[P1-4]** |
| F-09 | 1,3,6 | «For deg i en match:» (Valgvikt-prefix) | **KEEP** | Koncret, bra. |
| F-10 | 12 | «Dette er hele profilen din — rolig, trygg og komplett.» | **PRODUCT-TRUTH ISSUE** | Falsk — 49 skala + religion + LIVSSTIL-2026 mangler. **[P1-2]** |
| F-11 | 12 | «Aldersintervall» (viser alltid 21–40) | **PRODUCT-TRUTH ISSUE** | Leste felt som aldri settes. **[P1-1]** |
| F-12 | 6 | «Hva er din fremtidsvisjon? *» | **PRODUCT-TRUTH ISSUE** | `*` men ikke påkrevd. **[P2-13]** |
| F-13 | 1–11 | guiding øverst ≈ trust nederst (8 steg) | **REPETITIVE** | **[P2-1]** |
| F-14 | 2,3,4,6,9,11 | «…det finnes ingen fasit.» / «ingen rette eller gale svar» / «ingen riktig eller feil svar her» | **REPETITIVE** | 7+ forekomster av samme beroligelse. **[P2-2]** |
| F-15 | 8,10,11 (+6 dreamGoal) | «del bare det du kjenner deg trygg med» | **REPETITIVE** | 4+ ganger; 2× på samme skjerm (steg 11). **[P2-3]** |
| F-16 | 1 | «Religion / livssyn?» / «Hvem passer til deg her?» | **LEGAL-SENSITIVE, KEEP** | Rolig, presist, ikke-coercive. R-12-hint er bra. **[P2-19 relater]** |
| F-17 | 1 | «Velg opptil fire — eller velg «Åpen for alle» …» | **KEEP** | Klar instruks. |
| F-18 | 1 | «Hvem passer til deg her?» | **UNCLEAR (mild)** | Betjeningen (akseptliste) er ikke 1:1 i tittelen. |
| F-19 | 3 | «Ubestemthet og venting» | **TOO FORMAL** | Tungt substantiv. **[P3-4]** |
| F-20 | 4 | «…til å regulere og gjenopprette balanse.» | **TECHNICAL** | «regulere» fagord. **[P3-5]** |
| F-21 | 6 | «Hverdagssvarene dine hjelper oss…» | **GRAMMAR (mild)** | «Hverdags-». **[P3-2]** |
| F-22 | 12 | «Avstand & alderspref» | **TECHNICAL** | «alderspref» forkortelse. **[P3-3]** |
| F-23 | 7 | «Dyp Vennskap» / «Langvarig Parforhold» / «Mye Samvær» | **GRAMMAR (mild)** | Ujevn kapitalisering vs. resten. **[P2-11]** |
| F-24 | 7 | «Meningsfulle og varige vennskapsband» | **GRAMMAR (mild)** | «vennskapsbånd». **[P2-11]** |
| F-25 | 13 | «Én match om gangen, natt til lørdag. Ingen sveiping, ingen press.» | **KEEP** | Koncret, rolig, sann. |
| F-26 | 1 | «Svarene dine brukes kun til å bygge profilen din og finne en god match.» | **KEEP (LEGAL-OK)** | «kun» er forsvarlig her (se T-01 for samtykket). |
| F-27 | 1 | «Maks avstand til potensielle matches» | **KEEP** | «matches» er etablert i produktet. |
| F-28 | 12 | «Du har fullført hele profilen din! Nå er det klart for matching.» | **PRODUCT-TRUTH ISSUE (mild)** | «hele» + «klart for matching» (det er kø, ikke matching). **[P3-6]** |
| F-29 | 11 | «Hva gjør intimitet trygg? *» | **PRODUCT-TRUTH ISSUE** | `*` men ikke påkrevd. **[P2-13]** |
| F-30 | 5,6 | «Kjærlighetsspråk» | **KEEP** | Et etablert, lekbart begrep. |
| F-31 | 12 | «Du kan endre alt senere.» | **UNCLEAR (mild)** | «alt» er ikke sant fra dette skjermet (ingen redigeringslenke). |
| F-32 | 1–13 | «Steg X av 13» | **KEEP** | Orientert, konsistent. |

**Overordnet:** Ingen AI-LIKE- «resonans/tilknytning/emosjonell»-bruk *i selve
spørsmålene* (godt — de 5 skala-settene er skrevet i rolig, lekbart norsk).
Problemene konsentrerer seg om: (1) intro-tittelen på ERQ-6, (2) kliniske
steg-titler (tilpasning, tilknytningsmønster, moden nysgjerrighet), (3)
systematisk repetering, (4) produkt-truth (oppsummering, dealbreakers, `*`).

---

## G. REPETITION MATRIX (sortert etter flest forekomster)

Kolonner = steg 1–13 (✕ = forekomst, ~ = nærmest-identisk).

| Melding / tema | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | COUNT | Anbefaling |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| «ingen fasit / ingen rette eller gale svar / ingen riktig eller feil svar» | | ✕ | ✕ | ✕ | | ✕ | ~ | | ✕ | | ~ | | | **6** | Behold ÉN (ideelt i skala-intro per skalasteg); fjern fra trust-fotnoter og valideringsmelding **[P2-2]** |
| Trust-fotnot ≈ guiding øverst (sammensatt settning) | | | | ~ | ~ | ~ | ~ | ~ | ~ | ~ | ~ | | | **8** | Fjern trust-fotnot der guiding allerede dekker det; behold fotnot der den legger til (trygghet, «del bare…») **[P2-1]** |
| «del bare det du kjenner deg trygg med» | | | | | | ~ | | | | ✕ | ✕✕ | | | **4+** | Én gang (steg 11 guiding). Fjern fotnot-gjentagelser **[P2-3]** |
| «Svarene/…hjelper oss å finne noen som passer deg»-familie | ✕ | | ✕ | ~ | ~ | ~ | ~ | | | | | | | **7** | Standardisér til én formulering per steg — helst kun guiding, ingen fotnot |
| «Velg det som kjennes mest riktig / mest kjent / passer best» (mikro) | | ~ | | ~ | ~ | ~ | ~ | | | ~ | | | **7** | Mikro per felt er OK — men variasjonen er tilfeldig; sett én rolig standard |
| Grenser / avgrensninger (spørsmålstema) | | | | ✕ | | | | | | ✕✕ | ✕ | | | **4** | Tre tekstfelt (steg 4, 10, 11) spør i bunn og grunn «hva er grensen din?» — konsolidér til ett **[P2-4]** |
| Nærhet (spørsmålstema) | | | | | ✕✕ | | ✕ | | | | ✕✕✕ | | | **7** | Fordelt over 4 steg (5, 7, 10, 11) — nødvendig, men vinklene overlapper; steg 11 kan ta «nærhet» alene **[P2-6]** |
| Stress/press (tema) | | ✕ | | ✕ | | | | | | | ✕ (ERQ) | | | **3** | pressureReact (2) + stressNeed (4) + ERQ-6 (11) — ulike vinkler, men 11 er nærmest identisk med 4 **[P2-5]** |
| 21+ / alder | ✕ (validering) | | | | | | | | | | | | **1** | OK — kun ved validering. |
| «Matcherunden kjører lørdag / fredag 23:59» | | | | | | | | | | | | ✕ (RoundReminder alle steg) | ✕ | **14** (RoundReminder vises på alle 13 steg + venterom) | Behold — den er nyttig og sann; men unngå at den oppleves som press. |
| Religion / sensitive-data-forklaring | ✕ | | | | | | | | | | | | ✕ (samtykke) | **2** | OK — samtykke + steg 1. Ikke overforklart. |

**Konklusjon:** Repetisjon er **MEDIUM** — ikke støyende, men «trust-fotnot ≈
guiding»-mønsteret på 8 steg og «ingen fasit»×6 er det som tynger. Ingen av
gjentagelsene er skadelig for sanheten; de er kun støy.

---

## H. INFORMATION HIERARCHY (per steg)

Mål: brukeren møter ikke en vegg av tekst før hvert valg.

| Steg | PRIMARY (må forstås nå) | SECONDARY (nyttig) | LEGAL (må vises) | HELP (kan ligge bak) | UNNECESSARY (trengs ikke her) |
|---|---|---|---|---|---|
| 1 | 9 påkrevde felt + 3 sliders | mikro per felt | — (samtykke allerede gitt) | R-12-hint (vises kondisjonalt — bra) | Seksjon C-tittel dekker religion/barn feil **[P2-10]** |
| 2 | selfDesc + 15 skala | mikro per grid | — | — | — |
| 3 | 4 påkrevde + Valgvikt | LIVSSTIL-2026-opt | — | — | «Må stemme»-konsekvens (mangler, ikke overflødig) **[P1-4]** |
| 4 | 12 skala | 5 opt-grid | — | — | trust-fotnot (duper guiding) **[P2-1]** |
| 5 | 2 påkrevde | 3 opt | — | — | — |
| 6 | 1 tekst + 10 skala + Valgvikt | 19 opt-valg | — | — | «*» på 4 ikke-påkrevde felt **[P2-13]** |
| 7 | 2 påkrevde | 1 opt | — | — | — |
| 8 | buildTogether | 4 opt | — | — | «*» på futureVision **[P2-13]** |
| 9 | 6 skala | — | — | — | tittel/sub overlapper guiding **[P2-9]** |
| 10 | 2 påkrevde | 2 opt | — | — | tredje grensefelt **[P2-4]** |
| 11 | 6 skala | 5 opt | — | — | intro «kjønnsrelaterte roller» **[P1-3]** |
| 12 | «Dette er profilen — OK?» | alle seksjoner | — | — | påstand om «hele/komplett» **[P1-2]** |
| 13 | «Start reisen» = i kø | kø-fakta | — | — | loading «Sparar...» **[P1-5]** |

**Mønster:** Hvert steg bærer 3 tekstlag før første valg
(stegetittel → subtitle → guidingText), der subtitle og guiding oftest sier
det samme (steg 3, 4, 5, 6, 7, 8, 9). **Anbefaling:** hold stegetittel + ÉN
av subtitle/guiding (den mer konkrete), fjern den andre. Reduserer veggen av
tekst uten å ta bort trygghet.

---

## I. BUTTONS / NAVIGATION

| Handling | Tekst i dag | Hvor | Konsistent? |
|---|---|---|---|
| Avansér | «Fortsett til neste steg» | steg 1–11 | ✅ |
| Avansér (oppsummering) | «Fortsett» | steg 12 | ⚠️ kortere enn de andre **[P2-12]** |
| Start | «Start reisen» | steg 13 | ✅ (produktbegrep) |
| Start (loading) | «Sparar...» | steg 13 | ❌ nynorsk + feil handling **[P1-5]** |
| Blokkert CTA | «Fyll ut alle påkrevde felt» | de fleste steg | ✅ |
| Blokkert CTA (skala) | «Svar på alle påstandene» | steg 9 | ⚠️ annen variant **[P2-12]** |
| Tilbake | «Tilbake» | steg 2–12 (knapp) | ✅ |
| Godta (samtykke) | «Jeg godtar og fortsetter» | /samtykke | ✅ |
| Logg ut | «Logg ut» | SaveLogoutBar, alle steg | ✅ |
| Forlate kø (venterom) | «Forlate køen» + «Melde meg ut» | /matching | ❌ to knapper, samme funksjon, to modaler **[P2-21]** |
| Til profil (venterom) | «Gå til profil» + «Gå til onboarding» | /matching | ⚠️ samme funksjon, to navn **[P2-21]** |

**Canonical pattern (anbefalt, ikke implementert):**
- Avansér alltid **«Fortsett til neste steg»** (også steg 12).
- Blokkert tilstand: én variant — **«Fyll ut alle påkrevde felt»** (skala-steg kan beholde «Svar på alle påstandene» hvis George vil, men da skal den brukes på alle 5 skalasteg, ikke bare ett).
- Loading på «Start reisen»: **«Stiller deg i kø…»** (ikke «Sparar...»).
- Venterom: ÉN «Forlate køen» (nøytral) — fjern den røde duplikatknappen. ÉN «Gå til profil».

---

## J. PROGRESS / ORIENTATION

| Spørsmål | Svar | Evidens |
|---|---|---|
| A. Vet brukeren hvor de er? | **Ja** | «Steg X av 13» + 13 prikker, alltid synlig. |
| B. Hva handler denne delen om? | **Ja, mest** | Stegetittel + subtitle + guiding. Svakest på steg 9 (tilpasning) og 11 (moden nysgjerrighet). |
| C. Omtrent hvor mye som gjenstår? | **Delvis** | Prikker viser andel, men ingen tidsestimat. 13 steg er langt; RoundReminder gir ukeperspektiv men ikke «X min igjen». |
| D. Om svaret lagres? | **Ja** | «Lagret»/«Lagrer…» i SaveLogoutBar — MEN vises feilaktig «Lagret» rett etter side-last, før noe er endret **[P2-15]**. |
| E. Om de kan gå tilbake? | **Ja** | «Tilbake»-knapp steg 2–12. |

**Flagg:**
- «Lagret» ved side-last er en liten produkt-truth-mismatch: det ser ut som
  noe er lagret når brukeren ikke har gjort noe. Fiks: start i nøytral state
  («Lagres automatisk» eller ingenting) til første endring.
- Ingen estimat for total tid. «Det tar noen minutter» står i venterommet,
  ikke før. Kunne vært en linje i steg 1 («Ca. 10–15 minutter»).
- RoundReminder (fredag 23:59) er sann og rolig, men vises på **alle** steg —
  kan oppleves som tidspress i en ellers pressfri flyt. Vurdér å dempe/forenkle.

---

## K. REQUIRED vs OPTIONAL

| Type | Felt | UI gjør det tydelig? |
|---|---|---|
| REQUIRED | 9 i steg 1 (navn, alder, kjønn, søker, bosted, postnr, avstand, min-alder, maks-alder) | ✅ CTA deaktivert + «Fyll ut alle påkrevde felt» |
| REQUIRED | selfDesc (2), 4 i steg 3, 2 i steg 5, 2 i steg 7, buildTogether (8), 2 i steg 10 | ✅ samme mønster |
| REQUIRED | 49 skalaprofiler | ✅ CTA deaktivert + «Svar på alle påstandene» (steg 9) / «Fyll ut…» (de andre) |
| OPTIONAL | 54 felt | ⚠️ mest via at CTA ikke krever dem; ingen «(valgfritt)»-merke |
| CONDITIONAL | R-12-hint (religion) | ✅ vises kun når relevant |

**To konkrete uoverensstemmelser (P1/P2):**
1. **«*»-stjerner på felt som IKKE er påkrevde** — futureVision, highPriority,
   lowPriority, desiredLifestyle, undesiredLifestyle (steg 6) og intimacySafety
   (steg 11). Stjernen lover et krav som valideringen ikke holder. Enten fjern
   stjernen, eller gjør dem påkrevde. **[P2-13]**
2. **Aldersslider (agePrefMin/Max) er stille pre-fylt 21/40.** De ser ut som
   «drag hvis du vil», men verdien brukes alltid i matching — selv om brukeren
   aldri rører dem. Det er et *de-facto-påkrevd* felt som opptrer som valgfritt,
   uten at verdien overlever til oppsummeringen korrekt (se P1-1). **[P1-8]**

**Motsatt tilfelle (påkrevd i runtime, uklart i UI):** 49 skalaprofiler er
påkrevd av serveren (`psychometricsSchema`), og UI markerer det med deaktivert
CTA — men en bruker som hopper direkte via prefill/`goToStep` kan se
«Fyll ut alle påkrevde felt» uten at ett bestemt felt er markert rødt. Godt
nok i dag; verdt å vite.

---

## L. VALIDATION / ERROR COPY

| Trigger | Tekst i dag | Klarhet |
|---|---|---|
| Navn tomt/kort | «Fyll inn navnet ditt.» / «Navnet må være minst 2 tegn.» | ✅ rolig, konkret |
| Alder < 21 | «Du må være minst 21 år.» | ✅ |
| Alder > 99 | «Justér alderen litt – dette ser ikke helt riktig ut.» | ✅ rolig (god) |
| Kjønn/seeker mangler | «Velg ett kjønn.» / «Velg hvem du søker.» | ✅ |
| Postnr feil | «Postnummer må ha fire siffer.» / «Vi finner ikke dette postnummeret. Sjekk at det stemmer.» | ✅ |
| Avstand utenfor tetthetsområde | «Maks avstand må være mellom X og Y km.» | ✅ konkret |
| Skala umottatt | «Svar på alle påstandene — det finnes ingen fasit.» | ⚠️ blander instruks + beroligelse; OK men kan strammes til «Svar på alle påstandene.» **[P2-2]** |
| LIVSSTIL-2026 ugyldig verdi | «Velg et gyldig viktighetsnivå for dette feltet.» / «Velg ett av alternativene for dette feltet.» | ⚠️ generisk — sier ikke hvilket felt |
| Profile-setup 400 | «Noe mangler i profilen din.» + felter | ✅ |
| Profile-setup 500 | «Kunne ikke lagre profilen din. Vennligst prøv igjen.» | ✅ rolig |
| Queue 429 | «Du prøver for ofte. Vent et øyeblikk og prøv igjen.» | ✅ |
| Queue 402 | → redirect /betaling («Gratiskvoten er oppbrukt») | ✅ |
| Queue 409 | «Du er allerede i køen. Gå til venterommet for å se statusen din.» | ✅ |
| Nettverksfeil | «Kunne ikke lagre profilen din. Vennligst prøv igjen.» | ✅ |

**Overordnet:** Feilkopien er i stor grad **god** — rolig, konkret, handling
ikke skremmende. To forbedringer: (1) fjern «— det finnes ingen fasit» fra
valideringsmeldingen (den hører hjemme i introen), (2) LIVSSTIL-2026s
generiske «for dette feltet» kan navngi feltet. Ingen harde/straffende toner funnet.

---

## M. PROFILE / MATCHING QUESTIONS (Ikke Bli Kjent V2)

De faktiske matching-/profilspørsmålene i onboarding. (Scoring vurderes IKKE — kun forståelighet.)

| Kategori | Spørsmål | Svar-type | Req/Opt | Relasjon til matching | Forståelig for brukeren? |
|---|---|---|---|---|---|
| Identitet | navn, alder, kjønn, søker | grid/tekst/tall | Req | Grunnfilter | ✅ |
| Bosted | by, postnr, avstand, aldersspenn | tekst/tall/slider | Req | Radius + aldersfilter | ✅ (men alderspresp pre-fylt stille **[P1-8]**) |
| Personlighet | 15 påstander (TOSOM_PERSONALITY V2) | 5-punktskala | Req | Big Five-inspirert resonans | ✅ lekbart; «påstander» er litt stivt |
| Tilknytning | 12 påstander (ATTACHMENT) | 5-punktskalen | Req | Angst/unnvikelses-akser | ⚠️ tittelen «tilknytningsmønster» er fagord **[P2-7]**; spørsmålene er fine |
| Verdier | 10 påstander (PVQ-10) | 5-punktskala | Req | Schwartz-verdier | ✅ |
| Følelsesregulering | 6 påstander (ERQ-6) | 5-punktskala | Req | Reappraisal/suppression | ❌ introen «kjønnsrelaterte roller» er feil **[P1-3]**; itemene er forståelige |
| Kommunikasjon | 6 påstander (COMMUNICATION) | 5-punktskala | Req | Gottman-prinsipper | ✅ |
| Relasjonsintensjon | type relasjon, nærhetsbehov, balanse | grid/tekst | Req+opt | Parforholds-type | ✅ («Serîg» unntatt **[P1-7]**) |
| Livsstil 2026 | 10 hverdagsvalg + 7 Valgvikt | grid + 3-trinns vekt | Opt | Hverdags-kompatibilitet + dealbreaker | ✅ valg; ⚠️ «Må stemme»-konsekvens mangler **[P1-4]** |
| Grenser | aldri-krysse, forstå-partner, avgrensninger | grid/tekst | Req+opt | Trygghet/dealbreaker | ⚠️ spørreordet feil **[P1-6]** |
| Religion | religion + akseptliste | grid (maks 4) | Opt | Hard kompatibilitet (dealbreaker) | ✅ rolig; konsekvens (kan blokkere) ikke sagt **[P1-4]** |
| Barn | har barn / ønsker barn / bonusfamilie | grid | Opt | Dealbreaker | ✅ |

**Hovedpoenget:** Spørsmålene er i seg selv vel skrevet og lekbare. Det brukeren
*mangler* er ikke forståelse av det enkelte spørsmål, men **forståelse av hva
svaret fører til** (hvilke svar kan blokkere en match). Det er P1-4.

---

## N. SCALES (5-punktskala)

Én felles skala for alle 5 sett: **Passer ikke · Passer dårlig · Både og · Passer ganske godt · Passer helt**
(ingen tall, kun ord — bra, konsistent).

| Sjekkpunkt | Status |
|---|---|
| Labels | ✅ Naturlig norsk, ingen tall. |
| Endepunkter | ✅ «Passer ikke» / «Passer helt» — klare. |
| Midtpunkt | ✅ «Både og» — forståelig, nøytralt. |
| Reversed scales | ✅ Ingen reversed items i V2-settet; de øvrige settene har `reversed`-flagg internt, men **samelige 5 ord** vises — brukeren ser ingen uoverensstemmelse. |
| Konsistens | ✅ Identisk skala over alle 49 profiler. |
| Tilgjengelighet | ✅ `role=radiogroup`, piltaster, `aria-label` med «(N av 5)». |

**Én usikkerhet:** Ordene «Passer dårlig»/«Passer ganske godt» forutsetter at
påstanden «passer» på brukeren. For positive påstander («Jeg liker at det er
mange folk rundt meg») fungerer det. For negative («Jeg lar ikke andre se hva
jeg egentlig kjenner på») blir «Passer helt» = «ja, det kjennetegner meg» —
som fungerer, men er en tonevise mindre tydelig enn «Stemmer helt». **Anbefaling
(vurder, ikke endre):** vurdér «Stemmer ikke / Stemmer litt / Både og / Stemmer
mest / Stemmer helt» som enklere ramme. Kun et P3-utkast.

---

## O. DEALBREAKERS

- **Hvordan introduseres det?** Det introduseres **aldri** eksplisitt. Begrepet «dealbreaker»
  finnes ikke i synlig tekst (godt — engelsk unngått). Men **mekanismen**
  («Må stemme» → hard dealbreaker i motoren; religion/barn → hard kompatibilitet)
  forklares heller ikke.
- **Forstår brukeren at dette kan blokkere en match?** **Nei.** Det er P1-4.
- **Skilles preference fra hard boundary?** Delvis: «Bør stemme» (vekter) vs.
  «Må stemme» (hard) finnes som to nivåer, men **konsekvensskillet** er usagt.
  Religion/barn er hard boundary uten å merke seg.
- **Engelsk ord?** Nei — «dealbreaker» står ingen steder i synlig onboarding-tekst. ✅
- **Copy for dramatisk?** Nei — rolig. ✅
- **Finnes samme valg tidligere?** Delvis — «nærhet»/«grenser»-tema dukker opp
  flere steder (se P2-4/P2-6), men de er ulike vinkler, ikke samme hard boundary.
- **Må brukeren svare?** «Må stemme»-valget er valgfritt (kan la være å velge
  vekt). Religion/barn er valgfrie, men **svar som gis** er hardt bindende.
- **Kan brukeren endre senere?** Ja — via venterommet («Gå til profil»), endringer
  gjelder fra neste matcherunde. ✅ (sagt i steg 13)

**Anbefaling:** Én rolig setning før første Valgvikt (steg 3) og ved religion (steg 1):
«Noen svar kan bety at vi ikke kobler dere — for eksempel når dere er svært ulike
i noe dere begge sier må stemme. Du kan endre dette når som helst.» (LAWYER-review
ikke nødvendig for ordlyden, men George bør godkjenne.)

---

## P. IMPORTANCE (viktighet / vekt)

| Mekanisme | Hvor | Forklart for brukeren? |
|---|---|---|
| Valgvikt 3-trinn (ikke så viktig / bør stemme / må stemme) | steg 3, 6 (7 felt) | ⚠️ Nivåene er lekbare, men **konsekvensen** av «må stemme» (hard blokk) er usagt **[P1-4]** |
| Religion akseptliste (hard kompatibilitet) | steg 1 | ⚠️ Mekanismen (kan blokkere) er usagt **[P1-4]** |
| Barn / bonusfamilie (dealbreaker) | steg 1 | ⚠️ Usagt at dette kan blokkere **[P1-4]** |
| `*` = påkrevd | flere steg | ❌ 6 felt har `*` men er ikke påkrevd **[P2-13]** |

**Hovedfunn:** Brukeren må i dag forstå **intern matchinglogikk** for å svare
«riktig» på viktighetsvalgene — fordi forskjellen mellom «bør stemme» (vekter)
og «må stemme» (hard blokk) ikke forklares. Det er nøyaktig det §17 i oppdraget
advarer mot. Fiks = én forklaringssetning, ikke ny logikk.

---

## Q. RELIGION / LIVSSYN (juridisk sensitivt)

Kun faktisk brukeropplevelse, verifisert mot koden:

- **Introduksjon:** Kun på `/samtykke` (før onboarding): «Jeg samtykker til at Tosom
  bruker svarene mine om religion, hvem jeg søker, nærhet og trygghet — kun for å
  finne én match til meg.» (art. 9, aktiv avkrysning, aldri forhåndsavkrysset). ✅
- **Spørsmål:** «Religion / livssyn?» (grid, opptil 4, 12 verdier + Annet) — **valgfritt**.
- **Svar:** Kristen, Katolsk, Agnostiker, Ateist, Muslim, Jehovas vitne, Hindu,
  Jødedom, Buddhist, Spirituell, Annet. ✅ Naturlig, ikke-coercive.
- **Akseptliste:** «Hvem passer til deg her?» (opptil 4, inkl. «Åpen for alle» som
  velges alene og rydder lista). ✅
- **R-12-hint:** Rolig ℹ️-linje hvis egen religion mangler i akseptlisten —
  kun informasjon, aldri feil, aldri autoutvalg, skjult ved «Åpen for alle». ✅ (bra)
- **Open text:** Nei — ingen fritekst for religion. ✅ (mindre overflate)
- **Importance:** Ingen egen vekt på religion lenger (fjernet i Fase 1C — akseptlisten
  er hard constraint). ✅ Konsistent.
- **Consent step:** Samtykket (ovenfor) + «Dine svar»-boks på /samtykke. ✅
- **Withdrawal/help text:** «Du kan trekke samtykket tilbake når som helst ved å
  slette kontoen din under Innstillinger.» — ⚠️ trekning = **kun via kontosletting**.
  Reell avgrensning brukeren bør kjenne (se T).

**Kontroll:** Naturlig språk ✅ · forståelig valg ✅ · ingen skjult coercjon ✅ ·
ingen unødvendig repetisjon ✅ (kun samtykke + steg 1) · konsistens med privacy
truth ✅.

**LAWYER REVIEW REQUIRED (flagget, ikke endret):**
- «…kun for å finne én match til meg» — profilen (inkl. religion) **vises også til
  matchen**. «kun for å finne» understreker ikke visning til partner. Vurder ordlyd.
- Trekning av art.-9-samtykke = kun kontosletting. Vurder om dette er tilstrekkelig
  tydelig / reelt (mulighet for delvis trekning?).

---

## R. RELATIONSHIP INTENT

| Tema | Hvor | Overlapper? |
|---|---|---|
| Relasjonstype / seriøsitet / casual | steg 7 («Hva type relasjon søker du?») | Nei |
| Nærhet | steg 5, 7, 11 (3 vinkler) | ⚠️ **[P2-6]** |
| Barn / bonusfamilie | steg 1 | Nei |
| Familie/ansvar | steg 3 («Hva ansvar har du i livet ditt?») | Delvis, men ulikt |
| Samboer/ekteskap | — **Spørres ikke** | — |
| Avstand / livssituasjon | steg 1 / steg 3 | Nei |

- **Tydelig intensjon?** Ja — steg 7 er direkte.
- **Tar Tosom mer enn brukeren har sagt?** Én sak: «Dyp Vennskap» som type i en
  plattform ellers rammet som «partneren din»/«reisen deres» (venterom, match).
  En vennskapssøkende møter «partner»-språk etter onboarding. **[P2-20]** —
  produktspørsmål til George (er vennskap støttet gjennom hele reisen?), ikke
  kun et copy-fiks.
- **Overlapping:** Nærhet fra 3 vinkler over 4 steg — nødvendig bredde, men
  steg 11 (nearerType, needsTime) overlapper steg 5/7. Kan strammes uten data-tap.

---

## S. AGE / LOCATION / PRACTICAL

| Felt | Samles? | Vises? | Matching? | Copy antyder? |
|---|---|---|---|---|
| Alder (egen) | ✅ req | ✅ | ✅ | ✅ |
| Fødselsdato | ❌ | — | — | — (OK, lover ikke mer) |
| By / postnummer | ✅ req | ✅ | ✅ (radius) | ✅ |
| Radius / avstand | ✅ req (tetthetsbasert slider) | ✅ | ✅ | ✅ |
| Aldersspenn (søker) | ✅ req (**stille 21/40**) | ⚠️ feil i oppsummering **[P1-1]** | ✅ | ⚠️ pre-fyllt uten forklaring **[P1-8]** |
| Høyde / kroppstype | ✅ opt | ✅ | ⚠️ (høyde-regel D-1) | ✅ |
| Røyking / livsstil | ✅ opt | ✅ | ✅ | ✅ |
| Navn (visningsnavn) | ✅ req | ✅ | — | ✅ |
| Arbeid (workType) | ✅ (steg 3) | ✅ | ✅ (hverdag) | ✅ |

**Sjekk:** Onboarding-copien antyder ikke felt som ikke samles, og samler ingenting
som krever samtykke utover religion (art. 9, dekket). ✅ Reale gaps: aldersprespens
stille 21/40 (P1-8) + oppsummering viser feil verdi (P1-1).

---

## T. VISIBILITY / PRIVACY (kryssjekk mot runtime truth)

| Onboarding-claim | Runtime truth | Status |
|---|---|---|
| «Profilen din er aldri offentlig.» (samtykke) | Vises kun til match (+ admin/safety ved rapport) | ✅ sann |
| «Svarene dine brukes kun til å bygge profilen din og finne en god match.» (steg 1) | Matching + vises til match + safety | ⚠️ «kun» understremer ikke visning til match/safety |
| «Brukes kun til å finne én match til deg.» (samtykke) | Samme | ⚠️ **LAWYER REVIEW REQUIRED** |
| «Du kan trekke samtykket tilbake … ved å slette kontoen.» | Rett: trekning = kontosletting | ⚠️ reell avgrensning — bør være helt bevisst |
| «Du kan endre svarene dine i venterommet» (steg 13) | Riktig («Gå til profil») | ✅ |

**Konklusjon:** Ingen claim er **usanne** (ingen «kun matchingmotoren ser dette»-
feil), men to «kun»-formuleringer understremer dataflyten til match og safety.
Begge flagges **LAWYER REVIEW REQUIRED** — endres ikke i denne ACT-en.

---

## U. PHOTO FLOW

- **Upload i onboarding:** Ingen — onboarding samler **ingen** bilde
  (`photos: []` i setup-payloaden).
- **Storage / matching / visibility / dag-15-avsløring:** Hører til profilsiden /
  match-flow (PL-03: partners bilde skjult før dag 15), **ikke** onboarding.
- **Onboarding-copien** lover intet om bilder → ingen mismatch fra onboarding. ✅

**Observasjon (utenfor scope):** Siden onboarding ikke tar opp bilder, er det verdt
å vite *hvor* bildet samles og at dag-15-regelen forklares **der** — ellers kan en
ny bruker tro at onboarding «glemte» bildet. Ingen handling i denne ACT-en.

---

## V. MICROCOPY / MOBILE

**Mikrocopy:**
- Placeholders er konkrete og varme («Noe lite og spesielt med deg som du finner
  morsomt?», «At noen husker at jeg vil ha kaffe på morgenen»). ✅
- «Velg opptil X» vises som multiHint under gridene («Du kan velge mellom opp til
  N alternativer»). ✅
- Deselect: klikke på valgt knapp avmarker (toggle) — ingen separat «fjern»-tekst. OK.
- Char-count: `showCharCount` finnes men brukes **ikke** av noen felt i dag. (Ingen
  «X/200»-teller synlig.) — greit, men maxLength +10 på input gir litt slakk.
- «Minst 10 tegn» vises som dempet hint under tekstfelt når under min. ✅ rolig.
- **Mikrocopy som er viktigere enn overskriften:** Valgviktens «For deg i en match:»
  er faktisk det viktigste i hverdagen-valgene — men det er dempet (12px, subtil).
  Ettersom «Må stemme» er en hard dealbreaker, fortjener den mer tyngde enn 12px. **[P1-4]**

**Mobil (liten skjerm):**
- Steg 6 (Livsstil & verdier) er 21 input + 10 skala-kort — **lang rull**, CTA langt
  under fold. Flere av gridene er 2 kolonner på mobil (grid-cols-1 md:grid-cols-2) —
  OK, men skala-kortets 5 knapper side-ved-side (text-xs) er trangt på 360px. **[P2-17]**
- Lange headings: «Personlighet & identitet», «Kjærlighetsspråk & nærhet» — 2
  ord, OK. Ingen 3-ords-vegger.
- Tre avsnitt før et valg: steg 1 har 3 seksjoner; hvert steg har tittel+sub+guiding
  før første input (se H). På mobil blir «veggen» høyere. **[H-anbefaling]**
- Knapper: «Fortsett til neste steg» (18px, 56px høg) — bra målflate. «Tilbake» 48px. ✅
- Hjelpetekst som skyver svar under fold: guiding + mikro kan samle seg over et
  grid — på steg 3/6 er dette reelt. Vurdér å dempe guiding (se H).

---

## W. EXIT / RESUME

| Spørsmål | Svar (code truth) |
|---|---|
| Lukker brukeren browseren? | sessionStorage-utkast dør med fanen, **men** server-draft (`/api/onboarding/draft`) beholdes. |
| Lagres steg? | Ja — både i sessionStorage (per fane) og server-draft `{step,data}`. |
| Kan onboarding fortsette senere? | **Ja.** Ny økt henter server-draft → restaurerer steg + data. |
| Hvor lander brukeren ved retur? | På det lagrede steget (via prefill/draft-restaurering). |
| Finnes copy som forklarer dette? | ⚠️ **Nei.** Ingen «Du kan lukke og fortsette senere»-tekst. Kun «Lagret»-indikatoren. **[P2-16]** |
| Back-knapp? | Ja (steg 2–12), beholdr state i klienten. |
| Browser-back? | Forlater `/onboarding`; data ligger på serveren, men det **sies** det ingenting om. |
| Partial save? | Autosave 400 ms debounce + server-draft ved navigasjon. ✅ |
| Utlogging? | Tømmer både sessionStorage og (gammelt) localStorage + server-draft håndteres i logout-ryddingen. ✅ |

**Anbefaling:** Én rolig linje i steg 1 (eller i SaveLogoutBar): «Fremdriften din
lagres automatisk — du kan komme tilbake når som helst.» Reduserer forlatt onboarding.

---

## X. FINAL STEP / QUEUE

- **Forstår brukeren at profilen er ferdig?** Delvis — steg 12 sier «fullført hele
  profilen», men oppsummeringen viser ikke hele (P1-2). Steg 13 bekrefter «Du er klar».
- **Hva skjer nå?** «Nå stiller du deg i kø — vi leter rolig og presist.» ✅
- **Går de i kø?** Ja — «Start reisen» → `POST /api/journey/queue` → QUEUED. ✅
- **Venter de til lørdag?** Ja — «Natt til lørdag forsøker vi å finne noen…». ✅
- **Er match garantert?** Nei — og det sies: «forsøker vi», «hellere la deg vente
  enn å koble tilfeldig». ✅ (ærlig)
- **Kan de redigere profilen?** Ja — «Du kan endre svarene dine i venterommet». ✅
- **Beta/invite-status relevant?** Nei — ingen beta-gate i onboarding i dag (åpen
  beta, e-post+passord). Ingen invite-copy. ✅ (konsistent med BETA-DRIFTSPLAN)
- **Kø-overgang (runtime truth):** ONBOARDING COMPLETE → `journey/queue` →
  `journeyState=QUEUED` → `/matching` «in_queue». **Ingen gjett** — verifisert i
  `queue/route.ts` + `matching/page.tsx`. Copy samsvarer med state. ✅

**Én copy-mismatch i overgangen:** Steg 13-foten «Nå er det klart for matching»
(steg 12) vs. virkeligheten «du er i **kø**, matching prøves lørdag». Mild — men
«klart for matching» kan leses som umiddelbart. **[P3-6]**

---

## Y. RUNTIME TRUTH MISMATCHES

| # | Mismatch | Sted | Severitet |
|---|---|---|---|
| Y-01 | Oppsummering «Aldersintervall» leser `minAge`/`maxAge` (døde felt) med default 21/40 — viser **altid 21–40** uansett hva brukeren satt i `agePrefMin`/`agePrefMax`. | `Step9Oppsummering.tsx` | **P1** **[P1-1]** |
| Y-02 | «Dette er hele profilen din — rolig, trygg og komplett» — men 49 skalasvar, religion/akseptliste og LIVSSTIL-2026 mangler. | `Step9Oppsummering.tsx` | **P1** **[P1-2]** |
| Y-03 | ERQ-6-intro «Romslighet i kjønnsrelaterte roller» ≠ itemene (følelseshåndtering). | `Step8ModenNysgjerrighet.tsx` | **P1** **[P1-3]** |
| Y-04 | Valgvikt «Må stemme» = hard dealbreaker, konsekvensen er ikke sagt til brukeren. | `Valgvikt.tsx` + matching | **P1** **[P1-4]** |
| Y-05 | «Sparar...» (nynorsk) + feil semantikk (lagre vs. stille i kø) på siste knapp. | `PremiumCTAButton.tsx` | **P1** **[P1-5]** |
| Y-06 | Aldersprespenn stille pre-fylt 21/40 og brukt i matching uten at brukeren vet det. | `Step1Profile.tsx` | **P1** **[P1-8]** |
| Y-07 | 6 felt har `*` i label men er valgfrie i valideringen. | steg 6 + 11 | **P2** **[P2-13]** |
| Y-08 | «Lagret» vises ved side-last før noe er lagret. | `OnboardingLayout.tsx` | **P2** **[P2-15]** |
| Y-09 | «Humor & personlighet»-seksjonen i oppsummeringen er alltid tom (5 døde felt). | `Step9Oppsummering.tsx` | **P2** **[P2-14]** |
| Y-10 | `getNextFriday2359()` duplisert i to filer — frist-teksten kan drifte uenig. | `OnboardingLayout.tsx` + `matching/page.tsx` | **P2** (kode-hygiene) |

**Ingen P0.** Ingen mismatch som fører til feil matching, datalekkasje eller urett
samtykke. De to oppsummerings-P1-ene (Y-01/Y-02) er de mest brukervridende fordi
de rammer det siste «stopp opp og sjekk»-øyeblikket.

---

## Z. REDUNDANCY / REMOVAL CANDIDATES (fjernes IKKE i denne ACT-en)

| ID | Sted | Hva | Hvorfor overflødig | Risiko | Anbefaling |
|---|---|---|---|---|---|
| R-01 | steg 3–11 (8 steg) | trust-fotnot ≈ guiding øverst | Duper samme setning 2× per skjerm | Lav | Fjern fotnot der guiding dekker |
| R-02 | steg 4 | «Tilknytningsmønsteret…» (i guiding og fotnot) | Fagord + duplikat | Lav | Fjern fotnot; skriv guiding om (L-07) |
| R-03 | steg 11 | «del bare…» i guiding OG fotnot | 2× på samme skjerm | Lav | Behold i guiding, fjern i fotnot |
| R-04 | steg 4, 10, 11 | Tre grense-tekstfelt | «Hva er grensen din?» 3× | Middel (data) | **Ikke slette felt** — vurdér å konsolidere spørsmålet |
| R-05 | steg 12 | «Humor & personlighet» (5 døde felt) | Viser alltid tom seksjon | Lav | Fjern seksjonen (behold mapping for gamle profiler) |
| R-06 | steg 6 + 11 | `*` på 4+2 ikke-påkrevde felt | Lover et krav som ikke gjelder | Lav | Fjern stjernen (L-13) |
| R-07 | venterom (utenfor) | «Forlate køen» + «Melde meg ut» (samme funksjon) | Duplisert | Lav | Konsolidér (følge-akt) |
| R-08 | kode (ikke synlig) | `data/questions.ts` (død), `preferanser`-payload (9 felt), humor-payload (5), legacy `ProfileData` | Aldri brukt; forvirrer | Lav | Ryddings-akt (ikke denne) |

---

## AA. LANGUAGE REWRITE CANDIDATES (forslag — implementeres IKKE)

| ID | Sted | Nåværende | Problem | Forslag |
|---|---|---|---|---|
| L-01 | steg 11 (ERQ-intro) | «Romslighet i kjønnsrelaterte roller. Svar det som kjennes mest riktig.» | Stemmer ikke med itemene | «Noen tanker om hvordan du håndterer sterke følelser. Svar det som kjennes mest riktig.» |
| L-02 | steg 13 (loading) | «Sparar...» | Nynorsk + feil handling | «Stiller deg i kø…» (bruk label-propen under loading) |
| L-03 | steg 7 (option) | «Serîg langsiktig og engasjert forhold» | Korrupt ord | «Ser du langsiktig og engasjert i forholdet?» |
| L-04 | steg 10 (label) | «Hva grense vil du aldri krysse?» | Grammatikk + motsatt alternativene | «Hva trenger du at partneren din alltid respekterer?» |
| L-05 | steg 3 (første Valgvikt) | (ingen forklaring) | «Må stemme»-konsekvens mangler | ««Må stemme» betyr at vi ikke kobler dere dersom svarene er svært ulike. Du kan endre dette når som helst.» |
| L-06 | steg 1 (alder-slider) | (ingen forklaring på default) | Stille 21/40 | «Vi leter etter noen mellom 21 og 40 år — juster om du vil.» (dynamisk) |
| L-07 | steg 4 (guiding) | «Tilknytningsmønsteret ditt sier mye om hvordan du møter andre mennesker.» | Fagord + duplisert | «Slik du kjenner deg trygg, hjelper oss å finne noen som passer deg.» + fjern fotnot |
| L-08 | steg 11 (tittel/fotnot) | «Moden nysgjerrighet» / «Modne svar viser hvem du er…» | Uklart | Tittel «Nærhet og trygghet» · fotnot «Del bare det du kjenner deg trygg med.» |
| L-09 | steg 9 (tittel) | «Kommunikasjon & tilpasning» | «tilpasning» klinisk | «Kommunikasjon» |
| L-10 | steg 1 (seksjon C) | «LIVSSTIL OG DAGLIG RYTME» (dekker religion+barn) | Misvisende | «LIVSSTIL, TRO OG FAMILIE» |
| L-11 | steg 12 (guiding) | «Dette er hele profilen din — rolig, trygg og komplett.» | Falsk | «Dette er mesteparten av profilen din — skala-svarene er lagret. Du kan endre alt i venterommet.» (Alternativt: legg skalene inn i oppsummeringen — UX-fix, se AD) |
| L-12 | steg 12 (alder) | leser døde felt | Viser alltid 21–40 | **Runtime-fix:** les `agePrefMin`/`agePrefMax` (se AD) |
| L-13 | steg 6 + 11 | `*` på ikke-påkrevde felt | Lover feil | Fjern `*` (futureVision, highPriority, lowPriority, desiredLifestyle, undesiredLifestyle, intimacySafety) |
| L-14 | steg 9 (trust) | «Det er ingen rette eller gale svar…» (dup. av steg 2) | Repetisjon | Fjern i steg 9 (skala-introen sier allerede «ingen fasit») |

---

## AB. SEVERITY

**P0 (materially wrong / unsafe): 0**

**P1 (runtime truth mismatch / blocks comprehension): 8**
| ID | Funn | Type |
|---|---|---|
| P1-1 | Oppsummering «Aldersintervall» viser alltid 21–40 (feil felt) | RUNTIME FIX |
| P1-2 | «Hele profilen»-påstand, men 49 skala + religion + LIVSSTIL-2026 mangler i oppsummering | COPY FIX + (valgt) UX FIX |
| P1-3 | ERQ-6-intro «kjønnsrelaterte roller» ≠ itemene | COPY FIX |
| P1-4 | «Må stemme»/religion/barn kan blokkere match — konsekvens usagt | COPY FIX (krever Georges godkjenn av ordlyd) |
| P1-5 | «Sparar...» nynorsk + feil semantikk på siste knapp | COPY FIX |
| P1-6 | «Hva grense vil du aldri krysse?» grammatikk + uklar mening | COPY FIX |
| P1-7 | «Serîg langsiktig og engasjert forhold» korrupt | COPY FIX |
| P1-8 | Aldersprespenn stille 21/40 i matching uten kopiforklaring | COPY FIX (krever Georges godkjenn av ordlyd) |

**P2 (confusing / repetitive / unnecessary): 21**
P2-1 trust≈guiding (8 steg) · P2-2 «ingen fasit/rette svar»×6 · P2-3 «del bare…»×4 ·
P2-4 tre grensefelt · P2-5 stress×3 · P2-6 nærhet×4 steg · P2-7 tilknytningsmønster ·
P2-8 moden nysgjerrighet/modne svar · P2-9 tilpasning · P2-10 seksjon C-gruppering ·
P2-11 kapitalisering+vennskapsband · P2-12 CTA-variantene · P2-13 `*`-felt ·
P2-14 tom humor-seksjon · P2-15 «Lagret» ved load · P2-16 ingen resume-copy ·
P2-17 steg 6 mobiltyngde · P2-18 døde data (questions.ts, preferanser, humor, legacy) ·
P2-19 samtykke «kun»-claim (LAWYER) · P2-20 vennskap vs «partner» · P2-21 venterom 2× utknapp

**P3 (polish): 8**
P3-1 «Hverdagssvarene» (staving) · P3-2 «alderspref» · P3-3 «Ubestemthet og venting» ·
P3-4 «regulere og gjenopprette balanse» · P3-5 «Nå er det klart for matching» ·
P3-6 nedtelling «d/t/m» vs «d t m» konsistens · P3-7 «Framtid & visjon» vs «Fremtid og visjon» ·
P3-8 «Du kan endre alt senere» (ingen redigeringslenke i steg)

---

## AC. TEST INVENTORY / COVERAGE

**E2E (Playwright) — `e2e/tests/onboarding.spec.ts` (10 tester):**
- steg-indikator + tittel · grunnprofil-fill · selfDesc-blokkering (CTA deaktivert) ·
  avansering steg 2→3 · tilbake-navigasjon · indikator-oppdatering ·
  autosave→sessionStorage · draft-restaurering etter reload · **full 13-stegs flyt → /matching**.

**Unit/integration (Jest) — `__tests__/`:**
- `onboarding-steps-validation` (steg 0/1, skalasteg PL-08a, firstIncomplete, LIVSSTIL-2026 gate)
- `onboarding-setup-grenser-select` · `onboarding-setup-livsstil2026` (server-skjema)
- `onboarding-religion-barn-pl27` (religion maks 4, bonusfamilie)
- `toOnboardingData` (round-trip, defensive, livssituasjon, livsstil2026, OPEN TO ALL)
- `dimensions-livsstil2026` · `livsstil2026-dealbreaker` (matching-vekt/dealbreaker)
- `welcome-email-onboarding` (velkomst-e-post ved fullføring)
- `e2e/onboarding-reset.ts` + `e2e/auth-onboarding-setup.ts` (isolasjon + login)

**Coverer (fra oppdragets minimumsliste):**
✅ unit · ✅ integration · ✅ Playwright · ✅ step order (full-flyt-test) ·
✅ validation (selfDesc + skalagate) · ✅ save/resume (sessionStorage + reload) ·
✅ completion (13 steg → matching) · ⚠️ consent — **ingen direkte onboarding-consent-test**
(consent testen som `/api/consent`/`/samtykke` i egne tester, ikke knyttet til onboarding-flow) ·
⚠️ invite gate — **IKKE aktuelt** (åpen beta i dag, ingen invite-gate).

**Coverage holes:**
1. **Ingen test** som påtar at oppsummeringen viser **riktig** aldersintervall
   (P1-1) — ville fanget feil-felt-lesingen.
2. **Ingen test** at «Må stemme»-konsekvens-kopien finnes (P1-4) — copy-assertion.
3. **Ingen e2e** som tar i **402/betalings-kveien** fra onboarding (free-quota brukt).
4. **Ingen test** at religion/akseptliste vises i oppsummeringen (P1-2).
5. Consent-gate (needsConsent → /samtykke → tilbake) testes ikke som onboarding-delen.

(Disse er **coverage holes å vite om** — ikke tester å skrive i denne PLAN-en.)

---

## AD. PROPOSED ACT SCOPE — «ONBOARDING LANGUAGE & CLARITY ACT»

Én minimal ACT. Primært P0 (0) + P1 + high-value P2. **Ikke** P3, med unntak av
triviel grammatikk som allerede er i de P1-copyfikene. Ingen matching/vekt/
schema/validering/consent-endringer.

**COPY FIX (brukervendt tekst, ingen logikk):**
- P1-3 / L-01: ERQ-6-intro → «Noen tanker om hvordan du håndterer sterke følelser…»
- P1-5 / L-02: «Sparar...» → «Stiller deg i kø…» (PremiumCTAButton loading)
- P1-7 / L-03: «Serîg…» → «Ser du langsiktig og engasjert i forholdet?»
- P1-6 / L-04: «Hva grense vil du aldri krysse?» → «Hva trenger du at partneren din alltid respekterer?»
- P1-4 / L-05: tilføy én «Må stemme»-forståelseslinje (steg 3) + religion-linje (steg 1). **Krever Georges godkjenn av ordlyd.**
- P1-8 / L-06: alder-slider-forklaring (stille 21/40). **Krever Georges godkjenn av ordlyd.**
- P1-2 / L-11: oppsummerings-guiding → ikke «hele/komplett».
- L-07 (P2-7), L-08 (P2-8), L-09 (P2-9), L-10 (P2-10), L-14 (P2-2): tone/klarhet.
- L-13 (P2-13): fjern `*` fra 6 ikke-påkrevde felt.

**RUNTIME FIX (logikk, ikke copy):**
- P1-1 / L-12: `Step9Oppsummering.tsx` — les `agePrefMin`/`agePrefMax` i stedet for `minAge`/`maxAge`.
  (Én-linjers fix, men endrer hva som vises → krever test.)

**UX FIX (valgt, high-value):**
- P1-2: legg religion/akseptliste + (valgt) skalasvar inn i oppsummeringen, slik at
  «Dette er profilen din» holder. **Minste versjon:** legg inn religion-seksjonen
  (art. 9-data fortjener konfirmasjon) og justér guiding-teksten (L-11). Skalene kan
  være et eget follow-up.

**LEGAL-REVIEW FIX (flagges, endres IKKE i ACT-en):**
- P2-19 / T: samtykkets «kun for å finne én match» + trekning=kontosletting → **LAWYER REVIEW REQUIRED**.

**UTENFOR denne ACT-en (følge-akter):** venterom-utknapp-duplikat (P2-21/R-07),
døde-data-rydding (P2-18/R-08), «Lagret»-ved-load (P2-15), resume-copy (P2-16),
steg 6 mobiltyngde (P2-17), vennskap-vs-partner-produktspørsmål (P2-20).

**Rekkefølge (én fil per patch, verifiser etter hver):**
1. `PremiumCTAButton.tsx` (P1-5) → 2. `Step8ModenNysgjerrighet.tsx` (P1-3, L-08) →
3. `Step5Relasjonsstil.tsx` (P1-7, L-03) → 4. `Step8Grenser.tsx` (P1-6, L-04) →
5. `Step2Livssituasjon.tsx` (P1-4/L-05) + `Step1Profile.tsx` (P1-8/L-06, L-10, religion-linje) →
6. `Step9Oppsummering.tsx` (P1-1 runtime, P1-2 copy+religion, L-11, fjern humor-seksjon) →
7. de små tone-fiksene (L-07/09/13/14) i respektive steg-filer.
Hver patch: `tsc` + påvirkede tester + `verify:lang` grønn før neste.

---

## AE. FINAL RECOMMENDATION

Onboarding er **strukturelt sound** (13 steg, sanne kø-tekster, god progress,
autosave, ærlig «ingen match»-håndtering) og **spørsmålene er vel skrevet**.
Problemet er ikke spørsmålene, men **de fire lagene rundt dem**:
(1) **oppsummeringen** som lover «hele profilen» men viser en feil alder og
sløyfer religion + 49 skalasvar, (2) **dealbreaker-mekanismen** som er usynlig
for brukeren, (3) **én feil skala-intro** (ERQ-6) i et sensitivt område, og
(4) **systematisk repetering** (guiding≈fotnot ×8, «ingen fasit» ×6).

De 8 P1-ene er alle **små, isolerte, lav-risiko** fiksjoner — 6 er copy,
1 er en-linjers runtime, 1 er copy+valgt UX. Ingen berører matching, vekt,
schema, validering eller consent. Anbefaling: godkjenn AD-scoopen, la
Qwen/Cline kjøre ACT-en patch for patch med verifisering, og send de to
LAWYER-flaggene (samtykke-ordlyd + trekning) til advokaten parallelt.

---

## FINAL REPORT (§40 — 32 punkter)

1. **Canonical onboarding entry:** `/login` (auto-registrering) → `window.location.href='/onboarding'`; konsistert også via `/dashboard`-guard, `/matching` (not_started), `/reisen/avslutning`. Legacy: `/register`→`/login`, `/onboarding/start`→`/login`.
2. **Canonical completion endpoint/state:** `POST /api/profile/setup` (→ `onboardingComplete=true`) + `POST /api/journey/queue` (→ `journeyState='QUEUED'`, `matchQueuedAt`) → `router.push('/matching')`.
3. **Route count:** **1** (`/onboarding`). (+1 legacy-redirect `/onboarding/start`; post: `/matching`.)
4. **Logical step count:** **13** («Steg X av 13», `totalSteps=13`).
5. **Field/question count:** **124** synlige input = 75 valg/tekst/slider-felt + 49 skalaprofiler.
6. **Required count:** **70** (49 skala + 21 ellers).
7. **Optional count:** **54**.
8. **Consent moments:** **1** (`/samtykke`: 2 avkrysninger — vilkår + art. 9).
9. **Biggest language problem:** Kliniske/fagord i steg-rammer (ERQ-intro «kjønnsrelaterte roller», «tilknytningsmønster», «tilpasning», «moden nysgjerrighet») + nynorsk «Sparar...» på siste knapp.
10. **Biggest repetition problem:** trust-fotnot ≈ guiding øverst på **8 steg** + «ingen fasit/rette svar»-familien **6×**.
11. **Biggest unnecessary-content problem:** Døde data (questions.ts, preferanser-, humor-payload) + «Humor & personlighet» som alltid tom seksjon + dupliserte trust-fotnoter.
12. **Biggest comprehension problem:** Brukeren **forstår ikke at «Må stemme»/religion/barn kan blokkere en match** (P1-4).
13. **Biggest runtime-truth mismatch:** Oppsummeringen — «Aldersintervall» viser alltid 21–40 (feil felt, P1-1) + «hele profilen»-påstand med 49+ felt fraværende (P1-2).
14. **Dealbreaker clarity:** **Ikke forklart.** Mekanismen finnes («Må stemme»=hard, religion/barn=hard), men konsekvensen er usynlig for brukeren.
15. **Importance clarity:** Nivåene (ikke så viktig/bør/må stemme) er lekbare, men **skill mellom «bør» og «må» (vekter vs. hard blokk) er usagt** — brukeren må gjette intern logikk.
16. **Religion/livssyn clarity:** **God** — rolig, ikke-coercive, eksplisitt art.-9-samtykke, R-12-hint er bra. Flag: «kun»-ordlyd + trekning=kontosletting (LAWYER).
17. **Privacy/visibility clarity:** Ingen usanne claim, men to «kun»-formuleringer understremer visning-til-match/safety → **LAWYER REVIEW REQUIRED**.
18. **Photo clarity:** **Ingen foto i onboarding**, ingen foto-claim → ingen mismatch. (Foto hører til profilsiden, PL-03 dag-15.)
19. **Progress/orientation:** **God** — «Steg X av 13» + prikker + seksjonsfarge + RoundReminder + «Lagret». Gap: ingen tidsestimat; «Lagret» ved side-load (P2-15).
20. **Exit/resume:** **Fungerer** (sessionStorage + server-draft, steg restaureres, e2e-testet). Gap: **ingen copy** som forteller at fremdrift lagres / at man kan lukke og come back (P2-16).
21. **Final-step clarity:** **God** (kø, lørdag, ingen press, kan ut) — men loading «Sparar...» forstyrrer handlingøyeblikket (P1-5).
22. **Queue-transition truth:** **ALIGNED** — complete→QUEUED→in_queue; fredag-23:59-fristen konsistent onboarding↔venterom; cron-vinduet (02–04 UTC) ligger inne i låse-vinduet.
23. **P0 count:** **0**
24. **P1 count:** **8**
25. **P2 count:** **21** (+8 P3)
26. **Top 10 rewrite candidates:** L-01 (ERQ-intro), L-02 («Sparar»), L-03 («Serîg»), L-04 (grense-spørsmål), L-05 («Må stemme»), L-06 (alder-default), L-07 (tilknytning), L-08 (moden nysgjerrighet), L-11 (oppsummering «hele»), L-12 (alder-runtime).
27. **Top removal candidates:** R-01 (trust≈guiding ×8), R-05 (tom humor-seksjon), R-06 (`*`-felt), R-08 (døde data), R-07 (venterom ut-knapp, følge-akt).
28. **Test coverage:** 10 e2e + 8 unit-suites; dekker step order, validation, save/resume, completion. **Holes:** oppsummeringens alder, «Må stemme»-copy, 402-vei, religion i oppsummering, consent-gate.
29. **Proposed ACT scope:** «ONBOARDING LANGUAGE & CLARITY ACT» — 8 P1 (6 copy, 1 runtime, 1 copy+UX) + high-value P2 (tone, `*`, repetering). Ingen matching/vekt/schema/validering/consent. 2 ordlyder krever Georges godkjenn; 2 LAWYER-flagg sendes parallelt.
30. **Changed files:** Kun `docs/ONBOARDING-LANGUAGE-UX-PLAN-v1.0.md` (ny, opprettet). **Ingen** kode, copy, spørsmål, matching, consent, schema, validering eller test endret.
31. **Git status:** `main` = `origin/main` = `0a3aca8`. Working tree: kun untracked `docs/IDENTITY-TRUST-PLAN-v1.0.md` (kjent, urørt), `tmp/` og denne rapporten. **Ingen tracked diffs, ingen commits.**
32. **Recommended next step:** George gjennomsyrer §AB (P1-lista) + §AD (ACT-scope) + de to LAWYER-flaggene. Når han sier «kjør», kjører Qwen/Cline ACT-en patch for patch med verifisering (tsc + tester + verify:lang) etter hver.

---

**ONBOARDING LANGUAGE & UX PLAN: COMPLETE**
**ONBOARDING FLOW: MAPPED**
**LANGUAGE: NEEDS WORK** (8 P1, ellers god tone)
**REPETITION: MEDIUM**
**RUNTIME TRUTH: MISALIGNED** (oppsummering; ellers aligned)
**LEGAL-SENSITIVE COPY: IDENTIFIED** (samtykke-ordlyd + trekning → LAWYER REVIEW REQUIRED)
**BLI KJENT V2: FROZEN**
**OPPGAVER V2: FROZEN**
**IMPLEMENTATION: NOT STARTED**
**COMMIT: NO**
**PUSH: NO**
**DEPLOY: NO**

---

## AF. ACT-RESULTAT (ONBOARDING LANGUAGE & CLARITY ACT O1, 29.10.2026)

Planen ble utført som kontrollert ACT. Full resultatseksjon:
`docs/ONBOARDING-LANGUAGE-CLARITY-ACT-v1.0.md` (A–R).

Kortoppsummering:

- **P1-feil: 7/7 rettet** (sum-alder + false «komplett», ERQ-intro, «Må
  stemme»-forklaring, «Sparar...», grense-spørsmålstekst, «Serîg»).
- **Aldersspenn 21–99+** i steg 1 med synlig, endrbar pre-fill; 99+ renderes
  som «99+» i sum (internt tallet 99 — det faktiske taket; matching urørt).
- **Hard boundaries** forklart der valget skjer (alder, avstand, kjønnsvalg,
  religion, barn, «Må stemme» via Valgvikt) — kun der det faktisk blokkerer.
- **Oppsummering redesignet**: seksjoner A–F + detaljseksjoner med «Endre»
  (goToStep), ærlig profilstatus, ingen «hele profilen/komplett».
- **Repetisjoner**: «ingen fasit/rette svar» 7→1; trust-footers ≈ guiding
  8→1. Stjerne (`*`) fjernet overalt; påkrevd signaleres av CTA + feilboks.
- **Flow uendret**: 13 steg, 1 rute, 123 inputs (74+49), 71 required/52
  optional, payload, matching, consent, schema — alle låst med hashes
  (OCL-15/18/19) og unit-asserts (OCL-16/17).
- **Testing**: `__tests__/onboarding-language-clarity.test.ts` (OCL-01–20)
  + 2 nye e2e-alderstester + eksisterende onboarding-e2e.
- **LAWYER REVIEW REQUIRED**: 3 nye forklarings-/privacy-tekster (religion,
  barn, «vises ikke offentlig»). Samtykke-ordlyden selv er uendret.
- **Commit: NO · Push: NO · Deploy: NO · Brukere invitert: NO.**


