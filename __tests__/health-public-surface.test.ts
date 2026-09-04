/**
 * Funn 4 (systemaudit 03.09) — Helse-endepunktets OFFENTLIGE overflate.
 *
 * /api/system/health er et OFFENTLIG endepunkt. Verifiserer at et publikum-svar
 * IKKE lekker systemdetaljer: Node/Next-versjon, RAM, CPU, NEXTAUTH_URL
 * (auth.url), secretLength, NODE_ENV og port. Kun en verifisert admin får
 * full detalj.
 *
 * Mock-er prisma (DB-ping) og auth (ingen session) så testen er deterministisk
 * og ikke treffer en ekte DB eller NextAuth-kontekst.
 */
import { NextRequest } from 'next/server';

jest.mock('@/lib/prisma', () => {
  const mockPrisma = {
    $queryRaw: jest.fn(async () => [{}]), // DB "connected"
    systemLog: { findFirst: jest.fn(async () => null) },
  };
  return { __esModule: true, prisma: mockPrisma, default: mockPrisma };
});
jest.mock('@/lib/auth/config', () => ({
  auth: jest.fn(async () => null), // ingen session i test
}));

import { GET } from '@/app/api/system/health/route';
import { signAdminToken } from '@/lib/auth/admin-jwt';

function reqWith(token?: string): NextRequest {
  const req = new NextRequest('http://localhost/api/system/health', { method: 'GET' });
  if (token) req.cookies.set('admin_token', token);
  return req;
}

describe('Funn 4: /api/system/health offentlig overflate', () => {
  afterEach(() => {
    delete process.env.ADMIN_JWT_SECRET;
  });

  it('publikum: kun status + timestamp, ingen systemdetaljer', async () => {
    const res = await GET(reqWith());
    expect(res.status).toBe(200);
    const body: Record<string, unknown> = await res.json();
    expect(body.status).toBeDefined();
    expect(body.timestamp).toBeDefined();
    // Ingen av feltene auditen flagget
    expect(body).not.toHaveProperty('version');
    expect(body).not.toHaveProperty('system');
    expect(body).not.toHaveProperty('services');
    expect(body).not.toHaveProperty('auth');
    expect(body).not.toHaveProperty('app');
    const s = JSON.stringify(body);
    expect(s).not.toContain('nodeVersion');
    expect(s).not.toContain('nextVersion');
    expect(s).not.toContain('secretLength');
  });

  it('admin (signert token): får full detalj', async () => {
    process.env.ADMIN_JWT_SECRET = 'test-admin-jwt-secret-ikke-prod';
    const token = await signAdminToken('admin@tosom.no');
    const res = await GET(reqWith(token));
    expect(res.status).toBe(200);
    const body: any = await res.json();
    expect(body.system).toBeDefined();
    expect(body.system).toHaveProperty('nodeVersion');
    expect(body.services).toBeDefined();
    expect(body.auth).toBeDefined();
    expect(body.app).toBeDefined();
  });
});