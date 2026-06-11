
import { rewriteBio, rewritePrompt } from '@/lib/ai/features/profileRewrite'
import { requireAuth } from '@/lib/admin/requireAuth'
import { captureError } from '@/lib/system/errors'
import { logInfo } from '@/lib/system/log'
import { validateAIRequest, enforceAIRateLimit, maskSensitiveData } from '@/lib/ai/security'

export async function POST(
  request: Request
): Promise<Response> {
  try {
    const { userId, type, text } = await request.json()

    if (!userId || !type || !text) {
      return new Response(JSON.stringify({ error: 'userId, type (bio|prompt) og text is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
    }

    const session = await requireAuth(userId)
    if (!session) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } })
    }

    const validation = validateAIRequest(userId, text)
    if (!validation.valid) {
      return new Response(JSON.stringify({ error: validation.error }), { status: 400, headers: { 'Content-Type': 'application/json' } })
    }

    const allowed = enforceAIRateLimit(userId)
    if (!allowed) {
      return new Response(JSON.stringify({ error: 'AI rate limit exceeded' }), { status: 429, headers: { 'Content-Type': 'application/json' } })
    }

    const maskedText = maskSensitiveData(text)
    const result = type === 'bio'
      ? await rewriteBio(maskedText)
      : await rewritePrompt(maskedText)

    await logInfo('Profile rewritten', 'ai/features', {
      userId,
      feature: `profileRewrite/${type}`,
    })

    return new Response(JSON.stringify({ result }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  } catch (error) {
    await captureError(error, {
      module: 'ai/profile-rewrite',
      message: 'Profile rewrite API failed',
      metadata: { feature: 'profileRewrite' },
    })
    return new Response(JSON.stringify({ error: 'AI service failed' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}
