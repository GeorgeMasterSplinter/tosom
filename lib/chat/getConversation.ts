import { prisma } from '@/lib/prisma';

export async function getConversation(conversationId: string) {
  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        userA: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        userB: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        match: {
          select: {
            id: true,
            score: true,
          },
        },
      },
    });

    return conversation;
  } catch (error) {
    console.error('Error fetching conversation:', error);
    throw new Error('Failed to fetch conversation');
  }
}
