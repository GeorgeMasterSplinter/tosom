/**
 * ACT E (P1-5) — 21+-synlighet ved registrering: AGE-01–AGE-03, AGE-05
 *
 * Aldersgrensen (MIN_AGE = 21, config/legal.ts) håndheves server-side i
 * onboarding (lib/validation/onboarding-steps.ts + onboarding-setup.ts).
 * Brukeren ser nå kravet ved registrering (register-visningen på /login)
 * og overraskes ikke av grensen senere i onboarding.
 *
 * AGE-04 (eksisterende brukere kan logge inn) dekkes av de eksisterende
 * auth-testene; AGE-06 (ingen endring i datamodell/matching) holdes ved
 * at ACT E berører hverken prisma/schema.prisma eller matching-kode.
 */

import { MIN_AGE } from '@/config/legal';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

const ROOT = join(__dirname, '..');
function src(rel: string): string {
  return readFileSync(join(ROOT, rel), 'utf-8');
}

describe('AGE-01 — minimumsalder er fortsatt 21 og håndheves server-side', () => {
  it('MIN_AGE i config/legal.ts er 21', () => {
    expect(MIN_AGE).toBe(21);
  });

  it('onboarding-valideringen håndhever grensen server-side', () => {
    const steps = src('lib/validation/onboarding-steps.ts');
    expect(steps).toContain('MIN_AGE');
    expect(steps).toMatch(/age < MIN_AGE/);
    const setup = src('lib/validation/onboarding-setup.ts');
    expect(setup).toMatch(/min\(21/);
  });
});

describe('AGE-02 — registreringsflyten viser 21+-kravet tydelig', () => {
  it('hele setningen er til stede (ikke bare «21+»)', () => {
    expect(src('app/login/page.tsx')).toContain('Tosom er for deg som har fylt 21 år.');
  });

  it('teksten står i register-visningen (etter register-skjemaets start)', () => {
    const page = src('app/login/page.tsx');
    const registerSkjema = page.lastIndexOf('onSubmit={handleRegister}');
    const alderstekst = page.indexOf('har fylt 21 år');
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
