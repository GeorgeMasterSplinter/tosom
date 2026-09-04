/**
 * POST /api/game/start
 *
 * Starter en ny spilløkt i en samtale. Én aktiv økt per spilltype per samtale.
 * Krever CSRF + autentisering + deltakelse i samtalen.
 *
 * Body: { conversationId: string, type: 'TTT' | 'RPS' }
 * Response: { success: true, sessionId, state } | { error: string }
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { csrfCheck } from "@/lib/auth/csrf";
import { pgCheck } from "@/lib/rate-limit-pg";
import { createGame as createTTT } from "@/lib/games/ticTacToe";
import { createGame as createRPS } from "@/lib/games/rps";
import { triggerGameUpdate } from "@/lib/pusher/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  // CSRF
  const csrf = await csrfCheck(req);
  if (csrf instanceof NextResponse) return csrf;

  // Auth
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Ikke autentisert" }, { status: 401 });
  }
  const userId = session.user.id;

  // Rate limit
  const limit = await pgCheck(`game:start:${userId}`, 10, 60);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "For mange forsøk. Vent et øyeblikk." },
      { status: 429 },
    );
  }

  // Body
  const body = await req.json().catch(() => null);
  if (!body || typeof body.conversationId !== "string" || typeof body.type !== "string") {
    return NextResponse.json(
      { error: "conversationId og type kreves" },
      { status: 400 },
    );
  }

  const { conversationId, type } = body as { conversationId: string; type: string };
  if (type !== "TTT" && type !== "RPS") {
    return NextResponse.json({ error: "Ugyldig spilltype" }, { status: 400 });
  }

  // Deltakelse
  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      OR: [{ userAId: userId }, { userBId: userId }],
    },
    select: { id: true, userAId: true, userBId: true },
  });

  if (!conversation) {
    return NextResponse.json(
      { error: "Du deltar ikke i denne samtalen" },
      { status: 403 },
    );
  }

  // Én aktiv økt per type per samtale — idempotent: join eksisterende
  const existing = await prisma.gameSession.findFirst({
    where: { conversationId, type, status: "ACTIVE" },
  });
  if (existing) {
    // Returner eksisterende spill (join)
    return NextResponse.json({
      success: true,
      sessionId: existing.id,
      state: existing.state,
      turn: existing.turn,
    });
  }

  // Initial state
  const state = type === "TTT" ? createTTT() : createRPS();

  // Opprett økt
  const game = await prisma.gameSession.create({
    data: {
      conversationId,
      type: type as "TTT" | "RPS",
      state: state as object,
      turn: type === "TTT" ? conversation.userAId : null,
      startedBy: userId,
    },
  });

  // Pusher (best-effort)
  try {
    await triggerGameUpdate(conversationId, {
      sessionId: game.id,
      type,
      state,
      status: "ACTIVE",
      turn: game.turn,
    });
  } catch {
    // Pusher-feil blokkerer aldri spillet
  }

  return NextResponse.json({
    success: true,
    sessionId: game.id,
    state,
    turn: game.turn,
  });
}