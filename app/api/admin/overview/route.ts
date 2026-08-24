/**
 * Tosom — Admin Overview API (B5.2)
 * 
 * GET /api/admin/overview
 * 
 * Étt API-kall for alle 8 statusindikatorer til admin-oversiktssiden.
 * Bruker singleton Prisma (ikke new PrismaClient).
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth/requireAuth';
import { withMetrics } from '@/lib/observability/withMetrics';

export const dynamic = 'force-dynamic';

async function getHandler(req: NextRequest) {
  try {
    const authResult = await requireAdmin(req);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    // 1. Siste matcherunde — fra SystemLog (module = 'cron:matching')
    const lastMatchLog = await prisma.systemLog.findFirst({
      where: { module: 'cron:matching' },
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true, metadata: true },
    });

    const hoursSinceLastRound = lastMatchLog
      ? (Date.now() - lastMatchLog.createdAt.getTime()) / (1000 * 60 * 60)
      : null;

    const lastRoundDuration = (lastMatchLog?.metadata as any)?.durationMs ?? null;

    // 2. Kø-størrelse — brukere med journeyState = QUEUED
    const queueSize = await prisma.user.count({
      where: { journeyState: 'QUEUED', bannedAt: null, deletedAt: null },
    });

    // 3. Åpne rapporter
    const openReports = await prisma.report.count({
      where: { status: 'OPEN' },
    });

    // 4. Gratiskvote — Order med freeQuota = true og status = PAID
    const freeQuotaUsed = await prisma.order.count({
      where: { freeQuota: true, status: 'PAID' },
    });

    // 4b. Reiser som venter på fremrykk — samme definisjon som journey-cron
    // (endedAt/pausedAt null, reisen startet, nextDayAt passert).
    const pendingJourneys = await prisma.journeyProgress.count({
      where: {
        endedAt: null,
        pausedAt: null,
        bothSeenAt: { not: null },
        nextDayAt: { lte: new Date() },
      },
    });

    // 5. Aktive matcher og reiser
    const activeMatches = await prisma.match.count({
      where: { status: 'active' },
    });

    const ongoingJourneys = await prisma.journeyProgress.count({
      where: { endedAt: null, bothSeenAt: { not: null } },
    });

    // 6. Feil siste 24 timer (SystemLog level = ERROR)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const errorsLast24h = await prisma.systemLog.count({
      where: { level: 'ERROR', createdAt: { gte: oneDayAgo } },
    });

    // 7. JourneyStat — fullførte reiser per outcome
    const journeyStats = await prisma.journeyStat.groupBy({
      by: ['outcome'],
      _count: true,
    });

    // 8. Totalt antall brukere
    const totalUsers = await prisma.user.count({
      where: { deletedAt: null },
    });

    return NextResponse.json({
      indicators: {
        lastMatchRound: {
          hoursSince: hoursSinceLastRound,
          lastAt: lastMatchLog?.createdAt?.toISOString() ?? null,
          durationMs: lastRoundDuration,
        },
        queueSize,
        openReports,
        freeQuotaUsed,
        pendingJourneys,
        errorsLast24h,
      },
      counts: {
        totalUsers,
        activeMatches,
        ongoingJourneys,
      },
      journeyStats: journeyStats.map((s) => ({
        outcome: s.outcome,
        count: s._count,
      })),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[admin/overview] Feil:', error);
    return NextResponse.json(
      { error: 'Kunne ikke hente oversikt' },
      { status: 500 }
    );
  }
}

export const GET = withMetrics('/api/admin/overview', getHandler);
