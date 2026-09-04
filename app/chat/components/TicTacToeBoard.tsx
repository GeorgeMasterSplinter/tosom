/**
 * ToSom — TicTacToeBoard
 *
 * Interaktivt 3×3 brett i chatten. Rolig, dempet, glassmorphism.
 * Ingen feiring. Vinner vises med én linje.
 */

"use client";

import { useState } from "react";
import { color, glass } from "@/config/design-tokens";

interface TicTacToeBoardProps {
  board: (string | null)[];
  turn: "A" | "B";
  winner: string | null;
  myPlayer: "A" | "B";
  onMove: (cell: number) => void;
  disabled?: boolean;
}

export function TicTacToeBoard({
  board,
  turn,
  winner,
  myPlayer,
  onMove,
  disabled = false,
}: TicTacToeBoardProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  const isMyTurn = turn === myPlayer && !winner;

  // Vinnerlinje (enkel sjekk for markering)
  const winLine = getWinLine(board);

  return (
    <div className="w-full max-w-[280px] mx-auto">
      {/* Turindikator */}
      <p
        className="text-center mb-3 text-sm font-medium"
        style={{ color: winner ? color.text.secondary : color.text.primary }}
      >
        {winner
          ? winner === "draw"
            ? "Uavgjort."
            : winner === myPlayer
              ? "Du vant."
              : "Partneren vant."
          : isMyTurn
            ? "Din tur"
            : "Partners tur"}
      </p>

      {/* Brett */}
      <div
        className="grid grid-cols-3 gap-1.5 rounded-2xl p-2"
        style={{
          background: glass.bg,
          border: `1px solid ${glass.border}`,
        }}
      >
        {board.map((cell, i) => {
          const isWinCell = winLine?.includes(i);
          const canClick = isMyTurn && cell === null && !disabled;

          return (
            <button
              key={i}
              onClick={() => canClick && onMove(i)}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              disabled={!canClick}
              className="flex items-center justify-center rounded-xl transition-all duration-150"
              style={{
                width: "min(72px, 28vw)",
                height: "min(72px, 28vw)",
                minWidth: 48,
                minHeight: 48,
                background: isWinCell
                  ? color.ambient.gold.medium
                  : hovered === i && canClick
                    ? glass.bgHover
                    : "transparent",
                border: `1px solid ${isWinCell ? color.border.gold : glass.border}`,
                cursor: canClick ? "pointer" : "default",
                opacity: cell ? 1 : canClick ? 0.9 : 0.4,
              }}
              aria-label={`Celle ${i + 1}${cell ? `: ${cell}` : ""}`}
            >
              {cell === "X" && (
                <span
                  className="text-2xl font-bold"
                  style={{ color: color.brand.gold }}
                >
                  X
                </span>
              )}
              {cell === "O" && (
                <span
                  className="text-2xl font-bold"
                  style={{ color: color.text.secondary }}
                >
                  O
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Finn vinnerlinjen for subtil markering. */
function getWinLine(board: (string | null)[]): number[] | null {
  const lines: [number, number, number][] = [
    [0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6],
  ];
  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return [a, b, c];
    }
  }
  return null;
}