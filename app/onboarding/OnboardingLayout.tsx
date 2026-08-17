/**
 * Tosom — OnboardingLayout (simplified — no duplicate headers)
 * Kun container: progressbar + children.
 * Header (steg-indikator, tittel, undertittel, guidingText) vert rendera av hvart steg-komponent.
 */

'use client';

import { FC, ReactNode } from 'react';

interface OnboardingLayoutProps {
  currentStep: number;
  totalSteps: number;
  children: ReactNode;
  progressPercent?: number;
  error?: string | null;
}

export const OnboardingLayout: FC<OnboardingLayoutProps> = ({
  currentStep,
  totalSteps,
  children,
  progressPercent,
  error,
}) => {
  const progress = progressPercent ?? ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="min-h-screen flex items-start justify-center px-4 py-12 relative bg-gradient-to-b from-[#0B1520] via-[#121E2E] to-[#0B1520]">
      {/* Spotlight overlay */}
      <div className="absolute inset-0 bg-white/5 blur-3xl opacity-[0.06] pointer-events-none" />

      <div
        className="w-full max-w-2xl animate-subtlePop relative z-10"
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '24px',
          boxShadow: '0 8px 40px rgba(0, 0, 0, 0.35), inset 0 0 20px rgba(255, 255, 255, 0.03)',
        }}
      >
        {/* Error summary */}
        {error && (
          <div className="px-8 pt-8 pb-4">
            <div className="rounded-xl p-4 border" style={{
              background: 'rgba(255, 77, 77, 0.08)',
              borderColor: 'rgba(255, 77, 77, 0.2)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            }}>
              <p className="text-sm font-medium mb-1" style={{ color: '#FF4D4D' }}>
                ✕ Det blei ein feil
              </p>
              <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                {error}
              </p>
            </div>
          </div>
        )}

        {/* Progress bar */}
        <div className="px-6 pt-3 pb-3">
          <p className="text-xs mt-4 text-center animate-fadeIn" style={{ color: 'rgba(255, 255, 255, 0.3)', animationDuration: '500ms' }}>
            Fortsett i ditt eget tempo.
          </p>
        </div>

        {/* Children — form fields (header renderas av OnboardingSlide) */}
        <div className="px-8 pb-6">{children}</div>
      </div>
    </div>
  );
};