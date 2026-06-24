/**
 * ToSom — Global CTA (Call to Action)
 * 
 * Standardisert CTA-knapp-komponent for hele ToSom.
 * Premium finish med gull-gradient, glød og micro-interactions.
 */

'use client';

import { FC } from 'react';

export interface CTAProps {
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  className?: string;
}

export const CTA: FC<CTAProps> = ({
  primaryLabel = 'Opprett konto',
  primaryHref = '/onboarding/start',
  secondaryLabel = 'Logg inn',
  secondaryHref = '/logg-inn',
  className = '',
}) => {
  return (
    <div className={`flex flex-col md:flex-row items-center justify-center gap-4 ${className}`}>
      {/* Primær CTA */}
      <a
        href={primaryHref}
        className="w-[340px] h-[72px] flex items-center justify-center rounded-[12px] font-semibold text-lg transition-all duration-200 ease-out group relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #D4AF37 0%, #E8C766 100%)',
          color: '#0B0E11',
          boxShadow: '0 0 40px rgba(212,175,55,0.25), 0 4px 12px rgba(0,0,0,0.2), 0.5px 0.5px 0 rgba(255,255,255,0.1) inset',
          border: '0.5px solid rgba(255,255,255,0.15)',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.transform = 'scale(1.015)';
          (e.currentTarget as HTMLElement).style.boxShadow = '0 0 55px rgba(212,175,55,0.35), 0 4px 16px rgba(215,215,0,0.25), 0.5px 0.5px 0 rgba(255,255,255,0.15) inset';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
          (e.currentTarget as HTMLElement).style.boxShadow = '0 0 40px rgba(212,175,55,0.25), 0 4px 12px rgba(0,0,0,0.2), 0.5px 0.5px 0 rgba(255,255,255,0.1) inset';
        }}
      >
        {primaryLabel}
      </a>
      {/* Sekundær CTA */}
      <a
        href={secondaryHref}
        className="w-[340px] h-[72px] flex items-center justify-center rounded-[12px] font-medium text-lg transition-all duration-200 ease-out backdrop-blur-xl"
        style={{
          background: 'rgba(255,255,255,0.03)',
          color: '#FFFFFF',
          border: '1px solid rgba(255,255,255,0.15)',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.transform = 'scale(1.015)';
          (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)';
          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.25)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
          (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)';
          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)';
        }}
      >
        {secondaryLabel}
      </a>
    </div>
  );
};

export default CTA;