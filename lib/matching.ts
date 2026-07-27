// lib/matching.ts — Re-eksporter alle matching-komponentar for bakoverkompatibilitet
// Denne filen gir enkel import av alle matching-funksjonar

/**
 * ToSom Matching Library — Standard API
 * 
 * HOVD FUNKSJON: findBestMatchFor()
 * Bruk denne for ALLE match-operasjonar (cron + user-initiated).
 */

// Kjerne-funksjonar
export { matchingEngine } from "./matching/engine";
export { findBestMatchFor } from "./matching/findBestMatchFor";

// Scoring
export {
  calculateBaseCompatibility,
  calculateEmotionalResonance,
  calculateSemanticOverlap,
  calculateIntimacyScore,
  calculateFutureVisionScore,
  calculateTotalScore,
} from "./matching/scorer";

// Dealbreaker
export { sjekkAlleDealbreakers } from "./matching/dealbreaker";

// Vekter
export { getWeights, validateWeights } from "./matching/weightConfig";

// Forklaring
export { generateExplanation } from "./matching/explainer";

// Typar
export {
  type SubScoreBreakdown,
  type MatchTier,
  type MatchResult,
  type WeightConfig,
  type ProfileData,
} from "./matching/types";