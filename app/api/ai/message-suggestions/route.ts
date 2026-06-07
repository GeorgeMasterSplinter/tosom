import { NextRequest, NextResponse } from 'next/server'
import { suggestOpeners, suggestReplies } from '@/lib/ai/features/messageSuggestions'
import { requireAuth } from '@/lib/auth/session'
import { captureError } from '@/lib/system/errors'
import { logInfo } from '@/lib/system/log'
import { validateAIRequest, enforceAIRateLimit, maskSensitiveData } from '@/lib/ai/security'

export async function POST(request: NextRequest) {
  try {
    const { userId, type, theirProfile, context } = await request.json()

    if (!userId || !type || !theirProfile || !context) {
      return NextResponse.json({ error: 'userId, type (openers|replies), theirProfile og context is required' }, { status: 400 })
    }

    const session = await requireAuth(userId)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const validation = validateAIRequest(userId, JSON.stringify(theirProfile))
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const allowed = enforceAIRateLimit(userId)
    if (!allowed) {
      return NextResponse.json({ error: 'AI rate limit exceeded' }, { status: 429 })
    }

    const result = type === 'openers'
      ? await suggestOpeners(theirProfile, context)
      : await suggestReplies(context.theirMessage, context)

    await logInfo('Message suggestions generated', 'ai/features', {
      userId,
      feature: `messageSuggestions/${type}`,
    })

    return NextResponse.json({ result })
  } catch (error) {
    await captureError(error, {
      module: 'ai/message-suggestions',
      message: 'Message suggestions API failed',
      metadata: { feature: 'messageSuggestions' },
    })
    return NextResponse.json({ error: 'AI service failed' }, { status: 500 })
  }
}
