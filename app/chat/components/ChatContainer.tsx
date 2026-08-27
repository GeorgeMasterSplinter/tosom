/**
 * Tosom — ChatContainer (Premium Nordic Gold 2026) ⭐🟡
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
import { OppgaverPanel } from "@/app/chat/components/OppgaverPanel";
import { MoodsPanel } from "@/app/chat/components/MoodsPanel";
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
  partner?: { name: string; imageUrl?: string; id?: string };
  journeyDay?: number;
}) {
  const { messages: ctxMessages, loading, error, moodTheme } = useChat();
  const tPrimary = moodTheme.textPrimary;
  const tSecondary = moodTheme.textSecondary;
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
          <p className="text-lg font-medium mb-2" style={{ color: tPrimary }}>Start reisen med en varm melding</p>
          <p className="text-sm" style={{ color: tSecondary }}>Dei beste relasjonane byrjar med eit lite steg.</p>
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
          <p className="text-sm mb-4" style={{ color: tSecondary }}>{error}</p>
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
  const { sendMessage, moodTheme, sendError } = useChat();
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
      const ok = await sendMessage(text.trim(), "text");
      // Tøm inputfeltet berre ved SUKSES — ved feil står meldinga igjen
      // (kan sendast på nytt) og sendError blir vist over feltet.
      if (ok) {
        setText("");
        inputRef.current?.focus();
      }
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
        borderTop: `1px solid ${moodTheme.accentMuted}`,
        background: `linear-gradient(0deg, rgba(11,21,32,0.8) 0%, rgba(11,21,32,0.4) 100%)`,
        transition: 'border-color 1.2s ease-in-out',
      }}
    >
      {/* Send-feil — synleg til neste vellykka send (polling slettar ikkje denne) */}
      {sendError && (
        <p className="px-2 pb-2 text-xs" style={{ color: G.dangerRed }} role="alert">
          ⚠ {sendError} — meldinga er ikkje send, prøv igjen
        </p>
      )}

      {/* Premium glass-container for input */}
      <div 
        className="flex items-end gap-2.5 rounded-2xl p-3 transition-all duration-300"
        style={{
          background: isFocused 
            ? `linear-gradient(135deg, ${moodTheme.inputFocusBg}, rgba(255,255,255,0.01))`
            : `linear-gradient(135deg, ${G.glassBg}, rgba(255,255,255,0.01))`,
          border: `1px solid ${isFocused ? moodTheme.inputBorder : G.glassBorder}`,
          boxShadow: isFocused 
            ? `0 0 20px ${moodTheme.inputGlow}, 0 4px 16px rgba(0,0,0,0.1)`
            : '0 2px 8px rgba(0,0,0,0.05)',
          transition: 'border-color 0.3s ease, box-shadow 0.3s ease, background 0.5s ease',
        }}
      >
        {/* Bilde-ikon — Premium glass-knapp (låst før dag 15) */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleImageUpload}
          className="hidden"
        />
        <button
          onClick={imageShareAllowed ? () => fileInputRef.current?.click() : undefined}
          disabled={!imageShareAllowed || uploading}
          className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 relative ${imageShareAllowed ? 'hover:brightness-125 active:scale-90' : 'cursor-not-allowed'}`}
          style={{
            color: moodTheme.accent,
            background: G.glassBg,
            border: `1px solid ${imageShareAllowed ? G.glassBorder : 'rgba(255,255,255,0.04)'}`,
            opacity: imageShareAllowed ? 1 : 0.5,
            transition: 'color 1.2s ease-in-out',
          }}
          title={uploading ? "Laster opp..." : imageShareAllowed ? "Send bilde" : "🔒 Bildedeling låses opp dag 15"}
        >
          <span className="text-sm">📷</span>
          {!imageShareAllowed && (
            <span
              className="absolute -bottom-0.5 -right-0.5 text-[10px] flex items-center justify-center w-4 h-4 rounded-full"
              style={{ background: 'rgba(11,21,32,0.9)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              🔒
            </span>
          )}
          {uploading && (
            <span className="text-xs" style={{ animation: 'spin 1s linear infinite' }}>⏳</span>
          )}
        </button>

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
            color: moodTheme.textPrimary,
            caretColor: moodTheme.accent,
            transition: 'caret-color 1.2s ease-in-out',
          }}
        />

        {/* Send-knapp — Premium gull-gradient sirkel */}
        <button
          onClick={handleSend}
          disabled={!text.trim() || sending}
          className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
          style={{
            background: text.trim() 
              ? `linear-gradient(135deg, ${moodTheme.sendBtnStart}, ${moodTheme.sendBtnEnd})`
              : G.glassBg,
            boxShadow: text.trim() 
              ? `0 4px 16px ${moodTheme.accentMuted}`
              : 'none',
            transition: 'background 0.5s ease, box-shadow 0.5s ease',
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
        style={{ color: moodTheme.textMuted }}
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
  const [isOppgaverOpen, setIsOppgaverOpen] = useState(false);
  const [isMoodsOpen, setIsMoodsOpen] = useState(false);

  // Hent sessionUserId + mood fra ChatContext
  const ctx = useChat();
  const sessionUserId = ctx.sessionUserId;
  const moodTheme = ctx.moodTheme;

  // Partner ID for presence tracking
  const partnerId = partner?.id || null;

  return (
    <>
      {/* Premium CSS-animasjonar (warm-glow, mood-transition) */}
      <MessageBubbleStyles />

      <div
        className="w-full h-full flex flex-col overflow-hidden relative"
        style={{
          background: moodTheme.containerBg,
          transition: 'background 1.2s ease-in-out',
        }}
      >
        {/* HEADER — navn + alder + avstand + dag + 3 panel-knappar */}
        <ChatHeader
          partner={partner}
          journeyDay={journeyDay}
          onOpenBliKjent={() => { setIsBliKjentOpen(prev => !prev); setIsOppgaverOpen(false); setIsMoodsOpen(false); }}
          isBliKjentOpen={isBliKjentOpen}
          onOpenOppgaver={() => { setIsOppgaverOpen(prev => !prev); setIsBliKjentOpen(false); setIsMoodsOpen(false); }}
          isOppgaverOpen={isOppgaverOpen}
          onOpenMoods={() => { setIsMoodsOpen(prev => !prev); setIsBliKjentOpen(false); setIsOppgaverOpen(false); }}
          isMoodsOpen={isMoodsOpen}
          moodTheme={moodTheme}
        />

        {/* BLI KJENT PANEL — slide-down frå header */}
        {isBliKjentOpen && (
          <div className="relative z-10">
            <BliKjentPanel
              onClose={() => setIsBliKjentOpen(false)}
            />
          </div>
        )}

        {/* OPPGAVER PANEL — slide-down frå header */}
        {isOppgaverOpen && (
          <div className="relative z-10">
            <OppgaverPanel
              onClose={() => setIsOppgaverOpen(false)}
            />
          </div>
        )}

        {/* MOODS PANEL — slide-down frå header */}
        {isMoodsOpen && (
          <div className="relative z-10">
            <MoodsPanel
              onClose={() => setIsMoodsOpen(false)}
            />
          </div>
        )}

        {/* MESSAGE LIST — fyller mellom header og input */}
        <div
          className="flex-1 overflow-y-auto"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: `${moodTheme.accentMuted} transparent`,
          }}
        >
          <MessageList partner={partner} journeyDay={journeyDay} />
        </div>

        {/* CHAT INPUT — helt nederst i kanten */}
        <ChatInput
          imageShareAllowed={imageShareAllowed}
          conversationId={conversationId}
          senderId={sessionUserId ?? undefined}
          partnerId={partnerId}
        />
      </div>
    </>
  );
}

export default ChatContainer;