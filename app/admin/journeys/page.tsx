'use client';

/**
 * ToSom — Admin Reiser 🕓
 *
 * Oversikt over pågående og fullførte ToSom-reiser.
 * Bruker Ekte data fra /api/admin/journeys.
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface JourneyData {
  id: string;
  userId: string;
  userName: string;
  currentDay: number;
  day?: number;
  totalDays: number;
  profileLocked: boolean;
  imageLocked: boolean;
  status: string;
  startDate: string;
  partnerName: string | null;
}

/* ─── StatusBadge */
function StatusBadge({ status, color }: { status: string; color: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium" style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}>
      <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
      {status}
    </span>
  );
}

/* ─── JourneyProgress */
function JourneyProgress({ day, total }: { day: number; total: number }) {
  const pct = Math.round((day / total) * 100);
  const color = day <= 10 ? '#4ADE80' : day <= 20 ? '#D4AF37' : '#FBBF24';
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-xs font-medium whitespace-nowrap" style={{ color: 'rgba(255,255,255,0.6)' }}>Dag {day}/{total}</span>
    </div>
  );
}

/* ─── JourneyRow */
function JourneyRow({ journey }: { journey: JourneyData }) {
  const statusColors: Record<string, string> = { 'På reise': '#4ADE80', 'Ferdig': '#D4AF37', 'Dag 30': '#FBBF24' };
  const initials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <tr className="transition-colors duration-150" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.05))', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.3)' }}>{initials(journey.userName)}</div>
            <span className="text-sm font-medium hidden sm:inline" style={{ color: 'rgba(255,255,255,0.7)' }}>{journey.userName}</span>
          </div>
          {journey.partnerName && (<>
            <span className="text-xs" style={{ color: 'rgba(212,175,55,0.5)' }}>↔</span>
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.05))', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.3)' }}>{initials(journey.partnerName)}</div>
              <span className="text-sm font-medium hidden sm:inline" style={{ color: 'rgba(255,255,255,0.7)' }}>{journey.partnerName}</span>
            </div>
          </>)}
        </div>
      </td>
      <td className="py-3 px-4"><JourneyProgress day={journey.day || journey.currentDay} total={journey.totalDays} /></td>
      <td className="py-3 px-4 text-center">{journey.profileLocked ? '🔒' : '🔓'}</td>
      <td className="py-3 px-4 text-center">{journey.imageLocked ? '🔒' : '🔓'}</td>
      <td className="py-3 px-4"><StatusBadge status={journey.status} color={statusColors[journey.status] || '#D4AF37'} /></td>
      <td className="py-3 px-4"><span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{journey.startDate}</span></td>
      <td className="py-3 px-4">
        <Link href={`/admin/users?id=${journey.userId}`} className="px-2.5 py-1 rounded-md text-[10px] font-medium transition-all duration-200" style={{ background: 'rgba(212,175,55,0.08)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.2)' }}>Profil</Link>
      </td>
    </tr>
  );
}

/* ─── Hovedkomponent */
export default function AdminJourneysPage() {
  const [journeys, setJourneys] = useState<JourneyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('alle');
  const [phaseFilter, setPhaseFilter] = useState('alle');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchJourneys(); }, [statusFilter, phaseFilter, page]);

  const fetchJourneys = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '50', status: statusFilter, phase: phaseFilter });
      if (search) params.set('search', search);
      const res = await fetch(`/api/admin/journeys?${params}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) { setJourneys(json.data); setTotalPages(json.pagination?.totalPages || 1); }
      }
    } catch (err) { console.error('Feil ved lasting av reiser:', err); }
    finally { setLoading(false); }
  };

  const totalJ = journeys.length;
  const activeJ = journeys.filter(j => j.status === 'På reise').length;
  const completedJ = journeys.filter(j => j.status === 'Ferdig').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'rgba(255,255,255,0.95)' }}>🕓 Reiser</h1>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Oversikt over alle ToSom-reiser (30-dagers guiding)</p>
      </div>

      {loading ? (
        <div className="py-12 text-center"><p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Laster reiser...</p></div>
      ) : (<>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[{ n: totalJ, c: '#D4AF37', l: 'Totale reiser' }, { n: activeJ, c: '#4ADE80', l: 'Pågående reiser' }, { n: completedJ, c: '#8B5CF6', l: 'Fullførte reiser' }].map((m, i) => (
            <div key={i} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="text-2xl font-bold" style={{ color: m.c }}>{m.n}</div>
              <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{m.l}</div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl p-4 flex flex-wrap items-center gap-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" /></svg>
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} onBlur={fetchJourneys} placeholder="Søk etter bruker..." className="w-full pl-9 pr-4 py-2 rounded-lg text-sm outline-none transition-all duration-200" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'white' }} />
            </div>
          </div>
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="px-3 py-2 rounded-lg text-sm outline-none cursor-pointer" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'white' }}>
            <option value="alle" style={{ background: '#0A1A2A' }}>Alle statuser</option>
            <option value="active" style={{ background: '#0A1A2A' }}>🚀 På reise</option>
            <option value="completed" style={{ background: '#0A1A2A' }}>✅ Ferdig</option>
          </select>
          <select value={phaseFilter} onChange={(e) => { setPhaseFilter(e.target.value); setPage(1); }} className="px-3 py-2 rounded-lg text-sm outline-none cursor-pointer" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'white' }}>
            <option value="alle" style={{ background: '#0A1A2A' }}>Alle faser</option>
            <option value="early" style={{ background: '#0A1A2A' }}>🌱 Dag 1–10</option>
            <option value="mid" style={{ background: '#0A1A2A' }}>🌿 Dag 6–20</option>
            <option value="late" style={{ background: '#0A1A2A' }}>🍂 Dag 16–30</option>
          </select>
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{journeys.length} resultater</span>
        </div>

        <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                {['Par', 'Reise', 'Profil', 'Bilde', 'Status', 'Startet', 'Handling'].map(h => (
                  <th key={h} className="py-3 px-4 text-left text-xs font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>{journeys.map(j => <JourneyRow key={j.id} journey={j} />)}</tbody>
            </table>
          </div>
          {journeys.length === 0 && <div className="py-12 text-center"><p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>Ingen reiser funnet</p></div>}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Side {page} av {totalPages}</span>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200" style={{ background: page === 1 ? 'rgba(255,255,255,0.02)' : 'rgba(212,175,55,0.08)', color: page === 1 ? 'rgba(255,255,255,0.2)' : '#D4AF37', border: '1px solid rgba(255,255,255,0.06)', cursor: page === 1 ? 'not-allowed' : 'pointer' }}>← Forrige</button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200" style={{ background: page === totalPages ? 'rgba(255,255,255,0.02)' : 'rgba(212,175,55,0.08)', color: page === totalPages ? 'rgba(255,255,255,0.2)' : '#D4AF37', border: '1px solid rgba(255,255,255,0.06)', cursor: page === totalPages ? 'not-allowed' : 'pointer' }}>Neste →</button>
            </div>
          </div>
        )}
      </>)}
    </div>
  );
}