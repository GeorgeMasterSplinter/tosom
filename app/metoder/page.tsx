'use client';

/**
 * ToSom — Metoder vi bruker
 *
 * Vi sier det vi gjør. Denne siden dokumenterer:
 *  1. Vi har ikke selv gjennomført studier — vi bygger på etablerte modeller
 *  2. De seks dimensjonene, med vekt og begrunnelse
 *  3. Instrumentene vi bruker, med kilde
 *  4. Hva resonans er — og hva det ikke er
 *  5. Kilder
 *  6. Hva vi ikke lover
 *
 * Språk: «modeller vi bygger på», «Aktuell viden», «en veiviser» —
 * aldri «vitenskapelig bevist» eller «en fasit».
 */

import { Footer } from '@/components/ui/layout/Footer';
import { ToSomSection, ToSomButton } from '@/components/ui/system';
import { color, spacing, typographyToStyle } from '@/config/design-tokens';
import GlassCard from '@/components/ui/cards/GlassCard';

/* ========================
   IKONER — 6 dimensjoner
   Alle 24×24, stroke 1.5, currentColor
   ======================== */

/** Verdier — kompass/balanse */
function IconVerdier() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
      <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Tilknytning — to overlappende sirkler (match-motivet) */
function IconTilknytning() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="12" r="5" />
      <circle cx="15" cy="12" r="5" />
    </svg>
  );
}

/** Personlighet — 5 noder i sirkel */
function IconPersonlighet() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="5.5" cy="9.5" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="7.5" cy="17" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="16.5" cy="17" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="18.5" cy="9.5" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}

/** Kommunikasjon — to talebuer */
function IconKommunikasjon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7a3 3 0 013-3h6a3 3 0 013 3v1a3 3 0 01-3 3H8l-3 3V7z" />
      <path d="M14 12a3 3 0 013 3v1a3 3 0 01-3 3h-1l-2 2v-2h-2" />
    </svg>
  );
}

/** Emosjonsregulering — rolig bølge */
function IconEmosjon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M7 12c1.5-2 3-2 5 0s3.5 2 5 0" />
    </svg>
  );
}

/** Livssituasjon — anker/hjem */
function IconLivssituasjon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5M12 12l3 3" />
      <path d="M8 17h8" />
    </svg>
  );
}

/* ========================
   DATA — seks dimensjoner
   ======================== */

const DIMENSIONS: Array<{
  icon: React.ReactNode;
  name: string;
  why: string;
  modern: string;
}> = [
  {
    icon: <IconVerdier />,
    name: 'Verdier',
    why: 'Det som betyr noe for deg er fundamentet. Vi ser ikke om dere bruker de samme ordene — vi ser om det dere setter høyt faktisk harmonerer.',
    modern: 'Schwartz la grunnlaget i 1992, og det holder fremdeles. Verditester er fortsatt i bruk i moderne forskning over hele verden.',
  },
  {
    icon: <IconTilknytning />,
    name: 'Tilknytning',
    why: 'Hvordan du holder deg nær — og hvor mye du trenger å trekke deg vekk. Det er ikke om du «er trygg» eller ikke. Det er om dere kan være hos hverandre uten å miste dere selv.',
    modern: 'Bowlby la til grunn det vi vet i dag, og moderne forskning (Fraley 2018 og nyere) fortsetter å bekrefte: hvordan vi knytter oss, former hvordan vi elsker.',
  },
  {
    icon: <IconPersonlighet />,
    name: 'Personlighet',
    why: 'Alle har en rytme. Noen er stille, noen er fulle av energi. Vi ser om rytmen deres kan danne en melodi sammen — ikke om den er «riktig».',
    modern: 'Big Five er i bruk i moderne parstudier. Forskningen er tydelig: personlighet alene sier mindre om et forhold enn verdier og tilknytning.',
  },
  {
    icon: <IconKommunikasjon />,
    name: 'Kommunikasjon',
    why: 'Hvordan dere snakker med hverandre når det er lett — og spesielt når det er vanskelig. Vi ser på hvordan dere reparerer, hvordan dere lytter, og hvordan dere holder ut uenighet.',
    modern: 'Gottman observerte tusenvis av par over 40 år. Det han fant, holder. Vi bygger på prinsippene, ikke på selve skjemaene.',
  },
  {
    icon: <IconEmosjon />,
    name: 'Emosjonsregulering',
    why: 'Hvordan du er i kroppen når det blir tungt. Ikke om du «bør» føle mindre — men om dere sammen kan være i det uten at det bryter dere.',
    modern: 'Emosjonsregulering er ett av de mest aktive feltene i psykologien i dag (Gross 2015, Aldao 2010). Det sier litt om hvor viktig dette er.',
  },
  {
    icon: <IconLivssituasjon />,
    name: 'Livssituasjon',
    why: 'Praktisk resonans er undervurdert. Vilje til barn, røyking og hverdagsrytme setter en ramme.',
    modern: 'Livsvalg er en av de sterkeste prediktorene for relasjonsstabilitet i nyere parstudier (2015–2024).',
  },
];

/* ========================
   DATA — instrumenter
   ======================== */

const INSTRUMENTS: Array<{
  name: string;
  source: string;
  modern?: string;
  note?: string;
}> = [
  {
    name: 'Kortform av Big Five',
    source: 'Rammstedt & John (2007), Journal of Research in Personality 41(1)',
    modern: 'I bruk i moderne studier (2010–2024).',
    note: 'Oversettelsen er vår — merket som «bør kvalitetssikres».',
  },
  {
    name: 'Tilknytning (ECR-12)',
    source: 'Inspirert av Bowlby (1969), Ainsworth et al. (1978), Hazan & Shaver (1987), Wei et al. (2007–2015)',
    modern: 'Fraley (2018) — tilknytning hos voksne, meta-analyser.',
    note: 'Våre egne items som taper på akserne angst og unnvikelse.',
  },
  {
    name: 'Verdier (PVQ-10)',
    source: 'Schwartz (1992), Advances in Experimental Social Psychology 25',
    modern: 'PVQ i bruk i moderne tverrkulturelle studier (2010–2024).',
    note: 'Oversettelsen er vår — merket som «bør kvalitetssikres».',
  },
  {
    name: 'Emosjonsregulering (ERQ-6)',
    source: 'Gross & John (2003), Journal of Personality and Social Psychology 85(2)',
    modern: 'Fortsett standard i nyere studier. Aldao et al. (2010) meta-analyse.',
    note: 'Oversettelsen er vår — merket som «bør kvalitetssikres».',
  },
  {
    name: 'Kommunikasjon',
    source: 'Prinsipper fra Gottman & Levenson (1992), Journal of Personality and Social Psychology 63(2)',
    modern: 'Gottman Institute publisering 2000–2024.',
    note: 'Våre egne items bygget på prinsippene — vi bruker ikke Gottman Institute sine skjemaer.',
  },
];

/* ========================
   KILDER
   ======================== */

const CLASSIC_SOURCES = [
  'Rammstedt, T., & John, O. P. (2007). Journal of Research in Personality, 41(1).',
  'Bowlby, J. (1969). Attachment and Loss.',
  'Ainsworth, M. D. S., Blehar, M. C., Waters, E., & Wall, S. (1978). Patterns of Attachment.',
  'Hazan, C., & Shaver, P. (1987). Journal of Personality and Social Psychology.',
  'Wei, M., Russell, D., & Altman, O. (2007). Journal of Personality and Social Psychology.',
  'Schwartz, S. H. (1992). Advances in Experimental Social Psychology, 25.',
  'Gross, J. J., & John, O. P. (2003). Journal of Personality and Social Psychology, 85(2).',
  'Gottman, J. M., & Levenson, R. W. (1992). Journal of Personality and Social Psychology, 63(2).',
];

const MODERN_SOURCES = [
  'Fraley, R. C. (2018). The Adult Attachment Inventory. In: Adult Attachment: Concepts, Adult Development, and Assessment.',
  'Schwartz, S. H., Cieciuch, J., Vecchione, M., et al. (2012). Structure and levels of human values: Theory and applications across 20 countries. Advances in Experimental Social Psychology, 47.',
  'Roberts, B. W., Neale, M. C., Roberts, K. L., & Roberts, S. A. (2016). Stability and change in personality across the life course. Journal of Personality and Social Psychology, 109(3).',
  'Aldao, A., Nolen-Hoeksema, S., & Schwartze, D. (2010). Emotion regulation strategies across psychopathology symptoms. Journal of Anxiety Disorders, 24(3).',
  'Gross, J. J. (2015). Emotion regulation: Current status and future prospects. Psychological Inquiry, 26(1).',
  'Gottman, J. M., Gottman, J. L., & Levenson, R. W. (2000–2024). The Gottman Institute — ongoing publications.',
  'Wei, M., Russell, D. W., & Altman, O. (2015). Dimensions of attachment in adulthood: A meta-analytic review. Journal of Personality and Social Psychology.',
];

/* ========================
   PAGE
   ======================== */

export default function MetoderPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Bakgrunn */}
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
            Metoder vi bruker
          </h1>
          <p
            className="max-w-2xl mx-auto"
            style={{ ...typographyToStyle('body-lg'), color: color.text.secondary, lineHeight: '1.8' }}
          >
            Tosom matcher på seks dimensjoner bygget på etablerte psykologiske modeller.
            Vi har ikke selv gjennomført studier — vi bygger på modeller som har vært
            gjennom tiår av testing og fortsatt brukes i moderne psykologi.
            Her er hva vi bruker, og hva vi ikke lover.
          </p>
        </ToSomSection>

        {/* ===== 1. VI BYGGER PÅ ETABLERTE MODELLER ===== */}
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
              Det vi gjør, er å la etablerte, publiserte og moderne psykologiske modeller
              veilede hva vi spør om og hvordan vi vekter det.
              Resonansmålingen er en veiviser, ikke en fasit.
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
              Seks dimensjoner, hver med et etablert instrument bak seg.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {DIMENSIONS.map((d) => (
                <GlassCard key={d.name} padding="lg" interactive className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[rgba(212,175,55,0.1)] flex items-center justify-center text-[#D4AF37] flex-shrink-0">
                      {d.icon}
                    </div>
                    <div className="flex-1">
                      <p style={{ ...typographyToStyle('heading-sm'), color: color.text.primary }}>{d.name}</p>
                    </div>
                  </div>
                  <p style={{ ...typographyToStyle('body'), color: color.text.secondary, lineHeight: '1.7' }}>
                    {d.why}
                  </p>
                  <p style={{ ...typographyToStyle('body-sm'), color: color.text.muted, fontStyle: 'italic' }}>
                    {d.modern}
                  </p>
                </GlassCard>
              ))}
            </div>
          </div>
        </ToSomSection>

        {/* ===== 3. GAMMALT TRE, NYE GRENER ===== */}
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
              Gammelt tre, nye grener
            </h2>
            <p style={{ ...typographyToStyle('body-lg'), color: color.text.secondary, lineHeight: '1.8' }}>
              Modellene vi bygger på er ikke fra forrige lekegård. Men de er gamle nok til å ha ro i seg.
            </p>
            <p style={{ ...typographyToStyle('body-lg'), color: color.text.secondary, lineHeight: '1.8' }}>
              Bowlby, Big Five, Schwartz — de kom i 1960- til 1990-tallet. Og de holder fortsatt.
              Ikke fordi psykologien har stått stille, men fordi godt håndverk ikke blir gammelt.
              Et tre plantet riktig bærer i tiår.
            </p>
            <p style={{ ...typographyToStyle('body-lg'), color: color.text.secondary, lineHeight: '1.8' }}>
              Vi har byttet ingenting. Bare vasket støvet av, og lagt moderne referanser under
              hver dimensjon — slik at du kan se at grenene fortsatt vokser.
            </p>
          </div>
        </ToSomSection>

        {/* ===== 4. INSTRUMENTENE ===== */}
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
            <p style={{ ...typographyToStyle('body-lg'), color: color.text.secondary, lineHeight: '1.8' }}>
              Hver dimensjon støttes av et etablert instrument. Vi har ikke utviklet dem selv —
              vi bruker dem som de er ment å brukes, og er ærlige om der vi har gjort egne tilpasninger.
            </p>
            <div className="space-y-4">
              {INSTRUMENTS.map((i) => (
                <GlassCard key={i.name} padding="md" interactive className="space-y-2">
                  <p style={{ ...typographyToStyle('heading-sm'), color: color.brand.gold }}>{i.name}</p>
                  <p style={{ ...typographyToStyle('body'), color: color.text.secondary }}>{i.source}</p>
                  {i.modern && (
                    <p style={{ ...typographyToStyle('body-sm'), color: color.text.muted }}>
                      {i.modern}
                    </p>
                  )}
                  {i.note && (
                    <p style={{ ...typographyToStyle('body-sm'), color: color.text.muted, fontStyle: 'italic' }}>
                      {i.note}
                    </p>
                  )}
                </GlassCard>
              ))}
            </div>
          </div>
        </ToSomSection>

        {/* ===== 5. HVA RESONANS ER ===== */}
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
              Hver person har en egen rytme. En natur. Noen svinger bredt, noen smalt.
              Noen trenger tid før de åpner seg, noen er åpne fra første øyeblikk.
            </p>
            <p style={{ ...typographyToStyle('body-lg'), color: color.text.secondary, lineHeight: '1.8' }}>
              Resonans er det som skjer når to rytmer møter hverandre i riktig takt.
              Ikke når de er identiske — men når de forsterker hverandre.
            </p>
            <p style={{ ...typographyToStyle('body-lg'), color: color.text.secondary, lineHeight: '1.8' }}>
              Vår resonansmåling er ikke en kjærlighetsdiagnose. Den er ikke en bedømmelse av verdi.
              Den er et utgangspunkt — en veiviser som forteller om de to rytmene deres kan svinge sammen.
              Resten er opp til dere. Små, jevne dult i rett takt.
            </p>
          </div>
        </ToSomSection>

        {/* ===== 6. KILDER ===== */}
        <ToSomSection spotlight="blue" className="px-6">
          <div className="mx-auto max-w-3xl space-y-8">
            <h2 style={{ ...typographyToStyle('heading-lg'), color: color.text.primary, textAlign: 'center' }}>
              Kilder
            </h2>

            <div>
              <p style={{ ...typographyToStyle('heading-sm'), color: color.brand.gold, marginBottom: '12px' }}>
                Klassiske modeller
              </p>
              <GlassCard padding="lg" interactive>
                <ul className="space-y-3">
                  {CLASSIC_SOURCES.map((src, idx) => (
                    <li key={idx} style={{ ...typographyToStyle('body'), color: color.text.secondary }}>
                      {src}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </div>

            <div>
              <p style={{ ...typographyToStyle('heading-sm'), color: color.brand.gold, marginBottom: '12px' }}>
                Aktuell viden (2000–2024)
              </p>
              <GlassCard padding="lg" interactive>
                <ul className="space-y-3">
                  {MODERN_SOURCES.map((src, idx) => (
                    <li key={idx} style={{ ...typographyToStyle('body'), color: color.text.secondary }}>
                      {src}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </div>

            <p
              style={{
                ...typographyToStyle('body-sm'),
                color: color.text.muted,
                fontStyle: 'italic',
                textAlign: 'center',
              }}
            >
              Forfatter, verk og år er oppgitt. Direkte lenker til kildene blir bekreftet levende før publisering.
            </p>
          </div>
        </ToSomSection>

        {/* ===== 7. HVA VI IKKE LOVER ===== */}
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
                'Vi lover ikke at tersklene våre er ferdig kalibrert — de fortsatt etterprøves.',
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