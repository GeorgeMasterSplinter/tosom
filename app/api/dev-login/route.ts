/**
 * ToSom — Dev Login API (v4 — SIKKERHETSFIX)
 *
 * FULLVERDIG DEV-LOGIN MED GET OG POST
 *
 * Bruk:
 *   GET /api/dev-login?userId=test-user-1
 *   POST /api/dev-login med body: { userId: "test-user-1" }
 *
 * Sikkerhet:
 *   - BARE aktivert når DEV_LOGIN_ENABLED=true
 *   - Ingen produksjonsbruk
 *   - Oppretter brukere automatisk i DB
 *   - Bruker NextAuth EmailProvider (Magic Link) for session-opprettelse
 *
 * S4 FIX: signIn('credentials') ERSTAT med Magic Link flow.
 * Vi oppretter VerificationToken manuelt og kaller callback-endepunktet internt.
 *
 * TESTBRUKERE:
 *   - test-user-1: Testbruker 1 (test@tosom.no)
 *   - test-user-2: Testbruker 2 (test999@tosom.no)
 *   - test-user-3: Standard testbruker 3 (test3@tosom.no)
 *   - test-admin: Admin-testbruker (admin@tosom.no)
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
export const dynamic = 'force-dynamic';

// ─── Konfigurasjon ───

const DEV_LOGIN_ENABLED = process.env.DEV_LOGIN_ENABLED === 'true';

/** Aktive testbrukere – kan utvides */
const TEST_USERS: Record<string, {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
  description: string;
}> = {
  'test-user-1': {
    id: '1',
    email: 'test@tosom.no',
    name: 'Test User',
    role: 'USER',
    description: 'Standard testbruker – full onboarding (matches conversation.userAId)',
  },
  'test-user-2': {
    id: '999',
    email: 'test999@tosom.no',
    name: 'Test User 2',
    role: 'USER',
    description: 'Standard testbruker – partner (matches conversation.userBId)',
  },
  'test-user-3': {
    id: 'dev-test-user-3',
    email: 'test3@tosom.no',
    name: 'Testbruker 3',
    role: 'USER',
    description: 'Standard testbruker – med match og reise',
  },
  'test-admin': {
    id: 'dev-admin-user-1',
    email: 'admin@tosom.no',
    name: 'Admin Test',
    role: 'ADMIN',
    description: 'Admin-testbruker med tilgang til admin-panel',
  },
};

type DevRedirectTarget = 'onboarding' | 'dashboard' | 'journey' | 'chat';

function getRedirectTarget(userId: string, existingProgress: boolean): DevRedirectTarget {
  if (existingProgress) return 'journey';
  if (userId === 'test-user-3') return 'journey';
  if (userId === 'test-admin') return 'dashboard';
  return 'onboarding';
}

// ─── Hjelpere ───

async function ensureDevUserInDb(testUser: { id: string; email: string; name: string; role: string }) {
  let user = await prisma.user.findFirst({
    where: { email: testUser.email },
    select: { id: true },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        id: testUser.id,
        email: testUser.email,
        name: testUser.name,
        role: testUser.role as any,
      },
      select: { id: true },
    });
  }

  return user;
}

/**
 * S4 FIX: Opprett VerificationToken for Magic Link flow.
 *
 * I stedet for å kalle signIn('credentials') (som ikke finnes lenger),
 * oppretter vi et VerificationToken i DB og returnerer callback-URLen.
 * Klienten redirectes til callback-URLen som setter session-cookie automatisk.
 */
async function createDevVerificationToken(testUser: { email: string }): Promise<string> {
  // Opprett unikt token (64-char hex = 32 bytes)
  const token = crypto.getRandomValues(new Uint8Array(32)).reduce(
    (acc, b) => acc + b.toString(16).padStart(2, '0'), ''
  );
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 timer

  // Fjern gamle tokens for denne emailen
  await prisma.verificationToken.deleteMany({
    where: { identifier: testUser.email },
  });

  // Opprett nytt token
  await prisma.verificationToken.create({
    data: {
      identifier: testUser.email,
      token,
      expires,
    },
  });

  return token;
}

// ─── GET /api/dev-login?userId=xxx ───

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!DEV_LOGIN_ENABLED) {
    return NextResponse.json(
      { error: 'Dev-login er ikke aktivert. Set DEV_LOGIN_ENABLED=true.' },
      { status: 503 }
    );
  }

  if (!userId || !(userId in TEST_USERS)) {
    const availableUsers = Object.entries(TEST_USERS).map(
      ([key, u]) => `  - ${key}: ${u.name} (${u.email}) — ${u.description}`
    );
    return NextResponse.json(
      {
        error: 'Ugyldig userId. Tilgjengelige brukere:',
        available: availableUsers,
        usage: 'GET /api/dev-login?userId=test-user-1',
      },
      { status: 400 }
    );
  }

  const testUser = TEST_USERS[userId as keyof typeof TEST_USERS];
  const existingProgress = userId === 'test-user-3';

  // Opprett brukeren i DB først
  await ensureDevUserInDb(testUser);

  // S4 FIX: Opprett verification token og redirect til NextAuth callback
  // Callback-en vil sette session-cookie og redirecte videre
  try {
    const token = await createDevVerificationToken(testUser);

    const callbackUrl = new URL('/api/auth/callback/email', req.url);
    callbackUrl.searchParams.set('token', token);
    callbackUrl.searchParams.set('callbackUrl', `/${getRedirectTarget(userId, existingProgress)}`);

    // Redirect klienten til callback — NextAuth vil verifisere token + sette session-cookie
    return NextResponse.redirect(callbackUrl);
  } catch (err) {
    console.error('[Dev Login] Token creation failed:', err);
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('email', testUser.email);
    return NextResponse.redirect(loginUrl);
  }
}

// ─── POST /api/dev-login ───

export async function POST(req: NextRequest) {
  if (!DEV_LOGIN_ENABLED) {
    return NextResponse.json(
      { error: 'Dev-login er ikke aktivert. Set DEV_LOGIN_ENABLED=true.' },
      { status: 503 }
    );
  }

  let body: { userId?: string; redirect?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: 'Ugyldig JSON-body' },
      { status: 400 }
    );
  }

  const userId = body?.userId;
  const customRedirect = body?.redirect;

  if (!userId || !(userId in TEST_USERS)) {
    const availableUsers = Object.entries(TEST_USERS).map(
      ([key, u]) => `  - ${key}: ${u.name} (${u.email}) — ${u.description}`
    );
    return NextResponse.json(
      {
        error: 'Ugyldig userId. Tilgjengelige brukere:',
        available: availableUsers,
        usage: 'POST /api/dev-login { "userId": "test-user-1" }',
      },
      { status: 400 }
    );
  }

  const testUser = TEST_USERS[userId as keyof typeof TEST_USERS];

  await ensureDevUserInDb(testUser);

  try {
    const token = await createDevVerificationToken(testUser);

    // For POST, vi kan ikke redirecte til callback med cookies (det er en intern fetch).
    // I stedet: returner JSON-instruksjoner til klienten om å navigere til callback.
    // Eller: redirect all the same for enkelhet.
    let redirectUrl = '/onboarding';
    if (customRedirect && customRedirect.startsWith('/')) {
      redirectUrl = customRedirect;
    } else {
      const existingProgress = userId === 'test-user-3' || userId === 'test-admin';
      redirectUrl = `/${getRedirectTarget(userId, existingProgress)}`;
    }

    const callbackUrl = new URL('/api/auth/callback/email', req.url);
    callbackUrl.searchParams.set('token', token);
    callbackUrl.searchParams.set('callbackUrl', redirectUrl);

    return NextResponse.redirect(callbackUrl);
  } catch (err) {
    console.error('[Dev Login] Token creation failed:', err);
    return NextResponse.json(
      { error: 'Kunne ikke opprette session. Prøv vanlig login.', details: String(err) },
      { status: 500 }
    );
  }
}
