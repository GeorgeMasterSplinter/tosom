/**
 * ToSom — ChatContainer (Premium Nordic Gold 2026) ⭐🟡
 * Heilt ny versjon: roleg, lett og premium.
 * Premium bubble-animasjonar + resonance-glow + mood-engine.
 * Integrerer ChatHeader og BliKjentPanel.
 *
 * MERK: Dev-mode med mock-data er flytta til /chat/dev
 * ═══════════════════════════════════════ */

"use client";

import Image from 'next/image';
import { useChat } from "@/app/chat/context/ChatContext";
import { MessageBubble, MessageBubbleStyles } from "@/app/chat/components/MessageBubble";
import { ChatHeader } from "@/app/chat/components/ChatHeader";
import { BliKjentPanel } from "@/app/chat/components/BliKjentPanel";
import { useConversationMood, MoodAnimationStyles, type ConversationMood } from "@/components/chat/useConversationMood";
import { useChatScroll } from "@/components/chat/useChatScroll";
import { useState, useRef, useEffect, useCallback } from "react";

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
   MESSAGE LIST — PREMIUM MED ANIMASJONAR
   ═══════════════════════════════════════ */

function MessageList({ partner, journeyDay }: {
  partner?: { name: string; imageUrl?: string };
  journeyDay?: number;
}) {
  const { messages: ctxMessages, loading, error } = useChat();
  const allMessages = ctxMessages;

  // Mood-engine
  const moodConfig = useConversationMood(allMessages, { journeyDay });

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
        backgroundImage: moodConfig.backgroundGradient,
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
   CHAT INPUT — Premium composer v2
   Glassmorphism design med gull-aksentar
   ═══════════════════════════════════════ */

function ChatInput({ imageShareAllowed }: {
  imageShareAllowed: boolean;
}) {
  const { sendMessage } = useChat();
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 120) + "px";
    }
  }, [text]);

  const handleSend = async () => {
    if (!text.trim() || sending) return;
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
          <button 
            className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:brightness-125 active:scale-90" 
            style={{ 
              color: G.gold,
              background: G.glassBg,
              border: `1px solid ${G.glassBorder}`,
            }} 
            title="Send bilde"
          >
            📷
          </button>
        )}

        {/* Input — Glass-stil med gull-focus */}
        <textarea
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
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
   Med mood-engine + animasjonar + resonance-glow + BliKjent
   ═══════════════════════════════════════ */

interface ChatContainerProps {
  conversationId: string | null;
  partner?: { name: string; age: number; imageUrl?: string };
  journeyDay?: number;
  imageShareAllowed?: boolean;
}

export function ChatContainer({ conversationId, partner, journeyDay = 1, imageShareAllowed = false }: ChatContainerProps) {
  const [isBliKjentOpen, setIsBliKjentOpen] = useState(false);

  return (
    <>
      {/* Premium CSS-animasjonar (warm-glow, mood-transition) */}
      <MessageBubbleStyles />
      <MoodAnimationStyles />

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

            {/* HEADER */}
            <ChatHeader
              partner={partner}
              journeyDay={journeyDay}
              onOpenBliKjent={() => setIsBliKjentOpen(prev => !prev)}
              isBliKjentOpen={isBliKjentOpen}
            />

            {/* BLI KJENT PANEL — slide-down frå header */}
            {isBliKjentOpen && (
              <div className="relative z-10">
                <BliKjentPanel
                  onClose={() => setIsBliKjentOpen(false)}
                />
              </div>
            )}

            {/* MESSAGE LIST — premium med animasjonar */}
            <div className="flex-1 overflow-y-auto" style={{
              scrollbarWidth: 'thin',
              scrollbarColor: `${G.goldMuted} transparent`,
            }}>
              <MessageList partner={partner} journeyDay={journeyDay} />
            </div>

            {/* CHAT INPUT — Premium glass */}
            <ChatInput imageShareAllowed={imageShareAllowed} />
          </div>
        </div>
      </div>
    </>
  );
}

export default ChatContainer;