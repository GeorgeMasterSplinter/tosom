/**
 * ToSom — Seed: Realistiske testbrukere
 * Lager 6 brukere med fulle deep-profile for E2E-testing og matching-test
 * 
 * Bruk: npx tsx scripts/seed-test-users.ts
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// ─── Deep profile templates ───────────────────────────────────────────

interface DeepProfileData {
  lifeSituation: Record<string, any>;
  lifestyle: Record<string, any>;
  personality: Record<string, any>;
  relationshipStyle: string;
  communication: Record<string, any>;
  intimacy: Record<string, any>;
  futureVision: Record<string, any>;
  boundaries: Record<string, any>;
  emotionalNeeds: Record<string, any>;
}

const profiles = [
  {
    email: "eina.test@tosom.no",
    name: "Eina Larsen",
    password: "test123456",
    age: 29,
    gender: "female",
    seekingGender: "male",
    city: "Oslo",
    lifeSituation: {
      workType: "fast jobb",
      housingType: "leilighet egen",
      economicStability: "stabil",
      dailyRoutine: "strukturert med fleksibilitet",
    },
    lifestyle: {
      activity: "moderat aktiv",
      socialLife: "nært vennegjeng",
      weekends: "natur og hytte",
    },
    personality: {
      introversion: 6,
      openness: 8,
      conscientiousness: 7,
      agreeableness: 8,
      selfDesc: "Jeg er en reflektert person som verdsetter ærlighet og dype samtaler.",
    },
    relationshipStyle: "trygt tilknyttet",
    communication: {
      style: "direkte men varsom",
      conflictHandling: "snakker det ut rolig",
      loveLanguage: "ord som oppmuntrer",
    },
    intimacy: {
      pace: "tar det stille",
      physicalNeeds: "trygghet før nærmhet",
      emotionalDepth: "dypt engasjert når tilliten er der",
    },
    futureVision: {
      familyGoal: "ønsker barn på sikt",
      lifeDirection: "bygge noe varig med rette mennesket",
      values: ["ærlighet", "familie", "natur", "vekst"],
    },
    boundaries: {
      dealbreakers: ["løgn", "manglende respekt", "overflate"],
      pacing: "tar tiden som trengs",
      privacy: "verdssetter privat rom",
    },
    emotionalNeeds: {
      primaryNeed: "å føle seg sett og hørt",
      stressResponse: "trenger ro og samtale",
      supportStyle: "gjensidig og ærlig",
    },
  },
  {
    email: "stian.test@tosom.no",
    name: "Stian Johansen",
    password: "test123456",
    age: 32,
    gender: "male",
    seekingGender: "female",
    city: "Oslo",
    lifeSituation: {
      workType: "fast jobb innen teknologi",
      housingType: "leilighet egen",
      economicStability: "stabil",
      dailyRoutine: "arbeid, trening, læring",
    },
    lifestyle: {
      activity: "aktiv",
      socialLife: "nære venner, kvalitet over kvantitet",
      weekends: "friluftsliv og kjøkkenet",
    },
    personality: {
      introversion: 5,
      openness: 7,
      conscientiousness: 8,
      agreeableness: 7,
      selfDesc: "Jeg er en grounded type som brenner for personlig vekst og autentiske relasjoner.",
    },
    relationshipStyle: "trygt tilknyttet",
    communication: {
      style: "rolig og gjennomtenkt",
      conflictHandling: "tar pause der snakker vi deretter",
      loveLanguage: "kjærlige handlinger",
    },
    intimacy: {
      pace: "moderat, følger følelsen",
      physicalNeeds: "tilknytning og nærvær",
      emotionalDepth: "åpen når tryggheten er til stede",
    },
    futureVision: {
      familyGoal: "ønsker familie en gang",
      lifeDirection: "livsbalsanse med jobb, fritid og partner",
      values: ["autentisitet", "lojalitet", "utforskning", "ro"],
    },
    boundaries: {
      dealbreakers: ["spill adferd", "manglende integritet"],
      pacing: "kjører ingen maraton",
      privacy: "trenger eget rom og tid",
    },
    emotionalNeeds: {
      primaryNeed: "respekt og tillit",
      stressResponse: "gå en tur eller trene",
      supportStyle: "praksisnær og støttende",
    },
  },
  {
    email: "kari.test@tosom.no",
    name: "Kari Andersen",
    password: "test123456",
    age: 27,
    gender: "female",
    seekingGender: "male",
    city: "Bergen",
    lifeSituation: {
      workType: "studier og deltidsjobb",
      housingType: "deling med romkamerat",
      economicStability: "nok",
      dailyRoutine: "fleksibel, studiefokus",
    },
    lifestyle: {
      activity: "moderat",
      socialLife: "mange bekjente, få nære",
      weekends: "kultur og venner",
    },
    personality: {
      introversion: 4,
      openness: 9,
      conscientiousness: 6,
      agreeableness: 8,
      selfDesc: "Kreativ, nysgjerrig og dypførende. Jeg søker mening i det hverdagslige.",
    },
    relationshipStyle: "angst-preget men jobber med det",
    communication: {
      style: "åpen og uttrykkssterk",
      conflictHandling: "trenger å snakke det ut umiddelbart",
      loveLanguage: "kjærlige ord og oppmerksomhet",
    },
    intimacy: {
      pace: "helt stille, trygghet først",
      physicalNeeds: "berøring og nærvær",
      emotionalDepth: "veldig dyp når jeg føler meg trygg",
    },
    futureVision: {
      familyGoal: "ukjent ennå, følger hjertet",
      lifeDirection: "finne balanse mellom karriere og privatliv",
      values: ["kreativitet", "empati", " vekst", "ærlighet"],
    },
    boundaries: {
      dealbreakers: ["kontrollbehov", "manglende empati"],
      pacing: "sakte og med omhu",
      privacy: "viktig men deler gjerne når jeg vil",
    },
    emotionalNeeds: {
      primaryNeed: "å føle meg verdsatt for det jeg er",
      stressResponse: "trener trygge ord eller skriving",
      supportStyle: "lytende og til stede",
    },
  },
  {
    email: "erik.test@tosom.no",
    name: "Erik Svendsen",
    password: "test123456",
    age: 34,
    gender: "male",
    seekingGender: "female",
    city: "Trondheim",
    lifeSituation: {
      workType: "fast jobb innen helse",
      housingType: "bolig egen",
      economicStability: "stabil",
      dailyRoutine: "vaktbasert men forutsigbar",
    },
    lifestyle: {
      activity: "meget aktiv",
      socialLife: "liten sosial krets, dypt forhold",
      weekends: "fjell, sykkelturer, matlagning",
    },
    personality: {
      introversion: 7,
      openness: 6,
      conscientiousness: 9,
      agreeableness: 7,
      selfDesc: "Stabil, pålitelig og reflektert. Jobber med mennesker hver dag og det har gjort meg mer empatiske.",
    },
    relationshipStyle: "unngående-preget men bevisst",
    communication: {
      style: "knapp men ærlig",
      conflictHandling: "trenger rom først, snakker deretter",
      loveLanguage: "kjærlige handlinger og tid",
    },
    intimacy: {
      pace: "svært sakte, trygghet er alt",
      physicalNeeds: "nærvær og stille øyeblikk",
      emotionalDepth: "dypt inne men tar tid å åpne seg",
    },
    futureVision: {
      familyGoal: "ønsker barn en gang",
      lifeDirection: "stabil hverdag med dyp forbindelse",
      values: ["trygghet", "familie", "pålitelighet", "natur"],
    },
    boundaries: {
      dealbreakers: ["drama", "usikkerhet"],
      pacing: "sakte og stabilt",
      privacy: "veldig viktig, trenger eget rom",
    },
    emotionalNeeds: {
      primaryNeed: "stabilitet og tillit over tid",
      stressResponse: "natur og stillhet",
      supportStyle: "praktisk hjelp og tilstedeværelse",
    },
  },
  {
    email: "mari.test@tosom.no",
    name: "Mari Olsen",
    password: "test123456",
    age: 30,
    gender: "female",
    seekingGender: "male",
    city: "Stavanger",
    lifeSituation: {
      workType: "fast jobb innen utdanning",
      housingType: "leilighet egen",
      economicStability: "stabil",
      dailyRoutine: "strukturert med tid til refleksjon",
    },
    lifestyle: {
      activity: "moderat aktiv",
      socialLife: "balanse mellom alenetid og sosialt",
      weekends: "bøker, musikk, lange spaserturer",
    },
    personality: {
      introversion: 6,
      openness: 8,
      conscientiousness: 7,
      agreeableness: 9,
      selfDesc: "Jeg er en varm og reflektert person som verdsetter dype forbindelser og ærlig kommunikasjon.",
    },
    relationshipStyle: "trygt tilknyttet",
    communication: {
      style: "varm og tydelig",
      conflictHandling: "snakker det ut med empati",
      loveLanguage: "kjærlige ord og fysisk nærhet",
    },
    intimacy: {
      pace: "naturlig, følger oppførsel",
      physicalNeeds: "berøring og emosjonell tilknytning",
      emotionalDepth: "viktig med meg, søker dyp forbindelse",
    },
    futureVision: {
      familyGoal: "ønsker familie på sikt",
      lifeDirection: "balanse mellom karriere, partner og livsnyelse",
      values: ["kjærlighet", "empati", "læring", "balanse"],
    },
    boundaries: {
      dealbreakers: ["manglende ærlighet", "kontroll"],
      pacing: "naturlig tempo",
      privacy: "viktig med balanse mellom nærvær og rom",
    },
    emotionalNeeds: {
      primaryNeed: "å bli møtt med åpne armer og ærlighet",
      stressResponse: "snakker det ut med en trygg person",
      supportStyle: "emotivt støttende og lyttende",
    },
  },
  {
    email: "hallvard.test@tosom.no",
    name: "Hallvard Nilsen",
    password: "test123456",
    age: 31,
    gender: "male",
    seekingGender: "female",
    city: "Oslo",
    lifeSituation: {
      workType: "fast jobb innen design",
      housingType: "leilighet egen",
      economicStability: "stabil",
      dailyRoutine: "kreativ og fleksibel",
    },
    lifestyle: {
      activity: "moderat",
      socialLife: "nær krets, kvalitet over kvantitet",
      weekends: "design, kultur, mat",
    },
    personality: {
      introversion: 5,
      openness: 9,
      conscientiousness: 6,
      agreeableness: 8,
      selfDesc: "Kreativ, nysgjerrig og varm. Jeg brenner for skjønnhet i hverdagen og autentiske forbindelser.",
    },
    relationshipStyle: "trygt tilknyttet",
    communication: {
      style: "uttrykkssterk og visuell",
      conflictHandling: "snakker det ut kreativt",
      loveLanguage: "gaver og oppmerksomhet",
    },
    intimacy: {
      pace: "naturlig og organisk",
      physicalNeeds: "kreativ uttrykksform og nærvær",
      emotionalDepth: "dypt engasjert i relasjoner",
    },
    futureVision: {
      familyGoal: "åpent for familie en gang",
      lifeDirection: "liv med kreativitet, kjærlighet og vekst",
      values: ["kreativitet", "autentisitet", "kjærlighet", "frihet"],
    },
    boundaries: {
      dealbreakers: ["manglende respekt for kreativitet", "overflate"],
      pacing: "organisk tempo",
      privacy: "trenger kreativer rom",
    },
    emotionalNeeds: {
      primaryNeed: "å bli sett som et helhetlig menneske",
      stressResponse: "kreativ uttrykksform og ro",
      supportStyle: "inspirerende og til stede",
    },
  },
];

// ─── Seed function ──────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Seeding TOSOM testbrukere...\n");

  const createdUsers: any[] = [];

  for (const p of profiles) {
    try {
      // Create user
      const hashedPassword = await bcrypt.hash(p.password, 10);
      const user = await prisma.user.create({
        data: {
          email: p.email,
          name: p.name,
          password: hashedPassword,
          onboardingComplete: true,
          deepProfileComplete: true,
          role: "USER",
          verified: true,
        },
      });

      // Create deep profile
      await prisma.profile.create({
        data: {
          userId: user.id,
          firstName: p.name.split(" ")[0],
          lastName: p.name.split(" ")[1],
          age: p.age,
          lifeSituation: p.lifeSituation,
          lifestyle: p.lifestyle,
          personality: p.personality,
          relationshipStyle: p.relationshipStyle,
          communication: p.communication,
          intimacy: p.intimacy,
          futureVision: p.futureVision,
          boundaries: p.boundaries,
          emotionalNeeds: p.emotionalNeeds,
          lifeRhythm: "moderat",
          maturityLevel: 7,
          securityLevel: "standard",
          interests: p.futureVision.values,
          deepProfileStep: "SUMMARY",
          matchTags: [...p.futureVision.values, p.city],
        },
      });

      createdUsers.push({ email: p.email, name: p.name, id: user.id });
      console.log(`  ✅ ${p.name} (${p.email}, ${p.age} år, ${p.city})`);
    } catch (err) {
      console.error(`  ❌ Feil for ${p.name}:`, (err as Error).message);
    }
  }

  console.log(`\n✅ Seed fullført: ${createdUsers.length} brukere opprettet med fulle profiler.`);
  console.log("\nBrukere klar for matching-test:");
  for (const u of createdUsers) {
    console.log(`  - ${u.name} (${u.email})`);
  }
}

main()
  .catch((e) => {
    console.error("Seed feil:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());