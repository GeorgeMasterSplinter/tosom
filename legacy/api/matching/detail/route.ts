/**
 * ToSom -- Match Detail API
 * 
 * GET /api/matching/detail?id=matchId
 * Returner full match med brukarar og forklaring.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const matchId = searchParams.get('id');

    if (!matchId) {
      return NextResponse.json({ error: 'matchId er påkreva' }, { status: 400 });
    }

    // Hent match med alle relasjonar
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        userA: {
          include: {
            profile: true,
          },
        },
        userB: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!match) {
      return NextResponse.json({ error: 'Match ikkje funnen' }, { status: 404 });
    }

    // Hent profil-data for begge
    const profileA = match.userA.profile;
    const profileB = match.userB.profile;

    if (!profileA || !profileB) {
      return NextResponse.json({ error: 'Manglande profil' }, { status: 400 });
    }

    // Formater svar — legg til _scores for sterkaste område
    const expl = (match.explanation as any) || {};
    const scores = expl._scores || {};
    const explanationWithScores = {
      ...expl,
      _scores: scores,
    };

    const response = {
      id: match.id,
      score: match.score,
      type: match.type,
      status: match.status,
      explanation: explanationWithScores,
      resonanceLevel: match.resonanceLevel,
      createdAt: match.createdAt,
      userA: {
        id: match.userA.id,
        email: match.userA.email,
        name: (profileA.identityName as string | null) || (profileA.firstName as string | null) || 'Ukjend',
        age: (profileA.age as number | null),
        lifestyle: (profileA.lifestyle as Record<string, unknown>) || {},
        values: {
          futureVision: (profileA.futureVision as Record<string, unknown>) || {},
          emotionalNeeds: (profileA.emotionalNeeds as Record<string, unknown>) || {},
        },
        communication: (profileA.communication as Record<string, unknown>) || {},
        intimacy: (profileA.intimacy as Record<string, unknown>) || {},
        keywords: extractKeywords(profileA),
      },
      userB: {
        id: match.userB.id,
        email: match.userB.email,
        name: (profileB.identityName as string | null) || (profileB.firstName as string | null) || 'Ukjend',
        age: (profileB.age as number | null),
        lifestyle: (profileB.lifestyle as Record<string, unknown>) || {},
        values: {
          futureVision: (profileB.futureVision as Record<string, unknown>) || {},
          emotionalNeeds: (profileB.emotionalNeeds as Record<string, unknown>) || {},
        },
        communication: (profileB.communication as Record<string, unknown>) || {},
        intimacy: (profileB.intimacy as Record<string, unknown>) || {},
        keywords: extractKeywords(profileB),
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('GET /api/matching/detail feil:', error);
    return NextResponse.json({ error: 'Kunne ikkje hente match-detalar' }, { status: 500 });
  }
}

/**
 * Trekk nøkkelord frå profil.
 */
function extractKeywords(profile: any): string[] {
  const keywords: string[] = [];
  
  // Livsstil
  if (profile.lifestyle) {
    const l = profile.lifestyle as Record<string, unknown>;
    const keys = Object.keys(l);
    if (keys.length > 0) {
      keywords.push(keys.slice(0, 2).join(', '));
    }
  }
  
  // Verdier
  if (profile.futureVision) {
    const f = profile.futureVision as Record<string, unknown>;
    const keys = Object.keys(f);
    if (keys.length > 0) {
      keywords.push(keys[0]);
    }
  }
  
  // Kommunikasjon
  if (profile.communication) {
    const c = profile.communication as Record<string, unknown>;
    const keys = Object.keys(c);
    if (keys.length > 0) {
      keywords.push(keys[0]);
    }
  }
  
  return [...new Set(keywords)].slice(0, 3);
}