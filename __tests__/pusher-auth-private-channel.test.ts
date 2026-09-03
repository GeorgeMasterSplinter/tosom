/**
 * ToSom — Pusher PRIVATE-kanal auth (/api/pusher/auth)
 *
 * Verifiserer IDOR-vernet på Pusher-private-kanaler: bare samtale-deltakere
 * (userAId/userBId) får en signert auth-token. En innlogga bruker som IKKE er
 * i samtalen får 403 — uautoriserte kan dermed ikke abonnere på samtale-innhold
 * i sanntid. Signaturformatet (PUSHER_KEY:HMAC-SHA256(socket_id:channel_name))
 * verifiseres mot en uavhengig beregning.
 */

import { NextRequest } from 'next/server';
import { createHmac } from 'crypto';

jest.mock('@/lib/auth/session', () => ({
  getServerSession: jest.fn(),
}));
jest.mock('@/lib/prisma', () => ({
  prisma: {
    conversation: { findFirst: jest.fn() },
  },
}));

import { getServerSession } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';
import { POST } from '@/app/api/pusher/auth/route';

const session = getServerSession as jest.Mock;
const convFindFirst = prisma.conversation.findFirst as jest.Mock;

const KEY = 'test-app-key';
const SECRET = 'test-app-secret';
const CHANNEL = 'private-conversation-conv-x';

function authRequest(socketId: string, channelName: string) {
  return new NextRequest('http://localhost/api/pusher/auth', {
    method: 'POST',
    body: `socket_id=${encodeURIComponent(socketId)}&channel_name=${encodeURIComponent(channelName)}`,
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
  });
}

describe('Pusher private-kanal auth (/api/pusher/auth)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.PUSHER_KEY = KEY;
    process.env.PUSHER_SECRET = SECRET;
  });

  it('returnerer 401 uten sesjon', async () => {
    session.mockResolvedValue(null);
    const res = await POST(authRequest('sock-1', CHANNEL));
    expect(res.status).toBe(401);
  });

  it('returnerer 401 når Pusher ikke er konfigurert', async () => {
    session.mockResolvedValue({ user: { id: 'alice' } });
    process.env.PUSHER_SECRET = '';
    const res = await POST(authRequest('sock-1', CHANNEL));
    expect(res.status).toBe(401);
  });

  it('returnerer 403 for kanal utenfor private-conversation-prefiks', async () => {
    session.mockResolvedValue({ user: { id: 'alice' } });
    const res = await POST(authRequest('sock-1', 'conversation-conv-x'));
    expect(res.status).toBe(403);
  });

  it('returnerer 403 for bruker som ikke er deltaker (IDOR)', async () => {
    session.mockResolvedValue({ user: { id: 'intruder' } });
    convFindFirst.mockResolvedValue(null);
    const res = await POST(authRequest('sock-1', CHANNEL));
    expect(res.status).toBe(403);
  });

  it('returnerer 200 + gyldig signatur for samtale-deltaker', async () => {
    session.mockResolvedValue({ user: { id: 'alice' } });
    convFindFirst.mockResolvedValue({ id: 'conv-x' });
    const res = await POST(authRequest('sock-123', CHANNEL));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(typeof body.auth).toBe('string');
    const [k, sig] = (body.auth as string).split(':');
    expect(k).toBe(KEY);
    const expected = createHmac('sha256', SECRET).update(`sock-123:${CHANNEL}`).digest('hex');
    expect(sig).toBe(expected);
  });

  it('verifiserer deltakskap via findFirst (userAId/userBId)', async () => {
    session.mockResolvedValue({ user: { id: 'bob' } });
    convFindFirst.mockResolvedValue({ id: 'conv-x' });
    await POST(authRequest('sock-1', CHANNEL));
    expect(convFindFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          id: 'conv-x',
          OR: [
            { userAId: 'bob' },
            { userBId: 'bob' },
          ],
        }),
      })
    );
  });
});