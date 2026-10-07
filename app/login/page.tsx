"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { csrfFetch } from "@/lib/api/csrfClient";
import { ResonanceLogo } from "@/components/branding/LogoVariants";

/* ========================
   PAGE COMPONENT
   ======================== */

type View = "login" | "register";

export default function LoginPage() {
  const [view, setView] = useState<View>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  const switchView = (next: View) => {
    setView(next);
    setError("");
    setPassword("");
    setPasswordRepeat("");
  };

  // Felles etter innlogging: bestem målretning basert på onboarding-status.
  // Hard navigasjon (window.location.href) garanterer at session-cookie
  // settes og påtverkes på nytt — påliteligere enn klient-navigasjon.
  const afterAuth = async () => {
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

  const handleLogin = async (e: React.FormEvent) => {
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
      setError("Kunne ikke logge inn. Sjekk epost og passord, eller opprett en konto.");
      return;
    }

    await afterAuth();
  };

  // D-7 (PL-05): Eksplisitt registrering — POST /api/auth/register,
  // deretter innlogging med credentials. Ruten svarer likt uansett om
  // eposten eksisterte; signIn avdekker da feil passord.
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim() || !passwordRepeat.trim()) return;
    if (password !== passwordRepeat) {
      setStatus("error");
      setError("Passordene er ikke like.");
      return;
    }
    setStatus("loading");
    setError("");

    const regRes = await csrfFetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.trim(),
        password,
        passwordRepeat,
      }),
    });

    if (!regRes.ok) {
      const data = await regRes.json().catch(() => ({}));
      setStatus("error");
      setError(data?.error ?? "Kunne ikke opprette konto. Prøv igjen.");
      return;
    }

    const res = await signIn("credentials", {
      email: email.trim(),
      password,
      redirect: false,
    });

    if (res?.error) {
      setStatus("error");
      setError("Kontoen ble opprettet, men innlogging feilet. Prøv igjen.");
      return;
    }

    await afterAuth();
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    height: "64px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.6)",
    padding: "0 20px",
    fontSize: "18px",
    color: "white",
    transition: "border 300ms",
  };

  const goldFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.border = "1px solid rgba(212,175,55,0.5)";
  };
  const resetBorder = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.border = "1px solid rgba(255,255,255,0.6)";
  };

  const buttonStyle: React.CSSProperties = {
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
  };

  return (
    <main
      className="relative min-h-screen overflow-hidden flex items-start justify-center"
      style={{ paddingTop: "40px", paddingBottom: "60px" }}
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
        <div className="text-center space-y-5 mb-10 w-full">
          {/* Standard ToSom-logo — nøyaktig som toppen av landing-siden */}
          <ResonanceLogo />
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

        {/* Form: «Logg inn» eller «Ny her? Opprett konto» (D-7) */}
        {view === "login" ? (
          <form onSubmit={handleLogin} className="w-full space-y-4">
            <div>
              <label htmlFor="login-email" className="sr-only">
                Epost
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="din@epost.no"
                disabled={status === "loading"}
                style={inputStyle}
                onFocus={goldFocus}
                onBlur={resetBorder}
                autoComplete="email"
              />
            </div>
            <div>
              <label htmlFor="login-password" className="sr-only">
                Passord
              </label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Passord"
                disabled={status === "loading"}
                style={inputStyle}
                onFocus={goldFocus}
                onBlur={resetBorder}
                autoComplete="current-password"
              />
            </div>

            <button type="submit" disabled={status === "loading"} style={buttonStyle}>
              {status === "loading" ? "Starter reisen…" : "Start reisen"}
            </button>

            <div className="flex items-center justify-between pt-1">
              <a
                href="/glemt-passord"
                className="text-sm underline"
                style={{ color: "rgba(212,175,55,0.9)" }}
              >
                Glemt passord?
              </a>
              <button
                type="button"
                onClick={() => switchView("register")}
                className="text-sm font-semibold"
                style={{ color: "rgba(255,255,255,0.7)", background: "none", border: "none", cursor: "pointer" }}
              >
                Ny her? Opprett konto
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="w-full space-y-4">
            <div>
              <label htmlFor="register-email" className="sr-only">
                Epost
              </label>
              <input
                id="register-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="din@epost.no"
                disabled={status === "loading"}
                style={inputStyle}
                onFocus={goldFocus}
                onBlur={resetBorder}
                autoComplete="email"
              />
            </div>
            <div>
              <label htmlFor="register-password" className="sr-only">
                Passord (minst 10 tegn)
              </label>
              <input
                id="register-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Velg et passord (minst 10 tegn)"
                disabled={status === "loading"}
                style={inputStyle}
                onFocus={goldFocus}
                onBlur={resetBorder}
                autoComplete="new-password"
              />
            </div>
            <div>
              <label htmlFor="register-password-repeat" className="sr-only">
                Gjenta passord
              </label>
              <input
                id="register-password-repeat"
                type="password"
                value={passwordRepeat}
                onChange={(e) => setPasswordRepeat(e.target.value)}
                placeholder="Gjenta passordet"
                disabled={status === "loading"}
                style={inputStyle}
                onFocus={goldFocus}
                onBlur={resetBorder}
                autoComplete="new-password"
              />
            </div>

            <button type="submit" disabled={status === "loading"} style={buttonStyle}>
              {status === "loading" ? "Starter reisen…" : "Start reisen"}
            </button>

            <div className="pt-1 text-center">
              <button
                type="button"
                onClick={() => switchView("login")}
                className="text-sm font-semibold"
                style={{ color: "rgba(255,255,255,0.7)", background: "none", border: "none", cursor: "pointer" }}
              >
                Har du allerede en konto? Logg inn
              </button>
            </div>
          </form>
        )}

        {/* Error */}
        {status === "error" && (
          <p className="text-center mt-4 text-sm" style={{ color: "rgba(255,80,80,0.8)" }}>
            {error}
          </p>
        )}
      </div>
    </main>
  );
}