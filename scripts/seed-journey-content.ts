/**
 * Seed-skript for JourneyDayContent
 *
 * Oppretter 30 poster for dag 1–30 med tema, refleksjonsspørsmål og samtaleprompt.
 * Fase-inndeling fra engine.ts (kanonisk, PHASE_CONFIGS):
 *   Dag 1–14:  EARLY          (bryt isen, uten bilder)
 *   Dag 15–21: BUILDING_TRUST (bygg tillit, bilder tillatt)
 *   Dag 22–25: DEEPER         (dype samtaler)
 *   Dag 26–30: CHECKIN        (refleksjon og oppsummering)
 *
 * Kjøring:
 *   npx tsx scripts/seed-journey-content.ts
 */

import { PrismaClient, JourneyPhase } from '@prisma/client'

const prisma = new PrismaClient()

// ═══════════════════════════════════════════════════════════
// 30 DAGER MED INNHOLD
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
  // ───────────── EARLY (Dag 1–10, fortsetter til 14) ─────────────
  {
    day: 1,
    phase: 'EARLY',
    theme: 'Følelser og stemning',
    reflectionQuestion: 'Når kjenner du deg selv mest — når du er alene, eller sammen med andre?',
    conversationPrompt: 'Del noe om hva slags dag som gjør deg glad, og hva slags dag som gjør deg lei.',
    task: 'Se opp på himmelen i dag. Hvilken farge passer stemningen din nå?',
    resonanceGoal: 'Start med å oppdage hverandre — følelsene',
  },
  {
    day: 2,
    phase: 'EARLY',
    theme: 'Hverdagsritualer',
    reflectionQuestion: 'Hvilke ritualer eller rutiner har du i hverdagen din?',
    conversationPrompt: 'Fortell om en vanlig morgen eller kveld for deg. Hva betyr disse stundene for deg?',
    task: 'Del en liten vane fra hverdagen din — noe bare du, og kanskje noen få nær, vet om.',
    resonanceGoal: 'Bygge hverdagsforståelse',
  },
  {
    day: 3,
    phase: 'EARLY',
    theme: 'Plasser som betyr mye',
    reflectionQuestion: 'Finnes det et sted der du alltid kjenner deg trygg og hjemme? Hva er det med den plassen?',
    conversationPrompt: 'Vis meg — eller beskriv — et sted som betyr mye for deg. Hvor ligger det, og hvorfor er det spesielt?',
    task: 'Beskriv plassen for partneren din, og lytt til hva som betyr noe for den andre.',
    resonanceGoal: 'Delt trygghet gjennom plass',
  },
  {
    day: 4,
    phase: 'EARLY',
    theme: 'Kjære minner',
    reflectionQuestion: 'Noen av de vakreste opplevelsene dine — hva var det? Hva tok du med deg fra dem?',
    conversationPrompt: 'Del et minne som fortsatt gir deg varme eller styrke. Fortell det som om jeg var der.',
    task: 'Fortell om noe positivt som skjedde for kort tid siden, og hva det lærte deg.',
    resonanceGoal: 'Sårbarhet gjennom delte minner',
  },
  {
    day: 5,
    phase: 'EARLY',
    theme: 'Mennesker som har formet meg',
    reflectionQuestion: 'Hvem er den viktigste personen i livet ditt — ikke nødvendigvis en partner, men noen som har endret deg?',
    conversationPrompt: 'Fortell om en person som har hatt stor betydning for hvem du er i dag. Hva lærte du av dem?',
    task: 'Del noe du vil at den nye partneren din skal forstå om den reisen.',
    resonanceGoal: 'Respekt for fortid og påvirkning',
  },
  {
    day: 6,
    phase: 'EARLY',
    theme: 'Drømmene dine',
    reflectionQuestion: 'Hva er noe du alltid har lyst til å prøve, men som du ikke har gjort ennå?',
    conversationPrompt: 'Vis meg drømmene dine — de store og de små. Hva driver deg fremover?',
    task: 'Del en drøm eller et mål. Hva gjør det viktig for deg?',
    resonanceGoal: 'Delt nysgjerrighet på fremtiden',
  },
  {
    day: 7,
    phase: 'EARLY',
    theme: 'Selvmotivasjon',
    reflectionQuestion: 'Hva får deg til å stå opp om morgenen — også i tunge perioder? Hva er drivkraften din?',
    conversationPrompt: 'Fortell meg hva som gir deg energi, og hva som tar den fra deg. Hvordan håndterer du krevende dager?',
    task: 'Del noe du gjør for å ta vare på deg selv.',
    resonanceGoal: 'Vis styrke gjennom sårbarhet',
  },
  {
    day: 8,
    phase: 'EARLY',
    theme: 'Det som betyr mest',
    reflectionQuestion: 'Måtte du velge bare tre ting å ta med deg inn i en ny relasjon — hva ville det vært?',
    conversationPrompt: 'Fortell om de tre verdiene eller egenskapene som betyr mest for deg. Hvordan viser de seg i hverdagen?',
    task: 'Del den viktigste verdien din, og spør partneren om deres.',
    resonanceGoal: 'Kunnskap om hverandres verdikompas',
  },
  {
    day: 9,
    phase: 'EARLY',
    theme: 'Humor og letthet',
    reflectionQuestion: 'Hva gjør deg til den du er — er du mest av grinen, eller mer alvorlig? Hvem ler mest i vennegjengen din?',
    conversationPrompt: 'Del noe morsomt eller underholdende som har skjedd deg nylig. La partneren få se den lette siden av deg.',
    task: 'Finn en måte å le sammen på i dag — kanskje ved å dele et minne eller et inntrykk.',
    resonanceGoal: 'Letthet og felles latter',
  },
  {
    day: 10,
    phase: 'EARLY',
    theme: 'Oppsummering av startfasen',
    reflectionQuestion: 'Hva har vært den viktigste innsikten din i disse første dagene? Hva lærte du om deg selv?',
    conversationPrompt: 'Oppsummer hva du har opplevd og lært i denne perioden. Hva kjenner du på nå, etter 10 dager?',
    task: 'Reflekter over den personlige reisen din — og del én ting du ønsker å utforske videre.',
    resonanceGoal: 'Bevissthet om egen utvikling',
  },
  // ───────────── EARLY (Dag 11–14) · BUILDING_TRUST (Dag 15–20) ─────────────
  {
    day: 11,
    phase: 'EARLY',
    theme: 'Å være åpen og sårbar',
    reflectionQuestion: 'Hva gjør at du kjenner deg trygg nok til å åpne deg for en annen? Hva er det første steget?',
    conversationPrompt: 'Fortell noe du ikke sier til alle. Hva var det som fikk deg til å velge akkurat denne personen?',
    task: 'Del noe du har holdt tilbake — en tanke eller en følelse.',
    resonanceGoal: 'Bygge tillit gjennom sårbarhet',
  },
  {
    day: 12,
    phase: 'EARLY',
    theme: 'Konflikt og respekt',
    reflectionQuestion: 'Hvordan håndterer du uenigheter? Trekker du deg tilbake, eller går du rett på saken?',
    conversationPrompt: 'Fortell om en konflikt du har vært i. Hvordan endte den? Hva lærte du?',
    task: 'Del en strategi for hvordan dere kan håndtere uenigheter sammen — rolig og respektfullt.',
    resonanceGoal: 'Respekt i konflikt',
  },
  {
    day: 13,
    phase: 'EARLY',
    theme: 'Grenser og respekt',
    reflectionQuestion: 'Hva er ditt "ikke-rør"-område? Hva vil du aldri tolerere eller akseptere?',
    conversationPrompt: 'Fortell om en grense du har satt — eller ønsker å sette. Hvordan kan partneren din respektere den?',
    task: 'Del en personlig grense, og spør partneren om deres.',
    resonanceGoal: 'Gjensidig respekt for hverandres grenser',
  },
  {
    day: 14,
    phase: 'EARLY',
    theme: 'Takknemlighet og verdssetting',
    reflectionQuestion: 'Hva er noe du tror ofte blir undervurdert — men som egentlig betyr mye?',
    conversationPrompt: 'Fortell partneren din hva du setter pris på ved dem. Hva har de gjort som har betydd noe for deg?',
    task: 'Skriv eller si én ting du er takknemlig for med denne personen.',
    resonanceGoal: 'Takknemlighetsbasert tilknytning',
  },
  {
    day: 15,
    phase: 'BUILDING_TRUST',
    theme: 'Familie og røtter',
    reflectionQuestion: 'Hvordan har familien din formet deg? Hva tok du med deg fra barndomshjemmet?',
    conversationPrompt: 'Fortell om en tradisjon eller regel fra barndommen som du tar med deg i dag — eller én du vil slippe.',
    task: 'Del noe fra familiebakgrunnen din som har formet synet ditt på relasjoner.',
    resonanceGoal: 'Forståelse for røtter og påvirkning',
  },
  {
    day: 16,
    phase: 'BUILDING_TRUST',
    theme: 'Verdier i praksis',
    reflectionQuestion: 'Hvilken verdi er viktigst for deg — og hvorfor? Hvordan viser den seg i det du gjør?',
    conversationPrompt: 'Velg en verdi — f.eks. ærlighet, mot eller omsorg — og fortell noe konkret der du har levdt den.',
    task: 'Sammen: Del hver sin viktigste verdi, og reflekter over dem.',
    resonanceGoal: 'Verdier som bro mellom to mennesker',
  },
  {
    day: 17,
    phase: 'BUILDING_TRUST',
    theme: 'Se fremover — drømmer sammen',
    reflectionQuestion: 'Hvordan forestiller du deg at en god relasjon ser ut om et år? Hva vil dere ha sammen?',
    conversationPrompt: 'Del din visjon for et trygt og dypt forhold. Hvordan tror du en felles hverdag kan se ut?',
    task: 'Drøft med partneren hva slags reiser og mål dere kunne hatt sammen.',
    resonanceGoal: 'Felles fremtidsvisjon',
  },
  {
    day: 18,
    phase: 'BUILDING_TRUST',
    theme: 'Å si nei — og å si ja',
    reflectionQuestion: 'Når er det hardest for deg å si nei? Og når er det hardest å si ja?',
    conversationPrompt: 'Fortell om en gang du sa ja, men gjerne ville sagt nei. Og en gang der motsatt skjedde.',
    task: 'Reflekter over hver av dem og hvorfor — del med partneren dersom du tror det er trygt.',
    resonanceGoal: 'Autentisitet i relasjonen',
  },
  {
    day: 19,
    phase: 'BUILDING_TRUST',
    theme: 'Styrker og svaksider',
    reflectionQuestion: 'Hva er din største styrke? Og hva vil du selv gjerne bli bedre i?',
    conversationPrompt: 'Del noe du er stolt av ved deg selv, og noe du jobber med. Hva gjør det viktig?',
    task: 'Spør partneren om det samme — og lytt uten å vurdere.',
    resonanceGoal: 'Felles styrke og sårbarhet',
  },
  {
    day: 20,
    phase: 'BUILDING_TRUST',
    theme: 'Oppsummering av tillitsbyggingen',
    reflectionQuestion: 'Hva har vært den største læren din i denne fasen? Hva har endret seg?',
    conversationPrompt: 'Oppsummer hva du har opplevd de siste dagene. Er det noe som har overrasket deg?',
    task: 'Reflekter over tillitsutviklingen — del én ting du ønsker å ta med deg til neste fase.',
    resonanceGoal: 'Bevissthet om egen tillitsreise',
  },
  // ───────────── BUILDING_TRUST (Dag 21) · DEEPER (Dag 22–25) · CHECKIN (Dag 26–30) ─────────────
  {
    day: 21,
    phase: 'BUILDING_TRUST',
    theme: 'Frykt og mot',
    reflectionQuestion: 'Hva er den største frykten din i en relasjon? Og hva gjør du likevel, for å være modig?',
    conversationPrompt: 'Fortell noe skremmende — men også viktig. Hva er det som gjør at du tør å dele det nå?',
    task: 'Del en dypt personlig frykt, og lytt til partnerens.',
    resonanceGoal: 'Dyp tillit gjennom å møte frykten',
  },
  {
    day: 22,
    phase: 'DEEPER',
    theme: 'Når du har sviktet — eller blitt sviktet',
    reflectionQuestion: 'Når har du blitt skuffet av noen du stolte på? Hva gjorde det med deg?',
    conversationPrompt: 'Fortell om en gang noe gikk galt med tillit. Hva lærte du av det — og hvordan er du annerledes nå?',
    task: 'Del en erfaring som har modnet deg. Er partneren klar for den samtalen?',
    resonanceGoal: 'Dyp sårbarhet og gjenopprettelse',
  },
  {
    day: 23,
    phase: 'DEEPER',
    theme: 'Ditt kjærlighetsspråk',
    reflectionQuestion: 'Hva er det som får deg til å kjenne deg mest elsket? Og hvordan viser du din kjærlighet?',
    conversationPrompt: 'Fortell om en gang noen gjorde noe som fikk deg til å tenke "dette er virkelig kjærlighet".',
    task: 'Del noe personlig og viktig fra fortiden — og hva det lærte deg.',
    resonanceGoal: 'Dyp emosjonell kobling',
  },
  {
    day: 24,
    phase: 'DEEPER',
    theme: 'Indre ro og stille stunder',
    reflectionQuestion: 'Hva er det som gir deg indre ro — eller i alle fall en smule fred?',
    conversationPrompt: 'Fortell om et øyeblikk du opplevde fullstendig ro. Hvor var du? Hva tenkte du? Hva kjente du?',
    task: 'Del en måte å finne ro på, og spør partneren om deres.',
    resonanceGoal: 'Delt stillhet og nærvær',
  },
  {
    day: 25,
    phase: 'DEEPER',
    theme: 'Hva gir livet mening?',
    reflectionQuestion: 'Hva er meningen med livet for deg? Er det kjærlighet, vekst, frihet, eller noe helt annet?',
    conversationPrompt: 'Fortell om hva du tror gir livet betydning — og hvordan relasjonen din kan bidra til den meningen.',
    task: 'Del en filosofi eller et verdigrunnlag for hva et godt liv betyr for deg.',
    resonanceGoal: 'Dyp filosofisk resonans',
  },
  {
    day: 26,
    phase: 'CHECKIN',
    theme: 'Oppsummering av reisen',
    reflectionQuestion: 'Hva har denne reisen lært deg om deg selv, og om hvordan du møter andre?',
    conversationPrompt: 'Oppsummer hva du har opplevd de siste dagene. Hva er den viktigste tingen du vil ta med deg?',
    task: 'Reflekter over hele reisen — skriv eller si noe til partneren som betyr mye.',
    resonanceGoal: 'Fellesskap og samling',
  },
  {
    day: 27,
    phase: 'CHECKIN',
    theme: 'Fortsett eller avslutt',
    reflectionQuestion: 'Måtte du velge — vil du fortsette? Er det noe du vet nå som du ikke visste før?',
    conversationPrompt: 'Fortell hva du ønsker at skal skje videre. Er det noe du mener bør endre seg, eller er alt som det skal være?',
    task: 'Del tankene dine om fremtiden — med åpenhet og ærlighet.',
    resonanceGoal: 'Moden valgsetting',
  },
  {
    day: 28,
    phase: 'CHECKIN',
    theme: 'Når du er sint',
    reflectionQuestion: 'Hva gjør du når du er sint? Går du i dekning, eller konfronterer du?',
    conversationPrompt: 'Fortell om en gang du var sint — og hvordan du håndterte det. Hva lærte du av den opplevelsen?',
    task: 'Del en måte å håndtere sinne på — og spør partneren om deres.',
    resonanceGoal: 'Sinnehåndtering og respekt',
  },
  {
    day: 29,
    phase: 'CHECKIN',
    theme: 'Et eksempel på kjærlighet',
    reflectionQuestion: 'Hva er det beste eksempelet på kjærlighet du har opplevd — eller vitnet til? Hva fikk deg til å tenke "slik skal det være"?',
    conversationPrompt: 'Fortell om et øyeblikk der du så at kjærlighet finnes — i virkeligheten.',
    task: 'Del noe som gjør deg sikker på at kjærlighet finnes.',
    resonanceGoal: 'Delt tro på kjærligheten',
  },
  {
    day: 30,
    phase: 'CHECKIN',
    theme: 'Neste kapittel',
    reflectionQuestion: 'Hva vil du si til deg selv — og til partneren din — når denne reisen er over? Hva tar du med deg videre?',
    conversationPrompt: 'Avslutt med en takknemlighet, en visjon eller et løfte. Hva betyr denne reisen for deg?',
    task: 'Skriv eller si noe fra hjertet til partneren — det siste ordet i 30-dagersreisen.',
    resonanceGoal: 'Moden avslutning + ny start',
  },
]

// ═══════════════════════════════════════════════════════════
// SEED-FUNKSJON
// ═══════════════════════════════════════════════════════════

async function seedJourneyContent() {
  try {
    console.log('🌱 Starter seeding av JourneyDayContent (30 dager)...')

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
    console.log(`   ${total}/30 dager seedet`)
  } catch (error) {
    console.error('❌ Feil under seeding:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

seedJourneyContent()
