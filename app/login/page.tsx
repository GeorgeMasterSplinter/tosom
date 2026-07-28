"use client";

import { ToSomButton } from "@/components/ui/system";
import { color, spacing, typographyToStyle, radius } from "@/config/design-tokens";

/* ========================
   INLINE SVG-ikoner
   ======================== */

function IconVipps() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.3 3.2H14v6.5l2.3-2.3V3.2zm-8.6 0H7.7v6.5L10 12V9.7L7.7 7.4V3.2zm8.6 1.7L13.7 9v6.3h2.6V4.9zM5.4 3.2H3.1v9.6l2.3-2.3V3.2zm0 11.9L3.1 12.8v6.1h2.3v-3.8zM7.7 12v2.3L10 16.6V12H7.7zm4.3 0v6.5h2.6v-2.3l2.3 2.3v-2.3l-2.3-2.3V12H12zm0 9.1H7.7v-2.3H5.4v2.3H3.1v2.3h2.3v2.3h2.3v-2.3H12v-2.3z" />
    </svg>
  );
}

function IconInfo() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

/* ========================
   PAGE COMPONENT
   ======================== */

export default function LoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Bakgrunn — Deep Blue gradient */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, #0B1520 0%, #121E2E 50%, #0B1520 100%)',
        }}
      />

      {/* Ambient glød — gold */}
      <div
        className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none opacity-15"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(212,175,55,0.08), transparent 70%)',
        }}
      />

      {/* Content — heist opp på sida */}
      <div className="relative z-10 pt-32 pb-24 px-6">
        <div className="mx-auto max-w-md">

          {/* Header */}
          <div className="text-center space-y-4 mb-8">
            <h1
              style={{
                ...typographyToStyle('heading-lg'),
                color: color.brand.gold,
                fontWeight: 300,
              }}
            >
              Velkommen tilbake
            </h1>

            <p
              style={{
                ...typographyToStyle('body'),
                color: color.text.secondary,
              }}
            >
              Logg inn med Vipps for å fortsette reisen din
            </p>
          </div>

          {/* ===== Primær CTA: Logg inn med Vipps ===== */}
          <div className="mb-8">
            <ToSomButton
              href="/api/auth/vipps"
              variant="gold"
              size="xl"
            >
              Logg inn med Vipps
            </ToSomButton>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 w-full mb-8">
            <div className="h-px bg-white/10 flex-1" />
            <span style={{ ...typographyToStyle('body-sm'), color: color.text.subtle }}>eller</span>
            <div className="h-px bg-white/10 flex-1" />
          </div>

          {/* Registrer deg — secondary variant */}
          <div className="mb-8">
            <ToSomButton
              href="/register"
              variant="secondary"
              size="lg"
            >
              Ikke registrert? Registrer deg nå
            </ToSomButton>
          </div>

          {/* Vipps-informasjon */}
          <div
            className="space-y-3 w-full"
            style={{
              background: 'rgba(212,175,55,0.04)',
              border: '1px solid rgba(212,175,55,0.12)',
              borderRadius: `${radius.lg}px`,
              padding: `${spacing.lg}px`,
            }}
          >
            <div className="flex items-center gap-2 justify-center">
              <IconInfo />
              <span
                style={{
                  ...typographyToStyle('body-sm'),
                  color: 'rgba(255,255,255,0.6)',
                }}
              >
                Vipps gir trygg innlogging og betaling
              </span>
            </div>
            <p
              style={{
                ...typographyToStyle('body-sm'),
                color: color.text.secondary,
                lineHeight: '1.7',
              }}
            >
              Vi bruker Vipps både til innlogging og betaling for å sikre at alle på plattformen er ekte. Så snart betalingsløsning er klar, kan du logge inn og starte reisen din.
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}