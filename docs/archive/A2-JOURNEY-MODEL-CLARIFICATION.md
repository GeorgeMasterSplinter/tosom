# Fase A3 — Journey Model-avklaring

**Dato:** 2026-07-10  
**Status:** Dokumentert — ingen database-endring trengst

## 1. Oversikt

ToSom har **tre** Journey-relaterte modeller som alle har med 30-dagers reisen å gjøre:

| Modell | Formål | Nivå |
|--------|--------|------|
| `JourneyProgress` | Brukerens overordna 30-dagers reise (phase, day, completedDays) | **Per bruker** |
| `JourneyStep` | En spesifikk dag i en spesifikk konversasjon | **Per konversasjon** |
| `JourneyDayContent` | Seed-data for tema (1-30 dager) | **Konfigurasjon** |

## 2. JourneyProgress (sanning for progresjon)

```prisma
model JourneyProgress {
  id           String       @id @default(cuid())
  userId       String       @unique
  phase        JourneyPhase @default(EARLY)
  day          Int          @default(1)
  completedDays Int          @default(0)
  nextDayAt    DateTime?
  startedAt    DateTime     @default(now())
  endedAt      DateTime?
  pausedAt     DateTime?
  resumedAt    DateTime?
  completedAt  DateTime?
  continueA    String?
  continueB    String?
  updatedAt    DateTime     @updatedAt
}
```

**Brukt av:**
- `lib/match/journeySync.ts` — oppdater dag, fase-skifte
- `lib/journey/journeyEngine.ts` — opprett, transition phase
- `lib/journey/getJourneyState.ts` — les state
- `app/api/journey/[id]/advance/route.ts` — advance-day API
- `lib/dashboard/data.ts` — dashboard-visning av progress
- Admin-panel — oversikt

**Dette er "sanning"** for kor langt brukeren har kommen i reisen.

## 3. JourneyStep (konversasjon-spesifikk)

```prisma
model JourneyStep {
  id             String        @id @default(cuid())
  conversationId String        @unique
  phase          JourneyPhase
  order          Int
  title          String
  description    String
  dynamic        Boolean       @default(false)
  isSystemMessage Boolean      @default(false)
  systemMessage  String?
  createdAt      DateTime      @default(now())
}
```

**Brukt av:**
- `lib/dashboard/data.ts` — `getJourneyStatus(conversationId)` (bare les)
- Systemet opprettar en JourneyStep når ei ny konversasjon startar

**Dette er "detalj"** for hver spesifikk reise/konversasjon.

## 4. JourneyDayContent (seed-data)

```prisma
model JourneyDayContent {
  id              String   @id @default(cuid())
  day             Int      // 1-30
  theme           String
  phase           JourneyPhase
  reflectionQuestion String
  conversationPrompt String
  task            String?
  resonanceGoal   String
  systemMessage   String?
}
```

**Brukt av:**
- Bare seed-data (ingen direkte kodebruk)
- Kan erstattast med hardkoda data i en JSON-fil

## 5. Samanheng mellom modellene

```
Bruker → JourneyProgress (phase, day 1-30)
    ↓
Match → Conversation → JourneyStep (dag for denne konversasjonen)
    ↓
Når dag skiftar → Oppdater JourneyProgress.day++
    ↓
Systemet les JourneyStep for å finne tema/oppgåve for dag X
    ↓
Dersom JourneyDayContent finnes: bruk theme fra seed-data
Dersom ikke: bruk hardkoda tema (day 1-30)
```

## 6. Konklisjon

**Ingen modellbehov.** Men følgjande bør dokumenterast for framtida:

1. **JourneyProgress er "sanning"** — den representerer brukerens totale framgang
2. **JourneyStep er "detaljer"** — en per konversasjon med same match
3. **JourneyDayContent er valfritt** — seed-data kan erstattast med hardkoda JSON

## 7. Anbefaling for Fase A

- ✅ Hold alle tre modellene i schema.prisma
- ✅ Oppdater docs/tosom-blueprint.md med denne avklaringa
- ⚠️ Vær obs på at `continueA` og `continueB` ligg på `JourneyProgress`, ikke `JourneyStep`

## 8. Bekreftelse

Ved å lese denne dokumentasjonen har eg forstått skilnaden mellom JourneyProgress og JourneyStep, og veit hvem som er "sanning" i hver kontekst.