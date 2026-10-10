/**
 * ToSom — E-postmodul (B-2)
 *
 * Én modul for all e-post. Leser EMAIL_SERVER_* (de som allerede står i
 * env-filene) og sender via nodemailer — fungerer mot Resend SMTP
 * (smtp.resend.com, API-nøkkelen som passord) eller annen SMTP-leverandør.
 *
 * Avsender: noreplay@tosom.no (autosvar er satt opp på denne).
 * Support: support@tosom.no.
 *
 * E-poster: driftsvarsel (alltid), match (bak BETA_MATCH_EMAIL), velkomst
 * (fullført onboarding), reise slutt (dag 30 / fant hverandre), passord-reset
 * og sletting-bekreftelse. Ingen e-postverifisering. Bevisst.
 */

import type { Transporter } from 'nodemailer';

export interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export interface EmailResult {
  success: boolean;
  error?: string;
}

/**
 * Hent konfigurert transporter (lat initialisering — unngår build-feil).
 * Returnerer null hvis konfigurasjon mangler. Feilede forsøk caches ikke —
 * neste sending prøver på nytt (serverless: en varm container skal ikke
 * giftes av én transient feil).
 */
let cachedTransporter: Transporter | null = null;

async function getTransporter(): Promise<Transporter | null> {
  if (cachedTransporter) return cachedTransporter;

  try {
    const host = process.env.EMAIL_SERVER_HOST;
    const user = process.env.EMAIL_SERVER_USER;
    const password = process.env.EMAIL_SERVER_PASSWORD;

    if (!host || !user || !password) {
      console.warn('[email] EMAIL_SERVER_* ikke konfigurert — e-post sendes ikke');
      return null;
    }

    // Hosten må være et rent hostname: nodemailer resoluterer hele
    // strengen, så «https://smtp.resend.com» gir DNS-feil (getaddrinfo
    // EBUSY). 11.10: nøyaktig feilen i prod. Normaliser og varsel.
    const normalizedHost = host.replace(/^[a-z]+:\/\//i, '').replace(/\/+$/, '');
    if (normalizedHost !== host) {
      console.warn(
        `[email] EMAIL_SERVER_HOST er «${host}» — skal være «${normalizedHost}» uten protokoll. Rett verdien i Vercel.`
      );
    }

    const nodemailer = await import('nodemailer');
    cachedTransporter = nodemailer.createTransport({
      host: normalizedHost,
      port: parseInt(process.env.EMAIL_SERVER_PORT || '587', 10),
      secure: process.env.EMAIL_SERVER_PORT === '465',
      auth: { user, pass: password },
    });
    return cachedTransporter;
  } catch (err) {
    console.error('[email] Kunne ikke opprette transporter:', err);
    return null;
  }
}

/** Hent avsenderadresse fra env (standard: ToSom <noreplay@tosom.no>) */
function getFromAddress(): string {
  return process.env.EMAIL_FROM || 'ToSom <noreplay@tosom.no>';
}

/**
 * Send en e-post. Returnerer alltid — kaster aldri.
 * Feil logges og returneres som { success: false, error }.
 */
export async function sendEmail(options: EmailOptions): Promise<EmailResult> {
  try {
    const transporter = await getTransporter();
    if (!transporter) {
      return { success: false, error: 'E-post ikke konfigurert' };
    }

    await transporter.sendMail({
      from: getFromAddress(),
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[email] Sending feilet:', message);
    return { success: false, error: message };
  }
}

/**
 * Send driftsvarsel til operatør.
 * Krever ALERT_EMAIL_TO i env. Brukes av lib/observability/alert.ts.
 */
export async function sendAlertEmail(
  to: string,
  severity: string,
  title: string,
  detail: string,
  timestamp: string
): Promise<EmailResult> {
  return sendEmail({
    to,
    subject: `[ToSom ${severity.toUpperCase()}] ${title}`,
    text: `${title}\n\n${detail}\n\nTid: ${timestamp}`,
  });
}

/**
 * Send match-varsel til bruker («Du har fått en kobling»).
 * Bak flagget BETA_MATCH_EMAIL — se config/features.ts.
 *
 * Invariant I-4 sier «ingen push/e-post/SMS ved match». Beta tester
 * hypotesen: første runde uten (måler organisk oppdagelse), deretter på.
 */
export async function sendMatchEmail(
  userEmail: string,
  appUrl?: string
): Promise<EmailResult> {
  const url = appUrl || process.env.NEXT_PUBLIC_APP_URL || 'https://tosom.no';

  return sendEmail({
    to: userEmail,
    subject: 'Du har fått en kobling',
    text: `Hei,

Du har fått en kobling på Tosom. Logg inn og se hvem.

${url}

Ro, varme og én reise av gangen.

— Tosom`,
    html: `
      <div style="font-family: Inter, -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #0A1A2A; color: #ffffff; border-radius: 16px;">
        <h1 style="font-size: 24px; font-weight: 600; color: #D4AF37; margin-bottom: 16px;">Du har fått en kobling</h1>
        <p style="font-size: 16px; line-height: 1.7; color: rgba(255,255,255,0.8); margin-bottom: 24px;">
          Logg inn og se hvem. Reisen deres venter.
        </p>
        <a href="${url}/login" style="display: inline-block; padding: 14px 28px; background: #D4AF37; color: #0A1A2A; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px;">
          Logg inn
        </a>
        <p style="font-size: 14px; line-height: 1.7; color: rgba(255,255,255,0.5); margin-top: 32px;">
          Ro, varme og én reise av gangen.<br />— Tosom
        </p>
      </div>
    `,
  });
}
/**
 * Send velkomst-e-post ved registrering.
 * Enkelt, varmt, ingen CTA — de er allerede inne.
 */
export async function sendWelcomeEmail(
  userEmail: string,
  userName?: string
): Promise<EmailResult> {
  const name = userName || 'hei';

  return sendEmail({
    to: userEmail,
    subject: 'Velkommen til ToSom',
    text: `Hei ${name},\n\nVelkommen til ToSom.\n\nHer er det ingen bilder, ingen navn og ingen overflatelighet. Bare ord, tid og én reise av gangen — 30 dager.\n\nNår systemet finner en passende person for deg, vil du få en e-post. Da starter reisen.\n\nTa deg tid til å svare ærligt på spørsmålene. Det er det som gir de beste koblingene.\n\nRo, varme og én reise av gangen.\n\n— ToSom`,
    html: `
      <div style="font-family: Inter, -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #0A1A2A; color: #ffffff; border-radius: 16px;">
        <h1 style="font-size: 24px; font-weight: 600; color: #D4AF37; margin-bottom: 16px;">Velkommen til ToSom</h1>
        <p style="font-size: 16px; line-height: 1.7; color: rgba(255,255,255,0.8); margin-bottom: 16px;">Hei ${name},</p>
        <p style="font-size: 16px; line-height: 1.7; color: rgba(255,255,255,0.8); margin-bottom: 16px;">
          Her er det ingen bilder, ingen navn og ingen overflatelighet. Bare ord, tid og én reise av gangen — 30 dager.
        </p>
        <p style="font-size: 16px; line-height: 1.7; color: rgba(255,255,255,0.8); margin-bottom: 16px;">
          Når systemet finner en passende person for deg, vil du få en e-post. Da starter reisen.
        </p>
        <p style="font-size: 16px; line-height: 1.7; color: rgba(255,255,255,0.8); margin-bottom: 16px;">
          Ta deg tid til å svare ærligt på spørsmålene. Det er det som gir de beste koblingene.
        </p>
        <p style="font-size: 14px; line-height: 1.7; color: rgba(255,255,255,0.5); margin-top: 32px;">
          Ro, varme og én reise av gangen.<br />— ToSom
        </p>
      </div>
    `,
  });
}

/**
 * PL-07a: Send passord-tilbakestillings-e-post.
 * Rolig tekst; lenken er gyldig i én time.
 * Tokenet ligger i lenken — den logges aldri (systemaudit 03.09, funn 2).
 */
export async function sendPasswordResetEmail(
  to: string,
  resetLink: string
): Promise<EmailResult> {
  return sendEmail({
    to,
    subject: 'Tilbakestill passordet ditt på ToSom',
    text: `Hei,\n\nVi mottok en forespørsel om å tilbakestille passordet på kontoen din.\n\nTrykk på lenken under for å velge et nytt passord. Lenken er gyldig i én time.\n\n${resetLink}\n\nHvis det var deg som ba om dette, trykker du på lenken. Hvis det ikke var deg, beholder du denne e-posten — passordet ditt er uendret.\n\nRo, varme og én reise av gangen.\n\n— ToSom`,
    html: `
      <div style="font-family: Inter, -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #0A1A2A; color: #ffffff; border-radius: 16px;">
        <h1 style="font-size: 24px; font-weight: 600; color: #D4AF37; margin-bottom: 16px;">Tilbakestill passordet ditt</h1>
        <p style="font-size: 16px; line-height: 1.7; color: rgba(255,255,255,0.8); margin-bottom: 16px;">
          Vi mottok en forespørsel om å tilbakestille passordet på kontoen din. Lenken er gyldig i én time.
        </p>
        <a href="${resetLink}" style="display: inline-block; padding: 14px 28px; background: #D4AF37; color: #0A1A2A; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px;">
          Velg nytt passord
        </a>
        <p style="font-size: 14px; line-height: 1.7; color: rgba(255,255,255,0.5); margin-top: 32px;">
          Hvis det ikke var deg, beholder du denne e-posten — passordet ditt er uendret.<br />
          Ro, varme og én reise av gangen.<br />— ToSom
        </p>
      </div>
    `,
  });
}

/**
 * Send «reisen er slutt»-e-post ved fullført reise (dag 30) eller når brukerne
 * fant hverandre. Takk + bekrefter at alle data er slettet (GDPR art. 17).
 *
 * foundEachOther: gratulerende variant (de ble en ekte kontakt).
 * Ellers: nøytral «reisen er fullført»-variant.
 */
export async function sendJourneyEndEmail(
  userEmail: string,
  userName?: string,
  foundEachOther?: boolean
): Promise<EmailResult> {
  const name = userName || 'hei';
  const opening = foundEachOther
    ? 'Gratulerer — dere fant hverandre. Nettopp det er det ToSom er laget for.'
    : 'De 30 dagene sammen er fullført. Takk for at du var med på reisen.';
  const closing = foundEachOther
    ? 'Lykke videre — sammen, i det virkelige liv.'
    : 'Hvis du noen gang ønsker en ny reise, kan du registrere deg på nytt.';

  return sendEmail({
    to: userEmail,
    subject: foundEachOther ? 'Gratulerer — reisen er fullført' : 'Reisen er fullført',
    text:
      `Hei ${name},\n\n` +
      `${opening}\n\n` +
      `Som lovet har vi nå slettet alt: samtalene, bildene og svarene er borte. Vi har ikke lagret noe.\n\n` +
      `${closing}\n\n` +
      `Ro, varme og én reise av gangen.\n\n— ToSom`,
    html: `
      <div style="font-family: Inter, -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #0A1A2A; color: #ffffff; border-radius: 16px;">
        <h1 style="font-size: 24px; font-weight: 600; color: #D4AF37; margin-bottom: 16px;">${foundEachOther ? 'Dere fant hverandre' : 'Reisen er fullført'}</h1>
        <p style="font-size: 16px; line-height: 1.7; color: rgba(255,255,255,0.8); margin-bottom: 16px;">Hei ${name},</p>
        <p style="font-size: 16px; line-height: 1.7; color: rgba(255,255,255,0.8); margin-bottom: 16px;">${opening}</p>
        <p style="font-size: 16px; line-height: 1.7; color: rgba(255,255,255,0.8); margin-bottom: 16px;">
          Som lovet har vi nå slettet alt: samtalene, bildene og svarene er borte. Vi har ikke lagret noe.
        </p>
        <p style="font-size: 16px; line-height: 1.7; color: rgba(255,255,255,0.8); margin-bottom: 24px; font-weight: 500;">${closing}</p>
        <p style="font-size: 14px; line-height: 1.7; color: rgba(255,255,255,0.5); margin-top: 32px;">
          Ro, varme og én reise av gangen.<br />— ToSom
        </p>
      </div>
    `,
  });
}

/**
 * Send bekreftelse ved kontosletting.
 * Siste ord fra ToSom.
 */
export async function sendDeletionConfirmationEmail(
  userEmail: string,
  userName?: string
): Promise<EmailResult> {
  const name = userName || 'hei';

  return sendEmail({
    to: userEmail,
    subject: 'Din ToSom-konto er slettet',
    text: `Hei ${name},\n\nDin ToSom-konto og all data er nå permanent slettet.\n\nIngen samtalinger, ingen bilder, ingen spørsmålssvar — alt er borte. Vi har ikke lagret noe.\n\nHvis du noen gang ønsker å komme tilbake, kan du registrere deg på nytt.\n\nHa det godt.\n\n— ToSom`,
    html: `
      <div style="font-family: Inter, -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #0A1A2A; color: #ffffff; border-radius: 16px;">
        <h1 style="font-size: 24px; font-weight: 600; color: #D4AF37; margin-bottom: 16px;">Kontoen er slettet</h1>
        <p style="font-size: 16px; line-height: 1.7; color: rgba(255,255,255,0.8); margin-bottom: 16px;">Hei ${name},</p>
        <p style="font-size: 16px; line-height: 1.7; color: rgba(255,255,255,0.8); margin-bottom: 16px;">
          Din ToSom-konto og all data er nå permanent slettet. Ingen samtalinger, ingen bilder, ingen spørsmålssvar — alt er borte.
        </p>
        <p style="font-size: 16px; line-height: 1.7; color: rgba(255,255,255,0.8); margin-bottom: 16px;">
          Hvis du noen gang ønsker å komme tilbake, kan du registrere deg på nytt.
        </p>
        <p style="font-size: 16px; line-height: 1.7; color: rgba(255,255,255,0.8); margin-bottom: 24px; font-weight: 500;">
          Ha det godt.
        </p>
        <p style="font-size: 14px; line-height: 1.7; color: rgba(255,255,255,0.5); margin-top: 32px;">
          Ro, varme og én reise av gangen.<br />— ToSom
        </p>
      </div>
    `,
  });
}
