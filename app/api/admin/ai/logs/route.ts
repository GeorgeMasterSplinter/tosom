import { auth } from '@/lib/auth/config'
import { getSystemLogs } from '@/lib/admin/system'
import { requireAdmin } from '@/lib/admin/requireAuth'
import { castToAdminUser, AuthenticatedUser } from '@/lib/auth/admin-auth'
export const dynamic = 'force-dynamic';

export async function GET(
  request: Request
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

    const url = new URL(request.url)
    const sinceHoursRaw = url.searchParams.get('sinceHours')
    const logs = await getSystemLogs({
      userId: url.searchParams.get('userId') || undefined,
      level: 'ERROR',
      sinceHours: sinceHoursRaw ? parseInt(sinceHoursRaw) : undefined,
      search: url.searchParams.get('search') || undefined,
    })

    return new Response(JSON.stringify({ logs }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  } catch (error) {
    console.error('[admin ai logs GET] Error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}