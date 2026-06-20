/* ═══════════════════════════════════════════
   ToSom — Admin Analytics Dashboard
   Viser nøkkelmetrikker fra analytics systemet
   ═══════════════════════════════════════════ */

"use client";

import { useState, useEffect } from "react";
import { isFlagEnabled } from "@/utils/flags";

interface Metrics {
  totalUsers: number;
  dailyActiveUsers: number;
  matchRate: number;
  chatOpenRate: number;
  journeyCompletionRate: number;
  aiFeatureUsage: Record<string, number>;
  weeklyTrend: Array<{ day: string; count: number }>;
}

/* ---------------------------------------------------------- */
/*  Dashboard component                                       */
/* ---------------------------------------------------------- */

export default function AnalyticsDashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  const hasAccess = isFlagEnabled("enableAdminExperiments");

  useEffect(() => {
    if (!hasAccess) return;
    fetchMetrics();
  }, [hasAccess]);

  async function fetchMetrics() {
    try {
      const res = await fetch("/api/admin/observability/metrics");
      if (res.ok) {
        const data = await res.json();
        setMetrics(data);
      }
    } catch {
      /* Silently fail */
    } finally {
      setLoading(false);
    }
  }

  if (!hasAccess) {
    return (
      <div className="p-6">
        <p className="text-white/40">Analytics dashboard krever admin Eksperimenter-tilgang.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">Analytics</h1>
        <button
          onClick={fetchMetrics}
          className="text-sm text-[var(--ts-gold)] hover:text-[var(--ts-gold-hover)] transition-colors"
        >
          Oppdater
        </button>
      </div>

      {loading ? (
        <div className="text-white/40">Laster metrikker...</div>
      ) : metrics ? (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <MetricCard label="Total Brukere" value={metrics.totalUsers.toLocaleString()} />
            <MetricCard label="Daglig Aktive" value={metrics.dailyActiveUsers.toLocaleString()} />
            <MetricCard label="Match Rate" value={`${(metrics.matchRate * 100).toFixed(1)}%`} />
            <MetricCard label="Chat Åpning" value={`${(metrics.chatOpenRate * 100).toFixed(1)}%`} />
            <MetricCard label="Journey Fullføring" value={`${(metrics.journeyCompletionRate * 100).toFixed(1)}%`} />
          </div>

          {/* AI Feature Usage */}
          <div
            className="p-4 rounded-xl"
            style={{ background: "rgba(212, 175, 55, 0.08)" }}
          >
            <h3 className="text-sm font-medium text-[var(--ts-gold)] mb-3">AI Funksjonsbruk</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(metrics.aiFeatureUsage).map(([feature, count]) => (
                <div key={feature} className="text-center p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.04)" }}>
                  <div className="text-lg font-semibold text-white">{count}</div>
                  <div className="text-xs text-white/50">{feature}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Trend (simple bar chart) */}
          <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
            <h3 className="text-sm font-medium text-white/60 mb-3">Uker趋势 (7 dager)</h3>
            <div className="flex items-end gap-2 h-32">
              {metrics.weeklyTrend.map((day) => (
                <div key={day.day} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t bg-[var(--ts-gold)] transition-all"
                    style={{
                      height: `${(day.count / Math.max(...metrics.weeklyTrend.map((d) => d.count))) * 100}%`,
                      minHeight: "4px",
                      opacity: 0.6 + (day.count / Math.max(...metrics.weeklyTrend.map((d) => d.count))) * 0.4,
                    }}
                  />
                  <span className="text-xs text-white/40">{day.day}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="text-white/40">Ingen data tilgjengelig.</div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------- */
/*  MetricCard helper                                         */
/* ---------------------------------------------------------- */

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="p-4 rounded-xl text-center"
      style={{ background: "rgba(255, 255, 255, 0.04)" }}
    >
      <div className="text-2xl font-semibold text-white">{value}</div>
      <div className="text-xs text-white/50 mt-1">{label}</div>
    </div>
  );
}

