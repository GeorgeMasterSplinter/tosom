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
import { getServerSession, requireNotBanned } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { chatSendMessageSchema, errorResponse, successResponse } from "@/lib/api-validator";

export const dynamic = "force-dynamic";

/**
 * Map frontend-message type til Prisma MessageCategory.
 * Frontend bruker: "text" | "image" | "task" | "choice"
 * Prisma bruker:   "user" | "image" | "system" | "continue_choice"
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

  // Sjekk om brukaren er utestengt (STEG 3.2 — sesjons-revokering)
  const bannedCheck = await requireNotBanned(session.user.id);
  if (bannedCheck) return bannedCheck;

  try {
    // STEG 3: Zod-validering av body
    const validation = await chatSendMessageSchema.safeParseAsync(await request.json());
    if (!validation.success) {
      return errorResponse(
        `Valideringsfeil: ${validation.error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join('; ')}`,
        400
      );
    }

    const { conversationId, content, type } = validation.data;

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

    // Opprett melding med mappa type (bruk crypto.randomUUID i stedenfor Date.now()+Math.random)
    const message = await prisma.message.create({
      data: {
        id: crypto.randomUUID(),
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