
import { suggestOpeners, suggestReplies } from '@/lib/ai/features/messageSuggestions'
import { requireAuth } from '@/lib/admin/requireAuth'
import { captureError } from '@/lib/system/errors'
import { logInfo } from '@/lib/system/log'
import { validateAIRequest, enforceAIRateLimit, maskSensitiveData } from '@/lib/ai/security'

export async function POST(
  request: Request
): Promise<Response> {
  try {
    const { userId, type, theirProfile, context: ctx } = await request.json()

    if (!userId || !type || !theirProfile || !ctx) {
      return new Response(JSON.stringify({ error: 'userId, type (openers|replies), theirProfile og context is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
    }

    const session = await requireAuth(userId)
    if (!session) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } })
    }

    const validation = validateAIRequest(userId, JSON.stringify(theirProfile))
    if (!validation.valid) {
      return new Response(JSON.stringify({ error: validation.error }), { status: 400, headers: { 'Content-Type': 'application/json' } })
    }

    const allowed = enforceAIRateLimit(userId)
    if (!allowed) {
      return new Response(JSON.stringify({ error: 'AI rate limit exceeded' }), { status: 429, headers: { 'Content-Type': 'application/json' } })
    }

    const result = type === 'openers'
      ? await suggestOpeners(theirProfile, ctx)
      : await suggestReplies(ctx.theirMessage, ctx)

    await logInfo('Message suggestions generated', 'ai/features', {
      userId,
      feature: `messageSuggestions/${type}`,
    })

    return new Response(JSON.stringify({ result }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  } catch (error) {
    await captureError(error, {
      module: 'ai/message-suggestions',
      message: 'Message suggestions API failed',
      metadata: { feature: 'messageSuggestions' },
    })
    return new Response(JSON.stringify({ error: 'AI service failed' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}
