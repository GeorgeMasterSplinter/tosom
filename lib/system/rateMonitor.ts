import { prisma } from '@/lib/prisma'

export async function recordRateLimitHit(
  userId: string | null,
  route: string,
): Promise<void> {
  await prisma.rateLimitLog.create({
    data: {
      userId: userId ?? undefined,
      route,
    },
  })
}

export async function getRateLimitStats(
  userId: string,
  lastHours = 24,
): Promise<{ total: number; routes: Record<string, number> }> {
  const since = new Date(Date.now() - lastHours * 60 * 60 * 1000)

  const total = await prisma.rateLimitLog.count({
    where: { userId, createdAt: { gte: since } },
  })

  const logs = await prisma.rateLimitLog.findMany({
    where: { userId, createdAt: { gte: since } },
    select: { route: true },
  })

  const routes: Record<string, number> = {}
  for (const log of logs) {
    routes[log.route] = (routes[log.route] ?? 0) + 1
  }

  return { total, routes }
}

export async function getGlobalRateLimitStats(
  lastHours = 24,
): Promise<{ total: number; byRoute: Record<string, number> }> {
  const since = new Date(Date.now() - lastHours * 60 * 60 * 1000)

  const total = await prisma.rateLimitLog.count({
    where: { createdAt: { gte: since } },
  })

  const logs = await prisma.rateLimitLog.findMany({
    where: { createdAt: { gte: since } },
    select: { route: true },
  })

  const byRoute: Record<string, number> = {}
  for (const log of logs) {
    byRoute[log.route] = (byRoute[log.route] ?? 0) + 1
  }

  return { total, byRoute }
}
