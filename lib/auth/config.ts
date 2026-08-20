/**
 * ToSom — NextAuth v5 Configuration (BETA: Email + Passord)
 *
 * Midlertidig auth for beta-test: epost + passord (CredentialsProvider).
 * Auto-registrering: ny epost → konto lages automatisk.
 *
 * ENDTELIG LØSNING: Vipps (VIPPS-INTEGRATION-PLAN-v1.0.md).
 * Når Vipps er på plass, fjernes CredentialsProvider og
 * settes NEXT_PUBLIC_VIPPS_ENABLED=true.
 */

import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { adapter } from "@/lib/auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import { defaultRole } from "@/lib/auth/roles"
import { hashPassword, verifyPassword } from "@/lib/auth/hash"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter,

  providers: [
    CredentialsProvider({
      name: "Email & Passord",
      credentials: {
        email: { label: "Epost", type: "email" },
        password: { label: "Passord", type: "password" },
      },
      async authorize(credentials) {
        const email = String((credentials as any)?.email ?? "").trim().toLowerCase()
        const password = String((credentials as any)?.password ?? "")

        if (!email || !password) return null

        // Sjekk om brukeren finnes
        let user = await prisma.user.findUnique({ where: { email } })

        if (!user) {
          // AUTO-REGISTRERING: ny epost → lag konto
          const passwordHash = await hashPassword(password)
          user = await prisma.user.create({
            data: {
              email,
              password: passwordHash,
              verified: true,
              role: "USER",
            },
          })

          // Lag minimal profil (onboarding fyller resten)
          await prisma.profile.create({
            data: {
              userId: user.id,
              age: 25,
              deepProfileStep: "IDENTITY",
            },
          }).catch(() => {})

          console.log(`[Tosom Beta] Ny bruker registrert: ${email}`)
        } else {
          // EKISTERENDE BRUKER: verifiser passord
          if (!user.password) {
            // Bruker uten passord (fra tidligere magic-link-æra) — sett nytt
            const passwordHash = await hashPassword(password)
            await prisma.user.update({
              where: { id: user.id },
              data: { password: passwordHash },
            })
          } else {
            const valid = await verifyPassword(password, user.password)
            if (!valid) return null
          }
        }

        return { id: user.id, email: user.email, name: user.name }
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

  // S2 FIX: I produksjon bruker vi BARE kjente hosts. Lokalt er trustHost:true OK.
  trustHost: process.env.NODE_ENV === 'production'
    ? Boolean(process.env.VERCEL_URL || process.env.NEXTAUTH_URL)
    : true,

  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,

  // S1 FIX: Secure cookies i produksjon (kreker HTTPS). false lokalt for HTTP-dev.
  useSecureCookies: process.env.NODE_ENV === 'production',
})
