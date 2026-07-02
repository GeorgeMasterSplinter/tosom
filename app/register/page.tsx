/**
 * ToSom — Registreringsside
 * 
 * Premium ToSom-design: 3 glasspaneler.
 */

'use client';

import Link from 'next/link';
import { color } from '@/config/design-tokens';

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

      <main className="relative z-10 py-20 md:py-32 px-6 flex flex-col items-center gap-16">

        {/* Panel 1 — Introduksjon + 3 punkter */}
        <div className="
          bg-white/5 backdrop-blur-xl rounded-2xl
          shadow-xl shadow-black/30
          p-10 md:p-14
          flex flex-col gap-10
          max-w-3xl mx-auto
          text-center items-center
        ">
          <h1 className="text-5xl md:text-6xl font-light text-[#D4AF37] tracking-wide">
            Kom i gang
          </h1>

          <p className="text-white/80 font-light max-w-xl leading-relaxed">
            ToSom er en rolig, moden måte å møtes på. Lag profilen din, få din match,
            og gå inn i en guidet 30-dagers reise sammen.
          </p>

          <div className="flex flex-col gap-6 text-white/80 font-light max-w-xl text-left">
            <div>
              <h3 className="text-xl font-light text-[#D4AF37]">Privat profil</h3>
              <p>Svar på dype spørsmål i ditt eget tempo. Ingen bilder før etter 14 dager.</p>
            </div>

            <div>
              <h3 className="text-xl font-light text-[#D4AF37]">Én match per 24 timer</h3>
              <p>Du får den beste kompatibilitetsmatchen din. Ingen sveiping, ingen valgstress.</p>
            </div>

            <div>
              <h3 className="text-xl font-light text-[#D4AF37]">30-dagers reise</h3>
              <p>Guiede samtaler, refleksjoner og oppgaver som faktisk hjelper dere å bli kjent.</p>
            </div>
          </div>
        </div>

        {/* Panel 2 — Vipps forklaring */}
        <div className="
          bg-white/5 backdrop-blur-xl rounded-2xl
          shadow-xl shadow-black/30
          p-10 md:p-14
          flex flex-col gap-10
          max-w-3xl mx-auto
          text-center items-center
        ">
          <h2 className="text-4xl md:text-5xl font-light text-[#D4AF37] tracking-wide">
            Hvorfor Vipps Login og Vipps betaling?
          </h2>

          <p className="text-white/80 font-light max-w-xl leading-relaxed">
            ToSom er bygget for voksne mennesker som ønsker en trygg, rolig og ekte prosess.
            Derfor bruker vi Vipps både til innlogging og betaling.
          </p>

          <ul className="flex flex-col gap-3 text-left max-w-xl text-white/80 font-light">
            <li>✓ Verifisert identitet – ingen fake profiler</li>
            <li>✓ Ekte fødselsdato – trygg alderskontroll</li>
            <li>✓ Ingen duplikat-brukere – én person, én profil</li>
            <li>✓ Norsk sikkerhetsstandard – trygg betalingsflyt</li>
            <li>✓ Ingen skjulte gebyrer – én pris, ingen stress</li>
            <li>✓ Passer perfekt med ToSom sin rolige, modne plattform</li>
          </ul>

          <p className="text-white/70 font-light max-w-xl">
            Vipps gjør ToSom til en trygg plattform for voksne mennesker som ønsker en ekte reise.
          </p>
        </div>

        {/* Panel 3 — Pris */}
        <div className="
          bg-white/5 backdrop-blur-xl rounded-2xl
          shadow-xl shadow-black/30
          p-10 md:p-14
          flex flex-col gap-10
          items-center text-center
          max-w-xl mx-auto
          text-white/80 font-light leading-relaxed
        ">
          <h2 className="text-3xl md:text-4xl font-light text-[#D4AF37] tracking-wide">
            Én pris. Alt inkludert.
          </h2>

          <div className="
            bg-[rgba(212,175,55,0.08)]
            backdrop-blur-md
            rounded-xl
            p-8
            flex flex-col gap-4
            items-center text-center
            border border-[rgba(212,175,55,0.25)]
            shadow-lg shadow-[rgba(212,175,55,0.15)]
          ">
            <div className="text-5xl md:text-6xl font-light text-[#D4AF37] tracking-wide">
              349 kr
            </div>

            <p className="text-white/80 font-light max-w-sm leading-relaxed">
              ToSom — full tilgang. Betales én gang og dekker hele reisen.
            </p>

            <div className="
              bg-[rgba(212,175,55,0.12)]
              border border-[rgba(212,175,55,0.20)]
              text-white/70
              rounded-lg
              px-5 py-4
              text-sm
              leading-relaxed
            ">
              Betalingsløsning er under utvikling.
              <br />
              <span className="text-xs text-white/50">
                ToSom er i begrenset testfase.
              </span>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}