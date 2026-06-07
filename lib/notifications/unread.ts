import { prisma } from '@/lib/prisma'

export async function getUnreadCount(userId: string): Promise<number> {
  const count = await prisma.notification.count({
    where: { userId, readAt: null },
  })
  return count
}

export async function incrementUnread(userId: string): Promise<number> {
  const count = await getUnreadCount(userId)
  return count + 1
}

export async function resetUnread(userId: string): Promise<void> {
  await prisma.notification.updateMany({
    where: { userId, readAt: null },
    data: { readAt: new Date() },
  })
}
