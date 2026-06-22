'use client';

import { Footer } from '@/components/ui5/Footer';
import { color, spacing, typographyToStyle, radius, shadow } from '@/config/design-tokens';

const sections = [
  {
    title: 'Kva data vi samler',
    content: 'Vi samler berre det vi treng for å gi deg den beste opplevinga. Dette inkluderar e-post, profilspørsmål, og samtalehistorikk. Ingen sporing til marknadsføringsformål.',
  },
  {
    title: 'Kvifor vi samler data',
    content: 'Dataene våre blir berre brukte til å gi deg dei beste matchene. Vi bruker aldri data til å selje annonser eller dele med tredjepart.',
  },
  {
    title: 'Kor dataene dine blir lagra',
    content: 'Alle dataene dine blir lagra i trygge, krypterte databasar på servere i EU/EØS. Vi følgjer GDPR-fullt ut.',
  },
  {
    title: 'Dine rettigheter',
    content: 'Du har rett til å be om sletting, endring, eller eksport av dine data. Kontak oss på kvar som helst for å utøve dine rettigheter.',
  },
  {
    title: 'Cookies og sporing',
    content: 'Vi bruker minimalt med cookies. Berre dei som er teknisk nødvendige for at sida skal fungere.',
  },
  {
    title: 'Delen av data',
    content: 'Vi deler aldri dine personlege data med nokon. Dine svare er krypterte og aldri synlege for andre brukarar.',
  },
];

const rights = [
  'Rett til innsyn',
  'Rett til retting',
  'Rett til sletting',
  'Rett til begrensning',
  'Rett til dataportsabilitet',
  'Rett til å trekje samtykke',
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

export default function PersonvernPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="fixed inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, #162032 0%, #0F1923 50%, #0B1520 100%)' }} />
      <div className="relative z-10">
        <section className="pt-32 pb-20 text-center" style={{ background: 'linear-gradient(180deg, #162032 0%, #0F1923 50%, #0B1520 100%)' }}>
          <div className="max-w-3xl mx-auto px-6">
            <h1 className="mb-8" style={typographyToStyle('heading-lg')}>Personvern</h1>
            <p className="max-w-2xl mx-auto leading-relaxed" style={{ ...typographyToStyle('body-lg'), color: color.text.secondary }}>
              Din privatliv er hellig. Vi samler berre det vi treng, lagrar det trygt, og deler det aldri.
            </p>
          </div>
        </section>

        <section className="py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-center mb-16" style={{ ...typographyToStyle('heading-md'), color: color.text.primary }}>Kva vi gjer med dine data</h2>
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

        <section className="py-24 px-6" style={{ background: 'linear-gradient(180deg, #0B1520 0%, #121E2E 50%, #0B1520 100%)' }}>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-center mb-16" style={{ ...typographyToStyle('heading-md'), color: color.text.primary }}>Dine rettigheter</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {rights.map((r, idx) => (
                <GlassCard key={idx}>
                  <h3 className="mb-2" style={{ ...typographyToStyle('heading-sm'), color: color.text.primary }}>{r}</h3>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="mb-6" style={{ ...typographyToStyle('heading-md'), color: color.text.primary }}>Spørsmål om personvern?</h2>
            <p className="mb-10 leading-relaxed" style={{ ...typographyToStyle('body-lg'), color: color.text.secondary }}>
              Kontak oss på <a href="mailto:privat@tosom.no" style={{ color: color.brand.gold, textDecoration: 'none' }}>privat@tosom.no</a>
            </p>
          </div>
        </section>
        <Footer />
      </div>
    </main>
  );
}