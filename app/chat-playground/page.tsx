/**
 * ToSom — Chat Playground (Premium Nordic Gold 2026) ⭐🟡
 * Isolt chat-sandkasse — ingen auth, API, journey, eller database.
 * 
 * Bruk: /chat-playground
 * Mål: Test chat-design, bobler, animasjonar, mood, interaksjonar
 */

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import ChatHeader from "@/components/chat/ChatHeader";
import MessageBubble, { MessageData } from "@/app/chat/components/MessageBubble";
import { BliKjentPanel } from "@/app/chat/components/BliKjentPanel";
import { useConversationMood, type ConversationMood } from "@/components/chat/useConversationMood";

/* ═══════════════════════════════════════
   THEME TOKENS
   ═══════════════════════════════════════ */

const G = {
  gold: "#D4AF37",
  goldLight: "#E8C766",
  goldMuted: "rgba(212,175,55,0.2)",
  goldSoft: "rgba(212,175,55,0.08)",
  goldGlow: "rgba(212,175,55,0.4)",
  tosomBlue: "#0B1520",
  bgChat: "#0F1A26",
  glassBg: "rgba(255,255,255,0.04)",
  glassBorder: "rgba(255,255,255,0.1)",
  textPrimary: "rgba(255,255,255,0.92)",
  textSecondary: "rgba(255,255,255,0.55)",
  textMuted: "rgba(255,255,255,0.35)",
  dangerRed: "#FF4D4D",
};

/* ═══════════════════════════════════════
   MOOD GRADIENTS
   ═══════════════════════════════════════ */

const moodGradients: Record<string, string> = {
  calm: "linear-gradient(135deg, rgba(10,26,58,0.5), rgba(11,21,32,0.7))",
  warm: "linear-gradient(135deg, rgba(212,175,55,0.08), rgba(15,26,38,0.6))",
  deep: "linear-gradient(135deg, rgba(49,10,101,0.35), rgba(11,21,32,0.7))",
  gentle: "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(11,21,32,0.6))",
  joyful: "linear-gradient(135deg, rgba(245,158,11,0.1), rgba(11,21,32,0.6))",
};

const moodLabels: Record<string, string> = {
  calm: "Calm",
  warm: "Warm",
  deep: "Deep",
  gentle: "Gentle",
  joyful: "Joyful",
};

/* ═══════════════════════════════════════
   MOCK-DATA
   ═══════════════════════════════════════ */

const mockPartner = {
  name: "Emma",
  age: 28,
  imageUrl: undefined as string | undefined,
};

const initialMessages: MessageData[] = [
  {
    id: "m1",
    sender: "partner",
    type: "text",
    content: "Hei! Så hyggelig å matche med deg 😊",
    metadata: { timestamp: new Date(Date.now() - 3600000 * 5).toISOString(), senderInfo: { name: "Emma" } },
  },
  {
    id: "m2",
    sender: "me",
    type: "text",
    content: "Hei Emma! Takk skal du ha, du ser også veldig hyggelig ut!",
    metadata: { timestamp: new Date(Date.now() - 3600000 * 4).toISOString(), senderInfo: { name: "Du" } },
  },
  {
    id: "m3",
    sender: "partner",
    type: "text",
    content: "Takk! Jeg la merke til at du også er glad i ro og stillhet. Det er sjeldan i dagens tid.",
    metadata: { timestamp: new Date(Date.now() - 3600000 * 3).toISOString(), senderInfo: { name: "Emma" } },
  },
  {
    id: "m4",
    sender: "me",
    type: "text",
    content: "Ja, det er sant. Jeg trives best i rolige omgivelser — enten det er naturen eller hjemme med ei god bok.",
    metadata: { timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), senderInfo: { name: "Du" } },
  },
  {
    id: "m5",
    sender: "partner",
    type: "text",
    content: "Jeg tror det er reiser. Jeg elsker å vandre i norske fjell, spesielt om hausten når fargene skifter.",
    metadata: { timestamp: new Date(Date.now() - 1800000).toISOString(), senderInfo: { name: "Emma" } },
  },
];

/* ═══════════════════════════════════════
   TYPING INDICATOR
   ═══════════════════════════════════════ */

function TypingIndicator() {
  return (
    <div className="flex justify-start py-3">
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
                animation: `typingBounce 1.4s ease-in-out ${i * 0.2}s infinite`,
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
   SKELETON LOADING
   ═══════════════════════════════════════ */

function ChatSkeleton() {
  return (
    <div className="flex-1 p-6 space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-[20px] px-5 py-4 animate-pulse"
          style={{
            background: G.glassBg,
            border: `1px solid ${G.glassBorder}`,
            width: i % 2 === 0 ? "75%" : "60%",
            marginLeft: i % 2 === 0 ? "auto" : undefined,
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════
   ERROR STATE
   ═══════════════════════════════════════ */

function ChatErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div
        className="text-center rounded-[20px] p-8 max-w-sm"
        style={{ background: G.glassBg, border: "1px solid rgba(255,77,77,0.15)" }}
      >
        <p className="text-lg font-medium mb-3" style={{ color: G.dangerRed }}>
          Kunne ikke laste samtalen
        </p>
        <p className="text-sm mb-4" style={{ color: G.textSecondary }}>
          Noko gjekk gale. Prøv igjen.
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-3 rounded-xl font-medium transition-all hover:brightness-110"
            style={{
              background: `linear-gradient(135deg, ${G.gold}, ${G.goldLight})`,
              color: G.tosomBlue,
              borderRadius: "12px",
            }}
          >
            Prøv igjen
          </button>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   EMPTY STATE
   ═══════════════════════════════════════ */

function ChatEmptyState() {
  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="text-center max-w-sm">
        <div
          className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${G.goldSoft}, ${G.goldMuted})`,
            border: `1px solid ${G.goldMuted}`,
          }}
        >
          <span className="text-2xl">💬</span>
        </div>
        <p className="text-lg font-medium mb-2" style={{ color: G.textPrimary }}>
          Start reisen med ein varm melding
        </p>
        <p className="text-sm" style={{ color: G.textSecondary }}>
          Dei beste relasjonane byrjar med eit lite steg.
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   CHAT INPUT — enkel (lokal state)
   ═══════════════════════════════════════ */

function ChatInput({ onSend }: { onSend: (text: string) => void }) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 120) + "px";
    }
  }, [text]);

  const handleSend = () => {
    if (!text.trim() || sending) return;
    setSending(true);
    onSend(text.trim());
    setText("");
    inputRef.current?.focus();
    setTimeout(() => setSending(false), 300);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="px-4 py-3.5 sm:px-6" style={{ borderTop: `1px solid ${G.glassBorder}` }}>
      <div className="flex items-end gap-2.5 rounded-2xl p-3 transition-all duration-300"
        style={{
          background: G.glassBg,
          border: `1px solid ${G.glassBorder}`,
        }}
      >
        <textarea
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Skriv ei melding…"
          rows={1}
          className="flex-1 resize-none bg-transparent outline-none text-sm leading-relaxed py-1.5"
          style={{ color: G.textPrimary, caretColor: G.gold }}
        />

        <button
          onClick={handleSend}
          disabled={!text.trim() || sending}
          className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
          style={{
            background: text.trim()
              ? `linear-gradient(135deg, ${G.gold}, ${G.goldLight})`
              : G.glassBg,
            boxShadow: text.trim() ? `0 4px 16px ${G.goldMuted}` : "none",
          }}
        >
          {sending ? (
            <span className="text-sm" style={{ animation: "spin 1s linear infinite" }}>⏳</span>
          ) : (
            <span style={{ transform: text.trim() ? "translateX(1px)" : "none" }}>➤</span>
          )}
        </button>
      </div>

      <p className="text-[10px] text-center mt-2 tracking-wide" style={{ color: G.textMuted }}>
        Trykk Enter for å sende · Shift+Enter for ny linje
      </p>

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
   MOOD DATA — emoji, farge, label
   ═══════════════════════════════════════ */

interface MoodOption {
  key: string;
  emoji: string;
  label: string;
  bg: string;
}

const moodOptions: MoodOption[] = [
  { key: "calm", emoji: "🌊", label: "Calm", bg: "#0A1A2A" },
  { key: "warm", emoji: "☀️", label: "Warm", bg: "#D4AF37" },
  { key: "deep", emoji: "🔮", label: "Deep", bg: "#310A65" },
  { key: "gentle", emoji: "🌿", label: "Gentle", bg: "#10B981" },
  { key: "joyful", emoji: "✨", label: "Joyful", bg: "#F59E0B" },
];

/* ═══════════════════════════════════════
   MOOD BAR — horisontale mood-knappar
   ═══════════════════════════════════════ */

function MoodBar({ mood, setMood }: { mood: string; setMood: (m: string) => void }) {
  return (
    <div className="flex items-center gap-4 flex-wrap">
      {moodOptions.map((opt) => {
        const isActive = mood === opt.key;
        return (
          <button
            key={opt.key}
            onClick={() => setMood(opt.key)}
            className="px-10 py-6 rounded-2xl text-xl font-bold transition-all duration-300 hover:brightness-110 active:scale-95 flex items-center gap-3"
            style={{
              background: isActive
                ? `linear-gradient(135deg, ${G.gold}, ${G.goldLight})`
                : "rgba(255,255,255,0.1)",
              color: isActive ? G.tosomBlue : G.textPrimary,
              border: isActive
                ? `3px solid ${G.gold}`
                : `2px solid ${G.glassBorder}`,
              boxShadow: isActive ? `0 8px 32px ${G.goldMuted}` : "none",
            }}
          >
            <span className="text-3xl">{opt.emoji}</span>
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════
   TEST PANEL — berre Mood-bar
   ═══════════════════════════════════════ */

function TestPanel({ mood, setMood }: { mood: string; setMood: (m: string) => void }) {
  return (
    <div
      className="p-6 rounded-2xl border"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: `1px solid ${G.glassBorder}`,
        backdropFilter: "blur(16px)",
      }}
    >
      <MoodBar mood={mood} setMood={setMood} />
    </div>
  );
}

/* ═══════════════════════════════════════
   HOVEDKOMPONENT — CHAT PLAYGROUND
   ═══════════════════════════════════════ */

export default function ChatPlaygroundPage() {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [mood, setMood] = useState<string>("warm");
  const [uiState, setUiState] = useState<"idle" | "loading" | "error">("idle");
  const [isTyping, setIsTyping] = useState(false);
  const [showBliKjentPanel, setShowBliKjentPanel] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Last initialMessages ved først render
  useEffect(() => {
    setMessages([...initialMessages]);
  }, []);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, uiState, isTyping]);

  // Legg til tekstmelding (brukar)
  const addTextMessage = useCallback(() => {
    const newMsg: MessageData = {
      id: `msg-${Date.now()}`,
      sender: "me",
      type: "text",
      content: `Dette er ei testmelding — ${new Date().toLocaleTimeString("no-NO")}`,
      metadata: { timestamp: new Date().toISOString(), senderInfo: { name: "Du" } },
    };
    setMessages((prev) => [...prev, newMsg]);
  }, []);

  // Legg til milepæl-boble
  const addMilestoneMessage = useCallback(() => {
    const days = [10, 20, 30];
    const day = days[Math.floor(Math.random() * days.length)];
    const messages: Record<number, string> = {
      10: "Første fasen er fullført! Dykkar 'Bli kjent'-fase er bak dere.",
      20: "To-tredjedels reise er gjennomført. No går dere djupare inn i kvarandre.",
      30: "Gratulerer! Dere har fullført heile 30-dagers reisen together.",
    };
    const newMsg: MessageData = {
      id: `ms-${Date.now()}`,
      sender: "system",
      type: "system",
      content: `✨ Dag ${day} av 30 — ${messages[day]}`,
      metadata: { day, phase: day <= 10 ? "Bli kjent" : day <= 20 ? "Lek og morro" : "Djupde" },
    };
    setMessages((prev) => [...prev, newMsg]);
  }, []);

  // Tøm chat
  const resetChat = useCallback(() => {
    setMessages([]);
  }, []);

  // Send fra input
  const handleSend = useCallback(
    (text: string) => {
      const newMsg: MessageData = {
        id: `send-${Date.now()}`,
        sender: "me",
        type: "text",
        content: text,
        metadata: { timestamp: new Date().toISOString(), senderInfo: { name: "Du" } },
      };
      setMessages((prev) => [...prev, newMsg]);

      // Simuler at partner svarer etter 1.5 sekund
      setTimeout(() => {
        const replies = [
          "Det er interessant! Fortel meir om det.",
          "Eg hilder det du seier. Eg føler meg closer til deg.",
          "Takk for at du deler det med meg. Det betyr mykje.",
          "Kva tenkjer du sjølv om det?",
        ];
        const replyMsg: MessageData = {
          id: `reply-${Date.now()}`,
          sender: "partner",
          type: "text",
          content: replies[Math.floor(Math.random() * replies.length)],
          metadata: { timestamp: new Date().toISOString(), senderInfo: { name: "Emma" } },
        };
        setMessages((prev) => [...prev, replyMsg]);
      }, 1500);
    },
    []
  );

  // Render meldingar
  const renderMessages = () => {
    return messages.map((msg) => <MessageBubble key={msg.id} message={msg} />);
  };

  return (
    <>
      {/* Premium CSS-animasjonar */}
      <style jsx global>{`
        @keyframes bubble-warm-glow {
          0% { opacity: 0; transform: translateY(8px) scale(0.97); filter: brightness(0.85); }
          40% { filter: brightness(1.08); }
          100% { opacity: 1; transform: translateY(0) scale(1); filter: brightness(1); }
        }
      `}</style>

      <div
        className="w-full h-screen flex items-center justify-center transition-all duration-1000"
        style={{
          background: G.tosomBlue,
          backgroundImage: moodGradients[mood] || moodGradients.calm,
          overflow: "hidden",
        }}
      >
        {/* Chat-container — sentralisert med max-width */}
        <div className="w-full max-w-[720px] h-full flex flex-col">
          <div
            className="flex flex-col rounded-3xl overflow-hidden relative"
            style={{
              background: G.bgChat,
              border: `1px solid ${G.glassBorder}`,
              boxShadow: "0 8px 40px rgba(0,0,0,0.35), inset 0 0 24px rgba(255,255,255,0.02)",
              height: "100%",
            }}
          >
            {/* Test Panel (berre synleg i idle, utan BliKjentPanel) */}
            {uiState === "idle" && !showBliKjentPanel && (
              <div className="px-4 py-3 sm:px-6 flex-shrink-0">
                <TestPanel mood={mood} setMood={setMood} />
              </div>
            )}

            {/* HEADER (sticky top) */}
            <div className="flex-shrink-0 z-10">
              <ChatHeader
                partnerName={mockPartner.name}
                partnerAge={mockPartner.age}
                distance="45 km unna"
                currentDay={12}
                daysRemaining={18}
                resonanceScore={75}
                onBliKjentClick={() => setShowBliKjentPanel(true)}
              />
            </div>

            {/* Bli Kjent Panel */}
            {showBliKjentPanel && (
              <div className="flex-shrink-0">
                <BliKjentPanel onClose={() => setShowBliKjentPanel(false)} />
              </div>
            )}

            {/* STATES — berre synleg når det ikkje er meldingar */}
            {uiState === "loading" && (
              <div className="flex-1 flex items-center justify-center">
                <ChatSkeleton />
              </div>
            )}

            {uiState === "error" && (
              <div className="flex-1 flex items-center justify-center">
                <ChatErrorState onRetry={() => setUiState("idle")} />
              </div>
            )}

            {uiState === "idle" && messages.length === 0 && !showBliKjentPanel && (
              <div className="flex-1 flex items-center justify-center">
                <ChatEmptyState />
              </div>
            )}

            {/* MESSAGE LIST — scrollable område */}
            {uiState === "idle" && messages.length > 0 && (
              <div
                className="flex-1 overflow-y-auto px-4 sm:px-6 py-4"
                style={{
                  backgroundImage: moodGradients[mood] || moodGradients.calm,
                  backgroundSize: "cover",
                  transition: "background-image 1.5s ease-in-out",
                  scrollbarWidth: "thin",
                  scrollbarColor: `${G.goldMuted} transparent`,
                }}
              >
                {renderMessages()}

                {/* Typing indicator */}
                {isTyping && <TypingIndicator />}

                {/* Scroll target */}
                <div ref={messagesEndRef} />
              </div>
            )}

            {/* CHAT INPUT (sticky bottom) — berre i idle med meldingar, utan BliKjentPanel */}
            {uiState === "idle" && messages.length > 0 && !showBliKjentPanel && (
              <div className="flex-shrink-0">
                <ChatInput onSend={handleSend} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}