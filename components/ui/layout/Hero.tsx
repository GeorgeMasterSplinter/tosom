/**
 * Tosom UI 5.0 — Hero Ultra-Premium (Nordic Calm + Bølgeform)
 *
 * Tittel: "Ro. Trygghet. Mening."
 * Undertekst på moderne norsk bokmål
 * Migrated to Tosom Design System.
 * Mobiloptimalisert < 640px
 * Alle tekst er på moderne norsk bokmål.
 *
 * S-5: Merkevaren først, forbeholdet etterpå.
 * S-4: ResonanceField erstatter de to ambient-glødene.
 */

'use client';

import { FC, useRef, useEffect } from 'react';
import Link from 'next/link';
import { LogoAnimated } from '@/components/branding/LogoVariants';
import { ToSomSection } from '@/components/ui/system';
import { ResonanceField } from '@/components/brand/ResonanceField';

/** Parallakse via CSS-variabel. Ingen React-state, ingen re-render. */
function useParallax(ref: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const progress = Math.max(-1, Math.min(1, -rect.top / window.innerHeight));
      el.style.setProperty('--ts-parallax', String(progress));
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ref]);
}

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
  subtitle = 'Tosom er for mennesker som vil noe ekte.\nHer møtes to personer i et rolig og trygt rom – uten støy, uten sveiping, uten jag.\nÉn match. Én reise. En mulighet til å bygge noe som faktisk betyr noe.',
}) => {
  const heroRef = useRef<HTMLDivElement | null>(null);
  useParallax(heroRef);
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
      {/* ── Z-0: Atmosfæren ── */}

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

      {/* ResonanceField — signaturmotivet (erstattet blå + gull ambient glow) */}
      <ResonanceField intensity={1} />

      {/* ── Z-1: Bølgeformer (bak glassblokk) — parallakse ── */}
      <div ref={heroRef} style={{ transform: 'translate3d(0, calc(var(--ts-parallax, 0) * 42px), 0)' }}>
        <div className="absolute bottom-[-40px] left-0 w-[140%] opacity-[0.11] pointer-events-none z-[1]">
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
          className="absolute bottom-[-20px] left-0 w-[150%] opacity-[0.07] pointer-events-none z-[1]"
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
      </div>

      {/* ── Z-2: Innhold ── */}
      <div className="mx-auto max-w-6xl px-6 lg:px-8 relative z-20" style={{ paddingTop: `${heroSpacing.paddingTop}px`, paddingBottom: `${heroSpacing.paddingBottom}px` }}>
        <div className="max-w-3xl mx-auto text-center">

          {/* 1. Logo — merkevaren først */}
          <div className="flex justify-center mb-12">
            <LogoAnimated />
          </div>

          {/* 2. Premium glassmorphism-blokk */}
          <div
            className="mx-auto max-w-[780px] rounded-[28px] p-10 md:p-14"
            style={{
              background: 'rgba(255,255,255,0.045)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.20), 0 0 24px rgba(212,175,55,0.05)',
            }}
          >
            {/* H1 */}
            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] mb-[32px] animate-riseIn"
              style={{
                color: 'rgba(255,255,255,0.92)',
                letterSpacing: '-0.03em',
                lineHeight: '1.15',
                textShadow: '0 0 48px rgba(255,255,255,0.06)',
              }}
            >
              {title}
            </h1>

            {/* Undertekst */}
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

          {/* 3. Beta-notis — under løftet, rolig og kort */}
          <div className="mt-14 flex justify-center">
            <div
              className="inline-flex items-center gap-3 rounded-full px-5 py-2.5"
              style={{
                border: '1px solid rgba(212,175,55,0.18)',
                background: 'rgba(212,175,55,0.04)',
              }}
            >
              <span className="w-[6px] h-[6px] rounded-full bg-[#D4AF37] ts-breath" />
              <span
                className="text-[13px]"
                style={{ color: 'rgba(255,255,255,0.58)', letterSpacing: '0.15px' }}
              >
                Tosom er i lukket beta.{' '}
                <Link
                  href="/slik-fungerer-det"
                  className="underline underline-offset-4 transition-colors hover:text-white/80"
                  style={{ color: 'rgba(255,255,255,0.72)', textDecorationColor: 'rgba(212,175,55,0.4)' }}
                >
                  Les mer
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>

    </ToSomSection>
  );
};

export default Hero;