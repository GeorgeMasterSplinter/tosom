/**
 * ToSom — OnboardingSlide (Premium Slide Component)
 * 
 * Ein slide-per-komponent med gull-bokmerke, fade-in animasjon,
 * og 130% zoom designsystem (32–48px spacing).
 */

'use client';

import { useEffect, useState } from 'react';

interface OnboardingSlideProps {
  title: string;
  subtitle?: string;
  guidingText?: string;
  children: React.ReactNode;
  slideIndex?: number;
  totalSlides?: number;
}

/**
 * Premium Slide-komponent med:
 * - Gull-bokmerke for aktivt steg
 * - Fade-in animasjon
 * - Stor typografi (36–42px overskrift)
 * - Breid glassmorphism card med 130% zoom spacing
 */
export function OnboardingSlide({
  title,
  subtitle,
  guidingText,
  children,
  slideIndex = 0,
  totalSlides = 1,
}: OnboardingSlideProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fade-in etter mount
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
      <div
        className="w-full max-w-2xl mx-auto transition-all duration-700 ease-out"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(12px)',
        }}
        suppressHydrationWarning
      >
      {/* Glass card med 48–64px padding og 130% zoom spacing */}
      <div
        className="relative overflow-hidden"
        style={{
          background: 'rgba(255, 255, 255, 0.04)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '24px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25), inset 0 0 24px rgba(255, 255, 255, 0.02)',
        }}
      >
        {/* Spotlight overlay — premium djupne */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(circle at 30% 20%, rgba(212, 175, 55, 0.06) 0%, transparent 60%)',
        }} />

         <div className="relative z-10" style={{ padding: '36px' }}>
           {/* Slide indicator */}
          {totalSlides > 1 && (
            <div className="flex items-center justify-center gap-2 mb-8" suppressHydrationWarning>
              {Array.from({ length: totalSlides }).map((_, i) => (
                <div
                  key={i}
                  className="h-1.5 rounded-full transition-all duration-400"
                  style={{
                    width: i === slideIndex ? '32px' : '8px',
                    background: i === slideIndex
                      ? 'linear-gradient(90deg, #D4AF37, #E8C766)'
                      : 'rgba(255, 255, 255, 0.12)',
                  }}
                />
              ))}
            </div>
          )}

          {/* Header med gull-bokmerke og stor typografi */}
          <div className="mb-8">
            {/* Gull-bokmerke */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  background: 'linear-gradient(135deg, #D4AF37, #E8C766)',
                  boxShadow: '0 0 12px rgba(212, 175, 55, 0.4)',
                }}
              />
              <span className="text-xs uppercase tracking-widest" style={{ color: 'rgba(212, 175, 55, 0.6)' }}>
                Steg {slideIndex + 1} av {totalSlides}
              </span>
            </div>

            {/* Overskrift med stor typografi (36–42px) */}
            <h1
              className="text-[36px] md:text-[42px] font-light leading-tight mb-3"
              style={{
                color: '#FFFFFF',
                letterSpacing: '-0.03em',
              }}
            >
              {title}
            </h1>

            {/* Undertittel */}
            {subtitle && (
              <p className="text-[18px] leading-relaxed mb-4" style={{ color: 'rgba(255, 255, 255, 0.65)' }}>
                {subtitle}
              </p>
            )}

            {/* Guiding text (gull-farge) */}
            {guidingText && (
              <p
                className="text-[16px] leading-relaxed italic"
                style={{
                  color: 'rgba(212, 175, 55, 0.7)',
                  fontStyle: 'italic',
                }}
              >
                {guidingText}
              </p>
            )}
          </div>

          {/* Divider */}
          <div className="mb-8" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)' }} />

           {/* Children — innhaldet (breiare) */}
           <div style={{ padding: '0 4px' }}>
             {children}
           </div>
        </div>
      </div>
    </div>
  );
}