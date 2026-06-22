/**
 * ToSom — NextAuth (Auth.js) Configuration
 * 
 * Magic Link-auth med PrismaAdapter + EmailProvider.
 * Privat, rolig og trygg innlogging.
 */

import type { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import EmailProvider from 'next-auth/providers/email'
import { prisma } from '@/lib/prisma'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,

  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST || 'smtp.resend.com',
        port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
        auth: {
          user: process.env.EMAIL_SERVER_USER || '',
          pass: process.env.EMAIL_SERVER_PASSWORD || '',
        },
      },
      from: process.env.EMAIL_FROM || 'ToSom <no-reply@tosom.no>',
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 dagar
  },

  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 30 * 24 * 60 * 60, // 30 dagar
  },

  pages: {
    signIn: '/login',
    verifyRequest: '/login',
    error: '/login',
  },

  callbacks: {
    async session({ session, token }) {
      if (session.user && token) {
        ;(session.user.id as string) = token.sub || ''
      }
      return session
    },

    async jwt({ token, user }) {
      if (user) {
        ;(token.role as string) = (user as any).role || 'USER'
      }
      return token
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith('/verify')) {
        return baseUrl + '/dashboard'
      }
      if (url.startsWith(baseUrl)) return url
      return baseUrl + '/dashboard'
    },
  },

  events: {
    async createUser({ user }) {
      if (user.email) {
        await prisma.profile.create({
          data: {
            userId: user.id!,
            deepProfileStep: 'IDENTITY',
          },
        })
      }
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  useSecureCookies: process.env.NODE_ENV === 'production',
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        domain: (() => {
          try {
            if (process.env.NEXTAUTH_URL) {
              return new URL(process.env.NEXTAUTH_URL).hostname
            }
          } catch {
            // Invalid URL — fall through to undefined
          }
          return undefined
        })(),
      },
    },
  },
}
