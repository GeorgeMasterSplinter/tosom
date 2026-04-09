import prisma from "./prisma";
import { MATCH_WEIGHTS } from "@/config/matching";

import { baseCompatibilityScore as baseScore } from "./baseScore";
import { emotionalResonance as resonanceScore } from "./resonance";
import { deepSemanticScore as semanticScore } from "./semantic";

export async function calculateMatchScore(userA, userB) {
  const base = baseScore(userA, userB);          
  const resonance = await resonanceScore(userA, userB); 
  const semantic = await semanticScore(userA, userB);   

  const total =
    base * MATCH_WEIGHTS.base +
    resonance * MATCH_WEIGHTS.resonance +
    semantic * MATCH_WEIGHTS.semantic;

  return {
    totalScore: Math.round(total),
    breakdown: {
      base,
      resonance,
      semantic,
    },
    matchQuality:
      total > 85
        ? "excellent"
        : total > 70
        ? "strong"
        : total > 55
        ? "moderate"
        : "weak",
  };
}
