/**
 * POST /api/chat/typing
 *
 * STEG 2.2 — Skriveindikator.
 *
 * Flyktig hendelse — ingenting skrives til databasen.
 * Sender Pusher-event til samtalekanalen og returnerer 204.
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/requireAuth";
import { prisma } from "@/lib/prisma";
import { triggerTyping } from "@/lib/pusher/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const result = await requireAuth(req);
  if (result instanceof NextResponse) return result;
  const userId = result.user.id;

  const body = await req.json().catch(() => null);
  if (!body || typeof body.conversationId !== "string") {
    return NextResponse.json(
      { error: "conversationId mangler" },
      { status: 400 }
    );
  }

  const { conversationId, isTyping } = body;

  // Verifiser at brukeren deltar i samtalen
  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      OR: [{ userAId: userId }, { userBId: userId }],
    },
    select: { id: true },
  });

  if (!conversation) {
    return NextResponse.json(
      { error: "Du deltar ikke i denne samtalen" },
      { status: 403 }
    );
  }

  // Send Pusher-event — ingen database-skriving
  try {
    await triggerTyping(conversationId, userId, Boolean(isTyping));
  } catch {
    // Pusher-feil skal ikke bryte klientsiden
  }

  return new NextResponse(null, { status: 204 });
}