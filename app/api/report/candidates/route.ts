/**
 * GET /api/report/candidates — PL-15 (V-5)
 *
 * Gir ID og fornavn på brukerens tidligere matcher (fra MatchHistory),
 * slik at «Rapporter» i innstillinger virker også uten aktiv match.
 * Ingen andre felt ut.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth/requireAuth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const result = await requireAuth(req);
    if (result instanceof NextResponse) return result;
    const user = result.user;

    const history = await prisma.matchHistory.findMany({
      where: {
        OR: [{ userAId: user.id }, { userBId: user.id }],
      },
      orderBy: { endedAt: 'desc' },
      take: 50,
    });

    const partnerIds = history.map((h) =>
      h.userAId === user.id ? h.userBId : h.userAId
    );
    const partners = partnerIds.length
      ? await prisma.user.findMany({
          where: { id: { in: partnerIds } },
          select: { id: true, name: true },
        })
      : [];
    const partnerById = new Map(partners.map((p) => [p.id, p]));

    const candidates = history
      .map((h) => {
        const partnerId = h.userAId === user.id ? h.userBId : h.userAId;
        return {
          id: partnerId,
          firstName: partnerById.get(partnerId)?.name ?? 'Ukjent',
        };
      })
      // Utostrerte kontoer skal ikke kunne rapporteres
      .filter((c) => c.id !== user.id);

    return NextResponse.json({ candidates });
  } catch (error) {
    console.error('GET /api/report/candidates feil:', error);
    return NextResponse.json({ error: 'Kunne ikke hente kandidater' }, { status: 500 });
  }
}