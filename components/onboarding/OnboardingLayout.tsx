"use client";

import FadeIn from "@/components/ui/FadeIn";
import { ReactNode } from "react";

/* ------------------------------------------------------------------ */
/* ToSom UI 5.0 — OnboardingLayout polish                               */
/* - Progress-text: "Steg X av Y" øvst                                   */
/* - Glassmorphism med gull-border                                       */
/* - Plassert gull-dots for aktiv progress                               */
/* ------------------------------------------------------------------ */

interface OnboardingLayoutProps {
  children: ReactNode;
  step: number;
  totalSteps: number;
}

export default function OnboardingLayout({ children, step, totalSteps }: OnboardingLayoutProps) {
  const progressText = `Steg ${step + 1} av ${totalSteps}`;

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8 relative"
      style={{ background: '#0B0E11' }}
    >
      {/* Ambient bakgrunn */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(80,120,255,0.08), transparent 70%)',
        }}
      />

      <div
        className="w-full max-w-lg relative"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1.5px solid rgba(212, 175, 55, 0.15)',
          borderRadius: '20px',
          boxShadow: '0 8px 40px rgba(0, 0, 0, 0.45), inset 0 0 20px rgba(255,255,255,0.04)',
          padding: '24px 32px',
        }}
      >
        {/* Progress */}
        <div className="flex items-center justify-between mb-6">
          <span
            className="text-xs font-medium tracking-widest uppercase"
            style={{ color: 'rgba(212, 175, 55, 0.6)' }}
          >
            {progressText}
          </span>

          <div className="flex gap-2">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className="h-1.5 rounded-full transition-all duration-500 ease-out"
                style={{
                  width: i === step ? '24px' : '8px',
                  height: '4px',
                  background: i === step
                    ? '#D4AF37'
                    : 'rgba(255, 255, 255, 0.08)',
                }}
              />
            ))}
          </div>
        </div>

        <FadeIn>{children}</FadeIn>
      </div>
    </div>
  );
}
