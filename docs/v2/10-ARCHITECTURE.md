# ToSam Arkitekturoversikt v2

**Versjon:** 2.0 · **Dato:** 11. august 2026
**Status:** Godkjent av George
**Formål:** Systemmap, datafløater og avhengigheter for ToSom-plattformen

---

## 1. Teknologistack

| Lag | Teknologi | Versjon | Formål |
|-----|-----------|---------|--------|
| Framework | Next.js | 14+ (App Router) | Fullstack React med SSR/ISR |
| Språk | TypeScript | 5.x | Type-safe kodebase |
| Styling | Tailwind CSS | v4 | Utility-first CSS med custom tokens |
| Database | PostgreSQL | 15+ | Relasjonsdatabase for all domain-data |
| ORM | Prisma | 5.x | Type-safe database-access |
| Auth | Custom (Vipps OAuth) | — | Mobil-ID via Vipps |
| Package Manager | npm | 10+ | Avhengighetsstyring |
| Testing | Playwright | Latest | E2E-testing |
| Deploy | Docker + Vercel | — | Containerisert deploy |

---

## 2. Systemmap

```
┌──────────────────────────────────────────────────────────────────┐
│                        TO SOM PLATTFORM                          │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   CLIENT    │  │   SERVER    │  │   ADMIN     │             │
│  │   (BROWSER) │  │   (API)     │  │   (PANEL)   │             │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘             │
│         │                │                 │                     │
│         │  REST/JSON     │  Prisma         │                     │
│         │                │                 │                     │
│  ┌──────▼────────────────▼─────────────────▼─────────────────┐  │
│  │                    Next.js App Router                      │  │
│  │                                                            │  │
│  │  app/              pages/          components/             │  │
│  │  ├── (landing)     └── (legacy)    ├── ui/                 │  │
│  │  ├── (auth)                        ├── admin/              │  │
│  │  ├── dashboard                     ├── chat/               │  │
│  │  ├── onboarding                    ├── journey/            │  │
│  │  ├── chat                          ├── dashboard/          │  │
│  │  ├── reisen                        └── profile/            │  │
│  │  ├── profile                                       │       │  │
│  │  ├── admin                                         │       │  │
│  │  └── api/                                          │       │  │
│  │      ├── match/                                    │       │  │
│  │      ├── journey/                                  │       │  │
│  │      ├── chat/                                     │       │  │
│  │      ├── admin/                                    │       │  │
│  │      └── system/                                   │       │  │
│  └────────────────────────┬────────────────────────────┘       │
│                           │                                     │
│              ┌────────────▼────────────┐                       │
│              │    lib/ (business)      │                       │
│              │                         │                       │
│              │  ├── matching/          │                       │
│              │  │   ├── engine.ts      │                       │
│              │  │   ├── unifiedScorer  │                       │
│              │  │   ├── resonanceScore │                       │
│              │  │   ├── dealbreaker    │                       │
│              │  │   └── weightConfig   │                       │
│              │  ├── journey/           │                       │
│              │  ├── auth/              │                       │
│              │  ├── chat/              │                       │
│              │  └── admin/             │                       │
│              └────────────┬────────────┘                       │
│                           │                                     │
│              ┌────────────▼────────────┐                       │
│              │    Prisma Client        │                       │
│              └────────────┬────────────┘                       │
│                           │                                     │
│              ┌────────────▼────────────┐                       │
│              │    PostgreSQL DB        │                       │
│              │                         │                       │
│              │  User, Profile, Match   │                       │
│              │  JourneyProgress,       │                       │
│              │  Conversation, Message  │                       │
│              │  Notification, AuditLog │                       │
│              └─────────────────────────┘                       │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│  EKSTERNE AVHENGIGHETER                                         │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Vipps OAuth │  │  OpenAI API  │  │   Cron Jobs  │          │
│  │  (Auth)      │  │  (Matching   │  │  (Journey    │          │
│  │              │  │   Semantic)  │  │   Advancing) │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└──────────────────────────────────────────────────────────────────┘
```

---

## 3. Datafløater

### 3.1 Onboarding → Matching → Journey

```
[BRUKER] → Fyller ut onboarding (13 steg)
     ↓
POST /api/onboarding/step/N (lagrer JSON i Profile)
     ↓
Profile.deepProfileComplete = true
     ↓
[CRON: hver 24t] Kaller matchingEngine()
     ↓
matchingEngine():
  1. Hent alle komplette profiler uten aktiv match
  2. Apply dealbreakers (alder, avstand, ban)
  3. For hvert par: unifiedScorer() → 9-dimensjon score
  4. Finn beste resonans per bruker
  5. Skap Match (status=PENDING → ACTIVE)
     ↓
[SYSTEM] Opprett JourneyProgress (day=1, phase=EARLY)
     ↓
[BRUKER] Får match → Dashboard viser partner → Start reise
```

### 3.2 Chat-flow

```
[BRUKER A] Skriver melding i /chat/[id]
     ↓
POST /api/chat/[id]/message
     ↓
{ content: "Hei!", type: "text" }
     ↓
[API] Valider auth → Sjekk journey-active → Lagre Message i DB
     ↓
[REALTIME] WebSocket/SSR poll → Bruker B får melding
     ↓
[BRUKER B] Ser melding → svarer
```

### 3.3 Journey-dag-avansering

```
[CRON: daglig kl 00:00 CET]
     ↓
For hver aktive JourneyProgress:
  1. currentDay += 1
  2. Sjekk fase-overgang:
     - dag 15: EARLY → BUILDING_TRUST
     - dag 22: BUILDING_TRUST → DEEPER
  3. Hvis dag >= 30: Sett journey ready for completion
     ↓
[BRUKER] Ser ny dag neste morgen
```

---

## 4. Database-modeller (Oppsummert)

Se `prisma/schema.prisma` for full definisjon (568 linjer).

### Kerne-modeller

| Modell | Formål | Viktigste felter |
|--------|--------|------------------|
| **User** | Konto og auth | id, email, onboardingStep, onboardingComplete, role, bannedAt |
| **Profile** | Dyp bruker-profil | userId (1:1), firstName, age, identityName, lifeSituation(JSON), personality(JSON), relationshipStyle, communication(JSON), intimacy(JSON), futureVision(JSON), boundaries(JSON) |
| **Match** | Match mellom to brukere | id, userAId, userBId, status (PENDING/ACTIVE/COMPLETED), score, createdAt |
| **JourneyProgress** | 30-dagers reise | userId, currentDay (1-30), phase (EARLY/BUILDING_TRUST/DEEPER), completedAt |
| **Conversation** | Chat-konversasjon | id, matchId, createdAt |
| **Message** | Enkelmelding i chat | id, conversationId, senderId, content, type (text/image), createdAt |
| **Notification** | Push/in-app varsler | id, userId, type, read, createdAt |
| **AuditLog** | Admin-audit | id, adminUserId, action, target, details(JSON), createdAt |

### Relasjonskart

```
User 1──1 Profile
User 1──N Message (sender)
User 1──N Notification
User 1──0..1 JourneyProgress
User 1──N Match (via userAId OR userBId)
User N──N Conversation (via ConversationToUser)

Match 1──1 Conversation
Conversation 1──N Message
```

---

## 5. API-ruteoversikt

### Offentlige (uten auth)
| Rute | Metode | Formål |
|------|--------|--------|
| `/api/auth/register` | POST | Ny bruker via Vipps OAuth |
| `/api/auth/login` | POST | Logg inn via Vipps OAuth |

### Bruker-API (krev auth)
| Rute | Metode | Formål |
|------|--------|--------|
| `/api/onboarding/step/[n]` | POST | Lagre onboarding-steg |
| `/api/match` | GET | Hent egen match-status |
| `/api/journey/status` | GET | Hent journey-dag og fase |
| `/api/journey/reflection` | POST | Lagre refleksjonssvar |
| `/api/journey/reset` | POST | Dag 30 — fullfør eller loop-back |
| `/api/chat/conversations` | GET | Liste konversasjoner |
| `/api/chat/[id]/messages` | GET | Hent meldinger |
| `/api/chat/[id]/message` | POST | Send melding |
| `/api/profile` | GET/PATCH | Hent/oppdater egen profil |
| `/api/questions?categoryId=X` | GET | Guided spørsmål per kategori |

### Admin-API (krev admin-token)
| Rute | Metode | Formål |
|------|--------|--------|
| `/api/admin/auth` | POST | Admin-login |
| `/api/admin/metrics` | GET | Dashboard-metrikker |
| `/api/admin/users` | GET | Brukerliste med filter |
| Se dokument 02 for full liste over nye v2-admin API-ruter |

### System-API (intern)
| Rute | Metode | Formål |
|------|--------|--------|
| `/api/system/health` | GET | System-helse (memory, uptime, disk) |

---

## 6. Bakgrunnsoppgaver (Cron)

| Oppgave | Frekvens | Formål | Fil |
|---------|----------|--------|-----|
| Matching-kron | Hver 24t (kl 03:00 CET) | Finn matches for ventende brukere | `scripts/match.ts` eller tilsvarende |
| Journey-avansering | Daglig (kl 00:00 CET) | Øk currentDay, sjekk fase-overganger | `scripts/advance-journeys.ts` |
| Rydding | Ukentlig | Arkiver fullførte journeys >90 dager gammel | `scripts/cleanup.ts` |

---

## 7. Middleware og Interceptor

### `middleware.ts` (Next.js)
- Kjør på alle routes før page-render
- Sjekk auth-cookie → redirect til login hvis ikke logget inn
- Admin-ruter: sjekk admin_token cookie + role=ADMIN
- Onboarding: blokker dashboard/reise/chat hvis onboardingComplete=false

### `middleware/` (server-middleware)
- Request logging
- Rate-limiting på API-ruter
- CORS-håndtering

---

## 8. Filstruktur-oversikt

```
tosom/
├── app/                    # Next.js App Router
│   ├── (landing)/          # Offentlige sider
│   ├── (auth)/             # Login/Register
│   ├── dashboard/          # Dashboard
│   ├── onboarding/         # Onboarding (13 steg)
│   ├── chat/               # Chat-oversikt og -rom
│   ├── reisen/             # Journey + avslutning
│   ├── profile/            # Profil visning/redigering
│   ├── settings/           # Innstillinger
│   ├── admin/              # Admin-panel
│   └── api/                # API-ruter
├── components/
│   ├── ui/                 # Gjenbrukelige UI-komponenter
│   ├── admin/              # Admin-spesifikke komponenter
│   ├── chat/               # Chat-komponenter
│   ├── dashboard/          # Dashboard-komponenter
│   ├── journey/            # Journey-komponenter
│   ├── onboarding/         # Onboarding-komponenter
│   ├── profile/            # Profil-komponenter
│   └── layout/             # Layout-komponenter (sidebar, nav)
├── lib/                    # Business logic
│   ├── matching/           # Matching-motor
│   ├── journey/            # Journey-data og konfig
│   ├── auth/               # Auth-hjelperfunksjoner
│   ├── chat/               # Chat-hjelperfunksjoner
│   └── admin/              # Admin-logikk (driftScore, logger)
├── config/                 # Konfigurasjon
│   ├── design-tokens.ts    # Design-tokens (deprecated → migrere til tokens.ts)
│   ├── matching.ts         # Matching-konstnader
│   ├── radius.ts           # Avstand-radius konfig
│   └── features.ts         # Feature flags
├── prisma/                 # Database
│   └── schema.prisma       # Prisma-schema (568 linjer)
├── hooks/                  # Custom React hooks
├── scripts/                # Bakgrunns-oppgaver / cron-scripts
├── styles/                 # Global CSS
│   └── globals.css         # CSS custom properties + resets
├── types/                  # TypeScript type-definisjoner
├── docs/                   # Dokumentasjon
│   └── v2/                 # V2-dokumenter (denne mappa)
└── ai/                     # AI-agent konfig
    ├── system_prompt.md    # System-instruksjon for AI-agenter
    ├── memory.json         # Fast agent-minne
    └── system_skisse.md    # Platformskisse
```

---

## 9. Qwen ACT-instruks

```
Når du refererer til arkitekturen i ACT-mode:

1. Les ALWAYS ai/system_prompt.md før hvert steg
2. Denne filen er din system-oversikt — bruk den for å finne riktige filstier
3. Når du legger til nye API-ruter, følg eksisterende mønster i app/api/
4. Når du oppdaterer database, alltid kjør npx prisma migrate dev etter schema-endringer
5. Business logic hører hjemme i lib/ — aldri i page.tsx filer
6. Komponenter skal være dumme (presentasjon) — logikk i hooks/lib
```

---

*Slutt på Arkitekturoversikt v2.*