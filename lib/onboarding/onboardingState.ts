// Onboarding — tilstandsengine
// OB2–OB4 — typar, profileDraft, calculateProgress, next/prevStep, updateDraft

import type { UserProfile } from "../profile/userProfile";
import { dummyUserProfile } from "../profile/userProfile";

/* OB2 — OnboardingStep-type */
export type OnboardingStep =
  | "welcome"
  | "name_age"
  | "values"
  | "interests"
  | "bio"
  | "photos"
  | "ready"
  | "completed";

/* OB3 — OnboardingState */
export interface OnboardingState {
  currentStep: OnboardingStep;
  profileDraft: UserProfile;
  progress: number;
}

/* OB3 — Default initialState */
export const defaultInitialState: OnboardingState = {
  currentStep: "welcome",
  profileDraft: { ...dummyUserProfile },
  progress: 0,
};

/* OB4 — calculateProgress */
export function calculateProgress(step: OnboardingStep): number {
  const steps: OnboardingStep[] = [
    "welcome",
    "name_age",
    "values",
    "interests",
    "bio",
    "photos",
    "ready",
    "completed",
  ];
  const idx = steps.indexOf(step);
  if (idx < 0) return 0;
  return Math.round(((idx + 1) / steps.length) * 100);
}

/* OB4 — nextStep */
export function nextStep(state: OnboardingState): OnboardingState {
  const steps: OnboardingStep[] = [
    "welcome",
    "name_age",
    "values",
    "interests",
    "bio",
    "photos",
    "ready",
    "completed",
  ];
  const idx = steps.indexOf(state.currentStep);
  if (idx < 0 || idx >= steps.length - 1) return state;
  const next = steps[idx + 1];
  return {
    ...state,
    currentStep: next,
    progress: calculateProgress(next),
  };
}

/* OB4 — prevStep */
export function prevStep(state: OnboardingState): OnboardingState {
  const steps: OnboardingStep[] = [
    "welcome",
    "name_age",
    "values",
    "interests",
    "bio",
    "photos",
    "ready",
    "completed",
  ];
  const idx = steps.indexOf(state.currentStep);
  if (idx <= 0) return state;
  const prev = steps[idx - 1];
  return {
    ...state,
    currentStep: prev,
    progress: calculateProgress(prev),
  };
}

/* OB4 — updateDraft */
export function updateDraft(
  state: OnboardingState,
  partial: Partial<Pick<UserProfile, "name" | "age" | "bio" | "values" | "interests" | "photos" | "readyForMatch">>
): OnboardingState {
  return {
    ...state,
    profileDraft: { ...state.profileDraft, ...partial },
  };
}

/* OB4 — Eksporter onboardingStateAPI */
export const onboardingStateAPI = {
  calculateProgress,
  nextStep,
  prevStep,
  updateDraft,
};

/* OB4 — Verdier og interesser tilgjengelige for onboarding */
export const availableValues = [
  "Ærlegheit", "Trygghet", "Vekst", "Nyskaping", "Empati",
  "Respekt", "Uavhengighet", "Djupde", "Autentisitet", "Balanse",
  "Skapande", "Åpenheit",
];

export const availableInterests = [
  "Friluftsliv", "Musikk", "Lesing", "Fotografi", "Matlaging",
  "Reise", "Kunst", "Film", "Dans", "Idrett", "Hagebruk", "Podcast",
];
