import prisma from "../../../lib/prisma";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) return res.status(401).json({ error: "Not authenticated" });

  const journey = await prisma.journey.findFirst({
    where: { userId: session.user.id, completed: false },
  });

  if (!journey) return res.json({ noJourney: true });

  const task = await prisma.journeyTask.findFirst({
    where: { journeyId: journey.id, day: journey.day },
  });

  if (!task) return res.json({ noTask: true });

  res.json({ journey, task });
}
