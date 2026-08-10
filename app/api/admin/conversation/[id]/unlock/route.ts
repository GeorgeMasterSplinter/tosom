/**
 * POST /api/admin/conversation/[id]/unlock
 * 
 * Lås opp ei fryst conversation (admin).
 * Pakke 4.4.2 — Conversation Unlock/Freeze
 * Pakke 5.1 — Zod-validering
 */

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/auth/requireAuth'
import { castToAdminUser } from '@/lib/auth/admin-auth'
import { errorResponse, successResponse, isValidObjectId } from '@/lib/api-validator'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const result = await requireAuth(req)
    if (result instanceof NextResponse) return result
    const adminUser = castToAdminUser(result.user)
    if (adminUser.role !== 'ADMIN') return errorResponse("Berre admin kan låse opp conversations", 403)

    const conversationId = (await params).id
    if (!isValidObjectId(conversationId)) return errorResponse('Ugyldig conversation ID.', 400)

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      select: { id: true, userAId: true, userBId: true, frozenAt: true, frozenBy: true, createdAt: true },
    })
    if (!conversation) return errorResponse('Conversation ikkje funnen', 404)
    if (!conversation.frozenAt) return errorResponse('Conversation er allereie aktiv (ikkje fryst)')

    const updated = await prisma.conversation.update({
      where: { id: conversationId },
      data: { frozenAt: null, frozenBy: null },
      select: { id: true, userAId: true, userBId: true, frozenAt: true, frozenBy: true, createdAt: true },
    })

    try { await prisma.systemLog.create({ data: { level: 'INFO', message: `Conversation ${conversationId} låst opp av admin ${adminUser.id}`, module: 'admin/conversation-unlock', metadata: JSON.stringify({ conversationId, userIdA: conversation.userAId, userIdB: conversation.userBId, prevFrozenAt: conversation.frozenAt, prevFrozenBy: conversation.frozenBy, adminId: adminUser.id }) } }) } catch { /* ignore */ }

    return successResponse({ data: { id: updated.id, userAId: updated.userAId, userBId: updated.userBId, frozenAt: null, status: 'active' }, message: `Conversation ${conversationId} er no aktiv.` })
  } catch (error) {
    console.error('[POST /api/admin/conversation/[id]/unlock] Error:', error)
    return NextResponse.json({ error: 'Internt feil' }, { status: 500 })
  }
}