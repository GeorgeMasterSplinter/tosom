# ToSom — Journey Overview (v2026)

Denne filen beskriver den guidete 30-dagers reisen mellom to matchede mennesker.  
Les denne filen for å forstå journey-systemets struktur, faser, daglige innhold og resonansmåling.

---

## 1. REISENS FORMÅL

En guidet 30-dagers reise som hjelper to mennesker å bli kjent på en trygg, moden og fokusert måte.  
Hver dag har et tema, refleksjonsspørsmål, samtaleprompt og oppgave.

### Reiseløp
```
MATCH → AKSEPTÉR (Conversation opprettes) → DAG 1 → DAG 2 → ... → DAG 30 → FULLFØRT
```

---

## 2. FASEN I REISEN

ToSom reise består av to hovedfaser:

### Fase 1 — Introduksjon og Trygghet (Dag 1-14)
| Dag | Tema | Refleksjon | Oppgave | Resonansmål |
|-----|------|------------|---------|-------------|
| 1-3 | Identitet | Hvem er du? | Del en personlig historie | Bygg grunnleggende trygghet |
| 4-6 | Verdier | Hva betyr mest? | Diskuter en verdikonflikt | Forstå hverandres verdier |
| 7-9 | Livsstil | Hvordan lever du? | Sammenlign hverdager | Accepter forskjeller |
| 10-12 | Kommunikasjon | Hvordan uttrykker du deg? | Øv på aktiv lytting | Bygg kommunikasjonsbruk |
| 13-14 | Oppsummering fase 1 | Hva har lært? | Del innsikter | Stabilisere trygghet |

### Fase 2 — Dypere Samtaler og Sårbarhet (Dag 15-30)
| Dag | Tema | Refleksjon | Oppgave | Resonansmål |
|-----|------|------------|---------|-------------|
| 15-17 | Fremtid | Hva ønsker du? | Del fremtidsvisjoner | Aligne forventninger |
| 18-20 | Nærhet | Hva betyr nærhet? | Utforsk grenser | Bygg emosjonell intimitet |
| 21-23 | Sårbarhet | Hva frykter du? | Del en sårbar historie | Skape trygghet for sårbarhet |
| 24-26 | Relasjonsmønster | Hvordan møtes du i forhold? | Diskuter tidligere erfaringer | Forstå hverandres mønstre |
| 27-29 | Felles visjon | Hva vil dere skape? | Lag en felles plan | Bygg felles retning |
| 30 | Oppsummering | Hva har reisen gitt deg? | Skriv til partneren | Fullfør og reflekter |

---

## 3. DAGLIG STRUKTUR

Hver dag i reisen består av:

### 3.1 Tema
Enkel beskrivelse av dagens fokusområde. F.eks. "Trygghet", "Verdier", "Kommunikasjon".

### 3.2 Refleksjonsspørsmål
Et spørsmål brukeren svarer alene før samtale med partner:
> "Hva trenger du for å føle deg trygg i en ny relasjon?"

### 3.3 Samtaleprompt
Et spørsmål eller tema til samtale med partner:
> "Fortell partneren din når du føler deg mest trygg."

### 3.4 Oppgave (valgfri)
En liten praktisk oppgave:
> "Del en situasjon der du følte deg forstått av noen."

### 3.5 Resonansmål
Hva paret skal oppnå denne dagen:
> "Bygg emosjonell trygghet gjennom åpenhet"

---

## 4. TEKNISK IMPLEMENTASJON

### 4.1 Database-modeller

#### JourneyProgress
Lagrer progresjon per bruker:
```prisma
model JourneyProgress {
  id            String             @id @default(cuid())
  userId        String             @unique
  phase         JourneyPhase       @default(EARLY)
  day           Int                @default(1) // ⚠️ VALIDERING: dag >= 1 AND dag <= 30
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
}
```

#### JourneyMilestone
Lagre milepæler i reisen:
```prisma
model JourneyMilestone {
  id         String          @id @default(cuid())
  progressId String
  day        Int
  title      String
  summary    String
  createdAt  DateTime        @default(now())
  progress   JourneyProgress @relation(fields: [progressId], references: [id])
}
```

#### ResonanceSession
Måler resonans per conversation+dag:
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
}
```

#### JourneyStateLog
Logger state-endringer i en conversation:
```prisma
model JourneyStateLog {
  id              String       @id @default(cuid())
  conversationId  String
  fromState       JourneyState // NOT_STARTED → IN_PROGRESS → COMPLETED
  toState         JourneyState
  reason          String?      // "user_advances", "system_cron", "admin_reset"
  triggeredBy     String?      // "user_a", "user_b", "system", "admin"
  createdAt       DateTime     @default(now())
}
```

#### JourneyDayContent
Global dag-innhold (tema, spørsmål, oppgaver for dag 1-30):
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
}
```

### 4.2 Enums
```prisma
enum JourneyPhase {
  EARLY              // Dag 1-14
  BUILDING_TRUST     // Dag 15-21
  DEEPER             // Dag 22-28
  CHECKIN            // Dag 29-30
}

enum JourneyState {
  NOT_STARTED
  IN_PROGRESS
  COMPLETED
  PAUSED
}
```

---

## 5. API-ENDepUNKTER

### GET /api/journey/today
Hent dagens journey-innhold for aktuell bruker.

**Auth:** Required

**Response:**
```json
{
  "success": true,
  "data": {
    "day": 5,
    "phase": "EARLY",
    "theme": "Trygghet",
    "reflectionQuestion": "Hva trenger du for å føle deg trygg?",
    "conversationPrompt": "Fortell partneren din når du føler deg tryggest.",
    "task": "Del en situasjon der du følte deg forstått.",
    "resonanceGoal": "Bygg emosjonell trygghet"
  }
}
```

### GET /api/journey/progress
Hent progresjon for aktuell bruker.

**Auth:** Required

**Response:**
```json
{
  "success": true,
  "data": {
    "phase": "EARLY",
    "day": 5,
    "completedDays": 4,
    "startedAt": "2026-07-28T10:00:00Z",
    "nextDayAt": null,
    "canAdvance": true
  }
}
```

### POST /api/journey/progress/advance
Flytt til neste dag.

**Auth:** Required

**Response:**
```json
{
  "success": true,
  "data": {
    "day": 6,
    "phase": "EARLY",
    "message": "Dag 6 er klart. Nytt tema venter."
  }
}
```

### POST /api/journey/reflect
Lag refleksjon og mål resonans.

**Auth:** Required

**Body:**
```json
{
  "day": 5,
  "reflection": "Dagens refleksjon...",
  "emotionalTone": "open",
  "depthLevel": 2
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "resonanceSessionId": "res_123",
    "insight": "Dere viser god emosjonell åpenhet..."
  }
}
```

### GET /api/journey/resonance
Hent historiske resonansdata.

**Auth:** Required

**Response:**
```json
{
  "success": true,
  "data": {
    "sessions": [
      { "day": 1, "emotionalTone": "guarded", "depthLevel": 1 },
      { "day": 5, "emotionalTone": "open", "depthLevel": 2 }
    ],
    "trend": "improving"
  }
}
```

### GET /api/journey/check
Sjekk om reise er låst eller tilgjengelig.

**Auth:** Required

**Response:**
```json
{
  "success": true,
  "data": {
    "hasActiveJourney": true,
    "conversationId": "conv_xyz789",
    "journeyDay": 5,
    "phase": "EARLY",
    "canSendImages": false, // San etter dag 14
    "lockedUntil": null
  }
}
```

### POST /api/journey/exit
Avslutt reise.

**Auth:** Required

**Body:**
```json
{ "reason": "Valgfri grunn" }
```

**Response:**
```json
{ "success": true, "message": "Reisen er avsluttet." }
```

---

## 6. BILDE-SHARING ETTER 14 DAGER

### Regler for bilde-share:
- Dag 1-14: Bilder **anbefales ikke** (ikke obligatorisk)
- Dag 15+: Bilder **er tillatt** via chat

### Implementasjon i Conversation:
```prisma
model Conversation {
  // ...
  imageShareAllowedAt DateTime?   // Når blir bilder tillatt (dag 15)
  imageShared         Boolean     @default(false)  // Om bilde er delt
}
```

### API-validering for bilde-send:
```typescript
// I /api/chat/send route
const conversation = await prisma.conversation.findUnique({
  where: { id: conversationId }
});

const canSendImage = conversation.imageShared || 
  conversation.journeyProgress?.day > 14;

if (!canSendImage && messageType === 'image') {
  return error("Bilder kan ikke sendes før dag 15");
}
```

---

## 7. CRON-JOBB FOR JOURNEY

### Rutine: Daglig (f.eks. 06:00 UTC)
**Endepunkt:** `POST /api/cron/journey`

### Logikk:
```typescript
// Cron-jobb for journey-advancement
export async function handleJourneyCron() {
  // 1. Finn alle brukere med aktiv journey som ikke har advanced i dag
  const inactiveUsers = await prisma.journeyProgress.findMany({
    where: {
      day: { lt: 30 },
      pausedAt: null,
      endedAt: null
    },
    include: { user: true }
  });

  // 2. For hver bruker, advance dag hvis inaktiv > 24 timer
  for (const progress of inactiveUsers) {
    const lastAdvance = progress.nextDayAt || progress.updatedAt;
    if (lastAdvance < new Date(Date.now() - 24 * 60 * 60 * 1000)) {
      await prisma.journeyProgress.update({
        where: { userId: progress.userId },
        data: { 
          day: { increment: 1 },
          nextDayAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
        }
      });
    }
  }

  // 3. Sjekk expired journeys (ingen aktivitet > 7 dager)
  const expiredJourneys = await prisma.journeyProgress.findMany({
    where: {
      endedAt: null,
      day: { lt: 30 },
      updatedAt: { lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    }
  });

  for (const jp of expiredJourneys) {
    await prisma.journeyProgress.update({
      where: { id: jp.id },
      data: { endedAt: new Date(), phase: 'CHECKIN' }
    });
  }
}
```

---

## 8. JOURNEY UI-KOMPONENTER

### Nøddelkomponenter i `/components/journey/`:
| Komponent | Formål |
|-----------|--------|
| `JourneyDayCard.tsx` | Viser dagens tema, refleksjon og oppgave |
| `JourneyProgressBar.tsx` | Progress bar for 30-dagers reise |
| `JourneyPhaseIndicator.tsx` | Viser hvilken fase brukeren er i |
| `JourneyResonanceChart.tsx` | Visualiserer resonansutvikling over tid |
| `JourneyMilestoneModal.tsx` | Modal ved milestone (f.eks. dag 7, 14, 21, 30) |

### UI-flow:
```
Dashboard → "Reise"-knapp → Journey-day-page → Dag-innhold → Svar → Neste dag
```

---

## 9. VALIDERING OG FEILHÅNDTERING

### Kritiske valideringer:
1. **Dag må være mellom 1 og 30** — API-validering (schema mangler CHECK constraint)
2. **Ikke advance samme dag twice** — Sjekk `nextDayAt` eller `updatedAt`
3. **Bare aktive brukere kan advance** — `endedAt === null && pausedAt === null`
4. **Begge må være i aktiv reise** — Conversation må ikke være ended

### Feilhantering:
```typescript
// Eksempel på feilkoder for journey
enum JourneyError {
  NO_ACTIVE_JOURNEY = "NO_ACTIVE_JOURNEY",
  DAY_ALREADY_COMPLETED = "DAY_ALREADY_COMPLETED",
  JOURNEY_EXPIRED = "JOURNEY_EXPIRED",
  JOURNEY_PAUSED = "JOURNEY_PAUSED",
  IMAGE_NOT_ALLOWED = "IMAGE_NOT_ALLOWED_BEFORE_DAY_15"
}
```

---

## 10. ADMIN-JOURNEY-HÅNDTERING

Admin kan:
- **Reset journey** — Tilbake til dag 1
- **Complete journey** — Marker som fullført
- **Force next step** — Advance til neste dag

### API-endepunkter:
| Metode | Rute | Beskrivelse |
|--------|------|-------------|
| PATCH | `/api/admin/journey/[id]/reset` | Reset journey |
| PATCH | `/api/admin/journey/[id]/complete` | Fullfør reise |
| PATCH | `/api/admin/journey/[id]/next-step` | Force neste dag |

---

*Dette dokumentet oppdateres ved hver større endring i journey-systemet.*  
*Versjon: 1.0 — Opprettet 2026-08-02*