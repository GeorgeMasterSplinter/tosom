/**
 * ToSom — Admin Observability Overview
 * 
 * Overordna statusside for observability.
 * Viser raskt oversikt over latency, health, errors og DB size
 * før brukaren navigerer til det detaljerte dashboardet.
 */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";

interface HealthData {
  status: string;
  database: string;
  latency?: number;
  dbSize?: string;
}

interface LatencyData {
  avg: number;
  p50: number;
  p95: number;
  p99: number;
}

interface ErrorSummary {
  total: number;
  last24h: number;
  critical: number;
}

export default function ObservabilityOverview() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [latency, setLatency] = useState<LatencyData | null>(null);
  const [errorSummary, setErrorSummary] = useState<ErrorSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        const [healthRes, latencyRes] = await Promise.all([
          fetch("/api/system/health"),
          fetch("/api/system/latency"),
        ]);

        if (!cancelled) {
          if (healthRes.ok) setHealth(await healthRes.json());
          if (latencyRes.ok) setLatency(await latencyRes.json());
        }
      } catch {
        /* Silently fail */
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();

    // Poll hver 30. sekund
    const interval = setInterval(fetchData, 30_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-white/40 animate-pulse">Hentar observabilitetsdata...</div>
      </div>
    );
  }

  const healthStatus = health?.status ?? "ukjent";
  const isHealthy = healthStatus === "ok" || healthStatus === "healthy";
  const hasErrors = (errorSummary?.critical ?? 0) > 0;

  return (
    <div className="p-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold text-white">Observabilitet</h1>
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
            Oversikt over systemhelse, ytelse og feil.
          </p>
        </div>

        <Link
          href="/admin/observability/dashboard"
          className="px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300"
          style={{
            background: "rgba(212,175,55,0.1)",
            border: "1px solid rgba(212,175,55,0.3)",
            color: "#D4AF37",
          }}
        >
          Detaljert dashboard →
        </Link>
      </div>

      {/* Health Status Banner */}
      <div
        className="p-5 rounded-xl mb-6 flex items-center gap-4"
        style={{
          background: isHealthy ? "rgba(76,175,80,0.08)" : hasErrors ? "rgba(255,77,77,0.08)" : "rgba(255,193,7,0.08)",
          border: `1px solid ${isHealthy ? "rgba(76,175,80,0.2)" : hasErrors ? "rgba(255,77,77,0.2)" : "rgba(255,193,7,0.2)"}`,
        }}
      >
        <span className="text-2xl flex-shrink-0">
          {isHealthy ? "🟢" : hasErrors ? "🔴" : "🟡"}
        </span>
        <div>
          <h3 className="font-medium text-sm mb-1" style={{ color: isHealthy ? "#4CAF50" : hasErrors ? "#FF4D4D" : "#FFC107" }}>
            {isHealthy ? "Systemet er sunt" : hasErrors ? "Kritiske feil oppdaga" : "Systemet køyrer med varsel"}
          </h3>
          <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
            Status: {healthStatus} • Database: {health?.database ?? "ukjent"} • DB-storleik: {health?.dbSize ?? "—"}
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KpiCard
          label="Gjennomsnittleg latency"
          value={latency ? `${Math.round(latency.avg)}ms` : "—"}
          icon="⚡"
          healthy={latency ? latency.avg < 200 : false}
        />
        <KpiCard
          label="p95 latency"
          value={latency ? `${Math.round(latency.p95)}ms` : "—"}
          icon="📊"
          healthy={latency ? latency.p95 < 500 : false}
        />
        <KpiCard
          label="Feil (24t)"
          value={errorSummary?.last24h?.toString() ?? "—"}
          icon="🐛"
          healthy={(errorSummary?.last24h ?? 999) < 10}
        />
        <KpiCard
          label="Kritiske feil"
          value={errorSummary?.critical?.toString() ?? "—"}
          icon="🚨"
          healthy={(errorSummary?.critical ?? 0) === 0}
        />
      </div>

      {/* Latency Breakdown */}
      {latency && (
        <Card className="mb-6">
          <h3 className="font-medium text-sm mb-4" style={{ color: "#FFFFFF" }}>
            📈 Latency-fordeling
          </h3>

          {/* p50 bar */}
          <LatencyBar label="p50 (median)" value={latency.p50} threshold={100} />
          {/* p95 bar */}
          <LatencyBar label="p95" value={latency.p95} threshold={500} />
          {/* p99 bar */}
          <LatencyBar label="p99" value={latency.p99} threshold={1000} />
          {/* avg bar */}
          <LatencyBar label="Gjennomsnitt" value={latency.avg} threshold={200} />
        </Card>
      )}

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <QuickLink href="/admin/observability/dashboard" label="Dashboard" desc="Detaljert oversikt over alle metrikker" icon="📊" />
        <QuickLink href="/admin/analytics" label="Analytics" desc="Brukarmetrikker og trendar" icon="📈" />
        <QuickLink href="/admin/experiments" label="Eksperiment" desc="Feature flags og testgruppper" icon="🧪" />
      </div>
    </div>
  );
}

/* ─── KpiCard ─── */
function KpiCard({ label, value, icon, healthy }: { label: string; value: string; icon: string; healthy: boolean }) {
  return (
    <div
      className="p-4 rounded-xl"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: `1px solid ${healthy ? "rgba(255,255,255,0.06)" : "rgba(255,77,77,0.15)"}`,
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{icon}</span>
        <div
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ background: healthy ? "#4CAF50" : "#FF4D4D" }}
        />
      </div>
      <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>{label}</p>
      <p className="text-lg font-semibold" style={{ color: "#FFFFFF" }}>{value}</p>
    </div>
  );
}

/* ─── LatencyBar ─── */
function LatencyBar({ label, value, threshold }: { label: string; value: number; threshold: number }) {
  const percentage = Math.min((value / threshold) * 100, 100);
  const isHealthy = value < threshold;

  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1.5">
        <span style={{ color: "rgba(255,255,255,0.5)" }}>{label}</span>
        <span style={{ color: isHealthy ? "#4CAF50" : "#FFC107" }}>{Math.round(value)}ms</span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${percentage}%`,
            background: isHealthy ? "#4CAF50" : "#FFC107",
          }}
        />
      </div>
    </div>
  );
}

/* ─── QuickLink ─── */
function QuickLink({ href, label, desc, icon }: { href: string; label: string; desc: string; icon: string }) {
  return (
    <Link
      href={href}
      className="p-5 rounded-xl transition-all duration-300 group"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <span className="text-xl mb-3 block">{icon}</span>
      <h4 className="font-medium text-sm mb-1 group-hover:text-[var(--ts-gold)] transition-colors" style={{ color: "#FFFFFF" }}>
        {label}
      </h4>
      <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.35)" }}>
        {desc}
      </p>
    </Link>
  );
}