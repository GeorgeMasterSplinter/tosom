// pages/api/chat/send-image.ts
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).end();

  const { matchId, imageUrl } = req.body;

  const conversation = await prisma.conversation.findFirst({
    where: { matchId },
  });

  const message = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderId: session.user.id,
      imageUrl,
    },
  });

  res.json({ message });
}
