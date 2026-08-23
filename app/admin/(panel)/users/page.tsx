'use client';

/**
 * Tosom — Admin Brukere (midlertidig oversikt)
 *
 * Enkel liste over registrerte brukere: epost + registreringsdato.
 * Mulighet til å slette en hel konto (permanent).
 * Midlertidig flate for beta — holdes enkel og rett fram.
 */

import { useState, useEffect, useCallback } from 'react';

interface UserItem {
  id: string;
  email: string;
  name: string | null;
  role: string;
  verified: boolean;
  bannedAt: string | null;
  deletedAt: string | null;
  onboardingStep: number;
  onboardingComplete: boolean;
  journeyState: string;
  activeMatches: number;
  createdAt: string;
}

interface UsersResponse {
  success: boolean;
  data: UserItem[];
  pagination: { page: number; limit: number; total: number; pages: number };
}

const LIMIT = 50;

export default function AdminUsersPage() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: LIMIT, total: 0, pages: 0 });
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmEmail, setConfirmEmail] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchUsers = useCallback((page: number) => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams({
      page: String(page),
      limit: String(LIMIT),
    });
    fetch(`/api/admin/users?${params}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('Feil'))))
      .then((json: UsersResponse) => {
        setUsers(json.data ?? []);
        setPagination(json.pagination ?? { page, limit: LIMIT, total: 0, pages: 0 });
      })
      .catch(() => setError('Kunne ikke hente brukere.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchUsers(1);
  }, [fetchUsers]);

  async function deleteUser(userId: string) {
    setDeleting(userId);
    setFeedback(null);
    const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
    const json = await res.json().catch(() => null);
    if (res.ok) {
      setFeedback(`Konto slettet: ${confirmEmail}`);
      setConfirmEmail(null);
      // Re-hent siden — listen skifter nummer ved sletting
      fetchUsers(pagination.page);
    } else {
      setError(json?.error ?? 'Sletting feila.');
      setConfirmEmail(null);
    }
    setDeleting(null);
  }

  const totalPages = pagination.pages;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'rgba(255,255,255,0.95)' }}>
            Brukere
          </h1>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Registrerte kontoer — midlertidig oversikt
          </p>
        </div>
        <button
          onClick={() => fetchUsers(pagination.page)}
          disabled={loading}
          className="text-xs px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40"
          style={{
            background: 'rgba(212,175,55,0.08)',
            border: '1px solid rgba(212,175,55,0.2)',
            color: '#D4AF37',
          }}
        >
          {loading ? 'Henter …' : 'Oppdater'}
        </button>
      </div>

      {/* Teller */}
      <div
        className="rounded-xl px-4 py-3 flex items-center gap-2"
        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <span className="text-2xl font-mono font-bold" style={{ color: '#D4AF37' }}>
          {loading ? '—' : pagination.total.toLocaleString('nb-NO')}
        </span>
        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
          registrerte kontoer
        </span>
      </div>

      {feedback && (
        <div
          className="rounded-xl px-4 py-3"
          style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)' }}
        >
          <p className="text-xs" style={{ color: '#34D399' }}>{feedback}</p>
        </div>
      )}

      {error && (
        <div
          className="rounded-xl px-4 py-3"
          style={{ background: 'rgba(255,77,77,0.08)', border: '1px solid rgba(255,77,77,0.2)' }}
        >
          <p className="text-xs" style={{ color: '#FF4D4D' }}>{error}</p>
        </div>
      )}

      {/* Bekreft-sletting */}
      {confirmEmail && (
        <div
          className="rounded-xl px-4 py-4"
          style={{ background: 'rgba(255,77,77,0.1)', border: '1px solid rgba(255,77,77,0.3)' }}
        >
          <p className="text-sm mb-3" style={{ color: 'rgba(255,255,255,0.85)' }}>
            Slette kontoen <strong>{confirmEmail}</strong> permanent? Alt innhold (profil,
            matcher, reiser, samtaler, bilder) forsvinner. Dette kan ikke angres.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => deleteUser(users.find((u) => u.email === confirmEmail)?.id ?? '')}
              disabled={deleting !== null}
              className="px-4 py-2 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
              style={{ background: 'rgba(255,77,77,0.2)', color: '#FF4D4D', border: '1px solid rgba(255,77,77,0.35)' }}
            >
              {deleting ? 'Sletter …' : 'Bekreft sletting'}
            </button>
            <button
              onClick={() => setConfirmEmail(null)}
              className="px-4 py-2 rounded-lg text-xs font-medium transition-colors"
              style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              Avbryt
            </button>
          </div>
        </div>
      )}

      {/* Liste */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="grid grid-cols-[1fr_auto_auto] items-center px-4 py-3 gap-3" style={{ background: 'rgba(255,255,255,0.02)' }}>
          <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>Epost · Registrert</span>
          <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>Status</span>
          <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>Handling</span>
        </div>

        {loading && (
          <div className="py-12 text-center">
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>Henter brukere …</p>
          </div>
        )}

        {!loading && !error && users.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>Ingen registrerte kontoer ennå.</p>
          </div>
        )}

        {!loading &&
          users.map((u) => {
            // Status-farger
            const journeyColor =
              u.journeyState === 'MATCHED' ? '#34D399'
              : u.journeyState === 'QUEUED' ? '#D4AF37'
              : u.journeyState === 'IN_JOURNEY' ? '#60A5FA'
              : 'rgba(255,255,255,0.35)';
            const journeyLabel =
              u.journeyState === 'MATCHED' ? 'Matchet'
              : u.journeyState === 'QUEUED' ? 'I kø'
              : u.journeyState === 'IN_JOURNEY' ? 'I reise'
              : u.journeyState === 'IDLE' ? 'Idle'
              : u.journeyState;

            return (
              <div
                key={u.id}
                className="grid grid-cols-[1fr_auto_auto] items-center gap-3 px-4 py-3"
                style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
              >
                <div className="min-w-0">
                  <p className="text-sm break-all" style={{ color: 'rgba(255,255,255,0.85)' }}>
                    {u.email}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    {new Date(u.createdAt).toLocaleDateString('nb-NO')}
                    {u.role === 'ADMIN' ? ' · Admin' : ''}
                    {u.bannedAt ? ' · Utestengt' : ''}
                    {u.deletedAt ? ' · Slettet' : ''}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span
                    className="text-[10px] font-mono px-2 py-0.5 rounded-full whitespace-nowrap"
                    style={{ background: 'rgba(255,255,255,0.04)', color: journeyColor }}
                  >
                    {journeyLabel}
                  </span>
                  <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    {u.onboardingComplete
                      ? 'Onboarding fullført'
                      : `Onboarding steg ${u.onboardingStep}`}
                  </span>
                </div>
                <button
                  onClick={() => setConfirmEmail(u.email)}
                  disabled={u.role === 'ADMIN' || deleting !== null}
                  title={u.role === 'ADMIN' ? 'Kan ikke slette en admin' : 'Slett konto'}
                  className="px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors disabled:opacity-30"
                  style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.25)' }}
                >
                  Slett
                </button>
              </div>
            );
          })}
      </div>

      {/* Paginering */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Side {pagination.page} av {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchUsers(Math.max(1, pagination.page - 1))}
              disabled={loading || pagination.page === 1}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-40"
              style={{ background: 'rgba(212,175,55,0.08)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.2)' }}
            >
              ← Forrige
            </button>
            <button
              onClick={() => fetchUsers(Math.min(totalPages, pagination.page + 1))}
              disabled={loading || pagination.page === totalPages}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-40"
              style={{ background: 'rgba(212,175,55,0.08)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.2)' }}
            >
              Neste →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}