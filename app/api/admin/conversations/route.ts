/**
 * GET /api/admin/conversations
 * 
 * Hent conversations med pagination, sortering og freeze-filter (admin).
 * Pakke 4.4.2 — Conversation Unlock/Freeze
 * Pakke 5.1 — Zod-validering
 */

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/auth/requireAuth'
import { castToAdminUser } from '@/lib/auth/admin-auth'
import { errorResponse, successResponse, validateQuery } from '@/lib/api-validator'
import { adminConversationsQuerySchema } from '@/lib/api-validator'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const result = await requireAuth(req)
    if (result instanceof NextResponse) return result
    const adminUser = castToAdminUser(result.user)
    if (adminUser.role !== 'ADMIN') return errorResponse("Kun admin kan f\u00e5 tilgang til conversations", 403)

    const url = new URL(req.url)
    const queryResult = validateQuery(adminConversationsQuerySchema, Object.fromEntries(url.searchParams.entries()))
    if (queryResult instanceof NextResponse) return queryResult
    const { page, limit, frozenOnly } = queryResult.data

    const skip = (page - 1) * limit
    const where: Record<string, unknown> = frozenOnly ? { frozenAt: { not: null } } : {}

    const [conversations, total] = await Promise.all([
      prisma.conversation.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          userAId: true,
          userBId: true,
          matchId: true,
          frozenAt: true,
          frozenBy: true,
          endedAt: true,
          lastMessageAt: true,
          createdAt: true,
          imageShared: true,
          imageShareAllowedAt: true,
          userA: { select: { id: true, email: true, name: true, role: true } },
          userB: { select: { id: true, email: true, name: true, role: true } },
          _count: { select: { messages: true } }
        }
      }),
      prisma.conversation.count({ where }),
    ])

    return successResponse({ data: conversations, pagination: { page, limit, total, pages: Math.ceil(total / limit) } })
  } catch (error) {
    console.error('[GET /api/admin/conversations] Error:', error)
    return NextResponse.json({ error: 'Internt feil' }, { status: 500 })
  }
}