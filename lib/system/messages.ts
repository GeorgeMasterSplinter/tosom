import { prisma } from '@/lib/prisma'
import { SystemMessageType, NotificationType } from '@prisma/client'
import { dispatchEvent } from '@/lib/notifications/dispatcher'

export async function sendSystemMessage(userId: string, content: string, type: SystemMessageType = SystemMessageType.INFO): Promise<void> {
  await prisma.systemMessage.create({
    data: { content, type },
  })

  await dispatchEvent(
    NotificationType.SYSTEM,
    userId,
    content,
    { type, systemMessageId: undefined },
  )
}

export async function sendAdminMessage(userId: string, content: string): Promise<void> {
  await dispatchEvent(
    NotificationType.ADMIN,
    userId,
    content,
    { isSystem: true },
  )
}
