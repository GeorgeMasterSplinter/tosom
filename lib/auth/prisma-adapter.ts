/**
 * ToSom — Custom Prisma Adapter Wrapper
 *
 * Wraps @auth/prisma-adapter to fix:
 * 1. useVerificationToken: composite key (identifier_token) requires both fields,
 *    but @auth/core sometimes calls it without `identifier`.
 * 2. createUser/updateUser: NextAuth sends `emailVerified: DateTime` but our
 *    schema uses `verified: Boolean`.
 */

import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

const baseAdapter = PrismaAdapter(prisma)

/**
 * Strip NextAuth fields that don't match our Prisma schema.
 * Our User model uses `verified: Boolean` instead of `emailVerified: DateTime`.
 */
function stripUserFields(data: Record<string, any>) {
  const { emailVerified, ...rest } = data
  const result: Record<string, any> = { ...rest }
  if (emailVerified !== undefined) {
    result.verified = true
  }
  return result
}

export const adapter = {
  ...baseAdapter,

  /**
   * Override: map emailVerified → verified (Boolean) for our schema.
   */
  createUser: async (data: Record<string, any>) => {
    const user = await prisma.user.create({ data: stripUserFields(data) as any })
    return { ...user, emailVerified: user.verified ? new Date() : null } as any
  },

  /**
   * Override: map emailVerified → verified (Boolean) for our schema.
   */
  updateUser: async ({ id, ...data }: { id: string } & Record<string, any>) => {
    const user = await prisma.user.update({ where: { id }, data: stripUserFields(data) as any })
    return { ...user, emailVerified: user.verified ? new Date() : null } as any
  },

  /**
   * Override: look up verification token by token alone (individual @unique).
   * The email callback URL only contains `token`, not `identifier`.
   */
  getVerificationToken: async (params: { identifier?: string; token: string }) => {
    if (params.identifier) {
      const vt = await prisma.verificationToken.findUnique({
        where: { identifier_token: { identifier: params.identifier, token: params.token } },
      })
      if (vt) return vt
    }
    // Fallback: look up by token alone (@unique)
    return prisma.verificationToken.findUnique({
      where: { token: params.token },
    })
  },

  /**
   * Override: look up + delete verification token by token alone (individual @unique).
   * Must RETURN the token record — NextAuth uses it to identify the user.
   * Avoids the composite key (identifier_token) which requires both fields.
   */
  useVerificationToken: async (params: { identifier?: string; token: string }) => {
    const vt = await prisma.verificationToken.findUnique({
      where: { token: params.token },
    })
    if (vt) {
      await prisma.verificationToken.deleteMany({
        where: { token: vt.token },
      })
    }
    return vt
  },
}