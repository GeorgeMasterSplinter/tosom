import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Not authenticated" });

  const data = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      journey: true,
      matches: {
        include: {
          matchUser: {
            include: {
              profile: true,
            },
          },
        },
      },
    },
  });

  if (!data) return res.status(404).json({ error: "No data" });

  res.json(data);
}
