/**
 * ToSom — Dag 11: Enhetstest for tetthetsbasert avstandsvalg
 *
 * Tettsted (≥ 8 postnummer per sted) → 30–500 km
 * Land ellers → 50–750 km
 * Ukjend/ugyldig postnummer → rural-default 50–750
 */
import postalCodes from '@/lib/geo/postalCodes.json';
import {
  getDistancePrefRange,
  isUrbanPlace,
  isValidDistancePref,
  DISTANCE_PREF_RANGES,
  URBAN_MIN_CODES,
} from '@/config/distance-prefs';

/* Bygger sted → antall postnummer én gang, for å hente en gyldig land-kode */
const stedCounts = (() => {
  const m = new Map<string, number>();
  for (const entry of Object.values(postalCodes as Record<string, { sted: string }>)) {
    m.set(entry.sted, (m.get(entry.sted) ?? 0) + 1);
  }
  return m;
})();

/* En postnummer hvis sted har < URBAN_MIN_CODES → land */
function findRuralCode(): string {
  for (const [code, entry] of Object.entries(postalCodes as Record<string, { sted: string }>)) {
    const count = stedCounts.get(entry.sted) ?? 0;
    if (count < URBAN_MIN_CODES) return code;
  }
  throw new Error('Fant ingen land-postnummer i datasettet');
}

const RURAL_CODE = findRuralCode();

describe('getDistancePrefRange (Dag 11)', () => {
  it('Oslo (0150) → urbane 30–500', () => {
    expect(getDistancePrefRange('0150')).toEqual(DISTANCE_PREF_RANGES.urban);
    expect(getDistancePrefRange('0150')).toEqual({ min: 30, max: 500 });
  });

  it('Bergen (5003) → urbane 30–500', () => {
    expect(getDistancePrefRange('5003')).toEqual(DISTANCE_PREF_RANGES.urban);
  });

  it(`land-postnummer (${RURAL_CODE}) → land 50–750`, () => {
    expect(getDistancePrefRange(RURAL_CODE)).toEqual(DISTANCE_PREF_RANGES.rural);
    expect(getDistancePrefRange(RURAL_CODE)).toEqual({ min: 50, max: 750 });
  });

  it('ukjend postnummer (9999) → rural-default 50–750', () => {
    expect(getDistancePrefRange('9999')).toEqual(DISTANCE_PREF_RANGES.rural);
  });

  it('ugyldig format (abcd, 12, tomt) → rural-default 50–750', () => {
    expect(getDistancePrefRange('abcd')).toEqual(DISTANCE_PREF_RANGES.rural);
    expect(getDistancePrefRange('12')).toEqual(DISTANCE_PREF_RANGES.rural);
    expect(getDistancePrefRange('')).toEqual(DISTANCE_PREF_RANGES.rural);
  });

  it('håndterer mellomrom i postnummer', () => {
    expect(getDistancePrefRange(' 0150 ')).toEqual(DISTANCE_PREF_RANGES.urban);
  });
});

describe('isUrbanPlace (Dag 11)', () => {
  it('OSLO og BERGEN er urbane', () => {
    expect(isUrbanPlace('OSLO')).toBe(true);
    expect(isUrbanPlace('BERGEN')).toBe(true);
  });

  it('et land-sted er ikke urban', () => {
    const sted = (postalCodes as Record<string, { sted: string }>)[RURAL_CODE].sted;
    expect(isUrbanPlace(sted)).toBe(false);
  });
});

describe('isValidDistancePref (Dag 11)', () => {
  it('urbo: 20→false, 30→true, 500→true, 501→false', () => {
    expect(isValidDistancePref('0150', 20)).toBe(false);
    expect(isValidDistancePref('0150', 30)).toBe(true);
    expect(isValidDistancePref('0150', 500)).toBe(true);
    expect(isValidDistancePref('0150', 501)).toBe(false);
  });

  it('land: 49→false, 50→true, 750→true, 751→false', () => {
    expect(isValidDistancePref(RURAL_CODE, 49)).toBe(false);
    expect(isValidDistancePref(RURAL_CODE, 50)).toBe(true);
    expect(isValidDistancePref(RURAL_CODE, 750)).toBe(true);
    expect(isValidDistancePref(RURAL_CODE, 751)).toBe(false);
  });

  it('fallback (9999): bruker land-område', () => {
    expect(isValidDistancePref('9999', 49)).toBe(false);
    expect(isValidDistancePref('9999', 750)).toBe(true);
  });
});
