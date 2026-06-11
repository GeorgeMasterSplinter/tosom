
import { getSystemOverview } from '@/lib/admin/system'
import { requireAdmin } from '@/lib/admin/requireAuth'

export async function GET(request: Request) {
  try {
    const { adminId } = await request.json()
    await requireAdmin()

    const overview = await getSystemOverview()

    return Response.json({ overview })
  } catch (error) {
    console.error('[admin system overview GET] Error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
