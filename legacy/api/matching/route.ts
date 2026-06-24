/**
 * ToSom -- Matching API
 * 
 * POST /api/matching
 * - Hent bruker sin eigen profil
 * - Hent andre brukarar med fullt profil
 * - Køyrs matching-algoritmen
 * - Lagre matcher i Prisma
 * - Returner liste sortert etter score
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/nextauth';
import { matchingEngine, ProfileData, MatchTier } from '@/lib/matching';

/* ------ Hjælp: Session-validering ------ */

async function validateSession(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { userId: null, error: 'Ikke autentisert. Logg inn først.' };
  }
  return { userId: session.user.id, error: null };
}

/* ------ GET: Hent eksisterande matcher ------ */

export async function GET(request: NextRequest) {
  try {
    // Bruk session — ikkje query param
    const { userId, error } = await validateSession(request);
    if (error) {
      return NextResponse.json({ error }, { status: 401 });
    }

    // Hent eksisterande matcher for brukaren
    const existingMatches = await prisma.match.findMany({
      where: {
        OR: [
          { userAId: userId as string },
          { userBId: userId as string },
        ],
      },
      include: {
        userA: {
          select: {
            id: true,
            email: true,
            deepProfileComplete: true,
          },
        },
        userB: {
          select: {
            id: true,
            email: true,
            deepProfileComplete: true,
          },
        },
      },
      orderBy: {
        score: 'desc',
      },
    });

    // Formater matcher for UI
    const formattedMatches = existingMatches.map((match) => {
      // Finn den andre brukaren (include gir oss relaterte brukarar)
      const otherUser = match.userAId === userId
        ? (existingMatches.find(m => m.id === match.id)?.userB)
        : (existingMatches.find(m => m.id === match.id)?.userA);
      const otherUserId = match.userAId === userId ? match.userBId : match.userAId;

      if (!otherUser) return null;

      return {
        id: match.id,
        score: match.score,
        type: match.type,
        explanation: match.explanation as Record<string, unknown> | null,
        otherUserId,
        otherUserEmail: otherUser.email,
        otherUserProfileComplete: otherUser.deepProfileComplete,
      };
    }).filter((m): m is NonNullable<typeof m> => m !== null);

    return NextResponse.json({ matches: formattedMatches });
  } catch (error) {
    console.error('GET /api/matching feil:', error);
    return NextResponse.json({ error: 'Kunne ikkje hente matcher' }, { status: 500 });
  }
}

/* ------ POST: Køyrs matching ------ */

export async function POST(request: NextRequest) {
  try {
    // Bruk session — ikkje body.userId
    const { userId, error } = await validateSession(request);
    if (error) {
      return NextResponse.json({ error }, { status: 401 });
    }

    // Valider at brukaren har ein profil
    const requestingUser = await prisma.user.findUnique({
      where: { id: userId as string },
      include: { profile: true },
    }) as any;

    if (!requestingUser) {
      return NextResponse.json({ error: 'Brukar ikkje funnen' }, { status: 404 });
    }

    // Hent alle andre brukarar med full profil (eksklusive den innlogga)
    const otherUsers = await prisma.user.findMany({
      where: {
        id: { not: userId as string },
        onboardingComplete: true,
        deepProfileComplete: true,
        bannedAt: null,
        deletedAt: null,
      },
      include: { profile: true },
    }) as any;

    if (otherUsers.length === 0) {
      return NextResponse.json({ matches: [], message: 'Ingen andre brukarar til match no' });
    }

    const requestProfile = requestingUser?.profile as Record<string, unknown>;

    // Køyrs matching for kvar bruker
    const potentialMatches: Array<{
      otherUserId: string;
      otherUserName: string | null;
      otherUserAge: number | null;
      otherUserPhotoUrl: string | null;
      score: number;
      type: string;
      explanation: Record<string, unknown> | null;
    }> = [];

    for (const otherUser of otherUsers) {
      const otherProfile = (otherUser as any).profile;
      if (!otherProfile) continue;

      // Konverter til ProfileData format for den nye matchingEngine
      const profileA: ProfileData = {
        userId: userId as string,
        firstName: (requestProfile.firstName as string | null),
        lastName: (requestProfile.lastName as string | null),
        age: (requestProfile.age as number | null),
        bio: (requestProfile.bio as string | null),
        interests: (requestProfile.interests as string[]) || [],
        lifeSituation: (requestProfile.lifeSituation as Record<string, unknown>) || null,
        lifestyle: (requestProfile.lifestyle as Record<string, unknown>) || null,
        personality: (requestProfile.personality as Record<string, unknown>) || null,
        relationshipStyle: (requestProfile.relationshipStyle as string | null),
        communication: (requestProfile.communication as Record<string, unknown>) || null,
        intimacy: (requestProfile.intimacy as Record<string, unknown>) || null,
        futureVision: (requestProfile.futureVision as Record<string, unknown>) || null,
        boundaries: (requestProfile.boundaries as Record<string, unknown>) || null,
        emotionalNeeds: (requestProfile.emotionalNeeds as Record<string, unknown>) || null,
        lifeRhythm: (requestProfile.lifeRhythm as string | null),
        maturityLevel: (requestProfile.maturityLevel as number | null),
        securityLevel: (requestProfile.securityLevel as string | null),
        preferences: (requestProfile.preferences as Record<string, unknown>) || null,
        matchTags: (requestProfile.matchTags as string[]) || [],
      };

      const profileB: ProfileData = {
        userId: otherUser.id,
        firstName: (otherProfile.firstName as string | null),
        lastName: (otherProfile.lastName as string | null),
        age: (otherProfile.age as number | null),
        bio: (otherProfile.bio as string | null),
        interests: (otherProfile.interests as string[]) || [],
        lifeSituation: (otherProfile.lifeSituation as Record<string, unknown>) || null,
        lifestyle: (otherProfile.lifestyle as Record<string, unknown>) || null,
        personality: (otherProfile.personality as Record<string, unknown>) || null,
        relationshipStyle: (otherProfile.relationshipStyle as string | null),
        communication: (otherProfile.communication as Record<string, unknown>) || null,
        intimacy: (otherProfile.intimacy as Record<string, unknown>) || null,
        futureVision: (otherProfile.futureVision as Record<string, unknown>) || null,
        boundaries: (otherProfile.boundaries as Record<string, unknown>) || null,
        emotionalNeeds: (otherProfile.emotionalNeeds as Record<string, unknown>) || null,
        lifeRhythm: (otherProfile.lifeRhythm as string | null),
        maturityLevel: (otherProfile.maturityLevel as number | null),
        securityLevel: (otherProfile.securityLevel as string | null),
        preferences: (otherProfile.preferences as Record<string, unknown>) || null,
        matchTags: (otherProfile.matchTags as string[]) || [],
      };

      // Bruk den nye matchingEngine
      const result = matchingEngine(profileA, profileB);

      // Map MatchTier til matchType
      const matchTypeMap: Record<MatchTier, string> = {
        deepResonance: 'deep',
        strongResonance: 'strong',
        moderateResonance: 'moderate',
        gentleResonance: 'gentle',
        weakResonance: 'low',
      };

      potentialMatches.push({
        otherUserId: otherUser.id,
        otherUserName: (otherProfile.identityName as string | null),
        otherUserAge: (otherProfile.age as number | null),
        otherUserPhotoUrl: (otherProfile.photoUrl as string | null),
        score: Math.round(result.score * 100), // 0-100 for lagring
        type: matchTypeMap[result.tier],
        explanation: { breakdown: result.breakdown, tier: result.tier, rejected: result.rejected, rejectionReason: result.rejectionReason },
      });
    }

    // Sorter etter score (høgast først)
    potentialMatches.sort((a, b) => b.score - a.score);

    // Hent beste match (top 1) og lagre
    let bestMatch: Awaited<ReturnType<typeof prisma.match.create>> | null = null;
    if (potentialMatches.length > 0) {
      const topMatch = potentialMatches[0];

      // Sjekk at brukaren ikkje allereie er låst
      const now = new Date();
      const lockedUntil = requestingUser.lockedUntil;
      if (lockedUntil && lockedUntil > now) {
        return NextResponse.json({
          matches: [],
          lockedUntil: lockedUntil.toISOString(),
          message: 'Du er låst til ein aktiv match no',
        });
      }

      // Finn den andre brukaren sin profil-data for lagring
      const targetUser = otherUsers.find((u) => u.id === topMatch.otherUserId);
      const targetProfile = targetUser?.profile;

      // Lagre match i databasen — userA er alltid den som køyrde matching
      bestMatch = await prisma.match.create({
        data: {
          userAId: userId as string,
          userBId: topMatch.otherUserId as string,
        score: topMatch.score,
        normalizedScore: topMatch.score / 100,
        type: topMatch.type,
          explanation: JSON.parse(JSON.stringify(topMatch.explanation ?? {})),
        },
      });
    }

    // Returner alle potensielle matcher
    const result = potentialMatches.map((m) => {
      const bm = bestMatch;
      return {
        ...m,
        matchId: bm?.id,
        isTopMatch: bm && (m.otherUserId === bm.userAId || m.otherUserId === bm.userBId),
      };
    });

    return NextResponse.json({
      matches: result,
      topMatch: bestMatch ? {
        id: bestMatch.id,
        score: bestMatch.score,
        type: bestMatch.type,
        otherUserId: bestMatch.userAId === userId ? bestMatch.userBId : bestMatch.userAId,
      } : null,
      totalCandidates: otherUsers.length,
    });
  } catch (error) {
    console.error('POST /api/matching feil:', error);
    return NextResponse.json({ error: 'Kunne ikkje køyre matching' }, { status: 500 });
  }
}