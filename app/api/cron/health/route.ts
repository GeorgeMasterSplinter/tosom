/**
 * STEG A5 — Cron Health Check Endpoint
 *
 * GET /api/cron/health
 * Returns status of cron heartbeats. Used by external monitoring
 * (e.g., Pingdom, UptimeRobot, or a simple cron) to detect missed runs.
 *
 * - 200: OK — last heartbeat within threshold
 * - 503: STALE — last heartbeat older than threshold (alarm condition)
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { timingSafeEqual } from 'crypto';

/** Constant-time string comparison */
function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

export async function GET(req: NextRequest) {
  // Auth via same cron secret — only authorized monitors should query this
  const expectedSecret = process.env.CRON_SECRET;
  if (!expectedSecret) {
    return NextResponse.json({ error: 'Cron misconfigured' }, { status: 500 });
  }

  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const providedSecret = authHeader.slice(7);
  if (!safeCompare(providedSecret, expectedSecret)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Threshold: 30 minutes (configurable via query param for testing)
  const thresholdMinutes = parseInt(
    req.nextUrl.searchParams.get('threshold') || '30',
    10
  );
  const thresholdMs = thresholdMinutes * 60 * 1000;
  const cutoff = new Date(Date.now() - thresholdMs);

  try {
    // Check matching cron heartbeat
    const matchingLog = await prisma.systemLog.findFirst({
      where: {
        module: 'cron:matching',
        createdAt: { gte: cutoff },
      },
      orderBy: { createdAt: 'desc' },
      take: 1,
    });

    // Check journey cron heartbeat
    const journeyLog = await prisma.systemLog.findFirst({
      where: {
        module: 'cron:journey',
        createdAt: { gte: cutoff },
      },
      orderBy: { createdAt: 'desc' },
      take: 1,
    });

    // Find the most recent heartbeats for reporting
    const lastMatching = await prisma.systemLog.findFirst({
      where: { module: 'cron:matching' },
      orderBy: { createdAt: 'desc' },
      take: 1,
    });

    const lastJourney = await prisma.systemLog.findFirst({
      where: { module: 'cron:journey' },
      orderBy: { createdAt: 'desc' },
      take: 1,
    });

    const matchingOk = matchingLog !== null;
    const journeyOk = journeyLog !== null;
    const allOk = matchingOk && journeyOk;

    return NextResponse.json(
      {
        ok: allOk,
        matching: {
          heartbeatRecent: matchingOk,
          lastRun: lastMatching?.createdAt.toISOString(),
        },
        journey: {
          heartbeatRecent: journeyOk,
          lastRun: lastJourney?.createdAt.toISOString(),
        },
        thresholdMinutes,
      },
      { status: allOk ? 200 : 503 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: 'Health check failed', details: (err as Error).message },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;