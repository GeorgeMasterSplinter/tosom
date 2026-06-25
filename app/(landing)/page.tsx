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
import { GlobalCTA } from '@/components/ui5/GlobalCTA';

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
          {/* Hero — redusert top padding for heva logo høgare */}
          <section className="relative overflow-hidden py-10 ph:py-14 md:py-[60px]">
            <Hero />
          </section>

          {/* 5 punkter: Velvære, Privat profil, Match, Forskning, Dybde — matcha hero-stil */}
          <section 
            className="relative overflow-hidden py-10 ph:py-14 md:py-[80px]"
          >
            <div className="section-wrapper relative z-10">
              <div className="mx-auto max-w-[320px] ph:max-w-[420px] md:max-w-[600px] text-center mb-12 ph:mb-16 px-6">
                <h2 className="text-2xl ph:text-3xl md:text-5xl font-semibold tracking-[-0.02em] mb-4" style={{ color: 'rgba(255,255,255,0.92)' }}>
                  Slik fungerer det
                </h2>
                <p className="text-base ph:text-lg md:text-xl leading-relaxed" style={{ color: 'rgba(255,255,255,0.90)' }}>
                  ToSom er bygget for kvalitet, ikke kvantitet. Her er hvordan det fungerer.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ph:gap-10 max-w-[900px] mx-auto px-6" style={{ rowGap: '24px' }}>
                {/* Punkt 1: Velvære først — premium glassmorphism */}
                <div className="text-center group">
                  <div
                    className="text-center rounded-3xl p-8 md:p-10 transition-all duration-300 ease-out h-full space-y-4"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(255,255,255,0.10)',
                      boxShadow: '0 0 40px rgba(0,0,0,0.30)',
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
                      className="flex justify-center mb-6 w-10 h-10 md:w-12 md:h-12 mx-auto rounded-2xl items-center justify-center transition-all duration-300 ease-out text-gold-300"
                      style={{
                        background: 'rgba(212,175,55,0.10)',
                        border: '1px solid rgba(212,175,55,0.20)',
                        color: '#D4AF37',
                        boxShadow: 'none',
                      }}
                    >
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                        <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 8V12L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h3 className="text-lg ph:text-xl md:text-xl font-semibold mb-[18px] ph:mb-[22px]" style={{ color: 'rgba(255,255,255,0.92)' }}>
                      Velvære først
                    </h3>
                    <p className="text-sm ph:text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.90)', lineHeight: '1.65', maxWidth: '95%' }}>
                      Vi senker tempoet, ikke kvaliteten.<br />Trygghet og emosjonell komfort kommer før alt annet.
                    </p>
                  </div>
                </div>

                {/* Punkt 2: Privat profil — premium glassmorphism */}
                <div className="text-center group">
                  <div
                    className="text-center rounded-3xl p-8 md:p-10 transition-all duration-300 ease-out h-full space-y-4"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(255,255,255,0.10)',
                      boxShadow: '0 0 40px rgba(0,0,0,0.30)',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)';
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 22px rgba(0,0,0,0.144)';
                      (e.currentTarget as HTMLElement).style.border = '1px solid rgba(212,175,55,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 0 40px rgba(0,0,0,0.30)';
                      (e.currentTarget as HTMLElement).style.border = '1px solid rgba(255,255,255,0.10)';
                    }}
                  >
                    <div 
                      className="flex justify-center mb-6 w-10 h-10 md:w-12 md:h-12 mx-auto rounded-2xl items-center justify-center transition-all duration-300 ease-out text-gold-300"
                      style={{
                        background: 'rgba(212,175,55,0.10)',
                        border: '1px solid rgba(212,175,55,0.20)',
                        color: '#D4AF37',
                        boxShadow: 'none',
                      }}
                    >
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
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

                {/* Punkt 3: Få en match innen 24 timer — premium glassmorphism */}
                <div className="text-center group">
                  <div
                    className="text-center rounded-3xl p-8 md:p-10 transition-all duration-300 ease-out h-full space-y-4"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(255,255,255,0.10)',
                      boxShadow: '0 0 40px rgba(0,0,0,0.30)',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)';
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 22px rgba(0,0,0,0.144)';
                      (e.currentTarget as HTMLElement).style.border = '1px solid rgba(212,175,55,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 0 40px rgba(0,0,0,0.30)';
                      (e.currentTarget as HTMLElement).style.border = '1px solid rgba(255,255,255,0.10)';
                    }}
                  >
                    <div 
                      className="flex justify-center mb-6 w-10 h-10 md:w-12 md:h-12 mx-auto rounded-2xl items-center justify-center transition-all duration-300 ease-out text-gold-300"
                      style={{
                        background: 'rgba(212,175,55,0.10)',
                        border: '1px solid rgba(212,175,55,0.20)',
                        color: '#D4AF37',
                        boxShadow: 'none',
                      }}
                    >
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
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

                {/* Punkt 4: Forskningsbasert matching — premium glassmorphism */}
                <div className="text-center group">
                  <div
                    className="text-center rounded-3xl p-8 md:p-10 transition-all duration-300 ease-out h-full space-y-4"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(255,255,255,0.10)',
                      boxShadow: '0 0 40px rgba(0,0,0,0.30)',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)';
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 22px rgba(0,0,0,0.144)';
                      (e.currentTarget as HTMLElement).style.border = '1px solid rgba(212,175,55,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 0 40px rgba(0,0,0,0.30)';
                      (e.currentTarget as HTMLElement).style.border = '1px solid rgba(255,255,255,0.10)';
                    }}
                  >
                    <div 
                      className="flex justify-center mb-6 w-10 h-10 md:w-12 md:h-12 mx-auto rounded-2xl items-center justify-center transition-all duration-300 ease-out text-gold-300"
                      style={{
                        background: 'rgba(212,175,55,0.10)',
                        border: '1px solid rgba(212,175,55,0.20)',
                        color: '#D4AF37',
                        boxShadow: 'none',
                      }}
                    >
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
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

                {/* Punkt 5: Bygget for dybde — premium glassmorphism */}
                <div className="text-center group">
                  <div
                    className="text-center rounded-3xl p-8 md:p-10 transition-all duration-300 ease-out h-full space-y-4"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(255,255,255,0.10)',
                      boxShadow: '0 0 40px rgba(0,0,0,0.30)',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)';
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 22px rgba(0,0,0,0.144)';
                      (e.currentTarget as HTMLElement).style.border = '1px solid rgba(212,175,55,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 0 40px rgba(0,0,0,0.30)';
                      (e.currentTarget as HTMLElement).style.border = '1px solid rgba(255,255,255,0.10)';
                    }}
                  >
                    <div 
                      className="flex justify-center mb-6 w-10 h-10 md:w-12 md:h-12 mx-auto rounded-2xl items-center justify-center transition-all duration-300 ease-out text-gold-300"
                      style={{
                        background: 'rgba(212,175,55,0.10)',
                        border: '1px solid rgba(212,175,55,0.20)',
                        color: '#D4AF37',
                        boxShadow: 'none',
                      }}
                    >
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
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

          {/* CTA (GlobalCTA) */}
          <GlobalCTA />
        </main>

        <Footer />
      </div>
    </>
  );
}