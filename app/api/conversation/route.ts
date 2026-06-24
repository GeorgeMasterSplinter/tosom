
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function POST(
  request: Request
): Promise<Response> {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }

  const { targetUserId } = await request.json();

  if (!targetUserId) {
    return new Response(JSON.stringify({ error: "Missing targetUserId" }), { status: 400, headers: { "Content-Type": "application/json" } });
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
          normalizedScore: 0.0,
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

  return new Response(JSON.stringify({
    success: true,
    conversationId: conversation.id,
  }), { status: 200, headers: { "Content-Type": "application/json" } });
}
