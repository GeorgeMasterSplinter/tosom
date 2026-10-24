/**
 * ToSom — «Reisen er avsluttet»-epost til partneren (sendJourneyEndedEmail).
 *
 * Nøytral, konkret, empatisk — sendes til den andre parten når reisen tar
 * slutt midt i. Verifiserer avsender, mottaker, emne og at eposten
 * IKKE avslører hvem som avsluttet/blokkerte.
 */

const mockSendMailEnded = jest.fn().mockResolvedValue({ messageId: 'test' });

jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => ({ sendMail: mockSendMailEnded })),
}));

describe('sendJourneyEndedEmail', () => {
  beforeEach(() => {
    jest.resetModules();
    mockSendMailEnded.mockClear();
    process.env.EMAIL_SERVER_HOST = 'smtp.resend.com';
    process.env.EMAIL_SERVER_USER = 'resend';
    process.env.EMAIL_SERVER_PASSWORD = 'test-key';
    process.env.EMAIL_SERVER_PORT = '587';
    delete process.env.EMAIL_FROM;
  });

  it('sender nøytral e-post med navn', async () => {
    const { sendJourneyEndedEmail } = await import('@/lib/email');
    const res = await sendJourneyEndedEmail('partner@tosom.no', 'Berg');
    expect(res.success).toBe(true);
    expect(mockSendMailEnded).toHaveBeenCalledTimes(1);
    const arg = mockSendMailEnded.mock.calls[0][0];
    expect(arg.to).toBe('partner@tosom.no');
    expect(arg.from).toBe('Tosom <noreplay@tosom.no>');
    expect(arg.subject).toBe('Reisen er avsluttet');
    expect(arg.text).toContain('Berg');
    expect(arg.text).toContain('slettet');
  });

  it('bruker standardhilsn uten navn', async () => {
    const { sendJourneyEndedEmail } = await import('@/lib/email');
    await sendJourneyEndedEmail('partner@tosom.no');
    const arg = mockSendMailEnded.mock.calls[0][0];
    expect(arg.text).toContain('hei');
  });

  it('avslører ikke blokkering eller hvem som avsluttet', async () => {
    const { sendJourneyEndedEmail } = await import('@/lib/email');
    await sendJourneyEndedEmail('partner@tosom.no', 'Berg');
    const arg = mockSendMailEnded.mock.calls[0][0];
    const combined = `${arg.subject} ${arg.text} ${arg.html}`.toLowerCase();
    expect(combined).not.toContain('blokk');
    expect(combined).not.toContain('sperre');
    expect(combined).not.toContain('rapport');
  });

  it('returnerer feil (og sender ikke) når e-post ikke er konfigurert', async () => {
    delete process.env.EMAIL_SERVER_HOST;
    const { sendJourneyEndedEmail } = await import('@/lib/email');
    const res = await sendJourneyEndedEmail('partner@tosom.no');
    expect(res.success).toBe(false);
    expect(mockSendMailEnded).not.toHaveBeenCalled();
  });
});
