/**
 * ToSom — Daily Matching Cron-Job (Fase B3)
 * 
 * GET /api/cron/matching
 * - Bruker findBestResonance (full resonans-matching)
 * - Éin match per 24t-regel via User.lastMatchAt + lockedUntil
 * - Oppdaterer lastMatchAt etter match
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { timingSafeEqual } from 'crypto';
import { findBestResonance } from '@/lib/matching/findBestResonance';

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

        // STEG 6.6: try/catch per kandidat, created++ kun ved bekreftet suksess
        const newMatch = await prisma.match.create({
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

        // Opprett conversation for matchen
        await prisma.conversation.create({
          data: {
            userAId: user.id,
            userBId: result.candidateId,
            matchId: newMatch.id,
          },
        }).catch((err) => {
          console.warn(`[cron] Kunne ikke opprette conversation for match ${newMatch.id}:`, err);
        });

        // Oppdater lastMatchAt (for 24t-regel)
        await prisma.user.update({
          where: { id: user.id },
          data: { lastMatchAt: new Date() },
        });

        created++;
        processed++;
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
      { error: 'Kunne ikke køyre cron matching', details: (err as Error).message },
      { status: 500 }
    );
  }
}

// Ingen caching for cron-endepunkt
export const dynamic = 'force-dynamic';
export const revalidate = 0;