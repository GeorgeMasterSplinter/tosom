/**
 * ToSom Admin AI Oversight
 * 
 * Visning av AI-kall og statistikk for admin.
 */

import { prisma } from '@/lib/prisma'

export async function listAIRequests(filter: {
  userId?: string
  sinceHours?: number
  search?: string
  feature?: string
}) {
  const where: any = {}

  if (filter.userId) {
    where.userId = filter.userId
  }

  if (filter.sinceHours) {
    const since = new Date(Date.now() - filter.sinceHours * 60 * 60 * 1000)
    where.createdAt = { gte: since }
  }

  if (filter.search) {
    where.message = { contains: filter.search, mode: 'insensitive' }
  }

  if (filter.feature) {
    where.metadata = { path: ['feature'], contains: filter.feature }
  }

  const logs = await prisma.systemLog.findMany({
    where: { level: 'INFO' },
    orderBy: { createdAt: 'desc' as const },
    take: 100,
  })

  return logs
}

export async function getAIStats(sinceHours = 24): Promise<{
  totalCalls: number
  byFeature: Record<string, number>
  errorCount: number
  avgLatencyMs: number
}> {
  const since = new Date(Date.now() - sinceHours * 60 * 60 * 1000)

  const totalCalls = await prisma.systemLog.count({
    where: { level: 'INFO', createdAt: { gte: since } },
  })

  const errorCount = await prisma.systemLog.count({
    where: { level: 'ERROR', createdAt: { gte: since } },
  })

  const logs = await prisma.systemLog.findMany({
    where: { createdAt: { gte: since } },
    select: { metadata: true },
  })

  const byFeature: Record<string, number> = {}
  for (const log of logs) {
    const metadata = log.metadata as Record<string, unknown>
    if (metadata?.feature) {
      const feature = String(metadata.feature)
      byFeature[feature] = (byFeature[feature] ?? 0) + 1
    }
  }

  return {
    totalCalls,
    byFeature,
    errorCount,
    avgLatencyMs: 0,
  }
}
