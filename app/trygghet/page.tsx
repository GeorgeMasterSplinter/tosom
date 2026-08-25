'use client';

/**
 * Tosom — Trygghet
 *
 * Beskriver rutinene som faktisk finnes i koden:
 * rapportering (POST /api/report), blokkering (UserBlock),
 * utestengelse (User.bannedAt), frysing (Conversation.frozenAt),
 * aldersgrense (selvrapportert i beta) og bildesperre til dag 15.
 *
 * Ingenting her lover mer enn plattformen kan holde.
 * Se docs/JURIDISK-GRUNNLAG-v1.0.md §3 for kartleggingen.
 */

import Link from 'next/link';
import { Footer } from '@/components/ui/layout/Footer';
import { ToSomSection } from '@/components/ui/system';
import { color, typographyToStyle } from '@/config/design-tokens';
import { COMPANY, MIN_AGE, JOURNEY } from '@/config/legal';

/* ========================
   INNHOLD
   ======================== */

interface Section {
  id: string;
  title: string;
  paragraphs?: string[];
  list?: string[];
}

const sections: Section[] = [
  {
    id: '1',
    title: 'Slik er Tosom bygget',
    paragraphs: [
      'Trygghet er ikke en funksjon vi la til på slutten. Det er grunnen til at plattformen ser ut som den gjør.',
      'Du møter én person om gangen. Det finnes ingen strøm av profiler, ingen sveiping og ingen uleste meldinger fra fremmede. Profilen din er privat, og bilder kommer først etter to uker.',
      'Alt dette er valg som gjør det vanskeligere å vokse raskt — og lettere å føle seg trygg.',
    ],
  },
  {
    id: '2',
    title: 'Hvem som slipper inn',
    paragraphs: [
      `I betaperioden lager du konto med e-post og passord, og bekrefter selv at du er minst ${MIN_AGE} år. Aldersverifisering gjennom Vipps og BankID innføres ved lansering.`,
      `Aldersgrensen er ${MIN_AGE} år. Én person kan bare ha én konto.`,
      'Vi gjør ikke bakgrunnssjekk. I betaperioden bekrefter alderen seg selv — vi vet ikke mer enn det, og vi later ikke som noe annet.',
    ],
  },
  {
    id: '3',
    title: 'Bilder kommer senere',
    paragraphs: [
      `Bilder kan først deles fra dag ${JOURNEY.imageUnlockDay} av reisen. Sperren ligger i systemet og kan ikke omgås — heller ikke av oss.`,
      'Grunnen er enkel: når dere først ser hverandre, har dere allerede snakket sammen i to uker. Da vet dere noe om hverandre som et bilde ikke kan fortelle.',
      'Du bestemmer selv om du vil dele bilde i det hele tatt.',
    ],
  },
  {
    id: '4',
    title: 'Hva du kan gjøre',
    paragraphs: [
      'Du har tre knapper, og du trenger aldri forklare hvorfor du bruker dem.',
    ],
    list: [
      'Rapporter — si fra til oss om noe som ikke er greit',
      'Blokker — den andre kan ikke lenger nå deg',
      'Avslutt reisen — samtalen stopper, og du kan stille deg i kø igjen',
    ],
  },
  {
    id: '5',
    title: 'Slik rapporterer du',
    paragraphs: [
      'Du finner rapportknappen i samtalen og under Innstillinger. Velg en kategori, og skriv gjerne noen ord om hva som skjedde.',
      'Du kan rapportere for trakassering, upassende innhold, spam, mistanke om falsk profil, eller noe annet du reagerer på.',
      'Den du rapporterer får aldri vite at du har gjort det.',
    ],
  },
  {
    id: '6',
    title: 'Hva som skjer etterpå',
    paragraphs: [
      'En rapport går rett til oss, ikke inn i en kø som ingen ser på.',
    ],
    list: [
      'Vi får varsel med én gang rapporten kommer inn',
      'Vi ser på saken samme dag',
      'Ved behov fryser vi samtalen mens vi undersøker',
      'Vi kan gi advarsel, avslutte reisen eller stenge kontoen',
      'Ved grove brudd stenges kontoen umiddelbart',
    ],
  },
  {
    id: '7',
    title: 'Hva vi aldri gjør',
    paragraphs: [
      'Dette er en regel vi har satt for oss selv, og som vi holder:',
      'Vi leser aldri samtalen deres uten at det foreligger en rapport.',
      'Vi bruker ikke samtalene til å forbedre systemet, vi analyserer dem ikke, og ingen hos oss leser med av nysgjerrighet. Rommet er deres.',
      'Kommer det en rapport, ser vi bare på det vi trenger for å forstå hva som har skjedd.',
    ],
  },
  {
    id: '8',
    title: 'Før dere møtes',
    paragraphs: [
      'Bestemmer dere dere for å møtes, er det deres valg — og vi er ikke med. Noen råd som gjelder uansett hvor godt dere kjenner hverandre digitalt:',
    ],
    list: [
      'Møtes et offentlig sted første gang',
      'Si fra til noen du stoler på hvor du skal og med hvem',
      'Ordne transporten selv, begge veier',
      'Hold på telefonen og la den være ladet',
      'Drar du hjem tidlig fordi noe føles feil, er det et helt legitimt valg',
      'Ring 112 hvis du føler deg utrygg',
    ],
  },
  {
    id: '9',
    title: 'Kjenn igjen svindel',
    paragraphs: [
      'Vipps-innlogging gjør det vanskelig å opprette falske profiler, men ingen plattform er helt fri for forsøk. Vær oppmerksom hvis noen:',
    ],
    list: [
      'Ber om penger, uansett hvor god historien er',
      'Vil flytte samtalen til en annen app med én gang',
      'Ber om bilder du ikke er komfortabel med å sende',
      'Nekter å snakke på telefon eller video over tid',
      'Forteller om en akutt krise og trenger hjelp raskt',
      'Ber om personnummer, bankopplysninger eller passord',
    ],
    // Følger opp under
  },
  {
    id: '10',
    title: 'Hvis du trenger hjelp',
    paragraphs: [
      'Noen ganger handler det om mer enn en samtale som gikk skjevt. Da finnes det folk som kan mer enn oss:',
    ],
    list: [
      'Nødnummer politi — 112',
      'Politiets sentralbord — 02800',
      'Mental Helses hjelpetelefon — 116 123, døgnet rundt',
      'Kirkens SOS — 22 40 00 40, døgnet rundt',
      'Krisesenter, landsdekkende — 116 006',
      'Vern for eldre — 800 30 196',
    ],
  },
  {
    id: '11',
    title: 'Sikkerheten i systemet',
    paragraphs: [
      'Det tekniske skal også være på plass:',
    ],
    list: [
      'All trafikk krypteres',
      'Passord lagres aldri i lesbar form',
      'Bilder ligger bak lenker som utløper',
      'Personopplysninger fjernes fra tekniske feilmeldinger',
      'Tilgang til data logges',
      'Sikkerheten testes automatisk ved hver kodeendring',
    ],
  },
  {
    id: '12',
    title: 'Si fra til oss',
    paragraphs: [
      `Er du usikker på noe, eller har du opplevd noe du vil fortelle om, skriv til ${COMPANY.email}. Du får svar fra et menneske.`,
      'Har du funnet et sikkerhetshull, vil vi gjerne høre om det. Meld fra til samme adresse, så tar vi det på alvor.',
    ],
  },
];

/* ========================
   SIDE
   ======================== */

export default function TrygghetPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, #0B1520 0%, #121E2E 50%, #0B1520 100%)',
        }}
      />

      <div className="relative z-10">
        {/* ===== HERO ===== */}
        <ToSomSection spotlight="blue" className="px-6 text-center space-y-6">
          <h1 style={{ ...typographyToStyle('hero'), color: color.text.primary }}>
            Trygghet
          </h1>

          <p
            className="max-w-2xl mx-auto"
            style={{ ...typographyToStyle('body-lg'), color: color.text.secondary }}
          >
            Et rom er bare trygt hvis du vet hvordan det fungerer. Her står hva vi gjør, hva du kan
            gjøre, og hvem du kan ringe hvis noe skjer.
          </p>
        </ToSomSection>

        {/* ===== NØDNUMMER — alltid synlig øverst ===== */}
        <ToSomSection spotlight="none" className="px-6">
          <div className="mx-auto max-w-[760px]">
            <div
              className="rounded-2xl px-6 py-5"
              style={{
                background: 'rgba(255,77,77,0.05)',
                border: '1px solid rgba(255,77,77,0.20)',
              }}
            >
              <p
                style={{
                  ...typographyToStyle('body'),
                  color: 'rgba(255,255,255,0.85)',
                  lineHeight: '1.75',
                }}
              >
                Er du i fare akkurat nå, ring{' '}
                <a href="tel:112" style={{ color: '#FF6B6B', fontWeight: 600 }}>
                  112
                </a>
                . Trenger du noen å snakke med, ring Mental Helse på{' '}
                <a href="tel:116123" style={{ color: '#FF6B6B', fontWeight: 600 }}>
                  116 123
                </a>
                . Begge er åpne hele døgnet.
              </p>
            </div>
          </div>
        </ToSomSection>

        {/* ===== SEKSJONER ===== */}
        <ToSomSection spotlight="none" className="px-6">
          <div className="mx-auto max-w-[760px] space-y-12">
            {sections.map((section) => (
              <section key={section.id} id={`punkt-${section.id}`} className="space-y-4">
                <h2
                  className="flex gap-3"
                  style={{ ...typographyToStyle('heading-md'), color: color.text.primary }}
                >
                  <span style={{ color: color.brand.gold }}>{section.id}.</span>
                  <span>{section.title}</span>
                </h2>

                {section.paragraphs?.map((text, i) => (
                  <p
                    key={i}
                    style={{
                      ...typographyToStyle('body'),
                      color: color.text.secondary,
                      lineHeight: '1.85',
                    }}
                  >
                    {text}
                  </p>
                ))}

                {section.list && (
                  <ul className="space-y-2.5 pl-1">
                    {section.list.map((item, i) => (
                      <li key={i} className="flex gap-3">
                        <span
                          className="flex-shrink-0 mt-[11px] w-1 h-1 rounded-full"
                          style={{ background: color.brand.gold }}
                        />
                        <span
                          style={{
                            ...typographyToStyle('body'),
                            color: color.text.secondary,
                            lineHeight: '1.85',
                          }}
                        >
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        </ToSomSection>

        {/* ===== KONTAKT ===== */}
        <ToSomSection spotlight="soft" className="px-6">
          <div className="mx-auto max-w-[760px] space-y-4">
            <h2 style={{ ...typographyToStyle('heading-md'), color: color.text.primary }}>
              Trenger du å snakke med oss?
            </h2>

            <p
              style={{
                ...typographyToStyle('body'),
                color: color.text.secondary,
                lineHeight: '1.85',
              }}
            >
              Skriv til{' '}
              <a
                href={`mailto:${COMPANY.email}`}
                className="underline underline-offset-4"
                style={{ color: color.brand.gold }}
              >
                {COMPANY.email}
              </a>
              . Se også{' '}
              <Link
                href="/vilkar"
                className="underline underline-offset-4"
                style={{ color: color.brand.gold }}
              >
                vilkårene
              </Link>{' '}
              og{' '}
              <Link
                href="/personvern"
                className="underline underline-offset-4"
                style={{ color: color.brand.gold }}
              >
                personvernerklæringen
              </Link>
              .
            </p>
          </div>
        </ToSomSection>

        <Footer />
      </div>
    </main>
  );
}
