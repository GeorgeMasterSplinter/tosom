/**
 * ToSom — Kvifor ToSom
 * 
 * Side: Kvifor velje ToSom?
 */

import { Header } from '@/components/ui5/Header';
import { Footer } from '@/components/ui5/Footer';
import { GlassPanel } from '@/components/ui5/GlassPanel';

export default function KviforPage() {
  const grunner = [
    {
      tittel: 'Én match, ikke mange dårlige',
      beskrivelse: 'ToSom gir deg én kvalitetssmatch — ikke hundre oversynlige profiler å sammenligne.',
    },
    {
      tittel: 'Ingen swipe, ingen jag',
      beskrivelse: 'Du trenger ikke jakte. ToSom gjør jobben for deg og gir deg én match innen 24 timer.',
    },
    {
      tittel: 'Bygg virkelig nærhet',
      beskrivelse: 'Gjennom en guidet 30-dagers reise lærer dere hverandre å kjenne — uten overflatisk fokus.',
    },
  ];

  return (
    <>
      <div className="min-h-screen relative" style={{ 
        background: 'linear-gradient(180deg, #1A1F26 0%, #0E1218 100%)'
      }}>
        <Header currentPath="/kvifor" />

        <main className="relative z-10 max-w-4xl mx-auto px-6 py-32">
          <div className="text-center mb-20">
            <span
              className="text-xs uppercase tracking-[0.3em] font-semibold mb-4 block"
              style={{ color: '#D4AF37' }}
            >
              Kvifor ToSom
            </span>
            <h1
              className="text-3xl md:text-[48px] font-semibold mb-6"
              style={{ color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: '1.2' }}
            >
              Kvifor velje ToSom?
            </h1>
            <p
              className="text-base md:text-lg max-w-2xl mx-auto"
              style={{ color: 'rgba(255, 255, 255, 0.6)', lineHeight: '1.7' }}
            >
              ToSom er bygget for dem som vil ha en ekte relasjon — ikke en feed av profiler.
            </p>
          </div>

          <div className="space-y-8">
            {grunner.map((grunn, index) => (
              <GlassPanel key={index} goldBorder padding="xl">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div
                    className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-semibold"
                    style={{
                      background: 'rgba(212, 175, 55, 0.12)',
                      border: '1.5px solid rgba(212, 175, 55, 0.25)',
                      color: '#D4AF37',
                    }}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2" style={{ color: '#FFFFFF' }}>
                      {grunn.tittel}
                    </h3>
                    <p style={{ color: 'rgba(255, 255, 255, 0.55)', lineHeight: '1.7' }}>
                      {grunn.beskrivelse}
                    </p>
                  </div>
                </div>
              </GlassPanel>
            ))}
          </div>

          <div className="text-center mt-16">
            <a
              href="/onboarding"
              className="inline-flex items-center px-10 py-4 rounded-xl text-base font-medium transition-all duration-300"
              style={{
                background: '#D4AF37',
                color: '#0B0E11',
              }}
            >
              Start no
            </a>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}