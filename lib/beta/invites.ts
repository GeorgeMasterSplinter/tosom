/**
 * Tosom — Invitasjonsport (BETA-ACCESS §3)
 *
 * «Adressen er nøkkelen.» Kun e-poster som ligger i BetaInvite-tabellen
 * får magic link sendt. Ingen invitasjonskoder, ingen lenker som lekker.
 *
 * Brukes både i request-endepunktet (primær gate, gir rolig 404) og som
 * forsvarsdybde i sendVerificationRequest (sender aldri til ikke-inviterte).
 */

import { prisma } from '@/lib/prisma';

/** Normaliser e-post for oppslag (lowercase, trim). */
export function normalizeEmail(email: string): string {
  return (email || '').trim().toLowerCase();
}

/** Er e-posten invitert (uansett om den er tatt i bruk ennå)? */
export async function isInvitedEmail(email: string): Promise<boolean> {
  const norm = normalizeEmail(email);
  if (!norm) return false;
  const invite = await prisma.betaInvite.findUnique({
    where: { email: norm },
    select: { id: true },
  });
  return invite !== null;
}

/** Merk invitasjonen som brukt (idempotent). Feiler aldri — best effort. */
export async function markInviteUsed(email: string): Promise<void> {
  const norm = normalizeEmail(email);
  if (!norm) return;
  await prisma.betaInvite
    .update({
      where: { email: norm },
      data: { usedAt: new Date() },
    })
    .catch(() => {
      /* ingen invitasjon å merke — ignorer */
    });
}
