import clsx from "clsx";

export type ButtonVariant = "primary" | "secondary" | "ghost";

interface PremiumButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: React.ReactNode;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--color-gold)] text-[var(--color-bg)] font-medium " +
    "hover:bg-[var(--color-gold)]/90 active:scale-[0.98] " +
    "border border-[var(--color-gold)]",
  secondary:
    "bg-transparent text-[var(--color-gold)] font-medium " +
    "border border-[var(--color-gold)] hover:bg-[var(--color-gold)]/10 active:scale-[0.98]",
  ghost:
    "bg-transparent text-[var(--color-muted)] font-medium " +
    "hover:text-[var(--color-text)] hover:bg-white/[0.05] active:scale-[0.98]",
};

export default function PremiumButton({
  variant = "primary",
  children,
  className = "",
  ...props
}: PremiumButtonProps) {
  return (
    <button
      className={clsx(
        // Base
        "inline-flex items-center justify-center gap-2 " +
        "rounded-full px-6 py-3 text-sm font-medium " +
        "transition-all duration-200 ease-out",
        // Shadow for primary
        variant === "primary" && "shadow-[0_4px_12px_rgba(212,175,55,0.2)] hover:shadow-[0_6px_16px_rgba(212,175,55,0.3)]",
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