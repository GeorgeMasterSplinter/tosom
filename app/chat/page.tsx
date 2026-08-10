'use client';

/**
 * ToSom — Chat Oversikt (Premium Nordic Gold 2026) ⭐
 * Viser liste over aktive samtaler.
 * Én match = én samtale.
 */

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

/* ═══════════════════════════════════════
   THEME TOKENS
   ═══════════════════════════════════════ */

const G = {
  gold: "#D4AF37",
  goldLight: "#E8C766",
  goldMuted: "rgba(212,175,55,0.2)",
  goldSoft: "rgba(212,175,55,0.08)",
  tosomBlue: "#0B1520",
  glassBg: "rgba(255,255,255,0.04)",
  glassBorder: "rgba(255,255,255,0.1)",
  textPrimary: "rgba(255,255,255,0.92)",
  textSecondary: "rgba(255,255,255,0.55)",
  textMuted: "rgba(255,255,255,0.35)",
};

interface ConversationData {
  id: string;
  partnerName: string;
  partnerAge?: number;
  partnerImageUrl?: string;
  journeyDay: number;
  mood: string;
  unreadCount: number;
  lastMessage?: string;
  lastMessageTime?: string;
}

const MOOD_EMOJI: Record<string, string> = {
  calm: "🌊",
  warm: "☀️",
  deep: "🔮",
  gentle: "🌿",
  joyful: "✨",
};

/* ═══════════════════════════════════════
   CONVERSATION ROW
   ═══════════════════════════════════════ */

function ConversationRow({ conv, onClick }: { conv: ConversationData; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 hover:brightness-110 text-left"
      style={{
        background: G.glassBg,
        border: `1px solid ${G.glassBorder}`,
      }}
    >
      {/* Avatar */}
      <div
        className="w-14 h-14 rounded-full flex-shrink-0 flex items-center justify-center text-lg font-semibold overflow-hidden"
        style={{
          background: conv.partnerImageUrl ? 'transparent' : `linear-gradient(135deg, ${G.goldSoft}, ${G.goldMuted})`,
          border: `2px solid ${G.goldMuted}`,
          color: G.gold,
        }}
      >
        {conv.partnerImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={conv.partnerImageUrl} alt={conv.partnerName} className="w-full h-full object-cover rounded-full" />
        ) : (
          conv.partnerName.charAt(0).toUpperCase()
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span style={{ color: G.textPrimary, fontWeight: 600, fontSize: '16px' }}>
            {conv.partnerName}{conv.partnerAge ? `, ${conv.partnerAge}` : ''}
          </span>
          <span style={{ color: G.gold, fontSize: '12px' }}>Dag {conv.journeyDay}/30</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Mood badge */}
          <span className="text-xs" title={conv.mood}>{MOOD_EMOJI[conv.mood] || '☀️'}</span>

          {/* Last message preview */}
          <span className="text-sm truncate flex-1" style={{ color: G.textSecondary }}>
            {conv.lastMessage || 'Start reisen med en varm melding'}
          </span>

          {/* Unread badge */}
          {conv.unreadCount > 0 && (
            <span
              className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
              style={{ background: G.gold, color: '#0B1520' }}
            >
              {conv.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

/* ═══════════════════════════════════════
   EMPTY STATE
   ═══════════════════════════════════════ */

function EmptyState() {
  const router = useRouter();

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="text-center max-w-sm">
        <div
          className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${G.gold}20, ${G.goldMuted})`,
            border: `1px solid ${G.goldMuted}`,
          }}
        >
          <span className="text-3xl">💬</span>
        </div>

        <h2 className="text-2xl font-semibold mb-3" style={{ color: G.textPrimary }}>
          Ingen aktive samtaler
        </h2>

        <p className="text-base mb-4" style={{ color: G.textSecondary }}>
          Når du blir matcha, åpner chatten seg her.
        </p>

        <p className="text-xs mb-8" style={{ color: G.textMuted }}>
          Dei beste relasjonane byrjar med eit lite steg.
        </p>

        <button
          onClick={() => router.push("/dashboard")}
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
          Gå til oversikt
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   HOVEDKOMPONENT
   ═══════════════════════════════════════ */

export default function ChatOverviewPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<ConversationData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const res = await fetch('/api/chat/conversations');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setConversations(json.data);
        }
      }
    } catch {
      console.log('Inne aktive samtaler funnet');
    } finally {
      setLoading(false);
    }
  };

  const openConversation = (id: string) => {
    router.push(`/chat/${id}`);
  };

  return (
    <div className="w-full h-screen flex items-center justify-center" style={{ background: G.tosomBlue }}>
      <div className="w-full max-w-[720px] mx-auto flex flex-col min-h-screen" style={{ paddingTop: "96px", paddingBottom: "96px" }}>
        <div className="flex-1 flex flex-col rounded-3xl overflow-hidden" style={{
          background: G.glassBg,
          border: `1px solid ${G.glassBorder}`,
          backdropFilter: "blur(20px)",
          boxShadow: "0 8px 40px rgba(0,0,0,0.35), inset 0 0 24px rgba(255,255,255,0.02)",
        }}>

          {/* HEADER */}
          <div className="flex-shrink-0 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  background: `linear-gradient(135deg, ${G.gold}, ${G.goldLight})`,
                  boxShadow: `0 0 12px ${G.goldMuted}`,
                }}
              />
              <span className="text-xs uppercase tracking-widest" style={{ color: G.textSecondary }}>
                Dine samtaler
              </span>
            </div>

            <h1 className="text-[36px] font-light leading-tight" style={{ color: G.textPrimary, letterSpacing: "-0.03em" }}>
              Chat
            </h1>
          </div>

          <div style={{ borderTop: `1px solid ${G.glassBorder}` }} />

          {/* CONTENT */}
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-white/40 animate-pulse">Laster samtaler...</div>
            </div>
          ) : conversations.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {conversations.map((conv) => (
                <ConversationRow
                  key={conv.id}
                  conv={conv}
                  onClick={() => openConversation(conv.id)}
                />
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}