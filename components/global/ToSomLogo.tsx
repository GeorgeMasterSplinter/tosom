/**
 * Tosom — Global Logo Component
 *
 * Canonical ToSom-logo (RT1 D3): samme to-sirkler-resonansmerke som
 * landing-hero, footer og header (UniversalMenu). Statisk variant for
 * header/dashboard (ingen orbit-animasjon).
 * Importer fra "@/components/global/ToSomLogo" for konsistent branding.
 */

"use client";

import { FC } from "react";
import { ResonanceMark } from "@/components/branding/LogoVariants";
import Link from "next/link";

interface ToSomLogoProps {
  href?: string;
  showTagline?: boolean;
  className?: string;
  /** Størrelse på resonansmerket i px. Standard: 44. */
  size?: number;
}

/**
 * Stacked logo med "Made in Norway" under.
 * To sirkler (resonansmerket) — canonical merke, ikke wordmark.
 */
export const ToSomLogo: FC<ToSomLogoProps> = ({
  href = "/",
  showTagline = true,
  className = "",
  size = 44,
}) => {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center ${className}`}
      aria-label="Tosom — Bygget for ekte relasjoner"
    >
      <ResonanceMark size={size} strokeWidth={1.5} glow resonate />
      {showTagline && (
        <span
          className="mt-3 text-xs font-medium tracking-[0.3em] uppercase"
          style={{ color: "rgba(212,175,55,0.55)" }}
        >
          Made in Norway
        </span>
      )}
    </Link>
  );
};

export default ToSomLogo;
