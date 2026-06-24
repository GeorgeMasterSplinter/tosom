'use client';

import Link from 'next/link';
import { Footer } from '@/components/ui5/Footer';

/* ========================
   PAGE COMPONENT
   ======================== */

export default function SlikPage() {
  return (
    <>
      <style>{`
        @media (max-width: 640px) {
          .slik-wave-primary { width: 180% !important; opacity: 0.035 !important; }
          .slik-wave-secondary { width: 200% !important; opacity: 0.02 !important; }
          .slik-spotlight { width: 980px !important; height: 700px !important; }
          .slik-title { font-size: 42px !important; }
          .slik-body { font-size: 17px !important; }
          .slik-card { width: 100% !important; }
        }
      `}</style>

      <div className="min-h-screen relative" style={{ background: 'linear-gradient(180deg, #0A0F1A 0%, #0F1923 50%, #0A0F1A 100%)' }}>
        {/* Ambient glød */}
        <div
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            background: `
              radial-gradient(ellipse 80% 60% at 50% 30%, rgba(80,120,255,0.04), transparent 70%),
              linear-gradient(180deg, #0A0F1A 0%, #0F1923 50%, #0A0F1A 100%)
            `,
          }}
        />

        {/* ════════════════════════════════════
            A) HERO-SEKSJON
            ════════════════════════════════════ */}
        <section className="relative overflow-hidden pt-[180px] pb-[160px] text-center">
          {/* Spotlight */}
          <div
            className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[1400px] h-[900px] pointer-events-none z-0 slik-spotlight"
            style={{
              background: 'radial-gradient(circle at center, rgba(255,255,255,0.05), transparent 70%)',
            }}
          />
          {/* Vertikal lysgradient */}
          <div
            className="absolute top-[35%] left-1/2 -translate-x-1/2 w-[700px] h-[350px] pointer-events-none z-0"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.015) 0%, transparent 100%)',
            }}
          />
          {/* Bølge 1 */}
          <div className="absolute bottom-[-30px] left-0 w-[150%] opacity-[0.05] pointer-events-none z-[1] slik-wave-primary">
            <svg viewBox="0 0 2000 200" preserveAspectRatio="none" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="slikWave1" x1="0" y1="0" x2="2000" y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#1A2A3A" />
                  <stop offset="100%" stopColor="#0A0F1A" />
                </linearGradient>
              </defs>
              <path d="M0,100 C250,65 500,135 750,100 C1000,65 1250,130 1500,100 C1750,70 1875,115 2000,100 L2000,200 L0,200 Z" fill="url(#slikWave1)" />
            </svg>
          </div>
          {/* Bølge 2 */}
          <div className="absolute bottom-[-15px] left-0 w-[170%] opacity-[0.03] pointer-events-none z-[1] slik-wave-secondary">
            <svg viewBox="0 0 2200 200" preserveAspectRatio="none" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="slikWave2" x1="0" y1="0" x2="2200" y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#D4AF37" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
              <path d="M0,100 C275,72 550,128 825,100 C1100,72 1375,122 1650,100 C1925,78 2062,118 2200,100 L2200,200 L0,200 Z" fill="url(#slikWave2)" />
            </svg>
          </div>

          <div className="mx-auto max-w-[820px] px-6 relative z-10">
            <h1
              className="text-5xl md:text-6xl font-semibold tracking-[-0.02em] leading-[1.1] mb-[32px] slik-title"
              style={{ color: 'rgba(255,255,255,0.95)', textShadow: '0 0 36px rgba(255,255,255,0.04)' }}
            >
              Slik fungerer ToSom
            </h1>
            <p
              className="text-xl md:text-2xl leading-[1.65] max-w-[720px] mx-auto slik-body"
              style={{ color: 'rgba(255,255,255,0.90)', letterSpacing: '0.2px' }}
            >
              En rolig, guidet reise mellom to mennesker — designet for trygghet, dybde og ekte forbindelse.
            </p>
          </div>
        </section>

        {/* ════════════════════════════════════
            B) STORY-SEKSJON (1 KOLONNE)
            ════════════════════════════════════ */}
        <section className="relative overflow-hidden">
          {/* Bølge 1 */}
          <div className="absolute bottom-[-20px] left-0 w-[160%] opacity-[0.05] pointer-events-none z-0 slik-wave-primary">
            <svg viewBox="0 0 2000 200" preserveAspectRatio="none" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,100 C250,60 500,140 750,100 C1000,60 1250,130 1500,100 C1750,70 1875,110 2000,100 L2000,200 L0,200 Z" fill="#1A2A3A" />
            </svg>
          </div>
          {/* Bølge 2 */}
          <div className="absolute bottom-[-10px] left-0 w-[180%] opacity-[0.03] pointer-events-none z-0 slik-wave-secondary">
            <svg viewBox="0 0 2200 200" preserveAspectRatio="none" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="slikStoryWave2" x1="0" y1="0" x2="2200" y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#D4AF37" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
              <path d="M0,100 C275,70 550,135 825,100 C1100,65 1375,125 1650,100 C1925,75 2062,112 2200,100 L2200,200 L0,200 Z" fill="url(#slikStoryWave2)" />
            </svg>
          </div>

          <div className="mx-auto max-w-[900px] px-6 py-[120px] relative z-10">
            <div
              className="text-xl md:text-2xl leading-[1.75] text-center max-w-[900px] mx-auto"
              style={{ color: 'rgba(255,255,255,0.90)', letterSpacing: '0.2px', lineHeight: '1.75' }}
            >
              <p className="mb-8">
                ToSom er ikke en vanlig datingapp. Det er en rolig, guidet reise mellom to mennesker — bygget for trygghet, dybde og ekte forbindelse.
              </p>
              <p className="mb-8">
                I stedet for støy, sveiping og overfladiske valg, får du et rom hvor du kan senke skuldrene, være deg selv og møte én person som faktisk passer deg. Ikke mange. Bare én. Men én som betyr noe.
              </p>
              <p className="mb-8">
                Vi har bygget ToSom rundt én idé: Ekte relasjoner oppstår når to mennesker får tid, trygghet og struktur til å møtes på ordentlig.
              </p>
              <p>
                Derfor er ToSom designet som en reise — ikke en markedsplass. Du får én match om gangen. Du får et rom uten distraksjoner. Og dere får en guidet prosess som hjelper dere å bli kjent på en måte som føles naturlig, trygg og ekte.
              </p>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════
            C) 5-STEG-SEKSJON (2 KOLONNER)
            ════════════════════════════════════ */}
        <section className="relative overflow-hidden">
          {/* Spotlight */}
          <div
            className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[1400px] h-[900px] pointer-events-none z-0 slik-spotlight"
            style={{
              background: 'radial-gradient(circle at center, rgba(255,255,255,0.04), transparent 70%)',
            }}
          />
          {/* Bølge 1 */}
          <div className="absolute bottom-[-25px] left-0 w-[155%] opacity-[0.05] pointer-events-none z-[1] slik-wave-primary">
            <svg viewBox="0 0 2000 200" preserveAspectRatio="none" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,100 C250,60 500,140 750,100 C1000,60 1250,130 1500,100 C1750,70 1875,110 2000,100 L2000,200 L0,200 Z" fill="#1A2A3A" />
            </svg>
          </div>
          {/* Bølge 2 */}
          <div className="absolute bottom-[-12px] left-0 w-[175%] opacity-[0.03] pointer-events-none z-[1] slik-wave-secondary">
            <svg viewBox="0 0 2200 200" preserveAspectRatio="none" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="slikStepsWave2" x1="0" y1="0" x2="2200" y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#D4AF37" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
              <path d="M0,100 C275,70 550,135 825,100 C1100,65 1375,125 1650,100 C1925,75 2062,112 2200,100 L2200,200 L0,200 Z" fill="url(#slikStepsWave2)" />
            </svg>
          </div>

          <div className="mx-auto max-w-[1100px] px-6 py-[140px] relative z-10">
            <h2
              className="text-center text-4xl font-semibold tracking-[-0.02em] leading-[1.1] mb-[56px]"
              style={{ color: 'rgba(255,255,255,0.95)' }}
            >
              Fem steg til ekte forbindelse
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[36px] md:gap-[52px]">
              {/* Steg 1 */}
              <div
                className="rounded-3xl p-10 transition-all duration-300 ease-out hover:border-[rgba(212,175,55,0.15)] hover:gold-glow-sm slik-card"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg mb-6"
                  style={{
                    background: 'rgba(212,175,55,0.1)',
                    border: '1px solid rgba(212,175,55,0.2)',
                    color: '#D4AF37',
                  }}
                >
                  1
                </div>
                <h3 className="text-2xl font-semibold text-white/95 mb-4" style={{ letterSpacing: '-0.01em' }}>
                  Du lager en privat og trygg profil
                </h3>
                <p className="text-lg text-white/90 leading-[1.7]" style={{ letterSpacing: '0.2px' }}>
                  Du svarer på et dyp sett med spørsmål om livet ditt, verdiv dine, personligheten din og hva du søker. Ingen bilder — bare du.
                </p>
              </div>

              {/* Steg 2 */}
              <div
                className="rounded-3xl p-10 transition-all duration-300 ease-out hover:border-[rgba(212,175,55,0.15)] hover:gold-glow-sm slik-card"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg mb-6"
                  style={{
                    background: 'rgba(212,175,55,0.1)',
                    border: '1px solid rgba(212,175,55,0.2)',
                    color: '#D4AF37',
                  }}
                >
                  2
                </div>
                <h3 className="text-2xl font-semibold text-white/95 mb-4" style={{ letterSpacing: '-0.01em' }}>
                  Du får én match basert på kompatibilitet
                </h3>
                <p className="text-lg text-white/90 leading-[1.7]" style={{ letterSpacing: '0.2px' }}>
                  ToSoms match-motor kjører én gang i døgnet og finner den beste kompatibiliteten for deg — ikke de mange verste.
                </p>
              </div>

              {/* Steg 3 */}
              <div
                className="rounded-3xl p-10 transition-all duration-300 ease-out hover:border-[rgba(212,175,55,0.15)] hover:gold-glow-sm slik-card"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg mb-6"
                  style={{
                    background: 'rgba(212,175,55,0.1)',
                    border: '1px solid rgba(212,175,55,0.2)',
                    color: '#D4AF37',
                  }}
                >
                  3
                </div>
                <h3 className="text-2xl font-semibold text-white/95 mb-4" style={{ letterSpacing: '-0.01em' }}>
                  Dere aksepterer hverandre og låses sammen
                </h3>
                <p className="text-lg text-white/90 leading-[1.7]" style={{ letterSpacing: '0.2px' }}>
                  Når begge aksepterer matchet, blir dere låst sammen i 30 dager. Ingen nye matcher i denne perioden.
                </p>
              </div>

              {/* Steg 4 */}
              <div
                className="rounded-3xl p-10 transition-all duration-300 ease-out hover:border-[rgba(212,175,55,0.15)] hover:gold-glow-sm slik-card"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg mb-6"
                  style={{
                    background: 'rgba(212,175,55,0.1)',
                    border: '1px solid rgba(212,175,55,0.2)',
                    color: '#D4AF37',
                  }}
                >
                  4
                </div>
                <h3 className="text-2xl font-semibold text-white/95 mb-4" style={{ letterSpacing: '-0.01em' }}>
                  Dere går gjennom en guidet 30-dagers reise
                </h3>
                <p className="text-lg text-white/90 leading-[1.7]" style={{ letterSpacing: '0.2px' }}>
                  Hver dag får paret refleksjonsspørsmål, samtaletema, små oppgaver og resonansmåling.
                </p>
              </div>

              {/* Steg 5 (span full width i sentrum) */}
              <div
                className="md:col-span-2 rounded-3xl p-10 transition-all duration-300 ease-out hover:border-[rgba(212,175,55,0.15)] hover:gold-glow-sm slik-card"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg mb-6 mx-auto"
                  style={{
                    background: 'rgba(212,175,55,0.1)',
                    border: '1px solid rgba(212,175,55,0.2)',
                    color: '#D4AF37',
                  }}
                >
                  5
                </div>
                <h3 className="text-2xl font-semibold text-white/95 mb-4 text-center" style={{ letterSpacing: '-0.01em' }}>
                  Etter 30 dager velger dere veien videre
                </h3>
                <p className="text-lg text-white/90 leading-[1.7] text-center max-w-[720px] mx-auto" style={{ letterSpacing: '0.2px' }}>
                  Etter reisa kan paret velge å fortsette, avslutte, eller starte en ny reise med en ny match. Det er ditt valg — vi skaper aldri press.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════
            D) CTA-SEKSJON
            ════════════════════════════════════ */}
        <section className="relative overflow-hidden text-center" style={{ paddingTop: '120px', paddingBottom: '140px' }}>
          {/* Spotlight */}
          <div
            className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[1200px] h-[800px] pointer-events-none z-0 slik-spotlight"
            style={{
              background: 'radial-gradient(circle at center, rgba(255,255,255,0.05), transparent 70%)',
            }}
          />
          {/* Vertikal lysgradient */}
          <div
            className="absolute top-[25%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none z-0"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.015) 0%, transparent 100%)',
            }}
          />
          {/* Bølge 1 */}
          <div className="absolute bottom-[-20px] left-0 w-[160%] opacity-[0.05] pointer-events-none z-[1] slik-wave-primary">
            <svg viewBox="0 0 2000 200" preserveAspectRatio="none" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,100 C250,60 500,140 750,100 C1000,60 1250,130 1500,100 C1750,70 1875,110 2000,100 L2000,200 L0,200 Z" fill="#1A2A3A" />
            </svg>
          </div>
          {/* Bølge 2 */}
          <div className="absolute bottom-[-10px] left-0 w-[180%] opacity-[0.03] pointer-events-none z-[1] slik-wave-secondary">
            <svg viewBox="0 0 2200 200" preserveAspectRatio="none" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="slikCtaWave2" x1="0" y1="0" x2="2200" y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#D4AF37" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
              <path d="M0,100 C275,70 550,135 825,100 C1100,65 1375,125 1650,100 C1925,75 2062,112 2200,100 L2200,200 L0,200 Z" fill="url(#slikCtaWave2)" />
            </svg>
          </div>

          <div className="mx-auto max-w-[900px] px-6 relative z-10">
            <h2
              className="text-5xl md:text-6xl font-semibold tracking-[-0.02em] leading-[1.1] mb-[32px]"
              style={{ color: 'rgba(255,255,255,0.95)' }}
            >
              Klar til å starte?
            </h2>
            <p
              className="text-xl md:text-2xl leading-[1.7] max-w-[720px] mx-auto mb-[52px]"
              style={{ color: 'rgba(255,255,255,0.90)', letterSpacing: '0.2px' }}
            >
              Lag profilen din i ditt eget tempo og møt noen som faktisk passer deg — på ordentlig.
            </p>
            <div className="flex flex-col sm:flex-row gap-7 justify-center max-w-[680px] mx-auto">
              <Link
                href="/onboarding/start"
                className="inline-flex items-center justify-center w-full sm:w-[340px] h-[72px] rounded-2xl font-semibold transition-all duration-300 ease-out text-[1.25rem]"
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
              <Link
                href="/login"
                className="inline-flex items-center justify-center w-full sm:w-[340px] h-[72px] rounded-2xl font-medium transition-all duration-300 ease-out text-[1.25rem]"
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

        <Footer />
      </div>
    </>
  );
}