/**
 * ToSom — GamesPanel
 * Panel i chatten for minispill. Rolig, ingen poeng, ingen press.
 */
"use client";

import { useState, useCallback, useEffect } from "react";
import { csrfFetch } from "@/lib/api/csrfClient";
import { useChat } from "@/app/chat/context/ChatContext";
import { color } from "@/config/design-tokens";
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
  const { conversationId, sessionUserId, partner, gameEvent } = useChat();
  const [activeGame, setActiveGame] = useState<GameInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const myPlayer: "A" | "B" = sessionUserId === partner?.id ? "B" : "A";

  // Sanntidssynk: når partner starter/spiller, oppdater lokal state automatisk
  useEffect(() => {
    if (!gameEvent) return;
    setActiveGame({
      sessionId: gameEvent.sessionId,
      type: gameEvent.type as "TTT" | "RPS",
      state: gameEvent.state,
      turn: gameEvent.turn ?? null,
      winner: gameEvent.winner ?? null,
      status: gameEvent.status as "ACTIVE" | "COMPLETED",
    });
  }, [gameEvent]);

  // Initial load: hente eksisterende aktive spill ved panel-åpning
  useEffect(() => {
    if (!conversationId) return;
    let cancelled = false;
    fetch(`/api/game/active?conversationId=${conversationId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data?.games?.length) return;
        const g = data.games[0];
        setActiveGame({
          sessionId: g.id,
          type: g.type,
          state: g.state,
          turn: g.turn,
          winner: g.winner,
          status: "ACTIVE",
        });
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [conversationId]);

  const startGame = useCallback(async (type: "TTT" | "RPS") => {
    if (!conversationId) return;
    setLoading(true); setError(null);
    try {
      const res = await csrfFetch("/api/game/start", {
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
      const res = await csrfFetch("/api/game/move", {
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

  const cancelGame = useCallback(async () => {
    if (!activeGame) return;
    try {
      await csrfFetch("/api/game/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: activeGame.sessionId }),
      });
      setActiveGame(null);
      setError(null);
    } catch { setError("Kunne ikke avbryte."); }
  }, [activeGame]);

  if (!activeGame) {
    return (
      <div className="px-6 py-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold" style={{ color: color.text.primary }}>Spill sammen</h3>
          <button onClick={onClose} className="text-xs" style={{ color: color.text.muted }}>✕</button>
        </div>
        {error && <p className="text-xs" style={{ color: color.status.error }}>{error}</p>}
        <div className="flex gap-3">
          <button onClick={() => startGame("TTT")} disabled={loading} className="flex-1 py-3 rounded-xl text-sm font-medium" style={{ background: color.glass.bg, border: `1px solid ${color.glass.border}`, color: color.text.primary }}>Tic-Tac-Toe</button>
          <button onClick={() => startGame("RPS")} disabled={loading} className="flex-1 py-3 rounded-xl text-sm font-medium" style={{ background: color.glass.bg, border: `1px solid ${color.glass.border}`, color: color.text.primary }}>Stein-Saks-Papir</button>
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
      {activeGame.status === "ACTIVE" && (
        <button onClick={cancelGame} className="w-full py-2 rounded-xl text-xs" style={{ color: color.text.muted }}>Avbryt spill</button>
      )}
    </div>
  );
}
