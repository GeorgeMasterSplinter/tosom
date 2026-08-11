/**
 * ToSom — Dashboard Overview API
 * 
 * Returnerer sammla dashboard-data: match, conversation, journey.
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

  try {
    // Hent aktiv match med profil-info
    const match = await prisma.match.findFirst({
      where: {
        status: "active",
        OR: [
          { userAId: session.user.id },
          { userBId: session.user.id },
        ],
      },
      orderBy: { createdAt: "desc" },
      include: {
        userA: { include: { profile: true } },
        userB: { include: { profile: true } },
      },
    });

    // Hent samtale-info
    const conversation = await prisma.conversation.findFirst({
      where: {
        OR: [
          { userAId: session.user.id },
          { userBId: session.user.id },
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

    // Hent reise-info
    const journey = await prisma.journeyProgress.findUnique({
      where: { userId: session.user.id },
    });

    // Finn match-partnar (den andre brukaren)
    let matchInfo: any = null;
    if (match) {
      const partner =
        match.userAId === session.user.id ? match.userB : match.userA;
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
      };
    }

    return new Response(
      JSON.stringify({
        match: matchInfo,
        conversation: convoInfo,
        journey: journeyInfo,
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