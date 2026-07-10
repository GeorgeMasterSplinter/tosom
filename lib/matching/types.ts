// lib/matching/types.ts — Type-definisjoner for matching-motoren
// Alle typer er sentraliserte her for konsistens

/**
 * SubScoreBreakdown definerer de 5 dimensjonene i matching.
 * Alle verdier er normalisert til [0, 1].
 */
export interface SubScoreBreakdown {
  base: number;           // Grunnleggjande kompatibilitet (verdier, livssituasjon, personlighet)
  resonance: number;      // Emosjonell resonans (kommunikasjon, relasjonsstil)
  semantic: number;       // Semantisk overlap (fremtidsønsker, livsstil)
  intimacy: number;       // Intimitet & sårbarhet (intimacy, boundaries, emotionalNeeds)
  future: number;         // Fremtidskompatibilitet (livsrytme, modenheit)
}

/**
 * MatchTier klassifiserer kvaliteten på en match.
 */
export type MatchTier =
  | "deepResonance"
  | "strongResonance"
  | "moderateResonance"
  | "gentleResonance"
  | "weakResonance";

/**
 * MatchResult er det endelige resultatet fra matchingEngine.
 */
export interface MatchResult {
  score: number;           // Total score normalisert til [0, 1]
  breakdown: SubScoreBreakdown;
  tier: MatchTier;
  rejected: boolean;       // true hvis en dealbreaker ble funnet
  rejectionReason?: string; // Kort årsak dersom rejected
  explanation?: string;    // Lesbar forklaring for brukaren
}

/**
 * WeightConfig definerer vektinga av kvar kategori.
 */
export interface WeightConfig {
  base: number;
  resonance: number;
  semantic: number;
  intimacy: number;
  future: number;
}

/**
 * ProfileData er den forma profil-data er tilgjengeleg i matching.
 * Mappt fra Prisma Profile-modellen.
 */
export interface ProfileData {
  userId: string;
  firstName: string | null;
  lastName: string | null;
  age: number | null;
  bio: string | null;
  interests: string[];
  
  // Djup profil (core-definition)
  lifeSituation: Record<string, unknown> | null;
  lifestyle: Record<string, unknown> | null;
  personality: Record<string, unknown> | null;
  relationshipStyle: string | null;
  communication: Record<string, unknown> | null;
  intimacy: Record<string, unknown> | null;
  futureVision: Record<string, unknown> | null;
  boundaries: Record<string, unknown> | null;
  emotionalNeeds: Record<string, unknown> | null;
  lifeRhythm: string | null;        // "morning" | "evening" | "fast" | "slow"
  maturityLevel: number | null;      // 1-10
  securityLevel: string | null;      // "unsicher" | "ambivalent" | "secure"
  
  // Preferanser og tags
  preferences: Record<string, unknown> | null;
  matchTags: string[];
}

/**
 * MatchEvent er for tracking av match-hendingar (valfritt).
 */
export type MatchEventType = "MATCHED" | "REJECTED" | "EXPIRED" | "LOCKED";