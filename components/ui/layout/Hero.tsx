/**
 * ToSom UI 5.0 — Hero Ultra-Premium (Nordic Calm + Bølgeform)
 * 
 * Tittel: "Ro. Trygghet. Mening."
 * Undertekst på moderne norsk bokmål
 * Migrated to ToSom Design System.
 * Mobiloptimalisert < 640px
 * Alle tekst er på moderne norsk bokmål.
 */

'use client';

import { FC } from 'react';
import { LogoAnimated } from '@/components/branding/LogoVariants';
import { ToSomSection } from '@/components/ui/system';

/* ========================
   INTERFACES
   ======================== */

interface HeroProps {
  title?: string;
  subtitle?: string;
}

/* ========================
   COMPONENT
   ======================== */

export const Hero: FC<HeroProps> = ({
  title = 'Ro. Trygghet. Mening.',
  subtitle = 'ToSom er for mennesker som vil noe ekte.\nHer møtes to personer i et rolig og trygt rom – uten støy, uten sveiping, uten jag.\nÉn match. Én reise. En mulighet til å bygge noe som faktisk betyr noe.',
}) => {
  /* Premium spacing constants — optimalisert for ro, dybde, optisk base og 8px-grid */
  const heroSpacing = {
    paddingTop: 60,
    paddingBottom: 180,
  };

  /* Bølge 1: primær, organisk */
  const wave1Path =
    'M0,256 C200,180 400,300 600,256 C800,212 1000,280 1200,256 C1400,232 1600,260 1800,256 L1800,512 L0,512 Z';

  /* Bølge 2: sekundær, gulltonet */
  const wave2Path =
    'M0,256 C220,210 440,310 660,260 C880,210 1100,290 1320,260 C1540,230 1760,270 1980,256 L1980,512 L0,512 Z';

   return (
     <ToSomSection
       spotlight="hero"
       className="relative overflow-hidden"
       style={{
         background: 'linear-gradient(180deg, #0A0F1A 0%, #0F1923 50%, #0A0F1A 100%)',
       }}
     >
       {/* ── Z-0: Atmosfæren (ikke-overlay spotlight) ── */}

       {/* Vignette */}
       <div
         className="absolute inset-0 pointer-events-none"
         style={{
           background: 'radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.06) 100%)',
         }}
       />

       {/* Spotlight */}
       <div
         className="absolute top-[40%] left-1/2 -translate-x-1/2 w-[1080px] h-[720px] pointer-events-none"
         style={{
           background: 'radial-gradient(circle at center, rgba(255,255,255,0.048), transparent 70%)',
         }}
       />

       {/* Blå ambient glow */}
       <div
         className="absolute top-0 right-0 w-[920px] h-[690px] pointer-events-none"
         style={{
           background: 'radial-gradient(ellipse at 70% 20%, rgba(80,120,255,0.022), transparent 70%)',
         }}
       />

       {/* Gull ambient glow */}
       <div
         className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[480px] pointer-events-none"
         style={{
           background: 'radial-gradient(circle at center, rgba(212,175,55,0.044), transparent 60%)',
         }}
       />

      {/* ── Z-1: Bølgeformer (bak glassblokk) ── */}
      <div className="absolute bottom-[-40px] left-0 w-[140%] opacity-[0.05] pointer-events-none z-[1]">
        <svg
          viewBox="0 0 1800 512"
          preserveAspectRatio="none"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="wave1Grad" x1="0" y1="0" x2="1800" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1A2A3A" />
              <stop offset="100%" stopColor="#0A0F1A" />
            </linearGradient>
          </defs>
          <path d={wave1Path} fill="url(#wave1Grad)" />
        </svg>
      </div>

      <div
        className="absolute bottom-[-20px] left-0 w-[150%] opacity-[0.03] pointer-events-none z-[1]"
        style={{ maxWidth: '1980px' }}
      >
        <svg
          viewBox="0 0 1980 512"
          preserveAspectRatio="none"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="wave2Grad" x1="0" y1="0" x2="1980" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path d={wave2Path} fill="url(#wave2Grad)" />
        </svg>
      </div>

       {/* ── Z-2: Innhold ── */}
       <div className="mx-auto max-w-6xl px-6 lg:px-8 relative z-20" style={{ paddingTop: `${heroSpacing.paddingTop}px`, paddingBottom: `${heroSpacing.paddingBottom}px` }}>
        <div className="max-w-3xl mx-auto text-center">

          {/* Animert tekst-logo — flytt opp + Made in Norway */}
          <div className="flex justify-center mb-12">
            <LogoAnimated />
          </div>

          {/* Premium glassmorphism-blokk — blur 12px */}
          <div
            className="mx-auto max-w-[780px] rounded-[28px] p-10 md:p-14"
            style={{
              background: 'rgba(255,255,255,0.045)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.20), 0 0 24px rgba(212,175,55,0.05)',
            }}
          >
            {/* H1 — premium, roleg — white/92, balansert leading, ekstra tyngde */}
            <h1
              className="text-4xl sm:text-5xl md:text-[64px] font-bold tracking-[-0.03em] mb-[32px] animate-riseIn"
              style={{
                color: 'rgba(255,255,255,0.92)',
                letterSpacing: '-0.03em',
                lineHeight: '1.15',
                textShadow: '0 0 48px rgba(255,255,255,0.06)',
              }}
            >
              {title}
            </h1>

            {/* Undertekst — white/90 — økt kontrast og luft */}
            <p
              className="text-base sm:text-lg md:text-xl mb-0 animate-ts-fade-in [animation-delay:120ms]"
              style={{
                color: 'rgba(255,255,255,0.82)',
                lineHeight: '1.7',
                letterSpacing: '0.15px',
                maxWidth: '640px',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              {subtitle}
            </p>
          </div>

        </div>
      </div>

     </ToSomSection>
  );
};

export default Hero;