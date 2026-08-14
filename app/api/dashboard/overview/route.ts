/**
 * ToSom — Dashboard Overview API
 * 
 * Returnerer sammla dashboard-data: match, conversation, journey.
 * B9: Registrerer oppmøte (userASeenAt/userBSeenAt) og starter reisen når begge har vært innom.
 */

import { getServerSession } from "@/lib/auth/session";
import prisma from "@/lib/prisma";
import { JOURNEY_TOTAL_DAYS } from "@/lib/journey/engine";

export const dynamic = 'force-dynamic';

export async function GET(_request: Request) {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const userId = session.user.id;

  try {
    // Hent aktiv match med profil-info
    const match = await prisma.match.findFirst({
      where: {
        status: "active",
        OR: [
          { userAId: userId },
          { userBId: userId },
        ],
      },
      orderBy: { createdAt: "desc" },
      include: {
        userA: { include: { profile: true } },
        userB: { include: { profile: true } },
      },
    });

    // B9: Registrer oppmøte og start reise hvis begge har vært innom
    let bothJustMet = false;
    if (match) {
      const matchId = match.id;

      // Finn brukerens JourneyProgress for denne matchen
      const myJourney = await prisma.journeyProgress.findFirst({
        where: {
          userId,
          matchId,
        },
      });

      if (myJourney) {
        // Bestem om brukeren er A eller B
        const isUserA = match.userAId === userId;

        await prisma.$transaction(async (tx) => {
          if (isUserA && myJourney.userASeenAt === null) {
            // Bruker A møter opp for første gang
            const updated = await tx.journeyProgress.update({
              where: { id: myJourney.id },
              data: { userASeenAt: new Date() },
            });

            // Hvis B allerede har vært innom, start reisen nå
            if (updated.userBSeenAt !== null && updated.bothSeenAt === null) {
              bothJustMet = true;
              await tx.journeyProgress.update({
                where: { id: updated.id },
                data: {
                  bothSeenAt: new Date(),
                  day: 1,
                  nextDayAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
                },
              });
            }
          } else if (!isUserA && myJourney.userBSeenAt === null) {
            // Bruker B møter opp for første gang
            const updated = await tx.journeyProgress.update({
              where: { id: myJourney.id },
              data: { userBSeenAt: new Date() },
            });

            // Hvis A allerede har vært innom, start reisen nå
            if (updated.userASeenAt !== null && updated.bothSeenAt === null) {
              bothJustMet = true;
              await tx.journeyProgress.update({
                where: { id: updated.id },
                data: {
                  bothSeenAt: new Date(),
                  day: 1,
                  nextDayAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
                },
              });
            }
          }
        });
      }
    }

    // Hent samtale-info
    const conversation = await prisma.conversation.findFirst({
      where: {
        OR: [
          { userAId: userId },
          { userBId: userId },
        ],
        endedAt: null,
      },
      orderBy: { lastMessageAt: "desc" },
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: "desc" },
          include: { sender: true },
        },
        userA: { include: { profile: true } },
        userB: { include: { profile: true } },
      },
    });

    // Hent reise-info (oppdatert etter eventuel oppmøte-registrering)
    const journey = await prisma.journeyProgress.findFirst({
      where: { userId },
    });

    // Finn match-partnar (den andre brukaren)
    let matchInfo: any = null;
    if (match) {
      const partner =
        match.userAId === userId ? match.userB : match.userA;
      const partnerProfile = partner.profile;
      matchInfo = {
        id: partner.id,
        name: [partnerProfile?.firstName, partnerProfile?.lastName].filter(Boolean).join(" ") || "Ukjent",
        age: partnerProfile?.age,
        bio: partnerProfile?.bio,
        resonanceLevel: match.resonanceLevel ?? null,
      };
    }

    // Finn samtale-partnar og siste melding
    let convoInfo: any = null;
    if (conversation && conversation.messages.length > 0) {
      const msg = conversation.messages[0];
      convoInfo = {
        partnerName: "Ukjent",
        lastMessage: msg.content,
        time: msg.createdAt,
        conversationId: conversation.id,
      };
    }

    // Formatter reise-info
    let journeyInfo: any = null;
    if (journey) {
      const totalDays = JOURNEY_TOTAL_DAYS; // 30
      journeyInfo = {
        day: journey.day,
        totalDays,
        phase: journey.phase,
        tittel: getPhaseTitle(journey.phase),
        beskrivelse: getPhaseDescription(journey.phase),
        bothSeenAt: journey.bothSeenAt?.toISOString() ?? null,
      };
    }

    return new Response(
      JSON.stringify({
        match: matchInfo,
        conversation: convoInfo,
        journey: journeyInfo,
        bothJustMet,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

function getPhaseTitle(phase: string): string {
  switch (phase) {
    case "EARLY": return "Bryt isen";
    case "BUILDING_TRUST": return "Bygg tillit";
    case "DEEPER": return "Dypere samtaler";
    case "CHECKIN": return "Sjekk inn";
    default: return "Ukjent fase";
  }
}

function getPhaseDescription(phase: string): string {
  switch (phase) {
    case "EARLY": return "Del med matchen din en personleg erfaring som har formet deg.";
    case "BUILDING_TRUST": return "Fortel om ein tid du overvinner ei utfordring.";
    case "DEEPER": return "Del ein verdi eller overtydning du har gjennom livet.";
    case "CHECKIN": return "Reflekter over hvordan reisen deres har påvirket hverandre.";
    default: return "";
  }
}