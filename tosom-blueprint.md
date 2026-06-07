# TOSOM SYSTEM BLUEPRINT (FOR MASTERSPLINTER)
Versjon 1.0 — kodeorientert fasit

## 1) Datamodell (Prisma) — SANNHETEN

```prisma
model Conversation {
  id              String            @id @default(cuid())
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt

  userAId         String
  userBId         String

  userA           User              @relation("UserAConversations", fields: [userAId], references: [id])
  userB           User              @relation("UserBConversations", fields: [userBId], references: [id])

  messages        Message[]

  journeyStep     JourneyStep?      @relation("ConvToStep")
  journeyProgress JourneyProgress?  @relation("ConvToProgress")
}

model JourneyStep {
  id              String          @id @default(cuid())
  conversationId  String?         @unique
  conversation    Conversation?   @relation("ConvToStep", fields: [conversationId], references: [id])

  phase           JourneyPhase
  order           Int
  title           String
  description     String
  isSystemMessage Boolean         @default(false)
  systemMessage   String?
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt
}

model JourneyProgress {
  id              String          @id @default(cuid())
  conversationId  String?         @unique
  conversation    Conversation?   @relation("ConvToProgress", fields: [conversationId], references: [id])

  phase           JourneyPhase
  totalSteps      Int
  completedSteps  Int
  updatedAt       DateTime        @updatedAt
}
```

**VIKTIG:**
- `userAId`/`userBId` ligg i `Conversation`.
- Journey-data ligg i `Conversation.journeyStep` og `Conversation.journeyProgress`.
- Det finst **INGEN** `ConversationJourney`-modell.

## 2) Kva som IKKE finst (ALDRI bruk dette)

- `ConversationJourney` (modell finst ikkje)
- `journey.userAId`
- `journey.userBId`
- `journey.progressDay`
- `journey.day`
- `journey.progress`
- `journey.*` som ikkje eksplisitt finst i `JourneyStep` eller `JourneyProgress`
- `include.userA` / `include.userB` under journey

## 3) Journey-systemet — RIKTIG MODELL

- **Nåværende steg:** `conversation.journeyStep`
- **Progresjon:**
  - `conversation.journeyProgress.phase`
  - `conversation.journeyProgress.completedSteps`
  - `conversation.journeyProgress.totalSteps`
- **Kven som er i samtalen:** `conversation.userAId`, `conversation.userBId`

## 4) Match-systemet

Når to brukarar matches:
- `Conversation` opprettast med `userAId` og `userBId`.
- `journeyStep` og `jourourneyProgress` kan opprettast for denne conversationen.

Riktig include-struktur:
```ts
include: {
  userA: true,
  userB: true,
  journeyStep: true,
  journeyProgress: true,
}
```

## 5) Chat-systemet

Meldingar hentast via `Message`-modellen:
```ts
message.findMany({ where: { conversationId }, orderBy: { createdAt: "asc" } })
```

## 6) Onboarding

Onboarding er frontend-state. Backend treng ikkje eigne onboarding-felt i schema.

## 7) Deprecated (skal ALDRI brukast vidare)

Rydd bort og erstatt alle referansar til:
- `ConversationJourney`
- `journey.userAId`, `journey.userBId`
- `journey.progressDay`, `journey.day`, `journey.progress`
- `include.userA` / `include.userB` under journey
- Alle `journey.*`-felt som ikkje finst i `JourneyStep` eller `JourneyProgress`

## 8) Vidare arbeid (OBLIGATORISK STRATEGI)

1. Når du jobbar med journey: Bruk kun `Conversation.journeyStep` og `Conversation.journeyProgress`.
2. Når du jobbar med brukarar i ein journey: Bruk `Conversation.userAId` og `Conversation.userBId`.
3. Når du ser mismatch mellom kode og schema: **Schema er fasit**.
4. Alltid sjekk mot denne blueprinten før du endrar noko.

---
SLUTT PÅ BLUEPRINT

NESTE STEG:
- Bekreft at du har lest og forstått denne blueprinten.
- Bruk den som fasit for alle vidare refaktoreringar, spesielt rundt journey-, match- og conversation-logikk.
