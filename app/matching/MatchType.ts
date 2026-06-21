/**
 * ToSom -- MatchType
 * Klasifiserer match basert på score og profildata.
 */

export type MatchTypeKey =
  | 'high_emotional'
  | 'stable_secure'
  | 'potential_growth'
  | 'challenging_exciting'
  | 'friendship_recommended';

export interface MatchTypeInfo {
  key: MatchTypeKey;
  label: string;
  color: string;
  description: string;
}

export const MATCH_TYPES: Record<MatchTypeKey, MatchTypeInfo> = {
  high_emotional: {
    key: 'high_emotional',
    label: 'Høy emosjonell kompatibilitet',
    color: '#D4AF37',
    description: 'Dere deler dype verdier og kommuniserer på same måte. Sterk resonans-potensiale.',
  },
  stable_secure: {
    key: 'stable_secure',
    label: 'Trygg og stabil match',
    color: '#5BA3CF',
    description: 'Kompatible tilknytningsstilar og liknande livsrytme. God grunnlag for trygghet.',
  },
  potential_growth: {
    key: 'potential_growth',
    label: 'God match med potensiale',
    color: '#7CCD7C',
    description: 'Sterke fellesmerker med rom for vekst. Kan bli veldig dyp med tid.',
  },
  challenging_exciting: {
    key: 'challenging_exciting',
    label: 'Utfordrende men spennende match',
    color: '#E8A84C',
    description: 'Ulike men komplementære. Krev tydelig kommunikasjon men kan vxe sterk.',
  },
  friendship_recommended: {
    key: 'friendship_recommended',
    label: 'Vennskap anbefalt',
    color: '#9B9B9B',
    description: 'Lite romantisk kompatibilitet no, men kan vere verdifullt vennskap.',
  },
};

/**
 * Hent match-type basert på score.
 * Kan utvidast med profil-spesifikk logikk seinare.
 */
export function getMatchType(score: number): MatchTypeInfo {
  if (score >= 85) return MATCH_TYPES.high_emotional;
  if (score >= 75) return MATCH_TYPES.stable_secure;
  if (score >= 65) return MATCH_TYPES.potential_growth;
  if (score >= 50) return MATCH_TYPES.challenging_exciting;
  return MATCH_TYPES.friendship_recommended;
}

/**
 * Hent match-type farge for UI.
 */
export function getMatchTypeColor(score: number): string {
  return getMatchType(score).color;
}

/**
 * Hent match-type label for UI.
 */
export function getMatchTypeLabel(score: number): string {
  return getMatchType(score).label;
}