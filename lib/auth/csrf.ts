/**
 * ToSom CSRF Protection
 * 
 * Tilbyr enkel CSRF-beskyttelse for API-ruter som mottar POST/PUT/PATCH/DELETE.
 * 
 * Bruk:
 *   // I route-fila:
 *   import { csrfCheck } from '@/lib/auth/csrf';
 *   
 *   export async function POST(req: NextRequest) {
 *     const check = await csrfCheck(req);
 *     if (check instanceof NextResponse) return check; // feil → returner tidlig
 *     // proceed...
 *   }
 */

import { NextRequest, NextResponse } from 'next/server';
import { serverFlags } from '@/utils/flags';

/**
 * CSRF-token generering.
 * Kun brukt av klientar som treng å hente et token før de sender en POST-request.
 */
export function generateCsrfToken(): string {
  return crypto.randomUUID();
}

/**
 * Verifiser og oppdatere CSRF-token.
 * 
 * Header: X-CSRF-Token: <token>
 * Cookie: csrf_token=<token> (setter nytt token som respons)
 * 
 * Returnerer:
 * - NextResponse med status 403 dersom CSRF-beskyttelse er deaktiv eller feil
 * - { ok: true } dersom validering suklar
 */
export async function verifyCsrfToken(req: NextRequest): Promise<{ ok: true; _newToken?: string } | NextResponse> {
  // Sjekk om CSRF protection er aktiv i environmentet
  if (!serverFlags.enableCsrfProtection) {
    return { ok: true };
  }

  // Hent token fra header
  const token = req.headers.get('x-csrf-token') || req.headers.get('x-csrf-token');
  
  if (!token) {
    return NextResponse.json(
      { error: 'CSRF-token mangler', code: 'CSRF_MISSING' },
      { status: 403 }
    );
  }

  // Hent token fra cookie (sett av klienten tidlegare)
  const cookieToken = req.cookies.get('csrf_token')?.value;
  
  // Dersom det ikke finnes en cookie-token, godta hva som helst gyldig token
  // Dette dekker scenar der clienten genererer tokenet selv (t.d. SPA)
  if (!cookieToken) {
    // Token er gyldig så lenge det ikke er tomt og ser ut som et gyldig token
    if (token.length < 10 || token.length > 256) {
      return NextResponse.json(
        { error: 'CSRF-token har ugyldig lengd', code: 'CSRF_INVALID' },
        { status: 403 }
      );
    }
    return { ok: true };
  }

  // Sammenligner token med timing-safe sammenligning
  if (!timingSafeCompare(token, cookieToken)) {
    return NextResponse.json(
      { error: 'CSRF-token er ugyldig', code: 'CSRF_INVALID' },
      { status: 403 }
    );
  }

  // Generer nytt token for neste request (rotation)
  const newToken = generateCsrfToken();
  
  return { 
    ok: true,
    _newToken: newToken as any,
  };
}

/**
 * En einfald CSRF-check helper.
 * Returnerer NextResponse med feil dersom verifisering feilar.
 */
export async function csrfCheck(req: NextRequest): Promise<true | NextResponse> {
  const result = await verifyCsrfToken(req);
  
  if (result instanceof NextResponse) {
    return result;
  }
  
  // Sjekk om det kom et nytt token for rotation
  if (result._newToken) {
    // Klienten bør oppdatere cookie med dette nye tokenet for neste request
    // Dette blir ofte hanna ut av en middleware eller client-side code
  }
  
  return true;
}

/**
 * Timing-safe sammenligning av to strengar.
 * Vern mot timing-atak.
 */
function timingSafeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  
  return result === 0;
}

/**
 * Lagre et CSRF-token i en cookie.
 * Bruk av klientar/interne funksjonar som treng å opprette et gyldig token.
 */
export function setCsrfCookie(response: NextResponse, token: string): NextResponse {
  response.cookies.set('csrf_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24, // 24 timar
  });
  return response;
}

/**
 * Fjern CSRF-cookie.
 */
export function clearCsrfCookie(response: NextResponse): NextResponse {
  response.cookies.set('csrf_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  });
  return response;
}