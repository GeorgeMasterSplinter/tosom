import prisma from "./prisma";
import { MATCH_WEIGHTS } from "@/config/matching";

import { baseScore } from "./baseScore";
import { deepMatch } from "./deepMatch";
import { resonanceScore } from "./resonance";
import { semanticScore } from "./semantic";

export async function calculateMatchScore(userA, userB) {
  const base = baseScore(userA, userB);          // 0–100
  const deep = deepMatch(userA, userB);          // 0–100
  const resonance = resonanceScore(userA, userB); // 0–100
  const semantic = semanticScore(userA, userB);   // 0–100

  const total =
    base * MATCH_WEIGHTS.base +
    deep * MATCH_WEIGHTS.deep +
    resonance * MATCH_WEIGHTS.resonance +
    semantic * MATCH_WEIGHTS.semantic;

  return {
    totalScore: Math.round(total),
    breakdown: {
      base,
      deep,
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

export async function findBestMatchesForUser(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true },
  });

  const candidates = await prisma.user.findMany({
    where: {
      id: { not: userId },
      gender: user.prefersGender,
      prefersGender: user.gender,
    },
    include: { profile: true },
  });

  const scored = [];

  for (const c of candidates) {
    const score = await calculateMatchScore(user.profile, c.profile);
    scored.push({ user: c, score });
  }

  scored.sort((a, b) => b.score.totalScore - a.score.totalScore);

  return scored.slice(0, 3);
}
