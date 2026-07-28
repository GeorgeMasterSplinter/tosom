/**
 * ToSom — TaskBubble (Premium)
 * Guidet oppgåve-kort for chat-journey.
 * 
 * Design:
 * - Glassmorphism med gull-aksent
 * - 20px border-radius
 * - Gull-ikon (stjerne)
 * - Store gull-knappar for choices
 */

"use client";

import React from "react";

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

export interface TaskChoice {
  label: string;
  value: string;
}

interface TaskBubbleProps {
  title?: string;
  prompt: string;
  choices?: TaskChoice[];
  onChoose?: (value: string) => void;
  className?: string;
}

/* ═══════════════════════════════════════
   PREMIUM BUTTON (gull)
   ═══════════════════════════════════════ */

function GoldButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="transition-all duration-300 hover:brightness-110 active:scale-[0.98] focus:outline-none"
      style={{
        background: `linear-gradient(135deg, ${G.gold}, ${G.goldLight})`,
        color: "#0B1520",
        borderRadius: "12px",
        height: "40px",
        padding: "0 16px",
        fontSize: "13px",
        fontWeight: 600,
      }}
    >
      {children}
    </button>
  );
}

/* ═══════════════════════════════════════
   HOVEDKOMPONENT — TASKBUBBLE
   ═══════════════════════════════════════ */

export function TaskBubble({ title, prompt, choices, onChoose, className = "" }: TaskBubbleProps) {
  return (
    <div className={`flex justify-center py-3 ${className}`}>
      <div
        className="w-full max-w-[90%]"
        style={{
          background: "rgba(212,175,55,0.04)",
          border: `1px solid rgba(212,175,55,0.18)`,
          borderRadius: "20px",
          padding: "20px",
          boxShadow: "0 4px 20px rgba(212,175,55,0.08), 0 2px 8px rgba(0,0,0,0.15)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Task header */}
        <div className="flex items-start gap-3 mb-3">
          {/* Gull stjerne-ikon */}
          <div
            className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${G.gold}, ${G.goldLight})`,
              boxShadow: `0 0 12px rgba(212,175,55,0.25)`,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L9.5 5.5L14 6L10.5 9.5L11.5 14L8 11.5L4.5 14L5.5 9.5L2 6L6.5 5.5L8 1Z" fill="#0B1520" />
            </svg>
          </div>
          <div className="flex-1">
            {title && (
              <p
                className="text-sm font-semibold mb-0.5"
                style={{ color: G.gold, letterSpacing: "0.04em" }}
              >
                {title}
              </p>
            )}
            <p
              className="text-sm leading-relaxed"
              style={{ color: G.textSecondary, fontSize: "15px" }}
            >
              {prompt}
            </p>
          </div>
        </div>

        {/* Choices — store gull-knappar */}
        {choices && choices.length > 0 && (
          <div className="flex gap-2.5 mt-4 flex-wrap">
            {choices.map((choice) => (
              <GoldButton
                key={choice.value}
                onClick={() => onChoose?.(choice.value)}
              >
                {choice.label}
              </GoldButton>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskBubble;