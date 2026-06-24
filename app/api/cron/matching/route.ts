/**
 * ToSom — Daily Matching Cron-Job
 * 
 * GET /api/cron/matching
 * - Køyrs matching for alle brukarar utan aktiv match
 * - Kan kallast av Vercel Cron eller server-cron
 * 
 * Cron-config (vercel.json):
 * {
 *   "crons": [
 *     {
 *       "path": "/api/cron/matching",
 *       "schedule": "0 0 * * *"
 *     }
 *   ]
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { findBestMatchFor } from '@/lib/matching/findBestMatchFor';

export async function GET(req: NextRequest) {
  try {
    // Valider cron-secret (for å hindre uautorisert tilgang)
    const secret = req.nextUrl.searchParams.get('secret');
    if (secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: 'Ugyldig secret' }, { status: 401 });
    }

    const startedAt = Date.now();
    let processed = 0;
    let created = 0;

    // Hent alle brukarar utan aktiv match
    const usersWithoutMatch = await prisma.user.findMany({
      where: {
        onboardingComplete: true,
        deepProfileComplete: true,
        bannedAt: null,
        deletedAt: null,
        lockedUntil: null, // ingen aktiv lås
      },
      include: {
        profile: true,
        matches: {
          where: {
            status: { in: ['active', 'matched'] },
            expiresAt: { gte: new Date() },
          },
        },
      },
    });

    for (const user of usersWithoutMatch) {
      // Hopp over hvis allereie har aktiv match
      if ((user.matches as any).length > 0) continue;

      // Hent andre brukarar med profil
      const candidates = await prisma.user.findMany({
        where: {
          id: { not: user.id },
          onboardingComplete: true,
          deepProfileComplete: true,
          bannedAt: null,
          deletedAt: null,
          lockedUntil: null,
        },
        include: { profile: true },
      });

      if (candidates.length === 0) continue;

      // Bruk den nye matchingEngine via findBestMatchFor
      // Merk: Cron-jobben lagar ein forenkla match utan full profil-mapping
      // TODO: Refaktorér cron-jobben til å bruke matchingEngine direkte når profiler er tilgjengelege
      let bestMatch: any = null;
      let bestScore = 0;

      for (const candidate of candidates) {
        if (!user.profile || !candidate.profile) continue;
        
        // Forenkla score basert på felles felt (berre ein provisorisk løysing for cron)
        const userP = user.profile as any;
        const candP = candidate.profile as any;
        
        let score = 0;
        
        // Same lifeRhythm
        if (userP.lifeRhythm && candP.lifeRhythm && userP.lifeRhythm === candP.lifeRhythm) score += 20;
        
        // Maturity gap <= 2
        if (userP.maturityLevel && candP.maturityLevel && Math.abs(userP.maturityLevel - candP.maturityLevel) <= 2) score += 15;
        
        // Similar age range
        if (userP.age && candP.age && Math.abs(Number(userP.age) - Number(candP.age)) <= 5) score += 10;
        
        // Shared interests
        const userInterests = new Set(userP.interests || []);
        const candInterests = new Set(candP.interests || []);
        const shared = [...userInterests].filter(i => candInterests.has(i));
        score += Math.min(shared.length * 5, 15);

        if (score > bestScore) {
          bestScore = score;
          bestMatch = candidate;
        }
      }

      // Lagre match hvis god nok score (> 40 for cron)
      if (bestMatch && bestScore >= 40) {
        await prisma.match.create({
          data: {
            userAId: user.id,
            userBId: bestMatch.id,
            score: bestScore,
            normalizedScore: bestScore / 100,
            type: bestScore >= 70 ? 'high' : bestScore >= 50 ? 'medium' : 'low',
            explanation: { score: bestScore, _auto: true, _cron: true },
            status: 'active',
          },
        });
        created++;
      }

      processed++;
    }

    const duration = Date.now() - startedAt;

    return NextResponse.json({
      ok: true,
      processed,
      created,
      duration: `${duration}ms`,
      message: `Prosessert ${processed} brukarar, oppretta ${created} nye matcher`,
    });
  } catch (err) {
    console.error('Cron matching feil:', err);
    return NextResponse.json({ error: 'Kunne ikkje køyre cron matching' }, { status: 500 });
  }
}

// Vercel Cron konfigurasjon
export const dynamic = 'force-dynamic';
export const revalidate = 0;