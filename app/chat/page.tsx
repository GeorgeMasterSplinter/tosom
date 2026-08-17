'use client';

/**
 * Tosom — Chat Oversikt (Premium Nordic Gold 2026) ⭐
 * Viser liste over aktive samtaler.
 * Én match = én samtale.
 */

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { color } from '@/config/design-tokens';

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
        background: color.glass.bg,
        border: `1px solid ${color.glass.border}`,
      }}
    >
      {/* Avatar */}
      <div
        className="w-14 h-14 rounded-full flex-shrink-0 flex items-center justify-center text-lg font-semibold overflow-hidden"
        style={{
          background: conv.partnerImageUrl ? 'transparent' : `linear-gradient(135deg, ${color.ambient.gold.soft}, ${color.border.gold})`,
          border: `2px solid ${color.border.gold}`,
          color: color.brand.gold,
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
          <span style={{ color: color.text.primary, fontWeight: 600, fontSize: '16px' }}>
            {conv.partnerName}{conv.partnerAge ? `, ${conv.partnerAge}` : ''}
          </span>
          <span style={{ color: color.brand.gold, fontSize: '12px' }}>Dag {conv.journeyDay}/30</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Mood badge */}
          <span className="text-xs" title={conv.mood}>{MOOD_EMOJI[conv.mood] || '☀️'}</span>

          {/* Last message preview */}
          <span className="text-sm truncate flex-1" style={{ color: color.text.secondary }}>
            {conv.lastMessage || 'Start reisen med en varm melding'}
          </span>

          {/* Unread badge */}
          {conv.unreadCount > 0 && (
            <span
              className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
              style={{ background: color.brand.gold, color: color.bg.primary }}
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
            background: `linear-gradient(135deg, ${color.brand.gold}20, ${color.border.gold})`,
            border: `1px solid ${color.border.gold}`,
          }}
        >
          <span className="text-3xl">💬</span>
        </div>

        <h2 className="text-2xl font-semibold mb-3" style={{ color: color.text.primary }}>
          Ingen aktive samtaler
        </h2>

        <p className="text-base mb-4" style={{ color: color.text.secondary }}>
          Når du blir matcha, åpner chatten seg her.
        </p>

        <p className="text-xs mb-8" style={{ color: color.text.muted }}>
          De beste relasjonene begynner med et lite steg.
        </p>

        <button
          onClick={() => router.push("/dashboard")}
          className="transition-all duration-300 hover:brightness-110 active:scale-[0.98] focus:outline-none"
          style={{
            background: `linear-gradient(135deg, ${color.brand.gold}, ${color.brand['gold-hover']})`,
            color: color.bg.primary,
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
      console.log('Ingen aktive samtaler funnet');
    } finally {
      setLoading(false);
    }
  };

  const openConversation = (id: string) => {
    router.push(`/chat/${id}`);
  };

  return (
    <div className="w-full h-screen flex items-center justify-center" style={{ background: color.bg.primary }}>
      <div className="w-full max-w-[720px] mx-auto flex flex-col min-h-screen" style={{ paddingTop: "96px", paddingBottom: "96px" }}>
        <div className="flex-1 flex flex-col rounded-3xl overflow-hidden" style={{
          background: color.glass.bg,
          border: `1px solid ${color.glass.border}`,
          backdropFilter: "blur(20px)",
          boxShadow: "0 8px 40px rgba(0,0,0,0.35), inset 0 0 24px rgba(255,255,255,0.02)",
        }}>

          {/* HEADER */}
          <div className="flex-shrink-0 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  background: `linear-gradient(135deg, ${color.brand.gold}, ${color.brand['gold-hover']})`,
                  boxShadow: `0 0 12px ${color.border.gold}`,
                }}
              />
              <span className="text-xs uppercase tracking-widest" style={{ color: color.text.secondary }}>
                Dine samtaler
              </span>
            </div>

            <h1 className="text-[36px] font-light leading-tight" style={{ color: color.text.primary, letterSpacing: "-0.03em" }}>
              Chat
            </h1>
          </div>

          <div style={{ borderTop: `1px solid ${color.glass.border}` }} />

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