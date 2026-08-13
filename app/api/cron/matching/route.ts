/**
 * ToSom — Kohort-basert Matcherunde (STEG B6)
 *
 * GET /api/cron/matching
 * - Én motor: kohortbasert parvis kobling uten samtykke
 * - Les QUEUED-brukere, score alle par, grådig matching
 * - MIN_COHORT_SIZE=20 terskel, 72h defer-ventil
 * - Opprett Match(active), Conversation, JourneyProgress, Notification × 2
 * - Ingen push/e-post/SMS (invariant I-4)
 */

import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import { timingSafeEqual } from 'crypto';
import { sjekkAlleDealbreakers } from '@/lib/matching/dealbreaker';
import { MIN_COHORT_SIZE, MAX_QUEUE_WAIT_HOURS } from '@/config/matching';

// Advisory lock ID for matching-cron
const MATCHING_CRON_LOCK_ID = 123456789;

// Tidsbudsjett (fra A4 — Hobby-plan)
const TIME_BUDGET_MS = 240_000;

/** Constant-time string comparison */
function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

/** Normalize pair for MatchHistory lookup */
function normalizePair(aId: string, bId: string): [string, string] {
  return aId < bId ? [aId, bId] : [bId, aId];
}

interface Candidate {
  id: string;
  profile: any;
}

interface ScoredPair {
  userIdA: string;
  userIdB: string;
  score: number;
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

  let lockAcquired = false;
  let deferred = false;
  let paired = 0;
  const errors: string[] = [];

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
        include: {
          profile: true,
        },
      });

      const cohortSize = queued.length;

      // 2. Kohort-terskel: under MIN_COHORT_SIZE og ingen >72h → deferer
      const oldestInQueue = queued[0]?.matchQueuedAt ?? null;
      const hasStaleEntries =
        oldestInQueue && Date.now() - oldestInQueue.getTime() > MAX_QUEUE_WAIT_HOURS * 60 * 60 * 1000;

      if (cohortSize < MIN_COHORT_SIZE && !hasStaleEntries) {
        deferred = true;

        await prisma.systemLog.create({
          data: {
            level: 'INFO',
            message: `Matching deferert: ${cohortSize} i kø (<${MIN_COHORT_SIZE}, ingen >72h)`,
            module: 'cron:matching',
            metadata: { deferred: true, queueSize: cohortSize },
          },
        });

        return NextResponse.json({
          ok: true,
          deferred: true,
          queueSize: cohortSize,
          message: `Kun ${cohortSize} i kø — vent på fler før matching`,
        });
      }

      // 3. Hent sperreliste (alle historiske par) for rask oppslag
      const history = await prisma.matchHistory.findMany({
        select: { userAId: true, userBId: true },
      });
      const blockSet = new Set(history.map((h) => normalizePair(h.userAId, h.userBId).join(':')));

      // 4. Score alle par — sjekk dealbreakers + sperreliste
      const pairs: ScoredPair[] = [];
      const candidates: Candidate[] = queued.map((u) => ({
        id: u.id,
        profile: u.profile || null,
      }));

      for (let i = 0; i < candidates.length && Date.now() < deadline; i++) {
        for (let j = i + 1; j < candidates.length; j++) {
          const a = candidates[i];
          const b = candidates[j];

          // Hopp over uten profil
          if (!a.profile || !b.profile) continue;

          // Sperreliste
          const pairKey = normalizePair(a.id, b.id).join(':');
          if (blockSet.has(pairKey)) {
            continue;
          }

          // Dealbreakers (tosidig)
          const abBlocked = sjekkAlleDealbreakers(a.profile, b.profile);
          const baBlocked = sjekkAlleDealbreakers(b.profile, a.profile);
          if (abBlocked || baBlocked) {
            continue;
          }

          // Enkel score basert på profile-overlap
          const baseScore = computeQuickScore(a.profile, b.profile);
          if (baseScore < 0.4) {
            continue; // MIN_SCORE terskel
          }

          pairs.push({ userIdA: a.id, userIdB: b.id, score: baseScore });
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

      // 6. Per par: én transaksjon per match
      for (const pair of matchedPairs) {
        if (Date.now() >= deadline) break;

        try {
          await prisma.$transaction(async (tx) => {
            // Match(active) — ingen pending-status
            const newMatch = await tx.match.create({
              data: {
                userAId: pair.userIdA,
                userBId: pair.userIdB,
                score: Math.round(pair.score * 100),
                normalizedScore: pair.score,
                status: 'active',
                type: 'resonance',
                resonanceLevel: pair.score >= 0.8 ? 'DEEP' : pair.score >= 0.65 ? 'STRONG' : 'MODERATE',
              },
            });

            // Conversation(matchId)
            await tx.conversation.create({
              data: {
                userAId: pair.userIdA,
                userBId: pair.userIdB,
                matchId: newMatch.id,
              },
            });

            // JourneyProgress(matchId, day: 0, bothSeenAt: null) for begge
            await tx.journeyProgress.create({
              data: {
                userId: pair.userIdA,
                matchId: newMatch.id,
                phase: 'EARLY',
                day: 0,
                bothSeenAt: null,
              },
            });

            await tx.journeyProgress.create({
              data: {
                userId: pair.userIdB,
                matchId: newMatch.id,
                phase: 'EARLY',
                day: 0,
                bothSeenAt: null,
              },
            });

            // Notification × 2 (type: MATCH, in-app) — ingen title-felt
            await tx.notification.create({
              data: {
                userId: pair.userIdA,
                type: 'MATCH',
                message: 'Du har en ny kobling. Logg inn og se hvem.',
              },
            });

            await tx.notification.create({
              data: {
                userId: pair.userIdB,
                type: 'MATCH',
                message: 'Du har en ny kobling. Logg inn og se hvem.',
              },
            });

            // User × 2 → journeyState: MATCHED, lastMatchAt: now()
            await tx.user.update({
              where: { id: pair.userIdA },
              data: { journeyState: 'MATCHED', matchQueuedAt: null, lastMatchAt: new Date() },
            });

            await tx.user.update({
              where: { id: pair.userIdB },
              data: { journeyState: 'MATCHED', matchQueuedAt: null, lastMatchAt: new Date() },
            });
          });

          paired++;
        } catch (err) {
          errors.push(`pair ${pair.userIdA}+${pair.userIdB}: ${(err as Error).message}`);
        }
      }

      const remaining = queued.length - used.size;
      const durationMs = Date.now() - startedAt;

      // Heartbeat
      await prisma.systemLog.create({
        data: {
          level: 'INFO',
          message: `Matching-runde: ${paired} par koblet, ${remaining} igjen i kø`,
          module: 'cron:matching',
          metadata: { paired, remaining, durationMs, deferred, queueSize: cohortSize },
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
    return NextResponse.json(
      { error: 'Kunne ikke kjøre matching', details: (err as Error).message },
      { status: 500 }
    );
  } finally {
    // Heartbeat i SystemLog (sikkerhetsnett)
    const durationMs = Date.now() - startedAt;
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

/**
 * computeQuickScore — enkel overlapping-score basert på profilverdier.
 * Foreløpig implementasjon; erstattes av unifiedScore når den er tilgjengelig.
 */
function computeQuickScore(profileA: any, profileB: any): number {
  if (!profileA || !profileB) return 0;

  let score = 0;
  const components: number[] = [];

  // Aldersnærhet (maks 20%)
  if (profileA.age && profileB.age) {
    const ageDiff = Math.abs(profileA.age - profileB.age);
    score += Math.max(0, 1 - ageDiff / 20) * 0.2;
  }

  // Verdier-overlap (maks 30%)
  const valuesA = (profileA.values || []).map((v: any) => String(v).toLowerCase());
  const valuesB = (profileB.values || []).map((v: any) => String(v).toLowerCase());
  if (valuesA.length && valuesB.length) {
    const overlap = valuesA.filter((v: string) => valuesB.includes(v)).length;
    components.push(overlap / Math.max(valuesA.length, valuesB.length));
  }

  // Personlighet-overlap (maks 20%)
  const traitsA = (profileA.personality?.traits || []).map((t: any) => String(t).toLowerCase());
  const traitsB = (profileB.personality?.traits || []).map((t: any) => String(t).toLowerCase());
  if (traitsA.length && traitsB.length) {
    const overlap = traitsA.filter((t: string) => traitsB.includes(t)).length;
    components.push(overlap / Math.max(traitsA.length, traitsB.length));
  }

  // Livsstil-overlap (maks 15%)
  const lifestyleA = (profileA.lifestyle?.activities || []).map((a: any) => String(a).toLowerCase());
  const lifestyleB = (profileB.lifestyle?.activities || []).map((a: any) => String(a).toLowerCase());
  if (lifestyleA.length && lifestyleB.length) {
    const overlap = lifestyleA.filter((a: string) => lifestyleB.includes(a)).length;
    components.push(overlap / Math.max(lifestyleA.length, lifestyleB.length));
  }

  // Maturity-nærhet (maks 15%)
  if (profileA.maturityLevel != null && profileB.maturityLevel != null) {
    const diff = Math.abs(profileA.maturityLevel - profileB.maturityLevel);
    components.push(Math.max(0, 1 - diff / 10));
  }

  // Snitt av komponenter * vekt + base-score
  if (components.length > 0) {
    const avg = components.reduce((sum, c) => sum + c, 0) / components.length;
    score += avg * 0.8;
  }

  return Math.min(1, Math.max(0, score));
}

// Ingen caching for cron-endepunkt
export const dynamic = 'force-dynamic';
export const revalidate = 0;