// ranking.ts — sortering og deduplisering av matches

import { SubScoreBreakdown } from "./types";

interface ScoreResult {
  breakdown: SubScoreBreakdown;
  totalScore: number;
  matchQuality: string;
}

/**
 * Representasjon av et match-resultat klar for rangering.
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
 * Sorter match-resultater etter totalScore (høyest først).
 * Kan valgfritt filtrere bort resultater under en terskel.
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
 * Fjern dobbelt-matching av samme bruker.
 * Dersom to profiler peker på samme targetUserId, hold bare den med høyest score.
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