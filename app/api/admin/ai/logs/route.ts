import { getSystemLogs } from '@/lib/admin/system'
import { requireAdmin } from '@/lib/admin/requireAuth'

export async function GET(
  request: Request
): Promise<Response> {
  try {
    const { adminId: _adminId } = await request.json()
    await requireAdmin()

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
