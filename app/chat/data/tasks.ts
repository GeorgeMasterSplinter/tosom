/**
 * ToSom — Oppgaver (Gjør sammen)
 * 6 kategorier × 15 oppgaver = 90 oppgaver totalt.
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
];