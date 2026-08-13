/**
 * ToSom — Delete Account Endpoint (STEG 8.4)
 * 
 * DELETE /api/settings/delete-account
 * GDPR-kompatibel anonymisering av brukerens data.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from '@/lib/auth/session';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const DeleteSchema = z.object({
  confirmation: z.literal('DELETE'),
});

export async function DELETE(req: NextRequest) {
  try {
    // Krever autentisering
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Uautorisert' }, { status: 401 });
    }

    // Valider bekreftelse
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Mangler body' }, { status: 400 });
    }

    const parsed = DeleteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Ugyldig bekreftelse. Send { "confirmation": "DELETE" } i body.' },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    // Kjør anonymisering i transaksjon
    await prisma.$transaction(async (tx) => {
      // Slett profiler
      await tx.profile.deleteMany({ where: { userId } });

      // Slett alle meldinger
      await tx.message.deleteMany({ where: { senderId: userId } });

      // Slett varsler
      await tx.notification.deleteMany({ where: { userId } });

      // Slett reise-progres
      await tx.journeyProgress.deleteMany({ where: { userId } });

      // Marker matcher som 'expired' i stedet for å slette (beholder struktur)
      await tx.match.updateMany({
        where: { OR: [{ userAId: userId }, { userBId: userId }] },
        data: { status: 'expired' },
      });

      // Marker konversasjoner som avsluttet
      await tx.conversation.updateMany({
        where: { OR: [{ userAId: userId }, { userBId: userId }] },
        data: { endedAt: new Date() },
      });

      // Anonymiser bruker-data (GDPR sletting via anonymisering)
      await tx.user.update({
        where: { id: userId },
        data: {
          name: null,
          email: `anonymized-${Date.now()}@deleted.tosom.local`,
          phone: null,
          bannedAt: new Date(), // Blokkerer innlogging etter "sletting"
        },
      });
    });

    return NextResponse.json({ success: true, message: 'Konto slettet' });
  } catch (error) {
    console.error('[delete-account] Feil:', error);
    return NextResponse.json({ error: 'Kunne ikke slette konto' }, { status: 500 });
  }
}