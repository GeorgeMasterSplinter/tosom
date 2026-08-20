"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface UserShort {
  id: string;
  email: string;
  name: string | null;
  role: string;
}

interface ConversationItem {
  id: string;
  userAId: string;
  userBId: string;
  matchId: string | null;
  frozenAt: Date | null;
  frozenBy: string | null;
  endedAt: Date | null;
  lastMessageAt: Date | null;
  createdAt: Date;
  imageShared: boolean;
  imageShareAllowedAt: Date | null;
  userA: UserShort;
  userB: UserShort;
  match: { score: number; status: string } | null;
}

interface ConversationsResponse {
  success: boolean;
  data: ConversationItem[];
  pagination: { page: number; limit: number; total: number; pages: number };
}

export default function AdminConversationsPage() {
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });
  const [error, setError] = useState<string | null>(null);
  const [frozenOnly, setFrozenOnly] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<ConversationItem | null>(null);

  async function fetchConversations(page = 1) {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: String(page),
        limit: "20",
        frozenOnly: frozenOnly ? "true" : "false",
      });
      const res = await fetch(`/api/admin/conversations?${params}`);
      if (!res.ok) setError(res.statusText);
      else {
        const json: ConversationsResponse = await res.json();
        setConversations(json.data || []);
        setPagination(json.pagination);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ukjent feil");
    } finally {
      setLoading(false);
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchConversations(1); }, [frozenOnly]);

  async function toggleFreeze(conv: ConversationItem) {
    try {
      setActionLoading(conv.id);
      const endpoint = conv.frozenAt ? "/unlock" : "/freeze";
      const res = await fetch(`/api/admin/conversation/${conv.id}${endpoint}`, { method: "POST" });
      if (!res.ok) setError(res.statusText);
      else fetchConversations(pagination.page);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Handlinga feila");
    } finally {
      setActionLoading(null);
    }
  }

  const statusBadge = (conv: ConversationItem) => {
    if (conv.frozenAt) {
      return <span title={`Fryst ${new Date(conv.frozenAt).toLocaleString('nb-NO')}`}>🔴 Fryst</span>;
    }
    if (conv.endedAt) {
      return <span>⚫ Endeleg</span>;
    }
    return <span>🟢 Aktiv</span>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: "#0A1A2A" }}>
        <div style={{ color: "#D4AF37", fontSize: "18px" }}>Lastar inn conversations...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: "32px", maxWidth: "1100px", margin: "0 auto", color: "#E0E0E0" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 600, color: "#D4AF37" }}>
          Conversations Inspector
        </h1>
        <Link href="/admin/system/status" style={{ color: "#D4AF37", textDecoration: "none", fontSize: "14px" }}>
          ← Tilbake til systemstatus
        </Link>
      </div>

      {/* Frozen-only toggle */}
      <div style={{ marginBottom: "24px", display: "flex", alignItems: "center", gap: "12px" }}>
        <button
          onClick={() => setFrozenOnly(!frozenOnly)}
          style={{
            padding: "8px 16px",
            borderRadius: "8px",
            background: frozenOnly ? "#EF4444" : "#555",
            color: "#E0E0E0",
            border: "none",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: "13px",
          }}
        >
          {frozenOnly ? "🔴 Vis bare fryste" : "⚪ Vis alle"}
        </button>
        <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>
          {pagination.total} totalt · Side {pagination.page}/{pagination.pages}
        </span>
      </div>

      {/* Error */}
      {error && (
        <div style={{ padding: "12px 16px", borderRadius: "12px", background: "rgba(255,77,77,0.1)", border: "1px solid rgba(255,77,77,0.3)", color: "#FF4D4D", marginBottom: "24px" }}>
          ⚠️ {error}
        </div>
      )}

      {!conversations.length && !error && (
        <div style={{ textAlign: "center", padding: "48px 0", color: "rgba(255,255,255,0.3)" }}>
          Ingen conversations funnet.
        </div>
      )}

      {/* Detail panel */}
      {selectedConversation && (
        <div style={{ marginBottom: "24px", padding: "20px", borderRadius: "12px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#D4AF37" }}>
              Detaljar — {selectedConversation.id.substring(0, 12)}...
            </h2>
            <button onClick={() => setSelectedConversation(null)} style={{ background: "none", border: "none", color: "#E0E0E0", cursor: "pointer", fontSize: "18px" }}>✕</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "13px" }}>
            <div><span style={{ color: "rgba(255,255,255,0.4)" }}>Brukar A:</span> {selectedConversation.userA.name || selectedConversation.userA.email}</div>
            <div><span style={{ color: "rgba(255,255,255,0.4)" }}>Brukar B:</span> {selectedConversation.userB.name || selectedConversation.userB.email}</div>
            <div><span style={{ color: "rgba(255,255,255,0.4)" }}>Match score:</span> {selectedConversation.match?.score ?? '—'}</div>
            <div><span style={{ color: "rgba(255,255,255,0.4)" }}>Status:</span> {statusBadge(selectedConversation)}</div>
            <div><span style={{ color: "rgba(255,255,255,0.4)" }}>Oppretta:</span> {new Date(selectedConversation.createdAt).toLocaleString('nb-NO')}</div>
            <div><span style={{ color: "rgba(255,255,255,0.4)" }}>Bilete delt:</span> {selectedConversation.imageShared ? 'Ja' : 'Nei'}</div>
          </div>
        </div>
      )}

      {/* Conversations table */}
      <div style={{ display: "grid", gap: "8px" }}>
        {conversations.map((conv) => (
          <div
            key={conv.id}
            onClick={() => setSelectedConversation(conv)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 16px",
              borderRadius: "12px",
              background: selectedConversation?.id === conv.id ? "rgba(212,175,55,0.08)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${selectedConversation?.id === conv.id ? "#D4AF37" : "rgba(255,255,255,0.08)"}`,
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px", flex: 1 }}>
              {statusBadge(conv)}
              <div>
                <div style={{ fontSize: "14px", fontWeight: 500 }}>
                  {conv.userA.name || conv.userA.email?.substring(0, 20)}
                  <span style={{ color: "rgba(255,255,255,0.3)" }}>{' ↔ '}</span>
                  {conv.userB.name || conv.userB.email?.substring(0, 20)}
                </div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>
                  {conv.id.substring(0, 12)}... · Match: {conv.match?.score ?? '—'} · Oppretta {new Date(conv.createdAt).toLocaleDateString('nb-NO')}
                </div>
              </div>
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); toggleFreeze(conv); }}
              disabled={actionLoading === conv.id}
              style={{
                padding: "6px 12px",
                borderRadius: "8px",
                background: conv.frozenAt ? "#34D399" : "#EF4444",
                color: "#0A1A2A",
                border: "none",
                fontWeight: 600,
                cursor: actionLoading === conv.id ? "not-allowed" : "pointer",
                fontSize: "12px",
                minWidth: "80px",
              }}
            >
              {actionLoading === conv.id ? "..." : conv.frozenAt ? "Lås opp" : "Fryst"}
            </button>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "24px" }}>
          {[...Array(Math.min(pagination.pages, 5))].map((_, i) => {
            const pageNum = Math.max(1, Math.min(pagination.page - 2, pagination.pages - 4)) + i;
            if (pageNum > pagination.pages) return null;
            return (
              <button
                key={pageNum}
                onClick={() => fetchConversations(pageNum)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "8px",
                  background: pageNum === pagination.page ? "#D4AF37" : "#555",
                  color: pageNum === pagination.page ? "#0A1A2A" : "#E0E0E0",
                  border: "none",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                {pageNum}
              </button>
            );
          })}
        </div>
      )}

      {/* Footer */}
      <div style={{ marginTop: "32px", padding: "16px", borderRadius: "12px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>
        💡 Klikk på ein conversation for å se detaljar. Fryst/ås opp-logg vert lagret i SystemLog under modulen <code>admin/conversation-freeze</code> og <code>admin/conversation-unlock</code>.
      </div>
    </div>
  );
}