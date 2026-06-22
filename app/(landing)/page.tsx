/**
 * ToSom Landing Page
 * 
 * Minimal landing: Hero + 3 punkter + CTA + Footer
 * Nynorsk
 */

'use client';

import { Header } from '@/components/ui5/Header';
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
        
        @media (max-width: 640px) {
          .mobile-full-cta { width: 100% !important; }
        }
      `}</style>

      <div className="min-h-screen relative" style={{ 
        background: 'linear-gradient(180deg, #162032 0%, #0B1520 100%)'
      }}>
        {/* Ambient blå lysglød — redusert */}
        <div
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            background: `
              radial-gradient(ellipse 80% 60% at 50% 30%, rgba(80,120,255,0.06), transparent 70%),
              linear-gradient(180deg, #162032 0%, #0B1520 100%)
            `,
          }}
        />

        <Header currentPath="/" />

        <main className="relative z-10">
          {/* Hero */}
          <Hero />

          {/* 3 punkter: Profil, Match, Trygghet */}
          <section 
            className="relative overflow-hidden"
            style={{ paddingTop: `${spacing['5xl']}px`, paddingBottom: `${spacing['5xl']}px` }}
          >
            <div className="mx-auto max-w-5xl px-6 lg:px-8 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger-fade">
                {/* Punkt 1: Profil */}
                <div className="text-center">
                  <Glass variant="gold" padding="md" className="text-center">
                    <div 
                      className="flex justify-center mb-4 w-12 h-12 mx-auto rounded-lg items-center justify-center"
                      style={{
                        background: 'rgba(212,175,55,0.10)',
                        border: '1px solid rgba(212,175,55,0.18)',
                        color: color.brand.gold,
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M20.5 21C20.5 18.7909 18.7091 17 16.5 17H7.5C5.29086 17 3.5 18.7909 3.5 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h3 className="text-base font-semibold mb-1.5" style={{ color: color.text.primary }}>
                      Veiledet profil
                    </h3>
                    <p className="text-xs" style={{ color: color.text.muted, lineHeight: '1.55' }}>
                      Forskningsbasert profil som avslører hvem du er.
                    </p>
                  </Glass>
                </div>

                {/* Punkt 2: Match */}
                <div className="text-center">
                  <Glass variant="gold" padding="md" className="text-center">
                    <div 
                      className="flex justify-center mb-4 w-12 h-12 mx-auto rounded-lg items-center justify-center"
                      style={{
                        background: 'rgba(212,175,55,0.10)',
                        border: '1px solid rgba(212,175,55,0.18)',
                        color: color.brand.gold,
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L15 8L21 9L16.5 14L18 21L12 17.5L6 21L7.5 14L3 9L9 8L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h3 className="text-base font-semibold mb-1.5" style={{ color: color.text.primary }}>
                      Match innan 24 timer
                    </h3>
                    <p className="text-xs" style={{ color: color.text.muted, lineHeight: '1.55' }}>
                      Éin match. Kvalitet framfor kvantitet.
                    </p>
                  </Glass>
                </div>

                {/* Punkt 3: Trygghet */}
                <div className="text-center">
                  <Glass variant="gold" padding="md" className="text-center">
                    <div 
                      className="flex justify-center mb-4 w-12 h-12 mx-auto rounded-lg items-center justify-center"
                      style={{
                        background: 'rgba(212,175,55,0.10)',
                        border: '1px solid rgba(212,175,55,0.18)',
                        color: color.brand.gold,
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L18 5V12C18 16.5 14.5 20.5 12 22C9.5 20.5 6 16.5 6 12V5L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h3 className="text-base font-semibold mb-1.5" style={{ color: color.text.primary }}>
                      Trygghet & personvern
                    </h3>
                    <p className="text-xs" style={{ color: color.text.muted, lineHeight: '1.55' }}>
                      Ingen offentlege profiler. Ingen swipe.
                    </p>
                  </Glass>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section 
            className="relative overflow-hidden text-center"
            style={{ 
              paddingTop: `${spacing['5xl']}px`, 
              paddingBottom: `${spacing['5xl']}px`,
              background: `radial-gradient(ellipse 50% 50% at 50% 50%, rgba(212,175,55,0.06), transparent 70%), linear-gradient(180deg, #0B1520 0%, #060B10 100%)`,
            }}
          >
            <div className="mx-auto max-w-[560px] px-6 relative z-10">
              <h2
                className="text-2xl md:text-3xl font-semibold mb-4"
                style={{ color: color.text.primary, letterSpacing: '-0.02em', lineHeight: '1.2' }}
              >
                Klar til å starte?
              </h2>
              <p
                className="text-sm mb-8"
                style={{ color: color.text.secondary, lineHeight: '1.6' }}
              >
                Opprett profilen din. Få éin match innan 24 timer.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/onboarding/start"
                  className="inline-flex items-center justify-center px-10 py-3.5 rounded-[12px] font-medium transition-all duration-300 text-sm"
                  style={{
                    background: color.brand.gold,
                    color: '#0B1520',
                    boxShadow: `0 0 30px ${color.ambient.gold.medium}, 0 4px 12px rgba(0,0,0,0.2)`,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = color.brand['gold-hover'];
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = color.brand.gold;
                  }}
                >
                  Opprett konto
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center px-10 py-3.5 rounded-[12px] font-medium transition-all duration-300 text-sm border"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    color: color.text.secondary,
                    border: `1px solid ${color.border.default}`,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)';
                    (e.currentTarget as HTMLElement).style.color = color.text.primary;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                    (e.currentTarget as HTMLElement).style.color = color.text.secondary;
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