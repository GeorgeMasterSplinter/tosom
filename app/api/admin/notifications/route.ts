import { listNotifications } from '@/lib/admin/notifications'
import { requireAdmin } from '@/lib/admin/requireAuth'

export async function GET(request: Request) {
  try {
    const { adminId } = await request.json()
    await requireAdmin()

    const url = new URL(request.url)
    const filter = {
      userId: url.searchParams.get('userId') || undefined,
      type: url.searchParams.get('type') || undefined,
      read: url.searchParams.get('read') ? url.searchParams.get('read') === 'true' : undefined,
      search: url.searchParams.get('search') || undefined,
    }

    const notifications = await listNotifications(filter)

    return new Response(JSON.stringify({ notifications }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  } catch (error) {
    console.error('[admin notifications GET] Error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}
