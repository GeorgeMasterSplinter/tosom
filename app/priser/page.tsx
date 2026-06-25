'use client';

import Link from 'next/link';
import { Footer } from '@/components/ui5/Footer';
import { GlobalCTA } from '@/components/ui5/GlobalCTA';

/* ========================
   PAGE COMPONENT
   ======================== */

export default function PriserPage() {
  return (
    <>
      <style>{`
        @media (max-width: 640px) {
          .priser-wave-primary { width: 180% !important; opacity: 0.035 !important; }
          .priser-wave-secondary { width: 200% !important; opacity: 0.02 !important; }
          .priser-spotlight { width: 980px !important; height: 700px !important; }
          .priser-title { font-size: 42px !important; }
          .priser-body { font-size: 17px !important; }
          .priser-card { width: 100% !important; }
        }
      `}</style>

      <main className="relative min-h-screen overflow-hidden" style={{ background: 'linear-gradient(180deg, #0A0F1A 0%, #0F1923 50%, #0A0F1A 100%)' }}>
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
            A) HERO
            ════════════════════════════════════ */}
        <section className="relative pt-[180px] pb-[160px] text-center overflow-hidden">
          {/* Spotlight */}
          <div
            className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[1400px] h-[900px] pointer-events-none z-0 priser-spotlight"
            style={{ background: 'radial-gradient(circle at center, rgba(255,255,255,0.05), transparent 70%)' }}
          />
          {/* Vertikal lysgradient */}
          <div
            className="absolute top-[35%] left-1/2 -translate-x-1/2 w-[700px] h-[350px] pointer-events-none z-0"
            style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.015) 0%, transparent 100%)' }}
          />
          {/* Bølge 1 */}
          <div className="absolute bottom-[-30px] left-0 w-[150%] opacity-[0.05] pointer-events-none z-[1] priser-wave-primary">
            <svg viewBox="0 0 2000 200" preserveAspectRatio="none" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs><linearGradient id="priserWave1" x1="0" y1="0" x2="2000" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#1A2A3A" /><stop offset="100%" stopColor="#0A0F1A" /></linearGradient></defs>
              <path d="M0,100 C250,65 500,135 750,100 C1000,65 1250,130 1500,100 C1750,70 1875,115 2000,100 L2000,200 L0,200 Z" fill="url(#priserWave1)" />
            </svg>
          </div>
          {/* Bølge 2 */}
          <div className="absolute bottom-[-15px] left-0 w-[170%] opacity-[0.03] pointer-events-none z-[1] priser-wave-secondary">
            <svg viewBox="0 0 2200 200" preserveAspectRatio="none" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs><linearGradient id="priserWave2" x1="0" y1="0" x2="2200" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#D4AF37" /><stop offset="100%" stopColor="transparent" /></linearGradient></defs>
              <path d="M0,100 C275,72 550,128 825,100 C1100,72 1375,122 1650,100 C1925,78 2062,118 2200,100 L2200,200 L0,200 Z" fill="url(#priserWave2)" />
            </svg>
          </div>

          <div className="mx-auto max-w-[820px] px-6 relative z-10">
            <h1
              className="text-5xl md:text-6xl font-semibold tracking-[-0.02em] leading-[1.1] priser-title"
              style={{ color: 'rgba(255,255,255,0.95)', textShadow: '0 0 36px rgba(255,255,255,0.04)' }}
            >
              Priser
            </h1>
            <p
              className="mt-8 text-xl md:text-2xl priser-body"
              style={{ color: 'rgba(255,255,255,0.90)', lineHeight: '1.65', maxWidth: '720px', margin: '0 auto', letterSpacing: '0.2px' }}
            >
              Én enkel pris. Ingen abonnement. Ingen skjulte kostnader. Bare ro, trygghet og en gjennomtenkt prosess.
            </p>
          </div>
        </section>

        {/* ════════════════════════════════════
            B) STORY – "Hvorfor én pris?"
            ════════════════════════════════════ */}
        <section className="relative max-w-[900px] mx-auto px-6 py-[120px] overflow-hidden">
          {/* Bølge 1 */}
          <div className="absolute bottom-[-20px] left-0 w-[160%] opacity-[0.05] pointer-events-none z-0 priser-wave-primary">
            <svg viewBox="0 0 2000 200" preserveAspectRatio="none" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0,100 C250,60 500,140 750,100 C1000,60 1250,130 1500,100 C1750,70 1875,110 2000,100 L2000,200 L0,200 Z" fill="#1A2A3A" /></svg>
          </div>
          {/* Bølge 2 */}
          <div className="absolute bottom-[-10px] left-0 w-[180%] opacity-[0.03] pointer-events-none z-0 priser-wave-secondary">
            <svg viewBox="0 0 2200 200" preserveAspectRatio="none" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="priserStoryWave2" x1="0" y1="0" x2="2200" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#D4AF37" /><stop offset="100%" stopColor="transparent" /></linearGradient></defs><path d="M0,100 C275,70 550,135 825,100 C1100,65 1375,125 1650,100 C1925,75 2062,112 2200,100 L2200,200 L0,200 Z" fill="url(#priserStoryWave2)" /></svg>
          </div>

          <div className="relative z-10">
            <h2
              className="text-3xl md:text-4xl font-semibold text-white/95 mb-10"
              style={{ letterSpacing: '-0.02em' }}
            >
              Hvorfor én pris?
            </h2>
            <div
              className="text-xl md:text-2xl text-center"
              style={{ color: 'rgba(255,255,255,0.90)', lineHeight: '1.75', letterSpacing: '0.2px', maxWidth: '900px', margin: '0 auto' }}
            >
              <p className="mb-8">
                Vi tror at relasjoner trenger ro — ikke press, ikke stress, ikke løpende betalinger. Derfor har ToSom ingen abonnement, ingen nivåer og ingen skjulte funksjoner.
              </p>
              <p className="mb-8">
                Du får alt fra første dag. Du betaler kun når du er klar til å starte reisen. Ingen binding. Ingen overraskelser. Ingen "premium-pakker".
              </p>
              <p>
                Bare én pris, én reise, én mulighet til å møte noen som faktisk passer deg.
              </p>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════
            C) HVA DU FÅR
            ════════════════════════════════════ */}
        <section className="relative max-w-[1100px] mx-auto px-6 py-[140px] overflow-hidden">
          {/* Spotlight */}
          <div
            className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[1400px] h-[900px] pointer-events-none z-0 priser-spotlight"
            style={{ background: 'radial-gradient(circle at center, rgba(255,255,255,0.04), transparent 70%)' }}
          />
          {/* Bølge 1 */}
          <div className="absolute bottom-[-25px] left-0 w-[155%] opacity-[0.05] pointer-events-none z-[1] priser-wave-primary">
            <svg viewBox="0 0 2000 200" preserveAspectRatio="none" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0,100 C250,60 500,140 750,100 C1000,60 1250,130 1500,100 C1750,70 1875,110 2000,100 L2000,200 L0,200 Z" fill="#1A2A3A" /></svg>
          </div>
          {/* Bølge 2 */}
          <div className="absolute bottom-[-12px] left-0 w-[175%] opacity-[0.03] pointer-events-none z-[1] priser-wave-secondary">
            <svg viewBox="0 0 2200 200" preserveAspectRatio="none" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="priserFasWave2" x1="0" y1="0" x2="2200" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#D4AF37" /><stop offset="100%" stopColor="transparent" /></linearGradient></defs><path d="M0,100 C275,70 550,135 825,100 C1100,65 1375,125 1650,100 C1925,75 2062,112 2200,100 L2200,200 L0,200 Z" fill="url(#priserFasWave2)" /></svg>
          </div>

          <div className="relative z-10">
            <h2
              className="text-3xl md:text-4xl font-semibold text-white/95 text-center mb-16"
              style={{ letterSpacing: '-0.02em' }}
            >
              Hva du får
            </h2>
            <p
              className="text-xl md:text-2xl text-center mb-12"
              style={{ color: 'rgba(255,255,255,0.90)', lineHeight: '1.7', maxWidth: '720px', margin: '0 auto 48px', letterSpacing: '0.2px' }}
            >
              ToSom gir deg en komplett, trygg og forskningsbasert prosess for å møte én person — ikke mange — men én som faktisk passer deg.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
              {/* Kort 1 */}
              <div
                className="rounded-3xl p-8 transition-all duration-300 ease-out hover:border-[rgba(212,175,55,0.15)] priser-card"
                style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}
              >
                <h3 className="text-lg md:text-xl font-semibold text-white/95 mb-3" style={{ letterSpacing: '-0.01em' }}>
                  Veiledet, forskningsbasert profil
                </h3>
                <p className="text-base md:text-lg text-white/85 leading-[1.7]" style={{ letterSpacing: '0.2px' }}>
                  Du svarer på et gjennomtenket sett med spørsmål om livet ditt, verdiene dine, personligheten din og hva du søker i et forhold. Profilene din blir brukt av ToSoms match-motor for å finne den beste kompatibiliteten.
                </p>
              </div>

              {/* Kort 2 */}
              <div
                className="rounded-3xl p-8 transition-all duration-300 ease-out hover:border-[rgba(212,175,55,0.15)] priser-card"
                style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}
              >
                <h3 className="text-lg md:text-xl font-semibold text-white/95 mb-3" style={{ letterSpacing: '-0.01em' }}>
                  Match innen 24 timer
                </h3>
                <p className="text-base md:text-lg text-white/85 leading-[1.7]" style={{ letterSpacing: '0.2px' }}>
                  ToSoms motor kjører én gang i døgnet og finner den personen som passer deg best — basert på kompatibilitet, ikke utseende. Du får kun én match om gangen.
                </p>
              </div>

              {/* Kort 3 */}
              <div
                className="rounded-3xl p-8 transition-all duration-300 ease-out hover:border-[rgba(212,175,55,0.15)] priser-card"
                style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}
              >
                <h3 className="text-lg md:text-xl font-semibold text-white/95 mb-3" style={{ letterSpacing: '-0.01em' }}>
                  Privat rom mellom dere to
                </h3>
                <p className="text-base md:text-lg text-white/85 leading-[1.7]" style={{ letterSpacing: '0.2px' }}>
                  Når dere matcher, får dere et helt privat rom med guidede samtaler, refleksjoner, oppgaver og resonansmåling. Et rom designet for trygghet og dypde — uten distraksjoner.
                </p>
              </div>

              {/* Kort 4 */}
              <div
                className="rounded-3xl p-8 transition-all duration-300 ease-out hover:border-[rgba(212,175,55,0.15)] priser-card"
                style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}
              >
                <h3 className="text-lg md:text-xl font-semibold text-white/95 mb-3" style={{ letterSpacing: '-0.01em' }}>
                  30 dagers guidet reise
                </h3>
                <p className="text-base md:text-lg text-white/85 leading-[1.7]" style={{ letterSpacing: '0.2px' }}>
                  Dere går gjennom en strukturert 30-dagers reise med daglige refleksjonsspørsmål, samtaletema, små oppgaver og resonansmåling. Dette er kjernen i ToSom — en prosess som faktisk hjelper dere å bli kjent.
                </p>
              </div>

              {/* Kort 5 */}
              <div
                className="rounded-3xl p-8 transition-all duration-300 ease-out hover:border-[rgba(212,175,55,0.15)] priser-card"
                style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}
              >
                <h3 className="text-lg md:text-xl font-semibold text-white/95 mb-3" style={{ letterSpacing: '-0.01em' }}>
                  Ingen offentlige profiler
                </h3>
                <p className="text-base md:text-lg text-white/85 leading-[1.7]" style={{ letterSpacing: '0.2px' }}>
                  Din profil er aldri offentlig. Ingen andre brukere kan se den. Kun ToSoms match-motor og den personen du matcher med får tilgang.
                </p>
              </div>

              {/* Kort 6 */}
              <div
                className="rounded-3xl p-8 transition-all duration-300 ease-out hover:border-[rgba(212,175,55,0.15)] priser-card"
                style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}
              >
                <h3 className="text-lg md:text-xl font-semibold text-white/95 mb-3" style={{ letterSpacing: '-0.01em' }}>
                  Ingen sveiping, ingen støy
                </h3>
                <p className="text-base md:text-lg text-white/85 leading-[1.7]" style={{ letterSpacing: '0.2px' }}>
                  Ingen feed. Ingen swiping. Ingen uendelige valg. Bare én match, én reise, og rommet dere trenger til å bli kjent på ordentlig.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════
            D) PRIS & BETALING
            ════════════════════════════════════ */}
        <section className="relative max-w-[700px] mx-auto px-6 py-[120px] text-center overflow-hidden">
          {/* Bølge 1 */}
          <div className="absolute bottom-[-20px] left-0 w-[160%] opacity-[0.05] pointer-events-none z-0 priser-wave-primary">
            <svg viewBox="0 0 2000 200" preserveAspectRatio="none" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0,100 C250,60 500,140 750,100 C1000,60 1250,130 1500,100 C1750,70 1875,110 2000,100 L2000,200 L0,200 Z" fill="#1A2A3A" /></svg>
          </div>
          {/* Bølge 2 */}
          <div className="absolute bottom-[-10px] left-0 w-[180%] opacity-[0.03] pointer-events-none z-0 priser-wave-secondary">
            <svg viewBox="0 0 2200 200" preserveAspectRatio="none" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="priserPrisWave2" x1="0" y1="0" x2="2200" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#D4AF37" /><stop offset="100%" stopColor="transparent" /></linearGradient></defs><path d="M0,100 C275,70 550,135 825,100 C1100,65 1375,125 1650,100 C1925,75 2062,112 2200,100 L2200,200 L0,200 Z" fill="url(#priserPrisWave2)" /></svg>
          </div>

          <div className="relative z-10">
            <h2
              className="text-3xl md:text-4xl font-semibold text-white/95 mb-8"
              style={{ letterSpacing: '-0.02em' }}
            >
              Én pris. Alt inkludert.
            </h2>
            <p
              className="text-xl md:text-2xl text-center mb-8"
              style={{ color: 'rgba(255,255,255,0.90)', lineHeight: '1.7', maxWidth: '640px', margin: '0 auto 48px', letterSpacing: '0.2px' }}
            >
              Du betaler kun én gang når du er klar. Ingen abonnement. Ingen skjulte kostnader. Ingen ekstra funksjoner bak betaling.
            </p>

            {/* Placeholder for payment */}
            <div
              className="inline-flex flex-col items-center justify-center rounded-3xl px-12 py-10 max-w-[400px]"
              style={{
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 10px 36px rgba(0,0,0,0.22)',
              }}
            >
              <div
                className="text-4xl md:text-5xl font-semibold mb-2"
                style={{ color: 'rgba(255,255,255,0.95)' }}
              >
                349 kr
              </div>
              <p
                className="text-lg md:text-xl mb-6"
                style={{ color: 'rgba(255,255,255,0.85)' }}
              >
                ToSom — full tilgang
              </p>
              <div
                className="w-full py-3 px-6 rounded-xl text-center text-sm font-medium"
                style={{
                  background: 'rgba(212,175,55,0.15)',
                  border: '1px solid rgba(212,175,55,0.25)',
                  color: 'rgba(255,255,255,0.7)',
                }}
              >
                Betalingsløsning er under utvikling.
                <br />
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  ToSom er i begrenset testfase.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════
            E) CTA (GlobalCTA)
            ════════════════════════════════════ */}
        <GlobalCTA />

        <Footer />
      </main>
    </>
  );
}