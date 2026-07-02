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

      {/* Premium Glass Container */}
      <div className="
        bg-white/5
        backdrop-blur-xl
        rounded-2xl
        shadow-xl shadow-black/30
        p-10 md:p-14
        max-w-3xl mx-auto
        flex flex-col gap-12
        text-white/80
        font-light tracking-wide leading-relaxed
        items-center text-center
        w-full
        mt-20
      ">

        {/* Header */}
        <div className="flex flex-col gap-6 items-center text-center">
          <h1 className="
            text-5xl md:text-7xl
            font-light
            tracking-wide
            text-[#D4AF37]
            text-center
          ">
            VELKOMMEN TILBAKE
          </h1>
          <p className="
            text-lg
            text-white/60
            tracking-wider
          ">
            {sent ? "Sjekk e-posten din for innloggingslenke." : "Logg inn for å fortsette reisen"}
          </p>
        </div>

        {/* Form */}
        {!sent ? (
          <div className="flex flex-col gap-6 items-center w-full max-w-md">
            {/* Input */}
            <div className="w-full flex flex-col gap-3 items-center">
              <label className="text-sm font-medium text-white/80 tracking-wide">
                E-post eller telefonnummer
              </label>

              <div className="
                w-full
                bg-white/5
                backdrop-blur-md
                rounded-xl
                px-6 py-4
                shadow-lg shadow-black/20
              ">
                <div className="flex items-center">
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
            </div>

            {error && (
              <p className="text-sm text-[#FF4D4D]">{error}</p>
            )}

            {/* Buttons */}
            <div className="flex flex-col gap-4 w-full">
              <button
                onClick={handleEmailSubmit}
                disabled={loading}
                className="
                  w-full text-center
                  px-5 py-3
                  rounded-xl
                  bg-[#D4AF37]/90
                  hover:bg-[#D4AF37]
                  text-black
                  font-light tracking-wide
                  shadow-lg shadow-black/40
                  transition-all duration-300
                "
              >
                {loading ? "Sender lenke…" : "Send innloggingslenke"}
              </button>

              <button
                onClick={() => {
                  window.location.href = "/api/dev-login?userId=test-user-1";
                }}
                className="
                  w-full py-3 rounded-xl
                  bg-white/10
                  hover:bg-white/20
                  text-white/80
                  transition-all duration-200
                "
              >
                Logg inn som testbruker
              </button>
            </div>
          </div>
        ) : (
          /* Success state */
          <div className="
            bg-white/5
            backdrop-blur-md
            rounded-xl
            p-6
            flex flex-col items-center text-center gap-3
            shadow-lg shadow-black/20
            max-w-md w-full
          ">
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