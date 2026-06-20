"use client";

/* ═══════════════════════════════════════════
   ToSom Premium — SectionCTA
   Call-to-action seksjon med glassmorphism
   ═══════════════════════════════════════════ */

import { Button } from "@/components/ui/Button";

interface SectionCTAProps {
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  gradient?: string;
  className?: string;
}

const defaultGradient =
  "radial-gradient(ellipse 80% 50% at 50% 100%, rgba(212, 175, 55, 0.06), transparent)";

export const SectionCTA = ({
  title,
  subtitle,
  ctaLabel,
  ctaHref,
  gradient = defaultGradient,
  className = "",
}: SectionCTAProps) => {
  return (
    <section
      className={`relative py-20 md:py-28 ${className}`}
      style={{ background: gradient }}
    >
      <div className="mx-auto max-w-2xl px-6 text-center">
        <div
          className="rounded-2xl border p-10 md:p-14 animate-fadeInUp"
          style={{
            background: "rgba(10, 15, 31, 0.4)",
            borderColor: "rgba(212, 175, 55, 0.15)",
            backdropFilter: "blur(12px)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
          }}
        >
          <h2
            className="mb-4 text-ts-text-primary"
            style={{ fontSize: "clamp(24px, 3vw, 32px)" }}
          >
            {title}
          </h2>

          <p
            className="mb-8 text-ts-text-muted"
            style={{ fontSize: "16px", lineHeight: "1.7" }}
          >
            {subtitle}
          </p>

          <Button variant="primary" size="lg" href={ctaHref}>
            {ctaLabel}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SectionCTA;
