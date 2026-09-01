# ToSom Implementeringsplan
## Fra dagens tilsom.no → definert ToSom

*Dette dokumentet er den operative handsaminga av tosom-core-definition.md (grunnloven) og den grunnlagde analysen.*

---

## DEL 1: KONSEKVENSAR AV CORE DEFINITION (GRUNNLOVEN)

### Ufråskrívelge prinsipper (fra tosom-core-definition.md)

1. **ToSom er ikke en datingapp** — aldri swiping, feed, markedsplass eller gamification
2. **Bare to menneske** — éi aktiv reise om gangen
3. **Ro og varme** — aldri stress, press eller pushy
4. **Privat profil** — aldri offentleg
5. **Éin match per 24 timer** — beste kompatibilitet, ingen valg mellom flere
6. **30-dagers låst relasjon** — når begge aksepterer
7. **14 dager uten bilder** — bygger emosjonell forbindelse først
8. **Guidet 30-dagers reise** — dagleg refleksjon, tema, oppgaver, resonans
9. **Resonans framfor score** — samanfallande følelser, ikke numerisk poeng
10. **Mild guiding** — aldri påtrengjande

---

## DEL 2: UKA FOR UKA — FULL IMPLEMENTERINGPLAN

### UKA 1: Database-grunnlag — Djup profil

**Mål:** Legge grunnlaget for kunnskapsbasert matching

#### 1.1 Ny Profile-modell (Prisma)

```prisma
model Profile {
  id              String   @id @default(cuid())
  userId          String   @unique
  
  // --- Basis (eksisterande) ---
  firstName       String?
  lastName        String?
  age             Int?
  
  // --- Djup profil (10+ dimensjonar) ---
  lifeSituation   ProfileDimension?   @relation("LifeSituation")
  values          String[]            // ["familie", "frihet", "trygghet", "vekst", "trod", "natur", "kreativitet", "utfordring"]
  personalityTraits String[]          // ["introvert", "empathetic", "analytical", "intuitive", "practical", "philosophical"]
  relationshipStyle String?           // "gradual" | "direct" | "indirect" | "independent" | "connected"
  communicationPref String?           // "text-voice" | "long-short" | "day-night"
  intimacyComfort String?             // "conservative" | "moderate" | "open"
  futureVision    String[]            // ["familie", "karriere", "reising", "ro", "by", "land"]
  boundaries      String[]            // ["need-space", "slow-pace", "emotional-first", "physical-first"]
  emotionalNeeds  String[]            // ["validation", "support", "space", "depth", "understanding", "growth"]
  lifeRhythm      String?             // "morning" | "evening" | "structured" | "flexible" | "fast" | "slow"
  securityLevel   String?             // "insecure" | "ambivalent" | "secure"
  
  // --- Livsstil ---
  lifestyle       ProfileDimension?   @relation("Lifestyle")
  
  // --- Lettdata (alltid valfrie) ---
  photos          String[]            @default([])
  bio             String?
  interests       String[]
  
  createdAt       DateTime            @default(now())
  updatedAt       DateTime            @updatedAt
  
  user            User                @relation("UserProfile", fields: [userId], references: [id])
}

model ProfileDimension {
  id          String   @id @default(cuid())
  category    String
  label       String
  description String?
  createdAt   DateTime @default(now())
}
```

#### 1.2 Ny User-felt

```prisma
model User {
  // --- Eksisterande ---
  email             String   @unique
  password          String?
  onboardingStep    Int      @default(1)
  onboardingComplete Boolean @default(false)
  role              Role     @default(USER)
  verified          Boolean  @default(false)
  bannedAt          DateTime?
  deletedAt         DateTime?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  // --- NYTT: Match-kontroll ---
  lastMatchAt       DateTime?           // når siste match blei oppretta
  lockedUntil       DateTime?           // når lås opphøyr (30d etter dobbelt aksept)
  phase1Complete    Boolean             @default(false)  // 14-dagers fase fullført
  phase1PhotosShared Boolean            @default(false)  // delte bilder etter dag 15
  deepProfileComplete Boolean           @default(false)  // djup profil fullført
  
  // --- Eksisterande relasjonar ---
  profile           Profile?            @relation("UserProfile")
  // ... resten av eksisterande relasjonar
}
```

#### 1.3 Ny Conversation-felt

```prisma
model Conversation {
  // Eksisterande felt...
  
  // --- NYTT ---
  imageShareAllowedAt DateTime?          // når bilder blir tillatne (dag 15)
  phase1Complete      Boolean            @default(false)
  imageShared         Boolean            @default(false)
  lockedAt            DateTime?           // når relasjonen blei låst
  resonanceData       Json?               // dagleg resonans-data
}
```

#### 1.4 Ny ResonanceSession-modell

```prisma
model ResonanceSession {
  id              String   @id @default(cuid())
  conversationId  String
  day             Int
  emotionalTone   String   // "positive" | "neutral" | "mixed" | "deep"
  depthLevel      Int      // 1-10
  responseQuality String   // "engaged" | "passive" | "neutral" | "resistant"
  mutualSharing   Boolean
  vulnerability   Boolean
  summary         String?
  createdAt       DateTime @default(now())
  
  conversation    Conversation @relation(fields: [conversationId], references: [id])
  
  @@index([conversationId, day])
}
```

#### 1.5 Ny JourneyDayContent-seed

```prisma
// seed.ts — 30 dager med innhold
const journeyContent = [
  // Fase 1: Introduksjon (dag 1-5)
  { day: 1, phase: "EARLY", theme: "Velkommen", reflectionQuestion: "Hva førte deg hit?", conversationPrompt: "Fortell kort om hvem du er", task: null, resonanceGoal: "åpne deg" },
  { day: 2, phase: "EARLY", theme: "Livssituasjon", reflectionQuestion: "Kor ser du deg om én månad?", conversationPrompt: "Hva er viktigast i kvardagen din?", task: "Del en vanleg dag", resonanceGoal: "trygghet" },
  // ... (full liste i vedlegg)
  
  // Fase 2: Trygghet (dag 6-14)
  // Fase 3: Dypere samtaler (dag 15-25)
  // Fase 4: Felles reise (dag 26-30)
];
```

#### Oppgaver uke 1:
- [ ] Opprett Prisma-migrering `add_deep_profile_schema`
- [ ] Oppdater `prisma/schema.prisma` med alle nye modellar og felt
- [ ] Opprett `prisma/seed.ts` med 30 dager journey-innhold
- [ ] Test at Prisma client genererer nye typer
- [ ] Opprett database-migrering

---

### UKA 2: Onboarding — Djup profil

**Mål:** Bygg ny onboarding-prosess med 9 steg

#### 2.1 Komponentstruktur

```
components/onboarding/
├── OnboardingWizard.tsx        // Hoved-komponent, steg-navigasjon
├── StegLivssituasjon.tsx       // Steg 1: jobb, bosted, økonomi
├── StegKjerner.tsx             // Steg 2: verdier (vel 6-10)
├── StegPersonlighet.tsx        // Steg 3: personality traits
├── StegRelasjonsstil.tsx       // Steg 4: relasjonspreferanse
├── StegKommunikasjon.tsx       // Steg 5: kommunikasjonsstil
├── StegIntimitet.tsx           // Steg 6: intimitet & nærhet (modent)
├── StegFramtid.tsx             // Steg 7: framtidsonsker
├── StegGrenser.tsx             // Steg 8: grenser & behov
├── StegLivsrytme.tsx           // Steg 9: livsrytme
├── StegOppsummering.tsx        // Steg 10: oversikt over alt
├── ProgressBar.tsx             // Rolig progress-linje
└── ProfileCompletion.tsx       // Viser fylking %
```

#### 2.2 Ny app/onboarding-struktur

```
app/onboarding/
├── page.tsx              // Starter wizard
├── step1-livssituasjon/
│   └── page.tsx
├── step2-kjerner/
│   └── page.tsx
├── step3-personlighet/
│   └── page.tsx
├── step4-relasjonsstil/
│   └── page.tsx
├── step5-kommunikasjon/
│   └── page.tsx
├── step6-intimitet/
│   └── page.tsx
├── step7-framtid/
│   └── page.tsx
├── step8-grenser/
│   └── page.tsx
├── step9-livsrytme/
│   └── page.tsx
└── step10-oppsummering/
    └── page.tsx
```

#### 2.3 API for lagring

```
app/api/onboarding/
├── save/route.ts         // Generic save for alle steg
├── complete/route.ts     // Marker djup profil som fullført
├── progress/route.ts     // Henta fylking %
└── export/route.ts       // Eksporter profil for matching
```

#### 2.4 Design-reglar for onboarding
- Mørk bakgrunn med glass-panel
- Gull-aksentar bare på aktivt steg
- Progress-linje: tynn, rolig, ikke gamification
- Ingen "achievements" eller "badges"
- Språk: varm, oppmuntande, aldri pressande

#### Oppgaver uke 2:
- [ ] Bygg `OnboardingWizard.tsx` med steg-navigasjon
- [ ] Bygg alle 10 steg-komponentar
- [ ] Bygg API-endepunkt for lagring
- [ ] Test full onboarding-flow
- [ ] Test at profil lagras korrekt til database
- [ ] Test auto-save per steg

---

### UKA 3: Match-system — 24t + 30d-lås + uten bilder

**Mål:** Implementer de tre kjerneaigenskapane i matching

#### 3.1 Ny matching-algoritme (resonans-basert)

```typescript
// lib/matching/resonanceScore.ts

interface ResonanceInput {
  a: Profile;  // bare djup profil-data
  b: Profile;
}

interface ResonanceResult {
  resonanceLevel: "deep" | "strong" | "moderate" | "gentle";
  resonanceScore: number;       // 0-100 (ikke "match score")
  compatibilityBreakdown: {
    values: number;              // kjern-verdi-kompatibilitet
    personality: number;         // personlegdomskompatibilitet
    communication: number;       // kommunikasjons-match
    futureAlignment: number;     // framtid-justering
    emotionalPatterns: number;   // emosjonelle mønster
  };
  explanation: string;           // varm forklaring
}

export function calculateResonance(input: ResonanceInput): ResonanceResult {
  // Inga foto-basert scoring!
  // Bare djup profil-data
  // Resonans = samanfallande følelser, ikke numerisk score
}
```

#### 3.2 Ny config/matching.ts

```typescript
export const MATCH_WEIGHTS = {
  values:        0.30,        // kjernejverdier (høgast)
  personality:   0.25,        // personlighet
  communication: 0.20,        // kommunikasjonspreferanse
  futureAlignment: 0.15,      // framtid-justering
  emotionalPatterns: 0.10,    // emosjonelle mønster
};

export const MATCH_INTERVAL = 24 * 60 * 60 * 1000;  // 24 timer
export const LOCK_DURATION = 30 * 24 * 60 * 60 * 1000;  // 30 dager
export const PHOTO_FREE_DAYS = 14;  // 14 dager uten bilder
```

#### 3.3 Ny findBestResonanceFor.ts

```typescript
// lib/matching/findBestResonanceFor.ts

export async function findBestResonanceFor(userId: string): Promise<{ matchUserId: string; result: ResonanceResult } | null> {
  // 1. Sjekk lastMatchAt — bare tillat etter 24t
  // 2. Sjekk lockedUntil — ingen matcher mens låst
  // 3. Finn alle kvalifiserte kandidatar (onboardingComplete + deepProfileComplete)
  // 4. Rekn resonans for hver kandidat
  // 5. Returner høgaste resonans
  // 6. INGA foto-basert scoring
}
```

#### 3.4 Ny match-aksept-flow

```
app/api/match/
├── resonate/route.ts      // Ny: finn beste resonans (istadenfor /match)
├── accept/route.ts        // Ny: bruker aksepterer match
├── decline/route.ts       // Ny: bruker avslar (sjeldan)
└── status/route.ts        // Ny: vis match-status, låse-status, neste match
```

#### 3.5 Cron-jobb for lås-opphøyr

```typescript
// lib/cron/dailyMatchCleanup.ts
// Kyrer dagleg via Vercel Cron eller liknande

export async function dailyMatchCleanup() {
  // 1. Lås opp brukere etter 30d
  // 2. Rydd opp i eksploderte matcher
  // 3. Oppdater matchQueue-status
}
```

#### Oppgaver uke 3:
- [ ] Bygg `calculateResonance`-algoritmen
- [ ] Bygg `findBestResonanceFor`
- [ ] Bygg `POST /api/match/resonate` med 24t/30d-enforcing
- [ ] Bygg `POST /api/match/accept` (begge må akseptere)
- [ ] Bygg `GET /api/match/status`
- [ ] Bygg cron-jobb for dagleg opprydding
- [ ] Test 24t-enforcing
- [ ] Test 30d-lås
- [ ] Test at ingen foto-basert scoring

---

### UKA 4-5: 14-dagers bilde-fase + Resonans-måling

**Mål:** Ingen bilder de første 14 dagane + emosjonell resonansmåling

#### 4.1 Bilde-fase-enforcing

```typescript
// app/api/chat/image/route.ts

export async function POST(req: Request) {
  // Sjekk om fase 1 er fullført
  const canShare = await canSharePhotos(conversationId);
  if (!canShare) {
    return new Response(JSON.stringify({
      error: "Vent til dag 15 for å dela bilder",
      daysRemaining: 15 - getConversationDay(conversationId)
    }), { status: 403 });
  }
}

async function canSharePhotos(conversationId: string): Promise<boolean> {
  const conv = await prisma.conversation.findUnique({ where: { id: conversationId } });
  if (!conv) return false;
  const daysSinceMatch = getDaysSince(conv.createdAt);
  return daysSinceMatch >= 14;
}
```

#### 4.2 ResonanceSession API

```
app/api/journey/
├── today/route.ts        // Henta dagens innhold og refleksjon
├── reflect/route.ts      // Lag refleksjon
├── resonance/route.ts    // Henta resonans for dagen
├── depth/route.ts        // Måle resonans (AI-hjelp)
└── next-day/route.ts     // Marker som fullført
```

#### 4.3 Resonans-algoritme

```typescript
// lib/journey/resonanceAnalysis.ts

interface ResonanceAnalysis {
  emotionalTone: "positive" | "neutral" | "mixed" | "deep";
  depthLevel: number;        // 1-10
  responseQuality: "engaged" | "passive" | "neutral" | "resistant";
  mutualSharing: boolean;
  vulnerability: boolean;
  summary: string;           // varm oppsummering
}

export function analyzeResonance(messages: Message[]): ResonanceAnalysis {
  // AI-basert analyse av samtale
  // Måle emosjonell tone, djupde, gjensidig deling, sårbarhet
  // Inga numerisk "score" — bare kvalitative mål
}
```

#### Oppgaver uke 4-5:
- [ ] Implementer bilde-fase-enforcing i chat
- [ ] UI: skjul bilde-knapp før dag 15
- [ ] UI: "Del bilder når du er klar"-melding
- [ ] Bygg resonance-analysis
- [ ] Bygg ResonanceSession API
- [ ] UI: Resonans-kurve (myk, ikke tall)
- [ ] Test 14-dagers bilde-fase
- [ ] Test resonansmåling

---

### UKA 6-7: 30-dagers reise med dagleg innhold

**Mål:** Full guidet 30-dagers reise

#### 5.1 Journey-komponentar

```
components/journey/
├── JourneyTimeline.tsx     // 30 dager som myk kurve
├── JourneyDayCard.tsx      // Einskild dag med tema, refleksjon, oppgåve
├── ReflectionCard.tsx      // Vis refleksjon
├── TaskCard.tsx            // Dagleg oppgåve
├── ResonanceCurve.tsx      // Resonans over tid (myk kurve)
└── PhaseIndicator.tsx      // Vis hva fase en er i
```

#### 5.2 Journey UI-side

```
app/journey/
├── page.tsx                // Hoved-reisevisning
├── day/[dayId]/page.tsx    // Einskild dag
├── reflection/page.tsx     // Alle refleksjoner
└── overview/page.tsx       // Oversikt over heile reisen
```

#### 5.3 Daily Content

```typescript
// lib/journey/dailyContent.ts

export function getDayContent(day: number): {
  theme: string;
  reflectionQuestion: string;
  conversationPrompt: string;
  task?: string;
  systemMessage?: string;
  resonanceGoal: string;
} {
  // Hentar fra seed-data eller database
  // Fase 1 (dag 1-14): Introduksjon → Trygghet → Åpne deg
  // Fase 2 (dag 15-30): Dypere samtaler → Sårbarhet → Felles reise
}
```

#### Oppgaver uke 6-7:
- [ ] Bygg JourneyTimeline
- [ ] Bygg JourneyDayCard
- [ ] Bygg ReflectionCard
- [ ] Bygg TaskCard
- [ ] Bygg ResonanceCurve
- [ ] Seed 30 dager med innhold
- [ ] Test full reise-flow

---

### UKA 8: Dashboard-rydding

**Mål:** Dashboard som speglar ToSom sin filosofi

#### 6.1 Ny dashboard-struktur

```
app/dashboard/
├── page.tsx                  // Hoved-side
├── components/
│   ├── ResonanceOverview.tsx // Din resonans (ikke score!)
│   ├── JourneyStatus.tsx     // Din reise — dag X av 30
│   ├── NextMatchTimer.tsx    // Neste match om X timer
│   ├── DailyGuidance.tsx     // Dagens refleksjon/oppgåve
│   └── QuickActions.tsx      // Hurtigtilgang (rolig)
```

#### 6.2 Fjern fra dashboard
- ❌ StreakDisplay (gamification)
- ❌ NotificationFeed med push-notifikasjonar
- ❌ Demo-data (Emma)
- ❌ "Finn match"-knapp
- ❌ "Resonansmåler" med numerisk score

#### Oppgaver uke 8:
- [ ] Bygg ResonanceOverview
- [ ] Bygg JourneyStatus
- [ ] Bygg NextMatchTimer
- [ ] Bygg DailyGuidance
- [ ] Fjern demo-data
- [ ] Fjern gamification-element
- [ ] Test dashboard

---

### UKA 9: Rydding

**Mål:** Fjern alle feil element

#### 7.1 Fjern:
```bash
# Komponentar
components/MatchPopup.tsx              ❌ Fjern
components/MatchActions.tsx            ❌ Fjern
components/PublicMatchCard.tsx         ❌ Fjern
components/NotificationCenter.tsx      ❌ Bytt til DailySummary
components/MatchHistory/               ❌ Fjern

# Legacy pages
pages/match/                           ❌ Fjern
pages/find-match.tsx                   ❌ Fjern
pages/api/match/                       ❌ Fjern

# Kode
lib/matching/scorer.ts (intimacyScore) ❌ Fjern foto-scoring
```

#### 7.2 Behold:
```bash
components/MatchBreakdown.tsx          ✅ Endre til ResonanceBreakdown
components/DashboardMatchStatus.tsx    ✅ Endre til ResonanceStatus
```

---

### UKA 10: Chat med guiding

**Mål:** varm, dyp chat med dagleg guiding

#### 8.1 Ny chat-komponentar

```
components/chat/
├── GuidedChat.tsx         // Hoved-chat med guiding
├── ChatBubble.tsx         // Varma bobler (ikke gamified)
├── SystemGuide.tsx        // Systemmeldingar som veiledning
├── DailyReflection.tsx    // "Dagens refleksjon" knapp
├── DailyTask.tsx          // "Dagens oppgåve" kort
└── ImageSharePrompt.tsx   // "No kan du dela bilder" (dag 15+)
```

#### 8.2 Chat design etter ui-spec.md
- Bakgrunn: `#0B0E11`
- Mottatte meldinger: glass-panel
- Egne meldinger: gull-aksent (svakt)
- Input: glassmorphism med gull-focus
- Systemguide: rolig, ikke intrusive

---

### UKA 11: Design-system + Landing Page

**Mål:** Fullt design-system etter ui-spec.md + ny landing page

#### 9.1 Design-system (ui-spec.md)

```
styles/globals.css — oppdater med:
- Primary: #0B0E11
- Gold: #D4AF37
- Gold Hover: #E8C766
- Text: #FFFFFF
- Secondary: rgba(255, 255, 255, 0.65)
- Glassmorphism: blur(12px), rgba(255,255,255, 0.04)
```

#### 9.2 Landing Page

```
app/landing/
├── page.tsx
├── components/
│   ├── Hero.tsx            // "En rolig måte å møte noen på"
│   ├── HowItWorks.tsx      // Privat profil → én match → reise
│   ├── WhyToSom.tsx        // Ingen swipe, ingen feed, ingen press
│   ├── StartCTA.tsx        // "Start din reise"
│   └── FAQ.tsx             // Vanlege spørsmål
```

---

### UKA 12: Sikkerheit + Testing

**Mål:** Sikkerheit, privatisme og testdekning

#### 10.1 Privatisme
- ❌ Alle offentlege profilar fjerna
- ✅ Bare matcha partnarar kan se profil
- ✅ Ingen profil-embedding på offentlege sider
- ✅ CORS og auth på alle API-endepunkt

#### 10.2 Testing
- E2E-tester for match-flow
- Database-migrering-tester
- Sikkerheitsreview på auth
- Performance-tester på matching

---

### UKA 13: Lansering

**Mål:** Klar for produksjon

- [ ] Alle migreringar køyde
- [ ] Alle komponentar teste
- [ ] Landing page ferdig
- [ ] Monitor sett opp
- [ ] Backup av database
- [ ] Deploy til produksjon

---

## DEL 3: HVA SOM MÅ BYGGAST FØRST (Prioritert liste)

### Kritysk — ingen funksjonar uten dette:

1. **Ny Profile-modell** med 10+ dimensjonar (Prisma-migrering)
2. **User.lastMatchAt + User.lockedUntil** (match-enforcing)
3. **Onboarding Wizard** med 10 steg
4. **calculateResonance** (ny matching uten foto)
5. **findBestResonanceFor** med 24t/30d-enforcing
6. **POST /api/match/resonate** (ny match-API)
7. **POST /api/match/accept** (begge må akseptere)
8. **Conversation.imageShareAllowedAt** (14-dagers bilde-fase)
9. **ResonanceSession-modell** (resonans-måling)
10. **30 dager journey-innhold** (seed)

### Viktig — etter kritisk:

11. JourneyTimeline + JourneyDayCard
12. ResonanceOverview + ResonanceCurve
13. DailyReflection + DailyTask
14. Ny dashboard-side
15. GuidedChat med systemguide
16. Ny landing page

---

## DEL 4: HVA SOM MÅ RYDDAST (Full liste)

### Komponentar:
- [ ] `components/MatchPopup.tsx` — gamification
- [ ] `components/MatchActions.tsx` — swipe-liknande
- [ ] `components/PublicMatchCard.tsx` — offentleg profil
- [ ] `components/NotificationCenter.tsx` — push-stress
- [ ] `components/MatchHistory/` — datingapp-minne
- [ ] `components/DashboardMatchBanner.tsx` — "Finn match"-knapp
- [ ] `components/MatchBreakdown.tsx` — til ResonanceBreakdown

### Legacy pages/API:
- [ ] `pages/match/` — alle legacy match-sider
- [ ] `pages/find-match.tsx` — swipe-liknande
- [ ] `pages/api/match/` — legacy API
- [ ] `pages/api/onboarding/` — erstatt med app/

### Kode:
- [ ] `lib/matching/scorer.ts` intimacyScore — foto-basert
- [ ] Demo-data i `app/dashboard/page.tsx`
- [ ] StreakDisplay — gamification
- [ ] `app/profile/[id]/` offentleg profil-visning

---

## DEL 5: HVA SOM MÅ DESIGNAST (Full liste)

### Komponent-design:
1. **OnboardingWizard** — 10 steg, mørk + gull, myk fade-in
2. **Match Aksept-side** — varm, rolig, "Dere to er matchet"
3. **Dashboard "Ditt rom"** — resonans, reise, neste match
4. **JourneyTimeline** — 30 dager som myk kurve, gull-punkt
5. **ResonanceCurve** — emosjonell utvikling (ikke score!)
6. **ReflectionCard** — dagleg refleksjon med mjuk bakgrunn
7. **TaskCard** — dagleg oppgåve med mild guiding
8. **GuidedChat** — varm, systemguide, resonans-visning
9. **NextMatchTimer** — "Neste match om X timer" (ikke stress!)
10. **Landing Page** — "Hva er ToSom", "Slik fungerer det", "Hvorfor ToSom"

---

## DEL 6: BACKEND-IMPLEMENTERING (Full liste)

### Database (Prisma):
- [ ] Ny Profile-felt (10+ dimensjonar)
- [ ] User.lastMatchAt + lockedUntil
- [ ] Conversation.imageShareAllowedAt + phase1Complete
- [ ] ResonanceSession-modell
- [ ] JourneyDayContent-seed (30 dager)
- [ ] ProfileDimension for kategori

### API-endepunkt:
- [ ] `POST /api/match/resonate` — finn beste resonans (24t-enforcing)
- [ ] `POST /api/match/accept` — bruker aksepterer
- [ ] `POST /api/match/decline` — bruker avslar
- [ ] `GET /api/match/status` — vis status, lås, neste match
- [ ] `GET /api/journey/today` — dagens innhold
- [ ] `POST /api/journey/reflect` — lag refleksjon
- [ ] `GET /api/journey/resonance` — dagleg resonans
- [ ] `POST /api/journey/depth` — AI-analyse
- [ ] `POST /api/journey/next-day` — marker fullført
- [ ] `POST /api/chat/image` — bilde med fase-sjekk
- [ ] `POST /api/onboarding/save` — lagre profil-steg
- [ ] `POST /api/onboarding/complete` — fullfør djup profil
- [ ] `GET /api/onboarding/progress` — fylking %

### Cron/Background:
- [ ] `dailyMatchCleanup` — lås opp etter 30d
- [ ] `dailyResonanceSync` — synk resonans-dagleg
- [ ] `matchQueueProcessor` — køy match-kø dagleg

---

## DEL 7: FRONTEND-IMPLEMENTERING (Full liste)

### Komponentar:
- [ ] `OnboardingWizard.tsx`
- [ ] `StegLivssituasjon.tsx`
- [ ] `StegKjerner.tsx`
- [ ] `StegPersonlighet.tsx`
- [ ] `StegRelasjonsstil.tsx`
- [ ] `StegKommunikasjon.tsx`
- [ ] `StegIntimitet.tsx`
- [ ] `StegFramtid.tsx`
- [ ] `StegGrenser.tsx`
- [ ] `StegLivsrytme.tsx`
- [ ] `StegOppsummering.tsx`
- [ ] `ProgressBar.tsx`
- [ ] `calculateResonance` frontend-visning
- [ ] `JourneyTimeline.tsx`
- [ ] `JourneyDayCard.tsx`
- [ ] `ResonanceOverview.tsx`
- [ ] `ResonanceCurve.tsx`
- [ ] `DailyReflection.tsx`
- [ ] `DailyTask.tsx`
- [ ] `NextMatchTimer.tsx`
- [ ] `GuidedChat.tsx`
- [ ] `SystemGuide.tsx`
- [ ] `DailyGuide.tsx`

### Sider:
- [ ] `app/onboarding/` — full wizard (10 steg)
- [ ] `app/dashboard/page.tsx` — ny dashboard
- [ ] `app/journey/page.tsx` — reisevisning
- [ ] `app/journey/day/[dayId]/page.tsx` — einskild dag
- [ ] `app/match/accept/page.tsx` — match-aksept
- [ ] `app/chat/` — guidet chat
- [ ] `app/landing/page.tsx` — landing page

---

## DEL 8: ANBEFALD ARBEIDSFLYT

### Arbeidsprinsipp:
1. **Følg core definition alltid** — aldri kompromiss
2. **Bygg database først** — schema er fasit
3. **Backend før frontend** — data først, UI senere
4. **Test kvart steg** — ikke vent til slutten
5. **Rydd mens du bygg** — fjern gamification undervegs
6. **Skriv varm tekst** — aldri kommando, aldri stress
7. **Design rolig** — mørk + gull, glassmorphism, myk

### Arbeidssekvens for hver arbeidsblokk:
```
1. Les core definition for den aktuelle blocken
2. Skriv Prisma-migrering (dersom database-endring)
3. Køyr migrering lokalt
4. Bygg backend-API
5. Test API-endepunkt
6. Bygg frontend-komponent
7. Test full flow
8. Sjekk mot core definition
9. Gjenta for neste blokk
```

### Verktøy:
```bash
# Database
npx prisma migrate dev --name <name>
npx prisma studio

# Seed database
npx prisma db seed

# Test API
curl -X POST http://localhost:3000/api/match/resonate \
  -H "Content-Type: application/json" \
  -d '{"userId": "xxx"}'

# Build
npm run build
npm start
```

---

## DEL 9: OVERGANG — Dagens tosom.no → Definert ToSom

### Fase A: Grunnlag (Uke 1-2)
- Ny database-schema
- Djup onboarding
- Ingen offentlege sider endå

**Merknad:** Eksisterande profiler blir automatisk "halvfylte". Brukere må fullføra djup profil for å få match.

### Fase B: Kjerneaigenskapar (Uke 3-7)
- 24t/30d-enforcing
- Resonans-basert matching
- 14-dagers bilde-fase
- 30-dagers reise

**Merknad:** Eksisterande matcher/bilder blir flytta til "fase 1". Ingen endring for eksisterande brukere.

### Fase C: Refinement (Uke 8-11)
- Dashboard-rydding
- Rydd gamification
- Guided chat
- Design-system

**Merknad:** Gamification-element blir fjerne. Eksisterande streaks/achievements blir flytta til arkiv.

### Fase D: Lansering (Uke 12-13)
- Testing
- Sikkerheit
- Landing page
- Deploy

---

## VEDLEGG A: 30 Dagers Journey-innhold (Oppsummering)

### Fase 1: Introduksjon (Dag 1-5)
- Dag 1: Velkommen — "Hva førte deg hit?"
- Dag 2: Livssituasjon — "Hva er viktigast i kvardagen?"
- Dag 3: Verdier — "Hva kan du ikke leve uten?"
- Dag 4: Kommunikasjon — "Kommuniserer du best gjennom ord eller handling?"
- Dag 5: Personlighet — "Hva seier om deg at du er deg?"

### Fase 2: Trygghet (Dag 6-14)
- Dag 6-14: Bygg trygghet gjennom gradvis sjølvdaking
- Refleksjoner om emosjonell trygghet
- Oppgaver: "Del en svakheit", "Spør om noe du alltid vil visst"

### Fase 3: Dypere samtaler (Dag 15-25)
- Dag 15: Bilder blir tillatne (valfritt)
- Dag 16-25: Djupere tema — sårbarhet, livsval, drøm
- Oppgaver: "Fortell om det hardeste du har opplevd", "Hva vil du bli hugsa for?"

### Fase 4: Felles reise (Dag 26-30)
- Dag 26-29: Samanbyggje — "Hva vil du bygga sammen?"
- Dag 30: Refleksjon over reisen — "Hva har endra seg?"

---

## VEDLEGG B: Verd-kategori (values)

```typescript
export const VALUES = [
  "familie", "frihet", "trygghet", "vekst", "trod", "natur",
  "kreativitet", "utfordring", "vennskap", "karriere", "ro",
  "eventyr", "kunnskap", "hjelp", "ærad", "autentisk", "spesial",
  "gemeinsskap", "integritet", "tålmod", "takknemskap", "dristig"
];
```

## VEDLEGG C: Personality Traits

```typescript
export const PERSONALITY_TRAITS = [
  "introvert", "extrovert", "ambivert",
  "empathetic", "analytical", "intuitive",
  "practical", "philosophical", "imaginative",
  "calm", "passionate", "driven",
  "reflective", "spontaneous", "structured",
  "gentle", "bold", "thoughtful"
];
```

---

*Dette dokumentet er den operative handsaminga.*
*Alle endringer må følgje tosom-core-definition.md.*
*Sist oppdatert: Juni 2026*