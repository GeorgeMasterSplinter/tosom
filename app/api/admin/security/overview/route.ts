import { 
  getFailedLoginStats, 
  getRateLimitStats, 
  getActiveSessions, 
  getAuditLogSummary 
} from '@/lib/admin/security'
import { auth } from '@/lib/auth/config'
import { requireAdmin } from '@/lib/admin/requireAuth'
import { castToAdminUser } from '@/lib/auth/admin-auth'

export async function GET(request: Request) {
  try {
    const { adminId } = await request.json()
    const session = await auth()
    const user = castToAdminUser(session?.user)
    await requireAdmin(user)

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
