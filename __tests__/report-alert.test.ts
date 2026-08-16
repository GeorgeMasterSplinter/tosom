/**
 * ToSom — Report Alert Tests (v11 steg 2.4)
 *
 * Verifiserer at:
 * 1. Rapport lagres selv om sendAlert feiler
 * 2. Varselet inneholder kategori + ID-er, MEN IKKE fritekstbeskrivelsen
 * 3. Fehåndtering: try/catch rundt sendAlert-kallet
 */

// Mocks
jest.mock('@/lib/prisma', () => ({
  prisma: {
    match: { findFirst: jest.fn() },
    matchHistory: { findFirst: jest.fn() },
    report: { create: jest.fn() },
  },
}));

jest.mock('@/lib/auth/requireAuth', () => ({
  requireAuth: jest.fn(),
}));

const mockSendAlert = jest.fn();
jest.mock('@/lib/observability/alert', () => ({
  sendAlert: (...args: any[]) => mockSendAlert(...args),
}));

import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth/requireAuth';
import { sendAlert } from '@/lib/observability/alert';

const mockPrisma = prisma as jest.Mocked<typeof prisma>;
const mockRequireAuth = requireAuth as jest.MockedFunction<typeof requireAuth>;

// Simpler NextRequest/NextResponse for unit testing
function makeRequest(body: object): Request {
  return new Request('http://localhost/api/report', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('Report Alert — lagring lykkes selv om varsling feiler', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Standard: auth succeeds, match exists, report creates successfully
    mockRequireAuth.mockResolvedValue({
      user: { id: 'user-123', role: 'USER', email: 'test@test.no' },
    } as any);

    (mockPrisma.match.findFirst as jest.Mock).mockResolvedValue({
      id: 'match-456',
      status: 'active',
      userAId: 'user-123',
      userBId: 'user-789',
    });

    (mockPrisma.matchHistory.findFirst as jest.Mock).mockResolvedValue(null);

    (mockPrisma.report.create as jest.Mock).mockResolvedValue({
      id: 'report-001',
      reporterId: 'user-123',
      reportedId: 'user-789',
      matchId: 'match-456',
      category: 'HARASSMENT',
      description: 'Sensitive text that should NOT be in the alert',
      createdAt: new Date(),
    });

    mockSendAlert.mockResolvedValue(undefined);
  });

  it('skal lagre rapporten og returnere 201 selv om sendAlert kaster', async () => {
    // Import the handler dynamically after mocks are set up
    const { POST } = await import('../app/api/report/route');

    // Make sendAlert throw — simulating email/webhook failure
    mockSendAlert.mockRejectedValueOnce(new Error('SMTP connection refused'));

    const req = makeRequest({
      reportedId: 'user-789',
      category: 'HARASSMENT',
      description: 'Sensitive text that should NOT be in the alert',
    });

    const res = await POST(req as any);

    // Report should still be created
    expect(mockPrisma.report.create).toHaveBeenCalled();

    // Response should be success (201), not 500
    const status = (res as any).status;
    expect(status).toBe(201);

    // Alert was attempted
    expect(mockSendAlert).toHaveBeenCalled();
  });

  it('skal IKKE inkludere beskrivelsen i varet', async () => {
    const { POST } = await import('../app/api/report/route');

    const req = makeRequest({
      reportedId: 'user-789',
      category: 'SPAM',
      description: 'TOP SECRET — should never appear in email',
    });

    await POST(req as any);

    expect(mockSendAlert).toHaveBeenCalledWith(
      'warning',
      'Ny rapport mottatt',
      expect.not.stringContaining('TOP SECRET')
    );

    // But the category IS included
    const detailArg = mockSendAlert.mock.calls[0][2] as string;
    expect(detailArg).toContain('SPAM');
  });

  it('skal inkludere kategori og ID-er i varet', async () => {
    const { POST } = await import('../app/api/report/route');

    const req = makeRequest({
      reportedId: 'user-789',
      category: 'FAKE_PROFILE',
    });

    await POST(req as any);

    const detailArg = mockSendAlert.mock.calls[0][2] as string;
    expect(detailArg).toContain('FAKE_PROFILE');
    expect(detailArg).toContain('report-001');
    expect(detailArg).toContain('user-123');
    expect(detailArg).toContain('user-789');
  });
});