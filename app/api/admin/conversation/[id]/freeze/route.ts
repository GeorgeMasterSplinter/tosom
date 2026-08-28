/**
 * POST /api/admin/conversation/[id]/freeze
 * 
 * Fryse ei conversation (admin).
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
    if (adminUser.role !== 'ADMIN') return errorResponse("Kun admin kan fryse conversations", 403)

    const conversationId = (await params).id
    if (!isValidObjectId(conversationId)) return errorResponse('Ugyldig conversation ID.', 400)

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      select: { id: true, userAId: true, userBId: true, frozenAt: true, frozenBy: true, createdAt: true, imageShared: true, imageShareAllowedAt: true },
    })
    if (!conversation) return errorResponse('Conversation ikke funnet', 404)
    if (conversation.frozenAt) {
      return errorResponse(`Conversation er allerede fryst siden ${new Date(conversation.frozenAt).toLocaleString('nb-NO')}`)
    }

    const updated = await prisma.conversation.update({
      where: { id: conversationId },
      data: { frozenAt: new Date(), frozenBy: adminUser.id },
      select: { id: true, userAId: true, userBId: true, frozenAt: true, frozenBy: true, createdAt: true, imageShared: true, imageShareAllowedAt: true },
    })

    try { await prisma.systemLog.create({ data: { level: 'INFO', message: `Conversation ${conversationId} fryst av admin ${adminUser.id}`, module: 'admin/conversation-freeze', metadata: JSON.stringify({ conversationId, userIdA: conversation.userAId, userIdB: conversation.userBId, frozenAt: updated.frozenAt, adminId: adminUser.id }) } }) } catch { /* ignore */ }

    return successResponse({ data: { id: updated.id, userAId: updated.userAId, userBId: updated.userBId, frozenAt: updated.frozenAt?.toISOString(), frozenBy: updated.frozenBy, status: 'frozen' }, message: `Conversation ${conversationId} er no fryst.` })
  } catch (error) {
    console.error('[POST /api/admin/conversation/[id]/freeze] Error:', error)
    return NextResponse.json({ error: 'Internt feil' }, { status: 500 })
  }
}