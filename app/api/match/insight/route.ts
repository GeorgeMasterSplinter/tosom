/**
 * ToSom — Match Insight API
 * 
 * GET /api/match/insight?matchId=xxx
 * 
 * Returner AI-innsikt for ein match.
 * - Session-vern
 * - 403 hvis bruker ikkje eier matchen
 * - 404 hvis match ikkje finst
 * - Caching via MatchInsight-tabellen
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';
import { generateMatchInsight, type MatchInsightInput, type MatchInsightOutput } from '@/lib/ai/matchInsight';

export const dynamic = 'force-dynamic';

/* ====== GET: Hent eller generer innsikt ====== */

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const matchId = searchParams.get('matchId');

  if (!matchId) {
    return NextResponse.json({ error: 'matchId er påkreva' }, { status: 400 });
  }

  // Auth
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Ugyldig sesjon' }, { status: 401 });
  }

  const userId = session.user.id;

  // Hent match med begge brukarar og profiler
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: {
      userA: {
        include: { profile: true },
      },
      userB: {
        include: { profile: true },
      },
    },
  });

  if (!match) {
    return NextResponse.json({ error: 'Match ikkje funnen' }, { status: 404 });
  }

  // Sjekk at brukaren er ein av partane
  if (match.userAId !== userId && match.userBId !== userId) {
    return NextResponse.json({ error: 'Du har ikkje tilgang til denne matchen' }, { status: 403 });
  }

  // Profil-data
  const profileA = match.userA.profile;
  const profileB = match.userB.profile;

  if (!profileA || !profileB) {
    return NextResponse.json({ error: 'Manglande profil' }, { status: 400 });
  }

  // Sjekk om cached innsikt finst (lder enn 6 timar)
  const CACHE_HOURS = 6;
  const cacheCutoff = new Date(Date.now() - CACHE_HOURS * 60 * 60 * 1000);

  const cached = await prisma.matchInsight.findUnique({
    where: { matchId },
  });

  if (cached && cached.createdAt >= cacheCutoff) {
    return NextResponse.json({
      summary: cached.summary,
      strengths: cached.strengths,
      clarity: cached.clarity,
      starter: cached.starter,
      source: 'cache',
    });
  }

  // Bygg input til AI-motor
  const insightInput: MatchInsightInput = {
    score: match.score,
    resonanceLevel: match.resonanceLevel,
    explanationScores: (match.explanation as any)?._scores || {},
    profileA: {
      identityName: (profileA.identityName as string | null),
      age: (profileA.age as number | null),
      relationshipStyle: (profileA.relationshipStyle as string | null),
      communication: (profileA.communication as Record<string, unknown>) || {},
      personality: (profileA.personality as Record<string, unknown>) || {},
      values: {
        futureVision: (profileA.futureVision as Record<string, unknown>) || {},
        emotionalNeeds: (profileA.emotionalNeeds as Record<string, unknown>) || {},
      },
      lifestyle: (profileA.lifestyle as Record<string, unknown>) || {},
      boundaries: (profileA.boundaries as Record<string, unknown>) || {},
      maturityLevel: (profileA.maturityLevel as number | null),
      intimacy: (profileA.intimacy as Record<string, unknown>) || {},
    },
    profileB: {
      identityName: (profileB.identityName as string | null),
      age: (profileB.age as number | null),
      relationshipStyle: (profileB.relationshipStyle as string | null),
      communication: (profileB.communication as Record<string, unknown>) || {},
      personality: (profileB.personality as Record<string, unknown>) || {},
      values: {
        futureVision: (profileB.futureVision as Record<string, unknown>) || {},
        emotionalNeeds: (profileB.emotionalNeeds as Record<string, unknown>) || {},
      },
      lifestyle: (profileB.lifestyle as Record<string, unknown>) || {},
      boundaries: (profileB.boundaries as Record<string, unknown>) || {},
      maturityLevel: (profileB.maturityLevel as number | null),
      intimacy: (profileB.intimacy as Record<string, unknown>) || {},
    },
  };

  let insight: MatchInsightOutput;
  let model: string | null = null;

  try {
    insight = await generateMatchInsight(insightInput);
  } catch (err) {
    console.error('[MatchInsight] Generation failed:', err);
    insight = {
      summary: 'Ein roleg, varm start — som å merka at noko byrjar å stemme.',
      strengths: 'Dere har felles interesser og verdier som gjer at dere kan finn fram til kvarandre på ein naturlig måte.',
      clarity: 'Ta deg tid til å vera nysgjerrig. Dei beste sambanda byggst sakte.',
      starter: 'Kva gir deg mest energi i kvardagen?',
    };
    model = 'fallback';
  }

  // Lagre i cache (overskrive eksisterande)
  try {
    await prisma.matchInsight.upsert({
      where: { matchId },
      create: {
        matchId,
        summary: insight.summary,
        strengths: insight.strengths,
        clarity: insight.clarity,
        starter: insight.starter,
        model,
        tokensOut: 0,
      },
      update: {
        summary: insight.summary,
        strengths: insight.strengths,
        clarity: insight.clarity,
        starter: insight.starter,
        model,
        tokensOut: 0,
      },
    });
  } catch (err) {
    console.error('[MatchInsight] Cache save failed:', err);
    // Ikke feil på cache
  }

  return NextResponse.json({
    summary: insight.summary,
    strengths: insight.strengths,
    clarity: insight.clarity,
    starter: insight.starter,
    source: 'ai',
  });
}