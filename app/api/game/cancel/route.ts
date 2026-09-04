/**
 * POST /api/game/cancel
 *
 * Avbryter et aktivt spill (setter status til COMPLETED).
 * Begge parter kan avbryte.
 *
 * Body: { sessionId: string }
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { csrfCheck } from "@/lib/auth/csrf";
import { pgCheck } from "@/lib/rate-limit-pg";
import { triggerGameUpdate } from "@/lib/pusher/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const csrf = await csrfCheck(req);
  if (csrf instanceof NextResponse) return csrf;

  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Ikke autentisert" }, { status: 401 });
  }
  const userId = session.user.id;

  const limit = await pgCheck(`game:cancel:${userId}`, 5, 60);
  if (!limit.ok) {
    return NextResponse.json({ error: "For mange forsøk. Vent." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body.sessionId !== "string") {
    return NextResponse.json({ error: "sessionId kreves" }, { status: 400 });
  }

  const game = await prisma.gameSession.findUnique({
    where: { id: body.sessionId },
    include: { conversation: { select: { userAId: true, userBId: true } } },
  });

  if (!game || game.status !== "ACTIVE") {
    return NextResponse.json({ error: "Spillet finnes ikke eller er allerede over" }, { status: 404 });
  }

  const isParticipant =
    game.conversation.userAId === userId || game.conversation.userBId === userId;
  if (!isParticipant) {
    return NextResponse.json({ error: "Du deltar ikke i dette spillet" }, { status: 403 });
  }

  const state = game.state as any;
  const updated = await prisma.gameSession.update({
    where: { id: game.id },
    data: { status: "COMPLETED", completedAt: new Date() },
  });

  try {
    await triggerGameUpdate(game.conversationId, {
      sessionId: game.id,
      type: game.type,
      state,
      status: "COMPLETED",
      winner: null,
    });
  } catch { /* best-effort */ }

  return NextResponse.json({ success: true });
}