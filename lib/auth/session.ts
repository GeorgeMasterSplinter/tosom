/**
 * ToSom — Session helper (NextAuth v5 compatible)
 *
 * Gir compatiblitet for koden som brukar getServerSession.
 * I v5 bruker vi auth() frå lib/auth/config istadenfor.
 */

import { auth } from '@/lib/auth/config'

/**
 * Hent session på server-side (ersatt getServerSession).
 * Returnerer null dersom ingen gyldig session.
 */
export async function getSession() {
  try {
    const session = await auth()
    return session
  } catch {
    return null
  }
}

/**
 * getServerSession — Compatiblitetsfunksjon for eksisterande kode.
 * I v5 er dette berre ein wrapper rundt auth().
 * Tek authOptions som argument for backward compatibility (ignored i v5).
 */
export async function getServerSession(_authOptions?: any) {
  return getSession()
}
