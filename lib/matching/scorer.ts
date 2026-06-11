// scorer.ts — hovudmotoren som berekner total match-score med 5 vekter

import { baseCompatibilityScore } from "@/lib/baseScore";
import { emotionalResonance } from "@/lib/resonance";
import { deepSemanticScore } from "@/lib/semantic";
import { getWeights } from "./weightConfig";
import { explainMatch } from "./explainMatch";

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

interface WeightsType {
  base: number;
  resonance: number;
  semantic: number;
  intimacy: number;
  future: number;
}

function intimacyScore(a: Record<string, unknown>, b: Record<string, unknown>): number {
  let score = 0;
  const bioA = (a.bio as string)?.length ?? 0;
  const bioB = (b.bio as string)?.length ?? 0;
  score += Math.min(bioA / 20, 15);
  score += Math.min(bioB / 20, 15);
  const interestsA = Array.isArray(a.interests) ? a.interests.length : 0;
  const interestsB = Array.isArray(b.interests) ? b.interests.length : 0;
  score += Math.min(interestsA / 3, 10);
  score += Math.min(interestsB / 3, 10);
  const photosA = Array.isArray(a.photos) ? a.photos.length : 0;
  const photosB = Array.isArray(b.photos) ? b.photos.length : 0;
  score += Math.min(photosA / 2, 10);
  score += Math.min(photosB / 2, 10);
  return Math.min(score, 100);
}

function futureScore(a: Record<string, unknown>, b: Record<string, unknown>): number {
  let score = 0;
  if (a.age && b.age) {
    const diff = Math.abs(Number(a.age) - Number(b.age));
    if (diff <= 3) score += 40;
    else if (diff <= 7) score += 30;
    else if (diff <= 12) score += 20;
    else if (diff <= 20) score += 10;
  }
  const lifeKeywords = ["karriere", "familie", "barn", "studiar", "reiser", "busette", "utvikle", "framtid", "mål", "vaks"];
  const bioA = (a.bio as string)?.toLowerCase() ?? "";
  const bioB = (b.bio as string)?.toLowerCase() ?? "";
  const aHas = lifeKeywords.filter((k) => bioA.includes(k));
  const bHas = lifeKeywords.filter((k) => bioB.includes(k));
  if (aHas.length > 0 && bHas.length > 0) {
    const overlap = aHas.filter((k) => bHas.includes(k));
    score += (overlap.length / Math.max(aHas.length, bHas.length)) * 30;
  }
  if (Array.isArray(a.interests) && Array.isArray(b.interests)) {
    const futureKeywords = ["karriere", "forretnin", "invest", "utvikle", "prosjekt", "bygg", "skap", "grünn"];
    const interestsA = a.interests as string[];
    const interestsB = b.interests as string[];
    const sharedFuture = interestsA.filter((i) => interestsB.includes(i) && futureKeywords.some((k) => i.toLowerCase().includes(k)));
    score += Math.min(sharedFuture.length * 10, 20);
  }
  return Math.min(score, 100);
}

export function calculateScore(a: Record<string, unknown>, b: Record<string, unknown>): ScoreResult {
  const w: WeightsType = getWeights() as unknown as WeightsType;
  const base = baseCompatibilityScore(a, b);
  const resonance = emotionalResonance(a, b);
  const semantic = deepSemanticScore(a, b);
  const intimacy = intimacyScore(a, b);
  const future = futureScore(a, b);
  const total = base * w.base + resonance * w.resonance + semantic * w.semantic + intimacy * w.intimacy + future * w.future;
  const totalScore = Math.round(total);
  let matchQuality: "excellent" | "strong" | "moderate" | "weak";
  if (totalScore > 85) matchQuality = "excellent";
  else if (totalScore > 70) matchQuality = "strong";
  else if (totalScore > 55) matchQuality = "moderate";
  else matchQuality = "weak";
  return { totalScore, breakdown: { base, resonance, semantic, intimacy, future }, matchQuality };
}

let _cache: Map<string, ScoreResult> = new Map();

function getCacheKey(a: Record<string, unknown>, b: Record<string, unknown>): string {
  const idA = String(a.userId ?? a.id ?? "");
  const idB = String(b.userId ?? b.id ?? "");
  return [idA, idB].sort().join(":");
}

export function getCachedScore(a: Record<string, unknown>, b: Record<string, unknown>): ScoreResult | null {
  const key = getCacheKey(a, b);
  return _cache.get(key) ?? null;
}

export function setCachedScore(a: Record<string, unknown>, b: Record<string, unknown>, result: ScoreResult): void {
  const key = getCacheKey(a, b);
  _cache.set(key, result);
}

// Alias for backward compatibility — imported as generateExplanation in some routes.
export const generateExplanation = explainMatch;