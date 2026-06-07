/**
 * ToSom AI Client
 * 
 * Server-side wrapper for AI-modellkall.
 * Ingen direkte kall frå frontend.
 */

import { aiConfig, validateConfig } from './config'
import { AIRequest, AIResponse, AIError } from './types'
import { captureError } from '@/lib/system/errors'

/**
 * Opprett AI-klient med validering
 */
export function createAIClient() {
  if (!validateConfig()) {
    throw new Error('AI_API_KEY is not configured')
  }
  return {
    prompt: sendPrompt,
    config: aiConfig,
  }
}

/**
 * Send prompt til AI-modell
 */
export async function sendPrompt(
  request: AIRequest,
): Promise<AIResponse> {
  const startTime = Date.now()

  // Valider at API-key er tilgjengeleg
  if (!aiConfig.apiKey) {
    throw {
      code: 'MODEL_ERROR',
      message: 'AI API key is not configured',
      retryable: false,
    } as AIError
  }

  // Kall API-modellen
  let response: Response
  try {
    response = await fetch(`${aiConfig.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${aiConfig.apiKey}`,
      },
      body: JSON.stringify({
        model: request.model || aiConfig.model,
        max_tokens: request.maxTokens || aiConfig.maxTokens,
        temperature: request.temperature ?? aiConfig.temperature,
        messages: [
          { role: 'system', content: request.systemPrompt },
          { role: 'user', content: request.prompt },
        ],
      }),
      signal: AbortSignal.timeout(aiConfig.timeoutMs),
    })
  } catch (error) {
    await captureError(error, {
      module: 'ai/client',
      message: 'Failed to call AI API',
      metadata: request.metadata,
    })

    throw {
      code: 'NETWORK_ERROR',
      message: 'Failed to connect to AI service',
      retryable: true,
      metadata: request.metadata,
    } as AIError
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))

    await captureError(
      new Error(`AI API error: ${response.status}`),
      {
        module: 'ai/client',
        message: 'AI API returned error',
        metadata: {
          status: response.status,
          ...request.metadata,
        },
      },
    )

    throw {
      code: 'MODEL_ERROR',
      message: errorData?.error?.message || `AI API error: ${response.status}`,
      retryable: response.status === 429,
      metadata: request.metadata,
    } as AIError
  }

  const data = await response.json()
  const latencyMs = Date.now() - startTime

  return {
    content: data?.choices?.[0]?.message?.content || '',
    model: data?.model || aiConfig.model,
    tokensUsed: data?.usage?.total_tokens || 0,
    latencyMs,
    safety: {
      flagged: false,
    },
  }
}
