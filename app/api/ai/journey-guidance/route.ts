import { NextRequest, NextResponse } from 'next/server'
import { generateReflectionPrompt, generateSupportMessage } from '@/lib/ai/features/journeyGuidance'
import { requireAuth } from '@/lib/auth/session'
import { captureError } from '@/lib/system/errors'
import { logInfo } from '@/lib/system/log'
import { validateAIRequest, enforceAIRateLimit } from '@/lib/ai/security'

export async function POST(request: NextRequest) {
  try {
    const { userId, type, day, context } = await request.json()

    if (!userId || !type || !day) {
      return NextResponse.json({ error: 'userId, type (reflection|support) og day is required' }, { status: 400 })
    }

    const session = await requireAuth(userId)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const inputText = type === 'reflection' ? '' : JSON.stringify(context)
    const validation = validateAIRequest(userId, inputText)
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const allowed = enforceAIRateLimit(userId)
    if (!allowed) {
      return NextResponse.json({ error: 'AI rate limit exceeded' }, { status: 429 })
    }

    const result = type === 'reflection'
      ? await generateReflectionPrompt(day, context)
      : await generateSupportMessage({ day, ...context })

    await logInfo('Journey guidance generated', 'ai/features', {
      userId,
      day,
      feature: `journeyGuidance/${type}`,
    })

    return NextResponse.json({ result })
  } catch (error) {
    await captureError(error, {
      module: 'ai/journey-guidance',
      message: 'Journey guidance API failed',
      metadata: { feature: 'journeyGuidance' },
    })
    return NextResponse.json({ error: 'AI service failed' }, { status: 500 })
  }
}
