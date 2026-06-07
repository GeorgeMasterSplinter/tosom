import { prisma } from '@/lib/prisma'

export async function updateConversationMetadata(conversationId: string): Promise<void> {
  const lastMessage = await prisma.message.findFirst({
    where: { conversationId, deletedAt: null },
    orderBy: { createdAt: 'desc' },
    select: { content: true, createdAt: true },
  })

  if (!lastMessage) return

  await prisma.conversation.update({
    where: { id: conversationId },
    data: {
      lastMessageAt: lastMessage.createdAt,
      lastMessagePreview: lastMessage.content.slice(0, 100),
    },
  })
}

export async function incrementUnread(conversationId: string, userId: string): Promise<void> {
  const conv = await prisma.conversation.findUnique({
    where: { id: conversationId },
    select: { userAId: true, userBId: true, unreadCountA: true, unreadCountB: true },
  })

  if (!conv) return

  if (userId === conv.userAId) {
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { unreadCountB: { increment: 1 } },
    })
  } else {
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { unreadCountA: { increment: 1 } },
    })
  }
}

export async function resetUnread(conversationId: string, userId: string): Promise<void> {
  const conv = await prisma.conversation.findUnique({
    where: { id: conversationId },
    select: { userAId: true, userBId: true },
  })

  if (!conv) return

  if (userId === conv.userAId) {
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { unreadCountA: 0 },
    })
  } else {
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { unreadCountB: 0 },
    })
  }
}
