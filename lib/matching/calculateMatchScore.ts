import { User, Profile } from "@prisma/client";

/**
 * MatchBlocks — the raw compatibility breakdown across all scoring blocks.
 */
export type MatchBlocks = {
  basic: number;
  lifestyle: number;
  interests: number;
  location: number;
  needs: number;
  boundaries: number;
  intentions: number;
};

/**
 * calculateMatchScore
 *
 * Beregner kompatibilitet mellom to brukarar basert på:
 *   1. Grunnleggjande kompatibilitet (40 poeng) — kjønn, alder
 *   2. Livsstil (30 poeng)        — livsstils- og stil-felt
 *   3. Interesser (20 poeng)      — overlap i interests
 *   4. Lokasjon (10 poeng)        — samstade
 *   5. Behovskompatibilitet (20 poeng) — overlap i behov
 *   6. Grensekompatibilitet (10 poeng) — overlap i grenser
 *   7. Intensjonskompatibilitet (10 poeng) — overlap i intensjonar
 *
 * Maks 140 poeng innan normalisering, sluttresultat 0–100.
 * Ein rein funksjon utan sideffektar, lett å justere vektar og tersklar seinare.
 */
export function calculateMatchScore(
  userA: User & { profile: Profile | null },
  userB: User & { profile: Profile | null },
  opts?: { returnBlocks?: boolean }
): number | MatchBlocks {
  const blocks: MatchBlocks = {
    basic: 0,
    lifestyle: 0,
    interests: 0,
    location: 0,
    needs: 0,
    boundaries: 0,
    intentions: 0,
  };

  const a = userA.profile;
  const b = userB.profile;

  if (!a || !b) return opts?.returnBlocks ? blocks : 0;

  // ============
  // 1. GRUNNLEGGJANDE KOMPATIBILITET (maks 40 poeng)
  // ============

  // 1a. Kjønn-match (maks 25 poeng)
  // Placeholder for framtidig orienteringsmatch.
  if (a.gender && b.gender && a.gender === b.gender) {
    blocks.basic += 25;
  }

  // 1b. Alderskompatibilitet (maks 15 poeng)
  // Jo nærmare aldrane er, jo høgare score.
  const ageA = a.age || 0;
  const ageB = b.age || 0;
  const ageDiff = Math.abs(ageA - ageB);
  blocks.basic += Math.max(0, 15 - ageDiff);

  // ============
  // 2. LIVSTIL (maks 30 poeng)
  // ============
  // Samanliknar livsstil-felt frå Steg 3 og 4.
  // Kvart matchande livsstilstrekkk gjev 3 poeng.

  const lifestyleFields: (keyof Pick<
    Profile,
    | "jobStatus"
    | "livingSituation"
    | "children"
    | "lifeRhythm"
    | "activityLevel"
    | "socialLevel"
    | "financialStyle"
    | "weekendStyle"
    | "travelStyle"
    | "structureStyle"
    | "energyStyle"
    | "communicationStyle"
    | "planningStyle"
  >)[] = [
    "jobStatus",
    "livingSituation",
    "children",
    "lifeRhythm",
    "activityLevel",
    "socialLevel",
    "financialStyle",
    "weekendStyle",
    "travelStyle",
    "structureStyle",
    "energyStyle",
    "communicationStyle",
    "planningStyle",
  ];

  const matchedLifestyle = lifestyleFields.filter((field) => {
    const valA = a[field];
    const valB = b[field];
    return valA && valB && valA === valB;
  }).length;

  blocks.lifestyle = Math.min(matchedLifestyle * 3, 30);

  // ============
  // 3. INTERESSER (maks 20 poeng)
  // ============
  // Kvart felles interesse gjev 2 poeng, maks 10 interesse-par.
  const sharedInterests = a.interests.filter((interest) =>
    b.interests.includes(interest)
  );
  blocks.interests = Math.min(sharedInterests.length * 2, 20);

  // ============
  // 4. LOKASJON (maks 10 poeng)
  // ============
  // Ein fast bonus dersom begge er i same stad.
  if (a.location && b.location && a.location === b.location) {
    blocks.location += 10;
  }

  // ============
  // 5. BEHOVKOMPATIBILITET (maks 20 poeng)
  // ============
  // Samanliknar behov (f.eks. "trygghet", "rom", "struktur", "eventyr",
  // "emosjonell støtte", "selvstendighet"). Kvitt felles behov gjev 5 poeng.

  const needsA = (a as any).needs as string[] | undefined;
  const needsB = (b as any).needs as string[] | undefined;

  if (needsA && needsB && needsA.length > 0 && needsB.length > 0) {
    const sharedNeeds = needsA.filter((n) => needsB.includes(n));
    blocks.needs = Math.min(sharedNeeds.length * 5, 20);
  }

  // ============
  // 6. GRENSEKOMPATIBILITET (maks 10 poeng)
  // ============
  // Samanliknar grenser (f.eks. "ingen høyt konfliktnivå", "ingen rus",
  // "ingen uforutsigbarhet", "ingen sjalusi", "ingen økonomisk kaos").
  // Kvitt felles grense gjev 5 poeng.

  const boundariesA = (a as any).boundaries as string[] | undefined;
  const boundariesB = (b as any).boundaries as string[] | undefined;

  if (
    boundariesA &&
    boundariesB &&
    boundariesA.length > 0 &&
    boundariesB.length > 0
  ) {
    const sharedBoundaries = boundariesA.filter((bnd) =>
      boundariesB.includes(bnd)
    );
    blocks.boundaries = Math.min(sharedBoundaries.length * 5, 10);
  }

  // ============
  // 7. INTENSJONSKOMPATIBILITET (maks 10 poeng)
  // ============
  // Samanliknar intensjonar (f.eks. "langt forhold", "familie", "utforske",
  // "ta det rolig", "leve hver for seg, men sammen").
  // Kvitt felles intensjon gjev 5 poeng.

  const intentionsA = (a as any).intentions as string[] | undefined;
  const intentionsB = (b as any).intentions as string[] | undefined;

  if (
    intentionsA &&
    intentionsB &&
    intentionsA.length > 0 &&
    intentionsB.length > 0
  ) {
    const sharedIntentions = intentionsA.filter((i) =>
      intentionsB.includes(i)
    );
    blocks.intentions = Math.min(sharedIntentions.length * 5, 10);
  }

  // ============
  // NORMALISER TIL 0–100
  // ============
  const score = Math.min(
    blocks.basic +
      blocks.lifestyle +
      blocks.interests +
      blocks.location +
      blocks.needs +
      blocks.boundaries +
      blocks.intentions,
    100
  );

  if (opts?.returnBlocks) {
    return blocks;
  }

  return score;
}
