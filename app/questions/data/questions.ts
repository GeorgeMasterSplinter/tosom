/**
 * ToSom — Spørsmålmodul (Bli Kjent)
 * 12 kategorier med 15 spørsmål per kategori = 180 spørsmål totalt.
 * Alle spørsmål er formidlet mot partneren (du-form).
 * Voksne 21+. Bokmål. Ingen nynorsk. Moden tone.
 *
 * Library V2 (28.10.2026): 240 → 180. Redaksjonell gjenoppbygging etter fem
 * review-runder: færre mekaniske skjelett, terapistemmen fjernet, near-
 * duplikater fjernet. Mapping Q-001–Q-240 → Q2-001–Q2-180:
 * docs/BLI-KJENT-INVENTORY-v2.0.md
 */

/* ═══════════════════════════════════════
   KATEGORI-METADATA
   ═══════════════════════════════════════ */

export interface QuestionCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  questions: string[];
}

/* ═══════════════════════════════════════
   1. PERSONLIGHET & IDENTITET
   ═══════════════════════════════════════ */

const personlighet: string[] = [
  "Hva er den ene egenskapen ved deg som andre ofte overraskes over?",
  "Hvordan ser en perfekt dag ut for deg?",
  "Hva er noe du har endret syn på de siste årene?",
  "Når føler du deg mest som deg selv?",
  "Hva er en overbevisning du har som kanskje er litt uvanlig?",
  "Er du mest du selv på morgenen eller om kvelden?",
  "Hva er du overraskende god til?",
  "Hva har du alltid hatt lyst til å lære deg?",
  "Hva er noe du er stolt av som kanskje få vet om?",
  "Hva virker det som alle andre liker, men som du fint klarer deg uten?",
  "Hva kan du bruke altfor mye tid på uten å merke at tiden går?",
  "Hva er en liten ting ved deg som vennene dine kjenner deg godt for?",
  "Hva er en helt unødvendig ting du er overraskende kresen på?",
  "Hva er noe du brenner for, men som du sjelden snakker om?",
  "Hvordan vet du at du har hatt en god dag?",
];

/* ═══════════════════════════════════════
   2. FORHOLD & TILKNYTNING
   ═══════════════════════════════════════ */

const forhold: string[] = [
  "Hva trenger du mest av for å føle deg trygg i et forhold?",
  "Hvordan viser du kjærlighet mest naturlig?",
  "Hva er noe du aldri vil kompromisse med i et forhold?",
  "Hva betyr lojalitet for deg i praksis?",
  "Hvordan vet du at noen virkelig bryr seg om deg?",
  "Hva er noe du ønsker å gjøre annerledes enn det du vokste opp med?",
  "Hva får et forhold til å føles godt for deg i hverdagen?",
  "Hva gjør det lettere for deg å komme nær noen?",
  "Hva faller mest naturlig for deg: å vise omtanke eller å ta imot den?",
  "Hvor viktig er alenetid for deg når du er i et forhold?",
  "Hva hjelper deg å komme deg videre etter en uenighet?",
  "Hva gjør du når noen du bryr deg om sårer deg?",
  "Hva setter du mest pris på i de små tingene man gjør for hverandre?",
  "Når føler du deg nærmest den du er sammen med?",
  "Hvordan tenker du om et forhold der man ikke kan sees så ofte?",
];

/* ═══════════════════════════════════════
   3. KOMMUNIKASJON & KONFLIKTER
   ═══════════════════════════════════════ */

const kommunikasjon: string[] = [
  "Hvordan snakker du med noen du bryr deg om når dere er uenige?",
  "Hvordan forteller du noen at de har såret deg uten å angripe?",
  "Hva er det som gjør at du stenger deg av i en samtale?",
  "Hvordan liker du at noen gir deg tilbakemelding?",
  "Hvordan snakker du om ting som gjør deg ubehagelig?",
  "Hvordan snakker du om penger med noen du er sammen med?",
  "Hva er noe du hører for ofte i samtaler som du helst ville unngå?",
  "Hvordan forteller du noen at du trenger tid uten at de tar det personlig?",
  "Hva gjør at du føler deg lyttet til?",
  "Er det lett eller vanskelig for deg å si fra når noe plager deg?",
  "Hva gjør du når du vet at du har tatt feil og må si unnskyld?",
  "Hva synes du er vanskeligst når en samtale blir personlig?",
  "Hvordan merker du at noen virkelig har forstått deg?",
  "Er du typen som vil snakke ferdig med en gang, eller trenger du gjerne litt tid først?",
  "Er det noe du helst vil snakke om ansikt til ansikt fremfor på melding?",
];

/* ═══════════════════════════════════════
   4. NÆRHET & INTIMITET
   ═══════════════════════════════════════ */

const nærhet: string[] = [
  "Hva betyr fysisk nærhet for deg i hverdagen?",
  "Er du en person som liker mye nærhet, eller trenger du mer tid og plass?",
  "Hvordan liker du at noen nærmer seg deg fysisk?",
  "Hvilken type hverdagslig berøring liker du best — en klem, en hånd på skulderen eller noe annet?",
  "Hvilke små tegn på hengivenhet betyr mest for deg?",
  "Hva er noe noen gjør som får deg til å føle deg sett?",
  "Hva gjør at nærhet føles naturlig og avslappet for deg?",
  "Hvor viktig er det for deg at ting får utvikle seg i sitt eget tempo?",
  "Hvordan merker du at du begynner å bli komfortabel med noen?",
  "Er det lett for deg å si hva du liker og ikke liker når du blir nær noen?",
  "Hva er en liten form for nærhet du setter overraskende stor pris på?",
  "Hvordan er det for deg å savne noen du er glad i?",
  "Hva er noe du gjerne ville utforske sammen med noen?",
  "Hva gjør det lettere for deg å si fra om hva du er komfortabel med?",
  "Er det noe du synes er viktig å si fra om, før dere kommer nærmere hverandre?",
];

/* ═══════════════════════════════════════
   5. FØLELSER & SÅRBARHET
   ═══════════════════════════════════════ */

const følelser: string[] = [
  "Hva er noe som gjør deg mest lykkelig?",
  "Hvilken følelse er lettest å lese på deg?",
  "Hva gleder du deg til akkurat nå?",
  "Hva er noe du var stolt av å klare for nylig?",
  "Hva hjelper deg som regel etter en skikkelig dårlig dag?",
  "Hvordan merker folk rundt deg at du har det bra?",
  "Hva kan røre deg mer enn du egentlig forventer?",
  "Hva liker du å høre når du har en dårlig dag?",
  "Hva er noe som gjør deg mest rolig?",
  "Hva gjør deg lettere nervøs enn det kanskje burde?",
  "Hva kan irritere deg mye mer enn det egentlig fortjener?",
  "Hva pleier å gjøre at du begynner å falle for noen?",
  "Hva kan gjøre deg litt sentimental?",
  "Hva er noe du er takknemlig for, selv om du knapt tenker på det?",
  "Hva gjør du når du trenger å få tankene over på noe annet?",
];

/* ═══════════════════════════════════════
   6. TRYGGHET & GRENSER
   ═══════════════════════════════════════ */

const trygghet: string[] = [
  "Hva er dine viktigste grenser i et forhold?",
  "Hvordan vet du at noen respekterer grensene dine?",
  "Hva trenger du for å føle deg trygg nok til å være åpen?",
  "Hva er noe som bryter din tillit umiddelbart?",
  "Hva er noe du trenger for å føle deg hjemme i en relasjon?",
  "Hvordan snakker du om noe som ikke er greit for deg?",
  "Når synes du det er lett å si nei, og når er det vanskeligere?",
  "Hvordan reagerer du når planer plutselig endrer seg?",
  "Hva får deg til å merke at du kan stole på noen?",
  "Hva må du kunne stole på at den andre gjør?",
  "Hvor fort pleier du å bli komfortabel med nye mennesker?",
  "Hvordan liker du at noen tar opp noe de er uenige med deg i?",
  "Hvordan tar du det når noen overrasker deg?",
  "Hvor god er du til å sette deg selv først?",
  "Hva gjør det lett for deg å slappe av i en samtale?",
];

/* ═══════════════════════════════════════
   7. LEK & HUMOR
   ═══════════════════════════════════════ */

const lek: string[] = [
  "Hva er den mest absurde tingen du har falt for?",
  "Hva er noe ved deg selv du alltid må le litt av?",
  "Hva er en spøk du aldri blir lei av?",
  "Hva har du alltid villet prøve, men aldri samlet mod til?",
  "Hva er noe litt rart du gjør som du tror flere gjør i smug?",
  "Hva er det rareste du har spist og faktisk likt?",
  "Hva er noe du alltid griner av, selv om det ikke er morsomt?",
  "Hva tror du alle har tenkt på, men aldri snakket om?",
  "Hva er det morsomste du har opplevd på reise?",
  "Hva er et spørsmål du alltid har hatt lyst til å stille noen, men aldri gjort?",
  "Hva er noe du vil prøve selv om du vet du vil være dårlig i?",
  "Hva er noe du alltid vil si nei til, selv om det er morsomt?",
  "Hva gjør deg alltid glad, uansett hvor dårlig dagen er?",
  "Hva er noe du har lyst til å prøve minst én gang i livet?",
  "Hva er en helt vanlig ting du gjør unødvendig komplisert?",
];

/* ═══════════════════════════════════════
   8. BARNDOM & RØTTER
   ═══════════════════════════════════════ */

const barndom: string[] = [
  "Hva likte du aller best å holde på med som barn?",
  "Hva lærte foreldrene dine deg om verden, og hva tok de feil i?",
  "Hva er noe du husker fra barndommen som kjentes enormt på den tiden?",
  "Hvem var personen som ga deg mest trygghet som barn?",
  "Hva fikk deg til å føle deg skikkelig voksen da du var liten?",
  "Hva er noe du aldri har glemt fra skoletiden?",
  "Hva er noe du ble belønnet for som barn?",
  "Hva pleide du og vennene dine å gjøre når dere hadde hele dagen fri?",
  "Hvilket sted føltes mest som ditt da du var liten?",
  "Hva var favorittmaten din som barn, og liker du den fortsatt?",
  "Hva ønsket du deg skikkelig mye da du var liten?",
  "Hadde familien din en tradisjon du fortsatt er glad i?",
  "Hva trodde du helt oppriktig på da du var liten, som virker ganske morsomt nå?",
  "Hva er noe fra familien din som du gjerne vil ta med deg videre?",
  "Hva er noe du vil gi videre til dine barn, om noen?",
];

/* ═══════════════════════════════════════
   9. VERDIER & LIVSSTIL
   ═══════════════════════════════════════ */

const verdier: string[] = [
  "Hva er noe du tror er viktigere enn det folk flest innrømmer?",
  "Hva ville du prioritert foran jobb hvis du måtte velge?",
  "Hva er noe du bryr deg overraskende mye om?",
  "Hva bruker du gjerne penger på uten å angre?",
  "Hva synes du det er verdt å betale litt ekstra for?",
  "Hva er viktigere for deg enn status?",
  "Hvis du har en helt ledig kveld, hva prioriterer du?",
  "Hva synes du folk tar altfor alvorlig?",
  "Hva er noe du selv tar ganske alvorlig, selv om andre kanskje ikke gjør det?",
  "Hva er et valg du tok som har betydd mer enn du regnet med?",
  "Hvilken vane av deg er du mest glad i?",
  "Hva bruker du gjerne tid på, selv når du egentlig har dårlig tid?",
  "Hva er noe du alltid hjelper til med, selv om ingen ber deg om det?",
  "Er det noe du ikke ville gjort bare for pengenes skyld?",
  "Hva er det du er mest opptatt av i livet akkurat nå?",
];

/* ═══════════════════════════════════════
   10. FREMTID & DRØMMER
   ═══════════════════════════════════════ */

const fremtid: string[] = [
  "Hva er noe du vil bygge sammen med noen du er glad i?",
  "Hvordan ser en vanlig tirsdag ut for deg om et par år?",
  "Er det et sted du kunne sett for deg å bo en gang?",
  "Er det noe ved livet ditt i dag du håper ser helt annerledes ut om ti år?",
  "Hva gleder du deg til det neste året?",
  "Er det noe nytt du har lyst til å prøve de neste årene?",
  "Hvordan håper du at en vanlig helg ser ut noen år fra nå?",
  "Hva er noe du har lagt på isen, men fortsatt har lyst til å gjøre?",
  "Hva er en reise du drømmer om, alene eller sammen?",
  "Hvor går tankene dine når du trenger noe å glede seg til?",
  "Er det noe du håper å ha mer tid til noen år fra nå?",
  "Hva er noe du gjerne vil ha mer av i hverdagen din?",
  "Hva håper du at du fortsatt tar deg tid til om ti år?",
  "Hva er du ganske sikker på at du fortsatt vil elske, om mange år?",
  "Hva er det ved fremtiden du er mest nysgjerrig på?",
];

/* ═══════════════════════════════════════
   11. HVERDAG & RUTINE
   ═══════════════════════════════════════ */

const hverdag: string[] = [
  "Hvordan starter du dagen din?",
  "Hva er noe du ikke kan tenke deg å våke opp uten?",
  "Hvordan lader du når du er helt tom for energi?",
  "Hvordan slapper du av når dagen har vært tung?",
  "Hva er noe du gjør hver uke som du ikke ville gi fra deg?",
  "Hva gjør du når dagen har gått helt galt?",
  "Hva er noe du alltid gjør for å komme deg i gang når du er lat?",
  "Hva er noe du glemmer å gjøre for deg selv, selv om du vet du burde?",
  "Hva er noe du gjør på en tirsdag kveld når ingen ser?",
  "Hva er noe i hverdagen som tar mest av deg?",
  "Hva er noe du ikke tåler i et hjem?",
  "Hva er noe du alltid tar med deg på reise?",
  "Hva er noe du alltid sier at du skal prøve, men som aldri skjer?",
  "Hvordan liker du å feire en liten seier i hverdagen?",
  "Er du mer den ryddige eller den rotete — og når gir du opp?",
];

/* ═══════════════════════════════════════
   12. MODEN NYSGJERRIGHET
   ═══════════════════════════════════════ */

const moden: string[] = [
  "Hva er noe du lurer på om meg, som du ikke har turt å spørre om?",
  "Hva betyr frihet for deg, når du er sammen med noen?",
  "Hva er økonomisk trygghet for deg — og hvordan ser den ut?",
  "Hvordan liker du at ansvar hjemme fordeles?",
  "Hva synes du det er helt greit å være uenig om i et forhold?",
  "Hva legger du merke til hos par som ser ut til å ha det godt sammen?",
  "Hva synes du det er viktig å være åpen om tidlig?",
  "Hva håper du et godt forhold gir mer plass til i livet ditt?",
  "Hva tror du mange gjør mer komplisert i forhold enn det trenger å være?",
  "Hva synes du er viktig å vite om noen, før dere kommer nærmere hverandre?",
  "Hva liker du tanken på å kunne gjøre sammen med noen, uten at det må planlegges?",
  "Hva liker du at det tar litt tid å oppdage om et menneske?",
  "Hva vil du helst ikke gi slipp på i ditt eget liv når du blir sammen med noen?",
  "Hva synes du et par bør passe på å sette av tid til?",
  "Hvor viktig er humor for deg når et forhold varer over tid?",
];

/* ═══════════════════════════════════════
   EKSPORTERT KATEGORILISTE
   ═══════════════════════════════════════ */

export const questionCategories: QuestionCategory[] = [
  {
    id: 'personlighet',
    name: 'Personlighet & identitet',
    icon: '🪞',
    color: '#D4AF37',
    questions: personlighet,
  },
  {
    id: 'forhold',
    name: 'Forhold & tilknytning',
    icon: '💛',
    color: '#E8875B',
    questions: forhold,
  },
  {
    id: 'kommunikasjon',
    name: 'Kommunikasjon & konflikter',
    icon: '💬',
    color: '#5B9BD5',
    questions: kommunikasjon,
  },
  {
    id: 'naerhet',
    name: 'Nærhet & intimitet',
    icon: '🔥',
    color: '#FF6B8A',
    questions: nærhet,
  },
  {
    id: 'folelser',
    name: 'Følelser & sårbarhet',
    icon: '🫀',
    color: '#B8860B',
    questions: følelser,
  },
  {
    id: 'trygghet',
    name: 'Trygghet & grenser',
    icon: '🛡️',
    color: '#4ECDC4',
    questions: trygghet,
  },
  {
    id: 'lek',
    name: 'Lek & humor',
    icon: '😄',
    color: '#4DFF88',
    questions: lek,
  },
  {
    id: 'barndom',
    name: 'Barndom & røtter',
    icon: '🌳',
    color: '#7CB342',
    questions: barndom,
  },
  {
    id: 'verdier',
    name: 'Verdier & livsstil',
    icon: '⚖️',
    color: '#C49F2F',
    questions: verdier,
  },
  {
    id: 'fremtid',
    name: 'Fremtid & drømmer',
    icon: '🌅',
    color: '#FF9800',
    questions: fremtid,
  },
  {
    id: 'hverdag',
    name: 'Hverdag & rutine',
    icon: '☕',
    color: '#8D6E63',
    questions: hverdag,
  },
  {
    id: 'moden',
    name: 'Moden nysgjerrighet',
    icon: '✨',
    color: '#9C27B0',
    questions: moden,
  },
];

/* ═══════════════════════════════════════
   HELPER-FUNKSJONER
   ═══════════════════════════════════════ */

/**
 * Henter et tilfeldig spørsmål fra en gitt kategori.
 * Ekskluderer spørsmål i history (anti-duplikat).
 */
export function getRandomQuestion(categoryId: string, history: string[] = []): string | null {
  const cat = questionCategories.find(c => c.id === categoryId);
  if (!cat || cat.questions.length === 0) return null;

  const filtered = cat.questions.filter(q => !history.includes(q));
  const source = filtered.length > 0 ? filtered : cat.questions;

  return source[Math.floor(Math.random() * source.length)];
}

/**
 * Henter alle kategorier med antall spørsmål.
 */
export function getCategoriesWithCounts(): Array<{ id: string; name: string; icon: string; color: string; count: number }> {
  return questionCategories.map(c => ({
    id: c.id,
    name: c.name,
    icon: c.icon,
    color: c.color,
    count: c.questions.length,
  }));
}
