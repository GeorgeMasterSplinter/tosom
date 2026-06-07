import prisma from "@/lib/prisma";

export async function getMatchHistory(userId: string) {
  const matches = await prisma.match.findMany({
    where: {
      endedAt: { not: null },
      OR: [
        { userAId: userId },
        { userBId: userId }
      ]
    },
    include: {
      userA: {
        select: {
          id: true,
          name: true,
          age: true,
          image: true,
        }
      },
      userB: {
        select: {
          id: true,
          name: true,
          age: true,
          image: true,
        }
      }
    }
  });

  return matches;
}
