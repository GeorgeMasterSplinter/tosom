/**
 * ToSom — Match Score API
 * POST /api/match/score — berekn match-score
 */

import { NextRequest, NextResponse } from 'next/server';
import { calculateMatchScores, calculateMatchStrength, calculateFuturePotential, getMatchVisual } from '@/lib/match/score';
import { requireAuth } from '@/lib/auth/requireAuth';
import { matchScoreSchema, validateWithZod } from '@/lib/validation/api';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // Auth-sjekk
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) {
      return auth;
    }

    // Input-validering
    const validated = validateWithZod(matchScoreSchema, await req.json());
    if ('error' in validated) {
      return NextResponse.json({ error: validated.error, code: validated.code }, { status: 400 });
    }
    const body = validated.data;

    const scores = calculateMatchScores({
      mutualDepth: body.mutualDepth,
      resonanceScore: body.resonanceScore,
      warmScore: body.warmScore,
      phaseOrder: body.phaseOrder,
      daysTogether: body.daysTogether,
      messageCount: body.messageCount,
      sharedValues: body.sharedValues,
      communicationStyle: body.communicationStyle,
      lifeStage: body.lifeStage,
      reflectionMatch: body.reflectionMatch,
    });

    const strength = calculateMatchStrength(scores.matchStrength);
    const potential = calculateFuturePotential(scores.futurePotential);
    const visual = getMatchVisual(scores.matchScore);

    return NextResponse.json({
      success: true,
      data: { scores, strength, potential, visual },
    }, { status: 200 });
  } catch (err) {
    console.error('Match score-feil:', err);
    return NextResponse.json({ error: 'Kunne ikkje berekne match score', code: 'INTERNAL_ERROR' }, { status: 500 });
  }
}