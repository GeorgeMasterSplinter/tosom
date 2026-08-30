"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

/* ========================
   PAGE COMPONENT
   ======================== */

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setStatus("loading");
    setError("");

    const res = await signIn("credentials", {
      email: email.trim(),
      password: password,
      redirect: false,
    });

    if (res?.error) {
      setStatus("error");
      setError("Kunne ikke logge inn. Prøv igjen.");
      return;
    }

    // Bestem målretning basert på onboarding-status og reise-tilstand.
    // Hard navigasjon (window.location.href) garanterer at session-cookie
    // settes og påtverkes på nytt — påliteligere enn klient-navigasjon.
    let target = "/dashboard";
    try {
      const obRes = await fetch("/api/dashboard/overview");
      if (obRes.ok) {
        const ob = await obRes.json();
        if (ob && ob.onboardingComplete === false) {
          target = "/onboarding";
        }
      }
    } catch {
      // feiler — gå til dashboard (der er det også en onboarding-guard)
    }
    window.location.href = target;
  };

  const inputStyle: React.CSSProperties = {
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
  };

  return (
    <main
      className="relative min-h-screen overflow-hidden flex items-start justify-center"
      style={{ paddingTop: "80px", paddingBottom: "60px" }}
    >
      {/* Bakgrunn */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(180deg, #0B1520 0%, #121E2E 40%, #0B1520 100%)",
        }}
      />

      {/* Ambient glød */}
      <div
        className="absolute top-8 left-1/2 -translate-x-1/2 w-[700px] h-[500px] pointer-events-none opacity-20"
        style={{
          background: "radial-gradient(ellipse at 50% 40%, rgba(212,175,55,0.10), transparent 65%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-[540px] px-8 flex flex-col items-center">
        {/* Header */}
        <div className="text-center space-y-4 mb-10 w-full">
          <h1
            style={{
              fontSize: "48px",
              fontWeight: 300,
              color: "#D4AF37",
              letterSpacing: "-0.02em",
              lineHeight: "1.1",
              margin: 0,
            }}
          >
            Velkommen til Tosom
          </h1>

          <p
            style={{
              fontSize: "18px",
              lineHeight: "1.7",
              color: "rgba(255, 255, 255, 0.6)",
              margin: 0,
            }}
          >
            En guidet reise for to. Du bygger en dyp profil,
            vi matcher deg natt til lørdag, og dere går inn i
            en 30-dagers reise sammen.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="din@epost.no"
            disabled={status === "loading"}
            style={inputStyle}
            onFocus={(e) => (e.currentTarget.style.border = "1px solid rgba(212,175,55,0.5)")}
            onBlur={(e) => (e.currentTarget.style.border = "1px solid rgba(255,255,255,0.1)")}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Velg et passord"
            disabled={status === "loading"}
            style={inputStyle}
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
              cursor: status === "loading" ? "wait" : "pointer",
              transition: "all 300ms ease-out",
              border: "none",
              background:
                status === "loading"
                  ? "rgba(212,175,55,0.3)"
                  : "linear-gradient(135deg, #D4AF37, #E8C766)",
              color: "#0B1520",
              opacity: status === "loading" ? 0.6 : 1,
            }}
          >
            {status === "loading" ? "Kommer i gang…" : "Kom i gang"}
          </button>
        </form>

        {/* Beta-infotekst */}
        <div
          className="w-full mt-8 space-y-2"
          style={{
            background: "rgba(212,175,55,0.04)",
            border: "1px solid rgba(212,175,55,0.12)",
            borderRadius: "16px",
            padding: "20px",
          }}
        >
          <p
            style={{
              fontSize: "15px",
              lineHeight: "1.7",
              color: "rgba(255,255,255,0.6)",
              margin: 0,
            }}
          >
            Tosom er i åpen test. Gratis. Vi stresstester systemet — trykk på alt, prøv å knekke det.
          </p>
          <p
            style={{
              fontSize: "15px",
              lineHeight: "1.7",
              color: "rgba(255,255,255,0.6)",
              margin: 0,
            }}
          >
            Test gjerne å rapportere, blokkere og avslutte reisen tidlig. Tilbakemelding:{" "}
            <span style={{ color: "#D4AF37" }}>support@tosom.no</span>
          </p>
          <p
            style={{
              fontSize: "14px",
              lineHeight: "1.7",
              color: "rgba(255,255,255,0.4)",
              margin: 0,
            }}
          >
            Tosom er for voksne over 21 år.
          </p>
        </div>

        {/* Error */}
        {status === "error" && (
          <p className="text-center mt-4 text-sm" style={{ color: "rgba(255,80,80,0.8)" }}>
            {error}
          </p>
        )}

        {/* Hint for new users */}
        <p
          className="text-center mt-8 text-sm w-full"
          style={{ color: "rgba(255,255,255,0.35)" }}
        >
          Første gang? Skriv inn epost og passord — kontoen din lages automatisk.
        </p>
      </div>
    </main>
  );
}