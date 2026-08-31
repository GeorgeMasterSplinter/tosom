/**
 * Tosom — ChatHeader (Premium Nordic Gold 2026)
 * Ren, rolig header: navn + alder + avstand + dag + presence.
 * MoodSelector er nå separat ovenfor.
 *
 * Design:
 * - Glassmorphism bakgrunn
 * - Gull-aksenter
 * - Premium "Bli kjent"-knapp
 * - Journey-dag + fase
 * - Presence indicator (online/typing)
 */

"use client";

import { getPhaseForDay } from '@/lib/journey/engine';
import { usePresence } from '@/hooks/usePresence';
import { useChat } from '@/app/chat/context/ChatContext';
import { MoodTheme } from '@/app/chat/lib/mood';
import { useRouter } from 'next/navigation';

/* ═══════════════════════════════════════
   THEME TOKENS
   ═══════════════════════════════════════ */

const G = {
  gold: "#D4AF37",
  goldLight: "#E8C766",
  goldMuted: "rgba(212,175,55,0.2)",
  goldSoft: "rgba(212,175,55,0.08)",
  goldGlow: "rgba(212,175,55,0.4)",
  glassBg: "rgba(255,255,255,0.03)",
  glassBgHover: "rgba(255,255,255,0.06)",
  glassBorder: "rgba(255,255,255,0.08)",
  glassBorderGold: "rgba(212,175,55,0.25)",
  textPrimary: "rgba(255,255,255,0.95)",
  textSecondary: "rgba(255,255,255,0.6)",
  textMuted: "rgba(255,255,255,0.4)",
};

/* ═══════════════════════════════════════
   INTERFACES
   ═══════════════════════════════════════ */

interface PartnerInfo {
  id?: string;
  name: string;
  age: number;
  distanceKm?: number | null;
  imageUrl?: string;
}

/* ═══════════════════════════════════════
   PRESENCE DOT — Grøn/gul indikator
   ═══════════════════════════════════════ */

function PresenceDot({ partnerId, accent, tMuted }: { partnerId?: string | null; accent?: string; tMuted?: string }) {
  const { isOnline, isTyping: presenceTyping } = usePresence(partnerId || null);
  const { partnerTyping } = useChat();

  if (!partnerId) return null;

  // «Skriver...»: Pusher-eventet er hovedkilden (med én gang);
  // polling-flagget dekker opp ved Pusher-feil.
  const isTyping = presenceTyping || partnerTyping;

  return (
    <div className="flex items-center gap-1.5">
      {/* Online-punkt — mer synlig: 10px, glød og diskret puls mens online.
          Gull mens partneren skriver, grøn når online, grå når borte. */}
      <div className="relative flex items-center justify-center">
        <div
          className="w-2.5 h-2.5 rounded-full transition-all duration-300"
          style={{
            background: isTyping
              ? (accent ?? '#D4AF37')
              : isOnline ? '#34D399' : 'rgba(255,255,255,0.2)',
            boxShadow: isTyping
              ? `0 0 10px ${accent ?? 'rgba(212,175,55,0.55)'}`
              : isOnline ? '0 0 10px rgba(52,211,153,0.7)' : 'none',
          }}
        />
        {isOnline && (
          <div
            className="absolute inset-0 rounded-full animate-ping"
            style={{
              background: isTyping ? 'rgba(212,175,55,0.25)' : 'rgba(52,211,153,0.3)',
              animationDuration: '2s',
            }}
          />
        )}
      </div>
      {/* Typing / Online text */}
      {(isOnline || isTyping) && (
        <span
          className="text-[11px] italic transition-all duration-300"
          style={{ color: isTyping ? (accent ?? '#D4AF37') : (tMuted ?? 'rgba(255,255,255,0.4)') }}
        >
          {isTyping ? 'Skriver…' : 'Online'}
        </span>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   CHAT HEADER
   ═══════════════════════════════════════ */

interface ChatHeaderProps {
  partner?: PartnerInfo;
  journeyDay: number;
  onOpenBliKjent?: () => void;
  isBliKjentOpen?: boolean;
  onOpenOppgaver?: () => void;
  isOppgaverOpen?: boolean;
  onOpenMoods?: () => void;
  isMoodsOpen?: boolean;
  moodTheme?: MoodTheme;
}

export function ChatHeader({
  partner,
  journeyDay,
  onOpenBliKjent,
  isBliKjentOpen = false,
  onOpenOppgaver,
  isOppgaverOpen = false,
  onOpenMoods,
  isMoodsOpen = false,
  moodTheme,
}: ChatHeaderProps) {
  const router = useRouter();
  const isMilestone = journeyDay === 10 || journeyDay === 20 || journeyDay === 30;

  // Ett symbol for hvert av de 4 reisestega. Fasen kommer fra journey-motoren
  // (getPhaseForDay — samme grenser som driver den faktiske reisen).
  // Dag 0 (begge har ikke møtt opp enda) telles som første steg.
  const phase = journeyDay >= 1 ? getPhaseForDay(journeyDay).phase : "EARLY";
  const PHASE_SYMBOLS: Record<string, { emoji: string; name: string }> = {
    EARLY: { emoji: "🌱", name: "Bli kjent" },
    BUILDING_TRUST: { emoji: "🤝", name: "Bygger tillit" },
    DEEPER: { emoji: "💫", name: "Djupere samvær" },
    CHECKIN: { emoji: "🌙", name: "Refleksjon" },
  };
  const phaseSymbol = PHASE_SYMBOLS[phase] ?? PHASE_SYMBOLS.EARLY;

  // Mood-aksent faller tilbake til gull om tema ikke er gitt
  const accent = moodTheme?.accent ?? G.gold;
  const accentLight = moodTheme?.accentLight ?? G.goldLight;
  const accentMuted = moodTheme?.accentMuted ?? G.goldMuted;
  const accentSoft = moodTheme?.accentSoft ?? G.goldSoft;
  const accentGlow = moodTheme?.accentGlow ?? G.goldGlow;
  const accentBorder = moodTheme
    ? accentMuted.replace(/[\d.]+\)$/, "0.35)")
    : "rgba(212,175,55,0.35)";

  // Mood-tekstfarger
  const tPrimary = moodTheme?.textPrimary ?? G.textPrimary;
  const tSecondary = moodTheme?.textSecondary ?? G.textSecondary;
  const tMuted = moodTheme?.textMuted ?? G.textMuted;

  return (
    <div
      className="px-4 py-3 sm:px-6 sm:py-4 relative overflow-hidden"
      style={{
        borderBottom: `1px solid ${G.glassBorderGold}`,
        background: `linear-gradient(180deg, ${G.glassBg} 0%, transparent 100%)`,
      }}
    >
      {/* Subtil gull-glow i bakgrunnen */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background: 'radial-gradient(ellipse at 80% 50%, rgba(212,175,55,0.08) 0%, transparent 60%)',
        }}
      />

      <div className="flex items-center gap-3 relative z-10">
        {/* ═══ TILBAKKE — kun en pille med pil, uten tekst ═══ */}
        <button
          onClick={() => router.push('/dashboard')}
          className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300 hover:brightness-110"
          style={{
            background: G.glassBg,
            border: `1px solid ${G.glassBorder}`,
            color: G.textSecondary,
          }}
          aria-label="Tilbake til dashboard"
        >
          ←
        </button>

        {/* ═══ PARTNER INFO ═══ */}
        <div className="flex-1 min-w-0">
          {/* Navn — alder og avstand er fjernet (står på match-kortet i dashboard) */}
          <div className="flex items-center gap-2">
            <h2
              className="text-sm sm:text-base font-medium truncate"
              style={{ color: tPrimary }}
            >
              {partner?.name || "Din match"}
            </h2>
            <PresenceDot partnerId={partner?.id} accent={accent} tMuted={tMuted} />
          </div>

          {/* Fase-symbol + milestone — «Dag X av 30» er fjernet;
              symbolet viser hvilket av de 4 stega dere er i (én kilde:
              journey-motorens fasegrenser, ikke egne tall her). */}
          <div className="flex items-center gap-1.5 mt-0.5">
            <p
              className="text-sm transition-colors duration-500"
              style={{ color: accent }}
              aria-label={phaseSymbol.name}
              title={phaseSymbol.name}
            >
              {phaseSymbol.emoji}
            </p>

            {isMilestone && (
              <span
                className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold flex-shrink-0 transition-colors duration-500"
                style={{
                  background: `linear-gradient(135deg, ${accent}, ${accentLight})`,
                  color: '#0B1520',
                  boxShadow: `0 0 8px ${accentMuted}`,
                }}
              >
                ✨
              </span>
            )}
          </div>
        </div>

        {/* ═══ BLI KJENT-KNAPP — Premium med subtil pulse (mood-aksent) ═══ */}
        <button
          onClick={onOpenBliKjent}
          className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-500 group"
          style={{
            background: isBliKjentOpen
              ? accentGlow
              : `linear-gradient(135deg, ${accentSoft}, ${accentMuted})`,
            border: `1px solid ${isBliKjentOpen ? accentMuted : accentBorder}`,
            color: isBliKjentOpen ? accentLight : accent,
            boxShadow: isBliKjentOpen
              ? `0 0 24px ${accentGlow}, 0 0 8px ${accentMuted}`
              : undefined,
            animation: !isBliKjentOpen ? 'bli-kjent-pulse 3s ease-in-out infinite' : 'none',
          }}
        >
          <span className="text-base transition-transform duration-300 group-hover:rotate-12">📖</span>
          <span className="hidden sm:inline">Bli kjent</span>
        </button>

        {/* ═══ OPPGAVER-KNAPP — Premium med subtil pulse (mood-aksent) ═══ */}
        {onOpenOppgaver && (
          <button
            onClick={onOpenOppgaver}
            className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-500 group"
            style={{
              background: isOppgaverOpen
                ? accentGlow
                : `linear-gradient(135deg, ${accentSoft}, ${accentMuted})`,
              border: `1px solid ${isOppgaverOpen ? accentMuted : accentBorder}`,
              color: isOppgaverOpen ? accentLight : accent,
              boxShadow: isOppgaverOpen
                ? `0 0 24px ${accentGlow}, 0 0 8px ${accentMuted}`
                : undefined,
              animation: !isOppgaverOpen ? 'oppgaver-pulse 3.5s ease-in-out infinite' : 'none',
            }}
          >
            <span className="text-base transition-transform duration-300 group-hover:rotate-12">🎲</span>
            <span className="hidden sm:inline">Oppgaver</span>
          </button>
        )}

        {/* ═══ MOODS-KNAPP — Premium med subtil pulse (mood-aksent) ═══ */}
        {onOpenMoods && (
          <button
            onClick={onOpenMoods}
            className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-500 group"
            style={{
              background: isMoodsOpen
                ? accentGlow
                : `linear-gradient(135deg, ${accentSoft}, ${accentMuted})`,
              border: `1px solid ${isMoodsOpen ? accentMuted : accentBorder}`,
              color: isMoodsOpen ? accentLight : accent,
              boxShadow: isMoodsOpen
                ? `0 0 24px ${accentGlow}, 0 0 8px ${accentMuted}`
                : undefined,
              animation: !isMoodsOpen ? 'moods-pulse 4s ease-in-out infinite' : 'none',
            }}
          >
            <span className="text-base transition-transform duration-300 group-hover:rotate-12">🎨</span>
            <span className="hidden sm:inline">Moods</span>
          </button>
        )}

        {/* Pulse-animasjon for Bli kjent, Oppgaver og Moods knappar */}
        <style jsx>{`
          @keyframes bli-kjent-pulse {
            0%, 100% {
              box-shadow: 0 0 10px ${accentSoft};
              transform: scale(1);
            }
            50% {
              box-shadow: 0 0 22px ${accentMuted};
              transform: scale(1.03);
            }
          }
          @keyframes oppgaver-pulse {
            0%, 100% {
              box-shadow: 0 0 10px ${accentSoft};
              transform: scale(1);
            }
            50% {
              box-shadow: 0 0 22px ${accentMuted};
              transform: scale(1.03);
            }
          }
          @keyframes moods-pulse {
            0%, 100% {
              box-shadow: 0 0 10px ${accentSoft};
              transform: scale(1);
            }
            50% {
              box-shadow: 0 0 22px ${accentMuted};
              transform: scale(1.03);
            }
          }
        `}</style>
      </div>
    </div>
  );
}

export default ChatHeader;