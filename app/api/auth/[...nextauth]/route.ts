/**
 * ToSom — NextAuth v5 API Route Handler
 *
 * Migrert til NextAuth v5 (beta).
 * Bruker handlers fra lib/auth/config.ts.
 */

import { handlers } from '@/lib/auth/config'

export const { GET, POST } = handlers