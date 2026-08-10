/**
 * GET /api/admin/system-logs
 * 
 * Hent systemlogg med pagination og module-filter (admin).
 * Pakke 4.4.5 — System Logs Viewer
 * Pakke 5.1 — Zod-validering
 */

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/auth/requireAuth'
import { castToAdminUser } from '@/lib/auth/admin-auth'
import { errorResponse, successResponse, validateQuery } from '@/lib/api-validator'
import { systemLogsQuerySchema } from '@/lib/api-validator'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const result = await requireAuth(req)
    if (result instanceof NextResponse) return result
    const adminUser = castToAdminUser(result.user)
    if (adminUser.role !== 'ADMIN') return errorResponse("Berre admin kan få tilgang til systemloggar", 403)

    const url = new URL(req.url)
    const queryResult = validateQuery(systemLogsQuerySchema, Object.fromEntries(url.searchParams.entries()))
    if (queryResult instanceof NextResponse) return queryResult
    const { page, limit, module: moduleFilter, level: levelFilter, search } = queryResult.data

    const skip = (page - 1) * limit
    const where: Record<string, unknown> = {}
    if (moduleFilter) where.module = moduleFilter
    if (levelFilter) where.level = levelFilter
    if (search) where.OR = [{ message: { contains: search, mode: 'insensitive' } }, { metadata: { contains: search, mode: 'insensitive' } }]

    const [logs, total] = await Promise.all([
      prisma.systemLog.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' }, select: { id: true, level: true, message: true, module: true, metadata: true, createdAt: true } }),
      prisma.systemLog.count({ where }),
    ])

    const [errorCount, warningCount, infoCount] = await Promise.all([
      prisma.systemLog.count({ where: { ...where, level: 'ERROR' } }),
      prisma.systemLog.count({ where: { ...where, level: 'WARN' } }),
      prisma.systemLog.count({ where: { ...where, level: 'INFO' } }),
    ])

    return successResponse({ data: logs, stats: { errorCount, warningCount, infoCount, total }, pagination: { page, limit, total, pages: Math.ceil(total / limit) } })
  } catch (error) {
    console.error('[GET /api/admin/system-logs] Error:', error)
    return NextResponse.json({ error: 'Internt feil' }, { status: 500 })
  }
}