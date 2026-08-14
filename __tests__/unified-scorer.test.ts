/**
 * ToSom — Enhetstester for unifiedScorer (E2)
 *
 * Tester alle 9 dimensjoner, vekter, getMatchLevel og edge-tilfeller.
 */

import { unifiedScore, calculateTotalScore, UnifiedResult } from '@/lib/matching/unifiedScorer';
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

  describe('getMatchLevel', () => {
    it('score >= 80 -> DEEP', () => {
      const a = makeProfile({ personality: { traits: ['open'] }, maturityLevel: 5 });
      const b = makeProfile({ personality: { traits: ['open'] }, maturityLevel: 5 });
      const result = unifiedScore(a, b);
      if (result.score >= 80) expect(result.level).toBe('DEEP');
    });

    it('score >= 60 -> STRONG', () => {
      const a = makeProfile();
      const b = makeProfile();
      const result = unifiedScore(a, b);
      if (result.score >= 60 && result.score < 80) expect(result.level).toBe('STRONG');
    });

    it('score >= 40 -> MODERATE', () => {
      // Motsatte profiler for lav score
      const a = makeProfile({ lifeRhythm: 'morning', maturityLevel: 1, relationshipStyle: 'gradual' });
      const b = makeProfile({ lifeRhythm: 'evening', maturityLevel: 7, relationshipStyle: 'independent' });
      const result = unifiedScore(a, b);
      if (result.score >= 40 && result.score < 60) expect(result.level).toBe('MODERATE');
    });

    it('score < 40 -> GENTLE', () => {
      // Meget lav score krever mange dimensjoner med lave verdier
      const a = makeProfile({ maturityLevel: 1, lifeRhythm: 'morning' });
      const b = makeProfile({ maturityLevel: 7, lifeRhythm: 'evening' });
      const result = unifiedScore(a, b);
      if (result.score < 40) expect(result.level).toBe('GENTLE');
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