'use client';

/**
 * ToSom — Admin Chat (metadata) 💬
 * 
 * Oversikt over alle samtal — metadata berre.
 * Ingen innsyn i meldingsinnhald eller bilder.
 * Design: ToSom Blue + Nordic Gold + Glassmorphism.
 * Bokmål. Premium. Ro. Moden.
 */

import { useState } from 'react';
import Link from 'next/link';

/* ─── StatusBadge — fargekod status-indikator 🟢🟡🔴 */

function StatusBadge({ status, color }: { status: string; color: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
      style={{
        background: `${color}15`,
        color: color,
        border: `1px solid ${color}30`,
      }}
    >
      <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
      {status}
    </span>
  );
}

/* ─── ChatRow — éin rad i tabellen 📋 */

function ChatRow({ chat }: { chat: typeof mockChats[number] }) {
  const statusColors: Record<string, string> = {
    'Aktiv': '#4ADE80',
    'Frosen': '#FF4D4D',
    'Ferdig': '#8B5CF6',
  };

  return (
    <tr
      className="transition-colors duration-150"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
    >
      {/* Par */}
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
              style={{
                background: 'linear-gradient(135deg, rgba(212,175,55,0.2) 0%, rgba(212,175,55,0.05) 100%)',
                color: '#D4AF37',
                border: '1px solid rgba(212,175,55,0.3)',
              }}
            >
              {chat.userA.split(' ').map(n => n[0]).join('')}
            </div>
            <span className="text-sm font-medium hidden sm:inline" style={{ color: 'rgba(255,255,255,0.7)' }}>
              {chat.userA}
            </span>
          </div>
          <span className="text-xs text-[#D4AF37]" style={{ color: 'rgba(212,175,55,0.5)' }}>↔</span>
          <div className="flex items-center gap-1.5">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
              style={{
                background: 'linear-gradient(135deg, rgba(212,175,55,0.2) 0%, rgba(212,175,55,0.05) 100%)',
                color: '#D4AF37',
                border: '1px solid rgba(212,175,55,0.3)',
              }}
            >
              {chat.userB.split(' ').map(n => n[0]).join('')}
            </div>
            <span className="text-sm font-medium hidden sm:inline" style={{ color: 'rgba(255,255,255,0.7)' }}>
              {chat.userB}
            </span>
          </div>
        </div>
      </td>

      {/* Meldingar */}
      <td className="py-3 px-4">
        <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.6)' }}>
          {chat.messages.toLocaleString()}
        </span>
      </td>

      {/* Bilete */}
      <td className="py-3 px-4 text-center">
        <span className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
          {chat.images}
        </span>
      </td>

      {/* Siste tidspunkt */}
      <td className="py-3 px-4">
        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
          {chat.lastMessage}
        </span>
      </td>

      {/* Flagget */}
      <td className="py-3 px-4 text-center">
        {chat.flagged > 0 ? (
          <span
            className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold"
            style={{ background: 'rgba(255,77,77,0.15)', color: '#FF4D4D' }}
          >
            {chat.flagged}
          </span>
        ) : (
          <span className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>0</span>
        )}
      </td>

      {/* Freeze */}
      <td className="py-3 px-4 text-center">
        {chat.frozen ? (
          <span className="text-sm" title="Samtale frosset">❄️</span>
        ) : (
          <span className="text-sm" title="Samtal aktiv">☐</span>
        )}
      </td>

      {/* Starta */}
      <td className="py-3 px-4">
        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
          {chat.startDate}
        </span>
      </td>

      {/* Handling */}
      <td className="py-3 px-4">
        <div className="flex items-center gap-1.5">
          <button
            className="px-2.5 py-1 rounded-md text-[10px] font-medium transition-all duration-200"
            style={{
              background: chat.frozen ? 'rgba(74,222,128,0.08)' : 'rgba(251,191,36,0.08)',
              color: chat.frozen ? '#4ADE80' : '#FBBF24',
              border: `1px solid ${chat.frozen ? 'rgba(74,222,128,0.2)' : 'rgba(251,191,36,0.2)'}`,
            }}
          >
            {chat.frozen ? 'Tøy fri' : 'Frys'}
          </button>
          <Link
            href={`/admin/users`}
            className="px-2.5 py-1 rounded-md text-[10px] font-medium transition-all duration-200"
            style={{
              background: 'rgba(212,175,55,0.08)',
              color: '#D4AF37',
              border: '1px solid rgba(212,175,55,0.2)',
            }}
          >
            Profilar
          </Link>
        </div>
      </td>
    </tr>
  );
}

/* ─── Mock Data (skal koplast til API) — berre for demo/utvikling ✨ */

const mockChats = [
  { id: 1, userA: 'Ane Bjørnstad', userB: 'Magnus Solheim', messages: 142, images: 3, lastMessage: '19:42 i dag', flagged: 0, frozen: false, startDate: '19. jul' },
  { id: 2, userA: 'Ingrid Moen', userB: 'Henrik Solbakken', messages: 8, images: 0, lastMessage: '14:20 i dag', flagged: 0, frozen: false, startDate: '28. jul' },
  { id: 3, userA: 'Linn Vestre', userB: 'Thomas Stray', messages: 256, images: 7, lastMessage: '16:05 i dag', flagged: 0, frozen: false, startDate: '9. jul' },
  { id: 4, userA: 'Sara Hansen', userB: 'Emil Andersen', messages: 3, images: 0, lastMessage: '15:10 i dag', flagged: 1, frozen: true, startDate: '30. jul' },
  { id: 5, userA: 'Olav Berg', userB: 'Stig Nilsen', messages: 67, images: 2, lastMessage: '11:30 i dag', flagged: 0, frozen: false, startDate: '23. jul' },
  { id: 6, userA: 'Mona Bergli', userB: 'Erik Dahl', messages: 189, images: 5, lastMessage: '09:15 i dag', flagged: 0, frozen: false, startDate: '16. jul' },
  { id: 7, userA: 'Kari Nilsen', userB: 'Finn Hansen', messages: 312, images: 8, lastMessage: 'I går', flagged: 0, frozen: false, startDate: '1. jul' },
  { id: 8, userA: 'Hanne Solheim', userB: 'Andreas Moen', messages: 95, images: 1, lastMessage: 'I går', flagged: 2, frozen: true, startDate: '6. jul' },
  { id: 9, userA: 'Petter Hansen', userB: 'Silje Andersen', messages: 4, images: 0, lastMessage: '30. jul', flagged: 1, frozen: false, startDate: '25. jul' },
  { id: 10, userA: 'Julie Nilsen', userB: 'Magnus Berg', messages: 178, images: 4, lastMessage: 'I dag', flagged: 0, frozen: false, startDate: '13. jul' },
];

/* ─── Hovudkomponent — Chat Page 💬 */

export default function AdminChatPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('alle');
  const [flaggedFilter, setFlaggedFilter] = useState<string>('alle');
  const [page, setPage] = useState(1);
  const limit = 50;

  // Filtrer samtal
  const filtered = mockChats.filter((c) => {
    if (search && !c.userA.toLowerCase().includes(search.toLowerCase()) && !c.userB.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (statusFilter === 'aktiv' && c.frozen) return false;
    if (statusFilter === 'frozen' && !c.frozen) return false;
    if (flaggedFilter === 'yes' && c.flagged === 0) return false;
    if (flaggedFilter === 'no' && c.flagged > 0) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / limit);
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  // Statistikkar
  const totalChats = mockChats.length;
  const activeChats = mockChats.filter(c => !c.frozen).length;
  const flaggedChats = mockChats.filter(c => c.flagged > 0).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1
          className="text-2xl font-bold mb-1"
          style={{ color: 'rgba(255,255,255,0.95)' }}
        >
          💬 Chat (metadata)
        </h1>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Oversikt over alle samtal — metadata berre. Ingen innsyn i innhald eller bilder.
        </p>
      </div>

      {/* Tryggleik-banner */}
      <div
        className="rounded-xl px-4 py-3 flex items-center gap-3"
        style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)' }}
      >
        <span className="text-sm">🛡️</span>
        <p className="text-xs flex-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
          Admin ser berre metadata — aldri meldingar eller bilder. Privatlivet til brukarane er trygt.
        </p>
      </div>

      {/* Statistikkar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          className="rounded-xl p-4"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="text-2xl font-bold" style={{ color: '#D4AF37' }}>{totalChats}</div>
          <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Totale samtal</div>
        </div>
        <div
          className="rounded-xl p-4"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="text-2xl font-bold" style={{ color: '#4ADE80' }}>{activeChats}</div>
          <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Aktive samtal</div>
        </div>
        <div
          className="rounded-xl p-4"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="text-2xl font-bold" style={{ color: '#FF4D4D' }}>{flaggedChats}</div>
          <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Flagga samtal</div>
        </div>
      </div>

      {/* Søk + Filtrering */}
      <div
        className="rounded-2xl p-4 flex flex-wrap items-center gap-3"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Søk */}
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Søk etter par..."
              className="w-full pl-9 pr-4 py-2 rounded-lg text-sm outline-none transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'white',
              }}
            />
          </div>
        </div>

        {/* Status-filter */}
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 rounded-lg text-sm outline-none cursor-pointer"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: 'white',
          }}
        >
          <option value="alle" style={{ background: '#0A1A2A' }}>Alle statusar</option>
          <option value="aktiv" style={{ background: '#0A1A2A' }}>☐ Aktiv</option>
          <option value="frozen" style={{ background: '#0A1A2A' }}>❄️ Frosen</option>
        </select>

        {/* Flagget-filter */}
        <select
          value={flaggedFilter}
          onChange={(e) => { setFlaggedFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 rounded-lg text-sm outline-none cursor-pointer"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: 'white',
          }}
        >
          <option value="alle" style={{ background: '#0A1A2A' }}>Alle flagga</option>
          <option value="yes" style={{ background: '#0A1A2A' }}>🚩 Flagget</option>
          <option value="no" style={{ background: '#0A1A2A' }}>✅ Ikkje flagget</option>
        </select>

        {/* Resultat-telj */}
        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
          {filtered.length} resultat
        </span>
      </div>

      {/* Tabell */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                <th className="py-3 px-4 text-left text-xs font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>Par</th>
                <th className="py-3 px-4 text-left text-xs font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>Meldingar</th>
                <th className="py-3 px-4 text-left text-xs font-medium w-12 text-center" style={{ color: 'rgba(255,255,255,0.35)' }}>Bilete</th>
                <th className="py-3 px-4 text-left text-xs font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>Siste tid</th>
                <th className="py-3 px-4 text-left text-xs font-medium w-12 text-center" style={{ color: 'rgba(255,255,255,0.35)' }}>🚩</th>
                <th className="py-3 px-4 text-left text-xs font-medium w-12 text-center" style={{ color: 'rgba(255,255,255,0.35)' }}>❄️</th>
                <th className="py-3 px-4 text-left text-xs font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>Starta</th>
                <th className="py-3 px-4 text-left text-xs font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>Handling</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((chat) => (
                <ChatRow key={chat.id} chat={chat} />
              ))}
            </tbody>
          </table>
        </div>

        {/* Tom tilstand */}
        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Ingen samtal funne med valde filter
            </p>
          </div>
        )}
      </div>

      {/* Paginering */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Side {page} av {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
              style={{
                background: page === 1 ? 'rgba(255,255,255,0.02)' : 'rgba(212,175,55,0.08)',
                color: page === 1 ? 'rgba(255,255,255,0.2)' : '#D4AF37',
                border: '1px solid rgba(255,255,255,0.06)',
                cursor: page === 1 ? 'not-allowed' : 'pointer',
              }}
            >
              ← Forrige
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
              style={{
                background: page === totalPages ? 'rgba(255,255,255,0.02)' : 'rgba(212,175,55,0.08)',
                color: page === totalPages ? 'rgba(255,255,255,0.2)' : '#D4AF37',
                border: '1px solid rgba(255,255,255,0.06)',
                cursor: page === totalPages ? 'not-allowed' : 'pointer',
              }}
            >
              Neste →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}