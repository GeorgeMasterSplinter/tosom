/**
 * ToSom Performance Metrics
 * 
 * Mål API- og DB-latency for observability.
 */

import { prisma } from '@/lib/prisma'

const timerStart = new Map<string, number>()

export function startTimer(label: string): void {
  timerStart.set(label, Date.now())
}

export function endTimer(label: string): number | null {
  const start = timerStart.get(label)
  if (!start) return null
  const elapsed = Date.now() - start
  timerStart.delete(label)
  return elapsed
}

export async function recordAPILatency(route: string, ms: number): Promise<void> {
  await prisma.performanceMetric.create({
    data: { route, metric: 'api_latency', valueMs: ms },
  })
}

export async function recordDBLatency(query: string, ms: number): Promise<void> {
  await prisma.performanceMetric.create({
    data: { route: query, metric: 'db_latency', valueMs: ms },
  })
}

export async function getAvgLatency(route: string, lastMinutes = 5): Promise<number> {
  const since = new Date(Date.now() - lastMinutes * 60 * 1000)
  const metrics = await prisma.performanceMetric.findMany({
    where: {
      route,
      metric: 'api_latency',
      createdAt: { gte: since },
    },
    select: { valueMs: true },
  })
  if (metrics.length === 0) return 0
  return metrics.reduce((a, b) => a + b.valueMs, 0) / metrics.length
}

export async function getAvgDBLatency(lastMinutes = 5): Promise<number> {
  const since = new Date(Date.now() - lastMinutes * 60 * 1000)
  const metrics = await prisma.performanceMetric.findMany({
    where: {
      metric: 'db_latency',
      createdAt: { gte: since },
    },
    select: { valueMs: true },
  })
  if (metrics.length === 0) return 0
  return metrics.reduce((a, b) => a + b.valueMs, 0) / metrics.length
}
