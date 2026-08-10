/**
 * ToSom — User State Machine 🟡⭐
 * Sentral tilstandslogikk for hele plattformen.
 */

import prisma from "@/lib/prisma";

export type UserState =
  | 'ONBOARDING'
  | 'WAITING_FOR_MATCH'
  | 'ACTIVE_JOURNEY'
  | 'DAY_30_CHOICE'
  | 'JOURNEY_COMPLETE'
  | 'LOOP_BACK';

export interface StatePermissions {
  canAccessOnboarding: boolean;
  canAccessDashboard: boolean;
  canAccessChat: boolean;
  canAccessReiseEnd: boolean;
  canEditProfile: boolean;
}

const PERMISSIONS: Record<UserState, StatePermissions> = {
  ONBOARDING: { canAccessOnboarding: true, canAccessDashboard: false, canAccessChat: false, canAccessReiseEnd: false, canEditProfile: false },
  WAITING_FOR_MATCH: { canAccessOnboarding: false, canAccessDashboard: true, canAccessChat: false, canAccessReiseEnd: false, canEditProfile: false },
  ACTIVE_JOURNEY: { canAccessOnboarding: false, canAccessDashboard: true, canAccessChat: true, canAccessReiseEnd: true, canEditProfile: false },
  DAY_30_CHOICE: { canAccessOnboarding: false, canAccessDashboard: true, canAccessChat: false, canAccessReiseEnd: true, canEditProfile: false },
  JOURNEY_COMPLETE: { canAccessOnboarding: false, canAccessDashboard: true, canAccessChat: false, canAccessReiseEnd: false, canEditProfile: false },
  LOOP_BACK: { canAccessOnboarding: true, canAccessDashboard: true, canAccessChat: false, canAccessReiseEnd: false, canEditProfile: true },
};

export interface UserStateResult {
  state: UserState;
  permissions: StatePermissions;
  journeyDay?: number;
  onboardingComplete: boolean;
}

export async function getUserState(userId: string): Promise<UserStateResult> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) return defaultState('ONBOARDING');

    const onboardingComplete = user.onboardingComplete ?? false;
    if (!onboardingComplete) return defaultState('ONBOARDING');

    // Sjekk aktiv match (lowercase status, correct field names)
    const activeMatch = await prisma.match.findFirst({
      where: {
        OR: [
          { userAId: userId, status: 'active' },
          { userBId: userId, status: 'active' },
        ],
      },
    });

    if (!activeMatch) {
      const completedJourney = await prisma.journeyProgress.findFirst({
        where: { userId },
        orderBy: { startedAt: 'desc' },
      });
      if (completedJourney?.completedAt) return defaultState('LOOP_BACK');
      return defaultState('WAITING_FOR_MATCH');
    }

    const journey = await prisma.journeyProgress.findFirst({
      where: { userId },
      orderBy: { startedAt: 'desc' },
    });

    if (!journey) return defaultState('ACTIVE_JOURNEY', 1);

    const currentDay = journey.day ?? 1;

    if (currentDay >= 30) {
      if (journey.completedAt) return defaultState('JOURNEY_COMPLETE');
      return defaultState('DAY_30_CHOICE', 30);
    }

    return defaultState('ACTIVE_JOURNEY', currentDay);

  } catch (error) {
    console.error("Feil i getUserState:", error);
    return defaultState('ONBOARDING');
  }
}

function defaultState(state: UserState, journeyDay?: number): UserStateResult {
  return { state, permissions: PERMISSIONS[state], journeyDay, onboardingComplete: state !== 'ONBOARDING' };
}

export async function hasActiveMatch(userId: string): Promise<boolean> {
  try {
    const match = await prisma.match.findFirst({
      where: {
        OR: [
          { userAId: userId, status: 'active' },
          { userBId: userId, status: 'active' },
        ],
      },
    });
    return !!match;
  } catch { return false; }
}

export async function getCurrentJourneyDay(userId: string): Promise<number | null> {
  try {
    const journey = await prisma.journeyProgress.findFirst({
      where: { userId },
      orderBy: { startedAt: 'desc' },
    });
    return journey?.day ?? null;
  } catch { return null; }
}

export default getUserState;