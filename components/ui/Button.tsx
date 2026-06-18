import React from "react";
import clsx from "clsx";

type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "subtle" | "destructive";
  loading?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  children,
  variant = "primary",
  loading = false,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={clsx(
        // Base — CSS variable-driven
        "relative px-[var(--space-md)] py-[var(--space-sm)] rounded-[var(--radius-md)] font-medium",
        "transition-all [var(--transition-normal)] ease-out",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/40",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        // Glass layer
        "backdrop-blur-md border border-[var(--glass-border)]",
        // Variant
        {
          // PRIMARY — Gold Premium
          primary:
            variant === "primary" &&
            "bg-[var(--color-gold)] text-[var(--color-bg)] shadow-[var(--shadow-gold)] hover:bg-[var(--color-gold-light)] hover:shadow-[var(--shadow-gold-hover)] active:scale-[0.97]",

          // SECONDARY — Dark Nordic Glass
          secondary:
            variant === "secondary" &&
            "bg-[var(--glass-bg)] text-[var(--color-text)] hover:bg-[var(--glass-bg-hover)] hover:border-[var(--glass-border-hover)] active:scale-[0.97]",

          // GHOST — Invisible until hover
          ghost:
            variant === "ghost" &&
            "bg-transparent text-[var(--color-text)] hover:bg-[var(--glass-bg)] active:scale-[0.97]",

          // SUBTLE — Soft, elegant, minimal
          subtle:
            variant === "subtle" &&
            "bg-[var(--glass-bg)] text-[var(--color-text)] hover:bg-[var(--glass-bg-hover)] border-[var(--glass-border)] active:scale-[0.97]",

          // DESTRUCTIVE — Nordic Red
          destructive:
            variant === "destructive" &&
            "bg-[var(--color-error)]/80 text-white hover:bg-[var(--color-error)] active:scale-[0.97]",
        }[variant],
        className
      )}
    >
      {/* Loading spinner */}
      {loading && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
      )}

      <span className={loading ? "opacity-0" : "opacity-100"}>{children}</span>
    </button>
  );
}
