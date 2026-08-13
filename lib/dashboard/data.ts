/**
 * ToSom — Dashboard Data Layer
 * 
 * Hentar data til Dashboard 2.0:
 * - bruker-profil
 * - aktive matcher
 * - aktive samtalar
 * - profilstatus
 * - innsikt (placeholder/basert på data)
 */

import { prisma } from '@/lib/prisma';
import { Profile, Match, Conversation, JourneyPhase } from '@prisma/client';

/* ====== Type-definisjonar ====== */

interface DashboardMatch {
  id: string;
  otherUserId: string;
  otherUserName: string | null;
  otherUserPhotoUrl: string | null;
  score: number;
  resonanceLevel: string;
  explanation: {
    _scores?: Record<string, number>;
    strengths?: string[];
    summary?: string;
  } | null;
  createdAt: string;
  matchType: string;
}

interface DashboardConversation {
  id: string;
  otherUserId: string;
  otherUserName: string | null;
  otherUserPhotoUrl: string | null;
  lastMessagePreview: string | null;
  lastMessageAt: string | null;
  unreadCount: number;
  createdAt: string;
}

interface DashboardProfileStatus {
  onboardingComplete: boolean;
  deepProfileComplete: boolean;
  deepProfileStep: string;
  identityName: string | null;
  photoUrl: string | null;
  journeyPhase: JourneyPhase | null;
  journeyDay: number;
  journeyCompleted: boolean;
}

interface DashboardInsight {
  title: string;
  text: string;
  suggestion: string;
}

/* ====== getUserProfile ====== */

export async function getUserProfile(userId: string): Promise<DashboardProfileStatus | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      onboardingComplete: true,
      deepProfileComplete: true,
      profile: {
        select: {
          deepProfileStep: true,
          identityName: true,
          photoUrl: true,
        },
      },
    },
  });

  // B4 — JourneyProgress er match-scoped, ingen User.journey-relasjon
  const journey = await prisma.journeyProgress.findFirst({
    where: { userId },
    orderBy: { startedAt: 'desc' },
  });

  if (!user || !user.profile) return null;

  return {
    onboardingComplete: user.onboardingComplete,
    deepProfileComplete: user.deepProfileComplete,
    deepProfileStep: user.profile.deepProfileStep,
    identityName: user.profile.identityName,
    photoUrl: user.profile.photoUrl,
    journeyPhase: journey?.phase ?? null,
    journeyDay: journey?.day ?? 1,
    journeyCompleted: (journey?.completedDays ?? 0) >= 30,
  };
}

/* ====== getUserMatches ====== */

export async function getUserMatches(userId: string): Promise<DashboardMatch[]> {
  const matches = await prisma.match.findMany({
    where: {
      status: 'active',
      OR: [{ userAId: userId }, { userBId: userId }],
      expiresAt: { gte: new Date() },
    },
    include: {
      userA: {
        select: {
          id: true,
          profile: { select: { identityName: true, photoUrl: true } },
        },
      },
      userB: {
        select: {
          id: true,
          profile: { select: { identityName: true, photoUrl: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 6,
  });

  return matches.map((m) => {
    const youId = userId;
    const other = m.userAId === youId ? m.userB : m.userA;
    const otherProfile = other.profile;

    // Finn sterke område fra explanation
    const scores = ((m.explanation as any)?._scores ?? {}) as Record<string, number>;
    const strengths: string[] = [];
    const scoreEntries = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    for (const [key, val] of scoreEntries.slice(0, 3)) {
      if (val > 0.6) {
        const labels: Record<string, string> = {
          verdier: 'Verdier',
          kommunikasjon: 'Kommunikasjon',
          trygghet: 'Trygghet',
          fremtid: 'Fremtidsvisjon',
          leik: 'Leik og humor',
          livsstil: 'Livsstil',
          tilknytning: 'Tilknyting',
          kjaerlighet: 'Kjærligheit',
          humor: 'Humor',
        };
        strengths.push(labels[key] || key);
      }
    }

    return {
      id: m.id,
      otherUserId: other.id,
      otherUserName: otherProfile?.identityName ?? null,
      otherUserPhotoUrl: otherProfile?.photoUrl ?? null,
      score: m.score,
      resonanceLevel: m.resonanceLevel,
      explanation: {
        _scores: scores,
        strengths,
        summary: (m.explanation as any)?.summary ?? '',
      },
      createdAt: m.createdAt.toISOString(),
      matchType: m.type,
    };
  });
}

/* ====== getUserConversations ====== */

export async function getUserConversations(userId: string): Promise<DashboardConversation[]> {
  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [{ userAId: userId }, { userBId: userId }],
      endedAt: null,
    },
    include: {
      userA: {
        select: {
          id: true,
          email: true,
          profile: { select: { identityName: true, photoUrl: true } },
        },
      },
      userB: {
        select: {
          id: true,
          email: true,
          profile: { select: { identityName: true, photoUrl: true } },
        },
      },
      messages: {
        where: { state: 'SENT' },
        orderBy: { createdAt: 'desc' },
        take: 1,
        include: {
          sender: {
            select: {
              profile: { select: { identityName: true } },
            },
          },
        },
      },
    },
    orderBy: { lastMessageAt: 'desc' },
    take: 6,
  });

  return conversations.map((c) => {
    const youId = userId;
    const other = c.userAId === youId ? c.userB : c.userA;
    const otherProfile = other?.profile;
    const lastMsg = c.messages[0];

    return {
      id: c.id,
      otherUserId: other?.id ?? '',
      otherUserName: otherProfile?.identityName ?? null,
      otherUserPhotoUrl: otherProfile?.photoUrl ?? null,
      lastMessagePreview: c.lastMessagePreview ?? lastMsg?.content ?? null,
      lastMessageAt: c.lastMessageAt?.toISOString() ?? null,
      unreadCount: c.userAId === youId ? c.unreadCountB : c.unreadCountA,
      createdAt: c.createdAt.toISOString(),
    };
  });
}

/* ====== getUserInsights ====== */

export async function getUserInsights(
  userId: string,
  matchCount: number,
  convoCount: number,
  profileComplete: boolean,
): Promise<DashboardInsight[]> {
  const insights: DashboardInsight[] = [];

  // Innsikt 1: Om match-antall
  if (matchCount === 0) {
    insights.push({
      title: 'Gi deg tid',
      text: 'Du har ingen aktive matcher akkurat no. Det er helt normalt. ToSom matcher deg med éin god match om dagen — ikke mange dårlige.',
      suggestion: 'Fokuser på å fylle ut profilen din. Jo meir du deler, jo betre blir matcha.',
    });
  } else if (matchCount === 1) {
    insights.push({
      title: 'Ta deg tid til éin',
      text: `Du har éin aktiv match. Det viktigste er ikke talet, men at du tek deg tid til å vere nysgjerrig på den eine.`,
      suggestion: 'Prøv å starte med noko lite og varmt — ein enkel hilsen eller eit spørsmål om kven dei er.',
    });
  } else {
    insights.push({
      title: 'Du har aktive matcher',
      text: `Du har ${matchCount} aktive matcher. Det fine med ToSom er at du kan ta éin om gongen. Ingen stress, ingen swiping.`,
      suggestion: 'Velg éin match og start med eit varmt spørsmål.',
    });
  }

  // Innsikt 2: Om samtalar
  if (convoCount === 0) {
    insights.push({
      title: 'Når samtalar tek til',
      text: 'Du har ingen samtalar enno. Når du matcher og begge aksepterer, dukkar ei privat rom opp her.',
      suggestion: 'Den første meldinga er ofte den viktigaste. Vær deg sjølv — det er det andre personen kom her for.',
    });
  } else if (convoCount === 1) {
    insights.push({
      title: 'Ein samtale i gang',
      text: 'Du har éin aktiv samtale. Ta det roleg — dei beste sambanda bygges sakte.',
      suggestion: 'Ver nysgjerrig. Spør om hva som faktisk betyr noko for dei.',
    });
  } else {
    insights.push({
      title: 'Fleire samtalar',
      text: `Du har ${convoCount} aktive samtalar. Hver har si eiga rytme. La dei gå i sitt eige tempo.`,
      suggestion: 'Du behøver ikke svare alle samtidig. Prioriter den som kjem først.',
    });
  }

  // Innsikt 3: Om profil
  if (!profileComplete) {
    insights.push({
      title: 'Profilstatus',
      text: 'Profilen din er ikke heilt ferdig ennå. Jo meir du deler, jo djupare blir matcha.',
      suggestion: 'Gå til "Oppdater profil" og svar på nokre av spørsmåla. Kvar svar gjer matcha betre.',
    });
  }

  return insights;
}

/* ====== getJourneyStatus ====== */

/**
 * Hent journey-status for ein user (frå JourneyProgress).
 * Denne funksjonen bruker NO lenger JourneyStep-modellen.
 * All progresjon er lagret i JourneyProgress (user-basert).
 */
export async function getJourneyStatus(userId: string) {
  const journey = await prisma.journeyProgress.findFirst({
    where: { userId },
  });

  if (!journey) return null;

  return {
    phase: journey.phase,
    day: journey.day,
    completedDays: journey.completedDays,
    startedAt: journey.startedAt,
    endedAt: journey.endedAt,
    nextDayAt: journey.nextDayAt,
  };
}
