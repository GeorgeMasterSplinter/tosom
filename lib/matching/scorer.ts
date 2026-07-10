// lib/matching/scorer.ts — hovedscorer-funksjoner for matching-motoren
// Alle funksjoner returnerer verdier i [0, 1]

import { ProfileData, SubScoreBreakdown } from "./types";
import { normalize, clamp01, weightedSum } from "./normalizer";
import { getWeights, WeightConfig } from "./weightConfig";

/**
 * calculateBaseCompatibility — Grunnleggjande kompatibilitet (0–1)
 * Måler kompatibilitet basert på:
 *   - Verdi-kompatibilitet (40%): Felles verdier fra lifeSituation og personality
 *   - Livssituasjon (30%): Sammenligner lifestyle, bosted, økonomi
 *   - Personlighet (30%): Styrker, trekk, natur
 */
export function calculateBaseCompatibility(a: ProfileData, b: ProfileData): number {
  let rawScore = 0;
  const maxScore = 100;
  
  // 1. Verdi-kompatibilitet (maks 40)
  if (a.lifeSituation && b.lifeSituation) {
    const aValues = (a.lifeSituation as { values?: string[] }).values || [];
    const bValues = (b.lifeSituation as { values?: string[] }).values || [];
    const shared = aValues.filter((v) => bValues.includes(v));
    rawScore += Math.min(shared.length * 8, 40);
  }
  
  // 2. Livssituasjon overlapping (maks 30)
  if (a.lifestyle && b.lifestyle) {
    const aActivities = (a.lifestyle as { activities?: string[] }).activities || [];
    const bActivities = (b.lifestyle as { activities?: string[] }).activities || [];
    const shared = aActivities.filter((a) => bActivities.includes(a));
    rawScore += Math.min(shared.length * 6, 30);
  }
  
  // 3. Personlegdom (maks 30)
  if (a.personality && b.personality) {
    const aTraits = (a.personality as { traits?: string[] }).traits || [];
    const bTraits = (b.personality as { traits?: string[] }).traits || [];
    const shared = aTraits.filter((t) => bTraits.includes(t));
    rawScore += Math.min(shared.length * 5, 30);
  }
  
  // 4. Aldersnærhet (maks 20)
  if (a.age && b.age) {
    const diff = Math.abs(Number(a.age) - Number(b.age));
    if (diff <= 3) rawScore += 20;
    else if (diff <= 7) rawScore += 15;
    else if (diff <= 12) rawScore += 10;
    else if (diff <= 20) rawScore += 5;
  }
  
  return normalize(rawScore, 0, maxScore);
}

/**
 * calculateEmotionalResonance — Emosjonell resonans (0–1)
 * Måler hvor godt to mennesker resonerer med hverandre:
 *   - Kommunikasjon (50%): Sammenligner kommunikasjonspreferanser
 *   - Forholdsstil (50%): Sammenligner forholdsstil
 */
export function calculateEmotionalResonance(a: ProfileData, b: ProfileData): number {
  let rawScore = 0;
  const maxScore = 100;
  
  // 1. Kommunikasjon-preferanser (maks 50)
  if (a.communication && b.communication) {
    const aComm = (a.communication as { style?: string; preferredDepth?: string }).style || "";
    const bComm = (b.communication as { style?: string; preferredDepth?: string }).style || "";
    if (aComm && bComm && aComm === bComm) rawScore += 25;
    
    const aDepth = (a.communication as { preferredDepth?: string }).preferredDepth || "";
    const bDepth = (b.communication as { preferredDepth?: string }).preferredDepth || "";
    if (aDepth && bDepth && aDepth === bDepth) rawScore += 25;
  }
  
  // 2. Relasjonsstil (maks 50)
  if (a.relationshipStyle && b.relationshipStyle) {
    if (a.relationshipStyle === b.relationshipStyle) {
      rawScore += 50;
    } else {
      // Delvis match basert på nøkkelord-overlapp
      const aStyleWords = a.relationshipStyle.toLowerCase().split(/\s+/);
      const bStyleWords = b.relationshipStyle.toLowerCase().split(/\s+/);
      const shared = aStyleWords.filter((w) => bStyleWords.includes(w));
      if (shared.length > 0) {
        rawScore += shared.length * 10;
      }
    }
  }
  
  return normalize(rawScore, 0, maxScore);
}

/**
 * calculateSemanticOverlap — Semantisk overlap (0–1)
 * Måler hvor mye profil-data overlapping semantisk:
 *   - Fremtidsønsker (60%): Sammenligner futureVision
 *   - Livsstil (40%): Sammenligner lifestyle
 */
export function calculateSemanticOverlap(a: ProfileData, b: ProfileData): number {
  let rawScore = 0;
  const maxScore = 100;
  
  // 1. Fremtidsønsker overlap (maks 60)
  if (a.futureVision && b.futureVision) {
    const aGoals = (a.futureVision as { goals?: string[] }).goals || [];
    const bGoals = (b.futureVision as { goals?: string[] }).goals || [];
    const sharedGoals = aGoals.filter((g) => bGoals.includes(g));
    
    // Jaccard-similaritet
    const union = new Set([...aGoals, ...bGoals]).size;
    const jaccard = union > 0 ? sharedGoals.length / union : 0;
    rawScore += jaccard * 60;
  }
  
  // 2. Livsstil overlap (maks 40)
  if (a.lifestyle && b.lifestyle) {
    const aHabits = (a.lifestyle as { habits?: string[] }).habits || [];
    const bHabits = (b.lifestyle as { habits?: string[] }).habits || [];
    const sharedHabits = aHabits.filter((h) => bHabits.includes(h));
    
    const union = new Set([...aHabits, ...bHabits]).size;
    const jaccard = union > 0 ? sharedHabits.length / union : 0;
    rawScore += jaccard * 40;
  }
  
  // 3. Bio overlap (supplementary, maks 20)
  if (a.bio && b.bio) {
    const wordsA = new Set(a.bio.toLowerCase().split(/\s+/).filter((w) => w.length > 3));
    const wordsB = new Set(b.bio.toLowerCase().split(/\s+/).filter((w) => w.length > 3));
    const common = [...wordsA].filter((w) => wordsB.has(w));
    const bioOverlap = common.length / Math.max(wordsA.size, wordsB.size, 1);
    rawScore += Math.min(bioOverlap * 40, 20);
  }
  
  return normalize(rawScore, 0, maxScore);
}

/**
 * calculateIntimacyScore — Intimitet og sårbarhet (0–1)
 * Måler kompatibilitet på intimitetsnivå:
 *   - Intimitet (40%): Sammenligner intimacy-data
 *   - Grenser (30%): Sammenligner boundaries
 *   - Emosjonelle behov (30%): Sammenligner emotionalNeeds
 */
export function calculateIntimacyScore(a: ProfileData, b: ProfileData): number {
  let rawScore = 0;
  const maxScore = 100;
  
  // 1. Intimitet (maks 40)
  if (a.intimacy && b.intimacy) {
    const aApproach = (a.intimacy as { approach?: string }).approach || "";
    const bApproach = (b.intimacy as { approach?: string }).approach || "";
    if (aApproach && bApproach && aApproach === bApproach) {
      rawScore += 40;
    } else if (aApproach && bApproach) {
      const wordsA = aApproach.toLowerCase().split(/\s+/);
      const wordsB = bApproach.toLowerCase().split(/\s+/);
      const shared = wordsA.filter((w) => wordsB.includes(w));
      rawScore += Math.min(shared.length * 8, 20);
    }
  }
  
  // 2. Grenser (maks 30)
  if (a.boundaries && b.boundaries) {
    const aBoundaries = (a.boundaries as { preferredDistance?: string }).preferredDistance || "";
    const bBoundaries = (b.boundaries as { preferredDistance?: string }).preferredDistance || "";
    if (aBoundaries && bBoundaries && aBoundaries === bBoundaries) {
      rawScore += 30;
    }
  }
  
  // 3. Emosjonelle behov (maks 30)
  if (a.emotionalNeeds && b.emotionalNeeds) {
    const aNeeds = (a.emotionalNeeds as { needs?: string[] }).needs || [];
    const bNeeds = (b.emotionalNeeds as { needs?: string[] }).needs || [];
    const shared = aNeeds.filter((n) => bNeeds.includes(n));
    rawScore += Math.min(shared.length * 7.5, 30);
  }
  
  return normalize(rawScore, 0, maxScore);
}

/**
 * calculateFutureVisionScore — Fremtidskompatibilitet (0–1)
 * Måler hvor godt to profiler passer sammen for framtiden:
 *   - Livsrytme (50%): lifeRhythm-nærhet
 *   - Modenhet (50%): maturityLevel-nærhet
 */
export function calculateFutureVisionScore(a: ProfileData, b: ProfileData): number {
  let rawScore = 0;
  const maxScore = 100;
  
  // 1. Livsrytme-nærleik (maks 50)
  if (a.lifeRhythm && b.lifeRhythm) {
    if (a.lifeRhythm === b.lifeRhythm) {
      rawScore += 50;
    } else {
      // Samme retning (morning/evening er motsetninger, men fast/slow kan være komplementære)
      rawScore += 25; // Delvis match
    }
  }
  
  // 2. Modenheits-nærleik (maks 50)
  if (a.maturityLevel && b.maturityLevel) {
    const gap = Math.abs(a.maturityLevel - b.maturityLevel);
    if (gap <= 1) rawScore += 50;
    else if (gap <= 2) rawScore += 40;
    else if (gap <= 3) rawScore += 30;
    else if (gap <= 4) rawScore += 20;
    else rawScore += 10;
  }
  
  return normalize(rawScore, 0, maxScore);
}

/**
 * calculateTotalScore — Beregn total match-score fra to profiler.
 * Bruker vekter fra weightConfig.ts.
 */
export function calculateTotalScore(
  queryProfile: ProfileData,
  candidateProfile: ProfileData
): {
  breakdown: SubScoreBreakdown;
  totalScore: number;
  weights: WeightConfig;
} {
  const weights = getWeights();
  
  // Berekn alle sub-scorer
  const base = calculateBaseCompatibility(queryProfile, candidateProfile);
  const resonance = calculateEmotionalResonance(queryProfile, candidateProfile);
  const semantic = calculateSemanticOverlap(queryProfile, candidateProfile);
  const intimacy = calculateIntimacyScore(queryProfile, candidateProfile);
  const future = calculateFutureVisionScore(queryProfile, candidateProfile);
  
  // Vekt sum
  const totalScore = weightedSum(
    [base, resonance, semantic, intimacy, future],
    [weights.base, weights.resonance, weights.semantic, weights.intimacy, weights.future]
  );
  
  return {
    breakdown: { base, resonance, semantic, intimacy, future },
    totalScore,
    weights,
  };
}