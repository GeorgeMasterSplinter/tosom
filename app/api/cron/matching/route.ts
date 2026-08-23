/**
 * Tosom — Kohort-basert Matcherunde (STEG B6)
 *
 * GET /api/cron/matching
 * - Én motor: kohortbasert parvis kobling uten samtykke
 * - Les QUEUED-brukere, score alle par, grådig matching
 * - MIN_COHORT_SIZE=2 terskel (v8: ukentlig kadens) — køalder logges som observasjon
 * - Opprett Match(active), Conversation, JourneyProgress, Notification × 2
 * - Ingen push/e-post/SMS (invariant I-4)
 */

import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import { timingSafeEqual, randomUUID } from 'crypto';
import { sjekkAlleDealbreakers } from '@/lib/matching/dealbreaker';
import { unifiedScore } from '@/lib/matching/unifiedScorer';
import type { UnifiedResult } from '@/lib/matching/unifiedScorer';
import { toResonanceLevel } from '@/lib/matching/resonanceLevel';
import { MIN_COHORT_SIZE, MIN_SCORE } from '@/config/matching';
import { isMatchingEnabled, isBetaMatchEmailEnabled } from '@/config/features';
import { sendMatchEmail } from '@/lib/email';
import { mapRejectReason } from './rejectReason';
import { sendAlert } from '@/lib/observability/alert';
import { recordMetric } from '@/lib/observability/metric';

// B0.5 — Vercel Hobby: max 60s
export const maxDuration = 60;

// Advisory lock ID for matching-cron
const MATCHING_CRON_LOCK_ID = 123456789;

// Tidsbudsjett (fra A4 — Hobby-plan)
const TIME_BUDGET_MS = 50_000;

// S4: Kø-tak konfigurerbart via miljøvariabel (standard 5 000)
const QUEUE_LIMIT = Math.max(1, parseInt(process.env.MATCHING_QUEUE_LIMIT ?? '5000', 10));

/** Constant-time string comparison */
function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

/** Normalize pair for MatchHistory lookup */
function normalizePair(aId: string, bId: string): [string, string] {
  return aId < bId ? [aId, bId] : [bId, aId];
}

// M-4: utfall som betyr PERMANENT sperre (trygghet veier tyngre enn tilgang på kandidater)
const PERMANENT_OUTCOMES = ['blocked', 'early_exit'];

// M-9: median for scorefordeling
function median(arr: number[]): number {
  if (arr.length === 0) return 0;
  const s = [...arr].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

interface Candidate {
  id: string;
  profile: any;
}

interface ScoredPair {
  userIdA: string;
  userIdB: string;
  score: number;
  breakdown: UnifiedResult['breakdown'];
  level: UnifiedResult['level'];
}

export async function GET(req: NextRequest) {
  const startedAt = Date.now();
  const deadline = startedAt + TIME_BUDGET_MS;

  // Auth
  const expectedSecret = process.env.CRON_SECRET;
  if (!expectedSecret) {
    return NextResponse.json({ error: 'Cron miskonfigurt' }, { status: 500 });
  }

  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const providedSecret = authHeader.slice(7);
  if (!safeCompare(providedSecret, expectedSecret)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // B0.6 — Kill switch: MATCHING_ENABLED=false stanser runden uten å røre køen
  if (!isMatchingEnabled()) {
    await prisma.systemLog.create({
      data: {
        level: 'INFO',
        message: 'Matching stanset av kill switch (MATCHING_ENABLED=false)',
        module: 'cron:matching',
        metadata: { skipped: true, reason: 'matching_disabled' },
      },
    });
    return NextResponse.json({ ok: true, skipped: true, reason: 'matching_disabled' });
  }

  // S-17: Watchdog — «runden ble ikke kjørt innen 03:00 lørdag».
  // Runden kjører en gang i uken. Dersom sist logga kjøring er eldre enn
  // en uke (8 dager for tåle en ekstra uke), har scheduleren mistet en eller
  // flere kjøringer — og folk i køen venter forgjeves. Varsler kritisk.
  // Sjekken er best-effort: en feil her må aldri bryte selve runden.
  try {
    const lastRun = await prisma.systemLog.findFirst({
      where: { module: 'cron:matching', level: { in: ['INFO', 'WARN'] } },
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true },
    });
    const MAX_STALE_MS = 8 * 24 * 60 * 60 * 1000;
    if (lastRun && Date.now() - lastRun.createdAt.getTime() > MAX_STALE_MS) {
      const staleDays = Math.round((Date.now() - lastRun.createdAt.getTime()) / (24 * 60 * 60 * 1000));
      await sendAlert(
        'critical',
        'Matcherunde ser ut til å ikke ha kjørt',
        `Sist logga lørdagskjøring var for ${staleDays} dager siden. Scheduleren kan ha mistet en eller flere kjøringer — noen i køen venter forgjeves.`
      );
    }
  } catch {
    // Watchdog feiler aldri runden.
  }

  let lockAcquired = false;
  let deferred = false;
  let paired = 0;
  let pairsEvaluated = 0;
  let cronJobOutcome: 'ok' | 'error' = 'ok';
  const rejectReasons: Record<string, number> = {
    mangler_profil: 0,
    sperreliste: 0,
    modenhetsgap: 0,
    livsrytme: 0,
    preferanser: 0,
    grenser: 0,
    radius: 0,
    sikkerhetsniva: 0,
    score_under_termin: 0,
    scoring_feil: 0,
  };
  const unmapped: string[] = [];
  // ST5.2: Etiketter per avvisningsårsak (tiltak T2) — for lesbart logg-output
  const REJECT_LABELS: Record<string, string> = {
    mangler_profil: 'avvist: mangler profil',
    sperreliste: 'avvist: sperreliste',
    modenhetsgap: 'avvist: modenhetsgap',
    livsrytme: 'avvist: livsrytme',
    preferanser: 'avvist: eksplisitte preferanser',
    grenser: 'avvist: grenser',
    radius: 'avvist: radius',
    sikkerhetsniva: 'avvist: sikkerhetsnivå',
    score_under_termin: 'avvist: score under MIN_SCORE',
    scoring_feil: 'avvist: scoring kastet (korrupt profil)',
  };
  const errors: string[] = [];
  // M-9: samling for score-/nivåfordeling (til tuning)
  const allScores: number[] = [];
  const levelCounts: Record<string, number> = {};

  try {
    // Advisory lock
    const lockResult = await prisma.$queryRaw(
      Prisma.sql`SELECT pg_try_advisory_lock(${MATCHING_CRON_LOCK_ID}) AS locked`
    );
    const lockCheck = Array.isArray(lockResult) ? (lockResult as any)[0] : (lockResult as any);
    if (!lockCheck?.locked) {
      return NextResponse.json({
        ok: true,
        skipped: true,
        message: 'Matching-cron er allerede i kjøring',
      });
    }
    lockAcquired = true;

    try {
      // 1. Les QUEUED-brukere FIFO (include profile)
      const queued = await prisma.user.findMany({
        where: {
          journeyState: 'QUEUED',
          onboardingComplete: true,
          bannedAt: null,
          deletedAt: null,
        },
        orderBy: { matchQueuedAt: 'asc' },
        take: QUEUE_LIMIT,
        include: {
          profile: true,
        },
      });

      const cohortSize = queued.length;

      // 2. Køalder som observasjon (M-2/M-9/S-17): venter noen forgjeves lenge?
      //    Hoisted slik at verdien gjelder både deferred- og kjøringsvei.
      const oldestInQueue = queued[0]?.matchQueuedAt ?? null;
      const oldestQueueAgeDays = oldestInQueue
        ? Math.floor((Date.now() - oldestInQueue.getTime()) / (1000 * 60 * 60 * 24))
        : 0;

      if (cohortSize < MIN_COHORT_SIZE) {
        deferred = true;

        const staleWarning =
          oldestQueueAgeDays > 14
            ? ` (oldest i kø: ${oldestQueueAgeDays} dager)`
            : '';

        // S-17: venter noen forgjeves? (kritisk for brukeropplevelsen)
        if (oldestQueueAgeDays > 14) {
          sendAlert(
            'warning',
            `Eldste i match-kø: ${oldestQueueAgeDays} dager`,
            `Kun ${cohortSize} i kø — runden ble ikke kjørt. Noen venter >14 dager uten match.`
          ).catch(() => {});
        }

        await prisma.systemLog.create({
          data: {
            level: oldestQueueAgeDays > 14 ? 'WARN' : 'INFO',
            message: `Matching deferert: ${cohortSize} i kø (<${MIN_COHORT_SIZE})${staleWarning}`,
            module: 'cron:matching',
            metadata: { deferred: true, queueSize: cohortSize, oldestQueueAgeDays },
          },
        });

        return NextResponse.json({
          ok: true,
          deferred: true,
          queueSize: cohortSize,
          oldestQueueAgeDays,
          message: `Kun ${cohortSize} i kø — vent på fler før matching`,
        });
      }

      // 3. Sperreliste (M-4 — differensiert tidsvindu):
      //    - blocked / early_exit  → PERMANENT (trygghet veier tyngre enn tilgang)
      //    - completed / new_journey / expired → 6 måneder (mennesker endrer seg)
      //    Løser samtidig minneproblemet (S-11): gamle par forsvinner ut av spørringa.
      const sixMonthsAgo = new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000);
      const history = await prisma.matchHistory.findMany({
        where: {
          OR: [
            // Permanent: aktivt avsluttet eller blokkert (uansett tidspunkt)
            { OR: [{ outcomeA: { in: PERMANENT_OUTCOMES } }, { outcomeB: { in: PERMANENT_OUTCOMES } }] },
            // Tidsbegrenset: endt innenfor de siste 6 månedene
            { endedAt: { gte: sixMonthsAgo } },
          ],
        },
        select: { userAId: true, userBId: true },
      });
      const blockSet = new Set(history.map((h) => normalizePair(h.userAId, h.userBId).join(':')));

      // S-15: Eksplisitt UserBlock-sjekk i hovedmotoren. En blokkert bruker skal
      // ALDRI matches med den som blokkerte. (findBestResonance sjekker også, men
      // den primære kohort-motoren sjekket kun MatchHistory — dette er forsikringen.)
      // Blokkering er rettet (blockerId→blockedId), men vi sperrer paret begge veier.
      const userBlocks = await prisma.userBlock.findMany({
        select: { blockerId: true, blockedId: true },
      });
      for (const b of userBlocks) {
        blockSet.add(normalizePair(b.blockerId, b.blockedId).join(':'));
      }
      const userBlockPairs = userBlocks.length;

      // 4. Score alle par — sjekk dealbreakers + sperreliste
      const pairs: ScoredPair[] = [];
      const candidates: Candidate[] = queued.map((u) => {
        const p = u.profile || null;
        return {
          id: u.id,
          profile: p
            ? {
                ...p,
                distancePref:
                  typeof (p.deepProfileData as Record<string, unknown> | null)?.distancePref === 'number'
                    ? (p.deepProfileData as Record<string, unknown>).distancePref as number
                    : null,
              }
            : null,
        };
      });

      for (let i = 0; i < candidates.length && Date.now() < deadline; i++) {
        for (let j = i + 1; j < candidates.length; j++) {
          const a = candidates[i];
          const b = candidates[j];
          pairsEvaluated++;

          // Hopp over uten profil
          if (!a.profile || !b.profile) { rejectReasons['mangler_profil']++; continue; }

          // Sperreliste
          const pairKey = normalizePair(a.id, b.id).join(':');
          if (blockSet.has(pairKey)) {
            rejectReasons['sperreliste']++;
            continue;
          }

          // M-3: Én korrupt profil må aldri velte heile lørdagsrunden.
          // Dealbreaker + scoring les profilen og kan kaste — fang og hopp over
          // PARET, ikkje runden. Logg begge bruker-ID-er så korrupt profil kan rettes.
          try {
            // Dealbreakers (tosidig)
            const abBlocked = sjekkAlleDealbreakers(a.profile, b.profile);
            const baBlocked = sjekkAlleDealbreakers(b.profile, a.profile);
            if (abBlocked.hasDealbreaker || baBlocked.hasDealbreaker) {
              const reason = abBlocked.reason ?? baBlocked.reason;
              const key = mapRejectReason(reason);
              rejectReasons[key]++;
              if (reason && key === 'preferanser' && !reason.startsWith('Dealbreaker')) {
                unmapped.push(reason);
              }
              continue;
            }

            // Resonans-score med unifiedScore (9 dimensjoner, 0–100)
            const result = unifiedScore(a.profile, b.profile);
            // M-9: samle score-/nivåfordeling for alle parscorede par (til tuning)
            allScores.push(result.score);
            levelCounts[result.level] = (levelCounts[result.level] ?? 0) + 1;
            if (result.score < MIN_SCORE) {
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
            rejectReasons['scoring_feil']++;
            const msg = (err as Error)?.message ?? String(err);
            errors.push(`scoring ${a.id}+${b.id}: ${msg}`);
            await prisma.systemLog.create({
              data: {
                level: 'ERROR',
                message: `Scoring feila for par ${a.id}+${b.id} — paret hoppast, runden fortset (M-3)`,
                module: 'cron:matching',
                metadata: { userA: a.id, userB: b.id, error: msg },
              },
            }).catch(() => {});
            continue;
          }
        }
      }

      // 5. Sorter synkende score, grådig kobling
      pairs.sort((a, b) => b.score - a.score);
      const used = new Set<string>();
      const matchedPairs: ScoredPair[] = [];

      for (const pair of pairs) {
        if (used.has(pair.userIdA) || used.has(pair.userIdB)) {
          continue;
        }
        used.add(pair.userIdA);
        used.add(pair.userIdB);
        matchedPairs.push(pair);
      }

      // 6. Per batch: én transaksjon for BATCH_SIZE par (S1 — batch transaksjoner)
      const BATCH_SIZE = 50;

      for (let batchIdx = 0; batchIdx < matchedPairs.length; batchIdx += BATCH_SIZE) {
        if (Date.now() >= deadline) break;

        const batch = matchedPairs.slice(batchIdx, batchIdx + BATCH_SIZE);
        const now = new Date();

        // Pre-generer match-ID-er for hele batchen
        const batchMatches = batch.map((pair) => ({
          id: randomUUID(),
          pair,
        }));

        try {
          await prisma.$transaction(async (tx) => {
            // 1. Match × N (createMany)
            await tx.match.createMany({
              data: batchMatches.map(({ id, pair }) => ({
                id,
                userAId: pair.userIdA,
                userBId: pair.userIdB,
                score: pair.score,
                normalizedScore: pair.score / 100,
                scoringBreakdown: pair.breakdown as unknown as Prisma.InputJsonValue,
                status: 'active' as const,
                type: 'resonance',
                resonanceLevel: toResonanceLevel(pair.score),
              })),
            });

            // 2. Conversation × N (createMany)
            await tx.conversation.createMany({
              data: batchMatches.map(({ id, pair }) => ({
                userAId: pair.userIdA,
                userBId: pair.userIdB,
                matchId: id,
              })),
            });

            // 3. JourneyProgress × 2N (createMany)
            await tx.journeyProgress.createMany({
              data: batchMatches.flatMap(({ id, pair }) => [
                { userId: pair.userIdA, matchId: id, phase: 'EARLY', day: 0, bothSeenAt: null },
                { userId: pair.userIdB, matchId: id, phase: 'EARLY', day: 0, bothSeenAt: null },
              ]),
            });

            // 4. Notification × 2N (createMany)
            await tx.notification.createMany({
              data: batchMatches.flatMap(({ pair }) => [
                { userId: pair.userIdA, type: 'MATCH' as const, message: 'Du har en ny kobling. Logg inn og se hvem.' },
                { userId: pair.userIdB, type: 'MATCH' as const, message: 'Du har en ny kobling. Logg inn og se hvem.' },
              ]),
            });

            // 5. User × 2N → journeyState: MATCHED (updateMany med felles data)
            const allUserIds = batchMatches.flatMap(({ pair }) => [pair.userIdA, pair.userIdB]);
            await tx.user.updateMany({
              where: { id: { in: allUserIds } },
              data: { journeyState: 'MATCHED', matchQueuedAt: null, lastMatchAt: now },
            });
          });

          paired += batch.length;

          // B-2: Match-varsel på e-post — bak flagget BETA_MATCH_EMAIL.
          // Invariant I-4 står urørt i koden; avviket er eksplisitt og flagget.
          // Sendes etter transaksjonen (best-effort — e-postfeil skal aldri velte runden).
          if (isBetaMatchEmailEnabled()) {
            const batchUserIds = batch.flatMap((p) => [p.userIdA, p.userIdB]);
            try {
              const users = await prisma.user.findMany({
                where: { id: { in: batchUserIds } },
                select: { id: true, email: true },
              });
              for (const user of users) {
                if (user.email) {
                  sendMatchEmail(user.email).catch(() => {});
                }
              }
            } catch {
              // E-postfeil skal aldri velte runden
            }
          }
        } catch (err) {
          errors.push(`batch ${Math.floor(batchIdx / BATCH_SIZE) + 1} (${batch.length} par): ${(err as Error).message}`);
        }
      }

      const remaining = queued.length - used.size;
      const durationMs = Date.now() - startedAt;

      // OBSERVABILITY O-2: matcherunden som metrikk (Vercel-graf + SystemLog-historikk).
      // Ingen PII — kun tall og kategorier. rejectReasons er allerede aggregert under
      // runden, så én kall per årsak holder antall DB-skrivinger nede (regel M-3: aldri vent).
      recordMetric('match.round.duration_ms', durationMs, 'ms');
      recordMetric('match.round.paired', paired, 'count');
      recordMetric('match.round.queue_before', cohortSize, 'count');
      recordMetric('match.round.queue_after', remaining, 'count');
      for (const [reason, count] of Object.entries(rejectReasons)) {
        if (count > 0) recordMetric('match.round.rejected', count, 'count', { reason });
      }
      // OBSERVABILITY O-7: hvor lenge venter folk faktisk (per matchet bruker)
      for (const u of queued) {
        if (used.has(u.id) && u.matchQueuedAt) {
          const waitedDays = Math.floor((Date.now() - u.matchQueuedAt.getTime()) / 86_400_000);
          recordMetric('queue.waited_days', waitedDays, 'days');
        }
      }

      // M-9: score-/nivåfordeling (til tuning). Mediana fra alle parscorede par.
      const sortedScores = [...allScores].sort((a, b) => a - b);
      const scoreDistribution = allScores.length
        ? { min: sortedScores[0], median: median(allScores), max: sortedScores[sortedScores.length - 1] }
        : { min: 0, median: 0, max: 0 };

      // FORSKNINGSMOTOR F-9: logg score-/nivåfordeling som metrikk (ikke-blokkerande).
      // Resonanstersklene (80/65/50/40) er kalibrerte for ordoverlapp; skårede
      // instrument gir annan fordeling. Vi skal ettersjå fordelinga etter beta og
      // kalibrere tersklene på nytt dersom trengst (invariant I-12 held: brukaren ser ord).
      recordMetric('match.round.score_median', scoreDistribution.median, 'points', { source: 'psych_or_overlap' });
      recordMetric('match.round.score_min', scoreDistribution.min, 'points');
      recordMetric('match.round.score_max', scoreDistribution.max, 'points');
      recordMetric('match.round.scored_pairs', allScores.length, 'count');
      for (const [level, count] of Object.entries(levelCounts)) {
        if (count > 0) recordMetric('match.round.level', count, 'count', { level });
      }

      // S-17: varsling til operatøren (webhook → e-post → Sentry). Skal aldri kaste runden.
      try {
        if (durationMs >= TIME_BUDGET_MS) {
          await sendAlert(
            'warning',
            'Matcherunde traff tidsbudsjettet',
            `Runden kjørte ${durationMs} ms (budsjett ${TIME_BUDGET_MS} ms). ${paired} par koblet — enkelte par kan være hoppa.`
          );
        }
        if (paired === 0 && cohortSize >= 10) {
          await sendAlert(
            'warning',
            'Matcherunde: null matcher med ≥10 i kø',
            `${cohortSize} i kø, men 0 par koblet. Sjekk dealbreakers og kø-konfig.`
          );
        }
        if (oldestQueueAgeDays > 14) {
          await sendAlert(
            'warning',
            `Eldste i match-kø: ${oldestQueueAgeDays} dager`,
            'Noen venter lenger enn 14 dager uten match — sjekk kohort- og kø-konfig.'
          );
        }
      } catch { /* alert kan aldri kaste runden */ }

      // Heartbeat
      // ST5.2: Avvisningslogg per årsak (tiltak T2)
      const rejectSummary = Object.entries(rejectReasons).filter(([, v]) => v > 0);
      await prisma.systemLog.create({
        data: {
          level: paired === 0 && cohortSize >= 10 ? 'WARN' : 'INFO',
          message: `Matching-runde: ${paired} par koblet, ${remaining} igjen i kø | Avvisninger: ${rejectSummary.map(([k, v]) => `${k}=${v}`).join(', ') || 'ingen'}`,
          module: 'cron:matching',
          metadata: {
            paired, remaining, durationMs, deferred,
            queueSize: cohortSize, pairsEvaluated, rejectReasons,
            scoreDistribution, levelDistribution: levelCounts, oldestQueueAgeDays,
            userBlockPairs,
            unmapped: unmapped.length > 0 ? unmapped : undefined,
          },
        },
      });

      return NextResponse.json({
        ok: true,
        paired,
        remaining,
        durationMs,
        deferred,
        queueSize: cohortSize,
        errors: errors.length > 0 ? errors.slice(0, 5) : undefined,
      });
    } finally {
      if (lockAcquired) {
        await prisma.$queryRaw(
          Prisma.sql`SELECT pg_advisory_unlock(${MATCHING_CRON_LOCK_ID})`
        );
      }
    }
  } catch (err) {
    console.error('[cron] Matching feil:', err);
    // S-17: runden kastet — kritisk (alle i kø mister uka)
    sendAlert('critical', 'Matcherunde kastet en feil', (err as Error).message).catch(() => {});
    cronJobOutcome = 'error';
    return NextResponse.json(
      { error: 'Kunne ikke kjøre matching', details: (err as Error).message },
      { status: 500 }
    );
  } finally {
    // Heartbeat i SystemLog (sikkerhetsnett)
    const durationMs = Date.now() - startedAt;
    // OBSERVABILITY O-3: cron-jobb som metrikk (Vercel viser kun HTTP-status;
    // dette sier om jobben faktisk fullførte — inkludert deferred som 'ok').
    recordMetric('cron.duration_ms', durationMs, 'ms', { job: 'matching', outcome: cronJobOutcome });
    try {
      await prisma.systemLog.create({
        data: {
          level: 'INFO',
          message: `Cron matching heartbeat: ${paired} par, deferred=${deferred}`,
          module: 'cron:matching',
          metadata: { paired, deferred, durationMs, errors: errors.slice(0, 10) },
        },
      });
    } catch { /* ignore */ }
  }
}


// Ingen caching for cron-endepunkt
export const dynamic = 'force-dynamic';
export const revalidate = 0;