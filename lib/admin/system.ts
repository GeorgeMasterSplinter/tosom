import { prisma } from '@/lib/prisma'

interface FilterOptions {
  userId?: string
  level?: string
  module?: string
  sinceHours?: number
  search?: string
}

function applyDateFilter(where: any, lastHours: number): void {
  const since = new Date(Date.now() - lastHours * 60 * 60 * 1000)
  where.createdAt = { gte: since }
}

export async function getSystemLogs(filter: FilterOptions = {}) {
  const where: any = {}

  if (filter.sinceHours) {
    applyDateFilter(where, filter.sinceHours)
  }

  if (filter.level) {
    where.level = filter.level
  }

  if (filter.module) {
    where.module = filter.module
  }

  if (filter.search) {
    where.message = { contains: filter.search, mode: 'insensitive' }
  }

  const logs = await prisma.systemLog.findMany({
    where,
    orderBy: { createdAt: 'desc' as const },
    take: 100,
  })

  return logs
}

export async function getErrorLogs(filter: FilterOptions = {}) {
  const where: any = { level: 'ERROR' }

  if (filter.userId) {
    where.metadata = { path: ['userId'], contains: filter.userId }
  }

  if (filter.module) {
    where.module = filter.module
  }

  if (filter.search) {
    where.message = { contains: filter.search, mode: 'insensitive' }
  }

  if (filter.sinceHours) {
    applyDateFilter(where, filter.sinceHours)
  }

  const logs = await prisma.systemLog.findMany({
    where,
    orderBy: { createdAt: 'desc' as const },
    take: 100,
  })

  return logs
}

export async function getRateLimitLogs(filter: FilterOptions = {}) {
  const where: any = {}

  if (filter.userId) {
    where.userId = filter.userId
  }

  if (filter.sinceHours) {
    applyDateFilter(where, filter.sinceHours)
  }

  if (filter.search) {
    where.route = { contains: filter.search, mode: 'insensitive' }
  }

  const logs = await prisma.rateLimitLog.findMany({
    where,
    orderBy: { createdAt: 'desc' as const },
    take: 100,
  })

  return logs
}

export async function getSystemOverview(): Promise<{
  totalUsers: number
  activeMatches: number
  activeConversations: number
  unreadNotifications: number
  last24hErrors: number
  last24hRateLimitHits: number
  dbLatencyMs: number
}> {
  const now = new Date()
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000)

  const totalUsers = await prisma.user.count()
  const activeMatches = await prisma.match.count({ where: { status: 'active' } })
  const activeConversations = await prisma.conversation.count({
    where: { endedAt: null },
  })
  const unreadNotifications = await prisma.notification.count({
    where: { readAt: null },
  })

  const last24hErrors = await prisma.systemLog.count({
    where: { level: 'ERROR', createdAt: { gte: last24h } },
  })

  const last24hRateLimitHits = await prisma.rateLimitLog.count({
    where: { createdAt: { gte: last24h } },
  })

  const dbStart = Date.now()
  await prisma.$queryRaw`SELECT 1`
  const dbLatencyMs = Date.now() - dbStart

  return {
    totalUsers,
    activeMatches,
    activeConversations,
    unreadNotifications,
    last24hErrors,
    last24hRateLimitHits,
    dbLatencyMs,
  }
}
