/**
 * ToSom — GamesPanel
 * Panel i chatten for minispill. Rolig, ingen poeng, ingen press.
 */
"use client";

import { useState, useCallback } from "react";
import { useChat } from "@/app/chat/context/ChatContext";
import { color, glass } from "@/config/design-tokens";
import { TicTacToeBoard } from "./TicTacToeBoard";
import { RockPaperScissors } from "./RockPaperScissors";
import type { TTTState } from "@/lib/games/ticTacToe";
import type { RPSState } from "@/lib/games/rps";

interface GameInfo {
  sessionId: string;
  type: "TTT" | "RPS";
  state: any;
  turn: string | null;
  winner: string | null;
  status: "ACTIVE" | "COMPLETED";
}

export function GamesPanel({ onClose }: { onClose: () => void }) {
  const { conversationId, senderId, partnerId } = useChat();
  const [activeGame, setActiveGame] = useState<GameInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const myPlayer: "A" | "B" = senderId === partnerId ? "B" : "A";

  const startGame = useCallback(async (type: "TTT" | "RPS") => {
    if (!conversationId) return;
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/game/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, type }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Kunne ikke starte"); return; }
      setActiveGame({ sessionId: data.sessionId, type, state: data.state, turn: data.turn, winner: null, status: "ACTIVE" });
    } catch { setError("Noe gikk galt."); } finally { setLoading(false); }
  }, [conversationId]);

  const makeMove = useCallback(async (payload: { cell?: number; choice?: string }) => {
    if (!activeGame) return;
    try {
      const res = await fetch("/api/game/move", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: activeGame.sessionId, ...payload }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Ugyldig trekk"); return; }
      setActiveGame({ ...activeGame, state: data.state, winner: data.winner, status: data.gameOver ? "COMPLETED" : "ACTIVE" });
      setError(null);
    } catch { setError("Noe gikk galt."); }
  }, [activeGame]);

  const resetGame = useCallback(() => { setActiveGame(null); setError(null); }, []);

  if (!activeGame) {
    return (
      <div className="px-6 py-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold" style={{ color: color.text.primary }}>Spill sammen</h3>
          <button onClick={onClose} className="text-xs" style={{ color: color.text.muted }}>✕</button>
        </div>
        {error && <p className="text-xs" style={{ color: color.status.error }}>{error}</p>}
        <div className="flex gap-3">
          <button onClick={() => startGame("TTT")} disabled={loading} className="flex-1 py-3 rounded-xl text-sm font-medium" style={{ background: glass.bg, border: `1px solid ${glass.border}`, color: color.text.primary }}>Tic-Tac-Toe</button>
          <button onClick={() => startGame("RPS")} disabled={loading} className="flex-1 py-3 rounded-xl text-sm font-medium" style={{ background: glass.bg, border: `1px solid ${glass.border}`, color: color.text.primary }}>Stein-Saks-Papir</button>
        </div>
        <p className="text-xs" style={{ color: color.text.muted }}>Lavterskel spill for å bryte isen. Ingen poeng, ingen press.</p>
      </div>
    );
  }

  return (
    <div className="px-6 py-5 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold" style={{ color: color.text.primary }}>{activeGame.type === "TTT" ? "Tic-Tac-Toe" : "Stein-Saks-Papir"}</h3>
        <button onClick={onClose} className="text-xs" style={{ color: color.text.muted }}>✕</button>
      </div>
      {error && <p className="text-xs" style={{ color: color.status.error }}>{error}</p>}
      {activeGame.type === "TTT" && (
        <TicTacToeBoard board={(activeGame.state as TTTState).board} turn={(activeGame.state as TTTState).turn} winner={(activeGame.state as TTTState).winner} myPlayer={myPlayer} onMove={(cell) => makeMove({ cell })} disabled={activeGame.status === "COMPLETED"} />
      )}
      {activeGame.type === "RPS" && (
        <RockPaperScissors state={activeGame.state as RPSState} myPlayer={myPlayer} onChoice={(c) => makeMove({ choice: c })} disabled={activeGame.status === "COMPLETED"} />
      )}
      {activeGame.status === "COMPLETED" && (
        <button onClick={resetGame} className="w-full py-2.5 rounded-xl text-sm font-medium" style={{ background: color.ambient.gold.soft, border: `1px solid ${color.border.gold}`, color: color.brand.gold }}>Spill igjen</button>
      )}
    </div>
  );
}
