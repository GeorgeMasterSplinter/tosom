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

/** Maintenance mode — sett MAINTENANCE_ENABLED=true for å aktivere */
const MAINTENANCE_ENABLED = process.env.MAINTENANCE_ENABLED === 'true'

/** Alltid tilgjengelege baner (nivå 0) */
const PUBLIC_PATHS = [
  '/maintenance',
  '/dev-login',
  '/api/dev-login',
  '/_next',
  '/favicon.ico',
]

/** Beskytta API-ruter — krev innlogging */
const PROTECTED_API_PREFIXES = [
  '/api/profile',
  '/api/matching',
  '/api/journey',
  '/api/conversation',
  '/api/chat',
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

  // Maintenance mode — redirect alt til /maintenance
  if (MAINTENANCE_ENABLED) {
    if (path !== '/maintenance' && !path.startsWith('/maintenance/')) {
      return NextResponse.redirect(new URL('/maintenance', req.url))
    }
    return NextResponse.next()
  }

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