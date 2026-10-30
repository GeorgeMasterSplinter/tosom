/**
 * A18 (29.10.2026) — 18+-synlighet ved registrering: AGE-01–AGE-03, AGE-05
 * (erstatter login-age-21.test.ts)
 *
 * Aldersgrensen (MIN_AGE = 18, config/legal.ts) håndheves server-side i
 * onboarding (lib/validation/onboarding-steps.ts + onboarding-setup.ts).
 * Brukeren ser nå kravet ved registrering (register-visningen på /login)
 * og overraskes ikke av grensen senere i onboarding.
 *
 * AGE-04 (eksisterende brukere kan logge inn) dekkes av de eksisterende
 * auth-testene; AGE-06 (ingen endring i datamodell/matching) holdes ved
 * at A18 berører hverken prisma/schema.prisma eller matching-kode.
 */

import { MIN_AGE } from '@/config/legal';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

const ROOT = join(__dirname, '..');
function src(rel: string): string {
  return readFileSync(join(ROOT, rel), 'utf-8');
}

describe('AGE-01 — minimumsalder er 18 og håndheves server-side (A18)', () => {
  it('MIN_AGE i config/legal.ts er 18', () => {
    expect(MIN_AGE).toBe(18);
  });

  it('onboarding-valideringen håndhever grensen server-side', () => {
    const steps = src('lib/validation/onboarding-steps.ts');
    expect(steps).toContain('MIN_AGE');
    expect(steps).toMatch(/age < MIN_AGE/);
    // Setup-skjemaet (POST /api/profile/setup) leser MIN_AGE — ingen hardkodet 21.
    const setup = src('lib/validation/onboarding-setup.ts');
    expect(setup).toMatch(/min\(MIN_AGE/);
    expect(setup).not.toMatch(/min\(21/);
  });
});

describe('AGE-02 — registreringsflyten viser 18+-kravet tydelig', () => {
  it('hele setningen er til stede (ikke bare «18+»)', () => {
    expect(src('app/login/page.tsx')).toContain('Tosom er for deg som har fylt 18 år.');
  });

  it('teksten står i register-visningen (etter register-skjemaets start)', () => {
    const page = src('app/login/page.tsx');
    const registerSkjema = page.lastIndexOf('onSubmit={handleRegister}');
    const alderstekst = page.indexOf('har fylt 18 år');
    expect(registerSkjema).toBeGreaterThan(-1);
    expect(alderstekst).toBeGreaterThan(registerSkjema);
  });
});

describe('AGE-03 — copyen lover ingen aldersverifisering som ikke eksisterer', () => {
  it('ingen verifiserings-påstander på login-siden', () => {
    const page = src('app/login/page.tsx').toLowerCase();
    const forbudt = [
      'aldersverifisert',
      'alderen din er verifisert',
      'bekrefter alderen',
      'verifisert alder',
      'alle brukere er aldersverifisert',
    ];
    for (const ord of forbudt) {
      expect(page).not.toContain(ord);
    }
  });
});

describe('AGE-05 — /register-flyten fungerer som før', () => {
  it('/register returer til /login som før', () => {
    expect(existsSync(join(ROOT, 'app/register/page.tsx'))).toBe(true);
    expect(src('app/register/page.tsx')).toContain("redirect('/login')");
  });
});