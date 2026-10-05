"use client";

/**
 * /nytt-passord (PL-07e)
 *
 * Mottar ?email=…&token=… fra e-postlenken. Passord to ganger,
 * minst 10 tegn. Etter suksess: rett til innlogging.
 * Manglende parametere → «Lenken er ikke gyldig».
 */

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { csrfFetch } from "@/lib/api/csrfClient";
import { ResonanceMark } from "@/components/branding/LogoVariants";

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

const buttonStyle: React.CSSProperties = {
  width: "100%",
  height: "64px",
  borderRadius: "16px",
  fontWeight: 700,
  fontSize: "18px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "none",
  background: "linear-gradient(135deg, #D4AF37, #E8C766)",
  color: "#0B1520",
  transition: "all 300ms ease-out",
};

function InvalidLinkCard() {
  return (
    <div style={cardStyle} className="text-center space-y-5 py-8">
      <h1 style={{ fontSize: "28px", fontWeight: 300, color: "#D4AF37", margin: 0 }}>
        Lenken er ikke gyldig
      </h1>
      <p style={{ fontSize: "16px", lineHeight: "1.7", color: "rgba(255,255,255,0.7)", margin: 0 }}>
        Denne lenken mangler informasjon, eller er ikke lenger gyldig. Lenken er kun gyldig i én time.
      </p>
      <a
        href="/glemt-passord"
        className="inline-block text-sm font-semibold underline"
        style={{ color: "rgba(212,175,55,0.9)" }}
      >
        Be om ny lenke
      </a>
    </div>
  );
}

function NyttPassordForm({ email, token }: { email: string; token: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !passwordRepeat || status === "loading") return;
    if (password.length < 10) {
      setStatus("error");
      setError("Passordet må være minst 10 tegn.");
      return;
    }
    if (password !== passwordRepeat) {
      setStatus("error");
      setError("Passordene er ikke like.");
      return;
    }

    setStatus("loading");
    setError("");

    const res = await csrfFetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, token, password }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setStatus("error");
      setError(data?.error ?? "Noe gikk galt. Prøv igjen.");
      return;
    }

    // Passordet er satt — alle tidligere sesjoner er slettet.
    router.push("/login");
  };

  return (
    <div style={cardStyle} className="space-y-5">
      <h1 style={{ fontSize: "28px", fontWeight: 300, color: "#D4AF37", margin: "0 0 4px 0" }}>
        Nytt passord
      </h1>
      <p style={{ fontSize: "15px", lineHeight: "1.7", color: "rgba(255,255,255,0.6)", margin: 0 }}>
        Velg et nytt passord med minst 10 tegn.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="np-password" className="sr-only">
            Nytt passord (minst 10 tegn)
          </label>
          <input
            id="np-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nytt passord (minst 10 tegn)"
            disabled={status === "loading"}
            style={inputStyle}
            onFocus={(e) => (e.currentTarget.style.border = "1px solid rgba(212,175,55,0.5)")}
            onBlur={(e) => (e.currentTarget.style.border = "1px solid rgba(255,255,255,0.1)")}
            autoComplete="new-password"
          />
        </div>
        <div>
          <label htmlFor="np-password-repeat" className="sr-only">
            Gjenta passord
          </label>
          <input
            id="np-password-repeat"
            type="password"
            value={passwordRepeat}
            onChange={(e) => setPasswordRepeat(e.target.value)}
            placeholder="Gjenta passordet"
            disabled={status === "loading"}
            style={inputStyle}
            onFocus={(e) => (e.currentTarget.style.border = "1px solid rgba(212,175,55,0.5)")}
            onBlur={(e) => (e.currentTarget.style.border = "1px solid rgba(255,255,255,0.1)")}
            autoComplete="new-password"
          />
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          style={{
            ...buttonStyle,
            cursor: status === "loading" ? "wait" : "pointer",
            opacity: status === "loading" ? 0.6 : 1,
            background: status === "loading" ? "rgba(212,175,55,0.3)" : undefined,
          }}
        >
          {status === "loading" ? "Lagrer…" : "Lagre nytt passord"}
        </button>
      </form>

      {status === "error" && (
        <p className="text-center text-sm" style={{ color: "rgba(255,80,80,0.8)" }}>
          {error}
        </p>
      )}
    </div>
  );
}

function InnerPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const token = searchParams.get("token") ?? "";

  if (!email || !token) return <InvalidLinkCard />;
  return <NyttPassordForm email={email} token={token} />;
}

export default function NyttPassordPage() {
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

        <Suspense fallback={null}>
          <InnerPage />
        </Suspense>
      </div>
    </main>
  );
}
