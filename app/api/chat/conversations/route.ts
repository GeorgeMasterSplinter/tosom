/**
 * GET /api/chat/conversations
 *
 * B0.7 — Hent brukerens aktive samtaler til chat-oversikten.
 *
 * Én match = én samtale. Returnerer motpartens identitet, reise-dag,
 * resonansnivå (som "mood"), uleste og siste meldingsforhåndsvisning.
 *
 * Bruker `select` — ingen full henting, ingen meldingsinnhold utover
 * forhåndsvisningen.
 */

import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/** Kartlegg resonansnivå (Prisma-enum) til "mood"-nøkkel som UI-et kjenner til. */
const MOOD_FROM_LEVEL: Record<string, string> = {
  DEEP: "deep",
  STRONG: "joyful",
  MODERATE: "warm",
  GENTLE: "gentle",
};

export async function GET(request: Request) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Ikke autentisert" }, { status: 401 });
  }
  const me = session.user.id;

  try {
    // Aktive samtaler der brukeren er part A eller B. Ingen avslutte/frysne.
    let conversations = await prisma.conversation.findMany({
      where: {
        OR: [{ userAId: me }, { userBId: me }],
        endedAt: null,
      },
      orderBy: { lastMessageAt: { sort: "desc", nulls: "last" } },
      select: {
        id: true,
        matchId: true,
        userAId: true,
        userBId: true,
        lastMessageAt: true,
        lastMessagePreview: true,
        unreadCountA: true,
        unreadCountB: true,
        mood: true,
        userA: {
          select: {
            id: true,
            name: true,
            profile: { select: { identityName: true, age: true, photoUrl: true } },
          },
        },
        userB: {
          select: {
            id: true,
            name: true,
            profile: { select: { identityName: true, age: true, photoUrl: true } },
          },
        },
      },
    });

    // Self-healing: Hvis ingen conversation finnes men aktiv match er tilstede, opprett den.
    if (conversations.length === 0) {
      const activeMatch = await prisma.match.findFirst({
        where: {
          status: 'active',
          OR: [{ userAId: me }, { userBId: me }],
        },
      });

      if (activeMatch) {
        await prisma.conversation.create({
          data: {
            userAId: activeMatch.userAId,
            userBId: activeMatch.userBId,
            matchId: activeMatch.id,
          },
        });

        // Hent den nyopprettede conversationen med full include
        conversations = await prisma.conversation.findMany({
          where: {
            OR: [{ userAId: me }, { userBId: me }],
            endedAt: null,
          },
          orderBy: { lastMessageAt: { sort: "desc", nulls: "last" } },
          select: {
            id: true,
            matchId: true,
            userAId: true,
            userBId: true,
            lastMessageAt: true,
            lastMessagePreview: true,
            unreadCountA: true,
            unreadCountB: true,
            mood: true,
            userA: {
              select: {
                id: true,
                name: true,
                profile: { select: { identityName: true, age: true, photoUrl: true } },
              },
            },
            userB: {
              select: {
                id: true,
                name: true,
                profile: { select: { identityName: true, age: true, photoUrl: true } },
              },
            },
          },
        });
      }
    }

    const matchIds = conversations
      .map((c) => c.matchId)
      .filter((id): id is string => Boolean(id));

    // Resonansnivå per match (vises som "mood", aldri som tall — I-12)
    const matches = matchIds.length
      ? await prisma.match.findMany({
          where: { id: { in: matchIds } },
          select: { id: true, resonanceLevel: true },
        })
      : [];
    const resonanceByMatch = new Map(matches.map((m) => [m.id, m.resonanceLevel]));

    // Reise-dag for den påloggte brukerens fremskritt i hver match
    const journeyProgress = matchIds.length
      ? await prisma.journeyProgress.findMany({
          where: { userId: me, matchId: { in: matchIds } },
          select: { matchId: true, day: true },
        })
      : [];
    const dayByMatch = new Map(journeyProgress.map((j) => [j.matchId, j.day]));

    const data = conversations.map((c) => {
      const partner = c.userAId === me ? c.userB : c.userA;
      const unreadCount = c.userAId === me ? c.unreadCountA : c.unreadCountB;
      const matchId = c.matchId;
      const resonance = matchId ? resonanceByMatch.get(matchId) : undefined;

      return {
        id: c.id,
        // Motpartens bruker-ID (trengs bl.a. for rapportering i innstillinger)
        partnerId: partner.id,
        partnerName: partner.profile?.identityName || partner.name || "Partner",
        partnerAge: partner.profile?.age ?? undefined,
        partnerImageUrl: partner.profile?.photoUrl ?? undefined,
        journeyDay: matchId ? dayByMatch.get(matchId) ?? 0 : 0,
        // Delt mood (server-styrt per samtale). Faller tilbake til resonans-avledt mood
        // kun for eksisterende samtaler som ennå ikke har en eksplisitt mood satt.
        mood: c.mood || (resonance ? MOOD_FROM_LEVEL[resonance] ?? "calm" : "calm"),
        unreadCount,
        lastMessage: c.lastMessagePreview ?? undefined,
        lastMessageTime: c.lastMessageAt ? c.lastMessageAt.toISOString() : undefined,
      };
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("GET /api/chat/conversations error:", error);
    return NextResponse.json({ success: false, error: "Kunne ikke laste samtaler" }, { status: 500 });
  }
}