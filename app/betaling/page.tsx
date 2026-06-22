/**
 * ToSom — Betaling (Placeholder)
 * 
 * Her kommer betalingssteg (Stripe/annet).
 */

'use client';

import { Header } from '@/components/ui5/Header';
import { Footer } from '@/components/ui5/Footer';
import { GlassPanel } from '@/components/ui5/GlassPanel';

export default function BetalingPage() {
  return (
    <>
      <div className="min-h-screen relative" style={{ 
        background: 'linear-gradient(180deg, #1A1F26 0%, #0E1218 100%)'
      }}>
        <Header currentPath="/betaling" />

        <main className="relative z-10 max-w-4xl mx-auto px-6 py-32">
          <div className="text-center mb-20">
            <span
              className="text-xs uppercase tracking-[0.3em] font-semibold mb-4 block"
              style={{ color: '#D4AF37' }}
            >
              Betaling
            </span>
            <h1
              className="text-3xl md:text-[48px] font-semibold mb-6"
              style={{ color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: '1.2' }}
            >
              Fullfør profilen din
            </h1>
            <p
              className="text-base md:text-lg max-w-2xl mx-auto"
              style={{ color: 'rgba(255, 255, 255, 0.6)', lineHeight: '1.7' }}
            >
              Her kommer betalingssteg (Stripe/annet).
            </p>
          </div>

          <GlassPanel goldBorder padding="xl" className="text-center">
            <p style={{ color: 'rgba(255, 255, 255, 0.55)', lineHeight: '1.7' }}>
              Betaling er ennå ikkje aktivert. Når plattformen er klar, vil du kunne velge mellom ulike betalingsmuligheitar her.
            </p>
          </GlassPanel>
        </main>

        <Footer />
      </div>
    </>
  );
}