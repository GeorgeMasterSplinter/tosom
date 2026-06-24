/**
 * ToSom — Accept/Decline match
 * 
 * POST /api/matching/accept
 * - Brukar godtek eller avsloer ein match
 * - Oppdaterar prisma.match.status
 * - Hvis accept: låser brukar i 30 dagar
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/nextauth';

async function validateSession(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { userId: null, error: 'Ikke autentisert' };
  }
  return { userId: session.user.id, error: null };
}

export async function POST(req: NextRequest) {
  try {
    const { userId, error } = await validateSession(req);
    if (error) return NextResponse.json({ error }, { status: 401 });

    const body = await req.json();
    const matchId = body.matchId as string;
    const action = body.action as 'accept' | 'decline';

    if (!matchId || !action) {
      return NextResponse.json({ error: 'Manglande matchId eller action' }, { status: 400 });
    }

    // Finn match
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        userA: { select: { id: true, email: true } },
        userB: { select: { id: true, email: true } },
      },
    });

    if (!match) {
      return NextResponse.json({ error: 'Match ikkje funnen' }, { status: 404 });
    }

    // Sjekk at brukaren er involvert
    if (match.userAId !== userId && match.userBId !== userId) {
      return NextResponse.json({ error: 'Du er ikkje involvert i denne matchen' }, { status: 403 });
    }

    if (action === 'accept') {
      // Sjekk om allereie akseptert av begge
      const userAaccepted = match.acceptedByA !== null;
      const userBAccepted = match.acceptedByB !== null;

      if (userAaccepted && userBAccepted) {
        return NextResponse.json({ error: 'Matchen er allereie akseptert av begge' }, { status: 400 });
      }

      // Oppdater accepted
      const otherUserId = match.userAId === userId ? match.userBId : match.userAId;
      const acceptedByOther = otherUserId === match.userAId ? userAaccepted : userBAccepted;

      await prisma.match.update({
        where: { id: matchId },
        data: {
          acceptedByA: userId === match.userAId ? new Date() : match.acceptedByA,
          acceptedByB: userId === match.userBId ? new Date() : match.acceptedByB,
          status: acceptedByOther ? 'matched' : 'active',
          // Lås i 30 dagar hvis begge har akseptert
          lockedAt: acceptedByOther ? new Date() : match.lockedAt,
          expiresAt: acceptedByOther ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : match.expiresAt,
        },
      });

      // Lås brukaren hvis begge har akseptert
      if (acceptedByOther) {
        await prisma.user.updateMany({
          where: {
            id: { in: [match.userAId, match.userBId] },
          },
          data: {
            lockedUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            lastMatchAt: new Date(),
          },
        });
      }

      return NextResponse.json({
        ok: true,
        message: 'Match akseptert! 🎉 Dere er no låste saman i 30 dagar.',
        status: acceptedByOther ? 'matched' : 'active',
      });
    }

    if (action === 'decline') {
      await prisma.match.update({
        where: { id: matchId },
        data: {
          status: 'unmatched',
          expiresAt: new Date(),
        },
      });

      return NextResponse.json({
        ok: true,
        message: 'Match avslått.',
      });
    }

    return NextResponse.json({ error: 'Ugyldig action' }, { status: 400 });
  } catch (err) {
    console.error('Matching accept/decline feil:', err);
    return NextResponse.json({ error: 'Kunne ikkje handtere match' }, { status: 500 });
  }
}