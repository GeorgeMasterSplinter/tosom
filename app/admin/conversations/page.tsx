/**
 * ToSom — Admin Samtaler
 * 
 * Server Component — viser alle samtalar i ein tabell.
 */

import { getAllConversations } from '@/lib/admin/data';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminConversationsPage() {
  const convs = await getAllConversations(1, 100);

  return (
    <div className="flex flex-col gap-6 p-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-3">
        <Link href="/admin" className="text-sm transition-colors duration-200" style={{ color: 'rgba(255,255,255,0.4)' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(212,175,55,0.7)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}>
          ← Admin
        </Link>
        <h1 className="text-2xl font-semibold" style={{ color: '#D4AF37' }}>Samtaler</h1>
        <span className="text-sm font-medium px-2 py-0.5 rounded-full" style={{ background: 'rgba(212,175,55,0.1)', color: 'rgba(212,175,55,0.6)' }}>{convs.length}</span>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {['Brukar A', 'Brukar B', 'Meldingar', 'Siste melding', 'Oppretta', 'Handling'].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {convs.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-12"><p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>Ingen samtalar funne.</p></td></tr>
            ) : convs.map((c) => (
              <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.15s' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                <td className="px-5 py-4"><span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>{c.userAName}</span></td>
                <td className="px-5 py-4"><span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>{c.userBName}</span></td>
                <td className="px-5 py-4"><span className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{c.messageCount}</span></td>
                <td className="px-5 py-4"><span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{c.lastMessageAt ? new Date(c.lastMessageAt).toLocaleDateString('nb-NO') : '—'}</span></td>
                <td className="px-5 py-4"><span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{new Date(c.createdAt).toLocaleDateString('nb-NO')}</span></td>
                <td className="px-5 py-4"><Link href={`/admin/conversations/${c.id}`} className="text-xs font-medium transition-colors duration-200" style={{ color: 'rgba(212,175,55,0.5)' }}
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