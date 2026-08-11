/**
 * ToSom — Telefonverifisering rate limiting
 * 
 * Enkel in-memory rate limiter med per-telefon og per-IP begrensning.
 * - Maksimalt 3 sende-forsøk per telefonnummer per time
 * - Maksimalt 5 verifiserings-forsøk per telefonnummer per 10 minutter (lockout)
 * - Maksimalt 10 kall per IP per time
 */

// In-memory map for rate limiting (i prod bør dette være Redis)
const sendAttempts = new Map<string, { count: number; resetAt: number }>();
const verifyAttempts = new Map<string, { count: number; lockoutUntil: number }>();
const ipAttempts = new Map<string, { count: number; resetAt: number }>();

const SEND_MAX = 3;
const SEND_WINDOW_MS = 60 * 60 * 1000; // 1 time
const VERIFY_MAX = 5;
const VERIFY_WINDOW_MS = 10 * 60 * 1000; // 10 minutter
const VERIFY_LOCKOUT_MS = 30 * 60 * 1000; // 30 minutter lockout etter max forsøk
const IP_MAX = 10;
const IP_WINDOW_MS = 60 * 60 * 1000; // 1 time

/**
 * Sjekk rate limit for SMS-sending.
 * Returnerer { allowed: boolean, retryAfter?: number }
 */
export function checkSendRateLimit(phone: string, ip?: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();

  // Per-telefon sjekk
  const phoneKey = `send:${phone}`;
  const phoneEntry = sendAttempts.get(phoneKey);
  if (phoneEntry) {
    if (now < phoneEntry.resetAt) {
      if (phoneEntry.count >= SEND_MAX) {
        return { allowed: false, retryAfter: Math.ceil((phoneEntry.resetAt - now) / 1000) };
      }
      phoneEntry.count++;
      return { allowed: true };
    }
    // Vindu utløpt — nullstill
    sendAttempts.set(phoneKey, { count: 1, resetAt: now + SEND_WINDOW_MS });
  } else {
    sendAttempts.set(phoneKey, { count: 1, resetAt: now + SEND_WINDOW_MS });
  }

  // Per-IP sjekk
  if (ip) {
    const ipEntry = ipAttempts.get(ip);
    if (ipEntry) {
      if (now < ipEntry.resetAt) {
        if (ipEntry.count >= IP_MAX) {
          return { allowed: false, retryAfter: Math.ceil((ipEntry.resetAt - now) / 1000) };
        }
        ipEntry.count++;
        return { allowed: true };
      }
      ipAttempts.set(ip, { count: 1, resetAt: now + IP_WINDOW_MS });
    } else {
      ipAttempts.set(ip, { count: 1, resetAt: now + IP_WINDOW_MS });
    }
  }

  // Opprydding av gamle oppføringer (hver 1000. kall)
  if (sendAttempts.size > 1000) {
    cleanup(sendAttempts, SEND_WINDOW_MS);
  }

  return { allowed: true };
}

/**
 * Sjekk rate limit for kode-verifisering med lockout.
 * Returnerer { allowed: boolean, retryAfter?: number, lockedOut?: boolean }
 */
export function checkVerifyRateLimit(phone: string): { allowed: boolean; retryAfter?: number; lockedOut?: boolean } {
  const now = Date.now();

  const key = `verify:${phone}`;
  const entry = verifyAttempts.get(key);

  if (entry) {
    // Er låst ut?
    if (now < entry.lockoutUntil) {
      return { allowed: false, retryAfter: Math.ceil((entry.lockoutUntil - now) / 1000), lockedOut: true };
    }

    // Innfor vinduet?
    if (now < entry.lockoutUntil - VERIFY_LOCKOUT_MS + VERIFY_WINDOW_MS) {
      entry.count++;
      if (entry.count >= VERIFY_MAX) {
        // Lås ut
        entry.lockoutUntil = now + VERIFY_LOCKOUT_MS;
        return { allowed: false, retryAfter: VERIFY_LOCKOUT_MS / 1000, lockedOut: true };
      }
      return { allowed: true };
    }

    // Vindu utløpt — nullstill
    verifyAttempts.set(key, { count: 1, lockoutUntil: now + VERIFY_WINDOW_MS + VERIFY_LOCKOUT_MS });
  } else {
    verifyAttempts.set(key, { count: 1, lockoutUntil: now + VERIFY_WINDOW_MS + VERIFY_LOCKOUT_MS });
  }

  // Opprydding
  if (verifyAttempts.size > 500) {
    cleanup(verifyAttempts, VERIFY_WINDOW_MS + VERIFY_LOCKOUT_MS);
  }

  return { allowed: true };
}

function cleanup(map: Map<string, { count: number; resetAt?: number; lockoutUntil?: number }>, windowMs: number) {
  const now = Date.now();
  for (const [key, entry] of map.entries()) {
    const expiry = entry.resetAt || entry.lockoutUntil || 0;
    if (now > expiry + windowMs) {
      map.delete(key);
    }
  }
}

// Automatisk opprydding hvert 5. minutt
setInterval(() => {
  cleanup(sendAttempts, SEND_WINDOW_MS);
  cleanup(verifyAttempts, VERIFY_WINDOW_MS + VERIFY_LOCKOUT_MS);
  cleanup(ipAttempts, IP_WINDOW_MS);
}, 5 * 60 * 1000);