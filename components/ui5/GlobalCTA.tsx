/**
 * ToSom GlobalCTA — Reusable two-button CTA component
 * 
 * Gold button (Opprett konto) + Dark glass button (Logg inn)
 * Matches Hero width (900px), height (py-20/md:py-28), and typography.
 */

'use client';

export function GlobalCTA() {
  return (
    <section className="w-full py-32 md:py-40 pb-10 md:pb-16">
      <div className="max-w-[900px] mx-auto text-center space-y-10">
        <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-[1.1]">
          Klar til å starte?
        </h2>
        <p className="text-xl md:text-2xl text-white/80 max-w-[700px] mx-auto leading-relaxed">
          Lag profilen din i ditt eget tempo og møt noen som faktisk passer deg – på ordentlig.
        </p>
        <div className="w-full space-y-6 pt-8">
          <a
            href="/onboarding/start"
            className="block w-full text-center py-7 md:py-8 text-2xl md:text-[26px] font-bold rounded-3xl bg-[#D4AF37] hover:bg-[#C49F2F] shadow-[0_0_35px_rgba(212,175,55,0.25)] hover:shadow-[0_0_45px_rgba(212,175,55,0.35)] transition"
          >
            Opprett konto
          </a>
          <a
            href="/login"
            className="block w-full text-center py-7 md:py-8 text-2xl md:text-[26px] font-bold rounded-3xl bg-black/60 hover:bg-black/75 transition"
          >
            Logg inn
          </a>
        </div>
      </div>
    </section>
  );
}

export default GlobalCTA;