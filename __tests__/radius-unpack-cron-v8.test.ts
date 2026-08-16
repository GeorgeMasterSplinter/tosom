/**
 * ACT v8 Steg 1.2 — distancePref-unpacking i cron/matching candidates-map
 *
 * Verifiserer at distancePref trekkes ut fra deepProfileData (JSON-blob)
 * med samme logikk som findBestResonance.ts:321.
 *
 * Problemet: distancePref finnes IKKE som kolonne i Prisma-skjemaet,
 * bare inne i deepProfileData (JSON). Før v8 pakket cron-ruten den ikke
 * ut, så sjekkAlleDealbreakers fant alltid null → radiussperren var inaktiv.
 */

// Eksakt samme transformasjon som app/api/cron/matching/route.ts
function unpackCandidate(queuedUser: {
  id: string;
  profile: any | null;
}): { id: string; profile: any } {
  const p = queuedUser.profile || null;
  return {
    id: queuedUser.id,
    profile: p
      ? {
          ...p,
          distancePref:
            typeof (p.deepProfileData as Record<string, unknown> | null)?.distancePref === 'number'
              ? (p.deepProfileData as Record<string, unknown>).distancePref as number
              : null,
        }
      : null,
  };
}

describe('cron/matching — distancePref-unpacking fra deepProfileData (v8)', () => {
  it('trekker ut distancePref=50 når deepProfileData inneholder tallet', () => {
    const user = {
      id: 'user-1',
      profile: {
        userId: 'user-1',
        latitude: 59.91,
        longitude: 10.75,
        deepProfileData: { distancePref: 50, otherField: 'x' },
      },
    };
    const candidate = unpackCandidate(user);
    expect(candidate.profile.distancePref).toBe(50);
    // Øvrige felter bevares via spread
    expect(candidate.profile.latitude).toBe(59.91);
  });

  it('setter distancePref=null når deepProfileData er null', () => {
    const user = {
      id: 'user-2',
      profile: {
        userId: 'user-2',
        latitude: 59.91,
        longitude: 10.75,
        deepProfileData: null,
      },
    };
    const candidate = unpackCandidate(user);
    expect(candidate.profile.distancePref).toBeNull();
  });

  it('setter distancePref=null når deepProfileData ikke inneholder distancePref', () => {
    const user = {
      id: 'user-3',
      profile: {
        userId: 'user-3',
        latitude: 59.91,
        longitude: 10.75,
        deepProfileData: { someOtherKey: 42 },
      },
    };
    const candidate = unpackCandidate(user);
    expect(candidate.profile.distancePref).toBeNull();
  });

  it('setter distancePref=null når deepProfileData.distancePref er string (ikke number)', () => {
    const user = {
      id: 'user-4',
      profile: {
        userId: 'user-4',
        latitude: 59.91,
        longitude: 10.75,
        deepProfileData: { distancePref: '50' },
      },
    };
    const candidate = unpackCandidate(user);
    // String er ikke number → null
    expect(candidate.profile.distancePref).toBeNull();
  });

  it('setter profile=null når user.profile er null (mangler_profil)', () => {
    const user = {
      id: 'user-5',
      profile: null,
    };
    const candidate = unpackCandidate(user);
    expect(candidate.profile).toBeNull();
  });

  it('setter profile=null når user.profile er undefined', () => {
    const user = {
      id: 'user-6',
      profile: undefined as any,
    };
    const candidate = unpackCandidate(user);
    expect(candidate.profile).toBeNull();
  });

  // Integrasjon: sjekkAlleDealbreakers ser nå distancePref
  // Lokal baseProfile (ikke eksportert fra lib/matching/types)
  function localBaseProfile(overrides: Record<string, unknown> = {}) {
    return {
      userId: 'x',
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
      latitude: null as number | null,
      longitude: null as number | null,
      distancePref: null as number | null,
      ...overrides,
    };
  }

  it('sjekkAlleDealbreakers blokkerer NÅR distancePref er unpacked (Oslo→Tromsø, 30 km)', async () => {
    const { sjekkAlleDealbreakers } = await import('@/lib/matching/dealbreaker');

    const a = localBaseProfile({ userId: 'a', latitude: 59.91, longitude: 10.75, distancePref: 30 });
    const b = localBaseProfile({ userId: 'b', latitude: 69.65, longitude: 18.96, distancePref: 300 });
    const result = sjekkAlleDealbreakers(a as any, b as any);
    expect(result.hasDealbreaker).toBe(true);
  });

  it('sjekkAlleDealbreakers IKKE blokkert når distancePref er null (mangler data)', async () => {
    const { sjekkAlleDealbreakers } = await import('@/lib/matching/dealbreaker');

    const a = localBaseProfile({ userId: 'a', latitude: 59.91, longitude: 10.75, distancePref: null });
    const b = localBaseProfile({ userId: 'b', latitude: 69.65, longitude: 18.96, distancePref: null });
    const result = sjekkAlleDealbreakers(a as any, b as any);
    expect(result.hasDealbreaker).toBe(false);
  });
});
