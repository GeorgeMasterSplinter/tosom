"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/* ========================
   INLINE SVG-ikoner
   ======================== */

function IconVipps() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.3 3.2H14v6.5l2.3-2.3V3.2zm-8.6 0H7.7v6.5L10 12V9.7L7.7 7.4V3.2zm8.6 1.7L13.7 9v6.3h2.6V4.9zM5.4 3.2H3.1v9.6l2.3-2.3V3.2zm0 11.9L3.1 12.8v6.1h2.3v-3.8zM7.7 12v2.3L10 16.6V12H7.7zm4.3 0v6.5h2.6v-2.3l2.3 2.3v-2.3l-2.3-2.3V12H12zm0 9.1H7.7v-2.3H5.4v2.3H3.1v2.3h2.3v2.3h2.3v-2.3H12v-2.3z" />
    </svg>
  );
}

function IconInfo() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

function IconLock() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

/* ========================
   KNAPP-KOMPOSITT — same form for alle, store
   ======================== */

function UnifiedButton({
  children,
  onClick,
  href,
  variant,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  variant: "gold" | "secondary" | "test";
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
    test: {
      ...baseStyle,
      background: "rgba(212, 175, 55, 0.06)",
      color: "#D4AF37",
      border: "2px solid rgba(212, 175, 55, 0.2)",
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
      onClick={onClick}
      className="block w-full transition-all hover:brightness-110 active:scale-[0.98]"
    >
      {ButtonContent}
    </button>
  );
}

/* ========================
   TEST-BRUKAR LOGIN MODAL
   ======================== */

function TestUserLoginModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState<"astrid" | "magnus" | null>(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = async () => {
    if (!selectedUser || !password) return;

    setLoading(true);
    setError(null);

    const email = selectedUser === "astrid" ? "astrid@tosom.no" : "magnus@tosom.no";

    try {
      const res = await fetch("/api/auth/test-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || "Feil ved innlogging");
        setLoading(false);
        return;
      }

      localStorage.setItem("testUserId", data.userId);
      localStorage.setItem("testUserOnboardingComplete", String(data.onboardingComplete));
      localStorage.setItem("testUserDeepProfileComplete", String(data.deepProfileComplete));

      if (data.redirect) {
        router.push(data.redirect);
      } else {
        if (data.deepProfileComplete) {
          router.push("/dashboard");
        } else if (data.onboardingComplete) {
          router.push("/matching");
        } else {
          router.push("/onboarding");
        }
      }

    } catch {
      setError("Kunne ikke koble til serveren");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)" }}>
      <div
        className="w-full max-w-md rounded-3xl p-8 relative mx-auto"
        style={{
          background: "rgba(11, 21, 32, 0.95)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(212, 175, 55, 0.25)",
          boxShadow: "0 12px 60px rgba(0,0,0,0.5)",
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:brightness-125 text-xl"
          style={{ color: "rgba(255,255,255,0.5)", background: "rgba(255,255,255,0.05)" }}
        >
          ✕
        </button>

        <h3
          className="text-xl font-bold mb-2 text-center"
          style={{ color: "rgba(255,255,255,0.95)" }}
        >
          {selectedUser ? "Skriv passordet" : "Velg testbrukar"}
        </h3>

        {!selectedUser && (
          <div className="space-y-4 mt-6">
            <button
              onClick={() => setSelectedUser("astrid")}
              className="w-full py-5 px-5 rounded-2xl transition-all hover:brightness-125 active:scale-[0.98] text-lg"
              style={{
                background: "rgba(212, 175, 55, 0.08)",
                border: "2px solid rgba(212, 175, 55, 0.25)",
                color: "#D4AF37",
                fontWeight: 600,
              }}
            >
              <div className="font-bold">Test Brukar 1</div>
              <div className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>
                Astrid — 28 år
              </div>
            </button>

            <button
              onClick={() => setSelectedUser("magnus")}
              className="w-full py-5 px-5 rounded-2xl transition-all hover:brightness-125 active:scale-[0.98] text-lg"
              style={{
                background: "rgba(212, 175, 55, 0.08)",
                border: "2px solid rgba(212, 175, 55, 0.25)",
                color: "#D4AF37",
                fontWeight: 600,
              }}
            >
              <div className="font-bold">Test Brukar 2</div>
              <div className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>
                Magnus — 31 år
              </div>
            </button>
          </div>
        )}

        {selectedUser && (
          <div className="space-y-5 mt-6">
            <button
              onClick={() => setSelectedUser(null)}
              className="text-base transition-all hover:opacity-80"
              style={{ color: "#D4AF37" }}
            >
              ← Tilbake
            </button>

            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="Skriv passordet..."
                className="w-full px-5 py-4 rounded-2xl outline-none transition-all text-lg"
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  color: "rgba(255,255,255,0.95)",
                }}
                autoFocus
              />
            </div>

            {error && (
              <p className="text-base text-center" style={{ color: "#FF4D4D" }}>
                {error}
              </p>
            )}

            <button
              onClick={handleLogin}
              disabled={loading || !password}
              className="w-full py-5 rounded-2xl font-bold transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-40 text-lg"
              style={{
                background: "linear-gradient(135deg, #D4AF37, #E8C766)",
                color: "#0B1520",
                boxShadow: "0 6px 24px rgba(212, 175, 55, 0.35)",
              }}
            >
              {loading ? "Loggar inn..." : "Logg inn"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ========================
   PAGE COMPONENT — store, opptil
   ======================== */

export default function LoginPage() {
  const [showTestModal, setShowTestModal] = useState(false);

  return (
    <main className="relative min-h-screen overflow-hidden flex items-start justify-center" style={{ paddingTop: "80px", paddingBottom: "60px" }}>
      {/* Bakgrunn */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, #0B1520 0%, #121E2E 40%, #0B1520 100%)',
        }}
      />

      {/* Ambient glød — større og meir synleg */}
      <div
        className="absolute top-8 left-1/2 -translate-x-1/2 w-[700px] h-[500px] pointer-events-none opacity-20"
        style={{
          background: 'radial-gradient(ellipse at 50% 40%, rgba(212,175,55,0.10), transparent 65%)',
        }}
      />

      {/* Content — mykje lengre opp, meir luft */}
      <div className="relative z-10 w-full max-w-[540px] px-8 flex flex-col items-center">

        {/* Header — stor, nær toppen */}
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
            Logg inn med Vipps for å fortsetje reisa di
          </p>
        </div>

        {/* Primær CTA — gullknapp */}
        <div className="w-full mb-8">
          <UnifiedButton href="/api/auth/vipps" variant="gold">
            <IconVipps />
            Logg inn med Vipps
          </UnifiedButton>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-5 w-full mb-8">
          <div className="h-px bg-white/10 flex-1" />
          <span style={{ fontSize: "15px", color: "rgba(255,255,255,0.3)" }}>eller</span>
          <div className="h-px bg-white/10 flex-1" />
        </div>

        {/* Testbrukar-knapp */}
        <div className="w-full mb-8">
          <UnifiedButton onClick={() => setShowTestModal(true)} variant="test">
            <IconLock />
            Testplattform — Astrid eller Magnus
          </UnifiedButton>
        </div>

        {/* Registrer deg */}
        <div className="w-full mb-12">
          <UnifiedButton href="/register" variant="secondary">
            Ikkje registrert? Registrer deg no
          </UnifiedButton>
        </div>

        {/* Vipps-informasjon — stor, same breidd */}
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
            Vi bruker Vipps både til innlogging og betaling for å sikre at alle på plattformen er ekte. Så snart betalingsløysing er klar, kan du logge inn og starte reisa di.
          </p>
        </div>

      </div>

      {/* Testbrukar Login Modal */}
      <TestUserLoginModal
        isOpen={showTestModal}
        onClose={() => setShowTestModal(false)}
      />
    </main>
  );
}