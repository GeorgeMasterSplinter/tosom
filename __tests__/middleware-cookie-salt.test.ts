/**
 * Middleware ↔ NextAuth cookie/salt-samsvar
 *
 * BAKGRUNN (feilen denne testen verner mot):
 * I NextAuth v5 er cookie-navnet SELVE SALTET i nøkkelavledningen.
 * Fra @auth/core/jwt.js:
 *     salt = cookieName
 *     hkdf("sha256", keyMaterial, salt, `Auth.js Generated Encryption Key (${salt})`, ...)
 *
 * lib/auth/config.ts setter `useSecureCookies: NODE_ENV === 'production'`,
 * som i produksjon skriver `__Secure-authjs.session-token`.
 *
 * Leser middleware feil cookie-navn, feiler også saltet — og brukeren
 * logges inn for så å kastes rett ut igjen.
 *
 * Symptomet er lumsk: alt virker lokalt (HTTP → useSecureCookies false →
 * likt navn begge steder), og /admin virker i produksjon (egen
 * admin_token-vei). Kun vanlige brukere i produksjon rammes.
 *
 * LERING (18.10.2026 — feilen kom tilbake):
 * secureCookie kan ALDRI beregnes fra NODE_ENV i middleware — Vercels
 * Edge-runtime har ikke NODE_ENV='production'. Midlet må i stedet sjekke
 * hvilket cookie-navn som faktisk finnes i forespørselen og velge
 * secureCookie ut fra det.
 */

import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const middlewareSrc = fs.readFileSync(path.join(ROOT, 'middleware.ts'), 'utf8');
const authConfigSrc = fs.readFileSync(path.join(ROOT, 'lib/auth/config.ts'), 'utf8');

/**
 * Plukk ut argumentobjektet til det EKTE getToken-kallet.
 * Merk: `getToken()` nevnes også i kommentarer i middleware.ts, så vi må
 * lete etter kallet som faktisk har argumenter — ikke bare første treff.
 */
function getTokenCall(src: string): string {
  const re = /getToken\(/g;
  let m: RegExpExecArray | null;

  while ((m = re.exec(src)) !== null) {
    const open = m.index + m[0].length - 1; // posisjonen til '('
    let depth = 0;

    for (let i = open; i < src.length; i++) {
      if (src[i] === '(') depth++;
      else if (src[i] === ')') {
        depth--;
        if (depth === 0) {
          const call = src.slice(m.index, i + 1);
          // Hopp over kommentar-omtaler som «getToken()» uten argumenter
          if (call.replace(/\s/g, '') !== 'getToken()') return call;
          break;
        }
      }
    }
  }
  return '';
}

describe('middleware ↔ NextAuth cookie/salt-samsvar', () => {
  it('config bruker useSecureCookies i produksjon (premisset for testen)', () => {
    expect(authConfigSrc).toMatch(
      /useSecureCookies:\s*process\.env\.NODE_ENV\s*===\s*['"]production['"]/
    );
  });

  it('middleware velger secureCookie ut fra faktisk cookie — aldri NODE_ENV', () => {
    // NODE_ENV er ikke 'production' i Vercels Edge-runtime. Hadde midlet
    // brukt NODE_ENV, leste det feil cookie-navn + feil salt i produksjon.
    const call = getTokenCall(middlewareSrc);
    expect(call).not.toBe('');
    expect(call).toMatch(/secureCookie\s*:/);
    expect(call).not.toMatch(/secureCookie\s*:\s*process\.env\.NODE_ENV/);
  });

  it('middleware sjekker begge cookie-navnene (secure og insecure)', () => {
    // Midlet må oppdage hvilket cookie-navn som faktisk finnes i
    // forespørselen — secureCookie-flagget må følge navnet (saltet).
    expect(middlewareSrc).toMatch(/req\.cookies\.has\(['"]__Secure-authjs\.session-token['"]\)/);
    expect(middlewareSrc).toMatch(/req\.cookies\.has\(['"]authjs\.session-token['"]\)/);
  });

  it('middleware godtar samme secret-navn som config (AUTH_SECRET først)', () => {
    // config.ts: secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET
    // Middleware må ha samme rekkefølge, ellers knekker det den dagen
    // AUTH_SECRET (v5-navnet) settes i miljøet.
    expect(authConfigSrc).toMatch(/AUTH_SECRET\s*\|\|\s*process\.env\.NEXTAUTH_SECRET/);

    const call = getTokenCall(middlewareSrc);
    expect(call).toMatch(/AUTH_SECRET\s*\|\|\s*process\.env\.NEXTAUTH_SECRET/);
  });
});