/**
 * ToSom — AgeBadge (21+ premium symbol)
 * 
 * Minimalistisk, gull, glassmorphism badge som signaliserer modenhet.
 */

export function AgeBadge() {
  return (
    <div
      title="21+ · Kun for voksne"
      className="
        inline-flex items-center justify-center
        w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14
        rounded-full
        bg-white/5 backdrop-blur-md
        border border-[rgba(212,175,55,0.2)]
        shadow-lg shadow-black/20
        text-[#D4AF37]
        text-xs sm:text-sm md:text-base font-light tracking-wide
        opacity-90 hover:opacity-100
        transition-all duration-300
        animate-[fadeInScale_0.6s_ease-out_both]
      "
    >
      21+
    </div>
  );
}

export default AgeBadge;