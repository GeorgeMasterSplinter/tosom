"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ToSomButton } from "@/components/ui/system";
import { color, spacing, typographyToStyle, radius } from "@/config/design-tokens";

/* ========================
   INLINE SVG-ikoner
   ======================== */

function IconVipps() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.3 3.2H14v6.5l2.3-2.3V3.2zm-8.6 0H7.7v6.5L10 12V9.7L7.7 7.4V3.2zm8.6 1.7L13.7 9v6.3h2.6V4.9zM5.4 3.2H3.1v9.6l2.3-2.3V3.2zm0 11.9L3.1 12.8v6.1h2.3v-3.8zM7.7 12v2.3L10 16.6V12H7.7zm4.3 0v6.5h2.6v-2.3l2.3 2.3v-2.3l-2.3-2.3V12H12zm0 9.1H7.7v-2.3H5.4v2.3H3.1v2.3h2.3v2.3h2.3v-2.3H12v-2.3z" />
    </svg>
  );
}

function IconInfo() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

function IconLock() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
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

      // Succes — lagre userId i localStorage for vidare bruk
      localStorage.setItem("testUserId", data.userId);
      localStorage.setItem("testUserOnboardingComplete", String(data.onboardingComplete));
      localStorage.setItem("testUserDeepProfileComplete", String(data.deepProfileComplete));

      // Bruk API redirect dersom tilgjengeleg, elles standard logikk
      if (data.redirect) {
        router.push(data.redirect);
      } else {
        // Redirect avhengig av onboarding-status
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
        className="w-full max-w-sm rounded-2xl p-6 relative mx-auto"
        style={{
          background: "rgba(11, 21, 32, 0.95)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(212, 175, 55, 0.2)",
          boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
        }}
      >
        {/* Lukk-knapp */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center transition-all hover:brightness-125"
          style={{ color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.04)" }}
        >
          ✕
        </button>

        <h3
          className="text-lg font-semibold mb-1 text-center"
          style={{ color: color.text.primary }}
        >
          {selectedUser ? "Skriv passordet" : "Velg testbrukar"}
        </h3>

        {!selectedUser && (
          <div className="space-y-3 mt-4">
            <button
              onClick={() => setSelectedUser("astrid")}
              className="w-full py-3 px-4 rounded-xl transition-all hover:brightness-125 active:scale-[0.98]"
              style={{
                background: "rgba(212, 175, 55, 0.08)",
                border: "1px solid rgba(212, 175, 55, 0.2)",
                color: "#D4AF37",
              }}
            >
              <div className="font-semibold">Test Brukar 1</div>
              <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>
                Astrid — 28 år
              </div>
            </button>

            <button
              onClick={() => setSelectedUser("magnus")}
              className="w-full py-3 px-4 rounded-xl transition-all hover:brightness-125 active:scale-[0.98]"
              style={{
                background: "rgba(212, 175, 55, 0.08)",
                border: "1px solid rgba(212, 175, 55, 0.2)",
                color: "#D4AF37",
              }}
            >
              <div className="font-semibold">Test Brukar 2</div>
              <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>
                Magnus — 31 år
              </div>
            </button>
          </div>
        )}

        {selectedUser && (
          <div className="space-y-4 mt-4">
            {/* Tilbake-knapp */}
            <button
              onClick={() => setSelectedUser(null)}
              className="text-sm transition-all hover:opacity-80"
              style={{ color: "#D4AF37" }}
            >
              ← Tilbake
            </button>

            {/* Passord-input */}
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="Skriv passordet..."
                className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                style={{
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: color.text.primary,
                }}
                autoFocus
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-center" style={{ color: "#FF4D4D" }}>
                {error}
              </p>
            )}

            {/* Login-knapp */}
            <button
              onClick={handleLogin}
              disabled={loading || !password}
              className="w-full py-3 rounded-xl font-semibold transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-40"
              style={{
                background: "linear-gradient(135deg, #D4AF37, #E8C766)",
                color: "#0B1520",
                boxShadow: "0 4px 16px rgba(212, 175, 55, 0.3)",
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
   PAGE COMPONENT
   ======================== */

export default function LoginPage() {
  const [showTestModal, setShowTestModal] = useState(false);

  return (
    <main className="relative min-h-screen overflow-hidden flex items-center justify-center">
      {/* Bakgrunn — Deep Blue gradient */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, #0B1520 0%, #121E2E 50%, #0B1520 100%)',
        }}
      />

      {/* Ambient glød — gold */}
      <div
        className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none opacity-15"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(212,175,55,0.08), transparent 70%)',
        }}
      />

      {/* Content — sentrert vertikalt og horisontalt */}
      <div className="relative z-10 w-full max-w-md px-6 py-12 flex flex-col items-center space-y-8">

        {/* Header — sentrert */}
        <div className="text-center space-y-4 w-full">
          <h1
            style={{
              ...typographyToStyle('heading-lg'),
              color: color.brand.gold,
              fontWeight: 300,
            }}
          >
            Velkommen tilbake
          </h1>

          <p
            style={{
              ...typographyToStyle('body'),
              color: color.text.secondary,
            }}
          >
            Logg inn med Vipps for å fortsette reisen din
          </p>
        </div>

        {/* ===== Primær CTA: Logg inn med Vipps ===== */}
        <div className="w-full">
          <ToSomButton
            href="/api/auth/vipps"
            variant="gold"
            size="xl"
          >
            Logg inn med Vipps
          </ToSomButton>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 w-full">
          <div className="h-px bg-white/10 flex-1" />
          <span style={{ ...typographyToStyle('body-sm'), color: color.text.subtle }}>eller</span>
          <div className="h-px bg-white/10 flex-1" />
        </div>

        {/* ===== TEST-BRUKAR KNAPPAR ===== */}
        <div className="w-full">
          <button
            onClick={() => setShowTestModal(true)}
            className="w-full py-3 px-4 rounded-xl font-semibold transition-all hover:brightness-125 active:scale-[0.98]"
            style={{
              background: "rgba(212, 175, 55, 0.06)",
              border: "1px solid rgba(212, 175, 55, 0.2)",
              color: "#D4AF37",
            }}
          >
            <span className="flex items-center justify-center gap-2">
              <IconLock />
              Testplattform — Logg inn som Astrid eller Magnus
            </span>
          </button>
        </div>

        {/* Registrer deg */}
        <div className="w-full">
          <ToSomButton
            href="/register"
            variant="secondary"
            size="lg"
          >
            Ikke registrert? Registrer deg nå
          </ToSomButton>
        </div>

        {/* Vipps-informasjon — sentrert */}
        <div
          className="text-center space-y-3 w-full"
          style={{
            background: 'rgba(212,175,55,0.04)',
            border: '1px solid rgba(212,175,55,0.12)',
            borderRadius: `${radius.lg}px`,
            padding: `${spacing.lg}px`,
          }}
        >
          <div className="flex items-center justify-center gap-2">
            <IconInfo />
            <span
              style={{
                ...typographyToStyle('body-sm'),
                color: 'rgba(255,255,255,0.6)',
              }}
            >
              Vipps gir trygg innlogging og betaling
            </span>
          </div>
          <p
            style={{
              ...typographyToStyle('body-sm'),
              color: color.text.secondary,
              lineHeight: '1.7',
            }}
          >
            Vi bruker Vipps både til innlogging og betaling for å sikre at alle på plattformen er ekte. Så snart betalingsløsning er klar, kan du logge inn og starte reisen din.
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