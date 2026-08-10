# ToSom — Matching & Journey Design (v2026)

> **DEL 3 av full system audit.**  
> Formell dokumentasjon av matching-algoritme og 30-dagers guidet reise.

---

## 1. MATCHING-MOTOR

### 1.1 Høyarkitektur

```
┌─────────────────────────────────────────────┐
│  Input: User A (deep profile)               │
│  Pool: Candidates (compatible users)         │
└────────────────┬────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────┐
│  STEP 1: Dealbreaker Filter                 │
│  - Aldersgrense (>4 år)                      │
│  - Life rhythm conflicts                    │
│  - Explicit preferences                     │
│  - Boundary violations                      │
│  → REJECT (score = 0, no further scoring)   │
└────────────────┬────────────────────────────┘
                 ↓ (survived)
┌─────────────────────────────────────────────┐
│  STEP 2: Sub-Scoring (5 dimensjoner)        │
│  - Base Score (0.35)                        │
│  - Resonance Score (0.25)                   │
│  - Semantic Score (0.20)                    │
│  - Intimacy Score (0.10)                    │
│  - Future Score (0.10)                      │
│  → Hver scorer returnerer [0, 1]            │
└────────────────┬────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────┐
│  STEP 3: Weighted Sum                       │
│  score = Σ(subScore[i] × weight[i])         │
│  → raw score ∈ [0, 1]                       │
└────────────────┬────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────┐
│  STEP 4: Normalization                      │
│  Min-max normalisering mot pool             │
│  → normalizedScore ∈ [0, 1]                 │
└────────────────┬────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────┐
│  STEP 5: Tiering                            │
│  ≥0.85 → DEEP (Dyp resonans)                │
│  ≥0.70 → STRONG (Sterk resonans)            │
│  ≥0.55 → MODERATE (Moderat resonans)        │
│  ≥0.40 → GENTLE (Svak resonans)             │
│  <0.40 → weakResonance                      │
└────────────────┬────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────┐
│  STEP 6: Ranking & Selection                │
│  Sorter etter normalizedScore DESC          │
│  Returner #1 (beste match)                  │
└─────────────────────────────────────────────┘
```

### 1.2 Filoversikt (lib/matching/)

| Fil | Eksport | Formål |
|-----|---------|--------|
| `types.ts` | `SubScoreBreakdown`, `MatchTier`, `MatchResult`, `WeightConfig`, `ProfileData` | Type-definisjoner |
| `weightConfig.ts` | `getWeights()`, `getWeightsWithOverride()` | Vekstkonfigurasjon |
| `scorer.ts` | `weightedSum()`, hovedscoring | Kombinerer 5 sub-scorere |
| `resonanceScore.ts` | Resonans-scoring | Verdier, livssituasjon, personlighet |
| `dealbreaker.ts` | Dealbreaker-sjekker | Aldersgrense, life rhythm, grenser |
| `findBestResonance.ts` | Hovedmatching-funksjon | Full pipeline fra profil til match |
| `findBestMatchFor.ts` | Alternativ matching | Forskjellende kandidat-pool |
| `normalizer.ts` | Min-max normalisering | `normalizeScore()` |
| `ranking.ts` | Ranking-algoritme | Sortering og utvelgelse |
| `breakdown.ts` | Poengfordeling | Detaljert score-breakdown per dimensjon |
| `explainer.ts` | Match-forklaring | Generer humanlesbar forklaring |
| `feedback.ts` | Match-feedback | Bruker-feedback etter match |
| `engine.ts` | Matching-engine | Orkestrering av hele pipeline |
| `index.ts` | Re-exports | Entrepot for alle matching-funksjoner |

### 1.3 Vektkonfigurasjon (`weightConfig.ts`)

```ts
const MATCH_WEIGHTS = {
  base:      0.35,  // Alder, livsstil, grunnleggende kompatibilitet
  resonance: 0.25,  // Verdier, livssituasjon, personlighet
  semantic:  0.20,  // Kommunikasjonsstil, relasjonsstil
  intimacy:  0.10,  // Intimitet, emosjonelle behov
  future:    0.10,  // Fremtidsvisjon, forventninger
}
// Sum = 1.0 ✅
```

### 1.4 Dealbreaker Logic (`dealbreaker.ts`)

Dealbreakers **auto-rejecterer** kandidaten uten videre scoring:

| Dealbreaker | Kriterium | Beskrivelse |
|-------------|-----------|-------------|
| Aldersgrense | `abs(ageA - ageB) > 4` | For stor aldersforskjell |
| Life rhythm conflict | Inkompatible livsrytmer | F.eks. nattfugl vs tidlig opp |
| Explicit preferences | Motsatte preferanser | Direkte konflikter i grunnleggende ønsker |
| Boundary violations | Grense-brudd | En parts grenser blir krenket av den andres profil |

**MERKE:** Ingen bilder brukes i matching. Kun dyp-profil data.

### 1.5 Score-Tiering og ResonanceLevel

| Tier | normalizedScore | Prisma ResonanceLevel |
|------|-----------------|----------------------|
| `deepResonance` | ≥ 0.85 | `DEEP` |
| `strongResonance` | ≥ 0.70 | `STRONG` |
| `moderateResonance` | ≥ 0.55 | `MODERATE` |
| `gentleResonance` | ≥ 0.40 | `GENTLE` |
| `weakResonance` | < 0.40 | Ingen match sendes |

### 1.6 Match-Tid og Begrensninger (`config/matching.ts`)

| Konfigurasjon | Verdi | Beskrivelse |
|---------------|-------|-------------|
| `MATCH_DELAY_HOURS` | 24 | Minimum mellom matcher |
| `MAX_MATCHES_PER_DAY` | 1 | Maksimalt én match per 24 timer |

**Enforcement (`findBestResonance.ts` — `isUserMatchable()`):**
```ts
function isUserMatchable(user) {
  // 1. Onboarding må være fullført
  if (!user.onboardingComplete) return false;
  
  // 2. 30-dagers lock (lockedUntil)
  if (user.lockedUntil && user.lockedUntil > now()) return false;
  
  // 3. 24 timer siden siste match (lastMatchAt)
  if (user.lastMatchAt && hoursSince(user.lastMatchAt) < 24) return false;
  
  return true;
}
```

### 1.7 Edge Cases i Matching

| Tilfelle | Håndtering |
|----------|-----------|
| Ingen kandidater tilgjengelig | Returner `null` (ingen match denne runden) |
| Alle kandidater er dealbreakers | Returner `null` |
| Flere kandidater med samme score | Tiebreaker: randomiser eller eldste profil først |
| Bruker uten full onboarding | Blokkeres av `isUserMatchable()` |
| 30-dagers lock (lockedUntil) | Blokkeres av `isUserMatchable()` |

---

## 2. JOURNEY — 30-DAGERS GUIDET REISE

### 2.1 Arkitektur

```
┌──────────────────────────────────────────────┐
│  JourneyStart (etter matching)                │
│    ↓                                          │
│  DAY 1 → EARLY ("Bli kjent")                  │
│    ↓ (advanceOneDay per dag)                   │
│  DAY 14 → siste dag av EARLY                  │
│    ↓ (fase-endring)                            │
│  DAY 15 → BUILDING_TRUST ("Bygger tillit")     │
│         📸 Bilder blir tilgjengelige           │
│    ↓                                           │
│  DAY 21 → siste dag av BUILDING_TRUST          │
│    ↓ (fase-endring)                            │
│  DAY 22 → DEEPER ("Djupere samvær")            │
│    ↓                                           │
│  DAY 30 → reisens slutt                        │
│    ↓                                           │
│  JourneyComplete → Fortsett-valg (continueA/B) │
└──────────────────────────────────────────────┘
```

### 2.2 Fasekonfigurasjon (`lib/journey/engine.ts:PHASE_CONFIGS`)

| Fase | Enum | Dager | Tittel | Bilder | Beskrivelse |
|------|------|-------|--------|--------|-------------|
| EARLY | `EARLY` | 1-14 | "Bli kjent" | ❌ Nei | "Denne delen av reisen er uten bilder." |
| BUILDING_TRUST | `BUILDING_TRUST` | 15-21 | "Bygger tillit" | ✅ Ja (fra dag 15) | "Nå kan dere se hverandres bilder. Ta det rolig." |
| DEEPER | `DEEPER` | 22-30 | "Djupere samvær" | ✅ Ja | "Dypere samtaler. Kjenne etter retning og forventninger." |

**MERKE:** `CHECKIN` eksisterer i Prisma-enum men brukes **ikke** i kode. Reisen slutter på dag 30 i DEEPER-fasen.

### 2.3 Tema-progresjon (5 temaer over 30 dager)

| Periode | Tema | Fokus |
|---------|------|-------|
| Dag 1-6 | Intro | Overflate, grunnleggende samtaler, trygghet |
| Dag 7-12 | Trygghet | Dypere tillit, verdier, forventninger |
| Dag 13-18 | Fordypning | Bilder (fra dag 15), livsstil, personlighet |
| Dag 19-24 | Modning | Intimitet, relasjonsstil, emosjonelle behov |
| Dag 25-30 | Integrasjon | Fremtidsvisjon, retning, avgjørelse |

### 2.4 Day Advancement Logic

**In-memory (`lib/journey/engine.ts`):**
```ts
function advanceOneDay(userId, matchId, progressStore) {
  const progress = progressStore.get(userId);
  if (!progress || progress.currentDay >= JOURNEY_TOTAL_DAYS) return;
  
  // Inkrementer dag
  const previousDay = progress.currentDay;
  progress.currentDay++;
  progress.completedDays.push(previousDay);
  
  // Sjekk om bilder skal låses opp
  if (progress.currentDay >= 15 && !progress.photosEnabled) {
    progress.photosEnabled = true;
  }
  
  // Oppdater fase basert på dag
  progress.phase = getPhaseForDay(progress.currentDay);
}
```

**Database (`lib/match/journeySync.ts`):**
- Syncer in-memory state til Prisma `JourneyProgress`-tabell
- Oppdaterer `phase`, `day`, `completedDays`, `nextDayAt`
- Oppretter `JourneyMilestone` for hver fullført dag

### 2.5 JourneyProgress Modell (Oppsummering)

| Felt | Type | Formål |
|------|------|--------|
| `phase` | JourneyPhase | Nåværende fase (EARLY/BUILDING_TRUST/DEEPER) |
| `day` | Int (1-30) | Nåværende dag |
| `completedDays` | Int | Antall fullførte dager |
| `nextDayAt` | DateTime? | Når neste dag blir tilgjengelig |
| `startedAt/endedAt` | DateTime | Timeline |
| `pausedAt/resumedAt` | DateTime? | Pause-funksjonalitet |
| `completedAt` | DateTime? | Reise fullført |
| `continueA/B` | String? | Fortsett-valg per bruker (ja/nei/kanskje) |

### 2.6 Filoversikt (lib/journey/)

| Fil | Formål |
|-----|--------|
| `engine.ts` | Journey-engine (phase config, day advancement, phase transitions) |
| Øvrige filer i lib/journey/ | Støttefunksjoner for reise-guiding |

**Relaterte filer:**
| Fil | Formål |
|-----|--------|
| `lib/journeyEvents.ts` | Reise-hendelser (dag fullført, fase-endring, etc.) |
| `lib/journeyStore.ts` | In-memory state management for journey |
| `lib/journeyTasks.ts` | Oppgaver per dag i reisen |

### 2.7 Edge Cases i Journey

| Tilfelle | Håndtering |
|----------|-----------|
| Bruker hopper over dager | `nextDayAt` blokkerer fremtidige dager; brukeren må vente |
| Pause i reisen | `pausedAt` settes, `advanceOneDay` stoppes |
| Gjenoppta etter pause | `resumedAt` settes, reise fortsetter fra nåværende dag |
| Dag > 30 | Cap ved `JOURNEY_TOTAL_DAYS = 30`; ingen inkrementering |
| Fase-endring på grensedager | `getPhaseForDay(day)` sjekker dag-intervall |
| Ingen match enda | Journey starter kun etter matching; før det er status `NOT_STARTED` |
| Bruker velger å avslutte tidlig | `endedAt` settes, `exit/route.ts` håndterer clean exit |

---

## 3. INTEGRASJON: MATCHING → JOURNEY

### 3.1 Sekvens

```
1. Cron-kjøring (matching-cron)
   ↓
2. findBestResonance() finner beste match for hver brukeren
   ↓
3. Match opprettes i DB (status: active, resonanceLevel satt)
   ↓
4. Conversation opprettes mellom userA og userB
   ↓
5. JourneyProgress opprettes for begge (day: 1, phase: EARLY)
   ↓
6. Notifikasjon sendes ("Du har fått en match!")
   ↓
7. Bruker starter reisen via /dashboard eller /reisen
```

### 3.2 Cron-Jobbler

| Cron | Hyppighet | Oppgave |
|------|-----------|---------|
| `matching-cron` | Daglig (00:00) | Kjør matching for alle matchable brukere |
| `journey-cron` | Daglig (08:00) | Avancer dager i aktive reiser, sjekk fase-endringer |

---

## 4. BEGRENSNINGER OG ANBEFALINGER

### 4.1 Nåværende Begrensninger

| Begrensning | Påvirkning |
|-------------|-----------|
| `CHECKIN` enum er ubrukt | Ingen funksjonell påvirkning, men forvirrende i schema |
| Ingen CHECK constraint på `day` (Prisma v5) | Validering skjer kun i API-lag; teoretisk mulighet for dag > 30 |
| Dealbreakers er hardcoded | Kan ikke konfigureres uten kode-endring |
| Matching bruker kun deep-profile data | Inkluderer ikke chat-historikk eller oppførsel |

### 4.2 Anbefalinger

1. **Fjern `CHECKIN` fra enum** eller implementer CHECKIN-fasen (dag 31+)
2. **Migrer til Prisma v6+** for CHECK constraint på `day ∈ [1, 30]`
3. **Gjør dealbreakers konfigurerbare** via database eller env-vars
4. **Legg til matching-feedback loop**: bruk resultatet av reiser (fortsett/avslutt) for å forbedre scoring

---

*Dokument generert som del av full system audit & hardening plan (DEL 3).*