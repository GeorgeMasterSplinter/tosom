/**
 * ToSom — ChatHeader (Premium Nordic Gold 2026) 🟡⭐
 * Premium glass-header med gull-aksentar og animerande effektar.
 * 
 * Design:
 * - Glassmorphism bakgrunn med backdrop-blur
 * - Gull-border bottom med subtil gradient
 * - Premium "Bli kjent"-knapp med glow-effekt
 * - Animer status-indikator
 * - Journey-milestone badge (dag 10/20/30)
 */

"use client";

import { useState } from 'react';
import Image from 'next/image';

/* ═══════════════════════════════════════
   THEME TOKENS — PREMIUM GLASS
   ═══════════════════════════════════════ */

const G = {
  gold: "#D4AF37",
  goldLight: "#E8C766",
  goldDeep: "#C49F2F",
  goldMuted: "rgba(212,175,55,0.2)",
  goldSoft: "rgba(212,175,55,0.08)",
  goldGlow: "rgba(212,175,55,0.4)",
  glassBg: "rgba(255,255,255,0.03)",
  glassBgHover: "rgba(255,255,255,0.06)",
  glassBgActive: "rgba(212,175,55,0.1)",
  glassBorder: "rgba(255,255,255,0.08)",
  glassBorderGold: "rgba(212,175,55,0.25)",
  textPrimary: "rgba(255,255,255,0.95)",
  textSecondary: "rgba(255,255,255,0.6)",
  textMuted: "rgba(255,255,255,0.4)",
  successGreen: "#4DFF88",
  successGreenGlow: "rgba(77,255,136,0.3)",
};

/* ═══════════════════════════════════════
   INTERFACES
   ═══════════════════════════════════════ */

interface PartnerInfo {
  name: string;
  age: number;
  imageUrl?: string;
}

interface BliKjentCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  count: number;
}

/* ═══════════════════════════════════════
   CHAT HEADER
   ═══════════════════════════════════════ */

interface ChatHeaderProps {
  partner?: PartnerInfo;
  journeyDay: number;
  onOpenBliKjent?: () => void;
  isBliKjentOpen?: boolean;
}

export function ChatHeader({
  partner,
  journeyDay,
  onOpenBliKjent,
  isBliKjentOpen = false,
}: ChatHeaderProps) {
  // Vis milestone-badge ved fase-overgang
  const isMilestone = journeyDay === 10 || journeyDay === 20 || journeyDay === 30;
  const phaseLabel = journeyDay <= 10 ? 'Bli kjent' : journeyDay <= 20 ? 'Lek og morro' : 'Djupde';

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

      <div className="flex items-center gap-2 sm:gap-3 relative z-10">
        {/* ═══ PROFILBILDE — Premium med gull-ring og glow ═══ */}
        {partner?.imageUrl ? (
          <div 
            className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-offset-2 ring-transparent transition-all duration-300 hover:ring-opacity-50"
            style={{ 
              border: `2px solid ${G.gold}`,
              boxShadow: `0 0 16px ${G.goldMuted}, inset 0 0 8px rgba(0,0,0,0.2)`,
            }}
          >
            <Image src={partner.imageUrl} alt={partner.name} fill className="object-cover" />
            {/* Glass-overlegg */}
            <div 
              className="absolute inset-0 rounded-full"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)',
              }}
            />
          </div>
        ) : (
          <div 
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-base sm:text-lg font-semibold flex-shrink-0 transition-all duration-300 hover:scale-105"
            style={{ 
              background: `linear-gradient(135deg, ${G.goldSoft}, ${G.goldMuted})`,
              boxShadow: `0 0 16px ${G.goldMuted}`,
              border: `2px solid ${G.goldMuted}`,
              color: G.gold,
            }}
          >
            {partner?.name?.charAt(0)?.toUpperCase() || "T"}
          </div>
        )}

        {/* ═══ NAMN + JOURNEY-DAG ═══ */}
        <div className="flex-1 min-w-0">
          <h2 
            className="text-sm sm:text-base font-medium truncate transition-all duration-300"
            style={{ color: G.textPrimary }}
          >
            {partner?.name || "Din match"}
          </h2>
          
          <div className="flex items-center gap-1.5">
            {/* Milestone-badge */}
            {isMilestone && (
              <span 
                className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${G.gold}, ${G.goldLight})`,
                  color: '#0B1520',
                  boxShadow: `0 0 8px ${G.goldMuted}`,
                }}
              >
                ✨ Milestone
              </span>
            )}
            
            {/* Journey dag + fase */}
            <p 
              className="text-xs font-medium"
              style={{ color: G.gold }}
            >
              Dag {journeyDay} av 30
              {journeyDay <= 10 && ' · 🌱'}
              {journeyDay > 10 && journeyDay <= 20 && ' · 🎵'}
              {journeyDay > 20 && ' · 💫'}
            </p>
          </div>
        </div>

        {/* ═══ STATUS-INDIKATOR — Animer prikk ═══ */}
        <div className="hidden sm:flex items-center gap-1.5">
          <div 
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ 
              background: G.successGreen,
              boxShadow: `0 0 6px ${G.successGreenGlow}`,
              animation: 'pulse-green 2s ease-in-out infinite',
            }}
          />
          <span className="text-xs font-medium" style={{ color: G.textSecondary }}>Matcha</span>
        </div>

        {/* ═══ BLI KJENT-KNAPP — Premium glass med gull-ikon ═══ */}
        <button
          onClick={onOpenBliKjent}
          className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-300 group"
          style={{
            background: isBliKjentOpen 
              ? G.goldGlow
              : `linear-gradient(135deg, ${G.glassBg}, ${G.glassBgHover})`,
            border: `1px solid ${isBliKjentOpen ? G.goldMuted : 'rgba(212,175,55,0.2)'}`,
            color: isBliKjentOpen ? G.goldLight : G.gold,
            boxShadow: isBliKjentOpen 
              ? `0 0 16px ${G.goldMuted}`
              : '0 2px 8px rgba(0,0,0,0.1)',
          }}
          onMouseEnter={(e) => {
            if (!isBliKjentOpen) {
              e.currentTarget.style.background = `linear-gradient(135deg, ${G.goldSoft}, ${G.goldMuted})`;
              e.currentTarget.style.boxShadow = `0 0 12px ${G.goldMuted}`;
            }
          }}
          onMouseLeave={(e) => {
            if (!isBliKjentOpen) {
              e.currentTarget.style.background = `linear-gradient(135deg, ${G.glassBg}, ${G.glassBgHover})`;
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            }
          }}
        >
          <span className="text-sm transition-transform duration-300 group-hover:rotate-12">📖</span>
          <span className="hidden sm:inline tracking-wide">Bli kjent</span>
        </button>
      </div>

      {/* ═══ PREMIUM CSS-ANIMASJONAR ═══ */}
      <style jsx>{`
        @keyframes pulse-green {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}

export default ChatHeader;