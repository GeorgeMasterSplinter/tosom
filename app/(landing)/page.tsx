/**
 * ToSom Landing Page — Clean Version
 * 
 * Minimal landing: Hero + 3 punkter + CTA + Footer
 * Bokmål
 */

'use client';

import { Header } from '@/components/ui5/Header';
import { Footer } from '@/components/ui5/Footer';
import { Hero } from '@/components/ui5/Hero';
import { GlassPanel } from '@/components/ui5/GlassPanel';
import { CtaButton } from '@/components/ui5/CtaButton';

export default function LandingPage() {
  return (
    <>
      {/* Animasjoner */}
      <style>{`
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
        
        @media (max-width: 640px) {
          .mobile-full-cta { width: 100% !important; }
          .mobile-hero-visual { order: 2 !important; }
        }
      `}</style>

      <div className="min-h-screen relative" style={{ 
        background: 'linear-gradient(180deg, #1A1F26 0%, #0E1218 100%)'
      }}>
        {/* Ambient blå lysglød */}
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
        {/* Vignette */}
        <div
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            background: 'radial-gradient(circle at center, transparent 50%, rgba(0,0,0,0.5) 100%)',
          }}
        />

        {/* Header */}
        <Header currentPath="/" />

        {/* Main content */}
        <main className="relative z-10">
          {/* Hero */}
          <Hero
            title="En rolig, moderne relasjonsplattform for voksne (23+)"
            subtitle="Når du har fullført profilen din, får du éin match innan 24 timer."
            ctaText="Opprett konto"
            secondaryText="Logg inn"
          />

          {/* 3 punkter: Profil, Match, Trygghet */}
          <section className="py-24 md:py-36 relative overflow-hidden">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `
                  radial-gradient(ellipse 50% 50% at 50% 50%, rgba(212,175,55,0.04), transparent 70%),
                  radial-gradient(ellipse 60% 50% at 50% 50%, rgba(80,120,255,0.06), transparent 60%)
                `,
              }}
            />
            <div className="mx-auto max-w-5xl px-6 lg:px-8 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 stagger-fade">
                {/* Punkt 1: Profil */}
                <div className="text-center">
                  <GlassPanel goldBorder padding="lg" className="text-center">
                    <div className="flex justify-center mb-5">
                      <div
                        className="w-16 h-16 rounded-xl flex items-center justify-center"
                        style={{
                          background: 'rgba(212, 175, 55, 0.12)',
                          border: '1.5px solid rgba(212, 175, 55, 0.25)',
                          color: '#D4AF37',
                        }}
                      >
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                          <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M20.5 21C20.5 18.7909 18.7091 17 16.5 17H7.5C5.29086 17 3.5 18.7909 3.5 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold mb-2" style={{ color: '#FFFFFF' }}>
                      Veiledet profil
                    </h3>
                    <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.55)', lineHeight: '1.6' }}>
                      Forskningsbasert profil som avslører hvem du er — verdier, livssituasjon og relasjonsstil.
                    </p>
                  </GlassPanel>
                </div>

                {/* Punkt 2: Match */}
                <div className="text-center">
                  <GlassPanel goldBorder padding="lg" className="text-center">
                    <div className="flex justify-center mb-5">
                      <div
                        className="w-16 h-16 rounded-xl flex items-center justify-center"
                        style={{
                          background: 'rgba(212, 175, 55, 0.12)',
                          border: '1.5px solid rgba(212, 175, 55, 0.25)',
                          color: '#D4AF37',
                        }}
                      >
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                          <path d="M12 2L15 8L21 9L16.5 14L18 21L12 17.5L6 21L7.5 14L3 9L9 8L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold mb-2" style={{ color: '#FFFFFF' }}>
                      Match innan 24 timer
                    </h3>
                    <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.55)', lineHeight: '1.6' }}>
                      Éin match, basert på kompatibilitet. Kvalitet framfor kvantitet.
                    </p>
                  </GlassPanel>
                </div>

                {/* Punkt 3: Trygghet */}
                <div className="text-center">
                  <GlassPanel goldBorder padding="lg" className="text-center">
                    <div className="flex justify-center mb-5">
                      <div
                        className="w-16 h-16 rounded-xl flex items-center justify-center"
                        style={{
                          background: 'rgba(212, 175, 55, 0.12)',
                          border: '1.5px solid rgba(212, 175, 55, 0.25)',
                          color: '#D4AF37',
                        }}
                      >
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                          <path d="M12 2L18 5V12C18 16.5 14.5 20.5 12 22C9.5 20.5 6 16.5 6 12V5L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold mb-2" style={{ color: '#FFFFFF' }}>
                      Trygghet & personvern
                    </h3>
                    <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.55)', lineHeight: '1.6' }}>
                      Ingen offentlege profiler. Ingen swipe. Alt du deler er privat og under din kontroll.
                    </p>
                  </GlassPanel>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-24 md:py-32 relative overflow-hidden">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `
                  radial-gradient(ellipse 50% 50% at 50% 50%, rgba(212,175,55,0.10), transparent 70%),
                  radial-gradient(ellipse 60% 50% at 50% 50%, rgba(80,120,255,0.08), transparent 60%)
                `,
              }}
            />
            <div className="mx-auto max-w-[640px] px-6 text-center relative z-10">
              <h2
                className="text-2xl md:text-[34px] font-semibold mb-4"
                style={{
                  color: '#FFFFFF',
                  letterSpacing: '-0.02em',
                  lineHeight: '1.2',
                }}
              >
                Klar til å starte?
              </h2>
              <p
                className="text-base mb-8"
                style={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  lineHeight: '1.7',
                }}
              >
                Opprett profilen din og få din første match innen 24 timer.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <CtaButton href="/onboarding" variant="gold">
                  Opprett konto
                </CtaButton>
                <CtaButton href="/login" variant="ghost">
                  Logg inn
                </CtaButton>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}