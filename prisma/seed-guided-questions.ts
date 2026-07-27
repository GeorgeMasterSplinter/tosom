// prisma/seed-guided-questions.ts — Seed data for guidede spørsmål-kategoriar
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface QuestionData { content: string; depthLevel: number }

interface CategoryData {
  name: string;
  description: string;
  order: number;
  icon: string;
  color: string;
  questions: QuestionData[];
}

const CATEGORIES: CategoryData[] = [
  {
    name: 'Trygghet',
    description: 'Spørsmål om trygghet og trygge rammer i relasjonen.',
    order: 1,
    icon: 'shield',
    color: '#D4AF37',
    questions: [
      { content: 'Hva trenger du for å føle deg trygg i starten av en ny relasjon?', depthLevel: 1 },
      { content: 'Hvordan opplever du tryggheten mellom dere akkurat nå?', depthLevel: 2 },
      { content: 'Når har du sist følt deg fullt ut trygg med noen — og kva gjorde det?', depthLevel: 3 },
      { content: 'Hva betyr fysisk trygghet for deg i en relasjon?', depthLevel: 1 },
      { content: 'Kan du beskrive et øyeblikk der du kjente deg virkelig hørt?', depthLevel: 3 },
      { content: 'Hvordan reagerer du når noe føles utrygt i en samtale?', depthLevel: 2 },
      { content: 'Hva er det som gjør at du åpner opp for noen?', depthLevel: 2 },
      { content: 'Er det forskjell på å føle seg trygg og å stole på noen?', depthLevel: 3 },
      { content: 'Hvordan vet du at partneren din tar deg alvorlig?', depthLevel: 2 },
      { content: 'Hva medvirker til å skape ro i relasjonen for deg?', depthLevel: 1 },
      { content: 'Hvordan ser trygghet ut i hverdagen for dere?', depthLevel: 2 },
      { content: 'Hva gjør du når du føler deg sår i en samtale?', depthLevel: 3 },
      { content: 'Hva er viktig for deg når det gjelder å bli møtt med respekt?', depthLevel: 1 },
      { content: 'Når har du slitt med å si hva du egentlig tenker?', depthLevel: 2 },
      { content: 'Hva vil si at noen er trygg å være sammen med?', depthLevel: 3 },
      { content: 'Hvordan opplever du at partneren din gir deg rom for å være deg selv?', depthLevel: 2 },
      { content: 'Hva betyr å føle seg valgt av en annen?', depthLevel: 1 },
      { content: 'Hvordan ser trygghet ut for deg om fem år?', depthLevel: 3 },
    ],
  },
  {
    name: 'Verdier',
    description: 'Spørsmål om personlege verdier og kva som betyr mest.',
    order: 2,
    icon: 'heart',
    color: '#E8C766',
    questions: [
      { content: 'Hvilke tre verdier styrer fleste av valene dine?', depthLevel: 1 },
      { content: 'Kva verdi har du endra syn på dei siste åra?', depthLevel: 2 },
      { content: 'Hva gjør at du kjenner deg mest i sams med egne verdier?', depthLevel: 3 },
      { content: 'Er det noen verdier du føler blir satt på prøvelse i relasjoner?', depthLevel: 2 },
      { content: 'Hva tror du er det viktigste skillet mellom å leve etter sine verdier og å tilpasse seg?', depthLevel: 3 },
      { content: 'Hvilke verdier vil du aldri kompromittere med din partner om?', depthLevel: 1 },
      { content: 'Hvordan har dine verdier endret seg gjennom livet?', depthLevel: 2 },
      { content: 'Når føler du deg mest ærlig mot deg selv?', depthLevel: 3 },
      { content: 'Hva betyr ærlighet for deg i en relasjon?', depthLevel: 1 },
      { content: 'Hvordan håndterer dere uenighet om grunnleggende verdier?', depthLevel: 2 },
      { content: 'Finnes det noe du tror på som andre kanskje synes er rart?', depthLevel: 3 },
      { content: 'Hva driver deg framover i hverdagen?', depthLevel: 1 },
      { content: 'Hvilke verdier deler dere med partneren din?', depthLevel: 2 },
      { content: 'Hva gjør at du føler deg autentisk i møte med andre?', depthLevel: 3 },
      { content: 'Finnes det en verdi som er vanskelig å snakke om?', depthLevel: 2 },
      { content: 'Hvordan viser verdienes dine seg når ting blir vanskeleg?', depthLevel: 3 },
      { content: 'Hva mener du betyr mest i et forhold — ord eller handlinger?', depthLevel: 1 },
      { content: 'Hvordan ser dine verdier ut i en perfekt hverdag?', depthLevel: 2 },
      { content: 'Hva er det viktigste du har lært om deg selv gjennom reisen deres?', depthLevel: 3 },
    ],
  },
  {
    name: 'Livsstil',
    description: 'Spørsmål om hverdagsliv, rutiner og livspraksis.',
    order: 3,
    icon: 'sun',
    color: '#FFB86C',
    questions: [
      { content: 'Hvordan ser en typisk dag for deg ut?', depthLevel: 1 },
      { content: 'Hva er din favorittmål å komme hjem til etter en lang dag?', depthLevel: 1 },
      { content: 'Hvordan balanserer du behovet for ro og aktivitet?', depthLevel: 2 },
      { content: 'Er det viktig for deg å ha vaner dere deler?', depthLevel: 2 },
      { content: 'Hva medvirker mest til livsglede i din hverdag?', depthLevel: 3 },
      { content: 'Hvordan tar du deg på i en god uke?', depthLevel: 1 },
      { content: 'Hva gjør du når hverdagen føles ensformig?', depthLevel: 2 },
      { content: 'Er det viktig for deg å leve rolig eller fyldig i dagliglivet?', depthLevel: 1 },
      { content: 'Hvordan foretrekker dere å tilbringe helgene?', depthLevel: 2 },
      { content: 'Finnes det en vane du vil innføre sammen med partneren din?', depthLevel: 2 },
      { content: 'Hva er viktigst for deg — rutiner eller spontanitet i hverdagen?', depthLevel: 3 },
      { content: 'Hvordan påvirker livsstilen deres forholdet til en annen?', depthLevel: 2 },
      { content: 'Er det noen vaner du vil endre når dere er sammen?', depthLevel: 2 },
      { content: 'Hva gjør at hverdagen blir rik for deg?', depthLevel: 3 },
      { content: 'Hvordan skaper dere felles tradisjonar?', depthLevel: 1 },
      { content: 'Hva slags liv ønsker du å bygge sammen med en partner?', depthLevel: 2 },
      { content: 'Hvordan opplever du energien din i løpet av uka?', depthLevel: 3 },
    ],
  },
  {
    name: 'Personlighet',
    description: 'Spørsmål om indre erfaringer, styrker og utfordringar.',
    order: 4,
    icon: 'user',
    color: '#FF82C8',
    questions: [
      { content: 'Hva er det du mest liker ved deg selv?', depthLevel: 1 },
      { content: 'Når føler du deg mest som deg selv?', depthLevel: 2 },
      { content: 'Hva medvirker mest til at du vokser som menneske?', depthLevel: 3 },
      { content: 'Hva er en styrke du vet andre ser, men selv kanskje ikke gjør?', depthLevel: 2 },
      { content: 'Finnes det noe ved deg selv du ønsker å bli bedre kjent med?', depthLevel: 3 },
      { content: 'Hvordan reagerer du når noen gir deg ros?', depthLevel: 1 },
      { content: 'Hva gjør at du føler deg mest alive?', depthLevel: 3 },
      { content: 'Finnes det en side ved deg selv som få kjenner?', depthLevel: 2 },
      { content: 'Hva er det utfordrande med din personlighet?', depthLevel: 1 },
      { content: 'Hvordan viser du omsorg på naturlig måte?', depthLevel: 2 },
      { content: 'Når føler du deg mest sårbar av å være deg selv?', depthLevel: 3 },
      { content: 'Hva er det som gir deg energi i møte med andre?', depthLevel: 1 },
      { content: 'Hva tror du er din største utfordring i relasjoner?', depthLevel: 2 },
      { content: 'Hvordan har personligheten din endra seg gjennom reisen deres?', depthLevel: 3 },
      { content: 'Hva mener du betyr mest av deg selv for en partner?', depthLevel: 2 },
      { content: 'Når har du opplevd at du overraska deg sjølv positivt?', depthLevel: 3 },
      { content: 'Hva er det viktigste du vet om deg selv akkurat nå?', depthLevel: 1 },
      { content: 'Hvordan beskriver du din personlighet til en fremmed?', depthLevel: 2 },
      { content: 'Finnes det et trekk ved deg du ønsker å utfordre framover?', depthLevel: 3 },
    ],
  },
  {
    name: 'Relasjonsstil',
    description: 'Spørsmål om tilknyting, relasjonsmønster og nærheit.',
    order: 5,
    icon: 'users',
    color: '#4DA8FF',
    questions: [
      { content: 'Hvordan møter du vanligvis nye mennesker?', depthLevel: 1 },
      { content: 'Hva trenger du mest når du er i tvil om en relasjon?', depthLevel: 2 },
      { content: 'Når har du opplevd at noen virkelig tok deg med på alvor?', depthLevel: 3 },
      { content: 'Finnes det et mønster du gjentar i forhold — og vil bryte no?', depthLevel: 3 },
      { content: 'Hva gjør at du føler trygghet i nærhet til en annen?', depthLevel: 2 },
      { content: 'Hvordan vet du om noen er «den rette» for deg?', depthLevel: 1 },
      { content: 'Er du bedre til å gi eller ta imot i relasjoner?', depthLevel: 2 },
      { content: 'Hva betyr distanse vs nærhet for deg som par?', depthLevel: 3 },
      { content: 'Når har det vært vanskelig for deg å stole på noen?', depthLevel: 2 },
      { content: 'Hva medvirker til at du slapper av med en partner?', depthLevel: 1 },
      { content: 'Hvordan opplever du at dialogen deres fungerer i relasjoner?', depthLevel: 3 },
      { content: 'Er det lettere for deg å være sårbar eller å ta initiativ?', depthLevel: 2 },
      { content: 'Hva er det viktigste en partner kan gjøre for å vise omsorg?', depthLevel: 1 },
      { content: 'Hvordan påvirker tidligere erfaringer dine nye relasjoner?', depthLevel: 3 },
      { content: 'Hva gjør at du føler deg virkelig sett av en partner?', depthLevel: 2 },
      { content: 'Når har du følt deg mest forent med noen?', depthLevel: 3 },
      { content: 'Hvordan ønsker du å være i et parforhold om fem år?', depthLevel: 1 },
      { content: 'Finnes det noe du aldri vil gjenta fra forholdet ditt?', depthLevel: 2 },
    ],
  },
  {
    name: 'Kommunikasjon',
    description: 'Spørsmål om samtaler, lytting og samtalens kunst.',
    order: 6,
    icon: 'message-circle',
    color: '#8282FF',
    questions: [
      { content: 'Hvordan starter du en god samtale?', depthLevel: 1 },
      { content: 'Hva gjør at du føler deg hørt i en dialog?', depthLevel: 2 },
      { content: 'Når har en samtale endra syn på noe viktig for deg?', depthLevel: 3 },
      { content: 'Hvordan håndterer dere uenighet i kommunikasjonen?', depthLevel: 2 },
      { content: 'Er det lettere for deg å skrive eller snakke når ting er komplisert?', depthLevel: 1 },
      { content: 'Hva gjør en samtale meningsfull for deg?', depthLevel: 2 },
      { content: 'Når har du funnet ord for noe som kjentes vanskeleg?', depthLevel: 3 },
      { content: 'Hva medvirker mest til god dialog i deres forhold?', depthLevel: 1 },
      { content: 'Hvordan lytter du når du virkelig vil forstå noen?', depthLevel: 2 },
      { content: 'Når har talet gjort mest skade — og når har det helbredd?', depthLevel: 3 },
      { content: 'Hva gjør at en samtale blir for tung for deg?', depthLevel: 1 },
      { content: 'Hvordan gir du tilbakemelding på en måte som hjelper?', depthLevel: 2 },
      { content: 'Hva er ditt beste tips til å kommunisere med ro og varme?', depthLevel: 3 },
      { content: 'Når har du opplevd at stil også snakka noko sterkt?', depthLevel: 1 },
      { content: 'Finnes det ein måte du gjerne vil snakke meir på med partneren din?', depthLevel: 2 },
    ],
  },
  {
    name: 'Fremtid',
    description: 'Spørsmål om visjonar, håp og drøymde framtid.',
    order: 7,
    icon: 'compass',
    color: '#FF4D4D',
    questions: [
      { content: 'Hva ønsker du mest av livet ditt om fem år?', depthLevel: 1 },
      { content: 'Hvordan ser drømmelivet ditt ut i detalj — en vanlig dag?', depthLevel: 3 },
      { content: 'Finnes det noe viktig du gjerne vil opplevd før reisen er over?', depthLevel: 2 },
      { content: 'Hva håper du at dere vil oppnå sammen?', depthLevel: 1 },
      { content: 'Er det noe i framtida som gjør deg spent — eller redd?', depthLevel: 2 },
      { content: 'Hvordan ønsker du at reisen deres former framtida deres?', depthLevel: 3 },
      { content: 'Hva betyr «hjem» for deg — og hvordan kan det deles?', depthLevel: 1 },
      { content: 'Hva er noe du alltid har villet prøve, men aldri funna mod til?', depthLevel: 2 },
      { content: 'Når har framtida sett ut annerledes enn det du håpte?', depthLevel: 3 },
      { content: 'Finnes det en drøm som kanskje er litt «for stor» å si høyt?', depthLevel: 1 },
      { content: 'Hva mener du er viktigst å bygge sammen for framtida?', depthLevel: 2 },
      { content: 'Når har du opplevd at noe du trodde var umogleg blei mogleg?', depthLevel: 3 },
      { content: 'Hva ønsker du å ha oppnådd når reisen deres er fullført?', depthLevel: 1 },
      { content: 'Finnes det noe fra barndommen du gjerne vil bygge vidare med en partner?', depthLevel: 2 },
      { content: 'Hvordan tror du framtida vil formidle det dere har funnet undervegs?', depthLevel: 3 },
    ],
  },
  {
    name: 'Sårbarhet',
    description: 'Spørsmål om å vise seg sår — og finne styrke der.',
    order: 8,
    icon: 'heart-crack',
    color: '#FFB86C',
    questions: [
      { content: 'Når var det hardest å vise sårbare sider av seg selv?', depthLevel: 3 },
      { content: 'Hva betyr sårbarhet for deg i en relasjon?', depthLevel: 1 },
      { content: 'Er det et sted du trenger å slippe kontroll for å kjenne nærhet?', depthLevel: 3 },
      { content: 'Når har noen tatt hånd om din sårværing på en fin måte?', depthLevel: 2 },
      { content: 'Hva skjer inni deg når du åpner opp for noe som føles rart?', depthLevel: 3 },
      { content: 'Finnes det noe du aldri orkar å dele — eller er det noe du ønsker å lære å dele?', depthLevel: 1 },
      { content: 'Når har sårbarhet ført til noe positivt for deg?', depthLevel: 2 },
      { content: 'Hva gjør at du tør å være ærlig selv om det gjør vondt?', depthLevel: 3 },
      { content: 'Er det en del av deg selv du ennå ikke har vist for partneren din?', depthLevel: 2 },
      { content: 'Hva er den største utfordringa med å vise seg sårbare overfor noen?', depthLevel: 1 },
      { content: 'Når har du opplevd at å være sår var det modigaste du gjorde?', depthLevel: 3 },
      { content: 'Hvordan vet du at partneren din er trygg på hva du viser?', depthLevel: 2 },
      { content: 'Finnes det en del av deg som er vanskeleg å forstå for andre?', depthLevel: 1 },
      { content: 'Når har du følt deg mest "deg" i et møte med sårbarheit?', depthLevel: 3 },
    ],
  },
  {
    name: 'Nærhet',
    description: 'Spørsmål om emosjonell og fysisk nærhet — moden og respektfull.',
    order: 9,
    icon: 'sparkles',
    color: '#E8C766',
    questions: [
      { content: 'Hva betyr nære til en annen for deg?', depthLevel: 1 },
      { content: 'Hvordan skaper dere intimitet på en trygg måte?', depthLevel: 2 },
      { content: 'Når har du følt den dypeste forbindelse med noen?', depthLevel: 3 },
      { content: 'Finnes det noe du ønsker å forstå bedre om din partners behov for nærhet?', depthLevel: 2 },
      { content: 'Hva gjør at du føler deg intim med noen — og ikke bare kjent med dem?', depthLevel: 3 },
      { content: 'Er det lettere for deg å nærme seg gjennom ord eller handlinger?', depthLevel: 1 },
      { content: 'Hvordan opplever du avstanden mellom dere to i dag?', depthLevel: 2 },
      { content: 'Når har noen gjort deg trygg på at nære er ok for dem?', depthLevel: 3 },
      { content: 'Hva er den viktigaste grensa din når det gjeld nærheit?', depthLevel: 1 },
      { content: 'Finnes det noe du gjerne vil utforske i deres nærhet?', depthLevel: 2 },
      { content: 'Når har nærheten mellom dere følt seg mest autentisk?', depthLevel: 3 },
      { content: 'Hva betyr tillit for dykk når nærleiken aukar?', depthLevel: 2 },
      { content: 'Hvordan vet du at noen ønsker nærhet — og ikke bare bekymring?', depthLevel: 1 },
      { content: 'Når har du opplevd at noe nær er merverdi i forholdet deres?', depthLevel: 3 },
    ],
  },
  {
    name: 'Felles reise',
    description: 'Spørsmål om det som forener dere to — og reisens felles mening.',
    order: 10,
    icon: 'map',
    color: '#D4AF37',
    questions: [
      { content: 'Hva har vært mest overraskende ved reisen deres hittil?', depthLevel: 1 },
      { content: 'Hva tror du er det som binder dere to sterkast saman?', depthLevel: 2 },
      { content: 'Finnes det noe dere begge har lært om hverandre undervegs?', depthLevel: 3 },
      { content: 'Hvordan ønsker dere å feire milepæler sammen?', depthLevel: 1 },
      { content: 'Når har dere kjent at reisens tempo har følt rett for dere?', depthLevel: 2 },
      { content: 'Finnes det noe dere kanskje ennå ikke har utforska saman?', depthLevel: 3 },
      { content: 'Hva vil du gjerne ha mer av i deres felles liv?', depthLevel: 1 },
      { content: 'Når har dere følt at reisa mellom dere var mest ekte og uforfalska?', depthLevel: 2 },
      { content: 'Finnes det en oppgave eller refleksjon fra reisa som har betydd mest for deg?', depthLevel: 3 },
      { content: 'Hva er noe du ønsker at dere skal gjøre mer av sammen?', depthLevel: 1 },
      { content: 'Hvordan vil du beskrive «dere to» til en fremmed?', depthLevel: 2 },
      { content: 'Når har reisens system hjulpet deg uventa?', depthLevel: 3 },
      { content: 'Finnes det noe du føler dere ennå ikke er klar for å utforska saman?', depthLevel: 2 },
      { content: 'Hva gjør at deres reise er annerledes enn andre erfaringar du har hatt?', depthLevel: 3 },
    ],
  },
];

async function main() {
  console.log('🌱 Seed starter for Guided Questions...');

  let totalQuestions = 0;

  for (const cat of CATEGORIES) {
    const existing = await prisma.questionCategory.findUnique({
      where: { name: cat.name },
      include: { questions: true },
    });

    if (existing) {
      console.log(`⏭️  Kategori ${cat.name} (${existing.questions.length} spørsmål) — allereie seeda`);
      totalQuestions += existing.questions.length;
      continue;
    }

    await prisma.questionCategory.create({
      data: {
        name: cat.name,
        description: cat.description,
        order: cat.order,
        icon: cat.icon,
        color: cat.color,
        questions: {
          create: cat.questions.map((q, i) => ({
            content: q.content,
            depthLevel: q.depthLevel,
            order: i + 1,
          })),
        },
      },
    });

    console.log(`✓ Seedet ${cat.name}: ${cat.questions.length} spørsmål`);
    totalQuestions += cat.questions.length;
  }

  console.log(`\n✅ Guided questions seed fullført! Totalt: ${totalQuestions} spørsmål i ${CATEGORIES.length} kategorier.`);
}

main()
  .catch((e) => {
    console.error('❌ Feil under seed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());