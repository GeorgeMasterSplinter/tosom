
import { getRealtimeSystemStats } from '@/lib/admin/realtime'
import { requireAdmin } from '@/lib/admin/requireAuth'

export async function GET(request: Request) {
  try {
    const { adminId } = await request.json()
    await requireAdmin()

    const stats = await getRealtimeSystemStats()

    return Response.json({ stats })
  } catch (error) {
    console.error('[admin realtime GET] Error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
