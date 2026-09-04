/**
 * ToSom — RockPaperScissors
 *
 * Samtidig spill: begge velger, så resultat. Tre store ikoner.
 * Rolig, dempet. Ingen feiring.
 */

"use client";

import { useState } from "react";
import { color, glass } from "@/config/design-tokens";
import type { RPSChoice, RPSState } from "@/lib/games/rps";

interface RockPaperScissorsProps {
  state: RPSState;
  myPlayer: "A" | "B";
  onChoice: (choice: RPSChoice) => void;
  disabled?: boolean;
}

const CHOICES: { value: RPSChoice; emoji: string; label: string }[] = [
  { value: "rock", emoji: "✊", label: "Stein" },
  { value: "paper", emoji: "✋", label: "Papir" },
  { value: "scissors", emoji: "✌️", label: "Saks" },
];

export function RockPaperScissors({
  state,
  myPlayer,
  onChoice,
  disabled = false,
}: RockPaperScissorsProps) {
  const [hovered, setHovered] = useState<RPSChoice | null>(null);

  const myChoice = myPlayer === "A" ? state.choiceA : state.choiceB;
  const partnerChoice = myPlayer === "A" ? state.choiceB : state.choiceA;
  const complete = state.winner !== null;
  const canChoose = !complete && myChoice === null && !disabled;

  return (
    <div className="w-full max-w-[280px] mx-auto">
      {/* Status */}
      <p
        className="text-center mb-4 text-sm font-medium"
        style={{ color: complete ? color.text.secondary : color.text.primary }}
      >
        {complete
          ? state.winner === "draw"
            ? "Likestilling."
            : state.winner === myPlayer
              ? "Du vant."
              : "Partneren vant."
          : myChoice !== null
            ? "Venter på partneren..."
            : "Velg ett:"}
      </p>

      {/* Resultat (når komplett) */}
      {complete && (
        <div
          className="flex justify-center items-center gap-6 mb-4 py-3 rounded-xl"
          style={{ background: glass.bg, border: `1px solid ${glass.border}` }}
        >
          <div className="text-center">
            <span className="text-3xl">{getEmoji(myChoice)}</span>
            <p className="text-xs mt-1" style={{ color: color.text.muted }}>Du</p>
          </div>
          <span className="text-lg" style={{ color: color.text.muted }}>vs</span>
          <div className="text-center">
            <span className="text-3xl">{getEmoji(partnerChoice)}</span>
            <p className="text-xs mt-1" style={{ color: color.text.muted }}>Partner</p>
          </div>
        </div>
      )}

      {/* Valgknapper */}
      {!complete && (
        <div className="flex justify-center gap-3">
          {CHOICES.map(({ value, emoji, label }) => {
            const isMine = myChoice === value;
            const canClick = canChoose && !isMine;

            return (
              <button
                key={value}
                onClick={() => canClick && onChoice(value)}
                onMouseEnter={() => setHovered(value)}
                onMouseLeave={() => setHovered(null)}
                disabled={!canClick}
                className="flex flex-col items-center justify-center gap-1 rounded-2xl transition-all duration-150"
                style={{
                  width: 72,
                  height: 80,
                  minWidth: 48,
                  minHeight: 48,
                  background: isMine
                    ? color.ambient.gold.medium
                    : hovered === value && canClick
                      ? glass.bgHover
                      : glass.bg,
                  border: `1px solid ${isMine ? color.border.gold : glass.border}`,
                  cursor: canClick ? "pointer" : "default",
                  opacity: isMine ? 1 : canClick ? 1 : 0.4,
                }}
                aria-label={label}
              >
                <span className="text-3xl">{emoji}</span>
                <span
                  className="text-[10px] font-medium"
                  style={{ color: isMine ? color.brand.gold : color.text.muted }}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function getEmoji(choice: RPSChoice | null): string {
  if (choice === "rock") return "✊";
  if (choice === "paper") return "✋";
  if (choice === "scissors") return "✌️";
  return "❓";
}