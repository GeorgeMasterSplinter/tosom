/**
 * ToSom — Session helper for API routes
 * 
 * Bruk denne i server-side API-ruter for a hente session.
 */

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/nextauth'
import { prisma } from '@/lib/prisma'
import { DeepProfileStep } from '@prisma/client'

/**
 * Hent session i ein API route (Node)
 */
export async function getSession() {
  return await getServerSession(authOptions)
}

/**
 * Hent session og verifier at brukaren er innlogga.
 * Kasta feil dersom ikkje.
 */
export async function requireSession() {
  const session = await getSession()
  if (!session?.user?.id) {
    throw new Error('UNAUTHORIZED')
  }
  return session
}

/**
 * Sjekk om brukaren er innlogga
 */
export async function isAuthenticated() {
  const session = await getSession()
  return !!session?.user?.id
}

/**
 * Opprett ein ny User med Profile dersom han ikkje eksisterer.
 * Bruk denne når ein magic link-brukar loggar inn første gong.
 */
export async function ensureUserExists(email: string, name?: string | null) {
  let user = await prisma.user.findUnique({
    where: { email },
    include: { profile: true },
  })

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        name: name || email.split('@')[0],
        profile: {
          create: {
            deepProfileStep: DeepProfileStep.IDENTITY,
          },
        },
      },
      include: { profile: true },
    })
  }

  return user
}