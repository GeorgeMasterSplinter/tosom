/**
 * ToSom AI Security
 * 
 * Validering, rate limiting og sensitiv data-masking for AI-kall.
 */

import { checkRateLimit } from '@/lib/rateLimit'

export interface AIRequestValidation {
  valid: boolean
  error?: string
  maskedInput?: string
}

/**
 * Valider AI-request frå bruker
 */
export function validateAIRequest(userId: string, input: string): AIRequestValidation {
  if (!userId || userId.length === 0) {
    return { valid: false, error: 'userId is required' }
  }

  if (!input || input.length === 0) {
    return { valid: false, error: 'Input is empty' }
  }

  if (input.length > 4000) {
    return { valid: false, error: 'Input is too long (max 4000 characters)' }
  }

  // Sjekk for sensitivt innhald (personnummer, kortnummer, osv.)
  const sensitivePatterns = [
    /\d{6}-\d{4}/, // personnummer-format
    /\d{4}\s?\d{4}\s?\d{4}\s?\d{4}/, // kortnummer-format
    /[\w.-]+@[\w.-]+\.\w+/, // email
  ]

  for (const pattern of sensitivePatterns) {
    if (pattern.test(input)) {
      return { valid: false, error: 'Input contains potentially sensitive data' }
    }
  }

  return { valid: true }
}

/**
 * Tving AI-rate limit per brukar
 */
export function enforceAIRateLimit(userId: string): boolean {
  const key = `ai:${userId}`
  const isLimited = checkRateLimit(key, 20, 60000) // 20 kall per minutt
  return !isLimited
}

/**
 * Mask sensittiv data i input
 */
export function maskSensitiveData(input: string): string {
  return input
    .replace(/[\w.-]+@[\w.-]+\.\w+/g, '[EMAIL]')
    .replace(/\d{6}-\d{4}/g, '[PERSONNUMMER]')
    .replace(/\d{4}\s?\d{4}\s?\d{4}\s?\d{4}/g, '[KORTNUMMER]')
}
