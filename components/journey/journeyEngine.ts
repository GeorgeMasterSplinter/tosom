// ToSom Reisemotor – dag 1–35
// Ren logikk, ingen sideeffektar, ingen IO.
// Kan seinare koplast til AI eller backend for ekte progresjon.

export type Theme = "intro" | "trygghet" | "fordypning" | "modning" | "integrasjon";

export interface DayConfig {
  dayNumber: number;
  title: string;
  theme: Theme;
  icon: string;
  focus: string;
  reflectionPrompt: string;
  microInsight: string;
  progressionHint: string;
}

// Theme-progresjon: intro → trygghet → fordypning → modning → integrasjon
const themeRanges: { start: number; end: number; theme: Theme }[] = [
  { start: 1, end: 5, theme: "intro" },
  { start: 6, end: 12, theme: "trygghet" },
  { start: 13, end: 20, theme: "fordypning" },
  { start: 21, end: 28, theme: "modning" },
  { start: 29, end: 35, theme: "integrasjon" },
];

function resolveTheme(day: number): Theme {
  return themeRanges.find((r) => day >= r.start && day <= r.end)?.theme ?? "intro";
}

function themeIcon(theme: Theme): string {
  switch (theme) {
    case "intro":
      return "🌱";
    case "trygghet":
      return "🕊️";
    case "fordypning":
      return "🌊";
    case "modning":
      return "🌿";
    case "integrasjon":
      return "✨";
  }
}

// Dag-tekstar på nynorsk – varme, enkle, opne spørsmål
const dayData: Record<number, { title: string; focus: string; reflectionPrompt: string; microInsight: string; progressionHint: string }> = {
  1: {
    title: "Start",
    focus: "Bli kjent med deg selv i denne reisen.",
    reflectionPrompt: "Kvifor valde du å starte denne reisen?",
    microInsight: "Det første steget er alltid det viktigste.",
    progressionHint: "I morgen utforskar vi kva trygghet betyr for deg.",
  },
  2: {
    title: "Nysgjerrig",
    focus: "La nyskjerrigheida føre deg.",
    reflectionPrompt: "Kva er du mest nysgjerrig på om deg sjølv?",
    microInsight: "Små steg tel meir enn du trur.",
    progressionHint: "Fortset med eit roleg blikk på deg sjølv.",
  },
  3: {
    title: "Rolig start",
    focus: "Ta det roleg – det er plass til alt du kjendar.",
    reflectionPrompt: "Kva gir deg ro i kvardagen?",
    microInsight: "Ro er eit startpunkt, ikkje eit mål.",
    progressionHint: "Neste dag bygger vi vidare på dette.",
  },
  4: {
    title: "Åpen",
    focus: "Hald dørene opne for det ukjende.",
    reflectionPrompt: "Kva er vanskeligast ved å opne seg for nye ting?",
    microInsight: "Åpenheit krev mot, men gjev fridom.",
    progressionHint: "I morgen snakkar vi om grenser.",
  },
  5: {
    title: "Reflekter",
    focus: "Tilbakeblikk dei fyrste dagane.",
    reflectionPrompt: "Kva har overraska deg dei fyrste dagane?",
    microInsight: "Å sjølvreflektere er ei kraft, ikkje ei svakheit.",
    progressionHint: "No går vi djupare.",
  },
  6: {
    title: "Trygghet",
    focus: "Utforsk kva trygghet betyr for deg.",
    reflectionPrompt: "Kva gjer deg trygg i eit møte med ein annan?",
    microInsight: "Trygghet byggst i små, konsistente øyeblikk.",
    progressionHint: "Vi tar dette med oss djupare.",
  },
  7: {
    title: "Verdiar",
    focus: "Snakk om kva som betyr noko for deg.",
    reflectionPrompt: "Kva verdiar styrar vala dine?",
    microInsight: "Verdiar er kompasset ditt – følg dei.",
    progressionHint: "I morgen utforskar vi verdiane vidare.",
  },
  8: {
    title: "Djupde",
    focus: "Ta det neste steget inn i deg sjølv.",
    reflectionPrompt: "Kva ting i livet er viktigast for deg?",
    microInsight: "Djupde kjem når ein tør å bli verande.",
    progressionHint: "No går vi i dybda.",
  },
  9: {
    title: "Grenser",
    focus: "Kjenne att eigne grenser.",
    reflectionPrompt: "Kva er dine viktigaste grenser i ein relasjon?",
    microInsight: "Grenser er ei form for omsyn – mot andre og deg sjølv.",
    progressionHint: "I morgen handlar det om å setje ord på det.",
  },
  10: {
    title: "Mot",
    focus: "Kjende til motet ditt.",
    reflectionPrompt: "Kva krev mot av deg?",
    microInsight: "Mot er ikkje fravær av redsel – det er val om redsele.",
    progressionHint: "Vi byggjer vidare på dette motet.",
  },
  11: {
    title: "Forventning",
    focus: "Kva du forventar av deg sjølv og andre.",
    reflectionPrompt: "Kva forventar du av ein trygg relasjon?",
    microInsight: "Forventningar kan vere ei bruke eller ei mur.",
    progressionHint: "I morgen ser vi på kva som byggjer bro.",
  },
  12: {
    title: "Halvvegs",
    focus: "Halvvegs i trygghetsdelen.",
    reflectionPrompt: "Kva har endra syn undervegs?",
    microInsight: "Å endre sinn er styrke, ikkje svikt.",
    progressionHint: "No går vi inn i fordypninga.",
  },
  13: {
    title: "Fordypning",
    focus: "Dykk djupare inn i deg sjølv.",
    reflectionPrompt: "Kva føler du har vore viktigast hittil?",
    microInsight: "Fordyping krev tid – og vilje til å bli verande.",
    progressionHint: "Vi tar det djupare i morgon.",
  },
  14: {
    title: "Sjølvinnsikt",
    focus: "Innsikt i eigne mønster.",
    reflectionPrompt: "Kva mønster gjer du att deg sjølv med?",
    microInsight: "Å sjå mønsteret er første steg til endring.",
    progressionHint: "I morgen handlar det om å bryte mønsteret.",
  },
  15: {
    title: "Kjensler",
    focus: "Gi rom for kva du føler.",
    reflectionPrompt: "Kva kjensler har dukka opp hos deg?",
    microInsight: "Kjensler er meldingar – ikkje instruksjonar.",
    progressionHint: "Vi tek vidare med rolegheit.",
  },
  16: {
    title: "Sårbarheit",
    focus: "Tør å vere sårbar.",
    reflectionPrompt: "Kva gjer deg sårbar, og kvifor er det viktig?",
    microInsight: "Sårbarheit er like modig som det er vakkert.",
    progressionHint: "I morgen utforskar vi tillit.",
  },
  17: {
    title: "Tillit",
    focus: "Bygge og forstå tillit.",
    reflectionPrompt: "Kva treng du for å byggje tillit?",
    microInsight: "Tillit vert bygd i øyeblikk, ikkje i ord.",
    progressionHint: "Vi går djupare inn i det same rommet.",
  },
  18: {
    title: "Egna styrkar",
    focus: "Kjenne att styrkane dine.",
    reflectionPrompt: "Kva er dei sterkaste sidene dine?",
    microInsight: "Styrkar er ofte det vi ikkje ser sjølv.",
    progressionHint: "I morgen handlar det om aksept.",
  },
  19: {
    title: "Aksept",
    focus: "Akseptere seg sjølv slik ein er.",
    reflectionPrompt: "Kva er vanskeleg for deg å akseptere ved deg sjølv?",
    microInsight: "Aksept er ikkje resignasjon – det er startpunkt.",
    progressionHint: "Vi byggje vidare på denne aksepten.",
  },
  20: {
    title: "Samling",
    focus: "Samle trådane frå fordyping.",
    reflectionPrompt: "Kva har gitt deg mest innsikt så langt?",
    microInsight: "Innsikt kjem ikkje av å haste – men av å vere tilstades.",
    progressionHint: "No går vi inn i modingsdelen.",
  },
  21: {
    title: "Modning",
    focus: "Modning handlar om tid, ikkje perfektion.",
    reflectionPrompt: "Kva har gjort deg modne i livet?",
    microInsight: "Modning er ikkje å bli fullkomen – det er å bli heil.",
    progressionHint: "I morgen utforskar vi kva modning betyr for relasjonar.",
  },
  22: {
    title: "Vokse",
    focus: "Vokse gjennom utfordringar.",
    reflectionPrompt: "Kva har krevd mest av deg å vokse gjennom?",
    microInsight: "Vekst kjem ofte når ein minst trur på den.",
    progressionHint: "Vi ser på kva som har forma deg.",
  },
  23: {
    title: "Skrekk og mot",
    focus: "Møte det du er redd for.",
    reflectionPrompt: "Kva er du redd for i relasjonar?",
    microInsight: "Redsel er ein vaktmeister – ikkje ein dommar.",
    progressionHint: "I morgen handlar det om å møtest.",
  },
  24: {
    title: "Håp",
    focus: "Kva du håpar å finne.",
    reflectionPrompt: "Kva håpar du å finne i ein partner?",
    microInsight: "Håp er eit kompass, ikkje eit kart.",
    progressionHint: "Vi ser på kva som fyller håpet.",
  },
  25: {
    title: "Trygghet med andre",
    focus: "Trygghet i møte med eit anna menneske.",
    reflectionPrompt: "Kva får deg til å kjende trygghet med eit anna menneske?",
    microInsight: "Trygghet er eit felles verk.",
    progressionHint: "I morgen handlar det om å gi og ta.",
  },
  26: {
    title: "Gjeving",
    focus: "Kva du kan gi og kva du kan ta imot.",
    reflectionPrompt: "Kva er viktigast for deg i å gi og ta imot?",
    microInsight: "Å kunne ta imot er like viktig som å gi.",
    progressionHint: "Vi ser på balansen mellom gi og ta.",
  },
  27: {
    title: "Balansen",
    focus: "Finn balansen i deg sjølv.",
    reflectionPrompt: "Kva handlar balansen om for deg?",
    microInsight: "Balansen er ikje stillestand – det er bevegelse.",
    progressionHint: "I morgen nærmar vi oss slutten av modinga.",
  },
  28: {
    title: "Oppsummering modning",
    focus: "Kva du har vore gjennom.",
    reflectionPrompt: "Kva har modingsdelen lært deg om deg sjølv?",
    microInsight: "Du har kome lenger enn du trur.",
    progressionHint: "No går vi inn i integrasjonen.",
  },
  29: {
    title: "Integrasjon",
    focus: "Samle alt du har lært.",
    reflectionPrompt: "Kva tek du med deg vidare frå heile reisen?",
    microInsight: "Integrasjon er ikkje slutten – det er ein overgang.",
    progressionHint: "I morgen ser vi tilbake.",
  },
  30: {
    title: "Tilbakeblikk",
    focus: "Se tilbake på reisen.",
    reflectionPrompt: "Kva likte du best med reisa så langt?",
    microInsight: "Tilbakeblikk gir klarheit – og takksemd.",
    progressionHint: "Vi ser på kva som kjem no.",
  },
  31: {
    title: "Clart blikk",
    focus: "Eit klart blikk på kva du treng.",
    reflectionPrompt: "Kva treng du for å kjende deg klar til å møte nokon?",
    microInsight: "Klarheit kjem av å vere ærleg mot seg sjølv.",
    progressionHint: "I morgen handlar det om å velje.",
  },
  32: {
    title: "Val",
    focus: "Kva val står føre deg?",
    reflectionPrompt: "Kva val står du framfor no?",
    microInsight: "Eit val er aldri endepunktet – det er ei dør.",
    progressionHint: "Vi nærmar oss slutten.",
  },
  33: {
    title: "Mot til å møte",
    focus: "Møtet er rett rundt hjørnet.",
    reflectionPrompt: "Kva kjensler får du av tanken på å møte ein match?",
    microInsight: "Å kjende usikkerheit er eit teikn på at det betyr noko.",
    progressionHint: "Eit siste steg gjen.",
  },
  34: {
    title: "Avslutning nærmar seg",
    focus: "Se på heile reisa som ein heilskap.",
    reflectionPrompt: "Kva har denne reisa gitt deg?",
    microInsight: "Reisa var aldri utanfor deg – ho var inni deg.",
    progressionHint: "Siste dag gjen.",
  },
  35: {
    title: "Framover",
    focus: "Ta med deg reisa vidare.",
    reflectionPrompt: "Kva vil du seie til deg sjølv som starta denne reisa?",
    microInsight: "Du er ikkje den same som då du starta – og det er nettopp poenget.",
    progressionHint: "Reisen din held fram – no med meir kjennskap.",
  },
};

const fallbackDay: DayConfig = {
  dayNumber: 0,
  title: "Ukjend dag",
  theme: "intro",
  icon: "❓",
  focus: "Reisen lastes.",
  reflectionPrompt: "Kva kjendar du no?",
  microInsight: "Ta det roleg.",
  progressionHint: "Vi er her saman.",
};

function getDayConfig(dayNumber: number): DayConfig {
  const data = dayData[dayNumber];
  if (!data) return fallbackDay;
  return {
    dayNumber,
    theme: resolveTheme(dayNumber),
    icon: themeIcon(resolveTheme(dayNumber)),
    ...data,
  } as DayConfig;
}

function getNextDay(dayNumber: number): number {
  return Math.min(35, dayNumber + 1);
}

function getPreviousDay(dayNumber: number): number {
  return Math.max(1, dayNumber - 1);
}

function getCurrentDay(): number {
  // TODO: Kople til backend/brukar-data seinare
  return 1;
}

// JourneyAPI – eksporterer alle funksjonar
export const journeyAPI = {
  getCurrentDay,
  getDayConfig,
  getNextDay,
  getPreviousDay,
  resolveTheme,
};
