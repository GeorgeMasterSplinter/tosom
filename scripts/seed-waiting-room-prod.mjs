/**
 * ToSom — Seed venterommet i produksjon (engangs-script)
 *
 * Registrarer to kompatible testbrukarar via offentlege API (autentisering med
 * beta-auto-registrering), fullfører profilen med nøyaktig same payload som
 * OnboardingFlow (/api/profile/setup), set de i kø (/api/journey/queue) og
 * verifiserer journeyState === 'QUEUED' via /api/dashboard/overview.
 *
 * Kjør: node scripts/seed-waiting-room-prod.mjs [BASE_URL]
 * Standard BASE_URL: https://www.tosom.no
 */

const BASE = process.argv[2] || 'https://www.tosom.no';
const PASSWORD = 'Tosom-venterom-2026!';

// To kompatible brukere: motsett kjønn/ønske, same postnummerområde (Oslo),
// alder innanfor hverandre sine preferansar — gjer at dealbreakers ikke blokkerer.
const USERS = [
  {
    email: 'kari.venterom.a@tosom.no',
    name: 'Kari Solberg',
    basic: { gender: 'female', seekingGender: 'male', age: 32 },
  },
  {
    email: 'ola.venterom.b@tosom.no',
    name: 'Ola Strand',
    basic: { gender: 'male', seekingGender: 'female', age: 34 },
  },
];

function buildPayload(u) {
  return {
    basic: {
      identityName: u.name,
      age: String(u.basic.age),
      gender: u.basic.gender,
      seekingGender: u.basic.seekingGender,
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
}

function cookiesFrom(res) {
  return (res.headers.getSetCookie ? res.headers.getSetCookie() : [])
    .map((c) => c.split(';')[0]);
}

async function login(email) {
  // 1. CSRF
  const csrfRes = await fetch(`${BASE}/api/auth/csrf`);
  const { csrfToken } = await csrfRes.json();
  const csrfCookie = cookiesFrom(csrfRes)[0];
  if (!csrfCookie) throw new Error(`Ingen csrf-cookie fra ${BASE}`);

  // 2. Credentials-login (auto-registrerer ny epost i beta)
  const loginRes = await fetch(`${BASE}/api/auth/callback/credentials`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Cookie: csrfCookie },
    body: new URLSearchParams({ csrfToken, email, password: PASSWORD }),
    redirect: 'manual',
  });
  const sessionCookie = cookiesFrom(loginRes).find((c) => c.includes('authjs.session-token'));
  if (!sessionCookie) {
    throw new Error(`Login feilet for ${email} (status ${loginRes.status})`);
  }
  return sessionCookie;
}

async function api(path, cookie, init = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init.headers || {}), Cookie: cookie },
  });
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch { /* ikke-JSON */ }
  return { status: res.status, json, text };
}

async function seedUser(u) {
  console.log(`\n── ${u.name} (${u.email}) ──`);
  const cookie = await login(u.email);
  console.log('  ✅ Innlogget (auto-registrering)');

  const setup = await api('/api/profile/setup', cookie, {
    method: 'POST',
    body: JSON.stringify(buildPayload(u)),
  });
  if (setup.status !== 200) {
    throw new Error(`/api/profile/setup ${setup.status}: ${setup.text.slice(0, 300)}`);
  }
  console.log(`  ✅ Profil lagret (setup → ${setup.status})`);

  const queueRes = await api('/api/journey/queue', cookie, { method: 'POST', body: '{}' });
  if (queueRes.status !== 200 || !queueRes.json?.success) {
    throw new Error(`/api/journey/queue ${queueRes.status}: ${queueRes.text.slice(0, 300)}`);
  }
  console.log(`  ✅ I kø: journeyState=${queueRes.json.journeyState}, matchQueuedAt=${queueRes.json.matchQueuedAt}`);

  const overview = await api('/api/dashboard/overview', cookie);
  const flat = JSON.stringify(overview.json ?? {});
  console.log(`  ℹ️  /api/dashboard/overview → ${overview.status}, journeyState=${flat.includes('QUEUED') ? 'QUEUED ✅' : '(sjekk svar manuelt)'}`);
  return { email: u.email, name: u.name };
}

async function main() {
  console.log(`Seeding av venterommet mot ${BASE} …`);
  const seeded = [];
  for (const u of USERS) {
    seeded.push(await seedUser(u));
  }
  console.log('\n════ OPPSUMMERING ════');
  console.log(`Klare i venterommet (${seeded.length} stk):`);
  for (const s of seeded) console.log(`  • ${s.name} — ${s.email} (passord: ${PASSWORD})`);
  console.log('\nNeste steg: admin-panelet → Verktøy → «Kjør matcherunden nå» (MIN_COHORT_SIZE=2).');
}

main().catch((e) => {
  console.error(`\n❌ Seed feilet: ${e.message}`);
  process.exit(1);
});