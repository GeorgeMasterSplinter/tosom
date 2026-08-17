/* ═══════════════════════════════════════════
   Tosom Premium — Card Component
   Standard · Glass · Elevated
   ═══════════════════════════════════════════ */

import { HTMLProps, forwardRef } from "react";

export type CardVariant = "standard" | "glass" | "elevated";

export interface CardProps extends HTMLProps<HTMLDivElement> {
  variant?: CardVariant;
  padding?: "none" | "sm" | "md" | "lg" | "xl";
}

const variantClasses: Record<CardVariant, string> = {
  standard:
    "bg-[var(--ts-bg-surface)] border border-[var(--ts-border)] rounded-[var(--ts-radius-md)]",
  glass:
    "bg-[var(--ts-glass-bg)] border border-[var(--ts-glass-border)] backdrop-blur-[var(--ts-glass-blur)] rounded-[var(--ts-radius-lg)] shadow-[var(--ts-shadow-md)]",
  elevated:
    "bg-[var(--ts-bg-surface-elevated)] border border-[var(--ts-border)] rounded-[var(--ts-radius-2xl)] shadow-[var(--ts-shadow-lg)]",
};

const paddingClasses: Record<"none" | "sm" | "md" | "lg" | "xl", string> = {
  none: "p-0",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
  xl: "p-8",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = "standard", padding = "lg", className = "", children, ...props }, ref) => {
    const base =
      "transition-all duration-[var(--ts-transition-normal)] hover:border-[var(--ts-glass-border-hover)]";
    const classes = `${base} ${variantClasses[variant]} ${paddingClasses[padding]} ${className}`.trim();

    return (
      <div className={classes} ref={ref} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export default Card;
