/**
 * ToSom — Admin: Kjønn og ventekø (test for aggregasjonslogikken)
 *
 * Prisma og requireAdmin mockes. Vi kjører den faktiske rute-logikken og
 * verifiserer at kjønn normaliseres, «ukjent»-bucket fanges, og at
 * ventekø-filter og aldri-matcha-filter fungerer.
 */

import { NextRequest, NextResponse } from 'next/server';

jest.mock('@/lib/prisma', () => ({
  prisma: { user: { findMany: jest.fn() } },
}));
jest.mock('@/lib/auth/requireAuth', () => ({
  requireAdmin: jest.fn(),
}));

import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth/requireAuth';
import { GET } from '@/app/api/admin/gender-queue/route';

const findMany = prisma.user.findMany as jest.Mock;
const requireAdminMock = requireAdmin as jest.Mock;

interface Fixture {
  createdAt: string;
  journeyState: string;
  lastMatchAt: string | null;
  lifeSituation: unknown; // null → ingen profil; {} → ingen kjønn
}

function row(f: Fixture) {
  return {
    id: 'u',
    createdAt: new Date(f.createdAt),
    journeyState: f.journeyState,
    lastMatchAt: f.lastMatchAt ? new Date(f.lastMatchAt) : null,
    profile: f.lifeSituation ? { lifeSituation: f.lifeSituation } : null,
  };
}

function req() {
  return new NextRequest('http://localhost/api/admin/gender-queue');
}

describe('GET /api/admin/gender-queue', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    requireAdminMock.mockResolvedValue({ user: { id: 'a', email: 'a@x', role: 'ADMIN' } });
  });

  it('returnerer 403 uten admin-tilgang', async () => {
    requireAdminMock.mockResolvedValueOnce(
      NextResponse.json({ error: 'Uautorisert' }, { status: 403 })
    );
    const res = await GET(req());
    expect(res.status).toBe(403);
  });

  it('teller kjønn totalt, ventekø og aldri-matcha', async () => {
    findMany.mockResolvedValue([
      row({ createdAt: '2026-09-01T00:00:00Z', journeyState: 'QUEUED', lastMatchAt: null, lifeSituation: { gender: 'man' } }),
      row({ createdAt: '2026-09-02T00:00:00Z', journeyState: 'QUEUED', lastMatchAt: '2026-08-01T00:00:00Z', lifeSituation: { gender: 'kvinne' } }),
      row({ createdAt: '2026-09-03T00:00:00Z', journeyState: 'ON_JOURNEY', lastMatchAt: '2026-08-01T00:00:00Z', lifeSituation: { gender: 'kvinne' } }),
      row({ createdAt: '2026-09-04T00:00:00Z', journeyState: 'IDLE', lastMatchAt: null, lifeSituation: null }),
    ]);

    const res = await GET(req());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.registered).toMatchObject({ man: 1, kvinne: 2, annen: 0, ukjent: 1, total: 4 });
    expect(body.queueNow).toMatchObject({ man: 1, kvinne: 1, total: 2 });
    // «sitter i ventekø uten match» = QUEUED og lastMatchAt = null → kun linje 1
    expect(body.queueNeverMatched).toMatchObject({ man: 1, kvinne: 0, total: 1 });
    expect(body.journeyStates).toMatchObject({ IDLE: 1, QUEUED: 2, ON_JOURNEY: 1 });
    expect(body.weekly).toHaveLength(12);
  });

  it('bucket-er manglende kjønn og manglende profil til «ukjent»', async () => {
    findMany.mockResolvedValue([
      row({ createdAt: '2026-09-01T00:00:00Z', journeyState: 'IDLE', lastMatchAt: null, lifeSituation: { gender: 'man' } }),
      row({ createdAt: '2026-09-01T00:00:00Z', journeyState: 'IDLE', lastMatchAt: null, lifeSituation: {} }),
      row({ createdAt: '2026-09-01T00:00:00Z', journeyState: 'IDLE', lastMatchAt: null, lifeSituation: null }),
    ]);

    const res = await GET(req());
    const body = await res.json();
    expect(body.registered).toMatchObject({ man: 1, ukjent: 2, total: 3 });
  });
});
