// ToSom Reisemotor – dag 1–35
// Ren logikk, ingen sideeffekter, ingen IO.
// Kan senere koples til AI eller backend for ekte progresjon.

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

// Dagtekster på bokmål – varme, enkle, åpne spørsmål
const dayData: Record<number, { title: string; focus: string; reflectionPrompt: string; microInsight: string; progressionHint: string }> = {
  1: {
    title: "Start",
    focus: "Bli kjent med deg selv i denne reisen.",
    reflectionPrompt: "Hvorfor valgte du å starte denne reisen?",
    microInsight: "Det første steget er alltid det viktigste.",
    progressionHint: "I morgen utforsker vi hva trygghet betyr for deg.",
  },
  2: {
    title: "Nysgjerrig",
    focus: "La nysgjerrigheten føre deg.",
    reflectionPrompt: "Hva er du mest nysgjerrig på om deg selv?",
    microInsight: "Små steg betyr mer enn du tror.",
    progressionHint: "Fortsett med et rolig blikk på deg selv.",
  },
  3: {
    title: "Rolig start",
    focus: "Ta det rolig – det er plass til alt du kjenner.",
    reflectionPrompt: "Hva gir deg ro i hverdagen?",
    microInsight: "Ro er et startpunkt, ikke et mål.",
    progressionHint: "Neste dag bygger vi videre på dette.",
  },
  4: {
    title: "Åpen",
    focus: "Hold dørene åpne for det ukjente.",
    reflectionPrompt: "Hva er vanskeligst ved å åpne seg for nye ting?",
    microInsight: "Åpenhet krever mot, men gir frihet.",
    progressionHint: "I morgen snakker vi om grenser.",
  },
  5: {
    title: "Reflekter",
    focus: "Tilbakeblikk på de første dagene.",
    reflectionPrompt: "Hva har overrasket deg de første dagene?",
    microInsight: "Selvrefleksjon er en styrke, ikke en svakhet.",
    progressionHint: "Nå går vi dypere.",
  },
  6: {
    title: "Trygghet",
    focus: "Utforsk hva trygghet betyr for deg.",
    reflectionPrompt: "Hva gjør deg trygg i et møte med en annen?",
    microInsight: "Trygghet bygges i små, konsistente øyeblikk.",
    progressionHint: "Vi tar dette med oss dypere.",
  },
  7: {
    title: "Verdier",
    focus: "Snakk om hva som betyr noe for deg.",
    reflectionPrompt: "Hvilke verdier styrer valene dine?",
    microInsight: "Verdier er kompasset ditt – følg dem.",
    progressionHint: "I morgen utforsker vi verdiene videre.",
  },
  8: {
    title: "Dypde",
    focus: "Ta det neste steget inn i deg selv.",
    reflectionPrompt: "Hvilke ting i livet er viktigst for deg?",
    microInsight: "Dypde kommer når man tør å bli værende.",
    progressionHint: "Nå går vi i dybden.",
  },
  9: {
    title: "Grenser",
    focus: "Kjenne igjen egne grenser.",
    reflectionPrompt: "Hva er dine viktigste grenser i en relasjon?",
    microInsight: "Grenser er en form for omsorg – mot andre og deg selv.",
    progressionHint: "I morgen handler det om å sette ord på det.",
  },
  10: {
    title: "Mot",
    focus: "Kjente til motet ditt.",
    reflectionPrompt: "Hva krever mot av deg?",
    microInsight: "Mot er ikke fravær av redsel – det er valg om redsler.",
    progressionHint: "Vi bygger videre på dette motet.",
  },
  11: {
    title: "Forventning",
    focus: "Hva du forventer av deg selv og andre.",
    reflectionPrompt: "Hva forventer du av en trygg relasjon?",
    microInsight: "Forventninger kan være en bro eller en mur.",
    progressionHint: "I morgen ser vi på hva som bygger bro.",
  },
  12: {
    title: "Halvvegs",
    focus: "Halvveis i trygghetsdelen.",
    reflectionPrompt: "Hva har endret syn underveis?",
    microInsight: "Å endre sinn er styrke, ikke svikt.",
    progressionHint: "Nå går vi inn i fordypningen.",
  },
  13: {
    title: "Fordypning",
    focus: "Dykk dypere inn i deg selv.",
    reflectionPrompt: "Hva føler du har vært viktigst hittil?",
    microInsight: "Fordypning krever tid – og vilje til å bli værende.",
    progressionHint: "Vi tar det dypere i morgen.",
  },
  14: {
    title: "Sjølinnsikt",
    focus: "Innsikt i egne mønster.",
    reflectionPrompt: "Hvilke mønster gjentar du med deg selv?",
    microInsight: "Å se mønsteret er første steg til endring.",
    progressionHint: "I morgen handler det om å bryte mønsteret.",
  },
  15: {
    title: "Kjensler",
    focus: "Gi rom for hva du føler.",
    reflectionPrompt: "Hvilke kjensler har dukket opp hos deg?",
    microInsight: "Kjensler er meldinger – ikke instruksjoner.",
    progressionHint: "Vi tar videre med rolighet.",
  },
  16: {
    title: "Sårbarhet",
    focus: "Tør å være sårbar.",
    reflectionPrompt: "Hva gjør deg sårbar, og hvorfor er det viktig?",
    microInsight: "Sårbarhet er like modig som det er vakkert.",
    progressionHint: "I morgen utforsker vi tillit.",
  },
  17: {
    title: "Tillit",
    focus: "Bygge og forstå tillit.",
    reflectionPrompt: "Hva trenger du for å bygge tillit?",
    microInsight: "Tillit bygges i øyeblikk, ikke i ord.",
    progressionHint: "Vi går dypere inn i det samme rommet.",
  },
  18: {
    title: "Egna styrker",
    focus: "Kjenne igjen styrkene dine.",
    reflectionPrompt: "Hva er de sterkeste sidene dine?",
    microInsight: "Styrker er ofte det vi ikke ser selv.",
    progressionHint: "I morgen handler det om aksept.",
  },
  19: {
    title: "Aksept",
    focus: "Akseptere seg selv slik en er.",
    reflectionPrompt: "Hva er vanskelig for deg å akseptere ved deg selv?",
    microInsight: "Aksept er ikke resignasjon – det er startpunkt.",
    progressionHint: "Vi bygger videre på denne aksepten.",
  },
  20: {
    title: "Samling",
    focus: "Samle trådene fra fordypning.",
    reflectionPrompt: "Hva har gitt deg mest innsikt så langt?",
    microInsight: "Innsikt kommer ikke av å haste – men av å være tilstede.",
    progressionHint: "Nå går vi inn i modningsdelen.",
  },
  21: {
    title: "Modning",
    focus: "Modning handler om tid, ikke perfektjon.",
    reflectionPrompt: "Hva har gjort deg modning i livet?",
    microInsight: "Modning er ikke å bli fullkommen – det er å bli hel.",
    progressionHint: "I morgen utforsker vi hva modning betyr for relasjoner.",
  },
  22: {
    title: "Vokse",
    focus: "Vokse gjennom utfordringer.",
    reflectionPrompt: "Hva har krevd mest av deg å vokse gjennom?",
    microInsight: "Vekst kommer ofte når man minst tror på det.",
    progressionHint: "Vi ser på hva som har formet deg.",
  },
  23: {
    title: "Redsel og mot",
    focus: "Møte det du er redd for.",
    reflectionPrompt: "Hva er du redd for i relasjoner?",
    microInsight: "Redsel er en vaktmester – ikke en dommer.",
    progressionHint: "I morgen handler det om å møtes.",
  },
  24: {
    title: "Håp",
    focus: "Hva du håper å finne.",
    reflectionPrompt: "Hva håper du å finne i en partner?",
    microInsight: "Håp er et kompass, ikke et kart.",
    progressionHint: "Vi ser på hva som fyller håpet.",
  },
  25: {
    title: "Trygghet med andre",
    focus: "Trygghet i møte med et annet menneske.",
    reflectionPrompt: "Hva får deg til å kjenne trygghet med et annet menneske?",
    microInsight: "Trygghet er et felles verk.",
    progressionHint: "I morgen handler det om å gi og ta.",
  },
  26: {
    title: "Gjeving",
    focus: "Hva du kan gi og hva du kan ta imot.",
    reflectionPrompt: "Hva er viktigst for deg i å gi og ta imot?",
    microInsight: "Å kunne ta imot er like viktig som å gi.",
    progressionHint: "Vi ser på balansen mellom gi og ta.",
  },
  27: {
    title: "Balansen",
    focus: "Finn balansen i deg selv.",
    reflectionPrompt: "Hva handler balansen om for deg?",
    microInsight: "Balansen er ikke stillstand – det er bevegelse.",
    progressionHint: "I morgen nærmer vi oss slutten av modningen.",
  },
  28: {
    title: "Oppsummering modning",
    focus: "Hva du har vært gjennom.",
    reflectionPrompt: "Hva har modningsdelen lært deg om deg selv?",
    microInsight: "Du har kommet lenger enn du tror.",
    progressionHint: "Nå går vi inn i integrasjonen.",
  },
  29: {
    title: "Integrasjon",
    focus: "Samle alt du har lært.",
    reflectionPrompt: "Hva tar du med deg videre fra hele reisen?",
    microInsight: "Integrasjon er ikke slutten – det er en overgang.",
    progressionHint: "I morgen ser vi tilbake.",
  },
  30: {
    title: "Tilbakeblikk",
    focus: "Se tilbake på reisen.",
    reflectionPrompt: "Hva likte du best med reisen så langt?",
    microInsight: "Tilbakeblikk gir klarhet – og takknemlighet.",
    progressionHint: "Vi ser på hva som kommer nå.",
  },
  31: {
    title: "Klart blikk",
    focus: "Et klart blikk på hva du trenger.",
    reflectionPrompt: "Hva trenger du for å kjenne deg klar til å møte noen?",
    microInsight: "Klarhet kommer av å være ærlig mot seg selv.",
    progressionHint: "I morgen handler det om å velge.",
  },
  32: {
    title: "Valg",
    focus: "Hvilke valg står foran deg?",
    reflectionPrompt: "Hvilke valg står du overfor nå?",
    microInsight: "Et valg er aldri endepunktet – det er en dør.",
    progressionHint: "Vi nærmer oss slutten.",
  },
  33: {
    title: "Mot til å møte",
    focus: "Møtet er rett rundt hjørnet.",
    reflectionPrompt: "Hvilke kjensler får du av tanken på å møte en match?",
    microInsight: "Å kjenne usikkerhet er et tegn på at det betyr noe.",
    progressionHint: "Et siste steg igjen.",
  },
  34: {
    title: "Avslutning nærmer seg",
    focus: "Se på hele reisen som en helhet.",
    reflectionPrompt: "Hva har denne reisa gitt deg?",
    microInsight: "Reisen var aldri utenfor deg – den var inne i deg.",
    progressionHint: "Siste dag igjen.",
  },
  35: {
    title: "Framover",
    focus: "Ta med reisen videre.",
    reflectionPrompt: "Hva vil du si til deg selv som starta denne reisen?",
    microInsight: "Du er ikke den samme som da du starta – og det er nettopp poenget.",
    progressionHint: "Reisen din fortsetter – nå med mer kunnskap.",
  },
};

const fallbackDay: DayConfig = {
  dayNumber: 0,
  title: "Ukjent dag",
  theme: "intro",
  icon: "❓",
  focus: "Reisen lastes.",
  reflectionPrompt: "Hva kjenner du nå?",
  microInsight: "Ta det rolig.",
  progressionHint: "Vi er her sammen.",
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
  // TODO: Kople til backend/bruker-data senere
  return 1;
}

// JourneyAPI – eksporterer alle funksjoner
export const journeyAPI = {
  getCurrentDay,
  getDayConfig,
  getNextDay,
  getPreviousDay,
  resolveTheme,
};
