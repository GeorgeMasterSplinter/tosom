/**
 * ToSom — Presence v2 (DB-basert) — kontrakstestar
 *
 * Presence byrja i User-tabellen (lastSeenAt/typingUntil) etter at
 * in-memory-versjonen viste seg verdelaus på Vercel (isolert, kortlevd
 * funksjonsminne). Testane kjører DET FAKTISKE rutehåndteraren og
 * presenceState-motoren med Prisma mocka.
 *
 * Kontrakt:
 *   - «Online»  = lastSeenAt innanfor ONLINE_WINDOW_MS (hjartetikk kvar ~30 s)
 *   - «Skriver» = typingUntil i framtid
 *   - PATCH /api/presence/update: isOnline:true = hjartetikk,
 *     isTyping:true/false = sett/rydd skrive-flagget, 401 utan sesjon,
 *     400 ved ugyldig body. isOnline:false = no-op.
 *   - GET /api/presence/get/[id]: les status, ukjend brukar = offline-default.
 */

jest.mock('@/lib/auth/session', () => ({
  getServerSession: jest.fn(),
}));
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: { update: jest.fn(), findUnique: jest.fn() },
  },
}));

import { getServerSession } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';
import {
  getPresence,
  setOnline,
  setTyping,
  clearTyping,
  ONLINE_WINDOW_MS,
  TYPING_TTL_MS,
} from '@/lib/presence/presenceState';
import { PATCH } from '@/app/api/presence/update/route';
import { GET } from '@/app/api/presence/get/[id]/route';

const mockedSession = getServerSession as jest.Mock;
const mockedPrisma = prisma as unknown as {
  user: { update: jest.Mock; findUnique: jest.Mock };
};

function updateRequest(body: Record<string, unknown>): NextRequest {
  return new NextRequest('http://localhost/api/presence/update', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

function mockLogged(userId = 'pres_user_1') {
  mockedSession.mockResolvedValue({ user: { id: userId } });
}

describe('Presence v2 — presenceState (DB-motor)', () => {
  beforeEach(() => jest.clearAllMocks());

  it('lastSeenAt innanfor vindauget → isOnline', async () => {
    mockedPrisma.user.findUnique.mockResolvedValue({
      lastSeenAt: new Date(Date.now() - 10_000),
      typingUntil: null,
    });
    const p = await getPresence('u1');
    expect(p?.isOnline).toBe(true);
    expect(p?.isTyping).toBe(false);
    expect(typeof p?.lastSeen).toBe('number');
  });

  it('lastSeenAt eldre enn vindauget → offline', async () => {
    mockedPrisma.user.findUnique.mockResolvedValue({
      lastSeenAt: new Date(Date.now() - (ONLINE_WINDOW_MS + 5000)),
      typingUntil: null,
    });
    expect((await getPresence('u1'))?.isOnline).toBe(false);
  });

  it('typingUntil i framtid → isTyping (sjølv utan friskt hjartetikk)', async () => {
    mockedPrisma.user.findUnique.mockResolvedValue({
      lastSeenAt: null,
      typingUntil: new Date(Date.now() + 2000),
    });
    const p = await getPresence('u1');
    expect(p?.isTyping).toBe(true);
    expect(p?.isOnline).toBe(false);
  });

  it('typingUntil utgått → ikkje skrive', async () => {
    mockedPrisma.user.findUnique.mockResolvedValue({
      lastSeenAt: new Date(Date.now() - 1000),
      typingUntil: new Date(Date.now() - 1000),
    });
    expect((await getPresence('u1'))?.isTyping).toBe(false);
  });

  it('ukjend brukar → undefined', async () => {
    mockedPrisma.user.findUnique.mockResolvedValue(null);
    expect(await getPresence('ikkje_der')).toBeUndefined();
  });

  it('setOnline skriv berre lastSeenAt (hjartetikk)', async () => {
    mockedPrisma.user.update.mockResolvedValue({});
    await setOnline('u1');
    const arg = mockedPrisma.user.update.mock.calls[0][0];
    expect(arg.where).toEqual({ id: 'u1' });
    expect(arg.data.lastSeenAt).toBeInstanceOf(Date);
    expect(arg.data.typingUntil).toBeUndefined();
  });

  it('setTyping set typingUntil i framtid + oppdaterer hjartetikk', async () => {
    mockedPrisma.user.update.mockResolvedValue({});
    await setTyping('u1');
    const data = mockedPrisma.user.update.mock.calls[0][0].data;
    expect(data.typingUntil.getTime()).toBeGreaterThan(Date.now());
    expect(data.typingUntil.getTime()).toBeLessThanOrEqual(Date.now() + TYPING_TTL_MS + 50);
    expect(data.lastSeenAt).toBeInstanceOf(Date);
  });

  it('clearTyping set typingUntil til null', async () => {
    mockedPrisma.user.update.mockResolvedValue({});
    await clearTyping('u1');
    expect(mockedPrisma.user.update.mock.calls[0][0].data).toEqual({ typingUntil: null });
  });
});

describe('PATCH /api/presence/update (v2)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedPrisma.user.update.mockResolvedValue({});
    mockedPrisma.user.findUnique.mockResolvedValue({ lastSeenAt: null, typingUntil: null });
  });

  it('ikkje autentisert → 401', async () => {
    mockedSession.mockResolvedValue(null);
    const res = await PATCH(updateRequest({ isOnline: true }));
    expect(res.status).toBe(401);
    expect(mockedPrisma.user.update).not.toHaveBeenCalled();
  });

  it('ugyldig body → 400', async () => {
    mockLogged();
    const res = await PATCH(updateRequest({ isTyping: 'ja' }));
    expect(res.status).toBe(400);
  });

  it('hjelartetikk (isOnline: true) → éin lastSeenAt-skriving, ikkje typing', async () => {
    mockLogged();
    const res = await PATCH(updateRequest({ isOnline: true }));
    expect(res.status).toBe(200);
    expect(mockedPrisma.user.update).toHaveBeenCalledTimes(1);
    const data = mockedPrisma.user.update.mock.calls[0][0].data;
    expect(data.lastSeenAt).toBeInstanceOf(Date);
    expect(data.typingUntil).toBeUndefined();
  });

  it('isOnline: false → no-op (inga DB-skriving)', async () => {
    mockLogged();
    const res = await PATCH(updateRequest({ isOnline: false }));
    expect(res.status).toBe(200);
    expect(mockedPrisma.user.update).not.toHaveBeenCalled();
  });

  it('isTyping: true → typingUntil i framtid', async () => {
    mockLogged();
    const res = await PATCH(updateRequest({ isTyping: true }));
    expect(res.status).toBe(200);
    const data = mockedPrisma.user.update.mock.calls[0][0].data;
    expect(data.typingUntil.getTime()).toBeGreaterThan(Date.now());
  });

  it('isTyping: false → typingUntil null', async () => {
    mockLogged();
    const res = await PATCH(updateRequest({ isTyping: false }));
    expect(res.status).toBe(200);
    expect(mockedPrisma.user.update.mock.calls[0][0].data).toEqual({ typingUntil: null });
  });
});

describe('GET /api/presence/get/[id] (v2)', () => {
  beforeEach(() => jest.clearAllMocks());

  function getRequest(id: string) {
    return GET(
      new NextRequest(`http://localhost/api/presence/get/${id}`),
      { params: Promise.resolve({ id }) }
    );
  }

  it('ikkje autentisert → 401', async () => {
    mockedSession.mockResolvedValue(null);
    const res = await getRequest('u2');
    expect(res.status).toBe(401);
  });

  it('les online + skrive-status frå DB', async () => {
    mockLogged();
    mockedPrisma.user.findUnique.mockResolvedValue({
      lastSeenAt: new Date(Date.now() - 5000),
      typingUntil: new Date(Date.now() + 3000),
    });
    const res = await getRequest('u2');
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.userId).toBe('u2');
    expect(body.isOnline).toBe(true);
    expect(body.isTyping).toBe(true);
  });

  it('ukjend brukar → offline-default (ikkje feil)', async () => {
    mockLogged();
    mockedPrisma.user.findUnique.mockResolvedValue(null);
    const res = await getRequest('ukjend');
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.isOnline).toBe(false);
    expect(body.isTyping).toBe(false);
  });
});