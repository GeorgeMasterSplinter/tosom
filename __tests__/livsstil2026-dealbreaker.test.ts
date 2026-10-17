/**
 * ToSom — LIVSSTIL-2026 (18.10): nye dealbreakere — høyde (D-1) + «må stemme» (D-4)
 *
 * checkHeightRule: mann–kvinne-par avvises når mannen er ≥ 5 cm kortere enn
 * kvinnen. Manglende høyde/kjønn blokkerer aldri.
 * checkLifestyle2026: «må stemme» + konflikt i kompatibilitetsmatrisen avviser.
 *
 * Ekvivalens: cheapSjekkAll (hot path) må gi same reason som
 * sjekkAlleDealbreakers(A,B) ?? sjekkAlleDealbreakers(B,A) — verifiseres her
 * i tillegg til fixture-matrisen i matching-score-round.test.ts.
 */

import {
  sjekkAlleDealbreakers,
  HEIGHT_GAP_CM,
} from '@/lib/matching/dealbreaker';
import { buildCheapFeatures, cheapSjekkAll } from '@/lib/matching/cheapFeatures';
import { mapRejectReason } from '@/lib/matching/rejectReason';
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
    personality: null,
    lifeSituation: null,
    relationshipStyle: null,
    communication: null,
    futureVision: null,
    boundaries: null,
    emotionalNeeds: null,
    lifeRhythm: null,
    lifestyle: null,
    intimacy: null,
    preferences: null,
    latitude: null,
    longitude: null,
    distancePref: null,
    ...overrides,
  } as ProfileData;
}

const mann = (hoyde: number | string | null, id = 'mann-1') =>
  makeProfile({
    userId: id,
    lifeSituation: { gender: 'Mann' },
    lifestyle: { height: hoyde },
  });
const kvinne = (hoyde: number | string | null, id = 'kvinne-1') =>
  makeProfile({
    userId: id,
    lifeSituation: { gender: 'Kvinne' },
    lifestyle: { height: hoyde },
  });

describe('checkHeightRule (D-1, Alternativ A)', () => {
  it('avviser når mannen er nøyaktig 5 cm kortere enn kvinnen', () => {
    const r = sjekkAlleDealbreakers(mann(173), kvinne(178));
    expect(r.hasDealbreaker).toBe(true);
    expect(r.reason).toBe(`Høyde: mannen er 5 cm kortere enn kvinnen (≥ ${HEIGHT_GAP_CM} cm)`);
  });

  it('avviser når gapet er større enn 5 cm', () => {
    const r = sjekkAlleDealbreakers(mann(170), kvinne(180));
    expect(r.hasDealbreaker).toBe(true);
    expect(r.reason).toContain('10 cm');
  });

  it('later gjennom når gapet er under 5 cm', () => {
    expect(sjekkAlleDealbreakers(mann(174), kvinne(178)).hasDealbreaker).toBe(false); // 4 cm
  });

  it('later gjennom når mannen er like høy eller høyere', () => {
    expect(sjekkAlleDealbreakers(mann(178), kvinne(178)).hasDealbreaker).toBe(false);
    expect(sjekkAlleDealbreakers(mann(182), kvinne(175)).hasDealbreaker).toBe(false);
  });

  it('gjenkjenner par i begge retninger (kvinne først i kjedekallet)', () => {
    const r = sjekkAlleDealbreakers(kvinne(178), mann(170));
    expect(r.hasDealbreaker).toBe(true);
    expect(r.reason).toContain('8 cm');
  });

  it('manglende høyde blokkerer ALDRI (forsvarlig, som radius)', () => {
    expect(sjekkAlleDealbreakers(mann(null), kvinne(178)).hasDealbreaker).toBe(false);
    expect(sjekkAlleDealbreakers(mann(170), kvinne(null)).hasDealbreaker).toBe(false);
  });

  it('gjelder kun mann–kvinne-par (ikke-binær/tvilling-par røres ikke)', () => {
    const annen = makeProfile({
      userId: 'annen-1',
      lifeSituation: { gender: 'Ikke-binær' },
      lifestyle: { height: 160 },
    });
    expect(sjekkAlleDealbreakers(mann(170), annen).hasDealbreaker).toBe(false);
    expect(sjekkAlleDealbreakers(kvinne(180), kvinne(160, 'kvinne-2')).hasDealbreaker).toBe(false);
    expect(sjekkAlleDealbreakers(mann(170, 'mann-2'), mann(160, 'mann-3')).hasDealbreaker).toBe(false);
  });

  it('høyde som streng (fra JSON) behandles som tall', () => {
    const r = sjekkAlleDealbreakers(mann('170'), kvinne('178'));
    expect(r.hasDealbreaker).toBe(true);
  });
});

describe('checkLifestyle2026 (D-4: «må stemme»)', () => {
  const l2026 = (data: Record<string, string>) => makeProfile({ preferences: { livsstil2026: data } });

  it('avviser vegan (må stemme) vs spiser-koett', () => {
    const r = sjekkAlleDealbreakers(
      l2026({ kosthold: 'vegan', kostholdViktig: 'ma-stemme' }),
      l2026({ kosthold: 'spiser-koett', kostholdViktig: 'bor-stemme' })
    );
    expect(r.hasDealbreaker).toBe(true);
    expect(r.reason).toBe('Hverdagsvalg: kosthold (vegan vs spiser-koett) for test-id');
  });

  it('later gjennom ved «må stemme» når verdiene er kompatible (vegan vs vegetar)', () => {
    const r = sjekkAlleDealbreakers(
      l2026({ kosthold: 'vegan', kostholdViktig: 'ma-stemme' }),
      l2026({ kosthold: 'vegetar', kostholdViktig: 'ma-stemme' })
    );
    expect(r.hasDealbreaker).toBe(false);
  });

  it('later gjennom ved konflikt uten «må stemme» (D-4: kun «bør stemme» scorer)', () => {
    const r = sjekkAlleDealbreakers(
      l2026({ kosthold: 'vegan', kostholdViktig: 'bor-stemme' }),
      l2026({ kosthold: 'spiser-koett', kostholdViktig: 'bor-stemme' })
    );
    expect(r.hasDealbreaker).toBe(false);
  });

  it('manglende verdi blokkerer aldri', () => {
    const r = sjekkAlleDealbreakers(
      l2026({ kosthold: 'vegan', kostholdViktig: 'ma-stemme' }),
      l2026({}) // partneren har ikke svart
    );
    expect(r.hasDealbreaker).toBe(false);
  });

  it('dyr: hund vs katt er det eneste harde konfliktet («må stemme»)', () => {
    const r = sjekkAlleDealbreakers(
      l2026({ dyr: 'hund', dyrViktig: 'ma-stemme' }),
      l2026({ dyr: 'katt', dyrViktig: 'ma-stemme' })
    );
    expect(r.hasDealbreaker).toBe(true);
    expect(r.reason).toContain('Hverdagsvalg: dyr');
    // hund + ingen dyr er ikke en konflikt
    expect(
      sjekkAlleDealbreakers(
        l2026({ dyr: 'hund', dyrViktig: 'ma-stemme' }),
        l2026({ dyr: 'ingen', dyrViktig: 'bor-stemme' })
      ).hasDealbreaker
    ).toBe(false);
  });

  it('bil: full-el vs bensin («må stemme») avvises; full-el vs phev later', () => {
    expect(
      sjekkAlleDealbreakers(
        l2026({ bil: 'full-el', bilViktig: 'ma-stemme' }),
        l2026({ bil: 'bensin', bilViktig: 'bor-stemme' })
      ).hasDealbreaker
    ).toBe(true);
    expect(
      sjekkAlleDealbreakers(
        l2026({ bil: 'full-el', bilViktig: 'ma-stemme' }),
        l2026({ bil: 'phev', bilViktig: 'bor-stemme' })
      ).hasDealbreaker
    ).toBe(false);
  });

  it('alkohol: aldri vs ofte («må stemme») avvises; aldri vs sjelden later', () => {
    expect(
      sjekkAlleDealbreakers(
        l2026({ alkohol: 'aldri', alkoholViktig: 'ma-stemme' }),
        l2026({ alkohol: 'ofte', alkoholViktig: 'ma-stemme' })
      ).hasDealbreaker
    ).toBe(true);
    expect(
      sjekkAlleDealbreakers(
        l2026({ alkohol: 'aldri', alkoholViktig: 'ma-stemme' }),
        l2026({ alkohol: 'sjelden', alkoholViktig: 'ma-stemme' })
      ).hasDealbreaker
    ).toBe(false);
  });

  it('bosted (må stemme): sentrum vs land blokkerer; forstad er kompatibel med begge', () => {
    expect(
      sjekkAlleDealbreakers(
        l2026({ bosted: 'sentrum', bostedViktig: 'ma-stemme' }),
        l2026({ bosted: 'land' })
      ).hasDealbreaker
    ).toBe(true);
    expect(
      sjekkAlleDealbreakers(
        l2026({ bosted: 'sentrum', bostedViktig: 'ma-stemme' }),
        l2026({ bosted: 'forstad' })
      ).hasDealbreaker
    ).toBe(false);
    expect(
      sjekkAlleDealbreakers(
        l2026({ bosted: 'land', bostedViktig: 'ma-stemme' }),
        l2026({ bosted: 'forstad' })
      ).hasDealbreaker
    ).toBe(false);
  });

  it('arbeidsrytme (må stemme): skift vs kontorbundet blokkerer; hybrid passer med kontorbundet', () => {
    expect(
      sjekkAlleDealbreakers(
        l2026({ arbeidsrytme: 'skift', arbeidsrytmeViktig: 'ma-stemme' }),
        l2026({ arbeidsrytme: 'kontorbundet' })
      ).hasDealbreaker
    ).toBe(true);
    expect(
      sjekkAlleDealbreakers(
        l2026({ arbeidsrytme: 'hybrid', arbeidsrytmeViktig: 'ma-stemme' }),
        l2026({ arbeidsrytme: 'kontorbundet' })
      ).hasDealbreaker
    ).toBe(false);
  });

  it('skjerm (må stemme): mye vs vil-skru-ned blokkerer; mye vs moderat later', () => {
    expect(
      sjekkAlleDealbreakers(
        l2026({ skjerm: 'mye', skjermViktig: 'ma-stemme' }),
        l2026({ skjerm: 'vil-skru-ned' })
      ).hasDealbreaker
    ).toBe(true);
    expect(
      sjekkAlleDealbreakers(
        l2026({ skjerm: 'mye', skjermViktig: 'ma-stemme' }),
        l2026({ skjerm: 'moderat' })
      ).hasDealbreaker
    ).toBe(false);
  });

  it('reiser (må stemme): fjell-bobil vs lite-reising blokkerer', () => {
    expect(
      sjekkAlleDealbreakers(
        l2026({ reiser: 'fjell-bobil', reiserViktig: 'ma-stemme' }),
        l2026({ reiser: 'lite-reising' })
      ).hasDealbreaker
    ).toBe(true);
    // naturen nærmest er kompatibel med begge ender
    expect(
      sjekkAlleDealbreakers(
        l2026({ reiser: 'fjell-bobil', reiserViktig: 'ma-stemme' }),
        l2026({ reiser: 'naturen-naermest' })
      ).hasDealbreaker
    ).toBe(false);
  });

  it('aktivitet (må stemme): ingen felles verdi blokkerer; deltag later', () => {
    expect(
      sjekkAlleDealbreakers(
        l2026({ aktivitet: 'gym,lop-turer', aktivitetViktig: 'ma-stemme' }),
        l2026({ aktivitet: 'lite' })
      ).hasDealbreaker
    ).toBe(true);
    expect(
      sjekkAlleDealbreakers(
        l2026({ aktivitet: 'gym,lop-turer', aktivitetViktig: 'ma-stemme' }),
        l2026({ aktivitet: 'gym' })
      ).hasDealbreaker
    ).toBe(false);
  });

  it('legacy-profiler uten preferences blokkeres aldri av den nye sjekken', () => {
    expect(sjekkAlleDealbreakers(makeProfile(), makeProfile()).hasDealbreaker).toBe(false);
  });
});

describe('ekvivalens: cheapSjekkAll === sjekkAlleDealbreakers (LIVSSTIL-2026)', () => {
  const tilfeller: Array<[ProfileData, ProfileData]> = [
    [mann(170), kvinne(178)],
    [mann(174), kvinne(178)],
    [mann(null), kvinne(178)],
    [
      makeProfile({ userId: 'a', preferences: { livsstil2026: { kosthold: 'vegan', kostholdViktig: 'ma-stemme' } } }),
      makeProfile({ userId: 'b', preferences: { livsstil2026: { kosthold: 'spiser-koett' } } }),
    ],
    [
      makeProfile({ userId: 'a', preferences: { livsstil2026: { dyr: 'hund', dyrViktig: 'ma-stemme' } } }),
      makeProfile({ userId: 'b', preferences: { livsstil2026: { dyr: 'katt', dyrViktig: 'ma-stemme' } } }),
    ],
    [
      mann(170),
      makeProfile({ userId: 'b', lifeSituation: { gender: 'Kvinne' }, lifestyle: { height: 180 }, preferences: { livsstil2026: { alkohol: 'ofte', alkoholViktig: 'ma-stemme' } } }),
    ],
    [
      makeProfile({ userId: 'a', preferences: { livsstil2026: { bosted: 'sentrum', bostedViktig: 'ma-stemme' } } }),
      makeProfile({ userId: 'b', preferences: { livsstil2026: { bosted: 'land', bostedViktig: 'bor-stemme' } } }),
    ],
    [
      makeProfile({ userId: 'a', preferences: { livsstil2026: { aktivitet: 'gym,lop-turer', aktivitetViktig: 'ma-stemme' } } }),
      makeProfile({ userId: 'b', preferences: { livsstil2026: { aktivitet: 'lite' } } }),
    ],
  ];

  for (const [a, b] of tilfeller) {
    it(`par ${a.userId}/${b.userId}: cheap === full i kjøreretningen (A→B)`, () => {
      // scoreRound kjører cheapSjekkAll(fa, fj) og må reprodusere
      // sjekkAlleDealbreakers(A, B).reason ?? sjekkAlleDealbreakers(B, A).reason.
      // (Reason-strengen kan skilte i verdirekkefølge mellom (A,B) og (B,A)
      // retningene — det er verdirekkefølgen i parentesen, ikke avgjørelsen.)
      const fullA =
        sjekkAlleDealbreakers(a, b).reason ?? sjekkAlleDealbreakers(b, a).reason ?? null;
      const cheap = cheapSjekkAll(buildCheapFeatures(a), buildCheapFeatures(b));
      expect(cheap).toBe(fullA);
      // Begge retningene må bli like avgjort (dealbreaker eller ingen)
      const fullB =
        sjekkAlleDealbreakers(b, a).reason ?? sjekkAlleDealbreakers(a, b).reason ?? null;
      expect(Boolean(fullB)).toBe(Boolean(fullA));
    });
  }
});

describe('mapRejectReason — nye nøkler', () => {
  it('høyde → hoyde', () => {
    expect(mapRejectReason('Høyde: mannen er 5 cm kortere enn kvinnen (≥ 5 cm)')).toBe('hoyde');
  });
  it('livsstil 2026 → livsstil2026', () => {
    expect(mapRejectReason('Hverdagsvalg: kosthold (vegan vs spiser-koett) for x')).toBe('livsstil2026');
  });
});