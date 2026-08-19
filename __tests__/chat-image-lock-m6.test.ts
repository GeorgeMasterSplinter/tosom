/**
 * ToSom — M-6: Bilde-lås håndheves server-side
 *
 * Verifiserer at POST /api/chat/image nekter opplasting før journey-dag >= 15
 * (kanonisk isPhotosAllowed) og slipper gjennom etter. Utan denne sjekken
 * kunne klienten laste opp bilder før låsen var opphøyet.
 */

import { NextRequest } from 'next/server';

// Mock før vi importerer rutemodulen.
jest.mock('@/lib/auth/session', () => ({
  getServerSession: jest.fn(),
}));

// jest.mock hoistes over `const`-deklarasjoner, så mock-definisjonene må leve
// inne i factoryen. Vi henter de mockede funksjonene via importet nedenfor.
jest.mock('@/lib/prisma', () => ({
  prisma: {
    conversation: { findUnique: jest.fn() },
    journeyProgress: { findFirst: jest.fn() },
  },
}));

import { getServerSession } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';
import { isPhotosAllowed } from '@/lib/journey/engine';
import { POST } from '@/app/api/chat/image/route';

const session = getServerSession as jest.Mock;
const findUnique = prisma.conversation.findUnique as jest.Mock;
const findFirst = prisma.journeyProgress.findFirst as jest.Mock;

function makeRequest(conversationId: string): NextRequest {
  const fd = new FormData();
  fd.append('file', new File(['x'], 'bilde.jpg', { type: 'image/jpeg' }));
  fd.append('conversationId', conversationId);
  return new NextRequest('http://localhost/api/chat/image', {
    method: 'POST',
    body: fd,
  });
}

describe('M-6: bilde-lås server-side i /api/chat/image', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    session.mockResolvedValue({ user: { id: 'user-a' } });
    // Konversasjon der sender (user-a) er deltaker og som er bundet til en match.
    findUnique.mockResolvedValue({
      id: 'conv-1',
      userAId: 'user-a',
      userBId: 'user-b',
      matchId: 'match-1',
    });
  });

  it('isPhotosAllowed: dag 13 og 14 er låst, dag 15 er åpnet (grensen)', () => {
    expect(isPhotosAllowed(13)).toBe(false);
    expect(isPhotosAllowed(14)).toBe(false);
    expect(isPhotosAllowed(15)).toBe(true);
  });

  it('nekter (423) når journey er på dag 13', async () => {
    findFirst.mockResolvedValue({ day: 13 });
    const res = await POST(makeRequest('conv-1'));
    expect(res.status).toBe(423);
  });

  it('nekter (423) når ingen journey er satt opp', async () => {
    findFirst.mockResolvedValue(null);
    const res = await POST(makeRequest('conv-1'));
    expect(res.status).toBe(423);
  });

  it('slipper gjennom (2xx) når journey er på dag 15', async () => {
    findFirst.mockResolvedValue({ day: 15 });
    const res = await POST(makeRequest('conv-1'));
    expect(res.status).toBeGreaterThanOrEqual(200);
    expect(res.status).toBeLessThan(300);
  });
});