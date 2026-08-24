/**
 * F2: Ekvivalens- og skalingstester for matcherunde-kjernen.
 *
 * Det kritiske kravet: cheapSjekkAll(A, B) må returnere NØYAKTIG same
 * reason-streng som den gamle ruten:
 *   sjekkAlleDealbreakers(A, B).reason ?? sjekkAlleDealbreakers(B, A).reason
 *
 * Testane:
 *  1. Fixture-matrise (handskapte profil-par som treffer kvar enkelt sjekk
 *     + prioritets-kombinasjonar)
 *  2. Egenskapstest: seeda tilfeldige profiler × tusenvis av par
 *  3. scoreRound-adferd (sperreliste, manglar_profil, MIN_SCORE, deadline)
 *  4. Prestasjon (500 kandidatar må passere i under 2s i CI)
 */
import { ProfileData } from '@/lib/matching/types';
import { sjekkAlleDealbreakers } from '@/lib/matching/dealbreaker';
import { buildCheapFeatures, cheapSjekkAll } from '@/lib/matching/cheapFeatures';
import { scoreRound, normalizePair, emptyRejectReasons } from '@/lib/matching/scoreRound';
import { mapRejectReason } from '@/lib/matching/rejectReason';

/* ─────────── Fixture-hjelpar ─────────── */

function mkProfile(overrides: Partial<ProfileData> = {}): ProfileData {
  const base: ProfileData = {
    userId: 'u' + Math.random().toString(36).slice(2, 8),
    firstName: 'Test',
    lastName: 'Bruker',
    age: 30,
    bio: 'en person',
    interests: ['musikk'],
    lifeSituation: { gender: 'Mann', seekingGender: 'Alle kjønner' } as Record<string, unknown>,
    lifestyle: null,
    personality: null,
    relationshipStyle: null,
    communication: null,
    intimacy: null,
    futureVision: null,
    boundaries: null,
    emotionalNeeds: null,
    lifeRhythm: null,
    maturityLevel: 5,
    securityLevel: null,
    preferences: null,
    matchTags: [],
  };
  return { ...base, ...overrides };
}

/** Den GAMLE logikken frå ruten (referanse i testane). */
function oldReason(a: ProfileData, b: ProfileData): string | null {
  const ab = sjekkAlleDealbreakers(a, b);
  const ba = sjekkAlleDealbreakers(b, a);
  if (ab.hasDealbreaker || ba.hasDealbreaker) return ab.reason ?? ba.reason ?? null;
  return null;
}

/* ─────────── 1. Fixture-matrise ─────────── */

describe('cheapSjekkAll ≡ sjekkAlleDealbreakers(A,B) ?? (B,A)', () => {
  const matrix: Array<[string, ProfileData]> = [
    ['nøytral mann', mkProfile({})],
    ['nøytral kvinne', mkProfile({ lifeSituation: { gender: 'Kvinne', seekingGender: 'Mann' } })],
    ['legacy man/female', mkProfile({ lifeSituation: { gender: 'male', seekingGender: 'female' } })],
    ['legacy man/male', mkProfile({ lifeSituation: { gender: 'male', seekingGender: 'male' } })],
    ['ikke-binær, kjemisk tiltrekning', mkProfile({ lifeSituation: { gender: 'Ikke-binær', seekingGender: 'Kjemisk tiltrekning' } })],
    ['genderfluid, alle kjønner', mkProfile({ lifeSituation: { gender: 'Genderfluid', seekingGender: 'Alle kjønner' } })],
    ['legacy begge', mkProfile({ lifeSituation: { gender: 'Mann', seekingGender: 'begge' } })],
    ['mangler kjønn', mkProfile({ lifeSituation: { gender: null, seekingGender: 'Kvinne' } as Record<string, unknown> })],
    ['mangler søk', mkProfile({ lifeSituation: { gender: 'Mann', seekingGender: null } as Record<string, unknown> })],
    // Alder
    ['søker 40+ — 30 år', mkProfile({ deepProfileData: { agePrefMin: 40 } })],
    ['søker max 25 — 30 år', mkProfile({ deepProfileData: { agePrefMax: 25 } })],
    ['søker min 30 — nøyaktig 30', mkProfile({ age: 30, deepProfileData: { agePrefMin: 30 } })],
    ['søker max 30 — nøyaktig 30', mkProfile({ age: 30, deepProfileData: { agePrefMax: 30 } })],
    ['alderspref min 31 — 30 år (fail)', mkProfile({ age: 30, deepProfileData: { agePrefMin: 31 } })],
    ['alderspref max 29 — 30 år (fail)', mkProfile({ age: 30, deepProfileData: { agePrefMax: 29 } })],
    ['mangler alder med pref', mkProfile({ age: null, deepProfileData: { agePrefMin: 40 } })],
    ['alderspref som string', mkProfile({ deepProfileData: { agePrefMin: '40' } })],
    // Modenheit
    ['modenheit 1', mkProfile({ maturityLevel: 1 })],
    ['modenheit 6 (gap 5 mot m1)', mkProfile({ maturityLevel: 6 })],
    ['modenheit 5 (gap 4 mot m1 — pass)', mkProfile({ maturityLevel: 5 })],
    ['modenheit null', mkProfile({ maturityLevel: null })],
    // Livsrytme
    ['morgenmenneske', mkProfile({ lifeRhythm: 'morning' })],
    ['kveldsmenneske', mkProfile({ lifeRhythm: 'evening' })],
    ['hurtig', mkProfile({ lifeRhythm: 'fast' })],
    ['sakte', mkProfile({ lifeRhythm: 'slow' })],
    ['ukjent livsrytme', mkProfile({ lifeRhythm: 'nattergal' })],
    // Preferanser/tags
    ['dealbreaker smoking', mkProfile({ preferences: { dealbreakers: ['smoking'] } })],
    ['tag smoking', mkProfile({ matchTags: ['smoking', 'natur'] })],
    ['dealbrekker utan overlap', mkProfile({ preferences: { dealbreakers: ['gambling'] } })],
    // Grenser
    ['grense no_alcohol (excludes)', mkProfile({ boundaries: { excludes: ['no_alcohol'] } })],
    ['grense no_alcohol (includes)', mkProfile({ boundaries: { includes: ['no_alcohol'] } })],
    ['grenser utan overlap', mkProfile({ boundaries: { excludes: ['vegan'] }, matchTags: [] })],
    // Radius
    ['Oslo sentrum, pref 10km', mkProfile({ latitude: 59.9139, longitude: 10.7522, distancePref: 10 })],
    ['Bærum, pref 10km', mkProfile({ latitude: 59.9410, longitude: 10.7137, distancePref: 10 })],
    ['Trondheim', mkProfile({ latitude: 63.4305, longitude: 10.3950, distancePref: 100 })],
    ['Oslo, ingen pref', mkProfile({ latitude: 59.9250, longitude: 10.7565 })],
    ['ingen geo', mkProfile({})],
    // Sikkerheitsnivå
    ['usikker', mkProfile({ securityLevel: 'usikker' })],
    ['secure (legacy)', mkProfile({ securityLevel: 'secure' })],
    ['sikker (norsk)', mkProfile({ securityLevel: 'sikker' })],
    ['trygg (norsk)', mkProfile({ securityLevel: 'trygg' })],
    ['ambivalent', mkProfile({ securityLevel: 'ambivalent' })],
    ['ukomfortabel', mkProfile({ securityLevel: 'ukomfortabel' })],
    ['ukjent sikkerheit', mkProfile({ securityLevel: 'xyz' })],
  ];

  test('same reason-streng for alle par i matrisa', () => {
    const features = matrix.map(([, p]) => buildCheapFeatures(p));
    let checked = 0;
    for (let i = 0; i < matrix.length; i++) {
      for (let j = i + 1; j < matrix.length; j++) {
        const expected = oldReason(matrix[i][1], matrix[j][1]);
        const actual = cheapSjekkAll(features[i], features[j]);
        expect(actual).toBe(expected);
        checked++;
      }
    }
    // Matrisa må faktisk vere stor nok til at testet betyr noko
    expect(checked).toBeGreaterThanOrEqual(400);
  });

  test('matrisa dekkjer kvar avvisningskategori (M-12-nøklar)', () => {
    const features = matrix.map(([, p]) => buildCheapFeatures(p));
    const keys = new Set<string>();
    for (let i = 0; i < matrix.length; i++) {
      for (let j = i + 1; j < matrix.length; j++) {
        const r = cheapSjekkAll(features[i], features[j]);
        if (r) keys.add(mapRejectReason(r));
      }
    }
    expect(Array.from(keys)).toEqual(
      expect.arrayContaining(['kjonn', 'alder', 'modenhetsgap', 'livsrytme', 'preferanser', 'grenser', 'radius', 'sikkerhetsniva'])
    );
  });

  test('prioritet ved fleirfeil-par (første feil i original rekkjefølgje vinn)', () => {
    // Kjønn(1) + alder(2) + modenheit(3) + radius(7) + sikkerheit(8) alle feil
    const multiFail = mkProfile({
      lifeSituation: { gender: 'Kvinne', seekingGender: 'Mann' },
      age: 50,
      deepProfileData: { agePrefMin: 60 },
      maturityLevel: 10,
      latitude: 63.4305,
      longitude: 10.3950,
      distancePref: 10,
      securityLevel: 'secure',
    });
    const ref = mkProfile({
      lifeSituation: { gender: 'Mann', seekingGender: 'Mann' },
      age: 30,
      maturityLevel: 1,
      latitude: 59.9139,
      longitude: 10.7522,
      distancePref: 10,
      securityLevel: 'usikker',
    });
    const cheap = cheapSjekkAll(buildCheapFeatures(multiFail), buildCheapFeatures(ref));
    expect(cheap).toBe(oldReason(multiFail, ref));
    // Kjønn er sjekk #1 → kjonn må vinne over dei andre fem feila
    expect(mapRejectReason(cheap!)).toBe('kjonn');
  });
});

/* ─────────── 2. Egenskapstest (seida tilfeldige profiler) ─────────── */

// mulberry32 — liten seeda PRNG (deterministisk test)
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randomProfile(rng: () => number, idx: number): ProfileData {
  const pick = <T,>(arr: T[]): T => arr[Math.floor(rng() * arr.length)];
  const maybe = <T,>(v: T, p: number): T | null => (rng() < p ? v : null);
  const age = maybe(Math.floor(18 + rng() * 60), 0.9);
  const hasPref = rng() < 0.6;
  const lat = maybe(58.9 + rng() * 2.5, 0.5);
  const lon = maybe(6.5 + rng() * 7, 0.5);
  const nTags = Math.floor(rng() * 3);
  const tags: string[] = [];
  for (let k = 0; k < nTags; k++) tags.push(pick(TAG_POOL));
  return {
    userId: 'rand' + idx,
    firstName: 'Rand',
    lastName: 'Prof',
    age,
    bio: rng() < 0.5 ? 'liker musikk og natur' : 'en person',
    interests: rng() < 0.5 ? ['musikk', 'natur'] : [],
    lifeSituation: {
      gender: pick(RANDOM_GENDERS),
      seekingGender: pick(RANDOM_SEEKING),
    } as Record<string, unknown>,
    lifestyle: null,
    personality: null,
    relationshipStyle: null,
    communication: null,
    intimacy: null,
    futureVision: null,
    boundaries:
      rng() < 0.3
        ? {
            excludes: rng() < 0.5 ? [pick(TAG_POOL)] : undefined,
            includes: rng() < 0.5 ? [pick(TAG_POOL)] : undefined,
          }
        : null,
    emotionalNeeds: null,
    lifeRhythm: pick(RANDOM_RHYTHMS),
    maturityLevel: maybe(Math.floor(1 + rng() * 10), 0.8),
    securityLevel: pick(RANDOM_SECURITY),
    preferences: rng() < 0.3 ? { dealbreakers: [pick(TAG_POOL)] } : null,
    matchTags: tags,
    deepProfileData: hasPref
      ? {
          agePrefMin: rng() < 0.5 ? Math.floor(18 + rng() * 30) : undefined,
          agePrefMax: rng() < 0.5 ? Math.floor(40 + rng() * 40) : undefined,
        }
      : null,
    latitude: lat,
    longitude: lat != null ? lon : null,
    distancePref: rng() < 0.4 ? Math.floor(10 + rng() * 490) : null,
  };
}

const RANDOM_GENDERS = ['Mann', 'Kvinne', 'Ikke-binær', 'Genderfluid', 'male', 'female', 'annen', null];
const RANDOM_SEEKING = ['Kvinne', 'Mann', 'Ikke-binær', 'Alle kjønner', 'Kjemisk tiltrekning', 'begge', 'annen', null];
const RANDOM_RHYTHMS = ['morning', 'evening', 'fast', 'slow', 'nattergal', null];
const RANDOM_SECURITY = ['secure', 'sikker', 'trygg', 'ambivalent', 'ambivalert', 'usikker', 'unsicher', 'ukomfortabel', 'xyz', null];
const TAG_POOL = ['smoking', 'natur', 'gaming', 'vegan', 'musikk'];

describe('egenskapstest: seeda tilfeldige profiler', () => {
  test('4000 tilfeldige par: same reason som den gamle logikken', () => {
    const rng = mulberry32(20260817);
    const N = 150;
    const profiles: ProfileData[] = [];
    for (let i = 0; i < N; i++) profiles.push(randomProfile(rng, i));
    const features = profiles.map((p) => buildCheapFeatures(p));

    let mismatches = 0;
    let firstMismatch = '';
    for (let k = 0; k < 4000; k++) {
      const i = Math.floor(rng() * N);
      let j = Math.floor(rng() * N);
      if (i === j) j = (j + 1) % N;
      const expected = oldReason(profiles[i], profiles[j]);
      const actual = cheapSjekkAll(features[i], features[j]);
      if (expected !== actual) {
        mismatches++;
        if (!firstMismatch) {
          firstMismatch = `${profiles[i].userId}+${profiles[j].userId}: old=${JSON.stringify(expected)} new=${JSON.stringify(actual)}`;
        }
      }
    }
    if (mismatches > 0) {
      throw new Error(`${mismatches} mismatch(es). Første: ${firstMismatch}`);
    }
  });
});

/* ─────────── 3. scoreRound-adferd ─────────── */

describe('scoreRound (ren kjerne)', () => {
  const farFuture = Date.now() + 60_000;

  test('sperreliste blokkerer éin spesifikk kombinasjon (begge retningar)', () => {
    const cands = [
      { id: 'a', profile: mkProfile({ userId: 'a' }) },
      { id: 'b', profile: mkProfile({ userId: 'b' }) },
      { id: 'c', profile: mkProfile({ userId: 'c' }) },
    ];
    const features = cands.map((c) => buildCheapFeatures(c.profile!));
    const blockSet = new Set([normalizePair('b', 'a').join(':')]); // omvendt rekkjefølgje
    const r = scoreRound(cands, features, blockSet, { deadline: farFuture, minScore: 0 });
    expect(r.rejectReasons['sperreliste']).toBe(1);
    expect(r.pairsEvaluated).toBe(3);
    // a+c og b+c skal fortsatt score (minScore 0)
    expect(r.pairs).toHaveLength(2);
  });

  test('mangler profil tellast som mangler_profil', () => {
    const cands = [
      { id: 'a', profile: mkProfile({ userId: 'a' }) },
      { id: 'n', profile: null },
      { id: 'b', profile: mkProfile({ userId: 'b' }) },
    ];
    const features = cands.map((c) => (c.profile ? buildCheapFeatures(c.profile) : null));
    const r = scoreRound(cands, features, new Set(), { deadline: farFuture, minScore: 0 });
    expect(r.rejectReasons['mangler_profil']).toBe(2); // a+n og n+b
    expect(r.pairs).toHaveLength(1); // a+b
  });

  test('MIN_SCORE-terminal: alt under terminal avvisast som score_under_termin', () => {
    const cands = [
      { id: 'a', profile: mkProfile({ userId: 'a' }) },
      { id: 'b', profile: mkProfile({ userId: 'b' }) },
    ];
    const features = cands.map((c) => buildCheapFeatures(c.profile!));
    // Max mogleg score er 100 → terminal 101 avviser alt som ikkje er dealbreaka
    const r = scoreRound(cands, features, new Set(), { deadline: farFuture, minScore: 101 });
    expect(r.pairs).toHaveLength(0);
    expect(r.rejectReasons['score_under_termin']).toBe(1);
    expect(r.allScores).toHaveLength(1);
    expect(Object.keys(r.levelCounts).length).toBe(1);
  });

  test('deadline i gåande: inga einaste par blir evaluert', () => {
    const cands = [
      { id: 'a', profile: mkProfile({ userId: 'a' }) },
      { id: 'b', profile: mkProfile({ userId: 'b' }) },
    ];
    const features = cands.map((c) => buildCheapFeatures(c.profile!));
    const r = scoreRound(cands, features, new Set(), { deadline: Date.now() - 1000, minScore: 0 });
    expect(r.pairsEvaluated).toBe(0);
    expect(r.candidatesScored).toBe(0);
    expect(r.deadlineHit).toBe(true);
  });

  test('rejectReasons startar med alle 12 M-12-nøklar på 0', () => {
    const r0 = emptyRejectReasons();
    expect(r0['scoring_feil']).toBe(0);
    expect(r0['sikkerhetsniva']).toBe(0);
    expect(Object.keys(r0)).toHaveLength(12);
  });
});

/* ─────────── 4. Prestasjon (CI-garanti) ─────────── */

describe('prestation', () => {
  test(
    'S1: 5 000 kandidatar, alle par kjønnsavviste — 12,5 mill. billige sjekk i under 8s',
    () => {
      // Alle menn som søker kvinner → kvart par døyr ved sjekk #1 (kjønn).
      // Dette er det rene O(n²)-filteret — hovudlasta i ein stor kø.
      const cands: Array<{ id: string; profile: ProfileData | null }> = [];
      for (let i = 0; i < 5000; i++) {
        cands.push({
          id: 'f5k' + i,
          profile: mkProfile({
            userId: 'f5k' + i,
            lifeSituation: { gender: 'Mann', seekingGender: 'Kvinne' },
            age: 20 + (i % 50),
          }),
        });
      }
      const features = cands.map((c) => (c.profile ? buildCheapFeatures(c.profile) : null));
      const started = Date.now();
      const r = scoreRound(cands, features, new Set(), { deadline: Date.now() + 60_000, minScore: 0 });
      const elapsed = Date.now() - started;
      expect(r.pairsEvaluated).toBe(12_497_500); // 5000*4999/2
      expect(r.rejectReasons['kjonn']).toBe(12_497_500);
      expect(r.pairs).toHaveLength(0);
      expect(r.deadlineHit).toBe(false);
      expect(elapsed).toBeLessThan(8000);
    },
    30_000
  );

  test(
    'S1b: 150 kandidatar som alle passer filtera — ~11 000 unifiedScore-kall i under 3s',
    () => {
      const cands: Array<{ id: string; profile: ProfileData | null }> = [];
      for (let i = 0; i < 150; i++) {
        cands.push({
          id: 's150' + i,
          profile: mkProfile({
            userId: 's150' + i,
            age: 25 + (i % 30),
            interests: ['musikk', 'natur', 'film'],
            bio: 'liker musikk, natur og film',
          }),
        });
      }
      const features = cands.map((c) => (c.profile ? buildCheapFeatures(c.profile) : null));
      const started = Date.now();
      const r = scoreRound(cands, features, new Set(), { deadline: Date.now() + 30_000, minScore: 0 });
      const elapsed = Date.now() - started;
      expect(r.allScores.length).toBe(11_175); // 150*149/2
      expect(elapsed).toBeLessThan(3000);
    },
    15_000
  );
});