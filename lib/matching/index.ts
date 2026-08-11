// lib/matching/index.ts — Hoved-export for matching-motoren
// Alle komponenter blir re-eksportert her for enkel import
// Scoring: kun unifiedScorer (9 dimensjoner, skala [0-100]) — deprecated scorer.ts fjernet

// Kjerne-funksjoner
export { matchingEngine } from "./engine";
export { findBestMatchFor } from "./findBestMatchFor";

// Scoring-funksjoner — EINTILT SCORING
export { unifiedScore, calculateTotalScore } from "./unifiedScorer"; // Primær scoring (9 dimensjoner, skala [0-100])

// Dealbreaker-funksjoner
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