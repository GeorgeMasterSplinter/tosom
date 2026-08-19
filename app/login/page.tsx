"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

/* ========================
   INLINE SVG-ikoner
   ======================== */

function IconInfo() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

/* ========================
   KNAPP-KOMPOSITT
   ======================== */

function UnifiedButton({
  children,
  href,
  variant,
}: {
  children: React.ReactNode;
  href?: string;
  variant: "gold" | "secondary";
}) {
  const baseStyle: React.CSSProperties = {
    width: "100%",
    height: "84px",
    borderRadius: "16px",
    fontWeight: 700,
    fontSize: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "14px",
    cursor: "pointer",
    transition: "all 300ms ease-out",
    textDecoration: "none",
    border: "none",
    letterSpacing: "0.01em",
  };

  const variantStyles = {
    gold: {
      ...baseStyle,
      background: "linear-gradient(135deg, #D4AF37, #E8C766)",
      color: "#0B1520",
      boxShadow: "0 6px 32px rgba(212, 175, 55, 0.4)",
    },
    secondary: {
      ...baseStyle,
      background: "rgba(212, 175, 55, 0.06)",
      color: "#D4AF37",
      border: "2px solid rgba(212, 175, 55, 0.3)",
    },
  };

  const ButtonContent = (
    <span style={{ ...variantStyles[variant], ...(href ? { display: "inline-flex" as const } : {}) }}>
      {children}
    </span>
  );

  if (href) {
    return (
      <a href={href} className="block transition-all hover:brightness-110 active:scale-[0.98]">
        {ButtonContent}
      </a>
    );
  }

  return (
    <button
      className="block w-full transition-all hover:brightness-110 active:scale-[0.98]"
    >
      {ButtonContent}
    </button>
  );
}

/* ========================
   PAGE COMPONENT
   ======================== */

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "closed">("idle");

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");

    try {
      const res = await fetch("/api/beta/invite/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();

      if (data.invited) {
        // Invitert — trigger magic link (sendVerificationRequest sender e-posten)
        await signIn("email", { email: email.trim(), callbackUrl: "/dashboard" });
        setStatus("sent");
      } else {
        // Ikke invitert — rolig lukket-beta-melding
        setStatus("closed");
      }
    } catch {
      setStatus("sent"); // Fallback: vis at lenken er "sendt"
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden flex items-start justify-center" style={{ paddingTop: "80px", paddingBottom: "60px" }}>
      {/* Bakgrunn */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, #0B1520 0%, #121E2E 40%, #0B1520 100%)',
        }}
      />

      {/* Ambient glød */}
      <div
        className="absolute top-8 left-1/2 -translate-x-1/2 w-[700px] h-[500px] pointer-events-none opacity-20"
        style={{
          background: 'radial-gradient(ellipse at 50% 40%, rgba(212,175,55,0.10), transparent 65%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-[540px] px-8 flex flex-col items-center">

        {/* Header */}
        <div className="text-center space-y-3 mb-10 w-full">
          <h1
            style={{
              fontSize: "52px",
              fontWeight: 300,
              color: "#D4AF37",
              letterSpacing: "-0.02em",
              lineHeight: "1.1",
              margin: 0,
            }}
          >
            Velkommen tilbake
          </h1>

          <p
            style={{
              fontSize: "20px",
              lineHeight: "1.6",
              color: "rgba(255, 255, 255, 0.5)",
              margin: 0,
            }}
          >
          {process.env.NEXT_PUBLIC_VIPPS_ENABLED === 'true'
            ? 'Logg inn med Vipps for å fortsette reisen din'
            : 'Logg inn med e-post for å fortsette reisen din'}
        </p>
      </div>

      {/* Primær CTA — Vipps (S-2: skjult bak VIPPS_ENABLED) */}
      {process.env.NEXT_PUBLIC_VIPPS_ENABLED === 'true' && (
        <div className="w-full mb-10">
          <UnifiedButton href="/api/auth/vipps" variant="gold">
            Logg inn med Vipps
          </UnifiedButton>
        </div>
      )}

        {/* E-post magic link (Invitasjonsport BETA-ACCESS §3) */}
        <div className="w-full mb-10">
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="din@epost.no"
              disabled={status === "loading"}
              style={{
                width: "100%",
                height: "64px",
                borderRadius: "16px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.1)",
                padding: "0 20px",
                fontSize: "18px",
                color: "white",
                outline: "none",
                transition: "border 300ms",
              }}
              onFocus={(e) => (e.currentTarget.style.border = "1px solid rgba(212,175,55,0.5)")}
              onBlur={(e) => (e.currentTarget.style.border = "1px solid rgba(255,255,255,0.1)")}
            />
            <button
              type="submit"
              disabled={status === "loading"}
              style={{
                width: "100%",
                height: "64px",
                borderRadius: "16px",
                fontWeight: 700,
                fontSize: "18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                cursor: status === "loading" ? "wait" : "pointer",
                transition: "all 300ms ease-out",
                border: "none",
                background: status === "loading"
                  ? "rgba(212,175,55,0.3)"
                  : "linear-gradient(135deg, #D4AF37, #E8C766)",
                color: "#0B1520",
                opacity: status === "loading" ? 0.6 : 1,
              }}
            >
              {status === "loading" ? "Sender…" : "Send innloggingslenke"}
            </button>
          </form>

          {/* Status-melding */}
          {status === "sent" && (
            <p className="text-center mt-4 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
              Hvis adressen din er invitert, får du snart en lenke. Den er gyldig i 24 timer.
            </p>
          )}
          {status === "closed" && (
            <p className="text-center mt-4 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
              Tosom er i lukket beta. Vi åpner for flere etter hvert.
            </p>
          )}
        </div>

        {/* Vipps-informasjon (S-2: skjult bak VIPPS_ENABLED) */}
        {process.env.NEXT_PUBLIC_VIPPS_ENABLED === 'true' && (
          <div
            className="text-center space-y-3 w-full rounded-2xl px-6 py-5"
            style={{
              background: 'rgba(212,175,55,0.04)',
              border: '1px solid rgba(212,175,55,0.15)',
              borderRadius: '18px',
            }}
          >
            <div className="flex items-center justify-center gap-3">
              <IconInfo />
              <span style={{ fontSize: "16px", color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>
                Vipps gir trygg innlogging og betaling
              </span>
            </div>
            <p style={{ fontSize: "15px", color: 'rgba(255,255,255,0.4)', lineHeight: '1.7', margin: 0 }}>
              Vi bruker Vipps både til innlogging og betaling for å sikre at alle på plattformen er ekte. Så snart betalingsløsning er klar, kan du logge inn og starte reisen din.
            </p>
          </div>
        )}

      </div>
    </main>
  );
}