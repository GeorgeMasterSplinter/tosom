import { NextRequest, NextResponse } from 'next/server'
import { getPerformanceMetrics } from '@/lib/admin/observability'
import { requireAdmin } from '@/lib/admin/requireAuth'

export async function GET(request: NextRequest) {
  try {
    const { adminId } = await request.json()
    await requireAdmin(adminId)

    const { searchParams } = request.nextUrl
    const metrics = await getPerformanceMetrics({
      route: searchParams.get('route') || undefined,
      metric: searchParams.get('metric') || undefined,
      sinceHours: searchParams.get('sinceHours') ? parseInt(searchParams.get('sinceHours')) : undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')) : undefined,
    })

    return NextResponse.json({ metrics })
  } catch (error) {
    console.error('[admin observability metrics GET] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
