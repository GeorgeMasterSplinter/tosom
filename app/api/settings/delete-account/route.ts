/**
 * ToSom — Account Deletion Endpoint (STEG 8.4)
 * 
 * DELETE /api/settings/delete-account
 * GDPR-kompatibel anonymisering av brukerens data.
 * Fjerner personopplysninger men beholder strukturelle data for drift/matching.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

/**
 * Anonymiserer brukerens data istedenfor hard sletting (GDPR-kompatibel).
 * Beholder DB-referanser men fjerner alle personknytbare opplysninger.
 */
async function anonymizeUser(userId: string) {
  return await prisma.$transaction(async (tx) => {
    // 1. Anonymiser brukerens profil-felter og sett bannedAt for å blokkere innlogging
    await tx.user.update({
      where: { id: userId },
      data: {
        name: null,
        email: '[ANONYMISERT]',
        phone: null,
        bannedAt: new Date(),
      },
    });

    // 2. Slett aktive matcher (status tilbake til 'expired' for begge parter)
    await tx.match.updateMany({
      where: {
        OR: [
          { userAId: userId },
          { userBId: userId },
        ],
      },
      data: { status: 'expired' },
    });

    // 3. Slett konversasjoner (arkiverer istedenfor hard-sletting)
    await tx.conversation.updateMany({
      where: {
        OR: [
          { userAId: userId },
          { userBId: userId },
        ],
      },
      data: { endedAt: new Date() },
    });

    // 4. Slett meldinger (anonymiser innholdet)
    await tx.message.updateMany({
      where: { senderId: userId },
      data: { content: '[ANONYMISERT]', type: 'system' },
    });

    // 5. Slett varsler
    await tx.notification.deleteMany({ where: { userId } });

    return { success: true };
  });
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Ikke autentisert' }, { status: 401 });
    }

    // Ekstra bekreftelse: krev at body inneholder "DELETE" som bevis
    const body = await req.json().catch(() => ({}));
    if (body?.confirmation !== 'DELETE') {
      return NextResponse.json(
        { error: 'Ugyldig bekreftelse. Send { "confirmation": "DELETE" } i body.' },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    // Utfør anonymisering
    await anonymizeUser(userId);

    return NextResponse.json(
      { message: 'Kontoen din er slettet. Alle persondata er anonymisert.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[delete-account] Feil:', error);
    return NextResponse.json({ error: 'Kunne ikke slette konto' }, { status: 500 });
  }
}