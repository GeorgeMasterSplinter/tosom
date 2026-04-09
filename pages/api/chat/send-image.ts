import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";

export default async function handler(req, res) {
  const session = await getServerSession(req, res);
  if (!session) return res.status(401).end();

  const { matchId, imageUrl } = req.body;

  const match = await prisma.match.findUnique({ where: { id: matchId } });

  if (new Date() < new Date(match.chatUntil)) {
    return res.status(400).json({
      error: "Bilder kan sendes etter 14 dager.",
    });
  }

  const conversation = await prisma.conversation.findFirst({
    where: { matchId },
  });

  const message = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderId: session.user.id,
      content: imageUrl,
    },
  });

  res.json({ message });
}
