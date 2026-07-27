/**
 * ToSom — Chat Root Page (Premium Nordic Gold 2026) ⭐
 * Rot-side for /chat — viser aktive samtaler, match-status og "Start ny reise"-knapp
 */

"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

/* ═══════════════════════════════════════
   THEME TOKENS
   ═══════════════════════════════════════ */

const G = {
  gold: "#D4AF37",
  goldLight: "#E8C766",
  goldMuted: "rgba(212,175,55,0.2)",
  tosomBlue: "#0B1520",
  glassBg: "rgba(255,255,255,0.04)",
  glassBorder: "rgba(255,255,255,0.1)",
  textPrimary: "rgba(255,255,255,0.92)",
  textSecondary: "rgba(255,255,255,0.55)",
  textMuted: "rgba(255,255,255,0.35)",
};

/* ═══════════════════════════════════════
   PREMIUM BUTTON (gull)
   ═══════════════════════════════════════ */

function GoldButton({ children, onClick }: { children: React.ReactNode; onClick?: (e: React.MouseEvent) => void }) {
  return (
    <button
      onClick={onClick}
      className="transition-all duration-300 hover:brightness-110 active:scale-[0.98] focus:outline-none"
      style={{
        background: `linear-gradient(135deg, ${G.gold}, ${G.goldLight})`,
        color: G.tosomBlue,
        borderRadius: "12px",
        height: "48px",
        padding: "0 24px",
        fontSize: "16px",
        fontWeight: 600,
      }}
    >
      {children}
    </button>
  );
}

/* ═══════════════════════════════════════
   CONVERSATION CARD (glassmorphism)
   ═══════════════════════════════════════ */

function ConversationCard({ partner, conversationId, journeyDay }: {
  partner: { name: string; age: number; imageUrl?: string };
  conversationId: string;
  journeyDay: number;
}) {
  const router = useRouter();

  return (
    <div
      className="rounded-2xl p-6 transition-all duration-300 hover:brightness-110 cursor-pointer"
      style={{
        background: G.glassBg,
        border: `1px solid ${G.glassBorder}`,
        backdropFilter: "blur(16px)",
      }}
      onClick={() => router.push(`/chat/${conversationId}`)}
    >
      <div className="flex items-center gap-4">
        {/* Profilbilde */}
        {partner.imageUrl ? (
          <img
            src={partner.imageUrl}
            alt={partner.name}
            className="w-16 h-16 rounded-full object-cover border-2"
            style={{ border: `2px solid ${G.goldMuted}` }}
          />
        ) : (
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-semibold border-2"
            style={{
              background: `linear-gradient(135deg, ${G.gold}20, ${G.goldMuted})`,
              border: `2px solid ${G.goldMuted}`,
              color: G.gold,
            }}
          >
            {partner.name.charAt(0).toUpperCase()}
          </div>
        )}

        {/* Info */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold" style={{ color: G.textPrimary }}>
            {partner.name}
          </h3>
          <p className="text-sm" style={{ color: G.textSecondary }}>
            {partner.age} år
          </p>
        </div>

        {/* Journey status */}
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: G.gold, boxShadow: `0 0 8px ${G.goldMuted}` }}
            />
            <span className="text-xs font-medium" style={{ color: G.textSecondary }}>
              Matcha i dag
            </span>
          </div>
          <p className="text-xs" style={{ color: G.gold }}>
            Dag {journeyDay} av 30 ✨
          </p>
        </div>
      </div>

      {/* "Gå til samtalen"-knapp */}
      <div className="mt-4">
        <GoldButton onClick={(e) => { e.stopPropagation(); router.push(`/chat/${conversationId}`); }}>
          Gå til samtalen
        </GoldButton>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   EMPTY STATE (ingen matcher)
   ═══════════════════════════════════════ */

function EmptyState() {
  const router = useRouter();

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="text-center max-w-sm">
        {/* Icon */}
        <div
          className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${G.gold}20, ${G.goldMuted})`,
            border: `1px solid ${G.goldMuted}`,
          }}
        >
          <span className="text-3xl">💬</span>
        </div>

        {/* Tittel */}
        <h2 className="text-2xl font-semibold mb-3" style={{ color: G.textPrimary }}>
          Ingen aktive samtaler
        </h2>

        {/* Undertekst */}
        <p className="text-base mb-4" style={{ color: G.textSecondary }}>
          Start ein ny reise når du er klar.
        </p>

        {/* Microcopy */}
        <p className="text-xs mb-8" style={{ color: G.textMuted }}>
          Samtaler starter når ein match er klar.
        </p>

        {/* Knapp */}
        <GoldButton onClick={() => router.push("/dashboard")}>
          Start ny reise
        </GoldButton>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   SKELETON-LASTING
   ═══════════════════════════════════════ */

function SkeletonList() {
  return (
    <div className="flex-1 p-6 space-y-4">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="rounded-2xl p-6 animate-pulse"
          style={{ background: G.glassBg, border: `1px solid ${G.glassBorder}` }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-full"
              style={{ background: "rgba(255,255,255,0.1)" }}
            />
            <div className="flex-1 space-y-2">
              <div className="h-4 rounded w-1/3" style={{ background: "rgba(255,255,255,0.1)" }} />
              <div className="h-3 rounded w-1/4" style={{ background: "rgba(255,255,255,0.08)" }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════
   ERROR-STATE
   ═══════════════════════════════════════ */

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div
        className="text-center rounded-2xl p-8 max-w-sm"
        style={{ background: G.glassBg, border: "1px solid rgba(255,77,77,0.2)" }}
      >
        <p className="text-lg font-medium mb-3" style={{ color: "#FF4D4D" }}>
          Kunne ikke lasta samtalar
        </p>
        <p className="text-sm mb-4" style={{ color: G.textSecondary }}>
          {message}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 rounded-xl font-medium transition-all hover:brightness-110"
          style={{
            background: `linear-gradient(135deg, ${G.gold}, ${G.goldLight})`,
            color: G.tosomBlue,
            borderRadius: "12px",
          }}
        >
          Prøv igjen
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   HOVEDKOMPONENT — CHAT ROOT PAGE
   ═══════════════════════════════════════ */

export default function ChatRootPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hent chat-data frå API
  const fetchChats = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard/overview");
      if (!res.ok) throw new Error(`Feil: ${res.status}`);
      const data = await res.json();

      // Finn aktive conversations
      const convos = data?.conversation ? [data.conversation] : [];
      setConversations(convos);
    } catch (e) {
      console.error("Feil ved lasting av chat:", e);
      setError(e instanceof Error ? e.message : "Kunne ikke lasta samtalar");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  // 🔄 AUTOMATISK REDIRECT dersom =1 aktiv conversation
  useEffect(() => {
    if (!loading && conversations.length === 1) {
      const convId = conversations[0]?.conversationId;
      if (convId) {
        router.push(`/chat/${convId}`);
      }
    }
  }, [conversations, loading, router]);

  return (
    <div className="w-full h-screen flex items-center justify-center" style={{ background: "#0B1520" }}>
      {/* Max-width container */}
      <div className="w-full max-w-[720px] mx-auto flex flex-col min-h-screen" style={{ paddingTop: "96px", paddingBottom: "96px" }}>

        {/* Glassmorphism-main-panel */}
        <div className="flex-1 flex flex-col rounded-3xl overflow-hidden" style={{
          background: G.glassBg,
          border: `1px solid ${G.glassBorder}`,
          backdropFilter: "blur(20px)",
          boxShadow: "0 8px 40px rgba(0,0,0,0.35), inset 0 0 24px rgba(255,255,255,0.02)",
        }}>

          {/* HEADER */}
          <div className="flex-shrink-0 p-6">
            {/* Gull-bokmerke */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  background: `linear-gradient(135deg, ${G.gold}, ${G.goldLight})`,
                  boxShadow: `0 0 12px ${G.goldMuted}`,
                }}
              />
              <span className="text-xs uppercase tracking-widest" style={{ color: G.textSecondary }}>
                DINE SAMTALES
              </span>
            </div>

            {/* Overskrift */}
            <h1 className="text-[36px] font-light leading-tight" style={{ color: G.textPrimary, letterSpacing: "-0.03em" }}>
              Chat
            </h1>
          </div>

          {/* MIDLDELINJE */}
          <div style={{ borderTop: `1px solid ${G.glassBorder}` }} />

          {/* CONTENT */}
          {loading ? (
            <SkeletonList />
          ) : error ? (
            <ErrorState message={error} />
          ) : conversations.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="flex-1 overflow-y-auto p-6">
              {conversations.map((conv, idx) => (
                <ConversationCard
                  key={conv.conversationId || idx}
                  partner={conv.partner || { name: "Din match", age: 0 }}
                  conversationId={conv.conversationId}
                  journeyDay={conv.journeyDay || 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}