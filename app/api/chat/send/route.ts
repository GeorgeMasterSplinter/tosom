/**
 * POST /api/chat/send
 * Send ei ny melding til ei conversation.
 *
 * Map frontend type → Prisma MessageCategory:
 *   "text"  → "user"
 *   "image" → "image"
 *   "task"  → "system"
 *   "choice"|undefined → "user"
 */

import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * Map frontend-message type til Prisma MessageCategory.
 * Frontend brukar: "text" | "image" | "task" | "choice"
 * Prisma brukar:   "user" | "image" | "system" | "continue_choice"
 */
function mapMessageType(frontendType: string): "user" | "system" | "continue_choice" | "image" {
  const mapping: Record<string, "user" | "system" | "continue_choice" | "image"> = {
    text: "user",
    image: "image",
    task: "system",
    choice: "continue_choice",
  };
  return mapping[frontendType] ?? "user";
}

export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Ikke autentisert" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { conversationId, content, type } = body;

    if (!conversationId || !content) {
      return NextResponse.json(
        { error: "Mangler conversationId og content" },
        { status: 400 }
      );
    }

    // Map frontend type → Prisma MessageCategory
    const mappedType = mapMessageType(type ?? "text");

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

    // Opprett melding med mappa type
    const message = await prisma.message.create({
      data: {
        id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        conversationId,
        senderId: session.user.id,
        content,
        type: mappedType,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            profile: {
              select: { photoUrl: true, age: true },
            },
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
