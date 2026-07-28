/**
 * ToSom — Admin: Flagged Conversation Detail
 * 
 * Viser detaljar for ei rapportert/konfidensiert samtale.
 * Moderatoren kan sjå innhald, historikk og gjere avgjersler.
 */

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface FlaggedConversation {
  id: string;
  conversationId: string;
  reason: string;
  flaggerRole?: string;
  flaggedAt: string;
  status: "pending" | "reviewed" | "resolved" | "dismissed" | "blocked";
  messages: Array<{
    id: string;
    role: "user" | "partner" | "system";
    content: string;
    timestamp: string;
  }>;
  participants: Array<{
    id: string;
    displayName?: string;
  }>;
  moderatorNote?: string;
  reviewedAt?: string;
  reviewerId?: string;
}

export default function FlaggedConversationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const conversationId = params?.id as string;

  const [data, setData] = useState<FlaggedConversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    if (!conversationId) return;
    fetchConversation();
  }, [conversationId]);

  async function fetchConversation() {
    try {
      const res = await fetch(`/api/admin/conversation/${conversationId}?flaggedOnly=true`);
      if (res.ok) {
        const conversationData = await res.json();
        setData(conversationData);
      }
    } catch {
      // Feil — handterast i UI
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(newStatus: FlaggedConversation["status"]) {
    if (!data || saving) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/conversation/${conversationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setData({ ...data, status: newStatus, reviewedAt: new Date().toISOString() });
      }
    } catch {
      // Silently fail — admin ser ikkje feilmelding
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-white/40 animate-pulse">Hentar rapportert samtale...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 max-w-2xl">
        <div className="flex items-center gap-4 p-5 rounded-xl mb-6" style={{ background: "rgba(255,193,7,0.06)", border: "1px solid rgba(255,193,7,0.15)" }}>
          <span className="text-xl">⚠️</span>
          <div>
            <h3 className="font-medium text-sm mb-1" style={{ color: "#FFC107" }}>Samtale ikkje funnen</h3>
            <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
              Denne samtala finst ikkje eller er allereie handsama.
            </p>
          </div>
        </div>

        <Link
          href="/admin/conversations/flagged"
          className="text-sm underline transition-colors inline-block"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          ← Tilbake til rapporterte samtalar
        </Link>
      </div>
    );
  }

  const statusColors: Record<FlaggedConversation["status"], { bg: string; border: string; text: string; label: string }> = {
    pending: { bg: "rgba(255,193,7,0.08)", border: "rgba(255,193,7,0.2)", text: "#FFC107", label: "Avventer" },
    reviewed: { bg: "rgba(33,150,243,0.08)", border: "rgba(33,150,243,0.2)", text: "#2196F3", label: "Gjennomgått" },
    resolved: { bg: "rgba(76,175,80,0.08)", border: "rgba(76,175,80,0.2)", text: "#4CAF50", label: "Løyst" },
    dismissed: { bg: "rgba(158,158,158,0.08)", border: "rgba(158,158,158,0.2)", text: "#9E9E9E", label: "Avvist" },
    blocked: { bg: "rgba(255,77,77,0.08)", border: "rgba(255,77,77,0.2)", text: "#FF4D4D", label: "Sperr" },
  };

  const currentStatus = statusColors[data.status];

  return (
    <div className="p-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link
          href="/admin/conversations/flagged"
          className="text-sm underline transition-colors flex items-center gap-1"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          ← Tilbake
        </Link>

        <span
          className="px-3 py-1.5 text-xs font-medium rounded-lg"
          style={{
            background: currentStatus.bg,
            color: currentStatus.text,
            border: `1px solid ${currentStatus.border}`,
          }}
        >
          {currentStatus.label}
        </span>
      </div>

      {/* Rapport-info */}
      <div className="p-5 rounded-xl mb-6" style={{ background: "rgba(255,77,77,0.06)", border: "1px solid rgba(255,77,77,0.12)" }}>
        <div className="flex items-start gap-3">
          <span className="text-xl flex-shrink-0">🚩</span>
          <div className="flex-1">
            <h2 className="font-medium text-sm mb-2" style={{ color: "#FF4D4D" }}>Rapportert samtale</h2>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
              <div>
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>ID:</span>
                <span className="ml-2 font-mono text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>{data.conversationId}</span>
              </div>
              <div>
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>Rapportert:</span>
                <span className="ml-2" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {new Date(data.flaggedAt).toLocaleDateString("nb-NO", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <div>
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>Grunn:</span>
                <span className="ml-2" style={{ color: "rgba(255,255,255,0.5)" }}>{data.reason}</span>
              </div>
              {data.flaggerRole && (
                <div>
                  <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>Rapportert av:</span>
                  <span className="ml-2" style={{ color: "rgba(255,255,255,0.5)" }}>{data.flaggerRole}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Deltakarar */}
      <div className="p-5 rounded-xl mb-6" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <h3 className="font-medium text-sm mb-3" style={{ color: "#FFFFFF" }}>Deltakarar</h3>
        <div className="flex gap-4">
          {data.participants.map((p) => (
            <div key={p.id} className="flex items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium" style={{ background: "rgba(212,175,55,0.1)", color: "#D4AF37" }}>
                {p.displayName ? p.displayName.charAt(0).toUpperCase() : "?"}
              </div>
              {p.displayName || `Brukar ${p.id.slice(0, 6)}`}
            </div>
          ))}
        </div>
      </div>

      {/* Meldingar */}
      <div className="mb-6">
        <h3 className="font-medium text-sm mb-4" style={{ color: "#FFFFFF" }}>
          Meldingshistorikk ({data.messages.length})
        </h3>

        {/* Filter */}
        <div className="flex gap-2 mb-4">
          {["all", "user", "partner", "system"].map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className="px-3 py-1.5 text-xs rounded-lg transition-all duration-200"
              style={{
                background: statusFilter === filter ? "rgba(212,175,55,0.12)" : "transparent",
                border: `1px solid ${statusFilter === filter ? "rgba(212,175,55,0.3)" : "rgba(255,255,255,0.06)"}`,
                color: statusFilter === filter ? "#D4AF37" : "rgba(255,255,255,0.35)",
              }}
            >
              {filter === "all" ? "Alle" : filter === "user" ? "Brukar" : filter === "partner" ? "Partner" : "System"}
            </button>
          ))}
        </div>

        {/* Message list */}
        <div className="space-y-3">
          {data.messages
            .filter((m) => statusFilter === "all" || m.role === statusFilter)
            .map((msg) => (
              <div
                key={msg.id}
                className="p-4 rounded-xl"
                style={{
                  background: msg.role === "system" ? "rgba(212,175,55,0.04)" : "rgba(255,255,255,0.02)",
                  border: `1px solid ${msg.role === "system" ? "rgba(212,175,55,0.08)" : "rgba(255,255,255,0.04)"}`,
                  marginLeft: msg.role !== "system" ? "24px" : "0",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-md"
                    style={{
                      background: msg.role === "user" ? "rgba(33,150,243,0.1)" : msg.role === "partner" ? "rgba(76,175,80,0.1)" : "rgba(212,175,55,0.1)",
                      color: msg.role === "user" ? "#2196F3" : msg.role === "partner" ? "#4CAF50" : "#D4AF37",
                    }}
                  >
                    {msg.role === "user" ? "Deg" : msg.role === "partner" ? "Partner" : "System"}
                  </span>
                  <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
                    {new Date(msg.timestamp).toLocaleString("nb-NO", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "rgba(255,255,255,0.65)" }}>
                  {msg.content}
                </p>
              </div>
            ))}
        </div>
      </div>

      {/* Moderator-handlinger */}
      <div className="p-5 rounded-xl mb-6" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <h3 className="font-medium text-sm mb-4" style={{ color: "#FFFFFF" }}>Moderatoravgjersle</h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {([
            { status: "reviewed" as const, label: "Merk som gjennomgått", icon: "📝" },
            { status: "resolved" as const, label: "Løyst — trygt", icon: "✅" },
            { status: "dismissed" as const, label: "Avvis rapport", icon: "⚪" },
            { status: "blocked" as const, label: "Sperr brukar", icon: "🔒" },
          ]).map((action) => (
            <button
              key={action.status}
              onClick={() => handleStatusChange(action.status)}
              disabled={saving || data.status === action.status}
              className="p-3 rounded-xl text-sm transition-all duration-300 flex items-center justify-center gap-2"
              style={{
                background: data.status === action.status ? "rgba(212,175,55,0.15)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${data.status === action.status ? "rgba(212,175,55,0.3)" : "rgba(255,255,255,0.06)"}`,
                color: data.status === action.status ? "#D4AF37" : saving ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.5)",
                cursor: (saving || data.status === action.status) ? "not-allowed" : "pointer",
                opacity: (saving || data.status === action.status) ? 0.5 : 1,
              }}
            >
              <span>{action.icon}</span>
              {action.label}
            </button>
          ))}
        </div>

        {data.reviewedAt && (
          <p className="text-xs mt-3" style={{ color: "rgba(255,255,255,0.25)" }}>
            Sist oppdatert: {new Date(data.reviewedAt).toLocaleString("nb-NO")}
          </p>
        )}
      </div>

      {/* Loading state */}
      {saving && (
        <div className="text-center py-4">
          <div className="w-6 h-6 rounded-full mx-auto border-2 border-[rgba(212,175,55,0.2)] border-t-[#D4AF37]" style={{ animation: "spin 1s linear infinite" }} />
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}