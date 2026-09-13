/**
 * Tosom Admin Stats API
 * 
 * Henter sanntidsstatistikk fra databasen for dashboard.
 * Kun tilgjengelig for admin (krever admin_token eller session med admin-role).
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth/requireAuth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  // B-4 FIX: Bruk kanonisk admin-guard (session + admin-role) — erstatter lokal
  // isAdmin() som sjekket kun at en cookie eksisterte (privilegie-eskalering).
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) return auth;

  try {
    // Henter all statistikk i ett omgang for å unngå N+1-spørringer
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

      // 5. Nye registreringer de siste 7 dagene
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),

      // 6. Aktive samtaler (ikke ended)
      prisma.conversation.count({
        where: {
          endedAt: null,
        },
      }),

      // 7. Systemstatus — feil i de siste 24 timer
      prisma.systemLog.count({
        where: {
          level: 'ERROR',
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        },
      }),
    ]);

    // Henter de 5 nyeste brukerne
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

    // Henter fasefordeling for pågående reiser
    const journeyPhases = await prisma.journeyProgress.groupBy({
      by: ['phase'],
      _count: true,
    });

    // Henter system-oppsummering (senaste logg)
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