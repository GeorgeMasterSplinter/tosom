/**
 * ToSom — Dag 11: Tetthetsbasert avstandsprioritering
 *
 * Datadrevet bestemmelse av avstandsområde basert på postnummer:
 * - Tettsted (≥ 8 postnummer per sted i postalCodes.json) → 30–500 km
 * - Land ellers → 50–750 km
 *
 * Ingen hardkodet by-liste. Steder med ≥ 8 postnummer regnes automatisk
 * som urbane/tetteste.
 */

import postalCodes from '../lib/geo/postalCodes.json';

/* ========================
   RANGES
   ======================== */

export const DISTANCE_PREF_RANGES = {
  urban: { min: 30, max: 500 },
  rural: { min: 50, max: 750 },
} as const;

export type DistancePrefRange = (typeof DISTANCE_PREF_RANGES)[keyof typeof DISTANCE_PREF_RANGES];

/* ========================
   DETAILED: URBAN SETTING (≥ 8 postnummer per sted)
   ======================== */

type PostalEntry = { sted: string; lat: number | null; lon: number | null };
const codes = postalCodes as Record<string, PostalEntry>;

/** Bygger en Map<sted → antall postnummer> én gang ved modul-load */
const stedCounts: Map<string, number> = (() => {
  const m = new Map<string, number>();
  for (const entry of Object.values(codes)) {
    m.set(entry.sted, (m.get(entry.sted) ?? 0) + 1);
  }
  return m;
})();

/** Steder med ≥ 8 postnummer er urbane */
export const URBAN_MIN_CODES = 8;

export const urbanPlaces: ReadonlySet<string> = (() => {
  const s = new Set<string>();
  for (const [sted, count] of stedCounts) {
    if (count >= URBAN_MIN_CODES) s.add(sted);
  }
  return s;
})();

/* ========================
   PUBLIC API
   ======================== */

/**
 * Bestemmer om et sted er urban (tettsted) eller land.
 */
export function isUrbanPlace(sted: string): boolean {
  return urbanPlaces.has(sted);
}

/**
 * Returnerer avstandsområde for et gitt postnummer.
 *
 * - Gyldig postnummer med sted i urban-settet → { min: 30, max: 500 }
 * - Gyldig postnummer, land → { min: 50, max: 750 }
 * - Ukjend/ugyldig postnummer → rural-default { min: 50, max: 750 }
 */
export function getDistancePrefRange(postalCode: string): DistancePrefRange {
  const trimmed = postalCode?.trim();
  if (!trimmed || !/^\d{4}$/.test(trimmed)) {
    return DISTANCE_PREF_RANGES.rural;
  }

  const entry = codes[trimmed];
  if (!entry) {
    return DISTANCE_PREF_RANGES.rural;
  }

  return isUrbanPlace(entry.sted)
    ? DISTANCE_PREF_RANGES.urban
    : DISTANCE_PREF_RANGES.rural;
}

/**
 * Validerer om en distancePref-verdi ligger innenfor det tillatte området
 * for et gitt postnummer.
 */
export function isValidDistancePref(postalCode: string, value: number): boolean {
  const range = getDistancePrefRange(postalCode);
  return value >= range.min && value <= range.max;
}
