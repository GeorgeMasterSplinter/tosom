'use client';

/**
 * ToSom — Admin Systemstatus 🚦
 * 
 * Health heatmap med fargekoder for alle system.
 * Design: ToSom Blue + Nordic Gold + Glassmorphism.
 * Bokmål. Premium. Ro. Moden.
 */

import { useState, useEffect } from 'react';

/* ─── StatusDot — farga status-indikator 🟢🟡🔴 */

function StatusDot({ status }: { status: 'ok' | 'warning' | 'error' }) {
  const config = {
    ok: { color: '#4ADE80', label: 'OK', shadow: '0 0 6px rgba(74,222,128,0.4)' },
    warning: { color: '#FBBF24', label: 'Warning', shadow: '0 0 6px rgba(251,191,36,0.4)' },
    error: { color: '#FF4D4D', label: 'Feil', shadow: '0 0 6px rgba(255,77,77,0.4)' },
  };

  const c = config[status];

  return (
    <span className="inline-flex items-center gap-2">
      <div className="flex items-center gap-1.5">
        <div
          className="w-2 h-2 rounded-full"
          style={{ background: c.color, boxShadow: c.shadow }}
        />
        <span className="text-xs font-medium" style={{ color: c.color }}>
          {c.label}
        </span>
      </div>
    </span>
  );
}

/* ─── SystemRow — éi rad i heatmap-tabellen 📋 */

function SystemRow({ name, status, latency, errors, uptime, lastCheck }: {
  name: string;
  status: 'ok' | 'warning' | 'error';
  latency: string;
  errors: number;
  uptime: string;
  lastCheck: string;
}) {
  return (
    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <td className="py-3 px-4">
        <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
          {name}
        </span>
      </td>
      <td className="py-3 px-4">
        <StatusDot status={status} />
      </td>
      <td className="py-3 px-4">
        <span className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.5)' }}>
          {latency}
        </span>
      </td>
      <td className="py-3 px-4 text-center">
        <span className="text-xs" style={{ color: errors > 0 ? '#FF4D4D' : 'rgba(255,255,255,0.4)' }}>
          {errors}
        </span>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div
              className="h-full rounded-full"
              style={{
                width: uptime,
                background: status === 'ok' ? '#4ADE80' : status === 'warning' ? '#FBBF24' : '#FF4D4D',
              }}
            />
          </div>
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
            {uptime}
          </span>
        </div>
      </td>
      <td className="py-3 px-4">
        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
          {lastCheck}
        </span>
      </td>
    </tr>
  );
}

/* ─── ErrorLogItem — éi feilmelding i loggen 📝 */

function ErrorLogItem({ time, service, message }: { time: string; service: string; message: string }) {
  return (
    <div
      className="flex items-start gap-3 py-2"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}
    >
      <div
        className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
        style={{ background: '#FBBF24' }}
      />
      <div className="flex-1 min-w-0">
        <span className="text-xs font-medium" style={{ color: 'rgba(212,175,55,0.7)' }}>
          [{service}]
        </span>
        <span className="text-xs ml-2" style={{ color: 'rgba(255,255,255,0.6)' }}>
          {message}
        </span>
      </div>
      <span className="text-xs flex-shrink-0" style={{ color: 'rgba(255,255,255,0.3)' }}>
        {time}
      </span>
    </div>
  );
}

/* ─── Mock Data ✨ */

const mockSystems = [
  { name: 'Database', status: 'ok' as const, latency: '—', errors: 0, uptime: '99.9%', lastCheck: 'no' },
  { name: 'Cron-jour', status: 'ok' as const, latency: '—', errors: 0, uptime: '99.9%', lastCheck: '1 min sidan' },
  { name: 'Matching', status: 'ok' as const, latency: '—', errors: 0, uptime: '99.9%', lastCheck: 'no' },
  { name: 'Journey', status: 'ok' as const, latency: '—', errors: 0, uptime: '99.9%', lastCheck: '2 min sidan' },
  { name: 'Chat', status: 'warning' as const, latency: '120ms', errors: 0, uptime: '99.5%', lastCheck: 'no' },
  { name: 'Biletopplasting', status: 'ok' as const, latency: '45ms', errors: 3, uptime: '99.7%', lastCheck: '5 min sidan' },
  { name: 'Auth', status: 'ok' as const, latency: '8ms', errors: 0, uptime: '99.99%', lastCheck: 'no' },
];

const mockErrors = [
  { time: '14:23', service: 'Biletopplasting', message: 'Timeout ved opplasting av profilbilde — retry OK' },
  { time: '11:05', service: 'Chat', message: 'Høg latens (180ms) på WebSocket-tilkopling — autom. restored' },
  { time: '08:47', service: 'Biletopplasting', message: 'S3 bucket rate limit exceeded — auto throttled' },
  { time: 'I går 22:15', service: 'Cron-jour', message: 'Journey dag-oppdatering feila for 2 brukarar — retry OK' },
  { time: 'Igår 18:30', service: 'Auth', message: 'Token-refresh feil — intern feil, løyst av teamet' },
];

/* ─── Hovudkomponent — Systemstatus Page 🚦 */

export default function AdminSystemPage() {
  const [lastFullCheck] = useState('2 min sidan');
  const [overallHealth] = useState<'ok' | 'warning' | 'error'>('warning');

  const healthConfig = {
    ok: { color: '#4ADE80', bg: 'rgba(74,222,128,0.08)', border: 'rgba(74,222,128,0.2)', label: 'Alle system operative' },
    warning: { color: '#FBBF24', bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.2)', label: 'Nokre system har varsel' },
    error: { color: '#FF4D4D', bg: 'rgba(255,77,77,0.08)', border: 'rgba(255,77,77,0.2)', label: 'Kritiske problem oppdage' },
  };

  const h = healthConfig[overallHealth];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1
          className="text-2xl font-bold mb-1"
          style={{ color: 'rgba(255,255,255,0.95)' }}
        >
          🚦 Systemstatus
        </h1>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Sanntids oversikt over alle system — health heatmap + feillogg
        </p>
      </div>

      {/* Overview-banner */}
      <div
        className="rounded-2xl px-5 py-4 flex items-center justify-between"
        style={{ background: h.bg, border: `1px solid ${h.border}` }}
      >
        <div className="flex items-center gap-3">
          <StatusDot status={overallHealth} />
          <span className="text-sm font-medium" style={{ color: h.color }}>
            {h.label}
          </span>
        </div>
        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
          Sist full sjekk: {lastFullCheck}
        </span>
      </div>

      {/* Health Heatmap — hovudtabell */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.6)' }}>
            HEALTH HEATMAP
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                <th className="py-3 px-4 text-left text-xs font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>System</th>
                <th className="py-3 px-4 text-left text-xs font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>Status</th>
                <th className="py-3 px-4 text-left text-xs font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>Latens</th>
                <th className="py-3 px-4 text-center text-xs font-medium w-16" style={{ color: 'rgba(255,255,255,0.35)' }}>Feil 24t</th>
                <th className="py-3 px-4 text-left text-xs font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>Oppetid</th>
                <th className="py-3 px-4 text-left text-xs font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>Siste sjekk</th>
              </tr>
            </thead>
            <tbody>
              {mockSystems.map((sys) => (
                <SystemRow key={sys.name} {...sys} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* API-endpoint-latens */}
      <div
        className="rounded-2xl p-5"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <h3 className="text-sm font-semibold mb-4" style={{ color: 'rgba(255,255,255,0.6)' }}>
          API-ENDPONT-LATENS
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { endpoint: 'POST /api/auth/login', latency: '42ms', status: 'ok' },
            { endpoint: 'GET /api/match/one', latency: '85ms', status: 'ok' },
            { endpoint: 'GET /api/journey/progress', latency: '38ms', status: 'ok' },
            { endpoint: 'WS /api/chat/stream', latency: '120ms', status: 'warning' },
            { endpoint: 'POST /api/profile/upload', latency: '45ms', status: 'ok' },
            { endpoint: 'GET /api/onboarding/status', latency: '28ms', status: 'ok' },
          ].map((api) => (
            <div
              key={api.endpoint}
              className="flex items-center justify-between px-3 py-2 rounded-lg"
              style={{ background: 'rgba(255,255,255,0.02)' }}
            >
              <span className="text-xs font-mono truncate mr-3" style={{ color: 'rgba(255,255,255,0.5)' }}>
                {api.endpoint}
              </span>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs font-mono" style={{ color: api.status === 'warning' ? '#FBBF24' : 'rgba(255,255,255,0.4)' }}>
                  {api.latency}
                </span>
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: api.status === 'ok' ? '#4ADE80' : '#FBBF24' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feillogg — sist 24t */}
      <div
        className="rounded-2xl p-5"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.6)' }}>
            FEILOGG — SISTE 24T
          </h3>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(251,191,36,0.1)', color: '#FBBF24' }}>
            5 hendingar
          </span>
        </div>
        <div>
          {mockErrors.map((err, i) => (
            <ErrorLogItem key={i} {...err} />
          ))}
        </div>
      </div>
    </div>
  );
}