// lib/matching/engine.ts — HOVEDFUNKSJON for matching-motoren
// matchingEngine() er det ene punktet som kalles fra /api/match

import { ProfileData } from "./types";
import { MatchResult, MatchTier } from "./types";
import { sjekkAlleDealbreakers } from "./dealbreaker";
import { calculateTotalScore } from "./unifiedScorer"; // EINTILT SCORING (Punkt 4) — deprecated scorer.ts
import { generateExplanation } from "./explainer";

/**
 * scoreToTier mapper en total-score til en MatchTier.
 *
 * Tier-inndeling:
 *   0.85–1.0 → deepResonance     (Dyp resonans)
 *   0.70–0.84 → strongResonance  (Sterk resonans)
 *   0.55–0.69 → moderateResonance (Moderat resonans)
 *   0.40–0.54 → gentleResonance  (Mild resonans)
 *   0.00–0.39 → weakResonance    (Svake tegn)
 */
function scoreToTier(score: number): MatchTier {
  if (score >= 0.85) return "deepResonance";
  if (score >= 0.70) return "strongResonance";
  if (score >= 0.55) return "moderateResonance";
  if (score >= 0.40) return "gentleResonance";
  return "weakResonance";
}

/**
 * applyCoreValueBonus legger til små bonuser for felles core-verdier.
 * Bare aktivert hvis alle dealbreaker-tester passer.
 */
function applyCoreValueBonus(base: number): number {
  let bonus = 0;
  const maxBonus = 0.08; // Total maksimal bonus er 8%

  // Bonus for felles verdier (kan utvides med virkelige verdifelt)
  // TODO: Når verdier er i schema, sjekk for overlap her

  // Bonus for samkjørt livsrytme
  // (Denne behandles i calculateFutureVisionScore isteden)

  return Math.min(bonus, maxBonus);
}

/**
 * matchingEngine — HOVEDFUNKSJON for matching-motoren.
 *
 * Kjerne-logikk:
 * 1. Sjekk dealbreakers (harde filtre)
 *    - Hvis dealbreaker → returner MatchResult med score 0, rejected = true
 * 2. Beregn alle sub-scorer (0–1) via scorer.ts
 * 3. Vekt dem med vektene fra weightConfig.ts
 * 4. Legg til eventuelle bonuser hvis alle dealbreaker-pass
 * 5. Bestem tier basert på total score
 * 6. Generer explanation via explainer.ts
 * 7. Returner MatchResult
 *
 * Vekter (fra weightConfig.ts):
 *   base:       0.35  (Grunnleggende kompatibilitet)
 *   resonance:  0.25  (Emosjonell resonans)
 *   semantic:   0.20  (Semantisk overlap)
 *   intimacy:   0.10  (Intimitet & sårbarhet)
 *   future:     0.10  (Fremtidskompatibilitet)
 *
 * Dealbreakers (harde filtre):
 *   - Modenhets-gap > 4
 *   - Inkompatibel livsrytme (morning vs evening, fast vs slow)
 *   - Eksplisitte dealbreaker-tags i preferences
 *   - Grense-brudd i boundaries
 */
export function matchingEngine(
  queryUser: ProfileData,
  candidate: ProfileData
): MatchResult {
  // STEG 1: Sjekk dealbreakers
  const dealbreakerResult = sjekkAlleDealbreakers(queryUser, candidate);
  if (dealbreakerResult.hasDealbreaker) {
    return {
      score: 0,
      breakdown: {
        base: 0,
        resonance: 0,
        semantic: 0,
        intimacy: 0,
        future: 0,
      },
      tier: "weakResonance",
      rejected: true,
      rejectionReason: dealbreakerResult.reason,
      explanation: "", // Kan bli generert av ekstern kode
    };
  }

  // STEG 2–4: Beregn score
  const { breakdown, totalScore, weights } = calculateTotalScore(
    queryUser,
    candidate
  );

  // STEG 4b: Legg til core-value-bonus (hvis alle dealbreaker-pass)
  const finalScore = Math.min(1, totalScore + applyCoreValueBonus(totalScore));

  // STEG 5: Bestem tier
  const tier = scoreToTier(finalScore);

  // STEG 6: Generer explanation
  const explanation = generateExplanation({
    score: finalScore,
    breakdown,
    tier,
    rejected: false,
  });

  // STEG 7: Returner MatchResult
  return {
    score: finalScore,
    breakdown,
    tier,
    rejected: false,
    explanation,
  };
}