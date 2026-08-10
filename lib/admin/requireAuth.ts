/**
 * ToSom — requireAuth for admin API-ruter
 *
 * Sikrer at kun admin-brukarar kan kalle admin-API-er.
 * Bruk dette i alle admin API-ruter.
 */

import { NextResponse } from 'next/server'
import { isAdmin, ensureRole, AuthenticatedUser } from '@/lib/auth/rbac'
import { requireAdmin as requireAdminRole } from '@/lib/auth/rbac'

/**
 * Hent session-token frå cookie og returner decoded data.
 * Aksepterer både next-auth.session.token OG admin_token cookie.
 */
export function getSessionData(req: Request): { userId: string; role: string } | null {
  const cookieHeader = req.headers.get('cookie') || ''

  // Først: sjekk om admin_token-cookie er satt (fra /api/admin/auth)
  const adminTokenMatch = cookieHeader.match(/admin_token=([^;]+)/)
  if (adminTokenMatch && adminTokenMatch[1] === 'valid') {
    return {
      userId: 'admin',
      role: 'admin',
    }
  }

  // Deretter: sjekk next-auth.session.token
  const match = cookieHeader.match(/next-auth\.session\.token=([^;]+)/)
  if (!match) return null
  try {
    const token = match[1]
    const payload = JSON.parse(Buffer.from(token, 'base64').toString())
    if (!payload?.userId) return null
    return {
      userId: payload.userId,
      role: payload.role ?? 'user',
    }
  } catch {
    return null
  }
}

/**
 * Auth og role-sjekk for admin API-er.
 * Returnerer { user, sessionToken } eller NextResponse med 401/403.
 */
export async function requireAdminAuth(req: Request): Promise<
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

  requireAdminRole(user)

  return {
    user,
    sessionToken: '',
  }
}

// ─── Re-exports for backward compatibility ───
// Filet som importerer `requireAdmin` frå lib/admin/requireAuth:
import { requireAdmin as requireAdminFromRbac } from '@/lib/auth/rbac'

/**
 * requireAdmin — Krever at brukaren har ADMIN rolle (re-export)
 */
export function requireAdmin(user: AuthenticatedUser | null | undefined): void {
  requireAdminFromRbac(user)
}

/**
 * Quick-check: er brukaren admin?
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
