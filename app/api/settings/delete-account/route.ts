/**
 * Tosom — Delete Account (STEG C5)
 *
 * DELETE /api/settings/delete-account
 * GDPR art. 17 (rett til sletting).
 *
 * Sletterekkefølge:
 * 1. Hvis aktiv reise → kall endJourney(matchId, 'early_exit') først
 * 2. Slett Profile, Message, Notification, JourneyProgress
 * 3. MatchHistory beholdes (bare to ID-er, ingen innhold)
 * 4. AuditLog med admin-handlinger beholdes (revisjonshensyn)
 * 5. Slett User-radet helt
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from '@/lib/auth/session';
import { z } from 'zod';
import { csrfCheck } from '@/lib/auth/csrf';

export const dynamic = 'force-dynamic';

const DeleteSchema = z.object({
  confirmation: z.literal('DELETE'),
});

export async function DELETE(req: NextRequest) {
  try {
    // L6: CSRF-vern — konto-sletting er den kritiskaste skrive-aksjonen
    const csrf = await csrfCheck(req);
    if (csrf instanceof NextResponse) return csrf;

    // 1. Auth
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Uautorisert' }, { status: 401 });
    }

    // 2. Valider bekreftelse
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

    // 3. Finn aktiv reise og kall endJourney først
    const activeJourney = await prisma.journeyProgress.findFirst({
      where: { userId, endedAt: null },
      select: { matchId: true },
    });

    if (activeJourney?.matchId) {
      // Kall journey/exit-endepunktet for å slette samtalen og sette MatchHistory
      const exitRes = await fetch(
        `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/journey/exit`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Cookie: req.headers.get('cookie') || '',
          },
          body: JSON.stringify({ reason: 'account_deletion' }),
        }
      );
      if (exitRes.ok) {
        console.log(`[delete-account] endJourney kalt for ${userId}`);
      }
    }

    // 4. Slett alt bruker-data i transaksjon
    await prisma.$transaction(async (tx) => {
      // Slett profil
      await tx.profile.deleteMany({ where: { userId } });

      // Slett meldinger
      await tx.message.deleteMany({ where: { senderId: userId } });

      // Slett varsler
      await tx.notification.deleteMany({ where: { userId } });

      // Slett journey-progress (endJourney kan ha slettet dem allerede)
      await tx.journeyProgress.deleteMany({ where: { userId } });

      // Slett matcher (MatchHistory beholdes!)
      await tx.match.deleteMany({
        where: { OR: [{ userAId: userId }, { userBId: userId }] },
      });

      // Slett konversasjoner
      await tx.conversation.updateMany({
        where: { OR: [{ userAId: userId }, { userBId: userId }] },
        data: { endedAt: new Date() },
      });

      // Slett sessions og accounts
      await tx.session.deleteMany({ where: { userId } });
      await tx.account.deleteMany({ where: { userId } });
      await tx.twoFactorSecret.deleteMany({ where: { userId } });
      await tx.passwordResetToken.deleteMany({ where: { userId } });

      // C5: Slett User-radet helt (GDPR art. 17)
      await tx.user.delete({ where: { id: userId } });
    });

    console.log(`[delete-account] Bruker ${userId} slettet fullstendig`);

    return NextResponse.json({ success: true, message: 'Konto og alle data slettet' });
  } catch (error) {
    console.error('[delete-account] Feil:', error);
    return NextResponse.json({ error: 'Kunne ikke slette konto' }, { status: 500 });
  }
}

// L6: Frontenden sender POST til denne rotet — legg til POST-alias
// slik at både POST og DELETE fungerer (DELETE er den semantisk rette).
export const POST = DELETE;