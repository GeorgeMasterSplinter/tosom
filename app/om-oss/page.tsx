'use client';

import Link from 'next/link';
import { Footer } from '@/components/ui5/Footer';

/* ========================
   PAGE COMPONENT
   ======================== */

export default function OmOssPage() {
  return (
    <>
      <style>{`
        @media (max-width: 640px) {
          .omoss-wave-primary { width: 180% !important; opacity: 0.035 !important; }
          .omoss-wave-secondary { width: 200% !important; opacity: 0.02 !important; }
          .omoss-spotlight { width: 980px !important; height: 700px !important; }
          .omoss-title { font-size: 42px !important; }
          .omoss-body { font-size: 17px !important; }
          .omoss-card { width: 100% !important; }
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
            className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[1400px] h-[900px] pointer-events-none z-0 omoss-spotlight"
            style={{ background: 'radial-gradient(circle at center, rgba(255,255,255,0.05), transparent 70%)' }}
          />
          {/* Vertikal lysgradient */}
          <div
            className="absolute top-[35%] left-1/2 -translate-x-1/2 w-[700px] h-[350px] pointer-events-none z-0"
            style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.015) 0%, transparent 100%)' }}
          />
          {/* Bølge 1 */}
          <div className="absolute bottom-[-30px] left-0 w-[150%] opacity-[0.05] pointer-events-none z-[1] omoss-wave-primary">
            <svg viewBox="0 0 2000 200" preserveAspectRatio="none" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs><linearGradient id="omossWave1" x1="0" y1="0" x2="2000" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#1A2A3A" /><stop offset="100%" stopColor="#0A0F1A" /></linearGradient></defs>
              <path d="M0,100 C250,65 500,135 750,100 C1000,65 1250,130 1500,100 C1750,70 1875,115 2000,100 L2000,200 L0,200 Z" fill="url(#omossWave1)" />
            </svg>
          </div>
          {/* Bølge 2 */}
          <div className="absolute bottom-[-15px] left-0 w-[170%] opacity-[0.03] pointer-events-none z-[1] omoss-wave-secondary">
            <svg viewBox="0 0 2200 200" preserveAspectRatio="none" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs><linearGradient id="omossWave2" x1="0" y1="0" x2="2200" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#D4AF37" /><stop offset="100%" stopColor="transparent" /></linearGradient></defs>
              <path d="M0,100 C275,72 550,128 825,100 C1100,72 1375,122 1650,100 C1925,78 2062,118 2200,100 L2200,200 L0,200 Z" fill="url(#omossWave2)" />
            </svg>
          </div>

          <div className="mx-auto max-w-[820px] px-6 relative z-10">
            <h1
              className="text-5xl md:text-6xl font-semibold tracking-[-0.02em] leading-[1.1] omoss-title"
              style={{ color: 'rgba(255,255,255,0.95)', textShadow: '0 0 36px rgba(255,255,255,0.04)' }}
            >
              Om ToSom
            </h1>
            <p
              className="mt-8 text-xl md:text-2xl omoss-body"
              style={{ color: 'rgba(255,255,255,0.90)', lineHeight: '1.65', maxWidth: '720px', margin: '0 auto', letterSpacing: '0.2px' }}
            >
              ToSom ble skapt med én tanke: at ekte forbindelse fortsatt er mulig — når vi gir rom for det.
            </p>
          </div>
        </section>

        {/* ════════════════════════════════════
            B) STORY – "Hvorfor vi finnes"
            ════════════════════════════════════ */}
        <section className="relative max-w-[900px] mx-auto px-6 py-[120px] overflow-hidden">
          {/* Bølge 1 */}
          <div className="absolute bottom-[-20px] left-0 w-[160%] opacity-[0.05] pointer-events-none z-0 omoss-wave-primary">
            <svg viewBox="0 0 2000 200" preserveAspectRatio="none" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0,100 C250,60 500,140 750,100 C1000,60 1250,130 1500,100 C1750,70 1875,110 2000,100 L2000,200 L0,200 Z" fill="#1A2A3A" /></svg>
          </div>
          {/* Bølge 2 */}
          <div className="absolute bottom-[-10px] left-0 w-[180%] opacity-[0.03] pointer-events-none z-0 omoss-wave-secondary">
            <svg viewBox="0 0 2200 200" preserveAspectRatio="none" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="omossStoryWave2" x1="0" y1="0" x2="2200" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#D4AF37" /><stop offset="100%" stopColor="transparent" /></linearGradient></defs><path d="M0,100 C275,70 550,135 825,100 C1100,65 1375,125 1650,100 C1925,75 2062,112 2200,100 L2200,200 L0,200 Z" fill="url(#omossStoryWave2)" /></svg>
          </div>

          <div className="relative z-10">
            <h2
              className="text-3xl md:text-4xl font-semibold text-white/95 mb-10"
              style={{ letterSpacing: '-0.02em' }}
            >
              Hvorfor vi finnes
            </h2>
            <div
              className="text-xl md:text-2xl"
              style={{ color: 'rgba(255,255,255,0.90)', lineHeight: '1.75', letterSpacing: '0.2px', maxWidth: '900px', margin: '0 auto' }}
            >
              <p className="mb-8">
                Moderne dating er rask, støyende og fragmentert. Folk sveiper, vurderer og hopper videre før de rekker å kjenne etter.
              </p>
              <p className="mb-8">
                Vi ønsket å skape det motsatte: et rom hvor to mennesker kan senke skuldrene, ta tiden tilbake og møtes på en måte som faktisk betyr noe.
              </p>
              <p>
                ToSom er ikke en markedsplass. Det er en prosess — en reise — som hjelper to mennesker å bli kjent på ordentlig.
              </p>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════
            C) VERDIER
            ════════════════════════════════════ */}
        <section className="relative max-w-[1100px] mx-auto px-6 py-[140px] overflow-hidden">
          {/* Spotlight */}
          <div
            className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[1400px] h-[900px] pointer-events-none z-0 omoss-spotlight"
            style={{ background: 'radial-gradient(circle at center, rgba(255,255,255,0.04), transparent 70%)' }}
          />
          {/* Bølge 1 */}
          <div className="absolute bottom-[-25px] left-0 w-[155%] opacity-[0.05] pointer-events-none z-[1] omoss-wave-primary">
            <svg viewBox="0 0 2000 200" preserveAspectRatio="none" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0,100 C250,60 500,140 750,100 C1000,60 1250,130 1500,100 C1750,70 1875,110 2000,100 L2000,200 L0,200 Z" fill="#1A2A3A" /></svg>
          </div>
          {/* Bølge 2 */}
          <div className="absolute bottom-[-12px] left-0 w-[175%] opacity-[0.03] pointer-events-none z-[1] omoss-wave-secondary">
            <svg viewBox="0 0 2200 200" preserveAspectRatio="none" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="omossVerdiWave2" x1="0" y1="0" x2="2200" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#D4AF37" /><stop offset="100%" stopColor="transparent" /></linearGradient></defs><path d="M0,100 C275,70 550,135 825,100 C1100,65 1375,125 1650,100 C1925,75 2062,112 2200,100 L2200,200 L0,200 Z" fill="url(#omossVerdiWave2)" /></svg>
          </div>

          <div className="relative z-10">
            <h2
              className="text-3xl md:text-4xl font-semibold text-white/95 text-center mb-16"
              style={{ letterSpacing: '-0.02em' }}
            >
              Våre verdier
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
              {/* Ro */}
              <div
                className="rounded-3xl p-10 transition-all duration-300 ease-out hover:border-[rgba(212,175,55,0.15)] omoss-card"
                style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                  style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', color: '#D4AF37' }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5"/><path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-white/95 mb-4" style={{ letterSpacing: '-0.01em' }}>
                  Ro
                </h3>
                <p className="text-lg text-white/90 leading-[1.7]" style={{ letterSpacing: '0.2px' }}>
                  Alt i ToSom er designet for trygghet, fokus og lav puls. Ingen støy. Ingen press. Bare et rolig rom hvor to mennesker kan bli kjent uten hastverk.
                </p>
              </div>

              {/* Verdighet */}
              <div
                className="rounded-3xl p-10 transition-all duration-300 ease-out hover:border-[rgba(212,175,55,0.15)] omoss-card"
                style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                  style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', color: '#D4AF37' }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 3L15.089 9.263L22 10L17 15.238L18 22L12 19L6 22L7 15.238L2 10L8.911 9.263L12 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-white/95 mb-4" style={{ letterSpacing: '-0.01em' }}>
                  Verdighet
                </h3>
                <p className="text-lg text-white/90 leading-[1.7]" style={{ letterSpacing: '0.2px' }}>
                  Alle mennesker fortjener en plattform som behandler dem med respekt og varme. ToSom er designet for verdighet — i hvert element, hver tekst og hvert valgt.
                </p>
              </div>

              {/* Forskning */}
              <div
                className="rounded-3xl p-10 transition-all duration-300 ease-out hover:border-[rgba(212,175,55,0.15)] omoss-card"
                style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                  style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', color: '#D4AF37' }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 3V21M9 17H15M9 3H15M9 3L7 6M9 3L11 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 21V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-white/95 mb-4" style={{ letterSpacing: '-0.01em' }}>
                  Forskning
                </h3>
                <p className="text-lg text-white/90 leading-[1.7]" style={{ letterSpacing: '0.2px' }}>
                  Vi bygger på psykologiske modeller og relasjonsforskning — ikke trender. Hvert designvalg, hver match og hver guiding er forskningsbasert for å skape ekte forbindelse.
                </p>
              </div>

              {/* Personvern */}
              <div
                className="rounded-3xl p-10 transition-all duration-300 ease-out hover:border-[rgba(212,175,55,0.15)] omoss-card"
                style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                  style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', color: '#D4AF37' }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 3L3 9V15L12 21L21 15V9L12 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 21V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M3 9L12 15L21 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-white/95 mb-4" style={{ letterSpacing: '-0.01em' }}>
                  Personvern
                </h3>
                <p className="text-lg text-white/90 leading-[1.7]" style={{ letterSpacing: '0.2px' }}>
                  Dine data er dine. Vi selger aldri, deler aldri og viser aldri informasjonen din. Din profil er privat — kun for deg og den du matcher med.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════
            D) TEAM
            ════════════════════════════════════ */}
        <section className="relative max-w-[900px] mx-auto px-6 py-[120px] text-center overflow-hidden">
          {/* Spotlight */}
          <div
            className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[1200px] h-[800px] pointer-events-none z-0 omoss-spotlight"
            style={{ background: 'radial-gradient(circle at center, rgba(255,255,255,0.04), transparent 70%)' }}
          />
          {/* Bølge 1 */}
          <div className="absolute bottom-[-15px] left-0 w-[160%] opacity-[0.05] pointer-events-none z-[1] omoss-wave-primary">
            <svg viewBox="0 0 2000 200" preserveAspectRatio="none" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0,100 C250,60 500,140 750,100 C1000,60 1250,130 1500,100 C1750,70 1875,110 2000,100 L2000,200 L0,200 Z" fill="#1A2A3A" /></svg>
          </div>
          {/* Bølge 2 */}
          <div className="absolute bottom-[-8px] left-0 w-[180%] opacity-[0.03] pointer-events-none z-[1] omoss-wave-secondary">
            <svg viewBox="0 0 2200 200" preserveAspectRatio="none" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="omossTeamWave2" x1="0" y1="0" x2="2200" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#D4AF37" /><stop offset="100%" stopColor="transparent" /></linearGradient></defs><path d="M0,100 C275,70 550,135 825,100 C1100,65 1375,125 1650,100 C1925,75 2062,112 2200,100 L2200,200 L0,200 Z" fill="url(#omossTeamWave2)" /></svg>
          </div>

          <div className="relative z-10">
            <h2
              className="text-3xl md:text-4xl font-semibold text-white/95 mb-10"
              style={{ letterSpacing: '-0.02em' }}
            >
              Teamet bak ToSom
            </h2>
            <div
              className="text-xl md:text-2xl"
              style={{ color: 'rgba(255,255,255,0.90)', lineHeight: '1.75', letterSpacing: '0.2px', maxWidth: '800px', margin: '0 auto' }}
            >
              <p className="mb-8">
                ToSom er laget av et lite team som tror på at ekte forbindelse fortsatt er mulig. Vi bygger ikke en app — vi bygger et rom hvor mennesker kan møtes på en trygg og meningsfull måte.
              </p>
              <p>
                Vi er utviklere, designere og fagpersoner som brenner for relasjoner, psykologi og teknologi som gjør livet bedre — ikke mer stressende.
              </p>
            </div>
            <p
              className="mt-12 text-2xl md:text-3xl font-semibold"
              style={{ color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.01em' }}
            >
              Vil du være en del av det?
            </p>
          </div>
        </section>

        {/* ════════════════════════════════════
            E) CTA
            ════════════════════════════════════ */}
        <section className="relative pt-[120px] pb-[140px] text-center overflow-hidden">
          {/* Spotlight */}
          <div
            className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[1200px] h-[800px] pointer-events-none z-0 omoss-spotlight"
            style={{ background: 'radial-gradient(circle at center, rgba(255,255,255,0.05), transparent 70%)' }}
          />
          {/* Vertikal lysgradient */}
          <div
            className="absolute top-[25%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none z-0"
            style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.015) 0%, transparent 100%)' }}
          />
          {/* Bølge 1 */}
          <div className="absolute bottom-[-20px] left-0 w-[160%] opacity-[0.05] pointer-events-none z-[1] omoss-wave-primary">
            <svg viewBox="0 0 2000 200" preserveAspectRatio="none" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0,100 C250,60 500,140 750,100 C1000,60 1250,130 1500,100 C1750,70 1875,110 2000,100 L2000,200 L0,200 Z" fill="#1A2A3A" /></svg>
          </div>
          {/* Bølge 2 */}
          <div className="absolute bottom-[-10px] left-0 w-[180%] opacity-[0.03] pointer-events-none z-[1] omoss-wave-secondary">
            <svg viewBox="0 0 2200 200" preserveAspectRatio="none" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="omossCtaWave2" x1="0" y1="0" x2="2200" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#D4AF37" /><stop offset="100%" stopColor="transparent" /></linearGradient></defs><path d="M0,100 C275,70 550,135 825,100 C1100,65 1375,125 1650,100 C1925,75 2062,112 2200,100 L2200,200 L0,200 Z" fill="url(#omossCtaWave2)" /></svg>
          </div>

          <div className="mx-auto max-w-[900px] px-6 relative z-10">
            <h2
              className="text-4xl md:text-5xl font-semibold tracking-[-0.02em] leading-[1.1]"
              style={{ color: 'rgba(255,255,255,0.95)' }}
            >
              Klar til å starte?
            </h2>
            <p
              className="mt-6 text-lg md:text-xl"
              style={{ color: 'rgba(255,255,255,0.90)', lineHeight: '1.6', maxWidth: '620px', margin: '0 auto 52px', letterSpacing: '0.2px' }}
            >
              Opprett profilen din og få en gjennomtenkt match innen 24 timer.
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
      </main>
    </>
  );
}