/**
 * ToSom — Daily Matching Cron-Job (Fase B3)
 * 
 * GET /api/cron/matching
 * - Bruker findBestResonance (full resonans-matching)
 * - Éin match per 24t-regel via User.lastMatchAt + lockedUntil
 * - Oppdaterer lastMatchAt etter match
 */

import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { timingSafeEqual } from 'crypto';
import { findBestResonance } from '@/lib/matching/findBestResonance';

// STEG 6.4: Fast advisory lock ID for matching-cron (forskjellig fra journey-cron)
const MATCHING_CRON_LOCK_ID = 123456789;

/** Constant-time string comparison */
function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

export async function GET(req: NextRequest) {
  const startedAt = Date.now();

  // Valider cron-secret via Authorization-header (ikke query-param) med timing-safe sammenligning
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

  try {
    // STEG 6.4: Ta advisory lock for å hindre overlappende cron-kjøringer
    const lockResult = await prisma.$queryRaw(
      Prisma.sql`SELECT pg_try_advisory_lock(${MATCHING_CRON_LOCK_ID}) AS locked`
    );

    const result = Array.isArray(lockResult) ? (lockResult as any)[0] : (lockResult as any);
    if (result && result.locked) {
      lockAcquired = true;
    } else {
      return NextResponse.json({
        ok: true,
        skipped: true,
        message: 'Matching-cron er allerede i kjøring (advisory lock tatt)',
      });
    }

    try {
      // STEG 6.1 FIX: Byttet OR→AND i eligibility-filteret.
      // Med OR kunne en bruker bli matchet hvis EITHER matchesA eller matchesB var fri,
      // selv om den andre siden hadde aktiv match. Med AND må brukeren være fri på BEGGE sider.
      // STEG 6.2: Legg til take-grense for å begrense sekvensiell loop.
      const eligibleUsers = await prisma.user.findMany({
        where: {
          onboardingComplete: true,
          deepProfileComplete: true,
          bannedAt: null,
          deletedAt: null,
          // Ikke låst (lockedUntil er null eller har utløpt)
          OR: [
            { lockedUntil: null },
            { lockedUntil: { lte: new Date() } },
            // Eller ikke matchet de siste 24 timene
            { lastMatchAt: null },
            { lastMatchAt: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
          ],
          // Ingen aktiv match — må være fri på BEGGE sider (AND-logikk via to separate none-klausuler)
          AND: [
            {
              matchesA: {
                none: {
                  status: { in: ['active', 'matched'] },
                  expiresAt: { gte: new Date() },
                },
              },
            },
            {
              matchesB: {
                none: {
                  status: { in: ['active', 'matched'] },
                  expiresAt: { gte: new Date() },
                },
              },
            },
          ],
        },
        select: { id: true },
        take: 50, // STEG 6.2: Begrens antall kandidater per cron-kjøring
      });

      let processed = 0;
      let created = 0;
      const errors: string[] = [];

      for (const user of eligibleUsers) {
        // Bruk findBestResonance (har innebygd lastMatchAt + lockedUntil-logikk)
        try {
          const result = await findBestResonance({ userId: user.id });

          if (!result) {
            processed++;
            continue; // Ingen match eller ikke matchable
          }

          // STEG 6.6: Pakk match+conversation+lastMatchAt inn i transaksjon
          try {
            await prisma.$transaction(async (tx) => {
              const newMatch = await tx.match.create({
                data: {
                  userAId: user.id,
                  userBId: result.candidateId,
                  score: Math.round(result.match.resonanceScore),
                  normalizedScore: result.match.resonanceScore / 100,
                  type: result.match.resonanceScore >= 70 ? 'high'
                    : result.match.resonanceScore >= 50 ? 'medium'
                    : 'low',
                  explanation: {
                    score: Math.round(result.match.resonanceScore),
                    resonanceLevel: result.match.resonanceLevel,
                  },
                  scoringBreakdown: {
                    values: result.match.breakdown.values ?? 0,
                    personality: result.match.breakdown.personality ?? 0,
                    relationshipStyle: result.match.breakdown.relationshipStyle ?? 0,
                    communication: result.match.breakdown.communication ?? 0,
                    futureVision: result.match.breakdown.futureVision ?? 0,
                    boundaries: result.match.breakdown.boundaries ?? 0,
                    emotionalNeeds: result.match.breakdown.emotionalNeeds ?? 0,
                    lifeRhythm: result.match.breakdown.lifeRhythm ?? 0,
                    maturity: result.match.breakdown.maturity ?? 0,
                  },
                  resonanceLevel: result.match.resonanceLevel as any,
                  status: 'pending',
                },
              });

              // Opprett conversation for matchen (innenfor samme transaksjon)
              await tx.conversation.create({
                data: {
                  userAId: user.id,
                  userBId: result.candidateId,
                  matchId: newMatch.id,
                },
              });

              // Oppdater lastMatchAt (for 24t-regel)
              await tx.user.update({
                where: { id: user.id },
                data: { lastMatchAt: new Date() },
              });
            });

            created++;
            processed++;
          } catch (txError) {
            // Transaksjonen feilet — rollback automatisk, ikke tell som opprettet
            console.error(`[cron] Transaksjon feilet for user ${user.id}:`, txError);
            errors.push(`user ${user.id}: ${(txError as Error).message}`);
            processed++;
          }
        } catch (engineError) {
          // STEG 6.6: Logg feilen Uten å telle den som opprettet
          console.error(`[cron] findBestResonance feil for user ${user.id}:`, engineError);
          errors.push(`user ${user.id}: ${(engineError as Error).message}`);
          processed++;
        }
      }

      const duration = Date.now() - startedAt;

      // Logg til SystemLog
      if (created > 0) {
        await prisma.systemLog.create({
          data: {
            level: 'INFO',
            message: `Cron matching: ${created} nye matcher for ${processed} brukarar`,
            module: 'cron/matching',
            metadata: { processed, created, duration, errors: errors.slice(0, 10) },
          },
        });
      }

      return NextResponse.json({
        ok: true,
        processed,
        created,
        duration: `${duration}ms`,
        message: `Prosessert ${processed} brukarar, oppretta ${created} nye matcher`,
        errors: errors.length > 0 ? errors.slice(0, 5) : undefined,
      });
    } finally {
      // Rydd opp advisory lock når vi er ferdig
      if (lockAcquired) {
        await prisma.$queryRaw(
          Prisma.sql`SELECT pg_advisory_unlock(${MATCHING_CRON_LOCK_ID})`
        );
      }
    }
  } catch (err) {
    console.error('[cron] Matching feil:', err);

    await prisma.systemLog.create({
      data: {
        level: 'ERROR',
        message: `Cron matching feil: ${(err as Error).message}`,
        module: 'cron/matching',
        metadata: {},
      },
    });

    return NextResponse.json(
      { error: 'Kunne ikke kjøre cron matching', details: (err as Error).message },
      { status: 500 }
    );
  }
}

// Ingen caching for cron-endepunkt
export const dynamic = 'force-dynamic';
export const revalidate = 0;