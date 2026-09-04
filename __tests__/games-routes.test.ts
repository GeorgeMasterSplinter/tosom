/**
 * Spill-API — rutetester.
 */
import { NextRequest } from 'next/server';

jest.mock('@/lib/auth/session', () => ({ getServerSession: jest.fn() }));
jest.mock('@/lib/prisma', () => ({ prisma: {
  conversation: { findFirst: jest.fn() },
  gameSession: { findFirst: jest.fn(), findUnique: jest.fn(), create: jest.fn(), update: jest.fn() },
}}));
jest.mock('@/lib/auth/csrf', () => ({ csrfCheck: jest.fn().mockResolvedValue(true) }));
jest.mock('@/lib/rate-limit-pg', () => ({ pgCheck: jest.fn().mockResolvedValue({ ok: true }) }));

import { getServerSession } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';
import { csrfCheck } from '@/lib/auth/csrf';
import { POST as startGame } from '@/app/api/game/start/route';
import { POST as makeMove } from '@/app/api/game/move/route';

const mockSession = getServerSession as jest.Mock;
const mockPrisma = prisma as any;
const mockCsrf = csrfCheck as jest.Mock;

function json(body: object): NextRequest {
  return new NextRequest('http://localhost/api/game/move', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/game/start', () => {
  beforeAll(() => { mockSession.mockResolvedValue({ user: { id: 'userA' } }); });

  it('403 — ikke deltaker', async () => {
    mockPrisma.conversation.findFirst.mockResolvedValue(null);
    const res = await startGame(json({ conversationId: 'c1', type: 'TTT' }));
    expect(res.status).toBe(403);
  });

  it('200 — idempotent: join eksisterende aktivt spill', async () => {
    mockPrisma.conversation.findFirst.mockResolvedValue({ id: 'c1', userAId: 'userA', userBId: 'userB' });
    mockPrisma.gameSession.findFirst.mockResolvedValue({ id: 'ex', state: { board: ['X','','O','','','','','','',''] }, turn: 'userB' });
    const res = await startGame(json({ conversationId: 'c1', type: 'TTT' }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.sessionId).toBe('ex');
  });

  it('200 — starter nytt TTT', async () => {
    mockPrisma.conversation.findFirst.mockResolvedValue({ id: 'c1', userAId: 'userA', userBId: 'userB' });
    mockPrisma.gameSession.findFirst.mockResolvedValue(null);
    mockPrisma.gameSession.create.mockResolvedValue({ id: 'g1', conversationId: 'c1', type: 'TTT', state: {}, turn: 'userA', status: 'ACTIVE' });
    const res = await startGame(json({ conversationId: 'c1', type: 'TTT' }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.sessionId).toBe('g1');
  });
});

describe('POST /api/game/move', () => {
  beforeAll(() => { mockSession.mockResolvedValue({ user: { id: 'userA' } }); });

  it('403 — ikke deltaker', async () => {
    mockPrisma.gameSession.findUnique.mockResolvedValue({
      id: 'g1', status: 'ACTIVE', type: 'TTT',
      state: { board: Array(9).fill(null), turn: 'A', winner: null },
      conversation: { userAId: 'x', userBId: 'y' },
    });
    const res = await makeMove(json({ sessionId: 'g1', cell: 4 }));
    expect(res.status).toBe(403);
  });

  it('400 — trekk utenfor tur', async () => {
    mockPrisma.gameSession.findUnique.mockResolvedValue({
      id: 'g1', status: 'ACTIVE', type: 'TTT',
      state: { board: Array(9).fill(null), turn: 'B', winner: null },
      conversation: { userAId: 'userA', userBId: 'userB' },
    });
    const res = await makeMove(json({ sessionId: 'g1', cell: 4 }));
    expect(res.status).toBe(400);
  });

  it('404 — spillet er over', async () => {
    mockPrisma.gameSession.findUnique.mockResolvedValue({
      id: 'g1', status: 'COMPLETED', type: 'TTT',
      state: { board: Array(9).fill('X'), turn: 'A', winner: 'A' },
      conversation: { userAId: 'userA', userBId: 'userB' },
    });
    const res = await makeMove(json({ sessionId: 'g1', cell: 0 }));
    expect(res.status).toBe(404);
  });

  it('200 — gyldig trekk (spiller B)', async () => {
    const board = Array(9).fill(null);
    board[4] = 'X';
    mockPrisma.gameSession.findUnique.mockResolvedValue({
      id: 'g1', status: 'ACTIVE', type: 'TTT',
      state: { board, turn: 'B', winner: null },
      conversation: { userAId: 'userA', userBId: 'userB' },
    });
    mockPrisma.gameSession.update.mockResolvedValue({});
    mockSession.mockResolvedValue({ user: { id: 'userB' } });
    const res = await makeMove(json({ sessionId: 'g1', cell: 0 }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.state.board[0]).toBe('O');
  });

  it('400 — RPS dobbelt valg', async () => {
    mockPrisma.gameSession.findUnique.mockResolvedValue({
      id: 'g2', status: 'ACTIVE', type: 'RPS',
      state: { choiceA: 'rock', choiceB: null, winner: null },
      conversation: { userAId: 'userA', userBId: 'userB' },
    });
    mockSession.mockResolvedValue({ user: { id: 'userA' } });
    const res = await makeMove(json({ sessionId: 'g2', choice: 'paper' }));
    expect(res.status).toBe(400);
  });

  it('403 — manglende CSRF', async () => {
    const { NextResponse } = await import('next/server');
    mockCsrf.mockResolvedValue(NextResponse.json({ error: 'CSRF_MISSING' }, { status: 403 }));
    const res = await makeMove(json({ sessionId: 'g1', cell: 0 }));
    expect(res.status).toBe(403);
    mockCsrf.mockResolvedValue(true);
  });
});
