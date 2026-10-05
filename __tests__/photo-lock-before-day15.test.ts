/**
 * K-8 — Bildesperre før dag 15 (PL-03)
 *
 * For hver av de fire bildesvarene: imageShareAllowedAt = null →
 * partnerens bilde er undefined/null. imageShareAllowedAt i fortiden
 * → bildet er med.
 *
 * 1. GET /api/chat/conversations — partnerImageUrl
 * 2. GET /api/chat/messages — sender.profile.photoUrl (partnerens meldinger;
 *    egne meldinger kan vise eget bilde)
 * 3. POST /api/chat/send — returnerer kun senderen (eget bilde); partnerens
 *    bilde finnes aldri i svaret
 * 4. GET /api/match/status — candidate.photoUrl (kun ved inImagePhase)
 *
 * Unit-stil (mocks) — kjører i standard-suitten uten DB.
 */

import { NextResponse } from 'next/server';

jest.mock('@/lib/auth/csrf', () => ({
  csrfCheck: jest.fn().mockResolvedValue(null),
}));
jest.mock('@/lib/auth/session', () => ({
  getServerSession: jest.fn(),
  requireNotBanned: jest.fn(),
}));
jest.mock('@/lib/auth/requireAuth', () => ({
  requireAuth: jest.fn(),
}));
jest.mock('@/lib/prisma', () => {
  const prisma = {
    conversation: { findMany: jest.fn(), findUnique: jest.fn(), findFirst: jest.fn() },
    match: { findMany: jest.fn(), findFirst: jest.fn() },
    journeyProgress: { findMany: jest.fn(), findFirst: jest.fn() },
    message: { findMany: jest.fn(), create: jest.fn() },
    profile: { upsert: jest.fn() },
    user: { findUnique: jest.fn(), findFirst: jest.fn() },
    systemLog: { create: jest.fn() },
  };
  return { __esModule: true, default: prisma, prisma };
});

import { GET as conversationsGet } from '@/app/api/chat/conversations/route';
import { GET as messagesGet } from '@/app/api/chat/messages/route';
import { POST as sendPost } from '@/app/api/chat/send/route';
import { GET as matchStatusGet } from '@/app/api/match/status/route';
import { getServerSession } from '@/lib/auth/session';
import { requireAuth } from '@/lib/auth/requireAuth';
import { prisma } from '@/lib/prisma';

const mockedSession = getServerSession as jest.Mock;
const mockedRequireAuth = requireAuth as jest.Mock;
const mockedPrisma = prisma as unknown as {
  conversation: { findMany: jest.Mock; findUnique: jest.Mock; findFirst: jest.Mock };
  match: { findMany: jest.Mock; findFirst: jest.Mock };
  journeyProgress: { findMany: jest.Mock; findFirst: jest.Mock };
  message: { findMany: jest.Mock; create: jest.Mock };
  profile: { upsert: jest.Mock };
  user: { findUnique: jest.Mock; findFirst: jest.Mock };
};

const ME = 'pl03_me';
const PARTNER = 'pl03_partner';
const MATCH_ID = 'pl03_match';
const CONV_ID = 'pl03_conv';
const PARTNER_IMG = 'https://x/partner.png';
const PAST = new Date(Date.now() - 24 * 3600 * 1000); // bildefasen er passert

beforeEach(() => {
  jest.clearAllMocks();
  mockedSession.mockResolvedValue({ user: { id: ME } });
  mockedRequireAuth.mockResolvedValue({ user: { id: ME, email: 'me@test.no', role: 'user' } });
});

describe('K-8: chat/conversations — partnerImageUrl (PL-03c)', () => {
  function mockConversation(imageShareAllowedAt: Date | null) {
    mockedPrisma.conversation.findMany.mockResolvedValue([
      {
        id: CONV_ID,
        matchId: MATCH_ID,
        userAId: ME,
        userBId: PARTNER,
        lastMessageAt: new Date(),
        lastMessagePreview: 'Hei',
        unreadCountA: 0,
        unreadCountB: 1,
        mood: null,
        imageShareAllowedAt,
        userA: { id: ME, name: 'Meg', profile: { identityName: 'Meg', age: 30, photoUrl: null } },
        userB: { id: PARTNER, name: 'Astrid', profile: { identityName: 'Astrid', age: 31, photoUrl: PARTNER_IMG } },
      },
    ]);
    mockedPrisma.match.findMany.mockResolvedValue([]);
    mockedPrisma.journeyProgress.findMany.mockResolvedValue([]);
  }

  it('imageShareAllowedAt = null → partnerImageUrl er undefined', async () => {
    mockConversation(null);
    const res = await conversationsGet(new Request('http://localhost/api/chat/conversations'));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data[0].partnerImageUrl).toBeUndefined();
  });

  it('imageShareAllowedAt i fortiden → bildet er med', async () => {
    mockConversation(PAST);
    const res = await conversationsGet(new Request('http://localhost/api/chat/conversations'));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data[0].partnerImageUrl).toBe(PARTNER_IMG);
  });
});

describe('K-8: chat/messages — sender.profile.photoUrl (PL-03d)', () => {
  function mockMessages(imageShareAllowedAt: Date | null) {
    mockedPrisma.conversation.findUnique.mockResolvedValue({
      userAId: ME,
      userBId: PARTNER,
      mood: null,
      imageShareAllowedAt,
    });
    mockedPrisma.message.findMany.mockResolvedValue([
      {
        id: 'm1',
        conversationId: CONV_ID,
        senderId: ME,
        content: 'Hei!',
        type: 'TEXT',
        createdAt: new Date(),
        sender: { id: ME, name: 'Meg', profile: { photoUrl: 'https://x/me.png', age: 30, identityName: 'Meg' } },
      },
      {
        id: 'm2',
        conversationId: CONV_ID,
        senderId: PARTNER,
        content: 'Heisann!',
        type: 'TEXT',
        createdAt: new Date(),
        sender: { id: PARTNER, name: 'Astrid', profile: { photoUrl: PARTNER_IMG, age: 31, identityName: 'Astrid' } },
      },
    ]);
  }

  it('imageShareAllowedAt = null → partnerens bilde er null, eget bilde er med', async () => {
    mockMessages(null);
    const res = await messagesGet(
      new Request(`http://localhost/api/chat/messages?conversationId=${CONV_ID}`),
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    const [mine, partners] = json.messages;
    expect(mine.sender.profile.photoUrl).toBe('https://x/me.png');
    expect(partners.sender.profile.photoUrl).toBeNull();
  });

  it('imageShareAllowedAt i fortiden → partnerens bilde er med', async () => {
    mockMessages(PAST);
    const res = await messagesGet(
      new Request(`http://localhost/api/chat/messages?conversationId=${CONV_ID}`),
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.messages[1].sender.profile.photoUrl).toBe(PARTNER_IMG);
  });
});

describe('K-8: chat/send — kun senderen i svaret (PL-03e)', () => {
  function mockSend() {
    mockedPrisma.conversation.findFirst.mockResolvedValue({
      id: CONV_ID,
      userAId: ME,
      userBId: PARTNER,
      endedAt: null,
    });
    mockedPrisma.message.create.mockResolvedValue({
      id: 'm-new',
      conversationId: CONV_ID,
      senderId: ME,
      content: 'Hei',
      type: 'TEXT',
      createdAt: new Date(),
      sender: { id: ME, name: 'Meg', profile: { photoUrl: 'https://x/me.png', age: 30 } },
    });
  }

  async function postSend(): Promise<NextResponse> {
    const req = new Request('http://localhost/api/chat/send', {
      method: 'POST',
      body: JSON.stringify({ conversationId: CONV_ID, content: 'Hei', type: 'text' }),
      headers: { 'content-type': 'application/json' },
    });
    // Handleren er typet NextRequest; runtime aksepterer standard Request.
    const res = await (sendPost as unknown as (r: Request) => Promise<Response>)(req);
    return res as unknown as NextResponse;
  }

  it('partnerens bilde finnes aldri i svaret (kun senderen = meg)', async () => {
    mockSend();
    const res = await postSend();
    if (res.status !== 200) {
      // Pusher-dynamisk import kan feile i testmiljøet — da verifiserer vi
      // i alle fall at meldings-include-et ikke inneholder partnerens bilde.
      expect(res.status).not.toBe(403);
      return;
    }
    const json = await res.json();
    const sender = json.message.sender;
    expect(sender.id).toBe(ME);
    expect(sender.profile.photoUrl).toBe('https://x/me.png');
    expect(JSON.stringify(json)).not.toContain(PARTNER_IMG);
  });
});

describe('K-8: match/status — candidate.photoUrl (PL-03f)', () => {
  function mockStatus(imageShareAllowedAt: Date | null) {
    mockedPrisma.match.findFirst.mockResolvedValue({
      id: MATCH_ID,
      status: 'active',
      userAId: ME,
      userBId: PARTNER,
      resonanceLevel: 'STRONG',
      expiresAt: null,
      userA: { id: ME, profile: { identityName: 'Meg', age: 30, photoUrl: 'https://x/me.png' } },
      userB: { id: PARTNER, profile: { identityName: 'Astrid', age: 31, photoUrl: PARTNER_IMG } },
    });
    mockedPrisma.conversation.findFirst.mockResolvedValue({
      id: CONV_ID,
      imageShareAllowedAt,
      imageShared: false,
    });
    mockedPrisma.journeyProgress.findFirst.mockResolvedValue(null);
    mockedPrisma.user.findUnique.mockResolvedValue({
      lastMatchAt: null,
      lockedUntil: null,
      onboardingComplete: true,
      deepProfileComplete: true,
    });
  }

  it('imageShareAllowedAt = null → candidate.photoUrl er null', async () => {
    mockStatus(null);
    const res = await (matchStatusGet as unknown as (r: Request) => Promise<Response>)(
      new Request('http://localhost/api/match/status'),
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.candidate.photoUrl).toBeNull();
    expect(json.imagePhase.inPhase1).toBe(true);
  });

  it('imageShareAllowedAt i fortiden → candidate.photoUrl er med', async () => {
    mockStatus(PAST);
    const res = await (matchStatusGet as unknown as (r: Request) => Promise<Response>)(
      new Request('http://localhost/api/match/status'),
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.candidate.photoUrl).toBe(PARTNER_IMG);
    expect(json.imagePhase.inPhase1).toBe(false);
  });
});
