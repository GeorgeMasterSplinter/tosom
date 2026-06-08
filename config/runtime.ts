/**
 * ToSom Runtime Configuration
 * 
 * Tilpassar oppsett etter kjøremiljø.
 */

export const isProd = process.env.NODE_ENV === 'production'
export const isDev = process.env.NODE_ENV === 'development'
export const isTest = process.env.NODE_ENV === 'test'

export function getApiBaseUrl(): string {
  if (isProd) return process.env.API_BASE_URL || 'https://api.tosom.no'
  if (isDev) return process.env.API_BASE_URL || 'http://localhost:3000'
  return 'http://localhost:3000'
}

export function getFrontendBaseUrl(): string {
  if (isProd) return process.env.FRONTEND_BASE_URL || 'https://tosom.no'
  if (isDev) return process.env.FRONTEND_BASE_URL || 'http://localhost:3000'
  return 'http://localhost:3000'
}

export function getPort(): number {
  return parseInt(process.env.PORT || '3000', 10)
}

export function getLogLevel(): string {
  if (isProd) return process.env.LOG_LEVEL || 'info'
  if (isTest) return 'error'
  return process.env.LOG_LEVEL || 'debug'
}
