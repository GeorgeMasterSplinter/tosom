/* ═══════════════════════════════════════════
   ToSom — Relationship Timeline API
   Henter og lagrer relasjonsmilepæler
   ═══════════════════════════════════════════ */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { flags } from "@/utils/flags";

export const dynamic = 'force-dynamic';

/** Sjekk at brukeren er autentisert og medlem av samtalen */
async function requireConversationMember(
  request: NextRequest
): Promise<{ userId: string; conversationId: string } | NextResponse> {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const body = await request.clone().json().catch(() => ({}));
  const conversationId = searchParams.get("conversationId") || body?.conversationId;

  if (!conversationId) {
    return NextResponse.json({ error: "conversationId required" }, { status: 400 });
  }

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    select: { userAId: true, userBId: true },
  });

  if (!conversation) {
    return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
  }

  const isMember = conversation.userAId === session.user.id || conversation.userBId === session.user.id;
  if (!isMember) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return { userId: session.user.id, conversationId };
}

interface TimelineEvent {
  id?: string;
  date: string;
  type: "match" | "first_message" | "first_meeting" | "milestone" | "journey_complete" | "custom";
  title: string;
  description?: string;
  imageUrl?: string;
  createdAt?: string;
}

interface TimelineResponse {
  events: TimelineEvent[];
  conversationId: string;
}

/* ---------------------------------------------------------- */
/*  GET — Fetch timeline events                               */
/* ---------------------------------------------------------- */

export async function GET(request: NextRequest) {
  if (!flags.enableRelationshipTimeline) {
    return NextResponse.json(
      { error: "Timeline disabled" },
      { status: 403 },
    );
  }

  const memberCheck = await requireConversationMember(request);
  if (memberCheck instanceof NextResponse) return memberCheck;

  const { conversationId } = memberCheck;

  // Fetch from DB (placeholder — implement with Prisma)
  // Fremtidig: const events = await prisma.timelineEvent.findMany({ where: { conversationId } });

  // Default events for demo
  const defaultEvents: TimelineEvent[] = [
    {
      date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      type: "match",
      title: "Match opprettet",
      description: "Dere matchet hverandre basert på resonans.",
    },
    {
      date: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString(),
      type: "first_message",
      title: "Første melding",
      description: "Den første meldingen ble sendt.",
    },
    {
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      type: "journey_complete",
      title: "Journey step fullført",
      description: "Dere fullførte første connection-step.",
    },
  ];

  return NextResponse.json({
    events: defaultEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    conversationId,
  });
}

/* ---------------------------------------------------------- */
/*  POST — Add timeline event                                 */
/* ---------------------------------------------------------- */

export async function POST(request: NextRequest) {
  if (!flags.enableRelationshipTimeline) {
    return NextResponse.json(
      { error: "Timeline disabled" },
      { status: 403 },
    );
  }

  const memberCheck = await requireConversationMember(request);
  if (memberCheck instanceof NextResponse) return memberCheck;

  try {
    const body: Omit<TimelineEvent, "createdAt"> = await request.clone().json();

    if (!body.date || !body.type || !body.title) {
      return NextResponse.json(
        { error: "date, type, and title are required" },
        { status: 400 },
      );
    }

    // Validate event type
    const validTypes = ["match", "first_message", "first_meeting", "milestone", "journey_complete", "custom"];
    if (!validTypes.includes(body.type)) {
      return NextResponse.json(
        { error: "Invalid event type" },
        { status: 400 },
      );
    }

    // Save to DB (placeholder)
    // Fremtidig: await prisma.timelineEvent.create({ data: { ...body, createdAt: new Date().toISOString() } });

    const event: TimelineEvent = {
      ...body,
      createdAt: new Date().toISOString(),
     };

    return NextResponse.json({ event, status: "created" });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }
}