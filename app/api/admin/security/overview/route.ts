import { NextRequest, NextResponse } from 'next/server'
import { 
  getFailedLoginStats, 
  getRateLimitStats, 
  getActiveSessions, 
  getAuditLogSummary 
} from '@/lib/admin/security'
import { requireAdmin } from '@/lib/admin/requireAuth'

export async function GET(request: NextRequest) {
  try {
    const { adminId } = await request.json()
    await requireAdmin(adminId)

    const { searchParams } = request.nextUrl
    const sinceHours = searchParams.get('sinceHours')
      ? parseInt(searchParams.get('sinceHours'))
      : 24

    const [failedLogins, rateLimits, sessions, audit] = await Promise.all([
      getFailedLoginStats(sinceHours),
      getRateLimitStats(sinceHours),
      getActiveSessions(sinceHours),
      getAuditLogSummary(sinceHours),
    ])

    return NextResponse.json({
      failedLogins,
      rateLimits,
      sessions,
      audit,
    })
  } catch (error) {
    console.error('[admin security overview GET] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
