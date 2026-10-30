/**
 * A18 (29.10.2026) — 18+-konvertering: A18-01…A18-15 + aldermatrise.
 *
 * D1/D8: minimumsalder 21 → 18 (kanonisk MIN_AGE i config/legal.ts).
 * D2: ingen under 18 er eligible for Tosom.
 * D3: nye brukere får synlig/redigerbar default 18–40 (pre-fill).
 * D4: eksisterende lagrede preferanser endres aldri.
 * D5: 99+ (agePrefMax = null) er åpen øvre grense — uendret.
 * D6/D7: bidireksjonell aldersmatching uten skjult aldersgap-regel.
 *
 * Ingen av disse testene måler sosial ønskværdighet — kun om eksplicitte
 * preferanser tillater matching.
 */

import { MIN_AGE, TERMS_VERSION, PRIVACY_VERSION } from '@/config/legal';
import { basicProfileSchema } from '@/lib/validation/onboarding-setup';
import { validateOnboardingStep } from '@/lib/validation/onboarding-steps';
import { toOnboardingData } from '@/lib/profile/toOnboardingData';
import { sjekkAlleDealbreakers } from '@/lib/matching/dealbreaker';
import type { ProfileData } from '@/lib/matching/types';
import { readFileSync } from 'fs';
import { join } from 'path';

const ROOT = join(__dirname, '..');
function src(rel: string): string {
  return readFileSync(join(ROOT, rel), 'utf-8');
}

/* ====== Hjelpere ====== */

function makeProfile(overrides: Partial<ProfileData> = {}): ProfileData {
  return {
    userId: 'test-id',
    firstName: 'Test',
    lastName: 'Person',
    age: 30,
    bio: null,
    interests: [],
    matchTags: [],
    personality: { traits: ['open'] },
    lifeSituation: null, // manglende kjønn/seeking blokkerer aldri (forsvarlig)
    relationshipStyle: 'gradual',
    communication: { style: 'direct' },
    futureVision: { goals: ['growth'] },
    boundaries: null,
    emotionalNeeds: { needs: ['trust'] },
    lifeRhythm: 'morning',
    maturityLevel: 5,
    securityLevel: 'secure',
    lifestyle: null,
    intimacy: null,
    preferences: null,
    latitude: null,
    longitude: null,
    distancePref: null,
    deepProfileData: null,
    ...overrides,
  };
}

/** Fullstendig basic-payload (server-skjema for /api/profile/setup). */
const basicPayload = (age: number, agePrefMin: number, agePrefMax: unknown) => ({
  identityName: 'Testbruker',
  age,
  gender: 'Kvinne',
  seekingGender: 'Mann',
  height: '',
  bodyType: 'slank',
  lifestyle: 'aktiv',
  smoking: 'ne',
  religion: 'laik',
  acceptedReligions: '',
  religionOpen: false,
  children: 'nei',
  wantChildren: 'ja',
  city: 'Oslo',
  postalCode: '0150',
  distancePref: 50,
  agePrefMin,
  agePrefMax,
});

/* ====== A18-01/02/03 — egen alder ====== */

describe('A18-01: 17 avvises (server-side)', () => {
  it('onboarding-steg-gaten flagger alder 17', () => {
    const { errors } = validateOnboardingStep(0, {
      identityName: 'Test', age: 17, gender: 'male', seekingGender: 'female',
      city: 'Oslo', postalCode: '0150', distancePref: 100, agePrefMin: 18, agePrefMax: 40,
    });
    expect(errors.some((e) => e.field === 'age')).toBe(true);
  });

  it('setup-skjemaet (POST /api/profile/setup) avviser alder 17', () => {
    expect(basicProfileSchema.safeParse(basicPayload(17, 18, 40)).success).toBe(false);
  });
});

describe('A18-02: 18 godtas (server-side)', () => {
  it('onboarding-steg-gaten godtar alder 18', () => {
    const { errors } = validateOnboardingStep(0, {
      identityName: 'Test', age: 18, gender: 'male', seekingGender: 'female',
      city: 'Oslo', postalCode: '0150', distancePref: 100, agePrefMin: 18, agePrefMax: 40,
    });
    expect(errors.some((e) => e.field === 'age')).toBe(false);
  });

  it('setup-skjemaet godtar alder 18', () => {
    expect(basicProfileSchema.safeParse(basicPayload(18, 18, 40)).success).toBe(true);
  });
});

describe('A18-03: kanonisk MIN_AGE = 18', () => {
  it('config/legal.ts er den kanoniske kilden', () => {
    expect(MIN_AGE).toBe(18);
  });

  it('valideringsskjemaene leser MIN_AGE (ingen hardkodet 21)', () => {
    const setup = src('lib/validation/onboarding-setup.ts');
    const profil = src('lib/validation/profile.ts');
    const api = src('lib/validation/api.ts');
    expect(setup).toContain('import { MIN_AGE } from \'@/config/legal\';');
    expect(profil).toContain('import { MIN_AGE } from "@/config/legal";');
    expect(api).toContain('import { MIN_AGE } from \'@/config/legal\';');
    for (const s of [setup, profil, api]) {
      expect(s).not.toMatch(/min\(21\)/);
    }
  });
});

/* ====== A18-04 — preferanse-min ====== */

describe('A18-04: preferanse-min støtter 18', () => {
  it('setup-skjemaet godtar agePrefMin 18 og avviser 17', () => {
    expect(basicProfileSchema.safeParse(basicPayload(30, 18, 40)).success).toBe(true);
    expect(basicProfileSchema.safeParse(basicPayload(30, 17, 40)).success).toBe(false);
  });
});

/* ====== A18-05/06 — 99+ og endelig maks (uendret) ====== */

describe('A18-05: 99+ er fortsatt åpen øvre grense', () => {
  it('agePrefMax = null godtas (ingen øvre matchalder)', () => {
    expect(basicProfileSchema.safeParse(basicPayload(30, 18, null)).success).toBe(true);
  });

  it('18–99+ matcher en kandidat på 99 (ingen maks-alder-avvisning)', () => {
    const a = makeProfile({ userId: 'a', age: 18, deepProfileData: { agePrefMin: 18, agePrefMax: null } });
    const b = makeProfile({ userId: 'b', age: 99, deepProfileData: { agePrefMin: 18, agePrefMax: null } });
    expect(sjekkAlleDealbreakers(a, b).hasDealbreaker).toBe(false);
  });
});

describe('A18-06: endelig maks uendret (18–98, 99 kun via 99+)', () => {
  it('98 godtas, 99 avvises som endelig maks', () => {
    expect(basicProfileSchema.safeParse(basicPayload(30, 18, 98)).success).toBe(true);
    expect(basicProfileSchema.safeParse(basicPayload(30, 18, 99)).success).toBe(false);
  });
});

/* ====== A18-07 — bidireksjonell matching ====== */

describe('A18-07: bidireksjonell alderspreferanse bevart', () => {
  it('blokkerer selv om én retning er innenfor (19 med 19–99+ vs 30 med 20–99+)', () => {
    const ung = makeProfile({ userId: 'ung', age: 19, deepProfileData: { agePrefMin: 19, agePrefMax: null } });
    const eldre = makeProfile({ userId: 'eldre', age: 30, deepProfileData: { agePrefMin: 20, agePrefMax: null } });
    // 19 < 20 (30 sine minste) → blokkert, uansett at 30 er innenfor 19 sine.
    expect(sjekkAlleDealbreakers(ung, eldre).hasDealbreaker).toBe(true);
    expect(sjekkAlleDealbreakers(eldre, ung).hasDealbreaker).toBe(true);
  });

  it('tillater match når begge retninger tillater (25 med 18–40 vs 18 med 20–99+)', () => {
    const a = makeProfile({ userId: 'a', age: 25, deepProfileData: { agePrefMin: 18, agePrefMax: 40 } });
    const b = makeProfile({ userId: 'b', age: 18, deepProfileData: { agePrefMin: 20, agePrefMax: null } });
    expect(sjekkAlleDealbreakers(a, b).hasDealbreaker).toBe(false);
    expect(sjekkAlleDealbreakers(b, a).hasDealbreaker).toBe(false);
  });
});

/* ====== Aldermatrise (D6/D7: kun eksplicitte preferanser) ====== */

describe('A18-aldermatrise — resultatet kommer KUN fra begge parters preferanser', () => {
  const open18 = { agePrefMin: 18, agePrefMax: null }; // 18–99+
  const t18t40 = { agePrefMin: 18, agePrefMax: 40 };

  const blokkerer = (alderA: number, prefA: unknown, alderB: number, prefB: unknown) => {
    const a = makeProfile({ userId: 'a', age: alderA, deepProfileData: prefA as ProfileData['deepProfileData'] });
    const b = makeProfile({ userId: 'b', age: alderB, deepProfileData: prefB as ProfileData['deepProfileData'] });
    return sjekkAlleDealbreakers(a, b).hasDealbreaker;
  };

  it('18 ↔ 18 (begge 18–99+): matcher', () => {
    expect(blokkerer(18, open18, 18, open18)).toBe(false);
  });
  it('18 ↔ 19 (begge 18–99+): matcher', () => {
    expect(blokkerer(18, open18, 19, open18)).toBe(false);
  });
  it('18 ↔ 20 (begge 18–40): matcher', () => {
    expect(blokkerer(18, t18t40, 20, t18t40)).toBe(false);
  });
  it('18 ↔ 25 (begge 18–40): matcher', () => {
    expect(blokkerer(18, t18t40, 25, t18t40)).toBe(false);
  });
  it('18 ↔ 40 (begge 18–40): matcher (40 er innenfor 18–40)', () => {
    expect(blokkerer(18, t18t40, 40, t18t40)).toBe(false);
  });
  it('19 ↔ 30 (19–99+ vs 20–99+): blokkeres — 30 sine grenser tillater ikke 19', () => {
    expect(blokkerer(19, { agePrefMin: 19, agePrefMax: null }, 30, { agePrefMin: 20, agePrefMax: null })).toBe(true);
  });
  it('25 ↔ 18 (18–40 vs 20–99+): matcher — begge retninger tillater', () => {
    expect(blokkerer(25, t18t40, 18, { agePrefMin: 20, agePrefMax: null })).toBe(false);
  });
});

/* ====== A18-08 — 18 omgår ikke andre harde grenser ====== */

describe('A18-08: alder 18 omgår ikke andre dealbreakere', () => {
  it('kjønnspreferanse blokkerer fortsatt en 18-åring', () => {
    const a = makeProfile({ userId: 'a', age: 18, lifeSituation: { gender: 'Mann', seekingGender: 'Kvinne' } });
    const b = makeProfile({ userId: 'b', age: 25, lifeSituation: { gender: 'Mann', seekingGender: 'Mann' } });
    expect(sjekkAlleDealbreakers(a, b).hasDealbreaker).toBe(true);
  });
});

/* ====== A18-09 — eksisterende lagret preferanse endres aldri ====== */

describe('A18-09: eksisterende lagret preferanse bevares (D4)', () => {
  const tomProfil = {
    identityName: null, age: null, lifeSituation: null, lifestyle: null,
    personality: null, communication: null, intimacy: null, futureVision: null,
    boundaries: null, emotionalNeeds: null, securityLevel: null,
    psychometricAnswers: null, preferences: null,
  };

  it('lagret 21–40 pre-fylles som 21–40 (IKKE 18–40)', () => {
    const prefill = toOnboardingData(
      { ...tomProfil, deepProfileData: { agePrefMin: 21, agePrefMax: 40 } },
      true,
    );
    expect(prefill.data['agePrefMin']).toBe(21);
    expect(prefill.data['agePrefMax']).toBe(40);
  });

  it('ny bruker (uten lagret preferanse) får default 18–40 (D3)', () => {
    const flow = src('app/onboarding/OnboardingFlow.tsx');
    expect(flow).toContain('agePrefMin: 18, agePrefMax: 40');
  });
});

/* ====== A18-10/11/12 — publik, maskinlesbar, legal sannhet ====== */

describe('A18-10: ingen aktiv offentlig 21+-claim', () => {
  const aktiveFiler = [
    'components/ui/layout/Hero.tsx',
    'components/ui/age-badge/AgeBadge.tsx',
    'components/AgeRequirement.tsx',
    'app/login/page.tsx',
    'app/personvern/page.tsx',
  ];
  for (const rel of aktiveFiler) {
    it(`${rel} inneholder ingen 21+- eller «21 år»-claim`, () => {
      const s = src(rel);
      expect(s).not.toContain('21+');
      expect(s).not.toContain('21 år');
    });
  }
});

describe('A18-11: ingen aktiv maskinlesbar 21+-claim', () => {
  it('layout-metadata og llms.txt sier 18+', () => {
    const layout = src('app/layout.tsx');
    const llms = src('public/llms.txt');
    expect(layout).toContain('For 18+.');
    expect(layout).not.toContain('For 21+.');
    expect(llms).toContain('For voksne (18+).');
    expect(llms).not.toContain('21+');
  });

  it('trygghet-metadata interpolerer MIN_AGE (ingen hardkodet alder)', () => {
    const t = src('app/trygghet/layout.tsx');
    expect(t).toContain('MIN_AGE');
    expect(t).not.toContain('21+');
  });
});

describe('A18-12: legal/offentlig alderssannhet = 18+', () => {
  it('personvern sier (18+)', () => {
    expect(src('app/personvern/page.tsx')).toContain('Tosom er kun for voksne (18+).');
  });

  it('vilkar/trygghet leser MIN_AGE (dynamisk — ingen andre 18-er hardkodet)', () => {
    const vilkar = src('app/vilkar/page.tsx');
    const trygghet = src('app/trygghet/page.tsx');
    expect(vilkar).toContain('Aldersgrense — ${MIN_AGE} år');
    expect(trygghet).toContain('Aldersgrensen er ${MIN_AGE} år.');
  });

  it('TERMS/PRIVACY-versjonen er bumpet for A18 (faktisk produktendring)', () => {
    expect(TERMS_VERSION).toBe('2026-10-29');
    expect(PRIVACY_VERSION).toBe('2026-10-29');
  });
});

/* ====== A18-13/14/15 — kø-guard og eligibility ====== */

jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: { user: { findUnique: jest.fn() }, order: { findFirst: jest.fn() } },
}));
jest.mock('@/lib/auth/requireAuth', () => ({ requireAuth: jest.fn() }));
jest.mock('@/lib/auth/csrf', () => ({ csrfCheck: jest.fn() }));
jest.mock('@/lib/rate-limit-pg', () => ({ pgCheck: jest.fn() }));

import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth/requireAuth';
import { csrfCheck } from '@/lib/auth/csrf';
import { pgCheck } from '@/lib/rate-limit-pg';
import { POST } from '@/app/api/journey/queue/route';

const findUnique = (prisma as unknown as { user: { findUnique: jest.Mock } }).user.findUnique;

function queueReq() {
  return new NextRequest('http://localhost/api/journey/queue');
}

function authOk() {
  (requireAuth as jest.Mock).mockResolvedValue({ user: { id: 'u-1', email: 'u@x.no', role: 'USER' } });
  (csrfCheck as jest.Mock).mockResolvedValue(true);
  (pgCheck as jest.Mock).mockResolvedValue({ ok: true });
}

describe('A18-13: under-18 nektes matching-kø (POST /api/journey/queue)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    authOk();
  });

  it('profil med alder 17 og onboardingComplete=true nektes (409)', async () => {
    findUnique.mockResolvedValue({
      id: 'u-1', onboardingComplete: true, journeyState: 'IDLE',
      matchQueuedAt: null, bannedAt: null, deletedAt: null,
      profile: { age: 17 },
    });
    const res = await POST(queueReq());
    expect(res.status).toBe(409);
    const body = await res.json();
    expect(body.error).toBe('Tosom er for personer som har fylt 18 år.');
  });

  it('alder 18 triggerer IKKE alder-guarden (fortsetter til neste sjekk)', async () => {
    findUnique.mockResolvedValue({
      id: 'u-1', onboardingComplete: true, journeyState: 'IDLE',
      matchQueuedAt: null, bannedAt: new Date(), deletedAt: null,
      profile: { age: 18 },
    });
    // Sperrings-sjekken (etter alder-guarden) fanger denne — bevis på at
    // alder-guarden ikke slo inn for 18.
    const res = await POST(queueReq());
    expect(res.status).toBe(403);
  });
});

describe('A18-14: profil/setup avviser alder < 18', () => {
  it('basicProfileSchema (server, POST /api/profile/setup): 17 nei, 18 ja', () => {
    expect(basicProfileSchema.safeParse(basicPayload(17, 18, 40)).success).toBe(false);
    expect(basicProfileSchema.safeParse(basicPayload(18, 18, 40)).success).toBe(true);
  });
});

describe('A18-15: under-18 kan ikke bli matching-eligible via støttet flyt', () => {
  it('matching-cronen leser kun QUEUED + onboardingComplete-brukere', () => {
    const cron = src('app/api/cron/matching/route.ts');
    expect(cron).toMatch(/journeyState:\s*'QUEUED'/);
    expect(cron).toContain('onboardingComplete: true');
  });

  it('onboardingComplete settes kun i setup-ruten, bak MIN_AGE-valideringen', () => {
    const setup = src('app/api/profile/setup/route.ts');
    expect(setup).toContain('validateOnboarding');
    expect(setup).toContain("from '@/lib/validation/onboarding-setup'");
    expect(setup).toContain('onboardingComplete: true');
  });
});