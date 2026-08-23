/**
 * E2E-verifisering av postalCode-fix mot kjorende dev-server (engangs-script)
 *
 * 1. Logger inn som engangsbruker verify.setup@tosom.no (auto-registrering)
 * 2. POST /api/profile/setup med nøyaktig det som den rettede frontenden sender
 * 3. Verifiserer DB-resultat (profil + onboardingComplete)
 * 4. Rydder opp: sletter engangsbrukeren
 *
 * Kjør: npx tsx scripts/e2e-verify-setup-fix.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const BASE = 'http://localhost:3000';
const EMAIL = 'verify.setup@tosom.no';
const PASSWORD = 'verify-setup-2026';

// Nøyaktig payloadform den rettede OnboardingFlow sender (med postalCode)
const payload = {
  basic: {
    identityName: 'Verifiseringsbruker', age: '30', gender: 'male', seekingGender: 'female',
    height: 180, bodyType: 'slank', lifestyle: 'aktiv', smoking: 'ne', religion: 'laik',
    children: 'nei', wantChildren: 'ja', city: 'Oslo', postalCode: '0150',
    distancePref: 100, agePrefMin: 23, agePrefMax: 40,
  },
  personlighet: { selfDesc: 'Jeg er en rolig, reflektert person som verdsetter ærlighet og dype samtaler.' },
  livssituasjon: { workType: 'fast jobb', housingType: 'leilighet', dailyRoutine: 'strukturert med fleksibilitet' },
  tilknytning: { safetyNeed: 'a føle meg sett og hørt', insecurityTrigger: 'usikkerhet og ambivalens' },
  kommunikasjon: { loveGive: 'ord som oppmuntrer', closenessBuilder: 'tilbringe kvalitetstid sammen' },
  kjaerlighet: { loveGive: 'ord som oppmuntrer', loveReceive: 'kjærlige handlinger', closenessBuilder: 'tilbringe kvalitetstid sammen', distanceCreator: 'arbeidspress og stress', smallThing: 'en god kopp kaffe sammen' },
  livsstil: { highPriority: 'familie', lowPriority: 'karriere', goodEveryday: 'rolige dager med god mat', desiredLifestyle: 'trygt og forutsigbart', undesiredLifestyle: 'kaos og stress' },
  relasjonsStil: { relationshipSeeking: 'en stabil, ærlig relasjon', closenessNeed: 'moderat', independenceBalance: 'balanse mellom oss og meg' },
  fremtid: { futureVision: 'bygge noe varig med rette menneske', dreamGoal: 'et hjem vi er stolte av', buildTogether: 'verdier og hverdagslykke', experienceAlone: 'reise alene en gang i blant', experienceTogether: 'reise og oppleve sammen' },
  humor: { laughterTrigger: 'selvironi', quirkyHabit: 'sannteller ord', guiltyPleasure: 'dokumentarserier', totallyYou: 'friluftsliv', partnerWouldLaugh: 'over maten' },
  grenser: { neverCrossBoundary: 'økonomisk press', understandPartnersBoundaries: 'rom for seg selv', limitations: 'trenger tid alene', partnerMustUnderstand: 'at ro og trygghet er viktig' },
  moden: { intimacySafety: 'trygghet og tillit', comfortableWith: 'a ta det rolig', boundary: 'ingen press overhodet', nearerType: 'fysisk nærhet', needsTime: 'ja, litt tid' },
  preferanser: { politicsImportance: 5, religionImportance: 3, dietPreference: 'normal', sleepSchedule: 'natt', pets: 'ja', travelFreq: 'noen ganger', alcoholFreq: 'sjelden', ambitionLevel: 'moderat', structureSpontaneity: 'struktur', introExtrovert: 'introvert', attachmentStyle: 'secure' },
  psychometrics: { bfi1: 4, bfi3: 5, bfi5: 2, bfi7: 3, bfi9: 4 },
};

async function deleteTestUser(userId: string) {
  await prisma.profile.deleteMany({ where: { userId } });
  await prisma.$executeRaw`DELETE FROM "Session" WHERE "userId" = ${userId}`;
  await prisma.$executeRaw`DELETE FROM "Account" WHERE "userId" = ${userId}`;
  await prisma.user.delete({ where: { id: userId } });
}

async function main() {
  let failed = false;

  // 0. Rydd opp eventuell gjenstand fra tidligere kjør
  const stale = await prisma.user.findUnique({ where: { email: EMAIL } });
  if (stale) {
    await deleteTestUser(stale.id);
    console.log('🧹 Slettet gjenstående engangsbruker fra tidligere kjør');
  }

  // 1. CSRF-token
  const csrfRes = await fetch(`${BASE}/api/auth/csrf`);
  const { csrfToken } = await csrfRes.json();
  const csrfCookies: string[] = csrfRes.headers.getSetCookie
    ? csrfRes.headers.getSetCookie()
    : [(csrfRes.headers.get('set-cookie') ?? '').split(';')[0]];
  const csrfCookie = csrfCookies[0].split(';')[0];

  // 2. Login (CredentialsProvider — auto-registrerer ny epost)
  const loginRes = await fetch(`${BASE}/api/auth/callback/credentials`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Cookie: csrfCookie },
    body: new URLSearchParams({ csrfToken, email: EMAIL, password: PASSWORD }),
    redirect: 'manual',
  });
  const setCookies: string[] = loginRes.headers.getSetCookie
    ? loginRes.headers.getSetCookie()
    : (loginRes.headers.get('set-cookie') ?? '').split(/,(?=[^,]+=)/).map((c) => c.split(';')[0]);
  const sessionCookie = setCookies.map((c) => c.split(';')[0]).find((c) => c.startsWith('authjs.session-token'));

  if (!sessionCookie) {
    console.log(`❌ Login feilet (status ${loginRes.status}, cookies: ${JSON.stringify(setCookies)})`);
    failed = true;
  } else {
    console.log('✅ Login OK — engangsbruker auto-registrert med session-cookie');
  }

  // 3. POST /api/profile/setup — nøyaktig som den rettede frontenden
  const setupRes = await fetch(`${BASE}/api/profile/setup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: sessionCookie ?? '' },
    body: JSON.stringify(payload),
  });
  const setupBody = await setupRes.text();
  console.log(`\nPOST /api/profile/setup → ${setupRes.status}`);
  console.log(`  svar: ${setupBody.slice(0, 300)}`);

  if (setupRes.status !== 200) {
    console.log('❌ Uventet status — fixen virker ikke i E2E');
    failed = true;
  } else {
    console.log('✅ Setup 200 — profilen ble lagret');
  }

  // 4. DB-verifisering
  const user = await prisma.user.findUnique({
    where: { email: EMAIL },
    include: { profile: true },
  });
  if (user?.profile) {
    const p = user.profile;
    console.log('\nDB-verifisering:');
    console.log(`  onboardingComplete=${user.onboardingComplete}, deepProfileComplete=${user.deepProfileComplete}`);
    console.log(`  profile.postalCode=${p.postalCode}, lat=${p.latitude}, lon=${p.longitude}`);
    console.log(`  deepProfileStep=${p.deepProfileStep}, psychometricVersion=${p.psychometricVersion}`);
    if (
      !user.onboardingComplete || !user.deepProfileComplete ||
      p.postalCode !== '0150' || p.deepProfileStep !== 'SUMMARY'
    ) {
      console.log('❌ DB-tilstanden stemmer ikke');
      failed = true;
    } else {
      console.log('✅ DB-tilstanden er korrekt — steg 13 → venterommet fungerer');
    }
  } else {
    console.log('❌ Funnet ikke bruker/profil i DB');
    failed = true;
  }

  // 5. Rydd opp (Profile og Session må bort før User — ingen cascade)
  if (user) {
    await deleteTestUser(user.id);
    const after = await prisma.user.findUnique({ where: { email: EMAIL } });
    console.log(`\n🧹 Engangsbruker slettet: ${after === null ? 'bekreftet' : 'FEILET'}`);
    if (after !== null) failed = true;
  }

  if (failed) process.exit(1);
  console.log('\nE2E-verifisering fullført: fixen virker fra login til lagret profil.');
}

main()
  .catch((e) => {
    console.error('E2E-feil:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
