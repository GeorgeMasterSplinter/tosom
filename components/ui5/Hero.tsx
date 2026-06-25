/**
 * ToSom UI 5.0 — Hero Ultra-Premium (Nordic Calm + Bølgeform)
 * 
 * Tittel: "Ro. Trygghet. Mening."
 * Undertekst på moderne norsk bokmål
 * Ultra-premium: harmonert spotlight 80px, vertikal rytme, typografi, radius.
 * Mobiloptimalisert < 640px
 * Alle tekst er på moderne norsk bokmål.
 */

'use client';

import { FC } from 'react';
import { LogoAnimated } from '@/components/branding/LogoVariants';
import { color, spacing } from '@/config/design-tokens';

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
  const keyPoints = [
    { 
      title: 'Veiledet profil', 
      description: 'Forskningbasert og guidet profil som hjelper deg å forstå hvem du er.',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M20.5 21C20.5 18.7909 18.7091 17 16.5 17H7.5C5.29086 17 3.5 18.7909 3.5 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    { 
      title: 'Match innen 24 timer', 
      label: 'Én match. Kvalitet framfor kvantitet.',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L15 8L21 9L16.5 14L18 21L12 17.5L6 21L7.5 14L3 9L9 8L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    { 
      title: 'Trygghet og personvern', 
      label: 'Ingen offentlige profiler. Ingen swipe.',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L18 5V12C18 16.5 14.5 20.5 12 22C9.5 20.5 6 16.5 6 12V5L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
  ];

  /* Premium spacing constants — optimalisert for ro, dybde, optisk base og 8px-grid */
  const heroSpacing = {
    paddingTop: 24,
    paddingBottom: 120,
  };

  /* Bølge 1: primær, organisk */
  const wave1Path =
    'M0,256 C200,180 400,300 600,256 C800,212 1000,280 1200,256 C1400,232 1600,260 1800,256 L1800,512 L0,512 Z';

  /* Bølge 2: sekundær, gulltonet */
  const wave2Path =
    'M0,256 C220,210 440,310 660,260 C880,210 1100,290 1320,260 C1540,230 1760,270 1980,256 L1980,512 L0,512 Z';

  return (
    <section
      className="relative overflow-hidden"
      style={{
        paddingTop: `${heroSpacing.paddingTop}px`,
        paddingBottom: `${heroSpacing.paddingBottom}px`,
        background: 'linear-gradient(180deg, #0A0F1A 0%, #0F1923 50%, #0A0F1A 100%)',
      }}
    >
      {/* ── Z-0: Atmosfæren ── */}

      {/* Vignette — forsterka +10% */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.06) 100%)',
        }}
      />

      {/* Spotlight — flytta ned + radius +20% */}
      <div
        className="absolute top-[40%] left-1/2 -translate-x-1/2 w-[1080px] h-[720px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(255,255,255,0.048), transparent 70%)',
        }}
      />

      {/* Blå ambient glow — radius +15% */}
      <div
        className="absolute top-0 right-0 w-[920px] h-[690px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 70% 20%, rgba(80,120,255,0.022), transparent 70%)',
        }}
      />

      {/* Gull ambient glow — radius +20% */}
      <div
        className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[480px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(212,175,55,0.044), transparent 60%)',
        }}
      />

      {/* ── Z-0.5: Subtil top-spotlight for premium dybde — harmonert 80px ── */}
      <div
        className="absolute inset-x-0 top-0 h-[200px] pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 100%)',
          filter: 'blur(80px)',
        }}
      />

      {/* ── Z-1: Bølgeformer (bak glassblokk) ── */}
      <div className="absolute bottom-[-40px] left-0 w-[140%] opacity-[0.05] pointer-events-none z-[1]">
        <svg
          viewBox="0 0 1800 256"
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
          viewBox="0 0 1980 256"
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
      <div className="mx-auto max-w-6xl px-6 lg:px-8 relative z-20">
        <div className="max-w-3xl mx-auto text-center">

          {/* Animert tekst-logo — flytt opp + Made in Norway */}
          <div className="flex justify-center mb-8">
            <LogoAnimated />
          </div>

          {/* Premium glassmorphism-blokk — blur 12px */}
          <div
            className="mx-auto max-w-[720px] rounded-3xl p-8 md:p-10"
            style={{
              background: 'rgba(255,255,255,0.045)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.18), 0 0 18px rgba(212,175,55,0.04)',
            }}
          >
            {/* H1 — premium, roleg — white/92, balansert leading, ekstra tyngde */}
            <h1
              className="text-5xl md:text-[88px] font-extrabold tracking-[-0.03em] mb-[40px] animate-riseIn"
              style={{
                color: 'rgba(255,255,255,0.92)',
                letterSpacing: '-0.03em',
                lineHeight: '1.2',
                textShadow: '0 0 32px rgba(255,255,255,0.04)',
              }}
            >
              {title}
            </h1>

            {/* Undertekst — white/90 — økt kontrast og luft */}
            <p
              className="text-lg md:text-2xl mb-0 animate-fadeUp delay-[120ms]"
              style={{
                color: 'rgba(255,255,255,0.88)',
                lineHeight: '1.65',
                letterSpacing: '0.22px',
                maxWidth: '660px',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              {subtitle}
            </p>
          </div>

        </div>
      </div>

      {/* ── Mobiloptimalisering < 640px ── */}
      <style>{`
        @media (max-width: 640px) {
          .hero-wave-primary {
            width: 180% !important;
            opacity: 0.035 !important;
          }
          .hero-wave-secondary {
            width: 200% !important;
            opacity: 0.02 !important;
          }
          .hero-waves-container {
            max-width: 1200px !important;
          }
          .hero-spotlight {
            width: 810px !important;
            height: 540px !important;
          }
          .hero-blue-glow {
            width: 748px !important;
            height: 564px !important;
          }
          .hero-gold-glow {
            width: 480px !important;
            height: 384px !important;
          }
          .hero-glass-blur {
            backdrop-filter: blur(9px) !important;
            -webkit-backdrop-filter: blur(9px) !important;
          }
          .hero-title {
            font-size: 48px !important;
          }
          .hero-subtitle {
            font-size: 19px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;