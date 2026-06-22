/**
 * ToSom — Priser
 * 
 * Side: Priser og abonnement.
 */

import { Header } from '@/components/ui5/Header';
import { Footer } from '@/components/ui5/Footer';
import { GlassPanel } from '@/components/ui5/GlassPanel';

export default function PriserPage() {
  return (
    <>
      <div className="min-h-screen relative" style={{ 
        background: 'linear-gradient(180deg, #1A1F26 0%, #0E1218 100%)'
      }}>
        <Header currentPath="/priser" />

        <main className="relative z-10 max-w-4xl mx-auto px-6 py-32">
          <div className="text-center mb-20">
            <span
              className="text-xs uppercase tracking-[0.3em] font-semibold mb-4 block"
              style={{ color: '#D4AF37' }}
            >
              Priser
            </span>
            <h1
              className="text-3xl md:text-[48px] font-semibold mb-6"
              style={{ color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: '1.2' }}
            >
              Enkel og rettferdig
            </h1>
            <p
              className="text-base md:text-lg max-w-2xl mx-auto"
              style={{ color: 'rgba(255, 255, 255, 0.6)', lineHeight: '1.7' }}
            >
              ToSom er i dag i lukket beta. Vi skal vise klare priser snart.
            </p>
          </div>

          <GlassPanel goldBorder padding="xl" className="text-center">
            <div className="flex flex-col items-center gap-4">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 6v12M8 10l4-4 4 4M8 18l4 4 4-4"
                  stroke="#D4AF37"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <h3 className="text-xl font-semibold" style={{ color: '#FFFFFF' }}>
                Fase 1: Lukket beta
              </h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.55)', lineHeight: '1.7' }}>
                Pris og abonnement kommer når plattformen er klar for offentligheten.
              </p>
            </div>
          </GlassPanel>
        </main>

        <Footer />
      </div>
    </>
  );
}