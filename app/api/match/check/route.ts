// app/api/match/check/route.ts — POST /api/match/check
// Returner match-status for innlogga bruker utan å opprette ny match.
// Brukast av frontend for å vise om brukaren har ein aktiv/ventande match.

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/auth/session";
import { captureError } from "@/lib/system/errors";
import { logInfo } from "@/lib/system/log";

export const dynamic = 'force-dynamic';

interface MatchCheckResult {
  hasActiveMatch: boolean;
  matchId: string | null;
  status: "no_match" | "pending" | "matched" | "completed";
  conversationId: string | null;
  lockedUntil: string | null;
  nextEligibleAt: string | null;
  daysRemaining: number | null;
}

/**
 * POST /api/match/check
 * 
 * Request body: {} (authentication via session)
 * 
 * Response:
 * {
 *   success: true,
 *   data: MatchCheckResult
 * }
 */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const userId = session.user.id;

    // Hent bruker info
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { lockedUntil: true, onboardingComplete: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Sjekk om bruker har fullført onboarding
    if (!user.onboardingComplete) {
      return NextResponse.json(
        { success: true, data: { hasActiveMatch: false, matchId: null, status: "no_match" as const, conversationId: null, lockedUntil: null, nextEligibleAt: null, daysRemaining: null } },
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // Hent neste match for brukaren (bare nyaste)
    const latestMatch = await prisma.match.findFirst({
      where: {
        OR: [{ userAId: userId }, { userBId: userId }],
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        status: true,
        createdAt: true,
      },
    });

    let result: MatchCheckResult = {
      hasActiveMatch: false,
      matchId: null,
      status: "no_match",
      conversationId: null,
      lockedUntil: null,
      nextEligibleAt: null,
      daysRemaining: null,
    };

    if (latestMatch) {
      result.matchId = latestMatch.id;
      
      const statusStr = String(latestMatch.status);
      
      if (statusStr === "active" || statusStr === "matched") {
        result.status = "matched";
        result.hasActiveMatch = true;
        
        // Finn conversation for denne matchen
        const convo = await prisma.conversation.findFirst({
          where: { matchId: latestMatch.id },
          select: { id: true },
        });
        if (convo) result.conversationId = convo.id;
        
        // Rekn ut dagar att frå journeyProgress
        const jp = await prisma.journeyProgress.findFirst({
          where: { userId },
          select: { day: true, startedAt: true },
        });
        if (jp?.startedAt) {
          const totalDays = 30;
          const elapsed = Math.floor(
            (Date.now() - jp.startedAt.getTime()) / (1000 * 60 * 60 * 24)
          );
          result.daysRemaining = Math.max(0, totalDays - elapsed);
        }
      } else if (statusStr === "expired") {
        result.status = "pending";
        result.hasActiveMatch = false;
        const nextEligible = await prisma.match.findFirst({
          where: {
            OR: [{ userAId: userId }, { userBId: userId }],
          },
          orderBy: { createdAt: "desc" },
          select: { createdAt: true },
        });
        if (nextEligible) {
          const eligibleAt = new Date(nextEligible.createdAt);
          eligibleAt.setHours(eligibleAt.getHours() + 24);
          result.nextEligibleAt = eligibleAt.toISOString();
        }
      } else if (statusStr === "ended" || statusStr === "ended") {
        result.status = "completed";
        result.hasActiveMatch = false;
      } else {
        // pending — default
        result.status = "pending";
        result.hasActiveMatch = false;
      }

      // lockedUntil på Match er ikke alltid reliable — bruk User.lockedUntil i staden
      const userWithLock = await prisma.user.findUnique({
        where: { id: userId },
        select: { lockedUntil: true },
      });
      if (userWithLock?.lockedUntil && userWithLock.lockedUntil > new Date()) {
        result.lockedUntil = userWithLock.lockedUntil.toISOString();
      }
    }

    await logInfo("match/check called", "match_check", { userId, status: result.status });

    return NextResponse.json(
      { success: true, data: result },
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    await captureError(error, { module: "match", message: "POST /api/match/check failed" });
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}