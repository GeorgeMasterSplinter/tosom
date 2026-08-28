/**
 * PATCH /api/admin/journey-content/[day]
 * 
 * Oppdater JourneyDayContent for ein bestemt dag (admin).
 * Pakke 4.4.1 — JourneyDayContent Editor
 * Pakke 5.1 — Zod-validering
 */

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/auth/requireAuth'
import { castToAdminUser } from '@/lib/auth/admin-auth'
import { validateBody, errorResponse, successResponse } from '@/lib/api-validator'
import { journeyDayUpdateSchema } from '@/lib/api-validator'

export const dynamic = 'force-dynamic'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ day: string }> }
) {
  try {
    // Auth + Admin-krav
    const result = await requireAuth(req)
    if (result instanceof NextResponse) return result
    const user = result.user
    const adminUser = castToAdminUser(user)

    if (adminUser.role !== 'ADMIN') {
      return errorResponse("Kun admin kan oppdatere journey-innhold", 403)
    }

    // Valider day fra params
    const dayStr = await Promise.resolve(params).then(p => p.day)
    const day = parseInt(dayStr)
    if (isNaN(day) || day < 1 || day > 30) {
      return errorResponse('Ugyldig dag. Må være mellom 1 og 30.', 400)
    }

    // Valider body med Zod
    const bodyResult = await validateBody(journeyDayUpdateSchema, req)
    if (bodyResult instanceof NextResponse) return bodyResult
    const { theme, phase, reflectionQuestion, conversationPrompt, task, resonanceGoal } = bodyResult.data

    // Oppdater eller opprett record
    const content = await prisma.journeyDayContent.upsert({
      where: { day },
      update: { theme, phase: phase as any, reflectionQuestion, conversationPrompt, task: task ?? null, resonanceGoal },
      create: { day, theme: theme ?? `Dag ${day}`, phase: (phase ?? 'EARLY') as any, reflectionQuestion, conversationPrompt, task: task ?? null, resonanceGoal: resonanceGoal ?? '' },
    })

    return successResponse({ data: content, message: `Dag ${day} oppdatert.` })
  } catch (error) {
    console.error('[PATCH /api/admin/journey-content/[day]] Error:', error)
    return NextResponse.json({ error: 'Internt feil' }, { status: 500 })
  }
}