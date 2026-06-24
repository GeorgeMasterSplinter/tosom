/* ═══════════════════════════════════════════
   ToSom UI 6.0 — Button Component
   Primary · Secondary · Ghost
   Større, rolegare, premium, betre hover
   ═══════════════════════════════════════════ */

import { ButtonHTMLAttributes, forwardRef } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg" | "xl";
  href?: string;
}

/* ========================
   VARIANT KLASSAR
   ======================== */

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--ts-gold-accent)] text-[var(--ts-bg-premium)] shadow-[0_0_20px_rgba(212,175,55,0.15)] " +
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
   STØRRELSE KLASSAR
   ======================== */

const sizeClasses: Record<"sm" | "md" | "lg" | "xl", string> = {
  sm: "px-6 py-3 text-base",
  md: "px-6 py-3 text-base",
  lg: "px-14 py-4 text-lg",
  xl: "px-16 py-5 text-lg",
};

/* ========================
   COMPONENT
   ======================== */

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className = "", children, href, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center " +
      "font-[500] tracking-[-0.01em] rounded-[var(--ts-radius-6xl)] " +
      "border-none cursor-pointer " +
      "transition-all duration-[var(--ts-transition-ui6-ease)] " +
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ts-gold-accent)] focus-visible:ring-offset-3 " +
      sizeClasses[size] +
      " " +
      variantClasses[variant] +
      " " +
      className;

    const mergedClasses = base.trim();

    if (href) {
      return (
        <a href={href} className={mergedClasses} ref={ref as any}>
          {children}
        </a>
      );
    }

    return (
      <button className={mergedClasses} ref={ref} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
