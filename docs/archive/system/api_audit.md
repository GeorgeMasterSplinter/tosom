# ToSom — API Audit Report (v2026)

> **DEL 1 av full system audit.**  
> Systematisk gjennomgang av alle API-ruter for Zod-validering, try/catch, auth og RBAC.

---

## 1. KODEKVALITET-OVERSIKT

### 1.1 TypeScript (`npx tsc --noEmit`)

| Mål | Resultat | Status |
|-----|----------|--------|
| 0 TypeScript-feil | **0 feil** | ✅ PASSER |

### 1.2 ESLint (`npm run lint`)

| Mål | Resultat | Status |
|-----|----------|--------|
| 0 eslint-feil | **0 feil, 4 warnings** | ✅ AKSEPTABELT |

**ESLint Warnings (kjent — admin useEffect):**

| Fil | Linje | Regel | Beskrivelse |
|-----|-------|-------|-------------|
| `app/admin/conversations/page.tsx` | 67 | `react-hooks/exhaustive-deps` | Mangler `fetchConversations` i dependency array |
| `app/admin/logs/page.tsx` | 63 | `react-hooks/exhaustive-deps` | Mangler `fetchLogs` i dependency array |
| `app/admin/matches/page.tsx` | 82 | `react-hooks/exhaustive-deps` | Mangler `fetchMatches` i dependency array |
| `app/admin/users/page.tsx` | 70 | `react-hooks/exhaustive-deps` | Mangler `fetchUsers` i dependency array |

**VURDERING:** Warnings er alle av samme type (useEffect dependencies i admin-sider). Ikke kritisk, men bør fikses med memoisering eller eksplicitte dependencies.

---

## 2. KритISK FUNN (CRITICAL)

### 🔴 CVE-INTERN-001: `app/api/chat/image/route.ts` — INGEN AUTH

| Egenskap | Verdi |
|----------|-------|
| Fil | `app/api/chat/image/route.ts` |
| Metode | POST |
| Problem | **Ingen autentisering** — anonym brukere kan laste opp bilder til serveren |
| Risiko | Høy — uautorisert fil-opplasting |

```ts
// NÅVÆRENDE KODE (ingen auth):
export async function POST(req: NextRequest) {
  // ❌ Ingen session-check
  const body = await req.json();
  // ... skriver fil til disk
}
```

**ANBEFALING:** Legg til `getServerSession()` + sjekk at brukeren er en deltaker i konversasjonen.

---

## 3. BRUKER-API-RUTER (Non-Admin)

### 3.1 Profil-ruter

| Rute | Zod | try/catch | Auth | RBAC | Status |
|------|-----|-----------|------|------|--------|
| `app/api/profile/route.ts` (GET) | ❌ | ❌ | ✅ `getServerSession()` | ❌ N/A | ⚠️ Medium |
| `app/api/profile/route.ts` (PUT) | ✅ `profileUpdateSchema` | ✅ | ✅ `getServerSession()` | ❌ N/A | ✅ Full-strict |
| `app/api/profile/setup/route.ts` (POST) | ❌ Manual check | ✅ | ✅ `getServerSession()` | ❌ N/A | ⚠️ Medium |

### 3.2 Match-ruter

| Rute | Zod | try/catch | Auth | RBAC | Status |
|------|-----|-----------|------|------|--------|
| `app/api/match/route.ts` (GET) | ❌ Manual | ✅ | ✅ `getServerSession()` | ❌ N/A | ⚠️ Medium |
| `app/api/match/route.ts` (POST) | ❌ Manual | ✅ | ✅ `getServerSession()` | ❌ N/A | ⚠️ Medium |
| `app/api/match/check/route.ts` (POST) | ❌ Manual | ✅ | ✅ `getServerSession()` | ❌ N/A | ⚠️ Medium |
| `app/api/match/insight/route.ts` (GET) | ❌ Manual | ⚠️ Partial | ✅ `getServerSession()` | ⚠️ Ownership check | ⚠️ Medium |
| `app/api/match/status/route.ts` | ❌ | ✅ | ✅ | ❌ | ⚠️ Medium |
| `app/api/match/score/route.ts` | ❌ | ✅ | ✅ | ❌ | ⚠️ Medium |
| `app/api/match/accept/route.ts` | ❌ | ✅ | ✅ | ❌ | ⚠️ Medium |

### 3.3 Chat-ruter

| Rute | Zod | try/catch | Auth | RBAC | Status |
|------|-----|-----------|------|------|--------|
| `app/api/chat/send/route.ts` (POST) | ❌ Manual | ✅ | ✅ `getServerSession()` | ⚠️ Conversation participant check | ⚠️ Medium |
| `app/api/chat/messages/route.ts` (GET) | ❌ Manual | ✅ | ✅ `getServerSession()` | ❌ **No ownership check** | 🔴 SVAKHET |
| `app/api/chat/conversation/[id]/route.ts` (GET) | ❌ None | ✅ | ✅ `getServerSession()` | ⚠️ Participant validation | ⚠️ Medium |
| `app/api/chat/image/route.ts` (POST) | ❌ Manual | ✅ | ❌ **INGEN AUTH** | ❌ N/A | 🔴 KRITISK |

### 3.4 Journey-ruter

| Rute | Zod | try/catch | Auth | RBAC | Status |
|------|-----|-----------|------|------|--------|
| `app/api/journey/today/route.ts` (GET) | ❌ Manual | ✅ | ✅ `requireAuth()` | ❌ N/A | ⚠️ Medium |
| `app/api/journey/check/route.ts` (GET) | ❌ Manual | ✅ | ✅ `getServerSession()` | ❌ N/A | ⚠️ Medium |
| `app/api/journey/progress/route.ts` | ❌ | ✅ | ✅ | ❌ | ⚠️ Medium |
| `app/api/journey/reflect/route.ts` | ❌ | ✅ | ✅ | ❌ | ⚠️ Medium |
| `app/api/journey/resonance/route.ts` | ❌ | ✅ | ✅ | ❌ | ⚠️ Medium |
| `app/api/journey/conversations/route.ts` | ❌ | ✅ | ✅ | ❌ | ⚠️ Medium |
| `app/api/journey/exit/route.ts` | ❌ | ✅ | ✅ | ❌ | ⚠️ Medium |

### 3.5 Presence-ruter

| Rute | Zod | try/catch | Auth | RBAC | Status |
|------|-----|-----------|------|------|--------|
| `app/api/presence/update/route.ts` (PATCH) | ❌ Raw JSON | ✅ | ✅ `getServerSession()` | ❌ N/A | ⚠️ Medium |
| `app/api/presence/get/[id]/route.ts` (GET) | ❌ No param validation | ✅ | ✅ `getServerSession()` | ❌ N/A | ⚠️ Medium |

### 3.6 Dashboard-ruter

| Rute | Zod | try/catch | Auth | RBAC | Status |
|------|-----|-----------|------|------|--------|
| `app/api/dashboard/overview/route.ts` (GET) | ❌ Manual | ✅ | ✅ `getServerSession()` | ❌ N/A | ⚠️ Medium |
| `app/api/dashboard/route.ts` (GET) | ❌ Manual | ✅ | ✅ `getServerSession()` | ❌ N/A | ⚠️ Medium |

### 3.7 Onboarding-ruter

| Rute | Zod | try/catch | Auth | RBAC | Status |
|------|-----|-----------|------|------|--------|
| `app/api/onboarding/progress/route.ts` (GET) | ❌ Manual | ✅ | ✅ `getServerSession()` | ❌ N/A | ⚠️ Medium |

### 3.8 System-ruter (bruker)

| Rute | Zod | try/catch | Auth | RBAC | Status |
|------|-----|-----------|------|------|--------|
| `app/api/system/messages/route.ts` (GET, POST) | ❌ Manual | ✅ | ✅ `getServerSession()` | ❌ N/A | ⚠️ Medium |

### 3.9 Auth-ruter (forventet åpne)

| Rute | Zod | try/catch | Auth | Status |
|------|-----|-----------|------|--------|
| `app/api/auth/test-login/route.ts` | ❌ Manual | ✅ | ❌ Forventet | ✅ OK |
| `app/api/auth/request-reset/route.ts` | ✅ `requestResetSchema` | ✅ | ❌ Forventet | ✅ OK |
| `app/api/auth/magic-link/route.ts` | ❌ | ✅ | ❌ Forventet | ✅ OK |

---

## 4. ADMIN API-RUTER

### 4.1 Full-Strict (4/4 checks) — 7 ruter

| Rute | Zod | try/catch | Auth | RBAC |
|------|-----|-----------|------|------|
| `api/admin/users/route.ts` | ✅ `validateQuery(adminUsersQuerySchema)` | ✅ | ✅ `requireAuth()` | ✅ `castToAdminUser` + ADMIN-sjekk |
| `api/admin/users/[id]/route.ts` | ✅ action validation | ✅ | ✅ `requireAuth()` | ✅ `castToAdminUser` + ADMIN-sjekk |
| `api/admin/matches/route.ts` | ✅ `validateQuery(adminMatchesQuerySchema)` | ✅ | ✅ `requireAuth()` | ✅ `castToAdminUser` + ADMIN-sjekk |
| `api/admin/conversations/route.ts` | ✅ `validateQuery(adminConversationsQuerySchema)` | ✅ | ✅ `requireAuth()` | ✅ `castToAdminUser` + ADMIN-sjekk |
| `api/admin/system-logs/route.ts` | ✅ `validateQuery(systemLogsQuerySchema)` | ✅ | ✅ `requireAuth()` | ✅ `castToAdminUser` + ADMIN-sjekk |
| `api/admin/resonance/route.ts` | ✅ `validateQuery(resonanceQuerySchema)` | ✅ | ✅ `requireAuth()` | ✅ `castToAdminUser` + ADMIN-sjekk |
| `api/admin/journey-content/route.ts` | ✅ (manual parseInt) | ✅ | ✅ `requireAuth()` | ✅ `castToAdminUser` + ADMIN-sjekk |

### 4.2 Medium-Strict (2-3 checks) — 17 ruter

**Gruppe: requireAuth + castToAdminUser (men mangler Zod)**

| Rute | Zod | try/catch | Auth | RBAC |
|------|-----|-----------|------|------|
| `api/admin/users/[id]/route.ts` (POST) | ❌ Manual action list | ✅ | ✅ `requireAuth()` | ✅ `castToAdminUser` + ADMIN |
| `api/admin/matches/[id]/inspector/route.ts` | ❌ Manual | ✅ | ✅ `requireAuth()` | ✅ `castToAdminUser` + ADMIN |
| `api/admin/conversation/[id]/freeze/route.ts` | ❌ `isValidObjectId` | ✅ | ✅ `requireAuth()` | ✅ `castToAdminUser` + ADMIN |
| `api/admin/conversation/[id]/unlock/route.ts` | ❌ `isValidObjectId` | ✅ | ✅ `requireAuth()` | ✅ `castToAdminUser` + ADMIN |
| `api/admin/journey-content/[day]/route.ts` | ❌ Manual parseInt | ✅ | ✅ `requireAuth()` | ✅ `castToAdminUser` + ADMIN |

**Gruppe: auth() + manual session check (mangler castToAdminUser)**

| Rute | Zod | try/catch | Auth | RBAC |
|------|-----|-----------|------|------|
| `api/admin/notifications/route.ts` | ❌ Manual | ✅ | ✅ `auth()` | ⚠️ `isAdminRole(rawUser.role)` |
| `api/admin/notification/[id]/route.ts` | ❌ Manual | ✅ | ✅ `auth()` | ⚠️ `isAdminRole(rawUser.role)` |
| `api/admin/system/errors/route.ts` | ❌ Manual | ✅ | ✅ `auth()` | ⚠️ `isAdminRole(rawUser.role)` |
| `api/admin/system/logs/route.ts` | ❌ Manual | ✅ | ✅ `auth()` | ⚠️ `isAdminRole(rawUser.role)` |
| `api/admin/system/overview/route.ts` | ❌ Manual | ✅ | ✅ `auth()` | ⚠️ `isAdminRole(rawUser.role)` |
| `api/admin/system/realtime/route.ts` | ❌ Manual | ✅ | ✅ `auth()` | ⚠️ `isAdminRole(rawUser.role)` |
| `api/admin/system/rate-limits/route.ts` | ❌ Manual | ✅ | ✅ `auth()` | ⚠️ `isAdminRole(rawUser.role)` |
| `api/admin/security/overview/route.ts` | ❌ Manual | ✅ | ✅ `auth()` | ⚠️ `isAdminRole(rawUser.role)` |
| `api/admin/observability/metrics/route.ts` | ❌ Manual | ✅ | ✅ `auth()` | ⚠️ `isAdminRole(rawUser.role)` |
| `api/admin/observability/traces/route.ts` | ❌ Manual | ✅ | ✅ `auth()` | ⚠️ `isAdminRole(rawUser.role)` |
| `api/admin/observability/heatmap/route.ts` | ❌ Manual | ✅ | ✅ `auth()` | ⚠️ `isAdminRole(rawUser.role)` |
| `api/admin/ai/logs/route.ts` | ❌ Manual | ✅ | ✅ `auth()` | ⚠️ `isAdminRole(rawUser.role)` |
| `api/admin/system-message/route.ts` | ❌ Manual | ✅ | ✅ `auth()` | ⚠️ `isAdminRole(rawUser.role)` |

### 4.3 Må Forbedres (0-1 checks) — 5 ruter

| Rute | Zod | try/catch | Auth | RBAC | Problem |
|------|-----|-----------|------|------|---------|
| `api/admin/matches/[id]/reset/route.ts` | ❌ | ✅ | ❌ Kun middleware | ❌ Ingen server-side auth | 🔴 SVAKHET |
| `api/admin/matches/[id]/review/route.ts` | ❌ | ✅ | ❌ Kun middleware | ❌ Ingen server-side auth | 🔴 SVAKHET |
| `api/admin/matches/[id]/unmatch/route.ts` | ❌ | ✅ | ❌ Kun middleware | ❌ Ingen server-side auth | 🔴 SVAKHET |
| `api/admin/conversation/[id]/route.ts` | ❌ | ✅ | ❌ Kun middleware | ❌ Ingen server-side auth | 🔴 SVAKHET |
| `api/admin/journey/[id]/complete/route.ts` | ❌ | ✅ | ⚠️ Partial | ❌ | ⚠️ Medium |

---

## 5. SAMMENDRAG & STATISTIKK

### 5.1 Totalt antall ruter: ~60+

| Kategori | Antall | Full-Strict | Medium | Må Forbedres |
|----------|--------|-------------|--------|-------------|
| Bruker-API (profile, match, chat, journey, presence, dashboard) | ~25 | 1 | ~24 | 0 |
| Auth-ruter | ~4 | N/A | N/A | 0 (forventet åpent) |
| Admin-API | ~35 | 7 | 17 | 5 |
| **TOTALT** | **~64** | **8 (12.5%)** | **41 (64%)** | **5 (7.8%)** |

### 5.2 Kritiske sårbarheter

| # | Rute | Problem | Anbefaling |
|---|------|---------|------------|
| 1 | `api/chat/image/route.ts` | Ingen auth | Legg til `getServerSession()` |
| 2 | `api/admin/matches/[id]/reset` | Kun middleware-vern | Legg til `requireAuth()` + `castToAdminUser()` |
| 3 | `api/admin/matches/[id]/review` | Kun middleware-vern | Legg til `requireAuth()` + `castToAdminUser()` |
| 4 | `api/admin/matches/[id]/unmatch` | Kun middleware-vern | Legg til `requireAuth()` + `castToAdminUser()` |
| 5 | `api/admin/conversation/[id]` | Kun middleware-vern | Legg til `requireAuth()` + `castToAdminUser()` |

### 5.3 Anbefalte forbedringer (ikke-kritisk)

1. **Zod-validering på alle ruter**: Kun 1 bruker-route og 7 admin-ruter har Zod. Mål: 80%+ dekning.
2. **Konsistent RBAC i Gruppe B (13 ruter)**: Erstatt `auth()` + manual sjekk med `requireAuth()` + `castToAdminUser()`.
3. **Ownership-sjekk på `api/chat/messages/route.ts`**: En bruker kan hente meldinger fra vilkårlig `conversationId`.
4. **Try/catch på GET i `api/profile/route.ts`**: Mangler error-håndtering.

---

## 6. KLASSIFISERINGSPERIODE (Strictness Nivåer)

### full-strict (4/4: Zod + try/catch + Auth + RBAC)
- `api/profile/route.ts` (PUT) ✅
- `api/admin/users/*` ✅
- `api/admin/matches/route.ts` ✅
- `api/admin/conversations/route.ts` ✅
- `api/admin/system-logs/route.ts` ✅
- `api/admin/resonance/route.ts` ✅
- `api/admin/journey-content/route.ts` ✅

### medium-strict (2-3/4)
- De fleste bruker-ruter (har auth + try/catch, mangler Zod)
- Gruppe B admin-ruter (har auth + RBAC, mangler Zod)
- ~41 ruter totalt

### må forbedres (0-1/4)
- `api/chat/image/route.ts` — 0 auth 🔴
- `api/admin/matches/[id]/{reset,review,unmatch}` — kun middleware
- `api/admin/conversation/[id]` — kun middleware
- `api/admin/journey/[id]/complete` — partial auth

---

*Dokument generert som del av full system audit & hardening plan (DEL 1).*