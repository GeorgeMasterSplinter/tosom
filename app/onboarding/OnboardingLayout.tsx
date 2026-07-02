/**
 * ToSom — OnboardingLayout
 * Kun container: progressbar, header, children.
 * Ingen knappar — kvart steg rendrer sine eigne.
 */

'use client';

import { FC, ReactNode } from 'react';

interface OnboardingLayoutProps {
  currentStep: number;
  totalSteps: number;
  title: string;
  subtitle: string;
  children: ReactNode;
  progressPercent?: number;
  guidingText?: string;
  trustText?: string;
}

export const OnboardingLayout: FC<OnboardingLayoutProps> = ({
  currentStep,
  totalSteps,
  title,
  subtitle,
  guidingText,
  trustText,
  children,
  progressPercent,
}) => {
  const progress = progressPercent ?? ((currentStep) / totalSteps) * 100;

  return (
    <div className="min-h-screen flex items-start justify-center px-4 py-12 relative bg-gradient-to-b from-[#0B1520] via-[#121E2E] to-[#0B1520]">
      {/* Spotlight overlay — identisk med premium-profil */}
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
        {/* Progress bar */}
        <div className="px-8 pt-8 pb-4">
          <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255, 255, 255, 0.06)' }}>
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, rgba(212,175,55,0.8) 0%, rgba(232,194,122,1) 100%)',
                boxShadow: '0 0 16px rgba(212, 175, 55, 0.35)',
              }}
            />
          </div>
          <p className="text-xs mt-2 text-right" style={{ color: 'rgba(255, 255, 255, 0.3)' }}>
            Du er {Math.round(progress)}% ferdig — fortsett i ditt eget tempo.
          </p>
        </div>

        {/* Header */}
        <div className="px-8 pt-4 pb-6">
          <h1 className="text-2xl md:text-3xl font-light tracking-tight" style={{ color: '#FFFFFF' }}>
            {title}
          </h1>
          {guidingText && (
            <p className="text-base mt-2 leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.70)' }}>
              {guidingText}
            </p>
          )}
          <p className="text-sm mt-2 leading-relaxed italic" style={{ color: 'rgba(212, 175, 55, 0.55)' }}>
            {subtitle}
          </p>
        </div>

        {/* Children — form fields */}
        <div className="px-8 pb-6">{children}</div>

        {/* Trust text */}
        {trustText && (
          <div className="px-8 pb-8">
            <p className="text-xs text-center" style={{ color: 'rgba(255, 255, 255, 0.35)' }}>
              {trustText}
            </p>
          </div>
        )}

        {/* Ingen knappar — kvart steg rendrer sine eigne */}
      </div>
    </div>
  );
};