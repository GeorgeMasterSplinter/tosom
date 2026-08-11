/**
 * ToSom Design System — Design Audit Page
 * 
 * Interaktivt audit-verktøy som viser alle design-tokens, komponentar og
 * live previews. Bruk for å verifisere konsistens på tvers av heile appen.
 */

'use client';

import { useState } from 'react';
import {
  theme,
  spacing,
  radius,
  blur,
  typography,
  motion,
  colors,
  shadows,
} from '@/config/design-tokens';
import {
  ToSomButton,
  ToSomSection,
  ToSomCard,
  ToSomTagline,
} from '@/components/ui/system';
import GlassPanel from '@/components/ui/GlassPanel';

/* ========================
   HELPERS
   ======================== */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl md:text-3xl font-bold mb-8 mt-16" style={{ color: 'rgba(255,255,255,0.92)' }}>
      {children}
    </h2>
  );
}

function SubsectionTitle({ children, description }: { children: React.ReactNode; description?: string }) {
  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold" style={{ color: 'rgba(212,175,55,0.9)' }}>
        {children}
      </h3>
      {description && (
        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
          {description}
        </p>
      )}
    </div>
  );
}

function TokenGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {children}
    </div>
  );
}

function CopyBlock({ label, code }: { label: string; code: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="flex items-center justify-between px-4 py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <span className="text-xs font-medium" style={{ color: 'rgba(212,175,55,0.8)' }}>{label}</span>
        <button
          onClick={handleCopy}
          className="text-xs px-3 py-1 rounded-md transition-all duration-200"
          style={{
            background: copied ? 'rgba(76,175,80,0.15)' : 'rgba(255,255,255,0.06)',
            color: copied ? '#4CAF50' : 'rgba(255,255,255,0.5)',
            border: `1px solid ${copied ? 'rgba(76,175,80,0.3)' : 'rgba(255,255,255,0.08)'}`,
          }}
        >
          {copied ? '✓ Kopiert' : 'Kopier'}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto">
        <code className="text-sm font-mono" style={{ color: 'rgba(255,255,255,0.75)' }}>{code}</code>
      </pre>
    </div>
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
          ToSom Design Audit
        </h1>
        <p className="text-lg md:text-xl" style={{ color: 'rgba(255,255,255,0.75)' }}>
          Konsistensverktøy for design-tokens, komponentar og visuelle element.
        </p>
        <ToSomTagline className="mt-6">
          Ro · Trygghet · Dybde
        </ToSomTagline>
      </ToSomSection>

      {/* ════════════════════════════════════
          1. RADII AUDIT
          ════════════════════════════════════ */}
      <ToSomSection spotlight="none">
        <SectionTitle>Radius Audit</SectionTitle>
        <SubsectionTitle description="radius-verdiar med live visning">Alle radius-variantar</SubsectionTitle>
        <div className="flex flex-wrap gap-8 items-end mb-12">
          {Object.entries(radius).map(([key, value]) => (
            <div key={key} className="flex flex-col items-center gap-3">
              <div
                className="border-2 transition-all duration-300"
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: typeof value === 'number' ? `${value}px` : value,
                  border: `2px solid ${colors.gold['100']}`,
                  background: 'rgba(255,255,255,0.03)',
                }}
              />
              <span className="text-xs text-center font-mono" style={{ color: 'rgba(255,255,255,0.6)' }}>
                {key}: {value}
              </span>
            </div>
          ))}
        </div>
      </ToSomSection>

      {/* ════════════════════════════════════
          2. SPACING AUDIT
          ════════════════════════════════════ */}
      <ToSomSection spotlight="none">
        <SectionTitle>Spacing Audit</SectionTitle>
        <SubsectionTitle description="spacing-gradder med live visning">Avstand mellom boksar</SubsectionTitle>
        <div className="space-y-4 mb-12">
          {Object.entries(spacing).slice(0, 8).map(([key, value]) => (
            <div key={key} className="flex items-center gap-4">
              <span className="text-xs font-mono w-24 flex-shrink-0" style={{ color: 'rgba(212,175,55,0.8)' }}>
                {key}: {value}
              </span>
              <div
                className="h-6 rounded transition-all duration-300"
                style={{
                  width: `${typeof value === 'number' ? value : parseInt(value)}px`,
                  background: 'rgba(212,175,55,0.15)',
                  border: '1px solid rgba(212,175,55,0.3)',
                }}
              />
            </div>
          ))}
        </div>

        <SubsectionTitle description="Standard spacing-bruk i appen">Hovudreglar</SubsectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <span className="text-sm font-semibold" style={{ color: '#D4AF37' }}>card-padding</span>
            <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Standard: p-6 (24px)</p>
          </div>
          <div className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <span className="text-sm font-semibold" style={{ color: '#D4AF37' }}>section-gap</span>
            <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Standard: gap-6 (24px)</p>
          </div>
          <div className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <span className="text-sm font-semibold" style={{ color: '#D4AF37' }}>page-padding</span>
            <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Standard: px-6 py-8</p>
          </div>
        </div>
      </ToSomSection>

      {/* ════════════════════════════════════
          3. SHADOW AUDIT
          ════════════════════════════════════ */}
      <ToSomSection spotlight="none">
        <SectionTitle>Shadow Audit</SectionTitle>
        <SubsectionTitle description="Alle shadow-variantar live">Skyggar med visuell preview</SubsectionTitle>
        <TokenGrid>
          {Object.entries(shadows).map(([key, value]) => (
            <div
              key={key}
              className="p-6 rounded-xl flex items-center justify-center min-h-[100px]"
              style={{ background: 'rgba(255,255,255,0.03)', boxShadow: typeof value === 'string' ? value : 'none' }}
            >
              <span className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.6)' }}>{key}</span>
            </div>
          ))}
        </TokenGrid>
      </ToSomSection>

      {/* ════════════════════════════════════
          4. TYPOGRAPHY AUDIT
          ════════════════════════════════════ */}
      <ToSomSection spotlight="none">
        <SectionTitle>Typografi Audit</SectionTitle>
        <SubsectionTitle description="Alle typografiske nivå med leve teksteksemplar">Font-storleikar og line-height</SubsectionTitle>

        <div className="space-y-8 mb-12">
          {/* H1 */}
          <div className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h1 className="text-[40px] font-bold mb-2" style={{ color: '#FFFFFF' }}>H1 — 40px</h1>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Bruk: Sidetittel på landing og onboarding</p>
          </div>

          {/* H2 */}
          <div className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h2 className="text-[28px] font-semibold mb-2" style={{ color: '#FFFFFF' }}>H2 — 28px</h2>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Bruk: Seksjonstitlar i dashboard og chat</p>
          </div>

          {/* H3 */}
          <div className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h3 className="text-[22px] font-medium mb-2" style={{ color: '#FFFFFF' }}>H3 — 22px</h3>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Bruk: Kort-titlar og paneloverskrifter</p>
          </div>

          {/* Body */}
          <div className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-[18px] leading-relaxed mb-2" style={{ color: 'rgba(255,255,255,0.8)' }}>
              Body — 18px med line-height 1.7. Dette er standardbruket for brødtekst i heile appen.
            </p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Bruk: Brødtekst, dialogar, chat-meldingar</p>
          </div>

          {/* Microcopy */}
          <div className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-[14px] mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Microcopy — 14px med line-height 1.5. Små tekstar som knapper, labelar og hints.
            </p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Bruk: Knapp-text, form-labelar, hjelpetekstar</p>
          </div>
        </div>

        {/* Code block for typography */}
        <CopyBlock label="Typografi-import" code={`import { typography } from '@config/design-tokens';\n\n// H1: fontSize: typography.fontSize['4xl'], fontWeight: 700\n// Body: fontSize: typography.fontSize.base, lineHeight: typography.lineHeight.relaxed`} />
      </ToSomSection>

      {/* ════════════════════════════════════
          5. FARGE AUDIT
          ════════════════════════════════════ */}
      <ToSomSection spotlight="none">
        <SectionTitle>Farge Audit</SectionTitle>
        <SubsectionTitle description="Alle primære fargar med visuell preview">ToSom Blue + Nordic Gold</SubsectionTitle>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="h-20 rounded-xl" style={{ background: '#4A7BA7' }}>
            <span className="text-xs block p-3 font-mono" style={{ color: 'rgba(255,255,255,0.7)' }}>#4A7BA7</span>
          </div>
          <div className="h-20 rounded-xl" style={{ background: '#D4AF37' }}>
            <span className="text-xs block p-3 font-mono text-[#0B1520]">#D4AF37</span>
          </div>
          <div className="h-20 rounded-xl" style={{ background: '#F5F5F5' }}>
            <span className="text-xs block p-3 font-mono text-[#0B1520]">#F5F5F5</span>
          </div>
          <div className="h-20 rounded-xl" style={{ background: '#FFFFFF', border: '1px solid rgba(255,255,255,0.2)' }}>
            <span className="text-xs block p-3 font-mono text-[#0B1520]">#FFFFFF</span>
          </div>
        </div>

        <SubsectionTitle description="Bruk av fargar i UI">Hva hva farge vert brukt til</SubsectionTitle>
        <TokenGrid>
          <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="w-full h-4 rounded mb-2" style={{ background: colors.gold[500] }} />
            <span className="text-sm font-medium" style={{ color: '#FFFFFF' }}>Gull — primærknappar, aksentar</span>
          </div>
          <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="w-full h-4 rounded mb-2" style={{ background: 'rgba(76,175,80,0.7)' }} />
            <span className="text-sm font-medium" style={{ color: '#FFFFFF' }}>Grøn — suksess, tryggleik</span>
          </div>
          <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="w-full h-4 rounded mb-2" style={{ background: 'rgba(255,77,77,0.7)' }} />
            <span className="text-sm font-medium" style={{ color: '#FFFFFF' }}>Raud — feil, rapportert</span>
          </div>
          <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="w-full h-4 rounded mb-2" style={{ background: 'rgba(255,193,7,0.7)' }} />
            <span className="text-sm font-medium" style={{ color: '#FFFFFF' }}>Gul — varsel, avventer</span>
          </div>
        </TokenGrid>
      </ToSomSection>

      {/* ════════════════════════════════════
          6. KNAPP AUDIT
          ════════════════════════════════════ */}
      <ToSomSection spotlight="none">
        <SectionTitle>Knapp Audit</SectionTitle>
        <SubsectionTitle description="Alle knapp-variantar live">ToSomButton + GoldButton</SubsectionTitle>

        <div className="flex flex-wrap gap-4 mb-8">
          <ToSomButton variant="gold">Gold Button (Primary)</ToSomButton>
          <ToSomButton variant="secondary">Secondary Button</ToSomButton>
        </div>

        {/* Custom GoldButton preview */}
        <SubsectionTitle description="GlassPanel GoldButton">Gjenbrukbar gull-knapp frå UI-pakken</SubsectionTitle>
        <button
          className="inline-flex items-center justify-center px-5 py-3 font-medium rounded-[16px] transition-all duration-300 hover:shadow-[0_0_24px_rgba(212,175,55,0.3)] active:scale-[0.98]"
          style={{
            background: 'linear-gradient(135deg, #D4AF37, #E8C766)',
            color: '#0B1520',
            fontSize: '18px',
          }}
        >
          Gold Button — 18px font
        </button>

        {/* Disabled state */}
        <button
          className="inline-flex items-center justify-center px-5 py-3 font-medium rounded-[16px] ml-4"
          style={{
            background: 'rgba(212,175,55,0.2)',
            color: 'rgba(255,255,255,0.3)',
            fontSize: '18px',
            cursor: 'not-allowed',
          }}
        >
          Gold Button — Disabled
        </button>
      </ToSomSection>

      {/* ════════════════════════════════════
          7. PANEL AUDIT
          ════════════════════════════════════ */}
      <ToSomSection spotlight="none">
        <SectionTitle>Panel Audit</SectionTitle>
        <SubsectionTitle description="GlassPanel-variantar live">default / gold / none</SubsectionTitle>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Default */}
          <GlassPanel borderStyle="default" padding="md">
            <span className="text-xs font-medium mb-2 block" style={{ color: 'rgba(212,175,55,0.8)' }}>default</span>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>border: rgba(255,255,255,0.1)</p>
          </GlassPanel>

          {/* Gold */}
          <GlassPanel borderStyle="gold" padding="md">
            <span className="text-xs font-medium mb-2 block" style={{ color: 'rgba(212,175,55,0.8)' }}>gold</span>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>border: rgba(212,175,55,0.2)</p>
          </GlassPanel>

          {/* None */}
          <GlassPanel borderStyle="none" padding="md">
            <span className="text-xs font-medium mb-2 block" style={{ color: 'rgba(212,175,55,0.8)' }}>none</span>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>ingen border</p>
          </GlassPanel>
        </div>
      </ToSomSection>

      {/* ════════════════════════════════════
          8. KOMPONENTKATALOG
          ════════════════════════════════════ */}
      <ToSomSection spotlight="none">
        <SectionTitle>Komponentkatalog</SectionTitle>
        <SubsectionTitle description="Alle gjenbrukbare komponentar med import-settning">UI-komponentar i /components/ui/</SubsectionTitle>

        <div className="space-y-4 mb-12">
          <CopyBlock label="NotFound.tsx" code={`import NotFound from '@/components/ui/NotFound';\n// Bruk: <NotFound title="..." description="..." backHref="/dashboard" />`} />
          <CopyBlock label="ErrorState.tsx" code={`import ErrorState from '@/components/ui/ErrorState';\n// Bruk: <ErrorState onRetry={() => fetchData()} />`} />
          <CopyBlock label="LoadingSkeleton.tsx" code={`import LoadingSkeleton, { CardSkeleton, ChatSkeleton, ProfileSkeleton } from '@/components/ui/LoadingSkeleton';\n// 7 eksportar: CardSkeleton, ChatSkeleton, DashboardSkeleton, AdminListSkeleton, ProfileSkeleton, MatchingSkeleton, LoadingOverlay`} />
          <CopyBlock label="GlassPanel.tsx" code={`import GlassPanel from '@/components/ui/GlassPanel';\n// Props: padding="sm" | "md" | "lg", borderStyle="default" | "gold" | "none", glow={true/false}`} />
        </div>

        <SubsectionTitle description="System-komponentar">Fra /components/ui/system/</SubsectionTitle>
        <div className="space-y-4 mb-12">
          <CopyBlock label="ToSomButton" code={`import { ToSomButton } from '@/components/ui/system';\n// <ToSomButton variant="gold" | "secondary">Innhald</ToSomButton>`} />
          <CopyBlock label="ToSomCard" code={`import { ToSomCard } from '@/components/ui/system';\n// <ToSomCard icon="⭐" title="Tittel">Beskrivelse</ToSomCard>`} />
          <CopyBlock label="ToSomSection" code={`import { ToSomSection } from '@/components/ui/system';\n// <ToSomSection spotlight="hero" | "cta" | "none">Innhald</ToSomSection>`} />
          <CopyBlock label="ToSomTagline" code={`import { ToSomTagline } from '@/components/ui/system';\n// <ToSomTagline>Ro · Trygghet · Dybde</ToSomTagline>`} />
        </div>

        {/* Token-importar */}
        <SubsectionTitle description="Design token-import">Frå @/config/design-tokens</SubsectionTitle>
        <CopyBlock label="Tokens" code={`import {\n  theme, spacing, radius, blur,\n  typography, motion, colors, shadows,\n} from '@/config/design-tokens';`} />
      </ToSomSection>

      {/* ════════════════════════════════════
          9. KONSISTENSREGELAR
          ════════════════════════════════════ */}
      <ToSomSection spotlight="none">
        <SectionTitle>Konsistensreglar</SectionTitle>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h4 className="font-semibold mb-3" style={{ color: '#D4AF37' }}>📐 Radius</h4>
            <ul className="space-y-1 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
              <li>Kort: 20px (rounded-2xl)</li>
              <li>Knappar: 16px</li>
              <li>Inputs: 12px</li>
              <li>Avatarar: full (50%)</li>
            </ul>
          </div>

          <div className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h4 className="font-semibold mb-3" style={{ color: '#D4AF37' }}>↔️ Spacing</h4>
            <ul className="space-y-1 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
              <li>Kort-innehold: p-6 (24px)</li>
              <li>Seksjon-gap: gap-6 (24px)</li>
              <li>Sidemark: px-6 py-8</li>
              <li>Banner-marg: mb-8</li>
            </ul>
          </div>

          <div className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h4 className="font-semibold mb-3" style={{ color: '#D4AF37' }}>🌑 Shadow</h4>
            <ul className="space-y-1 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
              <li>Kort: 0 8px 32px rgba(0,0,0,0.25)</li>
              <li>Knapp-hover: 0 0 24px rgba(212,175,55,0.3)</li>
              <li>Glass: backdrop-blur-md</li>
            </ul>
          </div>

          <div className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h4 className="font-semibold mb-3" style={{ color: '#D4AF37' }}>🎨 Glassmorphism</h4>
            <ul className="space-y-1 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
              <li>Bakgrunn: rgba(255,255,255,0.04)</li>
              <li>Border: 1px solid rgba(255,255,255,0.1)</li>
              <li>Blur: backdrop-blur-md</li>
            </ul>
          </div>
        </div>
      </ToSomSection>

    </main>
  );
}