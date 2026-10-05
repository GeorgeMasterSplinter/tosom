/**
 * Tosom — Delete Account (STEG C5)
 *
 * DELETE /api/settings/delete-account
 * GDPR art. 17 (rett til sletting).
 *
 * Sletterekkefølge:
 * 1. Hvis aktiv match → kall endJourney(matchId, 'early_exit') direkte først
 * 2. Slett alle samtaler der brukeren er deltaker (FK-rekkefølge:
 *    message, journeyStateLog, resonanceSession, gameSession, conversation)
 * 3. Slett Profile, Notification, JourneyProgress, Match, sessioner
 * 4. MatchHistory, Report og UserBlock beholdes (ingen fremmednøkkel — overlever).
 *    AuditLog beholdes med SetNull på adminId (revisjonshensyn)
 * 5. Slett User-radet helt
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from '@/lib/auth/session';
import { z } from 'zod';
import { csrfCheck } from '@/lib/auth/csrf';
import { sendDeletionConfirmationEmail } from '@/lib/email';
import { endJourney } from '@/lib/journey/endJourney';

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

    // Lagre e-post + navn FØR sletting (trengs for bekreftelse)
    const userRecord = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true },
    });
    const userEmail = userRecord?.email || '';
    const userName = userRecord?.name || undefined;

    // 3. Finn aktiv match og kall endJourney direkte.
    // (Internt HTTP-kall til /api/journey/exit feilet stille på CSRF —
    //  direkte kall sikrer at samtalen slettes og MatchHistory settes.)
    const activeMatch = await prisma.match.findFirst({
      where: { status: 'active', OR: [{ userAId: userId }, { userBId: userId }] },
      select: { id: true },
    });

    if (activeMatch) {
      await endJourney(activeMatch.id, 'early_exit');
      console.log(`[delete-account] endJourney kalt for ${userId}`);
    }

    // 4. Slett alt bruker-data i transaksjon
    await prisma.$transaction(async (tx) => {
      // Slett alle samtaler der brukeren er deltaker. Conversation har ingen
      // cascade fra User — barnradene må slettes først, ellers feiler
      // user.delete() på fremmednøkkelen.
      const conversations = await tx.conversation.findMany({
        where: { OR: [{ userAId: userId }, { userBId: userId }] },
        select: { id: true },
      });
      const conversationIds = conversations.map((c) => c.id);
      if (conversationIds.length > 0) {
        // Meldinger fra begge parter — samtalen er borte, så forsvinner innholdet
        await tx.message.deleteMany({ where: { conversationId: { in: conversationIds } } });
        await tx.journeyStateLog.deleteMany({ where: { conversationId: { in: conversationIds } } });
        await tx.resonanceSession.deleteMany({ where: { conversationId: { in: conversationIds } } });
        await tx.gameSession.deleteMany({ where: { conversationId: { in: conversationIds } } });
        await tx.conversation.deleteMany({ where: { id: { in: conversationIds } } });
      }

      // Slett profil
      await tx.profile.deleteMany({ where: { userId } });

      // Slett varsler
      await tx.notification.deleteMany({ where: { userId } });

      // Slett journey-progress (endJourney har slettet dem for aktiv match — vakt)
      await tx.journeyProgress.deleteMany({ where: { userId } });

      // Slett matcher (MatchHistory beholdes!)
      await tx.match.deleteMany({
        where: { OR: [{ userAId: userId }, { userBId: userId }] },
      });

      // Slett sessions og accounts
      await tx.session.deleteMany({ where: { userId } });
      await tx.account.deleteMany({ where: { userId } });
      await tx.twoFactorSecret.deleteMany({ where: { userId } });
      await tx.passwordResetToken.deleteMany({ where: { userId } });

      // Slett User-radet helt (GDPR art. 17).
      // MatchHistory, Report og UserBlock overlever (ingen fremmednøkkel);
      // AuditLog nuller ut adminId (SetNull).
      await tx.user.delete({ where: { id: userId } });
    });

    console.log(`[delete-account] Bruker ${userId} slettet fullstendig`);

    // Send sletting-bekreftelse (best-effort — skal aldri blokkere)
    if (userEmail) {
      sendDeletionConfirmationEmail(userEmail, userName).catch(() => {});
    }

    return NextResponse.json({ success: true, message: 'Konto og alle data slettet' });
  } catch (error) {
    console.error('[delete-account] Feil:', error);
    return NextResponse.json({ error: 'Kunne ikke slette konto' }, { status: 500 });
  }
}

// L6: Frontenden sender POST til denne rotet — legg til POST-alias
// slik at både POST og DELETE fungerer (DELETE er den semantisk rette).
export const POST = DELETE;