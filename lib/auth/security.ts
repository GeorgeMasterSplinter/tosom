/**
 * ToSom Auth Security
 * 
 * Sikkerheitslag for autentisering og autorisasjon.
 * Bruker getServerSession (NextAuth) sidan det ikke eksisterer en Session model i Prisma.
 */

import { getServerSession } from '@/lib/auth/session'
import { logWarn } from '@/lib/system/log'
import { Role } from '@prisma/client'

/**
 * Verifiser at en bruker er authentisert via NextAuth session.
 * Returnerar null dersom ikke innlogga.
 */
export async function verifySession(): Promise<{ userId: string; role: Role } | null> {
  try {
    const session = await getServerSession()

    if (!session?.user?.id) {
      return null
    }

    return { userId: (session.user as any).id, role: ((session.user as any).role as Role) || Role.USER }
  } catch {
    return null
  }
}

/**
 * Krev authentisering — returnerer userId eller kastar feil
 */
export async function requireAuth(): Promise<string> {
  const session = await verifySession()
  if (!session) {
    throw new Error('UNAUTHORIZED')
  }
  return session.userId
}

/**
 * Krev admin-rettar — returnerer userId eller kastar feil
 */
export async function requireAdmin(): Promise<string> {
  const session = await verifySession()
  if (!session) {
    throw new Error('UNAUTHORIZED')
  }
  if (session.role !== Role.ADMIN) {
    throw new Error('FORBIDDEN')
  }
  return session.userId
}

/**
 * Detekter anomali i sesjon (IP/agent-endring)
 * Merk: Ikke implementert uten IP-logging i DB.
 */
export async function detectSessionAnomaly(
  _userId: string,
  _currentIp: string,
  _userAgent: string,
): Promise<boolean> {
  // IP-basert anomali-deteksjon krev IP-logging som ikke er implementert.
  // Returnerer false som standard for å unngå falske positive.
  return false
}

/**
 * Generer et hash av IP-adresse
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
 * Generer et hash av user agent
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
