import { 
  getFailedLoginStats, 
  getRateLimitStats, 
  getActiveSessions, 
  getAuditLogSummary 
} from '@/lib/admin/security'
import { requireAdmin } from '@/lib/admin/requireAuth'

export async function GET(request: Request) {
  try {
    const { adminId } = await request.json()
    await requireAdmin()

    const url = new URL(request.url)
    const sinceHoursRaw = url.searchParams.get('sinceHours')
    const sinceHours = sinceHoursRaw ? parseInt(sinceHoursRaw) : 24

    const [failedLogins, rateLimits, sessions, audit] = await Promise.all([
      getFailedLoginStats(sinceHours),
      getRateLimitStats(sinceHours),
      getActiveSessions(sinceHours),
      getAuditLogSummary(sinceHours),
    ])

    return new Response(JSON.stringify({
      failedLogins,
      rateLimits,
      sessions,
      audit,
    }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  } catch (error) {
    console.error('[admin security overview GET] Error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}
