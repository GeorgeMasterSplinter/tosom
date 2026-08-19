/**
 * Tosom Admin Stats API
 * 
 * Hentar sanntidsstatistikk frå databasen for dashboard.
 * Berre tilgjengeleg for admin (krevar admin_token eller session med admin-role).
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { adminAuthGuard } from '@/lib/auth/adminAuthGuard';

export const dynamic = 'force-dynamic';

export async function GET() {
  // B-4 FIX: Bruk kanonisk admin-guard (session + admin-role) — erstatter lokal
  // isAdmin() som sjekket kun at en cookie eksisterte (privilegie-eskalering).
  const denied = await adminAuthGuard();
  if (denied) return denied;

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
      // 1. Totalt antal brukere
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

      // 6. Aktive samtalar (ikke ended)
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

    // Hentar nyaste 5 brukerne
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
      { error: 'Kunne ikke hente statistikk' },
      { status: 500 }
    );
  }
}