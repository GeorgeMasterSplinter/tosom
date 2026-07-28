/**
 * ToSom — Admin: Flagged Conversations List
 * 
 * Viser berre samtalar som er rapporterte/konfidensierte.
 * Hentar data frå /api/admin/conversation med flag-filter.
 */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface FlaggedItem {
  id: string;
  conversationId: string;
  reason: string;
  flaggerRole?: string;
  flaggedAt: string;
  status: "pending" | "reviewed" | "resolved" | "dismissed";
  messageCount: number;
}

export default function AdminFlaggedConversationsPage() {
  const [items, setItems] = useState<FlaggedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    fetchFlagged();
  }, []);

  async function fetchFlagged() {
    try {
      // Hentar flaggede samtalar frå API-et (fallback: client-side filtrering)
      const res = await fetch("/api/admin/conversation?flaggedOnly=true");
      if (res.ok) {
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      }
    } catch {
      // Fallback: prøv å hente alle og filtrer client-side
      try {
        const res2 = await fetch("/api/admin/conversation");
        if (res2.ok) {
          const data2 = await res2.json();
          const flaggedOnly = Array.isArray(data2)
            ? data2.filter((c: any) => c.flagged === true || c.status !== "clean")
            : [];
          setItems(flaggedOnly);
        }
      } catch {
        // Ingen data tilgjengeleg
        setItems([]);
      }
    } finally {
      setLoading(false);
    }
  }

  const filtered = items.filter((item) => filterStatus === "all" || item.status === filterStatus);
  const pendingCount = items.filter((i) => i.status === "pending").length;

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-white/40 animate-pulse">Hentar rapporterte samtalar...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold text-white">Rapporterte samtalar</h1>
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
            {pendingCount > 0 && (
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-yellow-400" />
                <span style={{ color: "#FFC107" }}>{pendingCount} avventer</span>
              </span>
            )}
          </p>
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          {(["all", "pending", "reviewed", "resolved", "dismissed"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className="px-3 py-1.5 text-xs rounded-lg transition-all duration-200"
              style={{
                background: filterStatus === status ? "rgba(212,175,55,0.12)" : "transparent",
                border: `1px solid ${filterStatus === status ? "rgba(212,175,55,0.3)" : "rgba(255,255,255,0.06)"}`,
                color: filterStatus === status ? "#D4AF37" : "rgba(255,255,255,0.35)",
              }}
            >
              {status === "all" ? "Alle" : status === "pending" ? "Avventer" : status === "reviewed" ? "Gjennomgått" : status === "resolved" ? "Løyst" : "Avvist"}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((item) => {
            const statusColors: Record<FlaggedItem["status"], { bg: string; border: string; text: string; label: string }> = {
              pending: { bg: "rgba(255,193,7,0.08)", border: "rgba(255,193,7,0.2)", text: "#FFC107", label: "Avventer" },
              reviewed: { bg: "rgba(33,150,243,0.08)", border: "rgba(33,150,243,0.2)", text: "#2196F3", label: "Gjennomgått" },
              resolved: { bg: "rgba(76,175,80,0.08)", border: "rgba(76,175,80,0.2)", text: "#4CAF50", label: "Løyst" },
              dismissed: { bg: "rgba(158,158,158,0.08)", border: "rgba(158,158,158,0.2)", text: "#9E9E9E", label: "Avvist" },
            };

            const sc = statusColors[item.status];

            return (
              <Link
                key={item.id}
                href={`/admin/conversations/flagged/${item.conversationId}`}
                className="block p-4 rounded-xl transition-all duration-200 group hover:scale-[1.005]"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                        {item.conversationId}
                      </span>
                      <span
                        className="text-xs font-medium px-2 py-0.5 rounded-md flex-shrink-0"
                        style={{
                          background: sc.bg,
                          color: sc.text,
                          border: `1px solid ${sc.border}`,
                        }}
                      >
                        {sc.label}
                      </span>
                    </div>
                    <p className="text-sm mb-1" style={{ color: "rgba(255,255,255,0.6)" }}>
                      {item.reason}
                    </p>
                    <div className="flex items-center gap-4 text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                      <span>{new Date(item.flaggedAt).toLocaleString("nb-NO", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                      {item.flaggerRole && <span>Rapportert av: {item.flaggerRole}</span>}
                      <span>{item.messageCount} meldingar</span>
                    </div>
                  </div>

                  {/* Arrow */}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <path d="M6 4L10 8L6 12" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <span className="text-3xl block mb-4">📋</span>
          <p className="text-sm mb-2" style={{ color: "rgba(255,255,255,0.5)" }}>
            {filterStatus === "all"
              ? "Ingen rapporterte samtalar funnen"
              : `Ingen samtalar med status "${filterStatus}"`}
          </p>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
            Rapporterte samtalar vil dukke opp her automatisk.
          </p>
        </div>
      )}
    </div>
  );
}