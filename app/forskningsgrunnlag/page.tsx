'use client';

/**
 * ToSom — Forskningsgrunnlag (FORSKNINGSMOTOR F-10)
 *
 * Vi sier det vi gjør. Denne siden dokumenterer:
 *  1. Vi driver ikke egen forskning — vi bygger på etablerte modeller
 *  2. De seks dimensjonene, med vekt og begrunnelse
 *  3. Instrumentene vi bruker, med kilde
 *  4. Hva resonans er — og hva det ikke er
 *  5. Kilder
 *  6. Hva vi ikke lover
 *
 * Språk (fra planen): «kortform av Big Five», «prinsipper fra Gottmans
 * forskning», «forskningsbaserte dimensjoner», «en veiviser» — aldri
 * «vitenskapelig bevist» eller «en fasit».
 */

import { Footer } from '@/components/ui/layout/Footer';
import { ToSomSection, ToSomCard, ToSomButton } from '@/components/ui/system';
import { color, spacing, typographyToStyle } from '@/config/design-tokens';
import GlassCard from '@/components/ui/cards/GlassCard';

/* ========================
   DATA — seks dimensjoner (F-8 vektene, §7)
   ======================== */

const DIMENSIONS: Array<{ name: string; weight: string; why: string }> = [
  {
    name: 'Verdier',
    weight: '25 %',
    why: 'Sterkeste prediktor for langsiktig samsvar. Vi ser på korrelasjon mellom to verdiprofiler — ikke på om dere bruker like ord.',
  },
  {
    name: 'Tilknytning',
    weight: '25 %',
    why: 'Best dokumenterte funn i parforskning. Vi ser på de to akserne angst og unnvikelse — ikke bare om dere «er trygge».',
  },
  {
    name: 'Personlighet',
    weight: '15 %',
    why: 'Reell effekt, men svakere enn ofte antatt. Høy nevrotisisme hos begge er risiko — ikke et poengtrekk.',
  },
  {
    name: 'Kommunikasjon',
    weight: '15 %',
    why: 'Bygget på prinsipper fra Gottmans forskning: reparasjon, respons på invitasjoner, konfliktstil.',
  },
  {
    name: 'Emosjonsregulering',
    weight: '10 %',
    why: 'Påvirker konflikthåndtering direkte. Høy undertrykking hos begge er et konfliktpotensial.',
  },
  {
    name: 'Livssituasjon',
    weight: '10 %',
    why: 'Praktisk kompatibilitet er undervurdert. Vilje til barn, røyking og hverdagsrytme setter en ramme.',
  },
];

/* ========================
   DATA — instrumenter (F-1 kildene)
   ======================== */

const INSTRUMENTS: Array<{
  name: string;
  items: number;
  source: string;
  note?: string;
}> = [
  {
    name: 'Kortform av Big Five',
    items: 10,
    source: 'Rammstedt & John (2007), Journal of Research in Personality 41(1)',
    note: 'Oversettelsen er vår — merket som «bør kvalitetssikres».',
  },
  {
    name: 'Tilknytning',
    items: 12,
    source: 'Inspirert av Bowlby (1969), Ainsworth et al. (1978), Hazan & Shaver (1987), Wei et al. (2007)',
    note: 'Våre egne items som taper på akserne angst og unnvikelse.',
  },
  {
    name: 'Verdier (PVQ-10)',
    items: 10,
    source: 'Schwartz (1992), Advances in Experimental Social Psychology 25',
    note: 'Oversettelsen er vår — merket som «bør kvalitetssikres».',
  },
  {
    name: 'Emosjonsregulering (ERQ-6)',
    items: 6,
    source: 'Gross & John (2003), Journal of Personality and Social Psychology 85(2)',
    note: 'Oversettelsen er vår — merket som «bør kvalitetssikres».',
  },
  {
    name: 'Kommunikasjon',
    items: 6,
    source: 'Prinsipper fra Gottman & Levenson (1992), Journal of Personality and Social Psychology 63(2)',
    note: 'Våre egne items bygget på prinsippene — vi bruker ikke Gottman Institute sine skjemaer.',
  },
];

export default function ForskningsgrunnlagPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Bakgrunn — Deep Blue gradient */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(180deg, #0B1520 0%, #121E2E 50%, #0B1520 100%)' }}
      />
      <div
        className="absolute top-20 right-0 w-[600px] h-[400px] pointer-events-none opacity-30"
        style={{ background: 'radial-gradient(ellipse at 70% 30%, rgba(80,120,255,0.04), transparent 70%)' }}
      />

      <div className="relative z-10">
        {/* ===== HERO ===== */}
        <ToSomSection spotlight="blue" className="px-6 text-center space-y-6">
          <h1 style={{ ...typographyToStyle('hero'), color: color.text.primary }}>
            Forskningsgrunnlaget
          </h1>
          <p
            className="max-w-2xl mx-auto"
            style={{ ...typographyToStyle('body-lg'), color: color.text.secondary, lineHeight: '1.8' }}
          >
            Tosom matcher på seks forskningsbaserte dimensjoner. Vi driver ikke egen forskning —
            vi bygger på modeller som har vært gjennom tiåre av testing. Her er hva vi bruker,
            og hva vi ikke lover.
          </p>
        </ToSomSection>

        {/* ===== 1. VI DRIVER IKKE EGEN FORSKNING ===== */}
        <ToSomSection spotlight="blue" className="px-6">
          <div
            className="mx-auto max-w-3xl space-y-6"
            style={{
              background: 'rgba(255,255,255,0.045)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '28px',
              padding: `${spacing.lg}px`,
            }}
          >
            <h2 style={{ ...typographyToStyle('heading-lg'), color: color.text.primary }}>
              Vi bygger på etablerte modeller
            </h2>
            <p style={{ ...typographyToStyle('body-lg'), color: color.text.secondary, lineHeight: '1.8' }}>
              Vi har ikke selv gjennomført studier, og vi påstår ikke å «vitenskapelig bevise» at
              to mennesker passer sammen. Det kan ingen plattform gjøre.
            </p>
            <p style={{ ...typographyToStyle('body-lg'), color: color.text.secondary, lineHeight: '1.8' }}>
              Det vi gjør, er å la etablerte, publiserte og gjentatte modeller veilede hva vi spør
              om og hvordan vi vekter det. Motoren er en veiviser, ikke en fasit.
            </p>
          </div>
        </ToSomSection>

        {/* ===== 2. DE SEKKS DIMENSJONENE ===== */}
        <ToSomSection spotlight="blue" className="px-6">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center mb-4" style={{ ...typographyToStyle('heading-lg'), color: color.text.primary }}>
              De seks dimensjonene
            </h2>
            <p
              className="max-w-3xl mx-auto text-center mb-10"
              style={{ ...typographyToStyle('body-lg'), color: color.text.secondary }}
            >
              Hver dimensjon har et instrument bak seg, og hver har en vekt som summerer til 100 %.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {DIMENSIONS.map((d) => (
                <ToSomCard key={d.name} title={d.name}>
                  <p style={{ ...typographyToStyle('body'), color: color.text.muted, marginBottom: '8px' }}>
                    Vekt: <span style={{ color: color.brand.gold, fontWeight: 600 }}>{d.weight}</span>
                  </p>
                  <p style={{ ...typographyToStyle('body'), color: color.text.secondary, lineHeight: '1.7' }}>
                    {d.why}
                  </p>
                </ToSomCard>
              ))}
            </div>
          </div>
        </ToSomSection>

        {/* ===== 3. INSTRUMENTENE ===== */}
        <ToSomSection spotlight="blue" className="px-6">
          <div
            className="mx-auto max-w-4xl space-y-8"
            style={{
              background: 'rgba(255,255,255,0.045)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '28px',
              padding: `${spacing.lg}px`,
            }}
          >
            <h2 style={{ ...typographyToStyle('heading-lg'), color: color.text.primary, textAlign: 'center' }}>
              Instrumentene vi bruker
            </h2>
            <div className="space-y-4">
              {INSTRUMENTS.map((i) => (
                <GlassCard key={i.name} padding="md" interactive className="space-y-2">
                  <div className="flex items-baseline justify-between gap-4">
                    <p style={{ ...typographyToStyle('heading-sm'), color: color.brand.gold }}>{i.name}</p>
                    <p style={{ ...typographyToStyle('body'), color: color.text.muted }}>{i.items} spørsmål</p>
                  </div>
                  <p style={{ ...typographyToStyle('body'), color: color.text.secondary }}>{i.source}</p>
                  {i.note && (
                    <p style={{ ...typographyToStyle('body'), color: color.text.muted, fontStyle: 'italic' }}>
                      {i.note}
                    </p>
                  )}
                </GlassCard>
              ))}
            </div>
          </div>
        </ToSomSection>

        {/* ===== 4. HVA RESONANS ER ===== */}
        <ToSomSection spotlight="blue" className="px-6">
          <div
            className="mx-auto max-w-3xl space-y-6"
            style={{
              background: 'rgba(255,255,255,0.045)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '28px',
              padding: `${spacing.lg}px`,
            }}
          >
            <h2 style={{ ...typographyToStyle('heading-lg'), color: color.text.primary }}>
              Hva resonans er — og hva den ikke er
            </h2>
            <p style={{ ...typographyToStyle('body-lg'), color: color.text.secondary, lineHeight: '1.8' }}>
              Resonans er et kvalitativt begrep hos oss. Det forteller deg hvor sterkt to profiler
              samsvarer på de seks dimensjonene — som et utgangspunkt, ikke et sluttresultat.
            </p>
            <p style={{ ...typographyToStyle('body-lg'), color: color.text.secondary, lineHeight: '1.8' }}>
              Resonans er ikke kjærlighet. Den er ikke en diagnose, ikke en bedømmelse av verdi, og
              ikke en garanti for at dere passer sammen. Den er en veiviser som hjelper to mennesker
              å vurdere om det verdt å gå videre — og å gjøre det med bevisstheten.
            </p>
          </div>
        </ToSomSection>

        {/* ===== 5. KILDER ===== */}
        <ToSomSection spotlight="blue" className="px-6">
          <div className="mx-auto max-w-3xl space-y-6">
            <h2 style={{ ...typographyToStyle('heading-lg'), color: color.text.primary, textAlign: 'center' }}>
              Kilder
            </h2>
            <GlassCard padding="lg" interactive>
              <ul className="space-y-3">
                <li style={{ ...typographyToStyle('body'), color: color.text.secondary }}>
                  Rammstedt, T., & John, O. P. (2007). Journal of Research in Personality, 41(1).
                </li>
                <li style={{ ...typographyToStyle('body'), color: color.text.secondary }}>
                  Bowlby, J. (1969). Attachment and Loss.
                </li>
                <li style={{ ...typographyToStyle('body'), color: color.text.secondary }}>
                  Ainsworth, M. D. S., Blehar, M. C., Waters, E., & Wall, S. (1978).
                  Patterns of Attachment.
                </li>
                <li style={{ ...typographyToStyle('body'), color: color.text.secondary }}>
                  Hazan, C., & Shaver, P. (1987). Journal of Personality and Social Psychology.
                </li>
                <li style={{ ...typographyToStyle('body'), color: color.text.secondary }}>
                  Wei, M., Russell, D., & Altman, O. (2007). Journal of Personality and Social
                  Psychology.
                </li>
                <li style={{ ...typographyToStyle('body'), color: color.text.secondary }}>
                  Schwartz, S. H. (1992). Advances in Experimental Social Psychology, 25.
                </li>
                <li style={{ ...typographyToStyle('body'), color: color.text.secondary }}>
                  Gross, J. J., & John, O. P. (2003). Journal of Personality and Social
                  Psychology, 85(2).
                </li>
                <li style={{ ...typographyToStyle('body'), color: color.text.secondary }}>
                  Gottman, J. M., & Levenson, R. W. (1992). Journal of Personality and Social
                  Psychology, 63(2).
                </li>
              </ul>
              <p
                style={{
                  ...typographyToStyle('body'),
                  color: color.text.muted,
                  marginTop: '16px',
                  fontStyle: 'italic',
                }}
              >
                Forfatter, verk og år er oppgitt. Direkte lenker til kildene blir bekreftet levende
                før publisering.
              </p>
            </GlassCard>
          </div>
        </ToSomSection>

        {/* ===== 6. HVA VI IKKE LOVER ===== */}
        <ToSomSection spotlight="blue" className="px-6">
          <div
            className="mx-auto max-w-3xl space-y-6"
            style={{
              background: 'rgba(255,255,255,0.045)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '28px',
              padding: `${spacing.lg}px`,
            }}
          >
            <h2 style={{ ...typographyToStyle('heading-lg'), color: color.text.primary }}>
              Hva vi ikke lover
            </h2>
            <ul className="space-y-3">
              {[
                'Vi lover ikke at du får en match, eller at den du får blir til et langsiktig parforhold.',
                'Vi lover ikke at scoringen er feilfri eller at den «beviser» at to personer passer sammen.',
                'Vi lover ikke at tersklene våre er ferdige kalibrert — de etterprøves etter betafasen.',
                'Vi lover at vi er ærlige om metoden, kildene og grensene for hva den kan.',
              ].map((line, idx) => (
                <li key={idx} className="flex gap-3">
                  <span style={{ color: color.brand.gold, flexShrink: 0 }}>•</span>
                  <span style={{ ...typographyToStyle('body-lg'), color: color.text.secondary, lineHeight: '1.7' }}>
                    {line}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </ToSomSection>

        {/* ===== CTA ===== */}
        <ToSomSection spotlight="cta" className="px-6 text-center space-y-6">
          <h2 style={{ ...typographyToStyle('heading-lg'), color: color.text.primary }}>
            Klar til å starte?
          </h2>
          <p style={{ ...typographyToStyle('body-lg'), color: color.text.secondary }}>
            Svarene dine veileder matchingen — du bestemmer alltid selv hvem du går videre med.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-4">
            <ToSomButton href="/register" variant="gold" size="xl">
              Start reisen
            </ToSomButton>
            <ToSomButton href="/login" variant="secondary" size="lg">
              Logg inn
            </ToSomButton>
          </div>
        </ToSomSection>

        {/* ===== FOOTER ===== */}
        <Footer />
      </div>
    </main>
  );
}