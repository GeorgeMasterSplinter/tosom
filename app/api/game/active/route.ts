/**
 * GET /api/game/active?conversationId=...
 *
 * Returnerer alle aktive spill i en samtale.
 * Brukes ved panel-mount for initial load.
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Ikke autentisert" }, { status: 401 });
  }
  const userId = session.user.id;

  const conversationId = req.nextUrl.searchParams.get("conversationId");
  if (!conversationId) {
    return NextResponse.json({ error: "conversationId kreves" }, { status: 400 });
  }

  // Deltakelse
  const conversation = await prisma.conversation.findFirst({
    where: { id: conversationId, OR: [{ userAId: userId }, { userBId: userId }] },
    select: { id: true },
  });
  if (!conversation) {
    return NextResponse.json({ error: "Du deltar ikke i denne samtalen" }, { status: 403 });
  }

  const games = await prisma.gameSession.findMany({
    where: { conversationId, status: "ACTIVE" },
    select: { id: true, type: true, state: true, turn: true, winner: true },
  });

  return NextResponse.json({ games });
}