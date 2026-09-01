/**
* GET /api/chat/conversation/:conversationId
 * Hent conversation-info med partner-data.
 */

import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { haversineKm } from "@/lib/matching/distance";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Ikke autentisert" }, { status: 401 });
  }

  const { conversationId } = await params;

  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        userA: { select: { id: true, email: true } },
        userB: { select: { id: true, email: true } },
      },
    });

    if (!conversation) {
      return NextResponse.json({ error: "Samtalen finnes ikke" }, { status: 404 });
    }

    // Verifiser at brukeren er del av conversationen
    const isA = conversation.userAId === session.user.id;
    const isB = conversation.userBId === session.user.id;

    if (!isA && !isB) {
      return NextResponse.json({ error: "Ingen tilgang" }, { status: 403 });
    }

    // Finn partneren — navnet valgt i onboarding (identityName) er kilde nr. 1
    const partnerId = isA ? conversation.userBId : conversation.userAId;
    const [partnerUser, partnerProfile, meProfile] = await Promise.all([
      prisma.user.findUnique({
        where: { id: partnerId },
        select: { name: true },
      }),
      prisma.profile.findUnique({
        where: { userId: partnerId },
        select: { age: true, latitude: true, longitude: true, identityName: true },
      }),
      prisma.profile.findUnique({
        where: { userId: session.user.id },
        select: { latitude: true, longitude: true, identityName: true },
      }),
    ]);

    // identityName (valgt i onboarding) → User.name → «Din partner»
    const partnerName =
      partnerProfile?.identityName?.trim() || partnerUser?.name?.trim() || "Din partner";
    const myName =
      meProfile?.identityName?.trim() || (session.user.name ?? null);
    const partnerAge = partnerProfile?.age ?? 25;

    // Beregn avstand hvis begge har koordinater
    let distanceKm: number | null = null;
    if (
      partnerProfile?.latitude != null &&
      partnerProfile?.longitude != null &&
      meProfile?.latitude != null &&
      meProfile?.longitude != null
    ) {
      distanceKm = Math.round(
        haversineKm(
          meProfile.latitude,
          meProfile.longitude,
          partnerProfile.latitude,
          partnerProfile.longitude
        )
      );
    }

    return NextResponse.json({
      conversationId: conversation.id,
      partnerId,
      partnerName,
      // Visningsnavn til innlogga bruker — brukes i chat-boblene
      myName,
      partnerAge,
      distanceKm,
      imageShareAllowed: conversation.imageShareAllowedAt != null,
      lastMessageAt: conversation.lastMessageAt,
    });
  } catch (error) {
    console.error("GET /api/chat/conversation error:", error);
    return NextResponse.json(
      { error: "Kunne ikke hente samtale-info" },
      { status: 500 }
    );
  }
}