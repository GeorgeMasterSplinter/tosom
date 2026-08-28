/**
 * GET /api/admin/matches
 * 
 * Hent alle matcher med pagination, status-filter (admin).
 * Pakke 4.4.4 — Match Inspector
 * Pakke 5.1 — Zod-validering
 */

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/auth/requireAuth'
import { castToAdminUser } from '@/lib/auth/admin-auth'
import { errorResponse, successResponse, validateQuery } from '@/lib/api-validator'

export const dynamic = 'force-dynamic'

const validStatuses = ['pending', 'active', 'matched', 'expired', 'ended', 'unmatched'] as const
type ValidStatus = typeof validStatuses[number]

export async function GET(req: NextRequest) {
  try {
    const result = await requireAuth(req)
    if (result instanceof NextResponse) return result
    const adminUser = castToAdminUser(result.user)
    if (adminUser.role !== 'ADMIN') return errorResponse("Kun admin kan få tilgang til matcher", 403)

    const url = new URL(req.url)
    const page = Math.min(Math.max(parseInt(url.searchParams.get('page') ?? '') || 1, 1), 100)
    const limit = Math.min(Math.max(parseInt(url.searchParams.get('limit') ?? '') || 20, 1), 50)
    const statusFilter = url.searchParams.get('status') as ValidStatus | undefined
    
    if (statusFilter && !validStatuses.includes(statusFilter)) {
      return errorResponse(`Ugyldig status. Gyldige: ${validStatuses.join(', ')}`)
    }

    const skip = (page - 1) * limit
    const where: Record<string, unknown> = statusFilter ? { status: statusFilter } : {}

    const [matches, total] = await Promise.all([
      prisma.match.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' }, select: { id: true, userAId: true, userBId: true, status: true, score: true, normalizedScore: true, resonanceLevel: true, reviewed: true, lockedAt: true, expiresAt: true, createdAt: true, userA: { select: { id: true, email: true, name: true, role: true } }, userB: { select: { id: true, email: true, name: true, role: true } } } }),
      prisma.match.count({ where }),
    ])

    return successResponse({ data: matches, pagination: { page, limit, total, pages: Math.ceil(total / limit) } })
  } catch (error) {
    console.error('[GET /api/admin/matches] Error:', error)
    return NextResponse.json({ error: 'Internt feil' }, { status: 500 })
  }
}