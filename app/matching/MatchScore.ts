/**
 * ToSom -- MatchScore
 * Bereknar matchscore mellom to brukarar basert på forskningsbasert profil.
 */

/**
 * Profil-data interface for matching.
 * Samsvarer med Profile- modellen i Prisma.
 */
export interface ProfileData {
  identityName?: string | null;
  age?: number | null;
  lifeSituation?: Record<string, unknown> | null;
  lifestyle?: Record<string, unknown> | null;
  personality?: Record<string, unknown> | null;
  relationshipStyle?: string | null;
  communication?: Record<string, unknown> | null;
  intimacy?: Record<string, unknown> | null;
  futureVision?: Record<string, unknown> | null;
  boundaries?: Record<string, unknown> | null;
  emotionalNeeds?: Record<string, unknown> | null;
  lifeRhythm?: string | null;
  maturityLevel?: number | null;
  securityLevel?: string | null;
  photoUrl?: string | null;
  bio?: string | null;
  interests?: string[];
}

/**
 * Sammenliknar to tekst-strenger og returnerar ein score 0-100.
 * Enkel semantic-match basert på overlap og liknande ord.
 */
export function compareText(a?: string | null, b?: string | null): number {
  if (!a || !b) return 50; // neutral ved manglande data
  const norm = (s: string) => s.toLowerCase().trim();
  const aNorm = norm(a);
  const bNorm = norm(b);
  if (aNorm === bNorm) return 100;
  // Delvis overlap
  const aWords = new Set(aNorm.split(/\s+/));
  const bWords = new Set(bNorm.split(/\s+/));
  let matches = 0;
  for (const w of aWords) {
    if (bWords.has(w)) matches++;
  }
  const overlap = matches / Math.max(aWords.size, bWords.size);
  return Math.round(Math.min(overlap * 100, 100));
}

/**
 * Sammenliknar preferanse-data (JSON) og returnerar score 0-100.
 */
export function comparePreferences(a?: Record<string, unknown> | null, b?: Record<string, unknown> | null): number {
  if (!a || !b) return 50;
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length === 0 || bKeys.length === 0) return 50;
  let matches = 0;
  for (const k of aKeys) {
    if (b[k] !== undefined && String(a[k]) === String(b[k])) matches++;
  }
  return Math.round((matches / Math.max(aKeys.length, bKeys.length)) * 100);
}

/**
 * Hent livsstil-data fra profil.
 */
function getLifestyle(profile: ProfileData): number {
  if (!profile.lifestyle) return 50;
  const l = profile.lifestyle as Record<string, number | string>;
  // Samle ulike livsstil-dimensjonar
  const keys = Object.keys(l);
  if (keys.length === 0) return 50;
  let total = 0;
  for (const k of keys) {
    const v = l[k];
    if (typeof v === 'number') total += v;
    else total += 50;
  }
  return Math.round(total / keys.length);
}

/**
 * Hent kommunikasjon-data fra profil.
 */
function getCommunication(profile: ProfileData): number {
  if (!profile.communication) return 50;
  const c = profile.communication as Record<string, number | string>;
  const keys = Object.keys(c);
  if (keys.length === 0) return 50;
  let total = 0;
  for (const k of keys) {
    const v = c[k];
    if (typeof v === 'number') total += v;
    else total += 50;
  }
  return Math.round(total / keys.length);
}

/**
 * Hent tilknytning-data fra profil.
 */
function getTilknytning(profile: ProfileData): number {
  if (profile.securityLevel === 'secure') return 85;
  if (profile.securityLevel === 'ambivalent') return 60;
  if (profile.securityLevel === 'unsicher') return 45;
  // Fallback: bruk intimacy-data dersom securityLevel ikkje er sett
  if (profile.intimacy) {
    const i = profile.intimacy as Record<string, number | string>;
    const keys = Object.keys(i);
    if (keys.length > 0) {
      let total = 0;
      for (const k of keys) {
        const v = i[k];
        if (typeof v === 'number') total += v;
        else total += 50;
      }
      return Math.round(total / keys.length);
    }
  }
  return 50;
}

/**
 * Hent kjaerlighet/intimitet-data fra profil.
 */
function getKjaerlighet(profile: ProfileData): number {
  if (!profile.intimacy) return 50;
  const i = profile.intimacy as Record<string, number | string>;
  const keys = Object.keys(i);
  if (keys.length === 0) return 50;
  let total = 0;
  for (const k of keys) {
    const v = i[k];
    if (typeof v === 'number') total += v;
    else total += 50;
  }
  return Math.round(total / keys.length);
}

/**
 * Hent fremtid/visjon-data fra profil.
 */
function getFremtid(profile: ProfileData): number {
  if (!profile.futureVision) return 50;
  const f = profile.futureVision as Record<string, number | string>;
  const keys = Object.keys(f);
  if (keys.length === 0) return 50;
  let total = 0;
  for (const k of keys) {
    const v = f[k];
    if (typeof v === 'number') total += v;
    else total += 50;
  }
  return Math.round(total / keys.length);
}

/**
 * Hent personlighet-data fra profil.
 */
function getPersonlighet(profile: ProfileData): number {
  if (!profile.personality) return 50;
  const p = profile.personality as Record<string, number | string>;
  const keys = Object.keys(p);
  if (keys.length === 0) return 50;
  let total = 0;
  for (const k of keys) {
    const v = p[k];
    if (typeof v === 'number') total += v;
    else total += 50;
  }
  return Math.round(total / keys.length);
}

/**
 * Hent humor-data fra profil (valfritt).
 */
function getHumor(profile: ProfileData): number {
  if (!profile.personality) return 50;
  const p = profile.personality as Record<string, number | string>;
  if (p.humor !== undefined) {
    const v = p.humor;
    return typeof v === 'number' ? v : 50;
  }
  return 50;
}

/**
 * Hent modenheit-data fra profil.
 */
function getModenhet(profile: ProfileData): number {
  if (profile.maturityLevel) return profile.maturityLevel * 10;
  return 50;
}

/**
 * Bereknar matchscore mellom to brukarar.
 * 
 * Vekting:
 *   livsstil: 0.25
 *   kommunikasjon: 0.20
 *   tilknytning: 0.15
 *   fremtid: 0.15
 *   kjaerlighet: 0.10
 *   personlighet: 0.10
 *   humor: 0.05
 */
export function calculateMatchScore(a: ProfileData, b: ProfileData): { score: number; scores: Record<string, number> } {
  // Brukar eigen profil-data direkte
  const aLifestyle = getLifestyle(a);
  const bLifestyle = getLifestyle(b);
  const lifestyleScore = (aLifestyle + bLifestyle) / 2;

  const aComm = getCommunication(a);
  const bComm = getCommunication(b);
  const commScore = (aComm + bComm) / 2;

  const aTilk = getTilknytning(a);
  const bTilk = getTilknytning(b);
  const tilkScore = (aTilk + bTilk) / 2;

  const aFuture = getFremtid(a);
  const bFuture = getFremtid(b);
  const futureScore = (aFuture + bFuture) / 2;

  const aIntim = getKjaerlighet(a);
  const bIntim = getKjaerlighet(b);
  const intimScore = (aIntim + bIntim) / 2;

  const aPers = getPersonlighet(a);
  const bPers = getPersonlighet(b);
  const persScore = (aPers + bPers) / 2;

  const aHumor = getHumor(a);
  const bHumor = getHumor(b);
  const humorScore = (aHumor + bHumor) / 2;

  const aModen = getModenhet(a);
  const bModen = getModenhet(b);
  const modenScore = (aModen + bModen) / 2;

  // Vektet total
  const scores = {
    livsstil: Math.round(lifestyleScore),
    kommunikasjon: Math.round(commScore),
    tilknytning: Math.round(tilkScore),
    fremtid: Math.round(futureScore),
    kjaerlighet: Math.round(intimScore),
    personlighet: Math.round(persScore),
    humor: Math.round(humorScore),
    moden: Math.round(modenScore),
  };

  const weights = {
    livsstil: 0.25,
    kommunikasjon: 0.20,
    tilknytning: 0.15,
    fremtid: 0.15,
    kjaerlighet: 0.10,
    personlighet: 0.10,
    humor: 0.05,
    moden: 0.00, // modenheit er inkludert i other scores
  };

  let total = 0;
  total += scores.livsstil * weights.livsstil;
  total += scores.kommunikasjon * weights.kommunikasjon;
  total += scores.tilknytning * weights.tilknytning;
  total += scores.fremtid * weights.fremtid;
  total += scores.kjaerlighet * weights.kjaerlighet;
  total += scores.personlighet * weights.personlighet;
  total += scores.humor * weights.humor;
  // modenheitsbonus
  const maturityDiff = Math.abs((a.maturityLevel ?? 5) - (b.maturityLevel ?? 5));
  const maturityBonus = Math.max(0, 100 - maturityDiff * 15);
  total += maturityBonus * 0.10;

  return { score: Math.round(total), scores };
}

/**
 * Bereknar kompatibility mellom to profiler for ein enkel verdi.
 */
export function compareProfileValue(a: ProfileData, b: ProfileData, key: string): number {
  const aVal = a[key as keyof ProfileData];
  const bVal = b[key as keyof ProfileData];
  if (aVal === undefined || bVal === undefined) return 50;
  if (typeof aVal === 'string' && typeof bVal === 'string') return compareText(aVal, bVal);
  if (typeof aVal === 'number' && typeof bVal === 'number') {
    const diff = Math.abs(aVal - bVal);
    return Math.max(0, 100 - diff);
  }
  return 50;
}