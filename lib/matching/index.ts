// lib/matching/index.ts — Hovud-export for matching-motoren
// Alle komponentar blir re-eksporterte her for enkel import

// Kjerne-funksjonar
export { matchingEngine } from "./engine";
export { findBestMatchFor } from "./findBestMatchFor";

// Scoring-funksjoner — EINTILT SCORING (Punkt 4)
export { unifiedScore, calculateTotalScore } from "./unifiedScorer"; // Primær scoring (9 dimensjoner, skala [0-100])

/** @deprecated Bruk unifiedScore() fra unifiedScorer.ts i stedet */
export { calculateBaseCompatibility } from "./scorer";
/** @deprecated Bruk unifiedScore() fra unifiedScorer.ts i stedet */
export { calculateEmotionalResonance } from "./scorer";
/** @deprecated Bruk unifiedScore() fra unifiedScorer.ts i stedet */
export { calculateSemanticOverlap } from "./scorer";
/** @deprecated Bruk unifiedScore() fra unifiedScorer.ts i stedet */
export { calculateIntimacyScore } from "./scorer";
/** @deprecated Bruk unifiedScore() fra unifiedScorer.ts i stedet */
export { calculateFutureVisionScore } from "./scorer";

/** @deprecated Bruk unifiedScore() fra unifiedScorer.ts i stedet. calculateTotalScore er nå re-eksportert fra unifiedScorer med backward compat wrapper. */

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