// lib/matching/findBestMatchFor.ts — Finn beste match for ein bruker
// Bruker matchingEngine() frå engine.ts

import prisma from "@/lib/prisma";
import { ProfileData, MatchResult } from "./types";
import { matchingEngine } from "./engine";
import { getWeights } from "./weightConfig";

/**
 * mapProfileToData konverterer ein Prisma Profile til ProfileData-formatet.
 */
function mapProfileToData(profile: any): ProfileData {
  return {
    userId: profile.userId || "",
    firstName: profile.firstName || null,
    lastName: profile.lastName || null,
    age: profile.age || null,
    bio: profile.bio || null,
    interests: profile.interests || [],
    lifeSituation: profile.lifeSituation || null,
    lifestyle: profile.lifestyle || null,
    personality: profile.personality || null,
    relationshipStyle: profile.relationshipStyle || null,
    communication: profile.communication || null,
    intimacy: profile.intimacy || null,
    futureVision: profile.futureVision || null,
    boundaries: profile.boundaries || null,
    emotionalNeeds: profile.emotionalNeeds || null,
    lifeRhythm: profile.lifeRhythm || null,
    maturityLevel: profile.maturityLevel || null,
    securityLevel: profile.securityLevel || null,
    preferences: profile.preferences || null,
    matchTags: profile.matchTags || [],
  };
}

/**
 * findBestMatchFor finn den beste matchen for ein gitt bruker.
 * 
 * Prosess:
 * 1. Hent query-user sin profil
 * 2. Finn alle aktive kandidatar (ekskluderer dei med open conversation)
 * 3. Kjør matchingEngine for kvar kandidat
 * 4. Sorter etter score
 * 5. Returner beste match
 * 
 * Core-definition-reglar:
 *   - Berre éin match per 24t (sjekka eksternt i /api/match)
 *   - Berre éin aktiv reise om gongen (sjekka eksternt)
 *   - Ingen swiping/feed
 */
export async function findBestMatchFor(userId: string): Promise<
  | {
      match: MatchResult;
      candidateId: string;
      candidateProfile: ProfileData;
      nextEligibleAt: Date | null;
    }
  | null
> {
  // 1. Hent query-user
  const queryUser = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true },
  });
  
  if (!queryUser || !queryUser.profile) return null;
  
  const queryProfile = mapProfileToData(queryUser.profile);
  
  // 2. Hent aktive kandidatar (ekskluder brukar med open conversation)
  const activeConvoUserIds = new Set(
    (
      await prisma.conversation.findMany({
        where: { endedAt: null },
        select: { userAId: true, userBId: true },
      })
    ).flatMap((c) => [c.userAId, c.userBId])
  );
  
  const candidates = await prisma.user.findMany({
    where: {
      id: { not: userId, notIn: Array.from(activeConvoUserIds) },
      profile: { isNot: null },
      bannedAt: null, // Ekskluder banna brukarar
      deletedAt: null, // Ekskluder sletta brukarar
    },
    include: { profile: true },
    take: 100, // Maks 100 kandidatar for performances
  });
  
  if (candidates.length === 0) return null;
  
  // 3. Kjør matchingEngine for kvar kandidat
  let bestResult: MatchResult | null = null;
  let bestCandidateId: string | null = null;
  let bestCandidateProfile: ProfileData | null = null;
  
  for (const candidate of candidates) {
    if (!candidate.profile) continue;
    
    const candidateProfile = mapProfileToData(candidate.profile);
    const result = matchingEngine(queryProfile, candidateProfile);
    
    if (!bestResult || result.score > bestResult.score) {
      bestResult = result;
      bestCandidateId = candidate.id;
      bestCandidateProfile = candidateProfile;
    }
  }
  
  // 4. Return null viss ingen match over 0 (alle er dealbreaker)
  if (!bestResult || bestResult.score === 0) return null;
  
  // 5. Berekne nextEligibleAt (24t-regel — dersom lastMatchAt er satt)
  let nextEligibleAt: Date | null = null;
  if (queryUser.lastMatchAt && queryUser.lockedUntil) {
    nextEligibleAt = new Date(queryUser.lockedUntil.getTime() + 24 * 60 * 60 * 1000);
  }
  
  return {
    match: bestResult,
    candidateId: bestCandidateId!,
    candidateProfile: bestCandidateProfile!,
    nextEligibleAt,
  };
}