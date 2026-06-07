import prisma from "@/lib/prisma";
import type { Message } from "@prisma/client";

export const SYSTEM_SENDER_ID = "__system__";

export async function createSystemMessage(conversationId: string, content: string): Promise<Message> {
  return prisma.message.create({
    data: {
      conversationId,
      senderId: SYSTEM_SENDER_ID,
      content,
    },
  });
}

export function isSystemSender(senderId: string | null): boolean {
  return senderId === SYSTEM_SENDER_ID;
}
