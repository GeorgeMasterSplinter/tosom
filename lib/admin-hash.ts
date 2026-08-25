import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';

/**
 * B-5 — Admin-passord som hash (scrypt + salt), ikke klartext.
 *
 * Samme stil som lib/auth/reset.ts (scrypt, innebygd i Node — ingen ny avheng).
 * ADMIN_PASSWORD_HASH ligger i env som `salt:hexhash` (32-byte scrypt-nøkkel).
 * Alle sjekker feiler LUKKA: mangler / feil format / feil passord → false.
 */

/** Hasher et passord til `salt:hash` (scrypt, 16-byte salt, 32-byte nøkkel). */
export function hashAdminPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 32).toString('hex');
  return `${salt}:${hash}`;
}

/** Henter ADMIN_PASSWORD_HASH fra env (null om ikke satt eller blank). */
export function loadAdminPasswordHash(): string | null {
  const h = process.env.ADMIN_PASSWORD_HASH;
  return h && h.trim().length > 0 ? h : null;
}

/**
 * Timing-safe sjekk av et passord mot en lagret `salt:hash`.
 * Returnerer false hvis hasjen mangler, har galt format eller ikke stemmer.
 */
export function verifyAdminPassword(password: string, storedHash: string | null): boolean {
  if (!storedHash) return false;
  const sep = storedHash.indexOf(':');
  if (sep <= 0 || sep === storedHash.length - 1) return false;
  const salt = storedHash.slice(0, sep);
  const hash = storedHash.slice(sep + 1);
  try {
    const inputHash = scryptSync(password, salt, 32).toString('hex');
    return timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(inputHash, 'hex'));
  } catch {
    return false;
  }
}

/**
 * Timing-safe sammenligning av to strenger (brukes for e-post).
 * Returnerer false hvis lengdene er ulike (constant-time når de er like).
 */
export function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}
