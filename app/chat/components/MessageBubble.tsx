/**
 * ToSom — MessageBubble (Premium Nordic Gold 2026) 🟡⭐
 * Unified komponent for alle meldingstyper: TEXT, IMAGE, TASK, CHOICE, SYSTEM
 * 
 * Design:
 * - 20px border-radius for premium-følelse
 * - 16–20px padding
 * - 16–24px spacing mellom meldingar
 * - Soft shadow: 0 4px 16px rgba(0,0,0,0.25)
 * - Warm-glow animasjon (600ms)
 * - Resonance-glow støtta
 */

"use client";

import { useEffect, useRef } from "react";

/* ═══════════════════════════════════════
   THEME TOKENS
   ═══════════════════════════════════════ */

const G = {
  gold: "#D4AF37",
  goldLight: "#E8C766",
  goldMuted: "rgba(212,175,55,0.2)",
  goldSoft: "rgba(212,175,55,0.06)",
  blueDeep: "#0A1A2A",
  glassBg: "rgba(255,255,255,0.04)",
  glassBorder: "rgba(255,255,255,0.08)",
  textPrimary: "rgba(255,255,255,0.92)",
  textSecondary: "rgba(255,255,255,0.55)",
  bubbleMeBg: "linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.08))",
};

/* ═══════════════════════════════════════
   PROP-TYPE
   ═══════════════════════════════════════ */

export interface MessageData {
  id: string;
  sender: "me" | "partner" | "system";
  type: "text" | "image" | "task" | "choice" | "system";
  content: string;
  resonanceLevel?: number; // 0–100, for resonance-glow
  metadata?: {
    imageUrl?: string;
    taskTitle?: string;
    choices?: Array<{ label: string; value: string }>;
    day?: number;
    phase?: string;
    timestamp?: Date | string;
    senderInfo?: { name: string; imageUrl?: string };
  };
}

interface MessageBubbleProps {
  message: MessageData;
}

/* ═══════════════════════════════════════
   RESONANCE GLOW HELPER
   ═══════════════════════════════════════ */

function getResonanceGlow(level: number = 0): { boxShadow: string; borderColor: string } {
  const intensity = Math.min(level / 100, 1);
  const blur = 8 + intensity * 12; // 8–20px
  const spread = intensity * 4; // 0–4px
  return {
    boxShadow: `0 4px ${blur}px rgba(212,175,55,${0.1 + intensity * 0.15}), 0 0 ${spread}px rgba(212,175,55,${intensity * 0.1})`,
    borderColor: `rgba(212,175,55,${0.15 + intensity * 0.25})`,
  };
}

/* ═══════════════════════════════════════
   PREMIUM BUTTON (gull)
   ═══════════════════════════════════════ */

function GoldButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="transition-all duration-300 hover:brightness-110 active:scale-[0.98] focus:outline-none"
      style={{
        background: `linear-gradient(135deg, ${G.gold}, ${G.goldLight})`,
        color: G.blueDeep,
        borderRadius: "12px",
        height: "40px",
        padding: "0 16px",
        fontSize: "13px",
        fontWeight: 600,
      }}
    >
      {children}
    </button>
  );
}

/* ═══════════════════════════════════════
   TASK BUBBLE — Guidet oppgåve-kort
   ═══════════════════════════════════════ */

function TaskBubble({ message }: { message: MessageData }) {
  return (
    <div className="flex justify-center py-3">
      <div
        className="w-full max-w-[90%]"
        style={{
          background: "rgba(212,175,55,0.04)",
          border: `1px solid rgba(212,175,55,0.18)`,
          borderRadius: "20px",
          padding: "20px",
          boxShadow: "0 4px 20px rgba(212,175,55,0.08), 0 2px 8px rgba(0,0,0,0.15)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Task header — gull-ikon + tittel */}
        <div className="flex items-start gap-3 mb-3">
          <div
            className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${G.gold}, ${G.goldLight})`,
              boxShadow: `0 0 12px rgba(212,175,55,0.25)`,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L9.5 5.5L14 6L10.5 9.5L11.5 14L8 11.5L4.5 14L5.5 9.5L2 6L6.5 5.5L8 1Z" fill="#0B1520" />
            </svg>
          </div>
          <div className="flex-1">
            {message.metadata?.taskTitle && (
              <p
                className="text-sm font-semibold mb-0.5"
                style={{ color: G.gold, letterSpacing: "0.04em" }}
              >
                {message.metadata.taskTitle}
              </p>
            )}
            <p
              className="text-sm leading-relaxed"
              style={{ color: G.textSecondary, fontSize: "15px" }}
            >
              {message.content}
            </p>
          </div>
        </div>

        {/* Choices — store gull-knappar */}
        {message.metadata?.choices && message.metadata.choices.length > 0 && (
          <div className="flex gap-2.5 mt-4 flex-wrap">
            {message.metadata.choices.map((choice) => (
              <GoldButton key={choice.value}>{choice.label}</GoldButton>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   REFLECTION BUBBLE — Dype spørsmål
   ═══════════════════════════════════════ */

function ReflectionBubble({ message }: { message: MessageData }) {
  return (
    <div className="flex justify-center py-3">
      <div
        className="w-full max-w-[85%]"
        style={{
          background: "rgba(10,26,42,0.45)",
          border: `1px solid rgba(100,140,200,0.15)`,
          borderRadius: "20px",
          padding: "24px 20px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3), inset 0 0 24px rgba(10,26,42,0.2)",
        }}
      >
        <div className="flex items-start gap-3">
          {/* Gull stjerne-ikon */}
          <div
            className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
            style={{ background: "rgba(212,175,55,0.12)" }}
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L9.5 5.5L14 6L10.5 9.5L11.5 14L8 11.5L4.5 14L5.5 9.5L2 6L6.5 5.5L8 1Z" fill={G.gold} />
            </svg>
          </div>
          <div className="flex-1 text-center">
            <p
              className="text-[17px] leading-relaxed font-light"
              style={{ color: G.textPrimary, fontSize: "17px", fontWeight: 300 }}
            >
              {message.content}
            </p>
            <p
              className="text-xs mt-3 italic"
              style={{ color: G.textSecondary, opacity: 0.6 }}
            >
              Ta deg tid
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   SYSTEM CARD — Systemmeldingar
   ═══════════════════════════════════════ */

function SystemCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-[20px] px-5 py-4"
      style={{
        background: "rgba(212,175,55,0.05)",
        border: `1px solid ${G.goldMuted}`,
        boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
      }}
    >
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════
   IMAGE CONTENT — Bilde-melding
   ═══════════════════════════════════════ */

function ImageContent({ imageUrl }: { imageUrl: string }) {
  return (
    <img
      src={imageUrl}
      alt="Melding"
      className="mt-3 rounded-[16px] max-w-full"
      style={{ borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}
    />
  );
}

/* ═══════════════════════════════════════
   TIMESTAMP — Tidløyper
   ═══════════════════════════════════════ */

function Timestamp({ value }: { value: string }) {
  try {
    const date = new Date(value);
    if (isNaN(date.getTime())) return null;
    return (
      <p
        className="text-[10px] mt-1.5 text-right"
        style={{ color: G.textSecondary }}
      >
        {date.toLocaleTimeString("no", { hour: "2-digit", minute: "2-digit" })}
      </p>
    );
  } catch {
    return null;
  }
}

/* ═══════════════════════════════════════
   AVATAR — Partner-profilbilde
   ═══════════════════════════════════════ */

function Avatar({ senderInfo }: { senderInfo?: { name: string; imageUrl?: string } }) {
  if (!senderInfo) return null;

  return (
    <div className="flex-shrink-0 mr-2.5 self-end">
      {senderInfo.imageUrl ? (
        <img
          src={senderInfo.imageUrl}
          alt={senderInfo.name}
          className="w-8 h-8 rounded-full object-cover border"
          style={{ border: `1.5px solid ${G.goldMuted}` }}
        />
      ) : (
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
          style={{
            background: `linear-gradient(135deg, ${G.goldMuted}, rgba(212,175,55,0.1))`,
            border: `1px solid ${G.goldMuted}`,
            color: G.gold,
          }}
        >
          {senderInfo.name.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   HOVEDKOMPONENT — MESSAGEBUBBLE
   ═══════════════════════════════════════ */

export function MessageBubble({ message }: MessageBubbleProps) {
  const { id, sender, type, content, metadata, resonanceLevel } = message;
  const isMe = sender === "me";
  const isSystem = sender === "system";

  // Ref for animasjon
  const bubbleRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (bubbleRef.current) {
      bubbleRef.current.style.animation = "warmGlow 0.6s ease-out forwards";
    }
  }, [id]);

  // ═══ REFLECTION BUBBLE — for dype spørsmål ═══
  if (type === "text" && content.trim().length > 60 && sender === "partner") {
    // Automatisk reflection-bubble for lange partner-meldingar
    return (
      <div style={{ marginBottom: "20px" }}>
        <ReflectionBubble message={message} />
      </div>
    );
  }

  // ═══ TASK BUBBLE — guidet oppgåve ═══
  if (type === "task") {
    return (
      <div style={{ marginBottom: "20px" }}>
        <TaskBubble message={message} />
      </div>
    );
  }

  // ═══ SYSTEM-MELDING — brei kort-layout ═══
  if (isSystem) {
    return (
      <div style={{ marginBottom: "20px" }}>
        <SystemCard>
          <div className="flex items-start gap-3">
            {/* Gull prikke-ikon */}
            <div
              className="w-4 h-4 rounded-full flex-shrink-0 mt-0.5"
              style={{
                background: `linear-gradient(135deg, ${G.gold}, ${G.goldLight})`,
                boxShadow: `0 0 8px ${G.goldMuted}`,
              }}
            />
            <div className="flex-1">
              {metadata?.taskTitle && (
                <p
                  className="text-sm font-semibold mb-1.5"
                  style={{ color: G.gold, letterSpacing: "0.04em" }}
                >
                  {metadata.taskTitle}
                </p>
              )}
              <p
                className="text-sm leading-relaxed"
                style={{ color: G.textSecondary }}
              >
                {content}
              </p>
            </div>
          </div>

          {/* Choices (knappar under system-melding) */}
          {metadata?.choices && metadata.choices.length > 0 && (
            <div className="flex gap-2.5 mt-4 flex-wrap">
              {metadata.choices.map((choice) => (
                <GoldButton key={choice.value}>
                  {choice.label}
                </GoldButton>
              ))}
            </div>
          )}

          {/* Image content */}
          {type === "image" && metadata?.imageUrl && (
            <ImageContent imageUrl={metadata.imageUrl} />
          )}
        </SystemCard>
      </div>
    );
  }

  // ═══ BRUKAR-MELDING — egen/partner ═══
  const isLeft = sender === "partner";

  return (
    <div
      style={{
        marginBottom: "20px",
        justifyContent: isMe ? "flex-end" : "flex-start",
      }}
      className="flex"
    >
      {/* Avatar for partner */}
      {isLeft && !isMe && metadata?.senderInfo && <Avatar senderInfo={metadata.senderInfo} />}

      {/* Bubble */}
      <div ref={bubbleRef} style={{ maxWidth: "85%" }}>
        <div
          className="px-5 py-[16px]"
          style={{
            background: isMe
              ? `linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.08))`
              : G.glassBg,
            border: isMe
              ? `1px solid ${G.goldMuted}`
              : `1px solid ${G.glassBorder}`,
            borderRadius: isMe
              ? "20px 20px 6px 20px"
              : "20px 20px 20px 6px",
            boxShadow: isMe
              ? getResonanceGlow(resonanceLevel || 0).boxShadow
              : "0 4px 16px rgba(0,0,0,0.25)",
            ...(isMe && resonanceLevel
              ? { borderColor: getResonanceGlow(resonanceLevel).borderColor }
              : {}),
          }}
        >
          {/* Tekst — premium typografi */}
          <p
            className="leading-relaxed"
            style={{
              color: G.textPrimary,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              fontSize: "15px",
              lineHeight: "1.6",
            }}
          >
            {content}
          </p>

          {/* Timestamp */}
          {metadata?.timestamp && <Timestamp value={String(metadata.timestamp)} />}

          {/* Image content */}
          {type === "image" && metadata?.imageUrl && (
            <ImageContent imageUrl={metadata.imageUrl} />
          )}
        </div>

        {/* Partner-navn (venstre side) */}
        {!isMe && metadata?.senderInfo && sender === "partner" && (
          <p
            className="mt-1.5 ml-2"
            style={{ color: G.textSecondary, fontSize: "12px" }}
          >
            {metadata.senderInfo.name}
          </p>
        )}
      </div>

      {/* Ingen avatar for "me" — men vi held rommet symmetrisk */}
      {isMe && (
        <div className="w-8.5 flex-shrink-0 mr-2.5" />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   CSS ANIMASJONAR — inline
   ═══════════════════════════════════════ */

export function MessageBubbleStyles() {
  return (
    <style>{`
      @keyframes warmGlow {
        0% {
          opacity: 0;
          transform: translateY(8px) scale(0.97);
          filter: brightness(0.85);
        }
        40% {
          filter: brightness(1.08);
        }
        100% {
          opacity: 1;
          transform: translateY(0) scale(1);
          filter: brightness(1);
        }
      }

      @keyframes softLand {
        0% {
          opacity: 0;
          transform: translateY(12px);
        }
        100% {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .message-bubble-enter {
        animation: warmGlow 0.6s ease-out forwards;
      }

      .message-system-enter {
        animation: softLand 0.45s ease-out forwards;
      }
    `}</style>
  );
}

export default MessageBubble;