/**
 * WP1 (2026-08-24) — Nye dealbreakere + fiksert sikkerhetsnivå-logikk
 *
 * 1. checkGenderSeeking: steg 1 spør om kjønn og hvem du søker — en bruker
 *    som søker kvinner skal ikke matches med en som ikke søker menn.
 *    Bidireksjonell; åpne valg matcher ethvert kjent kjønn;
 *    manglende data blokkerer aldri (forsvarlig, som radius).
 * 2. checkAgePreference: agePrefMin/agePrefMax (deepProfileData) må dekke
 *    kandidatens alder. Bidireksjonell; manglende data blokkerer aldri.
 * 3. checkSecurityLevelGap: normaliserer norsk/engelsk/tysk staving
 *    (sikker/usikker/trygg/ukomfortabel) — tidligere ga ukjente verdier
 *    stille NaN og hoppet sjekken over.
 * 4. mapRejectReason: nye kategorier 'kjonn' og 'alder' for S-17-loggen.
 */

import { sjekkAlleDealbreakers } from '@/lib/matching/dealbreaker';
import { mapRejectReason } from '@/app/api/cron/matching/rejectReason';
import type { ProfileData } from '@/lib/matching/types';

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
    lifeSituation: null, // Ingen kjønn/seekingGender per default
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
    deepProfileData: null, // Ingen alderspreferanse per default
    ...overrides,
  };
}

describe('WP1 — kjønnspreferanse (checkGenderSeeking)', () => {
  it('skal tillate match når begge søker den andre', () => {
    const a = makeProfile({ userId: 'kv-a', lifeSituation: { gender: 'Kvinne', seekingGender: 'Mann' } });
    const b = makeProfile({ userId: 'man-b', lifeSituation: { gender: 'Mann', seekingGender: 'Kvinne' } });

    const result = sjekkAlleDealbreakers(a, b);
    expect(result.hasDealbreaker).toBe(false);
  });

  it('skal blokkere mann som ikke søker kvinner, mot en kvinne som søker menn', () => {
    const a = makeProfile({ userId: 'kv-a', lifeSituation: { gender: 'Kvinne', seekingGender: 'Mann' } });
    const b = makeProfile({ userId: 'man-b', lifeSituation: { gender: 'Mann', seekingGender: 'Mann' } });

    // Blokkert begge veier (kvinne: søker mann ✓ / mann: søker mann, hun er kvinne ✗)
    const ab = sjekkAlleDealbreakers(a, b);
    const ba = sjekkAlleDealbreakers(b, a);
    expect(ab.hasDealbreaker).toBe(true);
    expect(ba.hasDealbreaker).toBe(true);
    expect(ab.reason).toContain('Kjønnspreferanse');
  });

  it('skal blokkere to menn hvor den ene ikke søker menn (bidireksjonell)', () => {
    const a = makeProfile({ userId: 'man-a', lifeSituation: { gender: 'Mann', seekingGender: 'Kvinne' } });
    const b = makeProfile({ userId: 'man-b', lifeSituation: { gender: 'Mann', seekingGender: 'Kvinne' } });

    const result = sjekkAlleDealbreakers(a, b);
    expect(result.hasDealbreaker).toBe(true);
    expect(result.reason).toContain('Kjønnspreferanse');
  });

  it('skal tillate «Alle kjønner» mot ethvert kjent kjønn', () => {
    const a = makeProfile({ userId: 'open-a', lifeSituation: { gender: 'Kvinne', seekingGender: 'Alle-kjon' } });
    // b søker kvinner — a er kvinne, så begge retninger er OK
    const b = makeProfile({ userId: 'man-b', lifeSituation: { gender: 'Mann', seekingGender: 'Kvinne' } });

    expect(sjekkAlleDealbreakers(a, b).hasDealbreaker).toBe(false);
    expect(sjekkAlleDealbreakers(b, a).hasDealbreaker).toBe(false);
  });

  it('skal tillate åpent legacy «begge» og «Kjemisk-tiltrekning»', () => {
    const openBegge = makeProfile({ userId: 'a', lifeSituation: { gender: 'Kvinne', seekingGender: 'begge' } });
    const openKjemisk = makeProfile({ userId: 'b', lifeSituation: { gender: 'Mann', seekingGender: 'Kjemisk-tiltrekning' } });
    // partneren søker også åpent — ingen retning kan blokkere
    const partner = makeProfile({ userId: 'c', lifeSituation: { gender: 'Ikke-binær', seekingGender: 'Alle-kjon' } });

    expect(sjekkAlleDealbreakers(openBegge, partner).hasDealbreaker).toBe(false);
    expect(sjekkAlleDealbreakers(openKjemisk, partner).hasDealbreaker).toBe(false);
  });

  it('skal blokkere ikke-binær mot spesifikt søk (D1: eksplisitt valg respekteres)', () => {
    const seeker = makeProfile({ userId: 'kv-a', lifeSituation: { gender: 'Kvinne', seekingGender: 'Mann' } });
    const nkb = makeProfile({ userId: 'nkb-b', lifeSituation: { gender: 'Ikke-binær', seekingGender: 'Alle-kjon' } });

    // nkb søker alle ✓, men kv søker mann — nkb er ikke mann ✗
    const result = sjekkAlleDealbreakers(nkb, seeker);
    expect(result.hasDealbreaker).toBe(true);
    expect(result.reason).toContain('Kjønnspreferanse');
  });

  it('skal håndtere blandet vokabular (UI + legacy + seed)', () => {
    // UI: Kvinne → Mann; legacy: man; seed: female
    const a = makeProfile({ userId: 'kv-ui', lifeSituation: { gender: 'Kvinne', seekingGender: 'Mann' } });
    const b = makeProfile({ userId: 'man-legacy', lifeSituation: { gender: 'man', seekingGender: 'kvinne' } });
    const c = makeProfile({ userId: 'female-seed', lifeSituation: { gender: 'female', seekingGender: 'male' } });

    expect(sjekkAlleDealbreakers(a, b).hasDealbreaker).toBe(false);
    expect(sjekkAlleDealbreakers(b, c).hasDealbreaker).toBe(false);
    expect(sjekkAlleDealbreakers(c, b).hasDealbreaker).toBe(false);
  });

  it('skal IKKE blokkere når seekingGender mangler (defensivt)', () => {
    // a mangler søk → sjekken hopper over a. b søker kvinner, a er kvinne ✓
    const a = makeProfile({ userId: 'a', lifeSituation: { gender: 'Kvinne' } });
    const b = makeProfile({ userId: 'b', lifeSituation: { gender: 'Kvinne', seekingGender: 'Kvinne' } });

    expect(sjekkAlleDealbreakers(a, b).hasDealbreaker).toBe(false);
  });

  it('skal IKKE blokkere når partnerens kjønn mangler (defensivt)', () => {
    // seeker søker menn, men unknown mangler kjønn → blokkerer ikke (defensivt).
    // unknown søker kvinner, seeker er kvinne → den andre retningen er OK.
    const seeker = makeProfile({ userId: 'kv-a', lifeSituation: { gender: 'Kvinne', seekingGender: 'Mann' } });
    const unknown = makeProfile({ userId: 'b', lifeSituation: { seekingGender: 'Kvinne' } });

    expect(sjekkAlleDealbreakers(unknown, seeker).hasDealbreaker).toBe(false);
  });

  it('skal IKKE blokkere når lifeSituation er null (eksisterende data)', () => {
    const a = makeProfile({ userId: 'a', lifeSituation: null });
    const b = makeProfile({ userId: 'b', lifeSituation: null });

    expect(sjekkAlleDealbreakers(a, b).hasDealbreaker).toBe(false);
  });
});

describe('WP1 — alderspreferanse (checkAgePreference)', () => {
  it('skal blokkere kandidat under minste alder', () => {
    const seeker = makeProfile({ userId: 'seeker', age: 35, deepProfileData: { agePrefMin: 28, agePrefMax: 45 } });
    const young = makeProfile({ userId: 'young', age: 25 });

    const result = sjekkAlleDealbreakers(seeker, young);
    expect(result.hasDealbreaker).toBe(true);
    expect(result.reason).toContain('Alderspreferanse');
    expect(result.reason).toContain('25');
  });

  it('skal blokkere kandidat over maks alder', () => {
    const seeker = makeProfile({ userId: 'seeker', age: 26, deepProfileData: { agePrefMin: 21, agePrefMax: 30 } });
    const older = makeProfile({ userId: 'older', age: 45 });

    const result = sjekkAlleDealbreakers(older, seeker);
    expect(result.hasDealbreaker).toBe(true);
    expect(result.reason).toContain('Alderspreferanse');
  });

  it('skal tillate kandidat innenfor intervallet', () => {
    const a = makeProfile({ userId: 'a', age: 30, deepProfileData: { agePrefMin: 25, agePrefMax: 40 } });
    const b = makeProfile({ userId: 'b', age: 32, deepProfileData: { agePrefMin: 25, agePrefMax: 45 } });

    expect(sjekkAlleDealbreakers(a, b).hasDealbreaker).toBe(false);
    expect(sjekkAlleDealbreakers(b, a).hasDealbreaker).toBe(false);
  });

  it('skal være bidireksjonell: blokkere selv om én retning er innenfor', () => {
    // a (25) er innenfor b sine grenser (21–60), men b (45) er OVER a sine (21–40)
    const a = makeProfile({ userId: 'a', age: 25, deepProfileData: { agePrefMin: 21, agePrefMax: 40 } });
    const b = makeProfile({ userId: 'b', age: 45, deepProfileData: { agePrefMin: 21, agePrefMax: 60 } });

    expect(sjekkAlleDealbreakers(a, b).hasDealbreaker).toBe(true);
    expect(sjekkAlleDealbreakers(b, a).hasDealbreaker).toBe(true);
  });

  it('skal IKKE blokkere uten alderspreferanse (eksisterende data)', () => {
    const a = makeProfile({ userId: 'a', age: 30 });
    const b = makeProfile({ userId: 'b', age: 50 });

    expect(sjekkAlleDealbreakers(a, b).hasDealbreaker).toBe(false);
  });

  it('skal IKKE blokkere når kandidatens alder mangler (defensivt)', () => {
    const seeker = makeProfile({ userId: 'seeker', deepProfileData: { agePrefMin: 28, agePrefMax: 45 } });
    const noAge = makeProfile({ userId: 'no-age', age: null });

    expect(sjekkAlleDealbreakers(seeker, noAge).hasDealbreaker).toBe(false);
  });

  it('skal håndtere streng-verdier i deepProfileData', () => {
    const seeker = makeProfile({ userId: 'seeker', deepProfileData: { agePrefMin: '28', agePrefMax: '45' } });
    const young = makeProfile({ userId: 'young', age: 25 });

    const result = sjekkAlleDealbreakers(seeker, young);
    expect(result.hasDealbreaker).toBe(true);
    expect(result.reason).toContain('Alderspreferanse');
  });
});

describe('WP1 — sikkerhetsnivå-normalisering (checkSecurityLevelGap)', () => {
  it('skal blokkere norske verdier usikker vs sikker (gap 2)', () => {
    const a = makeProfile({ userId: 'a', securityLevel: 'usikker' });
    const b = makeProfile({ userId: 'b', securityLevel: 'sikker' });

    const result = sjekkAlleDealbreakers(a, b);
    expect(result.hasDealbreaker).toBe(true);
    expect(result.reason).toContain('Sikkerhetsnivå');
  });

  it('skal blokkere trygg vs ukomfortabel (gap 2)', () => {
    const a = makeProfile({ userId: 'a', securityLevel: 'trygg' });
    const b = makeProfile({ userId: 'b', securityLevel: 'ukomfortabel' });

    expect(sjekkAlleDealbreakers(a, b).hasDealbreaker).toBe(true);
  });

  it('skal tillate sikker vs ambivalert (gap 1)', () => {
    const a = makeProfile({ userId: 'a', securityLevel: 'sikker' });
    const b = makeProfile({ userId: 'b', securityLevel: 'ambivalert' });

    expect(sjekkAlleDealbreakers(a, b).hasDealbreaker).toBe(false);
  });

  it('skal håndtere blandede språk og case: Secure vs usikker (gap 2)', () => {
    const a = makeProfile({ userId: 'a', securityLevel: 'Secure' });
    const b = makeProfile({ userId: 'b', securityLevel: 'usikker' });

    expect(sjekkAlleDealbreakers(a, b).hasDealbreaker).toBe(true);
  });

  it('skal IKKE blokkere (og ikke kaste) på ukjent verdi', () => {
    const a = makeProfile({ userId: 'a', securityLevel: 'nøkkelfri-tilknytning' });
    const b = makeProfile({ userId: 'b', securityLevel: 'secure' });

    const result = sjekkAlleDealbreakers(a, b);
    expect(result.hasDealbreaker).toBe(false);
  });
});

describe('WP1 — mapRejectReason: nye kategorier', () => {
  it('skal kartlegge Kjønnspreferanse til kjonn', () => {
    expect(mapRejectReason('Kjønnspreferanse: søker «Kvinne», men kandidaten er «Mann» (user-a)')).toBe('kjonn');
  });

  it('skal kartlegge Alderspreferanse til alder', () => {
    expect(mapRejectReason('Alderspreferanse: kandidat er 25 år, under minste alder 28 for user-a')).toBe('alder');
  });
});