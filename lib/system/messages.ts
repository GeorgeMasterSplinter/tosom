import { NotificationType } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { dispatchEvent } from '@/lib/notifications/dispatcher'

export async function sendSystemMessage(userId: string, content: string, type: 'INFO' | 'WARNING' | 'ALERT' = 'INFO'): Promise<void> {
  // Legacy SystemMessage removed in stability-cleanup — now creates Notification directly
  await prisma.notification.create({
    data: {
      userId,
      type: NotificationType.SYSTEM,
      message: content,
      metadata: JSON.parse(JSON.stringify({ systemMessageType: type })),
    },
  })

  await dispatchEvent(
    NotificationType.SYSTEM,
    userId,
    content,
    { systemMessageType: type },
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
