/* ═══════════════════════════════════════════
   ToSom — Shared Memories API
   Henter og lagrer felles minner
   ═══════════════════════════════════════════ */

import { NextRequest, NextResponse } from "next/server";
import { flags } from "@/utils/flags";

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

  const { searchParams } = new URL(request.url);
  const conversationId = searchParams.get("conversationId");

  if (!conversationId) {
    return NextResponse.json(
      { error: "conversationId required" },
      { status: 400 },
    );
  }

  // Demo memories
  const demoMemories: Memory[] = [
    {
      conversationId,
      imageUrl: "https://picsum.photos/400/300?random=1",
      note: "Vår første felles middag",
      date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      tags: ["middag", "første"],
    },
    {
      conversationId,
      imageUrl: "https://picsum.photos/400/300?random=2",
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

  try {
    const body: Omit<Memory, "id" | "createdAt"> = await request.json();

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