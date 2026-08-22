// lib/matching.ts — ToSom Matching Library
// EINTILT SCORING: Bruk unifiedScorer som primær scoring (9 dimensjoner, skala [0-100]).
// Den gamle scorer.ts er fjernet; alle deprecated funksjonar er borte.

// Scoring — ENHETLIG (9-dimensjonal, skala [0-100])
// Einteilingsmotoren er cron-ruten (app/api/cron/matching). Den gamle
// matchingEngine (0–1 tier-skala) var død — fjerna i M-7.
export { unifiedScore, calculateTotalScore } from "./matching/unifiedScorer";

// Dealbreaker
export { sjekkAlleDealbreakers } from "./matching/dealbreaker";

// Vekter (F-8)
export { DIMENSION_WEIGHTS } from "./matching/unifiedScorer";

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