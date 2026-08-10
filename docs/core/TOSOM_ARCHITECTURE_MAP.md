# ToSom — Architecture Map (v2026)

Denne filen kartlegger hele ToSom-arkitekturen: database, API-ruter, komponenter, og dataflyt.

---

## 1. OVERORDNET ARKITEKTUR

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser (User)                       │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   Next.js 15 (App Router)                   │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │  Pages/     │  │  App/       │  │  API Routes         │ │
│  │  (LEGACY)   │  │  (Main)     │  │  (/api/*)           │ │
│  │  ~80+ filer │  │  ~30 sider  │  │  ~80 endepunkter    │ │
│  └─────────────┘  └─────────────┘  └──────────┬──────────┘ │
└───────────────────────────────────────────────┼─────────────┘
                                                │
                    ┌───────────────────────────┼───────────────────────────┐
                    │                           │                           │
                    ▼                           ▼                           ▼
            ┌───────────────┐         ┌────────────────┐        ┌──────────────────┐
            │   PostgreSQL  │         │     Pusher     │        │    Uploadthing   │
            │   (Supabase)  │         │   (Realtime)   │        │   (Bilder)       │
            │               │         │                │        │                  │
            │  • User       │         │  • Chat        │        │  • Profiler    │
            │  • Profile    │         │  • Typing      │        │  • Bilder      │
            │  • Match      │         │  • Unread      │        │  • Avatare     │
            │  • Message    │         │                │        │                  │
            │  • Journey    │         │                │        │                  │
            └───────────────┘         └────────────────┘        └──────────────────┘
```

---

## 2. DATAFLOW — BRUKERSENARIE

```
1. ONBOARDING
   Browser → /api/onboarding/save → Prisma → Profile表
                ↓
   Browser → /api/onboarding/complete → User.onboardingComplete = true
                ↓
   Browser → Dashboard

2. MATCHING
   Cron (/api/matching) → Matching Algorithm → Prisma → Match表
                ↓
   Browser → GET /api/match → Match object + Profile data
                ↓
   Browser → POST /api/match/accept → Conversation opprettes
                ↓
   Journey starter (dag 1)

3. JOURNEY
   Browser → GET /api/journey/today → JourneyDayContent for current day
                ↓
   Browser → POST /api/journey/reflect → ResonanceSession lagres
                ↓
   Browser → POST /api/journey/progress/advance → Day + 1

4. CHAT
   Browser → POST /api/chat/send → Prisma → Message表 → Pusher realtime
                ↓
   Browser → GET /api/chat/messages → Hent hele samtalen
```

---

## 3. API-RUTE-KART

### Auth (/api/auth/*)
```
POST /api/auth/magic-link          → Send magic link e-post
POST /api/auth/magic-link/verify     → Verifiser og login
POST /api/auth/vipps/authorize       → Start Vipps OAuth flow
POST /api/auth/vipps/callback        → Vipps callback / token exchange
POST /api/auth/phone/send            → Send SMS verifikasjonskode
POST /api/auth/phone/verify          → Verifiser telefonnummer
GET  /api/auth/request-reset         → Be om passord-tilbakestilling
GET  /api/auth/test-login            → Test login (dev)
```

### Onboarding (/api/onboarding/*)
```
POST /api/onboarding/save            → Lagre onboarding-data (steg-n)
GET  /api/onboarding/progress        → Hent pågående progresjon
POST /api/onboarding/complete        → Fullfør onboarding
```

### Matching (/api/match*, /api/matching/*)
```
GET    /api/match                    → Hent aktive/pending matcher
GET    /api/match/[id]               → Hent spesifikk match
POST   /api/match/accept             → Aksepter match (oppretter Conversation)
GET    /api/match/check              → Sjekk match-status
GET    /api/match/status             → Hent status
GET    /api/match/insight            → AI-generated match insight
POST   /api/match/score              → Beregn resonans-score
GET    /api/matching                 → Cron-endepunkt for matching-jobb
POST   /api/match/[id]/complete      → Fullfør match-prosess
```

### Journey (/api/journey/*)
```
GET  /api/journey/today              → Dagens journey-innhold
GET  /api/journey/progress           → Hent progresjon
POST /api/journey/progress/advance   → Neste dag (dag + 1)
POST /api/journey/reflect            → Lag refleksjon + resonance
GET  /api/journey/resonance          → Resonansdata
GET  /api/journey/check              → Sjekk om reise er låst
POST /api/journey/exit               → Avslutt reise
GET  /api/journey/[conversationId]   → Hent journey for conversation
```

### Chat (/api/chat*, /api/conversation*)
```
GET    /api/chat/messages            → Hent meldinger for conversation
POST   /api/chat/send                → Send melding
GET    /api/chat/conversation/[id]   → Hent conversation metadata
GET    /api/chat/image               → Bilde i chat
GET    /api/conversation/create      → Opprett ny conversation
GET    /api/conversation/[id]        → Hent conversation data
```

### AI (/api/ai/*)
```
POST /api/ai/journey-guidance        → AI veiledning for journey
POST /api/ai/journey/next-step       → Neste steg i journey
POST /api/ai/match-insights          → AI match-innsikt
POST /api/ai/message-suggestions     → Meldingsforslag (ikke AI-chat!)
POST /api/ai/profile/rewrite         → Hjelp med profil-tekst
```

### Admin (/api/admin/*)
```
GET    /api/admin/setup              → Admin setup/login
POST   /api/admin/logout             → Admin logout
GET    /api/admin/session            → Admin session status
GET    /api/admin/users              → Liste alle brukere
GET    /api/admin/stats              → Systemstatistikk
GET    /api/admin/matches            → Alle matcher
PATCH  /api/admin/matches/[id]/reset → Reset match
PATCH  /api/admin/matches/[id]/review → Review match
PATCH  /api/admin/matches/[id]/unmatch → Unmatch par
GET    /api/admin/journey/[id]       → Journey for bruker
PATCH  /api/admin/journey/[id]/reset → Reset journey
PATCH  /api/admin/journey/[id]/complete → Complete journey
PATCH  /api/admin/journey/[id]/next-step → Force next step
GET    /api/admin/conversation/[id]   → Conversation overview
POST   /api/admin/notification       → Send notifikasjon
GET    /api/admin/ai/logs            → AI request logs
GET    /api/admin/system/overview    → System health overview
GET    /api/admin/system/errors      → Error logs
GET    /api/admin/system/metrics     → Performance metrics
GET    /api/admin/system/traces      → Request traces
GET    /api/admin/security/overview  → Security overview
```

### System (/api/system/*)
```
GET /api/system/health               → Health check
GET /api/system/latency              → Latency tracking
GET /api/system/messages             → System messages
POST /api/analytics/track            → Analytics event
```

---

## 4. KOMPONENT-ARKITEKTUR

### Top-nivå komponenter (14 filer)
```
components/
├── AgeRequirement.tsx               → Aldersvalidering (23+)
├── DashboardMatchBanner.tsx         → Match-banner på dashboard
├── DashboardMatchStatus.tsx         → "Neste match om X timer"
├── DashboardSkeleton.tsx            → Loading-skeleton for dashboard
├── ImageUpload.tsx                  → Bildeopplasting (Uploadthing)
├── MatchActions.tsx                 → Accept/decline knapper
├── MatchBreakdown.tsx               → Resonans-breakdown visualization
├── MatchBreakdownItem.tsx           → Single breakdown category
├── MatchBreakdownSkeleton.tsx       → Loading for breakdown
├── MatchPopup.tsx                   → Ny match popup
├── NotificationCenter.tsx           → Notifikasjoner
├── PublicMatchCard.tsx              → Public match preview (landing)
├── QuickMatchCard.tsx               → Hurtig-match kort
├── Recommendation.tsx               → Anbefalingkomponent
└── MatchCard.tsx                    → Standard matchkort
```

### System-mapper (~43 mapper)
```
components/
├── admin/            → Admin-specific components
├── ai/               → AI-related UI (insights, suggestions)
├── analytics/        → Analytics/Chart components
├── animations/       → FadeIn, transitions
├── app/              → App-level layout components
├── atmosphere/       → Atmosphere/ambient effects
├── auth/             → Login/Register forms
├── branding/         → Logo, brand assets
├── chat/             → Chat bubbles, input, header
├── conversation/     → Conversation view components
├── dashboard/        → Dashboard widgets
├── dynamic/          → Dynamic/rendered content
├── global/           → Global layout (Header, Footer)
├── icons/            → SVG icons
├── journey/          → Journey day cards, progress bars
├── launch/           → Launch-specific UI
├── layout/           → Page layout wrappers
├── onboarding/       → Stepper, progress, timeline
├── presence/         → Online status indicators
├── profile/          → Profile edit/view forms
├── relationship/     → Relationship milestone components
├── release/          → Release notes UI
├── sections/         → Landing page sections
├── system/           → System messages, alerts
└── ui/               → Shared primitives (Button, Card, Input)
```

---

## 5. DATABASE-RELASJONSKART

```
User (1) ────── (1) Profile          ← UserProfile relation
User (1) ────── (0..1) JourneyProgress  ← UserJourney relation
User (1) ────── (N) Match (as A or B)  ← UserAMatches / UserBMatches
User (1) ────── (N) Message           ← sender
User (1) ────── (N) Conversation (as A or B) ← ConversationToUserA/B
User (1) ────── (N) Notification
User (1) ────── (0..1) TwoFactorSecret
User (1) ────── (N) Account
User (1) ────── (N) Session
User (1) ────── (N) PasswordResetToken
User (1) ────── (N) MagicLinkToken
User (1) ────── (N) PhoneVerification
User (1) ────── (N) AuditLog (as admin)

Match (1) ───── (0..1) MatchInsight
Match (1) ───── (N) MatchFeedback  ← @deprecated
Match (1) ───── (N) MatchHistory   ← @deprecated

Conversation (1) ── (N) Message
Conversation (1) ── (0..1) JourneyProgress
Conversation (1) ── (N) ResonanceSession
Conversation (1) ── (N) JourneyStateLog

JourneyProgress (1) ── (N) JourneyMilestone

QuestionCategory (1) ── (N) GuidedQuestion
```

---

## 6. CRON-JOBB

| Jobb | Rutine | Endepunkt | Beskrivelse |
|------|--------|-----------|-------------|
| **Matching** | Daily | `POST /api/cron/matching` | Kjør matching-algoritmen, gi én match per aktiv bruker |
| **Journey** | Daily | `POST /api/cron/journey` | Advance journey days, check for expired journeys |

---

## 7. INFRASTRUKTUR

### Vercel Deployment
- **Build**: `prisma generate && next build`
- **Start**: `next start`
- **Environment**: `.env` / `.env.local` (ikke committed)
- **CI/CD**: Automatisch ved push til main via Vercel

### Miljøvariabler (forventet)
- `DATABASE_URL` — PostgreSQL connection string
- `NEXTAUTH_SECRET` — NextAuth signing key
- `NEXTAUTH_URL` — App URL
- `VIPPS_CLIENT_ID` / `VIPPS_CLIENT_SECRET` — Vipps OAuth
- `PUSHER_APP_ID` / `PUSHER_KEY` / `PUSHER_SECRET` — Pusher
- `UPLOADTHING_SECRET` / `UPLOADTHING_APP_ID` — Uploadthing
- `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` — Stripe
- `OPENAI_API_KEY` — AI-funksjoner (match insights, etc.)

---

*Dette dokumentet oppdateres ved hver større arkitekturendring.*
*Versjon: 1.0 — Opprettet 2026-08-02*