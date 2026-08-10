/**
 * ToSom — Admin auth helper
 * 
 * Sikker hjelpefunksjon for å cast requireAuth result til admin-friendly type.
 * Accepterer AuthUser (frå requireAuth) og returnerar simple admin-object.
 */

import type { Role } from './roles'
import { isAdminRole, defaultRole } from './roles'

interface SimpleAdminUser {
  id: string
  email: string
  name: string | null
  image: string | null
  role: Role
}

/**
 * Cast AuthUser (id/email/role) til SimpleAdminUser.
 * Bruker isAdminRole() for å handsame both lowercase "admin" og uppercase "ADMIN".
 */
export function castToAdminUser(sessionUser: { id: string; email: string; name?: string | null; image?: string | null; role: string }): SimpleAdminUser {
  if (!sessionUser?.id) {
    throw new Error('castToAdminUser feila: manglande user.id')
  }

  return {
    id: sessionUser.id,
    name: sessionUser.name ?? sessionUser.email ?? null,
    email: sessionUser.email,
    image: sessionUser.image ?? null,
    role: isAdminRole(sessionUser.role) ? 'ADMIN' : defaultRole(sessionUser.role),
  }
}

// backwards-compatible alias
export type AuthenticatedUser = SimpleAdminUser
