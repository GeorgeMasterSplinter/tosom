import prisma from "@/lib/prisma";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) return res.status(401).json({ error: "Not authenticated" });

  const { matchId, content } = req.body;

  const match = await prisma.match.findUnique({
    where: { id: matchId },
  });

  if (!match) return res.status(404).json({ error: "Match not found" });

  // HARD LOCK: Chat er stengt etter chatUntil
  if (new Date() > new Date(match.chatUntil)) {
    return res.status(403).json({ error: "Chat locked" });
  }

  // Opprett melding
  const conversation = await prisma.conversation.findUnique({
    where: { matchId },
  });

  const message = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderId: session.user.id,
      content,
    },
  });

  res.json({ ok: true, message });
}
