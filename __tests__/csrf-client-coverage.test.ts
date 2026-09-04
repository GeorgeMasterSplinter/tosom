/**
 * Funn 5 (systemaudit 03.09) — CSRF-dekning: binder rutene + frontend til CSRF.
 *
 * Audit-blindspot: «ingen test binder frontend til CSRF-krav». Denne testen:
 *  1. Verifiserer at destruktive journey-ruter (queue POST/DELETE, reset, exit)
 *     faktisk KALLER csrfCheck (backend-dekning).
 *  2. Verifiserer at frontend KUN bruker csrfFetch mot disse rutene — ingen
 *     vanlig fetch (som mangler X-CSRF-Token og ville feile med 403 i prod).
 *  3. Verifiserer selve CSRF-gaten funksjonelt: manglende/ugyldig
 *     double-submit (header + cookie) → 403, gyldig → slipper gjennom.
 */
import { readFileSync } from 'fs';
import { join } from 'path';
import { NextRequest } from 'next/server';

// Kontrollert gate-test: slå CSRF-vernet PÅ for denne testen.
jest.mock('@/utils/flags', () => ({
  serverFlags: { enableCsrfProtection: true },
}));

import { csrfCheck } from '@/lib/auth/csrf';

const ROOT = join(__dirname, '..');
function src(rel: string): string {
  return readFileSync(join(ROOT, rel), 'utf-8');
}

describe('Funn 5: CSRF — destruktive journey-ruter kaller csrfCheck', () => {
  it('queue / reset / exit invokterer csrfCheck', () => {
    const routes = [
      'app/api/journey/queue/route.ts',
      'app/api/journey/reset/route.ts',
      'app/api/journey/exit/route.ts',
    ];
    for (const r of routes) {
      const code = src(r);
      expect(code).toMatch(/await csrfCheck\(/);
    }
  });
});

describe('Funn 5: CSRF — frontend bruker kun csrfFetch mot journey-ruter', () => {
  // Filene som kaller /api/journey/{queue,reset,exit}
  const frontendFiles = [
    'app/settings/page.tsx',
    'app/onboarding/OnboardingFlow.tsx',
    'app/betaling/page.tsx',
    'app/reisen/avslutning/page.tsx',
    'app/matching/page.tsx',
    'components/chat/ChatHeader.tsx',
    'components/dashboard/WaitingForMatch.tsx',
  ];

  it('ingen vanlig fetch mot journey-queue/reset/exit', () => {
    for (const f of frontendFiles) {
      const code = src(f);
      // (?<!csrf) = match fetch( som IKKE er leddet av csrf (csrfFetch).
      const plainFetch = code.match(
        /(?<!csrf)fetch\((["'])\/api\/journey\/(queue|reset|exit)\1/g
      );
      expect({ file: f, plainFetch }).toEqual({ file: f, plainFetch: null });
    }
  });

  it('filer med journey-kall bruker csrfFetch', () => {
    for (const f of frontendFiles) {
      const code = src(f);
      if (/\/api\/journey\/(queue|reset|exit)/.test(code)) {
        expect(code).toContain('csrfFetch');
      }
    }
  });
});

describe('Funn 5: CSRF-gaten (funksjonell, double-submit)', () => {
  it('avviser når både header og cookie mangler (403 CSRF_MISSING)', async () => {
    const req = new NextRequest('http://localhost/api/journey/exit', { method: 'POST' });
    const result = await csrfCheck(req);
    expect(result instanceof Response).toBe(true);
    const res = result as Response;
    expect(res.status).toBe(403);
    const body = (await res.json()) as { code: string };
    expect(body.code).toBe('CSRF_MISSING');
  });

  it('avviser når header og cookie ikke stemmer (403 CSRF_INVALID)', async () => {
    const req = new NextRequest('http://localhost/api/journey/exit', {
      method: 'POST',
      headers: { 'x-csrf-token': 'token-a' },
    });
    req.cookies.set('csrf_token', 'token-b');
    const result = await csrfCheck(req);
    expect(result instanceof Response).toBe(true);
    const body = (await (result as Response).json()) as { code: string };
    expect(body.code).toBe('CSRF_INVALID');
  });

  it('godkjenner gyldig double-submit (header + cookie stemmer)', async () => {
    const token = 'valid-csrf-token-1234567890';
    const req = new NextRequest('http://localhost/api/journey/exit', {
      method: 'POST',
      headers: { 'x-csrf-token': token },
    });
    req.cookies.set('csrf_token', token);
    const result = await csrfCheck(req);
    expect(result).toBe(true);
  });
});