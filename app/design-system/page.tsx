/**
 * ToSom Design System — Documentation Page
 * 
 * Viser tokens, komponenter og live previews.
 */

'use client';

import {
  theme,
  spacing,
  radius,
  blur,
  typography,
  motion,
  colors,
  shadows,
} from '@/design/theme';
import {
  ToSomButton,
  ToSomSection,
  ToSomCard,
  ToSomTagline,
} from '@/components/ui5/system';

/* ========================
   HELPERS
   ======================== */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-2xl md:text-3xl font-bold mb-8"
      style={{ color: 'rgba(255,255,255,0.92)' }}
    >
      {children}
    </h2>
  );
}

function TokenBlock({ title, data }: { title: string; data: Record<string, unknown> }) {
  return (
    <div className="rounded-2xl p-6 md:p-8" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <h3 className="text-lg font-semibold mb-4" style={{ color: 'rgba(212,175,55,0.9)' }}>{title}</h3>
      <pre className="text-sm opacity-80 whitespace-pre-wrap font-mono" style={{ color: 'rgba(255,255,255,0.75)' }}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="rounded-xl p-5 md:p-6 overflow-x-auto" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <code className="text-sm md:text-base font-mono" style={{ color: 'rgba(255,255,255,0.8)' }}>{code}</code>
    </pre>
  );
}

/* ========================
   PAGE
   ======================== */

export default function DesignSystemPage() {
  return (
    <main className="pb-32">
      {/* ── HEADER ── */}
      <ToSomSection spotlight="none" className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'rgba(255,255,255,0.92)' }}>
          ToSom Design System
        </h1>
        <p className="text-lg md:text-xl" style={{ color: 'rgba(255,255,255,0.75)' }}>
          Grunnlaget for all UI-utvikling på ToSom.
        </p>
        <ToSomTagline className="mt-6">
          Ro · Trygghet · Dybde
        </ToSomTagline>
      </ToSomSection>

      {/* ── TOKENS ── */}
      <ToSomSection spotlight="none">
        <SectionTitle>Tokens</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-16">
          <TokenBlock title="spacing" data={spacing} />
          <TokenBlock title="radius" data={radius} />
          <TokenBlock title="blur" data={blur} />
          <TokenBlock title="colors" data={colors} />
          <TokenBlock title="typography" data={typography} />
          <TokenBlock title="motion.durations" data={motion.durations} />
          <TokenBlock title="motion.easing" data={motion.easings} />
          <TokenBlock title="shadows" data={shadows} />
        </div>
      </ToSomSection>

      {/* ── KOMPONENTER ── */}
      <ToSomSection spotlight="none">
        <SectionTitle>Komponenter</SectionTitle>

        <h3 className="text-xl font-semibold mb-4" style={{ color: 'rgba(212,175,55,0.9)' }}>ToSomButton</h3>
        <div className="flex flex-col md:flex-row gap-4 mb-12 max-w-[400px]">
          <ToSomButton variant="gold">Gold Button</ToSomButton>
          <ToSomButton variant="dark">Dark Button</ToSomButton>
        </div>

        <h3 className="text-xl font-semibold mb-4" style={{ color: 'rgba(212,175,55,0.9)' }}>ToSomCard</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[600px] mb-12">
          <ToSomCard icon="⭐" title="Eksempel på kort">
            Dette er et eksempel på ToSomCard med ikon, tittel og tekst.
          </ToSomCard>
          <ToSomCard icon="🎨" title="Design tokens">
            Alle verdier kommer fra tokens — radius, farger, motion, spacing.
          </ToSomCard>
        </div>

        <h3 className="text-xl font-semibold mb-4" style={{ color: 'rgba(212,175,55,0.9)' }}>ToSomTagline</h3>
        <ToSomTagline className="mb-16">Dette er en tagline fra design systemet</ToSomTagline>
      </ToSomSection>

      {/* ── LIVE PREVIEWS ── */}
      <ToSomSection spotlight="cta">
        <SectionTitle>Live Previews</SectionTitle>

        <h3 className="text-xl font-semibold mb-6" style={{ color: 'rgba(212,175,55,0.9)' }}>Knapper</h3>
        <div className="flex flex-wrap gap-4 mb-12">
          <ToSomButton variant="gold">Primary CTA</ToSomButton>
          <ToSomButton variant="dark">Secondary CTA</ToSomButton>
        </div>

        <h3 className="text-xl font-semibold mb-6" style={{ color: 'rgba(212,175,55,0.9)' }}>Kort</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <ToSomCard icon="🚀" title="Rask">Bygget på tokens</ToSomCard>
          <ToSomCard icon="🎯" title="Presis">Ingen gjetting</ToSomCard>
          <ToSomCard icon="💎" title="Premium">Nordic Gold stil</ToSomCard>
        </div>

        <h3 className="text-xl font-semibold mb-6" style={{ color: 'rgba(212,175,55,0.9)' }}>ToSomSection med spotlight="hero"</h3>
        <ToSomSection spotlight="hero">
          <h2 className="text-3xl font-bold text-center" style={{ color: 'rgba(255,255,255,0.92)' }}>
            Hero Spotlight Preview
          </h2>
          <p className="text-center mt-4" style={{ color: 'rgba(255,255,255,0.75)' }}>
            Dette er en seksjon med hero-spotlight-effekt.
          </p>
        </ToSomSection>
      </ToSomSection>

      {/* ── KODEEKSEMPLER ── */}
      <ToSomSection spotlight="none">
        <SectionTitle>Kodeeksempler</SectionTitle>

        <h3 className="text-lg font-semibold mb-3" style={{ color: 'rgba(212,175,55,0.9)' }}>ToSomButton</h3>
        <CodeBlock code={`<ToSomButton variant="gold">Klikk meg</ToSomButton>\n<ToSomButton variant="dark">Secondary</ToSomButton>`} />

        <h3 className="text-lg font-semibold mb-3 mt-8" style={{ color: 'rgba(212,175,55,0.9)' }}>ToSomCard</h3>
        <CodeBlock code={`<ToSomCard icon="⭐" title="Min tittel">\n  Min tekst her\n</ToSomCard>`} />

        <h3 className="text-lg font-semibold mb-3 mt-8" style={{ color: 'rgba(212,175,55,0.9)' }}>ToSomSection</h3>
        <CodeBlock code={`<ToSomSection spotlight="hero">\n  <h2>Innhold</h2>\n</ToSomSection>`} />

        <h3 className="text-lg font-semibold mb-3 mt-8" style={{ color: 'rgba(212,175,55,0.9)' }}>Tokens</h3>
        <CodeBlock code={'import { theme, spacing, radius, colors } from \'@design/theme\';\n\n// Bruk i kode:\nconst padding = theme.spacing[\'6xl\']; // 120px'} />
      </ToSomSection>
    </main>
  );
}