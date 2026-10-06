"use client";

import { useMemo, useState } from "react";
import { ResonanceMark } from "@/components/branding/LogoVariants";
import { csrfFetch } from "@/lib/api/csrfClient";

/**
 * ToSom — Samtykke (K-2)
 *
 * To separate, aktive avkrysninger:
 *  1) Vilkår og personvernerklæring
 *  2) Uttrykkelig samtykke til behandling av særlige kategorier (art. 9)
 *
 * Aldri forhåndsavkrysset. Knappen er deaktivert til begge er krysset.
 * Etter suksess: tilbake til onboarding, eller til ?next= om dashboardet
 * sendte en eksisterende bruker hit (valideres: må starte med "/", ikke "//").
 */

function resolveNextParam(raw: string | null): string {
  if (raw && raw.startsWith("/") && !raw.startsWith("//")) {
    return raw;
  }
  return "/onboarding";
}

export default function ConsentPage() {
  const [termsChecked, setTermsChecked] = useState(false);
  const [sensitiveChecked, setSensitiveChecked] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  const nextPath = useMemo(() => {
    if (typeof window === "undefined") return "/onboarding";
    return resolveNextParam(new URLSearchParams(window.location.search).get("next"));
  }, []);

  const bothChecked = termsChecked && sensitiveChecked;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bothChecked || status === "loading") return;
    setStatus("loading");
    setError("");

    const res = await csrfFetch("/api/consent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ terms: true, sensitive: true }),
    });

    if (!res.ok) {
      setStatus("error");
      setError("Kunne ikke lagre samtykket ditt. Prøv igjen.");
      return;
    }

    window.location.href = nextPath;
  };

  const checkboxRowStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "flex-start",
    gap: "14px",
    width: "100%",
    padding: "18px 20px",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.6)",
    borderRadius: "16px",
    cursor: "pointer",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "16px",
    lineHeight: "1.7",
    color: "rgba(255, 255, 255, 0.85)",
  };

  const linkStyle: React.CSSProperties = {
    color: "#D4AF37",
    textDecoration: "underline",
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
        <div className="flex justify-center mb-8">
          <ResonanceMark size={72} strokeWidth={1.5} glow resonate orbit />
        </div>

        <h1
          style={{
            fontSize: "36px",
            fontWeight: 300,
            color: "#D4AF37",
            letterSpacing: "-0.02em",
            lineHeight: "1.1",
            margin: 0,
            textAlign: "center",
          }}
        >
          Før vi begynner
        </h1>

        <p
          style={{
            fontSize: "16px",
            lineHeight: "1.7",
            color: "rgba(255, 255, 255, 0.6)",
            margin: "16px 0 0 0",
            textAlign: "center",
          }}
        >
          For å finne én match til deg, spør vi om ting som berører tro,
          hvem du søker, nærhet og trygghet. Det krever at du aktivt godtar
          vilkårene og gir et eget samtykke — vi spør deg om begge deler her.
        </p>

        <div
          className="w-full mt-6"
          style={{
            background: "rgba(212,175,55,0.05)",
            border: "1px solid rgba(212,175,55,0.16)",
            borderLeft: "3px solid rgba(212,175,55,0.55)",
            borderRadius: "12px",
            padding: "16px 18px",
          }}
        >
          <p style={{ fontSize: "13px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#D4AF37", margin: 0 }}>
            Dine svar
          </p>
          <p style={{ fontSize: "14px", lineHeight: "1.7", color: "rgba(255,255,255,0.65)", margin: "6px 0 0 0" }}>
            Brukes kun til å finne én match til deg. Profilen din er aldri
            offentlig. Du kan trekke samtykket tilbake når som helst ved å
            slette kontoen din under Innstillinger.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full mt-8 space-y-4">
          {/* Avkrysning 1 — vilkår og personvern */}
          <label style={checkboxRowStyle}>
            <input
              type="checkbox"
              checked={termsChecked}
              onChange={(e) => setTermsChecked(e.target.checked)}
              disabled={status === "loading"}
              style={{ width: "22px", height: "22px", marginTop: "2px", accentColor: "#D4AF37", flexShrink: 0 }}
            />
            <span style={labelStyle}>
              Jeg har lest og godtar{" "}
              <a href="/vilkar" style={linkStyle}>vilkårene</a> og{" "}
              <a href="/personvern" style={linkStyle}>personvernerklæringen</a>.
            </span>
          </label>

          {/* Avkrysning 2 — samtykke til særlige kategorier */}
          <label style={checkboxRowStyle}>
            <input
              type="checkbox"
              checked={sensitiveChecked}
              onChange={(e) => setSensitiveChecked(e.target.checked)}
              disabled={status === "loading"}
              style={{ width: "22px", height: "22px", marginTop: "2px", accentColor: "#D4AF37", flexShrink: 0 }}
            />
            <span style={labelStyle}>
              Jeg samtykker til at Tosom bruker svarene mine om religion, hvem
              jeg søker, nærhet og trygghet — kun for å finne én match til meg.
            </span>
          </label>

          {status === "error" && (
            <p style={{ fontSize: "15px", color: "#E0876A", margin: 0 }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={!bothChecked || status === "loading"}
            style={{
              width: "100%",
              height: "64px",
              borderRadius: "16px",
              fontWeight: 700,
              fontSize: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: bothChecked && status !== "loading" ? "pointer" : "not-allowed",
              background: bothChecked ? "#D4AF37" : "rgba(212,175,55,0.25)",
              color: bothChecked ? "#0B1520" : "rgba(255,255,255,0.6)",
              transition: "background 300ms, color 300ms",
            }}
          >
            {status === "loading" ? "Lager vi…" : "Jeg godtar og fortsetter"}
          </button>
        </form>
      </div>
    </main>
  );
}
