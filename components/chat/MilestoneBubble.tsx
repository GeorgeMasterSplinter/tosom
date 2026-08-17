/**
 * Tosom — MilestoneBubble (Premium)
 * Viktige øyeblikk og markederingar i chat-journey.
 * 
 * Design:
 * - Gull-glow effekt
 * - Stor typografi
 * - Soft-land animasjon
 */

"use client";

import React, { useEffect, useRef } from "react";

/* ═══════════════════════════════════════
   THEME TOKENS
   ═══════════════════════════════════════ */

const G = {
  gold: "#D4AF37",
  goldLight: "#E8C766",
  goldMuted: "rgba(212,175,55,0.2)",
  textPrimary: "rgba(255,255,255,0.92)",
  textSecondary: "rgba(255,255,255,0.55)",
};

/* ═══════════════════════════════════════
   PROP-TYPE
   ═══════════════════════════════════════ */

interface MilestoneBubbleProps {
  day: number;
  title: string;
  subtitle?: string;
  icon?: "star" | "heart" | "sparkle" | "trophy";
  className?: string;
}

/* ═══════════════════════════════════════
   ICON MAPPING
   ═══════════════════════════════════════ */

function MilestoneIcon({ type }: { type: "star" | "heart" | "sparkle" | "trophy" }) {
  switch (type) {
    case "star":
      return (
        <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
          <path d="M8 1L9.5 5.5L14 6L10.5 9.5L11.5 14L8 11.5L4.5 14L5.5 9.5L2 6L6.5 5.5L8 1Z" fill="#0B1520" />
        </svg>
      );
    case "heart":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#0B1520">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      );
    case "sparkle":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#0B1520">
          <path d="M12 0L14.59 8.41L23 12L14.59 15.59L12 24L9.41 15.59L1 12L9.41 8.41L12 0Z" />
        </svg>
      );
    case "trophy":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#0B1520">
          <path d="M19 5H17V3H5V5H3C1.9 5 1 5.9 1 7V8C1 10.55 2.92 12.63 5.36 12.94C6.09 14.44 7.43 15.63 9.11 16.23V17H5V19H15V17H11.11C12.79 16.37 14.13 15.18 14.86 13.68C17.28 13.35 19 11.27 19 8.5V7H21V5H19ZM3 8.5V7.5H5V11.87C3.84 11.56 3 10.38 3 8.5ZM21 8.5C21 10.38 20.16 11.56 19 11.87V7.5H21V8.5Z" />
        </svg>
      );
  }
}

/* ═══════════════════════════════════════
   HOVEDKOMPONENT — MILESTONEBUBBLE
   ═══════════════════════════════════════ */

export function MilestoneBubble({
  day,
  title,
  subtitle,
  icon = "sparkle",
  className = "",
}: MilestoneBubbleProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Soft-land animasjon ved lasting
  useEffect(() => {
    if (ref.current) {
      ref.current.style.animation = "softLand 0.45s ease-out forwards";
    }
  }, []);

  return (
    <div className={`flex justify-center py-4 ${className}`}>
      <div
        ref={ref}
        className="w-full max-w-[80%] text-center"
        style={{
          background: `linear-gradient(135deg, rgba(212,175,55,0.08), rgba(212,175,55,0.03))`,
          border: `1px solid rgba(212,175,55,0.2)`,
          borderRadius: "20px",
          padding: "28px 24px",
          boxShadow: "0 4px 24px rgba(212,175,55,0.1), 0 2px 8px rgba(0,0,0,0.15)",
        }}
      >
        {/* Gull-glow sirkel */}
        <div
          className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${G.gold}, ${G.goldLight})`,
            boxShadow: `0 0 24px rgba(212,175,55,0.3), 0 0 48px rgba(212,175,55,0.1)`,
          }}
        >
          <MilestoneIcon type={icon} />
        </div>

        {/* Dag-badge */}
        <p
          className="text-xs font-medium uppercase tracking-widest mb-2"
          style={{ color: G.gold, letterSpacing: "0.1em" }}
        >
          Dag {day} av 30
        </p>

        {/* Tittel — stor typografi */}
        <h3
          className="text-xl font-semibold mb-1"
          style={{ color: G.textPrimary, letterSpacing: "-0.01em" }}
        >
          {title}
        </h3>

        {/* Undertekst — optional */}
        {subtitle && (
          <p
            className="text-sm"
            style={{ color: G.textSecondary }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   CSS ANIMASJONAR
   ═══════════════════════════════════════ */

export function MilestoneBubbleStyles() {
  return (
    <style>{`
      @keyframes softLand {
        0% {
          opacity: 0;
          transform: translateY(16px) scale(0.96);
        }
        100% {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
    `}</style>
  );
}

export default MilestoneBubble;