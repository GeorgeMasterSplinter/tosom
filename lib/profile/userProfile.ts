// UserProfile — typer og dummy-data
// UP2 — definer UserProfile-type
// UP3 — lag dummy-profil med namn, alder, bio, verdier, interesser, bilde-URLer

/* systemaudit 03.09 (funn 9): self-contained placeholder (data URI) i staden
 * for eksternt dev-domene (placehold.co) — tillatt av CSP (data:). */
const PHOTO_PLACEHOLDER = "data:image/svg+xml,%3Csvg%20xmlns='http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20width='400'%20height='500'%3E%3Crect%20width='400'%20height='500'%20fill='%23e2e8f0'%2F%3E%3C%2Fsvg%3E";

/* UP2 — Definer UserProfile-type */
export interface UserProfile {
  id: string;
  name: string;
  age: number;
  bio: string;
  values: string[];
  interests: string[];
  photos: string[];
  readyForMatch: boolean;
}

/* UP3 — Dummy-profil */
export const dummyUserProfile: UserProfile = {
  id: "me-demo",
  name: "Deg",
  age: 30,
  bio: "Eg er opptatt av dype samtaler og meningsfulle møte. Trur på ro, ærlegheit og å være til stades.",
  values: ["Ærlegheit", "Trygghet", "Vekst", "Nyskaping", "Empati"],
  interests: ["Friluftsliv", "Musikk", "Lesing", "Fotografi", "Matlaging"],
  photos: [
    PHOTO_PLACEHOLDER,
    PHOTO_PLACEHOLDER,
    PHOTO_PLACEHOLDER,
  ],
  readyForMatch: false,
};

/* UP13 — Validering av profil */
export function validateProfile(profile: UserProfile): string | null {
  if (profile.bio.length <= 20) return "Bio må være minst 21 tegn.";
  if (profile.values.length < 3) return "Velg minst 3 verdier.";
  if (profile.interests.length < 3) return "Velg minst 3 interesser.";
  if (profile.photos.length < 1) return "Legg til minst ett bilde.";
  return null;
}
