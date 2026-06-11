/**
 * ToSom Admin Audit Logging
 * 
 * Loggar alle admin-handlinger for sporing og compliance.
 */

import { prisma } from '@/lib/prisma'
import type { AuditAction } from '@prisma/client'

export async function recordAdminAction(
  adminId: string,
  action: AuditAction,
  metadata?: Record<string, unknown>,
): Promise<void> {
  await prisma.auditLog.create({
    data: {
      adminId,
      action,
      metadata: metadata ? JSON.stringify(metadata) : null,
    },
  })
}

export async function getAuditLogSummary(sinceHours = 24): Promise<{
  totalActions: number
  byAction: Record<string, number>
  topAdmins: Array<{ adminId: string; count: number }>
  recentActions: Array<{ action: string; adminId: string; createdAt: Date }>
}> {
  const since = new Date(Date.now() - sinceHours * 60 * 60 * 1000)

  const totalActions = await prisma.auditLog.count({
    where: { createdAt: { gte: since } },
  })

  const logs = await prisma.auditLog.findMany({
    where: { createdAt: { gte: since } },
    select: { action: true, adminId: true, createdAt: true },
    take: 100,
    orderBy: { createdAt: 'desc' as const },
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

  return {
    totalActions,
    byAction,
    topAdmins,
    recentActions: logs,
  }
}

export async function getAuditLogs(filter: {
  adminId?: string
  action?: string
  sinceHours?: number
}): Promise<any[]> {
  const where: any = {}

  if (filter.adminId) where.adminId = filter.adminId
  if (filter.action) where.action = filter.action as AuditAction
  if (filter.sinceHours) {
    where.createdAt = {
      gte: new Date(Date.now() - filter.sinceHours * 60 * 60 * 1000),
    }
  }

  return prisma.auditLog.findMany({
    where,
    orderBy: { createdAt: 'desc' as const },
    take: 200,
  })
}
