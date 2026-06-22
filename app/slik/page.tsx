/**
 * ToSom — Slik fungerer det
 * 
 * Side: Steg-forskjande forklaring.
 */

import { Header } from '@/components/ui5/Header';
import { Footer } from '@/components/ui5/Footer';
import { GlassPanel } from '@/components/ui5/GlassPanel';

export default function SlikPage() {
  const steg = [
    {
      nummer: '01',
      tittel: 'Opprett konto',
      beskrivelse: 'Skriv inn e-post og mottar en magisk innloggingslenke. Ingen passord, ingen krangel.',
    },
    {
      nummer: '02',
      tittel: 'Fullfør profilen',
      beskrivelse: 'Forskingsbasert onboarding som avslører hvem du er — verdier, livssituasjon og relasjonsstil.',
    },
    {
      nummer: '03',
      tittel: 'Få én match',
      beskrivelse: 'ToSom matcher deg basert på resonans, ikke overflate. Får du én match innen 24 timer.',
    },
    {
      nummer: '04',
      tittel: 'Start reisen',
      beskrivelse: 'Dere går inn i et privat rom og starter en guidet 30-dagers reise sammen.',
    },
  ];

  return (
    <>
      <div className="min-h-screen relative" style={{ 
        background: 'linear-gradient(180deg, #1A1F26 0%, #0E1218 100%)'
      }}>
        <Header currentPath="/slik" />

        <main className="relative z-10 max-w-4xl mx-auto px-6 py-32">
          <div className="text-center mb-20">
            <span
              className="text-xs uppercase tracking-[0.3em] font-semibold mb-4 block"
              style={{ color: '#D4AF37' }}
            >
              Slik fungerer det
            </span>
            <h1
              className="text-3xl md:text-[48px] font-semibold mb-6"
              style={{ color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: '1.2' }}
            >
              Tre enkle steg til din match
            </h1>
            <p
              className="text-base md:text-lg max-w-2xl mx-auto"
              style={{ color: 'rgba(255, 255, 255, 0.6)', lineHeight: '1.7' }}
            >
              ToSom forenkler hele prosessen — fra første klikk til dyp forbindelse.
            </p>
          </div>

          <div className="space-y-8">
            {steg.map((stegItem, index) => (
              <GlassPanel key={index} goldBorder padding="xl">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div
                    className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center text-xl font-semibold"
                    style={{
                      background: 'rgba(212, 175, 55, 0.12)',
                      border: '1.5px solid rgba(212, 175, 55, 0.25)',
                      color: '#D4AF37',
                    }}
                  >
                    {stegItem.nummer}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2" style={{ color: '#FFFFFF' }}>
                      {stegItem.tittel}
                    </h3>
                    <p style={{ color: 'rgba(255, 255, 255, 0.55)', lineHeight: '1.7' }}>
                      {stegItem.beskrivelse}
                    </p>
                  </div>
                </div>
              </GlassPanel>
            ))}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}