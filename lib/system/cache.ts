/**
 * ToSom In-Memory Cache
 * 
 * Enkel cache med TTL-støtte.
 * Klar for eventuell Redis seinare.
 */

interface CacheEntry {
  value: unknown
  expiresAt: number
}

const CACHE = new Map<string, CacheEntry>()
const DEFAULT_TTL = 300 // 5 minutt

function cleanup(): void {
  const now = Date.now()
  for (const [key, entry] of CACHE.entries()) {
    if (now > entry.expiresAt) {
      CACHE.delete(key)
    }
  }
}

// Rydd kvart 60. sekund
setInterval(cleanup, 60 * 1000)

export function getCache<T>(key: string): T | undefined {
  const entry = CACHE.get(key)
  if (!entry) return undefined
  if (Date.now() > entry.expiresAt) {
    CACHE.delete(key)
    return undefined
  }
  return entry.value as T
}

export function setCache(key: string, value: unknown, ttlSeconds = DEFAULT_TTL): void {
  CACHE.set(key, {
    value,
    expiresAt: Date.now() + (ttlSeconds * 1000),
  })
}

export function clearCache(key?: string): void {
  if (key) {
    CACHE.delete(key)
  } else {
    CACHE.clear()
  }
}

export function getCacheStats(): { total: number; expired: number } {
  const now = Date.now()
  let expired = 0
  for (const entry of CACHE.values()) {
    if (now > entry.expiresAt) expired++
  }
  return { total: CACHE.size, expired }
}
