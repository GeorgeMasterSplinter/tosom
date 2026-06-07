// UserProfile — typar og dummy-data
// UP2 — definer UserProfile-type
// UP3 — lag dummy-profil med namn, alder, bio, verdiar, interesser, bilde-URLer

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
  bio: "Eg er opptatt av djupe samtalar og meningsfulle møte. Trur på ro, ærlegheit og å være til stades.",
  values: ["Ærlegheit", "Trygghet", "Vekst", "Nyskaping", "Empati"],
  interests: ["Friluftsliv", "Musikk", "Lesing", "Fotografi", "Matlaging"],
  photos: [
    "https://placehold.co/400x500/e2e8f0/94a3b8?text=Dine+bilde+1",
    "https://placehold.co/400x500/f1f5f9/94a3b8?text=Dine+bilde+2",
    "https://placehold.co/400x500/f8fafc/94a3b8?text=Dine+bilde+3",
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
