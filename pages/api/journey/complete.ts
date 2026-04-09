import prisma from "../../../lib/prisma";
import { getSession } from "next-auth/react";
import { MATCH_DELAY_HOURS } from "../../../config/matching";

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) return res.status(401).json({ error: "Not authenticated" });

  const { taskId, answer } = req.body;

  // 1. Oppdater oppgaven
  const task = await prisma.journeyTask.update({
    where: { id: taskId },
    data: { answer, completed: true },
  });

  // 2. Hent journey
  const journey = await prisma.journey.findUnique({
    where: { id: task.journeyId },
  });

  // 3. Oppdater til neste dag
  const nextDay = journey.day + 1;

  // Journey ferdig?
  const isFinished = nextDay > 7;

  await prisma.journey.update({
    where: { id: journey.id },
    data: {
      day: isFinished ? journey.day : nextDay,
      completed: isFinished,
    },
  });

  // 4. Hvis journey er ferdig → opprett matchRequest
  if (isFinished) {
    await prisma.matchRequest.create({
      data: {
        userId: session.user.id,
        matchReadyAt: new Date(Date.now() + MATCH_DELAY_HOURS * 3600000),
      },
    });
  }

  res.json({ ok: true, finished: isFinished });
}
