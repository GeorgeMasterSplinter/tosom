/**
 * POST /api/chat/send
 * Send ei ny melding til ei conversation.
 */

import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Ikke autentisert" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { conversationId, content, type = "text" } = body;

    if (!conversationId || !content) {
      return NextResponse.json(
        { error: "Mangler conversationId og content" },
        { status: 400 }
      );
    }

    // Verifiser at brukaren er del av denne conversationen
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [
          { userAId: session.user.id },
          { userBId: session.user.id },
        ],
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Ingen tilgang til denne samtalen" },
        { status: 403 }
      );
    }

    // Opprett melding
    const message = await prisma.message.create({
      data: {
        id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        conversationId,
        senderId: session.user.id,
        content,
        type,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            age: true,
          },
        },
      },
    });

    return NextResponse.json({ message });
  } catch (error) {
    console.error("POST /api/chat/send error:", error);
    return NextResponse.json(
      { error: "Kunne ikke sende melding" },
      { status: 500 }
    );
  }
}