// app/api/match/[id]/complete/route.ts — PUT /api/match/:id/complete
// Oppdaterer status på en match: acceptere, avslå eller fullfør.
// Brukes av dashboardet når brukeren aksepterer eller avviste en match.

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
        { success: false, error: "Ugyldig action — må være 'accept', 'reject' eller 'complete'" },
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
        lockedAt: true,
        score: true,
      },
    });

    if (!match) {
      return NextResponse.json(
        { success: false, error: "Match ikke funnet" },
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Sjekk at brukeren er involvert i denne matchen
    if (match.userAId !== userId && match.userBId !== userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized — du er ikke del av denne matchen" },
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    const previousStatus = match.status;

    // Definer tillatte status-overganger
    const transitions: Record<string, Array<string>> = {
      "pending": ["active", "rejected"],
      "active": ["completed", "ended"],
      "rejected": ["reactivated"],
      "completed": [], // endelig status
      "ended": [], // endelig status
      "expired": ["pending"],
    };

    const allowedTransitions = transitions[previousStatus] || [];

    const actionToStatus: Record<string, string> = {
      "accept": "active",
      "reject": "rejected",
      "complete": "completed",
    };

    const newStatus = actionToStatus[action] as "active" | "rejected" | "completed";

    // STEG 5.2 FIX: Fjernet bypass for `action === "complete"` — alle actions må følge status-vakta
    if (!allowedTransitions.includes(newStatus)) {
      return NextResponse.json(
        {
          success: false,
          error: `Kan ikke endre status fra '${previousStatus}' til '${newStatus}'`,
          allowedTransitions,
        },
        { status: 409, headers: { "Content-Type": "application/json" } }
      );
    }

    // STEG 5.2: Betinget updateMany (hinder race conditions)
    const updateResult = await prisma.match.updateMany({
      where: {
        id: matchId,
        status: previousStatus, // Kun oppdater hvis status fortsatt er den vi forventer
      },
      data: {
        status: newStatus as any,
        ...(note ? { rejectionReason: note } : {}),
      },
    });

    if (updateResult.count === 0) {
      return NextResponse.json(
        { success: false, error: "Matchen har endret status — prøv igjen" },
        { status: 409, headers: { "Content-Type": "application/json" } }
      );
    }

    // STEG 5.2: Pakk follow-up operasjoner i transaksjon
    let conversationId: string | null = null;
    let lockedUntil: string | null = null;

    if (action === "accept") {
      await prisma.$transaction(async (tx) => {
        // Opprett conversation knyttet til denne matchen
        const convo = await tx.conversation.create({
          data: {
            userAId: match.userAId,
            userBId: match.userBId,
            matchId: matchId,
          },
          select: { id: true },
        });
        conversationId = convo.id;

        // Lås bruker i 30 dager fra nå av
        const lockedUntilDate = new Date();
        lockedUntilDate.setDate(lockedUntilDate.getDate() + 30);
        lockedUntil = lockedUntilDate.toISOString();

        await tx.user.update({
          where: { id: userId },
          data: { lockedUntil: lockedUntilDate },
        });
      });
    }

    if (action === "complete") {
      await prisma.$transaction(async (tx) => {
        // Merk journey som avsluttet
        await tx.journeyProgress.updateMany({
          where: { userId, endedAt: null, pausedAt: null },
          data: {
            endedAt: new Date(),
            phase: "CHECKIN",
          },
        });

        // Fjern lås
        await tx.user.update({
          where: { id: userId },
          data: { lockedUntil: null },
        });
      });

      await logInfo("Match completed", "match_complete", { matchId, userId });
    }

    if (action === "reject") {
      await logInfo("Match rejected", "match_reject", {
        matchId,
        userId,
        previousStatus,
        note,
      });
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          matchId,
          previousStatus,
          newStatus,
          conversationId,
          lockedUntil,
          message:
            action === "accept"
              ? "Match akseptert — reisen kan starte."
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
 * GET /api/match/:id — hent match detaljer (valgfritt for dashboard)
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
        { success: false, error: "Match ikke funnet" },
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Sjekk at brukeren er involvert i denne matchen
    if (match.userAId !== session.user.id && match.userBId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized — du er ikke del av denne matchen" },
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