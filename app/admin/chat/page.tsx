'use client';

import { useState } from 'react';
import GlassCard from '@/components/ui/cards/GlassCard';

const mockChatStats = {
  totalMessages24h: 1456,
  totalMessages7d: 8934,
  activeConversations: 67,
  avgMessagesPerMatch: 21.7,
  topMatches: [
    { matchId: 'm1', user1: 'ola@tosom.no', user2: 'kari@tosom.no', messages: 89, day: 12, lastActive: '2 timer sidan' },
    { matchId: 'm2', user1: 'erik@tosom.no', user2: 'anna@tosom.no', messages: 45, day: 5, lastActive: '30 min sidan' },
    { matchId: 'm3', user1: 'super1@tosom.test', user2: 'super2@tosom.test', messages: 34, day: 3, lastActive: '1 time sidan' },
    { matchId: 'm4', user1: 'mari@tosom.no', user2: 'jan@tosom.no', messages: 28, day: 20, lastActive: '5 timer sidan' },
  ],
  spamDetected: 3,
  blockedUsers: 2,
};

export default function AdminChatPage() {
  const [period, setPeriod] = useState<'24h' | '7d' | '30d'>('24h');

  return (
    <div className="flex flex-col gap-6 p-8 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white/90">Chat oversikt</h1>
          <p className="text-sm text-white/40 mt-1">Meldingsvolum og aktivitet per match</p>
        </div>
        <div className="flex gap-2">
          {(['24h', '7d', '30d'] as const).map((p) => (
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
        <MiniCard label="Meldingar (period)" value={period === '24h' ? mockChatStats.totalMessages24h.toLocaleString() : (mockChatStats.totalMessages7d).toLocaleString()} color="#D4AF37" />
        <MiniCard label="Aktive samtalar" value={mockChatStats.activeConversations.toString()} color="#4DFF88" />
        <MiniCard label="Snitt/_match" value={mockChatStats.avgMessagesPerMatch.toString()} color="#60A5FA" />
        <MiniCard label="Spam oppdaga" value={mockChatStats.spamDetected.toString()} color="#FF6B6B" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top matches by messages */}
        <GlassCard className="p-5">
          <h3 className="text-sm font-semibold text-white/70 mb-4">Top matcher etter meldingar</h3>
          <div className="space-y-3">
            {mockChatStats.topMatches.map((m) => (
              <div key={m.matchId} className="flex items-center gap-3 p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-white/70 truncate">{m.user1} ↔ {m.user2}</div>
                  <div className="text-[10px] text-white/35">Dag {m.day} · {m.lastActive}</div>
                </div>
                <div className="text-sm font-bold" style={{ color: '#D4AF37' }}>{m.messages}</div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Spam & blocked */}
        <GlassCard className="p-5">
          <h3 className="text-sm font-semibold text-white/70 mb-4">Spam & blocked</h3>
          <div className="space-y-4">
            <div className="p-3 rounded-lg" style={{ background: 'rgba(255,107,107,0.06)', border: '1px solid rgba(255,107,107,0.15)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-white/70 font-medium">Spam oppdaga</div>
                  <div className="text-lg font-bold" style={{ color: '#FF6B6B' }}>{mockChatStats.spamDetected}</div>
                </div>
                <button className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'rgba(255,107,107,0.15)', color: '#FF6B6B' }}>Sjå detaljar</button>
              </div>
            </div>
            <div className="p-3 rounded-lg" style={{ background: 'rgba(255,212,55,0.06)', border: '1px solid rgba(255,212,55,0.15)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-white/70 font-medium">Blocked brukarar</div>
                  <div className="text-lg font-bold" style={{ color: '#FFD437' }}>{mockChatStats.blockedUsers}</div>
                </div>
                <button className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'rgba(255,212,55,0.15)', color: '#FFD437' }}>Sjå detaljar</button>
              </div>
            </div>
            <div className="p-3 rounded-lg" style={{ background: 'rgba(77,255,136,0.06)', border: '1px solid rgba(77,255,136,0.15)' }}>
              <div>
                <div className="text-xs text-white/70 font-medium">Auto-moderasjon</div>
                <div className="text-sm text-white/50 mt-1">AI-filter blokkerer automatisk spam og upassande innhald</div>
              </div>
            </div>
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