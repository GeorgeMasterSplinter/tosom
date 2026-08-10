import { prisma } from '@/lib/prisma';

export async function getUserConversations(userId: string) {
  try {
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          { userAId: userId },
          { userBId: userId },
        ],
      },
      include: {
        userA: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        userB: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return conversations;
  } catch (error) {
    console.error('Error fetching user conversations:', error);
    throw new Error('Failed to fetch user conversations');
  }
}