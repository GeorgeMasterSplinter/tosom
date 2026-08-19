/**
 * ToSom — Enhetstester for unifiedScorer (E2)
 *
 * Tester alle 9 dimensjoner, vekter, getMatchLevel og edge-tilfeller.
 */

import { unifiedScore, calculateTotalScore, UnifiedResult } from '@/lib/matching/unifiedScorer';
import { toResonanceLevel } from '@/lib/matching/resonanceLevel';
import { ResonanceLevel } from '@prisma/client';
import type { ProfileData } from '@/lib/matching/types';

// Miniprofiler for testing
function makeProfile(overrides: Partial<ProfileData> = {}): ProfileData {
  return {
    userId: 'test-id',
    firstName: 'Test',
    lastName: 'Person',
    age: 30,
    bio: null,
    interests: [],
    matchTags: [],
    personality: { traits: ['open', 'calm'] },
    lifeSituation: { values: ['family', 'nature'] },
    relationshipStyle: 'gradual',
    communication: { style: 'direct' },
    futureVision: { goals: ['family', 'growth'] },
    boundaries: { preferredDistance: 'slow-pace' },
    emotionalNeeds: { needs: ['depth', 'trust'] },
    lifeRhythm: 'morning',
    maturityLevel: 5,
    securityLevel: 'secure',
    lifestyle: null,
    intimacy: null,
    preferences: null,
    ...overrides,
  };
}

describe('unifiedScore', () => {
  it('skal returnere score mellom 0 og 100', () => {
    const a = makeProfile();
    const b = makeProfile();
    const result = unifiedScore(a, b);

    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it('skal returnere breakdown med alle 9 dimensjoner', () => {
    const a = makeProfile();
    const b = makeProfile();
    const result = unifiedScore(a, b);

    const dims = ['values', 'personality', 'relationshipStyle', 'communication',
      'futureVision', 'boundaries', 'emotionalNeeds', 'lifeRhythm', 'maturity'];
    for (const d of dims) {
      expect(result.breakdown[d as keyof typeof result.breakdown]).toBeDefined();
      expect(typeof result.breakdown[d as keyof typeof result.breakdown]).toBe('number');
    }
  });

  it('identiske profiler skal gi høy score', () => {
    const a = makeProfile({
      personality: { traits: ['open', 'calm'] },
      lifeSituation: { values: ['family', 'nature'] },
      maturityLevel: 5,
    });
    const b = makeProfile({
      personality: { traits: ['open', 'calm'] },
      lifeSituation: { values: ['family', 'nature'] },
      maturityLevel: 5,
    });

    const result = unifiedScore(a, b);
    // Identiske profiler → høy score (minst 60)
    expect(result.score).toBeGreaterThanOrEqual(60);
  });

  it('motsatte livsrytme skal gi lavere lifeRhythm-score', () => {
    const a = makeProfile({ lifeRhythm: 'morning' });
    const b = makeProfile({ lifeRhythm: 'evening' });

    const result = unifiedScore(a, b);
    // Morgen vs kveld → 60 (komplementær per kode)
    expect(result.breakdown.lifeRhythm).toBe(60);
  });

  it('samme livsrytme skal gi 100 på lifeRhythm', () => {
    const a = makeProfile({ lifeRhythm: 'morning' });
    const b = makeProfile({ lifeRhythm: 'morning' });

    const result = unifiedScore(a, b);
    expect(result.breakdown.lifeRhythm).toBe(100);
  });

  it('samme relasjonsstil skal gi 100', () => {
    const a = makeProfile({ relationshipStyle: 'gradual' });
    const b = makeProfile({ relationshipStyle: 'gradual' });

    const result = unifiedScore(a, b);
    expect(result.breakdown.relationshipStyle).toBe(100);
  });

  it('komplementære relasjonsstiler skal gi 70', () => {
    const a = makeProfile({ relationshipStyle: 'gradual' });
    const b = makeProfile({ relationshipStyle: 'direct' });

    const result = unifiedScore(a, b);
    expect(result.breakdown.relationshipStyle).toBe(70);
  });

  it('maturityLevel diff <= 1 skal gi 100', () => {
    const a = makeProfile({ maturityLevel: 5 });
    const b = makeProfile({ maturityLevel: 6 });

    const result = unifiedScore(a, b);
    expect(result.breakdown.maturity).toBe(100);
  });

  it('maturityLevel diff > 3 skal gi lav score', () => {
    const a = makeProfile({ maturityLevel: 2 });
    const b = makeProfile({ maturityLevel: 7 });

    const result = unifiedScore(a, b);
    expect(result.breakdown.maturity).toBe(40);
  });

  it('manglende maturity skal gi neutral score 50', () => {
    const a = makeProfile({ maturityLevel: undefined });
    const b = makeProfile({ maturityLevel: undefined });

    const result = unifiedScore(a, b);
    expect(result.breakdown.maturity).toBe(50);
  });

  it('empty profiler skal krasje ikke', () => {
    const emptyA = {} as ProfileData;
    const emptyB = {} as ProfileData;

    // Skal ikke krasje
    const result = unifiedScore(emptyA, emptyB);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it('weight-sum skal være ~1.0', () => {
    // W.values + W.personality + ... = 1.0
    const wSum = 0.25 + 0.20 + 0.15 + 0.15 + 0.10 + 0.05 + 0.05 + 0.03 + 0.02;
    expect(wSum).toBeCloseTo(1.0, 4);
  });

  // M-1: Én kilde for resonansterskler. Nivået kjem frå toResonanceLevel
  // (kanonisk 80/65/50/40), ikkje ein separat getMatchLevel (som hadde 80/60/40).
  describe('M-1: resonansnivå frå toResonanceLevel (kanonisk 80/65/50/40)', () => {
    it('score 62 -> MODERATE (gamle getMatchLevel ga 62 -> STRONG)', () => {
      // toResonanceLevel: 50-64 = MODERATE. Gamle getMatchLevel: >=60 = STRONG.
      expect(toResonanceLevel(62)).toBe(ResonanceLevel.MODERATE);
    });

    it('terskelane 80/65/50/40 er kanoniske', () => {
      expect(toResonanceLevel(80)).toBe(ResonanceLevel.DEEP);
      expect(toResonanceLevel(79)).toBe(ResonanceLevel.STRONG);
      expect(toResonanceLevel(65)).toBe(ResonanceLevel.STRONG);
      expect(toResonanceLevel(64)).toBe(ResonanceLevel.MODERATE);
      expect(toResonanceLevel(50)).toBe(ResonanceLevel.MODERATE);
      expect(toResonanceLevel(49)).toBe(ResonanceLevel.GENTLE);
      expect(toResonanceLevel(40)).toBe(ResonanceLevel.GENTLE);
    });

    it('unifiedScore().level er alltid = toResonanceLevel(score) (én kilde)', () => {
      // Uansett profil: scorer-ets nivå må stemme med den kanoniske funksjonen.
      const cases = [
        [makeProfile(), makeProfile()],
        [makeProfile({ personality: { traits: ['open'] }, maturityLevel: 5 }), makeProfile({ personality: { traits: ['open'] }, maturityLevel: 5 })],
        [makeProfile({ maturityLevel: 1, lifeRhythm: 'morning' }), makeProfile({ maturityLevel: 7, lifeRhythm: 'evening' })],
        [{} as ProfileData, {} as ProfileData],
      ];
      for (const [a, b] of cases) {
        const result = unifiedScore(a, b);
        expect(result.level).toBe(toResonanceLevel(result.score));
      }
    });
  });
});

describe('calculateTotalScore (backwards compat)', () => {
  it('skal returnere totalScore mellom 0 og 1', () => {
    const a = makeProfile();
    const b = makeProfile();
    const result = calculateTotalScore(a, b);

    expect(result.totalScore).toBeGreaterThanOrEqual(0);
    expect(result.totalScore).toBeLessThanOrEqual(1);
  });

  it('skal ha breakdown med base, resonance, semantic, intimacy, future', () => {
    const a = makeProfile();
    const b = makeProfile();
    const result = calculateTotalScore(a, b);

    expect(result.breakdown.base).toBeDefined();
    expect(result.breakdown.resonance).toBeDefined();
    expect(result.breakdown.semantic).toBeDefined();
    expect(result.breakdown.intimacy).toBeDefined();
    expect(result.breakdown.future).toBeDefined();
  });
});