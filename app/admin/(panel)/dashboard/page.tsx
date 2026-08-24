'use client';

/**
 * Tosom — Admin Dashboard (B5.2)
 *
 * Kommandopanel med statusfarger (grønn/gul/rød).
 * Étt API-kall (/api/admin/overview) for alle indikatorer.
 * Er alt grønt, trenger du ikke klikke deg videre.
 */

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  type Severity,
  thresholdLastMatchRound,
  thresholdQueueSize,
  thresholdRoundDuration,
  thresholdOpenReports,
  thresholdFreeQuota,
  thresholdPendingJourneys,
  thresholdSentryErrors,
} from '@/components/admin/StatusBadge';
import { PRICING } from '@/config/legal';
import { actionFor, explainFor } from '@/components/admin/thresholds';
import { ActionRequired, type ActionItem } from '@/components/admin/ActionRequired';
import {
  UsersIcon,
  MatchIcon,
  JourneyIcon,
  ChatIcon,
  OverviewIcon,
} from '@/components/admin/icons';

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

// Overview-data fra /api/admin/overview
interface OverviewData {
  indicators: {
    lastMatchRound: { hoursSince: number | null; lastAt: string | null; durationMs: number | null };
    queueSize: number;
    openReports: number;
    freeQuotaUsed: number;
    pendingJourneys: number;
    errorsLast24h: number;
  };
  counts: { totalUsers: number; activeMatches: number; ongoingJourneys: number };
  journeyStats: Array<{ outcome: string; count: number }>;
  timestamp: string;
}

/* ─── Bygg ActionItem[] fra overview-dataene ─── */
function buildActionItems(overview: OverviewData): ActionItem[] {
  const ind = overview.indicators;

  const defs: Array<{ key: string; label: string; severity: Severity; value: string; href?: string }> = [
    {
      key: 'lastMatchRound',
      label: 'Siste matcherunde',
      severity: thresholdLastMatchRound(ind.lastMatchRound.hoursSince),
      value: ind.lastMatchRound.hoursSince !== null
        ? `${Math.round(ind.lastMatchRound.hoursSince)} t siden`
        : 'Aldri',
      href: '/admin/system/status',
    },
    {
      key: 'queueSize',
      label: 'Kø til neste runde',
      severity: thresholdQueueSize(ind.queueSize),
      value: `${ind.queueSize}`,
      href: '/admin/invites',
    },
    {
      key: 'roundDuration',
      label: 'Runde-varighet',
      severity: thresholdRoundDuration(ind.lastMatchRound.durationMs),
      value: ind.lastMatchRound.durationMs !== null
        ? `${(ind.lastMatchRound.durationMs / 1000).toFixed(1)} s`
        : '—',
    },
    {
      key: 'openReports',
      label: 'Åpne rapporter',
      severity: thresholdOpenReports(ind.openReports),
      value: `${ind.openReports}`,
      href: '/admin/reports',
    },
    {
      key: 'errorsLast24h',
      label: 'Feil siste døgn',
      severity: thresholdSentryErrors(ind.errorsLast24h),
      value: `${ind.errorsLast24h}`,
      href: '/admin/logs',
    },
    {
      key: 'freeQuota',
      label: 'Gratiskvote',
      severity: thresholdFreeQuota(ind.freeQuotaUsed),
      value: `${ind.freeQuotaUsed.toLocaleString('nb-NO')} / ${PRICING.freeUserCap.toLocaleString('nb-NO')}`,
    },
    {
      key: 'pendingJourneys',
      label: 'Reiser som venter på fremrykk',
      severity: thresholdPendingJourneys(ind.pendingJourneys),
      value: `${ind.pendingJourneys}`,
      href: '/admin/journeys',
    },
  ];

  return defs.map((d) => ({ ...d, action: actionFor(d.key, d.severity) }));
}

const SEVERITY_COLOR: Record<Severity, string> = {
  ok: '#34D399',
  warn: '#FBBF24',
  critical: '#FF4D4D',
};

/* ─── Indikatorkort med forklaring ─── */
function IndicatorCard({ item }: { item: ActionItem }) {
  const color = SEVERITY_COLOR[item.severity];

  return (
    <div
      className="rounded-xl p-4"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>{item.label}</span>
      </div>
      <div className="text-lg font-mono font-semibold mb-1" style={{ color }}>
        {item.value}
      </div>
      <p className="text-[11px] leading-snug" style={{ color: 'rgba(255,255,255,0.28)' }}>
        {item.action ?? explainFor(item.key)}
      </p>
    </div>
  );
}

/* ─── Nøkkelkort med ikon og monospace ─── */
function MetricCard({
  label, value, color, href, Icon,
}: {
  label: string;
  value: string | number;
  color: string;
  href: string;
  Icon: (p: { className?: string; size?: number }) => JSX.Element;
}) {
  return (
    <Link
      href={href}
      className="rounded-xl p-4 block transition-colors duration-200 hover:bg-white/[0.04]"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="flex items-center justify-between mb-2">
        <Icon size={15} className="opacity-40" />
        <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.2)' }}>→</span>
      </div>
      <div className="text-2xl font-mono font-bold leading-none mb-1.5" style={{ color }}>
        {value}
      </div>
      <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</div>
    </Link>
  );
}

/* ─── JourneyPhaseMonitor ─── */
function JourneyPhaseMonitor({ phases }: { phases?: Record<string, number> }) {
  const phaseLabels = ['Bli kjent (1-14)', 'Bygger tillit (15-21)', 'Djupere (22-30)'];
  const phaseColors = ['#4ADE80', '#D4AF37', '#FBBF24'];
  const phaseKeys = ['EARLY', 'BUILDING_TRUST', 'DEEPER'];

  const phaseData = phaseKeys.map((key, i) => ({
    label: phaseLabels[i],
    count: phases?.[key] ?? 0,
    color: phaseColors[i],
  }));

  const total = phaseData.reduce((s, p) => s + p.count, 0) || 1;

  return (
    <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <h3 className="text-xs font-semibold mb-4 uppercase tracking-[0.12em]" style={{ color: 'rgba(255,255,255,0.4)' }}>
        Reisefasemonitor
      </h3>

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
            <span className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.7)' }}>
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
            Object.entries(data.services).map(([name, status]: [string, unknown]) => ({
              name,
              status: status === 'ok' ? 'ok' : status === 'error' ? 'error' : 'warning',
            })),
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
      <h3 className="text-xs font-semibold mb-4 uppercase tracking-[0.12em]" style={{ color: 'rgba(255,255,255,0.4)' }}>
        Systemtjenester
      </h3>

      {loading ? (
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Laster …</p>
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
            Feil 24 t:{' '}
            <span className="font-mono font-semibold" style={{ color: errorsLast24h > 0 ? '#FBBF24' : '#4ADE80' }}>{errorsLast24h}</span>
          </span>
        </div>
      )}
    </div>
  );
}

/* ─── Hovedkomponent ─── */
export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      fetch('/api/admin/metrics')
        .then((res) => { if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.json(); }),
      fetch('/api/admin/overview')
        .then((res) => (res.ok ? res.json() : null))
        .catch(() => null),
    ])
      .then(([metricsData, overviewData]) => {
        setMetrics(metricsData);
        setOverview(overviewData);
        setLastUpdated(new Date());
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const actionItems = overview ? buildActionItems(overview) : [];

  return (
    <div className="space-y-6">
      {/* Topplinje */}
      <div className="pb-4" style={{ borderBottom: '1px solid rgba(212,175,55,0.15)' }}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold mb-0.5" style={{ color: 'rgba(255,255,255,0.92)' }}>
              Kommandopanel
            </h1>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
              {lastUpdated
                ? `Oppdatert ${lastUpdated.toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit' })}`
                : 'Henter data …'}
            </p>
          </div>
          <button
            onClick={load}
            disabled={loading}
            className="text-xs px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40"
            style={{
              background: 'rgba(212,175,55,0.08)',
              border: '1px solid rgba(212,175,55,0.2)',
              color: '#D4AF37',
            }}
          >
            {loading ? 'Henter …' : 'Oppdater'}
          </button>
        </div>
      </div>

      {error && (
        <div
          className="rounded-xl px-4 py-3"
          style={{ background: 'rgba(255,77,77,0.08)', border: '1px solid rgba(255,77,77,0.2)' }}
        >
          <p className="text-xs" style={{ color: '#FF4D4D' }}>
            {error}
          </p>
        </div>
      )}

      {/* Krever handling */}
      {overview && <ActionRequired items={actionItems} />}

      {/* Nøkkelkort */}
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
            <MetricCard label="Brukere" value={metrics.users.total.toLocaleString('nb-NO')} color="#D4AF37" href="/admin/users" Icon={UsersIcon} />
            <MetricCard label="Aktive" value={metrics.users.active.toLocaleString('nb-NO')} color="#4ADE80" href="/admin/users" Icon={UsersIcon} />
            <MetricCard label="Matcher" value={metrics.matches.active.toLocaleString('nb-NO')} color="#D4AF37" href="/admin/matches" Icon={MatchIcon} />
            <MetricCard label="Reiser" value={metrics.journeys.ongoing.toLocaleString('nb-NO')} color="#60A5FA" href="/admin/journeys" Icon={JourneyIcon} />
            <MetricCard label="Meldinger" value={metrics.messages.total.toLocaleString('nb-NO')} color="#34D399" href="/admin/conversations" Icon={ChatIcon} />
            <MetricCard label="Konvers." value={metrics.conversations.active.toLocaleString('nb-NO')} color="#8B5CF6" href="/admin/conversations" Icon={OverviewIcon} />
          </>
        ) : null}
      </div>

      {/* Alle indikatorer med forklaring */}
      {overview && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.12em] mb-3" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Indikatorer
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {actionItems.map((item) => (
              <IndicatorCard key={item.key} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* Systemtjenester + reisefaser side om side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SystemStatus errorsLast24h={metrics?.system.errorsLast24h} />
        <JourneyPhaseMonitor phases={metrics?.journeys.phases} />
      </div>
    </div>
  );
}