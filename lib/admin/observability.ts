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
   // RouteHit model removed in stability-cleanup — now queries systemLog (module='heatmap')
  const since = new Date(Date.now() - sinceHours * 60 * 60 * 1000)

  const totalHits = await prisma.systemLog.count({
    where: { module: 'heatmap', createdAt: { gte: since } },
  })

  const logs = await prisma.systemLog.findMany({
    where: { module: 'heatmap', createdAt: { gte: since } },
    select: { metadata: true, message: true },
  })

  const byRoute: Record<string, number> = {}
  const byMethod: Record<string, number> = {}
  const byStatus: Record<string, number> = {}

  for (const log of logs) {
    const meta = log.metadata as Record<string, unknown> | null
    if (meta && typeof meta === 'object') {
      const r = String(meta.route ?? '')
      const m = String(meta.method ?? '')
      const s = String(meta.status ?? '')
      byRoute[r] = (byRoute[r] ?? 0) + 1
      byMethod[m] = (byMethod[m] ?? 0) + 1
      byStatus[s] = (byStatus[s] ?? 0) + 1
    } else if (log.message && log.message.startsWith('[ROUTE]')) {
      // Parse [ROUTE] GET /api/foo → 200 format
      const parts = log.message.split(' ')
      if (parts.length >= 3) {
        byMethod[parts[1]] = (byMethod[parts[1]] ?? 0) + 1
        const statusStr = parts[parts.length - 1]
        const statusCode = parseInt(statusStr, 10)
        if (!isNaN(statusCode)) {
          byStatus[String(statusCode)] = (byStatus[String(statusCode)] ?? 0) + 1
        }
      }
    }
  }

  const topRoutes = Object.entries(byRoute)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([route, count]) => ({ route, count }))

  return { totalHits, byRoute, topRoutes, byMethod, byStatus }
}

export async function getTraceDetails(traceId: string): Promise<any[]> {
  // SystemLog metadata is Json — use raw SQL for JSON containment
  const rows = await prisma.$queryRaw<any[]>`
    SELECT * FROM "SystemLog"
    WHERE "metadata"::text LIKE '%' || ${traceId} || '%'
    ORDER BY "createdAt" ASC
  `
  return rows
}
