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
import { LogoAnimated } from '@/components/branding/LogoVariants';
import { color, spacing } from '@/config/design-tokens';

/* ========================
   INTERFACES
   ======================== */

interface HeroProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
  secondaryText?: string;
  secondaryHref?: string;
}

/* ========================
   COMPONENT
   ======================== */

export const Hero: FC<HeroProps> = ({
  title = 'Ro. Tryggleik. Dybde.',
  subtitle = 'Ein match innan 24 timer',
  ctaText = 'Kom i gang',
  ctaHref = '/onboarding',
  secondaryText = 'Logg inn',
  secondaryHref = '/login',
}) => {
  const keyPoints = [
    { 
      title: 'Djup profil', 
      label: 'Forskning basert',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M20.5 21C20.5 18.7909 18.7091 17 16.5 17H7.5C5.29086 17 3.5 18.7909 3.5 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    { 
      title: 'Éin match', 
      label: 'Kvalitet over kvantitet',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L15 8L21 9L16.5 14L18 21L12 17.5L6 21L7.5 14L3 9L9 8L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    { 
      title: 'Guidet reise', 
      label: '30 dager sammen',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L18 5V12C18 16.5 14.5 20.5 12 22C9.5 20.5 6 16.5 6 12V5L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
  ];

  return (
    <section
      className="relative overflow-hidden"
      style={{
        paddingTop: `${spacing['4xl']}px`,
        paddingBottom: `${spacing['4xl']}px`,
        background: 'linear-gradient(180deg, #162032 0%, #0F1923 50%, #0B1520 100%)',
      }}
    >
      {/* Ambient blå glød — redusert styrke */}
      <div
        className="absolute top-0 right-0 w-[800px] h-[600px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 70% 20%, rgba(80,120,255,0.04), transparent 70%)',
        }}
      />

      {/* Gull-aksent glød — subtil */}
      <div
        className="absolute top-[30%] left-0 w-[600px] h-[500px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 30% 50%, rgba(212,175,55,0.02), transparent 70%)',
        }}
      />

      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          
          {/* Animert tekst-logo */}
          <div className="flex justify-center mb-10">
            <LogoAnimated />
          </div>

          {/* H1 — kort, roleg */}
          <h1
            className="text-3xl md:text-[48px] font-semibold tracking-[-0.02em] leading-[1.15] mb-4"
            style={{ color: color.text.primary }}
          >
            {title}
          </h1>

          {/* Undertekst — kort */}
          <p
            className="text-base mb-8"
            style={{ 
              color: color.text.secondary,
              lineHeight: '1.6',
            }}
          >
            {subtitle}
          </p>

          {/* CTA-knappar — kompakt */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
            <Link
              href={ctaHref}
              className="inline-flex items-center justify-center px-10 py-3.5 rounded-[12px] font-medium transition-all duration-300 text-sm"
              style={{
                background: color.brand.gold,
                color: '#0B1520',
                boxShadow: `0 0 30px ${color.ambient.gold.medium}, 0 4px 12px rgba(0,0,0,0.2)`,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = color.brand['gold-hover'];
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = color.brand.gold;
              }}
            >
              {ctaText}
            </Link>

            {secondaryText && (
              <Link
                href={secondaryHref}
                className="text-sm transition-colors"
                style={{ 
                  color: color.text.muted,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = color.text.secondary;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = color.text.muted;
                }}
              >
                {secondaryText}
              </Link>
            )}
          </div>

          {/* Tre nøkkelpunkter — med undertittel */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 md:gap-x-14 gap-y-10 text-center max-w-3xl mx-auto">
            {keyPoints.map((point, idx) => (
              <div key={idx} className="flex flex-col items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: 'rgba(212,175,55,0.08)',
                    border: '1px solid rgba(212,175,55,0.15)',
                    color: color.brand.gold,
                  }}
                >
                  {point.icon}
                </div>
                <h3 
                  className="text-sm font-semibold"
                  style={{ color: color.text.primary }}
                >
                  {point.title}
                </h3>
                <span 
                  className="text-xs"
                  style={{ 
                    color: color.text.muted,
                    lineHeight: '1.55',
                  }}
                >
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