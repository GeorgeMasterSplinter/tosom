// lib/matching.ts — re-exporter alle nye moduler for bakoverkompatibilitet
// og beheld gammel calculateMatchScore for eksisterande kode som brukar det.

// Gammel scoring (berre for bakoverkompatibilitet)
export { calculateMatchScore } from "./matching/calculateMatchScore";

// Nye moduler
export { calculateScore, ScoreResult, ScoreInput } from "./matching/scorer";
export { generateExplanation } from "./matching/explainer";
export { rankMatches, deduplicateMatches, RankedMatch } from "./matching/ranking";
export { recordMatchFeedback, getFeedbackProfile } from "./matching/feedback";
export { getWeights, getWeightsWithOverride, validateWeights } from "./matching/weightConfig";

// Caching-stubs
export { getCachedScore, setCachedScore } from "./matching/scorer";
