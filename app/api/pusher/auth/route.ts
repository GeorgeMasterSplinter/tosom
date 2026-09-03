/**
 * POST /api/pusher/auth
 *
 * Auth for Pusher PRIVATE-kanaler (private-conversation-*).
 *
 * Når pusher-js på klienten abonnerer på en private-kanal, sender Pusher en
 * POST hit med form-feltene `socket_id` + `channel_name`. Vi (1) verifiserer
 * at den innloggede brukeren faktisk er en DELTAKER i samtalen, og (2)
 * signerer kanalen med PUSHER_SECRET slik at Pusher slipper abonnementet
 * gjennom.
 *
 * Utgang: { "auth": "<PUSHER_KEY>:<signature>" }
 *   signature = HMAC-SHA256(PUSHER_SECRET, "<socket_id>:<channel_name>")
 *
 * Sikkerhet: signaturen utstedes KUN til samtale-deltakere (userAId/userBId).
 * En innlogga bruker som ikke er i samtalen får 403 og kan dermed ikke
 * abonnere — uautoriserte kan ikke lytte på samtale-innhold i sanntid.
 */

import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import { getServerSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const CHANNEL_PREFIX = "private-conversation-";

async function postHandler(request: NextRequest) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ auth: "" }, { status: 401 });
  }

  const key = process.env.PUSHER_KEY || "";
  const secret = process.env.PUSHER_SECRET || "";
  if (!key || !secret) {
    // Pusher ikke konfigurert i miljøet — la klienten falle tilbake på polling.
    return NextResponse.json({ auth: "" }, { status: 401 });
  }

  let socketId = "";
  let channelName = "";
  try {
    const raw = await request.text();
    const params = new URLSearchParams(raw);
    socketId = params.get("socket_id") ?? "";
    channelName = params.get("channel_name") ?? "";
  } catch {
    return NextResponse.json({ auth: "" }, { status: 400 });
  }

  // Kun private-conversation-kanaler signeres her.
  if (!channelName.startsWith(CHANNEL_PREFIX)) {
    return NextResponse.json({ auth: "" }, { status: 403 });
  }
  const conversationId = channelName.slice(CHANNEL_PREFIX.length);

  // IDOR-vern: kun samtale-deltakere får en signert kanal.
  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      OR: [
        { userAId: session.user.id },
        { userBId: session.user.id },
      ],
    },
    select: { id: true },
  });
  if (!conversation) {
    return NextResponse.json({ auth: "" }, { status: 403 });
  }

  const signature = createHmac("sha256", secret)
    .update(`${socketId}:${channelName}`)
    .digest("hex");

  return NextResponse.json({ auth: `${key}:${signature}` });
}

export const POST = postHandler;