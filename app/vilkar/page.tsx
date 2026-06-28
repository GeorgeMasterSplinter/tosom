'use client';

import Link from 'next/link';
import { Footer } from '@/components/ui/layout/Footer';
import { ToSomSection, ToSomButton } from '@/components/ui/system';
import { color, spacing, typographyToStyle, radius, shadow } from '@/config/design-tokens';

/* ========================
   INLINE SVG-ikoner
   ======================== */

function IconTarget() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function IconAge() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function IconNoSub() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="22" y1="2" x2="16" y2="8" />
      <line x1="8" y1="2" x2="14" y2="8" />
    </svg>
  );
}

function IconUser() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M2 21v-2a4 4 0 0 1 3-3.87" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function IconPrivacy() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3L3 9V15L12 21L21 15V9L12 3Z" />
      <path d="M12 21V9" />
      <path d="M3 9L12 15L21 9" />
    </svg>
  );
}

function IconEnd() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16,17 21,12 16,7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function IconEdit() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function IconMail() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="3" />
      <polyline points="2,4 12,13 22,4" />
    </svg>
  );
}

/* ========================
   HELPER — Ultra-Premium GlassCard
   ======================== */

function GlassCard({
  children,
  padding = 'lg',
  className = '',
  style,
}: {
  children: React.ReactNode;
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  style?: React.CSSProperties;
}) {
  const paddingMap = { sm: spacing.sm, md: spacing.md, lg: spacing.lg, xl: spacing.xl };

  return (
    <div
      className={className}
      style={{
        background: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(212,175,55,0.15)',
        borderRadius: `${radius.xl}px`,
        boxShadow: '0 8px 32px rgba(0,0,0,0.20)',
        padding: `${paddingMap[padding]}px`,
        transition: 'all 300ms ease-out',
        ...style,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)';
        (e.currentTarget as HTMLElement).style.border = '1px solid rgba(212,175,55,0.25)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(212,175,55,0.10)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)';
        (e.currentTarget as HTMLElement).style.border = '1px solid rgba(212,175,55,0.15)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.20)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
      }}
    >
      {children}
    </div>
  );
}

/* ========================
   VILKÅR-INNHOLD
   ======================== */

const sections = [
  {
    icon: <IconTarget />,
    title: 'Formålet med ToSom',
    content: 'ToSom er en plattform for rolig, trygg og meningsfull kontakt mellom to mennesker. Vi tilbyr én match om gangen, basert på verdier, kompatibilitet og relasjonelle faktorer.',
  },
  {
    icon: <IconAge />,
    title: 'Aldersgrense (23+)',
    content: 'ToSom er kun for brukere 23 år og eldre. Dette er fordi plattformen er designet for modenhet, livserfaring og relasjonell klarhet. Vi ønsker et rom hvor mennesker møtes med ro, trygghet og intensjon — ikke hastverk.',
  },
  {
    icon: <IconNoSub />,
    title: 'Ingen abonnement',
    content: 'ToSom har ingen abonnementer og ingen skjulte kostnader. Du betaler ikke for matcher, ikke for meldinger, ikke for funksjoner.Plattformen er bygget for kvalitet, ikke kvantitet — og ikke for å presse brukere inn i betalingsmodeller.',
  },
  {
    icon: <IconUser />,
    title: 'Brukerens ansvar',
    content: 'Som bruker av ToSom forventes du å være ærlig i profilen din, opptre respektfullt og verdig, ikke dele sensitiv informasjon med andre før du selv ønsker det, ikke misbruke plattformen til trakassering, spam eller uønsket kontakt, og respektere den andre personens grenser og tempo.',
  },
  {
    icon: <IconShield />,
    title: 'ToSoms ansvar',
    content: 'Vi forplikter oss til å beskytte dine data, aldri selge eller dele informasjon med tredjeparts‑tracking, gi deg en trygg, rolig og forskningsinformert opplevelse, sørge for at plattformen fungerer stabilt og sikkert, og tilby én match om gangen, valgt med omtanke.',
  },
  {
    icon: <IconPrivacy />,
    title: 'Personvern',
    content: 'Personvern er en av våre kjerneverdier. Du kan lese hele personvernerklæringen på siden Personvern.',
  },
  {
    icon: <IconEnd />,
    title: 'Avslutning av konto',
    content: 'Du kan avslutte kontoen din når som helst. Når du gjør det, slettes alle personlige data som ikke er juridisk påkrevd å beholde.',
  },
  {
    icon: <IconEdit />,
    title: 'Endringer i vilkår',
    content: 'Vi kan oppdatere vilkårene ved behov. Ved større endringer vil du få beskjed i god tid.',
  },
  {
    icon: <IconMail />,
    title: 'Spørsmål om vilkår?',
    content: 'Kontakt oss på privacy@tosom.no. Vi svarer vanligvis innen 24 timer.',
  },
];

/* ========================
   PAGE COMPONENT
   ======================== */

export default function VilkarPage() {
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
            Vilkår
          </h1>

          <p
            className="max-w-2xl mx-auto"
            style={{
              ...typographyToStyle('body-lg'),
              color: color.text.secondary,
            }}
          >
            Rolige, tydelige vilkår — uten juridisk støy.
          </p>
        </ToSomSection>

        {/* ===== INTRO ===== */}
        <ToSomSection
          spotlight="blue"
          className="px-6"
        >
          <div className="mx-auto max-w-3xl">
            <p
              style={{
                ...typographyToStyle('body-lg'),
                color: color.text.secondary,
                lineHeight: '1.8',
              }}
            >
              Disse vilkårene beskriver hvordan ToSom fungerer, hva du kan forvente av oss, og hva vi forventer av deg.
            </p>
          </div>
        </ToSomSection>

        {/* ===== VILKÅR-SEKSJONER ===== */}
        <ToSomSection
          spotlight="blue"
          className="px-6"
        >
          <div className="mx-auto max-w-5xl space-y-6">
            {sections.map((sec, idx) => (
              <GlassCard key={idx} padding="xl" className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 rounded-full bg-[rgba(212,175,55,0.1)] flex items-center justify-center text-[#D4AF37]">
                    {sec.icon}
                  </div>
                  <div className="space-y-3">
                    <h3
                      style={{
                        ...typographyToStyle('heading-md'),
                        color: color.text.primary,
                      }}
                    >
                      {sec.title}
                    </h3>
                    <p
                      style={{
                        ...typographyToStyle('body-lg'),
                        color: color.text.secondary,
                        lineHeight: '1.8',
                      }}
                    >
                      {sec.content}
                    </p>
                  </div>
                </div>
              </GlassCard>
            ))}
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

            <ToSomButton href="/login" variant="dark" size="lg">
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