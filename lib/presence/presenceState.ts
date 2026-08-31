/**
 * ToSom — Presence State v2 (DB-basert — Vercel-safe)
 *
 * Erstatte in-memory-versjonen (Steg 1): en Map i funksjonsminnet
 * fungerer ikke på Vercel, der hvert kall har sitt eget isolerte og
 * kortlevde minne — partens get hente aldri den andres set.
 *
 * State ligger nå i User-tabellen:
 *   - lastSeenAt: hjertetikk fra chatsiden (hver ~30 s) → «Online»
 *     mens det siste tikket er under 90 s gammalt.
 *   - typingUntil: mens dette er i fremtid → «Skriver…»
 *
 * Alt er best-effort: presence-feil logges og kommer aldri fram til brukeren.
 */

import { prisma } from '@/lib/prisma';

export type PresenceState = {
  userId: string;
  isOnline: boolean;
  isTyping: boolean;
  lastSeen: number | null; // ms-tidsstempel
};

/** «Online» mens det siste hjertetikket er innenfor dette vinduet */
export const ONLINE_WINDOW_MS = 90 * 1000;
/** Levetid for skrive-flagget (klienten forlenger mens man skriver) */
export const TYPING_TTL_MS = 5000;

/**
 * Hjertetikk — brukeren er i chatten nå.
 */
export async function setOnline(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { lastSeenAt: new Date() },
  });
}

/**
 * Eksplisitt «offline» finnes ikke: mangel på hjertetikk er
 * definisjonen på offline (lastSeenAt faller utenfor vinduet).
 */
export async function setOffline(_userId: string): Promise<void> {
  // no-op — se kommentaren over
}

/**
 * Sett skrive-flagget (utgår etter ttl, forlenges av nye tastetrykk).
 */
export async function setTyping(userId: string, ttlMs: number = TYPING_TTL_MS): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: {
      lastSeenAt: new Date(),
      typingUntil: new Date(Date.now() + ttlMs),
    },
  });
}

/**
 * Rydd skrive-flagget (klienten sender dette etter ~3 s i ro).
 */
export async function clearTyping(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { typingUntil: null },
  });
}

/**
 * Lese presence for en bruker.
 * Returnerer undefined hvis brukeren ikke finnes.
 */
export async function getPresence(userId: string): Promise<PresenceState | undefined> {
  const row = await prisma.user.findUnique({
    where: { id: userId },
    select: { lastSeenAt: true, typingUntil: true },
  });
  if (!row) return undefined;

  const now = Date.now();
  const lastSeen = row.lastSeenAt ? row.lastSeenAt.getTime() : null;
  return {
    userId,
    isOnline: lastSeen !== null && now - lastSeen < ONLINE_WINDOW_MS,
    isTyping: row.typingUntil !== null && row.typingUntil.getTime() > now,
    lastSeen,
  };
}