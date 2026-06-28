/**
 * ToSom — Role definitions
 *
 * Role-based access control for ToSom platform.
 */

export type Role = 'user' | 'admin' | 'support'

export const ROLES: Readonly<Role[]> = ['user', 'admin', 'support'] as const

export const ROLE_HIERARCHY: Record<Role, number> = {
  user: 1,
  support: 2,
  admin: 3,
}

/** Check if role A has at least the permissions of role B */
export function hasAtLeastRole(role: Role, minRole: Role): boolean {
  return (ROLE_HIERARCHY[role] ?? 0) >= (ROLE_HIERARCHY[minRole] ?? 0)
}

/** Check if role is exactly the given role */
export function hasExactRole(role: Role | string | undefined, target: Role): boolean {
  return role === target
}

/** Check if role is in the allowed list */
export function hasAnyRole(role: Role | string | undefined, allowed: Role[]): boolean {
  if (!role) return false
  return allowed.includes(role as Role)
}

/** Default role when none is specified */
export function defaultRole(role: Role | string | null | undefined): Role {
  return (role as Role) || 'user'
}