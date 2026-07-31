'use client';

/**
 * ToSom — Admin Brukarar ✨
 * 
 * Oversikt over alle brukarar med tabell, søk, filtrering, paginering.
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

/* ─── UserRow — éin rad i tabellen 📋 */

function UserRow({ user, index }: { user: typeof mockUsers[number]; index: number }) {
  const statusColors: Record<string, string> = {
    'Venter': '#FBBF24',
    'Matchet': '#8B5CF6',
    'I reise': '#4ADE80',
    'Ferdig': '#D4AF37',
  };

  const journeyColors: Record<string, string> = {
    'Venter': '#FBBF24',
    'Dag 1–5': '#4ADE80',
    'Dag 6–15': '#D4AF37',
    'Dag 16–30': '#FBBF24',
    'Ferdig': '#8B5CF6',
  };

  return (
    <tr
      className="transition-colors duration-150"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
    >
      <td className="py-3 px-4">
        <span className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.3)' }}>
          #{user.id}
        </span>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={{
              background: 'linear-gradient(135deg, rgba(212,175,55,0.2) 0%, rgba(212,175,55,0.05) 100%)',
              color: '#D4AF37',
              border: '1px solid rgba(212,175,55,0.3)',
            }}
          >
            {user.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>
              {user.name}
            </div>
            <div className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
              {user.email}
            </div>
          </div>
        </div>
      </td>
      <td className="py-3 px-4">
        <span className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
          {user.age}
        </span>
      </td>
      <td className="py-3 px-4">
        <StatusBadge status={user.status} color={statusColors[user.status] || '#D4AF37'} />
      </td>
      <td className="py-3 px-4">
        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
          {user.journeyDay}
        </span>
      </td>
      <td className="py-3 px-4">
        <StatusBadge status={user.matchStatus} color={user.matchStatus === 'Matchet' ? '#8B5CF6' : user.matchStatus === 'Venter' ? '#FBBF24' : 'rgba(255,255,255,0.3)'} />
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-1">
          <Link
            href={`/admin/profiles?id=${user.id}`}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
            style={{
              background: 'rgba(212,175,55,0.08)',
              color: '#D4AF37',
              border: '1px solid rgba(212,175,55,0.2)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(212,175,55,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(212,175,55,0.08)';
            }}
          >
            Profil
          </Link>
        </div>
      </td>
    </tr>
  );
}

/* ─── Mock Data (skal koplast til API) — berre for demo/utvikling ✨ */

const mockUsers = [
  { id: 12470, name: 'Ane Bjørnstad', age: 28, status: 'I reise', journeyDay: 'Dag 12/30', matchStatus: 'Matchet', email: 'ane@eksempel.no' },
  { id: 12469, name: 'Magnus Solheim', age: 31, status: 'I reise', journeyDay: 'Dag 12/30', matchStatus: 'Matchet', email: 'mag@eksempel.no' },
  { id: 12468, name: 'Sara Hansen', age: 26, status: 'Venter', journeyDay: '—', matchStatus: 'Ingen match', email: 'sara@eksempel.no' },
  { id: 12467, name: 'Emil Andersen', age: 29, status: 'Venter', journeyDay: '—', matchStatus: 'Venter', email: 'emil@eksempel.no' },
  { id: 12466, name: 'Kari Nilsen', age: 33, status: 'Ferdig', journeyDay: 'Fullført', matchStatus: 'Matchet', email: 'kari@eksempel.no' },
  { id: 12465, name: 'Olav Berg', age: 27, status: 'I reise', journeyDay: 'Dag 3/30', matchStatus: 'Matchet', email: 'olav@eksempel.no' },
  { id: 12464, name: 'Ingrid Moen', age: 30, status: 'I reise', journeyDay: 'Dag 22/30', matchStatus: 'Matchet', email: 'ingrid@eksempel.no' },
  { id: 12463, name: 'Henrik Solbakken', age: 35, status: 'Venter', journeyDay: '—', matchStatus: 'Ingen match', email: 'henrik@eksempel.no' },
  { id: 12462, name: 'Linn Vestre', age: 24, status: 'I reise', journeyDay: 'Dag 8/30', matchStatus: 'Matchet', email: 'linn@eksempel.no' },
  { id: 12461, name: 'Thomas Stray', age: 32, status: 'Ferdig', journeyDay: 'Fullført', matchStatus: 'Matchet', email: 'thomas@eksempel.no' },
  { id: 12460, name: 'Mette Hauge', age: 28, status: 'Venter', journeyDay: '—', matchStatus: 'Ingen match', email: 'mette@eksempel.no' },
  { id: 12459, name: 'Erik Dahl', age: 30, status: 'I reise', journeyDay: 'Dag 15/30', matchStatus: 'Matchet', email: 'erik@eksempel.no' },
];

/* ─── Hovudkomponent — Brukarar Page 👤 */

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('alle');
  const [journeyFilter, setJourneyFilter] = useState<string>('alle');
  const [page, setPage] = useState(1);
  const limit = 50;

  // Filtrer brukarar
  const filtered = mockUsers.filter((u) => {
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (statusFilter !== 'alle' && u.status !== statusFilter) return false;
    if (journeyFilter === 'reise' && !u.journeyDay.startsWith('Dag')) return false;
    if (journeyFilter === 'ferdig' && u.status !== 'Ferdig') return false;
    if (journeyFilter === 'venter' && u.status !== 'Venter') return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / limit);
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1
          className="text-2xl font-bold mb-1"
          style={{ color: 'rgba(255,255,255,0.95)' }}
        >
          👤 Brukarar
        </h1>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Oversikt over alle {mockUsers.length} brukarar på plattforma
        </p>
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
              placeholder="Søk etter namn eller e-post..."
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
          <option value="Venter" style={{ background: '#0A1A2A' }}>🟡 Venter</option>
          <option value="Matchet" style={{ background: '#0A1A2A' }}>💞 Matchet</option>
          <option value="I reise" style={{ background: '#0A1A2A' }}>🚀 I reise</option>
          <option value="Ferdig" style={{ background: '#0A1A2A' }}>✅ Ferdig</option>
        </select>

        {/* Journey-filter */}
        <select
          value={journeyFilter}
          onChange={(e) => { setJourneyFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 rounded-lg text-sm outline-none cursor-pointer"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: 'white',
          }}
        >
          <option value="alle" style={{ background: '#0A1A2A' }}>Alle feriestatusar</option>
          <option value="reise" style={{ background: '#0A1A2A' }}>🚀 På reise</option>
          <option value="venter" style={{ background: '#0A1A2A' }}>⏳ Vent</option>
          <option value="ferdig" style={{ background: '#0A1A2A' }}>✅ Ferdig</option>
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
                <th className="py-3 px-4 text-left text-xs font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>ID</th>
                <th className="py-3 px-4 text-left text-xs font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>Brukar</th>
                <th className="py-3 px-4 text-left text-xs font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>Alder</th>
                <th className="py-3 px-4 text-left text-xs font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>Status</th>
                <th className="py-3 px-4 text-left text-xs font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>Reise</th>
                <th className="py-3 px-4 text-left text-xs font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>Match</th>
                <th className="py-3 px-4 text-left text-xs font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>Handling</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((user, i) => (
                <UserRow key={user.id} user={user} index={i} />
              ))}
            </tbody>
          </table>
        </div>

        {/* Tom tilstand */}
        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Ingen brukarar funne med valde filter
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