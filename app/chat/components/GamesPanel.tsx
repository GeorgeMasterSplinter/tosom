/**
 * ToSom — "Hvem starter?"
 * Et myntkast i chat. Velg stein, saks eller papir.
 * Ingen poeng, ingen press. 5 sekunder.
 */
"use client";

import { useState, useCallback, useEffect } from "react";
import { csrfFetch } from "@/lib/api/csrfClient";
import { useChat } from "@/app/chat/context/ChatContext";
import { color } from "@/config/design-tokens";
import { RockPaperScissors } from "./RockPaperScissors";
import type { RPSState } from "@/lib/games/rps";

interface RPSGame {
  sessionId: string;
  state: RPSState;
  winner: string | null;
  status: "ACTIVE" | "COMPLETED";
}

export function GamesPanel({ onClose }: { onClose: () => void }) {
  const { conversationId, sessionUserId, partner, gameEvent } = useChat();
  const [game, setGame] = useState<RPSGame | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const myPlayer: "A" | "B" = sessionUserId === partner?.id ? "B" : "A";

  // Pusher-sanntidssynk
  useEffect(() => {
    if (!gameEvent) return;
    if (gameEvent.type !== "RPS") return;
    setGame({
      sessionId: gameEvent.sessionId,
      state: gameEvent.state as RPSState,
      winner: gameEvent.winner ?? null,
      status: gameEvent.status as "ACTIVE" | "COMPLETED",
    });
  }, [gameEvent]);

  // Initial load: hente eksisterende aktivt spill
  useEffect(() => {
    if (!conversationId) return;
    let cancelled = false;
    fetch(`/api/game/active?conversationId=${conversationId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data?.games?.length) return;
        const g = data.games.find((g: any) => g.type === "RPS");
        if (!g) return;
        setGame({ sessionId: g.id, state: g.state, winner: g.winner, status: "ACTIVE" });
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [conversationId]);

  const startGame = useCallback(async () => {
    if (!conversationId) return;
    setLoading(true); setError(null);
    try {
      const res = await csrfFetch("/api/game/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, type: "RPS" }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Kunne ikke starte"); return; }
      setGame({ sessionId: data.sessionId, state: data.state, winner: null, status: "ACTIVE" });
    } catch { setError("Noe gikk galt."); } finally { setLoading(false); }
  }, [conversationId]);

  const makeMove = useCallback(async (choice: string) => {
    if (!game) return;
    try {
      const res = await csrfFetch("/api/game/move", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: game.sessionId, choice }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Ugyldig valg"); return; }
      setGame({ ...game, state: data.state, winner: data.winner, status: data.gameOver ? "COMPLETED" : "ACTIVE" });
      setError(null);
    } catch { setError("Noe gikk galt."); }
  }, [game]);

  const resetGame = useCallback(() => { setGame(null); setError(null); }, []);

  const cancelGame = useCallback(async () => {
    if (!game) return;
    try {
      await csrfFetch("/api/game/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: game.sessionId }),
      });
      setGame(null);
      setError(null);
    } catch { setError("Kunne ikke avbryte."); }
  }, [game]);

  // Auto-close ved fullført spill (må være før conditional return)
  useEffect(() => {
    if (game?.status === "COMPLETED") {
      const timer = setTimeout(() => onClose(), 2000);
      return () => clearTimeout(timer);
    }
  }, [game?.status, onClose]);

  // Ingen aktivt spill — vis start
  if (!game) {
    return (
      <div className="px-6 py-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold" style={{ color: color.text.primary }}>Hvem starter?</h3>
          <button onClick={onClose} className="text-xs" style={{ color: color.text.muted }}>✕</button>
        </div>
        {error && <p className="text-xs" style={{ color: color.status.error }}>{error}</p>}
        <button
          onClick={startGame}
          disabled={loading}
          className="w-full py-3 rounded-xl text-sm font-medium"
          style={{ background: color.glass.bg, border: `1px solid ${color.glass.border}`, color: color.text.primary }}
        >
          {loading ? "Starter…" : "🪨 ✂️ 📄  Kast mynt"}
        </button>
        <p className="text-xs" style={{ color: color.text.muted }}>
          Et lite myntkast. Ingen poeng, ingen press.
        </p>
      </div>
    );
  }

  // Aktivt / fullført spill
  return (
    <div className="px-6 py-5 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold" style={{ color: color.text.primary }}>Hvem starter?</h3>
        <button onClick={onClose} className="text-xs" style={{ color: color.text.muted }}>✕</button>
      </div>
      {error && <p className="text-xs" style={{ color: color.status.error }}>{error}</p>}
      <RockPaperScissors
        state={game.state}
        myPlayer={myPlayer}
        onChoice={(c) => makeMove(c)}
        disabled={game.status === "COMPLETED"}
      />
    </div>
  );
}
