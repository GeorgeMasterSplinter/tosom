/**
 * ToSom — NextAuth (Auth.js) API Route Handler
 * 
 * Magic Link-auth med PrismaAdapter + EmailProvider.
 */

import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth/nextauth'

// Route handlers — Next.js treng exportera GET/POST
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }