'use client';

import { useState } from 'react';
import GlassCard from '@/components/ui/GlassCard';

const mockMatches = [
  { id: 'm1', user1: 'ola@tosom.no', user2: 'kari@tosom.no', score: 0.92, status: 'active', day: 12, explanation: 'Høg resonans på verdier og livssituasjon' },
  { id: 'm2', user1: 'erik@tosom.no', user2: 'anna@tosom.no', score: 0.87, status: 'active', day: 5, explanation: 'Komplementære kommunikasjonsstilar' },
  { id: 'm3', user1: 'mari@tosom.no', user2: 'jan@tosom.no', score: 0.78, status: 'completed', day: 30, explanation: 'Fullført reise — begge ønskjer å fortsetje' },
  { id: 'm4', user1: 'super1@tosom.test', user2: 'super2@tosom.test', score: 0.95, status: 'active', day: 3, explanation: 'Test-match — høg kompatibilitet' },
];

export default function AdminMatchingPage() {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const filtered = filter === 'all' ? mockMatches : mockMatches.filter((m) => m.status === filter);

  return (
    <div className="flex flex-col gap-6 p-8 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white/90">Matching</h1>
          <p className="text-sm text-white/40 mt-1">Aktive og fullførte matcher</p>
        </div>
        <div className="flex gap-2">
          {(['all', 'active', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                filter === f
                  ? 'bg-[rgba(212,175,55,0.15)] text-[#D4AF37]'
                  : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]'
              }`}
              style={filter === f ? { border: '1px solid rgba(212,175,55,0.25)' } : { border: '1px solid rgba(255,255,255,0.06)' }}
            >
              {f === 'all' ? 'Alle' : f === 'active' ? 'Aktive' : 'Fullførte'}
            </button>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MiniCard label="Aktive matcher" value={String(mockMatches.filter((m) => m.status === 'active').length)} color="#4DFF88" />
        <MiniCard label="Fullførte" value={String(mockMatches.filter((m) => m.status === 'completed').length)} color="#60A5FA" />
        <MiniCard label="Snitt score" value="0.88" color="#D4AF37" />
        <MiniCard label="Dag 1-10" value="2" color="#FFD437" />
      </div>

      {/* Matches table */}
      <GlassCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Brukarar', 'Score', 'Status', 'Dag', 'Forklaring', 'Aksjonar'].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs font-semibold text-white/40 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((match) => (
                <tr key={match.id} style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                  <td className="px-4 py-3 text-sm">
                    <div className="text-white/80">{match.user1}</div>
                    <div className="text-white/40 text-xs">↔</div>
                    <div className="text-white/80">{match.user2}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <div className="h-1.5 rounded-full" style={{ width: `${match.score * 100}%`, background: match.score > 0.9 ? '#4DFF88' : '#D4AF37' }} />
                      </div>
                      <span className="text-sm font-semibold" style={{ color: match.score > 0.9 ? '#4DFF88' : '#D4AF37' }}>{Math.round(match.score * 100)}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                      match.status === 'active' ? 'bg-[rgba(77,255,136,0.1)] text-[#4DFF88]' : 'bg-[rgba(96,165,250,0.1)] text-[#60A5FA]'
                    }`}>{match.status}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-white/50">{match.day}/30</td>
                  <td className="px-4 py-3 text-sm text-white/50">{match.explanation}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button className="px-2 py-1 rounded text-xs" style={{ background: 'rgba(212,175,55,0.08)', color: 'rgba(212,175,55,0.7)' }}>Detaljar</button>
                      {match.status === 'active' && (
                        <button className="px-2 py-1 rounded text-xs" style={{ background: 'rgba(255,212,55,0.08)', color: 'rgba(255,212,55,0.7)' }}>Force rematch</button>
                      )}
                      {match.status === 'active' && (
                        <button className="px-2 py-1 rounded text-xs" style={{ background: 'rgba(255,77,77,0.08)', color: 'rgba(255,77,77,0.7)' }}>Avslutt</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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