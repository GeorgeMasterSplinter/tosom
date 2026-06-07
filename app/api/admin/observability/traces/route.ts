import { NextRequest, NextResponse } from 'next/server'
import { getTraceDetails } from '@/lib/admin/observability'
import { requireAdmin } from '@/lib/admin/requireAuth'

export async function GET(request: NextRequest) {
  try {
    const { adminId } = await request.json()
    await requireAdmin(adminId)

    const { searchParams } = request.nextUrl
    const traceId = searchParams.get('traceId')

    if (!traceId) {
      return NextResponse.json({ error: 'traceId is required' }, { status: 400 })
    }

    const traces = await getTraceDetails(traceId)

    return NextResponse.json({ traces })
  } catch (error) {
    console.error('[admin observability traces GET] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
