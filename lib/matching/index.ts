// lib/matching/index.ts — Hovud-export for matching-motoren
// Alle komponentar blir re-eksporterte her for enkel import

// Kjerne-funksjonar
export { matchingEngine } from "./engine";
export { findBestMatchFor } from "./findBestMatchFor";

// Scoring-funksjonar
export {
  calculateBaseCompatibility,
  calculateEmotionalResonance,
  calculateSemanticOverlap,
  calculateIntimacyScore,
  calculateFutureVisionScore,
  calculateTotalScore,
} from "./scorer";

// Dealbreaker-funksjonar
export { sjekkAlleDealbreakers } from "./dealbreaker";
export type { DealbreakerResult } from "./dealbreaker";

// Normaliserings-funksjonar
export { normalize, clamp01, weightedSum } from "./normalizer";

// Forklaringar
export { generateExplanation, generateShortExplanation } from "./explainer";

// Vekter
export { getWeights, getWeightsWithOverride, validateWeights } from "./weightConfig";

// Typar
export {
  type SubScoreBreakdown,
  type MatchTier,
  type MatchResult,
  type WeightConfig,
  type ProfileData,
  type MatchEventType,
} from "./types";