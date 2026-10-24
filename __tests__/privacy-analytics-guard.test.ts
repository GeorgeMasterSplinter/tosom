/**
 * ACT C1 — Cookie/Analytics truth alignment: PRIVACY ANALYTICS GUARD (CA-01–CA-15).
 *
 * Formål: holde Tosom sin bevisste «Minimal Safe Launch Configuration» intakt:
 *   - ingen Vercel Speed Insights (verken komponent eller pakke)
 *   - ingen Vercel Web Analytics (ikke installert)
 *   - ingen kjente marketing pixels
 *   - /cookies og /personvern beskriver faktisk runtime (ingen døde påstander)
 *   - ingen cookie-banner/CMP (ingen valgfri aktiv storage/analytics i dag)
 *   - CSRF-cookien er Secure i produksjon
 *
 * Hvis noen senere legger inn @vercel/analytics, @vercel/speed-insights, gtag,
 * GTM eller Meta Pixel, skal denne testen feile og minne om at cookie/privacy-
 * vurderingen må åpnes igjen (CA-15). CA-12 (auth/cookie-tester grønne) dekkes
 * av den eksisterende test-suiten og kjøres i samme gate.
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const ROOT = join(__dirname, '..');

function src(rel: string): string {
  return readFileSync(join(ROOT, rel), 'utf-8');
}

/** Samler alle kildefiler (.ts/.tsx) under de oppgitte toppnivå-mappene. */
function sourceFiles(dirs: string[]): string[] {
  const found: string[] = [];
  for (const dir of dirs) {
    const base = join(ROOT, dir);
    if (!existsSync(base)) continue;
    const walk = (d: string): void => {
      for (const entry of readdirSync(d)) {
        const full = join(d, entry);
        const st = statSync(full);
        if (st.isDirectory()) walk(full);
        else if (/\.(ts|tsx)$/.test(entry)) found.push(full);
      }
    };
    walk(base);
  }
  return found;
}

const codeDirs = ['app', 'components', 'lib', 'utils', 'config', 'hooks', 'providers'];

function depNames(): string[] {
  const pkg = JSON.parse(src('package.json'));
  const deps = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) };
  return Object.keys(deps);
}

describe('CA-01 — Speed Insights: ingen import/render i koden', () => {
  it('root layout importerer og renderer ikke SpeedInsights', () => {
    const layout = src('app/layout.tsx');
    expect(layout).not.toMatch(/SpeedInsights/);
    expect(layout).not.toMatch(/@vercel\/speed-insights/);
  });

  it('ingen kildefil refererer til Speed Insights', () => {
    const treff: string[] = [];
    for (const file of sourceFiles(codeDirs)) {
      if (/SpeedInsights|@vercel\/speed-insights/.test(readFileSync(file, 'utf-8'))) treff.push(file);
    }
    expect(treff).toEqual([]);
  });
});

describe('CA-02/CA-03 — ingen Speed Insights eller Web Analytics i dependencies', () => {
  it('CA-02: @vercel/speed-insights er ikke en dependency', () => {
    expect(depNames()).not.toContain('@vercel/speed-insights');
  });

  it('CA-03: @vercel/analytics er ikke en dependency', () => {
    expect(depNames()).not.toContain('@vercel/analytics');
  });
});

describe('CA-04 — ingen kjente marketing pixels i koden', () => {
  it('ingen gtag/GTM/GA/adsbygoogle/fbq/hotjar/clarity-referanser', () => {
    const pattern =
      /gtag\(|googletagmanager|google-analytics|adsbygoogle|fbq\(|facebook\.com\/tr|hotjar|clarity\.ms|clarity\.microsoft/i;
    const treff: string[] = [];
    for (const file of sourceFiles(codeDirs)) {
      if (pattern.test(readFileSync(file, 'utf-8'))) treff.push(file);
    }
    expect(treff).toEqual([]);
  });
});

describe('CA-05 — /cookies beskriver faktisk lagring', () => {
  const page = src('app/cookies/page.tsx');

  it('nevner de tre nødvendige cookieene', () => {
    expect(page).toContain('session-token');
    expect(page).toContain('csrf_token');
    expect(page).toContain('admin_token');
  });

  it('nevner lokal nettleserlagring (localStorage/sessionStorage)', () => {
    expect(/localStorage|sessionStorage/.test(page)).toBe(true);
  });
});

describe('CA-06/CA-07 — gamle usanne påstander er borte fra /cookies', () => {
  const page = src('app/cookies/page.tsx');

  it('CA-06: «privat analyserverktøy» er fjernet', () => {
    expect(page).not.toContain('privat analyserverktøy');
  });

  it('CA-07: «1 år»-varigheten er fjernet', () => {
    expect(page).not.toMatch(/1 \u00e5r/);
  });
});

describe('CA-08 — /personvern er truth-aligned for Upstash', () => {
  // Upstash er en installert dependency, men UPSTASH_* er ikke satt i noen
  // env-fil: rate-limit faller tilbake til Postgres, cache til in-memory
  // (se lib/rate-limit.ts og lib/cache). Den er derfor ikke en aktiv behandlere.
  const envFiles = ['.env', '.env.example', '.env.prod', '.env.test', '.env.local'];
  const upstashConfigured = envFiles.some((f) => {
    const p = join(ROOT, f);
    if (!existsSync(p)) return false;
    return /UPSTASH_REDIS_REST_URL\s*=\s*\S/.test(readFileSync(p, 'utf-8'));
  });

  it('hvis Upstash ikke er konfigurert, må den ikke listes som aktiv behandlere', () => {
    if (!upstashConfigured) {
      expect(src('app/personvern/page.tsx')).not.toMatch(/Upstash/i);
    }
    // Hvis den er konfigurert, skal den listes — verifiseres manuelt ved endring.
  });
});

describe('CA-09 — /personvern publiserer ikke uverifisert 180-dagers log-retensjon', () => {
  it('inneholder ikke «180 dager»/«180 dagers»', () => {
    // 180-dagers IP/SystemLog-retensjon er ikke verifisert i kode/config
    // (SystemLog har ingen IP-kolonne, ingen retensjonscron) — publiseres ikke.
    expect(src('app/personvern/page.tsx')).not.toMatch(/180\s*dag/);
  });
});

describe('CA-10 — Sentry beskrives som feil-/driftsmonitorering, ikke analytics', () => {
  it('Sentry-raden i /personvern sier feil- og driftsmonitorering', () => {
    expect(src('app/personvern/page.tsx')).toContain('Feil- og driftsmonitorering');
  });
});

describe('CA-11 — CSRF-cookien er Secure i produksjon', () => {
  it('klienten setter secure-flagg kun i produksjon + HTTPS', () => {
    const client = src('lib/api/csrfClient.ts');
    expect(client).toContain("NODE_ENV === 'production'");
    expect(client).toContain("protocol === 'https:'");
    expect(client).toContain('; secure');
  });

  it('server-side setCsrfCookie bruker secure i produksjon', () => {
    expect(src('lib/auth/csrf.ts')).toMatch(/secure:\s*process\.env\.NODE_ENV === 'production'/);
  });
});

describe('CA-13 — ingen cookie-banner/CMP er introdusert', () => {
  it('ingen consent/CMP-pakke eller -komponent', () => {
    expect(depNames().some((n) => /cookie-?consent|consent(-|\/)manager|cookiebanner|cookie-banner/i.test(n))).toBe(false);

    const treff: string[] = [];
    for (const file of sourceFiles(['components'])) {
      if (/CookieBanner|cookie-consent|CookieConsent|ConsentModal|consent-modal/i.test(readFileSync(file, 'utf-8'))) {
        treff.push(file);
      }
    }
    expect(treff).toEqual([]);
    expect(src('app/layout.tsx')).not.toMatch(/Consent|CookieBanner/i);
  });
});

describe('CA-14 — /cookies og /personvern er indexable (ikke noindex)', () => {
  it('både sidene finnes og blokkerer ikke indeksering', () => {
    expect(existsSync(join(ROOT, 'app/cookies/page.tsx'))).toBe(true);
    expect(existsSync(join(ROOT, 'app/personvern/page.tsx'))).toBe(true);
    expect(src('app/cookies/page.tsx')).not.toMatch(/noindex/);
    expect(src('app/personvern/page.tsx')).not.toMatch(/noindex/);
  });
});

describe('CA-15 — guard fanger reintroduksjon av ikke-godkjent analytics', () => {
  // CA-15 er selve guard-testen: om @vercel/analytics, @vercel/speed-insights,
  // gtag, GTM eller Meta Pixel kommer tilbake, feiler CA-01–CA-04 ovenfor.
  it('forbudte integrasjoner er fraværende (speiler CA-01–CA-04)', () => {
    const names = depNames();
    for (const banned of ['@vercel/analytics', '@vercel/speed-insights']) {
      expect(names).not.toContain(banned);
    }
    expect(src('app/layout.tsx')).not.toMatch(/SpeedInsights|@vercel\/analytics/);
  });
});
