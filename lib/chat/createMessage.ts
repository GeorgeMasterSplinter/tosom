import { prisma } from '@/lib/prisma';

export async function createMessage(
  conversationId: string,
  senderId: string,
  content: string
) {
  try {
    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId,
        content,
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return message;
  } catch (error) {
    console.error('Error creating message:', error);
    throw new Error('Failed to create message');
  }
}
