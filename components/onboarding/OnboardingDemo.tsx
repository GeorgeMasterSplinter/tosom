"use client";

/** OnboardingDemo — test heile onboardingflyten utan dashboard
 *  OB31–OB40 — demo med dummy-data, simuleringsknappar, logging, validering */

import { useState, useCallback } from "react";
import type { UserProfile } from "../../lib/profile/userProfile";
import { dummyUserProfile } from "../../lib/profile/userProfile";
import type { OnboardingState, OnboardingStep } from "../../lib/onboarding/onboardingState";
import {
  defaultInitialState,
  calculateProgress,
  nextStep,
  prevStep,
  updateDraft,
} from "../../lib/onboarding/onboardingState";
import OnboardingScreen from "./OnboardingScreen";

/* OB32 — Dummy initialState */
const demoInitialState: OnboardingState = {
  currentStep: "welcome",
  profileDraft: { ...dummyUserProfile },
  progress: 0,
};

export default function OnboardingDemo() {
  const [state, setState] = useState<OnboardingState>(demoInitialState);

  const handleNext = useCallback(() => {
    setState((prev) => {
      const next = nextStep(prev);
      console.log("[OnboardingDemo] Neste steg:", next.currentStep);
      return next;
    });
  }, []);

  const handlePrev = useCallback(() => {
    setState((prev) => {
      const prevStepState = prevStep(prev);
      console.log("[OnboardingDemo] Tilbake steg:", prevStepState.currentStep);
      return prevStepState;
    });
  }, []);

  const handleUpdateDraft = useCallback(
    (partial: Partial<Pick<UserProfile, "name" | "age" | "bio" | "values" | "interests" | "photos" | "readyForMatch">>) => {
      setState((prev) => {
        const newState = updateDraft(prev, partial);
        console.log("[OnboardingDemo] Profil oppdatert:", newState.profileDraft);
        return newState;
      });
    },
    []
  );

  const handleComplete = useCallback(() => {
    console.log("[OnboardingDemo] ✓ Onboarding fullført!");
    console.log("[OnboardingDemo] Final profil:", state.profileDraft);
  }, []);

  const { currentStep, profileDraft, progress } = state;
  const stepTitles: Record<OnboardingStep, string> = {
    welcome: "Velkommen til ToSom",
    name_age: "Kven er du?",
    values: "Hva er viktig for deg?",
    interests: "Hva liker du å gjere?",
    bio: "Fortell litt om deg sjølv",
    photos: "Legg til bilete",
    ready: "Klar for match?",
    completed: "Profilen din er klar",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-emerald-50 flex flex-col items-center justify-center p-4">
      {/* OB33 — Simuleringsknappar for steg */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setState(demoInitialState)}
          className="px-4 py-2 text-xs rounded-xl bg-white border border-[#e2e8f0] text-[#4A4A4A]/60 hover:bg-[#f8fafc] transition-colors"
        >
          ↺ Tilbakestart
        </button>
        <button
          onClick={() => {
            const steps: OnboardingStep[] = [
              "welcome", "name_age", "values", "interests",
              "bio", "photos", "ready", "completed",
            ];
            const idx = steps.indexOf(state.currentStep);
            if (idx >= 0 && idx < steps.length - 1) {
              const next = steps[idx + 1];
              setState((prev) => ({
                ...prev,
                currentStep: next,
                progress: calculateProgress(next),
              }));
              console.log("[OnboardingDemo] Hastig neste:", next);
            }
          }}
          className="px-4 py-2 text-xs rounded-xl bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors"
        >
            ⏭ Hastig neste
        </button>
      </div>

      {/* OB9 — Progressbar */}
      <div className="w-full max-w-md mb-4">
        <div className="flex justify-between text-xs text-[#4A4A4A]/40 mb-1">
          <span>
            {stepTitles[state.currentStep]}
          </span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-[#e2e8f0] rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-200 to-emerald-200 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Skjerm-innhald */}
      <div className="bg-white rounded-2xl shadow-xl px-8 py-8 space-y-8 w-full max-w-md min-h-[400px] flex flex-col justify-center">
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

      {/* OB34 — Live status-logging */}
      <div className="mt-6 w-full max-w-md">
        <details className="bg-white/80 rounded-xl p-4 text-xs font-mono">
          <summary className="cursor-pointer text-[#4A4A4A]/50 hover:text-[#4A4A4A]/70">
            📋 Live status
          </summary>
          <pre className="mt-2 text-[#4A4A4A]/60 whitespace-pre-wrap break-all">
            {JSON.stringify({
              step: currentStep,
              progress,
              profile: {
                name: profileDraft.name,
                age: profileDraft.age,
                valuesCount: profileDraft.values.length,
                interestsCount: profileDraft.interests.length,
                bioLength: profileDraft.bio.length,
                photosCount: profileDraft.photos.filter(Boolean).length,
                readyForMatch: profileDraft.readyForMatch,
              },
            }, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
}
