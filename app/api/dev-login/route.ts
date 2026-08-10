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
import { signIn } from '@/lib/auth/config';
export const dynamic = 'force-dynamic';

// ─── Konfigurasjon ───

const DEV_LOGIN_ENABLED = process.env.DEV_LOGIN_ENABLED === 'true';

/** Aktive testbrukere – kan utvides 
 * 
 * IMPORTANT: User IDs MUST match existing database conversation participants.
 * Active conversations have userAId="1" (test@tosom.no) and userBId="999" (test999@tosom.no).
 */
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

// ─── Session-hjelp — bruk AuthJS sin eigen signIn() ✓

/**
 * Opprett eller hent db-user for dev-testbrukar.
 * Gjer brukaren eksisterande i databasen så AuthJS kan lage JWT.
 */
async function ensureDevUserInDb(testUser: {
  id: string;
  email: string;
  name: string;
  role: string;
}) {
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
  // test-user-3 har "eksisterande progres" (med match og reise)
  const existingProgress = userId === 'test-user-3';
  const dbUser = {
    id: testUser.id,
    onboardingComplete: false,
    deepProfileComplete: false,
  };

   // Opprett brukaren i DB først (AuthJS treng ein gyldig user)
   await ensureDevUserInDb(testUser);

   // Bruk AuthJS sin eigen signIn med credentials — det lagar JWT-cookie automatisk ✓
   await signIn('credentials', {
     email: testUser.email,
     password: 'dev-login',
     redirect: false,
   });

   const redirectTarget = getRedirectTarget(userId, existingProgress);
   return NextResponse.redirect(new URL(`/${redirectTarget}`, req.url));
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

   // Opprett brukaren i DB først (AuthJS treng ein gyldig user)
   await ensureDevUserInDb(testUser);

    // Bruk AuthJS sin eigen signIn med credentials — det lagar JWT-cookie automatisk ✓
    await signIn('credentials', {
      email: testUser.email,
      password: 'dev-login',
      redirect: false,
    });

    // Bruk custom redirect dersom spesifisert, elles standard mål
   let redirectUrl = '/onboarding';
   if (customRedirect && customRedirect.startsWith('/')) {
     redirectUrl = customRedirect;
   } else {
     const existingProgress = userId === 'test-user-3' || userId === 'test-admin';
     const redirectTarget = getRedirectTarget(userId, existingProgress);
     redirectUrl = `/${redirectTarget}`;
   }

   return NextResponse.redirect(new URL(redirectUrl, req.url));
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


