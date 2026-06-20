/* ═══════════════════════════════════════════
   ToSom — AI Match Insights
   Viser AI-genererte innsikter om et match
   ═══════════════════════════════════════════ */

"use client";

import { useState } from "react";
import { flags, isFlagEnabled } from "@/utils/flags";

interface MatchInsightsProps {
  matchId: string;
  profileA: { name: string; interests: string[]; bio: string };
  profileB: { name: string; interests: string[]; bio: string };
  resonanceScore: number;
}

interface Insight {
  strengths: string[];
  challenges: string[];
  topics: string[];
}

/* ---------------------------------------------------------- */
/*  AI Insights component                                     */
/* ---------------------------------------------------------- */

export function MatchInsights({ matchId, profileA, profileB, resonanceScore }: MatchInsightsProps) {
  const [insights, setInsights] = useState<Insight | null>(null);
  const [loading, setLoading] = useState(false);

  const hasAccess = isFlagEnabled("enableAiMatchInsights");

  async function fetchInsights() {
    if (!hasAccess) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai/match-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchId,
          profileA,
          profileB,
          resonanceScore,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setInsights(data);
      }
    } catch {
      /* Silently fail */
    } finally {
      setLoading(false);
    }
  }

  if (!hasAccess) return null;

  return (
    <div className="mt-4 p-4 rounded-xl" style={{ background: "rgba(212, 175, 55, 0.08)" }}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-[var(--ts-gold)]">AI Match Insights</h3>
        <button
          onClick={fetchInsights}
          disabled={loading}
          className="text-xs text-[var(--ts-gold)] hover:text-[var(--ts-gold-hover)] disabled:opacity-50 transition-colors"
        >
          {loading ? "Laster..." : "Vis innsikter"}
        </button>
      </div>

      {loading && (
        <div className="text-white/40 text-sm">Analyserer matchen...</div>
      )}

      {insights && (
        <div className="space-y-3">
          <div>
            <h4 className="text-xs font-medium text-white/60 mb-1">Styrker</h4>
            <ul className="space-y-1">
              {insights.strengths.map((s, i) => (
                <li key={i} className="text-sm text-white/80 flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✦</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-medium text-white/60 mb-1">Utfordringer</h4>
            <ul className="space-y-1">
              {insights.challenges.map((c, i) => (
                <li key={i} className="text-sm text-white/80 flex items-start gap-2">
                  <span className="text-orange-400 mt-0.5">⚠</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-medium text-white/60 mb-1">Samtaletema</h4>
            <div className="flex flex-wrap gap-2">
              {insights.topics.map((t, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-1 rounded-lg"
                  style={{ background: "rgba(212, 175, 55, 0.15)", color: "#D4AF37" }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MatchInsights;