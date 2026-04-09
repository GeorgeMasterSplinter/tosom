import prisma from "@/lib/prisma";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) return res.status(401).json({ error: "Not authenticated" });

  const messages = await prisma.systemMessage.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  res.json(messages);
}
