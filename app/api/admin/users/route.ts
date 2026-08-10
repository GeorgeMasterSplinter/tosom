/**
 * GET /api/admin/users
 * 
 * Hent alle brukarar med pagination, rolle-filter og flag-status (admin).
 * Pakke 4.4.3 — User Flags & Moderation Tools
 * Pakke 5.1 — Zod-validering
 */

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/auth/requireAuth'
import { castToAdminUser } from '@/lib/auth/admin-auth'
import { errorResponse, successResponse, validateQuery } from '@/lib/api-validator'
import { adminUsersQuerySchema } from '@/lib/api-validator'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const result = await requireAuth(req)
    if (result instanceof NextResponse) return result
    const adminUser = castToAdminUser(result.user)
    if (adminUser.role !== 'ADMIN') return errorResponse("Berre admin kan få tilgang til brukarar", 403)

    const url = new URL(req.url)
    const queryResult = validateQuery(adminUsersQuerySchema, Object.fromEntries(url.searchParams.entries()))
    if (queryResult instanceof NextResponse) return queryResult
    const { page, limit, role: roleFilter, flaggedOnly } = queryResult.data

    const skip = (page - 1) * limit
    const where: Record<string, unknown> = {}
    if (roleFilter) where.role = roleFilter
    if (flaggedOnly) where.bannedAt = { not: null }

    const [users, total] = await Promise.all([
      prisma.user.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' }, select: { id: true, email: true, name: true, role: true, verified: true, bannedAt: true, deletedAt: true, onboardingComplete: true, deepProfileComplete: true, lastMatchAt: true, lockedUntil: true, createdAt: true, journey: { select: { day: true, phase: true, completedDays: true } }, matchesA: { where: { status: 'active' }, select: { id: true } }, matchesB: { where: { status: 'active' }, select: { id: true } } } }),
      prisma.user.count({ where }),
    ])

    return successResponse({ data: users.map(u => ({ ...u, activeMatches: u.matchesA.length + u.matchesB.length })), pagination: { page, limit, total, pages: Math.ceil(total / limit) } })
  } catch (error) {
    console.error('[GET /api/admin/users] Error:', error)
    return NextResponse.json({ error: 'Internt feil' }, { status: 500 })
  }
}