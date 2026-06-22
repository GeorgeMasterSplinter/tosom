/**
 * ToSom — Admin Matcher
 * 
 * Server Component — viser alle matcher i ein tabell.
 */

import { getAllMatches } from '@/lib/admin/data';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

/* ====== Hovudkomponent ====== */

export default async function AdminMatchesPage() {
  const matches = await getAllMatches(1, 100);

  const resonanceBadge = (level: string) => {
    const colors: Record<string, { bg: string; color: string }> = {
      DEEP: { bg: 'rgba(147,51,234,0.12)', color: '#9C27B0' },
      STRONG: { bg: 'rgba(212,175,55,0.12)', color: '#D4AF37' },
      MODERATE: { bg: 'rgba(59,130,246,0.12)', color: '#3B82F6' },
      GENTLE: { bg: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)' },
    };
    const c = colors[level] || colors.GENTLE;
    return (
      <span
        className="text-xs font-medium px-2 py-0.5 rounded-full"
        style={{ background: c.bg, color: c.color }}
      >
        {level}
      </span>
    );
  };

  const statusBadge = (status: string) => {
    const colors: Record<string, { bg: string; color: string }> = {
      active: { bg: 'rgba(76,175,80,0.1)', color: '#4DFF88' },
      matched: { bg: 'rgba(212,175,55,0.1)', color: '#D4AF37' },
      pending: { bg: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' },
      expired: { bg: 'rgba(255,77,77,0.08)', color: 'rgba(255,77,77,0.6)' },
      ended: { bg: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)' },
    };
    const c = colors[status] || colors.pending;
    return (
      <span
        className="text-xs font-medium px-2 py-0.5 rounded-full"
        style={{ background: c.bg, color: c.color }}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="flex flex-col gap-6 p-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-3">
        <Link href="/admin" className="text-sm transition-colors duration-200" style={{ color: 'rgba(255,255,255,0.4)' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(212,175,55,0.7)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}>
          ← Admin
        </Link>
        <h1 className="text-2xl font-semibold" style={{ color: '#D4AF37' }}>Matcher</h1>
        <span className="text-sm font-medium px-2 py-0.5 rounded-full" style={{ background: 'rgba(212,175,55,0.1)', color: 'rgba(212,175,55,0.6)' }}>{matches.length}</span>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {['Brukar A', 'Brukar B', 'Score', 'Resonans', 'Status', 'Oppretta', 'Handling'].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matches.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-12"><p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>Ingen matcher funne.</p></td></tr>
            ) : matches.map((m) => (
              <tr key={m.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.15s' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                <td className="px-5 py-4"><span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>{m.userAName}</span></td>
                <td className="px-5 py-4"><span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>{m.userBName}</span></td>
                <td className="px-5 py-4">
                  <span className="text-lg font-bold" style={{ color: m.score >= 85 ? '#D4AF37' : m.score >= 70 ? '#E8C766' : 'rgba(255,255,255,0.5)' }}>{m.score}</span>
                </td>
                <td className="px-5 py-4">{resonanceBadge(m.resonanceLevel)}</td>
                <td className="px-5 py-4">{statusBadge(m.status)}</td>
                <td className="px-5 py-4"><span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{new Date(m.createdAt).toLocaleDateString('nb-NO')}</span></td>
                <td className="px-5 py-4"><Link href={`/admin/matches/${m.id}`} className="text-xs font-medium transition-colors duration-200" style={{ color: 'rgba(212,175,55,0.5)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#D4AF37')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(212,175,55,0.5)')}>Detaljar →</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}