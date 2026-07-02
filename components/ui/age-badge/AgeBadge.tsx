/**
 * ToSom — AgeBadge (23+ premium symbol)
 * 
 * Minimalistisk, gull, glassmorphism badge som signaliserer modenhet.
 */

export function AgeBadge() {
  return (
    <div
      title="23+ · Kun for voksne"
      className="
        inline-flex items-center justify-center
        w-10 h-10 sm:w-12 sm:h-12
        rounded-full
        bg-white/5 backdrop-blur-md
        border border-white/10
        shadow-lg shadow-black/20
        text-[#D4AF37]
        text-xs sm:text-sm font-light tracking-wide
        opacity-80 hover:opacity-100
        transition-all duration-300
        animate-[fadeInScale_0.6s_ease-out_both]
      "
    >
      23+
    </div>
  );
}

export default AgeBadge;