import { prisma } from '@/lib/prisma'

interface FilterOptions {
  userId?: string
  level?: string
  module?: string
  sinceHours?: number
  traceId?: string
  search?: string
}

function applyDateFilter(where: Record<string, unknown>, sinceHours?: number): void {
  if (sinceHours) {
    const since = new Date(Date.now() - sinceHours * 60 * 60 * 1000)
    where.createdAt = { gte: since }
  }
}

export async function queryLogs(filter: FilterOptions = {}): Promise<unknown[]> {
  const where: Record<string, unknown> = {}
  applyDateFilter(where, filter.sinceHours)
  if (filter.level) where.level = filter.level
  if (filter.module) where.module = filter.module
  if (filter.search) where.message = { contains: filter.search, mode: 'insensitive' as const }
  // JSON path queries use raw queries
  if (filter.traceId) {
    // Use raw query for JSON path contains
    return prisma.$queryRaw`
      SELECT * FROM "SystemLog"
      WHERE "metadata"->>'traceId' = ${filter.traceId}
      ORDER BY "createdAt" DESC
      LIMIT 200
    `
  }

  return prisma.systemLog.findMany({
    where,
    orderBy: { createdAt: 'desc' as const },
    take: 200,
  }) as unknown as Promise<unknown[]>
}

export async function queryErrors(filter: FilterOptions = {}): Promise<unknown[]> {
  return queryLogs({ ...filter, level: 'ERROR' })
}

export async function queryByTraceId(traceId: string): Promise<unknown[]> {
  return prisma.$queryRaw`
    SELECT * FROM "SystemLog"
    WHERE "metadata"->>'traceId' = ${traceId}
    ORDER BY "createdAt" ASC
  ` as unknown as Promise<unknown[]>
}
