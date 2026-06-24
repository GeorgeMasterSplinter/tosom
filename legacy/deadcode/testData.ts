// testData.ts — testdata for matching-systemet
// Denne fila er flytta til deadcode og er ikkje lenger i bruk.
// Importar er kommenterte ut for å unngå build-feil.

// import { calculateTotalScore } from "../../matching/scorer";
// import { generateExplanation } from "../../matching/explainer";
// import { MatchResult, MatchTier } from "../../matching/types";

//
// Testprofilar
//

const profileA = {
  userId: "user-test-a",
  firstName: "Eirik",
  lastName: "Hansen",
  age: 28,
  gender: "male",
  bio: "Eg elskar fjellet, natural og gode samtal om livet. Ønskar ein djup relasjon med nokon som delar same verdier. Har jobba som arkitektur i 5 år.",
  interests: ["fjell", "vandring", "fotografi", "litteratur", "matlagning", "arkitektur", "karriere"],
  photos: ["p1.jpg", "p2.jpg", "p3.jpg"],
};

const profileB = {
  userId: "user-test-b",
  firstName: "Ingrid",
  lastName: "Solheim",
  age: 27,
  gender: "female",
  bio: "Kjemiingeniør på dagtid, amatør-fotograf om kvelden. Trur på åpenheit og ærligheit i relasjonar. Ser etter ein som delar livsgleden.",
  interests: ["fotografi", "vandring", "natur", "matlagning", "arkitektur", "litteratur", "reiser"],
  photos: ["b1.jpg", "b2.jpg"],
};

const profileC = {
  userId: "user-test-c",
  firstName: "Magnus",
  lastName: "Berg",
  age: 42,
  gender: "male",
  bio: "Første gong eg er på dating-app. Likar å lese og lytte på musikk.",
  interests: ["musikk"],
  photos: [],
};

export { profileA, profileB, profileC };