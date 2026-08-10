# ToSom UI 5.0 — Emotional Intelligence Layer

**Dato:** 2026-06-20  
**Versjon:** 5.0  
**Status:** Ferdig

---

## 📋 Oppsummering

ToSom UI 5.0 er et **emosjonelt intelligenslag** som bygger på UI 4.0 (Experience Layer).  
UI 5.0 fokuserer på **AI-basert emosjonell analyse** — å gjøre ToSom til en relasjonsassistent.

---

## 🏗️ Arkitektur

```
┌─────┬─────┬─────┬─────────────┬─────┬─────┬─────┐
│     │     │     │  ToSom UI   │     │     │     │
│     │     │     │   5.0       │     │     │     │
│     │     │     │ Emotional   │     │     │     │
│     │     │     │ Intelligence│     │     │     │
├─────┴─────┴─────┴─────────────┴─────┴─────┴─────┤
│                                                  │
│  1. Core Types & Constants                    │  │
│  2. Tone Analyzer                             │  │
│  3. Mood Detection                              │  │
│  4. Emotional Suggestions                       │  │
│  5. Relationship Health Score                   │  │
│  6. Conflict De-escalation                      │  │
│  7. AI Memory Summaries                         │  │
│  8. Couple Insights Panel                       │  │
│  9. AI Journal Companion                        │  │
│  10. Emotional Exercises                        │  │
│  11. Templates 5.0                              │  │
│                                                  │
├─────┬─────┬─────┬─────────────┬─────┬─────┬─────┤
│     │     │     │  ToSom UI   │     │     │     │
│     │     │     │   4.0       │     │     │     │
│     │     │     │ Experience  │     │     │     │
│     │     │     │ Layer       │     │     │     │
├─────┴─────┴─────┴─────────────┴─────┴─────┴─────┤
│          ToSom UI 3.0 — Platform-Aware          │
└──────────────────────────────────────────────────┘
```

---

## 📦 Nye Komponenter (UI 5.0)

### 1. Core Types (`emotionTypes.ts`)

**20+ typer og konstanter for emosjonell intelligens:**

| Export | Beskrivelse |
|--------|-------|
| `ToneSignal` | { warmth, clarity, empathy, tension, vulnerability } |
| `Mood` | 12 stemningstyper (calm → connected) |
| `MoodSignal` | { mood, confidence, timestamp } |
| `moodPalettes` | Fargepalett per mood (color, gradient, emoji, label, desc) |
| `HealthDimension` | 5 dimensjoner (communication, emotionalSafety, curiosity, sharedGoals, connection) |
| `HealthSignal` | { dimension, score, trend, lastUpdated } |
| `EmotionalSuggestion` | { type, text, reason, warmth } |
| `DeescalationStepDef` | { title, description, icon, prompt } |
| `MemoryHighlight` | { id, type, summary, mood, date } |
| `ExerciseDef` | { type, title, description, prompt, duration, icon } |
| `ExerciseDefs` | 10 definerte øvelser |
| `journalPromptsByMood` | 12 prompts basert på stemning |
| `deescalationSteps` | 3 de-escalation steg |

### 2. Tone Analyzer (`toneMeter.tsx`)

**Visualiser emosjonell tone over 5 dimensjoner:**

- **Ring-visning** (lg): SVG-arc ringer i grid
- **Bar-visning** (md): Gradient progress bars med glow
- **Størrelser**: sm (96px), md (128px), lg (160px)
- **Auto-sammetekst** basert på tone-verdier

```typescript
import { ToneMeter, ToneMeterRing, ToneMeterBar } from '@/components/ui'

// Bar-variant
<ToneMeterBar tone={toneSignal} />

// Ring-variant
<ToneMeterRing tone={toneSignal} size="lg" showLabels />
```

### 3. Mood Detection (`moodTag.tsx`)

**12 stemninger med farge, emoji og animert glow:**

| Komponent | Beskrivelse |
|-----------|-------|
| `MoodTag` | Enkelt mood-badgen med glow-orb |
| `MoodGrid` | 4×3 grid av mood-knapper |
| `MoodHistory` | Horisontal tidslinje (siste 7) |
| `ChatMoodBadge` | Kompakt mood i chat |

```typescript
import { MoodTag, MoodGrid, MoodHistory, ChatMoodBadge } from '@/components/ui'

<MoodTag mood="warm" showDetail confidence={85} />
<MoodGrid currentMood="calm" onSelect={setMood} />
<MoodHistory moods={moodHistory} />
```

### 4. Emotional Suggestions (`emotionalSuggestions.tsx`)

**AI-genererte forslag med 3 kategorier:**

- **💌 "Prøv denne meldingen"**
- **❓ "Prøv dette spørsmålet"**
- **💛 "Prøv denne tryggheten"**

**Funksjoner:**
- StaggeredChildren animasjon
- GlowEffect per mood
- Varme-indikator per forslag
- Trykbar kort (copy-to-clipboard)

```typescript
import { EmotionalSuggestions, SuggestionCard } from '@/components/ui'

<EmotionalSuggestions
  suggestions={suggestions}
  mood="warm"
  onSelect={(s) => applySuggestion(s)}
/>
```

### 5. Relationship Health Score (`relationshipHealth.tsx`)

**5 dimensjoner med SVG-gauge + trend-piler:**

```typescript
import { RelationshipHealth, DimensionCard, OverallGauge, HealthSummary } from '@/components/ui'

<RelationshipHealth
  signals={healthSignals}
  overallScore={78}
  showSummary
/>
```

**Under-komponenter:**
- `OverallGauge` — Semi-cirkel SVG med glow
- `DimensionCard` — Mini-gauge + progress-bar per dimensjon
- `HealthSummary` — Samlet oppsummering med sterkest dimensjon
- `HealthSignal` — { dimension, score: 0-100, trend: 'up' | 'down' | 'stable' }

### 6. Conflict De-escalation (`deescalationPanel.tsx`)

**3-trinns guide for konflikthåndtering:**

1. 🔍 **Identifiser spenning**
2. 💛 **Valider følelser**
3. 🌉 **Foreslå bløtgjøring**

```typescript
import { DeescalationPanel } from '@/components/ui'

<DeescalationPanel
  currentStep={0}
  onComplete={(step) => console.log(step)}
/>
```

### 7. AI Memory Summaries (`memorySummary.tsx`)

**4 minne-typer gruppert i seksjoner:**

| Type | Emoji | Farge |
|------|-------|-------|
| connection | 🔗 | #F472B6 |
| growth | 🌱 | #34D399 |
| joy | ✨ | #FBBF24 |
| insight | 💡 | #A78BFA |

**Seksjoner:**
- **Emosjonelle høydepunkter** (joy + insight)
- **Øyeblikk av forbindelse** (connection)
- **Veksthøydepunkter** (growth)

```typescript
import { MemorySummary } from '@/components/ui'

<MemorySummary memories={highlights} title="Denne uken" />
```

### 8. Couple Insights Panel (`coupleInsights.tsx`)

**4 seksjoner med accordion-stil:**

| Seksjon | Ikon | Beskrivelse |
|---------|------|-------|
| communicationPatterns | 💬 | Kommunikasjonsmønstre |
| emotionalTrends | 🌊 | Emosjonelle trender |
| sharedValues | 💎 | Felles verdier |
| opportunities | 🌱 | Muligheter for vekst |

**Strength-indikatorer:**
- 🟢 Sterk (grønn)
- 🟡 Nøytral (gul)
- 🔴 Trenger oppmerksomhet (rosa)

```typescript
import { CoupleInsights } from '@/components/ui'

<CoupleInsights insights={coupleInsights} />
```

### 9. AI Journal Companion (`journalCompanion.tsx`)

**Typewriter-effect med AI-prompts basert på stemning:**

- Mood-selector grid (12 stemninger)
- Typewriter-animasjon for prompts
- Glassmorphism textarea
- Ordteller
- Soft gradient bakgrunn per mood

```typescript
import { JournalCompanion } from '@/components/ui'

<JournalCompanion
  mood="reflective"
  onSave={(text) => console.log(text)}
/>
```

### 10. Emotional Exercises (`emotionalExercise.tsx`)

**10 øvelser med timer og progress-indikator:**

| Øvelse | Duration | Emoji |
|--------|----------|-------|
| Gratitude | 2:00 | 🙏 |
| Nyskjerring | 3:00 | 🔍 |
| Sårbarhet | 3:00 | 💛 |
| Versetting | 2:00 | ⭐ |
| Fremtidssyn | 4:00 | 🗺️ |
| Dype spørsmål | 3:00 | ♡ |
| Stil stund | 1:00 | 🍃 |
| Delminne | 3:00 | 📸 |
| Drømmebygging | 4:00 | 🌟 |
| Kjærlighetsspråk | 3:00 | 💌 |

```typescript
import { EmotionalExercise } from '@/components/ui'

<EmotionalExercise
  onSelect={(exercise) => startExercise(exercise)}
/>
```

### 11. Templates 5.0 (`emotionTemplates.tsx`)

**3 oppdaterte maler med emosjonelle AI-lag:**

| Template | Funksjoner |
|----------|-------|
| `ChatTemplate5` | Mood-display, Tone-bar, AI-forslag-panel |
| `CoupleTemplate5` | Relasjons-helse, mood-display, quick-actions |
| `JourneyTemplate5` | Mood, minnehøydepunkter, reisefremgang |

```typescript
import { ChatTemplate5, CoupleTemplate5, JourneyTemplate5 } from '@/components/ui'

<ChatTemplate5 mood="warm" suggestions={suggestions} />
<CoupleTemplate5 healthSignals={healthSignals} mood="romantic" />
<JourneyTemplate5 mood="hopeful" memories={memories} />
```

---

## 📊 Kompleksitet

### Filantall per System

| System | Filer | Komponenter |
|--------|-------|-------|
| Core Types | 1 | 20+ typer + konstanter |
| Tone Analyzer | 1 | 3 komponenter |
| Mood Detection | 1 | 4 komponenter |
| Emotional Suggestions | 1 | 2 komponenter |
| Relationship Health | 1 | 4 komponenter |
| Conflict De-escalation | 1 | 1 hovedkomponent |
| Memory Summaries | 1 | 2 komponenter |
| Couple Insights | 1 | 2 komponenter |
| Journal Companion | 1 | 1 hovedkomponent |
| Emotional Exercises | 1 | 2 komponenter |
| Templates 5.0 | 1 | 3 maler |
| **Totalt** | **11 nye filer** | **~22 komponenter** |

### Total UI 5.0

| Versjon | Filer | Komponenter |
|---------|-------|-------|
| UI 3.0 | ~60 | ~400 |
| UI 4.0 | +8 | +50 |
| UI 5.0 | +11 | +22 |
| **Totalt** | **~79** | **~472** |

---

## 🎨 Designbeslutninger

### 1. Tone Analyzer bruker SVG-cirkler
Ingen eksterne bibliotek — rene SVG med stroke-dasharray/offset.
Animasjon via CSS transitions (duration-700).

### 2. Mood Tags har GlowOrb
Animert blur-orb bak hvert mood-tag for visuell dypde.
`opacity-15 blur-2xl` med `pulse` animation.

### 3. Emotional Suggestions bruker StaggeredChildren
Hvert kort kommer med cascading delay (0.1s per kort).
GlowEffect per mood-farge.

### 4. Relationship Health har SVG-gauges
Semi-cirkel SVG med stroke-basert progresjon.
Trend-piler (↑ ↓ →) med farge-koding.

### 5. De-escalation er stev-basert
3 klare steg med progress-indikator.
Hvert steg har egen ikon, tittel, beskrivelse, og prompt.

### 6. Memory Summaries er type-gruppert
4 minne-typer med ulik emoji/farge.
Automatisk gruppering i seksjoner.

### 7. CoupleInsights er accordion-basert
Kollapsibele seksjoner for fokus.
Strength-indikatorer per item.

### 8. Journal Companion har typewriter-effekt
AI-prompt vises karakter-for-karakter.
Mood-basert gradient-bakgrunn.

### 9. Emotional Exercises har timer
SVG-cirkulær progress med countdown.
Auto-complete når tid er ute.

### 10. Templates 5.0 integrerer alle lag
Chat: Mood + Tone + AI-forslag
Couple: Health + Mood + Quick-actions
Journey: Mood + Minner + Fremgang

---

## 🔧 Integrering

### Grunnleggende Setup
```typescript
// Hoved-app med AI-lag
import {
  ToneMeter, MoodTag, EmotionalSuggestions,
  RelationshipHealth, DeescalationPanel,
  MemorySummary, CoupleInsights, JournalCompanion,
  EmotionalExercise, ChatTemplate5,
} from '@/components/ui'

function App() {
  return (
    <div className="bg-[#0B0E11] min-h-screen">
      <ToneMeter tone={toneSignal} />
      <MoodTag mood="warm" showDetail />
      <EmotionalSuggestions suggestions={suggestions} />
      <RelationshipHealth signals={healthSignals} />
    </div>
  )
}
```

### Chat med Emosjonell AI
```typescript
// app/chat/page.tsx
import { ChatTemplate5 } from '@/components/ui'

function ChatPage() {
  return <ChatTemplate5 mood="warm" suggestions={aiSuggestions} />
}
```

### Couple Dashboard
```typescript
// app/couple/page.tsx
import { CoupleTemplate5 } from '@/components/ui'

function CouplePage() {
  return <CoupleTemplate5 healthSignals={signals} mood="romantic" />
}
```

### Journal Side
```typescript
// app/journal/page.tsx
import { JournalCompanion } from '@/components/ui'

function JournalPage() {
  return <JournalCompanion mood="reflective" onSave={saveJournalEntry} />
}
```

---

## 📐 Import-eksempler

### Alle UI 5.0-komponenter
```typescript
import {
  // Core
  moodPalettes, exerciseDefs, deescalationSteps,
  journalPromptsByMood,
  type Mood, type ToneSignal, type HealthSignal,
  type EmotionalSuggestion, type ExerciseType,
  type MemoryHighlight,

  // Tone
  ToneMeter, ToneMeterRing, ToneMeterBar,

  // Mood
  MoodTag, MoodGrid, MoodHistory, ChatMoodBadge,

  // Suggestions
  EmotionalSuggestions, SuggestionCard,

  // Health
  RelationshipHealth, DimensionCard, OverallGauge, HealthSummary,

  // De-escalation
  DeescalationPanel,

  // Memories
  MemorySummary,

  // Insights
  CoupleInsights,

  // Journal
  JournalCompanion,

  // Exercises
  EmotionalExercise,

  // Templates
  ChatTemplate5, CoupleTemplate5, JourneyTemplate5,
} from '@/components/ui'
```

---

## ✅ Kvalitetssikring

### ToSom-regler
- ✅ Ingen swiping-feed
- ✅ Ingen gamification
- ✅ Microcopy i ToSom-tone
- ✅ Nordic Dark Premium farger
- ✅ Glassmorphism-komponenter
- ✅ Ingen inline-styles (unntak: gradient backgrounds)
- ✅ Modulære komponenter
- ✅ Dokumentert i komponent-filer

### Testing
```bash
# Build
npm run build

# Type check
npx tsc --noEmit
```

---

## 🚀 Forslag til ToSom 5.1

### 1. Real-time Tone Detection
- Live tone-analyse under chatting
- Fargeendring basert på input
- AI-lesing av tekst før sending

### 2. Emotion-based Matching
- Match basert på emosjonell kompatibility
- Dybde-matching (ikke bare interests)
- Mood-synced dates

### 3. Relationship Timeline
- Visuell tidslinje av relasjonen
- AI-genererte milepæler
- Emosjonell utvikling over tid

### 4. Weekly Emotional Report
- Ukesvisning av stemninger
- AI-samlet innspill
- Vekst-sporing

### 5. Shared Emotional Space
- Felles visuell representasjon
- Mood-meldinger mellom partnere
- Emosjonell dialog

### 6. Voice Tone Analysis
- Stemme-tonde AI
- Intonasjon-analyse
- Varme i stemme

---

## 📝 Oppsummering

ToSom UI 5.0 legger til:
- ✅ Core types & konstanter (20+ typer)
- ✅ Tone Analyzer (5 dimensjoner)
- ✅ Mood Detection (12 stemninger)
- ✅ Emotional Suggestions (3 kategorier)
- ✅ Relationship Health Score (5 dimensjoner)
- ✅ Conflict De-escalation (3 steg)
- ✅ AI Memory Summaries (4 typer)
- ✅ Couple Insights Panel (4 seksjoner)
- ✅ AI Journal Companion (typewriter)
- ✅ Emotional Exercises (10 øvelser)
- ✅ Templates 5.0 (3 maler)

**Totalt:** 11 nye filer, ~22 komponenter, 0 nye avhengigheter.

---

*ToSom UI 5.0 — Emotional Intelligence Layer*