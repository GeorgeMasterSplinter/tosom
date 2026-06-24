'use client';

import { AgeRequirement } from '@/components/AgeRequirement';
import { Footer } from '@/components/ui5/Footer';
import { color, spacing, typographyToStyle, radius, shadow } from '@/config/design-tokens';

const sections = [
  {
    title: 'Teknisk nødvendige cookies',
    content: 'Disse er nødvendige for at plattformen skal fungere. De lagrer session‑token og autentisering. Du kan ikke slå av disse.',
  },
  {
    title: 'Analytics‑cookies',
    content: 'Vi bruker ingen analytics‑cookies som sporer deg personlig. Vi har et minimalt, privat analyserverktøy som ikke deler data med noen.',
  },
  {
    title: 'Hva er en cookie',
    content: 'En cookie er en liten tekstfil som nettleseren din lagrer. Det gjør at vi kan huske innstillingene dine og gi deg en bedre opplevelse.',
  },
  {
    title: 'Hvor lenge blir cookie‑en lagret',
    content: 'Session‑cookies blir slettet når du lukker nettleseren. Permanente cookies kan bli lagret i opptil 1 år.',
  },
  {
    title: 'Kontrollere cookies',
    content: 'Du kan kontrollere cookies gjennom innstillingene i nettleseren din. Merk at hvis du blokkerer alle cookies, vil plattformen ikke fungere som den skal.',
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

export default function CookiesPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="fixed inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, #162032 0%, #0F1923 50%, #0B1520 100%)' }} />
      <div className="relative z-10">
        <section className="pt-32 pb-20 text-center" style={{ background: 'linear-gradient(180deg, #162032 0%, #0F1923 50%, #0B1520 100%)' }}>
          <div className="max-w-3xl mx-auto px-6">
            <h1 className="mb-8" style={typographyToStyle('heading-lg')}>Cookies</h1>
            <p className="max-w-2xl mx-auto leading-relaxed" style={{ ...typographyToStyle('body-lg'), color: color.text.secondary }}>
              ToSom bruker bare det nødvendige av cookies. Vi tar personvern alvorlig og deler aldri data med tredjeparts-tracking.
            </p>
          </div>
        </section>

        <section className="py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-center mb-16" style={{ ...typographyToStyle('heading-md'), color: color.text.primary }}>Cookie-guiden</h2>
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
            <h2 className="mb-6" style={{ ...typographyToStyle('heading-md'), color: color.text.primary }}>Spørsmål om cookies?</h2>
            <p className="mb-10 leading-relaxed" style={{ ...typographyToStyle('body-lg'), color: color.text.secondary }}>
              Kontakt oss på <a href="mailto:privacy@tosom.no" style={{ color: color.brand.gold, textDecoration: 'none' }}>privacy@tosom.no</a>
            </p>
          </div>
        </section>

        <section className="relative pt-[120px] pb-[140px] text-center">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-[-0.02em] leading-[1.1] text-white/95">
            Klar til å starte?
          </h2>
          <p className="mt-6 text-lg md:text-xl text-white/90 leading-[1.6] max-w-[620px] mx-auto">
            Opprett profilen din og få en gjennomtenkt match innen 24 timer.
          </p>
          <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-6">
            <a
              href="/opprett"
              className="w-[340px] h-[72px] flex items-center justify-center rounded-xl bg-[#D4AF37] text-black font-semibold text-lg shadow-[0_0_40px_rgba(212,175,55,0.35)] hover:shadow-[0_0_55px_rgba(212,175,55,0.55)] transition-all"
            >
              Opprett konto
            </a>
            <a
              href="/logg-inn"
              className="w-[340px] h-[72px] flex items-center justify-center rounded-xl backdrop-blur-xl bg-white/[0.04] border border-white/[0.08] text-white font-medium text-lg hover:bg-white/[0.07] transition-all"
            >
              Logg inn
            </a>
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