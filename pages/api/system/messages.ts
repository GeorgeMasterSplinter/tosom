// pages/api/system/messages.ts
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Not authenticated" });

  const messages = await prisma.systemMessage.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  res.json(messages);
}
