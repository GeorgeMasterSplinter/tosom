import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { createSystemMessage } from "@/lib/createSystemMessage";
import { runJourneyStep } from "@/lib/journey/runJourneyStep";
import { getJourneyImpulse } from "@/lib/journey/getJourneyImpulse";
import { getJourneyState } from "@/lib/journey/getJourneyState";
import { isJourneyCompleted } from "@/lib/journey/journeyPhases";
import { checkRateLimit } from "@/lib/rateLimit";
import { messageSendSchema, continueChoiceSchema } from "@/lib/validation/message";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const conversationId = id;
  const body = await req.json();

  // Rate limiting: maks 60 meldingar/minutt per user
  if (checkRateLimit(`msg:${session.user.id}`, 60, 60_000)) {
    return NextResponse.json(
      { error: "For mange førespurslar. Vent eit par sekund." },
      { status: 429 }
    );
  }

  // ── continue_choice (dag 30/35-avslutning) ──
  if (body.type === "continue_choice") {
    const parse = continueChoiceSchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json(
        { error: parse.error.errors[0]?.message || "Ugyldig continue_choice" },
        { status: 400 }
      );
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
        userA: true,
        userB: true,
        journeyProgress: true,
      },
    });

    if (!conversation) {
      return NextResponse.json({ error: "Not allowed" }, { status: 403 });
    }

    if (
      session.user.id === conversation.userAId
        ? conversation.journeyProgress?.continueA
        : conversation.journeyProgress?.continueB
    ) {
      return NextResponse.json({ error: "Already answered" }, { status: 400 });
    }

    // JourneyProgress har userId unique (ikkje conversationId).
    // Bruk userA som eier journey for samtalen.
    const journey = await prisma.journeyProgress.findUnique({
      where: { userId: conversation.userAId },
    });

    if (!journey) {
      return NextResponse.json({ error: "No journey" }, { status: 404 });
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
          "Begge har valgt å fortsetje. Ta dere god tid, og bygg vidare på det de har starta."
        );
      } else if (bothNo) {
        await createSystemMessage(
          conversationId,
          "Begge har valgt å avslutte. Takk for at dere ga kvarandre ein sjanse."
        );
        await prisma.conversation.update({
          where: { id: conversationId },
          data: { endedAt: new Date() },
        });
      } else {
        await createSystemMessage(
          conversationId,
          "Éin av dere ønskjer å fortsetje, og éin ønskjer å avslutte. Det viktigaste er at valet kjennest riktig for kvar enkelt."
        );
      }
    }

    return NextResponse.json({ ok: true });
  }

  // Valider vanleg melding med Zod
  const parse = messageSendSchema.safeParse(body);
  if (!parse.success) {
    return NextResponse.json(
      { error: parse.error.errors[0]?.message || "Ugyldig melding" },
      { status: 400 }
    );
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
      userA: true,
      userB: true,
      journeyProgress: true,
    },
  });

  if (!conversation) {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }

  // ── vanleg brukarmelding ──
  const message = await prisma.message.create({
    data: {
      conversationId,
      senderId: session.user.id,
      content,
      type: type || "user",
    },
  });

  // Første melding i samtalen → inspirasjon
  const messageCount = await prisma.message.count({
    where: { conversationId },
  });

  if (messageCount === 1) {
    await createSystemMessage(
      conversationId,
      "Ta det roleg. Ingen forventningar. Berre sei hei og sjå korleis samtalen går."
    );
  }

  // Kjør journey-motor for dag-spur
  await runJourneyStep(conversationId);

  // Hent journey-tilstand (getJourneyState tek userId, ikkje conversationId)
  const journeyState = await getJourneyState(conversation.userAId);
  const { phase, completedSteps, totalSteps } = journeyState;

  // Hvis reisen er ferdig → send avslutning og lukk
  if (completedSteps >= totalSteps || isJourneyCompleted(completedSteps)) {
    if (!conversation.endedAt) {
      await createSystemMessage(
        conversationId,
        "Dei har fullført heile reisa. Takk for at dere tok dykketid til å bli kjent."
      );
      await prisma.conversation.update({
        where: { id: conversationId },
        data: { endedAt: new Date() },
      });
    }
    return NextResponse.json({ message, journeyEnded: true });
  }

  // Dag 1–35: send impulser
  if (completedSteps >= 1 && completedSteps <= 35 && !conversation.endedAt) {
    const otherUser =
      session.user.id === conversation.userAId
        ? conversation.userB
        : conversation.userA;

    const otherName = otherUser?.firstName || otherUser?.lastName || "Ukjent";
    if (otherName && otherName !== "Ukjent") {
      const impulse = getJourneyImpulse({
        day: completedSteps,
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
  if (completedSteps === 35 && !conversation.endedAt) {
    if (!journeyState.continueA && !journeyState.continueB) {
      await createSystemMessage(
        conversationId,
        "Dei har snakka ei stund no. Vil dere fortsetje å bygge vidare på dette, eller er det tid for å avslutte? Svar på spørsmålet under."
      );
    }
  }

  return NextResponse.json({ message });
}
