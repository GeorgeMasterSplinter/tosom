'use client';

/**
 * ToSom — Admin Matcher 💞
 * 
 * Oversikt over alle matcher med score, avstand, status.
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

/* ─── MatchRow — éin rad i tabellen 📋 */

function MatchRow({ match }: { match: typeof mockMatches[number] }) {
  const statusColors: Record<string, string> = {
    'Ventar': '#FBBF24',
    'Aktiv': '#4ADE80',
    'Avvist': '#FF4D4D',
    'Matur': '#8B5CF6',
  };

  return (
    <tr
      className="transition-colors duration-150"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
    >
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          {/* Bruker A */}
          <div className="flex items-center gap-1.5">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
              style={{
                background: 'linear-gradient(135deg, rgba(212,175,55,0.2) 0%, rgba(212,175,55,0.05) 100%)',
                color: '#D4AF37',
                border: '1px solid rgba(212,175,55,0.3)',
              }}
            >
              {match.userA.split(' ').map(n => n[0]).join('')}
            </div>
            <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
              {match.userA}
            </span>
          </div>
          <span className="text-xs" style={{ color: 'rgba(212,175,55,0.5)' }}>↔</span>
          {/* Bruker B */}
          <div className="flex items-center gap-1.5">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
              style={{
                background: 'linear-gradient(135deg, rgba(212,175,55,0.2) 0%, rgba(212,175,55,0.05) 100%)',
                color: '#D4AF37',
                border: '1px solid rgba(212,175,55,0.3)',
              }}
            >
              {match.userB.split(' ').map(n => n[0]).join('')}
            </div>
            <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
              {match.userB}
            </span>
          </div>
        </div>
      </td>
      <td className="py-3 px-4">
        {/* Match Score */}
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${match.score}%`,
                background: match.score >= 90 ? '#4ADE80' : match.score >= 75 ? '#D4AF37' : '#FBBF24',
              }}
            />
          </div>
          <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.6)' }}>
            {match.score}%
          </span>
        </div>
      </td>
      <td className="py-3 px-4">
        <span className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
          {match.distance}
        </span>
      </td>
      <td className="py-3 px-4">
        <StatusBadge status={match.status} color={statusColors[match.status] || '#D4AF37'} />
      </td>
      <td className="py-3 px-4">
        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
          {match.journeyDay}
        </span>
      </td>
      <td className="py-3 px-4">
        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
          {match.date}
        </span>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-1.5">
          <button
            className="px-2.5 py-1 rounded-md text-[10px] font-medium transition-all duration-200"
            style={{
              background: 'rgba(251,191,36,0.08)',
              color: '#FBBF24',
              border: '1px solid rgba(251,191,36,0.2)',
            }}
          >
            Reset
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
            Logg
          </Link>
        </div>
      </td>
    </tr>
  );
}

/* ─── Mock Data (skal koplast til API) — berre for demo/utvikling ✨ */

const mockMatches = [
  { id: 1, userA: 'Ane Bjørnstad', userB: 'Magnus Solheim', score: 92, distance: '12 km', status: 'Aktiv', journeyDay: 'Dag 12/30', date: '28. jul' },
  { id: 2, userA: 'Sara Hansen', userB: 'Emil Andersen', score: 88, distance: '45 km', status: 'Ventar', journeyDay: '—', date: '30. jul' },
  { id: 3, userA: 'Kari Nilsen', userB: 'Olav Berg', score: 85, distance: '8 km', status: 'Matur', journeyDay: 'Fullført', date: '15. jul' },
  { id: 4, userA: 'Ingrid Moen', userB: 'Henrik Solbakken', score: 79, distance: '120 km', status: 'Aktiv', journeyDay: 'Dag 3/30', date: '25. jul' },
  { id: 5, userA: 'Linn Vestre', userB: 'Thomas Stray', score: 94, distance: '3 km', status: 'Aktiv', journeyDay: 'Dag 22/30', date: '1. jul' },
  { id: 6, userA: 'Mette Hauge', userB: 'Erik Dahl', score: 71, distance: '67 km', status: 'Avvist', journeyDay: '—', date: '20. jul' },
  { id: 7, userA: 'Ane Bjørnstad', userB: 'Finn Hansen', score: 65, distance: '200 km', status: 'Avvist', journeyDay: '—', date: '18. jul' },
  { id: 8, userA: 'Sara Hansen', userB: 'Kjetil Asbjørn', score: 82, distance: '34 km', status: 'Ventar', journeyDay: '—', date: '31. jul' },
  { id: 9, userA: 'Olav Berg', userB: 'Mona Bergli', score: 76, distance: '56 km', status: 'Ventar', journeyDay: '—', date: '29. jul' },
  { id: 10, userA: 'Ingrid Moen', userB: 'Stig Nilsen', score: 89, distance: '15 km', status: 'Aktiv', journeyDay: 'Dag 8/30', date: '24. jul' },
];

/* ─── Hovudkomponent — Matcher Page 💞 */

export default function AdminMatchesPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('alle');
  const [scoreFilter, setScoreFilter] = useState<string>('alle');
  const [page, setPage] = useState(1);
  const limit = 50;

  // Filtrer matcher
  const filtered = mockMatches.filter((m) => {
    if (search && !m.userA.toLowerCase().includes(search.toLowerCase()) && !m.userB.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (statusFilter !== 'alle' && m.status !== statusFilter) return false;
    if (scoreFilter === 'high' && m.score < 85) return false;
    if (scoreFilter === 'mid' && (m.score < 70 || m.score >= 85)) return false;
    if (scoreFilter === 'low' && m.score >= 70) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / limit);
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  // Statistikkar
  const totalMatches = mockMatches.length;
  const activeMatches = mockMatches.filter(m => m.status === 'Aktiv').length;
  const avgScore = Math.round(mockMatches.reduce((s, m) => s + m.score, 0) / mockMatches.length);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1
          className="text-2xl font-bold mb-1"
          style={{ color: 'rgba(255,255,255,0.95)' }}
        >
          💞 Matcher
        </h1>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Oversikt over alle resonans-matcher på plattforma
        </p>
      </div>

      {/* Statistikkar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          className="rounded-xl p-4"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="text-2xl font-bold" style={{ color: '#D4AF37' }}>{totalMatches}</div>
          <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Totale matcher</div>
        </div>
        <div
          className="rounded-xl p-4"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="text-2xl font-bold" style={{ color: '#4ADE80' }}>{activeMatches}</div>
          <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Aktive matcher</div>
        </div>
        <div
          className="rounded-xl p-4"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="text-2xl font-bold" style={{ color: '#8B5CF6' }}>{avgScore}%</div>
          <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Gj.snitt score</div>
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
              placeholder="Søk etter brukar..."
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
          <option value="Aktiv" style={{ background: '#0A1A2A' }}>🟢 Aktiv</option>
          <option value="Ventar" style={{ background: '#0A1A2A' }}>🟡 Ventar</option>
          <option value="Avvist" style={{ background: '#0A1A2A' }}>🔴 Avvist</option>
          <option value="Matur" style={{ background: '#0A1A2A' }}>💜 Fullført</option>
        </select>

        {/* Score-filter */}
        <select
          value={scoreFilter}
          onChange={(e) => { setScoreFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 rounded-lg text-sm outline-none cursor-pointer"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: 'white',
          }}
        >
          <option value="alle" style={{ background: '#0A1A2A' }}>Alle score</option>
          <option value="high" style={{ background: '#0A1A2A' }}>⭐ 85%+</option>
          <option value="mid" style={{ background: '#0A1A2A' }}>🟡 70–84%</option>
          <option value="low" style={{ background: '#0A1A2A' }}>&lt;70%</option>
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
                <th className="py-3 px-4 text-left text-xs font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>Score</th>
                <th className="py-3 px-4 text-left text-xs font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>Avstand</th>
                <th className="py-3 px-4 text-left text-xs font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>Status</th>
                <th className="py-3 px-4 text-left text-xs font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>Reise</th>
                <th className="py-3 px-4 text-left text-xs font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>Dato</th>
                <th className="py-3 px-4 text-left text-xs font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>Handling</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((match) => (
                <MatchRow key={match.id} match={match} />
              ))}
            </tbody>
          </table>
        </div>

        {/* Tom tilstand */}
        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Ingen matcher funne med valde filter
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