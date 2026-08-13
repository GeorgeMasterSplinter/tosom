/**
 * ToSom — Distribuert rate limiting med Redis (fallback in-memory)
 *
 * STEG 2.5: Rate limiting på auth-ruter med distribuert teller.
 * When Upstash Redis is configured: uses Redis for distributed counting.
 * When not configured (dev fallback): uses in-memory Map with console.warn.
 */

import { Redis } from '@upstash/redis'

interface RateLimitConfig {
  requests: number
  windowSeconds: number
  prefix: string
}

const AUTH_RATE_LIMITS: Record<string, RateLimitConfig> = {
  'phone/send': { requests: 3, windowSeconds: 3600, prefix: 'sms_send' },
  'phone/verify': { requests: 5, windowSeconds: 600, prefix: 'sms_verify' },
  'login': { requests: 5, windowSeconds: 900, prefix: 'login' },
  'magic-link': { requests: 3, windowSeconds: 3600, prefix: 'magic_link' },
}

// ── Redis client (lazy) ──────────────────────────────────────────────
let redisClient: Redis | null = null
let redisAvailable = false

function getRedisClient(): Redis | null {
  if (redisClient !== null) return redisAvailable ? redisClient : null

  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!url || !token) return null

  try {
    redisClient = new Redis({ url, token })
    redisAvailable = true
    return redisClient
  } catch (e) {
    console.warn('[rate-limit] Failed to connect to Upstash Redis:', e)
    return null
  }
}

// ── In-memory fallback store ─────────────────────────────────────────
interface InMemoryEntry {
  count: number
  resetAt: number
}
const memStore = new Map<string, InMemoryEntry>()

// ── Core check logic ─────────────────────────────────────────────────
async function redisCheck(key: string, max: number, windowSec: number): Promise<{ ok: boolean; remaining: number }> {
  const redis = getRedisClient()!
  try {
    const count = await redis.incr(key)
    if (count === 1) {
      await redis.expire(key, windowSec)
    }
    const ttl = await redis.ttl(key)
    return { ok: count <= max, remaining: Math.max(0, max - count) }
  } catch (e) {
    console.error('[rate-limit] Redis error:', e)
    // fail-open
    return { ok: true, remaining: max }
  }
}

function memCheck(key: string, max: number, windowMs: number): { ok: boolean; remaining: number } {
  const now = Date.now()
  const entry = memStore.get(key)

  if (!entry || now > entry.resetAt) {
    memStore.set(key, { count: 1, resetAt: now + windowMs })
    // Cleanup
    if (memStore.size > 10000) {
      for (const [k, v] of memStore.entries()) {
        if (now > v.resetAt) memStore.delete(k)
      }
    }
    return { ok: true, remaining: max - 1 }
  }

  if (entry.count >= max) {
    return { ok: false, remaining: 0 }
  }

  entry.count++
  return { ok: true, remaining: max - entry.count }
}

// ── Public API ───────────────────────────────────────────────────────

export async function checkAuthRateLimit(
  endpoint: string,
  identifier: string
): Promise<{ success: boolean; retryAfter?: number; remaining?: number; isDistributed: boolean }> {
  const config = AUTH_RATE_LIMITS[endpoint]
  if (!config) {
    throw new Error(`[rate-limit] Unknown endpoint: ${endpoint}. Add to AUTH_RATE_LIMITS.`)
  }

  const redis = getRedisClient()
  const key = `tosom:${config.prefix}:${identifier}`

  if (redis) {
    const result = await redisCheck(key, config.requests, config.windowSeconds)
    if (!result.ok) {
      return { success: false, retryAfter: config.windowSeconds, isDistributed: true }
    }
    return { success: true, remaining: result.remaining, isDistributed: true }
  }

  // Fallback: in-memory
  console.warn(`[rate-limit] WARNING: Redis not configured. Using in-memory fallback for ${endpoint}. No serverless protection.`)
  const memKey = `mem:${config.prefix}:${identifier}`
  const result = memCheck(memKey, config.requests, config.windowSeconds * 1000)

  if (!result.ok) {
    return { success: false, retryAfter: config.windowSeconds, isDistributed: false }
  }
  return { success: true, remaining: result.remaining, isDistributed: false }
}

export async function checkCustomRateLimit(
  key: string,
  requests: number,
  windowSeconds: number
): Promise<{ success: boolean; retryAfter?: number }> {
  const redis = getRedisClient()
  const fullKey = `tosom:custom:${key}`

  if (redis) {
    const result = await redisCheck(fullKey, requests, windowSeconds)
    if (!result.ok) return { success: false, retryAfter: windowSeconds }
    return { success: true }
  }

  console.warn('[rate-limit] Redis not configured. In-memory fallback for custom limit.')
  const memKey = `mem:custom:${key}`
  const result = memCheck(memKey, requests, windowSeconds * 1000)
  if (!result.ok) return { success: false, retryAfter: windowSeconds }
  return { success: true }
}

export async function isRedisAvailable(): Promise<boolean> {
  const redis = getRedisClient()
  if (!redis) return false
  try {
    await redis.ping()
    return true
  } catch {
    return false
  }
}

export function getRateLimitStatus(): {
  redisAvailable: boolean
  configuredEndpoints: string[]
} {
  return {
    redisAvailable: !!getRedisClient(),
    configuredEndpoints: Object.keys(AUTH_RATE_LIMITS),
  }
}