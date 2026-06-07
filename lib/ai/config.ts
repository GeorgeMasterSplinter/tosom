/**
 * ToSom AI Configuration
 * 
 * Last inn API-nøklar frå environment variables.
 * Definerer standard modellinnstillingar.
 */

export interface AIConfig {
  apiKey: string | undefined
  baseUrl: string
  model: string
  maxTokens: number
  temperature: number
  safetyLevel: 'strict' | 'moderate' | 'lenient'
  timeoutMs: number
}

export const aiConfig: AIConfig = {
  apiKey: process.env.AI_API_KEY || process.env.OPENAI_API_KEY,
  baseUrl: process.env.AI_BASE_URL || 'https://api.openai.com/v1',
  model: process.env.AI_MODEL || 'gpt-4o-mini',
  maxTokens: parseInt(process.env.AI_MAX_TOKENS || '2048'),
  temperature: parseFloat(process.env.AI_TEMPERATURE || '0.7'),
  safetyLevel: (process.env.AI_SAFETY_LEVEL as 'strict' | 'moderate' | 'lenient') || 'strict',
  timeoutMs: parseInt(process.env.AI_TIMEOUT_MS || '30000'),
}

export function validateConfig(): boolean {
  return !!aiConfig.apiKey
}
