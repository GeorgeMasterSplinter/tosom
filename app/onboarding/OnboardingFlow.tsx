"use client";

/** OnboardingFlow — hovudkomponent for onboarding-prosessen
 *  OB5–OB10 — flow-logikk, layout, navigasjon, progressbar
 *  OB10 — ingen backend, bare UI + dummy-data
 *  Premium UI Polish DEL 3: Card, PremiumButton, CSS-variablar, glassmorphism, dark-mode */

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
;import OnboardingScreen from "../../components/onboarding/OnboardingScreen";
import Card from "@/components/ui/Card";
import PremiumButton from "@/components/ui/PremiumButton";
import FadeIn from "@/components/ui/FadeIn";
import Typography from "@/components/ui/Typography";

const { BodySm } = Typography;

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
    [setState]
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-bg)]/[0.95]">
      <FadeIn>
        <div className="max-w-md w-full gap-[var(--space-md)]">
          {/* Premium Progressbar */}
          <div className="w-full h-2 rounded-[var(--radius-full)] overflow-hidden bg-[var(--color-card)]">
            <div
              className="h-full bg-gradient-to-r from-[var(--color-gold)]/60 to-[var(--color-gold)] rounded-[var(--radius-full)] transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Card: Onboarding content */}
          <Card className="gap-[var(--space-md)] min-h-[400px] flex flex-col justify-center transition-all duration-300 ease-out hover:scale-[1.002]">
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
          </Card>

          {/* Navigasjon */}
          {currentStep !== "welcome" && currentStep !== "completed" && (
            <div className="flex justify-between px-[var(--space-xs)]">
              <PremiumButton
                variant="secondary"
                onClick={handlePrev}
                className="text-sm"
              >
                ← Tilbake
              </PremiumButton>
              <PremiumButton
                variant="primary"
                onClick={handleNext}
                className="text-sm"
              >
                Neste →
              </PremiumButton>
            </div>
          )}
        </div>
      </FadeIn>
    </div>
  );
}