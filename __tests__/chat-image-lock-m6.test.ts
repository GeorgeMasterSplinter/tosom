/**
 * ToSom — M-6: Bilde-lås håndheves server-side
 *
 * Verifiserer at POST /api/chat/image nekter opplasting før journey-dag >= 15
 * (kanonisk isPhotosAllowed) og slipper gjennom etter. Uten denne sjekken
 * kunne klienten laste opp bilder før låsen var opphøyet.
 *
 * (Oppdatert: ruten bruker no lib/storage og knytter bildet til ein
 * Message-rad ved imageKey. M-6-låsen kjører FØR meldingsvalidering, så 423-
 * testa er uendra; suksess-fløten krev no ein gyldig messageId.)
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
    message: { findUnique: jest.fn(), update: jest.fn() },
  },
}));

// Oppbevar dei reelle funksjonane (buildImageKey/assertSafeImageKey),
// mock bare getImageStorage.
jest.mock('@/lib/storage', () => {
  const actual = jest.requireActual('@/lib/storage');
  return {
    ...actual,
    getImageStorage: jest.fn(),
  };
});

import { getServerSession } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';
import { isPhotosAllowed } from '@/lib/journey/engine';
import { getImageStorage, MemoryImageStorage } from '@/lib/storage';
import { POST } from '@/app/api/chat/image/route';

const session = getServerSession as jest.Mock;
const findUnique = prisma.conversation.findUnique as jest.Mock;
const findFirst = prisma.journeyProgress.findFirst as jest.Mock;
const messageFindUnique = prisma.message.findUnique as jest.Mock;
const messageUpdate = prisma.message.update as jest.Mock;
const getStorage = getImageStorage as jest.Mock;

function makeRequest(conversationId: string, messageId?: string): NextRequest {
  const fd = new FormData();
  fd.append('file', new File(['x'], 'bilde.jpg', { type: 'image/jpeg' }));
  fd.append('conversationId', conversationId);
  if (messageId) fd.append('messageId', messageId);
  return new NextRequest('http://localhost/api/chat/image', {
    method: 'POST',
    body: fd,
  });
}

describe('M-6: bilde-lås server-side i /api/chat/image', () => {
  let storage: MemoryImageStorage;

  beforeEach(() => {
    jest.clearAllMocks();
    storage = new MemoryImageStorage();
    getStorage.mockReturnValue(storage);
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
    const res = await POST(makeRequest('conv-1', 'msg-1'));
    expect(res.status).toBe(423);
    // Låsen skal stoppe FØR lagring/meldingsvalidering.
    expect(storage.driver).toBe('memory');
    expect(await storage.exists('conv-1/ikke-lagt-opp.jpg')).toBe(false);
  });

  it('nekter (423) når ingen journey er satt opp', async () => {
    findFirst.mockResolvedValue(null);
    const res = await POST(makeRequest('conv-1', 'msg-1'));
    expect(res.status).toBe(423);
  });

  it('slipper gjennom (2xx) når journey er på dag 15 og melding er gyldig', async () => {
    findFirst.mockResolvedValue({ day: 15 });
    messageFindUnique.mockResolvedValue({
      id: 'msg-1',
      type: 'image',
      imageKey: null,
      senderId: 'user-a',
      conversationId: 'conv-1',
    });
    messageUpdate.mockResolvedValue({ id: 'msg-1' });

    const res = await POST(makeRequest('conv-1', 'msg-1'));
    const body = await res.json();
    expect(res.status).toBeGreaterThanOrEqual(200);
    expect(res.status).toBeLessThan(300);
    // imageUrl peker på side-ruta, aldri en direkte filsti.
    expect(body.imageUrl).toBe('/api/chat/image/msg-1');
    expect(body.imageUrl).not.toContain('/uploads/');
    // imageKey ble knyttet til meldingen.
    expect(messageUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 'msg-1' } })
    );
  });

  it('nekter (400) når messageId mangler (bildet må knyttes til en melding)', async () => {
    findFirst.mockResolvedValue({ day: 15 });
    const res = await POST(makeRequest('conv-1'));
    expect(res.status).toBe(400);
  });

  it('nekter (409) ved idempotens: meldingen har allerede et bilde', async () => {
    findFirst.mockResolvedValue({ day: 15 });
    messageFindUnique.mockResolvedValue({
      id: 'msg-1',
      type: 'image',
      imageKey: 'conv-1/existing.jpg',
      senderId: 'user-a',
      conversationId: 'conv-1',
    });
    const res = await POST(makeRequest('conv-1', 'msg-1'));
    expect(res.status).toBe(409);
  });
});
