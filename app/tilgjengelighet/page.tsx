import Link from 'next/link';
import { Footer } from '@/components/ui/layout/Footer';
import GlassCard from '@/components/ui/cards/GlassCard';
import { ToSomSection } from '@/components/ui/system';
import { typographyToStyle } from '@/config/design-tokens';

export const metadata = {
  title: 'Tilgjengelighet — ToSom',
  description: 'ToSom er bygget for alle. Her er hva vi har på plass og hva vi jobber med.',
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <GlassCard className="mb-6">
      <h2 className="mb-4" style={{ ...typographyToStyle('heading-md'), color: 'rgba(255,255,255,0.85)' }}>
        {title}
      </h2>
      {children}
    </GlassCard>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-start gap-3 text-sm leading-relaxed"
          style={{ color: 'rgba(255,255,255,0.6)' }}
        >
          <span className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#D4AF37' }} />
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function TilgjengelighetPage() {
  return (
    <main className="min-h-screen" style={{ background: 'linear-gradient(180deg, #0B1520 0%, #121E2E 50%, #0B1520 100%)' }}>
      <div className="max-w-[720px] mx-auto px-5 pt-16 pb-20">
        {/* Header */}
        <ToSomSection>
          <h1 style={{ ...typographyToStyle('heading-lg'), color: 'rgba(255,255,255,0.92)' }}>
            Tilgjengelighet
          </h1>
          <p className="mt-3" style={{ ...typographyToStyle('body-lg'), color: 'rgba(255,255,255,0.45)' }}>
            ToSom er bygget for alle. Uansett hvordan du bruker en datamaskin, en telefon eller en skjermleser — vi ønsker at du skal komme deg inn og finne roen.
          </p>
        </ToSomSection>

        {/* Vår holdning */}
        <Section title="Vår holdning">
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Tilgjengelighet er ikke noe vi legger til til slutt. Det er en del av hvordan vi bygger. Vi følger WCAG 2.1 nivå AA som utgangspunkt, og tester med både tastatur, skjermleser og zoom.
          </p>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Hvis noe ikke virker for deg, så fortell oss det. Det hjelper oss å gjøre ToSom bedre for alle.
          </p>
        </Section>

        {/* Hva vi har på plass */}
        <Section title="Hva vi har på plass">
          <BulletList
            items={[
              'Tastaturnavigasjon på alle interaktive elementer — knapper, menyer, skjemaer',
              'Semantisk HTML med korrekte heading-nivåer og landmarks',
              'Aria-egenskaper for skjermlesere (aria-expanded, aria-label, role)',
              'Tilstrekkelig kontrast mellom tekst og bakgrunn (4.5:1 minimum)',
              'Støtte for zoom inntil 200% uten tap av innhold',
              'Responsivt design som fungerer på mobil, nettbrett og storskjerm',
              'Fokustilstand som er synlig på alle interaktive elementer',
              'Ingen innhold som kun formiles via farge — alltid tekst eller symbol i tillegg',
            ]}
          />
        </Section>

        {/* Chat */}
        <Section title="Chatten">
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Chatten er designet for enkel bruk: store tekstfelt, tydelig skille mellom dine og partners meldinger, og ingen elementer som krever presis pekerbevegelse.
          </p>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Meldinger annonseres for skjermlesere når de ankommer. «Skriver...»-indikatoren har tekstlig alternative for de som bruker assistiv teknologi.
          </p>
        </Section>

        {/* Bekjente begrensninger */}
        <Section title="Bekjente begrensninger">
          <BulletList
            items={[
              'Realtidsoppdateringer i chatten kan i enkelttilfeller ikke annonseres skjørt av skjermleseren. Vi jobber med å forbedre dette.',
              'Mood-temaene bytter farger i hele grensesnittet. For brukere med fargestyring er dette noe å være obs på. Alle Mood-temaer har likevel tilstrekkelig kontrast.',
              'Billedeling (fra dag 15) inkluderer alt-tekst, men dette er tomt ved opplasting. Vi jobber med å gjøre dette smartere.',
            ]}
          />
        </Section>

        {/* Tilbakemelding */}
        <Section title="Ser du noe som ikke fungerer?">
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Vi er ikke ferdige. ToSom blir bedre ved at du forteller oss hva som virker og hva som ikke gjør det.
          </p>
          <p className="mt-4 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Ta kontakt via{' '}
            <Link href="/kontakt" style={{ color: '#D4AF37', textDecoration: 'underline' }}>
              kontaktsiden
            </Link>{' '}
            så kan vi gjøre det bedre.
          </p>
        </Section>
      </div>
      <Footer />
    </main>
  );
}
