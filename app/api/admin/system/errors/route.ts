import { auth } from '@/lib/auth/config'
import { getErrorLogs } from '@/lib/admin/system'
import { requireAdmin } from '@/lib/admin/requireAuth'
import { castToAdminUser } from '@/lib/auth/admin-auth'
export const dynamic = 'force-dynamic';

export async function GET(request: Request): Promise<Response> {
  try {
    const { adminId } = await request.json()
    const session = await auth()
    const user = castToAdminUser(session?.user)
    await requireAdmin(user)

    const url = new URL(request.url)
    const sinceHoursRaw = url.searchParams.get('sinceHours')
    const filter = {
      userId: url.searchParams.get('userId') || undefined,
      module: url.searchParams.get('module') || undefined,
      sinceHours: sinceHoursRaw ? parseInt(sinceHoursRaw) : undefined,
      search: url.searchParams.get('search') || undefined,
    }

    const errors = await getErrorLogs(filter)

    return new Response(JSON.stringify({ errors }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  } catch (error) {
    console.error('[admin system errors GET] Error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}


