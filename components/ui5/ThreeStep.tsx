/**
 * ToSom UI 5.0 - ThreeStepSection (Dark Blue-Gray Edition)
 * 
 * Tre-trinns forklaring med premium-ikon, glass-panel, blur(18px)
 * Mørk blågrå bakgrunn, gull-border opacity 0.18
 * Responsiv: mobil 1-kol, desktop 3-kol
 * Bokmål
 */

import { FC } from 'react';

interface Step {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface ThreeStepSectionProps {
  title?: string;
  subtitle?: string;
  steps: Step[];
}

export const ThreeStepSection: FC<ThreeStepSectionProps> = ({
  title = 'Slik fungerer det',
  subtitle = 'Tre enkle steg mot en meningsfull forbindelse',
  steps,
}) => {
  return (
    <>
      {/* Pulse animation for icons */}
      <style>{`
        @keyframes iconPulse {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.2); }
        }
      `}</style>
      {/* Round 6: Section spacing +12px desktop, blue glow -8%, vignette +5% */}
      <section className="py-40 md:py-48 lg:py-52 relative overflow-hidden" style={{ background: '#11151A' }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 30% 40%, rgba(80,120,255,0.092), transparent 70%),
            radial-gradient(ellipse 60% 50% at 70% 60%, rgba(80,120,255,0.092), transparent 70%),
            radial-gradient(ellipse 40% 40% at 50% 50%, rgba(80,120,255,0.055), transparent 60%),
            radial-gradient(circle at center, transparent 44%, rgba(0,0,0,0.158) 100%)
          `,
        }}
      />
      <div className="mx-auto max-w-[1600px] px-6 lg:px-8 relative z-10">
        {/* Header — Round 6: +6px spacing, text-shadow på tittel */}
        <div className="text-center mb-22 md:mb-26">
          <span
            className="text-xs uppercase tracking-[0.3em] font-semibold mb-4 block"
            style={{ color: '#D4AF37' }}
          >
            Slik fungerer det
          </span>
          <h2
            className="text-3xl lg:text-[40px] font-semibold mb-4"
            style={{
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
              lineHeight: '1.2',
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
            }}
          >
            {subtitle}
          </p>
        </div>

        {/* Steps — mobil 1-kol, desktop 3-kol */}
         {/* Round 6: gap-20 + glass-noise 0.02→0.015 */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-20 relative">
          {steps.map((step) => (
            <div
              key={step.number}
              className="text-center group"
            >
                 {/* Round 6: Global easing + glass micro-polish */}
                 <div
                   className="rounded-3xl p-6 lg:p-8 transition-all duration-500 cubic-bezier(0.25, 1, 0.35, 1) h-full relative overflow-hidden group hover:scale-[1.03]"
                   style={{
                     background: `
                       linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%),
                       rgba(255, 255, 255, 0.03)
                     `,
                     backdropFilter: 'blur(26px)',
                     border: '2px solid rgba(212, 175, 55, 0.28)',
                     boxShadow: '0 4px 40px rgba(0, 0, 0, 0.40), 0 0 60px rgba(80,120,255,0.15), inset 0 0 24px rgba(255,255,255,0.08), 0 0 25px rgba(255,255,255,0.12), 0 0 12px rgba(80,120,255,0.15)',
                   }}
                 >
                {/* Round 6: Glass-noise 0.015 */}
                <div
                  className="absolute inset-0 rounded-3xl opacity-[0.015]"
                  style={{
                    backgroundImage: `
                      linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px',
                  }}
                />
                
                 {/* Nummer badge */}
                 <div
                   className="w-18 h-18 rounded-xl flex items-center justify-center mx-auto mb-7 relative"
                   style={{
                     background: 'rgba(212, 175, 55, 0.16)',
                     border: '2px solid rgba(212, 175, 55, 0.30)',
                     color: '#D4AF37',
                     boxShadow: '0 0 30px rgba(212,175,55,0.18), inset 0 0 12px rgba(255,255,255,0.12)',
                   }}
                 >
                   <span className="text-lg font-semibold">{step.number}</span>
                 </div>

                 {/* Ikon — Round 6: Inner reflection -10% */}
                 <div
                   className="w-[48px] h-[48px] mx-auto mb-7 transition-all duration-500 cubic-bezier(0.25, 1, 0.35, 1) relative group-hover:scale-[1.08]"
                   style={{
                     background: 'rgba(212, 175, 55, 0.08)',
                     border: '2.4px solid rgba(212, 175, 55, 0.30)',
                     color: '#D4AF37',
                     boxShadow: '0 0 40px rgba(255,255,255,0.14), inset 0 0 24px rgba(255,255,255,0.10), 0 0 60px rgba(80,120,255,0.12)',
                   }}
                 >
                   {/* Round 6: Inner reflection -10% */}
                   <div
                     className="absolute inset-0 rounded-2xl pointer-events-none"
                     style={{
                       background: 'linear-gradient(180deg, rgba(255,255,255,0.198), transparent)',
                       opacity: 0.45,
                     }}
                   />
                   <div style={{ color: '#D4AF37', transform: 'scale(1.15)' }}>
                     {step.icon}
                   </div>
                 </div>

                {/* Round 6: Section titles — text-shadow 0 0 10px rgba(255,255,255,0.12) */}
                {/* Tittel */}
                <h3
                  className="text-lg font-semibold mb-3 relative z-10"
                  style={{ color: '#FFFFFF', textShadow: '0 0 10px rgba(255,255,255,0.12)', letterSpacing: '-0.02em' }}
                >
                  {step.title}
                </h3>

                {/* Beskrivelse */}
                <p
                  className="text-sm leading-relaxed relative z-10"
                  style={{
                    color: 'rgba(255, 255, 255, 0.5)',
                    lineHeight: '1.5',
                    letterSpacing: '-0.015em',
                  }}
                >
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      </section>
    </>
  );
};

export default ThreeStepSection;