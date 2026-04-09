// pages/api/bli-kjent/list.ts
import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const cards = await prisma.bliKjentCard.findMany({
    orderBy: { category: "asc" },
  });

  res.json(cards);
}
