"use client";

import FadeIn from "@/components/ui/FadeIn";
import PremiumButton from "@/components/ui/PremiumButton";
import { ReactNode } from "react";

interface OnboardingScreenProps {
  title: string;
  text: string | ReactNode;
  buttonLabel: string;
  onNext: () => void;
}

export default function OnboardingScreen({
  title,
  text,
  buttonLabel,
  onNext,
}: OnboardingScreenProps) {
  return (
    <FadeIn>
      <div className="space-y-6 text-center">
        <h2 className="text-2xl font-semibold text-gold">{title}</h2>
        {typeof text === "string" ? (
          <p className="text-white/80 leading-relaxed">{text}</p>
        ) : (
          <div className="text-white/80 leading-relaxed">{text}</div>
        )}
        <div className="pt-2">
          <PremiumButton
            variant="primary"
            onClick={onNext}
            className="hover:scale-[1.02] transition-all duration-300"
          >
            {buttonLabel}
          </PremiumButton>
        </div>
      </div>
    </FadeIn>
  );
}
