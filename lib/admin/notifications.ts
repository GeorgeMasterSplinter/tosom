import { prisma } from '@/lib/prisma'

export async function listNotifications(filter?: {
  userId?: string
  type?: string
  read?: boolean
  search?: string
}) {
  const where: any = {}

  if (filter?.userId) {
    where.userId = filter.userId
  }

  if (filter?.type) {
    where.type = filter.type
  }

  if (filter?.read !== undefined) {
    if (filter.read) {
      where.readAt = { not: null }
    } else {
      where.readAt = null
    }
  }

  const notifications = await prisma.notification.findMany({
    where,
    select: {
      id: true,
      type: true,
      message: true,
      metadata: true,
      readAt: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          email: true,
          profile: { select: { firstName: true, lastName: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  return notifications
}

export async function getNotification(id: string) {
  const notification = await prisma.notification.findUnique({
    where: { id },
    select: {
      id: true,
      userId: true,
      type: true,
      message: true,
      metadata: true,
      readAt: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          email: true,
          verified: true,
          bannedAt: true,
          profile: { select: { firstName: true, lastName: true, photos: true } },
        },
      },
    },
  })

  return notification
}
