/**
 * ToSom UI 5.0 — Matching 2.0 (Round 3 Premium Visual Polish)
 * 
 * Forbedringar:
 * - Større ikon (30% større) med puls-glow
 * - Gull-linje mellom kolonnar med glow
 * - Glass-panel bak kvar kolonne
 * - Større seksjonstittel
 * Bokmål
 */

'use client';

import { FC } from 'react';

interface MatchingProps {
  title?: string;
  subtitle?: string;
  leftIcon?: string;
  leftTitle?: string;
  leftText?: string;
  rightIcon?: string;
  rightTitle?: string;
  rightText?: string;
  footerText?: string;
}

export const MatchingSection: FC<MatchingProps> = ({
  title = 'Kunnskapsbasert matching',
  subtitle = 'Éin match – basert på verdier, livssituasjon og relasjonsstil.',
  leftIcon = '◎',
  leftTitle = 'Éin match innan 24 timer',
  leftText = 'Når du har fullført profilen din, får du éin match innan 24 timer. Ikkje mange. Ikkje tilfeldig. Den beste kompatibiliteten for deg.',
  rightIcon = '⭐',
  rightTitle = 'Resonans-matching',
  rightText = 'Vi matcher basert på verdier, emosjonelle mønster, livssituasjon og relasjonsstil – ikkje overflatiske kriterier.',
  footerText = 'ToSom handlar om kvalitet, ikkje kvantitet. Éin god match er betre enn hundre tilfeldige.',
}) => {
  return (
    <section
      className="py-32 md:py-48 mb-28 md:mb-32 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0B0F14 0%, #0E1218 50%, #0B0F14 100%)' }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 50% 50% at 30% 40%, rgba(80,120,255,0.06), transparent 70%),
            radial-gradient(ellipse 50% 50% at 70% 60%, rgba(212,175,55,0.04), transparent 60%)
          `,
        }}
      />
      
      <div className="mx-auto max-w-6xl px-6 lg:px-8 relative z-10">
        {/* Seksjonstittel */}
        <div className="text-center mt-8">
          <h2
            className="text-3xl md:text-[42px] font-semibold tracking-[-0.02em] text-white leading-[1.1] mb-10"
          >
            {title}
          </h2>
          <p
            className="text-lg md:text-xl text-gray-300 font-medium max-w-lg mx-auto leading-[1.6]"
          >
            {subtitle}
          </p>
        </div>

        {/* 2-kolonne layout med gull-linje */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-28 md:gap-y-28 gap-x-12 md:gap-x-20 mt-20 relative">
          {/* Gull-linje mellom kolonnar med glow */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2">
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(180deg, transparent, rgba(212,175,55,0.6) 20%, rgba(212,175,55,0.6) 80%, transparent)',
                boxShadow: '0 0 20px rgba(212,175,55,0.35)',
              }}
            />
          </div>

          {/* Venstre side — glass-panel */}
          <div className="relative group">
            <div
              className="absolute inset-0 rounded-2xl opacity-60 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(212, 175, 55, 0.08)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 40px rgba(0,0,0,0.35), inset 0 0 20px rgba(255,255,255,0.03)',
              }}
            />
            <div className="relative z-10 flex flex-col gap-4 text-left p-6">
              {/* Ikon — 30% større, puls-glow */}
              <div
                className="text-6xl md:text-7xl mt-2 mb-2 flex items-center pulse-icon"
                style={{
                  filter: 'drop-shadow(0 0 12px rgba(212,175,55,0.3))',
                }}
              >
                {leftIcon}
              </div>
              <h3 className="text-xl md:text-2xl font-semibold tracking-[-0.005em] text-white">
                {leftTitle}
              </h3>
              <p className="text-gray-400 text-sm md:text-base leading-[1.7] max-w-md">
                {leftText}
              </p>
            </div>
          </div>

          {/* Høyre side — glass-panel */}
          <div className="relative group">
            <div
              className="absolute inset-0 rounded-2xl opacity-60 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(212, 175, 55, 0.08)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 40px rgba(0,0,0,0.35), inset 0 0 20px rgba(255,255,255,0.03)',
              }}
            />
            <div className="relative z-10 flex flex-col gap-4 text-left p-6">
              {/* Ikon — 30% større, puls-glow */}
              <div
                className="text-6xl md:text-7xl mt-2 mb-2 flex items-center pulse-icon"
                style={{
                  filter: 'drop-shadow(0 0 12px rgba(212,175,55,0.3))',
                }}
              >
                {rightIcon}
              </div>
              <h3 className="text-xl md:text-2xl font-semibold tracking-[-0.005em] text-white">
                {rightTitle}
              </h3>
              <p className="text-gray-400 text-sm md:text-base leading-[1.7] max-w-md">
                {rightText}
              </p>
            </div>
          </div>
        </div>

        {/* Bunntekst */}
        {footerText && (
          <p
            className="text-center text-gray-400 font-medium text-sm md:text-base max-w-md mx-auto mt-28 leading-[1.6]"
          >
            {footerText}
          </p>
        )}
      </div>
    </section>
  );
};

export default MatchingSection;