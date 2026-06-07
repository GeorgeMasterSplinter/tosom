import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { targetUserId } = await req.json();

  if (!targetUserId) {
    return NextResponse.json({ error: "Missing targetUserId" }, { status: 400 });
  }

  let conversation = await prisma.conversation.findFirst({
    where: {
      OR: [
        {
          userAId: session.user.id,
          userBId: targetUserId,
        },
        {
          userAId: targetUserId,
          userBId: session.user.id,
        },
      ],
    },
  });

  if (!conversation) {
    // Finn aktiv match mellom brukarane
    let matchId: string;
    const existingMatch = await prisma.match.findFirst({
      where: {
        status: "active",
        OR: [
          { userAId: session.user.id, userBId: targetUserId },
          { userAId: targetUserId, userBId: session.user.id },
        ],
      },
      select: { id: true },
    });

    if (existingMatch) {
      matchId = existingMatch.id;
    } else {
      matchId = `match-${Date.now()}`;
      await prisma.match.create({
        data: {
          id: matchId,
          userAId: session.user.id,
          userBId: targetUserId,
          matchScore: 0,
          matchQuality: "new",
        },
      });
    }

    conversation = await prisma.conversation.create({
      data: {
        userAId: session.user.id,
        userBId: targetUserId,
        matchId,
      },
    });
  }

  return NextResponse.json({
    success: true,
    conversationId: conversation.id,
  });
}
