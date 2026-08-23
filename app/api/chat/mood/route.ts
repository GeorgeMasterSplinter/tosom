/**
 * PATCH /api/chat/mood
 *
 * Sett den DELTE mood for en samtale. Én mood per samtale — begge parter deler den.
 * Når en partner bytter mood, skifter stemningen for begge (rolig, subtil overgang).
 * Ingen notifikasjon, ingen melding — bare fargene bytter seg.
 *
 * Synkronisering skjer via polling: /api/chat/messages returnerer alltid den
 * gjeldende samtale-mood, og klienten poller den hvert 3. sekund. Pusher-trigger
 * er en bonus for når Pusher er aktivert (best-effort, feiler aldri).
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/requireAuth";
import { prisma } from "@/lib/prisma";
import { triggerMoodChange } from "@/lib/pusher/server";
import { VALID_MOODS } from "@/app/chat/lib/mood";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest) {
  const result = await requireAuth(req);
  if (result instanceof NextResponse) return result;
  const userId = result.user.id;

  const body = await req.json().catch(() => null);
  if (!body || typeof body.conversationId !== "string" || typeof body.mood !== "string") {
    return NextResponse.json({ error: "conversationId og mood kreves" }, { status: 400 });
  }

  const { conversationId, mood } = body;

  if (!VALID_MOODS.has(mood)) {
    return NextResponse.json({ error: "Ugyldig mood" }, { status: 400 });
  }

  // Verifiser at brukeren deltar i samtalen
  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      OR: [{ userAId: userId }, { userBId: userId }],
    },
    select: { id: true, mood: true },
  });

  if (!conversation) {
    return NextResponse.json({ error: "Du deltar ikke i denne samtalen" }, { status: 403 });
  }

  // Ingen unødvendig skriv hvis mooden er uendret
  if (conversation.mood === mood) {
    return NextResponse.json({ success: true, mood });
  }

  await prisma.conversation.update({
    where: { id: conversationId },
    data: { mood },
  });

  // Pusher-broadcast (best-effort — feil skal aldri blokkere)
  try {
    await triggerMoodChange(conversationId, userId, mood);
  } catch {
    /* Pusher ikke tilgjengelig / feil — polling dekker opp */
  }

  return NextResponse.json({ success: true, mood });
}