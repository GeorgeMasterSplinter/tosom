/**
 * ToSom — Seed Script
 * Oppretter testdata for utvikling og testing
 * 
 * Kjøring:
 *   npx prisma db seed                           # Basic (3 brukarar)
 *   npx ts-node prisma/seeds/seed.ts test        # Test (10 brukarar)
 *   npx ts-node prisma/seeds/seed.ts full        # Full (20 brukarar + match)
 */

import { PrismaClient, JourneyPhase, MatchStatus, DeepProfileStep } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ─── DATA ──────────────────────────────────────────────────────

const NAMES = [
  { first: 'Erik', last: 'Hansen' },
  { first: 'Ingrid', last: 'Olsen' },
  { first: 'Magnus', last: 'Larsen' },
  { first: 'Sofia', last: 'Andersen' },
  { first: 'Lars', last: 'Johansen' },
  { first: 'Astrid', last: 'Pettersen' },
  { first: 'Olav', last: 'Nilsen' },
  { first: 'Freya', last: 'Haugen' },
  { first: 'Henrik', last: 'Nielsen' },
  { first: 'Linnea', last: 'Karlsen' },
  { first: 'Bjørn', last: 'Jakobsen' },
  { first: 'Kari', last: 'Eriksen' },
  { first: 'Thomas', last: 'Bakke' },
  { first: 'Mona', last: 'Solberg' },
  { first: 'Per', last: 'Lund' },
  { first: 'Hilde', last: 'Strøm' },
  { first: 'Anders', last: 'Berg' },
  { first: 'Ragnhild', last: 'Dahl' },
  { first: 'Jens', last: 'Foss' },
  { first: 'Camilla', last: 'Gundersen' },
];

const INTERESTS = [
  'natur', 'litteratur', 'musikk', 'fotografi', 'reising',
  'matlagning', 'vandring', 'sykling', 'svømming', 'lesing',
  'film', 'teater', 'hagebruk', 'maling', 'skrift',
  'filosofi', 'psykologi', 'vitenskap', 'design', 'arkitektur',
];

const VALUES = [
  'famili', 'vennskap', 'vekst', 'friheit', 'trygghet',
  'utforsking', 'skaping', 'balanse', 'autenticitet', 'respekt',
  'empati', 'modenheit', 'dybde', 'ro', 'styrke',
];

const JOBS = [
  'Utviklar', 'Designar', 'Lærar', 'Helsearbeidar', 'Forskar',
  'Entrepenør', 'Kunstnar', 'Skribent', 'Arkitekt', 'Psykolog',
];

// ─── HJELPEFUNKSJONAR ─────────────────────────────────────────

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randArr<T>(arr: T[], min = 1, max = 5): T[] {
  const count = randInt(min, Math.min(max, arr.length));
  return [...arr].sort(() => Math.random() - 0.5).slice(0, count);
}

function genProfile(i: number) {
  const name = NAMES[i % NAMES.length];
  const age = randInt(25, 52);

  return {
    firstName: name.first,
    lastName: name.last,
    age,
    identityName: name.first,
    lifeSituation: {
      job: rand(JOBS),
      residence: rand(['By', 'Land', 'Kyst', 'Fjell']),
      economy: rand(['Stabil', 'God', 'Varierende']),
      dailyRoutine: rand(['Tidleg opp', 'Normal', 'Seint ute', 'Rurleg']),
    },
    lifestyle: {
      activities: randArr(INTERESTS, 2, 5),
      socialPreference: rand(['Sosial', 'Avslappet', 'Intravers', 'Balansert']),
      weekendHabits: randArr(INTERESTS.slice(0, 10), 2, 4),
    },
    personality: {
      traits: randArr(['Empatisk', 'Analytisk', 'Kreativ', 'Praktisk', 'Drivande', 'Rurleg', 'Moden', 'Open'], 3, 6),
      strengths: randArr(['Lyttar', 'Observer', 'Planleggjar', 'Motiverar', 'Løyser', 'Støttar'], 2, 4),
      nature: rand(['Ro', 'Djungel', 'Vind', 'Eld', 'Vann', 'Jord']),
    },
    relationshipStyle: rand([
      'Trygg og open', 'Forsiktig og nølende', 'Direkte og ærlig',
      'Romantisk og varm', 'Uavhengig og sterk', 'Dyp og seriøs',
    ]),
    communication: {
      style: rand(['Direkte', 'Indirekte', 'Balansert', 'Mykje', 'Lite']),
      preferredDepth: rand(['Overflatisk', 'Moderat', 'Djup', 'Ekstremt djup']),
      conflictHandling: rand(['Konfronter', 'Unngå', 'Analyser', 'Snakke om det']),
    },
    intimacy: {
      approach: rand(['Gradvis', 'Direkte', 'Balansert', 'Forsiktig']),
      loveLanguage: rand(['Ord', 'Tid', 'Gjerigar', 'Kontakt', 'Gaver']),
      pace: rand(['Langsom', 'Normal', 'Rask']),
    },
    futureVision: {
      goals: randArr(['Bygge famili', 'Reise verda', 'Karriere', 'Skape kunst', 'Hjpe andre', 'Finne trygghet'], 2, 5),
      dealbreakers: randArr(['Røyking', 'Drukking', 'Vold', 'Overflatiskheit']),
      preferences: {},
    },
    boundaries: {
      preferredDistance: rand(['Nær', 'Avstand', 'Balansert']),
      needs: ['Respekt', 'Rom', 'Trygghet', 'Åpenheit', 'Tålmod'],
      limits: ['Kontroll', 'Jealousi', 'Overflatiskheit', 'Press'],
    },
    emotionalNeeds: {
      needs: randArr(['Trygghet', 'Anerkjennelse', 'Utvikling', 'Nærhet', 'Friheit']),
      supportStyle: rand(['Støttande', 'Uavhengig', 'Mellmanns', 'Rom-givande']),
    },
    lifeRhythm: rand(['morning', 'evening', 'balanced']),
    maturityLevel: randInt(5, 10),
    securityLevel: rand(['secure', 'ambivalent', 'unsicher']),
    deepProfileStep: DeepProfileStep.SUMMARY,
    deepProfileData: { completed: true, stepsCompleted: 10 },
    preferences: { dealbreakers: [], preferences: {} },
    matchTags: randArr(INTERESTS.slice(0, 15), 2, 5),
  };
}

// ─── SEED-FUNKSJONAR ──────────────────────────────────────────

async function seedBasic(count: number) {
  console.log(`\n🌱 Seedar ${count} brukarar...`);
  const created: { user: any; profile: any }[] = [];

  for (let i = 0; i < count; i++) {
    const profileData = genProfile(i);
    const email = `test${i + 1}@tosom.no`;
    const name = `${profileData.firstName} ${profileData.lastName}`;

    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        name,
        role: 'USER' as const,
        verified: true,
        onboardingComplete: true,
        deepProfileComplete: true,
        password: await bcrypt.hash('Test1234!', 10),
      },
    });

    await prisma.profile.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        ...profileData,
      },
    });

    created.push({ user, profile: user });
    console.log(`  ✅ ${name} (${email}) — alder: ${profileData.age}`);
  }

  console.log(`\n🌱 Totalt: ${created.length} brukarar oppretta\n`);
  return created;
}

async function seedMatch(users: any[]) {
  if (users.length < 2) return;

  const u1 = users[0].user;
  const u2 = users[1].user;

  const match = await prisma.match.upsert({
    where: {
      userAId_userBId: { userAId: u1.id, userBId: u2.id },
    },
    update: {},
    create: {
      userAId: u1.id,
      userBId: u2.id,
      status: MatchStatus.active,
      score: 78,
      normalizedScore: 0.78,
      type: 'resonance',
      explanation: 'Sterk overlap i verdier og livssituasjon.',
      scoringBreakdown: { base: 0.82, resonance: 0.75, semantic: 0.70, intimacy: 0.80, future: 0.78 },
      resonanceLevel: 'MODERATE',
      acceptedByA: new Date(),
      acceptedByB: new Date(),
      lockedAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  console.log(`  ✅ Match: ${u1.name} ↔ ${u2.name}`);

  await prisma.conversation.upsert({
    where: { id: `conv-${match.id}` },
    update: {},
    create: {
      id: `conv-${match.id}`,
      userAId: u1.id,
      userBId: u2.id,
      matchId: match.id,
      lastMessageAt: new Date(),
      lastMessagePreview: 'Hei! Kul å matche med deg 😊',
    },
  });

  console.log(`  ✅ Conversation oppretta`);

  await prisma.journeyProgress.upsert({
    where: { userId: u1.id },
    update: {},
    create: {
      userId: u1.id,
      phase: JourneyPhase.EARLY,
      day: 5,
      completedDays: 4,
      startedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    },
  });

  console.log(`  ✅ Journey starta (dag 5/30)\n`);
}

// ─── HOVED ─────────────────────────────────────────────────────

async function main() {
  const mode = process.argv[2] || 'basic';
  console.log(`\n🌱 ToSom Seed — mode: ${mode}\n`);

  let count = 3;
  if (mode === 'test') count = 10;
  else if (mode === 'full') count = 20;

  const users = await seedBasic(count);

  if (mode === 'full' && users.length >= 2) {
    await seedMatch(users);
  }

  console.log('🌱 Seed-fullført! ✨\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed feila:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());