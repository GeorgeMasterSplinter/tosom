/**
 * ToSom — "Hvem starter?" (RPS)
 *
 * Kun hender. Ingen tekst. Raskt.
 * Begge velger → resultat → auto-lukk (vinner) eller auto-ny runde (liké).
 */

"use client";

import { color } from "@/config/design-tokens";
import type { RPSChoice, RPSState } from "@/lib/games/rps";

interface RockPaperScissorsProps {
  state: RPSState;
  myPlayer: "A" | "B";
  onChoice: (choice: RPSChoice) => void;
  disabled?: boolean;
}

const HANDS: { value: RPSChoice; emoji: string }[] = [
  { value: "rock", emoji: "✊" },
  { value: "paper", emoji: "✋" },
  { value: "scissors", emoji: "✌️" },
];

export function RockPaperScissors({
  state,
  myPlayer,
  onChoice,
  disabled = false,
}: RockPaperScissorsProps) {
  const myChoice = myPlayer === "A" ? state.choiceA : state.choiceB;
  const partnerChoice = myPlayer === "A" ? state.choiceB : state.choiceA;
  const complete = state.winner !== null;
  const canChoose = !complete && myChoice === null && !disabled;

  return (
    <div className="w-full max-w-[280px] mx-auto">
      {/* Resultat (vinner) */}
      {complete && (
        <div className="text-center mb-4">
          <div className="flex justify-center items-center gap-4 mb-2">
            <span className="text-4xl">{getEmoji(myChoice)}</span>
            <span className="text-xs" style={{ color: color.text.muted }}>mot</span>
            <span className="text-4xl">{getEmoji(partnerChoice)}</span>
          </div>
          <p className="text-sm font-medium" style={{ color: color.brand.gold }}>
            {state.winner === myPlayer ? "Du starter" : "Partner starter"}
          </p>
        </div>
      )}

      {/* I spill: vis valg + taster */}
      {!complete && (
        <>
          {/* Partnerens valg (vises umiddelbart via Pusher) */}
          {partnerChoice !== null && (
            <div className="text-center mb-3">
              <span className="text-3xl">{getEmoji(partnerChoice)}</span>
              <p className="text-xs mt-1" style={{ color: color.text.muted }}>Partner har valgt</p>
            </div>
          )}

          {/* Status */}
          <p
            className="text-center mb-3 text-sm"
            style={{ color: myChoice !== null ? color.text.muted : color.text.primary }}
          >
            {myChoice !== null ? "Venter på partneren…" : "Velg:"}
          </p>

          {/* Mine hender */}
          <div className="flex justify-center gap-3">
            {HANDS.map(({ value, emoji }) => {
              const isMine = myChoice === value;
              const canClick = canChoose && !isMine;

              return (
                <button
                  key={value}
                  onClick={() => canClick && onChoice(value)}
                  disabled={!canClick}
                  className="rounded-2xl transition-all duration-150 flex items-center justify-center"
                  style={{
                    width: 64,
                    height: 64,
                    minWidth: 48,
                    minHeight: 48,
                    background: isMine
                      ? color.ambient.gold.medium
                      : color.glass.bg,
                    border: `1px solid ${isMine ? color.border.gold : color.glass.border}`,
                    cursor: canClick ? "pointer" : "default",
                    opacity: isMine ? 1 : canClick ? 1 : 0.4,
                  }}
                  aria-label={value}
                >
                  <span className="text-3xl">{emoji}</span>
                </button>
              );
            })}
          </div>
        </>
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