// PartnerProfile — typer og dummy-data
// PP2 — definer PartnerProfile-type
// PP3 — lag dummy-profil med namn, alder, bio, verdier, interesser, bilde-URLer

/* systemaudit 03.09 (funn 9): self-contained placeholder (data URI) i staden
 * for eksternt dev-domene (placehold.co) — tillatt av CSP (data:). */
const PHOTO_PLACEHOLDER = "data:image/svg+xml,%3Csvg%20xmlns='http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20width='400'%20height='500'%3E%3Crect%20width='400'%20height='500'%20fill='%23e2e8f0'%2F%3E%3C%2Fsvg%3E";

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
    PHOTO_PLACEHOLDER,
    PHOTO_PLACEHOLDER,
    PHOTO_PLACEHOLDER,
  ],
  compatibilityScore: 82,
};
