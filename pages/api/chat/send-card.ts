// pages/api/chat/send-card.ts
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).end();

  const { matchId, cardId } = req.body;

  const card = await prisma.bliKjentCard.findUnique({ where: { id: cardId } });

  const conversation = await prisma.conversation.findFirst({
    where: { matchId },
  });

  const message = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderId: session.user.id,
      content: card.text,
    },
  });

  res.json({ message });
}
