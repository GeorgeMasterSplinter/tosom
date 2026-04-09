import prisma from "./prisma";
import { deepSemanticScore } from "./semantic";
import { emotionalResonance } from "./resonance";
import { baseCompatibilityScore } from "./baseScore";

export async function deepMatch(userId: string) {
  const user = await prisma.profile.findUnique({ where: { userId } });
  if (!user) return [];

  const others = await prisma.profile.findMany({
    where: { userId: { not: userId } },
  });

  // LAG 1: Hard filters
  const filtered = others.filter((p) => {
    if (user.wantChildren && p.wantChildren && user.wantChildren !== p.wantChildren) return false;
    if (user.wantCohabitation && p.wantCohabitation && user.wantCohabitation !== p.wantCohabitation) return false;
    if (user.wantMarriage && p.wantMarriage && user.wantMarriage !== p.wantMarriage) return false;
    return true;
  });

  // LAG 2–4: Deep scoring
  const scored = [];

  for (const p of filtered) {
    const base = baseCompatibilityScore(user, p); // 0–100
    const semantic = await deepSemanticScore(user, p); // 0–100
    const resonance = await emotionalResonance(user, p); // 0–100

    const finalScore = 
      base * 0.5 +
      semantic * 0.3 +
      resonance * 0.2;

    scored.push({
      profile: p,
      score: finalScore,
      layers: { base, semantic, resonance },
    });
  }

  return scored.sort((a, b) => b.score - a.score).slice(0, 3);
}
