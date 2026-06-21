/**
 * GET /api/dashboard/overview
 * 
 * Returnerer alt dashboardet treng av ekte data:
 * - matchStatus (no_match | pending | matched)
 * - activeMatch (hvis låst i 30d)
 * - journeyProgress
 * - imageShareStatus
 * - nextMatchTimer
 * - unreadCount
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/requireAuth";

export async function GET(req: NextRequest) {
  try {
    // 1. Auth
    const result = await requireAuth(req);
    if (result instanceof NextResponse) {
      return result;
    }
    const user = result.user;

    // 2. Finn aktiv journey
    const journey = await prisma.journeyProgress.findUnique({
      where: { userId: user.id },
      select: {
        day: true,
        phase: true,
        completedDays: true,
        nextDayAt: true,
        startedAt: true,
        endedAt: true,
      },
    });

    // 3. Finn aktiv conversation/match (låst, 30d)
    const conversation = await prisma.conversation.findFirst({
      where: {
        userAId: user.id,
        userBId: { not: user.id },
        endedAt: null,
      },
      include: {
        userA: { select: { id: true, profile: { select: { identityName: true } } } },
        userB: { select: { id: true, profile: { select: { identityName: true } } } },
        resonanceSessions: { select: { depthLevel: true, emotionalTone: true } },
        imageShareAllowedAt: true,
        unreadCountA: true,
      },
    });

    // 3b. Fix nullable profile — profile kan vere null
    const fixProfile = (c: typeof conversation) => {
      if (!c) return null;
      return {
        ...c,
        userA: c.userA?.profile ? { ...c.userA, profile: c.userA.profile ?? null } : c.userA,
        userB: c.userB?.profile ? { ...c.userB, profile: c.userB.profile ?? null } : c.userB,
      };
    };

    // 4. Finn motpart
    let partner: { id: string; profile: { identityName: string | null } | null } | null = null;
    let isUserA = false;
    if (conversation && conversation.userB?.profile) {
      isUserA = conversation.userAId === user.id;
      partner = isUserA ? conversation.userB : conversation.userA;
    }

    // 5. Beregn resonans (snitt av depthLevel)
    let avgResonance: number | null = null;
    if (conversation && conversation.resonanceSessions && conversation.resonanceSessions.length > 0) {
      const depths = conversation.resonanceSessions.map((s) => s.depthLevel || 0);
      const sum = depths.reduce((a, b) => a + b, 0);
      avgResonance = Math.round(sum / depths.length);
    }

    // 6. Sjekk om neste match er låst (24t) — hent frå DB
    const userRaw = await prisma.user.findUnique({
      where: { id: user.id },
      select: { lastMatchAt: true, lockedUntil: true },
    });

    const lastMatchAt = userRaw?.lastMatchAt ?? null;
    const lockedUntil = userRaw?.lockedUntil ?? null;
    let nextMatchReadyAt: string | null = null;
    let isMatchLocked = false;

    if (lockedUntil && new Date() < lockedUntil) {
      isMatchLocked = true;
      nextMatchReadyAt = lockedUntil.toISOString();
    } else if (lastMatchAt) {
      const elapsed = Date.now() - lastMatchAt.getTime();
      const remaining = 24 * 60 * 60 * 1000 - elapsed;
      if (remaining > 0) {
        nextMatchReadyAt = new Date(Date.now() + remaining).toISOString();
        isMatchLocked = true;
      }
    }

    // 7. Bildesjutt (dag 1-14 = tillat ikkje, dag 14+ = tillat)
    let imageShareStatus: { allowed: boolean; daysRemaining: number } | null = null;
    if (journey) {
      if (journey.completedDays >= 14) {
        imageShareStatus = { allowed: true, daysRemaining: 0 };
      } else {
        imageShareStatus = { allowed: false, daysRemaining: 14 - journey.completedDays };
      }
    }

    // 8. Match-status
    let matchStatus: "no_match" | "pending" | "matched" = "no_match";
    if (conversation && conversation.endedAt === null) {
      matchStatus = "matched";
    } else if (lastMatchAt && !isMatchLocked) {
      matchStatus = "pending";
    }

    // 9. Hent uleste notifikasjonar
    const unreadNotifications = await prisma.notification.count({
      where: { userId: user.id, readAt: null },
    });

    return NextResponse.json({
      matchStatus,
      partner,
      isUserA,
      conversationId: conversation?.id || null,
      resonance: avgResonance,
      imageShareStatus,
      journey: journey
        ? {
            day: journey.day,
            phase: journey.phase,
            completedDays: journey.completedDays,
            nextDayAt: journey.nextDayAt?.toISOString() || null,
            startedAt: journey.startedAt?.toISOString() || null,
            endedAt: journey.endedAt?.toISOString() || null,
          }
        : null,
      nextMatchTimer: isMatchLocked && nextMatchReadyAt
        ? {
            locked: true,
            readyAt: nextMatchReadyAt,
            hoursRemaining: Math.max(0, Math.ceil((new Date(nextMatchReadyAt).getTime() - Date.now()) / (1000 * 60 * 60))),
          }
        : { locked: false, readyAt: null, hoursRemaining: 0 },
      unreadNotifications,
    });
  } catch (error) {
    console.error("GET /api/dashboard/overview error:", error);
    return NextResponse.json(
      { error: "Internt feil ved henting av dashboard-data", internal: true },
      { status: 500 }
    );
  }
}