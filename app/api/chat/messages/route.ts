/**
 * GET /api/chat/messages?conversationId=X
 * Hent alle meldingar for ei conversation.
 */

import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Ikke autentisert" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const conversationId = searchParams.get("conversationId");

  if (!conversationId) {
    return NextResponse.json({ error: "Manglar conversationId" }, { status: 400 });
  }

  try {
    const messages = await prisma.message.findMany({
      where: {
        conversationId,
      },
      orderBy: { createdAt: "asc" },
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

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("GET /api/chat/messages error:", error);
    return NextResponse.json(
      { error: "Kunne ikke laste meldingar" },
      { status: 500 }
    );
  }
}
