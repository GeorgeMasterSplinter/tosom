'use client';

/**
 * ToSom — Admin Analytics 📊
 * 
 * Oversikt over nøkkeltal og trendar for plattforma.
 * Design: ToSom Blue + Nordic Gold + Glassmorphism.
 * Bokmål. Premium. Ro. Moden.
 */

import { useState } from 'react';

/* ─── TimeFilter — tidsfilter-knapp ⏱️ */

function TimeFilter({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const options = [
    { label: '7 dagar', value: '7' },
    { label: '30 dagar', value: '30' },
    { label: '90 dagar', value: '90' },
    { label: 'Alle tider', value: 'all' },
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

/* ─── ChartBar — enkel barchart med CSS 📊 */

function ChartBar({ data, label }: { data: number[]; label: string }) {
  const max = Math.max(...data);
  const displayData = data.slice(-14); // Vis maksimalt 14 punkter

  return (
    <div
      className="rounded-2xl p-4"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="text-xs mb-3 flex items-center justify-between" style={{ color: 'rgba(255,255,255,0.5)' }}>
        <span>{label}</span>
        <span className="font-medium" style={{ color: '#D4AF37' }}>
          {data.reduce((a, b) => a + b, 0).toLocaleString()} totalt
        </span>
      </div>

      {/* Barchart */}
      <div className="flex items-end gap-1 h-24">
        {displayData.map((val, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full rounded-t transition-all duration-500"
              style={{
                height: `${max > 0 ? (val / max) * 100 : 0}%`,
                minHeight: val > 0 ? '4px' : '0',
                background: `linear-gradient(180deg, rgba(212,175,55,0.6) 0%, rgba(212,175,55,0.15) 100%)`,
              }}
            />
          </div>
        ))}
      </div>

      {/* X-akse label */}
      <div className="flex justify-between mt-2">
        <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.2)' }}> tidlegare </span>
        <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.2)' }}> no </span>
      </div>
    </div>
  );
}

/* ─── SummaryStat — nøkkeltall-kort 🎯 */

function SummaryStat({ label, value, unit, color }: { label: string; value: string | number; unit?: string; color?: string }) {
  return (
    <div
      className="rounded-xl p-4 text-center"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${color || 'rgba(255,255,255,0.06)'}`,
      }}
    >
      <div className="text-2xl font-bold mb-1" style={{ color: color || '#D4AF37' }}>
        {typeof value === 'number' ? value.toLocaleString() : value}
        {unit && <span className="text-sm ml-0.5">{unit}</span>}
      </div>
      <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</div>
    </div>
  );
}

/* ─── Mock Data ✨ */

const mockData = {
  dailySignups: [12, 18, 15, 22, 28, 24, 31, 19, 26, 33, 21, 29, 35, 27, 23, 30, 38, 25, 32, 41, 28, 34, 26, 37, 42, 31, 29, 36, 45, 33],
  totalUsers: Array.from({ length: 30 }, (_, i) => 12000 + (i * 87)),
  completedOnboarding: [8, 14, 11, 18, 22, 19, 25, 15, 20, 27, 17, 23, 28, 21, 18, 24, 30, 20, 26, 33, 23, 28, 21, 30, 35, 27, 25, 31, 38, 29],
  dailyMatches: [5, 8, 6, 11, 14, 12, 16, 9, 13, 17, 10, 15, 18, 14, 12, 16, 20, 13, 17, 22, 15, 19, 14, 20, 24, 18, 16, 21, 26, 19],
  dailyJourneys: [3, 5, 4, 7, 9, 8, 11, 6, 8, 10, 7, 9, 12, 9, 8, 10, 13, 9, 11, 14, 10, 13, 9, 13, 15, 11, 10, 14, 17, 12],
  dailyChatMessages: [120, 185, 156, 230, 289, 245, 312, 198, 267, 340, 221, 298, 356, 278, 245, 310, 389, 267, 334, 420, 298, 356, 278, 378, 445, 334, 312, 389, 478, 356],
};

/* ─── Hovudkomponent — Analytics Page 📊 */

export default function AdminAnalyticsPage() {
  const [timeFilter, setTimeFilter] = useState('30');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1
            className="text-2xl font-bold mb-1"
            style={{ color: 'rgba(255,255,255,0.95)' }}
          >
             📊 Statistikk
          </h1>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Nøkkeltal og trendar for ToSom-plattforma
          </p>
        </div>
        <TimeFilter value={timeFilter} onChange={setTimeFilter} />
      </div>

      {/* Grafer — 3 kolonnar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ChartBar data={mockData.dailySignups} label="📈 Daglege registreringar" />
        <ChartBar data={mockData.completedOnboarding} label="✅ Fullførte onboarding" />
        <ChartBar data={mockData.dailyMatches} label="💞 Matcher per dag" />
        <ChartBar data={mockData.dailyJourneys} label="🚀 Reiser starta" />
        <ChartBar data={mockData.dailyChatMessages} label="💬 Chat-aktivitet" />
      </div>

      {/* Samanlåtte nøkkeltal */}
      <div>
        <h3
          className="text-sm font-semibold mb-3 tracking-wide"
          style={{ color: 'rgba(255,255,255,0.6)' }}
        >
          SAMANLÅTTE NØKKELTAL
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <SummaryStat label="Gj.snitt poengsum" value={84} unit="%" color="#D4AF37" />
          <SummaryStat label="Fullføringsrate" value={67} unit="%" color="#4ADE80" />
          <SummaryStat label="Bilete-rate" value={52} unit="%" color="#8B5CF6" />
          <SummaryStat label="Tid til match" value={4.2} unit="t" color="#FBBF24" />
          <SummaryStat label="Aktive brukarar" value={12847} color="#D4AF37" />
          <SummaryStat label="Fullførte reiser" value={342} color="#4ADE80" />
        </div>
              {/* Totale brukarar — stor kort */}
        <div
          className="rounded-2xl p-6 mt-4 flex items-center justify-between"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div>
            <div className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>TOTALE REGISTRERTE BRUKARAR</div>
            <div className="text-4xl font-bold" style={{ color: '#D4AF37' }}>12 847</div>
            <div className="text-sm mt-1" style={{ color: '#4ADE80' }}>+12% denne månaden</div>
          </div>
          {/* Enkel "stige-graf" */}
          <div className="flex items-end gap-1 h-20">
            {[30, 35, 28, 42, 38, 45, 50, 48, 55, 60, 58, 65, 70, 68, 75].map((h, i) => (
              <div
                key={i}
                className="w-3 rounded-t"
                style={{
                  height: `${h}%`,
                  background: `linear-gradient(180deg, rgba(212,175,55,0.7) 0%, rgba(212,175,55,0.2) 100%)`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}