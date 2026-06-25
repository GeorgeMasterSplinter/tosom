'use client';

import Link from 'next/link';
import { Footer } from '@/components/ui5/Footer';
import { color, spacing, typographyToStyle, radius, shadow } from '@/config/design-tokens';
import { GlobalCTA } from '@/components/ui5/GlobalCTA';

/* ========================
   HELPER — Glass kort
   ======================== */

function GlassCard({ children, style, className }: { children: React.ReactNode; style?: React.CSSProperties; className?: string }) {
  return (
    <div
      className={className}
      style={{
        background: color.glass.bg,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: `1px solid ${color.glass.border}`,
        borderRadius: `${radius.xl}px`,
        boxShadow: shadow.lg,
        padding: `${spacing.lg}px`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ========================
   PAGE COMPONENT
   ======================== */

export default function HvorforPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Bakgrunn */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, #162032 0%, #0F1923 50%, #0B1520 100%)',
        }}
      />

      {/* Ambient glød */}
      <div
        className="absolute top-20 right-0 w-[600px] h-[400px] pointer-events-none opacity-40"
        style={{
          background: 'radial-gradient(ellipse at 70% 30%, rgba(212,175,55,0.03), transparent 70%)',
        }}
      />

      <div className="relative z-10">

        {/* ===== HERO ===== */}
        <section
          className="pt-32 pb-20 text-center"
          style={{
            background: 'linear-gradient(180deg, #162032 0%, #0F1923 50%, #0B1520 100%)',
          }}
        >
          <div className="max-w-3xl mx-auto px-6">
            <h1
              className="text-4xl md:text-5xl mb-8"
              style={typographyToStyle('heading-lg')}
            >
              Hvorfor ToSom
            </h1>

            <p
              className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
              style={{
                ...typographyToStyle('body-lg'),
                color: color.text.secondary,
              }}
            >
              Ekte relasjoner trenger ro, trygghet og tid. ToSom er laget for mennesker som ønsker noe mer enn overfladiske møter og endeløs scrolling.
            </p>
          </div>
        </section>

        {/* ===== PROBLEMET MED DAGENS DATING ===== */}
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <h2
              className="text-4xl md:text-5xl text-center mb-6"
              style={{ color: color.text.primary }}
            >
              Dagens dating skaper støy, stress og overfladighet
            </h2>

            <p
              className="max-w-3xl mx-auto text-center text-base md:text-lg mb-12 leading-relaxed"
              style={{ color: color.text.secondary }}
            >
              Dagens dating skaper støy, stress og overfladighet. De fleste plattformer er bygget for hastighet, ikke dybde. Swipe-kultur, uendelige valg og konstante distraksjoner gjør det vanskelig å lande i én relasjon. Mange opplever utmattelse, usikkerhet og følelsen av å være erstattbar.

ToSom er bygget for ro, trygghet og ekte tilstedeværelse. Vi har fjernet alt som skaper støy. Ingen offentlige profiler. Ingen swipe. Ingen jag. Bare én gjennomtenkt match basert på hvem du er og hva du faktisk trenger.

Ekte relasjoner trenger tid. Å bygge tillit krever rom, ro og en felles reise. ToSom gir dere det grunnlaget — med én match, en guidet prosess og alt som trengs for å bli virkelig kjent.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {[
                'For mange valg skaper stress',
                'Overfladiske profiler gir lite innsikt',
                'Swipe-kultur gjør det vanskelig å lande',
                'Lite trygghet og lite ro',
              ].map((punkt, idx) => (
                <GlassCard key={idx}>
                  <p
                    className="text-base md:text-lg"
                    style={{ color: color.text.primary }}
                  >
                    {punkt}
                  </p>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        {/* ===== HVORFOR TOSOM ER ANNERLEDES ===== */}
        <section
          className="py-20 px-6"
          style={{
            background: 'linear-gradient(180deg, #0B1520 0%, #121E2E 50%, #0B1520 100%)',
          }}
        >
          <div className="max-w-5xl mx-auto">
            <h2
              className="text-4xl md:text-5xl text-center mb-6"
              style={{ color: color.text.primary }}
            >
              ToSom er bygget for ro, trygghet og ekte tilstedeværelse
            </h2>

            <p
              className="max-w-3xl mx-auto text-center text-base md:text-lg mb-12 leading-relaxed"
              style={{ color: color.text.secondary }}
            >
              Vi har fjernet alt som skaper støy. Ingen offentlige profiler. Ingen swipe. Ingen jag. Bare én gjennomtenkt match basert på hvem du er og hva du faktisk trenger.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {[
                'Én match om gangen',
                'Ingen konkurranse, ingen sammenligning',
                'Ingen eksponering',
                'En forskningsbasert profil som gir dybde',
              ].map((punkt, idx) => (
                <GlassCard key={idx}>
                  <p
                    className="text-base md:text-lg"
                    style={{ color: color.text.primary }}
                  >
                    {punkt}
                  </p>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        {/* ===== ÉN MATCH – HVORFOR DET FUNGERER ===== */}
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <h2
              className="text-4xl md:text-5xl text-center mb-6"
              style={{ color: color.text.primary }}
            >
              Én match. Kvalitet over kvantitet.
            </h2>

            <p
              className="max-w-3xl mx-auto text-center text-base md:text-lg mb-12 leading-relaxed"
              style={{ color: color.text.secondary }}
            >
              Når du kun får én match, endrer alt seg. Du får tid, ro og fokus. Du slipper å sammenligne, jage eller tvile. Du kan være til stede i én relasjon — og det gir bedre grunnlag for trygghet og ekte kontakt.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {[
                'Mindre stress',
                'Mer tilstedeværelse',
                'Bedre samtaler',
                'Større sjanse for ekte kjemi',
              ].map((punkt, idx) => (
                <GlassCard key={idx}>
                  <p
                    className="text-base md:text-lg"
                    style={{ color: color.text.primary }}
                  >
                    {punkt}
                  </p>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        {/* ===== 30 DAGERS REISE ===== */}
        <section
          className="py-20 px-6"
          style={{
            background: 'linear-gradient(180deg, #0B1520 0%, #121E2E 50%, #0B1520 100%)',
          }}
        >
          <div className="max-w-5xl mx-auto">
            <h2
              className="text-4xl md:text-5xl text-center mb-6"
              style={{ color: color.text.primary }}
            >
              En guidet reise som bygger trygghet
            </h2>

            <p
              className="max-w-3xl mx-auto text-center text-base md:text-lg mb-12 leading-relaxed"
              style={{ color: color.text.secondary }}
            >
              ToSom gir dere en 30-dagers reise med små, trygge steg som hjelper dere å bli kjent på en naturlig måte. Ingen press. Ingen forventninger. Bare en rolig struktur som gjør det lettere å åpne seg.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {[
                'Daglige små oppgaver',
                'Fokus på kommunikasjon',
                'Fokus på trygghet og grenser',
                'Fokus på emosjonell tilstedeværelse',
              ].map((punkt, idx) => (
                <GlassCard key={idx}>
                  <p
                    className="text-base md:text-lg"
                    style={{ color: color.text.primary }}
                  >
                    {punkt}
                  </p>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        {/* ===== PERSONVERN OG RO ===== */}
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <h2
              className="text-4xl md:text-5xl text-center mb-6"
              style={{ color: color.text.primary }}
            >
              Trygghet og personvern i sentrum
            </h2>

            <p
              className="max-w-3xl mx-auto text-center text-base md:text-lg mb-12 leading-relaxed"
              style={{ color: color.text.secondary }}
            >
              ToSom er bygget for mennesker som ønsker trygghet. Ingen kan se profilen din. Ingen kan søke deg opp. Ingen kan kontakte deg uten at du selv ønsker det. Alt skjer i et privat rom mellom dere to.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {[
                'Ingen offentlige profiler',
                'Ingen søkefunksjon',
                'Ingen eksponering',
                'Du bestemmer når du deler bilde',
              ].map((punkt, idx) => (
                <GlassCard key={idx}>
                  <p
                    className="text-base md:text-lg"
                    style={{ color: color.text.primary }}
                  >
                    {punkt}
                  </p>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CTA (GlobalCTA) ===== */}
        <GlobalCTA />

        {/* ===== FOOTER ===== */}
        <Footer />
      </div>
    </main>
  );
}