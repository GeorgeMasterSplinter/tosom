/**
 * GET /api/admin/users
 * 
 * Hent alle brukere med pagination, rolle-filter og flag-status (admin).
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
    if (adminUser.role !== 'ADMIN') return errorResponse("Kun admin kan få tilgang til brukere", 403)

    const url = new URL(req.url)
    const queryResult = validateQuery(adminUsersQuerySchema, Object.fromEntries(url.searchParams.entries()))
    if (queryResult instanceof NextResponse) return queryResult
    const { page, limit, role: roleFilter, flaggedOnly, search } = queryResult.data

    const skip = (page - 1) * limit
    const where: Record<string, unknown> = {}
    if (roleFilter) where.role = roleFilter
    if (flaggedOnly) where.bannedAt = { not: null }
    if (search && search.trim()) {
      const q = search.trim().toLowerCase()
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { email: { contains: q, mode: 'insensitive' } },
      ]
    }

    // B4 — journey fjerna frå User (match-scoped nå), matchesA/matchesB lesast separat
    const [usersRaw, total] = await Promise.all([
      prisma.user.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' }, select: { id: true, email: true, name: true, role: true, verified: true, bannedAt: true, deletedAt: true, onboardingStep: true, onboardingComplete: true, deepProfileComplete: true, journeyState: true, lastMatchAt: true, lockedUntil: true, createdAt: true } }),
      prisma.user.count({ where }),
    ])

    // Ekte antall aktive matcher per bruker (A- eller B-side, status active)
    const matchCounts = usersRaw.length
      ? await prisma.match.groupBy({
          by: ['userAId', 'userBId'],
          where: { status: 'active' },
        })
      : []

    const activeCountFor = (userId: string): number =>
      matchCounts.reduce(
        (sum, m) => sum + (m.userAId === userId ? 1 : 0) + (m.userBId === userId ? 1 : 0),
        0,
      )

    const users = usersRaw.map(u => ({
      ...u,
      activeMatches: activeCountFor(u.id),
    }))

    return successResponse({ data: users, pagination: { page, limit, total, pages: Math.ceil(total / limit) } })
  } catch (error) {
    console.error('[GET /api/admin/users] Error:', error)
    return NextResponse.json({ error: 'Internt feil' }, { status: 500 })
  }
}