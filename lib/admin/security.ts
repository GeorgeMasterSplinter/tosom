/**
 * ToSom Admin Security Dashboard
 * 
 * Sanitasjonsoversikt for admin.
 */

import { prisma } from '@/lib/prisma'

export async function getFailedLoginStats(sinceHours = 24): Promise<{
  totalFailedLogins: number
  byIp: Record<string, number>
  byEmail: Record<string, number>
}> {
  const since = new Date(Date.now() - sinceHours * 60 * 60 * 1000)

  const logs = await prisma.systemLog.findMany({
    where: {
      level: 'WARN',
      createdAt: { gte: since },
      module: 'security/bruteforce',
    },
    select: { metadata: true },
  })

  const byIp: Record<string, number> = {}
  const byEmail: Record<string, number> = {}

  for (const log of logs) {
    const meta = log.metadata as Record<string, unknown>
    if (meta?.ip) {
      const ip = String(meta.ip)
      byIp[ip] = (byIp[ip] ?? 0) + 1
    }
    if (meta?.email) {
      const email = String(meta.email)
      byEmail[email] = (byEmail[email] ?? 0) + 1
    }
  }

  const totalFailedLogins = await prisma.systemLog.count({
    where: {
      level: 'WARN',
      createdAt: { gte: since },
      module: 'security/bruteforce',
    },
  })

  return { totalFailedLogins, byIp, byEmail }
}

export async function getRateLimitStats(sinceHours = 24): Promise<{
  totalHits: number
  byRoute: Record<string, number>
  byUser: Record<string, number>
}> {
   // RateLimitLog removed in stability-cleanup — now queries systemLog for rate-limit data
  const since = new Date(Date.now() - sinceHours * 60 * 60 * 1000)

  const totalHits = await prisma.systemLog.count({
    where: { module: 'rateLimit', createdAt: { gte: since } },
  })

  const logs = await prisma.systemLog.findMany({
    where: { module: 'rateLimit', createdAt: { gte: since } },
    select: { message: true, metadata: true },
  })

  const byRoute: Record<string, number> = {}
  const byUser: Record<string, number> = {}

  for (const log of logs) {
    // Parse [RATE_LIMIT] /api/foo user=xxx format
    if (log.message && log.message.startsWith('[RATE_LIMIT]')) {
      const parts = log.message.split(' ')
      if (parts.length >= 2) {
        byRoute[parts[1]] = (byRoute[parts[1]] ?? 0) + 1
      }
    }
    const meta = log.metadata as Record<string, unknown> | null
    if (meta && typeof meta === 'object' && 'userId' in meta) {
      byUser[String(meta.userId)] = (byUser[String(meta.userId)] ?? 0) + 1
    }
  }

  return { totalHits, byRoute, byUser }
}

export async function getActiveSessions(sinceHours = 24): Promise<{
  totalActive: number
  recentLogins: number
  suspiciousLogins: number
}> {
  const since = new Date(Date.now() - sinceHours * 60 * 60 * 1000)

  const totalActive = await prisma.systemLog.count({
    where: {
      level: 'INFO',
      createdAt: { gte: since },
      message: { contains: 'Login', mode: 'insensitive' },
    },
  })

  const recentLogins = totalActive

  const suspiciousLogins = await prisma.systemLog.count({
    where: {
      level: 'WARN',
      createdAt: { gte: since },
      message: { contains: 'anomaly', mode: 'insensitive' },
    },
  })

  return { totalActive, recentLogins, suspiciousLogins }
}

export async function getAuditLogSummary(sinceHours = 24): Promise<{
  totalActions: number
  byAction: Record<string, number>
  topAdmins: Array<{ adminId: string; count: number }>
  suspiciousActions: number
}> {
  const since = new Date(Date.now() - sinceHours * 60 * 60 * 1000)

  const totalActions = await prisma.auditLog.count({
    where: { createdAt: { gte: since } },
  })

  const logs = await prisma.auditLog.findMany({
    where: { createdAt: { gte: since } },
    select: { action: true, adminId: true },
    take: 200,
  })

  const byAction: Record<string, number> = {}
  const adminCounts: Record<string, number> = {}

  for (const log of logs) {
    byAction[log.action] = (byAction[log.action] ?? 0) + 1
    adminCounts[log.adminId] = (adminCounts[log.adminId] ?? 0) + 1
  }

  const topAdmins = Object.entries(adminCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([adminId, count]) => ({ adminId, count }))

  const suspiciousActions = await prisma.auditLog.count({
    where: {
      createdAt: { gte: since },
      action: { in: ['USER_BAN', 'USER_DEACTIVATE', 'CONTENT_DELETE'] },
    },
  })

  return { totalActions, byAction, topAdmins, suspiciousActions }
}
