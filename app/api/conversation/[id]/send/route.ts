import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/auth/session";
import { createSystemMessage } from "@/lib/createSystemMessage";
import { journeyAPI, isJourneyCompleted, JOURNEY_TOTAL_DAYS } from "@/lib/journey/engine";
import { checkRateLimit } from "@/lib/rateLimit";
import { messageSendSchema, continueChoiceSchema } from "@/lib/validation/message";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }

  const { id: conversationId } = await context.params;
  const body = await request.json();

  // Rate limiting: maks 60 meldinger/minutt per user
  if (checkRateLimit(`msg:${session.user.id}`, 60, 60_000)) {
    return new Response(JSON.stringify({ error: "For mange forespørsler. Vent et par sekund." }), { status: 429, headers: { "Content-Type": "application/json" } });
  }

  // ── continue_choice (dag 30/35-avslutning) ──
  if (body.type === "continue_choice") {
    const parse = continueChoiceSchema.safeParse(body);
    if (!parse.success) {
      return new Response(JSON.stringify({ error: parse.error.issues[0]?.message || "Ugyldig continue_choice" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    const { choice } = parse.data;

    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [
          { userAId: session.user.id },
          { userBId: session.user.id },
        ],
      },
      include: {
        userA: { include: { profile: true } },
        userB: { include: { profile: true } },
      },
    });

    if (!conversation) {
      return new Response(JSON.stringify({ error: "Not allowed" }), { status: 403, headers: { "Content-Type": "application/json" } });
    }

    // Fetch JourneyProgress separately (it's not a relation on Conversation)
    const journey = await prisma.journeyProgress.findUnique({
      where: { userId: conversation.userAId },
    });

    if (!journey) {
      return new Response(JSON.stringify({ error: "No journey" }), { status: 404, headers: { "Content-Type": "application/json" } });
    }

    // Check if already answered
    const answered = session.user.id === conversation.userAId
      ? journey.continueA
      : journey.continueB;

    if (answered) {
      return new Response(JSON.stringify({ error: "Already answered" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    const updateData =
      session.user.id === conversation.userAId
        ? { continueA: choice }
        : { continueB: choice };

    const updatedJourney = await prisma.journeyProgress.update({
      where: { id: journey.id },
      data: updateData,
    });

    if (updatedJourney.continueA && updatedJourney.continueB) {
      const bothYes = updatedJourney.continueA === "yes" && updatedJourney.continueB === "yes";
      const bothNo = updatedJourney.continueA === "no" && updatedJourney.continueB === "no";

      if (bothYes) {
        await createSystemMessage(
          conversationId,
          "Begge har valgt å fortsette. Ta dere god tid, og bygg videre på det de har starta."
        );
      } else if (bothNo) {
        await createSystemMessage(
          conversationId,
          "Begge har valgt å avslutte. Takk for at dere ga hverandre en sjanse."
        );
        await prisma.conversation.update({
          where: { id: conversationId },
          data: { endedAt: new Date() },
        });
      } else {
        await createSystemMessage(
          conversationId,
          "Éin av dere ønsker å fortsette, og én ønsker å avslutte. Det viktigste er at valet kjennes riktig for hver enkelt."
        );
      }
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "Content-Type": "application/json" } });
  }

  // Valider vanlig melding med Zod
  const parse = messageSendSchema.safeParse(body);
  if (!parse.success) {
    return new Response(JSON.stringify({ error: parse.error.issues[0]?.message || "Ugyldig melding" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }
  const { content, type } = parse.data;

  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      OR: [
        { userAId: session.user.id },
        { userBId: session.user.id },
      ],
    },
    include: {
      userA: { include: { profile: true } },
      userB: { include: { profile: true } },
    },
  });

  if (!conversation) {
    return new Response(JSON.stringify({ error: "Not allowed" }), { status: 403, headers: { "Content-Type": "application/json" } });
  }

  // ── vanlig brukarmelding ──
  const normalizedType =
    type === "system_message"
      ? "system"
      : type || "user";

  const message = await prisma.message.create({
    data: {
      conversationId,
      senderId: session.user.id,
      content,
      type: normalizedType,
    },
  });

  // Første melding i samtalen → inspirasjon
  const messageCount = await prisma.message.count({
    where: { conversationId },
  });

  if (messageCount === 1) {
    await createSystemMessage(
      conversationId,
      "Ta det rolig. Ingen forventninger. Bare sei hei og se hvordan samtalen går."
    );
  }

  // Hent journey-progresjon for å kjenne dag
  const journeyProgress = await prisma.journeyProgress.findUnique({
    where: { userId: conversation.userAId },
    select: { day: true },
  });
  const currentDay = journeyProgress?.day ?? 1;
  const totalDays = JOURNEY_TOTAL_DAYS;

  // Hent journey-tilstand frå engine.ts (éin kilde)
  const journeyState = journeyAPI.buildJourneyState(
    currentDay,
    { matchState: "in_journey", conversationId }
  );

  // Hvis reisen er ferdig → send avslutning og lukk
  if (currentDay >= totalDays || isJourneyCompleted(currentDay)) {
    if (!conversation.endedAt) {
      await createSystemMessage(
        conversationId,
        "Dei har fullført hele reisa. Takk for at dere tok dere tid til å bli kjent."
      );
      await prisma.conversation.update({
        where: { id: conversationId },
        data: { endedAt: new Date() },
      });
    }
    return new Response(JSON.stringify({ message, journeyEnded: true }), { status: 200, headers: { "Content-Type": "application/json" } });
  }

  // Dag 1–35: send impulser frå engine.ts
  if (currentDay >= 1 && currentDay <= totalDays && !conversation.endedAt) {
    const otherUser =
      session.user.id === conversation.userAId
        ? conversation.userB
        : conversation.userA;

    const otherName = `${otherUser?.profile?.firstName ?? ""} ${otherUser?.profile?.lastName ?? ""}`.trim() || "Ukjent";
    if (otherName !== "Ukjent") {
      const impulse = journeyAPI.getJourneyImpulse({
        day: currentDay,
        name: otherName,
      });

      if (impulse) {
        const lastSystemMessage = await prisma.message.findFirst({
          where: {
            conversationId,
          },
          orderBy: { createdAt: "desc" },
        });

        const shouldSend =
          !lastSystemMessage ||
          (Date.now() - lastSystemMessage.createdAt.getTime()) > 30000;

        if (shouldSend) {
          await createSystemMessage(conversationId, impulse);
        }
      }
    }
  }

  // Dag 35: still continue-spørsmål til begge
  if (currentDay === 35 && !conversation.endedAt) {
    const progress = await prisma.journeyProgress.findUnique({
      where: { userId: conversation.userAId },
      select: { continueA: true, continueB: true },
    });
    if (!progress?.continueA && !progress?.continueB) {
      await createSystemMessage(
        conversationId,
        "Dei har snakka ei stund nå. Vil dere fortsette å bygge videre på dette, eller er det tid for å avslutte? Svar på spørsmålet under."
      );
    }
  }

  return new Response(JSON.stringify({ message }), { status: 200, headers: { "Content-Type": "application/json" } });
}
