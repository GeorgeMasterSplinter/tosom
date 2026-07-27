/**
 * ToSom — Resonans Motor API
 * 
 * POST /api/journey/resonance — berekn resonans
 * GET  /api/journey/resonance?conversationId=X — hent siste
 */

import { NextRequest, NextResponse } from 'next/server';
import { calculateResonance, createResonanceSnapshot } from '@/lib/journey/engine';
import { requireAuth } from '@/lib/auth/requireAuth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // Auth-sjekk
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) {
      return auth;
    }

    const body = await req.json();
    const {
      conversationId,
      userId,
      partnerId,
      messageCount = 0,
      responseTimeAvg = 30,
      longestStreak = 0,
      phaseOrder = 1,
      daysTogether = 1,
      mutualDepth = 50,
      reflectionCount = 0,
      taskCompletion = 0,
    } = body;

    if (!conversationId) {
      return NextResponse.json({ error: 'Manglar conversationId' }, { status: 400 });
    }

    const scores = calculateResonance({
      conversationId, userId, partnerId, messageCount, responseTimeAvg,
      longestStreak, phaseOrder, daysTogether, mutualDepth, reflectionCount, taskCompletion,
    });

    const snapshot = createResonanceSnapshot(
      { conversationId, userId, partnerId, messageCount, responseTimeAvg, longestStreak, phaseOrder, daysTogether, mutualDepth, reflectionCount, taskCompletion },
      scores
    );

    // TODO: Lagre til DB — await prisma.resonanceSnapshot.create({ data: snapshot });

    return NextResponse.json({ success: true, scores, snapshot, resonance: scores.resonance });
  } catch (err) {
    console.error('Resonans-feil:', err);
    return NextResponse.json({ error: 'Kunne ikkje berekne resonans' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    // Auth-sjekk
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) {
      return auth;
    }

    const url = new URL(req.url);
    const conversationId = url.searchParams.get('conversationId');

    if (!conversationId) return NextResponse.json({ error: 'Manglar conversationId' }, { status: 400 });

    // TODO: Hent frå DB — await prisma.resonanceSnapshot.findFirst({ where: { conversationId } });

    return NextResponse.json({ success: true, scores: null, message: 'Ingen resonans-data funnen.' });
  } catch (err) {
    console.error('Resonance GET-feil:', err);
    return NextResponse.json({ error: 'Kunne ikkje hente resonans' }, { status: 500 });
  }
}
