/**
 * ToSom UI 5.0 — Hero 2.0 (Round 3 Premium Visual Polish)
 * 
 * Forbedringar:
 * - Større H1: 68px på desktop
 * - Spotlight bak H1
 * - Meir spacing: H1→subtitle 48px, subtitle→CTA 48px
 * - Visuell djupne med layered gradients
 * - CTA med 1px gull-stroke og sterkare glow
 * Bokmål
 */

'use client';

import { FC } from 'react';
import Link from 'next/link';

interface HeroProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
  secondaryText?: string;
  secondaryHref?: string;
}

export const Hero: FC<HeroProps> = ({
  title = 'En rolig, moderne relasjonsplattform for voksne',
  subtitle = 'Få én match innan 24 timer — basert på verdier, livssituasjon og relasjonsstil.',
  ctaText = 'Opprett konto',
  ctaHref = '/onboarding',
  secondaryText = 'Logg inn',
  secondaryHref = '/login',
}) => {
  const keyPoints = [
    { label: 'Veiledet, forskningsbasert profil' },
    { label: 'Match innen 24 timer' },
    { label: 'Guidet 30-dagers reise' },
  ];

  return (
    <section
      className="relative pt-28 py-32 md:py-48 mb-24 md:mb-32 overflow-hidden"
      style={{ background: '#0B0F14' }}
    >
      {/* Spotlight bak H1 */}
      <div
        className="absolute top-[20%] left-[40%] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle at center, rgba(255,255,255,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Subtil vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, transparent 50%, rgba(0,0,0,0.15) 100%)',
        }}
      />

      {/* Subtil bakgrunnsform */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{ opacity: 0.06 }}
      >
        <svg width="600" height="600" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="15" cy="20" r="12" fill="#D4AF37" />
          <circle cx="25" cy="20" r="12" fill="#D4AF37" />
          <circle cx="20" cy="20" r="6" fill="#D4AF37" />
        </svg>
      </div>

      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          {/* Logo */}
          <div className="flex justify-center mb-16">
            <svg width="56" height="56" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="15" cy="20" r="12" fill="none" stroke="#D4AF37" strokeWidth="1.5" />
              <circle cx="25" cy="20" r="12" fill="none" stroke="#D4AF37" strokeWidth="1.5" />
              <circle cx="20" cy="20" r="6" fill="none" stroke="#D4AF37" strokeWidth="1" />
            </svg>
          </div>

          {/* H1 — 68px på desktop, spotlight-effekt */}
          <h1
            className="text-4xl md:text-[68px] font-semibold tracking-[-0.02em] leading-[1.1] mb-12 relative"
            style={{
              color: '#FFFFFF',
              textShadow: '0 0 40px rgba(255,255,255,0.08)',
            }}
          >
            {title}
          </h1>

          {/* Undertekst — meir spacing ned til CTA */}
          <p
            className="text-lg md:text-xl text-gray-300 font-medium max-w-lg mx-auto mb-16 leading-[1.6]"
          >
            {subtitle}
          </p>

          {/* CTA-container — gap-6, 1px gull-stroke */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20">
            {/* Primær CTA — med 1px gull-stroke og sterkare glow */}
            <Link
              href={ctaHref}
              className="inline-block px-12 py-5 rounded-xl font-medium bg-[#D4AF37] text-black shadow-sm transition-all duration-300 border border-[rgba(212,175,55,0.3)] hover:border-[rgba(212,175,55,0.5)] hover:shadow-[0_0_50px_rgba(212,175,55,0.5)]"
              style={{
                boxShadow: '0 0 40px rgba(212,175,55,0.35), 0 4px 16px rgba(0,0,0,0.2)',
              }}
            >
              {ctaText}
            </Link>

            {/* Sekundær CTA */}
            {secondaryText && (
              <Link
                href={secondaryHref}
                className="text-gray-300 hover:text-gray-100 transition-colors text-sm underline-offset-4 mt-4"
              >
                {secondaryText}
              </Link>
            )}
          </div>

          {/* Tre nøkkelpunkter — meir luft */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-28 md:gap-y-28 gap-x-16 md:gap-x-20 mt-20 text-left max-w-3xl mx-auto">
            {keyPoints.map((point) => (
              <div key={point.label} className="flex items-start gap-2">
                <div className="flex-shrink-0 mt-2.5">
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="7" stroke="#D4AF37" strokeWidth="1" opacity="0.4" />
                    <path d="M5 8L7 10L11 6" stroke="#D4AF37" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
                  </svg>
                </div>
                <span className="text-sm md:text-base text-gray-300 leading-[1.7] max-w-md">
                  {point.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;