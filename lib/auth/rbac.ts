/**
 * ToSom — RBAC (Role-Based Access Control) helpers
 *
 * Provides utility functions to check roles from sessions, tokens, and raw data.
 */

import { Role, hasAnyRole, hasAtLeastRole, defaultRole, isAdminRole } from '@/lib/auth/roles'

/** Session user shape extended with role */
export interface AuthenticatedUser {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
  role: Role
}

/** Enhanced session shape used after NextAuth v5 migration */
export interface AuthSession {
  user: AuthenticatedUser
  expires: string
}

/**
 * Check if the user has the exact required role.
 */
export function isAdmin(user: AuthenticatedUser | undefined | null): boolean {
  return isAdminRole(user?.role)
}

/**
 * Check if the user has support role or higher.
 */
export function isSupportOrAbove(user: AuthenticatedUser | undefined | null): boolean {
  if (!user) return false
  return user.role === 'SUPPORT' || user.role === 'ADMIN'
}

/**
 * Check if the user has any of the allowed roles.
 */
export function hasAnyAllowedRole(
  user: AuthenticatedUser | undefined | null,
  allowed: Role[]
): boolean {
  if (!user) return false
  return hasAnyRole(user.role, allowed)
}

/**
 * Check if the user has at least the minimum required role.
 */
export function hasMinimumRole(
  user: AuthenticatedUser | undefined | null,
  minRole: Role
): boolean {
  if (!user) return false
  return hasAtLeastRole(user.role, minRole)
}

/**
 * Check if a token (from JWT) has admin role.
 */
export function isAdminToken(token: Record<string, unknown> | null | undefined): boolean {
  return isAdminRole(token?.role as string | undefined)
}

/**
 * Check if a token has any allowed role.
 */
export function hasAnyTokenRole(
  token: Record<string, unknown> | null | undefined,
  allowed: Role[]
): boolean {
  if (!token) return false
  return hasAnyRole(token.role as string, allowed)
}

/**
 * Extract user from a Prisma user object and assign default role.
 */
export function ensureRole(user: Record<string, unknown>): AuthenticatedUser {
  return {
    id: String(user.id ?? ''),
    name: (user.name as string) ?? null,
    email: (user.email as string) ?? null,
    image: (user.image as string) ?? null,
    role: defaultRole(user.role as string),
  }
}

/**
 * Assert admin access — throws Error (for use in API handlers).
 */
export function requireAdmin(user: AuthenticatedUser | undefined | null): void {
  if (!user || !isAdminRole(user.role)) {
    throw new Error('Forbidden: Admin access required')
  }
}

/**
 * Assert support access — throws Error (for use in API handlers).
 */
export function requireSupport(user: AuthenticatedUser | undefined | null): void {
  if (!user || !isSupportOrAbove(user)) {
    throw new Error('Forbidden: Support access required')
  }
}