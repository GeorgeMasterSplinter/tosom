/**
 * ToSom — B1.1: Postnummer-opplesing
 *
 * Oppslag fra statisk datasett (lib/geo/postalCodes.json) med ~5000 norske
 * postnummer og sentrumskoordinater (Postens åpne postnummerregister,
 * opphav: Posten Norge/Kartverket).
 *
 * Ingen eksternt API. Virker offline, ingen kostnad, ingen personvernsspørsmål,
 * ingen nettverksfeil i matcherunden.
 */

import postalCodes from './postalCodes.json';

export interface PostalCodeResult {
  /** Stedsnavn (f.eks. "OSLO") */
  sted: string;
  /** Breddedegrad (lat) — null hvis koden mangler sentrumspunkt */
  lat: number | null;
  /** Lengdgrad (lon) — null hvis koden mangler sentrumspunkt */
  lon: number | null;
}

type PostalCodeMap = Record<string, PostalCodeResult>;

const codes = postalCodes as PostalCodeMap;

/**
 * Slå opp et norsk postnummer (4 siffer).
 *
 * - Gyldig 4-sifret format. Ukjend kode → null.
 * - Ikke-numerisk eller feil lengd → null (ingen kasting).
 * - Postboks/postkontor-koder uten sentrumspunkt → { sted, lat: null, lon: null }
 *
 * @example
 * lookupPostalCode('0150') → { sted: 'OSLO', lat: 59.89038, lon: 10.71793 }
 * lookupPostalCode('9999') → null
 * lookupPostalCode('abc')  → null
 */
export function lookupPostalCode(code: string): PostalCodeResult | null {
  // Valider: akkurat 4 siffer
  if (!/^\d{4}$/.test(code)) {
    return null;
  }

  const entry = codes[code];
  if (!entry) {
    return null;
  }

  return {
    sted: entry.sted,
    lat: entry.lat,
    lon: entry.lon,
  };
}

/**
 * Returner totalt antall postnummer i datasettet (debug/test).
 */
export function postalCodeCount(): number {
  return Object.keys(codes).length;
}

/**
 * Returner antall postnummer med koordinater (debug/test).
 */
export function postalCodeCountWithCoords(): number {
  let n = 0;
  for (const k of Object.keys(codes)) {
    if (codes[k].lat != null) n++;
  }
  return n;
}