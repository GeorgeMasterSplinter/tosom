// app/api/chat/image/[messageId]/route.ts — GET /api/chat/image/{messageId}
//
// Proxyer bildet direkte fra objektlagringen (R2/local) tilbake til klienten.
// Tilgangskontroll: kun deltakere i konversjonen kan hente bildet.
//
// Vi PROXY-er (i stedet for 307-redirect til presigned URL) fordi:
//   1. Unngår CSP-avhengighet (bildet kommer fra 'self', ingen cross-origin).
//   2. Fungerer med alle storage-drivere (R2, local, memory).
//   3. Unngår presigned URL-løpetid (900s) — bildet er alltid tilgjengelig.
//   4. Vercel serverless: ingen fil-system-avhengighet mellom invokasjoner.

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

    // 5. Hent bildet direkte fra lagringen og send det tilbake.
    const storage = getImageStorage();
    const { buffer, contentType } = await storage.getImage(message.imageKey);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': String(buffer.length),
        'Cache-Control': 'private, max-age=3600', // 1 time browser-cache (session-gated)
      },
    });
  } catch (error) {
    console.error('[chat/image/[messageId]] Feil ved henting av bilde:', error);
    return NextResponse.json(
      { error: 'Kunne ikke hente bilde', details: (error as Error).message },
      { status: 500 }
    );
  }
}