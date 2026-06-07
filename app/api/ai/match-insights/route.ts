import { NextRequest, NextResponse } from 'next/server'
import { generateMatchSummary, generateCompatibilityScore } from '@/lib/ai/features/matchInsights'
import { requireAuth } from '@/lib/auth/session'
import { captureError } from '@/lib/system/errors'
import { logInfo } from '@/lib/system/log'

export async function POST(request: NextRequest) {
  try {
    const { userId, profileA, profileB } = await request.json()
    
    if (!userId || !profileA || !profileB) {
      return NextResponse.json({ error: 'userId, profileA og profileB is required' }, { status: 400 })
    }

    const session = await requireAuth(userId)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const result = await generateMatchSummary(
      profileA,
      profileB,
    )

    await logInfo('Match insights generated', 'ai/features', {
      userId,
      feature: 'matchInsights/generateMatchSummary',
    })

    return NextResponse.json({ result })
  } catch (error) {
    await captureError(error, {
      module: 'ai/match-insights',
      message: 'Match insights API failed',
      metadata: { feature: 'matchInsights' },
    })
    return NextResponse.json({ error: 'AI service failed' }, { status: 500 })
  }
}
