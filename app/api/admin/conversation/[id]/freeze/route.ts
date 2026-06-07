import { NextRequest, NextResponse } from 'next/server'
import { freezeConversation, unfreezeConversation, isFrozen } from '@/lib/chat/freeze'
import { requireAdmin } from '@/lib/admin/requireAuth'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const body = await request.json()
    const { adminId } = body
    const conversationId = params.id

    if (!adminId) {
      return NextResponse.json({ error: 'adminId is required' }, { status: 400 })
    }

    const frozen = await isFrozen(conversationId)
    const action = frozen ? 'unfreeze' : 'freeze'

    if (frozen) {
      await unfreezeConversation(conversationId, adminId)
    } else {
      await freezeConversation(conversationId, adminId)
    }

    return NextResponse.json({ success: true, frozen: !frozen, action })
  } catch (error) {
    console.error('[conversation freeze POST] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
