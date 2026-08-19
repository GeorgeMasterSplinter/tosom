// app/api/chat/image/[messageId]/route.ts — GET /api/chat/image/{messageId}
//
// Utsteder en signert URL til et bilde som er knyttet til en Message-rad.
// Tilgangskontroll: kun deltakere i konversjonen kan motta URL-en. Aldri en
// offentlig sti eksponeres — URL-en er presignet med kort levetid
// (IMAGE_URL_TTL_SECONDS, standard 900).
//
// Responderer med 307-redirect slik at eksisterende <img src> i klienten
// bare trenger å peke på denne ruten.

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';
import { getImageStorage } from '@/lib/storage';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ messageId: string }> }
): Promise<NextResponse> {
  const { messageId } = await params;
  if (!messageId) {
    return NextResponse.json({ error: 'Manglende messageId' }, { status: 400 });
  }

  // 1. Krever session.
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Uautorisert — logg inn først' }, { status: 401 });
  }
  const userId = session.user.id;

  try {
    // 2. Hent melding + conversation i ett oppslag.
    const message = await prisma.message.findUnique({
      where: { id: messageId },
      select: {
        id: true,
        imageKey: true,
        type: true,
        conversation: {
          select: { userAId: true, userBId: true },
        },
      },
    });

    if (!message) {
      return NextResponse.json({ error: 'Meldingen finnes ikke' }, { status: 404 });
    }

    // 3. Deltaker-sjekk: kun userA eller userB kan se bildet.
    if (message.conversation.userAId !== userId && message.conversation.userBId !== userId) {
      return NextResponse.json({ error: 'Uautorisert' }, { status: 403 });
    }

    // 4. Kun type=image med imageKey er gyldig.
    if (message.type !== 'image' || !message.imageKey) {
      return NextResponse.json(
        { error: 'Meldingen inneholder ikke et bilde' },
        { status: 404 }
      );
    }

    // 5. Utsted signert URL (kort levetid).
    const storage = getImageStorage();
    const url = await storage.getSignedUrl(message.imageKey);

    // 307 redirect — bevarer methoden, men for GET er dette likt 302.
    // Vi bruker 307 for å dokumentere at det er en permanent redirect til en
    // presigned-URL, ikke en cacheable redirect.
    return NextResponse.redirect(url, { status: 307 });
  } catch (error) {
    console.error('[chat/image/[messageId]] Feil:', error);
    return NextResponse.json(
      { error: 'Kunne ikke hente bilde' },
      { status: 500 }
    );
  }
}