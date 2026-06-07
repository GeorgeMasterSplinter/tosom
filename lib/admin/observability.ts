import { prisma } from '@/lib/prisma'

export async function getPerformanceMetrics(filter: {
  route?: string
  metric?: string
  sinceHours?: number
  limit?: number
}) {
  const where: any = {}
  if (filter.route) where.route = filter.route
  if (filter.metric) where.metric = filter.metric
  if (filter.sinceHours) {
    where.createdAt = {
      gte: new Date(Date.now() - filter.sinceHours * 60 * 60 * 1000),
    }
  }

  const metrics = await prisma.performanceMetric.findMany({
    where,
    orderBy: { createdAt: 'desc' as const },
    take: filter.limit ?? 200,
  })

  return metrics
}

export async function getRouteHeatmap(sinceHours: number = 24): Promise<{
  totalHits: number
  byRoute: Record<string, number>
  topRoutes: Array<{ route: string; count: number }>
  byMethod: Record<string, number>
  byStatus: Record<string, number>
}> {
  const since = new Date(Date.now() - sinceHours * 60 * 60 * 1000)

  const totalHits = await prisma.routeHit.count({
    where: { createdAt: { gte: since } },
  })

  const logs = await prisma.routeHit.findMany({
    where: { createdAt: { gte: since } },
    select: { route: true, method: true, status: true },
  })

  const byRoute: Record<string, number> = {}
  const byMethod: Record<string, number> = {}
  const byStatus: Record<string, number> = {}

  for (const log of logs) {
    byRoute[log.route] = (byRoute[log.route] ?? 0) + 1
    byMethod[log.method] = (byMethod[log.method] ?? 0) + 1
    byStatus[String(log.status)] = (byStatus[String(log.status)] ?? 0) + 1
  }

  const topRoutes = Object.entries(byRoute)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([route, count]) => ({ route, count }))

  return { totalHits, byRoute, topRoutes, byMethod, byStatus }
}

export async function getTraceDetails(traceId: string): Promise<any[]> {
  return prisma.systemLog.findMany({
    where: { metadata: { path: ['traceId'], contains: traceId } },
    orderBy: { createdAt: 'asc' as const },
  })
}
