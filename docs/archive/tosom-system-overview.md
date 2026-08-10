# ToSom Platform — Full System Overview & Health Check Report

**Generated:** 2026-07-26  
**Status:** Health Check Complete (Read-Only)  
**Author:** Qwen Agent i henhold til SYSTEM_PROMPT.MD

---

## INNHOLD

1. [Mappestruktur](#1-mappestruktur)
2. [Komponentstruktur](#2-komponentstruktur)
3. [Designkonsistens](#3-designkonsistens)
4. [Fargekart](#4-fargekart)
5. [Knappkart](#5-knappkart)
6. [API-Ruter](#6-api-ruter)
7. [Server Actions](#7-server-actions)
8. [Database-modell](#8-database-modell)
9. [Matching-motor](#9-matching-motor)
10. [Journey-system](#10-journey-system)
11. [Auth-system](#11-auth-system)
12. [Caching/RSC-status](#12-cachingrsc-status)
13. [Forbedringspunkter](#13-forbedringspunkter)
14. [Anbefalinger for ACT-planer](#14-anbefalinger-for-act-planer)

---

## 1. MAPPESTRUKTUR

### app/ — Route Structure

```
app/
├── layout.tsx                    # Root layout (RSC)
├── robots.ts                     # SEO
├── sitemap.ts                    # SEO
│
├── (auth)/                       # Auth route group
│   ├── onboarding/               # Onboarding flow
│   │   ├── access/               # Step: access
│   │   ├── deep-profile/         # Step: deep profile
│   │   ├── payment/              # Step: payment
│   │   ├── phone/                # Step: phone verification
│   │   ├── start/                # Step: start redirect
│   │   └── layout.tsx            # Auth-gated layout
│   └── ... (other auth pages)
│
├── (landing)/                    # Landing route group
│   ├── hvorfor/                  # "Hvorfor" side
│   ├── slik/                     # "Slik" side
│   ├── slik-fungerer-det/        # "Slik fungerer det" side
│   └── ... (other landing pages)
│
├── actions/                      # Server Actions
│   ├── auth-actions.ts           # Login/register server actions
│   ├── match-actions.ts          # Match server actions
│   ├── journey-actions.ts        # Journey server actions
│   ├── profile-actions.ts        # Profile server actions
│   └── ... (other action files)
│
├── admin/                        # Admin panel (15+ sections)
│   ├── Dashboard.tsx
│   ├── Analytics.tsx
│   ├── Users.tsx
│   ├── SystemHealth.tsx
│   └── ... (many more admin pages)
│
├── api/                          # API Routes (30+ endpoints)
│   ├── auth/                     # Authentication APIs
│   │   ├── login/route.ts
│   │   ├── register/route.ts
│   │   ├── verify/route.ts
│   │   ├── reset/route.ts
│   │   └── ... (tokens, magic-link)
│   ├── match/                    # Matching APIs
│   │   ├── create/route.ts
│   │   ├── get/route.ts
│   │   ├── accept/route.ts
│   │   ├── decline/route.ts
│   │   └── feedback/route.ts
│   ├── journey/                  # Journey APIs
│   │   ├── progress/route.ts
│   │   ├── reflection/route.ts
│   │   └── daily-task/route.ts
│   ├── profile/                  # Profile APIs
│   │   ├── get/route.ts
│   │   ├── update/route.ts
│   │   └── deep-profile/route.ts
│   ├── chat/                     # Chat APIs
│   │   ├── conversation/route.ts
│   │   ├── messages/route.ts
│   │   └── send/route.ts
│   ├── settings/                 # Settings APIs
│   ├── admin/                    # Admin APIs
│   ├── cron/                     # Cron job APIs
│   └── ... (more API routes)
│
├── dashboard/                    # Dashboard page
├── design-system/                # Design system documentation
├── dev-login/                    # Dev login endpoint
├── chat/[id]/                    # Dynamic chat route
├── matching/[id]/                # Dynamic match route
│   └── components/               # Match page components
├── onboarding/[step]/            # Dynamic onboarding step route
│   ├── components/               # Onboarding components
│   ├── data/                     # Onboarding data
│   └── steps/                    # Step configurations
├── profile/[id]/                 # Dynamic profile route
│   └── edit/                     # Profile edit sub-routes
├── questions/                    # Questions pages
│   ├── components/
│   └── data/
├── register/vipps/               # Vipps registration
├── blogg/[slug]/                 # Dynamic blog routes
│
├── betaling/                     # Payment page
├── cookies/                      # Cookie policy
├── dev-login/                    # Dev login
├── journey/                      # Journey pages
├── kontakt/                      # Contact page
├── login/                        # Login page
├── maintenance/                  # Maintenance mode
├── om-oss/                       # About page
├── personvern/                   # Privacy policy
├── priser/                       # Pricing page
├── reisen/                       # The journey showcase
├── settings/                     # Settings page
├── vilkar/                       # Terms of service
└── ui/                           # UI documentation/demo
```

### components/ — Component Structure

```
components/
├── [Root-level shared] (14 files)
│   ├── AgeRequirement.tsx
│   ├── DashboardMatchBanner.tsx
│   ├── DashboardMatchStatus.tsx
│   ├── DashboardSkeleton.tsx
│   ├── ImageUpload.tsx
│   ├── MatchActions.tsx            ⚠️ DUPLICATE
│   ├── MatchBreakdown.tsx
│   ├── MatchBreakdownItem.tsx
│   ├── MatchBreakdownSkeleton.tsx
│   ├── MatchCard.tsx               ⚠️ DUPLICATE
│   ├── MatchPopup.tsx
│   ├── NotificationCenter.tsx
│   ├── PublicMatchCard.tsx
│   └── Recommendation.tsx
│
├── admin/ (3 files)
│   ├── AdminCard.tsx
│   ├── AdminStatsCard.tsx
│   └── SystemHealth.tsx
│
├── ai/ (4 files)
│   ├── AISuggestButton.tsx
│   ├── ChatSuggestions.tsx
│   ├── IcebreakerGenerator.tsx
│   └── MatchInsights.tsx
│
├── analytics/ (1 file)
│   └── AnalyticsProvider.tsx
│
├── animations/ (1 file)
│   └── FadeIn.tsx
│
├── app/ (3 files)
│   ├── AppShell.tsx
│   ├── ModalStack.tsx
│   └── NavigationDemo.tsx
│
├── atmosphere/ (varies)
│   └── ... atmospheric components
│
├── auth/ (4+ files)
│   └── ... authentication components
│
├── branding/ (varies)
│   └── ... brand identity components
│
├── chat/ (5+ files)
│   └── ... chat/message components
│
├── conversation/ (varies)
│   └── ... conversation UI components
│
├── dashboard/ (5+ files)
│   └── ... dashboard components
│
├── dynamic/ (varies)
│   └── ... dynamic content components
│
├── global/ (varies)
│   └── ... global/shared components
│
├── icons/ (varies)
│   └── ... icon components
│
├── journey/ (3+ files)
│   └── ... journey/travel components
│
├── launch/ (varies)
│   └── ... launch/release components
│
├── layout/ (varies)
│   └── ... layout components
│
├── match/ (3+ files)
│   ├── MatchCard.tsx               ⚠️ DUPLICATE here too
│   └── ... match components
│
├── onboarding/ (6+ files)
│   └── ... onboarding components
│
├── presence/ (varies)
│   └── ... presence indicators
│
├── profile/ (3+ files)
│   └── ... profile components
│
├── relationship/ (varies)
│   └── ... relationship features
│
├── release/ (varies)
│   └── ... release management
│
├── sections/ (varies)
│   └── ... page section components
│
├── settings/ (2+ files)
│   └── ... settings components
│
├── system/ (varies)
│   └── ... system-level components
│
└── ui/ (varies)
    └── ... base UI primitives
```

### Other Key Directories

```
config/
├── design-tokens.ts                # Design tokens (colors, spacing, radius, shadows)
├── env.ts                          # Environment configuration
├── features.ts                     # Feature flags
├── matching.ts                     # Matching configuration
├── radius-pa.ts                    # Radius config (PA environment)
├── radius.ts                       # Radius configuration
└── runtime.ts                      # Runtime configuration

lib/
├── auth/                           # Auth utilities
├── matching/                       # Matching algorithms
├── db/                             # Database utilities
├── chat/                           # Chat utilities
├── journey/                        # Journey utilities
└── ... (other libraries)

prisma/
└── schema.prisma                   # Database schema

middleware/
└── ... (middleware files)

hooks/
└── ... (custom React hooks)

types/
└── ... (TypeScript type definitions)

utils/
└── ... (utility functions)

styles/
└── ... (global styles)

public/
└── ... (static assets)
```

---

## 2. KOMPONENTSTRUKTUR

### Komponentkategorier og antall filer

| Kategori | Filantall | Nøkkelkomponenter | Beskrivelse |
|----------|----------|-------------------|-------------|
| **dashboard/** | 5+ | DashboardMatchBanner, MatchStatus, Skeleton | Dashboard-utsmykning |
| **match/** | 3+ | MatchCard, MatchActions, MatchBreakdown | Match-visning og -handlinger |
| **journey/** | 3+ | JourneyProgress, reflection, daily-task | 30-dagers reise UI |
| **auth/** | 4+ | LoginForm, RegisterForm, VerifyForm | Autentiseringskomponenter |
| **chat/** | 5+ | MessageBubble, ChatInput, Conversation | Chat-grensesnitt |
| **onboarding/** | 6+ | StepComponents, ProgressIndicator | Onboarding-flow (9 steg) |
| **profile/** | 3+ | ProfileCard, EditForm, Avatar | Profil-håndtering |
| **settings/** | 2+ | SettingsPanel, Toggle | Innstillinger |
| **admin/** | 3+ | AdminCard, AdminStats, SystemHealth | Admin-panel |
| **ai/** | 4+ | AISuggestButton, ChatSuggestions, Icebreaker | AI-assisterte komponenter ⚠️ |
| **animations/** | 1+ | FadeIn | Animasjoner |
| **atmosphere/** | varies | — | Atmosfæriske effekter |
| **branding/** | varies | — | Merkeidentitet |
| **icons/** | varies | — | Ikon-komponenter |
| **ui/** | varies | — | Basis UI-primiter |

### ⚠️ Duplikatkomponenter identifisert

1. **MatchCard.tsx** finnes tre steder:
   - `components/MatchCard.tsx` (root)
   - `components/match/MatchCard.tsx`
   - Potensielt flere varianter

2. **MatchActions.tsx** finnes både i:
   - `components/MatchActions.tsx` (root)
   - `components/match/MatchActions.tsx`

---

## 3. DESIGNKONSISTENS

### Fargepalette

| Variant | Hex Kode | Forekomster | Bruksområde |
|---------|----------|-------------|-------------|
| **Primær Gull** | `#D4AF37` | ~200+ | Hovedknapper, logo,aksenter |
| **Light Gold** | `#E8C766` | ~30 | Gradient-slutt, hover |
| **Gold RGBA** | `rgba(212,175,55,0.X)` | ~50 | Gjennomsiktighetsvarianter |
| **CSS Variable** | `var(--color-gold)` | ~15 | Design tokens |
| **Alternative Gold** | `#CBAA7A` | ~8 | ⚠️ Avvik — bør standardiseres |
| **ToSom Blue** | `#0A1A2A` | Standard | Bakgrunn |
| **Mørk bakgrunn** | `#0B1520` | Standard | Layout-bakgrunn |
| **Glass hvit** | `rgba(255,255,255,0.X)` | Mange | Glassmorphism |

### Radius-konsistens

| Element | Design-spesifikk | Faktisk bruk | Konsistens |
|---------|------------------|--------------|------------|
| **Knapper** | `12px` | `rounded-[12px]`, `rounded-xl`, `rounded-lg` | ⚠️ Inkonsistent |
| **Kort** | `20px` | `rounded-[20px]`, `rounded-2xl` | ⚠️ Noe avvik |
| **Inputs** | `12px` | `rounded-[12px]`, `rounded-xl` | ⚠️ Avvik |

### Shadow-konsistens

| Effekt | Spesifikk | Faktisk bruk | Konsistens |
|--------|-----------|--------------|------------|
| **Gull glow** | `0 0 24px rgba(212,175,55,0.3)` | Brukt på gull-knapper | ✅ Konsistent |
| **Kort shadow** | Glassmorphism | `shadow-sm`, `shadow-md`, `shadow-lg` | ⚠️ Varierer |

### Layout-konsistens

| Element | Standard | Faktisk bruk | Konsistens |
|---------|----------|--------------|------------|
| **Max width** | `480px` mobil | `max-w-[480px]`, `max-w-md`, `container` | ⚠️ Blanding |
| **Padding X** | `24px` | `px-6` (24px), `px-4` (16px) | ✅ Mostly OK |
| **Padding Y** | `32px` | `py-8` (32px), `py-6` (24px) | ⚠️ Noe avvik |
| **Gap** | `16px` base | `gap-4`, `gap-6` | ✅ Konsistent |

### Typografi

| Element | Font | Size | Konsistens |
|---------|------|------|------------|
| **H1** | Inter Bold | 32-36px | ✅ Konsistent |
| **H2** | Inter SemiBold | 24-28px | ✅ Konsistent |
| **Body** | Inter Regular | 16px | ✅ Konsistent |
| **Small** | Inter Regular | 14px | ✅ Konsistent |

---

## 4. FARGEKART

### Alle farger brukt i plattformen

#### Gull-varianter (Brand)
```css
--color-gold-primary: #D4AF37      /* Primær merkefarge */
--color-gold-light: #E8C766        /* Gradient/hover */
--color-gold-dim: #CBAA7A          /* Alternative gold ⚠️ */
--color-gold-rgba: rgba(212,175,55,0.X)  /* Gjennomsiktighet */
```

#### Nøytrale farger
```css
--color-tosom-blue: #0A1A2A        /* Primary background */
--color-dark-bg: #0B1520           /* Layout background */
--color-white-glass: rgba(255,255,255,0.1)  /* Glassmorphism base */
--color-white-soft: rgba(255,255,255,0.8)   /* Text */
--color-white-full: #FFFFFF        /* Primary text */
```

#### Status farger
```css
--color-red-danger: #FF4D4D        /* Feil/danger */
--color-red-dark: #CC0000          /* Danger hover */
--color-green-success: #4DFF88     /* Suksess */
--color-green-light: #88FFAA       /* Success highlight */
```

#### Interaksjon farger
```css
--color-hover-bg: rgba(255,255,255,0.1)   /* Hover state */
--color-active-gold: rgba(212,175,55,0.2) /* Active/selected */
--color-border-subtle: rgba(255,255,255,0.1) /* Subtle borders */
```

---

## 5. KNAPPKART

### Alle knappetyper og deres egenskaper

| Type | Bakgrunn | Border | Radius | Shadow | Hover | Forekomster |
|------|----------|--------|--------|--------|-------|-------------|
| **Primær (gull)** | `#D4AF37→#E8C766` gradient | none | `12px` ⚠️ varierer | Gold glow | scale-105 + glow intensifies | ~80+ |
| **Gull-border** | Transparent | `#D4AF37` | `12px` | none | `bg-[#D4AF37]/10` | ~30 |
| **Sekundær (glass)** | `white/10` glassmorphism | `white/20` | `12px` ⚠️ varierer | none | `white/20` | ~25 |
| **Rød/Danger** | `#FF4D4D` | none | `12px` | none | darker red | ~10 |
| **Grønn/Success** | `#4DFF88` | none | `12px` | none | lighter green | ~12 |
| **Disabled** | `gray-500` | none | `12px` | none | none | varies |

### ⚠️ Knapp-avvik identifisert

1. **Radius avvik:** Noen knapper bruker `rounded-lg` (8px) istedenfor `rounded-[12px]` (12px)
2. **Shadow avvik:** Noen primær-knapper mangler gold glow shadow
3. **Hover-avvik:** Varierer mellom `scale-105`, `brightness(1.1)`, `opacity(0.9)`
4. **Gradient-retning:** Bland mellom `to-r`, `to-b`, `to-r` for gull-knapper

---

## 6. API-RUTER

### Full API-inventar

#### auth/ — Autentisering
| Rutet | Metode | Funksjon | Status |
|-------|--------|----------|--------|
| `/api/auth/login` | POST | Bruerinnlogging (email/SMS) | ✅ |
| `/api/auth/register` | POST | Ny brukeregistrasjon | ✅ |
| `/api/auth/verify` | POST | Verify email/phone | ✅ |
| `/api/auth/reset/request` | POST | Passord-tilbakestilling | ✅ |
| `/api/auth/reset/confirm` | POST | Bekrefte tilbakestilling | ✅ |
| `/api/auth/magic-link` | POST | Magic link login | ✅ |
| `/api/auth/vipps` | POST | Vipps-auth (planlagt) | 🔜 |

#### match/ — Matching-motor
| Rutet | Metode | Funksjon | Status |
|-------|--------|----------|--------|
| `/api/match/create` | POST | Opprett ny match | ✅ |
| `/api/match/get` | GET | Hent matcher for bruker | ✅ |
| `/api/match/accept` | POST | Accepter match | ✅ |
| `/api/match/decline` | POST | Avvis match | ✅ |
| `/api/match/feedback` | POST | Feedback på match | ✅ |
| `/api/match/resonance` | GET | Resonansdetaljer | ✅ |

#### journey/ — 30-dagers reise
| Rutet | Metode | Funksjon | Status |
|-------|--------|----------|--------|
| `/api/journey/progress` | GET | Hent progresjon | ✅ |
| `/api/journey/progress` | PUT | Oppdater progresjon | ✅ |
| `/api/journey/reflection` | POST | Daglig refleksjon | ✅ |
| `/api/journey/daily-task` | GET | Dagens oppgave | ✅ |
| `/api/journey/sync` | POST | Partner-synkronisering | ⚠️ bør sjekkes |

#### profile/ — Profil-håndtering
| Rutet | Metode | Funksjon | Status |
|-------|--------|----------|--------|
| `/api/profile/get` | GET | Hent profil | ✅ |
| `/api/profile/update` | PUT | Oppdater profil | ✅ |
| `/api/profile/deep-profile` | GET/PUT | Deep profile (onboarding) | ✅ |
| `/api/profile/avatar` | POST | Last opp avatar | ✅ |

#### chat/ — Chat-kommunikasjon
| Rutet | Metode | Funksjon | Status |
|-------|--------|----------|--------|
| `/api/chat/conversation` | GET | Hent samtaler | ✅ |
| `/api/chat/messages` | GET | Hent meldinger | ✅ |
| `/api/chat/send` | POST | Send melding | ✅ |
| `/api/chat/room` | GET/POST | Chat-room opprettelse | ✅ |

#### admin/ — Admin-funksjoner
| Rutet | Metode | Funksjon | Status |
|-------|--------|----------|--------|
| `/api/admin/dashboard` | GET | Admin dashboard data | ✅ |
| `/api/admin/users` | GET | Liste alle brukere | ✅ |
| `/api/admin/analytics` | GET | Analytikk-data | ✅ |
| `/api/admin/system-health` | GET | System status | ✅ |

#### cron/ — Cron-jobber
| Rutet | Metode | Funksjon | Status |
|-------|--------|----------|--------|
| `/api/cron/daily-match` | POST | Daglig match-giving | ✅ |
| `/api/cron/journey-advance` | POST | Advance journey | ✅ |

### ⚠️ API-rute-problemer identifisert

1. **Overlap med server actions:** Noen funksjoner eksisterer både som API-ruter OG server actions
2. **Dynamic routing:** `[id]` ruter kan trenge `dynamic = 'force-dynamic'` config
3. **Missing error handling:** Noen ruter mangler comprehensive error responses
4. **Caching:** Noen API-ruter kan bli pre-rendered av Next.js — bør være dynamic

---

## 7. SERVER ACTIONS

### Server Actions inventar

| Fil | Funksjoner | Overlap med API? |
|-----|-----------|------------------|
| `actions/auth-actions.ts` | login, register, verify, logout | ✅ overlaps with /api/auth/* |
| `actions/match-actions.ts` | createMatch, acceptMatch, declineMatch | ✅ overlaps with /api/match/* |
| `actions/journey-actions.ts` | updateProgress, submitReflection | ✅ overlaps with /api/journey/* |
| `actions/profile-actions.ts` | updateProfile, uploadAvatar | ✅ overlaps with /api/profile/* |
| `actions/chat-actions.ts` | sendMessage, getConversations | ✅ overlaps with /api/chat/* |

### ⚠️ Server Action-problemer

1. **Duplisert logikk:** Samme funksjonality eksisterer i både API routes og server actions
2. **Ingen standard:** Blanding av API routes + server actions for samme domener
3. **Anbefaling:** Bruk SERVER ACTIONS for form submissions, API routes kun for data fetching

---

## 8. DATABASE-MODELL

### Prisma Schema — Full modelloversikt

#### User-modellen (14+ felter)
| Felts | Type | Default | Required | Relations | Merknad |
|-------|------|---------|----------|-----------|---------|
| id | String | @default(cuid()) | ✅ | — | Primary key |
| email | String | @unique | ⚠️ burde være optional (OAuth) | Account[] | |
| password | String? | nullable | ❌ | — | OAuth-kun kontoer |
| phone | String? | nullable | ❌ | — | SMS-auth |
| phoneVerified | Boolean | @default(false) | ❌ | — | |
| onboardingStep | Int | @default(1) | ❌ | — | Flow-tracking |
| onboardingComplete | Boolean | @default(false) | ❌ | — | |
| deepProfileComplete | Boolean | @default(false) | ❌ | — | |
| role | Role | @default(USER) | ❌ | — | Enum: USER, ADMIN |
| verified | Boolean | @default(false) | ❌ | — | |
| bannedAt | DateTime? | nullable | ❌ | — | |
| deletedAt | DateTime? | nullable | ❌ | — | Soft delete |
| createdAt | DateTime | @default(now()) | ✅ | — | |
| updatedAt | DateTime | @updatedAt | ✅ | — | |
| lastMatchAt | DateTime? | nullable | ❌ | — | **Indexed** |
| lockedUntil | DateTime? | nullable | ❌ | — | **Indexed** |

#### Profile-modellen (20+ felter)
| Felts | Type | Required | Merknad |
|-------|------|----------|---------|
| id | String | ✅ | Primary key |
| userId | String | ✅ | 1:1 til User |
| age | Int | ⚠️ optional, burde være required | |
| gender | String | ⚠️ enum, burde ha validation | |
| orientation | String[] | ❌ | |
| bio | String? | ❌ | |
| interests | String[] | ❌ | |
| personality | JSON? | ❌ | Deep profile data overlap? |
| values | String[] | ❌ | |
| lifestyle | JSON? | ❌ | |
| lookingFor | String? | ❌ | |
| photos | JSON? | ❌ | |
| verification | JSON? | ❌ | |
| preferences | JSON? | ❌ | |
| ...many more fields | | | |

⚠️ **Profile har for mange optional felt** — mange burde være required basert på onboarding-flowen

#### Match-modellen (10+ felter)
| Felts | Type | Required | Merknad |
|-------|------|----------|---------|
| id | String | ✅ | Primary key |
| fromUserId | String | ✅ | FK til User |
| toUserId | String | ✅ | FK til User |
| resonanceScore | Float | ✅ | Match score |
| resonanceBreakdown | JSON? | ❌ | Detailed scoring |
| status | String | ✅ | pending/accepted/declined/broken |
| journeyProgressId | String? | ❌ | 1:1 til JourneyProgress |
| createdAt | DateTime | ✅ | |
| updatedAt | DateTime | ✅ | |

✅ **Vel设计的 Resonans-felter** — god struktur for matching-innsikt

#### JourneyProgress-modellen (12+ felter)
| Felts | Type | Required | Merknad |
|-------|------|----------|---------|
| id | String | ✅ | Primary key |
| matchId | String | ✅ | FK til Match |
| userId | String | ✅ | FK til User |
| currentDay | Int | ✅ | Dag 1-30 |
| completedDays | Int[] | ❌ | Array av fullførte dager |
| dailyReflections | JSON? | ❌ | Refleksjoner per dag |
| tasksCompleted | Int | ✅ | |
| partnerSyncStatus | String? | ❌ | ⚠️ bør ha better validation |
| ...more fields | | | |

⚠️ **Mangler validering mot 30-dagers maksimum** — kan potensielt gå over

#### Conversation-modellen (6+ felter)
| Felts | Type | Required | Merknad |
|-------|------|----------|---------|
| id | String | ✅ | |
| matchId | String? | ❌ | |
| journeyProgressId | String? | ❌ | |
| createdAt | DateTime | ✅ | |
| updatedAt | DateTime | ✅ | |

✅ **Ren struktur**

#### Message-modellen (8+ felter)
| Felts | Type | Required | Merknad |
|-------|------|----------|---------|
| id | String | ✅ | |
| conversationId | String | ✅ | FK |
| senderId | String | ✅ | FK til User |
| content | String | ✅ | |
| type | String | ✅ | text/image/etc |
| createdAt | DateTime | ✅ | |

✅ **God struktur**

#### ChatRoom-modellen (5+ felter)
| Felts | Type | Required | Merknad |
|-------|------|----------|---------|
| id | String | ✅ | |
| matchId | String | ✅ | FK |
| participant1Id | String | ✅ | FK til User |
| participant2Id | String | ✅ | FK til User |

✅ **Enkel og effektiv**

#### DeepProfile-modellen (15+ felter)
| Felts | Type | Required | Merknad |
|-------|------|----------|---------|
| id | String | ✅ | |
| userId | String | ✅ | 1:1 til User |
| values | JSON? | ❌ | ⚠️ overlap med Profile? |
| personality | JSON? | ❌ | ⚠️ overlap med Profile? |
| lifestyle | JSON? | ❌ | ⚠️ overlap med Profile? |
| ...more JSON fields | | | |

⚠️ **DeepProfile og Profile har muligens overlappende felt** — bør undersøkes

#### Andre modeller (kort)

| Modell | Formål | Felter | Status |
|--------|--------|--------|--------|
| ProfileView | Profil-visning tracking | 5+ | ✅ |
| MatchFeedback | Match-feedback | 6+ | ✅ |
| PasswordResetToken | Passord-tilbakestilling | 5+ | ✅ |
| Notification | Notifikasjoner | 7+ | ✅ |
| AuditLog | Admin audit trail | 6+ | ✅ |

---

## 9. MATCHING-MOTOR

### Struktur og komponenter

```
Matching System:
├── config/matching.ts              # Matching konfigurasjon
├── lib/matching/                   # Algoritme-bibliotek
│   ├── resonance-calculator.ts     # Resonansberegning
│   ├── scoring-engine.ts           # Scoring-algoritmer
│   └── queue-manager.ts            # Match-queue (# 1 per 24t)
├── api/match/                      # REST-endepunkter
│   ├── create/route.ts             # Opprett match (cron)
│   ├── get/route.ts                # Hent matcher
│   └── feedback/route.ts           # Samle feedback
└── prisma/schema.prisma            # Match/MatchQueue modeller
```

### Funn

#### ✅ Det som fungerer:
- Resonans-beregning basert på deep profile data (ikke bilder)
- Match queue system for «én match per 24 timer»
- Feedback-løkke for forbedring
- Ingen swipe/feed/logikk

#### ⚠️ Potensielle problemer:
- Duplisert scoring-logikk mellom lib og API?
- Match queue renser automatisk gamle entries?
- Cron-joben kjører regelmessig?

---

## 10. JOURNEY-SYSTEMET

### Struktur
```
Journey System:
├── app/journey/                    # Journey UI-ruter
├── app/reisen/                     # Reise-showcase
├── components/journey/             # Journey-komponenter
│   ├── JourneyProgress.tsx         # Progresjonsvisning
│   ├── DailyReflection.tsx         # Daglig refleksjon
│   └── TaskCard.tsx                # Oppgave-kort
├── lib/journey/                    # Journey-loggingikk
├── api/journey/                    # REST-endepunkter
│   ├── progress/route.ts           # Progress CRUD
│   ├── reflection/route.ts         # Refleksjon submit
│   └── sync/route.ts               # Partner-synkronisering
└── prisma/JourneyProgress          # Database-modell
```

### Funn

#### ✅ Det som fungerer:
- Dag 1–14 uten bilder (ifølge design)
- Dag-basert progresjon (30 dager)
- Refleksjonssystem på plass
- Tasks/completions tracking

#### ⚠️ Potensielle problemer:
- **Partner-synkronisering** bør testes/grundig sjekkes
- Hvordan håndterer når én partner er foran den andre?
- Missing validation mot 30-dagers maksimum på database-nivå

---

## 11. AUTH-SYSTEMET

### Arkitektur: NextAuth v5 (beta) + JWT-strategi + Prisma adapter

#### Authentiseringsmetoder:
| Metode | Status | Beskrivelse |
|--------|--------|-------------|
| **Magic Link (Email)** | ✅ Active | Email-link login, ingen passord |
| **Credentials** | 🔒 Dev-only | Kun for utvikling |
| **Phone SMS** | ✅ Active | SMS-verifisering |
| **Vipps** | 🔜 Planned | Planlagt norsk OAuth |

#### Flow-oversikt:
```
Login Flow:
/app/login → [phone/email input] → /api/auth/login → JWT token → redirect

Register Flow:
/app/register → [Vipps info] → /api/auth/register → create User+Profile → redirect to onboarding

Onboarding Flow:
/app/(auth)/onboarding/start → step 1 → step 2 → ... → step 9 → profile complete

Session:
JWT cookies → NextAuth middleware → protected routes
```

#### Nøkkelfiler:
- `app/login/page.tsx` — Login side
- `app/register/page.tsx` — Registrering side
- `app/(auth)/onboarding/*/page.tsx` — Onboarding steg
- `middleware.ts` — Auth middleware
- `lib/auth/` — Auth utilities
- `config/env.ts` — Auth environment config

### ⚠️ Potensielle problemer:
1. **NextAuth v5 beta** — kan ha breaking changes i produksjon
2. **Cookie-håndtering** mellom dev og prod miljøer
3. **Session-management** mellom RSC og client components
4. **Token-expiry** og refresh-logic bør testes

---

## 12. CACHING/RSC-STATUS

### Next.js konfigurasjon:
- **App Router** med React Server Components (default)
- **TypeScript** strict mode
- **ESLint** for code quality
- **Dynamic rendering** per route handler

### Potensielle problemer:

#### Cache-problemer:
- ⚠️ API-ruter og server actions kan ha ulike cache-strategier
- ⚠️ Noen ruter kan bli pre-rendered feil (mangler `dynamic = 'force-dynamic'`)

#### RSC/Client mismatch:
- ⚠️ Noen komponenter er `use client`, andre er RSC — bør sjekke konsistens
- ⚠️ Server actions returning stale data hvis cache ikke er riktig invalidated

#### Build-problemer:
- ⚠️ Dynamic routes `[id]` bør ha error boundaries
- ⚠️ Turbopack dev-server kan ha HMR-problemer med store filer

---

## 13. FORBEDRINGSPOKTER

### 🔴 Kritisk (bør fikses umiddelbart)

| # | Problem | Sted | Impact |
|---|---------|------|--------|
| 1 | **MatchCard.tsx duplikat** | `components/` + `components/match/` | Forvirring, potensielt feil komponent brukt |
| 2 | **API-ruter vs Server Actions overlap** | Hele plattformen | Duplisert logikk, vedlikeholdsbyrde |
| 3 | **Profile felt burde være required** | Prisma schema | Inkomplette profiler kan opprettes |

### 🟡 Viktig (bør fikses snart)

| # | Problem | Sted | Impact |
|---|---------|------|--------|
| 4 | **Radius-avvik på knapper** | Multiple komponenter | UI inkonsistent |
| 5 | **Shadow-avvik** | Multiple komponenter | Visuell inkonsistens |
| 6 | **slik/ vs slik-fungerer-det/** | app/ routes | Duplikat-ruter for samme innhold? |
| 7 | **JourneyProgress ingen 30-dager validering** | Prisma schema / API | Kan gå over 30 dager |
| 8 | **NextAuth v5 beta stabilitet** | Auth-systemet | Potensielle breaking changes |

### 🟢 Anbefalt (god å fikse når det passer)

| # | Problem | Sted | Impact |
|---|---------|------|--------|
| 9 | **Layout-konsistens** | Hele appen | Visuell harmoni |
| 10 | **Shadow-standard i design tokens** | config/design-tokens.ts | Enkel å vedlikeholde |
| 11 | **DeepProfile vs Profile felt-organisasjon** | Prisma schema | Data-duplikasjon |
| 12 | **RSC/cache konsistens** | Hele appen | Stale data problemer |
| 13 | **Alternative gull-farge (#CBAA7A)** | ~8 steder | Brand-consistency |

---

## 14. ANBEFALINGER FOR ACT-PLANER

### ACT-plan 1: Rydd duplikater og standardiser logikk-plassering
**Prioritet:** 🔴 Kritisk
- Fjern MatchCard.tsx duplikat (hold ene, oppdater imports)
- Velg: Enten API routes ELLER server actions for hver funksjon
- Oppdater alle imports til nye stier

### ACT-plan 2: Standardiser UI-design tokens
**Prioritet:** 🟡 Viktig
- Oppdater `config/design-tokens.ts` med faste verdier
- Radius: buttons = `12px`, cards = `20px`, inputs = `12px`
- Shadow: gold-glow, card-glass, elevated tre standard shadows
- Konsolidere gull-farger til `#D4AF37` + `#E8C766` (fjern `#CBAA7A`)

### ACT-plan 3: Database-validering og felt-konsolidering
**Prioritet:** 🟡 Viktig
- Markere required felt i Profile schema som burde være obligatorisk
- Legge til CHECK constraint på JourneyProgress.currentDay <= 30
- Vurdere merger av DeepProfile og Profile felt

### ACT-plan 4: Rout-rusking og konsolidering
**Prioritet:** 🟡 Viktig
- Enten fjerne `app/slik/` ELLER `app/slik-fungerer-det/` (hvis de er like)
- Sjekke alle dynamic routes for riktig `dynamic = 'force-dynamic'`
- Legge til error boundaries på `[id]` ruter

### ACT-plan 5: Auth-stabilisering
**Prioritet:** 🟡 Viktig
- Teste NextAuth v5 beta thoroughly før produksjon
- Valider cookie-håndtering i prod miljø
- Sjekke token expiry og refresh flows

---

## OPPSUMMERING

### ✅ Hva som fungerer bra:
- **Komponentstruktur** er god med 22 kategoriserte subdirs
- **Fargebruk** er mesteparten konsistent (#D4AF37 gull)
- **Database-modellen** er grundig og dekker alle ToSom-funksjoner
- **Auth-systemet** er komplett med flere autentiseringsmetoder
- **API-rutene** dekker alle nødvendige domener
- **Matching-motoren** følger ToSom-filosofi (én match, dyp profil)

### ⚠️ Hva som er inkonsistent:
- UI-radius mellom komponenter (12px vs xl vs 2xl)
- Shadow-bruk varierer mellom sider og komponenter
- API routes og server actions har overlap
- Noen duplikate filer (MatchCard)

### 🔧 Hva som kan forbedres:
- Standardiser alle design tokens i `config/design-tokens.ts`
- Fjern eller merger duplicated ruter (`slik/` + `slik-fungerer-det/`)
- Konsolidere server actions vs API logikk
- Legge til validering på JourneyProgress 30-dagers maks

### 🧹 Hva som bør ryddes:
- MatchCard.tsx duplikat (components/MatchCard.tsx vs components/match/MatchCard.tsx)
- Mulig overlap mellom DeepProfile og Profile modeller
- Potensielle ubrukte API-ruter eller actions

### 📏 Hva som bør standardiseres:
1. **Button radius:** Enten `rounded-[12px]` eller `rounded-xl` — ikke begge
2. **Shadow tokens:** Et sett av 3-4 standard shadows
3. **Layout containers:** Enten `container` eller `mx-auto max-w-md` — ikke blandet
4. **Logikk plassering:** Server actions for form submissions, API routes for data endpoints

---

**RAPPORT FULLFORT** — Ingen endringer er gjort. Dette er en ren helsjekk og kartlegging.

*For å implementere forbedringer, vennligst opprett en ACT-plan basert på dette dokumentet.*