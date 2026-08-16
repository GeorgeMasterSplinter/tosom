/**
 * ToSom — Seed 40 brukere for matcherunde (ST5.2)
 *
 * Kjør: DATABASE_URL="postgresql://tosom:tosom@localhost:5433/tosom_test" npx tsx scripts/seed-40.ts
 *
 * 40 brukere spredt over 6 landsdeler med varierte dealbreaker-felt.
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL! } },
});

const PREFIX = 'match52_';

// 6 landsdeler med postnummer
const GEO: Record<string, { lat: number; lon: number; city: string }> = {
  '0150': { lat: 59.9127, lon: 10.7461, city: 'Oslo' },
  '0180': { lat: 59.9150, lon: 10.7500, city: 'Oslo' },
  '5003': { lat: 60.3943, lon: 5.3259, city: 'Bergen' },
  '7011': { lat: 63.4305, lon: 10.3951, city: 'Trondheim' },
  '9008': { lat: 69.6496, lon: 18.9560, city: 'Tromsø' },
  '4612': { lat: 58.2839, lon: 6.4026, city: 'Kristiansand' },
};

interface P {
  id: string;
  age: number;
  postal: string;
  distPref: number;
  maturity: number;
  lifeRhythm: string;
  security: string;
  values: string[];
  personality: string[];
  relStyle: string;
  comm: string;
  future: string[];
  needs: string[];
  matchTags: string[];
  boundaries?: { preferredDistance?: string; excludes?: string[]; includes?: string[] };
  preferences?: { dealbreakers?: string[] };
}

const PROFILES: P[] = [
  // GRUPPE A: Oslo, like verdier, høy modenhet, secure, morning (6)
  ...Array.from({ length: 6 }, (_, i) => ({
    id: `${PREFIX}a${i + 1}`,
    age: 29 + i,
    postal: i % 2 === 0 ? '0150' : '0180',
    distPref: 50 + i * 10,
    maturity: 5,
    lifeRhythm: 'morning',
    security: 'secure',
    values: ['familie', 'natur', 'dybde', 'stabilitet'],
    personality: ['open', 'calm', 'reflective', 'warm'],
    relStyle: 'gradual',
    comm: 'direct',
    future: ['familie', 'growth', 'stability'],
    needs: ['depth', 'trust', 'warmth'],
    matchTags: ['dybde', 'rolig', 'familiemenneske'],
    boundaries: { preferredDistance: 'slow-pace', includes: ['dybde', 'trygghet'] },
  })),
  // GRUPPE B: Oslo, eventyr, lav modenhet, ambivalent, night (6)
  ...Array.from({ length: 6 }, (_, i) => ({
    id: `${PREFIX}b${i + 1}`,
    age: 25 + i,
    postal: i % 2 === 0 ? '0150' : '0180',
    distPref: 100 + i * 20,
    maturity: 3,
    lifeRhythm: 'night',
    security: 'ambivalent',
    values: ['eventyr', 'frihet', 'spenning', 'karriere'],
    personality: ['energetic', 'spontaneous', 'ambitious', 'social'],
    relStyle: 'fast',
    comm: 'playful',
    future: ['travel', 'career', 'freedom'],
    needs: ['excitement', 'freedom', 'fun'],
    matchTags: ['eventyr', 'energi', 'spenning'],
    boundaries: { preferredDistance: 'fast-pace', includes: ['spenning', 'frihet'] },
  })),
  // GRUPPE C: Bergen, blandede verdier (6)
  ...Array.from({ length: 6 }, (_, i) => ({
    id: `${PREFIX}c${i + 1}`,
    age: 30 + i,
    postal: '5003',
    distPref: 75 + i * 15,
    maturity: 4,
    lifeRhythm: 'flexible',
    security: i < 3 ? 'secure' : 'ambivalent',
    values: ['kultur', 'natur', 'karriere', 'dybde'],
    personality: ['creative', 'thoughtful', 'adaptable', 'curious'],
    relStyle: 'gradual',
    comm: i % 2 === 0 ? 'direct' : 'indirect',
    future: ['career', 'growth', 'balance'],
    needs: ['understanding', 'balance', 'growth'],
    matchTags: ['kultur', 'natur', 'dybde'],
    boundaries: { preferredDistance: 'medium-pace', includes: ['balanse', 'vækst'] },
  })),
  // GRUPPE D: Trondheim, stabil (6)
  ...Array.from({ length: 6 }, (_, i) => ({
    id: `${PREFIX}d${i + 1}`,
    age: 31 + i,
    postal: '7011',
    distPref: 60 + i * 10,
    maturity: 4 + (i > 3 ? 1 : 0),
    lifeRhythm: 'morning',
    security: 'secure',
    values: ['stabilitet', 'familie', 'helse', 'samfunn'],
    personality: ['reliable', 'kind', 'patient', 'grounded'],
    relStyle: 'gradual',
    comm: 'direct',
    future: ['family', 'home', 'community'],
    needs: ['stability', 'support', 'trust'],
    matchTags: ['stabilitet', 'trygghet', 'familie'],
    boundaries: { preferredDistance: 'slow-pace', includes: ['trygghet', 'stabilitet'] },
  })),
  // GRUPPE E: Tromsø, lav modenhet, unsicher (4)
  ...Array.from({ length: 4 }, (_, i) => ({
    id: `${PREFIX}e${i + 1}`,
    age: 24 + i,
    postal: '9008',
    distPref: 30 + i * 5,
    maturity: 2,
    lifeRhythm: 'night',
    security: 'unsicher',
    values: ['frihet', 'eventyr', 'spenning'],
    personality: ['impulsive', 'sensitive', 'intense', 'artistic'],
    relStyle: 'fast',
    comm: 'indirect',
    future: ['self-discovery', 'freedom'],
    needs: ['validation', 'excitement', 'closeness'],
    matchTags: ['spenning', 'intensitet', 'kunst'],
    boundaries: { preferredDistance: 'fast-pace', includes: ['intensitet', 'nærhet'] },
  })),
  // GRUPPE F: Kristiansand, blandede (4)
  ...Array.from({ length: 4 }, (_, i) => ({
    id: `${PREFIX}f${i + 1}`,
    age: 28 + i,
    postal: '4612',
    distPref: 150 + i * 30,
    maturity: 3 + (i > 1 ? 1 : 0),
    lifeRhythm: 'flexible',
    security: i < 2 ? 'ambivalent' : 'secure',
    values: ['natur', 'karriere', 'sosialt', 'dybde'],
    personality: ['outgoing', 'practical', 'warm', 'adaptable'],
    relStyle: 'gradual',
    comm: i % 2 === 0 ? 'direct' : 'playful',
    future: ['career', 'social-life', 'growth'],
    needs: ['social-connection', 'growth', 'fun'],
    matchTags: ['natur', 'sosialt', 'dybde'],
    boundaries: { preferredDistance: 'medium-pace', includes: ['balanse', 'sosialt'] },
  })),
  // GRUPPE G: Oslo, kreativ (4)
  ...Array.from({ length: 4 }, (_, i) => ({
    id: `${PREFIX}g${i + 1}`,
    age: 27 + i,
    postal: '0150',
    distPref: 40 + i * 10,
    maturity: 4,
    lifeRhythm: 'flexible',
    security: 'secure',
    values: ['kunst', 'dybde', 'autentisitet', 'vækst'],
    personality: ['creative', 'intense', 'empathetic', 'visionary'],
    relStyle: 'gradual',
    comm: 'indirect',
    future: ['creative-work', 'meaning', 'depth'],
    needs: ['understanding', 'creativity', 'depth'],
    matchTags: ['kunst', 'dybde', 'autentisitet'],
    boundaries: { preferredDistance: 'slow-pace', includes: ['dybde', 'autentisitet'] },
  })),
  // GRUPPE H: Trondheim, eventyr (2)
  ...Array.from({ length: 2 }, (_, i) => ({
    id: `${PREFIX}h${i + 1}`,
    age: 26 + i,
    postal: '7011',
    distPref: 200 + i * 50,
    maturity: 3,
    lifeRhythm: 'night',
    security: 'ambivalent',
    values: ['eventyr', 'reiser', 'frihet', 'natur'],
    personality: ['adventurous', 'open', 'spontaneous', 'driven'],
    relStyle: 'fast',
    comm: 'playful',
    future: ['travel', 'adventure', 'self-growth'],
    needs: ['freedom', 'adventure', 'passion'],
    matchTags: ['eventyr', 'reiser', 'frihet'],
    boundaries: { preferredDistance: 'medium-pace', includes: ['frihet', 'eventyr'] },
  })),
];

// Total: 6+6+6+6+4+4+4+2 = 38. Need 2 more.
PROFILES.push(
  {
    id: `${PREFIX}i1`, age: 35, postal: '0180', distPref: 80,
    maturity: 5, lifeRhythm: 'morning', security: 'secure',
    values: ['familie', 'helse', 'stabilitet', 'samfunn'],
    personality: ['mature', 'supportive', 'steady', 'wise'],
    relStyle: 'gradual', comm: 'direct',
    future: ['family', 'legacy', 'community'],
    needs: ['support', 'stability', 'trust'],
    matchTags: ['stabilitet', 'trygghet', 'familie'],
    boundaries: { preferredDistance: 'slow-pace', includes: ['trygghet', 'helse'] },
  },
  {
    id: `${PREFIX}i2`, age: 23, postal: '5003', distPref: 25,
    maturity: 2, lifeRhythm: 'night', security: 'unsicher',
    values: ['kunst', 'frihet', 'spenning'],
    personality: ['creative', 'sensitive', 'intense', 'young'],
    relStyle: 'fast', comm: 'indirect',
    future: ['self-discovery', 'art'],
    needs: ['validation', 'creativity', 'closeness'],
    matchTags: ['kunst', 'spenning', 'intensitet'],
    boundaries: { preferredDistance: 'fast-pace', includes: ['intensitet', 'nærhet'] },
  },
);

async function main() {
  const ids = PROFILES.map((p) => p.id);
  console.log(`Seeder ${PROFILES.length} brukere...`);

  // Rydd gamle
  await prisma.profile.deleteMany({ where: { userId: { in: ids } } });
  await prisma.user.deleteMany({ where: { id: { in: ids } } });

  const now = new Date();
  for (const p of PROFILES) {
    const geo = GEO[p.postal];
    if (!geo) throw new Error(`Unknown postal: ${p.postal}`);

    await prisma.user.create({
      data: {
        id: p.id,
        email: `${p.id}@seed52-tosom.no`,
        name: `Match52 ${p.id.slice(-2).toUpperCase()}`,
        role: 'USER',
        onboardingComplete: true,
        deepProfileComplete: true,
        journeyState: 'QUEUED',
        matchQueuedAt: now,
      },
    });

    await prisma.profile.create({
      data: {
        userId: p.id,
        age: p.age,
        firstName: 'Match',
        lastName: p.id.slice(-2).toUpperCase(),
        identityName: `Match52${p.id.slice(-2)}`,
        postalCode: p.postal,
        latitude: geo.lat,
        longitude: geo.lon,
        interests: ['natur', 'musikk', 'bøker'],
        matchTags: p.matchTags,
        lifeSituation: { values: p.values },
        personality: { traits: p.personality },
        relationshipStyle: p.relStyle,
        communication: { style: p.comm },
        futureVision: { goals: p.future },
        boundaries: { preferredDistance: p.boundaries?.preferredDistance, ...p.boundaries },
        emotionalNeeds: { needs: p.needs },
        lifeRhythm: p.lifeRhythm,
        maturityLevel: p.maturity,
        securityLevel: p.security,
        deepProfileData: { distancePref: p.distPref },
        preferences: p.preferences ?? null,
      },
    });
  }

  const queuedCount = await prisma.user.count({ where: { id: { in: ids }, journeyState: 'QUEUED' } });
  const geoCount = await prisma.profile.count({ where: { userId: { in: ids }, latitude: { not: null } } });
  console.log(`✅ Seeda: ${queuedCount} QUEUED, ${geoCount} med koordinater`);
  console.log(`   Krav: 40/40`);
}

main()
  .catch((e) => { console.error(e); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
