/**
 * B-4 — Rate limiting på skrivende ruter (mønster fra A5).
 *
 * Verifiserer at de 5 skrivende rutene svarer 429 når pgCheck tilsier at
 * taket er nått, og at de ringer pgCheck med korrekt nøkkel (per bruker,
 * ikke IP), tak og vindu. pgCheck og auth er mocket — testen er deterministisk
 * og kjører i standard-suiten uten DB.
 *
 * (pgCheck er atomisk og fail-open; selve teller-logikken er dekket av
 * __tests__/rate-limit-pg.test.ts. Denne testen låser selve koblingen i rutene.)
 */

import { NextRequest } from 'next/server';

jest.mock('@/lib/rate-limit-pg', () => ({
  pgCheck: jest.fn(),
}));
jest.mock('@/lib/auth/requireAuth', () => ({
  requireAuth: jest.fn(),
}));
jest.mock('@/lib/auth/session', () => ({
  getServerSession: jest.fn(),
}));
// Prisma importeres både som default (journey/queue, onboarding/save) og som
// navngiven eksport (onboarding/draft, profile/setup, chat/image) — begge leveres.
jest.mock('@/lib/prisma', () => {
  const prisma = {
    user: { findUnique: jest.fn(), update: jest.fn() },
    profile: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
    conversation: { findUnique: jest.fn(), findFirst: jest.fn() },
    message: { findUnique: jest.fn(), update: jest.fn() },
    order: { findFirst: jest.fn() },
    $transaction: jest.fn(),
    $queryRaw: jest.fn(),
  };
  return { __esModule: true, default: prisma, prisma };
});
jest.mock('@/lib/validation/onboarding-setup', () => ({
  validateOnboarding: jest.fn(),
}));
// Bare getImageStorage mockes; reelle buildImageKey/assertSafeImageKey beholdes.
jest.mock('@/lib/storage', () => {
  const actual = jest.requireActual('@/lib/storage');
  return { ...actual, getImageStorage: jest.fn() };
});

import { pgCheck } from '@/lib/rate-limit-pg';
import { requireAuth } from '@/lib/auth/requireAuth';
import { getServerSession } from '@/lib/auth/session';
import { validateOnboarding } from '@/lib/validation/onboarding-setup';
import { POST as queuePost } from '@/app/api/journey/queue/route';
import { POST as savePost } from '@/app/api/onboarding/save/route';
import { POST as draftPost } from '@/app/api/onboarding/draft/route';
import { POST as setupPost } from '@/app/api/profile/setup/route';
import { POST as imagePost } from '@/app/api/chat/image/route';

const mockedPgCheck = pgCheck as jest.Mock;
const mockedRequireAuth = requireAuth as jest.Mock;
const mockedSession = getServerSession as jest.Mock;
const mockedValidate = validateOnboarding as jest.Mock;

function jsonReq(method: string, path: string, body?: unknown): NextRequest {
  return new NextRequest(`http://localhost${path}`, {
    method,
    body: body === undefined ? undefined : JSON.stringify(body),
    headers: body === undefined ? undefined : { 'content-type': 'application/json' },
  });
}

describe('B-4: rate limiting gir 429 når taket er nått (mønster fra A5)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // pgCheck tilsier at taket er nått → rutene skal svare 429.
    mockedPgCheck.mockResolvedValue({ ok: false, remaining: 0 });
  });

  it('POST /api/journey/queue → 429 (nøkkel journey:queue:<id>, 10/60s)', async () => {
    mockedRequireAuth.mockResolvedValue({ user: { id: 'u-q', email: 'u@t.no', role: 'user' } });
    const res = await queuePost(jsonReq('POST', '/api/journey/queue'));
    expect(res.status).toBe(429);
    expect(mockedPgCheck).toHaveBeenCalledWith('journey:queue:u-q', 10, 60);
  });

  it('POST /api/onboarding/save → 429 (nøkkel onboarding:save:<id>, 60/60s)', async () => {
    mockedSession.mockResolvedValue({ user: { id: 'u-s' } });
    const res = await savePost(jsonReq('POST', '/api/onboarding/save'));
    expect(res.status).toBe(429);
    expect(mockedPgCheck).toHaveBeenCalledWith('onboarding:save:u-s', 60, 60);
  });

  it('POST /api/onboarding/draft → 429 (nøkkel onboarding:draft:<id>, 120/60s)', async () => {
    mockedSession.mockResolvedValue({ user: { id: 'u-d' } });
    const res = await draftPost(jsonReq('POST', '/api/onboarding/draft'));
    expect(res.status).toBe(429);
    expect(mockedPgCheck).toHaveBeenCalledWith('onboarding:draft:u-d', 120, 60);
  });

  it('POST /api/profile/setup → 429 (nøkkel profile:setup:<id>, 20/60s)', async () => {
    mockedValidate.mockReturnValue({ success: true, data: {} });
    mockedSession.mockResolvedValue({ user: { id: 'u-p' } });
    const res = await setupPost(jsonReq('POST', '/api/profile/setup', {}));
    expect(res.status).toBe(429);
    expect(mockedPgCheck).toHaveBeenCalledWith('profile:setup:u-p', 20, 60);
  });

  it('POST /api/chat/image → 429 (nøkkel chat:image:<id>, 10/60s)', async () => {
    mockedSession.mockResolvedValue({ user: { id: 'u-i' } });
    const res = await imagePost(jsonReq('POST', '/api/chat/image'));
    expect(res.status).toBe(429);
    expect(mockedPgCheck).toHaveBeenCalledWith('chat:image:u-i', 10, 60);
  });
});
