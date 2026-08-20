'use client';

/**
 * Tosom — Admin Samtaler (metadata)
 *
 * Oversikt over alle samtaler — metadata kun.
 * Ingen innsyn i meldingsinnhold eller bilder.
 * Data hentes fra /api/admin/conversations.
 * Driftsinvariant DI-1: admin ser at en samtale finnes og hvor aktiv den er — aldri innholdet.
 */

import { useState, useEffect, useCallback } from 'react';
import { formatDistanceToNow, format } from 'date-fns';
import { nb } from 'date-fns/locale';

/* ─── Typer ─── */

interface UserShort {
  id: string;
  email: string;
  name: string | null;
  role: string;
}

interface Conversation {
  id: string;
  userAId: string;
  userBId: string;
  matchId: string | null;
  frozenAt: string | null;
  frozenBy: string | null;
  endedAt: string | null;
  lastMessageAt: string | null;
  createdAt: string;
  imageShared: boolean;
  imageShareAllowedAt: string | null;
  userA: UserShort;
  userB: UserShort;
  _count: { messages: number };
}

interface ConversationsResponse {
  success: boolean;
  data: Conversation[];
  pagination: { page: number; limit: number; total: number; pages: number };
}

const LIMIT = 50;

/* ─── Hjelpere ─── */

function displayName(u: UserShort): string {
  return u.name && u.name.trim() !== '' ? u.name : u.email;
}

function initials(u: UserShort): string {
  const src = u.name && u.name.trim() !== '' ? u.name : u.email;
  return src
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

/* ─── Avatar ─── */

function Avatar({ user }: { user: UserShort }) {
  return (
    <div
      className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
      style={{
        background: 'linear-gradient(135deg, rgba(212,175,55,0.2) 0%, rgba(212,175,55,0.05) 100%)',
        color: '#D4AF37',
        border: '1px solid rgba(212,175,55,0.3)',
      }}
    >
      {initials(user)}
    </div>
  );
}

/* ─── Status-merke ─── */

function statusOf(c: Conversation): { label: string; color: string } {
  if (c.frozenAt) return { label: 'Frosset', color: '#FF4D4D' };
  if (c.endedAt) return { label: 'Avsluttet', color: '#8B5CF6' };
  return { label: 'Aktiv', color: '#4ADE80' };
}

function StatusBadge({ c }: { c: Conversation }) {
  const { label, color } = statusOf(c);
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
      style={{
        background: `${color}15`,
        color: color,
        border: `1px solid ${color}30`,
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}

/* ─── Tabell-rad ─── */

function ChatRow({ c }: { c: Conversation }) {
  return (
    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      {/* Par */}
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <Avatar user={c.userA} />
            <span className="text-sm font-medium hidden sm:inline" style={{ color: 'rgba(255,255,255,0.7)' }}>
              {displayName(c.userA)}
            </span>
          </div>
          <span className="text-xs" style={{ color: 'rgba(212,175,55,0.5)' }}>↔</span>
          <div className="flex items-center gap-1.5">
            <Avatar user={c.userB} />
            <span className="text-sm font-medium hidden sm:inline" style={{ color: 'rgba(255,255,255,0.7)' }}>
              {displayName(c.userB)}
            </span>
          </div>
        </div>
      </td>

      {/* Status */}
      <td className="py-3 px-4">
        <StatusBadge c={c} />
      </td>

      {/* Meldinger */}
      <td className="py-3 px-4">
        <span className="text-sm font-mono" style={{ color: 'rgba(255,255,255,0.6)' }}>
          {c._count.messages.toLocaleString('nb-NO')}
        </span>
      </td>

      {/* Bilde */}
      <td className="py-3 px-4 text-center">
        <span className="text-sm font-mono" style={{ color: c.imageShared ? '#4ADE80' : 'rgba(255,255,255,0.3)' }}>
          {c.imageShared ? 'Ja' : 'Nei'}
        </span>
      </td>

      {/* Siste melding */}
      <td className="py-3 px-4">
        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
          {c.lastMessageAt
            ? formatDistanceToNow(new Date(c.lastMessageAt), { addSuffix: true, locale: nb })
            : 'Ingen ennå'}
        </span>
      </td>

      {/* Startet */}
      <td className="py-3 px-4">
        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
          {format(new Date(c.createdAt), 'd. MMM yyyy', { locale: nb })}
        </span>
      </td>
    </tr>
  );
}

/* ─── Hovedkomponent ─── */

export default function AdminChatPage() {
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: LIMIT, total: 0, pages: 0 });
  const [error, setError] = useState<string | null>(null);
  const [frozenOnly, setFrozenOnly] = useState(false);

  const fetchConversations = useCallback(
    (page: number) => {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        page: String(page),
        limit: String(LIMIT),
        frozenOnly: frozenOnly ? 'true' : 'false',
      });
      fetch(`/api/admin/conversations?${params}`)
        .then((r) => (r.ok ? r.json() : Promise.reject(new Error('Feil'))))
        .then((json: ConversationsResponse) => {
          setConversations(json.data ?? []);
          setPagination(json.pagination ?? { page, limit: LIMIT, total: 0, pages: 0 });
        })
        .catch(() => setError('Kunne ikke hente samtaler.'))
        .finally(() => setLoading(false));
    },
    [frozenOnly],
  );

  useEffect(() => {
    fetchConversations(1);
  }, [fetchConversations]);

  const totalPages = pagination.pages;
  const activeCount = conversations.filter((c) => !c.frozenAt && !c.endedAt).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'rgba(255,255,255,0.95)' }}>
            Samtaler
          </h1>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Oversikt over alle samtaler — metadata kun. Ingen innsyn i innhold eller bilder.
          </p>
        </div>
        <button
          onClick={() => fetchConversations(pagination.page)}
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

      {/* Trygghetsbanner */}
      <div
        className="rounded-xl px-4 py-3 flex items-center gap-3"
        style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)' }}
      >
        <p className="text-xs flex-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
          Admin ser bare metadata — aldri meldinger eller bilder. Privatlivet til brukerne er trygt.
        </p>
      </div>

      {/* Statistikk */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          className="rounded-xl p-4"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="text-2xl font-mono font-bold" style={{ color: '#D4AF37' }}>
            {loading ? '—' : pagination.total.toLocaleString('nb-NO')}
          </div>
          <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Totale samtaler</div>
        </div>
        <div
          className="rounded-xl p-4"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="text-2xl font-mono font-bold" style={{ color: '#4ADE80' }}>
            {loading ? '—' : activeCount.toLocaleString('nb-NO')}
          </div>
          <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Aktive (denne siden)</div>
        </div>
        <div
          className="rounded-xl p-4"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="text-2xl font-mono font-bold" style={{ color: 'rgba(255,255,255,0.5)' }}>
            {loading ? '—' : conversations.length.toLocaleString('nb-NO')}
          </div>
          <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Vises nå</div>
        </div>
      </div>

      {/* Filter */}
      <div
        className="rounded-2xl p-4 flex flex-wrap items-center gap-3"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <button
          onClick={() => {
            setFrozenOnly((v) => !v);
          }}
          className="px-3 py-2 rounded-lg text-xs font-medium transition-colors"
          style={{
            background: frozenOnly ? 'rgba(255,77,77,0.1)' : 'rgba(255,255,255,0.04)',
            color: frozenOnly ? '#FF4D4D' : 'rgba(255,255,255,0.6)',
            border: `1px solid ${frozenOnly ? 'rgba(255,77,77,0.3)' : 'rgba(255,255,255,0.08)'}`,
          }}
        >
          {frozenOnly ? 'Vis bare fryste' : 'Vis alle'}
        </button>
        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
          {pagination.total.toLocaleString('nb-NO')} totalt
        </span>
      </div>

      {/* Tabell */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                <th className="py-3 px-4 text-left text-xs font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>Par</th>
                <th className="py-3 px-4 text-left text-xs font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>Status</th>
                <th className="py-3 px-4 text-left text-xs font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>Meldinger</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-center" style={{ color: 'rgba(255,255,255,0.35)' }}>Bilde</th>
                <th className="py-3 px-4 text-left text-xs font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>Siste melding</th>
                <th className="py-3 px-4 text-left text-xs font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>Startet</th>
              </tr>
            </thead>
            <tbody>
              {conversations.map((c) => (
                <ChatRow key={c.id} c={c} />
              ))}
            </tbody>
          </table>
        </div>

        {/* Feiltilstand */}
        {error && (
          <div className="py-12 text-center">
            <p className="text-sm" style={{ color: '#FF4D4D' }}>
              {error}
            </p>
          </div>
        )}

        {/* Henting */}
        {loading && !error && (
          <div className="py-12 text-center">
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Henter samtaler …
            </p>
          </div>
        )}

        {/* Tom tilstand */}
        {!loading && !error && conversations.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Ingen samtaler ennå.
            </p>
          </div>
        )}
      </div>

      {/* Paginering */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Side {pagination.page} av {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchConversations(Math.max(1, pagination.page - 1))}
              disabled={loading || pagination.page === 1}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-40"
              style={{
                background: 'rgba(212,175,55,0.08)',
                color: '#D4AF37',
                border: '1px solid rgba(212,175,55,0.2)',
              }}
            >
              ← Forrige
            </button>
            <button
              onClick={() => fetchConversations(Math.min(totalPages, pagination.page + 1))}
              disabled={loading || pagination.page === totalPages}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-40"
              style={{
                background: 'rgba(212,175,55,0.08)',
                color: '#D4AF37',
                border: '1px solid rgba(212,175,55,0.2)',
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