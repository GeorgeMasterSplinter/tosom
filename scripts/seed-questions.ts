/**
 * Seed-skript for Guided Questions-systemet
 * 
 * Oppretter 12 kategorier × 20 spørsmål per kategori = 240 totalt.
 * 
 * Kjøring:
 *   npx tsx scripts/seed-questions.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// ═══════════════════════════════════════════════════════════
// 12 Kategorier med 20 spørsmål kvar = 240 totalt
// ═══════════════════════════════════════════════════════════

interface CategoryData {
  name: string
  color: string
  description: string
  questions: Array<{ content: string; depthLevel: number }>
}

const CATEGORIES: CategoryData[] = [
  // ───────────── TRYGGHET ─────────────
  {
    name: 'Trygghet',
    color: '#D4AF37',
    description: 'Grunnleggjande trygghet i relasjon',
    questions: [
      { content: 'Kva betyr trygghet for deg i ein ny relasjon?', depthLevel: 1 },
      { content: 'Kva er det som gjer at du føler deg trygg hos nokon?', depthLevel: 1 },
      { content: 'Kanskje har du opplevd å bli skuffa — korleis håndterer du det no?', depthLevel: 2 },
      { content: 'Kva type atferd gjer deg utrygg? ', depthLevel: 2 },
      { content: 'Kor open føler du deg når du blir kjent med nokon ny?', depthLevel: 1 },
      { content: 'Har du noko ritual for å kjenne deg trygg i nye situasjonar?', depthLevel: 1 },
      { content: 'Når har du sist kjennst deg fullt ut trygg med nokon? Kva var det?', depthLevel: 2 },
      { content: 'Kva er最难delen for deg å opne seg for ein ny person?', depthLevel: 3 },
      { content: 'Kva trur du er din styrke i å skape trygghet?', depthLevel: 2 },
      { content: 'Tenk på ein gong du kjente deg forstått — kva gjorde personen?', depthLevel: 2 },
      { content: 'Kor viktig er det for deg å bli akseptert som du er?', depthLevel: 1 },
      { content: 'Finst det tema du unngår å snakke om med nye kjende? Kva er dei?', depthLevel: 3 },
      { content: 'Kva har lært du om deg sjølv når det gjeld å stenge eller opne seg?', depthLevel: 3 },
      { content: 'Tenk på ein relasjon der du kjente deg trygg — kva var nøkkel-faktoren?', depthLevel: 2 },
      { content: 'Kva vil du seie til din framtidige partner om korleis dei kan skape trygghet for deg?', depthLevel: 3 },
      { content: 'Er det noko som gjer at du kjennst tryggare — ord, handlingar, eller nærvær?', depthLevel: 2 },
      { content: 'Korleis veit du at nokon er pålitelig? Kva type signal ser etter?', depthLevel: 1 },
      { content: 'Tenk på ein gong du mista tilliten til nokon — kva var leksjonen?', depthLevel: 3 },
      { content: 'Kva vil du at din partner skal vite om korleis dei kan støtte deg når du er utrygg?', depthLevel: 3 },
    ],
  },

  // ───────────── VERDIER ─────────────
  {
    name: 'Verdier',
    color: '#60A5FA',
    description: 'Kjerneverdier og prioriteringar',
    questions: [
      { content: 'Kva er dei 3 viktigaste verdiane dine?', depthLevel: 1 },
      { content: 'Er du meir driv av logikk eller emosjonar i avgjerder?', depthLevel: 1 },
      { content: 'Kva seier noko om deg som person til kva du legg penger og tid?', depthLevel: 2 },
      { content: 'Har du noko verdi du har endra meining på dei siste åra? Kva var det?', depthLevel: 3 },
      { content: 'Kva betyr suksess for deg — er det karriere, familie, friheit?', depthLevel: 1 },
      { content: 'Trur du at menneske kan endre fundamentalt på verdi-nivå? Kva tenkjer du?', depthLevel: 2 },
      { content: 'Kva type konflikt oppstår oftast mellom deg og andre når verdiane deres kollid?', depthLevel: 3 },
      { content: 'Når har du sist vore stolt av å stå for noko du trur på, til tross for press?', depthLevel: 3 },
      { content: 'Kva del av karakteren din er viktigast for deg i eit partnerforhold?', depthLevel: 2 },
      { content: 'Skildre ein gong der verdi-konflikt gjorde at du la vekk noko — eller kjempade for det.', depthLevel: 3 },
      { content: 'Er det noko viktig for deg no som du ikkje hadde for 5 år sidan? Kva er endringa?', depthLevel: 2 },
      { content: 'Kva rolle spelar samfunnsansvar i livet ditt?', depthLevel: 1 },
      { content: 'Kva seier verdiane dine om kven du egentleg er?', depthLevel: 3 },
      { content: 'Trur du at verdi-konflikt kan vere nyttig? Kva kan to menneske lære av det?', depthLevel: 2 },
      { content: 'Kva vil din fremtidige partner seie om verdiane dine etter eit år saman?', depthLevel: 3 },
      { content: 'Er det noko verdi du har arva frå familien din — og kva med den?', depthLevel: 2 },
      { content: 'Kva type folk respekterer du mest? Kva gjer dei annerledes?', depthLevel: 1 },
      { content: 'Trur du at verdiar kan endre seg i løpet av eit forhold? Kva skjer da?', depthLevel: 3 },
      { content: 'Korleis kan to menneske med ulik verdiar finne felles grunn?', depthLevel: 2 },
    ],
  },

  // ───────────── KOMMUNIKASJON ─────────────
  {
    name: 'Kommunikasjon',
    color: '#34D399',
    description: 'Korleis vi uttrykker oss',
    questions: [
      { content: 'Er du meir den som lyttar eller den som snakkar?', depthLevel: 1 },
      { content: 'Korleis reagerer du når nokon er uense med deg?', depthLevel: 1 },
      { content: 'Når har du sist følt at du ikkje vart hørt? Kva gjorde du då?', depthLevel: 2 },
      { content: 'Er det noko du aldri seier direkte, men som andre bør vite?', depthLevel: 3 },
      { content: 'Kva er din kommunikasjonstil — direkte, indirekte, humoristisk?', depthLevel: 1 },
      { content: 'Skildre ein diskusjon du var i nyleg — korlei gjekk det? Gjennomgikk du etterpå?', depthLevel: 2 },
      { content: 'Kva type samtalar gir deg energi, og kva tømmer deg?', depthLevel: 1 },
      { content: 'Når har du brukt humor for å dempe ein situasjon? Trur det fungerte?', depthLevel: 2 },
      { content: 'Kva er vanskelegast for deg i konflikt-samtalar?', depthLevel: 3 },
      { content: 'Er du den som tar initiativ til djuop samtaler?', depthLevel: 1 },
      { content: 'Tenk på ein samtale der du kjente deg verkeleg hørt — kva gjorde personen annerleis?', depthLevel: 2 },
      { content: 'Kva type melding får deg til å smile? Kort, lang, latterleg, djup?', depthLevel: 1 },
      { content: 'Har du noko kommunikasjons-mønster du ønskar å bryte? Kva er det?', depthLevel: 3 },
      { content: 'Hvordan veit du når ein samtale "ikkje kjens rett"?', depthLevel: 2 },
      { content: 'Korleie vil du at din partner skal kommunisere når dei er sint eller såret?', depthLevel: 3 },
      { content: 'Er du den som skriv lange meldingar, eller korte og konsise?', depthLevel: 1 },
      { content: 'Kva type samtale har hatt størst innvirking på deg dei siste åra?', depthLevel: 2 },
      { content: 'Når kjennest du minst forstått av andre? Kva gjer du da?', depthLevel: 3 },
      { content: 'Kva er ein "kommunikasjon-regel" du ville sett i eit forhold frå dag éin?', depthLevel: 2 },
    ],
  },

  // ───────────── INTIMITET ─────────────
  {
    name: 'Intimitet',
    color: '#F472B6',
    description: 'Nærheit og sårbarhet',
    questions: [
      { content: 'Kva betyr intimitet for deg — er det fysisk, emosjonelt, eller begge?', depthLevel: 1 },
      { content: 'Kor fort trur du det er normalt å opne seg emosjonelt?', depthLevel: 1 },
      { content: 'Når har du sist delt noko sårbart med nokon — og kva var reaksjonen?', depthLevel: 3 },
      { content: 'Er det noko med deg sjølv du aldri vil vise for ein ny partner? Kva er det?', depthLevel: 3 },
      { content: 'Kva er den første måten du merker at du får nærheit til nokon?', depthLevel: 1 },
      { content: 'Trur du sårbarhet er ei styrke eller svakheit i ein ny relasjon?', depthLevel: 2 },
      { content: 'Kva type næring gir deg mest energi — berøring, ord, tid saman?', depthLevel: 1 },
      { content: 'Har du noko "wall" du har bygd opp over tid? Kva gjorde dei?', depthLevel: 3 },
      { content: 'Tenk på ein gong du følte deg sårbar — kva var det som gjord at du følte deg slik?', depthLevel: 2 },
      { content: 'Hvor viktig er fysisk intimitet for deg i den starten av ei relasjon?', depthLevel: 1 },
      { content: 'Kva type samtale får deg til å kjenne deg nærmare nokon?', depthLevel: 2 },
      { content: 'Trur du at to menneske kan vere for nær for tidleg? Kva skjer då?', depthLevel: 2 },
      { content: 'Kva har vore den største utfordringa di med å opne seg for nokon?', depthLevel: 3 },
      { content: 'Hvordan veit du at du er klar for å gå til neste nivå i nærleik?', depthLevel: 2 },
      { content: 'Kva vil du at din framtidige partner skal forstå om dine behov for nærheit?', depthLevel: 3 },
      { content: 'Er det noko "touch boundary" du har — ting du ikkje er komfortabel med tidleg?', depthLevel: 2 },
      { content: 'Kva betyr "respekt for kroppslige grenser" for deg i ein ny relasjon?', depthLevel: 2 },
      { content: 'Er det noko du ønsker andre forstod om intimitet- behovet ditt?', depthLevel: 3 },
      { content: 'Korleis vil du at partneren din skal vise kjærligheit når du ikkje orker ord?', depthLevel: 3 },
    ],
  },

  // ───────────── FREMTIDSVISJON ─────────────
  {
    name: 'Fremtidsvisjon',
    color: '#A78BFA',
    description: 'Drøymar og mål',
    questions: [
      { content: 'Kor ser du deg sjølv om 5 år?', depthLevel: 1 },
      { content: 'Kva er det største målet ditt no i livet?', depthLevel: 1 },
      { content: 'Har du endra drøymane dine dei siste 3 åra? Kva skjedde med dei gamle?', depthLevel: 2 },
      { content: 'Dersom du kunne bytte heilt — kva ville du gjort annerleis i livs-veien?', depthLevel: 3 },
      { content: 'Trur du at du vil ha barn? Er det viktig for deg?', depthLevel: 1 },
      { content: 'Kva type hus eller hjem drøymer du om?', depthLevel: 1 },
      { content: 'Dersom økonomi ikkje var eit problem — kva ville du gjort avlivet?', depthLevel: 2 },
      { content: 'Skildre ein dag i ditt ideale liv — frå morgon til kveld.', depthLevel: 2 },
      { content: 'Kva reise drøymer du om å dra på saman med nokon?', depthLevel: 1 },
      { content: 'Er det noko viktig for deg i framtida som du ikkje har fortalt nokon enno?', depthLevel: 3 },
      { content: 'Trur du at du og din framtidige partner kan ha like framtids- drøymer?', depthLevel: 2 },
      { content: 'Kva rolle spelar karriere vs. familie for deg i framtida?', depthLevel: 2 },
      { content: 'Er det noko du vil nå innan du fyller 40? Kva er det?', depthLevel: 1 },
      { content: 'Kva vil du bli minna for av vennar og familie?', depthLevel: 3 },
      { content: 'Hvordan trur du reisa di saman med ein partner vil forme framtida din?', depthLevel: 2 },
      { content: 'Er det noko drømme-sted du ønsker å bu — by, landsby, strand, fjell?', depthLevel: 1 },
      { content: 'Kva betyr "gammal" for deg? Er det ein alder, ei haldning eller noko anna?', depthLevel: 3 },
      { content: 'Hvis du kunne gitt eit råd til den 20-årige versjonen av deg — kva ville det vore?', depthLevel: 2 },
      { content: 'Kva er "arven" du ønsker å etterlate for barn/familie/verda?', depthLevel: 3 },
    ],
  },

  // ───────────── LIVSTIL ─────────────
  {
    name: 'Livsstil',
    color: '#FB923C',
    description: 'Kvardag og rituar',
    questions: [
      { content: 'Er du morgennegg eller kveldsmenneske?', depthLevel: 1 },
      { content: 'Kva ser din perfekte helg ut?', depthLevel: 1 },
      { content: 'Kor viktig er det for deg å ha ei fast kvar-dagsrutine?', depthLevel: 1 },
      { content: 'Kva er noko ved livsstilen din som andre kanskje finn overraskande?', depthLevel: 2 },
      { content: 'Er du meir hjemme-kos eller ute-aktiv? Kva fylar deg opp?', depthLevel: 1 },
      { content: 'Kva type mat eller matvaner er viktig for deg?', depthLevel: 1 },
      { content: 'Kor ofte møtest du vener — kvart veke, kvart måned, sjeldan?', depthLevel: 1 },
      { content: 'Når har livsstilen din endra mest dei siste åra? Kva skjedde?', depthLevel: 2 },
      { content: 'Er det noko med vane-mønsteret ditt du vil endre?', depthLevel: 2 },
      { content: 'Kva er den viktigaste regelen i hjemmet ditt?', depthLevel: 1 },
      { content: 'Trur du at to menneske med ulik livsstil kan fungere? Kva treng dei da?', depthLevel: 2 },
      { content: 'Finst det noko frå barndomshjemmet som du absolutely vil ta med til eige hjem?', depthLevel: 3 },
      { content: 'Hvordan balanserer du arbeid, fritid og relasjonar?', depthLevel: 2 },
      { content: 'Kva type sport eller fysisk aktivitet gir deg energi?', depthLevel: 1 },
      { content: 'Korleie vil din framtidige kvar-dag saman med ein partner sjå ut?', depthLevel: 3 },
    ],
  },

  // ───────────── RELASJONSMØNSTER ─────────────
  {
    name: 'Relasjonsmønster',
    color: '#EF4444',
    description: 'Korleis vi møtest i forhold',
    questions: [
      { content: 'Tenk på tidligere relasjonar — kva var det vanlege mønster?', depthLevel: 2 },
      { content: 'Er du den som gir mest, eller tek mest emosjonelt?', depthLevel: 1 },
      { content: 'Når har ein relasjon slutt? Kva lærte du av det?', depthLevel: 3 },
      { content: 'Er det noko mønster frå tidlegare forhold du absolutely ikkje vil gjenta?', depthLevel: 3 },
      { content: 'Trur du at du er lett eller vanskeleg å vere i relasjon med?', depthLevel: 2 },
      { content: 'Hvordan veit du når ein relasjon "ikkje kjens rett"?', depthLevel: 2 },
      { content: 'Er du meir uavhengig eller avhengig i ein relasjon?', depthLevel: 1 },
      { content: 'Kva type konflikt-strategi har du? Trekk deg tilbake, eller konfronter?', depthLevel: 1 },
      { content: 'Når har du sist følt at du gav meir enn du fekk tilbake?', depthLevel: 2 },
      { content: 'Hvordan veit du at nokon er tryggt å åpne seg for?', depthLevel: 2 },
      { content: 'Har noko i barndommen forma korleis du møtes i relasjonar no?', depthLevel: 3 },
      { content: 'Kva er "rød flagg" for deg — teikn på at ein relasjon ikkje vil funger?', depthLevel: 2 },
      { content: 'Trur du at kjemi kan lærast, eller må det komme naturleg?', depthLevel: 1 },
      { content: 'Kva type ting gjer at du taper interessen for nokon raskt?', depthLevel: 3 },
      { content: 'Hvordan trur du ditt mønster vil spele seg ut med din framtidige partner?', depthLevel: 3 },
      { content: 'Er du den som gir først, eller tek imot først i ein relasjon?', depthLevel: 1 },
      { content: 'Kva betyr "sunn avstand" for deg i eit forhold — og kor mykje er riktig?', depthLevel: 2 },
      { content: 'Har du noko mønster frå foreldra sine forhold du har bevisst valt bort? Kva var det?', depthLevel: 3 },
      { content: 'Korleis veit du at ein relasjon er verd å kjempe for?', depthLevel: 2 },
    ],
  },

  // ───────────── EMOSJONELL INTELLIGENS ─────────────
  {
    name: 'Emosjonell Intelligens',
    color: '#2DD4BF',
    description: 'Self-refleksjon og emosjons-håndtering',
    questions: [
      { content: 'Kva er dei sterkeste emosjonane du håndterer — sinne, sorg, frykt?', depthLevel: 1 },
      { content: 'Når du er stressa — trekkjer du deg tilbake eller søker du støtte?', depthLevel: 1 },
      { content: 'Kva har vore den hardeste emocjonelle utfordringa di dei siste åra?', depthLevel: 3 },
      { content: 'Er det noko du føler dypt, men som andre kanskje ikkje veit om?', depthLevel: 3 },
      { content: 'Kor god er du på å kjenne igjen når ein annan person er sint eller såret?', depthLevel: 1 },
      { content: 'Når har du sist tatt deg tid til å reflektere over kjenslene dine?', depthLevel: 2 },
      { content: 'Kan du skilje mellom å vere lei deg og å vere irritert? Skildre når det er vanskeleg.', depthLevel: 2 },
      { content: 'Hvordan håndterer du når nokon du bryr deg om seier noko som sårer?', depthLevel: 2 },
      { content: 'Trur du at å vise svakhetch gjer deg meir eller mindre attraktiv?', depthLevel: 3 },
      { content: 'Hvor ofte kontrollerer du deg sjølv før du svarer på noko som irriterer?', depthLevel: 1 },
      { content: 'Kva type følelser er hardest for deg å uttrykke muntleg?', depthLevel: 3 },
      { content: 'Kan du kjenne at ein relasjon endrar seg før nokon seier noko?', depthLevel: 2 },
      { content: 'Er det noko du ønskar andre skjøna om dei emosjonelle behova dine? Kva er det?', depthLevel: 3 },
      { content: 'Når har du sist endra meining fordi du forstod nokon sin side bedre?', depthLevel: 2 },
      { content: 'Korleie vil din emosjonelle intelligens bidra til ei sterkere relasjon?', depthLevel: 3 },
    ],
  },

  // ───────────── KONFLIKT OG GRENSE ─────────────
  {
    name: 'Konflikt & Grenser',
    color: '#FBBF24',
    description: 'Vekslingsfullskap og personlege grenser',
    questions: [
      { content: 'Korleie håndterer du konflikt — går du direkte på saka eller trekkjer deg?', depthLevel: 1 },
      { content: 'Kva er ditt "don\'t touch"-område i ein diskusjon?', depthLevel: 2 },
      { content: 'Når har du sist følt at grenser blei overskriden — av kven? Kva skjedde?', depthLevel: 3 },
      { content: 'Er det noko du aldri vil tilgi i ein relasjon? Kva er grunn-grensa di?', depthLevel: 3 },
      { content: 'Kva type konflikt avslører mest om ein person for deg?', depthLevel: 2 },
      { content: 'Når har du satt ned ei grense som var hard, men riktig?', depthLevel: 2 },
      { content: 'Er det noko du tolerer i andre som du aldri vil sjølv? Kva er dobbelt-mønsteret?', depthLevel: 3 },
      { content: 'Kva seier eit "nei" for deg — er det ei heilt grense eller ein start på samtale?', depthLevel: 1 },
      { content: 'Kan ein relasjon overleve når viktige grenser er krenka? Kva trengst da?', depthLevel: 2 },
      { content: 'Kva gjør at du føler deg respektert i ei konflikt-situasjon?', depthLevel: 2 },
      { content: 'Er det noko fra fortida som har lært deg å settje grenser? Kva var lekdomen?', depthLevel: 3 },
      { content: 'Kva er vanskelegast — å seie nei, eller å respektere annres nei?', depthLevel: 2 },
      { content: 'Tenk på ein gong du følte at nokon respekterte grensa di — kva gjorde dei annerledes?', depthLevel: 2 },
      { content: 'Kor viktig er det for deg at din partner kan stå framfor egne behov for din sin tryggleik?', depthLevel: 3 },
      { content: 'Hvordan trur du konflikt-mønsteret deres vil spele seg ut med ein ny partner?', depthLevel: 3 },
      { content: 'Er det noko grense du er redd for å setje — fordi du frykter å miste?', depthLevel: 3 },
      { content: 'Kva type "konflikt-regel" ønskjer du at partneren din følgjer frå dag éin?', depthLevel: 2 },
    ],
  },

  // ───────────── SAMFUNN OG TILHØYRE ─────────────
  {
    name: 'Samfunn & Tilhøyre',
    color: '#818CF8',
    description: 'Vi i fellesskap',
    questions: [
      { content: 'Kva betyr familie for deg — er det blod, val, eller begge?', depthLevel: 1 },
      { content: 'Er du meir introvert (hentar energi frå alene) eller ekstrovert (henter energi frå andre)?', depthLevel: 1 },
      { content: 'Kva rolle spelar vener i livet ditt no — kvart veke, kvart måned, sjeldan?', depthLevel: 1 },
      { content: 'Når har du følt deg mest tilhøyrande til eit fellesskap? Kva gjorde det slik?', depthLevel: 3 },
      { content: 'Er det noko kulturløft eller tradisjon frå barndommen som du vil behalde?', depthLevel: 1 },
      { content: 'Kva type samfunns-debatt får deg til å tenkje mest — og kver gir deg mest å snakke om?', depthLevel: 2 },
      { content: 'Trur du at to menneske frå ulik bakgrunn kan skape ein eigen kultur saman? Kva trengst da?', depthLevel: 2 },
      { content: 'Når har du gjort noko for eit fellesskap som gav deg meir enn det tok?', depthLevel: 3 },
      { content: 'Kva rolle spelar natur eller uteliv i følelsen av tilhøyre for deg?', depthLevel: 1 },
      { content: 'Er det noko i samfunnet du vil endre — og kva kan du sjølv bidra med?', depthLevel: 2 },
      { content: 'Kva type vennskap drøymer du om å finne — djupt få, eller mange overfladiske?', depthLevel: 1 },
      { content: 'Har du noko ritual frå barndomshjemmet som du vil ta med til eit eige fellesskap?', depthLevel: 2 },
      { content: 'Hvor viktig er det for deg at partneren din deler dei same verdiene om samfunn og tilhøyre?', depthLevel: 2 },
      { content: 'Kva trur du skjer med to menneske som har ulik behov for sosial nærhet?', depthLevel: 3 },
      { content: 'Hvordan kan ToSom-plattformer bidra til å skape meir verkeleg tilhøyre — ikkje bare digitale?', depthLevel: 3 },
      { content: 'Kva betyr det å vere ein del av eit fellesskap for deg?', depthLevel: 1 },
      { content: 'Er du den som arrangerer treff, eller den som dukkar opp når andre inviterer?', depthLevel: 1 },
      { content: 'Har du noko menneske du alltid kan ringe til når ting er tungt? Kva gjer dei annerledes?', depthLevel: 2 },
      { content: 'Korleis vil du at vennene dine skal reagere når de møter partneren din for første gang?', depthLevel: 2 },
      { content: 'Kva betyr "hjem" for deg — er det eit sted, ein person, eller eit fellesskap?', depthLevel: 3 },
    ],
  },

  // ───────────── PERSONLEGDOM OG SELVKJENNSKAPE ─────────────
  {
    name: 'Personlegdom & Selvkjennskap',
    color: '#E879F9',
    description: 'Kjenne seg sjølv og sine eigenartar',
    questions: [
      { content: 'Kva er dei tre ordene ein venn ville brukt for å beskrive deg?', depthLevel: 1 },
      { content: 'Er du meir planlagt eller improvisert i kvardagen?', depthLevel: 1 },
      { content: 'Kva gjer deg happiest — å lære noko nytt, å mestre noko, eller å hjelpe andre?', depthLevel: 1 },
      { content: 'Har du noko "quirk" eller eigenart som folk først finn rar, men så elskar?', depthLevel: 1 },
      { content: 'Kva type musikk eller lyd gir deg energi?', depthLevel: 1 },
      { content: 'Når er du på ditt beste? Er det tidleg på morgonen, sent om kvelden, i ro, i bevegelse?', depthLevel: 2 },
      { content: 'Kva har lært du om deg sjølv dei siste åra som overraska deg?', depthLevel: 2 },
      { content: 'Er det noko du er god på, men som ikkje får nok anerkjenning frå andre?', depthLevel: 2 },
      { content: 'Kva seier hobbyane dine om deg — og kva har du gjort dei siste åra?', depthLevel: 1 },
      { content: 'Tenk på ein gong du overraska deg sjølv med modigheit. Kva gjorde du?', depthLevel: 2 },
      { content: 'Er du den som tar ansvar i gruppa, eller den som følgjer andre sine idéar?', depthLevel: 1 },
      { content: 'Kva type ting gir deg "flow" — der du gløymmer tid og rom?', depthLevel: 2 },
      { content: 'Har du noko du har gitt opp på, som du kanskje bør ta opp att? Kva var det?', depthLevel: 3 },
      { content: 'Korleis endrar energinivået ditt påvirke humøret og opptreden?', depthLevel: 2 },
      { content: 'Er det noko ved deg sjølv du ikkje er nøgd med no? Kva gjer du med det?', depthLevel: 3 },
      { content: 'Kva type mennesker trekker du til deg naturleg — og kvifor?', depthLevel: 2 },
      { content: 'Er du meir driven av intern nysgjerrigheit eller ytre forventningar?', depthLevel: 2 },
      { content: 'Kva er den største misforståinga folk har om deg?', depthLevel: 3 },
      { content: 'Hvordan vil du at partneren din skal seie om personlegdoma di etter eitt år saman?', depthLevel: 3 },
      { content: 'Kva del av deg sjølv er viktigast å ta med seg inn i ei ny relasjon?', depthLevel: 3 },
    ],
  },

  // ───────────── OPPLEVELSE OG NYSGJERRIGHET ─────────────
  {
    name: 'Oppleving & Nysgjerrigheit',
    color: '#4ADE80',
    description: 'Utforske verda og kvarandre',
    questions: [
      { content: 'Kva er den beste reisa du har vore på — og kvifor?', depthLevel: 1 },
      { content: 'Er du meir "planlegg ferien ned til siste detalj" eller "vi ser kva som kjem"?', depthLevel: 1 },
      { content: 'Kva er noko du aldri har prøvd, men ønskjer å prøve?', depthLevel: 1 },
      { content: 'Har du noko bok, film eller serie som har endra deg? Kva var det?', depthLevel: 2 },
      { content: 'Er du den som prøver alt på restauranten, eller den som stick til trygge valg?', depthLevel: 1 },
      { content: 'Kva er ein oppleving du aldri vil glemme? Kvifor blei ho spesiell?', depthLevel: 2 },
      { content: 'Trur du at reiser avslører kven ein person verkeleg er? Kva skjer på feriereisar?', depthLevel: 2 },
      { content: 'Kva type ting lærer du raskast — gjennom praksis, lesing, samtalar eller videoar?', depthLevel: 1 },
      { content: 'Er det noko du ein gong var veldig opptatt av, som du har mista interessen for? Kva skjedde?', depthLevel: 2 },
      { content: 'Hvis du kunne lære éin ting perfekt — kva ville det vore?', depthLevel: 1 },
      { content: 'Kva betyr "kultur" for deg — er det mat, musikk, kunst, eller noko anna?', depthLevel: 2 },
      { content: 'Har du noko drømme-reise du aldri har gjort? Kva stoppar deg frå å ta den?', depthLevel: 3 },
      { content: 'Korleis opplever du "nye ting" — med glede, uro, eller begge deler?', depthLevel: 2 },
      { content: 'Tenk på ein gong du sa "ja" til noko som skremte deg. Kva lærte du?', depthLevel: 3 },
      { content: 'Er du den som initierer nye aktivitetar med vener/partner, eller følgjer andre?', depthLevel: 1 },
      { content: 'Kva er ein ting du gjer "berre for moro skyld" — utan mål eller formål?', depthLevel: 1 },
      { content: 'Hvordan trur du to menneske kan behalde nysgjerrigheit for kvarandre over tid?', depthLevel: 3 },
      { content: 'Kva type oppleveringar trur du skaper dei beste minna i ei relasjon?', depthLevel: 2 },
      { content: 'Er det noko du aldri ville gjort saman med ein partner — eller noko du ikkje er komfortabel med?', depthLevel: 3 },
      { content: 'Hvordan kan to menneske utforske verda saman utan å miste seg sjølve i prosessen?', depthLevel: 3 },
    ],
  },
]

// ═══════════════════════════════════════════════════════════
// SEED-FUNKSJON
// ═══════════════════════════════════════════════════════════

async function seedQuestions() {
  try {
    console.log('🌱 Starter seeding av Guided Questions...')

    for (const cat of CATEGORIES) {
      // Opprett eller oppdater kategori
      const category = await prisma.questionCategory.upsert({
        where: { name: cat.name },
        update: {
          color: cat.color,
          description: cat.description,
        },
        create: {
          name: cat.name,
          color: cat.color,
          description: cat.description,
          order: CATEGORIES.indexOf(cat),
        },
      })

      // Slet eksisterande spørsmål i kategorien (for ren oppdatering)
      await prisma.guidedQuestion.deleteMany({
        where: { categoryId: category.id },
      })

      // Opprett 15 spørsmål
      const createdQuestions = []
      for (let i = 0; i < cat.questions.length; i++) {
        const q = cat.questions[i]
        const question = await prisma.guidedQuestion.create({
          data: {
            content: q.content,
            depthLevel: q.depthLevel,
            order: i + 1,
            category: { connect: { id: category.id } },
          },
        })
        createdQuestions.push(question.id)
      }

      console.log(
        `  ✅ "${cat.name}" — ${createdQuestions.length} spørsmål oppretta (kategori ${category.id})`
      )
    }

    const totalCategories = await prisma.questionCategory.count()
    const totalQuestions = await prisma.guidedQuestion.count()

    console.log(`\n✅ Seed fullført!`)
    console.log(`   ${totalCategories} kategorier`)
    console.log(`   ${totalQuestions} spørsmål totalt`)
  } catch (error) {
    console.error('❌ Feil under seeding:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

seedQuestions()