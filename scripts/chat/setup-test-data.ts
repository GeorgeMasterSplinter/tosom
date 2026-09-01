/**
 * ToSom — Setup Chat Test Data
 * 
 * Lagar alt som trengst for å teste chat med ekte data:
 *   1. To brukere (testA@test.com, testB@test.com)
 *   2. Éin match mellom de
 *   3. Éin conversation
 *   4. Flere meldinger i conversationen
 *   5. JourneyProgress for begge
 * 
 * Bruk: npx ts-node scripts/chat/setup-test-data.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Fargekonfigurasjon for utskrift
const C = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  gold: "\x1b[38;5;214m", // ANSI gold-ish
  green: "\x1b[32m",
  red: "\x1b[31m",
  dim: "\x1b[2m",
};

function log(section: string, message: string) {
  console.log(`${C.bold}[ToSom Chat Setup]${C.reset} ${C.gold}${section}:${C.reset} ${message}`);
}

async function setup() {
  log("START", "Setter opp chat test-data...");

  // ─── 1. OPPRETT BRUKERE ───────────────────────────────────────────

  const emailA = "test-a@tosom.com";
  const emailB = "test-b@tosom.com";

  let userA = await prisma.user.findUnique({ where: { email: emailA } });
  let userB = await prisma.user.findUnique({ where: { email: emailB } });

  if (!userA) {
    userA = await prisma.user.create({
      data: {
        email: emailA,
        password: "$2b$10$EXAMPLEHASH",
        role: "USER",
        verified: true,
        onboardingComplete: true,
        deepProfileComplete: true,
        profile: {
          create: {
            firstName: "Test",
            lastName: "A",
            age: 28,
            bio: "Rolig og naturglad.",
            interests: ["vandring", "bøker", "natur"],
            matchTags: ["rolig", "dyp", "naturliv"],
          },
        },
      },
    });
    log("BRUKER A", `Oppretta ${emailA} (id: ${userA.id})`);
  } else {
    log("BRUKER A", `Finnes allerede: ${emailA} (id: ${userA.id})`);
  }

  if (!userB) {
    userB = await prisma.user.create({
      data: {
        email: emailB,
        password: "$2b$10$EXAMPLEHASH",
        role: "USER",
        verified: true,
        onboardingComplete: true,
        deepProfileComplete: true,
        profile: {
          create: {
            firstName: "Test",
            lastName: "B",
            age: 26,
            bio: "Nysgjerrig og empatisk.",
            interests: ["musikk", "kaffe", "samtaler"],
            matchTags: ["empati", "åpen", "reflekterande"],
          },
        },
      },
    });
    log("BRUKER B", `Oppretta ${emailB} (id: ${userB.id})`);
  } else {
    log("BRUKER B", `Finnes allerede: ${emailB} (id: ${userB.id})`);
  }

  // ─── 2. SLETT GAMMAL MATCH/CONVERSATION (valfritt) ──────────────────

  const existingMatch = await prisma.match.findFirst({
    where: {
      OR: [
        { userAId: userA.id, userBId: userB.id },
        { userAId: userB.id, userBId: userA.id },
      ],
    },
  });

  if (existingMatch) {
    // Slett meldinger først
    await prisma.message.deleteMany({ where: { conversationId: existingMatch.id } });
    await prisma.conversation.deleteMany({ where: { matchId: existingMatch.id } });
    await prisma.match.delete({ where: { id: existingMatch.id } });
    log("RYDDING", `Sletta eksisterande match + data (id: ${existingMatch.id})`);
  }

  // ─── 3. OPPRETT MATCH ──────────────────────────────────────────────

  const userAId = userA.id;
  const userBId = userB.id;

    const match = await prisma.match.create({
      data: {
        userAId,
        userBId,
        status: "pending" as any,
        score: 87,
        normalizedScore: 0.87,
        type: "resonance",
        resonanceLevel: "MODERATE" as any,
        explanation: {
          commonInterests: ["natur", "djup samtale"],
          complementaryTraits: true,
        },
      },
    });

  log("MATCH", `Oppretta match (id: ${match.id}, score: ${match.score}%)`);

  // ─── 4. OPPRETT CONVERSATION ───────────────────────────────────────

  const conversation = await prisma.conversation.create({
    data: {
      userAId,
      userBId,
      matchId: match.id,
    },
  });

  log("CONVERSATION", `Oppretta (id: ${conversation.id})`);

  // ─── 5. OPPRETT MELDINGER ──────────────────────────────────────────

  const now = Date.now();
  const hour = 3600000;

  const mockMessages = [
    { senderId: userBId, content: 'Hei! Så hyggelig å matche med deg 😊', offset: -5 * hour },
    { senderId: userAId, content: 'Hei! Takk skal du ha, du ser også veldig hyggelig ut!', offset: -4 * hour },
    { senderId: userBId, content: 'Takk! Jeg la merke til at du også er glad i ro og stillhet. Det er sjeldan i dagens tid.', offset: -3 * hour },
    { senderId: userAId, content: 'Ja, det er sant. Jeg trives best i rolige omgivelser — enten det er naturen eller hjemme med ei god bok.', offset: -2 * hour },
    { senderId: userBId, content: 'Hva leser du mest av?', offset: -1 * hour },
    { senderId: userAId, content: 'En blanding av fagbøker og litteratur. Akkurat nå leser jeg "Norsk psykologi". Hva med deg?', offset: -30 * 60000 },
    { senderId: userBId, content: 'Jeg er mest av en fagbok-person også — og litt skjønnlitteratur på kvelden.', offset: -15 * 60000 },
  ];

  const createdMessages = await Promise.all(
    mockMessages.map(async (m) => {
      const msg = await prisma.message.create({
        data: {
          id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}-${m.offset}`,
          conversationId: conversation.id,
          senderId: m.senderId,
          content: m.content,
          type: "user",
          createdAt: new Date(now + m.offset),
        },
      });
      return msg;
    })
  );

  log("MELDINGER", `Oppretta ${createdMessages.length} meldinger`);

  // ─── 6. OPPRETT JOURNEY PROGRESS FOR BRUKER A ─────────────────────

  let journey = await prisma.journeyProgress.findUnique({ where: { userId: userAId } });
  if (!journey) {
    journey = await prisma.journeyProgress.create({
      data: {
        userId: userAId,
        phase: "EARLY",
        day: 5,
        completedDays: 4,
      },
    });
    log("JOURNEY A", `Oppretta — dag ${journey.day} av 30`);
  } else {
    log("JOURNEY A", `Finnes allerede — dag ${journey.day}`);
  }

  // ─── OPPSUMMERING ──────────────────────────────────────────────────

  console.log(`
${C.bold}═══════════════════════════════════════${C.reset}
${C.bold}  ✅ CHAT TEST DATA KLAR!${C.reset}
${C.dim}═══════════════════════════════════════${C.reset}

  Bruker A: ${C.gold}${userA.email}${C.reset} (id: ${userA.id})
  Bruker B: ${C.gold}${userB.email}${C.reset} (id: ${userB.id})
  
  Match:    ${C.gold}${match.id}${C.reset} (score: ${match.score}%)
  Convers.: ${C.gold}${conversation.id}${C.reset}
  Meldinger: ${createdMessages.length}

  For å teste chat:
    1. Logg inn som ${userA.email}
    2. Gå til /dashboard eller /match
    3. Aksepter matchen → redirect til /chat/${conversation.id}
    4. Se meldingane!

${C.bold}═══════════════════════════════════════${C.reset}
  `);

  log("FERDIG", "Chat test-data er klar!");
}

setup().catch((err: unknown) => {
  console.error(`${C.red}FEIL:${C.reset}`, err);
  // eslint-disable-next-line no-process-exit
  process.exit(1);
}).finally(() => {
  prisma.$disconnect();
});
