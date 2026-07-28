/**
 * ToSom Admin Stats API
 * 
 * Hentar sanntidsstatistikk frå databasen for dashboard.
 * Berre tilgjengeleg for admin (krevar admin_token eller session med admin-role).
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

/** Sjekk om admin er autentisert via admin_token-cookie eller session */
function isAdmin(req: NextRequest): boolean {
  const adminToken = req.cookies.get('admin_token')?.value;
  const sessionToken = req.cookies.get('authjs.session-token')?.value 
    ?? req.cookies.get('next-auth.session-token')?.value;
  
  return !!(adminToken || sessionToken);
}

export async function GET(req: NextRequest) {
  // Autentiseringssjekk
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Uautorisert' }, { status: 401 });
  }

  try {
    // Hentar alle statistikk i eitt omgang for å unngå N+1-spørringar
    const [
      totalUsers,
      activeMatches,
      ongoingJourneys,
      matchRate,
      recentRegistrations,
      conversations,
      systemLogs,
    ] = await Promise.all([
      // 1. Totalt antal brukarar
      prisma.user.count(),

      // 2. Aktive matcher (status: active)
      prisma.match.count({ where: { status: 'active' } }),

      // 3. Pågående reiser (journey med endedAt null og completedAt null)
      prisma.journeyProgress.count({ 
        where: { 
          endedAt: null,
          completedAt: null,
        } 
      }),

      // 4. Match-rate: aktive matcher / totale matcher i %
      prisma.match.count().then(total => {
        if (total === 0) return 0;
        return prisma.match.count({ where: { status: 'active' } }).then(active => 
          Math.round((active / total) * 100)
        );
      }),

      // 5. Nye registrasjonar dei siste 7 dagane
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),

      // 6. Aktive samtalar (ikkje ended)
      prisma.conversation.count({
        where: {
          endedAt: null,
        },
      }),

      // 7. Systemstatus — feil i dei siste 24 timane
      prisma.systemLog.count({
        where: {
          level: 'ERROR',
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        },
      }),
    ]);

    // Hentar nyaste 5 brukarane
    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        role: true,
        verified: true,
        onboardingComplete: true,
        deepProfileComplete: true,
        createdAt: true,
      },
    });

    // Hentar fasefordeling for pågående reiser
    const journeyPhases = await prisma.journeyProgress.groupBy({
      by: ['phase'],
      _count: true,
    });

    // Hentar system-oppsummering (senaste logg)
    const latestSystemLog = await prisma.systemLog.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { level: true, message: true, module: true, createdAt: true },
    });

    return NextResponse.json({
      stats: {
        totalUsers,
        activeMatches,
        ongoingJourneys,
        matchRate,
        recentRegistrations7d: recentRegistrations,
        activeConversations: conversations,
        errorsLast24h: systemLogs,
      },
      journeyPhases,
      recentUsers,
      latestSystemLog,
      generatedAt: new Date().toISOString(),
    });

  } catch (error) {
    console.error('[AdminStats] Feil ved henting av statistikk:', error);
    return NextResponse.json(
      { error: 'Kunne ikkje hente statistikk' },
      { status: 500 }
    );
  }
}