// lib/matching/scoreRound.ts — F2: Ren scoring-kjerne for matcherunden
//
// Utteken frå app/api/cron/matching/route.ts slik at den hetaste delen av
// appen (O(n²) par-loop) kan testast utan DB, Vercel eller cron.
//
// Semantikken er identisk med den gamle ruten:
//   - FIFO-par (i < j), deadline-sjekk på ytste i-loop
//   - mangler_profil → sperreliste → dealbreakers → unifiedScore → MIN_SCORE
//   - M-3: éin korrupt profil kastar berre PARET, ikkje runden
//     (scoringErrors returnerast; ruten skriv dei same SystemLog-radene)
//   - M-12: rejectReasons-nøklar og unmapped-lista er uendra
//
// Prestasjon (F2): dealbreakers køyrast via prekalkulat CheapFeatures
// (cheapSjekkAll) i staden for sjekkAlleDealbreakers ×2 med normalisering
// per par. unifiedScore kjøyrast berre for par som overlever filtera.

import { ProfileData } from './types';
import { CheapFeatures } from './cheapFeatures';
import { cheapSjekkAll } from './cheapFeatures';
import { unifiedScore } from './unifiedScorer';
import type { UnifiedResult } from './unifiedScorer';
import { mapRejectReason } from './rejectReason';

export interface ScoreCandidate {
  id: string;
  profile: ProfileData | null;
}

export interface ScoredPair {
  userIdA: string;
  userIdB: string;
  score: number;
  breakdown: UnifiedResult['breakdown'];
  level: UnifiedResult['level'];
}

/** M-3: par der scoring kastet (ruten loggar kvar linje i SystemLog). */
export interface ScoringError {
  userA: string;
  userB: string;
  error: string;
}

export interface ScoreRoundResult {
  pairs: ScoredPair[];
  rejectReasons: Record<string, number>;
  allScores: number[];
  levelCounts: Record<string, number>;
  unmapped: string[];
  scoringErrors: ScoringError[];
  /** Alle (i, j)-par som vart vurderte. */
  pairsEvaluated: number;
  /** Kor mange i-iterasjonar som vart fullførte (for S3-observasjon). */
  candidatesScored: number;
  /** True dersom budsjettet treft midt i runden. */
  deadlineHit: boolean;
}

/** Normalize pair for sperreliste-søk (same som i ruten tidlegare). */
export function normalizePair(aId: string, bId: string): [string, string] {
  return aId < bId ? [aId, bId] : [bId, aId];
}

/** M-12-nøklane i fast rekkjefølgje (initialiserast til 0 i ruten). */
export const REJECT_REASON_KEYS = [
  'mangler_profil',
  'sperreliste',
  'kjonn',
  'alder',
  'modenhetsgap',
  'livsrytme',
  'preferanser',
  'grenser',
  'radius',
  'sikkerhetsniva',
  'score_under_termin',
  'scoring_feil',
] as const;

export function emptyRejectReasons(): Record<string, number> {
  const r: Record<string, number> = {};
  for (const k of REJECT_REASON_KEYS) r[k] = 0;
  return r;
}

/**
 * Score alle par i ein kohort. Ren funksjon — ingen DB, ingen I/O.
 *
 * @param candidates  FIFO-rekkefølgje (i < j) — same som ruten las frå DB
 * @param features    Prekalkulerte CheapFeatures (same indeks som candidates;
 *                    null der kandidaten manglar profil)
 * @param blockSet    Sperreliste (normalizePair-nøklar med ':' som skiljar)
 * @param opts        deadline (Date.now()-stamp) og MIN_SCORE-termin
 */
export function scoreRound(
  candidates: ScoreCandidate[],
  features: (CheapFeatures | null)[],
  blockSet: Set<string>,
  opts: { deadline: number; minScore: number },
): ScoreRoundResult {
  const { deadline, minScore } = opts;
  const pairs: ScoredPair[] = [];
  const rejectReasons = emptyRejectReasons();
  const allScores: number[] = [];
  const levelCounts: Record<string, number> = {};
  const unmapped: string[] = [];
  const scoringErrors: ScoringError[] = [];
  let pairsEvaluated = 0;
  let candidatesScored = 0;
  let deadlineHit = false;

  for (let i = 0; i < candidates.length && Date.now() < deadline; i++) {
    candidatesScored++;
    const a = candidates[i];
    const fa = features[i] ?? null;

    for (let j = i + 1; j < candidates.length; j++) {
      const b = candidates[j];
      pairsEvaluated++;

      // Hopp over utan profil
      if (!a.profile || !b.profile) {
        rejectReasons['mangler_profil']++;
        continue;
      }

      // Sperreliste
      if (blockSet.has(normalizePair(a.id, b.id).join(':'))) {
        rejectReasons['sperreliste']++;
        continue;
      }

      try {
        // Dealbreakers (tosidig) — prekalkulat, same rekkjefølgje/reason som før
        const fj = features[j] ?? null;
        const reason = fa && fj ? cheapSjekkAll(fa, fj) : null;
        if (reason) {
          const key = mapRejectReason(reason);
          rejectReasons[key]++;
          if (key === 'preferanser' && !reason.startsWith('Dealbreaker')) {
            unmapped.push(reason);
          }
          continue;
        }

        // Resonans-score med unifiedScore (9 dimensjoner, 0–100)
        const result = unifiedScore(a.profile, b.profile);
        // M-9: samle score-/nivåfordeling for alle parscorede par (til tuning)
        allScores.push(result.score);
        levelCounts[result.level] = (levelCounts[result.level] ?? 0) + 1;
        if (result.score < minScore) {
          rejectReasons['score_under_termin']++;
          continue; // MIN_SCORE terskel (40 på 0–100 skala)
        }

        pairs.push({
          userIdA: a.id,
          userIdB: b.id,
          score: result.score,
          breakdown: result.breakdown,
          level: result.level,
        });
      } catch (err) {
        // M-3: Én korrupt profil må aldri velte heile runden — fang paret.
        rejectReasons['scoring_feil']++;
        const msg = (err as Error)?.message ?? String(err);
        scoringErrors.push({ userA: a.id, userB: b.id, error: msg });
      }
    }
  }

  if (Date.now() >= deadline) deadlineHit = true;

  return {
    pairs,
    rejectReasons,
    allScores,
    levelCounts,
    unmapped,
    scoringErrors,
    pairsEvaluated,
    candidatesScored,
    deadlineHit,
  };
}
