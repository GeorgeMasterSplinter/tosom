/**
 * Seed-skript for Guided Questions-systemet (B3.1)
 * 
 * Struktur: 12 kategorier × 12 spørsmål per kategori = 144 totalt.
 * Per kategori: 4 spørsmål med depthLevel 1, 4 med 2, 4 med 3.
 * 
 * Alle spørsmål på bokmål. Idempotent seeding (upsert).
 * 
 * Kjøring:
 *   npx tsx scripts/seed-questions.ts
 * 
 * B3.2: Innholdet er Georges skrivejobb — dette er strukturen og malen.
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// ═══════════════════════════════════════════════════════════
// 12 Kanoniske kategorier (B3.1 — bokmål)
// Per kategori: 12 spørsmål (4 × depthLevel 1, 4 × depthLevel 2, 4 × depthLevel 3)
// ═══════════════════════════════════════════════════════════

interface CategoryData {
  name: string
  color: string
  description: string
  questions: Array<{ content: string; depthLevel: number }>
}

const CATEGORIES: CategoryData[] = [
  // ───────────── 1. TRYGGHET ─────────────
  {
    name: 'Trygghet',
    color: '#D4AF37',
    description: 'Grunnleggende trygghet i relasjon',
    questions: [
      // depthLevel 1 (lett inngang)
      { content: 'Hva betyr trygghet for deg i en ny relasjon?', depthLevel: 1 },
      { content: 'Hva er det som gjør at du føler deg trygg hos noen?', depthLevel: 1 },
      { content: 'Hvor åpen er du når du blir kjent med noen ny?', depthLevel: 1 },
      { content: 'Har du noe ritual for å føle deg trygg i nye situasjoner?', depthLevel: 1 },
      // depthLevel 2 (middels)
      { content: 'Hvordan håndterer du det når du blir skuffet?', depthLevel: 2 },
      { content: 'Hvilken type atferd gjør deg utrygg?', depthLevel: 2 },
      { content: 'Når har du sist følt deg fullt ut trygg med noen? Hva var det?', depthLevel: 2 },
      { content: 'Hva tror du er din styrke i å skape trygghet?', depthLevel: 2 },
      // depthLevel 3 (dyp)
      { content: 'Hva er det vanskeligste for deg å åpne deg om for en ny person?', depthLevel: 3 },
      { content: 'Finnes det temaer du unngår å snakke om med nye bekjente?', depthLevel: 3 },
      { content: 'Hva har du lært om deg selv når det gjelder å stenge eller åpne deg?', depthLevel: 3 },
      { content: 'Hva vil du si til din fremtidige partner om hvordan de kan skape trygghet for deg?', depthLevel: 3 },
    ],
  },

  // ───────────── 2. VERDIER ─────────────
  {
    name: 'Verdier',
    color: '#60A5FA',
    description: 'Kjerneverdier og prioriteringer',
    questions: [
      { content: 'Hva er de tre viktigste verdiene dine?', depthLevel: 1 },
      { content: 'Er du mer drevet av logikk eller følelser i avgjørelser?', depthLevel: 1 },
      { content: 'Hva betyr suksess for deg — karriere, familie, frihet?', depthLevel: 1 },
      { content: 'Hvilken rolle spiller samfunnsansvar i livet ditt?', depthLevel: 1 },
      { content: 'Hva sier det om deg som person at du legger penger og tid i det du gjør?', depthLevel: 2 },
      { content: 'Hvilken del av karakteren din er viktigst for deg i et partnerforhold?', depthLevel: 2 },
      { content: 'Er det noe viktig for deg nå som du ikke hadde for fem år siden?', depthLevel: 2 },
      { content: 'Tror du at verdikonflikt kan være nyttig? Hva kan to mennesker lære av det?', depthLevel: 2 },
      { content: 'Har du noen verdi du har endret mening om de siste årene?', depthLevel: 3 },
      { content: 'Når har du sist vært stolt av å stå for noe du tror på, til tross for press?', depthLevel: 3 },
      { content: 'Beskriv en gang der en verdikonflikt gjorde at du la vekk noe — eller kjempet for det.', depthLevel: 3 },
      { content: 'Hva vil din fremtidige partner si om verdiene dine etter et år sammen?', depthLevel: 3 },
    ],
  },

  // ───────────── 3. KOMMUNIKASJON ─────────────
  {
    name: 'Kommunikasjon',
    color: '#34D399',
    description: 'Hvordan vi uttrykker oss',
    questions: [
      { content: 'Er du mer den som lytter eller den som snakker?', depthLevel: 1 },
      { content: 'Hvordan reagerer du når noen er uenig med deg?', depthLevel: 1 },
      { content: 'Hva er din kommunikasjonsstil — direkte, indirekte, humoristisk?', depthLevel: 1 },
      { content: 'Hvilken type samtaler gir deg energi, og hvilke tømmer deg?', depthLevel: 1 },
      { content: 'Når har du sist følt at du ikke ble hørt? Hva gjorde du da?', depthLevel: 2 },
      { content: 'Beskriv en diskusjon du var i nylig — hvordan gikk det?', depthLevel: 2 },
      { content: 'Når har du brukt humor for å dempe en situasjon? Fungerer det?', depthLevel: 2 },
      { content: 'Tenk på en samtale der du følte deg virkelig hørt — hva gjorde personen annerledes?', depthLevel: 2 },
      { content: 'Er det noe du aldri sier direkte, men som andre bør vite?', depthLevel: 3 },
      { content: 'Hva er vanskeligst for deg i konfliktsamtaler?', depthLevel: 3 },
      { content: 'Har du noe kommunikasjonsmønster du ønsker å bryte?', depthLevel: 3 },
      { content: 'Hvordan vil du at din partner skal kommunisere når de er sint eller såret?', depthLevel: 3 },
    ],
  },

  // ───────────── 4. NÆRHET ─────────────
  {
    name: 'Nærhet',
    color: '#F472B6',
    description: 'Nærhet og sårbarhet',
    questions: [
      { content: 'Hva betyr nærhet for deg — er det fysisk, emosjonelt, eller begge?', depthLevel: 1 },
      { content: 'Hvor fort tror du det er normalt å åpne seg emosjonelt?', depthLevel: 1 },
      { content: 'Hva er den første måten du merker at du får nærhet til noen?', depthLevel: 1 },
      { content: 'Hvilken type næring gir deg mest energi — berøring, ord, tid sammen?', depthLevel: 1 },
      { content: 'Tror du sårbarhet er en styrke eller svakhet i en ny relasjon?', depthLevel: 2 },
      { content: 'Tenk på en gang du følte deg sårbar — hva var det som gjorde at du følte deg slik?', depthLevel: 2 },
      { content: 'Hvilken type samtale får deg til å føle deg nærmere noen?', depthLevel: 2 },
      { content: 'Tror du at to mennesker kan være for nær for tidlig? Hva skjer da?', depthLevel: 2 },
      { content: 'Når har du sist delt noe sårbart med noen — og hva var reaksjonen?', depthLevel: 3 },
      { content: 'Er det noe med deg selv du aldri vil vise for en ny partner?', depthLevel: 3 },
      { content: 'Hva har vært den største utfordringen din med å åpne deg for noen?', depthLevel: 3 },
      { content: 'Hva vil du at din fremtidige partner skal forstå om dine behov for nærhet?', depthLevel: 3 },
    ],
  },

  // ───────────── 5. FRAMTIDSDRØMMER ─────────────
  {
    name: 'Framtidsdrømmer',
    color: '#A78BFA',
    description: 'Drømmer og mål',
    questions: [
      { content: 'Hvor ser du deg selv om fem år?', depthLevel: 1 },
      { content: 'Hva er det største målet ditt i livet akkurat nå?', depthLevel: 1 },
      { content: 'Hvilken type hus eller hjem drømmer du om?', depthLevel: 1 },
      { content: 'Hvilken reise drømmer du om å dra på sammen med noen?', depthLevel: 1 },
      { content: 'Har du endret drømmene dine de siste tre årene? Hva skjedde med de gamle?', depthLevel: 2 },
      { content: 'Hvis økonomi ikke var et problem — hva ville du gjort da?', depthLevel: 2 },
      { content: 'Beskriv en dag i ditt ideale liv — fra morgen til kveld.', depthLevel: 2 },
      { content: 'Hvilken rolle spiller karriere versus familie for deg i fremtiden?', depthLevel: 2 },
      { content: 'Hvis du kunne bytte helt — hva ville du gjort annerledes i livsveien?', depthLevel: 3 },
      { content: 'Er det noe viktig for deg i fremtiden som du ikke har fortalt noen ennå?', depthLevel: 3 },
      { content: 'Hva vil du bli minnet for av venner og familie?', depthLevel: 3 },
      { content: 'Hva er arven du ønsker å etterlate for barn, familie eller verden?', depthLevel: 3 },
    ],
  },

  // ───────────── 6. LIVSSTIL ─────────────
  {
    name: 'Livsstil',
    color: '#FB923C',
    description: 'Hverdag og ritualer',
    questions: [
      { content: 'Er du morgenfugl eller kveldsmenneske?', depthLevel: 1 },
      { content: 'Hvordan ser din perfekte helg ut?', depthLevel: 1 },
      { content: 'Er du mer hjemmekos eller ute-aktiv? Hva fyller deg opp?', depthLevel: 1 },
      { content: 'Hvilken type mat eller matvaner er viktig for deg?', depthLevel: 1 },
      { content: 'Hvor viktig er det for deg å ha en fast dagsrutine?', depthLevel: 2 },
      { content: 'Hva er noe ved livsstilen din som andre kanskje finner overraskende?', depthLevel: 2 },
      { content: 'Når har livsstilen din endret seg mest de siste årene? Hva skjedde?', depthLevel: 2 },
      { content: 'Hvordan balanserer du arbeid, fritid og relasjoner?', depthLevel: 2 },
      { content: 'Er det noe fra barndomshjemmet som du absolutt vil ta med til eget hjem?', depthLevel: 3 },
      { content: 'Hvordan vil din fremtidige hverdag sammen med en partner se ut?', depthLevel: 3 },
      { content: 'Er det noe med vanemønsteret ditt du vil endre dypt?', depthLevel: 3 },
      { content: 'Hva er den viktigste regelen i hjemmet ditt — og hvorfor?', depthLevel: 3 },
    ],
  },

  // ───────────── 7. RELASJONSMØNSTER ─────────────
  {
    name: 'Relasjonsmønster',
    color: '#EF4444',
    description: 'Hvordan vi møtes i forhold',
    questions: [
      { content: 'Er du den som gir mest, eller tar mest emosjonelt?', depthLevel: 1 },
      { content: 'Er du mer uavhengig eller avhengig i en relasjon?', depthLevel: 1 },
      { content: 'Hvilken type konfliktstrategi har du — trekke deg tilbake eller konfrontere?', depthLevel: 1 },
      { content: 'Tror du at kjemi kan læres, eller må det komme naturlig?', depthLevel: 1 },
      { content: 'Tenk på tidligere relasjoner — hva var det vanlige mønsteret?', depthLevel: 2 },
      { content: 'Tror du at du er lett eller vanskelig å være i relasjon med?', depthLevel: 2 },
      { content: 'Hvordan vet du når en relasjon «ikke føles rett»?', depthLevel: 2 },
      { content: 'Når har du sist følt at du ga mer enn du fikk tilbake?', depthLevel: 2 },
      { content: 'Når har en relasjon sluttet? Hva lærte du av det?', depthLevel: 3 },
      { content: 'Er det noe mønster fra tidligere forhold du absolutt ikke vil gjenta?', depthLevel: 3 },
      { content: 'Har noe i barndommen formet hvordan du møtes i relasjoner nå?', depthLevel: 3 },
      { content: 'Har du noe mønster fra foreldrene dine sitt forhold du har bevisst valgt bort?', depthLevel: 3 },
    ],
  },

  // ───────────── 8. EMOSJONELL INNSIKT ─────────────
  {
    name: 'Emosjonell innsikt',
    color: '#2DD4BF',
    description: 'Selvrefleksjon og følelseshåndtering',
    questions: [
      { content: 'Hva er de sterkeste følelsene du håndterer — sinne, sorg, frykt?', depthLevel: 1 },
      { content: 'Når du er stresset — trekker du deg tilbake eller søker du støtte?', depthLevel: 1 },
      { content: 'Hvor god er du på å kjenne igjen når en annen person er sint eller såret?', depthLevel: 1 },
      { content: 'Hvor ofte kontrollerer du deg selv før du svarer på noe som irriterer deg?', depthLevel: 1 },
      { content: 'Når har du sist tatt deg tid til å reflektere over følelsene dine?', depthLevel: 2 },
      { content: 'Kan du skille mellom å være lei deg og å være irritert? Beskriv når det er vanskelig.', depthLevel: 2 },
      { content: 'Hvordan håndterer du når noen du bryr deg om sier noe som sårer?', depthLevel: 2 },
      { content: 'Kan du kjenne at en relasjon endrer seg før noen sier noe?', depthLevel: 2 },
      { content: 'Hva har vært den hardeste emosjonelle utfordringen din de siste årene?', depthLevel: 3 },
      { content: 'Er det noe du føler dypt, men som andre kanskje ikke vet om?', depthLevel: 3 },
      { content: 'Tror du at å vise svakhet gjør deg mer eller mindre attraktiv?', depthLevel: 3 },
      { content: 'Er det noe du ønsker at andre forsto om de emosjonelle behovene dine?', depthLevel: 3 },
    ],
  },

  // ───────────── 9. KONFLIKT OG GRENSER ─────────────
  {
    name: 'Konflikt og grenser',
    color: '#FBBF24',
    description: 'Uenighet og personlige grenser',
    questions: [
      { content: 'Hvordan håndterer du konflikt — går du direkte på sak eller trekker du deg?', depthLevel: 1 },
      { content: 'Hva betyr et «nei» for deg — en hel grense eller en start på samtale?', depthLevel: 1 },
      { content: 'Hva er ditt «ikke rør»-område i en diskusjon?', depthLevel: 2 },
      { content: 'Hvilken type konflikt avslører mest om en person for deg?', depthLevel: 2 },
      { content: 'Når har du satt ned en grense som var hard, men riktig?', depthLevel: 2 },
      { content: 'Hva gjør at du føler deg respektert i en konfliktsituasjon?', depthLevel: 2 },
      { content: 'Når har du sist følt at grenser ble overskredet — av hvem? Hva skjedde?', depthLevel: 3 },
      { content: 'Er det noe du aldri vil tilgi i en relasjon? Hva er grunn-grensen din?', depthLevel: 3 },
      { content: 'Er det noe fra fortiden som har lært deg å sette grenser? Hva var lærdommen?', depthLevel: 3 },
      { content: 'Er det noen grense du er redd for å sette — fordi du frykter å miste?', depthLevel: 3 },
      { content: 'Hva er vanskeligst — å si nei, eller å respektere andres nei?', depthLevel: 2 },
      { content: 'Hvilken type «konfliktregel» ønsker du at partneren din følger fra dag én?', depthLevel: 3 },
    ],
  },

  // ───────────── 10. SAMFUNN OG TILHØRIGHET ─────────────
  {
    name: 'Samfunn og tilhørighet',
    color: '#818CF8',
    description: 'Vi i fellesskap',
    questions: [
      { content: 'Hva betyr familie for deg — er det blod, valg, eller begge?', depthLevel: 1 },
      { content: 'Er du mer introvert eller ekstrovert?', depthLevel: 1 },
      { content: 'Hvilken rolle spiller venner i livet ditt nå?', depthLevel: 1 },
      { content: 'Hva betyr det å være en del av et fellesskap for deg?', depthLevel: 1 },
      { content: 'Hvilken type samfunnsdebatt får deg til å tenke mest?', depthLevel: 2 },
      { content: 'Tror du at to mennesker fra ulik bakgrunn kan skape en egen kultur sammen?', depthLevel: 2 },
      { content: 'Er det noe i samfunnet du vil endre — og hva kan du selv bidra med?', depthLevel: 2 },
      { content: 'Har du noe ritual fra barndomshjemmet som du vil ta med til et eget fellesskap?', depthLevel: 2 },
      { content: 'Når har du følt deg mest tilhørende til et fellesskap? Hva gjorde det slik?', depthLevel: 3 },
      { content: 'Når har du gjort noe for et fellesskap som ga deg mer enn det tok?', depthLevel: 3 },
      { content: 'Hva tror du skjer med to mennesker som har ulike behov for sosial nærhet?', depthLevel: 3 },
      { content: 'Hva betyr «hjem» for deg — er det et sted, en person, eller et fellesskap?', depthLevel: 3 },
    ],
  },

  // ───────────── 11. PERSONLIGHET OG SELVINNSIKT ─────────────
  {
    name: 'Personlighet og selvinnsikt',
    color: '#E879F9',
    description: 'Kjenne seg selv og sine egenarter',
    questions: [
      { content: 'Hva er de tre ordene en venn ville brukt for å beskrive deg?', depthLevel: 1 },
      { content: 'Er du mer planlagt eller spontan i hverdagen?', depthLevel: 1 },
      { content: 'Hva gjør deg lykkeligst — å lære noe nytt, å mestre noe, eller å hjelpe andre?', depthLevel: 1 },
      { content: 'Har du noen «quirk» eller egenart som folk først finner rar, men så elsker?', depthLevel: 1 },
      { content: 'Når er du på ditt beste — tidlig på morgenen, sent om kvelden, i ro, i bevegelse?', depthLevel: 2 },
      { content: 'Hva har du lært om deg selv de siste årene som overrasket deg?', depthLevel: 2 },
      { content: 'Er det noe du er god på, men som ikke får nok anerkjennelse fra andre?', depthLevel: 2 },
      { content: 'Tenk på en gang du overrasket deg selv med mot. Hva gjorde du?', depthLevel: 2 },
      { content: 'Har du noe du har gitt opp på, som du kanskje bør ta opp igjen?', depthLevel: 3 },
      { content: 'Er det noe ved deg selv du ikke er fornøyd med nå? Hva gjør du med det?', depthLevel: 3 },
      { content: 'Hva er den største misforståelsen folk har om deg?', depthLevel: 3 },
      { content: 'Hvordan vil du at partneren din skal beskrive personligheten din etter ett år sammen?', depthLevel: 3 },
    ],
  },

  // ───────────── 12. OPPLEVELSER OG NYSGJERRIGHET ─────────────
  {
    name: 'Opplevelser og nysgjerrighet',
    color: '#4ADE80',
    description: 'Utforske verden og hverandre',
    questions: [
      { content: 'Hva er den beste reisen du har vært på — og hvorfor?', depthLevel: 1 },
      { content: 'Er du mer «planlegg ferien ned til siste detalj» eller «vi ser hva som kommer»?', depthLevel: 1 },
      { content: 'Hva er noe du aldri har prøvd, men ønsker å prøve?', depthLevel: 1 },
      { content: 'Hvis du kunne lære én ting perfekt — hva ville det vært?', depthLevel: 1 },
      { content: 'Har du noen bok, film eller serie som har endret deg? Hva var det?', depthLevel: 2 },
      { content: 'Hva er en opplevelse du aldri vil glemme? Hvorfor blei den spesiell?', depthLevel: 2 },
      { content: 'Tror du at reiser avslører hvem en person virkelig er?', depthLevel: 2 },
      { content: 'Hvordan opplever du «nye ting» — med glede, uro, eller begge deler?', depthLevel: 2 },
      { content: 'Har du noen drømmereise du aldri har gjort? Hva stopper deg fra å ta den?', depthLevel: 3 },
      { content: 'Tenk på en gang du sa «ja» til noe som skremte deg. Hva lærte du?', depthLevel: 3 },
      { content: 'Hvordan tror du to mennesker kan beholde nysgjerrighet for hverandre over tid?', depthLevel: 3 },
      { content: 'Hvordan kan to mennesker utforske verden sammen uten å miste seg selv i prosessen?', depthLevel: 3 },
    ],
  },
]

// ═══════════════════════════════════════════════════════════
// SEED-FUNKSJON (Idempotent — upsert, ikke create)
// ═══════════════════════════════════════════════════════════

async function seedQuestions() {
  try {
    console.log('🌱 Starter seeding av Guided Questions (B3.1: 12 × 12 = 144)...')

    let totalCreated = 0

    for (let catIndex = 0; catIndex < CATEGORIES.length; catIndex++) {
      const cat = CATEGORIES[catIndex]

      // Valider struktur: 12 spørsmål per kategori, 4 per depthLevel
      if (cat.questions.length !== 12) {
        console.error(`❌ Kategori "${cat.name}" har ${cat.questions.length} spørsmål, forventet 12`)
        process.exit(1)
      }
      const depthCounts = { 1: 0, 2: 0, 3: 0 }
      for (const q of cat.questions) {
        if (q.depthLevel < 1 || q.depthLevel > 3) {
          console.error(`❌ Ugyldig depthLevel ${q.depthLevel} i "${cat.name}"`)
          process.exit(1)
        }
        depthCounts[q.depthLevel as 1 | 2 | 3]++
      }
      if (depthCounts[1] !== 4 || depthCounts[2] !== 4 || depthCounts[3] !== 4) {
        console.error(`❌ Kategori "${cat.name}" har feil fordeling: ${JSON.stringify(depthCounts)}, forventet 4/4/4`)
        process.exit(1)
      }

      // Opprett eller oppdater kategori (upsert på name)
      const category = await prisma.questionCategory.upsert({
        where: { name: cat.name },
        update: {
          color: cat.color,
          description: cat.description,
          order: catIndex,
        },
        create: {
          name: cat.name,
          color: cat.color,
          description: cat.description,
          order: catIndex,
        },
      })

      // Slett eksisterende spørsmål i kategorien (for ren oppdatering — idempotent)
      await prisma.guidedQuestion.deleteMany({
        where: { categoryId: category.id },
      })

      // Opprett 12 spørsmål
      for (let i = 0; i < cat.questions.length; i++) {
        const q = cat.questions[i]
        await prisma.guidedQuestion.create({
          data: {
            content: q.content,
            depthLevel: q.depthLevel,
            order: i + 1,
            category: { connect: { id: category.id } },
          },
        })
        totalCreated++
      }

      console.log(`  ✅ "${cat.name}" — 12 spørsmål (4×nivå 1, 4×nivå 2, 4×nivå 3)`)
    }

    const totalCategories = await prisma.questionCategory.count()
    const totalQuestions = await prisma.guidedQuestion.count()

    console.log(`\n✅ Seed fullført!`)
    console.log(`   ${totalCategories} kategorier`)
    console.log(`   ${totalQuestions} spørsmål totalt (forventet 144)`)

    if (totalQuestions !== 144) {
      console.warn(`⚠️  Advarsel: Forventet 144 spørsmål, fant ${totalQuestions}`)
    }
  } catch (error) {
    console.error('❌ Feil under seeding:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

seedQuestions()