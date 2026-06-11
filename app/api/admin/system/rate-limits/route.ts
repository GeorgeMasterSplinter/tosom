
import { getRateLimitLogs } from '@/lib/admin/system'
import { getGlobalRateLimitStats } from '@/lib/system/rateMonitor'
import { requireAdmin } from '@/lib/admin/requireAuth'

export async function GET(request: Request): Promise<Response> {
  try {
    const { adminId } = await request.json()
    await requireAdmin()

    const url = new URL(request.url)
    const userId = url.searchParams.get('userId') || undefined
    const sinceHoursRaw = url.searchParams.get('sinceHours')
      ? parseInt(url.searchParams.get('sinceHours') ?? '')
      : undefined

    const sinceHours = sinceHoursRaw
    const stats = await getGlobalRateLimitStats(sinceHours ?? 24)
    const logs = await getRateLimitLogs({ userId, sinceHours })

    return new Response(JSON.stringify({ stats, logs }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  } catch (error) {
    console.error('[admin system rate-limits GET] Error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}
