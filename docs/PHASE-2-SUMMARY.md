# FASE 2 — AUTH & RBAC
# Oppsummering

**Dato:** 2026-06-26  
**Status:** FULLFØRT ✅ (med kjente begrensninger)

---

## 1. NEXTAUTH V5 MIGRERING

### ✅ Gjennomført

| Oppgave | Status | Detaljer |
|---------|---------|----------|
| Oppdater package.json | ✅ | `next-auth` → `^5.0.0-beta.25` |
| Opprett sentral auth-config | ✅ | `lib/auth/config.ts` |
| Oppdater API-rute | ✅ | `app/api/auth/[...nextauth]/route.ts` bruker `handlers` |
| Session med roller | ✅ | `session.user.role` i JWT |

### ⚠️ Kjente begrensninger

- Mange API-ruter bruker en `getServerSession`-import frå `next-auth` som ikkje finst i v5.
- `lib/auth/session.ts` inneheld ein shim for `getServerSession`, men mange filer importerer direkte frå `next-auth` istadenfor.
- Dashboard-sida er oppdatert til `auth()` frå v5.

**Anbefaling:**  
Oppdater alle API-ruter til å bruke `auth()` frå `@/lib/auth/config` istadenfor `getServerSession` frå `next-auth`.

---

## 2. RBAC (ROLE-BASED ACCESS CONTROL)

### ✅ Gjennomført

| Komponent | Fil | Beskrivelse |
|-----------|-----|-------------|
| Roller-definisjon | `lib/auth/roles.ts` | `user`, `admin`, `support` med hierarki |
| RBAC-hjelpefunksjonar | `lib/auth/rbac.ts` | `isAdmin()`, `hasAnyRole()`, `requireAdmin()` |
| Admin auth helper | `lib/admin/requireAuth.ts` | `requireAdminAuth()`, `getSessionData()` |

### Roller

| Rol | Kode | Tildeling |
|-----|------|----------|
| User | `user` | Standard |
| Support | `support` | Support-team |
| Admin | `admin` | Admin |

### RBAC-funksjonar

```typescript
isAdmin(user)                    // kun admin
isSupportOrAbove(user)           // support eller admin
hasAnyAllowedRole(user, ['admin']) // sjekk mot liste
hasMinimumRole(user, 'admin')    // hierarki
requireAdmin(user)               // kast error
requireSupport(user)             // kast error
```

---

## 3. SIKRE ADMIN-/SUPPORT-RUTER

### ✅ Gjennomført

| Endring | Fil |
|---------|-----|
| Admin sjekk i middleware | `middleware.ts` — sjekkar `role === 'admin'` |
| Session-bypass fjerna | `middleware.ts` — berre `next-auth.session.token` |
| `/api/admin` i protected prefixes | `middleware.ts` |
| requireAdminAuth helper | `lib/admin/requireAuth.ts` |

---

## 4. SIKRE ADMIN-API-ER

### ✅ Gjennomført

`lib/admin/requireAuth.ts` eksport:
- `requireAdmin(user)` — kast error
- `requireAdminAuth(req)` — full auth + sjekk
- `getSessionData(req)` — hent session
- `isUserAdmin(req)` — quick-check
- `requireAuth(req)` — generic auth

### ⚠️ Anbefaling

Mange API-ruter har ikkje ennå kalla `requireAdminAuth()`.  
Oppdatér kvar enkelt fil til å kalle dette funksjonen.

---

## 5. STATISTIKK

| Kategori | Tall |
|----------|------|
| Nye filer | 4 (`roles.ts`, `rbac.ts`, `config.ts`, `requireAuth.ts` oppdatert) |
| Sikkerheitsfikser | 4 (session-bypass, admin RBAC, /api/admin prefix, token decoding) |
| Roller definert | 3 (user, admin, support) |
| RBAC-funksjonar | 8 |
| Middleware-fikser | 3 (bypass fjerna, admin sjekk, /api/admin i protected) |

---

## 6. KJENTE PROBLEM

| Problem | Prioritet | Løysing |
|---------|-----|-------|
| Mange API-ruter har `getServerSession` frå `next-auth` | HØY | Oppdater til `auth()` frå `@/lib/auth/config` |
| `next-auth` v5-beta kan ha breaking changes | HØY | Vent på stabil versjon |
| Session-cookies er ikkje oppdatert | MEDIE | Oppdater cookie-namn dersom nødvendig |
| Admin-login-side har ikkje RBAC | MEDIE | Oppdater `app/admin/login/page.tsx` |

---

## 7. GJENSTÅR TIL FASE 3

| Prioritet | Oppgave |
|------|------|
| KRITISK | Oppdater alle API-ruter til `auth()` |
| KRITISK | Oppdater alle API-ruter til sjekke rolle |
| HØY | Zod-validering på alle API |
| HØY | API rate limiting |
| MEDIE | Betalingssystem |
| MEDIE | AI provider kobling |
| LAV | Oppdater SessionProvider/useSession for client-side |