/**
 * Tosom AuthCTA — Unified authentication CTA component
 *
 * Compact premium gold + dark glass buttons with consistent branding.
 * Replaces all inline CTAs throughout the app.
 */

'use client';

import Link from 'next/link';

export function AuthCTA() {
  return (
    <section className="py-24 md:py-32 text-center max-w-xl mx-auto space-y-8">
      <h2 className="text-3xl md:text-[38px] font-bold tracking-tight text-white">
        Klar til å starte?
      </h2>

      <p className="text-base md:text-lg text-white/70 leading-relaxed px-6">
        Lag profilen din i ditt eget tempo og møt noen som faktisk passer deg — på ordentlig.
      </p>

      <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-6 px-6">
        {/* Primær — gullknapp */}
        <Link
          href="/register"
          className="
            px-5 py-2.5 rounded-lg font-semibold text-sm
            bg-[#D4AF37] text-black
            hover:bg-[#C49F2F]
            shadow-[0_0_20px_rgba(212,175,55,0.20)]
            transition-all duration-200 ease-out
          "
        >
          Start reisen
        </Link>

        {/* Sekundær — glassmorfisk */}
        <Link
          href="/login"
          className="
            px-5 py-2.5 rounded-lg font-semibold text-sm
            bg-black/40 text-white
            border border-white/10
            hover:bg-black/60
            transition-all duration-200 ease-out
          "
        >
          Logg inn
        </Link>
      </div>
    </section>
  );
}

export default AuthCTA;