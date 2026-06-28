/**
 * ToSom — NextAuth v5 Configuration (FINAL)
 *
 * Magic Link auth with Prisma adapter + Email provider.
 * Full v5 syntax. No deprecated fields.
 */

import NextAuth from "next-auth"
import EmailProvider from "next-auth/providers/email"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import { defaultRole } from "@/lib/auth/roles"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),

  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST!,
        port: Number(process.env.EMAIL_SERVER_PORT || 587),
        auth: {
          user: process.env.EMAIL_SERVER_USER!,
          pass: process.env.EMAIL_SERVER_PASSWORD!,
        },
      },
      from: process.env.EMAIL_FROM || "ToSom <no-reply@tosom.no>",
    }),

    // Dev-only credentials login
    CredentialsProvider({
      id: "credentials",
      name: "DevLogin",
      credentials: {},
      async authorize() {
        return {
          id: "dev-user",
          email: "dev@tosom.local",
          name: "Testbruker",
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      // Legg role og sub i token ved første login
      if (user) {
        const role: string = (user as any).role ?? 'user'
        token.role = defaultRole(role)
        token.sub = (user as any).id

        // Dev‑bruker får alltid rollen "dev"
        if ((user as any).id === 'dev-user') {
          token.role = 'dev'
        }
      }
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!
        ;(session.user as any).role = (token.role as string) || 'user'
      }
      return session
    },
  },

  events: {
    async createUser({ user }) {
      if (user.email) {
        await prisma.profile.create({
          data: {
            userId: user.id!,
            deepProfileStep: "IDENTITY",
          },
        })
      }
    },
  },

  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET,
})
