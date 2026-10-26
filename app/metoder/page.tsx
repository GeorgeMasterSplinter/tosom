'use client';

/**
 * ToSom — Metoder vi bruker
 *
 * Vi sier det vi gjør. Denne siden dokumenterer (oppdatert ACT F1, 24.10.2026):
 *  1. Bakgrunn for spørsmålene — etablert psykologi som utgangspunkt, vår egen matchingmodell
 *  2. De seks områdene: rammeverk vs egne spørsmål vs praktiske preferanser
 *  3. Spørsmålene vi stiller — hva som er etablert, tilpasset eller vårt eget
 *  4. Hva resonans er — Tosoms merkebegrep, ikke et publisert instrument
 *  5. Hva modellen kan hjelpe med — og hva den ikke kan vite
 *  6. Psykometrisk avgrensning (ingen egen dokumentert validitet)
 *  7. Kilder (kun verifiserte DOI-kilder, se docs/METHODS-SCIENTIFIC-AUDIT-v1.0.md)
 *  8. Hva vi ikke lover
 *
 * Språk: «rammeverk vi bygger på», «egne spørsmål», «en veiviser» —
 * aldri «vitenskapelig bevist», «en fasit» eller feil instrumentnavn.
 * PVQ/ERQ/ECR brukes ikke. Personlighet V2 (ACT F2, 2026-10-24): Tosoms egne
 * spørsmål inspirert av Big Five-rammeverket — det gamle, nært kopierte
 * itemssettet er utfaset; ingen validitetspåstander i aktiv copy.
 */

import { Footer } from '@/components/ui/layout/Footer';
import { ResonanceLogo } from '@/components/branding/LogoVariants';
import { ToSomSection, ToSomButton } from '@/components/ui/system';
import { color, spacing, typographyToStyle } from '@/config/design-tokens';
import GlassCard from '@/components/ui/cards/GlassCard';
import GoldPulseIcon from '@/components/ui/feedback/GoldPulseIcon';

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
    why: 'Det som betyr noe for deg er fundamentet. Vi ser ikke om dere bruker de samme ordene — vi ser om det dere setter høyt harmonerer.',
    modern: 'Schwartz la grunnlaget for verdirammeverket i 1992, og det er fortsatt i bruk i moderne tverrkulturell forskning.',
  },
  {
    icon: <IconTilknytning />,
    name: 'Tilknytning',
    why: 'Hvordan du holder deg nær — og hvor mye du trenger å trekke deg vekk. Det er ikke om du «er trygg» eller ikke. Det er om dere kan være hos hverandre uten å miste dere selv.',
    modern: 'Bygget opp over tiår — fra tidlig barneforskning til voksenromantikk (Hazan & Shaver 1987; Fraley & Shaver 2000). Hvordan vi knytter oss, former hvordan vi elsker.',
  },
  {
    icon: <IconPersonlighet />,
    name: 'Personlighet',
    why: 'Alle har en rytme. Noen er stille, noen er fulle av energi. Vi ser om rytmen deres kan danne en melodi sammen — ikke om den er «riktig».',
    modern: 'Big Five er et utbredt rammeverk for å beskrive brede personlighetstrekk. Våre spørsmål bruker rammeverket som inspirasjon — ikke som test. Vi vekter verdier og tilknytning tyngst i modellen.',
  },
  {
    icon: <IconKommunikasjon />,
    name: 'Kommunikasjon',
    why: 'Hvordan dere snakker med hverandre når det er lett — og spesielt når det er vanskelig. Vi ser på hvordan dere reparerer, hvordan dere lytter, og hvordan dere holder ut uenighet.',
    modern: 'Hvordan par snakker med hverandre forutsier om forholdet holder (Gottman & Levenson 1992). Våre spørsmål er egne — bygget på prinsippene, ikke på Instituttets skjemaer.',
  },
  {
    icon: <IconEmosjon />,
    name: 'Emosjonsregulering',
    why: 'Hvordan du er i kroppen når det blir tungt. Ikke om du «bør» føle mindre — men om dere sammen kan være i det uten at det bryter dere.',
    modern: 'Et aktivt forskningsfelt (Gross 2015; Aldao et al. 2010).',
  },
  {
    icon: <IconLivssituasjon />,
    name: 'Livssituasjon',
    why: 'Praktisk resonans er undervurdert. Vilje til barn, avstand, røyking og hverdagsrytme setter en ramme for om en hverdag kan fungere.',
    modern: 'Praktiske preferanser, ikke et psykologisk instrument. Noen svar virker som harde grenser som overstyrer matchskåren.',
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
    name: 'Personlighet',
    source: 'Tosoms egne spørsmål inspirert av brede personlighetstrekk fra Big Five-rammeverket.',
    modern: 'Big Five er et utbredt rammeverk for å beskrive brede personlighetstrekk. Vi bruker rammeverket som inspirasjon — ikke som testinstrument.',
    note: 'Spørsmålene er laget for Tosoms matchingmodell og er ikke et standardisert eller klinisk personlighetsskjema. Resultatet brukes som et begrenset kompatibilitetssignal, ikke som en vurdering av hvem du er.',
  },
  {
    name: 'Tilknytning',
    source: 'Egne spørsmål inspirert av forskning på voksen tilknytning — særlig dimensjonene tilknytningsangst og tilknytningsunnvikelse.',
    modern: 'Bygger på tilknytningsteorien og forskning på voksenromantikk (Hazan & Shaver 1987; Fraley & Shaver 2000).',
    note: 'Ikke et publisert tilknytnings-skjema. Svarene danner ikke en diagnose eller en klinisk tilknytningskategori.',
  },
  {
    name: 'Verdier',
    source: 'Egne spørsmål inspirert av forskningen til Schwartz på grunnleggende menneskelige verdier (1992).',
    modern: 'Verdirammeverket er i bruk i moderne tverrkulturell forskning.',
    note: 'Ikke et publisert standardisert verdisjema — spørsmålene og skåringen er våre egne.',
  },
  {
    name: 'Emosjonsregulering',
    source: 'Egne spørsmål inspirert av emosjonsreguleringsforskningen (Gross & John 2003).',
    modern: 'Et aktivt felt (Aldao et al. 2010; Gross 2015).',
    note: 'Ikke et publisert regulerings-skjema — spørsmålene er våre egne.',
  },
  {
    name: 'Kommunikasjon',
    source: 'Egne spørsmål bygget på prinsipper fra Gottmans parforskning (Gottman & Levenson 1992).',
    note: 'Vi bruker ikke Gottman Institute sine skjemaer.',
  },
  {
    name: 'Livssituasjon',
    source: 'Praktiske preferanser: barn, avstand, røyking, livsrytme og lignende.',
    note: 'Ikke et psykologisk instrument. Noen svar fungerer som harde grenser (dealbreakers) som overstyrer matchskåren.',
  },
];

/* ========================
   KILDER
   ======================== */

const CLASSIC_SOURCES: Array<{ text: string; link: string }> = [
  { text: 'Hazan, C., & Shaver, P. (1987). Romantic love conceptualized as an attachment process. Journal of Personality and Social Psychology, 52(3), 511–519.', link: 'https://doi.org/10.1037/0022-3514.52.3.511' },
  { text: 'Gottman, J. M., & Levenson, R. W. (1992). Marital processes predictive of later dissolution: Behavior, physiology, and health. Journal of Personality and Social Psychology, 63(2), 221–233.', link: 'https://doi.org/10.1037/0022-3514.63.2.221' },
  { text: 'Schwartz, S. H. (1992). Universals in the content and structure of values: Theoretical advances and empirical tests in 20 countries. Advances in Experimental Social Psychology, 25, 1–65.', link: 'https://doi.org/10.1016/S0065-2601(08)60281-6' },
  { text: 'Fraley, R. C., & Shaver, P. R. (2000). Adult romantic attachment: Theoretical developments, emerging controversies, and unanswered questions. Review of General Psychology, 4(2), 132–158.', link: 'https://doi.org/10.1037/1089-2680.4.2.132' },
];

const MODERN_SOURCES: Array<{ text: string; link: string }> = [
  { text: 'Gross, J. J., & John, O. P. (2003). Individual differences in two emotion regulation processes: Implications for affect and relationships. Journal of Personality and Social Psychology, 85(2), 348–362.', link: 'https://doi.org/10.1037/0022-3514.85.2.348' },
  // PERSONALITY V2 (ACT F2): den tidligere kortformat-Big Five-kilden er fjernet
  // fra kildelista — den aktive personlighetsmodellen er Tosoms egne spørsmål.
  { text: 'Aldao, A., Nolen-Hoeksema, S., & Schweizer, S. (2010). Emotion-regulation strategies across psychopathology: A meta-analytic review. Clinical Psychology Review, 30(2), 217–237.', link: 'https://doi.org/10.1016/j.cpr.2009.11.004' },
  { text: 'Gross, J. J. (2015). Emotion regulation: Current status and future prospects. Psychological Inquiry, 26(1), 1–26.', link: 'https://doi.org/10.1080/1047840X.2014.940781' },
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
        <ToSomSection spotlight="blue" className="px-6 text-center space-y-6 flex flex-col justify-center min-h-[75vh]">
          <h1 style={{ ...typographyToStyle('hero'), color: color.text.primary }}>
            Metoder vi bruker
          </h1>
          <p
            className="max-w-2xl mx-auto"
            style={{ ...typographyToStyle('body-lg'), color: color.text.secondary, lineHeight: '1.8' }}
          >
            Tosom vurderer seks områder ved matchingen. Vi har ikke selv
            gjennomført studier. Her er hva vi gjør, og hva vi ikke lover.
          </p>

          {/* Standard ToSom-logo — rett under innledningen */}
          <ResonanceLogo className="mt-10" />
        </ToSomSection>

        {/* ===== 1. BAKGRUNN FOR SPØRSMÅLENE ===== */}
        <ToSomSection spotlight="blue" className="px-6">
          <div
            className="mx-auto max-w-3xl space-y-6"
            style={{
              background: 'rgba(255,255,255,0.045)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 18px 48px rgba(0,0,0,0.28), 0 0 40px rgba(212,175,55,0.16)',
              borderRadius: '28px',
              padding: `${spacing.lg}px`,
            }}
          >
            <h2 style={{ ...typographyToStyle('heading-lg'), color: color.text.primary }}>
              Bakgrunn for spørsmålene
            </h2>
            <p style={{ ...typographyToStyle('body-lg'), color: color.text.secondary, lineHeight: '1.8' }}>
              Tosom bruker kunnskap fra etablert psykologi som utgangspunkt for noen av
              spørsmålene. Men selve matchingen er vår egen modell.
            </p>
            <p style={{ ...typographyToStyle('body-lg'), color: color.text.secondary, lineHeight: '1.8' }}>
              Vi vet ikke om to mennesker kommer til å få kjemi, bli forelsket eller
              passe sammen i hverdagen. Det finner dere ut selv. Tosom prøver bare å
              finne én person det kan være verdt å bli kjent med.
            </p>
          </div>
        </ToSomSection>

        {/* ===== 2. DE SEKKS DIMENSJONENE ===== */}
        <ToSomSection spotlight="blue" className="px-6">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center mb-4" style={{ ...typographyToStyle('heading-lg'), color: color.text.primary }}>
              De seks områdene
            </h2>
            <p
              className="max-w-3xl mx-auto text-center mb-10"
              style={{ ...typographyToStyle('body-lg'), color: color.text.secondary }}
            >
              Seks områder. Noen bygger på etablerte psykologiske rammeverk,
              andre består av egne spørsmål og praktiske preferanser.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {DIMENSIONS.map((d) => (
                <GlassCard key={d.name} padding="lg" interactive className="space-y-3">
                  <div className="flex items-center gap-3">
                    <GoldPulseIcon size={40} className="flex-shrink-0">
                      {d.icon}
                    </GoldPulseIcon>
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
              Spørsmålene vi stiller
            </h2>
            <p style={{ ...typographyToStyle('body-lg'), color: color.text.secondary, lineHeight: '1.8' }}>
              Nå er ærligheten: ikke alle delene er publiserte instrumenter.
              Personligheten består av Tosoms egne spørsmål inspirert av brede
              personlighetstrekk fra Big Five-rammeverket — laget for vår
              matchingmodell, ikke et standardisert eller klinisk skjema.
              Tilknytning, verdier,
              emosjonsregulering og kommunikasjon består av egne spørsmål inspirert av
              forskningen. Livssituasjon består av praktiske preferanser.
              Under hvert spørsmålssett sier vi hva som er hva.
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
              boxShadow: '0 18px 48px rgba(0,0,0,0.28), 0 0 40px rgba(212,175,55,0.16)',
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
              Resonans er Tosoms navn på den samlede matchvurderingen. Det er et
              merkebegrep — ikke et etablert psykologisk instrument eller en klinisk skår.
            </p>
            <p style={{ ...typographyToStyle('body-lg'), color: color.text.secondary, lineHeight: '1.8' }}>
              Vår resonansmåling er ikke en kjærlighetsdiagnose. Den er ikke en bedømmelse av verdi.
              Den er et utgangspunkt — en veiviser som forteller om de to rytmene deres kan svinge sammen.
              Resten er opp til dere. Små, jevne steg i rett takt.
            </p>
          </div>
        </ToSomSection>

        {/* ===== 6. HVA MODELLEN KAN OG IKKE KAN ===== */}
        <ToSomSection spotlight="blue" className="px-6">
          <div
            className="mx-auto max-w-3xl space-y-6"
            style={{
              background: 'rgba(255,255,255,0.045)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 18px 48px rgba(0,0,0,0.28), 0 0 40px rgba(212,175,55,0.16)',
              borderRadius: '28px',
              padding: `${spacing.lg}px`,
            }}
          >
            <h2 style={{ ...typographyToStyle('heading-lg'), color: color.text.primary }}>
              Hva modellen kan hjelpe med — og hva den ikke kan vite
            </h2>
            <p style={{ ...typographyToStyle('body-lg'), color: color.text.secondary, lineHeight: '1.8' }}>
              Matchskåren bygger på det dere selv forteller oss. Derfor vet den noe —
              og vet noe den ikke kan vite.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p style={{ ...typographyToStyle('heading-sm'), color: color.brand.gold, marginBottom: '12px' }}>
                  Kan hjelpe med
                </p>
                <ul className="space-y-2">
                  {[
                    'respektere uttrykte preferanser og harde grenser',
                    'oppdage enkelte praktiske konflikter før dere møtes',
                    'sammenligne selvrapporterte mønstre i verdier, tilknytning, personlighet, kommunikasjon og emosjonsregulering',
                    'strukturere en kandidatvurdering med én tydelig veiviser',
                    'redusere noen åpenbare mismatch',
                  ].map((line, idx) => (
                    <li key={idx} className="flex gap-3">
                      <span style={{ color: color.brand.gold, flexShrink: 0 }}>•</span>
                      <span style={{ ...typographyToStyle('body'), color: color.text.secondary, lineHeight: '1.7' }}>
                        {line}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p style={{ ...typographyToStyle('heading-sm'), color: color.brand.gold, marginBottom: '12px' }}>
                  Kan ikke vite
                </p>
                <ul className="space-y-2">
                  {[
                    'om dere blir fysisk tiltrukket av hverandre',
                    'om kjemi oppstår',
                    'om dere forelsker dere',
                    'hvordan et fysisk møte oppleves',
                    'om et forhold vil vare',
                  ].map((line, idx) => (
                    <li key={idx} className="flex gap-3">
                      <span style={{ color: color.text.muted, flexShrink: 0 }}>–</span>
                      <span style={{ ...typographyToStyle('body'), color: color.text.secondary, lineHeight: '1.7' }}>
                        {line}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p style={{ ...typographyToStyle('body-lg'), color: color.text.secondary, lineHeight: '1.8' }}>
              Fysisk tiltrekning inngår ikke i matchskåren — Tosom forsøker ikke å
              beregne den. Matchingen kan redusere enkelte praktiske og relasjonelle
              konflikter. Om fysisk tiltrekning og kjemi oppstår, må dere finne det ut selv.
            </p>
            <p style={{ ...typographyToStyle('body-lg'), color: color.text.secondary, lineHeight: '1.8' }}>
              Tosom er ikke en klinisk tjeneste, og ingen av spørsmålene er en diagnose.
              Svarene er selvrapporterte mønstre og preferanser — de sier noe om dere
              slik dere opplever dere selv, ikke om helse eller sykdom.
            </p>
            <p style={{ ...typographyToStyle('body-lg'), color: color.text.secondary, lineHeight: '1.8' }}>
              Tosom har foreløpig ikke egne data som viser hvor godt modellen forutsier
              relasjonsutfall. Vi har ikke dokumentert reliabilitet, faktorstruktur,
              normering eller prediktiv validitet for spørsmålene, og tersklene er ikke
              kalibrert mot langsiktige utfall. Derfor bruker vi resultatet som en
              veiviser, ikke som et bevis.
            </p>
          </div>
        </ToSomSection>

        {/* ===== 7. KILDER ===== */}
        <ToSomSection spotlight="blue" className="px-6">
          <div className="mx-auto max-w-3xl space-y-8">
            <h2 style={{ ...typographyToStyle('heading-lg'), color: color.text.primary, textAlign: 'center' }}>
              Kilder
            </h2>
            <p
              className="max-w-3xl mx-auto text-center"
              style={{ ...typographyToStyle('body'), color: color.text.secondary, marginBottom: '8px' }}
            >
              Her finner du sentrale publikasjoner som ligger bak rammeverkene vi viser
              til. De dokumenterer teoriene og forskningen — ikke Tosoms egen
              matchingmodell.
            </p>

            <div>
              <p style={{ ...typographyToStyle('heading-sm'), color: color.brand.gold, marginBottom: '12px' }}>
                Klassiske modeller (1987–2000)
              </p>
              <GlassCard padding="lg" interactive>
                <ul className="space-y-3">
                  {CLASSIC_SOURCES.map((src, idx) => (
                    <li key={idx} style={{ ...typographyToStyle('body'), color: color.text.secondary }}>
                      <a
                        href={src.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: color.brand.gold, textDecoration: 'underline', textDecorationColor: 'rgba(212,175,55,0.4)', textUnderlineOffset: '3px' }}
                      >
                        {src.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </div>

            <div>
              <p style={{ ...typographyToStyle('heading-sm'), color: color.brand.gold, marginBottom: '12px' }}>
                Nyere forskning (2003–2015)
              </p>
              <GlassCard padding="lg" interactive>
                <ul className="space-y-3">
                  {MODERN_SOURCES.map((src, idx) => (
                    <li key={idx} style={{ ...typographyToStyle('body'), color: color.text.secondary }}>
                      <a
                        href={src.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: color.brand.gold, textDecoration: 'underline', textDecorationColor: 'rgba(212,175,55,0.4)', textUnderlineOffset: '3px' }}
                      >
                        {src.text}
                      </a>
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
              Alle kildene er publisert forskning, koblet til sin egen DOI.
              Klikk på en kilde for å åpne den.
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
                'Vi lover ikke at tersklene våre er ferdig kalibrert — de er fortsatt under etterprøving.',
                'Vi lover ikke at Tosom er en diagnostisk tjeneste — svarene er selvrapporterte mønstre og preferanser, ikke en vurdering av helse.',
                'Vi legger ikke kropp, utseende eller livsstil til grunn for å vurdere attraktivitet — livsstilsspørsmål teller bare der du selv har sagt at det betyr noe.',
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