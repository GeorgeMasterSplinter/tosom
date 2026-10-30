/**
 * CPT — Canonical Product Truth (30.10.2026)
 *
 * Hindrer at AKTIV produktsannhet driver. Kanonisk sannhet:
 *   ALDER:        18+ (MIN_AGE), preferanse 18–99+ (99+ = åpen øvre grense),
 *                 nybruker-default 18–40, eksisterende preferanser urørt
 *   MATCHING:     én runde i uken, natt til lørdag (vercel.json cron)
 *   REISE:        14 dager (to uker)
 *   BILDER:       fra dag 8 (første uke uten bilder)
 *
 * Målrettet scope: kun aktive kildefiler. Historiske dokumenter
 * (docs/archive/, daterte rapporter) holdes og garderes ikke.
 *
 * Allowlist (lovlige ikke-produktbruker av tallene 21/23/24/30/15):
 *   - «minst 21 tegn» — bio-lengde (userProfile.ts, ProfileForm.tsx)
 *   - 24 timer — PDF-grace, GDPR-svarfrist, kontakt-svar, admin-statistikk,
 *     auth/dev-login cookies, dag-lås, stillhetimpuls (48 t)
 *   - 30 dager — auth-cookie levetid, GDPR-svarfrist, analytics-vindu,
 *     retention-varsling, relasjonsmilepæl «1 måned sammen»
 *   - FROZEN innhold: app/questions/data/questions.ts og app/chat/data/tasks.ts
 *     (Bli Kjent V2 / Oppgaver V2) — header-kommentar «Voksne 21+» er historisk
 *     kontekst i fryst fil, bevisst ikke endret (CPT-13/14 låser tallene)
 *
 * Kanonisk kildeindeks: docs/CANONICAL-PRODUCT-TRUTH-v1.0.md
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { MIN_AGE } from '@/config/legal';
import { JOURNEY_TOTAL_DAYS, PHOTO_REVEAL_DAY } from '@/config/journey';
import { isPhotosAllowed } from '@/lib/journey/engine';
import { basicProfileSchema } from '@/lib/validation/onboarding-setup';
import { questionCategories } from '@/app/questions/data/questions';
import { taskCategories } from '@/app/chat/data/tasks';

const ROOT = join(__dirname, '..');
function src(rel: string): string {
  return readFileSync(join(ROOT, rel), 'utf-8');
}

function basicPayload(age: number, agePrefMin: number, agePrefMax: number | null) {
  return {
    identityName: 'Test',
    age,
    gender: 'male',
    seekingGender: 'female',
    city: 'Oslo',
    postalCode: '0150',
    distancePref: 100,
    agePrefMin,
    agePrefMax,
  };
}

/** Slår feil med filnavn + forbudt mønster (Jest-supporterer ikke expect(msg)). */
function assertNoMatch(rel: string, re: RegExp, label: string): void {
  const s = src(rel);
  if (re.test(s)) {
    throw new Error(`${label}: ${rel} inneholder forbudt mønster ${re}`);
  }
}

/** Aktive offentlige kildefil med alderskrav (A18-område). */
const AGE_PUBLIC_FILES = [
  'app/layout.tsx',
  'app/login/page.tsx',
  'app/reisen/page.tsx',
  'app/personvern/page.tsx',
  'app/trygghet/layout.tsx',
  'app/vilkar/page.tsx',
  'components/ui/layout/Hero.tsx',
  'components/ui/age-badge/AgeBadge.tsx',
  'components/AgeRequirement.tsx',
  'public/llms.txt',
  'ai/system_prompt.md',
  'ai/system_skisse.md',
];

/** Aktive kildefil der reiselengde er produktsannhet (ikke cookies/GDPR/retention). */
const JOURNEY_ACTIVE_FILES = [
  'app/reisen/page.tsx',
  'app/reisen/avslutning/page.tsx',
  'app/slik-fungerer-det/page.tsx',
  'app/priser/page.tsx',
  'app/faq/page.tsx',
  'app/chat/page.tsx',
  'app/dashboard/page.tsx',
  'components/journey/JourneyView.tsx',
  'components/journey/JourneySection.tsx',
  'lib/email/index.ts',
  'ai/system_prompt.md',
  'ai/system_skisse.md',
  'public/llms.txt',
];

/** Aktive kildefil der billedåpning er produktsannhet. */
const PHOTO_ACTIVE_FILES = [
  'app/slik-fungerer-det/page.tsx',
  'app/dashboard/page.tsx',
  'components/journey/JourneyView.tsx',
  'components/journey/JourneySection.tsx',
  'lib/email/index.ts',
  'ai/system_prompt.md',
  'ai/system_skisse.md',
  'public/llms.txt',
];

/** Aktive brukersynlige kildefil for matcherunde-tidspunkt. */
const MATCH_ACTIVE_FILES = [
  'components/dashboard/WaitingForMatch.tsx',
  'components/DashboardMatchStatus.tsx',
  'app/priser/page.tsx',
  'app/onboarding/OnboardingFlow.tsx',
  'app/onboarding/OnboardingLayout.tsx',
  'app/onboarding/steps/Step9Oppsummering.tsx',
  'app/onboarding/steps/Step10StartReisen.tsx',
  'app/reisen/page.tsx',
  'app/slik-fungerer-det/page.tsx',
  'public/llms.txt',
  'ai/system_prompt.md',
  'ai/system_skisse.md',
];

describe('CPT — canonical product truth', () => {
  test('CPT-01: kanonisk minimumsalder = 18', () => {
    expect(MIN_AGE).toBe(18);
    expect(src('config/legal.ts')).toMatch(/export const MIN_AGE = 18;/);
  });

  test('CPT-02: aktiv offentlig alderskrav har ingen stale 21+', () => {
    for (const f of AGE_PUBLIC_FILES) {
      assertNoMatch(f, /21\+|har fylt 21|minst 21|minimum 21/i, 'CPT-02');
    }
  });

  test('CPT-03: aktiv offentlig alderskrav har ingen stale 23+', () => {
    for (const f of AGE_PUBLIC_FILES) {
      assertNoMatch(f, /23\+|har fylt 23|minst 23|minimum 23/i, 'CPT-03');
    }
  });

  test('CPT-04: journey runtime = 14 dager', () => {
    expect(JOURNEY_TOTAL_DAYS).toBe(14);
    const cfg = src('config/journey.ts');
    expect(cfg).toMatch(/JOURNEY_TOTAL_DAYS = 14/);
    // Fasesamling: siste fase slutter på dag 14.
    expect(cfg).toMatch(/endDay: 14/);
  });

  test('CPT-05: aktiv journey-claim har ingen stale 30-dagersreise', () => {
    for (const f of JOURNEY_ACTIVE_FILES) {
      assertNoMatch(f, /30-dagers|30 dager|dag 30|Dag 30|day 30/i, 'CPT-05');
    }
  });

  test('CPT-06: photo runtime lar avdekking fra dag 8', () => {
    expect(PHOTO_REVEAL_DAY).toBe(8);
    expect(isPhotosAllowed(7)).toBe(false);
    expect(isPhotosAllowed(8)).toBe(true);
    expect(src('config/journey.ts')).toMatch(/PHOTO_REVEAL_DAY = 8/);
  });

  test('CPT-07: aktiv photo-claim har ingen stale dag-15-avdekking', () => {
    for (const f of PHOTO_ACTIVE_FILES) {
      assertNoMatch(f, /dag 15|Dag 15|day 15|fra dag 15|bilder.{0,20}15/i, 'CPT-07');
    }
  });

  test('CPT-08: matching-runtime-kadens = ukentlig, natt til lørdag', () => {
    const vercel = JSON.parse(src('vercel.json')) as {
      crons: Array<{ path: string; schedule: string }>;
    };
    const cron = vercel.crons.find((c) => c.path === '/api/cron/matching');
    if (!cron) throw new Error('CPT-08: matching-cron mangler i vercel.json');
    const [minute, hour, , , dow] = cron.schedule.split(' ');
    // Én dag i uken: lørdag (cron dow=6). Natt-vindu (0–4).
    if (dow !== '6') throw new Error(`CPT-08: matching-cron må kjøre kun lørdag, fant dow=${dow}`);
    if (minute !== '0') throw new Error(`CPT-08: matching-cron minutt=${minute}, forventet 0`);
    for (const h of hour.split(',')) {
      if (Number(h) > 4) throw new Error(`CPT-08: matching-cron time=${h} er ikke natt-vindu`);
    }
  });

  test('CPT-09: aktiv match-claim lover ingen match innen 24 timer', () => {
    for (const f of MATCH_ACTIVE_FILES) {
      assertNoMatch(f, /match.{0,60}(24 timer|24t\b|ett døgn|i morgen|daily match|daglig match)/i, 'CPT-09');
      assertNoMatch(f, /(24 timer|ett døgn|i morgen).{0,60}match/i, 'CPT-09');
    }
  });

  test('CPT-10: llms.txt (maskinlesbar sannhet) er alignet', () => {
    const s = src('public/llms.txt');
    expect(s).toContain('(18+)');
    expect(s).toMatch(/natt til lørdag/i);
    expect(s).toMatch(/14-dagers/);
    expect(s).toMatch(/fra dag 8/);
    expect(s).toContain('349');
    expect(s).toMatch(/gratis/i);
    expect(s).not.toMatch(/21\+|23\+|30-dagers|dag 15/i);
  });

  test('CPT-11: onboarding aldersmin = 18 (17 avvises, 18 godtas)', () => {
    expect(basicProfileSchema.safeParse(basicPayload(17, 18, 40)).success).toBe(false);
    expect(basicProfileSchema.safeParse(basicPayload(18, 18, 40)).success).toBe(true);
  });

  test('CPT-12: 99+ er åpen øvre grense (agePrefMax = null)', () => {
    expect(basicProfileSchema.safeParse(basicPayload(30, 18, null)).success).toBe(true);
    // Minst-alder for preferanse følger MIN_AGE:
    expect(basicProfileSchema.safeParse(basicPayload(30, 17, 40)).success).toBe(false);
    expect(basicProfileSchema.safeParse(basicPayload(30, 18, 40)).success).toBe(true);
  });

  test('CPT-13: Bli Kjent V2 er fryst på 180 (12×15)', () => {
    if (questionCategories.length !== 12) {
      throw new Error(`CPT-13: forventer 12 kategorier, fant ${questionCategories.length}`);
    }
    for (const c of questionCategories) {
      if (c.questions.length !== 15) {
        throw new Error(`CPT-13: ${c.name} har ${c.questions.length} spørsmål, forventet 15`);
      }
    }
    expect(questionCategories.flatMap((c) => c.questions).length).toBe(180);
  });

  test('CPT-14: Oppgaver V2 er fryst på 135 (9×15)', () => {
    if (taskCategories.length !== 9) {
      throw new Error(`CPT-14: forventer 9 kategorier, fant ${taskCategories.length}`);
    }
    for (const c of taskCategories) {
      if (c.tasks.length !== 15) {
        throw new Error(`CPT-14: ${c.name} har ${c.tasks.length} oppgaver, forventet 15`);
      }
    }
    expect(taskCategories.flatMap((c) => c.tasks).length).toBe(135);
  });

  test('CPT-15: juridisk/offentlig faktisk sannhet er enig om 18', () => {
    const vilkar = src('app/vilkar/page.tsx');
    expect(vilkar).toContain('MIN_AGE');
    assertNoMatch('app/vilkar/page.tsx', /21\+|har fylt 21/, 'CPT-15');
    const personvern = src('app/personvern/page.tsx');
    expect(personvern).toMatch(/18\+/);
    assertNoMatch('app/personvern/page.tsx', /21\+|23\+/, 'CPT-15');
    // Trygghet-metadata bruker kanonisk MIN_AGE (renderes til «18+»).
    const trygghet = src('app/trygghet/layout.tsx');
    expect(trygghet).toContain('MIN_AGE');
    assertNoMatch('app/trygghet/layout.tsx', /21\+|23\+/, 'CPT-15');
  });
});