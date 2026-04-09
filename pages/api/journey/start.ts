import prisma from "../../../lib/prisma";
import { getSession } from "next-auth/react";
import { journeyTasks } from "../../../lib/journeyTasks";

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) return res.status(401).json({ error: "Not authenticated" });

  // Sjekk om journey allerede finnes
  const existing = await prisma.journey.findFirst({
    where: { userId: session.user.id, completed: false },
  });

  if (existing) {
    return res.json({ alreadyStarted: true, journeyId: existing.id });
  }

  // Opprett journey
  const journey = await prisma.journey.create({
    data: {
      userId: session.user.id,
      day: 1,
      completed: false,
    },
  });

  // Opprett tasks
  await prisma.journeyTask.createMany({
    data: journeyTasks.map((t) => ({
      journeyId: journey.id,
      day: t.day,
      question: t.question,
    })),
  });

  res.json({ ok: true, journeyId: journey.id });
}
