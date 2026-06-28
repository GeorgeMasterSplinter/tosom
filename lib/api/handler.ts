/**
 * ToSom — Felles API-handler
 *
 * Gir ein standardisert måte å behandle API-ruter med:
 * - auth (valgfritt)
 * - RBAC (valgfritt)
 * - Zod-validering (valgfritt)
 * - Rate limiting (valgfritt)
 * - Konsistent feilhåndtering
 *
 * Bruk i API-ruter:
 *   export async function POST(req: NextRequest) {
 *     return createApiHandler({
 *       auth: true,
 *       role: 'admin',  // optional: which role required
 *       schema: MySchema,
 *       rateLimit: { windowMs: 60_000, max: 60 },
 *       handler: async ({ user, body }) => {
 *         // din logikk
 *         return NextResponse.json({ ok: true })
 *       },
 *     })
 *   }
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth/config'
import { getSessionData } from '@/lib/admin/requireAuth'
import { isAdmin, hasAnyAllowedRole } from '@/lib/auth/rbac'
import type { Role } from '@/lib/auth/roles'
import { hasAnyRole } from '@/lib/auth/roles'
import { validateBody, validateQuery } from '@/lib/api/validation'
import { checkRateLimit, getRateLimitHeaders, checkStrictRateLimit } from '@/lib/api/rateLimit'

/**
 * Konfigurasjon for createApiHandler
 */
interface ApiHandlerOptions {
  /** Krevar innlogging? */
  auth?: boolean

  /** Krev spesifikk rol? 'user' | 'admin' | 'support' | ['admin', 'support'] */
  role?: string | string[]

  /** Zod-skjema for body-validering */
  schema?: z.ZodTypeAny

  /** Rate limiting-konfig. True = default, false = ingen, objekt = custom */
  rateLimit?: boolean | { windowMs?: number; maxRequests?: number; strict?: boolean }

  /** Sjekk rate limit før auth? (for sensitive endepunkt som login) */
  rateLimitFirst?: boolean

  /** Hovudfunksjon */
  handler: (context: {
    user: { id: string; role: string; email?: string | null } | null
    body: unknown
    query: Record<string, string>
    ip: string
  }) => Promise<NextResponse>

  /** Custom feilhåndtering (valgfritt) */
  onError?: (error: Error) => NextResponse
}

/**
 * Hent IP-adresse frå request.
 */
function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  const realIp = req.headers.get('x-real-ip')
  if (realIp) return realIp.trim()
  return '127.0.0.1'
}

/**
 * Hent session.
 */
async function getSession(): Promise<{
  user: { id: string; email: string | null; role: string }
} | null> {
  try {
    const session = await auth()
    if (!session?.user) return null
    return {
      user: {
        id: session.user.id || '',
        email: session.user.email ?? null,
        role: (session.user as any).role || 'user',
      },
    }
  } catch {
    return null
  }
}

/**
 * Opprett ein standardisert API-handler.
 */
export async function createApiHandler(opts: ApiHandlerOptions): Promise<NextResponse> {
  const {
    auth = false,
    role,
    schema,
    rateLimit,
    rateLimitFirst = false,
    handler,
    onError,
  } = opts

  const ip = getClientIp(globalThis.request || ({} as NextRequest))

  // --- Rate limiting (før auth viss rateLimitFirst=true) ---
  if (rateLimit && !rateLimitFirst) {
    const rl = handleRateLimit(ip, rateLimit)
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Prøv igjen seinare.' },
        { status: 429, headers: getRateLimitHeaders(rl.remaining, rl.resetInMs) }
      )
    }
  }

  // --- Auth ---
  let user: { id: string; role: string; email?: string | null } | null = null
  if (auth) {
    const session = await getSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized: Innlogging krevst' },
        { status: 401 }
      )
    }
    user = session.user
  }

  // --- RBAC ---
  if (role && user) {
    const allowedRoles = Array.isArray(role) ? role : [role]
    if (!hasAnyAllowedRole({ ...user, role: user.role as Role }, allowedRoles as Role[])) {
      return NextResponse.json(
        { error: 'Forbidden: Ugyldig tilgang' },
        { status: 403 }
      )
    }
  }

  // --- Zod-validering ---
  let body: unknown = undefined
  if (schema) {
    // For GET-ruter: ingen body
    const method = globalThis.request ? (globalThis.request as NextRequest).method : 'GET'
    if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
      try {
        const data = await (globalThis.request as NextRequest).json()
        const result = validateBody(schema, data)
        if (!result.success) {
          return NextResponse.json(
            { error: 'Invalid input', details: result.error.flatten() },
            { status: 400 }
          )
        }
        body = result.data as unknown
      } catch {
        return NextResponse.json(
          { error: 'Invalid JSON body' },
          { status: 400 }
        )
      }
    }
  }

  // --- Hent query ---
  const query: Record<string, string> = {}
  if (globalThis.request) {
    const req = globalThis.request as NextRequest
    for (const [key, value] of req.nextUrl.searchParams.entries()) {
      query[key] = value
    }
  }

  // --- Kjør handler ---
  try {
    return await handler({ user, body, query, ip })
  } catch (error) {
    if (onError) return onError(error as Error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Handle rate limiting.
 */
function handleRateLimit(
  ip: string,
  rateLimit: boolean | { windowMs?: number; maxRequests?: number; strict?: boolean }
): { allowed: boolean; remaining: number; resetInMs: number } {
  if (rateLimit === true) {
    return checkRateLimit(ip)
  }
  if (typeof rateLimit === 'object') {
    if (rateLimit.strict) {
      const result = checkStrictRateLimit(ip)
      return {
        allowed: result.allowed,
        remaining: result.allowed ? 4 : 0,
        resetInMs: rateLimit.windowMs ?? 15_000,
      }
    }
    return checkRateLimit(ip, {
      windowMs: rateLimit.windowMs,
      maxRequests: rateLimit.maxRequests,
    })
  }
  return { allowed: true, remaining: 999, resetInMs: 0 }
}