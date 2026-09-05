'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Footer } from '@/components/ui/layout/Footer';
import { ToSomSection } from '@/components/ui/system';
import { typographyToStyle } from '@/config/design-tokens';

const FAQS = [
  {
    q: 'Hva er ToSom egentlig?',
    a: 'ToSom er en 30-dagers samtale mellom to mennesker som ikke kjenner hverandre. Ingen bilder, ingen navn, ingen alder — bare ord. Dere blir koblet basert på 240 dype spørsmål som avdekker hvem dere egentlig er. Det hele er anonymt, varmt og i eget tempo.',
  },
  {
    q: 'Hvordan fungerer matching?',
    a: 'Du svarer på spørsmål i 12 kategorier — personlighet, forhold, kommunikasjon, næhet, følelser, trygghet, lek, barndom, verdier, fremtid, hverdag og modus. Systemet sammenligner dere og finner den personen som passer best. Matching kjører hver lørdag. Når du får en match, får du en e-post.',
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
    a: 'To valg. «Vi fant hverandre» — da slettes alt. Alle samtalinger, bilder, spørsmålssvar — alt forsvinner permanent. Bare en følelse gjenstår. Eller «Start ny reise» — dere slettes, og begge kommer tilbake i køen for en ny match. Ingen hard fele. Bare videre.',
  },
  {
    q: 'Hva koster ToSom?',
    a: 'I beta er det gratis. Når vi lanserer, blir det en engangsbetaling per 30-dagers reise. Ingen abonnement. Ingen skjulte kostnader. Du betaler for reisen, ikke for å være der.',
  },
  {
    q: 'Hvor er dataene mine?',
    a: 'Alt ligger i Europa (PostgreSQL, EU-region). Vi logger ikke IP-adresser. Vi bruker ingen tredjeparts tracking. Ved reiseslutt eller kontosletting slettes ALT — verifisert og irreversibelt. Det som gjenstår er to anonyme ID-er for statistikk. Alt annet er borte.',
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

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border-b py-5 cursor-pointer transition-colors"
      style={{ borderColor: 'rgba(255,255,255,0.08)' }}
      onClick={() => setOpen(!open)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && setOpen(!open)}
      aria-expanded={open}
    >
      <div className="flex items-center justify-between gap-4">
        <h3 style={{ ...typographyToStyle('heading-sm'), color: 'rgba(255,255,255,0.85)' }}>{q}</h3>
        <span
          className="flex-shrink-0 text-xl transition-transform duration-200"
          style={{ color: '#D4AF37', transform: open ? 'rotate(45deg)' : 'none' }}
        >
          +
        </span>
      </div>
      {open && (
        <p className="mt-4 leading-relaxed" style={{ ...typographyToStyle('body'), color: 'rgba(255,255,255,0.55)' }}>
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
          <p className="mt-2" style={{ ...typographyToStyle('body-lg'), color: 'rgba(255,255,255,0.4)' }}>
            Alt du lurer på, svart på rolig og ærligt.
          </p>
        </ToSomSection>

        <div className="mt-8">
          {FAQS.map((item) => (
            <FaqItem key={item.q} q={item.q} a={item.a} />
          ))}
        </div>

        <ToSomSection>
          <p style={{ ...typographyToStyle('body'), color: 'rgba(255,255,255,0.5)' }}>
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
