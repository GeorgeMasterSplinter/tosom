'use client';

/**
 * ToSom — Admin: Rapportbehandling (STEG C3)
 *
 * Lister alle rapporter med status=OPEN, sortert eldst først.
 * Handlinger: se kontekst, marker gjennomgått, iverksett (ban), avvis.
 */

import { useState, useEffect } from 'react';

interface ReportItem {
  id: string;
  reporterId: string;
  reportedId: string;
  matchId?: string;
  category: string;
  description?: string;
  status: string;
  createdAt: string;
}

const categoryLabels: Record<string, string> = {
  HARASSMENT: 'Uønsket atferd',
  INAPPROPRIATE: 'Upassende innhold',
  SPAM: 'Spam',
  FAKE_PROFILE: 'Falsk profil',
  OTHER: 'Annet',
};

export default function AdminReportsPage() {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await fetch('/api/report');
      if (res.ok) {
        const json = await res.json();
        // Sorter eldst først for at admin skal se gamle rapporter først
        const sorted = (json.reports || []).sort((a: ReportItem, b: ReportItem) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        setReports(sorted);
      }
    } catch {
      console.error('Feil ved henting av rapporter');
    }
    setLoading(false);
  };

  const updateStatus = async (reportId: string, status: string) => {
    try {
      await fetch('/api/report', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId, status }),
      });
      setSelected(null);
      fetchReports();
    } catch {
      console.error('Feil ved oppdatering');
    }
  };

  if (loading) return <div className="p-8 text-white/50">Laster inn rapporter...</div>;

  return (
    <div className="min-h-screen bg-[#0B1520] p-8">
      <h1 className="text-2xl font-bold mb-6" style={{ color: '#D4AF37' }}>
        Rapporter ({reports.length} åpne)
      </h1>

      {reports.length === 0 && (
        <p className="text-white/40">Ingen åpne rapporter.</p>
      )}

      <div className="space-y-3">
        {reports.map((r) => (
          <div
            key={r.id}
            className="rounded-xl p-4 cursor-pointer transition-all hover:bg-white/[0.03]"
            style={{ background: selected === r.id ? 'rgba(212,175,55,0.08)' : 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
            onClick={() => setSelected(selected === r.id ? null : r.id)}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-white/70 text-sm font-medium">{categoryLabels[r.category] || r.category}</span>
                {r.description && <p className="text-white/40 text-xs mt-1">{r.description}</p>}
              </div>
              <span className="text-white/30 text-xs">{new Date(r.createdAt).toLocaleString('nb-NO')}</span>
            </div>

            {/* Detaljer + handlinger */}
            {selected === r.id && (
              <div className="mt-4 pt-4 border-t border-white/6 space-y-3" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <div className="text-xs text-white/40 grid grid-cols-2 gap-2">
                  <span>Reporter: {r.reporterId.slice(0, 12)}...</span>
                  <span>Reportet: {r.reportedId.slice(0, 12)}...</span>
                  {r.matchId && <span>Match: {r.matchId.slice(0, 12)}...</span>}
                </div>

                <div className="flex gap-2">
                  <button onClick={(e) => { e.stopPropagation(); updateStatus(r.id, 'REVIEWED'); }} className="px-4 py-2 rounded-lg text-xs font-medium transition-all hover:opacity-80" style={{ background: 'rgba(212,175,55,0.2)', color: '#D4AF37' }}>
                    ✓ Gjennomgått
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); updateStatus(r.id, 'ACTIONED'); }} className="px-4 py-2 rounded-lg text-xs font-medium transition-all hover:opacity-80" style={{ background: 'rgba(239,68,68,0.2)', color: '#EF4444' }}>
                    ⛔ Iverksett (ban)
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); updateStatus(r.id, 'DISMISSED'); }} className="px-4 py-2 rounded-lg text-xs font-medium transition-all hover:opacity-80" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)' }}>
                    ✕ Avvis
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}