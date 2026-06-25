'use client';

import { Footer } from '@/components/ui5/Footer';
import { color, spacing, typographyToStyle, radius, shadow } from '@/config/design-tokens';

const sections = [
  {
    title: 'Aldersgrense',
    content: 'Du må være 23 for å bruke ToSom. Vi tar alderskravet svært alvorlig for å sikre et trygt miljø for voksne som søker ekte forbindelse.',
  },
  {
    title: 'Oppretting av konto og innlogging',
    content: 'Du oppretter en konto med gyldig e-postadresse. Du mottar en magisk innloggingslenke. I tillegg kan du verifisere telefonnummeret ditt for økt sikkerhet. Kontoen er knyttet til din e-postadresse og eventuelle verifiserte kontaktopplysninger.',
  },
  {
    title: 'Profildynamikk',
    content: 'Profilen din er privat og synlig bare for din match. Du kan redigere profilen din når som helst fra dashbordet.',
  },
  {
    title: 'Matching og reiseforløp',
    content: 'Når du matcher med noen, går dere inn i en styrt 30-dagers reise. Dette forløpet inkluderer daglige refleksjoner, samtaletema og oppgaver som hjelper dere å bli kjent.',
  },
  {
    title: 'Bildefdeling',
    content: 'Bilder kan deles etter 14 dager i reise-forløpet. Før den tid bygger dere en tilknytning basert på dybde og resonans, ikke utseende.',
  },
  {
    title: 'Avslutning og oppsigelse',
    content: 'Du kan avslutte reisen tidlig eller be om sletting av konto og alle data. Kontakt oss på privat@tosom.no.',
  },
  {
    title: 'Ansvar og opphavsrett',
    content: 'Innholdet på plattformen er beskyttet av opphavsrett. Du har lov å bruke det personlig, men ikke å dele eller publisere videre.',
  },
];

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

export default function VilkarPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="fixed inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, #162032 0%, #0F1923 50%, #0B1520 100%)' }} />
      <div className="relative z-10">
        <section className="pt-32 pb-20 text-center" style={{ background: 'linear-gradient(180deg, #162032 0%, #0F1923 50%, #0B1520 100%)' }}>
          <div className="max-w-3xl mx-auto px-6">
            <h1 className="mb-8" style={typographyToStyle('heading-lg')}>Vilkår for bruk</h1>
            <p className="max-w-2xl mx-auto leading-relaxed" style={{ ...typographyToStyle('body-lg'), color: color.text.secondary }}>
              ToSom er designet for voksne mennesker som ønsker ekte forbindelse. Ved å bruke plattformen samtykker du til disse vilkårene.
            </p>
          </div>
        </section>

        <section className="py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-center mb-16" style={{ ...typographyToStyle('heading-md'), color: color.text.primary }}>Hva du bør vite</h2>
            <div className="space-y-6">
              {sections.map((s, idx) => (
                <GlassCard key={idx}>
                  <h3 className="mb-3" style={{ ...typographyToStyle('heading-sm'), color: color.brand.gold }}>{s.title}</h3>
                  <p style={{ ...typographyToStyle('body-sm'), color: color.text.secondary }}>{s.content}</p>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="mb-6" style={{ ...typographyToStyle('heading-md'), color: color.text.primary }}>Spørsmål om vilkårene?</h2>
            <p className="mb-10 leading-relaxed" style={{ ...typographyToStyle('body-lg'), color: color.text.secondary }}>
              Kontakt oss på <a href="mailto:privat@tosom.no" style={{ color: color.brand.gold, textDecoration: 'none' }}>privat@tosom.no</a>
            </p>
          </div>
        </section>

        <section className="relative pt-[120px] pb-[140px] text-center overflow-hidden">
          <div className="mx-auto max-w-[900px] px-6 relative z-10">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-[-0.02em] leading-[1.1] text-white/95">
              Klar til å starte?
            </h2>
            <p className="mt-6 text-lg md:text-xl text-white/90 leading-[1.6] max-w-[620px] mx-auto">
              Opprett profilen din og få en gjennomtenkt match innen 24 timer.
            </p>
            <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-6">
              <a
                href="/onboarding/start"
                className="inline-flex w-full sm:w-[340px] h-[72px] items-center justify-center rounded-xl bg-[#D4AF37] text-black font-semibold text-lg shadow-[0_0_40px_rgba(212,175,55,0.35)] hover:shadow-[0_0_55px_rgba(212,175,55,0.55)] transition-all"
              >
                Opprett konto
              </a>
              <a
                href="/login"
                className="inline-flex w-full sm:w-[340px] h-[72px] items-center justify-center rounded-xl backdrop-blur-xl bg-white/[0.04] border border-white/[0.08] text-white font-medium text-lg hover:bg-white/[0.07] transition-all"
              >
                Logg inn
              </a>
            </div>
          </div>
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-x-0 bottom-0 h-[300px] bg-gradient-to-t from-[#0A1A2F]/40 to-transparent blur-3xl"></div>
            <div className="absolute inset-x-0 bottom-0 h-[260px] bg-gradient-to-t from-[#D4AF37]/20 to-transparent blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-[#D4AF37]/10 rounded-full blur-[180px]"></div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
}