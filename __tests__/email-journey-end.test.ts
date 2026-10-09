/**
 * ToSom — «Reisen er slutt»-e-post (sendJourneyEndEmail).
 *
 * De to utfallene som sletter kontoene: found_each_other (gratulerende) og
 * no_action (dag 30, nøytral). Verifiserer avsender, mottaker, emne og tekst.
 */

const mockSendMail = jest.fn().mockResolvedValue({ messageId: 'test' });

jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => ({ sendMail: mockSendMail })),
}));

describe('sendJourneyEndEmail', () => {
  beforeEach(() => {
    jest.resetModules();
    mockSendMail.mockClear();
    process.env.EMAIL_SERVER_HOST = 'smtp.resend.com';
    process.env.EMAIL_SERVER_USER = 'resend';
    process.env.EMAIL_SERVER_PASSWORD = 'test-key';
    process.env.EMAIL_SERVER_PORT = '587';
    delete process.env.EMAIL_FROM;
  });

  it('sender gratulerende e-post ved found_each_other', async () => {
    const { sendJourneyEndEmail } = await import('@/lib/email');
    const res = await sendJourneyEndEmail('hei@tosom.no', 'Asta', true);
    expect(res.success).toBe(true);
    expect(mockSendMail).toHaveBeenCalledTimes(1);
    const arg = mockSendMail.mock.calls[0][0];
    expect(arg.to).toBe('hei@tosom.no');
    expect(arg.from).toBe('ToSom <noreplay@tosom.no>');
    expect(arg.subject).toBe('Gratulerer — reisen er fullført');
    expect(arg.text).toContain('Asta');
    expect(arg.text).toContain('slettet alt');
  });

  it('sender nøytral e-post ved no_action (dag 30)', async () => {
    const { sendJourneyEndEmail } = await import('@/lib/email');
    const res = await sendJourneyEndEmail('hei@tosom.no');
    expect(res.success).toBe(true);
    expect(mockSendMail).toHaveBeenCalledTimes(1);
    const arg = mockSendMail.mock.calls[0][0];
    expect(arg.subject).toBe('Reisen er fullført');
    expect(arg.text).toContain('hei'); // standard hilsen uten navn
    expect(arg.text).toContain('30 dagene');
  });

  it('returnerer feil (og sender ikke) når e-post ikke er konfigurert', async () => {
    delete process.env.EMAIL_SERVER_HOST;
    const { sendJourneyEndEmail } = await import('@/lib/email');
    const res = await sendJourneyEndEmail('hei@tosom.no', 'Asta');
    expect(res.success).toBe(false);
    expect(mockSendMail).not.toHaveBeenCalled();
  });
});
