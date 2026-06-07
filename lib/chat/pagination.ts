import { prisma } from '@/lib/prisma'

const DEFAULT_LIMIT = 30

export interface PaginatedMessages {
  messages: any[]
  nextCursor: string | null
}

export async function getMessages(
  conversationId: string,
  cursor?: string,
  limit: number = DEFAULT_LIMIT,
): Promise<PaginatedMessages> {
  const where = {
    conversationId,
    deletedAt: null,
  }

  const messages =
    cursor && cursor !== 'null'
      ? await prisma.message.findMany({
          where: { ...where, id: { lt: cursor } },
          orderBy: { createdAt: 'desc' as const },
          take: limit + 1,
        })
      : await prisma.message.findMany({
          where,
          orderBy: { createdAt: 'desc' as const },
          take: limit + 1,
        })

  const hasMore = messages.length > limit
  const result = hasMore ? messages.slice(0, limit) : messages

  const nextCursor = hasMore ? result[result.length - 1]?.id ?? null : null

  return { messages: result.reverse(), nextCursor }
}
