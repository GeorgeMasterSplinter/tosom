/**
 * ToSom Anomaly Detection (Basic)
 * 
 * Oppdagar unormale mønster i systemet.
 * Lagrar resultat i SystemLog (level="warn").
 */

import { prisma } from '@/lib/prisma'
import { logWarn } from '@/lib/system/log'

export async function detectErrorSpike(lastMinutes: number = 15): Promise<boolean> {
  const since = new Date(Date.now() - lastMinutes * 60 * 1000)
  const count = await prisma.systemLog.count({
    where: { level: 'ERROR', createdAt: { gte: since } },
  })
  // Alert hvis > 50 error i 15 min
  if (count > 50) {
    await logWarn(`Error spike detected: ${count} errors in ${lastMinutes}min`, 'system/anomaly', {
      type: 'error_spike',
      count,
      lastMinutes,
    })
    return true
  }
  return false
}

export async function detectLatencySpike(
  route: string,
  thresholdMs: number = 5000,
  lastMinutes: number = 5,
): Promise<boolean> {
  const since = new Date(Date.now() - lastMinutes * 60 * 1000)
  const metrics = await prisma.performanceMetric.findMany({
    where: {
      route,
      metric: 'api_latency',
      createdAt: { gte: since },
    },
    select: { valueMs: true },
  })
  if (metrics.length === 0) return false
  const avg = metrics.reduce((a, b) => a + b.valueMs, 0) / metrics.length
  if (avg > thresholdMs) {
    await logWarn(`Latency spike: ${avg.toFixed(0)}ms > ${thresholdMs}ms`, 'system/anomaly', {
      type: 'latency_spike',
      route,
      avgLatency: Math.round(avg),
      threshold: thresholdMs,
    })
    return true
  }
  return false
}

export async function detectRateLimitSpike(lastMinutes: number = 15): Promise<boolean> {
  const since = new Date(Date.now() - lastMinutes * 60 * 1000)
  const count = await prisma.rateLimitLog.count({
    where: { createdAt: { gte: since } },
  })
  if (count > 100) {
    await logWarn(`Rate limit spike: ${count} hits in ${lastMinutes}min`, 'system/anomaly', {
      type: 'rate_limit_spike',
      count,
      lastMinutes,
    })
    return true
  }
  return false
}

export async function detectAllAnomalies(): Promise<{ anomalies: string[] }> {
  const anomalies: string[] = []
  if (await detectErrorSpike()) anomalies.push('error_spike')
  if (await detectRateLimitSpike()) anomalies.push('rate_limit_spike')
  return { anomalies }
}
