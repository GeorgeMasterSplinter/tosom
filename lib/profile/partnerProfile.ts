// PartnerProfile — typer og dummy-data
// PP2 — definer PartnerProfile-type
// PP3 — lag dummy-profil med namn, alder, bio, verdier, interesser, bilde-URLer

/* PP2 — Definer PartnerProfile-type */
export interface PartnerProfile {
  id: string;
  name: string;
  age: number;
  bio: string;
  values: string[];
  interests: string[];
  photos: string[];
  compatibilityScore?: number;
}

/* PP3 — Dummy-profil */
export const dummyProfile: PartnerProfile = {
  id: "demo-partner",
  name: "Person A",
  age: 29,
  bio: "Eg trives best i naturen og med gode samtal. Trur på at det kjemke skjer når to menneske er ærlege mot hvarandre.",
  values: ["Ærlegheit", "Nyskaping", "Trygghet", "Vekst", "Djupde"],
  interests: ["Friluftsliv", "Musikk", "Lesing", "Fotografi", "Matlaging"],
  photos: [
    "https://placehold.co/400x500/e2e8f0/94a3b8?text=Bilde+1",
    "https://placehold.co/400x500/f1f5f9/94a3b8?text=Bilde+2",
    "https://placehold.co/400x500/f8fafc/94a3b8?text=Bilde+3",
  ],
  compatibilityScore: 82,
};
