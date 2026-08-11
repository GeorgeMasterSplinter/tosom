# TO SOM V2.1 — IMPLEMENTATION PLAN

> **Dato:** 2026-11-08
> **Status:** READY FOR EXECUTION
> **Forrige versjon:** v2.0 (docs/v2/01-09)
> **Formål:** Presis implementasjonsplan basert på presisjonsgjennomgang av kildekode. Inkluderer alle korrigeringer, bugs, patch-sekvenser, filstier, søkeankere, endringsbeskrivelser, avhengigheter og test-verifisering.

---

## 1. KORRIGERINGER TIL V2.0 DOKUMENTER

### 1.1 Dok 01 — ARCHITECTURE-OVERVIEW-V2.md

**Korreksjon 1.1.1: Admin API-ruter er lib-funksjoner, ikke bare stubs**

| Felt | v2.0 (feil) | Faktisk (korrigert) |
|------|-------------|---------------------|
| `app/api/admin/users/route.ts` | Stubb/placeholder | Kaller `lib/admin/users.ts` → `searchUsers()`, `getUserStats()` med Prisma-hendqing, try-catch, demo-mode fallback |
| `app/api/admin/audit/route.ts` | Stubb/placeholder | Kaller `lib/admin/audit.ts` → `getAuditLogs()` medPrisma-fallback til hardcoded demo-data |
| `app/api/admin/dashboard/route.ts` | Stubb/placeholder | Kaller `lib/admin/dashboard.ts` → `getDashboardStats()` med Prisma-fallback |
| `app/api/admin/suspicious/route.ts` | Full implementering i route | Stubb-prosjekt (brukes ikke i nåværende kodebase, ingen referanser) |
| `app/api/admin/verify-queue/route.ts` | Full implementering i route | Kaller `lib/admin/verify.ts` → `getVerifyQueue()`, `approveVerification()` med Prisma |
| `app/api/admin/imprint[routes]` | Full implementering i route | Kaller `lib/admin/imprint.ts` → `getImprintData()`, `updateImprint()` med Prisma |

**Korreksjon 1.1.2: Observability-ruter er stubs uten lib-funksjoner**

| Fil | Status | Detalj |
|------|--------|--------|
| `app/api/system/metrics/route.ts` | STUB | Returnerer hardcoded JSON, ingen lib-funksjon, ingen Prisma-kall |
| `app/api/system/health/route.ts` | STUB | Returnerer `{ status: "ok" }`, ingen helsekontroll mot DB/eksterne tjenester |

**Korreksjon 1.1.3: Middleware er kondisjons-basert**

| Felt | v2.0 (feil) | Faktisk (korrigert) |
|------|-------------|---------------------|
| `middleware.ts` | Kaller admin auth lib-funksjon | Kondisjons-kontroll: sjekker config, demoMode, password match HARDCODED i middleware |

**Patch-sekvens for Dok 01:**
```
PATCH-01-A: Oppdater admin API architecture diagram
  - Vis at API-ruter kaller lib/admin/*.ts funksjoner
  - Vis fallback-layers (Prisma → demo data)
  - Marker observability-ruter som stubs

PATCH-01-B: Oppdater security layer beskrivelse
  - Middleware kondisjons-kontroll (ikke lib-funksjon)
  - Admin password er hardcoded i middleware
  - Ingen rate limiting på admin API-endepunkter
```

---

### 1.2 Dok 02 — DATA-MODEL-V2.md

**Korreksjon 1.2.1: Match.model felter**

| Felt | v2.0 (feil) | Faktisk i schema.prisma |
|------|-------------|------------------------|
| `matchDate` | `DateTime` med `@updatedAt` | `DateTime` WITHOUT `@updatedAt` |
| `endedAt` | Not documented | `DateTime?` exists |
| `unmatchedBy` | Not documented | `String?` exists |

**Korreksjon 1.2.2: User.model isVerified vs verificationToken**

| Felt | v2.0 (feil) | Faktisk i schema.prisma |
|------|-------------|------------------------|
| `isVerified` | Documented as boolean field | Field does NOT exist in schema |
| `verificationToken` | Not mentioned | `String?` EXISTS in User model |
| `verificationExpires` | Not mentioned | `DateTime?` EXISTS in User model |
| `twoFactorEnabled` | Not mentioned | `Boolean @default(false)` EXISTS |
| `twoFactorSecret` | Not mentioned | `String?` EXISTS |

**Korreksjon 1.2.3: Profile.model vs publicProfile.ts expectations**

| Problem | Detalj |
|---------|--------|
| `publicProfile.ts` leter etter `profile.bio`, `profile.interests`, `profile.languages`, `profile.lifestyle` | Profile model har kun `title`, `about_me`, `deep_profile` (JSON), `avatar_url`, `banner_url`, `is_public`, `show_online_status`, `completion_percentage`, `tagline` |
| `getPublicProfile()` mapper `bio = profile.about_me || user.name` | Fallback til user.name når about_me er tom |
| Returnerer `interests: []`, `languages: []`, `lifestyle: {}` hardcoded | Ingen data hentes fra deep_profile JSON |

**Korreksjon 1.2.4: Notification.model isRead vs read**

| Felt | v2.0 (feil) | Faktisk i schema.prisma |
|------|-------------|------------------------|
| `isRead` | Documented as boolean | Field name is `read` with `@default(false)` |

**Patch-sekvens for Dok 02:**
```
PATCH-02-A: Korreger Match model feltliste
  - Fjern @updatedAt fra matchDate
  - Legg til endedAt, unmatchedBy

PATCH-02-B: Korreger User model verifikasjonsfelt
  - Fjern isVerified
  - Legg til verificationToken, verificationExpires, twoFactorEnabled, twoFactorSecret

PATCH-02-C: Dokumenter Profile vs publicProfile gap
  - deep_profile JSON struktur ikke utnyttet
  - bio/interests/languages/lifestyle ikke lagret i Profile

PATCH-02-D: Korreger Notification.isRead → read
```

---

### 1.3 Dok 05 — MATCHING-ENGINE-V2.md

**Korreksjon 2.2.1: Weight distribution MISMATCH**

| Kilde | biological | cultural | emotional | values | total |
|-------|------------|----------|-----------|--------|-------|
| `weightConfig.ts` (brand layer) | 0.35 | 0.25 | 0.20 | 0.20 | 1.00 |
| `unifiedScorer.ts` (actual scorer) | 0.40 | 0.15 | 0.25 | 0.20 | 1.00 |

**Kritisk:** `unifiedScorer.ts` bruker vekter som AVVIKER fra brand-layer-dokumentasjonen. Biological er +5% i scorer, cultural er -10%.

**Korreksjon 2.2.2: baseScore.ts Unused**

| Fil | Status |
|-----|--------|
| `lib/baseScore.ts` | **BERGEM AVKORDET** — Ingen fil i kodebase importerer denne. Ekporterer `computeBaseScore()`, `applyOrientationFilter()`, `applyOrientationPenalty()`, `computeFallbackScore()`, `BASE_SCORE_WEIGHTS`, `computeCompositeScore()` med `typeof z number` syntax error. |

**Korreksjon 2.2.3: Dealbreaker — kun sexualitet, ikke kjønnstype**

| Felt | v2.0 (feil) | Faktisk i dealbreaker.ts |
|------|-------------|-------------------------|
| `genderIncompatible` dealbreaker | Dokumentert som hard filter | Eksisterer IKKE — bare `orientationIncompatible` basert på sexualitet + preferr Sexualitet |
| Kjønnscompatibilitet | Hard filter | Ingen implementering |

**Korreksjon 2.2.4: findBestResonance — hardcoded fallback returned**

| Felt | Detalj |
|------|--------|
| Fallback-respons | Når alle candidates er forkastet (score < 0.26 eller inaktiv), returneres `candidates[0].id` med `scoreCategory: "GOOD"`, `resonanceLevel: "MODERATE"`, `confidence: 0.3` — dvs. første kandidat uavhengig av score |

**Patch-sekvens for Dok 05:**
```
PATCH-05-A: Oppdater weight distribution tabell
  - Vis BADE weightConfig.ts OG unifiedScorer.ts verdier
  - Marker AVVIKELSE som KRITISK BUG

PATCH-05-B: Dokumenter baseScore.ts som avkortet/død kode
  - Vis at ingen fil importerer den
  - Vis syntax error i exports

PATCH-05-C: Korreger dealbreaker beskrivelse
  - Fjern genderIncompatible
  - Dokumenter at kun orientationIncompatible eksisterer
  - Vis at kjønnscompatibilitet IKKE er implementert

PATCH-05-D: Dokumenter findBestResonance fallback-bug
  - Forklær at candidates[0] returneres uavhengig av score
  - Vis hardcoded verdier (GOOD, MODERATE, 0.3)
```

---

### 1.4 Dok 06 — JOURNEY-ENGINE-V2.md

**Korreksjon 3.1.1: JourneyAPI Response Format Mismatch**

| Felt | v2.0 (feil) | Faktisk i journey.ts getPhaseData() |
|------|-------------|-----------------------------------|
| Returnerer `phase` med `name` felt | Dokumentert | Returnerer `title` ikke `name` |
| Returnerer `next_button_text` | Dokumentert | Returnerer `nextButtonText` (camelCase) |

**Korreksjon 3.1.2: JourneyAPI isPhaseComplete hardkoder chapter requirement**

| Felt | Detalj |
|------|--------|
| `isPhaseComplete` i journey.ts | Sjekker `completedSteps >= 3` for ALL phases — men INTRO har kun 1 step, og some phases har 2 eller 4 steps. BRONSE: phase.config.completionRequirement brukes IKKE. |

**Korreksjon 3.1.3: JourneyAPI nextPhaseIndex ingen bound checking**

| Felt | Detalj |
|------|--------|
| `nextPhaseIndex = phases.findIndex(p => p.id === nextPhaseId)` | Returnerer -1 når nextPhaseId ikke finnes (LAST phase). Kall til `getPhaseData(-1)` returnerer `null`. ** IKKE en crash-bug, men uklar oppførsel. |

**Patch-sekvens for Dok 06:**
```
PATCH-06-A: Korreger JourneyAPI response format
  - phase.name → phase.title
  - next_button_text → nextButtonText

PATCH-06-B: Dokumenter isPhaseComplete bug
  - Hardkodet >= 3 for alle faser
  - INTRO har 1 step, RESONANCE kan ha 2-4
  - phase.config.completionRequirement ignoreres

PATCH-06-C: Dokumenter nextPhaseIndex oppførsel
  - Returnerer -1 for siste fase
  - getPhaseData(-1) → null (safe men uklart)
```

---

### 1.5 Dok 07 — UI-KOMPONENTER-V2.md

**Korreksjon 4.1.1: ToSomTabs underline positioning bug**

| Felt | Detalj |
|------|--------|
| `components/ui/system/ToSomTabs.tsx` | Underline bruker `[onclick*="${value}"]` HTML-attribute-selector for å finne aktiv knapp. Dette er SKRØPLIG fordi onclick-attributtet settes via React event handlers og kan endres av minifiers/bundlers. |
| Reprodusérbar | Ja — underline posisjonerer seg feil eller ikke i produksjons-builds der kode er minifiet |

**Korreksjon 4.1.2: ToSomSlider useRef type mismatch**

| Felt | Detalj |
|------|--------|
| `components/ui/system/ToSomSlider.tsx` | `sliderRef` deklareres som `useRef<HTMLDivElement>` men brukes på `<fieldset>` element. TypeScript-warning: fieldset ≠ div. |

**Korreksjon 4.1.3: ToSomToast double-render risk**

| Felt | Detalj |
|------|--------|
| `components/ui/system/ToSomToast.tsx` | Bruker BOTH `<ToSomAnimatedEntrance>` wrapper AND manual useEffect for setVisible(false). Risiko for dobbelt-unmount eller race conditions. |

**Patch-sekvens for Dok 07:**
```
PATCH-07-A: Dokumenter ToSomTabs underline bug
  - [onclick*=""] selector er skjør
  - Må bruke data-* attribute eller ref-basert tilnærming

PATCH-07-B: Dokumenter ToSomSlider type mismatch
  - useRef<HTMLDivElement> på <fieldset>

PATCH-07-C: Dokumenter ToSomToast double-render risiko
  - ToSomAnimatedEntrance + manual useEffect
```

---

## 2. IDENTIFISERTE BUGS

### BUG-001: JourneyTimeline.tsx Fase-inndeling

**Fil:** `components/journey/JourneyTimeline.tsx`
**Linje:** ~30-60 (phase grouping)
**Type:** Logikk-feil
** Sevity:** MEDIUM

**Beskrivelse:**
Komponenten grupperer journey-faser i "Del 1: Oppdagelse" og "Del 2: Forbindelse". Grupperingen inkludererer FEILE faser basert på v2.0-responsformat som ikke matcher v2.1 response format.

**Faktisk kode:**
```typescript
// INTRO, ATTUNEMENT, CALIBRATION, RESONANCE, ALIGNMENT, ANCHOR i "Del 1"
// BUILDING_TRUST, DEEPER i "Del 2"
// Men CHECKIN eksisterer i enums og er ikke inkludert
```

**Patch:**
```
FIL: components/journey/JourneyTimeline.tsx
SØKEANKER: "Del 1: Oppdagelse"
ENDRING: 
  - Verifiser at alle faser fra JourneyPhase enum er inkludert
  - Legg til CHECKIN i korrekt gruppe
  - Oppdater fasenavn til å matche getPhaseData() response (title, ikke name)
TEST: Vis JourneyTimeline med alle faser, bekreft at alle vises korrekt
```

---

### BUG-002: ToSomTabs Underline Positioning

**Fil:** `components/ui/system/ToSomTabs.tsx`
**Linje:** 68
**Type:** Skør DOM-selector
**Severity:** HIGH (produksjons-kritisk)

**Beskrivelse:**
Underline-indikatoren bruker `tabsContainer.querySelector(`[onclick*="${value}"]`)` for å finne aktiv tab. Dette依赖于 HTML onclick-attributter som settes via React sin interne event handling. I produksjons-builds med kode-minifisering, vil dette selektoren FIASKE.

**Faktisk kode:**
```typescript
const activeBtn = tabsContainer.querySelector(`[onclick*="${value}"]`) as HTMLElement;
```

**Patch:**
```
FIL: components/ui/system/ToSomTabs.tsx
SØKEANKER: '[onclick*="${value}"]'
ENDRING:
  - Legg til data-tab-value="{tab.value}" på hver <button>
  - Endre selector til [data-tab-value="${value}"]
  - Eller bruk ref-basert tilnærming med Map<string, HTMLElement>
TEST: Build i production mode, verifiser underline posisjonerer korrekt
```

---

### BUG-003: unifiedScorer.ts vs weightConfig.ts Vekstavvik

**Filer:** `lib/ai/unifiedScorer.ts`, `config/matching.ts`
**Type:** Konfigurasjons-inkonsistens
**Severity:** HIGH ( Matching-nøyaktighet påvirket)

**Beskrivelse:**
Scoreren bruker vekter som avviker fra brand-layer-dokumentasjonen. Biological category har 40% vekt i scorer men 35% i docs. Cultural har 15% i scorer men 25% i docs.

**Faktisk kode:**
```typescript
// unifiedScorer.ts:
    biological: { weight: 0.40 },   // vs 0.35 i weightConfig.ts
    cultural: { weight: 0.15 },     // vs 0.25 i weightConfig.ts
    emotional: { weight: 0.25 },    // vs 0.20 i weightConfig.ts
    values: { weight: 0.20 },       // MATCHER
```

**Patch:**
```
FIL: lib/ai/unifiedScorer.ts
SØKEANKER: 'biological: { weight:'
ENDRING:
  - Avgjøre hvilken kilde er "correct" (weightConfig.ts som brand source OF unifiedScorer.ts som implementert design)
  - Synkroniser vekter mellom de to filene
  - Dokumenter beslutning i matching.md
TEST: Kjør matching med begge konfigurasjonene, sammenlign resultater
```

---

### BUG-004: findBestResonance Hardcoded Fallback

**Fil:** `lib/ai/findBestResonance.ts`
**Linje:** ~150 (fallback return)
**Type:** Logikk-feil — feil resultat ved lav kompatibilitet
**Severity:** MEDIUM

**Beskrivelse:**
Når ingen candidate oppfyller threshold (score >= 0.26 og aktiv), returneres `candidates[0].id` med hardcoded positive verdier. Dette gir ET POSITIVT RESULTAT selv when alle kandidater har lave score.

**Faktisk kode:**
```typescript
    // Fallback — return first candidate
    return {
      candidateId: candidates[0].id,
      resonanceScore: bestScore,
      scoreCategory: 'GOOD',        // ← HARDCODED
      resonanceLevel: 'MODERATE',  // ← HARDCODED
      confidence: 0.3,             // ← HARDCODED
    };
```

**Patch:**
```
FIL: lib/ai/findBestResonance.ts
SØKEANKER: "Fallback — return first candidate"
ENDRING:
  - Beregn scoreCategory basert på faktisk bestScore
  - Sett resonanceLevel korrekt (GOOD/MODERATE/WEAK/POOR)
  - Setter confidence basert på score-spredning
  - Konstanreturner null eller et EXPLICIT LAVT resultat i stedet for positive hardcoded verdier
TEST: Test med kandidater som alle har score < 0.26, verifiser at resultatet er negativt/ lavt
```

---

### BUG-005: isPhaseComplete Hardkodet Step-Krav

**Fil:** `lib/journey/api.ts` (eller等效 file)
**Type:** Logikk-feil — fase-fullførelse feil beregnet
**Severity:** MEDIUM

**Beskrivelse:**
Alle faser krever `completedSteps >= 3`, men INTRO har kun 1 step, og RESONANCE kan ha 2-4 steps avhengig av konfigurasjon.

**Patch:**
```
FIL: lib/journey/api.ts (eller relevant journey API fil)
SØKEANKER: 'completedSteps >= 3'
ENDRING:
  - Bruk phase.config.completionRequirement i stedet for hardkodet 3
  - Eller beregn basert på phase.steps.length
TEST: Fullfør INTRO med 1 step, verifiser at fasen markeres som fullført
```

---

### BUG-006: baseScore.ts Død Kode med Syntax Error

**Fil:** `lib/baseScore.ts`
**Type:** Død kode + syntax error
**Severity:** LOW (påvirker ikke produksjon, men indikerer ufullstendig refactor)

**Beskrivelse:**
Filen eksporterer `BASE_SCORE_WEIGHTS` med `typeof z number` syntax og `computeCompositeScore`. Ingen fil i kodebase importerer denne. Filen er en rest fra en tidligere implementering som erstattes av unifiedScorer.ts.

**Patch:**
```
FIL: lib/baseScore.ts
SØKEANKER: (hele filen)
ENDRING:
  - Fjern filen helt
  - Eller marker med @deprecated comment og fix syntax error
  - Oppdater eventuelle import-statements som refererer til den
TEST: Verifiser at bygget ikke brytes og matching fungerer uten baseScore.ts
```

---

## 3. PATCH-SEKVENSER — FULLSTENDIG LISTE

### Prioritering og Rekkefølge

| Prioritet | Patch-ID | Fil | Bug/Korreksjon | Avhengigheter | Est. kompleksitet |
|-----------|----------|-----|-----------------|---------------|------------------|
| **P0** | PATCH-BUG-002 | `components/ui/system/ToSomTabs.tsx` | Underline selector | Ingen | Lav |
| **P0** | PATCH-BUG-003 | `lib/ai/unifiedScorer.ts` + `config/matching.ts` | Vekstavvik | Ingen | Lav |
| **P1** | PATCH-BUG-004 | `lib/ai/findBestResonance.ts` | Hardcoded fallback | PATCH-BUG-003 | Medium |
| **P1** | PATCH-BUG-001 | `components/journey/JourneyTimeline.tsx` | Fase-inndeling | Ingen | Lav |
| **P1** | PATCH-BUG-005 | `lib/journey/api.ts` | isPhaseComplete | PATCH-DOC-06-B | Medium |
| **P2** | PATCH-BUG-006 | `lib/baseScore.ts` | Død kode | Ingen | Lav |
| **P2** | PATCH-07-B | `components/ui/system/ToSomSlider.tsx` | useRef type mismatch | Ingen | Lav |
| **P2** | PATCH-07-C | `components/ui/system/ToSomToast.tsx` | Double-render risiko | Ingen | Medium |
| **P3** | PATCH-01-A/B | Docs-only | Architecture korrigeringer | Ingen | Info |
| **P3** | PATCH-02-A/B/C/D | Docs-only | Data Model korrigeringer | PATCH-01-A | Info |
| **P3** | PATCH-05-A/B/C/D | Docs-only | Matching korrigeringer | PATCH-BUG-003/004 | Info |
| **P3** | PATCH-06-A/B/C | Docs-only | Journey korrigeringer | PATCH-BUG-005 | Info |

---

## 4. IMPLEMENTERINGSREKKEFØLGE

### Fase 1: Kritiske Bugs (P0)

```bash
# 1A. Fix ToSomTabs underline
PATCH-BUG-002 → components/ui/system/ToSomTabs.tsx
  - Erstatt [onclick*=""] med data-tab-value attribute
  - Test i production build

# 1B. Sync matching weights
PATCH-BUG-003 → lib/ai/unifiedScorer.ts + config/matching.ts
  - Avgjør korrekt kilde (weightConfig.ts = brand source)
  - Oppdater unifiedScorer.ts til å matche
  - Test matching med nye vekter
```

### Fase 2: Viktige Bugs (P1)

```bash
# 2A. Fix findBestResonance fallback
PATCH-BUG-004 → lib/ai/findBestResonance.ts
  - Fjern hardcoded positive verdier
  - Beregn dynamisk basert på score
  - (Avhengig av PATCH-BUG-003)

# 2B. Fix JourneyTimeline faser
PATCH-BUG-001 → components/journey/JourneyTimeline.tsx
  - Legg til CHECKIN fase
  - Oppdater fasenavn

# 2C. Fix isPhaseComplete
PATCH-BUG-005 → lib/journey/api.ts
  - Bruk phase.config.completionRequirement
```

### Fase 3: Rensing (P2)

```bash
# 3A. Fjern baseScore.ts
PATCH-BUG-006 → lib/baseScore.ts

# 3B. Fix ToSomSlider type
PATCH-07-B → components/ui/system/ToSomSlider.tsx

# 3C. Fix ToSomToast double-render
PATCH-07-C → components/ui/system/ToSomToast.tsx
```

### Fase 4: Dokument-korreksjoner (P3)

```bash
# Oppdater docs/v2/01-, 02-, 05-, 06-, 07.md med alle PATCH-A/B/C/D endringer
```

---

## 5. TEST-VERIFISERING

### Automated Tests

| Test | Type | Fil | Verifiserer |
|------|------|-----|-------------|
| ToSomTabs underline i prod-build | Visual/E2E | `e2e/tests/components.tabs.spec.ts` | Underline posisjonerer korrekt etter minifisering |
| Matching weights konsistens | Unit | `lib/ai/__tests__/weightConsistency.test.ts` | unifiedScorer.ts = weightConfig.ts |
| findBestResonance lave score | Unit | `lib/ai/__tests__/findBestResonance.fallback.test.ts` | Fallback returnerer korrekt lavt resultat |
| isPhaseComplete INTRO | Unit | `lib/journey/__tests__/isPhaseComplete.test.ts` | INTRO fullføres med 1 step |
| JourneyTimeline CHECKIN vises | Visual/E2E | `e2e/tests/journey.timeline.spec.ts` | CHECKIN fase vises i korrekt gruppe |

### Manual Verification Checklist

- [ ] Open app i production build (npm run build && npm start)
- [ ] Naviger til哪 page med ToSomTabs → velg ulike tabs → verifiser underline følger aktiv tab
- [ ] Kjør matching mellom to brukere → verifiser at vekter matcher weightConfig.ts
- [ ] Kjør matching med lavkompatible kandidater (score < 0.26) → verifiser at resultat er negativt
- [ ] Fullfør INTRO fase med 1 step → verifiser at fasen markeres som fullført
- [ ] Naviger through journey → verifiser at alle faser vises inkludert CHECKIN

---

## 6. AVHENGIGHETER

```
PATCH-BUG-002 (ToSomTabs)
  └─ INGEN avhengigheter
  └─ Kan kjøres uavhengig

PATCH-BUG-003 (Weights)
  └─ INGEN avhengigheter
  └─ Kan kjøres uavhengig
  └─ PATCH-BUG-004 avhenger av denne

PATCH-BUG-004 (Resonance fallback)
  └─ AVHENGER AV PATCH-BUG-003
  └─ Må kjøre ETTER vektsynch

PATCH-BUG-001 (JourneyTimeline)
  └─ INGEN avhengigheter
  └─ Kan kjøres uavhengig

PATCH-BUG-005 (isPhaseComplete)
  └─ AVHENGER AV PATCH-DOC-06-B (docs korrigering først)
  └---Kan implementeres uavhengig av andre bugs

PATCH-BUG-006 (baseScore.ts)
  └─ INGEN avhengigheter
  └─ Kan kjøres når som helst

PATCH-07-B/C (Slider/Toast)
  └─ INGEN avhengigheter
  └─ Kan kjøres uavhengig
```

---

## 7. SAMMENDRAG

| Type | Antall |
|------|--------|
| Dokument-korreksjoner | 15 (PATCH-01-A/B, 02-A/B/C/D, 05-A/B/C/D, 06-A/B/C, 07-A/B/C) |
| Reelle bugs | 6 (BUG-001 through BUG-006) |
| P0 Critical | 2 (BUG-002, BUG-003) |
| P1 High | 3 (BUG-001, BUG-004, BUG-005) |
| P2 Medium | 3 (BUG-006, PATCH-07-B, PATCH-07-C) |
| P3 Documentation | 15 patches across 5 documents |
| Ny e2e-tester anbefalt | 5 |

**Totalt estimert arbeid:** 4-6 timer for erfaren utvikler med kjennskap til kodebase.

---

*End of Implementation Plan v2.1*