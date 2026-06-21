/**
 * ToSom – OnboardingLayout
 * Premium glassmorphism container med progress bar, header og navigasjon.
 */

'use client';

import { FC, ReactNode } from 'react';

interface OnboardingLayoutProps {
  currentStep: number;
  totalSteps: number;
  title: string;
  subtitle: string;
  children: ReactNode;
  onNext: () => void;
  onBack?: () => void;
  showBack?: boolean;
  showNext?: boolean;
  nextLabel?: string;
  disabledNext?: boolean;
  exampleText?: string;
}

export const OnboardingLayout: FC<OnboardingLayoutProps> = ({
  currentStep,
  totalSteps,
  title,
  subtitle,
  children,
  onNext,
  onBack,
  showBack = true,
  showNext = true,
  nextLabel = 'Neste',
  disabledNext = false,
  exampleText,
}) => {
  const progress = ((currentStep) / totalSteps) * 100;

  return (
    <div className="min-h-screen flex items-start justify-center px-4 py-12" style={{ background: '#0B0E11' }}>
      <div
        className="w-full max-w-2xl animate-subtlePop"
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '24px',
          boxShadow: '0 8px 40px rgba(0, 0, 0, 0.35), inset 0 0 20px rgba(255, 255, 255, 0.03)',
        }}
      >
        {/* Progress bar */}
        <div className="px-8 pt-8 pb-4">
          <div className="w-full h-1 rounded-full" style={{ background: 'rgba(255, 255, 255, 0.06)' }}>
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #D4AF37, #E8C766)',
                boxShadow: '0 0 12px rgba(212, 175, 55, 0.3)',
              }}
            />
          </div>
          <p
            className="text-xs mt-2 text-right"
            style={{ color: 'rgba(255, 255, 255, 0.3)' }}
          >
            {currentStep} / {totalSteps}
          </p>
        </div>

        {/* Header */}
        <div className="px-8 pt-4 pb-6">
          <h1
            className="text-2xl md:text-3xl font-semibold tracking-tight"
            style={{ color: '#FFFFFF' }}
          >
            {title}
          </h1>
          <p
            className="text-base mt-2 leading-relaxed"
            style={{ color: 'rgba(255, 255, 255, 0.55)' }}
          >
            {subtitle}
          </p>
          {exampleText && (
            <p
              className="text-sm mt-3 italic"
              style={{ color: 'rgba(212, 175, 55, 0.5)' }}
            >
              {exampleText}
            </p>
          )}
        </div>

        {/* Children */}
        <div className="px-8 pb-6">{children}</div>

        {/* Navigation */}
        {showNext && (
          <div className="px-8 pb-8 flex gap-3">
            {showBack && (
              <button
                onClick={onBack}
                className="
                  px-6 py-3 rounded-xl text-sm font-medium
                  transition-all duration-200 ease-out
                  border
                "
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'rgba(255, 255, 255, 0.6)',
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  (e.target as HTMLElement).style.color = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  (e.target as HTMLElement).style.color = 'rgba(255, 255, 255, 0.6)';
                }}
              >
                Tilbake
              </button>
            )}
            <button
              onClick={onNext}
              disabled={disabledNext}
              className="
                flex-1 px-6 py-3 rounded-xl text-sm font-semibold
                transition-all duration-200 ease-out
              "
              style={{
                background: disabledNext
                  ? 'rgba(212, 175, 55, 0.2)'
                  : '#D4AF37',
                color: disabledNext ? 'rgba(255, 255, 255, 0.3)' : '#0B0E11',
                cursor: disabledNext ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={(e) => {
                if (!disabledNext) {
                  (e.target as HTMLElement).style.background = '#E8C766';
                  (e.target as HTMLElement).style.transform = 'translateY(-1px)';
                  (e.target as HTMLElement).style.boxShadow = '0 0 30px rgba(212, 175, 55, 0.35)';
                }
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.background = disabledNext
                  ? 'rgba(212, 175, 55, 0.2)'
                  : '#D4AF37';
                (e.target as HTMLElement).style.transform = 'translateY(0)';
                (e.target as HTMLElement).style.boxShadow = 'none';
              }}
            >
              {nextLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};