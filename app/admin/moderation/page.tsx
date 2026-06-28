'use client';

import { useState } from 'react';
import GlassCard from '@/components/ui/cards/GlassCard';

const mockReports = [
  { id: 'r1', reportedBy: 'ola@tosom.no', against: 'erik@tosom.no', reason: 'Upassande innhald', status: 'pending', date: '2026-06-24', severity: 'high' },
  { id: 'r2', reportedBy: 'kari@tosom.no', against: 'mari@tosom.no', reason: 'Spam', status: 'pending', date: '2026-06-23', severity: 'medium' },
  { id: 'r3', reportedBy: 'super1@tosom.test', against: 'jan@tosom.no', reason: 'Vederkvam', status: 'reviewing', date: '2026-06-22', severity: 'low' },
  { id: 'r4', reportedBy: 'anna@tosom.no', against: 'erik@tosom.no', reason: 'Truslar', status: 'resolved', date: '2026-06-20', severity: 'critical' },
];

const flaggedUsers = [
  { id: 'u4', email: 'erik@tosom.no', flags: 3, reason: 'Flere rapporter fra samtaler' },
  { id: 'u6', email: 'test@tosom.no', flags: 1, reason: 'Mistenkt spam' },
];

export default function AdminModerationPage() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'reviewing' | 'resolved'>('all');

  const filtered = filter === 'all' ? mockReports : mockReports.filter((r) => r.status === filter);

  return (
    <div className="flex flex-col gap-6 p-8 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white/90">Moderation</h1>
          <p className="text-sm text-white/40 mt-1">Rapporter og flagga brukarar</p>
        </div>
        <div className="flex gap-2">
          {(['all', 'pending', 'reviewing', 'resolved'] as const).map((f) => (
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
              {f === 'all' ? 'Alle' : f === 'pending' ? 'Ventande' : f === 'reviewing' ? 'Gjennomgår' : 'Løyste'}
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MiniCard label="Ventande raportar" value={String(mockReports.filter((r) => r.status === 'pending').length)} color="#FFD437" />
        <MiniCard label="Gjennomgår" value={String(mockReports.filter((r) => r.status === 'reviewing').length)} color="#60A5FA" />
        <MiniCard label="Løyste" value={String(mockReports.filter((r) => r.status === 'resolved').length)} color="#4DFF88" />
        <MiniCard label="Flagga brukarar" value={String(flaggedUsers.length)} color="#FF6B6B" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Reports table */}
        <GlassCard className="p-5">
          <h3 className="text-sm font-semibold text-white/70 mb-4">Rapporter</h3>
          <div className="space-y-3">
            {filtered.map((r) => {
              const severityColors: Record<string, string> = { low: '#60A5FA', medium: '#FFD437', high: '#FF8C4D', critical: '#FF4D4D' };
              return (
                <div key={r.id} className="p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${severityColors[r.severity] || 'rgba(255,255,255,0.06)'}` }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-white/70">#{r.id}</span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${
                      r.status === 'pending' ? 'bg-[rgba(255,212,55,0.1)] text-[#FFD437]' :
                      r.status === 'reviewing' ? 'bg-[rgba(96,165,250,0.1)] text-[#60A5FA]' :
                      'bg-[rgba(77,255,136,0.1)] text-[#4DFF88]'
                    }`}>{r.status}</span>
                  </div>
                  <div className="text-xs text-white/50 mb-2">
                    {r.reportedBy} → {r.against}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: severityColors[r.severity] }}>⚠ {r.reason}</span>
                    <div className="flex gap-1">
                      <button className="px-2 py-1 rounded text-[10px]" style={{ background: 'rgba(212,175,55,0.08)', color: 'rgba(212,175,55,0.7)' }}>Sjå</button>
                      <button className="px-2 py-1 rounded text-[10px]" style={{ background: 'rgba(255,77,77,0.08)', color: 'rgba(255,77,77,0.7)' }}>Blokker</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>

        {/* Flagged users */}
        <GlassCard className="p-5">
          <h3 className="text-sm font-semibold text-white/70 mb-4">Flagga brukarar</h3>
          <div className="space-y-3">
            {flaggedUsers.map((u) => (
              <div key={u.id} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'rgba(255,212,55,0.04)', border: '1px solid rgba(255,212,55,0.12)' }}>
                <div className="flex-1">
                  <div className="text-sm text-white/80">{u.email}</div>
                  <div className="text-xs text-white/40">{u.reason}</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold" style={{ color: '#FFD437' }}>{u.flags}</div>
                  <div className="text-[10px] text-white/35">flagg</div>
                </div>
                <div className="flex gap-1">
                  <button className="px-2 py-1 rounded text-[10px]" style={{ background: 'rgba(212,175,55,0.08)', color: 'rgba(212,175,55,0.7)' }}>Sjå</button>
                  <button className="px-2 py-1 rounded text-[10px]" style={{ background: 'rgba(255,77,77,0.08)', color: 'rgba(255,77,77,0.7)' }}>Blokker</button>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
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