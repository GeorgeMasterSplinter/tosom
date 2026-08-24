// lib/profile/toOnboardingData.ts — WP2 (2026-08-24)
// Mapper: fullført Profile (DB-form) → flat onboarding-state (OnboardingFlow).
// Én kilde for «hva pre-fylles når brukeren går inn i onboarding på nytt»
// (redigering av fullførte profiler, kryss-enhets-nystart).
//
// Invers til mappingen i /api/profile/setup — HOLD PÅ PÅ HVIS EN AV DEM ENDRES.
// Felt som onboarding samler inn, men som setup ikke persisterer (f.eks.
// livssituasjonsgrid, deler av moden-steg) kan ikke pre-fylles og hoppes over
// bevisst (mangler i databasen, ikke i kartleggingen).

/** Prisma Profile-rad (det subsettet mapperen bruker). */
export interface ProfileRow {
  identityName: string | null;
  age: number | null;
  lifeSituation: Record<string, unknown> | null;
  lifestyle: Record<string, unknown> | null;
  personality: Record<string, unknown> | null;
  communication: Record<string, unknown> | null;
  intimacy: Record<string, unknown> | null;
  futureVision: Record<string, unknown> | null;
  boundaries: Record<string, unknown> | null;
  emotionalNeeds: Record<string, unknown> | null;
  securityLevel: string | null;
  psychometricAnswers: Record<string, unknown> | null;
  deepProfileData: Record<string, unknown> | null;
}

export interface ToOnboardingResult {
  /** Prefyllingsverdier — subsett av OnboardingFlow sine flate felt. */
  data: Record<string, unknown>;
  /** Om onboarding er fullført (profil finnes + flagget er satt). */
  complete: boolean;
}

/** number/string → non-empty string; ellers undefined (feltet pre-fylles ikke). */
function toStr(v: unknown): string | undefined {
  if (typeof v === 'number' && Number.isFinite(v)) return String(v);
  if (typeof v === 'string' && v.trim() !== '') return v;
  return undefined;
}

/** number/string-tall → tall; ellers undefined. */
function toNum(v: unknown): number | undefined {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string' && v.trim() !== '') {
    const n = Number(v);
    if (Number.isFinite(n)) return n;
  }
  return undefined;
}

export function toOnboardingData(
  profile: ProfileRow | null,
  complete: boolean
): ToOnboardingResult {
  if (!profile) return { data: {}, complete: false };

  const data: Record<string, unknown> = {};
  const put = (key: string, value: string | number | undefined) => {
    if (value !== undefined) data[key] = value;
  };

  // --- Steg 1: Grunnprofil -------------------------------------------------
  put('identityName', toStr(profile.identityName));
  // Onboarding-UI-et bruker string-alder
  put('age', toStr(profile.age));

  const ls = profile.lifeSituation;
  put('gender', toStr(ls?.gender));
  put('seekingGender', toStr(ls?.seekingGender));
  put('city', toStr(ls?.city));

  const lo = profile.lifestyle;
  put('height', toStr(lo?.height));
  put('bodyType', toStr(lo?.bodyType));
  // Kolonnen heter lifestyleType, onboarding-feltet heter lifestyle
  put('lifestyle', toStr(lo?.lifestyleType));
  put('smoking', toStr(lo?.smoking));
  put('children', toStr(lo?.children));
  put('wantChildren', toStr(lo?.wantChildren));
  // Livsstil & verdier (steg 5a) — additive nøkler i lifestyle-kolonnen
  put('highPriority', toStr(lo?.highPriority));
  put('lowPriority', toStr(lo?.lowPriority));
  put('goodEveryday', toStr(lo?.goodEveryday));
  put('desiredLifestyle', toStr(lo?.desiredLifestyle));
  put('undesiredLifestyle', toStr(lo?.undesiredLifestyle));

  const pe = profile.personality;
  put('selfDesc', toStr(pe?.selfDesc));
  put('energyGiver', toStr(pe?.energyGiver));
  put('energyDrainer', toStr(pe?.energyDrainer));
  put('pressureReact', toStr(pe?.pressureReact));
  put('quirk', toStr(pe?.quirk));

  const en = profile.emotionalNeeds;
  const co = profile.communication;
  // Invers til setup-rutens kommunikasjon-mapping:
  // calmingHelp=comfortableWith, trigger=insecurityTrigger, trustBuilder=safetyNeed.
  // emotionalNeeds er kanonisk for insecurity/safety (samsvarer 1:1 i payloadet).
  put('comfortableWith', toStr(co?.calmingHelp));
  put('insecurityTrigger', toStr(en?.insecurityTrigger) ?? toStr(co?.trigger));
  put('safetyNeed', toStr(en?.safetyNeed) ?? toStr(co?.trustBuilder));
  put('sadnessNeed', toStr(en?.sadnessNeed));
  put('stressNeed', toStr(en?.stressNeed));
  put('importantBoundary', toStr(en?.importantBoundary));

  const in_ = profile.intimacy;
  put('loveGive', toStr(in_?.loveGive));
  put('loveReceive', toStr(in_?.loveReceive));
  put('closenessBuilder', toStr(in_?.closenessBuilder));
  put('distanceCreator', toStr(in_?.distanceCreator));
  put('smallThing', toStr(in_?.smallThing));

  const fv = profile.futureVision;
  put('futureVision', toStr(fv?.futureVision));
  put('dreamGoal', toStr(fv?.dreamGoal));
  put('buildTogether', toStr(fv?.buildTogether));
  put('experienceAlone', toStr(fv?.experienceAlone));
  put('experienceTogether', toStr(fv?.experienceTogether));

  // boundaries-kolonnen bærer både humor (steg 7) og grenser (steg 8a)
  const bd = profile.boundaries;
  put('laughterTrigger', toStr(bd?.laughterTrigger));
  put('quirkyHabit', toStr(bd?.quirkyHabit));
  put('guiltyPleasure', toStr(bd?.guiltyPleasure));
  put('totallyYou', toStr(bd?.totallyYou));
  put('partnerWouldLaugh', toStr(bd?.partnerWouldLaugh));
  put('neverCrossBoundary', toStr(bd?.neverCrossBoundary));
  put('understandPartnersBoundaries', toStr(bd?.understandPartnersBoundaries));
  put('limitations', toStr(bd?.limitations));
  put('partnerMustUnderstand', toStr(bd?.partnerMustUnderstand));

  const dp = profile.deepProfileData;
  put('distancePref', toNum(dp?.distancePref));
  put('agePrefMin', toNum(dp?.agePrefMin));
  put('agePrefMax', toNum(dp?.agePrefMax));
  put('religion', toStr(dp?.religion));
  put('politicsImportance', toNum(dp?.politicsImportance));
  put('religionImportance', toNum(dp?.religionImportance));
  put('dietPreference', toStr(dp?.dietPreference));
  put('sleepSchedule', toStr(dp?.sleepSchedule));
  put('pets', toStr(dp?.pets));
  put('travelFreq', toStr(dp?.travelFreq));
  put('alcoholFreq', toStr(dp?.alcoholFreq));
  put('ambitionLevel', toStr(dp?.ambitionLevel));
  put('structureSpontaneity', toStr(dp?.structureSpontaneity));
  put('introExtrovert', toStr(dp?.introExtrovert));

  // Relasjonsstil (steg 5b) — persisteres som additiv objekt-nøkkel
  const rs = dp?.relasjonsStil;
  if (rs && typeof rs === 'object' && !Array.isArray(rs)) {
    const rsObj = rs as Record<string, unknown>;
    put('relationshipSeeking', toStr(rsObj.relationshipSeeking));
    put('closenessNeed', toStr(rsObj.closenessNeed));
    put('independenceBalance', toStr(rsObj.independenceBalance));
  }

  // attachmentStyle ← securityLevel (setup skriver preferanser.attachmentStyle
  // || 'secure' — verdiene round-trip likevel tapfritt)
  put('attachmentStyle', toStr(profile.securityLevel));

  // Rå psykometriske svar (44 items, 1–5) → flate data[item.id]
  const pa = profile.psychometricAnswers;
  if (pa && typeof pa === 'object' && !Array.isArray(pa)) {
    for (const [itemId, v] of Object.entries(pa)) {
      const n = toNum(v);
      if (n !== undefined && n >= 1 && n <= 5) put(itemId, n);
    }
  }

  return { data, complete };
}