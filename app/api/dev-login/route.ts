/**
 * Tosom — Dev Login API (v4 — SIKKERHETSFIX)
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
import { createHash } from 'crypto';
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
  'testA': {
    id: 'devuser_testA',
    email: 'testA@tosom.dev',
    name: 'Test A',
    role: 'USER',
    description: 'E2E testbruker — full onboarding + match + journey',
  },
  'testB': {
    id: 'devuser_testB',
    email: 'testB@tosom.dev',
    name: 'Test B',
    role: 'USER',
    description: 'E2E testbruker — partner (matches conversation.userBId)',
  },
  'admin': {
    id: 'devuser_admin',
    email: 'admin@tosom.dev',
    name: 'Admin Test',
    role: 'ADMIN',
    description: 'Admin-testbruker med tilgang til admin-panel',
  },
  'onboarding': {
    id: 'devuser_onboarding',
    email: 'e2e.onboarding@tosom.dev',
    name: 'E2E Onboarding',
    role: 'USER',
    description: 'E2E testbruker — påbegynt onboarding (nullstilles av seed-e2e-users)',
  },
};

type DevRedirectTarget = 'onboarding' | 'dashboard' | 'journey' | 'chat';

function getRedirectTarget(_userId: string, _existingProgress: boolean): DevRedirectTarget {
  // Fallback — frontend sender alltid en custom redirect (/admin for ADMIN, /dashboard for USER)
  return 'dashboard';
}

// ─── Hjelpere ───

async function ensureDevUserInDb(testUser: { id: string; email: string; name: string; role: string }) {
  let user = await prisma.user.findFirst({
    where: { email: testUser.email },
    select: { id: true, profile: { select: { id: true } } },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        id: testUser.id,
        email: testUser.email,
        name: testUser.name,
        role: testUser.role as any,
        onboardingComplete: true,
        deepProfileComplete: true,
      },
      select: { id: true, profile: { select: { id: true } } },
    });
  }

  // Sikre at onboarding-flaggene er satt (f.eks. eksisterende brukere)
  await prisma.user.update({
    where: { id: user.id },
    data: { onboardingComplete: true, deepProfileComplete: true },
  });

  // Opprett profil hvis manglende
  if (!user.profile) {
    const displayName = testUser.name;
    const firstName = displayName.split(' ')[0] || displayName;
    await prisma.profile.create({
      data: {
        userId: user.id,
        firstName,
        age: 30,
        bio: 'E2E testbruker — ToSom dev',
        interests: ['Test', 'Utvikling'],
        deepProfileStep: 'SUMMARY' as any,
        deepProfileData: { identity: { name: displayName, age: 30 } } as any,
      },
    });
  }

  return user;
}

/**
 * Sikrer at testA og testB har en aktiv match med conversation og journey-progress.
 * Idempotent — oppretter manglende komponenter selv når matchen allerede finnes.
 */
async function ensureTestPair() {
  const userA = await prisma.user.findUnique({ where: { id: 'devuser_testA' } });
  const userB = await prisma.user.findUnique({ where: { id: 'devuser_testB' } });
  if (!userA || !userB) return;

  // Finn aktiv match
  const activeMatch = await prisma.match.findFirst({
    where: {
      status: 'active',
      OR: [
        { userAId: 'devuser_testA', userBId: 'devuser_testB' },
        { userAId: 'devuser_testB', userBId: 'devuser_testA' },
      ],
    },
  });

  // Ingen match → opprett alt fra null
  if (!activeMatch) {
    await prisma.$transaction(async (tx) => {
      const newMatch = await tx.match.create({
        data: {
          userAId: 'devuser_testA',
          userBId: 'devuser_testB',
          status: 'active',
          score: 75,
          normalizedScore: 0.75,
          type: 'resonance',
          resonanceLevel: 'MODERATE',
        },
      });

      await tx.conversation.create({
        data: {
          userAId: 'devuser_testA',
          userBId: 'devuser_testB',
          matchId: newMatch.id,
        },
      });

      await tx.journeyProgress.create({
        data: {
          userId: 'devuser_testA',
          matchId: newMatch.id,
          phase: 'EARLY',
          day: 0,
          bothSeenAt: null,
        },
      });

      await tx.journeyProgress.create({
        data: {
          userId: 'devuser_testB',
          matchId: newMatch.id,
          phase: 'EARLY',
          day: 0,
          bothSeenAt: null,
        },
      });

      await tx.user.update({
        where: { id: 'devuser_testA' },
        data: { journeyState: 'MATCHED', lastMatchAt: new Date() },
      });

      await tx.user.update({
        where: { id: 'devuser_testB' },
        data: { journeyState: 'MATCHED', lastMatchAt: new Date() },
      });
    });
    return;
  }

  // Match finnes — sikrer at aktiv conversation også finnes
  const activeConvo = await prisma.conversation.findFirst({
    where: { matchId: activeMatch.id, endedAt: null },
  });

  if (!activeConvo) {
    await prisma.conversation.create({
      data: {
        userAId: 'devuser_testA',
        userBId: 'devuser_testB',
        matchId: activeMatch.id,
      },
    });
  }

  // Sikrer at journey-progress finnes for begge
  const [journeyA, journeyB] = await Promise.all([
    prisma.journeyProgress.findFirst({ where: { userId: 'devuser_testA', matchId: activeMatch.id } }),
    prisma.journeyProgress.findFirst({ where: { userId: 'devuser_testB', matchId: activeMatch.id } }),
  ]);

  if (!journeyA) {
    await prisma.journeyProgress.create({
      data: { userId: 'devuser_testA', matchId: activeMatch.id, phase: 'EARLY', day: 0, bothSeenAt: null },
    });
  }
  if (!journeyB) {
    await prisma.journeyProgress.create({
      data: { userId: 'devuser_testB', matchId: activeMatch.id, phase: 'EARLY', day: 0, bothSeenAt: null },
    });
  }
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

  // NextAuth hashes the token with SHA-256(token + secret) before lookup.
  // We must store the hashed version in the DB.
  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || '';
  const hashedToken = createHash('sha256').update(token + secret, 'utf8').digest('hex');

  // Fjern gamle tokens for denne emailen
  await prisma.verificationToken.deleteMany({
    where: { identifier: testUser.email },
  });

  // Opprett nytt token (hashed, slik NextAuth forventer)
  await prisma.verificationToken.create({
    data: {
      identifier: testUser.email,
      token: hashedToken,
      expires,
    },
  });

  // Return the RAW token — it goes in the URL, NextAuth will hash it
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
        usage: 'GET /api/dev-login?userId=testA',
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
  //
  // Viktig: bygg redirect-URLen fra klientens faktiske host (host-header),
  // IKKE fra req.url. req.url normaliserer hosten til NEXTAUTH_URL
  // (localhost), mens nettlesaren kan ha navigert via 127.0.0.1 eller en
  // annen host. Da peker 307'en på en annen origin enn siden, og nettleseren
  // avslår redirectet (CORS/«Failed to fetch») slik at session-cookieen
  // aldri settes. host-headeren alltid er den originen klienten faktisk bruker.
  const host = req.headers.get('host') || new URL(req.url).host;
  const proto = (req.headers.get('x-forwarded-proto') || 'http')
    .split(',')[0]
    .trim();
  const clientOrigin = `${proto}://${host}`;

  try {
    const token = await createDevVerificationToken(testUser);

    const callbackUrl = new URL('/api/auth/callback/email', clientOrigin);
    callbackUrl.searchParams.set('token', token);
    callbackUrl.searchParams.set('callbackUrl', `/${getRedirectTarget(userId, existingProgress)}`);

    // Redirect klienten til callback — NextAuth vil verifisere token + sette session-cookie
    return NextResponse.redirect(callbackUrl);
  } catch (err) {
    console.error('[Dev Login] Token creation failed:', err);
    const loginUrl = new URL('/login', clientOrigin);
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
        usage: 'POST /api/dev-login { "userId": "testA" }',
      },
      { status: 400 }
    );
  }

  const testUser = TEST_USERS[userId as keyof typeof TEST_USERS];

  await ensureDevUserInDb(testUser);

  // Sikre at test-paret (A + B) har aktiv match — kun for USER-roller
  if (testUser.role === 'USER') {
    const otherKey = userId === 'testA' ? 'testB' : 'testA';
    const otherUser = TEST_USERS[otherKey as keyof typeof TEST_USERS];
    if (otherUser) {
      await ensureDevUserInDb(otherUser);
      await ensureTestPair();
    }
  }

  try {
    const token = await createDevVerificationToken(testUser);

    // For POST, vi kan ikke redirecte til callback med cookies (det er en intern fetch).
    // I stedet: returner JSON-instruksjoner til klienten om å navigere til callback.
    // Eller: redirect all the same for enkelhet.
    let redirectUrl = '/onboarding';
    if (customRedirect && customRedirect.startsWith('/')) {
      redirectUrl = customRedirect;
    } else {
      const existingProgress = userId === 'admin';
      redirectUrl = `/${getRedirectTarget(userId, existingProgress)}`;
    }

    // Redirect-URLen bygg frå klientens faktiske host (host-header), sjå
    // kommentar i GET-hendlaren: req.url peikar på localhost, og ein 307
    // til annan origin blir avvist av nettlesaren (ingen session-cookie).
    const host = req.headers.get('host') || new URL(req.url).host;
    const proto = (req.headers.get('x-forwarded-proto') || 'http')
      .split(',')[0]
      .trim();
    const clientOrigin = `${proto}://${host}`;

    const callbackUrl = new URL('/api/auth/callback/email', clientOrigin);
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
