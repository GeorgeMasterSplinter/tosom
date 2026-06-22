'use client';

import Link from 'next/link';
import { Footer } from '@/components/ui5/Footer';
import { color, spacing, typographyToStyle, radius, shadow } from '@/config/design-tokens';

/* ========================
   DATA — Steg og informasjon
   ======================== */

const steps = [
  {
    num: 1,
    title: 'Opprett din private profil',
    desc: 'Du svarar på eit djupt sett med spørsmål om livet ditt, verdiane dine, personlegdommen din og kva du søkjer. Ingen bilder — berre du.',
    detail: 'Profilen din bygger på forskningsbaserte modellar for kompatibilitet. Alle svarene er krypterte og aldri synlege for andre brukarar.',
  },
  {
    num: 2,
    title: 'Få éin match basert på kunnskap',
    desc: 'ToSoms match-motor køyra éin gong i døgnet og finn den beste kompatibiliteten for deg — ikkje dei mange verste.',
    detail: 'Vi bruker resonans-matching som måler dybde, verdiar, livssituasjon og emosjonelle mønstre — ikkje utseende.',
  },
  {
    num: 3,
    title: 'Dere aksepterer og låser saman',
    desc: 'Når begge aksepterer matchet, blir dere låste saman i 30 dagar. Ingen nye matcher i denne perioden.',
    detail: 'Dette skaper fokus og tryggleik — to menneske som vel å utforske ei forbindelse utan distraksjonar.',
  },
  {
    num: 4,
    title: 'Gjennom ei guidet 30-dagers reise',
    desc: 'Kvar dag får paret refleksjonsspørsmål, samtaletema, små oppgåver og resonansmåling.',
    detail: 'Reisen er strukturert i tema: Introduksjon → Tryggleik → Åpne deg → Djupe samtalar → Sårbarheit → Felles reise.',
  },
  {
    num: 5,
    title: 'Etter 30 dagar velji dere vidare',
    desc: 'Etter reisa kan paret velje å fortsetje, avslutte, eller starte en ny reise med en ny match.',
    detail: 'Det er ditt val — vi skaper aldri press.',
  },
];

const differencePoints = [
  { title: 'Éin match', desc: 'Ikke titalls å velje mellom. Berre éin som faktisk passar.' },
  { title: 'Ingen bilder fyrst', desc: 'Dei fyrste 14 dagane er bilder valgfrie — for å bygge ekte forbindelse.' },
  { title: 'Guidet reise', desc: 'Kvar dag med refleksjonar, oppgåver og samtaletema.' },
  { title: 'Ingen swipe', desc: 'Ingen overflatefokus. Ingen raske dømar.' },
];

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

export default function SlikPage() {
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
        className="absolute top-20 left-0 w-[600px] h-[400px] pointer-events-none opacity-40"
        style={{
          background: 'radial-gradient(ellipse at 30% 30%, rgba(80,120,255,0.03), transparent 70%)',
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
              className="mb-8"
              style={typographyToStyle('heading-lg')}
            >
              Slik fungerer det
            </h1>

            <p
              className="max-w-2xl mx-auto leading-relaxed"
              style={{
                ...typographyToStyle('body-lg'),
                color: color.text.secondary,
              }}
            >
              ToSom er ikkje ein datingapp. Det er ein guided reise mellom to menneske — designa for tryggleik, djupde og ekte forbindelse.
            </p>
          </div>
        </section>

        {/* ===== STEG-FOR-STEG ===== */}
        <section className="py-24 px-6">
          <div className="max-w-4xl mx-auto">
            <h2
              className="text-center mb-16"
              style={{
                ...typographyToStyle('heading-md'),
                color: color.text.primary,
              }}
            >
              Fem steg til connexion
            </h2>

            <div className="space-y-8">
              {steps.map((step) => (
                <GlassCard key={step.num}>
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    {/* Nummer */}
                    <div
                      className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center font-semibold text-lg"
                      style={{
                        background: 'rgba(212,175,55,0.1)',
                        border: '1px solid rgba(212,175,55,0.2)',
                        color: color.brand.gold,
                      }}
                    >
                      {step.num}
                    </div>

                    {/* Innhald */}
                    <div className="flex-1">
                      <h3
                        className="mb-3"
                        style={{
                          ...typographyToStyle('heading-sm'),
                          color: color.text.primary,
                        }}
                      >
                        {step.title}
                      </h3>
                      <p
                        style={{
                          ...typographyToStyle('body'),
                          color: color.text.secondary,
                          marginBottom: '12px',
                        }}
                      >
                        {step.desc}
                      </p>
                      <p
                        style={{
                          ...typographyToStyle('body-sm'),
                          color: color.text.muted,
                          fontStyle: 'italic',
                        }}
                      >
                        {step.detail}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        {/* ===== KVAD GJER TO SOM ANNERLEDS ===== */}
        <section
          className="py-24 px-6"
          style={{
            background: 'linear-gradient(180deg, #0B1520 0%, #121E2E 50%, #0B1520 100%)',
          }}
        >
          <div className="max-w-5xl mx-auto">
            <h2
              className="text-center mb-16"
              style={{
                ...typographyToStyle('heading-md'),
                color: color.text.primary,
              }}
            >
              Kva gjer ToSom annerleis?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {differencePoints.map((item, idx) => (
                <GlassCard key={idx}>
                  <h3
                    className="mb-3"
                    style={{
                      ...typographyToStyle('heading-sm'),
                      color: color.brand.gold,
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      ...typographyToStyle('body-sm'),
                      color: color.text.secondary,
                    }}
                  >
                    {item.desc}
                  </p>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="py-24 px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <h2
              className="mb-6"
              style={{
                ...typographyToStyle('heading-md'),
                color: color.text.primary,
              }}
            >
              Klar til å starte?
            </h2>
            <p
              className="mb-10 leading-relaxed"
              style={{
                ...typographyToStyle('body-lg'),
                color: color.text.secondary,
              }}
            >
              Berre éin match. Men éin som faktisk passar.
            </p>
            <Link
              href="/onboarding/start"
              className="inline-flex items-center justify-center px-10 py-3.5 font-medium transition-all duration-300"
              style={{
                ...typographyToStyle('cta'),
                background: color.brand.gold,
                color: '#0B1520',
                borderRadius: `${radius.md}px`,
                boxShadow: `0 0 30px ${color.ambient.gold.medium}, 0 4px 12px rgba(0,0,0,0.2)`,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = color.brand['gold-hover'];
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = color.brand.gold;
              }}
            >
              Kom i gang
            </Link>
          </div>
        </section>

        {/* ===== FOOTER ===== */}
        <Footer />
      </div>
    </main>
  );
}