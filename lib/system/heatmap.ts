/**
 * ToSom API Heatmap
 * 
 * Følgjer route-hit frequency for observability.
 */

import { HttpMethod } from "@prisma/client"
import { prisma } from '@/lib/prisma'

export async function recordRouteHit(
  route: string,
  method: string = 'GET',
  status: number = 200,
): Promise<void> {
  await prisma.routeHit.create({
    data: { 
      route, 
      method: method as HttpMethod, 
      status 
    },
  })
}

export async function getRouteStats(sinceHours: number = 24): Promise<{
  totalHits: number
  byRoute: Record<string, number>
  topRoutes: Array<{ route: string; count: number }>
}> {
  const since = new Date(Date.now() - sinceHours * 60 * 60 * 1000)

  const totalHits = await prisma.routeHit.count({
    where: { createdAt: { gte: since } },
  })

  const logs = await prisma.routeHit.findMany({
    where: { createdAt: { gte: since } },
    select: { route: true },
  })

  const byRoute: Record<string, number> = {}
  for (const log of logs) {
    byRoute[log.route] = (byRoute[log.route] ?? 0) + 1
  }

  const topRoutes = Object.entries(byRoute)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([route, count]) => ({ route, count }))

  return { totalHits, byRoute, topRoutes }
}
