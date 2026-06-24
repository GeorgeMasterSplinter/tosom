// ranking.ts — sortering og deduplisering av matches

import { SubScoreBreakdown } from "./types";

interface ScoreResult {
  breakdown: SubScoreBreakdown;
  totalScore: number;
  matchQuality: string;
}

/**
 * Representasjon av eit match-resultat klar for rangering.
 */
export interface RankedMatch {
  targetUserId: string;
  scoreResult: ScoreResult;
  explanation: {
    tier: ScoreResult["matchQuality"];
    tierLabel: string;
    breakdown: Array<{
      key: keyof ScoreResult["breakdown"];
      score: number;
      label: string;
      explanation: string;
    }>;
    summary: string;
  };
}

/**
 * Sorter match-resultat etter totalScore (høgast først).
 * Kan valfritt filtrere bort resultatar under ein terskel.
 */
export function rankMatches(
  matches: RankedMatch[],
  opts?: { minScore?: number },
): RankedMatch[] {
  let filtered = matches;

  if (opts?.minScore != null) {
    const minScore = opts.minScore;
    filtered = matches.filter((m) => m.scoreResult.totalScore >= minScore);
  }

  return filtered.sort((a, b) => b.scoreResult.totalScore - a.scoreResult.totalScore);
}

/**
 * Fjern dublett-matching av same brukar.
 * Dersom to profiler peikar på same targetUserId, hald berre den med høgast score.
 */
export function deduplicateMatches(matches: RankedMatch[]): RankedMatch[] {
  const seen = new Map<string, RankedMatch>();

  for (const match of matches) {
    const existing = seen.get(match.targetUserId);
    if (!existing || match.scoreResult.totalScore > existing.scoreResult.totalScore) {
      seen.set(match.targetUserId, match);
    }
  }

  return rankMatches([...seen.values()]);
}
