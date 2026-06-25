'use client';

import Link from 'next/link';
import { Footer } from '@/components/ui5/Footer';
import { GlobalCTA } from '@/components/ui5/GlobalCTA';

/* ========================
   PAGE COMPONENT
   ======================== */

export default function ReisenPage() {
  return (
    <>
      <style>{`
        @media (max-width: 640px) {
          .reisen-wave-primary { width: 180% !important; opacity: 0.035 !important; }
          .reisen-wave-secondary { width: 200% !important; opacity: 0.02 !important; }
          .reisen-spotlight { width: 980px !important; height: 700px !important; }
          .reisen-title { font-size: 42px !important; }
          .reisen-body { font-size: 17px !important; }
          .reisen-card { width: 100% !important; }
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
            className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[1400px] h-[900px] pointer-events-none z-0 reisen-spotlight"
            style={{ background: 'radial-gradient(circle at center, rgba(255,255,255,0.05), transparent 70%)' }}
          />
          {/* Vertikal lysgradient */}
          <div
            className="absolute top-[35%] left-1/2 -translate-x-1/2 w-[700px] h-[350px] pointer-events-none z-0"
            style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.015) 0%, transparent 100%)' }}
          />
          {/* Bølge 1 */}
          <div className="absolute bottom-[-30px] left-0 w-[150%] opacity-[0.05] pointer-events-none z-[1] reisen-wave-primary">
            <svg viewBox="0 0 2000 200" preserveAspectRatio="none" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs><linearGradient id="reisenWave1" x1="0" y1="0" x2="2000" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#1A2A3A" /><stop offset="100%" stopColor="#0A0F1A" /></linearGradient></defs>
              <path d="M0,100 C250,65 500,135 750,100 C1000,65 1250,130 1500,100 C1750,70 1875,115 2000,100 L2000,200 L0,200 Z" fill="url(#reisenWave1)" />
            </svg>
          </div>
          {/* Bølge 2 */}
          <div className="absolute bottom-[-15px] left-0 w-[170%] opacity-[0.03] pointer-events-none z-[1] reisen-wave-secondary">
            <svg viewBox="0 0 2200 200" preserveAspectRatio="none" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs><linearGradient id="reisenWave2" x1="0" y1="0" x2="2200" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#D4AF37" /><stop offset="100%" stopColor="transparent" /></linearGradient></defs>
              <path d="M0,100 C275,72 550,128 825,100 C1100,72 1375,122 1650,100 C1925,78 2062,118 2200,100 L2200,200 L0,200 Z" fill="url(#reisenWave2)" />
            </svg>
          </div>

          <div className="mx-auto max-w-[820px] px-6 relative z-10">
            <h1
              className="text-5xl md:text-6xl font-semibold tracking-[-0.02em] leading-[1.1] reisen-title"
              style={{ color: 'rgba(255,255,255,0.95)', textShadow: '0 0 36px rgba(255,255,255,0.04)' }}
            >
              30 dager som kan endre alt
            </h1>
            <p
              className="mt-8 text-xl md:text-2xl reisen-body"
              style={{ color: 'rgba(255,255,255,0.90)', lineHeight: '1.65', maxWidth: '720px', margin: '0 auto', letterSpacing: '0.2px' }}
            >
              Når dere matcher, starter en guidet reise — skapt for å bygge ekte forbindelse mellom to mennesker. Ingen sveiping. Ingen distraksjoner. Bare dere to, i et rom som gir trygghet, tid og struktur.
            </p>
          </div>
        </section>

        {/* ════════════════════════════════════
            B) STORY
            ════════════════════════════════════ */}
        <section className="relative max-w-[900px] mx-auto px-6 py-[120px] overflow-hidden">
          {/* Bølge 1 */}
          <div className="absolute bottom-[-20px] left-0 w-[160%] opacity-[0.05] pointer-events-none z-0 reisen-wave-primary">
            <svg viewBox="0 0 2000 200" preserveAspectRatio="none" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0,100 C250,60 500,140 750,100 C1000,60 1250,130 1500,100 C1750,70 1875,110 2000,100 L2000,200 L0,200 Z" fill="#1A2A3A" /></svg>
          </div>
          {/* Bølge 2 */}
          <div className="absolute bottom-[-10px] left-0 w-[180%] opacity-[0.03] pointer-events-none z-0 reisen-wave-secondary">
            <svg viewBox="0 0 2200 200" preserveAspectRatio="none" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="reisenStoryWave2" x1="0" y1="0" x2="2200" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#D4AF37" /><stop offset="100%" stopColor="transparent" /></linearGradient></defs><path d="M0,100 C275,70 550,135 825,100 C1100,65 1375,125 1650,100 C1925,75 2062,112 2200,100 L2200,200 L0,200 Z" fill="url(#reisenStoryWave2)" /></svg>
          </div>

          <div
            className="relative z-10 text-xl md:text-2xl text-center"
            style={{ color: 'rgba(255,255,255,0.90)', lineHeight: '1.75', letterSpacing: '0.2px', maxWidth: '900px', margin: '0 auto' }}
          >
            <p className="mb-8">
              De fleste relasjoner stopper før de får sjansen til å bli noe ekte. Tempoet er for høyt. Distraksjonene er for mange. Folk hopper videre før de rekker å forstå hverandre.
            </p>
            <p className="mb-8" style={{ color: 'rgba(212,175,55,0.9)', fontSize: '1.15em' }}>
              ToSom gjør det motsatte.
            </p>
            <p className="mb-8">
              Vi gir dere: tid, fokus, trygghet, struktur – og en reise som bygger nærhet steg for steg.
            </p>
            <p>
              Dette er ikke en test. Det er en opplevelse — designet for å hjelpe to mennesker å møtes på en måte som føles naturlig, varm og ekte.
            </p>
          </div>
        </section>

        {/* ════════════════════════════════════
            C) TRE FASER
            ════════════════════════════════════ */}
        <section className="relative max-w-[1100px] mx-auto px-6 py-[140px] overflow-hidden">
          {/* Spotlight */}
          <div
            className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[1400px] h-[900px] pointer-events-none z-0 reisen-spotlight"
            style={{ background: 'radial-gradient(circle at center, rgba(255,255,255,0.04), transparent 70%)' }}
          />
          {/* Bølge 1 */}
          <div className="absolute bottom-[-25px] left-0 w-[155%] opacity-[0.05] pointer-events-none z-[1] reisen-wave-primary">
            <svg viewBox="0 0 2000 200" preserveAspectRatio="none" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0,100 C250,60 500,140 750,100 C1000,60 1250,130 1500,100 C1750,70 1875,110 2000,100 L2000,200 L0,200 Z" fill="#1A2A3A" /></svg>
          </div>
          {/* Bølge 2 */}
          <div className="absolute bottom-[-12px] left-0 w-[175%] opacity-[0.03] pointer-events-none z-[1] reisen-wave-secondary">
            <svg viewBox="0 0 2200 200" preserveAspectRatio="none" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="reisenFaserWave2" x1="0" y1="0" x2="2200" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#D4AF37" /><stop offset="100%" stopColor="transparent" /></linearGradient></defs><path d="M0,100 C275,70 550,135 825,100 C1100,65 1375,125 1650,100 C1925,75 2062,112 2200,100 L2200,200 L0,200 Z" fill="url(#reisenFaserWave2)" /></svg>
          </div>

          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-semibold text-white/95 text-center mb-16" style={{ letterSpacing: '-0.02em' }}>
              Reisen består av tre faser
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
              {/* Fase 1 */}
              <div
                className="rounded-3xl p-10 transition-all duration-300 ease-out hover:border-[rgba(212,175,55,0.15)] reisen-card"
                style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg mb-6"
                  style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', color: '#D4AF37' }}
                >
                  1
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-white/95 mb-4" style={{ letterSpacing: '-0.01em' }}>
                  Fase 1 — Uten bilder (dag 1–14)
                </h3>
                <p className="text-lg text-white/90 leading-[1.7]" style={{ letterSpacing: '0.2px' }}>
                  De første dagene er uten bilder. Grunnen er enkel: ekte forbindelse bygges gjennom ord, tanker og sårbarhet — ikke gjennom utseende. Når dere ikke ser hverandre, tvinger hjernen deres til å lytte dypere. Dere får rom til å føle, forstå og bli sett for den dere er.
                </p>
              </div>

              {/* Fase 2 */}
              <div
                className="rounded-3xl p-10 transition-all duration-300 ease-out hover:border-[rgba(212,175,55,0.15)] reisen-card"
                style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg mb-6"
                  style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', color: '#D4AF37' }}
                >
                  2
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-white/95 mb-4" style={{ letterSpacing: '-0.01em' }}>
                  Fase 2 — Med bilder (dag 15–21)
                </h3>
                <p className="text-lg text-white/90 leading-[1.7]" style={{ letterSpacing: '0.2px' }}>
                  Etter to uker med dype samtaler, er bildene klar. Men nå er grunnen already lagt — dere kjenner hverandre inni. Bildene bekrefter det sjelenen allerede vet: "Ja, det er deg." Dette er sårbarhetens tid — der styrker og frykter deles, og intimitet vokser.
                </p>
              </div>

              {/* Fase 3 */}
              <div
                className="rounded-3xl p-10 transition-all duration-300 ease-out hover:border-[rgba(212,175,55,0.15)] reisen-card"
                style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg mb-6"
                  style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', color: '#D4AF37' }}
                >
                  3
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-white/95 mb-4" style={{ letterSpacing: '-0.01em' }}>
                  Fase 3 — Felles reise (dag 22–30)
                </h3>
                <p className="text-lg text-white/90 leading-[1.7]" style={{ letterSpacing: '0.2px' }}>
                  De siste dagene handler om fremtiden. Dere deler felles mål, utforsker hvordan dere håndterer konflikt, og drømmer sammen. Dette er der forbindelsen blir til noe varig — et fundament av tillit, forståelse og felles visjon.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════
            D) DAGLIGE ELEMENTER
            ════════════════════════════════════ */}
        <section className="relative max-w-[1100px] mx-auto px-6 py-[120px] overflow-hidden">
          {/* Bølge 1 */}
          <div className="absolute bottom-[-20px] left-0 w-[160%] opacity-[0.05] pointer-events-none z-0 reisen-wave-primary">
            <svg viewBox="0 0 2000 200" preserveAspectRatio="none" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0,100 C250,60 500,140 750,100 C1000,60 1250,130 1500,100 C1750,70 1875,110 2000,100 L2000,200 L0,200 Z" fill="#1A2A3A" /></svg>
          </div>
          {/* Bølge 2 */}
          <div className="absolute bottom-[-10px] left-0 w-[180%] opacity-[0.03] pointer-events-none z-0 reisen-wave-secondary">
            <svg viewBox="0 0 2200 200" preserveAspectRatio="none" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="reisenDagWave2" x1="0" y1="0" x2="2200" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#D4AF37" /><stop offset="100%" stopColor="transparent" /></linearGradient></defs><path d="M0,100 C275,70 550,135 825,100 C1100,65 1375,125 1650,100 C1925,75 2062,112 2200,100 L2200,200 L0,200 Z" fill="url(#reisenDagWave2)" /></svg>
          </div>

          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-semibold text-white/95 text-center mb-16" style={{ letterSpacing: '-0.02em' }}>
              Hva skjer hver dag?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
              {/* Refleksjonsspørsmål */}
              <div
                className="rounded-3xl p-10 transition-all duration-300 ease-out hover:border-[rgba(212,175,55,0.15)] reisen-card"
                style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                  style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', color: '#D4AF37' }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/><path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-white/95 mb-4" style={{ letterSpacing: '-0.01em' }}>
                  Refleksjonsspørsmål
                </h3>
                <p className="text-lg text-white/90 leading-[1.7]" style={{ letterSpacing: '0.2px' }}>
                  Hver dag får dere et gjennomtenkt spørsmål som hjelper dere å forstå hverandre dypere. Spørsmålene er designet for å utfordre tanker, vekke følelser og skape ærlige samtaler.
                </p>
              </div>

              {/* Samtaletema */}
              <div
                className="rounded-3xl p-10 transition-all duration-300 ease-out hover:border-[rgba(212,175,55,0.15)] reisen-card"
                style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                  style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', color: '#D4AF37' }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-white/95 mb-4" style={{ letterSpacing: '-0.01em' }}>
                  Samtaletema
                </h3>
                <p className="text-lg text-white/90 leading-[1.7]" style={{ letterSpacing: '0.2px' }}>
                  Hver dag får dere et tema som guider samtalen deres. Fra barndommens minner til fremtidens drømmer. Temaa er designet for å dekke det hele spekteret av menneskelig forbindelse.
                </p>
              </div>

              {/* Små oppgaver */}
              <div
                className="rounded-3xl p-10 transition-all duration-300 ease-out hover:border-[rgba(212,175,55,0.15)] reisen-card"
                style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                  style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', color: '#D4AF37' }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-white/95 mb-4" style={{ letterSpacing: '-0.01em' }}>
                  Små oppgaver
                </h3>
                <p className="text-lg text-white/90 leading-[1.7]" style={{ letterSpacing: '0.2px' }}>
                  Dere får små, men meningsfulle oppgaver sammen. Noe som skaper felles erfaringer, minner og øyeblikk av ekte nærhet. Hver oppgave er designet for å bygge tillit og forståelse.
                </p>
              </div>

              {/* Resonansmåling */}
              <div
                className="rounded-3xl p-10 transition-all duration-300 ease-out hover:border-[rgba(212,175,55,0.15)] reisen-card"
                style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                  style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', color: '#D4AF37' }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2L15 8L21 9L16.5 14L18 21L12 17.5L6 21L7.5 14L3 9L9 8L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-white/95 mb-4" style={{ letterSpacing: '-0.01em' }}>
                  Resonansmåling
                </h3>
                <p className="text-lg text-white/90 leading-[1.7]" style={{ letterSpacing: '0.2px' }}>
                  Systemet måler hvordan dere føles sammen — ikke bare hva dere sier. Resonansen viser dere hvor dyp forbindelse dere faktisk har bygd, og gir innsikt som hjelpere deres videre.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════
            E) ETTER 30 DAGER
            ════════════════════════════════════ */}
        <section className="relative max-w-[900px] mx-auto px-6 py-[120px] overflow-hidden">
          {/* Spotlight */}
          <div
            className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[1200px] h-[800px] pointer-events-none z-0 reisen-spotlight"
            style={{ background: 'radial-gradient(circle at center, rgba(255,255,255,0.04), transparent 70%)' }}
          />
          {/* Bølge 1 */}
          <div className="absolute bottom-[-15px] left-0 w-[160%] opacity-[0.05] pointer-events-none z-[1] reisen-wave-primary">
            <svg viewBox="0 0 2000 200" preserveAspectRatio="none" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0,100 C250,60 500,140 750,100 C1000,60 1250,130 1500,100 C1750,70 1875,110 2000,100 L2000,200 L0,200 Z" fill="#1A2A3A" /></svg>
          </div>
          {/* Bølge 2 */}
          <div className="absolute bottom-[-8px] left-0 w-[180%] opacity-[0.03] pointer-events-none z-[1] reisen-wave-secondary">
            <svg viewBox="0 0 2200 200" preserveAspectRatio="none" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="reisenEtterWave2" x1="0" y1="0" x2="2200" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#D4AF37" /><stop offset="100%" stopColor="transparent" /></linearGradient></defs><path d="M0,100 C275,70 550,135 825,100 C1100,65 1375,125 1650,100 C1925,75 2062,112 2200,100 L2200,200 L0,200 Z" fill="url(#reisenEtterWave2)" /></svg>
          </div>

          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-semibold text-white/95 text-center mb-16" style={{ letterSpacing: '-0.02em' }}>
              Hva skjer etter 30 dager?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {/* Fortsette */}
              <div
                className="rounded-3xl p-10 text-center transition-all duration-300 ease-out hover:border-[rgba(212,175,55,0.15)] reisen-card"
                style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-6"
                  style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', color: '#D4AF37' }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-white/95 mb-4" style={{ letterSpacing: '-0.01em' }}>
                  Fortsette
                </h3>
                <p className="text-lg text-white/90 leading-[1.7]" style={{ letterSpacing: '0.2px' }}>
                  Hvis reisen har gitt dere noe spesielt, kan dere bare fortsette derfra. Ingen deadlines. Ingen press. Bare dere to og den forbindelsen dere har bygd sammen.
                </p>
              </div>

              {/* Avslutte */}
              <div
                className="rounded-3xl p-10 text-center transition-all duration-300 ease-out hover:border-[rgba(212,175,55,0.15)] reisen-card"
                style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-6"
                  style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', color: '#D4AF37' }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 9L15 15M15 9L9 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-white/95 mb-4" style={{ letterSpacing: '-0.01em' }}>
                  Avslutte
                </h3>
                <p className="text-lg text-white/90 leading-[1.7]" style={{ letterSpacing: '0.2px' }}>
                  Hvis dere føler at reisen har oppfylt sitt formål, kan dere avslutte med takknemlighet. Ingen dårlig samvittighet. Ingen unnskyldninger. Bare ærlighet om hva dere begge trenger.
                </p>
              </div>

              {/* Ny reise */}
              <div
                className="rounded-3xl p-10 text-center transition-all duration-300 ease-out hover:border-[rgba(212,175,55,0.15)] reisen-card"
                style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-6"
                  style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', color: '#D4AF37' }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 4V9H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M20 20V15H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M15 4L21 12L15 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 20L3 12L9 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-white/95 mb-4" style={{ letterSpacing: '-0.01em' }}>
                  Ny reise
                </h3>
                <p className="text-lg text-white/90 leading-[1.7]" style={{ letterSpacing: '0.2px' }}>
                  Etter 30 dager kan dere starte en helt ny reise med en ny match. ToSom gir dere muligheten til å finne flere dype forbindelser — én om gangen.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════
            F) CTA (GlobalCTA)
            ════════════════════════════════════ */}
        <GlobalCTA />

        <Footer />
      </main>
    </>
  );
}