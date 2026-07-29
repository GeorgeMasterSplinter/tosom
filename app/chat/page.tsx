/**
 * ToSom — Chat Landing Page (Premium Nordic Gold 2026) ⭐
 * Enkel landingsside for /chat — viser ingen aktive samtalar.
 * Ingen API-kall. Ingen auth. Berre rein UI.
 * 
 * Prod-chat: /chat/[id]
 * Test-chat: /chat-playground
 */

"use client";

import { useRouter } from "next/navigation";

/* ═══════════════════════════════════════
   THEME TOKENS
   ═══════════════════════════════════════ */

const G = {
  gold: "#D4AF37",
  goldLight: "#E8C766",
  goldMuted: "rgba(212,175,55,0.2)",
  goldSoft: "rgba(212,175,55,0.08)",
  tosomBlue: "#0B1520",
  glassBg: "rgba(255,255,255,0.04)",
  glassBorder: "rgba(255,255,255,0.1)",
  textPrimary: "rgba(255,255,255,0.92)",
  textSecondary: "rgba(255,255,255,0.55)",
  textMuted: "rgba(255,255,255,0.35)",
};

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
        height: "48px",
        padding: "0 24px",
        fontSize: "16px",
        fontWeight: 600,
      }}
    >
      {children}
    </button>
  );
}

/* ═══════════════════════════════════════
   EMPTY STATE — ingen samtalar
   ═══════════════════════════════════════ */

function EmptyState() {
  const router = useRouter();

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="text-center max-w-sm">
        {/* Icon */}
        <div
          className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${G.gold}20, ${G.goldMuted})`,
            border: `1px solid ${G.goldMuted}`,
          }}
        >
          <span className="text-3xl">💬</span>
        </div>

        {/* Tittel */}
        <h2 className="text-2xl font-semibold mb-3" style={{ color: G.textPrimary }}>
          Ingen aktive samtalar
        </h2>

        {/* Undertekst */}
        <p className="text-base mb-4" style={{ color: G.textSecondary }}>
          Når du blir matcha, opnar chaten seg her.
        </p>

        {/* Microcopy */}
        <p className="text-xs mb-8" style={{ color: G.textMuted }}>
          Dei beste relasjonane byrjar med eit lite steg.
        </p>

        {/* Knapp */}
        <GoldButton onClick={() => router.push("/dashboard")}>
          Gå til dashboard
        </GoldButton>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   HOVEDKOMPONENT — CHAT LANDING
   ═══════════════════════════════════════ */

export default function ChatLandingPage() {
  return (
    <div className="w-full h-screen flex items-center justify-center" style={{ background: G.tosomBlue }}>
      {/* Max-width container */}
      <div className="w-full max-w-[720px] mx-auto flex flex-col min-h-screen" style={{ paddingTop: "96px", paddingBottom: "96px" }}>

        {/* Glassmorphism-main-panel */}
        <div className="flex-1 flex flex-col rounded-3xl overflow-hidden" style={{
          background: G.glassBg,
          border: `1px solid ${G.glassBorder}`,
          backdropFilter: "blur(20px)",
          boxShadow: "0 8px 40px rgba(0,0,0,0.35), inset 0 0 24px rgba(255,255,255,0.02)",
        }}>

          {/* HEADER */}
          <div className="flex-shrink-0 p-6">
            {/* Gull-bokmerke */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  background: `linear-gradient(135deg, ${G.gold}, ${G.goldLight})`,
                  boxShadow: `0 0 12px ${G.goldMuted}`,
                }}
              />
              <span className="text-xs uppercase tracking-widest" style={{ color: G.textSecondary }}>
                DINE SAMTALES
              </span>
            </div>

            {/* Overskrift */}
            <h1 className="text-[36px] font-light leading-tight" style={{ color: G.textPrimary, letterSpacing: "-0.03em" }}>
              Chat
            </h1>
          </div>

          {/* MIDDCELLINJE */}
          <div style={{ borderTop: `1px solid ${G.glassBorder}` }} />

          {/* CONTENT — tom tilstand */}
          <EmptyState />

        </div>
      </div>
    </div>
  );
}