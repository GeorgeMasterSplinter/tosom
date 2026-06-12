"use client";

import FadeIn from "@/components/ui/FadeIn";
import PremiumButton from "@/components/ui/PremiumButton";
import { ReactNode } from "react";

interface OnboardingScreenProps {
  title?: string;
  text?: string | ReactNode;
  buttonLabel?: string;
  onNext: () => void;
  onPrev?: () => void;
  onComplete?: () => void;
  step?: string;
  name?: string;
  age?: number;
  bio?: string;
  values?: string[];
  interests?: string[];
  photos?: string[];
  readyForMatch?: boolean;
  onNameChange?: (name: string) => void;
  onAgeChange?: (age: number) => void;
  onBioChange?: (bio: string) => void;
  onValuesChange?: (values: string[]) => void;
  onInterestsChange?: (interests: string[]) => void;
  onPhotosChange?: (photos: string[]) => void;
  onReadyChange?: (readyForMatch: boolean) => void;
  onPhotoUpload?: (idx: number) => void;
  onPhotoRemove?: (idx: number) => void;
}

export default function OnboardingScreen({
  title,
  text,
  buttonLabel,
  onNext,
  onPrev,
  onComplete,
  step,
  name,
  age,
  bio,
  values,
  interests,
  photos,
  readyForMatch,
  onNameChange,
  onAgeChange,
  onBioChange,
  onValuesChange,
  onInterestsChange,
  onPhotosChange,
  onReadyChange,
  onPhotoUpload,
  onPhotoRemove,
}: OnboardingScreenProps) {
  return (
    <FadeIn>
      <div className="space-y-6 text-center">
        {title && (
          <h2 className="text-2xl font-semibold text-gold">{title}</h2>
        )}
        {text && (
          typeof text === "string" ? (
            <p className="text-white/80 leading-relaxed">{text}</p>
          ) : (
            <div className="text-white/80 leading-relaxed">{text}</div>
          )
        )}
        <div className="pt-2 space-y-3">
          {onPrev && (
            <div className="flex justify-center">
              <button
                onClick={onPrev}
                className="text-white/70 hover:text-white transition-colors text-sm"
              >
                Tilbake
              </button>
            </div>
          )}
          {buttonLabel && (
            <PremiumButton
              variant="primary"
              onClick={onNext}
              className="hover:scale-[1.02] transition-all duration-300"
            >
              {buttonLabel}
            </PremiumButton>
          )}
        </div>
      </div>
    </FadeIn>
  );
}