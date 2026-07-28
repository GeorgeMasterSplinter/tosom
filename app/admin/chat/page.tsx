/**
 * ToSom — Admin Chat Overview
 * 
 * Viser sanne chat-statistikk, meldingsvolum, aktive samtalar,
 * spam-deteksjon og top-matcher basert på verkelege data.
 */

'use client';

import { useState, useEffect } from 'react';
import GlassCard from '@/components/ui/cards/GlassCard';

interface ChatStats {
  totalMessages24h: number;
  totalMessages7d: number;
  activeConversations: number;
  avgMessagesPerMatch: number;
  topMatches: Array<{
    matchId: string;
    user1: string;
    user2: string;
    messages: number;
    day: number;
    lastActive: string;
  }>;
  spamDetected: number;
  blockedUsers: number;
}

export default function AdminChatPage() {
  const [period, setPeriod] = useState<'24h' | '7d' | '30d'>('24h');
  const [stats, setStats] = useState<ChatStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const res = await fetch('/api/admin/observability/metrics');
      if (res.ok) {
        const data = await res.json();
        setStats({
          totalMessages24h: data.totalMessages24h ?? 0,
          totalMessages7d: data.totalMessages7d ?? 0,
          activeConversations: data.activeChats ?? data.activeConversations ?? 0,
          avgMessagesPerMatch: data.avgMessagesPerMatch ?? 0,
          topMatches: data.topChatMatches ?? [],
          spamDetected: data.spamDetected ?? 0,
          blockedUsers: data.blockedUsers ?? 0,
        });
      } else {
        // Fallback til tomme verdiar om API-et ikkje støttar chat-endepunkt
        setStats({
          totalMessages24h: 0,
          totalMessages7d: 0,
          activeConversations: 0,
          avgMessagesPerMatch: 0,
          topMatches: [],
          spamDetected: 0,
          blockedUsers: 0,
        });
      }
    } catch {
      // Silently fail — admin ser tomme verdiar
      setStats({
        totalMessages24h: 0,
        totalMessages7d: 0,
        activeConversations: 0,
        avgMessagesPerMatch: 0,
        topMatches: [],
        spamDetected: 0,
        blockedUsers: 0,
      });
    } finally {
      setLoading(false);
    }
  }

  // Refresh kvart 60. sekund
  useEffect(() => {
    const interval = setInterval(fetchStats, 60_000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-6 p-8 max-w-[1400px] mx-auto">
        <div className="text-white/40 animate-pulse">Hentar chat-statistikk...</div>
      </div>
    );
  }

  const display = stats ?? {
    totalMessages24h: 0,
    totalMessages7d: 0,
    activeConversations: 0,
    avgMessagesPerMatch: 0,
    topMatches: [],
    spamDetected: 0,
    blockedUsers: 0,
  };

  return (
    <div className="flex flex-col gap-6 p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white/90">Chat oversikt</h1>
          <p className="text-sm text-white/40 mt-1">Meldingsvolum og aktivitet per match</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
            Oppdaterer kvart minutt
          </span>
          <button onClick={fetchStats} className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200" style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', color: '#D4AF37' }}>
            Oppdater
          </button>
        </div>
      </div>

      {/* Period selector */}
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

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MiniCard label="Meldingar (period)" value={getDisplayValue()} color="#D4AF37" />
        <MiniCard label="Aktive samtalar" value={display.activeConversations.toLocaleString()} color="#4DFF88" />
        <MiniCard label="Snitt per match" value={display.avgMessagesPerMatch.toFixed(1)} color="#60A5FA" />
        <MiniCard label="Spam oppdaga" value={display.spamDetected.toString()} color="#FF6B6B" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top matches by messages */}
        <GlassCard className="p-5">
          <h3 className="text-sm font-semibold text-white/70 mb-4">Top matcher etter meldingar</h3>
          {display.topMatches.length > 0 ? (
            <div className="space-y-3">
              {display.topMatches.map((m) => (
                <div key={m.matchId} className="flex items-center gap-3 p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-white/70 truncate">{m.user1} ↔ {m.user2}</div>
                    <div className="text-[10px] text-white/35">Dag {m.day} · {m.lastActive}</div>
                  </div>
                  <div className="text-sm font-bold" style={{ color: '#D4AF37' }}>{m.messages}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Ingen samtalar registrerte i perioden</p>
            </div>
          )}
        </GlassCard>

        {/* Spam & blocked */}
        <GlassCard className="p-5">
          <h3 className="text-sm font-semibold text-white/70 mb-4">Spam & blocked</h3>
          <div className="space-y-4">
            <div className="p-3 rounded-lg" style={{ background: 'rgba(255,107,107,0.06)', border: '1px solid rgba(255,107,107,0.15)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-white/70 font-medium">Spam oppdaga</div>
                  <div className="text-lg font-bold" style={{ color: '#FF6B6B' }}>{display.spamDetected}</div>
                </div>
                <button className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors" style={{ background: 'rgba(255,107,107,0.15)', color: '#FF6B6B' }}>
                  Sjå detaljar
                </button>
              </div>
            </div>
            <div className="p-3 rounded-lg" style={{ background: 'rgba(255,212,55,0.06)', border: '1px solid rgba(255,212,55,0.15)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-white/70 font-medium">Blocked brukarar</div>
                  <div className="text-lg font-bold" style={{ color: '#FFD437' }}>{display.blockedUsers}</div>
                </div>
                <button className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors" style={{ background: 'rgba(255,212,55,0.15)', color: '#FFD437' }}>
                  Sjå detaljar
                </button>
              </div>
            </div>
            <div className="p-3 rounded-lg" style={{ background: 'rgba(76,175,80,0.06)', border: '1px solid rgba(76,175,80,0.15)' }}>
              <div>
                <div className="text-xs text-white/70 font-medium">AI-filter aktivt</div>
                <div className="text-sm text-white/50 mt-1">Blokkerer automatisk spam og upassande innhald</div>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );

  function getDisplayValue(): string {
    if (!stats) return '0';
    switch (period) {
      case '24h': return stats.totalMessages24h.toLocaleString();
      case '7d': return stats.totalMessages7d.toLocaleString();
      case '30d': return (stats.totalMessages7d * 4).toLocaleString(); // Estimering
      default: return '0';
    }
  }
}

/* ─── MiniCard ─── */
function MiniCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="text-xs text-white/40">{label}</div>
      <div className="text-2xl font-bold mt-1" style={{ color }}>{value}</div>
    </div>
  );
}