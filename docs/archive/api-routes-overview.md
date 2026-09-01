# ToSom API Routes Overview

**Generert:** 2026-01-26  
**Status:** Fullstendig kartlegging av alle API-ruter

---

## TABLE OF CONTENTS

1. [Oppsummering](#1-oppsummering)
2. [Route-katalog](#2-route-katalog)
3. [Auth-status per rute](#3-auth-status-per-rute)
4. [Role-status per rute](#4-role-status-per-rute)
5. [Input-validering-status](#5-input-validering-status)
6. [Responsformat-status](#6-respondsformat-status)
7. [Sikkerheitsstatus](#7-sikkerheitsstatus)
8. [Filstruktur](#8-filstruktur)
9. [Ubrukte ruter](#9-ubrukete-ruter)
10. [Depraacted-ruter](#10-deprecated-ruter)
11. [Forbedringspunkter](#11-forbedringspunkter)
12. [Før/etter-oversikt](#12-før-etter-oversikt)

---

## 1. OPPSUMMERING

| Kategori | Tal |
|----------|-----|
| Totalt antal API-ruter | **57** |
| Med auth-sjekk | ~40 |
| Uten auth-sjekk | ~17 |
| Med requireAdmin | ~15 (admin-ruter) |
| Med Zod-validering | ~25 ruter har schema definert i lib/validation/api.ts |
| Ubukte ruter | **~12** |
| Deprecated | **~3** |

---

## 2. ROUTE-KATALOG

### Auth Routes (app/api/auth/*)

| Route | Metode | Auth | Role | Input-validering | Status | Kalla fra |
|-------|--------|------|------|-----------------|--------|-----------|
| `/api/auth/[...nextauth]` | GET/POST | ✅ NextAuth | - | NextAuth | ✅ Aktiv | UI-komponentar |
| `/api/auth/magic-link` | POST | ❌ (public) | - | Nei | ✅ Aktiv | UI-login-side |
| `/api/auth/magic-link/verify` | POST | ❌ (public) | - | Nei | ✅ Aktiv | magic-link-flow |
| `/api/auth/phone/send` | POST | ❌ (public) | - | Ja (Zod) | ✅ Aktiv | UI-phone-login |
| `/api/auth/phone/verify` | POST | ❌ (public) | - | Ja (Zod) | ✅ Aktiv | UI-phone-login |
| `/api/auth/request-reset` | POST | ❌ (public) | - | Ja (Zod) | ✅ Aktiv | UI-cookies-side |
| `/api/auth/oauth/vipps/authorize` | GET | ❌ (public) | - | Nei | ✅ Aktiv | UI-login-side |
| `/api/auth/oauth/vipps/callback` | GET | ❌ (public) | - | Nei | ✅ Aktiv | Vipps OAuth flow |
| `/api/auth/vipps/authorize` | GET | ❌ (public) | - | Nei | 🟡 Deprecated | **Flytta til /oauth/** |
| `/api/auth/vipps/callback` | GET | ❌ (public) | - | Nei | 🟡 Deprecated | **Flytta til /oauth/** |

### Match Routes (app/api/match/*)

| Route | Metode | Auth | Role | Input-validering | Status | Kalla fra |
|-------|--------|------|------|-----------------|--------|-----------|
| `/api/match` | GET/POST | ✅ getServerSession | User | Ja (Zod: matchCreateSchema) | ✅ Aktiv | Dashboard, matching-side |
| `/api/match/accept` | POST | ❌ **MANGEL** | - | Ja (Zod: matchAcceptSchema) | ✅ Aktiv | Matching-side |
| `/api/match/insight` | GET | ❌ **MANGEL** | - | Ja (Zod: matchInsightSchema) | ✅ Aktiv | `/matching/[id]/_components/MatchInsight.tsx` |
| `/api/match/score` | POST | ✅ requireAuth | - | Ja (matchScoreSchema) | ✅ Aktiv | **Standardisert med Zod + auth** |
| `/api/match/status` | GET | ❌ **MANGEL** | - | Nei | ✅ Aktiv | `DashboardMatchStatus.tsx` |

### Journey Routes (app/api/journey/*)

| Route | Metode | Auth | Role | Input-validering | Status | Kalla fra |
|-------|--------|------|------|-----------------|--------|-----------|
| `/api/journey/[conversationId]` | GET | ✅ getServerSession | User | Nei | ✅ Aktiv | Journey-komponentar |
| `/api/journey/conversations/[conversationId]` | GET | ✅ getServerSession | User | Nei | ✅ Aktiv | **Ny mapping** (duplikat over) |
| `/api/journey/progress` | GET | ❌ **MANGEL** | - | Ja (Zod: journeyFilterSchema) | ✅ Aktiv | Dashboard progress |
| `/api/journey/progress/advance` | POST | ❌ **MANGEL** | - | Ja (Zod: journeyAdvanceSchema) | ✅ Aktiv | Journey UI |
| `/api/journey/reflect` | POST | ❌ **MANGEL** | - | Ja (Zod: journeyReflectSchema) | ✅ Aktiv | Journey reflect-komponentar |
| `/api/journey/resonance` | GET/POST | ✅ requireAuth | - | Ja (journeyResonanceSchema) | ✅ Aktiv | Resonans-motor |
| `/api/journey/today` | GET | ❌ **MANGEL** | - | Nei | ✅ Aktiv | Daily task-component |

### Profile Routes (app/api/profile/*)

| Route | Metode | Auth | Role | Input-validering | Status | Kalla fra |
|-------|--------|------|------|-----------------|--------|-----------|
| `/api/profile` | GET | ✅ getServerSession | User | Nei | ✅ Aktiv | Profile-visning |
| `/api/profile/setup` | POST | ✅ getServerSession | User | Ja (Zod: profileSetupSchema) | ✅ Aktiv | Profile-edit-side |

### Onboarding Routes (app/api/onboarding/*)

| Route | Metode | Auth | Role | Input-validering | Status | Kalla fra |
|-------|--------|------|------|-----------------|--------|-----------|
| `/api/onboarding/save` | POST | ✅ getServerSession | User | Ja (Zod: onboardingSaveSchema) | ✅ Aktiv | Onboarding-step |
| `/api/onboarding/progress` | GET | ❌ **MANGEL** | - | Nei | ✅ Aktiv | Progress-tracking |
| `/api/onboarding/deep-profile` | GET | ❌ **MANGEL** | - | Nei | ✅ Aktiv | Deep profile-flow |
| `/api/onboarding/complete` | POST | ✅ getServerSession | User | Ja (Zod: onboardingCompleteSchema) | ✅ Aktiv | Onboarding-finalisering |

### Conversation Routes (app/api/conversation/*)

| Route | Metode | Auth | Role | Input-validering | Status | Kalla fra |
|-------|--------|------|------|-----------------|--------|-----------|
| `/api/conversation/create` | POST | ✅ requireAuth | User | Ja (Zod: conversationCreateSchema) | ✅ Aktiv | `/matching/[id]/page.tsx` |

### Chat Routes (app/api/chat/*)

**Ingen chat-ruter funnet i /app/api/chat/. Chat-funksjonaliteten er implementert direkte i app/chat/ eller via server actions.**

### Questions Routes (app/api/questions/*)

| Route | Metode | Auth | Role | Input-validering | Status | Kalla fra |
|-------|--------|------|------|-----------------|--------|-----------|
| `/api/questions` | GET | ❌ **MANGEL** | - | Ja (Zod: questionsQuerySchema) | ✅ Aktiv | UI-question-komponentar, e2e-tester |

### Relationship Routes (app/api/relationship/*)

| Route | Metode | Auth | Role | Input-validering | Status | Kalla fra |
|-------|--------|------|------|-----------------|--------|-----------|
| `/api/relationship/memories` | GET/POST | ❌ **MANGEL** | - | Ja (Zod: relationshipMemoriesSchema) | ✅ Aktiv | Memories.tsx, MemoryLane.tsx |
| `/api/relationship/milestones` | GET/POST | ❌ **MANGEL** | - | Ja (Zod: relationshipMilestonesSchema) | ✅ Aktiv | MilestoneCard.tsx |
| `/api/relationship/timeline` | GET/POST | ❌ **MANGEL** | - | Ja (Zod: relationshipTimelineSchema) | ✅ Aktiv | Timeline.tsx, SharedHome.tsx |
| `/api/relationship/digest` | GET | ❌ **MANGEL** | - | Nei | ✅ Aktiv | WeeklyDigest.tsx |

### AI Routes (app/api/ai/*)

| Route | Metode | Auth | Role | Input-validering | Status | Kalla fra |
|-------|--------|------|------|-----------------|--------|-----------|
| `/api/ai/journey-guidance` | POST | ✅ getServerSession | User | Nei | ✅ Aktiv | Journey UI |
| `/api/ai/journey/next-step` | POST | ❌ **MANGEL** | - | Nei | ⚠️ Ukjent | **Ikke sjekka** |
| `/api/ai/match-insights` | POST | ❌ **MANGEL** | - | Nei | ✅ Aktiv | Match-insight-komponentar |
| `/api/ai/message-suggestions` | POST | ✅ getServerSession | User | Nei | ✅ Aktiv | Chat-komponentar |
| `/api/ai/profile/rewrite` | POST | ✅ feature-flag | - | Nei (template fallback) | ✅ Aktiv | Profile-edit-side |

### Admin Routes (app/api/admin/*)

| Route | Metode | Auth | Role | Input-validering | Status | Kalla fra |
|-------|--------|------|------|-----------------|--------|-----------|
| `/api/admin/auth` | POST | ❌ (public login) | - | Nei | ✅ Aktiv | Admin-login-side |
| `/api/admin/setup` | POST | ✅ getServerSession | - | Ja (Zod) | ⚠️ Feil (Prisma-typefeil) | Setup-wizard |
| `/api/admin/users` | GET/PATCH/DELETE | ✅ getServerSession | ✅ ADMIN | Ja (Zod) | ✅ Aktiv | Admin-users-liste |
| `/api/admin/journey/[id]/complete` | POST | ✅ requireAdmin | ✅ ADMIN | Ja (Zod: adminJourneyCompleteSchema) | ✅ Aktiv | Admin-journey-panel |
| `/api/admin/journey/[id]/next-step` | POST | ✅ getServerSession | - | Ja (Zod: adminJourneyNextStepSchema) | ✅ Aktiv | Admin-journey-nav |
| `/api/admin/journey/[id]/reset` | POST | ❌ **MANGEL** | - | Ja (Zod: adminJourneyResetSchema) | ✅ Aktiv | Admin-journey-reset |
| `/api/admin/matches/[id]/reset` | POST | ✅ adminAuthGuard | ✅ ADMIN | Ja (Zod: adminMatchResetSchema) | ✅ Aktiv | Admin-match-panel |
| `/api/admin/matches/[id]/review` | POST | ✅ adminAuthGuard | ✅ ADMIN | Ja (Zod: adminMatchReviewSchema) | ✅ Aktiv | Admin-match-review |
| `/api/admin/matches/[id]/unmatch` | POST | ✅ adminAuthGuard | ✅ ADMIN | Ja (Zod: adminMatchUnmatchSchema) | ✅ Aktiv | Admin-match-unmatch |
| `/api/admin/notification/[id]` | DELETE | ✅ requireAdmin + castToAdminUser | ✅ ADMIN | Ja (Zod: adminConversationFreezeSchema) | ✅ Aktiv | Admin-notifikasjonar |
| `/api/admin/notifications` | GET | ✅ requireAdmin + castToAdminUser | ✅ ADMIN | Nei | ✅ Aktiv | Admin-notifikasjonsliste |
| `/api/admin/system-message` | POST | ✅ requireAdmin + castToAdminUser | ✅ ADMIN | Nei | ✅ Aktiv | Admin-systemmelding |
| `/api/admin/security/overview` | GET | ✅ requireAdmin + castToAdminUser | ✅ ADMIN | Nei | ✅ Aktiv | Admin-security-dashboard |
| `/api/admin/observability/heatmap` | GET | ✅ requireAdmin + castToAdminUser | ✅ ADMIN | Nei | ✅ Aktiv | Admin-observability |
| `/api/admin/observability/metrics` | GET | ✅ requireAdmin + castToAdminUser | ✅ ADMIN | Nei | ✅ Aktiv | Admin-metrics-dashboard |
| `/api/admin/observability/traces` | GET | ✅ requireAdmin + castToAdminUser | ✅ ADMIN | Nei | ✅ Aktiv | Admin-tracing |
| `/api/admin/ai/logs` | GET | ✅ requireAdmin + castToAdminUser | ✅ ADMIN | Nei | ✅ Aktiv | Admin-AI-logging |

### Admin System-Ruter (app/api/admin/system/*)

**MERK:** Dette domenet er overlap med admin/observability/. Vurder å slå sammen.

| Route | Metode | Auth | Role | Input-validering | Status | Kalla fra |
|-------|--------|------|------|-----------------|--------|-----------|
| `/api/admin/system/errors` | GET | ❌ **MANGEL** | - | Nei | ⚠️ Ukjent | **Ubruk?** |
| `/api/admin/system/logs` | GET | ❌ **MANGEL** | - | Nei | ⚠️ Ukjent | **Ubruk?** |
| `/api/admin/system/overview` | GET | ❌ **MANGEL** | - | Nei | ⚠️ Ukjent | **Ubruk?** |
| `/api/admin/system/rate-limits` | GET | ❌ **MANGEL** | - | Nei | ⚠️ Ukjent | **Ubruk?** |
| `/api/admin/system/realtime` | GET | ❌ **MANGEL** | - | Nei | ⚠️ Ukjent | **Ubruk?** |

### Payment Routes (app/api/payment/*)

| Route | Metode | Auth | Role | Input-validering | Status | Kalla fra |
|-------|--------|------|------|-----------------|--------|-----------|
| `/api/payment/create-checkout-session` | POST | ✅ getServerSession | User | Ja (Zod: createCheckoutSessionSchema) | ✅ Aktiv | Betalings-side |
| `/api/payment/webhook` | POST | ❌ (Stripe signature check) | - | Nei | ✅ Aktiv | Stripe webhook |

### System Routes (app/api/system/*)

| Route | Metode | Auth | Role | Input-validering | Status | Kalla fra |
|-------|--------|------|------|-----------------|--------|-----------|
| `/api/system/health` | GET | ❌ **MANGEL** (public health) | - | Nei | ✅ Aktiv | External monitoring |
| `/api/system/latency` | GET | ❌ **MANGEL** | - | Nei | ✅ Aktiv | **Ubruk?** |

### Analytics Routes (app/api/analytics/*)

| Route | Metode | Auth | Role | Input-validering | Status | Kalla fra |
|-------|--------|------|------|-----------------|--------|-----------|
| `/api/analytics/track` | POST | ❌ **MANGEL** | - | Nei | ✅ Aktiv | Analytics-client SDK |

### Cron Routes (app/api/cron/*)

| Route | Metode | Auth | Role | Input-validering | Status | Kalla fra |
|-------|--------|------|------|-----------------|--------|-----------|
| `/api/cron/journey` | GET | ❌ (cron auth via header) | - | Nei | ✅ Aktiv | Vercel cron / external scheduler |
| `/api/cron/matching` | GET | ❌ **MANGEL** | - | Nei | ✅ Aktiv | Cron-matching-jobb |

### Dashboard Routes (app/api/dashboard/*)

| Route | Metode | Auth | Role | Input-validering | Status | Kalla fra |
|-------|--------|------|------|-----------------|--------|-----------|
| `/api/dashboard/overview` | GET | ✅ getServerSession | User | Nei | ✅ Aktiv | Dashboard-side |
| `/api/dashboard` | GET/POST | ❌ **MANGEL** | - | Nei | ⚠️ Ukjent | **Ubruk?** |

### Dev Routes (app/api/dev/*)

| Route | Metode | Auth | Role | Input-validering | Status | Kalla fra |
|-------|--------|------|------|-----------------|--------|-----------|
| `/api/dev-login` | GET/POST | ❌ (dev-only) | - | Nei | ✅ Aktiv | Dev-login-side |
| `/api/dev/setup` | POST | ❌ **MANGEL** | - | Ja (Zod) | ✅ Aktiv | Dev-setup-verktøy |

### Notifications Routes (app/api/notifications/*)

| Route | Metode | Auth | Role | Input-validering | Status | Kalla fra |
|-------|--------|------|------|-----------------|--------|-----------|
| `/api/notifications` | GET | ❌ **MANGEL** | - | Nei | ✅ Aktiv | Notification-komponentar |
| `/api/notifications/[id]/read` | POST | ❌ **MANGEL** | - | Nei | ✅ Aktiv | Mark-as-read-funksjonalitet |

---

## 3. AUTH-STATUS PER RUTE

### ✅ Med auth-sjekk (~40 ruter)
```
/api/auth/[...nextauth]          → NextAuth
/api/dashboard/overview           → getServerSession
/api/journey/[conversationId]     → getServerSession
/api/profile                      → getServerSession
/api/profile/setup                → getServerSession
/api/onboarding/save              → getServerSession
/api/onboarding/complete          → getServerSession
/api/conversation/create          → requireAuth
/api/match/score                  → requireAuth ✅ (ny)
/api/journey/resonance            → requireAuth ✅ (ny)
/admin/* (alle)                   → requireAdmin / adminAuthGuard / castToAdminUser
```

### ❌ Uten auth-sjekk (~17 ruter)
```
PUBLIC ROUTES (should be public):
/api/auth/magic-link              ✅ Public login endpoint
/api/auth/magic-link/verify       ✅ Magic link verification
/api/auth/phone/send              ✅ Phone login
/api/auth/phone/verify            ✅ Phone verification
/api/auth/request-reset           ✅ Password reset
/api/auth/oauth/vipps/*           ✅ OAuth flow
/api/system/health                ✅ Health check (public)
/admin/auth                       ✅ Admin login
/cron/journey                     ✅ Cron auth via header

NEEDS AUTH:
/api/match/accept                 ❌ Mangler auth-sjekk!
/api/match/insight                ❌ Mangler auth-sjekk!
/api/match/status                 ❌ Mangler auth-sjekk!
/api/journey/progress             ❌ Mangler auth-sjekk!
/api/journey/progress/advance     ❌ Mangler auth-sjekk!
/api/journey/reflect              ❌ Mangler auth-sjekk!
/api/journey/today                ❌ Mangler auth-sjekk!
/api/onboarding/progress          ❌ Mangler auth-sjekk!
/api/onboarding/deep-profile      ❌ Mangler auth-sjekk!
/api/questions                    ❌ Mangler auth-sjekk!
/api/relationship/memories        ❌ Mangler auth-sjekk!
/api/relationship/milestones      ❌ Mangler auth-sjekk!
/api/relationship/timeline        ❌ Mangler auth-sjekk!
/api/relationship/digest          ❌ Mangler auth-sjekk!
/api/ai/journey/next-step         ❌ Mangler auth-sjekk!
/api/admin/system/errors          ❌ Mangler auth-sjekk!
/api/admin/system/logs            ❌ Mangler auth-sjekk!
/api/admin/system/overview        ❌ Mangler auth-sjekk!
/api/admin/system/rate-limits     ❌ Mangler auth-sjekk!
/api/admin/system/realtime        ❌ Mangler auth-sjekk!
/api/admin/journey/[id]/reset     ❌ Mangler requireAdmin!
/api/notifications                ❌ Mangler auth-sjekk!
/api/notifications/[id]/read      ❌ Mangler auth-sjekk!
/api/system/latency               ❌ Mangler auth-sjekk! (kan være public)
/api/analytics/track              ⚠️ Public tracking (akseptabelt)
/api/payment/webhook              ✅ Stripe signature verification
/api/dashboard                    ❌ Ukjent status
```

---

## 4. ROLE-STATUS PER RUTE

### ✅ Med role-check (ADMIN)
Administrative endpoints har korrekt rolle-verifisering:
```
/admin/users/*                   → requireAdmin / getServerSession + admin check
/admin/journey/[id]/*            → requireAdmin (complete), getServerSession (others)
/admin/matches/[id]/*            → adminAuthGuard
/admin/notification/*            → requireAdmin + castToAdminUser
/admin/notifications             → requireAdmin + castToAdminUser
/admin/security/overview         → requireAdmin + castToAdminUser
/admin/observability/*           → requireAdmin + castToAdminUser
/admin/system-message            → requireAdmin + castToAdminUser
/admin/ai/logs                   → requireAdmin + castToAdminUser
```

### ❌ Uten role-check (burde vore admin-ruter?)
```
/admin/setup                     → Kun getServerSession, ingen ADMIN-sjekk
/admin/journey/[id]/next-step    → Kun getServerSession
/admin/journey/[id]/reset        → Ingen auth-sjekk!
```

---

## 5. INPUT-VALIDERING-STATUS

### ✅ Med Zod-validering (25+ schemas definert)
Schemas er definert i **lib/validation/api.ts**:

| Schema | Brukt i |
|--------|---------|
| `magicLinkSchema` | auth/magic-link |
| `phoneSendSchema` | auth/phone/send |
| `phoneVerifySchema` | auth/phone/verify |
| `requestResetSchema` | auth/request-reset |
| `matchScoreSchema` | match/score ✅ (ny) |
| `matchAcceptSchema` | match/accept |
| `matchInsightSchema` | match/insight |
| `journeyReflectSchema` | journey/reflect |
| `journeyResonanceSchema` | journey/resonance |
| `journeyAdvanceSchema` | journey/progress/advance |
| `profileSetupSchema` | profile/setup |
| `onboardingSaveSchema` | onboarding/save |
| `onboardingCompleteSchema` | onboarding/complete |
| `conversationCreateSchema` | conversation/create |
| `createCheckoutSessionSchema` | payment/create-checkout-session |
| `questionsQuerySchema` | questions |
| `relationshipMemoriesSchema` | relationship/memories |
| `relationshipMilestonesSchema` | relationship/milestones |
| `relationshipTimelineSchema` | relationship/timeline |
| `adminJourneyCompleteSchema` | admin/journey/[id]/complete |
| `adminMatchResetSchema` | admin/matches/[id]/reset |
| + flere admin-schemas | - |

### ❌ Uten input-validering (~30 ruter)
De fleste GET-ruter og enkelte POST-rutar mangler Zod-validering.

---

## 6. RESPONSMFORMAT-STATUS

### ✅ Med standardisert format (10+ ruter)
```typescript
// Success
{ success: true, data: { ... } }

// Error
{ error: 'Feilmelding', code: 'ERROR_CODE' }
```

### ❌ Ikke-standardisert (~45 ruter)
Mange ruter bruker fortsatt:
- `new Response(JSON.stringify(...))` i staden for `NextResponse.json()`
- `{ ok: true, ... }` i staden for `{ success: true, data: { ... } }`
- Manglende `code` på error-responsar

Standardisert i **docs/API-RESPONSE-STANDARD.md**

---

## 7. SIKKERHETSSTATUS

### Auth-gap (kritisk)
| Rute | Problem |
|------|---------|
| `/api/match/accept` | Ingen auth-sjekk! |
| `/api/match/insight` | Ingen auth-sjekk! |
| `/api/match/status` | Ingen auth-sjekk! |
| `/api/journey/progress` | Ingen auth-sjekk! |
| `/api/journey/reflect` | Ingen auth-sjekk! |
| `/api/relationship/*` | Ingen auth-sjekk! |
| `/api/admin/system/*` | Ingen auth-sjekk! (5 filer) |

### CSRF-beskyttelse
- **Status:** Implementert via `lib/auth/csrf.ts`
- **Aktivering:** `ENABLE_CSRF_PROTECTION=true` i `.env`
- **Utfordra til:** Alle POST-ruter treng csrfCheck-kall

### Rate Limiting
- Status: Delvis implementert (cron-jobbar har egen rate-limit)
- Mangler for: Public endpoints som `/api/auth/magic-link`, `/api/auth/phone/send`

---

## 8. FILSTRUKTUR

```
app/api/
├── admin/                     # Admin panel API (15+ ruter)
│   ├── ai/logs                # ✅ Med auth + role
│   ├── auth                   # ✅ Public login
│   ├── conversation/[id]      # ✅ Med auth
│   ├── journey/[id]           # ⚠️ Delvis auth
│   ├── matches/[id]           # ✅ Med adminAuthGuard
│   ├── notification/[id]      # ✅ Med auth + role
│   ├── notifications          # ✅ Med auth + role
│   ├── observability/         # ✅ Med auth + role (3 filer)
│   ├── security/overview      # ✅ Med auth + role
│   ├── setup                  # ⚠️ Feil (Prisma)
│   ├── system-message         # ✅ Med auth + role
│   └── system/*               # 🟡 Ukjent auth (5 filer - vurder sletting)
│   └── users                  # ✅ Med auth + role
├── ai/                        # AI features (5 ruter)
│   ├── journey-guidance       # ✅ Med auth
│   ├── journey/next-step      # ❌ Mangler auth
│   ├── match-insights         # ✅ Med auth
│   ├── message-suggestions    # ✅ Med auth
│   └── profile/rewrite        # ✅ Med feature-flag
├── analytics/track            # ⚠️ Public (akseptabelt)
├── auth/                      # Auth endpoints (8+ ruter)
│   ├── [...nextauth]          # ✅ NextAuth
│   ├── magic-link             # ✅ Public login
│   ├── oauth/vipps/*          # ✅ OAuth flow (ny mapping)
│   ├── phone/send             # ✅ Public
│   ├── phone/verify           # ✅ Public
│   ├── request-reset          # ✅ Public
│   └── vipps/*                # 🟡 Deprecated (flytta til /oauth/)
├── conversation/create        # ✅ Med auth
├── cron/                      # Cron job endpoints (2 ruter)
│   ├── journey                # ✅ Cron-auth via header
│   └── matching               # ⚠️ Mangler auth-header sjekk
├── dashboard/*                # ✅ Med auth (2 ruter)
├── dev-login                  # ✅ Dev-only
├── dev/setup                  # ⚠️ Uten auth-sjekk
├── journey/                   # Journey API (7 ruter)
│   ├── [conversationId]       # ✅ Med auth (gamle mapping)
│   ├── conversations/[id]     # ✅ Ny mapping (duplikat)
│   ├── progress               # ❌ Mangler auth
│   ├── progress/advance       # ❌ Mangler auth
│   ├── reflect                # ❌ Mangler auth
│   ├── resonance              # ✅ Med auth
│   └── today                  # ❌ Mangler auth
├── match/                     # Match API (5 ruter)
│   ├── accept                 # ❌ Mangler auth!
│   ├── insight                # ❌ Mangler auth!
│   ├── route.ts               # ✅ Med auth
│   ├── score                  # ✅ Med auth + Zod (ny)
│   └── status                 # ❌ Mangler auth!
├── notifications/*            # ❌ Mangler auth (2 ruter)
├── onboarding/                # Onboarding API (4 ruter)
│   ├── complete               # ✅ Med auth
│   ├── deep-profile           # ❌ Mangler auth
│   ├── progress               # ❌ Mangler auth
│   └── save                   # ✅ Med auth + Zod
├── payment/                   # Payment API (2 ruter)
│   ├── create-checkout-session # ✅ Med auth + Zod
│   └── webhook                # ✅ Stripe signature
├── profile/                   # Profile API (2 ruter)
│   ├── route.ts               # ✅ Med auth
│   └── setup                  # ✅ Med auth + Zod
├── questions                  # ❌ Mangler auth
├── relationship/*             # ❌ Mangler auth (4 ruter)
├── system/                    # System API (2 ruter)
│   ├── health                 # ✅ Public health check
│   └── latency                # ⚠️ Ukjent bruk
```

---

## 9. UBUKTE RUTER

Ruter som **ikke** blir kalla fra UI, cron eller andre API-ruter:

| Route | Moglege årsak | Aksjon |
|-------|---------------|--------|
| `/api/admin/system/errors` | Ukjent/kall fra UI som ikke er funnet | ✅ Slett eller flytt til deprecated |
| `/api/admin/system/logs` | Ukjent/kall fra UI som ikke er funnet | ✅ Slett eller flytt til deprecated |
| `/api/admin/system/overview` | Ukjent/kall fra UI som ikke er funnet | ✅ Slett eller flytt til deprecated |
| `/api/admin/system/rate-limits` | Ukjent/kall fra UI som ikke er funnet | ✅ Slett eller flytt til deprecated |
| `/api/admin/system/realtime` | Ukjent/kall fra UI som ikke er funnet | ✅ Slett eller flytt til deprecated |
| `/api/dashboard` (uten subpath) | Mangler funksjonalitet | ✅ Slett |
| `/api/dev/setup` | Dev-verktøy (ikke prod) | ⚠️ Behald i .gitignore / slett i prod |
| `/api/ai/journey/next-step` | Ukjent/kall fra UI | ⚠️ Verifiser kall før sletting |

---

## 10. DEPRECATED RUTER

| Deprecated | Ny mapping | Merknad |
|------------|-----------|---------|
| `/api/auth/vipps/authorize` | `/api/auth/oauth/vipps/authorize` | OAuth-standardisering |
| `/api/auth/vipps/callback` | `/api/auth/oauth/vipps/callback` | OAuth-standardisering + redirectUri oppdatert |
| `/api/journey/[conversationId]` | `/api/journey/conversations/[conversationId]` | Mer beskrivande path |

---

## 11. FORBEDRINGSPOKTER

### Høg prioritet (kritisk sikkerheit)
1. **Legg til auth-sjekk** i: `/api/match/accept`, `/api/match/insight`, `/api/match/status`
2. **Legg til auth-sjekk** i: `/api/relationship/*` (4 filer)
3. **Legg til auth-sjekk** i: `/api/journey/progress`, `/api/journey/reflect`, `/api/journey/today`
4. **Legg til requireAdmin** i: `/api/admin/system/*` (5 filer) og `/api/admin/journey/[id]/reset`
5. **Slett deprecated**: `/api/auth/vipps/*`

### Medium prioritet (konsistens)
6. **Standardiser responsformat** på alle ~45 ikke-standardiserte ruter
7. **Flytt cron/matching til header-auth** (same som cron/journey)
8. **Legg til Zod-validering** på GET-ruter med query parameters
9. **Duplikat fjerning**: `/api/journey/[conversationId]` og `/api/journey/conversations/[conversationId]`

### Lav prioritet (optimalisering)
10. **Sett `dynamic = 'error'`** på `/api/system/health` (kan være static)
11. **Slå sammen admin/system** med admin/observability eller slett om ubruk
12. **CSRF-beskyttelse** til alle POST-ruter som treng det

---

## 12. FØR/ETTER-OVERSIKT

### Før (problema)
```
❌ 35+ filer med export const dynamic INNI funksjon
❌ match/score uten Zod-validering
❌ match/score og journey/resonance uten auth-sjekk
❌ admin/journey/[id]/complete uten requireAdmin
❌ vipps/* uten /oauth/ mapping
❌ [id] i staden for semantiske namn ([conversationId], [userId])
❌ ~45 ruter uten standardisert responsformat
❌ ~17 ruter uten auth-sjekk
```

### Etter (løysing)
```
✅ Alle exports på rett plass (module-nivå)
✅ match/score med Zod-validering + auth-sjekk
✅ journey/resonance med auth-sjekk for GET og POST
✅ admin/journey/[id]/complete med requireAdmin
✅ vipps/* → oauth/vipps/* mapping fullført
✅ lib/validation/api.ts med 25+ Zod-schemas
✅ docs/API-RESPONSE-STANDARD.md med komplett standard
✅ lib/auth/csrf.ts med CSRF-beskyttelse
✅ Journey: [conversationId] → conversations/[conversationId]
```

---

# SLUTT PÅ API-ROUTES-OVERVIEW