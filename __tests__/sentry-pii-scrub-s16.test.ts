/**
 * ToSom — S-16: PII-skrubbing i Sentry
 *
 * Verifiserer at den felles scrubPiiEvent-funksjonen:
 *   - fjerner forbudte nøkler (profile, deepProfile, content, email, phone, ...)
 *   - redigerer e-post og telefon i meldinger, exceptions og breadcrumbs
 *   - går rekursivt inn i extra/contexts/request (der DeepProfile typisk ligger)
 *   - eksponerer sendDefaultPii:false
 */

import { scrubPiiEvent, sentryPiiConfig } from '@/lib/observability/pii';

describe('S-16: PII-skrubbing i Sentry', () => {
  it('sletter DeepProfile-objekt fra event.extra (rekursivt)', () => {
    const event = {
      message: 'Feil i matching',
      extra: {
        user: {
          deepProfileData: {
            identityName: 'Fornavn Etternavn',
            personality: 'introvert, sjarmerende',
            values: ['familie', 'trygghet'],
          },
          email: 'bruker@eksempel.no',
        },
        safeKey: 'hold meg',
      },
    };

    const result = scrubPiiEvent(event as any);

    // deepProfileData skal være fjernet helt — ikke engang nøkkelen.
    expect(result.extra.user).toBeDefined();
    expect(result.extra.user).not.toHaveProperty('deepProfileData');
    expect(result.extra.user).not.toHaveProperty('email');
    // Sikre nøkler beholdes.
    expect(result.extra.safeKey).toBe('hold meg');
  });

  it('fjerner topp-nivå-felt "profile" fra eventet', () => {
    const event = {
      message: 'Test',
      profile: { identityName: 'Hemmelig', email: 'x@y.no' },
    };
    const result = scrubPiiEvent(event as any);
    expect(result).not.toHaveProperty('profile');
    expect(result.message).toBe('Test');
  });

  it('redigerer e-post og telefon i event.message', () => {
    const event = { message: 'Kontakt: test@domene.no tel 41234567' };
    const result = scrubPiiEvent(event as any);
    expect(result.message).not.toContain('test@domene.no');
    expect(result.message).not.toContain('41234567');
    expect(result.message).toContain('[redacted]');
  });

  it('redigerer PII i exception.value', () => {
    const event = {
      exception: {
        values: [{ type: 'Error', value: 'Failed for user a@b.co' }],
      },
    };
    const result = scrubPiiEvent(event as any);
    expect(result.exception.values[0].value).not.toContain('a@b.co');
  });

  it('redigerer PII i breadcrumbs', () => {
    const event = {
      breadcrumbs: [{ message: 'Siste melding til k@l.no' }],
    };
    const result = scrubPiiEvent(event as any);
    expect(result.breadcrumbs[0].message).not.toContain('k@l.no');
  });

  it('skruber rekursivt inni contexts (DeepProfile)', () => {
    const event = {
      contexts: {
        conversation: {
          deepProfileData: { content: 'personlig melding', email: 'p@q.no' },
        },
      },
    };
    const result = scrubPiiEvent(event as any);
    expect(result.contexts.conversation).not.toHaveProperty('deepProfileData');
  });

  it('eksponerer sendDefaultPii: false', () => {
    expect(sentryPiiConfig.sendDefaultPii).toBe(false);
  });

  it('beforeSend er den felles scrubPiiEvent-funksjonen', () => {
    const event = { message: 'hei' };
    expect(sentryPiiConfig.beforeSend(event)).toBe(event);
  });

  it('muterer ikke opprinnelig data-objekt (retur av nytt objekt)', () => {
    const original = { deepProfileData: { x: 1 } };
    const event = { extra: { user: original } };
    scrubPiiEvent(event as any);
    // Opprinnelig referanse skal beholde nøkkelen (scrubValue lagr nytt objekt).
    expect(original).toHaveProperty('deepProfileData');
  });
});
