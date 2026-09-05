'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Footer } from '@/components/ui/layout/Footer';
import { ToSomSection } from '@/components/ui/system';
import { typographyToStyle } from '@/config/design-tokens';

const FAQS = [
  {
    q: 'Hva er ToSom?',
    a: 'ToSom er et 30-dagers samtaleformat der to personer blir koblet anonymt. Ingen bilder, ingen navn — bare ord. Dere skriver sammen i 30 dager med guidede spørsmål, og bilder låses opp ved dag 15.',
  },
  {
    q: 'Hvordan fungerer matching?',
    a: 'Du svarer på 80+ dypdeled spørsmål om hvem du er. Systemet sammenligner profilene og finner en person som passer. Matching kjører hver lørdag. Når du får en match, får du en e-post.',
  },
  {
    q: 'Hvor lang tid tar reisen?',
    a: 'Nøyaktig 30 dager. Hver dag får du et nytt spørsmål eller en samtale-impuls. Ved dag 15 kan dere dele bilder. Ved dag 30 velger dere om dere «fant hverandre» eller starter en ny reise.',
  },
  {
    q: 'Hva skjer etter 30 dager?',
    a: 'To valg: «Vi fant hverandre» — alle data slettes permanent og kontoene avregnes. Eller «Start ny reise» — dere slettes, og begge kommer tilbake i køen for en ny match.',
  },
  {
    q: 'Hva koster ToSom?',
    a: 'ToSom er gratis i beta. Ved lansering vil det være en engangsbetaling per reise (betalingsløsning via Vipps).',
  },
  {
    q: 'Hvor er dataene mine?',
    a: 'Alle data lagres i EU (PostgreSQL på Supabase/Neon). Ved reiseslutt eller kontosletting slettes ALT — samtalinger, bilder, spørsmålssvar. Kun to anonyme ID-er beholde i statistikk.',
  },
  {
    q: 'Kan jeg slette kontoen min?',
    a: 'Ja, når som helst. Gå til Innstillinger → Slett konto. Alt slettes permanent umiddelbart, og du får en bekreftelse per e-post.',
  },
  {
    q: 'Kan jeg ha flere kontoer?',
    a: 'Nei. Én konto per person. Systemet hindrer duplikater basert på telefonnummer/e-post.',
  },
  {
    q: 'Hva skjer hvis partneren min ikke svarer?',
    a: 'Reisen fortsetter uansett. Hvis begge er stille i 48 timer, får dere en mild impuls fra systemet. Hvis reisen ikke starter (begge har ikke logget inn) innen 14 dager, utgår den.',
  },
  {
    q: 'Er ToSom trygt?',
    a: 'Ja. Alle forbindelser er TLS-krypterte. Vi logger ikke IP-adresser. Vi selger aldri data. Du kan slette alt når som helst. Se personvernerklæringen for detaljer.',
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border-b py-4 cursor-pointer transition-colors"
      style={{ borderColor: 'rgba(255,255,255,0.08)' }}
      onClick={() => setOpen(!open)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && setOpen(!open)}
      aria-expanded={open}
    >
      <div className="flex items-center justify-between">
        <h3 style={{ ...typographyToStyle('heading-sm'), color: 'rgba(255,255,255,0.85)' }}>{q}</h3>
        <span className="text-lg" style={{ color: '#D4AF37', transform: open ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }}>+</span>
      </div>
      {open && (
        <p className="mt-3" style={{ ...typographyToStyle('body'), color: 'rgba(255,255,255,0.55)' }}>{a}</p>
      )}
    </div>
  );
}

export default function FaqPage() {
  return (
    <main className="min-h-screen" style={{ background: '#0B1520' }}>
      <div className="max-w-[720px] mx-auto px-5 py-16">
        <ToSomSection>
          <h1 style={{ ...typographyToStyle('heading-lg'), color: 'rgba(255,255,255,0.92)' }}>
            Ofte stilte spørsmål
          </h1>
          <p style={{ ...typographyToStyle('body'), color: 'rgba(255,255,255,0.4)' }}>
            Alt du trenger å vite om ToSom.
          </p>
        </ToSomSection>

        <div className="mt-8">
          {FAQS.map((item) => (
            <FaqItem key={item.q} q={item.q} a={item.a} />
          ))}
        </div>

        <ToSomSection>
          <p style={{ ...typographyToStyle('body'), color: 'rgba(255,255,255,0.5)' }}>
            Har du et spørsmål vi ikke har besvart?{' '}
            <Link href="/kontakt" style={{ color: '#D4AF37', textDecoration: 'underline' }}>
              Ta kontakt
            </Link>
            .
          </p>
        </ToSomSection>
      </div>
      <Footer />
    </main>
  );
}
