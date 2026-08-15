/**
 * GET /api/journey/status
 *
 * Returnerer brukerens reisetilstand: journeyState, dag, fase og eventuel conversationId.
 * Bruk av: app/dashboard/page.tsx:126
 *
 * Krav fra ACT v6 steg 2.1 Del A:
 * - Bruker uten aktiv reise gir 200 med tom tilstand (ikke 404)
 * - Returnerer journeyState, dag, fase, og eventuell conversationId
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/requireAuth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const result = await requireAuth(req);
    if (result instanceof NextResponse) return result;
    const userId = result.user.id;

    // Hent brukeren for journeyState
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { journeyState: true },
    });

    const journeyState = user?.journeyState ?? "IDLE";

    // Hent journeyProgress hvis den finnes
    const journey = await prisma.journeyProgress.findFirst({
      where: { userId },
      select: {
        day: true,
        phase: true,
        completedDays: true,
        matchId: true,
      },
    });

    // Finn conversationId via aktiv match
    let conversationId: string | null = null;
    if (journey?.matchId) {
      const conversation = await prisma.conversation.findFirst({
        where: { matchId: journey.matchId, endedAt: null },
        select: { id: true },
      });
      conversationId = conversation?.id ?? null;
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          journeyState,
          day: journey?.day ?? 0,
          phase: journey?.phase ?? null,
          completedDays: journey?.completedDays ?? 0,
          conversationId,
        },
      },
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("GET /api/journey/status error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}