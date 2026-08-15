/**
 * B1.4 — Radius som dealbreaker (haversineKm + checkRadius)
 */

import { haversineKm } from '@/lib/matching/distance';
import { sjekkAlleDealbreakers } from '@/lib/matching/dealbreaker';
import type { ProfileData } from '@/lib/matching/types';

function baseProfile(overrides: Partial<ProfileData> = {}): ProfileData {
  return {
    userId: 'u1',
    firstName: null,
    lastName: null,
    age: 30,
    bio: null,
    interests: [],
    lifeSituation: null,
    lifestyle: null,
    personality: null,
    relationshipStyle: null,
    communication: null,
    intimacy: null,
    futureVision: null,
    boundaries: null,
    emotionalNeeds: null,
    lifeRhythm: null,
    maturityLevel: null,
    securityLevel: null,
    preferences: null,
    matchTags: [],
    latitude: null,
    longitude: null,
    distancePref: null,
    ...overrides,
  };
}

describe('haversineKm (B1.4)', () => {
  it('Oslo → Bergen ≈ 305 km (±10)', () => {
    const km = haversineKm(59.91, 10.75, 60.39, 5.32);
    expect(km).toBeGreaterThan(295);
    expect(km).toBeLessThan(315);
  });

  it('Oslo → Tromsø ≈ 1150 km (±30)', () => {
    const km = haversineKm(59.91, 10.75, 69.65, 18.96);
    expect(km).toBeGreaterThan(1120);
    expect(km).toBeLessThan(1180);
  });

  it('samme punkt = 0', () => {
    expect(haversineKm(59.91, 10.75, 59.91, 10.75)).toBeCloseTo(0, 5);
  });

  it('Oslo 0150 → 0180 (inner Oslo) < 10 km', () => {
    const km = haversineKm(59.93, 10.72, 59.91, 10.75);
    expect(km).toBeLessThan(10);
  });
});

describe('sjekkAlleDealbreakers — radius (B1.4)', () => {
  it('blokkerer: A Oslo (30 km) + B Tromsø → hasDealbreaker=true', () => {
    const a = baseProfile({ userId: 'a', latitude: 59.91, longitude: 10.75, distancePref: 30 });
    const b = baseProfile({ userId: 'b', latitude: 69.65, longitude: 18.96, distancePref: 300 });
    const result = sjekkAlleDealbreakers(a, b);
    expect(result.hasDealbreaker).toBe(true);
    expect(result.reason).toContain('km');
  });

  it('tillater: A Oslo (30 km) + C Oslo 0180 → hasDealbreaker=false', () => {
    const a = baseProfile({ userId: 'a', latitude: 59.93, longitude: 10.72, distancePref: 30 });
    const c = baseProfile({ userId: 'c', latitude: 59.91, longitude: 10.75, distancePref: 300 });
    const result = sjekkAlleDealbreakers(a, c);
    expect(result.hasDealbreaker).toBe(false);
  });

  it('tossidig: A 30 km i Oslo, C i Bergen → blokkert selv om C har 300 km', () => {
    const a = baseProfile({ userId: 'a', latitude: 59.91, longitude: 10.75, distancePref: 30 });
    const c = baseProfile({ userId: 'c', latitude: 60.39, longitude: 5.32, distancePref: 300 });
    const result = sjekkAlleDealbreakers(a, c);
    expect(result.hasDealbreaker).toBe(true);
  });

  it('manglende geo-data: A har ingen koordinater → IKKE blokkert', () => {
    const a = baseProfile({ userId: 'a', latitude: null, longitude: null, distancePref: 30 });
    const b = baseProfile({ userId: 'b', latitude: 69.65, longitude: 18.96, distancePref: 300 });
    const result = sjekkAlleDealbreakers(a, b);
    expect(result.hasDealbreaker).toBe(false);
  });

  it('manglende distancePref (null): A Oslo, B Tromsø → IKKE blokkert', () => {
    const a = baseProfile({ userId: 'a', latitude: 59.91, longitude: 10.75, distancePref: null });
    const b = baseProfile({ userId: 'b', latitude: 69.65, longitude: 18.96, distancePref: null });
    const result = sjekkAlleDealbreakers(a, b);
    expect(result.hasDealbreaker).toBe(false);
  });
});
