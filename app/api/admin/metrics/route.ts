/**
 * ToSom — Admin Metrics API (STEG 4)
 * 
 * GET /api/admin/metrics
 * Returnerer ekte metrics fra database for admin-dashboard.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/requireAuth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  // Auth & RBAC
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    // Hent alle metrics i parallelle for ytelse
    const [
      totalUsers,
      activeUsers,
      onboardingComplete,
      deepProfileComplete,
      totalMatches,
      activeMatches,
      pendingMatches,
      totalConversations,
      activeConversations,
      ongoingJourneys,
      journeyPhaseCounts,
      totalMessages,
      systemErrorsLast24h,
      totalNotifications,
      unreadNotifications,
    ] = await Promise.all([
      // User metrics
      prisma.user.count(),
      prisma.user.count({ where: { bannedAt: null, deletedAt: null } }),
      prisma.user.count({ where: { onboardingComplete: true } }),
      prisma.user.count({ where: { deepProfileComplete: true } }),

      // Match metrics
      prisma.match.count(),
      prisma.match.count({ where: { status: "active" } }),
      prisma.match.count({ where: { status: "active" } }),

      // Conversation metrics
      prisma.conversation.count(),
      prisma.conversation.count({ where: { endedAt: null } }),

      // Journey metrics
      prisma.journeyProgress.count({ where: { endedAt: null } }),
      prisma.journeyProgress.groupBy({
        by: ["phase"],
        where: { endedAt: null },
        _count: true,
      }),

      // Message metrics
      prisma.message.count(),

      // Error metrics (last 24h)
      prisma.systemLog.count({
        where: {
          level: "ERROR",
          createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        },
      }),

      // Notification metrics
      prisma.notification.count(),
      prisma.notification.count({ where: { readAt: null } }),
    ]);

    const now = new Date();

    return NextResponse.json({
      users: {
        total: totalUsers,
        active: activeUsers,
        onboardingComplete,
        deepProfileComplete,
      },
      matches: {
        total: totalMatches,
        active: activeMatches,
        pending: pendingMatches,
      },
      conversations: {
        total: totalConversations,
        active: activeConversations,
      },
      journeys: {
        ongoing: ongoingJourneys,
        phases: journeyPhaseCounts.reduce(
          (acc, p) => {
            acc[p.phase] = p._count;
            return acc;
          },
          {} as Record<string, number>
        ),
      },
      messages: {
        total: totalMessages,
      },
      system: {
        errorsLast24h: systemErrorsLast24h,
        notifications: {
          total: totalNotifications,
          unread: unreadNotifications,
        },
      },
      timestamp: now.toISOString(),
    });
  } catch (error) {
    console.error("[admin/metrics] Feil ved henting av metrics:", error);
    return NextResponse.json(
      { error: "Kunne ikke hente metrics", details: (error as Error).message },
      { status: 500 }
    );
  }
}