/**
 * B8 — «Forlater køen» (v8)
 *
 * Verifiserer at DELETE /api/journey/queue fjerner en QUEUED-bruker FRA KØEN
 * umiddelbart (journeyState → IDLE, matchQueuedAt → null), slik at matcherunden
 * (som leser kun journeyState = 'QUEUED') automatisk utelater brukeren ved
 * neste lørdag — hun skal ikke bli matchet.
 *
 * OBS (v8): Instruksens filankre pekte på app/api/journey/exit/route.ts.
 * Den ruten avslutter en AKTIV reise (krever aktiv match) og gir 404 for en
 * QUEUED-bruker uten match. Det faktiske «ut av køen»-mekanismen er
 * DELETE /api/journey/queue, som ALTID satte journeyState → IDLE +
 * matchQueuedAt → null — altså var oppførselen korrekt fra før. Denna testen
 * låser oppførselen. (Se rapporten.)
 *
 * Prisma- og auth-laget mockes (deterministisk, isolert).
 */

jest.mock('@/lib/auth/requireAuth', () => ({
  requireAuth: jest.fn(),
}));
jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth/requireAuth';
import prisma from '@/lib/prisma';
import { DELETE } from '@/app/api/journey/queue/route';

const mockedRequireAuth = requireAuth as jest.Mock;
const mockedPrisma = prisma as unknown as {
  user: { findUnique: jest.Mock; update: jest.Mock };
};

function deleteReq(): NextRequest {
  return new NextRequest('http://localhost/api/journey/queue', { method: 'DELETE' });
}

async function call(): Promise<{ status: number; body: any }> {
  const res = (await DELETE(deleteReq())) as Response;
  return { status: res.status, body: await res.json() };
}

describe('DELETE /api/journey/queue — forlater køen (B8)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (mockedRequireAuth as jest.Mock).mockResolvedValue({
      user: { id: 'u-leave', email: 'u@tosom.no', role: 'user' },
    });
  });

  it('QUEUED-bruker forlater køen: journeyState → IDLE, matchQueuedAt → null, 200', async () => {
    mockedPrisma.user.findUnique.mockResolvedValue({
      id: 'u-leave',
      journeyState: 'QUEUED',
      bannedAt: null,
      deletedAt: null,
    });
    mockedPrisma.user.update.mockResolvedValue({ id: 'u-leave' });

    const { status, body } = await call();

    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.journeyState).toBe('IDLE');
    // Den faktiske DB-oppskrivingen — dette er det som fjerner henne fra køen
    expect(mockedPrisma.user.update).toHaveBeenCalledWith({
      where: { id: 'u-leave' },
      data: {
        journeyState: 'IDLE',
        matchQueuedAt: null,
      },
    });
  });

  it('IDLE-bruker (allerede utenfor køen) → 409, ingen oppskrivning', async () => {
    mockedPrisma.user.findUnique.mockResolvedValue({
      id: 'u-leave',
      journeyState: 'IDLE',
      bannedAt: null,
      deletedAt: null,
    });

    const { status } = await call();

    expect(status).toBe(409);
    expect(mockedPrisma.user.update).not.toHaveBeenCalled();
  });

  it('MATCHED-bruker (reise pågår) kan ikke forlate køen → 409, ingen oppskrivning', async () => {
    mockedPrisma.user.findUnique.mockResolvedValue({
      id: 'u-leave',
      journeyState: 'MATCHED',
      bannedAt: null,
      deletedAt: null,
    });

    const { status } = await call();

    expect(status).toBe(409);
    expect(mockedPrisma.user.update).not.toHaveBeenCalled();
  });
});