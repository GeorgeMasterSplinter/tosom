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

import { NextRequest, NextResponse } from "next/server";
import { getServerSession, requireNotBanned } from "@/lib/auth/session";
import { csrfCheck } from "@/lib/auth/csrf";
import { withMetrics } from "@/lib/observability/withMetrics";
import { prisma } from "@/lib/prisma";
import { chatSendMessageSchema, errorResponse, successResponse } from "@/lib/api-validator";
import { pgCheck } from "@/lib/rate-limit-pg";

export const dynamic = "force-dynamic";

// A5 — Rate limiting på meldingssending.
// Ruten var udekket: en løkke kunne flomme en samtale med meldinger og fylle
// databasen. Taket er satt høyt nok til at det aldri merkes i en ekte samtale
// (ToSom er langsom av natur), men lavt nok til å stoppe et skript.
// pgCheck er atomisk (INSERT ... ON CONFLICT) og deles mellom instanser, og
// feiler åpent — rate limiting skal aldri stoppe en legitim melding.
const CHAT_RATE_MAX = 30;          // meldinger
const CHAT_RATE_WINDOW_SEC = 60;   // per minutt, per bruker

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

async function postHandler(request: NextRequest) {
  // L6: CSRF-vern
  const csrf = await csrfCheck(request);
  if (csrf instanceof NextResponse) return csrf;

  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Ikke autentisert" }, { status: 401 });
  }

  // Sjekk om brukaren er utestengt (STEG 3.2 — sesjons-revokering)
  const bannedCheck = await requireNotBanned(session.user.id);
  if (bannedCheck) return bannedCheck;

  // A5: Rate limiting per bruker. Nøkkelen bruker sesjons-ID, ikke IP — to
  // personer bak samme nett skal ikke kunne bremse hverandre.
  const limit = await pgCheck(
    `chat:send:${session.user.id}`,
    CHAT_RATE_MAX,
    CHAT_RATE_WINDOW_SEC
  );
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Du sender meldinger litt for raskt. Vent et øyeblikk." },
      { status: 429 }
    );
  }

  try {
    // STEG 3: Zod-validering av body
    const validation = await chatSendMessageSchema.safeParseAsync(await request.json());
    if (!validation.success) {
      return errorResponse(
        `Valideringsfeil: ${validation.error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join('; ')}`,
        400
      );
    }

    const { conversationId, content, type, source } = validation.data;

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

    // Opprett melding med mappa type (bruk crypto.randomUUID i stedet for Date.now()+Math.random)
    const message = await prisma.message.create({
      data: {
        id: crypto.randomUUID(),
        conversationId,
        senderId: session.user.id,
        content,
        type: mappedType,
        ...(source ? { source } : {}),
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

    // Real-time: trigger Pusher-event til begge deltagere i samtalen.
    // Feil i Pusher må ikke blokkere sendingen — meldingen er allerede lagret.
    const { triggerNewMessage } = await import('@/lib/pusher/server');
    triggerNewMessage(conversationId, {
      id: message.id,
      content: message.content,
      senderId: session.user.id,
      createdAt: message.createdAt,
    }).catch(() => { /* Pusher-feil er ikke kritisk — polling dekker opp */ });

    return NextResponse.json({ message });
  } catch (error) {
    console.error("POST /api/chat/send error:", error);
    return NextResponse.json(
      { error: "Kunne ikke sende melding" },
      { status: 500 }
    );
  }
}

export const POST = withMetrics("/api/chat/send", postHandler);
