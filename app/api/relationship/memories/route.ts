/* ═══════════════════════════════════════════
   Tosom — Shared Memories API
   Henter og lagrer felles minner
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

interface Memory {
  id?: string;
  conversationId: string;
  imageUrl?: string;
  note?: string;
  date: string;
  tags: string[];
  createdAt?: string;
}

/* ---------------------------------------------------------- */
/*  GET — Fetch shared memories                               */
/* ---------------------------------------------------------- */

export async function GET(request: NextRequest) {
  if (!flags.enableSharedMemories) {
    return NextResponse.json(
      { error: "Shared memories disabled" },
      { status: 403 },
    );
  }

  const memberCheck = await requireConversationMember(request);
  if (memberCheck instanceof NextResponse) return memberCheck;

  const { conversationId } = memberCheck;

  // Demo memories
  const demoMemories: Memory[] = [
    {
      conversationId,
      imageUrl: "data:image/svg+xml,%3Csvg%20xmlns='http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20width='400'%20height='300'%3E%3Crect%20width='400'%20height='300'%20fill='%23dbeafe'%2F%3E%3C%2Fsvg%3E",
      note: "Vår første felles middag",
      date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      tags: ["middag", "første"],
    },
    {
      conversationId,
      imageUrl: "data:image/svg+xml,%3Csvg%20xmlns='http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20width='400'%20height='300'%3E%3Crect%20width='400'%20height='300'%20fill='%23bfdbfe'%2F%3E%3C%2Fsvg%3E",
      note: "Badesol på kveldstid",
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      tags: ["bade", "solskin"],
    },
    {
      conversationId,
      note: "Vi fant den perfekte stien — kun dere to og naturen.",
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      tags: ["tur", "natur"],
    },
  ];

  return NextResponse.json({
    memories: demoMemories.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    conversationId,
  });
}

/* ---------------------------------------------------------- */
/*  POST — Add shared memory                                  */
/* ---------------------------------------------------------- */

export async function POST(request: NextRequest) {
  if (!flags.enableSharedMemories) {
    return NextResponse.json(
      { error: "Shared memories disabled" },
      { status: 403 },
    );
  }

  const memberCheck = await requireConversationMember(request);
  if (memberCheck instanceof NextResponse) return memberCheck;

  try {
    const body: Omit<Memory, "id" | "createdAt"> = await request.clone().json();

    if (!body.conversationId || !body.date) {
      return NextResponse.json(
        { error: "conversationId and date are required" },
        { status: 400 },
      );
    }

    // Save to DB (placeholder)
    // Fremtidig: await prisma.memory.create({ data: { ...body, createdAt: new Date().toISOString() } });

    const memory: Memory = {
      ...body,
      id: `memory-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ memory, status: "created" });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }
}