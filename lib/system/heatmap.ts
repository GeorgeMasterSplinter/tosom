/**
 * ToSom API Heatmap
 * 
 * Følgjer route-hit frequency for observability.
 * Uses SystemLog instead of removed RouteHit model (stability-cleanup).
 */

import { LogLevel } from "@prisma/client"
import { prisma } from '@/lib/prisma'

export async function recordRouteHit(
  route: string,
  method: string = 'GET',
  status: number = 200,
): Promise<void> {
  // RouteHit model removed in stability-cleanup — now writes to systemLog
  await prisma.systemLog.create({
    data: { 
      level: LogLevel.INFO,
      message: `[ROUTE] ${method} ${route} → ${status}`,
      module: 'heatmap',
      metadata: JSON.parse(JSON.stringify({ route, method, status })),
    },
  })
}

export async function getRouteStats(sinceHours: number = 24): Promise<{
  totalHits: number
  byRoute: Record<string, number>
  topRoutes: Array<{ route: string; count: number }>
}> {
  const since = new Date(Date.now() - sinceHours * 60 * 60 * 1000)

  // RouteHit removed — query systemLog for heatmap data
  const totalHits = await prisma.systemLog.count({
    where: { module: 'heatmap', createdAt: { gte: since } },
  })

  const logs = await prisma.systemLog.findMany({
    where: { module: 'heatmap', createdAt: { gte: since } },
    select: { metadata: true },
  })

  const byRoute: Record<string, number> = {}
  for (const log of logs) {
    const meta = log.metadata as Record<string, unknown> | null
    if (meta && typeof meta === 'object' && 'route' in meta) {
      const r = String(meta.route)
      byRoute[r] = (byRoute[r] ?? 0) + 1
    }
  }

  const topRoutes = Object.entries(byRoute)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([route, count]) => ({ route, count }))

  return { totalHits, byRoute, topRoutes }
}
