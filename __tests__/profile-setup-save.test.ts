/**
 * ToSom — Bug 1: POST /api/profile/setup mot EKT DATABASE (ingen prisma-mock).
 *
 * Tidlegare testar (profile-setup-geo-b12) mocka prisma heilt bort, så den
 * faktiske DB-skrivinga (upsert create/update-greiner + DbNull-rydding +
 * user-flagg) vart aldri kørt. Denne testen køyrer den reelle rute-hendleren
 * mot ein ekte Postgres med eit fullstendig, realistisk payload (inkl. alle
 * 44 psykometriske items → scoreAll) og verifiserer slutt-tilstanden i DB-en.
 *
 * Kjør mot isolert test-DB (ikke dev!) via:
 *   DATABASE_URL="postgresql://tosom:tosom@localhost:5433/tosom_test" \
 *   npx jest profile-setup-save --runInBand
 */

jest.mock('@/lib/auth/session', () => ({
  getServerSession: jest.fn(),
}));

import { getServerSession } from '@/lib/auth/session';
import prisma from '@/lib/prisma';
import { POST } from '@/app/api/profile/setup/route';
import { ALL_ITEMS } from '@/lib/psychometrics/instruments';

const mockedSession = getServerSession as jest.Mock;

// Bygg eit fullt, gyldig payload som samsvarer med onboardingSetupSchema.
function fullBody(): Record<string, unknown> {
  // Psykometri: svar på ALLE 44 items (1–5), som OnboardingFlow sender.
  const psychometrics: Record<string, number> = {};
  ALL_ITEMS.forEach((item, i) => {
    psychometrics[item.id] = (i % 5) + 1; // 1..5
  });

  return {
    basic: {
      identityName: 'Reprobruker',
      age: 30,
      gender: 'Kvinne',
      seekingGender: 'Mann',
      height: 170,
      bodyType: 'slank',
      lifestyle: 'aktiv',
      smoking: 'røyker ikke',
      religion: 'ateist',
      children: 'ingen',
      wantChildren: 'vet ikke',
      city: 'Bergen',
      postalCode: '5003',
      // 100 km ligg innanfor både urban (30–500) og land (50–750)
      distancePref: 100,
      agePrefMin: 23,
      agePrefMax: 40,
    },
    personlighet: {
      selfDesc: 'Jeg liker natur, musikk og gode samtaler om livet.',
      energyGiver: 'venner og ro',
      energyDrainer: 'støy og kaos',
      pressureReact: 'blir rolig',
      quirk: 'mumler for meg selv',
    },
    livssituasjon: {
      workType: 'fulltid',
      housingType: 'leilighet',
      householdSize: '2 personer',
      economicStability: 'stabil',
      responsibilities: 'jobb og husdyr',
      dailyRoutine: 'regelrett med rom for impromu',
    },
    tilknytning: {
      safetyNeed: 'at du er der',
      insecurityTrigger: 'når du blir stum',
      sadnessNeed: 'trygghet og ro',
      stressNeed: 'rom for meg selv',
      importantBoundary: 'respekt alltid',
    },
    kommunikasjon: {
      calmingHelp: 'berøring og ord',
      trigger: 'utrygghet',
      trustBuilder: 'trygghet over tid',
    },
    kjaerlighet: {
      loveGive: 'tid og oppmerksomhet',
      loveReceive: 'ord og berøring',
      closenessBuilder: 'åpen samtale',
      distanceCreator: 'arbeid og stress',
      smallThing: 'en kopp kaffe sammen',
    },
    livsstil: {
      highPriority: 'trygghet',
      lowPriority: 'status',
      goodEveryday: 'ro og god mat',
      desiredLifestyle: 'familieliv',
      undesiredLifestyle: 'konflikt',
    },
    relasjonsStil: {
      relationshipSeeking: 'fast parforhold',
      closenessNeed: 'middels',
      independenceBalance: 'balanse',
    },
    fremtid: {
      futureVision: 'et trygt hjem vi bygger sammen',
      dreamGoal: 'reise mye sammen',
      buildTogether: 'en familie',
      experienceAlone: 'naturen og fjellet',
      experienceTogether: 'god mat og musikk',
    },
    humor: {
      laughterTrigger: 'ironi',
      quirkyHabit: 'danser i kjøkkenet',
      guiltyPleasure: 'serier om natten',
      totallyYou: 'rolig og lojalt',
      partnerWouldLaugh: 'at jeg tar alt for langt på alvor',
    },
    grenser: {
      neverCrossBoundary: 'respekt',
      understandPartnersBoundaries: 'ja',
      limitations: 'trenger tid etter dag',
      partnerMustUnderstand: 'at trygghet er viktig for meg',
    },
    moden: {
      intimacySafety: 'jeg trenger å vite at det er trygt',
      comfortableWith: 'å dele følelser',
      boundary: 'fysisk press',
      nearerType: 'ord og berøring',
      needsTime: 'en pause nå og da',
    },
    preferanser: {
      politicsImportance: 3,
      religionImportance: 1,
      dietPreference: 'vegetar',
      sleepSchedule: 'fugl',
      pets: 'har en katte',
      travelFreq: 'par ganger i året',
      alcoholFreq: 'sjelden',
      ambitionLevel: 'målbevisst',
      structureSpontaneity: 'struktur',
      introExtrovert: 'introvert',
      attachmentStyle: 'sikre',
    },
    psychometrics,
  };
}

function request(body: unknown): any {
  return new Request('http://localhost/api/profile/setup', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/profile/setup — EKT DB (bug 1 repro/regressjon)', () => {
  const suffix = Date.now();
  const runStart = new Date();
  let userId: string;

  beforeAll(async () => {
    const url = (process.env.DATABASE_URL || '').replace(/:[^:@]+@/, ':***@');
    // eslint-disable-next-line no-console
    console.log('[profile-setup-save] DATABASE_URL =', url);
    // Opprett ein reell brukar i DB-en (FK-mål for profile.upsert).
    const user = await prisma.user.create({
      data: { id: `save-${suffix}`, email: `save${suffix}@test.local`, name: 'Save Test' },
    });
    userId = user.id;
    mockedSession.mockResolvedValue({ user: { id: userId } });
  });

  afterAll(async () => {
    // Rydd opp i same DB (self-contained — rører ingen annan data).
    try {
      await prisma.profile.deleteMany({ where: { userId } });
      // Berre metrikkk-logs FRÅ denne køyren (withMetrics skrivar via prisma)
      await prisma.systemLog.deleteMany({
        where: { module: 'metric', createdAt: { gte: runStart } },
      });
      await prisma.user.delete({ where: { id: userId } });
    } catch {
      /* best-effort */
    }
    await prisma.$disconnect();
  });

  it('SKENARIO A — ny brukar (create-gren): 200 + profil + flagg i DB', async () => {
    const res = await POST(request(fullBody()));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);

    const profile = await prisma.profile.findUnique({ where: { userId } });
    expect(profile).not.toBeNull();
    expect(profile!.identityName).toBe('Reprobruker');
    expect(profile!.age).toBe(30);
    expect(profile!.postalCode).toBe('5003');
    expect(profile!.deepProfileStep).toBe('SUMMARY');
    // Psykometri skåra og lagret
    expect(profile!.psychometricAnswers).not.toBeNull();
    expect(profile!.bigFive).not.toBeNull();
    expect(profile!.psychometricVersion).toBe('2026-08-22.v1');

    const user = await prisma.user.findUnique({ where: { id: userId } });
    expect(user!.onboardingComplete).toBe(true);
    expect(user!.deepProfileComplete).toBe(true);
    expect(user!.onboardingStep).toBe(10);
  });

  it('SKENARIO B — brukar med draft (update-gren): 200 + draft rydda + data oppdatert', async () => {
    // Simulér draft-autosave: profilen finst med onboardingDraft sett.
    await prisma.profile.update({
      where: { userId },
      data: { onboardingDraft: { step: 12, data: { identityName: 'Gammalt' } } },
    });

    const res = await POST(request(fullBody()));
    expect(res.status).toBe(200);

    const profile = await prisma.profile.findUnique({ where: { userId } });
    expect(profile!.onboardingDraft).toBeNull(); // DbNull-rydding fungerte
    expect(profile!.identityName).toBe('Reprobruker');
  });

  it('SKENARIO C — ugyldig payload (tulle-tekst i alder): 400 med detaljar, ikkje 500', async () => {
    const body = fullBody();
    (body.basic as Record<string, unknown>).age = 'trettiti';
    const res = await POST(request(body));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(Array.isArray(json.details)).toBe(true);
    expect(json.details.length).toBeGreaterThan(0);
  });

  // DETTE ER NØYAKTIGT det OnboardingFlow/seed-skriptet sender i produksjon:
  //  - age som STRENG
  //  - berre 5 psykometriske items (bfi1/3/5/7/9) — ikkje alle 44
  //  - kommunikasjon-med calmingHelp/trigger/trustBuilder (ikkje kjærlighetsspråk-nøkler)
  //  - Oslo 0150
  it('SKENARIO D — NØYAKTIG produksjonspayload: 200 (bevis: kode er korrekt)', async () => {
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

    const res = await POST(request(prodBody));
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);

    const profile = await prisma.profile.findUnique({ where: { userId } });
    expect(profile!.identityName).toBe('Kari Solberg');
    expect(profile!.age).toBe(32); // strengen '32' ble coerced
    expect(profile!.postalCode).toBe('0150');
    // Psykometri med berre 5 items — alle skårer må vere endlege tal (ikkje NaN)
    const bigFive = profile!.bigFive as Record<string, number>;
    expect(bigFive).toBeDefined();
    Object.values(bigFive).forEach((v) => {
      expect(Number.isFinite(v as number)).toBe(true);
    });
    const attachment = profile!.attachment as Record<string, unknown>;
    expect(attachment).toBeDefined();
  });
});


