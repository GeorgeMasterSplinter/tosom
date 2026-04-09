import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const { matchId } = req.query;

  const conversation = await prisma.conversation.findFirst({
    where: { matchId },
    include: { messages: true },
  });

  res.json(conversation?.messages || []);
}
