/**
 * ToSom — Registreringsside
 * 
 * Full ToSom-premium: ingen borders, midtstilt ikon-seksjoner, gull Vipps.
 */

'use client';

import Link from 'next/link';
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
    title: 'Dyp, privat profil',
    description: 'Svar på dype spørsmål i ditt eget tempo. Ingen bilder før etter 14 dager.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L15 8L21 9L16.5 14L18 21L12 17.5L6 21L7.5 14L3 9L9 8L12 2Z" stroke={color.brand.gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Én match per 24 timer',
    description: 'Du får den beste kompatibilitetsmatchen din. Ingen sveiping, ingen valgstress.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <path d="M4 4H20V20H4V4Z" stroke={color.brand.gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 8H16M8 12H16M8 16H12" stroke={color.brand.gold} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: '30-dagers reise',
    description: 'Guidede samtaler, refleksjoner og oppgaver som faktisk hjelper dere å bli kjent.',
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

      <main className="relative z-10 py-20 md:py-32 px-6">

        {/* Borderless glass container */}
        <div className="
          bg-white/5
          backdrop-blur-xl
          rounded-2xl
          shadow-xl shadow-black/30
          p-10 md:p-14
          max-w-3xl mx-auto
          flex flex-col gap-12
          text-white/80
          font-light tracking-wide leading-relaxed
        ">

          {/* Hovedtittel */}
          <div className="text-center">
            <h1 className="
              text-5xl md:text-7xl
              font-light
              tracking-wide
              text-[#D4AF37]
              text-center
            ">
              Kom i gang
            </h1>
            <p className="
              text-base md:text-lg
              text-white/80
              leading-relaxed
              max-w-xl
              mx-auto
              mt-6
            ">
              ToSom er en rolig, moden måte å møtes på. Lag profilen din, få din match, og gå inn i en guidet 30-dagers reise sammen.
            </p>
          </div>

          {/* Features (midtstilt, ingen borders) */}
          <div className="flex flex-col gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="
                  bg-white/5
                  backdrop-blur-md
                  rounded-xl
                  p-6
                  flex flex-col items-center text-center gap-3
                  shadow-lg shadow-black/20
                "
              >
                <div
                  className="
                    w-12 h-12
                    rounded-xl
                    flex items-center justify-center
                  "
                  style={{
                    background: color.glass.goldBg,
                  }}
                >
                  {feature.icon}
                </div>
                <h3 className="
                  text-lg
                  font-light
                  tracking-wide
                  leading-relaxed
                  text-white/80
                ">
                  {feature.title}
                </h3>
                <p className="
                  text-sm
                  text-white/80
                  leading-relaxed
                  font-light
                  tracking-wide
                ">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Vipps forklaring */}
          <div className="
            bg-white/5 backdrop-blur-xl rounded-2xl
            shadow-xl shadow-black/30
            p-8 md:p-10
            flex flex-col gap-6
            items-center text-center
            text-white/80 font-light tracking-wide leading-relaxed
            max-w-2xl mx-auto
          ">
            <h2 className="text-3xl md:text-4xl font-light text-[#D4AF37] tracking-wide">
              Hvorfor Vipps Login og Vipps betaling?
            </h2>

            <p className="max-w-xl">
              ToSom er bygget for voksne mennesker som ønsker en trygg, rolig og ekte prosess.
              Derfor bruker vi Vipps både til innlogging og betaling.
            </p>

            <ul className="flex flex-col gap-3 text-left max-w-xl">
              <li>✓ Verifisert identitet – ingen fake profiler</li>
              <li>✓ Ekte fødselsdato – trygg alderskontroll</li>
              <li>✓ Ingen duplikat‑brukere – én person, én profil</li>
              <li>✓ Norsk sikkerhetsstandard – trygg betalingsflyt</li>
              <li>✓ Ingen skjulte gebyrer – én pris, ingen stress</li>
              <li>✓ Passer perfekt med ToSom sin rolige, modne plattform</li>
            </ul>

            <p className="max-w-xl text-white/70">
              Vipps gjør ToSom til en trygg plattform for voksne mennesker som ønsker en ekte reise.
            </p>
          </div>

          {/* CTA */}
          <div className="flex flex-col gap-6 mt-10 max-w-sm mx-auto">

            <Link
              href="/register/vipps"
              className="
                w-full text-center
                px-5 py-3
                rounded-xl
                bg-[#D4AF37]/90
                hover:bg-[#D4AF37]
                text-black
                font-light tracking-wide
                shadow-lg shadow-black/40
                transition-all duration-300
              "
            >
              Fortsett med Vipps
            </Link>

            <Link
              href="/login"
              className="
                text-white/70 hover:text-white
                font-light tracking-wide
                text-center
                transition-all duration-200
              "
            >
              Logg inn
            </Link>

          </div>

        </div>

      </main>
    </div>
  );
}