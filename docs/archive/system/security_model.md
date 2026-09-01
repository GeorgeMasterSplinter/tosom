# ToSom — Security Model & RBAC (v2026)

> **DEL 6 av full system audit.**  
> Dokumenterer autentiseringsarkitektur, rollebasert tilgangskontroll, rutesikring og identifiserte sårbarheter.

---

## 1. SIKKERHETSARKITEKTUR (Høynivå)

ToSom bruker en **lagdelt sikkerhetsmodell** med tre forsvarslag:

```
┌─────────────────────────────────────────────────┐
│ LAG 1: Next.js Middleware (middleware.ts)        │
│   - Første forsvarslinje for alle innkommende    │
│     HTTP-forespørsler                            │
│   - Cookie-inspeksjon (authjs.session-token)     │
│   - admin_token cookie-sjekk                     │
│   - RBAC via JWT-dekodning i middleware          │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│ LAG 2: API Route Guards (server-side)            │
│   - requireAuth() / requireAdmin()               │
│   - castToAdminUser() + role-sjekk               │
│   - getServerSession() i sensitive ruter         │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│ LAG 3: Database (Prisma)                         │
│   - Row-level role column på User-tabell         │
│   - Privat data beskyttet av API-lag             │
└─────────────────────────────────────────────────┘
```

---

## 2. AUTENTISERINGSMEKANISMER

### 2.1 NextAuth v5 (Primær — Alle brukere)

| Egenskap | Verdi |
|----------|-------|
| Bibliotek | `next-auth@^5.0.0-beta.25` (`@auth/core`) |
| Adapter | `@auth/prisma-adapter` (PostgreSQL) |
| Session-strategi | JWT (stateless) |
| Cookie-navn | `authjs.session-token` (v5), `next-auth.session.token` (legacy) |
| Konfigurasjonsfil | `lib/auth/config.ts` |

**Providers:**

| Provider | ID | Formål | Miljø |
|----------|----|--------|-------|
| EmailProvider | `email` | Magic Link (prod) | Alle |
| CredentialsProvider | `credentials` | Dev-login med passord | Kun dev (`DEV_LOGIN_ENABLED=true`) |

**JWT Callback** (`lib/auth/config.ts`):
- Setter `token.role` ved første login
- Fallback: `defaultRole()` → `'USER'` dersom ingen rolle er spesifisert
- Session callback mapper `token.sub → session.user.id` og `token.role → session.user.role`

### 2.2 JWT Utility (Sekundær — Ikke brukt i main auth)

| Egenskap | Verdi |
|----------|-------|
| Bibliotek | `jsonwebtoken` |
| Konfigurasjonsfil | `lib/jwt.ts` |
| Secret | `JWT_SECRET` env-var, fallback: `'dev-secret'` ⚠️ |
| Expires | 7 dager (hardcoded) |

**MERKE:** `lib/jwt.ts` eksporterer `signToken()` og `verifyToken()`, men disse er **ikke koblet til NextAuth**-flowet. Brukes kun til administrative tokens.

### 2.3 admin_token Cookie (Tredje — Middleware-alene)

| Egenskap | Verdi |
|----------|-------|
| Cookie-navn | `admin_token` |
| Gyldig verdi | `'valid'` (hardcoded string-sammenligning) ⚠️⚠️⚠️ |
| Hvor brukt | Kun i `middleware.ts` (`hasAdminToken()`) |
| Formål | Alternativ admin-autentisering uten NextAuth session |

---

## 3. ROLLEHIERARKI OG RBAC

### 3.1 Roller

Definisjon: `lib/auth/roles.ts`

| Rolle | Nivå | Beskrivelse |
|-------|------|-------------|
| `USER` | 1 | Standard bruker, tilgang til dashboard, chat, journey, matching |
| `SUPPORT` | 2 | Kundestøtte, kan se konversasjoner og brukere (begrenset) |
| `ADMIN` | 3 | Full tilgang til admin-panel, alle API-ruter, system-overvåking |

### 3.2 Rolle-hjelperfunksjoner

| Funksjon | Fil | Formål |
|----------|-----|--------|
| `hasAtLeastRole(role, minRole)` | `lib/auth/roles.ts` | Hierarkisk sjekk (SUPPORT ≥ USER) |
| `hasExactRole(role, target)` | `lib/auth/roles.ts` | Eksakt match |
| `hasAnyRole(role, allowed[])` | `lib/auth/roles.ts` | Flere tillatte roller |
| `defaultRole(role?)` | `lib/auth/roles.ts` | Fallback til `USER` |
| `isAdminRole(role)` | `lib/auth/roles.ts` | Case-insensitive admin-sjekk |
| `isAdmin(user)` | `lib/auth/rbac.ts` | Wrapper rundt `isAdminRole()` |
| `isSupportOrAbove(user)` | `lib/auth/rbac.ts` | SUPPORT eller ADMIN |
| `hasAnyAllowedRole(user, allowed[])` | `lib/auth/rbac.ts` | RBAC wrapper |
| `hasMinimumRole(user, minRole)` | `lib/auth/rbac.ts` | Hierarkisk sjekk med AuthenticatedUser |
| `requireAdmin(user)` | `lib/auth/rbac.ts` | Kaster Error hvis ikke admin |
| `requireSupport(user)` | `lib/auth/rbac.ts` | Kaster Error hvis ikke support/admin |

### 3.3 AuthenticatedUser Type

To typer eksisterer (duplicert kode):

**`lib/auth/admin-auth.ts:SimpleAdminUser`:**
```ts
{ id: string, email: string, name: string|null, image: string|null, role: Role }
```

**`lib/auth/rbac.ts:AuthenticatedUser`:**
```ts
{ id: string, name?: string|null, email?: string|null, image?: string|null, role: Role }
```

⚠️ **MERKE:** Duplikat-typedefinisjon. Burde samles til én type i `lib/auth/types.ts`.

### 3.4 castToAdminUser

`lib/auth/admin-auth.ts:castToAdminUser()`:
- Mottar raw session-user object
- Casts role via `isAdminRole()` → `'ADMIN'` eller `defaultRole()` → `'USER'`
- Kaster Error hvis `id` mangler
- **BRUKT I:** 20+ admin API-ruter

---

## 4. BESKYTTEDE RUTER — KOMPLETT MATRISE

### 4.1 Middleware-beskyttede ruter (`middleware.ts`)

**Offentlige stier (ingen auth kreves):**
| Sti | Formål |
|-----|--------|
| `/` | Landingsside |
| `/login` | Innlogging |
| `/register` | Registrering |
| `/onboarding/*` | Onboarding (page-ruter) |
| `/blogg/*`, `/priser/*`, `/om-oss/*`, etc. | Public innhold |
| `/maintenance` | Vedlikeholdside |
| `/dev-login` | Dev-login UI ⚠️ |
| `/api/dev-login` | Dev-login API ⚠️ |
| `/api/system/health` | Health-check |
| `/preview` | Preview-modus |
| `/_next/*` | Next.js statiske filer |
| `/favicon.ico` | Favicon |
| `/admin/login` | Admin login-page |

**Beskyttede API-prefix (krever session):**
| Prefix | Antall ruter | Beskrivelse |
|--------|-------------|-------------|
| `/api/profile` | ~4 | Brukerprofil |
| `/api/match` | ~7 | Matching |
| `/api/journey` | ~8 | Reise/Journey |
| `/api/conversation` | ~2 | Konversasjon |
| `/api/chat` | ~5 | Chat |
| `/api/system` | ~6 | System-meldinger |
| `/api/ai` | ~1 | AI-funksjoner |
| `/api/admin` | ~35 | Admin API |

**Admin-prefix (krever admin-role):**
| Prefix | Antall ruter | Mechanisme |
|--------|-------------|------------|
| `/admin/*` | 14+ pages | Middleware: `admin_token cookie OR NextAuth admin role` |

### 4.2 Admin API Routes — Detaljert RBAC-kartlegging

**Gruppe A: Fullt beskyttet (requireAuth + castToAdminUser + role !== 'ADMIN')**

| Rute | HTTP-metoder | Sekundær auth |
|------|-------------|---------------|
| `/api/admin/users` | GET | ✅ `requireAuth` + `castToAdminUser` + ADMIN-sjekk |
| `/api/admin/users/[id]` | GET, PUT, DELETE | ✅ `requireAuth` + `castToAdminUser` + ADMIN-sjekk |
| `/api/admin/matches` | GET | ✅ `requireAuth` + `castToAdminUser` + ADMIN-sjekk |
| `/api/admin/matches/[id]/inspector` | GET | ✅ `requireAuth` + `castToAdminUser` + ADMIN-sjekk |
| `/api/admin/matches/[id]/reset` | POST | ✅ Middleware-alene |
| `/api/admin/matches/[id]/review` | GET | ✅ Middleware-alene |
| `/api/admin/matches/[id]/unmatch` | POST | ✅ Middleware-alene |
| `/api/admin/conversations` | GET | ✅ `requireAuth` + `castToAdminUser` + ADMIN-sjekk |
| `/api/admin/conversation/[id]` | GET | ✅ Middleware-alene |
| `/api/admin/conversation/[id]/freeze` | POST | ✅ `requireAuth` + `castToAdminUser` + ADMIN-sjekk |
| `/api/admin/conversation/[id]/unlock` | POST | ✅ `requireAuth` + `castToAdminUser` + ADMIN-sjekk |
| `/api/admin/system-logs` | GET | ✅ `requireAuth` + `castToAdminUser` + ADMIN-sjekk |
| `/api/admin/resonance` | GET | ✅ `requireAuth` + `castToAdminUser` + ADMIN-sjekk |
| `/api/admin/journey-content` | GET, PUT | ✅ `requireAuth` + `castToAdminUser` + ADMIN-sjekk |
| `/api/admin/journey-content/[day]` | GET, PUT | ✅ `requireAuth` + `castToAdminUser` + ADMIN-sjekk |

**Gruppe B: auth() + session?.user (manuell sjekk)**

| Rute | HTTP-metoder | Sekundær auth |
|------|-------------|---------------|
| `/api/admin/notifications` | GET, POST | ✅ `auth()` + manual null-check |
| `/api/admin/notification/[id]` | PUT, DELETE | ✅ `auth()` + manual null-check |
| `/api/admin/system/errors` | GET | ✅ `auth()` + manual null-check |
| `/api/admin/system/logs` | GET | ✅ `auth()` + manual null-check |
| `/api/admin/system/overview` | GET | ✅ `auth()` + manual null-check |
| `/api/admin/system/realtime` | GET | ✅ `auth()` + manual null-check |
| `/api/admin/system/rate-limits` | GET | ✅ `auth()` + manual null-check |
| `/api/admin/security/overview` | GET | ✅ `auth()` + manual null-check |
| `/api/admin/observability/metrics` | GET | ✅ `auth()` + manual null-check |
| `/api/admin/observability/traces` | GET | ✅ `auth()` + manual null-check |
| `/api/admin/observability/heatmap` | GET | ✅ `auth()` + manual null-check |
| `/api/admin/ai/logs` | GET | ✅ `auth()` + manual null-check |
| `/api/admin/system-message` | GET, POST | ✅ `auth()` + manual null-check |

**Gruppe C: Kun middleware-beskyttet (ingen server-side auth)**

| Rute | HTTP-metoder | Risiko |
|------|-------------|--------|
| `/api/admin/matches/[id]/reset` | POST | ⚠️ Kun middleware |
| `/api/admin/matches/[id]/review` | GET | ⚠️ Kun middleware |
| `/api/admin/matches/[id]/unmatch` | POST | ⚠️ Kun middleware |
| `/api/admin/conversation/[id]` | GET | ⚠️ Kun middleware |

### 4.3 Rolle-matrise (Hva hver rolle kan gjøre)

| Handling | USER | SUPPORT | ADMIN | Anonym |
|----------|------|---------|-------|--------|
| Se egen profil | ✅ | ✅ | ✅ | ❌ |
| Oppdater egen profil | ✅ | ✅ | ✅ | ❌ |
| Chat (send/motta) | ✅ | ✅ | ✅ | ❌ |
| Journey/progresjon | ✅ | ✅ | ✅ | ❌ |
| Matching (motta match) | ✅ | ✅ | ✅ | ❌ |
| Se alle brukere | ❌ | ⚠️ Delvis | ✅ | ❌ |
| Se alle matcher | ❌ | ❌ | ✅ | ❌ |
| Se alle konversasjoner | ❌ | ⚠️ Delvis | ✅ | ❌ |
| Admin dashboard | ❌ | ❌ | ✅ | ❌ |
| System-logging | ❌ | ❌ | ✅ | ❌ |
| Observability/metrics | ❌ | ❌ | ✅ | ❌ |
| Freeze/unlock konversasjon | ❌ | ❌ | ✅ | ❌ |
| Unmatch brukere | ❌ | ❌ | ✅ | ❌ |
| Journey-content editing | ❌ | ❌ | ✅ | ❌ |
| Dev-login | ⚠️ Dev | ⚠️ Dev | ⚠️ Dev | ⚠️ Dev |

---

## 5. DEV-LOGIN — DETALJERT ANALYSE

### 5.1 Implementering

| Fil | Formål |
|-----|--------|
| `app/dev-login/page.tsx` | UI med knapper for hver testbruker |
| `app/api/dev-login/route.ts` | GET og POST endpoint |
| `app/api/dev-login/status/route.ts` | Status-endepunkt |
| `app/api/dev-login/users/route.ts` | Liste testbrukere |

### 5.2 Test-brukere

| ID | Email | Rolle | Formål |
|----|-------|-------|--------|
| `testA` | testA@tosom.dev | USER | E2E test user A |
| `testB` | testB@tosom.dev | USER | E2E test user B |
| `admin` | admin@tosom.dev | ADMIN | E2E admin user |

### 5.3 Sikkerhetsmekanismer

| Mekanisme | Implementert? | Detaljer |
|-----------|--------------|----------|
| `DEV_LOGIN_ENABLED` env-gate | ✅ | Alle API-ruter sjekker `DEV_LOGIN_ENABLED === 'true'` |
| Hardcoded user-liste | ✅ | Kun `testA`, `testB`, `admin` er tillatt |
| Returnerer 503 når disabled | ✅ | `{ error: 'Dev-login er ikke aktivert...' }` |
| Bruker riktig auth-pipeline | ✅ | Delegerer til `signIn('credentials', ...)` |
| Setter passord i DB | ⚠️ | SHA256-hash av `"123456"` (enkelt, men akseptabelt for dev) |

### 5.4 Middleware-Unngåelse

I `middleware.ts`, `/dev-login` og `/api/dev-login` er i `PUBLIC_PATHS`-listen:

```ts
const PUBLIC_PATHS = [
  '/maintenance',
  '/dev-login',        // ← UNNGÅR middleware-auth
  '/api/dev-login',    // ← UNNGÅR middleware-auth
  '/api/system/health',
  ...
]
```

Dette betyr dev-login er **alltid tilgjengelig i frontend**, men API-et sjekker `DEV_LOGIN_ENABLED` server-side.

---

## 6. IDENTIFISERTE SØRBARHETER

### 6.1 CRITICAL (Må fikses før produksjon)

| # | SV-ID | Beskrivelse | Severity | Lokasjon | Anbefaling |
|---|-------|-------------|----------|----------|------------|
| 1 | SV-001 | `admin_token === 'valid'` er hardcoded | **CRITICAL** | `middleware.ts:69` | Erstatt med kryptert, rotasjoner token. Lag en `setAdminToken()` admin-funksjon som genererer sikker hash. |
| 2 | SV-002 | `/api/admin/matches/[id]/reset`, `/review`, `/unmatch` har kun middleware-beskyttelse | **CRITICAL** | `app/api/admin/matches/[id]/**/route.ts` | Legg til `requireAuth()` + `castToAdminUser()` i hver route handler. |
| 3 | SV-003 | `lib/auth/requireAuth.ts` bruker naive auth: Bearer token = email-hash, session cookie = raw user ID | **CRITICAL** | `lib/auth/requireAuth.ts:24-50` | Erstatt med NextAuth v5 sin `auth()` funksjon. Nåværende implementasjon er sårbar for session hijacking. |

### 6.2 HIGH (Bør fikses før produksjon)

| # | SV-ID | Beskrivelse | Severity | Lokasjon | Anbefaling |
|---|-------|-------------|----------|----------|------------|
| 4 | SV-004 | `JWT_SECRET` fallback er `'dev-secret'` (hardcoded) | **HIGH** | `lib/jwt.ts:3` | Kast feil dersom `JWT_SECRET` mangler. Aldri bruk hardcoded secret. |
| 5 | SV-005 | `useSecureCookies: false` i auth-config | **HIGH** | `lib/auth/config.ts:139` | Sett `true` i produksjon (kreves for HTTPS). Bruk env-var. |
| 6 | SV-006 | Dupliserte AuthenticatedUser-typedefinisjoner | **MEDIUM** | `lib/auth/admin-auth.ts` + `lib/auth/rbac.ts` | Samle til én type i `lib/auth/types.ts` |
| 7 | SV-007 | Gruppe B admin-ruter (13 ruter) bruker kun `auth()` uten `castToAdminUser` | **HIGH** | Se liste over i Seksjon 4.2 | Legg til `castToAdminUser() + ADMIN-sjekk` for konsistent RBAC |
| 8 | SV-008 | Middleware JWT-dekodning (`getRoleFromSession`) er primitiv og sårbar | **MEDIUM** | `middleware.ts:82-91` | Bruk NextAuth v5 sitt offisielle decode i stedet for manual base64-parsing. Rolle er ikke kryptert i JWT payload. |

### 6.3 MEDIUM (Kan forbedres)

| # | SV-ID | Beskrivelse | Severity | Lokasjon | Anbefaling |
|---|-------|-------------|----------|----------|------------|
| 9 | SV-009 | Dev-login-side er frontend-tilgjengelig selv når `DEV_LOGIN_ENABLED=false` (viser kun "deaktivert"-melding) | **MEDIUM** | `middleware.ts:32-33` | Legg dev-login i en miljø-sjekk i middleware også |
| 10 | SV-010 | Ingen rate-limiting på login-endepunkter | **MEDIUM** | `app/api/auth/**` | Implementer rate-limits på `/api/auth/signin` og `/api/dev-login` |
| 11 | SV-011 | Ingen CSRF-beskyttelse nevnt eksplicit | **LOW** | Generelt | NextAuth v5 har by default CSRF-verifisering for API-routes. Bekreft dette er aktivt. |

### 6.4 LOW (Innformasjon)

| # | SV-ID | Beskrivelse | Severity | Lokasjon | Anbefaling |
|---|-------|-------------|----------|----------|------------|
| 12 | SV-012 | `SUPPORT`-rolle er definert i enum men har ingen dediserte ruter/funksjoner | **LOW** | Heltid | Enten implementer support-funksjonalitet eller fjern rollen fra aktiv bruk |

---

## 7. REKOMMANDERT FIX-PRIORITERING

```
PRIORITET 1 (CRITICAL — før prod):
├── SV-001: Erstatt hardcoded admin_token med kryptert token-system
├── SV-002: Legg til server-side auth på alle /api/admin/matches/[id]/* ruter
└── SV-003: Erstatt lib/auth/requireAuth.ts naive auth med NextAuth v5 auth()

PRIORITET 2 (HIGH — før prod):
├── SV-004: Fjern hardcoded JWT_SECRET fallback
├── SV-005: useSecureCookies = true i prod
├── SV-007: Konsistent RBAC på Gruppe B-ruter
└── SV-006: Samle dupliserte typer

PRIORITET 3 (MEDIUM — etter prod):
├── SV-008: Bedre JWT-dekodning i middleware
├── SV-009: miljø-gate på dev-login UI
└── SV-010: Rate-limiting på login

PRIORITET 4 (LOW — teknisk gjelder):
├── SV-011: Verifiser CSRF-beskyttelse
└── SV-012: Implementer eller fjern SUPPORT-rollen
```

---

## 8. SLUTTKOMMENTAR

ToSom sin sikkerhetsarkitektur er **velstrukturert** med god lagdeling (middleware → API guards → database). Den primære svakheten er at `admin_token`-mekanismen og flere admin-ruter mangler tilstrekkelig server-side vern. Ingen av funnene utgjør en akutt trussel i dev-miljø, men **SV-001, SV-002, SV-003 må fikses før produksjonsdrift.**

---

*Dokument generert som del av full system audit & hardening plan (DEL 6).*