"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface MatchItem {
  id: string;
  userAId: string;
  userBId: string;
  status: string;
  score: number;
  normalizedScore: number;
  resonanceLevel: string;
  reviewed: boolean;
  lockedAt: Date | null;
  expiresAt: Date | null;
  createdAt: Date;
  userA: { id: string; email: string; name: string | null; role: string };
  userB: { id: string; email: string; name: string | null; role: string };
  insights: { id: string; summary: string; strengths: string; createdAt: Date } | null;
}

interface MatchesResponse {
  success: boolean;
  data: MatchItem[];
  pagination: { page: number; limit: number; total: number; pages: number };
}

interface InspectorData {
  match: any;
  userA: any;
  userB: any;
  conversation: any;
}

const LEVEL_COLORS: Record<string, string> = {
  GENTLE: "#34D399",
  MODERATE: "#60A5FA",
  STRONG: "#FBBF24",
  DEEP: "#F472B6",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "#FBBF24",
  active: "#34D399",
  matched: "#60A5FA",
  expired: "#EF4444",
  ended: "#9CA3AF",
  unmatched: "#9CA3AF",
};

export default function AdminMatchesPage() {
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedMatch, setSelectedMatch] = useState<MatchItem | null>(null);
  const [inspectorData, setInspectorData] = useState<InspectorData | null>(null);
  const [loadingInspector, setLoadingInspector] = useState(false);

  async function fetchMatches(page = 1) {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: String(page), limit: "20", ...(filterStatus && { status: filterStatus }) });
      const res = await fetch(`/api/admin/matches?${params}`);
      if (!res.ok) setError(res.statusText);
      else {
        const json: MatchesResponse = await res.json();
        setMatches(json.data || []);
        setPagination(json.pagination);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ukjent feil");
    } finally {
      setLoading(false);
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchMatches(1); }, [filterStatus]);

  async function showInspector(match: MatchItem) {
    setSelectedMatch(match);
    try {
      setLoadingInspector(true);
      const res = await fetch(`/api/admin/matches/${match.id}/inspector`);
      if (!res.ok) setError(res.statusText);
      else {
        const json = await res.json();
        setInspectorData(json.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kunne ikke hente inspeksjon");
    } finally {
      setLoadingInspector(false);
    }
  }

  const statusBadge = (status: string) => (
    <span style={{ padding: "2px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: 600, background: `${STATUS_COLORS[status] || "#9CA3AF"}22`, color: STATUS_COLORS[status] || "#9CA3AF" }}>
      {status}
    </span>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: "#0A1A2A" }}>
        <div style={{ color: "#D4AF37", fontSize: "18px" }}>Lastar inn matcher...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: "32px", maxWidth: "1100px", margin: "0 auto", color: "#E0E0E0" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 600, color: "#D4AF37" }}>
          Match Inspector
        </h1>
        <Link href="/admin/system/status" style={{ color: "#D4AF37", textDecoration: "none", fontSize: "14px" }}>
          ← Tilbake til systemstatus
        </Link>
      </div>

      {/* Filter */}
      <div style={{ marginBottom: "24px", display: "flex", gap: "12px", alignItems: "center" }}>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ padding: "8px 16px", borderRadius: "8px", background: "#0A1A2A", border: "1px solid rgba(255,255,255,0.1)", color: "#E0E0E0", fontSize: "13px" }}>
          <option value="">Alle statusar</option>
          
          <option value="active">Active</option>
          <option value="matched">Matched</option>
          <option value="expired">Expired</option>
          <option value="ended">Ended</option>
        </select>
        <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>{pagination.total} totalt · Side {pagination.page}/{pagination.pages}</span>
      </div>

      {/* Error */}
      {error && <div style={{ padding: "12px 16px", borderRadius: "12px", background: "rgba(255,77,77,0.1)", border: "1px solid rgba(255,77,77,0.3)", color: "#FF4D4D", marginBottom: "24px" }}>⚠️ {error}</div>}

      {/* Inspector panel */}
      {selectedMatch && (inspectorData || loadingInspector) && (
        <div style={{ marginBottom: "24px", padding: "20px", borderRadius: "12px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#D4AF37" }}>
              {loadingInspector ? "Lastar inspeksjon..." : `Match-inspeksjon — ${selectedMatch.id.substring(0, 12)}...`}
            </h2>
            <button onClick={() => { setSelectedMatch(null); setInspectorData(null); }} style={{ background: "none", border: "none", color: "#E0E0E0", cursor: "pointer", fontSize: "18px" }}>✕</button>
          </div>

          {inspectorData && (
            <>
              {/* Match Score */}
              <div style={{ marginBottom: "20px", padding: "16px", borderRadius: "12px", background: `${LEVEL_COLORS[inspectorData.match.resonanceLevel] || "#9CA3AF"}11`, border: `1px solid ${LEVEL_COLORS[inspectorData.match.resonanceLevel] || "#9CA3AF"}33` }}>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "#D4AF37", marginBottom: "12px" }}>📊 Match Score</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "8px", fontSize: "13px" }}>
                  <div><span style={{ color: "rgba(255,255,255,0.4)" }}>Score:</span> {inspectorData.match.score}</div>
                  <div><span style={{ color: "rgba(255,255,255,0.4)" }}>Normalized:</span> {inspectorData.match.normalizedScore.toFixed(2)}</div>
                  <div><span style={{ color: "rgba(255,255,255,0.4)" }}>Resonance:</span> <span style={{ color: LEVEL_COLORS[inspectorData.match.resonanceLevel] || "#9CA3AF" }}>{inspectorData.match.resonanceLevel}</span></div>
                  <div><span style={{ color: "rgba(255,255,255,0.4)" }}>Status:</span> {statusBadge(inspectorData.match.status)}</div>
                </div>
              </div>

              {/* Users */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                {([inspectorData.userA, inspectorData.userB] as any[]).map((u, i) => (
                  <div key={i} style={{ padding: "12px", borderRadius: "8px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "8px", color: i === 0 ? "#34D399" : "#60A5FA" }}>Bruker {i + 1}</div>
                    <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>{u.name || u.email}</div>
                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", marginBottom: "4px" }}>{u.email}</div>
                    {u.journey ? (
                      <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>Journey: Dag {u.journey.day} ({u.journey.phase}) · {u.journey.completedDays} dager fullførte</div>
                    ) : <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>Ingen journey</div>}
                  </div>
                ))}
              </div>

              {/* Insights */}
              {inspectorData.match.insights && inspectorData.match.insights.length > 0 && (
                <div style={{ marginBottom: "20px", padding: "12px", borderRadius: "8px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#D4AF37", marginBottom: "8px" }}>💡 Match Insight</div>
                  {inspectorData.match.insights.map((ins: any) => (
                    <div key={ins.id} style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", marginBottom: "4px" }}>
                      <strong>Summary:</strong> {ins.summary}
                    </div>
                  ))}
                </div>
              )}

              {/* Conversation */}
              {inspectorData.conversation && (
                <div style={{ padding: "12px", borderRadius: "8px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#D4AF37", marginBottom: "8px" }}>💬 Conversation</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "8px", fontSize: "12px" }}>
                    <div><span style={{ color: "rgba(255,255,255,0.4)" }}>Status:</span> {inspectorData.conversation.frozenAt ? "🔴 Fryst" : inspectorData.conversation.endedAt ? "⚫ Endeleg" : "🟢 Aktiv"}</div>
                    <div><span style={{ color: "rgba(255,255,255,0.4)" }}>Meldinger:</span> {inspectorData.conversation.messageCount}</div>
                    <div><span style={{ color: "rgba(255,255,255,0.4)" }}>Resonans-sesjonar:</span> {inspectorData.conversation.totalResonanceSessions}</div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Matches table */}
      <div style={{ display: "grid", gap: "8px" }}>
        {matches.map((m) => (
          <div key={m.id} onClick={() => showInspector(m)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderRadius: "12px", background: selectedMatch?.id === m.id ? "rgba(212,175,55,0.08)" : "rgba(255,255,255,0.03)", border: `1px solid ${selectedMatch?.id === m.id ? "#D4AF37" : "rgba(255,255,255,0.08)"}`, cursor: "pointer" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", flex: 1 }}>
              {statusBadge(m.status)}
              <span style={{ fontSize: "14px", fontWeight: 500, color: LEVEL_COLORS[m.resonanceLevel] || "#9CA3AF" }}>{m.resonanceLevel}</span>
              <div>
                <div style={{ fontSize: "14px" }}>
                  {m.userA.name || m.userA.email?.substring(0, 15)}
                  <span style={{ color: "rgba(255,255,255,0.3)" }}>{' ↔ '}</span>
                  {m.userB.name || m.userB.email?.substring(0, 15)}
                </div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>Score: {m.score} · {m.normalizedScore.toFixed(2)} · Oppretta {new Date(m.createdAt).toLocaleDateString("nb-NO")}</div>
              </div>
            </div>
            <span style={{ fontSize: "12px", color: "#D4AF37" }}>🔍 Inspekter</span>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "24px" }}>
          {[...Array(Math.min(pagination.pages, 5))].map((_, i) => {
            const pageNum = Math.max(1, Math.min(pagination.page - 2, pagination.pages - 4)) + i;
            if (pageNum > pagination.pages) return null;
            return <button key={pageNum} onClick={() => fetchMatches(pageNum)} style={{ padding: "6px 12px", borderRadius: "8px", background: pageNum === pagination.page ? "#D4AF37" : "#555", color: pageNum === pagination.page ? "#0A1A2A" : "#E0E0E0", border: "none", fontWeight: 600, cursor: "pointer", fontSize: "12px" }}>{pageNum}</button>;
          })}
        </div>
      )}

      {!matches.length && !error && <div style={{ textAlign: "center", padding: "48px 0", color: "rgba(255,255,255,0.3)" }}>Ingen matcher funnet.</div>}

      {/* Footer */}
      <div style={{ marginTop: "32px", padding: "16px", borderRadius: "12px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>
        💡 Klikk på en match for å se full inspeksjon med score, resonans, journey, conversation og insight-data.
      </div>
    </div>
  );
}