// lib/matching/normalizer.ts — Normaliseringsfunksjonar for matching
// Alle sub-scorer normaliserast til [0, 1] før dei vektast

/**
 * normalize tar ein raw-verdi med eit kjent [min, max]-intervall
 * og returnerer ein normalisert verdi i [0, 1].
 *
 * Eksempel: normalize(75, 0, 100) => 0.75
 */
export function normalize(raw: number, min: number, max: number): number {
  if (max === min) return 0; // Unngå divide-by-zero
  const clamped = Math.max(min, Math.min(max, raw)); // Clamp til intervall
  return Math.max(0, Math.min(1, (clamped - min) / (max - min)));
}

/**
 * Clamp ein verdi til [0, 1].
 */
export function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

/**
 * WeightedSum berekner ein vektet sum av fleire komponentar.
 * Vektane skal summere til 1.0.
 */
export function weightedSum(
  scores: number[],
  weights: number[]
): number {
  if (scores.length !== weights.length) {
    throw new Error(
      `scores og weights må ha same lengd. Fikk ${scores.length} og ${weights.length}`
    );
  }
  
  const sum = scores.reduce((acc, score, i) => acc + score * weights[i], 0);
  return clamp01(sum);
}