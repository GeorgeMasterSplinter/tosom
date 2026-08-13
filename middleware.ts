/**
 * ToSom — Middleware for protected routes
 *
 * Oppdatert for NextAuth v5 med auth() og RBAC.
 *
 * Beskytt kun API-ruter. Side-ruter har egen session-check i server-komponenter og API-ruter.
 *
 * Tillat:
 *   /, /login, /register, /onboarding/* (page), /dashboard (page)
 *   /api/auth/* (NextAuth)
 *   Statisk innhald
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
import { verifyAdminCookie } from '@/lib/auth/admin-jwt'

const MAINTENANCE_ENABLED = process.env.MAINTENANCE_ENABLED === 'true'
const DEV_LOGIN_DISABLED = process.env.DEV_LOGIN_ENABLED !== 'true'

/** Alltid tilgjengelege baner (nivå 0) */
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

function getSessionToken(req: NextRequest): string | null {
  return (
    req.cookies.get('authjs.session-token')?.value ??
    req.cookies.get('next-auth.session.token')?.value ??
    null
  )
}

function hasValidSession(req: NextRequest): boolean {
  const token = getSessionToken(req)
  if (token) return true
  return false
}

function getRoleFromSession(req: NextRequest): string | null {
  const token = getSessionToken(req)
  if (!token) return null
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString())
    return payload?.role ?? null
  } catch {
    return null
  }
}

/** Legacy-ruter som skal retast til nye stiar */
const LEGACY_REDIRECTS: Record<string, string> = {
  '/vilk%C3%A5r': '/vilkår',  // URL-encoded variant → korrekt norsk stavemål
}

export function middleware(req: NextRequest) {
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

  // 1. Alltid tilgjengelege baner
  for (const publicPath of PUBLIC_PATHS) {
    if (path === publicPath || path.startsWith(publicPath + '/')) {
      return response
    }
  }

  // 2. Admin-vern — krever signert admin_token JWT ELLER authjs.session-token med admin role
  if (path.startsWith(ADMIN_PREFIX)) {
    const adminJwtPayload = verifyAdminCookie(req)
    const hasAuthSession = hasValidSession(req)

    // Hvis gyldig signert admin_token JWT (HS256 med issuer 'tosom-admin'), aksepter det umiddelbart
    if (adminJwtPayload) {
      return response
    }

    // Ingen session i det hele tatt → redirect til login
    if (!hasAuthSession) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }

    // authjs session finnes, men mangler admin-role → redirect til admin-login
    const role = getRoleFromSession(req)
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }

    return response
  }

  // 3. API-vern
  for (const prefix of PROTECTED_API_PREFIXES) {
    if (path.startsWith(prefix)) {
      if (!hasValidSession(req)) {
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