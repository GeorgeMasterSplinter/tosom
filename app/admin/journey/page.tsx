'use client';

import { useState } from 'react';
import GlassCard from '@/components/ui/cards/GlassCard';

const mockJourneyStats = {
  activeJourneys: 67,
  completedJourneys: 234,
  avgCompletionRate: 0.68,
  dailyCompletion: [
    { day: 1, rate: 0.95 },
    { day: 5, rate: 0.87 },
    { day: 10, rate: 0.76 },
    { day: 15, rate: 0.65 },
    { day: 20, rate: 0.52 },
    { day: 25, rate: 0.41 },
    { day: 30, rate: 0.34 },
  ],
  taskCompletion: {
    reflection: 0.82,
    conversation: 0.74,
    exercise: 0.61,
    resonance: 0.88,
  },
  dropOffReasons: [
    { reason: 'Manglande aktivitet', count: 45, pct: 0.38 },
    { reason: 'Ikke resonans', count: 38, pct: 0.32 },
    { reason: 'Tid/økonomi', count: 22, pct: 0.18 },
    { reason: 'Anna', count: 12, pct: 0.12 },
  ],
};

export default function AdminJourneyPage() {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');

  return (
    <div className="flex flex-col gap-6 p-8 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white/90">Journey Analytics</h1>
          <p className="text-sm text-white/40 mt-1">Reise-fremgang og fullføringsstatistikk</p>
        </div>
        <div className="flex gap-2">
          {(['7d', '30d', '90d'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                period === p
                  ? 'bg-[rgba(212,175,55,0.15)] text-[#D4AF37]'
                  : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]'
              }`}
              style={period === p ? { border: '1px solid rgba(212,175,55,0.25)' } : { border: '1px solid rgba(255,255,255,0.06)' }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MiniCard label="Aktive reiser" value={mockJourneyStats.activeJourneys.toString()} color="#4DFF88" />
        <MiniCard label="Fullførte" value={mockJourneyStats.completedJourneys.toString()} color="#60A5FA" />
        <MiniCard label="Snitt fullføring" value={`${Math.round(mockJourneyStats.avgCompletionRate * 100)}%`} color="#D4AF37" />
        <MiniCard label="Dag 14 (bilde)" value="14" color="#FFD437" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Progress chart (bar) */}
        <GlassCard className="p-5">
          <h3 className="text-sm font-semibold text-white/70 mb-4">Daglig fullføringsrate</h3>
          <div className="flex items-end gap-2 h-40">
            {mockJourneyStats.dailyCompletion.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full relative rounded-t" style={{ height: `${d.rate * 120}px`, background: 'linear-gradient(180deg, rgba(212,175,55,0.4), rgba(212,175,55,0.1))', borderTop: '1px solid rgba(212,175,55,0.5)' }}>
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-white/40">{Math.round(d.rate * 100)}%</div>
                </div>
                <span className="text-[10px] text-white/30">{d.day}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Task completion */}
        <GlassCard className="p-5">
          <h3 className="text-sm font-semibold text-white/70 mb-4">Oppgave-fulleføring</h3>
          <div className="space-y-4">
            {Object.entries(mockJourneyStats.taskCompletion).map(([task, rate]) => {
              const labels: Record<string, string> = { reflection: 'Refleksjon', conversation: 'Samtale', exercise: 'Oppgåve', resonance: 'Resonans' };
              return (
                <div key={task}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-white/50">{labels[task]}</span>
                    <span className="text-xs font-semibold" style={{ color: '#D4AF37' }}>{Math.round(rate * 100)}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div className="h-2 rounded-full" style={{ width: `${rate * 100}%`, background: rate > 0.7 ? '#4DFF88' : rate > 0.5 ? '#D4AF37' : '#FFD437' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </div>

      {/* Drop-off analysis */}
      <GlassCard className="p-5">
        <h3 className="text-sm font-semibold text-white/70 mb-4">Drop-off analyse</h3>
        <div className="space-y-3">
          {mockJourneyStats.dropOffReasons.map((r) => (
            <div key={r.reason} className="flex items-center gap-4">
              <span className="text-xs text-white/60 w-32">{r.reason}</span>
              <div className="flex-1 h-3 rounded-full" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <div className="h-3 rounded-full" style={{ width: `${r.pct * 100}%`, background: 'linear-gradient(90deg, rgba(255,77,77,0.4), rgba(255,77,77,0.1))' }} />
              </div>
              <span className="text-xs font-semibold text-white/70 w-16 text-right">{r.count} ({Math.round(r.pct * 100)}%)</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

function MiniCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="text-xs text-white/40">{label}</div>
      <div className="text-2xl font-bold mt-1" style={{ color }}>{value}</div>
    </div>
  );
}