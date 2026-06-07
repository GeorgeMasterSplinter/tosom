type ScoredMatch = {
  profile: MatchUser;
  score: number;
  layers: {
    base: number;
    semantic: number;
    resonance: number;
  };
};

type MatchUser = {
  id: string;
  userId: string;
  gender: string | null;
  age: number | null;
  location: string | null;
  bio: string | null;
  interests: string[];
  wantChildren: boolean | null;
  wantCohabitation: boolean | null;
  wantMarriage: boolean | null;
  createdAt: Date;
  updatedAt: Date;
};
import prisma from "./prisma";
import { deepSemanticScore } from "./semantic";
import { emotionalResonance } from "./resonance";
import { baseCompatibilityScore } from "./baseScore";

export async function deepMatch(user: MatchUser, others: MatchUser[]) {

  // LAG 1: Hard filters
  const filtered = others.filter((p) => {
    if (user.wantChildren && p.wantChildren && user.wantChildren !== p.wantChildren) return false;
    if (user.wantCohabitation && p.wantCohabitation && user.wantCohabitation !== p.wantCohabitation) return false;
    if (user.wantMarriage && p.wantMarriage && user.wantMarriage !== p.wantMarriage) return false;
    return true;
  });

  // LAG 2–4: Deep scoring
  const scored: ScoredMatch[] = [];

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