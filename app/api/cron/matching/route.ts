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
import { findBestResonance } from '@/lib/matching/findBestResonance';

export async function GET(req: NextRequest) {
  const startedAt = Date.now();
  
  // Valider cron-secret (query param eller Authorization header)
  const secret = req.nextUrl.searchParams.get('secret') 
    || req.headers.get('authorization')?.replace('Bearer ', '');
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Ugyldig secret' }, { status: 401 });
  }

  try {
    // Hent alle brukarar som treng match:
    // - onboardingComplete + deepProfileComplete ✅
    // - ingen aktiv match (active/matched med expiresAt i framtida)
    
    const eligibleUsers = await prisma.user.findMany({
      where: {
        onboardingComplete: true,
        deepProfileComplete: true,
        bannedAt: null,
        deletedAt: null,
        // Ingen aktiv match — bruk begge relasjonane
        OR: [
          {
            matchesA: {
              none: {
                status: 'active',
                expiresAt: { gte: new Date() },
              },
            },
          },
          {
            matchesB: {
              none: {
                status: 'active',
                expiresAt: { gte: new Date() },
              },
            },
          },
        ],
      },
      select: { id: true },
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
          continue; // Ingen match eller ikkje matchable
        }

        // Opprett match med full resonans-score frå ResonanceResult
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
            status: 'active',
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

        // Opprett journeyProgress for begge brukere (hvis den ikke finnes)
        for (const userId of [user.id, result.candidateId]) {
          await prisma.journeyProgress.upsert({
            where: { userId },
            create: {
              userId,
              phase: 'EARLY',
              day: 1,
            },
            update: {}, // Oppdater ikke hvis den allerede finnes
          }).catch((err) => {
            console.warn(`[cron] Kunne ikke opprette journeyProgress for ${userId}:`, err);
          });
        }

        // Oppdater lastMatchAt (for 24t-regel)
        await prisma.user.update({
          where: { id: user.id },
          data: { lastMatchAt: new Date() },
        });

        created++;
        processed++;
      } catch (engineError) {
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
      { error: 'Kunne ikkje køyre cron matching', details: (err as Error).message },
      { status: 500 }
    );
  }
}

// Ingen caching for cron-endepunkt
export const dynamic = 'force-dynamic';
export const revalidate = 0;
