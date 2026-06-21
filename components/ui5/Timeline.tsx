/**
 * ToSom UI 5.0 — Timeline 2.0 (Round 3 Premium Visual Polish)
 * 
 * Forbedringar:
 * - Glass-panel bak kvar fase
 * - Gull-gradient vertikal linje med glow
 * - Større ikon (25% større)
 * - staggered fade-in (100ms delay)
 * - Meir spacing mellom faser (space-y-20)
 * - 3D depth med perspective
 * Bokmål
 */

'use client';

import { FC } from 'react';

interface Phase {
  icon: string;
  title: string;
  description: string;
}

interface TimelineProps {
  title?: string;
  subtitle?: string;
  phases?: Phase[];
}

export const Timeline: FC<TimelineProps> = ({
  title = 'Den guidede 30-dagers reisen',
  subtitle = 'Fire faser som bygger trygghet, forståelse og emosjonell resonans.',
  phases = [
    {
      icon: '⭐',
      title: 'Introduksjon (Dag 1–7)',
      description: 'Bygg grunnlaget med lette, men meningsfulle samtaler.',
    },
    {
      icon: '◎',
      title: 'Trygghet & åpne deg (Dag 8–14)',
      description: 'Fordyp dere og lær hverandre å kjenne.',
    },
    {
      icon: '🌀',
      title: 'Dypere samtaler (Dag 15–22)',
      description: 'Utforsk verdier, drivere og relasjonsmønstre.',
    },
    {
      icon: '↻',
      title: 'Felles reise (Dag 23–30)',
      description: 'Etabler en varig forbindelse med dyp resonans.',
    },
  ],
}) => {
  return (
    <section
      className="py-32 md:py-48 mb-28 md:mb-36 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0B0F14 0%, #0E1218 50%, #0B0F14 100%)' }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 60% 40% at 50% 50%, rgba(212,175,55,0.04), transparent 60%),
            radial-gradient(ellipse 40% 60% at 30% 40%, rgba(80,120,255,0.05), transparent 60%)
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
            className="text-base md:text-lg text-gray-300 font-medium max-w-lg mx-auto leading-[1.6]"
          >
            {subtitle}
          </p>
        </div>

        {/* Timeline med 3D perspective */}
        <div className="mt-20 relative" style={{ perspective: '1000px' }}>
          
          {/* Vertikal gull-linje med glow */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px -translate-x-1/2">
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(180deg, transparent, rgba(212,175,55,0.5) 5%, rgba(212,175,55,0.5) 95%, transparent)',
                boxShadow: '0 0 30px rgba(212,175,55,0.25)',
              }}
            />
          </div>

          {/* Faser */}
          <div className="space-y-20">
            {phases.map((phase, index) => {
              const isLeft = index % 2 === 0;
              return (
                <div
                  key={index}
                  className="relative flex items-center stagger-fade"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Fase-innhald — glass-panel */}
                  <div className={`w-full md:w-[calc(50%-40px)] ${isLeft ? 'md:pr-12 md:text-right md:ml-0 md:mr-auto' : 'md:pl-12 md:ml-auto'}`}>
                    <div
                      className="group relative rounded-2xl p-6 transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_50px_rgba(212,175,55,0.1)]"
                      style={{
                        background: 'rgba(255, 255, 255, 0.025)',
                        border: '1px solid rgba(212, 175, 55, 0.08)',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 8px 40px rgba(0,0,0,0.35), inset 0 0 20px rgba(255,255,255,0.03)',
                      }}
                    >
                      {/* Refleks */}
                      <div
                        className="pointer-events-none absolute inset-0 rounded-2xl"
                        style={{
                          background: 'linear-gradient(180deg, rgba(255,255,255,0.06), transparent)',
                        }}
                      />
                      
                      <div className="relative z-10 flex items-start gap-4">
                        {/* Ikon — 25% større, med refleks */}
                        <div
                          className="flex-shrink-0 text-5xl md:text-6xl transition-transform duration-300 group-hover:scale-110"
                          style={{
                            filter: 'drop-shadow(0 0 10px rgba(212,175,55,0.25))',
                          }}
                        >
                          {phase.icon}
                        </div>
                        
                        <div className={`${isLeft ? 'md:text-right' : ''}`}>
                          <h3 className="text-xl md:text-2xl font-semibold tracking-[-0.005em] text-white mb-2">
                            {phase.title}
                          </h3>
                          <p className="text-gray-400 text-sm md:text-base leading-[1.7] max-w-md">
                            {phase.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Node på linja */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center justify-center z-20">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                      style={{
                        background: 'rgba(212, 175, 55, 0.15)',
                        border: '1.5px solid rgba(212, 175, 55, 0.3)',
                        boxShadow: '0 0 20px rgba(212,175,55,0.2), inset 0 0 8px rgba(255,255,255,0.08)',
                      }}
                    >
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#D4AF37' }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;