/**
 * ToSom — Seed 60 brukere med REELL SPREDNING (v7 steg 4.1)
 *
 * Målet: hver enkelt dealbreaker skal kunne utløses av minst ett par.
 * Individuell variasjon, ikke gruppekonstanter.
 *
 * Kjør: DATABASE_URL="postgresql://tosom:tosom@localhost:5433/tosom_test" npx tsx scripts/seed-spread.ts
 *
 * Løsning 1: radius er begrenset (distancePref i deepProfileData, ikke kolonne).
 * De 5 utløsbare dealbreakere: maturity, livsrytme, preferanser, grenser, sikkerhetsnivå.
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL! } },
});

const PREFIX = 'spread7_';

// 10 landsdeler med postnummer og koordinater
const GEO: Record<string, { lat: number; lon: number; city: string }> = {
  '0150': { lat: 59.9127, lon: 10.7461, city: 'Oslo' },
  '0180': { lat: 59.9150, lon: 10.7500, city: 'Oslo' },
  '5003': { lat: 60.3943, lon: 5.3259, city: 'Bergen' },
  '7011': { lat: 63.4305, lon: 10.3951, city: 'Trondheim' },
  '9008': { lat: 69.6496, lon: 18.9560, city: 'Tromsø' },
  '4612': { lat: 58.2839, lon: 6.4026, city: 'Kristiansand' },
  '1607': { lat: 59.7298, lon: 10.3229, city: 'Fredrikstad' },
  '6007': { lat: 60.4735, lon: 5.8881, city: 'Bryne' },
  '7600': { lat: 64.0080, lon: 11.2570, city: 'Levanger' },
  '3946': { lat: 58.9700, lon: 7.7100, city: 'Grimstad' },
};

interface SP {
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

// 60 brukere med individuell variasjon
// Maturity: 1,2,3,4,5,6,7,8,9,10 (alle nivåer, hver 6 ganger)
// LifeRhythm: morning, evening, fast, slow, flexible (alle)
// Security: unsicher, ambivalent, secure (alle)
// Pref/boundaries: minst 10 med eksplisitte dealbreakers/excludes

const PROFILES: SP[] = [];

const MATURITY_LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const RHYTHMS = ['morning', 'evening', 'fast', 'slow', 'flexible'];
const SECS = ['unsicher', 'ambivalent', 'secure'];
const POSTALS = Object.keys(GEO);

const TAG_POOL = ['dybde', 'rolig', 'eventyr', 'energi', 'natur', 'kunst', 'familie', 'spenning', 'balanse', 'trygghet'];
const VALUE_POOL = ['familie', 'natur', 'karriere', 'dybde', 'eventyr', 'kulturr', 'stabilitet', 'frihet', 'helse', 'samfunn'];
const PERSONALITY_POOL = ['open', 'calm', 'reflective', 'warm', 'energetic', 'spontaneous', 'creative', 'thoughtful', 'reliable', 'kind'];
const FUTURE_POOL = ['growth', 'family', 'career', 'travel', 'stability', 'freedom', 'balance', 'art', 'community', 'legacy'];
const NEEDS_POOL = ['trust', 'warmth', 'excitement', 'freedom', 'stability', 'understanding', 'balance', 'depth', 'fun', 'support'];

// Deterministisk pseudo-random (seeded)
function pseudoRand(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function pickN<T>(arr: T[], n: number, seed: number): T[] {
  const result: T[] = [];
  const used = new Set<number>();
  for (let i = 0; i < n && i < arr.length; i++) {
    let idx = Math.floor(pseudoRand(seed + i * 7) * arr.length);
    while (used.has(idx)) idx = (idx + 1) % arr.length;
    used.add(idx);
    result.push(arr[idx]);
  }
  return result;
}

for (let i = 0; i < 60; i++) {
  const s = i + 1; // seed
  // Maturity: sikrer alle nivåer 1-10 representert
  const maturity = MATURITY_LEVELS[i % 10];
  // LifeRhythm: sikrer kompatible OG inkompatible verdier
  const lifeRhythm = RHYTHMS[Math.floor(pseudoRand(s * 3) * RHYTHMS.length)];
  // Security: sikrer gap >= 2
  const security = SECS[Math.floor(pseudoRand(s * 7) * SECS.length)];
  // Postnummer: 10 ulike
  const postal = POSTALS[i % 10];
  // distancePref: 25-300
  const distPref = 25 + Math.floor(pseudoRand(s * 11) * 276);

  const hasPrefs = i < 15; // 15 brukere med eksplisitte preferanser/grenser
  const tagChoices = pickN(TAG_POOL, 2 + (i % 3), s * 13);

  PROFILES.push({
    id: `${PREFIX}${String(i + 1).padStart(2, '0')}`,
    age: 22 + (i % 30),
    postal,
    distPref,
    maturity,
    lifeRhythm,
    security,
    values: pickN(VALUE_POOL, 3, s * 17),
    personality: pickN(PERSONALITY_POOL, 3, s * 19),
    relStyle: pseudoRand(s * 23) > 0.5 ? 'gradual' : 'fast',
    comm: pseudoRand(s * 29) > 0.5 ? 'direct' : 'indirect',
    future: pickN(FUTURE_POOL, 2, s * 31),
    needs: pickN(NEEDS_POOL, 2, s * 37),
    matchTags: tagChoices,
    ...(hasPrefs ? {
      preferences: { dealbreakers: tagChoices.slice(0, 1) },
      boundaries: {
        preferredDistance: pseudoRand(s * 41) > 0.5 ? 'slow-pace' : 'fast-pace',
        excludes: tagChoices.slice(0, 1),
        includes: tagChoices.slice(-1),
      },
    } : {}),
  });
}

async function main() {
  const ids = PROFILES.map((p) => p.id);
  console.log(`Seeding ${PROFILES.length} brukere med reell spredning...`);

  // Rydd gamle
  await prisma.profile.deleteMany({ where: { userId: { in: ids } } });
  await prisma.user.deleteMany({ where: { id: { in: ids } } });

  const now = new Date();
  const hours73Ago = new Date(now.getTime() - 73 * 60 * 60 * 1000);

  for (let i = 0; i < PROFILES.length; i++) {
    const p = PROFILES[i];
    const geo = GEO[p.postal];
    if (!geo) throw new Error(`Unknown postal: ${p.postal}`);

    // Bruker #1 får queuedAt 73 timer tilbake (MAX_QUEUE_WAIT_HOURS test)
    const queuedAt = i === 0 ? hours73Ago : now;

    await prisma.user.create({
      data: {
        id: p.id,
        email: `${p.id}@spread7-tosom.no`,
        name: `Spread ${p.id.slice(-2)}`,
        role: 'USER',
        onboardingComplete: true,
        deepProfileComplete: true,
        journeyState: 'QUEUED',
        matchQueuedAt: queuedAt,
      },
    });

    await prisma.profile.create({
      data: {
        userId: p.id,
        age: p.age,
        firstName: 'Spread',
        lastName: p.id.slice(-2),
        identityName: `S7${p.id.slice(-2)}`,
        postalCode: p.postal,
        latitude: geo.lat,
        longitude: geo.lon,
        interests: ['natur', 'musikk'],
        matchTags: p.matchTags,
        lifeSituation: { values: p.values },
        personality: { traits: p.personality },
        relationshipStyle: p.relStyle,
        communication: { style: p.comm },
        futureVision: { goals: p.future },
        boundaries: p.boundaries ?? null,
        emotionalNeeds: { needs: p.needs },
        lifeRhythm: p.lifeRhythm,
        maturityLevel: p.maturity,
        securityLevel: p.security,
        deepProfileData: { distancePref: p.distPref },
        preferences: p.preferences ?? null,
      },
    });
  }

  // Verifisering
  const queuedCount = await prisma.user.count({ where: { id: { in: ids }, journeyState: 'QUEUED' } });
  const geoCount = await prisma.profile.count({ where: { userId: { in: ids }, latitude: { not: null } } });

  // Spredning (via Prisma, ikke raw SQL på ikke-eksisterende kolonner)
  const profiles = await prisma.profile.findMany({ where: { userId: { in: ids } }, select: { maturityLevel: true, lifeRhythm: true, securityLevel: true, deepProfileData: true } });
  const distinctMaturity = new Set(profiles.map(p => p.maturityLevel)).size;
  const distinctRhythm = new Set(profiles.map(p => p.lifeRhythm)).size;
  const distinctSec = new Set(profiles.map(p => p.securityLevel)).size;
  const distinctDistPref = new Set(profiles.map(p => (p.deepProfileData as any)?.distancePref)).size;

  console.log(`✅ Seeda: ${queuedCount} QUEUED, ${geoCount} med koordinater`);
  console.log(`   Maturity-distinkte: ${distinctMaturity} (krav >= 5)`);
  console.log(`   LifeRhythm-distinkte: ${distinctRhythm} (krav >= 2)`);
  console.log(`   SecurityLevel-distinkte: ${distinctSec} (krav >= 2)`);
  console.log(`   DistancePref-distinkte (JSON): ${distinctDistPref} (krav >= 5)`);
  console.log(`   Totalt: ${queuedCount}/${PROFILES.length}`);
  if (queuedCount !== 60 || geoCount !== 60) {
    console.log('⚠️  IKKE alle 60 seeda!');
    process.exitCode = 1;
  }
}

main()
  .catch((e) => { console.error(e); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());