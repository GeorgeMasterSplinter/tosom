'use client';

import { Footer } from '@/components/ui/layout/Footer';
import { ToSomSection, ToSomButton } from '@/components/ui/system';
import { color, typographyToStyle } from '@/config/design-tokens';
import GlassCard from '@/components/ui/cards/GlassCard';

/* ========================
   INLINE SVG-ikoner
   ======================== */

function IconAge() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function IconLogin() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <polyline points="10,17 15,12 10,7" />
      <line x1="15" y1="12" x2="3" y2="12" />
    </svg>
  );
}

function IconProfile() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function IconMatch() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21,15 16,10 5,21" />
    </svg>
  );
}

function IconEnd() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16,17 21,12 16,7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function IconCopyright() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M14 8a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2" />
      <path d="M10 16a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2" />
    </svg>
  );
}

const sections: { icon: React.ReactNode; title: string; content: string; note?: string }[] = [
  {
    icon: <IconAge />,
    title: 'Aldersgrense — 21 år',
    content: 'Du må være 21 år for å bruke Tosom. Vi tar alderskravet svært alvorlig for å sikre et trygt miljø for voksne som søker ekte forbindelse. Innlogging via Vipps (BankID) verifiserer alderen din.',
  },
  {
    icon: <IconLogin />,
    title: 'Oppretting av konto og innlogging',
    content: 'Du oppretter en konto med Vipps (BankID-verifisert). Kontoen er knyttet til din identitet. Ved registrering samtykker du til disse vilkårene, og samtykket lagres med tidsstempel.',
  },
  {
    icon: <IconMatch />,
    title: 'Én reise — 30 dager',
    content: 'En reise koster 349 kroner og gir deg én match i én 30-dagers reise. Vi kobler natt til lørdag, og reisen starter lørdag morgen. Du kan bare ha én aktiv reise om gangen.',
  },
  {
    icon: <IconProfile />,
    title: 'Kobling — ikke valg',
    content: 'Tosom kobler deg til én person basert på kunnskapsbasert matching.\nDu trenger ikke velge mellom hundre profiler eller sveipe deg gjennom et marked.\nI stedet får du én person som faktisk passer deg — basert på verdier, livsstil, kommunikasjon og fremtidsønsker.\n\nDu slipper valgene som skaper stress.\nVi kobler deg til én person som matcher deg på det som betyr noe.',
  },
  {
    icon: <IconProfile />,
    title: 'Hva vi forventer av deg',
    content: 'Tosom bygger på respekt. Du snakker med et menneske som har valgt å åpne seg. Ingen trakassering, ingen press, ingen upassende innhold. Du deler ikke andres bilder, meldinger eller opplysninger videre. Du bruker ikke Tosom kommersielt eller til å selge noe.',
  },
  {
    icon: <IconEnd />,
    title: 'Hvis noen bryter reglene',
    content: 'Opplever du noe ubehagelig, kan du rapportere det i samtalen eller under Innstillinger → Sikkerhet. Vi leser alle rapporter. Ved brudd gir vi advarsel eller stenger kontoen, avhengig av alvor. Ved grove brudd stenges kontoen umiddelbart og uten refusjon. Du kan også avslutte reisen eller blokkere og avslutte reisen når som helst.',
  },
  {
    icon: <IconEnd />,
    title: 'Avslutning og sletting',
    content: 'Motparten kan avslutte reisen når som helst, og samtalen slettes da for begge. Ved reiseslutt slettes alt innhold. Velger du «Vi fant hverandre», slettes hele kontoen din. Du kan også avslutte tidlig.',
  },
  {
    icon: <ImageIcon />,
    title: 'Bildedeling',
    content: 'Fra dag 15 kan dere dele bilder med hverandre. Før den tid bygger dere en tilknytning basert på dybde og resonans, ikke utseende.',
  },
  {
    icon: <IconCopyright />,
    title: 'Angrerett',
    content: 'Norsk lov gir 14 dagers angrerett på digitale tjenester. Reisen starter lørdag morgen, når koblingen er gjort. Melder du deg ut før lørdag, refunderer vi hele beløpet uten spørsmål. Etter at reisen har startet, er tjenesten levert, og angreretten bortfaller.',
  },
  {
    icon: <IconCopyright />,
    title: 'Om avtalen',
    content: 'Tosom drives av Tosom AS. Disse vilkårene er avtalen mellom deg og oss. Vi kan endre dem, og varsler deg i god tid før endringer trer i kraft. Avtalen følger norsk rett.',
  },
];

export default function VilkårPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Bakgrunn — Deep Blue gradient */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, #0B1520 0%, #121E2E 50%, #0B1520 100%)',
        }}
      />

      {/* Ambient glød — blue */}
      <div
        className="absolute top-20 right-0 w-[600px] h-[400px] pointer-events-none opacity-30"
        style={{
          background: 'radial-gradient(ellipse at 70% 30%, rgba(80,120,255,0.04), transparent 70%)',
        }}
      />

      <div className="relative z-10">

        {/* ===== HERO ===== */}
        <ToSomSection
          spotlight="blue"
          className="px-6 text-center space-y-6"
        >
          <h1
            style={{
              ...typographyToStyle('hero'),
              color: color.text.primary,
            }}
          >
            Vilkår for bruk
          </h1>

          <p
            className="max-w-2xl mx-auto"
            style={{
              ...typographyToStyle('body-lg'),
              color: color.text.secondary,
            }}
          >
            Tosom er designet for voksne mennesker som ønsker ekte forbindelse. Ved å bruke plattformen samtykker du til disse vilkårene.
          </p>
        </ToSomSection>

        {/* ===== SEKSJONER ===== */}
        <ToSomSection
          spotlight="blue"
          className="px-6"
        >
          <div className="mx-auto max-w-5xl">
            <h2
              className="text-center mb-6"
              style={{
                ...typographyToStyle('heading-lg'),
                color: color.text.primary,
              }}
            >
              Hva du bør vite
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sections.map((s, idx) => (
                <GlassCard key={idx} padding="xl" interactive className="space-y-4">
                  <div className="w-14 h-14 rounded-full bg-[rgba(212,175,55,0.1)] flex items-center justify-center text-[#D4AF37]">
                    {s.icon}
                  </div>
                  <h3
                    style={{
                      ...typographyToStyle('heading-sm'),
                      color: color.brand.gold,
                    }}
                  >
                    {s.title}
                  </h3>
                  <p
                    style={{
                      ...typographyToStyle('body'),
                      color: color.text.secondary,
                      lineHeight: '1.8',
                    }}
                  >
                    {s.content}
                  </p>
                  {s.note && (
                    <p
                      style={{
                        ...typographyToStyle('body-sm'),
                        color: 'rgba(255,255,255,0.5)',
                        lineHeight: '1.6',
                        marginTop: '4px',
                      }}
                    >
                      {s.note}
                    </p>
                  )}
                </GlassCard>
              ))}
            </div>
          </div>
        </ToSomSection>

        {/* ===== KONTAKT ===== */}
        <ToSomSection
          spotlight="soft"
          className="px-6"
        >
          <div className="mx-auto max-w-3xl space-y-8 text-center">
            <h2
              style={{
                ...typographyToStyle('heading-lg'),
                color: color.text.primary,
              }}
            >
              Spørsmål om vilkårene?
            </h2>

            <p
              style={{
                ...typographyToStyle('body-lg'),
                color: color.text.secondary,
              }}
            >
              Kontakt oss på{' '}
              <span
                style={{
                  color: color.brand.gold,
                  cursor: 'pointer',
                }}
              >
                privat@tosom.no
              </span>
            </p>
          </div>
        </ToSomSection>

        {/* ===== CTA ===== */}
        <ToSomSection
          spotlight="cta"
          className="px-6 text-center space-y-6"
        >
          <h2
            style={{
              ...typographyToStyle('heading-lg'),
              color: color.text.primary,
            }}
          >
            Klar til å starte?
          </h2>

          <p
            style={{
              ...typographyToStyle('body-lg'),
              color: color.text.secondary,
            }}
          >
            Lag profilen din i ditt eget tempo og møt noen som faktisk passer deg — på ordentlig.
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