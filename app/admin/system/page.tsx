'use client';

import { useEffect, useState } from 'react';

// ─── Types ─────────────────────────────────────────────────

interface HealthData {
  status: string;
  timestamp: string;
  system: {
    uptime: string;
    uptimeSeconds: number;
    memory: {
      usedMB: number;
      totalMB: number;
      usagePercent: number;
    };
    cpu: {
      load1m: number;
      load5m: number;
      load15m: number;
    };
    nodeVersion: string;
    nextVersion: string;
  };
  database: {
    status: string;
    latencyMs: number;
    error: string | null;
  };
  app: {
    name: string;
    version: string;
    environment: string;
    port: string | number;
  };
}

// ─── Status helpers ────────────────────────────────────────

const dot = (ok: boolean) =>
  `w-2.5 h-2.5 rounded-full ${ok ? 'bg-[#4ADE80]' : 'bg-[#F87171]'}`;

const statusLabel = (ok: boolean, text: string) => (
  <span className={`inline-flex items-center gap-2 text-sm font-medium ${ok ? 'text-[#4ADE80]' : 'text-[#F87171]'}`}>
    <span className={dot(ok)} />
    {text}
  </span>
);

// ─── Sparkline for CPU load ───────────────────────────────

function CpuLoadBar({ value, max }: { value: number; max: number }) {
  const pct = Math.min((value / max) * 100, 100);
  const color = pct < 50 ? '#4ADE80' : pct < 80 ? '#FBBF24' : '#F87171';
  return (
    <div className="w-full h-2 rounded-full bg-white/5">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  );
}

// ─── Card skeleton ─────────────────────────────────────────

function AdminCard({ title, children, status }: { title: string; children: React.ReactNode; status?: 'ok' | 'warn' | 'error' }) {
  const borderColor = status === 'ok' ? 'border-[#4ADE80]/20' : status === 'error' ? 'border-[#F87171]/20' : 'border-white/5';
  return (
    <div className={`bg-[#11161C] rounded-xl p-6 border ${borderColor} shadow-[0_4px_20px_rgba(0,0,0,0.3)]`}>
      <h3 className="text-xs uppercase tracking-widest text-[#9CA3AF] mb-4">{title}</h3>
      {children}
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────

export default function SystemDashboard() {
  const [data, setData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/system/health', { cache: 'no-store' })
      .then(res => res.json())
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0B0F14] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              border: '2px solid rgba(255, 255, 255, 0.2)',
              borderTopColor: '#D4AF37',
              animation: 'spin 1s linear infinite',
            }}
          />
          <p className="text-sm text-white/40">Last inn systemstatus...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-screen bg-[#0B0F14] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#F87171]">Kunne ikke laste systemdata.</p>
          {error && <p className="text-sm text-white/40 mt-2">{error}</p>}
        </div>
      </main>
    );
  }

  const s = data.status === 'ok' || data.database.status === 'connected';

  return (
    <main className="min-h-screen bg-[#0B0F14] text-white">
      {/* ─── Top banner ───────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="flex items-center gap-4 mb-12">
          <div className={`w-3 h-3 rounded-full ${s ? 'bg-[#4ADE80]' : 'bg-[#F87171]'}`} />
          <h1 className="text-2xl font-semibold">System Dashboard</h1>
          <span className="text-sm text-white/30 ml-auto">
            Sist oppdatert: {new Date(data.timestamp).toLocaleTimeString('no-NO')}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* ─── System Status ──────────────────────────── */}
          <AdminCard title="System Status" status={s ? 'ok' : 'error'}>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white/60">Oppetid</span>
                  <span className="font-mono text-white/80">{data.system.uptime}</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white/60">Uptime (sek)</span>
                  <span className="font-mono text-white/80">{data.system.uptimeSeconds}</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white/60">CPU (1m)</span>
                  <span className="font-mono text-white/80">{data.system.cpu.load1m}</span>
                </div>
                <CpuLoadBar value={data.system.cpu.load1m} max={4} />
                <div className="flex gap-4 mt-2 text-xs text-white/40">
                  <span>5m: {data.system.cpu.load5m}</span>
                  <span>15m: {data.system.cpu.load15m}</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white/60">Minne</span>
                  <span className="font-mono text-white/80">{data.system.memory.usedMB} / {data.system.memory.totalMB} MB</span>
                </div>
                <CpuLoadBar value={data.system.memory.usagePercent} max={100} />
              </div>
            </div>
          </AdminCard>

          {/* ─── Database Status ────────────────────────── */}
          <AdminCard
            title="Database"
            status={data.database.status === 'connected' ? 'ok' : data.database.status === 'error' ? 'error' : 'warn'}
          >
            <div className="space-y-4">
              <div>
                {statusLabel(
                  data.database.status === 'connected',
                  data.database.status === 'connected' ? 'Tilkoblet' : 'Frakoblet',
                )}
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Latens</span>
                <span className="font-mono text-white/80">
                  {data.database.latencyMs >= 0 ? `${data.database.latencyMs} ms` : '—'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Feil</span>
                <span className="font-mono text-white/80">
                  {data.database.error ? (
                    <span className="text-[#F87171]">{data.database.error}</span>
                  ) : (
                    <span className="text-[#4ADE80]">Ingen</span>
                  )}
                </span>
              </div>
            </div>
          </AdminCard>

          {/* ─── App Info ───────────────────────────────── */}
          <AdminCard title="App Info" status="ok">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Navn</span>
                <span className="font-mono text-white/80">{data.app.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Versjon</span>
                <span className="font-mono text-white/80">{data.app.version}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Miljø</span>
                <span className="font-mono text-white/80">{data.app.environment}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Port</span>
                <span className="font-mono text-white/80">{data.app.port}</span>
              </div>
            </div>
          </AdminCard>

          {/* ─── AI Status (placeholder) ────────────────── */}
          <AdminCard title="AI Engine" status="warn">
            <div className="space-y-4">
              <div>
                {statusLabel(false, 'Ikke konfigurert')}
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Provider</span>
                <span className="text-white/40">—</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Modell</span>
                <span className="text-white/40">—</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Status</span>
                <span className="text-white/40">Avventer konfigurasjon</span>
              </div>
            </div>
          </AdminCard>

          {/* ─── Server Info (placeholder) ──────────────── */}
          <AdminCard title="Server" status="warn">
            <div className="space-y-4">
              <div>
                {statusLabel(false, 'Informasjon utilgjengelig')}
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Node.js</span>
                <span className="font-mono text-white/80">{data.system.nodeVersion}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Next.js</span>
                <span className="font-mono text-white/80">{data.system.nextVersion}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Plattform</span>
                <span className="text-white/40">—</span>
              </div>
            </div>
          </AdminCard>

          {/* ─── Resonans Matching (placeholder) ────────── */}
          <AdminCard title="Resonans Matching" status="ok">
            <div className="space-y-4">
              <div>
                {statusLabel(true, 'Operational')}
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Engine</span>
                <span className="text-white/80">Resonans v2</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Match-rate</span>
                <span className="text-white/40">—</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Oppetid</span>
                <span className="text-white/40">—</span>
              </div>
            </div>
          </AdminCard>

        </div>

        {/* ─── Footer ───────────────────────────────────── */}
        <div className="mt-12 text-center text-xs text-white/20">
          ToSom Health Dashboard · Bygget med ⚡ og ❤️
        </div>
      </div>
    </main>
  );
}