/**
 * ToSom — Session helper (NextAuth v5 compatible)
 *
 * Gir compatiblitet for koden som brukar getServerSession.
 * I v5 bruker vi auth() frå lib/auth/config istadenfor.
 */

import { auth } from '@/lib/auth/config'
import { prisma } from '@/lib/prisma'

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
 * I v5 er dette bare ein wrapper rundt auth().
 * Tek authOptions som argument for backward compatibility (ignored i v5).
 */
export async function getServerSession(_authOptions?: any) {
  return getSession()
}

/**
 * requireNotBanned — Sjekk om brukaren er utestengt.
 * Returnerer NextResponse med 403 dersom brukaren har bannedAt satt.
 * Importerer NextResponse dynamisk for å unngå sirkulær avhengighet.
 */
export async function requireNotBanned(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { bannedAt: true },
  })

  if (user?.bannedAt) {
    // Dynamic import to avoid circular dependency with NextResponse
    const { NextResponse } = await import('next/server')
    return NextResponse.json({ error: "Utestengt" }, { status: 403 })
  }

  return null
}