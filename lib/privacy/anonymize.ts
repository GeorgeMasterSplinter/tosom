// lib/privacy/anonymize.ts — S-10: Anonymiserings-kjerne for inaktive kontoer.
//
// GDPR: en forlatt konto skal ikke beholde personopplysninger. Denne modulen
// er KJERNEN — den anonymiserer ÉN bruker:
//   1. Fjerner all auth-materiell (session, account, tokens, 2FA) — de kan
//      ikke logge inn igjen.
//   2. Sletter den private Profile (1:1 eid av brukeren).
//   3. Nuller PII på User-radene (email → anonymisert-unikt, name, phone,
//      password) og setter deletedAt.
//   4. Fjerner brukeren fra matching (journeyState IDLE, kø-felt null).
//
// BEHOLD: User-raden selv, MatchHistory, Report og AuditLog — disse refererer
// bruker-ID-er som MÅ overleve (I-13: «Vi fant hverandre» sletter kontoer, men
// historikk/rapporter/anonymisert audit beholdes). Ved å BEHOLDE User-radene
// med anonymisert PII holdes disse FK-integritetene intakte.
//
// Delikate deler SOM IKKE røres her (bevisst, partner-sikkert):
//   - Conversation / Message / Match deler eierskap med motparten å slette dem
//     her ville ødelegge partnerens data som bispresjon av ÉN brukers inaktivitet.
//     Det er en politikkbeslutning som hører hjemme i retention-cronen (neste steg).
//
// Cron-kabling (hvilke brukere, inaktivitetsgrense, forvarsel 30 dager før) er
// et separat neste steg — denne funksjonen er ren, idempotent og enhetstestbar.

import { prisma } from '@/lib/prisma';

export interface AnonymizeResult {
  anonymized: boolean;
  userId: string;
  /** Grunn for hopp (ikke anonymisert): 'not_found' | 'already_deleted'. */
  skipped?: 'not_found' | 'already_deleted';
  /** Antall slettede rader per modell. */
  deleted: Record<string, number>;
}

/** Bygg et anonymisert, unikt e-post fra bruker-ID-en (id er en unik cuid). */
function anonymizedEmail(userId: string): string {
  return `anonymized-${userId}@anonymized.tosom`;
}

/**
 * Anonymiser én brukers konto. Idempotent: en allerede anonymisert (deletedAt
 * satt) bruker hoppes uten feil.
 *
 * Returnerer hva som ble slettet, slik at cron-tilkalleren kan logge og varsle.
 */
export async function anonymizeUser(
  userId: string,
  _reason: string = 'inactivity'
): Promise<AnonymizeResult> {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    return { anonymized: false, userId, skipped: 'not_found', deleted: {} };
  }

  // Idempotens: allerede anonymisert — gjør ingenting.
  if (user.deletedAt) {
    return { anonymized: false, userId, skipped: 'already_deleted', deleted: {} };
  }

  // Opprinnelig e-post trengs for MagicLinkToken (nøkkelt på email).
  const originalEmail = user.email;

  const result = await prisma.$transaction(async (tx) => {
    const deleted: Record<string, number> = {};

    // 1. Auth-materiell — MÅ dø (ingen kan logge inn igjen på den gamle kontoen).
    const sessions = await tx.session.deleteMany({ where: { userId } });
    deleted.Session = (sessions as { count: number }).count ?? 0;

    const accounts = await tx.account.deleteMany({ where: { userId } });
    deleted.Account = (accounts as { count: number }).count ?? 0;

    const resets = await tx.passwordResetToken.deleteMany({ where: { userId } });
    deleted.PasswordResetToken = (resets as { count: number }).count ?? 0;

    const phones = await tx.phoneVerification.deleteMany({ where: { userId } });
    deleted.PhoneVerification = (phones as { count: number }).count ?? 0;

    const magic = await tx.magicLinkToken.deleteMany({ where: { email: originalEmail } });
    deleted.MagicLinkToken = (magic as { count: number }).count ?? 0;

    const two = await tx.twoFactorSecret.deleteMany({ where: { userId } });
    deleted.TwoFactorSecret = (two as { count: number }).count ?? 0;

    const orders = await tx.order.deleteMany({ where: { userId } });
    deleted.Order = (orders as { count: number }).count ?? 0;

    // 2. Notifikasjoner (personlige, 1:1 eid).
    const notifs = await tx.notification.deleteMany({ where: { userId } });
    deleted.Notification = (notifs as { count: number }).count ?? 0;

    // 3. Privat profile (1:1 eid). S-9: Profile har Restrict-FK — slettes eksplisitt.
    await tx.profile.deleteMany({ where: { userId } });
    deleted.Profile = 1;

    // 4. Null PII på User + sett anonymisert-unikt email + fjern fra matching.
    await tx.user.update({
      where: { id: userId },
      data: {
        email: anonymizedEmail(userId),
        name: null,
        phone: null,
        password: null,
        phoneVerified: false,
        verified: false,
        journeyState: 'IDLE',
        matchQueuedAt: null,
        lastMatchAt: null,
        lockedUntil: null,
        deletedAt: new Date(),
      },
    });

    return deleted;
  }, {
    maxWait: 10_000,
    timeout: 30_000,
  });

  return { anonymized: true, userId, deleted: result };
}
