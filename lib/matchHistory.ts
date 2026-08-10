import prisma from "@/lib/prisma";

export async function getMatchHistory(userId: string) {
  const matches = await prisma.match.findMany({
    where: {
      status: { in: ["expired", "ended", "unmatched"] },
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
          profile: {
            select: {
              age: true,
              photoUrl: true,
            }
          }
        }
      },
      userB: {
        select: {
          id: true,
          name: true,
          profile: {
            select: {
              age: true,
              photoUrl: true,
            }
          }
        }
      }
    }
  });

  return matches;
}
