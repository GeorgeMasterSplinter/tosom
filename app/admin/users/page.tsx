/**
 * ToSom — Admin Brukarar
 * 
 * Server Component — viser alle brukarar i ein tabell med søk og pagination.
 */

import { getAllUsers } from '@/lib/admin/data';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

/* ====== Hovudkomponent ====== */

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const params = await searchParams;
  const page = (params.page as string) ? parseInt(params.page as string, 10) : 1;
  const search = (params.q as string) ?? '';

  const users = await getAllUsers(page, 20);

  // Filter
  const filtered = search
    ? users.filter(u =>
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.profile?.identityName?.toLowerCase().includes(search.toLowerCase())
      )
    : users;

  return (
    <div className="flex flex-col gap-6 p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4">
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
            Brukarar
          </h1>
          <span
            className="text-sm font-medium px-2 py-0.5 rounded-full"
            style={{
              background: 'rgba(212,175,55,0.1)',
              color: 'rgba(212,175,55,0.6)',
            }}
          >
            {filtered.length}
          </span>
        </div>

        {/* Søk */}
        <SearchBar current={search} />
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
                Brukar
              </th>
              <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Rolle
              </th>
              <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Verifisert
              </th>
              <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Onboarding
              </th>
              <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>
                DP
              </th>
              <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Matcher
              </th>
              <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Samtaler
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
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-12">
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    Ingen brukarar funne.
                  </p>
                </td>
              </tr>
            ) : (
              filtered.map((u, i) => (
                <tr
                  key={u.id}
                  style={{
                    borderBottom: '1px solid rgba(255,255,255,0.03)',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td className="px-5 py-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>
                        {u.profile?.identityName || <span style={{ color: 'rgba(255,255,255,0.3)' }}>Ukjent namn</span>}
                      </span>
                      <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        {u.email}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{
                        background: u.role === 'ADMIN' ? 'rgba(212,175,55,0.12)' : 'rgba(255,255,255,0.05)',
                        color: u.role === 'ADMIN' ? '#D4AF37' : 'rgba(255,255,255,0.5)',
                      }}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge value={u.verified} label="Verifisert" />
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge value={u.onboardingComplete} label="Onboarding" />
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge value={u.deepProfileComplete} label="DP" />
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{u.matchCount}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{u.conversationCount}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                      {new Date(u.createdAt).toLocaleDateString('nb-NO')}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <Link
                      href={`/admin/users/${u.id}`}
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

/* ====== Underkomponentar ====== */

function SearchBar({ current }: { current: string }) {
  return (
    <form action="/admin/users" method="GET" className="flex gap-3">
      <div className="relative flex-1">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          className="absolute left-3 top-1/2 -translate-y-1/2"
          style={{ stroke: 'rgba(255,255,255,0.3)' }}
        >
          <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
          <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          name="q"
          defaultValue={current}
          placeholder="Søk på e-post eller namn..."
          className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm transition-all duration-200 focus:outline-none"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: 'rgba(255,255,255,0.7)',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'rgba(212,175,55,0.3)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
          }}
        />
      </div>
      {current && (
        <Link
          href="/admin/users"
          className="px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: 'rgba(255,255,255,0.5)',
          }}
        >
          Nullstill
        </Link>
      )}
    </form>
  );
}

function StatusBadge({ value, label }: { value: boolean; label: string }) {
  return (
    <span
      className="text-xs font-medium px-2 py-0.5 rounded-full"
      style={{
        background: value ? 'rgba(76,175,80,0.1)' : 'rgba(255,255,255,0.05)',
        color: value ? '#4DFF88' : 'rgba(255,255,255,0.3)',
      }}
    >
      {value ? '✓' : '—'} {label}
    </span>
  );
}