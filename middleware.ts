/**
 * ToSom — Middleware for protected routes
 *
 * Oppdatert for NextAuth v5 med auth() og RBAC.
 * STEG 2.2: Verifiser sesjonssignatur via getToken() — ikke base64-dekodning.
 * STEG 2.3: Admin-autorisasjon kun via verifisert token + isAdminRole().
 *
 * Beskytt kun API-ruter. Side-ruter har egen session-check i server-komponenter og API-ruter.
 *
 * Tillat:
 *   /, /login, /register, /onboarding/* (page), /dashboard (page)
 *   /api/auth/* (NextAuth)
 *   Statisk innhold
 *
 * Beskytt:
 *   /api/profile/*
 *   /api/match/*
 *   /api/journey/*
 *   /api/conversation/*
 *   /admin/* (krever admin-role)
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { verifyAdminCookie } from '@/lib/auth/admin-jwt'
import { isAdminRole } from '@/lib/auth/roles'

const MAINTENANCE_ENABLED = process.env.MAINTENANCE_ENABLED === 'true'
const DEV_LOGIN_DISABLED = process.env.DEV_LOGIN_ENABLED !== 'true'

/** Alltid tilgjengelige baner (nivå 0) */
const PUBLIC_PATHS = [
  '/maintenance',
  '/api/system/health',
  '/api/system/cron-health',  // STEG 1.3: cron-health må være tilgjengelig for Vercel cron
  '/preview',
  '/_next',
  '/favicon.ico',
  '/admin/login',
  '/api/admin/auth',
]

const PROTECTED_API_PREFIXES = [
  '/api/profile',
  '/api/match',
  '/api/journey',
  '/api/conversation',
  '/api/chat',
  '/api/system',
  '/api/ai',
  '/api/admin',
]

const ADMIN_PREFIX = '/admin'

/** Legacy-ruter som skal rettes til nye stier */
const LEGACY_REDIRECTS: Record<string, string> = {
  '/vilk%C3%A5r': '/vilkår',  // URL-encoded variant → korrekt norsk stavemål
}

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname

  // Forward URL to server components via header (for admin layout pathname check)
  const response = NextResponse.next()
  response.headers.set('x-url', req.url)

  // Legacy redirects — URL-encoded /vilkår → /vilkår (korrekt norsk stavemål)
  const redirectTarget = LEGACY_REDIRECTS[path]
  if (redirectTarget) {
    return NextResponse.redirect(new URL(redirectTarget, req.url), {
      status: 301, // permanent redirect
    })
  }

  // Maintenance mode — redirect alt til /maintenance
  if (MAINTENANCE_ENABLED) {
    if (path !== '/maintenance' && !path.startsWith('/maintenance/')) {
      return NextResponse.redirect(new URL('/maintenance', req.url))
    }
    return NextResponse.next()
  }

  // Dev-login — blokkert når DEV_LOGIN_ENABLED !== 'true'
  if (DEV_LOGIN_DISABLED && (path === '/dev-login' || path.startsWith('/api/dev-login'))) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  // 1. Alltid tilgjengelige baner
  for (const publicPath of PUBLIC_PATHS) {
    if (path === publicPath || path.startsWith(publicPath + '/')) {
      return response
    }
  }

  // STEG 2.2: Hent og verifiser signert JWT-token via NextAuth getToken()
  // Dette fungerer i Edge-runtime og krever NEXTAUTH_SECRET for dekryptering
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  // 2. Admin-vern — krever signert admin_token JWT ELLER verifisert session med ADMIN-role
  if (path.startsWith(ADMIN_PREFIX)) {
    const adminJwtPayload = verifyAdminCookie(req)

    // Hvis gyldig signert admin_token JWT (HS256 med issuer 'tosom-admin'), aksepter det umiddelbart
    if (adminJwtPayload) {
      return response
    }

    // Ingen verifisert session → redirect til login
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }

    // STEG 2.3: Sjekk rolle fra verifisert token via isAdminRole() — ikke base64-dekodning
    const role = (token?.role as string) ?? ''
    if (!isAdminRole(role)) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }

    return response
  }

  // 3. API-vern
  for (const prefix of PROTECTED_API_PREFIXES) {
    if (path.startsWith(prefix)) {
      // STEG 2.2: Krev verifisert token — ikke bare tilstedeværelse av cookie
      if (!token) {
        return NextResponse.json(
          { error: 'Uten innlogging. Logg inn først.' },
          { status: 401 }
        )
      }
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|gif|webp|ico|pdf|txt)$).*)',
  ],
}