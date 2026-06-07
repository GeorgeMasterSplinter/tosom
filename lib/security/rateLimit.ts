/**
 * ToSom Rate Limit Security
 * 
 * Sikkerheitslag for rate limiting på globale, brukar- og sensitive ruter.
 */

interface RateLimitEntry {
  count: number
  windowStart: number
}

const LIMITS = new Map<string, RateLimitEntry>()

function checkRateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now()
  const entry = LIMITS.get(key)

  if (!entry || now - entry.windowStart > windowMs) {
    LIMITS.set(key, { count: 1, windowStart: now })
    return false
  }

  if (entry.count >= max) {
    return true
  }

  entry.count += 1
  return false
}

/**
 * Global rate limit per IP
 */
export function enforceGlobalRateLimit(ip: string, max: number = 100, windowMs: number = 60000): boolean {
  const key = `global:${ip}`
  return !checkRateLimit(key, max, windowMs)
}

/**
 * Per-brukar rate limit
 */
export function enforceUserRateLimit(userId: string, max: number = 50, windowMs: number = 60000): boolean {
  const key = `user:${userId}`
  return !checkRateLimit(key, max, windowMs)
}

/**
 * Sensitive rute rate limit (høgare streng)
 */
export function enforceSensitiveRouteLimit(route: string, max: number = 10, windowMs: number = 300000): boolean {
  const key = `sensitive:${route}`
  return !checkRateLimit(key, max, windowMs)
}

/**
 * Rotér gamle oppføringar kvart 5. minutt
 */
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of LIMITS.entries()) {
    if (now - entry.windowStart > 120000) {
      LIMITS.delete(key)
    }
  }
}, 5 * 60 * 1000)
