/**
 * ToSom Landing Page
 * 
 * Minimal landing: Hero + 5 punkter + CTA + Footer
 * Premium Dark + Glassmorphism design
 * Moderne norsk bokmål
 */

'use client';

import { Footer } from '@/components/ui5/Footer';
import { Hero } from '@/components/ui5/Hero';
import { Glass } from '@/components/ui5/Glass';
import { color, spacing, radius } from '@/config/design-tokens';
import Link from 'next/link';

/* ========================
   COMPONENT
   ======================== */

export default function LandingPage() {
  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .stagger-fade > * {
          animation: fadeUp 0.6s ease-out both;
        }
        .stagger-fade > *:nth-child(1) { animation-delay: 0.05s; }
        .stagger-fade > *:nth-child(2) { animation-delay: 0.15s; }
        .stagger-fade > *:nth-child(3) { animation-delay: 0.25s; }
        
        /* Mobiloptimalisering < 640px */
        @media (max-width: 640px) {
          .mobile-full-cta { width: 100% !important; }
          .cta-wave-primary { width: 200% !important; opacity: 0.035 !important; }
          .cta-wave-secondary { width: 220% !important; opacity: 0.02 !important; }
          .cta-spotlight { width: 1050px !important; height: 750px !important; }
          .cta-title { font-size: 42px !important; }
          .cta-subtitle { font-size: 17px !important; }
        }
      `}</style>

      <div className="min-h-screen relative" style={{ 
        background: 'linear-gradient(180deg, #0A0F1A 0%, #0F1923 50%, #0A0F1A 100%)'
      }}>
        {/* Ambient blå lysglød — redusert */}
        <div
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            background: `
              radial-gradient(ellipse 80% 60% at 50% 30%, rgba(80,120,255,0.05), transparent 70%),
              linear-gradient(180deg, #0A0F1A 0%, #0F1923 50%, #0A0F1A 100%)
            `,
          }}
        />

        <main className="relative z-10">
          {/* Hero — min 80px py, spotlight sentrert */}
          <section className="relative overflow-hidden py-20 md:py-[100px]">
            <Hero />
          </section>

          {/* 5 punkter: Velvære, Privat profil, Match, Forskning, Dybde — Siste 10% polish */}
          <section 
            className="relative overflow-hidden py-16 md:py-[100px]"
          >
            <div className="section-wrapper relative z-10">
              <div className="mx-auto max-w-[820px] text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-semibold mb-4" style={{ color: 'rgba(255,255,255,0.92)' }}>
                  Slik fungerer det
                </h2>
                <p className="text-xl" style={{ color: 'rgba(255,255,255,0.90)', letterSpacing: '0.2px' }}>
                  ToSom er bygget for kvalitet, ikke kvantitet. Her er hvordan det fungerer.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-9 max-w-[1200px] mx-auto px-6 md:px-8">
                {/* Punkt 1: Velvære først */}
                <div className="text-center group">
                  <div
                    className="text-center rounded-3xl p-[42px] transition-all duration-300 ease-out h-full"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      backdropFilter: 'blur(7px)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      boxShadow: '0 3px 16px rgba(0,0,0,0.108)',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 22px rgba(0,0,0,0.144)';
                      (e.currentTarget as HTMLElement).style.border = '1px solid rgba(212,175,55,0.12)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)';
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 3px 16px rgba(0,0,0,0.108)';
                      (e.currentTarget as HTMLElement).style.border = '1px solid rgba(255,255,255,0.06)';
                    }}
                  >
                    <div 
                      className="flex justify-center mb-[26px] w-8 h-8 mx-auto rounded-2xl items-center justify-center transition-all duration-300 ease-out"
                      style={{
                        background: 'rgba(212,175,55,0.06)',
                        border: '1px solid rgba(212,175,55,0.12)',
                        color: '#D4AF37',
                        boxShadow: 'none',
                      }}
                    >
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                        <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 8V12L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-[22px]" style={{ color: 'rgba(255,255,255,0.92)' }}>
                      Velvære først
                    </h3>
                    <p className="text-base" style={{ color: 'rgba(255,255,255,0.90)', lineHeight: '1.7', maxWidth: '95%' }}>
                      Vi senker tempoet, ikke kvaliteten.<br />Trygghet og emosjonell komfort kommer før alt annet.
                    </p>
                  </div>
                </div>

                {/* Punkt 2: Privat profil */}
                <div className="text-center group">
                  <div
                    className="text-center rounded-3xl p-[42px] transition-all duration-300 ease-out h-full"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      backdropFilter: 'blur(7px)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      boxShadow: '0 3px 16px rgba(0,0,0,0.108)',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 22px rgba(0,0,0,0.144)';
                      (e.currentTarget as HTMLElement).style.border = '1px solid rgba(212,175,55,0.12)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)';
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 3px 16px rgba(0,0,0,0.108)';
                      (e.currentTarget as HTMLElement).style.border = '1px solid rgba(255,255,255,0.06)';
                    }}
                  >
                    <div 
                      className="flex justify-center mb-[26px] w-8 h-8 mx-auto rounded-2xl items-center justify-center transition-all duration-300 ease-out"
                      style={{
                        background: 'rgba(212,175,55,0.06)',
                        border: '1px solid rgba(212,175,55,0.12)',
                        color: '#D4AF37',
                        boxShadow: 'none',
                      }}
                    >
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                        <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M20.5 21C20.5 18.7909 18.7091 17 16.5 17H7.5C5.29086 17 3.5 18.7909 3.5 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-[22px]" style={{ color: 'rgba(255,255,255,0.92)' }}>
                      Privat profil
                    </h3>
                    <p className="text-base" style={{ color: 'rgba(255,255,255,0.90)', lineHeight: '1.7', maxWidth: '95%' }}>
                      Profilen din er helt privat og aldri offentlig.<br />Du deler kun med den ene personen du matches med – og bare når du selv vil.
                    </p>
                  </div>
                </div>

                {/* Punkt 3: Få en match innen 24 timer */}
                <div className="text-center group">
                  <div
                    className="text-center rounded-3xl p-[42px] transition-all duration-300 ease-out h-full"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      backdropFilter: 'blur(7px)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      boxShadow: '0 3px 16px rgba(0,0,0,0.108)',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 22px rgba(0,0,0,0.144)';
                      (e.currentTarget as HTMLElement).style.border = '1px solid rgba(212,175,55,0.12)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)';
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 3px 16px rgba(0,0,0,0.108)';
                      (e.currentTarget as HTMLElement).style.border = '1px solid rgba(255,255,255,0.06)';
                    }}
                  >
                    <div 
                      className="flex justify-center mb-[26px] w-8 h-8 mx-auto rounded-2xl items-center justify-center transition-all duration-300 ease-out"
                      style={{
                        background: 'rgba(212,175,55,0.06)',
                        border: '1px solid rgba(212,175,55,0.12)',
                        color: '#D4AF37',
                        boxShadow: 'none',
                      }}
                    >
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L15 8L21 9L16.5 14L18 21L12 17.5L6 21L7.5 14L3 9L9 8L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-[22px]" style={{ color: 'rgba(255,255,255,0.92)' }}>
                      Få en match innen 24 timer
                    </h3>
                    <p className="text-base" style={{ color: 'rgba(255,255,255,0.90)', lineHeight: '1.7', maxWidth: '95%' }}>
                      Du får én match om gangen – valgt med omtanke, ikke tilfeldighet.<br />Ingen endeløs sveiping. Ingen overveldende valg.
                    </p>
                  </div>
                </div>

                {/* Punkt 4: Forskningsbasert matching */}
                <div className="text-center group">
                  <div
                    className="text-center rounded-3xl p-[42px] transition-all duration-300 ease-out h-full"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      backdropFilter: 'blur(7px)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      boxShadow: '0 3px 16px rgba(0,0,0,0.108)',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 22px rgba(0,0,0,0.144)';
                      (e.currentTarget as HTMLElement).style.border = '1px solid rgba(212,175,55,0.12)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)';
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 3px 16px rgba(0,0,0,0.108)';
                      (e.currentTarget as HTMLElement).style.border = '1px solid rgba(255,255,255,0.06)';
                    }}
                  >
                    <div 
                      className="flex justify-center mb-[26px] w-8 h-8 mx-auto rounded-2xl items-center justify-center transition-all duration-300 ease-out"
                      style={{
                        background: 'rgba(212,175,55,0.06)',
                        border: '1px solid rgba(212,175,55,0.12)',
                        color: '#D4AF37',
                        boxShadow: 'none',
                      }}
                    >
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                        <path d="M9 3H5C4.46957 3 3.96086 3.21071 3.58579 3.58579C3.21071 3.96086 3 4.46957 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9 3V7C9 8.10457 9.89543 9 11 9H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9 15L11 17L15 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-[22px]" style={{ color: 'rgba(255,255,255,0.92)' }}>
                      Forskningsbasert matching
                    </h3>
                    <p className="text-base" style={{ color: 'rgba(255,255,255,0.90)', lineHeight: '1.7', maxWidth: '95%' }}>
                      Vi matcher på livssituasjon, verdier, relasjonsstil og emosjonell kompatibilitet.<br />Ikke overflate. Ikke tilfeldigheter. Bare det som faktisk betyr noe i et forhold.
                    </p>
                  </div>
                </div>

                {/* Punkt 5: Bygget for dybde */}
                <div className="text-center group">
                  <div
                    className="text-center rounded-3xl p-[42px] transition-all duration-300 ease-out h-full"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      backdropFilter: 'blur(7px)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      boxShadow: '0 3px 16px rgba(0,0,0,0.108)',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 22px rgba(0,0,0,0.144)';
                      (e.currentTarget as HTMLElement).style.border = '1px solid rgba(212,175,55,0.12)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)';
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 3px 16px rgba(0,0,0,0.108)';
                      (e.currentTarget as HTMLElement).style.border = '1px solid rgba(255,255,255,0.06)';
                    }}
                  >
                    <div 
                      className="flex justify-center mb-[26px] w-8 h-8 mx-auto rounded-2xl items-center justify-center transition-all duration-300 ease-out"
                      style={{
                        background: 'rgba(212,175,55,0.06)',
                        border: '1px solid rgba(212,175,55,0.12)',
                        color: '#D4AF37',
                        boxShadow: 'none',
                      }}
                    >
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                        <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-[22px]" style={{ color: 'rgba(255,255,255,0.92)' }}>
                      Bygget for dybde
                    </h3>
                    <p className="text-base" style={{ color: 'rgba(255,255,255,0.90)', lineHeight: '1.7', maxWidth: '95%' }}>
                      Samtaler, spørsmål og små oppgaver som hjelper dere å komme nærmere.<br />Mindre overflate. Mer mening.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA — Ultra-Premium Fase 2: dobbel størrelse, bølger, spotlight, premium dybde */}
          <section 
            className="relative overflow-hidden"
            style={{
              paddingTop: '220px',
              paddingBottom: '220px',
              background: 'linear-gradient(180deg, #0A0F1A 0%, #0F1923 50%, #0A0F1A 100%)',
            }}
          >
            {/* ── Z-0: Atmosfæren ── */}

            {/* Sterk spotlight bak CTA-tekst */}
            <div
              className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[1400px] h-[1000px] pointer-events-none"
              style={{
                background: 'radial-gradient(circle at center, rgba(255,255,255,0.06), transparent 70%)',
              }}
            />

            {/* Subtil vertikal lysgradient bak CTA-teksten */}
            <div
              className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.018) 0%, transparent 100%)',
              }}
            />

            {/* Bølge 1: primær, blå → mørk blå */}
            <div
              className="absolute bottom-0 left-0 w-[160%] opacity-[0.05] pointer-events-none z-0"
            >
              <svg
                viewBox="0 0 2000 200"
                preserveAspectRatio="none"
                className="w-full h-full"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="ctaWave1Grad" x1="0" y1="0" x2="2000" y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#1A2A3A" />
                    <stop offset="100%" stopColor="#0A0F1A" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,100 C250,60 500,140 750,100 C1000,60 1250,130 1500,100 C1750,70 1875,110 2000,100 L2000,200 L0,200 Z"
                  fill="url(#ctaWave1Grad)"
                />
              </svg>
            </div>

            {/* Bølge 2: sekundær, gull → transparent */}
            <div
              className="absolute bottom-0 left-0 w-[180%] opacity-[0.03] pointer-events-none z-0"
            >
              <svg
                viewBox="0 0 2200 200"
                preserveAspectRatio="none"
                className="w-full h-full"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="ctaWave2Grad" x1="0" y1="0" x2="2200" y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#D4AF37" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,100 C275,70 550,135 825,100 C1100,65 1375,125 1650,100 C1925,75 2062,112 2200,100 L2200,200 L0,200 Z"
                  fill="url(#ctaWave2Grad)"
                />
              </svg>
            </div>

            {/* ── Z-10: Innhold ── */}
            <div className="section-wrapper relative z-10">
              <div className="mx-auto max-w-[900px] text-center mb-[40px]">
                <h2
                  className="text-5xl md:text-6xl font-semibold tracking-[-0.02em] leading-[1.1]"
                  style={{ color: 'rgba(255,255,255,0.92)' }}
                >
                  Klar til å starte?
                </h2>
              </div>
              <div className="mx-auto max-w-[720px] text-center mb-[52px]">
                <p
                  className="text-xl md:text-2xl leading-[1.7]"
                  style={{ color: 'rgba(255,255,255,0.90)', letterSpacing: '0.22px' }}
                >
                  Lag profilen din i ditt eget tempo og møt noen som faktisk passer deg – på ordentlig.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-7 justify-center max-w-[900px] mx-auto px-6">
                {/* Opprett konto — større premium knapp */}
                <Link
                  href="/onboarding/start"
                  className="inline-flex items-center justify-center w-full sm:w-[340px] h-[72px] px-24 rounded-2xl font-semibold transition-all duration-300 ease-out text-[1.25rem]"
                  style={{
                    background: 'linear-gradient(135deg, rgba(212,175,55,0.92) 0%, rgba(232,194,122,0.92) 100%)',
                    color: '#0A0F1A',
                    boxShadow: '0 8px 28px rgba(212,175,55,0.18)',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 34px rgba(212,175,55,0.22), 0 12px 38px rgba(0,0,0,0.18)';
                    (e.currentTarget as HTMLElement).style.transform = 'scale(1.008)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 28px rgba(212,175,55,0.18)';
                    (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                  }}
                >
                  Opprett konto
                </Link>
                {/* Logg inn — glass premium knapp */}
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center w-full sm:w-[340px] h-[72px] px-24 rounded-2xl font-medium transition-all duration-300 ease-out text-[1.25rem]"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(10px)',
                    color: 'rgba(255,255,255,0.90)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    boxShadow: '0 6px 22px rgba(0,0,0,0.18)',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)';
                    (e.currentTarget as HTMLElement).style.color = '#FFFFFF';
                    (e.currentTarget as HTMLElement).style.border = '1px solid rgba(212,175,55,0.20)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
                    (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.90)';
                    (e.currentTarget as HTMLElement).style.border = '1px solid rgba(255,255,255,0.12)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 22px rgba(0,0,0,0.18)';
                  }}
                >
                  Logg inn
                </Link>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}