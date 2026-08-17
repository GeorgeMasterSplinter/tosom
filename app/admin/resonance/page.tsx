"use client";

/**
 * Tosom — Admin Resonance (B5.4)
 * 
 * Scorefordeling per runde + resonansøkt per bruker.
 * Eneste måte å justere matchevektene.
 */

import { useState, useEffect } from "react";
import Link from "next/link";

// B5.4: Matcherunde-data
interface MatchingRound {
  at: string;
  paired: number;
  queueSize: number;
  remaining: number;
  durationMs: number | null;
  deferred: boolean;
  skipped: boolean;
  reason: string | null;
}

interface MatchingRoundsData {
  rounds: MatchingRound[];
  scoreHistogram: Record<string, number>;
  resonanceDistribution: Record<string, number>;
  totalRecentMatches: number;
}

/* ─── B5.4: MatchingRoundsPanel — scorefordeling og runde-historikk ─── */
function MatchingRoundsPanel() {
  const [data, setData] = useState<MatchingRoundsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/matching-rounds')
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl p-5 animate-pulse" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="h-4 bg-white/5 rounded w-1/3 mb-4" />
        <div className="h-24 bg-white/5 rounded" />
      </div>
    );
  }

  if (!data) return null;

  const maxHistogram = Math.max(...Object.values(data.scoreHistogram), 1);

  return (
    <div className="rounded-2xl p-5 mb-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <h3 className="text-sm font-semibold mb-4 tracking-wide" style={{ color: 'rgba(255,255,255,0.6)' }}>
        MATCHERUNDER — SCOREFORDELING (siste 7 dager: {data.totalRecentMatches} matcher)
      </h3>

      {/* Scorefordeling histogram */}
      <div className="mb-4">
        <div className="flex items-end gap-2 h-24">
          {Object.entries(data.scoreHistogram).sort(([a], [b]) => parseInt(a) - parseInt(b)).map(([bucket, count]) => (
            <div key={bucket} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-t transition-all duration-500"
                style={{
                  height: `${(count / maxHistogram) * 100}%`,
                  minHeight: count > 0 ? '4px' : '0',
                  background: 'linear-gradient(180deg, rgba(212,175,55,0.6) 0%, rgba(212,175,55,0.15) 100%)',
                }}
              />
              <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>{bucket}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Resonansnivå-fordeling */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {Object.entries(data.resonanceDistribution).map(([level, count]) => (
          <div key={level} className="rounded-xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="text-lg font-bold" style={{ color: '#D4AF37' }}>{count}</div>
            <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{level}</div>
          </div>
        ))}
      </div>

      {/* Siste runder */}
      <div>
        <h4 className="text-xs font-semibold mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>SISTE RUNDER</h4>
        <div className="space-y-1 max-h-40 overflow-y-auto">
          {data.rounds.slice(0, 10).map((round, i) => (
            <div key={i} className="flex items-center justify-between text-xs py-1" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ color: 'rgba(255,255,255,0.4)' }}>
                {new Date(round.at).toLocaleString('no-NO', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
              </span>
              <span style={{ color: round.skipped ? '#FBBF24' : round.paired > 0 ? '#4ADE80' : 'rgba(255,255,255,0.4)' }}>
                {round.skipped ? `Hoppet over (${round.reason})` : round.deferred ? 'Deferert' : `${round.paired} par, ${round.queueSize} i kø`}
              </span>
              {round.durationMs !== null && (
                <span style={{ color: 'rgba(255,255,255,0.3)' }}>{(round.durationMs / 1000).toFixed(1)}s</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface ResSession {
  id: string;
  day: number;
  emotionalTone: string;
  depthLevel: number;
  responseQuality: string;
  vulnerability: boolean;
  summary: string;
  createdAt: string;
}

interface PhaseStat {
  count: number;
  avgDepth: number;
  depths: number[];
}

interface ResonanceData {
  userId: string;
  totalSessions: number;
  uniqueDays: number;
  phases: Record<string, PhaseStat>;
  sessions: ResSession[];
}

export default function AdminResonancePage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ResonanceData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState("");

  async function loadData() {
    if (!userId) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/resonance?userId=${encodeURIComponent(userId)}`);
      if (!res.ok) {
        setError(res.statusText);
        return;
      }
      const json = await res.json();
      setData(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ukjent feil");
    } finally {
      setLoading(false);
    }
  }

  const toneColor = (tone: string) => {
    switch (tone) {
      case "deep": return "#34D399";
      case "open": return "#60A5FA";
      case "guarded": return "#FBBF24";
      case "surface": return "#EF4444";
      default: return "#9CA3AF";
    }
  };

  const toneIcon = (tone: string) => {
    switch (tone) {
      case "deep": return "🌊";
      case "open": return "💙";
      case "guarded": return "🛡️";
      case "surface": return "🌫️";
      default: return "⚪";
    }
  };

  // Enkel chart-data for dag vs depthLevel
  const chartData = data?.sessions.map(s => ({ day: s.day, depth: s.depthLevel })) || [];
  const maxDepth = Math.max(...chartData.map(d => d.depth), 3);
  const chartH = chartData.length > 0 ? 120 : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: "#0A1A2A" }}>
        <div style={{ color: "#D4AF37", fontSize: "18px" }}>Lastar inn resonansdata...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: "32px", maxWidth: "1000px", margin: "0 auto", color: "#E0E0E0" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 600, color: "#D4AF37" }}>
          Resonansanalyse
        </h1>
        <Link href="/admin/system/status" style={{ color: "#D4AF37", textDecoration: "none", fontSize: "14px" }}>
          ← Tilbake til systemstatus
        </Link>
      </div>

      {/* B5.4: Scorefordeling og runde-historikk */}
      <MatchingRoundsPanel />

      {/* Input */}
      <div style={{ marginBottom: "32px" }}>
        <label style={{ display: "block", marginBottom: "8px", color: "rgba(255,255,255,0.6)", fontSize: "14px" }}>
          Brukar-ID
        </label>
        <div style={{ display: "flex", gap: "8px" }}>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Slå inn bruker-ID..."
            onKeyDown={(e) => e.key === "Enter" && loadData()}
            style={{
              flex: 1,
              padding: "12px 16px",
              borderRadius: "12px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#E0E0E0",
              fontSize: "14px",
            }}
          />
          <button
            onClick={loadData}
            disabled={!userId || loading}
            style={{
              padding: "12px 24px",
              borderRadius: "12px",
              background: userId && !loading ? "#D4AF37" : "#555",
              color: "#0A1A2A",
              border: "none",
              fontWeight: 600,
              cursor: userId && !loading ? "pointer" : "not-allowed",
              fontSize: "14px",
            }}
          >
            {loading ? "Lastar..." : "Hent"}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{ padding: "12px 16px", borderRadius: "12px", background: "rgba(255,77,77,0.1)", border: "1px solid rgba(255,77,77,0.3)", color: "#FF4D4D", marginBottom: "24px" }}>
          ⚠️ {error}
        </div>
      )}

      {!data && !error && !loading && (
        <div style={{ textAlign: "center", padding: "48px 0", color: "rgba(255,255,255,0.3)" }}>
          Skriv inn ein bruker-ID for å se resonansdata
        </div>
      )}

      {data && (
        <>
          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", marginBottom: "32px" }}>
            {[
              { label: "Totale sessionar", value: data.totalSessions, color: "#D4AF37" },
              { label: "Unike dagar", value: data.uniqueDays, color: "#60A5FA" },
              { label: "EARLY sessionar", value: `${data.phases.EARLY?.count || 0} (djupne: ${data.phases.EARLY?.avgDepth.toFixed(1) || "0"})`, color: "#34D399" },
              { label: "BUILDING_TRUST", value: `${data.phases.BUILDING_TRUST?.count || 0} (djupne: ${data.phases.BUILDING_TRUST?.avgDepth.toFixed(1) || "0"})`, color: "#A78BFA" },
              { label: "DEEPER", value: `${data.phases.DEEPER?.count || 0} (djupne: ${data.phases.DEEPER?.avgDepth.toFixed(1) || "0"})`, color: "#F472B6" },
            ].map((stat) => (
              <div key={stat.label} style={{ padding: "16px", borderRadius: "12px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", marginBottom: "4px" }}>{stat.label}</div>
                <div style={{ fontSize: "16px", fontWeight: 600, color: stat.color }}>{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Chart */}
          {chartH > 0 && chartData.length > 1 && (
            <div style={{ marginBottom: "32px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px", color: "#E0E0E0" }}>
                Resonans-djupne over tid (dag → depthLevel)
              </h2>
              <div style={{ position: "relative", height: chartH + 40, background: "rgba(255,255,255,0.02)", borderRadius: "12px", padding: "16px" }}>
                {/* X-axis labels */}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, display: "flex", justifyContent: "space-between", fontSize: "10px", color: "rgba(255,255,255,0.3)" }}>
                  {chartData.filter((_, i) => i % Math.max(1, Math.floor(chartData.length / 8)) === 0).map((d, i) => (
                    <span key={i} style={{ position: "absolute", bottom: 0, left: `${(d.day / 30) * 100}%`, transform: "translateX(-50%)" }}>
                      D{d.day}
                    </span>
                  ))}
                </div>

                {/* Y-axis labels */}
                <div style={{ position: "absolute", left: 4, top: 16, bottom: 20, display: "flex", flexDirection: "column", justifyContent: "space-between", fontSize: "10px", color: "rgba(255,255,255,0.3)" }}>
                  <span>3</span><span>2</span><span>1</span>
                </div>

                {/* Dots */}
                {chartData.map((d, i) => {
                  const x = (d.day / 30) * (100 - 10);
                  const y = ((d.depth / maxDepth) * (chartH - 56)) + 16;
                  return (
                    <div
                      key={i}
                      style={{
                        position: "absolute",
                        left: `calc(${x}% + ${8}px)`,
                        top: `${y}px`,
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        background: d.depth >= 3 ? "#34D399" : d.depth >= 2 ? "#60A5FA" : "#FBBF24",
                        border: "2px solid rgba(0,0,0,0.3)",
                      }}
                      title={`Dag ${d.day}: depthLevel ${d.depth}`}
                    />
                  );
                })}

                {/* Lines */}
                <svg style={{ position: "absolute", left: 8, top: 16, right: 8, bottom: 20, pointerEvents: "none" }}>
                  {chartData.filter((_, i) => i % Math.max(1, Math.floor(chartData.length / 8)) === 0).map((d, i) => {
                    const x = (d.day / 30) * (100 - 10);
                    return <line key={i} x1={`${x}%`} y1="0" x2={`${x}%`} y2="100%" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />;
                  })}
                </svg>
              </div>
            </div>
          )}

          {/* Sessions list */}
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px", color: "#E0E0E0" }}>
              Sessionar ({data.sessions.length})
            </h2>
            <div style={{ display: "grid", gap: "8px" }}>
              {data.sessions.map((s) => (
                <div key={s.id} style={{ padding: "12px 16px", borderRadius: "12px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontWeight: 600, fontSize: "14px" }}>Dag {s.day}</span>
                      <span title={s.emotionalTone} style={{ fontSize: "14px" }}>{toneIcon(s.emotionalTone)}</span>
                      <span style={{ fontSize: "12px", color: toneColor(s.emotionalTone), textTransform: "capitalize" }}>{s.emotionalTone}</span>
                    </div>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      {s.vulnerability && <span title="Sårbarhet" style={{ fontSize: "12px" }}>🔓</span>}
                      <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>{new Date(s.createdAt).toLocaleDateString("nb-NO")}</span>
                    </div>
                  </div>
                  {s.summary && (
                    <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", fontStyle: "italic" }}>
                      "{s.summary}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}