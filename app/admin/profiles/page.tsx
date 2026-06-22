/**
 * ToSom — Admin Profiler
 * 
 * Server Component — viser alle profiler i ein tabell.
 */

import { getAllProfiles } from '@/lib/admin/data';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

/* ====== Hovudkomponent ====== */

export default async function AdminProfilesPage() {
  const profiles = await getAllProfiles(1, 100);

  return (
    <div className="flex flex-col gap-6 p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin"
          className="text-sm transition-colors duration-200"
          style={{ color: 'rgba(255,255,255,0.4)' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(212,175,55,0.7)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
        >
          ← Admin
        </Link>
        <h1 className="text-2xl font-semibold" style={{ color: '#D4AF37' }}>
          Profiler
        </h1>
        <span
          className="text-sm font-medium px-2 py-0.5 rounded-full"
          style={{
            background: 'rgba(212,175,55,0.1)',
            color: 'rgba(212,175,55,0.6)',
          }}
        >
          {profiles.length}
        </span>
      </div>

      {/* Tabell */}
      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Profil
              </th>
              <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>
                E-post
              </th>
              <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Alder
              </th>
              <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Relasjonsstil
              </th>
              <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Deep Profile
              </th>
              <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Oppretta
              </th>
              <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Handling
              </th>
            </tr>
          </thead>
          <tbody>
            {profiles.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12">
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    Ingen profiler funne.
                  </p>
                </td>
              </tr>
            ) : (
              profiles.map((p) => (
                <tr
                  key={p.id}
                  style={{
                    borderBottom: '1px solid rgba(255,255,255,0.03)',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td className="px-5 py-4">
                    <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>
                      {p.identityName || <span style={{ color: 'rgba(255,255,255,0.3)' }}>Ukjent</span>}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{p.userEmail}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                      {p.age || <span style={{ color: 'rgba(255,255,255,0.3)' }}>—</span>}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      {p.relationshipStyle || <span style={{ color: 'rgba(255,255,255,0.25)' }}>—</span>}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{
                        background: p.deepProfileComplete ? 'rgba(76,175,80,0.1)' : 'rgba(255,255,255,0.05)',
                        color: p.deepProfileComplete ? '#4DFF88' : 'rgba(255,255,255,0.3)',
                      }}
                    >
                      {p.deepProfileComplete ? '✓' : '—'} {p.deepProfileStep}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                      {new Date(p.createdAt).toLocaleDateString('nb-NO')}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <Link
                      href={`/admin/profiles/${p.id}`}
                      className="text-xs font-medium transition-colors duration-200"
                      style={{ color: 'rgba(212,175,55,0.5)' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#D4AF37')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(212,175,55,0.5)')}
                    >
                      Detaljar →
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}