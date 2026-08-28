// app/api/chat/image/route.ts — POST /api/chat/image
//
// Håndterer filopplasting for bilder i chat. Bildet lagres i objektlagring
// (R2 i produksjon, lokal fil i utvikling) via lib/storage — ALDRI i
// public/. Bildet knyttes til en Message-rad ved imageKey, slik at:
//   1. Lesing skjer via GET /api/chat/image/{messageId} (signert URL).
//   2. Filen kan slettes ved reiseslutt (GDPR art. 17).
//
// Ingen offentlig sti eksponeres noensinne.

import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { withMetrics } from '@/lib/observability/withMetrics';
import { getServerSession } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';
import { isPhotosAllowed } from '@/lib/journey/engine';
import { getImageStorage, buildImageKey, assertSafeImageKey } from '@/lib/storage';
import { pgCheck } from '@/lib/rate-limit-pg';

export const dynamic = 'force-dynamic';

// B-4: Rate-limit-tak per bruker (mønster fra A5).
const CHAT_IMAGE_RATE_MAX = 10;
const CHAT_IMAGE_RATE_WINDOW_SEC = 60;

// Maks filstorleik: 5 MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Accepterte bilete-typar
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// Utvidingar map
const EXT_MAP: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

/**
 * POST /api/chat/image
 *
 * Body: FormData
 *   - file: File (max 5MB, image/jpeg/png/webp)
 *   - conversationId: string
 *   - messageId: string — Message-rad (type=image) som bildet skal knyttes til
 *
 * Response: { success: true, imageUrl: string }
 *   imageUrl peker på GET /api/chat/image/{messageId} (signert URL ved lesing).
 */
async function postHandler(request: NextRequest): Promise<NextResponse> {
  try {
    // STEG 1 — Krever session. senderId kommer alltid fra session, IKKE fra klienten.
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Uautorisert — logg inn først' },
        { status: 401 }
      );
    }
    const senderId = session.user.id;

    // B-4: Rate limiting per bruker (mønster fra A5, fail-open).
    const imageLimit = await pgCheck(
      `chat:image:${senderId}`,
      CHAT_IMAGE_RATE_MAX,
      CHAT_IMAGE_RATE_WINDOW_SEC
    );
    if (!imageLimit.ok) {
      return NextResponse.json(
        { error: 'Du laster opp for ofte. Vent et øyeblikk.' },
        { status: 429 }
      );
    }

    // Hent FormData
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const conversationId = formData.get('conversationId') as string;
    const messageId = formData.get('messageId') as string;

    // Valider fil
    if (!file) {
      return NextResponse.json({ error: 'Ingen fil funnet' }, { status: 400 });
    }

    // Valider bilete-type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Ugyldig bilete-type. Kun JPG, PNG og WebP er tillatne.' },
        { status: 400 }
      );
    }

    // Valider filstorleik
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'Fila er for stor. Maks 5 MB.' }, { status: 400 });
    }

    // Valider conversationId
    if (!conversationId) {
      return NextResponse.json({ error: 'Mangler conversationId' }, { status: 400 });
    }

    // Sjekk at brukeren er deltaker i konversasjonen
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      select: { userAId: true, userBId: true, matchId: true },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: 'Konversasjonen finnes ikke' },
        { status: 404 }
      );
    }

    if (conversation.userAId !== senderId && conversation.userBId !== senderId) {
      return NextResponse.json(
        { error: 'Uautorisert — du er ikke deltaker i denne konversasjonen' },
        { status: 403 }
      );
    }

    // M-6: Bilde-lås håndheves server-side på journey-dag (kanonisk isPhotosAllowed: dag >= 15).
    // Denne sjekken kjører FØR opplastning, slik at ingen bilde når lagringen før låsen er opphøyet.
    if (conversation.matchId) {
      const journey = await prisma.journeyProgress.findFirst({
        where: { userId: senderId, matchId: conversation.matchId },
        select: { day: true },
      });
      if (!journey || !isPhotosAllowed(journey.day)) {
        const day = journey?.day ?? 0;
        return NextResponse.json(
          { error: `Bilder blir låst opp på dag 15 av reisen (nå: dag ${day}).` },
          { status: 423 }
        );
      }
    }

    // Bildet må knyttes til en melding for å kunne leses (signert URL) og slettes (GDPR).
    if (!messageId) {
      return NextResponse.json(
        { error: 'Mangler messageId' },
        { status: 400 }
      );
    }

    // Valider meldingen: finnes, type=image, eid av sender, og ingen bilde ennå (idempotens).
    const message = await prisma.message.findUnique({
      where: { id: messageId },
      select: { id: true, type: true, imageKey: true, senderId: true, conversationId: true },
    });

    if (!message || message.conversationId !== conversationId) {
      return NextResponse.json(
        { error: 'Meldingen finnes ikke i denne konversasjonen' },
        { status: 404 }
      );
    }
    if (message.senderId !== senderId) {
      return NextResponse.json(
        { error: 'Uautorisert — du kan ikke laste opp til denne meldingen' },
        { status: 403 }
      );
    }
    if (message.type !== 'image') {
      return NextResponse.json(
        { error: 'Meldingen er ikke av type bilde' },
        { status: 400 }
      );
    }
    if (message.imageKey) {
      return NextResponse.json(
        { error: 'Meldingen har allerede et bilde' },
        { status: 409 }
      );
    }

    // Bygg en trygg nøkkel: {conversationId}/{uuid}.{ext}
    const ext = EXT_MAP[file.type];
    const uuid = randomUUID();
    const key = assertSafeImageKey(buildImageKey(conversationId, uuid, ext));

    // Konverter File til Buffer og lagrar i objektlagringen.
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const storage = getImageStorage();
    await storage.putImage(key, buffer, { contentType: file.type });

    // Knytt nøkkelen til meldingen.
    await prisma.message.update({
      where: { id: messageId },
      data: { imageKey: key },
    });

    // Returnerer URL-en til side-ruta — aldri en direkte filsti.
    const imageUrl = `/api/chat/image/${messageId}`;

    return NextResponse.json({
      success: true,
      imageUrl,
      size: file.size,
      type: file.type,
    });

  } catch (error) {
    console.error('[chat/image] Feil ved opplastning:', error);
    return NextResponse.json(
      { error: 'Kunne ikke lagre bilete', details: (error as Error).message },
      { status: 500 }
    );
  }
}

export const POST = withMetrics('/api/chat/image', postHandler);
