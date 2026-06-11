import { getNotification } from '@/lib/admin/notifications'
import { requireAdmin } from '@/lib/admin/requireAuth'

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const { adminId } = await request.json()
    await requireAdmin()

    const { id } = await context.params
    const notification = await getNotification(id)

    if (!notification) {
      return new Response(JSON.stringify({ error: 'Notification not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } })
    }

    return new Response(JSON.stringify({ notification }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  } catch (error) {
    console.error('[admin notification GET] Error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}
