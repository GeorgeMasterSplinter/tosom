/**
 * ToSom Brute Force Protection
 * 
 * Blokkerer IP og email etter flere mislykka innlogging-forsøk.
 */

import { prisma } from '@/lib/prisma'
import { logWarn } from '@/lib/system/log'

interface BruteForceEntry {
  count: number
  windowStart: number
}

const BRUTE_FORCE_MAP = new Map<string, BruteForceEntry>()

const MAX_ATTEMPTS = 5
const BLOCK_DURATION_MS = 15 * 60 * 1000 // 15 minutt

function checkBruteForce(key: string): { allowed: boolean; blocked: boolean } {
  const now = Date.now()
  const entry = BRUTE_FORCE_MAP.get(key)

  if (!entry || now - entry.windowStart > 15 * 60 * 1000) {
    BRUTE_FORCE_MAP.set(key, { count: 1, windowStart: now })
    return { allowed: true, blocked: false }
  }

  if (entry.count >= MAX_ATTEMPTS) {
    return { allowed: false, blocked: true }
  }

  entry.count += 1

  if (entry.count >= MAX_ATTEMPTS) {
    return { allowed: false, blocked: true }
  }

  return { allowed: true, blocked: false }
}

export async function recordFailedLogin(
  ip: string,
  email: string,
): Promise<{ allowed: boolean; blocked: boolean }> {
  const key = `login:${ip}:${email}`
  const result = checkBruteForce(key)

  if (!result.allowed) {
    await logWarn(`Brute force blocked for ${email} from IP ${ip}`, 'security/bruteforce', {
      type: 'brute_force_blocked',
      email,
      ip,
    })
  }

  // Lagre til database for sporing
  await prisma.systemLog.create({
    data: {
      level: 'WARN',
      message: `Failed login attempt for ${email}`,
      module: 'security/bruteforce',
      metadata: { type: 'failed_login', email, ip },
    },
  })

  return result
}

export function isBlocked(ip: string, email: string): boolean {
  const key = `login:${ip}:${email}`
  const entry = BRUTE_FORCE_MAP.get(key)
  if (!entry) return false
  if (entry.count < MAX_ATTEMPTS) return false
  return Date.now() - entry.windowStart < BLOCK_DURATION_MS
}

export function clearFailures(email: string): void {
  for (const key of BRUTE_FORCE_MAP.keys()) {
    if (key.includes(email)) {
      BRUTE_FORCE_MAP.delete(key)
    }
  }
}

export function clearFailedLogin(ip: string, email: string): void {
  const key = `login:${ip}:${email}`
  BRUTE_FORCE_MAP.delete(key)
}
