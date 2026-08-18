/**
 * ToSom — B0.7 Funksjonell verifisering av GET /api/chat/conversations
 *
 * Kjør DET FAKTISKE rutehåndtereren og verifiser 200-svaret med korrekt data
 * (partner, reise-dag, resonans→mood, uleste, siste melding) for begge perspektiver.
 *
 * Prisma-laget mockes (deterministisk, isolert — unngår delt DB-race med
 * integrasjonstester i CI). Rute-LOGIKKEN (auth, select, mapping, mood, uleste)
 * er det som verifiseres her; Prisma-QUERY-sjekk dekkes av tsc (type-sjekker
 * spørringen mot klienten) + integrasjonstestene. Sesjonen mockes også (NextAuth
 * dev-login er en pre-eksisterende feil utenfor B0.7-omfanget).
 */

jest.mock('@/lib/auth/session', () => ({
  getServerSession: jest.fn(),
  requireNotBanned: jest.fn(),
}));
jest.mock('@/lib/prisma', () => ({
  prisma: {
    conversation: { findMany: jest.fn() },
    match: { findMany: jest.fn(), findFirst: jest.fn() },
    journeyProgress: { findMany: jest.fn() },
    $disconnect: jest.fn(),
  },
}));

import { getServerSession } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';
import { GET } from '@/app/api/chat/conversations/route';

const mockedSession = getServerSession as jest.Mock;
const mockedPrisma = prisma as unknown as {
  conversation: { findMany: jest.Mock };
  match: { findMany: jest.Mock; findFirst: jest.Mock };
  journeyProgress: { findMany: jest.Mock };
};

const USER_A = 'b07_user_a'; // pålogget (part A)
const USER_B = 'b07_user_b'; // motpart (part B)
const MATCH_ID = 'b07_match';
const CONV_ID = 'b07_conv';

const conversationRow = {
  id: CONV_ID,
  matchId: MATCH_ID,
  userAId: USER_A,
  userBId: USER_B,
  lastMessageAt: new Date('2026-08-14T09:00:00.000Z'),
  lastMessagePreview: 'God morgen!',
  unreadCountA: 2,
  unreadCountB: 0,
  userA: { name: 'Erik', profile: { identityName: 'Erik', age: 30, photoUrl: null } },
  userB: { name: 'Astrid', profile: { identityName: 'Astrid', age: 31, photoUrl: 'https://x/a.png' } },
};

function request(): Request {
  return new Request('http://localhost/api/chat/conversations');
}

function mockActiveConversation() {
  mockedPrisma.conversation.findMany.mockResolvedValue([conversationRow]);
  mockedPrisma.match.findMany.mockResolvedValue([{ id: MATCH_ID, resonanceLevel: 'STRONG' }]);
  mockedPrisma.journeyProgress.findMany.mockResolvedValue([{ matchId: MATCH_ID, day: 3 }]);
}

describe('GET /api/chat/conversations (B0.7)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returnerer 401 uten sesjon', async () => {
    mockedSession.mockResolvedValueOnce(null);
    const res = await GET(request());
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.success).toBe(false);
  });

  it('returnerer 200 med korrekt partner-info når pålogget som part A', async () => {
    mockActiveConversation();
    mockedSession.mockResolvedValueOnce({ user: { id: USER_A, role: 'USER' } });

    const res = await GET(request());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    const conv = (body.data as any[]).find((c) => c.id === CONV_ID);
    expect(conv).toBeDefined();
    expect(conv.partnerName).toBe('Astrid'); // motpart (B)
    expect(conv.partnerAge).toBe(31);
    expect(conv.partnerImageUrl).toBe('https://x/a.png');
    expect(conv.journeyDay).toBe(3);
    expect(conv.mood).toBe('joyful'); // STRONG → joyful (aldri tall — I-12)
    expect(conv.unreadCount).toBe(2); // part A
    expect(conv.lastMessage).toBe('God morgen!');
    expect(conv.lastMessageTime).toBe('2026-08-14T09:00:00.000Z');
  });

  it('returnerer samme samtale når pålogget som motpart (part B), med part-B-uleste', async () => {
    mockActiveConversation();
    mockedSession.mockResolvedValueOnce({ user: { id: USER_B, role: 'USER' } });

    const res = await GET(request());
    const body = await res.json();
    const conv = (body.data as any[]).find((c) => c.id === CONV_ID);
    expect(conv).toBeDefined();
    expect(conv.partnerName).toBe('Erik'); // motpart (A)
    expect(conv.partnerAge).toBe(30);
    expect(conv.unreadCount).toBe(0); // part B
  });

  it('returnerer tom liste når det ikke finnes aktive samtaler', async () => {
    mockedPrisma.conversation.findMany.mockResolvedValue([]);
    mockedPrisma.match.findMany.mockResolvedValue([]);
    mockedPrisma.match.findFirst.mockResolvedValue(null); // self-healing: ingen aktiv match
    mockedPrisma.journeyProgress.findMany.mockResolvedValue([]);
    mockedSession.mockResolvedValueOnce({ user: { id: USER_A, role: 'USER' } });

    const res = await GET(request());
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data).toEqual([]);
  });
});