// lib/matching.ts — ToSom Matching Library
// EINTILT SCORING: Bruk unifiedScorer som primær scoring (9 dimensjoner, skala [0-100]).
// Den gamle scorer.ts er fjernet; alle deprecated funksjonar er borte.

/**
 * HOVEDFUNKSJON: findBestMatchFor()
 * Bruk denne for ALLE match-operasjoner (cron + user-initiated).
 */

// Kjerne-funksjoner
export { matchingEngine } from "./matching/engine";
export { findBestMatchFor } from "./matching/findBestMatchFor";

// Scoring — ENHETLIG (9-dimensjonal, skala [0-100])
export { unifiedScore, calculateTotalScore } from "./matching/unifiedScorer";

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
