// lib/matching/normalizer.ts — Normaliseringsfunksjoner for matching
// Alle sub-scorer normaliseres til [0, 1] før de vektset

/**
 * normalize tar en raw-verdi med et kjent [min, max]-intervall
 * og returnerer en normalisert verdi i [0, 1].
 *
 * Eksempel: normalize(75, 0, 100) => 0.75
 */
export function normalize(raw: number, min: number, max: number): number {
  if (max === min) return 0; // Unngå divide-by-zero
  const clamped = Math.max(min, Math.min(max, raw)); // Clamp til intervall
  return Math.max(0, Math.min(1, (clamped - min) / (max - min)));
}

/**
 * Clamp en verdi til [0, 1].
 */
export function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

/**
 * WeightedSum beregner en vektet sum av flere komponenter.
 * Vektene skal summere til 1.0.
 */
export function weightedSum(
  scores: number[],
  weights: number[]
): number {
  if (scores.length !== weights.length) {
    throw new Error(
      `scores og weights må ha samme lengde. Fikk ${scores.length} og ${weights.length}`
    );
  }

  const sum = scores.reduce((acc, score, i) => acc + score * weights[i], 0);
  return clamp01(sum);
}