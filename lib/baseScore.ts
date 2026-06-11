// lib/baseScore.ts — basert på det nye Profile-schema-et (firstName, lastName, age, gender, bio, interests, photos)

interface ScoreableProfile {
  interests?: string[] | null;
  age?: number | string | null;
  bio?: string | null;
}

export function baseCompatibilityScore(a: ScoreableProfile, b: ScoreableProfile): number {
  let s = 0;

  // Interesser — felles item tel 5 poeng
  if (Array.isArray(a.interests) && Array.isArray(b.interests)) {
    const interestsA = a.interests;
    const interestsB = b.interests;
    const common = interestsA.filter((i) => interestsB.includes(i));
    s += common.length * 5;
  }

  // Aldersnearleik — jo nærare, jo fleire poeng (max 20)
  if (a.age && b.age) {
    const diff = Math.abs(Number(a.age) - Number(b.age));
    if (diff <= 2) s += 20;
    else if (diff <= 5) s += 15;
    else if (diff <= 10) s += 10;
    else s += 5;
  }

  // Bio-match — enkel overlap av nøkkelord (max 15)
  if (a.bio && b.bio) {
    const wordsA = a.bio.toLowerCase().split(/\s+/);
    const wordsB = b.bio.toLowerCase().split(/\s+/);
    const common = wordsA.filter((w) => w.length > 3 && wordsB.includes(w));
    s += Math.min(common.length * 3, 15);
  }

  return Math.min(s, 100);
}
