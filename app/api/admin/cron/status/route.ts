import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth/requireAuth';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/cron/status
 * Returnerer siste 10 cron-kjørsler fra SystemLog.
 */
export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const runs = await prisma.systemLog.findMany({
      where: {
        module: { in: ['cron:matching', 'cron:journey', 'matching-cron', 'journey-cron'] },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        level: true,
        message: true,
        module: true,
        metadata: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ runs });
  } catch (error) {
    console.error('GET /api/admin/cron/status error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
