/**
 * Tosom — Cron Health Check
 *
 * GET /api/system/cron-health
 * - Returnerer 200 hvis begge cron-jobber har logget innenfor de siste 26 timene
 * - Returnerer 503 med detaljer om hvilken cron som er stille
 * - Krever samme Bearer-auth som cron-rutene
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { timingSafeEqual } from 'crypto';

export const dynamic = 'force-dynamic';

/** Constant-time string comparison */
function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

export async function GET(req: Request) {
  // Valider cron-secret via Authorization-header
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
    const threshold = new Date(Date.now() - 26 * 60 * 60 * 1000); // 26 timer siden

    // Hent siste logg for hver cron-modul
    const [lastMatching, lastJourney] = await Promise.all([
      prisma.systemLog.findFirst({
        where: { module: 'cron:matching', createdAt: { gte: threshold } },
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true, level: true },
      }),
      prisma.systemLog.findFirst({
        where: { module: 'cron:journey', createdAt: { gte: threshold } },
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true, level: true },
      }),
    ]);

    const stale: string[] = [];
    if (!lastMatching) stale.push('cron:matching');
    if (!lastJourney) stale.push('cron:journey');

    if (stale.length > 0) {
      return NextResponse.json(
        {
          ok: false,
          stale,
          last_matching: lastMatching?.createdAt.toISOString() ?? null,
          last_journey: lastJourney?.createdAt.toISOString() ?? null,
          message: `Disse cron-jobbene er stille (>26t): ${stale.join(', ')}`,
        },
        { status: 503 }
      );
    }

    return NextResponse.json({
      ok: true,
      last_matching: lastMatching?.createdAt.toISOString() ?? null,
      last_journey: lastJourney?.createdAt.toISOString() ?? null,
      message: 'Begge cron-jobbene er aktive',
    });
  } catch (err) {
    console.error('[cron-health] Feil:', err);
    return NextResponse.json(
      { error: 'Kunne ikke sjekke cron-helse', details: (err as Error).message },
      { status: 500 }
    );
  }
}