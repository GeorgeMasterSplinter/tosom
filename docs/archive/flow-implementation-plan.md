# ToSom — Throughføringsplan (Testbruker Flow)

**Dato:** 30.06.2026  
**Type:** Konkret gjennomføringsplan — basert på flow-mapping  
**Mål:** Sikre testbruker havner i onboarding (ikke direkte til dashboard)

---

## PROBLEM

Dev-login (`/api/dev-login`) redirecter **alltid** til `/dashboard`, uavhengig av om testbrukeren har fullført onboarding eller ikke.

**Konsekvens:** En ny testbruker havner på et tomt dashboard med ingen info om hva de skal gjøre.

---

## LØSNING — 3 små justeringer

---

### JUSTERING 1: Dev-login sjekk onboardingComplete

**Fil:** `app/api/dev-login/route.ts`

**Endring:** Før redirect, sjekk om brukeren finnes i DB og om onboarding er fullført.

```typescript
// Etter line 23 (hvor user er hentet), legg til:

// Sjekk onboarding-status i DB
const user = await prisma.user.findUnique({
  where: { email: user.email },
  select: { onboardingComplete: true },
});

// Hvis onboarding ikke fullført → redirect til /onboarding
if (!user?.onboardingComplete) {
  const response = NextResponse.redirect(new URL('/onboarding', req.url));
  response.cookies.set('next-auth.session.token', sessionToken, {
    httpOnly: true, secure: false, sameSite: 'lax',
    path: '/', maxAge: 86400,
  });
  return response;
}

// Hvis onboarding fullført → redirect til /dashboard
const response = NextResponse.redirect(new URL('/dashboard', req.url));
response.cookies.set('next-auth.session.token', sessionToken, {
  httpOnly: true, secure: false, sameSite: 'lax',
  path: '/', maxAge: 86400,
});
return response;
```

**Forutsetning:** `prisma` må importeres øverst i filen:
```typescript
import { prisma } from '@/lib/prisma';
```

---

### JUSTERING 2: Dashboard vis påminning om onboarding

**Fil:** `lib/dashboard/data.ts`

**Endring:** Ingen kode-endring nødvendig. Dashboard viser allerede onboarding-status i `ProfileStatusSection` med:
- Progress bar (0% hvis onboarding ikke fullført)
- Checkbox som viser ⬜ for onboarding
- CTA-knapp med tekst "Fullfør profilen din"

**Mål:** Denne er allerede løst — dashboard viser tydelig at onboarding mangler.

---

### JUSTERING 3: Fix /api/matching route (valgfritt)

**Fil:** `app/api/matching/route.ts` (må opprettes)

**Problem:** OnboardingFlow kaller `POST /api/matching`, men denne endpointen eksisterer ikke. Koden ligger i `lib/matching/` men det er ingen API-rute.

**Valgfritt:** Opprett en API-rute som kaller matching-motoren:

```typescript
// app/api/matching/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { findBestMatchFor } from '@/lib/matching';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { userId } = await req.json();
  if (!userId) {
    return NextResponse.json({ error: 'userId required' }, { status: 400 });
  }

  try {
    const bestMatch = await findBestMatchFor(userId);
    return NextResponse.json({ success: true, match: bestMatch });
  } catch (error) {
    return NextResponse.json(
      { error: 'Matching failed' },
      { status: 500 }
    );
  }
}
```

---

## GJENOMFØRING — STEG FOR STEG

### For GEORGE — Hvordan teste som testbruker

#### STEG 1: Logg inn som testbruker

```bash
# I browser:
http://localhost:3000/api/dev-login?userId=test-user-1
```

#### STEG 2: Sjekk der havner

**FØR justering:** Haver på `/dashboard` med tom profil
**ETTER justering:** Haver på `/onboarding` hvis onboarding ikke fullført

#### STEG 3: Fullfør onboarding (hvis redirectet dit)

1. Fyll ut alle 10 steg
2. Klikk "Start reisen" på steg 9
3. Should lande på `/dashboard` med profil: ✓

#### STEG 4: Test pålogging igjen

```bash
http://localhost:3000/api/dev-login?userId=test-user-1
```

Skull nå should lande på `/dashboard` (ikke `/onboarding`) siden onboarding er fullført.

---

## SJABLON FOR DEV-LOGIN (FULL)

Her er den fulle, oppdaterte versjonen av `app/api/dev-login/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';  // ✅ Ny import

const USERS = {
  'test-user-1': { id: 'test-user-1', email: 'test1@tosom.no', name: 'Testbruker 1', role: 'USER' },
  'test-user-2': { id: 'test-user-2', email: 'test2@tosom.no', name: 'Testbruker 2', role: 'USER' },
  'test-user-3': { id: 'test-user-3', email: 'test3@tosom.no', name: 'Testbruker 3', role: 'USER' },
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId || !(userId in USERS)) {
    return NextResponse.json(
      { error: 'Ugyldig brukernavn. Bruk: /api/dev-login?userId=test-user-1' },
      { status: 400 }
    );
  }

  const user = USERS[userId as keyof typeof USERS];

  // ✅ NY: Sjekk onboarding-status
  const dbUser = await prisma.user.findUnique({
    where: { email: user.email },
    select: { onboardingComplete: true },
  });

  // ✅ NY: Hvis onboarding ikke fullført → redirect til /onboarding
  if (!dbUser?.onboardingComplete) {
    const sessionToken = await createSessionToken(user);
    const response = NextResponse.redirect(new URL('/onboarding', req.url));
    response.cookies.set('next-auth.session.token', sessionToken, {
      httpOnly: true, secure: false, sameSite: 'lax',
      path: '/', maxAge: 86400,
    });
    return response;
  }

  // Opprinnelig: redirect til /dashboard
  const sessionToken = await createSessionToken(user);
  const response = NextResponse.redirect(new URL('/dashboard', req.url));
  response.cookies.set('next-auth.session.token', sessionToken, {
    httpOnly: true, secure: false, sameSite: 'lax',
    path: '/', maxAge: 86400,
  });
  return response;
}

// Hjelp-funksjon for session-token (ekstrahert fra eksisterende kode)
async function createSessionToken(user: any): Promise<string> {
  const sessionPayload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    image: null,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 86400,
  };
  const secret = process.env.NEXTAUTH_SECRET || 'dev-secret-change-me';
  const base64Payload = Buffer.from(JSON.stringify(sessionPayload)).toString('base64');
  const { createHmac } = await import('crypto');
  const signature = createHmac('sha256', secret)
    .update(`${base64Payload}.dev-session`)
    .digest('hex');
  return `${base64Payload}.${signature}.dev-session`;
}
```

---

## VERIFISERING

Etter implementering, test følgende flow:

| Test | Forventet resultat |
|------|------------------|
| 1. `dev-login` for ny testbruker | → `/onboarding` |
| 2. Fullfør onboarding | → `/dashboard` med profil: ✓ |
| 3. `dev-login` igjen | → `/dashboard` (ikke tilbake til onboarding) |
| 4. Dashboard viser profilstatus | Alle checkboxer ✓ |
| 5. Profil-CTA | "Oppdater profil" (ikke "Fullfør") |

---

## NOTER

- Ingen store endringer er nødvendige
- Kun 1 fil må endres (`app/api/dev-login/route.ts`)
- 1 fil kan opprettes valgfritt (`app/api/matching/route.ts`)
- Alle andre flows er allerede korrekte