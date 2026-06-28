// ⚠️  EXPERIMENTAL — Premium feature not yet launched. Do not use in production.
// TODO: Flytt til egen branch eller fjern. Eksperimentell kode — Fase 1 marking.
import clsx from "clsx";
// TODO: Flytte til egen branch eller fjerne. Eksperimentell kode — Fase 1 marking.

export type ButtonVariant = "primary" | "secondary" | "ghost";

interface PremiumButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg" | "xl";
  children: React.ReactNode;
}

/* ========================
   VARIANTAR – UI 6.0
   ======================== */

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--ts-gold-accent)] text-[var(--ts-bg-premium)] " +
    "shadow-[0_0_20px_rgba(212,175,55,0.15)] " +
    "hover:bg-[#d8b878] hover:shadow-[var(--ts-shadow-glow)] " +
    "active:scale-[0.99] active:opacity-90",
  secondary:
    "bg-[rgba(255,255,255,0.06)] text-[var(--ts-text-white)] " +
    "border border-[rgba(255,255,255,0.12)] " +
    "hover:bg-[rgba(255,255,255,0.10)] hover:border-[rgba(255,255,255,0.18)] " +
    "active:scale-[0.99]",
  ghost:
    "bg-transparent text-[var(--ts-text-gray)] " +
    "hover:text-[var(--ts-text-white)] hover:bg-[rgba(255,255,255,0.04)] " +
    "active:scale-[0.99]",
};

/* ========================
   STØRRELSE – UI 6.0
   ======================== */

const sizes: Record<string, string> = {
  sm: "px-6 py-3 text-base",
  md: "px-6 py-3 text-base",
  lg: "px-14 py-4 text-lg",
  xl: "px-16 py-5 text-lg",
};

export default function PremiumButton({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}: PremiumButtonProps) {
  return (
    <button
      className={clsx(
        // Base – UI 6.0
        "inline-flex items-center justify-center gap-2 " +
        "font-[500] tracking-[-0.01em] rounded-[var(--ts-radius-6xl)] " +
        "border-none cursor-pointer " +
        "transition-all duration-[var(--ts-transition-ui6-ease)] " +
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ts-gold-accent)] focus-visible:ring-offset-3 " +
        sizes[size] +
        " " +
        // Shadow for primary
        variant === "primary" && "shadow-[0_0_20px_rgba(212,175,55,0.15)] ",
        // Variant
        variants[variant],
        // User className
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
// ⚠️  EXPERIMENTAL — Premium feature not yet launched. Do not use in production.
