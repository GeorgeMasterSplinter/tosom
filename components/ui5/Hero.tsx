/**
 * ToSom UI 5.0 — Hero Section (Dark Blue-Gray Edition)
 * 
 * Mørk blågrå gradient bakgrunn, H1 64px/600, gull-CTA, glass-panel
 * Responsiv: mobil-stack, desktop 2-kolonne
 * Glow bak panel: rgba(80,120,255,0.12)
 * Bokmål
 */

'use client';

import { FC, useEffect, useRef, useState } from 'react';
import Link from 'next/link';

interface HeroProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  secondaryText?: string;
  showSecondary?: boolean;
  ctaHref?: string;
  secondaryHref?: string;
}

export const Hero: FC<HeroProps> = ({
  title = 'En rolig, moderne relasjonsplattform for voksne (23+)',
  subtitle = 'Når du har fullført profilen din, får du én match innen 24 timer.',
  ctaText = 'Opprett konto',
  secondaryText = 'Logg inn',
  showSecondary = true,
  ctaHref = '/onboarding',
  secondaryHref = '/login',
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
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(180deg, #1A1F26 0%, #0E1218 100%)',
      }}
    >
      {/* Round 6: Ambient blue glow reduced 8% + vignette +5% */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 80% 60% at 50% 30%, rgba(80,120,255,0.128), transparent 70%),
            radial-gradient(ellipse 60% 50% at 20% 60%, rgba(80,120,255,0.073), transparent 60%),
            radial-gradient(ellipse 60% 50% at 80% 50%, rgba(80,120,255,0.073), transparent 60%),
            radial-gradient(ellipse 80% 50% at 50% -20%, rgba(74, 123, 167, 0.127), transparent),
            radial-gradient(ellipse 60% 40% at 50% 120%, rgba(212, 175, 55, 0.09), transparent),
            radial-gradient(circle at 40% 20%, rgba(255,255,255,0.11), transparent 70%),
            radial-gradient(circle at 45% 30%, rgba(255,255,255,0.054), transparent 80%),
            radial-gradient(circle at 50% 40%, rgba(255,255,255,0.036), transparent 90%),
            radial-gradient(circle at 70% 40%, rgba(80,120,255,0.184), transparent 80%)
          `,
        }}
      />
      {/* Ambient blå lysstripe bak hero-visual */}
      <div
        className="absolute right-0 top-1/4 bottom-1/4 w-1/2 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, rgba(80,120,255,0.20), transparent)',
          filter: 'blur(40px)',
        }}
      />
      {/* Round 6: Vignette +5% for better center focus */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 47%, rgba(0,0,0,0.575) 100%)',
        }}
      />

      {/* Innhold */}
      <div
        className={`
          relative z-10 mx-auto max-w-[1600px] px-6 lg:px-8
          transition-all duration-1000 cubic-bezier(0.22, 1, 0.36, 1)
          ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        `}
      >
        {/* Round 6: Hero spacing +28px total */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center py-28 lg:py-0">
          {/* Venstre: Tekst */}
          <div className="max-w-[640px]">
            {/* Logo — Round 5: 72px + sterkere gull-refleks */}
            <div className="flex justify-center lg:justify-start mb-10 lg:mb-14">
              <div className="relative">
                <div
                  className="absolute -inset-6 -z-10"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(212,175,55,0.20), transparent 70%)',
                    filter: 'blur(16px)',
                  }}
                />
                <svg width="72" height="72" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"
                  style={{ filter: 'drop-shadow(0 0 24px rgba(212,175,55,0.30))' }}>
                  <circle cx="15" cy="20" r="12" fill="rgba(212, 175, 55, 0.45)" stroke="#D4AF37" strokeWidth="1.5" />
                  <circle cx="25" cy="20" r="12" fill="rgba(212, 175, 55, 0.28)" stroke="#D4AF37" strokeWidth="1.5" />
                  <circle cx="20" cy="20" r="6" fill="rgba(212, 175, 55, 0.22)" />
                </svg>
              </div>
            </div>

            {/* Round 6: Typography polish — tracking -0.025em, line-height 1.08/1.12 */}
            <div
              className="relative"
              style={{
                background: `
                  radial-gradient(circle at 40% 20%, rgba(255,255,255,0.12), transparent 70%),
                  radial-gradient(circle at 45% 30%, rgba(255,255,255,0.06), transparent 80%),
                  radial-gradient(circle at 50% 40%, rgba(255,255,255,0.04), transparent 90%)
                `,
                backgroundClip: 'padding-box',
                marginBottom: '62px',
              }}
            >
              <h1
                className="text-[36px] md:text-[52px] lg:text-[72px] font-semibold leading-[1.12] lg:leading-[1.08] tracking-[-0.025em]"
                style={{
                  color: '#FFFFFF',
                  fontWeight: 600,
                  textShadow: '0 0 20px rgba(255,255,255,0.25), 0 0 60px rgba(255,255,255,0.08)',
                }}
              >
                {title}
              </h1>
            </div>

            {/* Round 6: Subtitle — line-height 1.45, tracking -0.015em, spacing +12px */}
            <p
              className="text-base md:text-lg lg:text-[20px] leading-[1.45] mb-16 max-w-[560px]"
              style={{
                color: 'rgba(255, 255, 255, 0.6)',
                letterSpacing: '-0.015em',
                textShadow: '0 0 12px rgba(255,255,255,0.10)',
              }}
            >
              {subtitle}
            </p>

             {/* Round 6: CTA — gold glow -10%, hover scale 1.05, translateY -1px, global easing */}
             <div className="flex flex-col sm:flex-row items-center gap-3.5 lg:gap-4">
               <Link
                 href={ctaHref}
                 className="w-full sm:w-auto inline-flex items-center justify-center px-12 py-5 rounded-xl text-base font-medium transition-all duration-300 cubic-bezier(0.25, 1, 0.35, 1) relative overflow-hidden"
                 style={{
                   background: '#D4AF37',
                   color: '#0B0E11',
                   boxShadow: '0 0 40px rgba(212,175,55,0.45), 0 0 1px rgba(212,175,55,0.70), inset 0 0 24px rgba(212,175,55,0.20)',
                 }}
                 onMouseEnter={(e) => {
                   (e.target as HTMLElement).style.background = '#E8C766';
                   (e.target as HTMLElement).style.boxShadow = '0 0 63px rgba(212,175,55,0.72), 0 0 2px rgba(212,175,55,0.90), inset 0 0 32px rgba(212,175,55,0.40)';
                   (e.target as HTMLElement).style.transform = 'scale(1.05) translateY(-1px)';
                 }}
                 onMouseLeave={(e) => {
                   (e.target as HTMLElement).style.background = '#D4AF37';
                   (e.target as HTMLElement).style.boxShadow = '0 0 40px rgba(212,175,55,0.45), 0 0 1px rgba(212,175,55,0.70), inset 0 0 24px rgba(212,175,55,0.20)';
                   (e.target as HTMLElement).style.transform = 'scale(1) translateY(0)';
                 }}
               >
                 {/* Round 6: Highlight +5% opacity */}
                 <div
                   className="absolute inset-0 pointer-events-none"
                   style={{
                     background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.19), transparent)',
                     opacity: 0.58,
                   }}
                 />
                 {ctaText}
               </Link>

               {showSecondary && (
                 <Link
                   href={secondaryHref}
                   className="w-full sm:w-auto inline-flex items-center justify-center px-12 py-5 rounded-xl text-base font-medium transition-all duration-300 cubic-bezier(0.25, 1, 0.35, 1) relative overflow-hidden"
                   style={{
                     background: 'rgba(255, 255, 255, 0.04)',
                     color: 'rgba(255, 255, 255, 0.8)',
                     border: '1px solid rgba(255, 255, 255, 0.1)',
                     backdropFilter: 'blur(26px)',
                     boxShadow: 'inset 0 0 18px rgba(255,255,255,0.20), 0 0 45px rgba(80,120,255,0.12)',
                   }}
                   onMouseEnter={(e) => {
                     (e.target as HTMLElement).style.background = 'rgba(255, 255, 255, 0.08)';
                     (e.target as HTMLElement).style.color = '#FFFFFF';
                     (e.target as HTMLElement).style.borderColor = 'rgba(255, 255, 255, 0.16)';
                     (e.target as HTMLElement).style.transform = 'translateY(-1px)';
                   }}
                   onMouseLeave={(e) => {
                     (e.target as HTMLElement).style.background = 'rgba(255, 255, 255, 0.04)';
                     (e.target as HTMLElement).style.color = 'rgba(255, 255, 255, 0.8)';
                     (e.target as HTMLElement).style.borderColor = 'rgba(255, 255, 255, 0.1)';
                     (e.target as HTMLElement).style.transform = 'translateY(0)';
                   }}
                 >
                   {/* Round 5: Sterkere indre hvit glow */}
                   <div
                     className="absolute inset-0 pointer-events-none"
                     style={{
                       boxShadow: 'inset 0 0 20px rgba(255,255,255,0.22)',
                     }}
                   />
                   {secondaryText}
                 </Link>
               )}
             </div>
          </div>

          {/* Høyre: GlassPanel med 3 kort (mobil 1 kolonne, desktop 1 kolonne) */}
          {/* Round 6: Right panel -3px up for optical balance */}
          <div
            className={`
              transition-all duration-1000 delay-300 cubic-bezier(0.25, 1, 0.35, 1)
              ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}
            `}
            style={{ transform: visible ? 'translateY(0) translateX(0)' : 'translateY(0) translateX(32px)' }}
          >
             <div
               className="rounded-3xl p-8 lg:p-12 relative overflow-hidden"
               style={{
                 background: `rgba(255, 255, 255, 0.03)`,
                 backdropFilter: 'blur(24px)',
                 border: '1.8px solid rgba(212, 175, 55, 0.28)',
                 boxShadow: `
                   0 8px 60px rgba(0, 0, 0, 0.48),
                   inset 0 0 8px rgba(0,0,0,0.25),
                   0 0 70px rgba(80,120,255,0.198),
                   inset 0 0 23px rgba(255,255,255,0.09),
                   0 0 25px rgba(255,255,255,0.12),
                   0 0 12px rgba(80,120,255,0.135)
                 `,
                 backgroundImage: `
                   radial-gradient(ellipse at 30% 0%, rgba(212, 175, 55, 0.08), transparent 60%)
                 `,
               }}
             >
                {/* Round 6: Glass-noise 0.015, highlight +5% */}
                <div
                  className="absolute inset-0 pointer-events-none rounded-3xl opacity-[0.015]"
                  style={{
                    backgroundImage: `
                      url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E"),
                      linear-gradient(180deg, rgba(255,255,255,0.084), transparent)
                    `,
                  }}
                />
                {/* Round 6: Highlight stripe +5% */}
                <div
                  className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.147), transparent)',
                  }}
                />
                {/* Kantrefleks venstre */}
                <div
                  className="absolute top-0 left-0 bottom-0 w-[1px] pointer-events-none"
                  style={{
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.12), transparent)',
                  }}
                />
                {/* Kantrefleks høyre */}
                <div
                  className="absolute top-0 right-0 bottom-0 w-[1px] pointer-events-none"
                  style={{
                    background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.08))',
                  }}
                />
               {/* 3 punkt */}
                <div className="space-y-9">
                 {[
                   {
                     icon: (
                       <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                         <path d="M12 2L15 8L21 9L16.5 14L18 21L12 17.5L6 21L7.5 14L3 9L9 8L12 2Z" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                       </svg>
                     ),
                     title: 'Veiledet, forskningsbasert profil',
                     desc: 'Svar på dype spørsmål om deg selv. Verdiene, livssituasjonen, relasjonsstilen.',
                   },
                   {
                     icon: (
                       <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                         <circle cx="8" cy="12" r="6" stroke="#D4AF37" strokeWidth="1.5" />
                         <circle cx="16" cy="12" r="6" stroke="#D4AF37" strokeWidth="1.5" />
                         <path d="M12 6V18" stroke="#D4AF37" strokeWidth="1" strokeDasharray="2 2" />
                       </svg>
                     ),
                     title: 'Match innen 24 timer',
                     desc: 'Når profilen din er ferdig, får du én match innen 24 timer. Den beste kompatibiliteten.',
                   },
                   {
                     icon: (
                       <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                         <path d="M4 12C4 7 7 4 12 4C17 4 20 7 20 12C20 17 17 20 12 20" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" />
                         <path d="M12 8V12L15 15" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                       </svg>
                     ),
                     title: 'Guidet 30-dagers reise',
                     desc: 'Dere går inn i et privat rom med daglige refleksjoner, oppgaver og samtaletema.',
                   },
                   ].map((item, i) => (
                      <div
                       key={i}
                       className="flex items-start gap-4"
                       style={{
                         opacity: visible ? 1 : 0,
                         transform: visible ? 'translateY(0)' : 'translateY(8px)',
                         transition: `all 0.7s cubic-bezier(0.25, 1, 0.35, 1) ${i * 180 + 600}ms`,
                       }}
                      >
                       <div
                        className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 relative overflow-hidden"
                        style={{
                          background: 'rgba(212, 175, 55, 0.12)',
                          border: '2px solid rgba(212, 175, 55, 0.28)',
                          boxShadow: '0 0 30px rgba(212,175,55,0.12), inset 0 0 16px rgba(255,255,255,0.08)',
                        }}
                      >
                        {/* Round 6: Inner reflection -10% */}
                        <div
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            background: 'linear-gradient(180deg, rgba(255,255,255,0.18), transparent)',
                            opacity: 0.36,
                          }}
                        />
                        <div style={{ color: '#D4AF37', transform: 'scale(1.15)' }}>
                          {item.icon}
                        </div>
                      </div>

                      {/* Tekst */}
                      <div>
                        {/* Round 6: Section titles — text-shadow 0 0 10px rgba(255,255,255,0.12) */}
                        <h3
                          className="text-[16px] font-semibold mb-1.5"
                          style={{ color: '#FFFFFF', textShadow: '0 0 10px rgba(255,255,255,0.12)' }}
                        >
                          {item.title}
                        </h3>
                        <p
                          className="text-sm leading-relaxed"
                          style={{ color: 'rgba(255, 255, 255, 0.5)', letterSpacing: '-0.02em' }}
                        >
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Trust badges — Round 5: sterkere glow */}
                <div
                  className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-12 pt-6"
                  style={{
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  {[
                    'Ingen offentlige profiler',
                    'Ingen swipe',
                    'Ingen feed',
                    'Full personvern',
                  ].map((text) => (
                    <span
                      key={text}
                      className="flex items-center gap-1.5 text-xs transition-colors duration-300 hover:text-white/45"
                      style={{ color: 'rgba(255, 255, 255, 0.35)' }}
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <circle cx="6" cy="6" r="5" stroke="#D4AF37" strokeWidth="1" opacity="0.5" />
                        <path d="M3.5 6L5.5 8L8.5 4" stroke="#D4AF37" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
                      </svg>
                      {text}
                    </span>
                  ))}
                </div>
              </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;