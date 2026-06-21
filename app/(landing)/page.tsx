/**
 * ToSom UI 5.0 — Landing Page (Round 2)
 * 
 * Premium landingsside med ny visuell identitet
 * 12-kolonne grid, 1600px max-width, 48-64px vertikal spacing
 * Bokmål
 */

'use client';

import { Header } from '@/components/ui5/Header';
import { Footer } from '@/components/ui5/Footer';
import { Hero } from '@/components/ui5/Hero';
import { GlassPanel } from '@/components/ui5/GlassPanel';
import { ThreeStepSection } from '@/components/ui5/ThreeStep';
import { Timeline } from '@/components/ui5/Timeline';
import { TrustSection } from '@/components/ui5/TrustSection';

export default function LandingPage() {
  /* 3-stegs data */
  const steps = [
    {
      number: 1,
      title: 'Veiledet, forskningsbasert profil',
      description: 'Svar på dype spørsmål om deg selv. Verdiene, livssituasjonen, relasjonsstilen.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L15 8L21 9L16.5 14L18 21L12 17.5L6 21L7.5 14L3 9L9 8L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      number: 2,
      title: 'Match innen 24 timer',
      description: 'Når profilen din er ferdig, får du én match innen 24 timer. Den beste kompatibiliteten.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <circle cx="8" cy="12" r="6" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="16" cy="12" r="6" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      ),
    },
    {
      number: 3,
      title: 'Guidet 30-dagers reise',
      description: 'Dere går inn i et privat rom med daglige refleksjoner, oppgaver og samtaletema.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M4 12C4 7 7 4 12 4C17 4 20 7 20 12C20 17 17 20 12 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
  ];

  /* Timeline faser */
  const phases = [
    {
      number: 1,
      title: 'Introduksjon',
      duration: 'Dag 1–7',
      description: 'Bygg grunnlaget med lette, men meningsfulle samtaler.',
      features: ['Daglige refleksjonsspørsmål', 'Lette samtaletema', 'Bygge trygghet'],
    },
    {
      number: 2,
      title: 'Trygghet & Åpne deg',
      duration: 'Dag 8–14',
      description: 'Fordyp deg og lær hverandre å kjenne.',
      features: ['Dypere refleksjoner', 'Sårbarhetsøvinger', 'Kommunikasjonstema'],
    },
    {
      number: 3,
      title: 'Dypere samtaler',
      duration: 'Dag 15–22',
      description: 'Utforsk verdiene, drivere og relasjonsmønster.',
      features: ['Verdisamtaler', 'Fremtidsønsker', 'Emosjonell resonans'],
    },
    {
      number: 4,
      title: 'Felles reise',
      duration: 'Dag 23–30',
      description: 'Etabler en varig forbindelse med dyp resonans.',
      features: ['Gjensidig forståelse', 'Felles oppgaver', 'Oppsummering'],
    },
  ];

  /* Trust data */
  const notFeatures = [
    { icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>, text: 'Ingen offentlige profiler' },
    { icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>, text: 'Ingen feed eller støy' },
    { icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>, text: 'Ingen swipe' },
    { icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>, text: 'Ingen press' },
    { icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>, text: 'Ingen konkurranse' },
    { icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>, text: 'Ingen støy' },
  ];

  return (
    <>
      {/* Round 4 Global Lighting CSS */}
      <style>{`
        @keyframes pulseGlow {
          0%, 100% { filter: drop-shadow(0 0 8px rgba(212,175,55,0.3)); }
          50% { filter: drop-shadow(0 0 20px rgba(212,175,55,0.55)); }
        }
        .pulse-icon { animation: pulseGlow 2.5s infinite ease-in-out; }
      `}</style>
      <div className="min-h-screen relative" style={{ 
        background: 'linear-gradient(180deg, #1A1F26 0%, #0E1218 100%)'
      }}>
        {/* Round 4: Ambient blå lysglød — styrkt */}
        <div
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            background: `
              radial-gradient(ellipse 80% 60% at 50% 30%, rgba(80,120,255,0.12), transparent 70%),
              radial-gradient(ellipse 60% 50% at 20% 70%, rgba(80,120,255,0.06), transparent 60%),
              radial-gradient(ellipse 60% 50% at 80% 60%, rgba(80,120,255,0.06), transparent 60%),
              radial-gradient(ellipse 100% 70% at 50% 50%, rgba(80,120,255,0.05), transparent 65%),
              linear-gradient(180deg, #1A1F26 0%, #0E1218 100%)
            `,
          }}
        />
        {/* Round 4: Forsterk vignette */}
        <div
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            background: 'radial-gradient(circle at center, transparent 55%, rgba(0,0,0,0.45) 100%)',
          }}
        />
      {/* Header */}
      <Header currentPath="/" />

      {/* Main content — z-index over bakgrunnen */}
      <main className="relative z-10">
        {/* Hero Section */}
        <Hero
          title="En rolig, moderne relasjonsplattform for voksne (23+)"
          subtitle="Når du har fullført profilen din, får du én match innen 24 timer."
          ctaText="Opprett konto"
          secondaryText="Logg inn"
        />

        {/* 3-Step Section */}
        <ThreeStepSection
          title="Slik fungerer det"
          subtitle="Tre enkle steg mot en meningsfull forbindelse"
          steps={steps}
        />

        {/* Profilseksjon — Round 5: mer premium */}
        <section className="py-36 relative overflow-hidden" style={{ background: '#11151A' }}>
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                radial-gradient(ellipse 50% 50% at 70% 40%, rgba(80,120,255,0.04), transparent 70%),
                radial-gradient(ellipse 40% 40% at 30% 60%, rgba(212,175,55,0.03), transparent 60%)
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
                  className="text-3xl lg:text-[36px] font-semibold mb-6"
                  style={{
                    color: '#FFFFFF',
                    letterSpacing: '-0.02em',
                    lineHeight: '1.2',
                  }}
                >
                  En dyp, privat profil — aldri offentlig
                </h2>
                <p
                  className="text-base leading-relaxed mb-6"
                  style={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    lineHeight: '1.7',
                  }}
                >
                  Profilen din er veiledet og forskningsbasert. Du bygger den steg for steg — og den blir brukt til å finne én god match, ikke mange dårlige.
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
              <GlassPanel goldBorder padding="xl" className="text-center relative">
                <div className="flex justify-center mb-7">
                  <div
                    className="w-28 h-28 rounded-full flex items-center justify-center relative"
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

        {/* Matchingseksjon — Round 5: MAX FOKUS */}
        <section className="py-40">
          <div className="mx-auto max-w-[720px] px-8 text-center">
            {/* Round 5: Klokke-ikon 40% større + sterkere puls-glow */}
            <div
              className="inline-flex items-center justify-center w-25 h-25 rounded-2xl mb-12 pulse-icon"
              style={{
                background: 'rgba(212, 175, 55, 0.14)',
                border: '2px solid rgba(212, 175, 55, 0.30)',
                color: '#D4AF37',
                boxShadow: '0 0 55px rgba(212,175,55,0.20), inset 0 0 16px rgba(212,175,55,0.10)',
              }}
            >
              <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
                <circle cx="12" cy="16" r="10" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="20" cy="16" r="10" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </div>
            <span
              className="text-xs uppercase tracking-[0.3em] font-semibold mb-4 block"
              style={{ color: '#D4AF37' }}
            >
              Matching
            </span>
            <h2
              className="text-3xl lg:text-[36px] font-semibold mb-4"
              style={{
                color: '#FFFFFF',
                letterSpacing: '-0.02em',
                lineHeight: '1.2',
              }}
            >
              Én match. Den beste.
            </h2>
            {/* Round 5: Gull-linje 3px + sterkere glow + indre refleks */}
            <div
              className="w-28 h-[3px] mx-auto mb-10 rounded-full relative"
              style={{
                background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)',
                boxShadow: '0 0 50px rgba(212,175,55,0.50), inset 0 0 16px rgba(212,175,55,0.30)',
              }}
            />
            {/* Glow-layer — Round 5: 6px blur */}
            <div
              className="w-32 h-[8px] mx-auto mb-10 rounded-full relative -translate-y-[2px]"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.28), transparent)',
                filter: 'blur(5px)',
              }}
            />
            <p
              className="text-base leading-relaxed mb-10 max-w-[540px] mx-auto"
              style={{
                color: 'rgba(255, 255, 255, 0.6)',
                lineHeight: '1.7',
              }}
            >
              Når du har fullført profilen din, får du én match innen 24 timer.
              Ikke flere. Ikke tilfeldig. Den beste kompatibiliteten for deg.
            </p>

            {/* GlassPanel med klokke */}
            <GlassPanel padding="lg" className="text-left">
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(212, 175, 55, 0.12)', color: '#D4AF37' }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M12 7V12L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-base mb-0.5" style={{ color: '#FFFFFF' }}>Resonans-matching</p>
                  <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.45)' }}>Kunnskap, ikke utseende — innen 24 timer</p>
                </div>
              </div>
            </GlassPanel>
          </div>
        </section>

        {/* 30-dagers reise — Round 5: sterkere */}
        <Timeline
          title="Den guidede 30-dagers reisen"
          subtitle="Fire faser som fører deg fra introduksjon til dyp forbindelse"
          phases={phases}
        />

        {/* Trust — Round 5: sterkere */}
        <TrustSection
          title="Hva ToSom ikke er"
          subtitle="Vi har fjernet all støy, press og overfladiskhet"
          notFeatures={notFeatures}
        />

        {/* CTA — Round 5: Sterkere ambient glow */}
        <section className="py-40 relative overflow-hidden" style={{ background: '#11151A' }}>
          {/* Round 4: Ambient glow bak CTA — sterkere */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                radial-gradient(ellipse 50% 50% at 50% 50%, rgba(212,175,55,0.08), transparent 70%),
                radial-gradient(ellipse 60% 50% at 50% 50%, rgba(80,120,255,0.06), transparent 60%)
              `,
            }}
          />
          <div className="mx-auto max-w-[720px] px-8 text-center relative z-10">
            {/* Round 4: Større ikon + puls-glow */}
            <div
              className="inline-flex items-center justify-center w-18 h-18 rounded-2xl mb-10 pulse-icon"
              style={{
                background: 'rgba(212, 175, 55, 0.12)',
                border: '1.5px solid rgba(212, 175, 55, 0.25)',
                color: '#D4AF37',
                boxShadow: '0 0 35px rgba(212,175,55,0.12)',
              }}
            >
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L15 8L21 9L16.5 14L18 21L12 17.5L6 21L7.5 14L3 9L9 8L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2
              className="text-3xl lg:text-[36px] font-semibold mb-4"
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
              className="inline-flex items-center px-12 py-5 rounded-xl text-base font-medium transition-all duration-300 ease-out relative"
              style={{
                background: '#D4AF37',
                color: '#0B0E11',
                boxShadow: '0 0 40px rgba(212,175,55,0.45), 0 0 1px rgba(212,175,55,0.6), 0 4px 16px rgba(0,0,0,0.2)',
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.background = '#E8C766';
                (e.target as HTMLElement).style.boxShadow = '0 0 60px rgba(212,175,55,0.7), 0 0 2px rgba(212,175,55,0.8), 0 6px 20px rgba(0,0,0,0.25)';
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
