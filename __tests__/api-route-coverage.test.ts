/**
 * PL-25 (V-11) — API-rutedekning mot middleware.
 *
 * Regel: hver rute (app/api …/route.ts) må enten
 *   - være beskyttet av et prefiks i PROTECTED_API_PREFIXES (middleware.ts), eller
 *   - stå i PUBLIC_PATHS (middleware.ts), eller
 *   - stå eksplisitt i OFFENTLIGE_RUTER nedenfor med begrunnelse.
 *
 * En ny rute uten dekning gjør denne testen rød.
 * En oppføring i OFFENTLIGE_RUTER som peker på en rute som ikke lenger
 * finnes, gjør den også rød (f.eks. etter at PL-20 sletter telefontastene
 * må oppføringene under slettes).
 */
import { readdirSync, statSync } from 'fs'
import { join } from 'path'

// Middlewareen importerer getToken fra 'next-auth/jwt' — pakken er ESM,
// som jest (CJS) ikke laster. Testen bruker bare stielistene fra
// middlewareen, ikke autentiseringslogikken, så vi mocker importen.
jest.mock('next-auth/jwt', () => ({ getToken: jest.fn() }))

import { PROTECTED_API_PREFIXES, PUBLIC_PATHS } from '../middleware'

const ROOT = process.cwd()
const API_ROOT = join(ROOT, 'app', 'api')

/** Finn alle route.ts-filer under app/api og lag /api/-stier. */
function findRoutePaths(dir: string): string[] {
  const out: string[] = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      out.push(...findRoutePaths(full))
    } else if (entry === 'route.ts') {
      // app/api/foo/bar/route.ts → /api/foo/bar
      const rel = full.slice(API_ROOT.length + 1).replace(/\\/g, '/')
      out.push('/api/' + rel.replace(/\/route\.ts$/, ''))
    }
  }
  return out
}

/** Samme matching som i middleware: nøyaktig treff eller prefiks + '/'. */
function isCovered(path: string, prefixes: string[]): boolean {
  return prefixes.some((p) => path === p || path.startsWith(p + '/'))
}

/**
 * Ruter som bevisst ikke står bak et beskyttet prefiks.
 * Hver oppføring må ha en begrunnelse for hvorfor det er trygt.
 */
const OFFENTLIGE_RUTER: Record<string, string> = {
  // NextAuth og åpne flyter
  '/api/auth/[...nextauth]': 'NextAuth (jwt, callback, innlogging).',
  '/api/auth/register': 'Åpen registreringsflyt.',
  '/api/auth/request-reset': 'Åpen glemt-passord-flyt (PL-07).',
  '/api/auth/reset-password': 'Åpen glemt-passord-flyt (PL-07).',
  '/api/auth/test-login': 'Kun utvikling — svaret 404 (fail-closed) i produksjon.',
  '/api/auth/phone/send': 'Telefonsjekk er deaktivert — 404 i produksjon (PL-20).',
  '/api/auth/phone/verify': 'Telefonsjekk er deaktivert — 404 i produksjon (PL-20).',
  '/api/auth/vipps/authorize': 'Vipps-OAuth-flyt, åpen (PAYMENTS_ENABLED av til G-12).',
  '/api/auth/vipps/callback': 'Vipps-OAuth-flyt, åpen (PAYMENTS_ENABLED av til G-12).',
  // Vercel cron — CRON_SECRET sjekkes i selve ruten
  '/api/cron/health': 'Vercel cron — krever CRON_SECRET i ruten.',
  '/api/cron/journey': 'Vercel cron — krever CRON_SECRET i ruten.',
  '/api/cron/matching': 'Vercel cron — krever CRON_SECRET i ruten.',
  // Beskyttet i selve ruten
  '/api/analytics/track': 'Sesjon og pgCheck-rategrense i selve ruten (S-4).',
  '/api/beta/invites': 'requireAdmin() i selve ruten (sesjon eller signert admin_token).',
  // Kun utvikling
  '/api/dev-login': 'Kun utvikling — blokkeres av middleware med mindre DEV_LOGIN_ENABLED er satt.',
  '/api/dev-login/status': 'Kun utvikling — blokkeres av middleware med mindre DEV_LOGIN_ENABLED er satt.',
  '/api/dev-login/users': 'Kun utvikling — blokkeres av middleware med mindre DEV_LOGIN_ENABLED er satt.',
  '/api/dev/setup': 'Kun utvikling — svaret 404 (fail-closed) i produksjon.',
  // Åpent read-only-innhold (ingen brukerdata)
  '/api/questions': 'Åpent spørsmålsinnhold (read-only, ingen brukerdata).',
  '/api/questions/categories': 'Åpent spørsmålsinnhold (read-only, ingen brukerdata).',
  '/api/questions/[category]': 'Åpent spørsmålsinnhold (read-only, ingen brukerdata).',
}

describe('API-rutedekning mot middleware (PL-25 / V-11)', () => {
  const routes = findRoutePaths(API_ROOT)

  it('funner ruter (vakt mot at skanningen brytes)', () => {
    expect(routes.length).toBeGreaterThan(50)
  })

  it('hver rute er beskyttet av et prefiks, i PUBLIC_PATHS eller eksplisitt offentlig', () => {
    const uncovered = routes.filter(
      (r) =>
        !isCovered(r, PROTECTED_API_PREFIXES) &&
        !isCovered(r, PUBLIC_PATHS) &&
        !(r in OFFENTLIGE_RUTER),
    )
    expect(uncovered).toEqual([])
  })

  it('OFFENTLIGE_RUTER inneholder ingen utdaterte oppføringer', () => {
    const stale = Object.keys(OFFENTLIGE_RUTER).filter((p) => !routes.includes(p))
    expect(stale).toEqual([])
  })
})
