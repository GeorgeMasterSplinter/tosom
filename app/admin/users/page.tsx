/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
/**
 * ToSom Admin — Brukarliste
 * 
 * Oversikt over alle brukarar med søk, filter og paginering.
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

/* ====== Type-definisjonar ====== */

interface UserProfile {
  firstName: string | null;
  lastName: string | null;
  age: number | null;
  photoUrl: string | null;
}

interface AdminUser {
  id: string;
  email: string;
  phone: string | null;
  role: string;
  verified: boolean;
  bannedAt: Date | null;
  deletedAt: Date | null;
  onboardingStep: number;
  onboardingComplete: boolean;
  deepProfileComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastMatchAt: Date | null;
  lockedUntil: Date | null;
  profile: UserProfile;
  _count: {
    matchesA: number;
    matchesB: number;
    conversationsA: number;
  };
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface UsersResponse {
  users: AdminUser[];
  pagination: PaginationInfo;
  filters: {
    search: string;
    role: string | null;
    verified: string | null;
    banned: string | null;
  };
}

/* ====== Hovudkomponent ====== */

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter-state
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [verifiedFilter, setVerifiedFilter] = useState('');
  const [bannedFilter, setBannedFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search, roleFilter, verifiedFilter, bannedFilter, sortBy, sortOrder]);

  async function fetchUsers(page = pagination.page) {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({
      page: String(page),
      limit: '20',
      search,
      sortBy,
      sortOrder,
    });

    if (roleFilter) params.set('role', roleFilter);
    if (verifiedFilter) params.set('verified', verifiedFilter);
    if (bannedFilter) params.set('banned', bannedFilter);

    try {
      const res = await fetch(`/api/admin/users?${params}`, { cache: 'no-store' });
      
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      const data: UsersResponse = await res.json();
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (err: any) {
      setError(err.message || 'Kunne ikkje hente brukarar');
    } finally {
      setLoading(false);
    }
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    fetchUsers(1);
  }

  /* ====== Loading Skeleton ====== */
  if (loading && users.length === 0) {
    return (
      <div className="min-h-screen" style={{ background: '#0A1A2A' }}>
        <div className="mx-auto px-4 py-8 max-w-7xl">
          <div className="h-8 w-48 rounded-lg bg-white/5 animate-pulse mb-6" />
          <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-white/5">
                <div className="h-8 w-8 rounded-full bg-white/5 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-48 rounded bg-white/5 animate-pulse" />
                  <div className="h-3 w-32 rounded bg-white/3 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ====== Error State ====== */
  if (error && users.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0A1A2A' }}>
        <div className="text-center space-y-4">
          <p style={{ color: 'rgba(255,77,77,0.8)' }}>Feil ved lasting av brukarliste</p>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '14px' }}>{error}</p>
        </div>
      </div>
    );
  }

  /* ====== Main Render ====== */
  return (
    <div className="min-h-screen" style={{ background: '#0A1A2A' }}>
      <div className="mx-auto px-4 py-8 max-w-7xl">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#FFFFFF' }}>Brukarar</h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
              {pagination.total.toLocaleString()} brukarar totalt
            </p>
          </div>
          <Link
            href="/admin/dashboard"
            className="px-4 py-2 rounded-lg text-sm transition-all duration-200"
            style={{ 
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.6)'
            }}
          >
            ← Tilbake
          </Link>
        </div>

        {/* Filter-panel */}
        <div className="mb-6 rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex flex-wrap gap-4 items-end">
            {/* Søkeboks */}
            <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Søk på e-post, namn..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 rounded-lg text-sm outline-none transition-all duration-200"
                style={{ 
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#FFFFFF'
                }}
              />
            </form>

            {/* Filter-droppar */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm outline-none cursor-pointer"
              style={{ 
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#FFFFFF'
              }}
            >
              <option value="" style={{ background: '#0A1A2A' }}>Alle roller</option>
              <option value="USER" style={{ background: '#0A1A2A' }}>Brukar</option>
              <option value="ADMIN" style={{ background: '#0A1A2A' }}>Admin</option>
            </select>

            <select
              value={verifiedFilter}
              onChange={(e) => setVerifiedFilter(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm outline-none cursor-pointer"
              style={{ 
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#FFFFFF'
              }}
            >
              <option value="" style={{ background: '#0A1A2A' }}>Verifiserte</option>
              <option value="true" style={{ background: '#0A1A2A' }}>Ja</option>
              <option value="false" style={{ background: '#0A1A2A' }}>Nei</option>
            </select>

            <select
              value={bannedFilter}
              onChange={(e) => setBannedFilter(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm outline-none cursor-pointer"
              style={{ 
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#FFFFFF'
              }}
            >
              <option value="" style={{ background: '#0A1A2A' }}>Sperringer</option>
              <option value="true" style={{ background: '#0A1A2A' }}>Sperra</option>
              <option value="false" style={{ background: '#0A1A2A' }}>Ikke sperra</option>
            </select>

            {/* Sortering */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm outline-none cursor-pointer"
              style={{ 
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#FFFFFF'
              }}
            >
              <option value="createdAt" style={{ background: '#0A1A2A' }}>Sorter: Oppretta</option>
              <option value="email" style={{ background: '#0A1A2A' }}>Sorter: E-post</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              className="px-3 py-2 rounded-lg text-sm transition-all duration-200"
              style={{ 
                background: 'rgba(212,175,55,0.1)',
                border: '1px solid rgba(212,175,55,0.3)',
                color: '#D4AF37'
              }}
            >
              {sortOrder === 'desc' ? '↓ Nyast først' : '↑ Eldst først'}
            </button>

            {/* Nullstill filter */}
            {(search || roleFilter || verifiedFilter || bannedFilter) && (
              <button
                onClick={() => { setSearch(''); setRoleFilter(''); setVerifiedFilter(''); setBannedFilter(''); fetchUsers(1); }}
                className="px-3 py-2 rounded-lg text-sm transition-all duration-200"
                style={{ 
                  background: 'rgba(255,77,77,0.1)',
                  border: '1px solid rgba(255,77,77,0.2)',
                  color: 'rgba(255,77,77,0.8)'
                }}
              >
                ✕ Nullstill
              </button>
            )}
          </div>
        </div>

        {/* Brukarta-belle */}
        <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          {/* Table header */}
          <div 
            className="grid grid-cols-12 gap-4 px-6 py-3 text-[10px] font-semibold tracking-[0.2em] uppercase"
            style={{ 
              background: 'rgba(255,255,255,0.03)',
              color: 'rgba(255,255,255,0.3)' 
            }}
          >
            <div className="col-span-3">Brukar</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Onboarding</div>
            <div className="col-span-2">Aktivitet</div>
            <div className="col-span-2">Registerad</div>
            <div className="col-span-1">Aksjonar</div>
          </div>

          {/* Table rows */}
          {users.length === 0 ? (
            <div className="text-center py-16" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Ingen brukarar funne
            </div>
          ) : (
            users.map((user) => (
              <div
                key={user.id}
                className="grid grid-cols-12 gap-4 px-6 py-4 border-t border-white/5 items-center transition-all duration-200 hover:bg-white/[0.02]"
              >
                {/* Brukar-info */}
                <div className="col-span-3">
                  <div className="flex items-center gap-3">
                    {user.profile.photoUrl ? (
                      <img
                        src={user.profile.photoUrl}
                        alt=""
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37' }}
                      >
                        {(user.profile.firstName?.[0] || user.email[0]).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>
                        {user.profile.firstName && user.profile.lastName 
                          ? `${user.profile.firstName} ${user.profile.lastName}`
                          : 'Utan namn'
                        }
                      </div>
                      <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        {user.email}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="col-span-2">
                  <div className="flex items-center gap-2">
                    {user.bannedAt ? (
                      <span 
                        className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                        style={{ background: 'rgba(255,77,77,0.15)', color: 'rgba(255,77,77,0.8)' }}
                      >
                        SPERRA
                      </span>
                    ) : (
                      <span 
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${user.verified ? '' : ''}`}
                        style={{ 
                          background: user.verified 
                            ? 'rgba(77,255,136,0.12)' 
                            : 'rgba(255,255,255,0.06)',
                          color: user.verified ? '#4DFF88' : 'rgba(255,255,255,0.4)'
                        }}
                      >
                        {user.verified ? 'VERIFISERT' : 'Uverifisert'}
                      </span>
                    )}
                    {user.role === 'ADMIN' && (
                      <span 
                        className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                        style={{ background: 'rgba(212,175,55,0.12)', color: '#D4AF37' }}
                      >
                        ADMIN
                      </span>
                    )}
                  </div>
                </div>

                {/* Onboarding */}
                <div className="col-span-2">
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>
                    Steg {user.onboardingStep}/9
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <div 
                      className="h-1 rounded-full"
                      style={{ 
                        width: `${(user.onboardingStep / 9) * 64}px`,
                        background: user.deepProfileComplete ? '#4DFF88' : '#D4AF37'
                      }}
                    />
                    {user.deepProfileComplete && (
                      <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px' }}>✓</span>
                    )}
                  </div>
                </div>

                {/* Aktivitet */}
                <div className="col-span-2" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>
                  {user._count.matchesA + user._count.matchesB > 0 && (
                    <span>💫 {user._count.matchesA + user._count.matchesB} match{user._count.matchesA + user._count.matchesB !== 1 ? 'er' : ''}</span>
                  )}
                  {user._count.conversationsA > 0 && (
                    <span className="ml-2">💬 {user._count.conversationsA} samtal{user._count.conversationsA !== 1 ? 'er' : ''}</span>
                  )}
                </div>

                {/* Registerad dato */}
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>
                  {new Date(user.createdAt).toLocaleDateString('nb-NO', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>

                {/* Aksjonar */}
                <div className="col-span-1">
                  <Link
                    href={`/admin/users/${user.id}`}
                    className="text-xs transition-all duration-200"
                    style={{ color: 'rgba(212,175,55,0.6)' }}
                  >
                    →
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Paginering */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 px-2">
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>
              Side {pagination.page} av {pagination.totalPages} ({pagination.total.toLocaleString()} brukarar)
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchUsers(pagination.page - 1)}
                disabled={!pagination.hasPrev}
                className="px-4 py-2 rounded-lg text-sm transition-all duration-200"
                style={{ 
                  background: pagination.hasPrev ? 'rgba(255,255,255,0.05)' : 'transparent',
                  border: `1px solid ${pagination.hasPrev ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)'}`,
                  color: pagination.hasPrev ? '#FFFFFF' : 'rgba(255,255,255,0.2)',
                  cursor: pagination.hasPrev ? 'pointer' : 'not-allowed',
                }}
              >
                ← Førre
              </button>
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                // Vis side-nummer rundt noverande side
                let pageNum;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (pagination.page <= 3) {
                  pageNum = i + 1;
                } else if (pagination.page >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  pageNum = pagination.page - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => fetchUsers(pageNum)}
                    className="w-8 h-8 rounded-lg text-sm transition-all duration-200"
                    style={{ 
                      background: pageNum === pagination.page ? 'rgba(212,175,55,0.15)' : 'transparent',
                      border: `1px solid ${pageNum === pagination.page ? 'rgba(212,175,55,0.3)' : 'rgba(255,255,255,0.06)'}`,
                      color: pageNum === pagination.page ? '#D4AF37' : 'rgba(255,255,255,0.5)',
                      fontWeight: pageNum === pagination.page ? 600 : 400,
                    }}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => fetchUsers(pagination.page + 1)}
                disabled={!pagination.hasNext}
                className="px-4 py-2 rounded-lg text-sm transition-all duration-200"
                style={{ 
                  background: pagination.hasNext ? 'rgba(255,255,255,0.05)' : 'transparent',
                  border: `1px solid ${pagination.hasNext ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)'}`,
                  color: pagination.hasNext ? '#FFFFFF' : 'rgba(255,255,255,0.2)',
                  cursor: pagination.hasNext ? 'pointer' : 'not-allowed',
                }}
              >
                Neste →
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}