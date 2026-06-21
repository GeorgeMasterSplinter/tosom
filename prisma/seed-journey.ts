/**
 * seed-journey.ts — 30 dagar med journey-innhald
 * 
 * Core-definition: Guidet 30-dagers reise med dagleg refleksjon, tema, oppgåve og resonans
 * Ingen gamification. Ingen bilder før dag 15.
 */

import { PrismaClient, JourneyPhase } from "@prisma/client";

const prisma = new PrismaClient();

const journeyContent: Array<{
  day: number;
  phase: JourneyPhase;
  theme: string;
  reflectionQuestion: string;
  conversationPrompt: string;
  task: string | null;
  resonanceGoal: string;
  systemMessage: string | null;
}> = [
  // === FASE 1: Introduksjon (Dag 1-5) ===
  {
    day: 1,
    phase: JourneyPhase.EARLY,
    theme: "Velkomen — kvar startar du?",
    reflectionQuestion: "Kva følelsar tek du med inn i denne reisen?",
    conversationPrompt: "Fortel kort om kven du er — berre det du føler for å dele.",
    task: "Svar på refleksjonsspørsmålet og del svaret med din match.",
    resonanceGoal: "Åpne deg mildt — ingen press.",
    systemMessage: "Dagen er din start. Tek på eitt ord: kva du føler for å dele.",
  },
  {
    day: 2,
    phase: JourneyPhase.EARLY,
    theme: "Livssituasjon — kvardagen din",
    reflectionQuestion: "Kva er det viktigaste i din kvardag — og kvifor?",
    conversationPrompt: "Kva ser ein i den vanlege dagen din? Fortel om éin dag.",
    task: "Del om din vanlege kveld — kva gjer du, kva tenkjer du?",
    resonanceGoal: "Trygghet — kjenne at kvardar møtest.",
    systemMessage: "Kvardagen er der ekte connection byrjar. Del det du vil.",
  },
  {
    day: 3,
    phase: JourneyPhase.EARLY,
    theme: "Verdiar — kva driv deg?",
    reflectionQuestion: "Kva verdiar kan du aldri svike — og kvifor er dei viktige?",
    conversationPrompt: "Kva er ikkje forhandlingsbart for deg? Kva kan du ikkje leve utan?",
    task: "Vel 3 verdiar og forklær kvifor dei betyr noko for deg.",
    resonanceGoal: "Djukde — verdiane som binder saman.",
    systemMessage: "Verdiar er kompasset vårt. Del det som betyr noko.",
  },
  {
    day: 4,
    phase: JourneyPhase.EARLY,
    theme: "Kommunikasjon — korleis høyrer du?",
    reflectionQuestion: "Kommuniserer du best gjennom ord,handling eller stillheit?",
    conversationPrompt: "Korleis tek du nærleik til andre? Og korleis ønsker du å verte teken?",
    task: "Fortel om ein gong du følte deg verkeleg hørd.",
    resonanceGoal: "Mild resonans — finne språk saman.",
    systemMessage: "Kommunikasjon er bro mellom to sjelar. Del din erfaring.",
  },
  {
    day: 5,
    phase: JourneyPhase.EARLY,
    theme: "Personlegdom — kven er du?",
    reflectionQuestion: "Kva seier om deg at du er deg — uavhengig av alle andres meining?",
    conversationPrompt: "Kva er det ved deg som ingen merker første gangen?",
    task: "Del ein eigenskap du er stolt av — eller ein du ønskjer å utvikle.",
    resonanceGoal: "Ekte syn — sjå gjennom hjarte, ikkje ord.",
    systemMessage: "Djup forståskap krev djup sjølvforståing. Del det du er klar for.",
  },

  // === FASE 2: Trygghet (Dag 6-14) ===
  {
    day: 6,
    phase: JourneyPhase.BUILDING_TRUST,
    theme: "Trygghet — kva føler du no?",
    reflectionQuestion: "Kjenner du deg tryg i dialogen deres — eller er det rom for usikkerheit?",
    conversationPrompt: "Kva gjer deg tryg i samtalar? Kva gjer deg utryg?",
    task: "Del ein situasjon der du følte deg tryg med nokon.",
    resonanceGoal: "Trygghet gjennom sårbarhet.",
    systemMessage: "Trygghet byrjar når ein tør å vere seg sjølv.",
  },
  {
    day: 7,
    phase: JourneyPhase.BUILDING_TRUST,
    theme: "Sårbarhet — det skjulte",
    reflectionQuestion: "Kva er det du aldri viser først? Kvifor vel du å dele det no?",
    conversationPrompt: "Kva er hardeste å openne seg om? Vil du prøve no?",
    task: "Del ein svakheit — eller ein frykt du gjerne vil lata gå.",
    resonanceGoal: "Sårbar samling — når to sjelar møtest.",
    systemMessage: "Sårbarhet er ikkje svakt — det er det sterkaste ein kan gi.",
  },
  {
    day: 8,
    phase: JourneyPhase.BUILDING_TRUST,
    theme: "Emosjonelle mønster — kva går igjen?",
    reflectionQuestion: "Kva gjentar seg i dine relasjonar? Kva mønster burde du bryte?",
    conversationPrompt: "Har du lagt merke til noko i deg sjølv som gjentar seg?",
    task: "Reflekter over eit mønster — og del om du vil bryte det.",
    resonanceGoal: "Innsikt — kjenne sine eigne mønster.",
    systemMessage: "Mønster viser veg til sjølvforståing.",
  },
  {
    day: 9,
    phase: JourneyPhase.BUILDING_TRUST,
    theme: "Grensar — kva er ditt nei?",
    reflectionQuestion: "Kva er grensene dine — og kvifor er dei viktige?",
    conversationPrompt: "Kva er ikkje forhandlingsbart? Kva føler du behov for å seie nei til?",
    task: "Definer éin grense du ønsker å dele med din match.",
    resonanceGoal: "Respekt — kjenne kvar andre sluttar.",
    systemMessage: "Grensar er kjærleik til sjølv. Respekt for dei er kjærleik til ein annan.",
  },
  {
    day: 10,
    phase: JourneyPhase.BUILDING_TRUST,
    theme: "Nærheit — kva føler du?",
    reflectionQuestion: "Korleis opplever du nærleik — fysisk, emosjonelt, psykisk?",
    conversationPrompt: "Kva gjer nærleik verkeleg — og kva gjer det flat?",
    task: "Fortel om ein gong du følte ekte nærheit med nokon.",
    resonanceGoal: "Nær samling — føle at to er nærme.",
    systemMessage: "Nærheit kjem frå hjarte, ikkje frå avstand.",
  },
  {
    day: 11,
    phase: JourneyPhase.BUILDING_TRUST,
    theme: "Empati — å sjå gjennom auga til ein annan",
    reflectionQuestion: "Kva gjer deg god til å forstå andre sine følelser?",
    conversationPrompt: "Korlei tek du til deg noko ein annan deler med deg?",
    task: "Øv empathi: still eit djupt spørsmål til din match.",
    resonanceGoal: "Empatisk resonans — kjenne det andre føler.",
    systemMessage: "Empati er å brygge bro mellom sjelar.",
  },
  {
    day: 12,
    phase: JourneyPhase.BUILDING_TRUST,
    theme: "Åpne deg — meir enn ord",
    reflectionQuestion: "Kva har endra seg i deg sidan du starta denne reisen?",
    conversationPrompt: "Kva kjensler oppstår når du tenkjer på å åpne deg meir?",
    task: "Del ein tanke du aldri trur du ville delt — no.",
    resonanceGoal: "Djup oppening — kjenne friheit i sårbarhet.",
    systemMessage: "Åpne deg når du er klar. Ingen press.",
  },
  {
    day: 13,
    phase: JourneyPhase.BUILDING_TRUST,
    theme: "Tillit — det stille bandet",
    reflectionQuestion: "Kva treng du for å stole fullt og heilt på ein annan?",
    conversationPrompt: "Korlei byggjer vi tillit mellom oss — her, no?",
    task: "Fortel om ein gong du mista tillit — og korlei du grov deg opp att.",
    resonanceGoal: "Tillit gjennom tid og ærad.",
    systemMessage: "Tillit er ikkje gitt — det er vokse.",
  },
  {
    day: 14,
    phase: JourneyPhase.BUILDING_TRUST,
    theme: "Refleksjon — 14 dagar utan bilder",
    reflectionQuestion: "Kva har denne perioden utan bilder lært deg om deg sjølv?",
    conversationPrompt: "Kva har endra seg i måten du ser på connection?",
    task: "Skriv ein kort refleksjon over reisa di dei siste 14 dagane.",
    resonanceGoal: "Refleksjon og ærad for reisen.",
    systemMessage: "Dag 14 — du har bygt noko ekte. Bilete kjem seinare.",
  },

  // === FASE 3: Dypare samtalar (Dag 15-25) ===
  {
    day: 15,
    phase: JourneyPhase.DEEPER,
    theme: "Bilete — når du er klar",
    reflectionQuestion: "Kva kjensler oppstår når du deler bilete?",
    conversationPrompt: "Kva er det første du legg merke til? Og kva kjensler kjem?",
    task: "Del eit bilete — berre om du føler deg klar.",
    resonanceGoal: "Visuell connecting — utan overflatefokus.",
    systemMessage: "Dag 15 — du kan no dele bilete, om du vil.",
  },
  {
    day: 16,
    phase: JourneyPhase.DEEPER,
    theme: "Livsval — kva forma deg?",
    reflectionQuestion: "Kva val har forma deg mest — og korlei vil du forme framtid?",
    conversationPrompt: "Kva var det viktigaste valet du har tatt?",
    task: "Del eit livsval som endra alt for deg.",
    resonanceGoal: "Djukde gjennom historie.",
    systemMessage: "Livet er vala vi tek. Del det du ber.",
  },
  {
    day: 17,
    phase: JourneyPhase.DEEPER,
    theme: "Drøm — kva gler du deg til?",
    reflectionQuestion: "Kva drømmar ligg i deg — og kven vil du dela dei med?",
    conversationPrompt: "Kva gler du deg mest til i framtida?",
    task: "Fortel om ein drøm — stor eller liten.",
    resonanceGoal: "Felles framtidssyn.",
    systemMessage: "Drømmar er kompasset for sjelar.",
  },
  {
    day: 18,
    phase: JourneyPhase.DEEPER,
    theme: "Konflikt — korleis møter vi uro?",
    reflectionQuestion: "Korlei handterer du uroe i relasjonar — flykter du eller møter du?",
    conversationPrompt: "Kva gjer du når det blir tungt i ein dialog?",
    task: "Del ein konflikt du har møtt — og kva du lærte.",
    resonanceGoal: "Konflikt-resonans — kjenne trygghet i uroe.",
    systemMessage: "Konflikt er ikkje ende — det er start på djupde.",
  },
  {
    day: 19,
    phase: JourneyPhase.DEEPER,
    theme: "Trod og spiritualitet — kva tror du på?",
    reflectionQuestion: "Har du noko du trud på — religiøst, filosofisk, personleg?",
    conversationPrompt: "Kva gir deg meining utover kvardagen?",
    task: "Del noko du trud på — eller lenger etter å forstå.",
    resonanceGoal: "Åndeleg resonans — meining saman.",
    systemMessage: "Spiritualitet er personleg. Del berre det du vil.",
  },
  {
    day: 20,
    phase: JourneyPhase.DEEPER,
    theme: "Familie — røtter og arv",
    reflectionQuestion: "Kva har familien lært deg om relasjonar?",
    conversationPrompt: "Kva tek du med frå barndomen — og kva vil du gjere annerleis?",
    task: "Fortel om ein familietradisjon som betyr noko.",
    resonanceGoal: "Røtt-samling — kjenne historia bak.",
    systemMessage: "Familie er røter — men vi vel sjølv kva vi vatnar.",
  },
  {
    day: 21,
    phase: JourneyPhase.DEEPER,
    theme: "Venner — kva velger du?",
    reflectionQuestion: "Kva søkjer du i vener — og kva gir du?",
    conversationPrompt: "Kven er dei næraste vennene dine — og kvifor?",
    task: "Fortel om ein venn som har betydd noko stort.",
    resonanceGoal: "Sosial resonans — kjenne felles verdiar.",
    systemMessage: "Vener er speglingar av hjarte.",
  },
  {
    day: 22,
    phase: JourneyPhase.DEEPER,
    theme: "Karriere og mening — kva gjer du?",
    reflectionQuestion: "Kva gjer du i livet — og kvifor gjer du det?",
    conversationPrompt: "Kva gir meining i kvardagen din?",
    task: "Del kva du jobbar med — og kva det seier om deg.",
    resonanceGoal: "Mening-samling — felles driv.",
    systemMessage: "Arbeid er uttrykk for sjel. Del det du brenn for.",
  },
  {
    day: 23,
    phase: JourneyPhase.DEEPER,
    theme: "Natur og miljø — kva omgir deg?",
    reflectionQuestion: "Kvar føler du deg mest deg sjølv — og kva gjer du der?",
    conversationPrompt: "Kva sted eller miljø gir deg fred?",
    task: "Del eit stad eller miljø som betyr noko for deg.",
    resonanceGoal: "Natur-resonans — felles ro.",
    systemMessage: "Natur er spegling av indre landskap.",
  },
  {
    day: 24,
    phase: JourneyPhase.DEEPER,
    theme: "Tid og aldring — kva seier det om deg?",
    reflectionQuestion: "Korlei ser du på aldring — som gåve, byrde, eller noko anna?",
    conversationPrompt: "Kva vonde eller gleder du har hatt med aldring?",
    task: "Fortel om ein gong tid kjende seg meningsfull.",
    resonanceGoal: "Tid-resonans — kjenne felles rytme.",
    systemMessage: "Tid er den viktigaste gåva vi har. Del kva den betyr.",
  },
  {
    day: 25,
    phase: JourneyPhase.DEEPER,
    theme: "Gratjevd — kva er du takknemleg for?",
    reflectionQuestion: "Kva er du takknemleg for i livet no?",
    conversationPrompt: "Kva øydelegger du mest i kvardagen — og kva gjer deg glad?",
    task: "Skriv ned 3 ting du er takknemleg for — og del dei.",
    resonanceGoal: "Takknem-resonans — felles glede.",
    systemMessage: "Takknemskap er djupaste forma for kjærleik.",
  },

  // === FASE 4: Felles reise (Dag 26-30) ===
  {
    day: 26,
    phase: JourneyPhase.CHECKIN,
    theme: "Felles visjon — kva byggjer vi?",
    reflectionQuestion: "Kva ønskjer du å byggje saman — eller kva ønskjer du frå ein relasjon?",
    conversationPrompt: "Kva ser du no i din match — som du ikkje såg tidlegare?",
    task: "Fortel kva du ser fram mot i ein mogeleg framtidig relasjon.",
    resonanceGoal: "Felles framtid — synleggjere drøm.",
    systemMessage: "Framtid bygger vi i dag. Del det du ser.",
  },
  {
    day: 27,
    phase: JourneyPhase.CHECKIN,
    theme: "Behov og ønskjer — kva manglar du?",
    reflectionQuestion: "Kva føler du mest behov for no — og kvifor?",
    conversationPrompt: "Kva treng du av din match — og kva kan du gi?",
    task: "Definer éit behov du ønsker å dekle med din match.",
    resonanceGoal: "Behov-resonans — kjenne kvarandre djupare.",
    systemMessage: "Behov er ikkje svakt — det er ekte.",
  },
  {
    day: 28,
    phase: JourneyPhase.CHECKIN,
    theme: "Felles minne — kva har vi bygt?",
    reflectionQuestion: "Kva minne har dere bygd saman — og kva vil du halde fast?",
    conversationPrompt: "Kva øydeleg har vore spesielt i reisa di?",
    task: "Fortel om ein øydeleg i deres dialog som blir verande.",
    resonanceGoal: "Minne-samling — feste det som gjeld.",
    systemMessage: "Minne er stein i brua mellom sjelar.",
  },
  {
    day: 29,
    phase: JourneyPhase.CHECKIN,
    theme: "Endringar — kva har skjedd med deg?",
    reflectionQuestion: "Kva har endra seg i deg gjennom denne reisen?",
    conversationPrompt: "Kva har din match lært deg om deg sjølv?",
    task: "Skriv ei kort refleksjon over reisa di — og kva ho har betydd.",
    resonanceGoal: "Reflektiv resonans — kjenne vekst.",
    systemMessage: "Vekst kjem gjennom å stå imot. Du har gjort det.",
  },
  {
    day: 30,
    phase: JourneyPhase.CHECKIN,
    theme: "Avslutning og nytt begin — kva vel du?",
    reflectionQuestion: "Kva tar du med deg frå 30 dagar — og kva letter du gå?",
    conversationPrompt: "Kva ønskjer du av vidare reise med din match?",
    task: "Vel: fortset, avslutt, eller ta pause. Du bestemmer.",
    resonanceGoal: "Avsluttande resonans — ærad for reisa.",
    systemMessage: "Dagen 30 — din reise er fullført. Vel sjølv veien vidare.",
  },
];

async function seed() {
  console.log("🌱 Seed JourneyDayContent (30 dagar)...");

  let seeded = 0;

  for (const item of journeyContent) {
    const existing = await prisma.journeyDayContent.findFirst({
      where: { day: item.day },
    });

    if (existing) {
      await prisma.journeyDayContent.update({
        where: { id: existing.id },
        data: item,
      });
      console.log(`  ✅ Dag ${item.day} oppdatert: ${item.theme}`);
    } else {
      await prisma.journeyDayContent.create({ data: item });
      console.log(`  ✨ Dag ${item.day} oppretta: ${item.theme}`);
    }

    seeded++;
  }

  console.log(`✅ ${seeded} dagar seeda.`);
}

seed()
  .catch((e) => {
    console.error("❌ Seed feila:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());