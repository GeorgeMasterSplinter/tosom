/**
 * ToSom — Oppgaver (Gjør sammen)
 * 9 kategorier × 15 oppgaver = 135 oppgaver totalt.
 * Alle oppgaver er tekst-baserte og sendes som melding i chat.
 * Voksne 21+. Bokmål. Lett, morsomt, ingen konkurranse.
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
  "Kunne du bo midt i en storby for alltid, eller i en liten bygd uten én butikk i gangavstand?",
  "Kunne du ha alle reiser planlagt ned til minuttet, eller reise uten plan og se der det bærer?",
  "Kunne du få alle pengene du ønsket i en uke, eller en helt fri uke uten én eneste oppgave?",
  "Kunne du være helt frisk på morgenen hver dag, eller ha alle dine beste tanker om natten?",
  "Kunne du bo hvor som helst i verden, men bare ett sted resten av livet?",
  "Kunne du spise den samme maten hver dag i to uker, eller aldri få velge hva du spiser igjen?",
  "Kunne du bo i et hus uten internett i ett år, eller ha internett overalt men bo på 20 kvadratmeter?",
  "Kunne du si nei til alle sosiale planer i en måned, eller være på en fest hver fredag i to år?",
  "Kunne du reise hvor som helst i verden med én liten sekke i en måned, eller ha alt du trenger men aldri forlate huset?",
  "Kunne du ha en drømmejobb som betaler dårlig, eller en kjedelig jobb som betaler godt?",
  "Kunne du jobbe helt alene i en fjellhytte i en måned, eller bo midt i en storby uten én du kjenner?",
  "Kunne du alltid vite nøyaktig hva klokka er uten klokker, eller aldri vite hvilken dag i uken det er?",
  "Kunne du spise dessert til alle måltider i en måned, eller aldri få dessert igjen?",
  "Kunne du alltid treffe grønt lys, eller alltid finne en ledig parkeringsplass?",
];

/* ═══════════════════════════════════════
   2. FORTELL MEG OM
   Varmt, delende, bygger minner
   ═══════════════════════════════════════ */

const fortellMegOm: string[] = [
  "Fortell meg ditt beste minne fra en ukeend du aldri glemmer.",
  "Fortell meg om en fremmed du møtte som du aldri glemte.",
  "Fortell meg om en gang du var helt alene og trivdes.",
  "Fortell meg om en matrett som alltid tar deg tilbake til noen.",
  "Fortell meg om et sted i verden der du føler deg helt hjemme.",
  "Fortell meg om en gang du sa ja, og det ble det beste valget.",
  "Fortell meg om en person som alltid visste hvordan de skulle få deg til å le.",
  "Fortell meg om en kveld der du gledet deg så mye at du nesten gråt.",
  "Fortell meg om en gang du oppdaget noe om deg selv du ikke visste før.",
  "Fortell meg om en sang som alltid tar deg tilbake til et øyeblikk.",
  "Fortell meg om en gang du var redd, men gjorde det allikevel.",
  "Fortell meg om en gave du mottok som betydde mer enn du sa det betydde.",
  "Fortell meg om en kveld da alt var helt greit uten noen særlig grunn.",
  "Fortell meg om en gang du hjalp noen og husket det lenge etter.",
  "Fortell meg om et lite ritual du har som ingen andre vet om.",
];

/* ═══════════════════════════════════════
   3. HVIS DU
   Drømmende, lett, framtidssyn
   ═══════════════════════════════════════ */

const hvisDu: string[] = [
  "Hvis du kunne teleportere til et sted i verden akkurat nå — hvor, og hvorfor?",
  "Hvis du kunne ha en superkraft bare i dag, hvilken ville du velge?",
  "Hvis du kunne spise lunsj med én person fra fortiden, hvem, og hva ville dere snakke om?",
  "Hvis du kunne starte på nytt i et annet yrke i morgen, hva ville det være?",
  "Hvis du fikk en time der ingen kunne ringe deg — hva ville du gjøre med den?",
  "Hvis du kunne skrive et brev til deg selv for ti år siden, hva ville du skrive?",
  "Hvis du kunne lage en perfekt fredagskveld, hvordan ville den se ut? Klokke for klokke.",
  "Hvis du kunne ha et hus hvor som helst i verden, hvilken stil og hvor?",
  "Hvis du plutselig fikk en uke helt fri til å gjøre hva du ville, hva ville du gjøre?",
  "Hvis du hadde ubegrenset tid, men begrenset penger — hva ville du gjøre i neste uke?",
  "Hvis du kunne endre én ting ved måten folk hilsner på hverandre, hva ville det være?",
  "Hvis du kunne ha et rom til deg selv ingen andre gikk inn i — hvilket rom, og hvorfor?",
  "Hvis du kunne lage én regel for hele verden som alle måtte følge i en uke, hvilken regel?",
  "Hvis du kunne ha en uke der ingen visste hva du gjorde, hva ville du gjøre?",
  "Hvis du var garantert at ingenting galt kunne skje i en hel dag, hva ville du gjøre?",
];

/* ═══════════════════════════════════════
   4. TO SANNHETER, EN LØGNN
   Klassisk spill. Latter + nysgjerrighet + tillit.
   Ingen vinner, ingen taper.
   ═══════════════════════════════════════ */

const toSannheter: string[] = [
  "Del to sannheter om deg selv og én du har funnet på. Jeg gjetter hvilken som er løgna.",
  "Fortell meg tre ting fra barndommen din — men én av dem er helt oppfunnet. Hvilken er den?",
  "Gi meg to ekte reiseminner og én du fant på. Kan du lure meg?",
  "Fortell meg tre ting om maten du liker. Én er feil. Kan du spotte den?",
  "Del tre fakta om jobben din. Én er oppfunnet. Hvor er løgna?",
  "Fortell meg tre hobbyer du driver med. Én har du aldri drevet med. Gjetter du?",
  "Gi meg tre ting fra skoletiden din. Én er oppfunnet. Hvilken er den?",
  "Nevn tre ting du er overraskende god på. Én er du ikke god på. Gjetter du?",
  "Fortell meg tre steder du har bodd. Én er ikke ekte. Kan du finne den?",
  "Del tre rare ting du faktisk liker. Én liker du ikke. Hvilken?",
  "Gi meg tre filmer du har sett. Én har du ikke sett. Hvilken?",
  "Fortell meg tre ting du gjør på en lørdag. Én gjør du aldri. Hvilken?",
  "Del tre ting om hvordan du sover. Én er ikke sant. Hvilken?",
  "Nevn tre ting du alltid gjør om morgenen. Én gjør du aldri. Gjetter du?",
  "Gi meg tre ting om folkene i livet ditt. Én er oppfunnet. Kan du lure meg?",
];

/* ═══════════════════════════════════════
   5. SANG SOM BESKRIVER DEG
   Musikk, identitet, kreativitet, følelser
   ═══════════════════════════════════════ */

const sang: string[] = [
  "Velg én sang som beskriver deg i dag. Hvilken, og hvorfor nettopp den?",
  "Send meg tittelen på en sang du aldri ville gitt innrømme at du liker.",
  "Hvilken sang synger du med på høyt da du er alene i bilen?",
  "Hva er en sang du hørte som barn som du fortsatt syns er god?",
  "Hvis noen skulle filme en dag i livet ditt, hvilken sang ville spilt i bakgrunnen?",
  "Hvilken sang får deg alltid til å grine? Si fra om du har hørt den for mange ganger.",
  "Hvis livet ditt var et album, hva ville tittelen være — og hvilken låt er du akkurat nå?",
  "Hvilken sang hører du når du har det dårlig, og hva gjør den med deg?",
  "Lag en spilleliste med bare tre låter som beskriver deg. Hvilke tre?",
  "Hvilken artist burde alle bli kjent med, men som de fleste har gått glipp av?",
  "Hva er en sang du har danset til alene i kjøkkenet? (Vi gjør alle det.)",
  "Hvis du skulle anbefale én sang til meg for å forstå deg, hvilken ville det bli?",
  "Gi meg to artister. Én har du faktisk hørt mye, én har du ikke. Gjetter du hvilken?",
  "Hvilken artist ville du invitert inn på en fest bare for dere to?",
  "Hvis du kunne ha en sang som spilte hver gang du kom inn i et rom, hvilken ville det være?",
];

/* ═══════════════════════════════════════
   6. UVENTET OM MEG
   Små overraskelser, latter, "vent, alvorlig?"
   ═══════════════════════════════════════ */

const uventet: string[] = [
  "Hva er noe du er overraskende bra til som du aldri vil bryste deg av?",
  "Hva er noe du er overraskende dårlig på, men som folk antar du kan?",
  "Hva er en liten vane du har som kanskje virker litt rar?",
  "Hva er noe alle andre synes er bra, men som du egentlig hater?",
  "Hva er en guilty pleasure du er helt ærlig glad i?",
  "Hva er noe vennene dine vet om deg som jeg ikke vet ennå?",
  "Samler du på noe? Hvilket — og hvorfor nettopp det?",
  "Hva er noe du alltid tar med deg uansett hvor du går?",
  "Hva er en helt liten ting du gjør litt annerledes enn alle andre?",
  "Hva er et lite ritual du har som nesten ingen andre vet om?",
  "Hva er en mening du har som alle andre synes er helt absurd?",
  "Hva er noe du kan prate time om uten å bli slutt?",
  "Hva er den merkeligeste tingen du liker?",
  "Hva er en overraskende reaksjon du har hatt i en helt vanlig situasjon?",
  "Hva er en mat du elsker som de fleste ryster på hodet av?",
];

/* ═══════════════════════════════════════
   7. NORDISK KVELD
   Kos, valg, hverdagsliv. Bygg kvelden sammen.
   ═══════════════════════════════════════ */

const nordiskKveld: string[] = [
  "Velg deg en ting for å bli koselig varm: lue med øre, tykke sokker, eller en god genser. Hvorfor den?",
  "Hvem lager kaffen og hvem lager maten til fredagskos? (Svar: meg, deg, eller skift)",
  "Lag den perfekte norske ukeenden for oss to — i akkurat fem ord. Gå.",
  "Regnet slår i ruten, det er onsdag kveld. Hva gjør vi? Du starter, jeg tar over.",
  "Velg én drikke: varm kaffe, te med honning, eller kakao. Hva serverer du meg, og hvorfor?",
  "Vi har én time på oss. Ingen telefoner. Hva gjør vi? Beskriv i to setninger.",
  "Kjøler det til utenfor. Velg: dunjakke, regntett frakk, eller ullgenser med hette. Og — går vi i skogen, langs elven, eller i byen?",
  "Du lager maten, jeg vasker opp. (Eller omvendt.) Hva lager du — og hva er tilbehøret?",
  "Velg lyset: fullt slukket, halvt, eller fullt på. Og — er det rolig, eller har vi planer om litt liv i huset?",
  "Vi sitter på balkongen med to krus. Det er stille. Hva sier du først?",
  "Velg kveldens plan: film, brettspill, eller bare å snakke. Og — hvem velger den, hvis det blir film?",
  "Vi tar med oss én natt på hytta. Hva tar vi med — og hva gjør vi?",
  "Velg én matrett vi lager sammen. Du starter med hovedretten, jeg tar desserten.",
  "Det er torsdag. Klokka 19. Du har kontroll. Hva skjer de neste tre timene?",
  "Velg: vi lager mat sammen, bestiller, eller prøver noe rart og nytt. Du starter, jeg følger.",
];

/* ═══════════════════════════════════════
   8. GJETTER DU MEG?
   Gjettingsspill. Én gjetter, én lurer. Bytter om.
   ═══════════════════════════════════════ */

const gjetterDuMeg: string[] = [
  "Jeg tenker på et ord som beskriver dagen min. Du gjetter, og jeg gir deg en ledetråd etter hvert forsøk.",
  "Gjetter du hvor mange krus kaffe jeg har hatt i dag? Jeg svarer bare 'høyere' eller 'lavere'.",
  "Jeg tenker på en matrett. Du får tre ledetråder fra meg. Hvilken er den?",
  "Gjetter du hvilken dag i uken jeg er mest meg selv? Du får to forsøk.",
  "Jeg tenker på tre ord som beskriver meg i dag. Gjetter du hvilket av dem jeg liker minst?",
  "Jeg tenker på et sted i Norge. Gjetter du hvilket — bare ja/nei-spørsmål.",
  "Jeg tenker på noe jeg gjorde i går. Du gjetter hva det var. Bare ja/nei-spørsmål.",
  "Gjetter du hva jeg spiste til lunsj i dag? Du får én ledetråd før hvert forsøk.",
  "Jeg tenker på et sted. Gjetter du om det er i Norge eller i utlandet? Så: nord, sør, øst eller vest.",
  "Ranger mine tre favorittsesonger — fra den jeg liker minst til den jeg liker mest.",
  "Gjetter du hva jeg gjør akkurat nå? Du får en ledetråd etter hvert forsøk.",
  "Ranger fra 1 til 10: min kaffestyrke i dag, og hvor høyt mitt humør er nå.",
  "Gjetter du omtrent hvor mange steg jeg har gått i dag? Jeg sier bare 'flere' eller 'færre'.",
  "Gjetter du hva jeg drikker i dag — kaffe, te, vann, eller noe helt annet? Du får én ledetråd.",
  "Velg den fargen som best passer mitt humør i dag: blå, grønn, gul, rød eller lilla. Riktig?",
];

/* ═══════════════════════════════════════
   9. BYGG EN HISTORIE
   Kreativt spill. Du skriver én setning, jeg skriver én.
   Fortsett til det blir absurd.
   ═══════════════════════════════════════ */

const byggEnHistorie: string[] = [
  "Vi bygger en historie. Du starter med én setning, jeg tar neste. Siste som blir seriøs har tapt.",
  "Lag en norsk film i fem setninger sammen. Du starter med tittelen, jeg tar neste.",
  "Skap en helt vanlig person med én uforutsigbar vaner. Du starter, jeg fortsetter.",
  "Ta en helt vanlig mandag og gjør den absurd. Du starter, jeg tar over.",
  "Lag en oppskrift på vår perfekte kveld. Du starter med hovedingrediensen, jeg tar neste.",
  "Finn på en ny norsk tradisjon i tre setninger. Du starter med navnet, jeg tar beskrivelsen.",
  "Bygg en helg som bare går galt. Du starter med fredag, jeg tar lørdag, du tar søndag.",
  "Du starter med én setning som begynner på 'Og så...'. Jeg fortsetter. Vi skriver i seks setninger.",
  "Lag et kort eventyr der vi to er hovedpersonene. Du starter. Fem setninger hver.",
  "Finn på et sted som ikke finnes. Hva heter det, og hva skjer der? Du starter.",
  "Vi skriver en dialog, annenhver replikk. Du starter med min første linje.",
  "Bygg et sted vi begge ville flytte til i morgen. Du starter med én ting, jeg tar neste.",
  "Lag en helt uskyldig falsk nyhet om noe hverdagslig. Du starter, jeg tar over.",
  "Vi lager en bok sammen. Du velger tittelen, jeg skriver første setning.",
  "Du starter med én setning. Vi bygger videre — og den som sier 'det var det', avslutter.",
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
