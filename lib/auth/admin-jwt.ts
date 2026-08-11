/**
 * ToSom — Admin JWT (Edge-runtime kompatibel)
 *
 * Bruker Web Crypto API i stedet for Node.js crypto
 * fordi Next.js middleware kjører i Edge runtime.
 */

import type { NextRequest } from 'next/server';

const ADMIN_JWT_SECRET: string = process.env.ADMIN_JWT_SECRET || process.env.NEXTAUTH_SECRET || '';
if (!ADMIN_JWT_SECRET) {
  throw new Error('[TOSOM] Manglende miljøvariabel: ADMIN_JWT_SECRET (eller NEXTAUTH_SECRET som fallback). Set dette i .env!');
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
  const signatureB64 = base64urlEncode(Buffer.from(signature).toString('binary'));

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

    const signatureBuffer = Buffer.from(base64urlEncode(base64urlDecode(signatureB64)), 'base64');
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