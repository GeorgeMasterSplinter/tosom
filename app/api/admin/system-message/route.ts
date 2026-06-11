
import { sendSystemMessage } from '@/lib/system/messages'
import { SystemMessageType } from '@prisma/client'
import { requireAdmin } from '@/lib/admin/requireAuth'

export async function POST(
  request: Request
): Promise<Response> {
  try {
    const { adminId, targetUserId, content, type } = await request.json()

    if (!adminId) {
      return new Response(JSON.stringify({ error: 'adminId is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
    }
    if (!targetUserId) {
      return new Response(JSON.stringify({ error: 'targetUserId is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
    }
    if (!content) {
      return new Response(JSON.stringify({ error: 'content is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
    }

    await requireAdmin()

    const messageType = (type as SystemMessageType) || SystemMessageType.INFO
    await sendSystemMessage(targetUserId, content, messageType)

    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  } catch (error) {
    console.error('[admin system-message POST] Error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}
