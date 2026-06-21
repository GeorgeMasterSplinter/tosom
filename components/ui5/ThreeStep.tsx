/**
 * ToSom UI 5.0 — ThreeStep 2.0 (Round 3 Premium Visual Polish)
 * 
 * Forbedringar:
 * - Større ikoner (20% større, meir stroke)
 * - Kort med glass-panel, high-tech grid bakgrunn
 * - Hover: scale-[1.03]
 * - Meir gap mellom kort (gap-16)
 * - Subtil fade-in animasjon
 * Bokmål
 */

'use client';

import { FC } from 'react';

interface Step {
  icon: string;
  title: string;
  description: string;
}

interface ThreeStepProps {
  title?: string;
  subtitle?: string;
  steps?: Step[];
}

export const ThreeStepSection: FC<ThreeStepProps> = ({
  title = 'Slik fungerer det',
  subtitle = 'Tre enkle steg mot ein meningsfull forbindelse.',
  steps = [
    {
      icon: '⭐',
      title: 'Veiledet, forskningsbasert profil',
      description: 'Svar på dype spørsmål om deg selv – verdier, livssituasjon og relasjonsstil.',
    },
    {
      icon: '◎',
      title: 'Match innen 24 timer',
      description: 'Når profilen din er ferdig, får du éin match innan 24 timer – basert på kompatibilitet.',
    },
    {
      icon: '🌀',
      title: 'Guidet 30-dagers reise',
      description: 'Dere går inn i et privat rom med daglige refleksjoner, oppgaver og samtaletema.',
    },
  ],
}) => {
  return (
    <section
      className="py-32 md:py-48 mb-28 md:mb-36 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0B0F14 0%, #0E1218 50%, #0B0F14 100%)' }}
    >
      {/* Subtil grid bakgrunn */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />
      
      <div className="mx-auto max-w-6xl px-6 lg:px-8 relative z-10">
        {/* Seksjonstittel */}
        <div className="text-center mt-8 stagger-fade">
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

        {/* Tre steg — med glass-panel kort */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mt-20">
          {steps.map((step, index) => (
            <div
              key={index}
              className="group flex flex-col items-center text-center relative"
            >
              {/* Glass-panel bak kort */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(212, 175, 55, 0.1)',
                  backdropFilter: 'blur(12px)',
                  boxShadow: '0 0 40px rgba(80,120,255,0.1), inset 0 0 12px rgba(255,255,255,0.04)',
                }}
              />
              
              <div className="relative z-10 flex flex-col items-center text-center p-6">
                {/* Ikon — 20% større, indre glow */}
                <div
                  className="text-5xl md:text-6xl mt-2 mb-4 flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                  style={{
                    filter: 'drop-shadow(0 0 8px rgba(212,175,55,0.2))',
                  }}
                >
                  {step.icon}
                </div>

                {/* Tittel */}
                <h3
                  className="text-xl font-semibold tracking-[-0.005em] text-white mb-3"
                >
                  {step.title}
                </h3>

                {/* Beskrivelse */}
                <p
                  className="text-gray-400 text-sm md:text-base leading-[1.7] max-w-sm text-center"
                >
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ThreeStepSection;