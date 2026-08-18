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
    <div className="w-full relative">
      {/* Error summary */}
      {error && (
        <div className="mb-4">
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

      {/* Children — glass-kortet renderast av OnboardingSlide (én kort, ikkje nestla) */}
      <div>{children}</div>
    </div>
  );
};