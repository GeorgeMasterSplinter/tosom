/**
 * ToSom — E-posttransport (lib/email getTransporter).
 *
 * Låser oppførselen etter prod-feilen 11.10 (admin-e-posttest):
 * 1. EMAIL_SERVER_HOST med protokoll («https://smtp.resend.com») ga
 *    getaddrinfo EBUSY — nodemailer resoluterer hele strengen. Koden
 *    normaliserer hosten og sender likevel, med varsel i loggen.
 * 2. Feilede initialiseringer caches ikke — neste sending prøver på nytt
 *    (en varm serverless-container skal ikke giftes av én feil).
 * 3. Manglende konfig returnerer feil, og neste forsøk prøver likevel.
 */

const mockTransportSendMail = jest.fn().mockResolvedValue({ messageId: 'test' });
const mockCreateTransport = jest.fn((_opts: unknown) => ({ sendMail: mockTransportSendMail }));

jest.mock('nodemailer', () => ({
  createTransport: (opts: unknown) => mockCreateTransport(opts),
}));

const EMAIL = { to: 'hei@tosom.no', subject: 'Test', text: 'Hei' };

describe('getTransporter (lib/email)', () => {
  beforeEach(() => {
    jest.resetModules();
    mockTransportSendMail.mockClear();
    mockCreateTransport.mockClear();
    mockCreateTransport.mockImplementation(() => ({ sendMail: mockTransportSendMail }));
    process.env.EMAIL_SERVER_HOST = 'smtp.resend.com';
    process.env.EMAIL_SERVER_USER = 'resend';
    process.env.EMAIL_SERVER_PASSWORD = 'test-key';
    process.env.EMAIL_SERVER_PORT = '587';
  });

  it('normaliserer EMAIL_SERVER_HOST med protokoll (prod-feil 11.10)', async () => {
    process.env.EMAIL_SERVER_HOST = 'https://smtp.resend.com';
    const { sendEmail } = await import('@/lib/email');
    const res = await sendEmail(EMAIL);
    expect(res.success).toBe(true);
    expect(mockCreateTransport).toHaveBeenCalledWith(
      expect.objectContaining({ host: 'smtp.resend.com' })
    );
  });

  it('normaliserer også avsluttende skråstrek', async () => {
    process.env.EMAIL_SERVER_HOST = 'smtps://smtp.resend.com/';
    const { sendEmail } = await import('@/lib/email');
    const res = await sendEmail(EMAIL);
    expect(res.success).toBe(true);
    expect(mockCreateTransport).toHaveBeenCalledWith(
      expect.objectContaining({ host: 'smtp.resend.com' })
    );
  });

  it('feilet initialisering blokkerer ikke neste forsøk', async () => {
    mockCreateTransport.mockImplementationOnce(() => {
      throw new Error('boom');
    });
    const { sendEmail } = await import('@/lib/email');
    const first = await sendEmail(EMAIL);
    expect(first.success).toBe(false);
    const second = await sendEmail(EMAIL);
    expect(second.success).toBe(true);
    expect(mockTransportSendMail).toHaveBeenCalledTimes(1);
  });

  it('manglende konfig returnerer feil, og neste forsøk prøver likevel', async () => {
    delete process.env.EMAIL_SERVER_HOST;
    const { sendEmail } = await import('@/lib/email');
    const first = await sendEmail(EMAIL);
    expect(first.success).toBe(false);
    expect(mockCreateTransport).not.toHaveBeenCalled();

    process.env.EMAIL_SERVER_HOST = 'smtp.resend.com';
    const second = await sendEmail(EMAIL);
    expect(second.success).toBe(true);
  });
});
