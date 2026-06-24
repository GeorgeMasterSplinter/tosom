// lib/matching/weightConfig.ts — ÉIN sann kilde for matching-vektar
// Alle vekter summere til 1.0 — normalisert til [0, 1] for kvar kategori

import { WeightConfig } from "./types";
export type { WeightConfig };

/**
 * Default vekter — forenkla til 5 kategoriar i tråd med core-definition.
 * 
 * Vekter:
 *   base:       0.35  — Grunnleggjande kompatibilitet (verdier, livssituasjon, personlighet)
 *   resonance:  0.25  — Emosjonell resonans (kommunikasjon, relasjonsstil)
 *   semantic:   0.20  — Semantisk overlap (fremtidsønsker, livsstil)
 *   intimacy:   0.10  — Intimitet & sårbarhet (intimacy, boundaries, emotionalNeeds)
 *   future:     0.10  — Fremtidskompatibilitet (livsrytme, modenheit)
 */
const DEFAULT_WEIGHTS: WeightConfig = {
  base: 0.35,
  resonance: 0.25,
  semantic: 0.20,
  intimacy: 0.10,
  future: 0.10,
};

/**
 * getWeights returnerer den eine sanne kjelda for vekter.
 * Alle scoring-funksjonar skal bruke denne.
 */
export function getWeights(): WeightConfig {
  return DEFAULT_WEIGHTS;
}

/**
 * getWeightsWithOverride returnerer ein ny weights-objekt med optional override.
 * Bruk for testing eller dynamisk justering.
 */
export function getWeightsWithOverride(
  overrides: Partial<WeightConfig>
): WeightConfig {
  const base = getWeights();
  const merged = { ...base, ...overrides };
  
  // Valider at summen er 1.0 (±0.001 for flyttaleuskjson)
  const sum = Object.values(merged).reduce((a, b) => a + b, 0);
  if (Math.abs(sum - 1.0) > 0.001) {
    console.warn(
      `[weightConfig] Vekt-sum er ${sum} (ikkje 1.0). Brukar default-vektane.`
    );
    return getWeights();
  }
  
  return merged as WeightConfig;
}

/**
 * validateWeights validerer at eit weights-objekt er gyldig.
 */
export function validateWeights(weights: Partial<WeightConfig>): {
  valid: boolean;
  error?: string;
} {
  const requiredKeys: (keyof WeightConfig)[] = [
    "base",
    "resonance",
    "semantic",
    "intimacy",
    "future",
  ];
  
  for (const key of requiredKeys) {
    if (typeof weights[key] !== "number" || weights[key] < 0) {
      return { valid: false, error: `Ugyldig vekt for '${key}'` };
    }
  }
  
  const sum = requiredKeys.reduce(
    (a, b) => a + (weights[b] ?? 0),
    0
  );
  if (Math.abs(sum - 1.0) > 0.001) {
    return { valid: false, error: `Vekt-sum er ${sum}, må vere 1.0` };
  }
  
  return { valid: true };
}