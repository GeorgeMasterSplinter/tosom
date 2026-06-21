/**
 * ToSom UI 5.0 — Landing Page (Round 3 Premium Visual Polish)
 * 
 * Visuell perfeksjon: dypere bakgrunn, sterkare glow, glassmorphism, 
 * større typografi, micro-motion, premium spacing.
 * Bokmål
 */

'use client';

import { Header } from '@/components/ui5/Header';
import { Footer } from '@/components/ui5/Footer';
import { Hero } from '@/components/ui5/Hero';
import { GlassPanel } from '@/components/ui5/GlassPanel';
import { ThreeStepSection } from '@/components/ui5/ThreeStep';
import { MatchingSection } from '@/components/ui5/Matching';
import { Timeline } from '@/components/ui5/Timeline';
import { TrustSection } from '@/components/ui5/Trust';

export default function LandingPage() {
  /* 3-stegs data */
  const steps = [
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
  ];

  /* Timeline faser */
  const phases = [
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
  ];

  /* Trust data */
  const trustItems = [
    {
      icon: '🔒',
      title: 'Ingen offentlige profiler',
      description: 'Profilen din er privat og aldri synlig for andre.',
    },
    {
      icon: '🚫',
      title: 'Ingen swipe eller feed',
      description: 'Vi har fjernet støy, press og overfladiskhet.',
    },
    {
      icon: '🛡️',
      title: 'Full personvern',
      description: 'Du kontrollerer hva du deler og når du deler det.',
    },
  ];

  return (
    <>
      {/* Round 3: Animasjonar for glow, pulse, staggered fade */}
      <style>{`
        @keyframes pulseGlow {
          0%, 100% { filter: drop-shadow(0 0 8px rgba(212,175,55,0.3)); }
          50% { filter: drop-shadow(0 0 20px rgba(212,175,55,0.55)); }
        }
        @keyframes ctaGlow {
          0%, 100% { box-shadow: 0 0 40px rgba(212,175,55,0.45), 0 0 1px rgba(212,175,55,0.6), 0 4px 16px rgba(0,0,0,0.2); }
          50% { box-shadow: 0 0 55px rgba(212,175,55,0.55), 0 0 2px rgba(212,175,55,0.7), 0 4px 16px rgba(0,0,0,0.2); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .cta-pulse { animation: ctaGlow 3s infinite ease-in-out; }
        .stagger-fade > * {
          animation: fadeUp 0.6s ease-out both;
        }
        .stagger-fade > *:nth-child(1) { animation-delay: 0.05s; }
        .stagger-fade > *:nth-child(2) { animation-delay: 0.15s; }
        .stagger-fade > *:nth-child(3) { animation-delay: 0.25s; }
        .stagger-fade > *:nth-child(4) { animation-delay: 0.35s; }
        .pulse-icon { animation: pulseGlow 2.5s infinite ease-in-out; }
        
        /* Mobile: full bredde CTA */
        @media (max-width: 640px) {
          .mobile-full-cta { width: 100% !important; }
          .mobile-hero-visual { order: 2 !important; }
        }
      `}</style>

      <div className="min-h-screen relative" style={{ 
        background: 'linear-gradient(180deg, #1A1F26 0%, #0E1218 100%)'
      }}>
        {/* Round 3: Ambient blå lysglød — sterkare og meir djupt */}
        <div
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            background: `
              radial-gradient(ellipse 80% 60% at 50% 30%, rgba(80,120,255,0.15), transparent 70%),
              radial-gradient(ellipse 60% 50% at 20% 70%, rgba(80,120,255,0.08), transparent 60%),
              radial-gradient(ellipse 60% 50% at 80% 60%, rgba(80,120,255,0.08), transparent 60%),
              radial-gradient(ellipse 100% 70% at 50% 50%, rgba(80,120,255,0.07), transparent 65%),
              linear-gradient(180deg, #1A1F26 0%, #0E1218 100%)
            `,
          }}
        />
        {/* Round 3: Forsterka vignette — meir djup */}
        <div
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            background: 'radial-gradient(circle at center, transparent 50%, rgba(0,0,0,0.5) 100%)',
          }}
        />

        {/* Header */}
        <Header currentPath="/" />

        {/* Main content — z-index over bakgrunnen */}
        <main className="relative z-10">
          {/* Hero Section — Round 3-forbedringar: 68px H1, spotlight, 48px spacing */}
          <Hero
            title="En rolig, moderne relasjonsplattform for voksne (23+)"
            subtitle="Når du har fullført profilen din, får du éin match innan 24 timer."
            ctaText="Opprett konto"
            secondaryText="Logg inn"
          />

          {/* 3-Step Section — Round 3: større ikoner, hover, gap */}
          <ThreeStepSection
            title="Slik fungerer det"
            subtitle="Tre enkle steg mot ein meningsfull forbindelse"
            steps={steps}
          />

          {/* Profilseksjon — Round 3: sterkare ambient glow */}
          <section className="py-36 relative overflow-hidden" style={{ background: '#11151A' }}>
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `
                  radial-gradient(ellipse 50% 50% at 70% 40%, rgba(80,120,255,0.06), transparent 70%),
                  radial-gradient(ellipse 40% 40% at 30% 60%, rgba(212,175,55,0.04), transparent 60%)
                `,
              }}
            />
            <div className="mx-auto max-w-[1600px] px-8 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                {/* Tekst */}
                <div>
                  <span
                    className="text-xs uppercase tracking-[0.3em] font-semibold mb-4 block"
                    style={{ color: '#D4AF37' }}
                  >
                    Profil
                  </span>
                  <h2
                    className="text-3xl lg:text-[38px] font-semibold mb-6"
                    style={{
                      color: '#FFFFFF',
                      letterSpacing: '-0.02em',
                      lineHeight: '1.2',
                    }}
                  >
                    Ein dyp, privat profil — aldri offentlig
                  </h2>
                  <p
                    className="text-base leading-relaxed mb-6"
                    style={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      lineHeight: '1.7',
                    }}
                  >
                    Profilen din er veiledet og forskningsbasert. Du bygger den steg for steg – og den blir brukt til å finne éin god match, ikkje mange dårlige.
                  </p>
                  <ul className="space-y-3">
                    {[
                      'Livssituasjon og livsstil',
                      'Verdier og livsønsker',
                      'Emosjonelle mønster',
                      'Relasjonsstil og kommunikasjon',
                      'Modenhet og trygghet',
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-3 text-sm transition-colors duration-300 hover:text-white/65" style={{ color: 'rgba(255, 255, 255, 0.55)' }}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
                          <path d="M3 8L6.5 11.5L13 4.5" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Visual */}
                <GlassPanel goldBorder padding="xl" className="text-center relative mobile-hero-visual">
                  <div className="flex justify-center mb-7">
                    <div
                      className="w-28 h-28 rounded-full flex items-center justify-center relative pulse-icon"
                      style={{
                        background: 'rgba(212, 175, 55, 0.12)',
                        border: '2.2px solid rgba(212, 175, 55, 0.28)',
                        boxShadow: '0 0 50px rgba(212,175,55,0.16), inset 0 0 14px rgba(212,175,55,0.08)',
                      }}
                    >
                      <svg width="44" height="44" viewBox="0 0 40 40" fill="none">
                        <circle cx="15" cy="20" r="12" fill="rgba(212, 175, 55, 0.35)" stroke="#D4AF37" strokeWidth="1.5" />
                        <circle cx="25" cy="20" r="12" fill="rgba(212, 175, 55, 0.2)" stroke="#D4AF37" strokeWidth="1.5" />
                        <circle cx="20" cy="20" r="6" fill="rgba(212, 175, 55, 0.15)" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2" style={{ color: '#FFFFFF' }}>
                    Forskningsbasert
                  </h3>
                  <p style={{ color: 'rgba(255, 255, 255, 0.6)', lineHeight: '1.65' }}>
                    Basert på psykologi og relasjonsforskning
                  </p>
                </GlassPanel>
              </div>
            </div>
          </section>

          {/* Matchingseksjon — Round 3: større ikoner, gull-linje med glow */}
          <MatchingSection />

          {/* 30-dagers reise — Round 3: sterkare visuell djupne */}
          <Timeline
            title="Den guidede 30-dagers reisen"
            subtitle="Fire faser som bygger trygghet, forståelse og emosjonell resonans."
            phases={phases}
          />

          {/* Trust — Trust 2.0 (Clean, Modern, Calm) */}
          <TrustSection
            items={trustItems}
          />

          {/* CTA — Round 3: sterkare ambient glow, puls, 1px gull-stroke */}
          <section className="py-40 relative overflow-hidden" style={{ background: '#11151A' }}>
            {/* Round 3: Ambient glow bak CTA — sterkt */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `
                  radial-gradient(ellipse 50% 50% at 50% 50%, rgba(212,175,55,0.10), transparent 70%),
                  radial-gradient(ellipse 60% 50% at 50% 50%, rgba(80,120,255,0.08), transparent 60%)
                `,
              }}
            />
            <div className="mx-auto max-w-[720px] px-8 text-center relative z-10">
              {/* Round 3: Større ikon + puls-glow */}
              <div
                className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-10 pulse-icon"
                style={{
                  background: 'rgba(212, 175, 55, 0.12)',
                  border: '1.5px solid rgba(212, 175, 55, 0.25)',
                  color: '#D4AF37',
                  boxShadow: '0 0 35px rgba(212,175,55,0.15)',
                }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L15 8L21 9L16.5 14L18 21L12 17.5L6 21L7.5 14L3 9L9 8L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2
                className="text-3xl lg:text-[38px] font-semibold mb-4"
                style={{
                  color: '#FFFFFF',
                  letterSpacing: '-0.02em',
                  lineHeight: '1.2',
                }}
              >
                Klar til å starte?
              </h2>
              <p
                className="text-base mb-10"
                style={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  lineHeight: '1.7',
                }}
              >
                Opprett profilen din og få din første match innen 24 timer.
              </p>
              <a
                href="/onboarding"
                className="cta-pulse mobile-full-cta inline-flex items-center justify-center px-12 py-5 rounded-xl text-base font-medium transition-all duration-300 ease-out relative"
                style={{
                  background: '#D4AF37',
                  color: '#0B0E11',
                  boxShadow: '0 0 40px rgba(212,175,55,0.45), 0 0 1px rgba(212,175,55,0.6), 0 4px 16px rgba(0,0,0,0.2)',
                  border: '1px solid rgba(212,175,55,0.3)',
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.background = '#E8C766';
                  (e.target as HTMLElement).style.boxShadow = '0 0 60px rgba(212,175,55,0.75), 0 0 2px rgba(212,175,55,0.8), 0 6px 20px rgba(0,0,0,0.25)';
                  (e.target as HTMLElement).style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.background = '#D4AF37';
                  (e.target as HTMLElement).style.boxShadow = '0 0 40px rgba(212,175,55,0.45), 0 0 1px rgba(212,175,55,0.6), 0 4px 16px rgba(0,0,0,0.2)';
                  (e.target as HTMLElement).style.transform = 'translateY(0)';
                }}
              >
                Opprett konto
              </a>
            </div>
          </section>
        </main>

        {/* Footer */}
        <Footer />
      </div>
      </>
    );
}