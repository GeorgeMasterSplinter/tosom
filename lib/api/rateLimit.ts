/**
 * ToSom — Enkel rate limiting (in-memory)
 *
 * Bruk på auth, chat, matching og admin-endepunkt.
 * Merk: Virkar bare på éin instans (ikke for flere instansar).
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

// Map: "ip:path" → entry
const store = new Map<string, RateLimitEntry>()

// Default limit: 60 requests per 1 minute
const DEFAULT_WINDOW_MS = 60 * 1000 // 1 minutt
const DEFAULT_MAX_REQUESTS = 60

// Strikte grenser for sensitive endepunkt
const STRICT_LIMITS = {
  windowMs: 15 * 1000, // 15 sekund
  maxRequests: 5,
}

/**
 * Sjekk og oppdater rate limit for en key.
 */
export function checkRateLimit(
  key: string,
  options?: { windowMs?: number; maxRequests?: number }
): { allowed: boolean; remaining: number; resetInMs: number } {
  const windowMs = options?.windowMs ?? DEFAULT_WINDOW_MS
  const maxRequests = options?.maxRequests ?? DEFAULT_MAX_REQUESTS

  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now > entry.resetAt) {
    // Ny窗口
    store.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: maxRequests - 1, resetInMs: windowMs }
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetInMs: entry.resetAt - now }
  }

  entry.count++
  return { allowed: true, remaining: maxRequests - entry.count, resetInMs: entry.resetAt - now }
}

/**
 * Fjern gamle entry (kjør periodisk).
 */
export function cleanupRateLimit(): void {
  const now = Date.now()
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetAt) {
      store.delete(key)
    }
  }
}

// Kjør cleanup hvar 5. minutt
setInterval(cleanupRateLimit, 5 * 60 * 1000)

/**
 * Sjekk med strenge grenser (for auth-endepunkt).
 */
export function checkStrictRateLimit(key: string): { allowed: boolean } {
  const result = checkRateLimit(key, {
    windowMs: STRICT_LIMITS.windowMs,
    maxRequests: STRICT_LIMITS.maxRequests,
  })
  return { allowed: result.allowed }
}

/**
 * Hent rate-limit headers for NextResponse.
 */
export function getRateLimitHeaders(
  remaining: number,
  resetInMs: number
): Record<string, string> {
  return {
    'X-RateLimit-Limit': '60',
    'X-RateLimit-Remaining': String(Math.max(0, remaining)),
    'X-RateLimit-Reset': String(Math.ceil(resetInMs / 1000)),
    'Retry-After': String(Math.ceil(resetInMs / 1000)),
  }
}