/**
 * ToSom — Admin Analytics API 📊
 * Henter virkelige tall fra database for dashboardet.
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAdminCookie } from '@/lib/auth/admin-jwt';

interface DailyCounts {
  signups: number[];
  onboarding: number[];
  matches: number[];
  journeys: number[];
  messages: number[];
}

async function getDailySeries(days: number): Promise<DailyCounts> {
  const now = new Date();
  const series: DailyCounts = {
    signups: [],
    onboarding: [],
    matches: [],
    journeys: [],
    messages: [],
  };

  for (let i = days - 1; i >= 0; i--) {
    const dayStart = new Date(now);
    dayStart.setDate(now.getDate() - i);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayStart.getDate() + 1);

    // For incomplete last day: count from midnight to now
    const isLastDay = i === 0;
    const cutoff = isLastDay ? now : dayEnd;

    const [signupCount, onboardingCount, matchCount, journeyCount, messageCount] = await Promise.all([
      prisma.user.count({ where: { createdAt: { gte: dayStart, lt: cutoff } } }),
      prisma.user.count({ where: { onboardingComplete: true, updatedAt: { gte: dayStart, lt: cutoff } } }),
      prisma.match.count({ where: { createdAt: { gte: dayStart, lt: cutoff } } }),
      prisma.journeyProgress.count({ where: { startedAt: { gte: dayStart, lt: cutoff } } }),
      prisma.message.count({ where: { createdAt: { gte: dayStart, lt: cutoff } } }),
    ]);

    series.signups.push(signupCount);
    series.onboarding.push(onboardingCount);
    series.matches.push(matchCount);
    series.journeys.push(journeyCount);
    series.messages.push(messageCount);
  }

  return series;
}

export async function GET(req: NextRequest) {
  try {
    // Check admin auth
    const adminPayload = verifyAdminCookie(req);
    if (!adminPayload) {
      return NextResponse.json({ error: 'Uautorisert' }, { status: 403 });
    }

    const days = parseInt(req.nextUrl.searchParams.get('days') || '30', 10);
    const totalDays = Math.max(7, Math.min(90, days)); // 7-90 days range

    // Fetch daily series and key stats in parallel
    const [dailySeries, keyStats] = await Promise.all([
      getDailySeries(totalDays),
      (async () => {
        const [totalUsers, activeUsers, totalMatches, avgScore, totalJourneys, completedJourneys] = await Promise.all([
          prisma.user.count(),
          prisma.user.count({ where: { lastMatchAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } }),
          prisma.match.count(),
          prisma.match.aggregate({ _avg: { score: true } }),
          prisma.journeyProgress.count(),
          prisma.journeyProgress.count({ where: { phase: 'CHECKIN' } }),
        ]);

        return {
          totalUsers,
          activeUsers30d: activeUsers,
          totalMatches,
          avgScore: Math.round((avgScore._avg.score || 0) * 100),
          totalJourneys,
          completedJourneys,
        };
      })(),
    ]);

    return NextResponse.json({
      success: true,
      days: totalDays,
      dailySeries,
      keyStats,
    });
  } catch (err) {
    console.error('[Analytics API]', err);
    // Return zeros on DB error instead of crashing
    const emptySeries: DailyCounts = {
      signups: [],
      onboarding: [],
      matches: [],
      journeys: [],
      messages: [],
    };

    return NextResponse.json({
      success: true,
      days: 30,
      dailySeries: emptySeries,
      keyStats: { totalUsers: 0, activeUsers30d: 0, totalMatches: 0, avgScore: 0, totalJourneys: 0, completedJourneys: 0 },
    });
  }
}