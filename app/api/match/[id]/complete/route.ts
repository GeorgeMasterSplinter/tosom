// app/api/match/[id]/complete/route.ts — PUT /api/match/:id/complete
// Oppdaterer status på ein match: acceptere, avslå eller fullfør.
// Brukast av dashboardet når brukaren aksepterer eller avvistar ein match.

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/auth/session";
import { captureError } from "@/lib/system/errors";
import { logInfo } from "@/lib/system/log";

export const dynamic = 'force-dynamic';

/**
 * PUT /api/match/:id/complete
 *
 * Request params:
 *   id: string (from route)
 *
 * Request body:
 * {
 *   action: "accept" | "reject" | "complete",
 *   note?: string (optional note for reject/complete)
 * }
 *
 * Response:
 * {
 *   success: true,
 *   data: {
 *     matchId: string,
 *     previousStatus: string,
 *     newStatus: string,
 *     conversationId: string | null,
 *     lockedUntil: string | null,
 *     message: string
 *   }
 * }
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const userId = session.user.id;
    const { id: matchId } = await params;

    // Hent request body
    let body: { action: "accept" | "reject" | "complete"; note?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Ugyldig forespørsel — manglende body" },
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { action, note } = body;

    if (!["accept", "reject", "complete"].includes(action)) {
      return NextResponse.json(
        { success: false, error: "Ugyldig action — må vere 'accept', 'reject' eller 'complete'" },
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Hent match og verifiser eierskap
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      select: {
        id: true,
        userAId: true,
        userBId: true,
        status: true,
        lockedUntil: true,
        score: true,
      },
    });

    if (!match) {
      return NextResponse.json(
        { success: false, error: "Match ikkje funnen" },
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Sjekk at brukaren er involvert i denne matchen
    if (match.userAId !== userId && match.userBId !== userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized — du er ikkje del av denne matchen" },
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    const previousStatus = match.status;

    // Definer tillatne status-overgangar
    const transitions: Record<string, Array<string>> = {
      "pending": ["active", "rejected"],
      "active": ["completed", "ended"],
      "rejected": ["reactivated"],
      "completed": [], // endeleg status
      "ended": [], // endeleg status
      "expired": ["pending"],
    };

    const allowedTransitions = transitions[previousStatus] || [];

    const actionToStatus: Record<string, string> = {
      "accept": "active",
      "reject": "rejected",
      "complete": "completed",
    };

    // Map action → MatchStatus enum string (Prisma expects lowercase enum values)
    const newStatus = actionToStatus[action] as "active" | "rejected" | "completed";

    if (!allowedTransitions.includes(newStatus) && previousStatus !== "pending" && action !== "complete") {
      return NextResponse.json(
        {
          success: false,
          error: `Kan ikkje endre status frå '${previousStatus}' til '${newStatus}'`,
          allowedTransitions,
        },
        { status: 409, headers: { "Content-Type": "application/json" } }
      );
    }

    // Oppdater match-status
    const updatedMatch = await prisma.match.update({
      where: { id: matchId },
      data: {
        status: newStatus as any,
        ...(note ? { rejectionReason: note } : {}),
      },
      select: {
        id: true,
        status: true,
        lockedUntil: true,
      },
    });

    // Hvis action er "accept" — opprett conversation + journey
    let conversationId: string | null = null;
    let lockedUntil: string | null = null;

    if (action === "accept") {
      // Opprett conversation knytt til denne matchen
      const convo = await prisma.conversation.create({
        data: {
          userAId: match.userAId,
          userBId: match.userBId,
          matchId: matchId,
        },
        select: { id: true },
      });
      conversationId = convo.id;

      // Opprett eller finn journeyProgress og sett til aktiv
      const existingJP = await prisma.journeyProgress.findUnique({
        where: { userId },
        select: { id: true, endedAt: true, pausedAt: true },
      });

      if (!existingJP || (existingJP.endedAt === null && existingJP.pausedAt === null)) {
        // Sett eller oppdater journeyProgress
        if (existingJP?.id) {
          await prisma.journeyProgress.update({
            where: { id: existingJP.id },
            data: {
              day: 1,
              phase: "EARLY",
              startedAt: new Date(),
              endedAt: null,
              pausedAt: null,
            },
          });
        } else {
          await prisma.journeyProgress.create({
            data: {
              userId,
              day: 1,
              phase: "EARLY",
              startedAt: new Date(),
            },
          });
        }
      }

      // Lås brukar i 30 dagar frå no av
      const lockedUntilDate = new Date();
      lockedUntilDate.setDate(lockedUntilDate.getDate() + 30);
      lockedUntil = lockedUntilDate.toISOString();

      await prisma.user.update({
        where: { id: userId },
        data: { lockedUntil: lockedUntilDate },
      });
    }

    // Hvis action er "reject" — logg hendinga
    if (action === "reject") {
      await logInfo("Match rejected", "match_reject", {
        matchId,
        userId,
        previousStatus,
        note,
      });
    }

    if (action === "complete") {
      // Merk journey som avslutta (CHECKIN er siste gyldige phase før "COMPLETED", men bruk CHECKIN her)
      await prisma.journeyProgress.updateMany({
        where: { userId, endedAt: null, pausedAt: null },
        data: {
          endedAt: new Date(),
          phase: "CHECKIN",
        },
      });

      // Fjern lås
      await prisma.user.update({
        where: { id: userId },
        data: { lockedUntil: null },
      });

      await logInfo("Match completed", "match_complete", { matchId, userId });
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          matchId: updatedMatch.id,
          previousStatus,
          newStatus: updatedMatch.status,
          conversationId,
          lockedUntil,
          message:
            action === "accept"
              ? "Match akseptert — reisa kan starte."
              : action === "reject"
              ? "Match avvist."
              : "Match fullført.",
        },
      },
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    await captureError(error, {
      module: "match",
      message: `PUT /api/match/:id/complete failed — matchId: ${(params as any)?.id || "unknown"}`,
    });
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

/**
 * GET /api/match/:id — hent match detaljar (valfritt for dashboard)
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const { id: matchId } = await params;

    const match = await prisma.match.findUnique({
      where: { id: matchId },
      select: {
        id: true,
        userAId: true,
        userBId: true,
        status: true,
        score: true,
        normalizedScore: true,
        scoringBreakdown: true,
        resonanceLevel: true,
        createdAt: true,
        updatedAt: true,
        userA: { select: { id: true, profile: { select: { identityName: true, age: true, photoUrl: true } } } },
        userB: { select: { id: true, profile: { select: { identityName: true, age: true, photoUrl: true } } } },
      },
    });

    if (!match) {
      return NextResponse.json(
        { success: false, error: "Match ikkje funnen" },
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Sjekk at brukaren er involvert i denne matchen
    if (match.userAId !== session.user.id && match.userBId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized — du er ikkje del av denne matchen" },
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    return NextResponse.json(
      { success: true, data: match },
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    await captureError(error, {
      module: "match",
      message: `GET /api/match/:id failed`,
    });
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}