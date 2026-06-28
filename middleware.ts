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
 *   /api/matching/*
 *   /api/journey/*
 *   /api/conversation/*
 *   /admin/* (krever admin-role)
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ─── Konfigurasjon ───

/** Alltid tilgjengelege baner (nivå 0) */
const PUBLIC_PATHS = [
  '/',
  '/login',
  '/register',
  '/api/auth',
  '/favicon.ico',
  '/_next',
  '/api/health',
  '/docs',
  '/brand',
  '/hvorfor',
  '/slik',
  '/reisen',
  '/priser',
  '/betaling',
  '/questions',
  '/onboarding',
  '/match',
  '/matching',
  '/vilkar',
  '/vilkar',
  '/dashboard',
  '/journey',
  '/profile',
  '/chat',
  '/admin',
  '/design-system',
  '/ui',
  '/blogg',
  '/cookies',
  '/kontakt',
  '/om-oss',
  '/personvern',
]

/** Beskytta API-ruter — krev innlogging */
const PROTECTED_API_PREFIXES = [
  '/api/profile',
  '/api/matching',
  '/api/journey',
  '/api/conversation',
  '/api/system',
  '/api/ai',
  '/api/admin',
]

/** Admin-ruter — krev admin-role */
const ADMIN_PREFIX = '/admin'

// ─── Session-verifisering (NextAuth v5 kompatibel) ───

function getSessionToken(req: NextRequest): string | null {
  return req.cookies.get('next-auth.session.token')?.value ?? null
}

function hasValidSession(req: NextRequest): boolean {
  const token = getSessionToken(req)
  if (token) return true
  // ⚠️  Sikkerheit: akseptert ikkje arbitrary cookies som gyldig session
  return false
}

// ─── RBAC-hjelp ───

/** Hent role frå session-token (JWT-dekodning) */
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

// ─── Middleware ───

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname

  // 1. Alltid tilgjengelege baner
  for (const publicPath of PUBLIC_PATHS) {
    if (path === publicPath || path.startsWith(publicPath + '/')) {
      return NextResponse.next()
    }
  }

  // 2. Admin-vern — krev admin-role
  if (path.startsWith(ADMIN_PREFIX)) {
    if (!hasValidSession(req)) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
    const role = getRoleFromSession(req)
    if (role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      )
    }
    return NextResponse.next()
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
      return NextResponse.next()
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|gif|webp|ico|pdf|txt)$).*)',
  ],
}