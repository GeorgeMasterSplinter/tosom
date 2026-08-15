/**
 * ToSom — B0-gate: seed 20 QUEUED-brukere med like profildata
 *
 * Formål: la matching-cron (Gate 4+3) faktisk koble par. Like profiler gir
 * høy resonans-score (>40) og ingen dealbreakers. Bruker unike ID-er
 * (gate_b0_<n>) så vi rydder opp rent.
 *
 * Kjør: DATABASE_URL="...:5432/tosom_dev" npx tsx scripts/gate-b0-seed.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL! } },
});

const N = 20;
const PREFIX = 'gate_b0_';

// Like profildimensjoner → høy score, ingen dealbreakers
const profileData = (n: number) => ({
  age: 28 + (n % 5), // 28–32, samme område
  firstName: `Gate`,
  lastName: `B0${n}`,
  identityName: `Gate${n}`,
  interests: ['natur', 'bøker', 'musikk', 'kaffe'],
  matchTags: ['dybde', 'rolig', 'familie', 'natur'],
  lifeSituation: { values: ['familie', 'natur', 'dybde', 'stabilitet'] },
  personality: { traits: ['open', 'calm', 'reflective', 'warm'] },
  relationshipStyle: 'gradual',
  communication: { style: 'direct' },
  futureVision: { goals: ['familie', 'growth', 'stability', 'close-knit'] },
  boundaries: { preferredDistance: 'slow-pace' },
  emotionalNeeds: { needs: ['depth', 'trust', 'warmth'] },
  lifeRhythm: 'morning',
  maturityLevel: 5,
  securityLevel: 'secure',
});

async function main() {
  const ids = Array.from({ length: N }, (_, i) => `${PREFIX}${i + 1}`);
  const emails = ids.map((id) => `${id}@gate-tosom.no`);

  // Rydd gamle
  await prisma.profile.deleteMany({ where: { userId: { in: ids } } });
  await prisma.user.deleteMany({ where: { id: { in: ids } } });

  const now = new Date();
  for (let i = 0; i < N; i++) {
    const id = ids[i];
    const u = await prisma.user.create({
      data: {
        id,
        email: emails[i],
        name: `Gate ${i + 1}`,
        role: 'USER',
        onboardingComplete: true,
        deepProfileComplete: true,
        journeyState: 'QUEUED',
        matchQueuedAt: now,
      },
    });
    await prisma.profile.create({
      data: { userId: u.id, ...profileData(i + 1) },
    });
  }

  const count = await prisma.user.count({ where: { id: { in: ids }, journeyState: 'QUEUED' } });
  console.log(`Seeda ${count} QUEUED-brukere (${PREFIX}1..${N})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });