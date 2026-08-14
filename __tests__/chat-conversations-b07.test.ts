/**
 * ToSom — B0.7 Funksjonell verifisering av GET /api/chat/conversations
 *
 * Kjør DET FAKTISKE rutehåndtereren mot reell dev-DB (DATABASE_URL i .env).
 * Kun sesjonen mockes (getServerSession), fordi NextAuth dev-login-flow er en
 * pre-eksisterende feil som er utenfor B0.7-omfanget.
 *
 * Testdata (sett opp i dev-DB):
 *   User id='1' (Erik), User id='999' (Astrid, age 31, identityName 'Astrid')
 *   Match id='b07testmatch' (resonanceLevel STRONG)
 *   Conversation id='b07testconv' (A=1, B=999, preview 'God morgen!', unreadA=2)
 */

// Mock kun sesjonen — alt annet (prisma, ruten) er reelt
jest.mock('@/lib/auth/session', () => ({
  getServerSession: jest.fn(),
  requireNotBanned: jest.fn(),
}));

import { getServerSession } from '@/lib/auth/session';
import { GET } from '@/app/api/chat/conversations/route';

const mockedSession = getServerSession as jest.Mock;

function request(): Request {
  return new Request('http://localhost/api/chat/conversations');
}

describe('GET /api/chat/conversations (B0.7, reell dev-DB)', () => {
  it('returnerer 401 uten sesjon', async () => {
    mockedSession.mockResolvedValueOnce(null);
    const res = await GET(request());
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.success).toBe(false);
  });

  it('returnerer aktiv samtale med korrekt partner-info (bruker id=1)', async () => {
    mockedSession.mockResolvedValueOnce({ user: { id: '1', role: 'USER' } });
    const res = await GET(request());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThanOrEqual(1);

    const conv = body.data.find((c: any) => c.id === 'b07testconv');
    expect(conv).toBeDefined();
    // Motpart (B) er Astrid
    expect(conv.partnerName).toBe('Astrid');
    expect(conv.partnerAge).toBe(31);
    // Resonans STRONG → mood 'joyful' (vises som mood, aldri som tall — I-12)
    expect(conv.mood).toBe('joyful');
    // Uleste for part A (den påloggte, id=1)
    expect(conv.unreadCount).toBe(2);
    // Siste meldingsforhåndsvisning
    expect(conv.lastMessage).toBe('God morgen!');
  });

  it('returnerer samme samtale når pålogget som motpart (bruker id=999), med part-B-uleste', async () => {
    mockedSession.mockResolvedValueOnce({ user: { id: '999', role: 'USER' } });
    const res = await GET(request());
    const body = await res.json();
    const conv = body.data.find((c: any) => c.id === 'b07testconv');
    expect(conv).toBeDefined();
    // Motpart (A) er Erik
    expect(conv.partnerName).toBe('Erik');
    // Uleste for part B
    expect(conv.unreadCount).toBe(0);
  });
});