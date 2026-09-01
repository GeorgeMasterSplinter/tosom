/**
 * ToSom — PRODUSJON-SMOKETEST: POST /api/profile/setup mot PRODUKSJONS-DB-en.
 *
 * Bevisar slutt-til-slutt at Bug 1 (500 ved onboarding-lagring) er borte i
 * produksjon — køyrer den reelle rute-hendleren mot produksjons-DB-en med
 * nøyaktig det payloadet OnboardingFlow sender. Opprettar éin midlertidig
 * bruker og ryddar opp i afterAll (rører ingen anna data).
 *
 * SIKKER: slåast bare på eksplisitt, og neikir å køyre mot lokal DB:
 *   DATABASE_URL=$(grep '^DATABASE_URL=' .env.prod | cut -d'"' -f2) \
 *   TOSOM_SMOKE_PROD=1 npx jest prod-smoke --runInBand
 *
 * Uten TOSOM_SMOKE_PROD=1 blir testen hoppa over (normale `npm test`-kjøringar).
 */

const SMOKE_ACTIVE = process.env.TOSOM_SMOKE_PROD === '1';

jest.mock('@/lib/auth/session', () => ({
  getServerSession: jest.fn(),
}));

import { getServerSession } from '@/lib/auth/session';
import prisma from '@/lib/prisma';
import { POST } from '@/app/api/profile/setup/route';

const mockedSession = getServerSession as jest.Mock;

const describeProd = SMOKE_ACTIVE ? describe : describe.skip;

describeProd('PROD-SMOKE: POST /api/profile/setup (Bug 1-verifisering)', () => {
  const suffix = Date.now();
  const runStart = new Date();
  let userId: string;
  let usersBefore = 0;

  beforeAll(async () => {
    const url = process.env.DATABASE_URL || '';
    // SIKKERHET: neikjær å køyre mot lokal DB — heva poenget er PRODUKSJON.
    if (url.includes('localhost') || url.includes('127.0.0.1')) {
      throw new Error(
        'PROD-SMOKE neikjær å køyre mot lokal DATABASE_URL. Bruk .env.prod sin DATABASE_URL.'
      );
    }
    // eslint-disable-next-line no-console
    console.log('[prod-smoke] KOYRER MOT PRODUKSJON:', url.replace(/:[^:@]+@/, ':***@'));

    usersBefore = await prisma.user.count();
    const user = await prisma.user.create({
      data: {
        id: `prodsmoke-${suffix}`,
        email: `prodsmoke${suffix}@smoketest.local`,
        name: 'Prod Smoke',
      },
    });
    userId = user.id;
    mockedSession.mockResolvedValue({ user: { id: userId } });
  });

  afterAll(async () => {
    // Rydd opp: profil, metrik-k-logs frå denne køyren, og brukaren selv.
    try {
      await prisma.profile.deleteMany({ where: { userId } });
      await prisma.systemLog.deleteMany({
        where: { module: 'metric', createdAt: { gte: runStart } },
      });
      await prisma.user.delete({ where: { id: userId } });
    } catch {
      /* best-effort */
    }
    const usersAfter = await prisma.user.count();
    // eslint-disable-next-line no-console
    console.log(`[prod-smoke] Brukere før/etter: ${usersBefore}/${usersAfter} (må være like)`);
    await prisma.$disconnect();
  });

  // Nøyaktig produksjonspayload (frå OnboardingFlow / seed-skriptet):
  // age som streng, bare 5 BFI-items, Oslo 0150.
  const prodBody = {
    basic: {
      identityName: 'Kari Solberg',
      age: '32',
      gender: 'female',
      seekingGender: 'male',
      height: 175,
      bodyType: 'normal',
      lifestyle: 'aktiv',
      smoking: 'nei',
      religion: 'livssynsnøytral',
      children: 'nei',
      wantChildren: 'ja',
      city: 'Oslo',
      postalCode: '0150',
      distancePref: 100,
      agePrefMin: 25,
      agePrefMax: 45,
    },
    personlighet: { selfDesc: 'En rolig, reflektert person som verdsetter ærlighet og dype samtaler.' },
    livssituasjon: { workType: 'fast jobb', dailyRoutine: 'strukturert med fleksibilitet' },
    tilknytning: { safetyNeed: 'å føle meg sett og hørt', insecurityTrigger: 'usikkerhet og ambivalens' },
    kommunikasjon: { calmingHelp: 'rolige samtaler', trigger: 'usikkerhet og ambivalens', trustBuilder: 'å føle meg sett og hørt' },
    kjaerlighet: { loveGive: 'ord som oppmuntrer', loveReceive: 'kjærlige handlinger', closenessBuilder: 'å tilbringe kvalitetstid sammen', distanceCreator: 'arbeidspress og stress', smallThing: 'en god kopp kaffe sammen' },
    livsstil: { highPriority: 'familie', lowPriority: 'karriere', goodEveryday: 'rolige dager med god mat', desiredLifestyle: 'trygt og forutsigbart', undesiredLifestyle: 'kaos og stress' },
    relasjonsStil: { relationshipSeeking: 'en stabil, ærlig relasjon', closenessNeed: 'moderat', independenceBalance: 'balanse mellom oss og meg' },
    fremtid: { futureVision: 'bygge noe varig med det rette mennesket', dreamGoal: 'et hjem vi er stolte av', buildTogether: 'verdier og hverdagsglede', experienceAlone: 'reise alene en gang i blant', experienceTogether: 'reise og oppleve sammen' },
    humor: { laughterTrigger: 'selvironi', quirkyHabit: 'samteller om rare ord', guiltyPleasure: 'dokumentarserier', totallyYou: 'friluftsliv', partnerWouldLaugh: 'over matlageret mitt' },
    grenser: { neverCrossBoundary: 'økonomisk press', understandPartnersBoundaries: 'rom for seg selv', limitations: 'trenger tid alene', partnerMustUnderstand: 'at ro og trygghet er viktig' },
    moden: { intimacySafety: 'trygghet og tillit', comfortableWith: 'å ta det rolig', boundary: 'ingen press overhodet', nearerType: 'fysisk nærhet', needsTime: 'ja, litt tid' },
    preferanser: { politicsImportance: 5, religionImportance: 3, dietPreference: 'normalt', sleepSchedule: 'natt', pets: 'ja', travelFreq: 'noen ganger', alcoholFreq: 'sjelden', ambitionLevel: 'moderat', structureSpontaneity: 'struktur', introExtrovert: 'introvert', attachmentStyle: 'sikker' },
    psychometrics: { bfi1: 4, bfi3: 5, bfi5: 2, bfi7: 3, bfi9: 4 },
  };

  function request(body: unknown): any {
    return new Request('http://localhost/api/profile/setup', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
  }

  it('onboarding-lagring i produksjon: 200 + profil + flagg i DB (Bug 1 er borte)', async () => {
    const res = await POST(request(prodBody));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);

    const profile = await prisma.profile.findUnique({ where: { userId } });
    expect(profile).not.toBeNull();
    expect(profile!.identityName).toBe('Kari Solberg');
    expect(profile!.age).toBe(32);
    expect(profile!.postalCode).toBe('0150');
    expect(profile!.bigFive).not.toBeNull();
    Object.values(profile!.bigFive as Record<string, number>).forEach((v) => {
      expect(Number.isFinite(v)).toBe(true);
    });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    expect(user!.onboardingComplete).toBe(true);
    expect(user!.deepProfileComplete).toBe(true);
    expect(user!.onboardingStep).toBe(10);
  });
});