# ToSom - Full Duplikat- og Analyse-rapport
## Dato: 2026-06-24
## Type: KUN ANALYSE (ingen endringer gjort)

---

## 1. DUPLIKAT-MAPPER

### 1.1 MatchCard.tsx\n< directory (anomal)
**Sted:** `/home/george/tosom/components/MatchCard.tsx\n<`
**Vektighet:** HØY - Dette er en anomaledirectory med kontaminerte tegn i navnet
**Innhold:** 1 fil (ukjent)
**Status:** Eksisterer som en mapp med kontaminerte tegn (\n og <)

### 1.2 DashboardMatchStatus (mappe vs enkeltfil)
**Steder:** 
- `/components/DashboardMatchStatus` (fil uten .tsx-endsning)
- `/components/DashboardMatchStatus.tsx` (vanlig fil)
**Vektighet:** MEDIUM - To filer med samme navn, den ene uten .tsx
**Konflikt:** Mulig byggefeil avhengig av hvordan webpack importerer

### 1.3 MatchBreak (fil uten ending)
**Sted:** `/components/MatchBreak` (fil uten .tsx-endsning)
**Vektighet:** LAV - Enkeltfil uten TypeScript-endsning
**Status:** Potensielt import-problem

---

## 2. DUPLIKAT-KOMPOSANTER

### 2.1 MatchCard - 7 versjoner funnet!

| # | Sted | Type | Brukes |
|---|------|------|--------|
| 1 | `components/MatchCard.tsx` | default export | ✅ dashboard/page.tsx (via `_components/MatchCard`) |
| 2 | `components/MatchCard.tsx?<` (anomal mapp) | ukjent | ❌ Usynlig for import |
| 3 | `components/match/MatchCard.tsx` | default export | ❌ Ingen imports funnet |
| 4 | `components/ui/MatchCard.tsx` | named export | ❌ Ingen imports funnet |
| 5 | `components/ui/cards/MatchCard.tsx` | default export | ❌ Ingen imports funnet |
| 6 | `components/ui5/MatchCard.tsx` | named export | ✅ matching/page.tsx |
| 7 | `components/MatchCardSkeleton.tsx` | skeleton variant | ❌ Ingen direkte imports funnet |

**Konklusjon:** `components/MatchCard.tsx` og `components/ui5/MatchCard.tsx` er de eneste i bruk. De andre 5 versjonene er DUPLICATE.

### 2.2 ChatWindow - 2 versjoner
| # | Sted | Brukes |
|---|------|--------|
| 1 | `components/ChatWindow.tsx` | ✅ (antatt hovedbruk) |
| 2 | `components/chat/ChatWindow.tsx` | ❌ Ingen imports funnet |

### 2.3 ChatList - 2 versjoner
| # | Sted | Brukes |
|---|------|--------|
| 1 | `components/ChatList.tsx` | ✅ (antatt hovedbruk) |
| 2 | `components/chat/ChatList.tsx` | ❌ Ingen imports funnet |

### 2.4 MatchBreakdown - 2 versjoner
| # | Sted | Brukes |
|---|------|--------|
| 1 | `components/MatchBreakdown.tsx` | ✅ (antatt hovedbruk) |
| 2 | `components/match/MatchBreakdown.tsx` | ❌ Ingen direkte imports funnet |

### 2.5 OnboardingFlow/Layout/Screen/Wizard - 4 versjoner
| # | Sted | Brukes |
|---|------|--------|
| 1 | `components/onboarding/OnboardingFlow.tsx` | ✅ |
| 2 | `components/onboarding/OnboardingLayout.tsx` | ✅ |
| 3 | `components/onboarding/OnboardingWizard.tsx` | ❌ Usikker |
| 4 | `components/onboarding/OnboardingScreen.tsx` | ❌ Usikker |

### 2.6 Launch-komponenter (5 komponenter)
| # | Sted | Type |
|---|------|------|
| 1 | `components/launch/SplashScreen.tsx` | Launch UI |
| 2 | `components/launch/LoadingScreen.tsx` | Launch UI |
| 3 | `components/launch/MatchSearchScreen.tsx` | Launch UI |
| 4 | `components/launch/LaunchFlow.tsx` | Launch UI |
| 5 | `components/launch/LaunchDemo.tsx` | Demo |

**Konklusjon:** Disse er organisert i en mappe men kan overlappe med onboarding-komponenter.

---

## 3. GAMLE/DUPLIKATE API-RUTER

### 3.1 Match vs Matching (kritisk overlap)

| Route | Fil | Beskrivelse | Status |
|-------|-----|-------------|--------|
| `POST /api/match` | `app/api/match/route.ts` | Finn beste match | AKTIV (ny) |
| `GET /api/match` | - | - | IKKE FANT |
| `POST /api/matching` | `app/api/matching/route.ts` | Kjør matching for alle brukere | AKTIV (dublett) |
| `GET /api/matching` | `app/api/matching/route.ts` | Hent eksisterende matcher | AKTIV (dublett) |

**Konflikt:** Både `/api/match` OG `/api/matching` gjør NÆRME IDENTISK funktjonalitet:
- `/api/match` bruker `findBestMatchFor()` fra `findBestMatchFor.ts`
- `/api/matching` bruker `matchingEngine()` direkte fra `engine.ts`
- Begge oppretter Match + Conversation + JourneyProgress

### 3.2 Ny-match ruter (3 ruter for samme ting)

| Route | Fil | Beskrivelse |
|-------|-----|-------------|
| `POST /api/match/new` | `app/api/match/new/route.ts` | Finn ny match |
| `POST /api/match/findBest` | `app/api/match/findBest/route.ts` | Finn beste |
| `POST /api/matching` | `app/api/matching/route.ts` | Kjør matching |

**Konklusjon:** Alle tre gjør omtrent det samme - dette er TRIPLE duplikat!

### 3.3 Accept ruter (2 versjoner)

| Route | Fil | Status |
|-------|-----|--------|
| `POST /api/match/accept` | `app/api/match/accept/route.ts` | NY |
| `POST /api/matching/accept` | `app/api/matching/accept/route.ts` | GAMLE/DUBLETT |

### 3.4 Detail/ruter (1 variant)

| Route | Fil | Status |
|-------|-----|--------|
| `GET /api/matching/detail` | `app/api/matching/detail/route.ts` | Kun denne |

### 3.5 Insight vs MatchInsights

| Route | Fil | Status |
|-------|-----|--------|
| `GET /api/match/insight` | `app/api/match/insight/route.ts` | Bruker AI |
| `GET/POST /api/ai/match-insights` | `app/api/ai/match-insights/route.ts` | Bruker AI (dublett) |

**Konklusjon:** Begge genererer match-insights, én via `/api/match/insight` og én via `/api/ai/match-insights`.

### 3.6 Cron matching

| Route | Fil | Status |
|-------|-----|--------|
| `GET /api/cron/matching` | `app/api/cron/matching/route.ts` | Automatisk matching |

### 3.7 Oppsummering API-ruter

**Duplikatgrupper:**
1. `/api/match/new` + `/api/match/findBest` + `/api/matching` (POST) = TRIPLE
2. `/api/match/accept` + `/api/matching/accept` = DUPLIKAT
3. `/api/match/insight` + `/api/ai/match-insights` = DELT FUNKSJONALITET

---

## 4. GAMLE MATCHING-MODULER

### 4.1 explainMatch.ts vs explainer.ts (dublett)

| Fil | Type | Beskrivelse |
|-----|------|-------------|
| `lib/matching/explainMatch.ts` | `explainMatch(ScoreResult)` | GAMLE - tar ScoreResult som input |
| `lib/matching/explainer.ts` | `generateExplanation(MatchResult)` | NY - tar MatchResult som input |

**Konflikt:** 
- `explainMatch.ts` bruker et annet interface (`ScoreResult` med `SubScoreBreakdown`)
- `explainer.ts` bruker nytt interface (`MatchResult` med ny `MatchTier`-enum)
- De returnerer LIKNENDE data men med ulik struktur
- `index.ts` eksporterer kun `explainer.ts`
- `engine.ts` importerer kun `explainer.ts`
- `explainMatch.ts` er **IKKE i bruk** av engine eller index!

### 4.2 Matching-moduler - full oversikt

| Fil | Beskrivelse | Status |
|-----|-------------|--------|
| `scorer.ts` | Sub-score beregning | AKTIV |
| `ranking.ts` | Sortering og deduplisering | AKTIV |
| `engine.ts` | Kjerne matchingEngine | AKTIV |
| `explainer.ts` | Forklaring generering | AKTIV |
| `explainMatch.ts` | GAMLE forklaringer | ❌ IKKE I BRUK |
| `normalizer.ts` | Normalisering | AKTIV |
| `dealbreaker.ts` | Dealbreaker-sjekk | AKTIV |
| `resonanceScore.ts` | Resonans-beregning | AKTIV |
| `findBestMatchFor.ts` | Finn beste match | AKTIV |
| `findBestResonance.ts` | Finn beste resonans | AKTIV (delvis dublett) |
| `feedback.ts` | Feedback-håndtering | AKTIV |
| `testData.ts` | Test-data | ❌ IKKE I BRUK |
| `types.ts` | Type-definisjoner | AKTIV |
| `weightConfig.ts` | Vekt-konfigurasjon | AKTIV |
| `index.ts` | Export-fil | AKTIV |

**Konklusjon:** `explainMatch.ts` og `testData.ts` er dead code i matching-modulen.

### 4.3 findBestMatchFor vs findBestResonance

| Fil | Beskrivelse | Status |
|-----|-------------|--------|
| `findBestMatchFor.ts` | Finn beste match via matchingEngine | AKTIV (brukt av /api/match) |
| `findBestResonance.ts` | Finn beste resonans | AKTIV (brukt av /api/match/findBest) |

**Konflikt:** Disse to funksjonene gjør NÆRME IDENTISK ting:
- Begge iterer over alle kandidater
- Begne bruker matchingEngine
- Begne returner den beste matchen
- `findBestMatchFor` er brukt av `/api/match`
- `findBestResonance` er brukt av `/api/match/findBest`

---

## 5. GAMLE JOURNEY-TEKSTER

### 5.1 Journey-relaterte mapper

| Sted | Beskrivelse | Status |
|------|-------------|--------|
| `content/journey/` | Journey-innhold | ? |
| `journey/` (components) | Journey-komponenter | AKTIV |
| `lib/journey/` | Journey-logikk | AKTIV |

**Komponenter:**
- `components/journey/JourneyCard.tsx`
- `components/journey/journeyEngine.ts`
- `components/journey/JourneyMap.tsx`
- `components/journey/JourneySummaryMini.tsx`
- `components/journey/JourneyView.tsx`

**Lib:**
- `lib/journey/generateFirstMessage.ts`
- `lib/journey/getJourneyImpulse.ts`
- `lib/journey/getJourneyState.ts`
- `lib/journey/journeyEngine.ts`
- `lib/journey/journeyPhases.ts`
- `lib/journey/journeyStateEngine.ts`
- `lib/journey/milestones.ts`
- `lib/journey/progression.ts`
- `lib/journey/runJourneyStep.ts`

**Konflikt:** Det finnes både `components/journey/` OG `lib/journey/` med `journeyEngine.ts` i begge!

---

## 6. GAMLE TEMPLATES

### 6.1 templates3.tsx (ubrukt)

| Fil | Eksporterer | Brukes |
|-----|-------------|--------|
| `components/ui/templates3.tsx` | DashboardTemplate3, ChatTemplate3, ProfileTemplate3, CoupleTemplate3, JourneyTemplate3, MatchTemplate3 | ❌ IKKE I BRUK |

**Bemerkning:** Filer eksporteres fra `components/ui/index.tsx` men importeres AV ingen andre filer.

### 6.2 ui/templates/ (nyere versjon)

| Fil | Beskrivelse |
|-----|-------------|
| `components/ui/templates/ChatTemplate.tsx` | Chat-mal |
| `components/ui/templates/CoupleTemplate.tsx` | Couple-mal |
| `components/ui/templates/DashboardTemplate.tsx` | Dashboard-mal |
| `components/ui/templates/JourneyTemplate.tsx` | Journey-mal |
| `components/ui/templates/MatchTemplate.tsx` | Match-mal |
| `components/ui/templates/ProfileTemplate.tsx` | Profile-mal |

**Konflikt:** Både `templates3.tsx` OG `templates/`-mappen eksisterer med samme konsept.

### 6.3 emotionTemplates.tsx

| Fil | Beskrivelse |
|-----|-------------|
| `components/ui/emotionTemplates.tsx` | Emotion-templates |
| `components/ui/emotionalSuggestions.tsx` | Emotion-forslag |

---

## 7. UBROKTE/DEAD CODE-FILER

### 7.1 JavaScript-filer (i TypeScript-prosjekt)
| Fil | Beskrivelse | Brukes |
|-----|-------------|--------|
| `components/KnowYourCard.js` | Enkel komponent | ❌ NEI |
| `components/Layout.js` | Layout-komponent | ❌ NEI |

**Vektighet:** LAV - Enkle filer som sannsynligvis er glemt under migrering til TSX

### 7.2 MatchHistory-komponenter (ubrukt)
| Fil | Beskrivelse |
|-----|-------------|
| `components/MatchHistory/MatchHistoryItem.tsx` | Match-history item |
| `components/MatchHistory/MatchHistoryList.tsx` | Match-history list |
| `components/MatchHistory/MatchHistorySkeleton.tsx` | Skeleton |
| `components/MatchHistory/MatchHistoryEmpty.tsx` | Empty state |

**Status:** Ingen filer importerer disse. De er fullstendig dead code.

### 7.3 explainMatch.ts (dead)
| Fil | Beskrivelse |
|-----|-------------|
| `lib/matching/explainMatch.ts` | GAMLE forklaring-funksjon |

**Status:** Importeres av ingen. `explainer.ts` er den aktive versjonen.

### 7.4 testData.ts (dead)
| Fil | Beskrivelse |
|-----|-------------|
| `lib/matching/testData.ts` | Test-data for matching |

**Status:** Importeres av ingen. Kun køybar via `npx ts-node`.

### 7.5 DashboardMatchStatus (fil uten .tsx)
| Fil | Beskrivelse |
|-----|-------------|
| `components/DashboardMatchStatus` | Fil uten TypeScript-endsning |

**Status:** Kan forårsake import-problemer

---

## 8. FILER SOM SHADOW'ER NYERE FILER

### 8.1 MatchCard.tsx?< directory
| Sted | Problem |
|------|---------|
| `/components/MatchCard.tsx?\`<` | Anomal mappe som kan interferere med webpack/resolver |

### 8.2 MatchCard.tsx (root components) vs sub-folders
| Sted | Problem |
|------|---------|
| `components/MatchCard.tsx` | Hoved-match-card |
| `components/match/MatchCard.tsx` | Dublett - kan forveksles |

### 8.3 DashboardMatchStatus (fil) vs DashboardMatchStatus.tsx
| Sted | Problem |
|------|---------|
| `components/DashboardMatchStatus` | Fil uten ending |
| `components/DashboardMatchStatus.tsx` | TypeScript-versjon |

---

## 9. IMPORTS SOM IKKE BRUKES

### 9.1 MatchHistory-komponenter
Ingen filer importere `components/MatchHistory/*`

### 9.2 templates3-eksportene
Ingen filer importerer `DashboardTemplate3`, `ChatTemplate3`, `ProfileTemplate3`, `CoupleTemplate3`, `JourneyTemplate3`, eller `MatchTemplate3`

### 9.3 components/match/MatchCard.tsx
Ingen filer importerer denne direkte

### 9.4 components/ui/MatchCard.tsx
Ingen filer importerer denne direkte

### 9.5 components/ui/cards/MatchCard.tsx
Ingen filer importerer denne direkte

---

## 10. SPRÅKBLANDING (BOKMÅL/NYNORSK)

### 10.1 Matching-modulen (LIB/matching)
**Hovedspråk: Nynorsk**

| Fil | Eksempel |
|-----|----------|
| `scorer.ts` | "Hovudscorer-funksjonar", "de 5 dimensjonane" |
| `engine.ts` | "Hovudfunksjon", "Vekt de", "de med" |
| `explainer.ts` | "Genererer lesbare forklaringar", "Gir ei komplett" |
| `ranking.ts` | "sortering og deduplisering" |
| `normalizer.ts` | "normaliserast til" |
| `dealbreaker.ts` | "Modenheits-gap" |
| `types.ts` | "de 5 dimensjonane", "normalisert til" |
| `weightConfig.ts` | "den eine sanne kilden" |

### 10.2 API-ruter (APP/api)
**Hovedspråk: Bokmål/Bland**

| Fil | Eksempel |
|-----|----------|
| `api/match/route.ts` | "brukeren", "matcha" (nynorsk) |
| `api/matching/route.ts` | "Ikke autentisert" (bokmål), "Kunne ikke hente" (nynorsk) |
| `api/match/new/route.ts` | "Bruker ikke funnet" (nynorsk/bokmål-blanding) |

### 10.3 Komponenter (COMPONENTS)
**Hovedspråk: Bokmål**

| Fil | Eksempel |
|-----|----------|
| `components/MatchCard.tsx` | "Hvorfor dere passer", "Mulig utfordring" (bokmål) |
| `components/ChatWindow.tsx` | Blandet |
| `components/DashboardMatchStatus.tsx` | "Listrar status", "Ikke i kø" (nynorsk) |

### 10.4 Språkoversikt

| Område | Dominerende språk | Mål |
|--------|-------------------|-----|
| `lib/matching/` | Nynorsk | Behold konsistent nynorsk |
| `app/api/` | Blandet | Standardiser til ett språk |
| `components/` | Bokmål | Behold eller standardiser |
| UI-tekster | Blandet | Standardiser til "neutral" norsk |

---

## 11. OVERLAPPENDE MODULER (KONSEPTUELL DUPLIKAT)

### 11.1 Match-søking - 3 konseptuelt ulike men like API-er

```
/api/match (POST)              → findBestMatchFor() → matchingEngine()
/api/match/new (POST)          → findBestMatchFor() → matchingEngine()  
/api/match/findBest (POST)     → findBestResonance() → matchingEngine()
/api/matching (POST)           → matchingEngine() (direkte)
```

**Alle fire ruter:**
- Søker etter beste match for en bruker
- Bruker samme matchingEngine
- Oppretter Match + Conversation + JourneyProgress

### 11.2 Journey-motor - 2 mapper med samme logikk

| Mapper | Filer |
|--------|-------|
| `components/journey/` | JourneyCard, JourneyMap, JourneyView, journeyEngine |
| `lib/journey/` | journeyEngine, journeyPhases, journeyStateEngine, progression |

**Konflikt:** Begge mapper inneholder `journeyEngine.ts` med ulik implementasjon!

### 11.3 Onboarding-komponenter - 4 komponenter for samme ting

| Komponent | Formål |
|-----------|--------|
| `OnboardingFlow` | Overordnet flow |
| `OnboardingLayout` | Layout wrapper |
| `OnboardingWizard` | Steg-for-steg wizard |
| `OnboardingScreen` | Enkelt skjerm |

**Konflikt:** Det er uklart hvilke som faktisk brukes vs hvilke som er gamle/glemt.

### 11.4 UI-komponenter - 3 lag med overlap

| Lag | Mapper | Beskrivelse |
|-----|--------|-------------|
| Legacy | `components/ui5/` | ui5 design system |
| Modern | `components/ui/` | Nyere ui-system |
| Atomic | `components/ui/cards/`, `components/ui/templates/`, etc. | Atomare komponenter |

---

## 12. OPPSUMMERING AV KRIPELLE FUNN

### Kritiske (HØY prioritert)
1. **MatchCard.tsx\n<** - Kontaminert directory med kontaminerte tegn
2. **DashboardMatchStatus** - Fil uten .tsx-endsning som shadow'er TypeScript-versjon
3. **4+ versjoner av MatchCard** - Enorm forvirring for hvilke som brukes
4. **4 API-ruter for samme match-funksjon** - `/api/match`, `/api/match/new`, `/api/match/findBest`, `/api/matching`

### Høyprioritet
5. **explainMatch.ts** - Dead code i matching-modulen
6. **MatchHistory-komponenter** - Fullstendig ubrukt (4 filer)
7. **templates3.tsx** - Eksporterer funksjoner som ingen bruker
8. **findBestMatchFor vs findBestResonance** - Duplikat funksjonalitet
9. **`/api/match/accept` vs `/api/matching/accept`** - Duplikat accept-ruter
10. **Språkblanding** - Både nynorsk og bokmål i samme filer og mapper

### Middel prioritert
11. **ChatWindow og ChatList** - Dublett i root vs sub-folder
12. **MatchBreakdown** - Dublett i root vs match/
13. **Journey-motor** - Dublett i components vs lib
14. **MatchBreak** - Fil uten TypeScript-endsning
15. **KnowYourCard.js og Layout.js** - JavaScript i TypeScript-prosjekt

### Lav prioritet
16. **Launch-komponenter** - Kan overlappe med onboarding
17. **emotionalSuggestions.tsx vs emotionTemplates.tsx** - Overlap
18. **`components/ui/templates/` vs `components/ui/templates3.tsx`** - Duplikat templating

---

## 13. ANBEFALINGER (IKKE EKSEKVERT)

### Fjern (kan trygt slettes)
- `components/MatchCard.tsx?\`<` (anomal directory)
- `components/MatchHistory/` (4 filer - ubrukt)
- `lib/matching/explainMatch.ts` (dublett av explainer.ts)
- `lib/matching/testData.ts` (testdata - ubrukt)
- `components/KnowYourCard.js` (ubrukt)
- `components/Layout.js` (ubrukt)
- `components/ui/templates3.tsx` (ubrukt)
- `components/match/MatchCard.tsx` (ubrukt)
- `components/ui/MatchCard.tsx` (ubrukt)
- `components/ui/cards/MatchCard.tsx` (ubrukt)
- `components/DashboardMatchStatus` (uten .tsx)
- `components/MatchBreak` (uten .tsx)

### Konsolider
- `/api/match/new` + `/api/match/findBest` + `/api/matching` → EN API-rute
- `/api/match/accept` + `/api/matching/accept` → EN API-rute
- `/api/match/insight` + `/api/ai/match-insights` → EN API-rute
- `components/journey/journeyEngine.ts` → Fjern fra enten components eller lib (ikke begge)
- `lib/matching/findBestMatchFor.ts` + `lib/matching/findBestResonance.ts` → EN funksjon
- `components/MatchCard.tsx` → Hold EN versjon, fjern de andre

### Standardiser
- Språk i API-ruter (velg bokmål ELLER nynorsk)
- Språk i komponenter (velg bokmål ELLER nynorsk)