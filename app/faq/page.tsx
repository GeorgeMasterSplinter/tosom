'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Footer } from '@/components/ui/layout/Footer';
import { ToSomSection } from '@/components/ui/system';
import { typographyToStyle } from '@/config/design-tokens';
import { PRICING } from '@/config/legal';

const FAQS = [
  {
    q: 'Hva er Tosom egentlig?',
    a: 'Tosom er en 14-dagers samtale mellom to mennesker som ikke kjenner hverandre. Dere blir koblet basert på de seks dimensjonene vi ser på. Dere kan se hverandres fornavn og alder fra start, og fra dag 8 kan dere dele bilder om dere vil. Det hele er privat, og det går i eget tempo.',
  },
  {
    q: 'Hvordan fungerer matching?',
    a: 'Vi sammenligner dere på seks dimensjoner — verdier, tilknytning, personlighet, kommunikasjon, emosjonsregulering og livssituasjon. Matcherunden kjører natt til lørdag, og vi forsøker å finne personen som passer deg best. Finner vi ingen god nok denne runden, står du i kø til neste. Finner vi en person, venter koblingen på deg når du logger inn.',
  },
  {
    q: 'Hva skjer i de 14 dagene?',
    a: 'Hver dag får dere et nytt guidet spørsmål eller en samtale-impuls. Dere kan også velge fra 135 oppgaver i 9 kategorier — «Kunne-vil-du-si», «Fortell meg om», «Hvis vi var sammen», og mange flere. Alt sendes som tekst i chatten. Ved dag 8 låses bildedeling opp, slik at dere kan dele bilder om dere vil.',
  },
  {
    q: 'Hvorfor ingen bilder fra start?',
    a: 'Den første uken er uten bilder, slik at samtalen får komme først. Bildene åpnes på dag 8. Hver av dere bestemmer selv om, og når, dere vil dele.',
  },
  {
    q: 'Hva skjer etter dag 14?',
    a: 'Hver av dere velger for seg selv: «Vi fant hverandre» eller «Start ny reise» — dere har 72 timer fra dag 14 til å ta stilling. Når begge har valgt «Vi fant hverandre», får dere 24 timer til å laste ned teksten fra samtalen som PDF — bilder blir ikke med. Deretter slettes samtalen, bildene og reisen permanent. Velger dere «Start ny reise», avsluttes reisen når begge har tatt stilling, og begge kan starte på nytt. Velger ingen av dere noe innen de 72 timene, avsluttes reisen automatisk. Uansett utfall beholdes kontoen deres — det er bare reisen, samtalen og bildene som slettes.',
  },
  {
    q: 'Hva koster Tosom?',
    a: `Tosom er foreløpig i en begrenset beta, og registrering skjer via invitasjon. De ${PRICING.freeUserCap.toLocaleString('nb-NO')} første personene får bruke Tosom gratis. Senere er planen én engangsbetaling per 14-dagersreise — ${PRICING.journeyPrice} kr, betalt én gang med Vipps. Ingen abonnement. Ingen skjulte kostnader.`,
  },
  {
    q: 'Hvor er dataene mine?',
    a: (
      <>Alt ligger i Europa (PostgreSQL, EU-region). Driftsleverandørene våre (Vercel, Cloudflare og Sentry) behandler teknisk informasjon som IP-adresse for å levere og sikre tjenesten — les mer i{' '}
        <Link href="/personvern" style={{ color: '#D4AF37' }}>personvernerklæringen</Link>. Ved reiseslutt slettes samtalen, bildene og reisen senest 24 timer etter — kontoen din beholdes. Sletter du kontoen din, forsvinner alt med en gang. Det er verifisert og irreversibelt. Det som gjenstår er to anonyme ID-er for statistikk. Alt annet er borte.</>
    ),
  },
  {
    q: 'Kan jeg slette kontoen min når som helst?',
    a: 'Ja. Innstillinger → Slett konto. Alt forsvinner med en gang. Du får en bekreftelse per e-post. Ingen ventetid, ingen «er du sikker?»-loop utover én bekreftelse. Dine data er dine.',
  },
  {
    q: 'Hva om partneren min forsvinner?',
    a: 'Livet skjer. Hvis begge er stille i 48 timer, får dere en mild impuls fra oss. Hvis reisen aldri starter (ingen av dere har logget inn innen 7 dager), utgår den stille. Ingen dramatikk. Bare ro.',
  },
  {
    q: 'Er det trygt? Blir dataene mine solgt?',
    a: 'Nei. Aldri. Vi selger ikke data. Vi deler ikke data. Vi bruker ikke data til annonser. Alle forbindelser er TLS-krypterte. Du kan slette alt når som helst. Tosom er bygget slik at vi ikke kan gjøre noe med dataene dine etter at de er slettet.',
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
