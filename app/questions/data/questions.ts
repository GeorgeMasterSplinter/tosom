/**
 * ToSom — Spørsmålmodul (Bli Kjent)
 * 12 kategorier med 20 spørsmål per kategori = 240 spørsmål totalt.
 * Alle spørsmål er formidlet mot partneren (du-form).
 * Voksne 23+. Bokmål. Ingen nynorsk. Moden tone.
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
  "Hvordan beskriver du den perfekte dagen for deg selv?",
  "Hva er noe du har endret syn på de siste årene?",
  "Hva får deg til å føle deg mest som deg selv?",
  "Hva er en overbevisning du har som kanskje er litt uvanlig?",
  "Når føler du deg mest energisk i løpet av en dag?",
  "Hva er noe du aldri vil slutte med, uansett hva?",
  "Hva betyr mest for deg når du skal vurdere om et valg var riktig?",
  "Hvordan har din forståelse av deg selv endret seg det siste året?",
  "Hva er noe du ønsker å bli bedre i, i forhold til deg selv?",
  "Hva er din personlige superkraft som kanskje ikke er like åpenbar for andre?",
  "Hva er noe du gjerne ville lært deg å gjøre, men ennå ikke har?",
  "Hva er noe du er stolt av som kanskje få vet om?",
  "Hvordan tar du deg selv videre når du føler deg fastkjørt?",
  "Hva er det som gir deg mest mening i livet akkurat nå?",
  "Hva er noe du ofte hører at alle liker, men som du egentlig ikke gjør?",
  "Hva er noe du aldri har fortalt noen om dine dypeste interesser?",
  "Hva er noe du vet du vil oppnå i livet?",
  "Hva er noe du har gjort og angret på?",
  "Hva er noe du er redd for å innrømme overfor deg selv?",
];

/* ═══════════════════════════════════════
   2. FORHOLD & TILKNYTNING
   ═══════════════════════════════════════ */

const forhold: string[] = [
  "Hva trenger du mest av for å føle deg trygg i et forhold?",
  "Hvordan behandler du konflikter når de oppstår?",
  "Hva er den viktigste leksjonen du har lært om kjærlighet?",
  "Hva mener du er forskjellen mellom å elske noen og å trenge noen?",
  "Hvordan viser du kjærlighet mest naturlig?",
  "Hva er noe du aldri vil kompromisse med i et forhold?",
  "Hva gjør du når du føler deg krenket i en relasjon?",
  "Hva er din største frykt når det gjelder nærhet?",
  "Hva betyr lojalitet for deg i praksis?",
  "Hvordan vet du at noen virkelig bryr seg om deg?",
  "Hva er noe du ønsker å lære av din partner om relasjoner?",
  "Hvordan opplever du forskjellen mellom å gi og motta kjærlighet?",
  "Hva er noe du trenger å høre oftere fra en partner?",
  "Hvordan påvirker avstand en relasjon for deg?",
  "Hva er noe du ønsker å gjøre annerledes enn det du vokste opp med?",
  "Hva er din største styrke som partner?",
  "Hva er noe du jobber med å bli bedre i som partner?",
  "Hvordan definerer du trofasthet utover fysisk trohet?",
  "Hva er noe du trenger tid til i en relasjon?",
  "Hva er noe som får deg til å føle deg mest forent med en partner?",
];

/* ═══════════════════════════════════════
   3. KOMMUNIKASJON & KONFLIKTER
   ═══════════════════════════════════════ */

const kommunikasjon: string[] = [
  "Hvordan snakker du med noen du bryr deg om når dere uenige?",
  "Hva er noe du har lært om å lytte som har endret deg?",
  "Hvordan forteller du noen at de har såret deg uten å angripe?",
  "Hva er det som gjør at du stenger deg av i en samtale?",
  "Hvordan liker du at noen gir deg tilbakemelding?",
  "Hva er noe du gjerne ville si til noen, men som du holder inne?",
  "Hvordan håndterer du det å be om unnskyldning?",
  "Hva er din største utfordring i en samtale som går dypt?",
  "Hvordan vet du at du virkelig hører på noen?",
  "Hva er noe du ønsker at partneren din skal si når dere er uenige?",
  "Hvordan snakker du om ting som gjør deg ubehagelig?",
  "Hva er noe du har lært om å si nei uten å si nei?",
  "Hvordan liker du at noen bekrefter at de har forstått deg?",
  "Hva er den vanskeligste samtalen du noen gang har hatt?",
  "Hvordan håndterer du det å si at du har rett uten å kjempe for det?",
  "Hva er noe du gjør for å åpne deg i en samtale?",
  "Hvordan snakker du om pengemål eller økonomi med noen du er sammen med?",
  "Hva er noe du hører for ofte i samtaler som du helst ville unngå?",
  "Hvordan forteller du noen at du trenger tid uten at de tar det personlig?",
  "Hva er noe du lærte om å snakke ærlig som du ikke visste du trengte?",
];

/* ═══════════════════════════════════════
   4. NÆRHET & INTIMITET
   ═══════════════════════════════════════ */

const nærhet: string[] = [
  "Hvordan snakker du om dine seksuelle ønsker med noen du er nær?",
  "Hva trenger du for å føle deg trygg og åpen i sengen?",
  "Hva er noe du gjerne ville utforske sammen med en partner?",
  "Hvordan liker du at noen berører deg når du ikke er i et intimt øyeblikk?",
  "Hva er noe du har lært om din egen kropp som overrasket deg?",
  "Hvordan balanserer du mellom åpenhet og personrom i et intimt forhold?",
  "Hva er noe du ønsker å høre fra en partner i et intimt øyeblikk?",
  "Hvordan snakker du om det du ikke liker uten å krenke?",
  "Hva er noe du liker at en partner gjør som får deg til å føle deg sett?",
  "Hvordan håndterer du forskjeller i behov mellom dere to?",
  "Hva er noe du har lært om seksuell tillit som har endret deg?",
  "Hvordan liker du at noen introduserer nye ting i et intimt forhold?",
  "Hva er noe du trenger å si for å slappe av i et intimt øyeblikk?",
  "Hvordan snakker du om grenser dine uten at det blir konfrontasjonelt?",
  "Hva er noe du liker best i et intimt forhold med noen?",
  "Hvordan håndterer du det å si nei i et intimt øyeblikk?",
  "Hva er noe du gjerne ville dele med en partner om din seksualitet?",
  "Hvordan liker du at noen nærmer seg deg fysisk?",
  "Hva er noe du har lært om kropp og sinn som overrasket deg?",
  "Hvordan snakker du om lengsel når dere er lenger fra hverandre?",
];

/* ═══════════════════════════════════════
   5. FØLELSER & SÅRBARHET
   ═══════════════════════════════════════ */

const følelser: string[] = [
  "Hva er noe du trenger å tillate deg selv å føle, men ikke alltid gjør?",
  "Hva er noe du gruer deg mest til å slippe?",
  "Hva er noe du er mest redd for å miste?",
  "Hva er noe du er mest takknemlig for, selv om det var vanskelig?",
  "Hva er noe som gjør deg mest sårbar?",
  "Hva er noe du vil tillate deg selv å ønske uten skyldfølelse?",
  "Hva er noe som gjør deg mest stolt?",
  "Hva er noe du vil tillate deg selv å trenge?",
  "Hva er noe som gjør deg mest takknemlig?",
  "Hva er noe du vil slippe, men ennå ikke har?",
  "Hva er noe som gjør deg mest usikker på deg selv?",
  "Hva er noe som gjør deg mest lykkelig?",
  "Hva er noe som gjør deg mest rolig?",
  "Hva er noe som gjør deg mest engstelig?",
  "Hva er noe som gjør deg mest sint?",
  "Hva er noe som gjør deg mest trist?",
  "Hva er noe som gjør deg mest forelsket?",
  "Hva gjør du når du føler at følelsene blir for store?",
  "Hva er noe du trenger å høre når du er på et lavt punkt?",
  "Hvordan tillater du deg selv å være svak i møte med noen du bryr deg om?",
];

/* ═══════════════════════════════════════
   6. TRYGGHET & GRENSER
   ═══════════════════════════════════════ */

const trygghet: string[] = [
  "Hva er dine viktigste grenser i et forhold?",
  "Hvordan vet du at noen respekterer grensene dine?",
  "Hva er noe du har lært om å si nei uten dårlig samvittighet?",
  "Hva trenger du for å føle deg trygg nok til å være åpen?",
  "Hva er noe som bryter din tillit umiddelbart?",
  "Hvordan håndterer du det å bli satt overrasket i en relasjon?",
  "Hva er noe du trenger tid til å bli komfortabel med?",
  "Hvordan snakker du om noe som overgrep deg tidligere?",
  "Hva er noe du trenger å vite at partneren din ikke vil gjøre?",
  "Hva er din måte å bygge tillit med noen ny?",
  "Hva er noe du har lært om å sette deg selv først?",
  "Hvordan håndterer du det å bli kritisert av noen du bryr deg om?",
  "Hva er noe du trenger for å føle deg hjemme i en relasjon?",
  "Hvordan snakker du om noe som ikke er greit for deg?",
  "Hva er noe du har lært om å være ærlig med grensene dine?",
  "Hva er noe som får deg til å føle deg mest trygt i en samtale?",
  "Hvordan håndterer du det å si at noe er feil uten å kjenne deg som den dårlige?",
  "Hva er noe du trenger å høre for å vite at alt er greit mellom dere?",
  "Hva er din måte å varsle at noe er feil uten at det blir en konfrontasjon?",
  "Hva er noe du har lært om å være trygg uten å være stiv?",
];

/* ═══════════════════════════════════════
   7. LEK & HUMOR
   ═══════════════════════════════════════ */

const lek: string[] = [
  "Hva er den mest absurde tingen du har falt for?",
  "Hva er noe du alltid latterliggjør hos deg selv?",
  "Hva er en spøk du aldri blir lei av?",
  "Hva er noe du alltid har villet prøve, men aldri har samlet mod?",
  "Hva er noe morsomt du tror mange kan relaterer seg til?",
  "Hva er den rareste ting du har spist og likte det?",
  "Hva er noe du alltid griner av, selv om det ikke er morsomt?",
  "Hva er noe du tror alle har tenkt på men aldri snakker om?",
  "Hva er noe du har gjort og blitt lei deg for?",
  "Hva er noe du håper aldri skjer med deg?",
  "Hva er noe du alltid har villet prøve med en venn?",
  "Hva er noe morsomt du har opplevd på reise?",
  "Hva er noe du tenker på som perfekt for en bestemt anledning?",
  "Hva er noe du alltid har tenkt på, men aldri spurt noen om?",
  "Hva er noe du ville ha gjort som barn men aldri fikk lov til?",
  "Hva er noe du vil prøve selv om du vet du vil være dårlig i?",
  "Hva er noe du alltid vil si ja til, uansett hva?",
  "Hva er noe du alltid vil si nei til, selv om det er morsomt?",
  "Hva er noe som alltid gjør deg glad, uansett hvor dårlig dagen er?",
  "Hva er noe du vil skrive opp på en liste en gang, før det er for sent?",
];

/* ═══════════════════════════════════════
   8. BARNDOM & RØTTER
   ═══════════════════════════════════════ */

const barndom: string[] = [
  "Hva er noe fra barndommen din som fortsatt preger deg?",
  "Hva var din favorittbeskjeftigelse som barn?",
  "Hva lærte foreldrene dine deg om verden, og hva var de feil i?",
  "Hva er noe du husker fra barndommen som kjentes enormt på den tiden?",
  "Hva er noe du ønsker at noen skulle fortalt deg som liten?",
  "Hva er noe fra familien din som du vil beholde, og noe du vil slippe?",
  "Hvem var personen som ga deg mest trygghet som barn?",
  "Hva er noe du føler at du har arvet fra oppveksten?",
  "Hva er noe du føler at du mistet for tidlig?",
  "Hva var det som kjentes som voksen for deg som barn?",
  "Hva er noe du husker fra barndommen som endret deg?",
  "Hva er noe du aldri har glemt fra skoletiden?",
  "Hva er noe du aldri vil glemme fra barndommen?",
  "Hva er noe du vil gi videre til dine barn, om noen?",
  "Hva er noe fra barndommen som gjør at du er den du er?",
  "Hva er noe du ønsker du kunne fortalt din yngre jeg?",
  "Hva er noe du ble belønnet for som barn?",
  "Hva er noe du ble straffet for som barn?",
  "Hva er noe fra barndommen som du er glad for nå?",
  "Hva er noe du ville ønsket du hadde fått lov til?",
];

/* ═══════════════════════════════════════
   9. VERDIER & LIVSSTIL
   ═══════════════════════════════════════ */

const verdier: string[] = [
  "Hva er de tre viktigste verdiene dine?",
  "Hva betyr suksess for deg?",
  "Hva er noe du alltid vil stå for, uansett konsekvens?",
  "Hva er noe du vil ofre mye for?",
  "Hva er noe du tror er viktigere enn det folk flest innrømmer?",
  "Hva er noe du tror flere bør bry seg mer om?",
  "Hva er noe du har måttet velge mellom som definerte deg?",
  "Hva er noe du vil leve etter, ikke bare si at du tror på?",
  "Hva er noe du mener er rett selv om ingen andre holder med?",
  "Hva er noe du vil prioritere over karriere?",
  "Hva er noe du tror gir livet mest mening?",
  "Hva er noe du vil gjøre annerledes enn det samfunnet forventer?",
  "Hva er noe du vil si fra deg i møte med urettferdighet?",
  "Hva er noe du vil beskytte, uansett kostnad?",
  "Hva er noe du vil bygge i denne verdenen?",
  "Hva er noe du vil at verdenen skal lære av deg?",
  "Hva er noe du vil at skal være grunnen til at folk er glad i deg?",
  "Hva er noe du vil at skal være grunnen til at folk husker deg?",
  "Hvordan prioriterer du når to verdier kolliderer?",
  "Hva er noe du har endret oppfatning om de siste årene?",
];

/* ═══════════════════════════════════════
   10. FREMTID & DRØMMER
   ═══════════════════════════════════════ */

const fremtid: string[] = [
  "Hva ser du for deg det første året i et nytt kapittel?",
  "Hva er noe du ønsker å ha oppnådd om fem år som du ikke har nådd ennå?",
  "Hvordan vil du at hverdagen din skal se ut om ti år?",
  "Hva er en drøm du har latt ligge, men som ennå lever?",
  "Hva vil du bli husket for?",
  "Hva er noe du trenger å slippe fra deg for å gå mot neste kapittel?",
  "Hvordan vil du at forholdet ditt skal utvikle seg over tid?",
  "Hva er noe du vil bygge sammen med noen du er glad i?",
  "Hva er noe du vil prøve før du føler deg klar for et stort forpliktelser?",
  "Hva er noe du tror vil utfordre deg mest i årene som kommer?",
  "Hva er noe du vil endre på måten verden fungerer?",
  "Hvordan vil du at karrieren din skal se ut om fem år?",
  "Hva er noe du vil oppleve i livet, før det er for sent?",
  "Hva er noe du tror vil forme deg mest som person i årene som kommer?",
  "Hva er noe du vil gi videre til neste generasjon?",
  "Hva er noe du vil at partneren din skal være mest glad i med deg?",
  "Hva er noe du vil reise rundt, alene eller sammen?",
  "Hva er noe du vil skape som varer lenger enn deg selv?",
  "Hva er noe du vil endre på i samfunnet?",
  "Hva er noe du vil lære deg i løpet av livet?",
];

/* ═══════════════════════════════════════
   11. HVERDAG & RUTINE
   ═══════════════════════════════════════ */

const hverdag: string[] = [
  "Hvordan starter du dagen din?",
  "Hva er noe du ikke kan tenke deg å våke opp uten?",
  "Hvordan lader du når du er helt tom for energi?",
  "Hva er din måte å slappe av på når dagen har vært tung?",
  "Hva er noe du gjør hver uke som du ikke ville gi fra deg?",
  "Hvordan håndterer du en dag som har gått helt galt?",
  "Hva er noe du gjør alene som gir deg energi?",
  "Hvordan liker du at en kveld ser ut i et parforhold?",
  "Hva er noe du alltid gjør for å komme deg i gang når du er lat?",
  "Hva er din største svakhet når det gjelder å ta deg selv?",
  "Hva er noe du gjør på en tirsdag kveld når ingen ser?",
  "Hvordan håndterer du stress i hverdagen?",
  "Hva er noe du ikke kan stå for i en bolig?",
  "Hva er din måte å si at du trenger litt tid alene?",
  "Hva er noe du alltid tar med deg på reise?",
  "Hvordan liker du at en morgen ser ut når dere er sammen?",
  "Hva er noe du gjør for å takke kroppen din for en hard dag?",
  "Hva er noe du alltid har lyst til å prøve, men som du aldri får til?",
  "Hvordan liker du å feire en liten seier i hverdagen?",
  "Hva er noe du ikke lenger tål i en relasjon som du tidlig tålte?",
];

/* ═══════════════════════════════════════
   12. MODEN NYSGJERRIGHET
   ═══════════════════════════════════════ */

const moden: string[] = [
  "Hva er noe du lurer på om meg som du ikke har turte å spørre?",
  "Hva er noe du lurer på om din egen fortid som du ønsker å forstå?",
  "Hva er noe du lurer på om hvordan vi vil fungere sammen i en vanskelig situasjon?",
  "Hva er noe du lurer på om din måte å elske som du ikke er sikker på?",
  "Hva er noe du lurer på om hva som skjer når vi ikke er perfekte for hverandre?",
  "Hva er noe du lurer på om hvordan vi skal navigere i ulike behov?",
  "Hva er noe du lurer på om din måte å behandle meg når du er sint?",
  "Hva er noe du lurer på om hva som betyr mest for deg i et langvarig forhold?",
  "Hva er noe du lurer på om hvordan vi skal snakke om ting som er vanskelig?",
  "Hva er noe du lurer på om din måte å vise at du bryr deg?",
  "Hva er noe du lurer på om hvordan vi skal håndtere at vi endres over tid?",
  "Hva er noe du lurer på om din måte å bygge tillit?",
  "Hva er noe du lurer på om hvordan vi skal balansere nærhet og personrom?",
  "Hva er noe du lurer på om din måte å feire oss som et par?",
  "Hva er noe du lurer på om hvordan vi skal snakke om penger uten at det blir stress?",
  "Hva er noe du lurer på om din måte å håndtere at noen ganger har vi ulike behov?",
  "Hva er noe du lurer på om hvordan vi skal vokse sammen uten å miste oss selv?",
  "Hva er noe du lurer på om din måte å si at du er lei og trenger en pause?",
  "Hva er noe du lurer på om hvordan vi skal holde det levende i en lang relasjon?",
  "Hva er noe du lurer på om din måte å si nei når du trenger å si nei?",
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
