# ToSom — Matching Overview (v2026)

Denne filen beskriver resonans-matching-systemet — den **eneste** AI-funksjonen i ToSom.  
Les denne filen for å forstå hvordan matching fungerer, algoritmen, og hele match-flowet.

---

## 1. MATCHING-FILOSOFI

### Grunnprinsipp
ToSom gir **én match per 24 timer** basert på dyp profilkompatibilitet — aldri bilder, aldri swipe, aldri overflate.

### Hva matching IKKE er:
- ❌ Aldri et swipe-system
- ❌ Aldri basert på utseende eller bilder
- ❌ Aldri en feed med mange valg
- ❌ Aldri en konkurranse om "like"
- ❌ Aldri en random-knapp

### Hva matching ER:
- ✅ Den eneste AI-funksjonen i ToSom
- ✅ Basert på verdier, personlighet, relasjonsstil
- ✅ Én match per 24 timer
- ✅ Resonans-måling (ikke score alene)
- ✅ Kompatibilitet gjennom dybde

---

## 2. MATCHING-FLOW

```
1. BRUKER FULLFØRER ONBOARDING (9 steg)
   ↓
2. PROFIL LAGRER I Profile-tablet med deepProfileData JSON
   ↓
3. CRON-JOBB KJØRES DAGLIG (f.eks. 06:00 UTC)
   ↓
4. MATCHING-ALGORITMEN BEREGNER RESONANS FOR ALLE KVAILIFISERTE BRUKERE
   ↓
5. DEN BESTE MATCHEN BLIR VALGT PER BRUKER
   ↓
6. MATCH-OPPRETTES MED STATUS "PENDING"
   ↓
7. NOTIFIKASJON SENDT TIL BERØRTE BRUKERE
   ↓
8. BRUKER SER MATCH PÅ DASHBOARD OG KAN AKSEPTERE/AVSLÅ
   ↓
9. HVIS BAKKE SE AKSEPTERER → CONVERSATION OPPLRETTES + JOURNEY STARTER
```

---

## 3. RESONANS-ALGORITMEN

### 3.1 Input-data
Matching-algoritmen bruker kun data fra `Profile`-tablettet:

| Feltp | Type | Vekt |
|-------|------|------|
| `lifeSituation` | JSON | Høy |
| `lifestyle` | JSON | Medium |
| `personality` | JSON | Høy |
| `relationshipStyle` | String | Høy |
| `communication` | JSON | Høy |
| `intimacy` | JSON | Medium |
| `futureVision` | JSON | Høy |
| `boundaries` | JSON | Medium |
| `emotionalNeeds` | JSON | Høy |
| `lifeRhythm` | String | Medium |
| `maturityLevel` | Int | Høy |
| `securityLevel` | String | Høy |
| `interests` | String[] | Lav |
| `matchTags` | String[] | Medium |

### 3.2 Beregning (konseptuell)
```typescript
// Forenklet resonans-beregning
function calculateResonance(profileA: Profile, profileB: Profile): ResonanceResult {
  const scores = {
    values: compareJsonValues(profileA.futureVision, profileB.futureVision),
    personality: compareJsonValues(profileA.personality, profileB.personality),
    relationshipStyle: compareStrings(profileA.relationshipStyle, profileB.relationshipStyle),
    communication: compareJsonValues(profileA.communication, profileB.communication),
    lifeSituation: compareJsonValues(profileA.lifeSituation, profileB.lifeSituation),
    emotionalNeeds: compareEmotionalNeeds(profileA.emotionalNeeds, profileB.emotionalNeeds),
    maturityLevel: compareMaturityLevels(profileA.maturityLevel, profileB.maturityLevel),
  }

  const weights = {
    values: 0.15,
    personality: 0.20,
    relationshipStyle: 0.15,
    communication: 0.20,
    lifeSituation: 0.10,
    emotionalNeeds: 0.10,
    maturityLevel: 0.10,
  }

  const baseScore = Object.keys(scores).reduce((sum, key) => {
    return sum + (scores[key as keyof typeof scores] * weights[key as keyof typeof weights])
  }, 0) * 100

  // Resonans-nivå basert på score og balanse
  const resonanceLevel = determineResonanceLevel(baseScore, scores)

  return { baseScore, normalizedScore: baseScore / 100, resonanceLevel, breakdown: scores }
}
```

### 3.3 Resonans-nivåer
```prisma
enum ResonanceLevel {
  GENTLE    // Score 0-49 — svak forbindelse
  MODERATE  // Score 50-69 — moderat kompatibilitet
  STRONG    // Score 70-89 — sterk kompatibilitet
  DEEP      // Score 90-100 — dyp resonans
}
```

---

## 4. MATCHING-KRIÆRIER

### Hvem kan matches?
| Kriterium | Krav |
|-----------|------|
| Onboarding fullført | `User.onboardingComplete === true` |
| Ingen aktiv reise | `JourneyProgress.endedAt !== null || JourneyProgress === null` |
| Ikke låst fra forrige match | Begge aksepterte og reisen er over, eller ingen av dem har aktiv reise |
| Alder | Brukere må være 23+ (valideres i onboarding) |
| Ingen active match | `Match.status !== 'active'` for brukeren |

### Hvem kan IKKE matches?
- Brukere med aktiv journey (låst i 30 dager)
- Banned brukere (`User.bannedAt !== null`)
- Ukvalifiserte profiler (mangler nøkkel-data)

---

## 5. MATCH-DATABASE-MODELL

```prisma
model Match {
  id               String          @id @default(cuid())
  userAId          String
  userBId          String
  status           MatchStatus     @default(active) // pending, active, matched, expired, ended, unmatched
  score            Int             @default(0)      // Base score (0-100)
  normalizedScore  Float           // Normalisert (0.0-1.0)
  type             String          @default("pending")
  explanation      Json?          // AI-generated forklaring
  scoringBreakdown Json?          // Detailed breakdown per kategori
  resonanceLevel   ResonanceLevel  @default(GENTLE)
  reviewed         Boolean         @default(false)
  acceptedByA      DateTime?
  acceptedByB      DateTime?
  lockedAt         DateTime?      // Når begge aksepterer (start på 30-dagers reise)
  expiresAt        DateTime?      // Når matchen utløper
  rejectedByA      DateTime?
  rejectedByB      DateTime?
  rejectionReason  String?
  createdAt        DateTime        @default(now())
  updatedAt        DateTime        @updatedAt
  userA            User            @relation("UserAMatches", fields: [userAId], references: [id])
  userB            User            @relation("UserBMatches", fields: [userBId], references: [id])
  MatchFeedback    MatchFeedback[] // @deprecated
  MatchHistory     MatchHistory[] // @deprecated
  insights         MatchInsight?   // AI-generated match-innsikt
}
```

### MatchStatus enum
```prisma
enum MatchStatus {
  pending     // Ny match, venter på svar
  active      // En har akseptert
  matched     // Begge har akseptert (reise starter)
  expired     // Utløpet uten aksptér
  ended       // Reise fullført eller avsluttet
  unmatched   // Admin har unmatchet
}
```

---

## 6. CRON-JOB FOR MATCHING

### Rutine
- **Rutine**: Daglig (f.eks. 06:00 UTC)
- **Endepunkt**: `POST /api/cron/matching` eller `GET /api/matching`
- **Autentisering**: Cron-secret header eller Bearer token

### Logikk
```typescript
// Forenklet cron-jobb for matching
async function handleMatchingCron() {
  // 1. Finn brukere klar for ny match
  const eligibleUsers = await prisma.user.findMany({
    where: {
      onboardingComplete: true,
      deepProfileComplete: true,
      bannedAt: null,
      lastMatchAt: { lte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      // Ingen aktiv reise
      journey: {
        or: [
          { endedAt: { not: null } },
          { is: null }
        ]
      }
    },
    include: { profile: true, journey: true }
  })

  const matchesCreated = []

  for (const user of eligibleUsers) {
    // 2. Finn kvalifiserte kandidater
    const candidates = await prisma.user.findMany({
      where: {
        id: { not: user.id },
        onboardingComplete: true,
        deepProfileComplete: true,
        bannedAt: null,
        lastMatchAt: { lte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        // Ingen aktiv reise mellom A og B
      }
    })

    // 3. Beregn resonans mot hver kandidat
    let bestMatch = null
    let bestScore = 0

    for (const candidate of candidates) {
      const resonance = calculateResonance(user.profile, candidate.profile)
      
      if (resonance.baseScore > bestScore) {
        bestScore = resonance.baseScore
        bestMatch = candidate
      }
    }

    // 4. Opprett match hvis minst MODERATE resonans
    if (bestMatch && bestScore >= 50) {
      const match = await prisma.match.create({
        data: {
          userAId: user.id,
          userBId: bestMatch.id,
          score: bestScore,
          normalizedScore: bestScore / 100,
          resonanceLevel: bestMatch.resonanceLevel,
          status: 'pending',
          scoringBreakdown: bestMatch.breakdown,
        }
      })

      matchesCreated.push(match)

      // 5. Send notifikasjoner
      await sendNotification(user.id, {
        type: 'MATCH',
        message: `Du har en ny match! Sjekk inn ${bestMatch.name}.`
      })
      await sendNotification(bestMatch.id, {
        type: 'MATCH',
        message: `Du har en ny match! Sjekk inn ${user.name}.`
      })
    }

    // Oppdater lastMatchAt
    await prisma.user.update({
      where: { id: user.id },
      data: { lastMatchAt: new Date() }
    })
  }

  return { matchesCreated: matchesCreated.length, usersProcessed: eligibleUsers.length }
}
```

---

## 7. MATCH-STATUS-FLOW

```
                    CRON JOBBER OPPRETTAR MATCH
                         │
                         ▼
                   ┌───────────┐
                   │  PENDING   │ ◄── Ny match opprettet
                   └─────┬─────┘
                         │
              ┌──────────┴──────────┐
              │                     │
              ▼                     ▼
     Bruker A aksepterer      Bruker A avslår
              │                     │
              ▼                     ▼
        ┌───────────┐         ┌───────────┐
        │   ACTIVE   │ ◄────   REJECTED   │
        └─────┬─────┘         └───────────┘
              │
              ▼
     Bruker B aksepterer
              │
              ▼
        ┌───────────┐
        │  MATCHED   │ ◄── Begge har akseptert
        └─────┬─────┘
              │
              ▼
    Conversation opprettes + Journey starter (dag 1)
              │
              ▼
        ┌───────────┐
        │   ACTIVE   │ ◄── 30-dagers reise pågår
        └─────┬─────┘
              │
     ┌────────┼────────┐
     │        │        │
     ▼        ▼        ▼
Reisen   Expired    Admin
fullført uten aksept intervenasjon
```

---

## 8. AI-MATCH-INSIGHTS

Når en match opprettes, kan AI generere innsikt:

### MatchInsight modell
```prisma
model MatchInsight {
  id        String   @id @default(cuid())
  matchId   String   @unique
  summary   String   // Kort oppsummering av kompatibilitet
  strengths String   // Felles styrker (comma-separert)
  clarity   String   // Klarhet om relasjonspotensiale
  starter   String   // Start-melding forsynesamtalen
  model     String?  // AI-modell brukt
  tokensOut Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  match     Match    @relation(fields: [matchId], references: [id])
}
```

### Eksempel på AI-generated innsikt
```json
{
  "summary": "Dere deler sterke verdier om personlig vekst og meningsfulle relasjoner. Begge prioriterer dype samtaler over overflatisk kommunikasjon.",
  "strengths": "verdier,kommunikasjon,fremtidsvisjon",
  "clarity": "Naturlig forbindelse gjennom felles interesse for personlig utvikling og ærlig dialog.",
  "starter": "Prøv å starte med: 'Hva tror du er nøkkelen til et godt forhold?'"
}
```

### AI kall ved match-opprettelse
```typescript
// I cron-jobben etter match-opprettelse
async function generateMatchInsight(match: Match): Promise<MatchInsight | null> {
  const profileA = await prisma.profile.findUnique({ where: { userId: match.userAId } })
  const profileB = await prisma.profile.findUnique({ where: userId: match.userBId }})

  if (!profileA || !profileB) return null

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `Du er en analytiker som gir varme, realistiske match-innsikter. Svar i bokmål.`
      },
      {
        role: 'user',
        content: `Gi en kort match-innsikt for disse to profilene...`
      }
    ],
    max_tokens: 500
  })

  return prisma.matchInsight.create({
    data: {
      matchId: match.id,
      ...parseAIResponse(response.choices[0].message.content)
    }
  })
}
```

---

## 9. MATCH-ACCEPT-FLOW

Når en bruker aksepterer en match:

### API: `POST /api/match/accept`
```typescript
export async function handleMatchAccept(userId, matchId) {
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: { userA: true, userB: true }
  })

  // Validér at brukeren er part i matchen
  if (match.userAId !== userId && match.userBId !== userId) {
    throw new Error('Du er ikke part i denne matchen')
  }

  // Oppdater accept-status
  const updatedMatch = await prisma.match.update({
    where: { id: matchId },
    data: match.userAId === userId 
      ? { acceptedByA: new Date(), status: 'active' }
      : { acceptedByB: new Date(), status: 'active' }
  })

  // Hvis begge har akseptert, start journey
  if (updatedMatch.acceptedByA && updatedMatch.acceptedByB) {
    await prisma.match.update({
      where: { id: matchId },
      data: { 
        status: 'matched',
        lockedAt: new Date()
      }
    })

    // Opprett conversation
    const conversation = await prisma.conversation.create({
      data: {
        userAId: match.userAId,
        userBId: match.userBId,
        matchId: match.id
      }
    })

    // Opprett journey progress for begge brukere
    await Promise.all([
      prisma.journeyProgress.create({
        data: {
          userId: match.userAId,
          phase: 'EARLY',
          day: 1,
          startedAt: new Date()
        }
      }),
      prisma.journeyProgress.create({
        data: {
          userId: match.userBId,
          phase: 'EARLY',
          day: 1,
          startedAt: new Date()
        }
      })
    ])

    // Send notifikasjoner
    await sendNotification(match.userAId, {
      type: 'MATCH',
      message: 'Gratulerer! Reises starter nå. Dag 1 er klart.'
    })
    await sendNotification(match.userBId, {
      type: 'MATCH', 
      message: 'Gratulerer! Reises starter nå. Dag 1 er klart.'
    })
  }

  return updatedMatch
}
```

---

## 10. MATCHING API-ENDepUNKTER

| Metode | Rute | Beskrivelse | Auth |
|--------|------|-------------|------|
| GET | `/api/match` | Hent aktive/pending matcher | Bruker |
| POST | `/api/match/accept` | Aksepter match | Bruker |
| GET | `/api/match/check` | Sjekk om bruker har aktuell match | Bruker |
| GET | `/api/match/status` | Hent detaljert match-status | Bruker |
| GET | `/api/match/insight` | AI-generated match-innsikt | Bruker |
| POST | `/api/match/score` | Beregn resonans-score | Admin |
| GET | `/api/matching` | **Cron-endepunkt** — kjører matching-jobb | Cron |

### Admin-match-håndtering
| Metode | Rute | Beskrivelse | Auth |
|--------|------|-------------|------|
| PATCH | `/api/admin/matches/[id]/reset` | Reset match (fjerne lås) | Admin |
| PATCH | `/api/admin/matches/[id]/review` | Review en match | Admin |
| PATCH | `/api/admin/matches/[id]/unmatch` | Unmatch et par | Admin |

---

## 11. MATCHING — KJEFTIGE MERKNADER

### Kritisk: Deprecated modeller
```prisma
// ⚠️  @deprecated — Test i app/ før sletting frå schema
model MatchFeedback { ... }   // Vurder fjerning
model MatchHistory { ... }    // Vurder fjerning  
model MatchQueue { ... }      // Vurder fjerning
```

### Valideringsregler
- Kun én match per 24 timer
- Kun én aktiv reise om gangen
- Ingen bilder i matching (kun profil-data)
- Minimum score 50 for å opprette match
- Resonans måles som enum: GENTLE, MODERATE, STRONG, DEEP

### AI-quota
- Match-insights bruker OpenAI API
- All AI-kall logges i `AIRequestLog`
- Overvåk token-forbruk daglig via admin

---

*Dette dokumentet oppdateres ved hver endring i matching-systemet.*  
*Versjon: 1.0 — Opprettet 2026-08-02*