/**
 * ToSom — Admin Data Layer (STEG 9.3 FIX)
 * 
 * Hentar data for admin-panel: brukarar, profiler, matcher, samtalar, innsikter.
 * Fikset matchCount og conversationCount med OR-betingelse (userA + userB).
 */

import { prisma } from '@/lib/prisma';

/* ====== Typar ====== */

export interface AdminUser {
  id: string; email: string; role: string; verified: boolean; banned: boolean;
  onboardingComplete: boolean; deepProfileComplete: boolean; createdAt: string;
  profile?: { identityName: string | null; age: number | null };
  matchCount: number; conversationCount: number;
}

export interface AdminUserDetail {
  id: string; email: string; role: string; verified: boolean; banned: boolean;
  onboardingComplete: boolean; deepProfileComplete: boolean; createdAt: string;
  profile: { identityName: string | null; age: number | null; lifestyle: Record<string, unknown> | null;
    personality: Record<string, unknown> | null; communication: Record<string, unknown> | null;
    intimacy: Record<string, unknown> | null; futureVision: Record<string, unknown> | null;
    boundaries: Record<string, unknown> | null; emotionalNeeds: Record<string, unknown> | null;
    maturityLevel: number | null; relationshipStyle: string | null; deepProfileStep: string;
  } | null;
  journey: { phase: string | null; day: number; completedDays: number; } | null;
  matchCount: number; conversationCount: number;
}

export interface AdminProfile { id: string; userId: string; userEmail: string | null;
  identityName: string | null; age: number | null; relationshipStyle: string | null;
  deepProfileStep: string; deepProfileComplete: boolean; createdAt: string; }

export interface AdminMatch { id: string; userAId: string; userBId: string;
  userAName: string | null; userBName: string | null; score: number;
  resonanceLevel: string; status: string; createdAt: string; }
export interface AdminMatchDetail extends AdminMatch {
  explanation: Record<string, unknown> | null;
  userAProfile: Record<string, unknown> | null;
  userBProfile: Record<string, unknown> | null; }

export interface AdminConversation { id: string; userAId: string; userBId: string;
  userAName: string | null; userBName: string | null; messageCount: number;
  lastMessageAt: string | null; createdAt: string; }
export interface AdminConversationDetail extends AdminConversation {
  messages: Array<{ id: string; senderId: string; senderName: string; content: string; type: string; createdAt: string; }>; }

export interface AdminInsight { id: string; matchId: string; summary: string; strengths: string;
  clarity: string; starter: string; model: string | null; tokensOut: number; createdAt: string; }
export interface AdminInsightDetail extends AdminInsight { match: AdminMatch; }

/* ====== Brukarar ====== */

export async function getAllUsers(page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  const users = await prisma.user.findMany({
    skip, take: limit, orderBy: { createdAt: 'desc' },
    select: { id: true, email: true, role: true, verified: true, bannedAt: true,
      onboardingComplete: true, deepProfileComplete: true, createdAt: true,
      profile: { select: { identityName: true, age: true } },
    },
  });

  const userIds = users.map(u => u.id);
  
  // STEG 9.3 FIX: OR-betingelse for å telle matcher der brukeren er BÅDE userA og userB
  const matchRecords = userIds.length > 0
    ? await prisma.match.findMany({
        where: { OR: [{ userAId: { in: userIds } }, { userBId: { in: userIds } }] },
        select: { userAId: true, userBId: true },
      }) : [];

  // STEG 9.3 FIX: Reell konversasjonstelling (OR-betingelse)
  const convRecords = userIds.length > 0
    ? await prisma.conversation.findMany({
        where: { OR: [{ userAId: { in: userIds } }, { userBId: { in: userIds } }] },
        select: { id: true, userAId: true, userBId: true },
      }) : [];

  const matchCounts = new Map<string, number>();
  matchRecords.forEach(m => {
    if (userIds.includes(m.userAId)) matchCounts.set(m.userAId, (matchCounts.get(m.userAId) || 0) + 1);
    if (userIds.includes(m.userBId)) matchCounts.set(m.userBId, (matchCounts.get(m.userBId) || 0) + 1);
  });

  const convCounts = new Map<string, number>();
  convRecords.forEach(c => {
    if (userIds.includes(c.userAId)) convCounts.set(c.userAId, (convCounts.get(c.userAId) || 0) + 1);
    if (userIds.includes(c.userBId)) convCounts.set(c.userBId, (convCounts.get(c.userBId) || 0) + 1);
  });

  return users.map(u => ({
    id: u.id, email: u.email, role: u.role, verified: u.verified,
    banned: u.bannedAt !== null, onboardingComplete: u.onboardingComplete,
    deepProfileComplete: u.deepProfileComplete, createdAt: u.createdAt.toISOString(),
    profile: u.profile ? { identityName: u.profile.identityName, age: u.profile.age } : undefined,
    matchCount: matchCounts.get(u.id) || 0,
    conversationCount: convCounts.get(u.id) || 0,
  }));
}

export async function getUserById(id: string): Promise<AdminUserDetail | null> {
  const user = await prisma.user.findUnique({
    where: { id }, include: { profile: true, journey: { select: { phase: true, day: true, completedDays: true } }, },
  });
  if (!user) return null;

  // STEG 9.3 FIX: Reell telling
  const [matchCount, convCount] = await Promise.all([
    prisma.match.count({ where: { OR: [{ userAId: id }, { userBId: id }] } }),
    prisma.conversation.count({ where: { OR: [{ userAId: id }, { userBId: id }] } }),
  ]);

  return {
    id: user.id, email: user.email, role: user.role, verified: user.verified,
    banned: user.bannedAt !== null, onboardingComplete: user.onboardingComplete,
    deepProfileComplete: user.deepProfileComplete, createdAt: user.createdAt.toISOString(),
    profile: user.profile ? {
      identityName: user.profile.identityName, age: user.profile.age,
      lifestyle: user.profile.lifestyle as Record<string, unknown> | null,
      personality: user.profile.personality as Record<string, unknown> | null,
      communication: user.profile.communication as Record<string, unknown> | null,
      intimacy: user.profile.intimacy as Record<string, unknown> | null,
      futureVision: user.profile.futureVision as Record<string, unknown> | null,
      boundaries: user.profile.boundaries as Record<string, unknown> | null,
      emotionalNeeds: user.profile.emotionalNeeds as Record<string, unknown> | null,
      maturityLevel: user.profile.maturityLevel, relationshipStyle: user.profile.relationshipStyle,
      deepProfileStep: user.profile.deepProfileStep,
    } : null,
    journey: user.journey ? { phase: user.journey.phase, day: user.journey.day, completedDays: user.journey.completedDays } : null,
    matchCount, conversationCount: convCount,
  };
}

/* ======Matcher ====== */

export async function getAllMatches(page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  const matches = await prisma.match.findMany({
    skip, take: limit, orderBy: { createdAt: 'desc' },
    select: { id: true, userAId: true, userBId: true, score: true, resonanceLevel: true, status: true, createdAt: true,
      userA: { select: { profile: { select: { identityName: true } } } },
      userB: { select: { profile: { select: { identityName: true } } } },
    },
  });
  return matches.map(m => ({
    id: m.id, userAId: m.userAId, userBId: m.userBId,
    userAName: m.userA.profile?.identityName ?? 'Ukjent',
    userBName: m.userB.profile?.identityName ?? 'Ukjent',
    score: m.score, resonanceLevel: m.resonanceLevel, status: m.status, createdAt: m.createdAt.toISOString(),
  }));
}

export async function getMatchById(id: string): Promise<AdminMatchDetail | null> {
  const match = await prisma.match.findUnique({ where: { id }, include: { userA: { select: { profile: true } }, userB: { select: { profile: true } } }, });
  if (!match) return null;
  return {
    id: match.id, userAId: match.userAId, userBId: match.userBId,
    userAName: match.userA.profile?.identityName ?? 'Ukjent',
    userBName: match.userB.profile?.identityName ?? 'Ukjent',
    score: match.score, resonanceLevel: match.resonanceLevel, status: match.status, createdAt: match.createdAt.toISOString(),
    explanation: match.explanation as Record<string, unknown> | null,
    userAProfile: match.userA.profile as Record<string, unknown> | null,
    userBProfile: match.userB.profile as Record<string, unknown> | null,
  };
}

/* ====== Samtaler ====== */

export async function getAllConversations(page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  const conversations = await prisma.conversation.findMany({
    skip, take: limit, orderBy: { lastMessageAt: 'desc' },
    select: { id: true, userAId: true, userBId: true, lastMessageAt: true, createdAt: true,
      messages: { select: { id: true } },
      userA: { select: { profile: { select: { identityName: true } } } },
      userB: { select: { profile: { select: { identityName: true } } } },
    },
  });
  return conversations.map(c => ({
    id: c.id, userAId: c.userAId, userBId: c.userBId,
    userAName: c.userA?.profile?.identityName ?? 'Ukjent',
    userBName: c.userB?.profile?.identityName ?? 'Ukjent',
    messageCount: c.messages.length, lastMessageAt: c.lastMessageAt?.toISOString() ?? null, createdAt: c.createdAt.toISOString(),
  }));
}

export async function getConversationById(id: string): Promise<AdminConversationDetail | null> {
  const conversation = await prisma.conversation.findUnique({ where: { id }, include: {
    messages: { orderBy: { createdAt: 'asc' }, include: { sender: { select: { profile: { select: { identityName: true } } } } }, },
    userA: { select: { profile: { select: { identityName: true } } } },
    userB: { select: { profile: { select: { identityName: true } } } },
  }});
  if (!conversation) return null;
  return {
    id: conversation.id, userAId: conversation.userAId, userBId: conversation.userBId,
    userAName: conversation.userA?.profile?.identityName ?? 'Ukjent',
    userBName: conversation.userB?.profile?.identityName ?? 'Ukjent',
    messageCount: conversation.messages.length, lastMessageAt: conversation.lastMessageAt?.toISOString() ?? null,
    createdAt: conversation.createdAt.toISOString(),
    messages: conversation.messages.map(m => ({ id: m.id, senderId: m.senderId, senderName: m.sender.profile?.identityName ?? 'Ukjent', content: m.content, type: m.type, createdAt: m.createdAt.toISOString() })),
  };
}

/* ====== Profiler ====== */

export async function getAllProfiles(page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  const profiles = await prisma.profile.findMany({
    skip, take: limit, orderBy: { createdAt: 'desc' },
    select: { id: true, userId: true, identityName: true, age: true, relationshipStyle: true, deepProfileStep: true, createdAt: true, user: { select: { email: true } }, },
  });
  return profiles.map(p => ({ id: p.id, userId: p.userId, identityName: p.identityName, age: p.age,
    relationshipStyle: p.relationshipStyle, deepProfileStep: p.deepProfileStep,
    deepProfileComplete: p.deepProfileStep === 'SUMMARY', createdAt: p.createdAt.toISOString(), userEmail: p.user.email, }));
}

export async function getProfileById(id: string): Promise<AdminProfile | null> {
  const profile = await prisma.profile.findUnique({ where: { id }, include: { user: { select: { email: true } } }, });
  if (!profile) return null;
  return { id: profile.id, userId: profile.userId, userEmail: profile.user.email,
    identityName: profile.identityName, age: profile.age, relationshipStyle: profile.relationshipStyle,
    deepProfileStep: profile.deepProfileStep, deepProfileComplete: profile.deepProfileStep === 'SUMMARY',
    createdAt: profile.createdAt.toISOString(), };
}

/* ====== Innsikter (AI) ====== */

export async function getAllInsights(page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  const insights = await prisma.matchInsight.findMany({
    skip, take: limit, orderBy: { createdAt: 'desc' },
    select: { id: true, matchId: true, summary: true, strengths: true, clarity: true, starter: true, model: true, tokensOut: true, createdAt: true, },
  });
  return insights.map(i => ({ id: i.id, matchId: i.matchId, summary: i.summary, strengths: i.strengths,
    clarity: i.clarity, starter: i.starter, model: i.model, tokensOut: i.tokensOut, createdAt: i.createdAt.toISOString(), }));
}

export async function getInsightById(id: string): Promise<AdminInsightDetail | null> {
  const insight = await prisma.matchInsight.findUnique({ where: { id }, include: { match: { include: { userA: { select: { profile: { select: { identityName: true } } } }, userB: { select: { profile: { select: { identityName: true } } } }, } }, }});
  if (!insight) return null;
  return { id: insight.id, matchId: insight.matchId, summary: insight.summary, strengths: insight.strengths,
    clarity: insight.clarity, starter: insight.starter, model: insight.model, tokensOut: insight.tokensOut, createdAt: insight.createdAt.toISOString(),
    match: { id: insight.match.id, userAId: insight.match.userAId, userBId: insight.match.userBId,
      userAName: insight.match.userA.profile?.identityName ?? 'Ukjent',
      userBName: insight.match.userB.profile?.identityName ?? 'Ukjent',
      score: insight.match.score, resonanceLevel: insight.match.resonanceLevel, status: insight.match.status, createdAt: insight.match.createdAt.toISOString(), },
  };
}

/* ====== Stats ====== */

export async function getAdminStats() {
  const [userCount, matchCount, conversationCount, messageCount, insightCount, activeMatchCount] = await Promise.all([
    prisma.user.count(), prisma.match.count(), prisma.conversation.count(),
    prisma.message.count(), prisma.matchInsight.count(),
    prisma.match.count({ where: { status: 'active' } }),
  ]);
  const now = new Date();
  const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const last30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const [newUsersLast7d, newUsersLast30d, newMatchesLast7d] = await Promise.all([
    prisma.user.count({ where: { createdAt: { gte: last7d } } }),
    prisma.user.count({ where: { createdAt: { gte: last30d } } }),
    prisma.match.count({ where: { createdAt: { gte: last7d } } }),
  ]);
  return { users: { total: userCount, last7d: newUsersLast7d, last30d: newUsersLast30d },
    matches: { total: matchCount, active: activeMatchCount, last7d: newMatchesLast7d },
    conversations: conversationCount, messages: messageCount, insights: insightCount, };
}