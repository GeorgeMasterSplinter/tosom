/**
 * Rate Limit Monitor — now uses SystemLog instead of deprecated RateLimitLog model.
 * Records rate-limit hits as systemLog entries with module='rateLimit'.
 */

import { LogLevel } from '@prisma/client'
import { prisma } from '@/lib/prisma'

export async function recordRateLimitHit(
  userId: string | null,
  route: string,
): Promise<void> {
   // RateLimitLog removed — now writes to systemLog with module='rateLimit'
  await prisma.systemLog.create({
    data: {
      level: LogLevel.WARN,
      message: `[RATE_LIMIT] ${route}`,
      module: 'rateLimit',
      metadata: JSON.parse(JSON.stringify({ route, userId })),
    },
  })
}

export async function getRateLimitStats(
  userId: string,
  lastHours = 24,
): Promise<{ total: number; routes: Record<string, number> }> {
   // RateLimitLog removed — now queries systemLog
  const since = new Date(Date.now() - lastHours * 60 * 60 * 1000)

  const total = await prisma.systemLog.count({
    where: {
      module: 'rateLimit',
      createdAt: { gte: since },
      metadata: {
        path: ['userId'],
        equals: userId,
      },
    },
  })

  const logs = await prisma.systemLog.findMany({
    where: {
      module: 'rateLimit',
      createdAt: { gte: since },
      metadata: {
        path: ['userId'],
        equals: userId,
      },
    },
    select: { message: true, metadata: true },
  })

  const routes: Record<string, number> = {}
  for (const log of logs) {
    // Parse [RATE_LIMIT] /api/foo format
    if (log.message && log.message.startsWith('[RATE_LIMIT]')) {
      const parts = log.message.split(' ')
      if (parts.length >= 2) {
        routes[parts[1]] = (routes[parts[1]] ?? 0) + 1
      }
    } else {
      // Fallback to metadata route
      const meta = log.metadata as Record<string, unknown> | null
      if (meta && typeof meta === 'object' && 'route' in meta) {
        const r = String(meta.route)
        routes[r] = (routes[r] ?? 0) + 1
      }
    }
  }

  return { total, routes }
}

export async function getGlobalRateLimitStats(
  lastHours = 24,
): Promise<{ total: number; byRoute: Record<string, number> }> {
   // RateLimitLog removed — now queries systemLog
  const since = new Date(Date.now() - lastHours * 60 * 60 * 1000)

  const total = await prisma.systemLog.count({
    where: { module: 'rateLimit', createdAt: { gte: since } },
  })

  const logs = await prisma.systemLog.findMany({
    where: { module: 'rateLimit', createdAt: { gte: since } },
    select: { message: true, metadata: true },
  })

  const byRoute: Record<string, number> = {}
  for (const log of logs) {
    if (log.message && log.message.startsWith('[RATE_LIMIT]')) {
      const parts = log.message.split(' ')
      if (parts.length >= 2) {
        byRoute[parts[1]] = (byRoute[parts[1]] ?? 0) + 1
      }
    } else {
      const meta = log.metadata as Record<string, unknown> | null
      if (meta && typeof meta === 'object' && 'route' in meta) {
        const r = String(meta.route)
        byRoute[r] = (byRoute[r] ?? 0) + 1
      }
    }
  }

  return { total, byRoute }
}
