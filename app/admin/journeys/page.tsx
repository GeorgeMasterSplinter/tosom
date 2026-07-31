'use client';

/**
 * ToSom — Admin Reiser 🕓
 * 
 * Oversikt over pågående og fullførte ToSom-reiser.
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

/* ─── JourneyProgress — dag X/30 med progress-bar 📊 */

function JourneyProgress({ day, total }: { day: number; total: number }) {
  const pct = Math.round((day / total) * 100);
  const color = day <= 10 ? '#4ADE80' : day <= 20 ? '#D4AF37' : '#FBBF24';

  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="text-xs font-medium whitespace-nowrap" style={{ color: 'rgba(255,255,255,0.6)' }}>
        Dag {day}/{total}
      </span>
    </div>
  );
}

/* ─── JourneyRow — éin rad i tabellen 📋 */

function JourneyRow({ journey }: { journey: typeof mockJourneys[number] }) {
  const statusColors: Record<string, string> = {
    'På reise': '#4ADE80',
    'Ferdig': '#D4AF37',
    'Avslutta': '#FF4D4D',
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
              {journey.userA.split(' ').map(n => n[0]).join('')}
            </div>
            <span className="text-sm font-medium hidden sm:inline" style={{ color: 'rgba(255,255,255,0.7)' }}>
              {journey.userA}
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
              {journey.userB.split(' ').map(n => n[0]).join('')}
            </div>
            <span className="text-sm font-medium hidden sm:inline" style={{ color: 'rgba(255,255,255,0.7)' }}>
              {journey.userB}
            </span>
          </div>
        </div>
      </td>

      {/* Dag X/30 */}
      <td className="py-3 px-4">
        <JourneyProgress day={journey.day} total={journey.total} />
      </td>

      {/* Profil-lås */}
      <td className="py-3 px-4 text-center">
        {journey.profileLocked ? (
          <span className="text-sm" title="Profil låst">🔒</span>
        ) : (
          <span className="text-sm" title="Profil opplåst">🔓</span>
        )}
      </td>

      {/* Bilde-lås */}
      <td className="py-3 px-4 text-center">
        {journey.imageLocked ? (
          <span className="text-sm" title="Bilder låst (< dag 14)">🔒</span>
        ) : (
          <span className="text-sm" title="Bilder opplåst (≥ dag 14)">🔓</span>
        )}
      </td>

      {/* Status */}
      <td className="py-3 px-4">
        <StatusBadge status={journey.status} color={statusColors[journey.status] || '#D4AF37'} />
      </td>

      {/* Starta */}
      <td className="py-3 px-4">
        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
          {journey.startDate}
        </span>
      </td>

      {/* Handling */}
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
            href={`/admin/chat`}
            className="px-2.5 py-1 rounded-md text-[10px] font-medium transition-all duration-200"
            style={{
              background: 'rgba(139,92,246,0.08)',
              color: '#8B5CF6',
              border: '1px solid rgba(139,92,246,0.2)',
            }}
          >
            Chat
          </Link>
          <Link
            href={`/admin/users`}
            className="px-2.5 py-1 rounded-md text-[10px] font-medium transition-all duration-200"
            style={{
              background: 'rgba(212,175,55,0.08)',
              color: '#D4AF37',
              border: '1px solid rgba(212,175,55,0.2)',
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

const mockJourneys = [
  { id: 1, userA: 'Ane Bjørnstad', userB: 'Magnus Solheim', day: 12, total: 30, profileLocked: true, imageLocked: false, status: 'På reise', startDate: '19. jul' },
  { id: 2, userA: 'Ingrid Moen', userB: 'Henrik Solbakken', day: 3, total: 30, profileLocked: true, imageLocked: true, status: 'På reise', startDate: '28. jul' },
  { id: 3, userA: 'Linn Vestre', userB: 'Thomas Stray', day: 22, total: 30, profileLocked: false, imageLocked: false, status: 'På reise', startDate: '9. jul' },
  { id: 4, userA: 'Olav Berg', userB: 'Stig Nilsen', day: 8, total: 30, profileLocked: true, imageLocked: true, status: 'På reise', startDate: '23. jul' },
  { id: 5, userA: 'Kari Nilsen', userB: 'Finn Hansen', day: 30, total: 30, profileLocked: false, imageLocked: false, status: 'Ferdig', startDate: '1. jul' },
  { id: 6, userA: 'Mona Bergli', userB: 'Erik Dahl', day: 15, total: 30, profileLocked: true, imageLocked: false, status: 'På reise', startDate: '16. jul' },
  { id: 7, userA: 'Sara Hansen', userB: 'Kjetil Asbjørn', day: 1, total: 30, profileLocked: true, imageLocked: true, status: 'På reise', startDate: '30. jul' },
  { id: 8, userA: 'Hanne Solheim', userB: 'Andreas Moen', day: 25, total: 30, profileLocked: false, imageLocked: false, status: 'På reise', startDate: '6. jul' },
  { id: 9, userA: 'Tone Bergli', userB: 'Marius Vestre', day: 30, total: 30, profileLocked: false, imageLocked: false, status: 'Ferdig', startDate: '1. jul' },
  { id: 10, userA: 'Petter Hansen', userB: 'Silje Andersen', day: 6, total: 30, profileLocked: true, imageLocked: true, status: 'Avslutta', startDate: '25. jul' },
  { id: 11, userA: 'Julie Nilsen', userB: 'Magnus Berg', day: 18, total: 30, profileLocked: true, imageLocked: false, status: 'På reise', startDate: '13. jul' },
  { id: 12, userA: 'Camilla Solbakken', userB: 'Øystein Dahl', day: 30, total: 30, profileLocked: false, imageLocked: false, status: 'Ferdig', startDate: '1. jul' },
];

/* ─── Hovudkomponent — Reiser Page 🕓 */

export default function AdminJourneysPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('alle');
  const [phaseFilter, setPhaseFilter] = useState<string>('alle');
  const [page, setPage] = useState(1);
  const limit = 50;

  // Filtrer reiser
  const filtered = mockJourneys.filter((j) => {
    if (search && !j.userA.toLowerCase().includes(search.toLowerCase()) && !j.userB.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (statusFilter !== 'alle' && j.status !== statusFilter) return false;
    if (phaseFilter === 'early' && j.day > 10) return false;
    if (phaseFilter === 'mid' && (j.day < 6 || j.day > 20)) return false;
    if (phaseFilter === 'late' && j.day < 16) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / limit);
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  // Statistikkar
  const totalJourneys = mockJourneys.length;
  const activeJourneys = mockJourneys.filter(j => j.status === 'På reise').length;
  const completedJourneys = mockJourneys.filter(j => j.status === 'Ferdig').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1
          className="text-2xl font-bold mb-1"
          style={{ color: 'rgba(255,255,255,0.95)' }}
        >
          🕓 Reiser
        </h1>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Oversikt over alle ToSom-reiser (30-dagers guiding)
        </p>
      </div>

      {/* Statistikkar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          className="rounded-xl p-4"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="text-2xl font-bold" style={{ color: '#D4AF37' }}>{totalJourneys}</div>
          <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Totale reiser</div>
        </div>
        <div
          className="rounded-xl p-4"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="text-2xl font-bold" style={{ color: '#4ADE80' }}>{activeJourneys}</div>
          <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Pågående reiser</div>
        </div>
        <div
          className="rounded-xl p-4"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="text-2xl font-bold" style={{ color: '#8B5CF6' }}>{completedJourneys}</div>
          <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Fullførte reiser</div>
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
          <option value="På reise" style={{ background: '#0A1A2A' }}>🚀 På reise</option>
          <option value="Ferdig" style={{ background: '#0A1A2A' }}>✅ Ferdig</option>
          <option value="Avslutta" style={{ background: '#0A1A2A' }}>🔴 Avslutta</option>
        </select>

        {/* Fase-filter */}
        <select
          value={phaseFilter}
          onChange={(e) => { setPhaseFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 rounded-lg text-sm outline-none cursor-pointer"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: 'white',
          }}
        >
          <option value="alle" style={{ background: '#0A1A2A' }}>Alle fasar</option>
          <option value="early" style={{ background: '#0A1A2A' }}>🌱 Dag 1–10</option>
          <option value="mid" style={{ background: '#0A1A2A' }}>🌿 Dag 6–20</option>
          <option value="late" style={{ background: '#0A1A2A' }}>🍂 Dag 16–30</option>
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
                <th className="py-3 px-4 text-left text-xs font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>Reise</th>
                <th className="py-3 px-4 text-left text-xs font-medium w-12 text-center" style={{ color: 'rgba(255,255,255,0.35)' }}>Profil</th>
                <th className="py-3 px-4 text-left text-xs font-medium w-12 text-center" style={{ color: 'rgba(255,255,255,0.35)' }}>Bilete</th>
                <th className="py-3 px-4 text-left text-xs font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>Status</th>
                <th className="py-3 px-4 text-left text-xs font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>Starta</th>
                <th className="py-3 px-4 text-left text-xs font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>Handling</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((journey) => (
                <JourneyRow key={journey.id} journey={journey} />
              ))}
            </tbody>
          </table>
        </div>

        {/* Tom tilstand */}
        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Ingen reiser funne med valde filter
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