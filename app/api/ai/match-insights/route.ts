
import { generateMatchSummary, generateCompatibilityScore } from '@/lib/ai/features/matchInsights'
import { requireAuth } from '@/lib/admin/requireAuth'
import { captureError } from '@/lib/system/errors'
import { logInfo } from '@/lib/system/log'

export async function POST(
  request: Request
): Promise<Response> {
  try {
    const { userId, profileA, profileB } = await request.json()
    
    if (!userId || !profileA || !profileB) {
      return new Response(JSON.stringify({ error: 'userId, profileA og profileB is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
    }

    const session = await requireAuth(userId)
    if (!session) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } })
    }

    const result = await generateMatchSummary(
      profileA,
      profileB,
    )

    await logInfo('Match insights generated', 'ai/features', {
      userId,
      feature: 'matchInsights/generateMatchSummary',
    })

    return new Response(JSON.stringify({ result }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  } catch (error) {
    await captureError(error, {
      module: 'ai/match-insights',
      message: 'Match insights API failed',
      metadata: { feature: 'matchInsights' },
    })
    return new Response(JSON.stringify({ error: 'AI service failed' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}
