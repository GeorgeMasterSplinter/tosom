
import { getTraceDetails } from '@/lib/admin/observability'
import { requireAdmin } from '@/lib/admin/requireAuth'

export async function GET(
  request: Request
): Promise<Response> {
  try {
    const { adminId } = await request.json()
    await requireAdmin()

    const url = new URL(request.url)
    const traceId = url.searchParams.get('traceId')

    if (!traceId) {
      return new Response(JSON.stringify({ error: 'traceId is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
    }

    const traces = await getTraceDetails(traceId)

    return new Response(JSON.stringify({ traces }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  } catch (error) {
    console.error('[admin observability traces GET] Error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}
