/**
 * ToSom — Dev Seed (testA + testB + admin, full match)
 *
 * Oppretter/idempotent oppdaterer dev-testmiljø:
 *   - testA  (USER)  — full match med testB, dag 1
 *   - testB  (USER)  — full match med testA, dag 1
 *   - admin  (ADMIN) — tilgang til admin-panel
 *
 * Kjøring:
 *   npx ts-node prisma/seed-dev.ts
 *
 * Krever DATABASE_URL i .env.
 */

import { PrismaClient, JourneyPhase, MatchStatus } from '@prisma/client';

const prisma = new PrismaClient();

// Bruker-ID-ene MÅ matche dev-login route.ts (TEST_USERS[key].id)
const USER_A_ID = 'devuser_testA';
const USER_B_ID = 'devuser_testB';
const ADMIN_ID = 'devuser_admin';

function makeProfile(first: string, last: string, age: number, lat: number, lon: number) {
  return {
    firstName: first,
    lastName: last,
    age,
    identityName: first,
    bio: `Hei, jeg er ${first}. Gleder meg til å bli kjent med deg.`,
    interests: ['natur', 'musikk', 'reising'],
    maturityLevel: 8,
    securityLevel: 'secure',
    relationshipStyle: 'Trygg og open',
    lifeRhythm: 'balanced',
    deepProfileStep: 'SUMMARY' as const,
    deepProfileData: { completed: true, stepsCompleted: 10 },
    lifeSituation: { job: 'Utvikler', residence: 'By' },
    lifestyle: { activities: ['natur', 'musikk'], socialPreference: 'Balansert' },
    personality: { traits: ['Empatisk', 'Open', 'Moden'], strengths: ['Lyttar', 'Støttar'], nature: 'Vann' },
    communication: { style: 'Balansert', preferredDepth: 'Djup', conflictHandling: 'Snakke om det' },
    intimacy: { approach: 'Balansert', loveLanguage: 'Tid', pace: 'Normal' },
    futureVision: { goals: ['Bygge famili', 'Finne trygghet'], dealbreakers: [], preferences: {} },
    boundaries: { preferredDistance: 'Balansert', needs: ['Respekt', 'Trygghet'], limits: ['Press'] },
    emotionalNeeds: { needs: ['Trygghet', 'Nærhet'], supportStyle: 'Støttande' },
    preferences: { dealbreakers: [], preferences: {} },
    matchTags: ['natur', 'musikk', 'reising'],
    latitude: lat,
    longitude: lon,
    postalCode: '0150',
  };
}

async function main() {
  console.log('🌱 ToSom Dev Seed\n');

  // ─── RENSK: eksisterende dev-rader med forkert user-id (f.eks. id = email) ───
  const devEmails = ['testA@tosom.dev', 'testB@tosom.dev', 'admin@tosom.dev'];
  const existing = await prisma.user.findMany({ where: { email: { in: devEmails } } });
  for (const u of existing) {
    const correctId =
      u.email === 'testA@tosom.dev' ? USER_A_ID :
      u.email === 'testB@tosom.dev' ? USER_B_ID : ADMIN_ID;
    if (u.id === correctId) continue; // allerede korrekt

    console.log(`  🧹 Fjerner gammel dev-bruker ${u.email} (id=${u.id}) → gjenoppretter som ${correctId}`);
    await prisma.message.deleteMany({ where: { senderId: u.id } });
    await prisma.conversation.deleteMany({ where: { OR: [{ userAId: u.id }, { userBId: u.id }] } });
    await prisma.journeyProgress.deleteMany({ where: { userId: u.id } });
    await prisma.match.deleteMany({ where: { OR: [{ userAId: u.id }, { userBId: u.id }] } });
    await prisma.profile.deleteMany({ where: { userId: u.id } });
    await prisma.verificationToken.deleteMany({ where: { identifier: u.email } });
    await prisma.user.delete({ where: { id: u.id } });
  }

  // ─── USERS ───
  await prisma.user.upsert({
    where: { id: USER_A_ID },
    update: { role: 'USER', verified: true, onboardingComplete: true, deepProfileComplete: true, name: 'Test A' },
    create: {
      id: USER_A_ID,
      email: 'testA@tosom.dev',
      name: 'Test A',
      role: 'USER',
      verified: true,
      onboardingComplete: true,
      deepProfileComplete: true,
      onboardingStep: 99,
    },
  });
  console.log('  ✅ testA (USER)');

  await prisma.user.upsert({
    where: { id: USER_B_ID },
    update: { role: 'USER', verified: true, onboardingComplete: true, deepProfileComplete: true, name: 'Test B' },
    create: {
      id: USER_B_ID,
      email: 'testB@tosom.dev',
      name: 'Test B',
      role: 'USER',
      verified: true,
      onboardingComplete: true,
      deepProfileComplete: true,
      onboardingStep: 99,
    },
  });
  console.log('  ✅ testB (USER)');

  await prisma.user.upsert({
    where: { id: ADMIN_ID },
    update: { role: 'ADMIN', verified: true, onboardingComplete: true, deepProfileComplete: true, name: 'Admin Test' },
    create: {
      id: ADMIN_ID,
      email: 'admin@tosom.dev',
      name: 'Admin Test',
      role: 'ADMIN',
      verified: true,
      onboardingComplete: true,
      deepProfileComplete: true,
      onboardingStep: 99,
    },
  });
  console.log('  ✅ admin (ADMIN)');

  // ─── PROFILES ───
  await prisma.profile.upsert({
    where: { userId: USER_A_ID },
    update: {},
    create: { userId: USER_A_ID, ...makeProfile('A', 'TestA', 29, 59.9139, 10.7522) },
  });
  await prisma.profile.upsert({
    where: { userId: USER_B_ID },
    update: {},
    create: { userId: USER_B_ID, ...makeProfile('B', 'TestB', 31, 59.9250, 10.7540) },
  });
  await prisma.profile.upsert({
    where: { userId: ADMIN_ID },
    update: {},
    create: { userId: ADMIN_ID, ...makeProfile('Admin', 'Test', 40, 59.9139, 10.7522) },
  });
  console.log('  ✅ Profiles (testA, testB, admin)');

  // ─── MATCH (testA ↔ testB) ───
  let match = await prisma.match.findFirst({
    where: { userAId: USER_A_ID, userBId: USER_B_ID },
  });
  if (!match) {
    match = await prisma.match.create({
      data: {
        userAId: USER_A_ID,
        userBId: USER_B_ID,
        status: MatchStatus.active,
        score: 82,
        normalizedScore: 0.82,
        type: 'resonance',
        explanation: { text: 'Sterk overlap i verdier, livsstil og emosjonell kompatibilitet.' },
        scoringBreakdown: { base: 0.85, resonance: 0.80, semantic: 0.78, intimacy: 0.82, future: 0.80 },
        resonanceLevel: 'STRONG',
        lockedAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });
    console.log('  ✅ Match oppretta (testA ↔ testB)');
  } else {
    console.log('  ✅ Match eksisterer allerede');
  }

  // ─── CONVERSATION ───
  const now = new Date();
  const conv = await prisma.conversation.upsert({
    where: { id: `dev-conv-${match.id}` },
    update: { endedAt: null },
    create: {
      id: `dev-conv-${match.id}`,
      userAId: USER_A_ID,
      userBId: USER_B_ID,
      matchId: match.id,
      lastMessageAt: now,
      lastMessagePreview: 'Hei! Kul å matche med deg 😊',
    },
  });
  console.log('  ✅ Conversation');

  // Velkommen-melding (idempotent — sjekk om den finnes)
  const existingMsg = await prisma.message.findFirst({
    where: { conversationId: conv.id, senderId: USER_B_ID },
  });
  if (!existingMsg) {
    await prisma.message.create({
      data: {
        conversationId: conv.id,
        senderId: USER_B_ID,
        content: 'Hei! Kul å matche med deg 😊 Gleder meg til å bli kjent.',
        type: 'user',
        state: 'SENT',
      },
    });
    console.log('  ✅ Velkommen-melding');
  }

  // ─── JOURNEY PROGRESS (begge, dag 1, started) ───
  await prisma.journeyProgress.upsert({
    where: { jp_user_match: { userId: USER_A_ID, matchId: match.id } },
    update: { day: 1, phase: JourneyPhase.EARLY, bothSeenAt: now, nextDayAt: new Date(now.getTime() + 24 * 3600 * 1000), userASeenAt: now, userBSeenAt: now, endedAt: null },
    create: {
      userId: USER_A_ID,
      matchId: match.id,
      phase: JourneyPhase.EARLY,
      day: 1,
      completedDays: 0,
      userASeenAt: now,
      userBSeenAt: now,
      bothSeenAt: now,
      nextDayAt: new Date(now.getTime() + 24 * 3600 * 1000),
      startedAt: now,
    },
  });
  await prisma.journeyProgress.upsert({
    where: { jp_user_match: { userId: USER_B_ID, matchId: match.id } },
    update: { day: 1, phase: JourneyPhase.EARLY, bothSeenAt: now, nextDayAt: new Date(now.getTime() + 24 * 3600 * 1000), userASeenAt: now, userBSeenAt: now, endedAt: null },
    create: {
      userId: USER_B_ID,
      matchId: match.id,
      phase: JourneyPhase.EARLY,
      day: 1,
      completedDays: 0,
      userASeenAt: now,
      userBSeenAt: now,
      bothSeenAt: now,
      nextDayAt: new Date(now.getTime() + 24 * 3600 * 1000),
      startedAt: now,
    },
  });
  console.log('  ✅ JourneyProgress (testA + testB, dag 1)');

  console.log('\n✅ Dev-seed fullført! ✨\n');
  console.log('  testA → /dashboard (match: testB, dag 1)');
  console.log('  testB → /dashboard (match: testA, dag 1)');
  console.log('  admin → /admin');
}

main()
  .catch((e) => {
    console.error('❌ Dev-seed feila:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());