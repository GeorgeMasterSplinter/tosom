/**
 * ToSom — Admin AI-innsikt
 * 
 * Server Component — viser alle MatchInsight.
 */

import { getAllInsights } from '@/lib/admin/data';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminInsightsPage() {
  const insights = await getAllInsights(1, 100);

  return (
    <div className="flex flex-col gap-6 p-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-3">
        <Link href="/admin" className="text-sm transition-colors duration-200" style={{ color: 'rgba(255,255,255,0.4)' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(212,175,55,0.7)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}>
          ← Admin
        </Link>
        <h1 className="text-2xl font-semibold" style={{ color: '#D4AF37' }}>AI-innsikt</h1>
        <span className="text-sm font-medium px-2 py-0.5 rounded-full" style={{ background: 'rgba(147,51,234,0.12)', color: '#9C27B0' }}>{insights.length}</span>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>Match ID</th>
              <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>Summary</th>
              <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>Model</th>
              <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>Tokens</th>
              <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>Oppretta</th>
              <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>Handling</th>
            </tr>
          </thead>
          <tbody>
            {insights.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-12"><p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>Ingen innsikter funne.</p></td></tr>
            ) : insights.map((ins) => (
              <tr key={ins.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.15s' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                <td className="px-5 py-4"><span className="text-xs font-mono" style={{ color: 'rgba(212,175,55,0.5)' }}>{ins.matchId.slice(0, 8)}...</span></td>
                <td className="px-5 py-4"><span className="text-sm" style={{ color: 'rgba(255,255,255,0.6)', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>{ins.summary}</span></td>
                <td className="px-5 py-4"><span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(147,51,234,0.1)', color: '#9C27B0' }}>{ins.model || '—'}</span></td>
                <td className="px-5 py-4"><span className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{ins.tokensOut}</span></td>
                <td className="px-5 py-4"><span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{new Date(ins.createdAt).toLocaleDateString('nb-NO')}</span></td>
                <td className="px-5 py-4"><Link href={`/admin/insights/${ins.id}`} className="text-xs font-medium transition-colors duration-200" style={{ color: 'rgba(212,175,55,0.5)' }}
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