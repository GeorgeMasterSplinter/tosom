/**
 * ToSom — Enhetstester for unifiedScorer
 *
 * FORSKNINGSMOTOR F-8: Tester dei 6 nye dimensjonene, vekter,
 * psykometrisk-first vs ordoverlapp-fallback, og edge-tilfeller.
 */

import {
  unifiedScore,
  calculateTotalScore,
  DIMENSION_WEIGHTS,
} from '@/lib/matching/unifiedScorer';
import { toResonanceLevel } from '@/lib/matching/resonanceLevel';
import { ResonanceLevel } from '@prisma/client';
import type { ProfileData } from '@/lib/matching/types';

// Miniprofiler for testing (fallback-tilfelle: ingen psykometriske skårer).
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

const SIX_DIMS = [
  'values', 'attachment', 'personality',
  'communication', 'emotionRegulation', 'lifeSituation',
] as const;

describe('unifiedScore (F-8: 6 dimensjoner)', () => {
  it('skal returnere score mellom 0 og 100', () => {
    const result = unifiedScore(makeProfile(), makeProfile());
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it('skal returnere breakdown med alle 6 dimensjonene', () => {
    const result = unifiedScore(makeProfile(), makeProfile());
    for (const d of SIX_DIMS) {
      expect(result.breakdown[d]).toBeDefined();
      expect(typeof result.breakdown[d]).toBe('number');
    }
  });

  it('identiske profiler skal gi høy score', () => {
    const a = makeProfile();
    const b = makeProfile();
    expect(unifiedScore(a, b).score).toBeGreaterThanOrEqual(60);
  });

  it('empty profiler skal krasje ikke', () => {
    const result = unifiedScore({} as ProfileData, {} as ProfileData);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it('weight-sum skal være ~1.0 (§7)', () => {
    const wSum = Object.values(DIMENSION_WEIGHTS).reduce((s, w) => s + w, 0);
    expect(wSum).toBeCloseTo(1.0, 4);
  });

  it('har vektene frå §7 (values 0.25, attachment 0.25, ...)', () => {
    expect(DIMENSION_WEIGHTS.values).toBe(0.25);
    expect(DIMENSION_WEIGHTS.attachment).toBe(0.25);
    expect(DIMENSION_WEIGHTS.personality).toBe(0.15);
    expect(DIMENSION_WEIGHTS.communication).toBe(0.15);
    expect(DIMENSION_WEIGHTS.emotionRegulation).toBe(0.10);
    expect(DIMENSION_WEIGHTS.lifeSituation).toBe(0.10);
  });

  describe('psykometrisk-first vs fallback', () => {
    const bigFive = { openness: 3, conscientiousness: 3, extraversion: 3, agreeableness: 3, neuroticism: 3 };

    it('bruker psykometriske skårer når begge har dei (attachment)', () => {
      // Trygg+trygg skal gi 100 på attachment — ikkje fallback-relasjonsstil.
      const a = makeProfile({ attachment: { anxiety: 2, avoidance: 2, style: 'secure' } });
      const b = makeProfile({ attachment: { anxiety: 2, avoidance: 2, style: 'secure' } });
      expect(unifiedScore(a, b).breakdown.attachment).toBe(100);
    });

    it('engstelig + unnvikende gir lav attachment-score (hele poenget)', () => {
      const a = makeProfile({ attachment: { anxiety: 4, avoidance: 2, style: 'anxious' } });
      const b = makeProfile({ attachment: { anxiety: 2, avoidance: 4, style: 'avoidant' } });
      expect(unifiedScore(a, b).breakdown.attachment).toBe(25);
    });

    it('faller tilbake til ordoverlapp når ein profil manglar skårer', () => {
      // A har bigFive, B ikkje → personality faller til ordoverlapp (ikkje BFI-matrise).
      const a = makeProfile({ bigFive, personality: { traits: ['open', 'calm'] } });
      const b = makeProfile({ personality: { traits: ['open', 'calm'] } });
      const r = unifiedScore(a, b);
      // Identiske ord → 100 via ordoverlapp (fallback), ikkje BFI-kompatibilitet.
      expect(r.breakdown.personality).toBe(100);
    });

    it('to identiske BFI-profiler med psyk skårer score likt personlighet', () => {
      const a = makeProfile({ bigFive });
      const b = makeProfile({ bigFive });
      expect(unifiedScore(a, b).breakdown.personality).toBeGreaterThan(70);
    });

    it('verdier bruker PVQ-korrelasjon når begge har valueProfile', () => {
      const vpA = { security: 5, benevolence: 4, stimulation: 2, power: 3 };
      const vpB = { security: 5, benevolence: 5, stimulation: 1, power: 3 };
      const a = makeProfile({ valueProfile: vpA });
      const b = makeProfile({ valueProfile: vpB });
      expect(unifiedScore(a, b).breakdown.values).toBeGreaterThan(80);
    });
  });

  // M-1: Én kilde for resonansterskler. Nivået kjem frå toResonanceLevel
  // (kanonisk 80/65/50/40).
  describe('M-1: resonansnivå frå toResonanceLevel (kanonisk 80/65/50/40)', () => {
    it('unifiedScore().level er alltid = toResonanceLevel(score) (én kilde)', () => {
      const cases: Array<[ProfileData, ProfileData]> = [
        [makeProfile(), makeProfile()],
        [makeProfile({ attachment: { anxiety: 4, avoidance: 2, style: 'anxious' } }),
         makeProfile({ attachment: { anxiety: 2, avoidance: 4, style: 'avoidant' } })],
        [{} as ProfileData, {} as ProfileData],
      ];
      for (const [a, b] of cases) {
        const result = unifiedScore(a, b);
        expect(result.level).toBe(toResonanceLevel(result.score));
      }
    });

    it('tersklene 80/65/50/40 er kanoniske', () => {
      expect(toResonanceLevel(80)).toBe(ResonanceLevel.DEEP);
      expect(toResonanceLevel(65)).toBe(ResonanceLevel.STRONG);
      expect(toResonanceLevel(50)).toBe(ResonanceLevel.MODERATE);
      expect(toResonanceLevel(40)).toBe(ResonanceLevel.GENTLE);
    });
  });
});

describe('calculateTotalScore (backwards compat)', () => {
  it('skal returnere totalScore mellom 0 og 1', () => {
    const result = calculateTotalScore(makeProfile(), makeProfile());
    expect(result.totalScore).toBeGreaterThanOrEqual(0);
    expect(result.totalScore).toBeLessThanOrEqual(1);
  });

  it('skal ha breakdown med base, resonance, semantic, intimacy, future', () => {
    const result = calculateTotalScore(makeProfile(), makeProfile());
    expect(result.breakdown.base).toBeDefined();
    expect(result.breakdown.resonance).toBeDefined();
    expect(result.breakdown.semantic).toBeDefined();
    expect(result.breakdown.intimacy).toBeDefined();
    expect(result.breakdown.future).toBeDefined();
  });
});