/**
 * ToSom — Unified MessageBubble (Premium Nordic Gold 2026) 🟡
 * EIN komponent for alle meldingstyper: TEXT, IMAGE, TASK, CHOICE, SYSTEM
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
  tosomBlue: "#0B1520",
  glassBg: "rgba(255,255,255,0.04)",
  glassBorder: "rgba(255,255,255,0.1)",
  textPrimary: "rgba(255,255,255,0.92)",
  textSecondary: "rgba(255,255,255,0.55)",
  bubbleMeBg: "linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.08))",
};

/* ═══════════════════════════════════════
   PROP-TYPE
   ═══════════════════════════════════════ */

interface MessageBubbleProps {
  message: {
    id: string;
    sender: "me" | "partner" | "system";
    type: "text" | "image" | "task" | "choice" | "system";
    content: string;
    metadata?: {
      imageUrl?: string;
      taskTitle?: string;
      choices?: Array<{ label: string; value: string }>;
      day?: number;
      phase?: string;
      timestamp?: Date;
      senderInfo?: { name: string; imageUrl?: string };
    };
  };
}

/* ═══════════════════════════════════════
   PREMIUM BUTTON (gull)
   ═══════════════════════════════════════ */

function GoldButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="transition-all duration-300 hover:brightness-110 active:scale-[0.98] focus:outline-none"
      style={{
        background: `linear-gradient(135deg, ${G.gold}, ${G.goldLight})`,
        color: G.tosomBlue,
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
   SYSTEM-BAKEGRUNN (broader card)
   ═══════════════════════════════════════ */

function SystemCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl px-5 py-4"
      style={{
        background: "rgba(212,175,55,0.06)",
        border: `1px solid ${G.goldMuted}`,
        boxShadow: `0 4px 16px rgba(0,0,0,0.15)`,
      }}
    >
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════
   HOVEDKOMPONENT — MESSAGEBUBBLE
   ═══════════════════════════════════════ */

export function MessageBubble({ message }: MessageBubbleProps) {
  const { id, sender, type, content, metadata } = message;
  const isMe = sender === "me";
  const isSystem = sender === "system";

  // Ref for animasjon
  const bubbleRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (bubbleRef.current) {
      bubbleRef.current.style.animation = "bubblePop 0.2s ease-out forwards";
    }
  }, [id]);

  // ═══ SYSTEM/MELDINGAR (broader card layout) ═══
  if (isSystem) {
    return (
      <div className="flex justify-center py-2">
        <SystemCard>
          {/* System-icon */}
          <div className="flex items-start gap-3">
            <div
              className="w-5 h-5 rounded-full flex-shrink-0 mt-0.5"
              style={{
                background: `linear-gradient(135deg, ${G.gold}, ${G.goldLight})`,
                boxShadow: `0 0 12px ${G.goldMuted}`,
              }}
            />
            <div className="flex-1">
              {metadata?.taskTitle && (
                <p
                  className="text-sm font-semibold mb-1"
                  style={{ color: G.gold, letterSpacing: "0.05em" }}
                >
                  [{metadata.taskTitle}]
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
            <div className="flex gap-2 mt-4 flex-wrap">
              {metadata.choices.map((choice) => (
                <GoldButton key={choice.value}>
                  {choice.label}
                </GoldButton>
              ))}
            </div>
          )}

          {/* Image content */}
          {type === "image" && metadata?.imageUrl && (
            <img
              src={metadata.imageUrl}
              alt="Melding"
              className="mt-3 rounded-xl max-w-full"
              style={{ borderRadius: "16px", boxShadow: `0 4px 20px rgba(0,0,0,0.3)` }}
            />
          )}
        </SystemCard>
      </div>
    );
  }

  // ═══ BRUKAR-MELDING (egen/partner) ═══
  const isLeft = sender === "partner";

  return (
    <div
      className="flex py-2"
      style={{ justifyContent: isMe ? "flex-end" : "flex-start" }}
    >
      {/* Avatar */}
      {!isMe && metadata?.senderInfo && (
        <div className="flex-shrink-0 mr-2 self-end">
          {metadata.senderInfo.imageUrl ? (
            <img
              src={metadata.senderInfo.imageUrl}
              alt={metadata.senderInfo.name}
              className="w-8 h-8 rounded-full object-cover border border-[rgba(212,175,55,0.3)]"
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
              {metadata.senderInfo.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      )}

      {/* Bubble */}
      <div ref={bubbleRef}>
        <div
          className="px-5 py-3 max-w-[75%]"
          style={{
            background: isMe
              ? `linear-gradient(135deg, ${G.gold}20, ${G.goldMuted})`
              : G.glassBg,
            border: isMe ? `1px solid ${G.goldMuted}` : `1px solid ${G.glassBorder}`,
            borderRadius: isMe
              ? "16px 16px 4px 16px"
              : "16px 16px 16px 4px",
            boxShadow: `0 2px 8px rgba(0,0,0,0.15)`,
          }}
        >
          {/* Tekst-innhald — 16px premium typografi */}
          <p
            className="leading-relaxed"
            style={{ color: G.textPrimary, whiteSpace: "pre-wrap", wordBreak: "break-word", fontSize: "16px" }}
          >
            {content}
          </p>

          {/* Timestamp (liten) */}
          {metadata?.timestamp && (
            <p
              className="text-[10px] mt-1.5 text-right"
              style={{ color: G.textSecondary }}
            >
              {new Date(metadata.timestamp).toLocaleTimeString("no", { hour: "2-digit", minute: "2-digit" })}
            </p>
          )}

          {/* Image content */}
          {type === "image" && metadata?.imageUrl && (
            <img
              src={metadata.imageUrl}
              alt="Melding"
              className="mt-3 rounded-xl max-w-full"
              style={{ borderRadius: "16px", boxShadow: `0 4px 20px rgba(0,0,0,0.3)` }}
            />
          )}
        </div>

        {/* Partner-navn (venstre side) */}
        {!isMe && metadata?.senderInfo && sender === "partner" && (
          <p
            className="mt-1 ml-2"
            style={{ color: G.textSecondary, fontSize: "13px" }}
          >
            {metadata.senderInfo.name}
          </p>
        )}
      </div>
    </div>
  );
}

export default MessageBubble;