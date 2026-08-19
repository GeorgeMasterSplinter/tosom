/**
 * ToSom — Oppgaver (Gjør sammen)
 * 9 kategorier × 15 oppgaver = 135 oppgaver totalt.
 * Alle oppgaver er tekst-baserte og sendes som melding i chat.
 * Voksne 23+. Bokmål. Lett, morsomt, ingen konkurranse.
 */

export interface TaskCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  tasks: string[];
}

/* ═══════════════════════════════════════
   1. KUNNE-VIL-DU-SI
   Lett, morsomt, avslører preferanser
   ═══════════════════════════════════════ */

const kunneVilDuSi: string[] = [
  "Kunne du leve en uke uten musikk, eller en uke uten kaffe?",
  "Kunne du jobbe helt alene i en fjellhytte i én måned, eller bo i en storby med null vennskap?",
  "Kunne du spise den samme maten hver dag i to uker, eller aldri få velge hva du spiser igjen?",
  "Kunne du si nei til alle sosiale planer i en måned, eller være på en fest hver fredag i to år?",
  "Kunne du ha et yrke du elsket men som betalt dårlig, eller et yrke som betalt bra men kjedsommelig?",
  "Kunne du reise alene til et land du ikke snakker språket i, eller aldri forlate hjemlandet?",
  "Kunne du dele alt du tenkte høyt med alle, eller aldri vite hva noen andre tenkte?",
  "Kunne du ha en uke der alt du ønsket ble nektet, eller en uke der du aldri måtte si nei?",
  "Kunne du jobbe 12 timer om dagen men velge helt selv hva, eller 4 timer men være underlagt andres planer?",
  "Kunne du bo i et hus uten internett i ett år, eller ha internett men bo i en leilighet på 20 kvm?",
  "Kunne du fortelle alle dine hemmeligheter en gang, eller aldri vite andres?",
  "Kunne du ha en dag der du aldri kom deg ut av huset, eller en dag der du aldri kom hjem?",
  "Kunne du ta bort alle dine vaner i én dag, eller bli tvunget til å gjøre dem dobbelt så ofte i én måned?",
  "Kunne du alltid vite hva klokka var uten klokker, eller aldri vite hva dag i uka det er?",
  "Kunne du være helt ærlig i én uke om alt, eller alltid si det du tror andre vil høre i ett år?",
];

/* ═══════════════════════════════════════
   2. FORTELL MEG OM
   Varmt, delende, bygger minner
   ═══════════════════════════════════════ */

const fortellMegOm: string[] = [
  "Fortell meg ditt beste minne fra en ukeend du aldri glemmer.",
  "Fortell meg om en fremmed du møtte som endret noe i deg.",
  "Fortell meg om en gang du var helt alene og det føldes som mest tilstrekkelig.",
  "Fortell meg om en matrett som alltid tar deg tilbake til noen.",
  "Fortell meg om et sted i verden der du føler deg helt hjemme.",
  "Fortell meg om en gang du sa ja og det endte med å bli det beste valget.",
  "Fortell meg om en person som alltid visste hvordan de skulle få deg til å le.",
  "Fortell meg om en kveld der du gledet deg så høyt at du nesten gråt.",
  "Fortell meg om en gang du oppdaget noe om deg selv du ikke visste før.",
  "Fortell meg om en sang som alltid tar deg tilbake til et øyeblikk.",
  "Fortell meg om en gang du var redd, men gjorde det allikevel.",
  "Fortell meg om en gave du mottok som betydde mer enn du sa det betydde.",
  "Fortell meg om en stund du satt helt stille og bare var lykkelig uten å vite hvorfor.",
  "Fortell meg om en gang du hjalp noen og det endret deg.",
  "Fortell meg om en liten ritual du har med deg som ingen andre vet om.",
];

/* ═══════════════════════════════════════
   3. HVIS DU
   Drømmende, lett, framtidssyn
   ═══════════════════════════════════════ */

const hvisDu: string[] = [
  "Hvis du kunne teleportere til et sted i verden akkurat nå — hvor, og hvorfor?",
  "Hvis du kunne ha en superkraft bare i dag, hvilken ville du velge?",
  "Hvis du kunne spise med én person fra fortiden (død eller levende), hvem og hva ville dere snakke om?",
  "Hvis du kunne starte på nytt i et annet yrke i morgen, hva ville det være?",
  "Hvis du fikk en time der ingen kunne ringe deg — hva ville du gjøre med den?",
  "Hvis du kunne skrive et brev til deg selv for ti år siden, hva ville du skrive?",
  "Hvis du kunne lage en perfekt fredag kveld, hvordan ville den se ut? Klokke for klokke.",
  "Hvis du kunne ha et hus hvor som helst i verden, hvilken stil og hvilken plass?",
  "Hvis du kunne møte en person i dag som ikke kan møte deg tilbake, hvem ville det være og hva ville du si?",
  "Hvis du hadde ubegrenset tid, men begrenset penger — hva ville du gjøre i neste uke?",
  "Hvis du kunne endre én ting ved måten folk hilsner på hverandre, hva ville det være?",
  "Hvis du kunne bo i et rom uten at noen andre hadde tilgang til det — hvilket rom, og hvorfor?",
  "Hvis du kunne lage en regel for hele verden som alle måtte følge i én uke, hvilken regel?",
  "Hvis du kunne ha en uke der ingen ville vite hva du gjør, hva ville du gjøre?",
  "Hvis du kunne sende en melding til alle som noengang har såret deg, hva ville du skrive?",
];

/* ═══════════════════════════════════════
   4. TO SANNHETER, EN LØGNN
   Klassisk spill. Latter + nysgjerrighet + tillit.
   Ingen vinner, ingen taper.
   ═══════════════════════════════════════ */

const toSannheter: string[] = [
  "Del to sannheter om deg selv og én du har oppfunnet. Jeg gjetter hvilken som er løgna.",
  "Fortell meg tre ting om barndommen din — men én av dem er helt oppfunnet. Hvilken er den?",
  "Gi meg to ekte reiseminner og én du fant på. Kan du lure meg?",
  "Nevn tre ting du har lyst til å si til meg, men én av dem er oppfunnet. Gjetter du?",
  "Fortell meg tre ting jeg ikke vet om deg. Én er feil. Kan du finne løgna?",
  "Del tre fakta om karrieren din. Én er oppfunnet. Hvor er løgna?",
  "Fortell meg tre matpreferanser. Én lyver. Kan du spotte den?",
  "Gi meg tre ting om hvordan du bruker en lørdag. Én er ikke sant. Hvilken?",
  "Fortell meg tre hobbyer du driver med. Én er oppfunnet. Gjetter du riktig?",
  "Nevn tre steder du har bodd. Én er ikke ekte. Kan du finne den?",
  "Del tre ting om hvordan du ser ut (klokketrikk, tilbehør, tatovering...). Én er feil. Gjetter du?",
  "Fortell meg tre ting du har lært å gjøre. Én har du aldri gjort. Hvilken?",
  "Gi meg tre fakta om familien din. Én er oppfunnet. Kan du lure meg?",
  "Fortell meg tre ting om hvordan du sover. Én er ikke sant. Hvilken?",
  "Nevn tre ting du er ekstremt god på. Én er du ikke god på. Gjetter du?",
];

/* ═══════════════════════════════════════
   5. SANG SOM BESKRIVER DEG
   Musikk, identitet, kreativitet, følelser
   ═══════════════════════════════════════ */

const sang: string[] = [
  "Velg en sang som beskriver deg i dag. Hvilken, og hvorfor nettopp den?",
  "Hvilken sang ville du spilt hvis noen skulle ha filmet en dag i livet ditt?",
  "Hvilken artist ville du hatt som gjest på en bursdagsfest bare for deg to?",
  "Hva er den første sangen du synger når du er alene i bilen?",
  "Hvilken sang får deg alltid til å grine? Og hvorfor?",
  "Hvis livet ditt var et album, hva ville tittelen være? Og hvilken låt er du akkurat nå?",
  "Hvilken sang hører du når du er i dårlig humør, og hva gjør den med deg?",
  "Hvis du kunne lage en spilleliste med bare tre låter som beskriver deg, hvilke tre?",
  "Hvilken sang vil du at partneren din hører når dere er sammen? Og hvorfor den?",
  "Hva er en sang du har danset til alene i kjøkkenet? (Ja, jeg vet alle gjør det.)",
  "Hvilken sang får deg til å lukke øynene og kjenne noe dypt i kroppen?",
  "Hvis du skulle anbefale én sang til meg for å forstå deg, hvilken ville det være?",
  "Hvilken artist vil du at alle bør bli kjent med, men som de fleste har gått glipp av?",
  "Hva er en sang du hørte som barn og som fortsatt får deg til å kjenne noe?",
  "Hvis du kunne ha en signatur-sang som spilte hver gang du gikk inn i et rom, hvilken ville det være?",
];

/* ═══════════════════════════════════════
   6. UVENTET OM MEG
   Overraskelser, sårbarhet, latter, "vent, alvorlig?"
   ═══════════════════════════════════════ */

const uventet: string[] = [
  "Hva er noe om deg som ingen i ditt nære miljø vet?",
  "Hva er en feiloppfatning folk har om deg som du aldri har rettet?",
  "Hva er den merkeligeste tingen du har en liten fetish for? (Kan være saft, skosnore, eller kaffe.)",
  "Hva er noe du kan gjøre ekstremt godt som du aldri ville tenke på å bryste deg av?",
  "Hva er noe du er overraskende dårlig på, men som folk antar du er bra på?",
  "Hva er den mest overraskende reaksjonen du noen gang har hatt i en helt vanlig situasjon?",
  "Hva er noe du har endret mening om så ofte at du ikke lenger er sikker på hva du tror?",
  "Hva er en ting du gjorde som barn som du nå forlater deg selv å gjenta?",
  "Hva er noe du er stolt av, men som ville virket helt idiotisk for en fremmed?",
  "Hva er den verste tingen du har fortalt en fremmed for å virke smartere?",
  "Hva er noe du har en uforholdsmessig sterk mening om som ingen andre bryr seg om?",
  "Hva er noe du frykter at folk syns er rart, men som du faktisk liker?",
  "Hva er en ting du har prøvd å slutte med i tre år, men aldri klart?",
  "Hva er noe du har grinet over som du aldri har fortalt noen?",
  "Hva er den overraskende tingen du er mest takknemlig for i livet ditt?",
];

/* ═══════════════════════════════════════
   7. NORDISK KVELD
   Kos, valg, hverdagsliv. Design kvelden sammen.
   ═══════════════════════════════════════ */

const nordiskKveld: string[] = [
  "Velg: peis, stearinlys, eller taklys til kvelden. Motiver på ett ord.",
  "Hvem lager kaffe og hvem lager maten til fredagskos? (Svar: meg / deg / skift)",
  "Design den perfekte norske ukeend for oss to — i akkurat 5 ord.",
  "Regnet slår i ruten, det er onsdag kveld. Hva gjør vi? Du starter, jeg tar over.",
  "Velg én ting: varm kaffe, te med honning, eller kakao. Fortell meg hva du serverer meg og hvorfor.",
  "Vi har én time på oss. Ingen telefoner. Hva gjør vi? Beskriv i to setninger.",
  "Velg: tynn pels, ullgenser, eller dunjakke til en tur ut. Og — går vi i skogen, langs elven, eller i byen?",
  "Du lager maten, jeg vasker opp. (Eller omvendt.) Hva lager du? Og — er det enrett eller toretter?",
  "Velg lyset: fullt slukket, halvt, eller fullt på. Og — er det rolig eller festet stemning i huset?",
  "Vi sitter på balkongen med to krus. Det er stille. Hva sier du først?",
  "Velg: film, brettspill, eller bare å snakke. Og — hvem velger hva, eller om det er film?",
  "Design vår lille hyttetur: én natt, én dag. Hva tar vi med, og hva gjør vi?",
  "Velg én matrett vi lager sammen. Du starter med hovedretten, jeg tar desserten.",
  "Det er torsdag. Klokka 19. Du har kontroll. Hva skjer de neste 3 timene?",
  "Velg: vi lager mat sammen, bestiller, eller spiser noe rart og nytt. Du starter, jeg følger.",
];

/* ═══════════════════════════════════════
   8. GJETTER DU MEG?
   Gjettingsspill. Én gjetter, én lurer. Bytter om.
   ═══════════════════════════════════════ */

const gjetterDuMeg: string[] = [
  "Jeg tenker på et ord som beskriver dagen min. Du gjetter på 5 forsøk. Hver gjetting får en ledetråd.",
  "Ranger disse fra 1–10 uten å se på meg: min kaffestyrke i dag, mitt morgenhumør, mitt energinivå.",
  "Hvilken av disse er mitt humør akkurat nå? A) 'Landsby' B) 'Stum di' C) 'Dance Monkey'. Gjetter du?",
  "Jeg tenker på en matrett. Du får tre ledetråder fra meg. Hvilken er det?",
  "Gjetter du hvilken dag i uken jeg er mest meg selv? Du har to forsøk.",
  "Jeg velger tre ord som beskriver meg i dag. Du gjetter hvilket av dem jeg liker minst. Gjetter du?",
  "Du gjetter hvor mange krus kaffe jeg har hatt i dag. Maks 5 forsøk, jeg svarer bare 'høyere' eller 'lavere'.",
  "Jeg tenker på et sted i Norge. Du gjetter hvilket, med kun ja/nei-spørsmål. Maks 7.",
  "Ranger: min motivasjon i dag, mitt tålmodighetsnivå, mitt lystenivå på å le. Du starter.",
  "Jeg skriver et ord. Du gjetter hvilken følelse det uttrykker. Jeg forteller deg om jeg har rett.",
  "Du gjetter hvilket år jeg ble født. Du får tre ledetråder fra meg etter hvert forsøk.",
  "Jeg tenker på en aktivitet jeg gjorde i går. Du gjetter hva det var. Ja/nei-spørsmål, maks 5.",
  "Ranger mine tre favorittsesonger fra varmest til kuldest i humør. Du starter.",
  "Du gjetter hva jeg spiste til lunsj i dag. Du får én ledetråd før hvert forsøk. Maks 3.",
  "Jeg velger et sted. Du gjetter om det er i Norge eller i utlandet. Deretter: nord, sørd, øst, vest. Maks 4.",
];

/* ═══════════════════════════════════════
   9. BYGG EN HISTORIE
   Kreativt spill. Du skriver én setning, jeg skriver én.
   Fortsett til det blir absurd.
   ═══════════════════════════════════════ */

const byggEnHistorie: string[] = [
  "Vi bygger en historie. Du starter med én setning. Jeg fortsetter. Siste som blir seriøs har tapt.",
  "Beskriv vår perfekte lørdag i akkurat 7 ord. Gå. (Bare 7.)",
  "Lag en norsk film i 5 setninger sammen. Du starter med tittelen. Jeg tar neste.",
  "Fortell meg en historie der hovedpersonen er en kaffekopp. Du starter.",
  "Vi bygger en ukeend. Du skriver mandag, jeg skriver tirsdag, du onsdag... Siste som sier 'og så døde de' vinner.",
  "Du starter: 'Det var en gang to nordmann som...' Fortsett. Jeg tar neste setning.",
  "Lag en oppskrift på vår perfekte kveld. Du starter med hovedingrediensen. Jeg tar neste.",
  "Vi bygger en sang. Du starter med vers 1 (to linjer). Jeg tar vers 2. Refrenget: begge.",
  "Du skriver en setning som begynner med 'Og så...'. Jeg fortsetter. Fortsett i 6 setninger totalt.",
  "Lag et kort eventyr der hovedpersonene er vi to. Du starter. Maks 5 setninger hver.",
  "Vi bygger en ukeend som bare går galt. Du starter med fredag. Jeg tar lørdag. Du søndag.",
  "Du skriver én setning om morgenen min. Jeg skriver én setning om kvelden din. Siste som sier 'og så sov de' vinner.",
  "Lag en ny norsk tradisjon i 3 setninger. Du starter med navnet. Jeg tar beskrivelsen.",
  "Vi bygger en dag i livet til en nabo. Du starter med kl. 07:00. Jeg tar neste tidspunkt.",
  "Du starter: 'Dagen begynte helt vanlig, men...' Jeg fortsetter. Fortsett til en av oss sier 'det var det. full stopp.'",
];

/* ═══════════════════════════════════════
   EKSPORTERT KATEGORILISTE
   ═══════════════════════════════════════ */

export const taskCategories: TaskCategory[] = [
  {
    id: 'kunne-vil-du-si',
    name: 'Kunne-vil-du-si',
    icon: '🤔',
    color: '#5B9BD5',
    tasks: kunneVilDuSi,
  },
  {
    id: 'fortell-meg-om',
    name: 'Fortell meg om',
    icon: '💛',
    color: '#E8875B',
    tasks: fortellMegOm,
  },
  {
    id: 'hvis-du',
    name: 'Hvis du...',
    icon: '🌍',
    color: '#9C27B0',
    tasks: hvisDu,
  },
  {
    id: 'to-sannheter',
    name: 'To sannheter, en løgn',
    icon: '🎭',
    color: '#FF6B8A',
    tasks: toSannheter,
  },
  {
    id: 'sang',
    name: 'Sang som beskriver deg',
    icon: '🎵',
    color: '#4DFF88',
    tasks: sang,
  },
  {
    id: 'uventet',
    name: 'Uventet om meg',
    icon: '💥',
    color: '#FF9800',
    tasks: uventet,
  },
  {
    id: 'nordisk-kveld',
    name: 'Nordisk kveld',
    icon: '🫖',
    color: '#8B7355',
    tasks: nordiskKveld,
  },
  {
    id: 'gjetter-du-meg',
    name: 'Gjetter du meg?',
    icon: '🎯',
    color: '#4ECDC4',
    tasks: gjetterDuMeg,
  },
  {
    id: 'bygg-en-historie',
    name: 'Bygg en historie',
    icon: '📖',
    color: '#E8C766',
    tasks: byggEnHistorie,
  },
];
