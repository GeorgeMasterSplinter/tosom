/* ═══════════════════════════════════════════
   ToSom — AI Icebreaker Generator
   Genererer unike icebreakers basert på interesser + bio
   ═══════════════════════════════════════════ */

"use client";

import { useState } from "react";
import { isFlagEnabled } from "@/utils/flags";

interface IcebreakerGeneratorProps {
  matchId: string;
  interests: string[];
  bio: string;
  partnerName: string;
}

export function IcebreakerGenerator({ matchId, interests, bio, partnerName }: IcebreakerGeneratorProps) {
  const [icebreakers, setIcebreakers] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);

  const hasAccess = isFlagEnabled("enableAiMatchInsights");

  async function generateIcebreakers() {
    if (!hasAccess) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai/icebreakers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId, interests, bio, partnerName }),
      });
      if (res.ok) {
        const data = await res.json();
        setIcebreakers(data.icebreakers);
      }
    } catch {
      /* Silently fail */
    } finally {
      setLoading(false);
    }
  }

  if (!hasAccess) return null;

  return (
    <div className="mt-4">
      <button
        onClick={generateIcebreakers}
        disabled={loading}
        className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
        style={{
          background: "rgba(212, 175, 55, 0.15)",
          color: "#D4AF37",
          border: "1px solid rgba(212, 175, 55, 0.25)",
        }}
      >
        {loading ? "Genererer..." : "💡 Få forslag til åpningsmelding"}
      </button>

      {icebreakers && (
        <div className="mt-3 space-y-2">
          {icebreakers.map((text, i) => (
            <div
              key={i}
              className="p-3 rounded-lg cursor-pointer hover:bg-white/5 transition-colors"
              style={{ background: "rgba(255, 255, 255, 0.04)" }}
              onClick={() => navigator.clipboard.writeText(text)}
              title="Klikk for å kopiere"
            >
              <p className="text-sm text-white/80 italic">"{text}"</p>
              <span className="text-xs text-white/40 mt-1 block">Klikk for å kopiere</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default IcebreakerGenerator;