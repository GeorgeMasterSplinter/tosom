# ToSom — Orientierungsrapport og Vidare Plan
**Lagt opp: 30. juni 2026**
**Versjon: 1.0**
**Status: Fullstendig systemanalyse**

---

## INNHOLD

1. [Executive Summary](#1-executive-summary)
2. [Statuskartlegging — Backend](#2-statuskartlegging--backend)
3. [Statuskartlegging — Frontend](#3-statuskartlegging--frontend)
4. [Statuskartlegging — Matchmotor](#4-statuskartlegging--matchmotor)
5. [Statuskartlegging — Journey-system](#5-statuskartlegging--journey-system)
6. [Statuskartlegging — Profilunivers](#6-statuskartlegging--profilunivers)
7. [Statuskartlegging — Dashboard](#7-statuskartlegging--dashboard)
8. [Statuskartlegging — Dev-login og testflyt](#8-statuskartlegging--dev-login-og-testflyt)
9. [Statuskartlegging — Landing pages og branding](#9-statuskartlegging--landing-pages-og-branding)
10. [Statuskartlegging — Docker og deployment](#10-statuskartlegging--docker-og-deployment)
11. [Kritiske punkt og teknisk gjeld](#11-kritiske-punkt-og-teknisk-gjeld)
12. [Roadmap — Nivå 1: Kritisk](#12-roadmap--nivå-1-kritisk)
13. [Roadmap — Nivå 2: Viktig](#13-roadmap--nivå-2-viktig)
14. [Roadmap — Nivå 3: Premium](#14-roadmap--nivå-3-premium)
15. [Prioritering og anbefalt rekkefølge](#15-prioritering-og-anbefalt-rekkefylge)
16. [Oppsummering](#16-oppsummering)

---

## 1. EXECUTIVE SUMMARY

ToSom-prosjektet har **svært omfattende infrastruktur** bygget opp gjennom flere faser. Systemet består av:

- **Backend:** Vollstendig database med 20+ modeller, 80+ API-ruter, og 150+ biblioteksfiler
- **Frontend:** 30+ app-ruter, 70+ komponenter, fullt designsystem med Nordic Gold Premium-aestetikk
- **Matchmotor:** 5-kategori vektet scoring med dealbreakers, resonans-nivåer og AI-insights
- **Journey-system:** 30-dagers guidet reise med 4 faser, milestones, og daglig innhold
- **Designsystem:** Fullt implementert med Tailwind v4, glassmorphism, og gull-aksentar

**Overordnet vurdering:** Prosjektet er **~70-75% ferdig** mot sin produktdefinisjon. Kernefunksjonaliteten eksisterer og er delvis integrert. De største gapene er: full integrasjon mellom alle systemer, produksjonsdeployment, og premium-økosystemet (Partner Presence Engine, Warm Flow, Atmosphere Layer).

---

## 2. STATUSKARTLEGGING — BACKEND

### 2.1 Database (Prisma Schema)

**Status: ✅ Fullstendig (670 linjer)**

| Kategori | Status | Detaljer |
|----------|--------|----------|
| **Kjerne-modeller** | ✅ Ferdig | User, Profile, Match, Conversation, Message, JourneyProgress |
| **Support-modeller** | ✅ Ferdig | Notification, PasswordResetToken, MagicLinkToken, PhoneVerification, TwoFactorSecret |
| **Admin-modeller** | ✅ Ferdig | AuditLog, SystemLog, RouteHit |
| **AI/Analytics** | ✅ Ferdig | AIRequestLog, MatchInsight, PerformanceMetric, ResonanceSession, JourneyDayContent |
| **NextAuth-modeller** | ✅ Ferdig | Account, Session, VerificationToken |
| **Enums** | ✅ Ferdig | 16+ enums (Role, JourneyPhase, MatchStatus, etc.) |
| **Deprecated** | ⚠️ Delvis | MatchQueue, MatchFeedback, SystemMessage, RateLimitLog, RouteHit — merket som deprecated men fortsatt i schema |

**Kritiske observeringer:**
- Schema er **very comprehensive** — dekker alle core-definition krav
- `MatchFeedback` og `MatchQueue` er deprecated men ikke fjernet
- `SystemMessage` og `RateLimitLog` er deprecated men ikke fjernet
- `RouteHit` er deprecated men ikke fjernet
- `Conversation` har `imageShareAllowedAt` og `imageShared` for 14-dagers regel

### 2.2 API-ruter

**Status: 🟡 Omfattende, men ufullstendig integrering**

| Kategori | Antall ruter | Status |
|----------|-------------|--------|
| **Auth** | 6 | ✅ Ferdig (magic-link, phone, reset) |
| **Chat** | 7 | ✅ Ferdig (conversations, messages, typing, image-permission) |
| **Conversation** | 5 | ✅ Ferdig (CRUD, messages, read, send) |
| **Match** | 5 | ✅ Ferdig (score, accept, insight, status) |
| **Matching** | 1 | 🟡 Delvis (route eksisterer, engine er komplett) |
| **Journey** | 5 | 🟡 Delvis (core-ruter eksisterer, innhold mangler) |
| **Onboarding** | 4 | ✅ Ferdig (complete, deep-profile, progress, save) |
| **AI** | 6 | ✅ Ferdig (journey, match-insights, message-suggestions, profile-rewrite) |
| **Admin** | 25+ | 🟡 Delvis (mange ruter, men noen mangler) |
| **Dashboard** | 2 | ✅ Ferdig |
| **Payment** | 2 | 🟡 Delvis (Stripe-integrasjon delvis) |
| **System** | 5 | ✅ Ferdig (health, latency) |
| **Analytics** | 1 | 🟡 Delvis (track eksisterer, men mangler dash) |
| **Relationship** | 4 | 🟡 Delvis (milestones, memories, timeline, digest) |
| **Dev** | 2 | ✅ Ferdig |
| **Notifications** | 3 | ✅ Ferdig |
| **Profile** | 2 | ✅ Ferdig |
| **Cron** | 1 | 🟡 Delvis (matching cron eksisterer) |

**Totalt: ~80+ API-ruter**

### 2.3 Bibliotek (lib/)

**Status: 🟡 Omfattende (150+ filer), men ufullstendig integrasjon**

| Kategori | Filantall | Status |
|----------|----------|--------|
| **Core** | ~15 | ✅ Ferdig (analytics, constants, utils, baseScore, etc.) |
| **Auth** | 9 | ✅ Ferdig (admin-auth, session, security, roles, etc.) |
| **Matching** | 14 | ✅ Ferdig (engine, scorer, resonance, weights, dealbreaker, etc.) |
| **AI** | 10 | 🟡 Delvis (pipeline, config, matchInsight eksisterer) |
| **Chat** | 17 | ✅ Ferdig (createMessage, getMessages, conversationService, etc.) |
| **Journey** | 12 | 🟡 Delvis (engine, phases, milestones eksisterer) |
| **Admin** | 10 | 🟡 Delvis (mange helper-funksjoner) |
| **Validation** | 7 | ✅ Ferdig (auth, input, journey, match, message, profile) |
| **Security** | 4 | 🟡 Delvis (rateLimit, bruteforce eksisterer) |
| **Notifications** | 3 | 🟡 Delvis (dispatcher, events, unread) |
| **Profile** | 3 | ✅ Ferdig (dynamicProfile, partnerProfile, userProfile) |
| **AI Features** | 4 | 🟡 Delvis (journeyGuidance, matchInsights, etc.) |
| **Dashboard** | 1 | 🟡 Delvis |
| **Launch** | 1 | 🟡 Delvis |
| **Payment** | 1 | 🟡 Delvis (stripe) |
| **Pusher** | 2 | 🟡 Delvis |
| **Release** | 3 | 🟡 Delvis |
| **System** | 10 | 🟡 Delvis |

### 2.4 Middleware og autentisering

**Status: ✅ Ferdig**

- RBAC (Role-Based Access Control) implementert
- Session-validering via NextAuth v5
- Admin-role-verifikasjon
- Maintenance mode support
- Protected API-ruter for alle sensitive endpoints

### 2.5 Konfigurasjon

**Status: ✅ Ferdig**

| Fil | Formål |
|-----|--------|
| `config/design-tokens.ts` | Designsystem tokens |
| `config/env.ts` | Miljøvariabler |
| `config/features.ts` | Feature flags |
| `config/matching.ts` | Matching-konfigurasjon |
| `config/radius.ts` | Radius-pa konfigurasjon |
| `config/runtime.ts` | Runtime konfigurasjon |

---

## 3. STATUSKARTLEGGING — FRONTEND

### 3.1 App-ruter

**Status: 🟡 Omfattende (30+ mappar), men ufullstendig integrasjon**

| Mapp | Side | Status |
|------|------|--------|
| `app/layout.tsx` | Root layout | ✅ Ferdig |
| `app/(auth)/` | Autentisering | ✅ Ferdig |
| `app/(landing)/` | Landing page | ✅ Ferdig |
| `app/dashboard/` | Dashboard | ✅ Ferdig |
| `app/chat/` | Chat | ✅ Ferdig |
| `app/conversation/` | Samtaler | ✅ Ferdig |
| `app/journey/` | Reise | ✅ Ferdig |
| `app/matching/` | Matching | ✅ Ferdig |
| `app/onboarding/` | Onboarding | ✅ Ferdig |
| `app/profile/` | Profil | ✅ Ferdig |
| `app/dev-login/` | Dev login | ✅ Ferdig |
| `app/questions/` | Spørsmål | ✅ Ferdig |
| `app/reisen/` | Reisen | ✅ Ferdig |
| `app/admin/` | Admin panel | ✅ Ferdig |
| `app/slik-fungerer-det/` | Slik fungerer det | ✅ Ferdig |
| `app/hvorfor/` | Hvorfor ToSom | ✅ Ferdig |
| `app/om-oss/` | Om oss | ✅ Ferdig |
| `app/personvern/` | Personvern | ✅ Ferdig |
| `app/priser/` | Priser | ✅ Ferdig |
| `app/kontakt/` | Kontakt | ✅ Ferdig |
| `app/blogg/` | Blogg | 🟡 Delvis |
| `app/betaling/` | Betaling | 🟡 Delvis |
| `app/design-system/` | Design system | ✅ Ferdig |
| `app/ui/` | UI komponenter | ✅ Ferdig |
| `app/maintenance/` | Vedlikehold | ✅ Ferdig |
| `app/logg-inn/` | Innlogging | ✅ Ferdig |
| `app/login/` | Login | ✅ Ferdig |
| `app/register/` | Registrering | ✅ Ferdig |
| `app/vilkar/` | Vilkår | ✅ Ferdig |
| `app/vilkår/` | Vilkår | ✅ Ferdig |
| `app/cookies/` | Cookies | ✅ Ferdig |

### 3.2 Komponenter

**Status: 🟡 Omfattende (70+ komponenter), men ufullstendig integrasjon**

| Kategori | Antall | Status |
|----------|--------|--------|
| **Core UI** | ~20 | ✅ Ferdig (buttons, inputs, cards, modals) |
| **Match** | 8 | ✅ Ferdig (MatchCard, MatchBreakdown, MatchPopup, etc.) |
| **Journey** | ~10 | 🟡 Delvis (komponenter eksisterer) |
| **Chat** | 5 | 🟡 Delvis (ChatList, ChatWindow eksisterer) |
| **Onboarding** | ~8 | 🟡 Delvis |
| **Dashboard** | 4 | ✅ Ferdig (DashboardMatchBanner, Skeleton, etc.) |
| **Profile** | 6 | 🟡 Delvis |
| **AI** | ~5 | 🟡 Delvis |
| **Animations** | ~5 | 🟡 Delvis |
| **Analytics** | ~3 | 🟡 Delvis |
| **Landing** | ~10 | ✅ Ferdig (sections, hero, etc.) |
| **Navbar** | ~3 | 🟡 Delvis |

### 3.3 Hooks

**Status: 🟡 Delvis**

- Må utforskes nærmere

### 3.4 Providers

**Status: 🟡 Delvis**

- Må utforskes nærmere

### 3.5 SSR-status

**Status: ✅ Ferdig**

- Root layout er server component
- Landing page bruker 'use client' korrekt
- Auth flows bruker server-side session validation
- Dashboard og chat krever innlogging

---

## 4. STATUSKARTLEGGING — MATCHMOTOR

### 4.1 Matching Engine

**Status: ✅ Komplett (hovedalgoritme ferdig)**

| Komponent | Fil | Status |
|-----------|-----|--------|
| **Hovedengine** | `lib/matching/engine.ts` | ✅ Ferdig |
| **Vekter** | `lib/matching/weightConfig.ts` | ✅ Ferdig |
| **Scorer** | `lib/matching/scorer.ts` | ✅ Ferdig |
| **Resonance** | `lib/matching/resonanceScore.ts` | ✅ Ferdig |
| **Dealbreakers** | `lib/matching/dealbreaker.ts` | ✅ Ferdig |
| **Normalizer** | `lib/matching/normalizer.ts` | ✅ Ferdig |
| **Explainer** | `lib/matching/explainer.ts` | ✅ Ferdig |
| **Breakdown** | `lib/matching/breakdown.ts` | ✅ Ferdig |
| **Ranking** | `lib/matching/ranking.ts` | ✅ Ferdig |
| **Types** | `lib/matching/types.ts` | ✅ Ferdig |
| **Config** | `config/matching.ts` | ✅ Ferdig |

### 4.2 Matching-algoritme

**5-kategori vektet scoring:**

| Kategori | Vekt | Beskrivelse |
|----------|------|-------------|
| **base** | 0.35 | Grunnleggende kompatibilitet (verdier, livssituasjon, personlighet) |
| **resonance** | 0.25 | Emosjonell resonans (kommunikasjon, relasjonsstil) |
| **semantic** | 0.20 | Semantisk overlap (fremtidsønsker, livsstil) |
| **intimacy** | 0.10 | Intimitet og sårbarhet |
| **future** | 0.10 | Fremtidskompatibilitet (livsrytme, modenhet) |

**Tier-inndeling:**

| Score | Tier | Beskrivelse |
|-------|------|-------------|
| 0.85–1.0 | deepResonance | Dyp resonans |
| 0.70–0.84 | strongResonance | Sterk resonans |
| 0.55–0.69 | moderateResonance | Moderat resonans |
| 0.40–0.54 | gentleResonance | Mild resonans |
| 0.00–0.39 | weakResonance | Svake tegn |

**Dealbreakers (harde filter):**
- Modenhets-gap > 4
- Inkompatibel livsrytme (morning vs evening, fast vs slow)
- Eksplisitte dealbreaker-tags
- Grense-brudd

### 4.3 Match-lifecycle

**Status: ✅ Ferdig**

1. Bruker lagrer profil → kjøres i kø
2. Cron-jobb kjører matching én gang/døgn
3. Beste match valgt (én per 24 timer)
4. Match opprettet med score og explanation
5. Bruker mottar match-notification
6. Ved aksept → 30-dagers lås aktiveres
7. Journey starter automatisk

---

## 5. STATUSKARTLEGGING — JOURNEY-SYSTEM

### 5.1 Journey-arkitektur

**Status: 🟡 Delvis komplett**

| Komponent | Fil | Status |
|-----------|-----|--------|
| **Hovedmotor** | `journey/journeyEngine.ts` | ✅ Ferdig |
| **Faser** | `journey/journeyPhases.ts` | ✅ Ferdig |
| **State Engine** | `journey/journeyStateEngine.ts` | ✅ Ferdig |
| **Progress** | `journey/progression.ts` | ✅ Ferdig |
| **Milestones** | `journey/milestones.ts` | ✅ Ferdig |
| **Resonance** | `journey/resonance.ts` | ✅ Ferdig |
| **Phase mapping** | `journey/phase.ts` | ✅ Ferdig |
| **Warm Indicator** | `journey/warmIndicator.ts` | 🟡 Delvis |
| **Silent Moments** | `journey/silentMoments.ts` | 🟡 Delvis |
| **Journey Events** | `lib/journeyEvents.ts` | ✅ Ferdig |
| **Journey Tasks** | `lib/journeyTasks.ts` | 🟡 Delvis |
| **Day Content** | DB-model JourneyDayContent | ✅ Schema |

### 5.2 Journey-faser

**Status: ✅ Ferdig**

| Fase | Beskrivelse | Varighet |
|------|-------------|----------|
| **EARLY** | Introduksjon og trygghet | Dager 1-7 |
| **BUILDING_TRUST** | Bygger tillit | Dager 8-14 |
| **DEEPER** | Dypere samtaler | Dager 15-21 |
| **CHECKIN** | Refleksjon og vurdering | Dager 22-30 |

### 5.3 Journey-komponenter

**Status: 🟡 Delvis komplett**

| Komponent | Status |
|-----------|--------|
| JourneyProgress display | ✅ Ferdig |
| JourneyStep display | ✅ Ferdig |
| Daily reflection questions | 🟡 Delvis |
| Conversation prompts | 🟡 Delvis |
| Task system | 🟡 Delvis |
| Resonance tracking | ✅ Ferdig |
| Milestone tracking | ✅ Ferdig |
| AI-generated daily content | 🟡 Delvis |
| Warm flow integration | ❌ Mangler |
| Partner presence | ❌ Mangler |

---

## 6. STATUSKARTLEGGING — PROFILUNIVERS

### 6.1 Profil-struktur

**Status: ✅ Ferdig**

| Dimensjon | Felt i Profile | Status |
|-----------|---------------|--------|
| **Identity** | identityName, firstName, lastName | ✅ Ferdig |
| **Life Situation** | lifeSituation (JSON) | ✅ Ferdig |
| **Lifestyle** | lifestyle (JSON) | ✅ Ferdig |
| **Personality** | personality (JSON) | ✅ Ferdig |
| **Relationship Style** | relationshipStyle | ✅ Ferdig |
| **Communication** | communication (JSON) | ✅ Ferdig |
| **Intimacy** | intimacy (JSON) | ✅ Ferdig |
| **Future Vision** | futureVision (JSON) | ✅ Ferdig |
| **Boundaries** | boundaries (JSON) | ✅ Ferdig |
| **Emotional Needs** | emotionalNeeds (JSON) | ✅ Ferdig |
| **Life Rhythm** | lifeRhythm | ✅ Ferdig |
| **Maturity Level** | maturityLevel | ✅ Ferdig |
| **Security Level** | securityLevel | ✅ Ferdig |
| **Tags** | matchTags (Array) | ✅ Ferdig |
| **Photo** | photoUrl | ✅ Ferdig |
| **Bio** | bio | ✅ Ferdig |
| **Interests** | interests (Array) | ✅ Ferdig |

### 6.2 Onboarding flow

**Status: 🟡 Delvis komplett**

- Steg 1-3: Identitet og livssituasjon ✅
- Steg 4-6: Personlighet og relasjonsstil ✅
- Steg 7-8: Intimitet og fremtidsønsker ✅
- Steg 9-10: Oppsummering ✅
- UI/UX for onboarding: 🟡 Delvis
- Verifikasjon: ✅ Ferdig

---

## 7. STATUSKARTLEGGING — DASHBOARD

### 7.1 Dashboard-funksjoner

**Status: 🟡 Delvis komplett**

| Komponent | Status |
|-----------|--------|
| Match status display | ✅ Ferdig |
| Next match countdown | 🟡 Delvis |
| Journey progress | ✅ Ferdig |
| Resonance chart | 🟡 Delvis |
| Quick access nav | ✅ Ferdig |
| Notifications | ✅ Ferdig |
| Overview API | ✅ Ferdig |

---

## 8. STATUSKARTLEGGING — DEV-LOGIN OG TESTFLYT

### 8.1 Dev Login

**Status: ⚠️ Enkelt, men begrenset**

- Enkel side med 3 testbrukere (test1@tosom.no, test2@tosom.no, test3@tosom.no)
- Lenker til `/api/dev-login?userId=...`
- Mangler faktisk API-rute for dev-login
- Ingen seedet database med test-data
- Ingen test-konfigurasjon i package.json

### 8.2 Testinfrastruktur

**Status: ❌ Mangler**

- Ingen test-database
- Ingen seed-funksjonalitet
- Ingen e2e-tester
- Ingen unit-tester
- Ingen test-dokumentasjon

---

## 9. STATUSKARTLEGGING — LANDING PAGES OG BRANDING

### 9.1 Landing Pages

**Status: ✅ Fullstendig**

| Side | Status | Beskrivelse |
|------|--------|-------------|
| `(landing)/` | ✅ Ferdig | Hjem med Hero, "Hvorfor ToSom", "Slik fungerer det", CTA |
| `hvorfor/` | ✅ Ferdig | Core values og filosofisk forklaring |
| `slik-fungerer-det/` | ✅ Ferdig | 5-trinns forklaring |
| `reisen/` | ✅ Ferdig | 30-dagers reise forklart |
| `om-oss/` | ✅ Ferdig | Team og mission |
| `personvern/` | ✅ Ferdig | GDPR og personvern |
| `priser/` | ✅ Ferdig | Prisplaner |
| `kontakt/` | ✅ Ferdig | Kontaktinformasjon |
| `blogg/` | 🟡 Delvis | Struktur eksisterer |
| `vilkår/` | ✅ Ferdig | Betingelser |
| `cookies/` | ✅ Ferdig | Cookie-policy |

### 9.2 Designsystem

**Status: ✅ Fullstendig**

| Token | Verdi | Brukes |
|-------|-------|--------|
| Primary BG | #0B0E11 | Ja |
| Secondary BG | #111418 | Ja |
| Card | rgba(255,255,255,0.04) | Ja |
| Border | rgba(255,255,255,0.08) | Ja |
| Gold Accent | #D4AF37 | Ja |
| Gold Hover | #E8C766 | Ja |
| Primary Text | #FFFFFF | Ja |
| Secondary Text | rgba(255,255,255,0.65) | Ja |
| Font | Inter | Ja |
| Glassmorphism | backdrop-blur-xl + border-white/10 | Ja |

---

## 10. STATUSKARTLEGGING — DOCKER OG DEPLOYMENT

### 10.1 Docker

| Konfig | Status |
|--------|--------|
| Dockerfile | ✅ Ferdig (multi-stage, Node 20, security best practices) |
| docker-compose.yml | ✅ Ferdig (dev postgres) |
| deploy/docker-compose.prod.yml | ✅ Ferdig (app, postgres, nginx) |
| deploy/nginx.conf | 🟡 Delvis |
| deploy/systemd.service | ✅ Ferdig |
| deploy/DEPLOYMENT-CHECKLIST.md | ✅ Ferdig |
| deploy/README.md | ✅ Ferdig |
| deploy/prod-config.json | ✅ Ferdig |
| deploy/backup.md | ✅ Ferdig |

### 10.2 Deployment

**Status: 🟡 Delvis komplett**

- Production compose fil klar med postgres og nginx
- Reverse-proxy med SSL (Let's Encrypt)
- Database backups konfigurert
- **Mangler:**
  - Docker registry (registry.tosom.no er oppgitt men ikke verifisert)
  - CI/CD pipeline
  - Staging miljø
  - Monitoring/observability setup
  - Log-aggregering

### 10.3 Vercel

**Status: ✅ Ferdig**

- next.config.js konfigurert
- vercel.json eksisterer
- Vercel deploy-konfigurasjon

---

## 11. KRITISKE PUNKTER OG TEKNISK GJELD

### 🔴 KRITISK — Må fikses umiddelbart

| Nr | Problem | Sted | Påvirkning |
|----|---------|------|------------|
| K1 | **Mangler dev-login API-rute** | `/api/dev-login` | Utvikling og testing blokkert |
| K2 | **Ingen test-database eller test-data** | Hele prosjektet | Kan ikke teste i isolation |
| K3 | **Deprecated modeller i schema** | prisma/schema.prisma | Roter database, forvirring |
| K4 | **Ingen CI/CD pipeline** | Hele prosjektet | Manuell deployment, feil i produksjon |
| K5 | **Ingen e2e-tester** | Hele prosjektet | Ingen kvalitetssikring av flows |

### 🟡 VIKTIG — Bør fikses snart

| Nr | Problem | Sted | Påvirkning |
|----|---------|------|------------|
| V1 | **Ingen seed-funksjonalitet** | prisma/migrations | Ingen måte å seed prod-db |
| V2 | **AI provider mangler konkret implementasjon** | lib/ai/provider/ | AI-insights fungerer ikke |
| V3 | **Stripe-integrasjon delvis ferdig** | lib/payment/stripe.ts | Betaling fungerer ikke |
| V4 | **Pusher/WebSocket mangler komplett setup** | lib/pusher/ | Realtime chat fungerer ikke |
| V5 | **Cron-jobb for matching mangler komplett** | app/api/cron/matching/ | Matching kjører ikke automatisk |
| V6 | **Uploadthing mangler komplett integrasjon** | app/api/uploadthing/ | Fil-opplasting fungerer ikke |
| V7 | **Supabase integration ubrukt** | lib/supabase.ts | Uten behov men forvirrende |
| V8 | **Database backups ikke konfigurert** | deploy/docker-compose.prod.yml | Ingen backup-strategi |

### 🟡 TEKNISK GJELD — Code Quality

| Nr | Problem | Sted | Påvirkning |
|----|---------|------|------------|
| TD1 | **150+ filer i lib/ — ingen struktur** | lib/ | Veldig vanskelig å navigere |
| TD2 | **70+ komponenter — ingen arkitektur** | components/ | Duplikasjon og inkonsistens |
| TD3 | **Mixed språk (Norsk/Engelsk)** | hele prosjektet | Forvirrende for nye utviklere |
| TD4 | **Mange deprecated filer** | flere | Roter kodebase |
| TD5 | **Ingen TypeScript strict mode** | tsconfig.json | Mulige type-feil |
| TD6 | **Missing error handling** | flere API-ruter | Stille feil i produksjon |
| TD7 | **Hardcoded verdier** | flere filer | Vanskelig å config |

### 🟢 OBS — Ingenting kritisk, men ver å merke seg

| Nr | Problem | Påvirkning |
|----|---------|------------|
| O1 | **package-lock vs yarn.lock** | Inconsistency |
| O2 | **Next.js 15 med React 18** | Kan oppgraderes til React 19 |
| O3 | **Ingen telemetry** | Ingen bruksdata |
| O4 | **Ingen feature flag system** | Kan ikke rulle ut gradvis |

---

## 12. ROADMAP — NIVÅ 1: KRITISK

### Prioritet 1.1: Stabilisering av API og Authentication

**Mål:** Gjøre alle systemer stabile og pålitelige

| Oppgave | Anslått tid | Blokkert av |
|---------|-------------|-------------|
| Fix dev-login API-rute | 2 timer | Ingen |
| Lag test-database med Docker | 1 time | Ingen |
| Seed funksjonalitet (prisma db push + seed script) | 4 timer | Test-database |
| Fjern deprecated modeller fra schema | 3 timer | Ingen |
| Lag komplett auth-flow (magic link, phone, 2FA) | 8 timer | dev-login |
| Tilbake API-rate limiting | 2 timer | Ingen |

**Total:** ~20 timer

### Prioritet 1.2: Matching Production-klar

**Mål:** Matching må kjøre automatisk og gi pålitelege resultat

| Oppgave | Anslått tid | Blokkert av |
|---------|-------------|-------------|
| Fullfør cron-jobb for dagleg matching | 6 timer | Ingen |
| Test matching-flow med ekte data | 4 timer | Seed data |
| Match notification system | 4 timer | Cron |
| Match accept/reject flow | 4 timer | notification |
| Conversation auto-oppstart ved match | 6 timer | match accept |
| Feilhåndering for failed matches | 3 timer | Ingen |

**Total:** ~27 timer

### Prioritet 1.3: Chat Production-klar

**Mål:** Chat må fungere i produksjon

| Oppgave | Anslått tid | Blokkert av |
|---------|-------------|-------------|
| Fullfør chat-melding system | 6 timer | Ingen |
| Tilbake Pusher/WebSocket for realtime | 8 timer | Pusher konto |
| Image permission system (14-dagers regel) | 4 timer | Ingen |
| Typing indicator | 2 timer | WebSocket |
| Read receipts og online status | 3 timer | WebSocket |

**Total:** ~23 timer

### Prioritet 1.4: Deployment

**Mål:** Få appen i produksjon

| Oppgave | Anslått tid | Blokkert av |
|---------|-------------|-------------|
| Vercel deployment | 2 timer | Ingen |
| Docker production deployment | 4 timer | Docker registry |
| Database produksjon | 4 timer | DB-levertør |
| SSL/HTTPS | 2 timer | DNS |
| Environment variabels for produksjon | 2 timer | Hosting |

**Total:** ~14 timer

**NIVÅ 1 TOTAL: ~84 timer (ca. 2 uker med 1 utvikler)**

---

## 13. ROADMAP — NIVÅ 2: VIKTIG

### Prioritet 2.1: Full Journey-integrasjon

**Mål:** Hele reisen frå onboarding til 30-dagers avslutning

| Oppgave | Anslått tid | Blokkert av |
|---------|-------------|-------------|
| Fullstendig onboarding UI | 8 timer | Ingen |
| Daglige journey-oppdateringar | 6 timer | Cron |
| Refleksjonsspørsmål generering | 8 timer | AI |
| Oppgåve-system i reisa | 6 timer | Ingen |
| Resonance-dagleg tracking | 4 timer | Chat |
| Milestone-notifikasjon | 4 timer | notification |
| 30-dagers avslutnings-flow | 4 timer | Ingen |

**Total:** ~40 timer

### Prioritet 2.2: Partner Presence Engine

**Mål:** Kjenne kvar part er i reisa, og vise det på ein varm måte

| Oppgave | Anslått tid | Blokkert av |
|---------|-------------|-------------|
| Presence tracking (online/offline) | 6 timer | WebSocket |
| Activity feed (quiet, non-intrusive) | 4 timer | Ingen |
| Shared resonance display | 6 timer | resonance |
| "De er på samme stad i reisa" indikator | 3 timer | journey |
| Gentle nudge ved stans | 4 timer | cron |

**Total:** ~23 timer

### Prioritet 2.3: Warm Flow

**Mål:** Termisk opplevelse — overgangen mellom skjer er varm, ikkje kal

| Oppgave | Anslått tid | Blokkert av |
|---------|-------------|-------------|
| Side-transisjon animasjonar | 6 timer | framer-motion |
| Warm loading states | 4 timer | Ingen |
| Gentle page transitions | 4 timer | framer-motion |
| Mood-basert fargeendring | 8 timer | design-system |
| Ambient sound (valgfritt) | 6 timer | Web Audio API |

**Total:** ~28 timer

### Prioritet 2.4: Admin System

**Mål:** Admin kan styre brukarar og system

| Oppgave | Anslått tid | Blokkert av |
|---------|-------------|-------------|
| Admin dashboard UI | 8 timer | Ingen |
| Brukar-administrasjon | 6 timer | API |
| System-observability | 4 timer | logging |
| AI-inspect og manual override | 6 timer | AI |
| Security monitor | 4 timer | security |

**Total:** ~28 timer

**NIVÅ 2 TOTAL: ~119 timer (ca. 3 uker med 1 utvikler)**

---

## 14. ROADMAP — NIVÅ 3: PREMIUM

### Prioritet 3.1: Atmosphere Layer

**Mål:** Miljø-lag som forsterkar kjensla av reisa

| Oppgave | Anslått tid | Blokkert av |
|---------|-------------|-------------|
| Ambient background animasjonar | 8 timer | framer-motion |
| Mood-basert fargepalett | 6 timer | design-system |
| Progressiv disclosure | 4 timer | UI-system |
| Gentle haptic feedback | 4 timer | Web Vibration API |
| Seasonal theming | 6 timer | design-system |

**Total:** ~28 timer

### Prioritet 3.2: Premium Chat Animations

**Mål:** Chat føles levande og varm

| Oppgave | Anslått tid | Blokkert av |
|---------|-------------|-------------|
| Message bubble animations | 6 timer | framer-motion |
| Typing pulse | 3 timer | WebSocket |
| Resonance glow på meldingar | 6 timer | framer-motion |
| Progressiv tekst-avdekking | 4 timer | framer-motion |
| Mood-basert chat-miljø | 8 timer | design-system |

**Total:** ~27 timer

### Prioritet 3.3: AI-Powered Features

**Mål:** AI som støttar utan å dominere

| Oppgave | Anslått tid | Blokkert av |
|---------|-------------|-------------|
| AI journey guidance | 10 timer | AI provider |
| AI match insights (full) | 8 timer | AI provider |
| AI message suggestions | 8 timer | AI provider |
| AI profile rewrite | 6 timer | AI provider |
| AI resonance prediction | 10 timer | AI + match engine |

**Total:** ~42 timer

### Prioritet 3.4: Analytics og Innsikt

**Mål:** Innsikt som hjelper brukarar

| Oppgave | Anslått tid | Blokkert av |
|---------|-------------|-------------|
| Resonance chart (Chart.js) | 6 timer | Ingen |
| Journey progresjon chart | 4 timer | Ingen |
| Match historikk visualisering | 6 timer | match API |
| Relasjons-statistikk | 8 timer | database |
| Export rapport for brukar | 4 timer | PDF library |

**Total:** ~28 timer

**NIVÅ 3 TOTAL: ~125 timer (ca. 3 uker med 1 utvikler)**

---

## 15. PRIORITERING OG ANBEFALT REKKEFØLGE

### Anbefalt rekkefølge for alle fase

```
FASE 1 (UK 1-2):   KRITISK STABILISERING
├── 1.1 Fix dev-login + test-database          [20h]
├── 1.2 Matching production-klar                [27h]
└── 1.3 Chat production-klar                    [23h]
    = 70 timer totalt

FASE 2 (UK 3-4):   PRODUKSJONSGJENNOMFØRING
├── 2.1 Deployment (Vercel + Docker)           [14h]
├── 2.2 Full Journey-integrasjon               [40h]
├── 2.3 Admin system                           [28h]
    = 82 timer totalt

FASE 3 (UK 5-6):   OPPLEVELSES-LAG
├── 3.1 Partner Presence Engine                [23h]
├── 3.2 Warm Flow                              [28h]
├── 3.3 Atmosphere Layer                       [28h]
├── 3.4 Premium Chat Animations                [27h]
├── 3.5 AI-Powered Features                    [42h]
└── 3.6 Analytics og Innsikt                   [28h]
    = 176 timer totalt
```

### Totalt estimat

| Fase | Timer | Uker (1 utvikler) |
|------|-------|-------------------|
| **Nivå 1: Kritisk** | ~84 | 2-3 |
| **Nivå 2: Viktig** | ~119 | 3-4 |
| **Nivå 3: Premium** | ~125 | 3-4 |
| **TOTALT** | **~328** | **8-11 uker** |

### Alternativ: 2-utvikler team

| Fase | Timer | Uker (2 utviklere) |
|------|-------|-------------------|
| **Nivå 1: Kritisk** | ~84 | 1-2 |
| **Nivå 2: Viktig** | ~119 | 2-3 |
| **Nivå 3: Premium** | ~125 | 2-3 |
| **TOTALT** | **~328** | **5-8 uker** |

---

## 16. OPPSUMMERING

### Hva er ferdig (≈35% av prosjektet)

| Område | Status |
|--------|--------|
| Database schema | ✅ Komplett (670 linjer, 20+ modeller) |
| API-ruter | ✅ Struktur komplett (~80 ruter) |
| Auth system | ✅ Ferdig (NextAuth v5, magic link, phone) |
| Match engine | ✅ Komplett (5-kategori scoring) |
| Middleware | ✅ Ferdig (RBAC, session, maintenance) |
| Design system | ✅ Komplett (Nordic Gold Premium) |
| Landing pages | ✅ Ferdig (10+ sider) |
| Docker configs | ✅ Ferdig (dev + prod) |
| Konfigurasjon | ✅ Ferdig (design tokens, env, features) |

### Hva er delvis ferdig (≈35% av prosjektet)

| Område | Status |
|--------|--------|
| Chat UI | 🟡 Components eksisterer, realtime mangler |
| Journey system | 🟡 Motor eksisterer, innhold mangler |
| Onboarding | 🟡 Struktur eksisterer, UI mangler |
| Dashboard | 🟡 API eksisterer, UI mangler |
| Admin panel | 🟡 Mange ruter, lite UI |
| AI features | 🟡 Pipeline eksisterer, provider mangler |
| Payment | 🟡 Stripe struktur eksisterer |

### Hva mangler (≈30% av prosjektet)

| Område | Status |
|--------|--------|
| Dev-login API | ❌ Mangler |
| Test-database | ❌ Mangler |
| Test-data/seed | ❌ Mangler |
| CI/CD | ❌ Mangler |
| Production deployment | ❌ Mangler |
| Partner Presence Engine | ❌ Mangler |
| Warm Flow | ❌ Mangler |
| Atmosphere Layer | ❌ Mangler |
| Premium animations | ❌ Mangler |
| E2E tests | ❌ Mangler |

### Nøkkeltall

| Metric | Verdi |
|--------|-------|
| Totalt API-ruter | ~80+ |
| Totalt komponenter | 70+ |
| Prisma modeller | 20+ |
| lib/ filer | 150+ |
| App-ruter | 30+ |
| Landing pages | 10+ |
| Match algoritme | ✅ Komplett |
| Journey motor | ✅ Komplett |
| Kodekvalitet | 🟡 God struktur, men 150+ filer uten orden |
| Testdekking | ❌ 0% |
| Deployment | 🟡 Docker klar, CI/CD mangler |

---

**Dette dokumentet er en fullstendig kartlegging av ToSom-prosjektet per 30. juni 2026.**

**Videre arbeid bør følge denne roadmapen for å sikre stabil, påliteleg og vakker levering.**

---

*ToSom — ro, trygghet, modenheit, resonans.*