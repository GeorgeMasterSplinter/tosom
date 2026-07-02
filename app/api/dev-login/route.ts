/**
 * ToSom — Dev Login API (v2)
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
 *   - Setter session-cookie med korrekt format
 *   - Oppretter automatisk brukere som ikke finnes
 * 
 * TESTBRUKERE:
 *   - test-user-1: Testbruker 1 (test1@tosom.no)
 *   - test-user-2: Testbruker 2 (test2@tosom.no)
 *   - test-user-3: Testbruker 3 (test3@tosom.no)
 *   - test-admin: Admin-testbruker (admin@tosom.no)
 * 
 * Dokumentasjon: docs/DEV-LOGIN.md
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
    id: 'dev-test-user-1',
    email: 'test1@tosom.no',
    name: 'Testbruker 1',
    role: 'USER',
    description: 'Standard testbruker – full onboarding',
  },
  'test-user-2': {
    id: 'dev-test-user-2',
    email: 'test2@tosom.no',
    name: 'Testbruker 2',
    role: 'USER',
    description: 'Standard testbruker – ufullstendig profil',
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

/**
 * Hvilken side vi redirecter til basert på bruker-status
 */
type DevRedirectTarget = 'onboarding' | 'dashboard' | 'journey' | 'chat';

function getRedirectTarget(userId: string, existingProgress: boolean): DevRedirectTarget {
  if (existingProgress) {
    return 'journey';
  }
  if (userId === 'test-user-3') {
    return 'journey';
  }
  if (userId === 'test-admin') {
    return 'dashboard';
  }
  return 'onboarding';
}

// ─── Session-hjelp ───

async function createDevSessionToken(user: {
  id: string;
  email: string;
  name: string;
  role: string;
}): Promise<string> {
  const secret = process.env.NEXTAUTH_SECRET || 'dev-secret-change-me';
  const sessionPayload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    image: null,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 86400, // 1 dag
  };
  const base64Payload = Buffer.from(JSON.stringify(sessionPayload)).toString('base64');
  const { createHmac } = await import('crypto');
  const signature = createHmac('sha256', secret)
    .update(`${base64Payload}.dev-session`)
    .digest('hex');
  return `${base64Payload}.${signature}.dev-session`;
}

function setSessionCookie(
  response: NextResponse,
  token: string,
  req: NextRequest
): void {
  // Bruk oppringings-URL for korrekt redirect
  const referer = req.headers.get('referer') || '';
  const baseUrl = referer ? referer.replace(/\/$/, '') : 'http://localhost:3000';

  response.cookies.set('next-auth.session.token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 86400, // 1 dag
  });
}

// ─── GET /api/dev-login?userId=xxx ───

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  // Sjekk om dev-login er aktivert
  if (!DEV_LOGIN_ENABLED) {
    return NextResponse.json(
      { error: 'Dev-login er ikke aktivert. Set DEV_LOGIN_ENABLED=true.' },
      { status: 503 }
    );
  }

  // Valider userId
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

  // Fake testbruker — ingen database-kall
  const dbUser = {
    id: testUser.id,
    onboardingComplete: false,
    deepProfileComplete: false,
  };

  // Lag session og redirect
  const sessionToken = await createDevSessionToken({
    id: dbUser.id,
    email: testUser.email,
    name: testUser.name,
    role: testUser.role,
  });

   return NextResponse.redirect('/onboarding');
 }

 // ─── POST /api/dev-login ───

export async function POST(req: NextRequest) {
  // Sjekk om dev-login er aktivert
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

  // Valider userId
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

  // Fake testbruker — ingen database-kall
  const dbUser = {
    id: testUser.id,
    onboardingComplete: false,
    deepProfileComplete: false,
  };

  // Lag session og redirect
  const sessionToken = await createDevSessionToken({
    id: dbUser.id,
    email: testUser.email,
    name: testUser.name,
    role: testUser.role,
  });

  // Alltid til onboarding
  let redirectUrl = customRedirect || `/onboarding`;

  const response = NextResponse.redirect(
    `${new URL(req.url).origin}${redirectUrl}`
  );
  setSessionCookie(response, sessionToken, req);

  return response;
}

// ─── Hjelpsfunksjonar (ikkje Route-exports) ───

/**
 * Hent tilgjengelige testbrukere
 */
async function getAvailableUsers() {
  if (!DEV_LOGIN_ENABLED) {
    return NextResponse.json(
      { error: 'Dev-login er ikke aktivert.' },
      { status: 503 }
    );
  }

  const users = Object.entries(TEST_USERS).map(([key, u]) => ({
    id: key,
    name: u.name,
    email: u.email,
    role: u.role,
    description: u.description,
  }));

  return NextResponse.json({ users });
}

/**
 * Sjekk om dev-login er tilgjengelig
 */
async function getDevLoginStatus() {
  return NextResponse.json({
    enabled: DEV_LOGIN_ENABLED,
    availableUsers: Object.keys(TEST_USERS),
    usage: 'GET /api/dev-login?userId=xxx eller POST /api/dev-login { userId: "xxx" }',
  });
}
