/**
 * ToSom — ChatContainer (Premium Nordic Gold 2026) ⭐🟡
 * Heilt ny versjon: roleg, lett og premium.
 * Premium bubble-animasjonar + resonance-glow + mood-engine + partner presence.
 * Integrerer ChatHeader og BliKjentPanel.
 *
 * MERK: Dev-mode med mock-data er flytta til /chat/dev
 * ═══════════════════════════════════════ */

"use client";

import Image from 'next/image';
import { useState, useRef, useEffect } from "react";
import { useChat } from "@/app/chat/context/ChatContext";
import { MessageBubble, MessageBubbleStyles } from "@/app/chat/components/MessageBubble";
import { ChatHeader } from "@/app/chat/components/ChatHeader";
import { BliKjentPanel } from "@/app/chat/components/BliKjentPanel";
import { useChatScroll } from "@/components/chat/useChatScroll";
import { usePresence } from "@/hooks/usePresence";

/* ═══════════════════════════════════════
    PRESENCE INDICATOR — Grøn dot + typing
    ═══════════════════════════════════════ */

function PresenceIndicator({ partnerId, partnerName }: { 
  partnerId: string | null; 
  partnerName?: string;
}) {
  const { isOnline, isTyping } = usePresence(partnerId);
  
  if (!partnerId) return null;

  return (
    <div className="flex items-center gap-2 ml-3">
      {/* Online dot */}
      <div className="relative flex items-center justify-center">
        <div 
          className="w-2.5 h-2.5 rounded-full transition-all duration-300"
          style={{ 
            background: isOnline ? '#34D399' : '#6B7280',
            boxShadow: isOnline ? '0 0 8px rgba(52,211,153,0.5)' : 'none',
          }}
        />
        {/* Pulse animation for online */}
        {isOnline && (
          <div 
            className="absolute inset-0 rounded-full animate-ping"
            style={{ 
              background: 'rgba(52,211,153,0.3)',
              animationDuration: '2s',
            }}
          />
        )}
      </div>
      
      {/* Status text */}
      {(isOnline || isTyping) && (
        <span 
          className="text-xs italic transition-all duration-300"
          style={{ color: isTyping ? '#D4AF37' : 'rgba(255,255,255,0.5)' }}
        >
          {isTyping ? 'Skriver...' : isOnline ? 'Online' : ''}
        </span>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
    TYPING INDICATOR — Dobbelt-typing boble
    ═══════════════════════════════════════ */

function TypingIndicator() {
  return (
    <div className="flex justify-start py-3 px-6">
      <div
        className="rounded-2xl px-5 py-3"
        style={{ background: G.glassBg, border: `1px solid ${G.glassBorder}` }}
      >
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{
                background: G.textSecondary,
                animation: "typingBounce 1.4s ease-in-out 0.3s infinite",
              }}
            />
          ))}
        </div>
      </div>
      <style jsx>{`
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════
    MOOD SELECTOR — Små tags under header
    ═══════════════════════════════════════ */

function MoodSelector({ 
  mood, 
  setMood 
}: { 
  mood: string; 
  setMood: (m: string) => void;
}) {
  return (
    <div className="flex w-full gap-0">
      {moodOrder.map((key) => {
        const isActive = mood === key;
        const palette = moodPalettes[key];
        return (
          <button
            key={key}
            onClick={() => setMood(key)}
            className="flex-1 py-4 px-2 rounded-none font-semibold transition-all duration-300 flex flex-col items-center justify-center gap-1.5 border-r last:border-r-0"
            style={{
              background: isActive
                ? `linear-gradient(135deg, ${G.gold}, ${G.goldLight})`
                : "rgba(255,255,255,0.04)",
              color: isActive ? G.bgPrimary : G.textPrimary,
              borderRight: `1px solid ${G.glassBorder}`,
            }}
          >
            <span className="text-5xl leading-none">{palette.emoji}</span>
            <span className="text-xs font-semibold tracking-wide">{palette.name}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════
    THEME TOKENS — PREMIUM GLASS V2
    ═══════════════════════════════════════ */

const G = {
  gold: "#D4AF37",
  goldLight: "#E8C766",
  goldMuted: "rgba(212,175,55,0.2)",
  goldSoft: "rgba(212,175,55,0.08)",
  glassBg: "rgba(255,255,255,0.03)",
  glassBgHover: "rgba(255,255,255,0.06)",
  glassBorder: "rgba(255,255,255,0.06)",
  glassBorderGold: "rgba(212,175,55,0.25)",
  bgPrimary: "#0B1520",
  bgChat: "#0F1A26",
  textPrimary: "rgba(255,255,255,0.92)",
  textSecondary: "rgba(255,255,255,0.55)",
  textMuted: "rgba(255,255,255,0.35)",
  dangerRed: "#FF4D4D",
};

/* ═══════════════════════════════════════
    MOOD GRADIENTS — Bakgrunn for chat-rommet
    ═══════════════════════════════════════ */

const moodGradients: Record<string, string> = {
  calm: "linear-gradient(135deg, rgba(10,26,58,0.5), rgba(11,21,32,0.7))",
  warm: "linear-gradient(135deg, rgba(212,175,55,0.08), rgba(15,26,38,0.6))",
  deep: "linear-gradient(135deg, rgba(49,10,101,0.35), rgba(11,21,32,0.7))",
  gentle: "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(11,21,32,0.6))",
  joyful: "linear-gradient(135deg, rgba(245,158,11,0.1), rgba(11,21,32,0.6))",
};

/* ═══════════════════════════════════════
    MOOD — Fargepalett for bobler og UI
    ═══════════════════════════════════════ */

interface MoodPalette {
  name: string;
  emoji: string;
  bubbleMeStart: string;
  bubbleMeEnd: string;
  bubblePartnerBg: string;
  inputGlow: string;
}

const moodPalettes: Record<string, MoodPalette> = {
  calm: {
    name: "Calm",
    emoji: "🌊",
    bubbleMeStart: "rgba(30,58,138,0.2)",
    bubbleMeEnd: "rgba(59,130,246,0.08)",
    bubblePartnerBg: "rgba(10,26,58,0.3)",
    inputGlow: "rgba(59,130,246,0.25)",
  },
  warm: {
    name: "Warm",
    emoji: "☀️",
    bubbleMeStart: "rgba(212,175,55,0.18)",
    bubbleMeEnd: "rgba(212,175,55,0.06)",
    bubblePartnerBg: "rgba(255,255,255,0.04)",
    inputGlow: "rgba(212,175,55,0.25)",
  },
  deep: {
    name: "Deep",
    emoji: "🔮",
    bubbleMeStart: "rgba(88,28,135,0.18)",
    bubbleMeEnd: "rgba(88,28,135,0.06)",
    bubblePartnerBg: "rgba(49,10,101,0.15)",
    inputGlow: "rgba(139,92,246,0.25)",
  },
  gentle: {
    name: "Gentle",
    emoji: "🌿",
    bubbleMeStart: "rgba(16,185,129,0.15)",
    bubbleMeEnd: "rgba(16,185,129,0.05)",
    bubblePartnerBg: "rgba(16,185,129,0.06)",
    inputGlow: "rgba(16,185,129,0.25)",
  },
  joyful: {
    name: "Joyful",
    emoji: "✨",
    bubbleMeStart: "rgba(245,158,11,0.15)",
    bubbleMeEnd: "rgba(245,158,11,0.05)",
    bubblePartnerBg: "rgba(245,158,11,0.06)",
    inputGlow: "rgba(245,158,11,0.25)",
  },
};

const moodOrder = ["calm", "warm", "deep", "gentle", "joyful"] as const;

/* ═══════════════════════════════════════
   MESSAGE LIST — PREMIUM MED ANIMASJONAR
   ═══════════════════════════════════════ */

function MessageList({ partner, journeyDay }: {
  partner?: { name: string; imageUrl?: string; id?: string };
  journeyDay?: number;
}) {
  const { messages: ctxMessages, loading, error } = useChat();
  const allMessages = ctxMessages;

  // Scroll-manager
  const scrollResult = useChatScroll(allMessages.length);
  const scrollRef = scrollResult.scrollRef;

  // SKELETON-LASTING
  if (loading && allMessages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto p-6 space-y-4" ref={scrollRef} style={{
        scrollbarWidth: 'thin',
        scrollbarColor: `${G.goldMuted} transparent`,
      }}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-[20px] px-5 py-4 animate-pulse" style={{
            background: G.glassBg,
            border: `1px solid ${G.glassBorder}`,
            width: i % 2 === 0 ? "75%" : "60%",
            marginLeft: i % 2 === 0 ? "auto" : undefined
          }} />
        ))}
      </div>
    );
  }

  // EMPTY-STATE
  if (allMessages.length === 0 && !error) {
    return (
      <div className="flex-1 overflow-y-auto p-6 flex items-center justify-center" ref={scrollRef}>
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${G.goldSoft}, ${G.goldMuted})`, border: `1px solid ${G.goldMuted}` }}>
            <span className="text-2xl">💬</span>
          </div>
          <p className="text-lg font-medium mb-2" style={{ color: G.textPrimary }}>Start reisen med en varm melding</p>
          <p className="text-sm" style={{ color: G.textSecondary }}>Dei beste relasjonane byrjar med eit lite steg.</p>
        </div>
      </div>
    );
  }

  // ERROR-STATE
  if (error && allMessages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto p-6 flex items-center justify-center" ref={scrollRef}>
        <div className="text-center rounded-[20px] p-8 max-w-sm" style={{ background: G.glassBg, border: "1px solid rgba(255,77,77,0.15)" }}>
          <p className="text-lg font-medium mb-3" style={{ color: G.dangerRed }}>Kunne ikke laste samtalen</p>
          <p className="text-sm mb-4" style={{ color: G.textSecondary }}>{error}</p>
          <button onClick={() => window.location.reload()} className="px-6 py-3 rounded-xl font-medium transition-all hover:brightness-110" style={{ background: `linear-gradient(135deg, ${G.gold}, ${G.goldLight})`, color: G.bgPrimary, borderRadius: "12px" }}>Prøv igjen</button>
        </div>
      </div>
    );
  }

  // MELDINGAR — premium med warm-glow animasjon + mood-bakgrunn
  return (
    <div
      ref={scrollRef}
      className="px-6 mood-background"
      style={{
        scrollbarWidth: 'thin',
        scrollbarColor: `${G.goldMuted} transparent`,
        backgroundImage: 'none',
        backgroundSize: 'cover',
        transition: 'background-image 1.5s ease-in-out',
      }}
    >
      {allMessages.map((msg) => (
        <MessageBubble key={msg.id} message={msg as any} />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════
   CHAT INPUT — Premium med typing-indikator
   ═══════════════════════════════════════ */

function ChatInput({ 
  imageShareAllowed, 
  conversationId,
  senderId,
  partnerId,
}: {
  imageShareAllowed: boolean;
  conversationId?: string | null;
  senderId?: string;
  partnerId?: string | null;
}) {
  const { sendMessage } = useChat();
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-save height
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 120) + "px";
    }
  }, [text]);

  // Typing indicator — send presence update
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    
    // Signal typing to server
    if (partnerId) {
      fetch('/api/presence/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isTyping: true }),
      }).catch(() => {});

      // Clear previous timeout and set new one
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
        fetch('/api/presence/update', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isTyping: false }),
        }).catch(() => {});
      }, 3000);
    }
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const handleSend = async () => {
    if (!text.trim() || sending) return;
    
    // Clear typing when sending
    if (partnerId) {
      fetch('/api/presence/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isTyping: false }),
      }).catch(() => {});
    }

    setSending(true);
    try {
      await sendMessage(text.trim(), "text");
      setText("");
      inputRef.current?.focus();
    } catch (e) {
      console.error("Feil ved sending:", e);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !conversationId || !senderId) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('conversationId', conversationId);
      formData.append('senderId', senderId);

      const res = await fetch('/api/chat/image', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        console.error('Bilete-opplasting feila:', err);
        return;
      }

      const data = await res.json();
      await sendMessage(data.imageUrl, "image");
    } catch (error) {
      console.error('Bilete-opplasting feil:', error);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div 
      className="px-4 py-3.5 sm:px-6"
      style={{ 
        borderTop: `1px solid ${G.glassBorderGold}`,
        background: `linear-gradient(0deg, rgba(11,21,32,0.8) 0%, rgba(11,21,32,0.4) 100%)`,
      }}
    >
      {/* Premium glass-container for input */}
      <div 
        className="flex items-end gap-2.5 rounded-2xl p-3 transition-all duration-300"
        style={{
          background: isFocused 
            ? `linear-gradient(135deg, rgba(212,175,55,0.06), rgba(212,175,55,0.02))`
            : `linear-gradient(135deg, ${G.glassBg}, rgba(255,255,255,0.01))`,
          border: `1px solid ${isFocused ? G.goldMuted : G.glassBorder}`,
          boxShadow: isFocused 
            ? `0 0 20px ${G.goldSoft}, 0 4px 16px rgba(0,0,0,0.1)`
            : '0 2px 8px rgba(0,0,0,0.05)',
        }}
      >
        {/* Kamera-ikon — Premium glass-knapp */}
        {imageShareAllowed && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageUpload}
              className="hidden"
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:brightness-125 active:scale-90 disabled:opacity-40" 
              style={{ 
                color: G.gold,
                background: G.glassBg,
                border: `1px solid ${G.glassBorder}`,
              }} 
              title={uploading ? "Lagar bilete..." : "Send bilde"}
            >
              {uploading ? (
                <span className="text-xs" style={{ animation: 'spin 1s linear infinite' }}>⏳</span>
              ) : (
                '📷'
              )}
            </button>
          </>
        )}

        {/* Input — Glass-stil med gull-focus */}
        <textarea
          ref={inputRef}
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Skriv ei melding…"
          rows={1}
          className="flex-1 resize-none bg-transparent outline-none text-sm leading-relaxed py-1.5"
          style={{ 
            color: G.textPrimary,
            caretColor: G.gold,
          }}
        />

        {/* Snøggval-knapp for "Bli kjent" */}
        {!text.trim() && (
          <button
            className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 hover:brightness-125 active:scale-90"
            style={{
              color: G.textMuted,
              background: 'transparent',
            }}
            title="Bli kjent — guidede spørsmål"
            onClick={() => {
              // Trigger BliKjentPanel — handled in parent
            }}
          >
            📖
          </button>
        )}

        {/* Send-knapp — Premium gull-gradient sirkel */}
        <button
          onClick={handleSend}
          disabled={!text.trim() || sending}
          className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
          style={{
            background: text.trim() 
              ? `linear-gradient(135deg, ${G.gold}, ${G.goldLight})`
              : G.glassBg,
            boxShadow: text.trim() 
              ? `0 4px 16px ${G.goldMuted}`
              : 'none',
          }}
        >
          {sending ? (
            <span className="text-sm" style={{ animation: 'spin 1s linear infinite' }}>⏳</span>
          ) : (
            <span 
              className="text-base transition-transform duration-200"
              style={{ transform: text.trim() ? 'translateX(1px)' : 'none' }}
            >
              ➤
            </span>
          )}
        </button>
      </div>

      {/* Mikro-copy under input */}
      <p 
        className="text-[10px] text-center mt-2 tracking-wide"
        style={{ color: G.textMuted }}
      >
        Trykk Enter for å sende · Shift+Enter for ny linje
      </p>

      {/* CSS-animasjonar */}
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════
   HOVEDKOMPONENT — CHATCONTAINER (Premium)
   Med mood-engine + animasjonar + resonance-glow + BliKjent + presence
   ═══════════════════════════════════════ */

interface ChatContainerProps {
  conversationId: string | null;
  partner?: { name: string; age: number; imageUrl?: string; id?: string };
  journeyDay?: number;
  imageShareAllowed?: boolean;
}

export function ChatContainer({ conversationId, partner, journeyDay = 1, imageShareAllowed = false }: ChatContainerProps) {
  const [isBliKjentOpen, setIsBliKjentOpen] = useState(false);
  const [mood, setMood] = useState<string>("warm");

  // Hent sessionUserId frå ChatContext for bildeopplasting
  const ctx = useChat();
  const sessionUserId = ctx.sessionUserId;

  // Partner ID for presence tracking
  const partnerId = partner?.id || null;

  return (
    <>
      {/* Premium CSS-animasjonar (warm-glow, mood-transition) */}
      <MessageBubbleStyles />

      <div className="w-full h-screen flex items-center justify-center" style={{ background: G.bgPrimary }}>
        {/* Subtil spotlight i bakgrunnen */}
        <div className="fixed inset-0 pointer-events-none" style={{
          background: 'radial-gradient(circle at 50% 30%, rgba(212,175,55,0.04) 0%, transparent 60%)',
        }} />

        {/* Chat-container — sentralisert med max-width */}
        <div className="w-full max-w-[720px] mx-auto flex flex-col h-screen" style={{ paddingTop: "96px", paddingBottom: "96px" }}>
          <div className="flex-1 flex flex-col rounded-3xl overflow-hidden relative" style={{
            background: G.bgChat,
            border: `1px solid ${G.glassBorder}`,
            boxShadow: '0 8px 40px rgba(0,0,0,0.2)',
          }}>

             {/* HEADER — med presence-indikator */}
             <ChatHeader
               partner={partner}
               journeyDay={journeyDay}
               onOpenBliKjent={() => setIsBliKjentOpen(prev => !prev)}
               isBliKjentOpen={isBliKjentOpen}
             />

             {/* MOOD SELECTOR — under header */}
             <div className="border-b flex-shrink-0" style={{ borderColor: G.glassBorder }}>
               <MoodSelector mood={mood} setMood={setMood} />
             </div>

             {/* BLI KJENT PANEL — slide-down frå header */}
            {isBliKjentOpen && (
              <div className="relative z-10">
                <BliKjentPanel
                  onClose={() => setIsBliKjentOpen(false)}
                />
              </div>
            )}

             {/* MESSAGE LIST — premium med animasjonar + mood-bakgrunn */}
             <div
               className="flex-1 overflow-y-auto"
               style={{
                 scrollbarWidth: 'thin',
                 scrollbarColor: `${G.goldMuted} transparent`,
                 backgroundImage: moodGradients[mood] || moodGradients.warm,
                 backgroundSize: 'cover',
                 transition: 'background-image 1.5s ease-in-out',
               }}
             >
               <MessageList partner={partner} journeyDay={journeyDay} />
             </div>

              {/* CHAT INPUT — Premium glass med typing-indikator */}
             <ChatInput 
               imageShareAllowed={imageShareAllowed} 
               conversationId={conversationId}
               senderId={sessionUserId ?? undefined}
               partnerId={partnerId}
             />
          </div>
        </div>
      </div>
    </>
  );
}

export default ChatContainer;