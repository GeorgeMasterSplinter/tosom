import { prisma } from '@/lib/prisma'
import { MessageState } from '@prisma/client'

export async function markDelivered(messageId: string): Promise<void> {
  await prisma.message.update({
    where: { id: messageId },
    data: { state: MessageState.DELIVERED, deliveredAt: new Date() },
  })
}

export async function markRead(messageId: string): Promise<void> {
  await prisma.message.update({
    where: { id: messageId },
    data: { state: MessageState.READ, readAt: new Date() },
  })
}

export async function markDeleted(messageId: string): Promise<void> {
  await prisma.message.update({
    where: { id: messageId },
    data: { state: MessageState.DELETED, deletedAt: new Date() },
  })
}
