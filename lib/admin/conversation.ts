import { prisma } from '@/lib/prisma'

export async function listConversations(filter?: {
  userId?: string
  frozen?: boolean
  search?: string
}) {
  const where: any = {}

  if (filter?.userId) {
    where.OR = [
      { userAId: filter.userId },
      { userBId: filter.userId },
    ]
  }

  if (filter?.frozen !== undefined) {
    if (filter.frozen) {
      where.frozenAt = { not: null }
    } else {
      where.frozenAt = null
    }
  }

  if (filter?.search) {
    where.OR = [
      { userA: { profile: { firstName: { contains: filter.search, mode: 'insensitive' } } } },
      { userB: { profile: { firstName: { contains: filter.search, mode: 'insensitive' } } } },
    ]
  }

  const conversations = await prisma.conversation.findMany({
    where,
    select: {
      id: true,
      createdAt: true,
      updatedAt: true,
      endedAt: true,
      frozenAt: true,
      frozenBy: true,
      unreadCountA: true,
      unreadCountB: true,
      lastMessageAt: true,
      lastMessagePreview: true,
      userA: {
        select: {
          id: true,
          email: true,
          profile: { select: { firstName: true, lastName: true } },
        },
      },
      userB: {
        select: {
          id: true,
          email: true,
          profile: { select: { firstName: true, lastName: true } },
        },
      },
      _count: { select: { messages: true } },
    },
    orderBy: { updatedAt: 'desc' },
    take: 50,
  })

  return conversations
}

export async function getConversationMetadata(conversationId: string) {
  const conv = await prisma.conversation.findUnique({
    where: { id: conversationId },
    select: {
      id: true,
      createdAt: true,
      updatedAt: true,
      endedAt: true,
      frozenAt: true,
      frozenBy: true,
      unreadCountA: true,
      unreadCountB: true,
      lastMessageAt: true,
      lastMessagePreview: true,
      userAId: true,
      userBId: true,
      userA: {
        select: {
          id: true,
          email: true,
          verified: true,
          bannedAt: true,
          profile: { select: { firstName: true, lastName: true, photoUrl: true } },
        },
      },
      userB: {
        select: {
          id: true,
          email: true,
          verified: true,
          bannedAt: true,
          profile: { select: { firstName: true, lastName: true, photoUrl: true } },
        },
      },
      _count: { select: { messages: true } },
    },
  })

  return conv
}
