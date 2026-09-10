/**
 * ToSom — GET /api/chat/image/[messageId]
 *
 * Verifiserer tilgangskontrollen på side-ruta som proxy-er bildet tilbake:
 *   - 401 uten session
 *   - 404 ukjend melding
 *   - 403 for ikke-deltaker
 *   - 404 for melding uten bilde
 *   - 200 med bilde-innhold (proxy) for gyldig deltaker
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

  it('401 uten session', async () => {
    session.mockResolvedValue(null);
    const res = await GET(makeRequest('msg-1'), params('msg-1'));
    expect(res.status).toBe(401);
  });

  it('404 for ukjend melding', async () => {
    messageFindUnique.mockResolvedValue(null);
    const res = await GET(makeRequest('msg-1'), params('msg-1'));
    expect(res.status).toBe(404);
  });

  it('403 for ikke-deltakar', async () => {
    messageFindUnique.mockResolvedValue({
      id: 'msg-1',
      type: 'image',
      imageKey: 'conv-1/abc.jpg',
      conversation: { userAId: 'user-x', userBId: 'user-y' },
    });
    const res = await GET(makeRequest('msg-1'), params('msg-1'));
    expect(res.status).toBe(403);
  });

  it('404 for melding uten bilde (type=user)', async () => {
    messageFindUnique.mockResolvedValue({
      id: 'msg-1',
      type: 'user',
      imageKey: null,
      conversation: { userAId: 'user-a', userBId: 'user-b' },
    });
    const res = await GET(makeRequest('msg-1'), params('msg-1'));
    expect(res.status).toBe(404);
  });

  it('200 med bilde-innhold (proxy) for gyldig deltaker', async () => {
    messageFindUnique.mockResolvedValue({
      id: 'msg-1',
      type: 'image',
      imageKey: 'conv-1/abc.jpg',
      conversation: { userAId: 'user-a', userBId: 'user-b' },
    });
    const res = await GET(makeRequest('msg-1'), params('msg-1'));
    expect(res.status).toBe(200);
    // Proxy: bildet skal komme tilbake som binær buffer — IKKE som redirect.
    expect(res.headers.get('location')).toBeNull();
    expect(res.headers.get('content-type')).toBe('image/jpeg');
    expect(res.headers.get('content-length')).toBe(String(Buffer.from('x').length));
    const body = Buffer.from(await res.arrayBuffer());
    expect(body.equals(Buffer.from('x'))).toBe(true);
  });
});
