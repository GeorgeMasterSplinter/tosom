/**
 * ToSom — ReflectionBubble (Premium)
 * Dype spørsmål og refleksjonar i chat.
 * 
 * Design:
 * - Blå-glass bakgrunn (rgba(10,26,42,0.45))
 * - Gull-stjerne ikon
 * - Rolig typografi (17px, font-light)
 * - Microcopy: "Ta deg tid"
 */

"use client";

import React from "react";

/* ═══════════════════════════════════════
   THEME TOKENS
   ═══════════════════════════════════════ */

const G = {
  gold: "#D4AF37",
  textPrimary: "rgba(255,255,255,0.92)",
  textSecondary: "rgba(255,255,255,0.55)",
};

/* ═══════════════════════════════════════
   PROP-TYPE
   ═══════════════════════════════════════ */

interface ReflectionBubbleProps {
  question: string;
  subtitle?: string;
  className?: string;
}

/* ═══════════════════════════════════════
   HOVEDKOMPONENT — REFLECTIONBUBBLE
   ═══════════════════════════════════════ */

export function ReflectionBubble({ question, subtitle, className = "" }: ReflectionBubbleProps) {
  return (
    <div className={`flex justify-center py-3 ${className}`}>
      <div
        className="w-full max-w-[85%]"
        style={{
          background: "rgba(10,26,42,0.45)",
          border: `1px solid rgba(100,140,200,0.15)`,
          borderRadius: "20px",
          padding: "24px 20px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3), inset 0 0 24px rgba(10,26,42,0.2)",
        }}
      >
        <div className="flex items-start gap-3">
          {/* Gull stjerne-ikon */}
          <div
            className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
            style={{ background: "rgba(212,175,55,0.12)" }}
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L9.5 5.5L14 6L10.5 9.5L11.5 14L8 11.5L4.5 14L5.5 9.5L2 6L6.5 5.5L8 1Z" fill={G.gold} />
            </svg>
          </div>
          <div className="flex-1 text-center">
            <p
              className="leading-relaxed font-light"
              style={{ color: G.textPrimary, fontSize: "17px", fontWeight: 300, lineHeight: "1.6" }}
            >
              {question}
            </p>
            {subtitle && (
              <p
                className="text-xs mt-2 italic"
                style={{ color: G.textSecondary, opacity: 0.5 }}
              >
                {subtitle}
              </p>
            )}
            <p
              className="text-xs mt-3 italic"
              style={{ color: G.textSecondary, opacity: 0.6 }}
            >
              Ta deg tid
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReflectionBubble;