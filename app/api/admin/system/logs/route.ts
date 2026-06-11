
import { getSystemLogs } from '@/lib/admin/system'
import { requireAdmin } from '@/lib/admin/requireAuth'

export async function GET(request: Request): Promise<Response> {
  try {
    const { adminId } = await request.json()
    await requireAdmin()

    const url = new URL(request.url)
    const sinceHoursRaw = url.searchParams.get('sinceHours')
    const filter = {
      level: url.searchParams.get('level') || undefined,
      module: url.searchParams.get('module') || undefined,
      sinceHours: sinceHoursRaw ? parseInt(sinceHoursRaw) : undefined,
      search: url.searchParams.get('search') || undefined,
    }

    const logs = await getSystemLogs(filter)

    return new Response(JSON.stringify({ logs }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  } catch (error) {
    console.error('[admin system logs GET] Error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}
