'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Footer } from '@/components/ui/layout/Footer';
import { ToSomSection } from '@/components/ui/system';
import { typographyToStyle } from '@/config/design-tokens';

const FAQS = [
  {
    q: 'Hva er ToSom egentlig?',
    a: 'ToSom er en 30-dagers samtale mellom to mennesker som ikke kjenner hverandre. Dere blir koblet basert på de seks dimensjonene vi ser på. Dere kan se hverandres fornavn og alder fra start, og fra dag 15 kan dere dele bilder om dere vil. Det hele er privat, varmt og i eget tempo.',
  },
  {
    q: 'Hvordan fungerer matching?',
    a: 'Vi sammenligner dere på seks dimensjoner — verdier, tilknytning, personlighet, kommunikasjon, emosjonsregulering og livssituasjon. Systemet finner den personen som passer best. Matching kjører hver lørdag, og matchen din venter på deg når du logger inn.',
  },
  {
    q: 'Hva skjer i de 30 dagene?',
    a: 'Hver dag får dere et nytt guidet spørsmål eller en samtale-impuls. Dere kan også velge fra 135 oppgaver i 9 kategorier — «Kunne-vil-du-si», «Fortell meg om», «Hvis vi var sammen», og mange flere. Alt sendes som tekst i chatten. Ved dag 15 låses bildedeling opp, slik at dere kan dele bilder om dere vil.',
  },
  {
    q: 'Hvorfor ingen bilder fra start?',
    a: 'Fordi vi tror at ord er dypere enn utseende. I 14 dager får dere tid til å lære hverandre å kjenne som mennesker — ikke som profiler. Da bildene åpner seg ved dag 15, har dere allerede noe ekte å se i ansiktet til. Eller kanskje ikke. Kanskje ordene var nok.',
  },
  {
    q: 'Hva skjer etter dag 30?',
    a: 'To valg. «Vi fant hverandre» — da slettes alt. Alle samtaler, bilder, spørsmål og svar — alt forsvinner permanent. Bare en følelse gjenstår. Eller «Start ny reise» — dere slettes, og begge kommer tilbake i køen for en ny match. Ingen hard landing. Bare videre.',
  },
  {
    q: 'Hva koster ToSom?',
    a: 'De første 5 000 reiser er gratis. Deretter én engangsbetaling per 30-dagers reise, betalt med Vipps. Ingen abonnement. Ingen skjulte kostnader. Du betaler for reisen, ikke for å være der.',
  },
  {
    q: 'Hvor er dataene mine?',
    a: (
      <>Alt ligger i Europa (PostgreSQL, EU-region). Driftsleverandørene våre (Vercel, Cloudflare og Sentry) behandler teknisk informasjon som IP-adresse for å levere og sikre tjenesten — les mer i{' '}
        <Link href="/personvern" style={{ color: '#D4AF37' }}>personvernerklæringen</Link>. Ved reiseslutt eller kontosletting slettes ALT — verifisert og irreversibelt. Det som gjenstår er to anonyme ID-er for statistikk. Alt annet er borte.</>
    ),
  },
  {
    q: 'Kan jeg slette kontoen min når som helst?',
    a: 'Ja. Innstillinger → Slett konto. Alt forsvinner med en gang. Du får en bekreftelse per e-post. Ingen ventetid, ingen «er du sikker?»-loop utover én bekreftelse. Dine data er dine.',
  },
  {
    q: 'Hva om partneren min forsvinner?',
    a: 'Livet skjer. Hvis begge er stille i 48 timer, får dere en mild impuls fra oss. Hvis reisen aldri starter (begge har ikke logget inn innen 14 dager), utgår den stille. Ingen dramatikk. Bare ro.',
  },
  {
    q: 'Er det trygt? Blir dataene mine solgt?',
    a: 'Nei. Aldri. Vi selger ikke data. Vi deler ikke data. Vi bruker ikke data til annonser. Alle forbindelser er TLS-krypterte. Du kan slette alt når som helst. ToSom er bygget slik at vi ikke KAN gjøre noe med dataene dine etter at de er slettet.',
  },
];

function FaqItem({ q, a }: { q: string; a: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border-b py-5"
      style={{ borderColor: 'rgba(255,255,255,0.08)' }}
    >
      {/* V-8: ekte <button> inni <h3> — mellomrom og Enter virker av seg selv */}
      <h3 style={{ ...typographyToStyle('heading-sm'), color: 'rgba(255,255,255,0.85)' }}>
        <button
          type="button"
          className="flex w-full items-center justify-between gap-4 cursor-pointer transition-colors"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
        >
          <span>{q}</span>
          <span
            className="flex-shrink-0 text-xl transition-transform duration-200"
            style={{ color: '#D4AF37', transform: open ? 'rotate(45deg)' : 'none' }}
          >
            +
          </span>
        </button>
      </h3>
      {open && (
        <p className="mt-4 leading-relaxed" style={{ ...typographyToStyle('body'), color: 'rgba(255,255,255,0.6)' }}>
          {a}
        </p>
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
          <p className="mt-2" style={{ ...typographyToStyle('body-lg'), color: 'rgba(255,255,255,0.6)' }}>
            Alt du lurer på, svart på en rolig og ærlig måte.
          </p>
        </ToSomSection>

        <div className="mt-8">
          {FAQS.map((item) => (
            <FaqItem key={item.q} q={item.q} a={item.a} />
          ))}
        </div>

        <ToSomSection>
          <p style={{ ...typographyToStyle('body'), color: 'rgba(255,255,255,0.6)' }}>
            Finner du ikke svaret?{' '}
            <Link href="/kontakt" style={{ color: '#D4AF37', textDecoration: 'underline' }}>
              Ta kontakt
            </Link>{' '}
            — vi svarer personlig.
          </p>
        </ToSomSection>
      </div>
      <Footer />
    </main>
  );
}
