"use client";

/**
 * /glemt-passord (PL-07d)
 *
 * Epostfelt + rolig bekreftelse. Svaret fra API-et er alltid likt —
 * vi avslører aldri om e-posten er registrert.
 */

import { useState } from "react";
import { csrfFetch } from "@/lib/api/csrfClient";
import { ResonanceMark } from "@/components/branding/LogoVariants";

export default function GlemtPassordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || status === "loading") return;
    setStatus("loading");
    setError("");

    const res = await csrfFetch("/api/auth/request-reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim() }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setStatus("error");
      setError(data?.error ?? "Kunne ikke sende forespørsel. Prøv igjen senere.");
      return;
    }

    // Samme rolige bekreftelse uansett — vi avslører aldri om
    // e-posten finnes.
    setStatus("sent");
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

  const cardStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "24px",
    padding: "32px",
  };

  return (
    <main
      className="relative min-h-screen overflow-hidden flex items-start justify-center"
      style={{ paddingTop: "40px", paddingBottom: "60px" }}
    >
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ background: "linear-gradient(180deg, #0B1520 0%, #121E2E 40%, #0B1520 100%)" }}
      />

      <div
        className="absolute top-8 left-1/2 -translate-x-1/2 w-[700px] h-[500px] pointer-events-none opacity-20"
        style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(212,175,55,0.10), transparent 65%)" }}
      />

      <div className="relative z-10 w-full max-w-[480px] px-8 flex flex-col items-center">
        <div className="flex justify-center mb-10">
          <ResonanceMark size={80} strokeWidth={1.5} glow />
        </div>

        <div style={cardStyle}>
          {status === "sent" ? (
            <div className="text-center space-y-5 py-4">
              <h1 style={{ fontSize: "28px", fontWeight: 300, color: "#D4AF37", margin: 0 }}>
                Bekreftet
              </h1>
              <p style={{ fontSize: "16px", lineHeight: "1.7", color: "rgba(255,255,255,0.7)", margin: 0 }}>
                Om e-posten er registrert, vil du få en lenke på mail. Lenken er gyldig i én time.
              </p>
              <a
                href="/login"
                className="inline-block text-sm font-semibold underline"
                style={{ color: "rgba(212,175,55,0.9)" }}
              >
                Tilbake til innlogging
              </a>
            </div>
          ) : (
            <div className="space-y-5">
              <h1 style={{ fontSize: "28px", fontWeight: 300, color: "#D4AF37", margin: "0 0 4px 0" }}>
                Glemt passord
              </h1>
              <p style={{ fontSize: "15px", lineHeight: "1.7", color: "rgba(255,255,255,0.6)", margin: 0 }}>
                Skriv inn eposten du bruker på ToSom. Vi sender deg en lenke for å velge nytt passord.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="reset-email" className="sr-only">
                    Epost
                  </label>
                  <input
                    id="reset-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="din@epost.no"
                    disabled={status === "loading"}
                    style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.border = "1px solid rgba(212,175,55,0.5)")}
                    onBlur={(e) => (e.currentTarget.style.border = "1px solid rgba(255,255,255,0.1)")}
                    autoComplete="email"
                  />
                </div>

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
                  {status === "loading" ? "Sender…" : "Send lenke"}
                </button>
              </form>

              {status === "error" && (
                <p className="text-center text-sm" style={{ color: "rgba(255,80,80,0.8)" }}>
                  {error}
                </p>
              )}

              <p className="text-center">
                <a
                  href="/login"
                  className="text-sm"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  Tilbake til innlogging
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
