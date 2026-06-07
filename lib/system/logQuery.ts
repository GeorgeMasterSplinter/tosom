import { prisma } from '@/lib/prisma'

interface FilterOptions {
  userId?: string
  level?: string
  module?: string
  sinceHours?: number
  traceId?: string
  search?: string
}

function applyDateFilter(where: any, sinceHours?: number): void {
  if (sinceHours) {
    const since = new Date(Date.now() - sinceHours * 60 * 60 * 1000)
    where.createdAt = { gte: since }
  }
}

export async function queryLogs(filter: FilterOptions = {}): Promise<any[]> {
  const where: any = {}
  applyDateFilter(where, filter.sinceHours)
  if (filter.level) where.level = filter.level
  if (filter.module) where.module = filter.module
  if (filter.search) where.message = { contains: filter.search, mode: 'insensitive' }
  if (filter.traceId) where.metadata = { path: ['traceId'], contains: filter.traceId }

  return prisma.systemLog.findMany({
    where,
    orderBy: { createdAt: 'desc' as const },
    take: 200,
  })
}

export async function queryErrors(filter: FilterOptions = {}): Promise<any[]> {
  return queryLogs({ ...filter, level: 'ERROR' })
}

export async function queryByTraceId(traceId: string): Promise<any[]> {
  return prisma.systemLog.findMany({
    where: { metadata: { path: ['traceId'], contains: traceId } },
    orderBy: { createdAt: 'asc' as const },
  })
}
