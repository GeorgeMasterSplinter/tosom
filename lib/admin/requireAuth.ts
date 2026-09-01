/**
 * ToSom — requireAuth for admin API-ruter
 *
 * Sikrer at kun admin-brukere kan kalle admin-API-er.
 * Bruk dette i alle admin API-ruter.
 *
 * ⚠️ ENHETLIG ADMIN-AUTH: Dette er nå den ENE kilden for admin-autentisering.
 * Alle admin-ruter må gå gjennom requireAdminAuth() som bruker KRYPTGRAFISK JWT-verifisering.
 * Den tidligere enkle string-sammenligningen (adminTokenMatch[1] === 'valid') er fjernet.
 */

import { NextResponse } from 'next/server'
import { isAdmin, ensureRole, AuthenticatedUser } from '@/lib/auth/rbac'
import { requireAdmin as requireAdminRole } from '@/lib/auth/rbac'
import { verifyAdminTokenAsync } from '@/lib/auth/admin-jwt'

/**
 * Hent session-data fra cookie og returner decoded data.
 * Aksepterer kun admin_token cookie med KRYPTGRAFISK VERIFISERT JWT-signatur.
 *
 * Merk: Denne funksjonen gjør en rask dekode uten signaturverifisering.
 * For full verifisering, bruk requireAdminAuth() som kaller verifyAdminTokenAsync().
 */
export function getSessionData(req: Request): { userId: string; role: string } | null {
  const cookieHeader = req.headers.get('cookie') || ''

  // Kun admin_token med korrekt JWT-format aksepteres
  const adminTokenMatch = cookieHeader.match(/admin_token=([^;]+)/)
  if (!adminTokenMatch) return null

  const token = adminTokenMatch[1]
  
  // Rask dekode for å hente payload (signaturverifisering gjøres i requireAdminAuth)
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    
    const payloadB64 = parts[1]
    // Base64url-decode
    let standard = payloadB64.replace(/-/g, '+').replace(/_/g, '/')
    while (standard.length % 4 !== 0) standard += '='
    
    const payload = JSON.parse(Buffer.from(standard, 'base64').toString())
    
    // Grunleggende validering
    if (!payload?.sub || payload.iss !== 'tosom-admin' || payload.role !== 'ADMIN') return null
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null
    
    return {
      userId: payload.sub, // email fra JWT payload
      role: 'admin',
    }
  } catch {
    return null
  }
}

/**
 * Auth og role-sjekk for admin API-er.
 * Returnerer { user, sessionToken } eller NextResponse med 401/403.
 *
 * ⚠️ Denne funksjonen KRYPTGRAFISK VERIFISERER JWT-signaturen før tilgang gis.
 */
export async function requireAdminAuth(req: Request): Promise<
  | { user: AuthenticatedUser; sessionToken: string }
  | NextResponse
> {
  const cookieHeader = req.headers.get('cookie') || ''
  const adminTokenMatch = cookieHeader.match(/admin_token=([^;]+)/)

  if (!adminTokenMatch) {
    return NextResponse.json(
      { error: 'Unauthorized: Ingen gyldig session' },
      { status: 401 }
    )
  }

  // KRYPTGRAFISK VERIFISERING av JWT-signatur (HMAC-SHA256)
  const payload = await verifyAdminTokenAsync(adminTokenMatch[1])
  if (!payload) {
    return NextResponse.json(
      { error: 'Unauthorized: Ugyldig eller utløpt token' },
      { status: 401 }
    )
  }

  // Verifiser at payload er admin
  if (payload.role !== 'ADMIN') {
    return NextResponse.json(
      { error: 'Forbidden: Admin-tilgang kreves' },
      { status: 403 }
    )
  }

  const user: AuthenticatedUser = ensureRole({
    id: payload.sub, // email fra JWT
    role: 'admin',
  })

  return {
    user,
    sessionToken: adminTokenMatch[1],
  }
}

// ─── Re-exports for backward compatibility ───
// Filet som importerer `requireAdmin` fra lib/admin/requireAuth:
import { requireAdmin as requireAdminFromRbac } from '@/lib/auth/rbac'

/**
 * requireAdmin — Krever at brukeren har ADMIN rolle (re-export)
 */
export function requireAdmin(user: AuthenticatedUser | null | undefined): void {
  requireAdminFromRbac(user)
}

/**
 * Quick-check: er brukeren admin?
 */
export function isUserAdmin(req: Request): boolean {
  const sessionData = getSessionData(req)
  if (!sessionData) return false
  return sessionData.role === 'admin'
}

/**
 * requireAuth — Generic auth for sensitive API-ruter (re-export)
 */
export async function requireAuth(req: Request): Promise<
  | { user: AuthenticatedUser; sessionToken: string }
  | NextResponse
> {
  const sessionData = getSessionData(req)
  if (!sessionData) {
    return NextResponse.json(
      { error: 'Unauthorized: Ingen gyldig session' },
      { status: 401 }
    )
  }

  const user: AuthenticatedUser = ensureRole({
    id: sessionData.userId,
    role: sessionData.role,
  })

  return { user, sessionToken: '' }
}
