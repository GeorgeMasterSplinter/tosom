/**
 * POST /api/game/move
 *
 * Gjennomfører et trekk i et aktivt spill. Serveren er fasit —
 * klienten sender kun trekk, aldri tilstand.
 *
 * TTT: { sessionId, cell: number }
 * RPS: { sessionId, choice: 'rock' | 'paper' | 'scissors' }
 *
 * Response: { success, state, winner? } | { error }
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { csrfCheck } from "@/lib/auth/csrf";
import { pgCheck } from "@/lib/rate-limit-pg";
import { makeMove, isGameOver, type TTTState } from "@/lib/games/ticTacToe";
import { submitChoice, isComplete, type RPSState } from "@/lib/games/rps";
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

  const limit = await pgCheck(`game:move:${userId}`, 30, 60);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "For mange trekk. Vent et øyeblikk." },
      { status: 429 },
    );
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body.sessionId !== "string") {
    return NextResponse.json({ error: "sessionId kreves" }, { status: 400 });
  }

  const { sessionId } = body;

  // Hent spilløkten
  const game = await prisma.gameSession.findUnique({
    where: { id: sessionId },
    include: { conversation: { select: { userAId: true, userBId: true } } },
  });

  if (!game || game.status !== "ACTIVE") {
    return NextResponse.json({ error: "Spillet finnes ikke eller er over" }, { status: 404 });
  }

  // Deltakelse
  const isParticipant =
    game.conversation.userAId === userId || game.conversation.userBId === userId;
  if (!isParticipant) {
    return NextResponse.json({ error: "Du deltar ikke i dette spillet" }, { status: 403 });
  }

  // Bestem hvilken spiller dette er
  const player: "A" | "B" =
    game.conversation.userAId === userId ? "A" : "B";

  try {
    if (game.type === "TTT") {
      // ─── Tic-Tac-Toe: sekvensiell ───
      const cell = body.cell;
      if (typeof cell !== "number" || cell < 0 || cell > 8) {
        return NextResponse.json({ error: "cell (0-8) kreves" }, { status: 400 });
      }

      const state = game.state as unknown as TTTState;
      const newState = makeMove(state, cell, player);
      const gameOver = isGameOver(newState);

      await prisma.gameSession.update({
        where: { id: sessionId },
        data: {
          state: newState as object,
          turn: gameOver ? null : game.conversation.userAId === userId ? game.conversation.userBId : game.conversation.userAId,
          winner: gameOver && newState.winner !== "draw"
            ? (newState.winner === "A" ? game.conversation.userAId : game.conversation.userBId)
            : null,
          status: gameOver ? "COMPLETED" : "ACTIVE",
          completedAt: gameOver ? new Date() : undefined,
        },
      });

      // Pusher (best-effort)
      try {
        await triggerGameUpdate(game.conversation.id, {
          sessionId,
          type: game.type,
          state: newState,
          status: gameOver ? "COMPLETED" : "ACTIVE",
          winner: newState.winner,
          turn: gameOver ? null : game.conversation.userAId === userId ? game.conversation.userBId : game.conversation.userAId,
        });
      } catch { /* Pusher-feil blokkerer aldri */ }

      return NextResponse.json({
        success: true,
        state: newState,
        winner: newState.winner,
        gameOver,
      });

    } else {
      // ─── Stein-Saks-Papir: samtidig ───
      const choice = body.choice;
      if (typeof choice !== "string" || !["rock", "paper", "scissors"].includes(choice)) {
        return NextResponse.json(
          { error: "choice (rock/paper/scissors) kreves" },
          { status: 400 },
        );
      }

      const state = game.state as unknown as RPSState;
      const newState = submitChoice(state, player, choice as "rock" | "paper" | "scissors");
      const complete = isComplete(newState);

      await prisma.gameSession.update({
        where: { id: sessionId },
        data: {
          state: newState as object,
          winner: complete && newState.winner !== "draw"
            ? (newState.winner === "A" ? game.conversation.userAId : game.conversation.userBId)
            : null,
          status: complete ? "COMPLETED" : "ACTIVE",
          completedAt: complete ? new Date() : undefined,
        },
      });

      // Pusher (best-effort)
      try {
        await triggerGameUpdate(game.conversation.id, {
          sessionId,
          type: game.type,
          state: newState,
          status: complete ? "COMPLETED" : "ACTIVE",
          winner: newState.winner,
        });
      } catch { /* Pusher-feil blokkerer aldri */ }

      return NextResponse.json({
        success: true,
        state: newState,
        winner: newState.winner,
        gameOver: complete,
      });
    }
  } catch (err: any) {
    // Motorene kaster på ugyldige trekk
    return NextResponse.json({ error: err.message || "Ugyldig trekk" }, { status: 400 });
  }
}