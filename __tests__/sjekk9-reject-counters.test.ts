/**
 * Sjekk 9 — avvisningstellere kan bevege seg
 *
 * Måleinstrumentet fra steg 1.1 må være bevist:
 *   1. Telleren går 0→N ved en konstruert avvisning
 *   2. Telleren står stille når ingen avvisning skjer
 *
 * Uten begge utfall er instrumentet ikke bevist.
 */

import { sjekkAlleDealbreakers } from '@/lib/matching/dealbreaker';
import { mapRejectReason } from '@/app/api/cron/matching/rejectReason';
import type { ProfileData } from '@/lib/matching/types';

function makeProfile(overrides: Partial<ProfileData> = {}): ProfileData {
  return {
    userId: 'test-id',
    firstName: 'Test',
    lastName: 'Person',
    age: 30,
    bio: null,
    interests: [],
    matchTags: [],
    personality: { traits: ['open'] },
    lifeSituation: { values: ['family'] },
    relationshipStyle: 'gradual',
    communication: { style: 'direct' },
    futureVision: { goals: ['growth'] },
    boundaries: null,
    emotionalNeeds: { needs: ['trust'] },
    lifeRhythm: 'morning',
    maturityLevel: 5,
    securityLevel: 'secure',
    lifestyle: null,
    intimacy: null,
    preferences: null,
    latitude: null,
    longitude: null,
    distancePref: null,
    ...overrides,
  };
}

/**
 * Simulerer den instrumenterte løkken fra route.ts:
 * For hvert par: pairsEvaluated++, så sjekk dealbreakers,
 * og hvis dealbreaker: rejectReasons[key]++.
 */
function simulateRound(
  pairs: [ProfileData, ProfileData][]
): { pairsEvaluated: number; rejectReasons: Record<string, number> } {
  const pairsEvaluated = { count: 0 };
  const rejectReasons: Record<string, number> = {
    mangler_profil: 0,
    sperreliste: 0,
    kjonn: 0,
    alder: 0,
    modenhetsgap: 0,
    livsrytme: 0,
    preferanser: 0,
    grenser: 0,
    radius: 0,
    sikkerhetsniva: 0,
    score_under_termin: 0,
  };

  for (const [a, b] of pairs) {
    pairsEvaluated.count++;

    const abBlocked = sjekkAlleDealbreakers(a, b);
    const baBlocked = sjekkAlleDealbreakers(b, a);
    if (abBlocked.hasDealbreaker || baBlocked.hasDealbreaker) {
      const reason = abBlocked.reason ?? baBlocked.reason;
      const key = mapRejectReason(reason);
      rejectReasons[key]++;
    }
  }

  return { pairsEvaluated: pairsEvaluated.count, rejectReasons };
}

describe('Sjekk 9 — modenhetsgap-telleren kan bevege seg', () => {
  it('skal gå fra 0 til 1 ved konstruert avvisning (gap = 8 > 4)', () => {
    // To profiler med maturityLevel 1 og 9 → gap = 8 > 4 → dealbreaker
    const a = makeProfile({ userId: 'user-a', maturityLevel: 1 });
    const b = makeProfile({ userId: 'user-b', maturityLevel: 9 });

    const result = simulateRound([[a, b]]);

    expect(result.pairsEvaluated).toBe(1);
    expect(result.rejectReasons['modenhetsgap']).toBe(1);
    // Total avvisninger > 0
    expect(Object.values(result.rejectReasons).reduce((s, v) => s + v, 0)).toBeGreaterThan(0);
  });

  it('skal stå stille (0) når ingen avvisning skjer (gap = 0 ≤ 4)', () => {
    // To profiler med identisk maturityLevel → gap = 0 → ingen dealbreaker
    const a = makeProfile({ userId: 'user-a', maturityLevel: 5 });
    const b = makeProfile({ userId: 'user-b', maturityLevel: 5 });

    const result = simulateRound([[a, b]]);

    expect(result.pairsEvaluated).toBe(1);
    expect(result.rejectReasons['modenhetsgap']).toBe(0);
    // Ingen avvisninger totalt
    expect(Object.values(result.rejectReasons).reduce((s, v) => s + v, 0)).toBe(0);
  });

  it('skal teller 0→1 og stå stille for et annet par i samme runde', () => {
    // Par 1: gap = 8 → avvises (modenhetsgap++)
    // Par 2: gap = 0 → ikke avvises (telleren står stille)
    const a1 = makeProfile({ userId: 'user-a1', maturityLevel: 1 });
    const b1 = makeProfile({ userId: 'user-b1', maturityLevel: 9 });
    const a2 = makeProfile({ userId: 'user-a2', maturityLevel: 5 });
    const b2 = makeProfile({ userId: 'user-b2', maturityLevel: 5 });

    const result = simulateRound([[a1, b1], [a2, b2]]);

    expect(result.pairsEvaluated).toBe(2);
    expect(result.rejectReasons['modenhetsgap']).toBe(1); // kun par 1
    expect(Object.values(result.rejectReasons).reduce((s, v) => s + v, 0)).toBe(1);
  });
});

describe('Sjekk 9 — radius-telleren kan bevege seg', () => {
  it('skal gå fra 0 til 1 ved konstruert avvisning (avstand > distancePref)', () => {
    // Oslo (59.91, 10.75) vs Tromsø (69.65, 18.96) → ~1000 km
    // distancePref = 100 km → for langt bort
    const a = makeProfile({
      userId: 'user-oslo',
      maturityLevel: 5,
      latitude: 59.91,
      longitude: 10.75,
      distancePref: 100,
    });
    const b = makeProfile({
      userId: 'user-tromso',
      maturityLevel: 5,
      latitude: 69.65,
      longitude: 18.96,
      distancePref: 100,
    });

    const result = simulateRound([[a, b]]);

    expect(result.pairsEvaluated).toBe(1);
    expect(result.rejectReasons['radius']).toBe(1);
  });

  it('skal stå stille (0) når par ligger innenfor grensen', () => {
    // To profiler 10 km fra hverandre, distancePref = 100 km → OK
    const a = makeProfile({
      userId: 'user-a',
      maturityLevel: 5,
      latitude: 59.91,
      longitude: 10.75,
      distancePref: 100,
    });
    const b = makeProfile({
      userId: 'user-b',
      maturityLevel: 5,
      latitude: 59.92,
      longitude: 10.76,
      distancePref: 100,
    });

    const result = simulateRound([[a, b]]);

    expect(result.pairsEvaluated).toBe(1);
    expect(result.rejectReasons['radius']).toBe(0);
    expect(Object.values(result.rejectReasons).reduce((s, v) => s + v, 0)).toBe(0);
  });
});

describe('Sjekk 9 — kjønnspreferanse-telleren kan bevege seg (WP1)', () => {
  it('skal gå fra 0 til 1 ved konstruert avvisning (søker kvinne, kandidat er mann)', () => {
    const a = makeProfile({
      userId: 'kv-a',
      lifeSituation: { gender: 'Kvinne', seekingGender: 'Mann' },
    });
    const b = makeProfile({
      userId: 'man-b',
      lifeSituation: { gender: 'Mann', seekingGender: 'Mann' },
    });

    const result = simulateRound([[a, b]]);

    expect(result.pairsEvaluated).toBe(1);
    expect(result.rejectReasons['kjonn']).toBe(1);
  });

  it('skal stå stille (0) når preferansene er enige', () => {
    const a = makeProfile({
      userId: 'kv-a',
      lifeSituation: { gender: 'Kvinne', seekingGender: 'Mann' },
    });
    const b = makeProfile({
      userId: 'man-b',
      lifeSituation: { gender: 'Mann', seekingGender: 'Kvinne' },
    });

    const result = simulateRound([[a, b]]);

    expect(result.pairsEvaluated).toBe(1);
    expect(result.rejectReasons['kjonn']).toBe(0);
    expect(Object.values(result.rejectReasons).reduce((s, v) => s + v, 0)).toBe(0);
  });
});

describe('Sjekk 9 — alderspreferanse-telleren kan bevege seg (WP1)', () => {
  it('skal gå fra 0 til 1 ved konstruert avvisning (kandidat under minste alder)', () => {
    const a = makeProfile({
      userId: 'user-a',
      age: 35,
      deepProfileData: { agePrefMin: 28, agePrefMax: 45 },
    });
    const b = makeProfile({
      userId: 'user-b',
      age: 22,
    });

    const result = simulateRound([[a, b]]);

    expect(result.pairsEvaluated).toBe(1);
    expect(result.rejectReasons['alder']).toBe(1);
  });

  it('skal stå stille (0) når kandidaten er innenfor intervallet', () => {
    const a = makeProfile({
      userId: 'user-a',
      age: 35,
      deepProfileData: { agePrefMin: 28, agePrefMax: 45 },
    });
    const b = makeProfile({
      userId: 'user-b',
      age: 30,
    });

    const result = simulateRound([[a, b]]);

    expect(result.pairsEvaluated).toBe(1);
    expect(result.rejectReasons['alder']).toBe(0);
    expect(Object.values(result.rejectReasons).reduce((s, v) => s + v, 0)).toBe(0);
  });
});

describe('mapRejectReason — kartleggingen er eksplisitt', () => {
  it('skal kartlegge Modenhets-gap til modenhetsgap', () => {
    expect(mapRejectReason('Modenhets-gap for stort (1 vs 9)')).toBe('modenhetsgap');
  });

  it('skal kartlegge Kjønnspreferanse til kjonn (WP1)', () => {
    expect(mapRejectReason('Kjønnspreferanse: søker «Kvinne», men kandidaten er «Mann» (user-a)')).toBe('kjonn');
  });

  it('skal kartlegge Alderspreferanse til alder (WP1)', () => {
    expect(mapRejectReason('Alderspreferanse: kandidat er 25 år, under minste alder 28 for user-a')).toBe('alder');
  });

  it('skal kartlegge Inkompatibel livsrytme til livsrytme', () => {
    expect(mapRejectReason('Inkompatibel livsrytme (morning vs evening)')).toBe('livsrytme');
  });

  it('skal kartlegge Sikkerhetsnivå til sikkerhetsniva', () => {
    expect(mapRejectReason('Sikkerhetsnivå-gap for stort (secure vs avoidant)')).toBe('sikkerhetsniva');
  });

  it('skal kartlegge Grense brutt til grenser', () => {
    expect(mapRejectReason('Grense brutt: no-children')).toBe('grenser');
  });

  it('skal kartlegge For langt bort til radius', () => {
    expect(mapRejectReason('For langt bort (1000 km > 100 km grense for user-a)')).toBe('radius');
  });

  it('skal kartlegge Dealbreaker: til preferanser', () => {
    expect(mapRejectReason('Dealbreaker: no-smoking')).toBe('preferanser');
  });

  it('skal kartlegge ukjent tekst til preferanser (fallback)', () => {
    expect(mapRejectReason('Noe helt nytt og ukjent')).toBe('preferanser');
  });

  it('skal håndtere undefined som preferanser', () => {
    expect(mapRejectReason(undefined)).toBe('preferanser');
  });
});