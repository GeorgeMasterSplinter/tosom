/**
 * GET /api/admin/journey-content
 * 
 * Hent alle JourneyDayContent-records (admin).
 * Pakke 4.4.1 — JourneyDayContent Editor
 * Pakke 5.1 — Zod-validering
 */

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/auth/requireAuth'
import { castToAdminUser } from '@/lib/auth/admin-auth'
import { errorResponse } from '@/lib/api-validator'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    // Auth + Admin-krav
    const result = await requireAuth(req)
    if (result instanceof NextResponse) return result
    const user = result.user
    const adminUser = castToAdminUser(user)

    if (adminUser.role !== 'ADMIN') {
      return errorResponse("Berre admin kan få tilgang til journey-innhald", 403)
    }

    // Hent alle 30 dagar, sortert på day
    const content = await prisma.journeyDayContent.findMany({
      orderBy: { day: 'asc' },
    })

    return NextResponse.json({
      success: true,
      data: content,
      total: content.length,
    })
  } catch (error) {
    console.error('[GET /api/admin/journey-content] Error:', error)
    return NextResponse.json(
      { error: 'Internt feil' },
      { status: 500 }
    )
  }
}