/**
 * ToSom — E2E testbruker-seed (idempotent)
 *
 * Dev-login oppretter testA/testB/admin automatisk, men reiser-tilstanden
 * (match, samtale, journey dag 1) må settes opp — ellers er det ingenting
 * å vise i chat-, match- og journey-testene.
 *
 * Kjør før hver E2E-runde (løper i CI like etter guided questions-seed):
 *   npx tsx prisma/seed-e2e-users.ts
 *
 * Onboarding-brukeren nullstilles bevisst hver gang: onboarding.spec.ts
 * fullfører onboarding i én av testene, og uten nullstilling ville neste
 * runde blitt redirectet bort fra /onboarding.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DAY_MS = 24 * 60 * 60 * 1000;

async function upsertUser(opts: {
  email: string;
  name: string;
  onboardingComplete: boolean;
  role?: 'USER' | 'ADMIN';
  age: number;
}) {
  const user = await prisma.user.upsert({
    where: { email: opts.email },
    update: {
      name: opts.name,
      role: opts.role ?? 'USER',
      onboardingComplete: opts.onboardingComplete,
      onboardingStep: opts.onboardingComplete ? 13 : 1,
    },
    create: {
      email: opts.email,
      name: opts.name,
      role: opts.role ?? 'USER',
      onboardingComplete: opts.onboardingComplete,
      onboardingStep: opts.onboardingComplete ? 13 : 1,
      termsAcceptedAt: new Date(),
      phoneVerified: true,
      verified: true,
    },
  });

  // Profile.age er required — sikr at profilen finnes
  await prisma.profile.upsert({
    where: { userId: user.id },
    update: {},
    create: { userId: user.id, age: opts.age },
  });

  return user;
}

async function main() {
  const now = new Date();

  const testA = await upsertUser({
    email: 'testA@tosom.dev',
    name: 'Test A',
    onboardingComplete: true,
    age: 28,
  });
  const testB = await upsertUser({
    email: 'testB@tosom.dev',
    name: 'Test B',
    onboardingComplete: true,
    age: 27,
  });
  await upsertUser({
    email: 'admin@tosom.dev',
    name: 'Admin Test',
    onboardingComplete: true,
    role: 'ADMIN',
    age: 30,
  });

  // Onboarding-bruker: nullstilles hver gang (se filkommentar)
  await upsertUser({
    email: 'e2e.onboarding@tosom.dev',
    name: 'E2E Onboarding',
    onboardingComplete: false,
    age: 26,
  });
  await prisma.user.update({
    where: { email: 'e2e.onboarding@tosom.dev' },
    data: { journeyState: 'IDLE', onboardingStep: 1 },
  });

  // Én match mellom testA og testB
  let match = await prisma.match.findFirst({
    where: { userAId: testA.id, userBId: testB.id },
  });
  if (!match) {
    match = await prisma.match.create({
      data: {
        userAId: testA.id,
        userBId: testB.id,
        score: 87,
        normalizedScore: 0.87,
      },
    });
  }

  // Én samtale med to meldinger
  const conversation = await prisma.conversation.upsert({
    where: { matchId: match.id },
    update: {},
    create: {
      userAId: testA.id,
      userBId: testB.id,
      matchId: match.id,
      lastMessageAt: now,
      lastMessagePreview: 'Hei deg! Ser frem til reisen vår.',
    },
  });
  const msgCount = await prisma.message.count({
    where: { conversationId: conversation.id },
  });
  if (msgCount === 0) {
    await prisma.message.createMany({
      data: [
        {
          conversationId: conversation.id,
          senderId: testA.id,
          content: 'Hei! Flott at vi ble matchet.',
          deliveredAt: now,
        },
        {
          conversationId: conversation.id,
          senderId: testB.id,
          content: 'Hei deg! Ser frem til reisen vår.',
          deliveredAt: now,
        },
      ],
    });
  }

  // Journey: dag 1 for begge — nullstilles hver gang, for ellers rykker
  // journey-cron test-reisen frem mellom rundene
  for (const user of [testA, testB]) {
    await prisma.journeyProgress.upsert({
      where: { jp_user_match: { userId: user.id, matchId: match.id } },
      update: {
        day: 1,
        phase: 'EARLY',
        bothSeenAt: now,
        nextDayAt: new Date(now.getTime() + DAY_MS),
      },
      create: {
        userId: user.id,
        matchId: match.id,
        phase: 'EARLY',
        day: 1,
        bothSeenAt: now,
        nextDayAt: new Date(now.getTime() + DAY_MS),
      },
    });
  }

  await prisma.user.updateMany({
    where: { id: { in: [testA.id, testB.id] } },
    data: { journeyState: 'MATCHED', lastMatchAt: now },
  });

  console.log(
    `✓ E2E-seed ferdig: match=${match.id.slice(0, 8)} samtale=${conversation.id.slice(0, 8)} — journey dag 1 for testA/testB`
  );
}

main()
  .catch((e) => {
    console.error('✗ E2E-seed feila:', e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());