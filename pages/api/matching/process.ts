import prisma from "@/lib/prisma";
import { findBestMatchesForUser } from "@/lib/matching";
import { CHAT_PHASE_DAYS, DECISION_PHASE_DAYS } from "@/config/matching";

export default async function handler(req, res) {
  const now = new Date();

  const requests = await prisma.matchRequest.findMany({
    where: {
      processed: false,
      matchReadyAt: { lte: now },
    },
  });

  for (const r of requests) {
    const matches = await findBestMatchesForUser(r.userId);

    for (const m of matches) {
      const match = await prisma.match.create({
        data: {
          userId: r.userId,
          matchUserId: m.user.id,
          score: m.score.totalScore,
          breakdown: m.score.breakdown,
          quality: m.score.matchQuality,
          chatUntil: new Date(now.getTime() + CHAT_PHASE_DAYS * 86400000),
          decideUntil: new Date(now.getTime() + DECISION_PHASE_DAYS * 86400000),
        },
      });

      await prisma.conversation.create({
        data: { matchId: match.id },
      });
    }

    await prisma.matchRequest.update({
      where: { id: r.id },
      data: { processed: true },
    });
  }

  res.json({ ok: true });
}
