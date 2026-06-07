import { NextRequest, NextResponse } from 'next/server'
import { getRateLimitLogs } from '@/lib/admin/system'
import { getGlobalRateLimitStats } from '@/lib/system/rateMonitor'
import { requireAdmin } from '@/lib/admin/requireAuth'

export async function GET(request: NextRequest) {
  try {
    const { adminId } = await request.json()
    await requireAdmin(adminId)

    const { searchParams } = request.nextUrl
    const userId = searchParams.get('userId') || undefined
    const sinceHours = searchParams.get('sinceHours')
      ? parseInt(searchParams.get('sinceHours'))
      : undefined

    const stats = await getGlobalRateLimitStats(sinceHours ?? 24)
    const logs = await getRateLimitLogs({ userId, sinceHours })

    return NextResponse.json({ stats, logs })
  } catch (error) {
    console.error('[admin system rate-limits GET] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
