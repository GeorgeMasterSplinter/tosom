/**
 * Tosom — OnboardingSlide (Premium Slide Component)
 *
 * En slide-per-komponent med subtil fargeidentitet pr. seksjon,
 * fade-in animasjon, og dempet glass-design som speiler dashboard.
 */

'use client';

import { useEffect, useState } from 'react';
import { OB, sectionColor } from '@/app/onboarding/theme';

interface OnboardingSlideProps {
  title: string;
  subtitle?: string;
  guidingText?: string;
  children: React.ReactNode;
  slideIndex?: number;
  totalSlides?: number;
  accentColor?: string;
}

export function OnboardingSlide({
  title,
  subtitle,
  guidingText,
  children,
  slideIndex = 0,
  totalSlides = 1,
  accentColor = OB.section.identity,
}: OnboardingSlideProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="w-full transition-all duration-700 ease-out"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(12px)',
      }}
      suppressHydrationWarning
    >
      <div
        className="relative overflow-hidden"
        style={{
          background: OB.glassBg,
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: `1px solid ${OB.glassBorder}`,
          borderRadius: '20px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        }}
      >
        {/* Spotlight overlay — subtil i seksjonsfargen */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 30% 20%, ${sectionColor(accentColor, 6)} 0%, transparent 60%)`,
          }}
        />

        <div className="relative z-10 px-4 py-6 sm:px-6 sm:py-7 md:px-8 md:py-9">
          {/* Slide indicator */}
          {totalSlides > 1 && (
            <div className="flex items-center justify-center gap-1.5 mb-7" suppressHydrationWarning>
              {Array.from({ length: totalSlides }).map((_, i) => (
                <div
                  key={i}
                  className="h-1 rounded-full transition-all duration-300"
                  style={{
                    width: i === slideIndex ? '20px' : '6px',
                    background: i === slideIndex
                      ? accentColor
                      : 'rgba(255,255,255,0.1)',
                    opacity: i === slideIndex ? 1 : 0.6,
                  }}
                />
              ))}
            </div>
          )}

          {/* Header */}
          <div className="mb-7">
            {/* Steg-indikator — nøytral */}
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-[4px] h-[4px] rounded-full"
                style={{ background: sectionColor(accentColor, 50) }}
              />
              <span
                className="text-[11px] uppercase tracking-[0.1em]"
                style={{ color: OB.textMuted }}
                data-testid="ob-step-indicator"
              >
                Steg {slideIndex + 1} av {totalSlides}
              </span>
            </div>

            {/* Overskrift */}
            <h1
              className="text-[28px] md:text-[34px] font-light leading-tight mb-3"
              style={{
                color: OB.textPrimary,
                letterSpacing: '-0.02em',
              }}
              data-testid="ob-step-title"
            >
              {title}
            </h1>

            {subtitle && (
              <p className="text-[15px] leading-relaxed mb-3" style={{ color: OB.textSecondary }}>
                {subtitle}
              </p>
            )}

            {guidingText && (
              <p className="text-[14px] leading-relaxed" style={{ color: OB.textMuted }}>
                {guidingText}
              </p>
            )}
          </div>

          {/* Divider */}
          <div className="mb-7" style={{ borderTop: `1px solid ${OB.divider}` }} />

          {/* Children */}
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}