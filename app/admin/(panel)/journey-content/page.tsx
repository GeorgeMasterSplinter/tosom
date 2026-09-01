"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface DayContent {
  id: string;
  day: number;
  theme: string;
  phase: "EARLY" | "BUILDING_TRUST" | "DEEPER" | "CHECKIN";
  reflectionQuestion: string;
  conversationPrompt: string;
  task: string | null;
  resonanceGoal: string;
}

interface ContentListResponse {
  success: boolean;
  data: DayContent[];
  total: number;
}

const PHASE_COLORS = {
  EARLY: "#34D399",
  BUILDING_TRUST: "#60A5FA",
  DEEPER: "#F472B6",
  CHECKIN: "#A78BFA",
};

export default function JourneyContentEditor() {
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<DayContent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [editingDay, setEditingDay] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState<Partial<DayContent>>({});

  useEffect(() => {
    fetchContent();
  }, []);

  async function fetchContent() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/journey-content");
      if (!res.ok) setError(res.statusText);
      else {
        const json: ContentListResponse = await res.json();
        setContent(json.data || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ukjent feil");
    } finally {
      setLoading(false);
    }
  }

  function startEdit(day: number, item: DayContent) {
    setEditingDay(day);
    setEditForm({ ...item });
  }

  function cancelEdit() {
    setEditingDay(null);
    setEditForm({});
  }

  async function saveEdit() {
    if (!editingDay || !editForm.theme) return;
    try {
      setSaving(true);
      const res = await fetch(`/api/admin/journey-content/${editingDay}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) setError(res.statusText);
      else {
        await fetchContent(); // Refresh
        cancelEdit();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lagringsfeil");
    } finally {
      setSaving(false);
    }
  }

  const phaseIcon = (phase: string) => {
    switch (phase) {
      case "EARLY": return "🌱";
      case "BUILDING_TRUST": return "🤝";
      case "DEEPER": return "💎";
      case "CHECKIN": return "📋";
      default: return "⚪";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: "#0A1A2A" }}>
        <div style={{ color: "#D4AF37", fontSize: "18px" }}>Lastar inn journey-innhold...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: "32px", maxWidth: "1100px", margin: "0 auto", color: "#E0E0E0" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 600, color: "#D4AF37" }}>
          JourneyDayContent Editor
        </h1>
        <Link href="/admin/system/status" style={{ color: "#D4AF37", textDecoration: "none", fontSize: "14px" }}>
          ← Tilbake til systemstatus
        </Link>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "24px", flexWrap: "wrap" }}>
        {Object.entries(PHASE_COLORS).map(([phase, color]) => (
          <div key={phase} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "14px" }}>{phaseIcon(phase)}</span>
            <span style={{ fontSize: "13px", color }}>{phase}</span>
          </div>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div style={{ padding: "12px 16px", borderRadius: "12px", background: "rgba(255,77,77,0.1)", border: "1px solid rgba(255,77,77,0.3)", color: "#FF4D4D", marginBottom: "24px" }}>
          ⚠️ {error}
        </div>
      )}

      {/* Content list */}
      {!content.length && !error && (
        <div style={{ textAlign: "center", padding: "48px 0", color: "rgba(255,255,255,0.3)" }}>
          Inget journey-innhold funnet. Køyrd seed-skriptet først.
        </div>
      )}

      {/* Edit form */}
      {editingDay && editForm.theme !== undefined && (
        <div style={{ marginBottom: "24px", padding: "20px", borderRadius: "12px", background: "rgba(212,175,55,0.05)", border: "1px solid rgba(212,175,55,0.3)" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px", color: "#D4AF37" }}>
            Rediger Dag {editingDay} — "{editForm.theme}"
          </h2>

          <div style={{ display: "grid", gap: "12px" }}>
            {/* Theme */}
            <div>
              <label style={{ display: "block", marginBottom: "4px", color: "rgba(255,255,255,0.6)", fontSize: "13px" }}>
                Tema (required)
              </label>
              <input
                type="text"
                value={editForm.theme || ""}
                onChange={(e) => setEditForm({ ...editForm, theme: e.target.value })}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#E0E0E0",
                  fontSize: "14px",
                }}
              />
            </div>

            {/* Phase */}
            <div>
              <label style={{ display: "block", marginBottom: "4px", color: "rgba(255,255,255,0.6)", fontSize: "13px" }}>
                Fase
              </label>
              <select
                value={editForm.phase || "EARLY"}
                onChange={(e) => setEditForm({ ...editForm, phase: e.target.value as any })}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  background: "#0A1A2A",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#E0E0E0",
                  fontSize: "14px",
                }}
              >
                <option value="EARLY">🌱 EARLY</option>
                <option value="BUILDING_TRUST">🤝 BUILDING_TRUST</option>
                <option value="DEEPER">💎 DEEPER</option>
                <option value="CHECKIN">📋 CHECKIN</option>
              </select>
            </div>

            {/* Reflection Question */}
            <div>
              <label style={{ display: "block", marginBottom: "4px", color: "rgba(255,255,255,0.6)", fontSize: "13px" }}>
                Refleksjonsspørsmål
              </label>
              <textarea
                value={editForm.reflectionQuestion || ""}
                onChange={(e) => setEditForm({ ...editForm, reflectionQuestion: e.target.value })}
                rows={3}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#E0E0E0",
                  fontSize: "14px",
                  resize: "vertical",
                }}
              />
            </div>

            {/* Conversation Prompt */}
            <div>
              <label style={{ display: "block", marginBottom: "4px", color: "rgba(255,255,255,0.6)", fontSize: "13px" }}>
                Samtaleprompt
              </label>
              <textarea
                value={editForm.conversationPrompt || ""}
                onChange={(e) => setEditForm({ ...editForm, conversationPrompt: e.target.value })}
                rows={3}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#E0E0E0",
                  fontSize: "14px",
                  resize: "vertical",
                }}
              />
            </div>

            {/* Task */}
            <div>
              <label style={{ display: "block", marginBottom: "4px", color: "rgba(255,255,255,0.6)", fontSize: "13px" }}>
                Oppgåve (valgfritt)
              </label>
              <textarea
                value={editForm.task || ""}
                onChange={(e) => setEditForm({ ...editForm, task: e.target.value })}
                rows={2}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#E0E0E0",
                  fontSize: "14px",
                  resize: "vertical",
                }}
              />
            </div>

            {/* Resonance Goal */}
            <div>
              <label style={{ display: "block", marginBottom: "4px", color: "rgba(255,255,255,0.6)", fontSize: "13px" }}>
                Resonansmål
              </label>
              <input
                type="text"
                value={editForm.resonanceGoal || ""}
                onChange={(e) => setEditForm({ ...editForm, resonanceGoal: e.target.value })}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#E0E0E0",
                  fontSize: "14px",
                }}
              />
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={saveEdit}
                disabled={!editForm.theme || saving}
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  background: editForm.theme && !saving ? "#D4AF37" : "#555",
                  color: "#0A1A2A",
                  border: "none",
                  fontWeight: 600,
                  cursor: editForm.theme && !saving ? "pointer" : "not-allowed",
                  fontSize: "14px",
                }}
              >
                {saving ? "Lagrar..." : "Lagre endringer"}
              </button>
              <button
                onClick={cancelEdit}
                disabled={saving}
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  background: "#555",
                  color: "#E0E0E0",
                  border: "none",
                  fontWeight: 600,
                  cursor: saving ? "not-allowed" : "pointer",
                  fontSize: "14px",
                }}
              >
                Avbryt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Days table */}
      <div style={{ display: "grid", gap: "8px" }}>
        {content.map((item) => (
          <div
            key={item.id}
            onClick={() => startEdit(item.day, item)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 16px",
              borderRadius: "12px",
              background: editingDay === item.day ? "rgba(212,175,55,0.08)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${editingDay === item.day ? PHASE_COLORS[item.phase] || "#D4AF37" : "rgba(255,255,255,0.08)"}`,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontWeight: 600, fontSize: "14px", color: "#D4AF37" }}>
                Dag {item.day}
              </span>
              <span style={{ fontSize: "16px" }}>{phaseIcon(item.phase)}</span>
              <span style={{ fontSize: "14px", color: PHASE_COLORS[item.phase] || "#9CA3AF" }}>
                {item.phase}
              </span>
              <span style={{ fontWeight: 500 }}>{item.theme}</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {/* Quick stats */}
              <div style={{ display: "flex", gap: "12px", fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>
                {item.reflectionQuestion && (
                  <span title={item.reflectionQuestion}>
                    RQ: {item.reflectionQuestion.substring(0, 30)}...
                  </span>
                )}
              </div>
              <span style={{ fontSize: "12px", color: "#D4AF37" }}>✏️ Rediger</span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ marginTop: "32px", padding: "16px", borderRadius: "12px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>
        💡 Klikk på en dag for å redigere innhaldet. Endringer vert lagra direkte i databasen og verkar umiddelbart i API-et <code>/api/journey/today</code>.
      </div>
    </div>
  );
}