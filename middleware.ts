/**
 * ToSom — Middleware for protected routes
 * 
 * Beskytt kun API-ruter. Side-ruter (onboarding, dashboard, etc.)
 * har eigen session-check i server-komponentar og API-rutar.
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
 *   /admin/*
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ─── Konfigurasjon ───

/* ------------------------------------------------------------------ */
/* ToSom UI 5.0 — Tilgangsmodellen                                      */
/* Nivå 0: Uinnlogget → public marketing sider                          */
/* Nivå 1: Innlogget → dashboard, onboarding                            */
/* Nivå 2: Betalt / fullt profilt → matching, reise, chat               */
/* ------------------------------------------------------------------ */

// Alltid tilgjengelege baner (nivå 0)
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
  '/kvifor',
  '/slik',
  '/reisen',
  '/priser',
  '/betaling',
  '/questions',
  '/onboarding',
];

/* Nivå 1: Krev innlogging — påmeldte sider */
const AUTH_REQUIRED_PATHS = [
  '/dashboard',
  '/journey',
  '/profile',
  '/matching',
  '/chat',
  '/onboarding',
];

/* Nivå 2: Krev innlogging + betalt/aktiv profil — TODO: implementer betalingsjekk */
const PREMIUM_PATHS = [
  '/matching',
  '/journey',
  '/chat',
];

// Beskytta API-ruter
const PROTECTED_API_PREFIXES = [
  '/api/profile',
  '/api/matching',
  '/api/journey',
  '/api/conversation',
  '/api/system',
  '/api/ai',
];

// Beskytta admin-ruter
const ADMIN_PREFIX = '/admin';

/* ------------------------------------------------------------------ */
/* Session-verifisering                                                  */
/* ------------------------------------------------------------------ */

function getSessionToken(req: NextRequest): string | null {
  return req.cookies.get('next-auth.session.token')?.value ?? null;
}

function hasValidSession(req: NextRequest): boolean {
  const token = getSessionToken(req);
  if (token) return true;

  // Alternative session-variantar (tosom_session cookie)
  const cookieHeader = req.headers.get('cookie') || '';
  return /tosom_session=[^;]+/.test(cookieHeader);
}

// ─── Middleware ───

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // 1. Alltid tilgjengelege baner
  for (const publicPath of PUBLIC_PATHS) {
    if (path === publicPath || path.startsWith(publicPath + '/')) {
      return NextResponse.next();
    }
  }

  // 2. Auth-required baner (nivå 1)
  for (const authPath of AUTH_REQUIRED_PATHS) {
    if (path === authPath || path.startsWith(authPath + '/')) {
      if (!hasValidSession(req)) {
        const loginUrl = new URL('/login', req.url);
        loginUrl.searchParams.set('callbackUrl', req.url);
        return NextResponse.redirect(loginUrl);
      }
      return NextResponse.next();
    }
  }

  // 3. Premium baner (nivå 2) — TODO: legg inn betalingsjekk seinare
  for (const premiumPath of PREMIUM_PATHS) {
    if (path === premiumPath || path.startsWith(premiumPath + '/')) {
      if (!hasValidSession(req)) {
        const loginUrl = new URL('/login', req.url);
        loginUrl.searchParams.set('callbackUrl', req.url);
        return NextResponse.redirect(loginUrl);
      }
      // TODO: Sjekk om brukaren har betalt / aktiv profil
      // if (!user.hasPaid) { return NextResponse.redirect(new URL('/betaling', req.url)); }
      return NextResponse.next();
    }
  }

  // 4. Admin-vern
  if (path.startsWith(ADMIN_PREFIX)) {
    if (!hasValidSession(req)) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    return NextResponse.next();
  }

  // 5. API-vern
  for (const prefix of PROTECTED_API_PREFIXES) {
    if (path.startsWith(prefix)) {
      if (!hasValidSession(req)) {
        return NextResponse.json(
          { error: 'Uten innlogging. Logg inn først.' },
          { status: 401 }
        );
      }
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|gif|webp|ico|pdf|txt)$).*)',
  ],
};