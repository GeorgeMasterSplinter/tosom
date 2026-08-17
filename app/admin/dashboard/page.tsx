'use client';

/**
 * Tosom — Admin Dashboard (B5.2) 🟡⭐
 *
 * Kommandopanel med statusfarger (grønn/gul/rød).
 * Étt API-kall (/api/admin/overview) for alle indikatorer.
 * Er alt grønt, trenger du ikke klikke deg videre.
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import StatusBadge, {
  type Severity,
  thresholdLastMatchRound,
  thresholdQueueSize,
  thresholdRoundDuration,
  thresholdOpenReports,
  thresholdFreeQuota,
  thresholdSentryErrors,
} from '@/components/admin/StatusBadge';

/* ─── Types ─── */
interface MetricsData {
  users: { total: number; active: number; onboardingComplete: number };
  matches: { total: number; active: number; pending: number };
  conversations: { total: number; active: number };
  journeys: { ongoing: number; phases: Record<string, number> };
  messages: { total: number };
  system: { errorsLast24h: number };
  timestamp: string;
}

// B5.2: Overview-data fra /api/admin/overview
interface OverviewData {
  indicators: {
    lastMatchRound: { hoursSince: number | null; lastAt: string | null; durationMs: number | null };
    queueSize: number;
    openReports: number;
    freeQuotaUsed: number;
    errorsLast24h: number;
  };
  counts: { totalUsers: number; activeMatches: number; ongoingJourneys: number };
  journeyStats: Array<{ outcome: string; count: number }>;
  timestamp: string;
}

/* ─── B5.2: StatusPanel — alle indikatorer med StatusBadge ─── */
function StatusPanel({ overview }: { overview: OverviewData }) {
  const ind = overview.indicators;

  const indicators: Array<{ label: string; severity: Severity; value: string }> = [
    {
      label: 'Siste matcherunde',
      severity: thresholdLastMatchRound(ind.lastMatchRound.hoursSince),
      value: ind.lastMatchRound.hoursSince !== null
        ? `${Math.round(ind.lastMatchRound.hoursSince)} t siden`
        : 'Aldri',
    },
    {
      label: 'Kø-størrelse',
      severity: thresholdQueueSize(ind.queueSize),
      value: `${ind.queueSize}`,
    },
    {
      label: 'Runde-varighet',
      severity: thresholdRoundDuration(ind.lastMatchRound.durationMs),
      value: ind.lastMatchRound.durationMs !== null
        ? `${(ind.lastMatchRound.durationMs / 1000).toFixed(1)} s`
        : '—',
    },
    {
      label: 'Åpne rapporter',
      severity: thresholdOpenReports(ind.openReports),
      value: `${ind.openReports}`,
    },
    {
      label: 'Feil 24 t',
      severity: thresholdSentryErrors(ind.errorsLast24h),
      value: `${ind.errorsLast24h}`,
    },
    {
      label: 'Gratiskvote',
      severity: thresholdFreeQuota(ind.freeQuotaUsed),
      value: `${ind.freeQuotaUsed.toLocaleString()} / 10 000`,
    },
  ];

  // Overall status: verste severity vinner
  const worst = indicators.reduce<Severity>((acc, i) => {
    if (i.severity === 'critical') return 'critical';
    if (i.severity === 'warn' && acc !== 'critical') return 'warn';
    return acc;
  }, 'ok');

  return (
    <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold tracking-wide" style={{ color: 'rgba(255,255,255,0.6)' }}>
          STATUSOVERSIKT
        </h3>
        <StatusBadge
          severity={worst}
          label={worst === 'ok' ? 'Alt grønt' : worst === 'warn' ? 'Advarsler' : 'Kritisk'}
        />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {indicators.map((ind) => (
          <div
            key={ind.label}
            className="rounded-xl p-3"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            <div className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>{ind.label}</div>
            <StatusBadge severity={ind.severity} label="" value={ind.value} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── CompactMetric — kompakt metrik-kort ─── */
function CompactMetric({ label, value, color, href }: { label: string; value: string | number; color: string; href?: string }) {
  const Wrapper = href ? Link : 'div';
  return (
    <Wrapper href={href || ''} className={`rounded-xl p-4 ${href ? 'transition-all duration-200 hover:brightness-110' : ''}`} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="text-3xl font-bold mb-1" style={{ color }}>{value}</div>
      <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</div>
    </Wrapper>
  );
}

/* ─── JourneyPhaseMonitor ─── */
function JourneyPhaseMonitor({ phases }: { phases?: Record<string, number> }) {
  const phaseLabels = ['Bli kjent (1-14)', 'Bygger tillit (15-21)', 'Djupere (22-30)'];
  const phaseColors = ['#4ADE80', '#D4AF37', '#FBBF24'];
  const phaseKeys = ['EARLY', 'BUILDING_TRUST', 'DEEPER'];

  const phaseData = phaseKeys.map((key, i) => ({
    label: phaseLabels[i],
    count: (phases?.[key] ?? 0),
    color: phaseColors[i],
  }));

  const total = phaseData.reduce((s, p) => s + p.count, 0) || 1;

  return (
    <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <h3 className="text-sm font-semibold mb-4 tracking-wide" style={{ color: 'rgba(255,255,255,0.6)' }}>REISEFASEMONITOR</h3>

      <div className="flex rounded-full overflow-hidden h-3 mb-4" style={{ background: 'rgba(255,255,255,0.05)' }}>
        {phaseData.map((p) => (
          <div key={p.label} className="h-full transition-all duration-700" style={{ width: `${(p.count / total) * 100}%`, background: p.color }} />
        ))}
      </div>

      <div className="space-y-2">
        {phaseData.map((p) => (
          <div key={p.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{p.label}</span>
            </div>
            <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
              {p.count} ({Math.round((p.count / total) * 100)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── SystemStatus ─── */
function SystemStatus({ errorsLast24h }: { errorsLast24h?: number }) {
  const [services, setServices] = useState<{ name: string; status: 'ok' | 'warning' | 'error' }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/system/health')
      .then((res) => res.json())
      .then((data) => {
        if (data?.services) {
          setServices(
            Object.entries(data.services).map(([name, status]: [string, any]) => ({
              name,
              status: status === 'ok' ? 'ok' : status === 'error' ? 'error' : 'warning',
            }))
          );
        } else {
          setServices([
            { name: 'Database', status: 'ok' },
            { name: 'Auth', status: 'ok' },
            { name: 'Chat', status: 'ok' },
          ]);
        }
      })
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, []);

  const statusConfig = {
    ok: { color: '#4ADE80', label: 'OK' },
    warning: { color: '#FBBF24', label: 'Advarsel' },
    error: { color: '#FF4D4D', label: 'Feil' },
  };

  return (
    <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <h3 className="text-sm font-semibold mb-4 tracking-wide" style={{ color: 'rgba(255,255,255,0.6)' }}>SYSTEMSTATUS</h3>

      {loading ? (
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Laster...</p>
      ) : (
        <div className="space-y-3">
          {services.map((s) => {
            const c = statusConfig[s.status];
            return (
              <div key={s.name} className="flex items-center justify-between">
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{s.name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: c.color }} />
                  <span className="text-xs font-medium" style={{ color: c.color }}>{c.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {errorsLast24h !== undefined && (
        <div className="mt-4 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Feil 24t:{' '}
            <strong style={{ color: errorsLast24h > 0 ? '#FBBF24' : '#4ADE80' }}>{errorsLast24h}</strong>
          </span>
        </div>
      )}
    </div>
  );
}

/* ─── Hovedkomponent ─── */
export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [overview, setOverview] = useState<OverviewData | null>(null); // B5.2
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // B5.2: Étt API-kall for alle indikatorer + eksisterende metrics
    Promise.all([
      fetch('/api/admin/metrics').then((res) => { if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.json(); }),
      fetch('/api/admin/overview').then((res) => { if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.json(); }).catch(() => null),
    ])
      .then(([metricsData, overviewData]) => {
        setMetrics(metricsData);
        setOverview(overviewData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'rgba(255,255,255,0.95)' }}>Kommandopanel</h1>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Oversikt over Tosom-plattformen</p>
        </div>
        <span className="text-xs px-3 py-1.5 rounded-full font-medium" style={{
          background: loading ? 'rgba(251,191,36,0.1)' : error ? 'rgba(255,77,77,0.1)' : 'rgba(74,222,128,0.1)',
          color: loading ? '#FBBF24' : error ? '#FF4D4D' : '#4ADE80',
          border: `1px solid ${loading ? 'rgba(251,191,36,0.2)' : error ? 'rgba(255,77,77,0.2)' : 'rgba(74,222,128,0.2)'}`,
        }}>
          {loading ? '⏳ Laster...' : error ? `⚠ ${error}` : '● System aktiv'}
        </span>
      </div>

      {/* Kompakte Metrikk-kort */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl p-4 animate-pulse" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="h-8 bg-white/5 rounded w-1/2 mb-2" />
              <div className="h-3 bg-white/5 rounded w-3/4" />
            </div>
          ))
        ) : metrics ? (
          <>
            <CompactMetric label="Brukere" value={metrics.users.total.toLocaleString()} color="#D4AF37" href="/admin/users" />
            <CompactMetric label="Aktive" value={metrics.users.active.toLocaleString()} color="#4ADE80" href="/admin/users?active=1" />
            <CompactMetric label="Matcher" value={metrics.matches.active.toLocaleString()} color="#D4AF37" href="/admin/matches" />
            <CompactMetric label="Reiser" value={metrics.journeys.ongoing.toLocaleString()} color="#60A5FA" href="/admin/journeys" />
            <CompactMetric label="Meldinger" value={metrics.messages.total.toLocaleString()} color="#34D399" href="/admin/conversations" />
            <CompactMetric label="Konvers." value={metrics.conversations.active.toLocaleString()} color="#8B5CF6" href="/admin/conversations" />
          </>
        ) : null}
      </div>

      {/* B5.2: StatusPanel med alle indikatorer */}
      {overview && <StatusPanel overview={overview} />}

      {/* SystemStatus + JourneyPhase — side om side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SystemStatus errorsLast24h={metrics?.system.errorsLast24h} />
        <JourneyPhaseMonitor phases={metrics?.journeys.phases} />
      </div>
    </div>
  );
}
