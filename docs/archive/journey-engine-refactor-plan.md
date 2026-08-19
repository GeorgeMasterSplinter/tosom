# ToSom — Journey Engine Refaktor (Punkt 7)

## Status: Analyse fullført, refaktor postponed

**Problem:** `lib/journey/engine.ts` er en monster-fil på **1061 linjer** som inneholder alt journey-relatert.

---

## Nåværende struktur (én fil, 1061 linjer)

```
engine.ts (1061 linjer)
├── TYPE DEFINISJONAR (~30-180)
├── KONSTANTAR (~183-243) — PHASE_CONFIGS, THEME_RANGES, PHASE_LABELS
├── HJELPEFUNKSJONAR (~244-309) — getPhaseOrder, getPhaseName, getPhaseForDay...
├── MILEPÆLS-FUNKSJONAR (~310-385) — MILESTONE_MESSAGES (7 milepæler)
├── BUILD JOURNEY STATE (~387-478) — buildJourneyState(), buildMessages()
├── MATCH STATE HELPERS (~480-487) — dummyMatchContext
├── USER PROGRESS (~489-579) — getUserProgress, advanceOneDay, resetUserProgress...
├── RESONANCE MOTOR (~581-692) — calculateResonance, createResonanceSnapshot...
├── WARMTH MOTOR (~694-774) — calculateWarmScore, addWarmHistoryEntry...
├── SILENT MOMENTS MOTOR (~776-840) — detectSilence, getRandomSilentMoment...
├── DAY TEXTS 30 DAGAR (~842-973) — dayData (30 dager × ~5 felt hver)
├── JOURNEY IMPULSE (~935-973) — getJourneyImpulse() for dag 1-30
├── FIRST MESSAGE (~975-991) — generateFirstMessage()
└── JOURNEY API (~993+) — journeyAPI objek med alle exports
```

---

## Foreslått modulstruktur (6 filer)

```
lib/journey/
├── engine.ts (~100 linjer)       — Orkestrering, buildJourneyState(), imports fra alle moduler
├── types.ts                       — JourneyState, JourneyTask, MatchState, ResonanceInput/Scores o.l.
├── phases.ts                      — PHASE_CONFIGS, THEME_RANGES, MILESTONES, getPhaseForDay, isPhotosAllowed
├── resonanceCalculator.ts         — calculateResonance(), createResonanceSnapshot(), getPhaseResonanceBias()
├── warmthCalculator.ts            — calculateWarmScore(), addWarmHistoryEntry(), calculateWarmTrend(), getWarmUI()
├── silenceDetection.ts            — detectSilence(), getRandomSilentMoment(), shouldTriggerSilentMoment()
└── dayContent.ts                  — dayData (30 dager), getDayConfig(), getJourneyImpulse(), generateFirstMessage()
```

---

## Hva som importerer fra engine.ts nå (7 filer)

| Fil | Importerer |
|-----|-----------|
| `lib/chat/chatFlow.ts` | `MatchState` |
| `components/journey/JourneyView.tsx` | `journeyAPI`, `buildJourneyState`, `dummyMatchContext` |
| `components/journey/JourneySummaryMini.tsx` | `journeyAPI` |
| `components/conversation/JourneyTimeline.tsx` | `journeyAPI` |
| `app/api/dashboard/overview/route.ts` | `JOURNEY_TOTAL_DAYS` |
| `app/api/dashboard/route.ts` | `JOURNEY_TOTAL_DAYS` |
| `app/api/journey/[conversationId]/route.ts` | `journeyAPI` |

---

## Hvorfor postponed?

1. **For stor refaktor for én sprint** — 6 nye filer + 1 oppdatert + 7 importoppdateringer = mye som kan gå galt
2. Mangler omfattende unit-tests på journey engine i dag
3. `journeyAPI`-objektet er brukt i 4+ komponenter og må bevares for backward compat

## Nødvendige stepr

### Steg 1: Skriv unit-tests først (MÅ PÅ)
Før refaktor, skriv tests for dagens funksjoner:
- `buildJourneyState(day=1)` → forventes EARLY-fase
- `calculateResonance({...})` → verifiser output
- `getJourneyImpulse(day=5)` → forventer tekst

### Steg 2: Bryt ut types.ts
Flytt type-definisjoner til `lib/journey/types.ts` — lav risiko, ingen endring i logikk.

### Steg 3: Bryt ut data-moduler
- `phases.ts` (konfig + milepæler)
- `dayContent.ts` (dag-data + impulser)

### Steg 4: Bryt ut beregnings-moduler
- `resonanceCalculator.ts`
- `warmthCalculator.ts`
- `silenceDetection.ts`

### Steg 5: Oppdater engine.ts og imports
Oppdater alle 7 filer som importerer. Sørg at `journeyAPI`-objektet eksporterer samme funksjoner som før.

### Steg 6: E2E-test
Kjør onboarding → match → journey dag 1→30 → fullført uten feil.

---

## OnboardingFlow Refaktor (sekundært)

`app/onboarding/OnboardingFlow.tsx` (~484 linjer + 13 step-komponenter) må også brytes ut til:
```
app/onboarding/steps/
├── Step1Profile.tsx
├── Step2Personlighet.tsx
├── ... (alle 13 steg i egne filer)
```

Lav risiko — ren flytting av komponenter. Ingen logikkendring.