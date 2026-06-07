"use client";

/** OnboardingFlow — hovedkomponent for onboarding-prosessen
 *  OB5–OB10 — flow-logikk, layout, navigasjon, progressbar
 *  OB10 — ingen backend, berre UI + dummy-data */

import { useState, useCallback } from "react";
import type { UserProfile } from "../../lib/profile/userProfile";
import type { OnboardingState, OnboardingStep } from "../../lib/onboarding/onboardingState";
import {
  defaultInitialState,
  calculateProgress,
  nextStep,
  prevStep,
  updateDraft,
} from "../../lib/onboarding/onboardingState";
import OnboardingScreen from "./OnboardingScreen";

/* OB5 — Props */
interface OnboardingFlowProps {
  initialState?: OnboardingState;
  onComplete?: (finalProfile: UserProfile) => void;
}

export default function OnboardingFlow({
  initialState,
  onComplete,
}: OnboardingFlowProps) {
  const [state, setState] = useState<OnboardingState>(
    initialState || defaultInitialState
  );

  const handleNext = useCallback(() => {
    setState((prev) => nextStep(prev));
  }, []);

  const handlePrev = useCallback(() => {
    setState((prev) => prevStep(prev));
  }, []);

  const handleUpdateDraft = useCallback(
    (partial: Partial<Pick<UserProfile, "name" | "age" | "bio" | "values" | "interests" | "photos" | "readyForMatch">>) => {
      setState((prev) => updateDraft(prev, partial));
    },
    []
  );

  const handleComplete = useCallback(() => {
    if (onComplete) {
      onComplete(state.profileDraft);
    }
    // Neste steg etter completion
    setState((prev) => {
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
      const idx = steps.indexOf(prev.currentStep);
      if (idx < 0) return prev;
      return { ...prev, currentStep: "completed", progress: 100 };
    });
  }, [onComplete, state.profileDraft]);

  const { currentStep, profileDraft, progress } = state;
  const isNotWelcome = currentStep !== "welcome";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white p-4">
      <div className="max-w-md w-full space-y-8">
        {/* OB9 — Progressbar */}
        <div className="w-full bg-[#e2e8f0] rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-200 to-emerald-200 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* OB19–OB20 — Skjerm-innhald */}
        <div className="bg-white rounded-2xl shadow-xl px-8 py-8 space-y-8 min-h-[400px] flex flex-col justify-center">
          <OnboardingScreen
            step={currentStep}
            name={profileDraft.name}
            age={profileDraft.age}
            bio={profileDraft.bio}
            values={profileDraft.values}
            interests={profileDraft.interests}
            photos={profileDraft.photos}
            readyForMatch={profileDraft.readyForMatch}
            onNameChange={(name) => handleUpdateDraft({ name })}
            onAgeChange={(age) => handleUpdateDraft({ age })}
            onBioChange={(bio) => handleUpdateDraft({ bio })}
            onValuesChange={(values) => handleUpdateDraft({ values })}
            onInterestsChange={(interests) => handleUpdateDraft({ interests })}
            onPhotosChange={(photos) => handleUpdateDraft({ photos })}
            onReadyChange={(readyForMatch) => handleUpdateDraft({ readyForMatch })}
            onNext={handleNext}
            onPrev={handlePrev}
            onComplete={handleComplete}
            onPhotoUpload={(idx) => {
              const newPhotos = [...profileDraft.photos];
              newPhotos[idx] = `https://placehold.co/400x500/e2e8f0/94a3b8?text=Bilde+${idx + 1}`;
              handleUpdateDraft({ photos: newPhotos });
            }}
            onPhotoRemove={(idx) => {
              const newPhotos = [...profileDraft.photos];
              newPhotos[idx] = "";
              handleUpdateDraft({ photos: newPhotos });
            }}
          />
        </div>

        {/* OB8 — Navigasjon (ikkje på welcome/completed) */}
        {currentStep !== "welcome" && currentStep !== "completed" && (
          <div className="flex justify-between px-2">
            <button
              onClick={handlePrev}
              className="px-6 py-2 text-xs rounded-xl bg-white border border-[#e2e8f0] text-[#4A4A4A]/60 hover:bg-[#f8fafc] transition-colors"
            >
              ← Tilbake
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-2 text-xs rounded-xl bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors font-medium"
            >
              Neste →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
