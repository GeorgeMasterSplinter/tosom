import prisma from "@/lib/prisma";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) return res.status(401).json({ error: "Not authenticated" });

  const { matchId, decision } = req.body; // "yes" eller "no"

  const match = await prisma.match.findUnique({
    where: { id: matchId },
  });

  if (!match) return res.status(404).json({ error: "Match not found" });

  // Oppdater brukerens beslutning
  const updated = await prisma.match.update({
    where: { id: matchId },
    data: {
      [`decision_${session.user.id}`]: decision, // dynamisk felt
    },
  });

  // Hent begge beslutninger
  const m = await prisma.match.findUnique({
    where: { id: matchId },
  });

  const userA = m.decision_userA;
  const userB = m.decision_userB;

  let result = "pending";

  if (userA && userB) {
    if (userA === "yes" && userB === "yes") result = "mutual_yes";
    if (userA === "no" && userB === "yes") result = "you_no";
    if (userA === "yes" && userB === "no") result = "they_no";
    if (userA === "no" && userB === "no") result = "mutual_no";
  }

  res.json({ ok: true, result });
}
