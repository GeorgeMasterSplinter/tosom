/**
 * PL-01 (K-1) — Kontosletting virker ende-til-ende
 *
 * Verifiserer at POST /api/settings/delete-account:
 *   1. Krever body og bekreftelse (400, ingen sletting)
 *   2. Krever sesjon (401)
 *   3. Kaller endJourney(matchId, 'early_exit') DIREKTE før transaksjonen
 *      når brukeren har en aktiv match (ikke internt HTTP-kall — det
 *      feilet stille på CSRF)
 *   4. Kaller endJourney IKKE uten aktiv match
 *   5. Sletter User-radet i transaksjonen
 *   6. Rører aldri MatchHistory (skal overleve — to ID-er, ingen innhold)
 *
 * Prisma, auth, CSRF, endJourney og e-post mockes (deterministisk, isolert).
 */

jest.mock('@/lib/auth/session', () => ({
  getServerSession: jest.fn(),
}));
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: { findUnique: jest.fn(), delete: jest.fn() },
    match: { findFirst: jest.fn() },
    $transaction: jest.fn(),
  },
}));
jest.mock('@/lib/auth/csrf', () => ({
  csrfCheck: jest.fn(),
}));
jest.mock('@/lib/journey/endJourney', () => ({
  endJourney: jest.fn(),
}));
jest.mock('@/lib/email', () => ({
  sendDeletionConfirmationEmail: jest.fn(),
}));

import { NextRequest } from 'next/server';
import { getServerSession } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';
import { csrfCheck } from '@/lib/auth/csrf';
import { endJourney } from '@/lib/journey/endJourney';
import { sendDeletionConfirmationEmail } from '@/lib/email';
import { POST } from '@/app/api/settings/delete-account/route';

const mockedSession = getServerSession as jest.Mock;
const mockedCsrf = csrfCheck as jest.Mock;
const mockedEndJourney = endJourney as jest.Mock;
const mockedEmail = sendDeletionConfirmationEmail as jest.Mock;

// Transaksjons-klienten $transaction mottar (fn) — vi kaller fn med en tx-mock
const mockedTx = {
  conversation: { findMany: jest.fn() },
  message: { deleteMany: jest.fn() },
  journeyStateLog: { deleteMany: jest.fn() },
  resonanceSession: { deleteMany: jest.fn() },
  gameSession: { deleteMany: jest.fn() },
  profile: { deleteMany: jest.fn() },
  notification: { deleteMany: jest.fn() },
  journeyProgress: { deleteMany: jest.fn() },
  match: { deleteMany: jest.fn() },
  session: { deleteMany: jest.fn() },
  account: { deleteMany: jest.fn() },
  twoFactorSecret: { deleteMany: jest.fn() },
  passwordResetToken: { deleteMany: jest.fn() },
  user: { delete: jest.fn() },
  // Skal IKKE røres ved kontosletting — overlever med bevisst hensikt
  matchHistory: { deleteMany: jest.fn(), updateMany: jest.fn() },
  report: { deleteMany: jest.fn() },
  userBlock: { deleteMany: jest.fn() },
};

const mockedPrisma = prisma as unknown as {
  user: { findUnique: jest.Mock; delete: jest.Mock };
  match: { findFirst: jest.Mock };
  $transaction: jest.Mock;
};

function postRequest(body?: unknown): NextRequest {
  return new NextRequest('http://localhost/api/settings/delete-account', {
    method: 'POST',
    ...(body === undefined
      ? {}
      : {
          body: JSON.stringify(body),
          headers: { 'content-type': 'application/json' },
        }),
  });
}

async function call(body?: unknown): Promise<{ status: number; body: any }> {
  const res = (await POST(postRequest(body))) as Response;
  return { status: res.status, body: await res.json() };
}

function mockTransaction() {
  mockedPrisma.$transaction.mockImplementation(async (fn: (tx: unknown) => Promise<unknown>) =>
    fn(mockedTx)
  );
}

describe('POST /api/settings/delete-account (K-1)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedCsrf.mockResolvedValue({ token: 'csrf-token' });
    mockedEmail.mockResolvedValue(undefined);
    mockedSession.mockResolvedValue({ user: { id: 'u-1', email: 'bruker@eksempel.no' } });
    mockedTx.conversation.findMany.mockResolvedValue([]);
    mockedTx.user.delete.mockResolvedValue({ id: 'u-1' });
    mockTransaction();
  });

  it('uten body → 400, ingen sletting', async () => {
    const { status, body } = await call();

    expect(status).toBe(400);
    expect(body.error).toBeTruthy();
    expect(mockedEndJourney).not.toHaveBeenCalled();
    expect(mockedPrisma.$transaction).not.toHaveBeenCalled();
  });

  it('feil confirmation → 400, ingen sletting', async () => {
    const { status, body } = await call({ confirmation: 'JA' });

    expect(status).toBe(400);
    expect(body.error).toBeTruthy();
    expect(mockedEndJourney).not.toHaveBeenCalled();
    expect(mockedPrisma.$transaction).not.toHaveBeenCalled();
  });

  it('uten sesjon → 401, ingen sletting', async () => {
    mockedSession.mockResolvedValue(null);

    const { status } = await call({ confirmation: 'DELETE' });

    expect(status).toBe(401);
    expect(mockedEndJourney).not.toHaveBeenCalled();
    expect(mockedPrisma.$transaction).not.toHaveBeenCalled();
  });

  it('aktiv match → endJourney(matchId, "early_exit") kalles FØR transaksjonen', async () => {
    mockedPrisma.user.findUnique.mockResolvedValue({ email: 'bruker@eksempel.no', name: 'Anna' });
    mockedPrisma.match.findFirst.mockResolvedValue({ id: 'm-1' });
    mockedEndJourney.mockResolvedValue({ deleted: {} });

    const callOrder: string[] = [];
    mockedEndJourney.mockImplementation(async () => {
      callOrder.push('endJourney');
      return { deleted: {} };
    });
    mockedPrisma.$transaction.mockImplementation(async (fn: (tx: unknown) => Promise<unknown>) => {
      callOrder.push('transaction');
      return fn(mockedTx);
    });

    const { status } = await call({ confirmation: 'DELETE' });

    expect(status).toBe(200);
    expect(mockedEndJourney).toHaveBeenCalledWith('m-1', 'early_exit');
    expect(callOrder).toEqual(['endJourney', 'transaction']);
    expect(mockedTx.user.delete).toHaveBeenCalledWith({ where: { id: 'u-1' } });
    expect(mockedEmail).toHaveBeenCalledWith('bruker@eksempel.no', 'Anna');
  });

  it('uten aktiv match → endJourney kalles ikke, user.delete kalles', async () => {
    mockedPrisma.user.findUnique.mockResolvedValue({ email: 'bruker@eksempel.no', name: null });
    mockedPrisma.match.findFirst.mockResolvedValue(null);

    const { status } = await call({ confirmation: 'DELETE' });

    expect(status).toBe(200);
    expect(mockedEndJourney).not.toHaveBeenCalled();
    expect(mockedPrisma.$transaction).toHaveBeenCalledTimes(1);
    expect(mockedTx.user.delete).toHaveBeenCalledWith({ where: { id: 'u-1' } });
  });

  it('MatchHistory, Report og UserBlock røres ikke', async () => {
    mockedPrisma.user.findUnique.mockResolvedValue({ email: 'bruker@eksempel.no', name: null });
    mockedPrisma.match.findFirst.mockResolvedValue(null);

    const { status } = await call({ confirmation: 'DELETE' });

    expect(status).toBe(200);
    expect(mockedTx.matchHistory.deleteMany).not.toHaveBeenCalled();
    expect(mockedTx.matchHistory.updateMany).not.toHaveBeenCalled();
    expect(mockedTx.report.deleteMany).not.toHaveBeenCalled();
    expect(mockedTx.userBlock.deleteMany).not.toHaveBeenCalled();
  });
});
