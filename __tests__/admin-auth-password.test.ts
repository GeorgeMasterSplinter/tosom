/**
 * B-5 — Admin-passord som hash (scrypt, timing-safe) + admin/auth-ruten.
 *
 * Dekker lib/admin-hash.ts (hash/verify/safeCompare/load) og at /api/admin/auth
 * faktisk bruker hasha (ikke klartext): rett passord → 200+cookie, feil → 401,
 * hash mangler → 500 (feiler lukka). Ingen DB/server/login nødvendig.
 *
 * (Dekkes separat: __tests__/admin-authorization.test.ts sjekker requireAuth/
 * isAdminRole for /admin-panelet — autentisering vs. autorisasjon.)
 */

import { NextRequest } from 'next/server';

jest.mock('@/lib/auth/admin-jwt', () => ({
  signAdminToken: jest.fn(async () => 'admin-token'),
}));
jest.mock('@/lib/security/bruteforce', () => ({
  recordFailedLogin: jest.fn(async () => ({ blocked: false, attempts: 1 })),
  clearFailedLogin: jest.fn(),
}));

import { POST } from '@/app/api/admin/auth/route';
import {
  hashAdminPassword,
  verifyAdminPassword,
  safeCompare,
  loadAdminPasswordHash,
} from '@/lib/admin-hash';

function authReq(body: unknown): NextRequest {
  return new NextRequest('http://localhost/api/admin/auth', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'content-type': 'application/json' },
  });
}

describe('B-5: lib/admin-hash — scrypt-hash, timing-safe, feiler lukka', () => {
  it('hashAdminPassword produserer salt:hash (16-byte salt, 32-byte nøkkel)', () => {
    const h = hashAdminPassword('noe');
    const [salt, hash] = h.split(':');
    expect(salt).toHaveLength(32);
    expect(hash).toHaveLength(64);
  });

  it('rett passord verifiserer mot hasjen', () => {
    const h = hashAdminPassword('KorrektPass123!');
    expect(verifyAdminPassword('KorrektPass123!', h)).toBe(true);
  });

  it('feil passord avvises', () => {
    const h = hashAdminPassword('KorrektPass123!');
    expect(verifyAdminPassword('FeilPassord999', h)).toBe(false);
  });

  it('mangler hash (null) → false (feiler lukka)', () => {
    expect(verifyAdminPassword('noe', null)).toBe(false);
  });

  it('galt hash-format → false (feiler lukka)', () => {
    expect(verifyAdminPassword('noe', 'ikkje-validt')).toBe(false);
    expect(verifyAdminPassword('noe', ':')).toBe(false);
    expect(verifyAdminPassword('noe', ':deadbeef')).toBe(false);
    expect(verifyAdminPassword('noe', 'aa:for-kort-hash')).toBe(false);
  });

  it('loadAdminPasswordHash leser ADMIN_PASSWORD_HASH fra env', () => {
    const prev = process.env.ADMIN_PASSWORD_HASH;
    try {
      delete process.env.ADMIN_PASSWORD_HASH;
      expect(loadAdminPasswordHash()).toBeNull();
      process.env.ADMIN_PASSWORD_HASH = '   ';
      expect(loadAdminPasswordHash()).toBeNull();
      process.env.ADMIN_PASSWORD_HASH = 'aa:bb';
      expect(loadAdminPasswordHash()).toBe('aa:bb');
    } finally {
      if (prev === undefined) delete process.env.ADMIN_PASSWORD_HASH;
      else process.env.ADMIN_PASSWORD_HASH = prev;
    }
  });

  it('safeCompare: true ved like, false ved ulik verdi eller ulik lengde', () => {
    expect(safeCompare('admin@tosom.no', 'admin@tosom.no')).toBe(true);
    expect(safeCompare('admin@tosom.no', 'admin@tosom.nn')).toBe(false);
    expect(safeCompare('kort', 'mykelengrestringher')).toBe(false);
    expect(safeCompare('', 'x')).toBe(false);
  });
});

describe('B-5: /api/admin/auth bruker hasha (ikke klartext)', () => {
  const EMAIL = 'admin@tosom.no';
  const PASS = 'AdminPass-2026!';

  beforeEach(() => {
    process.env.ADMIN_EMAIL = EMAIL;
    process.env.ADMIN_PASSWORD_HASH = hashAdminPassword(PASS);
    delete process.env.ADMIN_PASSWORD; // sikrer at ikke gammel klartext brukes
  });
  afterEach(() => {
    delete process.env.ADMIN_EMAIL;
    delete process.env.ADMIN_PASSWORD_HASH;
  });

  it('rett epost + passord (mot hash) → 200 og admin_token-sett', async () => {
    const res = await POST(authReq({ email: EMAIL, password: PASS }));
    expect(res.status).toBe(200);
    expect(res.cookies.get('admin_token')).toBeDefined();
  });

  it('feil passord → 401', async () => {
    const res = await POST(authReq({ email: EMAIL, password: 'feil' }));
    expect(res.status).toBe(401);
  });

  it('feil epost → 401', async () => {
    const res = await POST(authReq({ email: 'noen@annet.no', password: PASS }));
    expect(res.status).toBe(401);
  });

  it('ADMIN_PASSWORD_HASH ikke satt → 500 (feiler lukka)', async () => {
    delete process.env.ADMIN_PASSWORD_HASH;
    const res = await POST(authReq({ email: EMAIL, password: PASS }));
    expect(res.status).toBe(500);
  });
});