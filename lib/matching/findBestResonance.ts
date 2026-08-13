/**
 * findBestResonance.ts — Finn den beste matchen basert på resonans
 *
 * Core-definition: Én match per 24 timer. Bare brukere som ikke er låst.
 * Ingen foto-basert matching. Ingen offentlige profiler.
 */

import { prisma } from "@/lib/prisma";
import { unifiedScore, UnifiedResult, MatchLevel } from "./unifiedScorer"; // EINTILT SCORING (Punkt 4)

/** ResonanceResult-type for backwards-kompatibilitet */
interface ResonanceResult {
  resonanceScore: number;
  breakdown: UnifiedResult['breakdown'];
  resonanceLevel: MatchLevel;
}

export interface FindBestResonanceOptions {
  userId: string;
  minResonance?: number; // minimum resonans for å bli vurdert (0-100)
}

export interface BestResonanceMatch {
  match: ResonanceResult; // Bruker lokal interface (se over) for backwards-kompatibilitet
  candidate: {
    id: string;
    email: string;
    profile: {
      id: string;
      identityName: string | null;
      age: number | null;
      lifeSituation: unknown;
      personality: unknown;
      relationshipStyle: string | null;
      communication: unknown;
      intimacy: unknown;
      futureVision: unknown;
      boundaries: unknown;
      emotionalNeeds: unknown;
      lifeRhythm: string | null;
      maturityLevel: number | null;
      securityLevel: string | null;
    } | null;
  };
  candidateId: string;
  nextAvailableAt: Date; // når neste match er tilgjengelig
}

/**
 * Sjekker om en bruker er klar for å bli matchet:
 * - Onboarding må være fullført
 * - Ingen aktiv 30d-lås
 * - 24t har passert siden siste match
 */
async function isUserMatchable(userId: string): Promise<{
  matchable: boolean;
  reason?: string;
  nextAvailableAt?: Date;
}> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      onboardingComplete: true,
      deepProfileComplete: true,
      lastMatchAt: true,
      lockedUntil: true,
      bannedAt: true,
      deletedAt: true,
    },
  });

  if (!user) {
    return { matchable: false, reason: "User not found" };
  }

  if (!user.onboardingComplete || !user.deepProfileComplete) {
    return { matchable: false, reason: "Onboarding not complete" };
  }

  if (user.bannedAt) {
    return { matchable: false, reason: "User is banned" };
  }

  if (user.deletedAt) {
    return { matchable: false, reason: "User is deleted" };
  }

  // Sjekk 30d-lås
  if (user.lockedUntil) {
    const now = new Date();
    if (now < user.lockedUntil) {
      return {
        matchable: false,
        reason: "User is locked in a 30-day journey",
        nextAvailableAt: user.lockedUntil,
      };
    }
    // Låsen har utløpt — sjekk om de har avsluttet matchen
    const activeMatch = await prisma.match.findFirst({
      where: {
        OR: [
          { userAId: userId, status: "matched" },
          { userBId: userId, status: "matched" },
        ],
      },
    });

    if (!activeMatch) {
      // Ingen aktiv match etter lås — lås opp
      await prisma.user.update({
        where: { id: userId },
        data: { lockedUntil: null },
      });
    }
  }

  // Sjekk 24t-regel
  if (user.lastMatchAt) {
    const hoursSinceMatch = (Date.now() - user.lastMatchAt.getTime()) / (1000 * 60 * 60);
    if (hoursSinceMatch < 24) {
      const nextAvailableAt = new Date(user.lastMatchAt.getTime() + 24 * 60 * 60 * 1000);
      return {
        matchable: false,
        reason: "User must wait 24 hours between matches",
        nextAvailableAt,
      };
    }
  }

  return { matchable: true };
}

/**
 * Finn den beste matchen for en bruker basert på resonans.
 * Returnerer én match — den med høyest resonans.
 */
export async function findBestResonance(
  options: FindBestResonanceOptions
): Promise<BestResonanceMatch | null> {
  const { userId, minResonance = 0 } = options;

  // 1. Sjekk om bruker er matchbar
  const matchable = await isUserMatchable(userId);
  if (!matchable.matchable) {
    return null;
  }

  // 2. Hent brukerens dype profil
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
    },
  });

  if (!user || !user.profile) {
    return null;
  }

  // 3. Finn potensielle match-kandidater
  // Ekskluder: selv, allerede i aktiv match, ikke-matchbare
  const excludedMatches = await prisma.match.findMany({
    where: {
      OR: [
        { userAId: userId },
        { userBId: userId },
      ],
      status: {
        // STEG 6.5: Ekskluder også unmatched+ended+expired for å hindre re-matching av fullførte/avviste par
        in: ["matched", "active", "unmatched", "ended", "expired"],
      },
    },
    select: {
      userAId: true,
      userBId: true,
    },
  });

  const excludedIds = new Set(excludedMatches.flatMap(m => [m.userAId, m.userBId]));
  excludedIds.add(userId); // ekskluder selv

  // Finn kandidater som ikke er låste og ikke allerede matchet
  const candidates = await prisma.user.findMany({
    where: {
      id: {
        notIn: Array.from(excludedIds),
      },
      onboardingComplete: true,
      deepProfileComplete: true,
      bannedAt: null,
      deletedAt: null,
      lockedUntil: null, // ingen låste brukere
      profile: {
        isNot: null,
      },
    },
    include: {
      profile: true,
    },
    take: 50, // maksimum kandidater for performance
  });

  if (candidates.length === 0) {
    return null;
  }

  // 4. Beregn resonans for hver kandidat
  const candidateResonance: Array<{
    candidateId: string;
    resonance: ResonanceResult;
  }> = [];

  for (const candidate of candidates) {
    if (!candidate.profile) continue;

    // Bygg profil-objekt for resonans-beregning
    const profileA = buildProfileObject(user.profile);
    const profileB = buildProfileObject(candidate.profile);

    const score = unifiedScore(profileA, profileB);

    if (score.score >= minResonance) {
      candidateResonance.push({
        candidateId: candidate.id,
        resonance: {
          resonanceScore: score.score,
          breakdown: score.breakdown,
          resonanceLevel: score.level,
        },
      });
    }
  }

  if (candidateResonance.length === 0) {
    return null;
  }

  // 5. Sorter etter resonans og returner beste match
  candidateResonance.sort((a, b) => b.resonance.resonanceScore - a.resonance.resonanceScore);

  const bestMatch = candidateResonance[0];

  return {
    match: bestMatch.resonance,
    candidate: {
      id: bestMatch.candidateId,
      email: (candidates.find(c => c.id === bestMatch.candidateId) || { email: "" }).email,
      profile: candidates.find(c => c.id === bestMatch.candidateId)?.profile || null,
    },
    candidateId: bestMatch.candidateId,
    nextAvailableAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  };
}

/**
 * Bygg profil-objekt fra Prisma Profile for resonans-beregning
 */
function buildProfileObject(profile: {
  id: string;
  identityName: string | null;
  age: number | null;
  lifeSituation: unknown;
  personality: unknown;
  relationshipStyle: string | null;
  communication: unknown;
  intimacy: unknown;
  futureVision: unknown;
  boundaries: unknown;
  emotionalNeeds: unknown;
  lifeRhythm: string | null;
  maturityLevel: number | null;
  securityLevel: string | null;
  bio: string | null;
  interests: string[];
}): Record<string, unknown> {
  return {
    userId: profile.id,
    identityName: profile.identityName,
    age: profile.age,
    lifeSituation: profile.lifeSituation,
    personality: profile.personality,
    relationshipStyle: profile.relationshipStyle,
    communication: profile.communication,
    intimacy: profile.intimacy,
    futureVision: profile.futureVision,
    boundaries: profile.boundaries,
    emotionalNeeds: profile.emotionalNeeds,
    lifeRhythm: profile.lifeRhythm,
    maturityLevel: profile.maturityLevel,
    securityLevel: profile.securityLevel,
    bio: profile.bio,
    interests: profile.interests,
    // Ingen fotos i resonansberegningen!
  };
}