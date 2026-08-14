"use client";

import { useState, useEffect } from "react";

interface ServiceStatus {
  status: string;
  latencyMs?: number;
  error?: string | null;
  details?: string;
}

interface HealthResponse {
  status: string;
  timestamp: string;
  version: string;
  system: {
    uptime: string;
    uptimeSeconds: number;
    memory: { usedMB: number; totalMB: number; usagePercent: number };
    cpu: { load1m: number; load5m: number; load15m: number };
    nodeVersion: string;
    nextVersion: string;
  };
  services: Record<string, ServiceStatus>;
  cron: { lastRun: string | null };
  app: { name: string; environment: string; port: number };
}

interface LatencyResponse {
  timestamp: string;
  db: { pingLatencyMs: number; avg24h: number; p9524h: number };
  api: { avg24h: number; p9524h: number };
  topSlowRoutes: Array<{ route: string; avgValueMs: number }>;
}

export default function SystemStatusPage() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [latency, setLatency] = useState<LatencyResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [healthRes, latencyRes] = await Promise.all([
          fetch('/api/system/health'),
          fetch('/api/system/latency'),
        ]);

        if (!healthRes.ok || !latencyRes.ok) {
          setError('Kunne ikke hente systemdata');
          return;
        }

        const healthData = await healthRes.json();
        const latencyData = await latencyRes.json();

        setHealth(healthData);
        setLatency(latencyData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ukjent feil');
      } finally {
        setLoading(false);
      }
    }

    loadData();
    // Oppdater hvar 30. sekund
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const statusIcon = (status: string) => {
    if (status === 'connected' || status === 'configured') return '✅';
    if (status === 'missing') return '❌';
    if (status === 'error') return '🔴';
    return '⚪';
  };

  const overallStatusColor = health?.status === 'ok' ? '#4DFF88' : health?.status === 'degraded' ? '#FFB86C' : '#FF4D4D';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: '#0A1A2A' }}>
        <div style={{ color: '#D4AF37', fontSize: '18px' }}>Lastar inn systemstatus...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px', maxWidth: '900px', margin: '0 auto', color: '#E0E0E0' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 600, marginBottom: '8px', color: '#D4AF37' }}>
          ToSom System Status
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span
            style={{
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: 600,
              background: `${overallStatusColor}22`,
              color: overallStatusColor,
              border: `1px solid ${overallStatusColor}44`,
            }}
          >
            ● {health?.status?.toUpperCase() ?? 'UNKNOWN'}
          </span>
          <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
            Oppdaterer hvar 30s · {new Date().toLocaleTimeString('nb-NO')}
          </span>
        </div>
      </div>

      {/* Services Grid */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: '#E0E0E0' }}>
          Tjenester
        </h2>
        <div style={{ display: 'grid', gap: '8px' }}>
          {health?.services && Object.entries(health.services).map(([name, service]) => (
            <div
              key={name}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '16px' }}>{statusIcon(service.status)}</span>
                <div>
                  <div style={{ fontWeight: 500, textTransform: 'capitalize' }}>{name}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
                    {service.details || service.error || ''}
                  </div>
                </div>
              </div>
              {service.latencyMs !== undefined && (
                <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
                  {service.latencyMs}ms
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Latency */}
      {latency && (
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: '#E0E0E0' }}>
            Latens (siste 24t)
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
            {[
              { label: 'DB Ping', value: `${latency.db.pingLatencyMs}ms`, color: '#60A5FA' },
              { label: 'DB Gj.snitt', value: `${latency.db.avg24h}ms`, color: '#D4AF37' },
              { label: 'API Gj.snitt', value: `${latency.api.avg24h}ms`, color: '#60A5FA' },
              { label: 'API P95', value: `${latency.api.p9524h}ms`, color: '#FFB86C' },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>
                  {item.label}
                </div>
                <div style={{ fontSize: '24px', fontWeight: 600, color: item.color }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>

          {/* Top Slow Routes */}
          {latency.topSlowRoutes.length > 0 && (
            <div style={{ marginTop: '16px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 500, marginBottom: '8px', color: 'rgba(255,255,255,0.5)' }}>
                Top 5 tregaste ruter (gj.snitt ms)
              </h3>
              <div style={{ display: 'grid', gap: '4px' }}>
                {latency.topSlowRoutes.map((r, i) => (
                  <div key={i} style={{ fontSize: '12px', padding: '6px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.02)', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'rgba(255,255,255,0.6)' }}>{r.route}</span>
                    <span style={{ color: r.avgValueMs > 500 ? '#FF4D4D' : r.avgValueMs > 200 ? '#FFB86C' : '#4DFF88' }}>
                      {r.avgValueMs}ms
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* System Info */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: '#E0E0E0' }}>
          System
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
          {[
            { label: 'Oppetid', value: health?.system.uptime ?? '-' },
            { label: 'Minne', value: `${health?.system.memory.usedMB ?? 0} / ${health?.system.memory.totalMB ?? 0} MB` },
            { label: 'CPU Last (1m)', value: (health?.system.cpu.load1m ?? 0).toFixed(2) },
            { label: 'Node.js', value: health?.system.nodeVersion ?? '-' },
            { label: 'Next.js', value: health?.system.nextVersion ?? '-' },
            { label: 'Versjon', value: health?.version ?? '-' },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                padding: '12px 16px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>
                {item.label}
              </div>
              <div style={{ fontSize: '14px', fontWeight: 500 }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Cron */}
      {health?.cron && (
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px', color: '#E0E0E0' }}>
            Cron
          </h2>
          <div style={{
            padding: '12px 16px',
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>
              Siste AI-request logg
            </div>
            <div style={{ fontSize: '14px' }}>
              {health.cron.lastRun ? new Date(health.cron.lastRun).toLocaleString('nb-NO') : 'Ingen logging funnet'}
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{
          marginTop: '24px',
          padding: '12px 16px',
          borderRadius: '12px',
          background: 'rgba(255,77,77,0.1)',
          border: '1px solid rgba(255,77,77,0.3)',
          color: '#FF4D4D',
        }}>
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}