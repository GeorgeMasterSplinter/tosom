'use client';

/**
 * Tosom — Motpol (ACT MOTPOL)
 *
 * «Et annet svar på moderne dating» — siden som forklarer hvorfor Tosom
 * er bygget annerledes: én match om gangen, ingen sveiping, bilder først
 * på dag 8, et mer privat rom.
 *
 * Påstandsdisiplin (MOTPOL-PLAN-v1.0 §6): hver setning er typet i en
 * kodekommentar — PF (product fact), PH (philosophy), OB (observation),
 * MC (marketing copy). V1 har ZERO EF/RC: ingen eksterne faktapåstander,
 * ingen research claims (MOT-09).
 *
 * Design (plan §16/17/18): eksisterende designsystem, ingen nye
 * dependencies, ingen tung animasjon. Siden er statisk renderbar (mønster
 * fra /trygghet): ingen scroll-animasjon, så innholdet er fullt synlig
 * uten JS og med prefers-reduced-motion. Én ny komponent: ComparisonRows.
 *
 * Sannhetsgrunnlag (plan §5, F1–F13): alle PF-setninger stemmer med
 * vilkår/landing/engine — se kildeliste i planen.
 */

import Link from 'next/link';
import { Footer } from '@/components/ui/layout/Footer';
import { ToSomSection, ToSomButton } from '@/components/ui/system';
import { color, typographyToStyle } from '@/config/design-tokens';
import GlassCard from '@/components/ui/cards/GlassCard';
import { ComparisonRows } from '@/components/motpol/ComparisonRows';

/* ========================
   HELPERS
   ======================== */

/** Standardlenke-stil: gull, understreking som lysner ved hover. */
function InlineLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="underline decoration-[rgba(212,175,55,0.35)] decoration-1 underline-offset-4 hover:decoration-[#D4AF37] transition-all duration-300"
      style={{ color: color.brand.gold }}
    >
      {children}
    </Link>
  );
}

/** Prose-blokk: lesbar bredde (~65–75 ch), jevn rytme. */
function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {children}
    </div>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        ...typographyToStyle('body-lg'),
        color: 'rgba(255,255,255,0.85)',
        lineHeight: '1.8',
        letterSpacing: '0.2px',
      }}
    >
      {children}
    </p>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="mb-8"
      style={{
        ...typographyToStyle('heading-lg'),
        color: color.text.primary,
      }}
    >
      {children}
    </h2>
  );
}

/** Gull-sitateramme for MC-setninger. */
function Quote({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="border-l-2 pl-6"
      style={{
        ...typographyToStyle('body-lg'),
        color: 'rgba(212,175,55,0.9)',
        fontWeight: 600,
        fontStyle: 'italic',
        borderColor: 'rgba(212,175,55,0.4)',
        lineHeight: '1.7',
      }}
    >
      {children}
    </p>
  );
}

/* ========================
   SAMMENLIGNING (plan §8.13)
   --------------------------
   Venstresiden er generisk («en vanlig modell») — aldri en tjenestes
   navn, aldri «andre datingapper gjør …» som absolutt generalisering.
   Høyresiden: kun PF-påstander (F1–F8). Ingen betalingsrad (D2).
   ======================== */

const comparisonRows = [
  { standard: 'Mange profiler å vurdere', tosom: 'Én match om gangen' }, // PF
  { standard: 'Utseende før innhold', tosom: 'Samtalen først, bildet på dag 8' }, // PF
  { standard: 'Sveiping og øyeblikksvalg', tosom: 'Guidet 14-dagers reise' }, // PF
  { standard: 'Flere parallelle samtaler', tosom: 'Én aktiv reise' }, // PF
  { standard: 'Profilen er vitrine', tosom: 'Profilen er privat' }, // PF
];

const ikkeForDeg = [
  'Store utvalg av profiler å velge mellom',
  'Raske valg og rask respons',
  'Mange parallelle samtaler',
  'Bilder med en gang',
  'Primært casual kontakt',
];

const kanPasse = [
  'Et roligere tempo',
  'Én relasjon om gangen',
  'Vekt på samtalen fremfor bildet',
  'Tid til å bli kjent før dere møtes',
  'Et mer privat rom',
];

const prisene = [
  'Du kan måtte vente. Match er ikke garantert hver lørdag.', // PF
  'Du får ikke hundredvis av profiler å velge mellom. Du får én — eller ingen.', // PF
  'Du ser ikke bildet med en gang. Bildet kommer på dag 8.', // PF
  'Den første matchen trenger ikke å bli noe. Og da starter du på nytt.', // PH
  'Fysisk tiltrekning kan utebli. Det skjer, og vi skjuler det ikke.', // PH
  'Noen opplever tempoet som for langsomt. Det er en bevisst avgjørelse — og en pris.', // PH
];

/* ========================
   PAGE
   ======================== */

export default function MotpolPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Bakgrunn — Deep Blue gradient (mønster fra /hvorfor) */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, #0B1520 0%, #121E2E 50%, #0B1520 100%)',
        }}
      />

      <div className="relative z-10">

        {/* ===== 1. HERO ===== */}
        <section className="px-6 pt-24 pb-16 text-center min-h-[70vh] flex flex-col justify-center">
          <div
            className="mx-auto max-w-[780px] rounded-[28px] p-10 md:p-14 space-y-7"
            style={{
              background: 'rgba(255,255,255,0.045)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.20), 0 0 24px rgba(212,175,55,0.05)',
            }}
          >
            <h1
              style={{
                ...typographyToStyle('hero'),
                color: 'rgba(255,255,255,0.92)',
              }}
            >
              Motpol
            </h1>

            <p
              style={{
                ...typographyToStyle('heading-lg'),
                color: color.brand.gold,
              }}
            >
              Et annet svar på moderne dating.
            </p>

            {/* Lead [PH]: hovedtesen (plan §3) */}
            <p
              className="max-w-2xl mx-auto"
              style={{
                ...typographyToStyle('body-lg'),
                color: 'rgba(255,255,255,0.88)',
                lineHeight: '1.7',
                letterSpacing: '0.25px',
              }}
            >
              Digitale datingtjenester har gjort det enklere enn noen gang å møte
              mennesker. Vi stiller et annet spørsmål: hva om du ikke vises flest
              mulig mennesker — men i stedet får ro til å bli kjent med én?
            </p>

            {/* [MC] tone-setning */}
            <p
              style={{
                ...typographyToStyle('body-sm'),
                color: 'rgba(212,175,55,0.75)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              Ikke mer dating. Mindre støy rundt det å bli kjent.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              {/* «Start reisen» fjernet fra hero 24.10.2026 (godkjent av George) —
                  CTA-knappen nederst på siden er uendret. */}
              {/* Bakgrunn lik «Logg inn»-knappen i menyen (glass, ikke svart) */}
              <ToSomButton
                href="#hva-er-motpol"
                variant="dark"
                size="lg"
                style={{ background: 'rgba(255,255,255,0.04)' }}
              >
                Se hvorfor
              </ToSomButton>
            </div>
          </div>
        </section>

        {/* ===== 2–13. 12 innholdsseksjoner — 2-kolonnes grid, 6 rader, på lg
            (laptop/PC), én kolonne under. 24.10.2026, godkjent av George.
            DOM-rekkefølgen 2→13 og copy er uendret. ===== */}
        <ToSomSection spotlight="none">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">

            {/* ===== 2. HVORDAN KOM VI HIT? ===== */}
            <div id="hva-er-motpol" className="scroll-mt-24">
              <GlassCard padding="xl" className="h-full">
            <H2>Hvordan kom vi hit?</H2>
            <Prose>
              {/* [OB] */}
              <P>
                Mange digitale tjenester byr på det samme: store utvalg av
                profiler, rask vurdering, mange parallelle samtaler. For mange
                fungerer det fint. For andre blir det støy.
              </P>
              {/* [PH] */}
              <P>
                Vi opplever at høyt tempo, mange valg og raske vurderinger ikke
                passer måten noen ønsker å bli kjent på. Derfor bygger vi
                motsatt.
              </P>
              {/* [MC] */}
              <Quote>
                Ikke fordi det andre gjør er feil. Fordi vi tror at én annen vei
                kan passe deg bedre.
              </Quote>
            </Prose>
              </GlassCard>
            </div>

        {/* ===== 3. MER ER IKKE ALLTID MER ===== */}
          <GlassCard padding="xl">
            <H2>Mer er ikke alltid mer</H2>
            <Prose>
              {/* [OB] */}
              <P>
                I mange datingtjenester er målet å vise deg så mange profiler som
                mulig. Målet vårt er det stikk motsatte: å gi én mulighet en
                faktisk sjanse.
              </P>
              {/* [PF] F1 */}
              <P>
                Hos oss sveiper du ikke. Du kan ikke «se nærmere» på hundredvis
                av profiler. Du kan kun ha én aktiv reise om gangen.
              </P>
              {/* [PH] */}
              <P>
                Hver gang du vurderer én person mens ti andre venter på
                likningen, deler du oppmerksomheten. Vi har valgt bort sveiping
                fordi produktet vårt optimaliseres ikke for hvor mange profiler
                du rekker å se — men for om én samtale faktisk blir til noe.
              </P>
            </Prose>
          </GlassCard>

        {/* ===== 4. DERFOR ÉN MATCH OM GANGEN ===== */}
          <GlassCard padding="xl">
            <H2>Derfor én match om gangen</H2>
            <Prose>
              {/* [PF] F2 */}
              <P>
                Natt til lørdag forsøker vi å finne én person som passer deg. Én
                person — ikke ti.
              </P>
              {/* [PH] */}
              <P>
                Én person om gangen betyr mindre sammenligning, ingen
                matchsamling, og én samtale du kan legge energi i.
              </P>
              {/* [PF] F3 — sannhetsmodellen: ikke garantert, kø, ingen tilfeldig kobling */}
              <P>
                Vi forsikrer ikke om at du får en match hver uke. Finner vi ingen
                god nok, venter du til neste runde.
              </P>
              {/* [MC] */}
              <Quote>Vi vil heller la deg vente enn å koble deg tilfeldig.</Quote>
              {/* [PH] */}
              <P>For oss er en dårlig kobling verdt mindre enn ingen kobling.</P>
            </Prose>
          </GlassCard>

        {/* ===== 5. DERFOR DEN FØRSTE UKEN UTEN BILDER ===== */}
          <GlassCard padding="xl">
            <H2>Derfor er den første uken uten bilder</H2>
            <Prose>
              {/* [PH] */}
              <P>
                Fysisk tiltrekning betyr noe. Vi forsøker ikke å late som noe
                annet. Forskjellen er rekkefølgen.
              </P>
              {/* [OB] */}
              <P>
                I mange digitale tjenester begynner vurderingen med bildet: bilde
                → vurdering → kanskje samtale → kanskje menneske.
              </P>
              {/* [PF] F5 — lenke: /reisen (plan §14) */}
              <P>
                Hos oss åpnes bildene først på dag 8. Den første uken
                bygger dere på ord — <InlineLink href="/reisen">les om reisen</InlineLink>.
              </P>
              {/* [PH] */}
              <P>
                Når bildet kommer, kommer det ikke til to fremmede — men til to
                som allerede har noe.
              </P>
            </Prose>
          </GlassCard>

        {/* ===== 6. MEN UTSEENDE BETYR JO NOE? ===== */}
          <GlassCard padding="xl">
            <H2>Men utseende betyr jo noe?</H2>
            <Prose>
              {/* [PH] — ærlig trade-off (obligatorisk, plan §29.7) */}
              <P>
                Ja. To mennesker kan bruke to uker på å bli kjent, og deretter
                oppdage at den fysiske tiltrekningen ikke er der. Det er en reell
                pris ved måten vi gjør det — og vi skjuler den ikke.
              </P>
              {/* [PH] */}
              <P>
                Likevel velger vi rekkefølgen. Grunnen: vi tror at et inntrykk
                bygget på ord er lettere å forstå enn et inntrykk bygget på et
                bilde. Og at det er lettere å si nei til noe som mangler enn å
                forklare hvorfor ansiktet ikke var rett.
              </P>
              {/* [MC] — låst formulering (D6) */}
              <Quote>Ja, utseende betyr noe. Derfor kommer bildet. Bare ikke først.</Quote>
            </Prose>
          </GlassCard>

        {/* ===== 7. TO MENNESKER, IKKE TO PROFILER ===== */}
          <GlassCard padding="xl">
            <H2>To mennesker, ikke to profiler</H2>
            <Prose>
              {/* [OB] */}
              <P>
                I store, åpne tjenester er profilen utgangspunktet: den optimale
                teksten, det beste bildet, filterene som fanger flest øyne. Noen
                profiler er også misvisende, manipulerte eller fullstendig
                oppdiktede — og noen av bildene er laget av maskiner.
              </P>
              {/* [PF] F8 — lenke: /slik-fungerer-det (plan §14) */}
              <P>
                Hos oss er profilen privat. Den vises aldri offentlig, og den
                andre ser bare et begrenset utvalg — fornavn og alder fra start,
                mer når dere velger. <InlineLink href="/slik-fungerer-det">Slik fungerer det</InlineLink>.
              </P>
              {/* [PH] — ingen evne-påstander (plan §29.5) */}
              <P>
                Vi kan ikke love at alle profiler er like sanne — ingen
                plattform kan det. Men vi kan si hva vi har valgt: her er ingen
                profil et vitrinasjestykke. Den er utgangspunkt for en samtale
                mellom to som allerede har snakket.
              </P>
              {/* [PF] F11 — lenke: /vilkar (plan §14) */}
              <P>
                <InlineLink href="/vilkar">Vilkårene våre</InlineLink> forventer
                at opplysningene er riktige, og at innholdet er respektfullt.
              </P>
            </Prose>
          </GlassCard>

        {/* ===== 8. INTENSJON FREMFOR OPPMERKSOMHET ===== */}
          <GlassCard padding="xl">
            <H2>Intensjon fremfor oppmerksomhet</H2>
            <Prose>
              {/* [OB] */}
              <P>
                I mange digitale rom blandes mange intensjoner: seriøse
                relasjoner, casual kontakt, bare samtale, bekreftelse,
                oppmerksomhet, markedsføring. Ingen av dem er per seg feil — men
                de føles ulikt når man ikke vet hva man møter.
              </P>
              {/* [PH] */}
              <P>
                Vi har ikke en knapp som filtrerer intensjon — ingen plattform
                har det. Men vi bygger rommet slik at én intensjon blir
                tydeligst: å undersøke om noe finnes mellom to bestemte
                mennesker. Her kommer du ikke for å bygge et publikum. Du kommer
                for å se én person.
              </P>
              {/* [MC] — låst formulering (sluttgodkjent av George, 24.10.2026) */}
              <Quote>Her kommer du for å se én person, og selv bli sett av én.</Quote>
              {/* [PF] F11 — lenke: /vilkar (plan §14) */}
              <P>
                Markedsføring, salg og innsamling er uttrykkelig forbudt i{' '}
                <InlineLink href="/vilkar">vilkårene våre</InlineLink>.
              </P>
            </Prose>
          </GlassCard>

        {/* ===== 9. TEKNOLOGIEN HjELPER — DEN SNAKKER IKKE FOR DERE ===== */}
          <GlassCard padding="xl">
            <H2>Teknologien hjelper — den snakker ikke for dere</H2>
            <Prose>
              {/* [PF] F7/F4 — lenke: /metoder (plan §14) */}
              <P>
                Matchingmotoren vår ser på seks dimensjoner — verdier,
                tilknytning, personlighet, kommunikasjon, emosjonsregulering og
                livssituasjon — og de praktiske grensene dere har satt. Motoren
                bruker aldri bilder eller utseende.{' '}
                <InlineLink href="/metoder">Se metoden</InlineLink>.
              </P>
              {/* [PH] F13 — veiviser, ikke kjærlighetsmaskin */}
              <P>
                Motoren er en veiviser, ikke en kjærlighetsmaskin. Den reduserer
                åpenbare konflikter og prøver å finne én person det kan være verdt
                å bli kjent med. Den kan ikke forutsi om dere vil forelske dere —
                det lover vi ikke.
              </P>
              {/* [PF] F10 — regelstyrt; ingen AI i kommunikasjonen */}
              <P>
                Det som skrives i chatten er av dere. Reisen er regelstyrt og lik
                for alle; det finnes ingen AI som skriver meldinger, gir råd eller
                opptar som samtalepartner.
              </P>
              {/* [MC] */}
              <Quote>Teknologien kan hjelpe dere å møtes. Den skal ikke snakke for dere.</Quote>
            </Prose>
          </GlassCard>

        {/* ===== 10. TRYGGERE BETYR IKKE RISIKOFRITT ===== */}
          <GlassCard padding="xl">
            <H2>Tryggere betyr ikke risikofritt</H2>
            <Prose>
              {/* [PH] */}
              <P>
                Ingen digital tjeneste kan garantere at alle mennesker er like
                gode som de fremstår. Vi lover ikke det.
              </P>
              {/* [PF] F9 — kun oppsummering; lenke: /trygghet (plan §14) */}
              <P>
                Det vi kan: en privat profilmodell, rapportering, blokkering,
                muligheten til å avslutte reisen, og gradvis bildedeling. En
                rapport går rett til oss —{' '}
                <InlineLink href="/trygghet">les om tryggheten</InlineLink>.
              </P>
              {/* [PH] */}
              <P>
                Trygghet er hos oss et utgangspunkt for designet — ikke et merke
                på pakken.
              </P>
            </Prose>
          </GlassCard>

        {/* ===== 11. ET ANNET SYSTEM HAR OGSÅ EN PRIS ===== */}
          <GlassCard padding="xl">
            <H2>Et annet system har også en pris</H2>
            <Prose>
              {/* [PH] */}
              <P>
                Vi er ærlige om hva prisene er, fordi vi tror du fortjener å vite
                hva du bytter:
              </P>
              {/* [PF/PH] per punkt (se prisene[]) */}
              <div className="space-y-3">
                {prisene.map((line, i) => (
                  <p
                    key={i}
                    style={{
                      ...typographyToStyle('body'),
                      color: 'rgba(255,255,255,0.85)',
                      lineHeight: '1.6',
                    }}
                  >
                    <span style={{ color: color.brand.gold }} className="mr-3">
                      ✦
                    </span>
                    {line}
                  </p>
                ))}
              </div>
              {/* [MC] */}
              <Quote>
                Vi presenterer dette ikke som svakheter. Det er konsekvenser av
                valgene — de samme valgene som gir deg ro.
              </Quote>
            </Prose>
          </GlassCard>

        {/* ===== 12. TOSOM PASSER IKKE FOR ALLE ===== */}
          <GlassCard padding="xl">
            <H2>Tosom passer ikke for alle</H2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
              <GlassCard padding="lg" className="space-y-5">
                <h3
                  style={{
                    ...typographyToStyle('heading-sm'),
                    color: 'rgba(255,255,255,0.85)',
                  }}
                >
                  Tosom passer sannsynligvis ikke for deg hvis du vil ha:
                </h3>
                <ul className="space-y-3">
                  {ikkeForDeg.map((item) => (
                    <li
                      key={item}
                      style={{
                        ...typographyToStyle('body'),
                        color: 'rgba(255,255,255,0.75)',
                        lineHeight: '1.6',
                      }}
                    >
                      <span style={{ color: 'rgba(255,255,255,0.35)' }} className="mr-3">
                        —
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </GlassCard>
              <GlassCard padding="lg" gold className="space-y-5">
                <h3
                  style={{
                    ...typographyToStyle('heading-sm'),
                    color: color.brand.gold,
                  }}
                >
                  Tosom kan passe bedre hvis du vil ha:
                </h3>
                <ul className="space-y-3">
                  {kanPasse.map((item) => (
                    <li
                      key={item}
                      style={{
                        ...typographyToStyle('body'),
                        color: 'rgba(255,255,255,0.88)',
                        lineHeight: '1.6',
                      }}
                    >
                      <span style={{ color: color.brand.gold }} className="mr-3">
                        ✦
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </div>
            <div className="mt-10">
              <Prose>
                {/* [MC] — lenke: /hvorfor (plan §14) */}
                <p
                  className="text-center"
                  style={{
                    ...typographyToStyle('body'),
                    color: 'rgba(255,255,255,0.65)',
                    lineHeight: '1.7',
                  }}
                >
                  Ingen av sidene er bedre enn den andre. De er bare ulike. Velg
                  den som matcher hva du egentlig søker. Mer om hvem vi er for,
                  står på <InlineLink href="/hvorfor">hvorfor-siden</InlineLink>.
                </p>
              </Prose>
            </div>
          </GlassCard>

            {/* ===== 13. DE TO MODELLERNE ===== */}
            <GlassCard padding="xl">
              <H2>To måter å gjøre det på.</H2>
              {/* [PF] per rad (se comparisonRows[]) */}
              <ComparisonRows rows={comparisonRows} />
            </GlassCard>
          </div>
        </ToSomSection>

        {/* ===== 14. CTA ===== */}
        <ToSomSection spotlight="cta" className="px-6 text-center">
          <div className="mx-auto max-w-md space-y-8">
            {/* [MC] */}
            <h2
              style={{
                ...typographyToStyle('heading-lg'),
                color: color.text.primary,
              }}
            >
              Vil du prøve en annen måte?
            </h2>
            <ToSomButton href="/register" variant="gold" size="xl">
              Start reisen
            </ToSomButton>
            <div>
              <ToSomButton href="/metoder" variant="dark" size="lg">
                Lær mer om metoden
              </ToSomButton>
            </div>
          </div>
        </ToSomSection>

        {/* ===== FOOTER ===== */}
        <Footer />
      </div>
    </main>
  );
}
