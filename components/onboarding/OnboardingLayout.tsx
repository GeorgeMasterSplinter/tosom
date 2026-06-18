"use client";

import FadeIn from "@/components/ui/FadeIn";
import { ReactNode } from "react";

interface OnboardingLayoutProps {
  children: ReactNode;
  step: number;
  totalSteps: number;
}

export default function OnboardingLayout({ children, step, totalSteps }: OnboardingLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex items-center justify-center px-4 py-8">
      <div
        className="w-full max-w-lg bg-[var(--color-card)] border border-[var(--color-card-border)] backdrop-blur-xl rounded-3xl p-8 md:p-10 space-y-6"
      >
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === step
                  ? "bg-[var(--color-gold)] w-6"
                  : "bg-white/20"
              }`}
            />
          ))}
        </div>
        <FadeIn>{children}</FadeIn>
      </div>
    </div>
  );
}