/**
 * ToSom Auth Security
 * 
 * Sikkerheitslag for autentisering og autorisasjon.
 */

import { prisma } from '@/lib/prisma'
import { logWarn } from '@/lib/system/log'

/**
 * Verifiser at ein brukar er authentisert
 */
export async function verifySession(token: string): Promise<{ userId: string; role: string } | null> {
  try {
    const session = await prisma.session.findUnique({
      where: { token },
      select: { userId: true, role: true, expiresAt: true },
    })

    if (!session || session.expiresAt < new Date()) {
      return null
    }

    return { userId: session.userId, role: session.role }
  } catch {
    return null
  }
}

/**
 * Krev authentisering — returnerer userId eller kastar feil
 */
export async function requireAuth(token: string): Promise<string> {
  const session = await verifySession(token)
  if (!session) {
    throw new Error('UNAUTHORIZED')
  }
  return session.userId
}

/**
 * Krev admin-rettar — returnerer userId eller kastar feil
 */
export async function requireAdmin(token: string): Promise<string> {
  const session = await verifySession(token)
  if (!session) {
    throw new Error('UNAUTHORIZED')
  }
  if (session.role !== 'ADMIN') {
    throw new Error('FORBIDDEN')
  }
  return session.userId
}

/**
 * Detekter anomali i sesjon (IP/agent-endring)
 */
export async function detectSessionAnomaly(
  userId: string,
  currentIp: string,
  userAgent: string,
): Promise<boolean> {
  try {
    const sessions = await prisma.session.findMany({
      where: { userId },
      select: { ipHash: true, userAgentHash: true },
    })

    for (const session of sessions) {
      if (session.ipHash !== currentIp || session.userAgentHash !== userAgent) {
        await logWarn(`Session anomaly detected for user ${userId}`, 'auth/security', {
          type: 'session_anomaly',
          userId,
          currentIp,
        })
        return true
      }
    }

    return false
  } catch {
    return false
  }
}

/**
 * Generer eit hash av IP-adresse
 */
export function hashIp(ip: string): string {
  let hash = 0
  for (let i = 0; i < ip.length; i++) {
    const char = ip.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(16)
}

/**
 * Generer eit hash av user agent
 */
export function hashUserAgent(ua: string): string {
  let hash = 0
  for (let i = 0; i < ua.length; i++) {
    const char = ua.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(16)
}
