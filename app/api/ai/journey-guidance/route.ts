
import { generateReflectionPrompt, generateSupportMessage } from '@/lib/ai/features/journeyGuidance'
import { requireAuth } from '@/lib/admin/requireAuth'
import { captureError } from '@/lib/system/errors'
import { logInfo } from '@/lib/system/log'
import { validateAIRequest, enforceAIRateLimit } from '@/lib/ai/security'

export async function POST(
  request: Request
): Promise<Response> {
  try {
    const { userId, type, day, context: ctx } = await request.json()

    if (!userId || !type || !day) {
      return new Response(JSON.stringify({ error: 'userId, type (reflection|support) og day is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
    }

    const session = await requireAuth(userId)
    if (!session) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } })
    }

    const inputText = type === 'reflection' ? '' : JSON.stringify(ctx)
    const validation = validateAIRequest(userId, inputText)
    if (!validation.valid) {
      return new Response(JSON.stringify({ error: validation.error }), { status: 400, headers: { 'Content-Type': 'application/json' } })
    }

    const allowed = enforceAIRateLimit(userId)
    if (!allowed) {
      return new Response(JSON.stringify({ error: 'AI rate limit exceeded' }), { status: 429, headers: { 'Content-Type': 'application/json' } })
    }

    const result = type === 'reflection'
      ? await generateReflectionPrompt(day, ctx)
      : await generateSupportMessage({ day, ...ctx })

    await logInfo('Journey guidance generated', 'ai/features', {
      userId,
      day,
      feature: `journeyGuidance/${type}`,
    })

    return new Response(JSON.stringify({ result }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  } catch (error) {
    await captureError(error, {
      module: 'ai/journey-guidance',
      message: 'Journey guidance API failed',
      metadata: { feature: 'journeyGuidance' },
    })
    return new Response(JSON.stringify({ error: 'AI service failed' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}
