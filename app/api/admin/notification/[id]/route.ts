import { getNotification } from '@/lib/admin/notifications'
import { auth } from '@/lib/auth/config'
import { requireAdmin } from '@/lib/admin/requireAuth'
import { castToAdminUser } from '@/lib/auth/admin-auth'

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const { adminId: _adminId } = await request.json()
    const session = await auth()
    const user = castToAdminUser(session?.user)
    await requireAdmin(user)

    const { id } = await params
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
