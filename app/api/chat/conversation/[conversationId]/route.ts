/**
 * GET /api/chat/conversation/:conversationId
 * Hent conversation-info med partner-data.
 */

import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Ikke autentisert" }, { status: 401 });
  }

  const { conversationId } = await params;

  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        userA: { select: { id: true, email: true } },
        userB: { select: { id: true, email: true } },
      },
    });

    if (!conversation) {
      return NextResponse.json({ error: "Samtalen finst ikke" }, { status: 404 });
    }

    // Verifiser at brukaren er del av conversationen
    const isA = conversation.userAId === session.user.id;
    const isB = conversation.userBId === session.user.id;

    if (!isA && !isB) {
      return NextResponse.json({ error: "Ingen tilgang" }, { status: 403 });
    }

    // Finn partneren — prøv name-felt først, deretter firstName
    const partnerId = isA ? conversation.userBId : conversation.userAId;
    const [partnerUser, partnerProfile] = await Promise.all([
      prisma.user.findUnique({
        where: { id: partnerId },
        select: { name: true },
      }),
      prisma.profile.findUnique({
        where: { userId: partnerId },
        select: { age: true },
      }),
    ]);

    // Bruk name-felt om tilgjengeleg, elles firstName frå profile (valfritt)
    const partnerFirstName = (partnerProfile as any)?.firstName || "Din partner";
    const partnerName = partnerUser?.name || partnerFirstName;
    const partnerAge = partnerProfile?.age ?? 25;

    return NextResponse.json({
      conversationId: conversation.id,
      partnerName,
      partnerAge,
      imageShareAllowed: conversation.imageShareAllowedAt != null,
      lastMessageAt: conversation.lastMessageAt,
    });
  } catch (error) {
    console.error("GET /api/chat/conversation error:", error);
    return NextResponse.json(
      { error: "Kunne ikke hente samtale-info" },
      { status: 500 }
    );
  }
}