/**
 * ToSom GlobalCTA — Reusable two-button CTA component
 * 
 * Gold button (Opprett konto) + Dark glass button (Logg inn)
 * Ultra-premium: harmonert spotlight, vertikal rytme, typografi, radius.
 */

'use client';

export function GlobalCTA() {
  return (
    <section className="w-full py-40 md:py-52 pb-10 md:pb-16">
      <div className="max-w-[900px] mx-auto text-center space-y-12 relative after:absolute after:inset-0 after:top-[60%] after:bg-white/5 after:blur-[100px] after:content-[''] after:pointer-events-none">
        <h2 className="text-5xl md:text-6xl font-bold text-white tracking-tight leading-[1.1] animate-riseIn">
          Klar til å starte?
        </h2>
        <p className="text-[22px] md:text-[26px] text-white/90 max-w-[700px] mx-auto leading-relaxed animate-fadeUp delay-[120ms]">
          Lag profilen din i ditt eget tempo og møt noen som faktisk passer deg – på ordentlig.
        </p>
        <div className="w-full space-y-8 pt-10 relative z-10">
          <a
            href="/onboarding/start"
            className="
              block w-full text-center
              py-8 md:py-9
              text-2xl md:text-[28px]
              font-semibold
              tracking-[0.02em]
              rounded-3xl
              bg-[#D4AF37]
              hover:bg-[#C49F2F]
              shadow-[0_0_40px_rgba(212,175,55,0.30)]
              hover:shadow-[0_0_65px_rgba(212,175,55,0.45)]
              hover:animate-microBounce
              transition
            "
          >
            Opprett konto
          </a>
          <a
            href="/login"
            className="
              block w-full text-center
              py-8 md:py-9
              text-2xl md:text-[28px]
              font-semibold
              rounded-3xl
              bg-black/70
              hover:bg-black/80
              hover:animate-microBounce
              transition
            "
          >
            Logg inn
          </a>
        </div>
      </div>
    </section>
  );
}

export default GlobalCTA;