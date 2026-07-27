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
      // Override to disable default Magic Link UI — all handled via custom login page
      async sendVerificationRequest(params) {
        const { identifier, url, provider } = params
        const host = provider.server.host
        console.log(`[ToSom Magic Link] ${identifier} → https://${host}${url}`)
        // We redirect to our premium login page — no default Magic Link UI is rendered
      },
    }),

    // Dev-only credentials login
    CredentialsProvider({
      id: "credentials",
      name: "DevLogin",
      credentials: {},
      async authorize() {
        // Dev bruker ID som matcher fake-match
        const devUserId = process.env.DEV_USER_ID || "1";
        return {
          id: devUserId,
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
        if ((user as any).id === 'dev-user' || (user as any).id === '1') {
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
             age: 25,
             deepProfileStep: "IDENTITY",
           },
         })
       }
     },
  },

  pages: {
    signIn: "/login",
    error: "/login",
    verifyRequest: "/login",
  },

  theme: {
    colorScheme: "dark"
  },

  trustHost: true,
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  useSecureCookies: false,
})
