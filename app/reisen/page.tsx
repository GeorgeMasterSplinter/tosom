/**
 * ToSom — Reisen
 * 
 * Placeholder for the guided 30-day journey explanation page.
 */

'use client';

import { Header } from '@/components/ui5/Header';
import { Footer } from '@/components/ui5/Footer';
import { GlassPanel } from '@/components/ui5/GlassPanel';

export default function ReisenPage() {
  const faser = [
    {
      nummer: '01',
      tittel: 'Introduksjon (Dag 1–7)',
      beskrivelse: 'Bygg grunnlaget med lette, men meningsfulle samtaler. Lær hverandres verden å kjenne.',
    },
    {
      nummer: '02',
      tittel: 'Trygghet & åpenhet (Dag 8–14)',
      beskrivelse: 'Fordyp dere og lær hverandre å kjenne. Uten bilder, med fokus på det som virkelig teller.',
    },
    {
      nummer: '03',
      tittel: 'Dypere samtaler (Dag 15–22)',
      beskrivelse: 'Utforsk verdier, drivere og relasjonsmønstre sammen.',
    },
    {
      nummer: '04',
      tittel: 'Felles reise (Dag 23–30)',
      beskrivelse: 'Etabler en varig forbindelse med dyp resonans. To mennesker, én vei.',
    },
  ];

  return (
    <>
      <div className="min-h-screen relative" style={{ 
        background: 'linear-gradient(180deg, #1A1F26 0%, #0E1218 100%)'
      }}>
        <div
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            background: `
              radial-gradient(ellipse 80% 60% at 50% 30%, rgba(80,120,255,0.12), transparent 70%),
              linear-gradient(180deg, #1A1F26 0%, #0E1218 100%)
            `,
          }}
        />

        <Header currentPath="/reisen" />

        <main className="relative z-10 max-w-4xl mx-auto px-6 py-24">
          {/* Hero */}
          <div className="text-center mb-20">
            <span
              className="text-xs uppercase tracking-[0.3em] font-semibold mb-4 block"
              style={{ color: '#D4AF37' }}
            >
              Reisen
            </span>
            <h1
              className="text-3xl md:text-[48px] font-semibold mb-6"
              style={{
                color: '#FFFFFF',
                letterSpacing: '-0.02em',
                lineHeight: '1.2',
              }}
            >
              En guidet 30-dagers reise
            </h1>
            <p
              className="text-base md:text-lg max-w-2xl mx-auto"
              style={{
                color: 'rgba(255, 255, 255, 0.6)',
                lineHeight: '1.7',
              }}
            >
              Når du matcher med noen, starter en styrt reise sammen. Hver dag får dere refleksjoner, samtaletemaer og oppgaver som hjelper dere å bli kjent på en trygg og meningsfull måte.
            </p>
          </div>

          {/* Faser */}
          <div className="space-y-8">
            {faser.map((fase, index) => (
              <GlassPanel key={index} goldBorder padding="xl" className="relative">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div
                    className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center text-xl font-semibold"
                    style={{
                      background: 'rgba(212, 175, 55, 0.12)',
                      border: '1.5px solid rgba(212, 175, 55, 0.25)',
                      color: '#D4AF37',
                    }}
                  >
                    {fase.nummer}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2" style={{ color: '#FFFFFF' }}>
                      {fase.tittel}
                    </h3>
                    <p style={{ color: 'rgba(255, 255, 255, 0.55)', lineHeight: '1.7' }}>
                      {fase.beskrivelse}
                    </p>
                  </div>
                </div>
              </GlassPanel>
            ))}
          </div>

          {/* Etter 30 dager */}
          <GlassPanel goldBorder padding="xl" className="text-center mt-12">
            <h3 className="text-lg font-semibold mb-2" style={{ color: '#FFFFFF' }}>
              Etter 30 dager
            </h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.55)', lineHeight: '1.7' }}>
              Dere velger selv om dere vil fortsette, avslutte, eller starte en ny reise med en ny match.
            </p>
          </GlassPanel>
        </main>

        <Footer />
      </div>
    </>
  );
}