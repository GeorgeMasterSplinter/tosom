"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface UserItem {
  id: string;
  email: string;
  name: string | null;
  role: string;
  verified: boolean;
  bannedAt: Date | null;
  deletedAt: Date | null;
  onboardingComplete: boolean;
  deepProfileComplete: boolean;
  lastMatchAt: Date | null;
  lockedUntil: Date | null;
  createdAt: Date;
  journey: { day: number; phase: string; completedDays: number } | null;
  activeMatches: number;
}

interface UsersResponse {
  success: boolean;
  data: UserItem[];
  pagination: { page: number; limit: number; total: number; pages: number };
}

const PHASE_COLORS = {
  EARLY: "#34D399",
  BUILDING_TRUST: "#60A5FA",
  DEEPER: "#F472B6",
  CHECKIN: "#A78BFA",
};

export default function AdminUsersPage() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });
  const [error, setError] = useState<string | null>(null);
  const [filterRole, setFilterRole] = useState("");
  const [flaggedOnly, setFlaggedOnly] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ action: string; userId: string } | null>(null);
  const [search, setSearch] = useState("");

  async function fetchUsers(page = 1) {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: String(page),
        limit: "20",
        ...(filterRole && { role: filterRole }),
        flaggedOnly: flaggedOnly ? "true" : "false",
      });
      const res = await fetch(`/api/admin/users?${params}`);
      if (!res.ok) setError(res.statusText);
      else {
        const json: UsersResponse = await res.json();
        setUsers(json.data || []);
        setPagination(json.pagination);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ukjent feil");
    } finally {
      setLoading(false);
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchUsers(1); }, [filterRole, flaggedOnly]);

  async function performAction(action: string, userId: string) {
    try {
      setActionLoading(userId);
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) {
        const json = await res.json();
        setError(json.error || "Handlinga feila");
      } else {
        fetchUsers(pagination.page);
        if (selectedUser?.id === userId) setSelectedUser(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Handlinga feila");
    } finally {
      setActionLoading(null);
      setConfirmAction(null);
    }
  }

  const statusBadge = (u: UserItem) => {
    if (u.bannedAt) return <span title={`Flagga ${new Date(u.bannedAt).toLocaleString('nb-NO')}`}>🔴 Flagga</span>;
    if (!u.verified) return <span>⚪ Ikkje verifisert</span>;
    return <span>🟢 Aktiv</span>;
  };

  const actionLabel = (a: string) => {
    switch (a) {
      case 'flag': return 'Flag';
      case 'unflag': return 'Unflag';
      case 'reset-onboarding': return 'Reset Onb.';
      case 'reset-journey': return 'Reset Journey';
      case 'force-match-end': return 'Force End';
      default: return a;
    }
  }

  const actionColor = (a: string) => {
    switch (a) {
      case 'flag': return '#EF4444';
      case 'unflag': return '#34D399';
      case 'reset-onboarding': return '#FBBF24';
      case 'reset-journey': return '#60A5FA';
      case 'force-match-end': return '#F472B6';
      default: return '#9CA3AF';
    }
  };

  // Kompakt statistikk fra data
  const totalUsers = pagination.total;
  const activeUsers = users.filter(u => !u.bannedAt && u.verified).length;
  const flaggedUsers = users.filter(u => u.bannedAt).length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'rgba(255,255,255,0.95)' }}>👥 Brukere</h1>
        </div>
        <div className="py-12 text-center">
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Laster brukere...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'rgba(255,255,255,0.95)' }}>👥 Brukere</h1>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Brukerhandtering og moderering</p>
      </div>

      {/* Kompakte Metrikk-kort */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="text-2xl font-bold mb-1" style={{ color: '#D4AF37' }}>{totalUsers}</div>
          <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Totale brukere</div>
        </div>
        <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="text-2xl font-bold mb-1" style={{ color: '#4ADE80' }}>{activeUsers}</div>
          <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Aktive (vises)</div>
        </div>
        <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="text-2xl font-bold mb-1" style={{ color: '#FF4D4D' }}>{flaggedUsers}</div>
          <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Flaggede</div>
        </div>
      </div>

      {/* Søk + Filter */}
      <div className="rounded-2xl p-4 flex flex-wrap items-center gap-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" /></svg>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Søk etter navn eller e-post..." className="w-full pl-9 pr-4 py-2 rounded-lg text-sm outline-none transition-all duration-200" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'white' }} />
          </div>
        </div>
        <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="px-3 py-2 rounded-lg text-sm outline-none cursor-pointer" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'white' }}>
          <option value="" style={{ background: '#0A1A2A' }}>Alle roller</option>
          <option value="USER" style={{ background: '#0A1A2A' }}>Brukere</option>
          <option value="ADMIN" style={{ background: '#0A1A2A' }}>Adminer</option>
        </select>
        <button onClick={() => setFlaggedOnly(!flaggedOnly)} className="px-3 py-2 rounded-lg text-sm font-medium transition-all" style={{ background: flaggedOnly ? 'rgba(255,77,77,0.2)' : 'rgba(255,255,255,0.04)', color: flaggedOnly ? '#FF4D4D' : 'rgba(255,255,255,0.6)', border: `1px solid ${flaggedOnly ? 'rgba(255,77,77,0.3)' : 'rgba(255,255,255,0.08)'}` }}>
          {flaggedOnly ? "🔴 Kun flaggede" : "⚪ Vis alle"}
        </button>
        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{pagination.total} totalt</span>
      </div>

      {/* Error */}
      {error && (
        <div style={{ padding: "12px 16px", borderRadius: "12px", background: "rgba(255,77,77,0.1)", border: "1px solid rgba(255,77,77,0.3)", color: "#FF4D4D", marginBottom: "24px" }}>
          ⚠️ {error}
        </div>
      )}

      {/* Confirm dialog */}
      {confirmAction && (
        <div style={{ marginBottom: "24px", padding: "16px", borderRadius: "12px", background: "rgba(255,77,77,0.1)", border: "1px solid rgba(255,77,77,0.3)" }}>
          <div style={{ fontSize: "14px", marginBottom: "12px" }}>
            Er du sikker på at du vil utføre <strong>{actionLabel(confirmAction.action)}</strong> på denne brukaren?
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => performAction(confirmAction.action, confirmAction.userId)}
              disabled={actionLoading === confirmAction.userId}
              style={{ padding: "8px 16px", borderRadius: "8px", background: "#EF4444", color: "#fff", border: "none", fontWeight: 600, cursor: actionLoading ? "not-allowed" : "pointer" }}
            >
              {actionLoading === confirmAction.userId ? "..." : "Bekreft"}
            </button>
            <button
              onClick={() => setConfirmAction(null)}
              style={{ padding: "8px 16px", borderRadius: "8px", background: "#555", color: "#E0E0E0", border: "none", fontWeight: 600, cursor: "pointer" }}
            >
              Avbryt
            </button>
          </div>
        </div>
      )}

      {!users.length && !error && (
        <div style={{ textAlign: "center", padding: "48px 0", color: "rgba(255,255,255,0.3)" }}>
          Ingen brukarar funnen.
        </div>
      )}

      {/* Detail panel */}
      {selectedUser && (
        <div style={{ marginBottom: "24px", padding: "20px", borderRadius: "12px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#D4AF37" }}>
              Detaljar — {selectedUser.email}
            </h2>
            <button onClick={() => setSelectedUser(null)} style={{ background: "none", border: "none", color: "#E0E0E0", cursor: "pointer", fontSize: "18px" }}>✕</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", fontSize: "13px" }}>
            <div><span style={{ color: "rgba(255,255,255,0.4)" }}>ID:</span> {selectedUser.id.substring(0, 12)}...</div>
            <div><span style={{ color: "rgba(255,255,255,0.4)" }}>Status:</span> {statusBadge(selectedUser)}</div>
            <div><span style={{ color: "rgba(255,255,255,0.4)" }}>Rolle:</span> {selectedUser.role}</div>
            <div><span style={{ color: "rgba(255,255,255,0.4)" }}>Verifisert:</span> {selectedUser.verified ? 'Ja' : 'Nei'}</div>
            <div><span style={{ color: "rgba(255,255,255,0.4)" }}>Onboarding:</span> {selectedUser.onboardingComplete ? 'Fullført' : `Steg ${selectedUser.deepProfileComplete ? '9+' : selectedUser.journey?.day || '?'}`}</div>
            <div><span style={{ color: "rgba(255,255,255,0.4)" }}>Journey:</span> {selectedUser.journey ? `Dag ${selectedUser.journey.day} (${selectedUser.journey.phase})` : 'Ikkje starta'}</div>
            <div><span style={{ color: "rgba(255,255,255,0.4)" }}>Aktive matcher:</span> {selectedUser.activeMatches}</div>
            <div><span style={{ color: "rgba(255,255,255,0.4)" }}>Oppretta:</span> {new Date(selectedUser.createdAt).toLocaleDateString('nb-NO')}</div>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: "8px", marginTop: "16px", flexWrap: "wrap" }}>
            {selectedUser.bannedAt ? (
              <button
                onClick={() => setConfirmAction({ action: 'unflag', userId: selectedUser.id })}
                disabled={actionLoading === selectedUser.id}
                style={{ padding: "8px 16px", borderRadius: "8px", background: "#34D399", color: "#0A1A2A", border: "none", fontWeight: 600, cursor: actionLoading ? "not-allowed" : "pointer", fontSize: "12px" }}
              >
                Unflag
              </button>
            ) : (
              <button
                onClick={() => setConfirmAction({ action: 'flag', userId: selectedUser.id })}
                disabled={actionLoading === selectedUser.id}
                style={{ padding: "8px 16px", borderRadius: "8px", background: "#EF4444", color: "#fff", border: "none", fontWeight: 600, cursor: actionLoading ? "not-allowed" : "pointer", fontSize: "12px" }}
              >
                Flag / Bann
              </button>
            )}

            <button
              onClick={() => setConfirmAction({ action: 'reset-onboarding', userId: selectedUser.id })}
              disabled={actionLoading === selectedUser.id}
              style={{ padding: "8px 16px", borderRadius: "8px", background: "#FBBF24", color: "#0A1A2A", border: "none", fontWeight: 600, cursor: actionLoading ? "not-allowed" : "pointer", fontSize: "12px" }}
            >
              Reset Onboarding
            </button>

            <button
              onClick={() => setConfirmAction({ action: 'reset-journey', userId: selectedUser.id })}
              disabled={actionLoading === selectedUser.id}
              style={{ padding: "8px 16px", borderRadius: "8px", background: "#60A5FA", color: "#fff", border: "none", fontWeight: 600, cursor: actionLoading ? "not-allowed" : "pointer", fontSize: "12px" }}
            >
              Reset Journey
            </button>

            <button
              onClick={() => setConfirmAction({ action: 'force-match-end', userId: selectedUser.id })}
              disabled={actionLoading === selectedUser.id}
              style={{ padding: "8px 16px", borderRadius: "8px", background: "#F472B6", color: "#fff", border: "none", fontWeight: 600, cursor: actionLoading ? "not-allowed" : "pointer", fontSize: "12px" }}
            >
              Force Match End
            </button>
          </div>
        </div>
      )}

      {/* Users table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
              <th className="py-3 px-4 text-left text-xs font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>Status</th>
              <th className="py-3 px-4 text-left text-xs font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>Bruker</th>
              <th className="py-3 px-4 text-left text-xs font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>Rolle</th>
              <th className="py-3 px-4 text-left text-xs font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>Journey</th>
              <th className="py-3 px-4 text-left text-xs font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>Matcher</th>
              <th className="py-3 px-4 text-left text-xs font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>Opprettet</th>
              <th className="py-3 px-4 text-left text-xs font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>Handling</th>
            </tr>
          </thead>
          <tbody>
            {users.filter(u => {
              if (!search) return true;
              const s = search.toLowerCase();
              return (u.name || '').toLowerCase().includes(s) || u.email.toLowerCase().includes(s);
            }).map((u) => (
              <tr
                key={u.id}
                onClick={() => setSelectedUser(u)}
                className="transition-colors duration-150 cursor-pointer"
                style={{
                  background: selectedUser?.id === u.id ? 'rgba(212,175,55,0.08)' : 'transparent',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                }}
              >
                <td className="py-3 px-4">{statusBadge(u)}</td>
                <td className="py-3 px-4">
                  <div className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>{u.name || u.email}</div>
                  <div className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{u.email.substring(0, 30)}{u.email.length > 30 ? '...' : ''}</div>
                </td>
                <td className="py-3 px-4"><span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{u.role}</span></td>
                <td className="py-3 px-4">
                  {u.journey ? (
                    <span className="text-xs font-medium" style={{ color: PHASE_COLORS[u.journey.phase as keyof typeof PHASE_COLORS] || '#9CA3AF' }}>Dag {u.journey.day}</span>
                  ) : <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>—</span>}
                </td>
                <td className="py-3 px-4"><span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{u.activeMatches}</span></td>
                <td className="py-3 px-4"><span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{new Date(u.createdAt).toLocaleDateString('nb-NO')}</span></td>
                <td className="py-3 px-4">
                  {u.bannedAt && (
                    <button onClick={(e) => { e.stopPropagation(); setConfirmAction({ action: 'unflag', userId: u.id }); }} className="px-2.5 py-1 rounded-md text-[10px] font-medium" style={{ background: 'rgba(74,222,128,0.1)', color: '#34D399', border: '1px solid rgba(74,222,128,0.2)' }}>Unflag</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!users.length && (
          <div className="py-12 text-center">
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>Ingen brukere funnet</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Side {pagination.page} av {pagination.pages}</span>
          <div className="flex items-center gap-2">
            {[...Array(Math.min(pagination.pages, 5))].map((_, i) => {
              const pageNum = Math.max(1, Math.min(pagination.page - 2, pagination.pages - 4)) + i;
              if (pageNum > pagination.pages) return null;
              return (
                <button key={pageNum} onClick={() => fetchUsers(pageNum)} className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all" style={{ background: pageNum === pagination.page ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.04)', color: pageNum === pagination.page ? '#D4AF37' : 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.06)' }}>{pageNum}</button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
