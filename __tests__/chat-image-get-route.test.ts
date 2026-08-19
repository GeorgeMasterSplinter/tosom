/**
 * ToSom — GET /api/chat/image/[messageId]
 *
 * Verifiserer tilgangskontrollen på side-ruta som utsteder signerte URL-er:
 *   - 401 utan session
 *   - 404 ukjend melding
 *   - 403 for ikkje-deltakar
 *   - 404 for melding utan bilde
 *   - 307 redirect til signert URL for gyldig deltakar
 */

import { NextRequest } from 'next/server';

jest.mock('@/lib/auth/session', () => ({
  getServerSession: jest.fn(),
}));
jest.mock('@/lib/prisma', () => ({
  prisma: {
    message: { findUnique: jest.fn() },
  },
}));
jest.mock('@/lib/storage', () => {
  const actual = jest.requireActual('@/lib/storage');
  return {
    ...actual,
    getImageStorage: jest.fn(),
  };
});

import { getServerSession } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';
import { getImageStorage, MemoryImageStorage } from '@/lib/storage';
import { GET } from '@/app/api/chat/image/[messageId]/route';

const session = getServerSession as jest.Mock;
const messageFindUnique = prisma.message.findUnique as jest.Mock;
const getStorage = getImageStorage as jest.Mock;

function makeRequest(messageId: string): NextRequest {
  return new NextRequest(`http://localhost/api/chat/image/${messageId}`, {
    method: 'GET',
  });
}

function params(messageId: string) {
  return { params: Promise.resolve({ messageId }) };
}

describe('GET /api/chat/image/[messageId]', () => {
  let storage: MemoryImageStorage;

  beforeEach(() => {
    jest.clearAllMocks();
    storage = new MemoryImageStorage();
    getStorage.mockReturnValue(storage);
    session.mockResolvedValue({ user: { id: 'user-a' } });
    // Legg eit bilde til memory-storage for nøkkelen vi testar mot.
    storage.putImage('conv-1/abc.jpg', Buffer.from('x'), { contentType: 'image/jpeg' });
  });

  it('401 utan session', async () => {
    session.mockResolvedValue(null);
    const res = await GET(makeRequest('msg-1'), params('msg-1'));
    expect(res.status).toBe(401);
  });

  it('404 for ukjend melding', async () => {
    messageFindUnique.mockResolvedValue(null);
    const res = await GET(makeRequest('msg-1'), params('msg-1'));
    expect(res.status).toBe(404);
  });

  it('403 for ikkje-deltakar', async () => {
    messageFindUnique.mockResolvedValue({
      id: 'msg-1',
      type: 'image',
      imageKey: 'conv-1/abc.jpg',
      conversation: { userAId: 'user-x', userBId: 'user-y' },
    });
    const res = await GET(makeRequest('msg-1'), params('msg-1'));
    expect(res.status).toBe(403);
  });

  it('404 for melding utan bilde (type=user)', async () => {
    messageFindUnique.mockResolvedValue({
      id: 'msg-1',
      type: 'user',
      imageKey: null,
      conversation: { userAId: 'user-a', userBId: 'user-b' },
    });
    const res = await GET(makeRequest('msg-1'), params('msg-1'));
    expect(res.status).toBe(404);
  });

  it('307 redirect til signert URL for gyldig deltakar', async () => {
    messageFindUnique.mockResolvedValue({
      id: 'msg-1',
      type: 'image',
      imageKey: 'conv-1/abc.jpg',
      conversation: { userAId: 'user-a', userBId: 'user-b' },
    });
    const res = await GET(makeRequest('msg-1'), params('msg-1'));
    expect(res.status).toBe(307);
    const location = res.headers.get('location');
    expect(location).toContain('memory://');
    // Aldri ein rå /uploads/ sti.
    expect(location).not.toContain('/uploads/');
  });
});
