# ToSom — Schema Overview (v2026)

> **DEL 2a av full system audit.**  
> Komplett dokumentasjon av Prisma-data modellen.

---

## 1. MODELLER (19 modeller + 15 enums)

### 1.1 Kjerne-modeller

#### User
Hovedbrukermode. Alle brukere har en rad i User-tabellen.

| Felt | Type | Default | Beskrivelse |
|------|------|---------|-------------|
| `id` | String (cuid) | Auto | Primærnøkkel |
| `email` | String (unique) | - | E-postadresse |
| `name` | String? | null | Visningsnavn |
| `password` | String? | null | Passord-hash (SHA256 for dev, bcrypt i prod) |
| `phone` | String? | null | Telefonnummer |
| `phoneVerified` | Boolean | false | Telefon verifisert |
| `onboardingStep` | Int | 1 | Nåværende onboarding-steg (1-9) |
| `onboardingComplete` | Boolean | false | Onboarding fullført |
| `deepProfileComplete` | Boolean | false | Dyp-profil fullført |
| `role` | Role | USER | Rolle (USER/ADMIN/SUPPORT) |
| `verified` | Boolean | false | E-post verifisert |
| `bannedAt` | DateTime? | null | Bane-tidspunkt |
| `deletedAt` | DateTime? | null | Soft-delete tidspunkt |
| `createdAt` | DateTime | now() | Opprettet |
| `updatedAt` | DateTime | auto | Sist oppdatert |
| `lastMatchAt` | DateTime? | null | Siste match-tidspunkt (24h-lock) |
| `lockedUntil` | DateTime? | null | 30-dagers lock |

**Indekser:** `[role]`, `[email]`, `[lastMatchAt]`, `[lockedUntil]`

**Relasjoner til:** Account[], Session[], Profile?, JourneyProgress?, Match[] (UserA), Match[] (UserB), Conversation[] (UserA), Conversation[] (UserB), Message[], Notification[], TwoFactorSecret?

---

#### Profile
Dyp profil med onboarding-data. 1:1 med User.

| Felt | Type | Default | Beskrivelse |
|------|------|---------|-------------|
| `id` | String (cuid) | Auto | Primærnøkkel |
| `userId` | String (unique) | - | Ref til User |
| `firstName` | String? | null | Fornavn |
| `lastName` | String? | null | Etternavn |
| `age` | Int | - | Alder (required, TODO: burde være non-nullable) |
| `identityName` | String? | null | Identitetsnavn |
| `lifeSituation` | Json? | null | Livssituasjon |
| `lifestyle` | Json? | null | Livsstil |
| `personality` | Json? | null | Personlighet |
| `relationshipStyle` | String? | null | Relasjonsstil |
| `communication` | Json? | null | Kommunikasjon |
| `intimacy` | Json? | null | Intimitet |
| `futureVision` | Json? | null | Fremtidsvisjon |
| `boundaries` | Json? | null | Grenser |
| `emotionalNeeds` | Json? | null | emosjonelle behov |
| `lifeRhythm` | String? | null | Livsrytme |
| `maturityLevel` | Int? | null | Modenhetnivå |
| `securityLevel` | String? | null | Trygghetsnivå |
| `photoUrl` | String? | null | Profilbilde |
| `bio` | String? | null | Kort beskrivelse |
| `interests` | String[] | [] | Interesser |
| `deepProfileStep` | DeepProfileStep | IDENTITY | Nåværende steg i dyp-profil |
| `deepProfileData` | Json? | null | Raw profildata |
| `preferences` | Json? | null | Match-preferanser |
| `matchTags` | String[] | [] | Tagger for matching |

**Indekser:** `[userId]`, `[deepProfileStep]`, `[matchTags]`

---

#### Match
Match mellom to brukere.

| Felt | Type | Default | Beskrivelse |
|------|------|---------|-------------|
| `id` | String (cuid) | Auto | Primærnøkkel |
| `userAId` | String | - | Bruker A |
| `userBId` | String | - | Bruker B |
| `status` | MatchStatus | active | Status |
| `score` | Int | 0 | Raw score |
| `normalizedScore` | Float | 0 | Normalisert score [0,1] |
| `type` | String | "pending" | Type match |
| `explanation` | Json? | null | Match-forklaring |
| `scoringBreakdown` | Json? | null | Poengfordeling |
| `resonanceLevel` | ResonanceLevel | GENTLE | Resonansnivå |
| `reviewed` | Boolean | false | Vurdert av admin |
| `acceptedByA/B` | DateTime? | null | Aksept-tidspunkt |
| `lockedAt` | DateTime? | null | Låst |
| `expiresAt` | DateTime? | null | Utløp |
| `rejectedByA/B` | DateTime? | null | Avslag |
| `rejectionReason` | String? | null | Avslagsårsak |

**Relasjoner til:** MatchInsight?, User (UserA), User (UserB)

---

#### Conversation
Konversasjon mellom to brukere.

| Felt | Type | Default | Beskrivelse |
|------|------|---------|-------------|
| `id` | String (cuid) | Auto | Primærnøkkel |
| `userAId` | String | - | Bruker A |
| `userBId` | String | - | Bruker B |
| `matchId` | String? | null | Ref til Match |
| `endedAt` | DateTime? | null | Avsluttet |
| `lastMessageAt` | DateTime? | null | Siste melding |
| `lastMessagePreview` | String? | null | Forhåndsvisning |
| `unreadCountA/B` | Int | 0 | Uleste tellere |
| `frozenAt` | DateTime? | null | Frøset (admin) |
| `frozenBy` | String? | null | Hvem frøs |
| `imageShareAllowedAt` | DateTime? | null | Bilde-deling tillatt fra |
| `imageShared` | Boolean | false | Bilde delt |

**Relasjoner til:** Message[], JourneyStateLog[], ResonanceSession[]

---

#### Message
Chat-melding.

| Felt | Type | Default | Beskrivelse |
|------|------|---------|-------------|
| `id` | String (cuid) | Auto | Primærnøkkel |
| `conversationId` | String | - | Konversasjon |
| `senderId` | String | - | Avsender |
| `content` | String | - | Innhold |
| `type` | MessageCategory | user | Kategori (user/system/continue_choice/image) |
| `state` | MessageState | SENT | Tilstand (SENT/DELIVERED/READ/DELETED) |
| `deliveredAt` | DateTime? | null | Levert |
| `readAt` | DateTime? | null | Lest |
| `deletedAt` | DateTime? | null | Slettet |
| `editedAt` | DateTime? | null | Redigert |

---

#### JourneyProgress
30-dagers reise per bruker.

| Felt | Type | Default | Beskrivelse |
|------|------|---------|-------------|
| `id` | String (cuid) | Auto | Primærnøkkel |
| `userId` | String (unique) | - | Ref til User |
| `phase` | JourneyPhase | EARLY | Nåværende fase |
| `day` | Int | 1 | Nåværende dag (1-30, validering i API-lag) |
| `completedDays` | Int | 0 | Fullførte dager |
| `nextDayAt` | DateTime? | null | Neste dag tilgjengelig |
| `startedAt` | DateTime | now() | Startet |
| `endedAt` | DateTime? | null | Avsluttet |
| `pausedAt/resumedAt` | DateTime? | null | Pause |
| `completedAt` | DateTime? | null | Fullført |
| `continueA/B` | String? | null | Fortsett-valg per bruker |

**MERKE:** CHECK constraint (`day >= 1 AND day <= 30`) er ikke implementert i Prisma v5. Må til med Prisma v6+.

---

### 1.2 Støtte-modeller

| Modell | Formål |
|--------|--------|
| `JourneyStateLog` | Logg over state-endringer i konversasjon (fromState → toState) |
| `JourneyMilestone` | Meletids-punkt per dag i reisen |
| `ResonanceSession` | Resonans-data per dag per konversasjon |
| `JourneyDayContent` | Innhold per dag i reisen (spørsmål, prompt, oppgave) |
| `QuestionCategory` | Kategorier for guidede spørsmål i chat |
| `GuidedQuestion` | Guidede spørsmål (15-20 per kategori) |

### 1.3 Auth-modeller

| Modell | Formål |
|--------|--------|
| `Account` | NextAuth v5 kontoer (OAuth providers) |
| `Session` | NextAuth v5 sessions |
| `VerificationToken` | E-post verifisering |
| `PasswordResetToken` | Passord-tilbakestillings-token |
| `MagicLinkToken` | Magic Link-token |
| `PhoneVerification` | Telefon-verifisering |
| `TwoFactorSecret` | 2FA-secret |

### 1.4 Admin & Observability-modeller

| Modell | Formål |
|--------|--------|
| `Notification` | Notifikasjoner til brukere |
| `AuditLog` | Audit-logg for admin-handlinger |
| `SystemLog` | System-logging (INFO/WARN/ERROR/DEBUG) |
| `PerformanceMetric` | Ytelsesmetrikker (api_latency, db_latency) |
| `AIRequestLog` | AI-request logging |
| `MatchInsight` | Match-insikt (AI-generert) |
| `SystemMessage` | System-meldinger (INFO/WARNING/ALERT) |

---

## 2. ENUMS (15 enums)

### 2.1 Core Enums

#### Role
| Verdi | Nivå | Beskrivelse |
|-------|------|-------------|
| `USER` | 1 | Standard bruker |
| `ADMIN` | 3 | Administrator |
| `SUPPORT` | 2 | Kundestøtte |

#### JourneyPhase
| Verdi | Dager | Beskrivelse |
|-------|-------|-------------|
| `EARLY` | 1-14 | Tidlig fase, ingen bilder |
| `BUILDING_TRUST` | 15-21 | Bygger tillit, bilder tillatt |
| `DEEPER` | 22-30 | Dypere fase |
| `CHECKIN` | - | Sjekk-in (eksisterer i enum, ubrukt i kode) |

#### DeepProfileStep (10 steg)
| Verdi | Steg | Beskrivelse |
|-------|------|-------------|
| `IDENTITY` | 1 | Identitet |
| `LIFE_SITUATION` | 2 | Livssituasjon |
| `LIFESTYLE` | 3 | Livsstil |
| `PERSONALITY` | 4 | Personlighet |
| `RELATIONSHIP_STYLE` | 5 | Relasjonsstil |
| `COMMUNICATION` | 6 | Kommunikasjon |
| `INTIMACY` | 7 | Intimitet & nærhet |
| `FUTURE_VISION` | 8 | Fremtidsønsker |
| `BOUNDARIES` | - | Grenser (kombinert med steget før) |
| `SUMMARY` | 9 | Oppsummering |

#### JourneyState
| Verdi | Beskrivelse |
|-------|-------------|
| `NOT_STARTED` | Ikke startet |
| `IN_PROGRESS` | Pågår |
| `COMPLETED` | Fullført |
| `PAUSED` | Pauset |

#### ResonanceLevel
| Verdi | Score-tilsvarende | Beskrivelse |
|-------|-------------------|-------------|
| `GENTLE` | < 0.40 | Svak resonans |
| `MODERATE` | 0.55 - 0.69 | Moderat resonans |
| `STRONG` | 0.70 - 0.84 | Sterk resonans |
| `DEEP` | ≥ 0.85 | Dyp resonans |

#### MatchStatus
| Verdi | Beskrivelse |
|-------|-------------|
| `pending` | Ventende |
| `active` | Aktiv |
| `matched` | Mottatt |
| `expired` | Utløpt |
| `ended` | Avsluttet |
| `unmatched` | Unmatched |

### 2.2 Chat Enums

#### MessageCategory
| Verdi | Beskrivelse |
|-------|-------------|
| `user` | Bruker-melding |
| `system` | System-melding |
| `continue_choice` | Fortsett-valg |
| `image` | Bilde-melding |

#### MessageState
| Verdi | Beskrivelse |
|-------|-------------|
| `SENT` | Sendt |
| `DELIVERED` | Levert |
| `READ` | Lest |
| `DELETED` | Slettet |

### 2.3 Admin Enums

#### AuditAction / AdminAction (10+ verdier)
Inneholder: USER_BAN, USER_UNBAN, USER_VERIFY, USER_DEACTIVATE, USER_ACTIVATE, CONTENT_DELETE, JOURNEY_RESET, CONVERSATION_FREEZE, SYSTEM_ALERT, SETTINGS_CHANGE + ekstra audit-spesifikke.

#### NotificationType
`MATCH`, `MESSAGE`, `JOURNEY`, `SYSTEM`, `ADMIN`

#### LogLevel
`INFO`, `WARN`, `ERROR`, `DEBUG`

### 2.4 System Enums

#### PerfMetric
`api_latency`, `db_latency`

#### AIFeature
`journeyGuidance`, `matchInsights`, `messageSuggestions`, `profileRewrite`

#### SystemMessageType
`INFO`, `WARNING`, `ALERT`

#### HttpMethod
`GET`, `POST`, `PUT`, `PATCH`, `DELETE`

---

## 3. RELASJONSDIAGRAM (Forenklet)

```
User (1) ──── (1) Profile
User (1) ──── (0..1) JourneyProgress ──── (0..*) JourneyMilestone
User (1) ──── (0..*) Account
User (1) ──── (0..*) Session
User (N) ──── (N) Match ──── (1) MatchInsight?
User (N) ──── (N) Conversation ──── (0..*) Message
Conversation (1) ──── (0..*) JourneyStateLog
Conversation (1) ──── (0..*) ResonanceSession
QuestionCategory (1) ──── (0..*) GuidedQuestion
User (1) ──── (0..*) Notification
User (1) ──── (0..*) AuditLog
```

---

*Dokument generert som del av full system audit & hardening plan (DEL 2a).*