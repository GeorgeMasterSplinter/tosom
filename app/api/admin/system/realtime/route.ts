
import { getRealtimeSystemStats } from '@/lib/admin/realtime'
import { auth } from '@/lib/auth/config'
import { requireAdmin } from '@/lib/admin/requireAuth'
import { castToAdminUser } from '@/lib/auth/admin-auth'

export async function GET(request: Request) {
  try {
    const { adminId } = await request.json()
    const session = await auth()
    const user = castToAdminUser(session?.user)
    await requireAdmin(user)

    const stats = await getRealtimeSystemStats()

    return Response.json({ stats })
  } catch (error) {
    console.error('[admin realtime GET] Error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
