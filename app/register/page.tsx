/**
 * ToSom — Registreringsside
 * 
 * Rolig intro for nye brukarar.
 * CTA peiker til /onboarding/start for å starte den dypte profilen.
 */

'use client';

import Link from 'next/link';
import { AuthCTA } from '@/components/auth/AuthCTA';
import { color } from '@/config/design-tokens';

/* ========================
   DATA
   ======================== */

const features = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <path d="M12 12C14.761 12 17 9.761 17 7C17 4.239 14.761 2 12 2C9.239 2 7 4.239 7 7C7 9.761 9.239 12 12 12Z" stroke={color.brand.gold} strokeWidth="1.5" />
        <path d="M3 21C3 17.134 7.029 13.5 12 13.5C16.971 13.5 21 17.134 21 21" stroke={color.brand.gold} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: 'Dypt, privat profil',
    description: 'Svar på djupe spørsmål i ditt eget tempo. Ingen bilder før etter 14 dager.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L15 8L21 9L16.5 14L18 21L12 17.5L6 21L7.5 14L3 9L9 8L12 2Z" stroke={color.brand.gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Én match per 24 timer',
    description: 'Du får den beste kompatibilitets-matchen din. Ingen swiping, ingen valg-stress.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <path d="M4 4H20V20H4V4Z" stroke={color.brand.gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 8H16M8 12H16M8 16H12" stroke={color.brand.gold} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: '30-dagers reise',
    description: 'Guidede samtaler, refleksjonar og oppgåver som faktisk hjelper dere å bli kjent.',
  },
];

/* ========================
   PAGE
   ======================== */

export default function RegisterPage() {
  return (
    <div className="min-h-screen" style={{ background: color.bg.primary }}>
      {/* Ambient glow */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 50% 20%, ${color.glass.goldBg}, transparent 70%),
            radial-gradient(ellipse 80% 60% at 30% 80%, ${color.ambient.blue.medium}, transparent 65%)
          `,
        }}
      />

      <main className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 py-20 md:py-32">
        {/* Header */}
        <div className="text-center mb-16 md:mb-24">
          <span
            className="text-xs uppercase tracking-[0.3em] font-semibold mb-4 block"
            style={{ color: color.brand.gold }}
          >
            Kom i gang
          </span>
          <h1
            className="text-[36px] md:text-[52px] font-semibold tracking-tight text-white leading-[1.1] mb-6"
          >
            Start din ToSom-reise
          </h1>
          <p
            className="text-base md:text-lg text-white/70 leading-relaxed max-w-xl mx-auto px-4"
          >
            ToSom er en rolig, moden måte å møtes på. Lag profilen din, få din match, og gå inn i en guidet 30-dagers reise sammen.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-16 md:mb-24">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col items-center text-center gap-6"
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{
              background: color.glass.goldBg,
              border: `1px solid ${color.border.gold}`,
                }}
              >
                {feature.icon}
              </div>
              <h3
                className="text-lg font-semibold text-white"
              >
                {feature.title}
              </h3>
              <p
                className="text-sm text-white/60 leading-relaxed px-2"
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/onboarding/start"
            className="
              inline-block px-8 py-4 rounded-xl text-base font-semibold
              bg-[#D4AF37] text-black
              hover:bg-[#C49F2F]
              shadow-[0_0_25px_rgba(212,175,55,0.3),0_4px_12px_rgba(0,0,0,0.2)]
              border border-[rgba(212,175,55,0.5)]
              transition-all duration-200 ease-out
            "
            style={{
              background: color.brand.gold,
            }}
          >
            Start registrering
          </Link>
        </div>

        {/* AuthCTA for login */}
        <AuthCTA />
      </main>
    </div>
  );
}