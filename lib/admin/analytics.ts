// analytics.ts — statistikk-funksjonar for admin-dashboard

import prisma from "@/lib/prisma";

/**
 * Totalt antal brukarar.
 */
export async function totalUsers(): Promise<number> {
  return prisma.user.count();
}

/**
 * Aktive brukarar dei siste 30 dagane.
 */
export async function activeUsersLast30Days(): Promise<number> {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  return prisma.user.count({
    where: {
      OR: [
        { profile: { updatedAt: { gte: thirtyDaysAgo } } },
        { messages: { some: { createdAt: { gte: thirtyDaysAgo } } } },
      ],
    },
  });
}

/**
 * Matches per dag dei siste 30 dagane.
 */
export async function matchesPerDay(): Promise<Array<{ date: string; count: number }>> {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const matches = await prisma.match.findMany({
    where: { createdAt: { gte: thirtyDaysAgo } },
    select: { createdAt: true },
  });

  const dailyMap: Record<string, number> = {};
  for (let i = 0; i < 30; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    dailyMap[key] = 0;
  }

  for (const m of matches) {
    const key = m.createdAt.toISOString().split("T")[0];
    if (dailyMap[key] !== undefined) {
      dailyMap[key]++;
    }
  }

  return Object.entries(dailyMap)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Conversations per dag dei siste 30 dagane.
 */
export async function conversationsPerDay(): Promise<Array<{ date: string; count: number }>> {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const conversations = await prisma.conversation.findMany({
    where: { createdAt: { gte: thirtyDaysAgo } },
    select: { createdAt: true },
  });

  const dailyMap: Record<string, number> = {};
  for (let i = 0; i < 30; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    dailyMap[key] = 0;
  }

  for (const c of conversations) {
    const key = c.createdAt.toISOString().split("T")[0];
    if (dailyMap[key] !== undefined) {
      dailyMap[key]++;
    }
  }

  return Object.entries(dailyMap)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Journey completion rate.
 */
export async function journeyCompletionRate(): Promise<{
  total: number;
  completed: number;
  rate: number;
}> {
  const total = await prisma.journeyProgress.count();
  if (total === 0) return { total: 0, completed: 0, rate: 0 };

  const completed = await prisma.journeyProgress.count({
    where: { day: 30 },
  });

  return {
    total,
    completed,
    rate: Math.round((completed / total) * 100),
  };
}

/**
 * Admin dashboard statar (alt på éin gong).
 */
export async function getAdminStats() {
  return {
    totalUsers: await totalUsers(),
    activeUsersLast30Days: await activeUsersLast30Days(),
    matchesPerDay: await matchesPerDay(),
    conversationsPerDay: await conversationsPerDay(),
    journeyCompletionRate: await journeyCompletionRate(),
  };
}
