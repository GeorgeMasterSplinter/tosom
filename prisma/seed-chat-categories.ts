/**
 * ToSom — Seed Chat Categories & Questions
 * 
 * Lager 10 kategorier med 14–18 spørsmål per kategori.
 * Totalt: ca 150 spørsmål for guidet chat.
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Kategorier og spørsmål — alle på bokmål, varm tone
const categories = [
  {
    key: 'TRYGGHET' as const,
    name: 'Trygghet',
    description: 'Kva gjer deg trygg i ein relasjon?',
    icon: 'shield',
    questions: [
      'Kva får meg til å føle meg trygg med ein ny person',
      'Kor viktig er fysisk trygghet for deg i ein samtale',
      'Når har du kenslt deg minst trygg — og korleis handterte du det',
      'Kva ord eller handlingar gjer deg sikker på at det går bra',
      'Er det lettare for deg å føle trygghet tidleg i ein relasjon',
      'Kva er viktigast for din trygghet — ord, handlingar eller tidsbruk',
      'Føler du deg trygg med deg sjølv først',
      'Hva gjer når du ikkje kjennest trygg i ei samtale',
      'Er det noko ein partner kan gjere for å øke din trygghet',
      'Korleie er din beste måte å vise at du stolar på nokon',
      'Føler du tilbakemeldingar som trygge eller pressande',
      'Kva er den viktigaste regelen for trygghet i ditt liv',
      'Når føler du deg mest sårbar — og korleie kan ein partner hjelpe',
      'Kva meiner du om å ta det roleg med nye kjensler',
    ]
  },
  {
    key: 'VERDIER' as const,
    name: 'Verdier',
    description: 'Kva er viktigast for deg — og kva vil du aldri gi slipp på?',
    icon: 'heart',
    questions: [
      'Det verdien eg aldri gir slipp på er',
      'Kva betyr suksess for deg',
      'Trur du at mennesker kan endre seg fundamentalt',
      'For meg er livskvalitet avhengig av',
      'Hva betyr familie for deg — og kva betyr det å vere ein god del av ein familie',
      'Er det viktigare å ha frihet eller stabilitet',
      'Kva er ditt svar på "kva er eit godt liv"',
      'Når kjenser du deg mest i harmoni med deg sjølv',
      'Hva betyr natur for din kvardag eller framtid',
      'Trur du at ærlegheit alltid er det beste valet',
      'Kva er ein grense du aldri vil krysje',
      'Er det viktig for deg å leve enkelt og roleg',
      'Hva har endra mest av dine eigne verdier dei siste åra',
      'Kan du fortelje om ein tid det var vanskeleg å stå fast på dina verdiar',
    ]
  },
  {
    key: 'LIVSTIL' as const,
    name: 'Livsstil',
    description: 'Din kvardag, rytme og preferansar',
    icon: 'sun',
    questions: [
      'Ein typisk laurdag for meg ser slik ut',
      'Eg trivst best når eg har',
      'Hvordan er ditt forhold til å vere aleine saman med nokon annan',
      'Eg startar dagen med å',
      'Det viktigaste i ein kvardagsrutine for meg er',
      'Trivest du mest i ro og struktur — eller spontanitet og endring',
      'Kor viktig er mat og matlaging for deg',
      'Er du ein som planlegg veker i forkant — eller lar det komme som det kjem',
      'Hva betyr reisearbeid eller reising for ditt kvardagsliv',
      'Føler du behov for meir ro eller meir aktivitet i kvardagen',
      'Kva er ein vaner du vil bryte — og kva vil du behalde',
      'Hvordan balanserer du arbeid og pauser',
      'Er det viktig for deg å ha same rutinar som partneren din',
      'Kan du dele om ein vaneskyld du har — god eller dårleg',
    ]
  },
  {
    key: 'PERSONLIGHET' as const,
    name: 'Personlegheit',
    description: 'Dine styrkar, utfordringar og sjølvforståing',
    icon: 'star',
    questions: [
      'Eg vil bli hugsa for',
      'Den største lærdommen eg har gjort er',
      'Når folk møte meg fyrste gongen trur dei ofte at',
      'Ein styrke eg har — og andre sjeldan ser — er',
      'Det som gjer meg til meg sjølv er',
      'Eg jobbar mest med å akseptere',
      'Hva gjer deg plutseligvis glad — sjølv på ein vond dag',
      'Er du den som tek initiativ eller ventar at andre gjer det',
      'Korleie håndterer du kritikk på beste måte',
      'Har du lettare for å gi eller motta ros',
      'Når kjenser du deg mest Deg sjølv',
      'Er det noko mange finn overraskande ved deg',
      'Hva gjer når ting ikkje går som planlagt',
      'Kva ord vil beskrive din natur best',
    ]
  },
  {
    key: 'RELASJONSSTIL' as const,
    name: 'Relasjonsstil',
    description: 'Korleie du søker relasjon — og kva du treng for å åpne deg',
    icon: 'users',
    questions: [
      'Eg vis at jeg er interessert i nokon ved',
      'Det som får meg til å trekkje meg bort i ein relasjon er',
      'For meg er tillit noko ein må bygge gjennom',
      'Kva meiner du om personleg rom innanfor eit forhold',
      'Hva betyr kjærlighetsspråk for deg',
      'Er det lettare for deg å gi — eller ta imot kærlighet',
      'Når har du kenslt deg mest knytt til nokon',
      'Kva er ditt svar på "korleie bygges nærhet"',
      'Eg føler meg mest kjærk i en situasjon der',
      'Hva er noko mange misforstår om måten du viser omsorg',
      'Er det viktig for deg å seie ordentlege "eg bryr seg"',
      'Trivest du med å vise kjensler tidleg — eller etter kvart',
      'Kva betyr avstand for deg i ein relasjon',
      'Kan du tenkje deg å bo nær nokon du er glad i — men ikje i same hus',
    ]
  },
  {
    key: 'KOMMUNIKASJON' as const,
    name: 'Kommunikasjon',
    description: 'Samtaler, konflikthåndtering og lyting',
    icon: 'message',
    questions: [
      'Eg snakker om følelsene mine når',
      'Den beste måten å starte ein dyp samtale på er',
      'Når vi har uoverensstemmelser, så',
      'Kva gjer når du treng tid til tenke før du svarer',
      'For meg er ei god samtale når',
      'Eg viser at eg lyttar ved',
      'Hva gjer det med deg når nokon avbryter deg — eller gir deg full oppmerksomheit',
      'Er det lettare for deg å skrive — eller snakke om vanskelege ting',
      'Kva er din måte å be om unnskyldning på',
      'Hvordan håndterer du når du er uenig med nokon du elsker',
      'Kan du tenkje deg eit språk mellom dere to for vanskelege emne',
      'Trur du at stillhet kan vere ein del av kommunikasjon',
      'Kva gjer du når du føler deg misforstått',
      'Hva er det viktigaste å huske på når ein samtale blir tung',
    ]
  },
  {
    key: 'FRAMTID' as const,
    name: 'Framtid',
    description: 'Mål, drøm og visjonar for livsskifte',
    icon: 'compass',
    questions: [
      'Om fem år vil eg ha',
      'Draumen eg aldri har fortalt nokon om er',
      'Kva vil eg byggje eller skape i livet mitt',
      'Ein forandring eg gjerne ser i verda — og i meg sjølv — er',
      'Eg veit at eg lever når eg',
      'Hvis jeg kunne velje éitt mål å fokusere på dette året, så ville det vere',
      'Når kjenser du at ein drøm er klar til å bli til virkelegheit',
      'Er det viktig for deg at partneren din har same visjon for framtida',
      'Kva type liv tenkjer du deg saman med ein partner',
      'Hva vil du helst oppnå — eller oppleve framover',
      'Finnes det noko du vil prøve først — og noko som kan vente',
      'Har du ein liste over ting du vil opleve — eller nå',
      'Kva gjer dersom framtidsdrømmene dine og partneren din ikkje samsar',
      'Trur du at felles mål er eit trekk på vei mot eit sterkt forhold',
    ]
  },
  {
    key: 'SARBARHET' as const,
    name: 'Sårbarhet',
    description: 'Følelser, autenticitet og djupde',
    icon: 'leaf',
    questions: [
      'Noko eg har lært om sårbarhet er at',
      'Eg tør vises meg sårbar når eg føler',
      'Den gongen eg valgte å vise meg autentic var fordi',
      'Hva gjer det med deg å bli sett og møtt der du er',
      'Er det lettare for deg å vær sårbar på skrift — eller i møte',
      'Eg har ein følelse eg sjeldan deler — fordi',
      'Når kjenser du at du har greidde å slippe ei vernet',
      'Kva gjer når frykta for å verte dømt kjem over deg',
      'Er det noko du ønsker nokon kunne forstå om deg — utan at du må forklaere',
      'Hva meier du om "det er greit ikke å ha det greit"',
      'Kva er ein følelse du har vanskeleg for å kjenne igjen',
      'Hvordan kan ein partner skape rom for din sårbarhet utan å presse',
      'Har du opplevd at noko godt kom av å vise svake sider',
      'Kan du fortelje om ei tid du valgte autentic sjølv når det var vanskeleg',
    ]
  },
  {
    key: 'NAERHEIT' as const,
    name: 'Nærheit',
    description: 'Emosjonell og fysisk nærhet — kva betyr det for deg',
    icon: 'sparkle',
    questions: [
      'For meg er nærheit noko som skjer når',
      'Den måten eg elsker på er gjennom',
      'Eg føler nære med nokon når',
      'Er fysisk nærheit viktig for deg — og kva gjer den med deg',
      'Hvordan skill du mellom nære og kjære vennar',
      'Når kjenser du at du er klar til å ta eit steg tettere',
      'Eg vil gjerne oppleve med min partner',
      'Kva betyr berøring for deg — og kva betyr avstand',
      'Finnes det ein måte å vise kjærleik som fungerer spesielt godt for deg',
      'Hva skjer med deg når nokon nærmar seg for raskt',
      'Er det noko du aldri har fortalt om nærheit fordi du ikkje trur det blir møtt med forståing',
      'Trur du at nærhet kan lærast — eller kjem naturleg',
      'Kva er din måte å kjenne att at du har fått ein "trykk" inni deg for nærheit',
      'Hva meiner du om å ta det roleg med fysisk intimitet tidleg',
    ]
  },
  {
    key: 'FELLES_REISE' as const,
    name: 'Felles reise',
    description: 'Korleie ønskjer dere at denne tiden saman skal utfolde seg',
    icon: 'path',
    questions: [
      'Eg vil gjerne at vi sammen har',
      'Det mest spennande med å kjenne deg er',
      'Ein ting eg ønsker vi kan oppdaver sammen er',
      'Hva betyr denne reisen for deg — i større sammenheng',
      'Når kjenser du at dere to bygger noko spesielt',
      'Er det viktig for deg at dere har felles interesser eller opplevelser',
      'Kva ønsker du at vi kan lære av kvarandre',
      'Eg trur vi kan bli gode saman hvis vi',
      'Hvordan vil du at ein god dag med meg skal føle seg',
      'Er det noko du har lyst å gjere saman — men enno ikkje har fått sjansen til',
      'Kva er eit svar på "kva gir denne reisen verdi" for deg',
      'Trur du at felles tidsbruk byggjer djupare forbindelse enn ord',
      'Hva ønsker du å ta med deg videre — uansett kor dette går',
      'Hvis vi skulle laga ein liten rituell for oss to — kva ville den innehalt',
    ]
  }
]

// Hovud-funksjon: seed alle kategorier og spørsmål
async function seedChatCategories() {
  console.log('🌱 Seed startar: Chat Categories & Questions')

  for (const cat of categories) {
    // Opprett eller oppdater kategori
    const createdCategory = await prisma.chatCategory.upsert({
      where: { key: cat.key },
      update: {
        name: cat.name,
        description: cat.description,
        icon: cat.icon,
        sortOrder: categories.indexOf(cat),
      },
      create: {
        key: cat.key,
        name: cat.name,
        description: cat.description,
        icon: cat.icon,
        sortOrder: categories.indexOf(cat),
        questions: {
          create: cat.questions.map((text, idx) => ({
            text,
            sortOrder: idx,
            hint: `Kategori: ${cat.name}`,
          })),
        },
      },
      include: { questions: true },
    })

    console.log(`  ✅ ${createdCategory.name} (${createdCategory.key}): ${createdCategory.questions.length} spørsmål`)
  }

  const totalQuestions = await prisma.chatQuestion.count()
  const totalCategories = await prisma.chatCategory.count()
  
  console.log(`\n✅ Seed fullført!`)
  console.log(`   📁 ${totalCategories} kategorier`)
  console.log(`   ❓ ${totalQuestions} spørsmål totalt`)
}

seedChatCategories().catch((e) => {
  console.error('Seed feilet:', e)
  process.exit(1)
})