import { prisma } from '@/lib/prisma';

export async function createConversation(userAId: string, userBId: string, matchId: string) {
  try {
    const conversation = await prisma.conversation.create({
      data: {
        userAId,
        userBId,
        matchId,
      },
      include: {
        userA: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        userB: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    return conversation;
  } catch (error) {
    console.error('Error creating conversation:', error);
    throw new Error('Failed to create conversation');
  }
}