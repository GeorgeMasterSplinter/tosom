// lib/baseScore.ts — basert på det nye Profile-schema-et (firstName, lastName, age, gender, bio, interests, photos)

export function baseCompatibilityScore(a, b) {
  let s = 0;

  // Interesser — felles item tel 5 poeng
  if (Array.isArray(a.interests) && Array.isArray(b.interests)) {
    const common = a.interests.filter((i) => b.interests.includes(i));
    s += common.length * 5;
  }

  // Aldersnearleik — jo nærare, jo fleire poeng (max 20)
  if (a.age && b.age) {
    const diff = Math.abs(a.age - b.age);
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
