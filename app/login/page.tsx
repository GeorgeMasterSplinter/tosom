"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import PremiumButton from "@/components/ui/PremiumButton";

// trigger rebuild
console.log("login rebuild");

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError("Skriv inn en gyldig e-postadresse.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await signIn("email", { email, callbackUrl: "/dashboard", redirect: false });
      setSent(true);
    } catch {
      setError("Kunne ikke sende innloggingslenke. Prøv igjen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="
      min-h-screen 
      flex flex-col 
      items-center 
      justify-start 
      pt-32 pb-24
      bg-[radial-gradient(circle_at_top,#112032,#0B1520,#070D14)]
      text-white
    ">

      {/* Logo / Header */}
      <div className="absolute top-10 left-10">
        <h1 className="
          text-3xl
          font-semibold
          tracking-wider
          text-[#D4AF37]
          drop-shadow-[0_0_10px_rgba(212,175,55,0.35)]
        ">
          ToSom
        </h1>
      </div>

      {/* Premium Glass Panel */}
      <div className="
        w-full max-w-md mx-auto
        bg-white/5
        border border-white/15
        backdrop-blur-2xl
        rounded-2xl
        p-12 mt-20
        shadow-[0_0_80px_rgba(0,0,0,0.45)]
        ring-1 ring-white/10
        space-y-10
      ">

        {/* Header */}
        <div className="text-center space-y-3">
          <h2 className="text-4xl font-semibold tracking-wide text-white/90">
            VELKOMMEN TILBAKE
          </h2>
          <p className="text-lg text-white/60 tracking-wider">
            {sent ? "Sjekk e-posten din for innloggingslenke." : "Logg inn for å fortsette reisen"}
          </p>
        </div>

        {/* Form */}
        {!sent ? (
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            {/* Input */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-white/80 tracking-wide">
                E-post eller telefonnummer
              </label>

              <div className="
                flex items-center
                bg-white/5
                border border-white/15
                rounded-xl
                px-5 py-4
                focus-within:border-[#D4AF37]
                focus-within:ring-1
                focus-within:ring-[#D4AF37]/40
                transition
              ">
                <span className="text-white/40 pr-3">✉️</span>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="du@eksempel.no eller +47 123 45 678"
                  className="
                    w-full
                    bg-transparent
                    text-white
                    placeholder-white/50
                    tracking-wide
                    focus:outline-none
                  "
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-[#FF4D4D]">{error}</p>
            )}

            {/* Buttons */}
            <div className="space-y-4 pt-2">
              <PremiumButton
                variant="primary"
                className="
                  w-full py-3 text-lg
                  bg-[#D4AF37]
                  hover:bg-[#c9a233]
                  text-black
                  font-semibold
                  tracking-wide
                  shadow-[0_0_20px_rgba(212,175,55,0.35)]
                "
              >
                {loading ? "Sender lenke…" : "Send innloggingslenke"}
              </PremiumButton>

              <button
                onClick={() => {
                  window.location.href = "/api/dev-login?userId=test-user-1";
                }}
                className="
                  w-full py-3 rounded-xl
                  bg-white/5
                  border border-white/15
                  text-white
                  hover:bg-white/10
                  hover:border-white/25
                  transition
                  text-lg
                  tracking-wide
                "
              >
                Logg inn som testbruker
              </button>
            </div>
          </form>
        ) : (
          /* Success state */
          <div className="text-center space-y-4">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="mx-auto">
              <path d="M3 8L10.5 15.5L21 6M5.5 19L9.5 15L13 18.5L21 10"
                stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="text-sm text-white/60">
              En innloggingslenke er sendt til{" "}
              <strong className="text-[#D4AF37]">{email}</strong>
            </p>
            <button
              onClick={() => setSent(false)}
              className="text-sm underline hover:no-underline transition-colors text-white/50"
            >
              Send til en annen e-post
            </button>
          </div>
        )}

      </div>
    </div>
  );
}