/**
 * ToSom Input Validation
 * 
 * Validerer input før det når business logic.
 */

export interface ValidationRule {
  field: string
  required?: boolean
  type?: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'email'
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: unknown) => boolean | string
}

export interface ValidationError {
  field: string
  message: string
}

/**
 * Valider et felt
 */
export function validateField(value: unknown, rule: ValidationRule): string | null {
  if (rule.required && (value === undefined || value === null || value === '')) {
    return `${rule.field} is required`
  }

  if (value === undefined || value === null || value === '') {
    return null
  }

  // Type checking
  if (rule.type) {
    const actualType = typeof value
    if (rule.type === 'array' && !Array.isArray(value)) {
      return `${rule.field} must be an array`
    }
    if (rule.type === 'object' && (typeof value !== 'object' || Array.isArray(value))) {
      return `${rule.field} must be an object`
    }
    if (rule.type === 'email') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailPattern.test(String(value))) {
        return `${rule.field} must be a valid email`
      }
    }
    if (rule.type === 'string' && actualType !== 'string') {
      return `${rule.field} must be a string`
    }
    if (rule.type === 'number' && actualType !== 'number') {
      return `${rule.field} must be a number`
    }
  }

  // Length checks
  if (typeof value === 'string' || Array.isArray(value)) {
    if (rule.minLength !== undefined && (rule.type === 'string' ? value.length : value.length) < rule.minLength) {
      return `${rule.field} must be at least ${rule.minLength} characters`
    }
    if (rule.maxLength !== undefined && (rule.type === 'string' ? value.length : value.length) > rule.maxLength) {
      return `${rule.field} must be at most ${rule.maxLength} characters`
    }
  }

  // Pattern check
  if (rule.pattern && typeof value === 'string') {
    if (!rule.pattern.test(value)) {
      return `${rule.field} does not match the required pattern`
    }
  }

  // Custom validation
  if (rule.custom) {
    const result = rule.custom(value)
    if (result === false) {
      return `${rule.field} validation failed`
    }
    if (typeof result === 'string') {
      return `${rule.field}: ${result}`
    }
  }

  return null
}

/**
 * Valider flere felt
 */
export function validateInput(
  data: Record<string, unknown>,
  rules: ValidationRule[],
): { valid: boolean; errors: ValidationError[] } {
  const errors: ValidationError[] = []

  for (const rule of rules) {
    const value = data[rule.field]
    const error = validateField(value, rule)
    if (error) {
      errors.push({ field: rule.field, message: error })
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
