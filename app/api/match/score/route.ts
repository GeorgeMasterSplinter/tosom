/**
 * ToSom — Match Score API
 * POST /api/match/score — berekn match-score
 */

import { NextRequest, NextResponse } from 'next/server';
import { calculateMatchScores, calculateMatchStrength, calculateFuturePotential, getMatchVisual } from '@/lib/match/score';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      mutualDepth = 50,
      resonanceScore = 0,
      warmScore = 0,
      phaseOrder = 1,
      daysTogether = 1,
      messageCount = 0,
      sharedValues = 50,
      communicationStyle = 50,
      lifeStage = 50,
      reflectionMatch = 50,
    } = body;

    const scores = calculateMatchScores({
      mutualDepth, resonanceScore, warmScore, phaseOrder, daysTogether,
      messageCount, sharedValues, communicationStyle, lifeStage, reflectionMatch,
    });

    const strength = calculateMatchStrength(scores.matchStrength);
    const potential = calculateFuturePotential(scores.futurePotential);
    const visual = getMatchVisual(scores.matchScore);

    return NextResponse.json({
      success: true,
      scores,
      strength,
      potential,
      visual,
    });
  } catch (err) {
    console.error('Match score-feil:', err);
    return NextResponse.json({ error: 'Kunne ikkje berekne match score' }, { status: 500 });
  }
}