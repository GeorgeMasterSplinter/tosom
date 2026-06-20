/* ═══════════════════════════════════════════
   ToSom — Admin Observability Dashboard
   Viser latency, health, errors og DB size
   ═══════════════════════════════════════════ */

"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { SkeletonCard } from "@/components/ui/Skeleton";

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

interface ErrorItem {
  id: string;
  message: string;
  url: string;
  timestamp: string;
}

export default function ObservabilityDashboard() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [latency, setLatency] = useState<LatencyData | null>(null);
  const [errors, setErrors] = useState<ErrorItem[]>([]);
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
    const interval = setInterval(fetchData, 30000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-white">Observability Dashboard</h1>

      {/* Health Card */}
      <Card variant="glass" className="p-6">
        <h2 className="text-sm font-medium text-white/60 mb-4">System Health</h2>
        <div className="flex items-center gap-3">
          <div
            className={`w-3 h-3 rounded-full ${
              health?.status === "ok" ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span className="text-white">
            Status: {health?.status || "unknown"}
          </span>
        </div>
        <div className="mt-3 text-sm text-white/40">
          Database: {health?.database || "unknown"}
        </div>
        {health?.dbSize && (
          <div className="mt-1 text-sm text-white/40">
            DB Size: {health.dbSize}
          </div>
        )}
      </Card>

      {/* Latency Card */}
      <Card variant="glass" className="p-6">
        <h2 className="text-sm font-medium text-white/60 mb-4">Latency (ms)</h2>
        {latency ? (
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{latency.avg}</div>
              <div className="text-xs text-white/40">Avg</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[var(--ts-gold)]">{latency.p50}</div>
              <div className="text-xs text-white/40">P50</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">{latency.p95}</div>
              <div className="text-xs text-white/40">P95</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{latency.p99}</div>
              <div className="text-xs text-white/40">P99</div>
            </div>
          </div>
        ) : (
          <div className="text-white/40">Ingen data</div>
        )}
      </Card>

      {/* Recent Errors */}
      <Card variant="glass" className="p-6">
        <h2 className="text-sm font-medium text-white/60 mb-4">Recent Errors</h2>
        {errors.length > 0 ? (
          <div className="space-y-3">
            {errors.map((err) => (
              <div key={err.id} className="border-b border-white/8 pb-2 last:border-0">
                <div className="text-sm text-white">{err.message}</div>
                <div className="text-xs text-white/30">{err.url}</div>
                <div className="text-xs text-white/30">{err.timestamp}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-white/40">Ingen feil registrert</div>
        )}
      </Card>

      {/* Quick Links */}
      <Card variant="glass" className="p-6">
        <h2 className="text-sm font-medium text-white/60 mb-4">Quick Links</h2>
        <div className="flex flex-wrap gap-3">
          <a
            href="/admin/observability/metrics"
            className="text-sm text-[var(--ts-gold)] hover:text-[var(--ts-gold-hover)]"
          >
            Metrics →
          </a>
          <a
            href="/admin/observability/traces"
            className="text-sm text-[var(--ts-gold)] hover:text-[var(--ts-gold-hover)]"
          >
            Traces →
          </a>
          <a
            href="/admin/security/overview"
            className="text-sm text-[var(--ts-gold)] hover:text-[var(--ts-gold-hover)]"
          >
            Security →
          </a>
        </div>
      </Card>
    </div>
  );
}