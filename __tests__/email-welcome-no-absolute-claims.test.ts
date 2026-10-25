/**
 * Tosom — Velkomst-e-post: ingen absolutte «ingen bilder/ingen navn»-påstander (P1-1).
 *
 * P1-1: velkomst-eposten sa «Her er det ingen bilder, ingen navn og ingen
 * overflatelighet» — men bilder åpnes fra dag 8 (M-6) og kallenavn vises i
 * chatten. E-posten skal beskrive det faktiske produktet: ord først, bilder
 * fra dag 8, varsel i appen.
 */

const mockSendMailWelcome = jest.fn().mockResolvedValue({ messageId: 'test' });

jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => ({ sendMail: mockSendMailWelcome })),
}));

describe('sendWelcomeEmail — faktisk produktbeskrivelse (P1-1)', () => {
  beforeEach(() => {
    jest.resetModules();
    mockSendMailWelcome.mockClear();
    process.env.EMAIL_SERVER_HOST = 'smtp.resend.com';
    process.env.EMAIL_SERVER_USER = 'resend';
    process.env.EMAIL_SERVER_PASSWORD = 'test-key';
    process.env.EMAIL_SERVER_PORT = '587';
    delete process.env.EMAIL_FROM;
  });

  it('inneholder ikke «ingen bilder»/«ingen navn» og nevner bilder fra dag 8 + varsel i appen', async () => {
    const { sendWelcomeEmail } = await import('@/lib/email');
    const res = await sendWelcomeEmail('hei@tosom.no', 'Asta');
    expect(res.success).toBe(true);
    const arg = mockSendMailWelcome.mock.calls[0][0];
    expect(arg.text).not.toContain('ingen bilder');
    expect(arg.text).not.toContain('ingen navn');
    expect(arg.text).toContain('dag 8');
    expect(arg.text).toContain('i appen');
  });
});
