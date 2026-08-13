/**
 * GET /api/admin/matches/[id]/inspector
 * 
 * Full match-inspeksjon med all metadata (admin).
 * Pakke 4.4.4 — Match Inspector
 * Pakke 5.1 — Zod-validering
 */

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/auth/requireAuth'
import { castToAdminUser } from '@/lib/auth/admin-auth'
import { errorResponse, successResponse, isValidObjectId } from '@/lib/api-validator'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const result = await requireAuth(req)
    if (result instanceof NextResponse) return result
    const adminUser = castToAdminUser(result.user)
    if (adminUser.role !== 'ADMIN') return errorResponse("Berre admin kan få tilgang til match-inspeksjon", 403)

    const matchId = (await params).id
    if (!isValidObjectId(matchId)) return errorResponse('Ugyldig match ID.', 400)

    const match = await prisma.match.findUnique({
      where: { id: matchId },
      select: {
        id: true, userAId: true, userBId: true, status: true, score: true, normalizedScore: true,
        resonanceLevel: true, type: true, explanation: true, scoringBreakdown: true, reviewed: true,
        lockedAt: true, expiresAt: true, createdAt: true, updatedAt: true,
        userA: { select: { id: true, email: true, name: true, role: true, verified: true, bannedAt: true, onboardingComplete: true, deepProfileComplete: true, createdAt: true, lastMatchAt: true } },
        userB: { select: { id: true, email: true, name: true, role: true, verified: true, bannedAt: true, onboardingComplete: true, deepProfileComplete: true, createdAt: true, lastMatchAt: true } },
      },
    })
    if (!match) return errorResponse('Match ikke funnen', 404)

    const [journeyA, journeyB] = await Promise.all([
      prisma.journeyProgress.findFirst({ where: { userId: match.userAId } }),
      prisma.journeyProgress.findFirst({ where: { userId: match.userBId } }),
    ])

    const conversation = await prisma.conversation.findFirst({
      where: { matchId: match.id },
      select: { id: true, frozenAt: true, frozenBy: true, endedAt: true, lastMessageAt: true, createdAt: true, imageShared: true, messages: { orderBy: { createdAt: 'desc' }, take: 5, select: { id: true, type: true, content: true, createdAt: true } }, resonanceSessions: { orderBy: { day: 'asc' }, select: { id: true, day: true, emotionalTone: true, depthLevel: true, summary: true, createdAt: true } } },
    })

    const resonanceSessions = conversation?.resonanceSessions || []

    return successResponse({
      data: {
        match: { ...match, resonanceLevelStr: match.resonanceLevel },
        userA: { ...match.userA, journey: journeyA ? { day: journeyA.day, phase: journeyA.phase, completedDays: journeyA.completedDays, startedAt: journeyA.startedAt } : null },
        userB: { ...match.userB, journey: journeyB ? { day: journeyB.day, phase: journeyB.phase, completedDays: journeyB.completedDays, startedAt: journeyB.startedAt } : null },
        conversation: conversation ? { id: conversation.id, frozenAt: conversation.frozenAt, frozenBy: conversation.frozenBy, endedAt: conversation.endedAt, lastMessageAt: conversation.lastMessageAt, imageShared: conversation.imageShared, messageCount: conversation.messages.length, recentMessages: conversation.messages, resonanceSessions: resonanceSessions.map(s => ({ day: s.day, emotionalTone: s.emotionalTone, depthLevel: s.depthLevel, summary: s.summary?.substring(0, 200), createdAt: s.createdAt.toISOString() })), totalResonanceSessions: resonanceSessions.length } : null,
      },
    })
  } catch (error) {
    console.error('[GET /api/admin/matches/[id]/inspector] Error:', error)
    return NextResponse.json({ error: 'Internt feil' }, { status: 500 })
  }
}