// weightConfig.ts — dynamisk vektkonfigurasjon med validering og fallback

/**
 * Default vekter (må summere til 1.0)
 */
const DEFAULT_WEIGHTS = {
  base: 0.4,
  resonance: 0.25,
  semantic: 0.25,
  intimacy: 0.05,
  future: 0.05,
} as const;

type WeightKey = keyof typeof DEFAULT_WEIGHTS;
type Weights = Record<WeightKey, number>;

/**
 * Last vekter fra config/matching.ts, med fallback til defaults.
 * Validerer at summen er 1.0 (±0.001 for flyttaleuskjson).
 */
export function getWeights(): Weights {
  try {
    // Try dynamic import of config/matching.ts
    // Use require-style to avoid ESM issues in Node
    const config = require("@/config/matching");
    if (config.MATCH_WEIGHTS) {
      const raw = config.MATCH_WEIGHTS as Record<string, number>;

      // Map known keys
      const weights: Weights = {
        base: raw.base ?? DEFAULT_WEIGHTS.base,
        resonance: raw.resonance ?? DEFAULT_WEIGHTS.resonance,
        semantic: raw.semantic ?? DEFAULT_WEIGHTS.semantic,
        intimacy: raw.intimacy ?? DEFAULT_WEIGHTS.intimacy,
        future: raw.future ?? DEFAULT_WEIGHTS.future,
      };

      // Validate sum
      const sum = Object.values(weights).reduce((a, b) => a + b, 0);
      if (Math.abs(sum - 1.0) > 0.001) {
        console.warn(
          `[weightConfig] Vekt-sum er ${sum} (ikkje 1.0). Brukar default-viktane.`,
        );
        return { ...DEFAULT_WEIGHTS };
      }

      return weights;
    }
  } catch (e) {
    console.warn("[weightConfig] Kunne ikkje laste config/matching.ts:", e);
  }

  // Fallback til default
  return { ...DEFAULT_WEIGHTS };
}

/**
 * Returner ein nyweights-objekt med optional override for ein enkelt vekt.
 */
export function getWeightsWithOverride(
  overrides: Partial<Record<WeightKey, number>>,
): Weights {
  const base = getWeights();
  return { ...base, ...overrides };
}

/**
 * Valider at ein gitt weights-objekt er gyldig.
 */
export function validateWeights(weights: Partial<Record<WeightKey, number>>): {
  valid: boolean;
  error?: string;
} {
  const requiredKeys: WeightKey[] = ["base", "resonance", "semantic", "intimacy", "future"];

  for (const key of requiredKeys) {
    if (typeof weights[key] !== "number" || weights[key] < 0) {
      return { valid: false, error: `Ugyldig vekt for '${key}'` };
    }
  }

  const sum = requiredKeys.reduce((a, b) => a + (weights[b] ?? 0), 0);
  if (Math.abs(sum - 1.0) > 0.001) {
    return { valid: false, error: `Vekt-sum er ${sum}, må vere 1.0` };
  }

  return { valid: true };
}
