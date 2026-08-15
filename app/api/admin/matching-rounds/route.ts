/**
 * ToSom — Admin Matching Rounds API (B5.4)
 * 
 * GET /api/admin/matching-rounds
 * 
 * Matcherunde-historikk fra SystemLog (module = 'cron:matching').
 * Scorefordeling, dealbreaker-avslag, varighet.
 * Eneste måte å justere matchevektene.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth/requireAuth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAdmin(req);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    // Hent siste 20 matcherunder fra SystemLog
    const logs = await prisma.systemLog.findMany({
      where: { module: 'cron:matching' },
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: { createdAt: true, message: true, metadata: true },
    });

    const rounds = logs.map((log) => {
      const meta = (log.metadata ?? {}) as Record<string, unknown>;
      return {
        at: log.createdAt.toISOString(),
        paired: (meta.paired as number) ?? 0,
        queueSize: (meta.queueSize as number) ?? 0,
        remaining: (meta.remaining as number) ?? 0,
        durationMs: (meta.durationMs as number) ?? null,
        deferred: (meta.deferred as boolean) ?? false,
        skipped: (meta.skipped as boolean) ?? false,
        reason: (meta.reason as string) ?? null,
      };
    });

    // Hent scorefordeling fra aktive matcher (siste 7 dager)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentMatches = await prisma.match.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: { score: true, resonanceLevel: true },
    });

    // Scorefordeling som histogram (10-poengs intervaller)
    const scoreHistogram: Record<string, number> = {};
    for (const m of recentMatches) {
      const bucket = `${Math.floor(m.score / 10) * 10}-${Math.floor(m.score / 10) * 10 + 9}`;
      scoreHistogram[bucket] = (scoreHistogram[bucket] ?? 0) + 1;
    }

    // Resonansnivå-fordeling
    const resonanceDistribution: Record<string, number> = {};
    for (const m of recentMatches) {
      resonanceDistribution[m.resonanceLevel] = (resonanceDistribution[m.resonanceLevel] ?? 0) + 1;
    }

    return NextResponse.json({
      rounds,
      scoreHistogram,
      resonanceDistribution,
      totalRecentMatches: recentMatches.length,
    });
  } catch (error) {
    console.error('[admin/matching-rounds] Feil:', error);
    return NextResponse.json(
      { error: 'Kunne ikke hente matcherunder' },
      { status: 500 }
    );
  }
}