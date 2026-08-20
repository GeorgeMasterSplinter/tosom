'use client';

/**
 * Tosom — Admin Verktøy
 *
 * Verktøy for drift og testing + systemlogg.
 * Knapper uten backend deaktiveres og merkes «Ikke tilgjengelig ennå».
 * Loggen hentes fra /api/admin/system-logs.
 */

import { useState, useEffect, useCallback } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { nb } from 'date-fns/locale';

/* ─── Typer ─── */

interface SystemLog {
  id: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  message: string;
  module: string;
  metadata: string | null;
  createdAt: string;
}

interface LogStats {
  errorCount: number;
  warningCount: number;
  infoCount: number;
  total: number;
}

/* ─── Verktøy-knapp ─── */

function ToolButton({
  title,
  description,
  available = false,
  onClick,
}: {
  title: string;
  description: string;
  available?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={available ? onClick : undefined}
      disabled={!available}
      className="w-full text-left px-4 py-3 rounded-xl transition-all duration-200 group"
      style={{
        background: available ? 'rgba(212,175,55,0.08)' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${available ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.06)'}`,
        cursor: available ? 'pointer' : 'not-allowed',
        opacity: available ? 1 : 0.6,
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ background: available ? '#D4AF37' : 'rgba(255,255,255,0.15)' }}
        />
        <span
          className="text-sm font-medium"
          style={{ color: available ? '#D4AF37' : 'rgba(255,255,255,0.4)' }}
        >
          {title}
        </span>
      </div>
      <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)' }}>
        {description}
      </p>
      {!available && (
        <p className="text-[11px] mt-1.5 font-medium" style={{ color: 'rgba(255,255,255,0.2)' }}>
          Ikke tilgjengelig ennå
        </p>
      )}
    </button>
  );
}

/* ─── Logg-rad ─── */

function LogRow({ log }: { log: SystemLog }) {
  const levelColor =
    log.level === 'ERROR' ? '#FF4D4D' : log.level === 'WARN' ? '#FBBF24' : 'rgba(255,255,255,0.4)';

  const timeAgo = formatDistanceToNow(new Date(log.createdAt), {
    addSuffix: true,
    locale: nb,
  });

  return (
    <div
      className="flex items-start gap-3 py-2.5"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
    >
      <span
        className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: levelColor }}
      />
      <div className="min-w-0 flex-1">
        <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.7)' }}>
          {log.message}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[10px] font-mono" style={{ color: 'rgba(255,255,255,0.25)' }}>
            {log.module}
          </span>
          <span
            className="text-[10px] font-semibold px-1.5 py-px rounded"
            style={{
              color: levelColor,
              background:
                log.level === 'ERROR'
                  ? 'rgba(255,77,77,0.1)'
                  : log.level === 'WARN'
                    ? 'rgba(251,191,36,0.1)'
                    : 'rgba(255,255,255,0.04)',
            }}
          >
            {log.level}
          </span>
        </div>
      </div>
      <span className="text-[11px] flex-shrink-0 mt-0.5" style={{ color: 'rgba(255,255,255,0.25)' }}>
        {timeAgo}
      </span>
    </div>
  );
}

/* ─── Hovedkomponent ─── */

export default function AdminToolsPage() {
  const [logs, setLogs] = useState<SystemLog[] | null>(null);
  const [stats, setStats] = useState<LogStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(() => {
    setError(null);
    fetch('/api/admin/system-logs?limit=20')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('Feil'))))
      .then((d) => {
        setLogs(d.data ?? []);
        setStats(d.stats ?? null);
      })
      .catch(() => setError('Kunne ikke hente systemlogg.'));
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'rgba(255,255,255,0.95)' }}>
            Verktøy
          </h1>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Driftsverktøy og systemlogg
          </p>
        </div>
        <button
          onClick={fetchLogs}
          disabled={logs === null}
          className="text-xs px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40"
          style={{
            background: 'rgba(212,175,55,0.08)',
            border: '1px solid rgba(212,175,55,0.2)',
            color: '#D4AF37',
          }}
        >
          Oppdater
        </button>
      </div>

      {/* Verktøy-grid */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-[0.12em] mb-3" style={{ color: 'rgba(255,255,255,0.3)' }}>
          Verktøy
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <ToolButton
            title="Opprett testbruker"
            description="Lag ny bruker med testdata"
          />
          <ToolButton
            title="Reset match"
            description="Nullstill ei eksisterende match"
          />
          <ToolButton
            title="Reset journey"
            description="Start reise på nytt (dag 1/30)"
          />
          <ToolButton
            title="Kjør cron manuelt"
            description="Trigg journey-oppdatering og matching"
          />
          <ToolButton
            title="Generer testdata"
            description="Lag random matcher og reiser"
          />
          <ToolButton
            title="Debug-panel"
            description="Vis interne systemvariabler"
          />
        </div>
      </div>

      {/* Systemlogg */}
      <div
        className="rounded-2xl p-5"
        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Systemlogg — siste 20
          </h3>
          {stats && (
            <div className="flex items-center gap-2">
              {stats.errorCount > 0 && (
                <span
                  className="text-[10px] font-mono px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(255,77,77,0.1)', color: '#FF4D4D' }}
                >
                  {stats.errorCount} feil
                </span>
              )}
              {stats.warningCount > 0 && (
                <span
                  className="text-[10px] font-mono px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(251,191,36,0.1)', color: '#FBBF24' }}
                >
                  {stats.warningCount} varsel
                </span>
              )}
              <span
                className="text-[10px] font-mono px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.3)' }}
              >
                {stats.total} totalt
              </span>
            </div>
          )}
        </div>

        {error && (
          <p className="text-sm" style={{ color: '#FF4D4D' }}>
            {error}
          </p>
        )}

        {logs === null && !error && (
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Henter …
          </p>
        )}

        {logs !== null && logs.length === 0 && (
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Ingen loggmeldinger ennå.
          </p>
        )}

        {logs !== null && logs.length > 0 && (
          <div>
            {logs.map((log) => (
              <LogRow key={log.id} log={log} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}