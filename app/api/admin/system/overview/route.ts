
import { getSystemOverview } from '@/lib/admin/system'
import { auth } from '@/lib/auth/config'
import { requireAdmin } from '@/lib/admin/requireAuth'
import { castToAdminUser } from '@/lib/auth/admin-auth'
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { adminId } = await request.json()
    const session = await auth()
    const user = castToAdminUser(session?.user)
    await requireAdmin(user)

    const overview = await getSystemOverview()

    return Response.json({ overview })
  } catch (error) {
    console.error('[admin system overview GET] Error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}


