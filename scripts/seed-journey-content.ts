/**
 * Seed-skript for JourneyDayContent
 * 
 * Oppretter 30 records for dag 1-30 med tema, refleksjonspørsmål og samtaleprompt.
 * Fase-inndeling frå engine.ts (kanonisk, PHASE_CONFIGS):
 *   Dag 1-14:  EARLY          (bryt isen, utan bilder)
 *   Dag 15-21: BUILDING_TRUST (bygg tillit, bilder tillatt)
 *   Dag 22-25: DEEPER         (djupe samtaler)
 *   Dag 26-30: CHECKIN        (refleksjon og oppsummering)
 * 
 * Kjøring:
 *   npx tsx scripts/seed-journey-content.ts
 */

import { PrismaClient, JourneyPhase } from '@prisma/client'

const prisma = new PrismaClient()

// ═══════════════════════════════════════════════════════════
// 30 Dagar med innhald
// ═══════════════════════════════════════════════════════════

interface DayContentData {
  day: number
  phase: JourneyPhase
  theme: string
  reflectionQuestion: string
  conversationPrompt: string
  task?: string
  resonanceGoal: string
}

const JOURNEY_CONTENT: DayContentData[] = [
  // ───────────── EARLY (Dag 1-10, fortsetter til 14) ─────────────
  {
    day: 1,
    phase: 'EARLY',
    theme: 'Kjensler og stemning',
    reflectionQuestion: 'Når kjener du mest deg sjølv — når er du aleine eller saman med andre?',
    conversationPrompt: 'Del noko om kva type dag gjer deg glad, og kva type dag gjord deg lei deg.',
    task: 'Sjå på himmelen i dag. Kva farge ville du sett på stemninga di no?',
    resonanceGoal: 'Start med å oppdage kvarandre — kjenslene',
  },
  {
    day: 2,
    phase: 'EARLY',
    theme: 'Kvardagsrituar',
    reflectionQuestion: 'Kva rituar eller rutinar har du i kvardagen din?',
    conversationPrompt: 'Fortel om ein vanleg morgon eller kveld for deg. Kva er viktig for deg i desse stundene?',
    task: 'Del ein liten vanke frå kvardagen din — noko berre du og kanskje nokon nær veit om.',
    resonanceGoal: 'Bygg kvardags-forståing',
  },
  {
    day: 3,
    phase: 'EARLY',
    theme: 'Stad som betyr mykje',
    reflectionQuestion: 'Finnes det ein stad der du alltid kjener deg trygg og heime? Kva er det med den staden?',
    conversationPrompt: 'Vis meg — eller skildre — ein stad som betyr mykje for deg. Kvar er han, og kvifor er han spesiell?',
    task: 'Skildra staden til partneren din, og høyr kvifor ho/han har ein liknande.',
    resonanceGoal: 'Delt trygghet gjennom stad',
  },
  {
    day: 4,
    phase: 'EARLY',
    theme: 'Kjære minne',
    reflectionQuestion: 'Noko av det vakraste du har opplevd — kva var det? Kva tok du med deg frå det?',
    conversationPrompt: 'Del eit minne som fortsatt gir deg varme eller styrke. Fortel om det som om eg var der.',
    task: 'Fortel om noko positivt som skjedde for kort tid sidan, og kva det lærte deg.',
    resonanceGoal: 'Sårbarheit gjennom delte minne',
  },
  {
    day: 5,
    phase: 'EARLY',
    theme: 'Menneske som har formet meg',
    reflectionQuestion: 'Kven er den viktigaste personen i livet ditt — ikkje nødvendigvis ein partner, men nokon som har endra deg?',
    conversationPrompt: 'Fortel om ein person som har hatt stor tyding for kven du er no. Kva lærte du av dei?',
    task: 'Del noko du vil at din nye partnar skal forstå om den reisen.',
    resonanceGoal: 'Respekt for fortid og påverknad',
  },
  {
    day: 6,
    phase: 'EARLY',
    theme: 'Draumane dine',
    reflectionQuestion: 'Kva er noko du alltid har lyst til å prøve, men som du ikkje har gjort enno?',
    conversationPrompt: 'Vis meg drømmane dine — dei store og dei små. Kva driv deg framover?',
    task: 'Del ein drøm eller eit mål. Kva gjer at det er viktig for deg?',
    resonanceGoal: 'Delt nysgjerrighet på framtida',
  },
  {
    day: 7,
    phase: 'EARLY',
    theme: 'Sjølvmotivasjon',
    reflectionQuestion: 'Kva får deg til å stå opp om morgonen — også i tunge periodar? Kva er drivkrafta di?',
    conversationPrompt: 'Fortel meg kva som gir deg energi, og kva som tek den frå deg. Korleis håndterer du tøffe dagar?',
    task: 'Del noko du gjer for å ta vare på deg sjølv.',
    resonanceGoal: 'Vis styrke gjennom sårbarheit',
  },
  {
    day: 8,
    phase: 'EARLY',
    theme: 'Det som betyr mest',
    reflectionQuestion: 'Viss du skulle velje berre 3 ting å ta med deg inn i ein ny relasjon — kva ville dei vore?',
    conversationPrompt: 'Fortel om dei 3 verdiane eller eigenskapane som betyr mest for deg. Korleis viser dei seg i kvardagen?',
    task: 'Del den viktigaste verdien din, og spør partneren om den same.',
    resonanceGoal: 'Kunnskap om kvarandre sin verdt-kompass',
  },
  {
    day: 9,
    phase: 'EARLY',
    theme: 'Humor og lettheit',
    reflectionQuestion: 'Kva gjer deg som person — gjer du mest av grin, eller er du meir alvorleg? Kven grinar mest i vennegjengen din?',
    conversationPrompt: 'Del noko latterleg eller morsomt som har skjedd deg nyleg. La partneren få sjå den lette sida di.',
    task: 'Finn ein måte å le saman på i dag — kanskje ved å dele eit minne eller eit inntrykk.',
    resonanceGoal: 'Lettheit og samla latter',
  },
  {
    day: 10,
    phase: 'EARLY',
    theme: 'Oppsummering av bryting isen',
    reflectionQuestion: 'Kva har vore den viktigaste innsikta di i dei første dagane? Kva lærte du om deg sjølv?',
    conversationPrompt: 'Samanfatt kva du har opplevd og lært i denne perioden. Kva kjener på no, etter 10 dagar?',
    task: 'Reflekter over den personlege reisa din — og del ei ting du ønsker å utforske vidare.',
    resonanceGoal: 'Bevisstheit om eigen utvikling',
  },

  // ───────────── EARLY (Dag 11-14) · BUILDING_TRUST (Dag 15-20) ─────────────
  {
    day: 11,
    phase: 'EARLY',
    theme: 'Å vere åpen og sårbar',
    reflectionQuestion: 'Kva gjer at du føler deg trygg nok til å opne deg for ein annan? Kva er det første steget?',
    conversationPrompt: 'Fortel noko du ikkje seier til alle. Kva var det som fekk deg til å velje akkurat denne personen?',
    task: 'Del noko du har halde tilbake — ein tanke eller kjensle.',
    resonanceGoal: 'Bygg tillit gjennom sårbarheit',
  },
  {
    day: 12,
    phase: 'EARLY',
    theme: 'Konflikt og respekt',
    reflectionQuestion: 'Korleis håndterer du uenigheiter? Trekkjer du deg tilbake eller går du rett på saka?',
    conversationPrompt: 'Fortel om ein konflikt du har vore i. Korleis enda han? Kva lærte du?',
    task: 'Del ei strategisk for korlei dere kunne håndtere uenigheiter saman — roleg og respektfullt.',
    resonanceGoal: 'Konflikt-respekt',
  },
  {
    day: 13,
    phase: 'EARLY',
    theme: 'Grenser og respekt',
    reflectionQuestion: 'Kva er ditt "ikkje-rør"-område? Kva ting vil du aldri tolerere eller akseptere?',
    conversationPrompt: 'Fortel om ein grense du har sett — eller ønskjer å setje. Korlei kan partneren din respektere den?',
    task: 'Del ei personleg grense, og spør partneren om di.',
    resonanceGoal: 'Mutenrespekt for kvarandre sine grenser',
  },
  {
    day: 14,
    phase: 'EARLY',
    theme: 'Takksemd og verdsetjing',
    reflectionQuestion: 'Kva er noko du meiner ofte blir undervurdert — men som eigentleg betyr mykje?',
    conversationPrompt: 'Fortel partneren din kva du set pris på ved dei. Kva har dei gjort som har betydd noko for deg?',
    task: 'Skriv eller sei ei ting du er takksam for med denne personen.',
    resonanceGoal: 'Takksemds-basert tilknyting',
  },
  {
    day: 15,
    phase: 'BUILDING_TRUST',
    theme: 'Familie og røter',
    reflectionQuestion: 'Korleis har familien din formet deg? Kva tok du med deg frå barndomshjemmet?',
    conversationPrompt: 'Fortel om ein tradisjon eller regel frå barndommen som du tek med deg no — eller den du vil sleppe.',
    task: 'Del noko frå familiebakgrunnen din som formar synet ditt på relasjonar.',
    resonanceGoal: 'Forståing for røter og påverknad',
  },
  {
    day: 16,
    phase: 'BUILDING_TRUST',
    theme: 'Verdiar i praksis',
    reflectionQuestion: 'Kva verdi er viktigast for deg — og kvifor? Korlei viser han seg i det du gjer?',
    conversationPrompt: 'Vel ein verd — t.d. ærligheit, mot eller omsorg — og fortel noko konkret der du har levd den.',
    task: 'Sammen: Del kvar sin viktigaste verdi og refleksjon over dei.',
    resonanceGoal: 'Verdiar som bro mellom to menneske',
  },
  {
    day: 17,
    phase: 'BUILDING_TRUST',
    theme: 'Sjå framover — drømmer saman',
    reflectionQuestion: 'Korleis tenkjer du ein god relasjon ser ut om eit år? Kva vil dere ha saman?',
    conversationPrompt: 'Del din visjon for ei trygg og djupe relasjon. Korlei trur du ein felles kvardag kan sjå ut?',
    task: 'Drøft med partneren kva type reiser og mål dere kunne hatt saman.',
    resonanceGoal: 'Felles framtidsvisjon',
  },
  {
    day: 18,
    phase: 'BUILDING_TRUST',
    theme: 'Å si nei — og å seie ja',
    reflectionQuestion: 'Når er det hardest for deg å seie nei? Og når er det vanskelegast å seie ja?',
    conversationPrompt: 'Fortel om ein gong du sa ja, men ville sagt nei. Og ein gong der omvendt skjedde.',
    task: 'Reflekter over kvar og kvifor — del med partneren dersom du trur det er trygt.',
    resonanceGoal: 'Autentisitet i relasjon',
  },
  {
    day: 19,
    phase: 'BUILDING_TRUST',
    theme: 'Styrker og svakheter',
    reflectionQuestion: 'Kva er den største styrken din? Og kva vil du sjølv gjere betre?',
    conversationPrompt: 'Del noko du er stolt av ved deg sjølv, og noko du jobbar med. Kva gjer at det er viktig?',
    task: 'Spør partneren om same — og lytt utan å evaluere.',
    resonanceGoal: 'Muten styrke og sårbarheit',
  },
  {
    day: 20,
    phase: 'BUILDING_TRUST',
    theme: 'Oppsummering av tillitsbygging',
    reflectionQuestion: 'Kva har vore den viktigaste lærdomen din i denne fasen? Kva har endra seg?',
    conversationPrompt: 'Samanfatt kva du har opplevd dei siste dagane. Er det noko som har overraska deg?',
    task: 'Reflekter over tillitsutviklinga — del ei ting du ønskjer å ta med deg til neste fase.',
    resonanceGoal: 'Medvit om eigen tillitsreise',
  },

  // ───────────── BUILDING_TRUST (Dag 21) · DEEPER (Dag 22-25) · CHECKIN (Dag 26-30) ─────────────
  {
    day: 21,
    phase: 'BUILDING_TRUST',
    theme: 'Frykt og mot',
    reflectionQuestion: 'Kva er den største frykta di i ein relasjon? Og kva gjer du likevel for å vere motvillig?',
    conversationPrompt: 'Fortel noko skummelt — men også viktig. Kva er det som gjer at du tør å dele det no?',
    task: 'Del ei uendeleg personleg frykt, og lytt til partneren si.',
    resonanceGoal: 'Djup tillit gjennom frykt-dekning',
  },
  {
    day: 22,
    phase: 'DEEPER',
    theme: 'Kanskje har du svike — eller blitt sviktet',
    reflectionQuestion: 'Når har du blitt soka baklengs av nokon du stolde på? Kva gjorde det med deg?',
    conversationPrompt: 'Fortel om ein gong noko gikk galt i tillit. Kva lærte du av det — og korlei er du betre no?',
    task: 'Del ei erfaring som har lært deg modning. Er partneren klar for den samtalen?',
    resonanceGoal: 'Sjokk-sårbarheit + gjenreising',
  },
  {
    day: 23,
    phase: 'DEEPER',
    theme: 'Kjærlighets-språket ditt',
    reflectionQuestion: 'Noko av det vakrast du har opplevd — kva var det? Kva tok du med deg frå det?',
    conversationPrompt: 'Fortel om ein gong nokon gjorde noko som fekk deg til å tenkje "dette er virkelig kjærleik".',
    task: 'Del noko personleg og viktig frå fortid — kva det lærte deg.',
    resonanceGoal: 'Djup emosjonell kopling',
  },
  {
    day: 24,
    phase: 'DEEPER',
    theme: 'Indre ro og stille stundar',
    reflectionQuestion: 'Kva er det som gir deg indre ro — eller i alle fall ein smule frid?',
    conversationPrompt: 'Fortel om eit øyeblikk du opplevde fullstendig ro. Kvar var du? Kva tenkte du? Kva kjende du?',
    task: 'Del ein måte å finne ro på, og spør partneren om den same.',
    resonanceGoal: 'Delt stilleheit og nærvær',
  },
  {
    day: 25,
    phase: 'DEEPER',
    theme: 'Kva gir livet meining?',
    reflectionQuestion: 'Kva er meningen med livet for deg? Er det kjærleik, vekst, friheit, eller noko heilt anna?',
    conversationPrompt: 'Fortel om kva du trur gir livet tyding — og korlei relasjonen din kan bidro til den meininga.',
    task: 'Del ein filosofi eller verdgrunnlag for kva eit godt liv betyr for deg.',
    resonanceGoal: 'Djup filosofisk resonans',
  },
  {
    day: 26,
    phase: 'CHECKIN',
    theme: 'Oppsummering av reisa',
    reflectionQuestion: 'Kva har denne reisen lært deg om deg sjølv, og om korlei du møter andre?',
    conversationPrompt: 'Samanfatt kva du har opplevd dei siste dagane. Kva er den viktigaste tinga du vil ta med deg?',
    task: 'Reflekter over heile reisa — skriv eller sei noko til partneren som betyr mykje.',
    resonanceGoal: 'Fellesskap og samling',
  },
  {
    day: 27,
    phase: 'CHECKIN',
    theme: 'Fortsetjing eller avslutning',
    reflectionQuestion: 'Viss du skulle velje — vil du halde fram? Er det noko du føler du veit no som du ikkje visste før?',
    conversationPrompt: 'Fortel kva du ønskjer å skje vidare. Er det noko du meiner må endre seg, eller er alt som det skal vere?',
    task: 'Del tankane dine om framtida — med openheit og ærlegheit.',
    resonanceGoal: 'Moden valmaking',
  },
  {
    day: 28,
    phase: 'CHECKIN',
    theme: 'Når du er sint',
    reflectionQuestion: 'Kva gjer du når du er sint? Gått du i dekning, eller konfronter du?',
    conversationPrompt: 'Fortel om ein gong du var sint — og korlei du håndterte det. Kva lærte deg av den opplevinga?',
    task: 'Del ein måte å handtere sinne på — og spør partneren om den same.',
    resonanceGoal: 'Sinne-håndtering og respekt',
  },
  {
    day: 29,
    phase: 'CHECKIN',
    theme: 'Døme på kjærleik',
    reflectionQuestion: 'Kva er det beste dømet på kjærleik du har opplevd — eller vitna på? Kva fekk deg til å tenkje "slik skal det vere"?',
    conversationPrompt: 'Fortel om eit øyeblikk der du såre at kjærleik eksisterer — i verkelegheita.',
    task: 'Del noko som gjer deg trygg på at kjærleik finst.',
    resonanceGoal: 'Delt tru på kjærleiken',
  },
  {
    day: 30,
    phase: 'CHECKIN',
    theme: 'Neste kapittel',
    reflectionQuestion: 'Kva vil du seie til deg sjølv — og til din partner — når denne reisen er over? Kva tar du med deg vidare?',
    conversationPrompt: 'Avslutt med ei takksemd, ei visjon eller eit løfte. Kva betyr denne reisa for deg?',
    task: 'Skriv eller seier noko frå hjartet til partneren — det siste ordet i 30-dagers reisa.',
    resonanceGoal: 'Moden avslutning + ny start',
  },
]

// ═══════════════════════════════════════════════════════════
// SEED-FUNKSJON
// ═══════════════════════════════════════════════════════════

async function seedJourneyContent() {
  try {
    console.log('🌱 Starter seeding av JourneyDayContent (30 dagar)...')

    for (const item of JOURNEY_CONTENT) {
      await prisma.journeyDayContent.upsert({
        where: { day: item.day },
        update: {
          theme: item.theme,
          phase: item.phase,
          reflectionQuestion: item.reflectionQuestion,
          conversationPrompt: item.conversationPrompt,
          task: item.task ?? null,
          resonanceGoal: item.resonanceGoal,
        },
        create: {
          day: item.day,
          theme: item.theme,
          phase: item.phase,
          reflectionQuestion: item.reflectionQuestion,
          conversationPrompt: item.conversationPrompt,
          task: item.task ?? null,
          resonanceGoal: item.resonanceGoal,
        },
      })

      console.log(`  ✅ Dag ${item.day} (${item.phase}) — "${item.theme}"`)
    }

    const total = await prisma.journeyDayContent.count()
    console.log(`\n✅ Seed fullført!`)
    console.log(`   ${total}/30 dagar seeda`)
  } catch (error) {
    console.error('❌ Feil under seeding:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

seedJourneyContent()