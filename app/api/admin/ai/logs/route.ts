import { NextRequest, NextResponse } from 'next/server'
import { listAIRequests, getAIStats } from '@/lib/admin/ai'
import { requireAdmin } from '@/lib/admin/requireAuth'

export async function GET(request: NextRequest) {
  try {
    const { adminId } = await request.json()
    await requireAdmin(adminId)

    const { searchParams } = request.nextUrl
    const filter = {
      userId: searchParams.get('userId') || undefined,
      sinceHours: searchParams.get('sinceHours') ? parseInt(searchParams.get('sinceHours')) : undefined,
      search: searchParams.get('search') || undefined,
      feature: searchParams.get('feature') || undefined,
    }

    const requests = await listAIRequests(filter)
    const stats = await getAIStats(filter.sinceHours ?? 24)

    return NextResponse.json({ requests, stats })
  } catch (error) {
    console.error('[admin ai logs GET] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
