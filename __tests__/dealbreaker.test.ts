/**
 * ToSom — Enhetstester for dealbreaker (E2)
 *
 * Tester de aktive dealbreakerene: life rhythm conflict, explicit
 * preferences, boundaries. Maturity gap og security level gap er inaktive
 * siden PL-10 (syntetiske data fjernet) — testene bekrefter at de ikke
 * blokkerer lenger.
 */

import { sjekkAlleDealbreakers } from '@/lib/matching/dealbreaker';
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

describe('sjekkAlleDealbreakers', () => {
  it('skal ikke ha dealbreaker mellom kompatible profiler', () => {
    const a = makeProfile({ maturityLevel: 5, lifeRhythm: 'morning' });
    const b = makeProfile({ maturityLevel: 5, lifeRhythm: 'morning' });

    const result = sjekkAlleDealbreakers(a, b);
    expect(result.hasDealbreaker).toBe(false);
    expect(result.reason).toBeUndefined();
  });

  describe('maturity gap dealbreaker (inaktiv siden PL-10)', () => {
    it('PL-10: maturity gap > 4 blokkerer ikke lenger (syntetiske verdier fjernet)', () => {
      const a = makeProfile({ maturityLevel: 1 });
      const b = makeProfile({ maturityLevel: 7 });

      const result = sjekkAlleDealbreakers(a, b);
      expect(result.hasDealbreaker).toBe(false);
    });

    it('skal tillate ved maturity gap <= 4', () => {
      const a = makeProfile({ maturityLevel: 3 });
      const b = makeProfile({ maturityLevel: 6 }); // gap = 3

      const result = sjekkAlleDealbreakers(a, b);
      expect(result.hasDealbreaker).toBe(false);
    });

    it('skal ignorere når maturityLevel mangler', () => {
      const a = makeProfile({ maturityLevel: undefined });
      const b = makeProfile({ maturityLevel: undefined });

      const result = sjekkAlleDealbreakers(a, b);
      expect(result.hasDealbreaker).toBe(false);
    });
  });

  describe('life rhythm conflict dealbreaker', () => {
    it('skal avvise morgen vs kveld', () => {
      const a = makeProfile({ lifeRhythm: 'morning' });
      const b = makeProfile({ lifeRhythm: 'evening' });

      const result = sjekkAlleDealbreakers(a, b);
      expect(result.hasDealbreaker).toBe(true);
      expect(result.reason).toContain('livsrytme');
    });

    it('skal avvise fast vs slow', () => {
      const a = makeProfile({ lifeRhythm: 'fast' });
      const b = makeProfile({ lifeRhythm: 'slow' });

      const result = sjekkAlleDealbreakers(a, b);
      expect(result.hasDealbreaker).toBe(true);
    });

    it('skal tillate samme livsrytme', () => {
      const a = makeProfile({ lifeRhythm: 'morning' });
      const b = makeProfile({ lifeRhythm: 'morning' });

      const result = sjekkAlleDealbreakers(a, b);
      expect(result.hasDealbreaker).toBe(false);
    });

    it('skal ignorere når lifeRhythm mangler', () => {
      const a = makeProfile({ lifeRhythm: undefined });
      const b = makeProfile({ lifeRhythm: 'evening' });

      const result = sjekkAlleDealbreakers(a, b);
      expect(result.hasDealbreaker).toBe(false);
    });
  });

  describe('explicit preferences dealbreaker', () => {
    it('skal avvise når matchTag treffer dealbreaker', () => {
      const a = makeProfile({
        preferences: { dealbreakers: ['smoker'] },
      });
      const b = makeProfile({
        matchTags: ['smoker', 'active'],
      });

      const result = sjekkAlleDealbreakers(a, b);
      expect(result.hasDealbreaker).toBe(true);
      expect(result.reason).toContain('smoker');
    });

    it('skal tillate når ingen dealbreakers treffes', () => {
      const a = makeProfile({
        preferences: { dealbreakers: ['smoker'] },
      });
      const b = makeProfile({
        matchTags: ['active', 'outdoor'],
      });

      const result = sjekkAlleDealbreakers(a, b);
      expect(result.hasDealbreaker).toBe(false);
    });

    it('skal tillate når dealbreakers er undefined', () => {
      const a = makeProfile({ preferences: null });
      const b = makeProfile({ matchTags: ['smoker'] });

      const result = sjekkAlleDealbreakers(a, b);
      expect(result.hasDealbreaker).toBe(false);
    });
  });

  describe('boundaries dealbreaker', () => {
    it('skal avvise når kandidatens includes treffer brukerens excludes', () => {
      const a = makeProfile({
        boundaries: { excludes: ['children'] } as any,
      });
      const b = makeProfile({
        boundaries: { includes: ['children', 'nature'] } as any,
      });

      const result = sjekkAlleDealbreakers(a, b);
      expect(result.hasDealbreaker).toBe(true);
      expect(result.reason).toContain('Grense brutt');
    });

    it('skal tillate når ingen grenser blir brutt', () => {
      const a = makeProfile({
        boundaries: { excludes: ['children'] } as any,
      });
      const b = makeProfile({
        boundaries: { includes: ['nature', 'hiking'] } as any,
      });

      const result = sjekkAlleDealbreakers(a, b);
      expect(result.hasDealbreaker).toBe(false);
    });

    it('skal ignorere når boundaries mangler', () => {
      const a = makeProfile({ boundaries: null });
      const b = makeProfile({ boundaries: null });

      const result = sjekkAlleDealbreakers(a, b);
      expect(result.hasDealbreaker).toBe(false);
    });
  });

  describe('security level gap dealbreaker (inaktiv siden PL-10)', () => {
    it('PL-10: gap >= 2 blokkerer ikke lenger (derivert verdi fjernet)', () => {
      const a = makeProfile({ securityLevel: 'unsicher' });
      const b = makeProfile({ securityLevel: 'secure' });

      const result = sjekkAlleDealbreakers(a, b);
      expect(result.hasDealbreaker).toBe(false);
    });

    it('skal tillate ved gap < 2 (unsicher vs ambivalent)', () => {
      const a = makeProfile({ securityLevel: 'unsicher' });
      const b = makeProfile({ securityLevel: 'ambivalent' });

      const result = sjekkAlleDealbreakers(a, b);
      expect(result.hasDealbreaker).toBe(false);
    });

    it('skal tillate samme sikkerhetsnivå', () => {
      const a = makeProfile({ securityLevel: 'secure' });
      const b = makeProfile({ securityLevel: 'secure' });

      const result = sjekkAlleDealbreakers(a, b);
      expect(result.hasDealbreaker).toBe(false);
    });

    it('skal ignorere når securityLevel mangler', () => {
      const a = makeProfile({ securityLevel: undefined });
      const b = makeProfile({ securityLevel: 'secure' });

      const result = sjekkAlleDealbreakers(a, b);
      expect(result.hasDealbreaker).toBe(false);
    });
  });

  describe('barn (PL-11, D-3 = ja): kun-ja vs kun-nei', () => {
    it('skal blokkere Ja vs Nei', () => {
      const a = makeProfile({ lifestyle: { wantChildren: 'Ja' } });
      const b = makeProfile({ lifestyle: { wantChildren: 'Nei' } });

      const result = sjekkAlleDealbreakers(a, b);
      expect(result.hasDealbreaker).toBe(true);
      expect(result.reason).toBe('Ønske om barn: ja vs nei');
    });

    it('skal blokkere i begge retninger (Nei vs Ja)', () => {
      const a = makeProfile({ lifestyle: { wantChildren: 'Ja' } });
      const b = makeProfile({ lifestyle: { wantChildren: 'Nei' } });

      const result = sjekkAlleDealbreakers(b, a);
      expect(result.hasDealbreaker).toBe(true);
      expect(result.reason).toBe('Ønske om barn: nei vs ja');
    });

    it('skal IKKE blokkere Ja vs Usikker', () => {
      const a = makeProfile({ lifestyle: { wantChildren: 'Ja' } });
      const b = makeProfile({ lifestyle: { wantChildren: 'Usikker' } });

      expect(sjekkAlleDealbreakers(a, b).hasDealbreaker).toBe(false);
    });

    it('skal IKKE blokkere flervalg "Ja,Usikker" vs Nei', () => {
      const a = makeProfile({ lifestyle: { wantChildren: 'Ja,Usikker' } });
      const b = makeProfile({ lifestyle: { wantChildren: 'Nei' } });

      expect(sjekkAlleDealbreakers(a, b).hasDealbreaker).toBe(false);
    });

    it('skal IKKE blokkere når data mangler', () => {
      const a = makeProfile({ lifestyle: { wantChildren: 'Ja' } });
      const b = makeProfile({ lifestyle: null });

      expect(sjekkAlleDealbreakers(a, b).hasDealbreaker).toBe(false);
    });
  });

  describe('edge-tilfeller', () => {
    it('tomme profiler skal ikke ha dealbreaker', () => {
      const emptyA = {} as ProfileData;
      const emptyB = {} as ProfileData;

      const result = sjekkAlleDealbreakers(emptyA, emptyB);
      expect(result.hasDealbreaker).toBe(false);
    });
  });
});