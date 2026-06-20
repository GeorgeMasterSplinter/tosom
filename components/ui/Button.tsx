/* ═══════════════════════════════════════════
   ToSom Premium — Button Component
   Primary · Secondary · Ghost
   ═══════════════════════════════════════════ */

import { ButtonHTMLAttributes, forwardRef } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  href?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--ts-gold)] text-[var(--ts-bg-primary)] shadow-[var(--ts-shadow-gold)] hover:bg-[var(--ts-gold-light)] hover:shadow-[var(--ts-shadow-gold-hover)] hover:-translate-y-[1px]",
  secondary:
    "bg-[var(--ts-glass-bg)] text-[var(--ts-text-primary)] border border-[var(--ts-glass-border)] backdrop-blur-[var(--ts-glass-blur)] hover:bg-[var(--ts-glass-bg-hover)] hover:border-[var(--ts-glass-border-hover)] hover:-translate-y-[1px]",
  ghost:
    "bg-transparent text-[var(--ts-text-muted)] hover:text-[var(--ts-text-primary)] hover:bg-[var(--ts-glass-bg)]",
};

const sizeClasses: Record<"sm" | "md" | "lg", string> = {
  sm: "px-3 py-2 text-sm",
  md: "px-5 py-3 text-base",
  lg: "px-6 py-4 text-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className = "", children, href, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center rounded-[var(--ts-radius-md)] font-medium border-none cursor-pointer transition-all duration-[var(--ts-transition-fast)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ts-gold)]/50 focus-visible:ring-offset-2";
    const classes = `${base} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim();

    if (href) {
      return (
        <a href={href} className={classes} ref={ref as any}>
          {children}
        </a>
      );
    }

    return (
      <button className={classes} ref={ref} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
