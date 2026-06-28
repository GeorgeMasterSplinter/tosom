/**
 * ToSom — Admin auth helper
 * 
 * Sikker hjelpefunksjon for å cast session.user til AuthenticatedUser.
 */

import type { AuthenticatedUser } from './rbac'
import type { Role } from './roles'

/**
 * Cast session.user til AuthenticatedUser med default rolle.
 */
export function castToAdminUser(sessionUser: any): AuthenticatedUser | null {
  if (!sessionUser?.id) return null
  
  return {
    id: sessionUser.id,
    name: sessionUser.name ?? sessionUser.email ?? null,
    email: sessionUser.email ?? null,
    image: sessionUser.image ?? null,
    role: (sessionUser.role as Role) || 'user',
  }
}