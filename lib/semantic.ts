// lib/semantic.ts — basert på det nye Profile-schema-et (bio, interests, photos)

interface ScoreableProfile {
  interests?: string[] | null;
  bio?: string | null;
  photos?: string[] | null;
}

export function deepSemanticScore(a: ScoreableProfile, b: ScoreableProfile): number {
  let score = 0;

  // Intersektjon av interesser — tyngste semantiske signal
  if (Array.isArray(a.interests) && Array.isArray(b.interests)) {
    const interestsA = a.interests;
    const interestsB = b.interests;
    const setA = new Set(interestsA.map((i) => i.toLowerCase()));
    const setB = new Set(interestsB.map((i) => i.toLowerCase()));
    const intersection = [...setA].filter((i) => setB.has(i));
    const union = new Set([...setA, ...setB]).size;
    const jaccard = union > 0 ? intersection.length / union : 0;
    score += jaccard * 40; // maks 40
  }

  // Bio-semanisk overlap — delar dei same nøkkelord/emne?
  if (a.bio && b.bio) {
    const wordsA = new Set(a.bio.toLowerCase().split(/\s+/).filter((w) => w.length > 3));
    const wordsB = new Set(b.bio.toLowerCase().split(/\s+/).filter((w) => w.length > 3));
    const common = [...wordsA].filter((w) => wordsB.has(w));
    const bioOverlap = common.length / Math.max(wordsA.size, wordsB.size, 1);
    score += bioOverlap * 35; // maks 35
  }

  // Foto-overlap — deler dei bilete av liknande emne? (fremtidig)
  if (Array.isArray(a.photos) && Array.isArray(b.photos)) {
    const photoRatio = Math.min(a.photos.length, b.photos.length) / Math.max(a.photos.length, b.photos.length, 1);
    score += photoRatio * 10; // maks 10
  }

  // Intention-match (dersom intention-felt blir lagt til seinare)
  if (a.interests && b.interests) {
    const intentionKeywords = ["kjærleik", "venn", "relasjon", "date", "samvær"];
    const aHas = intentionKeywords.filter((k) => a.bio?.toLowerCase().includes(k));
    const bHas = intentionKeywords.filter((k) => b.bio?.toLowerCase().includes(k));
    if (aHas.length > 0 && bHas.length > 0) {
      score += (aHas.filter((k) => bHas.includes(k)).length / Math.max(aHas.length, bHas.length)) * 15;
    }
  }

  return Math.min(Math.round(score), 100);
}
