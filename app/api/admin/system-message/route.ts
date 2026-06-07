import { NextRequest, NextResponse } from 'next/server'
import { sendSystemMessage } from '@/lib/system/messages'
import { SystemMessageType } from '@prisma/client'
import { requireAdmin } from '@/lib/admin/requireAuth'

export async function POST(request: NextRequest) {
  try {
    const { adminId, targetUserId, content, type } = await request.json()

    if (!adminId) {
      return NextResponse.json({ error: 'adminId is required' }, { status: 400 })
    }
    if (!targetUserId) {
      return NextResponse.json({ error: 'targetUserId is required' }, { status: 400 })
    }
    if (!content) {
      return NextResponse.json({ error: 'content is required' }, { status: 400 })
    }

    await requireAdmin(adminId)

    const messageType = (type as SystemMessageType) || SystemMessageType.INFO
    await sendSystemMessage(targetUserId, content, messageType)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[admin system-message POST] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
