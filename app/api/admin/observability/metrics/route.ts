import { getPerformanceMetrics } from '@/lib/admin/observability'
import { requireAdmin } from '@/lib/admin/requireAuth'

export async function GET(
  request: Request
): Promise<Response> {
  try {
    const { adminId } = await request.json()
    await requireAdmin()

    const url = new URL(request.url)
    const sinceHoursRaw = url.searchParams.get('sinceHours')
    const limitRaw = url.searchParams.get('limit')
    const metrics = await getPerformanceMetrics({
      route: url.searchParams.get('route') || undefined,
      metric: url.searchParams.get('metric') || undefined,
      sinceHours: sinceHoursRaw ? parseInt(sinceHoursRaw) : undefined,
      limit: limitRaw ? parseInt(limitRaw) : undefined,
    })

    return new Response(JSON.stringify({ metrics }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  } catch (error) {
    console.error('[admin observability metrics GET] Error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}
