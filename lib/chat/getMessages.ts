import { prisma } from "@/lib/prisma";

export interface MessageWithStatus {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: string;
  readAt: Date | null;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  sender: {
    id: string;
    firstName: string | null;
    lastName: string | null;
  };
  isRead: boolean;
  isDeleted: boolean;
  isEdited: boolean;
}

export async function getMessages(
  conversationId: string,
  userId: string,
  limit: number = 50,
  offset: number = 0,
): Promise<MessageWithStatus[]> {
  try {
    const messages = await prisma.message.findMany({
      where: {
        conversationId,
        deletedAt: null,
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
      orderBy: {
        createdAt: "asc",
      },
      take: limit,
      skip: offset,
    });

    // Merk meldingar som lese dersom mottakaren hentar dei
    const unreadMessages = messages.filter(
      (msg) => msg.senderId !== userId && !msg.readAt,
    );
    if (unreadMessages.length > 0) {
      await Promise.all(
        unreadMessages.map((msg) =>
          prisma.message.update({
            where: { id: msg.id },
            data: { readAt: new Date() },
          }),
        ),
      );
    }

    return messages.map((msg) => ({
      ...msg,
      isRead: msg.readAt !== null,
      isDeleted: msg.deletedAt !== null,
      isEdited: msg.updatedAt > msg.createdAt,
      sender: msg.sender,
    }));
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw new Error("Failed to fetch messages");
  }
}
