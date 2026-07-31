/* eslint-disable @next/next/no-img-element */
/**
 * ToSom — MessageBubble (Premium Nordic Gold 2026) 🟡⭐
 * Premium komponent for alle meldingstyper: TEXT, IMAGE, TASK, CHOICE, SYSTEM
 * 
 * Design (oppdatert v2026):
 * - Glassmorphism bubble med backdrop-filter
 * - Gull-gradient for "me" bubbles
 * - Djupne-indikatorar med fargede glow-prikkar
 * - Milestone-feiring med gull-animasjon
 * - Warm-glow animasjon (600ms ease-out)
 * - Resonance-glow støtta (0-100 skala)
 * 
 * Bubble-design:
 * - "Me" (høgre): Gull-gradient bakgrunn, 20px radius, gull-border
 * - "Partner" (venstre): Glass-panel, 20px radius, subtil border
 * - System: Midst, gull-prikk ikon, glass-midtone
 * - Task: Premium kort med stjerne-ikon og gull-knappar
 * - Reflection: Mørk glass med blåleg tone
 */

"use client";

import { useEffect, useRef } from "react";

/* ═══════════════════════════════════════
   THEME TOKENS — PREMIUM GLASS V2
   ═══════════════════════════════════════ */

const G = {
  gold: "#D4AF37",
  goldLight: "#E8C766",
  goldDeep: "#C49F2F",
  goldMuted: "rgba(212,175,55,0.25)",
  goldSoft: "rgba(212,175,55,0.08)",
  goldGlow: "rgba(212,175,55,0.4)",
  blueDeep: "#0A1A2A",
  glassBg: "rgba(255,255,255,0.04)",
  glassBgHover: "rgba(255,255,255,0.06)",
  glassBorder: "rgba(255,255,255,0.08)",
  glassBorderGold: "rgba(212,175,55,0.2)",
  textPrimary: "rgba(255,255,255,0.95)",
  textSecondary: "rgba(255,255,255,0.6)",
  textMuted: "rgba(255,255,255,0.4)",
  
  // Bubble-spesifikke fargar
  bubbleMeBgStart: "rgba(212,175,55,0.18)",
  bubbleMeBgEnd: "rgba(212,175,55,0.06)",
  bubblePartnerBg: "rgba(255,255,255,0.04)",
  systemBg: "rgba(212,175,55,0.05)",
};

/* ═══════════════════════════════════════
   PROP-TYPE — MessageData
   ═══════════════════════════════════════ */

export interface MessageData {
  id: string;
  sender: "me" | "partner" | "system";
  type: "text" | "task" | "choice" | "system" | "image";
  content: string;
  resonanceLevel?: number; // 0–100, for resonance-glow
  isMilestone?: boolean; // milestone-melding
  isBliKjent?: boolean; // Bli kjent-spørsmål
  bliKjentCategory?: string; // kategori-ID (personlighet, verdiar, osv.)
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
   RESONANCE GLOW HELPER — Dynamisk glow
   ═══════════════════════════════════════ */

function getResonanceGlow(level: number = 0): { boxShadow: string; borderColor: string } {
  const intensity = Math.min(level / 100, 1);
  const blur = 8 + intensity * 16; // 8–24px
  const spread = intensity * 6; // 0–6px
  return {
    boxShadow: `0 4px ${blur}px rgba(212,175,55,${0.1 + intensity * 0.2}), 0 0 ${spread}px rgba(212,175,55,${intensity * 0.15})`,
    borderColor: `rgba(212,175,55,${0.2 + intensity * 0.3})`,
  };
}

/* ═══════════════════════════════════════
   PREMIUM BUTTON — Gull-knapp v2
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
        height: "42px",
        padding: "0 20px",
        fontSize: "13px",
        fontWeight: 700,
        letterSpacing: "0.02em",
        boxShadow: `0 4px 16px ${G.goldMuted}`,
      }}
    >
      {children}
    </button>
  );
}

/* ═══════════════════════════════════════
   MILESTONE BUBBLE — Milestone-feiring
   ═══════════════════════════════════════ */

function MilestoneBubble({ message }: { message: MessageData }) {
  const day = message.metadata?.day || 10;
  
  return (
    <div className="flex justify-center py-4">
      <div
        className="w-full max-w-[90%] relative overflow-hidden rounded-2xl p-6 text-center"
        style={{
          background: `linear-gradient(135deg, rgba(212,175,55,0.08), rgba(212,175,55,0.03))`,
          border: `1px solid ${G.goldMuted}`,
          boxShadow: `0 0 40px ${G.goldSoft}, 0 8px 32px rgba(0,0,0,0.2)`,
        }}
      >
        {/* Animerande gull-bakgrunn */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(212,175,55,0.15), transparent 70%)',
            animation: 'milestone-glow 3s ease-in-out infinite',
          }}
        />

        <div className="relative z-10">
          {/* Store stjerne-ikon */}
          <div 
            className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${G.gold}, ${G.goldLight})`,
              boxShadow: `0 0 24px ${G.goldMuted}`,
            }}
          >
            <svg width="24" height="24" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L9.5 5.5L14 6L10.5 9.5L11.5 14L8 11.5L4.5 14L5.5 9.5L2 6L6.5 5.5L8 1Z" fill="#0B1520" />
            </svg>
          </div>

          {/* Milestone-tekst */}
          <p 
            className="text-lg font-bold mb-1"
            style={{ color: G.goldLight }}
          >
            ✨ Dag {day} av 30
          </p>
          <p 
            className="text-sm font-medium"
            style={{ color: G.textPrimary }}
          >
            {message.content || 'Ein ny fase byrjar...'}
          </p>
        </div>
      </div>

      {/* CSS for milestone animation */}
      <style jsx>{`
        @keyframes milestone-glow {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════
   TASK BUBBLE — Premium oppgåve-kort v2
   ═══════════════════════════════════════ */

function TaskBubble({ message }: { message: MessageData }) {
  return (
    <div className="flex justify-center py-3">
      <div
        className="w-full max-w-[90%] relative overflow-hidden rounded-2xl transition-all duration-300 hover:scale-[1.005]"
        style={{
          background: `linear-gradient(135deg, ${G.systemBg}, rgba(212,175,55,0.02))`,
          border: `1px solid ${G.goldMuted}`,
          boxShadow: `0 4px 24px rgba(212,175,55,0.06), 0 2px 8px rgba(0,0,0,0.15)`,
        }}
      >
        {/* Subtil gull-stripe øvst */}
        <div 
          className="absolute top-0 left-0 right-0 h-1"
          style={{
            background: `linear-gradient(90deg, transparent, ${G.gold}, transparent)`,
            opacity: 0.5,
          }}
        />

        <div className="p-5">
          {/* Task header — Gull-stjerne + tittel */}
          <div className="flex items-start gap-3.5 mb-3.5">
            <div
              className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${G.gold}, ${G.goldLight})`,
                boxShadow: `0 0 16px ${G.goldMuted}`,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M8 1L9.5 5.5L14 6L10.5 9.5L11.5 14L8 11.5L4.5 14L5.5 9.5L2 6L6.5 5.5L8 1Z" fill="#0B1520" />
              </svg>
            </div>
            <div className="flex-1">
              {message.metadata?.taskTitle && (
                <p
                  className="text-sm font-bold mb-0.5 tracking-wide"
                  style={{ color: G.gold, letterSpacing: "0.03em" }}
                >
                  ✨ {message.metadata.taskTitle}
                </p>
              )}
              <p
                className="text-[15px] leading-relaxed"
                style={{ color: 'rgba(255,255,255,0.7)' }}
              >
                {message.content}
              </p>
            </div>
          </div>

          {/* Choices — Premium gull-knappar */}
          {message.metadata?.choices && message.metadata.choices.length > 0 && (
            <div className="flex gap-3 mt-5 flex-wrap">
              {message.metadata.choices.map((choice) => (
                <GoldButton key={choice.value}>{choice.label}</GoldButton>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   REFLECTION BUBBLE — Dype spørsmål v2
   ═══════════════════════════════════════ */

function ReflectionBubble({ message }: { message: MessageData }) {
  return (
    <div className="flex justify-center py-3">
      <div
        className="w-full max-w-[88%] relative overflow-hidden rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(10,26,42,0.5), rgba(74,123,167,0.06))',
          border: `1px solid rgba(100,140,200,0.12)`,
          boxShadow: '0 4px 24px rgba(0,0,0,0.25), inset 0 0 32px rgba(10,26,42,0.15)',
        }}
      >
        {/* Subtil blå accent-stripe */}
        <div 
          className="absolute top-0 left-0 right-0 h-1"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(74,123,167,0.4), transparent)',
          }}
        />

        <div className="p-5">
          <div className="flex items-start gap-3.5">
            {/* Gull stjerne-ikon */}
            <div
              className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
              style={{ 
                background: 'rgba(212,175,55,0.1)',
                border: '1px solid rgba(212,175,55,0.2)',
              }}
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M8 1L9.5 5.5L14 6L10.5 9.5L11.5 14L8 11.5L4.5 14L5.5 9.5L2 6L6.5 5.5L8 1Z" fill={G.gold} />
              </svg>
            </div>
            <div className="flex-1 text-center">
              <p
                className="text-[16px] leading-relaxed font-light tracking-wide"
                style={{ color: G.textPrimary, fontWeight: 300 }}
              >
                {message.content}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   SYSTEM CARD — Premium systemmelding v2
   ═══════════════════════════════════════ */

function SystemCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl px-5 py-4 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${G.systemBg}, rgba(212,175,55,0.02))`,
        border: `1px solid ${G.goldMuted}`,
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      }}
    >
      {/* Tynn gull-stripe øvst */}
      <div 
        className="absolute top-0 left-4 right-4 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${G.gold}, transparent)`,
          opacity: 0.4,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/* ═══════════════════════════════════════
   IMAGE CONTENT — Bilde-melding v2
   ═══════════════════════════════════════ */

// eslint-disable-next-line no-unused-vars
function ImageContent({ imageUrl }: { imageUrl: string }) {
  return (
    <div className="relative mt-3 rounded-xl overflow-hidden group">
      <img
        src={imageUrl}
        alt="Melding"
        className="max-w-full rounded-xl transition-transform duration-500 group-hover:scale-[1.01]"
        style={{ 
          borderRadius: "16px", 
          boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
        }}
      />
      {/* Glass-overlegg */}
      <div 
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.05), transparent)',
        }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════
   TIMESTAMP — Tidløyper v2
   ═══════════════════════════════════════ */

function Timestamp({ value }: { value: string }) {
  try {
    const date = new Date(value);
    if (isNaN(date.getTime())) return null;
    return (
      <p
        className="text-[10px] mt-1.5 text-right tracking-wide"
        style={{ color: G.textMuted }}
      >
        {date.toLocaleTimeString("no", { hour: "2-digit", minute: "2-digit" })}
      </p>
    );
  } catch {
    return null;
  }
}

/* ═══════════════════════════════════════
   AVATAR — Premium profilbilde v2
   ═══════════════════════════════════════ */

function Avatar({ senderInfo }: { senderInfo?: { name: string; imageUrl?: string } }) {
  if (!senderInfo) return null;

  return (
    <div className="flex-shrink-0 mr-2.5 self-end">
      {senderInfo.imageUrl ? (
        <img
          src={senderInfo.imageUrl}
          alt={senderInfo.name}
          className="w-8 h-8 rounded-full object-cover"
          style={{ 
            border: `1.5px solid ${G.goldMuted}`,
            boxShadow: `0 0 8px ${G.goldSoft}`,
          }}
        />
      ) : (
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
          style={{
            background: `linear-gradient(135deg, ${G.goldMuted}, rgba(212,175,55,0.08))`,
            border: `1px solid ${G.goldMuted}`,
            color: G.gold,
            boxShadow: `0 0 6px ${G.goldSoft}`,
          }}
        >
          {senderInfo.name.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   HOVEDKOMPONENT — MESSAGEBUBBLE v2
   Premium redesigned med fleire nye effektar
   ═══════════════════════════════════════ */

export function MessageBubble({ message }: MessageBubbleProps) {
  const { id, sender, type, content, metadata, resonanceLevel, isMilestone, isBliKjent } = message;
  const isMe = sender === "me";
  const isSystem = sender === "system";

  // Ref for animasjon
  const bubbleRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (bubbleRef.current) {
      bubbleRef.current.style.animation = "warmGlow 0.6s ease-out forwards";
    }
  }, [id]);

  // ═══ MILESTONE BUBBLE — milestone-feiring ═══
  if (isMilestone || (type === "system" && content.includes("Dag") && content.includes("av 30"))) {
    return (
      <div style={{ marginBottom: "24px" }}>
        <MilestoneBubble message={message} />
      </div>
    );
  }

  // ═══ IMAGE BUBBLE — bilede frå chat ═══
  if (message.type === "image") {
    const imageUrl = metadata?.imageUrl || content;
    return (
      <div
        className={`flex ${sender === "me" ? "justify-end" : "justify-start"} py-3 px-6 animate-warmGlowIn`}
      >
        <div
          className="rounded-2xl overflow-hidden relative max-w-[280px]"
          style={{ borderRadius: '16px' }}
        >
          <img
            src={imageUrl}
            alt="Bilete"
            className="w-full h-auto block"
            style={{ borderRadius: '16px' }}
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
          {/* Overlay-glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              borderRadius: '16px',
              boxShadow: `inset 0 0 20px ${sender === "me" ? G.goldSoft : 'transparent'}`,
            }}
          />
        </div>
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

  // ═══ SYSTEM-MELDING — premium kort-layout ═══
  if (isSystem) {
    return (
      <div style={{ marginBottom: "20px" }}>
        <SystemCard>
          <div className="flex items-start gap-3">
            {/* Gull prikke-ikon med glow */}
            <div
              className="w-4 h-4 rounded-full flex-shrink-0 mt-0.5"
              style={{
                background: `linear-gradient(135deg, ${G.gold}, ${G.goldLight})`,
                boxShadow: `0 0 10px ${G.goldMuted}`,
              }}
            />
            <div className="flex-1">
              {metadata?.taskTitle && (
                <p
                  className="text-sm font-bold mb-1.5 tracking-wide"
                  style={{ color: G.gold, letterSpacing: "0.03em" }}
                >
                  ✨ {metadata.taskTitle}
                </p>
              )}
              <p
                className="text-[14px] leading-relaxed"
                style={{ color: 'rgba(255,255,255,0.65)' }}
              >
                {content}
              </p>
            </div>
          </div>

          {/* Choices (knappar under system-melding) */}
          {metadata?.choices && metadata.choices.length > 0 && (
            <div className="flex gap-3 mt-5 flex-wrap">
              {metadata.choices.map((choice) => (
                <GoldButton key={choice.value}>
                  {choice.label}
                </GoldButton>
              ))}
            </div>
          )}

        </SystemCard>
      </div>
    );
  }

  // ═══ REFLECTION BUBBLE — for dype partner-meldingar ═══
  if (type === "text" && content.trim().length > 60 && sender === "partner") {
    return (
      <div style={{ marginBottom: "20px" }}>
        <ReflectionBubble message={message} />
      </div>
    );
  }

  // ═══ BRUKAR-MELDING — Premium bubble v2 ═══
  const isLeft = sender === "partner";
  const resonanceGlow = getResonanceGlow(resonanceLevel || (isMe ? 30 : 10));

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

      {/* Bubble-container */}
      <div ref={bubbleRef} style={{ maxWidth: "85%" }}>
        <div
          className="px-5 py-[16px] relative overflow-hidden"
          style={{
            background: isMe
              ? `linear-gradient(135deg, ${G.bubbleMeBgStart}, ${G.bubbleMeBgEnd})`
              : `linear-gradient(135deg, ${G.glassBg}, rgba(255,255,255,0.02))`,
            border: isMe
              ? `1px solid ${G.goldMuted}`
              : `1px solid ${G.glassBorder}`,
            borderRadius: isMe
              ? "20px 20px 6px 20px"
              : "20px 20px 20px 6px",
            boxShadow: isMe
              ? resonanceGlow.boxShadow
              : '0 4px 16px rgba(0,0,0,0.2)',
          }}
        >
          {/* Subtilt glass-overlegg for "me" */}
          {isMe && (
            <div 
              className="absolute top-0 left-0 right-0 h-px opacity-40"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
              }}
            />
          )}

          {/* Bli kjent-badge */}
          {isBliKjent && (
            <div className="flex items-center gap-1.5 mb-2">
              <div
                className="px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase"
                style={{
                  background: 'rgba(212, 175, 55, 0.15)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  color: '#D4AF37',
                }}
              >
                💎 Bli kjent
              </div>
            </div>
          )}

          {/* Tekst — premium typografi */}
          <p
            className="leading-relaxed relative z-10"
            style={{
              color: isMe ? G.textPrimary : 'rgba(255,255,255,0.8)',
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
        </div>

        {/* Resonance-indikator for "me" med høg resonance */}
        {isMe && resonanceLevel && resonanceLevel > 50 && (
          <div 
            className="mt-1 flex items-center justify-end gap-1"
          >
            <div 
              className="w-1.5 h-1.5 rounded-full"
              style={{ 
                background: G.gold,
                boxShadow: `0 0 4px ${G.goldMuted}`,
              }}
            />
            <span 
              className="text-[9px] font-medium tracking-wider uppercase"
              style={{ color: G.textMuted }}
            >
              Resonans
            </span>
          </div>
        )}

        {/* Partner-navn (venstre side) */}
        {!isMe && metadata?.senderInfo && sender === "partner" && (
          <p
            className="mt-1.5 ml-2 text-[11px] font-medium tracking-wide"
            style={{ color: G.textMuted }}
          >
            {metadata.senderInfo.name}
          </p>
        )}
      </div>

      {/* Tomt rom for symmetri */}
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