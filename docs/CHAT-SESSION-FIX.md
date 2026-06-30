# Chat Session Fix

**Dato:** 30. juni 2026  
**Status:** ✅ Løyst

---

## Problem

Når ein brukar startar reisen via fake match, får dei:

1. **"Lastar samtale..."** spinner som aldri forsvinn (401-feil frå `/api/chat/messages`)
2. **404-feil** frå server action ved opprettelse av fake match

## Rotårsak

1. Ingen session blei oppretta for userA når fake match blei laga
2. Middleware beskytta ikkje `/api/chat`-ruter
3. `useChatMessages` returnerte ikkje `loading=false` ved 401-feil

---

## Løysing

### 1. `app/actions/createFakeMatch.ts` — Session + Account oppretting

Etter å ha oppretta userA og userB, no blir det oppretta:

- **Session** i `prisma.session` med gyldig token og expires (24 timer)
- **Account** i `prisma.account` med `provider: "credentials"` for NextAuth adapter

```typescript
// Opprett next-auth session for userA (dev kun)
const existingSession = await prisma.session.findFirst({
  where: { userId: userA.id },
  select: { id: true },
});

if (!existingSession) {
  await prisma.session.create({
    data: {
      id: `dev-session-${userA.id}`,
      userId: userA.id,
      sessionToken: "dev-session-token-" + userA.id,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    },
  });
}

// Oppdater også account for NextAuth adapter
await prisma.account.upsert({
  where: {
    provider_providerAccountId: {
      provider: "credentials",
      providerAccountId: userA.id,
    },
  },
  create: {
    id: `dev-account-${userA.id}`,
    userId: userA.id,
    type: "credentials",
    provider: "credentials",
    providerAccountId: userA.id,
    access_token: "dev-token",
    refresh_token: "dev-refresh",
    expires_at: Math.floor(Date.now() / 1000) + 86400,
    token_type: "Bearer",
    scope: "read write",
  },
  update: {
    access_token: "dev-token",
    refresh_token: "dev-refresh",
    expires_at: Math.floor(Date.now() / 1000) + 86400,
  },
});
```

### 2. `app/api/chat/messages/route.ts` — Bruk `auth()` frå next-auth

Bytte frå `getServerSession()` til `auth()` frå `@/lib/auth/config`:

```typescript
import { auth } from '@/lib/auth/config';

const session = await auth();
if (!session?.user?.id) {
  return NextResponse.json({ error: 'Ikke autentisert' }, { status: 401 });
}
```

Gjeld for både GET og POST endpoints.

### 3. `middleware.ts` — Beskytt `/api/chat`

Legge til `/api/chat` i `PROTECTED_API_PREFIXES`:

```typescript
const PROTECTED_API_PREFIXES = [
  '/api/profile',
  '/api/matching',
  '/api/journey',
  '/api/conversation',
  '/api/chat',      // ← ny
  '/api/system',
  '/api/ai',
  '/api/admin',
]
```

### 4. `hooks/useChatMessages.ts` — loading=false ved 401

```typescript
if (res.status === 401) {
  setLoading(false);  // ← ny
  return;
}
```

---

## Teststeg

1. Gå til `/dev-login` eller `/api/dev-login?userId=test-user-1`
2. Fullfør onboarding til steg 10
3. Klikk "Start reisen"
4. Bekreft at chat-samtalen lastar utan spinner
5. Bekreft at meldingar blir viste korrekt

---

## Filendringar

| Fil | Endring |
|-----|---------|
| `app/actions/createFakeMatch.ts` | +session +account oppretting |
| `app/api/chat/messages/route.ts` | Bytt `getServerSession()` → `auth()` |
| `middleware.ts` | +`/api/chat` til PROTECTED_API_PREFIXES |
| `hooks/useChatMessages.ts` | +`setLoading(false)` ved 401 |
| `docs/CHAT-SESSION-FIX.md` | Ny rapport |

---

## Merknader

- Session er berre gyldig i 24 timar (dev-kun)
- Account brukar `credentials`-provider for NextAuth adapter
- For produksjon bør ein bruke ekte magic link eller OAuth