import { getNotification } from '@/lib/admin/notifications'
import { auth } from '@/lib/auth/config'
import { requireAdmin } from '@/lib/admin/requireAuth'
import { castToAdminUser, AuthenticatedUser } from '@/lib/auth/admin-auth'
export const dynamic = 'force-dynamic';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const session = await auth()
    const rawUser = session?.user
    if (!rawUser) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } })
    }
    const user: AuthenticatedUser = {
      id: String(rawUser.id ?? 'unknown'),
      name: rawUser.name ?? '',
      email: rawUser.email ?? '',
      image: rawUser.image ?? '',
      role: 'USER' as const,
    }
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