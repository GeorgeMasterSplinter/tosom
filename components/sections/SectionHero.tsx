"use client";

/* ═══════════════════════════════════════════
   ToSom Premium — SectionHero
   Full-width hero med glassmorphism-panel
   ═══════════════════════════════════════════ */

import { ReactNode } from "react";
import { Button } from "@/components/ui/Button";

interface SectionHeroProps {
  badge?: string;
  title: string;
  subtitle: string;
  ctaLabel?: string;
  ctaHref?: string;
  ctaSecondaryLabel?: string;
  ctaSecondaryHref?: string;
  actions?: ReactNode;
  gradient?: string;
  className?: string;
}

const defaultGradient =
  "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(74, 123, 167, 0.12), transparent), radial-gradient(ellipse 60% 40% at 50% 120%, rgba(212, 175, 55, 0.05), transparent)";

export const SectionHero = ({
  badge,
  title,
  subtitle,
  ctaLabel,
  ctaHref,
  ctaSecondaryLabel,
  ctaSecondaryHref,
  actions,
  gradient = defaultGradient,
  className = "",
}: SectionHeroProps) => {
  return (
    <section
      className={`relative flex items-center justify-center py-24 md:py-36 overflow-hidden ${className}`}
      style={{
        background: gradient,
      }}
    >
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        {badge && (
          <p
            className="mb-6 tracking-widest text-xs uppercase font-medium animate-fadeInUp"
            style={{ color: "var(--ts-gold)" }}
          >
            {badge}
          </p>
        )}

        <h1
          className="mb-6 leading-tight text-ts-text-primary animate-fadeInUp"
          style={{ fontSize: "clamp(32px, 5vw, 48px)" }}
        >
          {title}
        </h1>

        <p
          className="mx-auto mb-10 max-w-xl text-ts-text-muted animate-fadeInUp"
          style={{ fontSize: "18px", lineHeight: "1.7" }}
        >
          {subtitle}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeInUp">
          {ctaLabel && ctaHref && (
            <Button variant="primary" size="lg" href={ctaHref}>
              {ctaLabel}
            </Button>
          )}

          {ctaSecondaryLabel && ctaSecondaryHref && (
            <Button variant="secondary" size="lg" href={ctaSecondaryHref}>
              {ctaSecondaryLabel}
            </Button>
          )}

          {actions}
        </div>
      </div>

      {/* Subtil bakgrunns-sirkulær tekstur */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.03) 0%, transparent 70%)",
        }}
      />
    </section>
  );
};

export default SectionHero;
