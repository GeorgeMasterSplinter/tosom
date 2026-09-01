/**
 * ToSom — C-3 (CHAT-POLISH): DELT mood — kontrakttest
 *
 * «Én mood per samtale — begge parter deler den.» Testen verifiserer heile
 * synk-kontrakten klienten byggjer på:
 *   1. A setjer mood (PATCH /api/chat/mood)
 *   2. B ser SAME mood via GET /api/chat/messages (synk-vegen for 3s-pollinga)
 *   3. B bytter mood → A ser B si mood (motretning)
 *   4. Ikke-deltakar → 403; ugyldig mood → 400
 *   5. Same mood igjen → ingen overflødig DB-skriving
 *
 * Prisma er mocka med IN-MEMORY-tilstand, så begge rutene i same test ser
 * same «database» — akkurat som Alice og Bob i produksjon.
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
  triggerMoodChange: jest.fn(),
  triggerTyping: jest.fn(),
}));
jest.mock('@/lib/prisma', () => ({
  prisma: {
    conversation: { findFirst: jest.fn(), findUnique: jest.fn(), update: jest.fn() },
    message: { findMany: jest.fn() },
  },
}));

import { getServerSession } from '@/lib/auth/session';
import { requireAuth } from '@/lib/auth/requireAuth';
import { prisma } from '@/lib/prisma';
import { triggerMoodChange } from '@/lib/pusher/server';
import { DEFAULT_MOOD } from '@/app/chat/lib/mood';
import { PATCH as setMood } from '@/app/api/chat/mood/route';
import { GET as getMessages } from '@/app/api/chat/messages/route';

const session = getServerSession as jest.Mock;
const reqAuth = requireAuth as jest.Mock;
const convFindFirst = prisma.conversation.findFirst as jest.Mock;
const convFindUnique = prisma.conversation.findUnique as jest.Mock;
const convUpdate = prisma.conversation.update as jest.Mock;
const msgFindMany = prisma.message.findMany as jest.Mock;
const pusherMood = triggerMoodChange as jest.Mock;

// In-memory «database» — same tilstand for begge rutene i same test
interface Row { id: string; userAId: string; userBId: string; mood: string; }
let rows: Row[] = [];

function patchRequest(userId: string, body: unknown) {
  reqAuth.mockResolvedValue({ user: { id: userId } });
  return new NextRequest('http://localhost/api/chat/mood', {
    method: 'PATCH',
    body: JSON.stringify(body),
    headers: { 'content-type': 'application/json' },
  });
}

/** Same lesing klientens 3-sekunds-polling gjer: GET /api/chat/messages */
async function moodSeenBy(userId: string, conversationId: string): Promise<string> {
  session.mockResolvedValue({ user: { id: userId } });
  convFindUnique.mockImplementation(async ({ where }: any) => {
    const row = rows.find((r) => r.id === where.id);
    if (!row) return null;
    return { id: row.id, userAId: row.userAId, userBId: row.userBId, mood: row.mood };
  });
  msgFindMany.mockResolvedValue([]);
  const res = await getMessages(
    new Request(`http://localhost/api/chat/messages?conversationId=${conversationId}`)
  );
  if (res.status !== 200) throw new Error(`messages-ruta gav ${res.status}`);
  const data = await res.json();
  return data.mood;
}

describe('C-3: delt mood (én mood per samtale, begge parter deler)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    pusherMood.mockResolvedValue(undefined);
    rows = [
      { id: 'conv-1', userAId: 'alice', userBId: 'bob', mood: DEFAULT_MOOD },
    ];
    convFindFirst.mockImplementation(async ({ where }: any) => {
      const row = rows.find((r) => r.id === where.id);
      if (!row) return null;
      const isMember = where.OR.some(
        (or: { userAId?: string; userBId?: string }) =>
          or.userAId === row.userAId || or.userAId === row.userBId
      );
      return isMember ? { id: row.id, mood: row.mood } : null;
    });
    convUpdate.mockImplementation(async ({ where, data }: any) => {
      const row = rows.find((r) => r.id === where.id)!;
      Object.assign(row, data);
      return { ...row };
    });
  });

  it('A setjer mood → B ser SAME mood ved neste polling', async () => {
    const res = await setMood(patchRequest('alice', { conversationId: 'conv-1', mood: 'deep' }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ success: true, mood: 'deep' });

    // Bob les på same måte som klientens 3-sekunds-polling
    const seenByBob = await moodSeenBy('bob', 'conv-1');
    expect(seenByBob).toBe('deep');

    // ... og Alice selv ser same mood (ikke to ulike)
    const seenByAlice = await moodSeenBy('alice', 'conv-1');
    expect(seenByAlice).toBe('deep');
  });

  it('B bytter mood → A ser B si mood (motretning)', async () => {
    await setMood(patchRequest('bob', { conversationId: 'conv-1', mood: 'dreamy' }));
    const seenByAlice = await moodSeenBy('alice', 'conv-1');
    expect(seenByAlice).toBe('dreamy');
  });

  it('Ikke-deltakar → 403 og mood endrast ikke', async () => {
    const res = await setMood(patchRequest('mallory', { conversationId: 'conv-1', mood: 'playful' }));
    expect(res.status).toBe(403);
    expect(rows[0].mood).toBe(DEFAULT_MOOD);
  });

  it('Ugyldig mood → 400 og ingen DB-skriving', async () => {
    const res = await setMood(patchRequest('alice', { conversationId: 'conv-1', mood: 'neon-vibe' }));
    expect(res.status).toBe(400);
    expect(convUpdate).not.toHaveBeenCalled();
  });

  it('Same mood igjen → suksess, men ingen overflødig DB-skriving', async () => {
    const res = await setMood(patchRequest('alice', { conversationId: 'conv-1', mood: DEFAULT_MOOD }));
    expect(res.status).toBe(200);
    expect(convUpdate).not.toHaveBeenCalled();
  });

  it('Pusher-broadcast er best-effort — nedlegging av Pusher blokkerer ikke', async () => {
    pusherMood.mockRejectedValueOnce(new Error('Pusher nede'));
    const res = await setMood(patchRequest('alice', { conversationId: 'conv-1', mood: 'cozy' }));
    expect(res.status).toBe(200);
    expect(rows[0].mood).toBe('cozy');
    expect(pusherMood).toHaveBeenCalledWith('conv-1', 'alice', 'cozy');
  });
});