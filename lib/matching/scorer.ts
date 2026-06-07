// scorer.ts — hovudmotoren som berekner total match-score med 5 vekter

import { baseCompatibilityScore } from "@/lib/baseScore";
import { emotionalResonance } from "@/lib/resonance";
import { deepSemanticScore } from "@/lib/semantic";
import { getWeights } from "./weightConfig";

//
// Typer
//

export interface ScoreInput {
  a: Record<string, unknown>;
  b: Record<string, unknown>;
}

export interface ScoreResult {
  totalScore: number;
  breakdown: {
    base: number;
    resonance: number;
    semantic: number;
    intimacy: number;
    future: number;
  };
  matchQuality: "excellent" | "strong" | "moderate" | "weak";
}

//
// Stub-funksjonar for intimacy og future
// (wordar dei ikkje finst i prosjektet ennå)
//

/**
 * intimacyScore — berekner emosjonell/intim tilgang.
 * Evaluerer bio-djupde, antall interesser, og profil-fullføring.
 */
function intimacyScore(
  a: Record<string, unknown>,
  b: Record<string, unknown>,
): number {
  let score = 0;

  // Bio-djupde — lengre bio tyder meir refleksjon
  const bioA = (a.bio as string)?.length ?? 0;
  const bioB = (b.bio as string)?.length ?? 0;
  score += Math.min(bioA / 20, 15);
  score += Math.min(bioB / 20, 15);

  // Profil-interessar — fleire interesser = meir djupde
  const interestsA = Array.isArray(a.interests) ? a.interests.length : 0;
  const interestsB = Array.isArray(b.interests) ? b.interests.length : 0;
  score += Math.min(interestsA / 3, 10);
  score += Math.min(interestsB / 3, 10);

  // Profil-bilete — visuell djupde
  const photosA = Array.isArray(a.photos) ? a.photos.length : 0;
  const photosB = Array.isArray(b.photos) ? b.photos.length : 0;
  score += Math.min(photosA / 2, 10);
  score += Math.min(photosB / 2, 10);

  return Math.min(score, 100);
}

/**
 * futureScore — berekner framtids-orientert kompatibilitet.
 * Evaluerer alder-nærleik, livsfase-signalar (bio-keyword), og interseksjon.
 */
function futureScore(
  a: Record<string, unknown>,
  b: Record<string, unknown>,
): number {
  let score = 0;

  // Aldersnærleik — viktig for framtids-sjansar
  if (a.age && b.age) {
    const diff = Math.abs(Number(a.age) - Number(b.age));
    if (diff <= 3) score += 40;
    else if (diff <= 7) score += 30;
    else if (diff <= 12) score += 20;
    else if (diff <= 20) score += 10;
  }

  // Livsfase-keyword overlap i bio
  const lifeKeywords = [
    "karriere",
    "familie",
    "barn",
    "studiar",
    "reiser",
    "busette",
    "utvikle",
    "framtid",
    " mål",
    "vaks",
  ];

  const bioA = ((a.bio as string)?.toLowerCase() ?? "");
  const bioB = ((b.bio as string)?.toLowerCase() ?? "");

  const aHas = lifeKeywords.filter((k) => bioA.includes(k));
  const bHas = lifeKeywords.filter((k) => bioB.includes(k));

  if (aHas.length > 0 && bHas.length > 0) {
    const overlap = aHas.filter((k) => bHas.includes(k));
    score += (overlap.length / Math.max(aHas.length, bHas.length)) * 30;
  }

  // Felles interesser som framtids-signalar
  if (Array.isArray(a.interests) && Array.isArray(b.interests)) {
    const futureKeywords = ["karriere", "forretnin", "invest", "utvikle",
      "prosjekt", "bygg", "skap", "grünn"];
    const sharedFuture = a.interests.filter((i: string) =>
      b.interests.includes(i) &&
      futureKeywords.some((k) => i.toLowerCase().includes(k))
    );
    score += Math.min(sharedFuture.length * 10, 20);
  }

  return Math.min(score, 100);
}

//
// Hovud-score-funksjon
//

/**
 * Berekn total match-score med 5 vekter.
 */
export function calculateScore(
  a: Record<string, unknown>,
  b: Record<string, unknown>,
): ScoreResult {
  const weights = getWeights();

  // Kjør kvar score-modul
  const base = baseCompatibilityScore(a, b);
  const resonance = emotionalResonance(a, b);
  const semantic = deepSemanticScore(a, b);
  const intimacy = intimacyScore(a, b);
  const future = futureScore(a, b);

  // Vekta total
  const total =
    base * weights.base +
    resonance * weights.resonance +
    semantic * weights.semantic +
    intimacy * weights.intimacy +
    future * weights.future;

  const totalScore = Math.round(total);

  // Match-tier
  let matchQuality: "excellent" | "strong" | "moderate" | "weak";
  if (totalScore > 85) matchQuality = "excellent";
  else if (totalScore > 70) matchQuality = "strong";
  else if (totalScore > 55) matchQuality = "moderate";
  else matchQuality = "weak";

  return {
    totalScore,
    breakdown: { base, resonance, semantic, intimacy, future },
    matchQuality,
  };
}

//
// Caching-stub (ikkje implementert ennå)
//

let _cache: Map<string, ScoreResult> = new Map();

function getCacheKey(a: Record<string, unknown>, b: Record<string, unknown>): string {
  const idA = String(a.userId ?? a.id ?? "");
  const idB = String(b.userId ?? b.id ?? "");
  return [idA, idB].sort().join(":");
}

export function getCachedScore(
  a: Record<string, unknown>,
  b: Record<string, unknown>,
): ScoreResult | null {
  const key = getCacheKey(a, b);
  return _cache.get(key) ?? null;
}

export function setCachedScore(
  a: Record<string, unknown>,
  b: Record<string, unknown>,
  result: ScoreResult,
): void {
  const key = getCacheKey(a, b);
  _cache.set(key, result);
}
