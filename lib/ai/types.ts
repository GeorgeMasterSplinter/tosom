/**
 * ToSom AI Types
 * 
 * Type-definisjonar for AI-systemet.
 * Ingen implementasjon — berre typar.
 */

export type AIModel = 'gpt-4o-mini' | 'gpt-4o' | 'claude-3-haiku' | string

export type AIModelConfig = {
  model: AIModel
  maxTokens: number
  temperature: number
  safetyLevel: 'strict' | 'moderate' | 'lenient'
}

export interface AIRequest {
  prompt: string
  systemPrompt: string
  model?: AIModel
  maxTokens?: number
  temperature?: number
  metadata?: Record<string, unknown>
}

export interface AIResponse {
  content: string
  model: string
  tokensUsed: number
  latencyMs: number
  safety: {
    flagged: boolean
    categories?: string[]
  }
}

export interface AIError {
  code: 'RATE_LIMIT' | 'MODEL_ERROR' | 'NETWORK_ERROR' | 'SAFETY_BLOCKED' | 'TIMEOUT'
  message: string
  retryable: boolean
  metadata?: Record<string, unknown>
}

export type AIModelOptions = Partial<AIModelConfig>
