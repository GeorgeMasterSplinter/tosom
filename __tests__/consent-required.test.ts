/**
 * K-2 — Samtykke og vilkårsaksept (PL-02)
 *
 * 1. POST /api/consent uten CSRF → 403
 * 2. POST /api/consent med sensitive: false → 400
 * 3. Gyldig samtykke → termsVersion = TERMS_VERSION, sensitiveConsentAt satt
 * 4. POST /api/profile/setup uten samtykke → 403 CONSENT_REQUIRED
 * 5. GET /api/consent → needsConsent: true når termsVersion er utdatert
 *
 * Unit-stil (mocks) — kjører i standard-suitten uten DB.
 */

import { NextRequest, NextResponse } from 'next/server';
import { TERMS_VERSION } from '@/config/legal';

jest.mock('@/lib/auth/csrf', () => ({
  csrfCheck: jest.fn(),
}));
jest.mock('@/lib/auth/session', () => ({
  getServerSession: jest.fn(),
}));
jest.mock('@/lib/prisma', () => {
  const prisma = {
    user: { findUnique: jest.fn(), update: jest.fn() },
    systemLog: { create: jest.fn() },
  };
  return { __esModule: true, default: prisma, prisma };
});
jest.mock('@/lib/validation/onboarding-setup', () => ({
  validateOnboarding: jest.fn(),
}));
jest.mock('@/lib/rate-limit-pg', () => ({
  pgCheck: jest.fn(),
}));

import { GET, POST } from '@/app/api/consent/route';
import { POST as setupPost } from '@/app/api/profile/setup/route';
import { csrfCheck } from '@/lib/auth/csrf';
import { getServerSession } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';
import { validateOnboarding } from '@/lib/validation/onboarding-setup';

const mockedCsrf = csrfCheck as jest.Mock;
const mockedSession = getServerSession as jest.Mock;
const mockedValidate = validateOnboarding as jest.Mock;
const mockedPrisma = prisma as unknown as {
  user: { findUnique: jest.Mock; update: jest.Mock };
};

function jsonReq(method: string, path: string, body?: unknown): NextRequest {
  return new NextRequest(`http://localhost${path}`, {
    method,
    body: body === undefined ? undefined : JSON.stringify(body),
    headers: { 'content-type': 'application/json' },
  });
}

describe('K-2: samtykke (PL-02)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedSession.mockResolvedValue({ user: { id: 'k2-user' } });
    // Standard: CSRF OK (ruta sjekker `csrf instanceof NextResponse`)
    mockedCsrf.mockResolvedValue(null);
  });

  it('POST /api/consent uten CSRF → 403', async () => {
    mockedCsrf.mockResolvedValue(
      NextResponse.json({ error: 'Ugyldig CSRF-token' }, { status: 403 }),
    );

    const res = await POST(
      jsonReq('POST', '/api/consent', { terms: true, sensitive: true }),
    );

    expect(res.status).toBe(403);
    expect(mockedPrisma.user.update).not.toHaveBeenCalled();
  });

  it('POST /api/consent med sensitive: false → 400', async () => {
    const res = await POST(
      jsonReq('POST', '/api/consent', { terms: true, sensitive: false }),
    );

    expect(res.status).toBe(400);
    expect(mockedPrisma.user.update).not.toHaveBeenCalled();
  });

  it('gyldig samtykke → termsVersion = TERMS_VERSION, sensitiveConsentAt satt', async () => {
    mockedPrisma.user.update.mockResolvedValue({});

    const res = await POST(
      jsonReq('POST', '/api/consent', { terms: true, sensitive: true }),
    );

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });

    expect(mockedPrisma.user.update).toHaveBeenCalledTimes(1);
    const call = mockedPrisma.user.update.mock.calls[0][0];
    expect(call.where).toEqual({ id: 'k2-user' });
    expect(call.data.termsVersion).toBe(TERMS_VERSION);
    expect(call.data.sensitiveConsentAt).toBeInstanceOf(Date);
    expect(call.data.termsAcceptedAt).toBeInstanceOf(Date);
  });

  it('POST /api/profile/setup uten samtykke → 403 CONSENT_REQUIRED', async () => {
    mockedValidate.mockReturnValue({ success: true, data: {} });
    // Uten uttrykkelig samtykke: sensitiveConsentAt er null
    mockedPrisma.user.findUnique.mockResolvedValue({
      termsVersion: TERMS_VERSION,
      sensitiveConsentAt: null,
    });

    const res = await setupPost(jsonReq('POST', '/api/profile/setup', {}));

    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json.code).toBe('CONSENT_REQUIRED');
  });

  it('GET /api/consent gir needsConsent: true når termsVersion er utdatert', async () => {
    mockedPrisma.user.findUnique.mockResolvedValue({
      termsVersion: '2025-01-01',
      sensitiveConsentAt: new Date(),
    });

    const res = await GET();

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ needsConsent: true });
  });
});
