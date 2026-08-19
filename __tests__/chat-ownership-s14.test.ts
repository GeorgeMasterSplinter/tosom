/**
 * ToSom — S-14: Eierskapssjekk på samtaleruter (IDOR-vern)
 *
 * Planen: «Test som forsøker tilgang på tvers av samtaler og forventer 403».
 * Alle chat-ruter håndhever ALLEREDE eierskap server-side. Denne filen fyller
 * test-gapene der tverrsamtale-tilgang ikke var dekket:
 *   - GET  /api/chat/conversation/:conversationId
 *   - GET  /api/chat/messages?conversationId=X
 *   - POST /api/chat/send
 *   - POST /api/chat/typing
 *
 * Prisma mockes; sesjon/requireAuth mockes. Rute-logikken (403-avgrensing)
 * er det som verifiseres.
 */

import { NextRequest } from 'next/server';

jest.mock('@/lib/auth/session', () => ({
  getServerSession: jest.fn(),
  requireNotBanned: jest.fn(),
}));
jest.mock('@/lib/auth/requireAuth', () => ({
  requireAuth: jest.fn(),
}));
jest.mock('@/lib/pusher/server', () => ({
  triggerTyping: jest.fn(),
}));
jest.mock('@/lib/prisma', () => ({
  prisma: {
    conversation: { findUnique: jest.fn(), findFirst: jest.fn() },
    message: { findMany: jest.fn() },
    user: { findUnique: jest.fn() },
    profile: { findUnique: jest.fn() },
  },
}));

import { getServerSession, requireNotBanned } from '@/lib/auth/session';
import { requireAuth } from '@/lib/auth/requireAuth';
import { prisma } from '@/lib/prisma';
import { GET as getConversationInfo } from '@/app/api/chat/conversation/[conversationId]/route';
import { GET as getMessages } from '@/app/api/chat/messages/route';
import { POST as send } from '@/app/api/chat/send/route';
import { POST as typing } from '@/app/api/chat/typing/route';

const session = getServerSession as jest.Mock;
const notBanned = requireNotBanned as jest.Mock;
const reqAuth = requireAuth as jest.Mock;
const convFindUnique = prisma.conversation.findUnique as jest.Mock;
const convFindFirst = prisma.conversation.findFirst as jest.Mock;

// En samtale mellom to andre brukere — «intruder» er ikke deltaker.
const CONV = { id: 'conv-x', userAId: 'alice', userBId: 'bob' };

describe('S-14: eierskapssjekk (tverrsamtale → 403)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/chat/conversation/:conversationId', () => {
    it('returnerer 403 for bruker som ikke er deltaker', async () => {
      session.mockResolvedValue({ user: { id: 'intruder' } });
      convFindUnique.mockResolvedValue({ ...CONV, userA: { id: 'alice', email: 'a@x' }, userB: { id: 'bob', email: 'b@x' } });

      const res = await getConversationInfo(
        new Request('http://localhost/api/chat/conversation/conv-x'),
        { params: Promise.resolve({ conversationId: 'conv-x' }) }
      );
      expect(res.status).toBe(403);
    });
  });

  describe('GET /api/chat/messages', () => {
    it('returnerer 403 for bruker som ikke er deltaker', async () => {
      session.mockResolvedValue({ user: { id: 'intruder' } });
      convFindUnique.mockResolvedValue(CONV);

      const res = await getMessages(
        new Request('http://localhost/api/chat/messages?conversationId=conv-x')
      );
      expect(res.status).toBe(403);
    });
  });

  describe('POST /api/chat/send', () => {
    it('returnerer 403 for bruker som ikke er deltaker', async () => {
      session.mockResolvedValue({ user: { id: 'intruder' } });
      notBanned.mockResolvedValue(null);
      convFindFirst.mockResolvedValue(null); // ikke deltaker

      const res = await send(
        new NextRequest('http://localhost/api/chat/send', {
          method: 'POST',
          body: JSON.stringify({ conversationId: 'conv-x', content: 'Hei', type: 'text' }),
          headers: { 'content-type': 'application/json' },
        })
      );
      expect(res.status).toBe(403);
    });
  });

  describe('POST /api/chat/typing', () => {
    it('returnerer 403 for bruker som ikke er deltaker', async () => {
      reqAuth.mockResolvedValue({ user: { id: 'intruder' } });
      convFindFirst.mockResolvedValue(null); // ikke deltaker

      const res = await typing(
        new NextRequest('http://localhost/api/chat/typing', {
          method: 'POST',
          body: JSON.stringify({ conversationId: 'conv-x', isTyping: true }),
          headers: { 'content-type': 'application/json' },
        })
      );
      expect(res.status).toBe(403);
    });
  });
});
