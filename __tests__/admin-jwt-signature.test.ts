/**
 * Funn 1 (systemaudit 03.09) — Admin-token: signaturverifisering.
 *
 * Verifiserer at /api/admin/session og /api/admin/analytics AVVISER et
 * usignert/forgedd admin_token og godkjenner et korrekt signert token.
 * Lukker test-blindsonen «ingen test på at usignert admin-token avvises».
 *
 * Kaller den virkelige kryptografien (crypto.subtle, HMAC-SHA256) — ingen mock
 * av admin-jwt, slik at signaturen faktisk verifiseres.
 */

import { NextRequest } from 'next/server';

// errorTracker og prisma er side-moduler vi ikke tester her — mock unna for å
// unngå Sentry-init og DB-tilkobling ved import.
jest.mock('@/lib/errorTracker', () => ({ trackError: jest.fn(async () => {}) }));
jest.mock('@/lib/prisma', () => ({ __esModule: true, default: {} }));

import {
  signAdminToken,
  verifyAdminTokenAsync,
  verifyAdminCookie,
} from '@/lib/auth/admin-jwt';
import { GET as sessionGET } from '@/app/api/admin/session/route';
import { GET as analyticsGET } from '@/app/api/admin/analytics/route';

const SECRET = 'test-admin-jwt-secret-ikke-prod';

function b64url(s: string): string {
  return Buffer.from(s)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

/** Forgedd token: korrekt iss/role/exp, men signatur er ikke HMAC med SECRET. */
function forgedToken(): string {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = b64url(
    JSON.stringify({ sub: 'admin@tosom.no', role: 'ADMIN', iss: 'tosom-admin', iat: now, exp: now + 3600 })
  );
  return `${header}.${payload}.forged-signature`;
}

function reqWithToken(path: string, token?: string): NextRequest {
  const req = new NextRequest(`http://localhost${path}`, { method: 'GET' });
  if (token) req.cookies.set('admin_token', token);
  return req;
}

describe('Funn 1: verifyAdminTokenAsync — HMAC-SHA256 signatur', () => {
  beforeEach(() => {
    process.env.ADMIN_JWT_SECRET = SECRET;
  });
  afterEach(() => {
    delete process.env.ADMIN_JWT_SECRET;
  });

  it('korrekt signert token verifiseres', async () => {
    const token = await signAdminToken('admin@tosom.no');
    const payload = await verifyAdminTokenAsync(token);
    expect(payload).not.toBeNull();
    expect(payload!.role).toBe('ADMIN');
    expect(payload!.sub).toBe('admin@tosom.no');
  });

  it('forgedd token (riktig iss/role/exp, feil signatur) avvises', async () => {
    expect(await verifyAdminTokenAsync(forgedToken())).toBeNull();
  });

  it('signert token med endret signatur avvises', async () => {
    const token = await signAdminToken('admin@tosom.no');
    const [h, p, s] = token.split('.');
    const flipped = (s[0] === 'A' ? 'B' : 'A') + s.slice(1);
    expect(await verifyAdminTokenAsync(`${h}.${p}.${flipped}`)).toBeNull();
  });

  it('tomt eller formatert-ugyldig token avvises', async () => {
    expect(await verifyAdminTokenAsync('')).toBeNull();
    expect(await verifyAdminTokenAsync('ikk-en-jwt')).toBeNull();
  });

  it('pre-check (verifyAdminCookie) godkjenner forgedd token — derfor verifiserer rutene signatur', () => {
    // Pre-checken sjekker bare iss/role/exp, IKKE signatur. Det var hullet:
    // rutene som brukte den som eneste vern godkjente forgedd tokens.
    expect(verifyAdminCookie(reqWithToken('/api/admin/session', forgedToken()))).not.toBeNull();
  });
});

describe('Funn 1: admin-ruter avviser usignert token', () => {
  beforeEach(() => {
    process.env.ADMIN_JWT_SECRET = SECRET;
  });
  afterEach(() => {
    delete process.env.ADMIN_JWT_SECRET;
  });

  it('/api/admin/session → authenticated=false med forgedd token', async () => {
    const res = await sessionGET(reqWithToken('/api/admin/session', forgedToken()));
    expect(res.status).toBe(200);
    expect((await res.json()).authenticated).toBe(false);
  });

  it('/api/admin/session → authenticated=true med signert token', async () => {
    const token = await signAdminToken('admin@tosom.no');
    const res = await sessionGET(reqWithToken('/api/admin/session', token));
    expect(res.status).toBe(200);
    expect((await res.json()).authenticated).toBe(true);
  });

  it('/api/admin/session → authenticated=false uten token', async () => {
    const res = await sessionGET(reqWithToken('/api/admin/session'));
    expect(res.status).toBe(200);
    expect((await res.json()).authenticated).toBe(false);
  });

  it('/api/admin/analytics → 403 med forgedd token', async () => {
    const res = await analyticsGET(reqWithToken('/api/admin/analytics', forgedToken()));
    expect(res.status).toBe(403);
  });

  it('/api/admin/analytics → 403 uten token', async () => {
    const res = await analyticsGET(reqWithToken('/api/admin/analytics'));
    expect(res.status).toBe(403);
  });
});