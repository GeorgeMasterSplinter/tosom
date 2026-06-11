import { prisma } from '@/lib/prisma'
import { NotificationType } from '@prisma/client'
import { incrementUnread } from './unread'

// Re-export for backward compatibility (types only; Prisma enums are types not values)
export type { NotificationType } from '@prisma/client'

export async function dispatchEvent(
  type: NotificationType,
  userId: string,
  message: string,
  metadata: Record<string, unknown> | null = null,
): Promise<void> {
  await prisma.notification.create({
    data: {
      userId,
      type,
      message,
      metadata: metadata ? (metadata as any) : undefined,
    },
  })
  await incrementUnread(userId)
}

export async function createNotification(
  userId: string,
  type: NotificationType,
  message: string,
  metadata?: Record<string, unknown>,
): Promise<void> {
  await dispatchEvent(type, userId, message, metadata ?? null)
}

export async function markRead(notificationId: string): Promise<void> {
  await prisma.notification.update({
    where: { id: notificationId },
    data: { readAt: new Date() },
  })
}

export async function markAllRead(userId: string): Promise<void> {
  await prisma.notification.updateMany({
    where: { userId, readAt: null },
    data: { readAt: new Date() },
  })
}
