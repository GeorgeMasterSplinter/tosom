// lib/resonance.ts — basert på det nye Profile-schema-et (bio, interests, gender, age)

interface ScoreableProfile {
  interests?: string[] | null;
  bio?: string | null;
  gender?: string | null;
  age?: number | string | null;
}

export function emotionalResonance(a: ScoreableProfile, b: ScoreableProfile): number {
  let resonance = 0;

  // Felles interesser — kjerne i resonans
  if (Array.isArray(a.interests) && Array.isArray(b.interests)) {
    const interestsA = a.interests;
    const interestsB = b.interests;
    const common = interestsA.filter((i) => interestsB.includes(i));
    resonance += common.length * 12; // maks 60 poeng
  }

  // Bio-ordoverlap — emosjonell djupde
  if (a.bio && b.bio) {
    const wordsA = new Set(a.bio.toLowerCase().split(/\s+/).filter((w) => w.length > 3));
    const wordsB = new Set(b.bio.toLowerCase().split(/\s+/).filter((w) => w.length > 3));
    const overlap = [...wordsA].filter((w) => wordsB.has(w));
    resonance += Math.min(overlap.length * 5, 30); // maks 30 poeng
  }

  // Samkjønna attraksjon kan auke resonans (dersom begge har gender definert)
  if (a.gender && b.gender && a.gender === b.gender) {
    resonance += 10;
  }

  // Aldersnearleik — nærmare = sterkare resonans
  if (a.age && b.age) {
    const diff = Math.abs(Number(a.age) - Number(b.age));
    if (diff <= 3) resonance += 10;
    else if (diff <= 7) resonance += 5;
  }

  return Math.min(resonance, 100);
}
