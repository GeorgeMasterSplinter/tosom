import { NextRequest, NextResponse } from 'next/server'
import { rewriteBio, rewritePrompt } from '@/lib/ai/features/profileRewrite'
import { requireAuth } from '@/lib/auth/session'
import { captureError } from '@/lib/system/errors'
import { logInfo } from '@/lib/system/log'
import { validateAIRequest, enforceAIRateLimit, maskSensitiveData } from '@/lib/ai/security'

export async function POST(request: NextRequest) {
  try {
    const { userId, type, text } = await request.json()

    if (!userId || !type || !text) {
      return NextResponse.json({ error: 'userId, type (bio|prompt) og text is required' }, { status: 400 })
    }

    const session = await requireAuth(userId)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Valider og mask
    const validation = validateAIRequest(userId, text)
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const allowed = enforceAIRateLimit(userId)
    if (!allowed) {
      return NextResponse.json({ error: 'AI rate limit exceeded' }, { status: 429 })
    }

    const maskedText = maskSensitiveData(text)
    const result = type === 'bio'
      ? await rewriteBio(maskedText)
      : await rewritePrompt(maskedText)

    await logInfo('Profile rewritten', 'ai/features', {
      userId,
      feature: `profileRewrite/${type}`,
    })

    return NextResponse.json({ result })
  } catch (error) {
    await captureError(error, {
      module: 'ai/profile-rewrite',
      message: 'Profile rewrite API failed',
      metadata: { feature: 'profileRewrite' },
    })
    return NextResponse.json({ error: 'AI service failed' }, { status: 500 })
  }
}
