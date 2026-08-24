# TOSOM SYSTEM BLUEPRINT (FOR MASTERSPLINTER)
Versjon 2.0 — synkronisert med dagens ToSom (2026-08-02)

---

## 1) DATAMODELL (PRISMA) — SANNHETEN

**Kjernemodellar:**
- `User` — brukarar, rolle, onboarding-status, verifikasjon
- `Profile` — dyp profil (verdier, livssituasjon, personlighet, etc.)
- `Match` — resonans-match mellom to brukarar
- `Conversation` — privat samtalerom mellom matchede par
- `Message` — enkelte meldinger i en conversation
- `JourneyProgress` — 30-dagers reise progresjon per bruker

**Administrasjonsmodellar:**
- `Notification` — brukernotifikasjoner
- `AuditLog` — admin-handlinger logget
- `SystemLog` — system-logging (info, warn, error, debug)
- `PerformanceMetric` — routelatens og db-latens

**Auth-modellar:**
- `Account` — OAuth-kontoer (Vipps, etc.)
- `Session` — aktive sessioner
- `VerificationToken` — e-post verifikasjonstokens
- `PasswordResetToken` — passord-tilbakestillings-tokens
- `MagicLinkToken` — magic link tokens
- `PhoneVerification` — telefonverifikasjon
- `TwoFactorSecret` — 2FA backup-koder

**AI-modellar:**
- `AIRequestLog` — AI-anrop logget (feature, model, tokens, latency)
- `MatchInsight` — AI-generert innsikt per match

**Journey-modellar:**
- `JourneyMilestone` — milepæler i reisen
- `ResonanceSession` — resonansmålinger per samtale+dag
- `JourneyStateLog` — state-endringer i conversation
- `JourneyDayContent` — daglige temaer/spørsmål/oppgaver (global konfig)

**Spørsmål-modellar:**
- `QuestionCategory` — guidede spørsmål-kategorier (Trygghet, Verdier, etc.)
- `GuidedQuestion` — enkelte guidede spørsmål

---

## 2) USER-MODELLEN

```prisma
model User {
  id                  String               @id @default(cuid())
  email               String               @unique
  name                String?              // Brukarnamn til visning
  password            String?
  phone               String?
  phoneVerified       Boolean              @default(false)
  onboardingStep      Int                  @default(1)
  onboardingComplete  Boolean              @default(false)
  deepProfileComplete Boolean              @default(false)
  role                Role                 @default(USER)
  verified            Boolean              @default(false)
  bannedAt            DateTime?
  deletedAt           DateTime?
  createdAt           DateTime             @default(now())
  updatedAt           DateTime             @updatedAt
  lastMatchAt         DateTime?
  lockedUntil         DateTime?

  accounts            Account[]
  auditLogs           AuditLog[]           @relation("AdminAuditLogs")
  conversationsA      Conversation[]       @relation("ConversationToUserA")
  conversationsB      Conversation[]       @relation("ConversationToUserB")
  journey             JourneyProgress?     @relation("UserJourney")
  matchesA            Match[]              @relation("UserAMatches")
  matchesB            Match[]              @relation("UserBMatches")
  messages            Message[]
  notifications       Notification[]
  resetTokens         PasswordResetToken[]
  profile             Profile?             @relation("UserProfile")
  sessions            Session[]
  twoFactor           TwoFactorSecret?

  @@index([role])
  @@index([email])
  @@index([lastMatchAt])
  @@index([lockedUntil])
}
```

**Kritisk:** Journey-data er på **User**, ikke på Conversation.

---

## 3) PROFILE-MODELLEN

```prisma
model Profile {
  id                String          @id @default(cuid())
  userId            String          @unique
  firstName         String?
  lastName          String?
  age               Int
  identityName      String?
  lifeSituation     Json?
  lifestyle         Json?
  personality       Json?
  relationshipStyle String?
  communication     Json?
  intimacy          Json?
  futureVision      Json?
  boundaries        Json?
  emotionalNeeds    Json?
  lifeRhythm        String?
  maturityLevel     Int?
  securityLevel     String?
  photoUrl          String?
  bio               String?
  interests         String[]
  deepProfileStep   DeepProfileStep @default(IDENTITY)
  deepProfileData   Json?
  preferences       Json?
  matchTags         String[]
  createdAt         DateTime        @default(now())
  updatedAt         DateTime        @updatedAt
  user              User            @relation("UserProfile", fields: [userId], references: [id])

  @@index([userId])
  @@index([deepProfileStep])
  @@index([matchTags])
}
```

**Påkrevd onboarding (13 steg / 10 logiske grupper):**
Se seksjon 19 for full liste. `DeepProfileStep`-enumen har 9 verdier + SUMMARY, men implementasjonen bruker 13 step-komponenter med delte nummer (f.eks. Step2 har to under-steg).

---

## 4) MATCH-MODELLEN

```prisma
model Match {
  id               String          @id @default(cuid())
  userAId          String
  userBId          String
  status           MatchStatus     @default(active)
  score            Int             @default(0)
  normalizedScore  Float
  type             String          @default("pending")
  explanation      Json?
  scoringBreakdown Json?
  resonanceLevel   ResonanceLevel  @default(GENTLE)
  reviewed         Boolean         @default(false)
  acceptedByA      DateTime?
  acceptedByB      DateTime?
  lockedAt         DateTime?
  expiresAt        DateTime?
  rejectedByA      DateTime?
  rejectedByB      DateTime?
  rejectionReason  String?
  createdAt        DateTime        @default(now())
  updatedAt        DateTime        @updatedAt
  userA            User            @relation("UserAMatches", fields: [userAId], references: [id])
  userB            User            @relation("UserBMatches", fields: [userBId], references: [id])
  insights         MatchInsight?

  @@index([status])
  @@index([userAId])
  @@index([userBId])
  @@index([createdAt])
  @@index([expiresAt])
  @@index([score])
  @@index([normalizedScore])
}
```

**Resonans-nivåer:** GENTLE (0-49), MODERATE (50-69), STRONG (70-89), DEEP (90-100)
**Match-statusar:** pending, active, matched, expired, ended, unmatched

---

## 5) CONVERSATION-MODELLEN

```prisma
model Conversation {
  id                  String             @id @default(cuid())
  userAId             String
  userBId             String
  matchId             String?
  endedAt             DateTime?
  lastMessageAt       DateTime?
  lastMessagePreview  String?
  unreadCountA        Int                @default(0)
  unreadCountB        Int                @default(0)
  frozenAt            DateTime?
  frozenBy            String?
  createdAt           DateTime           @default(now())
  updatedAt           DateTime           @updatedAt
  imageShareAllowedAt DateTime?
  imageShared         Boolean            @default(false)
  userA               User               @relation("ConversationToUserA", fields: [userAId], references: [id])
  userB               User               @relation("ConversationToUserB", fields: [userBId], references: [id])
  stateLogs           JourneyStateLog[]
  messages            Message[]
  resonanceSessions   ResonanceSession[]

  @@index([userAId, userBId])
  @@index([matchId])
  @@index([endedAt])
  @@index([frozenAt])
  @@index([lastMessageAt])
  @@index([imageShareAllowedAt])
}
```

**Kritisk:** Conversation har **INGEN** direkte journey-relasjon. Journey er på User-nivå via `JourneyProgress`.

---

## 6) MESSAGE-MODELLEN

```prisma
model Message {
  id             String          @id @default(cuid())
  conversationId String
  senderId       String
  content        String
  type           MessageCategory @default(user)
  state          MessageState    @default(SENT)
  deliveredAt    DateTime?
  readAt         DateTime?
  deletedAt      DateTime?
  editedAt       DateTime?
  createdAt      DateTime        @default(now())
  updatedAt      DateTime        @updatedAt
  conversation   Conversation    @relation(fields: [conversationId], references: [id])
  sender         User            @relation(fields: [senderId], references: [id])

  @@index([createdAt])
}
```

---

## 7) JOURNEY-MODELLEN — USER-BASERT, 30 DAGAR

**Dette er den viktigaste endringa frå v1. JourneyProgress er på User, ikkje Conversation.**

```prisma
model JourneyProgress {
  id            String             @id @default(cuid())
  userId        String             @unique
  phase         JourneyPhase       @default(EARLY)
  day           Int                @default(1) // VALIDERING: dag >= 1 AND dag <= 30
  completedDays Int                @default(0)
  nextDayAt     DateTime?
  startedAt     DateTime           @default(now())
  endedAt       DateTime?
  pausedAt      DateTime?
  resumedAt     DateTime?
  completedAt   DateTime?
  continueA     String?            // Fortsett-text til bruker A
  continueB     String?            // Fortsett-text til bruker B
  updatedAt     DateTime           @updatedAt
  milestones    JourneyMilestone[]
  user          User               @relation("UserJourney", fields: [userId], references: [id])

  @@index([userId])
}
```

**Kritisk:** `journey.userAId` og `journey.userBId` finst **ikkje**. Bruk `conversation.userAId` og `conversation.userBId`.

---

## 8) JOURNEY-DAY-CONTENT (Global konfig)

```prisma
model JourneyDayContent {
  id                 String       @id @default(cuid())
  day                Int          @unique // 1-30
  theme              String
  phase              JourneyPhase
  reflectionQuestion String
  conversationPrompt String
  task               String?
  resonanceGoal      String
  systemMessage      String?
  createdAt          DateTime     @default(now())

  @@index([day])
}
```

---

## 9) FASAR OVER 30 DAGAR

| Fase | Dagar | Beskrivelse | Bilder? |
|------|-------|-------------|---------|
| **EARLY** | 1–14 | Bli kjent, lette spørsmål | ❌ Nei |
| **BUILDING_TRUST** | 15–21 | Tillit bygges, meir personleg | ✅ Ja (frå dag 15) |
| **DEEPER** | 22–30 | Djuop samtalar, verdier | ✅ Ja |

**CHECKIN-fase er fjerna.** Journey sluttar på dag 30 med DEEPER.

---

## 10) MILEPÆLAR (30 dagar)

| Dag | Hending |
|-----|---------|
| 3 | Refleksjon |
| 7 | Innsikt |
| 10 | Vendepunkt |
| 14 | Fordypning |
| 21 | Sammenheng |
| 28 | Modning |
| 30 | Avslutning |

---

## 11) JOURNEYSTATELOG-MODELLEN

```prisma
model JourneyStateLog {
  id              String       @id @default(cuid())
  conversationId  String
  fromState       JourneyState // NOT_STARTED → IN_PROGRESS → COMPLETED
  toState         JourneyState
  reason          String?      // "user_advances", "system_cron", "admin_reset"
  triggeredBy     String?      // "user_a", "user_b", "system", "admin"
  createdAt       DateTime     @default(now())

  @@index([conversationId])
  @@index([createdAt])
}
```

---

## 12) RESONANCESESSION-MODELLEN

```prisma
model ResonanceSession {
  id              String       @id @default(cuid())
  conversationId  String
  day             Int
  emotionalTone   String       // "open", "guarded", "deep", "surface"
  depthLevel      Int          // 1-3
  responseQuality String       // "thoughtful", "brief", "evading"
  mutualSharing   Boolean
  vulnerability   Boolean
  summary         String?
  createdAt       DateTime     @default(now())

  @@index([conversationId, day])
  @@index([conversationId])
}
```

---

## 13) ENUM-VERTY

```prisma
enum Role { USER, ADMIN }
enum JourneyPhase { EARLY, BUILDING_TRUST, DEEPER } // CHECKIN fjerna 2026-08-02
enum JourneyState { NOT_STARTED, IN_PROGRESS, COMPLETED, PAUSED }
enum DeepProfileStep { IDENTITY, LIFE_SITUATION, LIFESTYLE, PERSONALITY, RELATIONSHIP_STYLE, COMMUNICATION, INTIMACY, FUTURE_VISION, BOUNDARIES, SUMMARY }
enum ResonanceLevel { GENTLE, MODERATE, STRONG, DEEP }
enum MatchStatus { pending, active, matched, expired, ended, unmatched }
enum MessageCategory { user, system, continue_choice, image }
enum MessageState { SENT, DELIVERED, READ, DELETED }
enum AuditAction { USER_BAN, USER_UNBAN, USER_VERIFY, USER_DEACTIVATE, USER_ACTIVATE, CONTENT_DELETE, JOURNEY_RESET, CONVERSATION_FREEZE, ADMIN_LOGIN, TWOFA_ENABLE, TWOFA_DISABLE, ADMIN_SETTINGS_CHANGE, PASSWORD_RESET }
enum AIFeature { journeyGuidance, matchInsights, messageSuggestions, profileRewrite }
```

---

## 14) HVA SOM IKKE FINST (ALDRI BRUK DETTE)

### Fjernede modeller (2026-08-02):
- ~~`MatchFeedback`~~ — fjerna
- ~~`MatchHistory`~~ — fjerna
- ~~`MatchQueue`~~ — fjerna
- ~~`QueueStatus`~~ — enum fjerna

### Feil felt som ikkje finst:
- `journey.userAId` — Journey er på User, ikkje Conversation
- `journey.userBId` —同上
- `journey.progressDay` — Bruk `day` i JourneyProgress
- `conversation.journeyStep` — FINST IKKJE (fjerna)
- `conversation.journeyProgress` — FINST IKKJE (fjerna)
- `ConversationJourney` — modell finst ikkje

---

## 15) JOURNEY-SYSTEMET — RIKTIG MODELL

**Nøkkel:** JourneyProgress er på **User**, ikke Conversation.

### Finn brukerens journey:
```ts
const journey = await prisma.journeyProgress.findUnique({
  where: { userId }
});
```

### Finn aktuel conversation:
```ts
const conversation = await prisma.conversation.findFirst({
  where: {
    OR: [{ userAId: userId }, { userBId: userId }],
    endedAt: null
  }
});
```

### Riktig include-struktur for match:
```ts
include: {
  userA: { include: { profile: true } },
  userB: { include: { profile: true } },
}
```

---

## 16) MATCHING-SYSTEMET

- Én AI-funksjon i ToSom
- Gir **éin match per 24 timer**
- Basert på verdier, personlighet, relasjonsstil
- Aldri bilder, aldri swipe, aldri feed
- CRON-jobb kjøres daglig (f.eks. 06:00 UTC)

---

## 17) CHAT-SYSTEMET

Meldinger hentast via `Message`-modellen:
```ts
message.findMany({ where: { conversationId }, orderBy: { createdAt: "asc" } })
```

**Bilder:** Tillatt frå dag 15 (`journeyProgress.day >= 15`).

---

## 18) AUTH-SYSTEMET

Innloggingsmetodar:
- **Vipps OAuth** — Norsk OIDC/OAuth2 login (hovudmetode)
- **Magic Link** — E-post basert innlogging
- **Phone Verification** — SMS verifikasjonskode (valfritt)
- **2FA** — TOTP backup-koder (valfritt, via Settings → Security)

---

## 19) ONBOARDING — 13 STEG (oppdatert 2026-08-05, Punkt 8)

Onboarding er dyp profilbygging med 13 step-komponenter (nogle deler nummer):

| Steg | Fil | Mappede til DeepProfileStep |
|------|-----|---------------------------|
| 1 | Step1Profile.tsx | IDENTITY |
| 2a | Step2Livssituasjon.tsx | LIFE_SITUATION |
| 2b | Step2Personlighet.tsx | PERSONALITY |
| 3 | Step3Tilknytning.tsx | COMMUNICATION |
| 4 | Step4Kjærlighetsspråk.tsx | INTIMACY |
| 5a | Step5LivsstilVerdier.tsx | LIFESTYLE |
| 5b | Step5Relasjonsstil.tsx | RELATIONSHIP_STYLE |
| 6 | Step6FramtidVisjon.tsx | FUTURE_VISION |
| 7 | Step7HumorPersonlighet.tsx | (PERSONALITY — utvidet) |
| 8a | Step8Grenser.tsx | BOUNDARIES |
| 8b | Step8ModenNysgjerrighet.tsx | (BOUNDARIES — modenhet) |
| 9 | Step9Oppsummering.tsx | SUMMARY |
| 10 | Step10StartReisen.tsx | (avslutning/redirect) |

**Korreksjon:** Blueprint v2.0 sa "9 steg", men implementasjonen har 13 step-filer med delte nummer (to Step2, to Step5, to Step8). Dette er business decision — dypere onboarding gir bedre profiler og bedre matching.

Lagrar i `Profile.deepProfileData` JSON og `Profile.deepProfileStep`.

---

## 20) CANONICAL API-RUTER (2026-08-02 oppdatert)

### Journey:
| Metode | Rute | Formål |
|--------|------|--------|
| GET | `/api/journey/today` | Hent dagens innhald |
| POST/GET | `/api/journey/progress` | Hent/advance progresjon |
| POST | `/api/journey/reflect` | Lag refleksjon |
| GET | `/api/journey/[conversationId]` | Hent journey state (GET berre) |

### Chat:
| Metode | Rute | Formål |
|--------|------|--------|
| POST | `/api/chat/send` | Send melding |
| POST | `/api/conversation/create` | Opprett ny conversation |

### Match:
| Metode | Rute | Formål |
|--------|------|--------|
| POST | `/api/match/accept` | Aksepter match |
| GET | `/api/match` | Hent aktive matcher |

---

## 21) VIDARE ARBEID (OBLIGATORISK STRATEGI)

1. Når du jobbar med journey: Bruk `JourneyProgress` på **User-nivå** (`userId`).
2. Når du jobbar med brukarar i ein journey: Bruk `conversation.userAId` og `conversation.userBId`.
3. Når du ser mismatch mellom kode og schema: **Schema er fasit**.
4. Alltid sjekk mot denne blueprinten før du endrar noko.
5. Journey varer i **30 dagar**, ikkje 35.
6. Fase-config: EARLY=1-14, BUILDING_TRUST=15-21, DEEPER=22-30.

---

*Versjon 2.0 — oppdatert 2026-08-02 (synkronisert med Prisma schema og core-dokumentasjon)*
*Versjon 1.0 fjerna: Journey på Conversation, JourneyStep, MatchQueue, 35-dagers reise*

---

SLUTT PÅ BLUEPRINT