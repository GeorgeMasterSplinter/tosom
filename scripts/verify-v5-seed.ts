/**
 * ToSom — VERIFISERING v5.0: seed med VARIERTE profiler
 *
 * Formål: Teste om unifiedScore faktisk SKILLER mellom mennesker.
 * gate-b0-seed.ts brukte like profiler → alle fikk score 95.
 * Dette skriptet lager profiler som faktisk varierer på de 9 dimensjonene.
 *
 * Kjør: npx tsx scripts/verify-v5-seed.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL! } },
});

const PREFIX = 'verify_v5_';

// ═══════════════════════════════════════════════════════════
// VARIERTE PROFILER — 26 brukere med ulike verdier, personlighet,
// relasjonsstil, kommunikasjon, framtidsvisjon, grenser, behov,
// livsrytme og modenhet. Noen skal score høyt, noen lavt.
// ═══════════════════════════════════════════════════════════

interface SeedProfile {
  id: string;
  age: number;
  postalCode: string;      // For geo-test
  distancePref: number;    // For radius-test
  values: string[];
  personality: string[];
  relationshipStyle: string;
  communication: string;
  futureVision: string[];
  boundaries: string;
  emotionalNeeds: string[];
  lifeRhythm: string;
  maturityLevel: number;
}

const PROFILES: SeedProfile[] = [
  // ─── GRUPPE A: Like verdier (skal score høyt) ───
  {
    id: `${PREFIX}a1`, age: 30, postalCode: '0150', distancePref: 50,
    values: ['familie', 'natur', 'dybde', 'stabilitet'],
    personality: ['open', 'calm', 'reflective', 'warm'],
    relationshipStyle: 'gradual', communication: 'direct',
    futureVision: ['familie', 'growth', 'stability'],
    boundaries: 'slow-pace', emotionalNeeds: ['depth', 'trust', 'warmth'],
    lifeRhythm: 'morning', maturityLevel: 5,
  },
  {
    id: `${PREFIX}a2`, age: 32, postalCode: '0180', distancePref: 50,
    values: ['familie', 'natur', 'dybde', 'stabilitet'],
    personality: ['open', 'calm', 'reflective', 'warm'],
    relationshipStyle: 'gradual', communication: 'direct',
    futureVision: ['familie', 'growth', 'stability'],
    boundaries: 'slow-pace', emotionalNeeds: ['depth', 'trust', 'warmth'],
    lifeRhythm: 'morning', maturityLevel: 5,
  },
  {
    id: `${PREFIX}a3`, age: 29, postalCode: '0150', distancePref: 50,
    values: ['familie', 'natur', 'dybde', 'stabilitet'],
    personality: ['open', 'calm', 'reflective', 'warm'],
    relationshipStyle: 'gradual', communication: 'direct',
    futureVision: ['familie', 'growth', 'stability'],
    boundaries: 'slow-pace', emotionalNeeds: ['depth', 'trust', 'warmth'],
    lifeRhythm: 'morning', maturityLevel: 5,
  },
  {
    id: `${PREFIX}a4`, age: 31, postalCode: '0180', distancePref: 50,
    values: ['familie', 'natur', 'dybde', 'stabilitet'],
    personality: ['open', 'calm', 'reflective', 'warm'],
    relationshipStyle: 'gradual', communication: 'direct',
    futureVision: ['familie', 'growth', 'stability'],
    boundaries: 'slow-pace', emotionalNeeds: ['depth', 'trust', 'warmth'],
    lifeRhythm: 'morning', maturityLevel: 5,
  },

  // ─── GRUPPE B: Ulike verdier (skal score lavt mot A) ───
  {
    id: `${PREFIX}b1`, age: 28, postalCode: '0150', distancePref: 50,
    values: ['eventyr', 'frihet', 'spenning', 'karriere'],
    personality: ['energetic', 'spontaneous', 'ambitious', 'social'],
    relationshipStyle: 'fast', communication: 'playful',
    futureVision: ['travel', 'career', 'freedom'],
    boundaries: 'fast-pace', emotionalNeeds: ['excitement', 'freedom', 'fun'],
    lifeRhythm: 'night', maturityLevel: 3,
  },
  {
    id: `${PREFIX}b2`, age: 27, postalCode: '0180', distancePref: 50,
    values: ['eventyr', 'frihet', 'spenning', 'karriere'],
    personality: ['energetic', 'spontaneous', 'ambitious', 'social'],
    relationshipStyle: 'fast', communication: 'playful',
    futureVision: ['travel', 'career', 'freedom'],
    boundaries: 'fast-pace', emotionalNeeds: ['excitement', 'freedom', 'fun'],
    lifeRhythm: 'night', maturityLevel: 3,
  },
  {
    id: `${PREFIX}b3`, age: 29, postalCode: '0150', distancePref: 50,
    values: ['eventyr', 'frihet', 'spenning', 'karriere'],
    personality: ['energetic', 'spontaneous', 'ambitious', 'social'],
    relationshipStyle: 'fast', communication: 'playful',
    futureVision: ['travel', 'career', 'freedom'],
    boundaries: 'fast-pace', emotionalNeeds: ['excitement', 'freedom', 'fun'],
    lifeRhythm: 'night', maturityLevel: 3,
  },
  {
    id: `${PREFIX}b4`, age: 26, postalCode: '0180', distancePref: 50,
    values: ['eventyr', 'frihet', 'spenning', 'karriere'],
    personality: ['energetic', 'spontaneous', 'ambitious', 'social'],
    relationshipStyle: 'fast', communication: 'playful',
    futureVision: ['travel', 'career', 'freedom'],
    boundaries: 'fast-pace', emotionalNeeds: ['excitement', 'freedom', 'fun'],
    lifeRhythm: 'night', maturityLevel: 3,
  },

  // ─── GRUPPE C: Blandet (middels score) ───
  {
    id: `${PREFIX}c1`, age: 33, postalCode: '0150', distancePref: 50,
    values: ['familie', 'karriere', 'stabilitet', 'kultur'],
    personality: ['calm', 'ambitious', 'thoughtful', 'warm'],
    relationshipStyle: 'gradual', communication: 'reflective',
    futureVision: ['familie', 'career', 'balance'],
    boundaries: 'slow-pace', emotionalNeeds: ['trust', 'growth', 'stability'],
    lifeRhythm: 'morning', maturityLevel: 4,
  },
  {
    id: `${PREFIX}c2`, age: 34, postalCode: '0180', distancePref: 50,
    values: ['familie', 'karriere', 'stabilitet', 'kultur'],
    personality: ['calm', 'ambitious', 'thoughtful', 'warm'],
    relationshipStyle: 'gradual', communication: 'reflective',
    futureVision: ['familie', 'career', 'balance'],
    boundaries: 'slow-pace', emotionalNeeds: ['trust', 'growth', 'stability'],
    lifeRhythm: 'morning', maturityLevel: 4,
  },
  {
    id: `${PREFIX}c3`, age: 35, postalCode: '0150', distancePref: 50,
    values: ['familie', 'karriere', 'stabilitet', 'kultur'],
    personality: ['calm', 'ambitious', 'thoughtful', 'warm'],
    relationshipStyle: 'gradual', communication: 'reflective',
    futureVision: ['familie', 'career', 'balance'],
    boundaries: 'slow-pace', emotionalNeeds: ['trust', 'growth', 'stability'],
    lifeRhythm: 'morning', maturityLevel: 4,
  },
  {
    id: `${PREFIX}c4`, age: 32, postalCode: '0180', distancePref: 50,
    values: ['familie', 'karriere', 'stabilitet', 'kultur'],
    personality: ['calm', 'ambitious', 'thoughtful', 'warm'],
    relationshipStyle: 'gradual', communication: 'reflective',
    futureVision: ['familie', 'career', 'balance'],
    boundaries: 'slow-pace', emotionalNeeds: ['trust', 'growth', 'stability'],
    lifeRhythm: 'morning', maturityLevel: 4,
  },

  // ─── GRUPPE D: Tromsø (geo-test — skal BLOKKERES mot Oslo med 30km) ───
  {
    id: `${PREFIX}d1`, age: 30, postalCode: '9008', distancePref: 30,
    values: ['familie', 'natur', 'dybde', 'stabilitet'],
    personality: ['open', 'calm', 'reflective', 'warm'],
    relationshipStyle: 'gradual', communication: 'direct',
    futureVision: ['familie', 'growth', 'stability'],
    boundaries: 'slow-pace', emotionalNeeds: ['depth', 'trust', 'warmth'],
    lifeRhythm: 'morning', maturityLevel: 5,
  },
  {
    id: `${PREFIX}d2`, age: 31, postalCode: '9008', distancePref: 30,
    values: ['familie', 'natur', 'dybde', 'stabilitet'],
    personality: ['open', 'calm', 'reflective', 'warm'],
    relationshipStyle: 'gradual', communication: 'direct',
    futureVision: ['familie', 'growth', 'stability'],
    boundaries: 'slow-pace', emotionalNeeds: ['depth', 'trust', 'warmth'],
    lifeRhythm: 'morning', maturityLevel: 5,
  },

  // ─── GRUPPE E: Bergen (geo-test — kan kobles med hverandre) ───
  {
    id: `${PREFIX}e1`, age: 29, postalCode: '5003', distancePref: 30,
    values: ['familie', 'natur', 'dybde', 'stabilitet'],
    personality: ['open', 'calm', 'reflective', 'warm'],
    relationshipStyle: 'gradual', communication: 'direct',
    futureVision: ['familie', 'growth', 'stability'],
    boundaries: 'slow-pace', emotionalNeeds: ['depth', 'trust', 'warmth'],
    lifeRhythm: 'morning', maturityLevel: 5,
  },
  {
    id: `${PREFIX}e2`, age: 30, postalCode: '5003', distancePref: 30,
    values: ['familie', 'natur', 'dybde', 'stabilitet'],
    personality: ['open', 'calm', 'reflective', 'warm'],
    relationshipStyle: 'gradual', communication: 'direct',
    futureVision: ['familie', 'growth', 'stability'],
    boundaries: 'slow-pace', emotionalNeeds: ['depth', 'trust', 'warmth'],
    lifeRhythm: 'morning', maturityLevel: 5,
  },

  // ─── GRUPPE F: Flere varierte profiler for større kø ───
  {
    id: `${PREFIX}f1`, age: 36, postalCode: '0150', distancePref: 50,
    values: ['kreativitet', 'dybde', 'autentisitet', 'nærhet'],
    personality: ['creative', 'deep', 'authentic', 'sensitive'],
    relationshipStyle: 'gradual', communication: 'poetic',
    futureVision: ['art', 'depth', 'connection'],
    boundaries: 'slow-pace', emotionalNeeds: ['depth', 'authenticity', 'space'],
    lifeRhythm: 'night', maturityLevel: 5,
  },
  {
    id: `${PREFIX}f2`, age: 37, postalCode: '0180', distancePref: 50,
    values: ['kreativitet', 'dybde', 'autentisitet', 'nærhet'],
    personality: ['creative', 'deep', 'authentic', 'sensitive'],
    relationshipStyle: 'gradual', communication: 'poetic',
    futureVision: ['art', 'depth', 'connection'],
    boundaries: 'slow-pace', emotionalNeeds: ['depth', 'authenticity', 'space'],
    lifeRhythm: 'night', maturityLevel: 5,
  },
  {
    id: `${PREFIX}f3`, age: 38, postalCode: '0150', distancePref: 50,
    values: ['kreativitet', 'dybde', 'autentisitet', 'nærhet'],
    personality: ['creative', 'deep', 'authentic', 'sensitive'],
    relationshipStyle: 'gradual', communication: 'poetic',
    futureVision: ['art', 'depth', 'connection'],
    boundaries: 'slow-pace', emotionalNeeds: ['depth', 'authenticity', 'space'],
    lifeRhythm: 'night', maturityLevel: 5,
  },
  {
    id: `${PREFIX}f4`, age: 35, postalCode: '0180', distancePref: 50,
    values: ['kreativitet', 'dybde', 'autentisitet', 'nærhet'],
    personality: ['creative', 'deep', 'authentic', 'sensitive'],
    relationshipStyle: 'gradual', communication: 'poetic',
    futureVision: ['art', 'depth', 'connection'],
    boundaries: 'slow-pace', emotionalNeeds: ['depth', 'authenticity', 'space'],
    lifeRhythm: 'night', maturityLevel: 5,
  },

  // ─── GRUPPE G: Trondheim (geo-test) ───
  {
    id: `${PREFIX}g1`, age: 31, postalCode: '7011', distancePref: 30,
    values: ['familie', 'natur', 'dybde', 'stabilitet'],
    personality: ['open', 'calm', 'reflective', 'warm'],
    relationshipStyle: 'gradual', communication: 'direct',
    futureVision: ['familie', 'growth', 'stability'],
    boundaries: 'slow-pace', emotionalNeeds: ['depth', 'trust', 'warmth'],
    lifeRhythm: 'morning', maturityLevel: 5,
  },
  {
    id: `${PREFIX}g2`, age: 32, postalCode: '7011', distancePref: 30,
    values: ['familie', 'natur', 'dybde', 'stabilitet'],
    personality: ['open', 'calm', 'reflective', 'warm'],
    relationshipStyle: 'gradual', communication: 'direct',
    futureVision: ['familie', 'growth', 'stability'],
    boundaries: 'slow-pace', emotionalNeeds: ['depth', 'trust', 'warmth'],
    lifeRhythm: 'morning', maturityLevel: 5,
  },

  // ─── GRUPPE H: Lav modenhet (skal score lavt mot modne profiler) ───
  {
    id: `${PREFIX}h1`, age: 24, postalCode: '0150', distancePref: 50,
    values: ['fest', 'sosialt', 'spenning', 'frihet'],
    personality: ['impulsive', 'social', 'restless', 'carefree'],
    relationshipStyle: 'fast', communication: 'casual',
    futureVision: ['fun', 'freedom', 'now'],
    boundaries: 'fast-pace', emotionalNeeds: ['excitement', 'attention', 'fun'],
    lifeRhythm: 'night', maturityLevel: 2,
  },
  {
    id: `${PREFIX}h2`, age: 25, postalCode: '0180', distancePref: 50,
    values: ['fest', 'sosialt', 'spenning', 'frihet'],
    personality: ['impulsive', 'social', 'restless', 'carefree'],
    relationshipStyle: 'fast', communication: 'casual',
    futureVision: ['fun', 'freedom', 'now'],
    boundaries: 'fast-pace', emotionalNeeds: ['excitement', 'attention', 'fun'],
    lifeRhythm: 'night', maturityLevel: 2,
  },
];

// Postnummer → koordinater (fra lib/geo/postalCodes.json)
const GEO: Record<string, { lat: number; lon: number }> = {
  '0150': { lat: 59.9127, lon: 10.7461 },  // Oslo
  '0180': { lat: 59.9150, lon: 10.7500 },  // Oslo
  '5003': { lat: 60.3943, lon: 5.3259 },   // Bergen
  '7011': { lat: 63.4305, lon: 10.3951 },  // Trondheim
  '9008': { lat: 69.6496, lon: 18.9560 },  // Tromsø
};

async function main() {
  const ids = PROFILES.map((p) => p.id);
  const emails = ids.map((id) => `${id}@verify-tosom.no`);

  // Rydd gamle
  await prisma.profile.deleteMany({ where: { userId: { in: ids } } });
  await prisma.user.deleteMany({ where: { id: { in: ids } } });

  const now = new Date();
  for (let i = 0; i < PROFILES.length; i++) {
    const p = PROFILES[i];
    const geo = GEO[p.postalCode];

    const u = await prisma.user.create({
      data: {
        id: p.id,
        email: emails[i],
        name: `Verify ${p.id.slice(-2)}`,
        role: 'USER',
        onboardingComplete: true,
        deepProfileComplete: true,
        journeyState: 'QUEUED',
        matchQueuedAt: now,
      },
    });

    await prisma.profile.create({
      data: {
        userId: u.id,
        age: p.age,
        firstName: 'Verify',
        lastName: p.id.slice(-2).toUpperCase(),
        identityName: `Verify${p.id.slice(-2)}`,
        postalCode: p.postalCode,
        latitude: geo?.lat ?? null,
        longitude: geo?.lon ?? null,
        interests: ['natur', 'bøker', 'musikk'],
        matchTags: ['dybde', 'rolig'],
        lifeSituation: { values: p.values },
        personality: { traits: p.personality },
        relationshipStyle: p.relationshipStyle,
        communication: { style: p.communication },
        futureVision: { goals: p.futureVision },
        boundaries: { preferredDistance: p.boundaries },
        emotionalNeeds: { needs: p.emotionalNeeds },
        lifeRhythm: p.lifeRhythm,
        maturityLevel: p.maturityLevel,
        securityLevel: 'secure',
        deepProfileData: { distancePref: p.distancePref },
      },
    });
  }

  const count = await prisma.user.count({
    where: { id: { in: ids }, journeyState: 'QUEUED' },
  });
  console.log(`✅ Seeda ${count} QUEUED-brukere med VARIERTE profiler`);
  console.log(`   Grupper: A (familie/natur), B (eventyr/frihet), C (blandet),`);
  console.log(`            D (Tromsø), E (Bergen), F (kreativ), G (Trondheim), H (lav modenhet)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });