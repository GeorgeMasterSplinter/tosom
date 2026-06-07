/**
 * ToSom Security Headers Middleware
 * 
 * Legger til sikre HTTP-response headers på alle API-ruter.
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function securityHeadersMiddleware(request: NextRequest) {
  const response = NextResponse.next()

  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY')

  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff')

  // Referrer policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-src 'none'; base-uri 'self'; form-action 'self'",
  )

  // XSS Protection
  response.headers.set('X-XSS-Protection', '1; mode=block')

  // Permissions Policy
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=()',
  )

  // Strict Transport Security
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload',
  )

  // Cache control for sensitive data
  if (request.nextUrl.pathname.startsWith('/api/admin')) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
  }

  return response
}
