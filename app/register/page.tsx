/**
 * ToSom — Registreringsside
 * 
 * Premium ToSom-design: 3 glasspaneler, Nordic Deep Blue theme.
 * Designprofil identisk med landing-siden.
 */

'use client';

import Link from 'next/link';
import { AgeBadge } from '@/components/ui/age-badge/AgeBadge';

export default function RegisterPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#0B1520] via-[#121E2E] to-[#0B1520]">
      {/* Spotlight overlay — identisk med landing */}
      <div
        className="absolute inset-0 bg-white/5 blur-3xl opacity-[0.06] pointer-events-none"
      />

      <main className="relative z-10 px-4 sm:px-6 md:px-12 lg:px-24 py-12 sm:py-20 md:py-32 flex flex-col items-center gap-12 sm:gap-16">

        {/* Panel — Hvorfor Vipps Login og Vipps betaling? */}
        <div className="
          w-full max-w-3xl mx-auto
          bg-white/5 backdrop-blur-md
          rounded-2xl
          px-4 sm:px-6 md:px-10 lg:px-12
          space-y-6
          text-center items-center
          shadow-xl shadow-black/20
        ">
          <div className="flex items-center justify-center gap-3">
              <h2 className="text-4xl md:text-5xl font-light text-[#D4AF37] tracking-wide">
                Hvorfor Vipps Login og Vipps betaling?
              </h2>
            <div className="hidden sm:block">
              <AgeBadge />
            </div>
          </div>

          <p className="text-white/70 leading-relaxed max-w-xl">
            ToSom er bygget for voksne mennesker som ønsker en trygg, rolig og ekte prosess.
            Derfor bruker vi Vipps både til innlogging og betaling.
          </p>

          <ul className="flex flex-col items-center gap-3 text-white/80 font-light">
            <li className="flex items-center gap-3">
              <span className="text-[#D4AF37]">✓</span>
              <span className="text-white/80">Verifisert identitet – ingen fake profiler</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-[#D4AF37]">✓</span>
              <span className="text-white/80">Ekte fødselsdato – trygg alderskontroll</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-[#D4AF37]">✓</span>
              <span className="text-white/80">Ingen duplikat-brukere – én person, én profil</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-[#D4AF37]">✓</span>
              <span className="text-white/80">Norsk sikkerhetsstandard – trygg betalingsflyt</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-[#D4AF37]">✓</span>
              <span className="text-white/80">Ingen skjulte gebyrer – én pris, ingen stress</span>
            </li>
          </ul>

          <p className="text-white/70 leading-relaxed max-w-xl">
            Vipps gjør ToSom til en trygg plattform for voksne mennesker som ønsker en ekte reise.
          </p>
        </div>

        {/* Panel 2 — Pris */}
        <div className="
          w-full max-w-3xl mx-auto
          bg-white/5 backdrop-blur-md
          rounded-2xl
          px-4 sm:px-6 md:px-10 lg:px-12
          space-y-6
          items-center text-center
          shadow-xl shadow-black/20
        ">
          <h2 className="text-4xl md:text-5xl font-light text-[#D4AF37] tracking-wide">
            Én pris. Alt inkludert.
          </h2>

          <div className="
            bg-[rgba(212,175,55,0.08)]
            backdrop-blur-md
            rounded-xl
            p-8
            flex flex-col gap-4
            items-center text-center
            max-w-md w-full
          ">
            <div className="text-4xl md:text-5xl font-light text-[#D4AF37] tracking-wide">
              349 kr
            </div>

            <p className="text-white/70 leading-relaxed max-w-sm">
              ToSom — full tilgang. Betales én gang og dekker hele reisen.
            </p>

            <div className="
              bg-[rgba(212,175,55,0.12)]
              text-white/70
              rounded-lg
              px-5 py-4
              text-sm
              leading-relaxed
              w-full text-center
            ">
              Betalingsløsning er under utvikling.
              <br />
              <span className="text-xs text-white/60">
                ToSom er i begrenset testfase.
              </span>
            </div>
          </div>

          <div className="mt-10">
            <Link
              href="/login"
              className="
                block mx-auto text-center
                bg-[#0B0E11]/80
                hover:bg-[#0B0E11]/60
                text-white/80
                hover:text-white
                font-light tracking-wide
                py-4 px-8
                rounded-xl
                backdrop-blur-md
                shadow-md shadow-black/20
                transition-all duration-200
                w-fit
              "
            >
              Allerede registrert? Logg inn
            </Link>
          </div>
        </div>

      </main>
    </div>
  );
}