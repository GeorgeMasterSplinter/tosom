import prisma from "@/lib/prisma";
import { calculateMatchScore } from "./calculateMatchScore";

export async function findBestMatchFor(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true },
  });

  if (!user || !user.profile) return null;

  // Finn aktive samtaler (endedAt null) — ekskluder desse brukarane
  const activeConvoUserIds = new Set(
    (
      await prisma.conversation.findMany({
        where: { endedAt: null },
        select: { userAId: true, userBId: true },
      })
    ).flatMap((c) => [c.userAId, c.userBId])
  );

  const others = await prisma.user.findMany({
    where: {
      id: { not: userId, notIn: Array.from(activeConvoUserIds) },
      profile: { isNot: null },
    },
    include: { profile: true },
  });

  let best: typeof user | null = null;
  let bestScore = -1;

  for (const other of others) {
    if (!other.profile) continue;
    const score = calculateMatchScore(
      { ...user, profile: user.profile } as any,
      { ...other, profile: other.profile } as any
    );
    const scoreNum = typeof score === "number" ? score : 0;
    if (scoreNum > bestScore) {
      bestScore = scoreNum;
      best = other;
    }
  }

  return best?.id ?? null;
}
