'use client';

/**
 * Tosom — Admin Analytics 📊
 * Viser virkelige tall fra databasen (ingen fake data).
 */

import { useState, useEffect } from 'react';

interface DailySeries { signups: number[]; onboarding: number[]; matches: number[]; journeys: number[]; messages: number[]; }
interface KeyStats { totalUsers: number; activeUsers30d: number; totalMatches: number; avgScore: number; totalJourneys: number; completedJourneys: number; }

// B5.3: JourneyStat — anonym reisestatistikk
interface JourneyStatItem { outcome: string; count: number; }
interface JourneyStatSummary {
  total: number;
  byOutcome: Record<string, number>;
  byResonance: Record<string, number>;
  completionRateByResonance: Record<string, { completed: number; total: number }>;
}

/* ─── TimeFilter ⏱️ */
function TimeFilter({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const options = [
    { label: '7 dager', value: '7' },
    { label: '30 dager', value: '30' },
    { label: '90 dager', value: '90' },
  ];
  return (
    <div className="flex items-center gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
          style={{
            background: value === opt.value ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.03)',
            color: value === opt.value ? '#D4AF37' : 'rgba(255,255,255,0.4)',
            border: value === opt.value ? '1px solid rgba(212,175,55,0.3)' : '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

/* ─── ChartBar 📊 */
function ChartBar({ data, label }: { data: number[]; label: string }) {
  const max = Math.max(...data, 1);
  return (
    <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="text-xs mb-3 flex items-center justify-between" style={{ color: 'rgba(255,255,255,0.5)' }}>
        <span>{label}</span>
        <span className="font-medium" style={{ color: '#D4AF37' }}>{data.reduce((a, b) => a + b, 0).toLocaleString()} totalt</span>
      </div>
      {data.some(v => v > 0) ? (
        <div className="flex items-end gap-1 h-24">
          {data.slice(-14).map((val, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-t transition-all duration-500"
                style={{
                  height: `${(val / max) * 100}%`,
                  minHeight: val > 0 ? '4px' : '0',
                  background: `linear-gradient(180deg, rgba(212,175,55,0.6) 0%, rgba(212,175,55,0.15) 100%)`,
                }}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-24 text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>Ingen data</div>
      )}
    </div>
  );
}

/* ─── SummaryStat 🎯 */
function SummaryStat({ label, value, unit, color }: { label: string; value: string | number; unit?: string; color?: string }) {
  return (
    <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${color || 'rgba(255,255,255,0.06)'}` }}>
      <div className="text-2xl font-bold mb-1" style={{ color: color || '#D4AF37' }}>
        {typeof value === 'number' ? value.toLocaleString() : value}
        {unit && <span className="text-sm ml-0.5">{unit}</span>}
      </div>
      <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</div>
    </div>
  );
}

/* ─── Skeleton */
function Skeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-48 rounded bg-white/5" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-40 rounded-2xl bg-white/5" />)}
      </div>
    </div>
  );
}

/* ─── B5.3: JourneyStatPanel — reisestatistikk (validerer matchemotoren) ─── */
function JourneyStatPanel({ stats }: { stats: JourneyStatSummary | null }) {
  if (!stats || stats.total === 0) {
    return (
      <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <h3 className="text-sm font-semibold mb-3 tracking-wide" style={{ color: 'rgba(255,255,255,0.6)' }}>REISESTATISTIKK (JOURNEYSTAT)</h3>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>Ingen fullførte reiser ennå. Statistikken fylles når reiser avsluttes.</p>
      </div>
    );
  }

  const outcomeLabels: Record<string, string> = {
    found_each_other: 'Fant hverandre 💛',
    new_journey: 'Ny reise 🔄',
    early_exit: 'Tidlig avslutning',
    expired: 'Utløpt',
    completed: 'Fullført',
  };

  const resonanceLabels: Record<string, string> = {
    DEEP: 'Dyp resonans',
    STRONG: 'Sterk resonans',
    MODERATE: 'God resonans',
    GENTLE: 'Rolig resonans',
  };

  return (
    <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <h3 className="text-sm font-semibold mb-4 tracking-wide" style={{ color: 'rgba(255,255,255,0.6)' }}>
        REISESTATISTIKK ({stats.total} avsluttede reiser)
      </h3>

      {/* Utfall */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {Object.entries(stats.byOutcome).map(([outcome, count]) => (
          <div key={outcome} className="rounded-xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="text-xl font-bold" style={{ color: '#D4AF37' }}>{count}</div>
            <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{outcomeLabels[outcome] || outcome}</div>
          </div>
        ))}
      </div>

      {/* Fullføringsgrad per resonansnivå — den viktigste metrikken */}
      <div className="mb-2">
        <h4 className="text-xs font-semibold mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
          FULLFØRINGSGRAD PER RESONANSNIVÅ (validerer matchemotoren)
        </h4>
        <div className="space-y-2">
          {Object.entries(stats.completionRateByResonance).map(([level, data]) => {
            const rate = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0;
            return (
              <div key={level} className="flex items-center gap-3">
                <span className="text-xs w-28" style={{ color: 'rgba(255,255,255,0.5)' }}>{resonanceLabels[level] || level}</span>
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <div className="h-full rounded-full" style={{ width: `${rate}%`, background: '#D4AF37' }} />
                </div>
                <span className="text-xs font-medium w-16 text-right" style={{ color: '#D4AF37' }}>
                  {rate} % ({data.completed}/{data.total})
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── Hovedkomponent 📊 */
export default function AdminAnalyticsPage() {
  const [timeFilter, setTimeFilter] = useState('30');
  const [series, setSeries] = useState<DailySeries | null>(null);
  const [stats, setStats] = useState<KeyStats | null>(null);
  const [journeyStats, setJourneyStats] = useState<JourneyStatSummary | null>(null); // B5.3
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/analytics?days=${timeFilter}`).then((r) => r.json()),
      fetch('/api/admin/journey-stats').then((r) => r.json()).catch(() => null), // B5.3
    ])
      .then(([data, jsData]) => {
        if (data.success) {
          setSeries(data.dailySeries || { signups: [], onboarding: [], matches: [], journeys: [], messages: [] });
          setStats(data.keyStats || { totalUsers: 0, activeUsers30d: 0, totalMatches: 0, avgScore: 0, totalJourneys: 0, completedJourneys: 0 });
        }
        if (jsData) setJourneyStats(jsData);
      })
      .catch(() => setSeries({ signups: [], onboarding: [], matches: [], journeys: [], messages: [] }))
      .finally(() => setLoading(false));
  }, [timeFilter]);

  if (loading) return <Skeleton />;

  const s = series || { signups: [], onboarding: [], matches: [], journeys: [], messages: [] };
  const st = stats || { totalUsers: 0, activeUsers30d: 0, totalMatches: 0, avgScore: 0, totalJourneys: 0, completedJourneys: 0 };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'rgba(255,255,255,0.95)' }}>📊 Statistikk</h1>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Ekte data fra Tosom-plattformen</p>
        </div>
        <TimeFilter value={timeFilter} onChange={setTimeFilter} />
      </div>

      {/* Grafer */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ChartBar data={s.signups} label="📈 Daglige registreringer" />
        <ChartBar data={s.onboarding} label="✅ Fullførte onboarding" />
        <ChartBar data={s.matches} label="💞 Matcher per dag" />
        <ChartBar data={s.journeys} label="🚀 Reiser startet" />
        <ChartBar data={s.messages} label="💬 Chat-aktivitet" />
      </div>

      {/* Nøkkeltall */}
      <div>
        <h3 className="text-sm font-semibold mb-3 tracking-wide" style={{ color: 'rgba(255,255,255,0.6)' }}>NØKKELTALL</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <SummaryStat label="Gj.snitt poengsum" value={st.avgScore} unit="%" color="#D4AF37" />
          <SummaryStat label="Aktive brukere (30d)" value={st.activeUsers30d} color="#4ADE80" />
          <SummaryStat label="Matcher totalt" value={st.totalMatches} color="#8B5CF6" />
          <SummaryStat label="Reiser startet" value={st.totalJourneys} color="#FBBF24" />
          <SummaryStat label="Registrerte brukere" value={st.totalUsers} color="#D4AF37" />
          <SummaryStat label="Fullførte reiser" value={st.completedJourneys} color="#4ADE80" />
        </div>

        {/* Totale brukere */}
        <div className="rounded-2xl p-6 mt-4 flex items-center justify-between" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div>
            <div className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>TOTALE REGISTRERTE BRUKERE</div>
            <div className="text-4xl font-bold" style={{ color: '#D4AF37' }}>{st.totalUsers.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* B5.3: Reisestatistikk fra JourneyStat */}
      <JourneyStatPanel stats={journeyStats} />
    </div>
  );
}
