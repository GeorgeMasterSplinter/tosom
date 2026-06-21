/**
 * ToSom UI 5.0 - Timeline (Dark Blue-Gray Edition)
 * 
 * Guidet 30-dagers reise med fase-timeline, micro-motion fade-in
 * space-y-14, ikon 25% større, gull-gradient-linje
 * Mørk blågrå bakgrunn, responsive
 * Bokmål
 */

'use client';

import { FC, useEffect, useRef, useState } from 'react';

interface Phase {
  number: number;
  title: string;
  duration: string;
  description: string;
  features: string[];
}

interface TimelineProps {
  title?: string;
  subtitle?: string;
  phases: Phase[];
}

/* Fase-ikon per nummer */
function faseIcon(num: number) {
  const icons: Record<number, React.ReactNode> = {
    1: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L15 8L21 9L16.5 14L18 21L12 17.5L6 21L7.5 14L3 9L9 8L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    2: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M12 3C8 3 5 6 5 10C5 15 12 21 12 21C12 21 19 15 19 10C19 6 16 3 12 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    3: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M4 10C4 6 7 4 12 4C17 4 20 6 20 10C20 14 17 16 12 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M12 7V11L15 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    4: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M4 10L9 15L20 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  };
  return icons[num] || icons[1];
}

export const Timeline: FC<TimelineProps> = ({
  title = 'Den guidede 30-dagers reisen',
  subtitle = 'Fire faser som fører deg fra introduksjon til dyp forbindelse',
  phases,
}) => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-40 md:py-48 lg:py-56 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #1A1F26 0%, #0E1218 100%)' }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 50% 50%, rgba(80,120,255,0.094), transparent 70%),
            radial-gradient(ellipse 40% 40% at 30% 30%, rgba(212,175,55,0.057), transparent 60%),
            radial-gradient(ellipse 50% 40% at 50% 60%, rgba(80,120,255,0.057), transparent 65%),
            radial-gradient(circle at center, transparent 42%, rgba(0,0,0,0.21) 100%)
          `,
        }}
      />
      <div ref={ref} className="mx-auto max-w-[800px] px-6 lg:px-8 relative z-10">
        {/* Header — Round 6: +6px spacing, text-shadow på tittel */}
        <div className="text-center mb-26 md:mb-30">
          <span
            className="text-xs uppercase tracking-[0.3em] font-semibold mb-4 block"
            style={{ color: '#D4AF37' }}
          >
            30-dagers reise
          </span>
          <h2
            className="text-3xl lg:text-[40px] font-semibold mb-4"
            style={{
              color: '#FFFFFF',
              letterSpacing: '-0.025em',
              lineHeight: '1.1',
              textShadow: '0 0 10px rgba(255,255,255,0.12)',
            }}
          >
            {title}
          </h2>
          <p
            className="text-base lg:text-lg"
            style={{
              color: 'rgba(255, 255, 255, 0.5)',
              maxWidth: '560px',
              marginLeft: 'auto',
              marginRight: 'auto',
              lineHeight: '1.65',
              letterSpacing: '-0.015em',
              textShadow: '0 0 12px rgba(255,255,255,0.15)',
            }}
          >
            {subtitle}
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Round 6: Gull-linje glow -6% */}
          <div
            className="absolute left-5 md:left-6 top-0 bottom-0 w-[3px]"
            style={{
              background: 'linear-gradient(180deg, rgba(212,175,55,0.57), rgba(212,175,55,0.095))',
              boxShadow: '0 0 66px rgba(212,175,55,0.42)',
            }}
          />
          <div
            className="absolute left-5 md:left-6 top-0 bottom-0 w-[12px] -translate-x-[4.5px]"
            style={{
              background: 'linear-gradient(180deg, rgba(212,175,55,0.235), transparent)',
              filter: 'blur(6px)',
            }}
          />

          {/* Round 6: space-y-32 */}
          <div className="space-y-32">
            {phases.map((phase, index) => (
              <div
                key={phase.number}
                className="relative pl-16 md:pl-24"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateX(0) translateY(0)' : 'translateX(-24px) translateY(8px)',
                  transition: `all 0.7s cubic-bezier(0.25, 1, 0.35, 1) ${index * 180 + 200}ms`,
                }}
              >
                {/* Node — Round 6: size +5%, inner reflection -10% */}
                <div
                  className="absolute left-0 top-0 w-[44px] md:w-[48px] h-[44px] md:h-[48px] rounded-full flex items-center justify-center flex-shrink-0 relative"
                  style={{
                    background: index === 0
                      ? 'rgba(212, 175, 55, 0.20)'
                      : 'rgba(212, 175, 55, 0.12)',
                    border: '2.2px solid rgba(212, 175, 55, 0.32)',
                    color: '#D4AF37',
                    boxShadow: `
                      0 0 55px rgba(212,175,55,${index === 0 ? '0.25' : '0.16'}),
                      inset 0 0 22px rgba(255,255,255,${index === 0 ? '0.12' : '0.08'})
                    `,
                  }}
                >
                  {/* Round 6: Refleks -10% */}
                  <div
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{
                      background: 'linear-gradient(180deg, rgba(255,255,255,0.162), transparent)',
                      opacity: 0.63,
                    }}
                  />
                  <div style={{ transform: 'scale(1.38)' }}>
                    {faseIcon(phase.number)}
                  </div>
                </div>

                {/* Glass panel bak innhold */}
                <div
                  className="absolute -left-[2px] -right-2 -top-2 -bottom-2 rounded-3xl opacity-40"
                  style={{
                    background: 'rgba(255,255,255,0.025)',
                    backdropFilter: 'blur(22px)',
                    border: '1px solid rgba(255,255,255,0.05)',
                  }}
                />

                {/* Round 6: Global easing + hover scale 1.03 */}
                <div
                  className="rounded-2xl p-5 md:p-7 transition-all duration-500 cubic-bezier(0.25, 1, 0.35, 1) relative hover:scale-[1.03]"
                  style={{
                    background: `
                      linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%),
                      rgba(255, 255, 255, 0.03)
                    `,
                    backdropFilter: 'blur(22px)',
                    border: '1.2px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.35), inset 0 0 14px rgba(255,255,255,0.04)',
                  }}
                >
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3
                      className="text-lg font-semibold"
                      style={{ color: '#FFFFFF', textShadow: '0 0 10px rgba(255,255,255,0.12)', letterSpacing: '-0.02em' }}
                    >
                      {phase.title}
                    </h3>
                    <span
                      className="text-xs px-2.5 py-0.5 rounded-full font-medium"
                      style={{
                        background: 'rgba(212, 175, 55, 0.08)',
                        color: '#D4AF37',
                        border: '1px solid rgba(212, 175, 55, 0.15)',
                      }}
                    >
                      {phase.duration}
                    </span>
                  </div>

                  <p
                    className="text-sm mb-4"
                    style={{
                      color: 'rgba(255, 255, 255, 0.5)',
                      lineHeight: '1.5',
                      letterSpacing: '-0.015em',
                    }}
                  >
                    {phase.description}
                  </p>

                  {/* Features med gull-styling + hover */}
                  <div className="flex flex-wrap gap-2.5">
                    {phase.features.map((feature) => (
                      <span
                        key={feature}
                        className="text-xs px-3.5 py-1.5 rounded-lg transition-all duration-300 hover:scale-105"
                        style={{
                          background: 'rgba(212, 175, 55, 0.08)',
                          color: 'rgba(212, 175, 55, 0.70)',
                          border: '0.8px solid rgba(212, 175, 55, 0.12)',
                        }}
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;