/**
 * ToSom — ChatContainer (Premium Nordic Gold 2026) ⭐🟡
 * Heilt ny versjon: roleg, lett og premium.
 * Premium bubble-animasjonar + resonance-glow + mood-engine.
 */

"use client";

import Image from 'next/image';
import { useChat } from "@/app/chat/context/ChatContext";
import { MessageBubble, MessageBubbleStyles } from "@/app/chat/components/MessageBubble";
import { useConversationMood, type ConversationMood } from "@/components/chat/useConversationMood";
import { useChatScroll } from "@/components/chat/useChatScroll";
import { useState, useRef, useEffect, useCallback } from "react";

/* ═══════════════════════════════════════
   DEV KONSTANTAR
   ═══════════════════════════════════════ */

export const DEV_CONVERSATION_ID = "dev-conversation";

const DEV_USER = { id: "dev-user", name: "George (dev)", age: 30, imageUrl: undefined };
const DEV_PARTNER = { id: "dev-partner", name: "Emma", age: 28, imageUrl: undefined };

/* ═══════════════════════════════════════
   MESSAGE-FORMATERING — konverter til ny format
   ═══════════════════════════════════════ */

function formatMessage(msg: any) {
  return {
    id: msg.id || `msg-${Date.now()}`,
    sender: msg.sender || "partner",
    type: msg.type || "text",
    content: msg.content || "",
    metadata: {
      imageUrl: msg.metadata?.imageUrl,
      taskTitle: msg.metadata?.taskTitle,
      choices: msg.metadata?.choices,
      timestamp: msg.metadata?.timestamp || new Date().toISOString(),
      senderInfo: msg.metadata?.senderInfo,
    },
  };
}

/* ═══════════════════════════════════════
   THEME TOKENS — LYSARE OG LETT
   ═══════════════════════════════════════ */

const G = {
  gold: "#D4AF37",
  goldLight: "#E8C766",
  goldMuted: "rgba(212,175,55,0.15)",
  goldSoft: "rgba(212,175,55,0.06)",
  tosomBlue: "#0F1A26", // Lysare enn #0B1520
  tosomBlueLight: "#141F2B",
  bgPrimary: "#0F1A26", // Hovudbakgrunn (lys)
  bgChat: "#111827", // Chat-container bakgrunn
  glassBg: "rgba(255,255,255,0.03)", // Mildare glass
  glassBorder: "rgba(255,255,255,0.06)", // Enn mildare border
  textPrimary: "rgba(255,255,255,0.92)",
  textSecondary: "rgba(255,255,255,0.55)",
  textMuted: "rgba(255,255,255,0.35)",
  dangerRed: "#FF4D4D",
};

/* ═══════════════════════════════════════
   MOCK-MELDINGAR (11 meldingar totalt)
   ═══════════════════════════════════════ */

const MOCK_MESSAGES = [
  { id: "dev-1", sender: "partner" as const, type: "text" as const, content: 'Hei! Så hyggelig å matche med deg 😊', metadata: { timestamp: new Date(Date.now() - 3600000 * 5).toISOString(), senderInfo: DEV_PARTNER } },
  { id: "dev-2", sender: "me" as const, type: "text" as const, content: 'Hei Emma! Takk skal du ha, du ser også veldig hyggelig ut!', metadata: { timestamp: new Date(Date.now() - 3600000 * 4).toISOString(), senderInfo: DEV_USER } },
  { id: "dev-3", sender: "partner" as const, type: "text" as const, content: 'Takk! Jeg la merke til at du også er glad i ro og stillhet. Det er sjeldan i dagens tid.', metadata: { timestamp: new Date(Date.now() - 3600000 * 3).toISOString(), senderInfo: DEV_PARTNER } },
  { id: "dev-4", sender: "me" as const, type: "text" as const, content: 'Ja, det er sant. Jeg trives best i rolige omgivelser — enten det er naturen eller hjemme med ei god bok.', metadata: { timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), senderInfo: DEV_USER } },
  { id: "dev-5", sender: "partner" as const, type: "text" as const, content: 'Hva leser du mest av?', metadata: { timestamp: new Date(Date.now() - 3600000).toISOString(), senderInfo: DEV_PARTNER } },
  { id: "dev-6", sender: "me" as const, type: "text" as const, content: 'En blanding av fagbøker og litteratur. Akkurat nå leser jeg "Norsk psykologi". Hva med deg?', metadata: { timestamp: new Date(Date.now() - 1800000).toISOString(), senderInfo: DEV_USER } },
  { id: "dev-7", sender: "partner" as const, type: "text" as const, content: 'Jeg er mest av en fagbok-person også — og litt skjønnlitteratur på kvelden.', metadata: { timestamp: new Date(Date.now() - 900000).toISOString(), senderInfo: DEV_PARTNER } },
  { id: "dev-sys-1", sender: "system" as const, type: "task" as const, content: 'Dagens oppgave: Vis nysgjerrighet', metadata: { timestamp: new Date(Date.now() - 600000).toISOString(), taskTitle: 'OPPGÅVE — Dag 5 av 30', choices: [{ label: "Hobby", value: "hobby" }, { label: "Reiser", value: "travel" }, { label: "Hverdagsliv", value: "daily" }] } },
  { id: "dev-8", sender: "me" as const, type: "text" as const, content: 'Jeg tror jeg svarer med reiser. Jeg elsker å vandre i norske fjell.', metadata: { timestamp: new Date(Date.now() - 300000).toISOString(), senderInfo: DEV_USER } },
  { id: "dev-9", sender: "partner" as const, type: "text" as const, content: 'Åh, de er fantastisk! Jeg har vært på Hardangervidda en gang — helt magisk.', metadata: { timestamp: new Date(Date.now() - 120000).toISOString(), senderInfo: DEV_PARTNER } },
  { id: "dev-img-1", sender: "partner" as const, type: "image" as const, content: 'Kikket ut vinduet i dag — så fint!', metadata: { timestamp: new Date(Date.now() - 60000).toISOString(), senderInfo: DEV_PARTNER } },
];

/* ═══════════════════════════════════════
   GENERATOR-FUNKSJONAR
   ═══════════════════════════════════════ */

function generateDevMessage(text: string) {
  return {
    id: `dev-${Date.now()}`,
    sender: "me" as const,
    type: "text" as const,
    content: text,
    metadata: { timestamp: new Date().toISOString(), senderInfo: DEV_USER },
  };
}

function generateDevTask(day: number) {
  return {
    id: `dev-sys-${day}`,
    sender: "system" as const,
    type: "task" as const,
    content: `Dagen ${day}: Refleksjon over reisen`,
    metadata: { timestamp: new Date().toISOString(), taskTitle: `OPPGÅVE — Dag ${day} av 30`, choices: [{ label: "Nysgjerrig", value: "curious" }, { label: "Moden", value: "mature" }] },
  };
}

function generateDevImage(url?: string) {
  return {
    id: `dev-img-${Date.now()}`,
    sender: "me" as const,
    type: "image" as const,
    content: "Ny bilde-melding",
    metadata: { timestamp: new Date().toISOString(), senderInfo: DEV_USER, imageUrl: url || "/dev/emma.jpg" },
  };
}

/* ═══════════════════════════════════════
   DEV-BANNER-komponent
   ═══════════════════════════════════════ */

function DevBanner({ onClose }: { onClose?: () => void }) {
  return (
    <div className="flex items-center justify-between px-4 py-2" style={{ background: "rgba(212,175,55,0.08)", borderBottom: `1px solid ${G.goldMuted}` }}>
      <p className="text-xs font-medium" style={{ color: G.gold }}>
        🟡 DEV MODE — bruker mock-data for dev-samtale
      </p>
      {onClose && (
        <button onClick={onClose} className="text-xs" style={{ color: G.textMuted }}>
          ✕
        </button>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   CHAT HEADER — MINIMALISERT
   ═══════════════════════════════════════ */

function ChatHeader({ partner, journeyDay }: {
  partner?: { name: string; age: number; imageUrl?: string };
  journeyDay: number;
}) {
  return (
    <div className="px-6 py-4" style={{ borderBottom: `1px solid ${G.glassBorder}` }}>
      <div className="flex items-center gap-3">
        {/* Profilbilde — redusert til 48px */}
        {partner?.imageUrl ? (
          <div className="relative w-12 h-12 rounded-full overflow-hidden" style={{ borderColor: G.goldMuted, borderWidth: '1.5px', borderStyle: 'solid' }}>
            <Image src={partner.imageUrl} alt={partner.name} fill className="object-cover" />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold border" style={{ background: `linear-gradient(135deg, ${G.goldSoft}, ${G.goldMuted})`, border: `1.5px solid ${G.goldMuted}`, color: G.gold }}>
            {partner?.name?.charAt(0)?.toUpperCase() || "T"}
          </div>
        )}
        
        {/* Namn + journey-dag — berre essensiell info */}
        <div className="flex-1">
          <h2 className="text-base font-medium" style={{ color: G.textPrimary }}>{partner?.name || "Din match"}</h2>
          <p className="text-xs" style={{ color: G.gold }}>
            Dag {journeyDay} av 30 ✨
          </p>
        </div>

        {/* Status-indikator */}
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ background: G.gold, boxShadow: `0 0 8px ${G.goldMuted}` }} />
          <span className="text-xs" style={{ color: G.textSecondary }}>Matcha</span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   MESSAGE LIST — PREMIUM MED ANIMASJONAR
   ═══════════════════════════════════════ */

function MessageList({ partner, devMessages, journeyDay }: {
  partner?: { name: string; imageUrl?: string };
  devMessages?: any[];
  journeyDay?: number;
}) {
  const { messages: ctxMessages, loading, error } = useChat();
  
  // Bruk devMessages dersom tilgjengeleg, elles kontekst
  const rawMessages = devMessages ?? ctxMessages;

  // Konverter til ny format
  const allMessages = rawMessages.map(formatMessage);

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
      className="px-6"
      style={{ 
        scrollbarWidth: 'thin', 
        scrollbarColor: `${G.goldMuted} transparent`,
        backgroundImage: moodConfig.backgroundGradient,
        backgroundSize: 'cover',
      }}
    >
      {allMessages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════
   CHAT INPUT — TRANSPARENT OG ELEGANT
   ═══════════════════════════════════════ */

function ChatInput({ imageShareAllowed, isDev, onReset, onSendMessage }: {
  imageShareAllowed: boolean;
  isDev?: boolean;
  onReset?: () => void;
  onSendMessage?: (text: string) => void;
}) {
  const { sendMessage } = useChat();
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (inputRef.current) { inputRef.current.style.height = "auto"; inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 120) + "px"; }
  }, [text]);

  const handleSend = async () => {
    if (!text.trim() || sending) return;
    setSending(true);
    try {
      if (isDev && onSendMessage) {
        onSendMessage(text.trim());
        setText("");
        inputRef.current?.focus();
      } else {
        await sendMessage(text.trim(), "text");
        setText("");
        inputRef.current?.focus();
      }
    } catch (e) { console.error("Feil ved sending:", e); }
    finally { setSending(false); }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <div className="px-6 py-4" style={{ borderTop: `1px solid ${G.glassBorder}` }}>
      {/* Reset-knapp i dev-modus */}
      {isDev && onReset && (
        <button className="mb-3 text-xs underline" style={{ color: G.gold }} onClick={onReset}>↺ Reset dev-samtale</button>
      )}
      
      <div className="flex items-end gap-3">
        {/* Kamera-ikon */}
        {imageShareAllowed && (
          <button className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:brightness-110" style={{ color: G.gold }} title="Send bilde">
            📷
          </button>
        )}

        {/* Input — transparent utan glass */}
        <textarea 
          ref={inputRef} 
          value={text} 
          onChange={(e) => setText(e.target.value)} 
          onKeyDown={handleKeyDown} 
          placeholder="Skriv ei melding…" 
          rows={1} 
          className="flex-1 resize-none bg-transparent outline-none text-base leading-relaxed"
          style={{ color: G.textPrimary }}
        />

        {/* Send-knapp — berre når det står tekst */}
        <button 
          onClick={handleSend} 
          disabled={!text.trim() || sending} 
          className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ 
            background: text.trim() ? `linear-gradient(135deg, ${G.gold}, ${G.goldLight})` : G.glassBg,
            boxShadow: text.trim() ? `0 2px 12px ${G.goldMuted}` : 'none',
          }}
        >
          <span className="text-base">{sending ? "⏳" : "➤"}</span>
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   HOVEDKOMPONENT — CHATCONTAINER (Premium)
   Med mood-engine + animasjonar + resonance-glow
   ═══════════════════════════════════════ */

export function ChatContainer({ conversationId, partner, journeyDay = 1, imageShareAllowed = false }: {
  conversationId: string | null;
  partner?: { name: string; age: number; imageUrl?: string };
  journeyDay?: number;
  imageShareAllowed?: boolean;
}) {
  const isDevMode = conversationId === DEV_CONVERSATION_ID;
  const [devMsgState, setDevMsgState] = useState<any[]>([]);
  const [devBannerVisible, setDevBannerVisible] = useState(true);

  // I dev-modus: Bruk null conversationId slik at ChatProvider ikkje kallar API
  const apiConversationId = isDevMode ? null : conversationId;

  useEffect(() => {
    if (isDevMode) {
      console.info("[DEV] Laster mock-meldinger for dev-conversation");
      setDevMsgState([...MOCK_MESSAGES]);
    }
  }, [isDevMode]);

  const handleDevSend = (text: string) => {
    setDevMsgState((prev) => [...prev, generateDevMessage(text)]);
  };

  const handleDevReset = () => {
    setDevMsgState([...MOCK_MESSAGES]);
  };

  // Bruk dev-meldingar dersom i dev-modus
  const messagesForList = isDevMode ? devMsgState : undefined;
  const partnerForList = isDevMode ? DEV_PARTNER : partner;

  return (
    <>
      {/* Premium CSS-animasjonar (warm-glow, soft-land) */}
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

            {/* Dev-banner */}
            {isDevMode && devBannerVisible && <DevBanner onClose={() => setDevBannerVisible(false)} />}

            {/* HEADER — minimalisert */}
            <ChatHeader partner={isDevMode ? DEV_PARTNER : partner} journeyDay={journeyDay} />

            {/* MESSAGE LIST — premium med animasjonar */}
            <div className="flex-1 overflow-y-auto" style={{ 
              scrollbarWidth: 'thin', 
              scrollbarColor: `${G.goldMuted} transparent`,
            }}>
              <MessageList partner={partnerForList} devMessages={messagesForList} journeyDay={journeyDay} />
            </div>

            {/* CHAT INPUT — transparent */}
            <ChatInput imageShareAllowed={imageShareAllowed} isDev={isDevMode} onReset={handleDevReset} onSendMessage={handleDevSend} />
          </div>
        </div>
      </div>
    </>
  );
}

export default ChatContainer;