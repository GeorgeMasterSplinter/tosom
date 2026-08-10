"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface LogEntry {
  id: string;
  level: string;
  message: string;
  module: string;
  metadata: string | null;
  userId: string | null;
  createdAt: Date;
}

interface LogsResponse {
  success: boolean;
  data: LogEntry[];
  stats: { errorCount: number; warningCount: number; infoCount: number; total: number };
  pagination: { page: number; limit: number; total: number; pages: number };
}

const LEVEL_COLORS: Record<string, string> = {
  ERROR: "#EF4444",
  WARNING: "#FBBF24",
  INFO: "#34D399",
};

export default function AdminLogsPage() {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 50, total: 0, pages: 0 });
  const [stats, setStats] = useState({ errorCount: 0, warningCount: 0, infoCount: 0, total: 0 });
  const [error, setError] = useState<string | null>(null);
  const [filterModule, setFilterModule] = useState("");
  const [filterLevel, setFilterLevel] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);

  async function fetchLogs(page = 1) {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: String(page), limit: "50" });
      if (filterModule) params.set("module", filterModule);
      if (filterLevel) params.set("level", filterLevel);
      if (searchTerm) params.set("search", searchTerm);
      
      const res = await fetch(`/api/admin/system-logs?${params}`);
      if (!res.ok) setError(res.statusText);
      else {
        const json: LogsResponse = await res.json();
        setLogs(json.data || []);
        setPagination(json.pagination);
        setStats(json.stats);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ukjent feil");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchLogs(1); }, [filterModule, filterLevel]);

  function clearFilters() {
    setFilterModule("");
    setFilterLevel("");
    setSearchTerm("");
  }

  function parseMetadata(metadata: string | null): any {
    if (!metadata) return null;
    try {
      return JSON.parse(metadata);
    } catch {
      return metadata;
    }
  }

  if (loading && logs.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: "#0A1A2A" }}>
        <div style={{ color: "#D4AF37", fontSize: "18px" }}>Lastar inn systemloggar...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: "32px", maxWidth: "1100px", margin: "0 auto", color: "#E0E0E0" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 600, color: "#D4AF37" }}>
          System Logs Viewer
        </h1>
        <Link href="/admin/system/status" style={{ color: "#D4AF37", textDecoration: "none", fontSize: "14px" }}>
          ← Tilbake til systemstatus
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "12px", marginBottom: "24px" }}>
        <div style={{ padding: "12px", borderRadius: "12px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}>
          <div style={{ fontSize: "12px", color: "#EF4444" }}>❌ Errors</div>
          <div style={{ fontSize: "24px", fontWeight: 700, color: "#EF4444" }}>{stats.errorCount}</div>
        </div>
        <div style={{ padding: "12px", borderRadius: "12px", background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.3)" }}>
          <div style={{ fontSize: "12px", color: "#FBBF24" }}>⚠️ Warnings</div>
          <div style={{ fontSize: "24px", fontWeight: 700, color: "#FBBF24" }}>{stats.warningCount}</div>
        </div>
        <div style={{ padding: "12px", borderRadius: "12px", background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.3)" }}>
          <div style={{ fontSize: "12px", color: "#34D399" }}>ℹ️ Info</div>
          <div style={{ fontSize: "24px", fontWeight: 700, color: "#34D399" }}>{stats.infoCount}</div>
        </div>
        <div style={{ padding: "12px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>Totalt</div>
          <div style={{ fontSize: "24px", fontWeight: 700 }}>{stats.total}</div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ marginBottom: "24px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <select value={filterModule} onChange={(e) => setFilterModule(e.target.value)} style={{ padding: "8px 16px", borderRadius: "8px", background: "#0A1A2A", border: "1px solid rgba(255,255,255,0.1)", color: "#E0E0E0", fontSize: "13px" }}>
          <option value="">Alle moduler</option>
          <option value="api">API-aktivitet</option>
          <option value="admin">Admin-handlingar</option>
          <option value="onboarding">Onboarding</option>
          <option value="matching">Matching</option>
          <option value="journey">Journey</option>
          <option value="chat">Chat</option>
          <option value="payment">Betaling</option>
        </select>

        <select value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)} style={{ padding: "8px 16px", borderRadius: "8px", background: "#0A1A2A", border: "1px solid rgba(255,255,255,0.1)", color: "#E0E0E0", fontSize: "13px" }}>
          <option value="">Alle nivå</option>
          <option value="ERROR">❌ Error</option>
          <option value="WARNING">⚠️ Warning</option>
          <option value="INFO">ℹ️ Info</option>
        </select>

        <input
          type="text"
          placeholder="Søk i meldingar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onBlur={() => fetchLogs(1)}
          style={{
            flex: "1",
            minWidth: "200px",
            padding: "8px 16px",
            borderRadius: "8px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#E0E0E0",
            fontSize: "13px",
          }}
        />

        {(filterModule || filterLevel || searchTerm) && (
          <button onClick={clearFilters} style={{ padding: "8px 16px", borderRadius: "8px", background: "#555", color: "#E0E0E0", border: "none", fontWeight: 600, cursor: "pointer", fontSize: "13px" }}>
            ❌ Fjern filter
          </button>
        )}

        <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", alignSelf: "center" }}>
          Side {pagination.page}/{pagination.pages}
        </span>
      </div>

      {/* Error */}
      {error && <div style={{ padding: "12px 16px", borderRadius: "12px", background: "rgba(255,77,77,0.1)", border: "1px solid rgba(255,77,77,0.3)", color: "#FF4D4D", marginBottom: "24px" }}>⚠️ {error}</div>}

      {/* Selected log detail */}
      {selectedLog && (
        <div style={{ marginBottom: "24px", padding: "20px", borderRadius: "12px", background: `rgba(255,255,255,0.03)`, border: `1px solid ${LEVEL_COLORS[selectedLog.level] || "#9CA3AF"}33` }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 600, color: LEVEL_COLORS[selectedLog.level] || "#E0E0E0" }}>
              {selectedLog.level === "ERROR" ? "❌" : selectedLog.level === "WARNING" ? "⚠️" : "ℹ️"} {selectedLog.module}
            </h2>
            <button onClick={() => setSelectedLog(null)} style={{ background: "none", border: "none", color: "#E0E0E0", cursor: "pointer", fontSize: "18px" }}>✕</button>
          </div>

          <div style={{ display: "grid", gap: "12px", fontSize: "13px" }}>
            <div style={{ padding: "12px", borderRadius: "8px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ color: "rgba(255,255,255,0.4)", marginBottom: "4px" }}>Melding</div>
              <div style={{ color: "#E0E0E0", whiteSpace: "pre-wrap" }}>{selectedLog.message}</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              <div><span style={{ color: "rgba(255,255,255,0.4)" }}>ID:</span> {selectedLog.id.substring(0, 12)}...</div>
              <div><span style={{ color: "rgba(255,255,255,0.4)" }}>Oppretta:</span> {new Date(selectedLog.createdAt).toLocaleString("nb-NO")}</div>
              <div><span style={{ color: "rgba(255,255,255,0.4)" }}>Module:</span> {selectedLog.module}</div>
              <div><span style={{ color: "rgba(255,255,255,0.4)" }}>Brukar:</span> {selectedLog.userId?.substring(0, 12) || "—"}</div>
            </div>

            {parseMetadata(selectedLog.metadata) && typeof parseMetadata(selectedLog.metadata) === "object" && (
              <div style={{ padding: "12px", borderRadius: "8px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ color: "rgba(255,255,255,0.4)", marginBottom: "4px" }}>Metadata (JSON)</div>
                <pre style={{ fontSize: "11px", color: "#E0E0E0", overflowX: "auto", whiteSpace: "pre-wrap" }}>
                  {JSON.stringify(parseMetadata(selectedLog.metadata), null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Logs table */}
      <div style={{ display: "grid", gap: "4px" }}>
        {logs.map((log) => (
          <div
            key={log.id}
            onClick={() => setSelectedLog(log)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 16px",
              borderRadius: "8px",
              background: selectedLog?.id === log.id ? `${LEVEL_COLORS[log.level]}11` : "rgba(255,255,255,0.02)",
              border: `1px solid ${selectedLog?.id === log.id ? LEVEL_COLORS[log.level] || "#D4AF37" : "transparent"}`,
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, overflow: "hidden" }}>
              <span style={{ fontSize: "14px" }}>{log.level === "ERROR" ? "❌" : log.level === "WARNING" ? "⚠️" : "ℹ️"}</span>
              <span style={{ fontSize: "10px", fontWeight: 600, color: LEVEL_COLORS[log.level] || "#9CA3AF", minWidth: "50px" }}>{log.level}</span>
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", minWidth: "120px" }}>{log.module}</span>
              <span style={{ fontSize: "13px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{log.message}</span>
            </div>

            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", marginLeft: "12px" }}>
              {new Date(log.createdAt).toLocaleDateString("nb-NO")} {new Date(log.createdAt).toLocaleTimeString("nb-NO", { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        ))}
      </div>

      {!logs.length && !error && <div style={{ textAlign: "center", padding: "48px 0", color: "rgba(255,255,255,0.3)" }}>Ingen loggar funnen.</div>}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "24px" }}>
          {[...Array(Math.min(pagination.pages, 5))].map((_, i) => {
            const pageNum = Math.max(1, Math.min(pagination.page - 2, pagination.pages - 4)) + i;
            if (pageNum > pagination.pages) return null;
            return <button key={pageNum} onClick={() => fetchLogs(pageNum)} style={{ padding: "6px 12px", borderRadius: "8px", background: pageNum === pagination.page ? "#D4AF37" : "#555", color: pageNum === pagination.page ? "#0A1A2A" : "#E0E0E0", border: "none", fontWeight: 600, cursor: "pointer", fontSize: "12px" }}>{pageNum}</button>;
          })}
        </div>
      )}

      {/* Footer */}
      <div style={{ marginTop: "32px", padding: "16px", borderRadius: "12px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>
        💡 Klikk på ein logg for å sjå detaljar og metadata. Filter kan brukast for å finne spesifikke hendingar som API-aktivitet, admin-handlingar, onboarding, matching, journey, chat eller betaling.
      </div>
    </div>
  );
}