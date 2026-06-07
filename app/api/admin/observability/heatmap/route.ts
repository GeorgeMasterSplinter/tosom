import { NextRequest, NextResponse } from 'next/server'
import { getRouteHeatmap } from '@/lib/admin/observability'
import { requireAdmin } from '@/lib/admin/requireAuth'

export async function GET(request: NextRequest) {
  try {
    const { adminId } = await request.json()
    await requireAdmin(adminId)

    const { searchParams } = request.nextUrl
    const sinceHours = searchParams.get('sinceHours')
      ? parseInt(searchParams.get('sinceHours'))
      : 24

    const heatmap = await getRouteHeatmap(sinceHours)

    return NextResponse.json({ heatmap })
  } catch (error) {
    console.error('[admin observability heatmap GET] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
