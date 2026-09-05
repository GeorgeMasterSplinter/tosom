import Link from 'next/link';
import { Footer } from '@/components/ui/layout/Footer';
import { ToSomSection } from '@/components/ui/system';
import { color, typographyToStyle } from '@/config/design-tokens';

export const metadata = {
  title: 'Tilgjengelighet — ToSom',
  description: 'ToSoms tilgjengelighetserklæring og vårt forpliktelse til å være tilgjengelig for alle.',
};

export default function TilgjengelighetPage() {
  return (
    <main className="min-h-screen" style={{ background: '#0B1520' }}>
      <div className="max-w-[720px] mx-auto px-5 py-16">
        <ToSomSection>
          <h1 style={{ ...typographyToStyle('heading-lg'), color: 'rgba(255,255,255,0.92)' }}>
            Tilgjengelighetserklæring
          </h1>
          <p style={{ ...typographyToStyle('body'), color: 'rgba(255,255,255,0.5)' }}>
            Oppdatert: September 2025
          </p>
        </ToSomSection>

        <ToSomSection>
          <h2 style={{ ...typographyToStyle('heading-md'), color: 'rgba(255,255,255,0.85)' }}>
            Vår forpliktelse
          </h2>
          <p style={{ ...typographyToStyle('body'), color: 'rgba(255,255,255,0.6)' }}>
            ToSom ønsker å være tilgjengelig for alle, uansett funksjonsnivå eller teknologi. Vi jobber kontinuerlig med å oppfylle WCAG 2.1 nivå AA-retningslinjene.
          </p>
        </ToSomSection>

        <ToSomSection>
          <h2 style={{ ...typographyToStyle('heading-md'), color: 'rgba(255,255,255,0.85)' }}>
            Hva vi har på plass
          </h2>
          <ul style={{ ...typographyToStyle('body'), color: 'rgba(255,255,255,0.6)', paddingLeft: '20px', lineHeight: 2 }}>
            <li>Tastaturnavigasjon på alle interaktive elementer</li>
            <li>Ariabel-merker (landmarks) for skjermlesere</li>
            <li>Tilstrekkelig kontrast mellom tekst og bakgrunn</li>
            <li>Semantisk HTML (headings, lists, buttons)</li>
            <li>Alt-tekst på meningsbærende bilder</li>
            <li>Skriftstøtte og zoom-funksjonalitet</li>
            <li>Responsivt design som fungerer på alle skjermer</li>
          </ul>
        </ToSomSection>\n
        <ToSomSection>
          <h2 style={{ ...typographyToStyle('heading-md'), color: 'rgba(255,255,255,0.85)' }}>
            Bekjente utfordringer
          </h2>
          <p style={{ ...typographyToStyle('body'), color: 'rgba(255,255,255,0.6)' }}>
            Chat-grensesnittet med realtidsoppdateringer kan ha begrensede skjermleser-understøttelse. Vi jobber med å forbedre dette.
          </p>
        </ToSomSection>\n
        <ToSomSection>
          <h2 style={{ ...typographyToStyle('heading-md'), color: 'rgba(255,255,255,0.85)' }}>
            Tilbakemelding
          </h2>
          <p style={{ ...typographyToStyle('body'), color: 'rgba(255,255,255,0.6)' }}>
            Ser du tilgjengelighetsutfordringer? Ta kontakt via{' '}
            <Link href="/kontakt" style={{ color: '#D4AF37', textDecoration: 'underline' }}>
              kontaktsiden
            </Link>{' '}
            så kan vi forbedre.
          </p>
        </ToSomSection>
      </div>
      <Footer />
    </main>
  );
}
