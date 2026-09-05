/**
 * Tosom — Dashboard Overview API
 * 
 * Returnerer sammla dashboard-data: match, conversation, journey.
 * B9: Registrerer oppmøte (userASeenAt/userBSeenAt) og starter reisen når begge har vært innom.
 */

import { getServerSession } from "@/lib/auth/session";
import prisma from "@/lib/prisma";
import { JOURNEY_TOTAL_DAYS } from "@/lib/journey/engine";
import { haversineKm } from "@/lib/matching/distance";

export const dynamic = 'force-dynamic';

/**
 * Løser fram brukeren sitt valgte visningsnavn.
 * identityName er navnet brukeren selv har valgt i onboarding
 * («Hva vil du at vi skal kalle deg?») og er kilde nr. 1.
 * Fallback: fornavn + etternavn, så User.name, så «Ukjent».
 */
function displayName(
  profile:
    | { identityName?: string | null; firstName?: string | null; lastName?: string | null }
    | null
    | undefined,
  userName?: string | null
): string {
  return (
    profile?.identityName?.trim() ||
    [profile?.firstName, profile?.lastName].filter(Boolean).join(" ").trim() ||
    userName?.trim() ||
    "Ukjent"
  );
}

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
    // BUG 3: Eksponer reise-tilstand slik at venterommet kan vise sanne tilstander
    // (IDLE/QUEUED/MATCHED/…) i staden for å gjette seg fram fra vekeplan.
    const me = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        journeyState: true,
        onboardingComplete: true,
        matchQueuedAt: true,
        name: true,
        profile: { select: { identityName: true } },
      },
    });

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

    // Finn match-partner (den andre brukeren)
    // B1.6: Avstand beregnes og vises som avrundet bånd («ca. 12 km»).
    // Mangler koordinater → skjul feltet (null), ikke vis «0 km».
    let matchInfo: any = null;
    if (match) {
      const myProfile = match.userAId === userId ? match.userA.profile : match.userB.profile;
      const partner =
        match.userAId === userId ? match.userB : match.userA;
      const partnerProfile = partner.profile;

      // B1.6: Beregn avstand hvis begge har koordinater
      let distanceKm: number | null = null;
      if (
        myProfile?.latitude != null &&
        myProfile?.longitude != null &&
        partnerProfile?.latitude != null &&
        partnerProfile?.longitude != null
      ) {
        const raw = haversineKm(
          myProfile.latitude,
          myProfile.longitude,
          partnerProfile.latitude,
          partnerProfile.longitude
        );
        distanceKm = Math.round(raw);
      }

      matchInfo = {
        id: partner.id,
        name: displayName(partnerProfile, partner.name),
        age: partnerProfile?.age,
        bio: partnerProfile?.bio,
        resonanceLevel: match.resonanceLevel ?? null,
        distanceKm, // B1.6: null hvis koordinater mangler
      };
    }

    // Finn samtale-partnar og siste melding
    // conversationId skal ALLTID være til stades når samtalen eksisterer
    // (også før første melding), slik at klienten kan route direkte til /chat/[id]
    let convoInfo: any = null;
    if (conversation) {
      const msg = conversation.messages[0] ?? null;
      const partner =
        conversation.userAId === userId ? conversation.userB : conversation.userA;
      convoInfo = {
        conversationId: conversation.id,
        partnerName: displayName(partner.profile, partner.name),
        lastMessage: msg?.content ?? null,
        time: msg?.createdAt ?? null,
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

    // Match reveal: sjekk om det finnes ulest MATCH-notifikasjon
    let unreadMatch = false;
    if (match) {
      const unreadNotif = await prisma.notification.findFirst({
        where: { userId, type: 'MATCH', readAt: null },
        select: { id: true },
      });
      unreadMatch = unreadNotif != null;
    }

    return new Response(
      JSON.stringify({
        match: matchInfo,
        conversation: convoInfo,
        journey: journeyInfo,
        // Visningsnavn til innlogga bruker — navnet valgt i onboarding.
        // Brukes til hilsenen («God kveld, Anne Sofie») i dashboard og venterom.
        myName: me ? displayName(me.profile, me.name) : "Ukjent",
        bothJustMet,
        // BUG 3: Sanne reise-tilstandar for venterommet
        journeyState: me?.journeyState ?? "IDLE",
        onboardingComplete: me?.onboardingComplete ?? false,
        matchQueuedAt: me?.matchQueuedAt ? me.matchQueuedAt.toISOString() : null,
        unreadMatch,
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
    case "EARLY": return "Del med matchen din en personlig erfaring som har formet deg.";
    case "BUILDING_TRUST": return "Fortell om en gang du overvant en utfordring.";
    case "DEEPER": return "Del en verdi eller overbevisning du har gjennom livet.";
    case "CHECKIN": return "Reflekter over hvordan reisen deres har påvirket hverandre.";
    default: return "";
  }
}
