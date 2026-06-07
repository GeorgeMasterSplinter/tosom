/**
 * ToSom Input Validation
 * 
 * Validerer og sanitér input før det når business logic.
 */

export interface ValidationRule {
  field: string
  required?: boolean
  type?: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'email' | 'id'
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: unknown) => boolean | string
}

export interface ValidationError {
  field: string
  message: string
}

export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
}

export interface SanitizeOptions {
  removeHtml?: boolean
  removeScripts?: boolean
  maxDepth?: number
}

/**
 * Sanitér tekst — fjern HTML, script, og potentielt farlege sekvens
 */
export function sanitizeText(input: string, options: SanitizeOptions = {}): string {
  if (!input) return ''

  let result = input

  if (options.removeHtml ?? options.removeScripts ?? true) {
    result = result
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<[^>]+>/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '')
  }

  // Fjern null bytes og kontrollerade teikn
  result = result.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')

  return result.trim()
}

/**
 * Valider eit enkelt felt
 */
export function validateField(value: unknown, rule: ValidationRule): string | null {
  if (rule.required && (value === undefined || value === null || value === '')) {
    return `${rule.field} is required`
  }

  if (value === undefined || value === null || value === '') {
    return null
  }

  if (rule.type === 'email') {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(String(value))) {
      return `${rule.field} must be a valid email`
    }
  }

  if (rule.type === 'id') {
    const idPattern = /^[a-zA-Z0-9_-]{10,}$/
    if (!idPattern.test(String(value))) {
      return `${rule.field} must be a valid ID`
    }
  }

  if (rule.minLength && typeof value === 'string' && value.length < rule.minLength) {
    return `${rule.field} must be at least ${rule.minLength} characters`
  }

  if (rule.maxLength && typeof value === 'string' && value.length > rule.maxLength) {
    return `${rule.field} must be at most ${rule.maxLength} characters`
  }

  if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
    return `${rule.field} does not match required pattern`
  }

  if (rule.custom) {
    const result = rule.custom(value)
    if (result === false) return `${rule.field} validation failed`
    if (typeof result === 'string') return `${rule.field}: ${result}`
  }

  return null
}

/**
 * Valider fleire felt
 */
export function validateInput(data: Record<string, unknown>, rules: ValidationRule[]): ValidationResult {
  const errors: ValidationError[] = []

  for (const rule of rules) {
    const value = data[rule.field]
    const error = validateField(value, rule)
    if (error) errors.push({ field: rule.field, message: error })
  }

  return { valid: errors.length === 0, errors }
}

/**
 * Sanitér alle string-verdiar i eit object
 */
export function sanitizeInput(data: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      result[key] = sanitizeText(value)
    } else if (Array.isArray(value)) {
      result[key] = value.map((item) => (typeof item === 'string' ? sanitizeText(item) : item))
    } else {
      result[key] = value
    }
  }

  return result
}
