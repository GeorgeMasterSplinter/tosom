/**
 * CSRF-klienthjelp (L6: aktiver CSRF-vern på kritiske write-ruter).
 *
 * Brukes i frontend-flow som kallar skrive-ender (profil, innstillinger,
 * chat, report, passord-reset).
 *
 * Slik fungerer det:
 * - `ensureCsrfToken()` sikrer at en CSRF-token ligger i en cookie
 *   (`csrf_token`, SameSite=Lax, 24 timer) og i minne.
 * - `csrfFetch()` er en tynn wrapper rundt `fetch` som legger til
 *   `X-CSRF-Token`-headeren på hver kall.
 * - Serveren (`lib/auth/csrf.ts` → `csrfCheck`) godkjenner bare skrivekall
 *   når header og cookie stemmer (eller når cookie ikke finnes og
 *   tokenet har gyldig lengde — for API-klienter uten cookie-støtte).
 *
 * Hvorfor dette beskytter: en angripende nettside kan ikke sende egne
 * HTTP-headers (CORS-preflight krever tillatelse), og SameSite=Lax-cookien
 * blir ikke med på cross-site POST. Dermed mislykkes forgede kall.
 */

import { generateCsrfToken } from '@/lib/auth/csrf';

const COOKIE_NAME = 'csrf_token';
const TOKEN_MAX_AGE = 60 * 60 * 24; // 24 timar

let currentToken: string | null = null;

function readCookie(): string | null {
  if (typeof document === 'undefined') return null;
  const entry = document.cookie
    .split('; ')
    .find((c) => c.startsWith(`${COOKIE_NAME}=`));
  if (!entry) return null;
  return decodeURIComponent(entry.slice(COOKIE_NAME.length + 1));
}

/**
 * Sikrer at en CSRF-token finnes (cookie + minne). Returnerer tokenet.
 * Kan kjøres i både browser og SSR-sammenheng (returnerer '' utenom browser).
 */
export function ensureCsrfToken(): string {
  if (typeof document === 'undefined') return currentToken ?? '';
  if (!currentToken) {
    const existing = readCookie();
    if (existing && existing.length >= 10 && existing.length <= 256) {
      currentToken = existing;
    } else {
      currentToken = generateCsrfToken();
      document.cookie = `${COOKIE_NAME}=${encodeURIComponent(currentToken)}; path=/; max-age=${TOKEN_MAX_AGE}; samesite=lax`;
    }
  }
  return currentToken;
}

/**
 * `fetch`-wrapper som legger til CSRF-header. Brukes bare på
 * POST/PUT/PATCH/DELETE-kall mot ender med `csrfCheck`.
 *
 * @example
 *   const res = await csrfFetch('/api/settings/preferences', {
 *     method: 'POST',
 *     body: JSON.stringify(payload),
 *   });
 */
export async function csrfFetch(
  input: RequestInfo | URL,
  init: RequestInit = {}
): Promise<Response> {
  const headers = new Headers(init.headers);
  if (!headers.has('X-CSRF-Token')) {
    headers.set('X-CSRF-Token', ensureCsrfToken());
  }
  return fetch(input, { ...init, headers });
}