/**
 * ToSom UI 5.0 — Trust 2.0 (Round 3 Premium Visual Polish)
 * 
 * Forbedringar:
 * - Mørkare bakgrunn med subtil vignette
 * - Glasskort med sterkare blur (20px) og gull-border 1.5px
 * - Indre shadow på korta
 * - Større ikon (20% større)
 * - high-tech shield-ikon
 * - Hover: scale-[1.03] med gull-glow
 * Bokmål
 */

'use client';

import { FC } from 'react';

interface TrustItem {
  icon: string;
  title: string;
  description: string;
}

interface TrustSectionProps {
  title?: string;
  subtitle?: string;
  items?: TrustItem[];
  footerText?: string;
}

export const TrustSection: FC<TrustSectionProps> = ({
  title = 'Trygghet og personvern',
  subtitle = 'ToSom er bygga for ro, modenheit og full kontroll over kva du deler.',
  items = [
    {
      icon: '🔒',
      title: 'Ingen offentlege profiler',
      description: 'Profilen din er privat og aldri synleg for andre.',
    },
    {
      icon: '🚫',
      title: 'Ingen swipe eller feed',
      description: 'Vi har fjerna støy, press og overflatiskheit.',
    },
    {
      icon: '🛡️',
      title: 'Full personvern',
      description: 'Du kontrollerer kva du deler og når du deler det.',
    },
  ],
  footerText = 'ToSom er bygd for trygghet, ro og ekte forbindelse – ikkje for underhaldning.',
}) => {
  return (
    <section
      className="py-32 md:py-48 mb-28 md:mb-36 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0B0F14 0%, #090C10 50%, #0B0F14 100%)' }}
    >
      {/* Subtil vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 40%, transparent 40%, rgba(0,0,0,0.2) 100%)',
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
            className="text-base md:text-lg text-gray-300 font-medium max-w-lg mx-auto leading-[1.6]"
          >
            {subtitle}
          </p>
        </div>

        {/* 3 kolonner — glasskort med sterkare design */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mt-20">
          {items.map((item, index) => (
            <div
              key={index}
              className="group flex flex-col items-center text-center"
            >
              <div
                className="relative w-full rounded-2xl p-8 transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_0_50px_rgba(212,175,55,0.08)]"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1.5px solid rgba(212, 175, 55, 0.12)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 8px 40px rgba(0,0,0,0.4), inset 0 0 20px rgba(255,255,255,0.03)',
                }}
              >
                {/* Refleks */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-2xl"
                  style={{
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.06), transparent)',
                  }}
                />
                
                <div className="relative z-10 flex flex-col items-center gap-4">
                  {/* Ikon — 20% større, med glow */}
                  <div
                    className="text-5xl md:text-6xl transition-transform duration-300 group-hover:scale-110"
                    style={{
                      filter: 'drop-shadow(0 0 10px rgba(212,175,55,0.2))',
                    }}
                  >
                    {item.icon}
                  </div>

                  {/* Tittel */}
                  <h3 className="text-lg md:text-xl font-semibold tracking-[-0.005em] text-white">
                    {item.title}
                  </h3>
                  
                  {/* Beskrivelse */}
                  <p className="text-gray-400 text-sm md:text-base leading-[1.7] max-w-sm text-center">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bunntekst */}
        {footerText && (
          <p className="text-center text-gray-400 font-medium text-sm md:text-base max-w-md mx-auto mt-28 leading-[1.6]">
            {footerText}
          </p>
        )}
      </div>
    </section>
  );
};

export default TrustSection;