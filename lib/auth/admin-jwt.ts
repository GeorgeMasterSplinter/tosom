/**
 * ToSom — Admin JWT (Edge-runtime kompatibel)
 *
 * Bruker Web Crypto API i stedet for Node.js crypto
 * fordi Next.js middleware kjører i Edge runtime.
 *
 * STEG 2.4: ADMIN_JWT_SECRET leses lazy ved bruk, ikke ved import.
 */

import type { NextRequest } from 'next/server';

// STEG 2.4: Lazy lesing av ADMIN_JWT_SECRET — ikke kast ved import, kun ved faktisk bruk.
function getAdminJwtSecret(): string {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) {
    throw new Error(
      '[TOSOM] Manglende kritisk miljøvariabel: ADMIN_JWT_SECRET. ' +
      'Set dette i .env! Ingen fallback er tillatt (sikkerheitskritisk).'
    );
  }
  return secret;
}

const ADMIN_JWT_EXPIRY = process.env.ADMIN_JWT_EXPIRY || '8h';

interface AdminTokenPayload {
  sub: string; // email
  role: 'ADMIN';
  exp?: number;
  iat?: number;
  iss?: string;
}

function parseExpiryToSeconds(str: string): number {
  const match = str.match(/^(\d+)(s|m|h|d)?$/);
  if (!match) return 8 * 3600;
  const [, num, unit] = match;
  const n = parseInt(num, 10);
  switch (unit) {
    case 'd': return n * 24 * 3600;
    case 'h': return n * 3600;
    case 'm': return n * 60;
    case 's':
    default: return n;
  }
}

function base64urlDecode(str: string): string {
  let standard = str.replace(/-/g, '+').replace(/_/g, '/');
  while (standard.length % 4 !== 0) standard += '=';
  return Buffer.from(standard, 'base64').toString();
}

function base64urlEncode(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

export async function signAdminToken(email: string): Promise<string> {
  const ADMIN_JWT_SECRET = getAdminJwtSecret(); // STEG 2.4: lazy
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload: AdminTokenPayload = {
    sub: email,
    role: 'ADMIN',
    iss: 'tosom-admin',
    iat: now,
    exp: now + parseExpiryToSeconds(ADMIN_JWT_EXPIRY),
  };

  const headerB64 = base64urlEncode(JSON.stringify(header));
  const payloadB64 = base64urlEncode(JSON.stringify(payload));
  const input = `${headerB64}.${payloadB64}`;

  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(ADMIN_JWT_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', keyMaterial, encoder.encode(input));
  // FIX: base64url-encod RÅ signaturbytes direkte. Tidlegare gikk bytesa via
  // latin1-streng → utf8-encoding i base64urlEncode korrupte bytes > 127, og
  // signaturen ble umogleg å verifisere (admin-API kall feila alltid 401).
  const signatureB64 = Buffer.from(signature)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  return `${input}.${signatureB64}`;
}

/**
 * verifyAdminCookie — RASK pre-check for Edge-middleware.
 *
 * Dekoder payload og sjekker issuer/role/exp for å filtrere tydelig ugyldige tokens.
 * ⚠️ SIGNATUR ER IKKE VERIFISERT HER (Edge-middleware er sync, kan ikke bruke crypto.subtle).
 * Kaller route MUST kalles verifyAdminTokenAsync() for signaturverifisering!
 *
 * Returnerer null hvis token er tydelig ugyldig.
 * Returnerer payload hvis token SEEMED gyldig (krever fortsatt async verifisering i route).
 */
export function verifyAdminCookie(req: NextRequest): AdminTokenPayload | null {
  const token = req?.cookies?.get('admin_token')?.value;
  if (!token) return null;

  // Reject obvious fake tokens (must be JWT format with 3 parts)
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [headerB64, payloadB64] = parts;

    // Verify header claims HS256
    const headerStr = base64urlDecode(headerB64);
    const header = JSON.parse(headerStr) as { alg: string };
    if (header.alg !== 'HS256') return null;

    const payloadStr = base64urlDecode(payloadB64);
    const payload = JSON.parse(payloadStr) as AdminTokenPayload;

    if (payload.iss !== 'tosom-admin') return null;
    if (payload.role !== 'ADMIN') return null;
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;

    return payload;
  } catch {
    return null;
  }
}

/**
 * verifyAdminTokenFromRequest — Ekstraher token fra Request og kall async verifisering.
 * Hjelperfunksjon for API-ruter som har async-kontekst.
 */
export async function verifyAdminTokenFromRequest(req: NextRequest): Promise<AdminTokenPayload | null> {
  const token = req?.cookies?.get('admin_token')?.value;
  if (!token) return null;
  return verifyAdminTokenAsync(token);
}

export async function verifyAdminTokenAsync(token: string): Promise<AdminTokenPayload | null> {
  if (!token) return null;

  try {
    const ADMIN_JWT_SECRET = getAdminJwtSecret(); // STEG 2.4: lazy

    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [headerB64, payloadB64, signatureB64] = parts;
    const input = `${headerB64}.${payloadB64}`;

    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(ADMIN_JWT_SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    // FIX: dekod base64url-strengen rett til rå bytes (symmetrisk med signing).
    const signatureBuffer = Buffer.from(
      signatureB64.replace(/-/g, '+').replace(/_/g, '/'),
      'base64',
    );
    const isValid = await crypto.subtle.verify(
      'HMAC',
      keyMaterial,
      signatureBuffer,
      encoder.encode(input)
    );

    if (!isValid) return null;

    const payloadStr = base64urlDecode(payloadB64);
    const payload = JSON.parse(payloadStr) as AdminTokenPayload;

    if (payload.iss !== 'tosom-admin' || payload.role !== 'ADMIN') return null;
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;

    return payload;
  } catch {
    return null;
  }
}