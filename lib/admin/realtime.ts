/**
 * ToSom Admin Realtime
 * 
 * Sanntids-oversikt for admin dashboard.
 */

import { prisma } from '@/lib/prisma'
import { detectAllAnomalies } from '@/lib/system/anomaly'

const FIVE_MIN = 5 * 60 * 1000

export async function getRealtimeSystemStats(): Promise<{
  currentLatency: number
  currentDBLatency: number
  requestsPerMinute: number
  errorsLast5Min: number
  rateLimitHitsLast5Min: number
  anomalyFlags: string[]
}> {
  const since = new Date(Date.now() - FIVE_MIN)

  // Avg latency
  const latencyMetrics = await prisma.performanceMetric.findMany({
    where: { metric: 'api_latency', createdAt: { gte: since } },
    select: { valueMs: true },
  })
  const currentLatency = latencyMetrics.length > 0
    ? latencyMetrics.reduce((a, b) => a + b.valueMs, 0) / latencyMetrics.length
    : 0

  // Avg DB latency
  const dbMetrics = await prisma.performanceMetric.findMany({
    where: { metric: 'db_latency', createdAt: { gte: since } },
    select: { valueMs: true },
  })
  const currentDBLatency = dbMetrics.length > 0
    ? dbMetrics.reduce((a, b) => a + b.valueMs, 0) / dbMetrics.length
    : 0

   // Requests per minute — RouteHit removed, now queries systemLog (module='heartbeat')
  const routeHits = await prisma.systemLog.count({ 
    where: { module: 'heartbeat', createdAt: { gte: since } }, 
  })
  const requestsPerMinute = Math.round((routeHits / 5) * 10) / 10

  // Errors last 5 min
  const errorsLast5Min = await prisma.systemLog.count({
    where: { level: 'ERROR', createdAt: { gte: since } },
  })

  // Rate limit hits — RateLimitLog removed, now query systemLog for rate-limit warnings
  const rateLimitHits = await prisma.systemLog.count({ 
    where: { module: 'rateLimit', createdAt: { gte: since } }, 
  })

  // Anomalies
  const anomalies = await detectAllAnomalies()

  return {
    currentLatency: Math.round(currentLatency),
    currentDBLatency: Math.round(currentDBLatency),
    requestsPerMinute,
    errorsLast5Min,
    rateLimitHitsLast5Min: rateLimitHits,
    anomalyFlags: anomalies.anomalies,
  }
}
