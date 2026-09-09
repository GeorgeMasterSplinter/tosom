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
  loading = false,
  onClick,
}: {
  title: string;
  description: string;
  available?: boolean;
  loading?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={available && !loading ? onClick : undefined}
      disabled={!available || loading}
      className="w-full text-left px-4 py-3 rounded-xl transition-all duration-200 group"
      style={{
        background: available ? 'rgba(212,175,55,0.08)' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${available ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.06)'}`,
        cursor: available && !loading ? 'pointer' : 'not-allowed',
        opacity: available && !loading ? 1 : 0.6,
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
          {loading ? 'Kjører …' : title}
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
  const [matchRunning, setMatchRunning] = useState(false);
  const [matchResult, setMatchResult] = useState<string | null>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [selectedMatch, setSelectedMatch] = useState('');
  const [timelineDay, setTimelineDay] = useState(15);
  const [timelineLoading, setTimelineLoading] = useState(false);
  const [timelineResult, setTimelineResult] = useState<string | null>(null);
  const [emailTest, setEmailTest] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailResult, setEmailResult] = useState<string | null>(null);
  const [cronRuns, setCronRuns] = useState<any[] | null>(null);

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

  /** Last aktive matcher for Time Machine */
  const loadMatches = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/matches?status=active&limit=20');
      if (res.ok) {
        const data = await res.json();
        const list = data.data || data.matches || [];
        setMatches(list.map((m: any) => ({
          id: m.id,
          label: `${m.userA?.name || m.userA?.email || 'A'} ↔ ${m.userB?.name || m.userB?.email || 'B'}`,
        })));
      }
    } catch {}
  }, []);

  useEffect(() => { loadMatches(); }, [loadMatches]);

  const runTimeline = async () => {
    if (!selectedMatch || timelineLoading) return;
    setTimelineLoading(true);
    setTimelineResult(null);
    try {
      const res = await fetch('/api/admin/journeys/timeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchId: selectedMatch, targetDay: timelineDay }),
      });
      const data = await res.json();
      if (data.success) {
        const names = data.names?.join(' + ') || '';
        setTimelineResult(`OK: ${names} -> Dag ${timelineDay}`);
      } else {
        setTimelineResult(`Feil: ${data.error}`);
      }
    } catch (e) {
      setTimelineResult('Feil: ' + (e instanceof Error ? e.message : 'Ukjent'));
    } finally {
      setTimelineLoading(false);
    }
  };

  const sendTestEmail = async () => {
    if (!emailTest || emailLoading) return;
    setEmailLoading(true);
    setEmailResult(null);
    try {
      const userRes = await fetch(`/api/admin/users?search=${encodeURIComponent(emailTest)}`);
      const userData = await userRes.json();
      const user = userData.data?.find((u: any) => u.email === emailTest) || userData.data?.[0];
      if (!user?.id) {
        setEmailResult('Feil: Bruker ikke funnet');
        return;
      }
      const res = await fetch('/api/admin/email/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });
      const data = await res.json();
      if (data.success) {
        setEmailResult(`OK: Epost sendt til ${data.email}`);
      } else {
        setEmailResult(`Feil: ${data.error || data.status}`);
      }
    } catch (e) {
      setEmailResult('Feil: ' + (e instanceof Error ? e.message : 'Ukjent'));
    } finally {
      setEmailLoading(false);
    }
  };

  const loadCronRuns = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/cron/status');
      if (res.ok) {
        const data = await res.json();
        setCronRuns(data.runs || []);
      }
    } catch {}
  }, []);

  useEffect(() => { loadCronRuns(); }, [loadCronRuns]);

  const runMatching = async () => {
    setMatchRunning(true);
    setMatchResult(null);
    try {
      const res = await fetch('/api/admin/run-matching', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setMatchResult(data.message ?? 'Matcherunde fullført');
      } else {
        setMatchResult(`Feil: ${data.error ?? 'Ukjent feil'}`);
      }
    } catch {
      setMatchResult('Feil: Kunne ikke nå serveren');
    } finally {
      setMatchRunning(false);
      fetchLogs();
    }
  };

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
          {/* Journey Time Machine */}
          <div
            className="p-4 rounded-xl"
            style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.15)' }}
          >
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#D4AF37' }}>
              Journey Time Machine
            </p>
            <p className="text-xs mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Sett begge i en match til spesifikk dag (1–30)
            </p>
            <select
              value={selectedMatch}
              onChange={(e) => setSelectedMatch(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-xs mb-2 outline-none cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)' }}
            >
              <option value="" style={{ background: '#0A1A2A' }}>Velg match…</option>
              {matches.map((m) => (
                <option key={m.id} value={m.id} style={{ background: '#0A1A2A' }}>{m.label}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <input
                type="number"
                min={1}
                max={30}
                value={timelineDay}
                onChange={(e) => setTimelineDay(parseInt(e.target.value) || 1)}
                className="w-16 px-2 py-2 rounded-lg text-xs bg-transparent outline-none text-center"
                style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)' }}
              />
              <button
                onClick={runTimeline}
                disabled={!selectedMatch || timelineLoading}
                className="flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all disabled:opacity-40"
                style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C766)', color: '#0B1520' }}
              >
                {timelineLoading ? '…' : `Sett begge -> Dag ${timelineDay}`}
              </button>
            </div>
            {timelineResult && (
              <p className="text-xs mt-2" style={{ color: timelineResult.startsWith('OK') ? '#4ADE80' : '#FF4D4D' }}>
                {timelineResult}
              </p>
            )}
          </div>

          {/* Send Test Email */}
          <div
            className="p-4 rounded-xl"
            style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.15)' }}
          >
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#D4AF37' }}>
              Send Test Epost
            </p>
            <p className="text-xs mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Verifiser SMTP — sender velkommen-epost til valgt bruker
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                value={emailTest}
                onChange={(e) => setEmailTest(e.target.value)}
                placeholder="bruker@tosom.no"
                className="flex-1 px-3 py-2 rounded-lg text-xs bg-transparent outline-none min-w-0"
                style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)' }}
              />
              <button
                onClick={sendTestEmail}
                disabled={!emailTest || emailLoading}
                className="px-3 py-2 rounded-lg text-xs font-semibold transition-all disabled:opacity-40 shrink-0"
                style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C766)', color: '#0B1520' }}
              >
                {emailLoading ? 'Sender…' : 'Send'}
              </button>
            </div>
            {emailResult && (
              <p className="text-xs mt-2" style={{ color: emailResult.startsWith('OK') ? '#4ADE80' : '#FF4D4D' }}>
                {emailResult}
              </p>
            )}
          </div>

          {/* Run Matching */}
          <ToolButton
            title="Kjør matching manuelt"
            description="Trigg matcherunden nå (i stedet for lørdag natt)"
            available
            loading={matchRunning}
            onClick={runMatching}
          />

          {/* Cron Run Status */}
          <div
            className="p-4 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Cron Runs — siste 5
            </p>
            {cronRuns === null && <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Henter…</p>}
            {cronRuns !== null && cronRuns.length === 0 && (
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Ingen cron runs logget ennå.</p>
            )}
            {cronRuns !== null && cronRuns.length > 0 && (
              <div className="space-y-1.5">
                {cronRuns.slice(0, 5).map((run: any) => (
                  <div key={run.id} className="flex items-center gap-2 text-xs">
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: run.level === 'ERROR' ? '#FF4D4D' : run.level === 'WARN' ? '#FBBF24' : '#4ADE80' }}
                    />
                    <span className="font-mono" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      {new Date(run.createdAt).toLocaleString('nb-NO', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span style={{ color: 'rgba(255,255,255,0.4)' }}>{run.module}</span>
                    <span className="truncate flex-1" style={{ color: 'rgba(255,255,255,0.3)' }}>{run.message}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Match-resultat */}
      {matchResult && (
        <div
          className="rounded-xl px-4 py-3 text-sm"
          style={{
            background: matchResult.startsWith('Feil') ? 'rgba(255,77,77,0.08)' : 'rgba(212,175,55,0.06)',
            border: `1px solid ${matchResult.startsWith('Feil') ? 'rgba(255,77,77,0.2)' : 'rgba(212,175,55,0.15)'}`,
            color: matchResult.startsWith('Feil') ? '#FF4D4D' : 'rgba(255,255,255,0.7)',
          }}
        >
          {matchResult}
        </div>
      )}

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