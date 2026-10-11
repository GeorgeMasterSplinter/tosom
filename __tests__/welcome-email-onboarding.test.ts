/**
 * ToSom — Velkomst-e-post ved onboarding-fullføring (10.11)
 *
 * Bakgrunn: velkomst-eposten levde på POST /api/onboarding/complete — en rute
 * med NULL kallere i koden. Den faktiske onboarding-slutten skjer på
 * POST /api/profile/setup (profil lagres → onboardingComplete:true → venterom),
 * så eposten ble aldri sendt. Nå sendes den der, kun ved overgangen
 * onboardingComplete: false→true.
 *
 * Enhetstest: mocks validering/prisma/email og verifiserer at
 *   - ny bruker (onboardingComplete=false) FÅR velkomst-epost med navn
 *   - gjentatt omgang (onboardingComplete=true) FÅR IKKE ny epost
 */

jest.mock('@/lib/auth/session', () => ({
  getServerSession: jest.fn(),
}));

jest.mock('@/lib/auth/csrf', () => ({
  csrfCheck: jest.fn(),
}));

jest.mock('@/lib/api/validation', () => ({
  tryParseJsonBody: jest.fn(),
}));

jest.mock('@/lib/validation/onboarding-setup', () => ({
  validateOnboarding: jest.fn(),
}));

jest.mock('@/lib/rate-limit-pg', () => ({
  pgCheck: jest.fn(),
}));

jest.mock('@/lib/observability/withMetrics', () => ({
  // Identitet: test kjører selve postHandler direkte
  withMetrics: (_name: string, handler: unknown) => handler,
}));

jest.mock('@/lib/psychometrics/scoring', () => ({
  scoreAll: jest.fn(),
}));

jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: { findUnique: jest.fn() },
    $transaction: jest.fn(),
  },
}));

jest.mock('@/lib/email', () => ({
  sendWelcomeEmail: jest.fn(),
}));

import { getServerSession } from '@/lib/auth/session';
import { csrfCheck } from '@/lib/auth/csrf';
import { tryParseJsonBody } from '@/lib/api/validation';
import { validateOnboarding } from '@/lib/validation/onboarding-setup';
import { pgCheck } from '@/lib/rate-limit-pg';
import { prisma } from '@/lib/prisma';
import { sendWelcomeEmail } from '@/lib/email';
import { POST } from '@/app/api/profile/setup/route';
import { TERMS_VERSION } from '@/config/legal';

const mockedSession = getServerSession as jest.Mock;
const mockedCsrf = csrfCheck as jest.Mock;
const mockedBody = tryParseJsonBody as jest.Mock;
const mockedValidate = validateOnboarding as jest.Mock;
const mockedPgCheck = pgCheck as jest.Mock;
const mockedFindUnique = prisma.user.findUnique as jest.Mock;
const mockedTransaction = prisma.$transaction as jest.Mock;
const mockedWelcome = sendWelcomeEmail as jest.Mock;

function mockSuccessfulSetup(consent: { onboardingComplete: boolean }) {
  mockedSession.mockResolvedValue({ user: { id: 'u-1' } });
  mockedCsrf.mockResolvedValue(null);
  mockedBody.mockResolvedValue({});
  mockedValidate.mockReturnValue({
    success: true,
    data: {
      basic: {
        identityName: 'Testnavn',
        age: 30,
        gender: 'Kvinne',
        seekingGender: 'Mann',
        city: 'Oslo',
        postalCode: '0150',
        distancePref: 100,
        agePrefMin: 23,
        agePrefMax: 60,
      },
    },
  });
  mockedPgCheck.mockResolvedValue({ ok: true });
  mockedFindUnique.mockResolvedValue({
    termsVersion: TERMS_VERSION,
    sensitiveConsentAt: new Date(),
    onboardingComplete: consent.onboardingComplete,
    email: 'test@eksempel.no',
  });
  // Transaksjonen: kjør callback mot en tom tx-mock (ingen DB-skriving)
  const tx = {
    profile: { upsert: jest.fn().mockResolvedValue({}), update: jest.fn().mockResolvedValue({}) },
    user: { update: jest.fn().mockResolvedValue({}) },
  };
  mockedTransaction.mockImplementation(async (cb: (t: typeof tx) => Promise<unknown>) => cb(tx));
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('POST /api/profile/setup — velkomst-e-post', () => {
  it('sender velkomst-epost med navn når onboarding fullføres (false→true)', async () => {
    mockSuccessfulSetup({ onboardingComplete: false });
    mockedWelcome.mockResolvedValue({ success: true });

    const res = await POST(new Request('http://localhost/api/profile/setup', { method: 'POST' }) as never);

    expect(res.status).toBe(200);
    expect(mockedWelcome).toHaveBeenCalledTimes(1);
    expect(mockedWelcome).toHaveBeenCalledWith('test@eksempel.no', 'Testnavn');
  });

  it('sender IKKE ny velkomst-epost når onboardingComplete allerede er true', async () => {
    mockSuccessfulSetup({ onboardingComplete: true });
    mockedWelcome.mockResolvedValue({ success: true });

    const res = await POST(new Request('http://localhost/api/profile/setup', { method: 'POST' }) as never);

    expect(res.status).toBe(200);
    expect(mockedWelcome).not.toHaveBeenCalled();
  });

  it('profilen lagres likevel selv ved e-postfeil (200)', async () => {
    mockSuccessfulSetup({ onboardingComplete: false });
    mockedWelcome.mockRejectedValue(new Error('SMTP nede'));

    const res = await POST(new Request('http://localhost/api/profile/setup', { method: 'POST' }) as never);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
  });
});
