import { requireAdmin } from '@/lib/admin/requireAuth'
import { freezeConversation, unfreezeConversation, isFrozen } from '@/lib/chat/freeze'

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id: conversationId } = await context.params

  const body = await request.json()
  const { adminId } = body

  if (!adminId) {
    return new Response(JSON.stringify({ error: 'adminId is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const frozen = await isFrozen(conversationId)

  if (frozen) {
    await unfreezeConversation(conversationId, adminId)
  } else {
    await freezeConversation(conversationId, adminId)
  }

  return new Response(
    JSON.stringify({ success: true, frozen: !frozen }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  )
}
