/**
 * Enkel in-memory rate limiting for kritiske API-endepunkt.
 */

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

const LIMITS = new Map<string, RateLimitEntry>();

/**
 * Sjekk om ein nøkkel har overskriden rate limit.
 * @param key     Unikk nøkkel (t.d. user.id eller admin-id)
 * @param max     Maksimum førespurslar
 * @param window  Vindauga i millisekund (standard: 1 minutt)
 */
export function checkRateLimit(
  key: string,
  max: number = 30,
  windowMs: number = 60_000
): boolean {
  const now = Date.now();
  const entry = LIMITS.get(key);

  if (!entry || now - entry.windowStart > windowMs) {
    LIMITS.set(key, { count: 1, windowStart: now });
    return false;
  }

  if (entry.count >= max) {
    return true;
  }

  entry.count += 1;
  return false;
}

/**
 * Rotér gamle oppføringar hvar 5. minutt for å halde minnet låg.
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of LIMITS.entries()) {
    if (now - entry.windowStart > 120_000) {
      LIMITS.delete(key);
    }
  }
}, 5 * 60 * 1000);
